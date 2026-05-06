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
// SCENE 2 — Reset transition + Logo → iPhone reveal (v1.21, frames 180–240)
// 60 frames @ 30fps · 2.0s
// (file kept as Scene2_VoiceCustomer.tsx for git diff continuity — content
//  rebuilt verbatim from §6 user storyboard)
//
// Beats (verbatim from user storyboard):
//   • Everything freezes briefly. Cinematic horizontal swipe clears clutter.
//   • Kiva logo appears centered. Tagline below: "Blue collar solutions to
//     blue collar problems". Large cursor enters from right; clicks logo.
//   • Logo compresses + blue ripple pulse + 3D rotation morphs into iPhone.
//   • Floating 3D iPhone appears. Slow camera push. Soft blue rim lighting.
//   • Phone rotates from side angle into front-facing hero angle.
//   • Vertical blue light sweep travels down screen → dashboard fades in.
//   • Bottom-center: "All your admin. One place." (small, minimal).
// =====================================================================

const LOGO_IN = 0;
const TAGLINE_IN = 8;
const CURSOR_ENTER = 18;
const CURSOR_CLICK = 28;
const MORPH_START = 30;
const MORPH_END = 50;
const SCENE_END = 60;

const TAGLINE = "Blue collar solutions to blue collar problems";

