// Slice A5: the hello reference product proves the recipe end to end over real HTTP:
// sign-on through core, master data read live, a signed record that keeps its values, a published view.
import { generateKeyPairSync } from 'node:crypto';
import { createServer } from 'node:net';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import postgres from 'postgres';
import { buildApp } from '../apps/core/server/app.js';
import { buildHello } from '../apps/hello/app.js';
import { coreApp, makeEmployee, PASSWORD, run, signIn, superuser } from './core.js';
import { enableLogin, sqlstate } from './db.js';

const freePort = () => new Promise<number>((resolve) => {
  const s = createServer().listen(0, '127.0.0.1', () => { const p = (s.address() as { port: number }).port; s.close(() => resolve(p)); });
});

let t: Awaited<ReturnType<typeof coreApp>>;
let core: ReturnType<typeof buildApp>;
let hello: ReturnType<typeof buildHello>;
let helloDb: postgres.Sql;
let helloMd: postgres.Sql;
let CORE = '';
let HELLO = '';
let mdSu: postgres.Sql;
let equipmentId = '';

beforeAll(async () => {
  t = await coreApp();
  const [cp, hp] = [await freePort(), await freePort()];
  CORE = `http://127.0.0.1:${cp}`;
  HELLO = `http://127.0.0.1:${hp}`;
  const key = generateKeyPairSync('rsa', { modulusLength: 2048 }).privateKey.export({ format: 'jwk' });
  core = buildApp({ ...t.deps, oidc: { issuer: `${CORE}/oidc`, clients: [{ client_id: 'hello', client_secret: 's3cret', redirect_uris: [`${HELLO}/cb`] }],
    jwks: { keys: [{ ...key, use: 'sig', kid: 'k' }] }, cookieKeys: ['ck'] } });
  await core.listen({ host: '127.0.0.1', port: cp });

  // What apply.sh does for a licensed product (slice A6): roles from its manifest, its login on, its master-data link.
  const su = superuser();
  await su`insert into product_role values ('hello', 'operator', 'Writes and signs notes'), ('hello', 'reader', 'Reads notes') on conflict do nothing`;
  await su.end();
  await enableLogin('hello_app');
  mdSu = postgres({ database: 'master_data', onnotice: () => {}, max: 1 });
  await mdSu`select platform.set_link('hello_app', array['equipment_v1'], true, 'CC-H1', 'hello reads equipment')`;

  helloDb = postgres({ database: 'hello', username: 'hello_app', password: 'test-only', onnotice: () => {} });
  helloMd = postgres({ database: 'master_data', username: 'hello_app', password: 'test-only', onnotice: () => {} });
  hello = buildHello({ db: helloDb, md: helloMd, oidc: { issuer: `${CORE}/oidc`, clientId: 'hello', clientSecret: 's3cret', redirectUri: `${HELLO}/cb` }, secureCookies: false });
  await hello.listen({ host: '127.0.0.1', port: hp });

  await makeEmployee(`hmd${run}`, ['master_data_editor']);
  const editor = await signIn(t.app, `hmd${run}`);
  equipmentId = (await editor.call('POST', '/api/items', { kind: 'equipment', code: `HE-${run}`, name: 'Coating pan', reason: 'initial load' })).json().id;
}, 60000);

afterAll(async () => {
  await mdSu`select platform.set_link('hello_app', array['equipment_v1'], false, 'CC-H9', 'cleanup')`.catch(() => {});
  await hello?.close(); await core?.close();
  await helloDb?.end(); await helloMd?.end(); await mdSu?.end(); await t?.sql.end(); await t?.md.end();
});

