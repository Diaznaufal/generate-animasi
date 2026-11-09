import React, { useMemo } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface KineticWord {
  text: string;
  startFrame: number;
  endFrame: number;
  color?: string;
  emphasis?: boolean;
}

interface KineticSubtitleProps {
  words: KineticWord[];
  top?: string;
  fontSize?: number;
}

export const KineticSubtitle: React.FC<KineticSubtitleProps> = ({
  words,
  top = "58%", // Tepat di area dada/perut karakter sesuai video asli @TimeForge_id
  fontSize = 88,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const activeWord = useMemo(() => {
    return words.find((w) => frame >= w.startFrame && frame < w.endFrame);
  }, [words, frame]);

  if (!activeWord) return null;

  // Spring Pop-In Hentakan Cepat Khas TimeForge
  const pop = spring({
    frame: frame - activeWord.startFrame,
    fps,
    config: { damping: 9, mass: 0.45, stiffness: 290 },
  });

  const scale = interpolate(pop, [0, 1], [0.75, activeWord.emphasis ? 1.18 : 1.08]);

  return (
    <div
      style={{
        position: "absolute",
        top,
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
          fontSize: `${fontSize}px`,
          fontFamily: "Impact, Arial Black, sans-serif",
          fontWeight: 900,
          color: activeWord.color || (activeWord.emphasis ? "#ef4444" : "#ffffff"),
          textAlign: "center",
          textTransform: "uppercase",
          letterSpacing: "4px",
          padding: "4px 32px",
          WebkitTextStroke: "10px #000000",
          paintOrder: "stroke fill",
          textShadow: "0 14px 30px rgba(0, 0, 0, 0.95)",
          lineHeight: "1.0",
        }}
      >
        {activeWord.text}
      </span>
    </div>
  );
};
