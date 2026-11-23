// Security round 1.26.32: timed lockout and admin unlock, sign-in rate limit, password rules, MFA, session lifetime, headers.
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { buildApp } from '../apps/core/server/app.js';
import { FailureLimiter } from '../apps/core/server/ratelimit.js';
import { coreApp, makeEmployee, PASSWORD, run, signIn, superuser } from './core.js';

let t: Awaited<ReturnType<typeof coreApp>>;
let adminLogin: string;
const bad = (login: string, n = 1) => Promise.all(Array.from({ length: n }, () => signIn(t.app, login, 'wrong password')));
const lockOut = async (login: string) => { for (let i = 0; i < 5; i++) await signIn(t.app, login, 'wrong password'); };

beforeAll(async () => {
  t = await coreApp();
  adminLogin = `secadmin${run}`;
  await makeEmployee(adminLogin, ['core.people.manage']);
});
afterAll(async () => { await t.sql.end(); await t.md.end(); });

describe('lockout opens by itself and an administrator can unlock', () => {
  it('a locked account opens after the lockout time, with the password unchanged', async () => {
    const id = await makeEmployee(`timed${run}`);
    await lockOut(`timed${run}`);
    expect((await signIn(t.app, `timed${run}`)).res.statusCode).toBe(401);
    const su = superuser();
    await su`update credential set locked_at = now() - interval '14 minutes' where employee_id = ${id}`;
    expect((await signIn(t.app, `timed${run}`)).res.statusCode).toBe(401);   // 14 minutes: still locked
    await su`update credential set locked_at = now() - interval '16 minutes' where employee_id = ${id}`;
    expect((await signIn(t.app, `timed${run}`)).res.statusCode).toBe(200);
    const [c] = await su`select failed_count, locked_at from credential where employee_id = ${id}`;
    expect([c!.failed_count, c!.locked_at]).toEqual([0, null]);
    await su.end();
  });

  it('after a lock ran out, the next failures count from zero again', async () => {
    const id = await makeEmployee(`again${run}`);
    await lockOut(`again${run}`);
    const su = superuser();
    await su`update credential set locked_at = now() - interval '20 minutes' where employee_id = ${id}`;
    await signIn(t.app, `again${run}`, 'wrong password');
    const [c] = await su`select failed_count, locked_at from credential where employee_id = ${id}`;
    expect([c!.failed_count, c!.locked_at]).toEqual([1, null]);
    await su.end();
  });

  it('an administrator unlocks with a reason, it is audited, and the password stays', async () => {
    const id = await makeEmployee(`unl${run}`);
    await lockOut(`unl${run}`);
    const admin = await signIn(t.app, adminLogin);
    expect((await admin.call('GET', '/api/employees')).json().find((p: { login: string }) => p.login === `unl${run}`).lockedAt).not.toBeNull();
    expect((await admin.call('POST', `/api/employees/${id}/unlock`, {})).statusCode).toBe(400);   // reason needed
    expect((await admin.call('POST', `/api/employees/${id}/unlock`, { reason: 'caller verified by phone' })).statusCode).toBe(200);
    expect((await signIn(t.app, `unl${run}`)).res.statusCode).toBe(200);   // same password
    const h = (await admin.call('GET', `/api/employees/${id}/history`)).json();
    expect(h.credentialEvents.find((e: { kind: string }) => e.kind === 'unlocked')).toMatchObject({ by_name: `Name of ${adminLogin}`, reason: 'caller verified by phone' });
    expect(h.credentialEvents.some((e: { kind: string }) => e.kind === 'locked')).toBe(true);
  });

  it('unlock needs core.people.manage and is not allowed for oneself', async () => {
    await makeEmployee(`plain2${run}`);
    const plain = await signIn(t.app, `plain2${run}`);
    const me = (await plain.call('GET', '/api/me')).json();
    expect((await plain.call('POST', `/api/employees/${me.id}/unlock`, { reason: 'x' })).statusCode).toBe(403);
    const admin = await signIn(t.app, adminLogin);
    const mine = (await admin.call('GET', '/api/me')).json();
    expect((await admin.call('POST', `/api/employees/${mine.id}/unlock`, { reason: 'x' })).statusCode).toBe(400);
  });
});

describe('sign-in rate limit per address', () => {
  it('after too many failures from one address the sign-in answers 429 with a plain message, even for the right password', async () => {
    const app = buildApp({ ...t.deps, loginFailuresPerMinute: 3 });
    await makeEmployee(`rate${run}`);
    const login = (password: string) => app.inject({ method: 'POST', url: '/api/login', payload: { login: `rate${run}`, password } });
    for (let i = 0; i < 3; i++) expect((await login('wrong password')).statusCode).toBe(401);
    const res = await login(PASSWORD);
    expect(res.statusCode).toBe(429);
    expect(res.json().error).toBe('Too many failed attempts. Wait a minute and try again.');
    expect(Number(res.headers['retry-after'])).toBeGreaterThan(0);
    // another address is not affected; a successful sign-in never counts
    const other = await app.inject({ method: 'POST', url: '/api/login', remoteAddress: '10.9.9.9', payload: { login: `rate${run}`, password: PASSWORD } });
    expect(other.statusCode).toBe(200);
  });

  it('the limiter forgets after the window', () => {
    const l = new FailureLimiter(2, 1000);
    l.fail('a', 0); l.fail('a', 10);
    expect(l.blockedFor('a', 500)).toBe(1);
    expect(l.blockedFor('a', 1011)).toBe(0);
  });

  it('unknown logins write a bounded number of rows (one per login per 10 minutes)', async () => {
    const ghost = `ghost${run}`;
    for (let i = 0; i < 6; i++) await signIn(t.app, ghost, 'wrong password');
    const su = superuser();
    const [n] = await su`select count(*)::int as n from credential_event where login = ${ghost}`;
    await su.end();
    expect(n!.n).toBe(1);
  });

  it('an unknown login still runs the password hash (about as slow as a known one)', async () => {
    await makeEmployee(`known${run}`);
    const time = async (login: string) => { const s = performance.now(); await signIn(t.app, login, 'wrong password'); return performance.now() - s; };
    await time(`known${run}`);
    const known = await time(`known${run}`), unknown = await time(`nobody${run}`);
    expect(unknown).toBeGreaterThan(known * 0.4);
  });
});
