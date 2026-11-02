// Applies a database's migrations: plain SQL files db/<database>/NNNN_name.sql, in order, each in its own
// transaction as the database's owner role, recorded in platform.migration with the file's SHA-256.
// A recorded file whose content changed is an error (migrations are never edited, only added).
// Usage: tsx db/migrate.ts <database> [<database> ...]   (connection: PG* env, superuser - the installer)
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import postgres from 'postgres';

const here = path.dirname(fileURLToPath(import.meta.url));

export async function migrate(database: string, dir = path.join(here, database)): Promise<string[]> {
  const sql = postgres({ database, onnotice: () => {}, max: 1 });
  try {
    const owner = `${database}_owner`;
    await sql.begin(async (tx) => {
      await tx.unsafe(`set local role ${owner}`);
      await tx`create table if not exists platform.migration (
        name text primary key, sha256 text not null, applied_at timestamptz not null default now())`;
    });
    const done = new Map((await sql<{ name: string; sha256: string }[]>`select name, sha256 from platform.migration`).map((r) => [r.name, r.sha256]));
    const files = existsSync(dir) ? readdirSync(dir).filter((f) => /^\d{4}_[a-z0-9_]+\.sql$/.test(f)).sort() : [];
    const applied: string[] = [];
    for (const file of files) {
      const text = readFileSync(path.join(dir, file), 'utf8');
      const sha = createHash('sha256').update(text).digest('hex');
      const was = done.get(file);
      if (was !== undefined) {
        if (was !== sha) throw new Error(`${database}/${file} changed after it was applied`);
        continue;
      }
      await sql.begin(async (tx) => {
        await tx.unsafe(`set local role ${owner}`);
        await tx.unsafe(text);
        await tx`insert into platform.migration (name, sha256) values (${file}, ${sha})`;
      });
      applied.push(file);
    }
    return applied;
  } finally {
    await sql.end();
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  for (const db of process.argv.slice(2)) {
    if (!/^[a-z][a-z0-9_]*$/.test(db)) throw new Error(`bad database name ${db}`);
    const applied = await migrate(db);
    console.log(`${db}: ${applied.length ? `applied ${applied.join(', ')}` : 'up to date'}`);
  }
}
