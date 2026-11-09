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
// 33.216 detik audio @ 30 FPS = 997 frames
export const DURATION_IN_FRAMES = 997;

// ============================================================================
// TIMELINE KINETIC SUBTITLE (TEPAT DI DADA KARAKTER SESUAI ATURAN TIMEFORGE)
// ============================================================================
const SUBTITLE_WORDS: KineticWord[] = [
  // Beat 1: Hook (0 - 135)
  { text: "BUKAN MERIAM EROPA", startFrame: 3, endFrame: 35 },
  { text: "YANG BIKIN BELANDA", startFrame: 35, endFrame: 75 },
  { text: "FRUSTRASI TOTAL!", startFrame: 75, endFrame: 105, emphasis: true },
  { text: "DI KERATON BUTON!", startFrame: 105, endFrame: 135, emphasis: true },

  // Beat 2: Rising Conflict (135 - 282)
  { text: "DIKELILINGI JURANG TERJAL", startFrame: 135, endFrame: 175 },
  { text: "DINDING BATU KAPUR", startFrame: 175, endFrame: 215 },
  { text: "SETINGGI 8 METER!", startFrame: 215, endFrame: 250, emphasis: true },
  { text: "KOKOH MENJULANG!", startFrame: 250, endFrame: 282 },

  // Beat 3: Serangan Meriam (282 - 420)
  { text: "MERIAM MUSUH", startFrame: 282, endFrame: 320 },
  { text: "MENEMBAK MEMBABI BUTA!", startFrame: 320, endFrame: 365, emphasis: true },
  { text: "DINDINGNYA KOKOH", startFrame: 365, endFrame: 395 },
  { text: "TAK BERGEMING SEDIKIT PUN!", startFrame: 395, endFrame: 420, emphasis: true },

  // Beat 4: Rahasianya? (420 - 478)
  { text: "RAHASIANYA...?", startFrame: 420, endFrame: 478, emphasis: true },

  // Beat 5: Putih Telur & Kapur Karang (478 - 648)
  { text: "RIBUAN TON BATU GUNUNG", startFrame: 478, endFrame: 520 },
  { text: "DIREKATKAN PUTIH TELUR", startFrame: 520, endFrame: 565, emphasis: true },
  { text: "DAN KAPUR KARANG!", startFrame: 565, endFrame: 610, emphasis: true },
  { text: "BIO-STRUKTUR LELUHUR!", startFrame: 610, endFrame: 648 },

  // Beat 6: 23 Hektar Tak Pernah Dijebol (648 - 777)
  { text: "SELUAS 23 HEKTAR", startFrame: 648, endFrame: 690 },
  { text: "TAK PERNAH", startFrame: 690, endFrame: 730 },
  { text: "BERHASIL DIJEBOL!", startFrame: 730, endFrame: 777, emphasis: true },

  // Beat 7: Terluas di Dunia & CTA (777 - 997)
  { text: "BENTENG TERLUAS DI DUNIA", startFrame: 777, endFrame: 825, emphasis: true },
  { text: "BERDIRI DI INDONESIA!", startFrame: 825, endFrame: 882, emphasis: true },
  { text: "MENURUT KALIAN...?", startFrame: 882, endFrame: 935 },
  { text: "BISAKAH SEMEN MODERN TANDINGI?", startFrame: 935, endFrame: 997, emphasis: true },
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
      {/* Dasar Tembok Batu Kapur Krem Tua */}
      <rect x="0" y="80" width="1080" height={height - 80} fill="#78716c" stroke="#1c1917" strokeWidth="12" />
      {/* Parapet / Gigi Benteng (Battlement) */}
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
      {/* Garis-Garis Tekstur Susunan Batu Kuno */}
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
      {/* Roda Meriam Kayu */}
      <circle cx="200" cy="580" r="95" fill="#78350f" stroke="#000" strokeWidth="12" />
      <circle cx="200" cy="580" r="30" fill="#451a03" stroke="#000" strokeWidth="8" />
      {/* Moncong Meriam Besi Hitam Miring ke Atas Kanan */}
      <path
        d="M 160 550 L 390 410 L 370 340 L 140 500 Z"
        fill="#1e293b"
        stroke="#000"
        strokeWidth="12"
      />
      {/* Ring Moncong */}
      <ellipse cx="380" cy="375" rx="36" ry="18" fill="#475569" stroke="#000" strokeWidth="8" transform="rotate(-30 380 375)" />

      {/* Semburan Api & Asap dari Moncong */}
      <circle cx={420 + smoke} cy={350 - smoke * 0.4} r={35 + blast * 1.5} fill="#f97316" opacity={0.8} />
      <circle cx={400 + smoke * 0.8} cy={360 - smoke * 0.3} r={24 + blast} fill="#facc15" opacity={0.9} />
      {/* Bola Meriam Meluncur Cepat Menembus Layar */}
      <circle cx={460 + blast * 18} cy={330 - blast * 4} r="28" fill="#090d16" stroke="#000" strokeWidth="6" />
    </svg>
  );
};

