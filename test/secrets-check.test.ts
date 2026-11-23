// MED-03: the repos are public; CI refuses plain-text secrets (scripts/check-secrets.sh).
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const check = (dir?: string) => {
  try {
    return { ok: true, out: execFileSync('scripts/check-secrets.sh', dir ? [dir] : [], { encoding: 'utf8', stdio: 'pipe' }) };
  } catch (e) { return { ok: false, out: String((e as { stderr: string }).stderr) }; }
};

/** A throwaway git repo holding one file. */
function repo(file: string, text: string) {
  const dir = mkdtempSync(path.join(tmpdir(), 'secrets-'));
  mkdirSync(path.dirname(path.join(dir, file)), { recursive: true });
  writeFileSync(path.join(dir, file), text);
  execFileSync('git', ['init', '-q', dir]);
  execFileSync('git', ['-C', dir, 'add', '.']);
  return dir;
}

describe('MED-03 no plain-text secrets in the public repo', () => {
  it('MED-03 PL-10 this repo holds no plain-text password, token or key', () => {
    const r = check();
    expect(r.out).toMatch(/no plain-text secrets/);
    expect(r.ok).toBe(true);
  });

  it.each([
    ['deploy/demo.seed.yaml', 'company: x\npassword: Demo-Tablets-2026\n'],
    ['customers/acme.secrets.yaml', 'logins:\n  postgres: whatever\n'],
    ['customers/acme.secrets.yaml.age', 'logins: not encrypted\n'],
    // Built from parts, so this file itself holds no secret-looking value.
    ['notes.md', `token ${'ghp'}_${'a'.repeat(36)}\n`],
    ['key.txt', `-----BEGIN OPENSSH ${'PRIVATE'} KEY-----\nabc\n`],
    ['age.txt', `${'AGE-SECRET'}-KEY-1${'Q'.repeat(58)}\n`],
    ['control-panel.env', `GITHUB_TOKEN=${'github'}_pat_11${'A'.repeat(60)}\n`],
  ])('MED-03 PL-10 a commit with %s is refused', (file, text) => {
    const dir = repo(file, text);
    try { expect(check(dir).ok).toBe(false); } finally { rmSync(dir, { recursive: true, force: true }); }
  });

  it('MED-03 PL-10 placeholders in templates pass', () => {
    const dir = repo('customers/x.secrets.template.yaml', "backup_key: REPLACE-with-openssl-rand-base64-32\nsmtp_url: smtp://user:password@mail.example.com:587\n");
    try { expect(check(dir).ok).toBe(true); } finally { rmSync(dir, { recursive: true, force: true }); }
  });
});