export const Scene2VoiceCustomer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slow camera push 1.0 → 1.05 across the scene
  const cameraScale = interpolate(frame, [0, SCENE_END], [1.0, 1.05], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOutQuad,
  });

  // Logo phase
  const logoSpring = spring({ frame, fps, config: SPRING.soft });
  const logoBaseScale =
    interpolate(logoSpring, [0, 1], [0.8, 1.0]) +
    Math.max(0, logoSpring - 1) * 0.1;
  // Compress on cursor click
  const clickCompress = interpolate(
    frame,
    [CURSOR_CLICK, CURSOR_CLICK + 2, CURSOR_CLICK + 6],
    [1, 0.92, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const logoScale = logoBaseScale * clickCompress;
  const logoGlow = 0.6 + 0.3 * Math.sin((frame / 24) * Math.PI * 2);
  const logoOpacity = interpolate(
    frame,
    [MORPH_START, MORPH_START + 6],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Tagline fade-in
  const taglineP = interpolate(frame, [TAGLINE_IN, TAGLINE_IN + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  const taglineOpacity = taglineP * (1 - logoOpacity); // fades with logo

  // Cursor — enters from right, lands on logo at CURSOR_CLICK
  const cursorP = interpolate(frame, [CURSOR_ENTER, CURSOR_CLICK], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  const cursorX = interpolate(cursorP, [0, 1], [400, 0]);
  const cursorOpacity =
    frame >= CURSOR_ENTER && frame < MORPH_START + 4 ? 1 : 0;

  // Click ripple
  const rippleP = interpolate(
    frame,
    [CURSOR_CLICK, CURSOR_CLICK + 14],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.outExpo }
  );
  const rippleOpacity = interpolate(
    frame,
    [CURSOR_CLICK, CURSOR_CLICK + 14],
    [0.7, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Morph
  const morphP = interpolate(frame, [MORPH_START, MORPH_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  const yRot = morphP * 180;
  const phoneOpacity =
    morphP > 0.5 ? interpolate(morphP, [0.5, 1], [0, 1]) : 0;
  const phoneScale = interpolate(morphP, [0.5, 1], [0.7, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Vertical blue light sweep — travels down the iPhone screen at end
  const sweepP = interpolate(frame, [MORPH_END, MORPH_END + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOutQuad,
  });

  return (
    <AbsoluteFill style={{ background: "rgba(0,0,0,0.25)" }}>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          transform: `scale(${cameraScale})`,
          transformStyle: "preserve-3d",
          flexDirection: "column",
          gap: 32,
        }}
      >
        {/* Logo + cursor stack (visible until morph midpoint) */}
        {frame < MORPH_END && (
          <>
            <div
              style={{
                position: "relative",
                transform: `perspective(1500px) rotateY(${yRot}deg) scale(${logoScale})`,
                opacity: logoOpacity,
                transformStyle: "preserve-3d",
              }}
            >
              <KivaLogo size={260} glow={logoGlow} />

              {/* Click ripple */}
              {frame >= CURSOR_CLICK && (
                <div
                  style={{
                    position: "absolute",
                    inset: -40,
                    borderRadius: "50%",
                    border: `4px solid rgba(59,130,246,0.9)`,
                    transform: `scale(${1 + rippleP * 1.6})`,
                    opacity: rippleOpacity,
                  }}
                />
              )}

              {/* Cursor */}
              {cursorOpacity > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: `translate(${cursorX}px, -10px)`,
                    width: 36,
                    height: 36,
                    fontSize: 36,
                    color: "#fff",
                    pointerEvents: "none",
                  }}
                >
                  ▲
                </div>
              )}
            </div>

            {/* Tagline */}
            <div
              style={{
                fontFamily: "Inter, system-ui",
                fontSize: 28,
                fontWeight: 600,
                color: "rgba(255,255,255,0.85)",
                letterSpacing: -0.3,
                opacity: taglineOpacity,
                whiteSpace: "nowrap",
                textShadow: "0 2px 16px rgba(15,23,42,0.6)",
              }}
            >
              {TAGLINE}
            </div>
          </>
        )}

        {/* iPhone (post-morph) */}
        {morphP > 0.5 && (
          <div
            style={{
              opacity: phoneOpacity,
              transform: `scale(${phoneScale})`,
              transformStyle: "preserve-3d",
            }}
          >
            <PhoneFrame scale={0.7}>
              <DashboardEntry frame={frame} sweepP={sweepP} />
            </PhoneFrame>
          </div>
        )}
      </AbsoluteFill>

      {/* === AUDIO === */}
      <SfxAt src={SFX.swoosh} from={LOGO_IN} volume={0.8} />
      <SfxAt src={SFX.click} from={CURSOR_CLICK} volume={0.8} />
      <SfxAt src={GEN.morphWhirr} from={MORPH_START + 2} volume={0.35} />
      <SfxAt src={GEN.achievement} from={MORPH_END - 4} volume={0.32} />
    </AbsoluteFill>
  );
};

// Inline mini-dashboard with vertical blue sweep + "All your admin. One place."
const DashboardEntry: React.FC<{ frame: number; sweepP: number }> = ({
  frame,
  sweepP,
}) => {
  const sweepY = interpolate(sweepP, [0, 1], [0, 800]);
  const dashboardOpacity = interpolate(sweepP, [0.4, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const captionOpacity = interpolate(frame, [MORPH_END + 6, MORPH_END + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: COLOR.bg,
        position: "relative",
        paddingTop: 56,
        fontFamily: "Inter, system-ui",
      }}
    >
      {/* Dashboard fade-in */}
      <div style={{ opacity: dashboardOpacity, padding: 14 }}>
        <div
          style={{
            background: COLOR.navy,
            borderRadius: 12,
            padding: 14,
            marginBottom: 8,
          }}
        >
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>Today</div>
        </div>
        <div
          style={{
            background: COLOR.surface,
            border: `1px solid ${COLOR.border}`,
            borderRadius: 10,
            padding: 10,
            marginBottom: 6,
          }}
        />
        <div
          style={{
            background: COLOR.surface,
            border: `1px solid ${COLOR.border}`,
            borderRadius: 10,
            padding: 10,
          }}
        />
      </div>

      {/* Vertical blue sweep */}
      {sweepP > 0 && sweepP < 1 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: sweepY,
            height: 4,
            background: COLOR.blue,
            boxShadow: `0 0 16px ${COLOR.blue}, 0 0 32px ${COLOR.blue}`,
          }}
        />
      )}

      {/* Bottom-center caption */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 11,
          fontWeight: 500,
          color: COLOR.textSec,
          opacity: captionOpacity,
        }}
      >
        All your admin. One place.
      </div>
    </div>
  );
};
