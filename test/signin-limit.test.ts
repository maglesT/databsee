// MED-05: a per-address limit on failed sign-ins, failures counted in a 15-minute window, a lock that lifts by itself,
// and a one-click unlock for the site security contact. The lockout alert and email stay (PL-04).
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { buildApp, FailureLimiter } from '../apps/core/server/app.js';
import { coreApp, makeEmployee, PASSWORD, run, superuser } from './core.js';

let t: Awaited<ReturnType<typeof coreApp>>;
let clock = Date.now();
let app: ReturnType<typeof buildApp>;
beforeAll(async () => {
  t = await coreApp();
  app = buildApp({ ...t.deps, limiter: new FailureLimiter(10, () => clock) });
});
beforeEach(() => { clock += 61_000; });   // each test starts with a clean per-address minute
afterAll(async () => { await app.close(); await t.app.close(); await t.sql.end(); await t.md.end(); });

const login = (who: string, password: string, ip = '198.51.100.7') =>
  app.inject({ method: 'POST', url: '/api/login', payload: { login: who, password }, headers: { 'x-forwarded-for': ip } });

/** Moves a person's sign-in history and lock `minutes` into the past (the trail is insert-only, so as the superuser). */
async function later(employeeId: string, minutes: number) {
  const su = superuser();
  try {
    await su.begin(async (tx) => {
      await tx`set local session_replication_role = replica`;
      await tx`update credential_event set at = at - make_interval(mins => ${minutes}) where employee_id = ${employeeId}`;
      await tx`update credential set locked_at = locked_at - make_interval(mins => ${minutes}) where employee_id = ${employeeId}`;
    });
  } finally { await su.end(); }
}

