# Demo script: Medhanta QLIMS

Feature walkthrough, about **5 min 47 s**. One day in the QC laboratory of the fictional **Medhanta Demo Plant, Unit 2**: a raw material lot comes in, a tablet batch is tested, reviewed and released with a certificate, an injectable batch fails pH and goes through OOS, the sterile room is monitored, and a stability study starts.

- **Cast (all fictional):** Meera Pillai (QC Analyst), Arjun Desai (QC Analyst, second-person checker), Ravi Menon (QC Microbiologist), Sneha Kulkarni (QC Reviewer), Asha Rao (QA Head), Kiran Joshi (QA Officer), Farhan Ali (QC Documentation, writes methods), Deepa Nair (checks methods).
- **Products and lots (fictional, from the current TrueBatch story):** Chlorphenamine maleate 4 mg sugar-coated tablets **FG-CPM4**, batches **TB260009** (released), **TB260010** (tested today), **TB260011** (in production); Ceftriaxone 1 g powder for injection **FG-CFX1**, batches **TI260019** (released), **TI260020** (OOS today), **TI260021**; raw material lot **RM260412** of Chlorphenamine maleate (API) in quarantine in Medhanta MMS. Eight earlier tablet batches (TB260001 to TB260008) give the trend chart its history.
- **Numbers seen on screen:** API sample LS2600010; TB260010 sample LS2600011, assay LA2600019, dissolution LA2600020, certificate COA2600010; TI260020 sample LS2600012, pH analysis LA2600021, OOS260001, DIVE deviation DEV-2026-0031; EM sample LS2600013, DIVE deviation DEV-2026-0032; stability study STB26001.
- **Linked products:** samples come from **Medhanta MMS** (lots) and **TrueBatch Tablets / TrueBatch Injectables** (batches); instrument status from **Medhanta LEAD** (logbook, calibration); instrument qualification from **Medhanta EQUIP**; training from **Medhanta TIDE**; deviations from **Medhanta DIVE**. In this demo they are small stand-in copies with fictional data, run the same way the product's own browser tests run them. Sign-in and e-signature re-authentication are a stand-in for Medhanta core, as in those tests. (The app's own screen text says "Qualification" and "Recruitment" in a few places; the voice-over names them Medhanta EQUIP and Medhanta TIDE.)
- Screen positions are rough, on the 1920×1080 screenshot. The app content sits in a centred column (about x 360–1560); list and review pages of specifications, plans and protocols are wider (about x 140–1780). The menu bar with the Medhanta QLIMS emblem is at the top left. Screens 26, 51 and 52 are PDF pages on a dark grey background.
- The screenshots were taken in the early hours of 23 Nov 2026 plant time, so the on-screen times read "23 Nov, 01:3x IST". The voice-over never names a time.

## Intro (≈ 13 s)

**Intro title card:** Medhanta QLIMS emblem logo (brand/medhanta-qlims-logo.png) · "Medhanta QLIMS" · subtitle "Laboratory information management for pharma QC labs" · small "by Medhanta" line with medhanta-logo.png · gradient underline.

**Voice-over:** "Paper worksheets, logbooks and spreadsheets: one missed check can hold a batch. Medhanta QLIMS puts the whole QC lab on one screen, with every step signed."
**Caption:** Medhanta QLIMS: the QC lab, on one screen

## Chapter 1: Welcome (≈ 7 s)

**Title card:** "Medhanta QLIMS · Welcome" · subtitle "Your own Medhanta login"

### Step 1: `01-sign-in.png`
- **Highlight:** Centre: the Medhanta QLIMS emblem, then the orange "Sign in" button below it
- **Voice-over:** "Everyone signs in with their own Medhanta login. No shared accounts."
- **Caption:** Medhanta QLIMS: your own login

## Chapter 2: Specifications and methods (≈ 28 s)

**Title card:** "Medhanta QLIMS · Specifications and methods" · subtitle "Written, checked, approved, then effective"

### Step 2: `02-methods.png`
- **Highlight:** Centre: the methods table, the green "Effective" chips and the "validated" column; then the orange "Start a trial analysis" buttons on the right
- **Voice-over:** "Test methods are versioned masters. Each one is validated before routine use."
- **Caption:** Validated, versioned test methods

### Step 3: `03-spec-review.png`
- **Highlight:** Middle: the plain-words view listing "Assay (HPLC)" and "Dissolution (45 min)" with their limits; then the green "Master check: No problems" box on the right
- **Voice-over:** "The tablet specification lists each test, its method and its limit, in plain words. Farhan wrote it, Deepa checked it."
- **Caption:** Specification in plain words

