# Claude Design prompt – Medhanta MMS feature walkthrough

Paste everything below into Claude Design, with the files listed in files-to-attach.md.

---

Create a **calm, step-by-step product tutorial video** for **Medhanta MMS** (Material Management System: GMP material management for pharmaceutical plants, from approved supplier to shipment). Call the product "Medhanta MMS" everywhere.

## Format
- 16:9, **1920×1080**, target length **about 5 minutes** (hard range 3–6 min). Script estimate: 4:57.
- Audience: plant heads, QA, QC, production, warehouse and engineering users and buyers. Plain language, friendly, no jargon.
- Captions **on** for every step (use the caption column; each starts with "Medhanta MMS ·"). Every title card carries "Medhanta MMS".

## How to use the screenshots
- Use the **49 attached real screenshots in file-name order** (01 … 49). They are the real application with fictional demo data. Screens 09 and 44 are printed PDF pages (labels, lot history) shown on a grey background.
- **Do not redraw, restyle, crop away, or alter the UI** in the screenshots. Show each one full-frame, then apply a gentle zoom (max ~1.4×) toward the highlighted element.
- Add a soft highlight (rounded outline or spotlight in #e8500f) on the element named in the Highlight column, and an **animated cursor** that glides to it (and clicks on buttons).
- **Before → after pairs** (04→05, 07→08, 12→13, 14→15, 17→18, 19→20, 22→23, 29→30, 45→46) use a **cross-fade**, so the change looks like the click result.
- Other transitions: short cross-fades or gentle slides. No flashy effects. Hold each screen about 4–7 s (as long as its voice-over line).

## Brand
- **Use the product emblem logo for Medhanta MMS** (attached: `brand/medhanta-mms-logo.png`, rendered from `medhanta-mms-logo.svg`; `medhanta-mms-logo-white.png` on dark backgrounds; mark `medhanta-mms-mark.png`) on the intro card, the end card and as a small corner watermark. The same emblem is in the app header on every screenshot. If the MMS emblem is not attached, use the Medhanta logo (`medhanta-logo.png`, mark `medhanta-mark.png`).
- Primary colour **#e8500f**; gradient **`linear-gradient(90deg,#dd1a10,#f4511e 55%,#f7941d)`** for thin accent bars, title-card underlines and a progress bar; grey **#5f5f5f** for secondary text; background #faf8f6, body text #2b2b2b.
- Font **Inter**.

## Must not
- **No invented numbers** (no savings, percentages, customer counts, ROI), **no testimonials**, no customer logos.
- Do not change any text, number or name visible in the screenshots. All plant, people, supplier, product, lot and batch names are fictional demo data – keep them as they are.
- Other Medhanta products named in the story: **TrueBatch Tablets**, **TrueBatch Tablets Packing**, **TrueBatch Injectables** (batch records) and **Medhanta QLIMS** (lab system). Use these names exactly.

## Structure

1. **Intro title card** (~4 s): Medhanta MMS emblem, "Medhanta MMS", subtitle "Material management – from supplier to shipment". Opening line (voice-over): "Paper logs and spreadsheets cannot prove which material lot went into which batch, who checked it, and when."
2. Opening screens 01–02 (14 s, no extra title card)
3. **Title card – "Medhanta MMS · Approved sources and purchase orders"** (Chapter 1) then screens 03–06 (24 s)
4. **Title card – "Medhanta MMS · Goods receipt into quarantine"** (Chapter 2) then screens 07–10 (24 s)
5. **Title card – "Medhanta MMS · Sampling and QC results from Medhanta QLIMS"** (Chapter 3) then screens 11–13 (20 s)
6. **Title card – "Medhanta MMS · QA decision: approve, reject or send back"** (Chapter 4) then screens 14–20 (38 s)
7. **Title card – "Medhanta MMS · Storage, disposal, stock and expiry"** (Chapter 5) then screens 21–25 (28 s)
8. **Title card – "Medhanta MMS · One stock figure with TrueBatch"** (Chapter 6) then screens 26–30 (30 s)
9. **Title card – "Medhanta MMS · Issue to a batch"** (Chapter 7) then screens 31–37 (40 s)
10. **Title card – "Medhanta MMS · Finished goods: receipt and dispatch"** (Chapter 8) then screens 38–42 (28 s)
11. **Title card – "Medhanta MMS · Records, corrections and data integrity"** (Chapter 9) then screens 43–48 (32 s)
12. **Title card – "Medhanta MMS · Master data from the Medhanta platform"** (Chapter 10) then screens 49–49 (9 s)
13. **Outro** (10 s) and **end card**: Medhanta MMS emblem centred, "Medhanta MMS", "Book a demo".

Title cards: light background (#faf8f6), chapter number small in grey, title in Inter semibold, gradient underline, ~2.5 s each.

## Per-step voice-over and captions

| Screen | Highlight | Voice-over | Caption |
|---|---|---|---|
| (intro card) | – | Paper logs and spreadsheets cannot prove which material lot went into which batch, who checked it, and when. Let's see how Medhanta MMS handles it. | Medhanta MMS · From supplier to shipment |
| 01-sign-in.png | Centre card: the Medhanta MMS emblem and the orange 'Sign in' button | This is Medhanta MMS. We follow one day at Medhanta Demo Plant, Unit 2. Everyone signs in with their own login. | Medhanta MMS · Your own Medhanta login |
| 02-stores-home.png | Count tiles top-left ('15 Waiting for me') and the table 'Deliveries expected this week' (middle) | Rahul from Stores starts on Home: today's deliveries and everything waiting for him. | Medhanta MMS · Home shows today's work |
| **Title card: Medhanta MMS · Approved sources and purchase orders** | – | – | Medhanta MMS · Approved sources and purchase orders |
| 03-sources.png | Row 'RM-105 Sucrose IP – Sahyadri Sugar Refiners' with 'Draft – not approved' and the orange 'Approve' button (middle-right) | Material may only come from approved sources. A second source for coating sucrose is still a draft. | Medhanta MMS · Only approved sources can be ordered |
| 04-source-approve-before.png | Sign dialog 'Sign: Approved' in the centre; 'Sign' button bottom-right of the dialog | Asha, the QA Head, signs electronically – her password again, the legal stand-in for her handwritten signature. | Medhanta MMS · QA signs the approval |
| 05-source-approve-after.png | Green 'Approved' chip and 'Asha Rao · Approved' on the Sahyadri row (middle) | Approved, with her name and the time. | Medhanta MMS · Approved, with name and time |
| 06-po-date-check.png | Red note under 'Expected delivery date': 'Before today … choose today or later' (centre-left) | Neha in Purchase orders only from approved sources, without prices. A past delivery date is caught at once. | Medhanta MMS · Orders from approved sources only |
| **Title card: Medhanta MMS · Goods receipt into quarantine** | – | – | Medhanta MMS · Goods receipt into quarantine |
| 07-receipt-before.png | Boxes 'Batch 1' and 'Batch 2' with 'Put into location' drop-downs (right) | Chlorphenamine maleate API arrives in two supplier batches. Rahul enters dates, containers and quantity. | Medhanta MMS · One delivery, two supplier batches |
| 08-receipt-after.png | Green box 'Received into QUARANTINE' with lots A26-0003 and A26-0004 (top) | Each batch becomes its own lot, straight into quarantine – on hold until QA decides. | Medhanta MMS · Each batch gets its own lot |
| 09-container-labels.png | The black 'QUARANTINE' headers on the three labels | One label per container: material, lot, status and container number. | Medhanta MMS · Container labels, ready to print |
| 10-lot-quarantine.png | Heading 'A26-0003 QUARANTINE' (top-left) and 'Next step: Waiting for sampling' | The lot page always shows the next step. | Medhanta MMS · Every lot shows its next step |
| **Title card: Medhanta MMS · Sampling and QC results from Medhanta QLIMS** | – | – | Medhanta MMS · Sampling and QC results from Medhanta QLIMS |
| 11-sample-from-qlims.png | Section 'Samples in Medhanta QLIMS': 'Taken off stock: 0.075 kg' (top-right) | Kavya in QC registers the sample in Medhanta QLIMS. Medhanta MMS reads it and takes it off stock by itself. | Medhanta MMS · Samples come from QLIMS |
| 12-qc-pick-coa-before.png | Box 'From Medhanta QLIMS: pick the CoA' and the 'Use this CoA' button (top-right) | The lab's certificate of analysis is waiting here. | Medhanta MMS · Pick the CoA, nothing to type |
| 13-qc-pick-coa-after.png | Filled fields: CoA reference, 'Complies', assay 99.7 % on dried basis, test lines (centre) | One click fills the result. Kavya checks it and signs as Tested. | Medhanta MMS · Results filled from the CoA |
| **Title card: Medhanta MMS · QA decision: approve, reject or send back** | – | – | Medhanta MMS · QA decision: approve, reject or send back |
| 14-qa-approve-before.png | Sign dialog 'Sign: Approved' with the new retest date (centre) | Asha approves the lot with a retest date. QA is always a different person from QC. | Medhanta MMS · QA approves with a signature |
| 15-qa-approve-after.png | Green 'APPROVED' chip next to A26-0003 (top-left) | Approved – now the lot can be used. | Medhanta MMS · Approved – ready to use |
| 16-history-signatures.png | History rows 'Sampled … in Medhanta QLIMS', 'QC result', 'QA decision' with signatures (right column) | The history shows every step, person and signature. | Medhanta MMS · Every step, person and signature |
| 17-qa-reject-before.png | Sign dialog 'Sign: Rejected' and the reason text | A cellulose lot failed its microbial test. A failed result can only be rejected. | Medhanta MMS · Failed lots can only be rejected |
| 18-qa-reject-after.png | Red 'REJECTED' chip next to E26-0007 (top-left) | Rejected – it can never be issued. | Medhanta MMS · Rejected – blocked for good |
| 19-send-back-before.png | Box 'Send back to QC: lot E26-0008', the reason and 'Sign as sent back to QC…' (right) | This CoA has no identity test. Instead of rejecting good material, Asha sends it back to QC. | Medhanta MMS · Send back to QC, with reason |
| 20-send-back-after.png | Grey 'QUARANTINE' chip and 'Next step: Waiting for sampling' (middle-left) | It stays in quarantine and is sampled again. | Medhanta MMS · Back in quarantine, sampled again |
| **Title card: Medhanta MMS · Storage, disposal, stock and expiry** | – | – | Medhanta MMS · Storage, disposal, stock and expiry |
| 21-segregate-rejected.png | Yellow note 'can only go into a restricted (segregated) location' and 'WH2-REJ' (right) | Rejected stock can only go to the segregated room – nothing else is offered. | Medhanta MMS · Rejected goods: segregated room only |
| 22-disposal-recorded.png | Yellow box 'Disposal recorded … waiting for QA approval' (bottom half) | Rahul records the destruction. Stock stays until QA signs. | Medhanta MMS · Disposal waits for QA |
| 23-disposal-sign-after.png | 'In stock 0 kg' in the lot facts (middle-left) | Signed: stock goes to zero, the record stays. | Medhanta MMS · Stock to zero, record kept |
| 24-stock-list.png | Records tab 'Stock list': status filter chips and 'Export PDF' / 'Export CSV' (right) | The stock list shows every lot by location and status, ready to export. | Medhanta MMS · Live stock by location and status |
| 25-expired-lot.png | Red 'EXPIRED' chip next to E26-0004 (top-left) | An expired lot is blocked automatically – it cannot be reserved or issued. | Medhanta MMS · Expired stock is blocked |
| **Title card: Medhanta MMS · One stock figure with TrueBatch** | – | – | Medhanta MMS · One stock figure with TrueBatch |
| 26-lot-truebatch-use.png | 'In stock 20.82 kg after TrueBatch use: 24.94 kg in MMS − 4.12 kg used in TrueBatch Tablets' (top-left facts) | Medhanta MMS reads what TrueBatch, the batch record system, dispensed. Stores sees one stock figure. | Medhanta MMS · One stock figure, read live |
| 27-lot-truebatch-lines.png | Bottom rows 'Dispensed in TrueBatch Tablets – Batch CPM4-26-038 / CPM4-26-041' | The history names each chlorphenamine 4 mg batch that used the lot. | Medhanta MMS · Each batch that used the lot |
| 28-vials-issued-injectables.png | Bottom row 'Issued in TrueBatch Injectables – Batch CFX1-26-017' with '−12,150 nos' | Vials for ceftriaxone 1 g injection are counted in pieces from TrueBatch Injectables. | Medhanta MMS · Injectables too: vials counted |
| 29-count-whole-lot.png | Yellow note 'System: 199.5 kg in MMS − 128 kg used in TrueBatch = 71.5 kg' and the difference −0.4 kg | A stock count of coating sucrose is compared with that same figure. A difference needs a reason… | Medhanta MMS · Counted against the real stock |
| 30-count-qa-after.png | 'In stock 71.1 kg after TrueBatch use' (lot facts, middle-left) | …and QA approval. Now stock matches the shelf. | Medhanta MMS · QA approves, stock matches |
| **Title card: Medhanta MMS · Issue to a batch** | – | – | Medhanta MMS · Issue to a batch |
| 31-issue-truebatch-batch.png | Yellow note 'Batch CPM4-26-041 is a TrueBatch Tablets batch…' and the read-only table 'Issued in TrueBatch' (centre) | For a TrueBatch batch, TrueBatch's dispensing is the issue. Medhanta MMS shows it and never issues twice. | Medhanta MMS · TrueBatch batches: no double issue |
| 32-reserve-refused-stock.png | Yellow note 'Only 209.1 kg is free: 190.9 kg short.' (centre) | A paracetamol batch still on a paper record is issued here. Asking for 400 kg is refused: only 209 kg is free. | Medhanta MMS · More than the stock? Refused |
| 33-fefo-proposal.png | FEFO proposal table: E26-0001 then E26-0002, 'Picked: 100 kg of 100 kg' (centre) | For 100 kg, lots are proposed first-expiry, first-out. | Medhanta MMS · FEFO picks the lots |
| 34-issue-refused-more-than-lot.png | Red line 'Only 59.6 kg is reserved and not yet issued.' under the container (centre-left) | Seventy kilograms from a lot holding 59.6? Refused before anything is issued. | Medhanta MMS · Can't issue more than the lot |
| 35-issue-after.png | Green box 'Issued 59.6 kg … in 2 containers' and 'Print issue labels' (centre) | Issued in two containers, each with a label. | Medhanta MMS · Issued, with container labels |
| 36-production-confirm.png | Three ticked boxes 'Released', 'Quantity as per the batch record', 'Correctly labelled' and 'Confirm receipt' | Priya in Production confirms each container with three checks. | Medhanta MMS · Production confirms each container |
| 37-batch-view-mms.png | Records > Batch view: 'Lots used' table with issued, confirmed and returned columns | The batch view shows every lot, container and return. | Medhanta MMS · Whole batch at a glance |
| **Title card: Medhanta MMS · Finished goods: receipt and dispatch** | – | – | Medhanta MMS · Finished goods: receipt and dispatch |
| 38-fg-released-in-truebatch.png | Table 'Released in TrueBatch packing': rows CPM4-26-038-PK and CFX1-26-012-PK with 'Receive' buttons (right) | Batches QA released in TrueBatch packing arrive here by themselves. | Medhanta MMS · Released batches arrive by themselves |
| 39-fg-receive-truebatch.png | Text 'received as RELEASED … no second release' (top) and shippers '48' pre-filled | Rahul checks the 48 shippers and receives the batch as released – no second release. | Medhanta MMS · Receive and check, no retyping |
| 40-fg-traceback.png | Sections 'Packing materials used' and 'Raw materials used' with lot links A26-0001, E26-0002 … | It traces back to every packing and raw material lot. | Medhanta MMS · Traced back to every lot |
| 41-dispatch-fefo.png | Dispatch form: customer, invoice / LR reference and the FEFO batch proposal (centre) | Dispatch follows FEFO, released stock only. | Medhanta MMS · Dispatch released stock, FEFO |
| 42-distribution-report.png | Section 'Where did a batch go?' with batch CPM4-26-038-PK and the customer row | For a recall, one search shows where a batch went. | Medhanta MMS · Where did a batch go? |
| **Title card: Medhanta MMS · Records, corrections and data integrity** | – | – | Medhanta MMS · Records, corrections and data integrity |
| 43-batch-view-truebatch-tablets.png | Heading 'Lots used in TrueBatch Tablets' and its table (centre) | The batch view also lists the lots a TrueBatch batch used, read live. | Medhanta MMS · TrueBatch batches traced too |
| 44-lot-history-pdf.png | Left page: 'Lot history A26-0001'; right page: section 'Dispensed in TrueBatch' | Every lot history prints as a true copy, PDF or CSV. | Medhanta MMS · True copies as PDF or CSV |
| 45-correction-before.png | Supplier batch field 'KE/PVP/2601' and 'Reason for the correction' (centre) | A typing mistake is corrected with a reason… | Medhanta MMS · Corrections always need a reason |
| 46-correction-after.png | History row 'Corrected (old → new)' with the old value struck through (bottom) | …and the old value stays, struck through. | Medhanta MMS · Old value kept, struck through |
| 47-audit-trail.png | Audit trail table and the 'Record review of this period' button (right) | Every action lands in one audit trail, reviewed by QA. | Medhanta MMS · One audit trail, reviewed by QA |
| 48-integrity-check.png | Green box 'Passed … 47 signatures checked' (centre) | The integrity check recomputes every signature and balance. Passed. | Medhanta MMS · Integrity check: passed |
| **Title card: Medhanta MMS · Master data from the Medhanta platform** | – | – | Medhanta MMS · Master data from the Medhanta platform |
| 49-master-materials.png | Note 'Code, name, unit and status come from Medhanta master data' (top) and the materials table | Names, codes and units come from shared Medhanta master data – one home for each record. | Medhanta MMS · Shared master data, one home |
| (end card) | – | One day at the plant: every lot received, tested, approved, stored, issued and shipped, with a signature and a record at each step. Medhanta MMS. Book a demo. | Medhanta MMS · Book a demo |

Voice: calm, warm, unhurried, clear Indian-English or neutral English accent. Light background music, low volume.

demo-script.md (attached) has the same table with per-chapter durations; this prompt is complete on its own.

## PRONUNCIATION RULES FOR THE VOICE-OVER (apply to every scene; captions keep normal spelling)

1. Speak naturally, at one steady pace (about 130 words a minute). Never slow down, pause or stretch on abbreviations, numbers or brand names.
2. Letter abbreviations are said as quick, joined letters in ONE beat, like a newsreader, never spelled out slowly with gaps: US = "you-ess" (one quick word), EU = "ee-you", UK = "you-kay", FDA = "eff-dee-ay", QA = "cue-ay", QMS = "cue-em-ess", SOP = "ess-oh-pee", OEE = "oh-ee-ee", IQ / OQ / PQ = "eye-cue", "oh-cue", "pee-cue", MIT = "em-eye-tee", DPDP = "dee-pee-dee-pee", AI = "ay-eye", CEO = "see-ee-oh", CFO = "see-eff-oh". Never read the dots in "U.S." or "e.g."; say "you-ess" and "for example".
3. Abbreviations that are said as WORDS: CAPA = "KAP-uh", SHRM = "shurm", Ipca = "IP-kuh".
4. Web addresses and domains: "." is said "dot", and the ending is said as a word: ".in" = "dot in" (rhymes with "pin"), ".com" = "dot com", ".co.in" = "dot co dot in". Never spell an ending letter by letter ("dot i-n" is wrong).
5. Brand and product names (confirm with Medhanta before final recording): Medhanta = "meh-DHAAN-tah", MMS = "em-em-ess" (Medhanta MMS = "meh-DHAAN-tah em-em-ess"), TrueBatch = "TROO-batch", QLIMS = "cue-lims", LEAD = "leed", DIVE = "dive", RISE = "rise", TIDE = "tide", ASSURE = "uh-SHOOR", EQUIP = "ee-KWIP", CLEAR = "clear", Digi = "DIJ-ee" (as in "digital"; "Digi partner" = "DIJ-ee partner", never "DIG-ee"), McKinsey = "muh-KIN-zee", Ranbaxy = "ran-BAK-see", Alexion = "uh-LEK-see-on", Baddi = "BUD-dee".
6. Indian money and numbers, said the Indian way: "₹16 lakh" = "sixteen lakh rupees" (lakh = "laak", rhymes with "rock"), "₹6 crore" = "six crore" (crore = "krore"), "US$4,700" = "forty-seven hundred dollars", "US$10–25 million" = "ten to twenty-five million dollars", "600-batch" = "six-hundred-batch", "60%" = "sixty percent", "2×" = "twice". Never read symbols aloud (₹, $, %, ×, –) as symbol names.
7. Footnote numbers (¹ ² ³) are on screen only. Never say them.
8. If a word could be misread, write it in the voice-over text the way it sounds (for example "DIJ-ee partner", "you-ess", "dot in"), keeping the correct spelling only in the captions.
9. In this video also: API = "ay-pee-eye", CoA = "see-oh-ay", FEFO = "FEE-foh", QC = "cue-see", LR = "el-are", PDF = "pee-dee-eff", CSV = "see-ess-vee", IST = "eye-ess-tee", chlorphenamine = "klor-FEN-uh-meen", ceftriaxone = "sef-try-AX-own", "4 mg" = "four milligram", "1 g" = "one gram", "kg" = "kilograms", "nos" = "pieces". Lot and batch numbers such as A26-0003 or CPM4-26-038 are read naturally ("A twenty-six, zero zero zero three"), or left to the caption.
