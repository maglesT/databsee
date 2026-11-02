# Handover: Medhanta platform session

Date: 2026-11-02 (second platform session). For the next platform session. Read this file, then `docs/plan.md`,
`docs/decisions.md` (D-01 to D-15) and `compliance/register.yaml`.

## Who and how
- Owner: triplerascals03@gmail.com (sends from arccra003@gmail.com). Writes short, informal messages; prefers the
  simpler option. Wrote "approvddd all thngs" (recorded as D-12, D-13).
- Lead (portfolio coordinator): session `session_01PybpFurhHU4ktqworXhVvF`. Report at each milestone with the remote
  `send_message` tool. The lead checks every requirement against a binding clause: before adding anything, cite the
  clause or leave it out (this is how Object Lock was dropped, D-14).
- Email: one Gmail thread, subject prefix "[Platform]", thread id `1a19de0a13163f24`. Reply to the latest message in
  the thread. Email after every merge and for decisions.
- Merging: standing OK (D-10). Squash-merge each slice once CI is green and one review pass is done (a review subagent
  on `git diff main...<branch>`), with an explicit commit title and message. Trailers:
  `Co-Authored-By: Claude <noreply@anthropic.com>` and the Claude-Session line, no model name.
- At most 2–3 agents at once. Hand over to a fresh session at about 400k of context.
- This session runs in a cloud container. It cannot reach the owner's VPS. Server tasks the owner asks for need a
  Claude Code session on that server (`claude remote-control`); say so, and don't pretend.

## Phase A: done
| Slice | PR | Content |
|---|---|---|
| A0–A5 | #1–#7 | Plan, register, database server, identity and core API and screens, OIDC sign-on, master data, hello product |
| A6a | #8 | `customers/<name>.yaml` + `deploy/apply.ts`: licences, links, outside logins, migration data checks (PL-13), health check, rollback (PL-10) |
| A6b | #9 | WAL archiving + nightly base backup, point-in-time restore test on PostgreSQL 17 in CI (PL-11) |
| A6c | #11 | Off-server copy to any rclone remote, Google Drive by default, copy-only (D-14) |
| A7 | #10 | GitHub Actions `apply.yml`: signed bundles (`ssh-keygen -Y`), online over SSH with a pinned host key, offline as a download; `apply.sh` verifies before anything runs (PL-10) |
| A8 | #12 | Control panel (`apps/control-panel`): diagram (PL-09), switches with change reference committed through the GitHub API, `switch_log` (PL-10), D-15 |
| A9 | #13 | Access review report in core (PL-12) with `identity.link_state` written by apply, recipe `docs/05-add-a-product.md` (mandatory write-time active-item check, A11 5), secrets template, traceability check in CI, Simplicity review `docs/06-simplicity-review.md` |

## Repo map
`maglesT/databsee` (D-01), private. Customer configs live in its `customers/` folder (D-04). Layout:
- `db/server/` holds `init.sh`, `cluster.sql` and `database.sql`. They create the databases and roles and install `platform.set_link` and `platform.link_log` (A1).
- `db/migrate.ts` is the migration runner. It reads `db/<database>/NNNN_*.sql` files and runs each as `<db>_owner`, recording it in `platform.migration` with its sha256.
- `db/identity/` holds the identity schema (0001) and the OIDC state table (0002). `db/master_data/0001` holds master data. `db/hello/0001` is the hello product.
- `apps/core/server/` is Fastify. `app.ts` has the API, sessions, the shared `checkPassword`, the sign-in page and the provider mount; `oidc.ts` has the provider config and the PG adapter; `master-data.ts` has the master-data API.
- `apps/core/web/` is React built by Vite into `dist/core-web`.
- `apps/hello/` is the reference product: `app.ts`, `index.ts` and `manifest.json`.
- `compliance/register.yaml` and `scripts/check-register.py` produce `docs/03-compliance-register.md` (36/36 citations verified). `docs/04-register-verification.md` records the findings of the AI verifier.
- `test/` holds vitest tests named by rule ID. They need a PostgreSQL superuser in the `PG*` env vars; the global setup runs `init.sh logbook hello` and migrates identity, master_data and hello. The browser tests use the preinstalled Playwright 1.63.0.
- CI (`.github/workflows/ci.yml`) has two jobs. `register` checks the citations, that the rendered register is current, and rule-to-test traceability. `database` runs on a PostgreSQL 17 service with typecheck, Chromium and `npm test`.

