# Medhanta TIDE: feature list

Medhanta TIDE (formerly "Recruitment") is recruitment with online tests and live quizzes for one pharmaceutical company per installation (India): openings, applicants, online tests and live quizzes for shortlisting, interviews, offers and hire, and training records. It runs on the Medhanta platform: staff sign in once through Medhanta core, and TIDE shares data with the other Medhanta products through platform links. Candidate data is handled under India's DPDP Act 2023 and Rules 2025; GMP roles carry job descriptions, requirement lines and verified qualifications (Revised Schedule M, 21 CFR 211.25). The app sends no email or SMS: HR sends links and messages from their own email or phone. Screen numbers in brackets refer to `screens/`. **New** marks what was added since the previous pack (early November 2026).

## Sign-in, people and permissions (Medhanta platform)
- **New:** staff sign in once through the Medhanta platform (core); TIDE has no passwords, lockouts or user screen of its own (01).
- **New:** people, permissions and deactivation are managed in the platform's People screen; TIDE uses 14 permissions (raise or approve requisitions, department read, offers, candidates, tests, interviews and feedback, data-protection requests, settings, access log, and two training permissions) (02).
- **New:** Staff screen: everyone who has signed in, with their permissions, status and last sign-in; the admin sets each person's department, with a reason kept in the history (02).
- **New:** interview panels and trainers are picked from the platform's active staff; a person who is no longer active cannot be added, and if the platform link is down the screen says so and saves nothing (27, 39).
- Log out ends the platform session too, for shared terminals (not shown).
- Departments: add, rename, deactivate (admin menu; not shown).
- Access log: sign-ins, refused sign-ins, profile views, downloads, exports and changes, with user, action and date filters; rows older than 12 months are deleted automatically (52).

## Company settings and privacy notice
- Company name, contact person for personal data, data processors and other companies data is shared with (Settings; visible on candidate pages and PDFs).
- Privacy notice in versions: English plus any of India's Eighth Schedule languages (Hindi shown); each save is a new version and every application records the version the candidate saw (03, 07).

## Openings (requisitions)
- A manager (or HR) raises a requisition: role title, department, headcount, location, target date, job description, requirement lines (education, experience, training, other) (04).
- GMP role flag and special role: competent technical staff, head of testing, other key personnel (head of QA, authorised person). A GMP role needs a job description and at least one requirement (04).
- Save as draft, then Submit for approval (04).
- HR approves or returns it to the raiser with a comment; nobody approves their own requisition (05, 06).
- An approved requisition becomes an open opening with a public apply page link (06).
- Put on hold, Reopen and Close opening, each with a reason; edits after approval need a reason and go to the history (buttons on 06).
- Openings list with status, GMP flag and the number of candidates in each stage, filtered by status and department (Home and Openings; not shown as its own step).

## Candidates and applications
- Public apply page per opening: job description, requirements, privacy notice (language picker), the form and CV upload (PDF, DOC, DOCX, up to 5 MB) (07).
- Unticked consent boxes: 18+ confirmation, consent to the processing, optional "consider me for other openings for 12 months" (07).
- Confirmation with an application reference (R-2026-…) the candidate keeps (08).
- HR adds candidates from a CV received by email, walk-in, referral or agency, with source and 18+ confirmation (09).
- Duplicate flag when the email or phone matches an existing candidate: link to the existing candidate or keep separate (10).
- Fixed stages: Applied → Test → Shortlisted → Interview → Offer → Hired, or Rejected / Withdrawn; moving back, rejecting or withdrawing needs a reason (18, 19).
- Candidate list per opening: name, reference, stage, test score, quiz score, interview average, source, applied, days in stage (18, 19).
- Search (name, email, phone, education, employer), filters (stage, source, dates, test taken, score range, quiz score) and sort by score (18).
- Tick several rows, then Move ticked, Reject ticked or Send test (12, 18, 19).
- Show closed (read only) for candidates whose recruitment has ended (filter visible on 18).
- Candidate page: profile, CV, consent record, stage buttons, test results, quiz scores, interviews and feedback, offer, GMP verification and history (17, 31, 36, 51).
- Correct profile with a reason (button on 10).

## Online tests (question bank)
- Question papers with a title, instructions, time limit and questions of three types: single choice, multiple choice (all correct options needed), short written answer; marks per question (11).
- A paper that has been used is frozen; Copy makes a new editable version (11).
- Send test to ticked candidates with a "valid until" date; the app makes one personal link per candidate for HR to copy and send (12, 13).
- New link for a lost link, until the test starts (not shown).
- Candidate test page: instructions, time limit, start-by date and contact person; Start begins a server-side timer (14).
- Answers save as the candidate goes; the timer counts down; the test submits itself when time runs out; the link works once (15).
- Choice answers are marked automatically; written answers wait in "Answers to mark" for HR (11, 16).
- Score = marks gained / total marks, as %; every mark is in the history (17, 51).
- Starting a test moves the candidate from Applied to Test (18, 51).

