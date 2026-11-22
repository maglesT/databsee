# Demo script: TrueBatch Capsules

Feature walkthrough, about 5 min 55 s. One working day at the fictional **Medhanta Demo Plant, Unit 2**. Two fictional products: **FG-OME20** Omeprazole 20 mg enteric-coated pellet capsules (hard gelatin, size 2; pellets made by drug layering on sugar spheres, enteric coating, curing and sieving) and **FG-VD3** Cholecalciferol (vitamin D3) 60,000 IU soft gelatin capsules. Batch TC260001 (omeprazole) is made and released, TC260002 (omeprazole) meets a lot that is nearly used up, TC260003 (vitamin D3 soft gels) is encapsulated and dried, and TC260001 is packed in TrueBatch Capsules Packing as packing orders TCP260001 and TCP260002. All batch numbers were given by the app's own counter.

Cast (all fictional, as shown on screen): Vikram Shah (production manager: writes the masters, issues batches, production approval), Sunil Verma (second-person checks), Priya Nair (operator), Asha Rao (QA head: approves, decides exceptions, releases), Meera Joshi (QA officer: makes a master effective), Ravi Kulkarni (QC manager).

Notes for the editor: every screen carries the app's own red banner "DEMO · a demonstration installation, not for GMP use · waits can be skipped"; it is real, keep it. Timed waits (mixing times, 30-minute rounds, curing and tray-drying times) were ended with the app's "Skip wait (demo)" so the day fits in the video; the record lists every skip for QA. Medhanta MMS stock and lot data come from a stand-in built the way the product's own tests build it; Medhanta LEAD (logbook), DIVE (deviations), QLIMS and TIDE are not linked, so the app asks for those values by hand and a second person checks them. The pellet stages are built from the app's standard blocks (coating suspension, Wurster spray coating with weight gain, heat to an end point, sieve, sieve analysis, lubricate). Screen positions are rough, on the 1920×1080 screenshot. Clock times on screen are not read out.

Plain-word glossary for the voice-over: **IPC** – in-process checks · **master recipe** – the approved master batch record · **review by exception** – QA looks at what differs · **enteric coat** – a coat that resists stomach acid · **curing** – a warm rest that sets the coat · **MMS** – material management · **AV** – acceptance value of content uniformity.

## Intro (≈ 12 s)

**Intro title card:** "TrueBatch Capsules" · subtitle "The electronic batch record for hard and soft gel capsules" · TrueBatch Capsules emblem (brand/medhanta-capsules-logo.png) · small "by Medhanta" line · gradient underline.

**Voice-over:** "Paper capsule batch records are long, easy to get wrong and slow to review. TrueBatch Capsules puts the whole record on screen, from master recipe to release and packing. Let's follow one day."

**Caption:** TrueBatch Capsules: the batch record, on screen

## Chapter 1: Sign in (≈ 8 s)

**Title card:** "TrueBatch Capsules · Sign in"

### Step 1: `01-sign-in.png`
- **Highlight:** The TrueBatch Capsules emblem and the orange "Sign in" button, centre, upper half
- **Voice-over:** "Everyone signs in with their own Medhanta login."
- **Caption:** TrueBatch Capsules: personal sign-in

## Chapter 2: A master recipe for pellet capsules (≈ 36 s)

**Title card:** "TrueBatch Capsules · A master recipe for pellet capsules"

### Step 2: `02-master-new-from-skeleton.png`
- **Highlight:** The "New master" dialog, centre: product FG-OME20, shell type "hard gelatin", size 2, shell weight 61.0 mg, and the selected process skeleton near the bottom
- **Voice-over:** "Vikram starts a master for omeprazole enteric-coated pellet capsules: one lakh size 2 hard gelatin capsules, from a ready skeleton."
- **Caption:** TrueBatch Capsules: shell, size and skeleton

### Step 3: `03-designer-formula-check-refuses.png`
- **Highlight:** The "Master check" panel, top-right, with its two red stop marks
- **Voice-over:** "The master check watches every change. Here it stops water entered twice, and an unanswered question."
- **Caption:** TrueBatch Capsules: the master check stops errors

### Step 4: `04-designer-formula-clean.png`
- **Highlight:** The formula table, centre, and the green "No problems" note, top-right
- **Voice-over:** "Fixed. Milligrams per capsule are typed; batch quantities are worked out."
- **Caption:** TrueBatch Capsules: batch quantities calculated

### Step 5: `05-designer-drug-layering.png`
- **Highlight:** The step "Layer the drug on the sugar spheres", centre: weight-gain, inlet and product temperature limits
- **Voice-over:** "Pellets are built in stages. Drug layering sprays the drug onto sugar spheres, with limits for temperatures and weight gain."
- **Caption:** TrueBatch Capsules: drug layering on sugar spheres

