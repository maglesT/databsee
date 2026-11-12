// Slice A3: single sign-on for the products (OIDC authorization code + PKCE), driven over HTTP.
import { createHash, generateKeyPairSync, randomBytes } from 'node:crypto';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { buildApp } from '../apps/core/server/app.js';
import { coreApp, grant, helloCatalogue, makeEmployee, PASSWORD, run, superuser } from './core.js';

const ISSUER = 'http://core.test/oidc';
const CLIENT = { client_id: 'hello', client_secret: 'hello-secret', redirect_uris: ['https://hello.test/cb'] };
const key = generateKeyPairSync('rsa', { modulusLength: 2048 }).privateKey.export({ format: 'jwk' });

let t: Awaited<ReturnType<typeof coreApp>>;
let app: ReturnType<typeof buildApp>;

beforeAll(async () => {
  t = await coreApp();
  app = buildApp({ ...t.deps, oidc: { issuer: ISSUER, clients: [CLIENT], jwks: { keys: [{ ...key, use: 'sig', kid: 'test' }] }, cookieKeys: ['test-cookie-key'] } });
  await helloCatalogue();
});
afterAll(async () => { await t.sql.end(); await t.md.end(); });

/** A browser stand-in: keeps cookies and follows the provider's redirects until the sign-in page or the product. */
function browser(a = app) {
  const jar = new Map<string, string>();
  const keep = (res: Awaited<ReturnType<typeof a.inject>>) => {
    for (const c of res.cookies) { if (c.maxAge === 0 || c.value === '') jar.delete(c.name); else jar.set(c.name, c.value); }
    return res;
  };
  const request = async (method: 'GET' | 'POST', url: string, form?: Record<string, string>) => keep(await a.inject({
    method, url, headers: { host: 'core.test', ...(form ? { 'content-type': 'application/x-www-form-urlencoded' } : {}) },
    cookies: Object.fromEntries(jar), payload: form ? new URLSearchParams(form).toString() : undefined,
  }));
  /** The core screens' API (JSON), on the same cookies. */
  const api = async (method: 'GET' | 'POST', url: string, body?: object) => keep(await a.inject({
    method, url, headers: { host: 'core.test' }, cookies: Object.fromEntries(jar), ...(body ? { payload: body } : {}),
  }));
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
  return { request, follow, api, jar };
}

function pkce() {
  const verifier = randomBytes(32).toString('base64url');
  return { verifier, challenge: createHash('sha256').update(verifier).digest('base64url') };
}

async function startAuth(b: ReturnType<typeof browser>, extra: Record<string, string> = {}) {
  const p = pkce();
  const q = new URLSearchParams({ client_id: 'hello', response_type: 'code', redirect_uri: CLIENT.redirect_uris[0]!, scope: 'openid profile permissions',
    code_challenge: p.challenge, code_challenge_method: 'S256', state: 's', nonce: 'n', ...extra });
  return { step: await b.follow(await b.request('GET', `/oidc/auth?${q}`)), verifier: p.verifier };
}

async function signIn(b: ReturnType<typeof browser>, action: string, form: Record<string, string>) {
  return b.follow(await b.request('POST', action, form));
}

