import pg from 'pg';

const base = { host: process.env.PGHOST ?? '127.0.0.1', port: Number(process.env.PGPORT ?? 5432) };

/** Superuser connection (the installer). */
export function admin(database: string) {
  return new pg.Client({ ...base, database, user: process.env.PGUSER ?? 'postgres', password: process.env.PGPASSWORD });
}

/** Connection as an app or outside-system login. */
export function login(user: string, database: string) {
  return new pg.Client({ ...base, database, user, password: 'test-only' });
}

/** Gives a login a password so tests can connect with it (apply.sh does this from the secrets in slice A6). */
export async function enableLogin(user: string) {
  const c = admin('postgres');
  await c.connect();
  await c.query(`alter role ${pg.escapeIdentifier(user)} login password 'test-only'`);
  await c.end();
}

/** The SQLSTATE of a failed query, or 'ok'. */
export async function sqlstate(p: Promise<unknown>): Promise<string> {
  try { await p; return 'ok'; } catch (e) { return (e as { code?: string }).code ?? String(e); }
}
