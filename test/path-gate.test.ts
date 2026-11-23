// Pen test PH-01 / PH-02: the sign-in gate cannot be skipped by encoding tricks; CSV cells cannot carry formulas.
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { csv, hasEncodedUnreserved, isApiUrl } from '../apps/core/server/app.js';
import { coreApp } from './core.js';

let t: Awaited<ReturnType<typeof coreApp>>;
beforeAll(async () => { t = await coreApp(); });
afterAll(async () => { await t.app.close(); await t.sql.end(); await t.md.end(); });

describe('PH-01 path gate', () => {
  for (const url of ['/%61pi/me', '/%61%70%69/me', '/API/me', '//api/me', '/api/./me', '/api%2Fme', '/api%2fme', '/%2e/api/me', '/%5capi/me', '/api/%6de', '/api/me/', '/%2561pi/me'])
    it(`${url} is never 200 without a session`, async () => {
      const r = await t.app.inject({ method: 'GET', url });
      expect([400, 401, 404]).toContain(r.statusCode);
      expect(r.body).not.toMatch(/"login"|"permissions"/);
    });
  it('the plain route still answers 401 without a session', async () => {
    expect((await t.app.inject({ method: 'GET', url: '/api/me' })).statusCode).toBe(401);
  });
  it('helpers', () => {
    expect(isApiUrl('/%61pi/me')).toBe(true);
    expect(isApiUrl('/API/me?x=1')).toBe(true);
    expect(isApiUrl('/index.html')).toBe(false);
    expect(hasEncodedUnreserved('/%61pi/me')).toBe(true);
    expect(hasEncodedUnreserved('/api/a%20b')).toBe(false);
    expect(hasEncodedUnreserved('/api/x?q=%61')).toBe(false);
  });
});

describe('PH-02 csv injection', () => {
  it('prefixes formula cells and quotes normally', () => {
    const out = csv([{ a: '=1+1', b: '+SUM(A1)', c: '-2', d: '@cmd', e: '\tx', f: '\rx', g: 'say "hi", ok', h: 'plain', i: '=a,b' }]);
    expect(out).toBe(`a,b,c,d,e,f,g,h,i\n'=1+1,'+SUM(A1),'-2,'@cmd,'\tx,"'\rx","say ""hi"", ok",plain,"'=a,b"\n`);
  });
});
