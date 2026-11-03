# Add a product to the platform (recipe)

The `hello` product (`apps/hello`, `db/hello`, `test/hello.test.ts`) is the worked example of every step. Phase B
products (Logbook, Material Management, then Batchwright) follow this recipe: rewire only, no new features (D-11).
Each step names the rule it serves. A product is done when its tests, named by rule ID, pass in CI.

## 1. Manifest: `apps/<product>/manifest.json`
```json
{ "product": "logbook", "database": "logbook",
  "permissions": [{ "code": "logbook.entry.write", "label": "Write and sign entries" },
                  { "code": "logbook.entry.read", "label": "Read entries" }],
  "publishes": ["entry_v1"],
  "reads": { "master_data": ["equipment_v1", "room_v1"] } }
```
`product` and `database` are the same name. Permission codes are `<product>.<thing>.<action>`, lower case and dotted,
each with a label for the people screen; `apply` refuses a malformed manifest. `apply` loads the permissions into the
register's catalogue (PL-01, D-16): a new code or label is recorded, and a code removed from the manifest becomes
inactive and is revoked from everyone holding it. The control panel uses `reads` to offer the product's links (PL-09).

## 2. Its own database: `db/<product>/NNNN_name.sql`
- The product writes only its own tables. `init.sh` creates the database, the `<product>_owner` role and the
  `<product>_app` login (PL-08).
- The app login gets only SELECT and INSERT on new tables (D-17). If a table holds current state the app must change
  or remove (a session, a lock), grant exactly that in a migration: `grant update on <table> to <product>_app;`.
- Signed and audited tables are insert-only: a `refuse_change()` trigger, and `revoke update, delete, truncate` from
  the app (PL-06).
- A migration that moves or reshapes data ships `NNNN_name.check.sql`: a query before `-- after` and one after it,
  returning the same rows, such as counts and checksums (PL-13).
- Published views: `report.<name>_v1` with `security_barrier`, carrying `read_at` and `data_as_of`. Columns may be
  added, never removed or renamed; a breaking change is `_v2`, with a test comparing it to `_v1` (PL-08, PL-13).

## 3. Sign-on through core (PL-01, PL-05)
- OIDC code flow with PKCE against `https://<domain>/oidc`, scope `openid profile permissions`. The product's rights
  come from the `permissions` claim and nothing else: an array of this product's codes only, e.g.
  `"permissions": ["hello.note.read", "hello.note.sign"]`. Check the needed code on the server for each action. No
  local user table, no local passwords. Someone with no permission in the product is refused at sign-in by core.
- At an e-signature, redirect with `prompt=login`. The re-authenticated `sub` must be the signer.

## 4. Reading master data or another product (PL-07, PL-08, A11 5) — mandatory
- Read only through the provider's `report.*_v1` views, with the product's own login and a second connection pool.
- **Write-time check (mandatory):** before storing a reference to a master-data item or employee, read it through the
  view and refuse the write if it is missing or `active = false`. In hello: `apps/hello/app.ts` ("No such active
  equipment"). Binding: A11 5, "built-in checks for the correct and secure entry and processing of data". Each
  product has a test named `PL-08 ... refuses an inactive or unknown item`.
- Store the item id plus the display values and version as at signing, and the signer's name (PL-07). Never keep a
  local copy of master data (D-02).
- On a refused read (SQLSTATE 42501, or 28000 when the login is off), show "Connection to <provider> is off. Ask your
  administrator." and stop that feature. Never serve stale data.

## 5. Running it
- Settings come from the environment that `apply` writes: `<DB>_DATABASE_URL` for its own database and each linked
  provider, `OIDC_ISSUER`, `OIDC_CLIENT_SECRET`, `OIDC_REDIRECT_URI` (`https://<product>.<domain>/cb`), `PORT=3000`.
- `deploy/compose.yml`: one service like `hello`, with `profiles: [<product>]` so it runs only when licensed.
- A product kept in its own repo (the Logbook) adds `"source": {"repo", "commit"}` (full commit id) to its manifest.
  `deploy/bundle.sh` builds `medhanta/<product>:<commit>` from its `ops/Dockerfile` and copies its `db/migrations` to
  `db/<product>`, so `apply` runs them as `<product>_owner`. The repo is read with the Actions secret `PRODUCT_SOURCE_TOKEN`.
  Its own extra settings, such as API keys, go in the secrets under `env.<product>`.

## 6. Configuration and secrets
- Customer config: add the product to `licences` and its links under `links`. The template is `customers/example.yaml`.
- Secrets: a `<product>_app` password and an OIDC client secret. The template is `customers/example.secrets.template.yaml`.

## 7. Tests (CI fails without them: `scripts/check-traceability.py`)
At least:
- PL-01: sign-on through core; a person without a permission is refused; each action checks its permission.
- PL-07: values kept as at signing.
- PL-08: no raw-table read; "connection off" after a cut; inactive or unknown item refused at write.
- PL-13: for any data-moving migration.
