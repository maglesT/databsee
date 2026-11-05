// The core app's API for slice A2: sign-on to the core screens, employees, passwords, lockout alerts and the
// permission register (permission-based since A10, D-16). Slice A3 adds the OIDC provider for the products on the same password check.
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
import { productInfo } from '../products.js';

export interface Deps {
  sql: Sql;
  sendMail: SendMail | null;
  securityContact: string | null;
  secureCookies: boolean;
  webRoot?: string;             // built screens (vite build); omitted in API-only tests
  oidc?: OidcSettings;          // single sign-on for the products (slice A3)
  md?: Sql;                     // master_data database as core_app (slice A4)
}

interface Me { id: string; login: string; fullName: string; permissions: string[]; mustChange: boolean }
declare module 'fastify' { interface FastifyRequest { me?: Me } }

const SESSION_COOKIE = 'sid';
const sessionKey = (sid: string) => createHash('sha256').update(sid).digest('base64url');
const reason = z.string().trim().min(1, 'A reason is required.');

/** core's own permission to manage people (seeded in the catalogue by db/identity/0004). */
export const PEOPLE = 'core.people.manage';

/**
 * PL-01/PL-02: sets one person's permissions in one product to exactly `codes`. Only the differences are written,
 * each as an insert-only grant or revoke event. Only codes in the catalogue can be granted.
 */
async function setPermissions(tx: TransactionSql, me: Me, employeeId: string, product: string, codes: string[], why: string) {
  const [e] = await tx`select 1 from employee where id = ${employeeId}`;
  if (!e) throw new HttpError(404, 'No such employee.');
  await tx`select pg_advisory_xact_lock(hashtext(${employeeId}))`;   // one change of a person's permissions at a time
  const offered = new Set((await tx<{ code: string }[]>`select code from current_permission where product = ${product}`).map((r) => r.code));
  const want = new Set(codes);
  if (employeeId === me.id && product === 'core' && !want.has(PEOPLE) && me.permissions.includes(PEOPLE))
    throw new HttpError(400, `You cannot remove your own ${PEOPLE}; ask another administrator.`);
  for (const c of want) if (!offered.has(c)) throw new HttpError(400, `${product} has no permission "${c}".`);
  const have = new Set((await tx<{ code: string }[]>`select code from current_permission_grant
    where employee_id = ${employeeId} and product = ${product}`).map((r) => r.code));
  const granted = [...want].filter((c) => !have.has(c)).sort();
  const revoked = [...have].filter((c) => !want.has(c)).sort();
  for (const [list, on] of [[granted, true], [revoked, false]] as const)
    for (const code of list)
      await tx`insert into permission_grant (employee_id, product, code, granted, by_id, by_name, reason)
        values (${employeeId}, ${product}, ${code}, ${on}, ${me.id}, ${me.fullName}, ${why})`;
  return { granted, revoked };
}

export class HttpError extends Error { constructor(readonly status: number, message: string) { super(message); } }

