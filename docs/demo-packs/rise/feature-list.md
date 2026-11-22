# Medhanta RISE: feature list

**Medhanta RISE** (operations, OEE and machine-learning insights; formerly "Operations / OEE") shows how well a pharma plant's
equipment is used, where the time and quality go, which process settings gave the best batches, and, new in November 2026,
runs continued process verification (CPV: "watching every batch's process"). Runs, stops, counts and process values come
from the **TrueBatch** batch records over read-only links, or are typed on built-in forms or imported from CSV. Apart from
the signed CPV report it is a **working copy for analysis and decision support**, not the official GMP record: every
screen, export and printout says so. Screen numbers in brackets refer to `screens/`.

Demo data: the app's own demo plant (fictional "Medhanta Demo Plant, Unit 2"), 200 days of history of product **FG-CPM4**
Chlorphenamine Maleate Tablets 4 mg on Line A (TP-01, TP-02, CO-01), plus the TrueBatch demo batch records of FG-CPM4
(TB260009–TB260011) and **FG-CFX1** Ceftriaxone for Injection 1 g (TI260019–TI260021). Cast (all fictional): Site Admin,
Asha Rao (QA), Vikram Shah (Production head, Manager role), Neha Iyer (Engineer), Priya Nair (Operator).

## Sign-on, people and rights (Medhanta platform)
- Sign in through Medhanta core (single sign-on); no separate password in RISE (01).
- Rights are Medhanta permission codes ticked per person in core (operator, engineer, QA, manager, admin bundles; CPV signing is its own right); a person with no RISE right is refused.
- Rights renewed from core every few minutes; 30-minute idle timeout; Log out also ends the core session.
- Manager (plant head) sees every screen and export but cannot enter data (57).
- Working-copy banner on every screen (all screens).

## Site and master data
- Site name and plant time zone (02).
- Machines and products come live from Medhanta master data; RISE keeps no copy. Only a machine's line or room is kept here (06).
- Every active process machine and product is set up automatically at each link refresh; instruments, rooms and utilities are left out (06).
- If master data cannot be read, screens say so and nothing is saved.
- Ideal rates per product and machine (units per hour or minutes per batch): the target behind performance (07).
- Planned hours: weekly pattern plus single days (holiday, shutdown, extra shift) (08, 09).
- Approved ranges per product and step, from the master batch record (MBR) with its reference; only QA changes them, always with a reason (10, 11).

## TrueBatch links (new since early November)
- Read-only links to TrueBatch Tablets, Tablets Packing, Injectables, Injectables Packing, Capsules (+ Packing), Oral Liquids (+ Packing) and API; each shows ok / down / not linked (03).
- Read automatically every 10 minutes and on "Refresh now", with a plain summary of rows read, added, still open and not for OEE (04).
- Each finished machine use in a batch record becomes a run (machine, batch, step, start, end) (05).
- Good output and rejects from the batch's own good quantity and yield (quality = yield), counted once on the batch's last machine; pieces rounded to whole units (05).
- Counts typed by hand only when the batch record gives none; linked rows cannot be changed here (05).
- Logbook link to Medhanta LEAD for stops (breakdowns, cleaning, maintenance), and MTBF/MTTR from LEAD when linked (not linked in this demo).
- The old Batchwright link is retired; its earlier rows stay readable as history.

## Recording by hand (sites or machines without a link)
- Stop form with reasons from a fixed list; breakdowns get a type and a note (12).
- Run form: machine, product, batch, step, times, good and reject counts (13, 14).
- Parameter values per batch, with out-of-range values flagged at once (15, 16).
- CSV import of runs, stops or values: check first, plain problems per line, only good rows saved (17, 18).
- Corrections with a reason; old and new values go to the audit trail (19, 20).

## OEE and losses
- Overview: OEE = availability × performance × quality, plus TEEP (OEE over all calendar time); today, 7, 30 or 90 days; trend by day, week or month (21, 23, 24).
- Per-machine table with plain checks (no planned hours, totals that do not add up) (22).
- Losses in hours, largest first, by type (25); drill into the stops (26).
- MTTR and MTBF per machine and breakdown type, same definition as Medhanta LEAD (26).

## Process parameters
- Per product and step: batches, mean, Cp, Cpk, Pp, Ppk, out-of-trend and outside-range counts (27).
- Individuals and moving-range charts with approved range and control limits (28).
- Nelson's eight run rules (new; replace Western Electric), each explained in plain words (29).
- Best-batch comparison: best batches against the others and the most recent ones (30).

## Machine-learning insights (advisory)
- Smart suggestions: best settings for OEE or yield, always inside the approved range, with reasons and similar past batches; used only when better than simple methods (31, 32).
- Golden-batch monitoring (PCA, T² and Q) with flagged batches and their main parameters (33, 34).
- QA keeps a batch out of the golden reference with a reason, and can put it back (35, 36).
- Settings and outcomes (PLS) with what-if; outside the range it says "needs change control" (37, 38).
- Next-run forecast of rejects and speed, with reasons (39).
- Breakdown risk per machine type, honest when not better than the standard MTBF figure (40).
- Model register: every trained version frozen with its data and test results (55).

## CPV: continued process verification (new, 20–21 Nov)
- CPV plan per product: review frequency and VMP / change-control note; QA with the CPV right only (41).
- Plan items picked, never typed: parameters set up here, TrueBatch step readings, TrueBatch batch yield, time at a step, and QC tests from Medhanta QLIMS (listed with QLIMS's own out-of-trend answer; not linked in this demo) (42, 43).
- Overview of all plan items with problem rows highlighted (44).
- Check set per item: individuals chart with Nelson rules, histogram with limits, normal probability plot, Cp/Cpk/Pp/Ppk, expected and observed PPM, Shapiro-Wilk and Anderson-Darling tests, Box-Cox when needed (45, 46).
- Plain summary: stable? capable? normal? within specification? out of trend? each with its rule (46).
- Product overview page per product (new in the 21 Nov round), with its own PDF (47, 48).
- Send to DIVE: QA's choice per batch, with a note; published for Medhanta DIVE to file as a deviation, never automatic (49, 50).
- Periodic CPV report signed by QA with re-authentication at Medhanta core; figures frozen with a hash; the one signed record of RISE; PDF (51–53). Signed reports are published for Medhanta ASSURE's annual product review.
- Running-batch scoring (new in the 21 Nov round): batches still in production scored against the golden model step by step, with expected finish and yield; "too few batches" when there is not enough history; published for the TrueBatch batch screens (52, 54).

## Records and exports
- Audit trail of every change, signal and signature: who, when, before, after, reason (56).
- Every table: Download CSV and Print / PDF, with the working-copy footer (58).
