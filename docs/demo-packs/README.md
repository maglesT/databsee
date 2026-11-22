# Medhanta product demo-video packs (22 Nov 2026 release)

One folder per product. Each pack is a feature walkthrough (not an ad) built from real screenshots of the
product running locally with fictional data for "Medhanta Demo Plant, Unit 2".

| File | What it is |
|---|---|
| `feature-list.md` | Every feature, one line each; items not shown on screen are marked |
| `demo-script.md` | Chapters and steps: screenshot, what to highlight, voice-over, caption |
| `claude-design-prompt.md` | Ready-to-paste prompt for Claude Design (16:9, chapters, captions, brand, pronunciation rules) |
| `files-to-attach.md` | Upload order for Claude Design |
| `brand/` | Product emblem (option A) and Medhanta logo, mark, favicon, brand.md |
| `screens/` | 1920×1080 screenshots, `NN-feature-step.png`, in story order |

**Finished animated videos** (voice-over, animated title and chapter cards, zooms, captions) and per-pack zip
downloads are on the shared page: https://claude.ai/artifact/8QVmGVGErgYabYrJtTZLaV (videos are ~20 MB each,
so they are not in git).

`_tools/make_video.py` rebuilds a video from a pack (`python make_video.py <slug>`; needs ffmpeg, Piper TTS
with the en_US-lessac-medium voice, and Playwright with Chromium). `_tools/BRIEF*.md` are the briefs used.

Caveats common to all packs: each product ran standalone with the repo's own test stand-ins for Medhanta core
sign-on and links, so SSO, live cross-product links and "you cannot change your own permissions" are not shown
live. All names, batches and numbers are fictional; no customers or results are claimed.
