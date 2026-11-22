# Brief: MEDHANTA product demo video pack (one product)

You build ONE product's demo-video pack. It will be turned into a 3–6 minute feature-walkthrough video with Claude Design (Anthropic's design tool). It is NOT a short ad: it is a calm, step-by-step tutorial that shows ALL the main features through real screens, in plain language for plant heads, QA / production / engineering users and buyers.

## Rules
- The repo is a read-only source: change nothing in it, commit nothing, push nothing. Put any helper scripts you write in `/home/user/demo-packs/<slug>/_work/` (deleted before zipping), not in the repo. Installing node_modules and building inside the repo is fine.
- PostgreSQL 16 is already running locally on port 5432 (user `postgres`, password `postgres`). Create your OWN database named in your assignment. Do not touch other databases.
- Use ONLY the ports in your assignment (other products run in parallel).
- Playwright: `require('playwright')` works from any directory; `chromium.launch()` needs no options. Do NOT run `playwright install` and do not install another Playwright. If the repo pins @playwright/test, either run your script with plain node from `_work/` using the global `playwright`, or launch with `executablePath: '/opt/pw-browsers/chromium'`.
- Demo data: realistic but clearly fictional. One fictional plant: **"Medhanta Demo Plant, Unit 2"** (fictional), fictional people (e.g. Asha Rao – QA Head, Vikram Shah – Production, Neha Iyer – Engineering, Rahul Mehta – Warehouse, Priya Nair – Operator; adapt roles). Fictional products/materials (e.g. "Paracetamol 500 mg tablets", lot numbers like DEMO-24-001). Use the app's own seed/demo scripts or its API/UI. Never invent sales numbers, savings, or testimonials.
- Read the README, handover/PROGRESS notes and functional requirements (docs/, compliance/) to list ALL features. Use the e2e specs to learn the click paths.

## Screenshots
- Viewport 1920×1080, deviceScaleFactor 1, PNG. Name `NN-feature-step.png` (NN = 01, 02 … in story order) in `/home/user/demo-packs/<slug>/screens/`.
- Walk through every main feature as one story (one plant, one working day). Typically 20–40 screens. Where a click sequence matters, capture before/after pairs (e.g. `12-approve-before.png`, `13-approve-after.png`) so the video can animate the transition.
- Make each screen meaningful: real data visible, no empty lists, no error toasts, no dev overlays, no login screen except one on purpose. Hide cookie banners/dev tools if any.
- To check your shots, look at small downscaled copies only (e.g. `python3 -c` with PIL to make 480px-wide JPEGs in `_work/`), never at full-size images, to save context. Check every screen at least once at thumbnail size.

## Files to write in `/home/user/demo-packs/<slug>/`
1. `feature-list.md` – every feature, one line each, plain words (grouped by area).
2. `demo-script.md` – chapter-by-chapter (chapter = feature group). Start with an intro (the problem in one line) and an intro title card; each chapter has a title card; for each step: screenshot file, what to highlight (the exact element to zoom or circle, with its rough position on screen, e.g. "top-right 'Approve' button"), voice-over line (simple, friendly, no jargon; explain a GMP term in about 3 words when needed, e.g. "IPC – in-process checks"), on-screen caption (max ~8 words). End with an outro and an end card. Add an estimated duration per chapter; total 3–6 min.
3. `claude-design-prompt.md` – ready to paste into Claude Design. Include: 16:9, 1920×1080, target length (3–6 min), the chapter list with title cards, instructions to use the attached real screenshots in order with gentle zooms / highlights / an animated cursor moving to the highlighted element / cross-fades for before→after pairs, captions on, the Medhanta brand (primary #e8500f, red→orange→amber gradient `linear-gradient(90deg,#dd1a10,#f4511e 55%,#f7941d)`, grey #5f5f5f, Inter font, logo medhanta-logo.png, mark medhanta-mark.png), calm clear tutorial tone, an end card with the logo, product name and "Book a demo". Say explicitly: no invented numbers, no testimonials, do not redraw or alter the UI in the screenshots. Paste the full per-step voice-over and caption table into the prompt (or say "follow demo-script.md attached" AND include it compactly) so it works stand-alone.
4. `files-to-attach.md` – the upload order for Claude Design: 1) claude-design-prompt.md, 2) demo-script.md, 3) brand/ (medhanta-logo.png, medhanta-mark.png, favicon.png, brand.md), 4) screens in order (list them all), 5) feature-list.md.
5. Copy `/home/user/demo-packs/brand/` into `/home/user/demo-packs/<slug>/brand/`.

Then delete `_work/` from the pack (or move it to `/home/user/demo-packs/_work-<slug>/`) and zip: `cd /home/user/demo-packs && zip -qr medhanta-<slug>-demo-pack.zip <slug>/` and verify with `unzip -l`.

## If it cannot run
If the product truly cannot be run locally (after a real try: install, migrate, seed, start), say exactly why, and still ship the pack with feature-list.md, demo-script.md (describing the screens that would be shown, with no screenshot files) and the prompt.

## Report back (short)
Slug, zip path and size, number of screens, the chapter list with durations, anything that did not work or was skipped, and any feature you could not show on screen. Stop all servers you started before you finish (leave PostgreSQL running).
