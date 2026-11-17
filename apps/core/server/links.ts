// Core's own reads of other products (customer config `links.core`) and the Links screen (every link the platform
// knows, with its state). Reads are null-safe: a link that is off or down never breaks a core screen (PL-08).
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Sql } from 'postgres';
import { CORE_READS, databaseName, productInfo } from '../products.js';

export type LinkState = 'on' | 'off' | 'down';

/**
 * Reads through core's link to a provider. off: core is not set to read it, or the read is refused (link switched
 * off: 42501, login off: 28000); down: any other failure (database unreachable, view missing). Never stale data.
 */
export async function readLink<T>(db: Sql | undefined, read: (db: Sql) => Promise<T[]>): Promise<{ state: LinkState; rows: T[] }> {
  if (!db) return { state: 'off', rows: [] };
  try {
    return { state: 'on', rows: await read(db) };
  } catch (e) {
    const code = (e as { code?: string }).code;
    return { state: code === '42501' || code === '28000' ? 'off' : 'down', rows: [] };
  }
}

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');

/** A product's manifest "reads" (provider database -> views); {} when it has none. */
function manifestReads(product: string): Record<string, string[]> {
  const file = path.join(ROOT, 'apps', product, 'manifest.json');
  if (!/^[a-z][a-z0-9_]*$/.test(product) || !existsSync(file)) return {};
  try { return (JSON.parse(readFileSync(file, 'utf8')) as { reads?: Record<string, string[]> }).reads ?? {}; } catch { return {}; }
}

export interface LinkRow {
  reader: string; readerName: string; provider: string; providerName: string; view: string;
  state: LinkState; why: string; switchedOnAt: Date | null; changeRef: string | null;
}

const readerName = (login: string) =>
  login === 'core_app' ? 'Core (People)' : login.startsWith('ext_') ? `Outside system ${login.slice(4)}` : productInfo(login.replace(/_app$/, '')).name;

/**
 * Every link the platform knows: the ones the last apply switched on (identity.link_state, outside logins included),
 * plus the ones a licensed product's manifest (or core) can read but that are off. A link that is on is checked now:
 * core reads its own links for real; for the others the database catalogue says whether the reader's login is on and
 * may still connect to the provider database (core cannot sign in as another product).
 */
export async function linkReport(sql: Sql, licensed: string[], coreLinks: Record<string, Sql>): Promise<{ checkedAt: Date; links: LinkRow[] }> {
  const on = await sql<{ provider: string; consumer: string; view_name: string; switched_on_at: Date | null; change_ref: string | null }[]>`
    select provider, consumer, view_name, switched_on_at, change_ref from link_state`;
  const key = (consumer: string, provider: string, view: string) => `${consumer}|${provider}|${view}`;
  const rows = new Map<string, LinkRow>();
  const add = (consumer: string, provider: string, view: string, extra: Partial<LinkRow>) =>
    rows.set(key(consumer, provider, view), {
      reader: consumer, readerName: readerName(consumer), provider, providerName: databaseName(provider), view,
      state: 'off', why: 'Not switched on in the customer config.', switchedOnAt: null, changeRef: null, ...extra,
    });
  const providers = new Set(['master_data', 'identity', ...licensed]);
  const declared: [string, Record<string, string[]>][] = [...licensed.map((p) => [`${p}_app`, manifestReads(p)] as [string, Record<string, string[]>]), ['core_app', CORE_READS]];
  for (const [consumer, reads] of declared)
    for (const [provider, views] of Object.entries(reads))
      if (providers.has(provider)) for (const v of views) add(consumer, provider, v, {});

  for (const l of on) {
    let state: LinkState = 'on', why = '';
    if (l.consumer === 'core_app') {
      const r = await readLink(coreLinks[l.provider], (db) => db.unsafe(`select from report.${l.view_name.replace(/[^a-z0-9_]/g, '')} limit 0`));
      state = r.state === 'on' ? 'on' : 'down';
      why = r.state === 'on' ? '' : coreLinks[l.provider] ? 'Core cannot read it now.' : 'Core has no setting for this database (apply again).';
    } else {
      const [c] = await sql<{ login: boolean; open: boolean; connect: boolean }[]>`
        select r.rolcanlogin as login, d.datallowconn as open, has_database_privilege(r.oid, d.oid, 'CONNECT') as connect
        from pg_roles r cross join pg_database d where r.rolname = ${l.consumer} and d.datname = ${l.provider}`;
      if (!c) { state = 'down'; why = 'The reader login or the provider database does not exist.'; }
      else if (!c.login) { state = 'down'; why = 'The reader login is switched off.'; }
      else if (!c.open || !c.connect) { state = 'down'; why = 'The reader may not connect to the provider database.'; }
    }
    add(l.consumer, l.provider, l.view_name, { state, why, switchedOnAt: l.switched_on_at, changeRef: l.change_ref });
  }
  const order = { down: 0, on: 1, off: 2 } as const;
  return {
    checkedAt: new Date(),
    links: [...rows.values()].sort((a, b) => order[a.state] - order[b.state] || a.readerName.localeCompare(b.readerName)
      || a.providerName.localeCompare(b.providerName) || a.view.localeCompare(b.view)),
  };
}
