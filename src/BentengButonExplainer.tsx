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
// 65.712 detik audio @ 30 FPS = 1972 frames
export const DURATION_IN_FRAMES = 1972;

// ============================================================================
// TIMELINE KINETIC SUBTITLE (TEPAT DI DADA KARAKTER, ANTI-DRIFT 100% VERBATIM)
// ============================================================================
const SUBTITLE_WORDS: KineticWord[] = [
  { text: "BUKAN DI EROPA", startFrame: 3, endFrame: 23 },
  { text: "ATAU TIONGKOK", startFrame: 23, endFrame: 56 },
  { text: "BENTENG TERLUAS", startFrame: 56, endFrame: 77 },
  { text: "VERSI REKOR MURI", startFrame: 77, endFrame: 98 },
  { text: "JUSTRU BERDIRI TEGAK", startFrame: 98, endFrame: 130 },
  { text: "DI INDONESIA", startFrame: 130, endFrame: 157, emphasis: true },
  { text: "INILAH BENTENG", startFrame: 179, endFrame: 201 },
  { text: "KERATON BUTON DI", startFrame: 201, endFrame: 223 },
  { text: "KOTA BAUBAU", startFrame: 223, endFrame: 257 },
  { text: "SULAWESI TENGGARA", startFrame: 257, endFrame: 295 },
  { text: "MEMBENTANG", startFrame: 316, endFrame: 328 },
  { text: "SEKITAR DUA PULUH", startFrame: 328, endFrame: 349 },
  { text: "TIGA HEKTAR DENGAN", startFrame: 349, endFrame: 371 },
  { text: "KELILING HAMPIR TIGA", startFrame: 371, endFrame: 397 },
  { text: "KILOMETER", startFrame: 397, endFrame: 426, emphasis: true },
  { text: "BENTENG MEGAH INI", startFrame: 426, endFrame: 450 },
  { text: "BERTENGGER DI ATAS", startFrame: 450, endFrame: 476 },
  { text: "BUKIT KARANG", startFrame: 476, endFrame: 503 },
  { text: "DARI KETINGGIAN INI", startFrame: 524, endFrame: 565 },
  { text: "PRAJURIT", startFrame: 565, endFrame: 577 },
  { text: "KESULTANAN BUTON", startFrame: 577, endFrame: 601 },
  { text: "MEMBANGUN ENAM BELAS", startFrame: 601, endFrame: 624 },
  { text: "BASTION MERIAM DAN", startFrame: 624, endFrame: 652 },
  { text: "DUA BELAS GERBANG", startFrame: 652, endFrame: 674 },
  { text: "YANG MENGAWASI", startFrame: 674, endFrame: 690 },
  { text: "PERAIRAN SELAT BUTON", startFrame: 690, endFrame: 730 },
  { text: "BUTON TERJEPIT DI", startFrame: 752, endFrame: 776 },
  { text: "ANTARA DUA KEKUATAN", startFrame: 776, endFrame: 802 },
  { text: "BESAR GOWA DAN", startFrame: 802, endFrame: 842 },
  { text: "TERNATE", startFrame: 842, endFrame: 865 },
  { text: "TAHUN 1613 SULTAN", startFrame: 887, endFrame: 950 },
  { text: "BUTON MEMILIH", startFrame: 950, endFrame: 968 },
  { text: "BERSEKUTU DENGAN VOC", startFrame: 968, endFrame: 1018 },
  { text: "TAPI TETAP MENJAGA", startFrame: 1018, endFrame: 1043 },
  { text: "BENTENGNYA", startFrame: 1043, endFrame: 1054 },
  { text: "SENDIRI KETIKA", startFrame: 1054, endFrame: 1073 },
  { text: "HUBUNGAN ITU MEMANAS", startFrame: 1073, endFrame: 1102 },
  { text: "PADA ABAD KEDELAPAN", startFrame: 1102, endFrame: 1128 },
  { text: "BELAS", startFrame: 1128, endFrame: 1146 },
  { text: "RAHASIANYA", startFrame: 1167, endFrame: 1201, emphasis: true },
  { text: "MASYARAKAT BUTON", startFrame: 1223, endFrame: 1251 },
  { text: "TIDAK MEMAKAI SEMEN", startFrame: 1251, endFrame: 1274 },
  { text: "MODERN MELAINKAN", startFrame: 1274, endFrame: 1312 },
  { text: "MENYUSUN BATU GUNUNG", startFrame: 1312, endFrame: 1340 },
  { text: "DENGAN ADONAN KAPUR", startFrame: 1340, endFrame: 1365 },
  { text: "KARANG", startFrame: 1365, endFrame: 1384 },
  { text: "KONON", startFrame: 1406, endFrame: 1430 },
  { text: "PUTIH TELUR IKUT", startFrame: 1430, endFrame: 1452 },
  { text: "DICAMPURKAN", startFrame: 1452, endFrame: 1469 },
  { text: "SEBAGAI PEREKAT", startFrame: 1469, endFrame: 1498 },
  { text: "LEBIH DARI EMPAT", startFrame: 1520, endFrame: 1538 },
  { text: "ABAD KEMUDIAN", startFrame: 1538, endFrame: 1572 },
  { text: "DINDING BATU INI", startFrame: 1572, endFrame: 1594 },
  { text: "MASIH BERDIRI KOKOH", startFrame: 1594, endFrame: 1634 },
  { text: "HINGGA TAHUN DUA", startFrame: 1634, endFrame: 1653 },
  { text: "RIBU ENAM DICATAT", startFrame: 1653, endFrame: 1676 },
  { text: "MUSEUM REKOR", startFrame: 1676, endFrame: 1694 },
  { text: "INDONESIA SEBAGAI", startFrame: 1694, endFrame: 1719, emphasis: true },
  { text: "BENTENG TERLUAS DI", startFrame: 1719, endFrame: 1744 },
  { text: "DUNIA", startFrame: 1744, endFrame: 1764 },
  { text: "MENURUT KALIAN", startFrame: 1785, endFrame: 1820 },
  { text: "BISAKAH TEKNOLOGI", startFrame: 1820, endFrame: 1847 },
  { text: "KONSTRUKSI MODERN", startFrame: 1847, endFrame: 1872 },
  { text: "MENANDINGI", startFrame: 1872, endFrame: 1885 },
  { text: "KECERDIKAN TAKTIK", startFrame: 1885, endFrame: 1910 },
  { text: "LELUHUR NUSANTARA", startFrame: 1910, endFrame: 1934 },
  { text: "INI", startFrame: 1934, endFrame: 1950 },
];