### Step 4: `04-spec-approve-sign.png`
- **Highlight:** Centre: the dialog "Sign: Approved" with "Change control number: CC-2026-118", then the orange "Sign" button
- **Voice-over:** "Asha from QA approves it with the change control number and her e-signature."
- **Caption:** QA approves with change control

### Step 5: `05-spec-effective.png`
- **Highlight:** Top-left: the history list "Sent for review, Checked, Approved by QA, Made effective · Kiran Joshi"; the green "Effective" chip in the title line
- **Voice-over:** "A second QA person makes it effective. Only the effective version is ever used."
- **Caption:** Only the effective version is used

## Chapter 3: Samples come in (≈ 34 s)

**Title card:** "Medhanta QLIMS · Samples come in" · subtitle "Lots from MMS, batches from TrueBatch"

### Step 6: `06-samples-waiting.png`
- **Highlight:** Middle: the "Waiting to be sampled" list: lot RM260412 from MMS, then batches TB260010 and TI260020 from TrueBatch
- **Voice-over:** "The list fills itself: lots in quarantine from Medhanta MMS, and batches from TrueBatch Tablets and TrueBatch Injectables."
- **Caption:** Lots and batches arrive on their own

### Step 7: `07-register-api-lot.png`
- **Highlight:** Centre of the dialog: the "Sampling plan" box "sample 4 of 9 containers (1 + √9 = 4.00, rounded up = 4)" and the container numbers 1, 3, 6, 9
- **Voice-over:** "Meera registers the chlorphenamine maleate lot. The sampling plan works out how many containers to open."
- **Caption:** Sampling plan worked out for you

### Step 8: `08-sample-registered.png`
- **Highlight:** Top-left: sample number "LS2600010 · Registered"; then the "Tests" table with "Assay (HPLC)" and its limit
- **Voice-over:** "The sample gets its number and the tests from the effective specification."
- **Caption:** Tests come from the specification

### Step 9: `09-chain-of-custody.png`
- **Highlight:** Middle: the "Chain of custody" card: Registered, Received in QC, Stored on shelf B2, each with name and time
- **Voice-over:** "Received and stored: the chain of custody records who did what, and when."
- **Caption:** Chain of custody, step by step

### Step 10: `10-sample-tb260010.png`
- **Highlight:** Top: "Source: From TrueBatch: TrueBatch Tablets batch TB260010"; then the two tests, Assay and Dissolution
- **Voice-over:** "The finished-product sample of tablet batch TB260010 comes straight from TrueBatch Tablets. No retyping."
- **Caption:** Batch facts pulled from TrueBatch

## Chapter 4: The analyst's worksheet (≈ 60 s)

**Title card:** "Medhanta QLIMS · The analyst's worksheet" · subtitle "Step by step, checked against limits"

### Step 11: `11-start-analysis.png`
- **Highlight:** Centre: the dialog "Start an analysis" for QC-M-201 and sample LS2600011, then "Next: sign"
- **Voice-over:** "Meera starts the HPLC assay. The worksheet is built from the method."
- **Caption:** A worksheet from the method

### Step 12: `12-analysis-screen.png`
- **Highlight:** Top: analysis number "LA2600019" and the three stage tiles "Sample weighing, HPLC run, Result"
- **Voice-over:** "Each stage opens in turn, so steps cannot be skipped."
- **Caption:** Stages in the right order

### Step 13: `13-balance-picker.png`
- **Highlight:** Left: the "Balance" card BAL-01, then the line "Not offered: BAL-02 is due for requalification"
- **Voice-over:** "Only qualified balances are offered. BAL-02 is due for requalification in Medhanta EQUIP."
- **Caption:** Only qualified instruments offered

### Step 14: `14-balance-weighed.png`
- **Highlight:** Left: "From LEAD: BAL-01: in service" and "From EQUIP: BAL-01: qualified"; right: the green "Within limits" result
- **Voice-over:** "The balance status comes from Medhanta LEAD. The mass is checked against its target."
- **Caption:** Status from LEAD and EQUIP

### Step 15: `15-checker-my-work.png`
- **Highlight:** Top: the yellow row "Weigh: Powder of 20 tablets" under "Waiting for your check", and the "Check →" link on the right
- **Voice-over:** "Arjun sees the weighing waiting for his check, on his own device."
- **Caption:** Second-person check

### Step 16: `16-step-checked.png`
- **Highlight:** Right: the history lines "Signed: performed · Meera Pillai" and "Signed: verified (second person) · Arjun Desai"
- **Voice-over:** "He signs it as checked. Both signatures are on the record."
- **Caption:** Performed and verified, both signed

