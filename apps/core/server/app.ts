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
import { hashPassword, MIN_PASSWORD_LENGTH, needsRehash, PASSWORD_HISTORY, passwordProblem, TEMP_PASSWORD_HOURS, temporaryPassword, verifyPassword } from './passwords.js';
import { buildProvider, endSignOn, SIGN_ON_COOKIE, SIGN_ON_TTL_S, signOnAccount, signOnCookie, startSignOn, cookieSignature, type OidcSettings } from './oidc.js';
import { registerMasterData } from './master-data.js';
import { productInfo } from '../products.js';
import { loginFromName } from '../names.js';
import { plantTime } from '../time.js';
import { hashRecoveryCode, looksLikeRecoveryCode, matchTotp, newRecoveryCodes, newSecret, otpauthUri } from './mfa.js';
import QRCode from 'qrcode';
import { FailureLimiter, TOO_MANY } from './ratelimit.js';
import { linkReport, readLink } from './links.js';

export interface Deps {
  sql: Sql;
  sendMail: SendMail | null;
  securityContact: string | null;
  secureCookies: boolean;
  webRoot?: string;             // built screens (vite build); omitted in API-only tests
  oidc?: OidcSettings;          // single sign-on for the products (slice A3)
  md?: Sql;                     // master_data database as core_app (slice A4)
  mfaRequired?: string[];          // who must use two-step sign-in: 'all' or permission codes; default POLICY.mfaRequired
  loginFailuresPerMinute?: number; // per address; default POLICY.loginFailuresPerMinute
  links?: Record<string, Sql>;  // core's own links (customer config links.core): provider database -> pool as core_app (D-75)
}

interface Me { id: string; login: string; fullName: string; permissions: string[]; mustChange: boolean; mfa: boolean; mfaRequired: boolean }
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
  for (const c of want) if (!offered.has(c)) throw new HttpError(400, `${product} has no permission "${c}".`);
  const have = new Set((await tx<{ code: string }[]>`select code from current_permission_grant
    where employee_id = ${employeeId} and product = ${product}`).map((r) => r.code));
  const granted = [...want].filter((c) => !have.has(c)).sort();
  const revoked = [...have].filter((c) => !want.has(c)).sort();
  // GAP-PC-01: nobody grants or removes their own permissions (any product); another administrator does it.
  if (employeeId === me.id && (granted.length || revoked.length))
    throw new HttpError(403, "You can't change your own permissions; ask another administrator.");
  for (const [list, on] of [[granted, true], [revoked, false]] as const)
    for (const code of list)
      await tx`insert into permission_grant (employee_id, product, code, granted, by_id, by_name, reason)
        values (${employeeId}, ${product}, ${code}, ${on}, ${me.id}, ${me.fullName}, ${why})`;
  return { granted, revoked };
}

export class HttpError extends Error { constructor(readonly status: number, message: string) { super(message); } }

/** PL-01: the employee's core permissions, only if active, unlocked and holding a password. */
async function loadMe(sql: Sql | TransactionSql, employeeId: string, required: string[]): Promise<Me | null> {
  const [row] = await sql<{ id: string; login: string; full_name: string; permissions: string[]; must_change: boolean; mfa: boolean; mfa_required: boolean }[]>`
    select e.id, e.login, e.full_name,
      coalesce((select array_agg(g.code order by g.code) from current_permission_grant g where g.employee_id = e.id and g.product = 'core'), '{}') as permissions,
      (c.must_change or c.changed_at < now() - make_interval(days => ${POLICY.passwordMaxAgeDays})) as must_change,
      exists (select from mfa_factor f where f.employee_id = e.id and f.confirmed_at is not null) as mfa,
      (${required.includes('all')} or exists (select from current_permission_grant g where g.employee_id = e.id and g.code = any(${required}::text[]))) as mfa_required
    from employee_current e join credential c on c.employee_id = e.id
    where e.id = ${employeeId} and e.active
      and (c.locked_at is null or c.locked_at <= now() - make_interval(mins => ${POLICY.lockoutMinutes}))`;
  return row ? { id: row.id, login: row.login, fullName: row.full_name, permissions: row.permissions, mustChange: row.must_change, mfa: row.mfa, mfaRequired: row.mfa_required } : null;
}

/**
 * The one password check for every sign-on (core screens now, products through OIDC in A3).
 * PL-04: counts failures; at the limit locks the account, raises the on-screen alert and emails the site security
 * contact at once (D-03). Returns the employee id on success.
 */
export async function checkPassword(deps: Deps, login: string, password: string, product = 'core'): Promise<string | null> {
  const r = await signOnCheck(deps, login, password, product);
  return r && 'id' in r ? r.id : null;
}

/** The result of a sign-on check: the person, "the code is needed" (password right, two-step sign-in set up), or refused. */
export type SignOn = { id: string } | { mfaNeeded: true } | null;

