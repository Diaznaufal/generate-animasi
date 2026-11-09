---
name: viral-3d-explainer
description: Pedoman workflow bertahap (Gate 1 sampai Gate 5) untuk pembuatan video Remotion 3D explainer viral bergaya Comic/Clay World dengan lingkungan beragam (multi-environment dunia nyata), properti kontekstual, dan animasi sekuensial dinamis.
version: 3.2.0
---

# Viral 3D Explainer SOP & Quality Gates (Multi-Environment Workflow)

SOP produksi Remotion 3D explainer Shorts (1080x1920 9:16) berstandar bioskop miniatur dunia nyata dengan lingkungan beragam, properti kontekstual, dan animasi sekuensial dinamis.

## WORKFLOW GATES

- **Gate 1: Creative Brief & Naskah Edukasi:** Hook paradoks di detik 0-1, breakdown shot-by-shot modular di lingkungan berbeda, laju dialog narasi padat (~3-4 kata/detik), penutup interaktif di 5 detik terakhir.
- **Gate 2: Script & TTS Pipeline:** Default Edge TTS (`id-ID-GadisNeural` / `id-ID-ArdiNeural`) gratis atau opsi ElevenLabs. Durasi total video (`DURATION_IN_FRAMES`) wajib mengunci metadata panjang audio riil di `public/audio/narasi.mp3`.
- **Gate 3: Style Direction (Outdoor Daylight Comic 3D World):**
  - Langit terbuka daylight cerah (`#7dd3fc`), matahari terarah dengan bayangan nyata, dan ambient sky light sejuk.
  - Permukaan tanah riil pada $Y = 0$. Semua objek, bangunan, alat, dan karakter berdiri di $Y \ge 0$.
  - Sudut kamera eye-level atau elevated ($Y = 2.2 \text{ s.d. } 4.5$, `lookAt(0, 1.2, 0)`). Hindari sudut kamera dari bawah tanah.
- **Gate 4: Multi-Environment Workflow & Sequential Animations:**
  Setiap sequence dialog wajib memiliki adegan visual terisolasi dengan lingkungan dan properti kontekstual:
  1. _Establishing / Context Scene:_ Memperkenalkan material/kondisi awal dengan properti alam hidup (animasi halus `Math.sin`).
  2. _Problem Dramatization:_ Visualisasi kegagalan struktur/fisika (partikel air/angin, retakan bertahap, perubahan warna material lapuk).
  3. _Material / Solution Making:_ Proses pembuatan atau penyiapan solusi teknis (misal: pencetakan, pembakaran, perakitan bertahap).
  4. _Comparative Mechanism:_ Simulasi kontras antara pendekatan keliru vs pendekatan benar menggunakan animasi `spring` dan indikator overlay (misal: panah beban dinamis).
  5. _Structural Reinforcement:_ Integrasi penguat struktur bertahap yang mengunci komponen utama.
  6. _Finishing & Hero Showcase:_ Sapuan akhir (finishing), kamera cinematic orbit 360° / slow pull-back, dan badge CTA interaktif.
- **Gate 5: Production Spec:** Remotion `<Series>` 1080x1920 30fps vertikal, subtitle dinamis font 24px-28px kuning tebal di `bottom: 90px` sinkron kata-per-kata tanpa mendahului suara narator.
