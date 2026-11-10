#!/usr/bin/env python3
"""Measure narrator voice pitch (F0 in Hz) using autocorrelation on voiced audio."""
import json, subprocess, sys
try:
    import numpy as np
except ImportError as e:
    sys.exit(
        f"Missing Python dependency: {e.name}. "
        "Install with: .venv/bin/pip install -r requirements.txt"
    )

SR = 16000

if len(sys.argv) < 2:
    print(f"Usage: {sys.argv[0]} <video.mp4> [<start-end> ...]", file=sys.stderr)
    sys.exit(1)

src = sys.argv[1]
ranges = sys.argv[2:] if len(sys.argv) > 2 else ["10-60", "60-120"]

results = []
for rng in ranges:
    try:
        a, b = [float(x) for x in rng.split("-")]
    except ValueError:
        continue
    raw = subprocess.run([
        "ffmpeg", "-loglevel", "error", "-ss", str(a), "-t", str(b - a),
        "-i", src, "-ac", "1", "-ar", str(SR),
        "-af", "highpass=f=70,lowpass=f=1000", "-f", "s16le", "-"
    ], capture_output=True).stdout

    x = np.frombuffer(raw, np.int16).astype(np.float32) / 32768.0
    n, hop = int(0.04 * SR), int(0.01 * SR)
    f0s = []
    rms_all = np.sqrt(np.mean(x ** 2)) + 1e-9

    for i in range(0, len(x) - n, hop):
        fr = x[i:i + n] * np.hanning(n)
        if np.sqrt(np.mean(fr ** 2)) < 0.5 * rms_all:
            continue
        ac = np.correlate(fr, fr, "full")[n - 1:]
        lo, hi = SR // 400, SR // 70
        k = lo + int(np.argmax(ac[lo:hi]))
        if ac[k] > 0.45 * ac[0]:
            f0s.append(SR / k)

    f0s = np.array(f0s)
    if len(f0s) >= 10:
        med = float(np.median(f0s))
        p25 = float(np.percentile(f0s, 25))
        p75 = float(np.percentile(f0s, 75))
        results.append({"range": rng, "median_hz": round(med, 1), "p25_hz": round(p25, 1), "p75_hz": round(p75, 1), "samples": len(f0s)})
        print(f"[{rng}s]: Median {med:.0f} Hz (IQR {p25:.0f}-{p75:.0f} Hz, N={len(f0s)})")
    else:
        print(f"[{rng}s]: Insufficient voiced audio")

if results:
    overall_med = float(np.median([r["median_hz"] for r in results]))
    gender_tag = "Female / Youth" if overall_med > 185 else "Male adult"
    print(f"Overall Pitch: {overall_med:.0f} Hz ({gender_tag})")
