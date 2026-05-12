// =====================================================================
// Studio tweaks — exposes the most-touched timing & toggle knobs as
// editable props in Remotion Studio's Props panel.
//
// Open the Studio sidebar, drag the sliders, toggle the switches, and the
// preview updates live without code edits.
//
// Adding a new knob:
//   1. Add a field to `kivaAdSchema` below with a sensible min/max default
//   2. Read it in your scene via `const tweaks = useTweaks()`
//   3. Replace the hardcoded constant with `tweaks.yourFieldName`
// =====================================================================

import { z } from "zod";
import { createContext, useContext } from "react";
import { zColor } from "@remotion/zod-types";

export const kivaAdSchema = z.object({
  // ───── Scene 1 — Overwhelm ─────
  scene1TypingStartFrame: z
    .number()
    .min(120)
    .max(220)
    .step(1)
    .describe("Scene 1 · frame typing begins (cursor onset = 8 f before)"),
  scene1FinalDingVolume: z
    .number()
    .min(0)
    .max(1)
    .step(0.01)
    .describe("Scene 1 · loudest ding volume (climactic card 18)"),
  scene1HeroPatelLandFrame: z
    .number()
    .min(8)
    .max(40)
    .step(1)
    .describe("Scene 1 · Mrs. Patel hero card lands"),

  // ───── Scene 2 — Brand phase + feature flash ─────
  scene2SwipeDurationFrames: z
    .number()
    .min(2)
    .max(20)
    .step(1)
    .describe("Scene 2 · swipe-up veil duration (smaller = snappier wipe)"),
  scene2LogoPunchPeakScale: z
    .number()
    .min(1.0)
    .max(2.0)
    .step(0.05)
    .describe("Scene 2 · logo punch peak scale (1.5 = +50%)"),
  scene2LogoFinalScale: z
    .number()
    .min(1.0)
    .max(2.0)
    .step(0.05)
    .describe("Scene 2 · logo settled rest scale"),
  scene2SparkleEnabled: z
    .boolean()
    .describe("Scene 2 · show the top-right twinkle on the chevron"),
  scene2BgFlickerAmplitude: z
    .number()
    .min(0)
    .max(0.2)
    .step(0.01)
    .describe("Scene 2 · blue glow flicker depth (0 = static, 0.2 = pronounced)"),
  // ───── Audio toggles ─────
  enablePoofSfx: z
    .boolean()
    .describe("Audio · play poof SFX on each feature's outcome word"),
  enableTypingClicks: z
    .boolean()
    .describe("Audio · play sparse click on each typed character"),
  enableMusicBed: z
    .boolean()
    .describe("Audio · play the music bed (requires bed.mp3 in /sound/music/)"),

  // ───── Visual identity tweaks ─────
  bgGlowColor: zColor().describe(
    "Scene 2 · color of the centered logo's radial glow halo (default Kiva blue)"
  ),
});

export type KivaAdTweaks = z.infer<typeof kivaAdSchema>;

// Default values — match the current as-built behavior (so the default
// render is identical to before; the props panel just makes things
// adjustable from here).
export const DEFAULT_TWEAKS: KivaAdTweaks = {
  scene1TypingStartFrame: 162,
  scene1FinalDingVolume: 0.92,
  scene1HeroPatelLandFrame: 14,

  scene2SwipeDurationFrames: 4,
  scene2LogoPunchPeakScale: 1.5,
  scene2LogoFinalScale: 1.4,
  scene2SparkleEnabled: true,
  scene2BgFlickerAmplitude: 0.05,

  enablePoofSfx: true,
  enableTypingClicks: false,
  enableMusicBed: false,

  bgGlowColor: "#3B82F6",
};

// =====================================================================
// Context — every scene + component reads tweaks via useTweaks().
// KivaAd provides the value; child components consume it.
// =====================================================================

export const TweaksContext = createContext<KivaAdTweaks>(DEFAULT_TWEAKS);

export const useTweaks = (): KivaAdTweaks => useContext(TweaksContext);