### Step 6: `06-designer-curing.png`
- **Highlight:** The step "Cure the enteric-coated pellets (40 °C, at least 2 h)", centre, with its 38 to 42 °C limits
- **Voice-over:** "After the enteric coat, a coat that resists stomach acid, the pellets cure at forty degrees for at least two hours."
- **Caption:** TrueBatch Capsules: enteric coat, then curing

### Step 7: `07-designer-sieve-analysis.png`
- **Highlight:** The sieve apertures 1400 to 710 µm, centre
- **Voice-over:** "Sieving removes twins and fines; a sieve analysis checks the size."
- **Caption:** TrueBatch Capsules: sieving and pellet size

## Chapter 3: Soft gels and the step library (≈ 18 s)

**Title card:** "TrueBatch Capsules · Soft gels and the step library"

### Step 8: `08-softgel-master-new.png`
- **Highlight:** Shell type "soft gelatin" and "Wet gel mass (mg per capsule)", centre, and the skeleton "Soft gel, oily solution fill" near the bottom
- **Voice-over:** "Soft gels work the same way, from the soft gel skeleton."
- **Caption:** TrueBatch Capsules: soft gel masters too

### Step 9: `09-softgel-designer-encapsulation.png`
- **Highlight:** The step "Encapsulate soft gels with periodic checks", centre: ribbon thickness, wedge temperature, fill and shell weights
- **Voice-over:** "Encapsulation checks ribbons, wedge temperature, seals and fill weights in rounds."
- **Caption:** TrueBatch Capsules: encapsulation checks in rounds

### Step 10: `10-library-capsule.png`
- **Highlight:** The search box "capsule" and the results "Fill capsules with periodic checks", bottom-left
- **Voice-over:** "Every step comes from a searchable library, with its checks built in."
- **Caption:** TrueBatch Capsules: a library of ready steps

## Chapter 4: Checked, approved, effective (≈ 18 s)

**Title card:** "TrueBatch Capsules · Checked, approved, effective"

### Step 11: `11-master-review-plain-view.png`
- **Highlight:** The plain-language view of the header and formula, centre, and "Send for review", top-right
- **Voice-over:** "Reviewers read the whole master in plain words."
- **Caption:** TrueBatch Capsules: plain-language review

### Step 12: `12-master-approve-change-control.png`
- **Highlight:** The "Change control number" field, centre dialog
- **Voice-over:** "After a second-person check, Asha approves for QA with a change control number."
- **Caption:** TrueBatch Capsules: QA approval with change control

### Step 13: `13-master-effective-timeline.png`
- **Highlight:** The timeline of signatures, top-left, and the green "Effective" chip at the top
- **Voice-over:** "Meera makes it effective. Every signature is on the timeline."
- **Caption:** TrueBatch Capsules: one effective version

## Chapter 5: Issue the batch and weigh (≈ 36 s)

**Title card:** "TrueBatch Capsules · Issue the batch and weigh"

### Step 14: `14-issue-batch.png`
- **Highlight:** The "Issue a batch" dialog, centre: "The batch number is given by the server", and "Next: sign"
- **Voice-over:** "Batches are issued only from the effective master; the server gives the number."
- **Caption:** TrueBatch Capsules: issued from the effective master

### Step 15: `15-my-work-operator.png`
- **Highlight:** "Batches in progress" with batch TC260001, centre
- **Voice-over:** "Priya, the operator, finds the batch in My work."
- **Caption:** TrueBatch Capsules: My work for each person

### Step 16: `16-batch-screen-stages.png`
- **Highlight:** The stage tabs across the top: drug layering suspension, drug layering, enteric coating, lubrication, filling
- **Voice-over:** "Stages and steps open in order."
- **Caption:** TrueBatch Capsules: stages and steps in order

### Step 17: `17-weigh-lot-from-mms.png`
- **Highlight:** The lot DEMO-26-OME-007 and the line "From MMS: … approved, expiry …", left, then the assay and LOD pulled from MMS
- **Voice-over:** "She weighs the omeprazole. Lot status, expiry, assay and moisture come from Medhanta MMS."
- **Caption:** TrueBatch Capsules: lot data from MMS

### Step 18: `18-weigh-target-adjusted-for-assay.png`
- **Highlight:** "Target quantity 2.018 kg" and its worked-out line, top-right
- **Voice-over:** "The target is adjusted for the lot's assay, and every sum shows its working."
- **Caption:** TrueBatch Capsules: target adjusted for assay

