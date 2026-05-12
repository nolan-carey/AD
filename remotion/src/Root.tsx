import React from "react";
import { Composition } from "remotion";
import { KivaAd } from "./KivaAd";
import { FPS, TOTAL_FRAMES } from "./tokens";
import { kivaAdSchema } from "./tweaks";

// IMPORTANT — Remotion Studio's "Save defaults" button uses an AST rewriter
// that only works when `defaultProps` is an INLINE OBJECT LITERAL in the
// same file as <Composition>. Do NOT replace this with an imported const.
// (Tweak values you change in Studio get persisted here via that rewriter.)
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
      defaultProps={{
        scene1TypingStartFrame: 162,
        scene1FinalDingVolume: 0.92,
        scene1HeroPatelLandFrame: 8,
        scene2SwipeDurationFrames: 4,
        scene2LogoPunchPeakScale: 1.5,
        scene2LogoFinalScale: 1.0,
        scene2SparkleEnabled: true,
        scene2BgFlickerAmplitude: 0.05,
        enablePoofSfx: true,
        enableTypingClicks: false,
        enableMusicBed: false,
        bgGlowColor: "#3B82F6",
      }}
    />
  );
};
