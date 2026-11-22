# TrueBatch Injectables: feature list

TrueBatch Injectables is the electronic batch manufacturing record for sterile injectables, from dispensing to QA
release of filled, closed and inspected units, by Medhanta. It covers every injectable type (liquid vials and ampoules,
freeze-dried vials, sterile powders, prefilled syringes and cartridges, bags and bottles, emulsions, suspensions,
liposomes, blow-fill-seal) and both ways of making a product sterile (terminal sterilisation; sterile filtration and
aseptic filling; or both). TrueBatch Injectables Packing is its packing record, from a released batch of filled units to
the released packed batch. Both run on the Medhanta platform (people, sign-in, permissions and master data come from
Medhanta core). Features marked (on screen) appear in the demo screenshots.

## Sign-in, people and sessions
- Sign-in through Medhanta core; each person sees only the tabs their permissions allow (on screen).
- "My work" home page: steps waiting for your check, timers running, steps to sign again, batches for you (on screen).
- QA-given permissions for sterile work: only an aseptic operator works the steps of an aseptic stage, only a qualified visual inspector signs 100 % inspection.
- Idle logout that only real use of the screen renews; the session ends with the core sign-on and on sign-out at core.
- A person without a TrueBatch Injectables permission is refused at sign-in.
- Every screen of a demo installation carries a DEMO banner; timed waits can be skipped there, and each skip is recorded for QA (on screen).

## Master record (recipe) designer
- New master from a starting master by type and route: bulk solution only; liquid in vials or ampoules (terminally sterilised, or sterile filtered and aseptically filled); bags or bottles; freeze-dried vials; prefilled syringes or cartridges; emulsions, liposomes or nanoparticles; blow-fill-seal ampoules or nebules; sterile powder in vials (on screen).
- Header: product from master data (injection forms only), batch in litres, kg or units, density, nominal fill and fill excess with the expected units worked out, route, what the label claim is per, dispensing rooms (on screen).
- Formula from master-data materials, with potency adjustment (assay on the anhydrous, dried or as-is basis, water or loss on drying) and overage; containers and closures (vials, stoppers, seals) picked from master data (on screen).
- Process: stages (normal, preparation, aseptic, results that come later) with the rooms and machine types each may use, and steps from a block library (on screen).
- Sterile block library, including: weighing, compounding, dissolving, pH adjustment, make-up to volume, bulk tests, washing and depyrogenation, siliconisation of stoppers with its bake cycle (on screen), sterilisation of items against the validated cycle (on screen), filter integrity tests, sterile filtration, sterile filtration at the filler in rounds (on screen), aseptic set-up with the line's media fill, interventions log (on screen), environmental monitoring during filling (on screen), transfer into grade A, liquid fill and powder fill with periodic fill-weight checks (on screen), freeze-dryer loading, freeze-drying cycle with annealing (on screen), stoppering and unloading, sealing and capping checks, sterility and endotoxin samples as a QA hold, terminal sterilisation with lethality per probe (on screen), 100 % visual inspection, AQL inspection, leak and container-closure tests, headspace gas, EM plates and bioburden results later, reconciliation of units.
- Powder fill weight per lot: the fill weight is worked out from that lot's assay and water content, plus the fill excess; the mean and each fill weight are checked against it (on screen).
- Dispensing target per lot: the quantity to weigh is adjusted for the lot's potency and the overage (on screen).
- Environmental monitoring and EM plate limits taken from the fixed clean-air limits table (EU GMP Annex 1 grades A to D, at rest and in operation); a master may set a tighter limit, never a looser one (on screen).
- Sterilisation, siliconisation and freeze-drying cycles checked against the validated recipe: each phase's time and its lowest and highest value (on screen).
- Lethality (F0, or FH for dry heat) worked out from each probe's printout readings, checked against the validated minimum (on screen).
- Master check panel: errors and warnings with links to the exact setting; questions such as the label-claim basis answered in place (on screen).
- Worked examples of every calculation with example values, and a calculation preview with example lot values (on screen).
- Plain-language view of the whole master for review, with the clean-air limits table (on screen).
- Time limits from one step to another, hold times of intermediates with their validated maximum, step options (second-person check, critical step, periodic rounds, repeat until a check passes, QA hold, required training).
- Review and approval: sent for review with an e-signature, checked by a second person (or returned with a reason), approved by QA with a change control number, made effective (by another QA person when the number was typed by hand); one effective version (on screen).

