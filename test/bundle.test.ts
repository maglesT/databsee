// Slice A7: signed bundles and the customer files in the repo (PL-10).
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { checkConfig, readYaml, ROOT } from '../deploy/config.js';

const dir = mkdtempSync(path.join(tmpdir(), 'bundle-'));
const keygen = (name: string) => {
  execFileSync('ssh-keygen', ['-q', '-t', 'ed25519', '-N', '', '-C', name, '-f', path.join(dir, name)]);
  return readFileSync(path.join(dir, `${name}.pub`), 'utf8').trim();
};
const release = keygen('release');
keygen('other');
const signers = path.join(dir, 'allowed_signers');
writeFileSync(signers, `medhanta-release namespaces="medhanta-bundle" ${release}\n`);
const bundle = (name: string, key: string, content = 'release') => {
  const file = path.join(dir, `${name}.tar`);
  writeFileSync(file, content);
  execFileSync('ssh-keygen', ['-Y', 'sign', '-q', '-f', path.join(dir, key), '-n', 'medhanta-bundle', file]);
  return file;
};
const verify = (file: string) => {
  try { execFileSync('deploy/verify-bundle.sh', [file, signers], { stdio: 'pipe' }); return 'ok'; } catch { return 'refused'; }
};

describe('PL-10 only signed releases are applied', () => {
  it('PL-10 a bundle signed with the release key is accepted', () => {
    expect(verify(bundle('good', 'release'))).toBe('ok');
  });

  it('PL-10 a changed bundle or one signed with another key is refused', () => {
    const changed = bundle('changed', 'release');
    writeFileSync(changed, 'release, changed after signing');
    expect(verify(changed)).toBe('refused');
    expect(verify(bundle('foreign', 'other'))).toBe('refused');
  });

  it('PL-10 apply.sh checks the signature before it unpacks or runs anything', () => {
    const changed = bundle('acme-0.6.0-abc', 'release');
    writeFileSync(changed, 'tampered');
    const home = path.join(dir, 'home');
    const env = { ...process.env, MEDHANTA_HOME: home, MEDHANTA_STATE: path.join(dir, 'state'), MEDHANTA_SIGNERS: signers };
    expect(() => execFileSync('deploy/apply.sh', [changed], { env, stdio: 'pipe' })).toThrow(/not signed by the release key/);
    expect(existsSync(path.join(home, 'releases'))).toBe(false);
    // A config file instead of a bundle is refused too (the deploy user may only run apply.sh through sudo).
    expect(() => execFileSync('deploy/apply.sh', ['customers/example.yaml'], { env, stdio: 'pipe' })).toThrow(/signed bundle/);
  });

  it('PL-10 every customer config in the repo is valid', () => {
    const files = readdirSync(path.join(ROOT, 'customers')).filter((f) => /^[a-z][a-z0-9_]*\.yaml$/.test(f));
    expect(files).toContain('example.yaml');
    for (const f of files) expect(() => checkConfig(readYaml(path.join(ROOT, 'customers', f))), f).not.toThrow();
  });
});
