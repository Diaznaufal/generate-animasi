#!/usr/bin/env python3
"""Per-frame computer vision analysis of video at 30 fps.

Extracts lighting, contrast, color temperature, optical flow, and shot boundaries.
Outputs <out_dir>/<id>.npz and <out_dir>/<id>_shots.json.
"""
import json, os, subprocess, sys, tempfile

try:
    import numpy as np
    import cv2
except ImportError as e:
    sys.exit(
        f"Missing Python dependency: {e.name}. "
        "Install with: .venv/bin/pip install -r requirements.txt"
    )

FPS = 30
LONG_SIDE = 192  # analysis resolution: long edge in px, aspect ratio preserved

if len(sys.argv) < 3:
    print(f"Usage: {sys.argv[0]} <video.mp4> <out_dir>", file=sys.stderr)
    sys.exit(1)

src, out_dir = sys.argv[1], sys.argv[2]


def probe_size(path):
    """Return (width, height) of the first video stream, rotation applied."""
    r = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0",
         "-show_entries", "stream=width,height:stream_side_data=rotation",
         "-of", "json", path],
        capture_output=True, text=True,
    )
    if r.returncode != 0:
        sys.exit(f"ffprobe failed on {path} (exit {r.returncode}): {r.stderr.strip()}")
    st = json.loads(r.stdout)["streams"][0]
    w, h = int(st["width"]), int(st["height"])
    rot = next((abs(int(d.get("rotation", 0))) for d in st.get("side_data_list", [])), 0)
    return (h, w) if rot in (90, 270) else (w, h)


def even(x):
    return max(2, int(round(x / 2)) * 2)


src_w, src_h = probe_size(src)
if src_w >= src_h:
    W, H = LONG_SIDE, even(LONG_SIDE * src_h / src_w)
else:
    W, H = even(LONG_SIDE * src_w / src_h), LONG_SIDE  # 9:16 Shorts -> 108x192
vid = os.path.basename(src).rsplit(".", 1)[0]
os.makedirs(out_dir, exist_ok=True)

cmd = [
    "ffmpeg", "-loglevel", "error", "-i", src,
    "-vf", f"fps={FPS},scale={W}:{H}:flags=area",
    "-pix_fmt", "rgb24", "-f", "rawvideo", "-"
]
err_log = tempfile.TemporaryFile()  # file, not a pipe: a chatty ffmpeg cannot deadlock us
proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=err_log, bufsize=W * H * 3 * 64)
size = W * H * 3

keys = [
    "luma", "contrast", "p05", "p95", "sat", "hue", "warm",
    "diff", "hist", "tx", "ty", "zoom", "rot", "local", "flowmag"
]
m = {k: [] for k in keys}
prev_g = prev_h = None
ys, xs = np.mgrid[0:H, 0:W].astype(np.float32)
xs -= W / 2
ys -= H / 2
r2 = xs * xs + ys * ys + 1e-6

