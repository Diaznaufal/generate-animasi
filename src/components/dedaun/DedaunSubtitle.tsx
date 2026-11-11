import React from "react";
import { useCurrentFrame } from "remotion";

export interface WordCue {
  text: string;
  startFrame: number;
  endFrame: number;
}

export interface DedaunSubtitleProps {
  words: WordCue[];
  top?: string;
  fontSize?: number;
}

export const DedaunSubtitle: React.FC<DedaunSubtitleProps> = ({
  words,
  top = "84%",
  fontSize = 46,
}) => {
  const frame = useCurrentFrame();

  if (!words || words.length === 0) return null;

  // Group words into phrases (roughly 3-4 words or split by punctuation/pauses)
  // Each phrase has a startFrame (first word start) and endFrame (last word end + hold)
  const phrases: { phraseWords: WordCue[]; startFrame: number; endFrame: number }[] = [];
  let currentGroup: WordCue[] = [];

  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    currentGroup.push(w);

    const isLastWord = i === words.length - 1;
    const hasPunctuation = /[.,?!]$/.test(w.text);
    const bigGapNext = !isLastWord && words[i + 1].startFrame - w.endFrame > 15;
    const reachedLength = currentGroup.length >= 4;

    if (isLastWord || hasPunctuation || bigGapNext || reachedLength) {
      phrases.push({
        phraseWords: currentGroup,
        startFrame: currentGroup[0].startFrame,
        endFrame: isLastWord ? currentGroup[currentGroup.length - 1].endFrame + 15 : words[i + 1].startFrame,
      });
      currentGroup = [];
    }
  }

  // Find active phrase
  const activePhrase = phrases.find(
    (p) => frame >= p.startFrame && frame < p.endFrame
  );

  if (!activePhrase) return null;

  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 12,
        padding: "0 60px",
        zIndex: 50,
        fontFamily: "'Poppins', 'Nunito', 'Segoe UI', sans-serif",
      }}
    >
      {activePhrase.phraseWords.map((w, idx) => {
        const isActive = frame >= w.startFrame && frame <= w.endFrame;

        return (
          <span
            key={idx}
            style={{
              fontSize,
              fontWeight: 800,
              padding: isActive ? "4px 16px" : "4px 4px",
              borderRadius: 8,
              backgroundColor: isActive ? "#facc15" : "transparent",
              color: isActive ? "#000000" : "#ffffff",
              WebkitTextStroke: isActive ? "none" : "2px rgba(0, 0, 0, 0.8)",
              paintOrder: "stroke fill",
              textShadow: isActive
                ? "none"
                : "0 3px 8px rgba(0, 0, 0, 0.8)",
              transition: "all 0.08s ease-out",
              letterSpacing: 0.5,
              display: "inline-block",
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};
