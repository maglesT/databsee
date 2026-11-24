# Claude Design prompt: Medhanta EQUIP feature walkthrough

Paste this whole file into Claude Design. Attach the files in the order given in files-to-attach.md.

## The video
- Make a **calm, step-by-step tutorial video** (not an ad) for **Medhanta EQUIP**: equipment qualification and validation protocols for pharma plants. It covers URS, DQ, IQ, OQ, PQ, cleaning, process, method and computer system validation, media fill, transport and periodic review. The product was formerly called "Qualification"; use only the name **Medhanta EQUIP**.
- Audience: plant heads, QA, production, engineering and validation users, and buyers. Use plain language and explain each GMP term in about three words (URS – what it must do; IQ – installed as designed; OQ – works across ranges; PQ – performs in real use; media fill – aseptic filling test).
- Format: **16:9, 1920×1080**. Target length **3–6 minutes** (plan ≈ 5 min 24 s).
- Story: one working day at the fictional "Medhanta Demo Plant, Unit 2". A new fluid bed dryer, FBD-01, goes from user requirements through IQ, then OQ (with a failed step and its discrepancy), then PQ, to *Qualified*. Then the video shows how EQUIP keeps items qualified and how it connects to **Medhanta LEAD** (logbook), **TrueBatch Injectables** and **Medhanta QLIMS**. All people, products and batch numbers are fictional demo data.

