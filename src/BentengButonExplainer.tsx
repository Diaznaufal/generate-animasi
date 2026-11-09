import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  Series,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Audio } from "@remotion/media";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";

// ============================================================================
// KONFIGURASI VIDEO SHORTS / TIKTOK (9:16) - BENTENG KERATON BUTON
// ============================================================================
export const DURATION_IN_FRAMES = 1630; // 54.3 detik sinkron audio narasi id-ID-ArdiNeural
export const VIDEO_FPS = 30;
export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;

// Durasi 10 shot selaras audio narasi
export const SHOT_DURATIONS = {
  SHOT_1: 146,  // 0 - 146: Paradox hook (Benteng terluas di dunia)
  SHOT_2: 187,  // 146 - 333: Luas 23 hektar, keliling 3 km
  SHOT_3: 126,  // 333 - 459: Rahasia dinding tebal 2 meter
  SHOT_4: 170,  // 459 - 629: Perekat putih telur & batu kapur
  SHOT_5: 192,  // 629 - 821: Hantaman meriam laut diserap tanpa goyah
  SHOT_6: 198,  // 821 - 1019: Pemandangan 360 derajat ke Selat Buton
  SHOT_7: 187,  // 1019 - 1206: 16 bastion pengintai & meriam
  SHOT_8: 161,  // 1206 - 1367: Tak pernah ditaklukkan penjajah
  SHOT_9: 151,  // 1367 - 1518: Rekor Guinness World Records
  SHOT_10: 112, // 1518 - 1630: Closing CTA hero 360 orbit
};

// ============================================================================
// TIMELINE SUBTITLE
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
    endFrame: 146,
    tag: "🏰 FAKTA ARSITEKTUR NUSANTARA",
    text: "Bukan di Eropa atau Tiongkok, benteng terluas di dunia ada di Indonesia!",
  },
  {
    startFrame: 146,
    endFrame: 333,
    tag: "📏 SKALA MEGA-STRUKTUR",
    text: "Namanya Benteng Keraton Buton, membentang seluas dua puluh tiga hektar dengan keliling hampir tiga kilometer.",
  },
  {
    startFrame: 333,
    endFrame: 459,
    tag: "🧱 KETEBALAN EKSTREM",
    text: "Tapi ada satu rahasia gila di balik dinding setebal dua meter ini.",
  },
  {
    startFrame: 459,
    endFrame: 629,
    tag: "🥚 MATERIAL PEREKAT BIO-STRUKTUR",
    text: "Masyarakat Buton merekatkannya bukan pakai semen, melainkan adonan batu kapur dan putih telur!",
  },
  {
    startFrame: 629,
    endFrame: 821,
    tag: "💣 UJI KETAHANAN MERIAM",
    text: "Saat armada penjajah menghujani meriam dari laut, dinding batu ini menyerap getaran dan sama sekali tak goyah!",
  },
  {
    startFrame: 821,
    endFrame: 1019,
    tag: "🌊 POSISI GEOGRAFIS STRATEGIS",
    text: "Berdiri di atas bukit, pasukan kerajaan menguasai pandangan tiga ratus enam puluh derajat ke seluruh Selat Buton.",
  },
  {
    startFrame: 1019,
    endFrame: 1206,
    tag: "⚔️ 16 BASTION BALUARTI",
    text: "Dilengkapi enam belas benteng pengintai dan meriam di setiap sudut, tak ada musuh yang bisa mendekat tanpa terlihat.",
  },
  {
    startFrame: 1206,
    endFrame: 1367,
    tag: "🛡️ PERTAHANAN TAK TERTEMBUS",
    text: "Hasilnya, benteng ini tak pernah berhasil ditaklukkan oleh bangsa penjajah mana pun.",
  },
  {
    startFrame: 1367,
    endFrame: 1518,
    tag: "🏆 REKOR DUNIA GUINNESS",
    text: "Bahkan Guinness World Records resmi menobatkannya sebagai benteng terluas di muka bumi.",
  },
  {
    startFrame: 1518,
    endFrame: 1630,
    tag: "🇮🇩 KEBANGGAAN INDONESIA",
    text: "Kamu sendiri udah pernah menginjakkan kaki di benteng ini belum?",
  },
];

