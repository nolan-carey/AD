import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLOR, EASE, SPRING } from "../tokens";
import { SFX, IMG } from "../audio";
import { KivaLogo } from "../components/KivaLogo";
import { NotificationCard } from "../components/NotificationCard";
import { SfxAt } from "../components/SfxAt";

// =====================================================================
// SCENE 7 — Logo lockup + CTA (frames 804–900 = local 0–96)
// v1.3 additions: social-proof line under URL ("Used by 1,247+ UK
// tradespeople.") and Mrs. Patel callback notification at frame 870
// (= local 66) closing the curiosity loop opened in Scene 1.
// =====================================================================

const PARTICLES_START = 0; // 0–18  : particle swirl converges on iPhone
const LOGO_LIFT = 18; // 18–36 : logo lifts/scales 1.0→1.4
const TAGLINE_IN = 36; // 36–54 : tagline fades in
const CTA_IN = 54; // 54–70 : CTA button + URL + social proof
const PATEL_CALLBACK = 66; // 66–82 : Mrs. Patel card slides in from top-right
const FINAL_HOLD = 78; // 78–96 : last logo-glow pulse, hold

export const Scene7Lockup: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo scale 1.0 → 1.4 during LOGO_LIFT
  const logoScale = interpolate(frame, [LOGO_LIFT, LOGO_LIFT + 18], [1.0, 1.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });

  // Logo glow — ramps during LOGO_LIFT, then final pulse during FINAL_HOLD
  const logoGlowEnter = interpolate(frame, [LOGO_LIFT - 4, LOGO_LIFT + 18], [0.4, 0.9], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const finalPulse =
    frame >= FINAL_HOLD
      ? interpolate(frame, [FINAL_HOLD, FINAL_HOLD + 9, FINAL_HOLD + 18], [0.6, 0.9, 0.6], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : null;
  const logoGlow = finalPulse ?? logoGlowEnter;

  // Logo y-position — center frame (540) but shifted up slightly to make room for CTA stack
  const logoY = 380;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${COLOR.navy} 0%, ${COLOR.surfaceDark} 100%)`,
      }}
    >
      {/* Particle convergence */}
      {frame < LOGO_LIFT + 6 && <Particles frame={frame} />}

      {/* iPhone fade-out behind logo (lingers from Scene 6) */}
      {frame < LOGO_LIFT + 12 && <FadingPhone frame={frame} />}

      {/* Logo */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: logoY,
          transform: `translate(-50%, -50%) scale(${logoScale})`,
        }}
      >
        <KivaLogo size={220} glow={logoGlow} />
      </div>

      {/* Tagline */}
      {frame >= TAGLINE_IN && <Tagline frame={frame} />}

      {/* CTA stack: button + URL + social proof */}
      {frame >= CTA_IN && <CTAStack frame={frame} />}

      {/* Mrs. Patel callback (v1.3 loop closure) */}
      {frame >= PATEL_CALLBACK && <PatelCallback frame={frame} fps={fps} />}

      {/* === AUDIO === */}
      {/* Sparkle convergence — filtered shimmer rising in pitch */}
      <SfxAt
        src={SFX.swoosh}
        from={0}
        volume={(f) =>
          interpolate(f, [0, 12, 18], [0.0, 0.55, 0.0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
        playbackRate={1.6}
        durationInFrames={20}
      />
      {/* (impact2 logo-land removed at user request) */}
      {/* Tagline gentle chime */}
      <SfxAt
        src={SFX.notification1}
        from={TAGLINE_IN}
        volume={0.35}
        playbackRate={1.5}
      />
      {/* CTA pop click */}
      <SfxAt src={SFX.click} from={CTA_IN} volume={0.5} />
      {/* Mrs. Patel callback whisper at frame 76 (abs 880, plan-locked at -12 dBFS) */}
      <SfxAt
        src={SFX.notification1}
        from={76}
        volume={0.25}
        playbackRate={0.95}
      />
      {/* Sustained outro drone */}
      <SfxAt
        src={SFX.riser}
        from={0}
        volume={(f) =>
          interpolate(f, [0, 30, 80, 96], [0.18, 0.28, 0.32, 0.0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
        playbackRate={0.95}
        durationInFrames={96}
      />
    </AbsoluteFill>
  );
};

// =====================================================================
// PARTICLES — sparkles swirl inward and converge on the logo
// =====================================================================
const Particles: React.FC<{ frame: number }> = ({ frame }) => {
  const PARTICLE_COUNT = 30;
  return (
    <>
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
        // Deterministic seed from index
        const seed = i / PARTICLE_COUNT;
        const startAngle = seed * Math.PI * 2;
        const startDist = 480 + (i % 5) * 50;
        const t = frame - PARTICLES_START - i * 0.5;
        const p = interpolate(t, [0, 22], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE.outCubic,
        });
        // Spiral inward — angle progresses, dist decreases
        const angle = startAngle + p * Math.PI * 1.2;
        const dist = interpolate(p, [0, 1], [startDist, 0]);
        const x = Math.cos(angle) * dist;
        const y = Math.sin(angle) * dist;
        const opacity = interpolate(p, [0, 0.2, 0.85, 1], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const size = 4 + (i % 4);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "50%",
              top: 380,
              width: size,
              height: size,
              borderRadius: "50%",
              background: COLOR.aiPurple,
              transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
              opacity,
              boxShadow: `0 0 ${size * 2}px ${COLOR.aiPurple}`,
            }}
          />
        );
      })}
    </>
  );
};

// =====================================================================
// FADING PHONE — lingers from Scene 6, fades out under the logo lift
// =====================================================================
const FadingPhone: React.FC<{ frame: number }> = ({ frame }) => {
  const fade = interpolate(frame, [LOGO_LIFT - 4, LOGO_LIFT + 12], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (fade <= 0.02) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: 380,
        transform: "translate(-50%, -50%)",
        width: 200,
        height: 360,
        borderRadius: 40,
        background: "#0a0e1a",
        opacity: fade * 0.45,
        filter: "blur(4px)",
      }}
    />
  );
};

// =====================================================================
// TAGLINE
// =====================================================================
const Tagline: React.FC<{ frame: number }> = ({ frame }) => {
  const t = frame - TAGLINE_IN;
  const opacity = interpolate(t, [0, 12], [0, 0.9], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  const rise = interpolate(t, [0, 12], [4, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  return (
    <div
      style={{
        position: "absolute",
        top: 580,
        left: "50%",
        transform: `translate(-50%, ${rise}px)`,
        fontFamily: "Inter, system-ui",
        fontSize: 32,
        fontWeight: 600,
        color: "#fff",
        opacity,
        letterSpacing: -0.3,
        whiteSpace: "nowrap",
        textShadow: "0 2px 24px rgba(15,23,42,0.6)",
      }}
    >
      Blue collar solutions to blue collar problems
    </div>
  );
};

// =====================================================================
// CTA STACK — button + URL + v1.3 social-proof line
// =====================================================================
const CTAStack: React.FC<{ frame: number }> = ({ frame }) => {
  const t = frame - CTA_IN;
  const opacity = interpolate(t, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  const rise = interpolate(t, [0, 10], [4, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  return (
    <div
      style={{
        position: "absolute",
        top: 660,
        left: "50%",
        transform: `translate(-50%, ${rise}px)`,
        opacity,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
      }}
    >
      {/* CTA button */}
      <div
        style={{
          background: COLOR.navy,
          color: "#fff",
          fontFamily: "Inter, system-ui",
          fontSize: 16,
          fontWeight: 600,
          padding: "18px 28px",
          borderRadius: 10,
          border: `1px solid rgba(255,255,255,0.1)`,
          boxShadow: "0 12px 28px rgba(0,0,0,0.45)",
        }}
      >
        Try Kiva free →
      </div>
      {/* URL */}
      <div
        style={{
          fontFamily: "Inter, system-ui",
          fontSize: 14,
          fontWeight: 500,
          color: COLOR.textTer,
          marginTop: 2,
        }}
      >
        kiva.app
      </div>
      {/* Social proof (v1.3) */}
      <div
        style={{
          fontFamily: "Inter, system-ui",
          fontSize: 12,
          fontWeight: 500,
          color: COLOR.textSec,
        }}
      >
        Used by 1,247+ UK tradespeople.
      </div>
    </div>
  );
};

// =====================================================================
// MRS. PATEL CALLBACK — slides in from top-right (v1.3 loop closure)
// =====================================================================
const PatelCallback: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const t = frame - PATEL_CALLBACK;
  // Slide in from top-right, scale 0.7
  const sp = spring({ frame: t, fps, config: SPRING.controlled });
  const enterP = interpolate(sp, [0, 1], [0, 1]);
  // From offscreen top-right (~+700,-300) to landing (1620, 200) on the 1920x1080 frame
  const landingX = 1620;
  const landingY = 200;
  const x = interpolate(enterP, [0, 1], [landingX + 700, landingX]);
  const y = interpolate(enterP, [0, 1], [landingY - 300, landingY]);
  const opacity = enterP * 0.92;
  const scale = 0.7;
  // Green check sparkles in 4 frames after the card lands (~ t = 12)
  const checkSparkleT = t - 14;
  const checkOpacity = interpolate(checkSparkleT, [0, 4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const checkScale = interpolate(checkSparkleT, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        transform: `translate(${x - (460 * scale) / 2}px, ${
          y - (110 * scale) / 2
        }px) rotate(-3deg) scale(${scale})`,
        opacity,
        transformOrigin: "center center",
      }}
    >
      <div style={{ position: "relative" }}>
        <NotificationCard
          variant="imessage"
          sender="Mrs. Patel"
          body="see you Saturday 🤝"
          width={460}
        />
        {/* Green-check sparkle overlay */}
        {checkSparkleT >= 0 && (
          <div
            style={{
              position: "absolute",
              right: 12,
              bottom: 12,
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "4px 8px",
              borderRadius: 999,
              background: COLOR.acceptedBg,
              color: COLOR.accepted,
              fontFamily: "Inter, system-ui",
              fontSize: 12,
              fontWeight: 700,
              opacity: checkOpacity,
              transform: `scale(${checkScale})`,
              boxShadow: `0 0 12px rgba(21,128,61,${0.4 * checkOpacity})`,
            }}
          >
            <span>✦</span>
            <span>Quote accepted ✓</span>
          </div>
        )}
      </div>
    </div>
  );
};
