# Simplicity review: Phase A (slices A0–A9)

Date: 2026-11-02. The question for each part is whether it is needed for a cited rule or for the platform to work at all,
and whether something smaller would do.

## Size
| Part | Lines | What it is |
|---|---|---|
| `apps/core/server` | 788 | Sign-on (OIDC), people and permissions, master data, access review report |
| `apps/core/web` | 530 | The two screens: people and permissions, master data |
| `apps/hello` | 129 | Reference product (CI and demos only) |
| `apps/control-panel` | 323 | The owner's panel: diagram, switches, log |
| `db` | 496 | Server setup, link function, migration runner, schemas |
| `deploy` | 541 | Config schema, apply, bundles, backups, restore, compose |
| `scripts` | 128 | Register citation check, rule-to-test check |
| `test` | 1372 | 13 rules, each with tests named by its ID |

There are 11 runtime dependencies: fastify with its cookie, formbody and static plugins, oidc-provider, postgres,
nodemailer, react, react-dom, yaml and zod. There is no gateway, queue, cache, ORM or second database engine.

## Removed or not built (and why)
| Item | Why it went | Where decided |
|---|---|---|
| Keycloak; separate identity and master-data apps | One `core` app; employees live in one place | D-05, D-06 |
| API gateway, data lake, postgres_fdw | Products read published views with their own login | plan §4 |
| Kubernetes, Terraform, Vault | Docker Compose, plain SQL, one shell script | plan §4 |
| SOPS | Plain `age` does the same with one tool fewer | D-12 |
| Object Lock, bucket policy, delete-refusal check, MinIO in CI | No binding clause requires immutability; copy-only covers 211.68(b) | D-14 |
| Customer, licence and link tables in the control panel | The config files are the only source of truth; the panel keeps just its log | D-15 |
| MFA, read logging, row-level security, connection logging, encryption at rest, approval signatures on master data | No clause requires them | plan §3, lead |
| Separate audit tables | Insert-only version and event tables are the audit trail | plan §10 |

## Kept because a rule needs it
Each item below is the smallest form found for its rule:
- insert-only triggers (PL-02, PL-06);
- `platform.set_link` and `link_log` (PL-02, PL-08);
- the 5-minute tokens with re-authentication (PL-01, PL-05);
- the migration check files (PL-13);
- WAL archiving with a restore test (PL-11);
- signed bundles and the change reference on every switch (PL-10);
- the diagram (PL-09);
- `link_state` for the access review (PL-12). Without it, core could not see links into product databases.

## Kept as design choices, not clauses (smallest form)
- Rollback to the previous config on a failed health check: about 15 lines in `deploy/apply.ts`. It saves a broken site.
- One apply at a time: an Actions concurrency group and `flock`.
- Pinned image versions in `deploy/compose.yml`, which CI tests with the same PostgreSQL.

## Could be simpler later (not worth changing now)
1. Tests use two PostgreSQL clients: `pg` in the older helpers and `postgres` everywhere else. Moving the helpers to
   `postgres` would drop one dev dependency.
2. Two small copies of an HTML-escape helper (control panel app and diagram) besides core's. Sharing one would save
   a few lines.
3. `init.sh` always creates `master_data` and `identity`, including on the owner's control-panel server, where they
   stay empty. This is harmless.

## Verdict
Nothing in Phase A is there without a rule or an operational need behind it. The three items above are small and can
wait for Phase C hardening. Phase B (rewire Logbook, then Material Management, then Batchwright) can start on this base.
