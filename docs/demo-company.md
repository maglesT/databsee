# Demo company (DEMO-ONLY)

**Demo Pharma Pvt Ltd, Unit 1** is a fictional tablet plant in India. We use it to test the live platform before
go-live. Every person, company, make and serial number in it is invented. The data lives in
`customers/demo.seed.yaml` and is loaded by `deploy/seed-demo.ts`. Tests: `test/demo-seed.test.ts`.

This page lists the stable logins and item codes. Product move scripts can use them for their own demo records
(logbook entries, lots, deviations and so on), which are not part of this seed.

## Loading it

1. Install a demo server like any customer: a `customers/demo.yaml` with `customer: demo`, every product licensed
   with its links (see `customers/example.yaml`), its secrets, and one apply.
   - This file is not committed yet. A committed customer config is applied by `.github/workflows/apply.yml`, so it
     is added once the demo server and its secrets exist.
2. On the server, as the installer (PG* env, superuser): `tsx deploy/seed-demo.ts customers/demo.yaml`.

**What the seed writes.** It writes only what the core screens write, into the same insert-only tables:
- employees with versions, credentials and a credential event
- permission grants
- items with versions
- link events

Every row has who = `demo seed` and why = `demo seed (DEMO-ONLY ...)`. Master-data rows record `it.admin` as the
changing employee. A second run writes nothing.

**Where it refuses to run.**
- Any customer other than `demo`.
- An identity database that holds anyone the seed did not create (a real installation).
- A permission code that is not in the catalogue (apply was not run, or a manifest changed).

**Demo password** (every person): `Demo-Tablets-2026`. It is stored only as a scrypt hash, like any password. It is
DEMO-ONLY and is never used for a real customer.

## Edge cases to test

| Case | Who / what |
|---|---|
| Deactivated person (version 2, inactive) | `prod.op3` |
| Temporary password, must change at first sign-on | `qc.analyst2` |
| QA person holding admin and signing codes (D-30) | `qa.head` |
| No product access (core sign-on only) | `admin.office` |
| Identity administrators (`core.people.manage`) | `it.admin`, `qa.head` |
| Master-data editors (`core.masterdata.edit`) | `it.admin`, `eng.head` |
| Retired equipment (version 2, inactive) | `EQ-CTG-02` |
| Inactive supplier (still linked to `EXC-TAL`) | `SUP-10` |
| Codes nobody holds (no sterile area in a tablet plant) | `logbook.entry.record_sterile`, `logbook.entry.record_steriliser_test` |

The products `FG-RAB20`, `FG-LIB400` and `FG-LIB250` are Batchwright's tablets: rabeprazole and the two invented
Libtab library tablets.

## People (22)

Permission codes are the current codes from `apps/*/manifest.json`, plus `core.*`. A product registered later (e.g. Operations) adds its people's codes in
`customers/demo.seed.yaml` and in this table, and the seed's next run grants them. Email is `<login>@demo-pharma.example`.

