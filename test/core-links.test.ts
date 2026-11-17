// D-75 to D-79: core reads Recruitment (hires, training) through its own link, the Links screen, plant time, logos.
// A stand-in provider: report.hire_v1 and report.training_v1 in the hello database, read by core_app through a link.
import { readdirSync } from 'node:fs';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type pg from 'pg';
import postgres from 'postgres';
import { buildApp } from '../apps/core/server/app.js';
import { PRODUCTS } from '../apps/core/products.js';
import { plantDate, plantTime } from '../apps/core/time.js';
import { admin } from './db.js';
import { coreApp, makeEmployee, run, signIn, superuser } from './core.js';

let t: Awaited<ReturnType<typeof coreApp>>;
let hello: pg.Client;
let rec: postgres.Sql;
let app: ReturnType<typeof buildApp>;
const ref = `CAND-${run}`;

beforeAll(async () => {
  t = await coreApp();
  hello = admin('hello');
  await hello.connect();
  await hello.query(`
    set role hello_owner;
    create table if not exists hire_probe (candidate_ref text primary key, full_name text, job_title text, department text, joining_date date, hired_at timestamptz);
    alter table hire_probe add column if not exists email text;
    drop view if exists report.hire_v1; -- a re-run starts from the hire_v1 without an email column (D-82 test adds it)
    create table if not exists training_probe (person_id uuid, person_login text, person_name text, skill_code text, skill_title text,
      trained_on date, valid_until date, qualified boolean, approved_at timestamptz);
    create view report.hire_v1 with (security_barrier) as select candidate_ref, full_name, job_title, department, joining_date, hired_at,
      now() as data_as_of from hire_probe;
    create or replace view report.training_v1 with (security_barrier) as select person_id, person_login, person_name, skill_code, skill_title,
      trained_on, valid_until, qualified, approved_at, now() as read_at, approved_at as data_as_of from training_probe;
    reset role;
    select platform.set_link('core_app', array['hire_v1', 'training_v1'], true, 'CC-CORE', 'core reads recruitment (test)');`);
  await hello.query(`insert into hire_probe values ($1, $2, 'QA Officer', 'Quality Assurance', '2026-12-01', now())`, [ref, `Asha Rao ${run}`]);
  rec = postgres({ database: 'hello', username: 'core_app', password: 'test-only', onnotice: () => {} });
  app = buildApp({ ...t.deps, links: { recruitment: rec } });
});

afterAll(async () => {
  // Other test files expect core_app not to reach the hello database.
  await hello.query(`select platform.set_link('core_app', array['hire_v1', 'training_v1'], false, 'CC-CORE', 'test cleanup')`);
  await hello.end();
  await rec.end();
  await app.close();
  await t.app.close(); await t.sql.end(); await t.md.end();
});

