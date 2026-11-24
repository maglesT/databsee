# Claude Design prompt: Medhanta DIVE feature walkthrough

Paste this whole file into Claude Design. Attach the files in the order given in files-to-attach.md.

## The video
- Make a **calm, step-by-step tutorial video** (not an ad) for **Medhanta DIVE** (Deviations, Investigations & CAPA; formerly "Deviations & CAPA"), by Medhanta: deviation management, investigations and the CAPA register for a GMP pharma plant.
- Audience: plant heads, QA, production and engineering users, and buyers. Plain language; explain a GMP term in about three words when it first appears.
- Format: **16:9, 1920×1080**. Target length **3–6 minutes** (plan ≈ 5 min 38 s).
- Story: one deviation at the fictional "Medhanta Demo Plant, Unit 2": core hardness below limit on tablet press PRESS-01 while compressing **Chlorphenamine maleate 4 mg sugar-coated tablets (FG-CPM4), batch TB260011** (the TrueBatch Tablets story), followed from the shop floor through QA triage, investigation (with data pulled from **TrueBatch Tablets** and **Medhanta LEAD**), CAPA, effectiveness check and signed closure, then the lists, trends and records around it. All people, products and batch numbers are fictional demo data.
- Name the product **"Medhanta DIVE"** everywhere: every title card, every caption card, the intro and the end card. Never call it "Deviations & CAPA".

