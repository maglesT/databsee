// Security round 1.26.32: timed lockout and admin unlock, sign-in rate limit, password rules, MFA, session lifetime, headers.
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
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
