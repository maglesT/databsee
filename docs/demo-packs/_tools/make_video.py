#!/usr/bin/env python3
"""Build an animated demo video with voice-over from a Medhanta demo pack.
usage: venv/bin/python make_video.py <slug> [--limit N]   (N = only the first N segments, for a quick test)
"""
import json, os, re, subprocess, sys, wave, shutil, math

PACKS = "/home/user/demo-packs"
HERE = os.path.dirname(os.path.abspath(__file__))
OUTDIR = os.path.join(PACKS, "videos")
FPS = 30
XF = 0.5  # cross-fade seconds

PRODUCTS = {
    "truebatch-tablets": ("TrueBatch Tablets", "Electronic batch records for tablets", "brand/tablets-logo-900.png"),
    "truebatch-injectables": ("TrueBatch Injectables", "Electronic batch records for sterile injectables", "brand/medhanta-injectables-logo.png"),
    "lead": ("Medhanta LEAD", "Logbook and Engineering Work Order Management", "brand/medhanta-lead-logo.png"),
    "mms": ("Medhanta MMS", "Material management for pharma plants", "brand/medhanta-mms-logo.png"),
    "dive": ("Medhanta DIVE", "Deviations, investigations and CAPA", "brand/medhanta-dive-logo.png"),
    "equip": ("Medhanta EQUIP", "Equipment qualification and validation", "brand/medhanta-equip-logo.png"),
    "assure": ("Medhanta ASSURE", "Quality management system", "brand/medhanta-assure-logo.png"),
    "rise": ("Medhanta RISE", "Operations, OEE and machine-learning insights", "brand/medhanta-rise-logo.png"),
    "tide": ("Medhanta TIDE", "Recruitment with online tests and live quizzes", "brand/medhanta-tide-logo.png"),
    "truebatch-api": ("TrueBatch API", "Electronic batch records for active pharmaceutical ingredients", "brand/medhanta-api-logo.png"),
    "truebatch-capsules": ("TrueBatch Capsules", "Electronic batch records for capsules", "brand/medhanta-capsules-logo.png"),
    "truebatch-oral-liquids": ("TrueBatch Oral Liquids", "Electronic batch records for oral liquids", "brand/medhanta-liquids-logo.png"),
    "clear": ("Medhanta CLEAR", "Compliance Library for Evaluation and Audit Readiness", "brand/medhanta-clear-logo.png"),
    "qlims": ("Medhanta QLIMS", "Laboratory information management for QC labs", "brand/medhanta-qlims-logo.png"),
}

# ---------- pronunciation for the TTS voice (captions keep normal spelling) ----------
SAY = [
    (r"\bMedhanta\b", "Meh-dhaan-ta"), (r"\bTrueBatch\b", "True Batch"), (r"\bLEAD\b", "Leed"),
    (r"\bASSURE\b", "Assure"), (r"\bEQUIP\b", "Equip"), (r"\bDIVE\b", "Dive"), (r"\bRISE\b", "Rise"), (r"\bTIDE\b", "Tide"),
    (r"\bQLIMS\b", "Q lims"), (r"\bMMS\b", "M M S"), (r"\bCAPAs\b", "kappas"), (r"\bCAPA\b", "kappa"),
    (r"\bQA\b", "Q A"), (r"\bQC\b", "Q C"), (r"\bSOPs\b", "S O Ps"), (r"\bSOP\b", "S O P"), (r"\bOEE\b", "O E E"),
    (r"\bIQ\b", "I Q"), (r"\bOQ\b", "O Q"), (r"\bPQ\b", "P Q"), (r"\bURS\b", "U R S"), (r"\bIPC\b", "I P C"),
    (r"\bPDF\b", "P D F"), (r"\bPDFs\b", "P D Fs"), (r"\bCSV\b", "C S V"), (r"\bPM\b", "P M"), (r"\bEM\b", "E M"),
    (r"\bF0\b", "F zero"), (r"\bOOS\b", "O O S"), (r"\bCPV\b", "C P V"), (r"\bPQR\b", "P Q R"), (r"\bFMEA\b", "F M E A"),
    (r"\bFEFO\b", "fee-foe"), (r"\bMRP\b", "M R P"), (r"\bAPI\b", "A P I"), (r"\bGMP\b", "G M P"), (r"\bERP\b", "E R P"),
    (r"\bMTBF\b", "M T B F"), (r"\bMTTR\b", "M T T R"), (r"\bID\b", "I D"), (r"\bIDs\b", "I Ds"), (r"\bUS\b", "U S"),
    (r"\bEU\b", "E U"), (r"\bAI\b", "A I"), (r"\bHR\b", "H R"), (r"\bDPDP\b", "D P D P"), (r"\bCoA\b", "C of A"),
    (r"\be\.g\.", "for example"), (r"\bi\.e\.", "that is"), (r"\bvs\.?\b", "versus"),
    (r"₹\s?([\d.,]+)", r"\1 rupees"), (r"\bRs\.?\s?([\d.,]+)", r"\1 rupees"), (r"(\d)\s?%", r"\1 percent"),
    (r"(\d)\s?°C", r"\1 degrees"), (r"\bkg\b", "kilograms"), (r"\bmg\b", "milligrams"), (r"(\d)\s?g\b", r"\1 grams"),
    (r"(\d)\s?mL\b", r"\1 millilitres"), (r"(\d)\s?min\b", r"\1 minutes"), (r"(\d)\s?h\b", r"\1 hours"),
    (r"×", " by "), (r"[–—]", ", "), (r"→", " to "), (r"·", ", "), (r"&", " and "),
]


