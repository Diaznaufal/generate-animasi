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
- Durasi: minimal 60 detik, dan jumlah frame = `ceil(durasi audio × 30)` (toleransi 1 frame). Audio dibaca dari `<Audio src={staticFile(...)}>` di komposisi.

### 2. Subtitle Drift & Anti-Hallucination Audit (Zero Drift)
- **Verbatim Accuracy:** Kata-kata `SUBTITLE_WORDS` di file `.tsx` yang dirender harus sama persis dan berurutan dengan `script.md` (tanda baca diabaikan).
- **Strictly Sequential:** Setiap entri `SUBTITLE_WORDS` harus memiliki `startFrame < endFrame <= next.startFrame`.
- **Tidak Boleh Overlap / Menumpuk:** Tidak boleh ada dua baris teks bertumpuk di waktu yang sama.
- **Ukuran & Safe Zone:** Teks 42–56px font Impact weight 900, stroke 3–5px, diletakkan tepat di **area dada karakter (`top: 58%`)**, bukan di footer layar agar tidak tertutup tombol interface TikTok/Reels/Shorts.

### 3. Detik 0 CoverBadge (IG Grid & Shorts Thumbnail)
- Komposisi wajib mem-mount `<CoverBadge />` di frame 0–45.
- Pill badge (`centerY ± 32`) berada di dalam **Safe Zone Instagram 1:1 Grid (`Y: 420–1500`)**.
- File still cover wajib diekspor per komposisi pada frame 30:
  ```bash
  npx remotion still <CompositionId> out/cover-<CompositionId>.png --frame=30
  ```
- Badge merapat pada frame 42–60 dan selesai di frame 60; badge merapat (*docking*) halus ke pojok kiri atas dan title memudar.

### 4. Pacing & Camera Dynamics
- Video berdurasi minimal 60 detik dibagi menjadi shot **80–110 frame** menggunakan `<Series>`. Beat yang lebih panjang wajib dibungkus `<CameraShots>`.
- Dilarang ada adegan statis (tanpa zoom atau pan) selama lebih dari 4 detik.

### 5. Visual Inspection Sheet (Contact Sheet)
- Generate contact sheet tiled grid untuk memeriksa seluruh potongan adegan secara visual sebelum deliver:
  ```bash
  ffmpeg -y -i out/<video>.mp4 -vf "fps=12/<durasi_detik>,scale=270:480,tile=4x3" -frames:v 1 out/qa-report/contact_sheet.jpg
  ```

---

## 2. AUTOMATED QA EXECUTION

Jalankan script verifikasi otomatis untuk memeriksa kelima gerbang di atas sekaligus. Script keluar dengan kode 1 bila ada `❌ FAIL`, jadi bisa dipakai sebagai gate:

```bash
.venv/bin/python scripts/qa_video.py out/<video-name>.mp4 <CompositionId> content/<topic-slug>
```

**Output:**
- Output terminal: Laporan status `✅ PASS` / `❌ FAIL` untuk setiap gerbang.
- Laporan tertulis: `out/qa-report/<CompositionId>/qa-report.md`.
- Lembar visual: `out/qa-report/<CompositionId>/contact_sheet.jpg` (12 frame merata sepanjang video).

Jika ada status `❌ FAIL` pada subtitle drift atau cover, perbaiki naskah atau cue frame sebelum mengajukan PR!
