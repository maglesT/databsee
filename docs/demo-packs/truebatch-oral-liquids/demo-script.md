# Demo script: TrueBatch Oral Liquids

**Product:** TrueBatch Oral Liquids (electronic batch manufacturing record for oral liquids: syrups, solutions, drops,
suspensions, emulsions and dry syrups), with its packing app TrueBatch Oral Liquids Packing, by Medhanta.
**Format:** 16:9, 1920×1080, calm step-by-step tutorial, captions on. **Target length:** about 5 min 40 s (3–6 min).
**Story:** one working day at the fictional *Medhanta Demo Plant, Unit 2*. A master recipe for *Paracetamol oral
suspension 120 mg/5 mL* (product FG-PCS120, 500 L batches) is built from the oral suspension skeleton, checked and
approved. Batch TL260001 is dispensed, homogenised, pH-adjusted, made up to weight, tested under a QA hold, reviewed by
exception and released. Batch TL260002 follows and is closed to changes at production approval; batch TL260003 meets a
lot with too little stock at dispensing. TL260001 is then filled and packed as packing order TLP260001; a second order
from TL260002 is issued as a part issue. All people, products, lots and numbers on screen are fictional demo data.

**Cast (fictional, as shown on screen):** Vikram Shah – production manager (writes the master, issues batches,
production approval) · Sunil Verma – production executive (second-person checks) · Priya Nair – operator · Asha Rao –
QA head (approves, decides exceptions, releases) · Meera Joshi – QA officer (makes the master effective) · Ravi
Kulkarni – QC manager.

**Notes for the editor**
- Every screen carries the app's own red banner "DEMO · a demonstration installation, not for GMP use · waits can be
  skipped". It is real; keep it. Timed waits (hydration and mixing times, the next fill round) were skipped with the
  app's "Skip wait (demo)" so the day fits in the video; the record lists each skip for QA, so some times read "0 min".
- Medhanta MMS (Material Management) is not connected in this demo installation. Its lots, stock and certificate values
  come from a stand-in made the way the product's own tests make it (paracetamol lots DEMO-26-PCM-021 with 14 kg and
  DEMO-26-PCM-022 with 25 kg, excipients and packing materials). The app reads it exactly as it reads MMS. Medhanta LEAD
  (logbook), DIVE (deviations), ASSURE (QMS), QLIMS and TIDE are not linked: the app asks for those values by hand, a
  second person checks them, and QA sees them listed as "typed by hand".
- Batch numbers TL260001–TL260003 and packing order TLP260001 were given by the app's own counters.
- Positions are rough, on the 1920×1080 screenshot. All screens were taken on TrueBatch Oral Liquids main at commit 1d14ca8.

## Intro (≈ 12 s)
**Title card:** "TrueBatch Oral Liquids: the batch record, on screen" · subtitle "From master recipe to released, filled
and packed bottles" · TrueBatch Oral Liquids emblem (brand/medhanta-liquids-logo.png).
**Voice-over:** "Paper batch records for syrups and suspensions are slow to fill and hard to review. TrueBatch Oral Liquids puts the whole record on screen, from master recipe to release, filling and packing."
**Caption:** TrueBatch Oral Liquids: the batch record, on screen

## Chapter 1: Sign in (≈ 7 s)
**Title card:** "TrueBatch Oral Liquids · 1 · Sign in"

### Step 1: `01-sign-in.png`
- **Highlight:** the TrueBatch Oral Liquids emblem and the orange "Sign in" button, centre-left
- **Voice-over:** "Everyone signs in with their own Medhanta account."
- **Caption:** Personal sign-in with Medhanta

## Chapter 2: Design the master recipe (≈ 42 s)
**Title card:** "TrueBatch Oral Liquids · 2 · Design the master recipe"

### Step 2: `02-master-new-from-skeleton.png`
- **Highlight:** the "New master" dialog, right: oral suspension, 500 L, density 1.18 g/mL, then "Process skeleton: Oral suspension" at the bottom
- **Voice-over:** "Vikram starts a master for paracetamol oral suspension: five hundred litres, with its density, from a ready suspension skeleton."
- **Caption:** Start from an oral suspension skeleton

