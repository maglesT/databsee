// Applies a customer config to its server: databases and migrations, product permissions, logins, links, containers,
// then a health check. If anything fails, the previous config is applied again (PL-10).
// Usage (from apply.sh): tsx deploy/apply.ts customers/<name>.yaml <decrypted secrets.yaml>
// Connection: PG* env as the server's superuser (the installer); PGPASSWORD defaults to secrets.logins.postgres.
//
// Rules: licence on = <p>_app LOGIN with its password + container started; licence off = NOLOGIN, its sessions
// ended, its links cut (a link needs a licensed reader), container removed; data kept (R6). Links and outside logins
// are switched only where they differ from the server, each switch logged in platform.link_log with the config's
// change reference and reason (PL-02, PL-10). Migrations are additive, so a rollback leaves them in place.
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import postgres from 'postgres';
import { migrate } from '../db/migrate.js';
import { allProducts, checkConfig, manifest, outsideLogin, productLogin, readYaml, ROOT, STATE, type Config, type Manifest, type Secrets } from './config.js';

/** Starts the containers and fails unless they turn healthy. The Docker one is below; tests use a stand-in. */
export interface Runtime {
  start(config: Config, secrets: Secrets): Promise<void>;
}

const admin = (database: string) => postgres({ database, max: 1, onnotice: () => {} });

export async function applyConfig(next: Config, secrets: Secrets, runtime: Runtime, previous?: Config): Promise<void> {
  try {
    const products = next.licences.map(manifest);
    execFileSync(path.join(ROOT, 'db/server/init.sh'), products.map((m) => m.database), { stdio: 'inherit' });
    for (const db of ['master_data', 'identity', ...products.map((m) => m.database)]) await migrate(db);
    await switchAndStart(next, secrets, runtime, next.reason);
    const problems = await dbProblems(next, secrets);
    if (problems.length) throw new Error(`health check failed: ${problems.join('; ')}`);
  } catch (e) {
    if (!previous) throw e;
    // Migrations are additive and already ran for the previous config, so the rollback only switches back.
    try {
      await switchAndStart(previous, secrets, runtime, `rollback: ${next.change_ref} failed`);
    } catch (r) {
      throw new Error(`${(e as Error).message}. ROLLBACK ALSO FAILED: ${(r as Error).message}`);
    }
    throw new Error(`${(e as Error).message}. Rolled back to the previous config (${previous.change_ref}).`);
  }
}

async function switchAndStart(config: Config, secrets: Secrets, runtime: Runtime, reason: string) {
  const products = config.licences.map(manifest);

  const su = admin('postgres');
  const identity = admin('identity');
  try {
    await loadPermissions(identity, products, `${config.change_ref}: ${reason}`);

    // Logins: on with the password from the secrets, or off and disconnected. format() quotes names and passwords.
    const ddl = async (rows: Promise<{ ddl: string }[]>) => { for (const r of await rows) await su.unsafe(r.ddl); };
    const wanted = new Set(['core_app', ...config.licences.map(productLogin), ...Object.keys(config.outside_logins).map(outsideLogin)]);
    for (const l of wanted)
      await ddl(su`select format('create role %I nologin', ${l}::text) as ddl where not exists (select from pg_roles where rolname = ${l})`);
    // Managed: the product logins of every known product and all outside logins; other roles are left alone.
    const known = ['core_app', ...allProducts().map(productLogin)];
    const managed = await su<{ rolname: string }[]>`select rolname from pg_roles where rolname = any(${known}) or rolname ~ '^ext_[a-z0-9_]+$'`;
    for (const { rolname } of managed) {
      const pw = secrets.logins[rolname];
      if (!wanted.has(rolname)) {
        await ddl(su`select format('alter role %I nologin', ${rolname}::text) as ddl`);
        await su`select pg_terminate_backend(pid) from pg_stat_activity where usename = ${rolname}`;
      } else if (pw === undefined) await ddl(su`select format('alter role %I login', ${rolname}::text) as ddl`); // rollback: keep its password
      else await ddl(su`select format('alter role %I login password %L', ${rolname}::text, ${pw}::text) as ddl`);
    }

    // Links: wanted[db][login] = views; switch only the differences.
    const links = wantedLinks(config);
    const state: { provider: string; consumer: string; view_name: string; at: Date | null; change_ref: string | null }[] = [];
    const dbs = await su<{ datname: string }[]>`select datname from pg_database where datname not in ('postgres', 'template0', 'template1')`;
    for (const { datname } of dbs) {
      const db = admin(datname);
      try {
        if (!(await db`select from pg_class where oid = to_regclass('platform.current_link')`).length) continue;
        const current = new Map<string, Set<string>>();
        for (const r of await db<{ consumer: string; view_name: string }[]>`select consumer, view_name from platform.current_link`)
          current.set(r.consumer, (current.get(r.consumer) ?? new Set()).add(r.view_name));
        const want = links.get(datname) ?? new Map<string, Set<string>>();
        for (const login of new Set([...current.keys(), ...want.keys()])) {
          const have = current.get(login) ?? new Set<string>(), should = want.get(login) ?? new Set<string>();
          const cut = [...have].filter((v) => !should.has(v)), add = [...should].filter((v) => !have.has(v));
          if (cut.length) await db`select platform.set_link(${login}, ${cut}, false, ${config.change_ref}, ${reason})`;
          if (add.length) await db`select platform.set_link(${login}, ${add}, true, ${config.change_ref}, ${reason})`;
        }
        state.push(...await db<typeof state>`
          select ${datname}::text as provider, c.consumer, c.view_name, l.at, l.change_ref from platform.current_link c
          left join lateral (select at, change_ref from platform.link_log l where l.consumer = c.consumer and c.view_name = any(l.views)
                             and l.switched_on order by l.id desc limit 1) l on true`);
      } finally {
        await db.end();
      }
    }
    // PL-12: what is on now, for the access review report in core.
    await identity.begin(async (tx) => {
      await tx`delete from link_state`;
      for (const l of state) await tx`insert into link_state (provider, consumer, view_name, switched_on_at, change_ref)
                                      values (${l.provider}, ${l.consumer}, ${l.view_name}, ${l.at}, ${l.change_ref})`;
    });
  } finally {
    await su.end();
    await identity.end();
  }
  await runtime.start(config, secrets);
}

