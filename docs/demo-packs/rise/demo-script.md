# Demo script: Medhanta RISE

Feature walkthrough, about 5 min 42 s. One production day (Sunday 22 Nov 2026, an extra shift) at the fictional **Medhanta Demo Plant, Unit 2**. Products are the TrueBatch products: **FG-CPM4** Chlorphenamine Maleate Tablets 4 mg (sugar-coated; TrueBatch Tablets batches TB260009–TB260011) and **FG-CFX1** Ceftriaxone for Injection 1 g (powder for injection; TrueBatch Injectables batches TI260019–TI260021). Their machine runs, yields and step readings come over the read-only TrueBatch links. Tablet presses TP-01 / TP-02 and coater CO-01 (Line A) carry the app's own 200-day demo history of FG-CPM4 (batches CPM2600–CPM2885) and today's hand-typed batches CPM2886 and CPM2887.

Cast (all fictional): Site Admin, Priya Nair (Operator), Neha Iyer (Engineer), Asha Rao (QA), Vikram Shah (Production head, Manager role).

Plain-word glossary for the voice-over: **OEE** – overall equipment effectiveness = availability × performance × quality · **availability** – ran when planned · **performance** – ran at full speed · **quality** – good units of all made · **TEEP** – OEE over all calendar time · **ideal rate** – fastest proven speed · **approved range** – limits from the master batch record · **IPC** – in-process checks · **MTTR / MTBF** – time to repair / between breakdowns · **golden batch** – good reference batches · **CPV** – continued process verification, "watching every batch's process" · **Cpk** – how well the process fits its limits · **Nelson rules** – eight standard warning patterns on a chart.

Screen positions are rough, on the 1920×1080 screenshot. The app was captured at 125 % browser zoom (screen 22 at 100 %, screens 55–56 at 110 %); content sits in a centred column, roughly x 200–1720. The voice-over never quotes figures from the screens: the numbers shown are demo data. Clock times are not read out.

## Intro (≈ 12 s)

**Problem in one line:** Plants know OEE matters, but runs, stops and process values sit in batch records, logbooks and spreadsheets, so nobody sees where the time and quality really go, or whether every batch's process stays in control.

**Intro title card:** "Medhanta RISE" · subtitle "Operations, OEE and machine-learning insights" · Medhanta RISE logo (medhanta-rise-logo.png) · small "by Medhanta" line · gradient underline.

**Voice-over:** "Every shift, machines stop, slow down and make rejects, and every batch leaves process values behind. Let's follow one production day with Medhanta RISE, from sign-in to the signed process review."

## Chapter 1: Welcome to Medhanta RISE (≈ 15 s)

**Title card:** "Medhanta RISE · Welcome to Medhanta RISE" · subtitle "Sign in once, through Medhanta"

### Step 1: `01-signin.png`
- **Highlight:** Centre: the Medhanta RISE emblem and the orange "Sign in" button under it
- **Voice-over:** "This is Medhanta RISE: operations, OEE and machine-learning insights. You sign in with your own Medhanta login."
- **Caption:** Medhanta RISE: Medhanta RISE: one Medhanta sign-in

### Step 2: `02-site-after.png`
- **Highlight:** Centre-left: the "Site name" field "Medhanta Demo Plant, Unit 2", the time zone Asia/Kolkata, and the yellow "Site saved." notice
- **Voice-over:** "The admin names the site once, with its time zone."
- **Caption:** Medhanta RISE: Name the site once

## Chapter 2: Batch records flow in (≈ 24 s)

**Title card:** "Medhanta RISE · Batch records flow in" · subtitle "TrueBatch links, read-only"

### Step 3: `03-links-before.png`
- **Highlight:** The "Linked products" card: rows "TrueBatch Tablets" and "TrueBatch Injectables" with state "ok" and "First read within 10 minutes."
- **Voice-over:** "New: read-only links to the TrueBatch batch records, read every ten minutes."
- **Caption:** Medhanta RISE: TrueBatch links: read-only