### Step 19: `19-second-person-check-esignature.png`
- **Highlight:** The "Sign: Verified (second person)" dialog, centre
- **Voice-over:** "A second person checks the critical weighing and signs."
- **Caption:** TrueBatch Capsules: second-person check, e-signed

## Chapter 6: Pellets: layering, enteric coating, curing, sieving (≈ 44 s)

**Title card:** "TrueBatch Capsules · Pellets: layering, enteric coating, curing, sieving"

### Step 20: `20-drug-layering-round-gain-met.png`
- **Highlight:** "Weight gain 34.1 %, within limits 32.0 to 36.0 %", right, and the temperatures above it
- **Voice-over:** "Each spray round records temperatures and spray rate. Rounds stop when the weight gain is within limits."
- **Caption:** TrueBatch Capsules: layering until the gain is met

### Step 21: `21-enteric-coat-out-of-limits.png`
- **Highlight:** The red "Product temperature 36 °C, Out of limits", right, and "Add a deviation note first" in the bottom bar
- **Voice-over:** "In enteric coating, the product temperature goes too high. The step cannot be signed without a note."
- **Caption:** TrueBatch Capsules: out of limits is caught

### Step 22: `22-deviation-note.png`
- **Highlight:** The "Deviation note" dialog, centre: what happened and the deviation number DEV-26-0418
- **Voice-over:** "Priya writes what happened and links the deviation number."
- **Caption:** TrueBatch Capsules: deviation note at the step

### Step 23: `23-curing-minimum-time-running.png`
- **Highlight:** The blue "Minimum time … in 2 h 00 min" bar, top, and "Skip wait (demo)", top-right
- **Voice-over:** "Curing runs on the server clock: two hours at least. In this demo the wait is skipped, and recorded."
- **Caption:** TrueBatch Capsules: curing time on the server clock

### Step 24: `24-sieving-screens-intact.png`
- **Highlight:** "Screen integrity: intact before and after use", top-right
- **Voice-over:** "Both sieve screens are checked intact before and after use."
- **Caption:** TrueBatch Capsules: screens checked before and after

### Step 25: `25-sieve-analysis-results.png`
- **Highlight:** "Sieve analysis 99.8 %, within limits", top-right
- **Voice-over:** "The sieve analysis works out the pellet size."
- **Caption:** TrueBatch Capsules: pellet size worked out

### Step 26: `26-lubricant-rescaled-to-actual-pellets.png`
- **Highlight:** "Lubricant for the actual granules 0.099 kg", right
- **Voice-over:** "The talc is rescaled to the actual pellet weight."
- **Caption:** TrueBatch Capsules: lubricant for the actual weight

## Chapter 7: Filling and in-process checks (≈ 20 s)

**Title card:** "TrueBatch Capsules · Filling and in-process checks"

### Step 27: `27-filling-ipc-round-results.png`
- **Highlight:** The "Results" column, right: mean filled-capsule weight 240.2 mg, individual weights, closed length
- **Voice-over:** "While filling, IPC, in-process checks, run every thirty minutes against the master's limits."
- **Caption:** TrueBatch Capsules: fill weights every 30 minutes

### Step 28: `28-content-uniformity-typed-from-qc.png`
- **Highlight:** "Content uniformity … AV = 2.0 … PASS", top-right, and the ten results, left
- **Voice-over:** "Content uniformity is worked out from QC's results."
- **Caption:** TrueBatch Capsules: content uniformity calculated

### Step 29: `29-reconciliation-capsules-by-weight.png`
- **Highlight:** "Good capsules 98008 capsules", bottom-right, and the net weights, left
- **Voice-over:** "Capsules are counted by weight; yield and accountability are checked."
- **Caption:** TrueBatch Capsules: reconciliation by weight

## Chapter 8: Soft gels on the floor (≈ 19 s)

**Title card:** "TrueBatch Capsules · Soft gels on the floor"

### Step 30: `30-softgel-encapsulation-round.png`
- **Highlight:** The results column, right: ribbon thickness left and right, wedge temperature, within limits
- **Voice-over:** "Meanwhile, the vitamin D3 soft gels are encapsulated, round by round."
- **Caption:** TrueBatch Capsules: soft gel encapsulation rounds

### Step 31: `31-softgel-tray-drying-hardness.png`
- **Highlight:** The "Minimum time of Tray drying (2880 min)" bar, top, and "Mean hardness 7.26 N", right
- **Voice-over:** "Tray drying lasts at least two days, until every capsule's hardness is within limits."
- **Caption:** TrueBatch Capsules: drying to a hardness

