# TrueBatch Tablets: feature list

TrueBatch Tablets is the electronic batch manufacturing record for tablets, from dispensing to QA release of the bulk
tablets, by Medhanta. TrueBatch Tablets Packing is its packing record, from the released bulk to the released packed
batch. Both run on the Medhanta platform (people, sign-in, permissions and master data come from Medhanta core).
Features marked (on screen) appear in the demo screenshots.

## Sign-in, people and sessions
- Sign-in through Medhanta core, one person per browser; each person sees only the tabs their permissions allow (on screen).
- "My work" home page: steps waiting for your check, timers running, steps to sign again, batches for you (on screen).
- 15-minute idle logout; only real use of the screen (a tap or a key) keeps the session alive, background refreshes do not.
- The session also ends when the Medhanta core sign-on ends (8 hours), and on sign-out at core (back-channel logout).
- A person without a TrueBatch permission is refused at sign-in.
- Every screen of a demo installation carries a DEMO banner (on screen).
- TrueBatch Tablets emblem on the sign-in page, in the header and in the PDF (on screen).

## Master record (recipe) designer
- New master from a process skeleton: wet granulation film-coated, wet granulation uncoated, direct compression, or a copy of another master (on screen).
- Header: product from master data, batch size, core and coated tablet weight, dispensing rooms, other strengths from the same blend (on screen).
- Formula from master-data materials: mg per tablet, role (API, excipient, solvent removed in processing), place (intragranular, binder, extragranular, coating layer); batch quantities worked out (on screen).
- Process: stages (normal, preparation, sub-batches) and steps from a block library, with the rooms and machine types each stage may use (on screen).
- Block library with search (on screen), including: weighing, sifting, charging, dry mixing, granulation to an end point, drying to an LOD limit, drying to constant weight, milling to a size, roller compaction, hot-melt extrusion, curing in an oven, lubrication, blend uniformity, density and flow, sieve analysis, compression, bilayer compression, film coating, sugar coating in rounds, drug layering on beads, mix two lots to a target, polishing or printing, friability, disintegration, dissolution and extended-release dissolution profile, content uniformity, uniformity by weight, punch and die checks, line clearance, stage yield, tablet reconciliation, device assembly.
- Sugar coating in rounds: syrup, dusting powder, drying time, inlet temperature and weight gain per round; the rounds stop when the weight gain is within limits (on screen).
- Air-humidity readings: relative humidity of the room or inlet air, and the inlet air's absolute humidity worked out from humidity and temperature (on screen).
- Tensile strength of the tablets worked out from hardness, thickness and diameter at each compression check (on screen).
- A step switched on by a recorded value: e.g. "dehumidifier on" only when the room humidity reading is 50 %RH or more; otherwise it is marked not applicable (on screen).
- Other step options: second-person check, critical step, minimum time, periodic rounds every N minutes, repeat until a check passes, optional with a reason, QA hold, required training.
- Master check panel: errors and warnings with links that open the exact setting; questions such as the label-claim basis answered in place (on screen).
- Calculation preview: worked examples of every calculation with example values.
- Plain-language view of the whole master for review (on screen).
- Review and approval: sent for review with an e-signature, checked by a second person (or returned with a reason), approved by QA with a change control number, made effective (by another QA person when the number was typed by hand); one effective version, the old one retired (on screen).
- Comments on any part of a master; delete a draft; new versions.

## Batch issue
- A batch is issued from the effective master with an e-signature; the server gives the number, never reused (TB260009, TB260010, TB260011) (on screen).
- Production may abandon a batch before its first step.

