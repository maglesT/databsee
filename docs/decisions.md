# Decisions

| ID | Date | Decision | By |
|---|---|---|---|
| D-01 | 2026-11-02 | Platform code repo is `maglesT/databsee`. | Owner (gave the repo) |
| D-02 | 2026-11-02 | When a master-data link is cut, the dependent feature stops and shows "connection off". No local copies of master data. | Owner ("yeah") |
| D-03 | 2026-11-02 | A lockout after too many wrong passwords also emails the site security contact at once (21 CFR 11.300(d)), besides the on-screen alert. | Owner ("yes") |
| D-04 | 2026-11-02 | Customer config files live in the `customers/` folder of this repo, not a second repo (simpler). Secrets encrypted (see D-12). | Owner ("do what's more simple") |
| D-05 | 2026-11-02 | Single sign-on is built into the `core` app (oidc-provider library), not Keycloak. | Owner (same) |
| D-06 | 2026-11-02 | One `core` app for sign-on, people/permissions and master data. | Owner (same) |
| D-07 | 2026-11-02 | master_data "links" = relationships between master items (equipment in room, material from supplier). Product-to-product links = config file + database grants. | Owner (same) |
| D-08 | 2026-11-02 | Every switch in the control panel asks for the customer's change reference (one free-text field), for the site's change control (SchM 20.8). | Owner (same) |
| D-09 | 2026-11-02 | Plan draft 2 approved; build starts with slice A1. | Owner (same) |
| D-10 | 2026-11-02 | Standing OK: squash-merge each Phase A slice once CI is green and its review pass is done; email after each merge. | Owner ("keep merging") |
| D-11 | 2026-11-02 | Phase B is rewire only: each product gets its own database on the shared server, reads master data through the read-only views, swaps its login for the core sign-on, and moves its data. No new features, no rewrites. | Owner (via lead) |
| D-12 | 2026-11-02 | Customer secrets are one file `customers/<name>.secrets.yaml.age`, encrypted with plain `age` to the owner's key and the server's key, instead of SOPS: one tool fewer, age is already on the servers. | Owner ("approvddd all thngs") |
| D-13 | 2026-11-02 | Slice A6 ships in two parts: A6a config file + apply (licences, links, outside logins, migration data checks, health check, rollback); A6b WAL-archive backups + point-in-time restore test. | Owner (same) |
| D-14 | 2026-11-02 | Off-server backups go to any rclone remote named in the customer config, Google Drive by default, with a copy-only job. No Object Lock or delete-refusal: no binding clause requires it (211.68(b) asks for protection from *inadvertent* erasure). | Owner (chose Google Drive), lead |
| D-15 | 2026-11-02 | The control panel keeps only `switch_log` in its database; customers, licences and links are read from the customer config files (the single source of truth), not copied into customer/licence/link_switch tables. Sign-in is HTTP Basic over HTTPS for the owner. | Session (owner's "do what's more simple") |