### Step 4: `04-links-after.png`
- **Highlight:** Top: the "Refreshed." notice; then the "Last refresh" text of the TrueBatch Tablets row (rows read, added, still open)
- **Voice-over:** "Engineer Neha Iyer presses Refresh now, and machine runs arrive by themselves."
- **Caption:** Medhanta RISE: Refresh now: runs arrive by themselves

### Step 5: `05-links-runs.png`
- **Highlight:** Runs table: batch TB260010 on PAN-202, PAN-201, PRS-201 and the column "By" reading "from TrueBatch Tablets"; "on the batch's last machine" in the Good column
- **Voice-over:** "Batch TB260010, machine by machine, with output and rejects from the batch's own yield."
- **Caption:** Medhanta RISE: Runs and yield from the batch record

### Step 6: `06-equipment-list.png`
- **Highlight:** Equipment table: PAN-201 and PRS-201 with line "Tablets block 2", the other machines set up from master data
- **Voice-over:** "Machines and products come from Medhanta master data."
- **Caption:** Medhanta RISE: Machines from master data

## Chapter 3: Targets and the plan (≈ 27 s)

**Title card:** "Medhanta RISE · Targets and the plan" · subtitle "Ideal rates, planned hours, approved ranges"

### Step 7: `07-settings-rates.png`
- **Highlight:** Table: FG-CPM4 on TP-01, TP-02 (units per hour) and CO-01 (minutes per batch), count unit "tablets"
- **Voice-over:** "The ideal rate is each machine's fastest proven speed: the target behind performance."
- **Caption:** Medhanta RISE: Ideal rate: the speed target

### Step 8: `08-hours-before.png`
- **Highlight:** Single-day form: Day 22 Nov 2026, Hours 8, Note "Sunday shift to catch up (demo)"; then the "Set hours for this day" button
- **Voice-over:** "Today is a Sunday, so Neha plans a single extra shift for the presses."
- **Caption:** Medhanta RISE: Plan a single day

### Step 9: `09-hours-after.png`
- **Highlight:** Bottom row "22 Nov 2026 · 8 · Sunday shift to catch up (demo)" and the notice "Hours for 22 Nov 2026 saved."
- **Voice-over:** "Now today's hours count."
- **Caption:** Medhanta RISE: Extra shift planned

### Step 10: `10-range-before.png`
- **Highlight:** Edit form: "Compression: Friability", Upper limit 0.8, master batch record ref. "MBR-FG-CPM4 v5 (demo)" and the "Reason for the change" field; then "Save range"
- **Voice-over:** "Asha Rao from QA owns the approved ranges. Every change needs a reason."
- **Caption:** Medhanta RISE: Only QA sets approved ranges

### Step 11: `11-range-after.png`
- **Highlight:** The "Range changed." notice and the Friability row "0 – 0.8 %" in the table
- **Voice-over:** "Charts and suggestions always respect them."
- **Caption:** Medhanta RISE: Ranges with their MBR reference

## Chapter 4: Recording the shift by hand (≈ 24 s)

**Title card:** "Medhanta RISE · Recording the shift by hand" · subtitle "For machines without a batch-record link"

### Step 12: `12-stop-breakdown-before.png`
- **Highlight:** Stop form: Machine TP-01, 11:20 to 12:05, Reason "Breakdown", Breakdown type "Mechanical", the note; then "Save stop"
- **Voice-over:** "Press one has no link, so operator Priya Nair uses simple forms: here, a breakdown."
- **Caption:** Medhanta RISE: Every stop gets a reason

### Step 13: `13-run-before.png`
- **Highlight:** Run form: TP-01, FG-CPM4, batch CPM2886, start and end, Good count and Reject count; then "Save run"
- **Voice-over:** "Then the run: batch, times, good tablets and rejects."
- **Caption:** Medhanta RISE: The run: batch, times, counts

### Step 14: `14-run-after.png`
- **Highlight:** Top: the yellow notice "Run for batch CPM2886 saved."
- **Voice-over:** "Saved."
- **Caption:** Medhanta RISE: Run saved

### Step 15: `15-values-before.png`
- **Highlight:** Parameter values table: the Hardness field in red with "Outside the approved range" on the right
- **Voice-over:** "A hardness value above the approved range is flagged at once."
- **Caption:** Medhanta RISE: Out-of-range values flagged at once

