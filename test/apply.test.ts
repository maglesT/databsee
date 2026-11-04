// Slice A6: the customer config file and apply (PL-10), migration data checks (PL-13).
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import postgres from 'postgres';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { migrate } from '../db/migrate.js';
import { applyConfig, caddyfile, dbPortEnv, externalPort, imageTags, loadPermissions, productEnv, type Runtime } from '../deploy/apply.js';
import { allProducts, checkConfig, checkManifest, manifest, ROOT, type Manifest } from '../deploy/config.js';
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
    // A product no longer licensed has all its codes withdrawn (core is never withdrawn).
    await loadPermissions(id, [manifest('hello')], 'CC-P3: licence off');
    expect(await id`select code from current_permission where product = ${p}`).toEqual([]);
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
    expect(manifest('qms').reads).toEqual({ master_data: ['product_v1', 'supplier_v1'], deviations: ['capa_v1'] });
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
    links: { hello: { master_data: ['equipment_v1'] }, qual: { master_data: ['equipment_v1', 'instrument_v1', 'room_v1'] } },
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
    ...base, licences: ['hello', 'logbook', 'ebmr', 'deviations'],
    links: {
      hello: { master_data: ['equipment_v1'] },
      deviations: { identity: ['employee_v1'], logbook: ['equipment_v1', 'entry_v1', 'calibration_v1', 'logbook_sop_v1'],
        ebmr: ['batch_fact_v1', 'step_use_v1', 'cpp_value_v1', 'exception_v1', 'alarm_v1', 'batch_reference_v1', 'equipment_use_v1', 'ipc_result_v1', 'process_actual_v1', 'exception_detail_v1'] },   // Batchwright (Deviations D-48)
    },
  };
  const raw = {
    ...rawSecrets,
    logins: { ...rawSecrets.logins, logbook_app: PW, ebmr_app: PW, deviations_app: PW },
    oidc: { ...rawSecrets.oidc, clients: { ...rawSecrets.oidc.clients, logbook: 'test-only-client-secret', ebmr: 'test-only-client-secret', deviations: 'test-only-client-secret' } },
    env: { ebmr: { EBMR_AUTHN_PASSWORD: 'test-only-authn-password', EBMR_ANALYTICS_PASSWORD: 'test-only-analytics-password' } },
  };

  it('PL-01 Deviations offers its 11 permission codes, all its own', () => {
    const m = manifest('deviations');
    expect(m.permissions).toHaveLength(11);
    expect(m.permissions.every((p) => p.code.startsWith('deviations.'))).toBe(true);
  });

  it('PL-08 Deviations gets its own database, the identity and Logbook databases of its links and sign-on, and reads only what its manifest lists', () => {
    const { config, secrets: s } = checkConfig(dev, raw);
    const env = productEnv(config, s!, 'deviations');
    expect(Object.keys(env).sort()).toEqual(['DEVIATIONS_DATABASE_URL', 'EBMR_DATABASE_URL', 'IDENTITY_DATABASE_URL', 'LOGBOOK_DATABASE_URL',
      'OIDC_CLIENT_SECRET', 'OIDC_ISSUER', 'OIDC_REDIRECT_URI']);
    expect(env.DEVIATIONS_DATABASE_URL).toMatch(/^postgres:\/\/deviations_app:.*@db:5432\/deviations$/);
    expect(env.LOGBOOK_DATABASE_URL).toMatch(/^postgres:\/\/deviations_app:.*@db:5432\/logbook$/);
    expect(env.EBMR_DATABASE_URL).toMatch(/^postgres:\/\/deviations_app:.*@db:5432\/ebmr/);
    expect(env.OIDC_REDIRECT_URI).toBe('https://deviations.ci.example/cb');
    expect(dev.links.deviations).toEqual(manifest('deviations').reads);
    expect(manifest('deviations').publishes).toEqual(['capa_v1']);   // read by the QMS through a link (Deviations D-40)
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

  it('PL-01 Recruitment offers its 12 permission codes, all its own', () => {
    const codes = manifest('recruitment').permissions.map((p) => p.code);
    expect(codes).toHaveLength(12);
    expect(codes.every((c) => c.startsWith('recruitment.'))).toBe(true);
  });

  it('PL-08 Recruitment gets its own database, the staff directory of its identity link and sign-on; no master data', () => {
    const { config, secrets: s } = checkConfig(rec, raw);
    const env = productEnv(config, s!, 'recruitment');
    expect(Object.keys(env).sort()).toEqual(['IDENTITY_DATABASE_URL', 'OIDC_CLIENT_SECRET', 'OIDC_ISSUER', 'OIDC_REDIRECT_URI', 'RECRUITMENT_DATABASE_URL']);
    expect(env.RECRUITMENT_DATABASE_URL).toMatch(/^postgres:\/\/recruitment_app:.*@db:5432\/recruitment$/);
    expect(env.IDENTITY_DATABASE_URL).toMatch(/^postgres:\/\/recruitment_app:.*@db:5432\/identity$/);
    expect(manifest('recruitment').reads).toEqual({ identity: ['employee_v1'] });
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

  it('PL-01 Operations offers its 11 permission codes, all its own', () => {
    const m = manifest('ops');
    expect(m.permissions).toHaveLength(11);
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

  it('PL-08 with Batchwright (ebmr) licensed, Operations reads its five views through EBMR_DATABASE_URL', () => {
    const views = ['batch_fact_v1', 'step_use_v1', 'cpp_value_v1', 'process_actual_v1', 'ipc_result_v1'];
    expect(manifest('ops').reads!.ebmr).toEqual(views);
    expect(views.every((v) => manifest('ebmr').publishes.includes(v))).toBe(true);
    const withEbmr = { ...ops, licences: [...ops.licences, 'ebmr'], links: { ...ops.links, ops: { ...ops.links.ops, ebmr: views } } };
    const rawEbmr = { ...raw, logins: { ...raw.logins, ebmr_app: PW }, oidc: { ...raw.oidc, clients: { ...raw.oidc.clients, ebmr: 'test-only-client-secret' } } };
    const { config, secrets: s } = checkConfig(withEbmr, rawEbmr);
    expect(productEnv(config, s!, 'ops').EBMR_DATABASE_URL).toMatch(/^postgres:\/\/ops_app:.*@db:5432\/ebmr$/);
  });

  it('PL-10 its image is pinned to a full commit', () => {
    expect(imageTags().OPS_COMMIT).toBe(manifest('ops').source!.commit);
    expect(imageTags().OPS_COMMIT).toMatch(/^[0-9a-f]{40}$/);
  });
});

describe('Batchwright (ebmr), a product kept in its own repo that migrates itself (Batchwright Phase B plan, decisions 1-3)', () => {
  const bw = { ...base, licences: ['hello', 'ebmr'],
    links: { hello: { master_data: ['equipment_v1'] }, ebmr: { master_data: ['equipment_v1', 'instrument_v1', 'room_v1', 'material_v1', 'product_v1'] } } };
  const raw = {
    ...rawSecrets,
    logins: { ...rawSecrets.logins, ebmr_app: PW },
    oidc: { ...rawSecrets.oidc, clients: { ...rawSecrets.oidc.clients, ebmr: 'test-only-client-secret' } },
    env: { ebmr: { EBMR_AUTHN_PASSWORD: 'test-only-authn-password', EBMR_ANALYTICS_PASSWORD: 'test-only-analytics-password' } },
  };

  it('PL-01 Batchwright offers its 140 permission codes, all its own, grouped by their first part', () => {
    const codes = manifest('ebmr').permissions.map((p) => p.code);
    expect(codes).toHaveLength(140);
    expect(codes.every((c) => c.startsWith('ebmr.'))).toBe(true);
    expect(codes).toEqual([...codes].sort());   // related codes sit together on the tick list
  });

  it('PL-08 Batchwright gets its own database, the master data of its link, sign-on and its own logins; it publishes the views Deviations reads', () => {
    const { config, secrets: s } = checkConfig(bw, raw);
    const env = productEnv(config, s!, 'ebmr');
    expect(Object.keys(env).sort()).toEqual(['EBMR_ANALYTICS_PASSWORD', 'EBMR_AUTHN_PASSWORD', 'EBMR_DATABASE_URL', 'MASTER_DATA_DATABASE_URL',
      'OIDC_CLIENT_SECRET', 'OIDC_ISSUER', 'OIDC_REDIRECT_URI']);
    expect(env.EBMR_DATABASE_URL).toMatch(/^postgres:\/\/ebmr_app:.*@db:5432\/ebmr$/);
    expect(env.OIDC_REDIRECT_URI).toBe('https://ebmr.ci.example/cb');
    expect(bw.links.ebmr).toEqual(manifest('ebmr').reads);
    expect(manifest('ebmr').publishes).toEqual(['batch_fact_v1', 'step_use_v1', 'cpp_value_v1', 'exception_v1', 'alarm_v1', 'batch_reference_v1',
      'equipment_use_v1', 'ipc_result_v1', 'process_actual_v1', 'exception_detail_v1']);
    expect(caddyfile({ ...config, proxy: 'external' })).toContain(`ebmr.ci.example {\n  reverse_proxy 127.0.0.1:${externalPort('ebmr')}\n}`);
  });

  it('PL-10 apply runs the migrator of a product whose manifest says "migrate": "own", and db/migrate.ts for the others; licence off switches its further logins off', async () => {
    migratedOwn.length = 0;
    const { config, secrets: s } = checkConfig({ ...bw, change_ref: 'CC-BW1', reason: 'licence Batchwright' }, raw);
    await applyConfig(config, s!, runtime());
    expect(migratedOwn).toEqual(['ebmr']);
    const c = su('ebmr');
    try {
      // Its database exists (init.sh), and the platform's own migration table stays empty: the product migrates itself.
      expect(await c`select to_regclass('platform.migration') is null as none`).toEqual([{ none: true }]);
    } finally { await c.end(); }
    // Licence off: its further logins are off too (here ebmr_authn, standing in for what its migrator would create).
    const su0 = su('postgres');
    try {
      await su0.unsafe(`do $$ begin if not exists (select from pg_roles where rolname = 'ebmr_authn') then create role ebmr_authn; end if; end $$`);
      await su0.unsafe(`alter role ebmr_authn login password 'test-only-authn-password'`);
      await applyConfig(A, secrets, runtime());
      expect(await su0`select rolcanlogin from pg_roles where rolname = 'ebmr_authn'`).toEqual([{ rolcanlogin: false }]);
    } finally { await su0.end(); }
  });

  it('PL-10 "migrate" is only "own", and only for a product built from its own repo', () => {
    const m = { ...manifest('ebmr') };
    expect(() => checkManifest({ ...m, migrate: 'self' as 'own' }, 'ebmr')).toThrow(/may only be "own"/);
    expect(() => checkManifest({ ...m, source: undefined }, 'ebmr')).toThrow(/may only be "own"/);
    expect(() => checkManifest({ ...m, logins: ['ebmr_app'] }, 'ebmr')).toThrow(/extra login/);
    expect(() => checkManifest({ ...m, logins: ['core_app'] }, 'ebmr')).toThrow(/extra login/);
    expect(imageTags().EBMR_COMMIT).toMatch(/^[0-9a-f]{40}$/);
  });
});