## Live quiz (in the room)
- Start a live quiz from a choice-only paper for an opening, with the seconds per question (20).
- Host screen for the projector with the join address and a 6-letter code, and a "n joined" count; Full screen button (21).
- Candidates join on their phone with the code and their application reference (21).
- A phone without the reference shows a number; HR ticks the right candidate in from the results panel (22).
- Next question: question and options on the projector and on every phone, with a server countdown; one answer per phone (23).
- When time is up or everyone has answered, the projector shows the correct answer and how many chose each option; never names or scores (24).
- Results for HR only: name, reference, stage, correct answers and score; speed does not count (25).
- Cut-off score %: everyone at or above it in Applied or Test moves to Shortlisted in one step, once per quiz (25, 26).
- Quiz score appears in the candidate list, with filter and sort (filter visible on 18).
- A restarted laptop or server continues the quiz where it was (not shown).

## Interviews and feedback
- Schedule an interview: round, India date and time, place or video link, panel picked from the platform's staff who may give feedback (27).
- Reschedule or cancel with a reason (not shown).
- Home lists "Feedback I owe" and "Interviews today and upcoming" for each panel member (28, 50).
- Interviewers see only the candidates whose panel they are on, without test results, consent or offers (28, 29).
- Feedback: knowledge, experience fit, communication, overall (1 to 5), a comment and proceed / hold / reject (29).
- Other panel members' feedback shows after you submit; interview average on the candidate and in the list (30).
- Correct my feedback, with a reason (button on 30).

## Offer, GMP verification and hire
- Make offer: position, grade, salary, joining date, notes (31).
- The department manager (or another person with offer approval) approves it from "Offers to approve" on Home; nobody approves their own offer (32, 33).
- Mark accepted or Mark declined (36).
- GMP verification for competent technical staff, head of testing and other key personnel: each requirement line verified (met / not met, evidence seen, note), by whom and when; Mark hired stays off until every line is done (34, 35).
- Mark hired (36).
- Hand-over record (PDF) for personnel and training: candidate, role, job description, requirements and verification, offer and interview summary, with a reminder to report expert-staff changes to the licensing authority; the Company line shows only when it is set in Settings (37).
- **New:** hires are published to the platform, so an administrator adding an employee in core is offered the hired person (name, job title, department) instead of typing them again (mentioned on 36; core's screen not shown).
- When all places are filled the app offers to close the opening (not shown).

## Training records (new: GMP training, hand-over to TrueBatch)
- **New:** Training page for trainers ("add training records") and QA ("approve"): who is trained on which skill or SOP, by person or by skill, with person and skill filters and "Show withdrawn" (39–43).
- **New:** a record: the person and the trainer picked from the platform's active staff, the skill or SOP, trained on (not in the future), valid until (optional), result qualified / not qualified (39).
- **New:** a record counts only after another person approves it; nobody approves a record they wrote or their own training (40, 41).
- **New:** approval and withdrawal are e-signatures: the page shows what is signed and its meaning, then the platform asks for the password again; the printed name, time and meaning are recorded (41, 42).
- **New:** wrong records are never edited or deleted: they are withdrawn with a reason and stay visible, struck through (43). Expired and not-qualified records show in red (43).
- **New:** SOPs come from the QMS (Medhanta ASSURE): with the link on, SOPs are picked from the QMS list of SOPs in force and shown read-only in Settings; each record keeps the SOP revision trained on and shows "Current in QMS: rev X" when a newer revision is in force; other skills (for example GMP-BASIC) are kept by hand in Settings (38, 39, 42).
- **New:** the approved, current records are published for the batch record products: TrueBatch (and the logbook, Medhanta LEAD) read them to refuse a signature by an untrained person (stated on 38 and 39–43; TrueBatch's screen not shown).

## Medhanta platform links (new)
- **New:** sign-in and people from Medhanta core (01, 02).
- **New:** SOP list from Medhanta ASSURE (QMS); if the QMS link is down, SOPs cannot be picked and a clear note shows, other skills still work (38).
- **New:** training records published for TrueBatch and Medhanta LEAD; hires published for core's employee list (42, 36).
- **New:** move tool and cutover runbook to bring an existing standalone installation onto the platform (operations; not on screen).

## Candidate data rights (DPDP Act)
- Public "My data" page: contact person, how to make a request, the privacy notice; requests to withdraw, get a summary, correct, erase, complain (grievance) or consent to other openings, identified by reference plus email or phone (44).
- Request register for HR with status, type and date filters, identity check ("identity matched") and answer due date for grievances (90 days; red from 14 days before) (45).
- One action per request: Withdraw applications, Download data summary (PDF), Open the candidate to correct, Withdraw and schedule erasure, record other-openings consent, Close as done or Refuse (46, 47).
- Erasure request: the candidate is withdrawn and closed at once; the response states the date the data will be erased (47).
- Data summary (PDF): the candidate's data, applications and consent, processing steps, tests, quizzes, interviews, offer, requests, processors and contact person (48).
- Print response (PDF) with the contact person (button on 46, 47).
- Awaiting erasure list: closed candidates and the date the app erases them automatically, 12 months after the last processing; hired candidates are never erased (49).
- Candidate contacts export (CSV) only for breach notices; each export is logged (49).

## Home pages, history and oversight
- Home for every person: "What needs me now" (requisitions to approve, answers to mark, feedback I owe, interviews today and upcoming, offers to approve, grievances due, requests open), then the open openings with counts per stage (28, 50).
- History of every change on a candidate and a requisition: who, what, before, after, reason (51).
- Access log for the admin (52).
- Encrypted daily backups and a monthly restore check (operations, not on screen).
