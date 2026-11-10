"""TimeForge video QA gate.

Usage: python scripts/qa_video.py <video.mp4> <CompositionId> <content_dir>

Exits 1 when any check FAILs, so it can gate CI / a render pipeline.
Checks are run against the composition source (src/<CompositionId>.tsx) that actually renders,
not only the generated JSON.
"""
import json
import math
import os
import re
import shutil
import subprocess
import sys
from fractions import Fraction

FPS = 30
MIN_SHOT, MAX_SHOT = 80, 110          # CLAUDE.md: shot 80–110 frames
SUB_MIN, SUB_MAX = 42, 56             # CLAUDE.md: subtitle font 42–56px
STROKE_MIN, STROKE_MAX = 3, 5         # CLAUDE.md: stroke 3–5px
IG_TOP, IG_BOTTOM = 420, 1500         # CLAUDE.md: IG grid 1:1 safe zone
BADGE_HALF = 32                       # CoverBadge BADGE_HEIGHT / 2
MIN_SECONDS = 60


def run_cmd(*args):
    res = subprocess.run(args, capture_output=True, text=True)
    return res.returncode, res.stdout.strip(), res.stderr.strip()


def split_shots(n):
    """Mirror of splitShots() in src/components/timeforge/CameraShots.tsx."""
    lo, hi = math.ceil(n / MAX_SHOT), n // MIN_SHOT
    if lo > hi:
        return None
    base, rem = divmod(n, lo)
    return [base + (1 if i < rem else 0) for i in range(lo)]


def find_source(comp_id):
    path = os.path.join("src", f"{comp_id}.tsx")
    if os.path.exists(path):
        return path
    for root, _, files in os.walk("src"):
        for name in files:
            if name.endswith(".tsx"):
                p = os.path.join(root, name)
                with open(p, encoding="utf-8") as f:
                    if re.search(rf"export const {re.escape(comp_id)}\b", f.read()):
                        return p
    return None


def prop_default(component_file, prop):
    try:
        with open(component_file, encoding="utf-8") as f:
            m = re.search(rf"^\s*{prop} = (\d+)", f.read(), re.M)
        return int(m.group(1)) if m else None
    except OSError:
        return None


