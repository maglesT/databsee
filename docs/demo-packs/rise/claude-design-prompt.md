# Claude Design prompt: Medhanta RISE feature walkthrough

Paste this whole file into Claude Design. Attach the files in the order given in files-to-attach.md.

## The video
- Make a **calm, step-by-step tutorial video** (not an ad) for **Medhanta RISE** (Operations, OEE and machine-learning insights; formerly called "Operations / OEE"): OEE (overall equipment effectiveness), losses, explainable machine-learning insights and CPV (continued process verification, "watching every batch's process") for pharma plants, fed by the TrueBatch batch records.
- Audience: plant heads, production, QA and engineering users, and buyers. Plain language; explain each term in a few words: **OEE** – overall equipment effectiveness = availability × performance × quality · **availability** – ran when planned · **performance** – ran at full speed · **quality** – good units of all made · **TEEP** – OEE over all calendar time · **ideal rate** – fastest proven speed · **approved range** – limits from the master batch record · **IPC** – in-process checks · **MTTR / MTBF** – time to repair / between breakdowns · **golden batch** – good reference batches · **CPV** – continued process verification, "watching every batch's process" · **Cpk** – how well the process fits its limits · **Nelson rules** – eight standard warning patterns on a chart.
- Format: **16:9, 1920×1080**. Target length **3–6 minutes** (plan ≈ 5 min 42 s).
- Story: One production day (Sunday 22 Nov 2026, an extra shift) at the fictional **Medhanta Demo Plant, Unit 2**. Products are the TrueBatch products: **FG-CPM4** Chlorphenamine Maleate Tablets 4 mg (sugar-coated; TrueBatch Tablets batches TB260009–TB260011) and **FG-CFX1** Ceftriaxone for Injection 1 g (powder for injection; TrueBatch Injectables batches TI260019–TI260021). Their machine runs, yields and step readings come over the read-only TrueBatch links. Tablet presses TP-01 / TP-02 and coater CO-01 (Line A) carry the app's own 200-day demo history of FG-CPM4 (batches CPM2600–CPM2885) and today's hand-typed batches CPM2886 and CPM2887. The engineer refreshes the TrueBatch links, the operator records a shift by hand, the production head reviews OEE and losses, QA reviews parameters and machine-learning insights, builds a CPV plan, sends an out-of-specification batch to Medhanta DIVE and signs the CPV report; running batches are scored. All people, products and batch numbers are fictional demo data.

