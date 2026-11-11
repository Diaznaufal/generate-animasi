import asyncio
import json
import os
import sys
import edge_tts

FPS = 30
VOICE = "id-ID-ArdiNeural"
RATE = "-10%"

async def main(script_path, audio_out, json_out):
    with open(script_path, "r", encoding="utf-8") as f:
        text = " ".join(line.strip() for line in f if line.strip() and not line.startswith(("#", "---", ">")))

    print(f"Generating Dedaun voiceover for: {text}")
    communicate = edge_tts.Communicate(text, VOICE, rate=RATE, boundary="WordBoundary")

    audio_chunks = []
    raw_words = []

    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            audio_chunks.append(chunk["data"])
        elif chunk["type"] == "WordBoundary":
            start_sec = chunk["offset"] / 10_000_000
            dur_sec = chunk["duration"] / 10_000_000
            end_sec = start_sec + dur_sec
            w = chunk["text"].strip()
            if w:
                raw_words.append({
                    "text": w,
                    "startFrame": int(round(start_sec * FPS)),
                    "endFrame": int(round(end_sec * FPS)),
                    "startSec": round(start_sec, 3),
                    "endSec": round(end_sec, 3)
                })

    os.makedirs(os.path.dirname(audio_out), exist_ok=True)
    with open(audio_out, "wb") as f:
        for c in audio_chunks:
            f.write(c)

    # Calculate audio duration
    total_frames = raw_words[-1]["endFrame"] + 15 if raw_words else 300
    data = {
        "words": raw_words,
        "totalFrames": total_frames,
        "durationSeconds": round(total_frames / FPS, 2)
    }

    os.makedirs(os.path.dirname(json_out), exist_ok=True)
    with open(json_out, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"Saved audio: {audio_out} ({data['durationSeconds']}s / {total_frames} frames)")
    print(f"Saved timestamps: {json_out} ({len(raw_words)} words)")

if __name__ == "__main__":
    s_in = sys.argv[1]
    a_out = sys.argv[2]
    j_out = sys.argv[3]
    asyncio.run(main(s_in, a_out, j_out))
