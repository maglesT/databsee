// The core app's API for slice A2: sign-on to the core screens, employees, passwords, lockout alerts and the
// permission register. Slice A3 adds the OIDC provider for the products on the same password check.
import { createHash, randomBytes } from 'node:crypto';
import cookie from '@fastify/cookie';
import formbody from '@fastify/formbody';
import fastifyStatic from '@fastify/static';
import Fastify, { type FastifyInstance, type FastifyReply, type FastifyRequest } from 'fastify';
import type { Sql, TransactionSql } from 'postgres';
import { z } from 'zod';
import { POLICY } from './config.js';
import type { SendMail } from './mail.js';
import { hashPassword, passwordProblem, temporaryPassword, verifyPassword } from './passwords.js';
import { buildProvider, type OidcSettings } from './oidc.js';
import { registerMasterData } from './master-data.js';

export interface Deps {
  sql: Sql;
  sendMail: SendMail | null;
  securityContact: string | null;
  secureCookies: boolean;
  webRoot?: string;             // built screens (vite build); omitted in API-only tests
  oidc?: OidcSettings;          // single sign-on for the products (slice A3)
  md?: Sql;                     // master_data database as core_app (slice A4)
}

interface Me { id: string; login: string; fullName: string; roles: string[]; mustChange: boolean }
declare module 'fastify' { interface FastifyRequest { me?: Me } }

const SESSION_COOKIE = 'sid';
const sessionKey = (sid: string) => createHash('sha256').update(sid).digest('base64url');
const reason = z.string().trim().min(1, 'A reason is required.');

export class HttpError extends Error { constructor(readonly status: number, message: string) { super(message); } }

/** PL-01: the employee's core roles, only if active, unlocked and holding a password. */
async function loadMe(sql: Sql | TransactionSql, employeeId: string): Promise<Me | null> {
  const [row] = await sql<{ id: string; login: string; full_name: string; roles: string[]; must_change: boolean }[]>`
    select e.id, e.login, e.full_name,
      coalesce((select array_agg(g.role order by g.role) from current_grant g where g.employee_id = e.id and g.product = 'core'), '{}') as roles,
      (c.must_change or c.changed_at < now() - make_interval(days => ${POLICY.passwordMaxAgeDays})) as must_change
    from employee_current e join credential c on c.employee_id = e.id
    where e.id = ${employeeId} and e.active and c.locked_at is null`;
  return row ? { id: row.id, login: row.login, fullName: row.full_name, roles: row.roles, mustChange: row.must_change } : null;
}

/**
 * The one password check for every sign-on (core screens now, products through OIDC in A3).
 * PL-04: counts failures; at the limit locks the account, raises the on-screen alert and emails the site security
 * contact at once (D-03). Returns the employee id on success.
 */
export async function checkPassword(deps: Deps, login: string, password: string, product = 'core'): Promise<string | null> {
  const { sql } = deps;
  let lockedNow: { id: string; login: string; message: string; alertId: string } | null = null;
  const result = await sql.begin(async (tx) => {
    const [row] = await tx<{ id: string; hash: string; failed: number; locked: boolean; active: boolean }[]>`
      select e.id, c.password_hash as hash, c.failed_count as failed, c.locked_at is not null as locked, e.active
      from employee_current e join credential c on c.employee_id = e.id where e.login = ${login} for update of c`;
    if (!row) {
      await tx`insert into credential_event (login, kind, product) values (${login}, 'signon_failed', ${product})`;
      return null;
    }
    if (!row.active || row.locked || !(await verifyPassword(password, row.hash))) {
      await tx`insert into credential_event (employee_id, login, kind, product) values (${row.id}, ${login}, 'signon_failed', ${product})`;
      if (row.active && !row.locked) {
        const failed = row.failed + 1;
        if (failed >= POLICY.maxFailedAttempts) {
          await tx`update credential set failed_count = ${failed}, locked_at = now() where employee_id = ${row.id}`;
          await tx`delete from session where employee_id = ${row.id}`;
          await tx`insert into credential_event (employee_id, login, kind, product) values (${row.id}, ${login}, 'locked', ${product})`;
          const message = `Account ${login} was locked after ${failed} failed password attempts (last via ${product}).`;
          const [a] = await tx<{ id: string }[]>`insert into alert (kind, employee_id, message) values ('account_locked', ${row.id}, ${message}) returning id::text`;
          lockedNow = { id: row.id, login, message, alertId: a!.id };
        } else {
          await tx`update credential set failed_count = ${failed} where employee_id = ${row.id}`;
        }
      }
      return null;
    }
    await tx`update credential set failed_count = 0 where employee_id = ${row.id}`;
    await tx`insert into credential_event (employee_id, login, kind, product) values (${row.id}, ${login}, 'signon_ok', ${product})`;
    return row.id;
  });
  if (lockedNow) await emailAlert(deps, lockedNow);
  return result;
}

