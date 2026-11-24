# TrueBatch Tablets: demo video script

**Product:** TrueBatch Tablets (electronic batch manufacturing record for tablets), with TrueBatch Tablets Packing, by Medhanta
**Format:** 16:9, 1920×1080, calm step-by-step tutorial, captions on. **Target length:** about 5 min 40 s (3–6 min).
**Story:** one working day at the fictional *Medhanta Demo Plant, Unit 2*. A master recipe for *Chlorphenamine
maleate 4 mg sugar-coated tablets* (product FG-CPM4) is built, checked and approved. Batch TB260009 is weighed,
compressed, sugar-coated, reviewed by exception and released; batch TB260010 follows; batch TB260011 meets an empty
lot at dispensing. TB260009 is then packed as packing orders TP260009 and TP260010. All people, products, lots and
numbers on screen are fictional demo data.

**Cast (fictional, as shown on screen):** Vikram Shah – production manager (writes the master, issues batches,
production approval) · Sunil Verma – production executive (second-person checks) · Priya Nair – operator · Asha Rao –
QA head (approves, decides exceptions, releases) · Meera Joshi – QA officer (makes the master effective) · Ravi Kulkarni
– QC manager · Rahul Mehta – stores (view only).

**Notes for the editor**
- Every screen carries the app's own red banner "DEMO · a demonstration installation, not for GMP use · waits can be
  skipped". It is real; keep it. In the demo, timed waits (mixing times, 30-minute IPC rounds, hold times) were skipped
  with the app's "Skip wait (demo)" so the day fits in the video; the record lists each skip for QA.
- Medhanta MMS (Material Management) is not connected in this demo installation. Its lot and stock data come from a
  stand-in made the way the product's own tests make it (lots DEMO-26-CPM-014 and DEMO-26-CPM-015, their stock and
  certificates). The app reads it exactly as it reads MMS. Medhanta LEAD (Logbook), DIVE (deviations) and QLIMS are not
  linked: the app asks for those values by hand and a second person checks them.
- The batch numbers TB260009–TB260011 and TP260009–TP260010 were given by the app's own counter (it continued from
  eight earlier batches this year, as on the owner's demo platform).
- Positions are rough, on the 1920×1080 screenshot. All screens were taken on TrueBatch-Tablets main at commit 21c8606.

---

## Intro (≈ 12 s)

**Title card:** "TrueBatch Tablets: the batch record, on screen" · subtitle "From master recipe to released, packed
batch" · TrueBatch Tablets emblem (brand/tablets-logo-900.png), gradient underline.

**Voice-over:** "Paper batch records are slow to fill, easy to get wrong and hard to review. TrueBatch Tablets puts the
whole batch record on screen, from the master recipe to release, and packing too. Let's follow one product through one day."

**Caption:** "TrueBatch Tablets: the batch record, on screen"

---

## Chapter 1: Sign in (≈ 8 s)

**Title card:** "1 · Sign in"

| # | Screenshot | Highlight | Voice-over | Caption |
|---|---|---|---|---|
| 1 | 01-sign-in.png | The TrueBatch Tablets emblem at the top, then the orange "Sign in" button | "Everyone signs in with their own Medhanta account. An unused screen signs itself out after fifteen minutes." | Personal sign-in, idle logout after 15 min |

## Chapter 2: Design the master recipe (≈ 34 s)

**Title card:** "2 · Design the master recipe"

