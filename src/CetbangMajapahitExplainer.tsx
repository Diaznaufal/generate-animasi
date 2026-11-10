import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Series,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Audio } from "@remotion/media";
import {
  CoverBadge,
  FlagRibbon,
  KineticSubtitle,
  KineticWord,
  ParchmentBg,
  SpeedLines,
  Stickman,
  CameraShots,
} from "./components/timeforge";

export const VIDEO_FPS = 30;
export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;
// 61.224 detik audio @ 30 FPS = 1837 frames
export const DURATION_IN_FRAMES = 1837;

// ============================================================================
// TIMELINE KINETIC SUBTITLE (TEPAT DI DADA KARAKTER, ANTI-DRIFT 100% VERBATIM)
// ============================================================================
const SUBTITLE_WORDS: KineticWord[] = [
  { text: "BANYAK YANG MENGIRA", startFrame: 3, endFrame: 26 },
  { text: "SENJATA API DAN", startFrame: 26, endFrame: 50 },
  { text: "MESIU PERTAMA KALI", startFrame: 50, endFrame: 76 },
  { text: "DIBAWA OLEH PENJAJAH", startFrame: 76, endFrame: 108 },
  { text: "BANGSA EROPA KE", startFrame: 108, endFrame: 129 },
  { text: "NUSANTARA", startFrame: 129, endFrame: 155 },
  { text: "FAKTANYA", startFrame: 176, endFrame: 207 },
  { text: "JAUH SEBELUM ARMADA", startFrame: 207, endFrame: 234 },
  { text: "PORTUGIS TIBA DI", startFrame: 234, endFrame: 257 },
  { text: "MALAKA TAHUN 1511", startFrame: 257, endFrame: 317 },
  { text: "KERAJAAN", startFrame: 317, endFrame: 329 },
  { text: "MAJAPAHIT SUDAH", startFrame: 329, endFrame: 351 },
  { text: "MEMASANG MERIAM DI", startFrame: 351, endFrame: 372 },
  { text: "KAPAL-KAPAL", startFrame: 372, endFrame: 387 },
  { text: "PERANGNYA", startFrame: 387, endFrame: 408 },
  { text: "SENJATA INI BERNAMA", startFrame: 429, endFrame: 458 },
  { text: "CETBANG MERIAM", startFrame: 458, endFrame: 493 },
  { text: "PERUNGGU BUATAN", startFrame: 493, endFrame: 512 },
  { text: "PANDAI LOGAM", startFrame: 512, endFrame: 533 },
  { text: "NUSANTARA", startFrame: 533, endFrame: 559 },
  { text: "MESIU SENDIRI SUDAH", startFrame: 580, endFrame: 604 },
  { text: "DIKENAL DI JAWA", startFrame: 604, endFrame: 626 },
  { text: "SEJAK ABAD KEEMPAT", startFrame: 626, endFrame: 651 },
  { text: "BELAS", startFrame: 651, endFrame: 673 },
  { text: "TAK LAMA SETELAH", startFrame: 673, endFrame: 692 },
  { text: "PASUKAN MONGOL", startFrame: 692, endFrame: 711 },
  { text: "KUBILAI KHAN", startFrame: 711, endFrame: 728 },
  { text: "MENYERBU JAWA PADA", startFrame: 728, endFrame: 754 },
  { text: "TAHUN 1293", startFrame: 754, endFrame: 816 },
  { text: "VERSI YANG LEBIH", startFrame: 837, endFrame: 855 },
  { text: "MAJU MEMAKAI SISTEM", startFrame: 855, endFrame: 886 },
  { text: "PENGISIAN PELURU", startFrame: 886, endFrame: 906 },
  { text: "DARI BELAKANG ATAU", startFrame: 906, endFrame: 929 },
  { text: "BREECH-LOADING", startFrame: 929, endFrame: 961 },
  { text: "SERTA GARPU PUTAR", startFrame: 961, endFrame: 987 },
  { text: "YANG BISA DIARAHKAN", startFrame: 987, endFrame: 1013 },
  { text: "KE BERBAGAI SUDUT", startFrame: 1013, endFrame: 1036 },
  { text: "DENGAN SANGAT CEPAT", startFrame: 1036, endFrame: 1068 },
  { text: "KAPAL PERANG JUNG", startFrame: 1089, endFrame: 1112 },
  { text: "JAWA", startFrame: 1112, endFrame: 1121 },
  { text: "DIPERSENJATAI", startFrame: 1121, endFrame: 1140 },
  { text: "MERIAM CETBANG DI", startFrame: 1140, endFrame: 1164 },
  { text: "LAMBUNG DAN HALUAN", startFrame: 1164, endFrame: 1191 },
  { text: "KAPAL", startFrame: 1191, endFrame: 1211 },
  { text: "SAAT ABA-ABA TEMBAK", startFrame: 1233, endFrame: 1262 },
  { text: "BERKUMANDANG", startFrame: 1262, endFrame: 1292 },
  { text: "SEMBURAN PELURU DAN", startFrame: 1292, endFrame: 1317 },
  { text: "API MESIU MENGHANTAM", startFrame: 1317, endFrame: 1346 },
  { text: "KAPAL MUSUH DARI", startFrame: 1346, endFrame: 1367 },
  { text: "KEJAUHAN", startFrame: 1367, endFrame: 1392 },
  { text: "TEKNOLOGI MERIAM", startFrame: 1413, endFrame: 1436 },
  { text: "INILAH SALAH SATU", startFrame: 1436, endFrame: 1460 },
  { text: "KEKUATAN UTAMA", startFrame: 1460, endFrame: 1480 },
  { text: "ARMADA LAUT", startFrame: 1480, endFrame: 1497 },
  { text: "MAJAPAHIT DALAM", startFrame: 1497, endFrame: 1522 },
  { text: "MENGUASAI JALUR", startFrame: 1522, endFrame: 1546 },
  { text: "DAGANG REMPAH DI", startFrame: 1546, endFrame: 1567 },
  { text: "SELURUH PERAIRAN", startFrame: 1567, endFrame: 1587 },
  { text: "NUSANTARA YANG LUAS", startFrame: 1587, endFrame: 1624 },
  { text: "MENURUT KALIAN", startFrame: 1646, endFrame: 1680 },
  { text: "BANGGA NGGAK SIH", startFrame: 1680, endFrame: 1697 },
  { text: "TAHU BAHWA LELUHUR", startFrame: 1697, endFrame: 1725 },
  { text: "KITA TERNYATA SUDAH", startFrame: 1725, endFrame: 1750 },
  { text: "MENGUASAI", startFrame: 1750, endFrame: 1763 },
  { text: "TEKNOLOGI MERIAM", startFrame: 1763, endFrame: 1786 },
  { text: "BUATAN SENDIRI", startFrame: 1786, endFrame: 1816 },
];

