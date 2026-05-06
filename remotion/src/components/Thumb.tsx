import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLOR, EASE } from "../tokens";
import { quickTapScale } from "../motion";

interface ThumbProps {
  // Position the thumb tip lands at, in pixels of the parent (the phone screen, 393×852 logical px).
  x: number;
  y: number;
  // Frame at which the tap-compress occurs.
  tapAtFrame: number;
  // Theme — dark scenes use white thumb, light scenes use navy.
  theme?: "light" | "dark";
  // Color of the ripple ring (matches the tapped element accent).
  rippleColor?: string;
  // Travel distance (off-screen origin → target). Default: 200 px diagonal from bottom-right.
  travelFromX?: number;
  travelFromY?: number;
}

// Reusable thumb interaction primitive — kiva_components_for_norm.md §4.1.
// Travel-in (8f) → tap compress (4f) → ripple (12f) → exit (6f).
export const Thumb: React.FC<ThumbProps> = ({
  x,
  y,
  tapAtFrame,
  theme = "dark",
  rippleColor,
  travelFromX = 220,
  travelFromY = 260,
}) => {
  const frame = useCurrentFrame();
  const TRAVEL_DURATION = 8;
  const RIPPLE_DURATION = 12;
  const EXIT_DURATION = 6;

  const travelStart = tapAtFrame - TRAVEL_DURATION;
  const exitStart = tapAtFrame + RIPPLE_DURATION;

  if (frame < travelStart - 1 || frame > exitStart + EXIT_DURATION) return null;

  // Travel-in
  const travelP = interpolate(
    frame,
    [travelStart, travelStart + TRAVEL_DURATION],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE.outCubic,
    }
  );
  const enterX = interpolate(travelP, [0, 1], [travelFromX, 0]);
  const enterY = interpolate(travelP, [0, 1], [travelFromY, 0]);
  const enterOpacity = interpolate(travelP, [0, 1], [0, 1]);

  // Tap compress 1.0 → 0.92 → 1.0 over 4 frames
  const tapT = frame - tapAtFrame;
  const tapScale =
    tapT >= 0 && tapT <= 4
      ? interpolate(tapT, [0, 2, 4], [1.0, 0.92, 1.0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;
  const compressedScale = tapScale * quickTapScale(frame, tapAtFrame);

  // Exit fade + slide back off-screen
  const exitP = interpolate(
    frame,
    [exitStart, exitStart + EXIT_DURATION],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE.inCubic,
    }
  );
  const exitX = interpolate(exitP, [0, 1], [0, travelFromX]);
  const exitY = interpolate(exitP, [0, 1], [0, travelFromY]);
  const exitOpacity = interpolate(exitP, [0, 1], [1, 0]);

  // Ripple — 0 to 80 px radius, opacity 0.4 → 0
  const rippleT = frame - tapAtFrame;
  const rippleScale = interpolate(rippleT, [0, RIPPLE_DURATION], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  const rippleOpacity = interpolate(rippleT, [0, RIPPLE_DURATION], [0.4, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rippleVisible = rippleT >= 0 && rippleT <= RIPPLE_DURATION;

  const thumbColor =
    theme === "light" ? "rgba(15,23,42,0.85)" : "rgba(255,255,255,0.9)";
  const finalRippleColor = rippleColor ?? COLOR.blue;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        pointerEvents: "none",
      }}
    >
      {/* Ripple */}
      {rippleVisible && (
        <div
          style={{
            position: "absolute",
            width: 160,
            height: 160,
            left: -80,
            top: -80,
            borderRadius: "50%",
            border: `3px solid ${finalRippleColor}`,
            transform: `scale(${rippleScale})`,
            opacity: rippleOpacity,
          }}
        />
      )}
      {/* Thumb tip silhouette */}
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: "50% 50% 50% 50% / 70% 70% 30% 30%",
          background: thumbColor,
          transform: `translate(${enterX + exitX - 40}px, ${
            enterY + exitY - 40
          }px) scale(${compressedScale})`,
          opacity: enterOpacity * exitOpacity,
          boxShadow: theme === "light" ? "none" : "0 4px 16px rgba(0,0,0,0.5)",
        }}
      />
    </div>
  );
};
