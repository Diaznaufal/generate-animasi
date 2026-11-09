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
} from "./components/timeforge";

export const VIDEO_FPS = 30;
export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;
// 62.064 detik audio @ 30 FPS = 1862 frames
export const DURATION_IN_FRAMES = 1862;

// ============================================================================
// TIMELINE KINETIC SUBTITLE (TEPAT DI DADA KARAKTER, ANTI-DRIFT 100% VERBATIM)
// ============================================================================
const SUBTITLE_WORDS: KineticWord[] = [
  { text: "BANYAK YANG MENGIRA", startFrame: 3, endFrame: 26 },
  { text: "SENJATA API DAN", startFrame: 26, endFrame: 50 },
  { text: "MESIU PERTAMA KALI", startFrame: 50, endFrame: 75 },
  { text: "DIBAWA OLEH PENJAJAH", startFrame: 75, endFrame: 107 },
  { text: "BANGSA EROPA KE", startFrame: 107, endFrame: 128 },
  { text: "NUSANTARA", startFrame: 128, endFrame: 154 },
  { text: "FAKTANYA RATUSAN", startFrame: 176, endFrame: 220 },
  { text: "TAHUN SEBELUM KAPAL", startFrame: 220, endFrame: 244 },
  { text: "BELANDA PERTAMA", startFrame: 244, endFrame: 262 },
  { text: "MENDARAT DI BANTEN", startFrame: 262, endFrame: 300 },
  { text: "KERAJAAN", startFrame: 300, endFrame: 312 },
  { text: "MAJAPAHIT SUDAH", startFrame: 312, endFrame: 334 },
  { text: "MENGUASAI", startFrame: 334, endFrame: 348 },
  { text: "TEKNOLOGI SENJATA", startFrame: 348, endFrame: 375 },
  { text: "API TERCANGGIH DI", startFrame: 375, endFrame: 397 },
  { text: "DUNIA!", startFrame: 397, endFrame: 416, emphasis: true },
  { text: "SENJATA RAHASIA INI", startFrame: 438, endFrame: 468 },
  { text: "BERNAMA CETBANG", startFrame: 468, endFrame: 503, emphasis: true },
  { text: "SEBUAH MERIAM PUTAR", startFrame: 503, endFrame: 527 },
  { text: "PERUNGGU YANG", startFrame: 527, endFrame: 542 },
  { text: "DITEMPA OLEH PANDAI", startFrame: 542, endFrame: 566 },
  { text: "BESI NUSANTARA DARI", startFrame: 566, endFrame: 592 },
  { text: "TEKNOLOGI INVASI", startFrame: 592, endFrame: 621 },
  { text: "TENTARA MONGOL", startFrame: 621, endFrame: 638 },
  { text: "KUBILAI KHAN PADA", startFrame: 638, endFrame: 662 },
  { text: "TAHUN 1293!", startFrame: 662, endFrame: 723, emphasis: true },
  { text: "BERBEDA DENGAN", startFrame: 744, endFrame: 764 },
  { text: "MERIAM KUNO YANG", startFrame: 764, endFrame: 782 },
  { text: "KAKU", startFrame: 782, endFrame: 806 },
  { text: "CETBANG MAJAPAHIT", startFrame: 806, endFrame: 831, emphasis: true },
  { text: "MEMILIKI SISTEM", startFrame: 831, endFrame: 852 },
  { text: "PENGISIAN PELURU", startFrame: 852, endFrame: 872 },
  { text: "DARI BELAKANG ATAU", startFrame: 872, endFrame: 894 },
  { text: "BREECH-LOADING!", startFrame: 894, endFrame: 926, emphasis: true },
  { text: "SERTA GARPU PUTAR", startFrame: 926, endFrame: 951 },
  { text: "FLEKSIBEL YANG BISA", startFrame: 951, endFrame: 978 },
  { text: "DIARAHKAN KE SEGALA", startFrame: 978, endFrame: 1003 },
  { text: "SUDUT SECARA KILAT!", startFrame: 1003, endFrame: 1037, emphasis: true },
  { text: "SETIAP KAPAL PERANG", startFrame: 1058, endFrame: 1083 },
  { text: "RAKSASA JUNG JAWA", startFrame: 1083, endFrame: 1112, emphasis: true },
  { text: "DIPERSENJATAI", startFrame: 1112, endFrame: 1130 },
  { text: "PULUHAN MERIAM", startFrame: 1130, endFrame: 1149 },
  { text: "CETBANG DI LAMBUNG", startFrame: 1149, endFrame: 1176 },
  { text: "DAN HALUAN KAPAL", startFrame: 1176, endFrame: 1212 },
  { text: "SEKALI PERINTAH", startFrame: 1233, endFrame: 1252 },
  { text: "MAHAPATIH GAJAH MADA", startFrame: 1252, endFrame: 1282, emphasis: true },
  { text: "BERKUMANDANG", startFrame: 1282, endFrame: 1313 },
  { text: "SEMBURAN PELURU", startFrame: 1313, endFrame: 1332 },
  { text: "TIMAH DAN API", startFrame: 1332, endFrame: 1354 },
  { text: "MESIU LANGSUNG", startFrame: 1354, endFrame: 1372 },
  { text: "MENENGGELAMKAN", startFrame: 1372, endFrame: 1389 },
  { text: "KAPAL MUSUH DARI", startFrame: 1389, endFrame: 1412 },
  { text: "JARAK JAUH!", startFrame: 1412, endFrame: 1439, emphasis: true },
  { text: "KECANGGIHAN", startFrame: 1460, endFrame: 1476 },
  { text: "TAKTIK MERIAM", startFrame: 1476, endFrame: 1494 },
  { text: "CETBANG INILAH KUNCI", startFrame: 1494, endFrame: 1520 },
  { text: "UTAMA YANG", startFrame: 1520, endFrame: 1537 },
  { text: "MENGANTARKAN", startFrame: 1537, endFrame: 1551 },
  { text: "ARMADA LAUT", startFrame: 1551, endFrame: 1570 },
  { text: "MAJAPAHIT SUKSES", startFrame: 1570, endFrame: 1598, emphasis: true },
  { text: "MENYATUKAN", startFrame: 1598, endFrame: 1612 },
  { text: "SELURUH KEPULAUAN", startFrame: 1612, endFrame: 1635 },
  { text: "NUSANTARA!", startFrame: 1635, endFrame: 1659, emphasis: true },
  { text: "MENURUT KALIAN", startFrame: 1681, endFrame: 1715 },
  { text: "BANGGA NGGAK SIH", startFrame: 1715, endFrame: 1732 },
  { text: "TAHU BAHWA LELUHUR", startFrame: 1732, endFrame: 1760 },
  { text: "KITA TERNYATA ADALAH", startFrame: 1760, endFrame: 1788 },
  { text: "PELOPOR", startFrame: 1788, endFrame: 1797 },
  { text: "PERSENJATAAN API", startFrame: 1797, endFrame: 1820 },
  { text: "DUNIA?", startFrame: 1820, endFrame: 1840, emphasis: true },
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

      {/* 3. SHOT SEQUENCES (TOTAL 1862 FRAMES / 62.06s) */}
      <Series>
        {/* ================================================================== */}
        {/* SHOT 1: THE INVERSION HOOK (0 - 170 frames / 5.7s)                 */}
        {/* ================================================================== */}
        <Series.Sequence durationInFrames={170}>
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
        </Series.Sequence>

        {/* ================================================================== */}
        {/* SHOT 2: KAPAL BELANDA VS MAJAPAHIT (170 - 430 / 260 frames / 8.7s) */}
        {/* ================================================================== */}
        <Series.Sequence durationInFrames={260}>
          <AbsoluteFill>
            <ParchmentBg mood="parchment" />
            <SpeedLines intensity={0.5} />
            <JungJawaDeck2D />
            {/* Komandan Kolonial Belanda Kaget di Sisi Kiri */}
            <div style={{ position: "absolute", top: "45%", left: "30%", transform: "translate(-50%, -50%)", zIndex: 35 }}>
              <Stickman
                pose="shocked"
                face="shivering_cry"
                accessory="colonial_hat"
                scale={0.92}
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
        </Series.Sequence>

        {/* ================================================================== */}
        {/* SHOT 3: SENJATA RAHASIA CETBANG & MONGOL 1293 (430 - 730 / 300f / 10s)*/}
        {/* ================================================================== */}
        <Series.Sequence durationInFrames={300}>
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
        </Series.Sequence>

        {/* ================================================================== */}
        {/* SHOT 4: TEKNOLOGI BREECH-LOADING & GARPU PUTAR (730 - 1040 / 310f / 10.3s)*/}
        {/* ================================================================== */}
        <Series.Sequence durationInFrames={310}>
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
        </Series.Sequence>

        {/* ================================================================== */}
        {/* SHOT 5: KAPAL RAKSASA JUNG JAWA (1040 - 1220 / 180 frames / 6.0s) */}
        {/* ================================================================== */}
        <Series.Sequence durationInFrames={180}>
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
        </Series.Sequence>

        {/* ================================================================== */}
        {/* SHOT 6: GAJAH MADA & TEMBAKAN MERIAM DAHSYAT (1220 - 1450 / 230f / 7.7s)*/}
        {/* ================================================================== */}
        <Series.Sequence durationInFrames={230}>
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
        </Series.Sequence>

        {/* ================================================================== */}
        {/* SHOT 7: ARMADA LAUT MENYATUKAN NUSANTARA (1450 - 1670 / 220f / 7.3s)*/}
        {/* ================================================================== */}
        <Series.Sequence durationInFrames={220}>
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
        </Series.Sequence>

        {/* ================================================================== */}
        {/* SHOT 8: CLOSING CTA - PELOPOR SENJATA API (1670 - 1862 / 192f / 6.4s)*/}
        {/* ================================================================== */}
        <Series.Sequence durationInFrames={192}>
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
        </Series.Sequence>
      </Series>

      {/* 4. KINETIC SUBTITLE DI DADA (Y: 58%) */}
      <KineticSubtitle words={SUBTITLE_WORDS} top="58%" fontSize={86} />
    </AbsoluteFill>
  );
};