// Helper bobot durasi per kata
const getWordWeight = (word: string): number => {
  const clean = word.replace(/[^a-zA-Z0-9]/g, "");
  let weight = Math.max(3, clean.length);
  if (word.includes(",")) weight += 8;
  if (word.includes(".") || word.includes("!")) weight += 12;
  return weight;
};

// ============================================================================
// CAMERA CONTROLLER & LIGHTING (TIMEFORGE PRESET)
// ============================================================================
const CameraController: React.FC<{
  position: [number, number, number];
  target: [number, number, number];
}> = ({ position, target }) => {
  const { camera } = useThree();
  camera.position.set(...position);
  camera.lookAt(...target);
  return null;
};

const TimeForgeLighting: React.FC = () => {
  return (
    <>
      <ambientLight intensity={0.48} color="#94a3b8" />
      <directionalLight
        position={[6, 9, 5]}
        intensity={2.4}
        color="#fef08a" // Warm amber sunlight
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
    </>
  );
};

// ============================================================================
// SHOT 1: THE PARADOX HOOK (Bukit Kapur & Tembok Raksasa)
// ============================================================================
const Shot1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const camPos: [number, number, number] = [
    interpolate(frame, [0, 146], [-2.5, 2.5]),
    interpolate(frame, [0, 146], [2.2, 3.2]),
    interpolate(frame, [0, 146], [5.0, 4.2]),
  ];

  return (
    <ThreeCanvas width={VIDEO_WIDTH} height={VIDEO_HEIGHT} style={{ width: "100%", height: "100%" }}>
      <CameraController position={camPos} target={[0, 1.2, 0]} />
      <TimeForgeLighting />

      {/* Laut Selat Buton */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[25, 25]} />
        <meshStandardMaterial color="#0369a1" roughness={0.2} metalness={0.5} />
      </mesh>

      {/* Bukit Kapur Karst Baubau */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[2.8, 3.8, 0.8, 16]} />
        <meshStandardMaterial color="#78716c" roughness={0.9} />
      </mesh>

      {/* Dinding Benteng Melingkar di Puncak Bukit */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * 2.2;
        const z = Math.sin(angle) * 2.2;
        return (
          <group key={i} position={[x, 0.9, z]} rotation={[0, -angle, 0]}>
            <mesh castShadow>
              <boxGeometry args={[1.6, 0.6, 0.35]} />
              <meshStandardMaterial color="#57534e" roughness={0.8} />
            </mesh>
            {/* Meriam di Bastion */}
            <mesh position={[0, 0.35, 0.1]} rotation={[0.15, 0, 0]} castShadow>
              <cylinderGeometry args={[0.07, 0.09, 0.6, 12]} />
              <meshStandardMaterial color="#b45309" roughness={0.3} metalness={0.8} />
            </mesh>
          </group>
        );
      })}
    </ThreeCanvas>
  );
};

// ============================================================================
// SHOT 2: KELILING 3 KILOMETER & LUAS 23 HEKTAR (Bird-Eye Scale)
// ============================================================================
const Shot2MegaScale: React.FC = () => {
  const frame = useCurrentFrame();
  const zoomY = interpolate(frame, [0, 187], [6.5, 4.8]);
  const camPos: [number, number, number] = [
    Math.sin(frame * 0.015) * 1.5,
    zoomY,
    Math.cos(frame * 0.015) * 4.5,
  ];

  return (
    <ThreeCanvas width={VIDEO_WIDTH} height={VIDEO_HEIGHT} style={{ width: "100%", height: "100%" }}>
      <CameraController position={camPos} target={[0, 0.5, 0]} />
      <TimeForgeLighting />

      {/* Permukaan Tanah Bukit Hijau */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[22, 22]} />
        <meshStandardMaterial color="#166534" roughness={0.85} />
      </mesh>

      {/* Dinding Benteng Berbentuk Huruf D Raksasa */}
      {[...Array(16)].map((_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        const radius = 2.6 + (i % 2 === 0 ? 0.2 : 0);
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius * 0.8;
        return (
          <mesh key={i} position={[x, 0.4, z]} rotation={[0, -angle, 0]} castShadow>
            <boxGeometry args={[1.1, 0.8, 0.45]} />
            <meshStandardMaterial color="#78716c" roughness={0.85} />
          </mesh>
        );
      })}

      {/* Kompleks Keraton & Istana Sultan di Bagian Dalam */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[1.2, 0.6, 1.2]} />
        <meshStandardMaterial color="#854d0e" roughness={0.7} />
      </mesh>
      {/* Atap Tumpang Istana */}
      <mesh position={[0, 1.0, 0]} castShadow>
        <coneGeometry args={[1.0, 0.6, 4]} />
        <meshStandardMaterial color="#713f12" roughness={0.6} />
      </mesh>
    </ThreeCanvas>
  );
};

