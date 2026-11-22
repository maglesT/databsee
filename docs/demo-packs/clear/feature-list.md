# Medhanta CLEAR: feature list

Medhanta CLEAR (Compliance Library for Evaluation and Audit Readiness) is a web app for GMP audit checklists and
self-inspections. It runs in the browser (PC or tablet) as a product of the Medhanta platform, or on its own with local
logins. Every line below is true of the app as it ran for this demo (version 0.2.0, platform mode). Items marked
*(not on screen)* exist in the app but are not shown in the video.

## Regulation library
- One library of 4,032 regulation items from India's Revised Schedule M, EU GMP (EudraLex Volume 4) and US 21 CFR Parts 210, 211 and 11.
- Find a clause from the home page by clause number (for example 1.7 or 211.84) or by words; hits show the reference and a regulator badge.
- Each clause shows its full text, its place in the regulation (part, chapter, section) and its area (16 areas, such as Warehouse, QC laboratory, Computerised systems and data integrity).
- Duty sentences and information sentences are marked apart; information text is grey and gets no tick box.
- "Also" line: cross-references to the same requirement in EU GMP, Schedule M or US 21 CFR, and in WHO and PIC/S.
- EU, Schedule M and US references open their own clause text with one tap.
- WHO and PIC/S are cited by clause number only, with a note that their text is not reproduced.
- Definitions page: each regulator's definitions, searchable.
- Tables inside clauses are shown as tables; references added by the checklist editors are marked.

## Checklist templates
- Build a template by choosing markets: India (Schedule M, always the base), EU export (EU GMP), US export (US FDA 21 CFR), in any combination.
- Add plant types (21, such as sterile, ophthalmic, hazardous, biological, beta-lactam, oral-solid, API); general GMP items are always in.
- Choose who is audited: manufacturer (always), manufacturer exporting to the EU, marketing authorisation holder, EU importer, clinical trial sponsor.
- Two checklist styles: regulation clauses (Yes / No / N/A per duty sentence) or audit points (a plain question with "Verify" and "Evidence"; Compliant / Not compliant / N/A), marked Beta in the app.
- Audit points show their source clauses with the covered sentences marked, and a badge when a point is only recommended.
- "Other requirements (check the clause)": duty sentences no audit point covers are still listed.
- Live counters: items or points, lines to answer, removed items, company items.
- Remove an item or point only with a reason; removed items stay listed with the reason and can be put back.
- Add your own company items (title, your reference such as an SOP number, area, text); edit or delete them.
- Regulation text is locked; templates store only ids, reasons and your own items.
- Save, copy, edit and delete templates; search inside a template; show or hide background text.

## Running an audit or inspection
- Start an audit from a template; the site name comes from the installation; name and date can be changed.
- Pick auditors and auditees from Medhanta's employee list, and the rooms or areas audited from Medhanta master data.
- Answer each line: Compliant / Not compliant / N/A (audit points) or Yes / No / N/A (clauses).
- Observation (evidence) text on every line.
- A finding (Not compliant) gets a grade: critical, major or other, with a suggested grade shown.
- Name the rooms, equipment and products a finding concerns, picked from Medhanta master data; names are kept as they were when saved.
- Company items are answered in the same audit.
- Answers save automatically ("Saved ✓" with the time); a warning before leaving with unsaved changes.
- Per-area progress ("88/88 answered · Not compliant 2") and an overall counter with findings by grade.
- Filter: all, not answered, or only the findings; search inside the audit.
- Close an audit (answers become read-only) and re-open it; delete an audit (needs the close right).

## Readiness and reports
- Home page: every audit with status (open / closed), progress bar, number answered and number of findings.
- Report view with the header (site, auditors, auditees, rooms, date, status, template, markets, plant types), answer counts and a table of every line with reference, point, answer with grade and observation; printable.
- PDF download: page-numbered report, removed items with their reasons, a WHO / PIC/S citation note.
- Excel export: Summary, Audit points (or Check points) and Removed items sheets. *(not on screen; the buttons are)*

## Access and records
- Sign-in through Medhanta (single sign-on); sign-out ends the session in Medhanta too.
- Four rights set in Medhanta: see templates and audits; edit templates; perform audits; close, re-open and delete audits. The page shows each person's rights.
- Every login, template change, audit change, answer change, close and re-open is written to an audit trail with before and after values. *(stored in the database; the app has no screen for it)*
- Idle sessions end after 15 minutes.

## Not shown in this video
- Standalone installation with local logins and password change (the video shows the Medhanta platform installation).
- "Ask": questions answered with the exact regulation clauses. It is off on the Medhanta platform and opens on the standalone installation only after its accuracy check, so it is not shown.