## How to use the screenshots
- Use the **attached real screenshots (01–53) in numeric order**, one step each, full frame.
- **Do not redraw, restyle, crop away or alter the UI** in the screenshots. Only add overlays on top.
- For each step: a **gentle zoom (about 1.1–1.4×)** towards the highlighted element, a **highlight** (soft rounded rectangle or circle in Medhanta orange #e8500f), and an **animated cursor** that moves to the highlighted element (and "clicks" on buttons).
- The app content sits in a centred column (x ≈ 360–1560); zoom into that column so small text is readable. Screens 52–53 are printed PDF pages on a grey background: zoom into the page header and the named lines.
- Use **cross-fades** between consecutive screens of the same flow, especially before → after pairs: 04→05→06→07, 09→10, 11→12, 13→14, 18→19→20→21, 22→23→24→25→26, 27→28→29, 30→31, 32→33, 34→35, 36→37, 38→39→40→41, 44→45→46, 48→49, 52→53.
- **Captions on**: show the short caption for each step in the lower third: a white card, Inter, dark text #2b2b2b, a thin gradient line above, and a small **"Medhanta DIVE"** tag (with the small emblem) at the left of every caption card.
- Voice-over: calm, friendly, clear tutorial tone; use the voice-over lines below as written. Apply the pronunciation rules at the end of this prompt.

## Brand
- **Product logo:** use the product emblem logo for Medhanta DIVE, **brand/medhanta-dive-logo.png** (attached), as THE logo on the intro title card, on every chapter title card and on the end card. Use **brand/medhanta-dive-180.png** (the emblem alone) as a small corner watermark during the walkthrough.
- **Maker:** **brand/medhanta-logo.png** is the maker's logo; use it only small, in a "by Medhanta" line under the product name on the intro and end cards. (If the DIVE emblem were missing, use the Medhanta logo instead.)
- Primary orange **#e8500f**; gradient **`linear-gradient(90deg,#dd1a10,#f4511e 55%,#f7941d)`** for thin accent bars, title-card underlines and the progress bar; grey **#5f5f5f** for secondary text; background #faf8f6; body text #2b2b2b.
- Font **Inter** (fallback Segoe UI, system-ui). See brand/brand.md for details. The screenshots already show the current Medhanta DIVE branding in the app's top bar and in the PDF headers; keep them as they are.

## Rules
- **No invented numbers** (no savings, percentages, customer counts or time savings), **no testimonials**, no claims beyond what the screens show.
- Do not add features that are not on the screenshots. In particular, do not show an AI assistant: the optional AI helper is switched off in this demo.
- TrueBatch Tablets, Medhanta LEAD, Medhanta QLIMS and Medhanta RISE appear only as sources of data inside DIVE's screens; do not draw their own screens.

## Structure
- **Intro title card:** Medhanta DIVE emblem · "Medhanta DIVE" · "Deviations, Investigations & CAPA, from the shop floor to a signed close" · small "by Medhanta" line. Voice-over: "Something went wrong on the line. Now what? Let's follow one deviation at our demo plant, from the moment it is reported to the signed closure, and see how Medhanta DIVE keeps every step clear, on time and traceable."
- **Chapter 1 title card: "Medhanta DIVE · Welcome"** · "One sign-in for the whole Medhanta suite" · ≈ 8 s · screens 01–01
- **Chapter 2 title card: "Medhanta DIVE · Set up once"** · "Site, target dates and lists" · ≈ 10 s · screens 02–02
- **Chapter 3 title card: "Medhanta DIVE · Raised on the floor"** · "Report in a minute, batch picked from TrueBatch" · ≈ 30 s · screens 03–07
- **Chapter 4 title card: "Medhanta DIVE · QA triage"** · "Classify, assign, or say: not a deviation" · ≈ 44 s · screens 08–15
- **Chapter 5 title card: "Medhanta DIVE · The investigation helper"** · "Hints, history and data from TrueBatch and LEAD" · ≈ 36 s · screens 16–21
- **Chapter 6 title card: "Medhanta DIVE · Finding the root cause"** · "Proven tools, saved as you work" · ≈ 46 s · screens 22–29
- **Chapter 7 title card: "Medhanta DIVE · CAPA"** · "Corrective and preventive actions, with owners and dates" · ≈ 24 s · screens 30–33
- **Chapter 8 title card: "Medhanta DIVE · Did it work?"** · "Verify, then check effectiveness" · ≈ 22 s · screens 34–37
- **Chapter 9 title card: "Medhanta DIVE · Closure"** · "Final impact, batch decision, signature" · ≈ 24 s · screens 38–41
- **Chapter 10 title card: "Medhanta DIVE · See it all"** · "Overdue lists, CAPA register, batch check, trends" · ≈ 34 s · screens 42–47
- **Chapter 11 title card: "Medhanta DIVE · Records you can trust"** · "Corrections, history, audit trail, PDF" · ≈ 34 s · screens 48–53
- Each chapter title card: the DIVE emblem small at the top, the kicker "Medhanta DIVE", the chapter title large, the subtitle, gradient underline. About 2 s each (included in the chapter durations).
- **Outro:** voice-over "Medhanta DIVE: report, investigate, act, check and close, all signed and traceable, with data pulled from TrueBatch and Medhanta LEAD. Book a demo to see it with your own plant's data."
- **End card:** Medhanta DIVE emblem (medhanta-dive-logo.png) centred, "Medhanta DIVE", "Deviations, Investigations & CAPA", small "by Medhanta" line with medhanta-logo.png, button-style text **"Book a demo"**, gradient bar. Hold 4 s.

## Per-step script (follow demo-script.md attached; this table is the same content)

| # | Screenshot | Highlight (where) | Caption | Voice-over |
|---|---|---|---|---|
| | **Ch 1: Medhanta DIVE · Welcome** | title card ("One sign-in for the whole Medhanta suite") | Medhanta DIVE · Welcome | |
| 1 | 01-sign-in.png | Centre: the Medhanta DIVE emblem, then the orange "Sign in" button below it | Medhanta DIVE: your own login | "Everyone signs in with their own Medhanta login. One sign-in for the whole suite, and no shared accounts." |
| | **Ch 2: Medhanta DIVE · Set up once** | title card ("Site, target dates and lists") | Medhanta DIVE · Set up once | |
| 2 | 02-admin-settings.png | Top: "Site and target dates" card with "Medhanta Demo Plant, Unit 2" and the three target-day boxes; then the "Areas" list below | Site, target dates and lists | "An administrator sets the site name, the target days to close, and the lists of areas and deviation types. Who may do what is ticked per person in Medhanta's people screen." |
| | **Ch 3: Medhanta DIVE · Raised on the floor** | title card ("Report in a minute, batch picked from TrueBatch") | Medhanta DIVE · Raised on the floor | |
| 3 | 03-home-operator.png | Top-right: the orange "Report a deviation" button; then the count tiles (Waiting for me, Overdue, Open) | Anyone can report | "Priya runs the tablet press. At the two-forty in-process check, IPC for short, the cores are too soft. She reports it straight away." |
| 4 | 04-batch-pick-before.png | Middle: the filled Title and "What happened" fields; then the empty "Pick or type the batch number" box under "Product and batch" | What, where, when | "She writes what happened, the area, the machine and the time." |
| 5 | 05-batch-picked.png | Middle-left: batch "TB260011" and the product "FG-CPM4" filled in next to it | Batch picked from TrueBatch | "The batch is picked from TrueBatch Tablets, our batch record, and the product comes with it. No typing errors in batch numbers." |
| 6 | 06-report-form-impact.png | Middle: the three "Initial impact assessment" answers (Yes, Not known yet, Not known yet), then "Action taken" at the bottom | First impact and immediate action | "She gives a first view of the impact, and what she did at once: press stopped, cores on hold, QA informed." |
| 7 | 07-report-saved.png | Top-left: the heading "DEV-2026-0026 · Core hardness below limit at compression"; then the green next-step bar "QA classifies the deviation" | A number at once | "Saved. The deviation has its number, and the page says what happens next." |
| | **Ch 4: Medhanta DIVE · QA triage** | title card ("Classify, assign, or say: not a deviation") | Medhanta DIVE · QA triage | |
| 8 | 08-qa-home-waiting.png | Middle: the row "DEV-2026-0026 · Core hardness below limit at compression" in the "Waiting for me" list | Waiting for QA | "Asha, the QA head, sees the new report waiting for her, next to the other reports of the day." |
| 9 | 09-classify-form.png | Top: "Major" selected, Type "Equipment", Investigator "Neha Iyer"; then the small line under the impact text saying the batch was picked from the batch record (no tick needed) | Classify and assign | "She classifies it as major, writes the impact and assigns Neha from engineering to investigate. The batch came from TrueBatch, so it is already checked." |
| 10 | 10-classified.png | Top: the status bar "Investigation · Major · Target date 22 Dec 2026" and the DMAIC bar below | Target date and progress | "A target date is set from the classification. The progress bar follows the DMAIC steps: define, measure, analyse, improve, control." |
| 11 | 11-not-a-deviation-sign.png | Centre: the dialog "Sign: Cancelled: not a deviation" with the typed reason | Not a deviation: reason and signature | "Not every report is a deviation. This missing log reading was on the paper back-up log. Asha cancels it with a reason and her e-signature." |
| 12 | 12-not-a-deviation-done.png | Top: the yellow card "Cancelled by QA: not a deviation" with reason, signer and time | Kept on record, clearly marked | "Nothing is deleted. The report stays on record, clearly marked, and is left out of trends and overdue lists." |
| 13 | 13-planned-approve-sign.png | Centre: the dialog "Sign: Approved (planned deviation may proceed)"; then the line "Sign opens a small window where you enter your password again" | Planned change? Approve first | "A planned change needs QA approval first. At every signature you enter your password again, so the signature is really yours." |
| 14 | 14-planned-approved.png | Middle: the green line "Approved (planned deviation may proceed) · Asha Rao · 22 Nov, 18:12 IST" | Signed approval on record | "Approved, with name, date and meaning on the record." |
| 15 | 15-qlims-oos-picked.png | Top: the "OOS from QLIMS" picker with OOS260007; then the filled title, the area "QC laboratory (Medhanta LIMS)" and the "From QLIMS OOS" chip next to batch TB260118 | OOS picked from Medhanta QLIMS | "An out-of-specification result, OOS, works the same way: QA picks it from Medhanta QLIMS and the details fill in." |
| | **Ch 5: Medhanta DIVE · The investigation helper** | title card ("Hints, history and data from TrueBatch and LEAD") | Medhanta DIVE · The investigation helper | |
| 16 | 16-investigator-home.png | Middle: the one row DEV-2026-0026 in Neha's "Waiting for me" list | Assigned to the investigator | "Neha opens her list. The deviation is waiting for her." |
| 17 | 17-things-to-look-at.png | Top: the "same equipment" hint (PRESS-01 had 2 other deviations in 90 days); then "Similar earlier cases" with their root causes | Hints and similar cases | "Before she starts, DIVE shows things to look at: the same press had problems before, and here are similar earlier cases with their causes and CAPAs." |
| 18 | 18-data-fetch-before.png | Middle: the "Data collection" card and its "Fetch related data" button on the right | Fetch related data | "One click collects the data she needs." |
| 19 | 19-data-fetch-after.png | Middle: "Batch record (TrueBatch)" and its "Equipment used" table: FBD-01, PRESS-01 and HT-01 for batch TB260011 | Batch data from TrueBatch | "From TrueBatch Tablets: the batch status, and every machine and room the batch used, step by step." |
| 20 | 20-lead-findings.png | Top: the first finding "HT-01 calibration was overdue at the event"; then the breakdown entry "PRESS-01 ... upper punch sticking ... refitted" | Logbook findings from Medhanta LEAD | "From Medhanta LEAD, the equipment logbook: the hardness tester was overdue for calibration, and the press had a breakdown repair the day before. Read-only, kept as a copy with a checksum." |
| 21 | 21-attachment.png | Middle: the attached file "ipc-hardness-printout.pdf" with name and time | Evidence attached | "She attaches the tester printout. Attachments are never deleted." |
| | **Ch 6: Medhanta DIVE · Finding the root cause** | title card ("Proven tools, saved as you work") | Medhanta DIVE · Finding the root cause | |
| 22 | 22-is-is-not.png | Top: the Is / Is Not table (What, Where, When, Who, Extent) | Is / Is Not narrows it down | "Is, is not: what happened, and what did not. It narrows the search to press one, since the repair." |
| 23 | 23-six-m.png | Middle: "Machine / equipment" and "Method" boxes marked "Ruled in"; the others "Ruled out" | 6M with evidence | "The six-M fishbone checks people, machine, method, material, measurement and environment, each with evidence." |
| 24 | 24-five-whys.png | Top: Why 1 to Why 4, ending "The SOP was written for planned maintenance, not for breakdown repairs" | 5 Whys to the system cause | "Five whys go past the symptom to the system cause: the restart after a repair never checked the force setting." |
| 25 | 25-barriers-fmea.png | Top: the three barriers with "Did not work", "Not present", "Worked"; then the FMEA row "Score 4 × 3 × 2 = 24" | Barriers and risk score | "Barrier analysis shows which checks failed. The FMEA, a risk score, uses the same one-to-five scale as Medhanta ASSURE." |
| 26 | 26-root-cause-batches.png | Middle: the "Root cause" text; then "Other batches checked": TB260010 and TB260009, "Not affected" | Root cause and other batches | "She writes the root cause and checks the other batches made on the press. Both were made before the repair, so they are not affected." |
| 27 | 27-investigation-sign.png | Centre: the dialog "Sign: Investigation complete" and its "Sign" button | Signed by the investigator | "She signs the investigation complete." |
| 28 | 28-fishbone-signed.png | Middle: the fishbone diagram with "Machine / equipment" and "Method" marked ruled in | The fishbone at a glance | "The signed record shows the fishbone, with the causes that were ruled in." |
| 29 | 29-dmaic-progress.png | Top: the DMAIC bar with Define, Measure and Analyze done, Improve in progress | Three steps done | "Define, measure and analyse are done. Now to improve." |
| | **Ch 7: Medhanta DIVE · CAPA** | title card ("Corrective and preventive actions, with owners and dates") | Medhanta DIVE · CAPA | |
| 30 | 30-capa-raise-form.png | Top: "Raise a CAPA for this deviation": Corrective, what must be done, Strength, Owner "Neha Iyer", Due date | Owner, due date, strength | "Asha raises CAPAs, corrective and preventive actions, each with an owner, a due date and a strength." |
| 31 | 31-capas-raised.png | Middle: the three CAPA rows with owners and due dates; the "strong" tag on the LEAD calibration block | Three CAPAs raised | "Three CAPAs: restore the force setting, fix the restart procedure, and block an overdue instrument in Medhanta LEAD." |
| 32 | 32-capa-done-before.png | Middle: the "Mark as done" box with Neha's note and work order; then the "Mark done" button | Owner marks it done | "Neha does the work and records what was done, with the record references." |
| 33 | 33-capa-done-after.png | Top: the status chip "Done" and the next step for QA; then the history rows "CAPA raised", "CAPA done" | Back to QA | "Now it is back with QA." |
| | **Ch 8: Medhanta DIVE · Did it work?** | title card ("Verify, then check effectiveness") | Medhanta DIVE · Did it work? | |
| 34 | 34-capa-verify.png | Middle: "Dedicated effectiveness check" with the check date and how it will be checked; then "Sign verified" | Verify and plan the check | "QA verifies the action and decides how to prove it worked: a dedicated check by a date." |
| 35 | 35-capa-check-due.png | Top: "Effectiveness check due" with the check date | Check date tracked | "The check date is tracked like any other due date." |
| 36 | 36-effectiveness-before.png | Middle: "Effective" selected with the evidence text; then "Sign and close" | Effective, with evidence | "When the check is done, QA records the result with evidence." |
| 37 | 37-capa-closed.png | Top: the green "Closed" status; then the signed lines "Verified" and "Closed" in the record | CAPA closed | "The CAPA is closed, every step signed." |
| | **Ch 9: Medhanta DIVE · Closure** | title card ("Final impact, batch decision, signature") | Medhanta DIVE · Closure | |
| 38 | 38-closure-form.png | Middle: "Close the deviation": closure summary, final impact answers, batch disposition notes | Final impact and batch decision | "To close, QA gives the final impact and the batch decision: soft cores rejected, the rest may go on to coating." |
| 39 | 39-closure-sign.png | Centre: the dialog "Sign: Closed" | Signed closed | "And signs it closed." |
| 40 | 40-closed.png | Top: the status "Closed"; the DMAIC bar | Closed on time | "Closed, within the target date." |
| 41 | 41-closed-control.png | Middle: "Closure and effectiveness": "CAPAs closed: 1 of 3" and "2 still open (followed in the CAPA list)", then "Closed · Asha Rao · 22 Nov, 18:14 IST" | Open CAPAs stay tracked | "Open CAPAs do not block closure. They stay on the CAPA list until they are done and checked." |
| | **Ch 10: Medhanta DIVE · See it all** | title card ("Overdue lists, CAPA register, batch check, trends") | Medhanta DIVE · See it all | |
| 42 | 42-home-overdue.png | Middle: the "Overdue" tab and the red "Overdue" dates in the list | Overdue at a glance | "Overdue deviations are always one click away, in red." |
| 43 | 43-capa-register.png | Top: the filters; then the Source column (deviation, internal audit, complaint, management review) | One CAPA register | "The CAPA register holds every CAPA, from deviations, audits, complaints and reviews, with filters." |
| 44 | 44-batch-check.png | Top: the search box "tb 260011", then the result row DEV-2026-0026, "Closed" with its open CAPAs | Batch check before release | "Before release, the batch check shows every deviation that names a batch, however the number was written." |
| 45 | 45-trends-chart.png | Top: the bar chart of deviations per month; then the area table below | Trends per month | "Trends show deviations per month, by area, type or class." |
| 46 | 46-trends-pareto.png | Top: "Unusual months: Compression, Nov 26"; then the root-cause Pareto and the red repeat flags | Unusual months and repeats | "Unusual months are flagged, and the root-cause chart shows which causes keep coming back." |
| 47 | 47-rise-cpv-filed.png | Top: the title "Continued process verification: Tablet weight, batch TB260131"; then "Operations CPV (automatic)" in the report | Sent from Medhanta RISE | "And when QA sends an out-of-trend signal from Medhanta RISE, continued process verification, it arrives here as a deviation, once." |
| | **Ch 11: Medhanta DIVE · Records you can trust** | title card ("Corrections, history, audit trail, PDF") | Medhanta DIVE · Records you can trust | |
| 48 | 48-correction-before.png | Bottom: the field "Reason for the correction" and the "Save correction" button | Corrections need a reason | "Need to correct a record? Give a reason." |
| 49 | 49-correction-after.png | Middle: "Corrected · version 2" with the reason; then the old version 1 shown below | Old version kept | "The old version stays readable, with who changed what and why." |
| 50 | 50-deviation-history.png | Middle: the History table in plain words: Reported, Classified, Data fetched, Investigation complete, CAPA raised, Closed; times like "22 Nov, 18:13 IST" | History in plain words | "Every deviation carries its own history, in plain words, with one clear time format in plant time." |
| 51 | 51-audit-trail.png | Top: green "Integrity check: passed" with "Run now"; then the WHAT and AFTER columns | Audit trail and integrity check | "QA can search the audit trail, with old and new values. An integrity check runs every night, or on demand." |
| 52 | 52-pdf-copies.png | Top-left of each page: the Medhanta DIVE emblem and name in the header; left page the deviation, right page the CAPA | PDF copies, ready for inspection | "For reviews and inspections, print a PDF of any deviation or CAPA, with the Medhanta DIVE header." |
| 53 | 53-pdf-signatures-history.png | Left page: the signature line "Signed: Closed · Asha Rao · 22 Nov 2026, 18:14 IST"; right page: the history table | Signatures and history included | "Signatures, data collected and the full history are in the copy, dates written in full." |

## PRONUNCIATION RULES FOR THE VOICE-OVER (apply to every scene; captions keep normal spelling)

1. Speak naturally, at one steady pace (about 130 words a minute). Never slow down, pause or stretch on abbreviations, numbers or brand names.
2. Letter abbreviations are said as quick, joined letters in ONE beat, like a newsreader, never spelled out slowly with gaps: US = "you-ess" (one quick word), EU = "ee-you", UK = "you-kay", FDA = "eff-dee-ay", QA = "cue-ay", QMS = "cue-em-ess", SOP = "ess-oh-pee", OEE = "oh-ee-ee", IQ / OQ / PQ = "eye-cue", "oh-cue", "pee-cue", MIT = "em-eye-tee", DPDP = "dee-pee-dee-pee", AI = "ay-eye", CEO = "see-ee-oh", CFO = "see-eff-oh", IPC = "eye-pee-see", OOS = "oh-oh-ess", CPV = "see-pee-vee", FMEA = "eff-em-ee-ay", DMAIC = "duh-MAY-ick", 6M = "six-em", PDF = "pee-dee-eff", IST = "eye-ess-tee" (or say "India time"). Never read the dots in "U.S." or "e.g."; say "you-ess" and "for example".
3. Abbreviations that are said as WORDS: CAPA = "KAP-uh", SHRM = "shurm", Ipca = "IP-kuh".
4. Web addresses and domains: "." is said "dot", and the ending is said as a word: ".in" = "dot in" (rhymes with "pin"), ".com" = "dot com", ".co.in" = "dot co dot in". Never spell an ending letter by letter ("dot i-n" is wrong).
5. Brand and product names (confirm with Medhanta before final recording): Medhanta = "meh-DHAAN-tah", DIVE = "dive" (one word, like diving), LEAD = "leed", RISE = "rize", TIDE = "tide", ASSURE = "uh-SHOOR", EQUIP = "ee-KWIP", QLIMS = "cue-lims", MMS = "em-em-ess", CLEAR = "clear", TrueBatch = "TROO-batch", Batchwright = "BATCH-rite", Digi = "DIJ-ee" (as in "digital"; "Digi partner" = "DIJ-ee partner", never "DIG-ee"), McKinsey = "muh-KIN-zee", Ranbaxy = "ran-BAK-see", Alexion = "uh-LEK-see-on", Baddi = "BUD-dee".
6. Indian money and numbers, said the Indian way: "₹16 lakh" = "sixteen lakh rupees" (lakh = "laak", rhymes with "rock"), "₹6 crore" = "six crore" (crore = "krore"), "US$4,700" = "forty-seven hundred dollars", "US$10–25 million" = "ten to twenty-five million dollars", "600-batch" = "six-hundred-batch", "60%" = "sixty percent", "2×" = "twice". Never read symbols aloud (₹, $, %, ×, –) as symbol names.
7. Footnote numbers (¹ ² ³) are on screen only. Never say them.
8. If a word could be misread, write it in the voice-over text the way it sounds (for example "DIJ-ee partner", "you-ess", "dot in"), keeping the correct spelling only in the captions.
