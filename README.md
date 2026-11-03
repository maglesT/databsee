# Medhanta platform

Shared layer under the Medhanta pharma products: master data, identity + single sign-on, links between products, control panel and GitOps pipeline.

See docs/plan.md.

## Checks
- `python3 scripts/check-register.py --render docs/03-compliance-register.md` verifies every clause cited in
  `compliance/register.yaml` against the official texts in `compliance/sources/` (copied from Material Management)
  and regenerates the register document.
- `npm test` runs the tests against a PostgreSQL server given by the PG* variables (superuser). Test names start
  with the rule ID they prove (e.g. "PL-08 ...").

## Database server
`db/server/init.sh [product ...]` creates `master_data`, `identity` and one database per product, with their roles,
the `report` schema for published views and `platform.set_link` + `platform.link_log`. See docs/plan.md §6.

## Single sign-on (slice A3)
The core app is the OIDC provider for every product (issuer `OIDC_ISSUER`, e.g. `https://site/oidc`; clients in
`OIDC_CLIENTS`, signing key in `OIDC_JWKS`, cookie keys in `OIDC_COOKIE_KEYS`, all from the customer secrets).
Products use the authorization-code flow with PKCE and scope `openid profile permissions`; the `permissions` claim
holds only that product's permission codes (e.g. `["hello.note.read", "hello.note.sign"]`, D-16). For an e-signature a product asks with `prompt=login&max_age=0` and must check that the
returned `sub` is the person signing.

## Customer config and apply (slice A6)
`customers/<name>.yaml` is the customer's system: version, licences, links (`product -> provider database -> views`),
outside logins, and the customer's change reference and reason for the change (template: `customers/example.yaml`).
Secrets (database passwords, OIDC keys) are in `customers/<name>.secrets.yaml.age`, encrypted with age (D-12).
`deploy/apply.sh customers/<name>.yaml` decrypts the secrets and runs `deploy/apply.ts`: create databases, migrate
(a data-moving migration ships `NNNN_name.check.sql`, two queries split by `-- after` that must return the same rows,
PL-13), load the products' permissions into the register, switch logins and links (only the differences, each logged with the change reference),
start the containers (`deploy/compose.yml`), check health, and re-apply the previous config if anything fails (PL-10).

### Behind the host's proxy (`proxy: external`)
When the server already runs its own Caddy on ports 80 and 443 (e.g. for other sites), set `proxy: external` in the
config. Apply then starts no platform caddy and publishes core and each licensed product on 127.0.0.1 only, at the fixed
ports in `deploy/compose.external.yml`. It writes their site blocks to `/var/lib/medhanta/state/Caddyfile.host`.
- Copy or `import` these blocks into the host Caddyfile, then run `caddy reload` on the host.
- Go-live, or adding a licence, is an apply followed by a host reload.
- To roll one product back, comment out that product's block in the host Caddyfile, or replace it with the old app's
  block, then reload. The other host sites are untouched.

With the default `proxy: caddy`, apply reloads the platform's caddy after every start, so a newly licensed product's
host is served at once.

