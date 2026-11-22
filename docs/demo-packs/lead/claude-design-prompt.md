# Claude Design prompt: Medhanta LEAD feature walkthrough

Paste this whole file into Claude Design. Attach the files in the order given in files-to-attach.md.

## The video
- Make a **calm, step-by-step tutorial video** (not an ad) for **Medhanta LEAD** (Logbook and Engineering Work Order Management), formerly "Pharma Logbook": electronic GMP logbooks for equipment, instruments and rooms in pharma plants, with engineering work orders built in.
- Use the name **"Medhanta LEAD"** on every title card, caption and the end card. Never "Pharma Logbook".
- Audience: plant heads, QA, production and engineering users, and buyers. Plain language.
- Format: **16:9, 1920×1080**. Target length **3–6 minutes** (plan ≈ 5 min 44 s).
- Story: one working day at the fictional "Medhanta Demo Plant, Unit 2". All people, products, batch numbers and work-order numbers are fictional demo data.

## How to use the screenshots
- Use the **attached real screenshots (01–55) in numeric order**, one step each, full frame.
- **Do not redraw, restyle, crop away or alter the UI** in the screenshots. Only add overlays on top.
- For each step: a **gentle zoom (about 1.1–1.4×)** towards the highlighted element, a **highlight** (soft rounded rectangle or circle in Medhanta orange #e8500f), and an **animated cursor** that moves to the highlighted element (and "clicks" on buttons).
- Use **cross-fades** between consecutive screens of the same flow, especially before → after pairs: 02→03, 04→05→06, 10→11, 12→13→14, 15→16, 17→18, 20→21→22, 23→24, 26→27, 28→29→30, 33→34, 35→36→37, 38→39, 42→43→44, 52→53, 54→55.
- Screen 41 is a page of the work-order PDF shown on a grey background: zoom gently into the Signatures and Audit trail sections.
- **Captions on**: the short caption for each step in the lower third (white card, Inter, dark text #2b2b2b, thin gradient line above).
- Voice-over: calm, friendly, clear tutorial tone; use the voice-over lines below as written.

## Brand
- **Use the product emblem logo for Medhanta LEAD** (attached: brand/medhanta-lead-logo.png, rendered from medhanta-lead-logo.svg; square mark brand/medhanta-lead-mark.png / .svg; favicon medhanta-lead-favicon-*.png). Use the LEAD emblem on the intro title card, every chapter title card (small) and the end card, and the LEAD mark as a small corner watermark during the walkthrough. Only if the LEAD emblem files are missing, use the Medhanta logo (medhanta-logo.png, medhanta-mark.png) instead.
- Primary orange **#e8500f**; gradient **`linear-gradient(90deg,#dd1a10,#f4511e 55%,#f7941d)`** for thin accent bars, title-card underlines and the progress bar; grey **#5f5f5f** for secondary text; background #faf8f6; body text #2b2b2b.
- Font **Inter** (fallback Segoe UI, system-ui).
- See brand/brand.md for details.

## Rules
- **No invented numbers** (no savings, percentages, customer counts or time savings), **no testimonials**, no claims beyond what the screens show.
- Do not add features that are not on the screenshots. Do not redraw or alter the UI in the screenshots.

## Structure
- **Intro title card:** LEAD emblem · "Medhanta LEAD" · "Logbook and Engineering Work Order Management". Voice-over: "In a pharma plant every machine has a logbook: cleaning, use, calibration, breakdowns, and the engineering work that fixes them. On paper these get missed. Let's spend one day at our demo plant with Medhanta LEAD." Caption: "Medhanta LEAD: logbooks and work orders". (≈ 12 s)
- **Chapter title cards** (2–3 s each, LEAD emblem small, chapter number and name, gradient underline):
  1 · Welcome to Medhanta LEAD (≈ 10 s) · 2 · Set up once (≈ 30 s) · 3 · The plant at a glance (≈ 30 s) · 4 · Clean before use (≈ 30 s) · 5 · Use and reservations (≈ 20 s) · 6 · Calibration (≈ 18 s) · 7 · A breakdown (≈ 24 s) · 8 · Engineering work orders (≈ 78 s) · 9 · Back to service (≈ 28 s) · 10 · Rooms and sterile areas (≈ 28 s) · 11 · Missed limits (≈ 14 s) · 12 · Corrections (≈ 12 s)
- **Outro:** voice-over "Logbooks and engineering work orders in one place: complete, signed and ready for inspection. That's Medhanta LEAD." Caption: "Complete, signed, inspection-ready". (≈ 10 s)
- **End card:** LEAD emblem · "Medhanta LEAD" · "Logbook and Engineering Work Order Management" · button-style "Book a demo".

## Steps (follow demo-script.md attached; the full table is here so this prompt works on its own)

| # | Screenshot | Highlight (element, position) | Voice-over | Caption |
|---|---|---|---|---|
| | **Chapter 1: Welcome to Medhanta LEAD** (≈ 10 s) | title card | | |
| 1 | `01-sign-in.png` | the LEAD logo and the orange "Sign in" button, centre-top. | Everyone signs in with their own Medhanta login. People, passwords and permissions are kept once, on the Medhanta platform. | One Medhanta login for everyone |
| | **Chapter 2: Set up once** (≈ 30 s) | title card | | |
| 2 | `02-add-item-before.png` | the pulled details card (Name, Location, Cleaning, PM) and the Reason field, centre. | The site admin adds the new blister machine from master data. Name, location, hold time and PM frequency are pulled in. Nothing is typed, only a reason. | Add equipment straight from master data |
| 3 | `03-add-item-after.png` | the yellow note "BLIS-01 added to the Logbook" and the BLIS-01 row in the table. | Done. The blender, the press, the rooms and now BLIS-01 all have their own logbook. | BLIS-01 now has its logbook |
| 4 | `04-settings-draft.png` | the SOP picked from ASSURE and the checklist items, centre dialog. | Each kind of entry has settings: the SOP, picked from Medhanta ASSURE, the checklist, and who must verify. The admin drafts a new version. | Settings drafted with SOP and checklist |
| 5 | `05-settings-approve-sign.png` | the "Sign: Approved" dialog and the "Sign" button, bottom-right of the dialog. | QA reviews exactly what will apply and approves it with an electronic signature, which asks for the password again. | QA approves with an e-signature |
| 6 | `06-settings-approved.png` | General equipment log · In force · approved by Priya Nair", centre. | The new version is in force. Older versions stay on record. | In force, old versions kept |
| | **Chapter 3: The plant at a glance** (≈ 30 s) | title card | | |
| 7 | `07-home-dashboard.png` | the Compliance card top-left, then the Dues columns (PM, Calibration) in the middle. | The home page shows how the plant stands: on-time completion, and what is due or overdue. Here the hardness tester's calibration is overdue. | On-time completion and dues |
| 8 | `08-pending-activities.png` | the orange "Pending activities" banner and its list, top. | Anything overdue or due soon is listed for everyone right after sign-in. | Pending activities, right at sign-in |
| 9 | `09-logbooks-tiles.png` | the PRESS-01 tile marked "Dirty" and the HT-01 tile "Calibration overdue". | Every machine and room has a tile with its live status. Green is fit for use. | Live status of every item |
| 10 | `10-scan-id.png` | the "Scan or type ID" box, top-right, with PRESS-01. | On the shop floor, the operator scans the machine's barcode. | Scan the machine ID |
| 11 | `11-press-dirty.png` | the yellow "Dirty: clean and verify before the next use" bar, upper middle. | The tablet press opens with its check before use. It is dirty after yesterday's Ibuprofen batch. | Check before use: dirty |
| | **Chapter 4: Clean before use** (≈ 30 s) | title card | | |
| 12 | `12-use-refused.png` | the red lines "This equipment is not fit for use" in the dialog, lower centre. | If he tries to start the batch anyway, Medhanta LEAD refuses and says why. | Use refused: clean it first |
| 13 | `13-cleaning-form.png` | Product changeover", the three ticked checklist items and "Sign and save", bottom-right. | He records the product changeover cleaning, ticks the SOP checklist and signs. | Changeover cleaning, checklist, signature |
| 14 | `14-cleaning-awaiting-verification.png` | the "Awaiting verification" tag in the Signatures column of the first row. | Cleaning needs a second person, so the press is still not ready. | Waiting for a second person |
| 15 | `15-cleaning-verify-sign.png` | the "Sign: Verified" dialog showing the full entry, centre. | The supervisor sees exactly what he is verifying and signs. | Supervisor verifies and signs |
| 16 | `16-press-clean.png` | the green "Clean until 25 Nov" bar, upper middle. | Now the press is clean, with its clean-hold time shown. | Clean, with its hold time |
| | **Chapter 5: Use and reservations** (≈ 20 s) | title card | | |
| 17 | `17-use-form.png` | Product, Batch number DEMO-26-001 and Stage, centre dialog. | The operator starts the Paracetamol batch on the press. | Start the batch on the press |
| 18 | `18-press-in-use.png` | the blue "In use · Batch DEMO-26-001" bar. | The press is in use for that batch, and will turn dirty when the use ends. | In use for batch DEMO-26-001 |
| 19 | `19-reservation.png` | the "Next reservation" line in the green bar and the reservation row, lower centre. | The supervisor reserves the blender for tomorrow's granulation. Everyone sees it on the machine. | Reserve equipment for a batch |
| | **Chapter 6: Calibration** (≈ 18 s) | title card | | |
| 20 | `20-ht-calibration-overdue.png` | the red "Calibration overdue since 4 Nov" bar. | The hardness tester is out of calibration, so it cannot be used. | Calibration overdue: blocked |
| 21 | `21-calibration-form.png` | Result "Pass", Next due, Certificate reference, centre dialog. | The engineer records the calibration: result, certificate and next due date. | Record result and next due date |
| 22 | `22-ht-calibrated.png` | the green "Available · Calibration due 21 May 2027" bar. | After QA verifies, the tester is available again. | Verified and available again |
| | **Chapter 7: A breakdown** (≈ 24 s) | title card | | |
| 23 | `23-breakdown-voice-note.png` | the yellow "Draft from a voice note (Hindi)" box under Failure / symptom. | Late in the day the blender stops. The operator simply speaks in Hindi. LEAD writes it in English, and it only counts once he signs it. | Report a breakdown by voice |
| 24 | `24-blender-out-of-service.png` | the red "Out of service" bar, top. | The blender is out of service at once, until QA releases it. | Out of service at once |
| 25 | `25-suggest-from-history.png` | the "Related past breakdowns" table in the dialog. | The engineer checks the history: the same overload relay tripped in September. | Learn from past breakdowns |
| | **Chapter 8: Engineering work orders** (≈ 78 s) | title card | | |
| 26 | `26-wo-raise-from-breakdown.png` | the "Raise a work order" dialog: Kind "Breakdown", Title, "Assigned to: Imran Shaikh", Target date. | The supervisor raises a work order straight from the breakdown and assigns it to Imran, the engineer. | Raise a work order from the breakdown |
| 27 | `27-wo-open.png` | the heading "WO-26-0001" and the yellow "Open" chip, centre. | It gets its own number, WO-26-0001, and starts as Open. | WO-26-0001 is open |
| 28 | `28-wo-record-work.png` | What was done", the two spare-part rows and "Time spent", centre. | Imran starts the work. When he is finished, he records what he did, the spare parts with part numbers, and the time spent. | Work done, spare parts and time |
| 29 | `29-wo-done-sign.png` | the "Sign: Performed" dialog, centre. | Done is signed by the person who did the work. | Done": signed by the doer |
| 30 | `30-wo-done.png` | the green "Done" chip and "Performed: Imran Shaikh" in Signatures. | The work order is Done. Imran cannot close it himself. | Done, waiting to be closed |
| 31 | `31-complete-repair-form.png` | Root cause, Work done and the part row with lot / serial, centre dialog. | He also completes the repair in the blender's logbook: root cause, parts and post-repair checks. | Repair recorded in the logbook |
| 32 | `32-release-blocked.png` | the red line "Work order WO-26-0001 of this breakdown is not closed yet", bottom of the dialog. | If QA tries to release the blender now, LEAD stops her: the work order is not closed yet. | No release while the WO is open |
| 33 | `33-wo-close-sign.png` | the "Sign: Closed" dialog, centre. | Neha, the engineering head, checks the work and closes it, with her own signature. | Close": signed by a second person |
| 34 | `34-wo-closed.png` | the "Closed" chip and the two signatures, Performed and Closed. | Two people, two signatures, and every step is in the work order's audit trail. | Closed: two people, two signatures |
| 35 | `35-wo-pm-due.png` | Preventive maintenance due 28 Nov 2026" and its "Raise a work order" button, left. | Work orders are not only for breakdowns. The fluid bed dryer's preventive maintenance is due this week. | PM due: one click to raise |
| 36 | `36-wo-pm-raise.png` | Kind "Preventive maintenance", the filled title, "Assigned to", Target date. | The kind and title are filled in. Neha assigns it and sets a target date. | PM work order, assigned |
| 37 | `37-wo-pm-open.png` | WO-26-0002 · Preventive maintenance of FBD-01" and the "Open" chip. | WO-26-0002 stays open until the work is done. | WO-26-0002 left open |
| 38 | `38-wo-list.png` | the Status column, the Assigned to column and the red "Overdue" chip on WO-26-0003. | The work-order list shows every order with its status, who has it, and what is overdue. | Status, assignee and overdue at a glance |
| 39 | `39-wo-list-overdue.png` | the ticked "Overdue only" box, top, and the single row. | One tick shows only the overdue ones. | Filter: overdue only |
| 40 | `40-equipment-wo-tab.png` | the "Work orders" tab and the WO-26-0001 row, lower centre. | Each machine also has a Work orders tab with its own history. | Each machine's work orders |
| 41 | `41-wo-pdf.png` | the Signatures and Audit trail sections of the PDF. | And every work order prints as a PDF, with its signatures and audit trail. | Work order PDF for the file |
| | **Chapter 9: Back to service** (≈ 28 s) | title card | | |
| 42 | `42-workflow-to-release.png` | Waiting for me" with "BLD-01 · QA release after breakdown", left. | QA's Workflow tab lists what is waiting for her, including the blender. | QA's to-do list |
| 43 | `43-release-sign.png` | the "Sign: Released" dialog, centre. | With the work order closed and the repair verified, QA releases the blender. | QA releases to service |
| 44 | `44-blender-released.png` | the green "Clean" bar and "Breakdown (QA released)". | The blender is back in service. | Back in service |
| 45 | `45-breakdown-register.png` | the WO column (WO-26-0001 Closed) and the downtime column. | The breakdown register shows every breakdown with downtime, cause and the linked work order. | Breakdown register with work orders |
| 46 | `46-history-card.png` | the red-edged breakdown rows with downtime and parts. | The machine's history card keeps the full story, ready for any audit. | The machine's history card |
| | **Chapter 10: Rooms and sterile areas** (≈ 28 s) | title card | | |
| 47 | `47-late-entry-reason.png` | the "Reason for late entry" field, lower dialog. | A room cleaning written up more than half an hour late needs a reason, and is flagged. | Late entries need a reason |
| 48 | `48-steriliser-test-form.png` | Test "Air removal (Bowie-Dick)" and Result "Pass". | In the sterile block, the autoclave's daily air-removal test comes first. | Steriliser test before cycles |
| 49 | `49-autoclave-log.png` | Steriliser test valid until 22 Nov 2026" bar and the cycle row. | Then each sterilisation cycle is logged with its own cycle number. | Each cycle logged and numbered |
| 50 | `50-glove-integrity-form.png` | Glove port, Test method and Result. | Isolator glove tests are recorded port by port. | Glove integrity, port by port |
| 51 | `51-pressure-out-of-limit.png` | OUT OF LIMITS: yes" and the comment in the first row. | A room pressure outside its limits needs a comment and is flagged. | Out-of-limit readings flagged |
| | **Chapter 11: Missed limits** (≈ 14 s) | title card | | |
| 52 | `52-exceptions.png` | the "Missed limits (exceptions)" panel with its two rows. | Every missed limit, like an overdue calibration or PM, becomes an exception for QA. | Missed limits become exceptions |
| 53 | `53-exception-sent.png` | the Decision column: "Closed here …" and "Sent to DIVE …". | QA closes one here with a reason and signature, and sends the other to Medhanta DIVE as a deviation. | Close it, or send to DIVE |
| | **Chapter 12: Corrections without losing the original** (≈ 12 s) | title card | | |
| 54 | `54-correction-form.png` | the corrected Notes and "Reason for correction (required)". | A typing error? Corrections need a reason and a signature. | Correct with a reason |
| 55 | `55-correction-history.png` | Version 1" and "Version 2 · corrected", centre dialog. | The original stays readable. Nothing is ever overwritten. | Original kept, every version |

Note for the editor: the app header in the screenshots shows the Medhanta LEAD mark and name. The sign dialogs say a small window opens for the password: that window belongs to Medhanta core and is not shown.

## PRONUNCIATION RULES FOR THE VOICE-OVER (apply to every scene; captions keep normal spelling)

1. Speak naturally, at one steady pace (about 130 words a minute). Never slow down, pause or stretch on abbreviations, numbers or brand names.
2. Letter abbreviations are said as quick, joined letters in ONE beat, like a newsreader, never spelled out slowly with gaps: US = "you-ess" (one quick word), EU = "ee-you", UK = "you-kay", FDA = "eff-dee-ay", QA = "cue-ay", QMS = "cue-em-ess", SOP = "ess-oh-pee", OEE = "oh-ee-ee", IQ / OQ / PQ = "eye-cue", "oh-cue", "pee-cue", MIT = "em-eye-tee", DPDP = "dee-pee-dee-pee", AI = "ay-eye", CEO = "see-ee-oh", CFO = "see-eff-oh". Never read the dots in "U.S." or "e.g."; say "you-ess" and "for example".
3. Abbreviations that are said as WORDS: CAPA = "KAP-uh", SHRM = "shurm", Ipca = "IP-kuh".
4. Web addresses and domains: "." is said "dot", and the ending is said as a word: ".in" = "dot in" (rhymes with "pin"), ".com" = "dot com", ".co.in" = "dot co dot in". Never spell an ending letter by letter ("dot i-n" is wrong).
5. Brand and product names (confirm with Medhanta before final recording): Medhanta = "meh-DHAAN-tah", LEAD = "leed" (never "led"), DIVE = "dive", RISE = "rise", TIDE = "tide", ASSURE = "uh-SHOOR", EQUIP = "ee-KWIP", QLIMS = "cue-lims", MMS = "em-em-ess", TrueBatch = "TROO-batch", Batchwright = "BATCH-rite", Digi = "DIJ-ee" (as in "digital"; "Digi partner" = "DIJ-ee partner", never "DIG-ee"), McKinsey = "muh-KIN-zee", Ranbaxy = "ran-BAK-see", Alexion = "uh-LEK-see-on", Baddi = "BUD-dee".
6. Indian money and numbers, said the Indian way: "₹16 lakh" = "sixteen lakh rupees" (lakh = "laak", rhymes with "rock"), "₹6 crore" = "six crore" (crore = "krore"), "US$4,700" = "forty-seven hundred dollars", "US$10–25 million" = "ten to twenty-five million dollars", "600-batch" = "six-hundred-batch", "60%" = "sixty percent", "2×" = "twice". Never read symbols aloud (₹, $, %, ×, –) as symbol names.
7. Footnote numbers (¹ ² ³) are on screen only. Never say them.
8. If a word could be misread, write it in the voice-over text the way it sounds (for example "DIJ-ee partner", "you-ess", "dot in"), keeping the correct spelling only in the captions.
