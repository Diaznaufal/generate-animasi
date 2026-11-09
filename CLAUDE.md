# Remotion Explainer Video Project

Repository untuk memproduksi video animasi edukasi & sejarah viral format vertikal (1080x1920 9:16 Shorts / TikTok / Reels @ 30 FPS) berbasis Remotion, React 19, dan SVG/2D Vector Stickman Animation bergaya komik aksi `@TimeForge_id`.

## Commands

- **Preview Studio:** `npm run dev` (starts Remotion Studio)
- **Render Video:** `npx remotion render <CompositionId> out/<output-name>.mp4`
- **Render Stills:** `npx remotion still <CompositionId> out/qa-stills/frame-<number>.png --frame=<number>`
- **Lint & Typecheck:** `npm run lint` (`eslint src && tsc`)
- **Generate Voiceover & Aligned Subtitles:** `.venv/bin/python scripts/generate_aligned_voiceover.py <script.md> public/audio/narasi.mp3 <out_cues.json>`
  - Default: Microsoft Edge TTS suara pria bariton `id-ID-ArdiNeural` dengan ekstraksi timestamp `WordBoundary` akurat (anti-drift)
- **QA & Verification Audit:** `.venv/bin/python scripts/qa_video.py <video.mp4> <CompositionId> <content_dir>`
  - Otomatis mengaudit container, subtitle drift, verbatim match, cover still, dan contact sheet.
- **Generate Voiceover (Simple):** `node scripts/generate_voiceover.mjs --script=path/to/script.md`
  - Default: Microsoft Edge TTS suara pria bariton `id-ID-ArdiNeural` (gratis)
  - Opsi suara wanita: `--voice=id-ID-GadisNeural`
  - Opsi ElevenLabs: `--provider=elevenlabs`

## Style & Composition Rules (TimeForge 2D Comic Engine)

1. **Visual Engine: 2D Vector Stickman & Graphic Novel:**
   - Karakter: Stick figure ekspresif (tubuh hitam tebal, kepala bulat putih dengan ekspresi mata kartun, aksesori peci/sorban/pedang).
   - Latar: Peta perkamen kuno (*aged parchment*), langit mendung perang, atau sunburst cahaya keemasan.
   - Efek Aksi: Manga speed lines, spotlight karakter di ruang gelap, garis getar emosi, tanda tanya `?` kartun.
   - Dilarang membuat 3D mesh kubus/silinder primitif jika targetnya adalah style TimeForge.

2. **Kamera & Motion:**
   - Gunakan `<Series>` dan `<Series.Sequence>` untuk memecah video shot-by-shot per 2.5–3.5 detik (~80–110 frame).
   - Selalu ada camera cut dramatis (zoom mendadak, pan cepat) menggunakan `interpolate()` atau `spring()`.

3. **Subtitle Kata-per-Kata Punchy (Kinetic Typography):**
   - Font: Ultra-bold uppercase 900, ukuran 42px – 56px.
   - Tampilan: Putih solid dengan stroke outline hitam pekat (3px – 5px).
   - Posisi: Tepat di tengah atau area sepertiga bawah, muncul 1–3 kata per hentakan suara narator dengan efek pop-in (`spring`).

4. **CoverBadge Detik 0 (Thumbnail / IG Grid Safe Zone):**
   - Pasang `<CoverBadge>` di root komposisi untuk detik 0 (frame 0–45).
   - Menampilkan label kategori dan judul hook besar dalam safe zone IG Grid 1:1 (`Y: 420–1500`) dan 4:5.
   - Judul memudar di frame 45, badge merapat halus (docking) ke pojok atas di frame 60.
   - Ekspor still frame 30 ke `out/cover.png` untuk verifikasi cover.

5. **Durasi & Audio Narasi (Wajib Minimal 1 Menit):**
   - Durasi Standar: Minimal 60 detik (60–70s @ 30 FPS = 1800–2100 frames, ~135–160 kata).
   - Naskah 5-Beat: Inversion Hook (0-6s) $\rightarrow$ Scale & Geography (6-20s) $\rightarrow$ Enemy Siege (20-35s) $\rightarrow$ Tactical Secret (35-48s) $\rightarrow$ Triumph & CTA (48-65s).
   - Kunci `durationInFrames = Math.ceil(audioDurationInSeconds * FPS)` langsung dari audio `public/audio/narasi.mp3`.
   - Pasang `<Audio />` di root `<AbsoluteFill>` di luar `<Series>`.

## Skills

- **`timeforge-2d-short`:** Master SOP & blueprint lengkap 2D Vector Stickman Comic Explainer (naskah 4-beat, artikulasi stickman, detik 0 cover badge, kinetic typography di dada).
- **`timeforge-qa`:** SOP Quality Assurance & verifikasi menyeluruh (audit subtitle drift, anti-hallucination, IG grid safe zone, contact sheet).
- **`channel-atm`:** Tool komputasi visual & audio frame-by-frame 30 FPS untuk reverse-engineering channel referensi.