def say_text(t):
    t = re.sub(r"[*_`]", "", t)
    for a, b in SAY:
        t = re.sub(a, b, t)
    # codes like WO-26-0001, TB260009, BLIS-01: speak the parts
    t = re.sub(r"\b([A-Z]{2,6})-(\d+)-(\d+)\b", lambda m: f"{' '.join(m.group(1))} {m.group(2)}, {' '.join(m.group(3))}", t)
    t = re.sub(r"\b([A-Z]{2,6})-(\d+)\b", lambda m: f"{m.group(1) if len(m.group(1))>3 else ' '.join(m.group(1))} {' '.join(m.group(2))}", t)
    t = re.sub(r"\b([A-Z]{2,4})(\d{4,})\b", lambda m: f"{' '.join(m.group(1))} {' '.join(m.group(2))}", t)
    return re.sub(r"\s+", " ", t).strip()


def clean(t):
    t = t.strip().strip("|").strip()
    t = re.sub(r"\*\*|`", "", t)
    t = t.strip().strip('"“”').strip()
    return t


# ---------- parse demo-script.md into segments ----------
def parse(slug):
    md = open(os.path.join(PACKS, slug, "demo-script.md"), encoding="utf-8").read().splitlines()
    shots = set(os.listdir(os.path.join(PACKS, slug, "screens")))
    segs, sec, chap_no, cur = [], None, 0, None
    intro = {"vo": "", "cap": ""}; outro = {"vo": "", "cap": ""}

    def flush():
        nonlocal cur
        if cur and cur.get("files"):
            segs.append(cur)
        cur = None

    for line in md:
        h2 = re.match(r"^##\s+(.*)$", line)
        if h2 and not line.startswith("###"):
            flush()
            title = re.sub(r"\(≈[^)]*\)", "", h2.group(1)).strip()
            low = title.lower()
            if low.startswith("intro"):
                sec = "intro"
            elif low.startswith(("outro", "end card", "closing")):
                sec = "outro"
            elif re.match(r"^(timing|durations|duration|total)", low):
                sec = "stop"
            else:
                m = re.match(r"^(?:chapter\s*)?(\d+)\s*[:.—–·-]?\s*(.*)$", title, re.I)
                if m:
                    chap_no = int(m.group(1)); ctitle = m.group(2).strip(" :—–-")
                else:
                    chap_no += 1; ctitle = title
                sec = "chapter"
                segs.append({"type": "card", "no": chap_no, "title": ctitle})
            continue
        if sec == "stop":
            continue
        # step heading with a screenshot
        h3 = re.match(r"^###\s+.*?`?([0-9]{2}[^`\s]*\.png)`?", line)
        if h3:
            flush()
            files = [f for f in re.findall(r"([0-9]{2}[\w.-]*\.png)", line) if f in shots]
            cur = {"type": "shot", "files": files, "vo": "", "cap": "", "hl": ""}
            continue
        mvo = re.match(r"^\s*-?\s*\*\*Voice-over:?\*\*:?\s*(.*)$", line)
        mcap = re.match(r"^\s*-?\s*\*\*(?:On-screen )?[Cc]aption:?\*\*:?\s*(.*)$", line)
        mhl = re.match(r"^\s*-?\s*\*\*Highlight[^*]*\*\*:?\s*(.*)$", line)
        if cur is not None and (mvo or mcap or mhl):
            if mvo: cur["vo"] = clean(mvo.group(1))
            if mcap: cur["cap"] = clean(mcap.group(1))
            if mhl: cur["hl"] = clean(mhl.group(1))
            continue
        if sec in ("intro", "outro") and cur is None and (mvo or mcap):
            d = intro if sec == "intro" else outro
            if mvo: d["vo"] = clean(mvo.group(1))
            if mcap: d["cap"] = clean(mcap.group(1))
            continue
        # table row
        if line.startswith("|") and ".png" in line:
            cells = [c.strip() for c in line.strip().strip("|").split("|")]
            files = [f for f in re.findall(r"([0-9]{2}[\w.-]*\.png)", line) if f in shots]
            if not files or len(cells) < 4:
                continue
            flush()
            ci = next(i for i, c in enumerate(cells) if ".png" in c)
            rest = cells[ci + 1:]
            hl, vo, cap = (rest + ["", "", ""])[:3] if len(rest) >= 3 else ("", rest[0] if rest else "", rest[1] if len(rest) > 1 else "")
            segs.append({"type": "shot", "files": files, "vo": clean(vo), "cap": clean(cap), "hl": clean(hl)})
    flush()
    # drop chapter cards with no shots after them
    out = []
    for i, s in enumerate(segs):
        if s["type"] == "card":
            nxt = next((x for x in segs[i + 1:] if True), None)
            if not nxt or nxt["type"] != "shot":
                continue
        out.append(s)
    return intro, out, outro


