---
name: channel-atm
description: Workflow komprehensif untuk Amati-Tiru-Modifikasi (ATM) dan reverse-engineering channel referensi (seperti YouTube @TimeForge_id), mencakup analisis visual 3D 30fps (lighting, shadow, contrast, movement, VFX, camera cuts) serta dekonstruksi narasi/scriptwriting (hook, pacing, storytelling). Gunakan saat ingin meniru gaya channel, bedah referensi visual/audio, atau benchmarking gaya video eksplainer baru.
version: 1.0.0
---

# Channel ATM (Amati, Tiru, Modifikasi) Skill

Pedoman terstruktur untuk membedah, menganalisis, dan mereplikasi DNA produksi dari channel referensi video animasi/explainer 3D (misal: `https://www.youtube.com/@TimeForge_id/`).

## 1. TUJUAN & LINGKUP
Melakukan reverse-engineering hingga 20 video terbaru pada frame rate standar 30 FPS untuk mengekstraksi:
1. **Visual & 3D Rendering Language** (Lighting, Shadow, Kontras, Pergerakan Kamera & Objek).
2. **Editing & Pacing Cadence** (Cut point, ritme adegan, transisi antar-sequence).
3. **Scriptwriting & Narrative Blueprint** (Hook 3 detik pertama, struktur argumen, tone suara, penutup).

---

## 2. CHECKLIST DEKONSTRUKSI VISUAL (FRAME-BY-FRAME @ 30 FPS)

Saat menganalisis video referensi, dokumentasikan poin-poin berikut:

### 2.1 Lighting & Ambiance
- **Key Light:** Arah sudut datang cahaya (arah matahari outdoor, low sun angle, frontal, side rim light).
- **Color Temperature & Sky Light:** Warna ambient langit (sejuk kebiruan `#7dd3fc`, hangat sore oranye, atau dusk).
- **Intensitas & Mood:** Soft natural daylight, high contrast dramatic, atau stylized comic/clay look.

### 2.2 Contrast & Color Palette
- **Primary vs Accent:** Warna dominan latar tanah/bangunan versus warna penarik perhatian (misal: panah indikator, highlight kuning `#FACC15`).
- **Saturation Level:** Tingkat saturasi objek (apakah pastel matte, vibrant comic, atau semi-photorealistic).

### 2.3 Shadow & Depth
- **Shadow Character:** Hard directional shadows vs soft ambient occlusion (AO).
- **Placement & Contact:** Bayangan kontak objek ke lantai $Y = 0$ (menjamin objek tidak terlihat mengambang di ruang hampa).

### 2.4 Movement & Camera Choreography
- **Kamera Dinamis:** Pola pergerakan per adegan (slow push-in, orbital 3D turn, dynamic pan, low-angle tracking).
- **Objek & Karakter:** Kecepatan animasi komponen, penggunaan easing/spring (misal: elastisitas bouncing saat balok jatuh).
- **Visual Micro-Movements:** Detail lingkungan yang hidup (daun bergoyang via sinusoida, partikel debu/asap berkedip).

### 2.5 Effects & Compositing
- **Visual Cues:** Garis retakan dinamis, panah penyebaran gaya beban, highlight selektif, shockwave/shake saat benturan.
- **Atmospheric Particles:** Partikel hujan, kepulan asap tungku, uap air, kabut tipis pekarangan.

### 2.6 Cuts & Editing Pacing
- **Scene Duration:** Rata-rata durasi per shot/adegan (umumnya 2.5 s.d. 5 detik per shot).
- **Transition Style:** Straight hard cut antar-sequence dramatis vs spatial wipe/zoom transition.

---

## 3. DEKONSTRUKSI NASKAH & STORYTELLING

Ekstraksi pola penulisan naskah narasi dari transkrip video referensi:

1. **The 3-Second Golden Hook:**
   - Kalimat pembuka: Apakah paradoks logika, pertanyaan provokatif, atau fakta kontras mengejutkan?
   - Keselarasan aksi detik ke-0: Apa yang terjadi di layar saat kata pertama diucapkan?
2. **Pacing & Word Velocity:**
   - Kecepatan bicara narator: Rata-rata 3.0 s.d. 3.8 kata per detik (~8-10 frame per kata @ 30fps).
   - Jeda pernapasan: Penempatan jeda mikro pada tanda baca untuk menjaga artikulasi jernih.
3. **The "Pivot / Mechanism" Bridge:**
   - Cara narator beralih dari masalah empiris ("bambu lapuk") ke solusi teknis ("bata dan semen").
   - Analogi populer: Penggunaan perumpamaan sederhana yang mudah dipahami (misal: *"disusun kayak Lego"*).
4. **Resolution & Interactive CTA:**
   - 5 detik penutup: Tampilan objek dalam kondisi final hero-shot disertai pertanyaan yang memicu komentar penonton.

---

## 4. OUTPUT REKOMENDASI ATM (MODIFIKASI PRODUKSI)

Setelah analisis selesai, buat dokumen ringkasan produksi:
- **Style Preset:** Nilai warna, parameter lighting, dan material shaders untuk Three.js / Remotion.
- **Camera Presets:** Konfigurasi sudut kamera dan fungsi easing yang siap diterapkan ke `<Series.Sequence>`.
- **Script Template:** Struktur naskah modular siap pakai untuk topik video baru.