const basic = 'Basic ' + Buffer.from('hello:hello-secret').toString('base64');
async function token(form: Record<string, string>, a = app) {
  const res = await a.inject({ method: 'POST', url: '/oidc/token', headers: { host: 'core.test', authorization: basic, 'content-type': 'application/x-www-form-urlencoded' },
    payload: new URLSearchParams(form).toString() });
  return { status: res.statusCode, body: res.json() as Record<string, string> };
}
const exchange = (code: string, verifier: string, a = app) => token({ grant_type: 'authorization_code', code, code_verifier: verifier, redirect_uri: CLIENT.redirect_uris[0]! }, a);
async function userinfo(accessToken: string, a = app) {
  return (await a.inject({ method: 'GET', url: '/oidc/me', headers: { host: 'core.test', authorization: `Bearer ${accessToken}` } })).json();
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

describe('PL-01 single sign-on gives each product only its own permissions', () => {
  it('PL-01 the token for hello carries exactly the hello permission codes and no core one', async () => {
    const id = await makeEmployee(`sso${run}`, ['core.masterdata.view', 'core.people.manage', 'hello.note.sign', 'hello.note.read']);
    const { tokens } = await signOn(`sso${run}`);
    const info = await userinfo(tokens!.access_token!);
    expect(info).toMatchObject({ sub: id, preferred_username: `sso${run}`, name: `Name of sso${run}` });
    expect(info.permissions).toEqual(['hello.note.read', 'hello.note.sign']);
    expect(info.roles).toBeUndefined();
    expect(idClaims(tokens!.id_token!).iss).toBe(ISSUER);
  });

  it('PL-01 a revoked permission is gone from the next renewal; with none left, sign-on is refused', async () => {
    const id = await makeEmployee(`ssorev${run}`, ['hello.note.sign', 'hello.note.read']);
    const { tokens } = await signOn(`ssorev${run}`);
    const su = superuser();
    await su`insert into permission_grant (employee_id, product, code, granted, by_name, reason) values (${id}, 'hello', 'hello.note.sign', false, 'test', 'moved')`;
    await su.end();
    const renewed = await token({ grant_type: 'refresh_token', refresh_token: tokens!.refresh_token! });
    expect((await userinfo(renewed.body.access_token!)).permissions).toEqual(['hello.note.read']);
    const su2 = superuser();
    await su2`insert into permission_grant (employee_id, product, code, granted, by_name, reason) values (${id}, 'hello', 'hello.note.read', false, 'test', 'left')`;
    await su2.end();
    expect((await signOn(`ssorev${run}`)).done.page).toContain('You have no access to hello');
  });

  it('PL-01 someone without a permission in the product is turned away at sign-in', async () => {
    await makeEmployee(`norole${run}`, ['core.masterdata.view']);
    const { done } = await signOn(`norole${run}`);
    expect(done.code).toBeUndefined();
    expect(done.page).toContain('You have no access to hello');
  });

  it('PL-01 deactivation ends access in every product: renewal fails and sign-on is refused', async () => {
    const id = await makeEmployee(`gone${run}`);
    await grant(id, ['hello.note.sign']);
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

  it('PL-01 Your applications lists only the products the person holds a permission in, with the address to open', async () => {
    const apps = async (login: string) => {
      const res = await app.inject({ method: 'POST', url: '/api/login', payload: { login, password: PASSWORD } });
      const cookies = Object.fromEntries(res.cookies.map((c) => [c.name, c.value]));
      return (await app.inject({ method: 'GET', url: '/api/my-apps', cookies })).json();
    };
    await makeEmployee(`apps${run}`, ['core.people.manage', 'hello.note.read']);
    await makeEmployee(`noapps${run}`, ['core.people.manage']);
    expect(await apps(`apps${run}`)).toEqual([{ product: 'hello', url: 'https://hello.test/' }]);
    expect(await apps(`noapps${run}`)).toEqual([]);                    // core rights alone list nothing
    expect((await app.inject({ method: 'GET', url: '/api/my-apps' })).statusCode).toBe(401);
  });

  it('PL-01 access tokens live 5 minutes', async () => {
    const id = await makeEmployee(`ttl${run}`);
    await grant(id, ['hello.note.sign']);
    const { tokens } = await signOn(`ttl${run}`);
    expect(Number(tokens!.expires_in)).toBeLessThanOrEqual(300);
  });
});

describe('PL-05 re-authentication through the sign-on', () => {
  it('PL-05 with a live session the product gets a code without a password, but prompt=login demands it again', async () => {
    const id = await makeEmployee(`signer${run}`);
    await grant(id, ['hello.note.read']);
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
    await grant(id, ['hello.note.sign']);
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
    await grant(id, ['hello.note.sign']);
    t.mailbox.length = 0;
    for (let i = 0; i < 5; i++) await signOn(`ssolock${run}`, 'wrong');
    expect(t.mailbox.map((m) => m.text).join()).toContain(`ssolock${run}`);
    expect((await signOn(`ssolock${run}`)).done.code).toBeUndefined();
    const { rows } = { rows: await t.sql`select kind, product from credential_event where employee_id = ${id} order by id` };
    expect(rows.filter((r) => r.kind === 'signon_failed' && r.product === 'hello')).toHaveLength(6);
    expect(rows.some((r) => r.kind === 'locked')).toBe(true);
  });
});

describe('PL-01 one person per browser: core sign-in and the products\' single sign-on start and end together', () => {
  // A product that takes back-channel logout; the provider's outgoing calls are caught instead of sent.
  const BACKCHANNEL = 'https://hello.test/backchannel-logout';
  const sent: { url: string; token: Record<string, unknown> }[] = [];
  const catcher = vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
    sent.push({ url: String(url), token: idClaims(new URLSearchParams(String(init?.body)).get('logout_token')!) });
    return new Response(null, { status: 200 });
  });
  let app2: ReturnType<typeof buildApp>;
  beforeAll(() => {
    app2 = buildApp({ ...t.deps, oidc: { issuer: ISSUER, clients: [{ ...CLIENT, backchannel_logout_uri: BACKCHANNEL }], jwks: { keys: [{ ...key, use: 'sig', kid: 'test' }] },
      cookieKeys: ['test-cookie-key'], fetch: catcher as unknown as typeof fetch } });
  });
  const person = async (name: string) => {
    const id = await makeEmployee(`${name}${run}`, ['core.masterdata.view']);
    await grant(id, ['hello.note.read']);
    return { id, login: `${name}${run}` };
  };
  /** The product signs on in this browser and gets its tokens (a code without a password means single sign-on). */
  const productSignOn = async (b: ReturnType<typeof browser>) => {
    const { step, verifier } = await startAuth(b);
    return step.code ? { silent: true, tokens: (await exchange(step.code, verifier, app2)).body } : { silent: false, page: step.page ?? '' };
  };
  const loggedOut = (sub: string) => sent.filter((x) => x.token.sub === sub);

  it('PL-01 signing in on core\'s screens also signs the person on to the products: no second password', async () => {
    const a = await person('one');
    const b = browser(app2);
    expect((await b.api('POST', '/api/login', { login: a.login, password: PASSWORD })).statusCode).toBe(200);
    const p = await productSignOn(b);
    expect(p.silent).toBe(true);
    expect((await userinfo(p.tokens!.access_token!, app2)).sub).toBe(a.id);
  });

  it('PL-01 sign-out on core ends the single sign-on, revokes the product\'s renewal and tells the product at once', async () => {
    const a = await person('out');
    const b = browser(app2);
    await b.api('POST', '/api/login', { login: a.login, password: PASSWORD });
    const p = await productSignOn(b);
    expect((await b.api('POST', '/api/logout')).statusCode).toBe(200);

    const [told] = loggedOut(a.id);
    expect(told?.url).toBe(BACKCHANNEL);
    expect(told?.token).toMatchObject({ iss: ISSUER, aud: 'hello', sub: a.id, events: { 'http://schemas.openid.net/event/backchannel-logout': {} } });
    expect(told?.token.nonce).toBeUndefined();
    const renewal = await token({ grant_type: 'refresh_token', refresh_token: p.tokens!.refresh_token! }, app2);
    expect(renewal.body.error).toBe('invalid_grant');
    expect((await productSignOn(b)).silent).toBe(false);                     // the product asks for the password again
    expect((await b.api('GET', '/api/me')).statusCode).toBe(401);
  });

  it('PL-01 another person signing in on core first ends the previous person\'s single sign-on, products told', async () => {
    const a = await person('first');
    const c = await person('second');
    const b = browser(app2);
    await b.api('POST', '/api/login', { login: a.login, password: PASSWORD });
    await productSignOn(b);
    await b.api('POST', '/api/login', { login: c.login, password: PASSWORD });
    expect(loggedOut(a.id)).toHaveLength(1);
    const p = await productSignOn(b);
    expect(p.silent).toBe(true);
    expect((await userinfo(p.tokens!.access_token!, app2)).sub).toBe(c.id);   // never the previous person
    expect((await b.api('GET', '/api/me')).json().login).toBe(c.login);
  });

  it('PL-01 the same person signing in again keeps their single sign-on (products not signed out)', async () => {
    const a = await person('again');
    const b = browser(app2);
    await b.api('POST', '/api/login', { login: a.login, password: PASSWORD });
    await productSignOn(b);
    await b.api('POST', '/api/login', { login: a.login, password: PASSWORD });
    expect(loggedOut(a.id)).toHaveLength(0);
  });

  it('PL-01 sign-out still ends the single sign-on after the core screens\' session went idle', async () => {
    const a = await person('idle');
    const b = browser(app2);
    await b.api('POST', '/api/login', { login: a.login, password: PASSWORD });
    await productSignOn(b);
    const su = superuser();
    await su`update session set last_seen_at = now() - interval '1 day' where employee_id = ${a.id}`;
    await su.end();
    expect((await b.api('POST', '/api/logout')).statusCode).toBe(200);
    expect(loggedOut(a.id)).toHaveLength(1);
    expect((await productSignOn(b)).silent).toBe(false);
  });

  it('PL-01 signed in through a product, the core screens open as that person; "Yes, sign me out" at core ends both', async () => {
    const a = await person('viaprod');
    const b = browser(app2);
    const { step } = await startAuth(b);
    expect((await signIn(b, step.action!, { login: a.login, password: PASSWORD })).code).toBeTruthy();
    expect((await b.api('GET', '/api/me')).json().login).toBe(a.login);

    const form = (await b.request('GET', '/oidc/session/end')).body;
    const xsrf = /name="xsrf" value="([^"]+)"/.exec(form)?.[1];
    expect(xsrf).toBeTruthy();
    await b.request('POST', '/oidc/session/end/confirm', { xsrf: xsrf!, logout: 'yes' });
    await new Promise((r) => setTimeout(r, 200));                             // the provider's event runs after its answer
    expect((await b.api('GET', '/api/me')).statusCode).toBe(401);
    expect(loggedOut(a.id)).toHaveLength(1);
  });

  it('PL-01 a single sign-on cookie with a wrong signature is not taken', async () => {
    const a = await person('forged');
    const b = browser(app2);
    await b.api('POST', '/api/login', { login: a.login, password: PASSWORD });
    b.jar.delete('sid');
    b.jar.set('_session.sig', 'forged');
    expect((await b.api('GET', '/api/me')).statusCode).toBe(401);
  });
});
