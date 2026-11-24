# Medhanta ASSURE: feature list

Medhanta ASSURE (formerly "QMS" / "Quality system") is the quality management system of the Medhanta suite for one pharma manufacturing site, built to what 21 CFR 211 / Part 11, EU GMP Vol 4 and India Revised Schedule M require. Every record type is a fixed digital form with a short, fixed sequence of steps; each step ends with a submit or an e-signature. Numbers in brackets are the screens that show the feature (screens/NN-…png).

## Sign-in, people and access (Medhanta core)
- One Medhanta login for the whole suite: people sign in through Medhanta core, not with a local password (01).
- Access by four permission codes ticked in core's people screen: work on records, QA signatures, authorised-person signatures, read the audit trail; renewed from core every few minutes, so a removed right takes effect quickly (50).
- Every e-signature asks for the password again at core, in a small window, and shows its meaning first (04, 06, 19, 28, 34).
- Wrong passwords and lockout are handled by core (no local user admin or lockout alert screens any more; not shown).

## Common to every record type
- Numbered records per type and year, e.g. CC-2026-0003, MC-2026-0003, QCAPA-2026-0002, RA-2026-0002 (13, 17, 23).
- Typed fields: text, date, number, choice, multi-choice, Yes/No with details, tables of rows, file attachments (PDF, PNG, JPEG) (03, 14, 18, 23).
- Products, suppliers and materials are picked from the plant's master data with their codes, never typed; checked again at signing (12, 26, 40).
- Required fields block finishing a step; the screen lists what is still needed (42).
- Fixed step order; one clear button per step, shown only to people allowed to press it (05, 14, 40).
- Independence: some signatures cannot be given by the creator or by whoever wrote earlier steps (05, 19, 28).
- Reject outcome where it applies (change QA approval, CAPA plan, document, risk and supplier approval) (40).
- Corrections after a step is finished need a reason, typed in the form; the old version stays (30, 39, 51).
- New (fix round, 21 Nov 2026): a correction made after later steps were signed keeps those signatures; QA approves the correction with one e-signature and the record is back where it was (30, 31, 32).
- History per record: every saved version and every signature (39).
- Cancel a record with a reason; nothing is deleted (not shown).
- One list per type with Open / Closed / All tabs, search by number or title, product filter, a record count and Print (33, 37, 46).
- One PDF per record with the Medhanta ASSURE header, all versions and signatures (48).

## My work (home page)
- Tiles: Waiting for me, Overdue, Open (02).
- Waiting for me across all record types; overdue in red; recurring reviews due in the next 30 days (02).

## Document control (SOPs, specifications, master instructions, test methods)
- One record = one version of a document, with the site's own number and revision and the document file (03).
- Prepared (author) → Reviewed (someone else) → QA approved with effective date and next periodic review date (04, 05, 06, 07).
- Version in force per document number from its effective date; Current tab with next periodic reviews, overdue in red (07, 10).
- Older versions carry a red "SUPERSEDED – do not use" banner (11).
- New: controlled copies. QA prints a numbered copy of an approved version, with "issued to" and reason; every copy is logged on the document page; a version not in force prints "OBSOLETE: for reference only" (08, 09, 49).
- New: the document view. Other Medhanta products (TrueBatch, QLIMS, LEAD) read which version of each document is in force from ASSURE (said in 07; a read-only view, nothing to show on screen).
- Periodic review "no change" and Retire (not shown).

## Market complaints
- Record as received: date, written or oral, nature, complainant, product picked from master data, strength, lot, assessment due (12, 13).
- QA assessment with fixed questions: AP informed, defect, specification failure, investigation, adverse drug experience, falsification, other batches, recall, other action, authority informed; closure due (14, 15).
- Closure: findings, defect confirmed, CAPA reference, decisions, reply to the complainant; QA closes (15, closure itself not shown).
- New: any DEV-… or CAPA-… number named in a record shows live from Medhanta DIVE, read-only ("Linked in DIVE") (16, 17).

