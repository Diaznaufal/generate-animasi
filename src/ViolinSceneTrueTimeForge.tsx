import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";
import { CoverBadge } from "./components/timeforge";

export const DURATION_IN_FRAMES = 195; // 6.5 detik @ 30 FPS
export const VIDEO_FPS = 30;
export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;

// ============================================================================
// 1. LATAR BELAKANG PERKAMEN KUNO VINTAGE & MANGA SPEED LINES
// ============================================================================
const VintageParchmentBg: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#f5eee1",
        backgroundImage: "radial-gradient(circle at 50% 40%, #ffffff 0%, #f6eee0 60%, #e2d4b7 100%)",
        overflow: "hidden",
      }}
    />
  );
};

const ActionSpeedLines: React.FC = () => {
  const frame = useCurrentFrame();
  const lineCount = 68;

  return (
    <svg
      width={VIDEO_WIDTH}
      height={VIDEO_HEIGHT}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
        opacity: 0.4,
      }}
    >
      <g transform={`translate(${VIDEO_WIDTH / 2}, ${VIDEO_HEIGHT / 2 - 120})`}>
        {[...Array(lineCount)].map((_, i) => {
          const angle = (i / lineCount) * Math.PI * 2 + ((frame * 17) % 13) * 0.008;
          const outerR = 1600 + ((frame * 50 + i * 60) % 250);
          const innerR = 400 + ((frame * 25 + i * 35) % 110);
          const x1 = Math.cos(angle) * innerR;
          const y1 = Math.sin(angle) * innerR;
          const x2 = Math.cos(angle) * outerR;
          const y2 = Math.sin(angle) * outerR;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#000000"
              strokeWidth={i % 4 === 0 ? 8 : i % 2 === 0 ? 4 : 2}
            />
          );
        })}
      </g>
    </svg>
  );
};

