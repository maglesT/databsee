# TrueBatch Oral Liquids: feature list

TrueBatch Oral Liquids is the electronic batch manufacturing record for non-sterile oral liquids (oral solutions, syrups,
elixirs, drops, suspensions, emulsions and dry syrups), from dispensing to QA release of the bulk, by Medhanta.
TrueBatch Oral Liquids Packing is its filling and packing record (filling, capping, labelling, cartoning), from a
released bulk batch to the released packed batch. Both run on the Medhanta platform: people, sign-in, permissions and
master data come from Medhanta core. Features marked (on screen) appear in the demo screenshots.

## Sign-in, people and sessions
- Sign-in through Medhanta core with a personal account; each person sees only the tabs their permissions allow (on screen).
- "My work" home page: steps waiting for your check, timers exceeded, steps to sign again, batches for you, batches in progress and batches finished on the floor (on screen).
- Idle logout after 15 minutes that only real use of the screen renews; the session ends with the core sign-on.
- A person without a TrueBatch Oral Liquids permission is refused at sign-in.
- A demo installation shows a DEMO banner on every screen; timed waits can be skipped there, and every skip is recorded for QA (on screen).

## Master record (recipe) designer
- New master from a process skeleton: syrup, oral solution or elixir; oral drops; oral suspension; oral emulsion; dry syrup, blended; dry syrup, granulated; or a copy of another master scaled to the new batch size (on screen).
- Header: product from master data (oral liquid forms only), batch in litres or kg, density at a stated temperature, label claim per mL, per dose volume, per drop or per container, prescription or OTC, dispensing rooms (on screen).
- Formula in mg per mL (or mg per g of a dry syrup powder), with batch quantities worked out and the vehicle "q.s." to volume (on screen).
- Potency adjustments: assay on its basis, water or loss on drying, salt factor, overage; content of a solution-form material.
- Process: stages (normal and preparation stages such as the vehicle, sugar syrup or oil and water phases) with their rooms, and steps from a block library (on screen).
- Liquids block library: collect purified water, mix until dissolved, make the sugar syrup, hydrate the suspending agent, adjust the pH in rounds, make up to final weight (volume × density) or to final volume, filter or sieve, prepare a phase, homogenise or mill, particle or droplet size, bulk test (QA hold), correct the bulk concentration, transfer to the holding tank (stirred), bulk yield by volume or by weight, room conditions, device assembly (on screen).
- Limits per step for mixing time, speed, temperature, pH, density, viscosity, assay, preservative content, alcohol content, particle size and yield (on screen).
- Master check panel: errors and "it depends" questions with links to the exact setting; an unanswered question blocks sending for review (on screen).
- Calculation checks while the master is built: clear maths errors are refused (double-counted water, wrong salt factor, a batch quantity that disagrees with mg per mL × batch size, and more).
- Worked examples of every calculation with example values, and a calculation preview (on screen).
- Plain-language view of the whole master for review, with comments (on screen).
- Review and approval: sent for review with an e-signature, checked by a second person, approved by QA with a change control number, made effective by QA; one effective version at a time; a timeline of who did what (on screen).

## Batch issue
- A batch is issued only from the effective master, with an e-signature; the server gives the next batch number, never reused (on screen).
- Batch screen: stages with their state, alerts, notes to decide, the steps of each stage, production approval and the batch record PDF (on screen).

