import React from "react";
import { AbsoluteFill, Easing, interpolate, Series, useCurrentFrame } from "remotion";

/** Spec CLAUDE.md: tiap shot 80–110 frame (2.7–3.7 detik @ 30 FPS). */
export const MIN_SHOT_FRAMES = 80;
export const MAX_SHOT_FRAMES = 110;

/**
 * Bagi durasi sebuah beat menjadi sub-shot 80–110 frame.
 * Melempar error bila durasi tidak bisa dibagi dalam rentang itu
 * (misal 230 frame: 2 shot = 115, 3 shot = 76) agar kesalahan pacing ketahuan saat render.
 */
export const splitShots = (durationInFrames: number): number[] => {
  const minCount = Math.ceil(durationInFrames / MAX_SHOT_FRAMES);
  const maxCount = Math.floor(durationInFrames / MIN_SHOT_FRAMES);
  if (minCount > maxCount) {
    throw new Error(
      `CameraShots: ${durationInFrames} frame tidak bisa dibagi menjadi shot ${MIN_SHOT_FRAMES}–${MAX_SHOT_FRAMES} frame. Geser beberapa frame ke shot sebelah.`,
    );
  }
  const count = minCount;
  const base = Math.floor(durationInFrames / count);
  const remainder = durationInFrames - base * count;
  return Array.from({ length: count }, (_, i) => base + (i < remainder ? 1 : 0));
};

type Move = "push_in" | "punch_in" | "pan_left" | "pan_right" | "pull_out" | "dutch";

const MOVE_CYCLE: Move[] = ["push_in", "punch_in", "pan_left", "pull_out", "pan_right", "dutch"];

const ease = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
  easing: Easing.bezier(0.22, 1, 0.36, 1),
};

const CameraMove: React.FC<{
  move: Move;
  duration: number;
  focusX: number;
  focusY: number;
  children: React.ReactNode;
}> = ({ move, duration, focusX, focusY, children }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, duration], [0, 1], ease);
  // Punch-in: hentakan zoom mendadak di 8 frame pertama, lalu settle.
  const punch = interpolate(frame, [0, 8], [0, 1], ease);

  let scale = 1;
  let x = 0;
  let rotate = 0;
  switch (move) {
    case "push_in":
      scale = interpolate(t, [0, 1], [1.02, 1.1]);
      break;
    case "punch_in":
      scale = interpolate(punch, [0, 1], [1.28, 1.18]) + t * 0.03;
      break;
    case "pan_left":
      scale = 1.12;
      x = interpolate(t, [0, 1], [50, -50]);
      break;
    case "pan_right":
      scale = 1.12;
      x = interpolate(t, [0, 1], [-50, 50]);
      break;
    case "pull_out":
      scale = interpolate(t, [0, 1], [1.2, 1.04]);
      break;
    case "dutch":
      scale = 1.14;
      rotate = interpolate(t, [0, 1], [-3, 0]);
      break;
  }

  return (
    <AbsoluteFill
      style={{
        transform: `translateX(${x}px) rotate(${rotate}deg) scale(${scale})`,
        transformOrigin: `${focusX}% ${focusY}%`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/**
 * Pecah satu beat panjang menjadi beberapa camera cut 80–110 frame.
 * Isi adegan (children) tetap sama dan kontinu; tiap sub-shot memakai gerak kamera berbeda
 * sehingga setiap ~3 detik ada cut dramatis (zoom mendadak / pan cepat / tilt).
 * Harus dipakai sebagai isi <Series.Sequence durationInFrames={durationInFrames}>.
 */
export const CameraShots: React.FC<{
  durationInFrames: number;
  children: React.ReactNode;
  /** Geser awal siklus gerak kamera agar beat berurutan tidak identik. */
  offset?: number;
  /** Titik fokus kamera dalam persen layar (default 50/48, area karakter). */
  focusX?: number;
  focusY?: number;
}> = ({ durationInFrames, children, offset = 0, focusX = 50, focusY = 48 }) => {
  const shots = splitShots(durationInFrames);
  return (
    <Series>
      {shots.map((len, i) => (
        <Series.Sequence key={i} durationInFrames={len}>
          <CameraMove
            move={MOVE_CYCLE[(i + offset) % MOVE_CYCLE.length]}
            duration={len}
            focusX={focusX}
            focusY={focusY}
          >
            {children}
          </CameraMove>
        </Series.Sequence>
      ))}
    </Series>
  );
};
