import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLOR, EASE, SPRING } from "../tokens";
import { SFX, GEN } from "../audio";
import { KivaLogo } from "../components/KivaLogo";
import { PhoneFrame } from "../components/PhoneFrame";
import { SfxAt } from "../components/SfxAt";

// =====================================================================
// SCENE 2 — Logo → iPhone hero reveal (v1.20, frames 180–240)
// 60 frames @ 30fps · 2.0s · "Slow it down. Dramatic lighting sweep +
// slow camera push. THE hero reveal." (ad_plan §5)
//
// Beat-by-beat (local frames):
//   0–18  : Logo materializes — spring scale 0.8→1.1→1.0, glow pulse
//   12–32 : Dramatic lighting sweep travels L→R across the logo
//   24–48 : Logo Y-axis flips 0→180° as it morphs into the iPhone
//   42–60 : iPhone settles into 3D rest tilt; slow camera push completes
// File name kept (Scene2_VoiceCustomer.tsx) for git diff continuity —
// content is now Logo→iPhone reveal per v1.20 structural reset.
// =====================================================================

const LOGO_IN = 0;
const LIGHTING_SWEEP = 12;
const MORPH_START = 24;
const MORPH_END = 48;
const SCENE_END = 60;

export const Scene2VoiceCustomer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slow camera push 1.0 → 1.08 across the entire scene (cinematic, deliberate).
  const cameraScale = interpolate(frame, [0, SCENE_END], [1.0, 1.08], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOutQuad,
  });

  // Logo phase
  const logoSpring = spring({ frame, fps, config: SPRING.soft });
  const logoScale = interpolate(logoSpring, [0, 1], [0.8, 1.0]) +
    Math.max(0, logoSpring - 1) * 0.1; // overshoot to ~1.10 then settles to 1.0
  const logoGlow = 0.6 + 0.3 * Math.sin((frame / 24) * Math.PI * 2);
  // Logo fades out as morph kicks in
  const logoOpacity = interpolate(frame, [MORPH_START, MORPH_START + 6], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Lighting sweep — bright diagonal bar travels left → right across center
  const sweepP = interpolate(frame, [LIGHTING_SWEEP, LIGHTING_SWEEP + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOutQuad,
  });
  const sweepX = interpolate(sweepP, [0, 1], [-400, 2400]);

  // Morph: logo Y-flip 0→180° while iPhone materializes from the back side
  const morphP = interpolate(frame, [MORPH_START, MORPH_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  const yRot = morphP * 180;

  // iPhone reveal opacity comes in past the 90° flip
  const phoneOpacity = morphP > 0.5 ? interpolate(morphP, [0.5, 1], [0, 1]) : 0;
  const phoneScale = interpolate(morphP, [0.5, 1], [0.7, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        // Deeper navy than the cinematic shell so the logo "punches" out of darkness
        background: "rgba(0,0,0,0.25)",
      }}
    >
      {/* === LOGO + MORPH STAGE === */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          transform: `scale(${cameraScale})`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Logo (visible until morph midpoint) */}
        {frame < MORPH_END && (
          <div
            style={{
              position: "absolute",
              transform: `perspective(1500px) rotateY(${yRot}deg) scale(${logoScale})`,
              opacity: logoOpacity,
              transformStyle: "preserve-3d",
            }}
          >
            <KivaLogo size={300} glow={logoGlow} />
          </div>
        )}

        {/* iPhone (visible after morph midpoint) */}
        {morphP > 0.5 && (
          <div
            style={{
              position: "absolute",
              opacity: phoneOpacity,
              transform: `scale(${phoneScale})`,
              transformStyle: "preserve-3d",
            }}
          >
            <PhoneFrame scale={0.55}>
              <PreloadedDashboard />
            </PhoneFrame>
          </div>
        )}
      </AbsoluteFill>

      {/* === DRAMATIC LIGHTING SWEEP === */}
      {/* Bright diagonal bar travels L→R across center frame, ~30 frames */}
      {frame >= LIGHTING_SWEEP && frame < LIGHTING_SWEEP + 22 && (
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: sweepX,
            width: 480,
            background:
              "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.18) 35%, rgba(180,200,255,0.32) 50%, rgba(255,255,255,0.18) 65%, rgba(255,255,255,0) 100%)",
            transform: "skewX(-18deg)",
            mixBlendMode: "screen",
            filter: "blur(6px)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* === AUDIO === */}
      {/* Soft chime as the logo materializes (early scene 2) */}
      <SfxAt src={SFX.notification1} from={LOGO_IN} volume={0.4} playbackRate={0.8} />
      {/* iPhone morph whirr during the Y-flip + reveal */}
      <SfxAt src={GEN.morphWhirr} from={MORPH_START + 2} volume={0.35} />
      {/* Achievement-style chime as iPhone fully forms — celebratory beat */}
      <SfxAt src={GEN.achievement} from={MORPH_END - 4} volume={0.32} />
    </AbsoluteFill>
  );
};

// Minimal preloaded dashboard placeholder for the iPhone screen at reveal.
// Steve will deepen scene-content handoff in v1.21.
const PreloadedDashboard: React.FC = () => (
  <div
    style={{
      width: "100%",
      height: "100%",
      background: COLOR.bg,
      paddingTop: 56,
    }}
  >
    <div
      style={{
        background: COLOR.navy,
        margin: "0 14px",
        padding: 14,
        borderRadius: 12,
        height: 120,
      }}
    />
  </div>
);
