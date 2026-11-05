// Slice A4: master data in core, and its published views read by a linked product.
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import postgres from 'postgres';
import { coreApp, makeEmployee, run, signIn } from './core.js';
import { enableLogin, sqlstate } from './db.js';

let t: Awaited<ReturnType<typeof coreApp>>;
let editor: Awaited<ReturnType<typeof signIn>>;
const code = (s: string) => `${s}-${run}`.toUpperCase();

beforeAll(async () => {
  t = await coreApp();
  await makeEmployee(`mdedit${run}`, ['core.masterdata.edit']);
  editor = await signIn(t.app, `mdedit${run}`);
});
afterAll(async () => { await t.sql.end(); await t.md.end(); });

async function add(kind: string, c: string, name: string, fields: object = {}) {
  const res = await editor.call('POST', '/api/items', { kind, code: c, name, fields, reason: 'initial load' });
  expect(res.statusCode, res.body).toBe(200);
  return res.json().id as string;
}

describe('PL-01 only master-data editors change master data', () => {
  it('PL-01 a viewer reads but cannot add or change', async () => {
    await makeEmployee(`mdview${run}`, ['core.masterdata.view']);
    const viewer = await signIn(t.app, `mdview${run}`);
    expect((await viewer.call('GET', '/api/items?kind=room')).statusCode).toBe(200);
    expect((await viewer.call('POST', '/api/items', { kind: 'room', code: code('VR'), name: 'x', reason: 'r' })).statusCode).toBe(403);
    await makeEmployee(`mdnone${run}`);
    expect((await (await signIn(t.app, `mdnone${run}`)).call('GET', '/api/items')).statusCode).toBe(403);
  });
});

describe('PL-06 audit trail of master data', () => {
  it('PL-06 a change needs a reason; every version stays readable with who, when and why', async () => {
    const id = await add('equipment', code('GR'), 'Granulator', { make: 'Acme' });
    expect((await editor.call('PATCH', `/api/items/${id}`, { name: 'Granulator 2', reason: '' })).statusCode).toBe(400);
    expect((await editor.call('PATCH', `/api/items/${id}`, { name: 'Rapid mixer granulator', reason: 'name per URS' })).statusCode).toBe(200);
    const h = (await editor.call('GET', `/api/items/${id}/history`)).json();
    expect(h.versions.map((v: { name: string; reason: string; changed_by_name: string }) => [v.name, v.reason, v.changed_by_name]))
      .toEqual([['Granulator', 'initial load', `Name of mdedit${run}`], ['Rapid mixer granulator', 'name per URS', `Name of mdedit${run}`]]);
  });

  it('PL-06 versions, items and links cannot be changed or deleted', async () => {
    expect(await sqlstate(t.md`update item_version set name = 'x'`)).toBe('42501');
    expect(await sqlstate(t.md`delete from item`)).toBe('42501');
    expect(await sqlstate(t.md`update link_event set reason = 'x'`)).toBe('42501');
  });

  it('PL-06 a code is never reused within its kind, and fields are checked', async () => {
    await add('room', code('R1'), 'Granulation room');
    expect((await editor.call('POST', '/api/items', { kind: 'room', code: code('R1'), name: 'Other', reason: 'r' })).statusCode).toBe(409);
    expect((await editor.call('POST', '/api/items', { kind: 'material', code: code('M0'), name: 'No unit', fields: { category: 'starting' }, reason: 'r' })).statusCode).toBe(400);
    await add('material', code('MI'), 'Granulate intermediate', { category: 'intermediate', unit: 'kg' });
    expect((await editor.call('POST', '/api/items', { kind: 'material', code: code('MX'), name: 'Bad category', fields: { category: 'bulk', unit: 'kg' }, reason: 'r' })).statusCode).toBe(400);
    expect((await editor.call('POST', '/api/items', { kind: 'room', code: code('R9'), name: 'x', fields: { colour: 'red' }, reason: 'r' })).statusCode).toBe(400);
  });

  it('PL-06 the history exports as readable CSV, links included', async () => {
    const res = await editor.call('GET', '/api/export/master-data-history.csv');
    expect(res.body.split('\n')[0]).toBe('kind,code,version,name,fields,active,changed_by_name,changed_at,reason');
    expect(res.body).toContain(`equipment,${code('GR')},2,Rapid mixer granulator`);
  });
});

describe('PL-08 products read master data live through the views', () => {
  it('PL-08 a linked product sees the current version, its room, and retired items as inactive', async () => {
    const room = await add('room', code('R2'), 'Compression room', { grade: 'D' });
    const press = await add('equipment', code('TP'), 'Tablet press', { make: 'Fette' });
    expect((await editor.call('POST', '/api/item-links', { fromId: press, toId: room, type: 'located_in', active: true, reason: 'installed' })).statusCode).toBe(200);

    const su = postgres({ database: 'master_data', onnotice: () => {}, max: 1 });
    await su`select platform.set_link('hello_app', array['equipment_v1', 'room_v1'], true, 'CC-MD', 'hello reads equipment')`;
    await enableLogin('hello_app');
    const hello = postgres({ database: 'master_data', username: 'hello_app', password: 'test-only', onnotice: () => {}, max: 1 });

    const read = async () => (await hello`select code, name, version, active, room_code, read_at, data_as_of from report.equipment_v1 where code = ${code('TP')}`)[0];
    expect(await read()).toMatchObject({ name: 'Tablet press', version: 1, active: true, room_code: code('R2') });

    await editor.call('PATCH', `/api/items/${press}`, { name: 'Tablet press 2', reason: 'renamed' });
    expect(await read()).toMatchObject({ name: 'Tablet press 2', version: 2 });          // live: no copy anywhere
    await editor.call('PATCH', `/api/items/${press}`, { active: false, reason: 'retired' });
    expect(await read()).toMatchObject({ active: false });

    expect(await sqlstate(hello`select * from public.item_version`)).toBe('42501');            // never the raw tables
    expect(await sqlstate(hello`select * from report.material_v1`)).toBe('42501');         // only the linked views
    await su`select platform.set_link('hello_app', array['equipment_v1', 'room_v1'], false, 'CC-MD2', 'cleanup')`;
    expect(await sqlstate(read())).toBe('42501');
    await hello.end();
    await su.end();
  });

  it('PL-08 moving equipment to another room ends the old location; links only join the right kinds', async () => {
    const r3 = await add('room', code('R3'), 'Room 3');
    const r4 = await add('room', code('R4'), 'Room 4');
    const eq = await add('equipment', code('BL'), 'Blender');
    const supplier = await add('supplier', code('S1'), 'Supplier one');
    await editor.call('POST', '/api/item-links', { fromId: eq, toId: r3, type: 'located_in', active: true, reason: 'installed' });
    await editor.call('POST', '/api/item-links', { fromId: eq, toId: r4, type: 'located_in', active: true, reason: 'moved' });
    const h = (await editor.call('GET', `/api/items/${eq}/history`)).json();
    expect(h.current.map((l: { to_code: string }) => l.to_code)).toEqual([code('R4')]);
    expect((await editor.call('POST', '/api/item-links', { fromId: eq, toId: supplier, type: 'supplied_by', active: true, reason: 'x' })).statusCode).toBe(400);
  });
});