describe('D-75 add a person from a Recruitment hire', () => {
  it('PL-08 D-75 the hire list pre-fills a new person; once added, the hire is gone from the list and cannot be added twice', async () => {
    await makeEmployee(`hireadm${run}`, ['core.people.manage']);
    const a = await signIn(app, `hireadm${run}`);
    const list = (await a.call('GET', '/api/hires')).json();
    expect(list.state).toBe('on');
    expect(list.hires).toContainEqual(expect.objectContaining({ candidateRef: ref, fullName: `Asha Rao ${run}`, jobTitle: 'QA Officer', joiningDate: '2026-12-01' }));
    const body = { login: `asha${run}`, fullName: `Asha Rao ${run}`, identityVerifiedHow: 'ID card seen', reason: 'new joiner', hireRef: ref };
    expect((await a.call('POST', '/api/employees', body)).statusCode).toBe(200);
    const su = superuser();
    expect(await su`select hire_ref from employee where login = ${`asha${run}`}`).toEqual([{ hire_ref: ref }]);
    await su.end();
    expect((await a.call('GET', '/api/hires')).json().hires.map((h: { candidateRef: string }) => h.candidateRef)).not.toContain(ref);
    expect((await a.call('POST', '/api/employees', { ...body, login: `asha2${run}` })).statusCode).toBe(409);
    expect((await a.call('POST', '/api/employees', { ...body, login: `nobody${run}`, hireRef: 'NO-SUCH' })).json().error).toBe('No such hire in Recruitment.');
  });

  it('PL-08 D-82 a hire who is already an active person (same name, or the login the name gives) is left out; the email is pulled', async () => {
    await makeEmployee(`hireadm3${run}`, ['core.people.manage']);
    const a = await signIn(app, `hireadm3${run}`);
    const [byName, byLogin, keep] = [`NAME-${run}`, `LOGIN-${run}`, `KEEP-${run}`];
    await hello.query(`insert into hire_probe (candidate_ref, full_name, job_title, department, hired_at, email) values
      ($1, $4, 'Operator', 'Production', now(), null), ($2, $5, 'Operator', 'Production', now(), null),
      ($3, $6, 'Chemist', 'QC', now(), 'nita@example.com')`,
      [byName, byLogin, keep, `RAVI   shah ${run}`, `Meera Iyer ${run}`, `Nita Desai ${run}`]);
    await a.call('POST', '/api/employees', { login: `rshah${run}`, fullName: `Ravi Shah ${run}`, identityVerifiedHow: 'ID', reason: 'typed by hand' });
    await a.call('POST', '/api/employees', { login: `meera.iyer.${run}`, fullName: 'M. Iyer', identityVerifiedHow: 'ID', reason: 'typed by hand' });
    let hires = (await a.call('GET', '/api/hires')).json().hires as { candidateRef: string; email: string | null }[];
    expect(hires.map((h) => h.candidateRef)).not.toContain(byName);
    expect(hires.map((h) => h.candidateRef)).not.toContain(byLogin);
    expect(hires.find((h) => h.candidateRef === keep)).toMatchObject({ email: null }); // hire_v1 has no email column yet
    await hello.query(`set role hello_owner;
      create or replace view report.hire_v1 with (security_barrier) as select candidate_ref, full_name, job_title, department, joining_date, hired_at,
        now() as data_as_of, email from hire_probe;
      reset role;`);
    hires = (await a.call('GET', '/api/hires')).json().hires;
    expect(hires.find((h) => h.candidateRef === keep)).toMatchObject({ email: 'nita@example.com' });
  });

  it('PL-08 D-75 without a link the list is off (hidden) and a person is typed by hand; a hire reference is refused', async () => {
    await makeEmployee(`nolink${run}`, ['core.people.manage']);
    const a = await signIn(t.app, `nolink${run}`);
    expect((await a.call('GET', '/api/hires')).json()).toEqual({ state: 'off', hires: [] });
    expect((await a.call('POST', '/api/employees', { login: `typed${run}`, fullName: 'Typed Person', identityVerifiedHow: 'ID', reason: 'new joiner' })).statusCode).toBe(200);
    const r = await a.call('POST', '/api/employees', { login: `typed2${run}`, fullName: 'X', identityVerifiedHow: 'ID', reason: 'r', hireRef: ref });
    expect(r.statusCode).toBe(400);
    expect(r.json().error).toMatch(/typed by hand/);
  });

  it('PL-08 D-75 a cut link reads as off, a missing database as down; neither is an error', async () => {
    await makeEmployee(`cut${run}`, ['core.people.manage']);
    await hello.query(`select platform.set_link('core_app', array['hire_v1'], false, 'CC-CUT', 'test cut')`);
    try {
      expect((await (await signIn(app, `cut${run}`)).call('GET', '/api/hires')).json()).toEqual({ state: 'off', hires: [] });
    } finally {
      await hello.query(`select platform.set_link('core_app', array['hire_v1'], true, 'CC-CUT', 'test back on')`);
    }
    const gone = postgres({ database: 'no_such_db', username: 'core_app', password: 'test-only', onnotice: () => {}, connect_timeout: 3 });
    const down = buildApp({ ...t.deps, links: { recruitment: gone } });
    expect((await (await signIn(down, `cut${run}`)).call('GET', '/api/hires')).json()).toEqual({ state: 'down', hires: [] });
    await down.close(); await gone.end();
  });
});

