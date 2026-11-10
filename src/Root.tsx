import React from "react";
import { Composition } from "remotion";
import {
  BentengButonExplainer,
  DURATION_IN_FRAMES as BUTON_DURATION,
  VIDEO_FPS as BUTON_FPS,
  VIDEO_WIDTH as BUTON_WIDTH,
  VIDEO_HEIGHT as BUTON_HEIGHT,
} from "./BentengButonExplainer";
import {
  CetbangMajapahitExplainer,
  DURATION_IN_FRAMES as CETBANG_DURATION,
  VIDEO_FPS as CETBANG_FPS,
  VIDEO_WIDTH as CETBANG_WIDTH,
  VIDEO_HEIGHT as CETBANG_HEIGHT,
} from "./CetbangMajapahitExplainer";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CetbangMajapahitExplainer"
        component={CetbangMajapahitExplainer}
        durationInFrames={CETBANG_DURATION}
        fps={CETBANG_FPS}
        width={CETBANG_WIDTH}
        height={CETBANG_HEIGHT}
      />
      <Composition
        id="BentengButonExplainer"
        component={BentengButonExplainer}
        durationInFrames={BUTON_DURATION}
        fps={BUTON_FPS}
        width={BUTON_WIDTH}
        height={BUTON_HEIGHT}
      />
    </>
  );
};
