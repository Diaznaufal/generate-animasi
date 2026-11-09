# Standard Operating Procedure (SOP): Remotion Animation Director

Pedoman permanen dan arsitektur wajib untuk produksi video explainer berkualitas tinggi berbasis **Remotion** (khususnya format vertikal Shorts / TikTok / Reels 1080x1920 9:16).

---

## 1. ARCHITECTURE & SCENE CONTROL

### 1.1 Wajib Menggunakan `<Series>` & `<Series.Sequence>`
- Setiap video explainer **wajib** dipecah menjadi rangkaian adegan (*shot-by-shot*) menggunakan `<Series>` dan `<Series.Sequence>` dari Remotion.
- **DILARANG KERAS** menggunakan satu animasi berulang (looping statis) sepanjang durasi video atau menumpuk seluruh logika visual dalam satu komponen monolitik tanpa isolasi urutan waktu.
- Setiap `<Series.Sequence>` memiliki `durationInFrames` yang presisi, dihitung langsung dari durasi segmen dialog suara (voice-over) yang bersangkutan.

```tsx
import { Series, AbsoluteFill } from "remotion";

export const VideoExplainer: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Audio dipasang global di luar Series agar mengalir mulus tanpa delay */}
      <Audio src={staticFile("audio/narasi.mp3")} />

      <Series>
        {/* Shot 1: Hook Pembuka (Gedek Bambu) */}
        <Series.Sequence durationInFrames={SHOT_DURATIONS[0]}>
          <SceneBambooGedek />
        </Series.Sequence>

        {/* Shot 2: Permasalahan (Bambu Lapuk kena Hujan) */}
        <Series.Sequence durationInFrames={SHOT_DURATIONS[1]}>
          <SceneBambooDecay />
        </Series.Sequence>

        {/* Shot 3: Solusi Bata (Pencetakan & Pembakaran) */}
        <Series.Sequence durationInFrames={SHOT_DURATIONS[2]}>
          <SceneBrickMaking />
        </Series.Sequence>
        
        {/* ... shot seterusnya ... */}
      </Series>

      {/* Subtitle Dinamis diletakkan di layer atas */}
      <DynamicSubtitles />
    </AbsoluteFill>
  );
};
```

### 1.2 Keselarasan Visual 100% dengan Naskah (Narrative Sync)
- Visual pada setiap scene harus menjadi representasi visual langsung (*literal & conceptual visual representation*) dari kata-kata yang diucapkan narator:
  - Narasi menyebut *"air hujan tembus & bambu lapuk"* $\rightarrow$ Visual: partikel air hujan jatuh, material bambu menghitam/lapuk.
  - Narasi menyebut *"bata ditumpuk lurus... diberi beban sedikit langsung terbelah"* $\rightarrow$ Visual: panah beban turun dari atas, garis retakan (fracture line) muncul dan tumpukan bata terbelah dua ke kiri-kanan.
  - Narasi menyebut *"disusun selang-seling kayak Lego"* $\rightarrow$ Visual: bata tersusun staggered interlocking dengan kaitan yang kokoh.
  - Narasi menyebut *"slof di bawah, kolom praktis, ring balok"* $\rightarrow$ Visual: animasi pengecoran bertahap dari slof bawah $\rightarrow$ tiang kolom kiri-kanan $\rightarrow$ ring balok pengunci atas.

---

## 2. CAMERA & MOTION (MOTION CAM SYSTEM)

### 2.1 Dinamika Kamera di Setiap Sequence
- Tidak boleh ada scene dengan kamera diam statis (dead frame).
- Setiap sequence wajib memiliki pergerakan kamera aktif:
  - **Slow Zoom-in / Zoom-out:** Menjaga atensi dan menciptakan rasa kedalaman (depth).
  - **Orbit / Tilt / Pan 3D:** Memperlihatkan dimensi objek arsitektur / teknik (CSS 3D `transform: rotateX(...) rotateY(...) scale3d(...)`).
- Gunakan fungsi `interpolate` atau `spring` dari Remotion dengan kurva easing yang halus (`Easing.out(Easing.cubic)` atau `Easing.bezier(0.16, 1, 0.3, 1)`).

### 2.2 Dramatic Camera Cut Antar-Scene
- Di setiap pergantian `<Series.Sequence>`, lakukan pemotongan sudut pandang kamera (*camera cut*) dramatis:
  - Dari Wide Shot (melihat keseluruhan dinding) $\rightarrow$ Close-up Shot (melihat detail sambungan bata & adukan semen).
  - Dari Frontal Orthographic $\rightarrow$ Dramatic Low-Angle Perspective (menonjolkan kekokohan balok beton).

---

## 3. AUDIO & VOICE-OVER PIPELINE