# ---------- focus point from the highlight's position words ----------
def focus(hl):
    h = hl.lower()
    fx, fy = 0.5, 0.45
    if re.search(r"top[- ]?left|upper left", h): fx, fy = 0.25, 0.25
    elif re.search(r"top[- ]?right|upper right", h): fx, fy = 0.75, 0.25
    elif re.search(r"bottom[- ]?left|lower left", h): fx, fy = 0.25, 0.75
    elif re.search(r"bottom[- ]?right|lower right", h): fx, fy = 0.75, 0.72
    else:
        if re.search(r"\btop\b|header|upper", h): fy = 0.28
        if re.search(r"\bbottom\b|lower", h): fy = 0.72
        if re.search(r"\bleft\b", h): fx = 0.3
        if re.search(r"\bright\b", h): fx = 0.7
    return fx, fy


# ---------- helpers ----------
def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        sys.stderr.write(r.stderr[-2000:]); raise SystemExit("command failed: " + " ".join(cmd[:6]))


def tts(text, path):
    p = subprocess.run([os.path.join(HERE, "venv/bin/piper"), "-m", os.path.join(HERE, "voice/en_US-lessac-medium.onnx"),
                        "--length-scale", "1.0", "--sentence-silence", "0.25", "-f", path],
                       input=say_text(text), capture_output=True, text=True)
    if p.returncode != 0:
        raise SystemExit(p.stderr[-800:])
    with wave.open(path) as w:
        return w.getnframes() / w.getframerate()


CARD_CSS = """
*{box-sizing:border-box;margin:0}
html,body{width:1920px;height:1080px;overflow:hidden;background:#faf8f6;font-family:Inter,'Inter Display',sans-serif;color:#2b2b2b}
.bar{position:absolute;left:0;top:0;height:10px;background:linear-gradient(90deg,#dd1a10,#f4511e 55%,#f7941d);width:100%;transform-origin:left;animation:grow 1s cubic-bezier(.2,.8,.2,1) both}
.bar.b{top:auto;bottom:0;animation-delay:.2s}
@keyframes grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes up{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:none}}
@keyframes fade{from{opacity:0}to{opacity:1}}
@keyframes pop{0%{opacity:0;transform:scale(.85)}60%{opacity:1;transform:scale(1.03)}100%{transform:scale(1)}}
.wrap{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:0 200px;gap:28px}
.emb{height:150px;width:auto;align-self:flex-start;animation:pop .9s .15s both}
.no{font-size:180px;font-weight:800;line-height:1;background:linear-gradient(90deg,#dd1a10,#f4511e 55%,#f7941d);-webkit-background-clip:text;background-clip:text;color:transparent;animation:up .7s .1s both}
.t{font-size:84px;font-weight:700;letter-spacing:-1.5px;line-height:1.05;animation:up .7s .3s both;max-width:1500px}
.s{font-size:40px;color:#5f5f5f;animation:up .7s .5s both;max-width:1450px;line-height:1.3}
.mark{position:absolute;right:80px;bottom:60px;height:70px;opacity:.9;animation:fade 1s .6s both}
.rule{width:160px;height:8px;border-radius:4px;background:linear-gradient(90deg,#dd1a10,#f4511e 55%,#f7941d);transform-origin:left;animation:grow .8s .45s both}
.cta{display:inline-block;margin-top:24px;font-size:52px;font-weight:700;color:#fff;background:#e8500f;padding:22px 54px;border-radius:14px;align-self:flex-start;animation:pop .8s .9s both}
.center{align-items:center;text-align:center}.center .emb,.center .cta{align-self:center}.center .rule{align-self:center}
"""


