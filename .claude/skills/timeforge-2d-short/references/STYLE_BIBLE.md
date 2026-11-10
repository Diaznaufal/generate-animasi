# Style Bible: @TimeForge_id (2D Vector Stickman Explainer)

Panduan visual komprehensif hasil empirical study 19 video dan 19.569 frame channel `@TimeForge_id`.

---

## 1. FORMAT & TECHNICAL SPECS
- **Dimensi:** 1080 x 1920 (Vertical 9:16 Shorts/TikTok/Reels).
- **Frame Rate:** 30 FPS.
- **Durasi Optimal:** 30–35 detik (900–1050 frames).
- **Loudness:** -14 LUFS, voiceover bariton pria (`id-ID-ArdiNeural` ~130 Hz).
- **Pacing Naskah:** ~125–150 WPM (2.0–2.5 kata per detik).

---

## 2. DETIK 0 COVER BADGE & SAFE ZONES
Platform YouTube Shorts dan Instagram Profile Grid memotong frame awal sebagai thumbnail/cover.
- **Instagram 1:1 Square Safe Zone:** `Y: 420` s.d. `Y: 1500` (Area tengah 1080x1080).
- **CoverBadge Props:**
  - `label`: Pill badge kategori/seri (misal `● SEJARAH INDONESIA`, `● BENTENG KUNO`).
  - `title`: Judul hook thumbnail tebal 2–4 kata (misal `TAK PERNAH JEBOL!`, `BIOLA SAKTI`).
  - `centerY = 470` (pill Y 438–502, di dalam crop 1:1), `titleTop = 560`.
  - **Animasi:** Title memudar di frame 45 (`titleUntil: 45`), badge merapat (*docking*) halus ke pojok kiri atas pada frame 42–60, selesai di frame 60 (`dockAt: 60`, `x: 180, y: 260`).
  - **Wajib Export Frame 30:** `npx remotion still <Id> out/cover-<Id>.png --frame=30`.

---

## 3. COLOR PALETTE & LIGHTING (EMPIRICAL METRICS)
- **Luma Mean:** ~126.8 (Netral-terang seimbang).
- **Contrast Mean:** ~50.5 (Tinggi, memisahkan karakter siluet dari latar).
- **Shadow Floor (p05):** ~69.6 (Bayangan abu tua/kebiruan, bukan hitam 100% kecuali outline).
- **Highlight Ceiling (p95):** ~180.3 (Warna perkamen krem vintage hangat).
- **Palet Utama:**
  - Background Parchment: `#f5eee1` (Radial gradient ke `#e2d4b7`).
  - Background Sunburst: `#fffbeb` ke `#d97706` dengan rays `#92400e` (opacity 0.16).
  - Background Dark Storm: Radial `#334155` ke `#090d16`.
  - Aksen Merah Pejuang: `#dc2626` / `#b91c1c`.
  - Outline & Karakter: `#000000` solid.

---

## 4. KARAKTER STICKMAN RIG
- **Kepala:** Lingkaran putih bersih diameter 256px dengan outline hitam 28px.
- **Muka Komik:** Alis menukik tajam (`determined`), mata melotot lebar (`shocked`), menggigil air mata (`shivering_cry`), atau seringai percaya diri (`confident`).
- **Sendi & Kaki Artikulasi:**
  - Wajib pose asimetris lunge atau berdiri menapak terpisah.
  - Pijakan kaki menggunakan bayangan lantai terpisah (`ellipse rx="65" ry="18"`).
  - Dilarang menggambar kaki jangka segitiga kaku tanpa lutut.
- **Aksesori Budaya:** Ikat kepala merah putih (`headband`), sorban Pangeran Diponegoro (`turban`), topi shako komandan kolonial (`colonial_hat`).
- **Properti:** Keris berliuk (`keris`), pedang (`sword`), bendera merah putih (`flag`), biola akustik (`violin`).

---

## 5. KINETIC TYPOGRAPHY (SUBTITLE)
- **Font:** `Impact, Arial Black, sans-serif` (900 ultra-bold uppercase).
- **Posisi:** Tepat di area dada/perut karakter (`top: 58%`), bukan di footer.
- **Ukuran:** 42–56px (default `fontSize = 54`).
- **Stroke Outline:** `-webkit-text-stroke: 5px #000000; paint-order: stroke fill;` (spec 3–5px).
- **Motion:** Spring pop-in tajam (`damping: 9, mass: 0.45, stiffness: 290`).
- **Pacing:** Muncul 1–3 kata per hentakan suara narator.