### Step 3: `03-designer-master-check-missing.png`
- **Highlight:** the "Master check" panel on the right, with its red items
- **Voice-over:** "The master check lists everything still missing, and each item links to the setting to fix."
- **Caption:** The master check lists what is missing

### Step 4: `04-designer-formula.png`
- **Highlight:** the "MG PER ML" and "BATCH QUANTITY" columns, centre, and purified water "q.s." at the bottom
- **Voice-over:** "The formula is in milligrams per millilitre; batch quantities work themselves out."
- **Caption:** Formula per mL, quantities calculated

### Step 5: `05-designer-make-up-by-weight.png`
- **Highlight:** the worked example, centre: target batch weight 500 L × 1.18 g/mL = 590 kg
- **Voice-over:** "Make-up is by weight: volume times density gives the target, with its limits."
- **Caption:** Make-up to weight: volume × density

### Step 6: `06-designer-bulk-test-limits.png`
- **Highlight:** the pH, density, viscosity and assay limits, centre
- **Voice-over:** "The bulk test sets limits for pH, density, viscosity and assay. The bulk waits there on a QA hold."
- **Caption:** Bulk test limits: pH, density, viscosity

### Step 7: `07-master-review-plain-view.png`
- **Highlight:** the numbered steps in plain words, centre
- **Voice-over:** "Reviewers read the whole master in plain words, step by step."
- **Caption:** The master in plain words

## Chapter 3: Checked, approved, effective (≈ 20 s)
**Title card:** "TrueBatch Oral Liquids · 3 · Checked, approved, effective"

### Step 8: `08-master-send-for-review-esignature.png`
- **Highlight:** the "Sign: Prepared" dialog, centre, and its orange "Sign" button
- **Voice-over:** "Vikram sends it for review with an electronic signature: name, time and meaning."
- **Caption:** Sent for review, e-signed

### Step 9: `09-master-approve-change-control.png`
- **Highlight:** the "Change control number" field, centre dialog
- **Voice-over:** "Sunil checks it; Asha approves it under change control."
- **Caption:** QA approves with change control

### Step 10: `10-master-effective-timeline.png`
- **Highlight:** the timeline under "Version 1: Effective", top-left
- **Voice-over:** "Meera makes it effective. The timeline shows who did what, and when."
- **Caption:** Effective, with a full timeline

## Chapter 4: Issue the batch and dispense (≈ 38 s)
**Title card:** "TrueBatch Oral Liquids · 4 · Issue the batch and dispense"

### Step 11: `11-issue-batch.png`
- **Highlight:** the "Issue a batch" dialog, centre: "The batch number is given by the server"
- **Voice-over:** "Batches are issued only from the effective master. The server gives the batch number."
- **Caption:** Issued from the effective master

### Step 12: `12-my-work-operator.png`
- **Highlight:** "Batches in progress", centre: TL260001
- **Voice-over:** "Priya's My work shows batch TL260001, ready to start."
- **Caption:** My work: what is next for me

### Step 13: `13-batch-screen-stages.png`
- **Highlight:** the stage tabs "Vehicle" and "Manufacturing", top, and the step list below
- **Voice-over:** "The vehicle is ready. Manufacturing runs its steps in order."
- **Caption:** Stages and steps in order

### Step 14: `14-weigh-lot-from-mms.png`
- **Highlight:** the "From MMS" lot line and the assay, left; "Net against target: Within limits", right
- **Voice-over:** "She weighs twelve kilos of paracetamol. Lot status and assay come from Medhanta MMS; the weight is checked at once."
- **Caption:** Lot data from MMS, weight checked

### Step 15: `15-weigh-esignature.png`
- **Highlight:** the "Sign: Performed" dialog, centre, listing what is signed
- **Voice-over:** "She signs the step, and sees exactly what her signature covers."
- **Caption:** Sign what you recorded

