// Slice A6: the customer config file and apply (PL-10), migration data checks (PL-13).
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import postgres from 'postgres';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { migrate } from '../db/migrate.js';
import { applyConfig, type Runtime } from '../deploy/apply.js';
import { checkConfig } from '../deploy/config.js';
import { enableLogin, sqlstate } from './db.js';

const PW = 'test-only-apply-password';
const rawSecrets = {
  logins: { postgres: PW, core_app: PW, hello_app: PW, ext_audit: PW },
  oidc: { jwks: { keys: [{ kty: 'test' }] }, cookie_keys: ['test-only-cookie-key-1'], clients: { hello: 'test-only-client-secret' } },
  backup: { type: 'drive', scope: 'drive.file', token: '{"access_token":"test-only"}' },
};
const base = {
  customer: 'ci', version: '0.6.0', domain: 'ci.example', offline: true, security_contact: 'security@ci.example',
  backup: { path: 'medhanta-backups/ci' },
  change_ref: 'CC-A1', reason: 'licence hello', licences: ['hello'], links: { hello: { master_data: ['equipment_v1'] } },
};
const check = (raw: object) => checkConfig(raw, rawSecrets);
const A = check(base).config;
const secrets = check(base).secrets!;
const started: string[][] = [];
/** Stand-in for Docker: records what it starts; containers of the config with change reference `failFor` stay unhealthy. */
const runtime = (failFor?: string): Runtime => ({
  start: async (c) => {
    started.push(c.licences);
    if (c.change_ref === failFor) throw new Error('health check failed: container core is not healthy');
  },
});

const su = (database: string) => postgres({ database, max: 1, onnotice: () => {} });
const as = (user: string, database: string, password = PW) => postgres({ database, username: user, password, max: 1, onnotice: () => {} });
const canSignIn = async (user: string, database: string) => {
  const c = as(user, database);
  try { return await sqlstate(c`select 1`); } finally { await c.end(); }
};

beforeAll(async () => { await applyConfig(A, secrets, runtime()); });
afterAll(async () => {
  // Leave the logins and links as the other test files expect them.
  await applyConfig(check({ ...base, change_ref: 'CC-A9', reason: 'test cleanup', links: {} }).config, secrets, runtime());
  for (const l of ['core_app', 'hello_app', 'logbook_app']) await enableLogin(l);
});

