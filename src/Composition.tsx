import React, { useEffect, useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  Series,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";

// ============================================================================
// KONFIGURASI VIDEO SHORTS / TIKTOK (9:16)
// ============================================================================
export const DURATION_IN_FRAMES = 2060; // 68.66 detik sinkron penuh audio
export const VIDEO_FPS = 30;
export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;

// Durasi eksak 8 adegan sequence selaras audio narasi
export const SCENE_DURATIONS = {
  SCENE_1: 154, // 0 - 154: Anyam bambu gedek di pekarangan
  SCENE_2: 151, // 154 - 305: Hujan, rembesan, & bambu lapuk
  SCENE_3: 100, // 305 - 405: Cetak tanah liat jadi bata basah
  SCENE_4: 81,  // 405 - 486: Tungku pembakaran sampai keras
  SCENE_5: 532, // 486 - 1018: Tembok tumpuk lurus & runtuh terbelah
  SCENE_6: 314, // 1018 - 1332: Susun selang-seling Lego & beban menyebar
  SCENE_7: 381, // 1332 - 1713: Tembok goyang & perakitan bingkai beton
  SCENE_8: 347, // 1713 - 2060: Plester, acian, rumah kokoh & CTA
};

// ============================================================================
// TIMELINE SUBTITLE DARI AUDIO NARASI id-ID-GadisNeural
// ============================================================================
interface SubtitleSegment {
  startFrame: number;
  endFrame: number;
  tag: string;
  text: string;
}

const SUBTITLE_TIMELINE: SubtitleSegment[] = [
  {
    startFrame: 3,
    endFrame: 154,
    tag: "1. ANYAMAN BAMBU (GEDEK)",
    text: "Kalau kamu anyam bambu jadi dinding, kamu udah punya gedek.",
  },
  {
    startFrame: 154,
    endFrame: 305,
    tag: "2. ANGIN & AIR HUJAN TEMBUS",
    text: "Tapi angin dan air hujan tembus, lama-lama bambunya lapuk.",
  },
  {
    startFrame: 305,
    endFrame: 405,
    tag: "3. CETAK BATA TANAH LIAT",
    text: "Jadi kamu cetak tanah liat jadi bata...",
  },
  {
    startFrame: 405,
    endFrame: 486,
    tag: "4. PEMBAKARAN SAMPAI KERAS",
    text: "...terus dibakar sampai keras.",
  },
  {
    startFrame: 486,
    endFrame: 627,
    tag: "5. TUMPUK BATA & SEMEN",
    text: "Batanya kamu tumpuk direkatkan pakai adukan semen.",
  },
  {
    startFrame: 627,
    endFrame: 710,
    tag: "5. PUNYA TEMBOK",
    text: "Sekarang kamu punya tembok.",
  },
  {
    startFrame: 710,
    endFrame: 882,
    tag: "5. SAMBUNGAN SEGARIS",
    text: "Tapi kalau batanya ditumpuk lurus, sambungannya jadi segaris.",
  },
  {
    startFrame: 882,
    endFrame: 1018,
    tag: "5. TEMBOK TERBELAH DUA!",
    text: "Dikasih beban sedikit, temboknya langsung terbelah!",
  },
  {
    startFrame: 1018,
    endFrame: 1161,
    tag: "6. SUSUNAN SELANG-SELING LEGO",
    text: "Jadi batanya kamu susun selang-seling kayak main Lego.",
  },
  {
    startFrame: 1161,
    endFrame: 1332,
    tag: "6. DISTRIBUSI GAYA 45°",
    text: "Sambungannya gak segaris lagi, bebannya menyebar ke bata sebelahnya.",
  },
  {
    startFrame: 1332,
    endFrame: 1450,
    tag: "7. TEMBOK MUDAH GOYANG",
    text: "Tapi tembok yang berdiri sendiri gampang goyang.",
  },
  {
    startFrame: 1450,
    endFrame: 1713,
    tag: "7. BINGKAI BETON BERTULANG",
    text: "Makanya kamu beri bingkai beton: slof di bawah, kolom praktis di tiap sudut, dan ring balok di atas.",
  },
  {
    startFrame: 1713,
    endFrame: 1897,
    tag: "8. PLESTER & ACIAN",
    text: "Biar rapi dan gak rembes, ditutup plester lalu dihaluskan pakai acian.",
  },
  {
    startFrame: 1897,
    endFrame: 2060,
    tag: "8. RUMAH KOKOH & KEDAP AIR",
    text: "Selamat, kamu baru saja paham dasar konstruksi dinding rumah!",
  },
];

// Helper bobot durasi per kata dan jeda intonasi koma/tanda baca (Anti-Balap Audio)
const getWordWeight = (word: string): number => {
  const clean = word.replace(/[^a-zA-Z0-9]/g, "");
  let weight = Math.max(3, clean.length);
  if (word.includes(",")) weight += 8;
  if (word.includes(":") || word.includes(";")) weight += 8;
  if (word.includes(".") || word.includes("!")) weight += 12;
  return weight;
};

// Helper interpolasi warna RGB mulus
const interpolateColor = (
  val: number,
  input: [number, number],
  c1: [number, number, number],
  c2: [number, number, number]
): string => {
  const t = interpolate(val, input, [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const r = Math.round(c1[0] + (c2[0] - c1[0]) * t);
  const g = Math.round(c1[1] + (c2[1] - c1[1]) * t);
  const b = Math.round(c1[2] + (c2[2] - c1[2]) * t);
  return `rgb(${r}, ${g}, ${b})`;
};

// ============================================================================
// KOMPONEN KAMERA SINEMATIK THREE.JS
// ============================================================================
const CameraController: React.FC<{
  position: [number, number, number];
  target?: [number, number, number];
}> = ({ position, target = [0, 1.2, 0] }) => {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(...position);
    camera.lookAt(...target);
  }, [camera, position, target]);

  return null;
};

// ============================================================================
// PENCAHAYAAN OUTDOOR DAYLIGHT THREE.JS
// ============================================================================
const OutdoorDaylight: React.FC<{
  sunColor?: string;
  sunIntensity?: number;
  skyLightColor?: string;
  ambientIntensity?: number;
}> = ({
  sunColor = "#fff7ed",
  sunIntensity = 1.6,
  skyLightColor = "#bae6fd",
  ambientIntensity = 0.65,
}) => {
  return (
    <>
      <ambientLight color={skyLightColor} intensity={ambientIntensity} />
      <directionalLight
        position={[6, 12, 6]}
        intensity={sunIntensity}
        color={sunColor}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight
        position={[-6, 6, -4]}
        intensity={0.35}
        color="#93c5fd"
      />
    </>
  );
};

// ============================================================================
// ELEMEN ALAM DUNIA NYATA (POHON PISANG & RUMPUN BAMBU)
// ============================================================================
const BananaTree: React.FC<{
  position: [number, number, number];
  frame: number;
  scale?: number;
}> = ({ position, frame, scale = 1 }) => {
  const sway = Math.sin(frame * 0.07) * 0.05;

  return (
    <group position={position} scale={[scale, scale, scale]} rotation={[0, 0, sway]}>
      {/* Batang pisang berlapis pelepah */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.26, 2.8, 8]} />
        <meshStandardMaterial color="#4d7c0f" roughness={0.7} />
      </mesh>
      {/* 5 Helai Pelepah Daun Melengkung */}
      {[0, 72, 144, 216, 288].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const leafSway = Math.sin(frame * 0.08 + i * 1.2) * 0.06;
        return (
          <group
            key={i}
            position={[0, 2.6, 0]}
            rotation={[0.35 + leafSway, rad, -0.45]}
          >
            <mesh position={[0.7, 0, 0]} rotation={[0, 0, -0.3]} castShadow>
              <boxGeometry args={[1.5, 0.04, 0.42]} />
              <meshStandardMaterial color="#65a30d" roughness={0.6} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

const BambooClump: React.FC<{
  position: [number, number, number];
  frame: number;
}> = ({ position, frame }) => {
  return (
    <group position={position}>
      {[-0.4, -0.15, 0.15, 0.4].map((xOffset, i) => {
        const sway = Math.sin(frame * 0.09 + i * 1.1) * 0.04;
        const height = 4.2 + (i % 2) * 0.6;
        return (
          <group key={i} position={[xOffset, 0, (i % 3) * 0.15]} rotation={[0, 0, sway]}>
            <mesh position={[0, height / 2, 0]} castShadow>
              <cylinderGeometry args={[0.07, 0.09, height, 8]} />
              <meshStandardMaterial color="#84cc16" roughness={0.5} />
            </mesh>
            {/* Ruas-ruas bambu */}
            {[1, 2, 3, 4].map((nodeIdx) => (
              <mesh key={nodeIdx} position={[0, nodeIdx * 0.9, 0]}>
                <cylinderGeometry args={[0.078, 0.078, 0.04, 8]} />
                <meshStandardMaterial color="#4d7c0f" roughness={0.6} />
              </mesh>
            ))}
          </group>
        );
      })}
    </group>
  );
};

// ============================================================================
// KARAKTER PEKERJA BERTOPAI CAPING (CLAY / COMIC STYLE)
// ============================================================================
const ClayWorker: React.FC<{
  position: [number, number, number];
  mode: "weaving" | "molding";
  frame: number;
}> = ({ position, mode, frame }) => {
  const armSway = Math.sin(frame * 0.22) * 0.35;
  const isMolding = mode === "molding";
  const moldLiftY = interpolate(frame, [35, 75], [0.2, 1.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const spineBend = isMolding
    ? interpolate(frame, [0, 35, 75], [0.35, 0.35, 0.05], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0.15;

  return (
    <group position={position}>
      {/* Topi Caping Kerucut Tradisional */}
      <mesh
        position={[0, 1.45 - spineBend * 0.3, spineBend * 0.4]}
        rotation={[spineBend, 0, 0]}
        castShadow
      >
        <coneGeometry args={[0.55, 0.32, 16]} />
        <meshStandardMaterial color="#d97706" roughness={0.65} />
      </mesh>

      {/* Kepala Bulat */}
      <mesh
        position={[0, 1.25 - spineBend * 0.3, spineBend * 0.35]}
        castShadow
      >
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.7} />
      </mesh>

      {/* Tubuh / Kemeja Biru Karakter */}
      <mesh
        position={[0, 0.85 - spineBend * 0.2, spineBend * 0.2]}
        rotation={[spineBend, 0, 0]}
        castShadow
      >
        <cylinderGeometry args={[0.22, 0.28, 0.65, 12]} />
        <meshStandardMaterial color="#0284c7" roughness={0.7} />
      </mesh>

      {mode === "weaving" ? (
        <>
          {/* Kaki Berlutut di Tanah */}
          <mesh position={[-0.16, 0.22, -0.1]} castShadow>
            <boxGeometry args={[0.16, 0.38, 0.48]} />
            <meshStandardMaterial color="#1e293b" roughness={0.8} />
          </mesh>
          <mesh position={[0.16, 0.22, -0.1]} castShadow>
            <boxGeometry args={[0.16, 0.38, 0.48]} />
            <meshStandardMaterial color="#1e293b" roughness={0.8} />
          </mesh>

          {/* Lengan Menganyam Bambu Ritmis Bolak-Balik */}
          <group
            position={[0.25, 0.95, 0.1]}
            rotation={[0.6 + armSway, 0, -0.2]}
          >
            <mesh position={[0, -0.28, 0.15]} castShadow>
              <cylinderGeometry args={[0.07, 0.07, 0.55, 8]} />
              <meshStandardMaterial color="#0284c7" roughness={0.7} />
            </mesh>
            {/* Tangan Memegang Bilah Bambu Baru */}
            <mesh position={[0, -0.55, 0.28]} castShadow>
              <sphereGeometry args={[0.09, 8, 8]} />
              <meshStandardMaterial color="#f59e0b" roughness={0.7} />
            </mesh>
            {/* Bilah Bambu yang Diselipkan */}
            <mesh position={[-0.2, -0.55, 0.45]} rotation={[0.2, 0.5, 0.4]} castShadow>
              <boxGeometry args={[0.04, 0.03, 1.2]} />
              <meshStandardMaterial color="#fbbf24" roughness={0.4} />
            </mesh>
          </group>

          {/* Lengan Kiri Menahan Lembaran Gedek */}
          <group position={[-0.25, 0.95, 0.1]} rotation={[0.8, 0, 0.3]}>
            <mesh position={[0, -0.28, 0.12]} castShadow>
              <cylinderGeometry args={[0.07, 0.07, 0.55, 8]} />
              <meshStandardMaterial color="#0284c7" roughness={0.7} />
            </mesh>
            <mesh position={[0, -0.52, 0.22]} castShadow>
              <sphereGeometry args={[0.09, 8, 8]} />
              <meshStandardMaterial color="#f59e0b" roughness={0.7} />
            </mesh>
          </group>
        </>
      ) : (
        <>
          {/* Posisi Berdiri Menekuk Kaki untuk Mencetak Bata */}
          <mesh position={[-0.18, 0.35, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.11, 0.7, 8]} />
            <meshStandardMaterial color="#1e293b" roughness={0.8} />
          </mesh>
          <mesh position={[0.18, 0.35, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.11, 0.7, 8]} />
            <meshStandardMaterial color="#1e293b" roughness={0.8} />
          </mesh>

          {/* Dua Lengan Memegang & Mengangkat Cetakan Kayu Ganda */}
          <group position={[0, moldLiftY, 0.65]}>
            {/* Cetakan Kayu Ganda */}
            <mesh castShadow>
              <boxGeometry args={[1.1, 0.24, 0.58]} />
              <meshStandardMaterial color="#b45309" roughness={0.6} />
            </mesh>
            <mesh position={[0, 0.02, 0]}>
              <boxGeometry args={[0.06, 0.26, 0.56]} />
              <meshStandardMaterial color="#78350f" roughness={0.8} />
            </mesh>
          </group>
        </>
      )}
    </group>
  );
};

// ============================================================================
// SCENE 1: KEGIATAN MENGANYAM BAMBU DI PEKARANGAN
// ============================================================================
const Scene1Weaving: React.FC = () => {
  const frame = useCurrentFrame();

  // Kamera slow push-in diagonal
  const camPos: [number, number, number] = [
    interpolate(frame, [0, 154], [2.6, 2.0]),
    interpolate(frame, [0, 154], [2.7, 2.2]),
    interpolate(frame, [0, 154], [4.4, 3.6]),
  ];

  return (
    <ThreeCanvas
      width={VIDEO_WIDTH}
      height={VIDEO_HEIGHT}
      style={{ width: "100%", height: "100%" }}
    >
      <CameraController position={camPos} target={[0, 0.6, 0]} />
      <OutdoorDaylight />

      {/* Tanah Pekarangan Hijau & Jalan Tanah */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[24, 24]} />
        <meshStandardMaterial color="#4d7c0f" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[4.5, 7]} />
        <meshStandardMaterial color="#78350f" roughness={0.95} />
      </mesh>

      {/* Latar Rumpun Bambu & Pohon Pisang */}
      <BambooClump position={[2.8, 0, -2.4]} frame={frame} />
      <BananaTree position={[-2.8, 0, -2.0]} frame={frame} scale={1.1} />

      {/* Tumpukan Batang Bambu Utuh di Tanah */}
      <group position={[1.5, 0.08, 0.3]} rotation={[0, 0.35, 0]}>
        {[0, 0.16, 0.32].map((yOffset, i) => (
          <mesh
            key={i}
            position={[(i % 2) * 0.1, yOffset, (i % 2) * 0.08]}
            rotation={[Math.PI / 2, 0, 0]}
            castShadow
          >
            <cylinderGeometry args={[0.08, 0.08, 2.8, 12]} />
            <meshStandardMaterial color="#65a30d" roughness={0.6} />
          </mesh>
        ))}
      </group>

      {/* Lembaran Anyaman Gedek di Tanah */}
      <group position={[-0.1, 0.02, 0.45]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh receiveShadow>
          <planeGeometry args={[1.8, 1.4]} />
          <meshStandardMaterial color="#d97706" roughness={0.7} />
        </mesh>
        {/* Garis-garis bilah silang anyaman */}
        {[-0.6, -0.3, 0, 0.3, 0.6].map((x, i) => (
          <mesh key={i} position={[x, 0, 0.005]}>
            <planeGeometry args={[0.04, 1.38]} />
            <meshStandardMaterial color="#92400e" roughness={0.6} />
          </mesh>
        ))}
        {[-0.5, -0.25, 0, 0.25, 0.5].map((y, i) => (
          <mesh key={i} position={[0, y, 0.006]}>
            <planeGeometry args={[1.78, 0.04]} />
            <meshStandardMaterial color="#b45309" roughness={0.6} />
          </mesh>
        ))}
      </group>

      {/* Karakter Penganyam Bambu */}
      <ClayWorker position={[-0.1, 0, -0.1]} mode="weaving" frame={frame} />
    </ThreeCanvas>
  );
};

// ============================================================================
// SCENE 2: HUJAN, REMBESAN, & BAMBU LAPUK
// ============================================================================
const Scene2RottedBamboo: React.FC = () => {
  const frame = useCurrentFrame();

  // Kamera close-up dramatis pada bagian bawah dinding & pondasi tanah
  const camPos: [number, number, number] = [
    interpolate(frame, [0, 151], [2.4, 1.8]),
    interpolate(frame, [0, 151], [1.8, 1.3]),
    interpolate(frame, [0, 151], [3.8, 2.9]),
  ];

  // Partikel air hujan jatuh miring tertiup angin
  const rainDrops = useMemo(() => {
    return Array.from({ length: 45 }).map((_, i) => ({
      x: ((i * 17) % 30) * 0.2 - 3,
      z: ((i * 23) % 20) * 0.2 - 1,
      speed: 0.45 + ((i % 5) * 0.05),
      offset: i * 0.35,
    }));
  }, []);

  // Warna dinding bambu bagian bawah berubah dari kuning bambu ke abu-abu kehitaman lapuk
  const rottedColor = interpolateColor(
    frame,
    [15, 120],
    [217, 119, 6],
    [38, 35, 33]
  );

  return (
    <ThreeCanvas
      width={VIDEO_WIDTH}
      height={VIDEO_HEIGHT}
      style={{ width: "100%", height: "100%" }}
    >
      <CameraController position={camPos} target={[0, 0.5, 0]} />
      {/* Pencahayaan mendung sejuk & hujan */}
      <OutdoorDaylight
        skyLightColor="#94a3b8"
        sunColor="#cbd5e1"
        sunIntensity={0.8}
        ambientIntensity={0.5}
      />

      {/* Cutaway Lapisan Tanah Basah & Pondasi Batu */}
      <mesh position={[0, -0.3, 0]} receiveShadow>
        <boxGeometry args={[8, 0.6, 6]} />
        <meshStandardMaterial color="#451a03" roughness={0.95} />
      </mesh>
      {/* Bebatuan Pondasi Kasar di Bawah Dinding */}
      {[-1.2, -0.6, 0, 0.6, 1.2].map((x, i) => (
        <mesh key={i} position={[x, 0.08, -0.05]} castShadow>
          <boxGeometry args={[0.42, 0.18, 0.35]} />
          <meshStandardMaterial color="#64748b" roughness={0.9} />
        </mesh>
      ))}

      {/* Dinding Samping Anyaman Bambu (Cutaway) */}
      <group position={[0, 1.35, 0]}>
        {/* Bagian Atas Dinding (Masih Kering) */}
        <mesh position={[0, 0.6, 0]} castShadow>
          <boxGeometry args={[3.2, 1.4, 0.12]} />
          <meshStandardMaterial color="#d97706" roughness={0.7} />
        </mesh>

        {/* Bagian Bawah Dinding yang Kena Air & Lapuk */}
        <mesh position={[0, -0.4, 0]} castShadow>
          <boxGeometry args={[3.2, 0.8, 0.12]} />
          <meshStandardMaterial color={rottedColor} roughness={0.9} />
        </mesh>

        {/* Lubang-lubang dan bilah bambu compang-camping */}
        {[-0.8, -0.2, 0.4, 0.9].map((holeX, i) => {
          const holeScale = interpolate(frame, [30, 120], [0.2, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <group key={i} position={[holeX, -0.55 + (i % 2) * 0.15, 0.07]}>
              <mesh scale={[holeScale, holeScale, 1]}>
                <boxGeometry args={[0.28, 0.18, 0.04]} />
                <meshStandardMaterial color="#1c1917" roughness={1.0} />
              </mesh>
              {/* Bilah bambu putus yang rontok ke tanah */}
              <mesh
                position={[0.08, -0.45, 0.15]}
                rotation={[0.5, 0.3, (i - 1.5) * 0.4]}
                castShadow
              >
                <boxGeometry args={[0.04, 0.02, 0.45]} />
                <meshStandardMaterial color="#292524" roughness={0.9} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Partikel Air Hujan Miring */}
      {rainDrops.map((drop, i) => {
        const y = 5.0 - (((frame * drop.speed + drop.offset * 10) % 5.5));
        const x = drop.x - frame * 0.04;
        return (
          <mesh
            key={i}
            position={[x, y, drop.z]}
            rotation={[0, 0, 0.28]}
          >
            <cylinderGeometry args={[0.012, 0.012, 0.35, 4]} />
            <meshStandardMaterial
              color="#e0f2fe"
              transparent
              opacity={0.75}
              roughness={0.1}
            />
          </mesh>
        );
      })}
    </ThreeCanvas>
  );
};

// ============================================================================
// SCENE 3: PABRIK BATA TRADISIONAL - PENCETAKAN
// ============================================================================
const Scene3ClayMolding: React.FC = () => {
  const frame = useCurrentFrame();

  const camPos: [number, number, number] = [
    interpolate(frame, [0, 100], [3.2, 2.7]),
    interpolate(frame, [0, 100], [2.2, 2.0]),
    interpolate(frame, [0, 100], [4.2, 3.6]),
  ];

  const brickVisible = frame >= 35;

  return (
    <ThreeCanvas
      width={VIDEO_WIDTH}
      height={VIDEO_HEIGHT}
      style={{ width: "100%", height: "100%" }}
    >
      <CameraController position={camPos} target={[0, 0.7, 0]} />
      <OutdoorDaylight sunColor="#ffedd5" sunIntensity={1.7} />

      {/* Tanah Liat Basah Galian */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[24, 24]} />
        <meshStandardMaterial color="#5c2e0b" roughness={0.9} />
      </mesh>

      {/* Gundukan Tanah Merah / Liat */}
      <mesh position={[-2.2, 0.4, -0.8]} castShadow receiveShadow>
        <sphereGeometry args={[1.1, 16, 12]} />
        <meshStandardMaterial color="#78350f" roughness={0.95} />
      </mesh>

      {/* Cangkul Tertancap di Gundukan */}
      <group position={[-1.7, 0.7, -0.5]} rotation={[0.4, 0.3, -0.6]}>
        <mesh position={[0, 0.8, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 1.8, 8]} />
          <meshStandardMaterial color="#b45309" roughness={0.7} />
        </mesh>
        {/* Mata Cangkul Besi */}
        <mesh position={[0, -0.05, 0.12]} rotation={[0.6, 0, 0]} castShadow>
          <boxGeometry args={[0.26, 0.03, 0.34]} />
          <meshStandardMaterial color="#475569" roughness={0.5} metalness={0.6} />
        </mesh>
      </group>

      {/* Barisan Bata Mentah Basah yang Sudah Dijemur */}
      {[0, 1, 2].map((row) =>
        [-0.4, 0.4].map((col, colIdx) => (
          <mesh
            key={`${row}-${colIdx}`}
            position={[1.6 + col * 0.6, 0.08, -1.2 + row * 0.55]}
            castShadow
          >
            <boxGeometry args={[0.5, 0.16, 0.26]} />
            <meshStandardMaterial color="#78350f" roughness={0.85} />
          </mesh>
        ))
      )}

      {/* 2 Bata Baru yang Tertinggal di Tanah Setelah Cetakan Diangkat */}
      {brickVisible && (
        <group position={[0, 0.08, 0.65]}>
          <mesh position={[-0.26, 0, 0]} castShadow>
            <boxGeometry args={[0.48, 0.16, 0.26]} />
            <meshStandardMaterial color="#5c2e0b" roughness={0.9} />
          </mesh>
          <mesh position={[0.26, 0, 0]} castShadow>
            <boxGeometry args={[0.48, 0.16, 0.26]} />
            <meshStandardMaterial color="#5c2e0b" roughness={0.9} />
          </mesh>
        </group>
      )}

      {/* Karakter Pekerja Mengangkat Cetakan Kayu Ganda */}
      <ClayWorker position={[0, 0, 0]} mode="molding" frame={frame} />
    </ThreeCanvas>
  );
};

// ============================================================================
// SCENE 4: TUNGKU PEMBAKARAN BATA MERAH (OPEN KILN)
// ============================================================================
const Scene4BrickKiln: React.FC = () => {
  const frame = useCurrentFrame();

  const camPos: [number, number, number] = [
    interpolate(frame, [0, 81], [3.2, 2.6]),
    interpolate(frame, [0, 81], [2.1, 1.8]),
    interpolate(frame, [0, 81], [4.2, 3.5]),
  ];

  // Efek nyala api berkedip dinamis (flicker)
  const flameFlicker =
    1.0 + 0.2 * Math.sin(frame * 0.6) + 0.14 * Math.cos(frame * 0.9);

  // Transisi warna bata dari cokelat tanah liat mentah ke merah bata matang
  const firedBrickColor = interpolateColor(
    frame,
    [10, 70],
    [120, 53, 15],
    [234, 88, 12]
  );

  return (
    <ThreeCanvas
      width={VIDEO_WIDTH}
      height={VIDEO_HEIGHT}
      style={{ width: "100%", height: "100%" }}
    >
      <CameraController position={camPos} target={[0, 1.2, 0]} />
      <OutdoorDaylight sunColor="#fed7aa" sunIntensity={1.3} />

      {/* Cahaya Pendar Bara Api di Mulut Tungku */}
      <pointLight
        position={[0, 0.6, 1.1]}
        color="#ff6600"
        intensity={2.4 * flameFlicker}
        distance={6}
      />

      {/* Lantai Tanah Bakaran / Perapian */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#44403c" roughness={0.9} />
      </mesh>

      {/* Bangunan Tungku Tradisional Bata Besar */}
      <group position={[0, 1.1, 0]}>
        {/* Kubah / Badan Tungku Bata */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.8, 2.2, 2.4]} />
          <meshStandardMaterial color={firedBrickColor} roughness={0.8} />
        </mesh>

        {/* Cerobong Asap Atas */}
        <mesh position={[0, 1.45, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.38, 0.8, 12]} />
          <meshStandardMaterial color="#292524" roughness={0.85} />
        </mesh>

        {/* Mulut Rongga Tungku Bawah */}
        <mesh position={[0, -0.65, 1.18]}>
          <boxGeometry args={[1.2, 0.9, 0.4]} />
          <meshStandardMaterial color="#0c0a09" roughness={1.0} />
        </mesh>

        {/* Kobaran Api Merah-Oranye Berkedip di Mulut Tungku */}
        <group position={[0, -0.7, 1.1]} scale={[flameFlicker, flameFlicker, flameFlicker]}>
          <mesh position={[0, 0.15, 0]}>
            <coneGeometry args={[0.42, 0.7, 12]} />
            <meshStandardMaterial
              color="#f97316"
              emissive="#ea580c"
              emissiveIntensity={1.5}
            />
          </mesh>
          <mesh position={[0, 0.1, 0.05]}>
            <coneGeometry args={[0.26, 0.5, 10]} />
            <meshStandardMaterial
              color="#facc15"
              emissive="#eab308"
              emissiveIntensity={2.0}
            />
          </mesh>
        </group>

        {/* Partikel Bara Api Melayang Keluar */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const emberY = -0.5 + (((frame * 0.04 + i * 0.25) % 1.6));
          const emberX = Math.sin(frame * 0.15 + i) * 0.35;
          return (
            <mesh key={i} position={[emberX, emberY, 1.25]}>
              <sphereGeometry args={[0.035, 6, 6]} />
              <meshStandardMaterial
                color="#facc15"
                emissive="#f97316"
                emissiveIntensity={3}
              />
            </mesh>
          );
        })}

        {/* Kepulan Partikel Asap Tipis Membubung dari Cerobong */}
        {[0, 1, 2, 3, 4].map((i) => {
          const smokeY = 1.9 + (((frame * 0.05 + i * 0.35) % 2.5));
          const smokeScale = 0.2 + (smokeY - 1.9) * 0.22;
          const smokeX = Math.sin(frame * 0.08 + i) * 0.2;
          return (
            <mesh key={i} position={[smokeX, smokeY, 0]} scale={[smokeScale, smokeScale, smokeScale]}>
              <sphereGeometry args={[0.28, 8, 8]} />
              <meshStandardMaterial
                color="#78716c"
                transparent
                opacity={0.45}
                roughness={0.9}
              />
            </mesh>
          );
        })}
      </group>
    </ThreeCanvas>
  );
};

// ============================================================================
// SCENE 5: PERAKITAN TEMBOK LURUS & RUNTUH TERBELAH
// ============================================================================
const Scene5StraightWallCollapse: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Kamera dengan guncangan dinamis saat retak di frame 405-470
  const isCracking = frame >= 405;
  const shakeDamping = interpolate(frame, [405, 470], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shakeX = isCracking ? Math.sin(frame * 1.6) * 0.07 * shakeDamping : 0;
  const shakeY = isCracking ? Math.cos(frame * 1.9) * 0.05 * shakeDamping : 0;

  const camPos: [number, number, number] = [
    0 + shakeX,
    interpolate(frame, [0, 532], [2.2, 2.0]) + shakeY,
    interpolate(frame, [0, 532], [4.6, 4.2]),
  ];

  // Sendok semen melayang meratakan adukan di frame 0-60
  const trowelX = interpolate(frame, [0, 60], [-1.2, 1.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Balok beban merah menekan dari atas (Frame 390+)
  const loadDropY = interpolate(frame, [385, 410], [3.2, 1.9], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Pemisahan dinding menjadi 2 bagian terbelah (Frame 410+)
  const leftSplitRotZ = interpolate(frame, [410, 480], [0, -0.22], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rightSplitRotZ = interpolate(frame, [410, 480], [0, 0.22], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const leftSplitX = interpolate(frame, [410, 480], [0, -0.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rightSplitX = interpolate(frame, [410, 480], [0, 0.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 5 baris bata tumpuk lurus (stack bond)
  const rows = [0, 1, 2, 3, 4];
  const brickWidth = 0.58;
  const brickHeight = 0.22;
  const brickDepth = 0.32;

  return (
    <ThreeCanvas
      width={VIDEO_WIDTH}
      height={VIDEO_HEIGHT}
      style={{ width: "100%", height: "100%" }}
    >
      <CameraController position={camPos} target={[0, 1.1, 0]} />
      <OutdoorDaylight />

      {/* Pondasi Tanah Konstruksi */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#475569" roughness={0.9} />
      </mesh>

      {/* Balok Fondasi Dasar di Bawah Bata */}
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.8, 0.2, 0.5]} />
        <meshStandardMaterial color="#64748b" roughness={0.7} />
      </mesh>

      {/* Ember Semen & Trowel di Samping Konstruksi */}
      <group position={[-2.0, 0.25, 0.5]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.3, 0.24, 0.5, 12]} />
          <meshStandardMaterial color="#0f172a" roughness={0.7} />
        </mesh>
        {/* Adukan Semen Abu-Abu di Dalam Ember */}
        <mesh position={[0, 0.18, 0]}>
          <cylinderGeometry args={[0.28, 0.28, 0.05, 12]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.9} />
        </mesh>
      </group>

      {/* Sendok Semen (Trowel) Meratakan Adukan di Awal */}
      {frame < 70 && (
        <group position={[trowelX, 0.32, 0.2]} rotation={[0.2, 0, 0.4]}>
          <mesh castShadow>
            <boxGeometry args={[0.28, 0.02, 0.18]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.1, -0.1]} rotation={[-0.4, 0, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.22, 8]} />
            <meshStandardMaterial color="#78350f" roughness={0.7} />
          </mesh>
        </group>
      )}

      {/* Separuh Kiri Dinding */}
      <group position={[leftSplitX, 0, 0]} rotation={[0, 0, leftSplitRotZ]}>
        {rows.map((rowIdx) => {
          const rowDelay = rowIdx * 18 + 10;
          const dropProgress = spring({
            frame: frame - rowDelay,
            fps,
            config: { damping: 14, stiffness: 140 },
          });
          const currentY =
            rowIdx * 0.25 + 0.3 + (1 - dropProgress) * 1.4;

          if (frame < rowDelay) return null;

          return (
            <group key={`left-row-${rowIdx}`} position={[0, currentY, 0]}>
              {/* Lapisan Adukan Semen Tipis di Bawah Baris */}
              <mesh position={[-0.6, -0.11, 0]}>
                <boxGeometry args={[1.25, 0.03, brickDepth]} />
                <meshStandardMaterial color="#94a3b8" roughness={0.8} />
              </mesh>
              {/* 2 Bata Tumpuk Lurus di Kiri */}
              {[-0.89, -0.31].map((bx, i) => (
                <mesh key={i} position={[bx, 0, 0]} castShadow>
                  <boxGeometry args={[brickWidth, brickHeight, brickDepth]} />
                  <meshStandardMaterial color="#ea580c" roughness={0.65} />
                </mesh>
              ))}
            </group>
          );
        })}
      </group>

      {/* Separuh Kanan Dinding */}
      <group position={[rightSplitX, 0, 0]} rotation={[0, 0, rightSplitRotZ]}>
        {rows.map((rowIdx) => {
          const rowDelay = rowIdx * 18 + 10;
          const dropProgress = spring({
            frame: frame - rowDelay,
            fps,
            config: { damping: 14, stiffness: 140 },
          });
          const currentY =
            rowIdx * 0.25 + 0.3 + (1 - dropProgress) * 1.4;

          if (frame < rowDelay) return null;

          return (
            <group key={`right-row-${rowIdx}`} position={[0, currentY, 0]}>
              {/* Lapisan Adukan Semen */}
              <mesh position={[0.6, -0.11, 0]}>
                <boxGeometry args={[1.25, 0.03, brickDepth]} />
                <meshStandardMaterial color="#94a3b8" roughness={0.8} />
              </mesh>
              {/* 2 Bata Tumpuk Lurus di Kanan */}
              {[0.31, 0.89].map((bx, i) => (
                <mesh key={i} position={[bx, 0, 0]} castShadow>
                  <boxGeometry args={[brickWidth, brickHeight, brickDepth]} />
                  <meshStandardMaterial color="#ea580c" roughness={0.65} />
                </mesh>
              ))}
            </group>
          );
        })}
      </group>

      {/* Garis Indikator Lemah (Sambungan Segaris) Menyala Merah di Frame 230-390 */}
      {frame >= 230 && frame < 405 && (
        <group position={[0, 0.8, 0.18]}>
          <mesh>
            <boxGeometry args={[0.04, 1.3, 0.02]} />
            <meshStandardMaterial
              color="#ef4444"
              emissive="#dc2626"
              emissiveIntensity={1.8}
            />
          </mesh>
        </group>
      )}

      {/* Garis Retakan Hitam Zig-Zag Dramatis di Frame 405+ */}
      {frame >= 405 && (
        <group position={[0, 0.8, 0.19]}>
          <mesh>
            <boxGeometry args={[0.06, 1.4, 0.02]} />
            <meshStandardMaterial color="#000000" roughness={1.0} />
          </mesh>
        </group>
      )}

      {/* Balok Beban Menekan dari Atas */}
      {frame >= 385 && (
        <group position={[0, loadDropY, 0]}>
          <mesh castShadow>
            <boxGeometry args={[2.2, 0.35, 0.45]} />
            <meshStandardMaterial
              color="#dc2626"
              roughness={0.4}
              metalness={0.3}
            />
          </mesh>
        </group>
      )}
    </ThreeCanvas>
  );
};

// ============================================================================
// SCENE 6: SUSUNAN SELANG-SELING LEGO & PENYEBARAN BEBAN 45°
// ============================================================================
const Scene6LegoStaggeredBond: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const camPos: [number, number, number] = [
    interpolate(frame, [0, 314], [2.2, 1.2]),
    interpolate(frame, [0, 314], [2.4, 2.1]),
    interpolate(frame, [0, 314], [4.4, 3.8]),
  ];

  // Balok beban menekan di frame 140+
  const loadDropY = interpolate(frame, [140, 165], [3.2, 1.9], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const rows = [0, 1, 2, 3, 4];
  const brickWidth = 0.58;
  const brickHeight = 0.22;
  const brickDepth = 0.32;

  // Efek denyut panah hijau neon distribusi gaya
  const arrowPulse = Math.sin(frame * 0.25) * 0.15 + 1.0;

  return (
    <ThreeCanvas
      width={VIDEO_WIDTH}
      height={VIDEO_HEIGHT}
      style={{ width: "100%", height: "100%" }}
    >
      <CameraController position={camPos} target={[0, 1.1, 0]} />
      <OutdoorDaylight />

      {/* Fondasi Tanah Konstruksi */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#475569" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.8, 0.2, 0.5]} />
        <meshStandardMaterial color="#64748b" roughness={0.7} />
      </mesh>

      {/* Dinding Bata Selang-Seling (Staggered Lego Bond) */}
      {rows.map((rowIdx) => {
        const rowDelay = rowIdx * 14 + 10;
        const dropProgress = spring({
          frame: frame - rowDelay,
          fps,
          config: { damping: 14, stiffness: 140 },
        });
        const currentY =
          rowIdx * 0.25 + 0.3 + (1 - dropProgress) * 1.4;

        if (frame < rowDelay) return null;

        const isOddRow = rowIdx % 2 === 1;

        return (
          <group key={`lego-row-${rowIdx}`} position={[0, currentY, 0]}>
            {/* Lapisan Adukan Semen di Bawah Baris */}
            <mesh position={[0, -0.11, 0]}>
              <boxGeometry args={[2.5, 0.03, brickDepth]} />
              <meshStandardMaterial color="#94a3b8" roughness={0.8} />
            </mesh>

            {!isOddRow ? (
              // Baris Genap: 4 Bata Penuh
              [-0.87, -0.29, 0.29, 0.87].map((bx, i) => (
                <mesh key={i} position={[bx, 0, 0]} castShadow>
                  <boxGeometry args={[brickWidth, brickHeight, brickDepth]} />
                  <meshStandardMaterial color="#ea580c" roughness={0.65} />
                </mesh>
              ))
            ) : (
              // Baris Ganjil: Setengah Bata di Ujung + 3 Bata Penuh di Tengah (Lego Bond)
              <>
                <mesh position={[-1.02, 0, 0]} castShadow>
                  <boxGeometry args={[brickWidth * 0.5, brickHeight, brickDepth]} />
                  <meshStandardMaterial color="#ea580c" roughness={0.65} />
                </mesh>
                {[-0.58, 0, 0.58].map((bx, i) => (
                  <mesh key={i} position={[bx, 0, 0]} castShadow>
                    <boxGeometry args={[brickWidth, brickHeight, brickDepth]} />
                    <meshStandardMaterial color="#ea580c" roughness={0.65} />
                  </mesh>
                ))}
                <mesh position={[1.02, 0, 0]} castShadow>
                  <boxGeometry args={[brickWidth * 0.5, brickHeight, brickDepth]} />
                  <meshStandardMaterial color="#ea580c" roughness={0.65} />
                </mesh>
              </>
            )}
          </group>
        );
      })}

      {/* Balok Beban Menekan - Tembok Tetap Kokoh Tanpa Retak */}
      {frame >= 140 && (
        <group position={[0, loadDropY, 0]}>
          <mesh castShadow>
            <boxGeometry args={[2.4, 0.35, 0.45]} />
            <meshStandardMaterial
              color="#0284c7"
              roughness={0.4}
              metalness={0.3}
            />
          </mesh>
        </group>
      )}

      {/* Panah Visual Hijau Neon Dinamis Distribusi Gaya 45° */}
      {frame >= 160 && (
        <group position={[0, 1.1, 0.22]} scale={[arrowPulse, arrowPulse, 1]}>
          {/* Panah Utama ke Bawah */}
          <mesh position={[0, 0.35, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.35, 8]} />
            <meshStandardMaterial
              color="#22c55e"
              emissive="#16a34a"
              emissiveIntensity={2}
            />
          </mesh>

          {/* Panah Diagonal Menyebar ke Kiri Bawah (45°) */}
          <mesh position={[-0.45, 0.05, 0]} rotation={[0, 0, Math.PI / 4]}>
            <cylinderGeometry args={[0.035, 0.035, 0.55, 8]} />
            <meshStandardMaterial
              color="#22c55e"
              emissive="#16a34a"
              emissiveIntensity={2}
            />
          </mesh>
          <mesh position={[-0.85, -0.3, 0]} rotation={[0, 0, Math.PI / 4]}>
            <cylinderGeometry args={[0.03, 0.03, 0.45, 8]} />
            <meshStandardMaterial
              color="#4ade80"
              emissive="#22c55e"
              emissiveIntensity={1.8}
            />
          </mesh>

          {/* Panah Diagonal Menyebar ke Kanan Bawah (45°) */}
          <mesh position={[0.45, 0.05, 0]} rotation={[0, 0, -Math.PI / 4]}>
            <cylinderGeometry args={[0.035, 0.035, 0.55, 8]} />
            <meshStandardMaterial
              color="#22c55e"
              emissive="#16a34a"
              emissiveIntensity={2}
            />
          </mesh>
          <mesh position={[0.85, -0.3, 0]} rotation={[0, 0, -Math.PI / 4]}>
            <cylinderGeometry args={[0.03, 0.03, 0.45, 8]} />
            <meshStandardMaterial
              color="#4ade80"
              emissive="#22c55e"
              emissiveIntensity={1.8}
            />
          </mesh>
        </group>
      )}
    </ThreeCanvas>
  );
};

// ============================================================================
// SCENE 7: PERAKITAN BINGKAI BETON BERTULANG
// ============================================================================
const Scene7ConcreteFrame: React.FC = () => {
  const frame = useCurrentFrame();

  // Fase 1 (Frame 0-110): Dinding bergoyang labil
  const isWobbly = frame < 115;
  const wobbleAngle = isWobbly ? Math.sin(frame * 0.28) * 0.06 : 0;

  // Fase 2: Slof beton bawah meluncur (Frame 115-180)
  const slofSlideX = interpolate(frame, [115, 175], [-4.0, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fase 3: Kolom praktis sudut kiri & kanan berdiri (Frame 185-265)
  const columnScaleY = interpolate(frame, [185, 265], [0.01, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fase 4: Ring balok beton atas menutup dari atas (Frame 270-335)
  const ringDropY = interpolate(frame, [270, 335], [4.0, 1.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const camPos: [number, number, number] = [
    interpolate(frame, [0, 381], [0, 1.4]),
    interpolate(frame, [0, 381], [2.1, 1.9]),
    interpolate(frame, [0, 381], [4.4, 3.8]),
  ];

  return (
    <ThreeCanvas
      width={VIDEO_WIDTH}
      height={VIDEO_HEIGHT}
      style={{ width: "100%", height: "100%" }}
    >
      <CameraController position={camPos} target={[0, 1.0, 0]} />
      <OutdoorDaylight />

      {/* Tanah Konstruksi */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#475569" roughness={0.9} />
      </mesh>

      {/* Dinding Bata Selang-Seling dengan Efek Goyang Awal */}
      <group rotation={[0, 0, wobbleAngle]}>
        {[0, 1, 2, 3, 4].map((rowIdx) => {
          const currentY = rowIdx * 0.25 + 0.42;
          const isOddRow = rowIdx % 2 === 1;
          return (
            <group key={rowIdx} position={[0, currentY, 0]}>
              {!isOddRow ? (
                [-0.87, -0.29, 0.29, 0.87].map((bx, i) => (
                  <mesh key={i} position={[bx, 0, 0]} castShadow>
                    <boxGeometry args={[0.58, 0.22, 0.32]} />
                    <meshStandardMaterial color="#ea580c" roughness={0.65} />
                  </mesh>
                ))
              ) : (
                <>
                  <mesh position={[-1.02, 0, 0]} castShadow>
                    <boxGeometry args={[0.29, 0.22, 0.32]} />
                    <meshStandardMaterial color="#ea580c" roughness={0.65} />
                  </mesh>
                  {[-0.58, 0, 0.58].map((bx, i) => (
                    <mesh key={i} position={[bx, 0, 0]} castShadow>
                      <boxGeometry args={[0.58, 0.22, 0.32]} />
                      <meshStandardMaterial color="#ea580c" roughness={0.65} />
                    </mesh>
                  ))}
                  <mesh position={[1.02, 0, 0]} castShadow>
                    <boxGeometry args={[0.29, 0.22, 0.32]} />
                    <meshStandardMaterial color="#ea580c" roughness={0.65} />
                  </mesh>
                </>
              )}
            </group>
          );
        })}
      </group>

      {/* Slof Beton Bawah (Meluncur dari Kiri) */}
      {frame >= 115 && (
        <mesh position={[slofSlideX, 0.15, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 0.3, 0.48]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.6} />
        </mesh>
      )}

      {/* Kolom Praktis Sudut Kiri & Kanan (Tumbuh Vertikal) */}
      {frame >= 185 && (
        <>
          <group position={[-1.4, 0.3, 0]} scale={[1, columnScaleY, 1]}>
            <mesh position={[0, 0.65, 0]} castShadow>
              <boxGeometry args={[0.34, 1.3, 0.44]} />
              <meshStandardMaterial color="#94a3b8" roughness={0.6} />
            </mesh>
          </group>
          <group position={[1.4, 0.3, 0]} scale={[1, columnScaleY, 1]}>
            <mesh position={[0, 0.65, 0]} castShadow>
              <boxGeometry args={[0.34, 1.3, 0.44]} />
              <meshStandardMaterial color="#94a3b8" roughness={0.6} />
            </mesh>
          </group>
        </>
      )}

      {/* Ring Balok Beton Atas (Turun Menutup dari Atas) */}
      {frame >= 270 && (
        <mesh position={[0, ringDropY, 0]} castShadow>
          <boxGeometry args={[3.2, 0.3, 0.48]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.6} />
        </mesh>
      )}
    </ThreeCanvas>
  );
};

// ============================================================================
// SCENE 8: PROSES PLESTERAN, ACIAN, & RUMAH JADI
// ============================================================================
const Scene8PlasterAcianFinishedHome: React.FC = () => {
  const frame = useCurrentFrame();

  // Tahap 1: Lapisan plester abu-abu menyapu dari bawah (Frame 0-95)
  const plasterScaleY = interpolate(frame, [0, 95], [0.01, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Tahap 2: Lapisan acian halus putih menyapu dari bawah (Frame 95-185)
  const acianScaleY = interpolate(frame, [95, 185], [0.01, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Tahap 3: Cinematic Orbit 360° Zoom-Out (Frame 185-347)
  const orbitAngle = interpolate(frame, [185, 347], [0, Math.PI * 1.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const orbitRadius = interpolate(frame, [185, 347], [3.8, 5.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const camPos: [number, number, number] =
    frame < 185
      ? [
          interpolate(frame, [0, 185], [1.2, 0]),
          interpolate(frame, [0, 185], [2.1, 1.8]),
          interpolate(frame, [0, 185], [4.0, 3.8]),
        ]
      : [
          Math.sin(orbitAngle) * orbitRadius,
          2.0,
          Math.cos(orbitAngle) * orbitRadius,
        ];

  return (
    <ThreeCanvas
      width={VIDEO_WIDTH}
      height={VIDEO_HEIGHT}
      style={{ width: "100%", height: "100%" }}
    >
      <CameraController position={camPos} target={[0, 1.1, 0]} />
      <OutdoorDaylight sunColor="#fef08a" sunIntensity={1.6} />

      {/* Pekarangan Rumah Hijau Tropis */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[24, 24]} />
        <meshStandardMaterial color="#4d7c0f" roughness={0.9} />
      </mesh>

      {/* Jalan Setapak Batu Depan Rumah */}
      {[-1.0, -0.4, 0.2, 0.8, 1.4].map((stepZ, i) => (
        <mesh key={i} position={[0, 0.02, stepZ + 1.2]} castShadow receiveShadow>
          <boxGeometry args={[0.9, 0.04, 0.45]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.8} />
        </mesh>
      ))}

      {/* Tanaman & Pepohonan Asri */}
      <BananaTree position={[-2.8, 0, -1.8]} frame={frame} scale={1.0} />
      <BambooClump position={[2.8, 0, -2.2]} frame={frame} />

      {/* Struktur Rumah Jadi (Bingkai Beton & Dinding) */}
      <group position={[0, 0, 0]}>
        {/* Bingkai Beton */}
        <mesh position={[0, 0.15, 0]} castShadow>
          <boxGeometry args={[3.2, 0.3, 0.48]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.6} />
        </mesh>
        <mesh position={[-1.4, 0.95, 0]} castShadow>
          <boxGeometry args={[0.34, 1.3, 0.44]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.6} />
        </mesh>
        <mesh position={[1.4, 0.95, 0]} castShadow>
          <boxGeometry args={[0.34, 1.3, 0.44]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.6} />
        </mesh>
        <mesh position={[0, 1.75, 0]} castShadow>
          <boxGeometry args={[3.2, 0.3, 0.48]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.6} />
        </mesh>

        {/* Inti Dinding Bata Merah */}
        <mesh position={[0, 0.95, 0]}>
          <boxGeometry args={[2.46, 1.3, 0.32]} />
          <meshStandardMaterial color="#ea580c" roughness={0.7} />
        </mesh>

        {/* Lapisan 1: Plester Semen Abu-Abu Kasar */}
        <group position={[0, 0.3, 0.17]} scale={[1, plasterScaleY, 1]}>
          <mesh position={[0, 0.65, 0]}>
            <boxGeometry args={[2.46, 1.3, 0.03]} />
            <meshStandardMaterial color="#64748b" roughness={0.95} />
          </mesh>
        </group>

        {/* Lapisan 2: Acian Halus Putih Bersih & Kedap Air */}
        <group position={[0, 0.3, 0.19]} scale={[1, acianScaleY, 1]}>
          <mesh position={[0, 0.65, 0]}>
            <boxGeometry args={[2.46, 1.3, 0.02]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.3} />
          </mesh>
        </group>

        {/* Atap Genteng Pelana Rumah Selesai */}
        <group position={[0, 2.3, 0]}>
          <mesh rotation={[0.4, 0, 0]} position={[0, 0.15, 0.6]} castShadow>
            <boxGeometry args={[3.6, 0.14, 1.4]} />
            <meshStandardMaterial color="#b91c1c" roughness={0.5} />
          </mesh>
          <mesh rotation={[-0.4, 0, 0]} position={[0, 0.15, -0.6]} castShadow>
            <boxGeometry args={[3.6, 0.14, 1.4]} />
            <meshStandardMaterial color="#b91c1c" roughness={0.5} />
          </mesh>
        </group>
      </group>
    </ThreeCanvas>
  );
};

// ============================================================================
// DYNAMIC CAPTIONS (SUBTITLE DENGAN HIGHLIGHT KUNING ANTI-BALAP)
// ============================================================================
const DynamicSubtitles: React.FC = () => {
  const frame = useCurrentFrame();

  const activeSegment = useMemo(() => {
    return SUBTITLE_TIMELINE.find(
      (seg) => frame >= seg.startFrame && frame < seg.endFrame
    );
  }, [frame]);

  if (!activeSegment) return null;

  const words = activeSegment.text.split(" ");
  const weights = words.map(getWordWeight);
  const totalWeight = weights.reduce((acc, curr) => acc + curr, 0);
  const segmentDuration = activeSegment.endFrame - activeSegment.startFrame;
  const currentElapsed = frame - activeSegment.startFrame;

  let accumulatedWeight = 0;
  let activeWordIdx = 0;

  for (let i = 0; i < words.length; i++) {
    const wordDuration = (weights[i] / totalWeight) * segmentDuration;
    if (
      currentElapsed >= accumulatedWeight &&
      currentElapsed < accumulatedWeight + wordDuration
    ) {
      activeWordIdx = i;
      break;
    }
    accumulatedWeight += wordDuration;
    if (i === words.length - 1 && currentElapsed >= accumulatedWeight) {
      activeWordIdx = words.length - 1;
    }
  }

  return (
    <div
      style={{
        position: "absolute",
        bottom: "90px",
        left: "5%",
        right: "5%",
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      {/* Badge Tag Kategori Edukasi */}
      <div
        style={{
          background: "rgba(15, 23, 42, 0.9)",
          color: "#38bdf8",
          fontSize: "15px",
          fontWeight: 900,
          letterSpacing: "0.12em",
          padding: "5px 16px",
          borderRadius: "9999px",
          border: "1px solid rgba(56, 189, 248, 0.35)",
          marginBottom: "10px",
          textTransform: "uppercase",
          boxShadow: "0 4px 14px rgba(0, 0, 0, 0.3)",
        }}
      >
        {activeSegment.tag}
      </div>

      {/* Pill Container Teks Subtitle Dinamis */}
      <div
        style={{
          background: "rgba(15, 23, 42, 0.88)",
          backdropFilter: "blur(12px)",
          border: "1.5px solid rgba(255, 255, 255, 0.15)",
          borderRadius: "20px",
          padding: "12px 22px",
          maxWidth: "92%",
          boxShadow: "0 16px 36px rgba(0, 0, 0, 0.5)",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "8px 10px",
        }}
      >
        {words.map((word, idx) => {
          const isActive = idx === activeWordIdx;
          return (
            <span
              key={idx}
              style={{
                fontSize: "25px",
                fontWeight: 900,
                lineHeight: "1.25",
                color: isActive ? "#FACC15" : "#F8FAFC",
                transform: isActive ? "scale(1.12)" : "scale(1)",
                textShadow: isActive
                  ? "0 0 16px rgba(250, 204, 21, 0.7), 0 2px 4px rgba(0,0,0,0.8)"
                  : "0 2px 4px rgba(0, 0, 0, 0.6)",
                display: "inline-block",
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// OVERLAY BADGE / HUD INDIKATOR TEKNIS 3D
// ============================================================================
const TechnicalHUD: React.FC = () => {
  const frame = useCurrentFrame();

  // Scene 5: Peringatan Sambungan Segaris & Tembok Terbelah
  if (frame >= 710 && frame < 882) {
    return (
      <div
        style={{
          position: "absolute",
          top: "120px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(220, 38, 38, 0.92)",
          color: "#ffffff",
          padding: "8px 24px",
          borderRadius: "9999px",
          fontSize: "20px",
          fontWeight: 900,
          letterSpacing: "0.08em",
          boxShadow: "0 0 20px rgba(239, 68, 68, 0.6)",
          zIndex: 40,
        }}
      >
        ⚠️ SAMBUNGAN SEGARIS (SHEAR PLANE)
      </div>
    );
  }

  if (frame >= 882 && frame < 1018) {
    return (
      <div
        style={{
          position: "absolute",
          top: "120px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(185, 28, 28, 0.95)",
          color: "#ffffff",
          padding: "8px 24px",
          borderRadius: "9999px",
          fontSize: "20px",
          fontWeight: 900,
          letterSpacing: "0.08em",
          boxShadow: "0 0 25px rgba(239, 68, 68, 0.9)",
          zIndex: 40,
        }}
      >
        💥 TEKANAN BEBAN: TEMBOK TERBELAH!
      </div>
    );
  }

  // Scene 6: Indikator Lego Staggered Bond & Distribusi Beban 45°
  if (frame >= 1018 && frame < 1332) {
    return (
      <div
        style={{
          position: "absolute",
          top: "120px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(22, 163, 74, 0.92)",
          color: "#ffffff",
          padding: "8px 24px",
          borderRadius: "9999px",
          fontSize: "20px",
          fontWeight: 900,
          letterSpacing: "0.08em",
          boxShadow: "0 0 20px rgba(34, 197, 94, 0.6)",
          zIndex: 40,
        }}
      >
        🛡️ DISTRIBUSI GAYA 45°: KOKOH & STABIL
      </div>
    );
  }

  // Scene 7: Bingkai Beton
  if (frame >= 1450 && frame < 1713) {
    return (
      <div
        style={{
          position: "absolute",
          top: "120px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(2, 132, 199, 0.92)",
          color: "#ffffff",
          padding: "8px 24px",
          borderRadius: "9999px",
          fontSize: "20px",
          fontWeight: 900,
          letterSpacing: "0.08em",
          boxShadow: "0 0 20px rgba(14, 165, 233, 0.6)",
          zIndex: 40,
        }}
      >
        🏗️ BINGKAI BETON BERTULANG (SLOF + KOLOM + RING)
      </div>
    );
  }

  // Scene 8 Closing CTA Card
  if (frame >= 1950) {
    return (
      <div
        style={{
          position: "absolute",
          top: "140px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(15, 23, 42, 0.94)",
          border: "2px solid #38bdf8",
          borderRadius: "24px",
          padding: "20px 32px",
          textAlign: "center",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.7)",
          zIndex: 40,
        }}
      >
        <div style={{ color: "#38bdf8", fontSize: "16px", fontWeight: 800, marginBottom: "6px" }}>
          LEVEL UP KNOWLEDGE 🏆
        </div>
        <div style={{ color: "#f8fafc", fontSize: "24px", fontWeight: 900 }}>
          Paham Dasar Konstruksi Rumah!
        </div>
        <div style={{ color: "#facc15", fontSize: "18px", fontWeight: 700, marginTop: "8px" }}>
          Subscribe untuk sains bangunan berikutnya!
        </div>
      </div>
    );
  }

  return null;
};

// ============================================================================
// KOMPOSISI UTAMA DENGAN REMOTION SERIES SINKRON 100% AUDIO
// ============================================================================
export const MainComposition: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#7dd3fc" }}>
      {/* 1. Pemutar Audio Narasi Penuh (0 s.d. 2060 Frame) */}
      <Audio src={staticFile("audio/narasi.mp3")} volume={1} />

      {/* 2. Visual 3D Multi-Shot Berurutan (Remotion Series) */}
      <Series>
        {/* Scene 1: Kegiatan Menganyam Bambu (Gedek) di Pekarangan */}
        <Series.Sequence durationInFrames={SCENE_DURATIONS.SCENE_1}>
          <Scene1Weaving />
        </Series.Sequence>

        {/* Scene 2: Hujan, Rembesan, & Bambu Lapuk */}
        <Series.Sequence durationInFrames={SCENE_DURATIONS.SCENE_2}>
          <Scene2RottedBamboo />
        </Series.Sequence>

        {/* Scene 3: Pabrik Bata Tradisional - Pencetakan Tanah Liat */}
        <Series.Sequence durationInFrames={SCENE_DURATIONS.SCENE_3}>
          <Scene3ClayMolding />
        </Series.Sequence>

        {/* Scene 4: Tungku Pembakaran Bata Merah sampai Keras */}
        <Series.Sequence durationInFrames={SCENE_DURATIONS.SCENE_4}>
          <Scene4BrickKiln />
        </Series.Sequence>

        {/* Scene 5: Perakitan Tembok Lurus & Runtuh Terbelah */}
        <Series.Sequence durationInFrames={SCENE_DURATIONS.SCENE_5}>
          <Scene5StraightWallCollapse />
        </Series.Sequence>

        {/* Scene 6: Susunan Selang-Seling Lego & Distribusi Gaya 45° */}
        <Series.Sequence durationInFrames={SCENE_DURATIONS.SCENE_6}>
          <Scene6LegoStaggeredBond />
        </Series.Sequence>

        {/* Scene 7: Perakitan Bingkai Beton Bertulang (Slof, Kolom, Ring) */}
        <Series.Sequence durationInFrames={SCENE_DURATIONS.SCENE_7}>
          <Scene7ConcreteFrame />
        </Series.Sequence>

        {/* Scene 8: Proses Plesteran, Acian, & Rumah Jadi Selesai */}
        <Series.Sequence durationInFrames={SCENE_DURATIONS.SCENE_8}>
          <Scene8PlasterAcianFinishedHome />
        </Series.Sequence>
      </Series>

      {/* 3. Technical HUD Badge Indikator Fisika */}
      <TechnicalHUD />

      {/* 4. Subtitle Dinamis Proporsional Anti-Balap */}
      <DynamicSubtitles />
    </AbsoluteFill>
  );
};

export const SusunanBataExplainer = MainComposition;
