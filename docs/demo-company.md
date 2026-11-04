# Demo company (DEMO-ONLY)

**Demo Pharma Pvt Ltd, Unit 1** is a fictional tablet plant in India. We use it to test the live platform before
go-live. Every person, company, make and serial number in it is invented. The data lives in
`deploy/demo.seed.yaml` and is loaded by `deploy/seed-demo.ts`. Tests: `test/demo-seed.test.ts`.

This page lists the stable logins and item codes. Product move scripts can use them for their own demo records
(logbook entries, lots, deviations and so on), which are not part of this seed.

## Loading it

1. Install a demo server like any customer: a `customers/demo.yaml` with `customer: demo`, every product licensed
   with its links (see `customers/example.yaml`), its secrets, and one apply.
   - This file is not committed yet. A committed customer config is applied by `.github/workflows/apply.yml`, so it
     is added once the demo server and its secrets exist.
2. On the server, as the installer (PG* env, superuser), instead of `create-first-admin`:
   `tsx deploy/seed-demo.ts customers/demo.yaml`. `it.admin` is the identity administrator.

**What the seed writes.** It writes into the same insert-only tables the core screens use:
- employees with versions, credentials and a credential event
- permission grants
- items with versions
- link events

Every row has who = `demo seed` and why = `demo seed (DEMO-ONLY ...)`. Master-data rows record `it.admin` as the
changing employee. Unlike a person added in the screens, demo people start with a non-temporary password (except
`qc.analyst2`), so testers can sign on at once.

Each event is written only if the seed never wrote it before. A second run writes nothing, and a later run never
undoes what was changed in the screens (a person reactivated, a grant revoked, an item moved or reactivated). A run
after the seed file gains a person, code or item adds just that.

**Where it refuses to run.**
- Any customer other than `demo`.
- An identity database that holds people but none of the seed's (a real installation, or a first admin made
  before the seed).
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
| Batchwright administration codes only, no GMP codes (its INV-11) | `it.admin` |
| Codes nobody holds (no sterile area in a tablet plant) | `logbook.entry.record_sterile`, `logbook.entry.record_steriliser_test` |

The products `FG-RAB20`, `FG-LIB400` and `FG-LIB250` are Batchwright's tablets: rabeprazole and the two invented
Libtab library tablets.

Batchwright's `ebmr.*` codes follow its old roles (ebmr `docs/build-plan/phase-b/demo-grants.md`): operators OPERATOR + DISPENSER;
supervisors SHIFT_SUPERVISOR + VERIFIER + STAGE_RESPONSIBLE + BATCH_ISSUER; `prod.head` HEAD_OF_PRODUCTION + PROCESS_OWNER +
MBR_AUTHOR; `qa.head` and `qa.ap` AUTHORISED_PERSON + QA_MBR_APPROVER; `qa.officer1` QA_SHOP_FLOOR + QA_REVIEWER; `qa.officer2`
MBR_CHECKER; QC HEAD_OF_QC / QC_ANALYST; stores WAREHOUSE_LABELLING; `eng.head` MASTER_DATA_STEWARD + MAINTENANCE_TECHNICIAN;
`eng.tech` MAINTENANCE_TECHNICIAN; `hr.mgr` TRAINING_COORDINATOR; `it.admin` SYSTEM_ADMINISTRATOR plus `ebmr.iam.device_manage` (enrols terminals; administration codes only).

## People (22)

Permission codes are the current codes from `apps/*/manifest.json`, plus `core.*`. A product registered later adds its people's codes in
`deploy/demo.seed.yaml` and in this table, and the seed's next run grants them. Email is `<login>@demo-pharma.example`. The department is
descriptive only: the platform stores no department.

