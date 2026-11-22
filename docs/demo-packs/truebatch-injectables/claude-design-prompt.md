# Claude Design prompt: TrueBatch Injectables demo video

Paste this whole file into Claude Design. Attach the files in the order given in files-to-attach.md.

## What to make
- A **feature-walkthrough tutorial video** (not an ad) for **TrueBatch Injectables**, the electronic batch manufacturing
  record for sterile injectables by **Medhanta**, with its packing record **TrueBatch Injectables Packing**. Audience:
  plant heads, QA, production, microbiology and engineering users, and buyers in sterile injectable manufacturing.
- **Format:** 16:9, **1920×1080**. **Target length: about 5 min 50 s** (must stay between 3 and 6 minutes).
- **Tone:** calm, clear, step-by-step tutorial, plain language. Short GMP terms are explained in about three words
  (e.g. "F0 – the heat-kill dose", "Annex 1 grade – clean-air class", "EM – environment monitoring", "review by exception
  – QA checks what differs", "MMS – material management").
- **Captions on** for every step (the caption column below, max about 8 words each).
- Use the name **"TrueBatch Injectables"** on every title card and in the captions; **Medhanta** is the maker.

## How to use the screenshots
- The attached screenshots `01-…png` to `57-…png` are **real screens of the product**. Use them **in number order**,
  one per step, full frame.
- **Do not redraw, restyle, crop away or alter the UI in the screenshots.** No fake UI, no changed numbers or names.
  Keep the app's red "DEMO" banner at the top of the screens: it is part of the real product's demo installation.
  Screens 46–47 are pages of the real batch record PDF, shown on a grey background: treat them the same way.
- For each step: a **gentle zoom (Ken Burns, max ~1.3×)** toward the element in the "Highlight" column, a soft
  highlight (rounded rectangle or circle in Medhanta orange #e8500f, 3 px, slight glow), and an **animated cursor**
  that moves to the highlighted element (and "clicks" when it is a button).
- **Before → after pairs** use a **cross-fade** with the cursor click at the change: 19→20→21 (weighing recorded →
  signed → waiting for check), 28→29→30 (out of limits → deviation note → recorded), 31→32 (note without a number →
  closed here), 33→34 (over-use refused → other lot accepted), 42→43→44→45 (release blocked → deviation closed → signed
  → released), 53→54 (coding check entered → signed).
- Hold each screen long enough for its voice-over (about 4–7 s); chapter durations are below. Do not zoom on the
  red master-check panels of screens 11–13 (other products' drafts, still being written), nor on intervention or EM
  plate times (the demo day skipped its waits).

## Brand (Medhanta)
- Primary colour **#e8500f**; gradient **`linear-gradient(90deg,#dd1a10,#f4511e 55%,#f7941d)`** for thin accent bars,
  title-card underlines and the progress bar; grey **#5f5f5f** for secondary text; body text #2b2b2b on #faf8f6.
- Font **Inter** (fallback Segoe UI, system-ui).
- Use the TrueBatch Injectables emblem logo **medhanta-injectables-logo.png** (attached; the Medhanta logo
  medhanta-logo.png is the maker's logo for the end card's small "by Medhanta" line)
  ( on the intro and end card, on white or a very light background). Small mark
  **medhanta-mark.png** as a corner watermark (bottom-right, small, subtle) on screenshot scenes. See brand.md.
- **Title cards:** white/very light background, chapter number and title in Inter semibold, gradient underline, 2–3 s;
  each carries "TrueBatch Injectables" as a small overline.
- **End card:** the TrueBatch Injectables emblem (medhanta-injectables-logo.png) centred, the product
  name "TrueBatch Injectables — electronic batch manufacturing record for sterile injectables, with TrueBatch Injectables
  Packing", "by Medhanta", and a "Book a demo" button-style label; gradient bar at the bottom.

## Rules
- **No invented numbers** (no savings, percentages, customer counts or time claims), **no testimonials**, no customer
  logos. Only what the screens and the voice-over below say.
- All people, products, lot and batch numbers on screen are fictional demo data at the fictional "Medhanta Demo Plant,
  Unit 2"; do not present them as real customers or real batches.
- Medhanta MMS is shown through a stand-in in this demo installation (the app reads it as it reads MMS); do not claim
  a live link to any customer system.

## Chapters (title cards)
0. Intro — "TrueBatch Injectables: the sterile batch record, on screen" (0:10)
1. Sign in and find your work (0:12)
2. Build the master recipe (0:50)
3. The sterile step library: freeze-drying, filtration, F0 (0:20)
4. Second-person check and QA approval (0:17)
5. Issue a batch (0:12)
6. On the floor (0:52)
7. Exceptions (0:30)
8. Stock checked at dispensing (MMS) (0:14)
9. Production approval: closed to changes (0:18)
10. Review by exception and release (0:52)
11. All batches (0:13)
12. Labelling and packing: TrueBatch Injectables Packing (0:42)
Outro and end card (0:10) — total about 5:52.

## Full script: per step screenshot, highlight, voice-over and caption
(The same as the attached demo-script.md; follow it.)

## Intro (≈ 10 s)

**Title card:** "TrueBatch Injectables: the sterile batch record, on screen" · subtitle "From master recipe to
released, packed vials" · TrueBatch Injectables emblem, gradient underline.

**Voice-over:** "Sterile batch records on paper are long, slow to check and easy to get wrong. TrueBatch Injectables
puts the whole record on screen, from recipe to release."

**Caption:** "TrueBatch Injectables: the sterile batch record"

---

## Chapter 1 — Sign in and find your work (≈ 12 s)

**Title card:** "TrueBatch Injectables · 1 · Sign in and find your work"

| # | Screenshot | Highlight | Voice-over | Caption |
|---|---|---|---|---|
| 1 | 01-sign-in.png | Centre-left orange "Sign in" button under "TrueBatch Injectables" | "Everyone signs in through Medhanta with their own account." | TrueBatch Injectables: personal sign-in |
| 2 | 02-my-work-operator.png | Centre "Batches in progress" row "TI260019 · Ceftriaxone 1 g powder for injection" and its "Open" link (right) | "My work shows each person only their own tasks. Rahul starts at dispensing." | My work: only your tasks |

---

## Chapter 2 — The master recipe for a sterile powder (≈ 50 s)

**Title card:** "TrueBatch Injectables · 2 · Build the master recipe"

| # | Screenshot | Highlight | Voice-over | Caption |
|---|---|---|---|---|
| 3 | 03-designer-new-master.png | Centre dialog: "Route: Sterile filtration and aseptic processing" (top) and the selected radio "Starting master: Sterile powder in vials, aseptic powder filling" (lower middle) | "Kavya starts a new master for ceftriaxone, one gram powder for injection. She picks the route and a ready-made starting master for sterile powder in vials." | Start from a sterile powder template |
| 4 | 04-designer-master-check.png | Right "Master check" panel with its red items; left column of stages (Sterile dispensing, Containers and closures, Aseptic filling, Results later, Inspection) | "The stages are ready. The master check on the right lists every setting still missing." | Master check: nothing left out |
| 5 | 05-designer-formula-potency.png | Centre "Formula" row RM-CFX01 and its "Adjustment" text "assay (anhydrous), overage 3.0 %" (right of the row); below, "Containers and closures" PM-V10, PM-S20, PM-F20 | "The formula takes the sterile ceftriaxone from master data, adjusted for each lot's potency – its active strength – plus a small overage." | Formula adjusted for potency |
| 6 | 06-designer-powder-fill-weight.png | Centre-right worked example: the line "Fill weight for this lot … 92.4 % × (100 − 9.6 %) … = 1.2331 g", then the green "pass" chips below | "The powder fill weight is worked out for each lot, from its assay and water content. Here, one point two three grams per vial." | Fill weight from the lot's assay and water |
| 7 | 07-designer-dispensing-preview.png | Centre table "Dispensing quantities for 20,000 units": "To dispense 24.662 kg" and the "Worked out" text; top-left example lot values Assay 92.4, Water 9.6 | "The calculation preview shows how much to weigh for an example lot, before any batch is made." | Preview the quantities per lot |
| 8 | 08-designer-clean-air-table.png | Centre table "Clean-air limits": rows A, B, C, D and the particle columns at the right | "EM – environment monitoring – limits come from one fixed table of Annex 1 grades, the clean-air classes. A master may only set tighter limits." | Limits from the clean-air table |
| 9 | 09-designer-steriliser-settings.png | Centre settings column: "Phases in the recipe 4" and the checks "the time at sterilising temperature must be within … 35 min" | "For the stopper autoclave, the master holds the validated cycle: four phases, the exposure time and the lowest temperature." | Steriliser cycle in the master |
| 10 | 10-designer-siliconise-stoppers.png | Centre column title "Siliconise containers or stoppers (emulsion and bake)" and the step "6. Siliconise the stoppers" (left, highlighted) | "Siliconisation – a thin silicone coat on the stoppers – gets its own step, with the emulsion strength and the bake cycle." | Siliconise the stoppers |

---

## Chapter 3 — Sterile steps for other products: freeze-drying, filtration, F0 (≈ 20 s)

**Title card:** "TrueBatch Injectables · 3 · The sterile step library"

| # | Screenshot | Highlight | Voice-over | Caption |
|---|---|---|---|---|
| 11 | 11-library-lyo-annealing.png | Centre-right green results "Annealing shelf temperature −12 °C … pass" and "Cycle against the recipe … all 5 phases within the recipe" | "The same library covers other products. For a freeze-dried vial, lyophilisation – freeze-drying – is checked phase by phase, annealing included." | Freeze-drying with annealing |
| 12 | 12-library-inline-filtration.png | Centre "Sterile filtration at the filler (rounds)" title and the green "Pressure difference … pass" result | "Sterile filtration at the filler is checked in rounds: pressure difference and flow." | In-line filtration, in rounds |
| 13 | 13-library-f0-lethality.png | Centre-left green result "Lethality of the lowest probe … Probe 1 20.1 F-min … pass" | "For terminal sterilisation, F-zero – the heat-kill dose – is worked out from each probe's readings and checked against the minimum." | F0: the heat-kill dose, checked |

---

## Chapter 4 — Check and approval (≈ 17 s)

**Title card:** "TrueBatch Injectables · 4 · Second-person check and QA approval"

| # | Screenshot | Highlight | Voice-over | Caption |
|---|---|---|---|---|
| 14 | 14-approval-second-person-check.png | Top-left timeline "Sent for review · Kavya Reddy" and "Checked (passed) · Vikram Shah" | "Kavya signs and sends it for review. Vikram checks it as the second person." | Checked by a second person |
| 15 | 15-approval-qa-esignature.png | Centre dialog "Sign: Approved" with "Change control number: CC-2026-118" | "Asha from QA approves under a change control, with her e-signature – the legal equal of a handwritten one." | QA approves with an e-signature |
| 16 | 16-approval-effective.png | Top-left status chip "Effective" and the timeline line "Made effective · Meera Iyer" | "Another QA person makes it effective. Only one version is ever in use." | One effective version |

---

## Chapter 5 — Issue the batch (≈ 12 s)

**Title card:** "TrueBatch Injectables · 5 · Issue a batch"

| # | Screenshot | Highlight | Voice-over | Caption |
|---|---|---|---|---|
| 17 | 17-issue-batch-dialog.png | Centre dialog "Issue a batch" text "version 1: 20,000 units" and the orange "Next: sign" button | "Vikram issues a batch from the effective master. The server gives the number." | Issued only from the effective master |
| 18 | 18-issue-batch-TI260019.png | Top-left batch number "TI260019" and the row of stage tiles | "Batch TI260019 is ready, stage by stage." | Batch TI260019, stage by stage |

---

## Chapter 6 — On the floor: dispensing, sterilisation and aseptic filling (≈ 52 s)

**Title card:** "TrueBatch Injectables · 6 · On the floor"

| # | Screenshot | Highlight | Voice-over | Caption |
|---|---|---|---|---|
| 19 | 19-floor-weigh-before.png | Right "Results" panel: "Target quantity 24.662 kg" and "Net against target +0.1 %"; left "Lot CFX-S-2611" with "From MMS" | "Rahul picks the lot. Its assay and water come from MMS, so the target is adjusted for this lot." | Target adjusted for this lot |
| 20 | 20-floor-weigh-esignature.png | Centre dialog "Sign: Performed" with the list of recorded values and the orange "Sign" button | "He signs. The screen shows exactly what he is signing." | Sign what you see |
| 21 | 21-floor-weigh-after.png | Top status chip "Waiting for check" and the table "What was recorded" | "The step now waits for a second person." | Waiting for a second person |
| 22 | 22-floor-waiting-for-check.png | Centre "Waiting for your check" list with its "Check →" links (right) | "Imran sees it on his own device and checks it." | Checks on the checker's own device |
| 23 | 23-floor-steriliser-cycle.png | Right results: "Cycle against the recipe … 81 min" (green, lower right) and "Lowest probe temperature 121.4 °C" | "The stopper autoclave cycle is checked against the validated recipe, phase by phase." | Cycle checked against the recipe |
| 24 | 24-floor-filling-panel.png | Middle "Aseptic filling" panel: "Fill checks", "Clean-air checks" and the orange "Add intervention" button | "In the aseptic stage, fill checks, clean-air checks and interventions sit side by side." | The filling screen |
| 25 | 25-floor-powder-fill-round.png | Right result "Fill weight for this lot 1.2331 g" and "Mean against the fill weight −0.1 % … within limits" | "Every thirty minutes Priya weighs five vials against this lot's fill weight." | Fill weight checked every round |
| 26 | 26-floor-em-round.png | Right results "Particles ≥ 0.5 µm against the clean-air table: 410 particles/m³ … limit not more than 3520" | "Particle counts are checked against the grade A limit from the clean-air table." | EM: grade A limits applied |
| 27 | 27-floor-intervention.png | Left record "Stopper bowl jam cleared with sterile forceps" and "On the master's list of validated interventions: yes" | "An intervention is logged: what, who, and that it is on the validated list." | Interventions logged |

---

## Chapter 7 — Exceptions: nothing slips through (≈ 30 s)

**Title card:** "TrueBatch Injectables · 7 · Exceptions"

| # | Screenshot | Highlight | Voice-over | Caption |
|---|---|---|---|---|
| 28 | 28-exception-out-of-limits-before.png | Right red result "Mean against the fill weight … −2.6 % … OUT OF LIMITS" and the greyed "Done" button with "Add deviation note" (bottom right) | "In round two the mean fill weight is two point six percent low. Done is blocked." | Out of limits: Done is blocked |
| 29 | 29-exception-deviation-note.png | Centre dialog "Deviation note": "What happened" text and "DEV-26-0412" | "Priya writes what happened and links deviation DEV-26-0412." | A deviation note with its number |
| 30 | 30-exception-out-of-limits-after.png | Top red banner "OPEN DEVIATION DEV-26-0412 … Round 2 mean fill weight 2.6 % low" | "The note is on the record, for QA to close before release." | Recorded for QA |
| 31 | 31-exception-note-without-number.png | Lower centre "Deviation notes without a number": "RTP port door alarm sounded once…" and the "Close here…" button | "A smaller event, a door alarm, was noted without a number. QA decides it." | QA decides small events |
| 32 | 32-exception-closed-here.png | The same section: "Exception closed here by Asha Rao … no impact on the batch" | "Asha closes it here, with her reason and her signature." | Closed with a reason and signature |

---

## Chapter 8 — MMS stock: no over-use (≈ 14 s)

**Title card:** "TrueBatch Injectables · 8 · Stock checked at dispensing"

| # | Screenshot | Highlight | Voice-over | Caption |
|---|---|---|---|---|
| 33 | 33-mms-overuse-refused.png | Centre red text under "Tare weight": "Lot CFX-S-2611 has 17.81 kg available in MMS … Take at most 17.81 kg, or another lot." | "On the next batch, TI260020, Rahul tries the same lot. MMS – material management – shows only 17.81 kilos left, so it is refused." | Over-use refused at dispensing |
| 34 | 34-mms-other-lot.png | Left "Lot CFX-S-2612" and right "Target quantity 25.045 kg", "Net against target 0.0 %" | "He takes the next lot. The target is worked out again for its own potency." | Next lot, new target |

---

## Chapter 9 — Production approval: closed to changes (≈ 18 s)

**Title card:** "TrueBatch Injectables · 9 · Production approval"

| # | Screenshot | Highlight | Voice-over | Caption |
|---|---|---|---|---|
| 35 | 35-floor-unit-reconciliation.png | Right results "Unit yield 99.8 %" and "Accountability 100.0 %" | "After inspection every vial is accounted for: good, rejected and sampled." | Every vial accounted for |
| 36 | 36-production-approved-closed.png | Blue notice "Production approval signed. The record is now closed to changes." and the completeness ticks below | "Sanjay checks that the record is complete and signs. The record is now closed to changes." | Closed to changes |
| 37 | 37-closed-batch.png | Top stage tiles, each "✓ CLOSED", and the status "Released" (top right) | "Closed batches show every stage closed. Nothing can be edited any more." | Every stage closed |

---

## Chapter 10 — QC, review by exception and release (≈ 52 s)

**Title card:** "TrueBatch Injectables · 10 · Review by exception and release"

| # | Screenshot | Highlight | Voice-over | Caption |
|---|---|---|---|---|
| 38 | 38-qc-approval.png | Bottom-left "QC report number QC-26-0519", the "EM review of the batch" field and the orange "Sign: QC approved" button | "Lakshmi from QC – quality control – signs with the QC report number and her EM review." | QC signs with its report |
| 39 | 39-qa-review-by-exception.png | Top tiles: "Corrections 0", "Out of limits 1", "Open deviations 1", "Typed by hand 20" | "Review by exception: QA sees at once what differs from normal." | Review by exception |
| 40 | 40-qa-sterility-assurance.png | Centre "Clean air and microbiology" heading and its EM rounds | "The sterility assurance summary gathers cycles, clean air, interventions and inspection in one place." | Sterility evidence in one place |
| 41 | 41-qa-exceptions.png | Centre "Out of limits" item "round 2 … OUT OF LIMITS" and "Deviation notes" DEV-26-0412 | "Every exception is listed with its deviation note." | Each exception, with its note |
| 42 | 42-qa-release-blocked.png | Red note "Release is not possible yet: Deviation DEV-26-0412 … is open: close it first." | "Release is refused in plain words while a deviation is open." | Release blocked while open |
| 43 | 43-qa-close-deviation.png | Centre dialog "Close deviation DEV-26-0412" and its reason | "Asha closes it with the outcome of the investigation." | Deviation closed with a reason |
| 44 | 44-qa-release-esignature.png | Centre dialog "Sign: Released" and the line about the audit trail review | "Her release signature also records her review of the audit trail." | Release by e-signature |
| 45 | 45-qa-released.png | Top-right status chip "Released" | "Batch TI260019 is released." | Released |
| 46 | 46-pdf-batch-record.png | Top of the PDF "Batch record TI260019" and "Status Released" | "The batch record PDF is a complete copy, with every value and signature." | The complete batch record PDF |
| 47 | 47-pdf-fill-weight-page.png | Middle column "Fill weight for this lot: 1.2331 g" and the red "OUT OF LIMITS" of round 2 | "Calculations, exceptions and skipped waits are all printed." | Nothing hidden in the PDF |

---

## Chapter 11 — All batches (≈ 13 s)

**Title card:** "TrueBatch Injectables · 11 · All batches"

| # | Screenshot | Highlight | Voice-over | Caption |
|---|---|---|---|---|
| 48 | 48-all-batches.png | List rows TI260021, TI260020, TI260019 with "In production" / "Released" chips and the "Batch · Release · PDF" links (right) | "All batches lists every batch, newest first, with links to the batch, its release and its PDF." | All batches: Batch, Release, PDF |
| 49 | 49-all-batches-filter.png | Top status filter set to "In production" | "Filter by status, or search by number or product." | Filter and search |

---

## Chapter 12 — TrueBatch Injectables Packing (≈ 42 s)

**Title card:** "TrueBatch Injectables · 12 · Labelling and packing"

| # | Screenshot | Highlight | Voice-over | Caption |
|---|---|---|---|---|
| 50 | 50-packing-new-master.png | Centre dialog fields "Units per pack 1", "Approved shelf life (months) 24", "MRP per pack (Rs) 95.00" | "TrueBatch Injectables Packing has its own master: one vial per carton, shelf life and MRP – maximum retail price." | Packing master: pack, shelf life, MRP |
| 51 | 51-packing-materials.png | Centre table: Vial label, Carton, Leaflet with their "Printed" and "Coded" ticks | "Labels, cartons and leaflets come from master data; the printed ones carry the batch coding." | Printed materials, batch-coded |
| 52 | 52-packing-issue-from-released.png | Centre dialog: "Batch no. of the filled units TI260019" and the yellow text "Left to issue of TI260019: 19,761 units" | "Packing order TIP260006 is issued from released batch TI260019. The units left come from TrueBatch Injectables." | Packed only from released batches |
| 53 | 53-packing-coding-check-before.png | Left record: "TI260019", "11/2026", "10/2028", "Rs. 95.00"; right green results "Batch no.", "Date of manufacture", "Expiry date", "MRP" | "At the coding check Ravi types what is printed: batch number, Mfg and Exp dates and MRP. Each is compared with the batch record." | Coding check: batch, Mfg, Exp, MRP |
| 54 | 54-packing-coding-check-after.png | Top status chip "Done" and the four green "Within limits" results | "All four match, and the check is signed." | All four match |
| 55 | 55-packing-released.png | Lower panel "QA release": "The batch is released." with production, QC and QA lines | "After reconciliation, QC and QA release the packing order." | Packing order released |
| 56 | 56-packing-TIP260007-receive.png | Right results "Expiry date 10/2028" and "Theoretical packs 9761 packs"; left "From TrueBatch Injectables … manufactured 22 Nov 2026" | "The second order, TIP260007, takes the rest. The expiry is worked out, never typed." | Expiry worked out, never typed |
| 57 | 57-packing-all-batches.png | List rows TIP260007 "In production" and TIP260006 "Released" with their links | "Packing has its own All batches list too." | Packing: all batches |

---

## Outro (≈ 10 s)

**Voice-over:** "TrueBatch Injectables: the sterile batch record, checked as you go, reviewed by exception, released
with confidence. Book a demo with Medhanta."

**Caption:** "TrueBatch Injectables by Medhanta · Book a demo"

**End card:** the TrueBatch Injectables emblem (medhanta-injectables-logo.png) centred · "TrueBatch
Injectables — electronic batch manufacturing record for sterile injectables, with TrueBatch Injectables Packing" ·
"by Medhanta" · "Book a demo" · gradient bar at the bottom.

---

## GMP words used (about three words each)

| Term | Said as |
|---|---|
| F0 | heat-kill dose |
| Annex 1 grade (A–D) | clean-air class |
| EM | environment monitoring |
| Lyophilisation | freeze-drying |
| Annealing | warm hold while freezing |
| Siliconisation | silicone-coated stoppers |
| Potency | active strength of a lot |
| Assay | measured active content |
| RABS | barrier-protected filling line |
| Deviation | recorded departure from plan |
| Review by exception | QA checks what differs |
| E-signature | legal electronic signature |
| QC / QA | quality lab / quality approval |
| MMS | material management (stock) |
| MRP | maximum retail price |
| Mfg / Exp | made on / expires on |


## PRONUNCIATION RULES FOR THE VOICE-OVER (apply to every scene; captions keep normal spelling)


1. Speak naturally, at one steady pace (about 130 words a minute). Never slow down, pause or stretch on abbreviations, numbers or brand names.
2. Letter abbreviations are said as quick, joined letters in ONE beat, like a newsreader, never spelled out slowly with gaps: US = "you-ess" (one quick word), EU = "ee-you", UK = "you-kay", FDA = "eff-dee-ay", QA = "cue-ay", QMS = "cue-em-ess", SOP = "ess-oh-pee", OEE = "oh-ee-ee", IQ / OQ / PQ = "eye-cue", "oh-cue", "pee-cue", MIT = "em-eye-tee", DPDP = "dee-pee-dee-pee", AI = "ay-eye", CEO = "see-ee-oh", CFO = "see-eff-oh". Never read the dots in "U.S." or "e.g."; say "you-ess" and "for example".
3. Abbreviations that are said as WORDS: CAPA = "KAP-uh", SHRM = "shurm", Ipca = "IP-kuh".
4. Web addresses and domains: "." is said "dot", and the ending is said as a word: ".in" = "dot in" (rhymes with "pin"), ".com" = "dot com", ".co.in" = "dot co dot in". Never spell an ending letter by letter ("dot i-n" is wrong).
5. Brand and product names (confirm with Medhanta before final recording): Medhanta = "meh-DHAAN-tah", TrueBatch = "TROO-batch", LEAD = "leed", DIVE = "dive", RISE = "rise", TIDE = "tide", ASSURE = "uh-SHOOR", EQUIP = "ee-KWIP", QLIMS = "cue-lims", MMS = "em-em-ess", CLEAR = "clear", Digi = "DIJ-ee" (as in "digital"; "Digi partner" = "DIJ-ee partner", never "DIG-ee"), McKinsey = "muh-KIN-zee", Ranbaxy = "ran-BAK-see", Alexion = "uh-LEK-see-on", Baddi = "BUD-dee".
6. Indian money and numbers, said the Indian way: "₹16 lakh" = "sixteen lakh rupees" (lakh = "laak", rhymes with "rock"), "₹6 crore" = "six crore" (crore = "krore"), "US$4,700" = "forty-seven hundred dollars", "US$10–25 million" = "ten to twenty-five million dollars", "600-batch" = "six-hundred-batch", "60%" = "sixty percent", "2×" = "twice". Never read symbols aloud (₹, $, %, ×, –) as symbol names.
7. Footnote numbers (¹ ² ³) are on screen only. Never say them.
8. If a word could be misread, write it in the voice-over text the way it sounds (for example "DIJ-ee partner", "you-ess", "dot in"), keeping the correct spelling only in the captions.
9. Batch, lot and change-control numbers are read as letters, then the digits in short groups: TI260019 = "tee-eye two-six zero-zero-one-nine", TIP260006 = "tee-eye-pee two-six zero-zero-zero-six", DEV-26-0412 = "dev twenty-six, zero-four-one-two", CC-2026-118 = "cee-cee twenty twenty-six, one-one-eight", CFX-S-2611 = "see-eff-ex ess twenty-six eleven". "20,000 units" = "twenty thousand units"; "%RH" = "percent humidity"; "µm" = "micron"; "°C" = "degrees".
10. Product and technical words: ceftriaxone = "sef-try-AX-own", pantoprazole = "pan-TOE-pra-zole", ondansetron = "on-DAN-seh-tron", lyophilisation = "lie-off-ill-eye-ZAY-shun", F0 = "eff-zero", EM = "ee-em", RABS = "rabs", QC = "cue-see", MRP = "em-ar-pee", Annex 1 = "annex one", AQL = "ay-cue-ell", IST = "eye-ess-tee", Mfg = "manufacturing date", Exp = "expiry date".