// ============================================================================
// MAIN 2D EXPLAINER COMPOSITION: BENTENG KERATON BUTON
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

      {/* 3. SHOT SEQUENCES MODULAR BERBASIS SERIES */}
      <Series>
        {/* ================================================================== */}
        {/* SHOT 1: THE HOOK (0 - 135 frames / 4.5s)                           */}
        {/* ================================================================== */}
        <Series.Sequence durationInFrames={135}>
          {(() => {
            const zoom = interpolate(frame, [0, 135], [1.0, 1.08], { extrapolateRight: "clamp" });
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
        {/* SHOT 2: JURANG & DINDING 8 METER (135 - 282 / 147 frames / 4.9s)   */}
        {/* ================================================================== */}
        <Series.Sequence durationInFrames={147}>
          {(() => {
            const relFrame = frame - 135;
            const panY = interpolate(relFrame, [0, 147], [30, -20]);
            return (
              <AbsoluteFill style={{ transform: `translateY(${panY}px)` }}>
                <ParchmentBg mood="parchment" />
                <SpeedLines intensity={0.5} />
                <FortressWall2D height={580} />
                {/* Prajurit Berdiri Gagah di Puncak Dinding Benteng */}
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
        {/* SHOT 3: SERANGAN MERIAM BELANDA (282 - 420 / 138 frames / 4.6s)    */}
        {/* ================================================================== */}
        <Series.Sequence durationInFrames={138}>
          {(() => {
            return (
              <AbsoluteFill>
                <ParchmentBg mood="dark_storm" />
                <SpeedLines intensity={1.4} centerX={350} centerY={750} />
                <CannonAttack2D />
                <FortressWall2D height={460} />
                {/* Komandan Belanda Panik di Sisi Kiri Bawah */}
                <div style={{ position: "absolute", bottom: "160px", left: "220px", transform: "translate(-50%, 0)", zIndex: 35 }}>
                  <Stickman
                    pose="shocked"
                    face="shivering_cry"
                    accessory="colonial_hat"
                    scale={0.88}
                  />
                </div>
                {/* Pejuang Buton Menangkis di Sisi Kanan Atas */}
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
        {/* SHOT 4: RAHASIANYA? SPOTLIGHT DRAMATIS (420 - 478 / 58 frames / 1.9s) */}
        {/* ================================================================== */}
        <Series.Sequence durationInFrames={58}>
          <AbsoluteFill>
            <ParchmentBg mood="spotlight" />
            {/* Tanda Tanya Besar Komik Bergetar */}
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
        {/* SHOT 5: REKATAN PUTIH TELUR & KAPUR KARANG (478 - 648 / 170f / 5.6s) */}
        {/* ================================================================== */}
        <Series.Sequence durationInFrames={170}>
          {(() => {
            const relFrame = frame - 478;
            const bounce = Math.sin(relFrame * 0.12) * 8;
            return (
              <AbsoluteFill>
                <ParchmentBg mood="parchment" />
                <SpeedLines intensity={0.7} />
                {/* Ilustrasi Telur Raksasa & Bongkahan Batu Kapur */}
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
                  {/* Cangkang Telur Retak Putih Bersih */}
                  <ellipse cx="170" cy="210" rx="130" ry="170" fill="#fef08a" stroke="#000" strokeWidth="14" />
                  {/* Kuning Telur Emas */}
                  <circle cx="170" cy="220" r="75" fill="#f59e0b" stroke="#000" strokeWidth="8" />
                  {/* Garis Kilauan / Efek Alami */}
                  <ellipse cx="130" cy="150" rx="28" ry="45" fill="#ffffff" opacity={0.6} />
                </svg>

                {/* Prajurit Menunjuk Penjelasan Taktis */}
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
        {/* SHOT 6: 23 HEKTAR TAK PERNAH DIJEBOL (648 - 777 / 129 frames / 4.3s)*/}
        {/* ================================================================== */}
        <Series.Sequence durationInFrames={129}>
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
        {/* SHOT 7: TERLUAS DI DUNIA & CLOSING CTA (777 - 997 / 220f / 7.3s)   */}
        {/* ================================================================== */}
        <Series.Sequence durationInFrames={220}>
          <AbsoluteFill>
            <ParchmentBg mood="sunburst" />
            <SpeedLines intensity={0.9} />
            <FlagRibbon waveSpeed={1.4} yOffset={40} />
            <FortressWall2D height={420} />

            {/* Dua Sosok Pejuang Indonesia Gagah Mengawal Benteng */}
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