/**
 * PL-01/PL-02: loads the licensed products' permissions into the catalogue (identity.permission_event). Only
 * differences are written: a new code or a new label is an active event; a code gone from a licensed manifest is an
 * inactive event, and whoever holds it gets a revoke event, so a code that comes back later grants nothing by itself.
 * An unlicensed product (other than core) has all its codes withdrawn the same way.
 */
export async function loadPermissions(identity: postgres.Sql, products: Manifest[], why: string) {
  await identity.begin(async (tx) => {
    const licensed = new Set(products.map((m) => m.product));
    const unlicensed = (await tx<{ product: string }[]>`select distinct product from current_permission where product <> 'core'`)
      .map((r) => r.product).filter((p) => !licensed.has(p));
    for (const m of [...products, ...unlicensed.map((product) => ({ product, permissions: [] as Manifest['permissions'] }))]) {
      const have = new Map((await tx<{ code: string; label: string }[]>`select code, label from current_permission where product = ${m.product}`)
        .map((r) => [r.code, r.label]));
      for (const p of m.permissions)
        if (have.get(p.code) !== p.label)
          await tx`insert into permission_event (product, code, label, active, by_name, reason) values (${m.product}, ${p.code}, ${p.label}, true, 'apply', ${why})`;
      for (const [code, label] of have) {
        if (m.permissions.some((p) => p.code === code)) continue;
        // Revoke first: once the code is inactive, current_permission_grant no longer shows who holds it.
        await tx`insert into permission_grant (employee_id, product, code, granted, by_name, reason)
          select employee_id, product, code, false, 'apply', ${`permission removed from ${m.product} (${why})`}
          from current_permission_grant where code = ${code}`;
        await tx`insert into permission_event (product, code, label, active, by_name, reason) values (${m.product}, ${code}, ${label}, false, 'apply', ${why})`;
      }
    }
  });
}

/** provider database -> login -> views, from the config's links and outside logins. */
function wantedLinks(config: Config) {
  const out = new Map<string, Map<string, Set<string>>>();
  const add = (login: string, map: Record<string, string[]>) => {
    for (const [db, views] of Object.entries(map)) {
      const m = out.get(db) ?? new Map<string, Set<string>>();
      m.set(login, new Set(views));
      out.set(db, m);
    }
  };
  for (const [p, map] of Object.entries(config.links)) add(productLogin(p), map);
  for (const [n, map] of Object.entries(config.outside_logins)) add(outsideLogin(n), map);
  return out;
}

/** Health, database part: every login on can sign in with its password and read each view of its links. */
async function dbProblems(config: Config, secrets: Secrets): Promise<string[]> {
  const problems: string[] = [];
  const tryAs = async (user: string, database: string, query: string) => {
    const c = postgres({ database, username: user, password: secrets.logins[user], max: 1, onnotice: () => {} });
    try { await c.unsafe(query); } catch (e) { problems.push(`${user} on ${database}: ${(e as Error).message}`); } finally { await c.end(); }
  };
  await tryAs('core_app', 'identity', 'select 1');
  await tryAs('core_app', 'master_data', 'select 1');
  for (const p of config.licences) await tryAs(productLogin(p), manifest(p).database, 'select 1');
  for (const [db, logins] of wantedLinks(config))
    for (const [login, views] of logins)
      for (const v of views) await tryAs(login, db, `select from report.${v} limit 0`);
  return problems;
}

/** A product's settings: its own database, each linked provider, sign-on, and its extra settings from the secrets. */
export function productEnv(config: Config, secrets: Secrets, p: string): Record<string, string> {
  const own = manifest(p).database;
  const url = (db: string) => `postgres://${productLogin(p)}:${encodeURIComponent(secrets.logins[productLogin(p)] ?? '')}@db:5432/${db}`;
  return {
    ...secrets.env[p],
    [`${own.toUpperCase()}_DATABASE_URL`]: url(own),
    ...Object.fromEntries(Object.keys(config.links[p] ?? {}).map((db) => [`${db.toUpperCase()}_DATABASE_URL`, url(db)])),
    OIDC_ISSUER: `https://${config.domain}/oidc`,
    OIDC_CLIENT_SECRET: secrets.oidc.clients[p] ?? '',
    OIDC_REDIRECT_URI: `https://${p}.${config.domain}/cb`,
  };
}

