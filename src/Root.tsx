import React from "react";
import { Composition } from "remotion";
import {
  SusunanBataExplainer,
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_WIDTH,
  VIDEO_HEIGHT,
} from "./Composition";
import {
  BentengButonExplainer,
  DURATION_IN_FRAMES as BUTON_DURATION,
  VIDEO_FPS as BUTON_FPS,
  VIDEO_WIDTH as BUTON_WIDTH,
  VIDEO_HEIGHT as BUTON_HEIGHT,
} from "./BentengButonExplainer";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="BentengButonExplainer"
        component={BentengButonExplainer}
        durationInFrames={BUTON_DURATION}
        fps={BUTON_FPS}
        width={BUTON_WIDTH}
        height={BUTON_HEIGHT}
      />
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
