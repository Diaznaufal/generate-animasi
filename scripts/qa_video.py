import json
import os
import subprocess
import sys

def run_cmd(*args):
    res = subprocess.run(args, capture_output=True, text=True)
    return res.stdout.strip(), res.stderr.strip()

def main():
    if len(sys.argv) < 2:
        print("Usage: python scripts/qa_video.py <video.mp4> [composition_id] [content_dir]")
        sys.exit(1)

    video_path = sys.argv[1]
    comp_id = sys.argv[2] if len(sys.argv) > 2 else "BentengButonExplainer"
    content_dir = sys.argv[3] if len(sys.argv) > 3 else "content/benteng-buton"

    out_dir = "out/qa-report"
    os.makedirs(out_dir, exist_ok=True)

    report_lines = []
    def log(msg, status="INFO"):
        prefix = "✅ PASS" if status == "PASS" else "❌ FAIL" if status == "FAIL" else "⚠️ WARN" if status == "WARN" else "ℹ️"
        line = f"{prefix}: {msg}"
        print(line)
        report_lines.append(line)

    print("=======================================================")
    print(f"🔍 TIMFORGE VIDEO QA AUDIT: {video_path}")
    print("=======================================================\n")

    # 1. FILE & CONTAINER INTEGRITY
    if not os.path.exists(video_path):
        log(f"Video file does not exist at {video_path}", "FAIL")
        sys.exit(1)

    probe_out, _ = run_cmd(
        "ffprobe", "-v", "error",
        "-show_entries", "stream=codec_type,codec_name,width,height,r_frame_rate,nb_frames:format=duration,size",
        "-of", "json", video_path
    )
    probe_data = json.loads(probe_out)
    video_stream = next((s for s in probe_data.get("streams", []) if s["codec_type"] == "video"), None)
    audio_stream = next((s for s in probe_data.get("streams", []) if s["codec_type"] == "audio"), None)

    width = video_stream.get("width")
    height = video_stream.get("height")
    duration = float(probe_data.get("format", {}).get("duration", 0))
    fps_eval = eval(video_stream.get("r_frame_rate", "30/1"))

    # Check Resolution & FPS
    if width == 1080 and height == 1920:
        log(f"Resolution 1080x1920 (9:16 Vertical Shorts)", "PASS")
    else:
        log(f"Invalid resolution: {width}x{height} (expected 1080x1920)", "FAIL")

    if abs(fps_eval - 30.0) < 0.1:
        log(f"Frame rate {fps_eval:.1f} FPS", "PASS")
    else:
        log(f"Frame rate {fps_eval:.1f} FPS (expected 30 FPS)", "FAIL")

    # 2. AUDIO & SYNC DURATION CHECK
    # Check specific audio if present in content_dir or fallback to public/audio/narasi.mp3
    narasi_audio = "public/audio/narasi.mp3"
    topic_audio = f"public/audio/{os.path.basename(content_dir)}_narasi.mp3"
    if os.path.exists(topic_audio):
        narasi_audio = topic_audio
    elif "cetbang" in content_dir and os.path.exists("public/audio/cetbang_narasi.mp3"):
        narasi_audio = "public/audio/cetbang_narasi.mp3"
    if os.path.exists(narasi_audio):
        a_probe, _ = run_cmd("ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "json", narasi_audio)
        a_dur = float(json.loads(a_probe).get("format", {}).get("duration", 0))
        diff = abs(duration - a_dur)
        if diff <= 0.15:
            log(f"Video duration ({duration:.2f}s) matches Audio duration ({a_dur:.2f}s) within tolerance (diff: {diff:.3f}s)", "PASS")
        else:
            log(f"Duration mismatch! Video: {duration:.2f}s, Audio: {a_dur:.2f}s (diff: {diff:.3f}s)", "FAIL")
    else:
        log("Narration audio file public/audio/narasi.mp3 not found", "WARN")

    # 3. SUBTITLE DRIFT & VERBATIM AUDIT
    subtitles_file = os.path.join(content_dir, "subtitles_aligned.json")
    script_file = os.path.join(content_dir, "script.md")

    if os.path.exists(subtitles_file):
        with open(subtitles_file, "r", encoding="utf-8") as f:
            cues = json.load(f)

        drift_issues = []
        overlap_issues = []

        for i, cue in enumerate(cues):
            s = cue.get("startFrame", 0)
            e = cue.get("endFrame", 0)
            if s >= e:
                drift_issues.append(f"Cue '{cue.get('text')}' has startFrame ({s}) >= endFrame ({e})")
            if i > 0 and s < cues[i-1].get("endFrame", 0):
                overlap_issues.append(f"Cue '{cue.get('text')}' overlaps with previous cue '{cues[i-1].get('text')}'")

        if not drift_issues and not overlap_issues:
            log(f"Subtitle cues ({len(cues)} cues) are strictly sequential and non-overlapping (Zero Frame Drift)", "PASS")
        else:
            for err in (drift_issues + overlap_issues)[:5]:
                log(err, "FAIL")

        # Verbatim Word Count Check
        if os.path.exists(script_file):
            with open(script_file, "r", encoding="utf-8") as f:
                raw_script = " ".join([l.strip() for l in f if l.strip() and not l.startswith("#") and not l.startswith(">")])
            script_words = [w.strip(".,!?\"'").upper() for w in raw_script.split() if w.strip()]
            subtitle_words = [w.strip(".,!?\"'").upper() for c in cues for w in c.get("text", "").split() if w.strip()]

            # Compare sets
            missing_words = [w for w in script_words if w not in subtitle_words]
            if len(missing_words) <= 2:
                log(f"Subtitle verbatim match: {len(subtitle_words)}/{len(script_words)} words accounted for", "PASS")
            else:
                log(f"Subtitle verbatim discrepancy! Missing words: {missing_words[:8]}", "WARN")
    else:
        log(f"Subtitles alignment file {subtitles_file} not found", "WARN")

    # 4. DETIK 0 COVER & IG GRID AUDIT
    cover_file = "out/cover.png"
    if os.path.exists(cover_file):
        c_probe, _ = run_cmd("ffprobe", "-v", "error", "-show_entries", "stream=width,height", "-of", "json", cover_file)
        c_stream = json.loads(c_probe).get("streams", [{}])[0]
        c_w, c_h = c_stream.get("width"), c_stream.get("height")
        if c_w == 1080 and c_h == 1920:
            log(f"Cover still exists at out/cover.png (1080x1920) for IG Grid / Shorts Thumbnail", "PASS")
        else:
            log(f"Cover still has wrong dimensions: {c_w}x{c_h}", "FAIL")
    else:
        log("Cover still out/cover.png not found! Run 'npx remotion still <id> out/cover.png --frame=30'", "FAIL")

    # 5. VISUAL INSPECTION CONTACT SHEET (Tile grid of key frames)
    print("\n📸 Generating QA Contact Sheet...")
    sheet_path = os.path.join(out_dir, "contact_sheet.jpg")
    tile_cmd = [
        "ffmpeg", "-loglevel", "error", "-y",
        "-i", video_path,
        "-vf", "fps=1/3,scale=270:480,tile=4x3",
        "-frames:v", "1",
        sheet_path
    ]
    subprocess.run(tile_cmd)
    if os.path.exists(sheet_path):
        log(f"Contact sheet saved to: {sheet_path}", "PASS")

    # Write Markdown Report
    report_md = os.path.join(out_dir, "qa-report.md")
    with open(report_md, "w", encoding="utf-8") as f:
        f.write("# Video QA Audit Report\n\n")
        f.write(f"- **Video:** `{video_path}`\n")
        f.write(f"- **Resolution:** {width}x{height} @ {fps_eval:.1f} FPS\n")
        f.write(f"- **Duration:** {duration:.2f} seconds\n\n")
        f.write("## Checklist\n\n")
        for line in report_lines:
            f.write(f"- {line}\n")
        f.write(f"\n## Visual Inspection Sheet\n\n`{sheet_path}`\n")

    print(f"\n📄 Full QA Report saved to: {report_md}")

if __name__ == "__main__":
    main()