| Login | Name | Department | Note | Permission codes |
|---|---|---|---|---|
| `it.admin` | Arjun Mehta | IT |  | `core.people.manage`, `core.masterdata.edit`, `core.masterdata.view`, `ebmr.continuity.alarm_acknowledge`, `ebmr.continuity.hardening_attest`, `ebmr.platform.operate`, `ebmr.platform.time_source_manage`, `ebmr.record.read`, `ebmr.support.grant_request`, `ebmr.system.configure`, `ebmr.iam.device_manage` |
| `qa.head` | Kavita Rao | QA | D-30: admin + signing codes | `core.people.manage`, `core.masterdata.view`, `logbook.review.read`, `logbook.review.sign`, `logbook.settings.approve`, `logbook.audit.read`, `mms.source.approve`, `mms.lot.disposition`, `mms.fg.release`, `mms.audit.read`, `mms.audit.review`, `deviations.deviation.classify`, `deviations.deviation.approve`, `deviations.deviation.close`, `deviations.capa.verify`, `deviations.qa.oversee`, `deviations.audit.read`, `qms.qa.sign`, `qms.audit.read`, `qual.protocol.approve`, `qual.report.approve`, `qual.audit.read`, `ops.audit.read`, `ebmr.analytics.view`, `ebmr.capa.qa_approve`, `ebmr.capa.record`, `ebmr.config.change_approve`, `ebmr.config.change_close`, `ebmr.config.change_raise`, `ebmr.controlled.approve`, `ebmr.controlled.read`, `ebmr.controlled.record`, `ebmr.controlled.register`, `ebmr.deviation.classify`, `ebmr.deviation.qa_approve`, `ebmr.erp.master_confirm`, `ebmr.evidence.store`, `ebmr.formula.approve`, `ebmr.formula.read`, `ebmr.hazard.approve`, `ebmr.hazard.record`, `ebmr.label.approve`, `ebmr.licence.approve`, `ebmr.market.policy_change`, `ebmr.material.qa_disposition`, `ebmr.mbr.approve`, `ebmr.mbr.change_record`, `ebmr.notification.acknowledge`, `ebmr.plant_rule.approve`, `ebmr.pqr.extract`, `ebmr.pqr.sign_off`, `ebmr.recall.mock_run`, `ebmr.recall.mock_sign_off`, `ebmr.record.read`, `ebmr.record.type_approve`, `ebmr.record.type_define`, `ebmr.release.disposal`, `ebmr.release.manufacturer`, `ebmr.reprocessing.authorise`, `ebmr.review.rbe_rule_change`, `ebmr.shelf_life.record`, `ebmr.support.approve_qa`, `ebmr.transfer.peer_approve`, `ebmr.validation.approve_evaluation`, `ebmr.validation.approve_summary` |
| `qa.officer1` | Rahul Nair | QA |  | `core.masterdata.view`, `logbook.entry.verify`, `logbook.review.read`, `logbook.audit.read`, `mms.count.approve`, `mms.disposal.approve`, `mms.return.decide`, `mms.lot.correct`, `mms.audit.read`, `mms.audit.review`, `mms.settings.manage`, `deviations.deviation.report`, `deviations.deviation.classify`, `deviations.qa.oversee`, `deviations.capa.raise`, `deviations.audit.read`, `deviations.settings.manage`, `qms.record.work`, `qms.qa.sign`, `qms.audit.read`, `ops.data.read`, `ops.audit.read`, `ebmr.alarm.acknowledge_gap`, `ebmr.analytics.disposition`, `ebmr.analytics.method`, `ebmr.analytics.view`, `ebmr.archive.inspect`, `ebmr.capa.qa_approve`, `ebmr.capa.record`, `ebmr.config.change_approve`, `ebmr.contingency.issue`, `ebmr.contingency.reconcile`, `ebmr.contract_giver_access.grant`, `ebmr.controlled.approve`, `ebmr.controlled.balance`, `ebmr.controlled.custody`, `ebmr.controlled.read`, `ebmr.controlled.register`, `ebmr.deviation.classify`, `ebmr.deviation.investigate`, `ebmr.deviation.qa_approve`, `ebmr.deviation.raise`, `ebmr.di_investigation.approve_closure`, `ebmr.evidence.store`, `ebmr.formula.read`, `ebmr.hazard.approve`, `ebmr.incident.cert_in_report`, `ebmr.incident.close`, `ebmr.incident.investigate`, `ebmr.incident.raise`, `ebmr.licence.approve`, `ebmr.market.policy_tighten_batch`, `ebmr.market.rule_evaluate`, `ebmr.material.qa_disposition`, `ebmr.material.release`, `ebmr.notification.acknowledge`, `ebmr.plant_rule.approve`, `ebmr.pqr.extract`, `ebmr.qa.floor_approve`, `ebmr.qp_access.grant`, `ebmr.recall.mock_run`, `ebmr.record.audit_trail_review`, `ebmr.record.disposal_approve`, `ebmr.record.legal_hold`, `ebmr.record.qa_review`, `ebmr.record.read`, `ebmr.record.retention_manage`, `ebmr.record.true_copy_register`, `ebmr.release.disposal`, `ebmr.reprocessing.authorise`, `ebmr.review.rbe_rule_change`, `ebmr.sample.dispose`, `ebmr.sample_record.approve`, `ebmr.sample_record.check`, `ebmr.sample_record.retire`, `ebmr.specification.approve`, `ebmr.step.witness`, `ebmr.transfer.peer_approve`, `ebmr.validation.approve_evaluation`, `ebmr.validation.approve_summary` |
| `qa.officer2` | Sneha Kulkarni | QA (validation) |  | `qual.item.edit`, `qual.item.status`, `qual.protocol.write`, `qual.discrepancy.write`, `qual.discrepancy.close`, `qual.results.review`, `qual.report.write`, `qual.audit.read`, `qual.alerts.manage`, `qual.settings.manage`, `deviations.deviation.report`, `deviations.investigation.write`, `qms.record.work`, `ebmr.formula.read`, `ebmr.mbr.check`, `ebmr.record.read`, `ebmr.sample_record.check` |
| `qa.ap` | Suresh Iyer | QA (authorised person) |  | `qms.ap.sign`, `qms.qa.sign`, `qms.audit.read`, `mms.fg.release`, `mms.lot.disposition`, `logbook.review.read`, `ebmr.analytics.view`, `ebmr.capa.qa_approve`, `ebmr.capa.record`, `ebmr.config.change_approve`, `ebmr.config.change_close`, `ebmr.config.change_raise`, `ebmr.controlled.approve`, `ebmr.controlled.read`, `ebmr.controlled.record`, `ebmr.controlled.register`, `ebmr.deviation.classify`, `ebmr.deviation.qa_approve`, `ebmr.erp.master_confirm`, `ebmr.evidence.store`, `ebmr.formula.approve`, `ebmr.formula.read`, `ebmr.hazard.approve`, `ebmr.hazard.record`, `ebmr.label.approve`, `ebmr.licence.approve`, `ebmr.market.policy_change`, `ebmr.material.qa_disposition`, `ebmr.mbr.approve`, `ebmr.mbr.change_record`, `ebmr.notification.acknowledge`, `ebmr.plant_rule.approve`, `ebmr.pqr.extract`, `ebmr.pqr.sign_off`, `ebmr.recall.mock_run`, `ebmr.recall.mock_sign_off`, `ebmr.record.read`, `ebmr.record.type_approve`, `ebmr.record.type_define`, `ebmr.release.disposal`, `ebmr.release.manufacturer`, `ebmr.reprocessing.authorise`, `ebmr.review.rbe_rule_change`, `ebmr.shelf_life.record`, `ebmr.support.approve_qa`, `ebmr.transfer.peer_approve`, `ebmr.validation.approve_evaluation`, `ebmr.validation.approve_summary` |
| `prod.head` | Vikram Singh | Production |  | `logbook.review.read`, `logbook.review.sign`, `logbook.breakdown.release`, `logbook.settings.draft`, `logbook.entry.correct_others`, `logbook.entry.verify`, `deviations.deviation.report`, `deviations.investigation.write`, `deviations.capa.complete`, `mms.issue.confirm`, `mms.fg.handover`, `qms.record.work`, `recruitment.requisition.raise`, `recruitment.department.read`, `recruitment.offer.approve`, `recruitment.interview.feedback`, `ops.data.read`, `ops.parameter.approve`, `ops.golden.exclude`, `ebmr.alarm.acknowledge_gap`, `ebmr.analytics.method`, `ebmr.analytics.view`, `ebmr.capa.record`, `ebmr.config.change_close`, `ebmr.config.change_raise`, `ebmr.config.system_description`, `ebmr.continuity.alarm_acknowledge`, `ebmr.deviation.raise`, `ebmr.evidence.store`, `ebmr.formula.read`, `ebmr.incident.raise`, `ebmr.label.design`, `ebmr.market.rule_evaluate`, `ebmr.mbr.author`, `ebmr.mbr.sign_prepared`, `ebmr.notification.acknowledge`, `ebmr.platform.settings_change`, `ebmr.record.production_approve`, `ebmr.record.read`, `ebmr.sample_record.submit`, `ebmr.support.approve_it`, `ebmr.system.periodic_review` |
| `prod.sup1` | Anil Patil | Production (granulation, compression) |  | `logbook.entry.record_use`, `logbook.entry.record_cleaning`, `logbook.entry.record_general`, `logbook.entry.verify`, `logbook.entry.correct_others`, `logbook.voice_note.record`, `deviations.deviation.report`, `deviations.capa.complete`, `mms.issue.confirm`, `ops.data.read`, `ops.entry.write`, `ops.entry.correct_any`, `ebmr.alarm.acknowledge`, `ebmr.batch.issue`, `ebmr.batch_number.allocate`, `ebmr.batch_number.recover`, `ebmr.batch_number.register_external`, `ebmr.batch_number.void`, `ebmr.contingency.issue`, `ebmr.contingency.reconcile`, `ebmr.continuity.counter_reserve`, `ebmr.controlled.balance`, `ebmr.controlled.custody`, `ebmr.controlled.read`, `ebmr.deviation.approve_inline`, `ebmr.deviation.raise`, `ebmr.evidence.store`, `ebmr.incident.raise`, `ebmr.market.rule_evaluate`, `ebmr.notification.acknowledge`, `ebmr.record.production_approve`, `ebmr.record.read`, `ebmr.step.supervise`, `ebmr.step.verify`, `ebmr.step.witness` |
| `prod.sup2` | Meena Joshi | Production (coating, packing) |  | `logbook.entry.record_use`, `logbook.entry.record_cleaning`, `logbook.entry.record_general`, `logbook.entry.verify`, `logbook.entry.correct_others`, `logbook.voice_note.record`, `deviations.deviation.report`, `deviations.capa.complete`, `mms.issue.confirm`, `mms.fg.handover`, `ops.data.read`, `ops.entry.write`, `ebmr.alarm.acknowledge`, `ebmr.batch.issue`, `ebmr.batch_number.allocate`, `ebmr.batch_number.recover`, `ebmr.batch_number.register_external`, `ebmr.batch_number.void`, `ebmr.contingency.issue`, `ebmr.contingency.reconcile`, `ebmr.continuity.counter_reserve`, `ebmr.controlled.balance`, `ebmr.controlled.custody`, `ebmr.controlled.read`, `ebmr.deviation.approve_inline`, `ebmr.deviation.raise`, `ebmr.evidence.store`, `ebmr.incident.raise`, `ebmr.market.rule_evaluate`, `ebmr.notification.acknowledge`, `ebmr.record.production_approve`, `ebmr.record.read`, `ebmr.step.supervise`, `ebmr.step.verify`, `ebmr.step.witness` |
| `prod.op1` | Ramesh Yadav | Production (operator) |  | `logbook.entry.record_use`, `logbook.entry.record_cleaning`, `logbook.entry.record_general`, `logbook.voice_note.record`, `deviations.deviation.report`, `ops.entry.write`, `ebmr.alarm.acknowledge`, `ebmr.contingency.reconcile`, `ebmr.controlled.custody`, `ebmr.controlled.read`, `ebmr.deviation.raise`, `ebmr.dispense.execute`, `ebmr.evidence.store`, `ebmr.incident.raise`, `ebmr.market.rule_evaluate`, `ebmr.record.read`, `ebmr.step.execute`, `ebmr.step.sign_performed` |
| `prod.op2` | Sunita Devi | Production (packing operator) |  | `logbook.entry.record_use`, `logbook.entry.record_cleaning`, `logbook.entry.record_general`, `logbook.voice_note.record`, `deviations.deviation.report`, `ops.entry.write`, `ebmr.alarm.acknowledge`, `ebmr.contingency.reconcile`, `ebmr.controlled.custody`, `ebmr.controlled.read`, `ebmr.deviation.raise`, `ebmr.dispense.execute`, `ebmr.evidence.store`, `ebmr.incident.raise`, `ebmr.market.rule_evaluate`, `ebmr.record.read`, `ebmr.step.execute`, `ebmr.step.sign_performed` |
| `prod.op3` | Mohan Lal | Production (operator) | deactivated | `logbook.entry.record_use`, `logbook.entry.record_cleaning`, `logbook.entry.record_general`, `deviations.deviation.report`, `ebmr.alarm.acknowledge`, `ebmr.contingency.reconcile`, `ebmr.controlled.custody`, `ebmr.controlled.read`, `ebmr.deviation.raise`, `ebmr.dispense.execute`, `ebmr.evidence.store`, `ebmr.incident.raise`, `ebmr.market.rule_evaluate`, `ebmr.record.read`, `ebmr.step.execute`, `ebmr.step.sign_performed` |
| `qc.head` | Priya Menon | QC |  | `mms.lot.sample`, `mms.lot.test`, `logbook.entry.verify`, `logbook.entry.record_calibration`, `logbook.review.read`, `deviations.deviation.report`, `deviations.investigation.write`, `deviations.capa.complete`, `qual.run.execute`, `recruitment.requisition.raise`, `recruitment.department.read`, `recruitment.offer.approve`, `recruitment.interview.feedback`, `ebmr.capa.record`, `ebmr.controlled.read`, `ebmr.controlled.register`, `ebmr.deviation.investigate`, `ebmr.deviation.raise`, `ebmr.evidence.store`, `ebmr.formula.read`, `ebmr.incident.raise`, `ebmr.material.release`, `ebmr.pqr.extract`, `ebmr.qc.result_approve`, `ebmr.recall.mock_run`, `ebmr.record.read`, `ebmr.sample.pull`, `ebmr.shelf_life.record`, `ebmr.specification.approve`, `ebmr.specification.draft` |
| `qc.analyst1` | Deepak Sharma | QC |  | `mms.lot.sample`, `mms.lot.test`, `logbook.entry.record_use`, `logbook.entry.record_cleaning`, `logbook.entry.record_calibration`, `deviations.deviation.report`, `qual.run.execute`, `ebmr.deviation.raise`, `ebmr.evidence.store`, `ebmr.formula.read`, `ebmr.incident.raise`, `ebmr.qc.result_record`, `ebmr.record.read`, `ebmr.sample.pull`, `ebmr.specification.draft` |
| `qc.analyst2` | Farah Khan | QC (new joiner) | temporary password (must change) | `mms.lot.sample`, `logbook.entry.record_use`, `logbook.entry.record_cleaning`, `deviations.deviation.report`, `ebmr.deviation.raise`, `ebmr.evidence.store`, `ebmr.formula.read`, `ebmr.incident.raise`, `ebmr.qc.result_record`, `ebmr.record.read`, `ebmr.sample.pull`, `ebmr.specification.draft` |
| `stores.head` | Manoj Gupta | Stores |  | `mms.receipt.record`, `mms.stock.manage`, `mms.issue.dispense`, `mms.disposal.record`, `mms.fg.receive`, `mms.fg.dispatch`, `logbook.entry.record_cleaning`, `logbook.entry.record_general`, `deviations.deviation.report`, `ebmr.controlled.custody`, `ebmr.controlled.read`, `ebmr.controlled.register`, `ebmr.deviation.raise`, `ebmr.incident.raise`, `ebmr.label_store.transact`, `ebmr.labelling.issue`, `ebmr.material.handle`, `ebmr.record.read` |
| `stores.asst` | Ravi Kumar | Stores |  | `mms.receipt.record`, `mms.stock.manage`, `mms.issue.dispense`, `mms.fg.dispatch`, `logbook.entry.record_cleaning`, `ebmr.controlled.custody`, `ebmr.controlled.read`, `ebmr.controlled.register`, `ebmr.deviation.raise`, `ebmr.incident.raise`, `ebmr.label_store.transact`, `ebmr.labelling.issue`, `ebmr.material.handle`, `ebmr.record.read` |
| `eng.head` | Sanjay Deshmukh | Engineering |  | `core.masterdata.edit`, `core.masterdata.view`, `logbook.entry.record_maintenance`, `logbook.entry.record_calibration`, `logbook.site.manage`, `logbook.advice.ask`, `logbook.review.read`, `qual.item.edit`, `qual.run.execute`, `deviations.deviation.report`, `deviations.investigation.write`, `deviations.capa.complete`, `ops.data.read`, `ops.masterdata.edit`, `ops.link.refresh`, `ops.import.run`, `ops.model.train`, `ops.site.edit`, `ebmr.batch_number.rule_define`, `ebmr.config.change_close`, `ebmr.config.change_raise`, `ebmr.formula.approve`, `ebmr.formula.manage`, `ebmr.formula.read`, `ebmr.incident.raise`, `ebmr.label.design`, `ebmr.logbook.entry`, `ebmr.logbook.sign`, `ebmr.market.rule_table_publish`, `ebmr.market.site_value_set`, `ebmr.master_data.enter`, `ebmr.masterdata.change`, `ebmr.record.read` |
| `eng.tech` | Imran Shaikh | Engineering |  | `logbook.entry.record_maintenance`, `logbook.entry.record_calibration`, `logbook.entry.record_general`, `logbook.advice.ask`, `logbook.voice_note.record`, `qual.run.execute`, `ebmr.incident.raise`, `ebmr.logbook.entry`, `ebmr.logbook.sign`, `ebmr.record.read` |
| `purchase.mgr` | Neha Agarwal | Purchase |  | `mms.po.manage`, `mms.source.edit`, `core.masterdata.view`, `qms.record.work` |
| `hr.mgr` | Pooja Bhatia | HR |  | `recruitment.requisition.approve`, `recruitment.candidate.manage`, `recruitment.test.manage`, `recruitment.interview.manage`, `recruitment.offer.manage`, `recruitment.offer.approve`, `recruitment.request.manage`, `recruitment.settings.manage`, `recruitment.accesslog.read`, `ebmr.qualification.record`, `ebmr.record.read`, `ebmr.training.manage` |
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
