# Claude Design prompt: Medhanta CLEAR feature walkthrough video

Make a **3–6 minute (target ≈ 5 min 26 s) feature-walkthrough video**, **16:9, 1920×1080**, for **Medhanta CLEAR** (Compliance Library for Evaluation and Audit Readiness): GMP audit checklists built from India's Revised Schedule M, EU GMP and US 21 CFR, with cross-references between them, and audits run on screen. It is a calm, step-by-step tutorial for plant heads, QA, production and engineering users and buyers, NOT a short ad.

What the product is: a **web app** (runs in the browser on a PC or tablet) on the Medhanta platform: one Medhanta sign-in; people, rooms, equipment and products are picked from Medhanta. Every screen in this video is a real screenshot of the app as it runs, with fictional demo data for the fictional "Medhanta Demo Plant, Unit 2".

## Brand
- Name: always **"Medhanta CLEAR"** on every title card and every caption card (caption cards are tagged "Medhanta CLEAR").
- Logo: **use the product emblem logo for Medhanta CLEAR if attached (`brand/medhanta-clear-logo.png`, the clipboard-and-tick emblem with "MEDHANTA CLEAR"); otherwise the Medhanta logo (`brand/medhanta-logo.png`)**. The CLEAR emblem comes from the product's own brand folder. Use `brand/medhanta-clear-apple-touch-icon.png` (emblem only) as a small corner watermark and caption tag. The Medhanta logo (`brand/medhanta-logo.png`) and mark (`brand/medhanta-mark.png`) appear only on the small "by Medhanta" line.
- Colours: primary **#e8500f**; gradient **`linear-gradient(90deg,#dd1a10,#f4511e 55%,#f7941d)`** for underlines and bars; grey **#5f5f5f** for text; white backgrounds. Font: **Inter**.
- See `brand/brand.md`.

## How to build it
- Use the attached real screenshots **in the order listed**, one per step. Gentle zoom (about 1.1–1.3×) towards the highlighted element; an animated cursor moves to it and clicks where the step is a click; a soft highlight ring or underline on the element.
- **Before → after pairs** (cross-fade, with the cursor clicking the button between them): 03→04, 06→07, 11→12, 13→14, 17→18, 21→22, 31→32.
- **Captions on**: one short caption per step (max ~8 words), on a small caption card tagged "Medhanta CLEAR".
- Each chapter opens with a **title card** ("Medhanta CLEAR · <chapter>", subtitle, CLEAR emblem, gradient underline), about 3 s.
- Intro title card: CLEAR emblem logo · "Medhanta CLEAR" · "Compliance Library for Evaluation and Audit Readiness" · small "by Medhanta" line.
- End card (≈ 4 s): CLEAR emblem logo centred · "Medhanta CLEAR" · "Compliance Library for Evaluation and Audit Readiness" · "by Medhanta" with the Medhanta logo · a button-style **"Book a demo"** · gradient bar.
- Tone: calm, friendly, clear; voice-over at a steady pace, plain words.

## Strict rules
- **No invented numbers, no testimonials, no customer names, no savings or results claims.** Only the figures visible on the screenshots.
- **Do not redraw, retouch or alter the UI in the screenshots.** Crop, zoom, pan, highlight and overlay only.
- Regulation text visible on screen is what the app shows; do not add any regulation text of your own. The voice-over paraphrases in plain words.
- WHO and PIC/S are cited by clause number only; never show or invent their text.
- The audit-points layer is marked "Beta" in the app; do not call it certified or expert-verified.

## Chapters
| Part | Title card | Screens | Duration |
|---|---|---|---|
| Intro | "Medhanta CLEAR" · "Compliance Library for Evaluation and Audit Readiness" | — | ≈ 14 s |
| Ch 1 | "Medhanta CLEAR · Welcome" · "One Medhanta sign-in" | 01 | ≈ 12 s |
| Ch 2 | "Medhanta CLEAR · The regulation library" · "Schedule M, EU GMP and US 21 CFR in one place" | 02–05 | ≈ 38 s |
| Ch 3 | "Medhanta CLEAR · Build your checklist" · "Markets, plant types, your own items" | 06–15 | ≈ 89 s |
| Ch 4 | "Medhanta CLEAR · Run the audit" · "Answers, findings and evidence on screen" | 16–24 | ≈ 75 s |
| Ch 5 | "Medhanta CLEAR · Readiness and reports" · "Progress, findings and exports" | 25–28 | ≈ 38 s |
| Ch 6 | "Medhanta CLEAR · Rights and closing" · "Clause-by-clause audits, roles, read-only records" | 29–33 | ≈ 46 s |
| Outro + end card | "Book a demo" | — | ≈ 14 s |

