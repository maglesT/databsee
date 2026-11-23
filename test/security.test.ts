// Security round 1.26.32: timed lockout and admin unlock, sign-in rate limit, password rules, MFA, session lifetime, headers.
import { randomBytes, scryptSync } from 'node:crypto';
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

describe('password rules', () => {
  const change = async (login: string, current: string, next: string) => (await signIn(t.app, login, current)).call('POST', '/api/me/password', { current, next });

  it('needs 12 characters and refuses common passwords (also with digits or symbols added)', async () => {
    await makeEmployee(`rules${run}`);
    const r = (next: string) => change(`rules${run}`, PASSWORD, next);
    expect((await r('Short1!aB')).statusCode).toBe(400);
    for (const word of ['password123456', 'Password1234!!', 'qwertyuiop12', 'Football-2020!!'.slice(0, 8) + '99'])
      expect((await r(word)).statusCode, word).toBe(400);
    expect((await r('password123456')).json().error).toContain('too common');
    expect((await r('Tr1cky-but-fine-9')).statusCode).toBe(200);
  });

  it('the last 5 passwords cannot be used again', async () => {
    await makeEmployee(`hist${run}`);
    const pws = ['alpha-bravo-001x', 'alpha-bravo-002x', 'alpha-bravo-003x', 'alpha-bravo-004x'];
    let cur = PASSWORD;
    for (const p of pws) { expect((await change(`hist${run}`, cur, p)).statusCode).toBe(200); cur = p; }
    const again = await change(`hist${run}`, cur, pws[1]!);
    expect(again.statusCode).toBe(400);
    expect(again.json().error).toContain('last 5');
    expect((await change(`hist${run}`, cur, 'alpha-bravo-new1')).statusCode).toBe(200);
  });

  it('a temporary password expires after 72 hours; a reset gives a fresh one', async () => {
    const admin = await signIn(t.app, adminLogin);
    const created = (await admin.call('POST', '/api/employees', { login: `temp${run}`, fullName: 'T Emp', identityVerifiedHow: 'card', reason: 'joiner' })).json();
    const su = superuser();
    const [c] = await su`select extract(epoch from temp_expires_at - now()) / 3600 as hours from credential where employee_id = ${created.id}`;
    expect(Number(c!.hours)).toBeGreaterThan(71.9);
    expect(Number(c!.hours)).toBeLessThanOrEqual(72);
    expect((await signIn(t.app, `temp${run}`, created.temporaryPassword)).res.statusCode).toBe(200);
    await su`update credential set temp_expires_at = now() - interval '1 minute' where employee_id = ${created.id}`;
    expect((await signIn(t.app, `temp${run}`, created.temporaryPassword)).res.statusCode).toBe(401);
    const fresh = (await admin.call('POST', `/api/employees/${created.id}/reset-password`, { reason: 'expired' })).json().temporaryPassword;
    expect((await signIn(t.app, `temp${run}`, fresh)).res.statusCode).toBe(200);
    await su.end();
  });

  it('old hashes still work and are replaced by one at the current cost at the next good sign-in', async () => {
    const id = await makeEmployee(`rehash${run}`);
    const salt = randomBytes(16);
    const old = scryptSync(PASSWORD, salt, 64, { N: 16384, r: 8, p: 1 });
    const su = superuser();
    await su`update credential set password_hash = ${`scrypt$16384$8$1$${salt.toString('base64')}$${old.toString('base64')}`} where employee_id = ${id}`;
    expect((await signIn(t.app, `rehash${run}`)).res.statusCode).toBe(200);
    const [c] = await su`select password_hash, must_change from credential where employee_id = ${id}`;
    expect(c!.password_hash.split('$')[1]).toBe('131072');
    expect(c!.must_change).toBe(false);
    expect((await signIn(t.app, `rehash${run}`)).res.statusCode).toBe(200);   // the new hash works
    expect((await signIn(t.app, `rehash${run}`, 'wrong password')).res.statusCode).toBe(401);
    await su.end();
  });
});