### Step 17: `17-hplc-refused.png`
- **Highlight:** Left: the red line "HPLC-02 is not fit for use (LEAD): calibration overdue since 20 Nov 2026"
- **Voice-over:** "At the HPLC, Meera tries HPLC-02. Its calibration is overdue in Medhanta LEAD, so it is refused."
- **Caption:** Overdue calibration? Refused

### Step 18: `18-assay-result.png`
- **Highlight:** Right: the green result card "99.6 %, Limit 90.0 to 110.0 %, Within limits"
- **Voice-over:** "Ninety-nine point six percent: within limits, worked out by the server."
- **Caption:** Result checked against the limit

### Step 19: `19-sign-training.png`
- **Highlight:** Centre of the dialog: the blue box "Your training: trained: SOP-QC-014 HPLC analysis (TIDE)"
- **Voice-over:** "Only trained analysts sign. Her training is read from Medhanta TIDE."
- **Caption:** Training checked at signing

### Step 20: `20-same-test-blocked.png`
- **Highlight:** Middle: the greyed button "Start QC-M-201 Chlorphenamine maleate assay by HPLC (LA2600019 is open)"
- **Voice-over:** "The same test cannot be started twice. The greyed button says why: the assay is already open."
- **Caption:** Same test twice? Blocked, with the reason

## Chapter 5: Review, approval and certificate (≈ 36 s)

**Title card:** "Medhanta QLIMS · Review and certificate" · subtitle "Second-person review, QC decision, CoA"

### Step 21: `21-to-review.png`
- **Highlight:** Top: the row "LA2600019 · Chlorphenamine maleate assay by HPLC" with the green "Ready for your review" chip
- **Voice-over:** "Sneha, the reviewer, sees the finished assay waiting."
- **Caption:** Ready for review

### Step 22: `22-review-audit-trail.png`
- **Highlight:** Middle: the "Review of the record and its audit trail" sections; the DIVE deviation DEV-2026-0024 and the "Typed by hand" net mass
- **Voice-over:** "The review lists what to look at: corrections, values out of limits, entries typed by hand, and DIVE deviations naming the batch."
- **Caption:** Review with the audit trail

### Step 23: `23-sign-reviewed.png`
- **Highlight:** Centre: the dialog "Sign: Reviewed (second person)" and its summary line "0 corrections, 0 steps sent back …"
- **Voice-over:** "She signs the review. Nobody can review their own work."
- **Caption:** Reviewed by a second person

### Step 24: `24-qc-decision-before.png`
- **Highlight:** Top: both tests reviewed and within limits; middle: the "QC decision" card and the "Sign: QC approved" button
- **Voice-over:** "When every test has a reviewed result, Asha makes the QC decision."
- **Caption:** All tests done, then the decision

### Step 25: `25-qc-approved.png`
- **Highlight:** Middle: the green line "Approved, certificate COA2600010 · Asha Rao"; then "Certificate of analysis (PDF)" on the right
- **Voice-over:** "Approved, and the certificate of analysis is issued at once."
- **Caption:** Approved, certificate issued

### Step 26: `26-coa-pdf.png`
- **Highlight:** The PDF page: the header with the Medhanta QLIMS emblem; the results table (99.6 % and 89 %, Complies); the "APPROVED by Asha Rao" line
- **Voice-over:** "The CoA shows only reviewed results, with limits, methods and the signed decision."
- **Caption:** Certificate of analysis, ready to send

## Chapter 6: Out of specification (≈ 44 s)

**Title card:** "Medhanta QLIMS · Out of specification" · subtitle "OOS investigation, linked to Medhanta DIVE"

### Step 27: `27-oos-result.png`
- **Highlight:** Right: the red card "8.6, Limit 6.0 to 8.0, Out of limits"; bottom: "Add a deviation note first" and the greyed "Done"
- **Voice-over:** "Ravi tests ceftriaxone batch TI260020: pH eight point six, out of limits. A note is needed before signing."
- **Caption:** Out of limits: note required

### Step 28: `28-oos-list.png`
- **Highlight:** Middle: the row "OOS260001 · pH (10 % solution): 8.6 · Phase I"
- **Voice-over:** "The OOS, out of specification, opens at once. Nothing is hidden or retested quietly."
- **Caption:** OOS opened automatically

### Step 29: `29-oos-phase1a.png`
- **Highlight:** Middle: the "Phase Ia: laboratory checklist" with every item answered
- **Voice-over:** "Phase one checks the lab: calculation, instrument, standards, method. No lab error is found."
- **Caption:** Phase I: laboratory checklist