| Login | Name | Department | Note | Permission codes |
|---|---|---|---|---|
| `it.admin` | Arjun Mehta | IT |  | `core.people.manage`, `core.masterdata.edit`, `core.masterdata.view` |
| `qa.head` | Kavita Rao | QA | D-30: admin + signing codes | `core.people.manage`, `core.masterdata.view`, `logbook.review.read`, `logbook.review.sign`, `logbook.settings.approve`, `logbook.audit.read`, `mms.source.approve`, `mms.lot.disposition`, `mms.fg.release`, `mms.audit.read`, `mms.audit.review`, `deviations.deviation.classify`, `deviations.deviation.approve`, `deviations.deviation.close`, `deviations.capa.verify`, `deviations.qa.oversee`, `deviations.audit.read`, `qms.qa.sign`, `qms.audit.read`, `qual.protocol.approve`, `qual.report.approve`, `qual.audit.read` |
| `qa.officer1` | Rahul Nair | QA |  | `core.masterdata.view`, `logbook.entry.verify`, `logbook.review.read`, `logbook.audit.read`, `mms.count.approve`, `mms.disposal.approve`, `mms.return.decide`, `mms.lot.correct`, `mms.audit.read`, `mms.audit.review`, `mms.settings.manage`, `deviations.deviation.report`, `deviations.deviation.classify`, `deviations.qa.oversee`, `deviations.capa.raise`, `deviations.audit.read`, `deviations.settings.manage`, `qms.record.work`, `qms.qa.sign`, `qms.audit.read` |
| `qa.officer2` | Sneha Kulkarni | QA (validation) |  | `qual.item.edit`, `qual.item.status`, `qual.protocol.write`, `qual.discrepancy.write`, `qual.discrepancy.close`, `qual.results.review`, `qual.report.write`, `qual.audit.read`, `qual.alerts.manage`, `qual.settings.manage`, `deviations.deviation.report`, `deviations.investigation.write`, `qms.record.work` |
| `qa.ap` | Suresh Iyer | QA (authorised person) |  | `qms.ap.sign`, `qms.qa.sign`, `qms.audit.read`, `mms.fg.release`, `mms.lot.disposition`, `logbook.review.read` |
| `prod.head` | Vikram Singh | Production |  | `logbook.review.read`, `logbook.review.sign`, `logbook.breakdown.release`, `logbook.settings.draft`, `logbook.entry.correct_others`, `logbook.entry.verify`, `deviations.deviation.report`, `deviations.investigation.write`, `deviations.capa.complete`, `mms.issue.confirm`, `mms.fg.handover`, `qms.record.work`, `recruitment.requisition.raise`, `recruitment.department.read`, `recruitment.offer.approve`, `recruitment.interview.feedback` |
| `prod.sup1` | Anil Patil | Production (granulation, compression) |  | `logbook.entry.record_use`, `logbook.entry.record_cleaning`, `logbook.entry.record_general`, `logbook.entry.verify`, `logbook.entry.correct_others`, `logbook.voice_note.record`, `deviations.deviation.report`, `deviations.capa.complete`, `mms.issue.confirm` |
| `prod.sup2` | Meena Joshi | Production (coating, packing) |  | `logbook.entry.record_use`, `logbook.entry.record_cleaning`, `logbook.entry.record_general`, `logbook.entry.verify`, `logbook.entry.correct_others`, `logbook.voice_note.record`, `deviations.deviation.report`, `deviations.capa.complete`, `mms.issue.confirm`, `mms.fg.handover` |
| `prod.op1` | Ramesh Yadav | Production (operator) |  | `logbook.entry.record_use`, `logbook.entry.record_cleaning`, `logbook.entry.record_general`, `logbook.voice_note.record`, `deviations.deviation.report` |
| `prod.op2` | Sunita Devi | Production (packing operator) |  | `logbook.entry.record_use`, `logbook.entry.record_cleaning`, `logbook.entry.record_general`, `logbook.voice_note.record`, `deviations.deviation.report` |
| `prod.op3` | Mohan Lal | Production (operator) | deactivated | `logbook.entry.record_use`, `logbook.entry.record_cleaning`, `logbook.entry.record_general`, `deviations.deviation.report` |
| `qc.head` | Priya Menon | QC |  | `mms.lot.sample`, `mms.lot.test`, `logbook.entry.verify`, `logbook.entry.record_calibration`, `logbook.review.read`, `deviations.deviation.report`, `deviations.investigation.write`, `deviations.capa.complete`, `qual.run.execute`, `recruitment.requisition.raise`, `recruitment.department.read`, `recruitment.offer.approve`, `recruitment.interview.feedback` |
| `qc.analyst1` | Deepak Sharma | QC |  | `mms.lot.sample`, `mms.lot.test`, `logbook.entry.record_use`, `logbook.entry.record_cleaning`, `logbook.entry.record_calibration`, `deviations.deviation.report`, `qual.run.execute` |
| `qc.analyst2` | Farah Khan | QC (new joiner) | temporary password (must change) | `mms.lot.sample`, `logbook.entry.record_use`, `logbook.entry.record_cleaning`, `deviations.deviation.report` |
| `stores.head` | Manoj Gupta | Stores |  | `mms.receipt.record`, `mms.stock.manage`, `mms.issue.dispense`, `mms.disposal.record`, `mms.fg.receive`, `mms.fg.dispatch`, `logbook.entry.record_cleaning`, `logbook.entry.record_general`, `deviations.deviation.report` |
| `stores.asst` | Ravi Kumar | Stores |  | `mms.receipt.record`, `mms.stock.manage`, `mms.issue.dispense`, `mms.fg.dispatch`, `logbook.entry.record_cleaning` |
| `eng.head` | Sanjay Deshmukh | Engineering |  | `core.masterdata.edit`, `core.masterdata.view`, `logbook.entry.record_maintenance`, `logbook.entry.record_calibration`, `logbook.site.manage`, `logbook.advice.ask`, `logbook.review.read`, `qual.item.edit`, `qual.run.execute`, `deviations.deviation.report`, `deviations.investigation.write`, `deviations.capa.complete` |
| `eng.tech` | Imran Shaikh | Engineering |  | `logbook.entry.record_maintenance`, `logbook.entry.record_calibration`, `logbook.entry.record_general`, `logbook.advice.ask`, `logbook.voice_note.record`, `qual.run.execute` |
| `purchase.mgr` | Neha Agarwal | Purchase |  | `mms.po.manage`, `mms.source.edit`, `core.masterdata.view`, `qms.record.work` |
| `hr.mgr` | Pooja Bhatia | HR |  | `recruitment.requisition.approve`, `recruitment.candidate.manage`, `recruitment.test.manage`, `recruitment.interview.manage`, `recruitment.offer.manage`, `recruitment.offer.approve`, `recruitment.request.manage`, `recruitment.settings.manage`, `recruitment.accesslog.read` |
| `hr.exec` | Amit Verma | HR |  | `recruitment.candidate.manage`, `recruitment.test.manage`, `recruitment.interview.manage` |
| `admin.office` | Lakshmi Pillai | Administration | no product access | (none) |