## How to use the screenshots
- Use the **attached real screenshots (01–58) in numeric order**, one step each, full frame.
- **Do not redraw, restyle, crop away or alter the UI** in the screenshots. Only add overlays on top.
- For each step: a **gentle zoom (about 1.1–1.4×)** towards the highlighted element, a **highlight** (soft rounded rectangle or circle in Medhanta orange #e8500f), and an **animated cursor** that moves to the highlighted element (and "clicks" on buttons).
- Use **cross-fades** between consecutive screens of the same flow, especially before → after pairs: 03→04, 08→09, 10→11, 13→14, 15→16, 17→18, 19→20, 31→32, 35→36, 37→38, 41→42, 49→50, 51→52.
- Screens 48, 53 and 58 are PDF printouts on a grey background: pan slowly from the top of the page to the footer line at the bottom.
- **Captions on**: show the short caption for each step in the lower third (white card, Inter, dark text #2b2b2b, thin gradient line above), always starting with "Medhanta RISE:" as in the table.
- Voice-over: calm, friendly, clear tutorial tone; use the voice-over lines below as written. Do not read out numbers or clock times shown in the screenshots.

## Brand
- Primary orange **#e8500f**; gradient **`linear-gradient(90deg,#dd1a10,#f4511e 55%,#f7941d)`** for thin accent bars, title-card underlines and the progress bar; grey **#5f5f5f** for secondary text; background #faf8f6; body text #2b2b2b.
- Font **Inter** (fallback Segoe UI, system-ui).
- **Product logo: `medhanta-rise-logo.png`** (the Medhanta RISE emblem logo) on the intro title card, every chapter title card and the end card. Use the product emblem logo for Medhanta RISE if attached; otherwise the Medhanta logo. The mark `medhanta-rise-mark.svg` (or `medhanta-mark.png`) may be a small corner watermark during the walkthrough.
- `medhanta-logo.png` is used **only** for a small "by Medhanta" line under the product logo (intro and end card), never as the main logo.
- Every title card says "Medhanta RISE". See brand/brand.md for colours and spacing.

## Rules
- **No invented numbers** (no savings, OEE gains, percentages, customer counts or time savings), **no testimonials**, no claims beyond what the screens show. The figures visible in the screenshots are the app's demo data; do not quote or animate them as results.
- The machine-learning and CPV parts are **advisory**, except the CPV report QA signs: never say the app changes settings, releases batches or files deviations by itself (QA sends a signal; Medhanta DIVE files it).
- Do not add features that are not on the screenshots. Do not redraw or alter the UI in the screenshots.

## Structure
- **Intro title card:** "Medhanta RISE" · "Operations, OEE and machine-learning insights" · medhanta-rise-logo.png · "by Medhanta" · ≈ 12 s. Voice-over: "Every shift, machines stop, slow down and make rejects, and every batch leaves process values behind. Let's follow one production day with Medhanta RISE, from sign-in to the signed process review."
- **Chapter 1 title card: "Medhanta RISE · Welcome to Medhanta RISE"** · "Sign in once, through Medhanta" · ≈ 15 s · screens 01–02
- **Chapter 2 title card: "Medhanta RISE · Batch records flow in"** · "TrueBatch links, read-only" · ≈ 24 s · screens 03–06
- **Chapter 3 title card: "Medhanta RISE · Targets and the plan"** · "Ideal rates, planned hours, approved ranges" · ≈ 27 s · screens 07–11
- **Chapter 4 title card: "Medhanta RISE · Recording the shift by hand"** · "For machines without a batch-record link" · ≈ 24 s · screens 12–16
- **Chapter 5 title card: "Medhanta RISE · Spreadsheets and corrections"** · "Import a shift sheet; fix with a reason" · ≈ 18 s · screens 17–20
- **Chapter 6 title card: "Medhanta RISE · OEE at a glance"** · "Availability × performance × quality" · ≈ 23 s · screens 21–24
- **Chapter 7 title card: "Medhanta RISE · Where the time went"** · "Losses, largest first" · ≈ 11 s · screens 25–26
- **Chapter 8 title card: "Medhanta RISE · Process parameters"** · "Charts, capability and Nelson rules" · ≈ 22 s · screens 27–30
- **Chapter 9 title card: "Medhanta RISE · Smart suggestions and golden batches"** · "Machine learning that explains itself" · ≈ 33 s · screens 31–36
- **Chapter 10 title card: "Medhanta RISE · What-if and forecasts"** · "Try before change control" · ≈ 22 s · screens 37–40
- **Chapter 11 title card: "Medhanta RISE · CPV: watching every batch's process"** · "Continued process verification, new" · ≈ 39 s · screens 41–48
- **Chapter 12 title card: "Medhanta RISE · Signals to DIVE, signed review"** · "QA decides; DIVE files it" · ≈ 25 s · screens 49–53
- **Chapter 13 title card: "Medhanta RISE · Running batches"** · "Forecast for batches still in production" · ≈ 12 s · screens 54–54
- **Chapter 14 title card: "Medhanta RISE · Records, roles and exports"** · "Traceable, read-only where it should be" · ≈ 20 s · screens 55–58
- **Outro:** voice-over "Medhanta RISE: OEE, losses, machine-learning insights and CPV, fed by your TrueBatch batch records and always inside your approved ranges. Book a demo to see it with your own lines."
- **End card:** medhanta-rise-logo.png centred, "Medhanta RISE", "Operations, OEE and machine-learning insights", small "by Medhanta" line (medhanta-logo.png), button-style text **"Book a demo"**, gradient bar · ≈ 5 s.

## Step table (voice-over and captions)

| # | Screenshot | Highlight | Voice-over | Caption |
|---|---|---|---|---|
| | **Ch. 1: Welcome to Medhanta RISE** | title card: "Medhanta RISE · Welcome to Medhanta RISE" / "Sign in once, through Medhanta" | | |
| 1 | 01-signin.png | Centre: the Medhanta RISE emblem and the orange "Sign in" button under it | This is Medhanta RISE: operations, OEE and machine-learning insights. You sign in with your own Medhanta login. | Medhanta RISE: Medhanta RISE: one Medhanta sign-in |
| 2 | 02-site-after.png | Centre-left: the "Site name" field "Medhanta Demo Plant, Unit 2", the time zone Asia/Kolkata, and the yellow "Site saved." notice | The admin names the site once, with its time zone. | Medhanta RISE: Name the site once |
| | **Ch. 2: Batch records flow in** | title card: "Medhanta RISE · Batch records flow in" / "TrueBatch links, read-only" | | |
| 3 | 03-links-before.png | The "Linked products" card: rows "TrueBatch Tablets" and "TrueBatch Injectables" with state "ok" and "First read within 10 minutes." | New: read-only links to the TrueBatch batch records, read every ten minutes. | Medhanta RISE: TrueBatch links: read-only |
| 4 | 04-links-after.png | Top: the "Refreshed." notice; then the "Last refresh" text of the TrueBatch Tablets row (rows read, added, still open) | Engineer Neha Iyer presses Refresh now, and machine runs arrive by themselves. | Medhanta RISE: Refresh now: runs arrive by themselves |
| 5 | 05-links-runs.png | Runs table: batch TB260010 on PAN-202, PAN-201, PRS-201 and the column "By" reading "from TrueBatch Tablets"; "on the batch's last machine" in the Good column | Batch TB260010, machine by machine, with output and rejects from the batch's own yield. | Medhanta RISE: Runs and yield from the batch record |
| 6 | 06-equipment-list.png | Equipment table: PAN-201 and PRS-201 with line "Tablets block 2", the other machines set up from master data | Machines and products come from Medhanta master data. | Medhanta RISE: Machines from master data |
| | **Ch. 3: Targets and the plan** | title card: "Medhanta RISE · Targets and the plan" / "Ideal rates, planned hours, approved ranges" | | |
| 7 | 07-settings-rates.png | Table: FG-CPM4 on TP-01, TP-02 (units per hour) and CO-01 (minutes per batch), count unit "tablets" | The ideal rate is each machine's fastest proven speed: the target behind performance. | Medhanta RISE: Ideal rate: the speed target |
| 8 | 08-hours-before.png | Single-day form: Day 22 Nov 2026, Hours 8, Note "Sunday shift to catch up (demo)"; then the "Set hours for this day" button | Today is a Sunday, so Neha plans a single extra shift for the presses. | Medhanta RISE: Plan a single day |
| 9 | 09-hours-after.png | Bottom row "22 Nov 2026 · 8 · Sunday shift to catch up (demo)" and the notice "Hours for 22 Nov 2026 saved." | Now today's hours count. | Medhanta RISE: Extra shift planned |
| 10 | 10-range-before.png | Edit form: "Compression: Friability", Upper limit 0.8, master batch record ref. "MBR-FG-CPM4 v5 (demo)" and the "Reason for the change" field; then "Save range" | Asha Rao from QA owns the approved ranges. Every change needs a reason. | Medhanta RISE: Only QA sets approved ranges |
| 11 | 11-range-after.png | The "Range changed." notice and the Friability row "0 – 0.8 %" in the table | Charts and suggestions always respect them. | Medhanta RISE: Ranges with their MBR reference |
| | **Ch. 4: Recording the shift by hand** | title card: "Medhanta RISE · Recording the shift by hand" / "For machines without a batch-record link" | | |
| 12 | 12-stop-breakdown-before.png | Stop form: Machine TP-01, 11:20 to 12:05, Reason "Breakdown", Breakdown type "Mechanical", the note; then "Save stop" | Press one has no link, so operator Priya Nair uses simple forms: here, a breakdown. | Medhanta RISE: Every stop gets a reason |
| 13 | 13-run-before.png | Run form: TP-01, FG-CPM4, batch CPM2886, start and end, Good count and Reject count; then "Save run" | Then the run: batch, times, good tablets and rejects. | Medhanta RISE: The run: batch, times, counts |
| 14 | 14-run-after.png | Top: the yellow notice "Run for batch CPM2886 saved." | Saved. | Medhanta RISE: Run saved |
| 15 | 15-values-before.png | Parameter values table: the Hardness field in red with "Outside the approved range" on the right | A hardness value above the approved range is flagged at once. | Medhanta RISE: Out-of-range values flagged at once |
| 16 | 16-values-after.png | Top: the notice "5 value(s) saved for batch CPM2886." | All values are saved with the batch. | Medhanta RISE: Values saved with the batch |
| | **Ch. 5: Spreadsheets and corrections** | title card: "Medhanta RISE · Spreadsheets and corrections" / "Import a shift sheet; fix with a reason" | | |
| 17 | 17-csv-check.png | Middle: the pasted CSV rows; then the check result "1 of 2 row(s) can be imported; 1 with problems" and "Another run on this machine overlaps this time." | Neha imports a shift sheet. Every line is checked first. | Medhanta RISE: Check before import |
| 18 | 18-csv-imported.png | The notice "Imported: 1 of 2 row(s) saved; 1 with problems." | Only good rows are saved. | Medhanta RISE: Only good rows are saved |
| 19 | 19-correct-before.png | "Correct or end stop" form: End changed to 08:22 and "Reason for the change": "End time checked against the shift log"; then "Save" | Mistakes are corrected, never erased, always with a reason. | Medhanta RISE: Correct with a reason |
| 20 | 20-correct-after.png | Top: the notice "Stop corrected." | Both versions stay in the audit trail. | Medhanta RISE: Correction recorded |
| | **Ch. 6: OEE at a glance** | title card: "Medhanta RISE · OEE at a glance" / "Availability × performance × quality" | | |
| 21 | 21-overview-today.png | Top row of tiles: OEE, Availability, Performance, Quality, TEEP; then the yellow check notice under them | Production head Vikram Shah opens today's Overview. OEE means: ran when planned, at full speed, and good units of all made. | Medhanta RISE: OEE = availability × performance × quality |
| 22 | 22-overview-today-machines.png | Bottom rows: TP-01 and TP-02 with their OEE; above them the TrueBatch machines, e.g. PAN-202 with a Quality value and the note "No planned hours in this period" | Per machine, with a plain note where planned hours are missing. | Medhanta RISE: Every machine, with honest checks |
| 23 | 23-overview-30.png | Filter row: the "Last 30 days" button; then the OEE-by-day chart | Last 30 days, by day. | Medhanta RISE: Trends over 30 days |
| 24 | 24-overview-90-week.png | The "OEE by week" chart and the "Trend by: week" selector | Or 90 days by week. | Medhanta RISE: Week by week |
| | **Ch. 7: Where the time went** | title card: "Medhanta RISE · Where the time went" / "Losses, largest first" | | |
| 25 | 25-losses-30.png | The loss bars: Slow running at the top, then Cleaning, Planned maintenance, Changeover, Minor stop, Breakdown, Rejects | Losses come largest first, in hours. | Medhanta RISE: Biggest loss first |
| 26 | 26-losses-drill.png | Top table "Breakdown (Mechanical): 3 stop(s)"; then the "Breakdowns by machine" table with MTTR and MTBF | Drill into the stops, with MTTR and MTBF as Medhanta LEAD defines them. | Medhanta RISE: Drill down; MTTR and MTBF |
| | **Ch. 8: Process parameters** | title card: "Medhanta RISE · Process parameters" / "Charts, capability and Nelson rules" | | |
| 27 | 27-params-table.png | Table: Compression yield, Friability, Hardness, Main compression force, Turret speed with Cpk, Ppk, out-of-trend and outside-range columns | Asha reviews capability and trends for every process parameter. | Medhanta RISE: Every parameter at a glance |
| 28 | 28-params-chart.png | Compression yield chart: green approved band, dashed control limits and the dots per batch | Each chart shows the approved range and the normal variation. | Medhanta RISE: Range vs normal variation |
| 29 | 29-params-flags.png | "Batches to look at" table: the "Why" column with Nelson rules 5, 6 and 7 | All eight Nelson rules flag unusual patterns, in plain words. | Medhanta RISE: Nelson rules, in plain words |
| 30 | 30-best-batches.png | "Best-batch comparison" table: best batches against the others and the 5 most recent | Best batches are compared with the rest and with the latest ones. | Medhanta RISE: What the best batches did |
| | **Ch. 9: Smart suggestions and golden batches** | title card: "Medhanta RISE · Smart suggestions and golden batches" / "Machine learning that explains itself" | | |
| 31 | 31-ss-train-before.png | "Smart suggestions" panel: "Best settings for: OEE of Compression" and the "Train" button | Now machine learning. Neha trains a best-settings model on past batches. | Medhanta RISE: Train on past batches |
| 32 | 32-ss-train-after.png | The suggested settings table (Suggested, Recent batches, Approved range) and the "Why" lines below | It suggests settings inside the approved range, and says why. | Medhanta RISE: Suggestions inside the approved range |
| 33 | 33-golden-after.png | The T² chart with the dashed 95 % and 99 % limits and the dots above them | Golden-batch monitoring compares each batch with the good reference batches. | Medhanta RISE: Golden batch: spot the unusual |
| 34 | 34-golden-flagged.png | "Flagged batches" table: the "Why" and "Main parameters" columns | Every flag explains which values made the batch unusual. | Medhanta RISE: Flags explain themselves |
| 35 | 35-golden-exclude-before.png | Bottom form: batch CPM2800 and the reason "Deviation DEMO-DV-014: hopper changed mid-batch"; then the "Exclude" button | QA can keep a batch out of the reference, with a reason, | Medhanta RISE: QA keeps a batch out |
| 36 | 36-golden-exclude-after.png | "Kept out of the reference by QA": CPM2800 with its reason and the "Put back" link | and put it back. A flag is never a batch decision. | Medhanta RISE: Information, not a decision |
| | **Ch. 10: What-if and forecasts** | title card: "Medhanta RISE · What-if and forecasts" / "Try before change control" | | |
| 37 | 37-pls-whatif.png | "What if" fields (Turret speed 42, Main compression force 15) and the result "Predicted Compression yield …" next to "Predict" | What-if shows the likely effect of a setting first. | Medhanta RISE: What-if, before change control |
| 38 | 38-pls-outside.png | Red line "Turret speed: outside approved range: needs change control." | Outside the range, it says: needs change control. | Medhanta RISE: Outside the range: change control |
| 39 | 39-forecast-after.png | "Next run" table: expected rejects and run speed against the average run, with the "Why" column | Forecasts for the next run: rejects and speed, with reasons. | Medhanta RISE: Next run forecast |
| 40 | 40-risk-after.png | "Breakdown risk" panel: the red line "not better than the standard figure yet" | And breakdown risk, honest when it is not better than the standard figure. | Medhanta RISE: Honest about its limits |
| | **Ch. 11: CPV: watching every batch's process** | title card: "Medhanta RISE · CPV: watching every batch's process" / "Continued process verification, new" | | |
| 41 | 41-cpv-plan-before.png | CPV screen: product FG-CPM4, "No CPV plan for this product yet.", Report every 6 months, the VMP note; then "Create plan" | New: CPV, continued process verification, which means watching every batch's process. Asha creates a plan. | Medhanta RISE: CPV: watching every batch's process |
| 42 | 42-cpv-add-after.png | "CPV plan" card: the item "Hardness (Compression)" added, and the "Add" and "Pick" selectors | She picks the items to watch: parameters set up here, | Medhanta RISE: Pick what to watch |
| 43 | 43-cpv-add-reading.png | "Add: TrueBatch step reading" and "Pick: Weights of 20 tablets (Compression › Compress with periodic checks), 2 batches, TrueBatch Tablets" | and readings and batch yield straight from TrueBatch. | Medhanta RISE: Readings from TrueBatch |
| 44 | 44-cpv-items.png | "All plan items" table: the three pink "Look at this" rows and the green "OK" rows | Rows that need a look are highlighted. | Medhanta RISE: Problems highlighted |
| 45 | 45-cpv-chart.png | Hardness individuals chart with Nelson rules; the histogram and the normal probability plot below | Each item gets a batch chart, a histogram and a normality plot, | Medhanta RISE: Chart, histogram, normality |
| 46 | 46-cpv-summary.png | "Summary" block: Stable?, Capable?, Normal?, Within specification?, Out of trend?, each with its rule | and plain answers, each with its rule. | Medhanta RISE: Plain answers, with the rule |
| 47 | 47-cpv-overview.png | "Product overview" tab and the table with N, Mean, Cpk, Ppk, Stable?, Capable?, Normal? and Status | New this round: the product overview, every item on one page, | Medhanta RISE: Product overview: one page |
| 48 | 48-cpv-overview-pdf.png | The printed overview page (PDF) on the grey background: title "CPV product overview: FG-CPM4 …" | with its own PDF. | Medhanta RISE: Overview as PDF |
| | **Ch. 12: Signals to DIVE, signed review** | title card: "Medhanta RISE · Signals to DIVE, signed review" / "QA decides; DIVE files it" | | |
| 49 | 49-cpv-dive-before.png | "Batches to look at" table: row CPM2886, value 112, "outside the specification; rule 1" and its "Send to DIVE" button | Batch CPM2886 is outside the specification. Asha sends it to Medhanta DIVE, for deviations and CAPA. | Medhanta RISE: QA chooses: send to DIVE |
| 50 | 50-cpv-dive-after.png | Top-left green line "Sent to DIVE. DIVE files it from there." | QA chooses; DIVE files it from there. | Medhanta RISE: Signal sent to DIVE |
| 51 | 51-cpv-sign-before.png | "CPV reports" card: the Conclusion text and the orange "Sign CPV report" button | She writes her conclusion and signs the CPV report, | Medhanta RISE: Sign the CPV report |
| 52 | 52-cpv-sign-after.png | "Report 1: 22 Nov 2025 to 22 Nov 2026 approved by Asha Rao" at the top of the card | re-entering her Medhanta password. The figures are frozen. | Medhanta RISE: Re-authenticated, frozen, signed |
| 53 | 53-cpv-report-pdf.png | Two printed pages on the grey background: the report summary and, on page two, the conclusion and the approval line | It prints with its conclusion and approval. | Medhanta RISE: Signed report PDF |
| | **Ch. 13: Running batches** | title card: "Medhanta RISE · Running batches" / "Forecast for batches still in production" | | |
| 54 | 54-cpv-running-cfx.png | "Running batches: forecast" table: batch TI260020, "No golden model matches its readings yet." and "Too few batches: 1 of 25 finished reference batches." | Also new: running-batch scoring compares a batch still in production with the good batches. With too few batches, it says so. | Medhanta RISE: Running batches, scored as they go |
| | **Ch. 14: Records, roles and exports** | title card: "Medhanta RISE · Records, roles and exports" / "Traceable, read-only where it should be" | | |
| 55 | 55-model-register.png | "Model register" table: model, version, data from–to, test error, result and who trained it | Every trained model is kept as a frozen version. | Medhanta RISE: Every model version kept |
| 56 | 56-audit-cpv.png | Audit trail rows: "signed.approved", "cpv.report.made" and "cpv.signal.sent" by asha.rao | The audit trail records every change, signal and signature. | Medhanta RISE: Full audit trail |
| 57 | 57-manager-enter-readonly.png | Top: "Your role can view entries but not enter data." | Managers see everything but cannot enter data. | Medhanta RISE: Read-only for managers |
| 58 | 58-export-pdf.png | The printed Overview page; then its footer: the working-copy notice | Exports carry the working-copy note: the official record stays your batch record. | Medhanta RISE: Working-copy footer on exports |

The same steps, with chapter timings, are in the attached demo-script.md.

## PRONUNCIATION RULES FOR THE VOICE-OVER (apply to every scene; captions keep normal spelling)

1. Speak naturally, at one steady pace (about 130 words a minute). Never slow down, pause or stretch on abbreviations, numbers or brand names.
2. Letter abbreviations are said as quick, joined letters in ONE beat, like a newsreader, never spelled out slowly with gaps: US = "you-ess" (one quick word), EU = "ee-you", UK = "you-kay", FDA = "eff-dee-ay", QA = "cue-ay", QMS = "cue-em-ess", SOP = "ess-oh-pee", OEE = "oh-ee-ee", IQ / OQ / PQ = "eye-cue", "oh-cue", "pee-cue", MIT = "em-eye-tee", DPDP = "dee-pee-dee-pee", AI = "ay-eye", CEO = "see-ee-oh", CFO = "see-eff-oh". Never read the dots in "U.S." or "e.g."; say "you-ess" and "for example".
3. Abbreviations that are said as WORDS: CAPA = "KAP-uh", SHRM = "shurm", Ipca = "IP-kuh".
4. Web addresses and domains: "." is said "dot", and the ending is said as a word: ".in" = "dot in" (rhymes with "pin"), ".com" = "dot com", ".co.in" = "dot co dot in". Never spell an ending letter by letter ("dot i-n" is wrong).
5. Brand and product names (confirm with Medhanta before final recording): Medhanta = "meh-DHAAN-tah", Batchwright = "BATCH-rite", Digi = "DIJ-ee" (as in "digital"; "Digi partner" = "DIJ-ee partner", never "DIG-ee"), McKinsey = "muh-KIN-zee", Ranbaxy = "ran-BAK-see", Alexion = "uh-LEK-see-on", Baddi = "BUD-dee". Medhanta product names: "LEAD" = "leed", "DIVE" = "dive", "RISE" = "rise" (one word, like "sunrise"), "TIDE" = "tide", "ASSURE" = "uh-SHOOR", "EQUIP" = "ee-KWIP", "QLIMS" = "cue-lims", "MMS" = "em-em-ess", "TrueBatch" = "TROO-batch". In this video also: CPV = "see-pee-vee", MBR = "em-bee-ar", VMP = "vee-em-pee", MTBF = "em-tee-bee-eff", MTTR = "em-tee-tee-ar", TEEP = "teep", PLS = "pee-ell-ess", Cpk = "see-pee-kay", Ppk = "pee-pee-kay", chlorphenamine = "klor-FEN-uh-meen", ceftriaxone = "sef-try-AX-own".
6. Indian money and numbers, said the Indian way: "₹16 lakh" = "sixteen lakh rupees" (lakh = "laak", rhymes with "rock"), "₹6 crore" = "six crore" (crore = "krore"), "US$4,700" = "forty-seven hundred dollars", "US$10–25 million" = "ten to twenty-five million dollars", "600-batch" = "six-hundred-batch", "60%" = "sixty percent", "2×" = "twice". Never read symbols aloud (₹, $, %, ×, –) as symbol names.
7. Footnote numbers (¹ ² ³) are on screen only. Never say them.
8. If a word could be misread, write it in the voice-over text the way it sounds (for example "DIJ-ee partner", "you-ess", "dot in"), keeping the correct spelling only in the captions.
