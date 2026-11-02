// Slice A2: employees, passwords, lockout and the permission register in the identity database.
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { coreApp, makeEmployee, PASSWORD, run, signIn, superuser } from './core.js';
import { sqlstate } from './db.js';

let t: Awaited<ReturnType<typeof coreApp>>;
let adminLogin: string;

beforeAll(async () => {
  t = await coreApp();
  adminLogin = `admin${run}`;
  await makeEmployee(adminLogin, ['identity_admin']);
});
afterAll(async () => { await t.sql.end(); });

describe('PL-01 only authorised people, with authority checks', () => {
  it('PL-01 an employee without identity_admin cannot list, create or grant', async () => {
    await makeEmployee(`plain${run}`, ['viewer']);
    const { call } = await signIn(t.app, `plain${run}`);
    expect((await call('GET', '/api/employees')).statusCode).toBe(403);
    expect((await call('POST', '/api/employees', { login: `x${run}`, fullName: 'X', identityVerifiedHow: 'card', reason: 'r' })).statusCode).toBe(403);
    expect((await call('POST', '/api/grants', { employeeId: '00000000-0000-0000-0000-000000000000', product: 'core', role: 'viewer', granted: true, reason: 'r' })).statusCode).toBe(403);
  });

  it('PL-01 a deactivated employee cannot sign on and their open session ends', async () => {
    const id = await makeEmployee(`leaver${run}`, ['viewer']);
    const leaver = await signIn(t.app, `leaver${run}`);
    expect((await leaver.call('GET', '/api/me')).statusCode).toBe(200);
    const admin = await signIn(t.app, adminLogin);
    expect((await admin.call('PATCH', `/api/employees/${id}`, { active: false, reason: 'left the company' })).statusCode).toBe(200);
    expect((await leaver.call('GET', '/api/me')).statusCode).toBe(401);
    expect((await signIn(t.app, `leaver${run}`)).res.statusCode).toBe(401);
  });

  it('PL-01 no request without a session', async () => {
    expect((await t.app.inject({ method: 'GET', url: '/api/employees' })).statusCode).toBe(401);
  });
});

describe('PL-02 / PL-01 the permission register', () => {
  it('PL-02 granting and revoking leave two events with who, when and why; current rights follow', async () => {
    const id = await makeEmployee(`granted${run}`);
    const admin = await signIn(t.app, adminLogin);
    expect((await admin.call('POST', '/api/grants', { employeeId: id, product: 'core', role: 'master_data_editor', granted: true, reason: 'new editor' })).statusCode).toBe(200);
    let current = (await admin.call('GET', '/api/grants')).json().filter((g: { employeeId: string }) => g.employeeId === id);
    expect(current.map((g: { role: string }) => g.role)).toEqual(['master_data_editor']);
    expect((await admin.call('POST', '/api/grants', { employeeId: id, product: 'core', role: 'master_data_editor', granted: false, reason: 'moved team' })).statusCode).toBe(200);
    current = (await admin.call('GET', '/api/grants')).json().filter((g: { employeeId: string }) => g.employeeId === id);
    expect(current).toEqual([]);
    const h = (await admin.call('GET', `/api/employees/${id}/history`)).json();
    expect(h.grants.map((g: { granted: boolean; reason: string; by_name: string }) => [g.granted, g.reason, g.by_name]))
      .toEqual([[true, 'new editor', `Name of ${adminLogin}`], [false, 'moved team', `Name of ${adminLogin}`]]);
  });

  it('PL-02 a grant without a reason, or for a role the product does not offer, is refused', async () => {
    const id = await makeEmployee(`noreason${run}`);
    const admin = await signIn(t.app, adminLogin);
    expect((await admin.call('POST', '/api/grants', { employeeId: id, product: 'core', role: 'viewer', granted: true, reason: ' ' })).statusCode).toBe(400);
    expect((await admin.call('POST', '/api/grants', { employeeId: id, product: 'core', role: 'superuser', granted: true, reason: 'x' })).statusCode).toBe(400);
  });

  it('PL-02 the app login cannot change or remove register history', async () => {
    expect(await sqlstate(t.sql`update grant_event set reason = 'x'`)).toBe('42501');
    expect(await sqlstate(t.sql`delete from grant_event`)).toBe('42501');
    const su = superuser();
    expect(await sqlstate(su`update grant_event set reason = 'x'`)).toBe('42501');
    await su.end();
  });
});

describe('PL-03 one verified identity per person, never reused', () => {
  it('PL-03 a login ID cannot be issued twice, not even after deactivation', async () => {
    const id = await makeEmployee(`reuse${run}`);
    const admin = await signIn(t.app, adminLogin);
    await admin.call('PATCH', `/api/employees/${id}`, { active: false, reason: 'left' });
    const res = await admin.call('POST', '/api/employees', { login: `reuse${run}`, fullName: 'Someone Else', identityVerifiedHow: 'ID card', reason: 'joiner' });
    expect(res.statusCode).toBe(409);
  });

  it('PL-03 creating an employee records who verified the identity and how; without "how" it is refused', async () => {
    const admin = await signIn(t.app, adminLogin);
    expect((await admin.call('POST', '/api/employees', { login: `nohow${run}`, fullName: 'N', identityVerifiedHow: '', reason: 'joiner' })).statusCode).toBe(400);
    const res = await admin.call('POST', '/api/employees', { login: `joiner${run}`, fullName: 'J Oiner', identityVerifiedHow: 'Aadhaar card seen', reason: 'joiner' });
    expect(res.statusCode).toBe(200);
    const h = (await admin.call('GET', `/api/employees/${res.json().id}/history`)).json();
    expect([h.employee.identity_verified_by, h.employee.identity_verified_how]).toEqual([`Name of ${adminLogin}`, 'Aadhaar card seen']);
  });

  it('PL-03 employees and login IDs cannot be deleted or renamed', async () => {
    expect(await sqlstate(t.sql`delete from employee where login = ${adminLogin}`)).toBe('42501');
    expect(await sqlstate(t.sql`update employee set login = 'other' where login = ${adminLogin}`)).toBe('42501');
  });
});

