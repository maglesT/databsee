// Slice A2: employees, passwords, lockout and the permission register in the identity database.
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { coreApp, makeEmployee, PASSWORD, run, signIn, superuser } from './core.js';
import { sqlstate } from './db.js';

let t: Awaited<ReturnType<typeof coreApp>>;
let adminLogin: string;

beforeAll(async () => {
  t = await coreApp();
  adminLogin = `admin${run}`;
  await makeEmployee(adminLogin, ['core.people.manage']);
});
afterAll(async () => { await t.sql.end(); await t.md.end(); });

describe('PL-01 only authorised people, with authority checks', () => {
  it('PL-01 an employee without core.people.manage cannot list, create or grant', async () => {
    await makeEmployee(`plain${run}`, ['core.masterdata.view']);
    const { call } = await signIn(t.app, `plain${run}`);
    expect((await call('GET', '/api/employees')).statusCode).toBe(403);
    expect((await call('POST', '/api/employees', { login: `x${run}`, fullName: 'X', identityVerifiedHow: 'card', reason: 'r' })).statusCode).toBe(403);
    const self = (await call('GET', '/api/me')).json();
    expect(self.permissions).toEqual(['core.masterdata.view']);
    expect((await call('PUT', `/api/employees/${self.id}/permissions`, { product: 'core', codes: ['core.people.manage'], reason: 'r' })).statusCode).toBe(403);
    expect((await call('GET', '/api/permissions')).statusCode).toBe(403);
  });

  it('PL-01 a deactivated employee cannot sign on and their open session ends', async () => {
    const id = await makeEmployee(`leaver${run}`, ['core.masterdata.view']);
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
  const codes = (r: { json: () => { product: string; code: string }[] }, product = 'core') =>
    r.json().filter((g) => g.product === product).map((g) => g.code);

  it('PL-01 a person gets exactly the ticked subset of the catalogue, and only the differences are logged', async () => {
    const id = await makeEmployee(`ticked${run}`, ['core.masterdata.view']);
    const admin = await signIn(t.app, adminLogin);
    const catalogue = (await admin.call('GET', '/api/permissions')).json();
    expect(catalogue.filter((p: { product: string }) => p.product === 'core').map((p: { code: string }) => p.code))
      .toEqual(['core.masterdata.edit', 'core.masterdata.view', 'core.people.manage']);
    const set = await admin.call('PUT', `/api/employees/${id}/permissions`, { product: 'core', codes: ['core.masterdata.edit'], reason: 'now edits' });
    expect(set.json()).toEqual({ granted: ['core.masterdata.edit'], revoked: ['core.masterdata.view'] });
    expect(codes(await admin.call('GET', `/api/employees/${id}/permissions`))).toEqual(['core.masterdata.edit']);
    const user = await signIn(t.app, `ticked${run}`);
    expect(user.res.json().permissions).toEqual(['core.masterdata.edit']);
    // The same set again writes nothing.
    expect((await admin.call('PUT', `/api/employees/${id}/permissions`, { product: 'core', codes: ['core.masterdata.edit'], reason: 'again' })).json())
      .toEqual({ granted: [], revoked: [] });
    const h = (await admin.call('GET', `/api/employees/${id}/history`)).json();
    expect(h.grants.map((g: { code: string; granted: boolean; reason: string }) => [g.code, g.granted, g.reason]))
      .toEqual([['core.masterdata.view', true, 'test'], ['core.masterdata.edit', true, 'now edits'], ['core.masterdata.view', false, 'now edits']]);
  });

  it('PL-01 copy from another person gives the same set in that product and logs each change with the reason', async () => {
    const from = await makeEmployee(`model${run}`, ['core.masterdata.view', 'core.masterdata.edit']);
    const to = await makeEmployee(`copier${run}`, ['core.people.manage']);
    const admin = await signIn(t.app, adminLogin);
    const r = await admin.call('POST', `/api/employees/${to}/permissions/copy`, { product: 'core', fromId: from, reason: 'same job as model' });
    expect(r.json()).toEqual({ granted: ['core.masterdata.edit', 'core.masterdata.view'], revoked: ['core.people.manage'] });
    expect(codes(await admin.call('GET', `/api/employees/${to}/permissions`))).toEqual(codes(await admin.call('GET', `/api/employees/${from}/permissions`)));
    const h = (await admin.call('GET', `/api/employees/${to}/history`)).json();
    expect(h.grants.slice(1).map((g: { reason: string; by_name: string }) => [g.reason, g.by_name]))
      .toEqual(Array(3).fill([`same job as model (copied from model${run})`, `Name of ${adminLogin}`]));
    expect((await admin.call('POST', `/api/employees/${to}/permissions/copy`, { product: 'core', fromId: from, reason: '' })).statusCode).toBe(400);
  });

  it('PL-02 granting and revoking leave two events with who, when and why; current rights follow', async () => {
    const id = await makeEmployee(`granted${run}`);
    const admin = await signIn(t.app, adminLogin);
    expect((await admin.call('PUT', `/api/employees/${id}/permissions`, { product: 'core', codes: ['core.masterdata.edit'], reason: 'new editor' })).statusCode).toBe(200);
    expect(codes(await admin.call('GET', `/api/employees/${id}/permissions`))).toEqual(['core.masterdata.edit']);
    expect((await admin.call('PUT', `/api/employees/${id}/permissions`, { product: 'core', codes: [], reason: 'moved team' })).statusCode).toBe(200);
    expect(codes(await admin.call('GET', `/api/employees/${id}/permissions`))).toEqual([]);
    const h = (await admin.call('GET', `/api/employees/${id}/history`)).json();
    expect(h.grants.map((g: { granted: boolean; reason: string; by_name: string }) => [g.granted, g.reason, g.by_name]))
      .toEqual([[true, 'new editor', `Name of ${adminLogin}`], [false, 'moved team', `Name of ${adminLogin}`]]);
    const csv = (await admin.call('GET', '/api/export/grant-history.csv')).body;
    expect(csv.split('\n')[0]).toBe('login,product,code,granted,by_name,at,reason');
    expect(csv).toContain(`granted${run},core,core.masterdata.edit,false,Name of ${adminLogin}`);
  });

  it('PL-02 a grant without a reason, or of a permission the product does not offer, is refused', async () => {
    const id = await makeEmployee(`noreason${run}`);
    const admin = await signIn(t.app, adminLogin);
    expect((await admin.call('PUT', `/api/employees/${id}/permissions`, { product: 'core', codes: ['core.masterdata.view'], reason: ' ' })).statusCode).toBe(400);
    expect((await admin.call('PUT', `/api/employees/${id}/permissions`, { product: 'core', codes: ['core.super.user'], reason: 'x' })).statusCode).toBe(400);
    expect((await admin.call('PUT', `/api/employees/${id}/permissions`, { product: 'core', codes: ['hello.note.sign'], reason: 'x' })).statusCode).toBe(400);
    expect(codes(await admin.call('GET', `/api/employees/${id}/permissions`))).toEqual([]);
  });

  it('PL-02 PL-06 the app login cannot change or remove grant history or the catalogue', async () => {
    expect(await sqlstate(t.sql`update permission_grant set reason = 'x'`)).toBe('42501');
    expect(await sqlstate(t.sql`delete from permission_grant`)).toBe('42501');
    expect(await sqlstate(t.sql`truncate permission_grant`)).toBe('42501');
    expect(await sqlstate(t.sql`insert into permission_event (product, code, label, active, by_name, reason) values ('core', 'core.x.y', 'x', true, 'x', 'x')`)).toBe('42501');
    const su = superuser();
    expect(await sqlstate(su`update permission_grant set reason = 'x'`)).toBe('42501');
    expect(await sqlstate(su`delete from permission_event`)).toBe('42501');
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
    const id = await makeEmployee(`forgot${run}`, ['core.masterdata.view']);
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
    const id = await makeEmployee(`old${run}`, ['core.masterdata.view']);
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
