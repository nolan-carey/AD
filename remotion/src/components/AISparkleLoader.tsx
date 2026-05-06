import React from "react";
import { useCurrentFrame } from "remotion";
import { COLOR } from "../tokens";

interface AISparkleLoaderProps {
  size?: number;
  startFrame?: number;
}

// 8-petal rotating sparkle, clockwise. Each petal pulses out of phase.
export const AISparkleLoader: React.FC<AISparkleLoaderProps> = ({
  size = 64,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const t = frame - startFrame;
  const rotation = (t * 4) % 360;

  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
        transform: `rotate(${rotation}deg)`,
      }}
    >
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 45) * (Math.PI / 180);
        const phase = (t / 30 - i / 8) % 1;
        const opacity = 0.25 + 0.75 * Math.max(0, Math.sin(phase * Math.PI));
        const scale = 0.6 + 0.4 * Math.max(0, Math.sin(phase * Math.PI));
        const r = size * 0.36;
        const cx = size / 2 + Math.cos(angle) * r - 4;
        const cy = size / 2 + Math.sin(angle) * r - 4;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: cx,
              top: cy,
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: COLOR.aiPurple,
              opacity,
              transform: `scale(${scale})`,
              boxShadow: `0 0 8px ${COLOR.aiPurple}`,
            }}
          />
        );
      })}
    </div>
  );
};