async function emailAlert(deps: Deps, a: { message: string; alertId: string }) {
  if (!deps.sendMail || !deps.securityContact) {
    await deps.sql`update alert set email_error = 'no security contact or mail server configured' where id = ${a.alertId}`;
    return;
  }
  try {
    await deps.sendMail({ to: deps.securityContact, subject: '[Medhanta] Account locked', text: `${a.message}\n\nCheck whether this was an attempt at unauthorised use.` });
    await deps.sql`update alert set emailed_at = now() where id = ${a.alertId}`;
  } catch (e) {
    await deps.sql`update alert set email_error = ${String(e)} where id = ${a.alertId}`;
  }
}

async function setOwnPassword(sql: Sql, me: { id: string; login: string; fullName: string }, next: string) {
  const hash = await hashPassword(next);
  await sql.begin(async (tx) => {
    await tx`update credential set password_hash = ${hash}, must_change = false, changed_at = now() where employee_id = ${me.id}`;
    await tx`insert into credential_event (employee_id, login, kind, by_id, by_name) values (${me.id}, ${me.login}, 'changed', ${me.id}, ${me.fullName})`;
  });
}

const esc = (v: string) => v.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/** The sign-in page a product sends people to (server-rendered: works without JavaScript). */
function signInPage(product: string, uid: string, o: { error?: string; login?: string; change?: boolean; reauth?: boolean }) {
  const field = (label: string, name: string, type: string, value = '') =>
    `<label>${label}<input name="${name}" type="${type}" value="${esc(value)}" required></label>`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Sign in - Medhanta</title><style>
body{margin:0;font-family:system-ui,sans-serif;background:#f7f8fa;color:#1d2330}form{max-width:360px;margin:60px auto;background:#fff;border:1px solid #e3e6ec;border-radius:8px;padding:20px}
label{display:block;margin:10px 0;font-size:14px}input{display:block;width:100%;box-sizing:border-box;padding:7px;margin-top:4px;border:1px solid #e3e6ec;border-radius:6px;font:inherit}
button{margin-top:8px;padding:7px 14px;border-radius:6px;border:0;background:#2457c5;color:#fff;font:inherit}.e{color:#b42318}.m{color:#667085;font-size:14px}</style></head><body>
<form method="post" action="/interaction/${esc(uid)}/login">
<h2>Sign in to ${esc(product)}</h2>
${o.reauth ? '<p class="m">Enter your password again to confirm it is you.</p>' : ''}
${o.change ? '<p class="m">Your password is temporary or has expired. Choose a new one (at least 10 characters).</p>' : ''}
${field('Login ID', 'login', 'text', o.login)}
${field(o.change ? 'Current password' : 'Password', 'password', 'password')}
${o.change ? field('New password', 'next', 'password') + field('New password again', 'repeat', 'password') : ''}
${o.error ? `<p class="e" role="alert">${esc(o.error)}</p>` : ''}
<button>${o.change ? 'Change password and sign in' : 'Sign in'}</button></form></body></html>`;
}

export function csv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return '';
  const cols = Object.keys(rows[0]!);
  const cell = (v: unknown) => {
    const s = v instanceof Date ? v.toISOString() : v === null || v === undefined ? '' : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cols.join(','), ...rows.map((r) => cols.map((c) => cell(r[c])).join(','))].join('\n') + '\n';
}

export function buildApp(deps: Deps) {
  const { sql } = deps;
  const app = Fastify({ logger: false });
  app.register(cookie);
  if (deps.webRoot) app.register(fastifyStatic, { root: deps.webRoot });
  if (deps.oidc) mountSignOn(app, deps, deps.oidc);

  app.setErrorHandler((err, _req, reply) => {
    if (err instanceof HttpError) return reply.code(err.status).send({ error: err.message });
    if (err instanceof z.ZodError) return reply.code(400).send({ error: err.issues.map((i) => i.message).join(' ') });
    const code = (err as { code?: string }).code;
    if (code === '23505') return reply.code(409).send({ error: 'Already exists.' });
    if (code === '23514' || code === '23502' || code === '23503') return reply.code(400).send({ error: 'A required value is missing or invalid.' });
    reply.code(500).send({ error: 'Internal error.' });
  });

  // Session check for every /api route except sign-on. Idle sessions end (PL-01); a temporary or expired password
  // allows only the password change (PL-04).
  app.addHook('preHandler', async (req: FastifyRequest) => {
    if (!req.url.startsWith('/api/') || req.url === '/api/login') return;
    const sid = req.cookies[SESSION_COOKIE];
    if (!sid) throw new HttpError(401, 'Please sign in.');
    const [s] = await sql<{ employee_id: string }[]>`
      update session set last_seen_at = now()
      where id = ${sessionKey(sid)} and last_seen_at > now() - make_interval(mins => ${POLICY.sessionIdleMinutes})
      returning employee_id`;
    const me = s && (await loadMe(sql, s.employee_id));
    if (!me) throw new HttpError(401, 'Please sign in.');
    req.me = me;
    if (me.mustChange && !['/api/me', '/api/me/password', '/api/logout'].includes(req.url)) {
      throw new HttpError(403, 'Change your password first.');
    }
  });

  const need = (req: FastifyRequest, role: string) => {
    if (!req.me!.roles.includes(role)) throw new HttpError(403, 'You do not have the right for this.');
    return req.me!;
  };

  app.post('/api/login', async (req, reply: FastifyReply) => {
    const b = z.object({ login: z.string().trim().toLowerCase(), password: z.string() }).parse(req.body);
    const id = await checkPassword(deps, b.login, b.password);
    if (!id) throw new HttpError(401, 'Wrong login or password, or the account is locked or inactive.');
    const sid = randomBytes(32).toString('base64url');
    await sql`insert into session (id, employee_id) values (${sessionKey(sid)}, ${id})`;
    reply.setCookie(SESSION_COOKIE, sid, { path: '/', httpOnly: true, sameSite: 'strict', secure: deps.secureCookies });
    return loadMe(sql, id);
  });

  app.post('/api/logout', async (req, reply) => {
    await sql`delete from session where id = ${sessionKey(req.cookies[SESSION_COOKIE]!)}`;
    reply.clearCookie(SESSION_COOKIE, { path: '/' });
    return { ok: true };
  });

  app.get('/api/me', async (req) => req.me);

  app.post('/api/me/password', async (req) => {
    const me = req.me!;
    const b = z.object({ current: z.string(), next: z.string() }).parse(req.body);
    const problem = passwordProblem(b.next, me.login);
    if (problem) throw new HttpError(400, problem);
    if (b.current === b.next) throw new HttpError(400, 'The new password must differ from the current one.');
    if (!(await checkPassword(deps, me.login, b.current))) throw new HttpError(401, 'Current password is wrong.');
    await setOwnPassword(sql, me, b.next);
    return { ok: true };
  });

  // ---- Employees (identity_admin) ----
  app.get('/api/employees', async (req) => {
    need(req, 'identity_admin');
    return sql`select e.id, e.login, e.full_name as "fullName", e.email, e.active, e.version, c.locked_at as "lockedAt"
      from employee_current e left join credential c on c.employee_id = e.id order by e.login`;
  });

  // PL-03: a new login; identity verified (by this admin, how stated). Returns a temporary password, shown once.
  app.post('/api/employees', async (req) => {
    const me = need(req, 'identity_admin');
    const b = z.object({
      login: z.string().trim().toLowerCase(), fullName: z.string().trim().min(1, 'Full name is required.'),
      email: z.string().trim().email().nullable().optional(),
      identityVerifiedHow: z.string().trim().min(1, 'State how the identity was verified.'), reason,
    }).parse(req.body);
    const temp = temporaryPassword();
    const hash = await hashPassword(temp);
    const id = await sql.begin(async (tx) => {
      const [e] = await tx<{ id: string }[]>`insert into employee (login, identity_verified_by, identity_verified_how)
        values (${b.login}, ${me.fullName}, ${b.identityVerifiedHow}) returning id`;
      await tx`insert into employee_version (employee_id, version, full_name, email, active, changed_by, changed_by_name, reason)
        values (${e!.id}, 1, ${b.fullName}, ${b.email ?? null}, true, ${me.id}, ${me.fullName}, ${b.reason})`;
      await tx`insert into credential (employee_id, password_hash, must_change) values (${e!.id}, ${hash}, true)`;
      await tx`insert into credential_event (employee_id, login, kind, by_id, by_name, reason) values (${e!.id}, ${b.login}, 'reset', ${me.id}, ${me.fullName}, 'new employee')`;
      return e!.id;
    });
    return { id, temporaryPassword: temp };
  });

  // PL-06: a change is a new version with a reason. Deactivation ends every sign-on (PL-01).
  app.patch('/api/employees/:id', async (req) => {
    const me = need(req, 'identity_admin');
    const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
    const b = z.object({
      fullName: z.string().trim().min(1).optional(), email: z.string().trim().email().nullable().optional(),
      active: z.boolean().optional(), reason,
    }).parse(req.body);
    if (id === me.id && b.active === false) throw new HttpError(400, 'You cannot deactivate yourself.');
    await sql.begin(async (tx) => {
      const [cur] = await tx<{ full_name: string; email: string | null; active: boolean; version: number }[]>`
        select full_name, email, active, version from employee_current where id = ${id} for update`;
      if (!cur) throw new HttpError(404, 'No such employee.');
      await tx`insert into employee_version (employee_id, version, full_name, email, active, changed_by, changed_by_name, reason)
        values (${id}, ${cur.version + 1}, ${b.fullName ?? cur.full_name}, ${b.email === undefined ? cur.email : b.email},
                ${b.active ?? cur.active}, ${me.id}, ${me.fullName}, ${b.reason})`;
      if (b.active === false) await tx`delete from session where employee_id = ${id}`;
    });
    return { ok: true };
  });

  // PL-04: reset = new temporary password (also unlocks). Never for oneself, so no admin knows a usable password
  // of anyone, including their own reset one (11.200(a)(3)).
  app.post('/api/employees/:id/reset-password', async (req) => {
    const me = need(req, 'identity_admin');
    const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
    const b = z.object({ reason }).parse(req.body);
    if (id === me.id) throw new HttpError(400, 'Another administrator must reset your password.');
    const temp = temporaryPassword();
    const hash = await hashPassword(temp);
    await sql.begin(async (tx) => {
      const [e] = await tx<{ login: string }[]>`select login from employee where id = ${id}`;
      if (!e) throw new HttpError(404, 'No such employee.');
      await tx`update credential set password_hash = ${hash}, must_change = true, changed_at = now(), failed_count = 0, locked_at = null where employee_id = ${id}`;
      await tx`delete from session where employee_id = ${id}`;
      await tx`insert into credential_event (employee_id, login, kind, by_id, by_name, reason) values (${id}, ${e.login}, 'reset', ${me.id}, ${me.fullName}, ${b.reason})`;
    });
    return { temporaryPassword: temp };
  });

  // PL-06: the full history of one person (versions, grants, credential events).
  app.get('/api/employees/:id/history', async (req) => {
    need(req, 'identity_admin');
    const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
    const [employee] = await sql`select * from employee_current where id = ${id}`;
    if (!employee) throw new HttpError(404, 'No such employee.');
    return {
      employee,
      versions: await sql`select * from employee_version where employee_id = ${id} order by version`,
      grants: await sql`select product, role, granted, by_name, at, reason from grant_event where employee_id = ${id} order by id`,
      credentialEvents: await sql`select kind, product, by_name, reason, at from credential_event where employee_id = ${id} order by id`,
    };
  });

  // ---- Permission register (identity_admin) ----
  app.get('/api/roles', async (req) => { need(req, 'identity_admin'); return sql`select * from product_role order by product, role`; });

  app.get('/api/grants', async (req) => {
    need(req, 'identity_admin');
    return sql`select g.employee_id as "employeeId", e.login, e.full_name as "fullName", g.product, g.role, g.granted_by as "grantedBy", g.granted_at as "grantedAt"
      from current_grant g join employee_current e on e.id = g.employee_id order by g.product, e.login, g.role`;
  });

  // PL-01/PL-02: grant or revoke one role; an insert-only event with who, when and why.
  app.post('/api/grants', async (req) => {
    const me = need(req, 'identity_admin');
    const b = z.object({ employeeId: z.string().uuid(), product: z.string(), role: z.string(), granted: z.boolean(), reason }).parse(req.body);
    await sql.begin(async (tx) => {
      const [has] = await tx`select 1 from current_grant where employee_id = ${b.employeeId} and product = ${b.product} and role = ${b.role}`;
      if (Boolean(has) === b.granted) throw new HttpError(409, b.granted ? 'Already granted.' : 'Not granted.');
      await tx`insert into grant_event (employee_id, product, role, granted, by_id, by_name, reason)
        values (${b.employeeId}, ${b.product}, ${b.role}, ${b.granted}, ${me.id}, ${me.fullName}, ${b.reason})`;
    });
    return { ok: true };
  });

  if (deps.md) registerMasterData(app, deps.md, (req, roles) => {
    if (!roles.some((r) => req.me!.roles.includes(r))) throw new HttpError(403, 'You do not have the right for this.');
    return req.me!;
  });

  // ---- Alerts (identity_admin; shown on every core screen until acknowledged) ----
  app.get('/api/alerts', async (req) => {
    if (!req.me!.roles.includes('identity_admin')) return [];
    return sql`select id::text, kind, message, at, emailed_at as "emailedAt", email_error as "emailError" from alert where acknowledged_at is null order by id`;
  });

  app.post('/api/alerts/:id/ack', async (req) => {
    const me = need(req, 'identity_admin');
    const { id } = z.object({ id: z.string().regex(/^\d+$/) }).parse(req.params);
    await sql`update alert set acknowledged_by_name = ${me.fullName}, acknowledged_at = now() where id = ${id} and acknowledged_at is null`;
    return { ok: true };
  });

  // ---- Readable exports of the audit trail (PL-06, A11 9) ----
  app.get('/api/export/:what', async (req, reply) => {
    need(req, 'identity_admin');
    const { what } = z.object({ what: z.enum(['employee-history.csv', 'grant-history.csv', 'credential-events.csv']) }).parse(req.params);
    const rows =
      what === 'employee-history.csv'
        ? await sql`select e.login, v.version, v.full_name, v.email, v.active, v.changed_by_name, v.changed_at, v.reason
            from employee_version v join employee e on e.id = v.employee_id order by e.login, v.version`
        : what === 'grant-history.csv'
          ? await sql`select e.login, g.product, g.role, g.granted, g.by_name, g.at, g.reason
              from grant_event g join employee e on e.id = g.employee_id order by g.id`
          : await sql`select login, kind, product, by_name, reason, at from credential_event order by id`;
    reply.header('content-type', 'text/csv; charset=utf-8').header('content-disposition', `attachment; filename="${what}"`);
    return csv(rows as unknown as Record<string, unknown>[]);
  });

  return app;
}

/** Mounts the OIDC provider at /oidc and its sign-in page at /interaction (slice A3). */
function mountSignOn(app: FastifyInstance, deps: Deps, settings: OidcSettings) {
  const { sql } = deps;
  const provider = buildProvider(sql, settings);
  const callback = provider.callback();
  const mountPath = new URL(settings.issuer).pathname.replace(/\/$/, '');

  // The provider reads its own request bodies: no Fastify body parsing on its routes.
  app.register(async (inst) => {
    inst.removeAllContentTypeParsers();
    inst.addContentTypeParser('*', (_req, _payload, done) => done(null));
    const handler = (req: FastifyRequest, reply: FastifyReply) => {
      reply.hijack();
      const raw = req.raw as typeof req.raw & { originalUrl?: string };
      raw.originalUrl = raw.url;
      raw.url = raw.url!.slice(mountPath.length) || '/';
      void callback(raw, reply.raw);
    };
    inst.all(mountPath, handler);
    inst.all(`${mountPath}/*`, handler);
  });

  app.register(async (inst) => {
    inst.register(formbody);
    inst.get('/interaction/:uid', async (req, reply) => {
      const d = await provider.interactionDetails(req.raw, reply.raw);
      const reauth = d.prompt.name === 'login' && Boolean(d.session?.accountId);
      return reply.type('text/html').send(signInPage(String(d.params.client_id), d.uid, { reauth }));
    });

    inst.post('/interaction/:uid/login', async (req, reply) => {
      const d = await provider.interactionDetails(req.raw, reply.raw);
      const product = String(d.params.client_id);
      const b = (req.body ?? {}) as Record<string, string>;
      const login = (b.login ?? '').trim().toLowerCase();
      const show = (o: Parameters<typeof signInPage>[2]) => reply.type('text/html').send(signInPage(product, d.uid, { login, ...o }));

      const id = await checkPassword(deps, login, b.password ?? '', product);
      if (!id) return show({ error: 'Wrong login or password, or the account is locked or inactive.' });
      // PL-05: re-authentication (e.g. for an e-signature) confirms the person already signed in; nobody else may
      // answer it. Switching person needs a sign-out first.
      if (d.session?.accountId && d.prompt.name === 'login' && d.session.accountId !== id) {
        return show({ error: 'Only the person signed in can confirm here. To switch person, sign out first.', reauth: true, login: '' });
      }

      // PL-04: a temporary or expired password is changed here before the product gets anything.
      const [c] = await sql<{ full_name: string; must_change: boolean }[]>`
        select e.full_name, (c.must_change or c.changed_at < now() - make_interval(days => ${POLICY.passwordMaxAgeDays})) as must_change
        from employee_current e join credential c on c.employee_id = e.id where e.id = ${id}`;
      if (c!.must_change) {
        if (!b.next) return show({ change: true });
        const problem = b.next !== b.repeat ? 'The two new passwords differ.' : b.next === b.password ? 'The new password must differ.' : passwordProblem(b.next, login);
        if (problem) return show({ change: true, error: problem });
        await setOwnPassword(sql, { id, login, fullName: c!.full_name }, b.next);
      }

      // PL-01: only people with a role in this product get in.
      const [role] = await sql`select 1 from current_grant where employee_id = ${id} and product = ${product} limit 1`;
      if (!role) return show({ error: `You have no access to ${product}. Ask your administrator.` });

      reply.hijack();
      await provider.interactionFinished(req.raw, reply.raw, { login: { accountId: id } }, { mergeWithLastSubmission: false });
    });
  });
}

/** Creates the first identity administrator on an empty identity database (installation only). */
export async function createFirstAdmin(sql: Sql, login: string, fullName: string, verifiedHow: string): Promise<string> {
  const temp = temporaryPassword();
  const hash = await hashPassword(temp);
  await sql.begin(async (tx) => {
    const [row] = await tx<{ n: number }[]>`select count(*)::int as n from employee`;
    if (row!.n > 0) throw new Error('employees already exist; use the screens');
    const [e] = await tx<{ id: string }[]>`insert into employee (login, identity_verified_by, identity_verified_how)
      values (${login}, 'installer', ${verifiedHow}) returning id`;
    await tx`insert into employee_version (employee_id, version, full_name, active, changed_by_name, reason)
      values (${e!.id}, 1, ${fullName}, true, 'installer', 'first administrator at installation')`;
    await tx`insert into credential (employee_id, password_hash) values (${e!.id}, ${hash})`;
    await tx`insert into grant_event (employee_id, product, role, granted, by_name, reason)
      values (${e!.id}, 'core', 'identity_admin', true, 'installer', 'first administrator at installation')`;
  });
  return temp;
}
