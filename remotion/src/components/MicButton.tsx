import React from "react";
import { useCurrentFrame } from "remotion";
import { COLOR } from "../tokens";
import { pulseInRing } from "../motion";

interface MicButtonProps {
  startFrame?: number; // when the rings start pulsing
  recording?: boolean; // when true: red core (matches real app)
  size?: "default" | "hero"; // hero = bigger ring stack for VoiceQuote screen
}

// Kiva real-app spec: 64 px navy core + 88 px ring 1 + 110 px ring 2,
// shadow blue rgba(59,130,246,0.45). Loop scale 0.85→1.0 over 60f / 2s with
// 30-frame phase offset between ring 1 and ring 2 — PULSE_IN preset.
export const MicButton: React.FC<MicButtonProps> = ({
  startFrame = 0,
  recording = false,
  size = "default",
}) => {
  const frame = useCurrentFrame();
  const ringScale = size === "hero" ? 1.18 : 1;

  const ring1 = pulseInRing(frame, startFrame, 0);
  const ring2 = pulseInRing(frame, startFrame, 30);

  const coreColor = recording ? "#EF4444" : COLOR.navy;
  const shadowColor = recording ? "#EF4444" : "rgba(59,130,246,0.45)";

  return (
    <div
      style={{
        position: "relative",
        width: 110 * ringScale,
        height: 110 * ringScale,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Ring 2 (outer 110) */}
      <div
        style={{
          position: "absolute",
          width: 110 * ringScale,
          height: 110 * ringScale,
          borderRadius: "50%",
          background: COLOR.blue,
          transform: `scale(${ring2.scale})`,
          opacity: ring2.opacity,
        }}
      />
      {/* Ring 1 (88) */}
      <div
        style={{
          position: "absolute",
          width: 88 * ringScale,
          height: 88 * ringScale,
          borderRadius: "50%",
          background: COLOR.blue,
          transform: `scale(${ring1.scale})`,
          opacity: ring1.opacity * 1.4,
        }}
      />
      {/* Core (64 navy) */}
      <div
        style={{
          width: 64 * ringScale,
          height: 64 * ringScale,
          borderRadius: "50%",
          background: coreColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 4px 14px ${shadowColor}`,
        }}
      >
        <MicGlyph size={26 * ringScale} />
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
