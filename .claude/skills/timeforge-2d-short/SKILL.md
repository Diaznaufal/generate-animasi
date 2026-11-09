---
name: timeforge-2d-short
description: Master SOP for creating vertical animated 2D vector stickman explainer shorts (1080x1920 9:16, 30 FPS) in the style of @TimeForge_id. Use when writing 4-beat scripts, composing scenes with dynamic stick figures, configuring Detik 0 cover badges, syncing baritone voiceovers, or rendering comic explainer shorts for historical and educational topics.
---

# TimeForge 2D Short (Master Production Skill)

Proven production pipeline for generating 2D comic stickman explainer videos in the style of `@TimeForge_id` (1080x1920 9:16 vertical, 30 FPS, durasi minimal 60 detik / 60–70s).

Reference materials and measurements are in `references/` (`STYLE_BIBLE.md`, `channel-profile.json`, `frames/`).
Templates and reusable code are in `templates/` and `src/components/timeforge/`.

---

## Directorial Rules & Golden Laws
1. **Durasi Wajib: Minimal 60 Detik (60–70s / ~135–160 kata):**
   - Video explainer edukasi & sejarah harus memiliki durasi minimal 1 menit (60 detik) untuk memenuhi standar monetisasi, algoritma retensi Shorts/Reels, dan bobot cerita yang mendalam.
2. **Engine 100% 2D Vector (Anti-3D):**
   - Dilarang membuat mesh Three.js, box geometry, atau render 3D primitif. Seluruh visual dibangun dari SVG beranimasi dan canvas di Remotion.
3. **Detik 0 Wajib CoverBadge:**
   - Setiap video wajib memasang `<CoverBadge />` di root komposisi (frame 0–45) di dalam safe zone IG Grid (`Y: 420–1500`).
   - Ekspor `out/cover.png` pada frame 30 sebagai aset thumbnail resmi.
4. **Kaki Stickman Asimetris & Lutut Artikulasi:**
   - Gunakan pose lunge dinamis atau bertolak pinggang gagah dengan sendi lutut fleksibel dan bayangan pijakan terpisah. Dilarang menggambar kaki jangka segitiga kaku.
5. **Kinetic Subtitle di Dada (Y: 56–58%):**
   - Subtitle berukuran ultra-besar (88px) font Impact stroke 10px tepat di area dada/perut karakter. Dilarang menaruh subtitle di footer layar.
6. **Kunci Durasi dari File Audio:**
   - `durationInFrames = Math.ceil(audioDurationInSeconds * 30)`.

---

## Production Pipeline (6-Step Workflow)

```
[1. Scriptwriting] ──> [2. Voiceover] ──> [3. Shot Plan] ──> [4. Assembling] ──> [5. QA Stills] ──> [6. Render]
   Formula 60 Detik      Edge-TTS Baritone   Series 2.5-3.5s    2D Stickman +     Cover frame 30      1080x1920 MP4
   templates/SCRIPT      id-ID-ArdiNeural    Camera Dynamics    CoverBadge        out/cover.png       H.264
```

### Langkah 1: Naskah 60 Detik (~135–160 kata)
Gunakan template naskah di `templates/SCRIPT_template.md`:
- **Beat 1: The Inversion Hook (0–6s / ~15 kata):** Mematahkan asumsi umum.
- **Beat 2: The Scale & Conflict (6–20s / ~35 kata):** Skala bahaya, rintangan geografis, dan ketegangan.
- **Beat 3: The Enemy Siege (20–35s / ~35 kata):** Serangan musuh membabi buta.
- **Beat 4: The Tactical Secret (35–48s / ~35 kata):** Senjata/material rahasia leluhur.
- **Beat 5: Historical Triumph & CTA (48–62s / ~30 kata):** Rekor dunia, warisan sejarah, dan pertanyaan pemantik komentar.

### Langkah 2: Voiceover & Durasi Audio
Generate audio voiceover menggunakan Edge TTS pria bariton:
```bash
node scripts/generate_voiceover.mjs --script=path/to/script.md --out=public/audio/narasi.mp3
```
Kunci durasi frame:
```ts
export const DURATION_IN_FRAMES = Math.ceil(audioDurationInSeconds * 30);
```

### Langkah 3: Shot Planning & Komposisi
Pecah video ke dalam potongan scene per 2.5–3.5 detik (75–105 frame) menggunakan `<Series>` dan `<Series.Sequence>`.
Kamera bergerak aktif (pan atau slow zoom-in `1.0 -> 1.08`) di setiap sequence.

### Langkah 4: Perakitan Scene (`src/components/timeforge/`)
Import komponen modular yang tersedia:
```tsx
import {
  CoverBadge,
  FlagRibbon,
  KineticSubtitle,
  ParchmentBg,
  SpeedLines,
  Stickman,
} from "./components/timeforge";

export const MyComposition: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      {/* 1. Audio Narasi Global */}
      <Audio src={staticFile("audio/narasi.mp3")} volume={1} />

      {/* 2. CoverBadge Detik 0 (IG Grid Safe Zone Y: 420-1500) */}
      <CoverBadge
        label="BENTENG KUNO"
        title="TAK PERNAH JEBOL!"
        titleUntil={45}
        dockAt={60}
      />

      {/* 3. Sequences Adegan */}
      <Series>
        <Series.Sequence durationInFrames={105}>
          <ParchmentBg mood="sunburst" />
          <SpeedLines intensity={1.2} />
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
            <Stickman pose="point_forward" face="determined" accessory="headband" prop="flag" />
          </div>
        </Series.Sequence>
      </Series>

      {/* 4. Subtitle Global di Tengah Dada */}
      <KineticSubtitle words={CUES} top="58%" fontSize={88} />
    </AbsoluteFill>
  );
};
```

### Langkah 5: QA Stills & Verifikasi Cover Frame 30
Ekspor frame cover untuk verifikasi:
```bash
npx remotion still <CompositionId> out/cover.png --frame=30
```
Periksa dengan mata kepala sendiri:
- Apakah CoverBadge dan Judul terbaca jelas di safe zone IG Grid?
- Apakah karakter tidak bertabrakan dengan elemen penting?

### Langkah 6: Final Render
```bash
npx remotion render <CompositionId> out/<output-name>.mp4
```

---

## Quick Reference: Stickman Props & Accessories

| Karakter Tipe | Pose | Face | Accessory | Prop |
|---|---|---|---|---|
| **Pejuang Kemerdekaan** | `point_forward` \| `lunge_action` | `determined` | `headband` | `flag` \| `keris` |
| **Pangeran Diponegoro / Ulama** | `proud` \| `hold_weapon` | `confident` | `turban` | `keris` \| `sword` |
| **Komandan Kolonial Belanda** | `shocked` | `shivering_cry` | `colonial_hat` | `sword` \| `none` |
| **Tokoh Bangsa (WR Supratman)** | `lunge_action` | `determined` | `none` | `violin` |

Untuk detail token visual, palet warna, dan metrik luma/contrast, baca `references/STYLE_BIBLE.md`.
