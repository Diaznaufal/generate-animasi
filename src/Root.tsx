import React from "react";
import { Composition } from "remotion";
import {
  SusunanBataExplainer,
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_WIDTH,
  VIDEO_HEIGHT,
} from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SusunanBataExplainer"
        component={SusunanBataExplainer}
        durationInFrames={DURATION_IN_FRAMES}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
    </>
  );
};
