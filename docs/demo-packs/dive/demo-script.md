# Demo script: Medhanta DIVE (Deviations, Investigations & CAPA)

Feature walkthrough, about **5 min 38 s**. One deviation at the fictional **Medhanta Demo Plant, Unit 2**, from the shop floor to signed closure, on one working day (Sunday 22 Nov 2026).

- **Cast (all fictional):** Priya Nair (Operator, reports), Asha Rao (QA Head), Kiran Joshi (QA Officer), Neha Iyer (Engineering, investigator and CAPA owner), Vikram Shah (Production), Sunil Verma (Production), Rahul Mehta (Warehouse), Demo Site Admin.
- **Product and batch (fictional), from the TrueBatch Tablets story:** Chlorphenamine maleate 4 mg sugar-coated tablets, product **FG-CPM4**, batch **TB260011** (cores on tablet press PRESS-01, hardness tester HT-01). Earlier batches TB260009 and TB260010. Deviation **DEV-2026-0026**; CAPA-2026-0016 to 0018.
- Earlier months hold 21 fictional demo deviations (Jan to Nov 2026), so lists, hints and trends have history.
- Screen positions are rough, on the 1920×1080 screenshot. The app content sits in a centred column, roughly x 360–1560; the menu bar with the Medhanta DIVE emblem is at the top left.
- Linked products: the batch list and batch data come from **TrueBatch Tablets**, the equipment logbook from **Medhanta LEAD**, the OOS from **Medhanta QLIMS** and the CPV signal from **Medhanta RISE**. In this demo they are small stand-in copies with fictional data, the same way the product's own tests do it. (The app's own screen labels say "TrueBatch" and "Logbook"; the voice-over names them TrueBatch Tablets and Medhanta LEAD.)
- The optional AI helper (suggested causes via Google Gemini) needs an API key the demo does not have, so it does not appear.

## Intro (≈ 14 s)

**Problem in one line:** a deviation on paper or in e-mail gets lost between the floor, QA and engineering, and the same problem comes back.

**Intro title card:** Medhanta DIVE emblem (medhanta-dive-logo.png) · "Medhanta DIVE" · subtitle "Deviations, Investigations & CAPA, from the shop floor to a signed close" · small "by Medhanta" line with medhanta-logo.png · gradient underline.

**Voice-over:** "Something went wrong on the line. Now what? Let's follow one deviation at our demo plant, from the moment it is reported to the signed closure, and see how Medhanta DIVE keeps every step clear, on time and traceable."

## Chapter 1: Welcome (≈ 8 s)

**Title card:** "Medhanta DIVE · Welcome" · subtitle "One sign-in for the whole Medhanta suite"

### Step 1: `01-sign-in.png`
- **Highlight:** Centre: the Medhanta DIVE emblem, then the orange "Sign in" button below it
- **Voice-over:** "Everyone signs in with their own Medhanta login. One sign-in for the whole suite, and no shared accounts."
- **Caption:** Medhanta DIVE: your own login

## Chapter 2: Set up once (≈ 10 s)

**Title card:** "Medhanta DIVE · Set up once" · subtitle "Site, target dates and lists"

### Step 2: `02-admin-settings.png`
- **Highlight:** Top: "Site and target dates" card with "Medhanta Demo Plant, Unit 2" and the three target-day boxes; then the "Areas" list below
- **Voice-over:** "An administrator sets the site name, the target days to close, and the lists of areas and deviation types. Who may do what is ticked per person in Medhanta's people screen."
- **Caption:** Site, target dates and lists

## Chapter 3: Raised on the floor (≈ 30 s)

**Title card:** "Medhanta DIVE · Raised on the floor" · subtitle "Report in a minute, batch picked from TrueBatch"

### Step 3: `03-home-operator.png`
- **Highlight:** Top-right: the orange "Report a deviation" button; then the count tiles (Waiting for me, Overdue, Open)
- **Voice-over:** "Priya runs the tablet press. At the two-forty in-process check, IPC for short, the cores are too soft. She reports it straight away."
- **Caption:** Anyone can report

### Step 4: `04-batch-pick-before.png`
- **Highlight:** Middle: the filled Title and "What happened" fields; then the empty "Pick or type the batch number" box under "Product and batch"
- **Voice-over:** "She writes what happened, the area, the machine and the time."
- **Caption:** What, where, when