// ============================================================================
// 2. PERCIKAN TINTA MERAH & NOT BALOK MELAYANG
// ============================================================================
const MusicalParticles: React.FC = () => {
  const frame = useCurrentFrame();
  const notes = ["♪", "♫", "♬", "♩", "♪", "♫", "♬"];

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 12 }}>
      {/* Percikan Tinta Merah Khas TimeForge */}
      <svg width={VIDEO_WIDTH} height={VIDEO_HEIGHT} style={{ position: "absolute", top: 0, left: 0 }}>
        {[
          { cx: 160, cy: 300, r: 16 },
          { cx: 80, cy: 460, r: 10 },
          { cx: 940, cy: 340, r: 18 },
          { cx: 1000, cy: 580, r: 12 },
          { cx: 90, cy: 820, r: 14 },
          { cx: 980, cy: 960, r: 13 },
          { cx: 150, cy: 1180, r: 9 },
          { cx: 920, cy: 1260, r: 15 },
        ].map((dot, idx) => (
          <circle key={idx} cx={dot.cx} cy={dot.cy} r={dot.r} fill="#b91c1c" opacity="0.92" />
        ))}
      </svg>

      {/* Not Balok Mengambang Berwarna Merah dan Hitam */}
      {notes.map((symbol, i) => {
        const offset = i * 26;
        const progress = ((frame + offset) % 75) / 75;
        const x = 500 + Math.sin(i * 1.5 + frame * 0.06) * (260 + progress * 260);
        const y = 820 - progress * 620;
        const opacity = interpolate(progress, [0, 0.15, 0.85, 1], [0, 1, 0.9, 0]);
        const scale = 1.1 + progress * 0.6;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}px`,
              top: `${y}px`,
              opacity,
              transform: `scale(${scale}) rotate(${Math.sin(frame * 0.12 + i) * 22}deg)`,
              color: i % 2 === 0 ? "#dc2626" : "#0f172a",
              fontSize: "56px",
              fontWeight: 900,
              textShadow: "0 4px 10px rgba(0,0,0,0.3)",
            }}
          >
            {symbol}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ============================================================================
// 3. PITA MERAH PUTIH MELIUK DINAMIS
// ============================================================================
const FlagRibbon: React.FC = () => {
  const frame = useCurrentFrame();
  const wave1 = Math.sin(frame * 0.14) * 45;
  const wave2 = Math.cos(frame * 0.12) * 40;

  return (
    <svg
      width={VIDEO_WIDTH}
      height={VIDEO_HEIGHT}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 14,
        filter: "drop-shadow(0 16px 28px rgba(0,0,0,0.35))",
      }}
    >
      <g transform="translate(0, 60)">
        {/* Pita Merah */}
        <path
          d={`M -60 740 Q 280 ${540 + wave1} 540 ${660 + wave2} T 1160 ${520 - wave1}`}
          fill="none"
          stroke="#dc2626"
          strokeWidth="56"
          strokeLinecap="round"
        />
        {/* Pita Putih */}
        <path
          d={`M -60 796 Q 280 ${596 + wave1} 540 ${716 + wave2} T 1160 ${576 - wave1}`}
          fill="none"
          stroke="#ffffff"
          strokeWidth="56"
          strokeLinecap="round"
        />
        {/* Outline Tipis Merah */}
        <path
          d={`M -60 768 Q 280 ${568 + wave1} 540 ${688 + wave2} T 1160 ${548 - wave1}`}
          fill="none"
          stroke="#991b1b"
          strokeWidth="2.5"
        />
      </g>
    </svg>
  );
};

// ============================================================================
// 4. BIOLA AUTENTIK (CHINREST DI KIRI, LEHER MENJULUR KE KANAN ATAS)
// ============================================================================
const AuthenticViolin: React.FC = () => {
  return (
    <g transform="rotate(8)">
      <defs>
        <linearGradient id="realWoodGrad" x1="0%" y1="0%" x2="100%" y2="80%">
          <stop offset="0%" stopColor="#92400e" />
          <stop offset="40%" stopColor="#b45309" />
          <stop offset="75%" stopColor="#78350f" />
          <stop offset="100%" stopColor="#451a03" />
        </linearGradient>
      </defs>

      {/* Bayangan di Bawah Badan Biola */}
      <ellipse cx="140" cy="50" rx="130" ry="55" fill="rgba(0,0,0,0.38)" />

      {/* Badan Biola (Bout Kiri Chinrest, C-Bout Tengah, Bout Kanan) */}
      <path
        d="M 30 50
           C 15 10, 75 0, 125 15
           C 150 22, 145 36, 165 40
           C 185 44, 255 10, 280 48
           C 305 92, 255 122, 165 96
           C 145 90, 150 104, 125 100
           C 75 115, 15 88, 30 50 Z"
        fill="url(#realWoodGrad)"
        stroke="#1c0d02"
        strokeWidth="9"
      />

      {/* Purfling Kayu Tipis */}
      <path
        d="M 38 50 C 26 18, 80 10, 122 22 C 144 28, 140 38, 160 42 C 180 46, 244 18, 266 48 C 288 84, 244 106, 160 92 C 140 86, 144 96, 122 92 C 80 104, 26 80, 38 50 Z"
        fill="none"
        stroke="#451a03"
        strokeWidth="2"
        opacity="0.75"
      />

      {/* F-Holes Hitam */}
      <path
        d="M 120 36 C 132 30, 138 40, 128 46 C 116 52, 124 58, 134 54"
        fill="none"
        stroke="#171717"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M 175 40 C 187 34, 193 44, 183 50 C 171 56, 179 62, 189 58"
        fill="none"
        stroke="#171717"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* Bridge Kayu Penyangga Senar */}
      <rect x="145" y="36" width="12" height="38" rx="2" fill="#fef08a" stroke="#854d0e" strokeWidth="2.5" />

      {/* Fingerboard & Leher Biola Hitam Menjulur ke Kanan */}
      <polygon points="30,42 160,42 160,58 30,58" fill="#0f172a" stroke="#000" strokeWidth="2.5" />

      {/* Pegbox & Scroll Biola di Ujung Kanan */}
      <rect x="270" y="44" width="70" height="14" rx="4" fill="#78350f" stroke="#000" strokeWidth="3" />
      <circle cx="330" cy="51" r="18" fill="#854d0e" stroke="#000" strokeWidth="4" />
      <circle cx="330" cy="51" r="6" fill="#451a03" />

      {/* 4 Senar Putih Mengkilap */}
      <line x1="25" y1="45" x2="330" y2="45" stroke="#ffffff" strokeWidth="2.2" />
      <line x1="25" y1="48" x2="330" y2="48" stroke="#ffffff" strokeWidth="1.8" />
      <line x1="25" y1="52" x2="330" y2="52" stroke="#ffffff" strokeWidth="1.8" />
      <line x1="25" y1="55" x2="330" y2="55" stroke="#ffffff" strokeWidth="2.2" />

      {/* Tailpiece */}
      <polygon points="20,40 55,36 55,60 20,56" fill="#000000" stroke="#000" strokeWidth="2" />
      {/* Chinrest */}
      <ellipse cx="25" cy="68" rx="24" ry="16" fill="#000000" />
    </g>
  );
};

// ============================================================================
// 5. TOKOH W.R. SUPRATMAN (POSE ASIMETRIS PERSIS FRAME_0630_21.0S)
// ============================================================================
const WRSupratmanStickman: React.FC = () => {
  const frame = useCurrentFrame();

  // Gesekan Bow Biola Mengikuti Irama Musik
  const bowStroke = Math.sin(frame * 0.55);

  // Goyangan Emosional Tubuh & Ayunan Kepala
  const bodyShake = Math.sin(frame * 0.28) * 4;
  const headBob = Math.cos(frame * 0.55) * 5;

  return (
    <div
      style={{
        position: "absolute",
        top: "48%",
        left: "50%",
        transform: `translate(-50%, -50%) translate(${bodyShake}px, 0)`,
        width: "1000px",
        height: "1700px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 20,
      }}
    >
      <svg
        viewBox="0 0 1000 1600"
        width="1000"
        height="1600"
        style={{ overflow: "visible", filter: "drop-shadow(0 25px 45px rgba(0,0,0,0.45))" }}
      >
        <g transform="translate(500, 780)">
          {/* BAYANGAN PIJAKAN DI LANTAI PER KAKI (TERPISAH, TANPA GARIS PENGHUBUNG) */}
          <ellipse cx="-400" cy="680" rx="80" ry="18" fill="rgba(0,0,0,0.35)" />
          <ellipse cx="310" cy="680" rx="75" ry="18" fill="rgba(0,0,0,0.35)" />
          {/* Garis Sketsa Lantai di Bawah Setiap Kaki */}
          <line x1="-460" y1="680" x2="-340" y2="680" stroke="#000" strokeWidth="12" strokeLinecap="round" />
          <line x1="250" y1="680" x2="370" y2="680" stroke="#000" strokeWidth="12" strokeLinecap="round" />

          {/* KAKI KIRI (LUNGE LURUS KE KIRI BAWAH) */}
          <line x1="-20" y1="210" x2="-220" y2="440" stroke="#000000" strokeWidth="38" strokeLinecap="round" />
          <line x1="-220" y1="440" x2="-390" y2="675" stroke="#000000" strokeWidth="38" strokeLinecap="round" />
          {/* Sepatu Kiri Menapak Kuat Menghadap Kiri */}
          <ellipse cx="-415" cy="678" rx="60" ry="24" fill="#000000" />

          {/* KAKI KANAN (LUTUT DITEKUK KE LUAR KANAN, BETIS MENUKIK KE BAWAH) */}
          <line x1="20" y1="210" x2="210" y2="390" stroke="#000000" strokeWidth="38" strokeLinecap="round" />
          <line x1="210" y1="390" x2="300" y2="675" stroke="#000000" strokeWidth="38" strokeLinecap="round" />
          {/* Sepatu Kanan */}
          <ellipse cx="325" cy="678" rx="60" ry="24" fill="#000000" />

          {/* BADAN / SPINE CONDONG KE KIRI (-8 DERAJAT MENOPANG BIOLA) */}
          <line x1="-30" y1="-80" x2="0" y2="210" stroke="#000000" strokeWidth="42" strokeLinecap="round" />

          {/* BIOLA TERPASANG DI DADA, BADAN DI KIRI, LEHER MENJULUR KE KANAN */}
          <g transform="translate(-160, -140) rotate(8) scale(1.95)">
            <AuthenticViolin />
          </g>

          {/* TANGAN KIRI (MENJANGKAU LEHER BIOLA DI SISI KANAN) */}
          {/* Bahu Kiri ke Siku Kiri */}
          <line x1="-45" y1="-40" x2="110" y2="-20" stroke="#000000" strokeWidth="30" strokeLinecap="round" />
          {/* Siku Kiri ke Tangan Kiri di Fingerboard */}
          <line x1="110" y1="-20" x2="230" y2="-65" stroke="#000000" strokeWidth="28" strokeLinecap="round" />
          {/* Tangan Kiri Menekan Senar */}
          <circle cx="230" cy="-65" r="24" fill="#000000" />

          {/* TANGAN KANAN DENGAN SIKU TINGGI MENGGESEK BOW */}
          {/* Bahu Kanan ke Siku Kanan (Siku Naik Tinggi ke Kiri Atas) */}
          <line x1="-15" y1="-30" x2="-160" y2="-10" stroke="#000000" strokeWidth="30" strokeLinecap="round" />
          {/* Siku Kanan ke Tangan Kanan */}
          <line
            x1="-160"
            y1="-10"
            x2={-50 + bowStroke * 55}
            y2={-80 - bowStroke * 35}
            stroke="#000000"
            strokeWidth="28"
            strokeLinecap="round"
          />
          {/* Tangan Kanan Memegang Bow */}
          <circle cx={-50 + bowStroke * 55} cy={-80 - bowStroke * 35} r="24" fill="#000000" />

          {/* BOW BIOLA YANG MENGGESEK DIAGONAL MENYILANG BIOLA */}
          <g transform={`translate(${-50 + bowStroke * 55}, ${-80 - bowStroke * 35}) rotate(-42)`}>
            {/* Batang Kayu Cokelat Bow */}
            <line x1="-240" y1="0" x2="280" y2="0" stroke="#78350f" strokeWidth="8.5" strokeLinecap="round" />
            <polygon points="280,-4 300,0 280,8" fill="#fef08a" stroke="#713f12" strokeWidth="2" />
            {/* Rambut Putih Bow */}
            <line x1="-220" y1="9" x2="280" y2="9" stroke="#ffffff" strokeWidth="5" />
            {/* Frog Hitam Pegangan */}
            <rect x="-235" y="-4" width="34" height="18" rx="3" fill="#0f172a" stroke="#000" strokeWidth="3" />
          </g>

          {/* KEPALA W.R. SUPRATMAN (BULAT PUTIH, MATA MARAH/TEKAD MEME TIMEFORGE) */}
          <g transform={`translate(-45, ${-265 + headBob}) rotate(4)`}>
            {/* Lingkaran Kepala Putih Outline Hitam Tebal */}
            <circle cx="0" cy="0" r="132" fill="#ffffff" stroke="#000000" strokeWidth="28" />

            {/* ALIS TAJAM MARAH INTENS KHAS ANIME/MEME */}
            <line x1="-88" y1="-45" x2="-22" y2="-15" stroke="#000000" strokeWidth="22" strokeLinecap="round" />
            {/* Pupil Mata Kiri Menatap Tajam Berapi-Api */}
            <circle cx="-52" cy="12" r="20" fill="#000000" />
            <circle cx="-47" cy="8" r="6" fill="#ffffff" />

            <line x1="88" y1="-45" x2="22" y2="-15" stroke="#000000" strokeWidth="22" strokeLinecap="round" />
            {/* Pupil Mata Kanan Menatap Tajam */}
            <circle cx="52" cy="12" r="20" fill="#000000" />
            <circle cx="47" cy="8" r="6" fill="#ffffff" />

            {/* Mulut Melengkung ke Bawah Serius / Bertekad */}
            <path
              d="M -40 76 Q 0 52 40 76"
              stroke="#000000"
              strokeWidth="18"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        </g>
      </svg>
    </div>
  );
};

// ============================================================================
// 6. KINETIC TYPOGRAPHY PERSIS TIMEFORGE CUJiiKvKDsw
// ============================================================================
interface KineticWord {
  text: string;
  startFrame: number;
  endFrame: number;
  color?: string;
}

const KINETIC_WORDS: KineticWord[] = [
  { text: "DIIRINGI", startFrame: 0, endFrame: 32, color: "#ffffff" },
  { text: "GESEKAN BIOLA", startFrame: 32, endFrame: 70, color: "#ffffff" },
  { text: "W.R. SUPRATMAN", startFrame: 70, endFrame: 115, color: "#ffffff" },
  { text: "TIGA IKRAR", startFrame: 115, endFrame: 152, color: "#ffffff" },
  { text: "DIUCAPKAN!", startFrame: 152, endFrame: 195, color: "#ef4444" },
];

const TrueTimeForgeSubtitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const activeWord = useMemo(() => {
    return KINETIC_WORDS.find((w) => frame >= w.startFrame && frame < w.endFrame);
  }, [frame]);

  if (!activeWord) return null;

  // Spring Pop-In Hentakan Cepat
  const pop = spring({
    frame: frame - activeWord.startFrame,
    fps,
    config: { damping: 9, mass: 0.45, stiffness: 290 },
  });

  const scale = interpolate(pop, [0, 1], [0.72, 1.1]);

  return (
    <div
      style={{
        position: "absolute",
        top: "58%", // Tepat di area dada/perut karakter sesuai video asli TimeForge
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
          fontSize: "88px",
          fontFamily: "Impact, Arial Black, sans-serif",
          fontWeight: 900,
          color: activeWord.color || "#ffffff",
          textAlign: "center",
          textTransform: "uppercase",
          letterSpacing: "4px",
          padding: "4px 32px",
          WebkitTextStroke: "10px #000000",
          paintOrder: "stroke fill",
          textShadow: "0 12px 28px rgba(0, 0, 0, 0.95)",
          lineHeight: "1.0",
        }}
      >
        {activeWord.text}
      </span>
    </div>
  );
};

// ============================================================================
// MAIN COMPOSITION EXPORT
// ============================================================================
export const ViolinSceneTrueTimeForge: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#f4eee3" }}>
      {/* 1. Audio Asli Terpotong dari Video Sumpah Pemuda CUJiiKvKDsw */}
      <Audio src={staticFile("audio/biola_sample.mp3")} volume={1} />

      {/* 2. Latar Perkamen Kuno Khas TimeForge */}
      <VintageParchmentBg />

      {/* 2.5. CoverBadge Detik 0 untuk Thumbnail & IG Grid */}
      <CoverBadge
        label="SUMPAH PEMUDA"
        title="BIOLA SAKTI"
        titleUntil={45}
        dockAt={60}
      />

      {/* 3. Manga Action Speed Lines */}
      <ActionSpeedLines />

      {/* 4. Pita Merah Putih Meliuk Dinamis */}
      <FlagRibbon />

      {/* 5. Partikel Tinta Merah & Not Balok Mengambang */}
      <MusicalParticles />

      {/* 6. Karakter W.R. Supratman Skala Penuh dengan Bowing Motion */}
      <WRSupratmanStickman />

      {/* 7. Kinetic Subtitle Pop-In Tepat di Tengah Layar */}
      <TrueTimeForgeSubtitle />
    </AbsoluteFill>
  );
};
