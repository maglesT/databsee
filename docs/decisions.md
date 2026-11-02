# Decisions

| ID | Date | Decision | By |
|---|---|---|---|
| D-01 | 2026-11-02 | Platform code repo is `maglesT/databsee`. | Owner (gave the repo) |
| D-02 | 2026-11-02 | When a master-data link is cut, the dependent feature stops and shows "connection off". No local copies of master data. | Owner ("yeah") |
| D-03 | 2026-11-02 | A lockout after too many wrong passwords also emails the site security contact at once (21 CFR 11.300(d)), besides the on-screen alert. | Owner ("yes") |
| D-04 | 2026-11-02 | Customer config files live in the `customers/` folder of this repo, not a second repo (simpler). Secrets SOPS-encrypted. | Owner ("do what's more simple") |
| D-05 | 2026-11-02 | Single sign-on is built into the `core` app (oidc-provider library), not Keycloak. | Owner (same) |
| D-06 | 2026-11-02 | One `core` app for sign-on, people/permissions and master data. | Owner (same) |
| D-07 | 2026-11-02 | master_data "links" = relationships between master items (equipment in room, material from supplier). Product-to-product links = config file + database grants. | Owner (same) |
| D-08 | 2026-11-02 | Every switch in the control panel asks for the customer's change reference (one free-text field), for the site's change control (SchM 20.8). | Owner (same) |
| D-09 | 2026-11-02 | Plan draft 2 approved; build starts with slice A1. | Owner (same) |