### Step 32: `32-softgel-qa-hold.png`
- **Highlight:** The "Release the hold" button, bottom-left
- **Voice-over:** "After the QA sample, the next step waits until QA releases the hold."
- **Caption:** TrueBatch Capsules: QA hold on samples

## Chapter 9: Exceptions and approvals (≈ 24 s)

**Title card:** "TrueBatch Capsules · Exceptions and approvals"

### Step 33: `33-batch-manufacturing-complete.png`
- **Highlight:** The stage tabs, all "CLOSED", and the red "OPEN DEVIATION" and "NOTE TO DECIDE" boxes, top
- **Voice-over:** "All stages are closed, but an open deviation and a note to decide stay visible."
- **Caption:** TrueBatch Capsules: open items stay visible

### Step 34: `34-exception-close-here.png`
- **Highlight:** The "Close the exception here" dialog, centre, with its reason
- **Voice-over:** "Asha closes the small spill note here, with a reason and her signature."
- **Caption:** TrueBatch Capsules: decide a note in place

### Step 35: `35-production-approval.png`
- **Highlight:** The "Completeness" list with ticks and stage yields, centre
- **Voice-over:** "Production signs only a complete record. From then on, it is closed to changes."
- **Caption:** TrueBatch Capsules: complete before production signs

### Step 36: `36-qc-approval-report-number.png`
- **Highlight:** "QC report number" field and "Sign: QC approved", bottom-right
- **Voice-over:** "Ravi signs QC approval with the report number."
- **Caption:** TrueBatch Capsules: QC approval

## Chapter 10: Review by exception and release (≈ 46 s)

**Title card:** "TrueBatch Capsules · Review by exception and release"

### Step 37: `37-qa-review-by-exception.png`
- **Highlight:** The counters at the top: corrections, sent back, late, out of limits, open deviations
- **Voice-over:** "QA reviews by exception: only what differs. Counters show corrections, late entries, out-of-limits results and deviations."
- **Caption:** TrueBatch Capsules: review by exception

### Step 38: `38-qa-review-out-of-limits-and-notes.png`
- **Highlight:** The "Out of limits" entry, 36 °C, and its note DEV-26-0418, centre
- **Voice-over:** "Each exception shows the reading, the limit and its note."
- **Caption:** TrueBatch Capsules: every exception in one place

### Step 39: `39-qa-release-refused-plain-words.png`
- **Highlight:** The red box "Release is not possible yet", bottom-left
- **Voice-over:** "Release is blocked while the deviation is open, and the app says why."
- **Caption:** TrueBatch Capsules: release blocked, in plain words

### Step 40: `40-qa-close-deviation.png`
- **Highlight:** The "Close deviation DEV-26-0418" dialog, centre, with its reason
- **Voice-over:** "Asha records the outcome and closes the deviation."
- **Caption:** TrueBatch Capsules: QA closes the deviation

### Step 41: `41-batch-released.png`
- **Highlight:** The green "Released" chip, top-right
- **Voice-over:** "She signs the release, which also records her review of the audit trail."
- **Caption:** TrueBatch Capsules: released by e-signature

### Step 42: `42-batch-closed-to-changes.png`
- **Highlight:** The three green ticks at the bottom: production approved, QC approved, released, and the signature list above
- **Voice-over:** "Every signature is listed; the record is closed to changes."
- **Caption:** TrueBatch Capsules: closed to changes

### Step 43: `43-batch-record-pdf-cover.png`
- **Highlight:** The heading "Batch record TC260001", status "Released", and the formula with lots used, top-left
- **Voice-over:** "A complete PDF copy holds every value, lot and signature."
- **Caption:** TrueBatch Capsules: the batch record PDF

### Step 44: `44-my-work-batches-finished-on-floor.png`
- **Highlight:** "Finished on the floor": TC260003 and TC260001 "Released", and TC260002 in progress above, centre
- **Voice-over:** "My work lists batches in progress and finished, with their status."
- **Caption:** TrueBatch Capsules: batches and their status

## Chapter 11: Stock from Medhanta MMS (≈ 13 s)

**Title card:** "TrueBatch Capsules · Stock from Medhanta MMS"

### Step 45: `45-mms-overuse-refused.png`
- **Highlight:** The red message under "Gross weight": "Lot DEMO-26-OME-007 has 1.182 kg available in MMS …", top-left
- **Voice-over:** "For the next batch, the same omeprazole lot has only 1.182 kilograms left in MMS, so the weighing is refused."
- **Caption:** TrueBatch Capsules: over-use refused at dispensing

### Step 46: `46-mms-other-lot-accepted.png`
- **Highlight:** Lot DEMO-26-OME-008, left, and "+0.3 %, within limits", right
- **Voice-over:** "Another released lot is taken, with a new target for its assay."
- **Caption:** TrueBatch Capsules: another lot, new target