## Master data

Links: equipment and instruments `located_in` their room, materials `supplied_by` their suppliers, products `uses` their materials.

### Room (12)

| Code | Name | Area | Grade | Note |
|---|---|---|---|---|
| `RM-101` | Dispensing booth | Dispensing | D |  |
| `RM-102` | Sampling booth | Warehouse | D |  |
| `RM-103` | Granulation room 1 | Granulation | D |  |
| `RM-104` | Granulation room 2 and blending | Granulation | D |  |
| `RM-105` | Compression room 1 | Compression | D |  |
| `RM-106` | Compression room 2 | Compression | D |  |
| `RM-107` | Coating room | Coating | D |  |
| `RM-108` | Primary packing (blister and strip) | Packing | D |  |
| `RM-109` | Secondary packing hall | Packing | CNC |  |
| `RM-110` | QC instrument laboratory | QC | CNC |  |
| `RM-111` | Raw and packing material warehouse | Warehouse | CNC |  |
| `RM-112` | Utilities block | Utilities | CNC |  |

### Equipment (25)

| Code | Name | Type | Room | Note |
|---|---|---|---|---|
| `EQ-LAF-01` | Dispensing laminar air flow | Dispensing booth | `RM-101` |  |
| `EQ-SFT-01` | Vibro sifter 30 inch | Sifter | `RM-103` |  |
| `EQ-RMG-01` | Rapid mixer granulator 150 L | Granulator | `RM-103` |  |
| `EQ-FBD-01` | Fluid bed dryer 60 kg | Dryer | `RM-103` |  |
| `EQ-MLT-01` | Multimill | Mill | `RM-103` |  |
| `EQ-RMG-02` | Rapid mixer granulator 300 L | Granulator | `RM-104` |  |
| `EQ-FBD-02` | Fluid bed dryer 120 kg | Dryer | `RM-104` |  |
| `EQ-RC-01` | Roller compactor | Roller compactor | `RM-104` |  |
| `EQ-OBL-01` | Octagonal blender 500 L | Blender | `RM-104` |  |
| `EQ-BIN-01` | IPC bin blender 600 L | Blender | `RM-104` |  |
| `EQ-CMP-01` | Rotary tablet press 27 station | Tablet press | `RM-105` |  |
| `EQ-DDM-01` | Deduster with metal detector | Deduster | `RM-105` |  |
| `EQ-CMP-02` | Rotary tablet press 37 station | Tablet press | `RM-106` |  |
| `EQ-CMP-03` | Rotary tablet press 45 station (bilayer) | Tablet press | `RM-106` |  |
| `EQ-CTG-01` | Auto coater 48 inch | Coater | `RM-107` |  |
| `EQ-CTG-02` | Auto coater 36 inch | Coater | `RM-107` | retired / inactive |
| `EQ-SPV-01` | Coating solution preparation vessel 200 L | Vessel | `RM-107` |  |
| `EQ-BLS-01` | Blister packing machine | Blister packer | `RM-108` |  |
| `EQ-STP-01` | Strip packing machine | Strip packer | `RM-108` |  |
| `EQ-CRT-01` | Cartonator | Cartoner | `RM-109` |  |
| `EQ-CKW-01` | Check weigher | Check weigher | `RM-109` |  |
| `EQ-STB-01` | Stability chamber 25 C / 60 % RH | Stability chamber | `RM-110` |  |
| `EQ-PWS-01` | Purified water generation system | Water system | `RM-112` |  |
| `EQ-AHU-01` | Air handling unit (granulation and compression) | AHU | `RM-112` |  |
| `EQ-CAS-01` | Compressed air system | Compressor | `RM-112` |  |