### Step 30: `30-oos-phase2-dive.png`
- **Highlight:** Middle: "Phase II: manufacturing investigation" with "Deviation DEV-2026-0031 (filed in DIVE from this OOS)"
- **Voice-over:** "Phase two moves to manufacturing, in Medhanta DIVE. Its deviation is linked and read live."
- **Caption:** Phase II linked to Medhanta DIVE

### Step 31: `31-oos-confirm-sign.png`
- **Highlight:** Centre: the dialog "Sign: QA approved (OOS)" with "OOS confirmed" and the reason
- **Voice-over:** "When DIVE closes the deviation, QA confirms the OOS with a signature."
- **Caption:** QA confirms the OOS

### Step 32: `32-oos-confirmed.png`
- **Highlight:** Middle: "closed in DIVE" on the phase II line; then the red "OOS confirmed" conclusion and the History list below
- **Voice-over:** "Every phase stays on the record, with names and times."
- **Caption:** Full OOS history kept

### Step 33: `33-sample-rejected.png`
- **Highlight:** Middle: the red "Rejected: OOS confirmed (OOS260001, deviation DEV-2026-0031)" line in "QC decision"
- **Voice-over:** "The batch is rejected. A confirmed OOS leaves no other choice."
- **Caption:** Batch rejected

## Chapter 7: Lab inventory (≈ 12 s)

**Title card:** "Medhanta QLIMS · Lab inventory" · subtitle "Only usable items can be picked"

### Step 34: `34-inventory.png`
- **Highlight:** Middle: the red "Not usable" chips on RS250007 (past retest date), RG260002 (expired) and MD260001 (growth promotion not tested); then the green "Usable" items
- **Voice-over:** "Standards, reagents, media and columns are tracked. Expired or untested items cannot be used."
- **Caption:** Expired items cannot be used

### Step 35: `35-column-usage.png`
- **Highlight:** Bottom: the "Runs" table with analysis LA2600019 on column CO260001
- **Voice-over:** "Each column knows every run it was used in."
- **Caption:** Every use is logged

## Chapter 8: Environmental monitoring (≈ 39 s)

**Title card:** "Medhanta QLIMS · Environmental monitoring" · subtitle "Plans, sampling, excursions"

### Step 36: `36-em-plan.png`
- **Highlight:** Middle: the plan in plain words: points B101-SP1, SP2 and SP3 with their limits "NMT 5 CFU (alert above 3)"
- **Voice-over:** "Environmental monitoring, EM, follows an approved plan for the grade B filling room."
- **Caption:** An approved monitoring plan

### Step 37: `37-em-due-today.png`
- **Highlight:** Middle: "Due today" rows B101-SP1 and B101-SP2 with their orange "Take" buttons; then "Per batch" B101-SP3
- **Voice-over:** "Ravi sees what is due today."
- **Caption:** What is due today

### Step 38: `38-em-taken.png`
- **Highlight:** Top: the yellow bar "Sample LS2600014 taken"; the green "Done" chips and the sample numbers
- **Voice-over:** "Each plate taken becomes a sample, ready for the lab."
- **Caption:** Plates taken, samples made

### Step 39: `39-em-resample-reason.png`
- **Highlight:** Centre of the dialog: the red message "already taken for batch TI260021 … give the reason to take it again" and the empty "Taken already: why again" box
- **Voice-over:** "Sampling the same point again for the same batch needs a reason. No silent re-sampling."
- **Caption:** Re-sampling needs a reason

### Step 40: `40-em-excursion-dive.png`
- **Highlight:** Centre: "7 CFU; limit not more than 5 CFU: OUT OF LIMITS", then the deviation number DEV-2026-0032
- **Voice-over:** "One plate grows seven colonies, over the action limit. The investigation opens with its DIVE deviation."
- **Caption:** Over the action limit

### Step 41: `41-em-excursion.png`
- **Highlight:** Top: "Excursion at B101-SP1" with the red "Action" chip; middle: "Investigation: Deviation DEV-2026-0032"
- **Voice-over:** "The excursion keeps the point, result, limit and deviation together."
- **Caption:** Excursion tracked to closure

### Step 42: `42-em-map.png`
- **Highlight:** Middle: the room map: B101-SP1 in red with 7 CFU, B101-SP2 green with 1 CFU
- **Voice-over:** "The EM map shows each point's latest result at a glance."
- **Caption:** The room at a glance

## Chapter 9: Stability studies (≈ 19 s)

**Title card:** "Medhanta QLIMS · Stability" · subtitle "Protocol, chambers, pulls on time"

