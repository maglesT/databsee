# Demo script: TrueBatch API

**Product:** TrueBatch API, the electronic batch record for making an active pharmaceutical ingredient (API) by chemical
synthesis, from the first charge to QA release of the packed, labelled drums, by Medhanta.
**Format:** 16:9, 1920×1080, calm step-by-step tutorial, captions on. **Target length:** about 5 min 30 s.
**Story:** one working day at the fictional *Medhanta Demo Plant, Unit 2*. A master recipe for *Chlorphenamine maleate*
(API-CPM, the API that feeds the TrueBatch Tablets story) is built from a skeleton, checked and approved. Batch TA260004
runs Step 1 (alkylation to chlorphenamine base), Step 2 (maleate salt, crystallisation, centrifuge, drying, milling) and
Pack and label, then is reviewed by exception and released. All people, materials, lots and numbers are fictional demo
data. Batch number TA260004 was given by the app's own counter.

**Cast (fictional):** Vikram Shah – production manager · Sunil Verma – production executive (second-person checks) ·
Priya Nair – operator · Asha Rao – QA head · Meera Joshi – QA officer · Ravi Kulkarni – QC manager.

**Notes for the editor:** every screen carries the app's real red "DEMO" banner; keep it. Timed waits (60-minute
reaction checks, cooling rounds) were skipped with the app's own "Skip wait (demo)", and the record lists each skip for
QA. Medhanta MMS stock and certificates come from a stand-in built the way the product's own tests build it; Medhanta
LEAD (Logbook), DIVE (Deviations) and QLIMS are not linked, so the app asks for those values by hand and a second person
checks them. Screens 43 and 44 are page 1 of the real batch record PDF, placed on a plain background.

## Intro (≈ 12 s)
**Voice-over:** "Paper records for a chemical synthesis are long and slow to review. TrueBatch API puts the whole batch record on screen, from the first charge to the released drums. Let's follow one batch of chlorphenamine maleate."
**Caption:** TrueBatch API: the API batch record, on screen

## Chapter 1: Sign in and start a master (≈ 14 s)
### Step 1: `01-sign-in.png`
- **Highlight:** the TrueBatch API emblem and the orange "Sign in" button, centre
- **Voice-over:** "Everyone signs in with their own Medhanta account."
- **Caption:** TrueBatch API: personal sign-in
### Step 2: `02-master-new-from-skeleton.png`
- **Highlight:** the "Process skeleton: Multi-step synthesis" option, centre-right dialog
- **Voice-over:** "Vikram starts a master for chlorphenamine maleate, one hundred and fifty kilos a batch, from a synthesis skeleton."
- **Caption:** Start from a synthesis skeleton

## Chapter 2: Design the synthesis recipe (≈ 32 s)
### Step 3: `03-designer-formula.png`
- **Highlight:** the Quantity column with "eq (as kg)" and "L per kg of key input", centre
- **Voice-over:** "The formula is set per stage: starting material in kilos, reagents in molar equivalents, solvents in litres per kilo."
- **Caption:** Formula in kg, equivalents or L per kg
### Step 4: `04-designer-reaction-ipc-limits.png`
- **Highlight:** the temperature limits 105 to 112 °C and the IPC result limit 1.0 %, centre
- **Voice-over:** "The alkylation runs at reflux, between one hundred and five and one hundred and twelve degrees, until the IPC – in-process check – is one percent or less."
- **Caption:** Reaction limits and IPC end point
### Step 5: `05-designer-stage-yield.png`
- **Highlight:** the yield limits 82.0 to 95.0 % and the worked example, centre
- **Voice-over:** "Each stage ends with a yield against the molar theoretical, with limits, and a worked example."
- **Caption:** Stage yield: molar theoretical, with limits
### Step 6: `06-designer-stage-intermediate.png`
- **Highlight:** "This stage produces an intermediate": chlorphenamine base, hold time 72 hours, right
- **Voice-over:** "Step one makes chlorphenamine base, an intermediate with its own hold time. Step two uses it."
- **Caption:** Intermediate, hold time and molecular weight

