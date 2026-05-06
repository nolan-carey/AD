import { interpolate, spring, Easing } from "remotion";

// =====================================================================
// 6 canonical motion presets — kiva_components_for_norm.md §3.1
// Every animation in the ad should use one of these. Keeps the visual
// language coherent with the real Kiva product (which uses RN Animated
// with similar damping/stiffness across the codebase).
// =====================================================================

export const MOTION = {
  // POP_IN — bouncy entrance with slight overshoot. Cards, badges, pins, items.
  popIn: {
    config: { damping: 14, mass: 0.8, stiffness: 220 },
  },
  // SOFT_LAND — sheets/modals rising. Smooth, no overshoot, premium.
  softLand: {
    config: { damping: 18, mass: 1.1, stiffness: 160 },
  },
  // QUICK_TAP — button compress 1→0.96→1 over 8 frames.
  quickTap: { duration: 8 },
  // FADE_RISE — toasts, banners, hint text. opacity 0→1 over 6f + translateY 8→0.
  fadeRise: {
    duration: 6,
    travelY: 8,
    config: { damping: 16, mass: 1, stiffness: 180 },
  },
  // PULSE_IN — mic ring / AI processing. scale 0.85→1.0 + opacity 0.15→0 over 60f.
  pulseIn: { duration: 60 },
  // STATUS_FLIP — Sent → Accepted etc. Cross-fade bg over 8f + scale 1→1.06→1.
  statusFlip: { duration: 8 },
} as const;

// === Helper: POP_IN scale value at given frame (returns spring 0..1+overshoot) ===
export function popInProgress(frame: number, fps: number, startFrame = 0): number {
  return spring({
    frame: frame - startFrame,
    fps,
    config: MOTION.popIn.config,
  });
}

// === Helper: SOFT_LAND progress 0..1 at given frame ===
export function softLandProgress(frame: number, fps: number, startFrame = 0): number {
  return spring({
    frame: frame - startFrame,
    fps,
    config: MOTION.softLand.config,
  });
}

// === Helper: QUICK_TAP scale curve 1→0.96→1 over 8 frames from `tapFrame` ===
export function quickTapScale(frame: number, tapFrame: number): number {
  const t = frame - tapFrame;
  if (t < 0 || t > MOTION.quickTap.duration) return 1;
  return interpolate(t, [0, 4, 8], [1, 0.96, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

// === Helper: FADE_RISE progress (opacity 0..1, translateY value) ===
export function fadeRise(
  frame: number,
  fps: number,
  startFrame = 0
): { opacity: number; y: number } {
  const sp = spring({
    frame: frame - startFrame,
    fps,
    config: MOTION.fadeRise.config,
  });
  return {
    opacity: interpolate(sp, [0, 1], [0, 1]),
    y: interpolate(sp, [0, 1], [MOTION.fadeRise.travelY, 0]),
  };
}

// === Helper: PULSE_IN values for ring (scale, opacity) ===
// Loops every `duration` frames. Returns scale 0.85→1.0 and opacity 0.15→0.
export function pulseInRing(
  frame: number,
  startFrame = 0,
  phaseOffsetFrames = 0,
  duration = MOTION.pulseIn.duration
): { scale: number; opacity: number } {
  const t = ((frame - startFrame + phaseOffsetFrames) % duration) / duration;
  return {
    scale: 0.85 + 0.15 * t,
    opacity: 0.15 * (1 - t),
  };
}

// === Helper: STATUS_FLIP progress (0 = old, 1 = new) ===
export function statusFlipProgress(frame: number, flipFrame: number): number {
  const t = frame - flipFrame;
  if (t < 0) return 0;
  if (t >= MOTION.statusFlip.duration) return 1;
  return interpolate(t, [0, MOTION.statusFlip.duration], [0, 1], {
    easing: Easing.bezier(0.4, 0, 0.2, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

// === Status-flip scale pulse: 1.0 → 1.06 → 1.0 over `duration` frames ===
export function statusFlipScale(frame: number, flipFrame: number): number {
  const t = frame - flipFrame;
  const half = MOTION.statusFlip.duration / 2;
  if (t < 0 || t > MOTION.statusFlip.duration) return 1;
  return interpolate(t, [0, half, MOTION.statusFlip.duration], [1, 1.06, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}