## Batch issue
- A batch is issued only from the effective master, after its master check, with an e-signature; the server gives the next batch number, never reused (on screen).
- Batch overview: stages with their state, alerts, the steps of the stage, production approval and abandon (on screen).

## On the floor (batch execution)
- Step screens for tablets and PCs: instruction, record fields, results worked out by the server, history (on screen).
- Lots, balances and machines picked; lots and their certificate values (assay, water) pulled from Medhanta MMS when linked, typed by hand otherwise (on screen).
- Every entry saved at once with the person and the server time; corrections keep the old value struck through with a reason.
- Done is signed with an e-signature that shows what is signed and its meaning (on screen).
- Second-person check on the checker's own device; the checker cannot be the performer (on screen).
- Filling screen: in an aseptic stage the fill checks, clean-air checks and "Add intervention" sit side by side above every step (on screen).
- Periodic checks on the server timer (fill weight, EM, sealing, tunnel); a missed check needs a deviation note (on screen).
- Steriliser cycle against the recipe, load pattern, indicators and use-by of the sterilised load (on screen).
- Sterile items past their use-by cannot be used; an item that expires during a step needs a deviation note.
- Room grade at least the step's grade; equipment and rooms fit for use (from Medhanta LEAD when linked, status labels otherwise).
- Aseptic stage starts only on a line whose media fill is in date (from Medhanta EQUIP when linked).
- Only trained people sign a step that names a training (from Medhanta TIDE when linked).
- Reconciliation of units at filling and at inspection: yield and accountability against limits (on screen).
- Results that come later (EM plates, bioburden) in a parallel stage that closes before production signs.

## Exceptions
- A value out of limits blocks Done until a deviation note is added; the note can carry a deviation number (on screen).
- A note without a number is decided by QA: closed here with a reason and an e-signature, or sent to Medhanta DIVE (on screen).
- Steps done out of order, late entries and timers that ran over need a reason or a deviation note.

## Material stock (Medhanta MMS)
- A lot is not used beyond what MMS shows available: the request is refused in plain words with the amount left, and another lot is taken (on screen).
- Only released, in-date lots are used.

## Production approval, QC approval, QA review and release
- Production approval: a completeness checklist (every stage closed, yields within limits, timers covered); once signed the record is closed to changes (on screen).
- QC approval with the QC report number and the EM review of the batch (on screen).
- QA review by exception: corrections, sent-back checks, late entries, out-of-limits values, open deviations and values typed by hand counted at the top (on screen).
- Sterility assurance summary: cycles, aseptic set-up, filling, clean air and microbiology, interventions, container closure, inspection and reconciliation (on screen).
- The full record and its audit trail listed for QA, every signature with name, time and meaning (on screen).
- Release blocked in plain words while a deviation is open; QA closes it with a reason (on screen).
- Release or rejection by e-signature; QA can terminate a batch still in production, saying what went back to stores.
- Batch record PDF: the complete record with every value, calculation, signature and change (on screen).

## All batches
- "All batches": newest first, search by batch number, product code or name, status filter, and Batch / Release / PDF links (on screen).
- Closed batches show every stage closed and offer no changes (on screen).

## TrueBatch Injectables Packing
- Packing master per pack: pack product and the filled units it is packed from, units per pack, packs per carton, standard packing batch, shelf life, expiry rule, destination, MRP (on screen).
- Packing materials from master data (vial label, carton, leaflet), printed and batch-coded, with their issue and reconciliation steps added in one click (on screen).
- Same review and approval workflow as the manufacturing master.
- Packing batch issued from a released TrueBatch Injectables batch, pulling what is left of its good units; a part issue is allowed, more is refused (on screen).
- Filled units received on the line: batch, release status and date of manufacture from TrueBatch Injectables; expiry worked out from the shelf life, never typed (on screen).
- Coding check: batch number, date of manufacture, expiry date and MRP as printed, compared with the batch record (on screen).
- On-line inspection, carton and leaflet checks, line clearance before and after packing, one active packing order per line.
- Reconciliation of filled units and printed materials (issued = used + destroyed + returned), destruction of batch-coded leftovers.
- QC approval, QA release and the packing record PDF (on screen); its own All batches list (on screen).

## Data integrity and platform
- Insert-only records and an audit trail the app login cannot change; every signature linked to what was signed.
- Values pulled from other Medhanta products (MMS, LEAD, DIVE, QLIMS, EQUIP, TIDE, ASSURE change control) when linked; typed by hand only while a link is off or down, with a second-person check, and listed for QA (on screen).
- Times in plant time (IST); exact decimals in every calculation.