## On the floor (batch execution)
- Step screens: instruction, limits, record fields, results worked out by the server, rounds, history (on screen).
- Lots, balances and vessels picked from master data; lot status, expiry, retest date and certificate assay and LOD pulled from Medhanta MMS when linked, typed by hand otherwise (on screen).
- Dispensing target from the master, adjusted by the lot's assay and LOD; net weight checked against the tolerance (on screen).
- Over-use refused at dispensing: a lot cannot give more than MMS has in stock less what TrueBatch has already used of it (on screen).
- Every entry saved at once with the person and the server time; late entries need a reason; corrections keep the old value with a reason and mark steps that used it "input changed" to sign again.
- Done is signed with an e-signature that shows what is signed and its meaning (on screen).
- Second-person check on the checker's own device; the performer can never check their own step (on screen).
- Steps in order; repeat-until steps (pH adjustment, particle size) run in rounds until their check passes (on screen).
- Limit checks as values are typed: weight against target, pH, temperature, mixing time, density, viscosity, assay, fill (on screen).
- A value out of limits needs a deviation note before the step can be signed (on screen).
- QA hold: the bulk test step stops the batch until QA releases the hold with a signature (on screen).
- Hold times and periodic checks run on the server clock; an overrun needs a deviation note.
- Yield and accountability of the bulk worked out against their limits; out of limits blocks release (on screen).
- Equipment and rooms fit for use: from Medhanta LEAD (logbook) when linked, status labels confirmed and checked otherwise (on screen).
- Only trained people sign a step that names a training (from Medhanta TIDE when linked).
- In-process lab results from Medhanta QLIMS when linked; typed by hand with a second-person check otherwise (on screen).
- Line clearance at the start of every stage (on screen).
- Rework only as a new batch from an approved master; QA may terminate a batch, with a reason and returns to stores (on screen: the "Terminate batch" button).

## Review by exception and release
- Deviation notes without a number: QA closes them in the batch record with a reason and e-signature, or sends them to Medhanta DIVE when linked (on screen).
- Production approval only when the record is complete; it lists any demo waits skipped; after it the record is closed to changes (on screen).
- QC approval with the QC report number (on screen).
- QA review by exception: counters for corrections, steps sent back, late timers, values out of limits, open deviations and values typed by hand, then each finding with its note (on screen).
- QA release or rejection by e-signature; the release signature records the review (on screen).
- QA's To review list: batches waiting for QC or QA, and batches in production (on screen).
- Batch record PDF with every value, round, result, note, correction, demo skip and signature (on screen).

## TrueBatch Oral Liquids Packing (filling and packing)
- Packing master per pack: container (bottle, sachet, unit-dose cup, ampoule), closure, measuring device, nominal fill and fill excess (or a dry syrup's fill weight), packs per shipper, standard batch, shelf life, expiry rule, destination and MRP (on screen).
- Packing materials from master data, marked printed and batch-coded; their issue and reconciliation steps added in one click (on screen).
- Fill limits for the mean and for each container, in mL or g (on screen).
- Packing batch issued from a RELEASED bulk batch read from TrueBatch Oral Liquids, with what is left to issue (part issues) and the bulk hold time; one active order per line (on screen).
- Bulk received with its date of manufacture, quantity, ready time and hold pulled from TrueBatch Oral Liquids; expiry worked out from the shelf life, never typed (on screen).
- Packing materials issued from released lots, checked against MMS stock.
- Line clearance before and after packing, line set-up and component check, containers washed or air-rinsed.
- Fill rounds of 10 containers at start, at intervals, after a stoppage and at the end, mean and each against limits, with the bulk stirred for a suspension or emulsion (on screen).
- Capping and closure check (defects, torque, child-resistant cap, induction seal), room conditions.
- Coding check: batch number, manufacturing and expiry dates and MRP compared with the batch record; a mismatch is caught at once (on screen).
- On-line inspection, carton and measuring-device check, optional serialisation checks with the customer's system.
- Finished goods and bulk reconciliation, reconciliation of every printed material, destruction of coded leftovers (on screen in the PDF).
- QC approval, then QA review by exception and release; the bulk batch's deviations checked (from Medhanta DIVE when linked, typed by QA otherwise) (on screen).
- Packing record PDF (on screen).

## Platform links and published data
- Optional links, each with a hand-entry fallback and a second-person check: Medhanta MMS (lots, stock, certificates), Medhanta LEAD (equipment and room status), Medhanta DIVE (deviations), Medhanta ASSURE (change control numbers), Medhanta TIDE (training), Medhanta QLIMS (in-process lab results).
- Published for other Medhanta products: batch facts (status, manufacture date, good quantity, ready time and hold), material use (MMS takes it off lot stock), equipment use, deviation notes, lab requests, and every recorded reading with its limits for continued process verification in Medhanta RISE.
- Insert-only audit trail and locked signed records; the app's database login cannot change or delete them.
