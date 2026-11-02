// Slice A6b: backups (PL-11). The off-server test needs an S3 store whose key has deploy/backup-policy.json
// (CI starts MinIO and sets BACKUP_TEST_REMOTE plus the RCLONE_CONFIG_OFFSITE_* settings).
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
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

  it.skipIf(!process.env.BACKUP_TEST_REMOTE)('PL-11 the server adds to the off-server copy but cannot delete or change a file', () => {
    const archive = mkdtempSync(path.join(tmpdir(), 'pl11-'));
    mkdirSync(path.join(archive, 'wal'));
    const wal = path.join(archive, 'wal', '000000010000000000000001');
    writeFileSync(wal, 'original');
    const remote = `${process.env.BACKUP_TEST_REMOTE}/run-${Date.now()}`;
    const env = { ARCHIVE: archive, BACKUP_REMOTE: remote };
    run('deploy/backup.sh', ['copy'], env);
    expect(run('rclone', ['cat', `${remote}/wal/000000010000000000000001`])).toBe('original');
    expect(() => run('rclone', ['deletefile', `${remote}/wal/000000010000000000000001`])).toThrow();
    writeFileSync(wal, 'changed');
    expect(() => run('deploy/backup.sh', ['copy'], env)).toThrow();
    expect(run('rclone', ['cat', `${remote}/wal/000000010000000000000001`])).toBe('original');
  });
});
