import React from "react";
import { interpolate } from "remotion";
import { COLOR, EASE } from "../tokens";

interface SheetContainerProps {
  // Local frames within the parent scene.
  frame: number;
  // Frame at which the sheet should start rising.
  riseAtFrame: number;
  // Frame at which the sheet should start dismissing (omit to leave open).
  dismissAtFrame?: number;
  // Sheet content.
  children: React.ReactNode;
  // Show the drag-handle pill at top.
  showHandle?: boolean;
  // Backdrop opacity at full settle (0–1).
  backdropOpacity?: number;
  // Top border radius — defaults to 24 (matches real Kiva sheets).
  topRadius?: number;
}

// Canonical sheet rise/dismiss per kiva_components_for_norm.md §4.4.
// Rise: 12 frames, SOFT_LAND-like easeOutCubic. Dismiss: 8 frames easeInCubic.
// Backdrop: rgba(0,0,0,0.55) fades in/out with the sheet.
export const SheetContainer: React.FC<SheetContainerProps> = ({
  frame,
  riseAtFrame,
  dismissAtFrame,
  children,
  showHandle = true,
  backdropOpacity = 0.55,
  topRadius = 24,
}) => {
  const RISE_FRAMES = 12;
  const DISMISS_FRAMES = 8;

  // Rise progress 0..1
  const riseP = interpolate(
    frame,
    [riseAtFrame, riseAtFrame + RISE_FRAMES],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE.outCubic,
    }
  );

  // Dismiss progress 0..1 (only if dismissAtFrame set)
  const dismissP =
    dismissAtFrame !== undefined
      ? interpolate(
          frame,
          [dismissAtFrame, dismissAtFrame + DISMISS_FRAMES],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: EASE.inCubic,
          }
        )
      : 0;

  // Combined Y offset — rise from below, then dismiss back below
  const yPercent = (1 - riseP) * 100 + dismissP * 100;
  const visibleOpacity = riseP - dismissP;

  // Don't render before rise begins
  if (frame < riseAtFrame - 1) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#000",
          opacity: backdropOpacity * Math.max(0, visibleOpacity),
          pointerEvents: "none",
        }}
      />
      {/* Sheet */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          background: COLOR.surface,
          borderTopLeftRadius: topRadius,
          borderTopRightRadius: topRadius,
          padding: "10px 16px 28px",
          maxHeight: "82%",
          transform: `translateY(${yPercent}%)`,
          boxShadow: "0 -8px 24px rgba(0,0,0,0.18)",
          overflow: "hidden",
        }}
      >
        {showHandle && (
          <div
            style={{
              alignSelf: "center",
              width: 36,
              height: 4,
              borderRadius: 2,
              background: COLOR.border,
              margin: "0 auto 14px",
            }}
          />
        )}
        {children}
      </div>
    </>
  );
};
