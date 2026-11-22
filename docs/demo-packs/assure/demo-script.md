# Demo script: Medhanta ASSURE (formerly "QMS")

Feature walkthrough, about 5 min 47 s. One working day for QA at the fictional **Medhanta Demo Plant, Unit 2**: a new SOP version goes live; a pharmacy complains about chipped **Chlorphenamine maleate 4 mg sugar-coated tablets (FG-CPM4), batch TB260010**, which leads to a CAPA, a risk assessment and a tooling change control; QA also runs a mock recall of **Ceftriaxone 1 g powder for injection (FG-CFX1), batch TI260019**, a self-inspection, a supplier approval, a product quality review filled from the platform and a management review.
Cast (all fictional): Asha Rao (QA Head), Kiran Desai (QA Officer), Dr. Meera Joshi (Plant Head, authorised person), Vikram Shah (Production), Neha Iyer (Engineering), Priya Nair (Documentation), Anil Kumar (Customer service), Sanjay Kulkarni (Purchase). Products are the current TrueBatch demo products (FG-CPM4 batches TB260009–TB260011, FG-CFX1 batches TI260019–TI260021); customers, suppliers, lots and all values are fictional demo data. DIVE deviation DEV-2026-0026 is the one from the Medhanta DIVE demo.

Name: always **"Medhanta ASSURE"** (said "meh-DHAAN-tah uh-SHOOR"), on every title card and every caption card. Other Medhanta products appear only as sources of data inside ASSURE's screens: Medhanta DIVE (deviations), TrueBatch Tablets and TrueBatch Injectables (batch records), Medhanta MMS (materials), Medhanta QLIMS (lab), Medhanta RISE (operations), Medhanta EQUIP (qualification).

Plain-word glossary for the voice-over: **SOP** – written procedure · **CAPA** – fix and prevent · **change control** – managed changes · **risk assessment** – score the risk · **mock recall** – practice recall · **self-inspection** – internal audit · **PQR** – yearly product review · **authorised person (AP)** – signs off recalls and reviews · **e-signature** – your password, asked again.

Screen positions are rough, on the 1920×1080 screenshot (the app was captured at 125 % zoom; content sits in a centred column, roughly x 190–1730; the menu bar, on two rows, is the top 125 px). Times in the app show as evening IST; the voice-over does not mention clock times. Every caption is shown on a caption card tagged "Medhanta ASSURE".

## Intro (≈ 14 s)

**Problem in one line:** Quality records on paper and spreadsheets mean lost signatures, missed due dates, retyped data and long hunts before an inspection.

**Intro title card:** Medhanta ASSURE emblem logo (brand/medhanta-assure-logo.png) · "Medhanta ASSURE" · subtitle "Quality Management System (QMS), signed and traceable" · small "by Medhanta" line · gradient underline.

**Voice-over:** "On paper, quality records mean lost signatures and missed due dates. Let's follow one QA day at our demo plant, in Medhanta ASSURE."

## Chapter 1: Welcome (≈ 10 s)

**Title card:** "Medhanta ASSURE · Welcome" · subtitle "One Medhanta sign-in for the whole suite"

### Step 1: `01-sign-in.png`
- **Highlight:** Centre: the Medhanta ASSURE emblem logo (shield) at the top; then the orange "Sign in" button below it (centre, y ≈ 425)
- **Voice-over:** "This is Medhanta ASSURE, quality management by Medhanta. Everyone signs in with their own Medhanta login."
- **Caption** (card tagged "Medhanta ASSURE"): One Medhanta sign-in

## Chapter 2: Start of the day (≈ 10 s)

**Title card:** "Medhanta ASSURE · Start of the day" · subtitle "What waits for me, what is overdue?"

### Step 2: `02-home-qa.png`
- **Highlight:** Top: the three tiles "6 Waiting for me", red "3 Overdue", "6 Open"; then the red "· overdue" dates in the Due column and the blue "you" chips
- **Voice-over:** "Asha Rao, our QA Head, starts on My work: what waits for her, overdue in red."
- **Caption** (card tagged "Medhanta ASSURE"): Your work, across every module

## Chapter 3: Document control (≈ 53 s)

**Title card:** "Medhanta ASSURE · Document control" · subtitle "SOP: written procedure, one version in force"

