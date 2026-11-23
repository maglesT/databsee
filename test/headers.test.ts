// MED-06: every site the proxy serves sends HSTS, a Content-Security-Policy, nosniff and Referrer-Policy.
import { execFileSync, spawn } from 'node:child_process';
import { createServer, request, type Server } from 'node:http';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import type { AddressInfo } from 'node:net';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { caddyfile, csp } from '../deploy/apply.js';
import { checkConfig, checkManifest, manifest } from '../deploy/config.js';
import { CORE_SCRIPT_HASHES, PRINT_SCRIPT, scriptHash } from '../apps/core/server/csp.js';
import { coreApp, makeEmployee, run, signIn } from './core.js';

const config = checkConfig({
  customer: 'ci', version: '0.6.0', domain: 'ci.example', offline: true, security_contact: 'security@ci.example',
  backup: { path: 'medhanta-backups/ci' }, change_ref: 'CC-H1', reason: 'headers', licences: ['hello', 'audit'], links: {},
  proxy: 'external',
}).config;
const POLICY = "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'";

let core: Awaited<ReturnType<typeof coreApp>>;
beforeAll(async () => { core = await coreApp(); });
afterAll(async () => { await core.app.close(); await core.sql.end(); await core.md.end(); });

describe('MED-06 security headers on every site', () => {
  it('MED-06 PL-01 each site block (core and every product) has one header block with HSTS, CSP, nosniff and Referrer-Policy', () => {
    const text = caddyfile(config);
    const sites = text.split(/\n(?=[a-z])/);
    expect(sites).toHaveLength(3);
    for (const site of sites) {
      expect(site.match(/header \{/g)).toHaveLength(1);
      expect(site).toContain('Strict-Transport-Security "max-age=31536000"');
      expect(site).toContain(`?Content-Security-Policy "${POLICY}`);
      expect(site).toContain("object-src 'none'; frame-ancestors 'none'\"");
      expect(site).toContain('X-Content-Type-Options "nosniff"');
      expect(site).toContain('Referrer-Policy "same-origin"');
    }
    // Core's one inline script is allowed by its hash, on core's site only.
    expect(sites[0]).toContain(`'${scriptHash(PRINT_SCRIPT)}'`);
    expect(sites[1]).not.toContain('sha256-');
  });

  it('MED-06 PL-01 a product lists the hashes of its inline scripts (its sign window) in its manifest; anything else is refused', () => {
    const hash = scriptHash('window.opener.postMessage("x")');
    const hello = { ...manifest('hello'), signon: { script_hashes: [hash] } };
    expect(checkManifest(hello, 'hello').signon?.script_hashes).toEqual([hash]);
    expect(csp([hash])).toContain(`script-src 'self' '${hash}';`);
    expect(() => checkManifest({ ...hello, signon: { script_hashes: ["'unsafe-inline'"] } }, 'hello')).toThrow(/script_hashes/);
  });

  it('MED-06 PL-01 core serves no inline script except by a listed hash, and no on*="" handler', async () => {
    await makeEmployee(`hdr${run}`, ['core.people.manage']);
    const r = await (await signIn(core.app, `hdr${run}`)).call('GET', '/api/access-review');
    const signin = await core.app.inject({ url: '/' });
    for (const html of [r.body, signin.body]) {
      expect(html).not.toMatch(/\son[a-z]+=/i);
      for (const [, body] of html.matchAll(/<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/g))
        expect(CORE_SCRIPT_HASHES).toContain(scriptHash(body!));
    }
    expect(r.body).toContain(`<script>${PRINT_SCRIPT}</script>`);
  });

  // The real proxy (caddy on PATH, as in CI): the generated Caddyfile, served over plain HTTP to a stand-in upstream.
  it('MED-06 PL-01 caddy sends the headers on proxied replies, and keeps a policy the product sends itself (CLEAR)', async () => {
    const upstream: Server = createServer((req, res) => {
      if (req.headers.host?.startsWith('audit.')) res.setHeader('Content-Security-Policy', "default-src 'self'; frame-ancestors 'none'");
      res.end('ok');
    });
    await new Promise<void>((ok) => upstream.listen(0, '127.0.0.1', ok));
    const up = (upstream.address() as AddressInfo).port;
    const port = 20000 + Math.floor(Math.random() * 20000);
    const dir = mkdtempSync(path.join(tmpdir(), 'med06-'));
    const file = path.join(dir, 'Caddyfile');
    writeFileSync(file, `{\n  admin off\n  auto_https off\n}\n` + caddyfile(config)
      .replace(/^(\S+) \{$/gm, `http://$1:${port} {`).replace(/reverse_proxy 127\.0\.0\.1:\d+/g, `reverse_proxy 127.0.0.1:${up}`));
    execFileSync('caddy', ['validate', '--config', file, '--adapter', 'caddyfile'], { stdio: 'pipe' });
    const caddy = spawn('caddy', ['run', '--config', file, '--adapter', 'caddyfile'], { stdio: 'ignore' });
    const get = (host: string) => new Promise<Record<string, unknown>>((ok, fail) =>
      request({ host: '127.0.0.1', port, headers: { host } }, (res) => { res.resume(); ok(res.headers); }).on('error', fail).end());
    try {
      let h: Record<string, unknown> = {};
      for (let i = 0; i < 50; i++) {
        try { h = await get('ci.example'); break; } catch { await new Promise((ok) => setTimeout(ok, 100)); }
      }
      expect(h).toMatchObject({ 'strict-transport-security': 'max-age=31536000', 'x-content-type-options': 'nosniff', 'referrer-policy': 'same-origin' });
      expect(h['content-security-policy']).toBe(csp(CORE_SCRIPT_HASHES));
      expect((await get('hello.ci.example'))['content-security-policy']).toBe(csp());
      const audit = await get('audit.ci.example');
      expect(audit['content-security-policy']).toBe("default-src 'self'; frame-ancestors 'none'");
      expect(audit['strict-transport-security']).toBe('max-age=31536000');
    } finally {
      caddy.kill();
      upstream.close();
      rmSync(dir, { recursive: true, force: true });
    }
  }, 20_000);
});
