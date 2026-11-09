---
name: channel-atm
description: Reverse-engineering mendalam berbasis computer vision dan audio processing untuk meniru dan memodifikasi (ATM) DNA produksi channel YouTube referensi (misal: @TimeForge_id, @VooksStorybooks). Wajib mengekstrak video asli, memproses frame pada 30 FPS untuk mengukur luma, bayangan, optical flow, pacing cut/shot, pitch suara narator, dan transkrip riil, bukan mengarang atau browsing Google.
version: 2.0.0
---

# Channel ATM (Amati, Tiru, Modifikasi) — Reverse Engineering Workflow

Panduan eksekusi **wajib komputasi nyata** untuk membedah video channel YouTube referensi secara saintifik pada 30 FPS menggunakan computer vision dan signal analysis, bukan menebak atau browsing teks web.

---

## PRINSIP UTAMA (ANTI-HALUSINASI)

1. **DILARANG** mengarang angka pencahayaan, posisi Three.js, atau kecepatan kata per detik dari kepala.
2. **DILARANG** hanya melakukan Web Search lalu menyimpulkan gaya visual dari hasil artikel.
3. **WAJIB** mengeksekusi pipeline 4 fase di bawah ini:
   - Download video/audio & transkrip asli.
   - Ekstrak metrik per frame (luma, kontras, bayangan p05/p95, optical flow Farneback, Bhattacharyya histogram).
   - Ukur pitch frekuensi suara narator (F0 dalam Hz) dan kecepatan kata per detik (WPM) riil.
   - Buat contact sheet frame visual untuk diverifikasi mata sebelum menulis kesimpulan.

---

## PIPELINE EKSEKUSI 4 FASE

Semua skrip otomasi tersedia di folder skill:
`DIR="<path_to_channel_atm_skill>/scripts"`

### Fase 1: Ingestion (Download Video & Metadata)

Buat direktori kerja di `/tmp/atm_<channel_slug>/`:

```bash
WORK_DIR="/tmp/atm_${CHANNEL_SLUG}"
mkdir -p "$WORK_DIR/video" "$WORK_DIR/metrics" "$WORK_DIR/tx" "$WORK_DIR/sheets"
cd "$WORK_DIR"

# 1. Ambil daftar 20 video terbaru
yt-dlp --flat-playlist --playlist-end 20 --print "%(id)s|%(duration)s|%(view_count)s|%(title)s" "https://www.youtube.com/@${CHANNEL_SLUG}/videos" > meta.txt

# 2. Download video 720p (atau 480p) + auto subtitle VTT
yt-dlp -f "bv*[height<=720]+ba/b[height<=720]" --merge-output-format mp4 \
  -o "video/%(id)s.%(ext)s" \
  --write-auto-subs --write-subs --sub-format vtt \
  --sleep-requests 1 --ignore-errors \
  -a <(cut -d'|' -f1 meta.txt | sed 's#^#https://www.youtube.com/watch?v=#')
```

*Jika YouTube memblokir bot (429/bot detection):* gunakan `--cookies-from-browser chrome` atau fallback download 5–10 video sampel yang tersedia. **Analisis minimal 5 video utuh**.

---

### Fase 2: Ekstraksi Visual & Motion Frame-by-Frame (@ 30 FPS)

Jalankan ekstraktor computer vision OpenCV pada video yang sudah diunduh:

```bash
# Analisis frame per frame (paralel 4 worker)
find video -name "*.mp4" | xargs -P 4 -n 1 -I{} python3 "$DIR/analyze-frames.py" "{}" metrics/
```

**Data yang diekstraksi per frame ke file `.npz` dan `_shots.json`:**
- **Luma (Brightness):** Rerata intensitas cahaya (0..255).
- **Contrast:** Standar deviasi luma.
- **Shadow Floor (p05):** Persentil ke-5 luma. Menjawab: *apakah channel menggunakan hitam pekat (crushed shadows) atau bayangan terang?*
- **Highlight Ceiling (p95):** Menjawab: *apakah latar belakangnya putih kertas atau bernuansa abu/warna?*
- **Saturation & Warmth:** Saturasi HSV (0..255) dan selisih R minus B (suhu hangat vs dingin).
- **Farneback Optical Flow:** Kecepatan gerak kamera (`flowmag`), zoom rate radial, dan intensitas gerak lokal karakter (`local90`).
- **Bhattacharyya Histogram Distance:** Menghitung potongan adegan nyata (hard cuts vs dissolves vs fades to black).

---

### Fase 3: Analisis Audio, Pitch & Naskah

1. **Ukur Pitch Narator (F0 dalam Hz):**
   ```bash
   for f in video/*.mp4; do
     python3 "$DIR/measure-pitch.py" "$f" 10-60 60-120
   done
   ```
   *Aturan interpretasi:*
   - `> 200 Hz`: Suara wanita atau anak-anak hangat.
   - `130 – 180 Hz`: Suara pria dewasa/ayah bersahabat.
   - `< 120 Hz`: Suara pria berat/dramatis (cinematic bass).

2. **Parse Transkrip & Ukur Kecepatan Bicara (WPM):**
   ```bash
   for f in video/*.vtt; do
     id=$(basename "$f" | cut -d'.' -f1)
     python3 "$DIR/parse-transcript.py" "$f" "tx/${id}.txt" "tx/${id}_meta.json"
   done
   ```
   *Metrik riil:* Menghasilkan WPM aktual (Words Per Minute) dan WPA (Words Per Second), serta menangkap pola 3 baris kalimat pertama (Hook) dan 3 baris kalimat penutup (CTA/Moral).

---

### Fase 4: Verifikasi Visual (Contact Sheet) & Ringkasan

1. **Generate Contact Sheets (Tiled Grids):**
   ```bash
   for f in video/*.mp4; do
     id=$(basename "$f" .mp4)
     ffmpeg -loglevel error -y -i "$f" -vf "fps=1/8,scale=320:-1,tile=8x4" -frames:v 1 "sheets/${id}_grid.jpg"
   done
   ```
   *Gunakan tool `Read` pada file `sheets/*_grid.jpg` untuk memeriksa komposisi visual dengan mata kepala sendiri.*

2. **Generate Laporan ATM Otomatis:**
   ```bash
   python3 "$DIR/summarize-atm.py" metrics/ tx/ "$WORK_DIR/ATM_REPORT.md"
   ```

---

## OUTPUT LAPORAN WAJIB

Setiap kali skill ini selesai dijalankan, wajib menyajikan:

1. **Tabel Ringkasan Metrik Terukur:**
   - Luma, Kontras, Batas Bayangan (p05), Highlight (p95).
   - Saturasi dan Suhu Warna (R-B).
   - Kecepatan gerak kamera (Flow Magnitude) dan durasi tahan shot (Median Shot Duration dalam detik).
   - Persentase transisi cut vs dissolve.
   - Pitch suara narator (Hz) dan kecepatan naskah (WPM riil).
2. **Koreografi Visual & Komposisi:**
   - Evaluasi dari contact sheet: posisi subtitle, framing karakter (close-up vs wide), konsistensi palet.
3. **Template Naskah (Berdasarkan Pola Riil yang Ditemukan):**
   - Pola hook detik 0–3 yang terbukti di video terpopuler.
   - Struktur jembatan cerita dan formula penutup.
4. **Preset Konfigurasi Siap Pakai:**
   - Konfigurasi JSON yang siap disalin ke `channel-defaults.json` atau Three.js/Remotion script.