## Chapter 3: Checked, approved, effective (≈ 26 s)
### Step 7: `07-master-review-plain-view.png`
- **Highlight:** step 9 "Alkylation at reflux" sentence in the plain view, centre
- **Voice-over:** "The plain view reads the recipe back in sentences, so the reviewer checks words, not settings."
- **Caption:** The recipe in plain words
### Step 8: `08-master-send-for-review-esignature.png`
- **Highlight:** the "Sign: Prepared" dialog and its "Sign" button, centre
- **Voice-over:** "Vikram signs it as prepared. The e-signature records his name, the time and the meaning."
- **Caption:** E-signature: prepared
### Step 9: `09-master-approve-change-control.png`
- **Highlight:** the "Change control number" box CC-2026-118, centre
- **Voice-over:** "Sunil checks it, and Asha approves it for QA under a change control number."
- **Caption:** QA approval under change control
### Step 10: `10-master-effective-timeline.png`
- **Highlight:** the timeline: sent, checked, approved, made effective, top-left
- **Voice-over:** "Meera, a second QA person, makes it effective. Every signature stays on the timeline."
- **Caption:** One effective version, full history

## Chapter 4: Issue the batch (≈ 20 s)
### Step 11: `11-issue-batch.png`
- **Highlight:** the "Issue a batch" dialog and "Next: sign", centre
- **Voice-over:** "Vikram issues a batch. The server gives the number, never typed and never reused."
- **Caption:** Issue from the effective master
### Step 12: `12-my-work-operator.png`
- **Highlight:** "TA260004 · Chlorphenamine maleate" under "Batches in progress", centre
- **Voice-over:** "On the plant floor, Priya sees batch T A two-six zero-zero-zero-four on her My work page."
- **Caption:** Work waiting on My work
### Step 13: `13-batch-screen-stages.png`
- **Highlight:** the three stage tabs: Step 1, Step 2, Pack and label, top-centre
- **Voice-over:** "The batch shows its stages in order, each starting with line clearance."
- **Caption:** Stages and steps in order

## Chapter 5: Charging from MMS stock (≈ 56 s)
### Step 14: `14-weigh-lot-from-mms.png`
- **Highlight:** the "From MMS" line under the lot DEMO-26-CBP-021, left
- **Voice-over:** "Priya weighs the starting material. The lot's status, dates and assay come straight from Medhanta MMS."
- **Caption:** Lot status and assay from MMS
### Step 15: `15-mms-overuse-refused.png`
- **Highlight:** the red message "has 40 kg available in MMS", centre
- **Voice-over:** "This lot has only forty kilos left in stock, so taking a hundred is refused, in plain words."
- **Caption:** Over-use of stock refused
### Step 16: `16-mms-other-lot-accepted.png`
- **Highlight:** "Net against target 0.0 % Within limits", right
- **Voice-over:** "Another lot is accepted. The target is adjusted for its assay, and the net weight is within limits."
- **Caption:** Target adjusted for assay, within tolerance
### Step 17: `17-weigh-esignature.png`
- **Highlight:** the "Sign: Performed" dialog with the recorded values, centre
- **Voice-over:** "She signs it as performed, seeing exactly what she signs."
- **Caption:** Signed as performed
### Step 18: `18-checker-waiting-for-check.png`
- **Highlight:** "Waiting for your check: Weigh the starting material", centre
- **Voice-over:** "A critical step waits for a second person. Sunil sees it on his own My work."
- **Caption:** Second-person check on your list
### Step 19: `19-checker-sees-target-adjusted-for-assay.png`
- **Highlight:** "How it was worked out" under Target quantity, right
- **Voice-over:** "He sees how every number was worked out. The person who did a step can never check it."
- **Caption:** Every calculation shown
### Step 20: `20-second-person-check-esignature.png`
- **Highlight:** the "Sign: Verified (second person)" dialog, centre
- **Voice-over:** "Sunil signs as verified."
- **Caption:** Verified by a second person
### Step 21: `21-weigh-reagent-molar-equivalents.png`
- **Highlight:** the worked-out target "494.476 mol × 1.20 eq", right
- **Voice-over:** "Reagents follow the actual starting material: one point two molar equivalents, then adjusted for assay."
- **Caption:** Molar equivalents on the actual charge

