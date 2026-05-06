import React from "react";
import { Sequence } from "remotion";
import { Audio } from "@remotion/media";

interface SfxAtProps {
  src: string;
  from: number;
  volume?: number | ((f: number) => number);
  playbackRate?: number;
  toneFrequency?: number;
  loop?: boolean;
  durationInFrames?: number;
}

// Schedule a one-shot SFX at a local frame within the parent Sequence.
export const SfxAt: React.FC<SfxAtProps> = ({
  src,
  from,
  volume = 1,
  playbackRate,
  toneFrequency,
  loop,
  durationInFrames,
}) => {
  return (
    <Sequence from={from} layout="none" durationInFrames={durationInFrames}>
      <Audio
        src={src}
        volume={volume}
        playbackRate={playbackRate}
        toneFrequency={toneFrequency}
        loop={loop}
      />
    </Sequence>
  );
};
