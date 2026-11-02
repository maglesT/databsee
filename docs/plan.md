# Medhanta platform — plan (draft 2, 2 Nov 2026)

Status: **approved by the owner 2 Nov 2026** ("do what's more simple"; decisions D-01 to D-08 in docs/decisions.md). Draft 2: AI verifier findings folded in, see docs/04-register-verification.md.

## 1. Sources
- Your agreed design of 2 Nov 2026 (relayed by the lead session).
- Official texts, reused from Material Management `compliance/sources/` (same copies, same checker program):
  21 CFR 11 and 211 (eCFR 24 Sep 2026), EU GMP Annex 11 and Ch. 4, Revised Schedule M Part I (G.S.R. 922(E)) incl. section 20.
- Existing view pattern I read: Logbook `0013_report_views.sql` (schema `report`, `*_v1` security-barrier views, `read_at` + `data_as_of` on every row, one NOLOGIN role per reader, no TEMPORARY for PUBLIC); Deviations `0010_capa_report_view.sql` (same); Batchwright `1210/1800` (row functions, `report.view_registry`). The platform reuses the Logbook form, which is the simplest.

## 2. Requirements (what Phase A delivers)
| ID | Requirement |
|---|---|
| R1 | One PostgreSQL server per customer with 10 databases: `master_data`, `identity`, and one per product (logbook, materials, deviations, protocols, qms, operations, recruitment, ebmr). |
| R2 | Master data (machines/instruments/rooms, materials/suppliers, products/codes, and the links between them) edited only in one small screen; every product reads it live through views. |
| R3 | Identity: employees, single sign-on, permission register (employee, product, role) with history. Deactivate once = out everywhere. |
| R4 | Each product writes only its own database; reads others only through `report.*_v1` views it is granted. |
| R5 | A link = a read grant on views. Cut = revoke, effective on the next query, logged. Cut master-data link = feature shows "connection off". |
| R6 | All products installed everywhere; unlicensed = containers stopped + login disabled + no grants. |
| R7 | One config file per customer in a private Git repo; control panel edits it and draws the product/link diagram; GitHub Actions applies it (containers, grants, migrations, health check, rollback); signed bundles for offline sites. |
| R8 | Outside systems (SAP, LIMS, BI) get read-only logins on chosen views, switched like links. |
| R9 | A reference "hello" product proves the add-a-product recipe end to end. |

## 3. Minimum compliance register
Full text: `docs/03-compliance-register.md` (generated from `compliance/register.yaml`). 13 platform rules, 7 customer procedures:

| ID | Rule | Main clauses |
|---|---|---|
| PL-01 | Only authorised people; per-product roles from the register | 11.10(d)(g), 211.68(b), A11 12.1, SchM 20.4 |
| PL-02 | Access grants (roles, links, outside logins) recorded, never overwritten | A11 12.3 |
| PL-03 | One verified identity per person, never reused | 11.100(a)(b), 11.300(a) |
| PL-04 | Password ageing, controlled reset (temporary password), lockout, immediate alert; no admin can sign as someone else | 11.300(b)(c)(d), 11.200(a)(3) |
| PL-05 | Re-authentication at e-signature through SSO | 11.200(a)(1) |
| PL-06 | Audit trail of master data / employees / permissions with reason, printable/exportable | 11.10(e), SchM 20.4, A11 9, 12.4 |
| PL-07 | Signed records keep signer name + master values as at signing | 11.50(a), A11 7.1 |
| PL-08 | Read-only, versioned, checked data exchange; no cross-writes | A11 5, SchM 20.4 |
| PL-09 | Per-customer system description: config + diagram + fixed architecture/security section | A11 4.3 |
| PL-10 | Every change (config, releases, host/OS/PostgreSQL) authorised, tested, recorded | SchM 20.8, A11 10 |
| PL-11 | Continuous backup (WAL archive + nightly base backup) to a copy-only off-server rclone remote (D-14); restore proven | SchM 20.9, A11 7.2, 211.68(b) |
| PL-12 | Access review report | A11 11, A11 2 |
| PL-13 | Data-moving migrations and _v2 views checked (counts + checksums) | A11 4.8 |

