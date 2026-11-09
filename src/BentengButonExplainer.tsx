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
// 60.456 detik audio @ 30 FPS = 1814 frames (Full 1 Menit)
export const DURATION_IN_FRAMES = 1814;

// ============================================================================
// TIMELINE KINETIC SUBTITLE (TEPAT DI DADA KARAKTER, ANTI-DRIFT 100% VERBATIM)
// ============================================================================
const SUBTITLE_WORDS: KineticWord[] = [
  { text: "BUKAN DI EROPA", startFrame: 3, endFrame: 23 },
  { text: "ATAU TIONGKOK", startFrame: 23, endFrame: 56 },
  { text: "BENTENG TERLUAS DI", startFrame: 56, endFrame: 80 },
  { text: "SELURUH MUKA BUMI", startFrame: 80, endFrame: 101 },
  { text: "JUSTRU BERDIRI TEGAK", startFrame: 101, endFrame: 133 },
  { text: "DI INDONESIA!", startFrame: 133, endFrame: 160, emphasis: true },
  { text: "INILAH BENTENG", startFrame: 181, endFrame: 204 },
  { text: "KERATON BUTON DI", startFrame: 204, endFrame: 227 },
  { text: "SULAWESI TENGGARA", startFrame: 227, endFrame: 264 },
  { text: "MEMBENTANG SELUAS", startFrame: 285, endFrame: 309 },
  { text: "DUA PULUH TIGA", startFrame: 309, endFrame: 324 },
  { text: "HEKTAR DENGAN", startFrame: 324, endFrame: 342 },
  { text: "KELILING HAMPIR TIGA", startFrame: 342, endFrame: 368 },
  { text: "KILOMETER", startFrame: 368, endFrame: 398, emphasis: true },
  { text: "BENTENG MEGAH INI", startFrame: 398, endFrame: 422 },
  { text: "BERTENGGER DI PUNCAK", startFrame: 422, endFrame: 447 },
  { text: "BUKIT KARANG", startFrame: 447, endFrame: 462 },
  { text: "SETINGGI SERATUS", startFrame: 462, endFrame: 486 },
  { text: "METER", startFrame: 486, endFrame: 505, emphasis: true },
  { text: "DARI KETINGGIAN INI", startFrame: 526, endFrame: 567 },
  { text: "PRAJURIT", startFrame: 567, endFrame: 579 },
  { text: "KESULTANAN BUTON", startFrame: 579, endFrame: 603 },
  { text: "MEMBANGUN ENAM BELAS", startFrame: 603, endFrame: 627 },
  { text: "BASTION MERIAM YANG", startFrame: 627, endFrame: 652 },
  { text: "MENGUASAI", startFrame: 652, endFrame: 666 },
  { text: "PANDANGAN TIGA RATUS", startFrame: 666, endFrame: 693 },
  { text: "ENAM PULUH DERAJAT", startFrame: 693, endFrame: 715 },
  { text: "KE SELURUH PERAIRAN", startFrame: 715, endFrame: 738 },
  { text: "SELAT BUTON", startFrame: 738, endFrame: 764 },
  { text: "SAAT ARMADA KAPAL", startFrame: 786, endFrame: 811 },
  { text: "PERANG VOC BELANDA", startFrame: 811, endFrame: 836 },
  { text: "MENGEPUNG DAN", startFrame: 836, endFrame: 852 },
  { text: "MENGHUJANI", startFrame: 852, endFrame: 865 },
  { text: "DINDING DENGAN", startFrame: 865, endFrame: 882 },
  { text: "RATUSAN TEMBAKAN", startFrame: 882, endFrame: 905 },
  { text: "MERIAM MEMBABI BUTA", startFrame: 905, endFrame: 946 },
  { text: "BENTENG SETEBAL DUA", startFrame: 946, endFrame: 974 },
  { text: "METER INI SAMA", startFrame: 974, endFrame: 997, emphasis: true },
  { text: "SEKALI TAK BERGEMING", startFrame: 997, endFrame: 1032 },
  { text: "RAHASIANYA?", startFrame: 1053, endFrame: 1087, emphasis: true },
  { text: "MASYARAKAT BUTON", startFrame: 1109, endFrame: 1134 },
  { text: "TIDAK MEMAKAI SEMEN", startFrame: 1134, endFrame: 1158 },
  { text: "MODERN MELAINKAN", startFrame: 1158, endFrame: 1194 },
  { text: "MEREKATKAN JUTAAN", startFrame: 1194, endFrame: 1217 },
  { text: "TON BATU GUNUNG", startFrame: 1217, endFrame: 1238 },
  { text: "MENGGUNAKAN", startFrame: 1238, endFrame: 1252 },
  { text: "ADONAN KAPUR KARANG", startFrame: 1252, endFrame: 1280 },
  { text: "DAN RIBUAN BUTIR", startFrame: 1280, endFrame: 1302 },
  { text: "PUTIH TELUR", startFrame: 1302, endFrame: 1327 },
  { text: "STRUKTUR PURBA INI", startFrame: 1348, endFrame: 1374 },
  { text: "TERBUKTI LENTUR", startFrame: 1374, endFrame: 1395 },
  { text: "MENYERAP GETARAN", startFrame: 1395, endFrame: 1414 },
  { text: "KINETIK PELURU", startFrame: 1414, endFrame: 1431 },
  { text: "MERIAM HINGGA RESMI", startFrame: 1431, endFrame: 1470 },
  { text: "DINOBATKAN", startFrame: 1470, endFrame: 1486 },
  { text: "GUINNESS WORLD", startFrame: 1486, endFrame: 1499 },
  { text: "RECORDS SEBAGAI", startFrame: 1499, endFrame: 1519 },
  { text: "BENTENG TERLUAS DI", startFrame: 1519, endFrame: 1543 },
  { text: "DUNIA YANG TAK", startFrame: 1543, endFrame: 1562 },
  { text: "PERNAH BERHASIL", startFrame: 1562, endFrame: 1581 },
  { text: "DITAKLUKKAN!", startFrame: 1581, endFrame: 1606, emphasis: true },
  { text: "MENURUT KALIAN", startFrame: 1627, endFrame: 1662 },
  { text: "BISAKAH TEKNOLOGI", startFrame: 1662, endFrame: 1689 },
  { text: "KONSTRUKSI MODERN", startFrame: 1689, endFrame: 1713 },
  { text: "MENANDINGI", startFrame: 1713, endFrame: 1727 },
  { text: "KECERDIKAN TAKTIK", startFrame: 1727, endFrame: 1752 },
  { text: "LELUHUR NUSANTARA", startFrame: 1752, endFrame: 1775 },
  { text: "INI?", startFrame: 1775, endFrame: 1792, emphasis: true },
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
// ELEMEN VISUAL 2D: MERIAM BELANDA & EFEK TEMBAKAN
// ============================================================================
const CannonAttack2D: React.FC = () => {
  const frame = useCurrentFrame();
  const blast = (frame * 12) % 45;
  const smoke = blast * 4.5;

  return (
    <svg
      width={1080}
      height={800}
      style={{
        position: "absolute",
        bottom: 80,
        left: 0,
        pointerEvents: "none",
        zIndex: 25,
      }}
    >
      <circle cx="200" cy="580" r="95" fill="#78350f" stroke="#000" strokeWidth="12" />
      <circle cx="200" cy="580" r="30" fill="#451a03" stroke="#000" strokeWidth="8" />
      <path
        d="M 160 550 L 390 410 L 370 340 L 140 500 Z"
        fill="#1e293b"
        stroke="#000"
        strokeWidth="12"
      />
      <ellipse cx="380" cy="375" rx="36" ry="18" fill="#475569" stroke="#000" strokeWidth="8" transform="rotate(-30 380 375)" />
      <circle cx={420 + smoke} cy={350 - smoke * 0.4} r={35 + blast * 1.5} fill="#f97316" opacity={0.8} />
      <circle cx={400 + smoke * 0.8} cy={360 - smoke * 0.3} r={24 + blast} fill="#facc15" opacity={0.9} />
      <circle cx={460 + blast * 18} cy={330 - blast * 4} r="28" fill="#090d16" stroke="#000" strokeWidth="6" />
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
      <Audio src={staticFile("audio/narasi.mp3")} volume={1.0} />

      {/* 2. DETIK 0 COVER BADGE (IG Grid & Shorts Safe Zone Y: 420-1500) */}
      <CoverBadge
        label="BENTENG KUNO"
        title="TAK PERNAH JEBOL!"
        titleUntil={45}
        dockAt={60}
      />

      {/* 3. SHOT SEQUENCES MODULAR BERBASIS SERIES (TOTAL 1814 FRAMES / 60.5s) */}
      <Series>
        {/* ================================================================== */}
        {/* SHOT 1: THE INVERSION HOOK (0 - 180 frames / 6.0s)                 */}
        {/* ================================================================== */}
        <Series.Sequence durationInFrames={180}>
          {(() => {
            const zoom = interpolate(frame, [0, 180], [1.0, 1.08], { extrapolateRight: "clamp" });
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
        {/* SHOT 2: SKALA MEGA-STRUKTUR & TEBING (180 - 520 / 340 frames / 11.3s)*/}
        {/* ================================================================== */}
        <Series.Sequence durationInFrames={340}>
          {(() => {
            const relFrame = frame - 180;
            const panY = interpolate(relFrame, [0, 340], [40, -30]);
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
        </Series.Sequence>

        {/* ================================================================== */}
        {/* SHOT 3: 16 BASTION MERIAM SELAT BUTON (520 - 780 / 260 frames / 8.7s)*/}
        {/* ================================================================== */}
        <Series.Sequence durationInFrames={260}>
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
        </Series.Sequence>

        {/* ================================================================== */}
        {/* SHOT 4: SERANGAN MERIAM VOC BELANDA (780 - 1050 / 270 frames / 9.0s)*/}
        {/* ================================================================== */}
        <Series.Sequence durationInFrames={270}>
          {(() => {
            return (
              <AbsoluteFill>
                <ParchmentBg mood="dark_storm" />
                <SpeedLines intensity={1.4} centerX={350} centerY={750} />
                <CannonAttack2D />
                <FortressWall2D height={460} />
                <div style={{ position: "absolute", bottom: "160px", left: "220px", transform: "translate(-50%, 0)", zIndex: 35 }}>
                  <Stickman
                    pose="shocked"
                    face="shivering_cry"
                    accessory="colonial_hat"
                    scale={0.88}
                  />
                </div>
                <div style={{ position: "absolute", top: "44%", right: "80px", zIndex: 35 }}>
                  <Stickman
                    pose="hold_weapon"
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
        </Series.Sequence>

        {/* ================================================================== */}
        {/* SHOT 5: RAHASIANYA? SPOTLIGHT (1050 - 1130 / 80 frames / 2.7s)     */}
        {/* ================================================================== */}
        <Series.Sequence durationInFrames={80}>
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
        </Series.Sequence>

        {/* ================================================================== */}
        {/* SHOT 6: PUTIH TELUR & KAPUR KARANG (1130 - 1340 / 210 frames / 7.0s) */}
        {/* ================================================================== */}
        <Series.Sequence durationInFrames={210}>
          {(() => {
            const relFrame = frame - 1130;
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
        </Series.Sequence>

        {/* ================================================================== */}
        {/* SHOT 7: GUINNESS WORLD RECORDS (1340 - 1620 / 280 frames / 9.3s)   */}
        {/* ================================================================== */}
        <Series.Sequence durationInFrames={280}>
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
        </Series.Sequence>

        {/* ================================================================== */}
        {/* SHOT 8: CLOSING RETORT & CTA (1620 - 1814 / 194 frames / 6.5s)     */}
        {/* ================================================================== */}
        <Series.Sequence durationInFrames={194}>
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
        </Series.Sequence>
      </Series>

      {/* 4. KINETIC SUBTITLE DI DADA (Y: 58%) */}
      <KineticSubtitle words={SUBTITLE_WORDS} top="58%" fontSize={86} />
    </AbsoluteFill>
  );
};
