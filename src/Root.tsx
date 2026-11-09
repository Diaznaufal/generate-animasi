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
import {
  TimeForgeTest2D,
  DURATION_IN_FRAMES as TEST_DURATION,
  VIDEO_FPS as TEST_FPS,
  VIDEO_WIDTH as TEST_WIDTH,
  VIDEO_HEIGHT as TEST_HEIGHT,
} from "./TimeForgeTest10s";

import {
  ViolinSceneTrueTimeForge,
  DURATION_IN_FRAMES as VIOLIN_DURATION,
  VIDEO_FPS as VIOLIN_FPS,
  VIDEO_WIDTH as VIOLIN_WIDTH,
  VIDEO_HEIGHT as VIOLIN_HEIGHT,
} from "./ViolinSceneTrueTimeForge";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ViolinSceneTrueTimeForge"
        component={ViolinSceneTrueTimeForge}
        durationInFrames={VIOLIN_DURATION}
        fps={VIOLIN_FPS}
        width={VIOLIN_WIDTH}
        height={VIOLIN_HEIGHT}
      />
      <Composition
        id="TimeForgeTest2D"
        component={TimeForgeTest2D}
        durationInFrames={TEST_DURATION}
        fps={TEST_FPS}
        width={TEST_WIDTH}
        height={TEST_HEIGHT}
      />
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
