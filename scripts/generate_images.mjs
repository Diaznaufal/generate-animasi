import fs from "fs";
import path from "path";

const imagesDir = path.resolve("public/images");
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Helper to wrap SVG in standard 1080x1920 viewBox
const svgWrapper = (content) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs>
    <linearGradient id="sky1" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="60%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#334155" />
    </linearGradient>
    <radialGradient id="sunGlow" cx="50%" cy="30%" r="50%">
      <stop offset="0%" stop-color="#fef08a" stop-opacity="0.9" />
      <stop offset="40%" stop-color="#f97316" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#7c2d12" stop-opacity="0" />
    </radialGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="15" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  ${content}
</svg>`;

const scenes = [
  // Scene 1: Close-up of rail gap
  {
    name: "scene1.svg",
    title: "Misteri Sambungan Rel Kereta",
    content: `
      <!-- Background Sky & Environment -->
      <rect width="1080" height="1920" fill="url(#sky1)" />
      <circle cx="540" cy="500" r="380" fill="url(#sunGlow)" />
      
      <!-- Horizon & Distant Silhouette -->
      <path d="M0,1050 Q270,1010 540,1040 T1080,1020 L1080,1920 L0,1920 Z" fill="#090d16" />
      
      <!-- Ballast Bed -->
      <polygon points="120,1920 960,1920 620,1080 460,1080" fill="#1e293b" />
      
      <!-- Ties / Bantalan Rel -->
      ${Array.from({ length: 9 })
        .map((_, i) => {
          const y = 1120 + i * 90;
          const w = 240 + i * 85;
          const h = 26 + i * 5;
          const x = 540 - w / 2;
          return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="#334155" stroke="#475569" stroke-width="2" />`;
        })
        .join("\n")}
      
      <!-- Left & Right Rails -->
      <path d="M 490,1080 L 260,1920" stroke="#94a3b8" stroke-width="28" stroke-linecap="round" />
      <path d="M 494,1080 L 264,1920" stroke="#f8fafc" stroke-width="6" stroke-linecap="round" />
      
      <path d="M 590,1080 L 820,1920" stroke="#94a3b8" stroke-width="28" stroke-linecap="round" />
      <path d="M 586,1080 L 816,1920" stroke="#f8fafc" stroke-width="6" stroke-linecap="round" />
      
      <!-- Prominent Rail Gap Highlight in Foreground -->
      <rect x="220" y="1620" width="80" height="18" fill="#090d16" stroke="#fbbf24" stroke-width="4" rx="2" />
      <rect x="780" y="1620" width="80" height="18" fill="#090d16" stroke="#fbbf24" stroke-width="4" rx="2" />
      
      <!-- Pulsing Focus Target on Gap -->
      <circle cx="260" cy="1630" r="60" fill="none" stroke="#f59e0b" stroke-width="6" stroke-dasharray="12,12" />
      <circle cx="260" cy="1630" r="14" fill="#ef4444" filter="url(#glow)" />
      
      <!-- Visual Annotations -->
      <text x="350" y="1640" font-family="system-ui, sans-serif" font-weight="900" font-size="42" fill="#fbbf24">CELAH PEMUAIAN</text>
      <path d="M 330,1630 L 290,1630" stroke="#fbbf24" stroke-width="6" marker-end="url(#arrow)" />

      <!-- Thematic Badge -->
      <rect x="140" y="240" width="800" height="110" rx="28" fill="rgba(15, 23, 42, 0.85)" stroke="#f59e0b" stroke-width="3" />
      <text x="540" y="310" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="44" fill="#ffffff" letter-spacing="2">MISTERI REL KERETA API</text>
    `,
  },

  // Scene 2: 19th Century Steam Train
  {
    name: "scene2.svg",
    title: "Era Kereta Api Abad ke-19",
    content: `
      <rect width="1080" height="1920" fill="#1c1917" />
      <linearGradient id="sepiaGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#451a03" />
        <stop offset="50%" stop-color="#78350f" />
        <stop offset="100%" stop-color="#1c1917" />
      </linearGradient>
      <rect width="1080" height="1920" fill="url(#sepiaGrad)" opacity="0.8" />
      
      <!-- Distant Industrial Smoke & Sky -->
      <ellipse cx="540" cy="650" rx="460" ry="220" fill="#fef3c7" opacity="0.15" />
      
      <!-- Huge Vintage Smoke Plumes -->
      <circle cx="380" cy="580" r="140" fill="#78716c" opacity="0.5" />
      <circle cx="480" cy="500" r="190" fill="#a8a29e" opacity="0.6" />
      <circle cx="640" cy="420" r="230" fill="#d6d3d1" opacity="0.4" />
      <circle cx="780" cy="360" r="260" fill="#e7e5e4" opacity="0.25" />
      
      <!-- Historic Steam Locomotive Silhouette -->
      <path d="M220,1100 L220,950 L340,950 L340,880 L420,880 L420,950 L680,950 L680,820 L800,820 L820,1100 Z" fill="#0c0a09" />
      <!-- Cowcatcher / Grill -->
      <polygon points="160,1140 240,1100 240,1140" fill="#d97706" />
      <!-- Locomotive Cab Windows & Details -->
      <rect x="700" y="850" width="80" height="70" rx="8" fill="#fef08a" opacity="0.9" />
      <!-- Big Wheels -->
      <circle cx="340" cy="1120" r="90" fill="#44403c" stroke="#d97706" stroke-width="10" />
      <circle cx="540" cy="1120" r="90" fill="#44403c" stroke="#d97706" stroke-width="10" />
      <circle cx="740" cy="1120" r="90" fill="#44403c" stroke="#d97706" stroke-width="10" />
      
      <!-- Steam Rods -->
      <rect x="330" y="1110" width="420" height="20" rx="6" fill="#f59e0b" />
      
      <!-- Tracks below -->
      <rect x="80" y="1210" width="920" height="34" fill="#78350f" />
      <line x1="0" y1="1244" x2="1080" y2="1244" stroke="#e2e8f0" stroke-width="18" />

      <!-- Thematic Badge -->
      <rect x="140" y="240" width="800" height="110" rx="28" fill="rgba(28, 25, 23, 0.9)" stroke="#d97706" stroke-width="3" />
      <text x="540" y="310" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="44" fill="#fbbf24">REVOLUSI INDUSTRI 1800-AN</text>
    `,
  },

  // Scene 3: Blazing Summer Sun
  {
    name: "scene3.svg",
    title: "Terik Panas Musim Panas",
    content: `
      <rect width="1080" height="1920" fill="#450a0a" />
      <linearGradient id="heatSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#991b1b" />
        <stop offset="45%" stop-color="#ea580c" />
        <stop offset="85%" stop-color="#facc15" />
        <stop offset="100%" stop-color="#451a03" />
      </linearGradient>
      <rect width="1080" height="1920" fill="url(#heatSky)" />
      
      <!-- Giant Blazing Sun -->
      <circle cx="540" cy="620" r="280" fill="#fef08a" filter="url(#glow)" />
      <circle cx="540" cy="620" r="220" fill="#ffffff" />
      
      <!-- Heat Wave Rays -->
      ${Array.from({ length: 16 })
        .map((_, i) => {
          const deg = i * 22.5;
          return `<line x1="540" y1="620" x2="540" y2="240" stroke="#fef08a" stroke-width="12" stroke-linecap="round" opacity="0.6" transform="rotate(${deg} 540 620)" />`;
        })
        .join("\n")}
      
      <!-- Temperature Display Gauge -->
      <g transform="translate(740, 480)">
        <rect x="0" y="0" width="240" height="150" rx="24" fill="rgba(0,0,0,0.75)" stroke="#ef4444" stroke-width="4" />
        <text x="120" y="65" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="34" fill="#fbbf24">SUHU REL</text>
        <text x="120" y="125" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="52" fill="#ef4444">&gt; 55°C</text>
      </g>
      
      <!-- Distant Wavy Heat Waves on Tracks -->
      <path d="M100,1400 Q300,1360 540,1400 T980,1380" fill="none" stroke="#fef08a" stroke-width="14" opacity="0.7" />
      <path d="M120,1460 Q340,1420 560,1460 T1000,1440" fill="none" stroke="#fdba74" stroke-width="18" opacity="0.6" />
      
      <!-- Track Bed in Desert Heat -->
      <polygon points="40,1920 1040,1920 620,1300 460,1300" fill="#78350f" opacity="0.9" />
      <line x1="480" y1="1300" x2="200" y2="1920" stroke="#fcd34d" stroke-width="26" />
      <line x1="600" y1="1300" x2="880" y2="1920" stroke="#fcd34d" stroke-width="26" />

      <!-- Thematic Badge -->
      <rect x="140" y="240" width="800" height="110" rx="28" fill="rgba(69, 10, 10, 0.9)" stroke="#ef4444" stroke-width="3" />
      <text x="540" y="310" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="44" fill="#fef08a">GELOMBANG PANAS EKSTREM</text>
    `,
  },

  // Scene 4: Track Buckling / Sun Kink
  {
    name: "scene4.svg",
    title: "Fenomena Sun Kink / Rel Meliuk",
    content: `
      <rect width="1080" height="1920" fill="#0f172a" />
      <linearGradient id="dangerBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#1e1b4b" />
        <stop offset="60%" stop-color="#311010" />
        <stop offset="100%" stop-color="#090505" />
      </linearGradient>
      <rect width="1080" height="1920" fill="url(#dangerBg)" />
      
      <!-- Severe Buckling Tracks - Dramatic S-Curves -->
      <path d="M 380,1920 C 340,1650 160,1500 240,1320 C 320,1150 780,1180 840,980 C 900,820 640,680 500,580" fill="none" stroke="#cbd5e1" stroke-width="32" stroke-linecap="round" />
      <path d="M 380,1920 C 340,1650 160,1500 240,1320 C 320,1150 780,1180 840,980 C 900,820 640,680 500,580" fill="none" stroke="#f87171" stroke-width="12" stroke-linecap="round" />

      <path d="M 680,1920 C 640,1650 460,1500 540,1320 C 620,1150 1080,1180 1140,980 C 1200,820 940,680 800,580" fill="none" stroke="#cbd5e1" stroke-width="32" stroke-linecap="round" />
      <path d="M 680,1920 C 640,1650 460,1500 540,1320 C 620,1150 1080,1180 1140,980 C 1200,820 940,680 800,580" fill="none" stroke="#f87171" stroke-width="12" stroke-linecap="round" />

      <!-- Warning Markers & Stress Arrows -->
      <g transform="translate(540, 1260)">
        <polygon points="0,-80 80,60 -80,60" fill="#eab308" stroke="#ffffff" stroke-width="6" />
        <text x="0" y="45" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="64" fill="#000000">!</text>
      </g>
      
      <!-- Lateral Force Arrows -->
      <line x1="200" y1="1320" x2="80" y2="1320" stroke="#ef4444" stroke-width="12" marker-end="url(#arrow)" />
      <line x1="780" y1="1020" x2="940" y2="1020" stroke="#ef4444" stroke-width="12" marker-end="url(#arrow)" />
      
      <!-- Thematic Badge -->
      <rect x="140" y="240" width="800" height="110" rx="28" fill="rgba(239, 68, 68, 0.25)" stroke="#ef4444" stroke-width="4" />
      <text x="540" y="310" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="44" fill="#fca5a5">REL MELIUK EKSTREM: SUN KINK</text>
    `,
  },

  // Scene 5: Historic Train Derailment Alert
  {
    name: "scene5.svg",
    title: "Bahaya Kereta Anjlok",
    content: `
      <rect width="1080" height="1920" fill="#0a0a0a" />
      <!-- Red flashing ambient alert -->
      <radialGradient id="alertGlow" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#dc2626" stop-opacity="0.6" />
        <stop offset="100%" stop-color="#0a0a0a" stop-opacity="0" />
      </radialGradient>
      <rect width="1080" height="1920" fill="url(#alertGlow)" />
      
      <!-- Derailment Warning Graphic -->
      <g transform="translate(540, 850)">
        <circle cx="0" cy="0" r="320" fill="#18181b" stroke="#ef4444" stroke-width="12" />
        <circle cx="0" cy="0" r="280" fill="none" stroke="#ef4444" stroke-width="4" stroke-dasharray="20,16" />
        
        <!-- Broken Rail Icon -->
        <path d="M-200,80 L-50,80 L-10,20" stroke="#e2e8f0" stroke-width="26" stroke-linecap="round" />
        <path d="M20,-20 L60,-80 L200,-80" stroke="#e2e8f0" stroke-width="26" stroke-linecap="round" />
        <polygon points="-30,60 10,-30 40,-30 0,60" fill="#ef4444" />
        
        <!-- Danger Cross -->
        <line x1="-120" y1="-120" x2="120" y2="120" stroke="#ef4444" stroke-width="16" stroke-linecap="round" />
        <line x1="120" y1="-120" x2="-120" y2="120" stroke="#ef4444" stroke-width="16" stroke-linecap="round" />
      </g>
      
      <text x="540" y="1320" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="56" fill="#ef4444" letter-spacing="4">BAHAYA ANJLOK</text>
      <text x="540" y="1400" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="700" font-size="34" fill="#cbd5e1">BENCANA BESAR ABAD KE-19</text>

      <!-- Thematic Badge -->
      <rect x="140" y="240" width="800" height="110" rx="28" fill="rgba(220, 38, 38, 0.3)" stroke="#ef4444" stroke-width="3" />
      <text x="540" y="310" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="44" fill="#ffffff">ANCAMAN KESELAMATAN NYATA</text>
    `,
  },

  // Scene 6: Atomic Vibration & Heat Energy
  {
    name: "scene6.svg",
    title: "Getaran Atom & Energi Kinetik",
    content: `
      <rect width="1080" height="1920" fill="#030712" />
      
      <!-- Atomic Grid Lattice (Iron atoms Fe) -->
      <g transform="translate(180, 520)">
        ${[0, 1, 2]
          .flatMap((row) =>
            [0, 1, 2].map((col) => {
              const x = col * 360;
              const y = row * 320;
              return `
              <!-- Vibrating springs -->
              ${col < 2 ? `<line x1="${x}" y1="${y}" x2="${x + 360}" y2="${y}" stroke="#f97316" stroke-width="10" stroke-dasharray="16,10" />` : ""}
              ${row < 2 ? `<line x1="${x}" y1="${y}" x2="${x}" y2="${y + 320}" stroke="#f97316" stroke-width="10" stroke-dasharray="16,10" />` : ""}
              
              <!-- Expanding energy rings -->
              <circle cx="${x}" cy="${y}" r="90" fill="none" stroke="#fbbf24" stroke-width="4" opacity="0.5" />
              <circle cx="${x}" cy="${y}" r="65" fill="#ea580c" opacity="0.8" filter="url(#glow)" />
              <circle cx="${x}" cy="${y}" r="45" fill="#fef08a" />
              <text x="${x}" y="${y + 14}" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="36" fill="#451a03">Fe</text>
            `;
            }),
          )
          .join("\n")}
      </g>
      
      <text x="540" y="1520" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="800" font-size="42" fill="#fbbf24">STRUKTUR KRISTAL BESI (Fe)</text>
      <text x="540" y="1590" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="600" font-size="34" fill="#94a3b8">Energi Panas = Getaran Atomik Meningkat</text>

      <!-- Thematic Badge -->
      <rect x="140" y="240" width="800" height="110" rx="28" fill="rgba(15, 23, 42, 0.9)" stroke="#f97316" stroke-width="3" />
      <text x="540" y="310" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="44" fill="#fdba74">FISIKA PEMUAIAN TERMAL</text>
    `,
  },

  // Scene 7: Physics Expansion Formula
  {
    name: "scene7.svg",
    title: "Rumus Pemuaian Panjang",
    content: `
      <rect width="1080" height="1920" fill="#0f172a" />
      <!-- Blueprint Grid Background -->
      ${Array.from({ length: 15 })
        .map(
          (_, i) =>
            `<line x1="0" y1="${i * 130}" x2="1080" y2="${i * 130}" stroke="#1e293b" stroke-width="2" />`,
        )
        .join("\n")}
      ${Array.from({ length: 9 })
        .map(
          (_, i) =>
            `<line x1="${i * 135}" y1="0" x2="${i * 135}" y2="1920" stroke="#1e293b" stroke-width="2" />`,
        )
        .join("\n")}
      
      <!-- Central Formula Blueprint Card -->
      <rect x="80" y="600" width="920" height="420" rx="36" fill="#1e293b" stroke="#38bdf8" stroke-width="6" />
      <text x="540" y="710" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="700" font-size="36" fill="#38bdf8">HUKUM PEMUAIAN PANJANG</text>
      
      <!-- Glowing KaTeX style Formula -->
      <text x="540" y="840" text-anchor="middle" font-family="'Times New Roman', serif" font-weight="bold" font-size="82" fill="#facc15">ΔL = α · L₀ · ΔT</text>
      <text x="540" y="930" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="600" font-size="30" fill="#94a3b8">Pertambahan Panjang Baja Proporsional Suhu</text>

      <!-- Diagram of expanding rail -->
      <g transform="translate(140, 1150)">
        <text x="0" y="-30" font-family="system-ui, sans-serif" font-weight="700" font-size="32" fill="#cbd5e1">Panjang Awal (L₀)</text>
        <rect x="0" y="0" width="580" height="90" rx="12" fill="#475569" stroke="#94a3b8" stroke-width="4" />
        
        <!-- Expanded Section ΔL -->
        <rect x="580" y="0" width="220" height="90" rx="12" fill="#ef4444" stroke="#fca5a5" stroke-width="4" />
        <text x="690" y="58" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="38" fill="#ffffff">+ΔL</text>
      </g>

      <!-- Thematic Badge -->
      <rect x="140" y="240" width="800" height="110" rx="28" fill="rgba(15, 23, 42, 0.95)" stroke="#38bdf8" stroke-width="3" />
      <text x="540" y="310" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="44" fill="#38bdf8">PERSAMAAN FISIKA DASAR</text>
    `,
  },

  // Scene 8: Extreme Compressive Force
  {
    name: "scene8.svg",
    title: "Tekanan Kompresi Jutaan Newton",
    content: `
      <rect width="1080" height="1920" fill="#18181b" />
      <linearGradient id="crushGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#dc2626" />
        <stop offset="50%" stop-color="#ea580c" />
        <stop offset="100%" stop-color="#dc2626" />
      </linearGradient>

      <!-- Two rails colliding -->
      <g transform="translate(0, 800)">
        <!-- Left Rail -->
        <rect x="40" y="0" width="460" height="140" rx="16" fill="#3f3f46" stroke="#e4e4e7" stroke-width="6" />
        <!-- Huge Rightward Arrow -->
        <polygon points="320,-60 480,70 320,200" fill="#ef4444" />
        
        <!-- Right Rail -->
        <rect x="580" y="0" width="460" height="140" rx="16" fill="#3f3f46" stroke="#e4e4e7" stroke-width="6" />
        <!-- Huge Leftward Arrow -->
        <polygon points="760,-60 600,70 760,200" fill="#ef4444" />

        <!-- Collision Spark Point -->
        <circle cx="540" cy="70" r="80" fill="#fbbf24" filter="url(#glow)" />
        <circle cx="540" cy="70" r="30" fill="#ffffff" />
      </g>

      <!-- Force meter badge -->
      <g transform="translate(240, 1180)">
        <rect x="0" y="0" width="600" height="200" rx="28" fill="#27272a" stroke="#f59e0b" stroke-width="5" />
        <text x="300" y="70" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="700" font-size="34" fill="#a1a1aa">TEKANAN KOMPRESI REL</text>
        <text x="300" y="150" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="64" fill="#ef4444">&gt; 1.000.000 N</text>
      </g>

      <!-- Thematic Badge -->
      <rect x="140" y="240" width="800" height="110" rx="28" fill="rgba(39, 39, 42, 0.95)" stroke="#ef4444" stroke-width="3" />
      <text x="540" y="310" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="44" fill="#fca5a5">TEKANAN TANPA CELAH</text>
    `,
  },

  // Scene 9: Steel Bends Sideways
  {
    name: "scene9.svg",
    title: "Baja Melengkung ke Samping",
    content: `
      <rect width="1080" height="1920" fill="#09090b" />
      
      <!-- Top-down view of tracks buckling -->
      <path d="M 540,1800 L 540,1400 Q 200,1050 540,700 L 540,400" fill="none" stroke="#64748b" stroke-width="34" stroke-linecap="round" />
      <path d="M 540,1800 L 540,1400 Q 200,1050 540,700 L 540,400" fill="none" stroke="#facc15" stroke-width="12" stroke-linecap="round" />

      <!-- Force vector pushing outward -->
      <g transform="translate(320, 1050)">
        <line x1="220" y1="0" x2="-60" y2="0" stroke="#ef4444" stroke-width="14" marker-end="url(#arrow)" />
        <polygon points="-80,0 -40,-30 -40,30" fill="#ef4444" />
        <text x="-90" y="-45" font-family="system-ui, sans-serif" font-weight="900" font-size="40" fill="#ef4444">DEFORMASI PLASTIS</text>
      </g>

      <text x="540" y="1520" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="800" font-size="44" fill="#ffffff">REL MELEPUH KARENA STRES</text>
      <text x="540" y="1590" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="600" font-size="32" fill="#94a3b8">Baja Mencari Ruang Terlemah untuk Melepas Tekanan</text>

      <!-- Thematic Badge -->
      <rect x="140" y="240" width="800" height="110" rx="28" fill="rgba(24, 24, 27, 0.95)" stroke="#eab308" stroke-width="3" />
      <text x="540" y="310" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="44" fill="#facc15">BATAS KELENTURAN LOGAM</text>
    `,
  },

  // Scene 10: Fishplate Expansion Joint Solution
  {
    name: "scene10.svg",
    title: "Penemuan Celah Dilatasi & Fishplate",
    content: `
      <rect width="1080" height="1920" fill="#0f172a" />
      
      <!-- Detailed Engineering Section of Fishplate Joint -->
      <g transform="translate(140, 720)">
        <rect x="0" y="0" width="800" height="340" rx="24" fill="#1e293b" stroke="#38bdf8" stroke-width="4" />
        
        <!-- Left & Right Rails with gap -->
        <rect x="40" y="120" width="320" height="100" rx="8" fill="#64748b" />
        <rect x="440" y="120" width="320" height="100" rx="8" fill="#64748b" />
        
        <!-- The expansion Gap (Celah) -->
        <rect x="360" y="120" width="80" height="100" fill="#0f172a" stroke="#f59e0b" stroke-width="4" stroke-dasharray="8,6" />
        
        <!-- The Fishplate (Pelat Sambung) with OVAL bolt slots -->
        <rect x="120" y="70" width="560" height="200" rx="16" fill="rgba(56, 189, 248, 0.2)" stroke="#38bdf8" stroke-width="6" />
        
        <!-- Oval Bolt Slots -->
        <ellipse cx="220" cy="170" rx="36" ry="22" fill="#0f172a" stroke="#ffffff" stroke-width="6" />
        <ellipse cx="320" cy="170" rx="36" ry="22" fill="#0f172a" stroke="#ffffff" stroke-width="6" />
        <ellipse cx="480" cy="170" rx="36" ry="22" fill="#0f172a" stroke="#ffffff" stroke-width="6" />
        <ellipse cx="580" cy="170" rx="36" ry="22" fill="#0f172a" stroke="#ffffff" stroke-width="6" />

        <!-- Bolt Caps -->
        <circle cx="220" cy="170" r="14" fill="#facc15" />
        <circle cx="320" cy="170" r="14" fill="#facc15" />
        <circle cx="480" cy="170" r="14" fill="#facc15" />
        <circle cx="580" cy="170" r="14" fill="#facc15" />
      </g>
      
      <!-- Callouts -->
      <text x="540" y="1200" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="44" fill="#38bdf8">LUBANG BAUT OVAL DILATASI</text>
      <text x="540" y="1270" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="600" font-size="34" fill="#cbd5e1">Baja Bebas Memuai &amp; Menyusut Aman</text>

      <!-- Thematic Badge -->
      <rect x="140" y="240" width="800" height="110" rx="28" fill="rgba(15, 23, 42, 0.9)" stroke="#38bdf8" stroke-width="3" />
      <text x="540" y="310" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="44" fill="#38bdf8">SOLUSI: PELAT SAMBUNGAN</text>
    `,
  },

  // Scene 11: Continuous Welded Rail (CWR)
  {
    name: "scene11.svg",
    title: "Rel Modern: Continuous Welded Rail",
    content: `
      <rect width="1080" height="1920" fill="#022c22" />
      <linearGradient id="modernRailBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#064e3b" />
        <stop offset="60%" stop-color="#022c22" />
        <stop offset="100%" stop-color="#021f18" />
      </linearGradient>
      <rect width="1080" height="1920" fill="url(#modernRailBg)" />
      
      <!-- Modern Concrete Sleepers (Bantalan Beton) -->
      ${Array.from({ length: 7 })
        .map((_, i) => {
          const y = 820 + i * 140;
          return `
          <rect x="180" y="${y}" width="720" height="60" rx="12" fill="#cbd5e1" stroke="#94a3b8" stroke-width="4" />
          <circle cx="340" cy="${y + 30}" r="16" fill="#10b981" />
          <circle cx="740" cy="${y + 30}" r="16" fill="#10b981" />
        `;
        })
        .join("\n")}
      
      <!-- Seamless Continuous Steel Rails -->
      <line x1="340" y1="500" x2="340" y2="1920" stroke="#f8fafc" stroke-width="32" stroke-linecap="round" />
      <line x1="740" y1="500" x2="740" y2="1920" stroke="#f8fafc" stroke-width="32" stroke-linecap="round" />

      <!-- Feature Pill Badges -->
      <g transform="translate(180, 580)">
        <rect x="0" y="0" width="720" height="90" rx="24" fill="rgba(6, 78, 59, 0.85)" stroke="#34d399" stroke-width="4" />
        <text x="360" y="58" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="38" fill="#a7f3d0">PENGELASAN TERMIT TANPA CELAH</text>
      </g>

      <!-- Thematic Badge -->
      <rect x="140" y="240" width="800" height="110" rx="28" fill="rgba(6, 78, 59, 0.95)" stroke="#10b981" stroke-width="3" />
      <text x="540" y="310" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="44" fill="#34d399">ERA CONTINUOUS WELDED RAIL</text>
    `,
  },

  // Scene 12: High Speed Bullet Train Future
  {
    name: "scene12.svg",
    title: "Kereta Cepat Menembus Masa Depan",
    content: `
      <rect width="1080" height="1920" fill="#030712" />
      <linearGradient id="futureSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#1e1b4b" />
        <stop offset="50%" stop-color="#4338ca" />
        <stop offset="85%" stop-color="#38bdf8" />
        <stop offset="100%" stop-color="#030712" />
      </linearGradient>
      <rect width="1080" height="1920" fill="url(#futureSky)" />
      
      <!-- Modern Viaduct Elevated Bridge -->
      <polygon points="120,1920 960,1920 720,1080 360,1080" fill="#1e293b" />
      
      <!-- Ultra Sleek High-Speed Bullet Train Nose -->
      <path d="M 540,780 C 420,860 340,1180 340,1450 L 740,1450 C 740,1180 660,860 540,780 Z" fill="#ffffff" stroke="#0ea5e9" stroke-width="8" />
      <!-- Aerodynamic Windshield -->
      <path d="M 540,880 C 470,930 430,1040 430,1120 L 650,1120 C 650,1040 610,930 540,880 Z" fill="#0f172a" stroke="#38bdf8" stroke-width="4" />
      
      <!-- Speed Light Trails -->
      <line x1="200" y1="600" x2="200" y2="1800" stroke="#38bdf8" stroke-width="12" opacity="0.6" stroke-dasharray="80,50" />
      <line x1="880" y1="600" x2="880" y2="1800" stroke="#38bdf8" stroke-width="12" opacity="0.6" stroke-dasharray="80,50" />

      <!-- Headlights -->
      <circle cx="420" cy="1280" r="30" fill="#fef08a" filter="url(#glow)" />
      <circle cx="660" cy="1280" r="30" fill="#fef08a" filter="url(#glow)" />

      <!-- Thematic Badge -->
      <rect x="140" y="240" width="800" height="110" rx="28" fill="rgba(15, 23, 42, 0.9)" stroke="#38bdf8" stroke-width="3" />
      <text x="540" y="310" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="44" fill="#ffffff">AMAN, CEPAT &amp; PRESISI</text>
    `,
  },
];

scenes.forEach((s) => {
  const filePath = path.join(imagesDir, s.name);
  fs.writeFileSync(filePath, svgWrapper(s.content), "utf-8");
  console.log("Created image:", s.name);
});

console.log("All 12 scene images created successfully!");
