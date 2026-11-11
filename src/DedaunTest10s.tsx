import React from "react";
import {
  AbsoluteFill,
  Audio,
  Series,
  staticFile,
} from "remotion";
import {
  DedaunBackground,
  DedaunCharacter,
  DedaunSubtitle,
  WordCue,
} from "./components/dedaun";

export const DURATION_IN_FRAMES = 293;
export const VIDEO_FPS = 30;
export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;

const SUBTITLE_WORDS: WordCue[] = [
  { text: "Satu", startFrame: 4, endFrame: 14 },
  { text: "guru", startFrame: 14, endFrame: 21 },
  { text: "berseragam", startFrame: 21, endFrame: 38 },
  { text: "PNS,", startFrame: 38, endFrame: 60 },
  { text: "satu", startFrame: 69, endFrame: 79 },
  { text: "guru", startFrame: 79, endFrame: 86 },
  { text: "honorer", startFrame: 86, endFrame: 99 },
  { text: "digaji", startFrame: 99, endFrame: 115 },
  { text: "tiga", startFrame: 115, endFrame: 123 },
  { text: "ratus", startFrame: 123, endFrame: 132 },
  { text: "ribu.", startFrame: 132, endFrame: 147 },
  { text: "Dua", startFrame: 175, endFrame: 182 },
  { text: "puluh", startFrame: 182, endFrame: 188 },
  { text: "tahun", startFrame: 188, endFrame: 196 },
  { text: "kemudian,", startFrame: 196, endFrame: 217 },
  { text: "hanya", startFrame: 226, endFrame: 236 },
  { text: "satu", startFrame: 236, endFrame: 244 },
  { text: "nama", startFrame: 244, endFrame: 254 },
  { text: "yang", startFrame: 254, endFrame: 258 },
  { text: "dicari.", startFrame: 258, endFrame: 278 },
];

export const DedaunTest10s: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#f5ebe1", overflow: "hidden" }}>
      {/* 1. Voiceover Narration */}
      <Audio src={staticFile("audio/dedaun_test_10s.mp3")} volume={1} />

      {/* 2. Visual Scenes */}
      <Series>
        {/* SHOT 1: Pak Anwar PNS (0 - 65 frames / ~2.1s) */}
        <Series.Sequence durationInFrames={65}>
          <DedaunBackground scene="classroom" />
          <div
            style={{
              position: "absolute",
              top: "42%",
              left: "50%",
              transform: "translate(-50%, -10%)",
            }}
          >
            <DedaunCharacter role="guru_pns" scale={1.45} facing="right" />
          </div>
          {/* Label Card "Gaji Tetap" */}
          <div
            style={{
              position: "absolute",
              top: "22%",
              left: "14%",
              backgroundColor: "rgba(67, 96, 79, 0.95)",
              color: "#ffffff",
              padding: "10px 24px",
              borderRadius: 12,
              fontFamily: "Poppins, sans-serif",
              fontWeight: 700,
              fontSize: 32,
              boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
            }}
          >
            Gaji Tetap PNS
          </div>
        </Series.Sequence>

        {/* SHOT 2: Bu Rini Guru Honorer (65 - 165 frames / ~3.3s) */}
        <Series.Sequence durationInFrames={100}>
          <DedaunBackground scene="classroom" />
          <div
            style={{
              position: "absolute",
              top: "42%",
              left: "50%",
              transform: "translate(-50%, -10%)",
            }}
          >
            <DedaunCharacter role="guru_honorer" scale={1.45} facing="right" />
          </div>
          {/* Label Card "Gaji Rp 300.000" */}
          <div
            style={{
              position: "absolute",
              top: "22%",
              right: "14%",
              backgroundColor: "rgba(148, 83, 83, 0.95)",
              color: "#ffffff",
              padding: "10px 24px",
              borderRadius: 12,
              fontFamily: "Poppins, sans-serif",
              fontWeight: 700,
              fontSize: 32,
              boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
            }}
          >
            Honorer: Rp 300.000
          </div>
        </Series.Sequence>

        {/* SHOT 3: Time Jump "20 TAHUN" (165 - 220 frames / ~1.8s) */}
        <Series.Sequence durationInFrames={55}>
          <DedaunBackground scene="time_jump" timeJumpText="20 TAHUN" />
        </Series.Sequence>

        {/* SHOT 4: Dokter & Bu Rini di Depan Sekolah (220 - 293 frames / ~2.4s) */}
        <Series.Sequence durationInFrames={73}>
          <DedaunBackground scene="school_front" />
          {/* Bu Rini di Kiri */}
          <div
            style={{
              position: "absolute",
              bottom: "22%",
              left: "22%",
            }}
          >
            <DedaunCharacter role="guru_honorer" scale={1.25} facing="right" />
          </div>
          {/* Dokter (Murid Berhasil) di Kanan */}
          <div
            style={{
              position: "absolute",
              bottom: "22%",
              right: "22%",
            }}
          >
            <DedaunCharacter role="dokter" scale={1.3} facing="left" />
          </div>
        </Series.Sequence>
      </Series>

      {/* 3. Global Yellow-Pill Subtitle */}
      <DedaunSubtitle words={SUBTITLE_WORDS} top="84%" fontSize={46} />
    </AbsoluteFill>
  );
};
