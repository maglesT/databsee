# Claude Design prompt: TrueBatch API demo video

Paste this whole file into Claude Design. Attach the files in the order given in files-to-attach.md. It also works on
its own: the full per-step script is below (the same as demo-script.md).

## What to make
- A **feature-walkthrough tutorial video** (not an ad) for **TrueBatch API**, the electronic batch record for making an
  active pharmaceutical ingredient (API) by chemical synthesis, by **Medhanta**. Audience: plant heads, QA, production
  and engineering users, and buyers in API (bulk drug) manufacturing.
- **Format:** 16:9, **1920×1080**. **Target length: about 5 min 30 s – 5 min 45 s** (must stay between 3 and 6 minutes).
- **Tone:** calm, clear, step-by-step tutorial in plain language. Short GMP terms are explained in about three words
  (e.g. "IPC – in-process check", "review by exception – QA looks at what differs", "MMS – material management").
- **Captions on** for every step (the caption column below, max about 8 words each).
- Use the name **"TrueBatch API"** on every title card and in the captions; **Medhanta** is the maker.

## How to use the screenshots
- The attached screenshots `01-…png` to `44-…png` are **real screens of the product**. Use them **in number order**,
  one per step, full frame.
- **Do not redraw, restyle, crop away or alter the UI in the screenshots.** No fake UI, no changed numbers or names.
  Keep the app's red "DEMO" banner at the top of the screens: it is part of the real product's demo installation.
