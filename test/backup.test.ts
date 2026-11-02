// Slice A6b: backups (PL-11). That the off-server store refuses deletes is checked against each customer's real
// store at every apply (deploy/backup.sh check), not here.
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const run = (cmd: string, args: string[]) => execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });

describe('PL-11 backup with no permanent loss', () => {
  it('PL-11 a point-in-time restore brings back every database exactly as at the chosen moment', () => {
    // PostgreSQL refuses to run as root; the CI runner is not root.
    const out = process.getuid?.() === 0
      ? run('su', ['postgres', '-s', '/bin/bash', '-c', path.resolve('test/pl11-restore.sh')])
      : run('test/pl11-restore.sh', []);
    expect(out).toMatch(/PL-11 restore check passed: 10 databases restored/);
  }, 120_000);
});