### Step 16: `16-values-after.png`
- **Highlight:** Top: the notice "5 value(s) saved for batch CPM2886."
- **Voice-over:** "All values are saved with the batch."
- **Caption:** Medhanta RISE: Values saved with the batch

## Chapter 5: Spreadsheets and corrections (≈ 18 s)

**Title card:** "Medhanta RISE · Spreadsheets and corrections" · subtitle "Import a shift sheet; fix with a reason"

### Step 17: `17-csv-check.png`
- **Highlight:** Middle: the pasted CSV rows; then the check result "1 of 2 row(s) can be imported; 1 with problems" and "Another run on this machine overlaps this time."
- **Voice-over:** "Neha imports a shift sheet. Every line is checked first."
- **Caption:** Medhanta RISE: Check before import

### Step 18: `18-csv-imported.png`
- **Highlight:** The notice "Imported: 1 of 2 row(s) saved; 1 with problems."
- **Voice-over:** "Only good rows are saved."
- **Caption:** Medhanta RISE: Only good rows are saved

### Step 19: `19-correct-before.png`
- **Highlight:** "Correct or end stop" form: End changed to 08:22 and "Reason for the change": "End time checked against the shift log"; then "Save"
- **Voice-over:** "Mistakes are corrected, never erased, always with a reason."
- **Caption:** Medhanta RISE: Correct with a reason

### Step 20: `20-correct-after.png`
- **Highlight:** Top: the notice "Stop corrected."
- **Voice-over:** "Both versions stay in the audit trail."
- **Caption:** Medhanta RISE: Correction recorded

## Chapter 6: OEE at a glance (≈ 23 s)

**Title card:** "Medhanta RISE · OEE at a glance" · subtitle "Availability × performance × quality"

### Step 21: `21-overview-today.png`
- **Highlight:** Top row of tiles: OEE, Availability, Performance, Quality, TEEP; then the yellow check notice under them
- **Voice-over:** "Production head Vikram Shah opens today's Overview. OEE means: ran when planned, at full speed, and good units of all made."
- **Caption:** Medhanta RISE: OEE = availability × performance × quality

### Step 22: `22-overview-today-machines.png`
- **Highlight:** Bottom rows: TP-01 and TP-02 with their OEE; above them the TrueBatch machines, e.g. PAN-202 with a Quality value and the note "No planned hours in this period"
- **Voice-over:** "Per machine, with a plain note where planned hours are missing."
- **Caption:** Medhanta RISE: Every machine, with honest checks

### Step 23: `23-overview-30.png`
- **Highlight:** Filter row: the "Last 30 days" button; then the OEE-by-day chart
- **Voice-over:** "Last 30 days, by day."
- **Caption:** Medhanta RISE: Trends over 30 days

### Step 24: `24-overview-90-week.png`
- **Highlight:** The "OEE by week" chart and the "Trend by: week" selector
- **Voice-over:** "Or 90 days by week."
- **Caption:** Medhanta RISE: Week by week

## Chapter 7: Where the time went (≈ 11 s)

**Title card:** "Medhanta RISE · Where the time went" · subtitle "Losses, largest first"

### Step 25: `25-losses-30.png`
- **Highlight:** The loss bars: Slow running at the top, then Cleaning, Planned maintenance, Changeover, Minor stop, Breakdown, Rejects
- **Voice-over:** "Losses come largest first, in hours."
- **Caption:** Medhanta RISE: Biggest loss first

### Step 26: `26-losses-drill.png`
- **Highlight:** Top table "Breakdown (Mechanical): 3 stop(s)"; then the "Breakdowns by machine" table with MTTR and MTBF
- **Voice-over:** "Drill into the stops, with MTTR and MTBF as Medhanta LEAD defines them."
- **Caption:** Medhanta RISE: Drill down; MTTR and MTBF

## Chapter 8: Process parameters (≈ 22 s)

**Title card:** "Medhanta RISE · Process parameters" · subtitle "Charts, capability and Nelson rules"