/**
 * checkPassword plus the second step: with `second` given and an authenticator app set up, the 6-digit code (or a
 * recovery code) must follow the password. A wrong code counts like a wrong password. Without `second` (password
 * changes, e-signature re-entry) only the password is checked.
 */
export async function signOnCheck(deps: Deps, login: string, password: string, product = 'core', second?: { code: string }): Promise<SignOn> {
  const { sql } = deps;
  let lockedNow: { id: string; login: string; message: string; alertId: string } | null = null;
  const result = await sql.begin(async (tx): Promise<SignOn> => {
    const [row] = await tx<{ id: string; hash: string; failed: number; expired: boolean; locked: boolean; active: boolean }[]>`
      select e.id, c.password_hash as hash, c.failed_count as failed,
        (c.must_change and c.temp_expires_at < now()) as expired,
        (c.locked_at is not null and c.locked_at > now() - make_interval(mins => ${POLICY.lockoutMinutes})) as locked, e.active
      from employee_current e join credential c on c.employee_id = e.id where e.login = ${login} for update of c`;
    if (!row) {
      // Same work as a known login (no timing tell), and bounded rows: one per login per 10 minutes, 1000 an hour.
      await verifyPassword(password, await dummyHash());
      const [n] = await tx<{ same: number; all: number }[]>`select count(*) filter (where login = ${login} and at > now() - interval '10 minutes')::int as same, count(*)::int as all
        from credential_event where employee_id is null and at > now() - interval '1 hour'`;
      if (n!.same === 0 && n!.all < 1000) await tx`insert into credential_event (login, kind, product) values (${login.slice(0, 80)}, 'signon_failed', ${product})`;
      return null;
    }
    if (!row.locked && row.failed >= POLICY.maxFailedAttempts) {   // the lock ran out: start counting again
      await tx`update credential set failed_count = 0, locked_at = null where employee_id = ${row.id}`;
      row.failed = 0;
    }
    // MED-05: only failures within the last POLICY.lockoutMinutes count (after the last good sign-in, reset or unlock),
    // so wrong passwords spread over days never add up to a lock.
    if (!row.locked && row.failed > 0) {
      const [w] = await tx<{ n: number }[]>`select count(*)::int as n from credential_event
        where employee_id = ${row.id} and kind = 'signon_failed' and reason is null
          and at > now() - make_interval(mins => ${POLICY.lockoutMinutes})
          and at > coalesce((select max(at) from credential_event where employee_id = ${row.id}
            and kind in ('signon_ok', 'reset', 'changed', 'unlocked')), '-infinity')`;
      row.failed = Math.min(row.failed, w!.n);
    }
    const fail = async (): Promise<null> => {
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
    };
    if (!row.active || row.locked || !(await verifyPassword(password, row.hash))) return fail();
    if (row.expired) {   // right password, but a temporary one that ran out: the administrator gives a new one
      await tx`insert into credential_event (employee_id, login, kind, product, reason) values (${row.id}, ${login}, 'signon_failed', ${product}, 'temporary password expired')`;
      return null;
    }
    let how: string | null = null;
    if (second) {
      const [f] = await tx<{ secret: string; last_step: string }[]>`select secret, last_step::text from mfa_factor where employee_id = ${row.id} and confirmed_at is not null`;
      if (f) {
        const code = second.code.trim().toLowerCase();
        if (!code) return { mfaNeeded: true };
        if (looksLikeRecoveryCode(code)) {
          const [used] = await tx`update mfa_recovery_code set used_at = now() where id = (select id from mfa_recovery_code
            where employee_id = ${row.id} and code_hash = ${hashRecoveryCode(code)} and used_at is null limit 1) returning id`;
          if (!used) return fail();
          how = 'recovery code used';
        } else {
          const step = matchTotp(f.secret, code, Number(f.last_step));
          if (step === null) return fail();
          await tx`update mfa_factor set last_step = ${step} where employee_id = ${row.id}`;
        }
      }
    }
    // Old hashes are replaced by one at today's cost (same password, not a change of password).
    if (needsRehash(row.hash)) await tx`update credential set password_hash = ${await hashPassword(password)} where employee_id = ${row.id}`;
    await tx`update credential set failed_count = 0, locked_at = null where employee_id = ${row.id}`;
    await tx`insert into credential_event (employee_id, login, kind, product, reason) values (${row.id}, ${login}, 'signon_ok', ${product}, ${how})`;
    return { id: row.id };
  });
  if (lockedNow) await emailAlert(deps, lockedNow);
  return result;
}

/** Seconds the address must wait (and the Retry-After header set), or 0. */
function retryAfter(limiter: FailureLimiter, ip: string, reply: FastifyReply): number {
  const s = limiter.blockedFor(ip);
  if (s) reply.header('retry-after', String(s));
  // MED-05: the attempt counts as in flight until its answer is sent, so parallel requests cannot pass the limit
  // while their password hashes are still running.
  else reply.raw.once('close', limiter.begin(ip));
  return s;
}

