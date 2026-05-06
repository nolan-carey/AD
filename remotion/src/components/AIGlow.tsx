import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

interface AIGlowProps {
  // active = AI moment (mic listening, sparkle loader, generating quote, etc.)
  // idle = ambient blue
  state: "idle" | "active";
  // Frame at which the state most recently changed (for crossfade timing).
  // Pass the local frame at which `state` flipped so the crossfade is in sync
  // with the visual moment.
  changedAtFrame?: number;
  // Phone size on the 1920x1080 frame — defaults to 460x1000 (iPhone at 1.18 scale)
  phoneWidth?: number;
  phoneHeight?: number;
}

// =====================================================================
// AIGlow — soft halo behind the phone (ad_plan §3.7.2 + companion §5.0)
// idle  → rgba(59,130,246,0.35) blur 80px
// active → rgba(109,40,217,0.40) blur 120px
// 12-frame crossfade between states.
// =====================================================================

export const AIGlow: React.FC<AIGlowProps> = ({
  state,
  changedAtFrame = 0,
  phoneWidth = 460,
  phoneHeight = 1000,
}) => {
  const frame = useCurrentFrame();
  const t = frame - changedAtFrame;
  const transition = interpolate(t, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const isActive = state === "active";
  // Idle and active layered with crossfade
  const idleOpacity = isActive ? 1 - transition : 1;
  const activeOpacity = isActive ? transition : 1 - transition;
  // Width/height: 80% of phone size, centered
  const w = phoneWidth * 0.85;
  const h = phoneHeight * 0.85;
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%) translateZ(-30px)",
        width: w,
        height: h,
        pointerEvents: "none",
        zIndex: 5,
      }}
    >
      {/* Idle halo — blue */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: "rgba(59,130,246,0.35)",
          filter: "blur(80px)",
          opacity: idleOpacity,
        }}
      />
      {/* Active halo — purple, slightly larger blur */}
      <div
        style={{
          position: "absolute",
          inset: -20,
          borderRadius: "50%",
          background: "rgba(109,40,217,0.40)",
          filter: "blur(120px)",
          opacity: activeOpacity,
        }}
      />
    </div>
  );
};
