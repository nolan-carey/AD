import React from "react";
import { Composition } from "remotion";
import { KivaAd } from "./KivaAd";
import { FPS, TOTAL_FRAMES } from "./tokens";
import { kivaAdSchema, DEFAULT_TWEAKS } from "./tweaks";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="KivaAd"
      component={KivaAd}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={1920}
      height={1080}
      schema={kivaAdSchema}
      defaultProps={DEFAULT_TWEAKS}
    />
  );
};
