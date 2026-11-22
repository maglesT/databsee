# TrueBatch API: feature list

TrueBatch API is the electronic batch record for making an active pharmaceutical ingredient (API) by chemical
synthesis, by Medhanta: one stage per synthesis step (each makes an intermediate with its own yield and hold time),
then crystallisation, isolation, drying and milling, and **Pack and label** as the last stage of the same record. It runs
on the Medhanta platform (people, sign-in, permissions and master data come from Medhanta core). Features marked
(on screen) appear in the demo screenshots. Out of scope by design: fermentation and cell culture, extraction from
natural sources, sterile APIs after the sterilisation point, continuous flow.

## Sign-in, people and sessions
- Sign-in through Medhanta core, one person per browser; each person sees only the tabs their permissions allow (on screen).
- My work home page: steps waiting for your check, timers exceeded, steps to sign again, batches for you (on screen).
- 15-minute idle logout (background refreshes do not count); the session ends with core's sign-on (8 hours) and on back-channel logout.
- TrueBatch API emblem on the sign-in page, in the header and in the PDF (on screen).
- Demo installations show a DEMO banner on every screen and a "Skip wait (demo)" button for permitted people; each skip is recorded and shown to QA (on screen).

## Master record (recipe) designer
- New master from a process skeleton: multi-step synthesis with crystallisation, single-step salt formation, recrystallisation or reprocessing, blending of released batches, a copy of another master, or empty (on screen).
- Header: the API as a master-data material, kg of API expected per batch, molecular weight as isolated, retest period, dispensing rooms, "intermediate for stores" option (on screen).
- Formula per stage: starting material per batch (kg or L), per kg of the stage's key input, or in molar equivalents of it; molecular weight and density; batch quantities worked out (on screen).
- Assay (potency) adjustment of a line, salt-factor, content and overage adjustments, with safety rules that refuse double-counting water or a negative quantity (on screen: assay adjustment).
- Recovered solvent allowed on a solvent line, charged only as a released lot.
- Stages with rooms, allowed machine types, responsible role, intermediate produced (name, hold time, molecular weight, expected kg) and the stage it uses (on screen).
- Step library (data blocks): line clearance, weigh, charge, charge a liquid, process to an end point (react, quench, crystallise), separate layers, distil to a volume, distil-dry, isolate in loads, filter (filtrate kept), column, dry to an LOD limit, dry to constant weight, sieve or mill, sieve analysis, mix, check a value, QA sample with hold, QC lab in-process test, sub-batch combine, stage yield, containers issued, filled and labelled, counted back, packing material issue, printed-label reconciliation, destruction (on screen: most of them).
- Each step's settings as sentences with limits (temperature, pressure, pH, vacuum, IPC end point, LOD, wash, fill tolerance), repeat-until rounds, periodic checks every N minutes, minimum times, QA hold, optional with a reason, critical step, second-person check, required training (on screen).
- Worked example on every calculation before the master is used (on screen).
- Master check: lists what is missing or wrong in plain words and links to the field; checks rooms and machine types against master data (on screen).
- Calculation preview tab, and a plain-language view of the whole recipe (on screen).

## Review, approval and versions
- Send for review with an e-signature (prepared), second-person check or return to the author with a reason (on screen).
- QA approval with a change control number; checked live against Medhanta ASSURE (QMS) when linked, otherwise typed and made effective by another QA person (on screen).
- One effective version at a time; a timeline of every signature (on screen).
- New version or copy of a master; retired versions kept.

## Batch issue and the shop floor
- Issue a batch from the effective master; the server gives a unique number (prefix TA), never reused (on screen).
- Batch screen: header with product, batch size, master version, retest date, issue time; stages in order with status; alerts (on screen).
- Steps done in order; every entry saved at once with person and server time; late entries need a reason.
- Line clearance at the start of every stage: room, previous product and batch, clean status, cleaned on/by (on screen).
- Weighing: lot, balance, gross and tare; target from the master adjusted for the lot's assay; tolerance check (on screen).
- Molar equivalents worked out on the actual weighed starting material or the actual intermediate yielded (on screen).
- Charging solids and liquids (flowmeter, level gauge or weight), addition time and temperature limits (on screen).
- Reaction rounds at a set interval with temperature, pressure, pH and IPC result and report number; stops at the end point (on screen).
- Quench, layer separation (layer kept, interface, where the other layer goes), distillation to a volume, solvent sent to recovery with quantity and containers (on screen).
- Crystallisation, isolation in loads with wash checked against the master and wet cake weighed, drying to an LOD limit, milling with screen checks (on screen).
- Stage yield against the molar or stated theoretical, with accountability and limits (on screen).
- Intermediate hold times and other timers run on the server clock; an overrun needs a deviation note.
- Out-of-limit result: the step cannot be signed without a deviation note (on screen).
- E-signatures with name, time and meaning; the dialog shows what is signed (on screen).
- Second-person check on significant steps on the checker's own device; the performer can never check their own step (on screen).
- Corrections keep the original value and the reason, and mark later steps that used it "input changed" to sign again.
- Step history: who did what, on the server clock (on screen).

## Links to other Medhanta products (each optional, with a hand-entry fallback checked by a second person)
- Medhanta MMS: lot status, expiry, retest date, assay, water, LOD; only released, in-date lots of the right material (on screen).
- Over-use refused: a quantity larger than the lot's stock in MMS (less what TrueBatch API already used) cannot be taken (on screen).
- Medhanta LEAD (Logbook): equipment and room status, cleaning and product changeover; Medhanta DIVE (Deviations): deviation numbers and status; Medhanta ASSURE (QMS): change controls; Medhanta QLIMS: CoA for QC approval and in-process lab results; Medhanta TIDE (Recruitment): only trained people sign a step that names a training.
- Hand-typed values when a link is off are marked and listed for QA (on screen).

## Pack and label
- Drums issued from released lots, labels issued, each drum filled, weighed, sealed and its label checked (one round per drum) (on screen).
- QC and reserve samples with a QA hold that QA releases (on screen).
- Drums counted back, labels reconciled (used, destroyed, returned), batch-coded leftovers destroyed (on screen).
- Pack yield and accountability against the API yielded (on screen).
- Retest date worked out from the date of manufacture and the master's retest period, never typed; for a blend, never later than its oldest lot (on screen).

## Approval, review and release
- Deviation notes without a number are exceptions: close here with a reason and e-signature, or send to Medhanta DIVE (on screen).
- Production approval only on a complete record; demo skips listed (on screen).
- QC approval with the QC report number (or picked from Medhanta QLIMS) (on screen).
- QA To review list (on screen).
- QA review by exception: counters for corrections, sent back, late timers, out of limits, open deviations, hand-typed values; stage yields; the full audit trail (on screen).
- Release refused in plain words while anything blocks it (on screen).
- QA release or rejection by e-signature; the signature also records the review (on screen).
- After release the record is closed to changes (on screen); QA may terminate a batch that cannot be finished, with what went back to stores.
- Reprocessing and rework only as a new batch from a QA-approved master linked to the source.

## Records and reports
- Complete batch record PDF with signatures, corrections and the lots used per material and step (genealogy) (on screen).
- Published views for other Medhanta products: batch facts, material use (MMS reduces stock), equipment use, deviation notes, output lots (API, intermediate and recovered-solvent lots), readings for continued process verification.
- Own audit trail; audit rows and signatures cannot be changed or deleted by the app.

Not in this version's screens: there is no "All batches" list screen in TrueBatch API (batches are reached from My work and To review).