### Instrument (15)

| Code | Name | Type | Room | Note |
|---|---|---|---|---|
| `IN-BAL-01` | Analytical balance 220 g | Balance | `RM-110` |  |
| `IN-BAL-02` | Semi-micro balance 120 g | Balance | `RM-110` |  |
| `IN-BAL-03` | Platform balance 300 kg | Balance | `RM-101` |  |
| `IN-BAL-04` | Precision balance 6 kg | Balance | `RM-101` |  |
| `IN-BAL-05` | IPC balance (tablet weight) | Balance | `RM-105` |  |
| `IN-LOD-01` | Moisture analyser (IR) | Moisture analyser | `RM-103` |  |
| `IN-HT-01` | Tablet hardness tester | Hardness tester | `RM-105` |  |
| `IN-FRI-01` | Friabilator | Friabilator | `RM-105` |  |
| `IN-DT-01` | Disintegration tester | Disintegration tester | `RM-110` |  |
| `IN-DIS-01` | Dissolution apparatus 8 station | Dissolution apparatus | `RM-110` |  |
| `IN-HPLC-01` | HPLC system 1 | HPLC | `RM-110` |  |
| `IN-HPLC-02` | HPLC system 2 | HPLC | `RM-110` |  |
| `IN-UV-01` | UV-visible spectrophotometer | Spectrophotometer | `RM-110` |  |
| `IN-KF-01` | Karl Fischer titrator | Titrator | `RM-110` |  |
| `IN-PH-01` | pH meter | pH meter | `RM-110` |  |

### Supplier (10)