describe('D-76 training beside the permissions', () => {
  it('PL-08 D-76 the person\'s training from Recruitment is shown read only, with valid-until and qualified', async () => {
    await makeEmployee(`tradm${run}`, ['core.people.manage']);
    const person = await makeEmployee(`trainee${run}`);
    await hello.query(`insert into training_probe values ($1, 'x', 'x', 'SOP-QA-001', 'Line clearance', '2026-01-10', '2027-01-09', true, now()),
      ($1, 'x', 'x', 'SOP-QA-002', 'Gowning', '2025-01-10', '2025-12-31', false, now())`, [person]);
    const a = await signIn(app, `tradm${run}`);
    expect((await a.call('GET', `/api/employees/${person}/training`)).json()).toEqual({ state: 'on', training: [
      { skillCode: 'SOP-QA-001', skillTitle: 'Line clearance', trainedOn: '2026-01-10', validUntil: '2027-01-09', qualified: true },
      { skillCode: 'SOP-QA-002', skillTitle: 'Gowning', trainedOn: '2025-01-10', validUntil: '2025-12-31', qualified: false },
    ] });
    // Nothing blocks: a grant works with or without training.
    expect((await a.call('PUT', `/api/employees/${person}/permissions`, { product: 'core', codes: ['core.masterdata.view'], reason: 'test' })).statusCode).toBe(200);
    expect((await (await signIn(t.app, `tradm${run}`)).call('GET', `/api/employees/${person}/training`)).json()).toEqual({ state: 'off', training: [] });
  });
});

describe('D-79 the Links screen', () => {
  it('PL-12 D-79 every known link with on / off / down: core\'s own read checked for real, a missing reader login is down', async () => {
    await makeEmployee(`lnk${run}`, ['core.people.manage']);
    const su = superuser();
    await su`delete from link_state where consumer in ('core_app', ${`ext_gone${run}`})`;
    await su`insert into link_state (provider, consumer, view_name, switched_on_at, change_ref) values
      ('hello', 'core_app', 'hire_v1', now(), 'CC-CORE'), ('master_data', ${`ext_gone${run}`}, 'equipment_v1', now(), 'CC-X')`;
    await su.end();
    const r = (await (await signIn(app, `lnk${run}`)).call('GET', '/api/links')).json();
    const find = (reader: string, provider: string, view: string) => r.links.find((l: { reader: string; provider: string; view: string }) =>
      l.reader === reader && l.provider === provider && l.view === view);
    expect(find('core_app', 'hello', 'hire_v1')).toMatchObject({ state: 'down', readerName: 'Core (People)' }); // no core setting for "hello"
    expect(find(`ext_gone${run}`, 'master_data', 'equipment_v1')).toMatchObject({ state: 'down', providerName: 'Master data' });
    expect(find('core_app', 'recruitment', 'training_v1')).toBeUndefined();   // Recruitment not licensed here
    expect(typeof r.checkedAt).toBe('string');
    const withHello = buildApp({ ...t.deps, links: { hello: rec } });
    expect((await (await signIn(withHello, `lnk${run}`)).call('GET', '/api/links')).json().links
      .find((l: { reader: string; view: string }) => l.reader === 'core_app' && l.view === 'hire_v1')).toMatchObject({ state: 'on' });
    await withHello.close();
    const su2 = superuser();
    await su2`delete from link_state where consumer in ('core_app', ${`ext_gone${run}`})`;
    await su2.end();
    await makeEmployee(`nolnk${run}`, ['core.masterdata.view']);
    expect((await (await signIn(app, `nolnk${run}`)).call('GET', '/api/links')).statusCode).toBe(403);
  });
});

describe('D-77 D-78 logos and plant time', () => {
  it('D-77 a product is marked logo exactly when its logo file exists, so no logo is requested in vain', () => {
    const files = readdirSync('apps/core/web/public/products').filter((f) => f.endsWith('.png')).map((f) => f.slice(0, -4)).sort();
    expect(Object.entries(PRODUCTS).filter(([, p]) => p.logo).map(([k]) => k).sort()).toEqual(files);
  });

  it('D-78 dates and times read in plant time: "17 Nov 2026, 10:57 pm IST"', () => {
    expect(plantTime('2026-11-17T17:27:23Z')).toBe('17 Nov 2026, 10:57 pm IST');
    expect(plantTime('2026-11-17T18:45:00Z')).toBe('18 Nov 2026, 12:15 am IST');
    expect(plantTime('2026-09-01T06:30:00Z')).toBe('1 Sep 2026, 12:00 pm IST');
    expect(plantTime(null)).toBe('');
    expect(plantDate('2026-12-01')).toBe('1 Dec 2026');
  });
});
