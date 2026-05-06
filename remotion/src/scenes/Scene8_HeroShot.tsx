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
// SCENE 8 — Final Device Hero Shot (v1.20, frames 720–810)
// 90 frames @ 30fps · 3.0s · "Phone floating in cinematic space. Slow
// rotation. Soft reflections. Breathing room. Tagline: 'Run smarter.
// Earn more.'" (ad_plan §5)
//
// Beats:
//   0–20  : iPhone settles to centered hero pose, camera pulls slightly
//   20–40 : Phone slow-rotates ~6° (subtle orbit) + glow halo intensifies
//   30–60 : Tagline "Run smarter. Earn more." types in
//   60–90 : Hold — final breath, music drone resolves
// Tagline locked v1.20: "Run smarter. Earn more."
// =====================================================================

const HERO_SETTLE = 0;
const ROTATION_PEAK = 20;
const TAGLINE_IN = 30;
const FINAL_HOLD = 60;
const TAGLINE_TEXT = "Run smarter. Earn more.";

export const Scene8HeroShot: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phone slow rotation — subtle 6° rotateY orbit over the scene
  const orbitRotY = -6 + Math.sin((frame / 60) * Math.PI) * 6;
  // Phone scale — breathes in slightly, settles
  const phoneSp = spring({ frame, fps, config: SPRING.soft });
  const phoneScale = interpolate(phoneSp, [0, 1], [0.95, 1.02]);

  // Tagline typing animation
  const typingP = interpolate(frame, [TAGLINE_IN, TAGLINE_IN + 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const visibleChars = Math.floor(typingP * TAGLINE_TEXT.length);

  // Tagline fade-in
  const taglineOpacity = interpolate(frame, [TAGLINE_IN, TAGLINE_IN + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });

  // Final glow pulse on the phone in the last 30 frames
  const finalGlow =
    frame >= FINAL_HOLD
      ? 0.6 + 0.3 * Math.sin(((frame - FINAL_HOLD) / 30) * Math.PI)
      : 0;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* Phone hero — floating, slow rotating */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "flex-start",
          paddingLeft: 480,
        }}
      >
        <div
          style={{
            transform: `scale(${phoneScale})`,
            transformStyle: "preserve-3d",
          }}
        >
          <PhoneFrame
            scale={0.85}
            rotateY={orbitRotY}
            rotateX={3}
          >
            <DashboardStill />
          </PhoneFrame>
        </div>
      </AbsoluteFill>

      {/* Tagline + CTA stack on right side */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "flex-end",
          paddingRight: 140,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 24,
            opacity: taglineOpacity,
            maxWidth: 540,
          }}
        >
          {/* Logo small mark above tagline */}
          <KivaLogo size={64} glow={finalGlow} />

          {/* Tagline (locked v1.20) */}
          <div
            style={{
              fontFamily: "Inter, system-ui",
              fontSize: 56,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: -1.2,
              lineHeight: 1.1,
              textShadow: "0 4px 24px rgba(15,23,42,0.6)",
            }}
          >
            {TAGLINE_TEXT.slice(0, visibleChars)}
            {visibleChars < TAGLINE_TEXT.length && (
              <span
                style={{
                  display: "inline-block",
                  width: 4,
                  height: 56,
                  marginLeft: 6,
                  background: COLOR.blue,
                  verticalAlign: "middle",
                  opacity: Math.floor(frame / 8) % 2 === 0 ? 1 : 0,
                }}
              />
            )}
          </div>

          {/* CTA button + URL — appears after tagline lands */}
          {frame >= TAGLINE_IN + 26 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 8,
                opacity: interpolate(
                  frame,
                  [TAGLINE_IN + 26, TAGLINE_IN + 36],
                  [0, 1],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: EASE.outCubic,
                  }
                ),
              }}
            >
              <div
                style={{
                  background: "#fff",
                  color: COLOR.navy,
                  fontFamily: "Inter, system-ui",
                  fontSize: 18,
                  fontWeight: 700,
                  padding: "16px 32px",
                  borderRadius: 14,
                  boxShadow: "0 12px 36px rgba(0,0,0,0.45)",
                  letterSpacing: -0.2,
                }}
              >
                Try Kiva free →
              </div>
              <div
                style={{
                  fontFamily: "Inter, system-ui",
                  fontSize: 15,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.65)",
                  paddingLeft: 4,
                }}
              >
                kiva.app · Used by 1,247+ UK tradespeople
              </div>
            </div>
          )}
        </div>
      </AbsoluteFill>

      {/* Audio — outro drone sustains across the whole scene + soft impact on hero */}
      <SfxAt
        src={GEN.outroDrone}
        from={0}
        volume={(f) =>
          interpolate(f, [0, 18, 70, 90], [0.18, 0.26, 0.26, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
        durationInFrames={90}
      />
      <SfxAt src={GEN.achievement} from={TAGLINE_IN + 22} volume={0.32} />
    </AbsoluteFill>
  );
};

const DashboardStill: React.FC = () => (
  <div
    style={{
      width: "100%",
      height: "100%",
      background: COLOR.navy,
      paddingTop: 56,
      paddingLeft: 14,
      paddingRight: 14,
    }}
  >
    <div
      style={{
        background: COLOR.surfaceDark,
        borderRadius: 12,
        height: 120,
        marginTop: 12,
      }}
    />
    <div
      style={{
        background: COLOR.surface,
        borderRadius: 12,
        height: 50,
        marginTop: 8,
      }}
    />
    <div
      style={{
        background: COLOR.surface,
        borderRadius: 12,
        height: 50,
        marginTop: 6,
      }}
    />
  </div>
);