| # | Screenshot | Highlight | Voice-over | Caption |
|---|---|---|---|---|
| 2 | 02-master-new-from-skeleton.png | Centre dialog: product FG-CPM4 at the top, then "Process skeleton: Wet granulation" selected near the bottom | "Vikram starts a new master for chlorphenamine 4 mg sugar-coated tablets: three lakh tablets a batch, from a wet granulation skeleton." | Start from a ready process skeleton |
| 3 | 03-designer-formula.png | Centre "Formula" table: mg per tablet and batch quantity columns | "The formula comes from master data. Type the milligrams per tablet; the batch quantities work themselves out." | Formula: batch quantities calculated |
| 4 | 04-designer-master-check-question.png | Right "Master check" panel: the label-claim question and its answer drop-down | "The master check watches every change. Here it asks how the strength is stated on the label, and Vikram answers in place." | The master check asks, you answer |
| 5 | 05-designer-sugar-coat-rounds.png | Centre column "Sugar coat in rounds" and its weight-gain and syrup limits | "Sugar coating runs in rounds. Each round records syrup, dusting powder, drying time and the tablets' weight; the rounds stop when the weight gain is within limits." | Sugar coating: rounds and weight gain |
| 6 | 06-designer-step-switched-on.png | "More options": "Done only when a value of an earlier step is within limits", set to the coating-room humidity | "This step is switched on by a recorded value: the dehumidifier step applies only when the coating room is at fifty percent humidity or more." | A step switched on by a reading |

## Chapter 3: The step library (≈ 16 s)

**Title card:** "3 · A library of ready steps"

| # | Screenshot | Highlight | Voice-over | Caption |
|---|---|---|---|---|
| 7 | 07-library-hme-curing.png | Search box "periodic" and the results "Hot-melt extrusion…" and "Cure in an oven…" | "Steps come from a searchable library: hot-melt extrusion and oven curing with periodic readings…" | Hot-melt extrusion and curing |
| 8 | 08-library-milling.png | Result "Mill to a size" | "…milling to a size…" | Milling to a size |
| 9 | 09-library-drug-layering.png | Result "Layer the drug on beads" | "…drug layering on beads…" | Drug layering on beads |
| 10 | 10-library-mix-to-target.png | Result "Mix two lots to a target" | "…and mixing two lots to a target. Every step brings its own checks." | Mix two lots to a target |

## Chapter 4: Review and approval (≈ 22 s)

**Title card:** "4 · Checked, approved, effective"

| # | Screenshot | Highlight | Voice-over | Caption |
|---|---|---|---|---|
| 11 | 11-master-review-plain-view.png | Centre text "Stage 6: Sugar coating" in the plain-language view | "Reviewers read the whole master in plain sentences, stage by stage." | The master in plain language |
| 12 | 12-master-send-for-review-esignature.png | Centre dialog "Sign: Prepared" and its "Sign" button | "Vikram sends it for review with his electronic signature, the legal equal of a handwritten one." | E-signature: prepared |
| 13 | 13-master-approve-change-control.png | Centre dialog "Approve: change control", field CC-2026-0142 | "Sunil checks it as the second person. Asha, QA head, approves it under change control CC-2026-0142." | QA approves under change control |
| 14 | 14-master-effective-timeline.png | Top-left timeline: sent, checked, approved, made effective, with names and times | "Meera, another QA person, makes it effective. Every step of the approval is kept with who and when." | One effective version, full history |

## Chapter 5: Issue the batch and start work (≈ 18 s)

**Title card:** "5 · Issue the batch"

| # | Screenshot | Highlight | Voice-over | Caption |
|---|---|---|---|---|
| 15 | 15-issue-batch.png | Centre dialog "Issue a batch" and "Next: sign" | "From the effective master, Vikram issues a batch. The server gives the number: TB260009." | Batch number from the server |
| 16 | 16-my-work-operator.png | "Batches in progress" row TB260009 and its "Open" link | "Priya, the operator, sees her work on My work." | My work: what to do next |
| 17 | 17-batch-screen-stages.png | Stage tabs across the top (Binder solution closed, Granulation now) and the step list | "The batch screen shows every stage and step in order. Steps open one after another." | Stages and steps in order |

## Chapter 6: Dispensing from MMS stock (≈ 36 s)

**Title card:** "6 · Dispensing with live lot checks"

