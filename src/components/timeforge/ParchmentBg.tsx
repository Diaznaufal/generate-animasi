import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

export type BackgroundMood = "parchment" | "sunburst" | "dark_storm" | "spotlight";

interface ParchmentBgProps {
  mood?: BackgroundMood;
}

export const ParchmentBg: React.FC<ParchmentBgProps> = ({ mood = "parchment" }) => {
  const frame = useCurrentFrame();
  const rotation = (frame * 0.25) % 360;

  if (mood === "dark_storm") {
    return (
      <AbsoluteFill style={{ backgroundColor: "#0f172a", overflow: "hidden" }}>
        {/* Langit Mendung Kelabu Perang */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at 50% 30%, #334155 0%, #1e293b 65%, #090d16 100%)",
          }}
        />
      </AbsoluteFill>
    );
  }

  if (mood === "spotlight") {
    return (
      <AbsoluteFill style={{ backgroundColor: "#090d16", overflow: "hidden" }}>
        {/* Spotlight Dramatis Kerucut Cahaya */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at 50% 35%, rgba(254, 243, 199, 0.45) 0%, rgba(15, 23, 42, 0.95) 60%, #020617 100%)",
          }}
        />
      </AbsoluteFill>
    );
  }

  if (mood === "sunburst") {
    return (
      <AbsoluteFill style={{ backgroundColor: "#d97706", overflow: "hidden" }}>
        {/* Dasar Perkamen Emas */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at 50% 45%, #fffbeb 0%, #fef3c7 40%, #d97706 90%)",
          }}
        />
        {/* Sinar Matahari Berputar */}
        <svg
          width={2160}
          height={2160}
          style={{
            position: "absolute",
            top: "40%",
            left: "50%",
            transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
            opacity: 0.16,
            pointerEvents: "none",
          }}
        >
          <g transform="translate(1080, 1080)">
            {[...Array(24)].map((_, i) => {
              const startA = (i / 24) * Math.PI * 2;
              const endA = ((i + 0.5) / 24) * Math.PI * 2;
              const r = 1600;
              const x1 = Math.cos(startA) * r;
              const y1 = Math.sin(startA) * r;
              const x2 = Math.cos(endA) * r;
              const y2 = Math.sin(endA) * r;
              return <polygon key={i} points={`0,0 ${x1},${y1} ${x2},${y2}`} fill="#92400e" />;
            })}
          </g>
        </svg>
      </AbsoluteFill>
    );
  }

  // Default: Vintage Aged Parchment
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
