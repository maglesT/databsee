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
