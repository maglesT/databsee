// Creates the platform databases on the test server (PG* env, superuser) and applies the migrations.
import { execFileSync } from 'node:child_process';
import { migrate } from '../db/migrate.js';

export default async function setup() {
  execFileSync('db/server/init.sh', ['logbook', 'hello'], { stdio: 'inherit' });
  for (const db of ['identity']) await migrate(db);
}
