# Claude Design prompt: Medhanta ASSURE feature walkthrough

Paste this whole file into Claude Design. Attach the files in the order given in files-to-attach.md.

## The video
- Make a **calm, step-by-step tutorial video** (not an ad) for **Medhanta ASSURE** (Quality Management System; formerly "QMS" / "Quality system"), by Medhanta: document control (SOPs) with controlled copies, market complaints, CAPA, quality risk management, change control, recalls and mock recalls, self-inspections and supplier audits, supplier approval, product quality reviews filled from the platform, and management reviews, with e-signatures, due dates and an audit trail.
- Audience: plant heads, QA, production and engineering users, and buyers. Plain language; explain each GMP term in about three words (SOP – written procedure; CAPA – fix and prevent; change control – managed changes; risk assessment – score the risk; mock recall – practice recall; self-inspection – internal audit; PQR – yearly product review; authorised person – signs off recalls and reviews).
- Format: **16:9, 1920×1080**. Target length **3–6 minutes** (plan ≈ 5 min 47 s).
- Story: one working day for QA at the fictional "Medhanta Demo Plant, Unit 2". A new SOP version goes live; a pharmacy complains about chipped **Chlorphenamine maleate 4 mg sugar-coated tablets (FG-CPM4), batch TB260010**, which leads to a CAPA, a risk assessment and a tooling change control (linked to DIVE deviation DEV-2026-0026 on batch TB260011); QA also runs a mock recall of **Ceftriaxone 1 g powder for injection (FG-CFX1), batch TI260019**, a self-inspection, a supplier approval, a product quality review filled from TrueBatch, MMS, DIVE, QLIMS and RISE, and a management review. All people, customers, suppliers, lots and values are fictional demo data.
- Name the product **"Medhanta ASSURE"** everywhere: every title card, every caption card, the intro and the end card. Never call it "QMS" or "Quality system" on a card (the PDF headers in screens 48–49 say "Quality system" as the record type; leave them as they are).