### Step 16: `16-checker-waiting-for-check.png`
- **Highlight:** "Waiting for your check", centre
- **Voice-over:** "A critical weighing needs a second person. Sunil sees it waiting."
- **Caption:** Second-person check, waiting

### Step 17: `17-second-person-check-esignature.png`
- **Highlight:** the "Sign: Verified (second person)" dialog, centre-right
- **Voice-over:** "He checks it on his own device. The performer can never check her own step."
- **Caption:** Checked on the checker's own device

## Chapter 5: Make the bulk, within limits (≈ 58 s)
**Title card:** "TrueBatch Oral Liquids · 5 · Make the bulk, within limits"

### Step 18: `18-ph-round-1-above-limit.png`
- **Highlight:** "pH 6.4 – Not yet: repeat", top-right, and "Done, repeat (round 2)", bottom
- **Voice-over:** "Priya adjusts the pH. Six point four is too high, so she adds citric acid and repeats."
- **Caption:** pH outside the window: another round

### Step 19: `19-ph-round-2-within-window.png`
- **Highlight:** "5.6 pH Within limits" and the total added, top-right; the rounds list, right
- **Voice-over:** "Round two reads five point six. The total acid added is checked too."
- **Caption:** Round 2: pH within limits

### Step 20: `20-make-up-temperature-out-of-limits.png`
- **Highlight:** "Batch weight against the target: Within limits", right, then the red "Temperature 32 °C Out of limits"
- **Voice-over:** "At make-up the weight is on target, but the temperature, thirty-two degrees, is above the limit."
- **Caption:** Weight on target, temperature out

### Step 21: `21-deviation-note.png`
- **Highlight:** the "Deviation note" dialog, centre
- **Voice-over:** "An out-of-limits value cannot be signed without a deviation note. She writes what happened."
- **Caption:** Out of limits needs a note

### Step 22: `22-bulk-test-ph-density-viscosity.png`
- **Highlight:** the pH, density, viscosity and assay results, right
- **Voice-over:** "QC's bulk results go in: pH, density, viscosity and assay, all within limits."
- **Caption:** Bulk test: pH, density, viscosity

### Step 23: `23-qa-my-work-hold-waiting.png`
- **Highlight:** the badge "QA hold: waiting for your release", centre
- **Voice-over:** "The batch stops on a QA hold. Asha sees it on her My work."
- **Caption:** QA hold: the batch waits

### Step 24: `24-qa-release-the-hold.png`
- **Highlight:** the "Sign: Released" dialog, centre
- **Voice-over:** "She releases the hold with her signature, and the batch goes on."
- **Caption:** QA releases the hold

### Step 25: `25-bulk-yield-and-accountability.png`
- **Highlight:** "Yield 99.2 %" and "Accountability 99.6 %", centre-right
- **Voice-over:** "The bulk is transferred, and yield and accountability are worked out against their limits."
- **Caption:** Yield and accountability calculated

### Step 26: `26-batch-manufacturing-complete.png`
- **Highlight:** "Manufacturing complete", top-right, and the yellow "Note to decide" banner
- **Voice-over:** "Manufacturing is complete. The open note waits for a QA decision."
- **Caption:** Complete, one note to decide

## Chapter 6: Stock from Medhanta MMS (≈ 14 s)
**Title card:** "TrueBatch Oral Liquids · 6 · Stock from Medhanta MMS"

### Step 27: `27-mms-overuse-refused.png`
- **Highlight:** the red message under "Tare weight", left: "2 kg available in MMS … 12 kg cannot be taken"
- **Voice-over:** "On batch TL260003, the lot has only two kilos left in MMS. Taking twelve is refused."
- **Caption:** Over-use refused at dispensing

### Step 28: `28-mms-other-lot-accepted.png`
- **Highlight:** lot "DEMO-26-PCM-022", left, and "Within limits", right
- **Voice-over:** "Priya takes another released lot, and the weighing is accepted."
- **Caption:** Another lot, accepted

## Chapter 7: Review by exception and release (≈ 70 s)
**Title card:** "TrueBatch Oral Liquids · 7 · Review by exception and release"