- For each step: a **gentle zoom (Ken Burns, max ~1.3×)** toward the element in the "Highlight" column, a soft
  highlight (rounded rectangle or circle in Medhanta orange #e8500f, 3 px, slight glow), and an **animated cursor**
  that moves to the highlighted element (and "clicks" when it is a button).
- **Before → after pairs** use a **cross-fade** with the cursor click at the change: 14→15→16 (lot pulled from MMS →
  over-use refused → other lot accepted), 17→18→19→20 (signed → waiting for check → checker's view → verified),
  22→23→24 (out of limits → deviation note → end point reached), 38→39→40→41 (release refused → exception closed →
  release signed → released), 43→44 (PDF page → zoom into the lots column).
- Hold each screen long enough for its voice-over (about 4–7 s).

## Brand (Medhanta)
- Primary colour **#e8500f**; gradient **`linear-gradient(90deg,#dd1a10,#f4511e 55%,#f7941d)`** for thin accent bars,
  title-card underlines and the progress bar; grey **#5f5f5f** for secondary text; body text #2b2b2b on #faf8f6.
- Font **Inter** (fallback Segoe UI, system-ui).
- **Product logo: use the TrueBatch API emblem `brand/medhanta-api-logo.png`** (a PNG of `medhanta-api-logo.svg`; the
  emblem alone is `medhanta-api-mark.svg`) as THE product logo on the intro card, every title card (small, top-left)
  and the end card. It is the same emblem the app shows on its sign-in page and header. The Medhanta logo
  (**medhanta-logo.png**) appears smaller as the maker's logo ("by Medhanta") on the intro and end card. Small mark
  **medhanta-mark.png** as a corner watermark (bottom-right, small, subtle) on screenshot scenes. See brand.md.
- **Title cards:** white/very light background, chapter number and title in Inter semibold, gradient underline, 2–3 s;
  each carries "TrueBatch API" as a small overline.
- **End card:** the TrueBatch API emblem (`medhanta-api-logo.png`) centred, "TrueBatch API — electronic batch record for
  active pharmaceutical ingredients", "by Medhanta" with the Medhanta logo, and a **"Book a demo"** button-style label;
  gradient bar at the bottom.

## Rules
- **No invented numbers** (no savings, time saved, customer counts or speed claims), **no testimonials**, no customer
  logos. Only what the screens and the voice-over below say.
- All people, materials, lot and batch numbers on screen are fictional demo data at the fictional "Medhanta Demo Plant,
  Unit 2"; do not present them as real customers.
- Do not claim features the screens do not show. TrueBatch API has no "All batches" list screen; do not invent one.

## Chapters (title cards)
0. Intro — "TrueBatch API: the API batch record, on screen" (0:12)
1. Sign in and start a master (0:14)
2. Design the synthesis recipe (0:32)
3. Checked, approved, effective (0:26)
4. Issue the batch (0:20)
5. Charging from MMS stock (0:56)
6. Reaction and in-process limits (0:34)
7. Yield and batch genealogy (0:34)
8. Pack and label (0:22)
9. Exceptions, production and QC approval (0:22)
10. Review by exception and release (0:46)
11. The batch record and genealogy (0:18)
Outro and end card (0:10) — total about 5:46.

## Full script: per step screenshot, highlight, voice-over and caption

**Intro (title card "TrueBatch API: the API batch record, on screen", with the TrueBatch API emblem):** voice-over "Paper records for a chemical synthesis are long and slow to review. TrueBatch API puts the whole batch record on screen, from the first charge to the released drums. Let's follow one batch of chlorphenamine maleate."
Caption: TrueBatch API: the API batch record, on screen

| # | Screenshot | Highlight (position on screen) | Voice-over | Caption |
|---|---|---|---|---|
| — | **Chapter 1: Sign in and start a master** | | | |
| 1 | 01-sign-in.png | the TrueBatch API emblem and the orange "Sign in" button, centre | "Everyone signs in with their own Medhanta account." | TrueBatch API: personal sign-in |
| 2 | 02-master-new-from-skeleton.png | the "Process skeleton: Multi-step synthesis" option, centre-right dialog | "Vikram starts a master for chlorphenamine maleate, one hundred and fifty kilos a batch, from a synthesis skeleton." | Start from a synthesis skeleton |
| — | **Chapter 2: Design the synthesis recipe** | | | |
| 3 | 03-designer-formula.png | the Quantity column with "eq (as kg)" and "L per kg of key input", centre | "The formula is set per stage: starting material in kilos, reagents in molar equivalents, solvents in litres per kilo." | Formula in kg, equivalents or L per kg |
| 4 | 04-designer-reaction-ipc-limits.png | the temperature limits 105 to 112 °C and the IPC result limit 1.0 %, centre | "The alkylation runs at reflux, between one hundred and five and one hundred and twelve degrees, until the IPC – in-process check – is one percent or less." | Reaction limits and IPC end point |
| 5 | 05-designer-stage-yield.png | the yield limits 82.0 to 95.0 % and the worked example, centre | "Each stage ends with a yield against the molar theoretical, with limits, and a worked example." | Stage yield: molar theoretical, with limits |
| 6 | 06-designer-stage-intermediate.png | "This stage produces an intermediate": chlorphenamine base, hold time 72 hours, right | "Step one makes chlorphenamine base, an intermediate with its own hold time. Step two uses it." | Intermediate, hold time and molecular weight |
| — | **Chapter 3: Checked, approved, effective** | | | |
| 7 | 07-master-review-plain-view.png | step 9 "Alkylation at reflux" sentence in the plain view, centre | "The plain view reads the recipe back in sentences, so the reviewer checks words, not settings." | The recipe in plain words |
| 8 | 08-master-send-for-review-esignature.png | the "Sign: Prepared" dialog and its "Sign" button, centre | "Vikram signs it as prepared. The e-signature records his name, the time and the meaning." | E-signature: prepared |
| 9 | 09-master-approve-change-control.png | the "Change control number" box CC-2026-118, centre | "Sunil checks it, and Asha approves it for QA under a change control number." | QA approval under change control |
| 10 | 10-master-effective-timeline.png | the timeline: sent, checked, approved, made effective, top-left | "Meera, a second QA person, makes it effective. Every signature stays on the timeline." | One effective version, full history |
| — | **Chapter 4: Issue the batch** | | | |
| 11 | 11-issue-batch.png | the "Issue a batch" dialog and "Next: sign", centre | "Vikram issues a batch. The server gives the number, never typed and never reused." | Issue from the effective master |
| 12 | 12-my-work-operator.png | "TA260004 · Chlorphenamine maleate" under "Batches in progress", centre | "On the plant floor, Priya sees batch T A two-six zero-zero-zero-four on her My work page." | Work waiting on My work |
| 13 | 13-batch-screen-stages.png | the three stage tabs: Step 1, Step 2, Pack and label, top-centre | "The batch shows its stages in order, each starting with line clearance." | Stages and steps in order |
| — | **Chapter 5: Charging from MMS stock** | | | |
| 14 | 14-weigh-lot-from-mms.png | the "From MMS" line under the lot DEMO-26-CBP-021, left | "Priya weighs the starting material. The lot's status, dates and assay come straight from Medhanta MMS." | Lot status and assay from MMS |
| 15 | 15-mms-overuse-refused.png | the red message "has 40 kg available in MMS", centre | "This lot has only forty kilos left in stock, so taking a hundred is refused, in plain words." | Over-use of stock refused |
| 16 | 16-mms-other-lot-accepted.png | "Net against target 0.0 % Within limits", right | "Another lot is accepted. The target is adjusted for its assay, and the net weight is within limits." | Target adjusted for assay, within tolerance |
| 17 | 17-weigh-esignature.png | the "Sign: Performed" dialog with the recorded values, centre | "She signs it as performed, seeing exactly what she signs." | Signed as performed |
| 18 | 18-checker-waiting-for-check.png | "Waiting for your check: Weigh the starting material", centre | "A critical step waits for a second person. Sunil sees it on his own My work." | Second-person check on your list |
| 19 | 19-checker-sees-target-adjusted-for-assay.png | "How it was worked out" under Target quantity, right | "He sees how every number was worked out. The person who did a step can never check it." | Every calculation shown |
| 20 | 20-second-person-check-esignature.png | the "Sign: Verified (second person)" dialog, centre | "Sunil signs as verified." | Verified by a second person |
| 21 | 21-weigh-reagent-molar-equivalents.png | the worked-out target "494.476 mol × 1.20 eq", right | "Reagents follow the actual starting material: one point two molar equivalents, then adjusted for assay." | Molar equivalents on the actual charge |
| — | **Chapter 6: Reaction and in-process limits** | | | |
| 22 | 22-reaction-temperature-out-of-limits.png | the red "Out of limits 114 °C" result, right | "The reaction is checked every hour. In round two the temperature is above its limit, flagged at once." | Out of limits, flagged at once |
| 23 | 23-deviation-note.png | the "Deviation note" dialog and "What happened", centre | "The step cannot be signed until Priya writes a deviation note." | A deviation note before signing |
| 24 | 24-reaction-ipc-end-point-reached.png | the Rounds list: round 3 "Passed · 0.6 %", right | "In round three the IPC shows point six percent: end point reached." | IPC end point reached |
| 25 | 25-distil-solvent-to-recovery.png | "Volume left against the end point 126 L Within limits", right | "After the quench and separation, the toluene is distilled off and sent to solvent recovery." | Work-up and distillation recorded |
| — | **Chapter 7: Yield and batch genealogy** | | | |
| 26 | 26-step1-yield-molar-theoretical.png | Theoretical quantity 135.877 kg and Yield 86.5 % Within limits, right | "Step one's yield is eighty-six point five percent of the molar theoretical, within limits." | Theoretical against actual yield |
| 27 | 27-weigh-maleic-acid-from-intermediate.png | "52.157 kg (on the actual chlorphenamine base 117.6 kg)", right | "In step two, the maleic acid is worked out from the actual base yielded, not from the plan." | Step 2 follows the actual intermediate |
| 28 | 28-centrifuge-loads-and-wash.png | "Wash quantity per load 58.80 L" and "Total wet cake 158.800 kg", right | "The salt is crystallised and centrifuged in loads, each wash checked against the master." | Isolation in loads, wash checked |
| 29 | 29-api-yield-within-limits.png | Yield 90.5 % Within limits, limit 85.0 to 100.5 %, right | "After drying to L O D and milling, the API yield is ninety point five percent, within limits." | API yield within limits |
| — | **Chapter 8: Pack and label** | | | |
| 30 | 30-pack-fill-and-label-drum.png | "Net weight 25.000 kg" and "Label checked", right | "Pack and label is the last stage of the same record. Each drum is weighed, sealed and its label checked." | Each drum weighed, sealed, labelled |
| 31 | 31-qa-hold-sample-release.png | the green "Release the hold" button, bottom-left | "Samples for QC wait on a QA hold until Asha releases it." | QA hold on samples |
| 32 | 32-label-reconciliation.png | used 6, destroyed 4, returned 0, left | "Labels are reconciled, and the batch-coded leftovers are destroyed and recorded." | Labels reconciled |
| — | **Chapter 9: Exceptions, production and QC approval** | | | |
| 33 | 33-batch-manufacturing-complete.png | the yellow "Note to decide" banner, top-centre | "Every stage is closed; the deviation note still waits for a decision." | Exceptions flagged on the batch |
| 34 | 34-production-approval.png | the completeness list and "Sign: production approved", centre-right | "Vikram signs production approval on a complete record." | Production approval on a complete record |
| 35 | 35-qc-approval-report-number.png | "QC report number" QC-26-1244 and "Sign: QC approved", bottom | "Ravi signs Q C approval with the report number." | QC approval with report number |
| — | **Chapter 10: Review by exception and release** | | | |
| 36 | 36-qa-to-review-list.png | "Waiting for QA release: TA260004", centre | "The batch reaches Asha's To review list." | Waiting for QA release |
| 37 | 37-qa-review-by-exception.png | the five counters, "1 Out of limits", top-centre | "Review by exception: QA looks first at what differs. Corrections, late timers and out-of-limit values are counted and listed." | Review by exception |
| 38 | 38-qa-release-refused-plain-words.png | the red "Release is not possible yet" box, centre | "Release is blocked, and the app says why: the deviation note still waits for a decision." | Release refused, in plain words |
| 39 | 39-exception-close-here.png | "Reason for closing it here" and "Next: sign", centre | "Asha closes it here with a reason and her e-signature, or could send it to Medhanta DIVE." | Exception closed with a reason |
| 40 | 40-qa-release-esignature.png | the "Sign: Released" dialog with the review summary, centre | "Her release signature also records what she reviewed." | QA release by e-signature |
| 41 | 41-batch-released.png | the green "Released" badge and "Retest date 31 Oct 2029", top | "The batch is released. The retest date is worked out from the date of manufacture, never typed." | Released, retest date calculated |
| 42 | 42-batch-released-closed-to-changes.png | "Exception closed here by Asha Rao", centre | "The record is now closed to changes, with every decision kept on the batch." | Closed to changes |
| — | **Chapter 11: The batch record and genealogy** | | | |
| 43 | 43-batch-record-pdf-cover.png | the PDF header: Batch record TA260004, Released, centre | "One click gives the complete batch record as a P D F, with every signature and change." | The complete batch record PDF |
| 44 | 44-batch-record-lots-genealogy.png | the "Lots and dispensed quantities" column, right | "Its formula table is the batch genealogy: which lots went into the batch, how much, and in which step." | Genealogy: every lot in the batch |

**Outro (end card):** voice-over "TrueBatch API: every charge, reaction and yield checked as you go, reviewed by exception and released with confidence. Book a demo with Medhanta." Caption: TrueBatch API by Medhanta · Book a demo


## PRONUNCIATION RULES FOR THE VOICE-OVER (apply to every scene; captions keep normal spelling)

1. Speak naturally, at one steady pace (about 130 words a minute). Never slow down, pause or stretch on abbreviations, numbers or brand names.
2. Letter abbreviations are said as quick, joined letters in ONE beat, like a newsreader, never spelled out slowly with gaps: US = "you-ess" (one quick word), EU = "ee-you", UK = "you-kay", FDA = "eff-dee-ay", QA = "cue-ay", QMS = "cue-em-ess", SOP = "ess-oh-pee", OEE = "oh-ee-ee", IQ / OQ / PQ = "eye-cue", "oh-cue", "pee-cue", MIT = "em-eye-tee", DPDP = "dee-pee-dee-pee", AI = "ay-eye", CEO = "see-ee-oh", CFO = "see-eff-oh", IPC = "eye-pee-see", QC = "cue-see", MRP = "em-ar-pee", PDF = "pee-dee-eff", LOD = "ell-oh-dee". Never read the dots in "U.S." or "e.g."; say "you-ess" and "for example".
3. Abbreviations that are said as WORDS: CAPA = "KAP-uh", SHRM = "shurm", Ipca = "IP-kuh".
4. Web addresses and domains: "." is said "dot", and the ending is said as a word: ".in" = "dot in" (rhymes with "pin"), ".com" = "dot com", ".co.in" = "dot co dot in". Never spell an ending letter by letter ("dot i-n" is wrong).
5. Brand and product names (confirm with Medhanta before final recording): Medhanta = "meh-DHAAN-tah", TrueBatch = "TROO-batch", LEAD = "leed", DIVE = "dive", RISE = "rise", TIDE = "tide", ASSURE = "uh-SHOOR", EQUIP = "ee-KWIP", QLIMS = "cue-lims", MMS = "em-em-ess", CLEAR = "clear", Digi = "DIJ-ee" (as in "digital"; "Digi partner" = "DIJ-ee partner", never "DIG-ee"), McKinsey = "muh-KIN-zee", Ranbaxy = "ran-BAK-see", Alexion = "uh-LEK-see-on", Baddi = "BUD-dee".
6. Indian money and numbers, said the Indian way: "₹16 lakh" = "sixteen lakh rupees" (lakh = "laak", rhymes with "rock"), "₹6 crore" = "six crore" (crore = "krore"), "US$4,700" = "forty-seven hundred dollars", "US$10–25 million" = "ten to twenty-five million dollars", "600-batch" = "six-hundred-batch", "60%" = "sixty percent", "2×" = "twice". Never read symbols aloud (₹, $, %, ×, –) as symbol names.
7. Footnote numbers (¹ ² ³) are on screen only. Never say them.
8. If a word could be misread, write it in the voice-over text the way it sounds (for example "DIJ-ee partner", "you-ess", "dot in"), keeping the correct spelling only in the captions.
9. Batch, lot and change-control numbers are read as letters, then the digits in short groups: TA260004 = "tee-ay two-six zero-zero-zero-four", CC-2026-118 = "cee-cee twenty twenty-six, one-one-eight". API = "ay-pee-eye"; IPC = "eye-pee-see"; "°C" = "degrees"; chlorphenamine = "klor-FEN-uh-meen"; maleate = "MAL-ee-ate".
