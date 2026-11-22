# Claude Design prompt: TrueBatch Capsules demo video

Paste this whole file into Claude Design. Attach the files in the order given in files-to-attach.md.

## What to make
- A **feature-walkthrough tutorial video** (not an ad) for **TrueBatch Capsules**, the electronic batch manufacturing
  record for hard and soft gel capsules by **Medhanta**, with its packing record **TrueBatch Capsules Packing**.
  Audience: plant heads, QA, production and engineering users, and buyers in capsule manufacturing.
- **Format:** 16:9, **1920×1080**. **Target length: about 5 min 55 s** (must stay between 3 and 6 minutes).
- **Tone:** calm, clear, step-by-step tutorial, plain language. Short GMP terms are explained in about three words
  (e.g. "IPC – in-process checks", "review by exception – only what differs", "enteric coat – resists stomach acid").
- **Captions on** for every step (the caption column below, max about 8 words each).
- Use the name **"TrueBatch Capsules"** on every title card and in every caption; **Medhanta** is the maker.

## How to use the screenshots
- The attached screenshots `01-…png` to `54-…png` are **real screens of the product**. Use them **in number order**,
  one per step, full frame.
- **Do not redraw, restyle, crop away or alter the UI in the screenshots.** No fake UI, no changed numbers or names.
  Keep the app's red "DEMO" banner at the top of the screens: it is part of the real product's demo installation.
