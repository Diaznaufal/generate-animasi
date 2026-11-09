import asyncio
import json
import math
import os
import sys
import edge_tts

# FPS default Remotion
FPS = 30
DEFAULT_VOICE = "id-ID-ArdiNeural"

async def generate_aligned(script_path, output_audio_path, output_json_path, voice=DEFAULT_VOICE):
    with open(script_path, "r", encoding="utf-8") as f:
        text = f.read().strip()

    # Filter out markdown headings or comments
    clean_lines = []
    for line in text.split("\n"):
        line_s = line.strip()
        if not line_s or line_s.startswith("#") or line_s.startswith("---") or line_s.startswith(">"):
            continue
        clean_lines.append(line_s)
    clean_text = " ".join(clean_lines)

    print(f"🎙️ Generating voiceover & word timestamps for: {len(clean_text)} characters")
    print(f"🔊 Voice: {voice}")

    communicate = edge_tts.Communicate(clean_text, voice, boundary="WordBoundary")

    audio_chunks = []
    raw_words = []

    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            audio_chunks.append(chunk["data"])
        elif chunk["type"] == "WordBoundary":
            # offset and duration are in 100-nanosecond units (10^-7 seconds)
            start_sec = chunk["offset"] / 10_000_000
            dur_sec = chunk["duration"] / 10_000_000
            end_sec = start_sec + dur_sec
            word_str = chunk["text"].strip().upper()
            if word_str:
                raw_words.append({
                    "text": word_str,
                    "start": start_sec,
                    "end": end_sec,
                    "startFrame": int(round(start_sec * FPS)),
                    "endFrame": int(round(end_sec * FPS)),
                })

    # Save audio file
    os.makedirs(os.path.dirname(output_audio_path), exist_ok=True)
    with open(output_audio_path, "wb") as f:
        for chunk in audio_chunks:
            f.write(chunk)
    print(f"✅ Audio saved to: {output_audio_path}")

    # Copy to public/narasi.mp3 if needed
    if "public/audio" in output_audio_path:
        with open("public/narasi.mp3", "wb") as f:
            for chunk in audio_chunks:
                f.write(chunk)

    print(f"📝 Total words detected: {len(raw_words)}")

    # Group words into punchy TimeForge 1-3 word chunks
    kinetic_chunks = []
    i = 0
    while i < len(raw_words):
        w1 = raw_words[i]
        chunk_words = [w1["text"]]
        s_frame = w1["startFrame"]
        e_frame = w1["endFrame"]

        # Add 2nd word if gap is short (< 8 frames / ~0.25s)
        if i + 1 < len(raw_words):
            w2 = raw_words[i + 1]
            if (w2["startFrame"] - e_frame) <= 8 and len(w1["text"]) + len(w2["text"]) <= 16:
                chunk_words.append(w2["text"])
                e_frame = w2["endFrame"]
                i += 1

                # Add 3rd word if both are short
                if i + 1 < len(raw_words):
                    w3 = raw_words[i + 1]
                    if (w3["startFrame"] - e_frame) <= 6 and sum(len(x) for x in chunk_words) + len(w3["text"]) <= 18:
                        chunk_words.append(w3["text"])
                        e_frame = w3["endFrame"]
                        i += 1

        phrase = " ".join(chunk_words)

        # Extend hold slightly so words don't flash off abruptly
        kinetic_chunks.append({
            "text": phrase,
            "startFrame": s_frame,
            "endFrame": e_frame + 4,
            "emphasis": any(ch in phrase for ch in ["!", "?", "FRUSTRASI", "JEBOL", "INDONESIA", "RAHASIANYA", "TOTAL", "METER"])
        })
        i += 1

    # Strict sequence: ensure no overlapping or flickering gaps between cues
    for k in range(len(kinetic_chunks) - 1):
        curr = kinetic_chunks[k]
        nxt = kinetic_chunks[k + 1]
        # Current cue ends exactly when next cue starts (or slightly before if pause is long)
        if curr["endFrame"] > nxt["startFrame"]:
            curr["endFrame"] = nxt["startFrame"]
        elif nxt["startFrame"] - curr["endFrame"] <= 12:
            curr["endFrame"] = nxt["startFrame"]

    os.makedirs(os.path.dirname(output_json_path), exist_ok=True)
    with open(output_json_path, "w", encoding="utf-8") as f:
        json.dump(kinetic_chunks, f, indent=2, ensure_ascii=False)

    print(f"✅ Aligned subtitle cues saved to: {output_json_path}")
    print(f"📊 Total Kinetic Cues: {len(kinetic_chunks)}")

    # Print cues as copy-pasteable TSX array
    print("\n--- COPYABLE TSX CUES ---")
    print("const SUBTITLE_WORDS: KineticWord[] = [")
    for c in kinetic_chunks:
        emph = ", emphasis: true" if c["emphasis"] else ""
        print(f'  {{ text: "{c["text"]}", startFrame: {c["startFrame"]}, endFrame: {c["endFrame"]}{emph} }},')
    print("];\n")

if __name__ == "__main__":
    script_file = sys.argv[1] if len(sys.argv) > 1 else "content/benteng-buton/script.md"
    audio_file = sys.argv[2] if len(sys.argv) > 2 else "public/audio/narasi.mp3"
    json_file = sys.argv[3] if len(sys.argv) > 3 else "content/benteng-buton/subtitles_aligned.json"
    voice_name = sys.argv[4] if len(sys.argv) > 4 else DEFAULT_VOICE

    asyncio.run(generate_aligned(script_file, audio_file, json_file, voice_name))