describe('PL-04 password controls and misuse alerts', () => {
  it('PL-04 the fifth failure locks the account, emails the security contact at once and raises the alert', async () => {
    await makeEmployee(`victim${run}`);
    t.mailbox.length = 0;
    for (let i = 0; i < 5; i++) expect((await signIn(t.app, `victim${run}`, 'wrong password')).res.statusCode).toBe(401);
    expect(t.mailbox).toHaveLength(1);
    expect(t.mailbox[0]!.to).toBe('security@site.test');
    expect(t.mailbox[0]!.text).toContain(`victim${run}`);
    expect((await signIn(t.app, `victim${run}`)).res.statusCode).toBe(401);   // right password, still locked
    const admin = await signIn(t.app, adminLogin);
    const alerts = (await admin.call('GET', '/api/alerts')).json();
    const mine = alerts.find((a: { message: string }) => a.message.includes(`victim${run}`));
    expect(mine.emailedAt).not.toBeNull();
    expect((await admin.call('POST', `/api/alerts/${mine.id}/ack`)).statusCode).toBe(200);
    expect((await admin.call('GET', '/api/alerts')).json().some((a: { id: string }) => a.id === mine.id)).toBe(false);
  });

  it('PL-04 a reset gives a temporary password that allows nothing until changed, and unlocks', async () => {
    const id = await makeEmployee(`forgot${run}`, ['viewer']);
    const admin = await signIn(t.app, adminLogin);
    const temp = (await admin.call('POST', `/api/employees/${id}/reset-password`, { reason: 'forgot password' })).json().temporaryPassword;
    expect((await signIn(t.app, `forgot${run}`)).res.statusCode).toBe(401);  // old password gone
    const user = await signIn(t.app, `forgot${run}`, temp);
    expect(user.res.json().mustChange).toBe(true);
    expect((await user.call('GET', '/api/alerts')).statusCode).toBe(403);
    expect((await user.call('POST', '/api/me/password', { current: temp, next: 'a brand new secret' })).statusCode).toBe(200);
    expect((await user.call('GET', '/api/alerts')).statusCode).toBe(200);
  });

  it('PL-04 an administrator cannot reset their own password', async () => {
    const admin = await signIn(t.app, adminLogin);
    const me = (await admin.call('GET', '/api/me')).json();
    expect((await admin.call('POST', `/api/employees/${me.id}/reset-password`, { reason: 'x' })).statusCode).toBe(400);
  });

  it('PL-04 an expired password must be changed', async () => {
    const id = await makeEmployee(`old${run}`, ['viewer']);
    const su = superuser();
    await su`update credential set changed_at = now() - interval '91 days' where employee_id = ${id}`;
    await su.end();
    const user = await signIn(t.app, `old${run}`);
    expect(user.res.json().mustChange).toBe(true);
    expect((await user.call('GET', '/api/alerts')).statusCode).toBe(403);
  });

  it('PL-04 a weak new password is refused', async () => {
    await makeEmployee(`weak${run}`);
    const user = await signIn(t.app, `weak${run}`);
    expect((await user.call('POST', '/api/me/password', { current: PASSWORD, next: 'short' })).statusCode).toBe(400);
  });
});

describe('PL-06 audit trail of employees', () => {
  it('PL-06 a change without a reason is refused; with one, the old version stays readable', async () => {
    const id = await makeEmployee(`renamed${run}`);
    const admin = await signIn(t.app, adminLogin);
    expect((await admin.call('PATCH', `/api/employees/${id}`, { fullName: 'New Name', reason: '' })).statusCode).toBe(400);
    expect((await admin.call('PATCH', `/api/employees/${id}`, { fullName: 'New Name', reason: 'marriage' })).statusCode).toBe(200);
    const h = (await admin.call('GET', `/api/employees/${id}/history`)).json();
    expect(h.versions.map((v: { full_name: string; reason: string }) => [v.full_name, v.reason]))
      .toEqual([[`Name of renamed${run}`, 'test'], ['New Name', 'marriage']]);
    expect(await sqlstate(t.sql`update employee_version set full_name = 'x'`)).toBe('42501');
  });

  it('PL-06 the history exports as readable CSV', async () => {
    const admin = await signIn(t.app, adminLogin);
    const res = await admin.call('GET', '/api/export/employee-history.csv');
    expect(res.headers['content-type']).toContain('text/csv');
    expect(res.body.split('\n')[0]).toBe('login,version,full_name,email,active,changed_by_name,changed_at,reason');
    expect(res.body).toContain(`renamed${run},2,New Name`);
  });
});