## Chapter 6: Reaction and in-process limits (≈ 34 s)
### Step 22: `22-reaction-temperature-out-of-limits.png`
- **Highlight:** the red "Out of limits 114 °C" result, right
- **Voice-over:** "The reaction is checked every hour. In round two the temperature is above its limit, flagged at once."
- **Caption:** Out of limits, flagged at once
### Step 23: `23-deviation-note.png`
- **Highlight:** the "Deviation note" dialog and "What happened", centre
- **Voice-over:** "The step cannot be signed until Priya writes a deviation note."
- **Caption:** A deviation note before signing
### Step 24: `24-reaction-ipc-end-point-reached.png`
- **Highlight:** the Rounds list: round 3 "Passed · 0.6 %", right
- **Voice-over:** "In round three the IPC shows point six percent: end point reached."
- **Caption:** IPC end point reached
### Step 25: `25-distil-solvent-to-recovery.png`
- **Highlight:** "Volume left against the end point 126 L Within limits", right
- **Voice-over:** "After the quench and separation, the toluene is distilled off and sent to solvent recovery."
- **Caption:** Work-up and distillation recorded

## Chapter 7: Yield and batch genealogy (≈ 34 s)
### Step 26: `26-step1-yield-molar-theoretical.png`
- **Highlight:** Theoretical quantity 135.877 kg and Yield 86.5 % Within limits, right
- **Voice-over:** "Step one's yield is eighty-six point five percent of the molar theoretical, within limits."
- **Caption:** Theoretical against actual yield
### Step 27: `27-weigh-maleic-acid-from-intermediate.png`
- **Highlight:** "52.157 kg (on the actual chlorphenamine base 117.6 kg)", right
- **Voice-over:** "In step two, the maleic acid is worked out from the actual base yielded, not from the plan."
- **Caption:** Step 2 follows the actual intermediate
### Step 28: `28-centrifuge-loads-and-wash.png`
- **Highlight:** "Wash quantity per load 58.80 L" and "Total wet cake 158.800 kg", right
- **Voice-over:** "The salt is crystallised and centrifuged in loads, each wash checked against the master."
- **Caption:** Isolation in loads, wash checked
### Step 29: `29-api-yield-within-limits.png`
- **Highlight:** Yield 90.5 % Within limits, limit 85.0 to 100.5 %, right
- **Voice-over:** "After drying to L O D and milling, the API yield is ninety point five percent, within limits."
- **Caption:** API yield within limits

## Chapter 8: Pack and label (≈ 22 s)
### Step 30: `30-pack-fill-and-label-drum.png`
- **Highlight:** "Net weight 25.000 kg" and "Label checked", right
- **Voice-over:** "Pack and label is the last stage of the same record. Each drum is weighed, sealed and its label checked."
- **Caption:** Each drum weighed, sealed, labelled
### Step 31: `31-qa-hold-sample-release.png`
- **Highlight:** the green "Release the hold" button, bottom-left
- **Voice-over:** "Samples for QC wait on a QA hold until Asha releases it."
- **Caption:** QA hold on samples
### Step 32: `32-label-reconciliation.png`
- **Highlight:** used 6, destroyed 4, returned 0, left
- **Voice-over:** "Labels are reconciled, and the batch-coded leftovers are destroyed and recorded."
- **Caption:** Labels reconciled

## Chapter 9: Exceptions, production and QC approval (≈ 22 s)
### Step 33: `33-batch-manufacturing-complete.png`
- **Highlight:** the yellow "Note to decide" banner, top-centre
- **Voice-over:** "Every stage is closed; the deviation note still waits for a decision."
- **Caption:** Exceptions flagged on the batch
### Step 34: `34-production-approval.png`
- **Highlight:** the completeness list and "Sign: production approved", centre-right
- **Voice-over:** "Vikram signs production approval on a complete record."
- **Caption:** Production approval on a complete record
### Step 35: `35-qc-approval-report-number.png`
- **Highlight:** "QC report number" QC-26-1244 and "Sign: QC approved", bottom
- **Voice-over:** "Ravi signs Q C approval with the report number."
- **Caption:** QC approval with report number

