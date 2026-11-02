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
Products use the authorization-code flow with PKCE and scope `openid profile roles`; the `roles` claim holds only
that product's roles. For an e-signature a product asks with `prompt=login&max_age=0` and must check that the
returned `sub` is the person signing.

## Customer config and apply (slice A6)
`customers/<name>.yaml` is the customer's system: version, licences, links (`product -> provider database -> views`),
outside logins, and the customer's change reference and reason for the change (template: `customers/example.yaml`).
Secrets (database passwords, OIDC keys) are in `customers/<name>.secrets.yaml.age`, encrypted with age (D-12).
`deploy/apply.sh customers/<name>.yaml` decrypts the secrets and runs `deploy/apply.ts`: create databases, migrate
(a data-moving migration ships `NNNN_name.check.sql`, two queries split by `-- after` that must return the same rows,
PL-13), load product roles, switch logins and links (only the differences, each logged with the change reference),
start the containers (`deploy/compose.yml`), check health, and re-apply the previous config if anything fails (PL-10).

## Backups (PL-11, slice A6b)
PostgreSQL archives every WAL file (at least every 5 minutes) to `/var/lib/medhanta/archive/wal`. Cron on the server:
```
15 1 * * *   root  /opt/medhanta/current/deploy/backup.sh base    # nightly base backup of all databases
*/5 * * * *  root  /opt/medhanta/current/deploy/backup.sh copy    # copy the archive off the server
```
Off-server store: an S3-compatible bucket (e.g. Backblaze B2) created with Object Lock and a default retention in
COMPLIANCE mode (at least the customer's record retention period), set in the customer config (`backup:`). Object
Lock keeps every version, so even an overwrite cannot alter a stored backup. The server's key is limited to
`deploy/backup-policy.json` (add and read, never delete), and `rclone copy --immutable` never changes a copied file.
Every apply runs `deploy/backup.sh check`, which fails the apply if the store lets the server delete a probe file.
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