/** PL-01: the employee's core permissions, only if active, unlocked and holding a password. */
async function loadMe(sql: Sql | TransactionSql, employeeId: string): Promise<Me | null> {
  const [row] = await sql<{ id: string; login: string; full_name: string; permissions: string[]; must_change: boolean }[]>`
    select e.id, e.login, e.full_name,
      coalesce((select array_agg(g.code order by g.code) from current_permission_grant g where g.employee_id = e.id and g.product = 'core'), '{}') as permissions,
      (c.must_change or c.changed_at < now() - make_interval(days => ${POLICY.passwordMaxAgeDays})) as must_change
    from employee_current e join credential c on c.employee_id = e.id
    where e.id = ${employeeId} and e.active and c.locked_at is null`;
  return row ? { id: row.id, login: row.login, fullName: row.full_name, permissions: row.permissions, mustChange: row.must_change } : null;
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

const esc = (v: unknown) => String(v ?? '').replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/** The sign-in page a product sends people to (server-rendered: works without JavaScript), in the Medhanta look. */
function signInPage(product: string, uid: string, o: { error?: string; login?: string; change?: boolean; reauth?: boolean }) {
  const field = (label: string, name: string, type: string, value = '', auto = '') =>
    `<label>${label}<input name="${name}" type="${type}" value="${esc(value)}"${auto ? ` autocomplete="${auto}"` : ''} required></label>`;
  const p = productInfo(product);
  const title = o.reauth ? 'Confirm it is you' : o.change ? 'Choose a new password' : `Sign in to ${p.name}`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} - Medhanta</title><link rel="icon" type="image/png" href="/favicon.png"><style>
:root{--brand:#e8500f;--brand-dark:#c8410a;--grey:#5f5f5f;--muted:#666b73;--line:#d9d3ce;--bad:#c0352b;--grad:linear-gradient(90deg,#dd1a10,#f4511e 55%,#f7941d)}
*{box-sizing:border-box}body{margin:0;font-family:Inter,'Segoe UI',system-ui,-apple-system,Roboto,Arial,sans-serif;background:#faf8f6;color:#2b2b2b;-webkit-font-smoothing:antialiased}
main{max-width:420px;margin:0 auto;padding:7vh 20px 40px;text-align:center}.logo{width:250px;max-width:80%;height:auto}
form{text-align:left;background:#fff;border:1px solid #ebe7e4;border-radius:12px;padding:22px;margin-top:10px;box-shadow:0 1px 2px rgba(60,40,30,.05),0 4px 14px rgba(60,40,30,.06);position:relative;overflow:hidden}
form::before{content:'';position:absolute;left:0;right:0;top:0;height:4px;background:var(--grad)}
.for{margin:0 0 2px;color:var(--brand);font-size:.72rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase}h1{font-size:1.35rem;margin:0 0 6px}
label{display:grid;gap:5px;margin:12px 0;color:var(--muted);font-size:.88rem;font-weight:500}
input{font:inherit;padding:10px 12px;border:1px solid var(--line);border-radius:8px}input:focus{outline:none;border-color:var(--brand);box-shadow:0 0 0 3px rgba(232,80,15,.18)}
button{width:100%;margin-top:10px;padding:11px 16px;border-radius:8px;border:0;background:var(--brand);color:#fff;font:inherit;font-weight:600;cursor:pointer}button:hover{background:var(--brand-dark)}
.e{color:var(--bad);font-weight:500}.m{color:var(--muted);font-size:.9rem;margin:4px 0}footer{margin-top:16px;color:var(--muted);font-size:.8rem}</style></head><body><main>
<img class="logo" src="/medhanta-logo.png" alt="Medhanta: Where Expertise Meets Intelligence">
<form method="post" action="/interaction/${esc(uid)}/login">
<p class="for">${esc(p.name)}</p>
<h1>${esc(title)}</h1>
${o.reauth ? '<p class="m">Enter your password again to confirm it is you.</p>' : ''}
${o.change ? '<p class="m">Your password is temporary or has expired. Choose a new one (at least 10 characters).</p>' : ''}
${field('Login ID', 'login', 'text', o.login, 'username')}
${field(o.change ? 'Current password' : 'Password', 'password', 'password', '', 'current-password')}
${o.change ? field('New password', 'next', 'password', '', 'new-password') + field('New password again', 'repeat', 'password', '', 'new-password') : ''}
${o.error ? `<p class="e" role="alert">${esc(o.error)}</p>` : ''}
<button>${o.change ? 'Change password and sign in' : o.reauth ? 'Confirm' : 'Sign in'}</button></form>
<footer>One Medhanta login for every application.</footer></main></body></html>`;
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

  const need = (req: FastifyRequest, ...codes: string[]) => {
    if (!codes.some((c) => req.me!.permissions.includes(c))) throw new HttpError(403, 'You do not have the right for this.');
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

  // "Your applications": the products this person holds at least one permission in and that sign on through core here
  // (an OIDC client of this site), with the address to open. Core itself is not listed: its screens are in the menu.
  app.get('/api/my-apps', async (req) => {
    const clients = deps.oidc?.clients ?? [];
    if (!clients.length) return [];
    const held = new Set((await sql<{ product: string }[]>`
      select distinct product from current_permission_grant where employee_id = ${req.me!.id} and product <> 'core'`).map((r) => r.product));
    return clients
      .filter((c) => held.has(c.client_id) && c.redirect_uris[0])
      .map((c) => ({ product: c.client_id, url: new URL(c.redirect_uris[0]!).origin + '/' }))
      .sort((a, b) => a.product.localeCompare(b.product));
  });

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

  // ---- Employees (core.people.manage) ----
  app.get('/api/employees', async (req) => {
    need(req, PEOPLE);
    return sql`select e.id, e.login, e.full_name as "fullName", e.email, e.active, e.version, c.locked_at as "lockedAt"
      from employee_current e left join credential c on c.employee_id = e.id order by e.login`;
  });

  // PL-03: a new login; identity verified (by this admin, how stated). Returns a temporary password, shown once.
  app.post('/api/employees', async (req) => {
    const me = need(req, PEOPLE);
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
    const me = need(req, PEOPLE);
    const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
    const b = z.object({
      fullName: z.string().trim().min(1).optional(), email: z.string().trim().email().nullable().optional(),
      active: z.boolean().optional(), reason,
    }).parse(req.body);
    if (id === me.id && b.active === false) throw new HttpError(400, 'You cannot deactivate yourself.');
    await sql.begin(async (tx) => {
      await tx`select pg_advisory_xact_lock(hashtext(${id}))`;   // one change of a person at a time (no UPDATE right, D-17)
      const [cur] = await tx<{ full_name: string; email: string | null; active: boolean; version: number }[]>`
        select full_name, email, active, version from employee_current where id = ${id}`;
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
    const me = need(req, PEOPLE);
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
    need(req, PEOPLE);
    const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
    const [employee] = await sql`select * from employee_current where id = ${id}`;
    if (!employee) throw new HttpError(404, 'No such employee.');
    return {
      employee,
      versions: await sql`select * from employee_version where employee_id = ${id} order by version`,
      grants: await sql`select product, code, granted, by_name, at, reason from permission_grant where employee_id = ${id} order by id`,
      credentialEvents: await sql`select kind, product, by_name, reason, at from credential_event where employee_id = ${id} order by id`,
    };
  });

  // ---- Permission register (core.people.manage) ----
  // The catalogue: every permission the licensed products offer (loaded by apply from their manifests).
  app.get('/api/permissions', async (req) => {
    need(req, PEOPLE);
    return sql`select product, code, label from current_permission order by product, code`;
  });

  // One person's current permissions in every product.
  app.get('/api/employees/:id/permissions', async (req) => {
    need(req, PEOPLE);
    const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
    return sql`select product, code, granted_by as "grantedBy", granted_at as "grantedAt"
      from current_permission_grant where employee_id = ${id} order by product, code`;
  });

  // PL-01/PL-02: make one person's permissions in one product exactly the ticked set; a grant or revoke event with
  // who, when and why for each difference only.
  app.put('/api/employees/:id/permissions', async (req) => {
    const me = need(req, PEOPLE);
    const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
    const b = z.object({ product: z.string(), codes: z.array(z.string()), reason }).parse(req.body);
    return sql.begin((tx) => setPermissions(tx, me, id, b.product, b.codes, b.reason));
  });

  // Copy another person's permissions in one product: the target ends up with the same set.
  app.post('/api/employees/:id/permissions/copy', async (req) => {
    const me = need(req, PEOPLE);
    const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
    const b = z.object({ product: z.string(), fromId: z.string().uuid(), reason }).parse(req.body);
    return sql.begin(async (tx) => {
      const [from] = await tx<{ login: string }[]>`select login from employee_current where id = ${b.fromId} and active`;
      if (!from) throw new HttpError(404, 'No such active employee to copy from.');
      const codes = (await tx<{ code: string }[]>`select code from current_permission_grant where employee_id = ${b.fromId} and product = ${b.product}`).map((r) => r.code);
      return setPermissions(tx, me, id, b.product, codes, `${b.reason} (copied from ${from.login})`);
    });
  });

  if (deps.md) registerMasterData(app, deps.md, (req, codes) => need(req, ...codes));

  // ---- Alerts (core.people.manage; shown on every core screen until acknowledged) ----
  app.get('/api/alerts', async (req) => {
    if (!req.me!.permissions.includes(PEOPLE)) return [];
    return sql`select id::text, kind, message, at, emailed_at as "emailedAt", email_error as "emailError" from alert where acknowledged_at is null order by id`;
  });

  app.post('/api/alerts/:id/ack', async (req) => {
    const me = need(req, PEOPLE);
    const { id } = z.object({ id: z.string().regex(/^\d+$/) }).parse(req.params);
    await sql`update alert set acknowledged_by_name = ${me.fullName}, acknowledged_at = now() where id = ${id} and acknowledged_at is null`;
    return { ok: true };
  });

  // ---- Readable exports of the audit trail (PL-06, A11 9) ----
  app.get('/api/export/:what', async (req, reply) => {
    need(req, PEOPLE);
    const { what } = z.object({ what: z.enum(['employee-history.csv', 'grant-history.csv', 'credential-events.csv']) }).parse(req.params);
    const rows =
      what === 'employee-history.csv'
        ? await sql`select e.login, v.version, v.full_name, v.email, v.active, v.changed_by_name, v.changed_at, v.reason
            from employee_version v join employee e on e.id = v.employee_id order by e.login, v.version`
        : what === 'grant-history.csv'
          ? await sql`select e.login, g.product, g.code, g.granted, g.by_name, g.at, g.reason
              from permission_grant g join employee e on e.id = g.employee_id order by g.id`
          : await sql`select login, kind, product, by_name, reason, at from credential_event order by id`;
    reply.header('content-type', 'text/csv; charset=utf-8').header('content-disposition', `attachment; filename="${what}"`);
    return csv(rows as unknown as Record<string, unknown>[]);
  });

  // ---- Access review report (PL-12, A11 11): who has which permission in which product, and which links are on ----
  app.get('/api/access-review', async (req, reply) => {
    need(req, PEOPLE);
    const grants = await sql<{ login: string; full_name: string; active: boolean; product: string; code: string; label: string | null; granted_by: string; granted_at: Date; last_signon: Date | null }[]>`
      select e.login, e.full_name, e.active, g.product, g.code, p.label, g.granted_by, g.granted_at,
        (select max(c.at) from credential_event c
          where c.employee_id = g.employee_id and c.kind = 'signon_ok' and c.product = g.product) as last_signon
      from current_permission_grant g join employee_current e on e.id = g.employee_id
      left join current_permission p on p.code = g.code
      order by e.login, g.product, g.code`;
    const links = await sql<{ provider: string; consumer: string; view_name: string; switched_on_at: Date | null; change_ref: string | null }[]>`
      select provider, consumer, view_name, switched_on_at, change_ref from link_state order by consumer, provider, view_name`;
    const when = (d: Date | null) => (d ? d.toISOString().slice(0, 16).replace('T', ' ') : 'never');
    const table = (head: string[], rows: unknown[][]) => `<table><tr>${head.map((h) => `<th>${esc(h)}</th>`).join('')}</tr>${
      rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</table>`;
    reply.type('text/html').send(`<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Access review report</title>
<style>body{font:13px/1.4 system-ui,sans-serif;margin:24px;color:#1d2433}h1{font-size:20px}h2{font-size:15px;margin-top:24px}
table{border-collapse:collapse;width:100%}td,th{border:1px solid #d0d5dd;padding:4px 6px;text-align:left}.muted{color:#667085}
@media print{button{display:none}}</style></head><body>
<h1>Access review report</h1><p class="muted">Printed ${esc(when(new Date()))} UTC from the permission register. Reviewed by: ______________ Date: ________ Signature: ______________</p>
<button onclick="print()">Print</button>
<h2>Active permissions (${grants.length})</h2>${table(['Login', 'Name', 'Employee active', 'Product', 'Permission', 'Label', 'Granted by', 'Granted (UTC)', 'Last sign-in with password to product (UTC)'],
      grants.map((g) => [g.login, g.full_name, g.active ? 'yes' : 'NO', g.product, g.code, g.label ?? '', g.granted_by, when(g.granted_at), when(g.last_signon)]))}
<h2>Links and outside logins that are on, as recorded by the last apply (${links.length})</h2>${table(['Reader', 'Reads database', 'View', 'Switched on (UTC)', 'Change reference'],
      links.map((l) => [l.consumer, l.provider, l.view_name, when(l.switched_on_at), l.change_ref]))}
<p class="muted">Revoked permissions and switched-off links are not listed; their history is in the grant history export and each database's link log.</p>
</body></html>`);
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

      // PL-01: only people with a permission in this product get in.
      const [has] = await sql`select 1 from current_permission_grant where employee_id = ${id} and product = ${product} limit 1`;
      if (!has) return show({ error: `You have no access to ${product}. Ask your administrator.` });

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
    await tx`insert into permission_grant (employee_id, product, code, granted, by_name, reason)
      values (${e!.id}, 'core', ${PEOPLE}, true, 'installer', 'first administrator at installation')`;
  });
  return temp;
}