### Step 3: `03-doc-draft.png`
- **Highlight:** Top: title "DOC-2026-0007 · Handling of market complaints"; the Draft form: Document number "SOP-QA-012", Revision "04"
- **Voice-over:** "Priya Nair drafts revision 04 of the complaints SOP, our written procedure."
- **Caption** (card tagged "Medhanta ASSURE"): A new SOP version

### Step 4: `04-doc-sign-prepared.png`
- **Highlight:** Centre dialog "Sign: Prepared": the meaning, the legal text, the line "Sign opens a small window where you enter your password again", and the orange "Sign" button
- **Voice-over:** "She signs it Prepared. For every e-signature, Medhanta asks for her password again."
- **Caption** (card tagged "Medhanta ASSURE"): Every signature asks again

### Step 5: `05-doc-review.png`
- **Highlight:** The Review card: Reviewing department "Production", the comment, and the orange "Sign: Reviewed" button bottom-right
- **Voice-over:** "Vikram Shah from Production reviews it. The reviewer can't be the author."
- **Caption** (card tagged "Medhanta ASSURE"): Reviewed by someone else

### Step 6: `06-doc-approve-before.png`
- **Highlight:** Centre dialog "Sign: QA approved" and its orange "Sign" button; behind it the Effective date and Next periodic review fields
- **Voice-over:** "Asha approves it, with an effective date and the next review date."
- **Caption** (card tagged "Medhanta ASSURE"): QA approves, with dates

### Step 7: `07-doc-approve-after.png`
- **Highlight:** Top: the yellow bar "Current version."; right: the green "✔ Prepared · Priya Nair" on the Draft card
- **Voice-over:** "Revision 04 is now the version in force. TrueBatch reads that from here too."
- **Caption** (card tagged "Medhanta ASSURE"): Now the version in force

### Step 8: `08-doc-copy-before.png`
- **Highlight:** Card "Controlled copies": "Issued to / location: Complaint desk, QA office", the Reason, and the orange "Print controlled copy" button (right)
- **Voice-over:** "Need paper? QA prints a numbered controlled copy."
- **Caption** (card tagged "Medhanta ASSURE"): Paper copies, under control

### Step 9: `09-doc-copy-after.png`
- **Highlight:** Table "Copies issued of this document": the row "DOC-2026-0007 (rev. 04) · 1 · Complaint desk, QA office · Asha Rao"
- **Voice-over:** "Each copy is logged: number, holder, reason, who and when."
- **Caption** (card tagged "Medhanta ASSURE"): Every copy logged

### Step 10: `10-documents-current.png`
- **Highlight:** Tab "Current" (top-left, orange); the "Next due" table with the red "25 Oct 2026 · overdue" for SPEC-FG-CPM4 and "20 Nov 2026 · overdue" for SOP-QA-005
- **Voice-over:** "The Current tab lists each document's version in force; overdue reviews in red."
- **Caption** (card tagged "Medhanta ASSURE"): Periodic reviews tracked

### Step 11: `11-doc-superseded.png`
- **Highlight:** Top: the red banner "SUPERSEDED – do not use. A newer version is current…" under "DOC-2026-0001 · Handling of market complaints" (revision 03)
- **Voice-over:** "The old revision is clearly marked: superseded, do not use."
- **Caption** (card tagged "Medhanta ASSURE"): Old versions clearly marked

## Chapter 4: Market complaints (≈ 33 s)

**Title card:** "Medhanta ASSURE · Market complaints" · subtitle "From the pharmacy's call to QA's assessment"

### Step 12: `12-complaint-new.png`
- **Highlight:** The new complaint form: Nature "Cracked sugar coating and chipped tablets…", Product picked from the list "Chlorphenamine maleate 4 mg sugar-coated tablets (FG-CPM4)", Lot "TB260010"
- **Voice-over:** "Anil Kumar records a complaint: chipped tablets in batch TB260010. The product is picked, not typed."
- **Caption** (card tagged "Medhanta ASSURE"): Product picked, not typed

### Step 13: `13-complaint-sent.png`
- **Highlight:** Top: status "Waiting for QA assessment" and the due date; the green "✔ Submitted · Anil Kumar" on the card
- **Voice-over:** "He sends it to QA, with an assessment due date."
- **Caption** (card tagged "Medhanta ASSURE"): Sent to QA, with a due date

