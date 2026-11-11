---
name: dedaun-2d-short
description: Master SOP for creating vertical animated 2D flat storybook explainer shorts (1080x1920 9:16, 30 FPS) in the style of @DedaunSore. Use when writing emotional moral-reflection scripts, composing soft pastel storybook scenes, configuring yellow-pill subtitles, or producing melodrama explainer videos with calm baritone narration.
---

# Dedaun Sore 2D Short (Master Production Skill)

Production pipeline untuk memproduksi video vertikal 2D animasi bernuansa buku cerita moral (*Storybook Melodrama*) bergaya `@DedaunSore` (1080x1920 9:16 vertical, 30 FPS, durasi 60–105 detik).

Materi referensi dan metrik komputasi empiris ada di `references/` (`STYLE_BIBLE.md`, `channel-profile.json`).
Template naskah ada di `templates/SCRIPT_template.md`.
Komponen visual ada di `src/components/dedaun/`.

---

## Directorial Rules & Golden Laws

1. **Estetika 2D Flat Storybook (Anti-Action / Anti-Crushed Black):**
   - Luma cerah ~176.5, kontras rendah ~40.8.
   - Lantai bayangan terendah (p05) tidak pernah hitam pekat (`#000000`), melainkan cokelat kayu pudar atau abu-zaitun (`#6b655b`).
   - Warna dominan: krem hangat (`#f5ebe1`), kuning mustard (`#facc15`), hijau papan tulis zaitun (`#43604f`).
2. **Karakter Flat Chibi Minimalis:**
   - Proporsi kepala besar, mata titik bulat, rona pipi (*blush*) lembut.
   - Pembeda status sosial via busana simpel (seragam PNS khaki, jilbab dusty rose, jas dokter).
   - Gerakan mikro halus: napas pelan (`scaleY 0.99–1.01`), kedip mata sekali per 3–4 detik, tanpa lunge action atau speed lines.
3. **Pacing Bertutur & Transisi Dissolve:**
   - Tempo naskah tenang: 130–140 WPM (2.1–2.3 kata/detik).
   - Median shot duration: 3.5–4.5 detik.
   - 70%+ transisi adalah *crossfade / dissolve* lembut (12–18 frame), bukan jump cut kasar.
4. **Yellow-Pill Kinetic Subtitle di Bawah (Y: 82–86%):**
   - Font: `Poppins, Nunito, Inter` rounded bold.
   - Ukuran: 44–48px warna putih outline tipis.
   - Kata aktif yang sedang diucapkan narator otomatis dibungkus badge kotak rounded warna kuning mustard (`#facc15`) dengan teks hitam tebal.
5. **Kunci Durasi dari File Audio:**
   - `durationInFrames = Math.ceil(audioDurationInSeconds * 30)`.

---

## Quick Reference Pipeline

1. **Naskah:** Gunakan `templates/SCRIPT_template.md` (Formula 5-Beat Inversion of Fortune).
2. **Audio & Subtitle:**
   ```bash
   .venv/bin/python3 scripts/generate_dedaun_voiceover.py content/<slug>/script.md public/audio/<slug>_narasi.mp3 content/<slug>/subtitles.json
   ```
3. **Komposisi:** Gunakan komponen `src/components/dedaun/` (`DedaunStorybookBg`, `DedaunCharacter`, `DedaunSubtitle`, `TimeJumpOverlay`).
4. **Render:**
   ```bash
   npx remotion render <CompositionId> out/<output-name>.mp4
   ```