| # | Screenshot | Highlight | Voice-over | Caption |
|---|---|---|---|---|
| 18 | 18-weigh-lot-from-mms.png | Left "Lot" field DEMO-26-CPM-014 and the line "From MMS: … approved, expiry…" | "Priya enters the chlorphenamine lot. Medhanta MMS, material management, gives its status, expiry and certificate; nobody can type over them." | Lot data pulled from Medhanta MMS |
| 19 | 19-weigh-results-within-tolerance.png | Right "Results": target 1.200 kg, net 1.200 kg, "Within limits" | "She records gross and tare. The net weight is checked against the master's target and tolerance." | Weight checked against the target |
| 20 | 20-weigh-esignature.png | Centre dialog "Sign: Performed" listing what is signed | "She signs the step as performed. The dialog shows exactly what her signature covers." | Sign what you did |
| 21 | 21-checker-waiting-for-check.png | "Waiting for your check" row, right "Check" link | "Sunil sees it waiting for his check on his own device. Nobody can check their own work." | Second-person check |
| 22 | 22-mms-overuse-refused.png | Red message under "Gross weight": "Lot DEMO-26-CPM-014 has only 0.1 kg left…" | "Later, batch TB260011 tries the same lot. MMS shows only zero point one kilogram left, so the weighing is refused." | Over-use of MMS stock refused |
| 23 | 23-mms-other-lot-accepted.png | "Lot" field DEMO-26-CPM-015 and "Within limits" in Results | "Priya takes the next released lot, and the weighing goes through." | Another released lot: accepted |

## Chapter 7: In-process checks and limits (≈ 18 s)

**Title card:** "7 · IPC: in-process checks"

| # | Screenshot | Highlight | Voice-over | Caption |
|---|---|---|---|---|
| 24 | 24-ipc-compression-out-of-limits.png | Right "Results": "Hardness: Out of limits 38 N" and "Tensile strength 1.3 MPa" | "At compression, every round records twenty weights, hardness and thickness. Tensile strength is worked out. Hardness is below the limit." | Limit check catches low hardness |
| 25 | 25-deviation-note.png | Centre dialog "Deviation note" with DEV-26-0311 | "The step cannot be signed until Priya adds a deviation note with what happened and the deviation number." | Out of limits needs a deviation note |
| 26 | 26-ipc-round-signed-next-due.png | Right "Rounds": round 1 signed, round 2 ready | "Then the press is adjusted and the next round follows, every thirty minutes at most." | Periodic rounds on the server clock |

## Chapter 8: Sugar coating (≈ 34 s)

**Title card:** "8 · Sugar coating, round by round"

| # | Screenshot | Highlight | Voice-over | Caption |
|---|---|---|---|---|
| 27 | 27-coating-room-humidity.png | Left "Reading 55 %RH" and right "Within limits" | "Before coating, Priya reads the coating room's air humidity: fifty-five percent." | Air humidity reading |
| 28 | 28-step-switched-on-by-humidity.png | Step 3 "Dehumidifier on: pan inlet air humidity" marked "Ready to start" | "Because the reading is fifty percent or more, the dehumidifier step switches on." | Reading switches on a step |
| 29 | 29-step-not-applicable-low-humidity.png | Step 3 on batch TB260010 marked "Not applicable" | "On batch TB260010 the room was drier, so the same step is marked not applicable. No choice to make." | Not needed: marked not applicable |
| 30 | 30-dehumidifier-inlet-air-reading.png | Left "Reading 34 %RH" and right "Within limits" | "With the dehumidifier on, the inlet air is at thirty-four percent, within its limit." | Inlet air checked |
| 31 | 31-sugar-coat-round-weight-gain.png | Right "Weight gain 13.7 % · Not yet: repeat" | "Each coating round records syrup, powder, drying time and mean weight. After round one the gain is too low, so the rounds go on." | Weight gain per round |
| 32 | 32-sugar-coat-final-round-gain-met.png | Top "Round 7" and right "Weight gain 100.3 % · Within limits" | "At round seven the weight gain is within limits and the coating is finished." | Rounds stop at the target gain |