## CAPA (corrective and preventive action)
- Plan: source and reference, problem, risk questions, containment, root-cause method, root cause and category, human error, corrective and preventive action tables with owners and due dates, effectiveness criteria, due date (17, 18).
- QA approves or rejects the plan; implementation; effectiveness check and QA closure (19, 20; later steps not shown).
- New: ASSURE owns CAPA on the platform. DIVE's CAPAs show read-only under the CAPA list with "Start a QMS CAPA" (21); DIVE links to ASSURE to raise a CAPA with the deviation picked and its title pulled in (22). ASSURE publishes its CAPAs for DIVE to read (view, not shown).

## Quality risk management (new, 18 Nov)
- Risk assessment RA-…: scope and risk question, products, team, method (simple risk ranking or FMEA), links to a DIVE deviation or CAPA and a QMS CAPA (23).
- Rows rated on fixed 1–5 scales for severity, occurrence and detection; the score is computed by the software; actions with owners and dates; residual score (23, 24).
- QA approval with "residual risk acceptable?" and the next review date (24).
- Risk register list: highest residual score first, periodic reviews due (25).

## Change control
- Proposal: what changes, why, kind of change, products affected, nine Yes/No impact questions, impact summary, risk assessment picked, actions table, target date, linked records (26, 27).
- New (product-code changes): products affected are ticked from master data with their codes; "Not product-specific" is a tick; names typed only when master data cannot be read, marked "typed by hand, not checked" (26).
- Department approval → QA approval (or reject) → implementation → effectiveness evaluation and QA closure (28, 29).
- New: the change view. TrueBatch reads approved change controls, with their product codes, from ASSURE when it approves a new master version (said in 29; a read-only view).
- Fix round 21 Nov: correction after later signatures, one QA approval (30, 31, 32).

## Recalls and mock recalls
- Only the authorised person initiates: type, product (also a discontinued one), batches and quantities, reason, distribution level, final report due (34).
- Progress log: authority informed, dated entries with batch and quantity recovered (35).
- Final report: reconciliation, disposition, segregation, rework, office hours, evaluation; closed by AP or QA, not the initiator (36).
- List shows when the last mock recall was closed (37).

## Audits and observations
- Self-inspections and supplier audits (supplier from master data): scope, areas covered, planned date, auditors (not shown separately).
- Report with a findings table, evaluation, follow-up due; signed "Report issued"; corrections need a reason and are signed again (38, 39).
- Follow-up per finding, management evaluation, QA closure (not shown).

## Supplier quality
- Approve, re-approve or withdraw a supplier and its materials (from master data): history, material risk, audit, traceability, reduced testing on the supplier's CoA, quality agreement, re-evaluation date (40).
- New: "Conditions of approval (leave empty for a full approval)" (fix round 21 Nov); broker derived when the manufacturer differs (40).
- Approved supplier list with re-evaluation dates, overdue in red (41).
- New: the supplier approval view. Medhanta QLIMS reads each material's approval status (approved, conditional, not approved, disqualified) and reduced testing (said in 41).

## Product quality review (PQR)
- One review per product (or group) and period, with every item the rules list (42).
- New: "Fill from the platform" writes factual summaries with references into empty items: batches from TrueBatch Tablets, Injectables and their packing (and Capsules, Oral Liquids, API); starting materials and new sources from TrueBatch and Medhanta MMS; deviations and CAPAs from Medhanta DIVE; OOS, stability and test results from Medhanta QLIMS; QA-signed CPV reports from Medhanta RISE; qualification status from Medhanta EQUIP; this system's own changes, complaints and recalls (43, 44).
- What was read and when is kept with the review; a link that is off says "write it by hand"; "Refill this item" keeps items a person edited (43).
- Authorised person review and signature; next review due per product (45, 46).

## Management review
- Meeting date, attendees, senior management, what was reviewed, decisions, actions, next review due; signed Closed (47).

## Audit trail and data integrity
- Audit trail for QA: when, who, what, record, before and after values, reason; filter by user and date (50, 51).
- Nightly integrity check of signed content; last result and "Run now" on the Audit trail page; a failed check stays on screen until acknowledged (50).
- Records, versions, signatures and audit entries are insert-only for the application.
- Daily backup with off-site copy and a restore check (operations; not shown).

## Not in the product (so not shown)
- Training records, dashboards, charts, notifications and e-mails: deliberately left out; My work lists what is due.
- Deviations themselves live in Medhanta DIVE; ASSURE shows them read-only.
