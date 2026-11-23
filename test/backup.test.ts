// Slices A6b/A6c: backups (PL-11).
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { checkConfig, readYaml } from '../deploy/config.js';

const run = (cmd: string, args: string[], env: Record<string, string> = {}) =>
  execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, ...env } });

describe('PL-11 backup with no permanent loss', () => {
  it('MED-02 PL-11 a point-in-time restore from the encrypted off-server copy brings back every database exactly as at the chosen moment; a changed base backup is refused', () => {
    // PostgreSQL refuses to run as root; the CI runner is not root.
    const out = process.getuid?.() === 0
      ? run('su', ['postgres', '-s', '/bin/bash', '-c', path.resolve('test/pl11-restore.sh')])
      : run('test/pl11-restore.sh', []);
    expect(out).toMatch(/PL-11 restore check passed: 10 databases restored .* from the encrypted off-server copy, SHA256SUMS checked/);
  }, 120_000);

  it('MED-02 PL-11 the off-server copy only adds files: it never deletes or changes a copied file (through the crypt remote)', () => {
    const dir = mkdtempSync(path.join(tmpdir(), 'pl11-copy-'));
    try {
      const archive = path.join(dir, 'archive'), remote = path.join(dir, 'offsite');  // a local folder stands in for the remote
      mkdirSync(path.join(archive, 'wal'), { recursive: true });
      const wal = (root: string) => path.join(root, 'wal', '000000010000000000000001');
      writeFileSync(wal(archive), 'original');
      const key = 'test-only-backup-key-0123456789abcdef';
      const env = { ARCHIVE: archive, BACKUP_REMOTE: 'secure:', RCLONE_CONFIG_SECURE_TYPE: 'crypt', RCLONE_CONFIG_SECURE_REMOTE: path.join(dir, 'offsite-raw'), BACKUP_KEY: key, MEDHANTA_STATE: dir };
      // What is off the server, read back with the key (as README "Backups" fetches it).
      const back = () => {
        rmSync(remote, { recursive: true, force: true });
        run('rclone', ['copy', 'secure:', remote], { ...env, RCLONE_CONFIG_SECURE_PASSWORD: run('rclone', ['obscure', key]).trim() });
      };
      expect(() => run('deploy/backup.sh', ['copy'], { ...env, BACKUP_KEY: '' })).toThrow(/refusing to copy backups off the server unencrypted/);
      expect(() => run('deploy/backup.sh', ['copy'], { ...env, BACKUP_REMOTE: remote })).toThrow(/must be the crypt remote/);
      run('deploy/backup.sh', ['copy'], env);
      expect(run('find', [path.join(dir, 'offsite-raw'), '-type', 'f'])).not.toMatch(/0000|wal/);   // names encrypted
      back();
      expect(readFileSync(wal(remote), 'utf8')).toBe('original');
      writeFileSync(wal(archive), 'changed on the server');
      expect(() => run('deploy/backup.sh', ['copy'], env)).toThrow();
      back();
      expect(readFileSync(wal(remote), 'utf8')).toBe('original');
      rmSync(wal(archive));
      run('deploy/backup.sh', ['copy'], env);
      back();
      expect(readFileSync(wal(remote), 'utf8')).toBe('original');
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });

  it('MED-02 PL-11 a customer cannot be applied without the backup key in its secrets', () => {
    const pw = 'test-only-password-123';
    const secrets = { logins: { postgres: pw, core_app: pw }, oidc: { jwks: { keys: [{}] }, cookie_keys: ['test-only-cookie-key-1'], clients: {} }, backup: { type: 'drive' } };
    const config = { ...(readYaml('customers/example.yaml') as object), licences: [], links: {} };
    expect(() => checkConfig(config, secrets)).toThrow(/backup_key/);
    expect(() => checkConfig(config, { ...secrets, backup_key: 'short' })).toThrow(/at least 32 characters/);
    expect(checkConfig(config, { ...secrets, backup_key: 'x'.repeat(44) }).secrets!.backup_key).toHaveLength(44);
  });
});