## Voice-over and captions (follow `demo-script.md`, attached; the same text is here so this prompt works on its own)

**Intro voice-over:** "Self-inspection checklists often miss what inspectors look for. Medhanta CLEAR builds your GMP audit checklist from India's Revised Schedule M, EU GMP and US 21 CFR, and runs the audit on screen."
**Intro caption:** Medhanta CLEAR: audit checklists from the GMP rules

| # | Screen | Highlight (zoom / cursor target) | Voice-over | Caption |
|---|---|---|---|---|
| | **Chapter 1: Welcome** (title card first) | | | |
| 1 | `screens/01-sign-in.png` | the orange "Sign in" button in the Medhanta CLEAR card, centre-left | Asha Rao, QA Head at our demo plant, signs in with her Medhanta login. Her rights come from Medhanta too. | One Medhanta sign-in |
| | **Chapter 2: The regulation library** (title card first) | | | |
| 2 | `screens/02-find-clause.png` | the "Find a clause" box with "quarantine", top; then the grey regulator badges in the results, centre-left | Start with the library. Type a word or a clause number, and Medhanta CLEAR finds it across Schedule M, EU GMP and US 21 CFR. Here we search for quarantine. | Find any clause in seconds |
| 3 | `screens/03-clause-crossrefs.png` | the "Also:" line under the Schedule M 12.4.4 text, centre-left | Each clause shows its text and where it sits. The Also line cross-references the same rule in EU GMP, WHO and PIC/S. | Cross-references between regulators |
| 4 | `screens/04-clause-eu-text.png` | the grey box "EU GMP Part I, Chapter 3, 3.21", centre; then the small note "WHO / PIC/S: clause number only" below it, left | Tap an EU reference to read its text right here. WHO and PIC/S are cited by clause number only. | EU text on tap; WHO, PIC/S by number |
| 5 | `screens/05-definitions.png` | the search box with "quarantine", top-left, and the EU glossary card, centre | Each regulator's definitions are one search away. | Definitions, searchable |
| | **Chapter 3: Build your checklist** (title card first) | | | |
| 6 | `screens/06-template-new.png` | the orange chip "India (Schedule M)" under "1. Markets", upper-left; the counter "348 items · 877 check points", bottom-left | Asha builds a checklist template. It starts from India's Schedule M, which always applies. | Start from Schedule M |
| 7 | `screens/07-template-markets.png` | the three orange market chips, upper-left; the plant type chips below; the counter "1080 items", bottom-left | She names it and adds EU and US export. Plant types like sterile would add their own sections; Unit 2 makes oral solids, so general GMP is enough. | Add EU and US export markets |
| 8 | `screens/08-template-points.png` | the orange chip "Audit points (question + evidence …) – Beta", top-right of "Checklist style", and the yellow "Beta" note under it; the counter "1933 audit points · 2025 lines to answer", bottom-left | She switches to audit points: plain questions, with what to verify and what evidence to ask for. Points that are only recommended carry their own badge. This layer is marked Beta. | Audit points: question, verify, evidence |
| 9 | `screens/09-template-warehouse.png` | the "Warehouse" area header, top; then the "Verify:" and "Evidence:" lines of the first card, centre | Points are grouped by area. Each card gives the question, what to verify, the evidence and the source clause. | Grouped by area, with evidence |
| 10 | `screens/10-point-clauses.png` | the opened "Schedule M 12.4.4" clause card with its marked sentence, centre | Open the clause list to see the regulation text behind a point, with the part it covers marked. | Every point traced to its clause |
| 11 | `screens/11-remove-before.png` | the reason field and the orange "Remove" button under the high-risk materials card, centre-right | Something does not apply? Remove it, but only with a reason. | Remove only with a reason |
| 12 | `screens/12-remove-after.png` | Removed (1)" with the reason in italics and the "Put back" button, lower centre | The point moves to the removed list, the reason is kept, and it can be put back. | Reason kept; put back any time |
| 13 | `screens/13-company-item-before.png` | the Company item form: title, "SOP-WH-007" and the question, centre | Asha adds a company item from her own procedure: warehouse temperature mapping. | Add your own company items |
| 14 | `screens/14-company-item-after.png` | Saved ✓" and the "Save template" button, top-right; the company item card "SOP-WH-007", centre | She saves the template. The regulation text stays locked; only her own items can be edited. | Regulation text stays locked |
| 15 | `screens/15-templates.png` | the row "Unit 2 – oral solids, India + EU + US export" and its orange "Start audit" button, right | Templates are reused for every audit: start, copy or edit them here. Two earlier templates are already in the list. | Reusable audit templates |
| | **Chapter 4: Run the audit** (title card first) | | | |
| 16 | `screens/16-audit-new.png` | the audit name, the site "Medhanta Demo Plant, Unit 2" and the date fields, top | Asha starts the warehouse self-inspection. The site comes from Medhanta, and the markets come from the template. | Start an audit from a template |
| 17 | `screens/17-audit-pick-before.png` | the Auditors field with "Kir" typed and the suggestion "Kiran Desai", left | Auditors and auditees are picked from Medhanta's employee list, not typed. | Pick people from Medhanta |
| 18 | `screens/18-audit-team.png` | the orange name chips under Auditors, Auditees and Rooms, centre; "Saved ✓", right | The team and the rooms audited are set, and every change saves itself. | Team and rooms, saved automatically |
| 19 | `screens/19-audit-warehouse.png` | the "Warehouse 0/88 answered" header, top; the Compliant / Not compliant / N/A buttons, lower-left | In the warehouse, each point waits for an answer: Compliant, Not compliant, or not applicable. | Answer point by point |
| 20 | `screens/20-audit-compliant.png` | the green "Compliant" buttons, left; the counter "Compliant/Yes 2", top-left | Storage space and storage conditions look right, so they are marked Compliant, with a short observation. | Compliant, with observations |
| 21 | `screens/21-finding-before.png` | the red "Not compliant" button, the dropdown "Grade… (suggested: major)" and the observation text, centre | Here is a finding: two temperature excursions in the warehouse were never raised as deviations. Medhanta CLEAR suggests a grade, and the observation holds the evidence. | Record a finding with evidence |
| 22 | `screens/22-finding-after.png` | the "major" dropdown and the "Names:" chips "RM-WH-101" and "EQ-AHU-07", centre-left | Asha grades it major and names the room and the air handling unit, picked from Medhanta master data. | Grade it; name room and equipment |
| 23 | `screens/23-audit-company-item.png` | the company item card "SOP-WH-007" answered Compliant, centre; "88/88 answered", right | Company items are answered just like regulation points. The warehouse is now fully answered. | Your own items, in the same audit |
| 24 | `screens/24-filter-findings.png` | the filter "Answered Not compliant / No", top-left; the counter "(1 major, 1 other)", top | One filter lists only the findings, and the counter shows them by grade: one major, one other. Before the real inspection, this is your to-do list. | Findings at a glance, by grade |
| | **Chapter 5: Readiness and reports** (title card first) | | | |
| 25 | `screens/25-audits-list.png` | the green progress bars and "Not compliant: 2" lines, centre | On the home page, every audit shows its progress, its status and its number of findings. Open, Excel, PDF and Print are one click away. | Progress and findings per audit |
| 26 | `screens/26-report-summary.png` | the summary line "Compliant/Yes 85 · Not compliant/No 2 · N/A 1", centre; the "Download PDF" button, top-left | The report view sums it up: who audited, which rooms and markets, and the answer counts. | The audit report, summed up |
| 27 | `screens/27-report-warehouse.png` | the "Not compliant (major)" cell and the observation column, centre-right | Each line shows its reference, the point, the answer with its grade, and the observation. | Every answer with its reference |
| 28 | `screens/28-pdf-report.png` | the left page header "Self-inspection – Warehouse, EU + US export readiness", left; the red "Not compliant" lines on the right page, right | Download it as a page-numbered PDF, with removed items and their reasons at the end. There is an Excel export too. | PDF and Excel exports |
| | **Chapter 6: Clause by clause, rights and closing** (title card first) | | | |
| 29 | `screens/29-clause-audit.png` | the Yes / No / N/A rows of "Schedule M 14.38" and the red "No" with its note, centre | Prefer the regulation's own words? A clause-by-clause template asks Yes, No or not applicable for each sentence, like Kiran's QC laboratory check. | Or audit clause by clause |
| 30 | `screens/30-rights-auditor.png` | the list "Your rights in Medhanta CLEAR", centre | Rights are set in Medhanta. Kiran can see and perform audits, but cannot change templates. | Rights set in Medhanta |
| 31 | `screens/31-close-before.png` | the "Close audit" button, top-right | When the walk-through is done, Dr. Meera Joshi, the plant head, reviews it. She can close audits, but not change answers. | The plant head reviews |
| 32 | `screens/32-close-after.png` | CLOSED (read-only)" at the end of the template line, centre-right; the "Re-open audit" button, top-right | Once closed, the audit is read-only. It can be re-opened if needed, and every change is kept in an audit trail. | Closed and read-only |
| 33 | `screens/33-audits-closed.png` | the "closed" badges next to the first two audit names, centre | The warehouse audit now sits closed beside October's documentation audit, with the QC check still in progress. | Ready for the next inspection |

