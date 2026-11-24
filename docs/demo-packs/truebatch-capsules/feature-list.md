# TrueBatch Capsules: feature list

TrueBatch Capsules is the electronic batch manufacturing record for capsules (hard gelatin, HPMC and soft gelatin), from
dispensing to QA release of the bulk filled capsules, by Medhanta. TrueBatch Capsules Packing is its packing record,
from the released bulk to the released packed batch, built on the same engine. Both run on the Medhanta platform
(people, sign-in, permissions and master data come from Medhanta core). Features marked (on screen) appear in the demo
screenshots. Taken from the repository's latest main (commit 5a9e7c5).

## Sign-in, people and sessions
- Sign-in through Medhanta core, one person per browser; each person sees only the tabs their permissions allow (on screen).
- "My work" home page: steps waiting for your check, timers exceeded, steps to sign again after an input changed, batches for you, batches in progress and batches finished on the floor with their status (on screen).
- 15-minute idle logout (only a tap or a key counts as use); the session also ends with core's sign-on (8 hours) and on sign-out at core (back-channel logout).
- Roles by permission: master author, master checker, QA approver, batch issuer, operator, second-person checker, production supervisor, QC approver, QA release, exception decider, viewer.
- Demo installations only: a DEMO banner on every screen and "Skip wait (demo)" for people with the demo permission; every skip is recorded and shown to QA and in the PDF (on screen).
- TrueBatch Capsules emblem on the sign-in page and in the header (on screen).

## Master recipe (master batch record) designer
- New master from a process skeleton: hard capsule direct fill, hard capsule wet granulation, soft gel oily solution fill, soft gel suspension fill, liquid-filled hard capsule; or a copy of another master, or empty (on screen).
- Header: product from master data, batch size in capsules, fill weight per capsule, shell type (hard gelatin, HPMC, soft gelatin), shell size, mean empty shell weight or wet gel mass per capsule, dispensing rooms, other strengths from the same blend (on screen).
- US OTC products: a two-piece hard capsule must have a banding or sealing step with a zero-leaker check (TC-24).
- Formula from master-data materials: mg per capsule, role (API, excipient, solvent removed in processing), place (including the shell or gel mass lines), label claim; batch quantities worked out (on screen).
- Adjustments: assay and LOD (potency on dried, anhydrous or as-is basis), salt factor, content, overage, filler compensation; the dispensing target is adjusted for the lot actually used (on screen).
- Process: stages (normal, preparation, sub-batches) and steps, with the rooms and machine types each stage may use, the intermediate each stage produces and its hold time, and the stages it uses (on screen).
- Searchable block library (on screen), including: weighing, charging, sifting, binder solution, coating suspension, dry mixing, mixing, granulation to an end point, roller compaction, drying to an LOD limit, drying to constant weight, heating to an end point (curing), sieving or milling with screen checks, lubrication rescaled to the actual weight, combining sub-batches, blend uniformity, bulk and tapped density and flow, sieve analysis, gelatin mass preparation, capsule filling with periodic gross-weight checks, capsule filling with periodic net-fill checks, soft gel encapsulation with periodic checks, soft gel drying to a hardness or to a shell water content, banding or sealing, disintegration, uniformity by weight variation, content uniformity, spray coating (pan or Wurster) with periodic checks and weight gain, polishing, printing or sorting, checkweighing, metal detector challenge, value checks, observation checks, QA sample with hold, stage yield, capsule reconciliation by weight, line clearance.
- Pellets built from these blocks: drug suspension, drug layering on sugar spheres in the Wurster coater until the weight gain is met, enteric coating suspension and enteric coating, curing at a temperature for a minimum time, sieving (twins and fines) with screen integrity, pellet size by sieve analysis, lubrication (on screen).
- Soft gels: gel mass with temperature, viscosity and water content limits, fill medicine with mixing and viscosity, encapsulation rounds (ribbon thickness, wedge temperature, fill and shell weights, seal thickness, leakers), tumble and tray drying to a hardness with minimum times (on screen).
- Step options: second-person check, wait for the check, critical step, minimum time, periodic rounds every N minutes, repeat until a check passes, optional with a reason, QA hold, done only when a header value is within a limit, order-critical step, required training (from Medhanta TIDE, when linked).
- Master check panel: refusals (clear maths errors) and warnings (questions only the author can answer), each linked to the exact item; an unanswered warning blocks "Send for review" (on screen).
- Calculation preview: worked examples of every calculation with example values.
- Plain-language view of the whole master for review (on screen).

## Review, approval and versions
- Send for review with e-signature ("Prepared"), second-person check by another person, QA approval with a change control number, then "Make effective" by QA (on screen).
- One effective version per master; a new version needs a change control number; the timeline shows every signature (on screen).
- Effective masters are read only (on screen).