### Step 29: `29-exception-close-here.png`
- **Highlight:** the "Close the exception here" dialog and its reason, centre
- **Voice-over:** "Asha decides the note: she closes it here, with a reason and her signature."
- **Caption:** QA closes the note, with a reason

### Step 30: `30-production-approval.png`
- **Highlight:** the "Completeness" list, centre, and "Sign: production approved", right
- **Voice-over:** "Production approval checks that the record is complete."
- **Caption:** Production approval: record complete

### Step 31: `31-batch-closed-to-changes.png`
- **Highlight:** the blue notice "The record is now closed to changes", centre
- **Voice-over:** "Once production signs, here for batch TL260002, the record is closed to changes."
- **Caption:** Closed to changes after signing

### Step 32: `32-qc-approval-report-number.png`
- **Highlight:** the "QC report number" field and "Sign: QC approved", bottom
- **Voice-over:** "Ravi approves the QC results with his report number."
- **Caption:** QC approval with report number

### Step 33: `33-qa-review-by-exception.png`
- **Highlight:** the row of counters, top: corrections, out of limits, open deviations, typed by hand
- **Voice-over:** "QA reviews by exception: only what differs. Here, one value out of limits."
- **Caption:** Review by exception: what differs

### Step 34: `34-qa-review-out-of-limits-and-notes.png`
- **Highlight:** "Out of limits" and "Deviation notes without a number", centre
- **Voice-over:** "Each finding shows with its note and decision, straight from the audit trail."
- **Caption:** Findings with notes and decisions

### Step 35: `35-qa-release-esignature.png`
- **Highlight:** the "Sign: Released" dialog with its review summary, centre
- **Voice-over:** "Her release signature also records what she reviewed."
- **Caption:** Release, e-signed

### Step 36: `36-batch-released.png`
- **Highlight:** the green "Released" status, top-right
- **Voice-over:** "TL260001 is released for filling."
- **Caption:** Bulk released

### Step 37: `37-batch-record-pdf-cover.png`
- **Highlight:** the cover and the formula with lots used, centre
- **Voice-over:** "The complete batch record comes out as a PDF, with lots and quantities."
- **Caption:** Complete batch record as PDF

### Step 38: `38-batch-record-pdf-out-of-limits.png`
- **Highlight:** the pH rounds and the make-up row with "FAIL: out of limits", centre-bottom
- **Voice-over:** "Every round, signature, note and skipped wait is in it."
- **Caption:** Every round and note in the PDF

### Step 39: `39-to-review-list.png`
- **Highlight:** "Waiting for QA release" and "In production" with "Terminate batch", centre
- **Voice-over:** "QA's To review list shows what waits for release and what is still in production."
- **Caption:** QA's list of batches to review

### Step 40: `40-qa-my-work-finished-batches.png`
- **Highlight:** "Finished on the floor", centre-right: TL260002 QC approved, TL260001 Released
- **Voice-over:** "My work also tracks the finished batches and their status."
- **Caption:** Finished batches and their status

## Chapter 8: Filling and packing, with the coding check (≈ 70 s)
**Title card:** "TrueBatch Oral Liquids · 8 · Filling and packing, with the coding check"

### Step 41: `41-packing-master-new.png`
- **Highlight:** the "New master" dialog, centre-left: bottle, child-resistant cap, measuring cup, 60 mL plus 1.5 mL, shelf life 24 months, MRP
- **Voice-over:** "In TrueBatch Oral Liquids Packing, the packing master sets the bottle, cap, cup, fill, shelf life and MRP."
- **Caption:** Packing master: bottle, cap, fill

### Step 42: `42-packing-materials-coded.png`
- **Highlight:** the "PRINTED" and "CODED" ticks on label and carton, centre
- **Voice-over:** "The label and carton are marked printed and batch-coded."
- **Caption:** Printed, coded materials marked

