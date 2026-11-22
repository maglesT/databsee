# Medhanta EQUIP: feature list

Medhanta EQUIP is electronic equipment qualification and validation protocols for one pharma plant that exports. India Revised Schedule M always applies, US FDA and EU GMP depending on the market, and the stricter rule wins. Every item is qualified with protocols written from built-in templates, approved by QA, executed on screen, reviewed by a second person and closed by an approved report. EQUIP runs in the browser as a product on the Medhanta platform. Screen numbers in brackets refer to `screens/`. Items marked **new** were added since early November 2026.

## Sign-in, people and e-signatures (Medhanta platform)
- **New:** People sign in with their own Medhanta login. The platform's single sign-on replaces local passwords and the users screen (01).
- **New:** Each person's rights in EQUIP are ticked on the platform's people screen. Someone with no EQUIP right is refused (not shown).
- **New:** Every e-signature asks for the password again at the platform, in a small window. The person and the meaning are shown before signing, and the platform counts wrong passwords towards its own lockout (13, 14, 17, 21, 27, 29).
- Sessions end after 15 minutes idle. Each session's rights are refreshed from the platform every 5 minutes (not shown).

## Items (what is qualified or validated)
- Nine kinds: equipment, utility, facility / area, computerised system, process, cleaning procedure, analytical method, transport route and **new:** lab instrument (04, 40, 51).
- **New:** Equipment, rooms and lab instruments are picked from the platform's master data instead of typed. Their ID and name come from there and always show the current values (06, 07).
- Each item has its location, description, status and next review date (07, 37).
- Statuses: Not qualified, Qualified, Qualified with conditions, Requalification needed (04).
- Next review dates are flagged "Due soon" (within 30 days) or "Overdue". The list can be filtered by kind, by status and by "Due or overdue", and searched (03, 04, 40).
- **New:** The My work tiles "Items overdue for review" and "Items due in 30 days" open the filtered Items list in one click (02, 03).
- QA can mark an item "Requalification needed" with a reason, such as a change-control number (41).
- Each item has a status history and a page with all its protocols by stage and its traceability (37–39).

## Protocols and templates
- **New:** 14 built-in templates: URS, DQ, IQ, OQ, PQ, combined IQ/OQ, computerised system validation, cleaning validation, process validation, analytical method validation, transport verification, periodic review, **media fill** and other (08).
- Every template has the same frame: header, basis for scope (risk assessment), instruments used, the template's own fixed sections and test steps (10, 11, 12).
- The URS is a requirement list with IDs and a GMP-critical flag (09).
- Test steps have an instruction, an acceptance criterion and a result type (number with unit and min/max, pass/fail or text), plus an optional URS ID and "evidence required" (12).
- **New:** Instruments used are picked from master data. Their calibration due date is pulled from **Medhanta LEAD** (the logbook) and marked "from LEAD". A date is typed by hand only when LEAD has none, and it is then marked so (11).
- The system lists what is missing before a protocol can be signed Prepared (10).
- A protocol can be copied for another item: sections and steps, never results (43).
- Lifecycle: Draft → Prepared → Approved (with effective date) → Executing → Results reviewed → Report prepared → Closed (13–15, 52).
- **New:** Signed records keep the item as it was at signing ("as signed", with its master-data version) on screen and in the PDF (15, 53).
- Protocol numbers follow PRT-YYYY-NNNN. Lists can show All, My drafts or Waiting for approval (44).

## Execution
- Tests are run by run on screen, each result beside its criterion, with a green Pass or red Fail (16, 18, 33).
- The system judges numbers. The executor judges pass/fail checks (18, 23).
- Evidence files (certificates, printouts) are attached per step (16).
- A correction needs a reason, and the old value stays visible (24).
- A warning shows when a listed instrument is overdue for calibration, using LEAD's date (45).
- Each executor signs Performed for each run (17, 25).
- Stage gate: the PQ cannot start before the OQ is released (26).
- **New (display round, 20 Nov):** One date style across the suite ("22 Nov, 18:16 IST"). Whole numbers use Indian grouping ("3,120 m³/h"). Results read in words ("5,190 units incubated, 10 removed"). Table headers keep units as written (µg/swab, not µG/SWAB) (24, 47, 49).