## Chapter 10: Review by exception and release (≈ 46 s)
### Step 36: `36-qa-to-review-list.png`
- **Highlight:** "Waiting for QA release: TA260004", centre
- **Voice-over:** "The batch reaches Asha's To review list."
- **Caption:** Waiting for QA release
### Step 37: `37-qa-review-by-exception.png`
- **Highlight:** the five counters, "1 Out of limits", top-centre
- **Voice-over:** "Review by exception: QA looks first at what differs. Corrections, late timers and out-of-limit values are counted and listed."
- **Caption:** Review by exception
### Step 38: `38-qa-release-refused-plain-words.png`
- **Highlight:** the red "Release is not possible yet" box, centre
- **Voice-over:** "Release is blocked, and the app says why: the deviation note still waits for a decision."
- **Caption:** Release refused, in plain words
### Step 39: `39-exception-close-here.png`
- **Highlight:** "Reason for closing it here" and "Next: sign", centre
- **Voice-over:** "Asha closes it here with a reason and her e-signature, or could send it to Medhanta DIVE."
- **Caption:** Exception closed with a reason
### Step 40: `40-qa-release-esignature.png`
- **Highlight:** the "Sign: Released" dialog with the review summary, centre
- **Voice-over:** "Her release signature also records what she reviewed."
- **Caption:** QA release by e-signature
### Step 41: `41-batch-released.png`
- **Highlight:** the green "Released" badge and "Retest date 31 Oct 2029", top
- **Voice-over:** "The batch is released. The retest date is worked out from the date of manufacture, never typed."
- **Caption:** Released, retest date calculated
### Step 42: `42-batch-released-closed-to-changes.png`
- **Highlight:** "Exception closed here by Asha Rao", centre
- **Voice-over:** "The record is now closed to changes, with every decision kept on the batch."
- **Caption:** Closed to changes

## Chapter 11: The batch record and genealogy (≈ 18 s)
### Step 43: `43-batch-record-pdf-cover.png`
- **Highlight:** the PDF header: Batch record TA260004, Released, centre
- **Voice-over:** "One click gives the complete batch record as a P D F, with every signature and change."
- **Caption:** The complete batch record PDF
### Step 44: `44-batch-record-lots-genealogy.png`
- **Highlight:** the "Lots and dispensed quantities" column, right
- **Voice-over:** "Its formula table is the batch genealogy: which lots went into the batch, how much, and in which step."
- **Caption:** Genealogy: every lot in the batch

## Outro (≈ 10 s)
**Voice-over:** "TrueBatch API: every charge, reaction and yield checked as you go, reviewed by exception and released with confidence. Book a demo with Medhanta."
**Caption:** TrueBatch API by Medhanta · Book a demo

## Timing
| Part | Screens | Duration |
|---|---|---|
| Intro and title card | — | 0:12 |
| 1 Sign in and start a master | 01–02 | 0:14 |
| 2 Design the synthesis recipe | 03–06 | 0:32 |
| 3 Checked, approved, effective | 07–10 | 0:26 |
| 4 Issue the batch | 11–13 | 0:20 |
| 5 Charging from MMS stock | 14–21 | 0:56 |
| 6 Reaction and in-process limits | 22–25 | 0:34 |
| 7 Yield and batch genealogy | 26–29 | 0:34 |
| 8 Pack and label | 30–32 | 0:22 |
| 9 Exceptions, production and QC approval | 33–35 | 0:22 |
| 10 Review by exception and release | 36–42 | 0:46 |
| 11 The batch record and genealogy | 43–44 | 0:18 |
| Outro and end card | — | 0:10 |
| **Total** | 44 screens | **about 5:46** |
