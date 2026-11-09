---
name: animation-director
description: Use when assembling, directing, structuring scenes, synchronizing audio, camera dynamics, or configuring Detik 0 thumbnail cover badges for Remotion explainer videos (1080x1920 9:16 Shorts, 30 FPS).
---

# Animation Director (Remotion Explainer Production SOP)

Pedoman operasional sutradara teknis Remotion untuk memproduksi video explainer vertikal 9:16 (Shorts/TikTok/Reels @ 30 FPS).

---

## 1. THE PRODUCTION SKILL CHAIN

Setiap produksi video harus mengikuti alur berantai (*skill chaining*) yang teratur:

```
[1. CHANNEL-ATM]
   └── Reverse engineering metrik, pacing WPM, & visual reference
          ↓
[2. TIMFORGE-STYLE]
   └── Naskah 4-Beat, DNA visual 2D vector komik, & modul komponen
          ↓
[3. ANIMATION-DIRECTOR] (Skill Ini)
   └── Perakitan scene shot-by-shot, kamera dinamis, audio lock,
       DAN CoverBadge Detik 0 untuk Thumbnail / IG Grid
          ↓
[4. REMOTION-RENDER]
   └── Export MP4 & still frame 30 untuk cover/QA (out/cover.png)
```

---

## 2. ATURAN WAJIB: DETIK 0 COVER BADGE (IG GRID & SHORTS THUMBNAIL)

**Masalah Kritis:** Pada YouTube Shorts dan Instagram Profile Grid, platform otomatis mengambil frame awal (biasanya frame 0–30) sebagai thumbnail cover. Jika detik 0 kosong atau tidak memiliki judul topik, feed IG Grid tampak polos tanpa konteks dan kehilangan potensi *click-through rate* (CTR).

### Spesifikasi CoverBadge:
1. **Wajib Memasang `<CoverBadge />`** di root komposisi di luar `<Series>` (di atas background dan di bawah subtitle).
2. **Safe Zone IG Grid:**
   - Instagram 1:1 Square Crop: Area vertikal `Y = 420` s.d. `Y = 1500`.
   - Posisi Default Badge: `centerY = 430` (di tengah atas area 1:1 crop).
   - Posisi Default Title: `titleTop = 520` (tepat di bawah badge, terbaca jelas di feed 1:1).
3. **Perilaku Animasi:**
   - **Frame 0 – 45:** Badge dan Judul Topik muncul solid dan tebal untuk kebutuhan thumbnail/cover.
   - **Frame 45 – 60:** Judul memudar (`titleUntil: 45`) agar tidak menabrak subtitle dialog.
   - **Frame 60 – 78:** Badge mengecil dan merapat halus ke sudut atas (`dockAt: 60`, `x: 180, y: 260`) sebagai penanda seri/kategori yang elegan.
4. **Export Cover Still Frame 30:**
   Setelah render video, wajib mengekspor frame cover:
   ```bash
   npx remotion still <CompositionId> out/cover.png --frame=30
   ```

```tsx
import { CoverBadge } from "./components/timeforge";

// Di dalam Root Komposisi:
<CoverBadge
  label="BENTENG KUNO"
  title="TAK PERNAH JEBOL!"
  accentColor="#dc2626"
  textColor="#ffffff"
  panelColor="#0f172a"
/>
```

---

## 3. ARSITEKTUR SCENE & KAMERA DINAMIS

### A. Modular Shot-by-Shot (`<Series>`)
Pecah video berdurasi 30–35 detik menjadi potongan adegan dramatis per **2.5 – 3.5 detik (75–105 frame)**:
- **Shot 1 (The Hook):** Zoom cepat ke arah karakter utama dengan latar terang (`sunburst` / `parchment`).
- **Shot 2 (The Threat):** Transisi kontras tajam ke latar kelabu/gelap (`dark_storm`), karakter musuh panik.
- **Shot 3 (The Tactical Action):** Aksi cepat dengan `<SpeedLines />`, pose lunge menyerang atau menunjuk tegas.
- **Shot 4 (The Reveal/Climax):** Sudut kamera melebar atau spotlight dramatis (`spotlight`).
- **Shot 5 (The Retort/CTA):** Pose gagah menghadap penonton, bendera berkibar.

### B. Kamera Dinamis (Pan & Zoom)
Gunakan wrapper `<div style={{ transform: ... }}>` dengan `interpolate()` atau `spring()` di setiap sequence:
```tsx
const frame = useCurrentFrame();
// Efek slow push-in zoom kamera (1.0x -> 1.08x)
const zoom = interpolate(frame, [0, 105], [1.0, 1.08], { extrapolateRight: "clamp" });
```

---

## 4. AUDIO LOCKING & SINKRONISASI VOICEOVER

1. **Durasi Terkunci Otomatis:**
   Durasi komposisi Remotion **WAJIB** dikunci dari durasi file audio aktual:
   ```ts
   // Misal audio durasi 31.4 detik @ 30 FPS:
   export const DURATION_IN_FRAMES = Math.ceil(audioDurationInSeconds * 30);
   ```
2. **Posisi `<Audio />`:**
   Komponen `<Audio src={staticFile("audio/narasi.mp3")} volume={1} />` harus berada di root `<AbsoluteFill>` di luar `<Series>`. Dilarang menaruh audio di dalam `<Series.Sequence>`.

---

## 5. KINETIC SUBTITLE TIMING

- **Posisi:** Tepat di tengah area dada karakter (`top: 58%`). Dilarang meletakkan subtitle di footer layar karena tertutup UI TikTok/Reels/Shorts.
- **Typography:** Font ultra-bold uppercase (`font-weight: 900`, `Impact, Arial Black`), stroke 10px hitam pekat (`WebkitTextStroke: "10px #000000"`).
- **Pacing:** Muncul 1–3 kata per hentakan suara narator, dianimasikan dengan `spring()` pop-in tajam.

---

## 6. QUALITY CHECKLIST SEBELUM SELESAI

- [ ] **Frame 0 memiliki CoverBadge** dengan `label` dan `title` terbaca di safe zone IG Grid (`Y: 420-1500`).
- [ ] **Durasi video sinkron** dengan audio narasi (tidak terpotong di akhir).
- [ ] **Shot berganti setiap 2.5–3.5 detik** (tidak ada adegan statis berdurasi > 4 detik).
- [ ] **Subtitle berada di dada karakter** dan tidak tumpang tindih dengan CoverBadge setelah frame 45.
- [ ] **Hasil render frame 30 diekspor** ke `out/cover.png` untuk verifikasi visual cover.