## Discrepancies
- A failed result opens a discrepancy automatically (19).
- A discrepancy records what happened, the root cause, the impact, the conclusion and the action: retest, repeat the run, accept with justification or change the protocol (20).
- QA closes it with an e-signature. The retest is added as a new attempt and the failed one stays visible (21–23).
- A step can be changed during execution with a justification. It becomes a new protocol version once QA closes the change (32, 33, 52).

## Review and report
- Results reviewed: a second person who entered none of the results signs (27).
- A report is generated with the results per run, all attempts, discrepancies and changed criteria (28, 31).
- The author writes the conclusion and outcome and signs Report prepared (29).
- QA approves the release, the item's new status, the next review date and the reason for the interval (30, 35).
- **New:** The next review date offered follows the requalification frequency kept in master data (for example 12 months). A later date is refused. An earlier one is QA's choice, with a reason (30, 35).
- The approved report updates the item's status and next review date (36, 37, 39).

## Cleaning validation (new residue-limit calculator)
- **New:** The product matrix holds the products sharing the equipment train, picked from master data, with PDE, doses, batch sizes and the hardest-to-clean mark. The equipment's product-contact areas, swab area and recovery are entered alongside (46).
- **New:** Fixed, built-in MACO calculation (by PDE, by dose and by 10 ppm) for every product pair. The lowest result governs and is named, and the swab and rinse limits follow. The worst case is applied automatically to the residue steps (47).

## Media fill (new, aseptic process simulation)
- **New:** A media fill template for filling lines (48–50).
- **New:** "Operators taking part" are picked from the platform's list of active people (48).
- **New:** Units filled, incubated and removed are whole-number counts that the system checks. Every unit must be accounted for (49).
- **New:** QA sets the next media fill date, at the latest 6 months on, and a later date is refused. **TrueBatch Injectables** reads the result and this date before it allows an aseptic stage on that line (50).

## Links to other Medhanta products
- **New:** Medhanta LEAD (logbook) supplies instrument calibration due dates. EQUIP publishes each item's qualification status and next review date for LEAD (11, 45).
- **New:** TrueBatch Injectables reads the latest approved media fill of the line (50).
- **New:** Lab instruments are qualified as items, so Medhanta QLIMS can check that an instrument is qualified (51).
- **New:** Approved cleaning-validation limits are published for other Medhanta products to read (47).

## Periodic review and keeping qualified
- The periodic review template covers the period, changes, deviations, calibration and maintenance, small changes and the conclusion (42).
- QA sets "Requalification needed" with a reason (41).

## Dashboards and lists
- My work shows protocols to write, execute, report and approve, plus items overdue and due within 30 days (02, 05, 34).

## Traceability, records and inspection
- The traceability view links each URS requirement to the steps that test it and their results per run (38).
- The History tab shows every saved version with its reason and every signature, with superseded ones marked (15, 52).
- **New:** PDF per protocol with a "Medhanta EQUIP" header: approved content, results, discrepancies, report, signatures and history (53).
- The audit trail shows who, when, what, the values before and after, and the reason, and can be filtered by user and dates (54).
- **New:** Medhanta EQUIP branding everywhere: emblem logo on the sign-in page, top bar, browser tab and PDFs (all screens).

## Behind the scenes (not on screen)
- A nightly integrity check recomputes every signature and file hash and alerts on a mismatch.
- Times are stored in UTC and shown in plant time (IST).
- Daily backup with a restore check.
- Removed since the old pack: local users and passwords, the Users admin screen and the lockout security alert. The Medhanta platform now handles these.