describe('PL-10 changes only through the config file, with change reference, tested and rolled back', () => {
  it('PL-10 a config without the customer change reference or reason is refused', () => {
    expect(() => check({ ...base, change_ref: '' })).toThrow();
    expect(() => check({ ...base, change_ref: undefined })).toThrow();
    expect(() => check({ ...base, reason: '  ' })).toThrow();
  });

  it('PL-10 a config that links an unlicensed product or lacks a secret is refused', () => {
    expect(() => check({ ...base, licences: [] })).toThrow(/not licensed/);
    expect(() => check({ ...base, outside_logins: { sap: { materials: ['material_v1'] } } })).toThrow(/provider is not licensed/);
    expect(() => check({ ...base, outside_logins: { bi: { hello: ['note_v1'] } } })).toThrow(/no password for login ext_bi/);
    expect(() => check({ ...base, licences: ['hello', 'unknown'] })).toThrow(/unknown product/);
  });

  it('PL-10 licence on: login with its secret password, roles loaded, links on and logged with the change reference', async () => {
    expect(await canSignIn('hello_app', 'hello')).toBe('ok');
    const hello = as('hello_app', 'master_data');
    expect(await sqlstate(hello`select from report.equipment_v1 limit 0`)).toBe('ok');
    await hello.end();
    const md = su('master_data');
    expect(await md`select change_ref, reason from platform.link_log where consumer = 'hello_app' order by id desc limit 1`)
      .toEqual([{ change_ref: 'CC-A1', reason: 'licence hello' }]);
    await md.end();
    const id = su('identity');
    expect((await id`select role from product_role where product = 'hello' order by role`).map((r) => r.role)).toContain('operator');
    await id.end();
    expect(started.at(-1)).toEqual(['hello']);
    // PL-12: what is on is recorded for the access review report.
    const id2 = su('identity');
    expect(await id2`select provider, consumer, view_name, change_ref from link_state where consumer = 'hello_app'`)
      .toEqual([{ provider: 'master_data', consumer: 'hello_app', view_name: 'equipment_v1', change_ref: 'CC-A1' }]);
    await id2.end();
  });

  it('PL-10 applying the same config again switches nothing', async () => {
    const md = su('master_data');
    const n = (await md`select count(*)::int as n from platform.link_log`)[0]!.n;
    await applyConfig(A, secrets, runtime(), A);
    expect((await md`select count(*)::int as n from platform.link_log`)[0]!.n).toBe(n);
    await md.end();
  });

  it('PL-10 a failing health check restores the previous state', async () => {
    const B = check({ ...base, change_ref: 'CC-B1', reason: 'BI reads notes', outside_logins: { audit: { hello: ['note_v1'] } } }).config;
    await expect(applyConfig(B, secrets, runtime('CC-B1'), A)).rejects.toThrow(/health check failed.*Rolled back to the previous config \(CC-A1\)/);
    expect(await canSignIn('ext_audit', 'hello')).toBe('28000');
    const h = su('hello');
    expect(await h`select view_name from platform.current_link where consumer = 'ext_audit'`).toEqual([]);
    expect(await h`select switched_on, change_ref, reason from platform.link_log where consumer = 'ext_audit' order by id desc limit 2`).toEqual([
      { switched_on: false, change_ref: 'CC-A1', reason: 'rollback: CC-B1 failed' },
      { switched_on: true, change_ref: 'CC-B1', reason: 'BI reads notes' },
    ]);
    await h.end();
  });

  it('PL-10 licence off: login off, open sessions ended, links cut, container removed; data kept', async () => {
    const open = as('hello_app', 'hello');
    await open`select 1`;
    await applyConfig(check({ ...base, change_ref: 'CC-C1', reason: 'licence ended', licences: [], links: {} }).config, secrets, runtime(), A);
    expect(await sqlstate(open`select 1`)).not.toBe('ok');
    await open.end().catch(() => {});
    expect(await canSignIn('hello_app', 'hello')).toBe('28000');
    const md = su('master_data');
    expect(await md`select view_name from platform.current_link where consumer = 'hello_app'`).toEqual([]);
    await md.end();
    expect(started.at(-1)).toEqual([]);
    const h = su('hello');
    expect(await h`select to_regclass('public.note') is not null as kept`).toEqual([{ kept: true }]);
    await h.end();
    await applyConfig(A, secrets, runtime());
    expect(await canSignIn('hello_app', 'hello')).toBe('ok');
  });
});

describe('PL-13 data-moving migrations are checked', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'pl13-'));
  const write = (name: string, text: string) => writeFileSync(path.join(dir, name), text);
  beforeAll(async () => { // the test database may be reused
    const h = su('hello');
    await h.unsafe(`drop table if exists pl13_old, pl13_new; delete from platform.migration where name like '900%'`);
    await h.end();
  });
  const countAndSum = `select count(*) as n, md5(string_agg(v, ',' order by v)) as sum from`;

  it('PL-13 a migration that loses a row fails its check and is rolled back', async () => {
    write('9001_pl13_old.sql', `create table pl13_old (v text); insert into pl13_old values ('a'), ('b'), ('c');`);
    write('9002_pl13_move.sql', `create table pl13_new (v text); insert into pl13_new select v from pl13_old where v <> 'c'; drop table pl13_old;`);
    write('9002_pl13_move.check.sql', `${countAndSum} pl13_old;\n-- after\n${countAndSum} pl13_new;\n`);
    await expect(migrate('hello', dir)).rejects.toThrow(/data check failed \(PL-13\), rolled back/);
    const h = su('hello');
    expect(await h`select to_regclass('pl13_old') is not null as old, to_regclass('pl13_new') is not null as new`).toEqual([{ old: true, new: false }]);
    expect(await h`select name from platform.migration where name like '9002%'`).toEqual([]);
    await h.end();
  });

  it('PL-13 the same move without loss passes its check and is recorded', async () => {
    write('9002_pl13_move.sql', `create table pl13_new (v text); insert into pl13_new select v from pl13_old; drop table pl13_old;`);
    expect(await migrate('hello', dir)).toEqual(['9002_pl13_move.sql']);
    const h = su('hello');
    expect(await h`select count(*)::int as n from pl13_new`).toEqual([{ n: 3 }]);
    await h.end();
  });
});