## Chapter 9: Exceptions and production approval (≈ 18 s)

**Title card:** "9 · Exceptions and production approval"

| # | Screenshot | Highlight | Voice-over | Caption |
|---|---|---|---|---|
| 33 | 33-batch-manufacturing-complete.png | Top alerts: "OPEN DEVIATION DEV-26-0311" and "NOTE TO DECIDE" | "All stages are closed. The batch screen still flags an open deviation and a note to decide." | Open items stay visible |
| 34 | 34-exception-close-here.png | Centre dialog "Close the exception here", reason field and "Next: sign" | "A note without a number is decided once: Asha closes it here with a reason and her signature, or sends it to Medhanta DIVE." | Exceptions decided, never lost |
| 35 | 35-production-approval.png | Completeness list with ticks and "Sign: production approved" at the bottom | "Vikram signs production approval only when the record is complete. From now on it is closed to changes." | Complete before production signs |

## Chapter 10: QC approval and review by exception (≈ 30 s)

**Title card:** "10 · Review by exception"

| # | Screenshot | Highlight | Voice-over | Caption |
|---|---|---|---|---|
| 36 | 36-qc-approval-report-number.png | Bottom "QC report number" QC-26-1187 and "Sign: QC approved" | "Ravi, QC, approves with the QC report number." | QC approval with report number |
| 37 | 37-qa-review-by-exception.png | Top row of counters: corrections, late timers, out of limits, open deviations, typed by hand | "Asha reviews by exception, which means QA looks first at what went differently: corrections, late timers, values out of limits, deviations." | Review by exception: what differs |
| 38 | 38-qa-review-out-of-limits-and-notes.png | "Out of limits" section: blend yield and compression round 1, each with its note | "Each exception is listed with its step, its numbers and the note written on the floor." | Every exception with its note |
| 39 | 39-qa-close-deviation.png | Centre dialog "Close deviation DEV-26-0311" and its reason | "She closes the hardness deviation with a reason." | QA closes deviations |
| 40 | 40-qa-release-refused-plain-words.png | Red box "Release is not possible yet: the yield of Blending… a deviation note with its reference is needed." | "Release is still refused, in plain words: the low blend yield needs a deviation number. Nothing can slip through." | Release refused, in plain words |

## Chapter 11: Release, PDF and All batches (≈ 31 s)

**Title card:** "11 · Release"

| # | Screenshot | Highlight | Voice-over | Caption |
|---|---|---|---|---|
| 41 | 41-qa-release-esignature.png | Centre dialog "Sign: Released" | "Once the yield deviation is numbered and closed, Asha signs the release. Her signature also records her review of the audit trail." | Release by e-signature |
| 42 | 42-batch-released.png | Top-right green "Released" chip | "TB260009 is released." | Batch released |
| 43 | 43-batch-closed-to-changes.png | Bottom ticks and the line "The record is released: it is closed to changes." | "The record shows each approval and is now closed to changes." | Closed to changes |
| 44 | 44-batch-record-pdf-cover.png | Top of the PDF page: "Batch record TB260009" and the formula with lots | "A complete batch record PDF holds every value, check, signature and change." | Complete batch record PDF |
| 45 | 45-all-batches-filters.png | Filter row at the top: "Batch number" search, "All statuses" and "All products"; on each row the "Batch", "Release" and "PDF" links | "All batches lists every batch, newest first, with its status and links to the batch, its release and its PDF." | All batches: status, links, PDF |
| 46 | 46-all-batches-filtered-released.png | Status filter set to "Released", one row left: TB260009 and its "PDF" link | "Filters narrow the list: by batch number, status or product. Here, only released batches." | Filter by status, product, number |

## Chapter 12: TrueBatch Tablets Packing (≈ 55 s)

**Title card:** "12 · Packing: TrueBatch Tablets Packing"

