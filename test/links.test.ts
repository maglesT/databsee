// Slice A1: the database server, link switch and link log.
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type pg from 'pg';
import { admin, enableLogin, login, sqlstate } from './db.js';

let hello: pg.Client;

beforeAll(async () => {
  await enableLogin('hello_app');
  await enableLogin('logbook_app');
  await enableLogin('core_app');
  hello = admin('hello');
  await hello.connect();
  // A provider table and its published view, as a product migration would create them.
  await hello.query(`
    set role hello_owner;
    create table if not exists note (id int primary key, text text not null);
    insert into note values (1, 'first') on conflict do nothing;
    create or replace view report.note_v1 with (security_barrier) as select id, text, now() as read_at from note;
    create or replace view report.other_v1 with (security_barrier) as select id from note;
    reset role;
    select platform.set_link('logbook_app', array['note_v1', 'other_v1'], false, 'TEST', 'reset before tests');`);
});

afterAll(async () => { await hello.end(); });

const PERMISSION_DENIED = '42501';

describe('PL-08 read-only exchange through published views', () => {
  it('PL-08 without a link a product cannot even connect to another product database', async () => {
    expect(await sqlstate(login('logbook_app', 'hello').connect())).toBe(PERMISSION_DENIED);
    expect(await sqlstate(login('logbook_app', 'master_data').connect())).toBe(PERMISSION_DENIED);
  });

  it('PL-08 a linked product reads the view but never the raw table, and cannot write', async () => {
    await hello.query(`select platform.set_link('logbook_app', array['note_v1'], true, 'CC-1', 'logbook reads notes')`);
    const c = login('logbook_app', 'hello');
    await c.connect();
    expect((await c.query('select text from report.note_v1')).rows).toEqual([{ text: 'first' }]);
    expect(await sqlstate(c.query('select * from public.note'))).toBe(PERMISSION_DENIED);
    expect(await sqlstate(c.query('select * from report.other_v1'))).toBe(PERMISSION_DENIED);
    expect(await sqlstate(c.query(`insert into public.note values (2, 'x')`))).toBe(PERMISSION_DENIED);
    expect(await sqlstate(c.query('create temp table t (x int)'))).toBe(PERMISSION_DENIED);
    expect(await sqlstate(c.query(`select platform.set_link('logbook_app', array['other_v1'], true, 'x', 'x')`))).toBe(PERMISSION_DENIED);
    await c.end();
  });

  it('PL-08 a cut link is refused from the next query on, on the same open connection', async () => {
    await hello.query(`select platform.set_link('logbook_app', array['note_v1'], true, 'CC-2', 'on')`);
    const c = login('logbook_app', 'hello');
    await c.connect();
    expect(await sqlstate(c.query('select 1 from report.note_v1'))).toBe('ok');
    await hello.query(`select platform.set_link('logbook_app', array['note_v1'], false, 'CC-3', 'cut')`);
    expect(await sqlstate(c.query('select 1 from report.note_v1'))).toBe(PERMISSION_DENIED);
    await c.end();
    // With no view left, CONNECT goes too.
    expect(await sqlstate(login('logbook_app', 'hello').connect())).toBe(PERMISSION_DENIED);
  });

  it('PL-08 cutting one view keeps the others of the same consumer', async () => {
    await hello.query(`select platform.set_link('logbook_app', array['note_v1', 'other_v1'], true, 'CC-4', 'on')`);
    await hello.query(`select platform.set_link('logbook_app', array['other_v1'], false, 'CC-5', 'cut one')`);
    const c = login('logbook_app', 'hello');
    await c.connect();
    expect(await sqlstate(c.query('select 1 from report.note_v1'))).toBe('ok');
    await c.end();
    const { rows } = await hello.query(`select view_name from platform.current_link where consumer = 'logbook_app'`);
    expect(rows).toEqual([{ view_name: 'note_v1' }]);
    await hello.query(`select platform.set_link('logbook_app', array['note_v1'], false, 'CC-6', 'cleanup')`);
  });

  it('PL-08 only published report views can be linked, never raw tables or the own app', async () => {
    expect(await sqlstate(hello.query(`select platform.set_link('logbook_app', array['note'], true, 'x', 'x')`))).toBe('P0001');
    expect(await sqlstate(hello.query(`select platform.set_link('logbook_app', array['missing_v1'], true, 'x', 'x')`))).toBe('P0001');
    expect(await sqlstate(hello.query(`select platform.set_link('hello_app', array['note_v1'], true, 'x', 'x')`))).toBe('P0001');
    expect(await sqlstate(hello.query(`select platform.set_link('postgres', array['note_v1'], true, 'x', 'x')`))).toBe('P0001');
  });

  it('PL-08 each app connects to its own database only', async () => {
    const own = login('hello_app', 'hello');
    expect(await sqlstate(own.connect())).toBe('ok');
    await own.end();
    for (const db of ['master_data', 'identity']) {
      const c = login('core_app', db);
      expect(await sqlstate(c.connect())).toBe('ok');
      await c.end();
    }
    expect(await sqlstate(login('core_app', 'hello').connect())).toBe(PERMISSION_DENIED);
  });
});

describe('PL-02 link switches are recorded and never overwritten', () => {
  it('PL-02 switching on and off writes one log row each, with change reference, reason and installer', async () => {
    const before = Number((await hello.query('select count(*) from platform.link_log')).rows[0].count);
    await hello.query(`select platform.set_link('logbook_app', array['note_v1'], true, 'CC-10', 'on')`);
    await hello.query(`select platform.set_link('logbook_app', array['note_v1'], false, 'CC-11', 'off')`);
    const { rows } = await hello.query(
      'select consumer, views, switched_on, change_ref, reason, applied_by from platform.link_log where id > (select max(id) - 2 from platform.link_log) order by id');
    expect(rows).toEqual([
      { consumer: 'logbook_app', views: ['note_v1'], switched_on: true, change_ref: 'CC-10', reason: 'on', applied_by: 'postgres' },
      { consumer: 'logbook_app', views: ['note_v1'], switched_on: false, change_ref: 'CC-11', reason: 'off', applied_by: 'postgres' },
    ]);
    expect(Number((await hello.query('select count(*) from platform.link_log')).rows[0].count)).toBe(before + 2);
  });

  it('PL-02 a switch without change reference or reason is refused and changes nothing', async () => {
    expect(await sqlstate(hello.query(`select platform.set_link('logbook_app', array['note_v1'], true, ' ', 'x')`))).toBe('23514');
    expect(await sqlstate(hello.query(`select platform.set_link('logbook_app', array['note_v1'], true, 'x', '')`))).toBe('23514');
    const { rows } = await hello.query(`select count(*) from platform.current_link where consumer = 'logbook_app'`);
    expect(rows[0].count).toBe('0');
  });

  it('PL-02 the log cannot be changed or emptied, not even by the installer', async () => {
    expect(await sqlstate(hello.query(`update platform.link_log set reason = 'changed'`))).toBe(PERMISSION_DENIED);
    expect(await sqlstate(hello.query('delete from platform.link_log'))).toBe(PERMISSION_DENIED);
    expect(await sqlstate(hello.query('truncate platform.link_log'))).toBe(PERMISSION_DENIED);
  });

  it('PL-02 the own app cannot read or write the link log', async () => {
    const c = login('hello_app', 'hello');
    await c.connect();
    expect(await sqlstate(c.query('select * from platform.link_log'))).toBe(PERMISSION_DENIED);
    await c.end();
  });
});