/** A browser: one cookie jar per origin, follows redirects, fills the core sign-in page when it appears. */
function browser() {
  const jars = new Map<string, Map<string, string>>();
  async function go(url: string, init: RequestInit = {}): Promise<Response> {
    const u = new URL(url);
    const jar = jars.get(u.origin) ?? new Map<string, string>();
    jars.set(u.origin, jar);
    const res = await fetch(url, { ...init, redirect: 'manual', headers: { ...(init.headers as object), cookie: [...jar].map(([k, v]) => `${k}=${v}`).join('; ') } });
    for (const c of res.headers.getSetCookie()) {
      const [kv] = c.split(';');
      const [k, ...v] = kv!.split('=');
      if (/expires=Thu, 01 Jan 1970/i.test(c) || v.join('=') === '') jar.delete(k!.trim()); else jar.set(k!.trim(), v.join('='));
    }
    return res;
  }
  /** Follows redirects; when the core sign-in page shows, submits `login`/`password`. Ends at the first non-redirect. */
  async function flow(url: string, login: string, password = PASSWORD) {
    let res = await go(url);
    let submitted = false;
    for (let i = 0; i < 15; i++) {
      const loc = res.headers.get('location');
      if (loc) { res = await go(new URL(loc, res.url || url).href); url = new URL(loc, url).href; continue; }
      const body = await res.text();
      const action = /action="([^"]+)"/.exec(body)?.[1];
      // Pages that a real browser submits by script (the provider's form-post steps).
      if (action && body.includes('document.forms[0].submit()')) {
        const fields = Object.fromEntries([...body.matchAll(/<input type="hidden" name="([^"]+)" value="([^"]*)"/g)].map((m) => [m[1]!, m[2]!]));
        const method = /method="([^"]+)"/i.exec(body)?.[1]?.toUpperCase() ?? 'POST';
        url = new URL(action.replace(/&amp;/g, '&'), url).href;
        res = await go(url, { method, headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(fields) });
        continue;
      }
      if (!action || submitted) return { status: res.status, body, url };
      submitted = true;
      url = new URL(action, CORE).href;
      res = await go(url, { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ login, password }) });
    }
    throw new Error('too many redirects');
  }
  const api = async (method: string, path: string, body?: object) => {
    const res = await go(`${HELLO}${path}`, { method, headers: body ? { 'content-type': 'application/json' } : {}, body: body ? JSON.stringify(body) : undefined });
    return { status: res.status, json: await res.json().catch(() => null) };
  };
  return { flow, api };
}

async function operator(name: string) {
  const id = await makeEmployee(name);
  const su = superuser();
  await su`insert into grant_event (employee_id, product, role, granted, by_name, reason) values (${id}, 'hello', 'operator', true, 'test', 'test')`;
  await su.end();
  const b = browser();
  await b.flow(`${HELLO}/login`, name);
  return b;
}

