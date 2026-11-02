# Deliverable (c) — Minimum compliance register

Generated from `compliance/register.yaml` by `scripts/check-register.py --render`; edit the YAML, not this file.

**Test for every rule:** a binding clause (21 CFR 211/11 *shall*, EudraLex Vol 4, Revised Schedule M) breaks if it is dropped. FDA guidance only narrows. Least-strict implementation that satisfies all three.

**Source keys:** CFR211, CFR11 (eCFR 24 Sep 2026); C3–C6 EudraLex Vol 4 Part I chapters; A8, A11, A19 annexes; SCHM Revised Schedule M (G.S.R. 922(E)) Part I.

**13 product rules, 7 customer procedures.**

## A. Product rules

### PL-01 — Only authorised people get in, with per-product authority

**Rule.** Every product admits only active employees with a role for that product in the permission register; the product checks the role on the server for each action.

**Clauses.** CFR11 11.10(d) "Limiting system access to authorized individuals"; CFR11 11.10(g) "Use of authority checks to ensure that only authorized individuals"; CFR211 211.68(b) "instituted only by authorized personnel"; A11 12.1 "restrict access to computerised system to authorised persons"; SCHM 20.4 "sufficient controls to prevent unauthorised access"

**Breaks if dropped.** 11.10(d)/(g), A11 12.1, SchM 20.4.

**Implementation (least strict).** One sign-on (OIDC). The token a product receives carries only that product's roles from the register. Deactivating an employee ends sign-on for every product; access tokens live 5 minutes and every renewal re-checks the register. Products keep their own server-side role checks.

**Test.** Deactivated employee cannot sign on to any product; a token for product A carries no roles of product B.

### PL-02 — Access grants are recorded

**Rule.** Creating, changing and cancelling access (employee roles, product-to-product links, outside-system logins) is recorded with who, when and why, and never overwritten.

**Clauses.** A11 12.3 "Creation"; CFR11 11.10(e) "Record changes shall not obscure previously recorded information"

**Breaks if dropped.** A11 12.3 (11.10(e) only supporting: the register is not a predicate-rule record).

**Implementation (least strict).** The permission register is insert-only grant/revoke events (current rights are a view over them). Every link grant/revoke on a database writes an insert-only row to that database's link log in the same transaction. The control panel keeps its own switch log.

**Test.** Grant then revoke leaves two rows; the app role cannot update or delete them.

### PL-03 — One verified identity per person, never reused

**Rule.** Login IDs are unique and are never reused or reassigned, even after deactivation. The identity of each person is verified before they get a login, and who verified it is recorded.

**Clauses.** CFR11 11.100(a) "shall not be reused by"; CFR11 11.300(a) "no two individuals have the same combination"; CFR11 11.100(b) "shall verify the identity of the individual"

**Breaks if dropped.** 11.100(a), 11.300(a).

**Implementation (least strict).** Employees are deactivated, never deleted; login ID is unique for all time and cannot be renamed. Creating an employee requires "identity verified by" (the admin) and "how" (e.g. ID card seen).

**Test.** Creating an employee with a deactivated person's login ID is refused; no delete path exists.

### PL-04 — Password controls, controlled reset, misuse alerts

**Rule.** Passwords age out; resets are controlled; repeated failed sign-ons lock the account and alert the site at once; no admin can sign as someone else.

**Clauses.** CFR11 11.300(b) "periodically checked"; CFR11 11.300(d) "detect and report in an immediate and urgent manner"; CFR11 11.300(c) "suitable, rigorous controls"; CFR11 11.200(a)(3) "requires collaboration of two or more individuals"

**Breaks if dropped.** 11.300(b), 11.300(d).

**Implementation (least strict).** Password expiry (default 90 days; the clause gives ageing as an example). Admin reset sets a temporary password that must be changed at first use, so no admin ever knows a usable password. Lockout after 5 failures emails the site security contact at once (decision D-03) and raises an alert on every core screen for identity admins until acknowledged, plus an audit row.

**Test.** Fifth failure locks, sends the email and raises the alert; temporary password must be changed before any token is issued.

### PL-05 — Re-authentication at e-signature through the sign-on

**Rule.** A product that signs can demand both components again (or one within a continuous session) through the sign-on, so e-signatures keep working with SSO.

