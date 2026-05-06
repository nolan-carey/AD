import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLOR } from "../tokens";

interface PulsingMicProps {
  size?: number; // core button diameter
  intensity?: number; // 0–1 (0 = subtle, 1 = heavy active state)
  startFrame?: number; // local frame at which pulsing begins (anything before = idle)
}

export const PulsingMic: React.FC<PulsingMicProps> = ({
  size = 64,
  intensity = 1,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const t = frame - startFrame;

  // Two staggered concentric rings
  const ring1Phase = ((t % 30) / 30) * Math.PI * 2;
  const ring2Phase = (((t + 15) % 30) / 30) * Math.PI * 2;

  const ring1Scale = 1 + 0.4 * intensity * (0.5 + 0.5 * Math.sin(ring1Phase));
  const ring2Scale = 1 + 0.7 * intensity * (0.5 + 0.5 * Math.sin(ring2Phase));
  const ring1Opacity = (0.55 - 0.55 * (ring1Scale - 1)) * intensity;
  const ring2Opacity = (0.4 - 0.3 * (ring2Scale - 1)) * intensity;

  const corePulse = 1 + 0.04 * intensity * Math.sin((t / 12) * Math.PI * 2);

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Ring 2 (outer) */}
      <div
        style={{
          position: "absolute",
          width: size,
          height: size,
          borderRadius: "50%",
          background: COLOR.blue,
          transform: `scale(${ring2Scale})`,
          opacity: Math.max(0, ring2Opacity),
        }}
      />
      {/* Ring 1 */}
      <div
        style={{
          position: "absolute",
          width: size,
          height: size,
          borderRadius: "50%",
          background: COLOR.blue,
          transform: `scale(${ring1Scale})`,
          opacity: Math.max(0, ring1Opacity),
        }}
      />
      {/* Core button */}
      <div
        style={{
          position: "relative",
          width: size,
          height: size,
          borderRadius: "50%",
          background: COLOR.blue,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${corePulse})`,
          boxShadow: `0 8px 24px rgba(59,130,246,${0.5 * intensity})`,
        }}
      >
        <MicGlyph size={size * 0.42} />
      </div>
    </div>
  );
};

const MicGlyph: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 14a3 3 0 0 0 3-3V7a3 3 0 1 0-6 0v4a3 3 0 0 0 3 3Z"
      fill="white"
    />
    <path
      d="M19 11a1 1 0 1 0-2 0 5 5 0 0 1-10 0 1 1 0 1 0-2 0 7 7 0 0 0 6 6.92V21a1 1 0 1 0 2 0v-3.08A7 7 0 0 0 19 11Z"
      fill="white"
    />
  </svg>
);
