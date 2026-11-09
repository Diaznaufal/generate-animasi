import fs from "fs";
import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

// ============================================================================
// 1. TEKS NARASI EKSPLANASI 3D (KENAPA BATA DISUSUN SELANG-SELING)
// ============================================================================
const NARRATION_PARAGRAPHS = [
  "Kalau kamu anyam bambu jadi dinding, kamu udah punya gedek.",
  "Tapi angin dan air hujan tembus, lama-lama bambunya lapuk.",
  "Jadi kamu cetak tanah liat jadi bata, terus dibakar sampai keras.",
  "Batanya kamu tumpuk direkatkan pakai adukan semen. Sekarang kamu punya tembok.",
  "Tapi kalau batanya ditumpuk lurus, sambungannya jadi segaris.",
  "Dikasih beban sedikit, temboknya langsung terbelah!",
  "Jadi batanya kamu susun selang-seling kayak main Lego.",
  "Sambungannya gak segaris lagi, bebannya menyebar ke bata sebelahnya.",
  "Tapi tembok yang berdiri sendiri gampang goyang.",
  "Makanya kamu beri bingkai beton: slof di bawah, kolom praktis di tiap sudut, dan ring balok di atas.",
  "Biar rapi dan gak rembes, ditutup plester lalu dihaluskan pakai acian.",
  "Selamat, kamu baru saja paham dasar konstruksi dinding rumah!",
];

const FULL_TEXT = NARRATION_PARAGRAPHS.join(" ");

// ============================================================================
// 2. HELPER BACA ENVIRONMENT DARI .env / .env.local
// ============================================================================
function loadEnv() {
  const envFiles = [".env.local", ".env"];
  const env = {};
  for (const file of envFiles) {
    const fullPath = path.resolve(file);
    if (fs.existsSync(fullPath)) {
      const lines = fs.readFileSync(fullPath, "utf-8").split("\n");
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          const val = trimmed.slice(eqIdx + 1).trim();
          if (!env[key]) env[key] = val;
        } else if (trimmed.length > 20 && !trimmed.includes(" ")) {
          // Fallback jika API key ditaruh tanpa nama variabel
          if (!env.ELEVENLABS_API_KEY) env.ELEVENLABS_API_KEY = trimmed;
        }
      }
    }
  }
  return { ...env, ...process.env };
}

const env = loadEnv();

// ============================================================================
// 3. PARSING ARGUMEN CLI (PROVIDER & VOICE)
// ============================================================================
// Penggunaan:
// node scripts/generate_voiceover.mjs (Default: Edge TTS - id-ID-ArdiNeural)
// node scripts/generate_voiceover.mjs --script=path/to/script.md (Membaca file naskah)
// node scripts/generate_voiceover.mjs --text="Naskah langsung di sini"
// node scripts/generate_voiceover.mjs --voice=id-ID-GadisNeural (Suara Wanita)
// node scripts/generate_voiceover.mjs --provider=elevenlabs (Beralih ke ElevenLabs)
const args = process.argv.slice(2);
function getArg(name, fallback) {
  const prefix = `--${name}=`;
  const match = args.find((a) => a.startsWith(prefix));
  if (match) return match.slice(prefix.length).trim();
  const flagIdx = args.indexOf(`--${name}`);
  if (flagIdx !== -1 && args[flagIdx + 1]) return args[flagIdx + 1].trim();
  return fallback;
}

const PROVIDER = getArg("provider", env.TTS_PROVIDER || "edge").toLowerCase();
const EDGE_VOICE = getArg("voice", env.EDGE_TTS_VOICE || "id-ID-ArdiNeural");
const ELEVEN_VOICE = getArg(
  "eleven-voice",
  env.ELEVENLABS_VOICE_ID || "pNInz6obpgDQGcFmaJgB",
); // Adam

// Ambil teks narasi dari file, parameter --text, atau fallback default
const scriptArg = getArg("script", null);
const directTextArg = getArg("text", null);
let textToSpeak = FULL_TEXT;

if (directTextArg) {
  textToSpeak = directTextArg;
} else if (scriptArg) {
  const scriptPath = path.resolve(scriptArg);
  if (fs.existsSync(scriptPath)) {
    console.log(`📄 Membaca naskah dari file: ${scriptPath}`);
    const rawContent = fs.readFileSync(scriptPath, "utf-8");
    // Bersihkan header markdown jika ada
    const cleaned = rawContent
      .split("\n")
      .filter((line) => !line.trim().startsWith("#") && !line.trim().startsWith("---"))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    if (cleaned) textToSpeak = cleaned;
  } else {
    console.warn(`⚠️  File naskah '${scriptArg}' tidak ditemukan, menggunakan naskah default.`);
  }
}