describe('the hello product proves the recipe', () => {
  it('PL-01 sign-on through core gives hello its own roles; no role, no entry', async () => {
    const b = await operator(`hop${run}`);
    expect((await b.api('GET', '/api/me')).json).toMatchObject({ name: `Name of hop${run}`, roles: ['operator'] });
    await makeEmployee(`hnone${run}`);
    const n = browser();
    const r = await n.flow(`${HELLO}/login`, `hnone${run}`);
    expect(r.body).toContain('You have no access to hello');
    expect((await n.api('GET', '/api/me')).status).toBe(401);
  });

  it('PL-05 PL-07 a note is signed after re-authentication and keeps the equipment as it was, even after a rename and a cut link', async () => {
    const b = await operator(`hsign${run}`);
    const eq = (await b.api('GET', '/api/equipment')).json.find((e: { code: string }) => e.code === `HE-${run}`);
    expect(eq).toMatchObject({ name: 'Coating pan', version: 1 });

    const start = await b.api('POST', '/api/notes/sign', { equipmentId, text: 'Cleaned after batch 42' });
    const wrong = await b.flow(start.json.redirect, `hsign${run}`, 'not my password');
    expect(wrong.body).toContain('Wrong login or password');
    const start2 = await b.api('POST', '/api/notes/sign', { equipmentId, text: 'Cleaned after batch 42' });
    await b.flow(start2.json.redirect, `hsign${run}`);
    const mine = (await b.api('GET', '/api/notes')).json.filter((n: { signer_name: string }) => n.signer_name === `Name of hsign${run}`);
    expect(mine).toHaveLength(1);
    expect(mine[0]).toMatchObject({ text: 'Cleaned after batch 42', equipment_code: `HE-${run}`, equipment_name: 'Coating pan', equipment_version: 1, meaning: 'authored' });

    // Master data changes, then the link is cut: the signed note is unchanged and still readable.
    const editor = await signIn(t.app, `hmd${run}`);
    await editor.call('PATCH', `/api/items/${equipmentId}`, { name: 'Coating pan 2', reason: 'renamed' });
    await mdSu`select platform.set_link('hello_app', array['equipment_v1'], false, 'CC-H2', 'cut for test')`;
    const off = await b.api('GET', '/api/equipment');
    expect(off.status).toBe(503);
    expect(off.json.message ?? off.json.error).toContain('Connection to master data is off');
    const after = (await b.api('GET', '/api/notes')).json.find((n: { id: string }) => n.id === mine[0].id);
    expect(after.equipment_name).toBe('Coating pan');
    await mdSu`select platform.set_link('hello_app', array['equipment_v1'], true, 'CC-H3', 'restored')`;
    expect((await b.api('GET', '/api/equipment')).json.find((e: { code: string }) => e.code === `HE-${run}`).name).toBe('Coating pan 2');
  });

  it('PL-05 another person cannot sign in the signed-in person\'s name', async () => {
    const b = await operator(`hown${run}`);
    await operator(`hother${run}`);
    const start = await b.api('POST', '/api/notes/sign', { equipmentId, text: 'not mine' });
    const r = await b.flow(start.json.redirect, `hother${run}`);
    expect(r.body).toContain('Only the person signed in can confirm here');
    expect((await b.api('GET', '/api/notes')).json.some((n: { text: string }) => n.text === 'not mine')).toBe(false);
  });

  it('PL-08 hello publishes note_v1: an outside reader sees it while linked, never the table, and not after the cut', async () => {
    const su = postgres({ database: 'postgres', onnotice: () => {}, max: 1 });
    await su.unsafe(`do $$ begin if not exists (select from pg_roles where rolname = 'ext_demo') then create role ext_demo login password 'test-only'; end if; end $$`);
    await su.end();
    await enableLogin('ext_demo'); // an earlier apply may have switched it off
    const hsu = postgres({ database: 'hello', onnotice: () => {}, max: 1 });
    await hsu`select platform.set_link('ext_demo', array['note_v1'], true, 'CC-X1', 'BI reads notes')`;
    const bi = postgres({ database: 'hello', username: 'ext_demo', password: 'test-only', onnotice: () => {}, max: 1 });
    expect((await bi`select count(*)::int as n from report.note_v1`)[0]!.n).toBeGreaterThan(0);
    expect(await sqlstate(bi`select * from public.note`)).toBe('42501');
    expect(await sqlstate(bi`insert into public.note (text) values ('x')`)).toBe('42501');
    await hsu`select platform.set_link('ext_demo', array['note_v1'], false, 'CC-X2', 'BI contract ended')`;
    expect(await sqlstate(bi`select 1 from report.note_v1`)).toBe('42501');
    await bi.end(); await hsu.end();
  });

  it('PL-08 at writing, hello refuses an inactive or unknown master-data item (recipe step 4, A11 5)', async () => {
    await makeEmployee(`hret${run}`, ['master_data_editor']);
    const editor = await signIn(t.app, `hret${run}`);
    const retired = (await editor.call('POST', '/api/items', { kind: 'equipment', code: `HR-${run}`, name: 'Old blender', reason: 'load' })).json().id;
    await editor.call('PATCH', `/api/items/${retired}`, { active: false, reason: 'retired' });
    const b = await operator(`hchk${run}`);
    for (const id of [retired, '00000000-0000-4000-8000-000000000000']) {
      const start = await b.api('POST', '/api/notes/sign', { equipmentId: id, text: 'should not be stored' });
      expect((await b.flow(start.json.redirect, `hchk${run}`)).body).toContain('No such active equipment');
    }
    expect((await b.api('GET', '/api/notes')).json.some((n: { text: string }) => n.text === 'should not be stored')).toBe(false);
  });

  it('PL-07 signed notes cannot be changed by the product', async () => {
    expect(await sqlstate(helloDb`update note set equipment_name = 'x'`)).toBe('42501');
    expect(await sqlstate(helloDb`delete from note`)).toBe('42501');
  });
});
