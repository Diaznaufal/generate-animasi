#!/usr/bin/env python3
"""Aggregate frame metrics, shots, transcripts, and pitch data into a complete ATM markdown report."""
import glob, json, os, sys
try:
    import numpy as np
except ImportError as e:
    sys.exit(
        f"Missing Python dependency: {e.name}. "
        "Install with: .venv/bin/pip install -r requirements.txt"
    )

if len(sys.argv) < 3:
    print(f"Usage: {sys.argv[0]} <metrics_dir> <transcripts_dir> [output.md]", file=sys.stderr)
    sys.exit(1)

metrics_dir = sys.argv[1]
tx_dir = sys.argv[2]
out_md = sys.argv[3] if len(sys.argv) > 3 else None

shot_files = sorted(glob.glob(os.path.join(metrics_dir, "*_shots.json")))
if not shot_files:
    print(f"Error: No *_shots.json found in {metrics_dir}", file=sys.stderr)
    sys.exit(1)

rows = []
all_durs = []
lumas, contrasts, sats, warms, p05s, p95s = [], [], [], [], [], []
flows, locals_, zooms, txs = [], [], [], []
total_cuts, total_dissolves, total_frames = 0, 0, 0

for sf in shot_files:
    vid = os.path.basename(sf).replace("_shots.json", "")
    nf = os.path.join(metrics_dir, f"{vid}.npz")
    if not os.path.exists(nf):
        continue
    sdata = json.load(open(sf))
    ndata = np.load(nf)

    frames = sdata["frames"]
    total_frames += frames
    cuts = sdata.get("cuts", [])
    diss = sdata.get("dissolves", [])
    shots = sdata.get("shots", [])
    total_cuts += len(cuts)
    total_dissolves += len(diss)

    durs = [(b - a) / 30.0 for a, b in shots]
    all_durs.extend(durs)
    med_dur = float(np.median(durs)) if durs else 0.0

    med_l = float(np.median(ndata["luma"]))
    med_c = float(np.median(ndata["contrast"]))
    med_s = float(np.median(ndata["sat"]))
    med_w = float(np.median(ndata["warm"]))
    med_p05 = float(np.median(ndata["p05"]))
    med_p95 = float(np.median(ndata["p95"]))
    med_flow = float(np.median(ndata["flowmag"]))
    loc90 = float(np.percentile(ndata["local"], 90))
    med_zoom = float(np.median(np.abs(ndata["zoom"])))
    med_tx = float(np.median(np.abs(ndata["tx"])))

    lumas.append(med_l); contrasts.append(med_c); sats.append(med_s); warms.append(med_w)
    p05s.append(med_p05); p95s.append(med_p95); flows.append(med_flow); locals_.append(loc90)
    zooms.append(med_zoom); txs.append(med_tx)

    # Transcript pacing if exists
    tx_f = os.path.join(tx_dir, f"{vid}.txt")
    wpm_str = "N/A"
    if os.path.exists(tx_f):
        tx_lines = open(tx_f).read().splitlines()
        words = sum(len(l.split("] ", 1)[-1].split()) for l in tx_lines if "] " in l)
        dur = frames / 30.0
        if dur > 10:
            wpm_str = f"{(words / dur * 60):.1f}"

    rows.append({
        "id": vid, "dur_s": round(frames / 30.0, 1), "shots": len(shots),
        "med_shot": round(med_dur, 2), "luma": round(med_l, 1), "contrast": round(med_c, 1),
        "p05": round(med_p05, 1), "p95": round(med_p95, 1), "sat": round(med_s, 1),
        "warm": round(med_w, 1), "flow": round(med_flow, 4), "local90": round(loc90, 3),
        "wpm": wpm_str
    })

lines = [
    f"# Channel ATM Reverse-Engineering Report",
    f"",
    f"**Total Footage Analyzed:** {len(rows)} videos, {total_frames:,} frames ({total_frames/30/60:.1f} minutes @ 30 FPS).",
    f"",
    f"## 1. Key Production Metrics (Medians across all videos)",
    f"",
    f"| Metric | Measured Value | Practical Meaning / Guideline |",
    f"|---|---|---|",
    f"| **Average Luma (Brightness)** | **{np.median(lumas):.1f} / 255** ({np.median(lumas)/255*100:.1f}%) | Base brightness. High (>170) = bright storybook, Mid (100-160) = standard, Low (<90) = dark cinematic |",
    f"| **Contrast (Std Dev)** | **{np.median(contrasts):.1f}** | Shadow softness. Low (<45) = soft flat vector, High (>60) = dramatic deep shadows |",
    f"| **Shadow Floor (p05)** | **{np.median(p05s):.1f} / 255** | Black point floor. If >70, pure black is never used (crushed shadows forbidden) |",
    f"| **Highlight Ceiling (p95)** | **{np.median(p95s):.1f} / 255** | Peak brightness ceiling. If ~240-250, clean white/paper background is common |",
    f"| **Dynamic Range (p95 - p05)** | **{np.median(np.array(p95s) - np.array(p05s)):.1f}** | Overall tonal spread |",
    f"| **Color Saturation** | **{np.median(sats):.1f} / 255** ({np.median(sats)/255*100:.1f}%) | Muted pastel (<80) vs vivid/commercial (>100) |",
    f"| **Color Warmth (R - B)** | **{np.median(warms):+.1f}** | Positive = warm amber/cream; Negative = cool teal/blue |",
    f"| **Optical Flow Magnitude** | **{np.median(flows):.4f} px/f** | Overall movement speed on screen |",
    f"| **Local Animation (p90 residue)** | **{np.median(locals_):.3f}** | Micro-animation inside characters (napas, kedip, goyang) |",
    f"| **Shot Duration (Median)** | **{np.median(all_durs):.2f}s** (p25: {np.percentile(all_durs, 25):.2f}s, p75: {np.percentile(all_durs, 75):.2f}s) | Minimum image holding time before cutting |",
    f"| **Transition Ratio** | **{total_dissolves/(total_cuts+total_dissolves+1e-5)*100:.1f}% Dissolves** ({total_dissolves} diss / {total_cuts} cuts) | Frequency of crossfade/dissolve vs hard straight cut |",
    f"",
    f"## 2. Per-Video Breakdown",
    f"",
    f"| Video ID | Dur (s) | Shots | Med Shot (s) | Luma | Contrast | P05 (Shadow) | P95 (High) | Sat | Warm | Flow | Local90 | Pacing (WPM) |",
    f"|---|---|---|---|---|---|---|---|---|---|---|---|---|",
]

for r in rows:
    lines.append(f"| `{r['id']}` | {r['dur_s']} | {r['shots']} | {r['med_shot']} | {r['luma']} | {r['contrast']} | {r['p05']} | {r['p95']} | {r['sat']} | {r['warm']:+} | {r['flow']} | {r['local90']} | {r['wpm']} |")

report_txt = "\n".join(lines) + "\n"
if out_md:
    os.makedirs(os.path.dirname(out_md) or ".", exist_ok=True)
    open(out_md, "w", encoding="utf-8").write(report_txt)
    print(f"Report written to {out_md}")
else:
    print(report_txt)