### Step 5: `05-batch-picked.png`
- **Highlight:** Middle-left: batch "TB260011" and the product "FG-CPM4" filled in next to it
- **Voice-over:** "The batch is picked from TrueBatch Tablets, our batch record, and the product comes with it. No typing errors in batch numbers."
- **Caption:** Batch picked from TrueBatch

### Step 6: `06-report-form-impact.png`
- **Highlight:** Middle: the three "Initial impact assessment" answers (Yes, Not known yet, Not known yet), then "Action taken" at the bottom
- **Voice-over:** "She gives a first view of the impact, and what she did at once: press stopped, cores on hold, QA informed."
- **Caption:** First impact and immediate action

### Step 7: `07-report-saved.png`
- **Highlight:** Top-left: the heading "DEV-2026-0026 · Core hardness below limit at compression"; then the green next-step bar "QA classifies the deviation"
- **Voice-over:** "Saved. The deviation has its number, and the page says what happens next."
- **Caption:** A number at once

## Chapter 4: QA triage (≈ 44 s)

**Title card:** "Medhanta DIVE · QA triage" · subtitle "Classify, assign, or say: not a deviation"

### Step 8: `08-qa-home-waiting.png`
- **Highlight:** Middle: the row "DEV-2026-0026 · Core hardness below limit at compression" in the "Waiting for me" list
- **Voice-over:** "Asha, the QA head, sees the new report waiting for her, next to the other reports of the day."
- **Caption:** Waiting for QA

### Step 9: `09-classify-form.png`
- **Highlight:** Top: "Major" selected, Type "Equipment", Investigator "Neha Iyer"; then the small line under the impact text saying the batch was picked from the batch record (no tick needed)
- **Voice-over:** "She classifies it as major, writes the impact and assigns Neha from engineering to investigate. The batch came from TrueBatch, so it is already checked."
- **Caption:** Classify and assign

### Step 10: `10-classified.png`
- **Highlight:** Top: the status bar "Investigation · Major · Target date 22 Dec 2026" and the DMAIC bar below
- **Voice-over:** "A target date is set from the classification. The progress bar follows the DMAIC steps: define, measure, analyse, improve, control."
- **Caption:** Target date and progress

### Step 11: `11-not-a-deviation-sign.png`
- **Highlight:** Centre: the dialog "Sign: Cancelled: not a deviation" with the typed reason
- **Voice-over:** "Not every report is a deviation. This missing log reading was on the paper back-up log. Asha cancels it with a reason and her e-signature."
- **Caption:** Not a deviation: reason and signature

### Step 12: `12-not-a-deviation-done.png`
- **Highlight:** Top: the yellow card "Cancelled by QA: not a deviation" with reason, signer and time
- **Voice-over:** "Nothing is deleted. The report stays on record, clearly marked, and is left out of trends and overdue lists."
- **Caption:** Kept on record, clearly marked

### Step 13: `13-planned-approve-sign.png`
- **Highlight:** Centre: the dialog "Sign: Approved (planned deviation may proceed)"; then the line "Sign opens a small window where you enter your password again"
- **Voice-over:** "A planned change needs QA approval first. At every signature you enter your password again, so the signature is really yours."
- **Caption:** Planned change? Approve first

### Step 14: `14-planned-approved.png`
- **Highlight:** Middle: the green line "Approved (planned deviation may proceed) · Asha Rao · 22 Nov, 18:12 IST"
- **Voice-over:** "Approved, with name, date and meaning on the record."
- **Caption:** Signed approval on record

### Step 15: `15-qlims-oos-picked.png`
- **Highlight:** Top: the "OOS from QLIMS" picker with OOS260007; then the filled title, the area "QC laboratory (Medhanta LIMS)" and the "From QLIMS OOS" chip next to batch TB260118
- **Voice-over:** "An out-of-specification result, OOS, works the same way: QA picks it from Medhanta QLIMS and the details fill in."
- **Caption:** OOS picked from Medhanta QLIMS

## Chapter 5: The investigation helper (≈ 36 s)

**Title card:** "Medhanta DIVE · The investigation helper" · subtitle "Hints, history and data from TrueBatch and LEAD"

### Step 16: `16-investigator-home.png`
- **Highlight:** Middle: the one row DEV-2026-0026 in Neha's "Waiting for me" list
- **Voice-over:** "Neha opens her list. The deviation is waiting for her."
- **Caption:** Assigned to the investigator

