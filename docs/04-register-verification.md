# Register verification (draft 1 → draft 2), 2 Nov 2026

**Method.** (1) Program: `scripts/check-register.py` checks every cited clause exists in the official text and contains the quoted words: draft 1 29/29, draft 2 **36/36**. (2) One independent AI verifier read every rule against the texts (meaning, adequacy, over-engineering, gaps). Every finding is listed with what draft 2 does. Nothing silently fixed.

| Rule | Finding | Draft 2 |
|---|---|---|
| PL-02 | 11.10(e) applies to predicate-rule records; register is not one. | 11.10(e) kept only as support; A11 12.3 carries the rule. |
| PL-03 | 11.100(b) identity verification missing. | Added: "identity verified by / how" at employee creation. |
| PL-04 | 11.300(c) controlled reset missing; on-screen alert may not be "immediate and urgent" (11.300(d)). | Temporary password changed at first use. Alert stays on-screen per Logbook D-10; **email to security contact put to the owner**. |
| PL-05/PL-04 | 11.200(a)(3): admins must not be able to sign as someone else. | Admins never know a usable password (temporary + forced change). |
| PL-06 | A11 9 "convertible to a generally intelligible form" and "regularly reviewed" missing. | Print/CSV export; review added to CP-03. |
| PL-08 | read_at not required by any clause. | Kept as the existing products' convention, stated as not a compliance rule. |
| PL-09 | A11 4.3 also asks for physical/logical arrangements and security measures. | Fixed architecture + security section in the install guide. |
| PL-10 | SchM 20.8 covers hardware, software, any critical component, not only config. Auto-rollback is not a clause. 11.10(k)(2) is documentation only. | Rule covers releases and infrastructure (change log file); rollback stated as design choice; 11.10(k) removed. |
| PL-11 | **Nightly backup can lose up to a day (SchM 20.9 "no permanent loss"); 211.68(b) "secure from alteration, inadvertent erasures, or loss".** | WAL archiving + nightly base backup to append-only off-server storage (point-in-time restore); config repo and SOPS keys backed up too. |
| PL-12 | 11.300(b) is about ID/password issuance, not role review. | Now A11 11 and A11 2. |
| new | A11 4.8 migration checks missing. | **PL-13**: data-moving migrations ship row-count + checksum checks; _v2 views compared with _v1. |
| CP-01 | A11 1 documented risk assessment, SchM 20.2 IQ/OQ, A11 4.5 supplier QMS missing. | Added (owner supplies templates and evidence). |
| CP-06 | A11 3.2 risk-based supplier audit. | Added; disk protection moved here. |
| CP-07 | SchM 20.10 only permits. | Now SchM 20.5 + A11 16. |
| N/A A11 6 | Only while no master-data field is critical. | Condition recorded; goes into the risk assessment. |

Confirmed OK by the verifier: PL-01, PL-07, CP-02, CP-04, CP-05, server UTC time stamps, dropped MFA / master-data approval signatures / read logging / local copies.
