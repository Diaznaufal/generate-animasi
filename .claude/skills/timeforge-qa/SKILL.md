---
name: timeforge-qa
description: Use when validating rendered 2D TimeForge explainer videos, auditing subtitle drift/alignment, inspecting Detik 0 cover stills for IG grid safe zones, checking audio-visual sync, and compiling qa-report.md.
---

# TimeForge Video QA (Verification & Delivery Gate)

SOP resmi Quality Assurance (QA) untuk memverifikasi kualitas video Remotion 2D Comic Explainer sebelum disetujui atau di-merge ke branch utama.

---

## 1. THE 5-POINT QA AUDIT CHECKLIST

Setiap video wajib lolos 5 gerbang audit di bawah ini:

### 1. File & Container Integrity
- Format file: MP4 (H.264 + AAC audio).
- Resolusi: Tepat `1080 x 1920` (Vertical 9:16 Shorts/Reels/TikTok).
- Frame Rate: Tepat `30.0 FPS`.
- Durasi: Durasi video `out/<video>.mp4` wajib sama persis dengan audio narasi `public/audio/narasi.mp3` (toleransi $\le 0.15$ detik).

### 2. Subtitle Drift & Anti-Hallucination Audit (Zero Drift)
- **Verbatim Accuracy:** Teks subtitle harus 100% sama dengan kata-kata yang diucapkan narator. Dilarang menambah atau memotong kata sembarangan.
- **Strictly Sequential:** Setiap entri `SUBTITLE_WORDS` harus memiliki `startFrame < endFrame <= next.startFrame`.
- **Tidak Boleh Overlap / Menumpuk:** Tidak boleh ada dua baris teks bertumpuk di waktu yang sama.
- **Safe Zone:** Teks berukuran 86–88px font Impact diletakkan tepat di **area dada karakter (`top: 58%`)**, bukan di footer layar agar tidak tertutup tombol interface TikTok/Reels/Shorts.

### 3. Detik 0 CoverBadge (IG Grid & Shorts Thumbnail)
- Komposisi wajib mem-mount `<CoverBadge />` di frame 0–45.
- Berada di dalam **Safe Zone Instagram 1:1 Grid (`Y: 420–1500`)**.
- File still cover wajib diekspor ke `out/cover.png` pada frame 30:
  ```bash
  npx remotion still <CompositionId> out/cover.png --frame=30
  ```
- Di frame 60, badge merapat (*docking*) halus ke pojok kiri atas dan title memudar.

### 4. Pacing & Camera Dynamics
- Video berdurasi 30–60 detik dibagi menjadi adegan modular per **2.5 – 3.5 detik (75–105 frame)** menggunakan `<Series>`.
- Dilarang ada adegan statis (tanpa zoom atau pan) selama lebih dari 4 detik.

### 5. Visual Inspection Sheet (Contact Sheet)
- Generate contact sheet tiled grid untuk memeriksa seluruh potongan adegan secara visual sebelum deliver:
  ```bash
  ffmpeg -y -i out/<video>.mp4 -vf "fps=1/3,scale=270:480,tile=4x3" -frames:v 1 out/qa-report/contact_sheet.jpg
  ```

---

## 2. AUTOMATED QA EXECUTION

Jalankan script verifikasi otomatis untuk memeriksa kelima gerbang di atas sekaligus:

```bash
.venv/bin/python scripts/qa_video.py out/<video-name>.mp4 <CompositionId> content/<topic-slug>
```

**Output:**
- Output terminal: Laporan status `✅ PASS` / `❌ FAIL` untuk setiap gerbang.
- Laporan tertulis: `out/qa-report/qa-report.md`.
- Lembar visual: `out/qa-report/contact_sheet.jpg`.

Jika ada status `❌ FAIL` pada subtitle drift atau cover, perbaiki naskah atau cue frame sebelum mengajukan PR!