### Step 17: `17-things-to-look-at.png`
- **Highlight:** Top: the "same equipment" hint (PRESS-01 had 2 other deviations in 90 days); then "Similar earlier cases" with their root causes
- **Voice-over:** "Before she starts, DIVE shows things to look at: the same press had problems before, and here are similar earlier cases with their causes and CAPAs."
- **Caption:** Hints and similar cases

### Step 18: `18-data-fetch-before.png`
- **Highlight:** Middle: the "Data collection" card and its "Fetch related data" button on the right
- **Voice-over:** "One click collects the data she needs."
- **Caption:** Fetch related data

### Step 19: `19-data-fetch-after.png`
- **Highlight:** Middle: "Batch record (TrueBatch)" and its "Equipment used" table: FBD-01, PRESS-01 and HT-01 for batch TB260011
- **Voice-over:** "From TrueBatch Tablets: the batch status, and every machine and room the batch used, step by step."
- **Caption:** Batch data from TrueBatch

### Step 20: `20-lead-findings.png`
- **Highlight:** Top: the first finding "HT-01 calibration was overdue at the event"; then the breakdown entry "PRESS-01 ... upper punch sticking ... refitted"
- **Voice-over:** "From Medhanta LEAD, the equipment logbook: the hardness tester was overdue for calibration, and the press had a breakdown repair the day before. Read-only, kept as a copy with a checksum."
- **Caption:** Logbook findings from Medhanta LEAD

### Step 21: `21-attachment.png`
- **Highlight:** Middle: the attached file "ipc-hardness-printout.pdf" with name and time
- **Voice-over:** "She attaches the tester printout. Attachments are never deleted."
- **Caption:** Evidence attached

## Chapter 6: Finding the root cause (≈ 46 s)

**Title card:** "Medhanta DIVE · Finding the root cause" · subtitle "Proven tools, saved as you work"

### Step 22: `22-is-is-not.png`
- **Highlight:** Top: the Is / Is Not table (What, Where, When, Who, Extent)
- **Voice-over:** "Is, is not: what happened, and what did not. It narrows the search to press one, since the repair."
- **Caption:** Is / Is Not narrows it down

### Step 23: `23-six-m.png`
- **Highlight:** Middle: "Machine / equipment" and "Method" boxes marked "Ruled in"; the others "Ruled out"
- **Voice-over:** "The six-M fishbone checks people, machine, method, material, measurement and environment, each with evidence."
- **Caption:** 6M with evidence

### Step 24: `24-five-whys.png`
- **Highlight:** Top: Why 1 to Why 4, ending "The SOP was written for planned maintenance, not for breakdown repairs"
- **Voice-over:** "Five whys go past the symptom to the system cause: the restart after a repair never checked the force setting."
- **Caption:** 5 Whys to the system cause

### Step 25: `25-barriers-fmea.png`
- **Highlight:** Top: the three barriers with "Did not work", "Not present", "Worked"; then the FMEA row "Score 4 × 3 × 2 = 24"
- **Voice-over:** "Barrier analysis shows which checks failed. The FMEA, a risk score, uses the same one-to-five scale as Medhanta ASSURE."
- **Caption:** Barriers and risk score

### Step 26: `26-root-cause-batches.png`
- **Highlight:** Middle: the "Root cause" text; then "Other batches checked": TB260010 and TB260009, "Not affected"
- **Voice-over:** "She writes the root cause and checks the other batches made on the press. Both were made before the repair, so they are not affected."
- **Caption:** Root cause and other batches

### Step 27: `27-investigation-sign.png`
- **Highlight:** Centre: the dialog "Sign: Investigation complete" and its "Sign" button
- **Voice-over:** "She signs the investigation complete."
- **Caption:** Signed by the investigator

### Step 28: `28-fishbone-signed.png`
- **Highlight:** Middle: the fishbone diagram with "Machine / equipment" and "Method" marked ruled in
- **Voice-over:** "The signed record shows the fishbone, with the causes that were ruled in."
- **Caption:** The fishbone at a glance

### Step 29: `29-dmaic-progress.png`
- **Highlight:** Top: the DMAIC bar with Define, Measure and Analyze done, Improve in progress
- **Voice-over:** "Define, measure and analyse are done. Now to improve."
- **Caption:** Three steps done

## Chapter 7: CAPA (≈ 24 s)

**Title card:** "Medhanta DIVE · CAPA" · subtitle "Corrective and preventive actions, with owners and dates"

