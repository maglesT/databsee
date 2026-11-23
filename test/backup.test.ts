// Slices A6b/A6c: backups (PL-11).
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const run = (cmd: string, args: string[], env: Record<string, string> = {}) =>
  execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, ...env } });

describe('PL-11 backup with no permanent loss', () => {
  it('PL-11 a point-in-time restore brings back every database exactly as at the chosen moment', () => {
    // PostgreSQL refuses to run as root; the CI runner is not root.
    const out = process.getuid?.() === 0
      ? run('su', ['postgres', '-s', '/bin/bash', '-c', path.resolve('test/pl11-restore.sh')])
      : run('test/pl11-restore.sh', []);
    expect(out).toMatch(/PL-11 restore check passed: 10 databases restored/);
  }, 120_000);

  it('PL-11 the off-server copy only adds files: it never deletes or changes a copied file', () => {
    const dir = mkdtempSync(path.join(tmpdir(), 'pl11-copy-'));
    try {
      const archive = path.join(dir, 'archive'), remote = path.join(dir, 'offsite');  // a local folder stands in for the remote
      mkdirSync(path.join(archive, 'wal'), { recursive: true });
      const wal = (root: string) => path.join(root, 'wal', '000000010000000000000001');
      writeFileSync(wal(archive), 'original');
      const env = { ARCHIVE: archive, BACKUP_REMOTE: remote, MEDHANTA_STATE: dir, BACKUP_ALLOW_UNENCRYPTED: 'yes' };
      run('deploy/backup.sh', ['copy'], env);
      expect(readFileSync(wal(remote), 'utf8')).toBe('original');
      writeFileSync(wal(archive), 'changed on the server');
      expect(() => run('deploy/backup.sh', ['copy'], env)).toThrow();
      expect(readFileSync(wal(remote), 'utf8')).toBe('original');
      rmSync(wal(archive));
      run('deploy/backup.sh', ['copy'], env);
      expect(readFileSync(wal(remote), 'utf8')).toBe('original');
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });

  it('the off-server copy is encrypted when a key is set, refused without one, and a restore from it gives the files back', () => {
    const dir = mkdtempSync(path.join(tmpdir(), 'pl11-crypt-'));
    try {
      const archive = path.join(dir, 'archive'), remote = path.join(dir, 'offsite'), back = path.join(dir, 'back');
      mkdirSync(path.join(archive, 'wal'), { recursive: true });
      writeFileSync(path.join(archive, 'wal', '000000010000000000000007'), 'the patient records are in here');
      const plain = { ARCHIVE: archive, BACKUP_REMOTE: remote, MEDHANTA_STATE: dir, BACKUP_ALLOW_UNENCRYPTED: '', BACKUP_CRYPT_PASSWORD: '', BACKUP_CRYPT_SALT: '' };
      // no key, no explicit permission: nothing leaves the server
      expect(() => run('deploy/backup.sh', ['copy'], plain)).toThrow(/REFUSED/);
      expect(existsSync(remote)).toBe(false);
      // with a key: names and contents are unreadable at the store
      const crypt = { ...plain, BACKUP_CRYPT_PASSWORD: 'a-long-random-test-password-1', BACKUP_CRYPT_SALT: 'a-long-random-test-salt-2' };
      expect(run('deploy/backup.sh', ['copy'], crypt)).toContain('(encrypted)');
      const files = execFileSync('find', [remote, '-type', 'f'], { encoding: 'utf8' });
      expect(files).not.toContain('000000010000000000000007');
      for (const f of files.split('\n').filter(Boolean)) expect(readFileSync(f).toString('latin1')).not.toContain('patient records');
      // restore: the same key reads it back
      const rc = { ...process.env, RCLONE_CONFIG_OFFSITECRYPT_TYPE: 'crypt', RCLONE_CONFIG_OFFSITECRYPT_REMOTE: remote,
        RCLONE_CONFIG_OFFSITECRYPT_PASSWORD: execFileSync('rclone', ['obscure', '-'], { input: crypt.BACKUP_CRYPT_PASSWORD, encoding: 'utf8' }).trim(),
        RCLONE_CONFIG_OFFSITECRYPT_PASSWORD2: execFileSync('rclone', ['obscure', '-'], { input: crypt.BACKUP_CRYPT_SALT, encoding: 'utf8' }).trim() };
      execFileSync('rclone', ['copy', 'offsitecrypt:', back], { env: rc });
      expect(readFileSync(path.join(back, 'wal', '000000010000000000000007'), 'utf8')).toBe('the patient records are in here');
      // the explicit setting allows a plain copy (demo), with a warning
      const demo = { ...plain, BACKUP_ALLOW_UNENCRYPTED: 'yes', BACKUP_REMOTE: path.join(dir, 'demo-offsite') };
      run('deploy/backup.sh', ['copy'], demo);
      expect(existsSync(path.join(demo.BACKUP_REMOTE, 'wal', '000000010000000000000007'))).toBe(true);
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });
});