| # | Screenshot | Highlight | Voice-over | Caption |
|---|---|---|---|---|
| 47 | 47-packing-master-new.png | Centre dialog: pack product PK-CPM4-10, bulk product FG-CPM4, shelf life 24 months, MRP 28.50 | "Packing has its own record, TrueBatch Tablets Packing. The packing master names the pack, the bulk product, the shelf life from master data and the MRP." | Packing master: pack, shelf life, MRP |
| 48 | 48-packing-materials-coded.png | "Packing materials" table: "Printed" and "Coded" ticks for foil and carton | "Packing materials come from master data, marked printed and coded. Their issue and reconciliation steps are added in one click." | Printed and coded materials |
| 49 | 49-packing-issue-from-released-bulk.png | Dialog: bulk batch TB260009 and the yellow box "Left to issue of TB260009…" | "Packing order TP260009 is issued only from a released bulk batch, read live from TrueBatch Tablets, with what is left of its good tablets." | Packed only from released bulk |
| 50 | 50-packing-bulk-received-from-truebatch.png | "From TrueBatch Tablets: … RELEASED … manufactured 22 Nov 2026" | "At the line, the bulk's date of manufacture comes from TrueBatch Tablets. The expiry is worked out, never typed." | Mfg date pulled, expiry calculated |
| 51 | 51-coding-check-what-must-print.png | Blue note under the instruction: "It should print: batch no. TB260009 (the bulk batch) · Mfg 11/2026 · Exp 10/2028 · MRP Rs. 28.50" | "The coding check first shows what the pack must print: the bulk batch number, not the packing order, the Mfg and Exp months and the MRP." | It should print: batch, Mfg, Exp, MRP |
| 52 | 52-coding-check-wrong-expiry-caught.png | Right "Results": "Expiry date: Out of limits … DOES NOT MATCH" | "Priya types what is actually printed, and the check compares it with the record. A wrong expiry on the coder is caught at once." | Coding check catches a wrong expiry |
| 53 | 53-coding-check-matches-record.png | Right "Results": all four lines "matches" | "The coder is corrected and every printed field matches the batch record." | Batch no., Mfg, Exp, MRP match |
| 54 | 54-packing-qa-review.png | Top counters and "Stage yields 99.2 %" | "Packing is reconciled and reviewed by exception, just like manufacturing." | Packing reviewed by exception |
| 55 | 55-packing-released.png | Top-right green "Released" chip on TP260009 | "QC approves, and Asha releases TP260009." | Packed batch released |
| 56 | 56-packing-second-order-left-to-issue.png | Yellow box "Left to issue of TB260009: 1,44,326 tablets… 1,50,000 already issued" | "A second order, TP260010, can take only what is left of the bulk batch." | Only what is left can be issued |
| 57 | 57-packing-all-batches.png | Both packing orders with status chips | "All packing orders, in one list." | All packing orders |

## Outro (≈ 10 s)

**End card:** the TrueBatch Tablets emblem (brand/tablets-logo-900.png), with the Medhanta logo smaller below · "TrueBatch Tablets: the
electronic batch record for tablets, with TrueBatch Tablets Packing" · "by Medhanta" · button-style label "Book a demo" ·
gradient bar.

**Voice-over:** "TrueBatch Tablets: the batch record, checked as you go, reviewed by exception, released with
confidence. Book a demo with Medhanta."

**Caption:** "TrueBatch Tablets by Medhanta · Book a demo"

---

**Total:** about 5 min 40 s (intro 0:12, chapters 0:08 + 0:34 + 0:16 + 0:22 + 0:18 + 0:36 + 0:18 + 0:34 + 0:18 +
0:30 + 0:31 + 0:55, outro 0:10).

**Platform features not shown:** "You cannot change your own permissions" (permissions are granted in the Medhanta
platform, not inside TrueBatch Tablets); the 15-minute idle logout is real in the app but only mentioned on the sign-in
screen (it would need 15 idle minutes on camera).
