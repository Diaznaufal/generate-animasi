# Viral 3D Explainer Skill & Standard Operating Procedure (SOP)

Pedoman resmi produksi video edukasi explainer 3D viral format vertikal (Shorts / TikTok / Reels 1080x1920 9:16) berbasis **Three.js & Remotion** dengan alur multi-environment dunia nyata dan animasi sekuensial dinamis (bukan studio kosong atau objek mengambang statis).

---

## WORKFLOW GATES (PINTU KUALITAS BERTAHAP)

### Gate 1: Creative Brief & Naskah Edukasi (Pacing & Retention)
- **Detik 0 - 1 (The Paradox Hook):** Membuka dengan paradoks arsitektural di detik pertama.
- **Relentless Pacing (~3.5 Kata/Detik):** Narasi padat tanpa jeda canggung, artikulatif dan energik.
- **The "You See" Pivot:** Transisi logis dari masalah sederhana menuju hukum fisika / konstruksi nyata.
- **Multi-Environment Narrative Sequence:** Setiap kalimat dialog memiliki adegan visual khusus (*shot-by-shot*) di lingkungan spesifik, bukan satu objek statis yang diulang-ulang.
- **Closing Interactive CTA:** 5 detik terakhir ditutup dengan pencapaian dan ajakan interaktif.

---

### Gate 2: Script & TTS Pipeline
- **Dual Voiceover Engine:**
  - **Default:** Microsoft Edge TTS (`edge-tts` suara `id-ID-GadisNeural` / `id-ID-ArdiNeural`) gratis tanpa kuota API.
  - **Produksi Akhir:** ElevenLabs API (`eleven_multilingual_v2`) via `--provider=elevenlabs`.
- **Word-Level Timestamp Precision:**
  - Segmentasi durasi audio aktual diekstrak dari audio riil `public/audio/narasi.mp3`.
  - Durasi total video (`DURATION_IN_FRAMES = 2060`) mengunci durasi audio riil (2060 frame @ 30fps).
  - Alokasi kata memperhitungkan jeda nafas tanda baca (koma, titik, tanda seru) sehingga subtitle tidak pernah balap suara.

---

### Gate 3: Style Direction (Outdoor Daylight Comic / Clay 3D World)
- **Lingkungan Dunia Nyata (Real-World Setting):**
  - **DILARANG KERAS:** Studio gelap melayang atau potongan dinding mengambang di ruang hampa!
  - **WAJIB:** Pencahayaan luar ruangan (outdoor daylight), langit biru cerah (`#7dd3fc`), matahari terarah dengan bayangan nyata, dan ambient sky light sejuk.
- **Permukaan Tanah Nyata (Grounded Plane at Y = 0):**
  - Seluruh lantai pekarangan, tanah galian, dan pondasi berada pada $Y = 0$.
  - Seluruh objek, bangunan, alat, dan karakter berada di atas tanah pada $Y \ge 0$.
- **Kamera Sinematik (Eye-Level / Elevated View):**
  - Posisi kamera berada di ketinggian normal $Y = 2.2 \text{ s.d. } 4.5$ menghadap ke objek dengan `lookAt(0, 1.2, 0)`.
  - **DILARANG KERAS:** Sudut kamera dari kolong bawah tanah (underground view). Kamera harus selalu berada di atas permukaan tanah.
  - Setiap pergantian adegan wajib mengubah sudut pandang kamera (*camera cut* dramatis atau *smooth cinematic travel*).

---

### Gate 4: Multi-Environment Workflow & Sequential Dynamic Animations

1. **Scene 1: Kegiatan Menganyam Bambu (Halaman Terbuka):**
   - Lingkungan: Pekarangan tanah dengan pohon pisang dan rumpun bambu yang daunnya bergoyang halus (`Math.sin`). Tumpukan batang bambu utuh di samping.
   - Aktivitas: Karakter berlutut di tanah. Tangannya bergerak ritmis bolak-balik menyilangkan lembaran bilah bambu baru ke atas lembaran gedek yang sedang dianyam.