### Step 30: `30-capa-raise-form.png`
- **Highlight:** Top: "Raise a CAPA for this deviation": Corrective, what must be done, Strength, Owner "Neha Iyer", Due date
- **Voice-over:** "Asha raises CAPAs, corrective and preventive actions, each with an owner, a due date and a strength."
- **Caption:** Owner, due date, strength

### Step 31: `31-capas-raised.png`
- **Highlight:** Middle: the three CAPA rows with owners and due dates; the "strong" tag on the LEAD calibration block
- **Voice-over:** "Three CAPAs: restore the force setting, fix the restart procedure, and block an overdue instrument in Medhanta LEAD."
- **Caption:** Three CAPAs raised

### Step 32: `32-capa-done-before.png`
- **Highlight:** Middle: the "Mark as done" box with Neha's note and work order; then the "Mark done" button
- **Voice-over:** "Neha does the work and records what was done, with the record references."
- **Caption:** Owner marks it done

### Step 33: `33-capa-done-after.png`
- **Highlight:** Top: the status chip "Done" and the next step for QA; then the history rows "CAPA raised", "CAPA done"
- **Voice-over:** "Now it is back with QA."
- **Caption:** Back to QA

## Chapter 8: Did it work? (≈ 22 s)

**Title card:** "Medhanta DIVE · Did it work?" · subtitle "Verify, then check effectiveness"

### Step 34: `34-capa-verify.png`
- **Highlight:** Middle: "Dedicated effectiveness check" with the check date and how it will be checked; then "Sign verified"
- **Voice-over:** "QA verifies the action and decides how to prove it worked: a dedicated check by a date."
- **Caption:** Verify and plan the check

### Step 35: `35-capa-check-due.png`
- **Highlight:** Top: "Effectiveness check due" with the check date
- **Voice-over:** "The check date is tracked like any other due date."
- **Caption:** Check date tracked

### Step 36: `36-effectiveness-before.png`
- **Highlight:** Middle: "Effective" selected with the evidence text; then "Sign and close"
- **Voice-over:** "When the check is done, QA records the result with evidence."
- **Caption:** Effective, with evidence

### Step 37: `37-capa-closed.png`
- **Highlight:** Top: the green "Closed" status; then the signed lines "Verified" and "Closed" in the record
- **Voice-over:** "The CAPA is closed, every step signed."
- **Caption:** CAPA closed

## Chapter 9: Closure (≈ 24 s)

**Title card:** "Medhanta DIVE · Closure" · subtitle "Final impact, batch decision, signature"

### Step 38: `38-closure-form.png`
- **Highlight:** Middle: "Close the deviation": closure summary, final impact answers, batch disposition notes
- **Voice-over:** "To close, QA gives the final impact and the batch decision: soft cores rejected, the rest may go on to coating."
- **Caption:** Final impact and batch decision

### Step 39: `39-closure-sign.png`
- **Highlight:** Centre: the dialog "Sign: Closed"
- **Voice-over:** "And signs it closed."
- **Caption:** Signed closed

### Step 40: `40-closed.png`
- **Highlight:** Top: the status "Closed"; the DMAIC bar
- **Voice-over:** "Closed, within the target date."
- **Caption:** Closed on time

### Step 41: `41-closed-control.png`
- **Highlight:** Middle: "Closure and effectiveness": "CAPAs closed: 1 of 3" and "2 still open (followed in the CAPA list)", then "Closed · Asha Rao · 22 Nov, 18:14 IST"
- **Voice-over:** "Open CAPAs do not block closure. They stay on the CAPA list until they are done and checked."
- **Caption:** Open CAPAs stay tracked

## Chapter 10: See it all (≈ 34 s)

**Title card:** "Medhanta DIVE · See it all" · subtitle "Overdue lists, CAPA register, batch check, trends"

### Step 42: `42-home-overdue.png`
- **Highlight:** Middle: the "Overdue" tab and the red "Overdue" dates in the list
- **Voice-over:** "Overdue deviations are always one click away, in red."
- **Caption:** Overdue at a glance

### Step 43: `43-capa-register.png`
- **Highlight:** Top: the filters; then the Source column (deviation, internal audit, complaint, management review)
- **Voice-over:** "The CAPA register holds every CAPA, from deviations, audits, complaints and reviews, with filters."
- **Caption:** One CAPA register