// ============================================================================
// SHOT 3: RAHASIA DINDING TEBAL 2 METER (Close-Up Cross Section)
// ============================================================================
const Shot3ThickWall: React.FC = () => {
  const frame = useCurrentFrame();
  const camPos: [number, number, number] = [
    interpolate(frame, [0, 126], [-1.2, 1.0]),
    interpolate(frame, [0, 126], [2.2, 2.0]),
    interpolate(frame, [0, 126], [3.8, 3.2]),
  ];

  return (
    <ThreeCanvas width={VIDEO_WIDTH} height={VIDEO_HEIGHT} style={{ width: "100%", height: "100%" }}>
      <CameraController position={camPos} target={[0, 1.0, 0]} />
      <TimeForgeLighting />

      {/* Potongan Melintang Dinding Tebal 2 Meter */}
      <group position={[0, 0, 0]}>
        {/* Lapisan Batu Gunung Karang */}
        {[0, 1, 2, 3].map((row) => (
          <group key={row} position={[0, row * 0.5 + 0.25, 0]}>
            {[-0.8, 0, 0.8].map((bx, i) => (
              <mesh key={i} position={[bx, 0, 0]} castShadow>
                <boxGeometry args={[0.75, 0.45, 1.8]} />
                <meshStandardMaterial color="#57534e" roughness={0.9} />
              </mesh>
            ))}
          </group>
        ))}
      </group>
    </ThreeCanvas>
  );
};

