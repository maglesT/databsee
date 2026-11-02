// Slice A9: the access review report (PL-12).
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { coreApp, makeEmployee, run, signIn, superuser } from './core.js';

let core: Awaited<ReturnType<typeof coreApp>>;
beforeAll(async () => { core = await coreApp(); });
afterAll(async () => { await core.app.close(); await core.sql.end(); await core.md.end(); });

describe('PL-12 access review report', () => {
  it('PL-12 the report lists every active grant and no revoked one, with the links that are on', async () => {
    await makeEmployee(`rev${run}`, ['identity_admin']);
    const kept = await makeEmployee(`kept${run}`, ['viewer', 'master_data_editor']);
    const su = superuser();
    await su`insert into grant_event (employee_id, product, role, granted, by_name, reason) values (${kept}, 'core', 'master_data_editor', false, 'test', 'left the team')`;
    await su`insert into link_state (provider, consumer, view_name, change_ref) values ('master_data', ${`ext_audit${run}`}, 'equipment_v1', 'CC-R1')
             on conflict do nothing`;
    await su.end();
    const admin = await signIn(core.app, `rev${run}`);
    const r = await admin.call('GET', '/api/access-review');
    expect(r.statusCode).toBe(200);
    const row = (login: string, role: string) => new RegExp(`<td>${login}</td>(<td>[^<]*</td>){3}<td>${role}</td>`);
    expect(r.body).toMatch(row(`kept${run}`, 'viewer'));
    expect(r.body).not.toMatch(row(`kept${run}`, 'master_data_editor'));
    expect(r.body).toMatch(row(`rev${run}`, 'identity_admin'));
    expect(r.body).toContain(`<td>ext_audit${run}</td><td>master_data</td><td>equipment_v1</td>`);
  });

  it('PL-12 only identity administrators can open the report', async () => {
    await makeEmployee(`view${run}`, ['viewer']);
    expect((await (await signIn(core.app, `view${run}`)).call('GET', '/api/access-review')).statusCode).toBe(403);
    expect((await core.app.inject({ url: '/api/access-review' })).statusCode).toBe(401);
  });

  it('PL-12 core can read the link state but not change it', async () => {
    await expect(core.sql`delete from link_state`).rejects.toMatchObject({ code: '42501' });
    await expect(core.sql`select count(*) from link_state`).resolves.toBeTruthy();
  });
});