**Clauses.** CFR11 11.200(a)(1) "Employ at least two distinct identification components"

**Breaks if dropped.** 11.200(a)(1).

**Implementation (least strict).** Standard OIDC re-authentication (prompt=login, max_age=0); the fresh token proves who signed and when. The product records the signature itself (its own register).

**Test.** A re-auth request with a wrong password yields no token; a correct one returns a token issued now.

### PL-06 — Audit trail of platform data

**Rule.** Every create and change of master data, employees and permissions is recorded by the system with who, when, the previous value and the reason, and kept as long as the data. The audit trail can be shown and exported in readable form.

**Clauses.** CFR11 11.10(e) "computer-generated"; SCHM 20.4 "record of any data change made"; A11 9 "the reason should be documented"; A11 12.4 "record the identity of operators entering"; A11 9 "convertible to a generally intelligible form"

**Breaks if dropped.** SchM 20.4 (no risk qualifier), A11 9 (reason).

**Implementation (least strict).** Master data and employees are insert-only versions (who, server UTC time, reason); nothing is deleted. The version history is the audit trail and is shown on the screen. Each history can be printed / exported as CSV. Regular review is CP-03.

**Test.** An edit without a reason is refused; the old version stays readable; the app role cannot update a version.

### PL-07 — Signed records keep their meaning without master data

**Rule.** A signed product record keeps the signer's printed name and the master-data values it relied on as they were at signing, so it stays readable for its retention period even if master data changes or a link is cut.

**Clauses.** CFR11 11.50(a) "The printed name of the signer"; A11 7.1 "Access to data should be ensured throughout the retention period"

**Breaks if dropped.** 11.50(a), A11 7.1.

**Implementation (least strict).** Recipe rule for every product, proven in the hello product - store the master-data ID plus the few display values at signing (code, name, version). No other local copy of master lists.

**Test.** Hello note signed, then the equipment renamed and the link cut - the note still shows the old name.

### PL-08 — Checked, read-only data exchange between products

**Rule.** Products exchange data only through published, versioned read-only views; no product writes another product's database; a cut link is refused clearly, never served from stale copies.

**Clauses.** A11 5 "built-in checks for the correct and secure entry and processing of data"; SCHM 20.4 "prevent unauthorised access or changes to data"

**Breaks if dropped.** A11 5, SchM 20.4.

**Implementation (least strict).** SELECT-only grants on report.*_v1 views; a CI contract test fails if a _v1 column is removed or renamed. A refused read shows "connection off". (Rows carry data_as_of / read_at as in existing products: a convention, not a clause.)

**Test.** Consumer cannot write or read raw tables of the provider; after revoke its next read is refused.

### PL-09 — System description with data flows

**Rule.** For each customer an up-to-date description exists: products, versions, interfaces, plus the fixed architecture and security measures.

**Clauses.** A11 4.3 "data flows and interfaces with other systems"; A11 4.3 "security measures should be available"

**Breaks if dropped.** A11 4.3 (critical systems).

**Implementation (least strict).** The customer config file (products, licences, links, versions) drawn as the diagram in the control panel, plus a fixed architecture and security section in the install guide (host, database server, sign-on, grants, backups).

**Test.** Diagram generated from a config file lists every product, version and link in it.

### PL-10 — Controlled, recorded changes to each customer system

**Rule.** Every change - licences, links, configuration, platform/product releases and infrastructure (host, OS, PostgreSQL) - is authorised, tested before going live and recorded.

**Clauses.** SCHM 20.8 "formally authorised"; A11 10 "only be made in a controlled manner in accordance with a defined procedure"; SCHM 20.8 "hardware, software and any other critical component"

**Breaks if dropped.** SchM 20.8, A11 10.

**Implementation (least strict).** Config changes only through the config file: Git history is the record (who, when, what, reason, customer change reference, required by the control panel). Releases: version tag + release notes + CI result. Infrastructure changes: a dated entry in the customer's change log file in the same repo. The pipeline also rolls back on a failed health check - a design choice, not a clause.

**Test.** A switch without a change reference is refused; a failing health check restores the previous state.

### PL-11 — Backup with no permanent loss

