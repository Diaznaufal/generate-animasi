import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";

export interface CoverBadgeProps {
  /** Label kategori atau topik (misal: "SEJARAH INDONESIA", "BENTENG KUNO", "TOKOH BANGSA") */
  label: string;
  /** Judul hook thumbnail besar 2-4 kata (misal: "TAK PERNAH JEBOL!", "SENJATA RAHASIA") */
  title?: string;
  /** Frame saat title mulai memudar (default: frame 45 / detik 1.5) */
  titleUntil?: number;
  /** Frame saat badge selesai merapat ke atas (docking), animasi berjalan [dockAt-18, dockAt] (default: frame 60 / detik 2) */
  dockAt?: number;
  /** Posisi Y awal Badge di tengah Safe Zone IG Grid (default: 470, di dalam crop 1:1 Y 420–1500) */
  centerY?: number;
  /** Posisi Y awal Judul Hook Thumbnail (default: 560) */
  titleTop?: number;
  /** Warna aksen badge (default: #dc2626 merah pejuang) */
  accentColor?: string;
  /** Warna teks judul (default: #ffffff) */
  textColor?: string;
  /** Warna panel/background badge (default: #0f172a hitam pekat) */
  panelColor?: string;
  /** Font family (default: Impact, Arial Black, sans-serif) */
  fontFamily?: string;
}

const clampEasing = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
  easing: Easing.bezier(0.33, 0, 0.67, 1),
};

const BADGE_HEIGHT = 64;

/**
 * CoverBadge untuk Frame 0 (Detik 0) di setiap video Shorts/Reels/TikTok.
 * Berada persis di dalam 1:1 Square Crop (Y: 420-1500) & 4:5 Crop agar
 * thumbnail otomatis Instagram Grid & YouTube Shorts langsung informatif dan menarik klik.
 */
export const CoverBadge: React.FC<CoverBadgeProps> = ({
  label: labelText,
  title,
  titleUntil = 45,
  dockAt = 60,
  centerY = 470,
  titleTop = 560,
  accentColor = "#dc2626", // Merah bendera / aksen TimeForge
  textColor = "#ffffff",
  panelColor = "#0f172a", // Hitam pekat kontras tinggi
  fontFamily = "Impact, Arial Black, sans-serif",
}) => {
  const frame = useCurrentFrame();
  const label = labelText.toUpperCase();

  // Animasi Docking (Badge mengecil dan merapat ke pojok atas agar adegan utama leluasa)
  const dock = interpolate(frame, [dockAt - 18, dockAt], [0, 1], clampEasing);
  const scale = 1 - dock * 0.32;
  const x = interpolate(dock, [0, 1], [540, 180]);
  const y = interpolate(dock, [0, 1], [centerY, 260]);

  // Title Thumbnail menghilang halus saat narasi mulai masuk
  const titleOpacity = interpolate(frame, [titleUntil, titleUntil + 12], [1, 0], clampEasing);

  return (
    <>
      {/* 1. PILL BADGE KATEGORI / TOPIK */}
      <div
        style={{
          position: "absolute",
          left: `${x}px`,
          top: `${y}px`,
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: "center center",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "8px 36px",
          height: `${BADGE_HEIGHT}px`,
          borderRadius: "9999px",
          backgroundColor: panelColor,
          border: `4px solid ${accentColor}`,
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.75)",
          opacity: 0.85 + (1 - dock) * 0.15,
          fontFamily,
          fontWeight: 900,
          fontSize: "30px",
          letterSpacing: "3px",
          color: textColor,
          whiteSpace: "nowrap",
          zIndex: 80,
          pointerEvents: "none",
        }}
      >
        <span style={{ color: accentColor, marginRight: "10px" }}>●</span>
        {label}
      </div>

      {/* 2. COVER TITLE BESAR UNTUK THUMBNAIL (FRAME 0 - 45) */}
      {title && titleOpacity > 0 ? (
        <div
          style={{
            position: "absolute",
            left: 50,
            right: 50,
            top: `${titleTop}px`,
            textAlign: "center",
            opacity: titleOpacity,
            fontFamily,
            fontWeight: 900,
            fontSize: "92px",
            lineHeight: 1.05,
            letterSpacing: "2px",
            color: textColor,
            textTransform: "uppercase",
            WebkitTextStroke: `14px ${panelColor}`,
            paintOrder: "stroke fill",
            textShadow: "0 16px 36px rgba(0, 0, 0, 0.95)",
            zIndex: 85,
            pointerEvents: "none",
          }}
        >
          {title}
        </div>
      ) : null}
    </>
  );
};
