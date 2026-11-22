# Medhanta QLIMS: feature list

Laboratory information management for pharma QC labs, on the Medhanta platform. Shown in the demo unless marked *(not on screen)*.

## Sign-in and roles
- Personal Medhanta login (one sign-in for the suite); no shared accounts; access by permission (analyst, checker, reviewer, QC approval, QA, method author and checker).
- Electronic signatures: password again, printed name, time and meaning, linked to what was signed.
- Idle sessions end on their own *(not on screen)*.

## Specifications and methods
- Test methods as versioned masters built from a fixed library of tested blocks (weighing, HPLC run, system suitability, titration, dissolution, KF and more) with fixed calculation templates and pharmacopoeia rounding.
- A method is validated (or verified, or transferred) before routine use; validation reports are kept with the method.
- Specifications per material or product: tests, methods, limit types (range, not more than, not less than, conforms, alert and action, release and shelf life), trend limits, sampling plan, reserve quantity.
- Written by one person, checked by a second, approved by QA with a change control number, made effective by another QA person; only the effective version is used.
- Plain-words view of every master and an automatic master check.

## Samples
- Lots waiting to be sampled read live from Medhanta MMS; finished and bulk batches from TrueBatch Tablets, Capsules, Oral Liquids, Injectables and API.
- Sampling plan worked out (for example square root of n plus 1) with the containers to open.
- Sample number, labels (PDF), tests taken from the effective specification.
- Chain of custody: registered, received, stored, handed over, disposed of, each with person and time.
- Registration by hand when a link is off, with a second-person check.
- In-process samples from TrueBatch lab requests; retest of stored materials by their retest date; reserve samples *(not on screen)*.

## Analysis worksheets
- An analysis is started from the sample; its worksheet comes from the method, stage by stage, in order.
- Each value saved at once on the server clock; results worked out by the server and checked against the specification limit.
- Only qualified instruments are offered (qualification read from Medhanta EQUIP); instrument and room status read from Medhanta LEAD (an overdue calibration is refused).
- Standards, reagents and columns picked from the lab inventory; potency pulled, never typed.
- Second-person check of critical steps, on the checker's own device.
- Only trained analysts sign: training read from Medhanta TIDE.
- Starting the same test twice is blocked; disabled buttons say why.
- A value out of limits needs a deviation note before the step can be signed.
- Instrument data capture and CDS import *(not on screen)*.

## Review, QC decision and certificate
- To review list; the reviewer reads the record with its audit trail (corrections, values out of limits, hand entries, deviations from Medhanta DIVE naming the batch, every signature).
- Nobody reviews their own work.
- QC decision (approve or reject) only when every test has a reviewed result.
- Certificate of analysis (PDF) issued at approval with reviewed results, limits, methods and the signed decision.
- Analysis record PDF with every value, result and signature.

## OOS (out of specification)
- An out-of-limit result opens an OOS at once.
- Phase Ia laboratory checklist, phase Ib hypothesis testing with a written plan, phase I conclusion and supervisor review.
- Phase II manufacturing investigation linked to the deviation in Medhanta DIVE, read live.
- QA conclusion by e-signature: OOS confirmed, or result invalidated for a proven lab cause with authorised retests; the original result always stays.
- Other batches of the same item listed for impact.
- Out-of-trend flag on a trend limit *(not on screen)*.

## Lab inventory
- Reference and working standards (qualified against the primary, checked by a second person), reagents, solutions, volumetric solutions, columns, culture media, cultures, lab animals.
- Expired, past-retest or untested items cannot be used; the reason is shown.
- Usage log of every item (for example every run of a column).

## Environmental monitoring and water
- Approved monitoring plans: points, rooms and grades, sampling kinds and frequencies, alert and action limits.
- Due today and per-batch lists; each sampling taken becomes a sample.
- Taking a sampling again in the same period or for the same batch needs a reason.
- Results over a limit open an excursion with its DIVE deviation; isolates identified.
- EM map of each room with each point's latest result; adverse trend flags.
- Particle counter and water monitor reports imported as files *(not on screen)*.

## Stability
- Approved stability protocols: conditions, time points, specification, pack, shelf life, pull window.
- Studies placed for TrueBatch batches in chambers that Medhanta LEAD reports fit; stock per condition.
- Pull schedule with due dates and windows; each pull registers a stability sample.
- Stability evaluation and on-going stability check per product *(not on screen)*.

## Trends and reports
- Control charts per product and test with Nelson rule breaks.
- APQR data per product: results summary with Cpk, failed batches and investigations, method and specification changes; CSV and PDF export.
- KPIs and workload: open tests by due date, assignment to analysts.

## Records you can trust
- Corrections need a reason; the old value stays visible, crossed out; the step is signed again.
- Full history on every step, sample, OOS and excursion; audit trail that cannot be switched off.
- PDF copies on demand with the Medhanta QLIMS header.
- Paper fallback: numbered blank worksheets issued and reconciled *(not on screen)*.
- Contract lab results recorded with their report *(not on screen)*.