### Step 27: `27-params-table.png`
- **Highlight:** Table: Compression yield, Friability, Hardness, Main compression force, Turret speed with Cpk, Ppk, out-of-trend and outside-range columns
- **Voice-over:** "Asha reviews capability and trends for every process parameter."
- **Caption:** Medhanta RISE: Every parameter at a glance

### Step 28: `28-params-chart.png`
- **Highlight:** Compression yield chart: green approved band, dashed control limits and the dots per batch
- **Voice-over:** "Each chart shows the approved range and the normal variation."
- **Caption:** Medhanta RISE: Range vs normal variation

### Step 29: `29-params-flags.png`
- **Highlight:** "Batches to look at" table: the "Why" column with Nelson rules 5, 6 and 7
- **Voice-over:** "All eight Nelson rules flag unusual patterns, in plain words."
- **Caption:** Medhanta RISE: Nelson rules, in plain words

### Step 30: `30-best-batches.png`
- **Highlight:** "Best-batch comparison" table: best batches against the others and the 5 most recent
- **Voice-over:** "Best batches are compared with the rest and with the latest ones."
- **Caption:** Medhanta RISE: What the best batches did

## Chapter 9: Smart suggestions and golden batches (≈ 33 s)

**Title card:** "Medhanta RISE · Smart suggestions and golden batches" · subtitle "Machine learning that explains itself"

### Step 31: `31-ss-train-before.png`
- **Highlight:** "Smart suggestions" panel: "Best settings for: OEE of Compression" and the "Train" button
- **Voice-over:** "Now machine learning. Neha trains a best-settings model on past batches."
- **Caption:** Medhanta RISE: Train on past batches

### Step 32: `32-ss-train-after.png`
- **Highlight:** The suggested settings table (Suggested, Recent batches, Approved range) and the "Why" lines below
- **Voice-over:** "It suggests settings inside the approved range, and says why."
- **Caption:** Medhanta RISE: Suggestions inside the approved range

### Step 33: `33-golden-after.png`
- **Highlight:** The T² chart with the dashed 95 % and 99 % limits and the dots above them
- **Voice-over:** "Golden-batch monitoring compares each batch with the good reference batches."
- **Caption:** Medhanta RISE: Golden batch: spot the unusual

### Step 34: `34-golden-flagged.png`
- **Highlight:** "Flagged batches" table: the "Why" and "Main parameters" columns
- **Voice-over:** "Every flag explains which values made the batch unusual."
- **Caption:** Medhanta RISE: Flags explain themselves

### Step 35: `35-golden-exclude-before.png`
- **Highlight:** Bottom form: batch CPM2800 and the reason "Deviation DEMO-DV-014: hopper changed mid-batch"; then the "Exclude" button
- **Voice-over:** "QA can keep a batch out of the reference, with a reason,"
- **Caption:** Medhanta RISE: QA keeps a batch out

### Step 36: `36-golden-exclude-after.png`
- **Highlight:** "Kept out of the reference by QA": CPM2800 with its reason and the "Put back" link
- **Voice-over:** "and put it back. A flag is never a batch decision."
- **Caption:** Medhanta RISE: Information, not a decision

## Chapter 10: What-if and forecasts (≈ 22 s)

**Title card:** "Medhanta RISE · What-if and forecasts" · subtitle "Try before change control"

### Step 37: `37-pls-whatif.png`
- **Highlight:** "What if" fields (Turret speed 42, Main compression force 15) and the result "Predicted Compression yield …" next to "Predict"
- **Voice-over:** "What-if shows the likely effect of a setting first."
- **Caption:** Medhanta RISE: What-if, before change control

### Step 38: `38-pls-outside.png`
- **Highlight:** Red line "Turret speed: outside approved range: needs change control."
- **Voice-over:** "Outside the range, it says: needs change control."
- **Caption:** Medhanta RISE: Outside the range: change control

### Step 39: `39-forecast-after.png`
- **Highlight:** "Next run" table: expected rejects and run speed against the average run, with the "Why" column
- **Voice-over:** "Forecasts for the next run: rejects and speed, with reasons."
- **Caption:** Medhanta RISE: Next run forecast