Customer procedures: CP-01 risk assessment + validation (IQ/OQ) + supplier QMS evidence, CP-02 **site change approval for every switch** (the control panel asks for the customer's change reference), CP-03 periodic access and audit-trail review, CP-04 periodic real restore, CP-05 incidents, CP-06 written agreement with you as service provider (A11 3.1, 3.2), CP-07 SOPs and business continuity.
Dropped (no clause requires them): MFA, approval signatures on master-data edits, read logging, encryption at rest, local copies of master data.

**Verification.** (1) Program: `scripts/check-register.py` checks every cited clause exists and contains the quoted words — **36/36 pass**. (2) An independent AI verifier reviewed meaning, adequacy and gaps: 14 findings, all handled in draft 2 and listed in `docs/04-register-verification.md` (biggest: nightly-only backup could lose a day, so continuous WAL archiving; password reset controls; change control must cover releases and infrastructure; new PL-13 migration checks). (3) Every rule has a test named by its ID; CI fails if a rule has no test.

## 4. Architecture
```
 customer server (Docker Compose, behind Caddy)
 ┌─────────────────────────────────────────────────────────────┐
 │ core  (one small app: sign-on + people/permissions screen + │
 │        master-data screen)  → writes identity, master_data   │
 │ logbook, materials, ... hello  → each writes ONLY its own DB │
 │ PostgreSQL 17: 10 databases                                  │
 │   products read report.*_v1 views of others via grants       │
 └─────────────────────────────────────────────────────────────┘
        ▲ apply.sh (same script online and offline)
 GitHub Actions ◄── customers/ folder in this repo (one YAML per customer, age secrets, D-12)
        ▲ commits
 control panel (your server only; control_panel database)
```
- **One `core` app** instead of three: sign-on, people & permissions screen, master-data screen. Fewer containers, one login page, same stack (Node/TypeScript + Fastify + React + postgres). It connects to `identity` and `master_data` only.
- **Single sign-on: a minimal OIDC provider inside `core`, built on `oidc-provider`** (panva; OpenID-certified library). Why not Keycloak: Keycloak keeps its own user tables and its own admin console, so employees would live in two places, and it needs a Java service with ~1 GB RAM on every customer server. With `oidc-provider` employees, passwords and the register live in one `identity` database, edited in one screen, and the password/lockout code is reused from the products. Each product is an OIDC client; its token carries only that product's roles. Tokens live 5 min and every renewal re-checks the register, so a deactivation reaches every product within 5 min, and immediately at the next e-signature (re-authentication).
- **Reading another database.** PostgreSQL cannot query across databases, so a product that reads a link opens a second small connection pool to the provider's database with its own login. No postgres_fdw, no gateway.
- **No data lake, no gateway, no Kubernetes/Terraform/Vault.** Docker Compose, plain SQL, age-encrypted secrets (D-12).

## 5. Data model (sketch)
**master_data**
- `item` (id uuid, kind: equipment | instrument | room | material | supplier | product, code — unique per kind, never reused)
- `item_version` (item_id, version, name, fields jsonb checked per kind, active, changed_by id + name, changed_at UTC, reason) — insert-only; the history is the audit trail.
- `item_link` (id, from_item, to_item, type e.g. *located_in*, *supplied_by*, *made_of*; version, active, who, when, reason) — insert-only.
- Views `report.equipment_v1`, `instrument_v1`, `room_v1`, `material_v1`, `supplier_v1`, `product_v1`, `item_link_v1` (current version + `version`, `read_at`, `data_as_of`).

**identity**
- `employee` (id uuid, login — unique for all time, created_at) + `employee_version` (full name, email, active, who, when, reason) — insert-only.
- `credential` (password hash argon2id, changed_at, failed count, locked_at), `alert` (lockouts, acknowledged by/at).
- `product_role` (product, role, description) — loaded from each product's manifest.
- `grant_event` (employee, product, role, grant|revoke, by, at, reason) — insert-only; `current_grant` view.
- `signon_event` (employee, product, at, ok/failed).
- View `report.employee_v1` (id, login, full name, active) for products that show names of others.

**each product database**: its own tables only; it stores `employee_id` + signer name at signing, master `item_id` + `version` + the display values its signed records need. Publishes its `report.*_v1` views.

**every database** has `platform.link_log` (at, consumer, views, on/off, change reference, applied version) — insert-only.

**control_panel** (your server): `customer`, `licence`, `link_switch`, `switch_log` (who, when, customer change ref, reason, commit, pipeline result).

## 6. Permission and grant model
| Role | Kind | Rights |
|---|---|---|
| `<db>_owner` | NOLOGIN | Owns the database's tables and views; used only by migrations. |
| `<product>_app` | LOGIN | DML on its own tables (no UPDATE/DELETE on audit/version tables); CONNECT on its own database only. |
| `core_app` | LOGIN | Same, on `identity` and `master_data`. |
| `ext_<name>` | LOGIN | Outside system; SELECT on chosen views only. |
| installer | the server's `postgres` superuser, used only by `init.sh` / `apply.sh` | Creates databases and roles, runs migrations, switches links (no separate admin role: simpler). |

- `REVOKE CONNECT ... FROM PUBLIC` on all 10 databases; `REVOKE TEMPORARY FROM PUBLIC` (Logbook pattern).
- A **link** = `CONNECT` on the provider database + `USAGE` on its `report` schema + `SELECT` on the listed `_v1` views, granted to the consumer's login. One SQL function per database, `platform.set_link(consumer, views[], on, change_ref)`, does the grant or revoke **and** writes `platform.link_log` in the same transaction. PostgreSQL checks rights at every query, so a revoke bites on the next query.
- A product sees "permission denied" (SQLSTATE 42501) on a cut link and shows **"Connection to <product> is off. Ask your administrator."**
- **Licence off** = containers stopped, `ALTER ROLE <product>_app NOLOGIN`, all its links off. Data kept. Licence on = reverse.
- Views follow the Logbook rule: columns may be added to `_v1`, never removed or renamed; a breaking change is `_v2`. A CI contract test per view enforces it.

## 7. GitOps flow
1. **Config file** `customers/<customer>.yaml` in the `customers/` folder of this private repo (D-04; can move to its own repo later if access must be split): platform version, host (online) or `offline: true`, licences, links (`consumer → provider: [views]`), outside logins. Secrets in `customers/<customer>.secrets.yaml.age`, encrypted with age to your key and the customer server's key (D-12).
2. **Control panel** (your server only, only you log in): customer list, licence switches, the product/link diagram with arrows you cut or restore. Each switch asks for a reason and the customer's change reference, writes `switch_log`, and commits the YAML via the GitHub API.
3. **GitHub Actions** on each commit: validate the file against the schema → for online customers SSH to the server and run `apply.sh`; for offline customers build a **bundle** (images via `docker save`, config, migrations, encrypted secrets) signed with `ssh-keygen -Y sign` (no extra tool); the site runs `apply.sh bundle.tar`, which verifies the signature first.
4. **`apply.sh`** (same for both): back up → pull/load images → run migrations (each in a transaction; additive only) → start licensed / stop unlicensed containers → set links and outside logins → health checks → on failure, re-apply the previous config and images → report result (and commit status).
5. **Backups**: PostgreSQL's built-in WAL archiving plus a nightly `pg_basebackup` (one consistent copy of all 10 databases) to off-server storage the server can add to but not delete; point-in-time restore script tested in CI. Config repo and age keys backed up too.

## 8. Slices (each: branch, tests named by rule ID, CI green, one review, squash-merge, email)
Status 2 Nov 2026: Phase A complete with A9 (A6 shipped as A6a/A6b/A6c, D-13, D-14). Details in docs/handover.md.
| # | Slice | Proves |
|---|---|---|
| A0 | Repo skeleton, CI, register + checker, this plan | — |
| A1 | Database server: Compose, 10 databases, roles, PUBLIC revokes, `platform.set_link` + `link_log` | PL-02, PL-08 |
| A2 | `core` API: employees (identity verified), passwords, temporary-password reset, lockout + email + alert, permission register, history export | PL-01, PL-03, PL-04, PL-06 |
| A2b | `core` people & permissions screens (React) on the A2 API | — |
| A3 | `core`: OIDC sign-on, per-product role claims, re-authentication, deactivate-everywhere | PL-01, PL-05 |
| A4 | `core`: master-data screen, items/versions/links, `report.*_v1` views | PL-06, PL-08 |
| A5 | `hello` product: SSO login, reads master data, signs a note keeping values at signing, publishes `note_v1`, "connection off" | PL-07, PL-08 |
| A6 | Config schema + `apply.sh` (licences, links, outside logins, migrations + data checks, health, rollback) + age secrets + WAL backup/restore | PL-10, PL-11, PL-13 |
| A7 | GitHub Actions: online apply + signed offline bundles + verify | PL-10 |
| A8 | Control panel: customers, licences, switches, switch log, diagram, commits config | PL-09, PL-10 |
| A9 | Access review report + add-a-product recipe doc + config template entry; Simplicity review of Phase A | PL-12 |

The hello product exists only in the platform repo and CI; it is never installed at a customer.

## 9. Decisions (all settled, see docs/decisions.md)
1. Code repo `maglesT/databsee` (D-01); customer configs in its `customers/` folder, not a second repo (D-04).
2. Cut master-data link → feature stops, no local copies (D-02).
3. Lockout also emails the site security contact (D-03).
4. Single sign-on built into `core`, not Keycloak (D-05).
5. One `core` app for sign-on + people/permissions + master data (D-06).
6. "Links table" in master_data = relationships between master items; product-to-product links are the config file + grants (D-07).
7. Each switch asks for the customer's change reference: one free-text field (D-08).

## 10. Simplicity review
- **Removed:** API gateway, data lake, postgres_fdw, Keycloak, Kubernetes/Terraform/Vault, separate master-data and identity apps, separate audit tables (insert-only versions are the audit trail), MFA, approval signatures on master data, local copies of master data.
- **Kept small:** one repo (code + customer configs), one Postgres server, one `core` app, one SQL function for links, one shell script for online and offline, one YAML per customer.
- **Reused:** Logbook view pattern, Material Management register checker and source texts, products' password/lockout code.
- **Open risk:** 5-minute token lifetime is the deactivation delay outside e-signatures; shorter costs more renewals. I think 5 minutes is right.
