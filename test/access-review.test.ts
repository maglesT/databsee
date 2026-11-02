// Slice A9: the access review report (PL-12).
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { coreApp, makeEmployee, run, signIn, superuser } from './core.js';

let core: Awaited<ReturnType<typeof coreApp>>;
beforeAll(async () => { core = await coreApp(); });
afterAll(async () => { await core.app.close(); await core.sql.end(); await core.md.end(); });

describe('PL-12 access review report', () => {
  it('PL-12 the report lists every active permission (code and label) and no revoked one, with the links that are on', async () => {
    await makeEmployee(`rev${run}`, ['core.people.manage']);
    const kept = await makeEmployee(`kept${run}`, ['core.masterdata.view', 'core.masterdata.edit']);
    const su = superuser();
    await su`insert into permission_grant (employee_id, product, code, granted, by_name, reason) values (${kept}, 'core', 'core.masterdata.edit', false, 'test', 'left the team')`;
    await su`insert into link_state (provider, consumer, view_name, change_ref) values ('master_data', ${`ext_audit${run}`}, 'equipment_v1', 'CC-R1')
             on conflict do nothing`;
    await su.end();
    const admin = await signIn(core.app, `rev${run}`);
    const r = await admin.call('GET', '/api/access-review');
    expect(r.statusCode).toBe(200);
    const row = (login: string, code: string) => new RegExp(`<td>${login}</td>(<td>[^<]*</td>){3}<td>${code}</td>`);
    expect(r.body).toMatch(new RegExp(`<td>kept${run}</td><td>Name of kept${run}</td><td>yes</td><td>core</td><td>core.masterdata.view</td><td>Read master data</td><td>test</td>`));
    expect(r.body).not.toMatch(row(`kept${run}`, 'core.masterdata.edit'));
    expect(r.body).toMatch(row(`rev${run}`, 'core.people.manage'));
    expect(r.body).toContain(`<td>ext_audit${run}</td><td>master_data</td><td>equipment_v1</td>`);
  });

  it('PL-12 only people with core.people.manage can open the report', async () => {
    await makeEmployee(`view${run}`, ['core.masterdata.view']);
    expect((await (await signIn(core.app, `view${run}`)).call('GET', '/api/access-review')).statusCode).toBe(403);
    expect((await core.app.inject({ url: '/api/access-review' })).statusCode).toBe(401);
  });

  it('PL-12 core can read the link state but not change it', async () => {
    await expect(core.sql`delete from link_state`).rejects.toMatchObject({ code: '42501' });
    await expect(core.sql`select count(*) from link_state`).resolves.toBeTruthy();
  });
});