### Step 44: `44-batch-check.png`
- **Highlight:** Top: the search box "tb 260011", then the result row DEV-2026-0026, "Closed" with its open CAPAs
- **Voice-over:** "Before release, the batch check shows every deviation that names a batch, however the number was written."
- **Caption:** Batch check before release

### Step 45: `45-trends-chart.png`
- **Highlight:** Top: the bar chart of deviations per month; then the area table below
- **Voice-over:** "Trends show deviations per month, by area, type or class."
- **Caption:** Trends per month

### Step 46: `46-trends-pareto.png`
- **Highlight:** Top: "Unusual months: Compression, Nov 26"; then the root-cause Pareto and the red repeat flags
- **Voice-over:** "Unusual months are flagged, and the root-cause chart shows which causes keep coming back."
- **Caption:** Unusual months and repeats

### Step 47: `47-rise-cpv-filed.png`
- **Highlight:** Top: the title "Continued process verification: Tablet weight, batch TB260131"; then "Operations CPV (automatic)" in the report
- **Voice-over:** "And when QA sends an out-of-trend signal from Medhanta RISE, continued process verification, it arrives here as a deviation, once."
- **Caption:** Sent from Medhanta RISE

## Chapter 11: Records you can trust (≈ 34 s)

**Title card:** "Medhanta DIVE · Records you can trust" · subtitle "Corrections, history, audit trail, PDF"

### Step 48: `48-correction-before.png`
- **Highlight:** Bottom: the field "Reason for the correction" and the "Save correction" button
- **Voice-over:** "Need to correct a record? Give a reason."
- **Caption:** Corrections need a reason

### Step 49: `49-correction-after.png`
- **Highlight:** Middle: "Corrected · version 2" with the reason; then the old version 1 shown below
- **Voice-over:** "The old version stays readable, with who changed what and why."
- **Caption:** Old version kept

### Step 50: `50-deviation-history.png`
- **Highlight:** Middle: the History table in plain words: Reported, Classified, Data fetched, Investigation complete, CAPA raised, Closed; times like "22 Nov, 18:13 IST"
- **Voice-over:** "Every deviation carries its own history, in plain words, with one clear time format in plant time."
- **Caption:** History in plain words

### Step 51: `51-audit-trail.png`
- **Highlight:** Top: green "Integrity check: passed" with "Run now"; then the WHAT and AFTER columns
- **Voice-over:** "QA can search the audit trail, with old and new values. An integrity check runs every night, or on demand."
- **Caption:** Audit trail and integrity check

### Step 52: `52-pdf-copies.png`
- **Highlight:** Top-left of each page: the Medhanta DIVE emblem and name in the header; left page the deviation, right page the CAPA
- **Voice-over:** "For reviews and inspections, print a PDF of any deviation or CAPA, with the Medhanta DIVE header."
- **Caption:** PDF copies, ready for inspection

### Step 53: `53-pdf-signatures-history.png`
- **Highlight:** Left page: the signature line "Signed: Closed · Asha Rao · 22 Nov 2026, 18:14 IST"; right page: the history table
- **Voice-over:** "Signatures, data collected and the full history are in the copy, dates written in full."
- **Caption:** Signatures and history included

## Outro (≈ 12 s)

**Voice-over:** "Medhanta DIVE: report, investigate, act, check and close, all signed and traceable, with data pulled from TrueBatch and Medhanta LEAD. Book a demo to see it with your own plant's data."

**End card:** Medhanta DIVE emblem (medhanta-dive-logo.png) centred · "Medhanta DIVE" · "Deviations, Investigations & CAPA" · small "by Medhanta" line with medhanta-logo.png · button-style text **"Book a demo"** · gradient bar. Hold 4 s.

## Durations

| Part | Screens | Duration |
|---|---|---|
| Intro | title card | 14 s |
| 1 Welcome | 01 | 8 s |
| 2 Set up once | 02 | 10 s |
| 3 Raised on the floor | 03–07 | 30 s |
| 4 QA triage | 08–15 | 44 s |
| 5 The investigation helper | 16–21 | 36 s |
| 6 Finding the root cause | 22–29 | 46 s |
| 7 CAPA | 30–33 | 24 s |
| 8 Did it work? | 34–37 | 22 s |
| 9 Closure | 38–41 | 24 s |
| 10 See it all | 42–47 | 34 s |
| 11 Records you can trust | 48–53 | 34 s |
| Outro and end card | end card | 12 s |
| **Total** | 53 screens | **≈ 5 min 38 s** |
