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
import {
  BentengDedaunExplainer,
  DURATION_IN_FRAMES as BENTENG_DEDAUN_DURATION,
  VIDEO_FPS as BENTENG_DEDAUN_FPS,
  VIDEO_WIDTH as BENTENG_DEDAUN_WIDTH,
  VIDEO_HEIGHT as BENTENG_DEDAUN_HEIGHT,
} from "./BentengDedaunExplainer";
import {
  DedaunTest10s,
  DURATION_IN_FRAMES as DEDAUN_DURATION,
  VIDEO_FPS as DEDAUN_FPS,
  VIDEO_WIDTH as DEDAUN_WIDTH,
  VIDEO_HEIGHT as DEDAUN_HEIGHT,
} from "./DedaunTest10s";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="BentengDedaunExplainer"
        component={BentengDedaunExplainer}
        durationInFrames={BENTENG_DEDAUN_DURATION}
        fps={BENTENG_DEDAUN_FPS}
        width={BENTENG_DEDAUN_WIDTH}
        height={BENTENG_DEDAUN_HEIGHT}
      />
      <Composition
        id="DedaunTest10s"
        component={DedaunTest10s}
        durationInFrames={DEDAUN_DURATION}
        fps={DEDAUN_FPS}
        width={DEDAUN_WIDTH}
        height={DEDAUN_HEIGHT}
      />
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