// ============================================================================
// 4. GENERATOR MICROSOFT EDGE TTS (100% GRATIS & TANPA API KEY)
// ============================================================================
async function generateEdgeTTS(text, voice) {
  console.log(`\n🎙️  [Provider: Microsoft Edge TTS - Gratis]`);
  console.log(`🔊 Voice ID: ${voice}`);
  console.log(
    `   (Pilihan suara: id-ID-GadisNeural [Wanita] / id-ID-ArdiNeural [Pria])`,
  );
  console.log(`📝 Total Karakter: ${text.length}`);

  // Simpan naskah ke file teks sementara berformat UTF-8 agar bebas masalah escaping tanda baca
  const tempTextFile = path.resolve("public/audio/_temp_script.txt");
  fs.writeFileSync(tempTextFile, text, "utf-8");

  const targetAudio = path.resolve("public/audio/narasi.mp3");

  try {
    console.log(`⏳ Sedang meng-generate audio dengan edge-tts...`);
    const pythonCmd = process.platform === "win32" ? "python" : "python3";
    await execFileAsync(pythonCmd, [
      "-m",
      "edge_tts",
      "--voice",
      voice,
      "-f",
      tempTextFile,
      "--write-media",
      targetAudio,
    ]);

    // Hapus file script sementara
    if (fs.existsSync(tempTextFile)) fs.unlinkSync(tempTextFile);

    const stat = fs.statSync(targetAudio);
    console.log(`✅ Audio Microsoft Edge TTS berhasil dibuat!`);
    console.log(
      `📁 Lokasi: ${targetAudio} (${(stat.size / 1024).toFixed(1)} KB)`,
    );

    // Backup ke public/narasi.mp3
    fs.copyFileSync(targetAudio, path.resolve("public/narasi.mp3"));
    console.log(`📁 Salinan: public/narasi.mp3`);
  } catch (err) {
    if (fs.existsSync(tempTextFile)) fs.unlinkSync(tempTextFile);
    console.error(`❌ Gagal menjalankan edge-tts:`, err.message);
    console.error(
      `   Pastikan 'edge-tts' terpasang dengan: pip install edge-tts`,
    );
    process.exit(1);
  }
}

// ============================================================================
// 5. GENERATOR ELEVENLABS API (UNTUK KEBUTUHAN FINAL)
// ============================================================================
async function generateElevenLabs(text, voiceId) {
  console.log(`\n🎙️  [Provider: ElevenLabs API]`);
  console.log(`🔊 Voice ID: ${voiceId}`);

  const apiKey = env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.error(
      `❌ Error: ELEVENLABS_API_KEY tidak ditemukan di .env atau .env.local.`,
    );
    console.error(
      `   Jika belum punya key, gunakan default Edge TTS (gratis): npm run generate-audio`,
    );
    process.exit(1);
  }

  if (!apiKey.startsWith("sk_")) {
    console.warn(
      `⚠️  Peringatan: Kunci ElevenLabs yang valid biasanya diawali dengan 'sk_'.`,
    );
  }

  console.log(`⏳ Menghubungi ElevenLabs API...`);
  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text: text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8,
            style: 0.35,
            use_speaker_boost: true,
          },
        }),
      },
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error(
        `❌ Gagal memanggil ElevenLabs (${response.status}):`,
        errText,
      );
      process.exit(1);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const targetAudio = path.resolve("public/audio/narasi.mp3");
    fs.writeFileSync(targetAudio, buffer);

    console.log(`✅ Audio ElevenLabs berhasil dibuat!`);
    console.log(
      `📁 Lokasi: ${targetAudio} (${(buffer.length / 1024).toFixed(1)} KB)`,
    );

    fs.copyFileSync(targetAudio, path.resolve("public/narasi.mp3"));
    console.log(`📁 Salinan: public/narasi.mp3`);
  } catch (err) {
    console.error(`❌ Kesalahan jaringan ElevenLabs:`, err.message);
    process.exit(1);
  }
}

// ============================================================================
// 6. MAIN CONTROLLER
// ============================================================================
async function main() {
  console.log("=================================================");
  console.log("🎬 Remotion Modular Voiceover Generator");
  console.log(`Topik/Cuplikan: "${textToSpeak.slice(0, 50)}..."`);
  console.log("=================================================");

  // Pastikan folder tujuan ada
  const outputDir = path.resolve("public/audio");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  if (PROVIDER === "elevenlabs") {
    await generateElevenLabs(textToSpeak, ELEVEN_VOICE);
  } else {
    // Default: Microsoft Edge TTS (Gratis, Tanpa API Key)
    await generateEdgeTTS(textToSpeak, EDGE_VOICE);
  }

  console.log("\n🎉 Selesai! Suara narasi siap diputar di Remotion Studio.");
  console.log("💡 Tips: Untuk beralih provider/naskah, jalankan:");
  console.log("   • Suara Pria (Default):  npm run generate-audio");
  console.log("   • Dari File Naskah:      npm run generate-audio -- --script=path/to/script.md");
  console.log("   • Suara Wanita:          npm run generate-audio -- --voice=id-ID-GadisNeural");
  console.log("   • ElevenLabs:            npm run generate-audio -- --provider=elevenlabs");
}

main();
