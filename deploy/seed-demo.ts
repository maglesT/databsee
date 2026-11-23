// DEMO-ONLY: loads the fictional demo company (deploy/demo.seed.yaml, docs/demo-company.md) into the identity and
// master_data databases of a demo installation, for testing the live platform before go-live. Never for a customer.
// It writes into the same insert-only tables the core screens use: employee + version + credential (PL-03, PL-06),
// permission grants with who/when/why (PL-01, PL-02), items with versions and link events (PL-06). Every row says
// "demo seed" (who: changed_by null, as for the installer; master data needs an id, so it.admin's). Unlike the core,
// demo passwords are not temporary (except qc.analyst2), so testers can sign on at once.
// MED-03: no password is kept in the repo. Each person the seed adds gets their own random password, printed once to
// the operator (never stored except as a scrypt hash). --new-passwords gives every demo person a new one (rotation).
// Idempotent: each event is written only if the seed never wrote it before, so a second run writes nothing and never
// undoes what was changed in the screens since. Refuses unless the customer config is "demo", and unless identity is
// empty or already holds the seed's people (a real installation has neither).
// Usage (after apply, so the permission catalogue is loaded, and instead of create-first-admin: it.admin is the
// identity administrator): tsx deploy/seed-demo.ts customers/demo.yaml
// Connection: PG* env as the server's superuser (the installer), like apply.
import { randomBytes } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import postgres, { type Sql } from 'postgres';
import YAML from 'yaml';
import { FIELDS, type Kind } from '../apps/core/server/master-data.js';
import { hashPassword } from '../apps/core/server/passwords.js';
import { ROOT } from './config.js';

export const BY = 'demo seed';
const REASON = 'demo seed (DEMO-ONLY fictional company, not customer data)';

interface Person { name: string; dept: string; codes: string[]; temporary?: boolean; deactivate?: string }
type Item = Record<string, unknown> & { name: string; in?: string; from?: string[]; uses?: string[]; retire?: string };
interface Seed { company: string; people: Record<string, Person>; items: Record<Kind, Record<string, Item>> }

export const readSeed = (file = path.join(ROOT, 'deploy/demo.seed.yaml')): Seed => YAML.parse(readFileSync(file, 'utf8'));

/** A random demo password (MED-03): 20 base64url characters, 120 bits. */
export const demoPassword = () => randomBytes(15).toString('base64url');

/** Loads the demo company. Returns the number of rows written (0 on a second run) and the password of each person it
 *  added, to be shown once to the operator. */