### Step 40: `40-risk-after.png`
- **Highlight:** "Breakdown risk" panel: the red line "not better than the standard figure yet"
- **Voice-over:** "And breakdown risk, honest when it is not better than the standard figure."
- **Caption:** Medhanta RISE: Honest about its limits

## Chapter 11: CPV: watching every batch's process (≈ 39 s)

**Title card:** "Medhanta RISE · CPV: watching every batch's process" · subtitle "Continued process verification, new"

### Step 41: `41-cpv-plan-before.png`
- **Highlight:** CPV screen: product FG-CPM4, "No CPV plan for this product yet.", Report every 6 months, the VMP note; then "Create plan"
- **Voice-over:** "New: CPV, continued process verification, which means watching every batch's process. Asha creates a plan."
- **Caption:** Medhanta RISE: CPV: watching every batch's process

### Step 42: `42-cpv-add-after.png`
- **Highlight:** "CPV plan" card: the item "Hardness (Compression)" added, and the "Add" and "Pick" selectors
- **Voice-over:** "She picks the items to watch: parameters set up here,"
- **Caption:** Medhanta RISE: Pick what to watch

### Step 43: `43-cpv-add-reading.png`
- **Highlight:** "Add: TrueBatch step reading" and "Pick: Weights of 20 tablets (Compression › Compress with periodic checks), 2 batches, TrueBatch Tablets"
- **Voice-over:** "and readings and batch yield straight from TrueBatch."
- **Caption:** Medhanta RISE: Readings from TrueBatch

### Step 44: `44-cpv-items.png`
- **Highlight:** "All plan items" table: the three pink "Look at this" rows and the green "OK" rows
- **Voice-over:** "Rows that need a look are highlighted."
- **Caption:** Medhanta RISE: Problems highlighted

### Step 45: `45-cpv-chart.png`
- **Highlight:** Hardness individuals chart with Nelson rules; the histogram and the normal probability plot below
- **Voice-over:** "Each item gets a batch chart, a histogram and a normality plot,"
- **Caption:** Medhanta RISE: Chart, histogram, normality

### Step 46: `46-cpv-summary.png`
- **Highlight:** "Summary" block: Stable?, Capable?, Normal?, Within specification?, Out of trend?, each with its rule
- **Voice-over:** "and plain answers, each with its rule."
- **Caption:** Medhanta RISE: Plain answers, with the rule

### Step 47: `47-cpv-overview.png`
- **Highlight:** "Product overview" tab and the table with N, Mean, Cpk, Ppk, Stable?, Capable?, Normal? and Status
- **Voice-over:** "New this round: the product overview, every item on one page,"
- **Caption:** Medhanta RISE: Product overview: one page

### Step 48: `48-cpv-overview-pdf.png`
- **Highlight:** The printed overview page (PDF) on the grey background: title "CPV product overview: FG-CPM4 …"
- **Voice-over:** "with its own PDF."
- **Caption:** Medhanta RISE: Overview as PDF

## Chapter 12: Signals to DIVE, signed review (≈ 25 s)

**Title card:** "Medhanta RISE · Signals to DIVE, signed review" · subtitle "QA decides; DIVE files it"

### Step 49: `49-cpv-dive-before.png`
- **Highlight:** "Batches to look at" table: row CPM2886, value 112, "outside the specification; rule 1" and its "Send to DIVE" button
- **Voice-over:** "Batch CPM2886 is outside the specification. Asha sends it to Medhanta DIVE, for deviations and CAPA."
- **Caption:** Medhanta RISE: QA chooses: send to DIVE

### Step 50: `50-cpv-dive-after.png`
- **Highlight:** Top-left green line "Sent to DIVE. DIVE files it from there."
- **Voice-over:** "QA chooses; DIVE files it from there."
- **Caption:** Medhanta RISE: Signal sent to DIVE

### Step 51: `51-cpv-sign-before.png`
- **Highlight:** "CPV reports" card: the Conclusion text and the orange "Sign CPV report" button
- **Voice-over:** "She writes her conclusion and signs the CPV report,"
- **Caption:** Medhanta RISE: Sign the CPV report

