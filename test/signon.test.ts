// Slice A3: single sign-on for the products (OIDC authorization code + PKCE), driven over HTTP.
import { createHash, generateKeyPairSync, randomBytes } from 'node:crypto';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { buildApp } from '../apps/core/server/app.js';
import { coreApp, makeEmployee, PASSWORD, run, superuser } from './core.js';

const ISSUER = 'http://core.test/oidc';
const CLIENT = { client_id: 'hello', client_secret: 'hello-secret', redirect_uris: ['https://hello.test/cb'] };
const key = generateKeyPairSync('rsa', { modulusLength: 2048 }).privateKey.export({ format: 'jwk' });

let t: Awaited<ReturnType<typeof coreApp>>;
let app: ReturnType<typeof buildApp>;

beforeAll(async () => {
  t = await coreApp();
  app = buildApp({ ...t.deps, oidc: { issuer: ISSUER, clients: [CLIENT], jwks: { keys: [{ ...key, use: 'sig', kid: 'test' }] }, cookieKeys: ['test-cookie-key'] } });
  const su = superuser();
  await su`insert into product_role values ('hello', 'operator', 'Uses hello'), ('hello', 'reviewer', 'Reviews hello') on conflict do nothing`;
  await su.end();
});
afterAll(async () => { await t.sql.end(); await t.md.end(); });

async function grant(id: string, product: string, role: string) {
  const su = superuser();
  await su`insert into grant_event (employee_id, product, role, granted, by_name, reason) values (${id}, ${product}, ${role}, true, 'test', 'test')`;
  await su.end();
}

/** A browser stand-in: keeps cookies and follows the provider's redirects until the sign-in page or the product. */
function browser() {
  const jar = new Map<string, string>();
  const request = async (method: 'GET' | 'POST', url: string, form?: Record<string, string>) => {
    const res = await app.inject({
      method, url, headers: { host: 'core.test', ...(form ? { 'content-type': 'application/x-www-form-urlencoded' } : {}) },
      cookies: Object.fromEntries(jar), payload: form ? new URLSearchParams(form).toString() : undefined,
    });
    for (const c of res.cookies) { if (c.maxAge === 0 || c.value === '') jar.delete(c.name); else jar.set(c.name, c.value); }
    return res;
  };
  /** Follows redirects: returns the sign-in page HTML (+ its form action) or the code sent to the product. */
  const follow = async (start: Awaited<ReturnType<typeof request>>) => {
    let res = start;
    for (let i = 0; i < 10; i++) {
      const loc = res.headers.location as string | undefined;
      if (!loc) return { page: res.body, action: /action="([^"]+)"/.exec(res.body)?.[1] };
      if (loc.startsWith('https://hello.test/cb')) {
        const u = new URL(loc);
        return { code: u.searchParams.get('code'), error: u.searchParams.get('error') };
      }
      res = await request('GET', loc.replace('http://core.test', ''));
    }
    throw new Error('too many redirects');
  };
  return { request, follow };
}

function pkce() {
  const verifier = randomBytes(32).toString('base64url');
  return { verifier, challenge: createHash('sha256').update(verifier).digest('base64url') };
}

async function startAuth(b: ReturnType<typeof browser>, extra: Record<string, string> = {}) {
  const p = pkce();
  const q = new URLSearchParams({ client_id: 'hello', response_type: 'code', redirect_uri: CLIENT.redirect_uris[0]!, scope: 'openid profile roles',
    code_challenge: p.challenge, code_challenge_method: 'S256', state: 's', nonce: 'n', ...extra });
  return { step: await b.follow(await b.request('GET', `/oidc/auth?${q}`)), verifier: p.verifier };
}

async function signIn(b: ReturnType<typeof browser>, action: string, form: Record<string, string>) {
  return b.follow(await b.request('POST', action, form));
}

const basic = 'Basic ' + Buffer.from('hello:hello-secret').toString('base64');
async function token(form: Record<string, string>) {
  const res = await app.inject({ method: 'POST', url: '/oidc/token', headers: { host: 'core.test', authorization: basic, 'content-type': 'application/x-www-form-urlencoded' },
    payload: new URLSearchParams(form).toString() });
  return { status: res.statusCode, body: res.json() as Record<string, string> };
}
const exchange = (code: string, verifier: string) => token({ grant_type: 'authorization_code', code, code_verifier: verifier, redirect_uri: CLIENT.redirect_uris[0]! });
async function userinfo(accessToken: string) {
  return (await app.inject({ method: 'GET', url: '/oidc/me', headers: { host: 'core.test', authorization: `Bearer ${accessToken}` } })).json();
}
const idClaims = (jwt: string) => JSON.parse(Buffer.from(jwt.split('.')[1]!, 'base64url').toString());

/** Full sign-on as a product: returns the tokens. */
async function signOn(login: string, password = PASSWORD) {
  const b = browser();
  const { step, verifier } = await startAuth(b);
  const done = await signIn(b, step.action!, { login, password });
  if (!done.code) return { b, done };
  return { b, done, tokens: (await exchange(done.code, verifier)).body };
}

