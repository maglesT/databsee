// Slice A8: the control panel (PL-09 system description, PL-10 recorded and authorised switches).
import { readFileSync } from 'node:fs';
import path from 'node:path';
import postgres from 'postgres';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import YAML from 'yaml';
import { buildPanel } from '../apps/control-panel/app.js';
import { arrows, diagram } from '../apps/control-panel/diagram.js';
import type { Repo } from '../apps/control-panel/github.js';
import { hashPassword } from '../apps/core/server/passwords.js';
import { checkConfig, ROOT } from '../deploy/config.js';
import { enableLogin, sqlstate } from './db.js';

// The example customer file as "acme", plus an outside system, in a stand-in for the GitHub repository.
const start = readFileSync(path.join(ROOT, 'customers/example.yaml'), 'utf8')
  .replace('customer: example', 'customer: acme').replace('outside_logins: {}', 'outside_logins:\n  bi:\n    hello: [note_v1]');
const files = new Map<string, string>([['acme', start]]);
const commits: { message: string; sha: string }[] = [];
const repo: Repo = {
  customers: async () => [...files.keys()],
  read: async (c) => { const text = files.get(c); if (!text) throw Object.assign(new Error('Unknown customer.'), { statusCode: 404 }); return { text, sha: `v${commits.length}` }; },
  write: async (c, text, sha, message) => {
    if (sha !== `v${commits.length}`) throw new Error('changed since read');
    files.set(c, text);
    commits.push({ message, sha: `c${commits.length + 1}` });
    return commits.at(-1)!.sha;
  },
  applyResult: async () => 'success',
};

let db: postgres.Sql;
let panel: ReturnType<typeof buildPanel>;
const auth = (user = 'owner', pw = 'test-only-owner-pw') => ({ authorization: `Basic ${Buffer.from(`${user}:${pw}`).toString('base64')}` });
const post = (url: string, form: Record<string, string>) => panel.inject({
  method: 'POST', url, headers: { ...auth(), 'content-type': 'application/x-www-form-urlencoded' }, payload: new URLSearchParams(form).toString() });
const current = () => checkConfig(YAML.parse(files.get('acme')!)).config;

beforeAll(async () => {
  await enableLogin('control_panel_app');
  db = postgres({ database: 'control_panel', username: 'control_panel_app', password: 'test-only', max: 1, onnotice: () => {} });
  panel = buildPanel({ db, repo, users: { owner: await hashPassword('test-only-owner-pw') } });
});
afterAll(async () => { await panel.close(); await db.end(); });

describe('PL-09 system description drawn from the config', () => {
  it('PL-09 the diagram lists every product, the version and every link and outside system of the config', () => {
    const config = current();
    const svg = diagram(config, () => '#');
    for (const text of ['hello', 'v0.6.0', 'master data', 'identity', 'equipment_v1', 'bi', 'note_v1']) expect(svg).toContain(text);
    expect(arrows(config).map((a) => `${a.provider}>${a.reader}:${a.on}`).sort()).toEqual(['hello>bi:true', 'master_data>hello:true']);
  });

  it('PL-09 the customer page shows the diagram, licences, links and outside systems', async () => {
    const r = await panel.inject({ url: '/c/acme', headers: auth() });
    expect(r.statusCode).toBe(200);
    expect(r.body).toContain('<svg class="diagram"');
    expect(r.body).toContain('Platform 0.6.0');
    expect(r.body).toContain('master_data → hello');
  });
});

describe('PL-10 switches are authorised, recorded and committed to the config', () => {
  it('PL-10 only signed-in users reach the panel', async () => {
    expect((await panel.inject({ url: '/' })).statusCode).toBe(401);
    expect((await panel.inject({ url: '/', headers: auth('owner', 'wrong') })).statusCode).toBe(401);
    expect((await panel.inject({ url: '/', headers: auth() })).statusCode).toBe(200);
  });

  it('PL-10 a switch without the customer change reference or a reason is refused and changes nothing', async () => {
    const before = files.get('acme');
    const n = (await db`select count(*)::int as n from switch_log`)[0]!.n;
    for (const form of [{ change_ref: '', reason: 'x' }, { change_ref: 'CC-9', reason: ' ' }]) {
      const r = await post('/c/acme/switch', { kind: 'link', name: 'hello', provider: 'master_data', on: '0', ...form });
      expect(r.statusCode).toBe(400);
    }
    expect(files.get('acme')).toBe(before);
    expect((await db`select count(*)::int as n from switch_log`)[0]!.n).toBe(n);
  });

  it('PL-10 cutting a link commits the config with the change reference and logs who, why and the commit', async () => {
    const r = await post('/c/acme/switch', { kind: 'link', name: 'hello', provider: 'master_data', on: '0', change_ref: 'CC-2026-040', reason: 'Audit finding' });
    expect(r.statusCode).toBe(303);
    const config = current();
    expect(config.links).toEqual({});
    expect([config.change_ref, config.reason]).toEqual(['CC-2026-040', 'Audit finding']);
    expect(files.get('acme')).toContain('# Example customer config');              // the file's comments are kept
    expect(commits.at(-1)!.message).toMatch(/link master_data → hello off \(CC-2026-040\)[\s\S]*Reason: Audit finding[\s\S]*Switched by: owner/);
    expect(await db`select by_user, action, change_ref, reason, commit_sha from switch_log order by id desc limit 1`).toEqual([
      { by_user: 'owner', action: 'link master_data → hello off', change_ref: 'CC-2026-040', reason: 'Audit finding', commit_sha: commits.at(-1)!.sha },
    ]);
    // The cut link is now drawn dashed and can be switched back on with the manifest's views.
    expect(arrows(config)).toContainEqual({ reader: 'hello', provider: 'master_data', views: ['equipment_v1'], on: false, outside: false });
    await post('/c/acme/switch', { kind: 'link', name: 'hello', provider: 'master_data', on: '1', change_ref: 'CC-2026-041', reason: 'Restored' });
    expect(current().links).toEqual({ hello: { master_data: ['equipment_v1'] } });
  });

  it('PL-10 switching a licence off also cuts its links and outside systems, so the config stays valid', async () => {
    await post('/c/acme/switch', { kind: 'licence', name: 'hello', on: '0', change_ref: 'CC-2026-050', reason: 'Contract ended' });
    const config = current();
    expect([config.licences, config.links, config.outside_logins]).toEqual([[], {}, {}]);
  });

  it('PL-10 the switch log cannot be changed', async () => {
    expect(await sqlstate(db`update switch_log set reason = 'changed'`)).toBe('42501');
    expect(await sqlstate(db`delete from switch_log`)).toBe('42501');
  });
});
