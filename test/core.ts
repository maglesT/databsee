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

/** An employee with a known, non-temporary password and the given core roles. */
export async function makeEmployee(login: string, roles: string[] = [], opts: { mustChange?: boolean } = {}) {
  const su = superuser();
  const hash = await hashPassword(PASSWORD);
  const [e] = await su<{ id: string }[]>`insert into employee (login, identity_verified_by, identity_verified_how)
    values (${login}, 'test', 'test') returning id`;
  await su`insert into employee_version (employee_id, version, full_name, active, changed_by_name, reason)
    values (${e!.id}, 1, ${`Name of ${login}`}, true, 'test', 'test')`;
  await su`insert into credential (employee_id, password_hash, must_change) values (${e!.id}, ${hash}, ${opts.mustChange ?? false})`;
  for (const role of roles) {
    await su`insert into grant_event (employee_id, product, role, granted, by_name, reason) values (${e!.id}, 'core', ${role}, true, 'test', 'test')`;
  }
  await su.end();
  return e!.id;
}

type App = ReturnType<typeof buildApp>;

/** Signs in and returns a request helper carrying the session cookie. */
export async function signIn(app: App, login: string, password = PASSWORD) {
  const res = await app.inject({ method: 'POST', url: '/api/login', payload: { login, password } });
  const cookie = res.cookies.find((c) => c.name === 'sid');
  const call = (method: 'GET' | 'POST' | 'PATCH', url: string, payload?: object) =>
    app.inject({ method, url, payload, cookies: cookie ? { sid: cookie.value } : {} });
  return { res, call };
}