// ============================================================================
// ELEMEN VISUAL 2D: MERIAM CETBANG PERUNGGU MAJAPAHIT
// ============================================================================
const CetbangCannon2D: React.FC<{ isFiring?: boolean }> = ({ isFiring = false }) => {
  const frame = useCurrentFrame();
  const blast = isFiring ? (frame * 15) % 40 : 0;

  return (
    <svg
      width={680}
      height={480}
      viewBox="0 0 680 480"
      style={{
        position: "absolute",
        bottom: "80px",
        left: "50%",
        transform: "translateX(-50%)",
        filter: "drop-shadow(0 20px 35px rgba(0,0,0,0.5))",
        zIndex: 28,
      }}
    >
      {/* Garpu Putar Besi (Swivel Fork) */}
      <path d="M 280 340 L 280 460 L 320 460 L 320 340 Z" fill="#1e293b" stroke="#000" strokeWidth="8" />
      <path d="M 230 310 Q 300 370 370 310 L 360 270 Q 300 320 240 270 Z" fill="#334155" stroke="#000" strokeWidth="6" />

      {/* Laras Panjang Perunggu Cetbang (Tembaga Keemasan) */}
      <path
        d="M 120 250 L 520 180 L 515 130 L 115 190 Z"
        fill="#b45309"
        stroke="#000"
        strokeWidth="10"
      />
      {/* Gelang Penguat Perunggu (Rings) */}
      {[200, 280, 360, 440].map((x, idx) => (
        <rect
          key={idx}
          x={x}
          y={235 - idx * 18}
          width="24"
          height="62"
          fill="#d97706"
          stroke="#000"
          strokeWidth="6"
          transform={`rotate(-10 ${x} ${235 - idx * 18})`}
        />
      ))}
      {/* Moncong Meriam (Muzzle) */}
      <ellipse cx="520" cy="155" rx="16" ry="28" fill="#78350f" stroke="#000" strokeWidth="8" transform="rotate(-10 520 155)" />

      {/* Popor Bilik Pengisian Belakang (Breech Block Chamber) */}
      <rect x="75" y="195" width="55" height="58" rx="8" fill="#451a03" stroke="#000" strokeWidth="8" transform="rotate(-10 75 195)" />
      {/* Tangkai Kemudi Pembidik Belakang */}
      <line x1="80" y1="225" x2="10" y2="240" stroke="#000" strokeWidth="14" strokeLinecap="round" />

      {/* Semburan Api & Peluru jika Sedang Menembak */}
      {isFiring && (
        <g transform="translate(530, 150)">
          <circle cx={40 + blast * 4} cy={-blast} r={32 + blast} fill="#f97316" opacity={0.85} />
          <circle cx={20 + blast * 3} cy={-blast * 0.5} r={20 + blast * 0.8} fill="#facc15" opacity={0.95} />
          <circle cx={90 + blast * 16} cy={-blast * 3} r="18" fill="#0f172a" stroke="#000" strokeWidth="4" />
        </g>
      )}
    </svg>
  );
};

