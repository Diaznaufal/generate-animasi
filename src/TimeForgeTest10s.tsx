import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  Series,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";

export const DURATION_IN_FRAMES = 300; // 10 detik @ 30 FPS
export const VIDEO_FPS = 30;
export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;

// ============================================================================
// 1. KOMPONEN EFEK VISUAL MANGA SPEED LINES (AKSI KOMIK)
// ============================================================================
const MangaSpeedLines: React.FC<{ intensity?: number }> = ({ intensity = 1 }) => {
  const frame = useCurrentFrame();
  const lineCount = 36;

  return (
    <svg
      width={VIDEO_WIDTH}
      height={VIDEO_HEIGHT}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
        opacity: 0.25 * intensity,
      }}
    >
      <g transform={`translate(${VIDEO_WIDTH / 2}, ${VIDEO_HEIGHT / 2})`}>
        {[...Array(lineCount)].map((_, i) => {
          const angle = (i / lineCount) * Math.PI * 2 + (frame % 3) * 0.05;
          const length = 900 + ((frame * 25 + i * 40) % 200);
          const innerR = 320 + ((frame * 15 + i * 30) % 80);
          const x1 = Math.cos(angle) * innerR;
          const y1 = Math.sin(angle) * innerR;
          const x2 = Math.cos(angle) * length;
          const y2 = Math.sin(angle) * length;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#000000"
              strokeWidth={i % 2 === 0 ? 5 : 2}
            />
          );
        })}
      </g>
    </svg>
  );
};

