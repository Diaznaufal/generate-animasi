#!/usr/bin/env python3
"""Parse YouTube rolling VTT subtitles into timestamped sentences and pacing metrics."""
import html, json, os, re, sys

if len(sys.argv) < 3:
    print(f"Usage: {sys.argv[0]} <input.vtt> <output.txt> [output_meta.json]", file=sys.stderr)
    sys.exit(1)

src, dst = sys.argv[1], sys.argv[2]
meta_dst = sys.argv[3] if len(sys.argv) > 3 else None

text = open(src, encoding="utf-8").read()
cues = re.split(r"\n\n+", text)
out, last = [], ""
all_words = []
timestamps = []

for c in cues:
    m = re.match(r"(\d\d:\d\d:\d\d\.\d\d\d) --> ", c)
    if not m:
        continue
    t_str = m.group(1)[:8]
    parts = t_str.split(":")
    sec = int(parts[0]) * 3600 + int(parts[1]) * 60 + int(parts[2])

    lines = c.split("\n")[1:]
    timed = [l for l in lines if "<c>" in l or re.search(r"<\d\d:", l)]
    if timed:
        line = re.sub(r"<[^>]+>", "", timed[-1])
    else:
        line = lines[-1] if lines else ""

    line = html.unescape(line).strip()
    if line and line != last:
        out.append(f"[{t_str}] {line}")
        last = line
        timestamps.append(sec)
        all_words.extend(line.split())

os.makedirs(os.path.dirname(dst) or ".", exist_ok=True)
open(dst, "w", encoding="utf-8").write("\n".join(out) + "\n")

dur_s = (timestamps[-1] - timestamps[0]) if len(timestamps) >= 2 else 0
wpm = (len(all_words) / dur_s * 60.0) if dur_s > 0 else 0
wps = (len(all_words) / dur_s) if dur_s > 0 else 0

meta = {
    "total_words": len(all_words),
    "duration_seconds": dur_s,
    "words_per_minute": round(wpm, 1),
    "words_per_second": round(wps, 2),
    "opening_sample": " ".join([l.split("] ", 1)[-1] for l in out[:3]]),
    "closing_sample": " ".join([l.split("] ", 1)[-1] for l in out[-3:]])
}

if meta_dst:
    os.makedirs(os.path.dirname(meta_dst) or ".", exist_ok=True)
    json.dump(meta, open(meta_dst, "w", encoding="utf-8"), indent=2, ensure_ascii=False)

print(f"{dst}: {len(all_words)} words, {dur_s}s, {wpm:.1f} WPM ({wps:.2f} words/s)")
