# Claude Design prompt: Medhanta QLIMS feature walkthrough

Paste this whole file into Claude Design. Attach the files in the order given in files-to-attach.md.

## The video
- Make a **calm, step-by-step tutorial video** (not an ad) for **Medhanta QLIMS** (say "cue-lims"), by Medhanta: laboratory information management for pharma QC labs: specifications and methods, samples, analysis worksheets, OOS, review and certificates of analysis, lab inventory, environmental monitoring, stability and trends.
- Audience: plant heads, QC and QA users, lab heads and buyers. Plain language; explain a GMP term in about three words when it first appears (OOS = out of specification, CoA = certificate of analysis, EM = environmental monitoring, APQR = annual product review).
- Format: **16:9, 1920×1080**. Target length **3–6 minutes** (plan ≈ 5 min 47 s).
- Story: one day in the QC lab of the fictional "Medhanta Demo Plant, Unit 2": a lot of **Chlorphenamine maleate (API)**, **RM260412**, arrives from **Medhanta MMS**; tablet batch **TB260010** of **Chlorphenamine maleate 4 mg sugar-coated tablets (FG-CPM4)** from **TrueBatch Tablets** is tested, reviewed and approved with a certificate; batch **TI260020** of **Ceftriaxone 1 g powder for injection (FG-CFX1)** from **TrueBatch Injectables** fails pH and goes through OOS with its phase II deviation in **Medhanta DIVE**; the grade B filling room is monitored; batch TB260010 starts its stability study; then trends and records. Instrument status comes from **Medhanta LEAD**, qualification from **Medhanta EQUIP**, training from **Medhanta TIDE**. All people, products and batch numbers are fictional demo data.
- Name the product **"Medhanta QLIMS"** everywhere: every title card, every caption card, the intro and the end card. Never "Medhanta LIMS".