### Step 14: `14-complaint-assess-before.png`
- **Highlight:** The QA assessment questions with Yes / No and details: "Investigation needed? Yes – … DIVE deviation DEV-2026-0026", "Recall needed? No"; bottom-right the orange "Sign: Assessed" button
- **Voice-over:** "Asha answers fixed questions: defect, investigation, other batches, recall."
- **Caption** (card tagged "Medhanta ASSURE"): Fixed questions, nothing missed

### Step 15: `15-complaint-assess-after.png`
- **Highlight:** Top-right of the card: the green "✔ Assessed · Asha Rao"; below, the Closure card now open
- **Voice-over:** "Her assessment is signed; closure opens with its own due date."
- **Caption** (card tagged "Medhanta ASSURE"): Assessed and signed

### Step 16: `16-complaint-dive-link.png`
- **Highlight:** Card "Linked in DIVE (read-only)" near the top: "DEV-2026-0026 Core hardness below limit on PRESS-01 · under investigation · major · FG-CPM4 · batch TB260011"
- **Voice-over:** "She named a deviation, so it shows live from Medhanta DIVE, our deviation system."
- **Caption** (card tagged "Medhanta ASSURE"): Live link to Medhanta DIVE

## Chapter 5: CAPA (≈ 33 s)

**Title card:** "Medhanta ASSURE · CAPA" · subtitle "Corrective and preventive action"

### Step 17: `17-capa-plan.png`
- **Highlight:** Top: "QCAPA-2026-0002 · Chipped sugar-coated tablets – compression tooling wear on PRESS-01"; Source "Complaint", Source reference "MC-2026-0003"; the "Linked in DIVE" card above
- **Voice-over:** "Vikram raises a CAPA, our fix-and-prevent plan, from the complaint."
- **Caption** (card tagged "Medhanta ASSURE"): CAPA from the complaint

### Step 18: `18-capa-root-cause.png`
- **Highlight:** Root cause analysis method "5 Why"; the Root cause text "Upper punches of tooling set TS-07 worn…"; the ticked categories "Machine (equipment)" and "Method (procedure)"
- **Voice-over:** "Root cause: worn punches gave soft cores that cracked in the coating."
- **Caption** (card tagged "Medhanta ASSURE"): Root cause, in plain words

### Step 19: `19-capa-approve-before.png`
- **Highlight:** Centre dialog "Sign: Plan approved" and the orange "Sign" button
- **Voice-over:** "Actions have owners and due dates. Asha approves the plan."
- **Caption** (card tagged "Medhanta ASSURE"): QA approves the plan

### Step 20: `20-capa-approve-after.png`
- **Highlight:** The green "✔ Plan approved · Asha Rao" on the QA approval card; below, the open Implementation card
- **Voice-over:** "Approved: implementation can start."
- **Caption** (card tagged "Medhanta ASSURE"): Approved, now implemented

### Step 21: `21-capas-dive.png`
- **Highlight:** Section "CAPAs in DIVE (read-only)": CAPA-2026-0016 from DEV-2026-0026 and the small "Start a QMS CAPA" button (right)
- **Voice-over:** "CAPAs raised in DIVE show here too, with a button to start one in ASSURE."
- **Caption** (card tagged "Medhanta ASSURE"): DIVE CAPAs, side by side

### Step 22: `22-capa-from-dive.png`
- **Highlight:** The New CAPA form: Source "Deviation", Source reference "DEV-2026-0026 · Core hardness below limit on PRESS-01" picked, Title and Product filled in
- **Voice-over:** "A link from DIVE opens a new CAPA with the deviation already picked."
- **Caption** (card tagged "Medhanta ASSURE"): Started from a deviation

## Chapter 6: Quality risk management (≈ 20 s)

**Title card:** "Medhanta ASSURE · Quality risk management" · subtitle "Score the risk before the change"

### Step 23: `23-risk-fmea.png`
- **Highlight:** Risk assessment RA-2026-0002, method "FMEA", Deviation "DEV-2026-0026", QMS CAPA "QCAPA-2026-0002"; the Risks table with S, O, D and the bold Scores 36, 18, 16
- **Voice-over:** "Neha Iyer scores the tooling risk on fixed scales; the software works out each score."
- **Caption** (card tagged "Medhanta ASSURE"): Risk scored, not guessed

