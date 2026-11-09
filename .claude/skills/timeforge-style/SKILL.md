---
name: timeforge-style
description: Use when producing, animating, or scripting 2D vector stickman comic explainer videos (1080x1920 9:16 vertical Shorts, 30 FPS) in the style of @TimeForge_id for any historical, tactical, or educational topic.
---

# TimeForge Style (2D Stickman Comic Explainer Engine)

## Overview
Replikasi gaya visual dan narasi channel `@TimeForge_id`: animasi 2D vector stick figure ekspresif bergaya komik/manga aksi berlatar perkamen kuno (*aged parchment*) dengan subtitle kata-per-kata punchy (*kinetic typography*) di tengah dada karakter.

Dilarang membuat model 3D (Three.js/mesh kubus/silinder). Seluruh visual dibangun menggunakan SVG 2D dinamis di Remotion (React 19).

---

## When to Use
- Membuat video explainer vertikal (9:16 1080x1920 @ 30 FPS) bertema sejarah, pertempuran, pahlawan, atau misteri masa lalu.
- Menulis naskah narasi cepat 4-beat (Inversion Hook $\rightarrow$ Rising Conflict $\rightarrow$ Tactical Pivot $\rightarrow$ Climax/CTA) berdurasi 30–35 detik (~75–90 kata).
- Mengorkestrasi karakter stickman 2D ekspresif multi-pose (lunge action, bangga, menunjuk, panik) dengan aksesori budaya (peci, ikat kepala, sorban, topi kolonial) dan senjata (keris, pedang, bendera).

### When NOT to Use
- Video 3D simulasi fisika atau renders Three.js realistis.
- Video dokumenter live-action berbasis footage video asli.
- Video teks minimalis biasa tanpa karakter atau efek komik aksi.

---

## 1. FORMULA NASKAH 4-BEAT (THE SCRIPT GENERATOR)

Setiap video TimeForge berdurasi optimal **30–34 detik** (~75–85 kata bahasa Indonesia) dibawakan dengan tempo cepat (~150–160 WPM). Naskah dibagi menjadi 4 beat dramatis:

### Struktur Naskah
```
[BEAT 1: THE INVERSION HOOK] (0-3 detik / 10-14 kata)
Menghancurkan asumsi umum penonton dengan fakta tak terduga.
Contoh: "Bukan meriam atau ribuan pasukan yang bikin Belanda frustrasi di Buton!"

[BEAT 2: THE RISING CONFLICT] (4-14 detik / 25-30 kata)
Meningkatkan taruhan, skala musuh, atau bahaya yang mencekam.
Contoh: "Benteng Keraton Buton dikelilingi jurang terjal dan dinding batu kapur setinggi delapan meter. Kapal perang musuh dihujani tembakan meriam sebelum sempat mendarat!"

[BEAT 3: THE TACTICAL PIVOT] (15-26 detik / 30-35 kata)
Mengungkap kecerdikan taktik, senjata rahasia, atau titik balik peristiwa.
Contoh: "Prajurit Kesultanan merekatkan batu menggunakan putih telur dan kapur karang. Hasilnya? Benteng seluas 23 hektar ini tak pernah berhasil dijebol satu peluru pun!"

[BEAT 4: RHETORICAL RETORT / CTA] (27-32 detik / 10-15 kata)
Pernyataan penutup menggelegar dan pertanyaan yang memicu komentar penonton.
Contoh: "Benteng terluas di dunia ini berdiri di Indonesia! Menurut kalian, bisakah taktik kuno ini ditiru zaman sekarang?"
```

### Prompt Pembuat Naskah Otomatis
Jika diminta membuat topik baru (misal: Benteng Buton, Pangeran Diponegoro, Perang Padri):
1. **Input:** Nama Topik & Fakta Unik Utama.
2. **Generate:** 4 paragraf beat sesuai batasan kata di atas.
3. **Simpan ke:** `scripts/naskah.md` atau `public/audio/narasi.txt`.
4. **Generate Audio:** Jalankan generator suara:
   ```bash
   node scripts/generate_voiceover.mjs --script=scripts/naskah.md --out=public/audio/narasi.mp3
   ```