### 3.1 Dual-Engine Voiceover Generator (`scripts/generate_voiceover.mjs`)
1. **Default: Microsoft Edge TTS (`edge-tts`)**
   - 100% gratis, cepat, tanpa batasan token API key.
   - Pilihan suara Indonesia terbaik:
     - `id-ID-GadisNeural` (Wanita: jernih, artikulasi edukasi profesional).
     - `id-ID-ArdiNeural` (Pria: tegas, cocok untuk explainer sains/teknik).
2. **Modular ElevenLabs API (`--provider=elevenlabs`)**
   - Mengambil kunci dari `.env.local` (`ELEVENLABS_API_KEY`).
   - Dipakai untuk hasil rendering produksi akhir jika dibutuhkan intonasi AI ultra-realistis.

### 3.2 Ekstraksi Metadata & Timestamps Akurat
- Script generator wajib menghasilkan atau membaca timestamps per segmen/kata (`narasi.srt` atau JSON timestamps).
- Durasi total video (`DURATION_IN_FRAMES`) harus **mengunci durasi audio aktual**:
  $$\text{durationInFrames} = \lceil \text{durasiAudioDetik} \times \text{FPS} \rceil$$
- Dilarang menebak durasi secara manual tanpa memeriksa panjang file audio `public/audio/narasi.mp3`.

---

## 4. DYNAMIC CAPTIONS (SUBTITLE SYSTEM)

### 4.1 Spesifikasi Styling Subtitle (Mobile Portrait 9:16)
- **Ukuran Font:** Maksimal **`24px - 28px`** (Jangan pernah lebih dari 28px agar tidak rakus ruang layar dan tidak memblokir objek 3D utama).
- **Font:** Ultra-bold sans-serif (`font-weight: 900`, `text-transform: uppercase`, `letter-spacing: 0.6px`).
- **Highlight Kata Aktif:** Kuning tegas (`#FACC15`) dengan efek glowing/drop-shadow tegas:
  ```css
  color: #FACC15;
  text-shadow: 0 0 16px rgba(250, 204, 21, 0.9), -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000;
  ```
- **Kata Belum / Sudah Aktif:** Putih bersih (`#FFFFFF`) atau semi-transparan dengan stroke outline hitam tegas 2px agar tetap terbaca di background terang maupun gelap.
- **Kontainer:**
  - Posisi: **`bottom: 90px`** (rentang 80px - 100px).
  - Background: Semi-transparan ber-blur (`backgroundColor: "rgba(10, 15, 26, 0.78)"`, `backdropFilter: "blur(14px)"`, border `1.5px solid rgba(250, 204, 21, 0.35)`).
  - Padding ramping: `10px 22px`, `borderRadius: 16px`.

### 4.2 Larangan Keras: Subtitle Balap Audio
- Highlight kata wajib mengikuti laju pengucapan TTS:
  - Rata-rata pengucapan manusia / TTS normal: **3 s.d. 4 kata per detik** (atau ~8 - 10 frame per kata pada 30fps).
  - Waktu jeda antarkalimat dan koma harus diperhitungkan dalam alokasi frame.
  - Kata terakhir dalam kalimat harus tetap aktif sampai audio menyelesaikan segmen tersebut, tidak boleh melompat ke kalimat baru sebelum audio berpindah.

---

## 5. HOOK & CALL-TO-ACTION (CTA)

### 5.1 The 3-Second Golden Hook (0 - 3 Detik Pertama)
- Detik 0-3 menentukan apakah penonton swipe-away atau menonton sampai habis.
- Wajib memiliki:
  1. Pergerakan objek instan (bukan scene statis kosong).
  2. Kamera bergerak dinamis (orbit cepat atau push-in).
  3. Visual intriging (misal: dinding bambu goyah / pertanyaan arsitektural).
  4. Header status bar dengan progress indikator kuning berjalan.

### 5.2 Closing Call-To-Action (5 Detik Terakhir)
- 5 detik sebelum video berakhir:
  1. Tampilkan objek dalam kondisi final paling spektakuler (misal: dinding rumah kokoh selesai diaci dengan kamera memutar cinematic 360°).
  2. Pertanyaan interaktif / badge CTA singkat ("Coba cek tembok rumahmu!" / "Like & Subscribe untuk misteri teknik lainnya!").

---

## 6. CHECKLIST VERIFIKASI SEBELUM RENDER

Sebelum merender video ke MP4, wajib memverifikasi:
- [ ] Komposisi terdaftar di `src/Root.tsx` dengan ID yang sesuai.
- [ ] Durasi video di `Root.tsx` sinkron dengan durasi audio MP3.
- [ ] Linter & TypeScript lolos (`npm run lint` -> 0 error).
- [ ] Subtitle berada di rentang font 24px - 28px di posisi bottom 90px.
- [ ] Pergantian kata pada subtitle sinkron kata-per-kata tanpa balap audio.
- [ ] Menggunakan struktur modular `<Series>` & `<Series.Sequence>`.