def main():
    if len(sys.argv) < 4:
        print("Usage: python scripts/qa_video.py <video.mp4> <CompositionId> <content_dir>")
        sys.exit(2)
    video_path, comp_id, content_dir = sys.argv[1:4]

    for tool in ("ffprobe", "ffmpeg"):
        if not shutil.which(tool):
            print(f"❌ FAIL: {tool} not found on PATH (brew install ffmpeg)")
            sys.exit(1)

    out_dir = os.path.join("out", "qa-report", comp_id)
    os.makedirs(out_dir, exist_ok=True)

    report_lines, fails = [], []

    def log(msg, status="INFO"):
        prefix = {"PASS": "✅ PASS", "FAIL": "❌ FAIL", "WARN": "⚠️ WARN"}.get(status, "ℹ️")
        line = f"{prefix}: {msg}"
        print(line)
        report_lines.append(line)
        if status == "FAIL":
            fails.append(msg)

    print("=======================================================")
    print(f"🔍 TIMEFORGE VIDEO QA AUDIT: {video_path} ({comp_id})")
    print("=======================================================\n")

    # 1. CONTAINER
    if not os.path.exists(video_path):
        log(f"Video file does not exist at {video_path}", "FAIL")
        sys.exit(1)
    code, probe_out, err = run_cmd(
        "ffprobe", "-v", "error", "-count_frames",
        "-show_entries", "stream=codec_type,width,height,r_frame_rate,nb_read_frames:format=duration",
        "-of", "json", video_path,
    )
    if code != 0:
        log(f"ffprobe could not read {video_path}: {err}", "FAIL")
        sys.exit(1)
    probe = json.loads(probe_out)
    video_stream = next((s for s in probe.get("streams", []) if s["codec_type"] == "video"), None)
    audio_stream = next((s for s in probe.get("streams", []) if s["codec_type"] == "audio"), None)
    if not video_stream:
        log("No video stream in file", "FAIL")
        sys.exit(1)

    width, height = video_stream.get("width"), video_stream.get("height")
    duration = float(probe.get("format", {}).get("duration", 0))
    fps = float(Fraction(video_stream.get("r_frame_rate", "30/1")))
    frames = int(video_stream.get("nb_read_frames") or round(duration * fps))

    log(f"Resolution {width}x{height}", "PASS" if (width, height) == (1080, 1920) else "FAIL")
    log(f"Frame rate {fps:.2f} FPS", "PASS" if abs(fps - FPS) < 0.1 else "FAIL")
    log(f"Audio stream present", "PASS" if audio_stream else "FAIL")
    log(f"Duration {duration:.2f}s (minimum {MIN_SECONDS}s)", "PASS" if duration >= MIN_SECONDS else "FAIL")

    # 2. COMPOSITION SOURCE
    src = find_source(comp_id)
    if not src:
        log(f"Composition source for {comp_id} not found under src/", "FAIL")
        tsx = ""
    else:
        with open(src, encoding="utf-8") as f:
            tsx = f.read()
        log(f"Composition source: {src}")

    # 3. AUDIO ↔ DURATION (audio path read from the composition's <Audio src=staticFile(...)>)
    m = re.search(r'<Audio\s+src=\{staticFile\("([^"]+)"\)', tsx)
    if m:
        audio_path = os.path.join("public", m.group(1))
        code, a_out, err = run_cmd("ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "json", audio_path)
        if code != 0:
            log(f"Narration audio {audio_path} unreadable: {err}", "FAIL")
        else:
            a_dur = float(json.loads(a_out)["format"]["duration"])
            expected = math.ceil(a_dur * FPS)
            log(
                f"Frames {frames} vs ceil({a_dur:.3f}s × {FPS}) = {expected} ({audio_path})",
                "PASS" if abs(frames - expected) <= 1 else "FAIL",
            )
            if "<Audio" in tsx and "<Series>" in tsx:
                root_ok = tsx.index("<Audio") < tsx.index("<Series>")
                log("<Audio/> sits at root outside <Series>", "PASS" if root_ok else "FAIL")
    else:
        log("No <Audio src={staticFile(...)}/> found in composition", "FAIL")

    # 4. SHOT PACING (each top-level beat must be 80–110f, or wrapped in <CameraShots> that splits it so)
    beats = re.findall(r"<Series\.Sequence durationInFrames=\{(\d+)\}>\s*(<CameraShots[^>]*>)?", tsx)
    bad = []
    shot_lengths = []
    for n_str, wrapped in beats:
        n = int(n_str)
        if wrapped:
            parts = split_shots(n)
            if parts is None:
                bad.append(f"{n}f cannot split into {MIN_SHOT}–{MAX_SHOT}f shots")
            else:
                shot_lengths += parts
        elif MIN_SHOT <= n <= MAX_SHOT:
            shot_lengths.append(n)
        else:
            bad.append(f"{n}f beat without <CameraShots>")
    if not beats:
        log("No <Series.Sequence> beats found", "FAIL")
    elif bad:
        log(f"Shot pacing outside {MIN_SHOT}–{MAX_SHOT}f: {bad}", "FAIL")
    else:
        log(f"{len(shot_lengths)} shots, all {min(shot_lengths)}–{max(shot_lengths)}f (spec {MIN_SHOT}–{MAX_SHOT}f)", "PASS")
    if beats:
        total = sum(int(n) for n, _ in beats)
        log(f"Series total {total}f vs rendered {frames}f", "PASS" if abs(total - frames) <= 1 else "FAIL")

    # 5. SUBTITLE STYLE
    sub_file = "src/components/timeforge/KineticSubtitle.tsx"
    m = re.search(r"<KineticSubtitle[^>]*fontSize=\{(\d+)\}", tsx)
    font = int(m.group(1)) if m else prop_default(sub_file, "fontSize")
    log(f"Subtitle fontSize {font}px (spec {SUB_MIN}–{SUB_MAX})", "PASS" if font and SUB_MIN <= font <= SUB_MAX else "FAIL")
    try:
        with open(sub_file, encoding="utf-8") as f:
            sm = re.search(r'WebkitTextStroke: "(\d+)px', f.read())
        stroke = int(sm.group(1)) if sm else None
    except OSError:
        stroke = None
    log(f"Subtitle stroke {stroke}px (spec {STROKE_MIN}–{STROKE_MAX})",
        "PASS" if stroke and STROKE_MIN <= stroke <= STROKE_MAX else "FAIL")

    # 6. COVER BADGE SAFE ZONE
    badge_file = "src/components/timeforge/CoverBadge.tsx"
    bm = re.search(r"<CoverBadge([^>]*)/>", tsx, re.S)
    if not bm:
        log("<CoverBadge> missing from composition", "FAIL")
    else:
        props = bm.group(1)
        cy = re.search(r"centerY=\{(\d+)\}", props)
        center_y = int(cy.group(1)) if cy else prop_default(badge_file, "centerY")
        ok = center_y is not None and IG_TOP <= center_y - BADGE_HALF and center_y + BADGE_HALF <= IG_BOTTOM
        log(f"CoverBadge pill Y {center_y - BADGE_HALF}–{center_y + BADGE_HALF} inside IG 1:1 {IG_TOP}–{IG_BOTTOM}",
            "PASS" if ok else "FAIL")

    # 7. SUBTITLES vs SCRIPT (in-order, verbatim, from the TSX that renders)
    script_file = os.path.join(content_dir, "script.md")
    tsx_cues = re.findall(r'text:\s*"([^"]*)"', tsx.split("SUBTITLE_WORDS", 1)[-1]) if "SUBTITLE_WORDS" in tsx else []
    if not tsx_cues:
        log("No SUBTITLE_WORDS cues found in composition", "FAIL")
    elif os.path.exists(script_file):
        norm = lambda w: re.sub(r"[^\w]", "", w.upper())
        with open(script_file, encoding="utf-8") as f:
            body = " ".join(l.strip() for l in f if l.strip() and not l.startswith(("#", ">")))
        script_words = [norm(w) for w in body.split() if norm(w)]
        sub_words = [norm(w) for c in tsx_cues for w in c.split() if norm(w)]
        if script_words == sub_words:
            log(f"Subtitles verbatim and in order ({len(sub_words)} words)", "PASS")
        else:
            i = next((k for k, (a, b) in enumerate(zip(script_words, sub_words)) if a != b), min(len(script_words), len(sub_words)))
            log(f"Subtitle text differs from script at word {i}: script={script_words[i:i+4]} subs={sub_words[i:i+4]} "
                f"({len(sub_words)}/{len(script_words)} words)", "FAIL")
    else:
        log(f"Script {script_file} not found", "WARN")

    # 8. COVER STILL (per composition)
    cover_file = os.path.join("out", f"cover-{comp_id}.png")
    if os.path.exists(cover_file):
        code, c_out, _ = run_cmd("ffprobe", "-v", "error", "-show_entries", "stream=width,height", "-of", "json", cover_file)
        c = json.loads(c_out).get("streams", [{}])[0] if code == 0 else {}
        log(f"Cover still {cover_file} {c.get('width')}x{c.get('height')}",
            "PASS" if (c.get("width"), c.get("height")) == (1080, 1920) else "FAIL")
    else:
        log(f"Cover still missing. Run: npx remotion still {comp_id} {cover_file} --frame=30", "FAIL")

    # 9. CONTACT SHEET across the full duration (12 evenly spaced frames)
    sheet_path = os.path.join(out_dir, "contact_sheet.jpg")
    rate = 12 / max(duration, 1)
    code, _, err = run_cmd(
        "ffmpeg", "-loglevel", "error", "-y", "-i", video_path,
        "-vf", f"fps={rate:.6f},scale=270:480,tile=4x3", "-frames:v", "1", sheet_path,
    )
    log(f"Contact sheet (12 frames over {duration:.0f}s): {sheet_path}" if code == 0 else f"Contact sheet failed: {err}",
        "PASS" if code == 0 else "FAIL")

    report_md = os.path.join(out_dir, "qa-report.md")
    with open(report_md, "w", encoding="utf-8") as f:
        f.write(f"# Video QA Audit Report: {comp_id}\n\n")
        f.write(f"- **Video:** `{video_path}`\n- **Resolution:** {width}x{height} @ {fps:.1f} FPS\n")
        f.write(f"- **Duration:** {duration:.2f}s / {frames} frames\n- **Result:** {'FAIL' if fails else 'PASS'}\n\n")
        f.write("## Checklist\n\n" + "".join(f"- {l}\n" for l in report_lines))
        f.write(f"\n## Visual Inspection Sheet\n\n`{sheet_path}`\n")
    print(f"\n📄 Report: {report_md}")
    print(f"\n{'❌ QA FAILED: ' + str(len(fails)) + ' check(s)' if fails else '✅ QA PASSED'}")
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
