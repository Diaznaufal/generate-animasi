import React from "react";
import { useCurrentFrame } from "remotion";

export type StickmanPose =
  | "lunge_action"    // Lunge stance asimetris untuk aksi/pertempuran
  | "proud"           // Berkacak pinggang percaya diri
  | "point_forward"   // Menunjuk dramatis ke depan/kiri
  | "shocked"         // Tangan di kepala panik/kaget
  | "hold_weapon";    // Memegang senjata (keris/pedang/senapan)

export type StickmanFace =
  | "determined"      // Alis miring tajam, mata berapi-api (marah/tekad)
  | "shocked"         // Mata melotot lebar, mulut O
  | "shivering_cry"   // Menggigil ketakutan, air mata/keringat
  | "confident";      // Senyum percaya diri

export type StickmanAccessory =
  | "headband"        // Ikat kepala merah putih pejuang
  | "turban"          // Sorban putih ulama/pangeran (Diponegoro)
  | "colonial_hat"    // Topi shako komandan Belanda
  | "none";

export type StickmanProp =
  | "keris"
  | "sword"
  | "flag"
  | "violin"
  | "none";

interface StickmanProps {
  pose?: StickmanPose;
  face?: StickmanFace;
  accessory?: StickmanAccessory;
  prop?: StickmanProp;
  scale?: number;
  flipX?: boolean;
}