// ============================================================================
// ELEMEN VISUAL 2D: TEMBOK BENTENG BATU KAPUR
// ============================================================================
const FortressWall2D: React.FC<{ height?: number }> = ({ height = 450 }) => {
  return (
    <svg
      width={1080}
      height={height}
      viewBox={`0 0 1080 ${height}`}
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        filter: "drop-shadow(0 -15px 30px rgba(0,0,0,0.45))",
      }}
    >
      <rect x="0" y="80" width="1080" height={height - 80} fill="#78716c" stroke="#1c1917" strokeWidth="12" />
      {[0, 160, 320, 480, 640, 800, 960].map((x, i) => (
        <rect
          key={i}
          x={x + 10}
          y="0"
          width="110"
          height="90"
          fill="#57534e"
          stroke="#1c1917"
          strokeWidth="10"
        />
      ))}
      {[140, 210, 280, 350, 420].map((y, rowIdx) => (
        <g key={rowIdx}>
          <line x1="0" y1={y} x2="1080" y2={y} stroke="#292524" strokeWidth="8" />
          {[...Array(8)].map((_, colIdx) => (
            <line
              key={colIdx}
              x1={colIdx * 140 + (rowIdx % 2 === 0 ? 40 : 100)}
              y1={y - 70}
              x2={colIdx * 140 + (rowIdx % 2 === 0 ? 40 : 100)}
              y2={y}
              stroke="#292524"
              strokeWidth="6"
            />
          ))}
        </g>
      ))}
    </svg>
  );
};