let dummy: Promise<string> | undefined;
/** A hash at the current cost for logins that do not exist, so their check takes as long as a real one. */
const dummyHash = () => (dummy ??= hashPassword(randomBytes(12).toString('base64url')));

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

/** A message when the person used this password lately (current one or one of the last PASSWORD_HISTORY), else null. */
export async function passwordReuseProblem(sql: Sql, employeeId: string, next: string): Promise<string | null> {
  const rows = await sql<{ h: string }[]>`
    select password_hash as h from credential where employee_id = ${employeeId}
    union select h from (select password_hash as h from password_history where employee_id = ${employeeId} order by id desc limit ${PASSWORD_HISTORY}) x`;
  for (const r of rows) if (await verifyPassword(next, r.h)) return `Choose a password you have not used in your last ${PASSWORD_HISTORY}.`;
  return null;
}

async function setOwnPassword(sql: Sql, me: { id: string; login: string; fullName: string }, next: string) {
  const hash = await hashPassword(next);
  await sql.begin(async (tx) => {
    await tx`update credential set password_hash = ${hash}, must_change = false, temp_expires_at = null, changed_at = now() where employee_id = ${me.id}`;
    await tx`insert into password_history (employee_id, password_hash) values (${me.id}, ${hash})`;
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
<title>${esc(title)} - Medhanta</title><link rel="icon" type="image/svg+xml" href="/brand/favicon.svg"><link rel="apple-touch-icon" href="/brand/apple-touch-icon.png"><style>
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
<img class="logo" src="/brand/logo.svg" alt="Medhanta: Where Expertise Meets Intelligence">
<form method="post" action="/interaction/${esc(uid)}/login">
<p class="for">${esc(p.name)}</p>
<h1>${esc(title)}</h1>
${o.reauth ? '<p class="m">Enter your password again to confirm it is you.</p>' : ''}
${o.change ? '<p class="m">Your password is temporary or has expired. Choose a new one (at least ${MIN_PASSWORD_LENGTH} characters, not a common password).</p>' : ''}
${field('Login ID', 'login', 'text', o.login, 'username')}
${field(o.change ? 'Current password' : 'Password', 'password', 'password', '', 'current-password')}
${o.reauth ? '' : '<label>Authenticator code (only if you use two-step sign-in)<input name="code" inputmode="numeric" autocomplete="one-time-code" maxlength="11"></label>'}
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
  const app = Fastify({ logger: false, trustProxy: true });   // behind Caddy: the client address is the forwarded one
  const required = deps.mfaRequired ?? POLICY.mfaRequired;
  const limiter = new FailureLimiter(deps.loginFailuresPerMinute ?? POLICY.loginFailuresPerMinute);
  const waitFor = (ip: string, reply: FastifyReply) => retryAfter(limiter, ip, reply);
  app.register(cookie);
  // Only the built screens are served: no dotfiles (.env, .git/...) and no source maps; anything else unknown is a plain 404.
  if (deps.webRoot) app.register(fastifyStatic, { root: deps.webRoot, dotfiles: 'ignore', allowedPath: (p) => !p.endsWith('.map') && !p.split('/').some((x) => x.startsWith('.')) });
  app.setNotFoundHandler((_req, reply) => reply.code(404).type('text/plain; charset=utf-8').send('Not found'));
  const provider = deps.oidc ? buildProvider(sql, deps.oidc) : null;
  if (deps.oidc && provider) mountSignOn(app, deps, deps.oidc, provider, limiter, required);

  // One person per browser (PL-01): core's sign-in and the products' single sign-on start and end together.
  const signOnOpts = { path: '/', httpOnly: true, sameSite: 'lax' as const, secure: deps.secureCookies };
  const browserSignOn = (req: FastifyRequest) => (deps.oidc ? signOnCookie(deps.oidc.cookieKeys, req.cookies) : undefined);
  const setSignOn = (reply: FastifyReply, id: string) => {
    reply.setCookie(SIGN_ON_COOKIE, id, { ...signOnOpts, maxAge: SIGN_ON_TTL_S });
    reply.setCookie(`${SIGN_ON_COOKIE}.sig`, cookieSignature(deps.oidc!.cookieKeys[0]!, SIGN_ON_COOKIE, id), { ...signOnOpts, maxAge: SIGN_ON_TTL_S });
  };
  const clearSignOn = (reply: FastifyReply) => {
    reply.clearCookie(SIGN_ON_COOKIE, { path: '/' });
    reply.clearCookie(`${SIGN_ON_COOKIE}.sig`, { path: '/' });
  };
  const newSession = async (reply: FastifyReply, employeeId: string) => {
    const sid = randomBytes(32).toString('base64url');
    await sql`insert into session (id, employee_id) values (${sessionKey(sid)}, ${employeeId})`;
    reply.setCookie(SESSION_COOKIE, sid, { path: '/', httpOnly: true, sameSite: 'strict', secure: deps.secureCookies });
  };

  app.setErrorHandler((err, _req, reply) => {
    if (err instanceof HttpError) return reply.code(err.status).send({ error: err.message });
    if (err instanceof z.ZodError) return reply.code(400).send({ error: err.issues.map((i) => i.message).join(' ') });
    const code = (err as { code?: string }).code;
    if (code === '23505') return reply.code(409).send({ error: 'Already exists.' });
    if (code === '23514' || code === '23502' || code === '23503') return reply.code(400).send({ error: 'A required value is missing or invalid.' });
    reply.code(500).send({ error: 'Internal error.' });
  });

  // Session check for every /api route except sign-on. Idle sessions end (PL-01) and no session lasts longer than POLICY.sessionMaxHours; a temporary or expired password
  // allows only the password change (PL-04).
  app.addHook('preHandler', async (req: FastifyRequest, reply: FastifyReply) => {
    // Sign-out works with or without a live session: it must always end the single sign-on too.
    if (!req.url.startsWith('/api/') || req.url === '/api/login' || req.url === '/api/logout') return;
    const sid = req.cookies[SESSION_COOKIE];
    const [s] = sid ? await sql<{ employee_id: string }[]>`
      update session set last_seen_at = now()
      where id = ${sessionKey(sid)} and last_seen_at > now() - make_interval(mins => ${POLICY.sessionIdleMinutes})
        and created_at > now() - make_interval(hours => ${POLICY.sessionMaxHours})
      returning employee_id` : [];
    let me = s && (await loadMe(sql, s.employee_id, required));
    // Signed in through a product first: the same login opens the core screens (one login for every application).
    // Not when the core session was there and ran out (idle): then the password is asked again (GAP-PC-03).
    if (!me && provider && !sid) {
      const account = await signOnAccount(provider, browserSignOn(req));
      me = account ? await loadMe(sql, account, required) : undefined;
      if (me) await newSession(reply, me.id);
    }
    // Health (container check, monitors): open to everyone; the version only to a signed-in administrator.
    if (req.url === '/api/health') { req.me = me && !me.mustChange ? me : undefined; return; }
    // The first screen asks /api/session: signed out is an answer there (200, null), not an error in the browser console.
    if (!me && req.url === '/api/session') return;
    if (!me) throw new HttpError(401, 'Please sign in.');
    req.me = me;
    if (me.mustChange && !['/api/me', '/api/session', '/api/me/password', '/api/logout'].includes(req.url)) {
      throw new HttpError(403, 'Change your password first.');
    }
    // Two-step sign-in required at this site but not set up yet: only the set-up itself is open.
    if (me.mfaRequired && !me.mfa && !['/api/me', '/api/session', '/api/me/mfa/start', '/api/me/mfa/confirm', '/api/logout'].includes(req.url)) {
      throw new HttpError(403, 'Set up two-step sign-in first.');
    }
  });

  const need = (req: FastifyRequest, ...codes: string[]) => {
    if (!codes.some((c) => req.me!.permissions.includes(c))) throw new HttpError(403, 'You do not have the right for this.');
    return req.me!;
  };

  app.post('/api/login', async (req, reply: FastifyReply) => {
    const b = z.object({ login: z.string().trim().toLowerCase(), password: z.string(), code: z.string().optional() }).parse(req.body);
    if (waitFor(req.ip, reply)) throw new HttpError(429, TOO_MANY);
    const r = await signOnCheck(deps, b.login, b.password, 'core', { code: b.code ?? '' });
    if (r && 'mfaNeeded' in r) return reply.code(401).send({ error: 'Enter the 6-digit code from your authenticator app, or a recovery code.', mfa: true });
    if (!r) limiter.fail(req.ip);
    if (!r) throw new HttpError(401, 'Wrong login or password, or the account is locked or inactive.');
    const id = r.id;
    const old = req.cookies[SESSION_COOKIE];
    if (old) await sql`delete from session where id = ${sessionKey(old)}`;
    await newSession(reply, id);
    if (provider) {
      // The products' single sign-on follows: kept for the same person, ended (products told) for anyone else.
      const current = browserSignOn(req);
      if ((await signOnAccount(provider, current)) !== id) {
        await endSignOn(provider, sql, current);
        setSignOn(reply, await startSignOn(provider, id));
      }
    }
    return loadMe(sql, id, required);
  });

  app.post('/api/logout', async (req, reply) => {
    const sid = req.cookies[SESSION_COOKIE];
    if (sid) await sql`delete from session where id = ${sessionKey(sid)}`;
    reply.clearCookie(SESSION_COOKIE, { path: '/' });
    // PL-01: signing out of core signs the person out of every product on this browser, and the products are told.
    if (provider) {
      await endSignOn(provider, sql, browserSignOn(req));
      clearSignOn(reply);
    }
    return { ok: true };
  });

  app.get('/api/health', async (req) => (req.me?.permissions.includes(PEOPLE) ? { ok: true, version: process.env.MEDHANTA_VERSION ?? 'unknown' } : { ok: true }));

  app.get('/api/me', async (req) => req.me);
  // The same person, or null when signed out (no 401 on the first load before sign-in).
  app.get('/api/session', async (req) => ({ me: req.me ?? null }));

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

  app.post('/api/me/password', async (req, reply) => {
    const me = req.me!;
    if (waitFor(req.ip, reply)) throw new HttpError(429, TOO_MANY);
    const b = z.object({ current: z.string(), next: z.string() }).parse(req.body);
    const problem = passwordProblem(b.next, me.login);
    if (problem) throw new HttpError(400, problem);
    if (b.current === b.next) throw new HttpError(400, 'The new password must differ from the current one.');
    if (!(await checkPassword(deps, me.login, b.current))) { limiter.fail(req.ip); throw new HttpError(401, 'Current password is wrong.'); }
    const reused = await passwordReuseProblem(sql, me.id, b.next);
    if (reused) throw new HttpError(400, reused);
    await setOwnPassword(sql, me, b.next);
    return { ok: true };
  });

  // ---- Two-step sign-in (authenticator app), set up by the person from My account ----
  // Start: password again, then a new secret and the QR code (not active until the first code is confirmed).
  app.post('/api/me/mfa/start', async (req, reply) => {
    const me = req.me!;
    if (waitFor(req.ip, reply)) throw new HttpError(429, TOO_MANY);
    const b = z.object({ password: z.string() }).parse(req.body);
    if (me.mfa) throw new HttpError(409, 'Two-step sign-in is already set up.');
    if (!(await checkPassword(deps, me.login, b.password))) { limiter.fail(req.ip); throw new HttpError(401, 'Password is wrong.'); }
    const secret = newSecret();
    await sql`insert into mfa_factor (employee_id, secret) values (${me.id}, ${secret})
      on conflict (employee_id) do update set secret = ${secret}, created_at = now()`;
    const uri = otpauthUri(me.login, secret);
    return { secret, uri, qr: await QRCode.toString(uri, { type: 'svg', margin: 1 }) };
  });

  // Confirm: the first code from the app switches it on and shows the recovery codes once.
  app.post('/api/me/mfa/confirm', async (req, reply) => {
    const me = req.me!;
    if (waitFor(req.ip, reply)) throw new HttpError(429, TOO_MANY);
    const b = z.object({ code: z.string() }).parse(req.body);
    const codes = newRecoveryCodes();
    await sql.begin(async (tx) => {
      const [f] = await tx<{ secret: string }[]>`select secret from mfa_factor where employee_id = ${me.id} and confirmed_at is null for update`;
      const step = f && matchTotp(f.secret, b.code.trim(), 0);
      if (!f || step === null) { limiter.fail(req.ip); throw new HttpError(400, f ? 'That code is not right. Check the clock of your phone and try the next code.' : 'Start the set-up first.'); }
      await tx`update mfa_factor set confirmed_at = now(), last_step = ${step!} where employee_id = ${me.id}`;
      await tx`delete from mfa_recovery_code where employee_id = ${me.id}`;
      for (const c of codes) await tx`insert into mfa_recovery_code (employee_id, code_hash) values (${me.id}, ${hashRecoveryCode(c)})`;
      await tx`insert into credential_event (employee_id, login, kind, by_id, by_name) values (${me.id}, ${me.login}, 'mfa_enrolled', ${me.id}, ${me.fullName})`;
    });
    return { recoveryCodes: codes };
  });

  // Remove it again: password and a code are asked; not allowed where the site requires it.
  app.post('/api/me/mfa/disable', async (req, reply) => {
    const me = req.me!;
    if (waitFor(req.ip, reply)) throw new HttpError(429, TOO_MANY);
    if (me.mfaRequired) throw new HttpError(403, 'Your site requires two-step sign-in. Ask your administrator.');
    const b = z.object({ password: z.string(), code: z.string() }).parse(req.body);
    const r = await signOnCheck(deps, me.login, b.password, 'core', { code: b.code });
    if (!r || 'mfaNeeded' in r) { limiter.fail(req.ip); throw new HttpError(401, 'Password or code is wrong.'); }
    await sql.begin(async (tx) => {
      await tx`delete from mfa_factor where employee_id = ${me.id}`;
      await tx`delete from mfa_recovery_code where employee_id = ${me.id}`;
      await tx`insert into credential_event (employee_id, login, kind, by_id, by_name) values (${me.id}, ${me.login}, 'mfa_removed', ${me.id}, ${me.fullName})`;
    });
    return { ok: true };
  });

  // ---- Employees (core.people.manage) ----
  app.get('/api/employees', async (req) => {
    need(req, PEOPLE);
    return sql`select e.id, e.login, e.full_name as "fullName", e.email, e.active, e.version, case when c.locked_at > now() - make_interval(mins => ${POLICY.lockoutMinutes}) then c.locked_at end as "lockedAt",
      exists (select from mfa_factor f where f.employee_id = e.id and f.confirmed_at is not null) as mfa
      from employee_current e left join credential c on c.employee_id = e.id order by e.login`;
  });

  // PL-03: a new login; identity verified (by this admin, how stated). Returns a temporary password, shown once.
  app.post('/api/employees', async (req) => {
    const me = need(req, PEOPLE);
    const b = z.object({
      login: z.string().trim().toLowerCase(), fullName: z.string().trim().min(1, 'Full name is required.'),
      email: z.string().trim().email().nullable().optional(),
      identityVerifiedHow: z.string().trim().min(1, 'State how the identity was verified.'), reason,
      hireRef: z.string().trim().min(1).nullable().optional(),
    }).parse(req.body);
    // D-75, PL-08: a person picked from Recruitment's hires keeps the hire's reference; the hire must be there now.
    if (b.hireRef) {
      const r = await readLink(deps.links?.recruitment, (db) => db`select 1 from report.hire_v1 where candidate_ref = ${b.hireRef!}`);
      if (r.state !== 'on') throw new HttpError(400, `The link to TIDE is ${r.state}: add the person typed by hand, without the hire.`);
      if (!r.rows.length) throw new HttpError(400, 'No such hire in TIDE.');
    }
    const temp = temporaryPassword();
    const hash = await hashPassword(temp);
    const id = await sql.begin(async (tx) => {
      const [e] = await tx<{ id: string }[]>`insert into employee (login, identity_verified_by, identity_verified_how, hire_ref)
        values (${b.login}, ${me.fullName}, ${b.identityVerifiedHow}, ${b.hireRef ?? null}) returning id`;
      await tx`insert into employee_version (employee_id, version, full_name, email, active, changed_by, changed_by_name, reason)
        values (${e!.id}, 1, ${b.fullName}, ${b.email ?? null}, true, ${me.id}, ${me.fullName}, ${b.reason})`;
      await tx`insert into credential (employee_id, password_hash, must_change, temp_expires_at) values (${e!.id}, ${hash}, true, now() + make_interval(hours => ${TEMP_PASSWORD_HOURS}))`;
      await tx`insert into credential_event (employee_id, login, kind, by_id, by_name, reason) values (${e!.id}, ${b.login}, 'reset', ${me.id}, ${me.fullName}, 'new employee')`;
      return e!.id;
    });
    return { id, temporaryPassword: temp };
  });

  // D-75: "From Recruitment": hired candidates who are not employees yet (Recruitment's report.hire_v1), to pre-fill
  // "Add a person". Null-safe: state off (no link; the list is hidden) or down (typed by hand), never an error.
  // D-82: a hire is also left out when an active person already has the same full name (case and spaces ignored) or
  // the login made from that name (first.last); the email is pulled when hire_v1 gives one (read by name, so a
  // hire_v1 without an email column still works).
  app.get('/api/hires', async (req) => {
    need(req, PEOPLE);
    const r = await readLink(deps.links?.recruitment, (db) => db<{ candidateRef: string; fullName: string; email: string | null; jobTitle: string | null; department: string | null; joiningDate: string | null; hiredAt: Date | null }[]>`
      select h.candidate_ref as "candidateRef", h.full_name as "fullName", to_jsonb(h) ->> 'email' as email, h.job_title as "jobTitle",
        h.department, h.joining_date::text as "joiningDate", h.hired_at as "hiredAt"
      from report.hire_v1 h order by h.hired_at desc nulls last, h.full_name`);
    const people = await sql<{ hire_ref: string | null; login: string; full_name: string; active: boolean }[]>`
      select e.hire_ref, c.login, c.full_name, c.active from employee e join employee_current c on c.id = e.id`;
    const added = new Set(people.map((p) => p.hire_ref));
    const active = people.filter((p) => p.active);
    const logins = new Set(active.map((p) => p.login));
    const names = new Set(active.map((p) => sameName(p.full_name)));
    return {
      state: r.state,
      hires: r.rows.filter((h) => !added.has(h.candidateRef) && !names.has(sameName(h.fullName)) && !logins.has(loginFromName(h.fullName))),
    };
  });

  // D-76: the person's training from Recruitment (report.training_v1), shown beside the permissions. Read-only and
  // null-safe; it never blocks a grant.
  app.get('/api/employees/:id/training', async (req) => {
    need(req, PEOPLE);
    const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
    const r = await readLink(deps.links?.recruitment, (db) => db<{ skillCode: string; skillTitle: string; trainedOn: string; validUntil: string | null; qualified: boolean }[]>`
      select skill_code as "skillCode", skill_title as "skillTitle", trained_on::text as "trainedOn",
        valid_until::text as "validUntil", qualified
      from report.training_v1 where person_id = ${id} order by qualified desc, skill_code`);
    return { state: r.state, training: r.rows };
  });

  // D-79: the Links screen: every link the platform knows, on / off / down, checked now.
  app.get('/api/links', async (req) => {
    need(req, PEOPLE);
    const licensed = (deps.oidc?.clients ?? []).map((c) => c.client_id);
    return linkReport(sql, licensed, deps.links ?? {});
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
      await tx`update credential set password_hash = ${hash}, must_change = true, temp_expires_at = now() + make_interval(hours => ${TEMP_PASSWORD_HOURS}), changed_at = now(), failed_count = 0, locked_at = null where employee_id = ${id}`;
      await tx`delete from session where employee_id = ${id}`;
      await tx`insert into credential_event (employee_id, login, kind, by_id, by_name, reason) values (${id}, ${e.login}, 'reset', ${me.id}, ${me.fullName}, ${b.reason})`;
    });
    return { temporaryPassword: temp };
  });

  // The person lost their phone: removes their two-step sign-in (a required site makes them set it up again at the
  // next sign-in). Never for oneself; the reason is kept in the credential events.
  app.post('/api/employees/:id/mfa-reset', async (req) => {
    const me = need(req, PEOPLE);
    const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
    const b = z.object({ reason }).parse(req.body);
    if (id === me.id) throw new HttpError(400, 'Another administrator must reset your two-step sign-in.');
    await sql.begin(async (tx) => {
      const [e] = await tx<{ login: string }[]>`select login from employee where id = ${id}`;
      if (!e) throw new HttpError(404, 'No such employee.');
      await tx`delete from mfa_factor where employee_id = ${id}`;
      await tx`delete from mfa_recovery_code where employee_id = ${id}`;
      await tx`delete from session where employee_id = ${id}`;
      await tx`insert into credential_event (employee_id, login, kind, by_id, by_name, reason) values (${id}, ${e.login}, 'mfa_reset', ${me.id}, ${me.fullName}, ${b.reason})`;
    });
    return { ok: true };
  });

  // Opens a locked account at once (it also opens by itself after POLICY.lockoutMinutes). Does not touch the password.
  // Never for oneself; the unlock is an audited credential event with the reason.
  app.post('/api/employees/:id/unlock', async (req) => {
    const me = need(req, PEOPLE);
    const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
    const b = z.object({ reason }).parse(req.body);
    if (id === me.id) throw new HttpError(400, 'Another administrator must unlock your account.');
    await sql.begin(async (tx) => {
      const [e] = await tx<{ login: string }[]>`select login from employee where id = ${id}`;
      if (!e) throw new HttpError(404, 'No such employee.');
      await tx`update credential set failed_count = 0, locked_at = null where employee_id = ${id}`;
      await tx`insert into credential_event (employee_id, login, kind, by_id, by_name, reason) values (${id}, ${e.login}, 'unlocked', ${me.id}, ${me.fullName}, ${b.reason})`;
    });
    return { ok: true };
  });

  // PL-06: the full history of one person (versions, grants, credential events).
  app.get('/api/employees/:id/history', async (req) => {
    need(req, PEOPLE);
    const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
    const [employee] = await sql`select * from employee_current where id = ${id}`;
    if (!employee) throw new HttpError(404, 'No such employee.');
    const [lock] = await sql<{ at: Date | null }[]>`select case when locked_at > now() - make_interval(mins => ${POLICY.lockoutMinutes}) then locked_at end as at from credential where employee_id = ${id}`;
    return {
      employee,
      lockedAt: lock?.at ?? null,
      mfa: (await sql`select 1 from mfa_factor where employee_id = ${id} and confirmed_at is not null`).length > 0,
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
    const when = (d: Date | null) => (d ? plantTime(d, true) : 'never');
    const table = (head: string[], rows: unknown[][]) => `<table><tr>${head.map((h) => `<th>${esc(h)}</th>`).join('')}</tr>${
      rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</table>`;
    reply.type('text/html').send(`<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Access review report</title>
<style>body{font:13px/1.4 system-ui,sans-serif;margin:24px;color:#1d2433}h1{font-size:20px}h2{font-size:15px;margin-top:24px}
table{border-collapse:collapse;width:100%}td,th{border:1px solid #d0d5dd;padding:4px 6px;text-align:left}.muted{color:#667085}
@media print{button{display:none}}</style></head><body>
<h1>Access review report</h1><p class="muted">Printed ${esc(when(new Date()))} from the permission register. Reviewed by: ______________ Date: ________ Signature: ______________</p>
<p class="muted">To print or save as PDF, use the browser's Print (Ctrl+P).</p>
<h2>Active permissions (${grants.length})</h2>${table(['Login', 'Name', 'Employee active', 'Product', 'Permission', 'Label', 'Granted by', 'Granted', 'Last sign-in with password to product'],
      grants.map((g) => [g.login, g.full_name, g.active ? 'yes' : 'NO', g.product, g.code, g.label ?? '', g.granted_by, when(g.granted_at), when(g.last_signon)]))}
<h2>Links and outside logins that are on, as recorded by the last apply (${links.length})</h2>${table(['Reader', 'Reads database', 'View', 'Switched on', 'Change reference'],
      links.map((l) => [l.consumer, l.provider, l.view_name, when(l.switched_on_at), l.change_ref]))}
<p class="muted">Revoked permissions and switched-off links are not listed; their history is in the grant history export and each database's link log.</p>
</body></html>`);
  });

  return app;
}

/** Mounts the OIDC provider at /oidc and its sign-in page at /interaction (slice A3). */
function mountSignOn(app: FastifyInstance, deps: Deps, settings: OidcSettings, provider: ReturnType<typeof buildProvider>, limiter: FailureLimiter, required: string[]) {
  const waitFor = (ip: string, reply: FastifyReply) => retryAfter(limiter, ip, reply);
  const { sql } = deps;
  // "Yes, sign me out" at core's sign-out page (a product's logout) also ends the core screens' session on this browser.
  provider.on('end_session.success', (ctx: { oidc?: { params?: { logout?: unknown } }; cookies: { get(n: string, o: { signed: boolean }): string | undefined } }) => {
    const sid = ctx.oidc?.params?.logout ? ctx.cookies.get(SESSION_COOKIE, { signed: false }) : undefined;
    if (sid) void sql`delete from session where id = ${sessionKey(sid)}`.catch(() => {});
  });
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

      if (waitFor(req.ip, reply)) return reply.code(429).type('text/html').send(signInPage(product, d.uid, { login, error: TOO_MANY }));
      // E-signature password re-entry (re-authentication of the person already signed in) stays password only: no code at each signature.
      const reauthing = Boolean(d.session?.accountId) && d.prompt.name === 'login';
      const r = await signOnCheck(deps, login, b.password ?? '', product, reauthing ? undefined : { code: b.code ?? '' });
      if (r && 'mfaNeeded' in r) return show({ error: 'Enter the 6-digit code from your authenticator app, or a recovery code.' });
      if (!r) limiter.fail(req.ip);
      if (!r) return show({ error: 'Wrong login or password, or the account is locked or inactive.' });
      const id = r.id;
      if (!reauthing && required.length) {
        const [m] = await sql<{ mfa: boolean; needs: boolean }[]>`select exists (select from mfa_factor where employee_id = ${id} and confirmed_at is not null) as mfa,
          (${required.includes('all')} or exists (select from current_permission_grant g where g.employee_id = ${id} and g.code = any(${required}::text[]))) as needs`;
        if (m!.needs && !m!.mfa) return show({ error: 'Your site requires two-step sign-in. Sign in to the Medhanta platform screens first and set it up under My account.' });
      }
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
        const problem = b.next !== b.repeat ? 'The two new passwords differ.' : b.next === b.password ? 'The new password must differ.'
          : passwordProblem(b.next, login) ?? await passwordReuseProblem(sql, id, b.next);
        if (problem) return show({ change: true, error: problem });
        await setOwnPassword(sql, { id, login, fullName: c!.full_name }, b.next);
      }

      // PL-01: only people with a permission in this product get in.
      const [has] = await sql`select 1 from current_permission_grant where employee_id = ${id} and product = ${product} limit 1`;
      if (!has) return show({ error: `You have no access to ${product}. Ask your administrator.` });

      // One person per browser: a core screens' session of someone else on this browser ends.
      const sid = req.cookies[SESSION_COOKIE];
      if (sid) await sql`delete from session where id = ${sessionKey(sid)} and employee_id <> ${id}`;
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
    await tx`insert into credential (employee_id, password_hash, temp_expires_at) values (${e!.id}, ${hash}, now() + make_interval(hours => ${TEMP_PASSWORD_HOURS}))`;
    await tx`insert into permission_grant (employee_id, product, code, granted, by_name, reason)
      values (${e!.id}, 'core', ${PEOPLE}, true, 'installer', 'first administrator at installation')`;
  });
  return temp;
}

// D-82: names compared without case and extra spaces; the login a person's name gives is loginFromName (names.ts).
function sameName(name: string) { return `${name.trim().replace(/\s+/g, ' ').toLowerCase()}`; }
