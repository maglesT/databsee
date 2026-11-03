// The customer config file (customers/<name>.yaml) and its secrets, checked before anything is applied.
// PL-09: the file is the customer's system description (products, version, links, outside logins).
// PL-10: every change is made through this file; each apply needs the customer's change reference and a reason.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import YAML from 'yaml';
import { z } from 'zod';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
/** Settings and the applied config, kept across releases (on a server /var/lib/medhanta/state; never committed). */
export const STATE = process.env.MEDHANTA_STATE ?? path.join(ROOT, 'deploy/secrets');
const name = z.string().regex(/^[a-z][a-z0-9_]*$/);
const views = z.array(z.string().regex(/^[a-z][a-z0-9_]*_v[0-9]+$/)).min(1);
/** reader -> provider database -> views it may read */
const reads = z.record(name, z.record(name, views));

const configSchema = z.object({
  customer: name,
  version: z.string().regex(/^\d+\.\d+\.\d+$/),          // platform release (image tag)
  domain: z.string().regex(/^[a-z0-9.-]+$/),            // core at https://<domain>, product p at https://<p>.<domain>
  host: z.string().regex(/^[a-z0-9_.-]+@[a-z0-9.-]+$/).optional(), // SSH target user@host for online sites
  host_key: z.string().regex(/^ssh-ed25519 [A-Za-z0-9+/=]+$/).optional(), // its SSH host key (pinned, no trust on first use)
  offline: z.boolean().default(false),                  // offline sites get a signed bundle (A7)
  security_contact: z.string().email(),                 // lockout emails (D-03)
  change_ref: z.string().trim().min(1),                 // the customer's change reference (D-08, CP-02)
  reason: z.string().trim().min(1),
  backup: z.object({                                    // off-server copy of the backups (PL-11)
    path: z.string().regex(/^[A-Za-z0-9_./-]+$/),       // folder on the rclone remote, e.g. medhanta-backups/acme
  }),
  proxy: z.enum(['caddy', 'external']).default('caddy'), // external: the host's own proxy owns 80/443 (compose.external.yml)
  licences: z.array(name).default([]),
  links: reads.default({}),                             // product -> provider database -> views
  outside_logins: reads.default({}),                    // outside system -> provider database -> views
}).strict();
export type Config = z.infer<typeof configSchema>;

const secretsSchema = z.object({
  logins: z.record(z.string(), z.string().min(16)),     // PostgreSQL login -> password
  oidc: z.object({
    jwks: z.object({ keys: z.array(z.object({}).passthrough()).min(1) }),
    cookie_keys: z.array(z.string().min(16)).min(1),
    clients: z.record(name, z.string().min(16)),        // product -> OIDC client secret
  }),
  smtp_url: z.string().optional(),
  env: z.record(name, z.record(z.string().regex(/^[A-Z][A-Z0-9_]*$/), z.string())).default({}), // product -> its own extra settings (API keys)
  backup: z.record(z.string().regex(/^[a-z_]+$/), z.string())   // rclone remote settings, e.g. type: drive, scope, token
    .refine((b) => !!b.type, 'backup needs the rclone remote type (e.g. drive)'),
}).strict();
export type Secrets = z.infer<typeof secretsSchema>;

export interface Manifest {
  product: string; database: string; publishes: string[];
  permissions: { code: string; label: string }[];   // what the product offers in the permission register (D-16)
  reads?: Record<string, string[]>;   // provider database -> views this product can read when linked
  source?: { repo: string; commit: string };   // a product kept in its own repo: built into medhanta/<product>:<commit> (D-29)
}

/** A permission code: <product>.<thing>.<action>, lower case and dotted (same check as db/identity/0004). */
export const PERMISSION_CODE = /^[a-z][a-z0-9_]*(\.[a-z0-9_]+)+$/;

/** The product's manifest; a product without one cannot be licensed yet. */
export function manifest(product: string): Manifest {
  const file = path.join(ROOT, 'apps', product, 'manifest.json');
  if (!existsSync(file)) throw new Error(`unknown product "${product}" (no apps/${product}/manifest.json)`);
  const m: Manifest = JSON.parse(readFileSync(file, 'utf8'));
  return checkManifest(m, product, `apps/${product}/manifest.json`);
}