- For each step: a **gentle zoom (Ken Burns, max ~1.3×)** toward the element in the "Highlight" column, a soft
  highlight (rounded rectangle or circle in Medhanta orange #e8500f, 3 px, slight glow), and an **animated cursor**
  that moves to the highlighted element (and "clicks" when it is a button).
- **Before → after pairs** use a **cross-fade** with the cursor click at the change: 03→04 (master check stops two
  errors → clean), 21→22 (out of limits → deviation note), 38→39→40→41 (exception → release refused → deviation closed
  → released), 45→46 (over-use refused → other lot accepted), 51→52 (wrong expiry caught → all fields match).
- Hold each screen long enough for its voice-over (about 4–7 s).

## Brand (Medhanta)
- Primary colour **#e8500f**; gradient **`linear-gradient(90deg,#dd1a10,#f4511e 55%,#f7941d)`** for thin accent bars,
  title-card underlines and the progress bar; grey **#5f5f5f** for secondary text; body text #2b2b2b on #faf8f6.
- Font **Inter** (fallback Segoe UI, system-ui).
- **The product logo is the TrueBatch Capsules emblem `brand/medhanta-capsules-logo.png`** (a 900 px PNG of
  `medhanta-capsules-logo.svg`; the emblem alone is `medhanta-capsules-mark.svg`). Use the product emblem logo for
  TrueBatch Capsules if attached; otherwise the Medhanta logo. It goes on the intro card, every title card (small,
  top-left) and the end card; it is the emblem the app shows on its sign-in page and header. The Medhanta logo
  (**medhanta-logo.png**) appears smaller as the maker's logo ("by Medhanta") on the intro and end card. Small mark
  **medhanta-mark.png** as a corner watermark (bottom-right, small, subtle) on screenshot scenes. See brand.md.
- **Title cards:** white/very light background, chapter number and title in Inter semibold, gradient underline, 2–3 s;
  each reads "TrueBatch Capsules · <chapter title>".
- **End card:** the TrueBatch Capsules emblem centred, "TrueBatch Capsules — electronic batch record for hard and soft
  gel capsules, with TrueBatch Capsules Packing", "by Medhanta" with the Medhanta logo, and a "Book a demo"
  button-style label; gradient bar at the bottom.

## Rules
- **No invented numbers** (no savings, time saved, customer counts or speed claims), **no testimonials**, no customer
  logos. Only what the screens and the voice-over below say.
- All people, products, lot and batch numbers on screen are fictional demo data at the fictional "Medhanta Demo Plant,
  Unit 2"; do not present them as real customers.
- Do not claim features the screens do not show. Do not redraw or alter the UI in the screenshots.

## Chapters (title cards)
0. Intro — "TrueBatch Capsules" · "The electronic batch record for hard and soft gel capsules" (≈ 12 s)
1. **TrueBatch Capsules · Sign in** — screens 01–01 (≈ 8 s)
2. **TrueBatch Capsules · A master recipe for pellet capsules** — screens 02–07 (≈ 36 s)
3. **TrueBatch Capsules · Soft gels and the step library** — screens 08–10 (≈ 18 s)
4. **TrueBatch Capsules · Checked, approved, effective** — screens 11–13 (≈ 18 s)
5. **TrueBatch Capsules · Issue the batch and weigh** — screens 14–19 (≈ 36 s)
6. **TrueBatch Capsules · Pellets: layering, enteric coating, curing, sieving** — screens 20–26 (≈ 44 s)
7. **TrueBatch Capsules · Filling and in-process checks** — screens 27–29 (≈ 20 s)
8. **TrueBatch Capsules · Soft gels on the floor** — screens 30–32 (≈ 19 s)
9. **TrueBatch Capsules · Exceptions and approvals** — screens 33–36 (≈ 24 s)
10. **TrueBatch Capsules · Review by exception and release** — screens 37–44 (≈ 46 s)
11. **TrueBatch Capsules · Stock from Medhanta MMS** — screens 45–46 (≈ 13 s)
12. **TrueBatch Capsules · Packing: TrueBatch Capsules Packing** — screens 47–54 (≈ 46 s)
13. Outro and end card (≈ 15 s) — total about 5 min 55 s.

## Full script (also in the attached demo-script.md; follow it)

**Intro voice-over:** "Paper capsule batch records are long, easy to get wrong and slow to review. TrueBatch Capsules puts the whole record on screen, from master recipe to release and packing. Let's follow one day."  
**Intro caption:** TrueBatch Capsules: the batch record, on screen

| # | Screenshot | Highlight (where to zoom) | Voice-over | Caption |
|---|---|---|---|---|
| 1 | 01-sign-in.png | The TrueBatch Capsules emblem and the orange "Sign in" button, centre, upper half | "Everyone signs in with their own Medhanta login." | TrueBatch Capsules: personal sign-in |
| 2 | 02-master-new-from-skeleton.png | The "New master" dialog, centre: product FG-OME20, shell type "hard gelatin", size 2, shell weight 61.0 mg, and the selected process skeleton near the bottom | "Vikram starts a master for omeprazole enteric-coated pellet capsules: one lakh size 2 hard gelatin capsules, from a ready skeleton." | TrueBatch Capsules: shell, size and skeleton |
| 3 | 03-designer-formula-check-refuses.png | The "Master check" panel, top-right, with its two red stop marks | "The master check watches every change. Here it stops water entered twice, and an unanswered question." | TrueBatch Capsules: the master check stops errors |
| 4 | 04-designer-formula-clean.png | The formula table, centre, and the green "No problems" note, top-right | "Fixed. Milligrams per capsule are typed; batch quantities are worked out." | TrueBatch Capsules: batch quantities calculated |
| 5 | 05-designer-drug-layering.png | The step "Layer the drug on the sugar spheres", centre: weight-gain, inlet and product temperature limits | "Pellets are built in stages. Drug layering sprays the drug onto sugar spheres, with limits for temperatures and weight gain." | TrueBatch Capsules: drug layering on sugar spheres |
| 6 | 06-designer-curing.png | The step "Cure the enteric-coated pellets (40 °C, at least 2 h)", centre, with its 38 to 42 °C limits | "After the enteric coat, a coat that resists stomach acid, the pellets cure at forty degrees for at least two hours." | TrueBatch Capsules: enteric coat, then curing |
| 7 | 07-designer-sieve-analysis.png | The sieve apertures 1400 to 710 µm, centre | "Sieving removes twins and fines; a sieve analysis checks the size." | TrueBatch Capsules: sieving and pellet size |
| 8 | 08-softgel-master-new.png | Shell type "soft gelatin" and "Wet gel mass (mg per capsule)", centre, and the skeleton "Soft gel, oily solution fill" near the bottom | "Soft gels work the same way, from the soft gel skeleton." | TrueBatch Capsules: soft gel masters too |
| 9 | 09-softgel-designer-encapsulation.png | The step "Encapsulate soft gels with periodic checks", centre: ribbon thickness, wedge temperature, fill and shell weights | "Encapsulation checks ribbons, wedge temperature, seals and fill weights in rounds." | TrueBatch Capsules: encapsulation checks in rounds |
| 10 | 10-library-capsule.png | The search box "capsule" and the results "Fill capsules with periodic checks", bottom-left | "Every step comes from a searchable library, with its checks built in." | TrueBatch Capsules: a library of ready steps |
| 11 | 11-master-review-plain-view.png | The plain-language view of the header and formula, centre, and "Send for review", top-right | "Reviewers read the whole master in plain words." | TrueBatch Capsules: plain-language review |
| 12 | 12-master-approve-change-control.png | The "Change control number" field, centre dialog | "After a second-person check, Asha approves for QA with a change control number." | TrueBatch Capsules: QA approval with change control |
| 13 | 13-master-effective-timeline.png | The timeline of signatures, top-left, and the green "Effective" chip at the top | "Meera makes it effective. Every signature is on the timeline." | TrueBatch Capsules: one effective version |
| 14 | 14-issue-batch.png | The "Issue a batch" dialog, centre: "The batch number is given by the server", and "Next: sign" | "Batches are issued only from the effective master; the server gives the number." | TrueBatch Capsules: issued from the effective master |
| 15 | 15-my-work-operator.png | "Batches in progress" with batch TC260001, centre | "Priya, the operator, finds the batch in My work." | TrueBatch Capsules: My work for each person |
| 16 | 16-batch-screen-stages.png | The stage tabs across the top: drug layering suspension, drug layering, enteric coating, lubrication, filling | "Stages and steps open in order." | TrueBatch Capsules: stages and steps in order |
| 17 | 17-weigh-lot-from-mms.png | The lot DEMO-26-OME-007 and the line "From MMS: … approved, expiry …", left, then the assay and LOD pulled from MMS | "She weighs the omeprazole. Lot status, expiry, assay and moisture come from Medhanta MMS." | TrueBatch Capsules: lot data from MMS |
| 18 | 18-weigh-target-adjusted-for-assay.png | "Target quantity 2.018 kg" and its worked-out line, top-right | "The target is adjusted for the lot's assay, and every sum shows its working." | TrueBatch Capsules: target adjusted for assay |
| 19 | 19-second-person-check-esignature.png | The "Sign: Verified (second person)" dialog, centre | "A second person checks the critical weighing and signs." | TrueBatch Capsules: second-person check, e-signed |
| 20 | 20-drug-layering-round-gain-met.png | "Weight gain 34.1 %, within limits 32.0 to 36.0 %", right, and the temperatures above it | "Each spray round records temperatures and spray rate. Rounds stop when the weight gain is within limits." | TrueBatch Capsules: layering until the gain is met |
| 21 | 21-enteric-coat-out-of-limits.png | The red "Product temperature 36 °C, Out of limits", right, and "Add a deviation note first" in the bottom bar | "In enteric coating, the product temperature goes too high. The step cannot be signed without a note." | TrueBatch Capsules: out of limits is caught |
| 22 | 22-deviation-note.png | The "Deviation note" dialog, centre: what happened and the deviation number DEV-26-0418 | "Priya writes what happened and links the deviation number." | TrueBatch Capsules: deviation note at the step |
| 23 | 23-curing-minimum-time-running.png | The blue "Minimum time … in 2 h 00 min" bar, top, and "Skip wait (demo)", top-right | "Curing runs on the server clock: two hours at least. In this demo the wait is skipped, and recorded." | TrueBatch Capsules: curing time on the server clock |
| 24 | 24-sieving-screens-intact.png | "Screen integrity: intact before and after use", top-right | "Both sieve screens are checked intact before and after use." | TrueBatch Capsules: screens checked before and after |
| 25 | 25-sieve-analysis-results.png | "Sieve analysis 99.8 %, within limits", top-right | "The sieve analysis works out the pellet size." | TrueBatch Capsules: pellet size worked out |
| 26 | 26-lubricant-rescaled-to-actual-pellets.png | "Lubricant for the actual granules 0.099 kg", right | "The talc is rescaled to the actual pellet weight." | TrueBatch Capsules: lubricant for the actual weight |
| 27 | 27-filling-ipc-round-results.png | The "Results" column, right: mean filled-capsule weight 240.2 mg, individual weights, closed length | "While filling, IPC, in-process checks, run every thirty minutes against the master's limits." | TrueBatch Capsules: fill weights every 30 minutes |
| 28 | 28-content-uniformity-typed-from-qc.png | "Content uniformity … AV = 2.0 … PASS", top-right, and the ten results, left | "Content uniformity is worked out from QC's results." | TrueBatch Capsules: content uniformity calculated |
| 29 | 29-reconciliation-capsules-by-weight.png | "Good capsules 98008 capsules", bottom-right, and the net weights, left | "Capsules are counted by weight; yield and accountability are checked." | TrueBatch Capsules: reconciliation by weight |
| 30 | 30-softgel-encapsulation-round.png | The results column, right: ribbon thickness left and right, wedge temperature, within limits | "Meanwhile, the vitamin D3 soft gels are encapsulated, round by round." | TrueBatch Capsules: soft gel encapsulation rounds |
| 31 | 31-softgel-tray-drying-hardness.png | The "Minimum time of Tray drying (2880 min)" bar, top, and "Mean hardness 7.26 N", right | "Tray drying lasts at least two days, until every capsule's hardness is within limits." | TrueBatch Capsules: drying to a hardness |
| 32 | 32-softgel-qa-hold.png | The "Release the hold" button, bottom-left | "After the QA sample, the next step waits until QA releases the hold." | TrueBatch Capsules: QA hold on samples |
| 33 | 33-batch-manufacturing-complete.png | The stage tabs, all "CLOSED", and the red "OPEN DEVIATION" and "NOTE TO DECIDE" boxes, top | "All stages are closed, but an open deviation and a note to decide stay visible." | TrueBatch Capsules: open items stay visible |
| 34 | 34-exception-close-here.png | The "Close the exception here" dialog, centre, with its reason | "Asha closes the small spill note here, with a reason and her signature." | TrueBatch Capsules: decide a note in place |
| 35 | 35-production-approval.png | The "Completeness" list with ticks and stage yields, centre | "Production signs only a complete record. From then on, it is closed to changes." | TrueBatch Capsules: complete before production signs |
| 36 | 36-qc-approval-report-number.png | "QC report number" field and "Sign: QC approved", bottom-right | "Ravi signs QC approval with the report number." | TrueBatch Capsules: QC approval |
| 37 | 37-qa-review-by-exception.png | The counters at the top: corrections, sent back, late, out of limits, open deviations | "QA reviews by exception: only what differs. Counters show corrections, late entries, out-of-limits results and deviations." | TrueBatch Capsules: review by exception |
| 38 | 38-qa-review-out-of-limits-and-notes.png | The "Out of limits" entry, 36 °C, and its note DEV-26-0418, centre | "Each exception shows the reading, the limit and its note." | TrueBatch Capsules: every exception in one place |
| 39 | 39-qa-release-refused-plain-words.png | The red box "Release is not possible yet", bottom-left | "Release is blocked while the deviation is open, and the app says why." | TrueBatch Capsules: release blocked, in plain words |
| 40 | 40-qa-close-deviation.png | The "Close deviation DEV-26-0418" dialog, centre, with its reason | "Asha records the outcome and closes the deviation." | TrueBatch Capsules: QA closes the deviation |
| 41 | 41-batch-released.png | The green "Released" chip, top-right | "She signs the release, which also records her review of the audit trail." | TrueBatch Capsules: released by e-signature |
| 42 | 42-batch-closed-to-changes.png | The three green ticks at the bottom: production approved, QC approved, released, and the signature list above | "Every signature is listed; the record is closed to changes." | TrueBatch Capsules: closed to changes |
| 43 | 43-batch-record-pdf-cover.png | The heading "Batch record TC260001", status "Released", and the formula with lots used, top-left | "A complete PDF copy holds every value, lot and signature." | TrueBatch Capsules: the batch record PDF |
| 44 | 44-my-work-batches-finished-on-floor.png | "Finished on the floor": TC260003 and TC260001 "Released", and TC260002 in progress above, centre | "My work lists batches in progress and finished, with their status." | TrueBatch Capsules: batches and their status |
| 45 | 45-mms-overuse-refused.png | The red message under "Gross weight": "Lot DEMO-26-OME-007 has 1.182 kg available in MMS …", top-left | "For the next batch, the same omeprazole lot has only 1.182 kilograms left in MMS, so the weighing is refused." | TrueBatch Capsules: over-use refused at dispensing |
| 46 | 46-mms-other-lot-accepted.png | Lot DEMO-26-OME-008, left, and "+0.3 %, within limits", right | "Another released lot is taken, with a new target for its assay." | TrueBatch Capsules: another lot, new target |
| 47 | 47-packing-master-new.png | The "New master" dialog, centre: pack PK-OME20-10, bulk FG-OME20, 10 capsules per pack, shelf life 24 months, MRP 65.00 | "Packing has its own record, TrueBatch Capsules Packing. Its master names the pack, bulk product, shelf life and MRP." | TrueBatch Capsules Packing: the packing master |
| 48 | 48-packing-materials-coded.png | The "Printed" and "Coded" ticks in the packing materials table, centre | "Printed and coded materials get their issue and reconciliation steps in one click." | TrueBatch Capsules Packing: printed and coded materials |
| 49 | 49-packing-issue-from-released-bulk.png | Bulk batch TC260001, "Bulk capsules issued 50000" and the yellow "Left to issue" box, centre | "A packing order is issued only from released bulk, read live from TrueBatch Capsules." | TrueBatch Capsules Packing: only released bulk |
| 50 | 50-packing-bulk-received-from-truebatch.png | "Date of manufacture of the bulk" with "From TrueBatch Capsules", left | "The date of manufacture comes with it; the expiry is worked out, never typed." | TrueBatch Capsules Packing: expiry calculated |
| 51 | 51-coding-check-wrong-expiry-caught.png | "Expiry date: Out of limits … DOES NOT MATCH", top-right | "Priya types what the coder printed. A wrong expiry is caught at once." | TrueBatch Capsules Packing: wrong expiry caught |
| 52 | 52-coding-check-matches-record.png | All result lines "matches": batch no., manufacture, expiry and MRP, right | "Corrected: every printed field matches the record." | TrueBatch Capsules Packing: print matches the record |
| 53 | 53-packing-released.png | The green "Released" chip on TCP260001, top-right | "Packing is reconciled, reviewed by exception and released." | TrueBatch Capsules Packing: packed batch released |
| 54 | 54-packing-second-order-left-to-issue.png | The yellow box "Left to issue of TC260001: 48,008 capsules … 50,000 already issued", centre | "A second order can take only what is left of the bulk." | TrueBatch Capsules Packing: only what is left |

**Outro voice-over:** "TrueBatch Capsules: hard capsules, pellets and soft gels, checked as you go, reviewed by exception and released with confidence. Book a demo with Medhanta."  
**Outro caption:** TrueBatch Capsules by Medhanta · Book a demo

## PRONUNCIATION RULES FOR THE VOICE-OVER (apply to every scene; captions keep normal spelling)

1. Speak naturally, at one steady pace (about 130 words a minute). Never slow down, pause or stretch on abbreviations, numbers or brand names.
2. Letter abbreviations are said as quick, joined letters in ONE beat, like a newsreader, never spelled out slowly with gaps: US = "you-ess" (one quick word), EU = "ee-you", UK = "you-kay", FDA = "eff-dee-ay", QA = "cue-ay", QMS = "cue-em-ess", SOP = "ess-oh-pee", OEE = "oh-ee-ee", IQ / OQ / PQ = "eye-cue", "oh-cue", "pee-cue", MIT = "em-eye-tee", DPDP = "dee-pee-dee-pee", AI = "ay-eye", CEO = "see-ee-oh", CFO = "see-eff-oh", IPC = "eye-pee-see", QC = "cue-see", MRP = "em-ar-pee", PDF = "pee-dee-eff", LOD = "ell-oh-dee". Never read the dots in "U.S." or "e.g."; say "you-ess" and "for example".
3. Abbreviations that are said as WORDS: CAPA = "KAP-uh", SHRM = "shurm", Ipca = "IP-kuh".
4. Web addresses and domains: "." is said "dot", and the ending is said as a word: ".in" = "dot in" (rhymes with "pin"), ".com" = "dot com", ".co.in" = "dot co dot in". Never spell an ending letter by letter ("dot i-n" is wrong).
5. Brand and product names (confirm with Medhanta before final recording): Medhanta = "meh-DHAAN-tah", TrueBatch = "TROO-batch", LEAD = "leed", DIVE = "dive", RISE = "rise", TIDE = "tide", ASSURE = "uh-SHOOR", EQUIP = "ee-KWIP", QLIMS = "cue-lims", MMS = "em-em-ess", CLEAR = "clear", Digi = "DIJ-ee" (as in "digital"; "Digi partner" = "DIJ-ee partner", never "DIG-ee"), McKinsey = "muh-KIN-zee", Ranbaxy = "ran-BAK-see", Alexion = "uh-LEK-see-on", Baddi = "BUD-dee".
6. Indian money and numbers, said the Indian way: "₹16 lakh" = "sixteen lakh rupees" (lakh = "laak", rhymes with "rock"), "₹6 crore" = "six crore" (crore = "krore"), "US$4,700" = "forty-seven hundred dollars", "US$10–25 million" = "ten to twenty-five million dollars", "600-batch" = "six-hundred-batch", "60%" = "sixty percent", "2×" = "twice". Never read symbols aloud (₹, $, %, ×, –) as symbol names.
7. Footnote numbers (¹ ² ³) are on screen only. Never say them.
8. If a word could be misread, write it in the voice-over text the way it sounds (for example "DIJ-ee partner", "you-ess", "dot in"), keeping the correct spelling only in the captions.
9. Batch, lot and change-control numbers are read as letters, then the digits in short groups: TC260001 = "tee-cee two-six zero-zero-zero-one", TCP260001 = "tee-cee-pee two-six zero-zero-zero-one", DEV-26-0418 = "dev twenty-six, zero-four-one-eight", CC-2026-0211 = "cee-cee twenty twenty-six, zero-two-one-one". "1,00,000 capsules" = "one lakh capsules"; "1.182 kilograms" = "one point one eight two kilograms"; "D3" = "dee-three"; "Wurster" = "VUR-ster"; "omeprazole" = "oh-MEP-ruh-zole"; "cholecalciferol" = "koh-lee-kal-SIF-er-ol"; "%RH" = "percent humidity".
