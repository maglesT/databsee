# Medhanta DIVE: feature list

**Medhanta DIVE** (Deviations, Investigations & CAPA; formerly "Deviations & CAPA") by Medhanta: deviation management,
investigations and the site CAPA register for one pharma plant that exports (US FDA, EU GMP, India Revised Schedule M).
Demo data: the fictional "Medhanta Demo Plant, Unit 2". People, products and batch numbers are made up.
**New since early November** is marked *(new)*.

## Sign-in and set-up
- Everyone signs in with their own Medhanta login (one sign-on for the whole Medhanta suite). No shared accounts. *(new: sign-on through Medhanta core)*
- Permissions are ticked per person in Medhanta's people screen (report, investigate, classify, approve, close, cancel, raise and verify CAPAs, read the audit trail, settings). *(new)*
- 15-minute idle timeout; wrong passwords and lockouts are counted centrally by the Medhanta sign-on, which alerts admins.
- Admin: site name, target days per classification, list of areas, list of deviation types (mark lab / OOS types). Admin never acts on deviations.

## Report (Define)
- Anyone allowed to report fills one short form and gets a number at once (DEV-2026-0026). Numbers are never reused.
- Unplanned or planned deviation; title, what happened, area, equipment, when it happened.
- **Batch picked, not typed:** the batch is picked from the batches published by the linked TrueBatch products (TrueBatch Tablets, Injectables, Packing, Capsules, Oral Liquids, API); its product comes with it and is checked again on saving. A batch not in the list may be typed and is marked "Typed by hand". *(new, migrations 0015/0016)*
- "No product or batch concerned" for facility events.
- Initial impact assessment by the reporter (product quality, patient safety, other batches: yes / no / not known yet) and a short note.
- Action taken (immediate action) and when.
- **OOS phase II from Medhanta QLIMS:** QA picks an open OOS whose phase I found no lab error; title, what happened, time, lot and product fill in, and the area is set to "QC laboratory (Medhanta LIMS)". An OOS already linked to a deviation cannot be picked twice. *(new)*

## Filed from other Medhanta products (only what a person sent)
- A missed limit in Medhanta LEAD, a TrueBatch exception, or a continued process verification (CPV) signal from Medhanta RISE is filed here as a deviation once a person in that product chooses "Send to Deviations". Each is filed once, with its source shown. Nothing is filed on its own. *(new)*

## QA triage and classification
- QA sees new reports under "Waiting for me".
- Minor / major / critical, deviation type, impact assessment, investigator (only people active in Medhanta's people list).
- Independent check: the reporter cannot classify. A batch picked from TrueBatch is "checked automatically"; QA ticks "product and batch checked" only for a batch typed by hand. *(new)*
- Target closure date set from the classification; QA can extend it with a reason.
- Planned deviations: QA approves (or rejects) with an e-signature before the change is carried out.
- **Not a deviation:** QA can cancel a report that turns out not to be a deviation, with a reason and an e-signature. Never deleted; shown "Cancelled by QA: not a deviation", listed under its own filter, left out of trends and overdue lists. *(new, migration 0018)*

## Investigation helper (Measure and Analyze)
- DMAIC progress bar on every deviation (Define, Measure, Analyze, Improve, Control).
- "Things to look at": rule-based hints (same equipment, same product, same type, same area, repeats).
- Similar earlier cases with their root causes and CAPAs.
- **Data collection:** "Fetch related data" reads the batch record from **TrueBatch** (batch status, equipment and rooms used at each step) and the equipment logbook in **Medhanta LEAD** (entries around the event, calibrations, last preventive maintenance, breakdowns, SOPs), read-only, with findings in plain words (for example "HT-01 calibration was overdue at the event"). Each fetch is kept as a read-only copy with a checksum. *(new: TrueBatch replaces Batchwright, which is retired)*
- Attachments (PDF, photos) up to 10 MB, never deleted; can be withdrawn with a reason.
- Investigation tools, saved as drafts: Is / Is Not; 6M fishbone with evidence and ruled in / out; 5 Whys with evidence; root-cause category; barrier analysis; FMEA on the same 1–5 word scales as Medhanta ASSURE (score = severity × occurrence × detection). *(FMEA scale new)*
- KT checklist for lab / OOS types; fault tree for critical deviations.
- "Most likely cause" tick; a required justification when the cause is human error.
- Other batches checked, each with its outcome; conclusion; missing pieces listed before signing; "Investigation complete" e-signature.
- Signed investigation shows the fishbone diagram with the ruled-in causes.
- Optional AI-suggested possible causes (Google Gemini); off without an API key (not shown in this demo).

## CAPA (Improve)
- QA raises CAPAs from the deviation: corrective or preventive, what to do, owner, due date, strength (strong / medium / weak).
- A major or critical deviation needs at least one CAPA; a minor one may record "no CAPA" with a reason.
- The owner sees it under "Waiting for me" and marks it done with a note and record references.
- QA verifies with an e-signature and chooses a dedicated effectiveness check by a date, or monitoring through the trend.
- Effectiveness check: effective / not effective with evidence, signed.
- CAPAs from internal audits, complaints and other sources use the same register ("New CAPA").
- Due dates can be extended with a reason; corrections keep every version.
- When Medhanta ASSURE (QMS) is linked, CAPAs are raised and followed there and shown here read-only: one number, no double entry. *(new)*

## Closure (Control)
- Final impact assessment, batch disposition notes, closure summary, "Closed" e-signature.
- Open CAPAs do not block closure; they stay on the CAPA list.
- Reopen a closed deviation with a reason and an e-signature.
- **PDF copy** of one deviation (with its CAPAs, data collected and history) and of one CAPA. Since 22 Nov each page carries the Medhanta DIVE emblem and name, dates are written one way with the year ("22 Nov 2026, 18:14 IST"), and the history is in plain words. *(new)*
- A deviation view is published for TrueBatch, so a batch record shows its deviations and their status at release. *(new)*

## Lists and trends
- Home lists: Waiting for me, Open, Overdue, All, Not a deviation, with counts; search by batch number (written any way), deviation number or a word.
- Overdue in red on every list and page.
- CAPA register with filters: waiting for me, overdue only, status, source.
- Batch check: every deviation naming a batch, open ones marked, for release decisions.
- Trend: deviations per month by area, type or classification, for a period and product; unusual months flagged with a simple statistical rule explained on screen.
- Pareto of root-cause categories with a repeat flag; CAPA counts by source, status and effectiveness.

## Records you can trust
- Corrections with a reason; the old version stays readable; a correction after a signature needs a new signature.
- History on every deviation and CAPA in plain words; one append-only audit trail with old and new values and reasons.
- **Display round (20 Nov):** one date style on every screen ("22 Nov, 18:12 IST", plant time, 24-hour; the year only when it is not this year) and history lines in words, no codes. *(new)*
- E-signatures: at each signing the person enters their password again at the Medhanta sign-on in a small window; name, time and meaning are linked to the exact content.
- Nightly integrity check of versions, signatures, attachments and fetched data, with "Run now" on the Audit trail page; a failed check stays as an on-screen alert.
- Daily backup with checksum and off-site copy; restore check script.
