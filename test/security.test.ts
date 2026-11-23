// Security round 1.26.32: timed lockout and admin unlock, sign-in rate limit, password rules, MFA, session lifetime, headers.
import { randomBytes, scryptSync } from 'node:crypto';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { buildApp } from '../apps/core/server/app.js';
import { base32, stepOf, totp } from '../apps/core/server/mfa.js';
import { FailureLimiter } from '../apps/core/server/ratelimit.js';
import { checkConfig } from '../deploy/config.js';
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

describe('two-step sign-in (authenticator app)', () => {
  const login = (l: string, code?: string, password = PASSWORD, app = t.app) => app.inject({ method: 'POST', url: '/api/login', payload: { login: l, password, ...(code === undefined ? {} : { code }) } });
  const fresh = async (id: string) => { const su = superuser(); await su`update mfa_factor set last_step = 0 where employee_id = ${id}`; await su.end(); };

  async function enrol(name: string) {
    const id = await makeEmployee(name, ['core.masterdata.view']);
    const s = await signIn(t.app, name);
    expect((await s.call('POST', '/api/me/mfa/start', { password: 'wrong password' })).statusCode).toBe(401);
    const start = (await s.call('POST', '/api/me/mfa/start', { password: PASSWORD })).json();
    expect(start.uri).toContain(`secret=${start.secret}`);
    expect(start.qr).toContain('<svg');
    expect((await s.call('POST', '/api/me/mfa/confirm', { code: '000000' })).statusCode).toBe(400);
    const done = await s.call('POST', '/api/me/mfa/confirm', { code: totp(start.secret, stepOf()) });
    expect(done.statusCode).toBe(200);
    return { id, secret: start.secret as string, recovery: done.json().recoveryCodes as string[], session: s };
  }

  it('the RFC 6238 test vector matches', () => {
    // RFC 6238 appendix B, SHA-1, secret "12345678901234567890", T=59 s: 94287082 (8 digits) -> 6 digits 287082
    expect(totp(base32(Buffer.from('12345678901234567890')), 1)).toBe('287082');
  });

  it('enrolling shows 8 recovery codes once; then sign-in needs the code', async () => {
    const e = await enrol(`mfa${run}`);
    expect(e.recovery).toHaveLength(8);
    expect((await e.session.call('GET', '/api/me')).json().mfa).toBe(true);
    await fresh(e.id);
    const noCode = await login(`mfa${run}`);
    expect(noCode.statusCode).toBe(401);
    expect(noCode.json().mfa).toBe(true);
    expect(noCode.cookies.find((c) => c.name === 'sid')).toBeUndefined();   // no session without the code
    expect((await login(`mfa${run}`, '123456')).json().mfa).toBeUndefined();   // a wrong code is a plain failure
    expect((await login(`mfa${run}`, '123456')).statusCode).toBe(401);
    expect((await login(`mfa${run}`, totp(e.secret, stepOf()))).statusCode).toBe(200);
  });

  it('a code works once', async () => {
    const e = await enrol(`replay${run}`);
    await fresh(e.id);
    const code = totp(e.secret, stepOf());
    expect((await login(`replay${run}`, code)).statusCode).toBe(200);
    expect((await login(`replay${run}`, code)).statusCode).toBe(401);
  });

  it('wrong codes count towards the lockout like wrong passwords', async () => {
    const e = await enrol(`mfalock${run}`);
    await fresh(e.id);
    for (let i = 0; i < 5; i++) await login(`mfalock${run}`, '111111');
    expect((await login(`mfalock${run}`, totp(e.secret, stepOf()))).statusCode).toBe(401);
    const su = superuser();
    const [c] = await su`select locked_at from credential where employee_id = ${e.id}`;
    await su.end();
    expect(c!.locked_at).not.toBeNull();
  });

  it('a recovery code signs in once and is audited', async () => {
    const e = await enrol(`rec${run}`);
    expect((await login(`rec${run}`, e.recovery[0])).statusCode).toBe(200);
    expect((await login(`rec${run}`, e.recovery[0])).statusCode).toBe(401);
    expect((await login(`rec${run}`, e.recovery[1]!.toUpperCase())).statusCode).toBe(200);
    const su = superuser();
    const rows = await su`select reason from credential_event where employee_id = ${e.id} and kind = 'signon_ok' and reason is not null`;
    await su.end();
    expect(rows).toHaveLength(2);
  });

  it('turning it off needs the password and a code; a person without it signs in as before', async () => {
    const e = await enrol(`off${run}`);
    await fresh(e.id);
    const s = await signIn(t.app, `off${run}`, PASSWORD);   // 401 without code; so use the enrol session
    expect(s.res.statusCode).toBe(401);
    expect((await e.session.call('POST', '/api/me/mfa/disable', { password: PASSWORD, code: '000000' })).statusCode).toBe(401);
    expect((await e.session.call('POST', '/api/me/mfa/disable', { password: PASSWORD, code: totp(e.secret, stepOf()) })).statusCode).toBe(200);
    expect((await login(`off${run}`)).statusCode).toBe(200);
  });

  it('an administrator resets it with a reason (audited); not for oneself', async () => {
    const e = await enrol(`lost${run}`);
    const admin = await signIn(t.app, adminLogin);
    expect((await admin.call('POST', `/api/employees/${e.id}/mfa-reset`, {})).statusCode).toBe(400);
    expect((await admin.call('POST', `/api/employees/${e.id}/mfa-reset`, { reason: 'phone lost, identity checked' })).statusCode).toBe(200);
    expect((await login(`lost${run}`)).statusCode).toBe(200);
    const h = (await admin.call('GET', `/api/employees/${e.id}/history`)).json();
    expect(h.credentialEvents.map((c: { kind: string }) => c.kind)).toEqual(expect.arrayContaining(['mfa_enrolled', 'mfa_reset']));
    expect(h.credentialEvents.find((c: { kind: string }) => c.kind === 'mfa_reset').reason).toBe('phone lost, identity checked');
    const mine = (await admin.call('GET', '/api/me')).json();
    expect((await admin.call('POST', `/api/employees/${mine.id}/mfa-reset`, { reason: 'x' })).statusCode).toBe(400);
  });

  it('a site can require it: people in the chosen permissions can only set it up until they have, and cannot turn it off', async () => {
    const app = buildApp({ ...t.deps, mfaRequired: ['core.people.manage'] });
    const id = await makeEmployee(`req${run}`, ['core.people.manage']);
    await makeEmployee(`notreq${run}`, ['core.masterdata.view']);
    const r = await login(`req${run}`, undefined, PASSWORD, app);
    expect(r.statusCode).toBe(200);   // may sign in to set it up
    expect(r.json()).toMatchObject({ mfa: false, mfaRequired: true });
    const sid = r.cookies.find((c) => c.name === 'sid')!.value;
    const call = (method: 'GET' | 'POST', url: string, payload?: object) => app.inject({ method, url, payload, cookies: { sid } });
    expect((await call('GET', '/api/employees')).statusCode).toBe(403);
    expect((await call('GET', '/api/session')).statusCode).toBe(200);
    const start = (await call('POST', '/api/me/mfa/start', { password: PASSWORD })).json();
    expect((await call('POST', '/api/me/mfa/confirm', { code: totp(start.secret, stepOf()) })).statusCode).toBe(200);
    expect((await call('GET', '/api/employees')).statusCode).toBe(200);
    expect((await call('POST', '/api/me/mfa/disable', { password: PASSWORD, code: '1' })).statusCode).toBe(403);
    expect(((await login(`notreq${run}`, undefined, PASSWORD, app)).json() as { mfaRequired: boolean }).mfaRequired).toBe(false);
    const all = buildApp({ ...t.deps, mfaRequired: ['all'] });
    expect(((await login(`notreq${run}`, undefined, PASSWORD, all)).json() as { mfaRequired: boolean }).mfaRequired).toBe(true);
    expect(id).toBeTruthy();
  });
});

describe('customer config: mfa_required', () => {
  const raw = { customer: 'ci', version: '0.6.0', domain: 'ci.example', offline: true, security_contact: 'security@ci.example', backup: { path: 'b/ci' }, change_ref: 'CC-1', reason: 'r' };
  it('takes "all" or permission codes, default none, and refuses anything else', () => {
    expect(checkConfig(raw).config.mfa_required).toEqual([]);
    expect(checkConfig({ ...raw, mfa_required: ['all'] }).config.mfa_required).toEqual(['all']);
    expect(checkConfig({ ...raw, mfa_required: ['core.people.manage', 'truebatch.master.approve'] }).config.mfa_required).toHaveLength(2);
    expect(() => checkConfig({ ...raw, mfa_required: ['admins'] })).toThrow();
  });
});
