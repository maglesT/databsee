// Test helpers for the core app: a core_app connection, a captured mailbox, and employees made directly.
import { randomBytes } from 'node:crypto';
import postgres from 'postgres';
import { buildApp, type Deps } from '../apps/core/server/app.js';
import { hashPassword } from '../apps/core/server/passwords.js';
import { enableLogin } from './db.js';
import type { Mail } from '../apps/core/server/mail.js';

export const PASSWORD = 'correct horse 42';
export const run = randomBytes(3).toString('hex');               // keeps logins unique across local re-runs
export const superuser = () => postgres({ database: 'identity', onnotice: () => {}, max: 1 });

export async function coreApp() {
  await enableLogin('core_app');
  const sql = postgres({ database: 'identity', username: 'core_app', password: 'test-only', onnotice: () => {} });
  const md = postgres({ database: 'master_data', username: 'core_app', password: 'test-only', onnotice: () => {} });
  const mailbox: Mail[] = [];
  const deps: Deps = { sql, sendMail: async (m) => { mailbox.push(m); }, securityContact: 'security@site.test', secureCookies: false, md };
  return { app: buildApp(deps), sql, md, mailbox, deps };
}

/** An employee with a known, non-temporary password and the given permission codes (any product). */
export async function makeEmployee(login: string, permissions: string[] = [], opts: { mustChange?: boolean } = {}) {
  const su = superuser();
  const hash = await hashPassword(PASSWORD);
  const [e] = await su<{ id: string }[]>`insert into employee (login, identity_verified_by, identity_verified_how)
    values (${login}, 'test', 'test') returning id`;
  await su`insert into employee_version (employee_id, version, full_name, active, changed_by_name, reason)
    values (${e!.id}, 1, ${`Name of ${login}`}, true, 'test', 'test')`;
  await su`insert into credential (employee_id, password_hash, must_change) values (${e!.id}, ${hash}, ${opts.mustChange ?? false})`;
  await su.end();
  await grant(e!.id, permissions);
  return e!.id;
}

/** Grants permission codes directly in the register (the product is the code's first part). */
export async function grant(employeeId: string, codes: string[]) {
  const su = superuser();
  for (const code of codes)
    await su`insert into permission_grant (employee_id, product, code, granted, by_name, reason) values (${employeeId}, ${code.split('.')[0]!}, ${code}, true, 'test', 'test')`;
  await su.end();
}

/** What apply does for a licensed product: its permissions in the catalogue (here: hello's). */
export async function helloCatalogue() {
  const su = superuser();
  await su`insert into permission_event (product, code, label, active, by_name, reason)
    select 'hello', c.code, c.label, true, 'test', 'test' from (values ('hello.note.sign', 'Write and sign notes'), ('hello.note.read', 'Read notes')) c(code, label)
    where not exists (select from current_permission p where p.code = c.code)`;
  await su.end();
}

type App = ReturnType<typeof buildApp>;

/** Signs in and returns a request helper carrying the session cookie. */
export async function signIn(app: App, login: string, password = PASSWORD) {
  const res = await app.inject({ method: 'POST', url: '/api/login', payload: { login, password } });
  const cookie = res.cookies.find((c) => c.name === 'sid');
  const call = (method: 'GET' | 'POST' | 'PUT' | 'PATCH', url: string, payload?: object) =>
    app.inject({ method, url, payload, cookies: cookie ? { sid: cookie.value } : {} });
  return { res, call };
}
