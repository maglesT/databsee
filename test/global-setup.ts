// Creates the platform databases on the test server (PG* env, superuser) with the products used by the tests.
import { execFileSync } from 'node:child_process';

export default function setup() {
  execFileSync('db/server/init.sh', ['logbook', 'hello'], { stdio: 'inherit' });
}
