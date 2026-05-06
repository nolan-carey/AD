import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLOR, EASE, SPRING } from "../tokens";
import { GEN } from "../audio";
import { KivaLogo } from "../components/KivaLogo";
import { PhoneFrame } from "../components/PhoneFrame";
import { SfxAt } from "../components/SfxAt";

// =====================================================================
// SCENE 10 — Final hero shot (v1.21, frames 900–960)
// 60 frames @ 30fps · 2.0s
//
// Beats (verbatim from §6):
//   • All UI smoothly collapses back into Kiva dashboard. Camera zooms
//     back outward. Full floating iPhone visible again.
//   • Background: Dark cinematic gradient. Soft floating particles.
//   • Phone: slow rotation, soft blue rim lighting, realistic reflections.
//   • Kiva logo appears below.
//   • Final text: "Run smarter. Earn more." / "Download Kiva"
// =====================================================================

const COLLAPSE_END = 12;
const LOGO_IN = 14;
const TAGLINE_IN = 22;
const CTA_IN = 36;
const SCENE_END = 60;

export const Scene10FinalHero: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Camera zooms OUT from 1.10× (matching Scene 9 push end) → 0.85× over scene
  const cameraScale = interpolate(
    frame,
    [0, COLLAPSE_END, SCENE_END],
    [1.10, 0.95, 0.85],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE.inOutQuad,
    }
  );

  // Phone slow rotation orbit
  const orbitRotY = -6 + Math.sin((frame / 60) * Math.PI) * 8;

  // Logo + tagline + CTA staggered enters
  const logoSp = spring({ frame: frame - LOGO_IN, fps, config: SPRING.soft });
  const logoEnter = interpolate(logoSp, [0, 1], [0, 1]);

  const taglineP = interpolate(frame, [TAGLINE_IN, TAGLINE_IN + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  const taglineY = interpolate(taglineP, [0, 1], [10, 0]);

  const ctaP = interpolate(frame, [CTA_IN, CTA_IN + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* Floating particles */}
      <FloatingParticles frame={frame} />

      {/* Phone — left of frame, slow rotating */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "flex-start",
          paddingLeft: 380,
        }}
      >
        <PhoneFrame scale={0.75 * cameraScale} rotateY={orbitRotY} rotateX={3}>
          <DashboardCollapse />
        </PhoneFrame>
      </AbsoluteFill>

      {/* Logo + tagline + CTA — right side */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "flex-end",
          paddingRight: 160,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 24,
            maxWidth: 540,
          }}
        >
          {/* Kiva logo small mark */}
          <div
            style={{
              opacity: logoEnter,
              transform: `scale(${interpolate(logoEnter, [0, 1], [0.7, 1])})`,
            }}
          >
            <KivaLogo size={72} glow={0.7} />
          </div>

          {/* Tagline + sub-line */}
          <div
            style={{
              opacity: taglineP,
              transform: `translateY(${taglineY}px)`,
            }}
          >
            <div
              style={{
                fontFamily: "Inter, system-ui",
                fontSize: 56,
                fontWeight: 700,
                color: "#fff",
                letterSpacing: -1.4,
                lineHeight: 1.05,
                textShadow: "0 4px 24px rgba(15,23,42,0.6)",
              }}
            >
              Run smarter.<br />Earn more.
            </div>
          </div>

          {/* Download CTA */}
          <div
            style={{
              opacity: ctaP,
              transform: `translateY(${interpolate(ctaP, [0, 1], [10, 0])}px)`,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 8,
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
              Download Kiva
            </div>
          </div>
        </div>
      </AbsoluteFill>

      {/* === AUDIO === */}
      <SfxAt
        src={GEN.outroDrone}
        from={0}
        volume={(f) =>
          interpolate(f, [0, 12, 50, 60], [0.18, 0.26, 0.22, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
        durationInFrames={SCENE_END}
      />
      <SfxAt src={GEN.achievement} from={LOGO_IN + 6} volume={0.32} />
    </AbsoluteFill>
  );
};

const DashboardCollapse: React.FC = () => (
  <div
    style={{
      width: "100%",
      height: "100%",
      background: COLOR.navy,
      paddingTop: 56,
      padding: "60px 14px 14px",
    }}
  >
    <div
      style={{
        background: COLOR.surfaceDark,
        borderRadius: 14,
        height: 100,
        marginBottom: 8,
      }}
    />
    <div
      style={{
        background: COLOR.surface,
        borderRadius: 12,
        height: 60,
        marginBottom: 6,
      }}
    />
    <div
      style={{
        background: COLOR.surface,
        borderRadius: 12,
        height: 60,
      }}
    />
  </div>
);

const FloatingParticles: React.FC<{ frame: number }> = ({ frame }) => {
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: 14 }).map((_, i) => {
        const seed = i / 14;
        const baseX = 200 + seed * 1500 + Math.sin(seed * Math.PI * 4) * 200;
        const baseY = 300 + Math.cos(seed * Math.PI * 6) * 350;
        const driftY = Math.sin((frame / (40 + i * 4)) * Math.PI * 2) * 12;
        const driftX = Math.cos((frame / (50 + i * 3)) * Math.PI * 2) * 8;
        const size = 3 + (i % 4);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: baseX + driftX,
              top: baseY + driftY,
              width: size,
              height: size,
              borderRadius: "50%",
              background:
                i % 2 === 0 ? COLOR.aiPurple : COLOR.blue,
              opacity: 0.4 + 0.3 * Math.sin((frame / 30 + i) * Math.PI * 2),
              boxShadow: `0 0 ${size * 2}px ${
                i % 2 === 0 ? COLOR.aiPurple : COLOR.blue
              }`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