## Issuing and the shop floor
- Issue a batch only from the effective master; the server gives the unique batch number (TC260001 …) with an e-signature (on screen).
- Batch screen: every stage and step in order, the stage that is "now", alerts for open deviations and notes to decide, the batch record PDF (on screen).
- Step screen: instruction, the master's targets and limits, fields saved as you leave them, results worked out by the server with "How it was worked out", rounds, history on the server clock (on screen).
- Line clearance before every stage, checked by a second person.
- Machines, rooms and balances picked from master data, with their status labels (clean, calibrated, in service, qualified); from Medhanta LEAD when linked, typed and second-person checked otherwise (on screen).
- Lots from Medhanta MMS: status, expiry, retest, assay and LOD pulled; only released, in-date lots; the target recalculated for the lot's assay (on screen).
- Stock: a weighing that would use more than the lot has left in MMS (less what TrueBatch already used) is refused in plain words (on screen).
- Second-person checks signed by another person on their own device; the performer can never check their own step (on screen).
- Periodic in-process checks: fill weights of 20 capsules and closed length every 30 minutes, individual-weight bands, appearance, rejects; rounds go on until filling is finished (on screen).
- Rounds that stop on a result: spray coating until the weight gain is met, drying until LOD or hardness is met (on screen).
- Timers on the server clock: minimum times (curing, tray drying), periodic checks, mixing times, hold times of intermediates; an overrun needs a deviation note (on screen).
- Out-of-limits results block signing until a deviation note is added, with or without a deviation number (on screen).
- QA hold after a QA sample: the next step waits until QA releases the hold with an e-signature (on screen).
- Content uniformity (acceptance value) and uniformity by weight variation worked out; QC results picked from Medhanta QLIMS when linked, typed from the QC report and checked otherwise (on screen).
- Reconciliation of capsules by weight with the mean filled-capsule weight: good capsules, rejects, samples, yield and accountability (on screen).
- Stage yields with limits; out of limits blocks release.
- Late entries need a reason; corrections keep the original value and the reason, and steps that used the value are marked "input changed" to be signed again.
- Terminate a batch (QA) with the returns of each lot.

## Exceptions, approvals and release
- Deviation notes without a number: QA decides them, close here with a reason and e-signature, or send them to Medhanta DIVE (on screen).
- Production approval only when the record is complete; the record is then closed to changes (on screen).
- QC approval with the QC report number (on screen).
- QA review by exception: counters for corrections, steps sent back, late timers, out-of-limits results, open deviations and values typed by hand; stage yields; the full audit trail and signature list (on screen).
- Release refused in plain words while a deviation is open (on screen); QA closes the deviation with a reason (on screen).
- Release or rejection by e-signature; the release signature also records the review of the audit trail (on screen).
- Batch record PDF: every stage, step, value, lot, limit, result, note, change and signature, with DEMO skips listed (on screen).

## Links and published data (Medhanta platform)
- Optional links: Medhanta MMS (lots, stock), Medhanta LEAD (equipment and room status), Medhanta DIVE (deviations), Medhanta ASSURE (change control numbers), Medhanta QLIMS (in-process results), Medhanta TIDE (training). Without a link, or while it is down, the value is typed with a second-person check and listed for QA (on screen).
- Published views for other products: batch facts (with date of manufacture and good capsules), equipment use, deviation notes, material use (MMS reduces lot stock), lab requests (for QLIMS), readings with limits (for Medhanta RISE continued process verification).

## TrueBatch Capsules Packing
- Its own product on the same engine: own masters, batches (TCP260001 …), people and permissions (on screen).
- Packing master per pack: pack product, bulk product, pack type (blister, strip, bottle), capsules per pack, packs per carton, standard batch, capsule weight, shelf life, expiry rule, destination (India domestic or export), MRP, optional serialisation (on screen).
- Packing materials from master data, marked printed and coded; their issue and reconciliation steps added in one click (on screen).
- Issue only from a released bulk batch read live from TrueBatch Capsules, with what is left of its good capsules; part issues; one active order per line (on screen).
- Date of manufacture pulled from TrueBatch Capsules; expiry worked out from the shelf life, never typed (on screen).
- Coding check: batch number, Mfg, Exp and MRP as printed compared with the record; a mismatch is caught (on screen).
- Checks alongside the line: forming and sealing, leak test, on-line inspection, carton check, camera challenge, serial numbers when checked.
- Reconciliation of capsules (by weight) and of every printed material (issued = used + destroyed + returned); destruction of coded leftovers; line clearance after.
- QA review by exception and release, as for manufacturing (on screen).