**Rule.** No permanent loss: all 10 databases are backed up continuously and consistently, off the server, protected from alteration and erasure, and a restore is proven.

**Clauses.** SCHM 20.9 "no permanent loss of records"; A11 7.2 "Regular back-ups of all relevant data should be done"; CFR211 211.68(b) "A backup file of data entered into the computer"; CFR211 211.68(b) "secure from alteration, inadvertent erasures, or loss"

**Breaks if dropped.** SchM 20.9, A11 7.2, 211.68(b).

**Implementation (least strict).** PostgreSQL WAL archiving (built-in archive_command) plus a nightly pg_basebackup, both copied to off-server storage the database server can add to but not delete (append-only), so any point in time can be restored. The config repo and the age keys are backed up the same way. Restore script tested in CI; periodic restore of real backups is CP-04.

**Test.** CI restores to a point in time and finds the rows written up to it in all databases; the server cannot delete an archived file.

### PL-12 — Access review report

**Rule.** The site can review periodically who has which role in which product, and which links and outside logins are on.

**Clauses.** A11 11 "periodically evaluated"; A11 2 "level of access"

**Breaks if dropped.** A11 11 (security is in the evaluation), A11 2.

**Implementation (least strict).** One printable report from the register (employee, product, role, granted by/when, last sign-on) and the link logs. The review itself is customer procedure CP-03.

**Test.** Report lists every active grant and no revoked one.

### PL-13 — Data unchanged by migrations

**Rule.** Upgrades that move or reshape data, and a new _v2 view, are checked so values and meaning are unchanged.

**Clauses.** A11 4.8 "not altered in value and/or meaning"

**Breaks if dropped.** A11 4.8.

**Implementation (least strict).** Migrations are additive by default. A migration that moves data ships a check (row counts + checksums before/after) that apply.sh runs; a _v2 view has a CI test comparing its rows with _v1.

**Test.** A migration that loses a row fails its check and is rolled back.

## B. Customer procedures (the site does them; the product supports)

| ID | Procedure | Clauses | Product support |
|---|---|---|---|
| CP-01 | Documented risk assessment; validate the installed system and configuration (IQ/OQ); supplier QMS evidence available. | A11 1, 4, 4.5; SchM 20.1-20.3; 11.10(a) | Owner supplies risk assessment, IQ/OQ templates, QMS evidence; rule-to-test traceability and CI reports per version. |
| CP-02 | Authorise every change (licence | SchM 20.8; A11 10 | Control panel requires the customer change reference per switch. |
| CP-03 | Periodic review of access and of audit trails; periodic evaluation of the system. | A11 9, 11 | PL-12 report and PL-06 audit-trail export. |
| CP-04 | Periodically restore a real backup and check it. | A11 7.2; SchM 20.9 | Restore script (PL-11). |
| CP-05 | Record and investigate incidents. | SchM 20.7; A11 13 | Health-check and pipeline failures are logged; investigation stays in the site QMS. |
| CP-06 | Written agreement with the owner as service provider (hosting, remote changes, disk protection); supplier audit as risk-based. | A11 3.1, 3.2 | Owner provides the agreement template and an audit package. |
| CP-07 | Written procedures for operation and maintenance; business continuity when down. | SchM 20.5; A11 16 | Install and operation guide. |

## C. Considered and not applicable

| Clause | Why |
|---|---|
| A11 8.2 printouts of changed data | The platform holds no batch-release records; products cover it. |
| A11 6 / SchM 20.6 accuracy checks | Master-data fields get system checks (type Holds only while no master-data field is critical (e.g. specification limits entered by hand); recorded in the risk assessment. |

## D. Dropped candidates (no binding clause breaks)

| Candidate | Why dropped |
|---|---|
| Multi-factor sign-on | No binding clause requires it (11.200 asks for two components = ID + password). |
| Approval e-signature on each master-data change | No binding clause; authorised editors + audit trail with reason meet 211.68(b) and SchM 20.4. |
| Logging of every read | No clause requires read logging; access grants are logged (PL-02). |
| Encryption at rest | Not required by a clause (A11 7.1 / SchM 20.9 ask for protection, not encryption); disk protection is in the hosting agreement (CP-06). |
| Local copies of master data when a link is cut | Not required; signed records keep what they need (PL-07). |