### Step 43: `43-stability-protocol.png`
- **Highlight:** Middle: "Conditions and time points": 30 °C / 75 % RH long-term to 36 months, 40 °C / 75 % RH accelerated
- **Voice-over:** "An approved stability protocol sets conditions, time points and the specification."
- **Caption:** An approved stability protocol

### Step 44: `44-stability-new-study.png`
- **Highlight:** Centre: the dialog "New stability study": batch TB260010 from TrueBatch, chambers CH-01 and CH-02
- **Voice-over:** "Meera places batch TB260010 on study, in chambers Medhanta LEAD says are fit."
- **Caption:** Batch placed in qualified chambers

### Step 45: `45-stability-study.png`
- **Highlight:** Middle: the "Schedule" table: two "Pulled" rows with samples LS2600017 and LS2600018, then due dates and windows
- **Voice-over:** "Every pull has a due date and a window. Each pull becomes a sample."
- **Caption:** Pulls scheduled and tracked

## Chapter 10: Trends and reports (≈ 18 s)

**Title card:** "Medhanta QLIMS · Trends" · subtitle "Control charts, APQR data, workload"

### Step 46: `46-trends-chart.png`
- **Highlight:** Middle: the control chart of FG-CPM4 assay over ten batches, with control and specification lines
- **Voice-over:** "Control charts show every batch's result, with rule breaks flagged."
- **Caption:** Control charts per test

### Step 47: `47-apqr-summary.png`
- **Highlight:** Middle: the "Results" table (Assay, Dissolution: results, min, max, mean, Cpk); then "Method and specification changes"
- **Voice-over:** "The annual product review data is ready, with export to CSV or PDF."
- **Caption:** APQR data in one click

### Step 48: `48-workload.png`
- **Highlight:** Top: "Open tests by due date" with "Pick an analyst" and "Assign"; then the "Analysts" table
- **Voice-over:** "And the lab head sees open tests by due date and assigns them."
- **Caption:** Workload by due date

## Chapter 11: Records you can trust (≈ 22 s)

**Title card:** "Medhanta QLIMS · Records you can trust" · subtitle "Corrections, signatures, PDF copies"

### Step 49: `49-correction-before.png`
- **Highlight:** Centre: the dialog "Correct: Net mass", 201.4 mg and the "Reason for the correction"
- **Voice-over:** "A typing error? Correct it, with a reason."
- **Caption:** Corrections need a reason

### Step 50: `50-correction-after.png`
- **Highlight:** Middle-left: the struck-through "210.4 mg" with the reason; right: the History line "Corrected Net mass"; bottom: "Sign again: done"
- **Voice-over:** "The old value stays visible, crossed out, and the step must be signed again."
- **Caption:** Nothing is deleted

### Step 51: `51-analysis-record-pdf.png`
- **Highlight:** The PDF page: the Medhanta QLIMS header, then each stage's values, results and "Who and when"
- **Voice-over:** "Any analysis prints as a complete record for inspection."
- **Caption:** Complete analysis record

### Step 52: `52-analysis-record-signatures.png`
- **Highlight:** Lower half: the "Signatures" table (issued, performed, verified, reviewed) and the training line
- **Voice-over:** "Every signature is in the copy: who, when and what it means."
- **Caption:** Every signature in the copy

## Outro (≈ 15 s)

**Voice-over:** "Medhanta QLIMS: samples, worksheets, OOS, certificates, monitoring and stability, signed and traceable, linked to MMS, TrueBatch, LEAD, EQUIP and DIVE. To see it with your lab's data, book a demo with Medhanta."

**End card:** Medhanta QLIMS emblem logo (brand/medhanta-qlims-logo.png) centred · "Medhanta QLIMS" · "Laboratory information management for pharma QC labs" · small "by Medhanta" line with medhanta-logo.png · button-style text **"Book a demo"** · gradient bar. Hold 4 s.

## Timing

| Part | Screens | Duration |
|---|---|---|
| Intro | title card | 13 s |
| 1 Welcome | 01 | 7 s |
| 2 Specifications and methods | 02–05 | 28 s |
| 3 Samples come in | 06–10 | 34 s |
| 4 The analyst's worksheet | 11–20 | 60 s |
| 5 Review, approval and certificate | 21–26 | 36 s |
| 6 Out of specification | 27–33 | 44 s |
| 7 Lab inventory | 34–35 | 12 s |
| 8 Environmental monitoring | 36–42 | 39 s |
| 9 Stability studies | 43–45 | 19 s |
| 10 Trends and reports | 46–48 | 18 s |
| 11 Records you can trust | 49–52 | 22 s |
| Outro and end card | end card | 15 s |
| **Total** | 52 screens | **≈ 5 min 47 s** |