**Outro voice-over:** "Medhanta CLEAR: GMP checklists from Schedule M, EU GMP and US 21 CFR, cross-referenced, run on screen and reported in one place. Book a demo with Medhanta."

Screen positions in the highlights are rough, on the 1920×1080 screenshot (app captured at 150 % zoom; content in a centred column, x ≈ 150–1770; menu bar = top 70 px).

## PRONUNCIATION RULES FOR THE VOICE-OVER (apply to every scene; captions keep normal spelling)

1. Speak naturally, at one steady pace (about 130 words a minute). Never slow down, pause or stretch on abbreviations, numbers or brand names.
2. Letter abbreviations are said as quick, joined letters in ONE beat, like a newsreader, never spelled out slowly with gaps: US = "you-ess" (one quick word), EU = "ee-you", UK = "you-kay", FDA = "eff-dee-ay", QA = "cue-ay", QMS = "cue-em-ess", SOP = "ess-oh-pee", PQR = "pee-cue-ar", FMEA = "eff-em-ee-ay", CPV = "see-pee-vee", AP = "ay-pee", OEE = "oh-ee-ee", IQ / OQ / PQ = "eye-cue", "oh-cue", "pee-cue", MIT = "em-eye-tee", DPDP = "dee-pee-dee-pee", AI = "ay-eye", CEO = "see-ee-oh", CFO = "see-eff-oh", GMP = "jee-em-pee", CFR = "see-eff-ar" ("21 CFR" = "twenty-one see-eff-ar"), WHO = "double-you aitch oh", QC = "cue-see", EU GMP = "ee-you jee-em-pee", N/A = "not applicable", PDF = "pee-dee-eff", AHU = "ay-aitch-you". Never read the dots in "U.S." or "e.g."; say "you-ess" and "for example".
3. Abbreviations that are said as WORDS: PIC/S = "pick-ess" (never read the slash), CAPA = "KAP-uh", SHRM = "shurm", Ipca = "IP-kuh".
4. Web addresses and domains: "." is said "dot", and the ending is said as a word: ".in" = "dot in" (rhymes with "pin"), ".com" = "dot com", ".co.in" = "dot co dot in". Never spell an ending letter by letter ("dot i-n" is wrong).
5. Brand and product names (confirm with Medhanta before final recording): Medhanta = "meh-DHAAN-tah", ASSURE = "uh-SHOOR" ("Medhanta ASSURE" = "meh-DHAAN-tah uh-SHOOR"), LEAD = "leed", DIVE = "dive" (one word, like diving), RISE = "rize", TIDE = "tide", EQUIP = "ee-KWIP", QLIMS = "cue-lims", MMS = "em-em-ess", CLEAR = "clear", TrueBatch = "TROO-batch", "Medhanta CLEAR" = "meh-DHAAN-tah clear", Schedule M = "SHED-yool em", Batchwright = "BATCH-rite", Digi = "DIJ-ee" (as in "digital"; "Digi partner" = "DIJ-ee partner", never "DIG-ee"), McKinsey = "muh-KIN-zee", Ranbaxy = "ran-BAK-see", Alexion = "uh-LEK-see-on", Baddi = "BUD-dee".
6. Indian money and numbers, said the Indian way: "₹16 lakh" = "sixteen lakh rupees" (lakh = "laak", rhymes with "rock"), "₹6 crore" = "six crore" (crore = "krore"), "US$4,700" = "forty-seven hundred dollars", "US$10–25 million" = "ten to twenty-five million dollars", "600-batch" = "six-hundred-batch", "60%" = "sixty percent", "2×" = "twice". Never read symbols aloud (₹, $, %, ×, –) as symbol names.
7. Footnote numbers (¹ ² ³) are on screen only. Never say them.
8. If a word could be misread, write it in the voice-over text the way it sounds (for example "DIJ-ee partner", "you-ess", "dot in"), keeping the correct spelling only in the captions.