## Backups (PL-11, slice A6b)
PostgreSQL archives every WAL file (at least every 5 minutes) to `/var/lib/medhanta/archive/wal`. Cron on the server:
```
15 1 * * *   root  /opt/medhanta/current/deploy/backup.sh base    # nightly base backup of all databases
*/5 * * * *  root  /opt/medhanta/current/deploy/backup.sh copy    # copy the archive off the server
```
Off-server store: any rclone remote, Google Drive by default. The customer secrets hold its settings (`backup:`,
e.g. `type: drive`, `scope: drive.file`, `token: '{"access_token":...}'` from `rclone authorize "drive"`, quoted) and the config its folder
(`backup.path`). `rclone copy --immutable` only adds files and never deletes or changes a copied one, so backups are
secure from alteration and inadvertent erasure (211.68(b)); D-14.
Restore to a point in time: `deploy/restore.sh <base backup> "<time>" <empty data folder>` (as root on the server, so
the folder belongs to the database container's user), then start PostgreSQL on it and take a new base backup at once.
`test/pl11-restore.sh` does exactly this in CI for all 10 databases. The site restores a real backup periodically
(CP-04), using its own copy of the archive, never the live one.

## Releases and applying configs (slice A7)
- **Release** (PL-10): tag `v<version>` on a green `main` commit, with release notes on the GitHub release. A customer
  config names the version it runs.
- **Apply**: `.github/workflows/apply.yml` runs on every commit that changes `customers/<name>.yaml` or its secrets
  (or by hand, "Run workflow"). It checks the config, builds the bundle (`deploy/bundle.sh`: release `v<version>` with its
  node_modules and images, plus the config and encrypted secrets) and signs it with `ssh-keygen -Y sign`.
  Online sites: the bundle is copied over SSH (host key pinned in the config) and applied. Offline sites: download the
  bundle and its `.sig` from the run and run `/opt/medhanta/current/deploy/apply.sh <bundle>.tar` on site.
  `apply.sh` checks the signature first and refuses anything else. One apply per customer runs at a time.
- **Infrastructure changes** (host, OS, PostgreSQL, Docker) are recorded as a dated entry in
  `customers/<name>.changes.md` (template `customers/example.changes.md`), with the customer's change reference.

## Server setup (once per customer server)
1. Ubuntu LTS with Docker (Compose plugin), Node 22, age, rclone and openssh; only ports 22, 80 and 443 open.
2. `age-keygen -o /etc/medhanta/age.key` (mode 600); add its public key as a recipient of the customer's secrets file.
3. `/etc/medhanta/allowed_signers`: `medhanta-release namespaces="medhanta-bundle" <release public key>`.
4. GitHub: Environment `production` limited to the `main` branch, holding the secrets `BUNDLE_SIGNING_KEY` and
   `DEPLOY_SSH_KEY`. Online sites: user `deploy` with the Actions public key, allowed `sudo /opt/medhanta/current/deploy/apply.sh *` only;
   put the server's `ssh-ed25519` host key in the config (`host_key`).
5. Cron lines from "Backups" above.
6. First install: check the first bundle by hand (`deploy/verify-bundle.sh` from the repo), unpack it to
   `/opt/medhanta/releases/<name>`, link `/opt/medhanta/current` to it and run `current/deploy/apply.sh <bundle>.tar`.
   Then create the first administrator: `docker compose -f /opt/medhanta/current/deploy/compose.yml exec core npx tsx apps/core/server/index.ts create-first-admin ...`.

## Control panel (slice A8, the owner's server only)
`apps/control-panel` shows each customer's system as a diagram (PL-09) and switches licences, links and outside
systems. Every switch asks for the customer's change reference and a reason (D-08), is committed to
`customers/<name>.yaml` through the GitHub API (which starts the apply, A7) and is logged in `switch_log`; the page shows
each switch's apply result. The customer files stay the only source of truth; the panel keeps just the log.
Setup: `docker compose -f deploy/control-panel.yml up -d db`, then `db/server/init.sh control_panel` and
`tsx db/migrate.ts control_panel` against it, then start `panel`. `control-panel.env` holds `CONTROL_PANEL_DATABASE_URL`,
`GITHUB_REPO=maglesT/databsee`, `GITHUB_TOKEN` (fine-grained, contents read/write and actions read on this repo only) and
`CONTROL_PANEL_USERS='owner:<hash>'` (single quotes: the hash contains $; hash from `tsx apps/control-panel/index.ts hash-password`). Serve it over HTTPS only.

## Access review and adding products (slice A9)
- **Access review report** (PL-12): core, People screen, "access review report" (identity administrators). It is one
  printable page listing every active permission (granted by, when, last sign-on to that product) and every link and outside
  login that is on, as recorded by the last apply. The periodic review itself is the site's procedure (CP-03).
- **Adding a product**: `docs/05-add-a-product.md`.
- **Traceability**: `scripts/check-traceability.py` (CI) fails if a register rule has no test named by its ID.
- **Simplicity review of Phase A**: `docs/06-simplicity-review.md`.
