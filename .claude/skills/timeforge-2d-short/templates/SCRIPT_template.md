# Template Naskah 5-Beat @TimeForge_id (60–70 Detik)

Topik: [Nama Topik Sejarah / Pertempuran / Tokoh]
Durasi Target: 60–70 detik (1800–2100 frame @ 30 FPS, ~135–160 kata)
Voiceover: id-ID-ArdiNeural (bariton, ~130–140 WPM)
Shot: ganti shot tiap 2.5–3.5 detik (~80–110 frame), lihat `CameraShots`

---

## 1. LEMBAR PERENCANAAN BEAT

### [BEAT 1: THE INVERSION HOOK] (00s – 06s / 12–16 kata)
*Visual: CoverBadge Detik 0 aktif (frame 0–45, di dalam crop IG 1:1 Y 420–1500). Sunburst emas + speed lines. Karakter pose gagah.*
- [1–2 kalimat yang mematahkan anggapan umum atau membongkar kejanggalan sejarah]
- Contoh: "Bukan di Eropa atau Tiongkok, benteng terluas versi MURI justru berdiri di Indonesia!"

### [BEAT 2: SCALE & GEOGRAPHY] (06s – 20s / 30–35 kata)
*Visual: Peta perkamen, zoom ke lokasi, angka skala muncul sebagai label.*
- [Tempat, waktu, dan skala dengan angka yang bisa dicek di sumber]
- Contoh: "Inilah Benteng Keraton Buton di Baubau, Sulawesi Tenggara. Kelilingnya hampir tiga kilometer, dengan dua belas gerbang dan enam belas bastion meriam."

### [BEAT 3: ENEMY / SIEGE / CONFLICT] (20s – 35s / 32–38 kata)
*Visual: Langit perang gelap, karakter lawan panik, karakter pejuang bersiaga.*
- [Ancaman nyata yang pernah dihadapi, dengan lawan yang benar untuk eranya]
- Cek: lawan, kapal, dan bendera harus sesuai era. Jangan pakai VOC/Belanda sebelum 1596.

### [BEAT 4: TACTICAL SECRET] (35s – 48s / 30–35 kata)
*Visual: Perkamen + spotlight karakter, aksi taktis cepat, diagram teknik.*
- [Kecerdikan strategi, teknologi, atau titik balik peristiwa]
- Bedakan fakta dan tradisi lisan: "konon", "menurut tradisi setempat".

### [BEAT 5: TRIUMPH & CTA] (48s – 65s / 25–35 kata)
*Visual: Karakter menatap layar, bendera merah putih berkibar.*
- [Kesimpulan bangga tanpa superlatif yang tidak bisa dibuktikan, lalu pertanyaan pemicu komentar]
- Contoh: "Menurut kalian, bisakah teknik konstruksi modern menandingi kecerdikan leluhur Nusantara ini?"

---

## 2. FORMAT FILE FINAL `content/<slug>/script.md`

`generate_aligned_voiceover.py` dan `qa_video.py` membaca setiap baris **kecuali** baris yang diawali `#` atau `>`.

- Narasi: paragraf biasa, satu paragraf per beat, tanpa heading atau bullet.
- Sumber dan catatan: heading `##` lalu setiap baris diawali `> `, supaya tidak ikut dibacakan.
- Jangan pakai `---` di file final: generator melewatinya, tapi `qa_video.py` tidak, sehingga cek verbatim gagal.

```markdown
[Paragraf Beat 1]

[Paragraf Beat 2]

[Paragraf Beat 3]

[Paragraf Beat 4]

[Paragraf Beat 5]

## Sumber

> 1. Penulis/Lembaga, "Judul", Penerbit, Tahun. URL
> 2. ...

## Catatan Verifikasi

> - [Klaim] — [status: terverifikasi / lemah / anakronis] — [alasan + sumber]
```

Minimal 2 sumber per klaim angka atau superlatif ("terluas", "pertama", "tercanggih"). Klaim yang hanya ada di artikel populer ditandai lemah.

---

## 3. GENERATE AUDIO COMMAND
```bash
.venv/bin/python scripts/generate_aligned_voiceover.py content/<slug>/script.md public/audio/<slug>_narasi.mp3 content/<slug>/subtitles_aligned.json
```