// ============================================================================
// 2. LATAR BELAKANG PERKAMEN KUNO & SUNBURST (TIMEFORGE AESTHETIC)
// ============================================================================
const VintageSunburstBg: React.FC<{ mood?: "amber" | "dark" }> = ({ mood = "amber" }) => {
  const frame = useCurrentFrame();
  const rotation = (frame * 0.3) % 360;

  if (mood === "dark") {
    return (
      <AbsoluteFill style={{ backgroundColor: "#1e293b", overflow: "hidden" }}>
        {/* Langit mendung historis */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at 50% 35%, #334155 0%, #0f172a 100%)",
          }}
        />
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#d97706", overflow: "hidden" }}>
      {/* Warna dasar kertas perkamen hangat */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 50% 45%, #fef3c7 0%, #d97706 85%)",
        }}
      />

      {/* Sunburst Rays berputar halus */}
      <svg
        width={VIDEO_WIDTH * 2}
        height={VIDEO_WIDTH * 2}
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
          opacity: 0.18,
          pointerEvents: "none",
        }}
      >
        <g transform={`translate(${VIDEO_WIDTH}, ${VIDEO_WIDTH})`}>
          {[...Array(24)].map((_, i) => {
            const startA = (i / 24) * Math.PI * 2;
            const endA = ((i + 0.5) / 24) * Math.PI * 2;
            const r = VIDEO_WIDTH * 1.5;
            const x1 = Math.cos(startA) * r;
            const y1 = Math.sin(startA) * r;
            const x2 = Math.cos(endA) * r;
            const y2 = Math.sin(endA) * r;
            return (
              <polygon
                key={i}
                points={`0,0 ${x1},${y1} ${x2},${y2}`}
                fill="#b45309"
              />
            );
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ============================================================================
// 3. KARAKTER STICKMAN 2D EKSPRESIF (TIMEFORGE SIGNATURE)
// ============================================================================
const StickmanWarrior: React.FC<{
  pose?: "point_left" | "proud" | "shocked";
  headband?: boolean;
}> = ({ pose = "proud", headband = true }) => {
  const frame = useCurrentFrame();
  const breathe = Math.sin(frame * 0.12) * 4;

  return (
    <svg
      viewBox="0 0 400 600"
      width="440"
      height="660"
      style={{ overflow: "visible", filter: "drop-shadow(0 15px 25px rgba(0,0,0,0.35))" }}
    >
      <g transform={`translate(200, 300)`}>
        {/* KAKI */}
        <line x1="-10" y1="90" x2="-55" y2="230" stroke="#000" strokeWidth="16" strokeLinecap="round" />
        <line x1="-55" y1="230" x2="-80" y2="232" stroke="#000" strokeWidth="16" strokeLinecap="round" />

        <line x1="10" y1="90" x2="55" y2="230" stroke="#000" strokeWidth="16" strokeLinecap="round" />
        <line x1="55" y1="230" x2="80" y2="232" stroke="#000" strokeWidth="16" strokeLinecap="round" />

        {/* TUBUH / SPINE */}
        <line x1="0" y1="-40" x2="0" y2="90" stroke="#000" strokeWidth="18" strokeLinecap="round" />

        {/* TANGAN BERDASARKAN POSE */}
        {pose === "point_left" ? (
          <>
            {/* Tangan Kanan Menunjuk Dramatis ke Kiri */}
            <line x1="-5" y1="-25" x2="-90" y2="-50" stroke="#000" strokeWidth="15" strokeLinecap="round" />
            <line x1="-90" y1="-50" x2="-160" y2="-90" stroke="#000" strokeWidth="15" strokeLinecap="round" />
            {/* Tangan Kiri di Pinggang */}
            <line x1="5" y1="-25" x2="70" y2="20" stroke="#000" strokeWidth="15" strokeLinecap="round" />
            <line x1="70" y1="20" x2="40" y2="80" stroke="#000" strokeWidth="15" strokeLinecap="round" />
          </>
        ) : pose === "shocked" ? (
          <>
            {/* Kedua tangan memegang kepala karena kaget */}
            <line x1="-5" y1="-25" x2="-80" y2="-70" stroke="#000" strokeWidth="15" strokeLinecap="round" />
            <line x1="-80" y1="-70" x2="-45" y2="-120" stroke="#000" strokeWidth="15" strokeLinecap="round" />
            <line x1="5" y1="-25" x2="80" y2="-70" stroke="#000" strokeWidth="15" strokeLinecap="round" />
            <line x1="80" y1="-70" x2="45" y2="-120" stroke="#000" strokeWidth="15" strokeLinecap="round" />
          </>
        ) : (
          <>
            {/* Tangan Bertolak Pinggang Gagah */}
            <line x1="-5" y1="-25" x2="-75" y2="20" stroke="#000" strokeWidth="15" strokeLinecap="round" />
            <line x1="-75" y1="20" x2="-35" y2="75" stroke="#000" strokeWidth="15" strokeLinecap="round" />
            <line x1="5" y1="-25" x2="75" y2="20" stroke="#000" strokeWidth="15" strokeLinecap="round" />
            <line x1="75" y1="20" x2="35" y2="75" stroke="#000" strokeWidth="15" strokeLinecap="round" />
          </>
        )}

        {/* KEPALA DENGAN BREATHING MICRO-MOTION */}
        <g transform={`translate(0, ${-110 + breathe})`}>
          {/* Kepala Putih Bulat dengan Outline Hitam */}
          <circle cx="0" cy="0" r="62" fill="#ffffff" stroke="#000000" strokeWidth="15" />

          {/* Aksesori Udeng / Ikat Kepala Pejuang */}
          {headband && (
            <path
              d="M -58 -15 Q 0 -35 58 -15 L 55 -38 Q 0 -58 -55 -38 Z"
              fill="#b91c1c"
              stroke="#000000"
              strokeWidth="5"
            />
          )}

          {/* MATA EKSPRESIF KARTUN KOMIK */}
          {pose === "shocked" ? (
            <>
              {/* Mata Kaget Lebar */}
              <circle cx="-22" cy="5" r="14" fill="#000" />
              <circle cx="22" cy="5" r="14" fill="#000" />
              <circle cx="-18" cy="2" r="5" fill="#fff" />
              <circle cx="26" cy="2" r="5" fill="#fff" />
              {/* Mulut O Kaget */}
              <ellipse cx="0" cy="35" rx="12" ry="16" fill="#000" />
            </>
          ) : (
            <>
              {/* Mata Tajam / Marah Bertekad */}
              <line x1="-36" y1="-8" x2="-8" y2="2" stroke="#000" strokeWidth="7" strokeLinecap="round" />
              <circle cx="-20" cy="8" r="9" fill="#000" />
              <line x1="36" y1="-8" x2="8" y2="2" stroke="#000" strokeWidth="7" strokeLinecap="round" />
              <circle cx="20" cy="8" r="9" fill="#000" />
              {/* Senyum Tipis Percaya Diri */}
              <path d="M -15 32 Q 0 44 18 30" stroke="#000" strokeWidth="6" fill="none" strokeLinecap="round" />
            </>
          )}
        </g>
      </g>
    </svg>
  );
};

// ============================================================================
// 4. KINETIC WORD-BY-WORD SUBTITLE (TIMEFORGE SIGNATURE TEXT)
// ============================================================================
interface WordCue {
  text: string;
  startFrame: number;
  endFrame: number;
}

const CUES: WordCue[] = [
  { text: "BUKAN DI EROPA", startFrame: 3, endFrame: 45 },
  { text: "ATAU TIONGKOK!", startFrame: 45, endFrame: 75 },
  { text: "BENTENG TERLUAS", startFrame: 75, endFrame: 110 },
  { text: "DI DUNIA...", startFrame: 110, endFrame: 130 },
  { text: "ADA DI INDONESIA!", startFrame: 130, endFrame: 146 },
  { text: "NAMANYA...", startFrame: 146, endFrame: 175 },
  { text: "BENTENG", startFrame: 175, endFrame: 195 },
  { text: "KERATON BUTON!", startFrame: 195, endFrame: 230 },
  { text: "PERNAH KESINI?", startFrame: 230, endFrame: 300 },
];

const TimeForgeKineticSubtitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const activeCue = useMemo(() => {
    return CUES.find((c) => frame >= c.startFrame && frame < c.endFrame);
  }, [frame]);

  if (!activeCue) return null;

  // Spring Pop-in Animation
  const progress = spring({
    frame: frame - activeCue.startFrame,
    fps,
    config: { damping: 12, mass: 0.6, stiffness: 220 },
  });

  const scale = interpolate(progress, [0, 1], [0.8, 1.05]);

  return (
    <div
      style={{
        position: "absolute",
        top: "68%",
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none",
        zIndex: 100,
        transform: `scale(${scale})`,
      }}
    >
      <span
        style={{
          fontSize: "62px",
          fontFamily: "Impact, Arial Black, sans-serif",
          fontWeight: 900,
          color: "#ffffff",
          textAlign: "center",
          textTransform: "uppercase",
          letterSpacing: "2px",
          padding: "8px 24px",
          WebkitTextStroke: "6px #000000",
          paintOrder: "stroke fill",
          textShadow: "0 8px 18px rgba(0,0,0,0.85)",
          lineHeight: "1.1",
        }}
      >
        {activeCue.text}
      </span>
    </div>
  );
};

// ============================================================================
// 5. SHOT 1: THE INVERSION HOOK (BUKAN DI EROPA / TIONGKOK!)
// ============================================================================
const Shot1Hook2D: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animasi pop-in stickman
  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 180 },
  });
  const charY = interpolate(entrance, [0, 1], [250, 0]);

  return (
    <AbsoluteFill>
      <VintageSunburstBg mood="dark" />
      <MangaSpeedLines intensity={1.2} />

      {/* Siluet Kapal Penjajah Kuno di Latar Belakang */}
      <div
        style={{
          position: "absolute",
          top: "22%",
          left: "50%",
          transform: `translateX(-50%) scale(${interpolate(frame, [0, 146], [0.95, 1.08])})`,
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontSize: "120px",
            filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.6))",
          }}
        >
          🏰
        </span>
      </div>

      {/* Karakter Stickman Utama */}
      <div
        style={{
          position: "absolute",
          bottom: "24%",
          left: "50%",
          transform: `translateX(-50%) translateY(${charY}px)`,
        }}
      >
        <StickmanWarrior pose="point_left" />
      </div>
    </AbsoluteFill>
  );
};