### Step 43: `43-packing-fill-volume-limits.png`
- **Highlight:** "The mean fill … 61.0 to 62.5 mL" and "Each … 60.5 to 63.0", centre
- **Voice-over:** "Fill volume limits are set for the mean and for each bottle; the bulk hold time is checked too."
- **Caption:** Fill volume limits, mean and each

### Step 44: `44-packing-bulk-received-from-truebatch.png`
- **Highlight:** "From TrueBatch Oral Liquids … RELEASED", left, and "Expiry date 10/2028", top-right
- **Voice-over:** "The packing order takes released bulk TL260001 from TrueBatch Oral Liquids. The expiry is worked out, never typed."
- **Caption:** Released bulk, expiry worked out

### Step 45: `45-fill-volume-round-of-10-bottles.png`
- **Highlight:** the ten fill readings, left, and "Mean fill 61.7 mL Within limits", top-right
- **Voice-over:** "Each fill round checks ten bottles, mean and each, with the bulk kept stirred."
- **Caption:** Ten bottles per fill round

### Step 46: `46-coding-check-wrong-expiry-caught.png`
- **Highlight:** the red "Expiry date Out of limits: … DOES NOT MATCH", right
- **Voice-over:** "The coding check compares the printed pack with the record. A wrong expiry is caught at once."
- **Caption:** Wrong expiry caught

### Step 47: `47-coding-check-matches-record.png`
- **Highlight:** the green "matches" on batch number, dates and MRP, right
- **Voice-over:** "With the coder fixed, batch number, dates and MRP all match."
- **Caption:** Printed data matches the record

### Step 48: `48-packing-qa-review.png`
- **Highlight:** the counters, top, and "Stage yields 98.9 %", centre
- **Voice-over:** "The bulk, labels and cartons are reconciled, and QA reviews by exception again."
- **Caption:** Packing reviewed by exception

### Step 49: `49-packing-qa-release-bulk-deviations-checked.png`
- **Highlight:** the typed bulk deviations box, left, and the green "Sign: released", right
- **Voice-over:** "Asha records how she checked the bulk's deviations, then signs."
- **Caption:** Bulk deviations checked before release

### Step 50: `50-packing-released.png`
- **Highlight:** the green "Released" status, top-right
- **Voice-over:** "Packing order TLP260001 is released."
- **Caption:** Packed batch released

### Step 51: `51-packing-record-pdf-reconciliation.png`
- **Highlight:** "Yield 98.9 %" and "Accountability of the bulk issued", top-right, and the reconciliation rows below
- **Voice-over:** "Its packing record PDF shows the yield and every reconciliation."
- **Caption:** Packing record with reconciliation

### Step 52: `52-packing-second-order-part-issue.png`
- **Highlight:** "Bulk issued 250 L" and "Left to issue of TL260002: 495.5 L", right dialog
- **Voice-over:** "The next order takes part of bulk TL260002; the app tracks what is left to issue."
- **Caption:** Part issue, the rest tracked

## Outro (≈ 10 s)
**End card:** TrueBatch Oral Liquids emblem, "TrueBatch Oral Liquids – electronic batch record for oral liquids, with
TrueBatch Oral Liquids Packing", "by Medhanta", "Book a demo".
**Voice-over:** "TrueBatch Oral Liquids: limits checked as you work, review by exception, and a complete record from master to packed bottle. Book a demo with Medhanta."
**Caption:** TrueBatch Oral Liquids · Book a demo

## Timing
| Part | Steps | Duration |
|---|---|---|
| Intro | title card | 0:12 |
| 1 Sign in | 1 | 0:07 |
| 2 Design the master recipe | 2–7 | 0:42 |
| 3 Checked, approved, effective | 8–10 | 0:20 |
| 4 Issue the batch and dispense | 11–17 | 0:38 |
| 5 Make the bulk, within limits | 18–26 | 0:58 |
| 6 Stock from Medhanta MMS | 27–28 | 0:14 |
| 7 Review by exception and release | 29–40 | 1:10 |
| 8 Filling and packing, with the coding check | 41–52 | 1:10 |
| Outro | end card | 0:10 |
| **Total** | 52 screens, 8 title cards | **≈ 5:41** |