while True:
    buf = proc.stdout.read(size)
    if len(buf) < size:
        break
    rgb = np.frombuffer(buf, np.uint8).reshape(H, W, 3)
    g = cv2.cvtColor(rgb, cv2.COLOR_RGB2GRAY)
    hsv = cv2.cvtColor(rgb, cv2.COLOR_RGB2HSV)
    lum = g.astype(np.float32)

    m["luma"].append(float(lum.mean()))
    m["contrast"].append(float(lum.std()))
    p = np.percentile(lum, [5, 95])
    m["p05"].append(float(p[0]))
    m["p95"].append(float(p[1]))

    s = hsv[..., 1].astype(np.float32)
    m["sat"].append(float(s.mean()))

    # Saturation-weighted circular mean hue (0..360)
    ang = hsv[..., 0].astype(np.float32) * (np.pi / 90)
    wgt = s * (hsv[..., 2] > 30)
    m["hue"].append(float((np.degrees(np.arctan2((np.sin(ang) * wgt).sum(), (np.cos(ang) * wgt).sum())) % 360)))

    r, gg, b = [rgb[..., i].astype(np.float32).mean() for i in range(3)]
    m["warm"].append(float(r - b))

    h = cv2.calcHist([hsv], [0, 1], None, [18, 8], [0, 180, 0, 256])
    cv2.normalize(h, h, 1, 0, cv2.NORM_L1)

    if prev_g is None:
        for k in ["diff", "hist", "tx", "ty", "zoom", "rot", "local", "flowmag"]:
            m[k].append(0.0)
    else:
        m["diff"].append(float(np.abs(lum - prev_g.astype(np.float32)).mean()))
        m["hist"].append(float(cv2.compareHist(prev_h, h, cv2.HISTCMP_BHATTACHARYYA)))
        f = cv2.calcOpticalFlowFarneback(prev_g, g, None, 0.5, 3, 15, 3, 5, 1.2, 0)
        fx, fy = f[..., 0], f[..., 1]
        tx, ty = float(np.median(fx)), float(np.median(fy))
        rx, ry = fx - tx, fy - ty
        zoom = float(((rx * xs + ry * ys) / r2).mean())
        rot = float(((ry * xs - rx * ys) / r2).mean())
        resid = np.sqrt((rx - zoom * xs) ** 2 + (ry - zoom * ys) ** 2)
        m["tx"].append(tx)
        m["ty"].append(ty)
        m["zoom"].append(zoom)
        m["rot"].append(rot)
        m["local"].append(float(np.percentile(resid, 90)))
        m["flowmag"].append(float(np.sqrt(fx**2 + fy**2).mean()))
    prev_g, prev_h = g, h

if proc.wait() != 0:
    err_log.seek(0)
    err = err_log.read().decode(errors="replace").strip()
    sys.exit(f"ffmpeg failed on {src} (exit {proc.returncode}): {err}")
if not m["luma"]:
    sys.exit(f"ffmpeg decoded 0 frames from {src}")

arr = {k: np.asarray(v, np.float32) for k, v in m.items()}
np.savez_compressed(os.path.join(out_dir, f"{vid}.npz"), **arr)

# Cut detection (Bhattacharyya histogram jump + pixel diff jump)
# Minimum 15 frames (~0.5s) between cuts to prevent false positives from fast 3D camera rotation
d, hd = arr["diff"], arr["hist"]
n = len(d)
cuts, dissolves = [], []
for i in range(1, n):
    lo, hi = max(1, i - 15), min(n, i + 16)
    neigh = np.median(hd[lo:hi])
    if hd[i] > 0.28 and d[i] > 12 and hd[i] > 3 * neigh + 0.05:
        if not cuts or i - cuts[-1] >= 15:
            cuts.append(i)

# Dissolve detection
win = 12
cs = np.convolve(hd, np.ones(win), "same")
i = 0
while i < n:
    if cs[i] > 1.2 and not any(abs(i - c) < win for c in cuts):
        j = i
        while j < n and cs[j] > 0.6:
            j += 1
        if j - i >= 8:
            dissolves.append((i, j))
        i = j + 1
    else:
        i += 1

fades = [int(k) for k in np.where((arr["luma"][1:] < 8) & (arr["luma"][:-1] >= 8))[0]]
dissolve_bounds = [a for a, _ in dissolves] + [b for _, b in dissolves]
raw_bounds = sorted(set([0] + cuts + fades + dissolve_bounds + [n]))

# Merge micro-intervals (<= 6 frames) into adjacent shots rather than dropping them as timeline gaps
clean_bounds = [raw_bounds[0]]
for b in raw_bounds[1:]:
    if b - clean_bounds[-1] >= 8:
        clean_bounds.append(b)
    else:
        clean_bounds[-1] = b
if clean_bounds[-1] != n:
    clean_bounds.append(n)

shots = [(clean_bounds[k], clean_bounds[k + 1]) for k in range(len(clean_bounds) - 1)]

json.dump({
    "id": vid, "frames": n, "fps": FPS,
    "cuts": cuts, "dissolves": dissolves, "fades_to_black": fades,
    "shots": shots
}, open(os.path.join(out_dir, f"{vid}_shots.json"), "w"))

print(f"{vid}: {n} frames, {len(cuts)} cuts, {len(dissolves)} dissolves, {len(shots)} shots")
