import React from "react";
import { Composition } from "remotion";
import { KivaAd } from "./KivaAd";
import { FPS, TOTAL_FRAMES } from "./tokens";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="KivaAd"
      component={KivaAd}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={1920}
      height={1080}
    />
  );
};