export const Stickman: React.FC<StickmanProps> = ({
  pose = "proud",
  face = "determined",
  accessory = "headband",
  prop = "none",
  scale = 1.0,
  flipX = false,
}) => {
  const frame = useCurrentFrame();

  // Micro-motion nafas dan goyangan tubuh
  const breathe = Math.sin(frame * 0.15) * 3;
  const armSway = Math.cos(frame * 0.2) * 4;

  return (
    <svg
      viewBox="0 0 1000 1600"
      width={1000 * scale}
      height={1600 * scale}
      style={{
        overflow: "visible",
        filter: "drop-shadow(0 20px 35px rgba(0,0,0,0.4))",
        transform: flipX ? "scaleX(-1)" : "none",
      }}
    >
      <g transform="translate(500, 780)">
        {/* ================================================================ */}
        {/* 1. BAYANGAN PIJAKAN KAKI DI LANTAI                               */}
        {/* ================================================================ */}
        {pose === "lunge_action" ? (
          <>
            <ellipse cx="-400" cy="680" rx="80" ry="18" fill="rgba(0,0,0,0.35)" />
            <ellipse cx="310" cy="680" rx="75" ry="18" fill="rgba(0,0,0,0.35)" />
            <line x1="-460" y1="680" x2="-340" y2="680" stroke="#000" strokeWidth="12" strokeLinecap="round" />
            <line x1="250" y1="680" x2="370" y2="680" stroke="#000" strokeWidth="12" strokeLinecap="round" />
          </>
        ) : (
          <>
            <ellipse cx="-180" cy="680" rx="65" ry="18" fill="rgba(0,0,0,0.32)" />
            <ellipse cx="180" cy="680" rx="65" ry="18" fill="rgba(0,0,0,0.32)" />
            <line x1="-240" y1="680" x2="-120" y2="680" stroke="#000" strokeWidth="12" strokeLinecap="round" />
            <line x1="120" y1="680" x2="240" y2="680" stroke="#000" strokeWidth="12" strokeLinecap="round" />
          </>
        )}

        {/* ================================================================ */}
        {/* 2. KAKI (LEGS WITH ARTICULATED KNEE JOINTS)                      */}
        {/* ================================================================ */}
        {pose === "lunge_action" ? (
          <>
            {/* Kaki Kiri Lunge Lurus Menukik */}
            <line x1="-20" y1="210" x2="-220" y2="440" stroke="#000" strokeWidth="38" strokeLinecap="round" />
            <line x1="-220" y1="440" x2="-390" y2="675" stroke="#000" strokeWidth="38" strokeLinecap="round" />
            <ellipse cx="-415" cy="678" rx="60" ry="24" fill="#000" />

            {/* Kaki Kanan Menekuk ke Luar */}
            <line x1="20" y1="210" x2="210" y2="390" stroke="#000" strokeWidth="38" strokeLinecap="round" />
            <line x1="210" y1="390" x2="300" y2="675" stroke="#000" strokeWidth="38" strokeLinecap="round" />
            <ellipse cx="325" cy="678" rx="60" ry="24" fill="#000" />
          </>
        ) : (
          <>
            {/* Kaki Kiri Tegak */}
            <line x1="-15" y1="210" x2="-80" y2="440" stroke="#000" strokeWidth="36" strokeLinecap="round" />
            <line x1="-80" y1="440" x2="-170" y2="675" stroke="#000" strokeWidth="36" strokeLinecap="round" />
            <ellipse cx="-190" cy="678" rx="55" ry="22" fill="#000" />

            {/* Kaki Kanan Tegak */}
            <line x1="15" y1="210" x2="80" y2="440" stroke="#000" strokeWidth="36" strokeLinecap="round" />
            <line x1="80" y1="440" x2="170" y2="675" stroke="#000" strokeWidth="36" strokeLinecap="round" />
            <ellipse cx="190" cy="678" rx="55" ry="22" fill="#000" />
          </>
        )}

        {/* ================================================================ */}
        {/* 3. TUBUH / SPINE                                                 */}
        {/* ================================================================ */}
        <line
          x1={pose === "lunge_action" ? "-30" : "0"}
          y1="-80"
          x2="0"
          y2="210"
          stroke="#000"
          strokeWidth="42"
          strokeLinecap="round"
        />

        {/* Kostum Khusus Kolonial Belanda jika memakai Topi Shako */}
        {accessory === "colonial_hat" && (
          <g transform="translate(0, 50)">
            {/* Rompi Militer Merah */}
            <path d="M -50 -100 L 50 -100 L 40 120 L -40 120 Z" fill="#b91c1c" stroke="#000" strokeWidth="8" />
            {/* Selempang Putih Silang */}
            <line x1="-45" y1="-90" x2="35" y2="110" stroke="#fff" strokeWidth="16" />
            {/* Epaulet Pundak Emas */}
            <ellipse cx="-55" cy="-90" rx="20" ry="10" fill="#eab308" stroke="#000" strokeWidth="4" />
            <ellipse cx="55" cy="-90" rx="20" ry="10" fill="#eab308" stroke="#000" strokeWidth="4" />
          </g>
        )}

        {/* Jubah Hijau Khusus jika memakai Sorban Pangeran Diponegoro */}
        {accessory === "turban" && (
          <g transform="translate(0, 40)">
            <path
              d="M -55 -90 C -90 20, -110 130, -80 180 L 80 180 C 110 130, 90 20, 55 -90 Z"
              fill="#15803d"
              stroke="#000"
              strokeWidth="8"
            />
            {/* Selempang Hijau Tua */}
            <line x1="-40" y1="-80" x2="30" y2="120" stroke="#14532d" strokeWidth="18" />
          </g>
        )}

        {/* ================================================================ */}
        {/* 4. TANGAN & PROPERTI                                             */}
        {/* ================================================================ */}
        {pose === "hold_weapon" && prop === "keris" ? (
          <>
            {/* Tangan Kanan Menghunus Keris ke Atas */}
            <line x1="20" y1="-40" x2="180" y2="-120" stroke="#000" strokeWidth="32" strokeLinecap="round" />
            <line x1="180" y1="-120" x2="160" y2="-260" stroke="#000" strokeWidth="30" strokeLinecap="round" />
            <circle cx="160" cy="-260" r="24" fill="#000" />
            {/* Keris Berliuk (Wavy Blade) */}
            <path
              d="M 160 -260 Q 185 -310 160 -360 Q 135 -410 160 -460 L 160 -490"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <path
              d="M 140 -260 L 180 -260 L 170 -275 L 150 -275 Z"
              fill="#ca8a04"
              stroke="#000"
              strokeWidth="4"
            />
            {/* Tangan Kiri di Pinggang */}
            <line x1="-20" y1="-40" x2="-140" y2="30" stroke="#000" strokeWidth="30" strokeLinecap="round" />
            <line x1="-140" y1="30" x2="-60" y2="120" stroke="#000" strokeWidth="28" strokeLinecap="round" />
            <circle cx="-60" cy="120" r="22" fill="#000" />
          </>
        ) : pose === "point_forward" ? (
          <>
            {/* Tangan Kanan Menunjuk Tegas ke Depan */}
            <line x1="20" y1="-40" x2="180" y2="-60" stroke="#000" strokeWidth="32" strokeLinecap="round" />
            <line x1="180" y1="-60" x2="340" y2="-80" stroke="#000" strokeWidth="30" strokeLinecap="round" />
            <circle cx="340" cy="-80" r="24" fill="#000" />
            {/* Tangan Kiri di Pinggang */}
            <line x1="-20" y1="-40" x2="-140" y2="30" stroke="#000" strokeWidth="30" strokeLinecap="round" />
            <line x1="-140" y1="30" x2="-60" y2="120" stroke="#000" strokeWidth="28" strokeLinecap="round" />
            <circle cx="-60" cy="120" r="22" fill="#000" />
          </>
        ) : pose === "shocked" ? (
          <>
            {/* Kedua Tangan Memegang Kepala */}
            <line x1="-20" y1="-40" x2="-160" y2="-120" stroke="#000" strokeWidth="30" strokeLinecap="round" />
            <line x1="-160" y1="-120" x2="-90" y2="-250" stroke="#000" strokeWidth="28" strokeLinecap="round" />
            <circle cx="-90" cy="-250" r="24" fill="#000" />

            <line x1="20" y1="-40" x2="160" y2="-120" stroke="#000" strokeWidth="30" strokeLinecap="round" />
            <line x1="160" y1="-120" x2="90" y2="-250" stroke="#000" strokeWidth="28" strokeLinecap="round" />
            <circle cx="90" cy="-250" r="24" fill="#000" />
          </>
        ) : (
          <>
            {/* Pose Standar: Bertolak Pinggang Gagah */}
            <line x1="-20" y1="-40" x2="-150" y2="40" stroke="#000" strokeWidth="30" strokeLinecap="round" />
            <line x1="-150" y1="40" x2="-70" y2="130" stroke="#000" strokeWidth="28" strokeLinecap="round" />
            <circle cx="-70" cy="130" r="24" fill="#000" />

            <line x1="20" y1="-40" x2="150" y2="40" stroke="#000" strokeWidth="30" strokeLinecap="round" />
            <line x1="150" y1="40" x2="70" y2="130" stroke="#000" strokeWidth="28" strokeLinecap="round" />
            <circle cx="70" cy="130" r="24" fill="#000" />
          </>
        )}

        {/* Bendera Merah Putih jika prop === 'flag' */}
        {prop === "flag" && (
          <g transform="translate(180, -220)">
            <line x1="0" y1="-320" x2="0" y2="480" stroke="#525252" strokeWidth="12" strokeLinecap="round" />
            <path
              d={`M 0 -310 C 140 ${-330 + armSway * 2}, 220 ${-290 - armSway}, 340 -310 L 340 -170 C 220 ${-150 - armSway}, 140 ${-190 + armSway * 2}, 0 -170 Z`}
              fill="#dc2626"
              stroke="#000"
              strokeWidth="5"
            />
            <path
              d={`M 0 -170 C 140 ${-190 + armSway * 2}, 220 ${-150 - armSway}, 340 -170 L 340 -30 C 220 ${-10 - armSway}, 140 ${-50 + armSway * 2}, 0 -30 Z`}
              fill="#ffffff"
              stroke="#000"
              strokeWidth="5"
            />
          </g>
        )}

        {/* ================================================================ */}
        {/* 5. KEPALA EKSPRESIF & AKSESORI                                   */}
        {/* ================================================================ */}
        <g transform={`translate(${pose === "lunge_action" ? "-45" : "0"}, ${-265 + breathe})`}>
          {/* Kepala Putih Bulat Outline Tebal */}
          <circle cx="0" cy="0" r="128" fill="#ffffff" stroke="#000000" strokeWidth="28" />

          {/* Ikat Kepala Pejuang (Headband) */}
          {accessory === "headband" && (
            <path
              d="M -122 -35 Q 0 -85 122 -35 L 115 -85 Q 0 -130 -115 -85 Z"
              fill="#dc2626"
              stroke="#000"
              strokeWidth="10"
            />
          )}

          {/* Sorban Ulama / Diponegoro */}
          {accessory === "turban" && (
            <g transform="translate(0, -60)">
              {/* Gulungan Sorban Putih Berlapis */}
              <ellipse cx="0" cy="-20" rx="142" ry="75" fill="#f8fafc" stroke="#000" strokeWidth="16" />
              <path d="M -130 -20 Q 0 -60 130 -20" stroke="#000" strokeWidth="10" fill="none" />
              {/* Ekor Sorban Menjuntai di Belakang */}
              <path d="M 90 0 C 150 60, 140 180, 110 240 L 70 230 C 100 170, 110 80, 60 20 Z" fill="#f8fafc" stroke="#000" strokeWidth="10" />
            </g>
          )}

          {/* Topi Shako Kolonial Belanda */}
          {accessory === "colonial_hat" && (
            <g transform="translate(0, -75)">
              {/* Badan Topi Hitam Silinder */}
              <path d="M -95 10 L -75 -130 L 75 -130 L 95 10 Z" fill="#0f172a" stroke="#000" strokeWidth="16" />
              {/* Emblem Emas & Bulu Unggas */}
              <ellipse cx="0" cy="-70" rx="24" ry="32" fill="#eab308" stroke="#000" strokeWidth="6" />
              <ellipse cx="0" cy="-145" rx="12" ry="28" fill="#dc2626" stroke="#000" strokeWidth="4" />
              {/* Pet Topi Depan */}
              <path d="M -115 10 Q 0 45 115 10" stroke="#000" strokeWidth="20" fill="none" strokeLinecap="round" />
            </g>
          )}

          {/* MUKA / EKSPRESI KARTUN KOMIK */}
          {face === "determined" ? (
            <>
              {/* Alis Tajam Menukik Marah/Tekad */}
              <line x1="-88" y1="-45" x2="-22" y2="-15" stroke="#000" strokeWidth="22" strokeLinecap="round" />
              <circle cx="-52" cy="12" r="20" fill="#000" />
              <circle cx="-47" cy="8" r="6" fill="#fff" />

              <line x1="88" y1="-45" x2="22" y2="-15" stroke="#000" strokeWidth="22" strokeLinecap="round" />
              <circle cx="52" cy="12" r="20" fill="#000" />
              <circle cx="47" cy="8" r="6" fill="#fff" />

              {/* Mulut Melengkung ke Bawah Serius */}
              <path d="M -40 76 Q 0 52 40 76" stroke="#000" strokeWidth="18" fill="none" strokeLinecap="round" />
            </>
          ) : face === "shocked" ? (
            <>
              {/* Alis Melengkung ke Atas Kaget */}
              <path d="M -80 -35 Q -50 -70 -20 -35" stroke="#000" strokeWidth="18" fill="none" strokeLinecap="round" />
              <circle cx="-50" cy="15" r="24" fill="#000" />
              <circle cx="-44" cy="8" r="8" fill="#fff" />

              <path d="M 20 -35 Q 50 -70 80 -35" stroke="#000" strokeWidth="18" fill="none" strokeLinecap="round" />
              <circle cx="50" cy="15" r="24" fill="#000" />
              <circle cx="56" cy="8" r="8" fill="#fff" />

              {/* Mulut Menganga O Lebar */}
              <ellipse cx="0" cy="80" rx="30" ry="42" fill="#000" />
            </>
          ) : face === "shivering_cry" ? (
            <>
              {/* Mata Ketakutan dengan Tetes Air Mata / Keringat */}
              <circle cx="-50" cy="10" r="26" fill="#000" />
              <circle cx="-42" cy="0" r="10" fill="#fff" />
              <path d="M -85 10 C -110 30, -110 60, -90 70 C -75 70, -75 40, -85 10" fill="#38bdf8" stroke="#000" strokeWidth="4" />

              <circle cx="50" cy="10" r="26" fill="#000" />
              <circle cx="42" cy="0" r="10" fill="#fff" />

              {/* Mulut Menggigil Bergerigi */}
              <path
                d="M -45 80 L -30 70 L -15 85 L 0 70 L 15 85 L 30 70 L 45 80"
                stroke="#000"
                strokeWidth="14"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          ) : (
            <>
              {/* Wajah Percaya Diri / Senyum */}
              <line x1="-80" y1="-30" x2="-20" y2="-20" stroke="#000" strokeWidth="18" strokeLinecap="round" />
              <circle cx="-48" cy="10" r="18" fill="#000" />

              <line x1="80" y1="-30" x2="20" y2="-20" stroke="#000" strokeWidth="18" strokeLinecap="round" />
              <circle cx="48" cy="10" r="18" fill="#000" />

              {/* Senyum Menyeringai Percaya Diri */}
              <path d="M -30 65 Q 0 95 40 60" stroke="#000" strokeWidth="16" fill="none" strokeLinecap="round" />
            </>
          )}
        </g>
      </g>
    </svg>
  );
};
