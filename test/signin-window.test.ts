// MED-05 (on top of the timed lockout and per-address limit): failures count in a 15-minute window, and parallel
// sign-ins from one address cannot pass the per-address limit while their password checks run.
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { buildApp } from '../apps/core/server/app.js';
import { coreApp, makeEmployee, PASSWORD, run, signIn, superuser } from './core.js';

let t: Awaited<ReturnType<typeof coreApp>>;
beforeAll(async () => { t = await coreApp(); });
afterAll(async () => { await t.app.close(); await t.sql.end(); await t.md.end(); });

/** Moves a person's sign-in history `minutes` into the past (the trail is insert-only, so as the superuser). */
async function later(employeeId: string, minutes: number) {
  const su = superuser();
  try {
    await su.begin(async (tx) => {
      await tx`set local session_replication_role = replica`;
      await tx`update credential_event set at = at - make_interval(mins => ${minutes}) where employee_id = ${employeeId}`;
    });
  } finally { await su.end(); }
}

describe('MED-05 failure window and parallel limit', () => {
  it('MED-05 PL-04 failures count only within 15 minutes: four now and one an hour later never lock', async () => {
    const id = await makeEmployee(`window${run}`);
    for (let i = 0; i < 4; i++) expect((await signIn(t.app, `window${run}`, 'wrong password')).res.statusCode).toBe(401);
    await later(id, 60);
    for (let i = 0; i < 4; i++) expect((await signIn(t.app, `window${run}`, 'wrong password')).res.statusCode).toBe(401);
    expect((await signIn(t.app, `window${run}`)).res.statusCode).toBe(200);
  });

  it('MED-05 PL-04 five failures within 15 minutes still lock (and lift by themselves, as before)', async () => {
    await makeEmployee(`inside${run}`);
    for (let i = 0; i < 5; i++) await signIn(t.app, `inside${run}`, 'wrong password');
    expect((await signIn(t.app, `inside${run}`)).res.statusCode).toBe(401);
  });

  it('MED-05 PL-04 a parallel spray from one address gets 429 once the limit is reached, not after the hashes finish', async () => {
    const app = buildApp({ ...t.deps, loginFailuresPerMinute: 10 });
    try {
      const codes = (await Promise.all(Array.from({ length: 40 }, (_, i) => app.inject({ method: 'POST', url: '/api/login',
        remoteAddress: '203.0.113.77', payload: { login: `spray${i}${run}`, password: 'Summer2026!' } })))).map((r) => r.statusCode);
      expect(codes.filter((c) => c === 401)).toHaveLength(10);
      expect(codes.filter((c) => c === 429)).toHaveLength(30);
      // Finished attempts are no longer in flight: a good sign-in from a fresh address is not held up.
      await makeEmployee(`after${run}`);
      expect((await app.inject({ method: 'POST', url: '/api/login', remoteAddress: '203.0.113.78',
        payload: { login: `after${run}`, password: PASSWORD } })).statusCode).toBe(200);
      for (let i = 0; i < 12; i++) expect((await app.inject({ method: 'POST', url: '/api/login', remoteAddress: '203.0.113.78',
        payload: { login: `after${run}`, password: PASSWORD } })).statusCode).toBe(200);
    } finally { await app.close(); }
  });
});
