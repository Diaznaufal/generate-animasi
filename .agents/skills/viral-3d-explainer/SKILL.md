---
name: viral-3d-explainer
description: Pedoman workflow bertahap (Gate 1 sampai Gate 5) untuk pembuatan video Remotion 3D explainer viral bergaya Comic/Clay World dengan lingkungan beragam (multi-environment dunia nyata), properti kontekstual, dan animasi sekuensial dinamis.
version: 3.1.0
---

# Viral 3D Explainer SOP & Quality Gates (Multi-Environment Workflow)

SOP wajib untuk produksi Remotion 3D explainer Shorts (1080x1920 9:16) berstandar bioskop miniatur dunia nyata dengan lingkungan beragam, properti kontekstual, dan animasi sekuensial dinamis.

## WORKFLOW GATES:

- **Gate 1: Creative Brief & Naskah Edukasi:** Hook paradoks di detik 1, multi-shot breakdown 8 adegan alur cerita di lingkungan berbeda, pacing ~3.5 kata/detik, closing CTA.
- **Gate 2: Script & TTS:** Edge TTS default / ElevenLabs modular dengan word-timestamps presisi mengunci 2060 frame.
- **Gate 3: Style Direction:** Outdoor Daylight Comic 3D World (langit biru `#7dd3fc`, tanah di $Y = 0$, objek di $Y \ge 0$, kamera eye-level $Y = 2.2 \text{ s.d. } 4.5$ `lookAt(0, 1.2, 0)`, matahari terarah hangat).
- **Gate 4: Multi-Environment Workflow & Sequential Animations:**
  1. _Scene 1 (Pekarangan Anyam Bambu):_ Rumpun bambu bergoyang halus (`Math.sin`), pohon pisang, tumpukan bambu, karakter berlutut menganyam bilah baru bolak-balik ke lembaran gedek.
  2. _Scene 2 (Dinding Luar Rumah & Rembesan):_ Cutaway miring memperlihatkan pondasi dan dinding bawah, partikel hujan miring tertiup angin, bambu bawah berubah kehitaman lapuk & ujung bilah rontok ke tanah.
  3. _Scene 3 (Galian Tanah Liat Tradisional):_ Area galian tanah liat, gundukan tanah merah, cangkul tertancap, barisan bata basah dijemur, karakter menekan adonan lalu mengangkat cetakan kayu ganda ($Y+2$) meninggalkan 2 bata basah di tanah.
  4. _Scene 4 (Tungku Pembakaran Terbuka):_ Open kiln bata dengan cerobong, kobaran api oranye berkedip (_flicker_) di mulut tungku, kepulan partikel asap ke atas, transisi warna bata dari cokelat tanah liat ke merah bata matang.
  5. _Scene 5 (Konstruksi Tembok Lurus & Runtuh):_ Ember dan sendok semen, bata jatuh bertahap spring, sambungan vertikal lurus, beban menekan dari atas, retakan zig-zag, tembok terbelah miring 2 bagian dengan camera shake.
  6. _Scene 6 (Susunan Selang-Seling Lego & Distribusi Beban):_ Dinding dibangun ulang pola running bond, beban menekan dinding tetap kokoh, panah hijau neon dinamis menyebar diagonal 45° ke bata sekitarnya.
  7. _Scene 7 (Bingkai Beton Bertulang):_ Dinding sempat bergoyang labil, slof beton horizontal meluncur di bawah, 2 kolom praktis berdiri di sudut, ring balok menutup dari atas mengunci struktur jadi kaku.
  8. _Scene 8 (Plesteran, Acian, & Hasil Akhir):_ Sapuan plester semen abu-abu dari bawah ke atas, dilanjutkan sapuan acian semen halus putih/terang, kamera _smooth 360° orbit zoom-out_ memperlihatkan sudut rumah modern siap huni di alam terbuka.
- **Gate 5: Production Spec:** Remotion `<Series>` 1080x1920 30fps, dynamic captions 24-28px kuning tebal di bottom 90px tanpa balap suara audio.
