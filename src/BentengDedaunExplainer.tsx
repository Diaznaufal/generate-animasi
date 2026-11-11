import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  Series,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {
  DedaunBackground,
  DedaunCharacter,
  DedaunSubtitle,
  WordCue,
} from "./components/dedaun";
import subtitlesData from "../content/benteng-dedaun/subtitles.json";

export const DURATION_IN_FRAMES = 1984; // 66.13s @ 30 FPS
export const VIDEO_FPS = 30;
export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;

const SUBTITLE_WORDS: WordCue[] = subtitlesData.words;

export const BentengDedaunExplainer: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#fef8ee", overflow: "hidden" }}>
      {/* 1. Global Baritone Narration Audio */}
      <Audio src={staticFile("audio/benteng_dedaun_narasi.mp3")} volume={1} />

      {/* 2. Visual Storybook Sequences (6 Fully Staged Dynamic Scenes) */}
      <Series>
        {/* ================================================================= */}
        {/* SHOT 1: Benteng Penjajah Eropa & Komandan Sombong (0 - 220f)      */}
        {/* ================================================================= */}
        <Series.Sequence durationInFrames={220}>
          {(() => {
            const frame = useCurrentFrame();
            const commanderX = interpolate(frame, [0, 50], [240, 540], {
              extrapolateRight: "clamp",
            });
            const isWalking = frame < 50;

            return (
              <AbsoluteFill style={{ overflow: "hidden" }}>
                <DedaunBackground scene="european_fort" />

                <div
                  style={{
                    position: "absolute",
                    bottom: "28%",
                    left: commanderX,
                    transform: "translateX(-50%)",
                    zIndex: 4,
                  }}
                >
                  <DedaunCharacter
                    role="komandan_kolonial"
                    scale={1.35}
                    facing="right"
                    action={isWalking ? "walk" : "idle"}
                  />
                </div>

                {/* Title Card */}
                <div
                  style={{
                    position: "absolute",
                    top: "14%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "rgba(30, 41, 59, 0.94)",
                    color: "#ffffff",
                    padding: "12px 34px",
                    borderRadius: 14,
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 800,
                    fontSize: 32,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                    textAlign: "center",
                    zIndex: 10,
                  }}
                >
                  Kastil Semen & Meriam Baja
                </div>
              </AbsoluteFill>
            );
          })()}
        </Series.Sequence>

        {/* ================================================================= */}
        {/* SHOT 2: Bukit Buton & Benteng Terluas Membentang (220 - 520f)     */}
        {/* Peasant patrol walks safely across the hill trail (260px - 780px) */}
        {/* ================================================================= */}
        <Series.Sequence durationInFrames={300}>
          {(() => {
            const frame = useCurrentFrame();
            const peasantX = interpolate(frame, [0, 300], [260, 780]);

            return (
              <AbsoluteFill style={{ overflow: "hidden" }}>
                <DedaunBackground scene="buton_landscape" />

                {/* Floating Location Card */}
                <div
                  style={{
                    position: "absolute",
                    top: "14%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "rgba(254, 250, 224, 0.96)",
                    border: "4px solid #ca8a04",
                    color: "#854d0e",
                    padding: "12px 36px",
                    borderRadius: 16,
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 800,
                    fontSize: 34,
                    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    zIndex: 10,
                  }}
                >
                  Pulau Buton, Sulawesi Tenggara
                </div>

                {/* Peasant Patrol walking on path */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "28%",
                    left: peasantX,
                    transform: "translateX(-50%)",
                    zIndex: 4,
                  }}
                >
                  <DedaunCharacter
                    role="rakyat_jelata"
                    scale={1.3}
                    facing="right"
                    action="walk"
                  />
                </div>
              </AbsoluteFill>
            );
          })()}
        </Series.Sequence>

        {/* ================================================================= */}
        {/* SHOT 3: Gotong Royong Rakyat & Rahasia Putih Telur (520 - 980f)   */}
        {/* ================================================================= */}
        <Series.Sequence durationInFrames={460}>
          {(() => {
            const frame = useCurrentFrame();
            const villagerX = interpolate(frame, [0, 220], [220, 480], {
              extrapolateRight: "clamp",
            });
            const isCarrying = frame < 220;
            const commanderLaughing = frame > 90;

            return (
              <AbsoluteFill style={{ overflow: "hidden" }}>
                <DedaunBackground scene="building_wall" />

                {/* Villager carrying stone towards wall */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "28%",
                    left: villagerX,
                    transform: "translateX(-50%)",
                    zIndex: 4,
                  }}
                >
                  <DedaunCharacter
                    role="rakyat_jelata"
                    scale={1.35}
                    facing="right"
                    action={isCarrying ? "carry_walk" : "proud"}
                  />
                </div>

                {/* Mocking Colonial Officer on the right ground */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "28%",
                    right: "10%",
                    zIndex: 4,
                  }}
                >
                  <DedaunCharacter
                    role="komandan_kolonial"
                    scale={1.3}
                    facing="left"
                    action={commanderLaughing ? "laugh" : "idle"}
                  />
                </div>

                {/* Card Label */}
                <div
                  style={{
                    position: "absolute",
                    top: "12%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "rgba(254, 240, 138, 0.95)",
                    border: "4px solid #b45309",
                    color: "#78350f",
                    padding: "10px 28px",
                    borderRadius: 14,
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 800,
                    fontSize: 30,
                    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
                    textAlign: "center",
                    zIndex: 10,
                  }}
                >
                  Perekat Adonan Putih Telur
                </div>
              </AbsoluteFill>
            );
          })()}
        </Series.Sequence>

        {/* ================================================================= */}
        {/* SHOT 4: Hari-hari Keraguan di Senja & Kapal Musuh (980 - 1320f)   */}
        {/* ================================================================= */}
        <Series.Sequence durationInFrames={340}>
          {(() => {
            const frame = useCurrentFrame();
            const waveY = Math.sin(frame * 0.08) * 6;

            return (
              <AbsoluteFill style={{ overflow: "hidden" }}>
                <DedaunBackground scene="sunset_sea_siege" />

                {/* Animated Warships on Sea */}
                <div
                  style={{
                    position: "absolute",
                    top: `calc(47% + ${waveY}px)`,
                    right: "12%",
                    display: "flex",
                    gap: 50,
                    opacity: 0.9,
                    zIndex: 2,
                  }}
                >
                  {[0, 1, 2].map((k) => (
                    <div key={k} style={{ position: "relative", width: 90, height: 50 }}>
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          width: 90,
                          height: 22,
                          backgroundColor: "#431407",
                          clipPath: "polygon(15% 100%, 85% 100%, 100% 0, 0 0)",
                        }}
                      />
                      <div style={{ position: "absolute", bottom: 18, left: 30, width: 5, height: 42, backgroundColor: "#431407" }} />
                      <div style={{ position: "absolute", bottom: 18, left: 58, width: 5, height: 35, backgroundColor: "#431407" }} />
                    </div>
                  ))}
                </div>

                {/* Thoughtful Peasant standing on rampart */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "28%",
                    left: "34%",
                    zIndex: 4,
                  }}
                >
                  <DedaunCharacter
                    role="rakyat_jelata"
                    scale={1.38}
                    facing="right"
                    action="idle"
                  />
                </div>

                {/* Question Thought Bubble */}
                <div
                  style={{
                    position: "absolute",
                    top: "18%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "4px solid #ea580c",
                    color: "#9a3412",
                    padding: "14px 32px",
                    borderRadius: 20,
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 700,
                    fontSize: 30,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                    textAlign: "center",
                    maxWidth: 700,
                    zIndex: 10,
                  }}
                >
                  "Apakah pengorbanan ini akan sia-sia?"
                </div>
              </AbsoluteFill>
            );
          })()}
        </Series.Sequence>

        {/* ================================================================= */}
        {/* SHOT 5: Serangan Meriam Laut & Dinding Kokoh (1320 - 1690f)       */}
        {/* Defender is on bastion top edge; Enemy is down by cannon          */}
        {/* ================================================================= */}
        <Series.Sequence durationInFrames={370}>
          {(() => {
            const frame = useCurrentFrame();

            // Cannonball trajectory: from right cannon (x: 820) to fortress wall (x: 460)
            const ballProgress = interpolate(frame, [30, 62], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const ballX = interpolate(ballProgress, [0, 1], [820, 460]);
            const ballY = interpolate(ballProgress, [0, 0.5, 1], [1360, 1180, 1120]);
            const ballVisible = frame >= 30 && frame < 85;

            // Cannonball ricochets down into dirt after hitting the wall at frame 62
            const bounceY = frame >= 62 ? (frame - 62) * 14 : 0;
            const bounceX = frame >= 62 ? (frame - 62) * 6 : 0;

            // Screen shake right at cannon impact (frames 62 - 78)
            const isShaking = frame >= 62 && frame <= 78;
            const shakeX = isShaking ? Math.sin(frame * 3) * 14 : 0;
            const shakeY = isShaking ? Math.cos(frame * 3) * 12 : 0;

            // Commander is shocked when wall doesn't break
            const commanderShocked = frame >= 62;

            return (
              <AbsoluteFill
                style={{
                  overflow: "hidden",
                  transform: `translate(${shakeX}px, ${shakeY}px)`,
                }}
              >
                <DedaunBackground scene="cannon_battle" />

                {/* Flying / Bouncing Cannonball */}
                {ballVisible && (
                  <div
                    style={{
                      position: "absolute",
                      left: ballX + bounceX,
                      top: ballY + bounceY,
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      backgroundColor: "#18181b",
                      border: "3px solid #f59e0b",
                      boxShadow: "0 0 20px rgba(245, 158, 11, 0.9)",
                      zIndex: 10,
                    }}
                  />
                )}

                {/* Impact Flash & Smoke Cloud on Fortress Wall */}
                {frame >= 62 && frame <= 76 && (
                  <div
                    style={{
                      position: "absolute",
                      left: 420,
                      top: 1080,
                      width: 140,
                      height: 140,
                      borderRadius: "50%",
                      backgroundColor: "rgba(254, 240, 138, 0.85)",
                      filter: "blur(20px)",
                      zIndex: 12,
                    }}
                  />
                )}

                {/* DEFENDER: Standing proud UP ON the Fortress Bastion Terrace */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 1040,
                    left: 220,
                    transform: "translateX(-50%)",
                    zIndex: 5,
                  }}
                >
                  <DedaunCharacter
                    role="rakyat_jelata"
                    scale={1.25}
                    facing="right"
                    action="proud"
                  />
                </div>

                {/* COLONIAL ENEMY: Standing DOWN on battlefield beside his cannon */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 520,
                    right: 320,
                    transform: "translateX(50%)",
                    zIndex: 4,
                  }}
                >
                  <DedaunCharacter
                    role="komandan_kolonial"
                    scale={1.2}
                    facing="left"
                    action={commanderShocked ? "shocked" : "idle"}
                  />
                </div>

                {/* Label Card */}
                <div
                  style={{
                    position: "absolute",
                    top: "8%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "rgba(120, 53, 15, 0.95)",
                    color: "#fef08a",
                    padding: "12px 32px",
                    borderRadius: 14,
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 800,
                    fontSize: 32,
                    boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
                    textAlign: "center",
                    zIndex: 10,
                  }}
                >
                  Dinding Rakyat Tak Tertembus
                </div>
              </AbsoluteFill>
            );
          })()}
        </Series.Sequence>

        {/* ================================================================= */}
        {/* SHOT 6: Kejayaan Guinness World Records & Merah Putih (1690 - 1984f) */}
        {/* ================================================================= */}
        <Series.Sequence durationInFrames={294}>
          {(() => {
            return (
              <AbsoluteFill style={{ overflow: "hidden" }}>
                <DedaunBackground scene="triumph_guinness" />

                {/* Proud Defender standing ON the fortress stone terrace floor */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "28%",
                    left: 460,
                    transform: "translateX(-50%)",
                    zIndex: 5,
                  }}
                >
                  <DedaunCharacter
                    role="rakyat_jelata"
                    scale={1.35}
                    facing="right"
                    action="proud"
                  />
                </div>
              </AbsoluteFill>
            );
          })()}
        </Series.Sequence>
      </Series>

      {/* 3. Global Yellow-Pill Subtitle (Lower Third Y: 84%) */}
      <DedaunSubtitle words={SUBTITLE_WORDS} top="84%" fontSize={44} />
    </AbsoluteFill>
  );
};