---

## 2. MODULAR COMPONENT LIBRARY (`src/components/timeforge`)

Gunakan komponen siap pakai yang telah dioptimalkan di `src/components/timeforge`:

```tsx
import {
  Stickman,
  ParchmentBg,
  SpeedLines,
  KineticSubtitle,
  FlagRibbon,
} from "./components/timeforge";
```

### A. `<Stickman />`
Karakter 2D berbasis SVG dengan sendi lutut fleksibel, kepala ekspresif ber-outline 28px, dan bayangan kontak lantai terpisah (bukan bentuk jangka kaku).

| Prop | Options | Deskripsi |
|---|---|---|
| `pose` | `"lunge_action"` \| `"proud"` \| `"point_forward"` \| `"shocked"` \| `"hold_weapon"` | Pose dinamis tubuh & kaki |
| `face` | `"determined"` \| `"shocked"` \| `"shivering_cry"` \| `"confident"` | Ekspresi mata & mulut komik |
| `accessory` | `"headband"` \| `"turban"` \| `"colonial_hat"` \| `"none"` | Ikat kepala merah putih / sorban / topi komandan |
| `prop` | `"keris"` \| `"sword"` \| `"flag"` \| `"violin"` \| `"none"` | Senjata atau benda yang digenggam |
| `scale` | `number` (default: `1.0`) | Ukuran relatif karakter |
| `flipX` | `boolean` (default: `false`) | Menghadap kiri atau kanan |

### B. `<ParchmentBg />`
Generator latar belakang dinamis:
- `mood="parchment"`: Peta perkamen kuno krem bertekstur vintage hangat.
- `mood="sunburst"`: Pancaran sinar matahari keemasan berputar lambat (`0.25 deg/frame`).
- `mood="dark_storm"`: Langit kelabu mendung medan perang dengan gradien radial tebal.
- `mood="spotlight"`: Kerucut cahaya dramatis menyorot karakter di ruang gelap gulita.

### C. `<SpeedLines />`
Garis kecepatan manga melingkar 360 derajat di sekitar karakter untuk adegan aksi intens:
- `intensity`: opacity pengali (default: `1.0`).
- `centerX`, `centerY`: titik pusat fokus aksi.

### D. `<FlagRibbon />`
Pita dwi-warna merah putih meliuk bergelombang secara sinusoidal di latar depan atau tengah adegan.

### E. `<KineticSubtitle />`
Subtitle kata-per-kata yang muncul tepat di area **dada/perut karakter** (Y: 56–58%):
- Font: `Impact, Arial Black, sans-serif` (900 ultra-bold).
- Outline: `WebkitTextStroke: "10px #000000"`, `paintOrder: "stroke fill"`.
- Animasi: Remotion `spring()` pop-in hentakan tajam (`damping: 9, stiffness: 290`).

### F. `<CoverBadge />` (Wajib di Detik 0)
Badge kategori & judul thumbnail tebal di detik 0 (frame 0–45) dalam safe zone IG Grid 1:1 (`Y: 420-1500`) dan 4:5:
- `label`: nama kategori/seri (misal: "BENTENG KUNO", "SEJARAH INDONESIA").
- `title`: hook judul thumbnail 2–4 kata (misal: "TAK PERNAH JEBOL!").
- Animasi: Judul memudar di frame 45, badge merapat/docking halus ke sudut atas di frame 60.
- Ekspor: Gunakan `npx remotion still <Id> out/cover.png --frame=30` untuk file cover thumbnail.

---

## 3. BOILERPLATE KOMPOSISI VIDEO LENGKAP

Template universal untuk membuat video topik apapun:

