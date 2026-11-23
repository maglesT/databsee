// Slice A7: signed bundles and the customer files in the repo (PL-10).
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import YAML from 'yaml';
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
  // Signed as GitHub Actions does it: deploy/sign-bundle.sh with the key in the environment only (MED-07).
  execFileSync('deploy/sign-bundle.sh', [file], { stdio: 'pipe', env: { ...process.env, BUNDLE_SIGNING_KEY: readFileSync(path.join(dir, key), 'utf8') } });
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

  it('PL-10 the secrets template fits the example config', () => {
    const dir = path.join(ROOT, 'customers');
    expect(() => checkConfig(readYaml(path.join(dir, 'example.yaml')), readYaml(path.join(dir, 'example.secrets.template.yaml')))).not.toThrow();
  });
});

describe('MED-07 the release signing key is kept away from the npm supply chain', () => {
  type Step = { name?: string; uses?: string; run?: string; env?: Record<string, string> };
  type Workflow = { permissions?: Record<string, string>; jobs: Record<string, { permissions?: unknown; steps: Step[] }> };
  const workflows = readdirSync(path.join(ROOT, '.github/workflows')).map((f) =>
    [f, YAML.parse(readFileSync(path.join(ROOT, '.github/workflows', f), 'utf8')) as Workflow] as const);

  it('MED-07 PL-10 every workflow reads the repo only, and every action is pinned to a commit id', () => {
    for (const [f, w] of workflows) {
      expect(w.permissions, f).toEqual({ contents: 'read' });
      for (const job of Object.values(w.jobs)) {
        expect(job.permissions, f).toBeUndefined();
        for (const step of job.steps) if (step.uses) expect(step.uses, f).toMatch(/^[\w.-]+\/[\w.-]+@[0-9a-f]{40}$/);
      }
    }
  });

  it('MED-07 PL-10 only the signing step holds the signing key, and nothing it runs installs packages', () => {
    const steps = workflows.flatMap(([, w]) => Object.values(w.jobs).flatMap((j) => j.steps));
    const holders = steps.filter((s) => JSON.stringify(s).includes('BUNDLE_SIGNING_KEY'));
    expect(holders).toEqual([{ name: expect.stringMatching(/^Sign the bundle/), env: { BUNDLE_SIGNING_KEY: '${{ secrets.BUNDLE_SIGNING_KEY }}' }, run: 'deploy/sign-bundle.sh "$BUNDLE"' }]);
    const apply = workflows.find(([f]) => f === 'apply.yml')![1];
    const names = Object.values(apply.jobs).flatMap((j) => j.steps.map((s) => s.name ?? s.run ?? s.uses));
    expect(names.indexOf(holders[0]!.name)).toBeGreaterThan(names.findIndex((n) => n?.startsWith('Build the bundle')));
    // npm install scripts never run in the apply job or the bundle build (the release code itself is the repo's).
    const npm = [...steps.filter((s) => apply.jobs.apply!.steps.includes(s)).map((s) => s.run ?? ''), readFileSync(path.join(ROOT, 'deploy/bundle.sh'), 'utf8')]
      .flatMap((t) => t.match(/npm (ci|install)[^\n]*/g) ?? []);
    expect(npm.length).toBeGreaterThan(1);
    for (const cmd of npm) expect(cmd).toContain('--ignore-scripts');
    expect(readFileSync(path.join(ROOT, 'deploy/bundle.sh'), 'utf8')).not.toMatch(/ssh-keygen|SIGNING/);
  });

  it('MED-07 PL-10 sign-bundle.sh refuses to run without the key and leaves no key file behind', () => {
    const file = path.join(dir, 'nokey.tar');
    writeFileSync(file, 'release');
    const env = { ...process.env };
    delete env.BUNDLE_SIGNING_KEY;
    expect(() => execFileSync('deploy/sign-bundle.sh', [file], { stdio: 'pipe', env })).toThrow();
    const tmp = mkdtempSync(path.join(tmpdir(), 'sign-'));
    execFileSync('deploy/sign-bundle.sh', [file], { stdio: 'pipe', env: { ...env, TMPDIR: tmp, BUNDLE_SIGNING_KEY: readFileSync(path.join(dir, 'release'), 'utf8') } });
    expect(readdirSync(tmp)).toEqual([]);
    expect(verify(file)).toBe('ok');
  });
});
