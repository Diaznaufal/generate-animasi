# Remotion Explainer Video Project

Repository for producing high-retention 3D explainer videos (1080x1920, 9:16 vertical for Shorts, TikTok, and Reels) using Remotion, React 19, Three.js, and TTS pipelines.

## Common Commands

- **Preview Studio:** `npm run dev` (starts Remotion Studio)
- **Render Video:** `npx remotion render SusunanBataExplainer out/video.mp4`
- **Lint & Typecheck:** `npm run lint` (`eslint src && tsc`)
- **Generate Voiceover:** `npm run generate-audio` (`node scripts/generate_voiceover.mjs`)
  - Default: Microsoft Edge TTS (`id-ID-GadisNeural` / `id-ID-ArdiNeural`, free)
  - ElevenLabs option: `node scripts/generate_voiceover.mjs --provider=elevenlabs`

## Architecture & Composition Rules

1. **Modular Sequences (`<Series>` & `<Series.Sequence>`):**
   - Structure compositions shot-by-shot using `<Series>` and `<Series.Sequence>`.
   - Each sequence duration must correspond directly to the narration timing for that scene.
   - Place background audio globally outside `<Series>` so it plays continuously without cuts.

2. **Camera & Motion Dynamics:**
   - Keep camera active in every sequence using `interpolate` or `spring` (slow zoom, subtle pan, or orbit).
   - Use dramatic camera cuts between major sequence transitions (e.g., wide overview to close-up detail).

3. **3D Scene Space (Three.js / React Three Fiber):**
   - Ground plane sits at $Y = 0$. All structures, props, and characters rest on or above the ground ($Y \ge 0$).
   - Camera elevation operates at eye-level or elevated angles ($Y = 2.2$ to $4.5$) with `lookAt(0, 1.2, 0)`. Avoid looking up from underground.
   - Daylight environment: natural daylighting with directional sunlight, soft ambient sky light, and clear horizon.

4. **Dynamic Captions (Subtitle System):**
   - **Font Size:** 24px - 28px (proportional for 9:16 portrait without obstructing 3D objects).
   - **Typography:** Ultra-bold uppercase sans-serif (`font-weight: 900`).
   - **Active Highlight:** Solid yellow (`#FACC15`) with text shadow for readability.
   - **Container:** Positioned at `bottom: 90px`, semi-transparent backdrop blur (`backdrop-blur-md` / rgba dark background).
   - **Pacing:** Synchronize word highlighting with narrator speech (~3-4 words/second). Words must stay highlighted until spoken, never racing ahead of audio.

5. **Audio-Driven Timing:**
   - Calculate `DURATION_IN_FRAMES` directly from audio duration:
     `durationInFrames = Math.ceil(audioDurationInSeconds * FPS)`
   - Never hardcode or guess video duration without verifying `public/audio/narasi.mp3`.

## Skills & Reference Workflows

- **`channel-atm`:** Reverse-engineering dan ATM channel referensi YouTube (analisis 30 FPS lighting, contrast, shadow, camera motion, editing cadence, dan naskah/storytelling).
- **`viral-3d-explainer`:** SOP gate kualitas multi-environment 3D explainer style comic/clay.
- **`animation-director`:** SOP komposisi scene Remotion, audio-sync, dan dynamic captions.