```tsx
import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Audio,
  Series,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  CoverBadge,
  FlagRibbon,
  KineticSubtitle,
  KineticWord,
  ParchmentBg,
  SpeedLines,
  Stickman,
} from "./components/timeforge";

export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;
export const VIDEO_FPS = 30;

// Subtitle kata-per-kata (disinkronkan dengan durasi frame audio)
const SUBTITLE_CUES: KineticWord[] = [
  { text: "BENTENG TERBESAR", startFrame: 0, endFrame: 35, emphasis: true },
  { text: "DI DUNIA", startFrame: 35, endFrame: 65 },
  { text: "BERADA DI INDONESIA!", startFrame: 65, endFrame: 110, emphasis: true },
  { text: "BENTENG KERATON BUTON", startFrame: 110, endFrame: 160 },
  { text: "TAK PERNAH DITAKLUKKAN!", startFrame: 160, endFrame: 220, emphasis: true },
];

export const UniversalTimeForgeExplainer: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      {/* 1. AUDIO ROOT (Wajib di luar Series) */}
      <Audio src={staticFile("audio/narasi.mp3")} volume={1.0} />

      {/* 2. COVER BADGE DETIK 0 (Thumbnail / IG Grid Safe Zone Y: 420-1500) */}
      <CoverBadge
        label="BENTENG KUNO"
        title="TAK PERNAH JEBOL!"
        titleUntil={45}
        dockAt={60}
      />

      {/* 2. SCENE SERIES (Shot-by-Shot per 2.5 - 3.5 detik) */}
      <Series>
        {/* SHOT 1: THE HOOK (0 - 3.5s / 105 frames) */}
        <Series.Sequence durationInFrames={105}>
          <ParchmentBg mood="sunburst" />
          <SpeedLines intensity={1.2} />
          <FlagRibbon />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Stickman
              pose="point_forward"
              face="determined"
              accessory="headband"
              prop="flag"
              scale={1.05}
            />
          </div>
        </Series.Sequence>

        {/* SHOT 2: THE CONFLICT (3.5 - 7.0s / 105 frames) */}
        <Series.Sequence durationInFrames={105}>
          <ParchmentBg mood="dark_storm" />
          <SpeedLines intensity={0.8} />
          {/* Karakter Lawan: Komandan Kolonial */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "32%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Stickman
              pose="shocked"
              face="shivering_cry"
              accessory="colonial_hat"
              scale={0.95}
            />
          </div>
          {/* Karakter Pejuang: Menghunus Keris */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "68%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Stickman
              pose="hold_weapon"
              face="determined"
              accessory="headband"
              prop="keris"
              scale={1.1}
              flipX={true}
            />
          </div>
        </Series.Sequence>
      </Series>

      {/* 3. SUBTITLE GLOBAL DI LAYER TERATAS (Tepat di Dada) */}
      <KineticSubtitle words={SUBTITLE_CUES} top="58%" fontSize={88} />
    </AbsoluteFill>
  );
};
```

---

## 4. ATURAN EMAS PRODUKSI (ANTI-ERROR)

1. **Wajib 2D Vector (Bukan Three.js 3D):**
   - Jangan pernah menambahkan `@remotion/three`, `<ThreeCanvas>`, atau `<boxGeometry>` jika targetnya adalah style TimeForge.
2. **Kaki Stickman Asimetris & Artikulasi:**
   - Gunakan pose lunge dengan sendi lutut ditekuk dan sepatu menapak terpisah di lantai. Dilarang menggambar kaki jangka segitiga datar.
3. **Penempatan Subtitle di Dada (Y: 56–58%):**
   - Video TimeForge menaruh teks berukuran raksasa di atas dada karakter, bukan di bawah dekat tepi layar (footer).
4. **Kunci Durasi dari File Audio:**
   - Hitung durasi frame tepat:
     ```ts
     const DURATION_IN_FRAMES = Math.ceil(audioDurationInSeconds * 30);
     ```
   - Komposisi Remotion tidak boleh lebih panjang atau lebih pendek dari audio voiceover.
5. **Cepat & Punchy:**
   - Ganti shot (`<Series.Sequence>`) setiap 75–110 frame (2.5–3.5 detik). Selalu kombinasikan pergerakan kamera zoom mendadak atau transisi kontras (misal: dari `sunburst` cerah ke `dark_storm` gelap).
