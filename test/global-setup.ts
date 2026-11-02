// Creates the platform databases on the test server (PG* env, superuser) and applies the migrations.
import { execFileSync } from 'node:child_process';
import { migrate } from '../db/migrate.js';

export default async function setup() {
  execFileSync('db/server/init.sh', ['logbook', 'hello', 'control_panel'], { stdio: 'inherit' });
  for (const db of ['identity', 'master_data', 'hello', 'control_panel']) await migrate(db);
}