### Step 24: `24-risk-residual.png`
- **Highlight:** The right part of the Risks table: Action, Owner, Due, and the Residual score column "8", "6", "4"
- **Voice-over:** "Each risk gets an action and a residual score for QA to accept."
- **Caption** (card tagged "Medhanta ASSURE"): Residual risk after actions

### Step 25: `25-risk-register.png`
- **Highlight:** The risk register list: column "Highest residual score" (18, 8) and the "Next due" table of periodic reviews
- **Voice-over:** "Together they form the risk register, highest risk first."
- **Caption** (card tagged "Medhanta ASSURE"): The risk register

## Chapter 7: Change control (≈ 49 s)

**Title card:** "Medhanta ASSURE · Change control" · subtitle "Managed changes, approved in order"

### Step 26: `26-change-new.png`
- **Highlight:** Fieldset "Products affected": the ticked "Chlorphenamine maleate 4 mg sugar-coated tablets (FG-CPM4)" and the "Not product-specific" tick above it; "Equipment" ticked above
- **Voice-over:** "Neha raises a change control, a managed change, for new tooling. Products are ticked, with their codes."
- **Caption** (card tagged "Medhanta ASSURE"): Products picked, with their codes

### Step 27: `27-change-impact.png`
- **Highlight:** The "Risk assessment" field showing "RA-2026-0002 · Compression tooling wear on PRESS-01 (FG-CPM4) · Closed"; below, the Actions table with owner and due date
- **Voice-over:** "It links the approved risk assessment; actions get owners and dates."
- **Caption** (card tagged "Medhanta ASSURE"): Risk assessment picked

### Step 28: `28-change-qa-before.png`
- **Highlight:** Centre dialog "Sign: QA approved" and the orange "Sign" button
- **Voice-over:** "Production approves first, then Asha gives the QA approval."
- **Caption** (card tagged "Medhanta ASSURE"): Department, then QA

### Step 29: `29-change-qa-after.png`
- **Highlight:** The two green signatures "✔ Department approved · Vikram Shah" and "✔ QA approved · Asha Rao"; below, the open Implementation card
- **Voice-over:** "Both signatures are on record; TrueBatch now sees the change as approved."
- **Caption** (card tagged "Medhanta ASSURE"): Approved, now implemented

### Step 30: `30-change-correct.png`
- **Highlight:** Bottom of the Proposal form: the field "Reason for the correction" (orange outline) with "SOP-PRD-014 also to be revised…" and the note "When later steps are already signed, they keep their signatures…"
- **Voice-over:** "Later, Neha adds one more SOP to revise, with the reason typed in the form."
- **Caption** (card tagged "Medhanta ASSURE"): Corrections need a reason

### Step 31: `31-change-correction-waiting.png`
- **Highlight:** Top: Status "Correction of Proposal waiting for QA approval"; the yellow note "Corrected (version 2). Waiting for QA to approve the correction: one signature. The later steps keep their signatures."
- **Voice-over:** "The earlier approvals stay. QA approves just the correction."
- **Caption** (card tagged "Medhanta ASSURE"): One QA signature, no restart

### Step 32: `32-change-correction-approved.png`
- **Highlight:** Top: Status "Being implemented"; under Proposal the line "Correction (version 2) approved by Asha Rao"
- **Voice-over:** "One signature, and the change is back on track."
- **Caption** (card tagged "Medhanta ASSURE"): Back on track

### Step 33: `33-changes-list.png`
- **Highlight:** The Changes list: CC-2026-0003 with product "Chlorphenamine maleate 4 mg sugar-coated tablets", "Being implemented" and its due date; CC-2026-0001 "Closed"
- **Voice-over:** "Every change, from proposal to closure, in one list."
- **Caption** (card tagged "Medhanta ASSURE"): All changes, all stages

## Chapter 8: Mock recall (≈ 24 s)

**Title card:** "Medhanta ASSURE · Mock recall" · subtitle "Practice recall, timed and reconciled"

### Step 34: `34-recall-initiate.png`
- **Highlight:** Centre dialog "Sign: Recall initiated" and the orange "Sign" button
- **Voice-over:** "Dr. Meera Joshi, the authorised person, starts a mock recall, a practice run, of batch TI260019."
- **Caption** (card tagged "Medhanta ASSURE"): Only the AP starts a recall

