# Claude Design prompt: TrueBatch Oral Liquids demo video

Paste this whole file into Claude Design. Attach the files in the order given in files-to-attach.md.

## What to make
- A **feature-walkthrough tutorial video** (not an ad) for **TrueBatch Oral Liquids**, the electronic batch
  manufacturing record for oral liquids (syrups, solutions, drops, suspensions, emulsions, dry syrups) by **Medhanta**,
  with its filling and packing record **TrueBatch Oral Liquids Packing**. Audience: plant heads, QA, production and
  engineering users, and buyers in oral liquid manufacturing.
- **Format:** 16:9, **1920×1080**. **Target length: about 5 min 40 s** (must stay between 3 and 6 minutes).
- **Tone:** calm, clear, step-by-step tutorial, plain language. Short GMP terms are explained in about three words
  (e.g. "QA hold – the batch waits for QA", "review by exception – QA looks at what differs", "MMS – material
  management", "deviation note – a record of what went wrong").
- **Captions on** for every step (the caption column below, max about 8 words each).
  Every caption bar carries the small product label **"TrueBatch Oral Liquids"** at its left, before the caption text.
- Use the name **"TrueBatch Oral Liquids"** on every title card and in the captions; **Medhanta** is the maker.

## How to use the screenshots
- The attached screenshots `01-…png` to `52-…png` are **real screens of the product**. Use them **in number order**,
  one per step, full frame.
- **Do not redraw, restyle, crop away or alter the UI in the screenshots.** No fake UI, no changed numbers or names.
  Keep the app's red "DEMO" banner at the top of the screens: it is part of the real product's demo installation.
  Screens 37, 38 and 51 are pages of the product's own PDF records, shown on a grey background.
- For each step: a **gentle zoom (Ken Burns, max ~1.3×)** toward the element in the "Highlight" column, a soft
  highlight (rounded rectangle or circle in Medhanta orange #e8500f, 3 px, slight glow), and an **animated cursor**
  that moves to the highlighted element (and "clicks" when it is a button).
- **Before → after pairs** use a **cross-fade** with the cursor click at the change: 18→19 (pH too high → round 2
  within limits), 20→21 (temperature out of limits → deviation note), 23→24 (QA hold waiting → hold released),
  27→28 (over-use refused → other lot accepted), 30→31 (production signs → closed to changes), 35→36 (release signed →
  released), 46→47 (wrong expiry caught → all fields match).
- Hold each screen long enough for its voice-over (about 4–7 s).

## Brand (Medhanta)
- Primary colour **#e8500f**; gradient **`linear-gradient(90deg,#dd1a10,#f4511e 55%,#f7941d)`** for thin accent bars,
  title-card underlines and the progress bar; grey **#5f5f5f** for secondary text; body text #2b2b2b on #faf8f6.
- Font **Inter** (fallback Segoe UI, system-ui).
- **Logo:** use the product emblem logo for TrueBatch Oral Liquids, **brand/medhanta-liquids-logo.png** (a PNG of
  `medhanta-liquids-logo.svg`; the emblem alone is `medhanta-liquids-mark.svg`), as THE product logo on the intro card,
  every title card (small, top-left) and the end card. It is the emblem the app shows on its sign-in page and header.
  If it is not attached, use the Medhanta logo. The Medhanta logo (**medhanta-logo.png**) appears smaller as the
  maker's logo ("by Medhanta") on the intro and end card. Small mark **medhanta-mark.png** as a corner watermark
  (bottom-right, small, subtle) on screenshot scenes. See brand.md.
- **Title cards:** white/very light background, chapter number and title in Inter semibold, gradient underline, 2–3 s;
  each carries "TrueBatch Oral Liquids" as a small overline.
- **End card:** the TrueBatch Oral Liquids emblem centred, the product name "TrueBatch Oral Liquids – electronic batch
  record for oral liquids, with TrueBatch Oral Liquids Packing", "by Medhanta" with the Medhanta logo, and a
  "Book a demo" button-style label; gradient bar at the bottom.

## Rules
- **No invented numbers** (no savings, percentages of time saved, customer counts or speed claims), **no testimonials**,
  no customer logos. Only what the screens and the voice-over below say.
- All people, products, lot and batch numbers on screen are fictional demo data at the fictional "Medhanta Demo Plant,
  Unit 2"; do not present them as real customers.
- Do not claim features the screens do not show. Medhanta MMS lot and stock data in this demo come from a stand-in made
  the way the product's tests make it; Medhanta LEAD, DIVE, ASSURE, QLIMS and TIDE are not linked (values typed by hand
  and checked by a second person). Do not say they are connected.

## Chapters (title cards)
0. Intro — "TrueBatch Oral Liquids: the batch record, on screen" (0:12)
1. Sign in (0:07)
2. Design the master recipe (0:42)
3. Checked, approved, effective (0:20)
4. Issue the batch and dispense (0:38)
5. Make the bulk, within limits (0:58)
6. Stock from Medhanta MMS (0:14)
7. Review by exception and release (1:10)
8. Filling and packing, with the coding check (1:10)
9. Outro and end card (0:10)
Total about 5:41.

## Intro (title card, ≈ 12 s)
- **Voice-over:** "Paper batch records for syrups and suspensions are slow to fill and hard to review. TrueBatch Oral Liquids puts the whole record on screen, from master recipe to release, filling and packing."
- **Caption:** TrueBatch Oral Liquids: the batch record, on screen

## Steps (follow demo-script.md attached; the full table is here so this prompt works on its own)

| # | Screenshot | Highlight (zoom target, rough position) | Voice-over | Caption |
|---|---|---|---|---|
| 1 | 01-sign-in.png | the TrueBatch Oral Liquids emblem and the orange "Sign in" button, centre-left | Everyone signs in with their own Medhanta account. | Personal sign-in with Medhanta |
| 2 | 02-master-new-from-skeleton.png | the "New master" dialog, right: oral suspension, 500 L, density 1.18 g/mL, then "Process skeleton: Oral suspension" at the bottom | Vikram starts a master for paracetamol oral suspension: five hundred litres, with its density, from a ready suspension skeleton. | Start from an oral suspension skeleton |
| 3 | 03-designer-master-check-missing.png | the "Master check" panel on the right, with its red items | The master check lists everything still missing, and each item links to the setting to fix. | The master check lists what is missing |
| 4 | 04-designer-formula.png | the "MG PER ML" and "BATCH QUANTITY" columns, centre, and purified water "q.s." at the bottom | The formula is in milligrams per millilitre; batch quantities work themselves out. | Formula per mL, quantities calculated |
| 5 | 05-designer-make-up-by-weight.png | the worked example, centre: target batch weight 500 L × 1.18 g/mL = 590 kg | Make-up is by weight: volume times density gives the target, with its limits. | Make-up to weight: volume × density |
| 6 | 06-designer-bulk-test-limits.png | the pH, density, viscosity and assay limits, centre | The bulk test sets limits for pH, density, viscosity and assay. The bulk waits there on a QA hold. | Bulk test limits: pH, density, viscosity |
| 7 | 07-master-review-plain-view.png | the numbered steps in plain words, centre | Reviewers read the whole master in plain words, step by step. | The master in plain words |
| 8 | 08-master-send-for-review-esignature.png | the "Sign: Prepared" dialog, centre, and its orange "Sign" button | Vikram sends it for review with an electronic signature: name, time and meaning. | Sent for review, e-signed |
| 9 | 09-master-approve-change-control.png | the "Change control number" field, centre dialog | Sunil checks it; Asha approves it under change control. | QA approves with change control |
| 10 | 10-master-effective-timeline.png | the timeline under "Version 1: Effective", top-left | Meera makes it effective. The timeline shows who did what, and when. | Effective, with a full timeline |
| 11 | 11-issue-batch.png | the "Issue a batch" dialog, centre: "The batch number is given by the server" | Batches are issued only from the effective master. The server gives the batch number. | Issued from the effective master |
| 12 | 12-my-work-operator.png | "Batches in progress", centre: TL260001 | Priya's My work shows batch TL260001, ready to start. | My work: what is next for me |
| 13 | 13-batch-screen-stages.png | the stage tabs "Vehicle" and "Manufacturing", top, and the step list below | The vehicle is ready. Manufacturing runs its steps in order. | Stages and steps in order |
| 14 | 14-weigh-lot-from-mms.png | the "From MMS" lot line and the assay, left; "Net against target: Within limits", right | She weighs twelve kilos of paracetamol. Lot status and assay come from Medhanta MMS; the weight is checked at once. | Lot data from MMS, weight checked |
| 15 | 15-weigh-esignature.png | the "Sign: Performed" dialog, centre, listing what is signed | She signs the step, and sees exactly what her signature covers. | Sign what you recorded |
| 16 | 16-checker-waiting-for-check.png | "Waiting for your check", centre | A critical weighing needs a second person. Sunil sees it waiting. | Second-person check, waiting |
| 17 | 17-second-person-check-esignature.png | the "Sign: Verified (second person)" dialog, centre-right | He checks it on his own device. The performer can never check her own step. | Checked on the checker's own device |
| 18 | 18-ph-round-1-above-limit.png | "pH 6.4 – Not yet: repeat", top-right, and "Done, repeat (round 2)", bottom | Priya adjusts the pH. Six point four is too high, so she adds citric acid and repeats. | pH outside the window: another round |
| 19 | 19-ph-round-2-within-window.png | "5.6 pH Within limits" and the total added, top-right; the rounds list, right | Round two reads five point six. The total acid added is checked too. | Round 2: pH within limits |
| 20 | 20-make-up-temperature-out-of-limits.png | "Batch weight against the target: Within limits", right, then the red "Temperature 32 °C Out of limits" | At make-up the weight is on target, but the temperature, thirty-two degrees, is above the limit. | Weight on target, temperature out |
| 21 | 21-deviation-note.png | the "Deviation note" dialog, centre | An out-of-limits value cannot be signed without a deviation note. She writes what happened. | Out of limits needs a note |
| 22 | 22-bulk-test-ph-density-viscosity.png | the pH, density, viscosity and assay results, right | QC's bulk results go in: pH, density, viscosity and assay, all within limits. | Bulk test: pH, density, viscosity |
| 23 | 23-qa-my-work-hold-waiting.png | the badge "QA hold: waiting for your release", centre | The batch stops on a QA hold. Asha sees it on her My work. | QA hold: the batch waits |
| 24 | 24-qa-release-the-hold.png | the "Sign: Released" dialog, centre | She releases the hold with her signature, and the batch goes on. | QA releases the hold |
| 25 | 25-bulk-yield-and-accountability.png | "Yield 99.2 %" and "Accountability 99.6 %", centre-right | The bulk is transferred, and yield and accountability are worked out against their limits. | Yield and accountability calculated |
| 26 | 26-batch-manufacturing-complete.png | "Manufacturing complete", top-right, and the yellow "Note to decide" banner | Manufacturing is complete. The open note waits for a QA decision. | Complete, one note to decide |
| 27 | 27-mms-overuse-refused.png | the red message under "Tare weight", left: "2 kg available in MMS … 12 kg cannot be taken" | On batch TL260003, the lot has only two kilos left in MMS. Taking twelve is refused. | Over-use refused at dispensing |
| 28 | 28-mms-other-lot-accepted.png | lot "DEMO-26-PCM-022", left, and "Within limits", right | Priya takes another released lot, and the weighing is accepted. | Another lot, accepted |
| 29 | 29-exception-close-here.png | the "Close the exception here" dialog and its reason, centre | Asha decides the note: she closes it here, with a reason and her signature. | QA closes the note, with a reason |
| 30 | 30-production-approval.png | the "Completeness" list, centre, and "Sign: production approved", right | Production approval checks that the record is complete. | Production approval: record complete |
| 31 | 31-batch-closed-to-changes.png | the blue notice "The record is now closed to changes", centre | Once production signs, here for batch TL260002, the record is closed to changes. | Closed to changes after signing |
| 32 | 32-qc-approval-report-number.png | the "QC report number" field and "Sign: QC approved", bottom | Ravi approves the QC results with his report number. | QC approval with report number |
| 33 | 33-qa-review-by-exception.png | the row of counters, top: corrections, out of limits, open deviations, typed by hand | QA reviews by exception: only what differs. Here, one value out of limits. | Review by exception: what differs |
| 34 | 34-qa-review-out-of-limits-and-notes.png | "Out of limits" and "Deviation notes without a number", centre | Each finding shows with its note and decision, straight from the audit trail. | Findings with notes and decisions |
| 35 | 35-qa-release-esignature.png | the "Sign: Released" dialog with its review summary, centre | Her release signature also records what she reviewed. | Release, e-signed |
| 36 | 36-batch-released.png | the green "Released" status, top-right | TL260001 is released for filling. | Bulk released |
| 37 | 37-batch-record-pdf-cover.png | the cover and the formula with lots used, centre | The complete batch record comes out as a PDF, with lots and quantities. | Complete batch record as PDF |
| 38 | 38-batch-record-pdf-out-of-limits.png | the pH rounds and the make-up row with "FAIL: out of limits", centre-bottom | Every round, signature, note and skipped wait is in it. | Every round and note in the PDF |
| 39 | 39-to-review-list.png | "Waiting for QA release" and "In production" with "Terminate batch", centre | QA's To review list shows what waits for release and what is still in production. | QA's list of batches to review |
| 40 | 40-qa-my-work-finished-batches.png | "Finished on the floor", centre-right: TL260002 QC approved, TL260001 Released | My work also tracks the finished batches and their status. | Finished batches and their status |
| 41 | 41-packing-master-new.png | the "New master" dialog, centre-left: bottle, child-resistant cap, measuring cup, 60 mL plus 1.5 mL, shelf life 24 months, MRP | In TrueBatch Oral Liquids Packing, the packing master sets the bottle, cap, cup, fill, shelf life and MRP. | Packing master: bottle, cap, fill |
| 42 | 42-packing-materials-coded.png | the "PRINTED" and "CODED" ticks on label and carton, centre | The label and carton are marked printed and batch-coded. | Printed, coded materials marked |
| 43 | 43-packing-fill-volume-limits.png | "The mean fill … 61.0 to 62.5 mL" and "Each … 60.5 to 63.0", centre | Fill volume limits are set for the mean and for each bottle; the bulk hold time is checked too. | Fill volume limits, mean and each |
| 44 | 44-packing-bulk-received-from-truebatch.png | "From TrueBatch Oral Liquids … RELEASED", left, and "Expiry date 10/2028", top-right | The packing order takes released bulk TL260001 from TrueBatch Oral Liquids. The expiry is worked out, never typed. | Released bulk, expiry worked out |
| 45 | 45-fill-volume-round-of-10-bottles.png | the ten fill readings, left, and "Mean fill 61.7 mL Within limits", top-right | Each fill round checks ten bottles, mean and each, with the bulk kept stirred. | Ten bottles per fill round |
| 46 | 46-coding-check-wrong-expiry-caught.png | the red "Expiry date Out of limits: … DOES NOT MATCH", right | The coding check compares the printed pack with the record. A wrong expiry is caught at once. | Wrong expiry caught |
| 47 | 47-coding-check-matches-record.png | the green "matches" on batch number, dates and MRP, right | With the coder fixed, batch number, dates and MRP all match. | Printed data matches the record |
| 48 | 48-packing-qa-review.png | the counters, top, and "Stage yields 98.9 %", centre | The bulk, labels and cartons are reconciled, and QA reviews by exception again. | Packing reviewed by exception |
| 49 | 49-packing-qa-release-bulk-deviations-checked.png | the typed bulk deviations box, left, and the green "Sign: released", right | Asha records how she checked the bulk's deviations, then signs. | Bulk deviations checked before release |
| 50 | 50-packing-released.png | the green "Released" status, top-right | Packing order TLP260001 is released. | Packed batch released |
| 51 | 51-packing-record-pdf-reconciliation.png | "Yield 98.9 %" and "Accountability of the bulk issued", top-right, and the reconciliation rows below | Its packing record PDF shows the yield and every reconciliation. | Packing record with reconciliation |
| 52 | 52-packing-second-order-part-issue.png | "Bulk issued 250 L" and "Left to issue of TL260002: 495.5 L", right dialog | The next order takes part of bulk TL260002; the app tracks what is left to issue. | Part issue, the rest tracked |

## Outro (end card, ≈ 10 s)
- **Voice-over:** "TrueBatch Oral Liquids: limits checked as you work, review by exception, and a complete record from master to packed bottle. Book a demo with Medhanta."
- **Caption:** TrueBatch Oral Liquids · Book a demo

## PRONUNCIATION RULES FOR THE VOICE-OVER (apply to every scene; captions keep normal spelling)


1. Speak naturally, at one steady pace (about 130 words a minute). Never slow down, pause or stretch on abbreviations, numbers or brand names.
2. Letter abbreviations are said as quick, joined letters in ONE beat, like a newsreader, never spelled out slowly with gaps: US = "you-ess" (one quick word), EU = "ee-you", UK = "you-kay", FDA = "eff-dee-ay", QA = "cue-ay", QMS = "cue-em-ess", SOP = "ess-oh-pee", OEE = "oh-ee-ee", IQ / OQ / PQ = "eye-cue", "oh-cue", "pee-cue", MIT = "em-eye-tee", DPDP = "dee-pee-dee-pee", AI = "ay-eye", CEO = "see-ee-oh", CFO = "see-eff-oh". Never read the dots in "U.S." or "e.g."; say "you-ess" and "for example".
3. Abbreviations that are said as WORDS: CAPA = "KAP-uh", SHRM = "shurm", Ipca = "IP-kuh".
4. Web addresses and domains: "." is said "dot", and the ending is said as a word: ".in" = "dot in" (rhymes with "pin"), ".com" = "dot com", ".co.in" = "dot co dot in". Never spell an ending letter by letter ("dot i-n" is wrong).
5. Brand and product names (confirm with Medhanta before final recording): Medhanta = "meh-DHAAN-tah", TrueBatch = "TROO-batch", LEAD = "leed", DIVE = "dive", RISE = "rise", TIDE = "tide", ASSURE = "uh-SHOOR", EQUIP = "ee-KWIP", QLIMS = "cue-lims", MMS = "em-em-ess", CLEAR = "clear", Digi = "DIJ-ee" (as in "digital"; "Digi partner" = "DIJ-ee partner", never "DIG-ee"), McKinsey = "muh-KIN-zee", Ranbaxy = "ran-BAK-see", Alexion = "uh-LEK-see-on", Baddi = "BUD-dee".
6. Indian money and numbers, said the Indian way: "₹16 lakh" = "sixteen lakh rupees" (lakh = "laak", rhymes with "rock"), "₹6 crore" = "six crore" (crore = "krore"), "US$4,700" = "forty-seven hundred dollars", "US$10–25 million" = "ten to twenty-five million dollars", "600-batch" = "six-hundred-batch", "60%" = "sixty percent", "2×" = "twice". Never read symbols aloud (₹, $, %, ×, –) as symbol names.
7. Footnote numbers (¹ ² ³) are on screen only. Never say them.
8. If a word could be misread, write it in the voice-over text the way it sounds (for example "DIJ-ee partner", "you-ess", "dot in"), keeping the correct spelling only in the captions.
9. Batch, lot and change-control numbers are read as letters, then the digits in short groups: TL260001 = "tee-ell two-six zero-zero-zero-one", TLP260001 = "tee-ell-pee two-six zero-zero-zero-one", DEV-26-0412 = "dev twenty-six, zero-four-one-two", CC-2026-118 = "cee-cee twenty twenty-six, one-one-eight", DEMO-26-PCM-021 = "demo twenty-six, pee-see-em zero-two-one". "20,000 units" = "twenty thousand units"; "%RH" = "percent humidity"; "µm" = "micron"; "°C" = "degrees".
10. Product and technical words: paracetamol = "para-SEE-ta-mol", pantoprazole = "pan-TOE-pra-zole", ondansetron = "on-DAN-seh-tron", F0 = "eff-zero", EM = "ee-em", RABS = "rabs", QC = "cue-see", MRP = "em-ar-pee", Annex 1 = "annex one", AQL = "ay-cue-ell", IST = "eye-ess-tee", Mfg = "manufacturing date", Exp = "expiry date".
11. This video: mL = "millilitres", mg = "milligrams", pH = "pee-aitch", mPa·s = "millipascal seconds", g/mL = "grams per millilitre", °C = "degrees", q.s. = "q-s" (on screen only), TrueBatch Oral Liquids = "TROO-batch oral liquids".
