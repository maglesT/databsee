// The demo company (DEMO-ONLY, deploy/seed-demo.ts): loads into a fresh platform, is idempotent, refuses non-demo use.
// Runs on its own fresh identity and master_data databases (made like init.sh and migrate do), not the shared ones.
import { execFileSync } from 'node:child_process';
import postgres from 'postgres';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { migrate } from '../db/migrate.js';
import { loadPermissions } from '../deploy/apply.js';
import { allProducts, manifest } from '../deploy/config.js';
import { BY, readSeed, seedDemo } from '../deploy/seed-demo.js';
import { verifyPassword } from '../apps/core/server/passwords.js';

const ID = 'demo_t_identity';
const MD = 'demo_t_master_data';
const psql = (db: string, args: string[]) => execFileSync('psql', ['-X', '-q', '-v', 'ON_ERROR_STOP=1', '-d', db, ...args], { stdio: 'pipe' });
let identity: postgres.Sql;
let md: postgres.Sql;
const seed = readSeed();

beforeAll(async () => {
  for (const [db, dir] of [[ID, 'db/identity'], [MD, 'db/master_data']] as const) {
    psql('postgres', ['-c', `drop database if exists ${db} with (force)`]);
    const vars = ['-v', `db=${db}`, '-v', `owner=${db}_owner`, '-v', 'app=core_app'];
    psql('postgres', [...vars, '-f', 'db/server/cluster.sql']);
    psql(db, [...vars, '-f', 'db/server/database.sql']);
    await migrate(db, dir);
  }
  identity = postgres({ database: ID, max: 1, onnotice: () => {} });
  md = postgres({ database: MD, max: 1, onnotice: () => {} });
  await loadPermissions(identity, allProducts().map(manifest), 'test: every product licensed');   // what apply does
});
afterAll(async () => { await identity?.end(); await md?.end(); });

describe('demo company seed (DEMO-ONLY)', () => {
  it('PL-09 the demo seed refuses a customer other than "demo" and writes nothing', async () => {
    await expect(seedDemo('acme', identity, md)).rejects.toThrow(/only for the customer "demo"/);
    expect((await identity`select count(*)::int as n from employee`)[0]!.n).toBe(0);
  });

  it('PL-01 PL-03 the demo seed loads people, their permission codes and the edge cases into a fresh platform', async () => {
    expect(await seedDemo('demo', identity, md)).toBeGreaterThan(0);
    const people = await identity<{ login: string; active: boolean; must_change: boolean; password_hash: string }[]>`
      select e.login, e.active, c.must_change, c.password_hash from employee_current e join credential c on c.employee_id = e.id`;
    expect(people).toHaveLength(Object.keys(seed.people).length);
    const p = Object.fromEntries(people.map((r) => [r.login, r]));
    expect(p['prod.op3']!.active).toBe(false);                       // deactivated person
    expect(p['qc.analyst2']!.must_change).toBe(true);                // temporary password
    expect(people.filter((r) => r.must_change)).toHaveLength(1);
    expect(await verifyPassword(seed.password, p['it.admin']!.password_hash)).toBe(true);   // scrypt, the documented demo password
    const grants = await identity<{ login: string; code: string }[]>`
      select e.login, g.code from current_permission_grant g join employee e on e.id = g.employee_id`;
    for (const [login, person] of Object.entries(seed.people))
      expect(grants.filter((g) => g.login === login).map((g) => g.code).sort()).toEqual([...person.codes].sort());
    expect(grants.filter((g) => g.login === 'admin.office')).toEqual([]);                    // no product access
    const head = grants.filter((g) => g.login === 'qa.head').map((g) => g.code);             // D-30: admin + signing codes
    expect(head).toEqual(expect.arrayContaining(['core.people.manage', 'mms.fg.release', 'deviations.deviation.close', 'qual.report.approve']));
    // Every code granted is a current code of a product manifest (or core).
    const catalogue = new Set((await identity<{ code: string }[]>`select code from current_permission`).map((r) => r.code));
    expect(grants.every((g) => catalogue.has(g.code))).toBe(true);
  });

  it('PL-06 PL-08 the demo master data is in the published views with its links, one retired item and one inactive supplier', async () => {
    const counts = Object.fromEntries((await md<{ kind: string; n: number }[]>`select kind, count(*)::int as n from item_current group by kind`).map((r) => [r.kind, r.n]));
    expect(counts).toEqual(Object.fromEntries(Object.entries(seed.items).map(([k, v]) => [k, Object.keys(v).length])));
    const eq = await md<{ code: string; active: boolean; room_code: string }[]>`select code, active, room_code from report.equipment_v1`;
    expect(eq.every((e) => /^RM-/.test(e.room_code))).toBe(true);
    expect(eq.filter((e) => !e.active).map((e) => e.code)).toEqual(['EQ-CTG-02']);
    expect((await md`select code from report.supplier_v1 where not active`).map((r) => r.code)).toEqual(['SUP-10']);
    expect((await md`select unit from report.material_v1 where code = 'API-RAB'`)[0]!.unit).toBe('kg');
    expect((await md`select dosage_form from report.product_v1 where code = 'FG-RAB20'`)[0]!.dosage_form).toBe('Gastro-resistant tablet');
    expect((await md`select count(*)::int as n from report.item_link_v1 where from_code = 'FG-RAB20' and type = 'uses'`)[0]!.n).toBe(seed.items.product['FG-RAB20']!.uses!.length);
    // PL-06: every version and link event says who and why.
    expect((await md`select count(*)::int as n from item_version where changed_by_name <> ${BY} or reason = ''`)[0]!.n).toBe(0);
    expect((await md`select reason from item_version where version = 2`).map((r) => r.reason)).toHaveLength(2);
  });

  it('PL-02 the demo seed is idempotent: a second run writes no version, grant or link event', async () => {
    const events = async () => [
      (await identity`select (select count(*) from employee_version) + (select count(*) from permission_grant) + (select count(*) from credential_event) as n`)[0]!.n,
      (await md`select (select count(*) from item_version) + (select count(*) from link_event) as n`)[0]!.n,
    ];
    const before = await events();
    expect(await seedDemo('demo', identity, md)).toBe(0);
    expect(await events()).toEqual(before);
  });

  it('PL-09 the demo seed refuses an identity database that holds people it did not make (a real installation)', async () => {
    await identity`insert into employee (login, identity_verified_by, identity_verified_how) values ('real.person', 'installer', 'passport')`;
    await expect(seedDemo('demo', identity, md)).rejects.toThrow(/not a demo installation/);
  });
});