### Step 52: `52-cpv-sign-after.png`
- **Highlight:** "Report 1: 22 Nov 2025 to 22 Nov 2026 approved by Asha Rao" at the top of the card
- **Voice-over:** "re-entering her Medhanta password. The figures are frozen."
- **Caption:** Medhanta RISE: Re-authenticated, frozen, signed

### Step 53: `53-cpv-report-pdf.png`
- **Highlight:** Two printed pages on the grey background: the report summary and, on page two, the conclusion and the approval line
- **Voice-over:** "It prints with its conclusion and approval."
- **Caption:** Medhanta RISE: Signed report PDF

## Chapter 13: Running batches (≈ 12 s)

**Title card:** "Medhanta RISE · Running batches" · subtitle "Forecast for batches still in production"

### Step 54: `54-cpv-running-cfx.png`
- **Highlight:** "Running batches: forecast" table: batch TI260020, "No golden model matches its readings yet." and "Too few batches: 1 of 25 finished reference batches."
- **Voice-over:** "Also new: running-batch scoring compares a batch still in production with the good batches. With too few batches, it says so."
- **Caption:** Medhanta RISE: Running batches, scored as they go

## Chapter 14: Records, roles and exports (≈ 20 s)

**Title card:** "Medhanta RISE · Records, roles and exports" · subtitle "Traceable, read-only where it should be"

### Step 55: `55-model-register.png`
- **Highlight:** "Model register" table: model, version, data from–to, test error, result and who trained it
- **Voice-over:** "Every trained model is kept as a frozen version."
- **Caption:** Medhanta RISE: Every model version kept

### Step 56: `56-audit-cpv.png`
- **Highlight:** Audit trail rows: "signed.approved", "cpv.report.made" and "cpv.signal.sent" by asha.rao
- **Voice-over:** "The audit trail records every change, signal and signature."
- **Caption:** Medhanta RISE: Full audit trail

### Step 57: `57-manager-enter-readonly.png`
- **Highlight:** Top: "Your role can view entries but not enter data."
- **Voice-over:** "Managers see everything but cannot enter data."
- **Caption:** Medhanta RISE: Read-only for managers

### Step 58: `58-export-pdf.png`
- **Highlight:** The printed Overview page; then its footer: the working-copy notice
- **Voice-over:** "Exports carry the working-copy note: the official record stays your batch record."
- **Caption:** Medhanta RISE: Working-copy footer on exports

## Outro (≈ 10 s)

**Voice-over:** "Medhanta RISE: OEE, losses, machine-learning insights and CPV, fed by your TrueBatch batch records and always inside your approved ranges. Book a demo to see it with your own lines."

**End card (≈ 5 s):** medhanta-rise-logo.png centred · "Medhanta RISE" · "Operations, OEE and machine-learning insights" · small "by Medhanta" line with medhanta-logo.png · button-style "Book a demo" · gradient bar.

## Timing

| Part | Screens | Duration |
|---|---|---|
| Intro | title card | ≈ 12 s |
| 1. Welcome to Medhanta RISE | 01–02 | ≈ 15 s |
| 2. Batch records flow in | 03–06 | ≈ 24 s |
| 3. Targets and the plan | 07–11 | ≈ 27 s |
| 4. Recording the shift by hand | 12–16 | ≈ 24 s |
| 5. Spreadsheets and corrections | 17–20 | ≈ 18 s |
| 6. OEE at a glance | 21–24 | ≈ 23 s |
| 7. Where the time went | 25–26 | ≈ 11 s |
| 8. Process parameters | 27–30 | ≈ 22 s |
| 9. Smart suggestions and golden batches | 31–36 | ≈ 33 s |
| 10. What-if and forecasts | 37–40 | ≈ 22 s |
| 11. CPV: watching every batch's process | 41–48 | ≈ 39 s |
| 12. Signals to DIVE, signed review | 49–53 | ≈ 25 s |
| 13. Running batches | 54–54 | ≈ 12 s |
| 14. Records, roles and exports | 55–58 | ≈ 20 s |
| Outro + end card | — | ≈ 15 s |
| **Total** | 58 screens | **≈ 5 min 42 s** |
