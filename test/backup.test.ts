// Slices A6b/A6c: backups (PL-11).
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
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
    const archive = path.join(dir, 'archive'), remote = path.join(dir, 'offsite');  // a local folder stands in for the remote
    mkdirSync(path.join(archive, 'wal'), { recursive: true });
    const wal = (root: string) => path.join(root, 'wal', '000000010000000000000001');
    writeFileSync(wal(archive), 'original');
    const env = { ARCHIVE: archive, BACKUP_REMOTE: remote, MEDHANTA_STATE: dir };
    run('deploy/backup.sh', ['copy'], env);
    expect(readFileSync(wal(remote), 'utf8')).toBe('original');
    writeFileSync(wal(archive), 'changed on the server');
    expect(() => run('deploy/backup.sh', ['copy'], env)).toThrow();
    expect(readFileSync(wal(remote), 'utf8')).toBe('original');
    rmSync(wal(archive));
    run('deploy/backup.sh', ['copy'], env);
    expect(readFileSync(wal(remote), 'utf8')).toBe('original');
  });
});