// ============================================================================
// ELEMEN VISUAL 2D: GELADAK KAPAL JUNG JAWA
// ============================================================================
const JungJawaDeck2D: React.FC = () => {
  return (
    <svg
      width={1080}
      height={320}
      viewBox="0 0 1080 320"
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        zIndex: 20,
      }}
    >
      <path d="M 0 110 Q 540 80 1080 110 L 1080 320 L 0 320 Z" fill="#451a03" stroke="#000" strokeWidth="12" />
      {[160, 220, 280].map((y, idx) => (
        <line key={idx} x1="0" y1={y} x2="1080" y2={y} stroke="#291404" strokeWidth="8" />
      ))}
      {/* Pasak & Rantai Lambung */}
      {[100, 250, 400, 550, 700, 850, 1000].map((x, idx) => (
        <circle key={idx} cx={x} cy="190" r="8" fill="#eab308" stroke="#000" strokeWidth="4" />
      ))}
    </svg>
  );
};

// ============================================================================
// MAIN COMPOSITION: CETBANG MAJAPAHIT (62 DETIK)
// ============================================================================
export const CetbangMajapahitExplainer: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
      {/* 1. AUDIO VOICEOVER GLOBAL */}
      <Audio src={staticFile("audio/cetbang_narasi.mp3")} volume={1.0} />

      {/* 2. DETIK 0 COVER BADGE (IG Grid Safe Zone Y: 420-1500) */}
      <CoverBadge
        label="SENJATA KUNO"
        title="MERIAM MAJAPAHIT!"
        titleUntil={45}
        dockAt={60}
      />

      {/* 3. SHOT SEQUENCES (TOTAL 1837 FRAMES / 61.23s) */}
      <Series>
        {/* ================================================================== */}
        {/* SHOT 1: THE INVERSION HOOK (0 - 170 / 170f / 5.7s) */}
        {/* ================================================================== */}
        <Series.Sequence durationInFrames={170}>
          <CameraShots durationInFrames={170} offset={0}>
            {(() => {
              const zoom = interpolate(frame, [0, 170], [1.0, 1.08], { extrapolateRight: "clamp" });
              return (
                <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: "50% 50%" }}>
                  <ParchmentBg mood="sunburst" />
                  <SpeedLines intensity={1.1} />
                  <FlagRibbon />
                  <div style={{ position: "absolute", top: "52%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 30 }}>
                    <Stickman
                      pose="point_forward"
                      face="determined"
                      accessory="headband"
                      prop="flag"
                      scale={1.05}
                    />
                  </div>
                </AbsoluteFill>
              );
            })()}
          </CameraShots>
        </Series.Sequence>

        {/* ================================================================== */}
        {/* SHOT 2: MERIAM DI KAPAL MAJAPAHIT (SEBELUM PORTUGIS 1511) (170 - 423 / 253f / 8.4s) */}
        {/* ================================================================== */}
        <Series.Sequence durationInFrames={253}>
          <CameraShots durationInFrames={253} offset={1}>
            <AbsoluteFill>
              <ParchmentBg mood="parchment" />
              <SpeedLines intensity={0.5} />
              <JungJawaDeck2D />
              {/* Nakhoda Jung Jawa membawa panji di sisi kiri (tanpa tokoh Belanda: anakronis untuk era Majapahit) */}
              <div style={{ position: "absolute", top: "45%", left: "30%", transform: "translate(-50%, -50%)", zIndex: 35 }}>
                <Stickman
                  pose="proud"
                  face="confident"
                  accessory="turban"
                  prop="flag"
                  scale={0.96}
                />
              </div>
              {/* Pejuang Majapahit Menatap Tajam di Sisi Kanan */}
              <div style={{ position: "absolute", top: "45%", left: "70%", transform: "translate(-50%, -50%)", zIndex: 35 }}>
                <Stickman
                  pose="hold_weapon"
                  face="determined"
                  accessory="headband"
                  prop="keris"
                  scale={1.02}
                  flipX={true}
                />
              </div>
            </AbsoluteFill>
          </CameraShots>
        </Series.Sequence>

        {/* ================================================================== */}
        {/* SHOT 3: CETBANG PERUNGGU & MESIU PASCA-MONGOL 1293 (423 - 831 / 408f / 13.6s) */}
        {/* ================================================================== */}
        <Series.Sequence durationInFrames={408}>
          <CameraShots durationInFrames={408} offset={2}>
            <AbsoluteFill>
              <ParchmentBg mood="parchment" />
              <SpeedLines intensity={0.7} />
              {/* Meriam Cetbang Dipamerkan di Tengah Layar */}
              <CetbangCannon2D isFiring={false} />
              <div style={{ position: "absolute", top: "42%", left: "75%", transform: "translate(-50%, -50%)", zIndex: 35 }}>
                <Stickman
                  pose="proud"
                  face="confident"
                  accessory="headband"
                  prop="none"
                  scale={0.96}
                />
              </div>
            </AbsoluteFill>
          </CameraShots>
        </Series.Sequence>

        {/* ================================================================== */}
        {/* SHOT 4: TEKNOLOGI BREECH-LOADING & GARPU PUTAR (831 - 1083 / 252f / 8.4s) */}
        {/* ================================================================== */}
        <Series.Sequence durationInFrames={252}>
          <CameraShots durationInFrames={252} offset={3}>
            <AbsoluteFill>
              <ParchmentBg mood="sunburst" />
              <SpeedLines intensity={1.2} />
              {/* Meriam Cetbang Bersiap Menembak */}
              <CetbangCannon2D isFiring={true} />
              <div style={{ position: "absolute", top: "45%", left: "28%", transform: "translate(-50%, -50%)", zIndex: 35 }}>
                <Stickman
                  pose="hold_weapon"
                  face="determined"
                  accessory="headband"
                  prop="sword"
                  scale={0.98}
                />
              </div>
            </AbsoluteFill>
          </CameraShots>
        </Series.Sequence>

        {/* ================================================================== */}
        {/* SHOT 5: KAPAL PERANG JUNG JAWA (1083 - 1243 / 160f / 5.3s) */}
        {/* ================================================================== */}
        <Series.Sequence durationInFrames={160}>
          <CameraShots durationInFrames={160} offset={4}>
            <AbsoluteFill>
              <ParchmentBg mood="dark_storm" />
              <SpeedLines intensity={0.8} />
              <JungJawaDeck2D />
              {/* Prajurit Berjaga di Haluan Kapal */}
              <div style={{ position: "absolute", top: "44%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 35 }}>
                <Stickman
                  pose="proud"
                  face="confident"
                  accessory="turban"
                  prop="flag"
                  scale={1.05}
                />
              </div>
            </AbsoluteFill>
          </CameraShots>
        </Series.Sequence>

        {/* ================================================================== */}
        {/* SHOT 6: ABA-ABA TEMBAK & SEMBURAN MERIAM (1243 - 1407 / 164f / 5.5s) */}
        {/* ================================================================== */}
        <Series.Sequence durationInFrames={164}>
          <CameraShots durationInFrames={164} offset={5}>
            <AbsoluteFill>
              <ParchmentBg mood="dark_storm" />
              <SpeedLines intensity={1.5} />
              <CetbangCannon2D isFiring={true} />
              <div style={{ position: "absolute", top: "40%", left: "76%", transform: "translate(-50%, -50%)", zIndex: 35 }}>
                <Stickman
                  pose="point_forward"
                  face="determined"
                  accessory="headband"
                  prop="keris"
                  scale={1.1}
                  flipX={true}
                />
              </div>
            </AbsoluteFill>
          </CameraShots>
        </Series.Sequence>

        {/* ================================================================== */}
        {/* SHOT 7: ARMADA LAUT & JALUR DAGANG NUSANTARA (1407 - 1647 / 240f / 8.0s) */}
        {/* ================================================================== */}
        <Series.Sequence durationInFrames={240}>
          <CameraShots durationInFrames={240} offset={6}>
            <AbsoluteFill>
              <ParchmentBg mood="sunburst" />
              <SpeedLines intensity={1.2} />
              <FlagRibbon />
              <JungJawaDeck2D />
              <div style={{ position: "absolute", top: "46%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 35 }}>
                <Stickman
                  pose="lunge_action"
                  face="determined"
                  accessory="headband"
                  prop="keris"
                  scale={1.12}
                />
              </div>
            </AbsoluteFill>
          </CameraShots>
        </Series.Sequence>

        {/* ================================================================== */}
        {/* SHOT 8: CLOSING CTA - TEKNOLOGI MERIAM SENDIRI (1647 - 1837 / 190f / 6.3s) */}
        {/* ================================================================== */}
        <Series.Sequence durationInFrames={190}>
          <CameraShots durationInFrames={190} offset={7}>
            <AbsoluteFill>
              <ParchmentBg mood="sunburst" />
              <SpeedLines intensity={0.9} />
              <FlagRibbon waveSpeed={1.4} yOffset={40} />
              <JungJawaDeck2D />
              {/* Dua Sosok Pejuang Nusantara Mengawal Kejayaan */}
              <div style={{ position: "absolute", top: "48%", left: "34%", transform: "translate(-50%, -50%)", zIndex: 35 }}>
                <Stickman
                  pose="hold_weapon"
                  face="determined"
                  accessory="headband"
                  prop="keris"
                  scale={0.98}
                />
              </div>
              <div style={{ position: "absolute", top: "48%", left: "68%", transform: "translate(-50%, -50%)", zIndex: 35 }}>
                <Stickman
                  pose="point_forward"
                  face="confident"
                  accessory="turban"
                  prop="flag"
                  scale={1.02}
                  flipX={true}
                />
              </div>
            </AbsoluteFill>
          </CameraShots>
        </Series.Sequence>
      </Series>

      {/* 4. KINETIC SUBTITLE DI DADA (Y: 58%) */}
      <KineticSubtitle words={SUBTITLE_WORDS} top="58%" fontSize={54} />
    </AbsoluteFill>
  );
};
