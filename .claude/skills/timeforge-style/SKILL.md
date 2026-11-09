---
name: timeforge-style
description: Standar produksi dan style preset video 3D explainer taktis/sejarah bergaya @TimeForge_id (34 detik, 30 FPS). Mengatur preset visual (luma 126.8, warm amber R-B +21.4, hard directional shadows), editing cadence (cut per 3.3 detik), voiceover pria bariton (131 Hz, ~125 WPM), dan formula 4-beat scriptwriting. Digunakan untuk memproduksi video baru dengan gaya yang 100% konsisten.
version: 1.0.0
---

# TimeForge Style Production Guide & Skill Chain

Panduan spesifikasi teknis dan eksekusi produksi video Remotion 3D explainer Shorts (1080x1920, 30 FPS) berbasis data terukur dari reverse-engineering channel `@TimeForge_id`.

## 1. RANTAI SKILL (SKILL CHAINING WORKFLOW)

Skill ini berperan sebagai **Director & Style Preset**. Saat mengeksekusi proyek video baru, panggil dan hubungkan secara berurutan:

```text
[Input Ide/Topik]
       │
       ▼
1. `timeforge-style` (Skill ini)
   -> Menetapkan preset naskah 4-beat, WPM ~125, lighting Three.js, dan cut cadence 3.3s.
       │
       ▼
2. `scripts/generate_voiceover.mjs`
   -> Generate audio via Edge TTS (`id-ID-ArdiNeural`) atau ElevenLabs (Adam/Marcus).
       │
       ▼
3. `animation-director`
   -> Sinkronisasi audio aktual `narasi.mp3` ke DURATION_IN_FRAMES dan layout subtitle 26px di bottom 90px.
       │
       ▼
4. `viral-3d-explainer`
   -> Validasi quality gates (Ground Y=0, kamera eye-level, transisi shot-by-shot).
       │
       ▼
[Render Remotion MP4]
```

---

## 2. SPESIFIKASI VISUAL THREE.JS & COLOR GRADING

Berdasarkan analisis empiris 19.569 frame:

| Parameter Visual | Nilai Target | Implementasi Teknis (Three.js / CSS) |
|---|---|---|
| **Luma (Kecerahan)** | **126.8 / 255** (49.7%) | Mid-tone sinematik. `luma_p05 = 69.6`, `luma_p95 = 180.3`. |
| **Kontras (Std Dev)** | **50.5** | Kontras tinggi dramatis, menonjolkan siluet objek 3D. |
| **Suhu Warna (R - B)** | **+21.4 (Warm Amber)** | Pencahayaan kekuningan/emas kerajaan & obor api. |
| **Saturasi Warna** | **93.6 / 255** (36.7%) | Earthy tones: cokelat kayu, tembaga/perunggu, terracotta, emas. |
| **Bayangan (Shadow)** | **Hard Directional + AO** | Jatuh tegas ke tanah $Y = 0$. Bayangan kontak pekat. |

### Template Lighting Siap Pakai:
```tsx
<ambientLight intensity={0.45} color="#94a3b8" />
<directionalLight
  position={[5, 8, 4]}
  intensity={2.4}
  color="#fef08a" // Warm amber sunlight
  castShadow
  shadow-mapSize={[2048, 2048]}
/>
```

---

## 3. EDITING CADENCE & KAMERA DINAMIS

- **Target Durasi:** Tepat **34 detik** (~1.020–1.040 frame @ 30 FPS).
- **Frekuensi Cut:** **10 s.d. 12 shot** per video.
- **Durasi per Shot:** **3.3 detik (~100 frame)** per `<Series.Sequence>`.
- **Pergerakan Kamera:**
  - Optical flow terjaga di ~0.74 px/frame (selalu ada slow pan, slow push-in, atau orbital 3D).
  - Hindari kamera statis diam (*dead frame*).
  - Transisi antar-adegan: **85% Straight Hard Cut**, 15% Dynamic Zoom-in. Hindari slow dissolve.

---

## 4. AUDIO & 4-BEAT SCRIPTWRITING BLUEPRINT

### Profil Suara
- **Pitch:** Pria bariton berwibawa (~131 Hz).
- **Engine Default:** Microsoft Edge TTS suara `id-ID-ArdiNeural`.
- **Pacing:** **120 – 125 WPM** (~2.0 – 2.1 kata/detik atau ~14-15 frame per kata @ 30 FPS).

### Formula Naskah 4-Beat (Total ~68–72 Kata)

1. **Beat 1: The Inversion Hook (Detik 0–3 | ~90 frame | ~7–9 kata)**
   - Hancurkan anggapan umum di kalimat pertama (*"Bukan dari Eropa...", "Perang yang nyaris bikin bangkrut..."*).
2. **Beat 2: The Tension Builder (Detik 4–15 | ~330 frame | ~22–25 kata)**
   - Skala konflik, bahaya nyata, atau tantangan ekstrem yang mengancam.
3. **Beat 3: The Tactical Pivot (Detik 16–28 | ~360 frame | ~25–28 kata)**
   - Senjata rahasia, kecerdikan arsitektur, atau strategi pembalik keadaan (menggunakan analogi mekanik yang mudah dibayangkan).
4. **Beat 4: Long-Term Impact & Interactive CTA (Detik 29–34 | ~180 frame | ~12–14 kata)**
   - Warisan sejarah yang diakui dunia + pertanyaan penutup interaktif untuk memicu komentar.

---

## 5. DYNAMIC CAPTION (SUBTITLE SPEC)

```css
font-size: 26px;
font-weight: 900;
text-transform: uppercase;
color: #FFFFFF;
background-color: rgba(15, 23, 42, 0.85);
backdrop-filter: blur(12px);
border-radius: 14px;
padding: 8px 20px;
bottom: 90px;
```
- **Kata Aktif:** Highlight kuning tebal `#FACC15` dengan drop shadow tegas.
- **Pacing:** Sinkronisasi kata per kata mengikuti audio narator (~2 kata per detik), dilarang balap audio.
