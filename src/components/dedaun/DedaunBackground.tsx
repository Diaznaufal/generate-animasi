import React from "react";
import { AbsoluteFill } from "remotion";

export interface DedaunBackgroundProps {
  scene?:
    | "classroom"
    | "school_front"
    | "time_jump"
    | "european_fort"
    | "buton_landscape"
    | "building_wall"
    | "sunset_sea_siege"
    | "cannon_battle"
    | "triumph_guinness";
  timeJumpText?: string;
}

export const DedaunBackground: React.FC<DedaunBackgroundProps> = ({
  scene = "buton_landscape",
  timeJumpText = "20 TAHUN",
}) => {
  if (scene === "classroom") {
    return (
      <AbsoluteFill style={{ backgroundColor: "#f7ece1", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "64%", background: "linear-gradient(180deg, #fdf8ee 0%, #f4e8dc 100%)" }}>
          <div style={{ position: "absolute", top: 240, left: 70, width: 520, height: 340, backgroundColor: "#3f5e4d", border: "12px solid #b89164", borderRadius: 16, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <div style={{ fontFamily: "Poppins, sans-serif", fontSize: 44, fontWeight: 700, color: "#e2e8f0" }}>2 + 3 = 5</div>
          </div>
          <div style={{ position: "absolute", top: 240, right: 80, width: 320, height: 340, backgroundColor: "#bae6fd", border: "12px solid #ffffff", borderRadius: 14 }} />
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "36%", backgroundColor: "#b89368", borderTop: "10px solid #8e6c46" }} />
      </AbsoluteFill>
    );
  }

  if (scene === "school_front") {
    return (
      <AbsoluteFill style={{ backgroundColor: "#f6ede2", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "65%", background: "linear-gradient(180deg, #e3f2fd 0%, #fef8ee 100%)" }} />
        <div style={{ position: "absolute", top: "38%", left: "50%", transform: "translateX(-50%)", width: 780, height: 380, backgroundColor: "#fefae0", border: "8px solid #b7a996", borderRadius: 16 }}>
          <div style={{ position: "absolute", top: -85, left: -40, width: 860, height: 85, backgroundColor: "#c26d57", clipPath: "polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)" }} />
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "38%", backgroundColor: "#7ca884" }} />
      </AbsoluteFill>
    );
  }

  if (scene === "time_jump") {
    return (
      <AbsoluteFill style={{ backgroundColor: "#1e293b", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 100, fontWeight: 900, color: "#ffffff", fontFamily: "Poppins, sans-serif" }}>{timeJumpText}</div>
      </AbsoluteFill>
    );
  }

  // =========================================================================
  // 1. EUROPEAN FORTRESS (Ground level: 28%)
  // =========================================================================
  if (scene === "european_fort") {
    return (
      <AbsoluteFill style={{ backgroundColor: "#334155", overflow: "hidden" }}>
        {/* European Overcast Sky */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "72%",
            background: "linear-gradient(180deg, #1e293b 0%, #334155 45%, #64748b 100%)",
          }}
        />

        {/* European Stone Castle Wall (Rises from ground bottom: 28%) */}
        <div
          style={{
            position: "absolute",
            bottom: "28%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "110%",
            height: 980,
            backgroundColor: "#475569",
            borderTop: "14px solid #1e293b",
            boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
          }}
        >
          {/* Merlons / Battlements along top of wall */}
          <div
            style={{
              position: "absolute",
              top: -55,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                style={{
                  width: 100,
                  height: 55,
                  backgroundColor: "#475569",
                  border: "8px solid #1e293b",
                  borderBottom: "none",
                  borderRadius: "6px 6px 0 0",
                }}
              />
            ))}
          </div>

          {/* Arched Gothic Castle Windows */}
          <div style={{ position: "absolute", top: 110, left: 160, width: 90, height: 160, backgroundColor: "#0f172a", borderRadius: "45px 45px 0 0", border: "6px solid #1e293b" }} />
          <div style={{ position: "absolute", top: 110, right: 160, width: 90, height: 160, backgroundColor: "#0f172a", borderRadius: "45px 45px 0 0", border: "6px solid #1e293b" }} />
          <div style={{ position: "absolute", top: 90, left: "50%", transform: "translateX(-50%)", width: 140, height: 220, backgroundColor: "#0f172a", borderRadius: "70px 70px 0 0", border: "8px solid #1e293b" }} />

          {/* Stone Brick Texture */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.18,
              backgroundImage:
                "repeating-linear-gradient(0deg, #0f172a 0px, #0f172a 3px, transparent 3px, transparent 65px), repeating-linear-gradient(90deg, #0f172a 0px, #0f172a 3px, transparent 3px, transparent 130px)",
            }}
          />
        </div>

        {/* Cannon on Carriage parked on the right ground */}
        <div
          style={{
            position: "absolute",
            bottom: "28%",
            right: 50,
            width: 250,
            height: 120,
            zIndex: 3,
          }}
        >
          {/* Cannon Barrel */}
          <div
            style={{
              position: "absolute",
              bottom: 35,
              left: 10,
              width: 210,
              height: 60,
              backgroundColor: "#0f172a",
              borderRadius: "20px 8px 8px 20px",
              border: "5px solid #334155",
              transform: "rotate(-12deg)",
            }}
          />
          {/* Wooden Wheel */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 70,
              width: 85,
              height: 85,
              borderRadius: "50%",
              backgroundColor: "#78350f",
              border: "8px solid #451a03",
              boxShadow: "0 6px 14px rgba(0,0,0,0.5)",
            }}
          />
        </div>

        {/* Cobblestone Courtyard Ground (strictly bottom 0 to height 28%) */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "28%",
            backgroundColor: "#1e293b",
            borderTop: "10px solid #0f172a",
            zIndex: 2,
          }}
        >
          {/* Cobblestone Pattern */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.22,
              backgroundImage:
                "repeating-linear-gradient(90deg, #0f172a 0px, #0f172a 4px, transparent 4px, transparent 140px)",
            }}
          />
        </div>
      </AbsoluteFill>
    );
  }

  // =========================================================================
  // 2. BUTON LANDSCAPE (Ground level: 28%)
  // Winding limestone fortress wall across tropical hills & sea
  // =========================================================================
  if (scene === "buton_landscape") {
    return (
      <AbsoluteFill style={{ backgroundColor: "#fef8ee", overflow: "hidden" }}>
        {/* Tropical Island Sky */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "72%",
            background: "linear-gradient(180deg, #38bdf8 0%, #7dd3fc 40%, #fef08a 85%, #fed7aa 100%)",
          }}
        >
          {/* Warm Morning Sun */}
          <div
            style={{
              position: "absolute",
              top: "9%",
              right: "18%",
              width: 140,
              height: 140,
              borderRadius: "50%",
              backgroundColor: "#fde047",
              boxShadow: "0 0 60px rgba(253, 224, 71, 0.6)",
            }}
          />
        </div>

        {/* Distant Sea Horizon */}
        <div
          style={{
            position: "absolute",
            bottom: "48%",
            left: 0,
            right: 0,
            height: "12%",
            backgroundColor: "#0284c7",
            opacity: 0.85,
          }}
        />

        {/* Green Distant Hills */}
        <div
          style={{
            position: "absolute",
            bottom: "42%",
            left: -80,
            right: -80,
            height: "18%",
            backgroundColor: "#16a34a",
            borderRadius: "50% 50% 0 0 / 60px 60px 0 0",
          }}
        />

        {/* The Great Winding Limestone Wall of Buton (Midground) */}
        <div
          style={{
            position: "absolute",
            bottom: "28%",
            left: -40,
            right: -40,
            height: 320,
            backgroundColor: "#fefae0",
            borderTop: "10px solid #ca8a04",
            borderBottom: "6px solid #854d0e",
            boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
            zIndex: 1,
          }}
        >
          {/* Wall Crenellations */}
          <div
            style={{
              position: "absolute",
              top: -36,
              left: 20,
              right: 20,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                style={{
                  width: 70,
                  height: 36,
                  backgroundColor: "#fefae0",
                  border: "6px solid #ca8a04",
                  borderBottom: "none",
                  borderRadius: "5px 5px 0 0",
                }}
              />
            ))}
          </div>

          {/* Limestone Brick Texture */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.2,
              backgroundImage:
                "repeating-linear-gradient(0deg, #ca8a04 0px, #ca8a04 2px, transparent 2px, transparent 50px), repeating-linear-gradient(90deg, #ca8a04 0px, #ca8a04 2px, transparent 2px, transparent 100px)",
            }}
          />

          {/* Wall Bastion Lookout Tower */}
          <div
            style={{
              position: "absolute",
              top: -80,
              left: 120,
              width: 140,
              height: 200,
              backgroundColor: "#fef08a",
              border: "8px solid #ca8a04",
              borderRadius: "10px 10px 0 0",
              boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
            }}
          >
            <div style={{ position: "absolute", top: 30, left: "50%", transform: "translateX(-50%)", width: 45, height: 70, backgroundColor: "#854d0e", borderRadius: "25px 25px 0 0" }} />
          </div>
        </div>

        {/* Foreground Grassy Ridge & Walking Trail (strictly bottom: 0 to height: 28%) */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "28%",
            backgroundColor: "#15803d",
            backgroundImage: "linear-gradient(180deg, #22c55e 0%, #15803d 100%)",
            borderTop: "10px solid #166534",
            zIndex: 2,
          }}
        >
          {/* Paved Stone Walking Trail right at the ground line */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 48,
              backgroundColor: "#d4a373",
              borderBottom: "5px solid #a9714b",
              opacity: 0.95,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0.25,
                backgroundImage:
                  "repeating-linear-gradient(90deg, #78350f 0px, #78350f 3px, transparent 3px, transparent 60px)",
              }}
            />
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  // =========================================================================
  // 3. BUILDING WALL (Ground level: 28%)
  // Construction site: limestone blocks, egg paste mortar trough, active wall
  // =========================================================================
  if (scene === "building_wall") {
    return (
      <AbsoluteFill style={{ backgroundColor: "#fef3c7", overflow: "hidden" }}>
        {/* Sunny Construction Sky */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "72%",
            background: "linear-gradient(180deg, #fde047 0%, #fef08a 40%, #fed7aa 80%, #ffedd5 100%)",
          }}
        />

        {/* Majestic Limestone Fortress Wall Being Built (Left side, rises from bottom: 28%) */}
        <div
          style={{
            position: "absolute",
            bottom: "28%",
            left: 60,
            width: 520,
            height: 740,
            backgroundColor: "#fefae0",
            border: "12px solid #ca8a04",
            borderBottom: "none",
            borderRadius: "16px 16px 0 0",
            boxShadow: "0 18px 45px rgba(0,0,0,0.18)",
            zIndex: 1,
          }}
        >
          {/* Stone Texture with Mortar Joints */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "repeating-linear-gradient(0deg, #ca8a04 0px, #ca8a04 3px, transparent 3px, transparent 75px), repeating-linear-gradient(90deg, #ca8a04 0px, #ca8a04 3px, transparent 3px, transparent 130px)",
              opacity: 0.25,
            }}
          />

          {/* Unfinished Top Stone Layer (Being constructed) */}
          <div style={{ position: "absolute", top: -35, left: 40, width: 140, height: 35, backgroundColor: "#fef08a", border: "6px solid #ca8a04", borderBottom: "none", borderRadius: "6px 6px 0 0" }} />
          <div style={{ position: "absolute", top: -35, left: 220, width: 130, height: 35, backgroundColor: "#fef08a", border: "6px solid #ca8a04", borderBottom: "none", borderRadius: "6px 6px 0 0" }} />
        </div>

        {/* PROPS RESTING SOLIDLY ON GROUND (at bottom: 28%) */}
        {/* Wooden Trough with White Egg Mortar */}
        <div
          style={{
            position: "absolute",
            bottom: "28%",
            left: 140,
            width: 170,
            height: 85,
            zIndex: 3,
          }}
        >
          {/* Wooden Tub */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 70,
              backgroundColor: "#92400e",
              borderRadius: "0 0 40px 40px",
              border: "6px solid #713f12",
              boxShadow: "0 8px 18px rgba(0,0,0,0.2)",
            }}
          >
            {/* White Egg Paste Fill */}
            <div
              style={{
                position: "absolute",
                top: 4,
                left: 10,
                right: 10,
                height: 28,
                backgroundColor: "#ffffff",
                borderRadius: "50%",
                boxShadow: "inset 0 3px 6px rgba(234, 179, 8, 0.4)",
              }}
            />
            {/* Label */}
            <div
              style={{
                position: "absolute",
                bottom: 10,
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: 14,
                fontWeight: 900,
                color: "#fef08a",
                whiteSpace: "nowrap",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              Putih Telur
            </div>
          </div>
        </div>

        {/* Stack of Limestone Rocks on Ground */}
        <div
          style={{
            position: "absolute",
            bottom: "28%",
            left: 20,
            width: 120,
            height: 60,
            zIndex: 3,
          }}
        >
          <div style={{ position: "absolute", bottom: 0, left: 0, width: 65, height: 42, backgroundColor: "#fef08a", border: "4px solid #ca8a04", borderRadius: 8 }} />
          <div style={{ position: "absolute", bottom: 0, left: 55, width: 60, height: 45, backgroundColor: "#fef9c3", border: "4px solid #ca8a04", borderRadius: 8 }} />
          <div style={{ position: "absolute", bottom: 30, left: 28, width: 62, height: 38, backgroundColor: "#fde047", border: "4px solid #ca8a04", borderRadius: 8 }} />
        </div>

        {/* Sandy Earth Ground (strictly bottom 0 to height 28%) */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "28%",
            backgroundColor: "#854d0e",
            backgroundImage: "linear-gradient(180deg, #a16207 0%, #713f12 100%)",
            borderTop: "10px solid #54330c",
            zIndex: 2,
          }}
        />
      </AbsoluteFill>
    );
  }

  // =========================================================================
  // 4. SUNSET SEA SIEGE (Ground level: 28%)
  // Coastal rampart looking out to crimson sunset sea and warships
  // =========================================================================
  if (scene === "sunset_sea_siege") {
    return (
      <AbsoluteFill style={{ backgroundColor: "#7c2d12", overflow: "hidden" }}>
        {/* Dramatic Crimson Sunset Sky */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "72%",
            background: "linear-gradient(180deg, #451a03 0%, #9a3412 30%, #ea580c 65%, #fed7aa 100%)",
          }}
        >
          {/* Sinking Red Sun */}
          <div
            style={{
              position: "absolute",
              top: "16%",
              left: "22%",
              width: 150,
              height: 150,
              borderRadius: "50%",
              backgroundColor: "#c2410c",
              boxShadow: "0 0 90px rgba(194, 65, 12, 0.8)",
            }}
          />
        </div>

        {/* Sunset Ocean Surface */}
        <div
          style={{
            position: "absolute",
            bottom: "28%",
            left: 0,
            right: 0,
            height: "22%",
            backgroundColor: "#7c2d12",
            backgroundImage: "linear-gradient(180deg, #9a3412 0%, #431407 100%)",
            borderTop: "4px solid #ea580c",
            zIndex: 1,
          }}
        />

        {/* Coastal Fortress Stone Ledge / Rampart (strictly bottom 0 to height 28%) */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "28%",
            backgroundColor: "#431407",
            backgroundImage: "linear-gradient(180deg, #57200a 0%, #290e03 100%)",
            borderTop: "10px solid #7c2d12",
            boxShadow: "0 -10px 30px rgba(0,0,0,0.4)",
            zIndex: 3,
          }}
        >
          {/* Rampart Flagstone Pattern */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.2,
              backgroundImage:
                "repeating-linear-gradient(90deg, #7c2d12 0px, #7c2d12 3px, transparent 3px, transparent 150px)",
            }}
          />
        </div>
      </AbsoluteFill>
    );
  }

  // =========================================================================
  // 5. CANNON SIEGE BATTLE
  // Left: Buton Bastion Wall (height: 1040px) | Right: Battlefield Ground (height: 520px)
  // =========================================================================
  if (scene === "cannon_battle") {
    return (
      <AbsoluteFill style={{ backgroundColor: "#290e02", overflow: "hidden" }}>
        {/* Smoky Battle Sky */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 520,
            background: "linear-gradient(180deg, #1c1917 0%, #451a03 35%, #9a3412 75%, #ea580c 100%)",
          }}
        />

        {/* Lower Battlefield Ground on Right (strictly bottom 0 to height 520px) */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: "60%",
            height: 520,
            backgroundColor: "#1c1917",
            backgroundImage: "linear-gradient(180deg, #451a03 0%, #1c1917 100%)",
            borderTop: "10px solid #78350f",
            zIndex: 1,
          }}
        />

        {/* Dutch Colonial Cannon - resting FIRMLY on the battlefield ground at bottom: 520px */}
        <div
          style={{
            position: "absolute",
            bottom: 520,
            right: 60,
            width: 260,
            height: 120,
            zIndex: 3,
          }}
        >
          {/* Cannon Barrel pointing up-left towards the fortress */}
          <div
            style={{
              position: "absolute",
              bottom: 30,
              left: 10,
              width: 220,
              height: 62,
              backgroundColor: "#0f172a",
              borderRadius: "24px 8px 8px 24px",
              transform: "rotate(16deg)",
              border: "5px solid #3f3f46",
              boxShadow: "0 6px 16px rgba(0,0,0,0.5)",
            }}
          />
          {/* Wooden Wheel touching the ground line */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 90,
              width: 90,
              height: 90,
              borderRadius: "50%",
              backgroundColor: "#78350f",
              border: "8px solid #451a03",
              boxShadow: "0 8px 18px rgba(0,0,0,0.6)",
            }}
          />
        </div>

        {/* LEFT FORTRESS: Massive Limestone Bastion Wall (height: 1040px) */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: 460,
            height: 1040,
            backgroundColor: "#fefae0",
            borderRight: "14px solid #ca8a04",
            borderTop: "14px solid #ca8a04",
            boxShadow: "20px 0 50px rgba(0,0,0,0.6)",
            zIndex: 2,
          }}
        >
          {/* Merlons / Battlements on Top of Bastion */}
          <div style={{ position: "absolute", top: -45, left: 20, display: "flex", gap: 24 }}>
            <div style={{ width: 95, height: 45, backgroundColor: "#fefae0", border: "8px solid #ca8a04", borderBottom: "none", borderRadius: "6px 6px 0 0" }} />
            <div style={{ width: 95, height: 45, backgroundColor: "#fefae0", border: "8px solid #ca8a04", borderBottom: "none", borderRadius: "6px 6px 0 0" }} />
          </div>

          {/* Limestone Block Lines */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.22,
              backgroundImage:
                "repeating-linear-gradient(0deg, #ca8a04 0px, #ca8a04 2px, transparent 2px, transparent 75px), repeating-linear-gradient(90deg, #ca8a04 0px, #ca8a04 2px, transparent 2px, transparent 120px)",
            }}
          />

          {/* Cannonball Impact Point (Dent on the rock wall) */}
          <div
            style={{
              position: "absolute",
              top: 80,
              right: 25,
              width: 55,
              height: 55,
              borderRadius: "50%",
              backgroundColor: "#ca8a04",
              border: "6px solid #854d0e",
              boxShadow: "inset 0 0 16px rgba(0,0,0,0.6)",
            }}
          />
        </div>

        {/* Bastion Walking Terrace Floor (where defender stands at bottom: 1040px) */}
        <div
          style={{
            position: "absolute",
            bottom: 1040,
            left: 0,
            width: 460,
            height: 90,
            backgroundColor: "#e8dcce",
            borderTop: "8px solid #ca8a04",
            borderRight: "12px solid #ca8a04",
            zIndex: 1,
          }}
        />
      </AbsoluteFill>
    );
  }

  // =========================================================================
  // 6. TRIUMPH GUINNESS (Ground level: 28%)
  // Glorious sunny royal terrace of Benteng Buton with Indonesian flag
  // =========================================================================
  if (scene === "triumph_guinness") {
    return (
      <AbsoluteFill style={{ backgroundColor: "#fef8ee", overflow: "hidden" }}>
        {/* Radiant Sunny Sky */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "72%",
            background: "linear-gradient(180deg, #38bdf8 0%, #7dd3fc 40%, #fef08a 80%, #fed7aa 100%)",
          }}
        >
          {/* Golden Sunburst */}
          <div
            style={{
              position: "absolute",
              top: "6%",
              right: "15%",
              width: 160,
              height: 160,
              borderRadius: "50%",
              backgroundColor: "#ffffff",
              boxShadow: "0 0 90px rgba(254, 240, 138, 0.95)",
            }}
          />
        </div>

        {/* Guinness World Records Plaque Card (Top Safe Zone Y: 12%) */}
        <div
          style={{
            position: "absolute",
            top: "12%",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#ffffff",
            border: "8px solid #ca8a04",
            borderRadius: 22,
            padding: "16px 36px",
            boxShadow: "0 16px 40px rgba(202, 138, 4, 0.25)",
            textAlign: "center",
            zIndex: 10,
            whiteSpace: "nowrap",
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 900, color: "#854d0e", letterSpacing: 3, textTransform: "uppercase", fontFamily: "Poppins, sans-serif" }}>
            GUINNESS WORLD RECORDS
          </div>
          <div style={{ fontSize: 36, fontWeight: 900, color: "#ca8a04", marginTop: 4, fontFamily: "Poppins, sans-serif" }}>
            BENTENG TERLUAS DI DUNIA
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#57534e", marginTop: 4 }}>
            Luas 23,3 Hektar • Tak Pernah Tertembus
          </div>
        </div>

        {/* Tropical Sea and Green Islands Horizon */}
        <div style={{ position: "absolute", bottom: "38%", left: 0, right: 0, height: "14%", backgroundColor: "#0284c7", opacity: 0.85 }} />
        <div style={{ position: "absolute", bottom: "34%", left: 0, right: 0, height: "12%", backgroundColor: "#16a34a", borderRadius: "50% 50% 0 0 / 40px 40px 0 0" }} />

        {/* Low Balustrade Wall along back of Terrace */}
        <div
          style={{
            position: "absolute",
            bottom: "28%",
            left: 0,
            right: 0,
            height: 120,
            backgroundColor: "#fefae0",
            borderTop: "10px solid #ca8a04",
            boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
            zIndex: 2,
          }}
        >
          {/* Merlons on Sides */}
          <div style={{ position: "absolute", top: -35, left: 40, display: "flex", gap: 30 }}>
            <div style={{ width: 90, height: 35, backgroundColor: "#fefae0", border: "6px solid #ca8a04", borderBottom: "none", borderRadius: "6px 6px 0 0" }} />
            <div style={{ width: 90, height: 35, backgroundColor: "#fefae0", border: "6px solid #ca8a04", borderBottom: "none", borderRadius: "6px 6px 0 0" }} />
          </div>

          {/* Flag Pole with Merah Putih waving */}
          <div style={{ position: "absolute", top: -210, right: 180, width: 12, height: 250, backgroundColor: "#57534e", zIndex: 4 }}>
            <div style={{ position: "absolute", top: 0, left: 12, width: 130, height: 80, boxShadow: "0 6px 16px rgba(0,0,0,0.25)" }}>
              <div style={{ width: "100%", height: "50%", backgroundColor: "#dc2626" }} />
              <div style={{ width: "100%", height: "50%", backgroundColor: "#ffffff" }} />
            </div>
          </div>
        </div>

        {/* Royal Terrace Floor Platform (strictly bottom 0 to height 28%) */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "28%",
            backgroundColor: "#fefae0",
            borderTop: "12px solid #ca8a04",
            boxShadow: "0 -12px 35px rgba(0,0,0,0.12)",
            zIndex: 3,
          }}
        >
          {/* Floor Paving */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.2,
              backgroundImage:
                "repeating-linear-gradient(90deg, #ca8a04 0px, #ca8a04 3px, transparent 3px, transparent 140px)",
            }}
          />
        </div>
      </AbsoluteFill>
    );
  }

  return null;
};