// ============================================================================
// 6. SHOT 2: REVEAL BENTENG BUTON (PETA & BENTENG RAKSASA)
// ============================================================================
const Shot2Reveal2D: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 84], [1, 1.15]);

  return (
    <AbsoluteFill>
      <VintageSunburstBg mood="amber" />
      <MangaSpeedLines intensity={0.8} />

      {/* Peta Kuno Perkamen Ilustrasi Indonesia / Sulawesi */}
      <div
        style={{
          position: "absolute",
          top: "16%",
          left: "50%",
          transform: `translateX(-50%) scale(${zoom})`,
          width: "720px",
          height: "440px",
          borderRadius: "28px",
          border: "8px solid #78350f",
          backgroundColor: "#fef3c7",
          boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <span style={{ fontSize: "28px", fontWeight: 900, color: "#92400e", letterSpacing: "4px" }}>
          SULAWESI TENGGARA
        </span>
        <span style={{ fontSize: "110px", margin: "10px 0" }}>🏝️</span>
        <div
          style={{
            background: "#b91c1c",
            color: "#ffffff",
            padding: "8px 24px",
            borderRadius: "9999px",
            fontWeight: 900,
            fontSize: "30px",
            boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
          }}
        >
          23 HEKTAR • 3 KM
        </div>
      </div>

      {/* Stickman Bangga di Depan Peta */}
      <div
        style={{
          position: "absolute",
          bottom: "24%",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <StickmanWarrior pose="proud" />
      </div>
    </AbsoluteFill>
  );
};

// ============================================================================
// 7. SHOT 3: OUTRO DENGAN TANDA TANYA BESAR
// ============================================================================
const Shot3Outro2D: React.FC = () => {
  const frame = useCurrentFrame();
  const qBounce = Math.sin(frame * 0.25) * 15;

  return (
    <AbsoluteFill>
      <VintageSunburstBg mood="amber" />

      {/* Tanda Tanya Besar Komik di Atas Kepala Karakter */}
      <div
        style={{
          position: "absolute",
          top: "14%",
          left: "50%",
          transform: `translateX(-50%) translateY(${qBounce}px)`,
          fontSize: "200px",
          fontWeight: 900,
          color: "#ffffff",
          fontFamily: "Impact, sans-serif",
          WebkitTextStroke: "10px #000000",
          paintOrder: "stroke fill",
          filter: "drop-shadow(0 15px 25px rgba(0,0,0,0.5))",
        }}
      >
        ?
      </div>

      {/* Stickman Kaget / Bertanya */}
      <div
        style={{
          position: "absolute",
          bottom: "24%",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <StickmanWarrior pose="shocked" />
      </div>
    </AbsoluteFill>
  );
};

// ============================================================================
// MAIN COMPOSITION EXPORT (10 DETIK TEST)
// ============================================================================
export const TimeForgeTest2D: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
      {/* 1. Global Narration Audio */}
      <Audio src={staticFile("audio/narasi.mp3")} volume={1} />

      {/* 2. Visual Shots Series */}
      <Series>
        {/* Shot 1: The Inversion Hook (0 - 146 frame / ~4.8 detik) */}
        <Series.Sequence durationInFrames={146}>
          <Shot1Hook2D />
        </Series.Sequence>

        {/* Shot 2: Reveal Benteng Buton (146 - 230 frame / ~2.8 detik) */}
        <Series.Sequence durationInFrames={84}>
          <Shot2Reveal2D />
        </Series.Sequence>

        {/* Shot 3: Question Mark Outro (230 - 300 frame / ~2.3 detik) */}
        <Series.Sequence durationInFrames={70}>
          <Shot3Outro2D />
        </Series.Sequence>
      </Series>

      {/* 3. Word-by-Word Kinetic Subtitle Pop-In */}
      <TimeForgeKineticSubtitle />
    </AbsoluteFill>
  );
};