// ============================================================================
// SHOT 4: ADONAN BATU KAPUR & PUTIH TELUR (Material Synthesis)
// ============================================================================
const Shot4BioMortar: React.FC = () => {
  const frame = useCurrentFrame();
  const eggDropY = interpolate(frame, [10, 45], [2.5, 0.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const spreadScale = interpolate(frame, [45, 110], [0.3, 1.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const camPos: [number, number, number] = [
    interpolate(frame, [0, 170], [-0.8, 0.8]),
    interpolate(frame, [0, 170], [2.4, 2.1]),
    interpolate(frame, [0, 170], [3.2, 2.8]),
  ];

  return (
    <ThreeCanvas width={VIDEO_WIDTH} height={VIDEO_HEIGHT} style={{ width: "100%", height: "100%" }}>
      <CameraController position={camPos} target={[0, 0.6, 0]} />
      <TimeForgeLighting />

      {/* Bongkahan Batu Karang Bawah */}
      <mesh position={[-0.8, 0.3, 0]} castShadow>
        <boxGeometry args={[1.2, 0.6, 1.0]} />
        <meshStandardMaterial color="#57534e" roughness={0.85} />
      </mesh>
      <mesh position={[0.8, 0.3, 0]} castShadow>
        <boxGeometry args={[1.2, 0.6, 1.0]} />
        <meshStandardMaterial color="#57534e" roughness={0.85} />
      </mesh>

      {/* Lapisan Pasta Putih Telur & Kapur yang Menyebar */}
      <mesh position={[0, 0.45, 0]} scale={[spreadScale, 0.1, spreadScale]}>
        <boxGeometry args={[1.0, 0.4, 0.9]} />
        <meshStandardMaterial color="#fef9c3" roughness={0.4} emissive="#fef08a" emissiveIntensity={0.2} />
      </mesh>

      {/* Tetesan Putih Telur Turun */}
      {frame < 60 && (
        <mesh position={[0, eggDropY, 0]}>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color="#fef08a" roughness={0.2} transparent opacity={0.85} />
        </mesh>
      )}
    </ThreeCanvas>
  );
};

// ============================================================================
// SHOT 5: TEMBAKAN MERIAM LAUT DISERAP (Shock Absorption & Camera Shake)
// ============================================================================
const Shot5CannonImpact: React.FC = () => {
  const frame = useCurrentFrame();
  const isHit = frame >= 65;
  const shakeDamping = interpolate(frame, [65, 120], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shakeX = isHit ? Math.sin(frame * 1.8) * 0.08 * shakeDamping : 0;
  const shakeY = isHit ? Math.cos(frame * 2.1) * 0.05 * shakeDamping : 0;

  const cannonBallZ = interpolate(frame, [20, 65], [6.0, 0.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const camPos: [number, number, number] = [
    0 + shakeX,
    interpolate(frame, [0, 192], [2.2, 2.0]) + shakeY,
    interpolate(frame, [0, 192], [4.4, 4.0]),
  ];

  return (
    <ThreeCanvas width={VIDEO_WIDTH} height={VIDEO_HEIGHT} style={{ width: "100%", height: "100%" }}>
      <CameraController position={camPos} target={[0, 1.1, 0]} />
      <TimeForgeLighting />

      {/* Dinding Batu Kokoh */}
      <mesh position={[0, 1.0, 0]} castShadow>
        <boxGeometry args={[3.2, 2.0, 1.6]} />
        <meshStandardMaterial color="#57534e" roughness={0.9} />
      </mesh>

      {/* Peluru Meriam Meluncur */}
      {frame < 70 && (
        <mesh position={[0, 1.1, cannonBallZ]} castShadow>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color="#1c1917" roughness={0.4} metalness={0.9} />
        </mesh>
      )}

      {/* Efek Asap Mesiu Saat Benturan */}
      {isHit && (
        <group position={[0, 1.1, 0.9]}>
          {[0, 1, 2, 3, 4].map((i) => {
            const smokeScale = interpolate(frame, [65, 140], [0.1, 0.8 + i * 0.1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const smokeX = Math.sin(i * 1.5) * 0.4;
            const smokeY = Math.cos(i * 1.2) * 0.3;
            return (
              <mesh key={i} position={[smokeX, smokeY, 0]} scale={[smokeScale, smokeScale, smokeScale]}>
                <sphereGeometry args={[0.3, 12, 12]} />
                <meshStandardMaterial color="#d6d3d1" transparent opacity={0.5} roughness={0.8} />
              </mesh>
            );
          })}
        </group>
      )}
    </ThreeCanvas>
  );
};

// ============================================================================
// SHOT 6: PANDANGAN 360 DERAJAT KE SELAT BUTON (Panorama & Meriam)
// ============================================================================
const Shot6SelatPanorama: React.FC = () => {
  const frame = useCurrentFrame();
  const panAngle = interpolate(frame, [0, 198], [-0.3, 0.4]);
  const camPos: [number, number, number] = [
    Math.sin(panAngle) * 3.8,
    interpolate(frame, [0, 198], [2.4, 2.2]),
    Math.cos(panAngle) * 3.8,
  ];

  return (
    <ThreeCanvas width={VIDEO_WIDTH} height={VIDEO_HEIGHT} style={{ width: "100%", height: "100%" }}>
      <CameraController position={camPos} target={[0, 1.0, 0]} />
      <TimeForgeLighting />

      {/* Hamparan Laut Selat Buton */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[25, 25]} />
        <meshStandardMaterial color="#0284c7" roughness={0.15} metalness={0.6} />
      </mesh>

      {/* Tepi Dinding Tebing */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[2.0, 2.5, 1.2, 16]} />
        <meshStandardMaterial color="#44403c" roughness={0.9} />
      </mesh>

      {/* Meriam Kuno Menghadap ke Laut */}
      <group position={[0, 1.25, 1.2]} rotation={[0.1, 0, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.12, 0.9, 12]} />
          <meshStandardMaterial color="#b45309" roughness={0.3} metalness={0.85} />
        </mesh>
      </group>
    </ThreeCanvas>
  );
};

// ============================================================================
// SHOT 7: 16 BASTION BALUARTI PENGINTAI (Tracking Bastions)
// ============================================================================
const Shot7Bastions: React.FC = () => {
  const frame = useCurrentFrame();
  const trackX = interpolate(frame, [0, 187], [-3.0, 2.5]);
  const camPos: [number, number, number] = [
    trackX,
    interpolate(frame, [0, 187], [2.2, 2.4]),
    interpolate(frame, [0, 187], [4.2, 3.8]),
  ];

  return (
    <ThreeCanvas width={VIDEO_WIDTH} height={VIDEO_HEIGHT} style={{ width: "100%", height: "100%" }}>
      <CameraController position={camPos} target={[trackX + 0.5, 1.0, 0]} />
      <TimeForgeLighting />

      {/* Barisan 4 Bastion Pengintai Bersebelahan */}
      {[-3, -1, 1, 3].map((pos, idx) => (
        <group key={idx} position={[pos * 1.4, 0, 0]}>
          <mesh position={[0, 0.8, 0]} castShadow>
            <cylinderGeometry args={[0.7, 0.85, 1.6, 12]} />
            <meshStandardMaterial color="#57534e" roughness={0.8} />
          </mesh>
          <mesh position={[0, 1.7, 0.4]} rotation={[0.2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.09, 0.5, 10]} />
            <meshStandardMaterial color="#b45309" roughness={0.3} metalness={0.8} />
          </mesh>
        </group>
      ))}
    </ThreeCanvas>
  );
};

// ============================================================================
// SHOT 8: TAK PERNAH DITAKLUKKAN (Kibaran Bendera & Kapal Mundur)
// ============================================================================
const Shot8Unconquered: React.FC = () => {
  const frame = useCurrentFrame();
  const flagWave = Math.sin(frame * 0.18) * 0.15;
  const shipRetreatZ = interpolate(frame, [0, 161], [1.5, 5.5]);

  const camPos: [number, number, number] = [
    interpolate(frame, [0, 161], [-1.0, 1.0]),
    interpolate(frame, [0, 161], [2.5, 2.2]),
    interpolate(frame, [0, 161], [4.0, 3.6]),
  ];

  return (
    <ThreeCanvas width={VIDEO_WIDTH} height={VIDEO_HEIGHT} style={{ width: "100%", height: "100%" }}>
      <CameraController position={camPos} target={[0, 1.2, 0]} />
      <TimeForgeLighting />

      {/* Dinding Utama Benteng */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <boxGeometry args={[4.0, 1.8, 1.5]} />
        <meshStandardMaterial color="#57534e" roughness={0.85} />
      </mesh>

      {/* Tiang Bendera Kesultanan Buton */}
      <mesh position={[0, 2.4, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 1.4, 8]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.7} />
      </mesh>

      {/* Bendera Berkibar */}
      <mesh position={[0.4, 2.8, 0]} rotation={[0, flagWave, 0]}>
        <boxGeometry args={[0.7, 0.4, 0.02]} />
        <meshStandardMaterial color="#dc2626" roughness={0.5} />
      </mesh>

      {/* Kapal Penjajah Mundur di Kejauhan Laut */}
      <group position={[1.8, 0.1, shipRetreatZ]}>
        <mesh>
          <boxGeometry args={[0.6, 0.25, 1.2]} />
          <meshStandardMaterial color="#451a03" />
        </mesh>
      </group>
    </ThreeCanvas>
  );
};

// ============================================================================
// SHOT 9: GUINNESS WORLD RECORDS (Golden Recognition Plaque)
// ============================================================================
const Shot9GuinnessRecord: React.FC = () => {
  const frame = useCurrentFrame();
  const spinY = interpolate(frame, [0, 151], [-0.4, 0.4]);
  const glow = 0.2 + Math.sin(frame * 0.12) * 0.1;

  const camPos: [number, number, number] = [
    0,
    interpolate(frame, [0, 151], [2.3, 2.0]),
    interpolate(frame, [0, 151], [3.8, 3.2]),
  ];

  return (
    <ThreeCanvas width={VIDEO_WIDTH} height={VIDEO_HEIGHT} style={{ width: "100%", height: "100%" }}>
      <CameraController position={camPos} target={[0, 1.1, 0]} />
      <TimeForgeLighting />

      {/* Plakat Emas Guinness World Records 3D */}
      <group position={[0, 1.1, 0]} rotation={[0, spinY, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.8, 2.2, 0.12]} />
          <meshStandardMaterial color="#eab308" roughness={0.25} metalness={0.9} emissive="#ca8a04" emissiveIntensity={glow} />
        </mesh>
        {/* Emblem Dalam */}
        <mesh position={[0, 0.3, 0.08]}>
          <cylinderGeometry args={[0.5, 0.5, 0.06, 24]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.3} />
        </mesh>
      </group>
    </ThreeCanvas>
  );
};

// ============================================================================
// SHOT 10: CLOSING HERO 360 ORBIT & CTA
// ============================================================================
const Shot10ClosingCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const orbitAngle = interpolate(frame, [0, 112], [0, Math.PI / 2]);
  const camPos: [number, number, number] = [
    Math.sin(orbitAngle) * 4.2,
    interpolate(frame, [0, 112], [2.6, 2.2]),
    Math.cos(orbitAngle) * 4.2,
  ];

  return (
    <ThreeCanvas width={VIDEO_WIDTH} height={VIDEO_HEIGHT} style={{ width: "100%", height: "100%" }}>
      <CameraController position={camPos} target={[0, 1.1, 0]} />
      <TimeForgeLighting />

      {/* Kompleks Megah Benteng Buton */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[2.5, 3.0, 0.8, 16]} />
        <meshStandardMaterial color="#78716c" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.0, 0]}>
        <boxGeometry args={[1.4, 0.6, 1.4]} />
        <meshStandardMaterial color="#854d0e" roughness={0.7} />
      </mesh>
    </ThreeCanvas>
  );
};

// ============================================================================
// DYNAMIC CAPTIONS (SAFE ZONE BOTTOM >= 320px)
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
        bottom: "320px", // Safe Zone Vertikal 9:16 (bebas dari UI Shorts/TikTok)
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
          background: "rgba(15, 23, 42, 0.92)",
          color: "#facc15",
          fontSize: "16px",
          fontWeight: 900,
          letterSpacing: "0.12em",
          padding: "6px 18px",
          borderRadius: "9999px",
          border: "1px solid rgba(250, 204, 21, 0.4)",
          marginBottom: "12px",
          textTransform: "uppercase",
          boxShadow: "0 4px 14px rgba(0, 0, 0, 0.4)",
        }}
      >
        {activeSegment.tag}
      </div>

      {/* Container Subtitle */}
      <div
        style={{
          background: "rgba(15, 23, 42, 0.88)",
          backdropFilter: "blur(14px)",
          border: "1.5px solid rgba(255, 255, 255, 0.15)",
          borderRadius: "20px",
          padding: "14px 24px",
          maxWidth: "92%",
          boxShadow: "0 16px 36px rgba(0, 0, 0, 0.6)",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "8px 12px",
        }}
      >
        {words.map((word, idx) => {
          const isActive = idx === activeWordIdx;
          return (
            <span
              key={idx}
              style={{
                fontSize: "26px",
                fontWeight: 900,
                lineHeight: "1.3",
                color: isActive ? "#FACC15" : "#FFFFFF",
                transform: isActive ? "scale(1.14)" : "scale(1)",
                textShadow: isActive
                  ? "0 0 16px rgba(250, 204, 21, 0.8), 0 2px 4px rgba(0,0,0,0.9)"
                  : "0 2px 4px rgba(0, 0, 0, 0.7)",
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
// MAIN COMPOSITION EXPORT
// ============================================================================
export const BentengButonExplainer: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
      {/* 1. Global Audio Playback */}
      <Audio src={staticFile("audio/narasi.mp3")} volume={1} />

      {/* 2. Visual 3D Multi-Shot Series */}
      <Series>
        <Series.Sequence durationInFrames={SHOT_DURATIONS.SHOT_1}>
          <Shot1Hook />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SHOT_DURATIONS.SHOT_2}>
          <Shot2MegaScale />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SHOT_DURATIONS.SHOT_3}>
          <Shot3ThickWall />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SHOT_DURATIONS.SHOT_4}>
          <Shot4BioMortar />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SHOT_DURATIONS.SHOT_5}>
          <Shot5CannonImpact />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SHOT_DURATIONS.SHOT_6}>
          <Shot6SelatPanorama />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SHOT_DURATIONS.SHOT_7}>
          <Shot7Bastions />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SHOT_DURATIONS.SHOT_8}>
          <Shot8Unconquered />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SHOT_DURATIONS.SHOT_9}>
          <Shot9GuinnessRecord />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SHOT_DURATIONS.SHOT_10}>
          <Shot10ClosingCTA />
        </Series.Sequence>
      </Series>

      {/* 3. Subtitle Dinamis di Safe Zone */}
      <DynamicSubtitles />
    </AbsoluteFill>
  );
};