## Shop floor execution
- Batch screen: stages with their state (open, now, closed), the steps in order, alerts for open deviations and notes to decide (on screen).
- Steps open in order; each value is saved at once with the person and the server time (on screen).
- Line clearance before each stage, with the room and the previous product and batch.
- Weighing against the master's target and tolerance, with the lot and the balance; target adjusted by assay and LOD when the master asks (on screen).
- Lots pulled from Medhanta MMS: status, expiry, retest date and certificate values cannot be typed over (on screen).
- Over-use refused: a weighing may not take more of a lot than MMS shows available, less what TrueBatch already used (on screen).
- Equipment and room status labels answered by hand when Medhanta LEAD (Logbook) is not linked, with a second-person check (on screen).
- Limit checks: every result shows within or out of limits, with "how it was worked out" (on screen).
- Out of limits needs a deviation note (with or without a deviation number) before the step can be signed (on screen).
- IPC (in-process checks) in periodic rounds: tablet weights, hardness, thickness, tensile strength, friability, disintegration (on screen).
- Timers and hold times on the server clock; next check due shown; in a demo installation a wait can be skipped, and the skip is recorded (on screen).
- Undo a weighing to weigh another lot; corrections keep the old value struck through with a reason.
- E-signature on every step ("performed"), showing what is signed (on screen).
- Second-person check on the checker's own device; the performer cannot check their own step (on screen).
- Only trained people sign, when a step names a training (Medhanta TIDE link).
- In-process lab tests requested from and picked up from Medhanta QLIMS (when linked).

## Exceptions and deviations
- Deviation notes on a step, with a deviation number (Medhanta DIVE) or without one (on screen).
- A note without a number is decided once: closed here with a reason and e-signature, or sent to Medhanta DIVE (on screen).
- Open deviations and notes to decide are shown on the batch screen (on screen).

## Approval, review by exception and release
- Production approval only when every stage is closed and every overrun has a note; the record is then closed to changes (on screen).
- QC approval with the QC report number (on screen).
- QA review by exception: counts of corrections, sent-back steps, late timers, out-of-limit values, open deviations and hand-typed values, each listed with its step, plus stage yields and the audit trail (on screen).
- QA closes a deviation with a reason (on screen).
- Release refused in plain words while something blocks it, e.g. an out-of-limit yield without a deviation number (on screen).
- Release or rejection by e-signature; QA can terminate a batch still in production with a reason.
- Released record is closed to changes (on screen).
- Batch record PDF with every value, check, signature and change, headed with the TrueBatch Tablets mark (on screen).
- "All batches" list, newest first, with each batch's status and its Batch, Release and PDF links (on screen).
- Filters on All batches: search by batch number, filter by status and by product (on screen).

## TrueBatch Tablets Packing
- Packing master per pack: pack product, bulk product, pack type and size, packs per carton, shelf life from master data, destination, MRP (on screen).
- Packing materials from master data, marked printed and coded; their issue and reconciliation steps added in one click (on screen).
- Packing order issued from a RELEASED bulk batch of TrueBatch Tablets, pulled live, with what is left of its good tablets (on screen).
- One active packing order per line.
- Bulk received at the line with its date of manufacture from TrueBatch Tablets; expiry worked out, never typed (on screen).
- Coding check: the step shows what the pack should print (the bulk batch number, Mfg month, Exp month, MRP); the printed values typed from a pack are compared with the batch record and a mismatch is caught (on screen).
- Forming and sealing, leak test, on-line inspection and carton checks run alongside the line in periodic rounds.
- Reconciliation of tablets and of every printed material; destruction of coded leftovers; line clearance after packing.
- QC approval and QA release of the packed batch; packing record PDF (on screen).

## Platform links and data
- Optional links: Medhanta MMS (lots and stock), Medhanta LEAD (equipment and room status), Medhanta DIVE (deviations), Medhanta ASSURE (change controls), Medhanta TIDE (training), Medhanta QLIMS (lab results), Medhanta RISE (operations).
- Without a link, or while it is down, values are typed by hand with a second-person check and listed for QA (on screen).
- Published views for other Medhanta products: batch facts, equipment use, deviation notes, material use (for MMS stock), lab requests and readings for continued process verification.
- Own audit trail of every change; audit rows and signatures cannot be changed or deleted.

## Platform features not shown in this demo
- "You cannot change your own permissions": permissions are granted in the Medhanta platform's permission register, not inside TrueBatch Tablets, so this does not show in the app on its own.
- The 15-minute idle logout is built into the app but is not filmed (the video would have to wait 15 minutes); the sign-in screen is shown instead.