### Step 35: `35-recall-progress.png`
- **Highlight:** The Progress card: "mock recall", and the table of dated entries with batch TI260019 and quantities recovered 14400 and 9850
- **Voice-over:** "QA logs each call and the stock traced."
- **Caption** (card tagged "Medhanta ASSURE"): Progress, step by step

### Step 36: `36-recall-closed.png`
- **Highlight:** Final report card: the Reconciliation text and "All stock traced within 4 hours…"; top-right the green "✔ Closed · Asha Rao"
- **Voice-over:** "The final report reconciles the quantities. Asha closes it."
- **Caption** (card tagged "Medhanta ASSURE"): Reconcile, evaluate, close

### Step 37: `37-recalls-list.png`
- **Highlight:** The line "Last mock recall closed: 22 Nov 2026" above the table; the RC-2026-0001 row
- **Voice-over:** "The list shows when the last mock recall was closed."
- **Caption** (card tagged "Medhanta ASSURE"): When was it last tested?

## Chapter 9: Self-inspection (≈ 14 s)

**Title card:** "Medhanta ASSURE · Self-inspection" · subtitle "Self-inspection: internal audit"

### Step 38: `38-audit-report.png`
- **Highlight:** The Findings table (three rows: finding, area, recommended action); top-right the green "✔ Report issued · Kiran Desai"
- **Voice-over:** "Kiran Desai writes up the self-inspection, our internal audit: three findings, three actions."
- **Caption** (card tagged "Medhanta ASSURE"): Findings in a table

### Step 39: `39-audit-correction.png`
- **Highlight:** History table: the row "Report saved (version 2)" with the reason "Finding 1: area corrected from Packing to Equipment"; the two "Signed: Report issued" rows
- **Voice-over:** "Corrections keep the old version and the reason, and are signed again."
- **Caption** (card tagged "Medhanta ASSURE"): Corrections need a reason

## Chapter 10: Supplier quality (≈ 12 s)

**Title card:** "Medhanta ASSURE · Supplier quality" · subtitle "Approved suppliers only"

### Step 40: `40-supplier-approve-before.png`
- **Highlight:** The Approval card: Comment, the field "Conditions of approval (leave empty for a full approval)" with "Full incoming testing of the first 3 lots…"; bottom-right the grey "Rejected" and orange "Sign: Approved" buttons
- **Voice-over:** "Asha approves a new blister-foil supplier, with conditions."
- **Caption** (card tagged "Medhanta ASSURE"): Approval, with conditions

### Step 41: `41-suppliers-approved-list.png`
- **Highlight:** The "Next due" table of the Approved list with the red "20 Oct 2026 · overdue" re-evaluation; the row "Polypack Films, Daman – Aluminium blister foil" with the green "current" chip
- **Voice-over:** "It joins the approved supplier list, which QLIMS reads. Re-evaluations are tracked."
- **Caption** (card tagged "Medhanta ASSURE"): The approved supplier list

## Chapter 11: Product quality review (≈ 28 s)

**Title card:** "Medhanta ASSURE · Product quality review" · subtitle "PQR: yearly product review, filled from the platform"

### Step 42: `42-pqr-fill-before.png`
- **Highlight:** Bottom of the Review form: the button "Fill from the platform" (centre-right, next to "Save")
- **Voice-over:** "Kiran starts the yearly product review. One click gathers the facts."
- **Caption** (card tagged "Medhanta ASSURE"): One click to gather the data

### Step 43: `43-pqr-fill-after.png`
- **Highlight:** The item "Representative batches…" filled: "TrueBatch Tablets … 3 batches made in the period; 2 released… TB260009, TB260010" and the TrueBatch Tablets Packing line; the small "Refill this item" link
- **Voice-over:** "Batches come from TrueBatch, materials from MMS, deviations from DIVE."
- **Caption** (card tagged "Medhanta ASSURE"): Batches from TrueBatch

### Step 44: `44-pqr-fill-ipc.png`
- **Highlight:** The item "Critical in-process controls…": the QLIMS results lines and "CPV report 12" from RISE with "Core hardness: stable no…"
- **Voice-over:** "Test results come from QLIMS, process trends from RISE. Kiran adds the conclusion."
- **Caption** (card tagged "Medhanta ASSURE"): Results from QLIMS and RISE

