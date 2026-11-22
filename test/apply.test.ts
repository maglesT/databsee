// Slice A6: the customer config file and apply (PL-10), migration data checks (PL-13).
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import postgres from 'postgres';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { migrate } from '../db/migrate.js';
import { applyConfig, caddyfile, dbPortEnv, externalPort, imageTags, loadPermissions, migrateRun, productEnv, productHost, type Runtime } from '../deploy/apply.js';
import { allProducts, checkConfig, checkManifest, manifest, readYaml, ROOT, type Manifest } from '../deploy/config.js';
import { enableLogin, sqlstate } from './db.js';
import { makeEmployee, run } from './core.js';

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
const migratedOwn: string[] = [];
/** Stand-in for Docker: records what it starts; containers of the config with change reference `failFor` stay unhealthy. */
const runtime = (failFor?: string): Runtime => ({
  start: async (c) => {
    started.push(c.licences);
    if (c.change_ref === failFor) throw new Error('health check failed: container core is not healthy');
  },
  migrateOwn: async (p) => { migratedOwn.push(p); },
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

  it('PL-08 D-75 core itself may read a licensed product\'s views (reader "core", login core_app), never its own databases', async () => {
    const withCore = check({ ...base, change_ref: 'CC-K1', links: { ...base.links, core: { hello: ['note_v1'] } } }).config;
    expect(() => check({ ...base, links: { core: { master_data: ['equipment_v1'] } } })).toThrow(/does not link to itself/);
    expect(() => check({ ...base, links: { core: { logbook: ['entry_v1'] } } })).toThrow(/provider is not licensed/);
    await applyConfig(withCore, secrets, runtime(), A);
    const h = su('hello'), id = su('identity');
    try {
      expect(await h`select view_name from platform.current_link where consumer = 'core_app'`).toEqual([{ view_name: 'note_v1' }]);
      expect(await id`select provider, view_name, change_ref from link_state where consumer = 'core_app'`).toEqual([{ provider: 'hello', view_name: 'note_v1', change_ref: 'CC-K1' }]);
      await applyConfig(A, secrets, runtime(), withCore);
      expect(await h`select view_name from platform.current_link where consumer = 'core_app'`).toEqual([]);
    } finally { await h.end(); await id.end(); }
  });

  it('PL-10 the proxy serves core and each licensed product: the platform caddy, or the host proxy on 127.0.0.1 ports', () => {
    expect(A.proxy).toBe('caddy');
    expect(caddyfile(A)).toBe('ci.example {\n  reverse_proxy core:3000\n}\nhello.ci.example {\n  reverse_proxy hello:3000\n}\n');
    const ext = check({ ...base, proxy: 'external' }).config;
    expect(caddyfile(ext)).toBe('ci.example {\n  reverse_proxy 127.0.0.1:8100\n}\nhello.ci.example {\n  reverse_proxy 127.0.0.1:8101\n}\n');
    expect(() => check({ ...base, proxy: 'nginx' })).toThrow();
    // Every product has its own fixed host port (a product without one could not be licensed with proxy: external).
    const ports = ['core', ...allProducts()].map(externalPort);
    expect(new Set(ports).size).toBe(ports.length);
  });

  it('PL-10 the database host port is set in the config (default 5432), for a host where another PostgreSQL owns 5432', () => {
    expect(A.db_port).toBe(5432);
    const moved = check({ ...base, db_port: 5440 }).config;
    expect(moved.db_port).toBe(5440);
    expect(dbPortEnv(moved)).toBe('MEDHANTA_PG_PORT=5440\n');
    expect(() => check({ ...base, db_port: 80 })).toThrow();
    expect(() => check({ ...base, db_port: '5440' })).toThrow();
    // compose publishes the database on 127.0.0.1 only, at that port.
    expect(readFileSync(path.join(ROOT, 'deploy/compose.yml'), 'utf8')).toContain('"127.0.0.1:${MEDHANTA_PG_PORT:-5432}:5432"');
  });

  it('PL-10 licence on: login with its secret password, permissions loaded, links on and logged with the change reference', async () => {
    expect(await canSignIn('hello_app', 'hello')).toBe('ok');
    const hello = as('hello_app', 'master_data');
    expect(await sqlstate(hello`select from report.equipment_v1 limit 0`)).toBe('ok');
    await hello.end();
    const md = su('master_data');
    expect(await md`select change_ref, reason from platform.link_log where consumer = 'hello_app' order by id desc limit 1`)
      .toEqual([{ change_ref: 'CC-A1', reason: 'licence hello' }]);
    await md.end();
    const id = su('identity');
    expect(await id`select code, label from current_permission where product = 'hello' order by code`)
      .toEqual([{ code: 'hello.note.read', label: 'Read notes' }, { code: 'hello.note.sign', label: 'Write and sign notes' }]);
    await id.end();
    expect(started.at(-1)).toEqual(['hello']);
    // PL-12: what is on is recorded for the access review report.
    const id2 = su('identity');
    expect(await id2`select provider, consumer, view_name, change_ref, switched_on_at is not null as dated from link_state where consumer = 'hello_app'`)
      .toEqual([{ provider: 'master_data', consumer: 'hello_app', view_name: 'equipment_v1', change_ref: 'CC-A1', dated: true }]);
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

describe('PL-01 the permission catalogue comes from the licensed manifests', () => {
  it('PL-01 apply loads the catalogue idempotently and marks removed codes inactive, revoking them', async () => {
    const id = su('identity');
    const events = async () => (await id`select count(*)::int as n from permission_event`)[0]!.n;
    const before = await events();
    await applyConfig(A, secrets, runtime(), A);
    expect(await events()).toBe(before);                        // same manifests: nothing written

    const p = `probe${run}`;
    const m = (permissions: Manifest['permissions']): Manifest => ({ product: p, database: p, publishes: [], permissions });
    await loadPermissions(id, [manifest('hello'), m([{ code: `${p}.a.do`, label: 'A' }, { code: `${p}.b.do`, label: 'B' }])], 'CC-P1: probe');
    await loadPermissions(id, [manifest('hello'), m([{ code: `${p}.a.do`, label: 'A' }, { code: `${p}.b.do`, label: 'B' }])], 'CC-P1: probe');
    expect(await events()).toBe(before + 2);
    const holder = await makeEmployee(`probe${run}`, [`${p}.b.do`]);
    await loadPermissions(id, [manifest('hello'), m([{ code: `${p}.a.do`, label: 'A renamed' }])], 'CC-P2: b dropped');
    expect(await id`select code, label from current_permission where product = ${p} order by code`).toEqual([{ code: `${p}.a.do`, label: 'A renamed' }]);
    expect(await id`select code, label, active, by_name, reason from permission_event where product = ${p} order by id`).toEqual([
      { code: `${p}.a.do`, label: 'A', active: true, by_name: 'apply', reason: 'CC-P1: probe' },
      { code: `${p}.b.do`, label: 'B', active: true, by_name: 'apply', reason: 'CC-P1: probe' },
      { code: `${p}.a.do`, label: 'A renamed', active: true, by_name: 'apply', reason: 'CC-P2: b dropped' },
      { code: `${p}.b.do`, label: 'B', active: false, by_name: 'apply', reason: 'CC-P2: b dropped' },
    ]);
    expect(await id`select code from current_permission_grant where employee_id = ${holder}`).toEqual([]);
    expect(await id`select granted, reason from permission_grant where employee_id = ${holder} order by id`)
      .toEqual([{ granted: true, reason: 'test' }, { granted: false, reason: `permission removed from ${p} (CC-P2: b dropped)` }]);
    // D-21: a product no longer licensed keeps its codes and its people's grants (dormant), and gets them back as they
    // were when it is licensed again: nothing is written either way.
    const holderA = await makeEmployee(`probea${run}`, [`${p}.a.do`]);
    const off = await events();
    await loadPermissions(id, [manifest('hello')], 'CC-P3: licence off');
    expect(await id`select code from current_permission where product = ${p}`).toEqual([{ code: `${p}.a.do` }]);
    expect(await id`select code from current_permission_grant where employee_id = ${holderA}`).toEqual([{ code: `${p}.a.do` }]);
    await loadPermissions(id, [manifest('hello'), m([{ code: `${p}.a.do`, label: 'A renamed' }])], 'CC-P4: licence on');
    expect(await events()).toBe(off);
    expect(await id`select code from current_permission_grant where employee_id = ${holderA}`).toEqual([{ code: `${p}.a.do` }]);
    expect((await id`select count(*)::int as n from current_permission where product = 'core'`)[0]!.n).toBe(3);
    await id.end();
  });

  it('PL-01 a manifest with a malformed, foreign, unlabelled or repeated permission code is refused', () => {
    const ok = manifest('hello');
    const bad = (permissions: Manifest['permissions']) => () => checkManifest({ ...ok, permissions }, 'hello');
    expect(bad([{ code: 'hello.Note.sign', label: 'x' }])).toThrow(/must look like/);
    expect(bad([{ code: 'core.people.manage', label: 'x' }])).toThrow(/must look like/);
    expect(bad([{ code: 'hello', label: 'x' }])).toThrow(/must look like/);
    expect(bad([{ code: 'hello.note.read', label: ' ' }])).toThrow(/needs a label/);
    expect(bad([{ code: 'hello.note.read', label: 'x' }, { code: 'hello.note.read', label: 'y' }])).toThrow(/twice/);
    expect(bad([])).toThrow(/list of permissions/);
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

describe('PL-08 the Logbook, a product kept in its own repo (D-29)', () => {
  const logbook = {
    ...base, licences: ['hello', 'logbook'],
    links: { hello: { master_data: ['equipment_v1'] }, logbook: { master_data: ['equipment_v1', 'instrument_v1', 'room_v1', 'product_v1'] } },
  };
  const raw = {
    ...rawSecrets,
    logins: { ...rawSecrets.logins, logbook_app: PW },
    oidc: { ...rawSecrets.oidc, clients: { ...rawSecrets.oidc.clients, logbook: 'test-only-client-secret' } },
    env: { logbook: { GEMINI_API_KEY: 'test-only-key' } },
  };

  it('PL-08 the Logbook gets its own database, the master data of its link, sign-on and its own extra settings', () => {
    const { config, secrets: s } = checkConfig(logbook, raw);
    const env = productEnv(config, s!, 'logbook');
    expect(Object.keys(env).sort()).toEqual(['GEMINI_API_KEY', 'LOGBOOK_DATABASE_URL', 'MASTER_DATA_DATABASE_URL',
      'OIDC_CLIENT_SECRET', 'OIDC_ISSUER', 'OIDC_REDIRECT_URI']);
    expect(env.LOGBOOK_DATABASE_URL).toMatch(/^postgres:\/\/logbook_app:.*@db:5432\/logbook$/);
    expect(env.OIDC_REDIRECT_URI).toBe('https://logbook.ci.example/cb');
    expect(productEnv(config, s!, 'hello')).not.toHaveProperty('GEMINI_API_KEY');
    // Item status for TrueBatch (Logbook D-45, D-28).
    expect(manifest('logbook').publishes).toEqual(['equipment_v1', 'entry_v1', 'calibration_v1', 'logbook_sop_v1', 'overdue_v1', 'equipment_status_v1', 'reliability_v1']);
  });

  it('PL-10 its image is pinned to a full commit; its extra settings do not stop a config that does not license it', () => {
    expect(imageTags().LOGBOOK_COMMIT).toBe(manifest('logbook').source!.commit);
    expect(imageTags().LOGBOOK_COMMIT).toMatch(/^[0-9a-f]{40}$/);
    expect(() => checkConfig(base, raw)).not.toThrow();   // e.g. the previous config, checked again on rollback
  });
});

describe('Material Management, a product kept in its own repo (MMS D-55)', () => {
  const mms = {
    ...base, licences: ['hello', 'mms'],
    links: { hello: { master_data: ['equipment_v1'] }, mms: { master_data: ['material_v1', 'supplier_v1', 'product_v1', 'room_v1'] } },
  };
  const raw = {
    ...rawSecrets,
    logins: { ...rawSecrets.logins, mms_app: PW },
    oidc: { ...rawSecrets.oidc, clients: { ...rawSecrets.oidc.clients, mms: 'test-only-client-secret' } },
  };

  it('PL-01 MMS offers its 22 permission codes, all its own', () => {
    const m = manifest('mms');
    expect(m.permissions).toHaveLength(22);
    expect(m.permissions.every((p) => p.code.startsWith('mms.'))).toBe(true);
  });

  it('PL-08 MMS gets its own database, the master data of its link and sign-on, and reads only what its manifest lists', () => {
    const { config, secrets: s } = checkConfig(mms, raw);
    const env = productEnv(config, s!, 'mms');
    expect(Object.keys(env).sort()).toEqual(['MASTER_DATA_DATABASE_URL', 'MMS_DATABASE_URL', 'OIDC_CLIENT_SECRET', 'OIDC_ISSUER', 'OIDC_REDIRECT_URI']);
    expect(env.MMS_DATABASE_URL).toMatch(/^postgres:\/\/mms_app:.*@db:5432\/mms$/);
    expect(env.OIDC_REDIRECT_URI).toBe('https://mms.ci.example/cb');
    expect(mms.links.mms.master_data).toEqual(manifest('mms').reads!.master_data);
    expect(manifest('mms').publishes).toEqual(['lot_v1', 'lot_test_v1']);   // lots and QC numbers for TrueBatch (MMS D-56, D-28)
  });

  it('PL-10 its image is pinned to a full commit', () => {
    expect(imageTags().MMS_COMMIT).toBe(manifest('mms').source!.commit);
    expect(imageTags().MMS_COMMIT).toMatch(/^[0-9a-f]{40}$/);
  });
});

describe('QMS, a product kept in its own repo (QMS D-11)', () => {
  const qms = {
    ...base, licences: ['hello', 'qms'],
    links: { hello: { master_data: ['equipment_v1'] }, qms: { master_data: ['product_v1', 'supplier_v1'] } },
  };
  const raw = {
    ...rawSecrets,
    logins: { ...rawSecrets.logins, qms_app: PW },
    oidc: { ...rawSecrets.oidc, clients: { ...rawSecrets.oidc.clients, qms: 'test-only-client-secret' } },
  };

  it('PL-01 QMS offers its 4 permission codes, all its own', () => {
    const m = manifest('qms');
    expect(m.permissions.map((p) => p.code)).toEqual(['qms.record.work', 'qms.qa.sign', 'qms.ap.sign', 'qms.audit.read']);
  });

  it('PL-08 QMS gets its own database, the master data of its link and sign-on; Deviations only once that link is on', () => {
    const { config, secrets: s } = checkConfig(qms, raw);
    const env = productEnv(config, s!, 'qms');
    expect(Object.keys(env).sort()).toEqual(['MASTER_DATA_DATABASE_URL', 'OIDC_CLIENT_SECRET', 'OIDC_ISSUER', 'OIDC_REDIRECT_URI', 'QMS_DATABASE_URL']);
    expect(env.QMS_DATABASE_URL).toMatch(/^postgres:\/\/qms_app:.*@db:5432\/qms$/);
    expect(env.OIDC_REDIRECT_URI).toBe('https://qms.ci.example/cb');
    expect(manifest('qms').reads).toEqual({ master_data: ['product_v1', 'supplier_v1', 'material_v1'], deviations: ['capa_v1', 'deviation_v1'],   // QMS D-18: deviations linked; D-21 materials of supplier approvals
      truebatch: ['batch_fact_v1', 'material_use_v1'], truebatch_packing: ['packing_batch_v1', 'material_use_v1'], truebatch_injectables: ['batch_fact_v1', 'material_use_v1'],   // QMS D-19: PQR filled from the platform; D-22 materials used
      truebatch_injectables_packing: ['packing_batch_v1', 'material_use_v1'], truebatch_api: ['batch_fact_v1', 'material_use_v1'], qual: ['qualification_v1'],
      truebatch_capsules: ['batch_fact_v1', 'material_use_v1'], truebatch_liquids: ['batch_fact_v1', 'material_use_v1'], truebatch_capsules_packing: ['packing_batch_v1', 'material_use_v1'],   // D-109 readers round 2
      truebatch_liquids_packing: ['packing_batch_v1', 'material_use_v1'], lims: ['oos_v1', 'stability_v1', 'trend_v1'], mms: ['lot_v1'], ops: ['cpv_summary_v1'] });   // D-129 PQR reads CPV (QMS D-24)   // D-110: PQR starting materials (QMS D-22)
    expect(manifest('qms').publishes).toEqual(['change_v1', 'document_v1', 'risk_v1', 'supplier_approval_v1', 'capa_v1']);   // change controls for TrueBatch (QMS D-16, D-28); documents in force (QMS D-19), risk register (QMS D-20); CAPAs (QMS D-23)
    // Deviations is not licensed here, so the link cannot be switched on.
    expect(() => checkConfig({ ...qms, links: { ...qms.links, qms: { ...qms.links.qms, deviations: ['capa_v1'] } } }, raw)).toThrow(/provider is not licensed/);
  });

  it('PL-10 its image is pinned to a full commit', () => {
    expect(imageTags().QMS_COMMIT).toBe(manifest('qms').source!.commit);
    expect(imageTags().QMS_COMMIT).toMatch(/^[0-9a-f]{40}$/);
  });
});

describe('Qualification Protocols, a product kept in its own repo (prot D-21)', () => {
  const qual = {
    ...base, licences: ['hello', 'qual'],
    links: { hello: { master_data: ['equipment_v1'] }, qual: { master_data: ['equipment_v1', 'instrument_v1', 'room_v1', 'product_v1'] } },   // prot D-28: products for the cleaning matrix
  };
  const raw = {
    ...rawSecrets,
    logins: { ...rawSecrets.logins, qual_app: PW },
    oidc: { ...rawSecrets.oidc, clients: { ...rawSecrets.oidc.clients, qual: 'test-only-client-secret' } },
  };

  it('PL-01 Protocols offers its 13 permission codes, all its own', () => {
    const m = manifest('qual');
    expect(m.permissions).toHaveLength(13);
    expect(m.permissions.every((p) => p.code.startsWith('qual.'))).toBe(true);
  });

  it('PL-08 Protocols gets its own database, the master data of its link and sign-on, and reads only what its manifest lists', () => {
    const { config, secrets: s } = checkConfig(qual, raw);
    const env = productEnv(config, s!, 'qual');
    expect(Object.keys(env).sort()).toEqual(['MASTER_DATA_DATABASE_URL', 'OIDC_CLIENT_SECRET', 'OIDC_ISSUER', 'OIDC_REDIRECT_URI', 'QUAL_DATABASE_URL']);
    expect(env.QUAL_DATABASE_URL).toMatch(/^postgres:\/\/qual_app:.*@db:5432\/qual$/);
    expect(env.OIDC_REDIRECT_URI).toBe('https://qual.ci.example/cb');
    expect(qual.links.qual.master_data).toEqual(manifest('qual').reads!.master_data);
  });

  it('PL-10 its image is pinned to a full commit', () => {
    expect(imageTags().QUAL_COMMIT).toBe(manifest('qual').source!.commit);
    expect(imageTags().QUAL_COMMIT).toMatch(/^[0-9a-f]{40}$/);
  });
});

describe('Deviations & CAPA, a product kept in its own repo (Deviations D-42)', () => {
  const dev = {
    ...base, licences: ['hello', 'logbook', 'deviations'],
    links: {
      hello: { master_data: ['equipment_v1'] },
      deviations: { identity: ['employee_v1'], logbook: ['equipment_v1', 'entry_v1', 'calibration_v1', 'logbook_sop_v1', 'overdue_v1'] },
    },
  };
  const raw = {
    ...rawSecrets,
    logins: { ...rawSecrets.logins, logbook_app: PW, deviations_app: PW },
    oidc: { ...rawSecrets.oidc, clients: { ...rawSecrets.oidc.clients, logbook: 'test-only-client-secret', deviations: 'test-only-client-secret' } },
  };

  it('PL-01 Deviations offers its 12 permission codes, all its own', () => {
    const m = manifest('deviations');
    expect(m.permissions).toHaveLength(12);
    expect(m.permissions.every((p) => p.code.startsWith('deviations.'))).toBe(true);
  });

  it('PL-08 Deviations gets its own database, the identity and Logbook databases of its links and sign-on, and reads only what its manifest lists', () => {
    const { config, secrets: s } = checkConfig(dev, raw);
    const env = productEnv(config, s!, 'deviations');
    expect(Object.keys(env).sort()).toEqual(['DEVIATIONS_DATABASE_URL', 'IDENTITY_DATABASE_URL', 'LOGBOOK_DATABASE_URL',
      'OIDC_CLIENT_SECRET', 'OIDC_ISSUER', 'OIDC_REDIRECT_URI']);
    expect(env.DEVIATIONS_DATABASE_URL).toMatch(/^postgres:\/\/deviations_app:.*@db:5432\/deviations$/);
    expect(env.LOGBOOK_DATABASE_URL).toMatch(/^postgres:\/\/deviations_app:.*@db:5432\/logbook$/);
    expect(env.OIDC_REDIRECT_URI).toBe('https://deviations.ci.example/cb');
    const { truebatch: fromTrueBatch, truebatch_packing: fromPacking, truebatch_injectables: fromInjectables, truebatch_injectables_packing: fromInjectablesPacking,
      truebatch_capsules: fromCapsules, truebatch_capsules_packing: fromCapsulesPacking, truebatch_liquids: fromLiquids, truebatch_liquids_packing: fromLiquidsPacking, truebatch_api: fromApi, lims: fromLims, qms: fromQms, ops: fromOps, ...reads } = manifest('deviations').reads!;
    expect(fromOps).toEqual(['cpv_signal_v1']);   // D-129 CPV signals QA sent (Deviations D-66)
    expect(fromQms).toEqual(['capa_v1']);   // QMS owns CAPA while linked (Deviations D-63, QMS D-23)
    expect(fromLims).toEqual(['oos_v1']);   // OOS phase II picked from LIMS once licensed (Deviations D-60, D-109)
    expect(dev.links.deviations).toEqual(reads);
    expect(fromTrueBatch).toEqual(['batch_fact_v1', 'equipment_use_v1', 'deviation_note_v1']);   // TrueBatch once licensed (Deviations D-51, D-28)
    expect(fromPacking).toEqual(['packing_batch_v1', 'equipment_use_v1', 'deviation_note_v1']);   // TrueBatch Tablets Packing once licensed (Deviations D-53, D-31; D-57 reads its batches and uses)
    expect(fromInjectables).toEqual(['batch_fact_v1', 'equipment_use_v1', 'deviation_note_v1']);   // TrueBatch Injectables once licensed (Deviations D-54, D-48; D-57)
    expect(fromInjectablesPacking).toEqual(['packing_batch_v1', 'equipment_use_v1', 'deviation_note_v1']);   // TrueBatch Injectables Packing once licensed (Deviations D-55; D-57)
    for (const r of [fromCapsules, fromLiquids, fromApi]) expect(r).toEqual(['batch_fact_v1', 'equipment_use_v1', 'deviation_note_v1']);   // Capsules, Oral Liquids, API once licensed (Deviations D-59)
    for (const r of [fromCapsulesPacking, fromLiquidsPacking]) expect(r).toEqual(['packing_batch_v1', 'equipment_use_v1', 'deviation_note_v1']);   // their packing products (Deviations D-59)
    expect(manifest('deviations').publishes).toEqual(['capa_v1', 'deviation_v1']);   // read by the QMS through a link (Deviations D-40)
  });

  it('PL-08 the QMS reads capa_v1 through a link once Deviations is licensed', () => {
    const both = { ...dev, licences: [...dev.licences, 'qms'],
      links: { ...dev.links, qms: { master_data: ['product_v1', 'supplier_v1'], deviations: ['capa_v1'] } } };
    const secrets = { ...raw, logins: { ...raw.logins, qms_app: PW }, oidc: { ...raw.oidc, clients: { ...raw.oidc.clients, qms: 'test-only-client-secret' } } };
    const { config, secrets: s } = checkConfig(both, secrets);
    expect(productEnv(config, s!, 'qms').DEVIATIONS_DATABASE_URL).toMatch(/^postgres:\/\/qms_app:.*@db:5432\/deviations$/);
  });

  it('PL-10 its image is pinned to a full commit', () => {
    expect(imageTags().DEVIATIONS_COMMIT).toBe(manifest('deviations').source!.commit);
    expect(imageTags().DEVIATIONS_COMMIT).toMatch(/^[0-9a-f]{40}$/);
  });
});

describe('Recruitment, a product kept in its own repo (Recruitment D-74)', () => {
  const rec = {
    ...base, licences: ['hello', 'recruitment'],
    links: { hello: { master_data: ['equipment_v1'] }, recruitment: { identity: ['employee_v1'] } },
  };
  const raw = {
    ...rawSecrets,
    logins: { ...rawSecrets.logins, recruitment_app: PW },
    oidc: { ...rawSecrets.oidc, clients: { ...rawSecrets.oidc.clients, recruitment: 'test-only-client-secret' } },
  };

  it('PL-01 Recruitment offers its 14 permission codes, all its own', () => {
    const codes = manifest('recruitment').permissions.map((p) => p.code);
    expect(codes).toHaveLength(14);   // + recruitment.training.record, recruitment.training.approve (Recruitment D-81)
    expect(codes.every((c) => c.startsWith('recruitment.'))).toBe(true);
  });

  it('PL-08 Recruitment gets its own database, the staff directory of its identity link and sign-on; no master data', () => {
    const { config, secrets: s } = checkConfig(rec, raw);
    const env = productEnv(config, s!, 'recruitment');
    expect(Object.keys(env).sort()).toEqual(['IDENTITY_DATABASE_URL', 'OIDC_CLIENT_SECRET', 'OIDC_ISSUER', 'OIDC_REDIRECT_URI', 'RECRUITMENT_DATABASE_URL']);
    expect(env.RECRUITMENT_DATABASE_URL).toMatch(/^postgres:\/\/recruitment_app:.*@db:5432\/recruitment$/);
    expect(env.IDENTITY_DATABASE_URL).toMatch(/^postgres:\/\/recruitment_app:.*@db:5432\/identity$/);
    expect(manifest('recruitment').reads).toEqual({ identity: ['employee_v1'], qms: ['document_v1'] });   // D-124 SOPs from QMS (Recruitment D-85)
  });

  it('PL-10 its image is pinned to a full commit', () => {
    expect(imageTags().RECRUITMENT_COMMIT).toBe(manifest('recruitment').source!.commit);
    expect(imageTags().RECRUITMENT_COMMIT).toMatch(/^[0-9a-f]{40}$/);
  });
});

describe('Operations, a product kept in its own repo (Operations D-19)', () => {
  const ops = {
    ...base, licences: ['hello', 'ops'],
    links: { hello: { master_data: ['equipment_v1'] }, ops: { master_data: ['equipment_v1', 'product_v1'] } },
  };
  const raw = {
    ...rawSecrets,
    logins: { ...rawSecrets.logins, ops_app: PW },
    oidc: { ...rawSecrets.oidc, clients: { ...rawSecrets.oidc.clients, ops: 'test-only-client-secret' } },
  };

  it('PL-01 Operations offers its 12 permission codes, all its own', () => {
    const m = manifest('ops');
    expect(m.permissions).toHaveLength(12);
    expect(m.permissions.every((p) => p.code.startsWith('ops.'))).toBe(true);
  });

  it('PL-08 Operations gets its own database, the master data of its link and sign-on; the Logbook only when licensed and linked', () => {
    const { config, secrets: s } = checkConfig(ops, raw);
    const env = productEnv(config, s!, 'ops');
    expect(Object.keys(env).sort()).toEqual(['MASTER_DATA_DATABASE_URL', 'OIDC_CLIENT_SECRET', 'OIDC_ISSUER', 'OIDC_REDIRECT_URI', 'OPS_DATABASE_URL']);
    expect(env.OPS_DATABASE_URL).toMatch(/^postgres:\/\/ops_app:.*@db:5432\/ops$/);
    expect(env.OIDC_REDIRECT_URI).toBe('https://ops.ci.example/cb');
    expect(() => checkConfig({ ...ops, links: { ...ops.links, ops: { ...ops.links.ops, logbook: ['equipment_v1', 'entry_v1'] } } }, raw))
      .toThrow(/link ops -> logbook: provider is not licensed/);
  });

  it('PL-08 with the Logbook licensed and linked, Operations reads its views (MTBF/MTTR: reliability_v1, Ops D-27) through LOGBOOK_DATABASE_URL', () => {
    const views = ['equipment_v1', 'entry_v1', 'reliability_v1'];
    expect(manifest('ops').reads!.logbook).toEqual(views);
    expect(views.every((v) => manifest('logbook').publishes.includes(v))).toBe(true);
    const withLogbook = { ...ops, licences: [...ops.licences, 'logbook'], links: { ...ops.links, ops: { ...ops.links.ops, logbook: views } } };
    const rawLogbook = { ...raw, logins: { ...raw.logins, logbook_app: PW }, oidc: { ...raw.oidc, clients: { ...raw.oidc.clients, logbook: 'test-only-client-secret' } } };
    const { config, secrets: s } = checkConfig(withLogbook, rawLogbook);
    expect(productEnv(config, s!, 'ops').LOGBOOK_DATABASE_URL).toMatch(/^postgres:\/\/ops_app:.*@db:5432\/logbook$/);
  });

  it('PL-10 its image is pinned to a full commit', () => {
    expect(imageTags().OPS_COMMIT).toBe(manifest('ops').source!.commit);
    expect(imageTags().OPS_COMMIT).toMatch(/^[0-9a-f]{40}$/);
  });
});

describe('TrueBatch Tablets, a product kept in its own repo (D-27)', () => {
  const tb = {
    ...base, licences: ['hello', 'truebatch'],
    links: { hello: { master_data: ['equipment_v1'] }, truebatch: { master_data: ['equipment_v1', 'instrument_v1', 'room_v1', 'material_v1', 'product_v1'] } },
  };
  const raw = {
    ...rawSecrets,
    logins: { ...rawSecrets.logins, truebatch_app: PW },
    oidc: { ...rawSecrets.oidc, clients: { ...rawSecrets.oidc.clients, truebatch: 'test-only-client-secret' } },
  };

  it('PL-01 TrueBatch offers its 12 permission codes, all its own, the demo skip among them', () => {
    const codes = manifest('truebatch').permissions.map((p) => p.code);
    expect(codes).toHaveLength(12);
    expect(codes.every((c) => c.startsWith('truebatch.'))).toBe(true);
    expect(codes).toContain('truebatch.demo.skip');   // works only with TRUEBATCH_DEMO=1 (D-30)
    expect(manifest('truebatch').signon).toEqual({ backchannel_logout: '/backchannel-logout' });
  });

  it('PL-08 TrueBatch gets its own database, the master data of its link and sign-on; Deviations, QMS, Logbook and MMS only once linked', () => {
    const { config, secrets: s } = checkConfig(tb, raw);
    const env = productEnv(config, s!, 'truebatch');
    expect(Object.keys(env).sort()).toEqual(['MASTER_DATA_DATABASE_URL', 'OIDC_CLIENT_SECRET', 'OIDC_ISSUER', 'OIDC_REDIRECT_URI', 'TRUEBATCH_DATABASE_URL']);
    expect(env.TRUEBATCH_DATABASE_URL).toMatch(/^postgres:\/\/truebatch_app:.*@db:5432\/truebatch$/);
    expect(env.MASTER_DATA_DATABASE_URL).toMatch(/^postgres:\/\/truebatch_app:.*@db:5432\/master_data$/);
    expect(env.OIDC_REDIRECT_URI).toBe('https://truebatch.ci.example/cb');
    expect(tb.links.truebatch.master_data).toEqual(manifest('truebatch').reads!.master_data);
    expect(Object.keys(manifest('truebatch').reads!)).toEqual(['master_data', 'deviations', 'qms', 'logbook', 'mms', 'recruitment', 'lims']);   // lims: CoAs and results (round 40, D-109)   // training_v1 (TB-23)
    expect(manifest('truebatch').publishes).toEqual(['batch_fact_v1', 'equipment_use_v1', 'deviation_note_v1', 'material_use_v1', 'lab_request_v1', 'reading_v1', 'master_lab_field_v1']);   // D-135 in-process lab fields of masters for LIMS; D-112 in-process lab requests; D-128 readings for CPV
    expect(() => checkConfig({ ...tb, links: { ...tb.links, truebatch: { ...tb.links.truebatch, deviations: ['deviation_v1'] } } }, raw))
      .toThrow(/link truebatch -> deviations: provider is not licensed/);
    expect(caddyfile({ ...config, proxy: 'external' })).toContain('truebatch.ci.example {\n  reverse_proxy 127.0.0.1:8110\n}');
  });

  it('PL-08 the TrueBatch links (D-28): every view read is published by its provider; each reader gets the provider\'s database only through its link', () => {
    const pairs: [string, string][] = [['truebatch', 'deviations'], ['truebatch', 'qms'], ['truebatch', 'logbook'], ['truebatch', 'mms'], ['logbook', 'truebatch'], ['deviations', 'truebatch']];
    for (const [reader, provider] of pairs) {
      const views = manifest(reader).reads![provider]!;
      expect(views.length, `${reader} -> ${provider}`).toBeGreaterThan(0);
      expect(views.filter((v) => !manifest(provider).publishes.includes(v)), `${reader} -> ${provider}`).toEqual([]);
    }
    expect(manifest('logbook').reads!.truebatch).toEqual(['batch_fact_v1', 'equipment_use_v1']);
    expect(manifest('deviations').reads!.truebatch).toEqual(['batch_fact_v1', 'equipment_use_v1', 'deviation_note_v1']);

    const all = {
      ...tb, licences: ['hello', 'truebatch', 'deviations', 'qms', 'logbook', 'mms'],
      links: {
        ...tb.links,
        truebatch: { ...tb.links.truebatch, deviations: ['deviation_v1'], qms: ['change_v1'], logbook: ['equipment_status_v1'], mms: ['lot_v1', 'lot_test_v1'] },
        logbook: { master_data: ['equipment_v1'], truebatch: ['batch_fact_v1', 'equipment_use_v1'] },
        deviations: { truebatch: ['batch_fact_v1', 'equipment_use_v1', 'deviation_note_v1'] },
      },
    };
    const secretsAll = {
      ...raw,
      logins: { ...raw.logins, deviations_app: PW, qms_app: PW, logbook_app: PW, mms_app: PW },
      oidc: { ...raw.oidc, clients: { ...raw.oidc.clients, deviations: 'test-only-client-secret', qms: 'test-only-client-secret',
        logbook: 'test-only-client-secret', mms: 'test-only-client-secret' } },
    };
    const { config, secrets: s } = checkConfig(all, secretsAll);
    const env = productEnv(config, s!, 'truebatch');
    for (const db of ['deviations', 'qms', 'logbook', 'mms'])
      expect(env[`${db.toUpperCase()}_DATABASE_URL`]).toMatch(new RegExp(`^postgres://truebatch_app:.*@db:5432/${db}$`));
    expect(productEnv(config, s!, 'logbook').TRUEBATCH_DATABASE_URL).toMatch(/^postgres:\/\/logbook_app:.*@db:5432\/truebatch$/);
    expect(productEnv(config, s!, 'deviations').TRUEBATCH_DATABASE_URL).toMatch(/^postgres:\/\/deviations_app:.*@db:5432\/truebatch$/);
    expect(productEnv(config, s!, 'qms')).not.toHaveProperty('TRUEBATCH_DATABASE_URL');   // a provider gets nothing of its reader
    // Without the TrueBatch licence, neither the Logbook nor Deviations may link to it.
    const off = { ...all, licences: all.licences.filter((p) => p !== 'truebatch'), links: { logbook: all.links.logbook, deviations: all.links.deviations } };
    expect(() => checkConfig(off, secretsAll)).toThrow(/link logbook -> truebatch: provider is not licensed; link deviations -> truebatch: provider is not licensed/);
  });

  it('PL-10 its image is pinned to a full commit', () => {
    expect(imageTags().TRUEBATCH_COMMIT).toBe(manifest('truebatch').source!.commit);
    expect(imageTags().TRUEBATCH_COMMIT).toMatch(/^[0-9a-f]{40}$/);
  });
});

describe('TrueBatch Tablets Packing, a second product from the TrueBatch repo (D-29)', () => {
  const md = ['equipment_v1', 'instrument_v1', 'room_v1', 'material_v1', 'product_v1'];
  const tp = {
    ...base, licences: ['hello', 'truebatch_packing'],
    links: { hello: { master_data: ['equipment_v1'] }, truebatch_packing: { master_data: md } },
  };
  const raw = {
    ...rawSecrets,
    logins: { ...rawSecrets.logins, truebatch_packing_app: PW },
    oidc: { ...rawSecrets.oidc, clients: { ...rawSecrets.oidc.clients, truebatch_packing: 'test-only-client-secret' } },
  };

  it('PL-01 Packing offers its 12 permission codes, all its own, QC approval and the demo skip among them', () => {
    const codes = manifest('truebatch_packing').permissions.map((p) => p.code);
    expect(codes).toHaveLength(12);
    expect(codes.every((c) => c.startsWith('truebatch_packing.'))).toBe(true);
    expect(codes).toContain('truebatch_packing.qc.approve');
    expect(codes).toContain('truebatch_packing.demo.skip');   // works only with TRUEBATCH_DEMO=1 (D-30)
    // TrueBatch's codes stay TrueBatch's: no code of one product starts with the other's name and a dot.
    expect(manifest('truebatch').permissions.some((p) => p.code.startsWith('truebatch_packing.'))).toBe(false);
    expect(manifest('truebatch_packing').signon).toEqual({ backchannel_logout: '/backchannel-logout' });
  });

  it('PL-08 Packing gets its own database and login, the master data of its link and sign-on at truebatch-packing.<domain>', () => {
    const { config, secrets: s } = checkConfig(tp, raw);
    const env = productEnv(config, s!, 'truebatch_packing');
    expect(Object.keys(env).sort()).toEqual(['MASTER_DATA_DATABASE_URL', 'OIDC_CLIENT_SECRET', 'OIDC_ISSUER', 'OIDC_REDIRECT_URI', 'TRUEBATCH_PACKING_DATABASE_URL']);
    expect(env.TRUEBATCH_PACKING_DATABASE_URL).toMatch(/^postgres:\/\/truebatch_packing_app:.*@db:5432\/truebatch_packing$/);
    expect(env.MASTER_DATA_DATABASE_URL).toMatch(/^postgres:\/\/truebatch_packing_app:.*@db:5432\/master_data$/);
    // A host name has no "_" (certificate authorities refuse it): the product is served at truebatch-packing.<domain>.
    expect(productHost('truebatch_packing', 'ci.example')).toBe('truebatch-packing.ci.example');
    expect(productHost('truebatch', 'ci.example')).toBe('truebatch.ci.example');
    expect(env.OIDC_REDIRECT_URI).toBe('https://truebatch-packing.ci.example/cb');
    expect(caddyfile({ ...config, proxy: 'external' })).toContain('truebatch-packing.ci.example {\n  reverse_proxy 127.0.0.1:8111\n}');
    expect(caddyfile(config)).toContain('truebatch-packing.ci.example {\n  reverse_proxy truebatch_packing:3000\n}');
    expect(tp.links.truebatch_packing.master_data).toEqual(manifest('truebatch_packing').reads!.master_data);
    expect(manifest('truebatch_packing').publishes).toEqual(['packing_batch_v1', 'equipment_use_v1', 'material_use_v1', 'deviation_note_v1', 'lab_request_v1', 'master_lab_field_v1']);
    // It reads the released bulk batches of TrueBatch Tablets only while TrueBatch is licensed and linked.
    expect(() => checkConfig({ ...tp, links: { ...tp.links, truebatch_packing: { ...tp.links.truebatch_packing, truebatch: ['batch_fact_v1'] } } }, raw))
      .toThrow(/link truebatch_packing -> truebatch: provider is not licensed/);
    expect(() => checkConfig({ ...tp, licences: ['hello'] }, raw)).toThrow(/link reader "truebatch_packing" is not licensed/);
  });

  it('PL-08 the Packing links: every view read is published by its provider; each provider URL comes only with its link', () => {
    const reads = manifest('truebatch_packing').reads!;
    expect(Object.keys(reads)).toEqual(['master_data', 'truebatch', 'mms', 'logbook', 'deviations', 'qms', 'recruitment', 'lims']);   // training_v1 (TB-23)
    expect(reads.truebatch).toEqual(['batch_fact_v1', 'deviation_note_v1']);   // the bulk batch's open deviations block packing release (S24)
    for (const provider of ['truebatch', 'mms', 'logbook', 'deviations', 'qms'])
      expect(reads[provider]!.filter((v) => !manifest(provider).publishes.includes(v)), provider).toEqual([]);
    const all = {
      ...tp, licences: ['hello', 'truebatch_packing', 'truebatch', 'mms', 'logbook', 'deviations', 'qms'],
      links: { ...tp.links, truebatch_packing: { master_data: md, truebatch: ['batch_fact_v1'], mms: ['lot_v1', 'lot_test_v1'], logbook: ['equipment_status_v1'],
        deviations: ['deviation_v1'], qms: ['change_v1'] } },
    };
    const secretsAll = {
      ...raw,
      logins: { ...raw.logins, truebatch_app: PW, mms_app: PW, logbook_app: PW, deviations_app: PW, qms_app: PW },
      oidc: { ...raw.oidc, clients: { ...raw.oidc.clients, truebatch: 'test-only-client-secret', mms: 'test-only-client-secret',
        logbook: 'test-only-client-secret', deviations: 'test-only-client-secret', qms: 'test-only-client-secret' } },
    };
    const { config, secrets: s } = checkConfig(all, secretsAll);
    const env = productEnv(config, s!, 'truebatch_packing');
    for (const db of ['truebatch', 'mms', 'logbook', 'deviations', 'qms'])
      expect(env[`${db.toUpperCase()}_DATABASE_URL`]).toMatch(new RegExp(`^postgres://truebatch_packing_app:.*@db:5432/${db}$`));
    expect(productEnv(config, s!, 'truebatch')).not.toHaveProperty('TRUEBATCH_PACKING_DATABASE_URL');   // a provider gets nothing of its reader
    expect(caddyfile({ ...config, proxy: 'external' })).toContain('truebatch.ci.example {\n  reverse_proxy 127.0.0.1:8110\n}');
  });

  it('PL-10 its image is built at the same pinned commit as TrueBatch, from the repo\'s ops/packing.Dockerfile', () => {
    expect(imageTags().TRUEBATCH_PACKING_COMMIT).toBe(manifest('truebatch_packing').source!.commit);
    expect(imageTags().TRUEBATCH_PACKING_COMMIT).toMatch(/^[0-9a-f]{40}$/);
    expect(manifest('truebatch_packing').source!.repo).toBe(manifest('truebatch').source!.repo);
    expect(manifest('truebatch_packing').source!.commit).toBe(manifest('truebatch').source!.commit);
    expect(manifest('truebatch_packing').source!.dockerfile).toBe('ops/packing.Dockerfile');
    expect(manifest('truebatch').source!.dockerfile).toBeUndefined();   // ops/Dockerfile
    const compose = readFileSync(path.join(ROOT, 'deploy/compose.yml'), 'utf8');
    expect(compose).toContain('image: medhanta/truebatch_packing:${TRUEBATCH_PACKING_COMMIT:-none}');
    expect(readFileSync(path.join(ROOT, 'deploy/bundle.sh'), 'utf8')).toContain(`jq -r '.source.dockerfile // "ops/Dockerfile"'`);
  });

  it('PL-10 apply runs its own migrator (packing/migrate.ts) in its image as truebatch_packing_owner, not db/migrate.ts', async () => {
    expect(manifest('truebatch_packing').migrate).toEqual({ command: ['node', 'dist/packing/migrate.js'] });
    const run = migrateRun('truebatch_packing', 'pw/with:odd@chars');
    expect(run.args).toEqual(['--profile', 'truebatch_packing', 'run', '--rm', '-e', 'MIGRATION_DATABASE_URL', 'truebatch_packing', 'node', 'dist/packing/migrate.js']);
    expect(Object.keys(run.env)).toEqual(['MIGRATION_DATABASE_URL']);
    expect(run.env.MIGRATION_DATABASE_URL).toBe('postgres://postgres:pw%2Fwith%3Aodd%40chars@db:5432/truebatch_packing?options=-c%20role%3Dtruebatch_packing_owner');
    expect(() => migrateRun('truebatch', 'pw')).toThrow(/no "migrate"/);

    migratedOwn.length = 0;
    const { config, secrets: s } = checkConfig({ ...tp, change_ref: 'CC-TP1', reason: 'licence TrueBatch Tablets Packing' }, raw);
    await applyConfig(config, s!, runtime());
    expect(migratedOwn).toEqual(['truebatch_packing']);
    // Its database exists (init.sh), and the platform's own migration table stays empty: the product migrates itself.
    const c = su('truebatch_packing');
    try {
      expect(await c`select to_regclass('platform.migration') is null as none`).toEqual([{ none: true }]);
    } finally { await c.end(); }
    // The migrator's URL (here to the test server) gives a session as the database's owner, as db/migrate.ts uses.
    const url = new URL(run.env.MIGRATION_DATABASE_URL!.replace('db:5432', `${process.env.PGHOST ?? '127.0.0.1'}:${process.env.PGPORT ?? '5432'}`));
    url.password = encodeURIComponent(process.env.PGPASSWORD ?? '');
    url.username = process.env.PGUSER ?? 'postgres';
    const m = postgres(url.toString(), { max: 1, onnotice: () => {} });
    try {
      expect(await m`select current_user as role, current_database() as db`).toEqual([{ role: 'truebatch_packing_owner', db: 'truebatch_packing' }]);
    } finally { await m.end(); }
    expect(await canSignIn('truebatch_packing_app', 'truebatch_packing')).toBe('ok');
    await applyConfig(A, secrets, runtime());
    expect(await canSignIn('truebatch_packing_app', 'truebatch_packing')).not.toBe('ok');
  });

  it('PL-10 "migrate" is a command, and source.dockerfile a path inside the repo', () => {
    const m = { ...manifest('truebatch_packing') };
    const notACommand = (v: unknown) => v as { command: string[] };
    expect(() => checkManifest({ ...m, migrate: { command: [] } }, 'truebatch_packing')).toThrow(/may only be \{"command"/);
    expect(() => checkManifest({ ...m, migrate: { command: [''] } }, 'truebatch_packing')).toThrow(/may only be \{"command"/);
    expect(() => checkManifest({ ...m, migrate: notACommand('node migrate.js') }, 'truebatch_packing')).toThrow(/may only be \{"command"/);
    expect(() => checkManifest({ ...m, migrate: notACommand('own') }, 'truebatch_packing')).toThrow(/may only be \{"command"/);   // Batchwright's "own" was retired with it (D-72)
    expect(() => checkManifest({ ...m, source: undefined }, 'truebatch_packing')).toThrow(/for a product with a source/);
    for (const dockerfile of ['/etc/Dockerfile', '../other/Dockerfile', 'ops/../../x', 'ops/Docker file', ''])
      expect(() => checkManifest({ ...m, source: { ...m.source!, dockerfile } }, 'truebatch_packing'), dockerfile).toThrow(/source.dockerfile/);
    expect(checkManifest({ ...m, source: { ...m.source!, dockerfile: 'ops/Dockerfile' } }, 'truebatch_packing').source!.dockerfile).toBe('ops/Dockerfile');
  });
});

describe('Release 1.5.0: what both TrueBatch products used, read by the Logbook and MMS; the demo skip (D-30)', () => {
  const md = ['equipment_v1', 'instrument_v1', 'room_v1', 'material_v1', 'product_v1'];
  const all = {
    ...base, licences: ['hello', 'truebatch', 'truebatch_packing', 'logbook', 'mms'],
    links: {
      hello: { master_data: ['equipment_v1'] },
      truebatch: { master_data: md }, truebatch_packing: { master_data: md },
      logbook: { master_data: ['equipment_v1'], truebatch: ['batch_fact_v1', 'equipment_use_v1'], truebatch_packing: ['equipment_use_v1'] },
      mms: { master_data: ['material_v1'], truebatch: ['material_use_v1'], truebatch_packing: ['material_use_v1'] },
    },
  };
  const raw = {
    ...rawSecrets,
    logins: { ...rawSecrets.logins, truebatch_app: PW, truebatch_packing_app: PW, logbook_app: PW, mms_app: PW },
    oidc: { ...rawSecrets.oidc, clients: { ...rawSecrets.oidc.clients, truebatch: 'test-only-client-secret',
      truebatch_packing: 'test-only-client-secret', logbook: 'test-only-client-secret', mms: 'test-only-client-secret' } },
  };

  it('PL-08 the Logbook reads both products\' equipment_use_v1, MMS both products\' material_use_v1; each view is published; each URL comes only with its link', () => {
    expect(manifest('logbook').reads!.truebatch).toEqual(['batch_fact_v1', 'equipment_use_v1']);   // Logbook D-46
    expect(manifest('logbook').reads!.truebatch_packing).toEqual(['equipment_use_v1', 'packing_batch_v1']);   // Logbook D-47, D-61
    expect(manifest('mms').reads!.truebatch).toEqual(['material_use_v1', 'batch_fact_v1']);   // D-112: MMS D-75 knows a batch from its issue                        // MMS D-57
    expect(manifest('mms').reads!.truebatch_packing).toEqual(['material_use_v1', 'packing_batch_v1']);   // MMS D-58, D-64
    for (const reader of ['logbook', 'mms'])
      for (const provider of ['truebatch', 'truebatch_packing'])
        expect(manifest(reader).reads![provider]!.filter((v) => !manifest(provider).publishes.includes(v)), `${reader} -> ${provider}`).toEqual([]);

    const { config, secrets: s } = checkConfig(all, raw);
    const logbook = productEnv(config, s!, 'logbook'), mms = productEnv(config, s!, 'mms');
    expect(logbook.TRUEBATCH_DATABASE_URL).toMatch(/^postgres:\/\/logbook_app:.*@db:5432\/truebatch$/);
    expect(logbook.TRUEBATCH_PACKING_DATABASE_URL).toMatch(/^postgres:\/\/logbook_app:.*@db:5432\/truebatch_packing$/);
    expect(mms.TRUEBATCH_DATABASE_URL).toMatch(/^postgres:\/\/mms_app:.*@db:5432\/truebatch$/);
    expect(mms.TRUEBATCH_PACKING_DATABASE_URL).toMatch(/^postgres:\/\/mms_app:.*@db:5432\/truebatch_packing$/);
    // Each link on its own: without the packing link, MMS gets no packing URL (and keeps TrueBatch's).
    const { truebatch_packing: _cut, ...mmsTablets } = all.links.mms;
    const one = checkConfig({ ...all, links: { ...all.links, mms: mmsTablets } }, raw);
    expect(productEnv(one.config, one.secrets!, 'mms')).not.toHaveProperty('TRUEBATCH_PACKING_DATABASE_URL');
    expect(productEnv(one.config, one.secrets!, 'mms').TRUEBATCH_DATABASE_URL).toMatch(/@db:5432\/truebatch$/);
    // Without the Packing licence, neither may link to it.
    expect(() => checkConfig({ ...all, licences: all.licences.filter((p) => p !== 'truebatch_packing'),
      links: { logbook: all.links.logbook, mms: all.links.mms } }, raw))
      .toThrow(/link logbook -> truebatch_packing: provider is not licensed; link mms -> truebatch_packing: provider is not licensed/);
  });

  it('PL-10 TRUEBATCH_DEMO (skip a wait) comes only from the customer\'s own secrets, for the product named there; never by default', () => {
    const plain = checkConfig(all, raw);
    for (const p of all.licences) expect(productEnv(plain.config, plain.secrets!, p), p).not.toHaveProperty('TRUEBATCH_DEMO');
    // Neither the example config nor the secrets template sets it, so a new customer copied from them has no demo skip.
    const template = readYaml(path.join(ROOT, 'customers/example.secrets.template.yaml')) as { env?: object };
    expect(template.env).toEqual({});
    expect(readFileSync(path.join(ROOT, 'customers/example.yaml'), 'utf8')).not.toMatch(/TRUEBATCH_DEMO/);

    const demo = checkConfig(all, { ...raw, env: { truebatch: { TRUEBATCH_DEMO: '1' }, truebatch_packing: { TRUEBATCH_DEMO: '1' } } });
    expect(productEnv(demo.config, demo.secrets!, 'truebatch').TRUEBATCH_DEMO).toBe('1');
    expect(productEnv(demo.config, demo.secrets!, 'truebatch_packing').TRUEBATCH_DEMO).toBe('1');
    for (const p of ['hello', 'logbook', 'mms']) expect(productEnv(demo.config, demo.secrets!, p), p).not.toHaveProperty('TRUEBATCH_DEMO');
    // A setting is text: an unquoted 1 in the secrets is refused, not taken as a number.
    expect(() => checkConfig(all, { ...raw, env: { truebatch: { TRUEBATCH_DEMO: 1 } } })).toThrow();
    // A name the platform sets (database, sign-on) cannot be replaced from the secrets.
    const clash = checkConfig(all, { ...raw, env: { truebatch: { TRUEBATCH_DATABASE_URL: 'postgres://x@elsewhere/x', OIDC_ISSUER: 'https://evil.example' } } });
    expect(productEnv(clash.config, clash.secrets!, 'truebatch').TRUEBATCH_DATABASE_URL).toMatch(/^postgres:\/\/truebatch_app:.*@db:5432\/truebatch$/);
    expect(productEnv(clash.config, clash.secrets!, 'truebatch').OIDC_ISSUER).toBe('https://ci.example/oidc');
  });
});

describe('Release 1.6.0: Deviations files TrueBatch Tablets Packing\'s deviation notes as it files TrueBatch\'s (D-31)', () => {
  const md = ['equipment_v1', 'instrument_v1', 'room_v1', 'material_v1', 'product_v1'];
  const all = {
    ...base, licences: ['hello', 'truebatch', 'truebatch_packing', 'deviations'],
    links: {
      hello: { master_data: ['equipment_v1'] },
      truebatch: { master_data: md }, truebatch_packing: { master_data: md },
      deviations: { truebatch: ['batch_fact_v1', 'equipment_use_v1', 'deviation_note_v1'], truebatch_packing: ['deviation_note_v1'] },
    },
  };
  const raw = {
    ...rawSecrets,
    logins: { ...rawSecrets.logins, truebatch_app: PW, truebatch_packing_app: PW, deviations_app: PW },
    oidc: { ...rawSecrets.oidc, clients: { ...rawSecrets.oidc.clients, truebatch: 'test-only-client-secret',
      truebatch_packing: 'test-only-client-secret', deviations: 'test-only-client-secret' } },
  };

  it('PL-08 Deviations reads Packing\'s deviation_note_v1, published by Packing with TrueBatch\'s name; the URL comes only with the link', () => {
    expect(manifest('truebatch_packing').publishes).toContain('deviation_note_v1');
    expect(manifest('truebatch').publishes).toContain('deviation_note_v1');                        // the same view name in both (Deviations D-53)
    expect(manifest('deviations').reads!.truebatch_packing).toEqual(['packing_batch_v1', 'equipment_use_v1', 'deviation_note_v1']);   // D-57 replaces D-53: its batches and uses are read
    expect(manifest('deviations').reads!.truebatch).toEqual(['batch_fact_v1', 'equipment_use_v1', 'deviation_note_v1']);   // stays (D-51)
    for (const provider of ['truebatch', 'truebatch_packing'])
      expect(manifest('deviations').reads![provider]!.filter((v) => !manifest(provider).publishes.includes(v)), `deviations -> ${provider}`).toEqual([]);

    const { config, secrets: s } = checkConfig(all, raw);
    const env = productEnv(config, s!, 'deviations');
    expect(env.TRUEBATCH_DATABASE_URL).toMatch(/^postgres:\/\/deviations_app:.*@db:5432\/truebatch$/);
    expect(env.TRUEBATCH_PACKING_DATABASE_URL).toMatch(/^postgres:\/\/deviations_app:.*@db:5432\/truebatch_packing$/);
    expect(productEnv(config, s!, 'truebatch_packing')).not.toHaveProperty('DEVIATIONS_DATABASE_URL');   // a provider gets nothing of its reader
    // Without the packing link, Deviations gets no packing URL (and keeps TrueBatch's).
    const { truebatch_packing: _cut, ...tabletsOnly } = all.links.deviations;
    const one = checkConfig({ ...all, links: { ...all.links, deviations: tabletsOnly } }, raw);
    expect(productEnv(one.config, one.secrets!, 'deviations')).not.toHaveProperty('TRUEBATCH_PACKING_DATABASE_URL');
    expect(productEnv(one.config, one.secrets!, 'deviations').TRUEBATCH_DATABASE_URL).toMatch(/@db:5432\/truebatch$/);
    // Without the Packing licence, Deviations may not link to it.
    expect(() => checkConfig({ ...all, licences: all.licences.filter((p) => p !== 'truebatch_packing'),
      links: { truebatch: all.links.truebatch, deviations: all.links.deviations } }, raw))
      .toThrow(/link deviations -> truebatch_packing: provider is not licensed/);
  });
});

describe('TrueBatch Injectables, its own product from its own repo (D-43)', () => {
  const md = ['equipment_v1', 'instrument_v1', 'room_v1', 'material_v1', 'product_v1'];
  const ti = {
    ...base, licences: ['hello', 'truebatch_injectables'],
    links: { hello: { master_data: ['equipment_v1'] }, truebatch_injectables: { master_data: md } },
  };
  const raw = {
    ...rawSecrets,
    logins: { ...rawSecrets.logins, truebatch_injectables_app: PW },
    oidc: { ...rawSecrets.oidc, clients: { ...rawSecrets.oidc.clients, truebatch_injectables: 'test-only-client-secret' } },
  };

  it('PL-01 Injectables offers its 14 permission codes, all its own: QC approval, the demo skip, aseptic operator and visual inspector among them', () => {
    const codes = manifest('truebatch_injectables').permissions.map((p) => p.code);
    expect(codes).toHaveLength(14);
    expect(codes.every((c) => c.startsWith('truebatch_injectables.'))).toBe(true);
    for (const c of ['qc.approve', 'demo.skip', 'batch.aseptic', 'batch.inspect']) expect(codes).toContain(`truebatch_injectables.${c}`);
    for (const p of ['truebatch', 'truebatch_packing']) expect(manifest(p).permissions.some((x) => x.code.startsWith('truebatch_injectables.'))).toBe(false);
    expect(manifest('truebatch_injectables').signon).toEqual({ backchannel_logout: '/backchannel-logout' });
  });

  it('PL-08 Injectables gets its own database and login, the master data of its link and sign-on at truebatch-injectables.<domain>', () => {
    const { config, secrets: s } = checkConfig(ti, raw);
    const env = productEnv(config, s!, 'truebatch_injectables');
    expect(Object.keys(env).sort()).toEqual(['MASTER_DATA_DATABASE_URL', 'OIDC_CLIENT_SECRET', 'OIDC_ISSUER', 'OIDC_REDIRECT_URI', 'TRUEBATCH_INJECTABLES_DATABASE_URL']);
    expect(env.TRUEBATCH_INJECTABLES_DATABASE_URL).toMatch(/^postgres:\/\/truebatch_injectables_app:.*@db:5432\/truebatch_injectables$/);
    expect(env.MASTER_DATA_DATABASE_URL).toMatch(/^postgres:\/\/truebatch_injectables_app:.*@db:5432\/master_data$/);
    expect(env.OIDC_REDIRECT_URI).toBe('https://truebatch-injectables.ci.example/cb');
    expect(caddyfile({ ...config, proxy: 'external' })).toContain('truebatch-injectables.ci.example {\n  reverse_proxy 127.0.0.1:8113\n}');
    expect(caddyfile(config)).toContain('truebatch-injectables.ci.example {\n  reverse_proxy truebatch_injectables:3000\n}');
    expect(ti.links.truebatch_injectables.master_data).toEqual(manifest('truebatch_injectables').reads!.master_data);
    expect(manifest('truebatch_injectables').publishes).toEqual(['batch_fact_v1', 'equipment_use_v1', 'deviation_note_v1', 'material_use_v1', 'lab_request_v1', 'steriliser_cycle_v1', 'reading_v1', 'master_lab_field_v1']);   // D-114 cycles for the Logbook
    expect(manifest('logbook').reads!.truebatch_injectables).toEqual(['batch_fact_v1', 'equipment_use_v1', 'steriliser_cycle_v1']);   // D-123 the Logbook reads them (Logbook D-78)
    expect(() => checkConfig({ ...ti, licences: ['hello'] }, raw)).toThrow(/link reader "truebatch_injectables" is not licensed/);
  });

  it('PL-08 every view Injectables reads is published by its provider', () => {
    const reads = manifest('truebatch_injectables').reads!;
    // + qual (the line's media fill) and recruitment (training to sign, TI-32): D-74.
    expect(Object.keys(reads)).toEqual(['qual', 'recruitment', 'master_data', 'deviations', 'qms', 'logbook', 'mms', 'lims']);
    for (const provider of ['qual', 'recruitment', 'deviations', 'qms', 'logbook', 'mms'])
      expect(reads[provider]!.filter((v) => !manifest(provider).publishes.includes(v)), provider).toEqual([]);
  });

  it('PL-10 its image is pinned to a full commit of its own repo, built from ops/Dockerfile, migrated by the platform', () => {
    expect(imageTags().TRUEBATCH_INJECTABLES_COMMIT).toBe(manifest('truebatch_injectables').source!.commit);
    expect(imageTags().TRUEBATCH_INJECTABLES_COMMIT).toMatch(/^[0-9a-f]{40}$/);
    expect(manifest('truebatch_injectables').source!.repo).not.toBe(manifest('truebatch').source!.repo);
    expect(manifest('truebatch_injectables').source!.dockerfile).toBeUndefined();
    expect(manifest('truebatch_injectables').migrate).toBeUndefined();
  });
});

describe('TrueBatch API, its own product from its own repo (D-88)', () => {
  const md = ['equipment_v1', 'instrument_v1', 'room_v1', 'material_v1', 'product_v1'];
  const ta = {
    ...base, licences: ['hello', 'truebatch_api'],
    links: { hello: { master_data: ['equipment_v1'] }, truebatch_api: { master_data: md } },
  };
  const raw = {
    ...rawSecrets,
    logins: { ...rawSecrets.logins, truebatch_api_app: PW },
    oidc: { ...rawSecrets.oidc, clients: { ...rawSecrets.oidc.clients, truebatch_api: 'test-only-client-secret' } },
  };

  it('PL-01 TrueBatch API offers its 12 permission codes, all its own: QC approval and the demo skip among them', () => {
    const codes = manifest('truebatch_api').permissions.map((p) => p.code);
    expect(codes).toHaveLength(12);
    expect(codes.every((c) => c.startsWith('truebatch_api.'))).toBe(true);
    for (const c of ['qc.approve', 'qa.release', 'demo.skip']) expect(codes).toContain(`truebatch_api.${c}`);
    for (const p of ['truebatch', 'truebatch_packing', 'truebatch_injectables']) expect(manifest(p).permissions.some((x) => x.code.startsWith('truebatch_api.'))).toBe(false);
    expect(manifest('truebatch_api').signon).toEqual({ backchannel_logout: '/backchannel-logout' });
  });

  it('PL-08 TrueBatch API gets its own database and login, the master data of its link and sign-on at truebatch-api.<domain>', () => {
    const { config, secrets: s } = checkConfig(ta, raw);
    const env = productEnv(config, s!, 'truebatch_api');
    expect(Object.keys(env).sort()).toEqual(['MASTER_DATA_DATABASE_URL', 'OIDC_CLIENT_SECRET', 'OIDC_ISSUER', 'OIDC_REDIRECT_URI', 'TRUEBATCH_API_DATABASE_URL']);
    expect(env.TRUEBATCH_API_DATABASE_URL).toMatch(/^postgres:\/\/truebatch_api_app:.*@db:5432\/truebatch_api$/);
    expect(env.MASTER_DATA_DATABASE_URL).toMatch(/^postgres:\/\/truebatch_api_app:.*@db:5432\/master_data$/);
    expect(env.OIDC_REDIRECT_URI).toBe('https://truebatch-api.ci.example/cb');
    expect(caddyfile({ ...config, proxy: 'external' })).toContain('truebatch-api.ci.example {\n  reverse_proxy 127.0.0.1:8119\n}');
    expect(caddyfile(config)).toContain('truebatch-api.ci.example {\n  reverse_proxy truebatch_api:3000\n}');
    expect(ta.links.truebatch_api.master_data).toEqual(manifest('truebatch_api').reads!.master_data);
    // The four views TrueBatch Tablets publishes, and the lots that go to stores for MMS (output_lot_v1).
    expect(manifest('truebatch_api').publishes).toEqual(['batch_fact_v1', 'equipment_use_v1', 'deviation_note_v1', 'material_use_v1', 'output_lot_v1', 'lab_request_v1', 'reading_v1']);   // D-133 readings for CPV
    expect(() => checkConfig({ ...ta, licences: ['hello'] }, raw)).toThrow(/link reader "truebatch_api" is not licensed/);
  });

  it('PL-08 every view TrueBatch API reads is published by its provider', () => {
    const reads = manifest('truebatch_api').reads!;
    expect(Object.keys(reads)).toEqual(['master_data', 'deviations', 'qms', 'logbook', 'mms', 'recruitment', 'lims']);
    for (const provider of ['deviations', 'qms', 'logbook', 'mms', 'recruitment'])
      expect(reads[provider]!.filter((v) => !manifest(provider).publishes.includes(v)), provider).toEqual([]);
  });

  it('PL-10 its image is pinned to a full commit of its own repo, built from ops/Dockerfile, migrated by the platform', () => {
    expect(imageTags().TRUEBATCH_API_COMMIT).toBe(manifest('truebatch_api').source!.commit);
    expect(imageTags().TRUEBATCH_API_COMMIT).toMatch(/^[0-9a-f]{40}$/);
    expect(manifest('truebatch_api').source!.repo).not.toBe(manifest('truebatch').source!.repo);
    expect(manifest('truebatch_api').source!.dockerfile).toBeUndefined();
    expect(manifest('truebatch_api').migrate).toBeUndefined();
  });
});

describe('TrueBatch Injectables Packing, a second product from the Injectables repo (D-53)', () => {
  const md = ['equipment_v1', 'instrument_v1', 'room_v1', 'material_v1', 'product_v1'];
  const tip = {
    ...base, licences: ['hello', 'truebatch_injectables_packing'],
    links: { hello: { master_data: ['equipment_v1'] }, truebatch_injectables_packing: { master_data: md } },
  };
  const raw = {
    ...rawSecrets,
    logins: { ...rawSecrets.logins, truebatch_injectables_packing_app: PW },
    oidc: { ...rawSecrets.oidc, clients: { ...rawSecrets.oidc.clients, truebatch_injectables_packing: 'test-only-client-secret' } },
  };

  it('PL-01 Injectables Packing offers its 12 permission codes, all its own', () => {
    const codes = manifest('truebatch_injectables_packing').permissions.map((p) => p.code);
    expect(codes).toHaveLength(12);
    expect(codes.every((c) => c.startsWith('truebatch_injectables_packing.'))).toBe(true);
    expect(codes).toContain('truebatch_injectables_packing.qc.approve');
    // Injectables' codes stay Injectables': none starts with the packing product's name and a dot.
    expect(manifest('truebatch_injectables').permissions.some((p) => p.code.startsWith('truebatch_injectables_packing.'))).toBe(false);
  });

  it('PL-08 Injectables Packing gets its own database and login and sign-on at truebatch-injectables-packing.<domain>; it reads Injectables only while linked', () => {
    const { config, secrets: s } = checkConfig(tip, raw);
    const env = productEnv(config, s!, 'truebatch_injectables_packing');
    expect(Object.keys(env).sort()).toEqual(['MASTER_DATA_DATABASE_URL', 'OIDC_CLIENT_SECRET', 'OIDC_ISSUER', 'OIDC_REDIRECT_URI', 'TRUEBATCH_INJECTABLES_PACKING_DATABASE_URL']);
    expect(env.TRUEBATCH_INJECTABLES_PACKING_DATABASE_URL).toMatch(/^postgres:\/\/truebatch_injectables_packing_app:.*@db:5432\/truebatch_injectables_packing$/);
    expect(env.OIDC_REDIRECT_URI).toBe('https://truebatch-injectables-packing.ci.example/cb');
    expect(caddyfile({ ...config, proxy: 'external' })).toContain('truebatch-injectables-packing.ci.example {\n  reverse_proxy 127.0.0.1:8114\n}');
    const reads = manifest('truebatch_injectables_packing').reads!;
    expect(reads.truebatch_injectables).toEqual(['batch_fact_v1']);
    for (const provider of ['truebatch_injectables', 'mms', 'logbook', 'deviations', 'qms'])
      expect(reads[provider]!.filter((v) => !manifest(provider).publishes.includes(v)), provider).toEqual([]);
    expect(() => checkConfig({ ...tip, links: { ...tip.links, truebatch_injectables_packing: { ...tip.links.truebatch_injectables_packing, truebatch_injectables: ['batch_fact_v1'] } } }, raw))
      .toThrow(/link truebatch_injectables_packing -> truebatch_injectables: provider is not licensed/);
  });

  it('PL-10 its image is built at the same pinned commit as Injectables, from the repo\'s ops/packing.Dockerfile, with its own migrator', () => {
    expect(imageTags().TRUEBATCH_INJECTABLES_PACKING_COMMIT).toMatch(/^[0-9a-f]{40}$/);
    expect(manifest('truebatch_injectables_packing').source).toEqual({ ...manifest('truebatch_injectables').source, dockerfile: 'ops/packing.Dockerfile' });
    expect(manifest('truebatch_injectables_packing').migrate).toEqual({ command: ['node', 'dist/packing/migrate.js'] });
  });
});

describe('TrueBatch Capsules and TrueBatch Capsules Packing, two products from the Capsules repo (D-89)', () => {
  const md = ['equipment_v1', 'instrument_v1', 'room_v1', 'material_v1', 'product_v1'];
  const tc = {
    ...base, licences: ['hello', 'truebatch_capsules', 'truebatch_capsules_packing'],
    links: { hello: { master_data: ['equipment_v1'] }, truebatch_capsules: { master_data: md }, truebatch_capsules_packing: { master_data: md } },
  };
  const raw = {
    ...rawSecrets,
    logins: { ...rawSecrets.logins, truebatch_capsules_app: PW, truebatch_capsules_packing_app: PW },
    oidc: { ...rawSecrets.oidc, clients: { ...rawSecrets.oidc.clients, truebatch_capsules: 'test-only-client-secret', truebatch_capsules_packing: 'test-only-client-secret' } },
  };

  it('PL-01 Capsules offers its 12 permission codes and Capsules Packing its 12, each all its own', () => {
    for (const p of ['truebatch_capsules', 'truebatch_capsules_packing']) {
      const codes = manifest(p).permissions.map((x) => x.code);
      expect(codes, p).toHaveLength(12);
      expect(codes.every((c) => c.startsWith(`${p}.`)), p).toBe(true);
      expect(codes, p).toContain(`${p}.qc.approve`);
      expect(manifest(p).signon).toEqual({ backchannel_logout: '/backchannel-logout' });
    }
    expect(manifest('truebatch_capsules').permissions.some((x) => x.code.startsWith('truebatch_capsules_packing.'))).toBe(false);
    for (const p of ['truebatch', 'truebatch_packing', 'truebatch_injectables']) expect(manifest(p).permissions.some((x) => x.code.startsWith('truebatch_capsules'))).toBe(false);
  });

  it('PL-08 each gets its own database and login and sign-on at truebatch-capsules(-packing).<domain>, on host ports 8115 and 8116 behind an outside proxy', () => {
    const { config, secrets: s } = checkConfig(tc, raw);
    const env = productEnv(config, s!, 'truebatch_capsules');
    expect(Object.keys(env).sort()).toEqual(['MASTER_DATA_DATABASE_URL', 'OIDC_CLIENT_SECRET', 'OIDC_ISSUER', 'OIDC_REDIRECT_URI', 'TRUEBATCH_CAPSULES_DATABASE_URL']);
    expect(env.TRUEBATCH_CAPSULES_DATABASE_URL).toMatch(/^postgres:\/\/truebatch_capsules_app:.*@db:5432\/truebatch_capsules$/);
    expect(env.OIDC_REDIRECT_URI).toBe('https://truebatch-capsules.ci.example/cb');
    const penv = productEnv(config, s!, 'truebatch_capsules_packing');
    expect(penv.TRUEBATCH_CAPSULES_PACKING_DATABASE_URL).toMatch(/^postgres:\/\/truebatch_capsules_packing_app:.*@db:5432\/truebatch_capsules_packing$/);
    expect(penv.OIDC_REDIRECT_URI).toBe('https://truebatch-capsules-packing.ci.example/cb');
    expect(caddyfile({ ...config, proxy: 'external' })).toContain('truebatch-capsules.ci.example {\n  reverse_proxy 127.0.0.1:8115\n}');
    expect(caddyfile({ ...config, proxy: 'external' })).toContain('truebatch-capsules-packing.ci.example {\n  reverse_proxy 127.0.0.1:8116\n}');
    expect(caddyfile(config)).toContain('truebatch-capsules.ci.example {\n  reverse_proxy truebatch_capsules:3000\n}');
    expect(manifest('truebatch_capsules').publishes).toEqual(['batch_fact_v1', 'equipment_use_v1', 'deviation_note_v1', 'material_use_v1', 'lab_request_v1', 'reading_v1']);   // D-129 readings for CPV
    expect(manifest('truebatch_capsules_packing').publishes).toEqual(['packing_batch_v1', 'equipment_use_v1', 'material_use_v1', 'deviation_note_v1', 'lab_request_v1']);
    expect(() => checkConfig({ ...tc, licences: ['hello', 'truebatch_capsules_packing'], links: { hello: tc.links.hello, truebatch_capsules_packing: { master_data: md } } }, raw)).not.toThrow();
    expect(() => checkConfig({ ...tc, licences: ['hello'] }, raw)).toThrow(/link reader "truebatch_capsules" is not licensed/);
  });

  it('PL-08 every view Capsules and Capsules Packing read is published by its provider; Packing reads Capsules\' bulk batches and deviation notes', () => {
    const reads = manifest('truebatch_capsules').reads!;
    expect(reads).toEqual(manifest('truebatch').reads);
    const preads = manifest('truebatch_capsules_packing').reads!;
    expect(preads.truebatch_capsules).toEqual(['batch_fact_v1', 'deviation_note_v1']);
    for (const [r, p] of [[reads, 'truebatch_capsules'], [preads, 'truebatch_capsules_packing']] as const)
      for (const provider of Object.keys(r).filter((x) => x !== 'master_data'))
        expect(r[provider]!.filter((v) => !manifest(provider).publishes.includes(v)), `${p} -> ${provider}`).toEqual([]);
  });

  it('PL-10 both images are pinned to the same full commit of the Capsules repo; Packing from ops/packing.Dockerfile with its own migrator', () => {
    expect(imageTags().TRUEBATCH_CAPSULES_COMMIT).toMatch(/^[0-9a-f]{40}$/);
    expect(imageTags().TRUEBATCH_CAPSULES_PACKING_COMMIT).toBe(imageTags().TRUEBATCH_CAPSULES_COMMIT);
    expect(manifest('truebatch_capsules').source!.repo).toBe('https://github.com/maglesT/truebatch-capsules');
    expect(manifest('truebatch_capsules').source!.dockerfile).toBeUndefined();
    expect(manifest('truebatch_capsules').migrate).toBeUndefined();
    expect(manifest('truebatch_capsules_packing').source).toEqual({ ...manifest('truebatch_capsules').source, dockerfile: 'ops/packing.Dockerfile' });
    expect(manifest('truebatch_capsules_packing').migrate).toEqual({ command: ['node', 'dist/packing/migrate.js'] });
  });
});

describe('Medhanta LIMS, the QC laboratory system (D-91)', () => {
  const md = ['equipment_v1', 'instrument_v1', 'room_v1', 'material_v1', 'product_v1'];
  const lc = {
    ...base, licences: ['hello', 'lims', 'truebatch'],
    links: { hello: { master_data: ['equipment_v1'] }, lims: { master_data: md, truebatch: ['batch_fact_v1'] }, truebatch: { master_data: md } },
  };
  const raw = {
    ...rawSecrets,
    logins: { ...rawSecrets.logins, lims_app: PW, truebatch_app: PW },
    oidc: { ...rawSecrets.oidc, clients: { ...rawSecrets.oidc.clients, lims: 'test-only-client-secret', truebatch: 'test-only-client-secret' } },
  };

  it('PL-01 LIMS offers its 11 permission codes, all its own, with back-channel logout', () => {
    const codes = manifest('lims').permissions.map((x) => x.code);
    expect(codes).toHaveLength(11);
    expect(codes.every((c) => c.startsWith('lims.'))).toBe(true);
    expect(codes).toEqual(expect.arrayContaining(['lims.qc.approve', 'lims.analysis.review', 'lims.sample.register', 'lims.demo.skip']));
    expect(manifest('lims').signon).toEqual({ backchannel_logout: '/backchannel-logout' });
  });

  it('PL-08 LIMS gets its own database, login and sign-on at lims.<domain>, on host port 8120 behind an outside proxy; it reads TrueBatch\'s batches while linked', () => {
    const { config, secrets: s } = checkConfig(lc, raw);
    const env = productEnv(config, s!, 'lims');
    expect(Object.keys(env).sort()).toEqual(['LIMS_DATABASE_URL', 'MASTER_DATA_DATABASE_URL', 'OIDC_CLIENT_SECRET', 'OIDC_ISSUER', 'OIDC_REDIRECT_URI', 'TRUEBATCH_DATABASE_URL']);
    expect(env.LIMS_DATABASE_URL).toMatch(/^postgres:\/\/lims_app:.*@db:5432\/lims$/);
    expect(env.OIDC_REDIRECT_URI).toBe('https://lims.ci.example/cb');
    expect(caddyfile({ ...config, proxy: 'external' })).toContain('lims.ci.example {\n  reverse_proxy 127.0.0.1:8120\n}');
    expect(caddyfile(config)).toContain('lims.ci.example {\n  reverse_proxy lims:3000\n}');
    expect(manifest('lims').publishes).toEqual(['coa_v1', 'result_v1', 'oos_v1', 'instrument_use_v1', 'stability_v1', 'em_v1', 'trend_v1', 'sample_v1']);   // D-112: samples for MMS
  });

  it('PL-08 every view LIMS reads is published by its provider', () => {
    const reads = manifest('lims').reads!;
    expect(Object.keys(reads).sort()).toEqual(['deviations', 'logbook', 'master_data', 'mms', 'qms', 'qual', 'recruitment', 'truebatch', 'truebatch_api', 'truebatch_capsules', 'truebatch_capsules_packing', 'truebatch_injectables', 'truebatch_injectables_packing', 'truebatch_liquids', 'truebatch_liquids_packing', 'truebatch_packing']);   // D-110 batches of every production edition; D-112 lab requests of every edition
    for (const provider of Object.keys(reads).filter((x) => x !== 'master_data'))
      expect(reads[provider]!.filter((v) => !manifest(provider).publishes.includes(v)), `lims -> ${provider}`).toEqual([]);
  });

  it('PL-10 the LIMS image is pinned to a full commit of its repo, migrated by the default migrator', () => {
    expect(imageTags().LIMS_COMMIT).toMatch(/^[0-9a-f]{40}$/);
    expect(manifest('lims').source!.repo).toBe('https://github.com/maglesT/medhanta-lims');
    expect(manifest('lims').migrate).toBeUndefined();
  });
});

describe('TrueBatch Liquids and TrueBatch Liquids Packing, two products from the Liquids repo (D-92)', () => {
  const md = ['equipment_v1', 'instrument_v1', 'room_v1', 'material_v1', 'product_v1'];
  const tl = {
    ...base, licences: ['hello', 'truebatch_liquids', 'truebatch_liquids_packing'],
    links: { hello: { master_data: ['equipment_v1'] }, truebatch_liquids: { master_data: md }, truebatch_liquids_packing: { master_data: md, truebatch_liquids: ['batch_fact_v1', 'deviation_note_v1'] } },
  };
  const raw = {
    ...rawSecrets,
    logins: { ...rawSecrets.logins, truebatch_liquids_app: PW, truebatch_liquids_packing_app: PW },
    oidc: { ...rawSecrets.oidc, clients: { ...rawSecrets.oidc.clients, truebatch_liquids: 'test-only-client-secret', truebatch_liquids_packing: 'test-only-client-secret' } },
  };

  it('PL-01 Liquids and Liquids Packing offer 12 permission codes each, all their own', () => {
    for (const p of ['truebatch_liquids', 'truebatch_liquids_packing']) {
      const codes = manifest(p).permissions.map((x) => x.code);
      expect(codes).toHaveLength(12);
      expect(codes.every((c) => c.startsWith(`${p}.`)), p).toBe(true);
      for (const c of ['qc.approve', 'qa.release', 'demo.skip']) expect(codes).toContain(`${p}.${c}`);
      expect(manifest(p).signon).toEqual({ backchannel_logout: '/backchannel-logout' });
    }
    for (const other of ['truebatch', 'truebatch_packing', 'truebatch_injectables', 'truebatch_injectables_packing'])
      expect(manifest(other).permissions.some((x) => x.code.startsWith('truebatch_liquids')), other).toBe(false);
  });

  it('PL-08 each gets its own database, login and sign-on at truebatch-liquids(-packing).<domain>, behind the host proxy on 8117 and 8118', () => {
    const { config, secrets: s } = checkConfig(tl, raw);
    const env = productEnv(config, s!, 'truebatch_liquids');
    expect(Object.keys(env).sort()).toEqual(['MASTER_DATA_DATABASE_URL', 'OIDC_CLIENT_SECRET', 'OIDC_ISSUER', 'OIDC_REDIRECT_URI', 'TRUEBATCH_LIQUIDS_DATABASE_URL']);
    expect(env.TRUEBATCH_LIQUIDS_DATABASE_URL).toMatch(/^postgres:\/\/truebatch_liquids_app:.*@db:5432\/truebatch_liquids$/);
    expect(env.OIDC_REDIRECT_URI).toBe('https://truebatch-liquids.ci.example/cb');
    const pk = productEnv(config, s!, 'truebatch_liquids_packing');
    expect(pk.TRUEBATCH_LIQUIDS_PACKING_DATABASE_URL).toMatch(/^postgres:\/\/truebatch_liquids_packing_app:.*@db:5432\/truebatch_liquids_packing$/);
    // Packing reads the bulk batches of Liquids with its own login (TRUEBATCH_LIQUIDS_DATABASE_URL in its env, a read link).
    expect(pk.TRUEBATCH_LIQUIDS_DATABASE_URL).toMatch(/^postgres:\/\/truebatch_liquids_packing_app:.*@db:5432\/truebatch_liquids$/);
    expect(pk.OIDC_REDIRECT_URI).toBe('https://truebatch-liquids-packing.ci.example/cb');
    const caddy = caddyfile({ ...config, proxy: 'external' });
    expect(caddy).toContain('truebatch-liquids.ci.example {\n  reverse_proxy 127.0.0.1:8117\n}');
    expect(caddy).toContain('truebatch-liquids-packing.ci.example {\n  reverse_proxy 127.0.0.1:8118\n}');
    expect(() => checkConfig({ ...tl, licences: ['hello', 'truebatch_liquids_packing'] }, raw)).toThrow(/link truebatch_liquids_packing -> truebatch_liquids: provider is not licensed|link reader "truebatch_liquids" is not licensed/);
  });

  it('PL-08 every view Liquids and Liquids Packing read is published by its provider', () => {
    const reads = manifest('truebatch_liquids').reads!;
    expect(Object.keys(reads)).toEqual(['master_data', 'deviations', 'qms', 'logbook', 'mms', 'recruitment', 'lims']);
    for (const p of ['truebatch_liquids', 'truebatch_liquids_packing']) {
      const r = manifest(p).reads!;
      for (const provider of Object.keys(r).filter((x) => x !== 'master_data')) expect(r[provider]!.filter((v) => !manifest(provider).publishes.includes(v)), `${p} -> ${provider}`).toEqual([]);
    }
    expect(manifest('truebatch_liquids_packing').reads!.truebatch_liquids).toEqual(['batch_fact_v1', 'deviation_note_v1']);
  });

  it('PL-10 both images are pinned to one full commit of the Liquids repo; packing from its ops/packing.Dockerfile with its own migrator', () => {
    expect(imageTags().TRUEBATCH_LIQUIDS_COMMIT).toBe(manifest('truebatch_liquids').source!.commit);
    expect(imageTags().TRUEBATCH_LIQUIDS_COMMIT).toMatch(/^[0-9a-f]{40}$/);
    expect(manifest('truebatch_liquids').source!.repo).toBe('https://github.com/maglesT/truebatch-oral-liquids');
    expect(manifest('truebatch_liquids').migrate).toBeUndefined();
    expect(manifest('truebatch_liquids_packing').source).toEqual({ ...manifest('truebatch_liquids').source, dockerfile: 'ops/packing.Dockerfile' });
    expect(manifest('truebatch_liquids_packing').migrate).toEqual({ command: ['node', 'dist/packing/migrate.js'] });
  });
});
