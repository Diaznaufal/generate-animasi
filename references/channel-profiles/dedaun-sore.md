# Style Bible: Dedaun Sore (2D Flat Storybook Melodrama)

Panduan visual komprehensif hasil reverse-engineering empiris komputasi video `@DedaunSore` (ID: `9YPQ-8UetCE`, "Guru PNS vs Guru Honorer", 3.104 frame @ 30 FPS).

---

## 1. FORMAT & TECHNICAL SPECS

- **Dimensi:** 1080 x 1920 (Vertical 9:16 Shorts / Reels / TikTok).
- **Frame Rate:** 30 FPS.
- **Durasi Khas:** 60–105 detik (1.800–3.150 frame).
- **Pacing Naskah:** ~130–140 WPM (2.1–2.3 kata per detik) — *jauh lebih santai dan emosional dibanding gaya komik aksi*.
- **Voiceover:** Suara pria dewasa hangat & reflektif (F0 median: 133 Hz, range 118–158 Hz, e.g. Edge TTS `id-ID-ArdiNeural` dengan `-10%` rate).

---

## 2. COLOR PALETTE & LIGHTING (EMPIRICAL METRICS)

- **Luma Mean:** **176.5 / 255** (Cerah pastel, bernuansa buku ilustrasi anak/dongeng).
- **Contrast Mean:** **40.8** (Rendah & lembut, dilarang kontras keras atau bayangan tajam).
- **Shadow Floor (p05):** **108.0 / 255** (*Anti-crushed black*. Warna tergelap adalah zaitun/cokelat kayu pudar, bukan hitam murni).
- **Highlight Ceiling (p95):** **222.0 / 255** (Latar langit krem dan kuning gading lembut).
- **Color Warmth (R - B):** **+28.8** (Kuat bernuansa hangat earth tone).
- **Palet Utama:**
  - Background Langit/Latar: `#F5EBE1` ke `#FDF8EE` (Krem hangat).
  - Meja / Lantai Kayu: `#D4B996` / `#B89B77`.
  - Papan Tulis Kelas: `#43604F` (Hijau zaitun tua pudar).
  - Highlight Subtitle: `#FACC15` (Kuning mustard lembut).
  - Outline Karakter: `#5C4E4B` / `#3D3534` (Abu-cokelat gelap, bukan hitam #000000 murni).

---

## 3. KARAKTER FLAT STORYBOOK RIG

- **Anatomi:**
  - Kepala bulat/oval besar, proporsi *chibi/storybook* (perbandingan kepala : tubuh sekitar 1 : 1.3).
  - Wajah minimalis: mata titik bulat sederhana, senyum garis melengkung tipis, pipi bersemu merah muda (*blush* lembut).
  - Rambut & Atribut sederhana: jilbab pastel, seragam PNS cokelat muda, jas dokter hitam rapi.
- **Micro-Animation (Local Motion = 0.995):**
  - Gerakan lembut: napas naik-turun halus (skala Y 0.99–1.01), kedipan mata sekali tiap 3–4 detik, anggukan kepala pelan.
  - Bebas dari pose lunge agresif atau garis aksi ekstrem.

---

## 4. KAMERA & PACING SHOT

- **Optical Flow:** **0.051 px/frame** (Sangat stabil, minim gerakan pan/zoom mendadak).
- **Median Shot Duration:** **3.67 detik** (Shot ditahan lama agar penonton meresapi dialog dan narasi batin).
- **Rasio Transisi:**
  - **71.4% Dissolves / Crossfades:** Transisi antar adegan menggunakan *fade through* lembut (12–18 frame).
  - **28.6% Straight Cuts:** Hanya digunakan pada momen pergantian adegan kontras (misal: ruang kelas ke ladang).
- **Penanda Waktu Khas (Time Jump Card):**
  - Teks penanda waktu besar di tengah ("10 TAHUN", "20 TAHUN").
  - Disertai simbol jam dinding berputar atau matahari berganti bulan untuk menekankan perjalanan waktu yang panjang.

---

## 5. KINETIC TYPOGRAPHY (SUBTITLE)

- **Font:** `Poppins, Nunito, Inter, sans-serif` (Rounded / Semi-bold).
- **Ukuran:** 44–48px.
- **Posisi:** Area sepertiga bawah (`top: 84–86%`), tidak menutupi wajah karakter.
- **Sistem Highlight (Yellow Pill Badge):**
  - Teks dasar: Putih bersih dengan bayangan/outline tipis lembut (`#000000` alpha 0.4).
  - Kata yang sedang aktif: Dibungkus kotak rounded kuning (*pill badge* `#FACC15` dengan teks hitam tebal).
  - Membantu keterbacaan tinggi di layar smartphone tanpa mengganggu estetika cerita.

---

## 6. FORMULA NASKAH "INVERSION OF FORTUNE" (5 BABAK)

Target: ~220–250 kata untuk video 90–105 detik.

1. **Beat 1: The Stark Contrast & Time-Jump Hook (0–7s):**
   Membandingkan dua nasib berlawanan di awal, lalu melempar premis kejutan di masa depan.
   *Contoh: "Satu guru berseragam PNS, satu guru honorer digaji Rp300.000. 20 tahun kemudian, hanya satu yang namanya dicari."*
2. **Beat 2: Everyday Struggle & Unfair Routine (7–35s):**
   Menunjukkan ketimpangan perlakuan dan dedikasi sejati yang tidak dihargai secara materi.
3. **Beat 3: The Silent Doubt / Inner Crisis (35–55s):**
   Momen hening sang tokoh berjalan sendiri, mempertanyakan apakah pengorbanannya sia-sia tanpa piagam atau pengakuan.
4. **Beat 4: The 20-Year Leap (55–70s):**
   Waktu berlalu. Tokoh yang sombong/meremehkan pensiun terlupakan; sang pahlawan sunyi tetap setia di tempat yang sama.
5. **Beat 5: The Grand Vindication & Emotional Closure (70–100s):**
   Hasil kebaikan masa lalu kembali dalam bentuk penghormatan luar biasa (murid sukses kembali berterima kasih), ditutup dengan haru dan tepuk tangan.

---

## 7. VOICE DIRECTION (EDGE TTS)

- Voice: `id-ID-ArdiNeural` (atau `id-ID-GadisNeural` jika narasi perempuan).
- Rate: `-10%` atau `-12%` (menghasilkan intonasi bercerita yang tenang dan tidak terburu-buru).
- Pitch: `-5Hz` (suhu suara empati yang hangat).
