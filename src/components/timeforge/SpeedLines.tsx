import React from "react";
import { useCurrentFrame } from "remotion";

export const SpeedLines: React.FC<{
  intensity?: number;
  centerX?: number;
  centerY?: number;
}> = ({ intensity = 1.0, centerX = 540, centerY = 820 }) => {
  const frame = useCurrentFrame();
  const lineCount = 56;

  return (
    <svg
      width={1080}
      height={1920}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
        opacity: 0.36 * intensity,
      }}
    >
      <g transform={`translate(${centerX}, ${centerY})`}>
        {[...Array(lineCount)].map((_, i) => {
          const angle = (i / lineCount) * Math.PI * 2 + ((frame * 15) % 11) * 0.009;
          const outerR = 1500 + ((frame * 45 + i * 55) % 220);
          const innerR = 400 + ((frame * 25 + i * 35) % 100);
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
              strokeWidth={i % 5 === 0 ? 8 : i % 2 === 0 ? 4 : 2}
            />
          );
        })}
      </g>
    </svg>
  );
};