// ============================================================================
// MAIN 2D EXPLAINER COMPOSITION: BENTENG KERATON BUTON (60 DETIK)
// ============================================================================
export const BentengButonExplainer: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
      {/* 1. AUDIO VOICEOVER GLOBAL */}
      <Audio src={staticFile("audio/benteng_narasi.mp3")} volume={1.0} />

      {/* 2. DETIK 0 COVER BADGE (IG Grid & Shorts Safe Zone Y: 420-1500) */}
      <CoverBadge
        label="BENTENG KUNO"
        title="BENTENG TERLUAS!"
        titleUntil={45}
        dockAt={60}
      />

      {/* 3. SHOT SEQUENCES MODULAR BERBASIS SERIES (TOTAL 1972 FRAMES / 65.73s) */}
      <Series>
        {/* ================================================================== */}
        {/* SHOT 1: THE INVERSION HOOK (0 - 173 / 173f / 5.8s) */}
        {/* ================================================================== */}
        <Series.Sequence durationInFrames={173}>
          <CameraShots durationInFrames={173} offset={0}>
            {(() => {
              const zoom = interpolate(frame, [0, 173], [1.0, 1.08], { extrapolateRight: "clamp" });
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
        {/* SHOT 2: SKALA MEGA-STRUKTUR & BUKIT KARANG (173 - 518 / 345f / 11.5s) */}
        {/* ================================================================== */}
        <Series.Sequence durationInFrames={345}>
          <CameraShots durationInFrames={345} offset={1}>
            {(() => {
              const relFrame = frame - 173;
              const panY = interpolate(relFrame, [0, 345], [40, -30]);
              return (
                <AbsoluteFill style={{ transform: `translateY(${panY}px)` }}>
                  <ParchmentBg mood="parchment" />
                  <SpeedLines intensity={0.4} />
                  <FortressWall2D height={580} />
                  <div style={{ position: "absolute", top: "42%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 35 }}>
                    <Stickman
                      pose="proud"
                      face="confident"
                      accessory="headband"
                      prop="keris"
                      scale={0.92}
                    />
                  </div>
                </AbsoluteFill>
              );
            })()}
          </CameraShots>
        </Series.Sequence>

        {/* ================================================================== */}
        {/* SHOT 3: 16 BASTION & 12 GERBANG SELAT BUTON (518 - 738 / 220f / 7.3s) */}
        {/* ================================================================== */}
        <Series.Sequence durationInFrames={220}>
          <CameraShots durationInFrames={220} offset={2}>
            {(() => {
              return (
                <AbsoluteFill>
                  <ParchmentBg mood="parchment" />
                  <SpeedLines intensity={0.6} />
                  <FortressWall2D height={480} />
                  <div style={{ position: "absolute", top: "45%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 35 }}>
                    <Stickman
                      pose="hold_weapon"
                      face="determined"
                      accessory="turban"
                      prop="sword"
                      scale={0.98}
                    />
                  </div>
                </AbsoluteFill>
              );
            })()}
          </CameraShots>
        </Series.Sequence>

        {/* ================================================================== */}
        {/* SHOT 4: GOWA, TERNATE & PERSEKUTUAN VOC 1613 (738 - 1161 / 423f / 14.1s) */}
        {/* ================================================================== */}
        <Series.Sequence durationInFrames={423}>
          <CameraShots durationInFrames={423} offset={3}>
            {(() => {
              return (
                <AbsoluteFill>
                  {/* Persekutuan 1613: utusan VOC dan prajurit Buton berhadapan waspada, bukan pengepungan */}
                  <ParchmentBg mood="parchment" />
                  <SpeedLines intensity={0.6} />
                  <FortressWall2D height={420} />
                  <div style={{ position: "absolute", top: "46%", left: "28%", transform: "translate(-50%, -50%)", zIndex: 35 }}>
                    <Stickman
                      pose="point_forward"
                      face="confident"
                      accessory="colonial_hat"
                      scale={0.9}
                    />
                  </div>
                  <div style={{ position: "absolute", top: "46%", left: "72%", transform: "translate(-50%, -50%)", zIndex: 35 }}>
                    <Stickman
                      pose="proud"
                      face="determined"
                      accessory="headband"
                      prop="keris"
                      scale={0.98}
                      flipX={true}
                    />
                  </div>
                </AbsoluteFill>
              );
            })()}
          </CameraShots>
        </Series.Sequence>

        {/* ================================================================== */}
        {/* SHOT 5: RAHASIANYA? SPOTLIGHT (1161 - 1241 / 80f / 2.7s) */}
        {/* ================================================================== */}
        <Series.Sequence durationInFrames={80}>
          <CameraShots durationInFrames={80} offset={4}>
            <AbsoluteFill>
              <ParchmentBg mood="spotlight" />
              <div
                style={{
                  position: "absolute",
                  top: "22%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontFamily: "Impact, Arial Black",
                  fontSize: "140px",
                  color: "#eab308",
                  WebkitTextStroke: "12px #000",
                  paintOrder: "stroke fill",
                  textShadow: "0 10px 30px rgba(0,0,0,0.8)",
                  zIndex: 40,
                }}
              >
                ?
              </div>
              <div style={{ position: "absolute", top: "54%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 35 }}>
                <Stickman
                  pose="shocked"
                  face="shocked"
                  accessory="none"
                  scale={1.05}
                />
              </div>
            </AbsoluteFill>
          </CameraShots>
        </Series.Sequence>

        {/* ================================================================== */}
        {/* SHOT 6: KAPUR KARANG & PUTIH TELUR (KONON) (1241 - 1514 / 273f / 9.1s) */}
        {/* ================================================================== */}
        <Series.Sequence durationInFrames={273}>
          <CameraShots durationInFrames={273} offset={5}>
            {(() => {
              const relFrame = frame - 1241;
              const bounce = Math.sin(relFrame * 0.12) * 8;
              return (
                <AbsoluteFill>
                  <ParchmentBg mood="parchment" />
                  <SpeedLines intensity={0.7} />
                  <svg
                    width={340}
                    height={420}
                    style={{
                      position: "absolute",
                      top: "32%",
                      left: "22%",
                      transform: `translate(-50%, -50%) translateY(${bounce}px)`,
                      filter: "drop-shadow(0 15px 30px rgba(0,0,0,0.4))",
                      zIndex: 25,
                    }}
                  >
                    <ellipse cx="170" cy="210" rx="130" ry="170" fill="#fef08a" stroke="#000" strokeWidth="14" />
                    <circle cx="170" cy="220" r="75" fill="#f59e0b" stroke="#000" strokeWidth="8" />
                    <ellipse cx="130" cy="150" rx="28" ry="45" fill="#ffffff" opacity={0.6} />
                  </svg>
                  <div style={{ position: "absolute", top: "52%", left: "70%", transform: "translate(-50%, -50%)", zIndex: 35 }}>
                    <Stickman
                      pose="point_forward"
                      face="confident"
                      accessory="headband"
                      prop="none"
                      scale={1.08}
                    />
                  </div>
                </AbsoluteFill>
              );
            })()}
          </CameraShots>
        </Series.Sequence>

        {/* ================================================================== */}
        {/* SHOT 7: REKOR MURI 2006 (1514 - 1779 / 265f / 8.8s) */}
        {/* ================================================================== */}
        <Series.Sequence durationInFrames={265}>
          <CameraShots durationInFrames={265} offset={6}>
            <AbsoluteFill>
              <ParchmentBg mood="sunburst" />
              <SpeedLines intensity={1.3} />
              <FlagRibbon />
              <FortressWall2D height={500} />
              <div style={{ position: "absolute", top: "48%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 35 }}>
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
        {/* SHOT 8: CLOSING RETORT & CTA (1779 - 1972 / 193f / 6.4s) */}
        {/* ================================================================== */}
        <Series.Sequence durationInFrames={193}>
          <CameraShots durationInFrames={193} offset={7}>
            <AbsoluteFill>
              <ParchmentBg mood="sunburst" />
              <SpeedLines intensity={0.9} />
              <FlagRibbon waveSpeed={1.4} yOffset={40} />
              <FortressWall2D height={420} />
              <div style={{ position: "absolute", top: "50%", left: "34%", transform: "translate(-50%, -50%)", zIndex: 35 }}>
                <Stickman
                  pose="hold_weapon"
                  face="determined"
                  accessory="headband"
                  prop="keris"
                  scale={0.98}
                />
              </div>
              <div style={{ position: "absolute", top: "50%", left: "68%", transform: "translate(-50%, -50%)", zIndex: 35 }}>
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