export async function seedDemo(customer: string, identity: Sql, md: Sql, seed = readSeed()): Promise<{ written: number; passwords: Map<string, string> }> {
  if (customer !== 'demo') throw new Error(`the demo seed is only for the customer "demo", not "${customer}"`);
  let written = 0;
  const passwords = new Map<string, string>();
  const w = async (q: Promise<unknown>) => { await q; written++; };

  const ids = await identity.begin(async (tx) => {
    const [g] = await tx<{ any: boolean; demo: boolean }[]>`select exists (select from employee) as any,
      exists (select from employee where identity_verified_by = ${BY}) as demo`;
    if (g!.any && !g!.demo) throw new Error('identity holds people but none from the demo seed: refusing (not a demo installation)');
    const known = new Set((await tx<{ code: string }[]>`select code from current_permission`).map((r) => r.code));
    const unknown = Object.values(seed.people).flatMap((p) => p.codes).filter((c) => !known.has(c));
    if (unknown.length) throw new Error(`codes not in the permission catalogue (run apply first?): ${[...new Set(unknown)].join(', ')}`);

    const ids = new Map<string, string>();
    for (const [login, p] of Object.entries(seed.people)) {
      let [e] = await tx<{ id: string; active: boolean; version: number }[]>`select id, active, version from employee_current where login = ${login}`;
      if (!e) {
        [e] = await tx<{ id: string; active: boolean; version: number }[]>`insert into employee (login, identity_verified_by, identity_verified_how)
          values (${login}, ${BY}, 'fictional demo person') returning id, true as active, 1 as version`;
        await tx`insert into employee_version (employee_id, version, full_name, email, active, changed_by_name, reason)
          values (${e!.id}, 1, ${p.name}, ${`${login}@demo-pharma.example`}, true, ${BY}, ${REASON})`;
        const password = demoPassword();
        passwords.set(login, password);
        await tx`insert into credential (employee_id, password_hash, must_change) values (${e!.id}, ${await hashPassword(password)}, ${p.temporary === true})`;
        await w(tx`insert into credential_event (employee_id, login, kind, by_name, reason) values (${e!.id}, ${login}, 'reset', ${BY}, ${REASON})`);
      }
      const [done] = await tx<{ n: number }[]>`select count(*)::int as n from employee_version where employee_id = ${e!.id} and version > 1 and changed_by_name = ${BY}`;
      if (p.deactivate && e!.active && done!.n === 0)
        await w(tx`insert into employee_version (employee_id, version, full_name, email, active, changed_by_name, reason)
          select employee_id, version + 1, full_name, email, false, ${BY}, ${p.deactivate} from employee_version
          where employee_id = ${e!.id} and version = ${e!.version}`);
      const held = new Set((await tx<{ code: string }[]>`select code from permission_grant where employee_id = ${e!.id} and by_name = ${BY}`).map((r) => r.code));
      for (const code of p.codes.filter((c) => !held.has(c)))
        await w(tx`insert into permission_grant (employee_id, product, code, granted, by_name, reason)
          values (${e!.id}, ${code.split('.')[0]!}, ${code}, true, ${BY}, ${REASON})`);
      ids.set(login, e!.id);
    }
    return ids;
  });

  // Master data: changed_by is the demo identity administrator (the column needs an employee id).
  const by = ids.get('it.admin');
  if (!by) throw new Error('the seed needs the person it.admin');
  await md.begin(async (tx) => {
    const item = new Map<string, string>();   // kind:code -> id
    for (const [kind, list] of Object.entries(seed.items) as [Kind, Record<string, Item>][]) {
      for (const [code, it] of Object.entries(list)) {
        const { name, in: _in, from: _from, uses: _uses, retire, ...rest } = it;
        const fields = FIELDS[kind].parse(rest);   // the core screen's own checks
        let [cur] = await tx<{ id: string; active: boolean; version: number }[]>`select id, active, version from item_current where kind = ${kind} and code = ${code}`;
        if (!cur) {
          [cur] = await tx<{ id: string; active: boolean; version: number }[]>`insert into item (kind, code) values (${kind}, ${code}) returning id, true as active, 1 as version`;
          await w(tx`insert into item_version (item_id, version, name, fields, active, changed_by, changed_by_name, reason)
            values (${cur!.id}, 1, ${name}, ${tx.json(fields)}, true, ${by}, ${BY}, ${REASON})`);
        }
        const [done] = await tx<{ n: number }[]>`select count(*)::int as n from item_version where item_id = ${cur!.id} and version > 1 and changed_by_name = ${BY}`;
        if (retire && cur!.active && done!.n === 0)
          await w(tx`insert into item_version (item_id, version, name, fields, active, changed_by, changed_by_name, reason)
            select item_id, version + 1, name, fields, false, ${by}, ${BY}, ${retire} from item_version where item_id = ${cur!.id} and version = ${cur!.version}`);
        item.set(`${kind}:${code}`, cur!.id);
      }
    }
    const find = (kind: Kind, code: string) => {
      const id = item.get(`${kind}:${code}`);
      if (!id) throw new Error(`the seed links to an unknown ${kind} ${code}`);
      return id;
    };
    const links: [string, string, string][] = [];
    for (const [kind, list] of Object.entries(seed.items) as [Kind, Record<string, Item>][])
      for (const [code, it] of Object.entries(list)) {
        const from = find(kind, code);
        if (it.in) links.push([from, find('room', it.in), 'located_in']);
        for (const s of it.from ?? []) links.push([from, find('supplier', s), 'supplied_by']);
        for (const m of it.uses ?? []) links.push([from, find('material', m), 'uses']);
      }
    // A link the seed wrote once is never written again (moved or ended in the screens since: left alone).
    const have = new Set((await tx<{ k: string }[]>`select from_item || ' ' || to_item || ' ' || type as k from link_event where changed_by_name = ${BY}`).map((r) => r.k));
    const placed = new Set([...have].filter((k) => k.endsWith(' located_in')).map((k) => k.split(' ')[0]));   // one room per item
    for (const [from, to, type] of links)
      if (!have.has(`${from} ${to} ${type}`) && !(type === 'located_in' && placed.has(from)))
        await w(tx`insert into link_event (from_item, to_item, type, active, changed_by, changed_by_name, reason)
          values (${from}, ${to}, ${type}, true, ${by}, ${BY}, ${REASON})`);
  });
  return { written, passwords };
}

/** MED-03 rotation: a new random password for every demo person (unlocks them too). Returns login -> password. */
export async function newDemoPasswords(customer: string, identity: Sql, seed = readSeed()): Promise<Map<string, string>> {
  if (customer !== 'demo') throw new Error(`the demo seed is only for the customer "demo", not "${customer}"`);
  const passwords = new Map<string, string>();
  await identity.begin(async (tx) => {
    const people = await tx<{ id: string; login: string }[]>`select id, login from employee
      where identity_verified_by = ${BY} and login in ${tx(Object.keys(seed.people))} order by login`;
    for (const e of people) {
      const password = demoPassword();
      passwords.set(e.login, password);
      await tx`update credential set password_hash = ${await hashPassword(password)}, must_change = ${seed.people[e.login]!.temporary === true},
        changed_at = now(), failed_count = 0, locked_at = null where employee_id = ${e.id}`;
      await tx`insert into credential_event (employee_id, login, kind, by_name, reason)
        values (${e.id}, ${e.login}, 'reset', ${BY}, 'demo seed: new random demo password (MED-03 rotation)')`;
    }
  });
  return passwords;
}

const printPasswords = (passwords: Map<string, string>) => {
  if (!passwords.size) return;
  console.log('Demo passwords (shown once, not stored anywhere; hand them to the testers privately):');
  for (const [login, pw] of passwords) console.log(`  ${login.padEnd(16)} ${pw}`);
};

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const file = process.argv[2];
  if (!file) throw new Error('usage: tsx deploy/seed-demo.ts customers/demo.yaml [--new-passwords]');
  const { customer } = YAML.parse(readFileSync(file, 'utf8')) as { customer?: string };
  const identity = postgres({ database: 'identity', max: 1, onnotice: () => {} });
  const md = postgres({ database: 'master_data', max: 1, onnotice: () => {} });
  try {
    if (process.argv.includes('--new-passwords')) printPasswords(await newDemoPasswords(String(customer), identity));
    else {
      const { written, passwords } = await seedDemo(String(customer), identity, md);
      console.log(`demo seed: ${written} row(s) written`);
      printPasswords(passwords);
    }
  } finally {
    await identity.end();
    await md.end();
  }
}