## How to use the screenshots
- Use the **attached real screenshots (01–51) in numeric order**, one step each, full frame.
- **Do not redraw, restyle, crop away or alter the UI** in the screenshots. Only add overlays on top.
- For each step: a **gentle zoom (about 1.1–1.4×)** towards the highlighted element, a **highlight** (soft rounded rectangle or circle in Medhanta orange #e8500f), and an **animated cursor** that moves to the highlighted element (and "clicks" on buttons).
- The app content sits in a centred column (x ≈ 190–1730); zoom into it so small text is readable.
- Use **cross-fades** between consecutive screens of the same flow, especially before → after pairs: 03→04, 05→06→07, 08→09, 10→11, 12→13, 14→15→16, 17→18, 19→20, 21→22, 23→24, 26→27, 28→29, 30→31→32, 34→35→36, 38→39, 40→41, 42→43→44→45, 48→49, 50→51.
- Screens with a centred dialog (04, 06, 19, 28, 34) show an e-signature being given: zoom gently onto the dialog.
- Screens 48–49 are PDF printouts (two pages on a dark grey background): zoom slowly into the header of the left page, then the named lines.
- **Captions on**: show the short caption for each step in the lower third: a white card, Inter, dark text #2b2b2b, a thin gradient line above, and a small **"Medhanta ASSURE"** tag (with the small shield emblem) at the left of every caption card.
- Voice-over: calm, friendly, clear tutorial tone; use the voice-over lines below as written. Do not read out clock times shown in the screenshots. Apply the pronunciation rules at the end of this prompt.

## Brand
- **Product logo:** use the product emblem logo for Medhanta ASSURE, **brand/medhanta-assure-logo.png** (attached, 900 px wide), as THE logo on the intro title card, on every chapter title card and on the end card. Use **brand/medhanta-assure-apple-touch-icon.png** (the shield emblem alone, 180 px) as a small corner watermark during the walkthrough and as the tag icon on the caption cards. (Use the product emblem logo for Medhanta ASSURE if attached; otherwise the Medhanta logo.)
- **Maker:** **brand/medhanta-logo.png** is the maker's logo; use it only small, in a "by Medhanta" line under the product name on the intro and end cards.
- Primary orange **#e8500f**; gradient **`linear-gradient(90deg,#dd1a10,#f4511e 55%,#f7941d)`** for thin accent bars, title-card underlines and the progress bar; grey **#5f5f5f** for secondary text; background #faf8f6; body text #2b2b2b.
- Font **Inter** (fallback Segoe UI, system-ui). See brand/brand.md for details. The screenshots already show the current Medhanta ASSURE branding in the app's top bar, on the sign-in page and in the PDF headers; keep them as they are.

## Rules
- **No invented numbers** (no savings, percentages, customer counts or time savings), **no testimonials**, no claims beyond what the screens show. Values on the screens are fictional demo data; do not quote them as results.
- Do not add features that are not on the screenshots. Do not redraw or alter the UI in the screenshots.
- Medhanta DIVE, TrueBatch Tablets, TrueBatch Injectables, Medhanta MMS, Medhanta QLIMS, Medhanta RISE and Medhanta EQUIP appear only as sources of data inside ASSURE's screens; do not draw their own screens.

## Structure
- **Intro title card:** Medhanta ASSURE emblem logo · "Medhanta ASSURE" · "Quality Management System (QMS), signed and traceable" · small "by Medhanta" line · ≈ 14 s. Voice-over: "On paper, quality records mean lost signatures and missed due dates. Let's follow one QA day at our demo plant, in Medhanta ASSURE."
- **Chapter 1 title card: "Medhanta ASSURE · Welcome"** · "One Medhanta sign-in for the whole suite" · ≈ 10 s · screens 01–01
- **Chapter 2 title card: "Medhanta ASSURE · Start of the day"** · "What waits for me, what is overdue?" · ≈ 10 s · screens 02–02
- **Chapter 3 title card: "Medhanta ASSURE · Document control"** · "SOP: written procedure, one version in force" · ≈ 53 s · screens 03–11
- **Chapter 4 title card: "Medhanta ASSURE · Market complaints"** · "From the pharmacy's call to QA's assessment" · ≈ 33 s · screens 12–16
- **Chapter 5 title card: "Medhanta ASSURE · CAPA"** · "Corrective and preventive action" · ≈ 33 s · screens 17–22
- **Chapter 6 title card: "Medhanta ASSURE · Quality risk management"** · "Score the risk before the change" · ≈ 20 s · screens 23–25
- **Chapter 7 title card: "Medhanta ASSURE · Change control"** · "Managed changes, approved in order" · ≈ 49 s · screens 26–33
- **Chapter 8 title card: "Medhanta ASSURE · Mock recall"** · "Practice recall, timed and reconciled" · ≈ 24 s · screens 34–37
- **Chapter 9 title card: "Medhanta ASSURE · Self-inspection"** · "Self-inspection: internal audit" · ≈ 14 s · screens 38–39
- **Chapter 10 title card: "Medhanta ASSURE · Supplier quality"** · "Approved suppliers only" · ≈ 12 s · screens 40–41
- **Chapter 11 title card: "Medhanta ASSURE · Product quality review"** · "PQR: yearly product review, filled from the platform" · ≈ 28 s · screens 42–46
- **Chapter 12 title card: "Medhanta ASSURE · Management review"** · "Leadership reviews the system" · ≈ 7 s · screens 47–47
- **Chapter 13 title card: "Medhanta ASSURE · Ready for inspection"** · "Signed, traceable, on record" · ≈ 26 s · screens 48–51
- Each chapter title card: the ASSURE emblem small at the top, the kicker "Medhanta ASSURE", the chapter title large, the subtitle, gradient underline. About 2 s each (included in the chapter durations).
- **Outro:** voice-over "Medhanta ASSURE: clear steps, e-signatures and a full audit trail, linked to the whole Medhanta suite. Book a demo."
- **End card:** Medhanta ASSURE emblem logo centred, "Medhanta ASSURE", "Quality Management System (QMS), signed and traceable", small "by Medhanta" line with the Medhanta logo, button-style text **"Book a demo"**, gradient bar. Hold 4 s.

## Per-step script (follow demo-script.md attached; this table is the same content)

Every caption below is shown on a caption card tagged "Medhanta ASSURE".

| # | Screenshot | Highlight (where) | Caption | Voice-over |
|---|---|---|---|---|
| | **Ch 1: Welcome** | title card: "Medhanta ASSURE · Welcome" · "One Medhanta sign-in for the whole suite" | Medhanta ASSURE · Welcome | |
| 1 | 01-sign-in.png | Centre: the Medhanta ASSURE emblem logo (shield) at the top; then the orange "Sign in" button below it (centre, y ≈ 425) | One Medhanta sign-in | This is Medhanta ASSURE, quality management by Medhanta. Everyone signs in with their own Medhanta login. |
| | **Ch 2: Start of the day** | title card: "Medhanta ASSURE · Start of the day" · "What waits for me, what is overdue?" | Medhanta ASSURE · Start of the day | |
| 2 | 02-home-qa.png | Top: the three tiles "6 Waiting for me", red "3 Overdue", "6 Open"; then the red "· overdue" dates in the Due column and the blue "you" chips | Your work, across every module | Asha Rao, our QA Head, starts on My work: what waits for her, overdue in red. |
| | **Ch 3: Document control** | title card: "Medhanta ASSURE · Document control" · "SOP: written procedure, one version in force" | Medhanta ASSURE · Document control | |
| 3 | 03-doc-draft.png | Top: title "DOC-2026-0007 · Handling of market complaints"; the Draft form: Document number "SOP-QA-012", Revision "04" | A new SOP version | Priya Nair drafts revision 04 of the complaints SOP, our written procedure. |
| 4 | 04-doc-sign-prepared.png | Centre dialog "Sign: Prepared": the meaning, the legal text, the line "Sign opens a small window where you enter your password again", and the orange "Sign" button | Every signature asks again | She signs it Prepared. For every e-signature, Medhanta asks for her password again. |
| 5 | 05-doc-review.png | The Review card: Reviewing department "Production", the comment, and the orange "Sign: Reviewed" button bottom-right | Reviewed by someone else | Vikram Shah from Production reviews it. The reviewer can't be the author. |
| 6 | 06-doc-approve-before.png | Centre dialog "Sign: QA approved" and its orange "Sign" button; behind it the Effective date and Next periodic review fields | QA approves, with dates | Asha approves it, with an effective date and the next review date. |
| 7 | 07-doc-approve-after.png | Top: the yellow bar "Current version."; right: the green "✔ Prepared · Priya Nair" on the Draft card | Now the version in force | Revision 04 is now the version in force. TrueBatch reads that from here too. |
| 8 | 08-doc-copy-before.png | Card "Controlled copies": "Issued to / location: Complaint desk, QA office", the Reason, and the orange "Print controlled copy" button (right) | Paper copies, under control | Need paper? QA prints a numbered controlled copy. |
| 9 | 09-doc-copy-after.png | Table "Copies issued of this document": the row "DOC-2026-0007 (rev. 04) · 1 · Complaint desk, QA office · Asha Rao" | Every copy logged | Each copy is logged: number, holder, reason, who and when. |
| 10 | 10-documents-current.png | Tab "Current" (top-left, orange); the "Next due" table with the red "25 Oct 2026 · overdue" for SPEC-FG-CPM4 and "20 Nov 2026 · overdue" for SOP-QA-005 | Periodic reviews tracked | The Current tab lists each document's version in force; overdue reviews in red. |
| 11 | 11-doc-superseded.png | Top: the red banner "SUPERSEDED – do not use. A newer version is current…" under "DOC-2026-0001 · Handling of market complaints" (revision 03) | Old versions clearly marked | The old revision is clearly marked: superseded, do not use. |
| | **Ch 4: Market complaints** | title card: "Medhanta ASSURE · Market complaints" · "From the pharmacy's call to QA's assessment" | Medhanta ASSURE · Market complaints | |
| 12 | 12-complaint-new.png | The new complaint form: Nature "Cracked sugar coating and chipped tablets…", Product picked from the list "Chlorphenamine maleate 4 mg sugar-coated tablets (FG-CPM4)", Lot "TB260010" | Product picked, not typed | Anil Kumar records a complaint: chipped tablets in batch TB260010. The product is picked, not typed. |
| 13 | 13-complaint-sent.png | Top: status "Waiting for QA assessment" and the due date; the green "✔ Submitted · Anil Kumar" on the card | Sent to QA, with a due date | He sends it to QA, with an assessment due date. |
| 14 | 14-complaint-assess-before.png | The QA assessment questions with Yes / No and details: "Investigation needed? Yes – … DIVE deviation DEV-2026-0026", "Recall needed? No"; bottom-right the orange "Sign: Assessed" button | Fixed questions, nothing missed | Asha answers fixed questions: defect, investigation, other batches, recall. |
| 15 | 15-complaint-assess-after.png | Top-right of the card: the green "✔ Assessed · Asha Rao"; below, the Closure card now open | Assessed and signed | Her assessment is signed; closure opens with its own due date. |
| 16 | 16-complaint-dive-link.png | Card "Linked in DIVE (read-only)" near the top: "DEV-2026-0026 Core hardness below limit on PRESS-01 · under investigation · major · FG-CPM4 · batch TB260011" | Live link to Medhanta DIVE | She named a deviation, so it shows live from Medhanta DIVE, our deviation system. |
| | **Ch 5: CAPA** | title card: "Medhanta ASSURE · CAPA" · "Corrective and preventive action" | Medhanta ASSURE · CAPA | |
| 17 | 17-capa-plan.png | Top: "QCAPA-2026-0002 · Chipped sugar-coated tablets – compression tooling wear on PRESS-01"; Source "Complaint", Source reference "MC-2026-0003"; the "Linked in DIVE" card above | CAPA from the complaint | Vikram raises a CAPA, our fix-and-prevent plan, from the complaint. |
| 18 | 18-capa-root-cause.png | Root cause analysis method "5 Why"; the Root cause text "Upper punches of tooling set TS-07 worn…"; the ticked categories "Machine (equipment)" and "Method (procedure)" | Root cause, in plain words | Root cause: worn punches gave soft cores that cracked in the coating. |
| 19 | 19-capa-approve-before.png | Centre dialog "Sign: Plan approved" and the orange "Sign" button | QA approves the plan | Actions have owners and due dates. Asha approves the plan. |
| 20 | 20-capa-approve-after.png | The green "✔ Plan approved · Asha Rao" on the QA approval card; below, the open Implementation card | Approved, now implemented | Approved: implementation can start. |
| 21 | 21-capas-dive.png | Section "CAPAs in DIVE (read-only)": CAPA-2026-0016 from DEV-2026-0026 and the small "Start a QMS CAPA" button (right) | DIVE CAPAs, side by side | CAPAs raised in DIVE show here too, with a button to start one in ASSURE. |
| 22 | 22-capa-from-dive.png | The New CAPA form: Source "Deviation", Source reference "DEV-2026-0026 · Core hardness below limit on PRESS-01" picked, Title and Product filled in | Started from a deviation | A link from DIVE opens a new CAPA with the deviation already picked. |
| | **Ch 6: Quality risk management** | title card: "Medhanta ASSURE · Quality risk management" · "Score the risk before the change" | Medhanta ASSURE · Quality risk management | |
| 23 | 23-risk-fmea.png | Risk assessment RA-2026-0002, method "FMEA", Deviation "DEV-2026-0026", QMS CAPA "QCAPA-2026-0002"; the Risks table with S, O, D and the bold Scores 36, 18, 16 | Risk scored, not guessed | Neha Iyer scores the tooling risk on fixed scales; the software works out each score. |
| 24 | 24-risk-residual.png | The right part of the Risks table: Action, Owner, Due, and the Residual score column "8", "6", "4" | Residual risk after actions | Each risk gets an action and a residual score for QA to accept. |
| 25 | 25-risk-register.png | The risk register list: column "Highest residual score" (18, 8) and the "Next due" table of periodic reviews | The risk register | Together they form the risk register, highest risk first. |
| | **Ch 7: Change control** | title card: "Medhanta ASSURE · Change control" · "Managed changes, approved in order" | Medhanta ASSURE · Change control | |
| 26 | 26-change-new.png | Fieldset "Products affected": the ticked "Chlorphenamine maleate 4 mg sugar-coated tablets (FG-CPM4)" and the "Not product-specific" tick above it; "Equipment" ticked above | Products picked, with their codes | Neha raises a change control, a managed change, for new tooling. Products are ticked, with their codes. |
| 27 | 27-change-impact.png | The "Risk assessment" field showing "RA-2026-0002 · Compression tooling wear on PRESS-01 (FG-CPM4) · Closed"; below, the Actions table with owner and due date | Risk assessment picked | It links the approved risk assessment; actions get owners and dates. |
| 28 | 28-change-qa-before.png | Centre dialog "Sign: QA approved" and the orange "Sign" button | Department, then QA | Production approves first, then Asha gives the QA approval. |
| 29 | 29-change-qa-after.png | The two green signatures "✔ Department approved · Vikram Shah" and "✔ QA approved · Asha Rao"; below, the open Implementation card | Approved, now implemented | Both signatures are on record; TrueBatch now sees the change as approved. |
| 30 | 30-change-correct.png | Bottom of the Proposal form: the field "Reason for the correction" (orange outline) with "SOP-PRD-014 also to be revised…" and the note "When later steps are already signed, they keep their signatures…" | Corrections need a reason | Later, Neha adds one more SOP to revise, with the reason typed in the form. |
| 31 | 31-change-correction-waiting.png | Top: Status "Correction of Proposal waiting for QA approval"; the yellow note "Corrected (version 2). Waiting for QA to approve the correction: one signature. The later steps keep their signatures." | One QA signature, no restart | The earlier approvals stay. QA approves just the correction. |
| 32 | 32-change-correction-approved.png | Top: Status "Being implemented"; under Proposal the line "Correction (version 2) approved by Asha Rao" | Back on track | One signature, and the change is back on track. |
| 33 | 33-changes-list.png | The Changes list: CC-2026-0003 with product "Chlorphenamine maleate 4 mg sugar-coated tablets", "Being implemented" and its due date; CC-2026-0001 "Closed" | All changes, all stages | Every change, from proposal to closure, in one list. |
| | **Ch 8: Mock recall** | title card: "Medhanta ASSURE · Mock recall" · "Practice recall, timed and reconciled" | Medhanta ASSURE · Mock recall | |
| 34 | 34-recall-initiate.png | Centre dialog "Sign: Recall initiated" and the orange "Sign" button | Only the AP starts a recall | Dr. Meera Joshi, the authorised person, starts a mock recall, a practice run, of batch TI260019. |
| 35 | 35-recall-progress.png | The Progress card: "mock recall", and the table of dated entries with batch TI260019 and quantities recovered 14400 and 9850 | Progress, step by step | QA logs each call and the stock traced. |
| 36 | 36-recall-closed.png | Final report card: the Reconciliation text and "All stock traced within 4 hours…"; top-right the green "✔ Closed · Asha Rao" | Reconcile, evaluate, close | The final report reconciles the quantities. Asha closes it. |
| 37 | 37-recalls-list.png | The line "Last mock recall closed: 22 Nov 2026" above the table; the RC-2026-0001 row | When was it last tested? | The list shows when the last mock recall was closed. |
| | **Ch 9: Self-inspection** | title card: "Medhanta ASSURE · Self-inspection" · "Self-inspection: internal audit" | Medhanta ASSURE · Self-inspection | |
| 38 | 38-audit-report.png | The Findings table (three rows: finding, area, recommended action); top-right the green "✔ Report issued · Kiran Desai" | Findings in a table | Kiran Desai writes up the self-inspection, our internal audit: three findings, three actions. |
| 39 | 39-audit-correction.png | History table: the row "Report saved (version 2)" with the reason "Finding 1: area corrected from Packing to Equipment"; the two "Signed: Report issued" rows | Corrections need a reason | Corrections keep the old version and the reason, and are signed again. |
| | **Ch 10: Supplier quality** | title card: "Medhanta ASSURE · Supplier quality" · "Approved suppliers only" | Medhanta ASSURE · Supplier quality | |
| 40 | 40-supplier-approve-before.png | The Approval card: Comment, the field "Conditions of approval (leave empty for a full approval)" with "Full incoming testing of the first 3 lots…"; bottom-right the grey "Rejected" and orange "Sign: Approved" buttons | Approval, with conditions | Asha approves a new blister-foil supplier, with conditions. |
| 41 | 41-suppliers-approved-list.png | The "Next due" table of the Approved list with the red "20 Oct 2026 · overdue" re-evaluation; the row "Polypack Films, Daman – Aluminium blister foil" with the green "current" chip | The approved supplier list | It joins the approved supplier list, which QLIMS reads. Re-evaluations are tracked. |
| | **Ch 11: Product quality review** | title card: "Medhanta ASSURE · Product quality review" · "PQR: yearly product review, filled from the platform" | Medhanta ASSURE · Product quality review | |
| 42 | 42-pqr-fill-before.png | Bottom of the Review form: the button "Fill from the platform" (centre-right, next to "Save") | One click to gather the data | Kiran starts the yearly product review. One click gathers the facts. |
| 43 | 43-pqr-fill-after.png | The item "Representative batches…" filled: "TrueBatch Tablets … 3 batches made in the period; 2 released… TB260009, TB260010" and the TrueBatch Tablets Packing line; the small "Refill this item" link | Batches from TrueBatch | Batches come from TrueBatch, materials from MMS, deviations from DIVE. |
| 44 | 44-pqr-fill-ipc.png | The item "Critical in-process controls…": the QLIMS results lines and "CPV report 12" from RISE with "Core hardness: stable no…" | Results from QLIMS and RISE | Test results come from QLIMS, process trends from RISE. Kiran adds the conclusion. |
| 45 | 45-pqr-ap-reviewed.png | Card "Authorised person review": the comment and the green "✔ AP reviewed · Dr. Meera Joshi" | Signed by the authorised person | Dr. Meera Joshi reviews and signs it. |
| 46 | 46-pqr-list.png | The "Next due" table: "Ceftriaxone 1 g powder for injection 31 Oct 2027" and "Chlorphenamine maleate 4 mg sugar-coated tablets 30 Nov 2027" | Next review, per product | The next review date of each product is tracked. |
| | **Ch 12: Management review** | title card: "Medhanta ASSURE · Management review" · "Leadership reviews the system" | Medhanta ASSURE · Management review | |
| 47 | 47-mgmt-review.png | The "What was reviewed" and "Improvement opportunities and decisions" fields; the Actions table with owners and due dates; "Next review due" | Decisions and actions | Management records its review, decisions, actions and the next date. |
| | **Ch 13: Ready for inspection** | title card: "Medhanta ASSURE · Ready for inspection" · "Signed, traceable, on record" | Medhanta ASSURE · Ready for inspection | |
| 48 | 48-record-pdf.png | The left PDF page: the header with the ASSURE shield "Medhanta ASSURE · Quality system · Change CC-2026-0003", "Proposal · version 1 (superseded)"; right page: the signature lines | One PDF per record | Every record prints as one PDF, with every version and signature. |
| 49 | 49-controlled-copy-pdf.png | Left page, top: the red line "Controlled copy No. 2, issued to Production office, compression…" under the ASSURE header | Controlled copies, numbered | A controlled copy carries its number on every page. |
| 50 | 50-audit-trail.png | Top: green bar "Integrity check: passed" and the "Run now" button; the filter "meera.joshi"; the When / Who / What / Before / After columns; "Logged in" rows with her permissions from Medhanta | Who did what, and when | QA sees the full audit trail. A nightly check confirms no signed record changed. |
| 51 | 51-audit-trail-correction.png | Row "Step corrected": Before shows "area":"Packing", After shows "area":"Equipment"; the Reason column on the right | Before, after and why | Here is that correction: old value, new value, and the reason. |

Total ≈ 5 min 47 s including intro, title cards and end card.

## PRONUNCIATION RULES FOR THE VOICE-OVER (apply to every scene; captions keep normal spelling)

1. Speak naturally, at one steady pace (about 130 words a minute). Never slow down, pause or stretch on abbreviations, numbers or brand names.
2. Letter abbreviations are said as quick, joined letters in ONE beat, like a newsreader, never spelled out slowly with gaps: US = "you-ess" (one quick word), EU = "ee-you", UK = "you-kay", FDA = "eff-dee-ay", QA = "cue-ay", QMS = "cue-em-ess", SOP = "ess-oh-pee", PQR = "pee-cue-ar", FMEA = "eff-em-ee-ay", CPV = "see-pee-vee", AP = "ay-pee", OEE = "oh-ee-ee", IQ / OQ / PQ = "eye-cue", "oh-cue", "pee-cue", MIT = "em-eye-tee", DPDP = "dee-pee-dee-pee", AI = "ay-eye", CEO = "see-ee-oh", CFO = "see-eff-oh". Never read the dots in "U.S." or "e.g."; say "you-ess" and "for example".
3. Abbreviations that are said as WORDS: CAPA = "KAP-uh", SHRM = "shurm", Ipca = "IP-kuh".
4. Web addresses and domains: "." is said "dot", and the ending is said as a word: ".in" = "dot in" (rhymes with "pin"), ".com" = "dot com", ".co.in" = "dot co dot in". Never spell an ending letter by letter ("dot i-n" is wrong).
5. Brand and product names (confirm with Medhanta before final recording): Medhanta = "meh-DHAAN-tah", ASSURE = "uh-SHOOR" ("Medhanta ASSURE" = "meh-DHAAN-tah uh-SHOOR"), LEAD = "leed", DIVE = "dive" (one word, like diving), RISE = "rize", TIDE = "tide", EQUIP = "ee-KWIP", QLIMS = "cue-lims", MMS = "em-em-ess", CLEAR = "clear", TrueBatch = "TROO-batch", Batchwright = "BATCH-rite", Digi = "DIJ-ee" (as in "digital"; "Digi partner" = "DIJ-ee partner", never "DIG-ee"), McKinsey = "muh-KIN-zee", Ranbaxy = "ran-BAK-see", Alexion = "uh-LEK-see-on", Baddi = "BUD-dee".
6. Indian money and numbers, said the Indian way: "₹16 lakh" = "sixteen lakh rupees" (lakh = "laak", rhymes with "rock"), "₹6 crore" = "six crore" (crore = "krore"), "US$4,700" = "forty-seven hundred dollars", "US$10–25 million" = "ten to twenty-five million dollars", "600-batch" = "six-hundred-batch", "60%" = "sixty percent", "2×" = "twice". Never read symbols aloud (₹, $, %, ×, –) as symbol names.
7. Footnote numbers (¹ ² ³) are on screen only. Never say them.
8. If a word could be misread, write it in the voice-over text the way it sounds (for example "DIJ-ee partner", "you-ess", "dot in"), keeping the correct spelling only in the captions.