Added this session:
- `deploy/config.ts`: the config and secrets schema, `checkConfig`, `manifest`, `allProducts`, and `STATE`
  (`/var/lib/medhanta/state` on servers).
- `deploy/apply.ts`, called by `apply.sh`: init, migrate, roles, logins, links, `link_state`, containers, `backup.sh
  check`, health, rollback.
- `deploy/apply.sh`: bundle mode (verify, unpack to `/opt/medhanta/releases/`, `current` symlink). Config mode runs
  only from a bundle, or with `MEDHANTA_UNSIGNED=1`.
- `deploy/bundle.sh`, `deploy/verify-bundle.sh`, `.github/workflows/apply.yml` (Environment `production`, main only).
- `deploy/backup.sh` (`base`, `copy`, `check`), `deploy/restore.sh`, `test/pl11-restore.sh`.
- `deploy/compose.yml` (db with archiving, core, hello profile, caddy; pinned `postgres:17.11`, `caddy:2.10.2`),
  `deploy/control-panel.yml`, `Dockerfile`.
- `customers/example.yaml`, `example.secrets.template.yaml`, `example.changes.md` (infrastructure change log).
- `db/control_panel/0001`, `db/identity/0003_link_state.sql`.
- Tests: `apply`, `backup`, `bundle`, `control-panel` and `access-review` test files, plus the earlier ones. 75 tests;
  `scripts/check-traceability.py` reports 13/13 rules.

## Running tests locally
Local test database in this container (gone with it): `su postgres -c "/usr/lib/postgresql/16/bin/initdb -D /var/lib/postgresql/medhanta-test ..."`, then start it on port 55432 and run with `PGHOST=127.0.0.1 PGPORT=55432 PGUSER=postgres PGPASSWORD=postgres npx vitest run`. initdb refuses to run as root, and the scratchpad directory's permissions block the postgres user. Start it with `su postgres -c "/usr/lib/postgresql/16/bin/pg_ctl -D /var/lib/postgresql/medhanta-test -o '-p 55432 -k /tmp' -l /var/lib/postgresql/medhanta-test/log start"` and set the postgres password to `postgres`. The global setup now also creates and migrates `control_panel`.
- The restore test runs itself through `su postgres` when you are root.
- The bundle and backup tests need `ssh-keygen` and `rclone`: `apt-get install openssh-client rclone`.
- Downloading binaries such as sops is blocked by the permission classifier; apt packages work.

## Before the first real customer (owner actions, offer step-by-step help)
1. Create the GitHub Environment `production` (main only) with `BUNDLE_SIGNING_KEY` and `DEPLOY_SSH_KEY`.
2. Tag the first release `v<version>` with release notes.
3. Server setup as in the README, including `/etc/medhanta/allowed_signers`, the age key and the cron lines.
4. Run `rclone authorize "drive"` on the owner's computer to get the Drive token for the customer's secrets.
5. Run the control panel on the owner's server (`deploy/control-panel.yml`). It needs a fine-grained GitHub token.

## Next
- Phase B (D-11, with the lead): rewire only. Logbook first (machines), then Material Management (materials), and
  Batchwright last, after its refocus is merged. Follow `docs/05-add-a-product.md`. Each product needs the write-time
  active-item test (PL-08), "connection off", sign-on through core, and its data moved with PL-13 checks.
- Phase C (hardening): the small items listed in `docs/06-simplicity-review.md`.

## Things to know
- Product logins cannot see a provider's `public` schema. A view checks base tables with its owner's rights.
- core only signs people in on `/api/` routes, so its pages that need sign-in live under `/api/`, for example
  `/api/access-review`.
- Docker Hub rate-limits anonymous manifest lookups from this container, and MinIO images are no longer pullable.
- Compose interpolates `$` in env files. `apply.ts` single-quotes the values; the control panel hash must be quoted
  by hand.