2. **Scene 2: Hujan, Rembesan, & Bambu Lapuk (Dinding Luar Rumah):**
   - Lingkungan: Sudut potong miring (*cutaway*) menampilkan tanah pondasi bawah dan dinding bambu samping.
   - Aktivitas & Efek: Partikel hujan jatuh miring tertiup angin. Bagian bawah dinding bambu menggelap basah, berubah kehitaman/lapuk (`interpolateColor`), dan ujung bilah-bilah bambu compang-camping rontok ke tanah.

3. **Scene 3: Pabrik Bata Tradisional - Pencetakan (Area Galian Tanah):**
   - Lingkungan: Area tanah liat cokelat basah, gundukan tanah liat merah, cangkul tertancap, dan barisan bata basah yang dijemur.
   - Aktivitas: Karakter memegang cetakan kayu ganda. Animasi menekan adonan tanah liat ke cetakan, lalu mengangkat cetakan ke atas ($Y+2$), meninggalkan 2 bata mentah basah baru di atas tanah.

4. **Scene 4: Tungku Pembakaran Bata Merah (Tungku Tradisional):**
   - Lingkungan: Bangunan tungku pembakaran terbuka (*open kiln*) dari susunan bata besar dengan cerobong/atap sederhana.
   - Aktivitas & Efek: Nyala api oranye berpijar berkedip (*flicker*) di mulut tungku, kepulan partikel asap melayang ke atas, dan susunan bata bertransisi warna dari cokelat lumpur menjadi merah bata matang yang keras dan kedap air.

5. **Scene 5: Perakitan Tembok Lurus & Runtuh (Situs Konstruksi Awal):**
   - Lingkungan: Pondasi tanah konstruksi dengan ember semen dan alat sendok semen.
   - Aktivitas & Efek: Sendok semen meratakan adukan mortar. Bata berjatuhan satu per satu (*spring animation*) dengan sambungan vertikal lurus segaris. Beban menekan dari atas, garis retakan zig-zag muncul menjalar, lalu separuh dinding roboh miring ke samping dengan *camera shake*.

6. **Scene 6: Susunan Selang-Seling Lego & Penyebaran Beban:**
   - Lingkungan: Situs konstruksi yang sama.
   - Aktivitas & Efek: Dinding dibangun ulang dengan pola susun selang-seling (*staggered running bond*) berurutan dari atas ke bawah. Beban berat yang sama menekan dari atas, dinding tetap kokoh stabil, dan panah visual hijau neon dinamis menyebar diagonal 45° ke bata sekitarnya.

7. **Scene 7: Perakitan Bingkai Beton Bertulang:**
   - Lingkungan: Dinding bata selang-seling di atas pondasi.
   - Aktivitas & Efek: Dinding sempat bergoyang labil. Diberi perkuatan bertahap: slof beton meluncur di bawah fondasi, 2 tiang kolom praktis berdiri di ujung kiri & kanan, dan balok ring beton menutup dari atas mengunci seluruh struktur hingga kokoh tak bergoyang.

8. **Scene 8: Proses Plesteran, Acian, & Hasil Akhir:**
   - Lingkungan: Dinding rumah yang sudah terpasang rapi.
   - Aktivitas & Efek: Sapuan plester semen abu-abu kasar dari bawah ke atas, dilanjutkan sapuan acian halus putih/terang yang membuat dinding mulus sempurna. Kamera melakukan *smooth 360° orbit zoom-out* memperlihatkan sudut rumah modern pedesaan yang siap huni di lingkungan luar ruangan.

---

### Gate 5: Production Spec (Remotion 9:16 Shorts)
- **Format:** 1080 x 1920 piksel (9:16 vertikal).
- **Frame Rate:** 30 fps, total durasi 2060 frame (~68.6 detik).
- **Three.js Koordinat Wajib:**
  - Lantai/Tanah: $Y = 0$.
  - Seluruh objek & karakter: $Y \ge 0$.
  - Kamera: $Y = 2.2 \text{ s.d. } 4.5$, selalu menghadap objek di atas tanah.
- **Dynamic Captions:**
  - Ukuran font: `24px - 28px` (proporsional, tidak menutupi visual 3D).
  - Posisi: `bottom: 90px`.
  - Warna aktif: Kuning `#FACC15` dengan background box semi-transparan ber-blur.
  - Sinkron kata-per-kata tanpa balap suara audio.