describe('PL-01 single sign-on gives each product only its own roles', () => {
  it('PL-01 the token for hello carries the hello roles and no core role', async () => {
    const id = await makeEmployee(`sso${run}`, ['viewer']);
    await grant(id, 'hello', 'operator');
    const { tokens } = await signOn(`sso${run}`);
    const info = await userinfo(tokens!.access_token!);
    expect(info).toMatchObject({ sub: id, preferred_username: `sso${run}`, name: `Name of sso${run}`, roles: ['operator'] });
    expect(idClaims(tokens!.id_token!).iss).toBe(ISSUER);
  });

  it('PL-01 someone without a role in the product is turned away at sign-in', async () => {
    await makeEmployee(`norole${run}`, ['viewer']);
    const { done } = await signOn(`norole${run}`);
    expect(done.code).toBeUndefined();
    expect(done.page).toContain('You have no access to hello');
  });

  it('PL-01 deactivation ends access in every product: renewal fails and sign-on is refused', async () => {
    const id = await makeEmployee(`gone${run}`);
    await grant(id, 'hello', 'operator');
    const { tokens } = await signOn(`gone${run}`);
    expect(tokens!.refresh_token).toBeTruthy();
    expect((await token({ grant_type: 'refresh_token', refresh_token: tokens!.refresh_token! })).status).toBe(200);
    const su = superuser();
    await su`insert into employee_version (employee_id, version, full_name, active, changed_by_name, reason) values (${id}, 2, 'Gone', false, 'test', 'left')`;
    await su.end();
    const again = await signOn(`gone${run}`);
    expect(again.done.code).toBeUndefined();
    const renewal = await token({ grant_type: 'refresh_token', refresh_token: tokens!.refresh_token! });
    expect(renewal.status).toBe(400);
    expect(renewal.body.error).toBe('invalid_grant');
  });

  it('PL-01 access tokens live 5 minutes', async () => {
    const id = await makeEmployee(`ttl${run}`);
    await grant(id, 'hello', 'operator');
    const { tokens } = await signOn(`ttl${run}`);
    expect(Number(tokens!.expires_in)).toBeLessThanOrEqual(300);
  });
});

describe('PL-05 re-authentication through the sign-on', () => {
  it('PL-05 with a live session the product gets a code without a password, but prompt=login demands it again', async () => {
    const id = await makeEmployee(`signer${run}`);
    await grant(id, 'hello', 'reviewer');
    const { b } = await signOn(`signer${run}`);

    const silent = await startAuth(b);
    expect(silent.step.code).toBeTruthy();                          // single sign-on: no second password

    const before = Math.floor(Date.now() / 1000);
    const reauth = await startAuth(b, { prompt: 'login', max_age: '0' });
    expect(reauth.step.code).toBeUndefined();
    expect(reauth.step.page).toContain('Enter your password again');
    const wrong = await signIn(b, reauth.step.action!, { login: `signer${run}`, password: 'not my password' });
    expect(wrong.code).toBeUndefined();
    expect(wrong.page).toContain('Wrong login or password');
    const ok = await signIn(b, wrong.action!, { login: `signer${run}`, password: PASSWORD });
    const tokens = (await exchange(ok.code!, reauth.verifier)).body;
    expect(idClaims(tokens.id_token!).auth_time).toBeGreaterThanOrEqual(before);
  });
});

describe('PL-04 password rules apply to product sign-on too', () => {
  it('PL-04 a temporary password must be changed on the sign-in page before the product gets a code', async () => {
    const id = await makeEmployee(`tempsso${run}`, [], { mustChange: true });
    await grant(id, 'hello', 'operator');
    const b = browser();
    const { step, verifier } = await startAuth(b);
    const change = await signIn(b, step.action!, { login: `tempsso${run}`, password: PASSWORD });
    expect(change.code).toBeUndefined();
    expect(change.page).toContain('Choose a new one');
    const weak = await signIn(b, change.action!, { login: `tempsso${run}`, password: PASSWORD, next: 'short', repeat: 'short' });
    expect(weak.page).toContain('at least 10 characters');
    const done = await signIn(b, weak.action!, { login: `tempsso${run}`, password: PASSWORD, next: 'my new long secret', repeat: 'my new long secret' });
    expect((await exchange(done.code!, verifier)).status).toBe(200);
  });

  it('PL-04 failed product sign-ons count towards the lockout and are recorded with the product', async () => {
    const id = await makeEmployee(`ssolock${run}`);
    await grant(id, 'hello', 'operator');
    t.mailbox.length = 0;
    for (let i = 0; i < 5; i++) await signOn(`ssolock${run}`, 'wrong');
    expect(t.mailbox.map((m) => m.text).join()).toContain(`ssolock${run}`);
    expect((await signOn(`ssolock${run}`)).done.code).toBeUndefined();
    const { rows } = { rows: await t.sql`select kind, product from credential_event where employee_id = ${id} order by id` };
    expect(rows.filter((r) => r.kind === 'signon_failed' && r.product === 'hello')).toHaveLength(6);
    expect(rows.some((r) => r.kind === 'locked')).toBe(true);
  });
});