### Step 45: `45-pqr-ap-reviewed.png`
- **Highlight:** Card "Authorised person review": the comment and the green "✔ AP reviewed · Dr. Meera Joshi"
- **Voice-over:** "Dr. Meera Joshi reviews and signs it."
- **Caption** (card tagged "Medhanta ASSURE"): Signed by the authorised person

### Step 46: `46-pqr-list.png`
- **Highlight:** The "Next due" table: "Ceftriaxone 1 g powder for injection 31 Oct 2027" and "Chlorphenamine maleate 4 mg sugar-coated tablets 30 Nov 2027"
- **Voice-over:** "The next review date of each product is tracked."
- **Caption** (card tagged "Medhanta ASSURE"): Next review, per product

## Chapter 12: Management review (≈ 7 s)

**Title card:** "Medhanta ASSURE · Management review" · subtitle "Leadership reviews the system"

### Step 47: `47-mgmt-review.png`
- **Highlight:** The "What was reviewed" and "Improvement opportunities and decisions" fields; the Actions table with owners and due dates; "Next review due"
- **Voice-over:** "Management records its review, decisions, actions and the next date."
- **Caption** (card tagged "Medhanta ASSURE"): Decisions and actions

## Chapter 13: Ready for inspection (≈ 26 s)

**Title card:** "Medhanta ASSURE · Ready for inspection" · subtitle "Signed, traceable, on record"

### Step 48: `48-record-pdf.png`
- **Highlight:** The left PDF page: the header with the ASSURE shield "Medhanta ASSURE · Quality system · Change CC-2026-0003", "Proposal · version 1 (superseded)"; right page: the signature lines
- **Voice-over:** "Every record prints as one PDF, with every version and signature."
- **Caption** (card tagged "Medhanta ASSURE"): One PDF per record

### Step 49: `49-controlled-copy-pdf.png`
- **Highlight:** Left page, top: the red line "Controlled copy No. 2, issued to Production office, compression…" under the ASSURE header
- **Voice-over:** "A controlled copy carries its number on every page."
- **Caption** (card tagged "Medhanta ASSURE"): Controlled copies, numbered

### Step 50: `50-audit-trail.png`
- **Highlight:** Top: green bar "Integrity check: passed" and the "Run now" button; the filter "meera.joshi"; the When / Who / What / Before / After columns; "Logged in" rows with her permissions from Medhanta
- **Voice-over:** "QA sees the full audit trail. A nightly check confirms no signed record changed."
- **Caption** (card tagged "Medhanta ASSURE"): Who did what, and when

### Step 51: `51-audit-trail-correction.png`
- **Highlight:** Row "Step corrected": Before shows "area":"Packing", After shows "area":"Equipment"; the Reason column on the right
- **Voice-over:** "Here is that correction: old value, new value, and the reason."
- **Caption** (card tagged "Medhanta ASSURE"): Before, after and why

## Outro (≈ 10 s)

**Voice-over:** "Medhanta ASSURE: clear steps, e-signatures and a full audit trail, linked to the whole Medhanta suite. Book a demo."

**End card (≈ 4 s):** Medhanta ASSURE emblem logo centred · "Medhanta ASSURE" · "Quality Management System (QMS), signed and traceable" · small "by Medhanta" line with the Medhanta logo · button-style "Book a demo" · gradient bar.

## Timing

| Part | Screens | Duration |
|---|---|---|
| Intro | title card | ≈ 14 s |
| Ch 1: Welcome | 01–01 | ≈ 10 s |
| Ch 2: Start of the day | 02–02 | ≈ 10 s |
| Ch 3: Document control | 03–11 | ≈ 53 s |
| Ch 4: Market complaints | 12–16 | ≈ 33 s |
| Ch 5: CAPA | 17–22 | ≈ 33 s |
| Ch 6: Quality risk management | 23–25 | ≈ 20 s |
| Ch 7: Change control | 26–33 | ≈ 49 s |
| Ch 8: Mock recall | 34–37 | ≈ 24 s |
| Ch 9: Self-inspection | 38–39 | ≈ 14 s |
| Ch 10: Supplier quality | 40–41 | ≈ 12 s |
| Ch 11: Product quality review | 42–46 | ≈ 28 s |
| Ch 12: Management review | 47–47 | ≈ 7 s |
| Ch 13: Ready for inspection | 48–51 | ≈ 26 s |
| Outro + end card | — | ≈ 14 s |
| **Total** | 51 screens | **≈ 5 min 47 s** |
