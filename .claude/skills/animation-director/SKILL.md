---
name: animation-director
description: Standard Operating Procedure (SOP) komprehensif untuk perancangan, arsitektur, dinamika kamera, voice-over, dan dynamic subtitle video Remotion explainer
version: 1.0.0
---

# Animation Director Skill & SOP

Pedoman komprehensif pembuatan video Remotion Shorts/TikTok (1080x1920 9:16) explainer berkualitas tinggi.

## 1. ARCHITECTURE & SCENE CONTROL
- **Struktur Shot-by-Shot:** Wajib memecah komposisi visual menjadi adegan modular dengan `<Series>` dan `<Series.Sequence>`.
- **Dilarang Berulang:** Dilarang menggunakan satu animasi looping berulang untuk keseluruhan durasi video.
- **Narrative Alignment:** Visual harus mencerminkan dialog secara presisi pada setiap segmen waktu.

## 2. CAMERA & MOTION (MOTION CAM)
- **Kamera Dinamis:** Setiap sequence wajib memiliki dinamika pergerakan kamera (pan, slow zoom-in/out, orbit) menggunakan `interpolate` atau `spring`.
- **Dramatic Cuts:** Gunakan camera cut dramatis di setiap pergantian poin narasi penting.

## 3. AUDIO & VOICE-OVER PIPELINE
- **Dual Engine:** Default Microsoft Edge TTS (`edge-tts` - `id-ID-GadisNeural` / `id-ID-ArdiNeural`) gratis tanpa batas kuota, dengan opsi switch ke ElevenLabs via `--provider=elevenlabs`.
- **Presisi Timestamp:** Seluruh durasi video (`DURATION_IN_FRAMES`) dan segmentasi subtitle harus mengunci metadata audio aktual.

## 4. DYNAMIC CAPTIONS (SUBTITLE SYSTEM)
- **Ukuran Font:** 24px - 28px (proporsional format portrait 9:16).
- **Styling:** Huruf tebal 900 uppercase, warna aktif kuning `#FACC15`, stroke drop-shadow tebal.
- **Kontainer:** `bottom: 90px`, semi-transparan `backdropFilter: "blur(14px)"`, padding ringkas `10px 22px`.
- **Anti-Balap:** Sinkronisasi kata per kata mengikuti laju audio aktual (3-4 kata per detik).

## 5. HOOK & CTA
- **0-3 Detik Pertama:** Golden Hook dengan gerakan visual cepat dan kamera aktif.
- **5 Detik Terakhir:** Closing CTA interaktif dan showcase hasil akhir yang spektakuler.