/** PL-01: a product offers at least one permission; each code is its own, well-formed, labelled and listed once. */
export function checkManifest(m: Manifest, product: string, where = product): Manifest {
  if (m.product !== product || m.database !== product) throw new Error(`${where}: product and database must be "${product}"`);
  if (m.source && !/^[0-9a-f]{40}$/.test(m.source.commit)) throw new Error(`${where}: source.commit must be a full commit id`);
  if (!Array.isArray(m.permissions) || m.permissions.length === 0) throw new Error(`${where}: needs a list of permissions`);
  const seen = new Set<string>();
  for (const p of m.permissions) {
    if (typeof p.code !== 'string' || !PERMISSION_CODE.test(p.code) || !p.code.startsWith(`${product}.`))
      throw new Error(`${where}: permission "${p.code}" must look like ${product}.<thing>.<action> (lower case)`);
    if (typeof p.label !== 'string' || !p.label.trim()) throw new Error(`${where}: permission ${p.code} needs a label`);
    if (seen.has(p.code)) throw new Error(`${where}: permission ${p.code} is listed twice`);
    seen.add(p.code);
  }
  return m;
}

/** Every product with a manifest (apps/<product>/manifest.json). */
export const allProducts = () =>
  readdirSync(path.join(ROOT, 'apps')).filter((d) => existsSync(path.join(ROOT, 'apps', d, 'manifest.json'))).sort();

/** Login of a product or outside system. */
export const productLogin = (p: string) => `${p}_app`;
export const outsideLogin = (n: string) => `ext_${n}`;

/** Checks a config (and its secrets): every reader and provider is licensed, every login has its secrets. */
export function checkConfig(raw: unknown, rawSecrets?: unknown): { config: Config; secrets?: Secrets } {
  const config = configSchema.parse(raw);
  const problems: string[] = [];
  if (!config.offline && !(config.host && config.host_key)) problems.push('an online site needs host and host_key');
  const licensed = new Set(config.licences);
  const providers = new Set(['master_data', 'identity', ...config.licences.map((p) => manifest(p).database)]);
  for (const [reader, map] of Object.entries(config.links)) {
    if (!licensed.has(reader)) problems.push(`link reader "${reader}" is not licensed`);
    for (const provider of Object.keys(map)) {
      if (!providers.has(provider)) problems.push(`link ${reader} -> ${provider}: provider is not licensed`);
      if (provider === manifest(reader).database) problems.push(`link ${reader} -> ${provider}: a product does not link to itself`);
    }
  }
  for (const [reader, map] of Object.entries(config.outside_logins))
    for (const provider of Object.keys(map))
      if (!providers.has(provider)) problems.push(`outside login ${reader} -> ${provider}: provider is not licensed`);

  let secrets: Secrets | undefined;
  if (rawSecrets !== undefined) {
    secrets = secretsSchema.parse(rawSecrets);
    const logins = ['postgres', 'core_app', ...config.licences.map(productLogin), ...Object.keys(config.outside_logins).map(outsideLogin)];
    for (const l of logins) if (!secrets.logins[l]) problems.push(`secrets: no password for login ${l}`);
    for (const p of config.licences) if (!secrets.oidc.clients[p]) problems.push(`secrets: no OIDC client secret for ${p}`);
  }
  if (problems.length) throw new Error(`config ${config.customer}: ${problems.join('; ')}`);
  return { config, secrets };
}

export const readYaml = (file: string): unknown => YAML.parse(readFileSync(file, 'utf8'));

// CLI for the apply workflow: tsx deploy/config.ts customers/<name>.yaml  (checks the file; secrets stay encrypted)
if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const { config } = checkConfig(readYaml(process.argv[2] ?? ''));
  console.log(`${config.customer}: version ${config.version}, ${config.offline ? 'offline' : `online ${config.host}`}, licences ${config.licences.join(', ') || 'none'}`);
}
