# Brief: video format (read after BRIEF.md and BRIEF-v2.md)

Each pack is ALSO turned into an animated video automatically by /home/user/demo-packs/_video/make_video.py
(do not run it; the coordinator does). It parses demo-script.md, so write it EXACTLY in this shape:

    # Demo script: <Product name>
    ## Intro (≈ 12 s)
    **Voice-over:** "<2–3 sentences: the problem, then the promise>"
    **Caption:** <short line>
    ## Chapter 1: <Chapter title> (≈ 20 s)
    ### Step 1: `01-some-screen.png`
    - **Highlight:** <element>, <position words: top-left / top-right / centre / bottom / left / right …>
    - **Voice-over:** "<one or two short sentences>"
    - **Caption:** <max ~8 words>
    ### Step 2: `02-next.png`
    ...
    ## Chapter 2: ...
    ## Outro (≈ 10 s)
    **Voice-over:** "<closing line ending with: book a demo with Medhanta>"
    ## Timing
    | ... table ... |

Rules: one screenshot per step (before/after pairs are two steps). Position words in Highlight steer the zoom.
The voice reads every Voice-over at about 150 words a minute, so keep ALL voice-over text together to about
650–750 words (≈ 5–6 minutes with cards). Say product names in full ("TrueBatch Capsules", "Medhanta CLEAR").
Every claim must be true to the product as it runs; no invented customers, results or figures.
