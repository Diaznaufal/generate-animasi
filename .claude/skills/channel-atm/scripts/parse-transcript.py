#!/usr/bin/env python3
"""Parse YouTube rolling VTT subtitles into timestamped sentences and pacing metrics."""
import html, json, os, re, sys

if len(sys.argv) < 3:
    print(f"Usage: {sys.argv[0]} <input.vtt> <output.txt> [output_meta.json]", file=sys.stderr)
    sys.exit(1)

src, dst = sys.argv[1], sys.argv[2]
meta_dst = sys.argv[3] if len(sys.argv) > 3 else None

def parse_time(h, m, s, ms):
    hours = int(h) if h else 0
    return hours * 3600 + int(m) * 60 + int(s) + int(ms) / 1000.0

text = open(src, encoding="utf-8").read()
cues = re.split(r"\n\n+", text)
out, last = [], ""
all_words = []
start_timestamps = []
end_timestamps = []

time_pattern = re.compile(
    r"(?:(\d{1,2}):)?(\d{2}):(\d{2})\.(\d{3})\s+-->\s+(?:(\d{1,2}):)?(\d{2}):(\d{2})\.(\d{3})"
)

for c in cues:
    m = time_pattern.search(c)
    if not m:
        continue

    start_sec = parse_time(m.group(1), m.group(2), m.group(3), m.group(4))
    end_sec = parse_time(m.group(5), m.group(6), m.group(7), m.group(8))

    # Get lines after timestamp
    m_idx = c.find("-->")
    ts_newline = c.find("\n", m_idx)
    lines = c[ts_newline + 1:].split("\n") if ts_newline != -1 else []

    timed = [l for l in lines if "<c>" in l or re.search(r"<\d\d:", l)]
    if timed:
        line = re.sub(r"<[^>]+>", "", timed[-1])
    else:
        line = lines[-1] if lines else ""

    line = html.unescape(line).strip()
    if line and line != last:
        t_fmt = f"{int(start_sec // 60):02d}:{int(start_sec % 60):02d}"
        out.append(f"[{t_fmt}] {line}")
        last = line
        start_timestamps.append(start_sec)
        end_timestamps.append(end_sec)
        all_words.extend(line.split())

os.makedirs(os.path.dirname(dst) or ".", exist_ok=True)
open(dst, "w", encoding="utf-8").write("\n".join(out) + "\n")

dur_s = (end_timestamps[-1] - start_timestamps[0]) if start_timestamps and end_timestamps else 0
wpm = (len(all_words) / dur_s * 60.0) if dur_s > 0 else 0
wps = (len(all_words) / dur_s) if dur_s > 0 else 0

meta = {
    "total_words": len(all_words),
    "duration_seconds": round(dur_s, 2),
    "words_per_minute": round(wpm, 1),
    "words_per_second": round(wps, 2),
    "opening_sample": " ".join([l.split("] ", 1)[-1] for l in out[:3]]),
    "closing_sample": " ".join([l.split("] ", 1)[-1] for l in out[-3:]])
}

if meta_dst:
    os.makedirs(os.path.dirname(meta_dst) or ".", exist_ok=True)
    json.dump(meta, open(meta_dst, "w", encoding="utf-8"), indent=2, ensure_ascii=False)

print(f"{dst}: {len(all_words)} words, {dur_s:.1f}s, {wpm:.1f} WPM ({wps:.2f} words/s)")
