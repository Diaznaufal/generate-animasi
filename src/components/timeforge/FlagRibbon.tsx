import React from "react";
import { useCurrentFrame } from "remotion";

export const FlagRibbon: React.FC<{
  waveSpeed?: number;
  colorTop?: string;
  colorBottom?: string;
  yOffset?: number;
}> = ({
  waveSpeed = 1.0,
  colorTop = "#dc2626",
  colorBottom = "#ffffff",
  yOffset = 60,
}) => {
  const frame = useCurrentFrame();
  const wave1 = Math.sin(frame * 0.14 * waveSpeed) * 45;
  const wave2 = Math.cos(frame * 0.12 * waveSpeed) * 40;

  return (
    <svg
      width={1080}
      height={1920}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 14,
        filter: "drop-shadow(0 16px 28px rgba(0,0,0,0.35))",
      }}
    >
      <g transform={`translate(0, ${yOffset})`}>
        {/* Pita Atas (Merah) */}
        <path
          d={`M -60 740 Q 280 ${540 + wave1} 540 ${660 + wave2} T 1160 ${520 - wave1}`}
          fill="none"
          stroke={colorTop}
          strokeWidth="56"
          strokeLinecap="round"
        />
        {/* Pita Bawah (Putih) */}
        <path
          d={`M -60 788 Q 280 ${588 + wave1} 540 ${708 + wave2} T 1160 ${568 - wave1}`}
          fill="none"
          stroke={colorBottom}
          strokeWidth="54"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
};