## Chapter 12: Packing: TrueBatch Capsules Packing (≈ 46 s)

**Title card:** "TrueBatch Capsules · Packing: TrueBatch Capsules Packing"

### Step 47: `47-packing-master-new.png`
- **Highlight:** The "New master" dialog, centre: pack PK-OME20-10, bulk FG-OME20, 10 capsules per pack, shelf life 24 months, MRP 65.00
- **Voice-over:** "Packing has its own record, TrueBatch Capsules Packing. Its master names the pack, bulk product, shelf life and MRP."
- **Caption:** TrueBatch Capsules Packing: the packing master

### Step 48: `48-packing-materials-coded.png`
- **Highlight:** The "Printed" and "Coded" ticks in the packing materials table, centre
- **Voice-over:** "Printed and coded materials get their issue and reconciliation steps in one click."
- **Caption:** TrueBatch Capsules Packing: printed and coded materials

### Step 49: `49-packing-issue-from-released-bulk.png`
- **Highlight:** Bulk batch TC260001, "Bulk capsules issued 50000" and the yellow "Left to issue" box, centre
- **Voice-over:** "A packing order is issued only from released bulk, read live from TrueBatch Capsules."
- **Caption:** TrueBatch Capsules Packing: only released bulk

### Step 50: `50-packing-bulk-received-from-truebatch.png`
- **Highlight:** "Date of manufacture of the bulk" with "From TrueBatch Capsules", left
- **Voice-over:** "The date of manufacture comes with it; the expiry is worked out, never typed."
- **Caption:** TrueBatch Capsules Packing: expiry calculated

### Step 51: `51-coding-check-wrong-expiry-caught.png`
- **Highlight:** "Expiry date: Out of limits … DOES NOT MATCH", top-right
- **Voice-over:** "Priya types what the coder printed. A wrong expiry is caught at once."
- **Caption:** TrueBatch Capsules Packing: wrong expiry caught

### Step 52: `52-coding-check-matches-record.png`
- **Highlight:** All result lines "matches": batch no., manufacture, expiry and MRP, right
- **Voice-over:** "Corrected: every printed field matches the record."
- **Caption:** TrueBatch Capsules Packing: print matches the record

### Step 53: `53-packing-released.png`
- **Highlight:** The green "Released" chip on TCP260001, top-right
- **Voice-over:** "Packing is reconciled, reviewed by exception and released."
- **Caption:** TrueBatch Capsules Packing: packed batch released

### Step 54: `54-packing-second-order-left-to-issue.png`
- **Highlight:** The yellow box "Left to issue of TC260001: 48,008 capsules … 50,000 already issued", centre
- **Voice-over:** "A second order can take only what is left of the bulk."
- **Caption:** TrueBatch Capsules Packing: only what is left

## Outro (≈ 10 s)

**Voice-over:** "TrueBatch Capsules: hard capsules, pellets and soft gels, checked as you go, reviewed by exception and released with confidence. Book a demo with Medhanta."

**Caption:** TrueBatch Capsules by Medhanta · Book a demo

**End card (≈ 5 s):** brand/medhanta-capsules-logo.png centred · "TrueBatch Capsules" · "Electronic batch record for hard and soft gel capsules, with TrueBatch Capsules Packing" · small "by Medhanta" line with medhanta-logo.png · button-style "Book a demo" · gradient bar.

## Timing

| Part | Screens | Duration |
|---|---|---|
| Intro | title card | ≈ 12 s |
| 1. Sign in | 01 | ≈ 8 s |
| 2. A master recipe for pellet capsules | 02–07 | ≈ 36 s |
| 3. Soft gels and the step library | 08–10 | ≈ 18 s |
| 4. Checked, approved, effective | 11–13 | ≈ 18 s |
| 5. Issue the batch and weigh | 14–19 | ≈ 36 s |
| 6. Pellets: layering, coating, curing, sieving | 20–26 | ≈ 44 s |
| 7. Filling and in-process checks | 27–29 | ≈ 20 s |
| 8. Soft gels on the floor | 30–32 | ≈ 19 s |
| 9. Exceptions and approvals | 33–36 | ≈ 24 s |
| 10. Review by exception and release | 37–44 | ≈ 46 s |
| 11. Stock from Medhanta MMS | 45–46 | ≈ 13 s |
| 12. Packing: TrueBatch Capsules Packing | 47–54 | ≈ 46 s |
| Outro + end card | — | ≈ 15 s |
| **Total** | 54 screens | **≈ 5 min 55 s** |