def render_cards(page, items, workdir):
    """items: list of (name, html_body, seconds). Renders each to an mp4 by stepping CSS animations frame by frame."""
    outs = {}
    for name, body, secs in items:
        fdir = os.path.join(workdir, "f_" + name); shutil.rmtree(fdir, ignore_errors=True); os.makedirs(fdir)
        page.set_content(f"<html><head><style>{CARD_CSS}</style></head><body>{body}</body></html>")
        page.wait_for_timeout(150)
        page.evaluate("document.getAnimations().forEach(a=>a.pause())")
        n = int(round(secs * FPS))
        anim_frames = min(n, int(2.0 * FPS))  # animations finish within 2 s; hold the last frame after
        for i in range(anim_frames):
            page.evaluate(f"document.getAnimations().forEach(a=>a.currentTime={i*1000/FPS})")
            page.screenshot(path=os.path.join(fdir, f"{i:04d}.png"))
        last = os.path.join(fdir, f"{anim_frames-1:04d}.png")
        for i in range(anim_frames, n):
            os.link(last, os.path.join(fdir, f"{i:04d}.png"))
        out = os.path.join(workdir, name + ".mp4")
        run(["ffmpeg", "-y", "-loglevel", "error", "-framerate", str(FPS), "-i", os.path.join(fdir, "%04d.png"),
             "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p", out])
        shutil.rmtree(fdir); outs[name] = out
    return outs


def caption_png(page, text, tag, path):
    page.set_content(f"""<html><head><style>
    *{{margin:0;box-sizing:border-box}} html,body{{background:transparent;width:1920px;height:1080px;font-family:Inter,sans-serif}}
    .c{{position:absolute;left:50%;bottom:56px;transform:translateX(-50%);max-width:1500px;display:flex;align-items:center;gap:22px;
       background:rgba(30,26,24,.88);color:#fff;padding:20px 34px 20px 26px;border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,.25)}}
    .k{{width:10px;align-self:stretch;border-radius:5px;background:linear-gradient(180deg,#dd1a10,#f4511e 55%,#f7941d)}}
    .tx{{font-size:40px;font-weight:600;line-height:1.2}} .tg{{font-size:22px;font-weight:600;color:#f7941d;letter-spacing:.06em;text-transform:uppercase;margin-bottom:4px}}
    </style></head><body><div class="c"><div class="k"></div><div><div class="tg">{tag}</div><div class="tx">{text}</div></div></div></body></html>""")
    page.screenshot(path=path, omit_background=True)


def shot_clip(png, cap_png, secs, fx, fy, out, zoom_in=True):
    n = int(round(secs * FPS))
    z0, z1 = (1.0, 1.08) if zoom_in else (1.08, 1.0)
    ramp = int(1.6 * FPS)  # ease the zoom in over 1.6 s, then hold still (still frames compress to almost nothing)
    pexpr = f"min(on/{ramp},1)"
    zexpr = f"{z0}+({z1}-{z0})*({pexpr})*({pexpr})*(3-2*({pexpr}))"
    # zoompan on a 2x upscale for smooth motion
    vf = (f"[0:v]scale=3840:2160,zoompan=z='{zexpr}':x='(iw-iw/zoom)*{fx}':y='(ih-ih/zoom)*{fy}':d={n}:s=1920x1080:fps={FPS}[bg];"
          f"[1:v]format=rgba,fade=t=in:st=0.35:d=0.45:alpha=1[cap];[bg][cap]overlay=0:0:format=auto,format=yuv420p[v]")
    run(["ffmpeg", "-y", "-loglevel", "error", "-loop", "1", "-i", png, "-loop", "1", "-t", f"{secs:.3f}", "-i", cap_png,
         "-filter_complex", vf, "-map", "[v]", "-frames:v", str(n), "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", out])


