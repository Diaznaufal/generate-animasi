---
name: timeforge-style
description: Standar produksi dan style preset video 3D explainer taktis/sejarah bergaya @TimeForge_id (34 detik, 30 FPS). Mengatur preset visual (luma 126.8, warm amber R-B +21.4, hard directional shadows), editing cadence (cut per 3.3 detik), voiceover pria bariton (131 Hz, ~125 WPM), dan formula 4-beat scriptwriting. Terintegrasi penuh dengan ekosistem skill Remotion (remotion-markup 3D, remotion-captions, remotion-best-practices, dan remotion-render).
version: 1.1.0
---

# TimeForge Style Production Guide & Remotion Skill Chain

Panduan spesifikasi teknis dan eksekusi produksi video Remotion 3D explainer Shorts (1080x1920, 30 FPS) berbasis data terukur reverse-engineering channel `@TimeForge_id`, terintegrasi penuh dengan best-practices Remotion.

---

## 1. RANTAI SKILL REMOTION LENGKAP (SKILL CHAINING WORKFLOW)

Setiap tahapan produksi wajib mengadopsi aturan dari skill Remotion terkait:

```text
                     [Input Ide / Topik Sejarah]
                                  │
                                  ▼
[FASE 1: PRE-PRODUKSI & NASKAH]
• Skill `timeforge-style` (Formula 4-Beat: Inversion Hook -> Tension -> Pivot -> CTA)
• Skill `remotion-best-practices` (Pacing narasi ~125 WPM, pembagian shot per 3.3s)
• Output: Naskah 68-72 kata siap di-generate ke audio
                                  │
                                  ▼
[FASE 2: VOICE-OVER & AUDIO TIMING]
• `scripts/generate_voiceover.mjs` (Edge TTS `id-ID-ArdiNeural` F0 ~131 Hz)
• Skill `animation-director` (Kunci DURATION_IN_FRAMES dari durasi aktual audio)
• Output: `public/audio/narasi.mp3` & `narasi.srt`
                                  │
                                  ▼
[FASE 3: 3D SCENE & MOTION CORE]
• Skill `remotion-markup` (Sub-skill `3d.md` & `sequencing.md`):
  - Wajib `<ThreeCanvas width={width} height={height}>`.
  - DILARANG KERAS `useFrame()`! Animasi 100% wajib driven by `useCurrentFrame()`.
  - Gunakan `interpolate()` / `spring()` untuk rotasi, pergerakan, dan kamera.
• Skill `timeforge-style` (Lighting: warm amber +21.4, directional keylight 2.4).
• Skill `viral-3d-explainer` (Ground plane Y=0, kamera eye-level Y=2.2-4.5).
                                  │
                                  ▼
[FASE 4: CAPTIONS & OVERLAY]
• Skill `remotion-captions` (Sub-skill `display-captions.md`):
  - Dynamic subtitle box di `bottom: 90px`, font 26px uppercase bold 900.
  - Active word highlight kuning `#FACC15` sinkron audio narasi.
                                  │
                                  ▼
[FASE 5: RENDER & QUALITY CHECK]
• Skill `remotion-render`:
  - `npx remotion render <CompositionId> out/video.mp4`
  - Verifikasi: 0 dead-frame, audio tidak balap subtitle, render 30 FPS stabil.
```

---

## 2. ATURAN TEKNIS REMOTION 3D (`remotion-markup`)

Wajib mengikuti pedoman dari `remotion-markup/3d.md`:

1. **Struktur Canvas:**
   ```tsx
   import { ThreeCanvas } from "@remotion/three";
   import { useVideoConfig, useCurrentFrame, interpolate, spring } from "remotion";

   export const SceneShot: React.FC = () => {
     const { width, height, fps } = useVideoConfig();
     const frame = useCurrentFrame();

     // Animasi deterministik murni fungsi frame
     const cameraAngle = interpolate(frame, [0, 100], [0, Math.PI / 6]);

     return (
       <ThreeCanvas width={width} height={height}>
         {/* Lighting Setup TimeForge */}
         <ambientLight intensity={0.45} color="#94a3b8" />
         <directionalLight
           position={[5, 8, 4]}
           intensity={2.4}
           color="#fef08a"
           castShadow
           shadow-mapSize={[2048, 2048]}
         />
         <mesh rotation={[0, cameraAngle, 0]}>
           {/* Objek 3D */}
         </mesh>
       </ThreeCanvas>
     );
   };
   ```

2. **Larangan `useFrame()`:**
   - Dilarang menggunakan `useFrame()` dari `@react-three/fiber` karena memicu frame skipping dan flickering saat multi-threaded render.
   - Semua pergerakan mesh, material, dan kamera harus dihitung dari `useCurrentFrame()`.

3. **Audio Handling (`remotion-markup/audio.md`):**
   - Pasang `<Audio src={staticFile("audio/narasi.mp3")} />` di root `<AbsoluteFill>` di luar `<Series>`.
   - Audio mengalir utuh dari awal sampai akhir tanpa potongan per adegan.

---

## 3. SPESIFIKASI VISUAL & LIGHTING TIMEFORGE

Berdasarkan analisis empiris 19.569 frame:

| Parameter Visual | Nilai Target | Implementasi Teknis (Three.js / CSS) |
|---|---|---|
| **Luma (Kecerahan)** | **126.8 / 255** (49.7%) | Mid-tone sinematik. `luma_p05 = 69.6`, `luma_p95 = 180.3`. |
| **Kontras (Std Dev)** | **50.5** | Kontras tinggi dramatis, menonjolkan siluet objek 3D. |
| **Suhu Warna (R - B)** | **+21.4 (Warm Amber)** | Pencahayaan kekuningan/emas kerajaan & obor api. |
| **Saturasi Warna** | **93.6 / 255** (36.7%) | Earthy tones: cokelat kayu, tembaga/perunggu, terracotta, emas. |
| **Bayangan (Shadow)** | **Hard Directional + AO** | Jatuh tegas ke tanah $Y = 0$. Bayangan kontak pekat. |

---

## 4. EDITING CADENCE & KAMERA DINAMIS

- **Target Durasi:** Tepat **34 detik** (~1.020–1.040 frame @ 30 FPS).
- **Frekuensi Cut:** **10 s.d. 12 shot** per video.
- **Durasi per Shot:** **3.3 detik (~100 frame)** per `<Series.Sequence>`.
- **Pergerakan Kamera:**
  - Optical flow terjaga di ~0.74 px/frame (selalu ada slow pan, slow push-in, atau orbital 3D).
  - Hindari kamera statis diam (*dead frame*).
  - Transisi antar-adegan: **85% Straight Hard Cut**, 15% Dynamic Zoom-in. Hindari slow dissolve.

---

## 5. AUDIO & 4-BEAT SCRIPTWRITING BLUEPRINT

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

## 6. DYNAMIC CAPTIONS (`remotion-captions`)

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