## How to use the screenshots
- Use the **attached real screenshots (01–54) in numeric order**, one step each, full frame.
- **Do not redraw, restyle, crop away or alter the UI** in the screenshots. Only add overlays on top.
- For each step, add a **gentle zoom (about 1.1–1.4×)** towards the highlighted element. Add a **highlight** (a soft rounded rectangle or circle in Medhanta orange #e8500f) and an **animated cursor** that moves to the highlighted element (and "clicks" on buttons).
- Use **cross-fades** between consecutive screens of the same flow, especially these before → after sequences: 13→15, 14→15, 18→19, 21→22→23, 29→31, 35→36→37, 48→49→50.
- Screen 53 is a PDF printout (two pages on a grey background): pan slowly from the left page to the right page.
- **Captions on**: show the short caption for each step in the lower third (white card, Inter, dark text #2b2b2b, thin gradient line above).
- Voice-over: use a calm, friendly, clear tutorial tone, and the voice-over lines below as written. Do not read out clock times shown in the screenshots.

## Brand
- **Product logo:** use the product emblem logo for Medhanta EQUIP: **medhanta-equip-logo.png** (attached). It is THE logo for the intro title card, every chapter title card (small, top-left) and the end card. The browser-tab icon is medhanta-equip-favicon.svg / medhanta-equip-32.png, and the mark is medhanta-equip-mark.svg. (If the EQUIP emblem were missing, fall back to medhanta-logo.png.)
- **Maker's logo:** **medhanta-logo.png** is the Medhanta company logo. Use it only for a small "by Medhanta" line on the intro and end cards. medhanta-mark.png may be a tiny corner watermark.
- Primary orange **#e8500f**. Use the gradient **`linear-gradient(90deg,#dd1a10,#f4511e 55%,#f7941d)`** for thin accent bars, title-card underlines and the progress bar. Grey **#5f5f5f** for secondary text, background #faf8f6, body text #2b2b2b.
- Font **Inter** (fallback Segoe UI, system-ui). See brand/brand.md.
- Every title card and caption names the product as **"Medhanta EQUIP"**. Never "Qualification", "Qualification by Medhanta" or "Batchwright".

## Rules
- **No invented numbers** (no savings, percentages, customer counts or time savings), **no testimonials**, and no claims beyond what the screens show.
- Do not add features that are not on the screenshots. Do not redraw or alter the UI in the screenshots.

## Structure
- **Intro title card:** medhanta-equip-logo.png large · "Medhanta EQUIP" · "Equipment qualification and validation protocols, on screen" · small "by Medhanta" (medhanta-logo.png) · ≈ 14 s. Voice-over: "Qualifying a new machine means a URS, IQ, OQ and PQ: paper binders, wet signatures, failed steps to track and review dates to remember. Let's follow one new dryer at our demo plant from requirements to Qualified."
- **Chapter 1 title card: "Medhanta EQUIP · Welcome to Medhanta EQUIP"** · "Equipment qualification, without the paper" · ≈ 8 s · screens 01–01
- **Chapter 2 title card: "Medhanta EQUIP · The plant at a glance"** · "What is due, what needs me?" · ≈ 22 s · screens 02–05
- **Chapter 3 title card: "Medhanta EQUIP · A new dryer and its URS"** · "URS: what it must do" · ≈ 24 s · screens 06–09
- **Chapter 4 title card: "Medhanta EQUIP · IQ: installed as designed"** · "Write, approve, execute" · ≈ 44 s · screens 10–17
- **Chapter 5 title card: "Medhanta EQUIP · OQ: a step fails"** · "Discrepancy, fix, retest" · ≈ 42 s · screens 18–25
- **Chapter 6 title card: "Medhanta EQUIP · Review and report"** · "Second person, then QA" · ≈ 32 s · screens 26–31
- **Chapter 7 title card: "Medhanta EQUIP · PQ: qualified"** · "Three real batches" · ≈ 46 s · screens 32–40
- **Chapter 8 title card: "Medhanta EQUIP · Keeping it qualified"** · "Changes, reviews, calibration" · ≈ 26 s · screens 41–45
- **Chapter 9 title card: "Medhanta EQUIP · Connected across Medhanta"** · "LEAD, TrueBatch, QLIMS" · ≈ 36 s · screens 46–51
- **Chapter 10 title card: "Medhanta EQUIP · Ready for inspection"** · "History, PDF, audit trail" · ≈ 16 s · screens 52–54
- **Outro:** voice-over "Medhanta EQUIP: from URS to Qualified, every step approved, run, reviewed and signed on screen, and connected to LEAD, TrueBatch and QLIMS. Book a demo to see it with your own equipment."
- **End card:** medhanta-equip-logo.png centred · "Medhanta EQUIP" · button-style text **"Book a demo"** · small "by Medhanta" with medhanta-logo.png · gradient bar. Hold 4 s.

## Per-step script (follow demo-script.md attached; this table is the same content)

| # | Screenshot | Highlight (where) | Caption | Voice-over |
|---|---|---|---|---|
| | **Ch 1: Welcome to Medhanta EQUIP** | title card: "Medhanta EQUIP · Welcome to Medhanta EQUIP" · "Equipment qualification, without the paper" | Medhanta EQUIP · Welcome to Medhanta EQUIP | |
| 1 | 01-sign-in.png | Centre: the Medhanta EQUIP emblem, then the orange "Sign in" button | Sign in with your Medhanta login | This is Medhanta EQUIP: qualification and validation protocols, written, approved and run on screen. Everyone signs in with their own Medhanta login. |
| | **Ch 2: The plant at a glance** | title card: "Medhanta EQUIP · The plant at a glance" · "What is due, what needs me?" | Medhanta EQUIP · The plant at a glance | |
| 2 | 02-home-qa.png | Top: the red "Items overdue for review" tile and its "Show the list" link (centre-top) | QA sees what waits for her | Asha Rao, our QA Head, starts on My work: what to approve, and which items are overdue or due for review. |
| 3 | 03-items-due.png | Top-left: the "Due or overdue" filter; rows TAB-01 (red "Overdue") and BLN-01 (amber "Due soon") | Due and overdue in one click | One click on the tile opens just the items that are due or overdue. No spreadsheet needed. |
| 4 | 04-items-list.png | Status column (green "Qualified", amber "Qualified with conditions") and the Kind column, incl. "Lab instrument" | Every item, its status and date | The Items list holds everything that needs qualifying: equipment, utilities, rooms, systems, processes, cleaning, methods, routes and lab instruments. |
| 5 | 05-home-engineer.png | Top: the tiles "Protocols to write" and "Protocols to execute"; then the "To execute" table | Engineering's own to-do list | Neha Iyer from Engineering sees her own list: protocols to write, run and report. |
| | **Ch 3: A new dryer and its URS** | title card: "Medhanta EQUIP · A new dryer and its URS" · "URS: what it must do" | Medhanta EQUIP · A new dryer and its URS | |
| 6 | 06-item-add-master.png | Centre form: "Master item (ID and name from master data)" showing "FBD-01 · Fluid bed dryer, 120 kg"; then the orange "Add" button (right) | Picked from master data, not typed | A new fluid bed dryer, FBD-01, has arrived. Neha picks it from the Medhanta master data, so its ID and name are the same in every product. |
| 7 | 07-item-new.png | Top-right: the grey "Not qualified" chip; bottom: Status history row "Item created" | Starts as Not qualified | It starts as Not qualified, and its status history begins. |
| 8 | 08-new-urs.png | Lower centre: "From a template" and the Template box "User requirements (URS)" | Fourteen built-in templates | She starts from one of fourteen built-in templates. First the URS, the user requirements: what the dryer must do. |
| 9 | 09-urs-requirements.png | Centre: requirements URS-01 to URS-06 and the ticked "GMP-critical" boxes on the right | Requirements, GMP-critical flagged | Each requirement gets an ID and a GMP-critical flag. QA approves the URS with an e-signature. |
| | **Ch 4: IQ: installed as designed** | title card: "Medhanta EQUIP · IQ: installed as designed" · "Write, approve, execute" | Medhanta EQUIP · IQ: installed as designed | |
| 10 | 10-iq-draft-checks.png | Upper left: the line "6 things to complete before it can be signed Prepared" | The system lists what's missing | Next, the IQ, installation qualification: is it installed as designed? The system lists what is still missing before it can be signed. |
| 11 | 11-iq-instruments-lead.png | Centre: the instrument rows and the four green "from LEAD" chips beside "Calibration due" (right) | Calibration dates from LEAD | Instruments are picked from master data. Their calibration due dates come straight from Medhanta LEAD, the logbook. Nothing is retyped. |
| 12 | 12-iq-steps.png | Step 4: "URS-03" and the ticked "Evidence attachment required"; Step 5: Unit "µm", Maximum "0.8" | Steps with acceptance criteria | Each test step has an acceptance criterion, a result type, an optional link to a URS requirement, and can require an evidence file. |
| 13 | 13-iq-sign-prepared.png | Centre dialog "Sign Prepared": the meaning text and the orange "Sign" button; the note "Sign opens a small window…" | Author signs Prepared | Neha signs it Prepared. The meaning is shown first, and the Medhanta platform asks for her password again. |
| 14 | 14-iq-approve-before.png | Centre dialog "Approve protocol": "I approve this protocol for execution" and "Sign" | QA approves with an e-signature | Asha reviews it and approves it with her own e-signature. |
| 15 | 15-iq-approve-after.png | Green "Approved" chip (top-right); Signatures list, "(as signed)" in the header line | Approved, signatures recorded | The protocol is approved and effective. Each signature keeps the item exactly as it was when signed. |
| 16 | 16-iq-execute.png | Steps 3 and 4: the attached certificate links and the green "Pass" chips (right) | Evidence attached per step | Vikram Shah from Production runs the IQ on screen. He attaches the calibration and material certificates as evidence. |
| 17 | 17-iq-sign-performed.png | Centre dialog "Sign Performed: run 1" and its orange "Sign" button | Executor signs Performed | When every step is recorded, he signs Performed for the run. |
| | **Ch 5: OQ: a step fails** | title card: "Medhanta EQUIP · OQ: a step fails" · "Discrepancy, fix, retest" | Medhanta EQUIP · OQ: a step fails | |
| 18 | 18-oq-fail-preview.png | Step 2: Result "64.8" and the red "Fail" chip; the criterion "Inlet air 58–62 °C" (right) | The system judges the number | Now the OQ, operational qualification: does it work across its ranges? At 60 °C the inlet air reads 64.8. The system marks it Fail at once. |
| 19 | 19-oq-discrepancy-open.png | Yellow notice "The result fails, so discrepancy D-1 is open"; red "D-1 open" chip on Step 2 | Failure opens a discrepancy | Saving the failed result opens a discrepancy, a recorded failure, automatically. |
| 20 | 20-discrepancy-form.png | Fields "Investigation and root cause" and "Conclusion"; Action box "Retest the step" | Root cause, impact, action | Neha records what happened, the root cause, the impact, and the action: retest the step. |
| 21 | 21-discrepancy-close-sign.png | Centre dialog "Close D-1" with Asha's meaning text and "Sign" | QA closes it | QA agrees with the investigation and closes the discrepancy with her e-signature. |
| 22 | 22-discrepancy-closed.png | Top-right: green "Closed" chip on D-1 | Closed, nothing lost | The discrepancy is closed and stays part of the record. |
| 23 | 23-oq-retest-pass.png | Step 2: "60.4 °C" with green "Pass"; below it "Attempt 1: 64.8 °C — fail" | Retest passes, first attempt kept | After the fix, the retest passes at 60.4. The failed attempt stays visible. |
| 24 | 24-oq-correction.png | Step 4: "3,120 m³/h" and the small line "corrected: Typing error …" under it | Corrections need a reason | A typing error is corrected with a reason. The old value stays in the record. |
| 25 | 25-oq-performed.png | Bottom: green box "Run 1: all steps recorded. Performed: signed by Vikram Shah" | OQ run signed Performed | All steps are recorded, and the run is signed Performed. |
| | **Ch 6: Review and report** | title card: "Medhanta EQUIP · Review and report" · "Second person, then QA" | Medhanta EQUIP · Review and report | |
| 26 | 26-pq-gate-blocked.png | Bottom: red line "The item's OQ report is not released yet…" | The stage gate holds | The PQ is ready, but it cannot start until the OQ is released. The stage gate holds. |
| 27 | 27-oq-review-sign.png | Centre dialog "Sign Results reviewed" (Priya Nair) | Second-person review | Priya Nair from Validation, who entered none of the results, reviews every result, attempt and discrepancy, and signs. |
| 28 | 28-oq-report-results.png | Table "Results against the acceptance criteria": Step 2 "Attempt 1: 64.8 °C / Attempt 2: 60.4 °C" | The report writes itself | The report is generated from the results: every run, every attempt, every discrepancy. |
| 29 | 29-oq-report-prepare-sign.png | Centre dialog "Sign Report prepared" | Author signs the report | Neha adds the conclusion and outcome, and signs the report Prepared. |
| 30 | 30-oq-report-qa-approve.png | "QA approval" box: Next review date and the grey line "Master data: requalification every 12 months…" | Review date from master data | QA decides the release. The next review date follows the requalification frequency kept in master data. |
| 31 | 31-oq-report-approved.png | Bottom box: "Release: Released for the next stage" | OQ released | The OQ report is approved and released. The PQ can now start. |
| | **Ch 7: PQ: qualified** | title card: "Medhanta EQUIP · PQ: qualified" · "Three real batches" | Medhanta EQUIP · PQ: qualified | |
| 32 | 32-pq-protocol-change.png | Form "Change a step during execution": What happened, Justification, the new Instruction (orange outline) | Change a step, with justification | After the first batch, QA asks for more drying samples. Neha raises a protocol change with a justification. QA approves it. |
| 33 | 33-pq-runs.png | Run tabs "Run 1 ✓, Run 2 ✓, Run 3 ✓" (left) and the blue "D-1 change applied" chip (right) | Three batches, run by run | Three full batches, DEMO-24-001 to 003, are dried and recorded run by run with the changed step. |
| 34 | 34-home-qa-pq-waiting.png | "To approve" table: PRT-2026-0017 with the blue "Report prepared" chip | Waiting for QA | The PQ report is prepared and waits on Asha's My work. |
| 35 | 35-pq-qa-approve-before.png | "Item status: Qualified", Next review date "22/11/2027" and the master-data line below it | Qualified, next review set | She sets the item to Qualified. The next review date is offered from master data, a year on. |
| 36 | 36-pq-qa-approve-after.png | Yellow notice "Report approved. The item status is updated."; green "Closed" chip | Approved and closed | She approves with her e-signature. The protocol is closed. |
| 37 | 37-item-qualified.png | Top-right: green "Qualified" chip; "Next review 22 Nov 2027"; the four protocols URS→IQ→OQ→PQ | FBD-01 is qualified | FBD-01 is now Qualified, with its next review date and all four protocols in one place. |
| 38 | 38-item-traceability.png | Left: requirement URS-01 · GMP-critical; right: the steps that test it and their Pass chips per run | Every requirement, traced | The traceability view shows every requirement, the steps that tested it, and their results. |
| 39 | 39-item-status-history.png | "Status history" table: the "Qualified" row on top with its reason | Status history, with reasons | Every status change is kept, with the reason and who made it. |
| 40 | 40-items-equipment.png | Row FBD-01: green "Qualified" and "22 Nov 2027" | Back in the list, qualified | Back in the Items list, filtered to equipment, FBD-01 shows Qualified. |
| | **Ch 8: Keeping it qualified** | title card: "Medhanta EQUIP · Keeping it qualified" · "Changes, reviews, calibration" | Medhanta EQUIP · Keeping it qualified | |
| 41 | 41-requal-needed.png | Top-right: red "Requalification needed" chip; yellow notice "Marked…" | After a change: requalify | A change in room C-12? QA marks it Requalification needed, with the change-control reason. |
| 42 | 42-periodic-review.png | Sections "Period covered", "Changes", "Calibration and maintenance history" | Periodic review, same template | Periodic reviews use their own template: changes, deviations, calibration and maintenance for the period. |
| 43 | 43-copy-protocol.png | "Copy a previous protocol" selected; "PRT-2026-0015 · Installation qualification (IQ)…" | Copy a protocol, never results | The second dryer, FBD-02, can start from a copy of FBD-01's IQ: sections and steps, never results. |
| 44 | 44-protocols-list.png | Step column chips (Approved, Closed, Draft, Executing) | Every protocol and its step | The Protocols list shows every protocol and its step in the lifecycle. |
| 45 | 45-calibration-warning.png | Yellow notice "Calibration overdue: TOC-01 TOC analyser (due 30 Oct 2026)…" | Overdue instrument flagged | During cleaning validation, LEAD shows the TOC analyser is overdue for calibration, so EQUIP warns before it's used. |
| | **Ch 9: Connected across Medhanta** | title card: "Medhanta EQUIP · Connected across Medhanta" · "LEAD, TrueBatch, QLIMS" | Medhanta EQUIP · Connected across Medhanta | |
| 46 | 46-cleaning-matrix.png | "Products that share the equipment train": PCM-500 and IBU-400 cards with PDE, doses and batch size | Product matrix from master data | Cleaning validation now has a product matrix: the products sharing the train, from master data, with their health-based limits. |
| 47 | 47-cleaning-limits.png | "Calculated limits": acceptance limit line at the top and the worst-case row (right) | Residue limits, calculated | The system calculates the residue limit for every product pair, names the worst case, and puts it on the swab and rinse steps. |
| 48 | 48-media-fill-operators.png | "Operators taking part": three people picked; the "Pick a person…" box | Media fill: people picked, not typed | New: the media fill template, an aseptic process simulation for a filling line. Operators are picked from the platform's people list. |
| 49 | 49-media-fill-counts.png | Step 1 "5,200 units"; Step 3 "5,190 units incubated, 10 removed" (bottom) | Every unit accounted for | Units filled, incubated and removed are counted and checked. Every unit must be accounted for. |
| 50 | 50-media-fill-approve.png | "Next media fill due" and the grey line "…at least every 6 months, so at the latest 22 May 2027" | TrueBatch Injectables checks this | QA sets the next media fill, at most six months on. TrueBatch Injectables reads it before any aseptic filling on that line. |
| 51 | 51-lab-instrument.png | Kind "Lab instrument" and the green "Qualified" chip (top-right) | Lab instruments, for QLIMS | Lab instruments are qualified as items too, so Medhanta QLIMS can check an instrument is qualified before use. |
| | **Ch 10: Ready for inspection** | title card: "Medhanta EQUIP · Ready for inspection" · "History, PDF, audit trail" | Medhanta EQUIP · Ready for inspection | |
| 52 | 52-pq-history.png | "Signatures": the struck-through Prepared line "superseded by a later change" and the version rows | Every version, every signature | The History tab keeps every version, its reason and every signature. |
| 53 | 53-protocol-pdf.png | Left page header: Medhanta EQUIP emblem, "Item: … (as signed, master version 1)" | One PDF for the inspector | One PDF holds the approved protocol, results, discrepancies, report and signatures. |
| 54 | 54-audit-trail.png | Filter "vikram.shah"; the columns Before / After / Reason | Audit trail: who, when, what | The audit trail shows who did what and when, with values before and after. |

Total ≈ 5 min 24 s including intro, title cards and end card.

## PRONUNCIATION RULES FOR THE VOICE-OVER (apply to every scene; captions keep normal spelling)

1. Speak naturally, at one steady pace (about 130 words a minute). Never slow down, pause or stretch on abbreviations, numbers or brand names.
2. Letter abbreviations are said as quick, joined letters in ONE beat, like a newsreader, never spelled out slowly with gaps: US = "you-ess" (one quick word), EU = "ee-you", UK = "you-kay", FDA = "eff-dee-ay", QA = "cue-ay", QMS = "cue-em-ess", SOP = "ess-oh-pee", OEE = "oh-ee-ee", IQ / OQ / PQ = "eye-cue", "oh-cue", "pee-cue", URS = "you-ar-ess", PDF = "pee-dee-eff", PDE = "pee-dee-ee", MACO = "MAH-koh", LOD = "el-oh-dee", HPLC = "aitch-pee-el-see", TOC = "tee-oh-see", MIT = "em-eye-tee", DPDP = "dee-pee-dee-pee", AI = "ay-eye", CEO = "see-ee-oh", CFO = "see-eff-oh". Never read the dots in "U.S." or "e.g."; say "you-ess" and "for example".
3. Abbreviations that are said as WORDS: CAPA = "KAP-uh", SHRM = "shurm", Ipca = "IP-kuh".
4. Web addresses and domains: "." is said "dot", and the ending is said as a word: ".in" = "dot in" (rhymes with "pin"), ".com" = "dot com", ".co.in" = "dot co dot in". Never spell an ending letter by letter ("dot i-n" is wrong).
5. Brand and product names (confirm with Medhanta before final recording): Medhanta = "meh-DHAAN-tah", Batchwright = "BATCH-rite", Digi = "DIJ-ee" (as in "digital"; "Digi partner" = "DIJ-ee partner", never "DIG-ee"), McKinsey = "muh-KIN-zee", Ranbaxy = "ran-BAK-see", Alexion = "uh-LEK-see-on", Baddi = "BUD-dee", LEAD = "leed", DIVE = "dive", RISE = "rise", TIDE = "tide", ASSURE = "uh-SHOOR", EQUIP = "ee-KWIP" ("Medhanta EQUIP" = "meh-DHAAN-tah ee-KWIP"), QLIMS = "cue-lims", MMS = "em-em-ess", CLEAR = "clear", TrueBatch = "TROO-batch".
6. Indian money and numbers, said the Indian way: "₹16 lakh" = "sixteen lakh rupees" (lakh = "laak", rhymes with "rock"), "₹6 crore" = "six crore" (crore = "krore"), "US$4,700" = "forty-seven hundred dollars", "US$10–25 million" = "ten to twenty-five million dollars", "600-batch" = "six-hundred-batch", "60%" = "sixty percent", "2×" = "twice". Never read symbols aloud (₹, $, %, ×, –) as symbol names.
7. Footnote numbers (¹ ² ³) are on screen only. Never say them.
8. If a word could be misread, write it in the voice-over text the way it sounds (for example "DIJ-ee partner", "you-ess", "dot in"), keeping the correct spelling only in the captions.