def esc(t):
    return t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def main():
    slug = sys.argv[1]
    limit = int(sys.argv[sys.argv.index("--limit") + 1]) if "--limit" in sys.argv else None
    name, tagline, emb = PRODUCTS[slug]
    pack = os.path.join(PACKS, slug)
    work = os.path.join(HERE, "work", slug); shutil.rmtree(work, ignore_errors=True); os.makedirs(work)
    intro, segs, outro = parse(slug)
    if limit: segs = segs[:limit]
    import base64
    du = lambda f: "data:image/png;base64," + base64.b64encode(open(f, "rb").read()).decode()
    emb_url = du(os.path.join(pack, emb) if os.path.isfile(os.path.join(pack, emb)) else os.path.join(PACKS, "brand", "medhanta-logo.png"))
    mark_url = du(os.path.join(PACKS, "brand", "medhanta-logo.png"))
    json.dump({"intro": intro, "segs": segs, "outro": outro}, open(os.path.join(work, "plan.json"), "w"), indent=1)

    # 1) voice
    clips = []  # (kind, video_path_or_key, seconds, wav or None)
    def voice(text, key):
        if not text: return None, 0.0
        p = os.path.join(work, key + ".wav"); return p, tts(text, p)

    iw, idur = voice(intro["vo"], "intro")
    ow, odur = voice(outro["vo"] or f"{name}. Book a demo with Medhanta.", "outro")
    plan = []
    plan.append(("intro", None, max(idur + 1.2, 5.0), iw, 0.8))
    chap_title = name
    for i, s in enumerate(segs):
        if s["type"] == "card":
            plan.append((f"card{i:03d}", s, 2.6, None, 0)); chap_title = s["title"]; continue
        w, d = voice(s["vo"], f"vo{i:03d}")
        total = max(d + 0.9, 3.2)
        s["tag"] = chap_title
        plan.append((f"shot{i:03d}", s, total, w, 0.35))
    plan.append(("outro", None, max(odur + 1.5, 6.0), ow, 0.9))

    # 2) visuals
    from playwright.sync_api import sync_playwright
    with sync_playwright() as pw:
        b = pw.chromium.launch(executable_path="/opt/pw-browsers/chromium-1243/chrome-linux64/chrome"); page = b.new_page(viewport={"width": 1920, "height": 1080}, device_scale_factor=1)
        cards = []
        cards.append(("intro", f"""<div class="bar"></div><div class="bar b"></div><div class="wrap">
            <img class="emb" src="{emb_url}"><div class="t">{esc(name)}</div><div class="rule"></div>
            <div class="s">{esc(tagline)}</div>{('<div class="s" style="font-size:34px;animation-delay:.8s">'+esc(intro["cap"])+'</div>') if intro["cap"] else ''}</div>
            <img class="mark" src="{mark_url}">""", plan[0][2]))
        for key, s, secs, _, _ in plan:
            if key.startswith("card"):
                cards.append((key, f"""<div class="bar"></div><div class="wrap">
                  <div class="no">{s['no']:02d}</div><div class="t">{esc(s['title'])}</div><div class="rule"></div>
                  <div class="s">{esc(name)}</div></div><img class="mark" src="{mark_url}">""", secs))
        cards.append(("outro", f"""<div class="bar"></div><div class="bar b"></div><div class="wrap center">
            <img class="emb" src="{emb_url}" style="height:170px"><div class="s">{esc(tagline)}</div>
            <a class="cta">Book a demo</a><div class="s" style="font-size:30px;animation-delay:1.2s">by Medhanta</div></div>
            <img class="mark" src="{mark_url}">""", plan[-1][2]))
        vids = render_cards(page, cards, work)
        flip = True
        for key, s, secs, _, _ in plan:
            if not key.startswith("shot"): continue
            cap = os.path.join(work, key + "_cap.png")
            caption_png(page, esc(s["cap"] or ""), esc(s.get("tag", name)), cap)
            files = s["files"]; per = secs / len(files); parts = []
            for j, f in enumerate(files):
                fx, fy = focus(s["hl"]); out = os.path.join(work, f"{key}_{j}.mp4")
                shot_clip(os.path.join(pack, "screens", f), cap, per + (XF if j < len(files) - 1 else 0), fx, fy, out, zoom_in=flip)
                flip = not flip; parts.append(out)
            if len(parts) == 1:
                vids[key] = parts[0]
            else:  # before/after pair inside one step: cross-fade
                o = os.path.join(work, key + ".mp4"); xfade_concat(parts, [per + XF] * (len(parts) - 1) + [per], o, XF); vids[key] = o
        b.close()

    # 3) timeline: video clips joined with cross-fades; voice placed at each clip's start (+ lead-in)
    seq = [vids[k] for k, *_ in plan]
    durs = [d for _, _, d, _, _ in plan]
    durs = [d + XF for d in durs[:-1]] + [durs[-1]]  # each clip overlaps the next by XF
    # re-render? clips were made with their own lengths; extend by holding: simplest is to pad with tpad
    padded = []
    for p, want in zip(seq, durs):
        have = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p], capture_output=True, text=True).stdout)
        if want > have + 0.02:
            q = p[:-4] + "_pad.mp4"
            run(["ffmpeg", "-y", "-loglevel", "error", "-i", p, "-vf", f"tpad=stop_mode=clone:stop_duration={want-have:.3f}", "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", q])
            padded.append(q)
        else:
            padded.append(p)
    video = os.path.join(work, "video.mp4")
    xfade_concat(padded, durs, video, XF)
    # audio
    starts, t = [], 0.0
    for d in durs:
        starts.append(t); t += d - XF
    total = t + XF
    inputs, filt, labels = [], [], []
    for (key, s, secs, wav, lead), st in zip(plan, starts):
        if wav:
            k = len(inputs)//2; inputs += ["-i", wav]
            ms = int((st + lead) * 1000); filt.append(f"[{k}:a]aresample=44100,adelay={ms}|{ms}[a{k}]"); labels.append(f"[a{k}]")
    audio = os.path.join(work, "voice.m4a")
    run(["ffmpeg", "-y", "-loglevel", "error", *inputs, "-filter_complex",
         ";".join(filt) + f";{''.join(labels)}amix=inputs={len(labels)}:normalize=0,apad,atrim=0:{total:.3f},loudnorm=I=-16:TP=-1.5[a]",
         "-map", "[a]", "-ac", "1", "-c:a", "aac", "-b:a", "64k", audio])
    os.makedirs(OUTDIR, exist_ok=True)
    final = os.path.join(OUTDIR, f"medhanta-{slug}-demo{'-test' if limit else ''}.mp4")
    run(["ffmpeg", "-y", "-loglevel", "error", "-i", video, "-i", audio, "-map", "0:v", "-map", "1:a", "-c:v", "libx264",
         "-preset", "slow", "-crf", "29", "-tune", "stillimage", "-x264-params", "keyint=900:min-keyint=60", "-pix_fmt", "yuv420p", "-c:a", "copy", "-movflags", "+faststart", "-shortest", final])
    print(json.dumps({"out": final, "seconds": round(total, 1), "mb": round(os.path.getsize(final) / 1e6, 1),
                      "segments": len(plan), "shots": sum(1 for k, *_ in plan if k.startswith("shot"))}))


def xfade_concat(paths, durs, out, xf):
    if len(paths) == 1:
        shutil.copy(paths[0], out); return
    # chain in batches of 12 to keep the filter graph small
    if len(paths) > 12:
        mids, mdurs = [], []
        for i in range(0, len(paths), 12):
            chunk, cd = paths[i:i + 12], durs[i:i + 12]
            o = f"{out[:-4]}_c{i//12}.mp4"
            # inner chunks keep their trailing overlap so the outer join can cross-fade
            xfade_concat(chunk, cd, o, xf); mids.append(o)
            mdurs.append(sum(cd) - xf * (len(cd) - 1))
        xfade_concat(mids, mdurs, out, xf); return
    inputs = []
    for p in paths: inputs += ["-i", p]
    f, last, off = [], "[0:v]", 0.0
    for i in range(1, len(paths)):
        off += durs[i - 1] - xf
        lab = f"[x{i}]"
        f.append(f"{last}[{i}:v]xfade=transition=fade:duration={xf}:offset={off:.3f}{lab}")
        last = lab
    run(["ffmpeg", "-y", "-loglevel", "error", *inputs, "-filter_complex", ";".join(f), "-map", last,
         "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p", out])


if __name__ == "__main__":
    main()