describe('MED-05 sign-in rate limit and lockout window', () => {
  it('MED-05 PL-04 spraying from one address gets 429 after 10 failures in a minute; other addresses and the next minute are not affected', async () => {
    const ip = '203.0.113.9';
    await makeEmployee(`spray${run}`);
    for (let i = 0; i < 10; i++) expect((await login(`nobody${i}${run}`, 'Summer2026!', ip)).statusCode).toBe(401);
    const blocked = await login(`spray${run}`, PASSWORD, ip);
    expect(blocked.statusCode).toBe(429);                                       // refused before any password check
    expect(blocked.json().error).toMatch(/Too many failed sign-ins/);
    expect((await login(`spray${run}`, PASSWORD, '203.0.113.10')).statusCode).toBe(200);
    clock += 61_000;
    expect((await login(`spray${run}`, PASSWORD, ip)).statusCode).toBe(200);
  });

  it('MED-05 PL-04 successful sign-ins from one address are never limited (a shared site address at shift start)', async () => {
    await makeEmployee(`shift${run}`);
    for (let i = 0; i < 30; i++) expect((await login(`shift${run}`, PASSWORD, '192.0.2.50')).statusCode).toBe(200);
  });

  it('MED-05 PL-04 five wrong tries by an attacker lock a person for 15 minutes only; the alert and the email stay', async () => {
    const id = await makeEmployee(`target${run}`);
    t.mailbox.length = 0;
    for (let i = 0; i < 5; i++) expect((await login(`target${run}`, 'guess', `192.0.2.${i}`)).statusCode).toBe(401);
    expect(t.mailbox).toHaveLength(1);                                          // PL-04: emailed at once
    expect(t.mailbox[0]!.text).toMatch(/lifts by itself after 15 minutes/);
    expect((await login(`target${run}`, PASSWORD)).statusCode).toBe(401);      // locked now
    await later(id, 14);
    expect((await login(`target${run}`, PASSWORD)).statusCode).toBe(401);      // still locked after 14 minutes
    await later(id, 2);
    expect((await login(`target${run}`, PASSWORD)).statusCode).toBe(200);      // lifted after 15
    const su = superuser();
    try {
      expect((await su`select count(*)::int as n from alert where employee_id = ${id} and kind = 'account_locked'`)[0]!.n).toBe(1);
    } finally { await su.end(); }
  });

  it('MED-05 PL-04 failures count only within 15 minutes: slow guessing never locks', async () => {
    const id = await makeEmployee(`slow${run}`);
    for (let i = 0; i < 4; i++) expect((await login(`slow${run}`, 'guess')).statusCode).toBe(401);
    await later(id, 16);
    for (let i = 0; i < 4; i++) expect((await login(`slow${run}`, 'guess')).statusCode).toBe(401);
    expect((await login(`slow${run}`, PASSWORD)).statusCode).toBe(200);
  });

  it('MED-05 PL-04 the security contact unlocks in one click from the lockout email; the link works once and a GET changes nothing', async () => {
    const id = await makeEmployee(`unlock${run}`);
    t.mailbox.length = 0;
    for (let i = 0; i < 5; i++) await login(`unlock${run}`, 'guess', `192.0.2.${100 + i}`);
    const link = t.mailbox[0]!.text.match(/\/unlock\/[A-Za-z0-9_-]+/)![0];
    const page = await app.inject({ url: link });
    expect(page.statusCode).toBe(200);
    expect(page.body).toContain(`<form method="post"><button>Unlock unlock${run}</button></form>`);
    expect((await login(`unlock${run}`, PASSWORD)).statusCode).toBe(401);      // opening the link unlocked nothing
    // As a browser posts the page's form (urlencoded, empty body).
    const post = () => app.inject({ method: 'POST', url: link, headers: { 'content-type': 'application/x-www-form-urlencoded' }, payload: '' });
    expect((await post()).statusCode).toBe(200);
    expect((await login(`unlock${run}`, PASSWORD)).statusCode).toBe(200);
    expect((await post()).statusCode).toBe(404);
    expect((await app.inject({ method: 'POST', url: '/unlock/forged-token' })).statusCode).toBe(404);
    const su = superuser();
    try {
      expect((await su`select by_name from credential_event where employee_id = ${id} and kind = 'unlocked'`).map((r) => r.by_name)).toEqual(['site security contact']);
      expect((await su`select acknowledged_at from alert where employee_id = ${id}`)[0]!.acknowledged_at).not.toBeNull();
    } finally { await su.end(); }
  });

  it('MED-05 PL-04 an unlock link works only for the lock it was sent for: not after it lifted, not for a later lock', async () => {
    const id = await makeEmployee(`stale${run}`);
    const lock = async () => {
      t.mailbox.length = 0;
      for (let i = 0; i < 5; i++) await login(`stale${run}`, 'guess', `192.0.2.${150 + i}`);
      return t.mailbox[0]!.text.match(/\/unlock\/[A-Za-z0-9_-]+/)![0];
    };
    const first = await lock();
    await later(id, 16);                                                        // lock A lifted unused
    expect((await app.inject({ url: first })).statusCode).toBe(404);
    const second = await lock();                                                // lock B
    expect((await app.inject({ method: 'POST', url: first })).statusCode).toBe(404);
    expect((await login(`stale${run}`, PASSWORD)).statusCode).toBe(401);       // still locked
    expect((await app.inject({ method: 'POST', url: second })).statusCode).toBe(200);
  });

  it('MED-05 PL-04 tries made while locked (even with the right password) do not count once the lock lifts', async () => {
    const id = await makeEmployee(`during${run}`);
    for (let i = 0; i < 5; i++) await login(`during${run}`, 'guess', `192.0.2.${160 + i}`);
    for (let i = 0; i < 4; i++) expect((await login(`during${run}`, PASSWORD, `192.0.2.${170 + i}`)).statusCode).toBe(401);
    await later(id, 16);
    expect((await login(`during${run}`, 'typo', '192.0.2.180')).statusCode).toBe(401);
    expect((await login(`during${run}`, PASSWORD, '192.0.2.181')).statusCode).toBe(200);
  });

  it('MED-05 PL-04 parallel sprays from one address cannot pass the limit; an IPv6 /64 counts as one address', async () => {
    const codes = await Promise.all(Array.from({ length: 40 }, (_, i) => login(`par${i}${run}`, 'Summer2026!', '203.0.113.77')))
      .then((r) => r.map((x) => x.statusCode));
    expect(codes.filter((c) => c === 401)).toHaveLength(10);
    expect(codes.filter((c) => c === 429)).toHaveLength(30);
    for (let i = 0; i < 10; i++) await login(`v6${i}${run}`, 'x', `2001:db8:1:2::${i + 1}`);
    expect((await login(`v6x${run}`, 'x', '2001:db8:1:2:ffff::9')).statusCode).toBe(429);
    expect((await login(`v6y${run}`, 'x', '2001:db8:1:3::1')).statusCode).toBe(401);
  });
});