/** <PRODUCT>_COMMIT for compose: the image tag of each product kept in its own repo (D-29). */
export const imageTags = () => Object.fromEntries(allProducts().flatMap((p) => {
  const s = manifest(p).source;
  return s ? [[`${p.toUpperCase()}_COMMIT`, s.commit]] : [];
}));

/** Docker Compose runtime: writes each service's settings, starts core, Caddy and the licensed products, removes
 *  the unlicensed ones, and waits until the started services report healthy. */
export const docker: Runtime = {
  async start(config, secrets) {
    const dir = STATE;
    mkdirSync(dir, { recursive: true, mode: 0o700 });
    const write = (file: string, text: string) => writeFileSync(path.join(dir, file), text, { mode: 0o600 });
    const url = (login: string, db: string) => `postgres://${login}:${encodeURIComponent(secrets.logins[login] ?? '')}@db:5432/${db}`;
    // Single quotes: Compose takes the value literally (no $ substitution).
    const env = (vars: Record<string, string>) => Object.entries(vars).map(([k, v]) => {
      if (v.includes("'") || v.includes('\n')) throw new Error(`setting ${k} must not contain a quote or a line break`);
      return `${k}='${v}'`;
    }).join('\n') + '\n';
    write('core.env', env({
      IDENTITY_DATABASE_URL: url('core_app', 'identity'),
      MASTER_DATA_DATABASE_URL: url('core_app', 'master_data'),
      SECURITY_CONTACT_EMAIL: config.security_contact,
      ...(secrets.smtp_url ? { SMTP_URL: secrets.smtp_url } : {}),
      OIDC_ISSUER: `https://${config.domain}/oidc`,
      OIDC_CLIENTS: JSON.stringify(config.licences.map((p) => ({
        client_id: p, client_secret: secrets.oidc.clients[p], redirect_uris: [`https://${p}.${config.domain}/cb`] }))),
      OIDC_JWKS: JSON.stringify(secrets.oidc.jwks),
      OIDC_COOKIE_KEYS: secrets.oidc.cookie_keys.join(','),
    }));
    for (const p of config.licences) write(`${p}.env`, env(productEnv(config, secrets, p)));
    write('backup.env', env({ // read by deploy/backup.sh: the rclone remote "offsite" from the secrets
      ...Object.fromEntries(Object.entries(secrets.backup).map(([k, v]) => [`RCLONE_CONFIG_OFFSITE_${k.toUpperCase()}`, v])),
      BACKUP_REMOTE: `offsite:${config.backup.path}`,
    }));
    write('Caddyfile', [`${config.domain} {\n  reverse_proxy core:3000\n}`,
      ...config.licences.map((p) => `${p}.${config.domain} {\n  reverse_proxy ${p}:3000\n}`)].join('\n') + '\n');

    const compose = (...args: string[]) => execFileSync('docker', ['compose', '-f', path.join(ROOT, 'deploy/compose.yml'), ...args],
      { stdio: 'inherit', env: { ...process.env, VERSION: config.version, ...imageTags() } });
    for (const p of allProducts().filter((p) => !config.licences.includes(p))) compose('--profile', p, 'rm', '--stop', '--force', p);
    compose(...config.licences.flatMap((p) => ['--profile', p]), 'up', '-d', '--wait', 'db', 'core', 'caddy', ...config.licences);
    execFileSync(path.join(ROOT, 'deploy/backup.sh'), ['check'], { stdio: 'inherit', env: { ...process.env, MEDHANTA_STATE: STATE } });
  },
};

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const [configFile, secretsFile] = process.argv.slice(2);
  if (!configFile || !secretsFile) throw new Error('usage: tsx deploy/apply.ts customers/<name>.yaml <secrets.yaml>');
  const { config, secrets } = checkConfig(readYaml(configFile), readYaml(secretsFile));
  process.env.PGPASSWORD ??= secrets!.logins.postgres;
  // The database runs first: everything else is applied through it.
  mkdirSync(STATE, { recursive: true, mode: 0o700 });
  writeFileSync(path.join(STATE, 'pg_superuser'), secrets!.logins.postgres ?? '', { mode: 0o600 });
  execFileSync('docker', ['compose', '-f', path.join(ROOT, 'deploy/compose.yml'), 'up', '-d', '--wait', 'db'], { stdio: 'inherit' });
  const appliedFile = path.join(STATE, 'applied.yaml');
  // The rollback uses today's secrets, so they must still cover the previous config.
  const previous = existsSync(appliedFile) ? checkConfig(readYaml(appliedFile), secrets).config : undefined;
  await applyConfig(config, secrets!, docker, previous);
  copyFileSync(configFile, appliedFile);
  console.log(`applied ${config.customer} ${config.version} (${config.change_ref})`);
}
