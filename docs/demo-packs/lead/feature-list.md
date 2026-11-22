# Medhanta LEAD: feature list

**Medhanta LEAD** (Logbook and Engineering Work Order Management), formerly "Pharma Logbook", is the electronic logbook
for equipment, instruments and rooms in pharma plants (tablets, capsules, injectables), with engineering work orders
built in. It replaces paper logbooks and is built to US FDA 21 CFR 211 / Part 11, EU GMP Annex 11 / Annex 1 and India's
Revised Schedule M. It runs in the browser on PCs and tablets, as one product of the Medhanta platform. Screen numbers
in brackets refer to `screens/`.

## Sign-in, people and permissions (Medhanta platform)
- Sign-in with your own Medhanta login: people, passwords and master data live once in Medhanta core (01).
- Permissions per person, ticked in core (for example raise, do or close work orders; decide missed limits; move or reserve equipment); each person sees only the actions they may do.
- Every e-signature asks for the password again at Medhanta core, in a small window, and shows its meaning (05, 15, 29, 33).
- Log out also ends the core sign-in (shared terminals).
- 15-minute idle logout on the server (no on-screen warning, so not shown).

## Set-up
- Add an item to the logbook straight from Medhanta master data: name, location, make, model, hold times and frequencies are pulled, nothing typed; only Logbook flags (sterile, classified room) and a reason are given (02, 03).
- Products come from master data; batch numbers are picked from linked TrueBatch batch records, or typed when no link is set up (17).
- Logbook settings per activity type: SOP picked from Medhanta ASSURE (QMS), checklist items, second-person verification, training needed to sign, limits; drafted by admin, approved by QA with an e-signature; old versions stay on record (04–06).

## The plant at a glance
- Home dashboard: on-time logbook completion, dues by kind (cleaning, PM, calibration, requalification), plant status graph, items in use (07).
- "Pending activities" banner for everyone at sign-in, with a list of overdue and due items (08).
- Workflow tab: what is waiting for me (entries to verify, breakdowns to release, settings to approve) (42).
- Logbook tiles with live status for every item and room; search by ID, name or location (09).
- Scan box: a barcode scanner (or typing) opens the item with its check before use (10, 11).

## Logbook entries
- One "New entry" with an Activity list: operation (use), cleaning, change over, breakdown, preventive maintenance, calibration, requalification, others (general log), move to another room, and sterile activities.
- Equipment use: product, batch, stage; status goes In use, then Dirty (17, 18).
- Equipment cleaning: type, checklist, performer signature, second-person verification; status goes Clean with a clean-hold limit (13–16).
- Calibration / check: result, certificate, next due date; overdue or failed blocks use (20–22).
- Area (room) cleaning: type, agent, disinfectant lot, checklist (47).
- General equipment log with site checklist (54).
- Change over between products or batches; antibiotic change over rules.
- Requalification from the approved protocol in Medhanta EQUIP (Qualification) or by hand.
- Move equipment to another room (reason and e-signature).
- Reservations: reserve an item for a batch or for dates; shown on the item page (19).
- Voice notes: speak in Hindi, Marathi or English; the text is transcribed and translated, and becomes part of the entry only when the speaker signs it (23).

## Sterile area records (injectables)
- Steriliser test (leak, Bowie-Dick air removal), with an optional approved leak limit (48).
- Sterilisation / decontamination cycle with a unique cycle number per steriliser; cycles made for a TrueBatch Injectables batch are read from the batch record (49).
- Isolator / RABS glove integrity per port, signed by the performer (50).
- Room pressure readings against approved limits; an out-of-limit reading needs a comment and is flagged (51).
- Sterile validity lines on the item page (for example "Steriliser test valid until …") (49).

## Status and blocking
- Live status per item: clean, in use, dirty, clean expired, out of service, calibration or PM overdue (09, 11, 16, 18, 20).
- Use is refused, with the reason, when an item is dirty, clean-expired, out of service or out of calibration (12).
- A breakdown takes the item out of service at once; only QA's release returns it (24, 44).

## Breakdowns
- Report a breakdown: occurred at, reported by, failure category, symptom (typed or by voice) (23, 24).
- "Suggest from history": related past breakdowns of the same machine, make or failure type; an optional language-model layer can be switched on (25).
- Complete the repair: root cause, work done, spare parts with lot or serial, in-house or vendor, post-repair checks (31).
- Second person verifies; QA signs "Released" (43, 44).
- Breakdown register with filters, downtime, MTTR and MTBF per machine, linked work order; PDF and CSV (45).
- Equipment history card: every entry, breakdown, reservation, review and master-data change, with filters, PDF and CSV (46).

## Engineering work orders (new)
- Work order list with number, item, kind, title, status, assignee, raised by, target date and an "Overdue" flag; filter by status, item or overdue only; CSV export (38, 39).
- Raise a work order from a breakdown, from a preventive maintenance or calibration that is due, or by hand; numbered WO-yy-nnnn (26, 35–37).
- Assign to a person from the people list, or give it to someone else until the work is done (26, 27).
- Start the work; record what was done, spare parts (part number, quantity) and time spent (28).
- "Done" is e-signed by the person who did the work ("Performed") (29, 30).
- "Close" is e-signed by a second person ("Closed"); the doer cannot close their own work order (33, 34).
- A breakdown cannot be released to service while its work order is still open (32).
- Every change of a work order is in its audit trail (34).
- Work orders tab on each item, with what is due now and a one-click "Raise a work order" (35, 40).
- Work order PDF copy with details, signatures and audit trail (41).

## Missed limits (exceptions)
- An overdue cleaning, PM, calibration or requalification is recorded once as an exception (52).
- QA closes it here with a reason and e-signature, or sends it to Medhanta DIVE (Deviations & CAPA) (53).

## Data integrity (ALCOA+)
- E-signatures with name, date and time and meaning: Performed, Verified, Released, Approved, Corrected, Closed, Voice note confirmed.
- Server time for every record, shown in plant time (IST).
- Late entries (more than 30 minutes after the activity) need a reason and are flagged (47).
- Corrections make a new version with a reason and a "Corrected" signature; the original stays readable (54, 55).
- Append-only audit trail; daily integrity check of signatures, version chains and audit rows.

## Links with other Medhanta products
- TrueBatch Tablets, TrueBatch Injectables and the other TrueBatch products: batches to pick from, and their machine and room uses counted in the status.
- Medhanta ASSURE (QMS): effective SOPs to pick (04). Medhanta EQUIP: qualification status and protocols. Medhanta TIDE: training records of signers. Medhanta QLIMS: lab instrument uses. Medhanta DIVE: missed limits sent as deviations.
- Read-only report views (status, MTBF and MTTR per machine) for Medhanta RISE (Operations) and the other products.

## Not shown on screen in this video
- Period review screen, batch view and plant-wide audit-trail viewer: present in the code, but not in the current menus.
- Change over, requalification, move to another room, CSV exports, item details editing, the 15-minute idle logout (server only, no visible warning) and the product links (they need the other products running).