## How to use the screenshots
- Use the **attached real screenshots (01–52) in numeric order**, one step each, full frame.
- **Do not redraw, restyle, crop away or alter the UI** in the screenshots. Only add overlays on top.
- For each step: a **gentle zoom (about 1.1–1.4×)** towards the highlighted element, a **highlight** (soft rounded rectangle or circle in Medhanta orange #e8500f), and an **animated cursor** that moves to the highlighted element (and "clicks" on buttons).
- The app content sits in a centred column (x ≈ 360–1560); specification, plan and protocol review pages are wider (x ≈ 140–1780). Zoom into the content so small text is readable. Screens 26, 51 and 52 are PDF pages on a dark grey background: zoom into the named lines.
- Use **cross-fades** between consecutive screens of the same flow, especially before → after pairs: 03→04→05, 07→08→09, 11→12, 13→14, 15→16, 18→19→20, 21→22→23, 24→25→26, 27→28, 29→30, 31→32→33, 34→35, 37→38→39, 40→41→42, 43→44→45, 49→50, 51→52.
- **Captions on**: show the short caption for each step in the lower third: a white card, Inter, dark text #2b2b2b, a thin gradient line above, and a small **"Medhanta QLIMS"** tag (with the small emblem) at the left of every caption card.
- Voice-over: calm, friendly, clear tutorial tone; use the voice-over lines below as written. Apply the pronunciation rules at the end of this prompt ("QLIMS" = "cue-lims").

## Brand
- **Product logo:** use the product emblem logo for Medhanta QLIMS, **brand/medhanta-qlims-logo.png** (attached), as THE logo on the intro title card, on every chapter title card and on the end card. Use **brand/medhanta-qlims-apple-touch-icon.png** (the emblem alone, 180 px) as a small corner watermark during the walkthrough.
- **Maker:** **brand/medhanta-logo.png** is the maker's logo; use it only small, in a "by Medhanta" line under the product name on the intro and end cards. (If the QLIMS emblem logo were missing, use the Medhanta logo instead.)
- Primary orange **#e8500f**; gradient **`linear-gradient(90deg,#dd1a10,#f4511e 55%,#f7941d)`** for thin accent bars, title-card underlines and the progress bar; grey **#5f5f5f** for secondary text; background #faf8f6; body text #2b2b2b.
- Font **Inter** (fallback Segoe UI, system-ui). See brand/brand.md for details. The screenshots already show the Medhanta QLIMS branding in the app's top bar and the PDF headers; keep them as they are.

## Rules
- **No invented numbers** (no savings, percentages, customer counts or time savings), **no testimonials**, no claims beyond what the screens show.
- Do not add features that are not on the screenshots.
- Medhanta MMS, TrueBatch Tablets, TrueBatch Injectables, Medhanta LEAD, Medhanta EQUIP, Medhanta TIDE and Medhanta DIVE appear only as sources of data inside QLIMS's screens; do not draw their own screens.

## Structure
- **Intro title card:** Medhanta QLIMS emblem logo · "Medhanta QLIMS" · "Laboratory information management for pharma QC labs" · small "by Medhanta" line. Voice-over: "Paper worksheets, logbooks and spreadsheets: one missed check can hold a batch. Medhanta QLIMS puts the whole QC lab on one screen, with every step signed." Caption: Medhanta QLIMS: the QC lab, on one screen.
- **Chapter 1 title card: "Medhanta QLIMS · Welcome"** · "Your own Medhanta login" · ≈ 7 s · screens 01–01
- **Chapter 2 title card: "Medhanta QLIMS · Specifications and methods"** · "Written, checked, approved, then effective" · ≈ 28 s · screens 02–05
- **Chapter 3 title card: "Medhanta QLIMS · Samples come in"** · "Lots from MMS, batches from TrueBatch" · ≈ 34 s · screens 06–10
- **Chapter 4 title card: "Medhanta QLIMS · The analyst's worksheet"** · "Step by step, checked against limits" · ≈ 60 s · screens 11–20
- **Chapter 5 title card: "Medhanta QLIMS · Review and certificate"** · "Second-person review, QC decision, CoA" · ≈ 36 s · screens 21–26
- **Chapter 6 title card: "Medhanta QLIMS · Out of specification"** · "OOS investigation, linked to Medhanta DIVE" · ≈ 44 s · screens 27–33
- **Chapter 7 title card: "Medhanta QLIMS · Lab inventory"** · "Only usable items can be picked" · ≈ 12 s · screens 34–35
- **Chapter 8 title card: "Medhanta QLIMS · Environmental monitoring"** · "Plans, sampling, excursions" · ≈ 39 s · screens 36–42
- **Chapter 9 title card: "Medhanta QLIMS · Stability"** · "Protocol, chambers, pulls on time" · ≈ 19 s · screens 43–45
- **Chapter 10 title card: "Medhanta QLIMS · Trends"** · "Control charts, APQR data, workload" · ≈ 18 s · screens 46–48
- **Chapter 11 title card: "Medhanta QLIMS · Records you can trust"** · "Corrections, signatures, PDF copies" · ≈ 22 s · screens 49–52
- Each chapter title card: the QLIMS emblem small at the top, the kicker "Medhanta QLIMS", the chapter title large, the subtitle, gradient underline. About 2 s each (included in the chapter durations).
- **Outro:** voice-over "Medhanta QLIMS: samples, worksheets, OOS, certificates, monitoring and stability, signed and traceable, linked to MMS, TrueBatch, LEAD, EQUIP and DIVE. To see it with your lab's data, book a demo with Medhanta."
- **End card:** Medhanta QLIMS emblem logo (medhanta-qlims-logo.png) centred, "Medhanta QLIMS", "Laboratory information management for pharma QC labs", small "by Medhanta" line with medhanta-logo.png, button-style text **"Book a demo"**, gradient bar. Hold 4 s.

## Per-step script (follow demo-script.md attached; this table is the same content)

| # | Screenshot | Highlight (where) | Caption | Voice-over |
|---|---|---|---|---|
| | **Ch 1: Medhanta QLIMS · Welcome** | title card ("Your own Medhanta login") | Medhanta QLIMS · Welcome | |
| 1 | 01-sign-in.png | Centre: the Medhanta QLIMS emblem, then the orange "Sign in" button below it | Medhanta QLIMS: your own login | "Everyone signs in with their own Medhanta login. No shared accounts." |
| | **Ch 2: Medhanta QLIMS · Specifications and methods** | title card ("Written, checked, approved, then effective") | Medhanta QLIMS · Specifications and methods | |
| 2 | 02-methods.png | Centre: the methods table, the green "Effective" chips and the "validated" column; then the orange "Start a trial analysis" buttons on the right | Validated, versioned test methods | "Test methods are versioned masters. Each one is validated before routine use." |
| 3 | 03-spec-review.png | Middle: the plain-words view listing "Assay (HPLC)" and "Dissolution (45 min)" with their limits; then the green "Master check: No problems" box on the right | Specification in plain words | "The tablet specification lists each test, its method and its limit, in plain words. Farhan wrote it, Deepa checked it." |
| 4 | 04-spec-approve-sign.png | Centre: the dialog "Sign: Approved" with "Change control number: CC-2026-118", then the orange "Sign" button | QA approves with change control | "Asha from QA approves it with the change control number and her e-signature." |
| 5 | 05-spec-effective.png | Top-left: the history list "Sent for review, Checked, Approved by QA, Made effective · Kiran Joshi"; the green "Effective" chip in the title line | Only the effective version is used | "A second QA person makes it effective. Only the effective version is ever used." |
| | **Ch 3: Medhanta QLIMS · Samples come in** | title card ("Lots from MMS, batches from TrueBatch") | Medhanta QLIMS · Samples come in | |
| 6 | 06-samples-waiting.png | Middle: the "Waiting to be sampled" list: lot RM260412 from MMS, then batches TB260010 and TI260020 from TrueBatch | Lots and batches arrive on their own | "The list fills itself: lots in quarantine from Medhanta MMS, and batches from TrueBatch Tablets and TrueBatch Injectables." |
| 7 | 07-register-api-lot.png | Centre of the dialog: the "Sampling plan" box "sample 4 of 9 containers (1 + √9 = 4.00, rounded up = 4)" and the container numbers 1, 3, 6, 9 | Sampling plan worked out for you | "Meera registers the chlorphenamine maleate lot. The sampling plan works out how many containers to open." |
| 8 | 08-sample-registered.png | Top-left: sample number "LS2600010 · Registered"; then the "Tests" table with "Assay (HPLC)" and its limit | Tests come from the specification | "The sample gets its number and the tests from the effective specification." |
| 9 | 09-chain-of-custody.png | Middle: the "Chain of custody" card: Registered, Received in QC, Stored on shelf B2, each with name and time | Chain of custody, step by step | "Received and stored: the chain of custody records who did what, and when." |
| 10 | 10-sample-tb260010.png | Top: "Source: From TrueBatch: TrueBatch Tablets batch TB260010"; then the two tests, Assay and Dissolution | Batch facts pulled from TrueBatch | "The finished-product sample of tablet batch TB260010 comes straight from TrueBatch Tablets. No retyping." |
| | **Ch 4: Medhanta QLIMS · The analyst's worksheet** | title card ("Step by step, checked against limits") | Medhanta QLIMS · The analyst's worksheet | |
| 11 | 11-start-analysis.png | Centre: the dialog "Start an analysis" for QC-M-201 and sample LS2600011, then "Next: sign" | A worksheet from the method | "Meera starts the HPLC assay. The worksheet is built from the method." |
| 12 | 12-analysis-screen.png | Top: analysis number "LA2600019" and the three stage tiles "Sample weighing, HPLC run, Result" | Stages in the right order | "Each stage opens in turn, so steps cannot be skipped." |
| 13 | 13-balance-picker.png | Left: the "Balance" card BAL-01, then the line "Not offered: BAL-02 is due for requalification" | Only qualified instruments offered | "Only qualified balances are offered. BAL-02 is due for requalification in Medhanta EQUIP." |
| 14 | 14-balance-weighed.png | Left: "From LEAD: BAL-01: in service" and "From EQUIP: BAL-01: qualified"; right: the green "Within limits" result | Status from LEAD and EQUIP | "The balance status comes from Medhanta LEAD. The mass is checked against its target." |
| 15 | 15-checker-my-work.png | Top: the yellow row "Weigh: Powder of 20 tablets" under "Waiting for your check", and the "Check →" link on the right | Second-person check | "Arjun sees the weighing waiting for his check, on his own device." |
| 16 | 16-step-checked.png | Right: the history lines "Signed: performed · Meera Pillai" and "Signed: verified (second person) · Arjun Desai" | Performed and verified, both signed | "He signs it as checked. Both signatures are on the record." |
| 17 | 17-hplc-refused.png | Left: the red line "HPLC-02 is not fit for use (LEAD): calibration overdue since 20 Nov 2026" | Overdue calibration? Refused | "At the HPLC, Meera tries HPLC-02. Its calibration is overdue in Medhanta LEAD, so it is refused." |
| 18 | 18-assay-result.png | Right: the green result card "99.6 %, Limit 90.0 to 110.0 %, Within limits" | Result checked against the limit | "Ninety-nine point six percent: within limits, worked out by the server." |
| 19 | 19-sign-training.png | Centre of the dialog: the blue box "Your training: trained: SOP-QC-014 HPLC analysis (TIDE)" | Training checked at signing | "Only trained analysts sign. Her training is read from Medhanta TIDE." |
| 20 | 20-same-test-blocked.png | Middle: the greyed button "Start QC-M-201 Chlorphenamine maleate assay by HPLC (LA2600019 is open)" | Same test twice? Blocked, with the reason | "The same test cannot be started twice. The greyed button says why: the assay is already open." |
| | **Ch 5: Medhanta QLIMS · Review and certificate** | title card ("Second-person review, QC decision, CoA") | Medhanta QLIMS · Review and certificate | |
| 21 | 21-to-review.png | Top: the row "LA2600019 · Chlorphenamine maleate assay by HPLC" with the green "Ready for your review" chip | Ready for review | "Sneha, the reviewer, sees the finished assay waiting." |
| 22 | 22-review-audit-trail.png | Middle: the "Review of the record and its audit trail" sections; the DIVE deviation DEV-2026-0024 and the "Typed by hand" net mass | Review with the audit trail | "The review lists what to look at: corrections, values out of limits, entries typed by hand, and DIVE deviations naming the batch." |
| 23 | 23-sign-reviewed.png | Centre: the dialog "Sign: Reviewed (second person)" and its summary line "0 corrections, 0 steps sent back …" | Reviewed by a second person | "She signs the review. Nobody can review their own work." |
| 24 | 24-qc-decision-before.png | Top: both tests reviewed and within limits; middle: the "QC decision" card and the "Sign: QC approved" button | All tests done, then the decision | "When every test has a reviewed result, Asha makes the QC decision." |
| 25 | 25-qc-approved.png | Middle: the green line "Approved, certificate COA2600010 · Asha Rao"; then "Certificate of analysis (PDF)" on the right | Approved, certificate issued | "Approved, and the certificate of analysis is issued at once." |
| 26 | 26-coa-pdf.png | The PDF page: the header with the Medhanta QLIMS emblem; the results table (99.6 % and 89 %, Complies); the "APPROVED by Asha Rao" line | Certificate of analysis, ready to send | "The CoA shows only reviewed results, with limits, methods and the signed decision." |
| | **Ch 6: Medhanta QLIMS · Out of specification** | title card ("OOS investigation, linked to Medhanta DIVE") | Medhanta QLIMS · Out of specification | |
| 27 | 27-oos-result.png | Right: the red card "8.6, Limit 6.0 to 8.0, Out of limits"; bottom: "Add a deviation note first" and the greyed "Done" | Out of limits: note required | "Ravi tests ceftriaxone batch TI260020: pH eight point six, out of limits. A note is needed before signing." |
| 28 | 28-oos-list.png | Middle: the row "OOS260001 · pH (10 % solution): 8.6 · Phase I" | OOS opened automatically | "The OOS, out of specification, opens at once. Nothing is hidden or retested quietly." |
| 29 | 29-oos-phase1a.png | Middle: the "Phase Ia: laboratory checklist" with every item answered | Phase I: laboratory checklist | "Phase one checks the lab: calculation, instrument, standards, method. No lab error is found." |
| 30 | 30-oos-phase2-dive.png | Middle: "Phase II: manufacturing investigation" with "Deviation DEV-2026-0031 (filed in DIVE from this OOS)" | Phase II linked to Medhanta DIVE | "Phase two moves to manufacturing, in Medhanta DIVE. Its deviation is linked and read live." |
| 31 | 31-oos-confirm-sign.png | Centre: the dialog "Sign: QA approved (OOS)" with "OOS confirmed" and the reason | QA confirms the OOS | "When DIVE closes the deviation, QA confirms the OOS with a signature." |
| 32 | 32-oos-confirmed.png | Middle: "closed in DIVE" on the phase II line; then the red "OOS confirmed" conclusion and the History list below | Full OOS history kept | "Every phase stays on the record, with names and times." |
| 33 | 33-sample-rejected.png | Middle: the red "Rejected: OOS confirmed (OOS260001, deviation DEV-2026-0031)" line in "QC decision" | Batch rejected | "The batch is rejected. A confirmed OOS leaves no other choice." |
| | **Ch 7: Medhanta QLIMS · Lab inventory** | title card ("Only usable items can be picked") | Medhanta QLIMS · Lab inventory | |
| 34 | 34-inventory.png | Middle: the red "Not usable" chips on RS250007 (past retest date), RG260002 (expired) and MD260001 (growth promotion not tested); then the green "Usable" items | Expired items cannot be used | "Standards, reagents, media and columns are tracked. Expired or untested items cannot be used." |
| 35 | 35-column-usage.png | Bottom: the "Runs" table with analysis LA2600019 on column CO260001 | Every use is logged | "Each column knows every run it was used in." |
| | **Ch 8: Medhanta QLIMS · Environmental monitoring** | title card ("Plans, sampling, excursions") | Medhanta QLIMS · Environmental monitoring | |
| 36 | 36-em-plan.png | Middle: the plan in plain words: points B101-SP1, SP2 and SP3 with their limits "NMT 5 CFU (alert above 3)" | An approved monitoring plan | "Environmental monitoring, EM, follows an approved plan for the grade B filling room." |
| 37 | 37-em-due-today.png | Middle: "Due today" rows B101-SP1 and B101-SP2 with their orange "Take" buttons; then "Per batch" B101-SP3 | What is due today | "Ravi sees what is due today." |
| 38 | 38-em-taken.png | Top: the yellow bar "Sample LS2600014 taken"; the green "Done" chips and the sample numbers | Plates taken, samples made | "Each plate taken becomes a sample, ready for the lab." |
| 39 | 39-em-resample-reason.png | Centre of the dialog: the red message "already taken for batch TI260021 … give the reason to take it again" and the empty "Taken already: why again" box | Re-sampling needs a reason | "Sampling the same point again for the same batch needs a reason. No silent re-sampling." |
| 40 | 40-em-excursion-dive.png | Centre: "7 CFU; limit not more than 5 CFU: OUT OF LIMITS", then the deviation number DEV-2026-0032 | Over the action limit | "One plate grows seven colonies, over the action limit. The investigation opens with its DIVE deviation." |
| 41 | 41-em-excursion.png | Top: "Excursion at B101-SP1" with the red "Action" chip; middle: "Investigation: Deviation DEV-2026-0032" | Excursion tracked to closure | "The excursion keeps the point, result, limit and deviation together." |
| 42 | 42-em-map.png | Middle: the room map: B101-SP1 in red with 7 CFU, B101-SP2 green with 1 CFU | The room at a glance | "The EM map shows each point's latest result at a glance." |
| | **Ch 9: Medhanta QLIMS · Stability** | title card ("Protocol, chambers, pulls on time") | Medhanta QLIMS · Stability | |
| 43 | 43-stability-protocol.png | Middle: "Conditions and time points": 30 °C / 75 % RH long-term to 36 months, 40 °C / 75 % RH accelerated | An approved stability protocol | "An approved stability protocol sets conditions, time points and the specification." |
| 44 | 44-stability-new-study.png | Centre: the dialog "New stability study": batch TB260010 from TrueBatch, chambers CH-01 and CH-02 | Batch placed in qualified chambers | "Meera places batch TB260010 on study, in chambers Medhanta LEAD says are fit." |
| 45 | 45-stability-study.png | Middle: the "Schedule" table: two "Pulled" rows with samples LS2600017 and LS2600018, then due dates and windows | Pulls scheduled and tracked | "Every pull has a due date and a window. Each pull becomes a sample." |
| | **Ch 10: Medhanta QLIMS · Trends** | title card ("Control charts, APQR data, workload") | Medhanta QLIMS · Trends | |
| 46 | 46-trends-chart.png | Middle: the control chart of FG-CPM4 assay over ten batches, with control and specification lines | Control charts per test | "Control charts show every batch's result, with rule breaks flagged." |
| 47 | 47-apqr-summary.png | Middle: the "Results" table (Assay, Dissolution: results, min, max, mean, Cpk); then "Method and specification changes" | APQR data in one click | "The annual product review data is ready, with export to CSV or PDF." |
| 48 | 48-workload.png | Top: "Open tests by due date" with "Pick an analyst" and "Assign"; then the "Analysts" table | Workload by due date | "And the lab head sees open tests by due date and assigns them." |
| | **Ch 11: Medhanta QLIMS · Records you can trust** | title card ("Corrections, signatures, PDF copies") | Medhanta QLIMS · Records you can trust | |
| 49 | 49-correction-before.png | Centre: the dialog "Correct: Net mass", 201.4 mg and the "Reason for the correction" | Corrections need a reason | "A typing error? Correct it, with a reason." |
| 50 | 50-correction-after.png | Middle-left: the struck-through "210.4 mg" with the reason; right: the History line "Corrected Net mass"; bottom: "Sign again: done" | Nothing is deleted | "The old value stays visible, crossed out, and the step must be signed again." |
| 51 | 51-analysis-record-pdf.png | The PDF page: the Medhanta QLIMS header, then each stage's values, results and "Who and when" | Complete analysis record | "Any analysis prints as a complete record for inspection." |
| 52 | 52-analysis-record-signatures.png | Lower half: the "Signatures" table (issued, performed, verified, reviewed) and the training line | Every signature in the copy | "Every signature is in the copy: who, when and what it means." |

## PRONUNCIATION RULES FOR THE VOICE-OVER (apply to every scene; captions keep normal spelling)

1. Speak naturally, at one steady pace (about 130 words a minute). Never slow down, pause or stretch on abbreviations, numbers or brand names.
2. Letter abbreviations are said as quick, joined letters in ONE beat, like a newsreader, never spelled out slowly with gaps: US = "you-ess" (one quick word), EU = "ee-you", UK = "you-kay", FDA = "eff-dee-ay", QA = "cue-ay", QMS = "cue-em-ess", SOP = "ess-oh-pee", OEE = "oh-ee-ee", IQ / OQ / PQ = "eye-cue", "oh-cue", "pee-cue", MIT = "em-eye-tee", DPDP = "dee-pee-dee-pee", AI = "ay-eye", CEO = "see-ee-oh", CFO = "see-eff-oh", IPC = "eye-pee-see", OOS = "oh-oh-ess", CPV = "see-pee-vee", FMEA = "eff-em-ee-ay", DMAIC = "duh-MAY-ick", 6M = "six-em", PDF = "pee-dee-eff", IST = "eye-ess-tee" (or say "India time"). Also: CoA = "see-oh-ay" (or say "certificate of analysis"), EM = "ee-em", HPLC = "aitch-pee-el-see", API = "ay-pee-eye", APQR = "ay-pee-cue-ar", CFU = "see-eff-you", RH = "ar-aitch", pH = "pee-aitch", CSV = "see-ess-vee". Never read the dots in "U.S." or "e.g."; say "you-ess" and "for example".
3. Abbreviations that are said as WORDS: CAPA = "KAP-uh", SHRM = "shurm", Ipca = "IP-kuh".
4. Web addresses and domains: "." is said "dot", and the ending is said as a word: ".in" = "dot in" (rhymes with "pin"), ".com" = "dot com", ".co.in" = "dot co dot in". Never spell an ending letter by letter ("dot i-n" is wrong).
5. Brand and product names (confirm with Medhanta before final recording): Medhanta = "meh-DHAAN-tah", DIVE = "dive" (one word, like diving), LEAD = "leed", RISE = "rize", TIDE = "tide", ASSURE = "uh-SHOOR", EQUIP = "ee-KWIP", QLIMS = "cue-lims", MMS = "em-em-ess", CLEAR = "clear", TrueBatch = "TROO-batch", Batchwright = "BATCH-rite", Digi = "DIJ-ee" (as in "digital"; "Digi partner" = "DIJ-ee partner", never "DIG-ee"), McKinsey = "muh-KIN-zee", Ranbaxy = "ran-BAK-see", Alexion = "uh-LEK-see-on", Baddi = "BUD-dee".
6. Indian money and numbers, said the Indian way: "₹16 lakh" = "sixteen lakh rupees" (lakh = "laak", rhymes with "rock"), "₹6 crore" = "six crore" (crore = "krore"), "US$4,700" = "forty-seven hundred dollars", "US$10–25 million" = "ten to twenty-five million dollars", "600-batch" = "six-hundred-batch", "60%" = "sixty percent", "2×" = "twice". Never read symbols aloud (₹, $, %, ×, –) as symbol names.
7. Footnote numbers (¹ ² ³) are on screen only. Never say them.
8. If a word could be misread, write it in the voice-over text the way it sounds (for example "DIJ-ee partner", "you-ess", "dot in"), keeping the correct spelling only in the captions.