| Code | Name | Address | Note |
|---|---|---|---|
| `SUP-01` | Sahyadri Demo Actives Pvt Ltd | Plot 12, Demo Industrial Area, Hyderabad, Telangana |  |
| `SUP-02` | Narmada Demo Pharma Chem Ltd | Plot 4, Demo GIDC Estate, Ankleshwar, Gujarat |  |
| `SUP-03` | Aravalli Demo Excipients Pvt Ltd | Unit 7, Demo Estate, Vadodara, Gujarat |  |
| `SUP-04` | Konkan Demo Polymers Pvt Ltd | Gala 21, Demo Industrial Estate, Thane, Maharashtra |  |
| `SUP-05` | Kaveri Demo Starch Products Ltd | Plot 3, Demo Phase 2, Bengaluru, Karnataka |  |
| `SUP-06` | Indus Demo Foils Pvt Ltd | Survey 55, Demo Road, Daman |  |
| `SUP-07` | Ganga Demo Films Ltd | Sector 80, Demo Zone, Noida, Uttar Pradesh |  |
| `SUP-08` | Vindhya Demo Cartons Pvt Ltd | Plot 9, Demo MIDC, Pune, Maharashtra |  |
| `SUP-09` | Godavari Demo Labs Pvt Ltd | Plot 30, Demo Pharma City, Visakhapatnam, Andhra Pradesh |  |
| `SUP-10` | Malabar Demo Traders | Demo Market Road, Kochi, Kerala | retired / inactive |

### Material (40)

| Code | Name | Category, unit | Suppliers | Note |
|---|---|---|---|---|
| `API-RAB` | Rabeprazole sodium | starting, kg | SUP-01 |  |
| `API-LIB` | Libtabine (fictional active of Libtab) | starting, kg | SUP-09 |  |
| `API-PCM` | Paracetamol | starting, kg | SUP-02 |  |
| `API-MET` | Metformin hydrochloride | starting, kg | SUP-02, SUP-09 |  |
| `API-ATV` | Atorvastatin calcium | starting, kg | SUP-01 |  |
| `API-AML` | Amlodipine besilate | starting, kg | SUP-09 |  |
| `API-CTZ` | Cetirizine dihydrochloride | starting, kg | SUP-01 |  |
| `EXC-MCC101` | Microcrystalline cellulose PH101 | starting, kg | SUP-03 |  |
| `EXC-MCC102` | Microcrystalline cellulose PH102 | starting, kg | SUP-03 |  |
| `EXC-LAC` | Lactose monohydrate | starting, kg | SUP-03 |  |
| `EXC-MAN` | Mannitol | starting, kg | SUP-03 |  |
| `EXC-DCP` | Dibasic calcium phosphate | starting, kg | SUP-03 |  |
| `EXC-STA` | Maize starch | starting, kg | SUP-05 |  |
| `EXC-PGS` | Pregelatinised starch | starting, kg | SUP-05 |  |
| `EXC-PVP` | Povidone K30 | starting, kg | SUP-04 |  |
| `EXC-HPC` | Hydroxypropyl cellulose | starting, kg | SUP-04 |  |
| `EXC-CCS` | Croscarmellose sodium | starting, kg | SUP-03 |  |
| `EXC-SSG` | Sodium starch glycolate | starting, kg | SUP-05 |  |
| `EXC-CPV` | Crospovidone | starting, kg | SUP-04 |  |
| `EXC-MGS` | Magnesium stearate | starting, kg | SUP-03 |  |
| `EXC-TAL` | Purified talc | starting, kg | SUP-03, SUP-10 |  |
| `EXC-SIO` | Colloidal silicon dioxide | starting, kg | SUP-03 |  |
| `EXC-MGO` | Heavy magnesium oxide | starting, kg | SUP-03 |  |
| `EXC-HPMC` | Hypromellose E5 | starting, kg | SUP-04 |  |
| `EXC-MAC` | Methacrylic acid copolymer type C (enteric) | starting, kg | SUP-04 |  |
| `EXC-TEC` | Triethyl citrate | starting, kg | SUP-04 |  |
| `EXC-FCW` | Film-coating premix white | starting, kg | SUP-04 |  |
| `EXC-FCY` | Film-coating premix yellow | starting, kg | SUP-04 |  |
| `EXC-IOX` | Iron oxide yellow | starting, kg | SUP-04 |  |
| `SOL-IPA` | Isopropyl alcohol | other, L | SUP-02 |  |
| `PKG-ALU-BL` | Aluminium blister foil 25 micron | packaging, kg | SUP-06 |  |
| `PKG-ALU-CF` | Cold-form aluminium laminate (alu-alu) | packaging, kg | SUP-06 |  |
| `PKG-ALU-ST` | Aluminium strip foil 40 micron | packaging, kg | SUP-06 |  |
| `PKG-PVC` | PVC film 250 micron | packaging, kg | SUP-07 |  |
| `PKG-PVDC` | PVC/PVdC film 250/60 | packaging, kg | SUP-07 |  |
| `PKG-CTN-RAB` | Carton Rabeprazole 20 mg 10 x 10 | packaging, nos | SUP-08 |  |
| `PKG-CTN-LIB` | Carton Libtab 10 x 10 | packaging, nos | SUP-08 |  |
| `PKG-CTN-GEN` | Carton general 10 x 10 | packaging, nos | SUP-08 |  |
| `PKG-LFT` | Patient leaflet | packaging, nos | SUP-08 |  |
| `PKG-SHP` | Shipper carton 5 ply | packaging, nos | SUP-08 |  |

