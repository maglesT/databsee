# Handover: Medhanta platform session

Date: 2026-11-02. For the next platform session. Read this file, then `docs/plan.md` and `docs/decisions.md`.

## Who and how
- Owner: triplerascals03@gmail.com (sends from arccra003@gmail.com). Writes short, informal messages; prefers the simpler option ("do what's more simple").
- Lead (portfolio coordinator): session `session_01PybpFurhHU4ktqworXhVvF` (it replaced `session_01PybpFtcvncLKmpf3MLktBR`). Report at each milestone with the remote `send_message` tool.
- Email: one Gmail thread, subject prefix "[Platform]", thread id `1a19de0a13163f24` (reply with `replyThreadId`). Email after every merge and for decisions.
- Merging: owner gave a standing OK (D-10). Squash-merge each slice once CI is green and one review pass is done, with an explicit commit_title/commit_message. Commit trailers: `Co-Authored-By: Claude <noreply@anthropic.com>` and the Claude-Session line, no model name. A merge was blocked once when the OK only came relayed via the lead; it worked after the owner wrote "keep merging" directly in the chat.
- Run at most 2–3 agents at once. Hand over to a fresh session at about 400k of context.

## Repo
`maglesT/databsee` (D-01), private. Customer configs will live in its `customers/` folder (D-04). Layout:
- `db/server/` holds `init.sh`, `cluster.sql` and `database.sql`. They create the databases and roles and install `platform.set_link` and `platform.link_log` (A1).
- `db/migrate.ts` is the migration runner. It reads `db/<database>/NNNN_*.sql` files and runs each as `<db>_owner`, recording it in `platform.migration` with its sha256.
- `db/identity/` holds the identity schema (0001) and the OIDC state table (0002). `db/master_data/0001` holds master data. `db/hello/0001` is the hello product.
- `apps/core/server/` is Fastify. `app.ts` has the API, sessions, the shared `checkPassword`, the sign-in page and the provider mount; `oidc.ts` has the provider config and the PG adapter; `master-data.ts` has the master-data API.
- `apps/core/web/` is React built by Vite into `dist/core-web`.
- `apps/hello/` is the reference product: `app.ts`, `index.ts` and `manifest.json`.
- `compliance/register.yaml` and `scripts/check-register.py` produce `docs/03-compliance-register.md` (36/36 citations verified). `docs/04-register-verification.md` records the findings of the AI verifier.
- `test/` holds vitest tests named by rule ID. They need a PostgreSQL superuser in the `PG*` env vars; the global setup runs `init.sh logbook hello` and migrates identity, master_data and hello. The browser tests use the preinstalled Playwright 1.63.0.
- CI (`.github/workflows/ci.yml`) has two jobs. `register` checks the citations and that the rendered register is current. `database` runs on a PostgreSQL 17 service with typecheck, Chromium and `npm test`.

Local test database in this container (gone with it): `su postgres -c "/usr/lib/postgresql/16/bin/initdb -D /var/lib/postgresql/medhanta-test ..."`, then start it on port 55432 and run with `PGHOST=127.0.0.1 PGPORT=55432 PGUSER=postgres PGPASSWORD=postgres npx vitest run`. initdb refuses to run as root, and the scratchpad directory's permissions block the postgres user.

## Done (Phase A slices, all merged except where noted)
| Slice | PR | Content |
|---|---|---|
| A0 | #1 | Plan (approved, D-09), register, CI citation check |
| A1 | #2 | Database server, roles, `set_link`, `link_log` |
| A2 | #3 | Identity schema and core API: employees, passwords, lockout with email and alert, register, CSV export |
| A2b | #4 | Core people and permissions screens |
| A3 | #5 | OIDC sign-on in core |
| A4 | #6 | Master data: schema, API, screen, `report.*_v1` views |
| A5 | #7 | Hello product end to end. Merged if CI was green, otherwise check the PR |

## Next (plan §8)
- **A6.** Config schema plus `apply.sh`. `customers/<name>.yaml` holds the version, licences, links (`consumer -> provider: [views]`) and outside logins. The secrets go in `customers/<name>.secrets.yaml` (SOPS + age). The apply steps:
  - Back up.
  - Run `init.sh`.
  - Run `migrate.ts`.
  - Load each licensed product's `manifest.json` roles into `identity.product_role`.
  - Licence on: `ALTER ROLE <p>_app LOGIN PASSWORD`, then start the containers.
  - Licence off: NOLOGIN, cut the links, stop the containers.
  - `platform.set_link` for each link, using the change reference from the config. Create `ext_<name>` logins.
  - Health check, and roll back to the previous config on failure.
  - The OIDC clients, JWKS and cookie keys come from the secrets.

  Backups (PL-11): WAL archiving through `archive_command` plus a nightly `pg_basebackup`, copied by a copy-only job to an off-server rclone remote (D-14), with a point-in-time restore test in CI. Data-moving migrations ship row-count and checksum checks (PL-13). Compose: `deploy/compose.yml` (only `db` so far) gains core, the products and Caddy.
- **A7.** GitHub Actions. Online sites: SSH and run `apply.sh`. Offline sites: a bundle (`docker save` plus config plus migrations), signed with `ssh-keygen -Y sign` and verified by `apply.sh` before anything else runs.
- **A8.** Control panel, on the owner's server only, with a `control_panel` database:
  - customers, licences and link switches, each needing a reason and the customer change reference (D-08);
  - a switch log;
  - a diagram of products and links whose arrows can be cut or restored;
  - changes committed to the config through the GitHub API.
- **A9.** Access review report (PL-12), the add-a-product recipe document, an entry in the config template, the traceability check (CI fails if a rule has no test), and the Simplicity review of Phase A.
- Phase B (with the lead, D-11): rewire only. Logbook goes first (machines), then Material Management (materials); Batchwright goes last, after its refocus is merged. Phase C covers hardening.

## Things to know
- Product logins cannot see a provider's `public` schema at all, so a raw-table read fails with 42P01, or 42501 when the schema is named.
- A view checks the base tables with its owner's rights. That is why `SELECT ... FOR UPDATE` on `employee_current` works for `core_app`. `LOCK TABLE` would need UPDATE rights the app does not have.
- On a re-authentication over an existing session, core accepts only the person already signed in (PL-05). Without this check, oidc-provider would let another person take over the session.
- Products must store, at signing, the master-data id plus the display values, and the signer's name (PL-07). Hello's `note` table shows the pattern.
- At an e-signature a product must check that the re-authenticated `sub` is the signer (README).
- Register rules PL-09 to PL-13 still need their implementation and tests (A6–A9).
