import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

export type CharacterAction =
  | "idle"
  | "walk"
  | "carry_walk"
  | "laugh"
  | "shocked"
  | "proud";

export interface DedaunCharacterProps {
  role: "guru_pns" | "guru_honorer" | "dokter" | "murid" | "rakyat_jelata" | "komandan_kolonial";
  scale?: number;
  facing?: "left" | "right";
  action?: CharacterAction;
}

export const DedaunCharacter: React.FC<DedaunCharacterProps> = ({
  role = "rakyat_jelata",
  scale = 1.0,
  facing = "right",
  action = "idle",
}) => {
  const frame = useCurrentFrame();

  const isWalking = action === "walk" || action === "carry_walk";
  const isLaughing = action === "laugh";
  const isShocked = action === "shocked";
  const isProud = action === "proud";

  // Gentle walking step (subtle alternating leg lift, NO scissor crossing)
  const walkCycle = isWalking ? Math.sin(frame * 0.3) : 0;
  const legLeftY = isWalking ? Math.max(0, walkCycle * 14) : 0;
  const legRightY = isWalking ? Math.max(0, -walkCycle * 14) : 0;
  const bodyBobY = isWalking ? Math.abs(walkCycle) * 6 : 0;

  // Idle breath motion (subtle, feet remain grounded)
  const breathY = isWalking
    ? -bodyBobY
    : isLaughing
    ? Math.sin(frame * 0.45) * 4
    : isShocked
    ? Math.sin(frame * 0.8) * 3
    : interpolate(Math.sin(frame * 0.08), [-1, 1], [-2, 2]);

  const breathScaleY = isWalking
    ? 1.0
    : isLaughing
    ? interpolate(Math.sin(frame * 0.45), [-1, 1], [0.99, 1.01])
    : interpolate(Math.sin(frame * 0.08), [-1, 1], [0.995, 1.005]);

  const headTilt = isLaughing
    ? Math.sin(frame * 0.4) * 5
    : isShocked
    ? -6
    : isProud
    ? -4
    : 0;

  // Blink every ~90 frames (3 seconds)
  const isBlinking = !isShocked && frame % 90 >= 85;

  const flip = facing === "left" ? -1 : 1;

  return (
    <div
      style={{
        position: "relative",
        width: 260,
        height: 440,
        transform: `scale(${scale}) scaleX(${flip})`,
        transformOrigin: "bottom center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Floor Contact Shadow - ALWAYS locked strictly to bottom 0 */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 170,
          height: 22,
          backgroundColor: "rgba(80, 70, 60, 0.35)",
          borderRadius: "50%",
          filter: "blur(3px)",
        }}
      />

      {/* Main Character Body Group (rises from bottom shadow) */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: 440,
          transform: `translateY(${breathY}px) scaleY(${breathScaleY})`,
          transformOrigin: "bottom center",
        }}
      >
        {/* ========================================================== */}
        {/* RAKYAT JELATA BUTON                                        */}
        {/* ========================================================== */}
        {role === "rakyat_jelata" && (
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            {/* HEAD GROUP */}
            <div
              style={{
                position: "absolute",
                top: 20,
                left: "50%",
                transform: `translateX(-50%) rotate(${headTilt}deg)`,
                transformOrigin: "bottom center",
                width: 150,
                height: 160,
                zIndex: 3,
              }}
            >
              {/* Ikat Kepala Cokelat / Oranye */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 145,
                  height: 55,
                  backgroundColor: "#b45309",
                  borderRadius: "35px 35px 8px 8px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.12)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    right: -6,
                    top: 18,
                    width: 18,
                    height: 26,
                    backgroundColor: "#92400e",
                    borderRadius: "50% 8px 8px 50%",
                    transform: "rotate(15deg)",
                  }}
                />
              </div>

              {/* Chibi Face */}
              <div
                style={{
                  position: "absolute",
                  top: 22,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 130,
                  height: 135,
                  backgroundColor: "#f5d0b5",
                  borderRadius: "50%",
                  boxShadow: "0 6px 12px rgba(0,0,0,0.06)",
                }}
              >
                {/* Eyes */}
                <div style={{ position: "absolute", top: 48, left: 28, display: "flex", gap: 38 }}>
                  {isBlinking ? (
                    <>
                      <div style={{ width: 12, height: 3, backgroundColor: "#3d3534", borderRadius: 2 }} />
                      <div style={{ width: 12, height: 3, backgroundColor: "#3d3534", borderRadius: 2 }} />
                    </>
                  ) : (
                    <>
                      <div style={{ width: 9, height: 12, backgroundColor: "#3d3534", borderRadius: "50%" }} />
                      <div style={{ width: 9, height: 12, backgroundColor: "#3d3534", borderRadius: "50%" }} />
                    </>
                  )}
                </div>

                {/* Blush */}
                <div style={{ position: "absolute", top: 62, left: 14, width: 20, height: 12, backgroundColor: "rgba(234, 88, 12, 0.35)", borderRadius: "50%" }} />
                <div style={{ position: "absolute", top: 62, right: 14, width: 20, height: 12, backgroundColor: "rgba(234, 88, 12, 0.35)", borderRadius: "50%" }} />

                {/* Mouth */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 24,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: isProud ? 24 : 18,
                    height: isProud ? 10 : 6,
                    borderBottom: "3px solid #3d3534",
                    borderRadius: "0 0 12px 12px",
                  }}
                />
              </div>
            </div>

            {/* TORSO */}
            <div
              style={{
                position: "absolute",
                top: 165,
                left: "50%",
                transform: "translateX(-50%)",
                width: 130,
                height: 155,
                backgroundColor: "#78350f",
                borderRadius: "14px 14px 4px 4px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                zIndex: 2,
              }}
            >
              {/* Golden Yellow Belt */}
              <div style={{ position: "absolute", bottom: 16, width: "100%", height: 16, backgroundColor: "#d97706" }} />
            </div>

            {/* ARMS / CARRYING ROCK */}
            {action === "carry_walk" ? (
              <div
                style={{
                  position: "absolute",
                  top: 180,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 150,
                  height: 100,
                  zIndex: 4,
                }}
              >
                <div style={{ position: "absolute", left: 10, top: 10, width: 28, height: 60, backgroundColor: "#78350f", borderRadius: 10, transform: "rotate(30deg)" }} />
                <div style={{ position: "absolute", right: 10, top: 10, width: 28, height: 60, backgroundColor: "#78350f", borderRadius: 10, transform: "rotate(-30deg)" }} />
                {/* Limestone Block */}
                <div
                  style={{
                    position: "absolute",
                    top: 20,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 105,
                    height: 68,
                    backgroundColor: "#fef08a",
                    border: "4px solid #ca8a04",
                    borderRadius: 10,
                    boxShadow: "0 6px 14px rgba(0,0,0,0.18)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 900, color: "#854d0e", fontFamily: "Poppins, sans-serif" }}>
                    Batu Karang
                  </span>
                </div>
              </div>
            ) : (
              <>
                <div style={{ position: "absolute", top: 175, left: 50, width: 24, height: 85, backgroundColor: "#662d0b", borderRadius: 12, zIndex: 1 }} />
                <div style={{ position: "absolute", top: 175, right: 50, width: 24, height: 85, backgroundColor: "#78350f", borderRadius: 12, zIndex: 3 }} />
              </>
            )}

            {/* LEGS (Clean parallel vertical stick legs, alternating step) */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: 100,
                height: 105,
                display: "flex",
                justifyContent: "space-between",
                zIndex: 1,
              }}
            >
              {/* Left Leg */}
              <div
                style={{
                  width: 38,
                  height: 95,
                  backgroundColor: "#7c350c",
                  borderRadius: "4px 4px 6px 6px",
                  transform: `translateY(${-legLeftY}px)`,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: -3,
                    width: 44,
                    height: 16,
                    backgroundColor: "#f5d0b5",
                    borderRadius: "6px 10px 4px 4px",
                  }}
                />
              </div>

              {/* Right Leg */}
              <div
                style={{
                  width: 38,
                  height: 95,
                  backgroundColor: "#92400e",
                  borderRadius: "4px 4px 6px 6px",
                  transform: `translateY(${-legRightY}px)`,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: -3,
                    width: 44,
                    height: 16,
                    backgroundColor: "#f5d0b5",
                    borderRadius: "6px 10px 4px 4px",
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* KOMANDAN KOLONIAL EROPA                                    */}
        {/* ========================================================== */}
        {role === "komandan_kolonial" && (
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            {/* HEAD GROUP */}
            <div
              style={{
                position: "absolute",
                top: 15,
                left: "50%",
                transform: `translateX(-50%) rotate(${headTilt}deg)`,
                transformOrigin: "bottom center",
                width: 190,
                height: 175,
                zIndex: 3,
              }}
            >
              {/* Bicorne Hat */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 190,
                  height: 65,
                  backgroundColor: "#0f172a",
                  borderTop: "5px solid #eab308",
                  borderRadius: "90px 90px 16px 16px",
                  boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
                  zIndex: 5,
                }}
              >
                <div style={{ position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", width: 18, height: 18, borderRadius: "50%", backgroundColor: "#eab308", border: "2px solid #dc2626" }} />
              </div>

              {/* Pale Face */}
              <div
                style={{
                  position: "absolute",
                  top: 36,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 130,
                  height: 135,
                  backgroundColor: "#fee2e2",
                  borderRadius: "50%",
                  boxShadow: "0 6px 12px rgba(0,0,0,0.06)",
                }}
              >
                {/* Eyes */}
                <div style={{ position: "absolute", top: 48, left: 26, display: "flex", gap: 38 }}>
                  {isShocked ? (
                    <>
                      <div style={{ width: 16, height: 16, backgroundColor: "#1e293b", borderRadius: "50%", border: "2px solid #ffffff" }} />
                      <div style={{ width: 16, height: 16, backgroundColor: "#1e293b", borderRadius: "50%", border: "2px solid #ffffff" }} />
                    </>
                  ) : (
                    <>
                      <div style={{ width: 12, height: 4, backgroundColor: "#1e293b", transform: "rotate(-10deg)" }} />
                      <div style={{ width: 12, height: 4, backgroundColor: "#1e293b", transform: "rotate(10deg)" }} />
                    </>
                  )}
                </div>

                {/* Mouth */}
                {isLaughing ? (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 20,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 28,
                      height: 18,
                      backgroundColor: "#881337",
                      borderRadius: "0 0 14px 14px",
                      border: "2px solid #1e293b",
                      overflow: "hidden",
                    }}
                  >
                    <div style={{ width: 18, height: 8, backgroundColor: "#ffffff", margin: "0 auto", borderRadius: "0 0 4px 4px" }} />
                  </div>
                ) : isShocked ? (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 22,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 20,
                      height: 20,
                      backgroundColor: "#881337",
                      borderRadius: "50%",
                      border: "2px solid #1e293b",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 26,
                      left: "50%",
                      transform: "translateX(-40%) rotate(-8deg)",
                      width: 20,
                      height: 4,
                      backgroundColor: "#1e293b",
                      borderRadius: 2,
                    }}
                  />
                )}
              </div>
            </div>

            {/* Royal Blue Military Uniform */}
            <div
              style={{
                position: "absolute",
                top: 170,
                left: "50%",
                transform: "translateX(-50%)",
                width: 140,
                height: 160,
                backgroundColor: "#1e3a8a",
                borderRadius: "14px 14px 4px 4px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                zIndex: 2,
              }}
            >
              <div style={{ position: "absolute", top: 4, left: 6, width: 26, height: 10, backgroundColor: "#eab308", borderRadius: 3 }} />
              <div style={{ position: "absolute", top: 4, right: 6, width: 26, height: 10, backgroundColor: "#eab308", borderRadius: 3 }} />
              <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 30, height: "100%", backgroundColor: "#dc2626" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, marginTop: 18 }}>
                  <div style={{ width: 8, height: 8, backgroundColor: "#eab308", borderRadius: "50%" }} />
                  <div style={{ width: 8, height: 8, backgroundColor: "#eab308", borderRadius: "50%" }} />
                  <div style={{ width: 8, height: 8, backgroundColor: "#eab308", borderRadius: "50%" }} />
                </div>
              </div>
            </div>

            {/* Commander Arms */}
            {isShocked ? (
              <>
                <div style={{ position: "absolute", top: 155, left: 30, width: 26, height: 80, backgroundColor: "#1e3a8a", borderRadius: 12, transform: "rotate(-50deg)", zIndex: 3 }} />
                <div style={{ position: "absolute", top: 155, right: 30, width: 26, height: 80, backgroundColor: "#1e3a8a", borderRadius: 12, transform: "rotate(50deg)", zIndex: 3 }} />
              </>
            ) : isLaughing ? (
              <>
                <div style={{ position: "absolute", top: 180, left: 40, width: 26, height: 75, backgroundColor: "#1e3a8a", borderRadius: 12, transform: "rotate(35deg)", zIndex: 3 }} />
                <div style={{ position: "absolute", top: 180, right: 40, width: 26, height: 75, backgroundColor: "#1e3a8a", borderRadius: 12, transform: "rotate(-35deg)", zIndex: 3 }} />
              </>
            ) : (
              <>
                <div style={{ position: "absolute", top: 180, left: 50, width: 24, height: 85, backgroundColor: "#172554", borderRadius: 12 }} />
                <div style={{ position: "absolute", top: 180, right: 50, width: 24, height: 85, backgroundColor: "#1e3a8a", borderRadius: 12 }} />
              </>
            )}

            {/* LEGS & BOOTS */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: 95,
                height: 105,
                display: "flex",
                justifyContent: "space-between",
                zIndex: 1,
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 95,
                  backgroundColor: "#f8fafc",
                  borderRadius: 4,
                  transform: `translateY(${-legLeftY}px)`,
                  position: "relative",
                }}
              >
                <div style={{ position: "absolute", bottom: 0, left: -2, width: 42, height: 22, backgroundColor: "#0f172a", borderRadius: "4px 8px 6px 4px" }} />
              </div>
              <div
                style={{
                  width: 38,
                  height: 95,
                  backgroundColor: "#f8fafc",
                  borderRadius: 4,
                  transform: `translateY(${-legRightY}px)`,
                  position: "relative",
                }}
              >
                <div style={{ position: "absolute", bottom: 0, left: -2, width: 42, height: 22, backgroundColor: "#0f172a", borderRadius: "8px 4px 4px 6px" }} />
              </div>
            </div>
          </div>
        )}

        {/* GURU HONORER / PNS FALLBACKS */}
        {role === "guru_honorer" && (
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <div style={{ position: "absolute", top: 30, left: "50%", transform: "translateX(-50%)", width: 160, height: 180, backgroundColor: "#945353", borderRadius: "80px 80px 60px 60px" }}>
              <div style={{ position: "absolute", top: 30, left: "50%", transform: "translateX(-50%)", width: 110, height: 120, backgroundColor: "#fae1ce", borderRadius: "50%" }} />
            </div>
            <div style={{ position: "absolute", top: 210, left: "50%", transform: "translateX(-50%)", width: 120, height: 140, backgroundColor: "#608075", borderRadius: "14px 14px 4px 4px" }} />
            <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 130, height: 85, backgroundColor: "#485c54" }} />
          </div>
        )}
      </div>
    </div>
  );
};