### Product (8)

| Code | Name | Strength, form | Uses | Note |
|---|---|---|---|---|
| `FG-RAB20` | Rabeprazole sodium gastro-resistant tablets 20 mg | 20 mg, Gastro-resistant tablet | API-RAB, EXC-MAN, EXC-MGO, EXC-HPC, EXC-CPV, EXC-MGS, EXC-HPMC, EXC-MAC, EXC-TEC, EXC-TAL, EXC-IOX, PKG-ALU-CF, PKG-CTN-RAB, PKG-LFT, PKG-SHP |  |
| `FG-LIB400` | Libtab film-coated tablets 400 mg | 400 mg, Film-coated tablet | API-LIB, EXC-MCC101, EXC-STA, EXC-PVP, EXC-CCS, EXC-MGS, EXC-FCW, PKG-ALU-BL, PKG-PVDC, PKG-CTN-LIB, PKG-SHP |  |
| `FG-LIB250` | Libtab tablets 250 mg | 250 mg, Tablet | API-LIB, EXC-MCC102, EXC-DCP, EXC-CCS, EXC-SIO, EXC-MGS, PKG-ALU-ST, PKG-CTN-LIB, PKG-SHP |  |
| `FG-PCM500` | Paracetamol tablets 500 mg | 500 mg, Tablet | API-PCM, EXC-STA, EXC-PGS, EXC-PVP, EXC-SSG, EXC-TAL, EXC-MGS, PKG-ALU-ST, PKG-CTN-GEN, PKG-SHP |  |
| `FG-MET500` | Metformin hydrochloride film-coated tablets 500 mg | 500 mg, Film-coated tablet | API-MET, EXC-PVP, EXC-MCC101, EXC-MGS, EXC-FCW, SOL-IPA, PKG-ALU-BL, PKG-PVC, PKG-CTN-GEN, PKG-SHP |  |
| `FG-ATV10` | Atorvastatin calcium film-coated tablets 10 mg | 10 mg, Film-coated tablet | API-ATV, EXC-LAC, EXC-MCC102, EXC-CCS, EXC-HPC, EXC-MGS, EXC-FCW, PKG-ALU-CF, PKG-CTN-GEN, PKG-LFT, PKG-SHP |  |
| `FG-AML5` | Amlodipine tablets 5 mg | 5 mg, Tablet | API-AML, EXC-MCC102, EXC-DCP, EXC-SSG, EXC-MGS, PKG-ALU-BL, PKG-PVC, PKG-CTN-GEN, PKG-SHP |  |
| `FG-CTZ10` | Cetirizine dihydrochloride film-coated tablets 10 mg | 10 mg, Film-coated tablet | API-CTZ, EXC-LAC, EXC-MCC101, EXC-SIO, EXC-MGS, EXC-FCY, PKG-ALU-BL, PKG-PVC, PKG-CTN-GEN, PKG-SHP |  |
