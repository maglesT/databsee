# Medhanta MMS – feature list

Medhanta MMS (Material Management System): GMP material management for one plant, from approved supplier to batch issue and dispatch. It runs on the Medhanta platform and works with TrueBatch (batch records) and Medhanta QLIMS (lab). Shown with the fictional "Medhanta Demo Plant, Unit 2". Items marked *(not on screen)* are described but not shown in the video.

## Sign-in, Home and to-do lists
- Sign in with your own Medhanta login (one sign-on for all Medhanta products); rights are given per person on the platform.
- Home page per role: what is waiting for me (deliveries expected, lots to sample, QC results and QA decisions waiting, retest due, stock to segregate or dispose, issues to confirm, returns, finished goods to receive or release).
- Count tiles on Home and one-click open from any to-do row.
- Home alert to QA and Admin when the integrity check failed or is overdue, and when the audit-trail review is due *(not on screen)*.

## Approved sources and purchasing
- Approved sources: material + manufacturer (site) + supplier, with evaluation / audit reference.
- QA approves a source with an e-signature; QA can suspend a source with a reason (no new orders or receipts).
- Where the Medhanta QMS (Medhanta ASSURE) is linked, its supplier approval decides at order and receipt and this list is read-only *(not on screen)*.
- Purchase orders without prices: supplier, lines of approved sources, quantity, expected date; close or cancel with a reason.
- A delivery date before today is flagged next to the field (display follow-up, 20 Nov 2026).

## Goods receipt and quarantine
- Receive against an open purchase-order line: delivery note, "matches the order" check, receipt checklist (labels, containers, seals, contamination).
- Damage noted with container numbers and a comment; the lot is flagged for QC.
- Several supplier batches in one delivery, each becomes its own in-house lot with a system lot number.
- Dates checked (expired or past-retest goods refused); vendor bill number, date and scan attached.
- Every new lot starts in QUARANTINE in a location that meets its storage condition.
- Container labels (PDF): material, lot, status, container n of N, dates.
- Lots made in TrueBatch API (API, intermediates, recovered solvents) are received by picking them, not typed *(not on screen)*.

## Sampling and QC (with Medhanta QLIMS)
- Where Medhanta QLIMS is linked, sampling is registered in QLIMS; Medhanta MMS shows each sample on the lot page and takes its quantity off stock once, automatically.
- QC picks the certificate of analysis (CoA) from QLIMS: report number, conclusion, test lines and assay / water / LOD figures are filled in; the basis is taken from the test name where it is clear.
- Without QLIMS: QC records sampling (containers, quantity, reference sample, sampler checks) and types the result in Medhanta MMS *(not on screen)*.
- QC signs the result as "Tested"; assay, water and LOD figures are published for the TrueBatch products.

## QA decision
- QA approves (with a retest date not after expiry) or rejects (with a reason) with an e-signature; always a different person from QC.
- A "does not comply" result can only be rejected.
- QA can send a lot back to QC with a reason (e.g. a CoA without an identity test): the lot stays in quarantine and is sampled again.
- QA can block approved stock (e.g. for retest) and approve it again later *(not on screen)*.
- Status chips everywhere: QUARANTINE, APPROVED, REJECTED, BLOCKED, RELEASED, RETURNED, plus "Retest due" and "Expired".

## Warehouse and storage
- Move stock between locations; only locations that meet the storage condition are offered.
- Rejected / expired stock only into segregated locations; printed packaging only into secure locations.
- "To segregate" and "Awaiting disposal" lists on Home.
- Disposal (destroyed or returned to supplier) recorded by Stores, approved by QA with an e-signature; stock goes to zero.
- Stock list with filters by location, material and status; export PDF / CSV.

## One stock figure with TrueBatch
- Medhanta MMS reads live what each linked TrueBatch product used of a lot (TrueBatch Tablets, Tablets Packing, Injectables, Injectables Packing; Capsules, Oral Liquids and API the same way).
- "In stock after TrueBatch use" on the lot page, the lot list and the stock list: stock in MMS less what TrueBatch used, naming the products.
- Each use listed in the lot history with batch and step; units converted exactly (g to kg, mL to L); counted items such as vials and stoppers shown as pieces ("Issued in TrueBatch Injectables").
- A link that is off or not answering is named on the page and nothing of it is taken off.
- Stock count of a lot TrueBatch used is done for the whole lot against that same figure; QA approves the difference before stock changes.
- Published report views for the TrueBatch products: lot facts, test figures and stock after use *(not on screen)*.

## Expiry and retest control
- Retest due within the warning period (setting, default 30 days) shown on Home.
- Expired or retest-due lots are blocked from reservation and issue, checked again at the moment of issue.

## Issue to a batch
- For a TrueBatch batch, TrueBatch's dispensing is the issue: Medhanta MMS refuses a second issue and shows, read-only, what TrueBatch issued (each use counted once).
- For other batches (e.g. a paper batch record): reserve with a FEFO proposal (first expiry, first out); another choice needs a reason.
- A request for more than the free stock is refused ("Only 209.1 kg is free"); so is issuing more than a lot holds or than was reserved.
- Issue per dispensed container, with issue labels (PDF).
- Production confirms each container with three checks (released, quantity per batch record, correctly labelled).
- Returns from production: quantity, condition, label; Stores puts it in a restricted area; QA accepts it back to stock or rejects it.
- Batch view: every lot, container, confirmation and return for a batch number; PDF / CSV.

## Finished goods
- Packing batches QA released in TrueBatch Tablets Packing or TrueBatch Injectables Packing are listed by themselves under "Released in TrueBatch packing".
- Stores receives such a batch as RELEASED, with the shipper count pre-filled from TrueBatch (no second QA release); packs with no shippers are allowed.
- Trace back from a finished batch to its packing material lots and to the raw material lots its bulk batch used.
- Batches on a paper record: Production hands over in Medhanta MMS, Stores receives, QA releases with an e-signature.
- Dispatch with a FEFO proposal: customer, address, invoice / LR reference, date; released batches only.
- "Where did a batch go?" distribution report for recalls, PDF / CSV.

## Records, corrections and data integrity
- Lot page: facts, QLIMS samples, stock by location, ledger (received − sampled − issued + returned ± adjustments − disposed = balance, then TrueBatch use), full history with signatures.
- Batch view also for TrueBatch batches: the batch facts and every lot the batch used, read live.
- Lot history as a true copy (PDF / CSV) with signatures, corrections, TrueBatch use and audit rows; PDF copies carry the Medhanta MMS emblem.
- Corrections of receipt data with a reason: old value kept and shown struck through; QC/QA decision re-opened.
- One insert-only audit trail with old and new values; filter by date, user, action; PDF / CSV export.
- Audit-trail review recorded by QA, with a reminder on Home *(not on screen)*.
- Integrity check: recomputes every e-signature and checks events and balances; run on demand or daily.
- Electronic signatures: password asked again at every signing, printed name, meaning and time, linked to the record version.
- Dates and times in plant time (e.g. 22 Nov 2026, 17:53 IST), the same on screen and in every PDF.
- Daily backup with checksum and a restore check (scripts, outside the screens) *(not on screen)*.

## Master data and settings
- Codes, names, units and status come from the shared Medhanta master data; Medhanta MMS keeps only its own fields (type, storage condition, retest period, secure storage; location conditions, segregated, secure).
- New master items are set up in Medhanta MMS in one step ("Set up").
- Customers, products, site and settings (lot number format, retest warning days) *(settings not on screen)*.
