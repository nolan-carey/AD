import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLOR, EASE, SPRING } from "../tokens";
import { SFX } from "../audio";
import { KivaLogo } from "../components/KivaLogo";
import { PhoneFrame } from "../components/PhoneFrame";
import { SfxAt } from "../components/SfxAt";

// =====================================================================
// SCENE 2 — v1.26 (Sequence from absolute F228, local F0–F156, 5.2s)
// Nominal scene window F240–F372 absolute; +12f crossfade pad on each end.
// (file kept as Scene2_VoiceCustomer.tsx for git diff continuity)
//
// v1.26 changes from v1.24 (per user direction 2026-05-07):
//   • Logo NO LONGER glides to top-right — Kiva chevron + "Kiva." wordmark
//     stay CENTERED for the entire sequence.
//   • Tagline now lives in a glassmorphism POP-IN PILL — pops in (overshoot
//     1.12 → 1.0), holds 15f for the read, pops out (compress + fade).
//   • The 4 features ORBIT the centered logo at clock positions (12/3/6/9)
//     and ALL PERSIST on screen until the constellation collapses into the
//     iPhone vortex. The sparkle traces a faint orbital trail.
//   • Logo dissolves into the iPhone at center (cross-fade).
//
// Local-frame map (Sequence starts at abs F228; spec frames F180–F312 map
// to local F12–F144 = spec_frame − 180 + 12):
//   F0–F12     crossfade-IN from Scene 1
//   F12–F24    SWIPE-UP WIPE — vertical sweep upward
//   F24–F30    HARD SILENCE — pure dark navy
//   F30–F48    CENTERED BRAND LOCKUP fades up:
//                F30–F40 chevron logo
//                F38–F48 "Kiva." wordmark
//   F48–F57    🫧 TAGLINE PILL pops in (overshoot 1.12 → 1.0, glass chrome)
//   F57–F72    PILL holds (15f read window)
//   F72–F78    🫧 PILL pops out (1.0 → 0.85 → 0, fade + sparkle puff)
//   F78–F84    AI SPARKLE emerges from logo, begins orbit
//   F84–F116   🌀 4-FEATURE ORBIT (8f each, all PERSIST):
//                F84–F92   12 o'clock  "Speak quotes."
//                F92–F100   3 o'clock  "Save customers."
//                F100–F108  6 o'clock  "Drive less."
//                F108–F116  9 o'clock  "Win more jobs."
//   F116–F118  CONSTELLATION HOLD — all 4 features visible around centered logo
//   F118–F122  VORTEX — features dissolve sync'd, particles spiral inward
//   F122–F134  LOGO fades + iPhone materializes at center (cross-fade)
//   F134–F144  Dashboard + "All your admin. One place." caption
//   F144–F156  crossfade-OUT into Scene 3
//
// Kinetic typography (UNCHANGED from v1.24): verb small (Inter_400Regular
// ~32px @ 80%), outcome word HUGE (Inter_700Bold ~84px) with scale-punch
// 1.0 → 1.08 → 1.0 + soft purple underline. Period in purple.
// =====================================================================

const SWIPE_START = 12;
const SWIPE_END = 24;
const SILENCE_END = 30;
const LOCKUP_LOGO_IN = 30;
const LOCKUP_WORD_IN = 38;
const LOCKUP_END = 48;
const PILL_IN = 48;
const PILL_HOLD_START = 57;
const PILL_OUT_START = 72;
const PILL_OUT_END = 78;
const SPARKLE_IN = 78;
const FEATURE1 = 84; // 12 o'clock
const FEATURE2 = 92; // 3 o'clock
const FEATURE3 = 100; // 6 o'clock
const FEATURE4 = 108; // 9 o'clock
const FEATURES_END = 116;
const CONSTELLATION_HOLD_END = 118;
const VORTEX_START = 118;
const VORTEX_END = 122;
const PHONE_MATERIALIZE = 122;
const LOGO_FADE_END = 130;
const DASHBOARD_IN = 134;
const SCENE_END = 144;

// Centered logo focal point (1920×1080 frame)
const CENTER = { x: 960, y: 540 };

// Clock-position layout — features circle centered logo at ~280 px radius.
const ORBIT_RADIUS = 280;
const CLOCK = [
  { x: CENTER.x, y: CENTER.y - ORBIT_RADIUS }, // 12 o'clock
  { x: CENTER.x + ORBIT_RADIUS, y: CENTER.y }, // 3 o'clock
  { x: CENTER.x, y: CENTER.y + ORBIT_RADIUS }, // 6 o'clock
  { x: CENTER.x - ORBIT_RADIUS, y: CENTER.y }, // 9 o'clock
];
// Match clock positions to angle in radians (0 = +x axis, clockwise positive
// when y grows downward → standard CSS angle space):
//   12 o'clock = -π/2, 3 = 0, 6 = π/2, 9 = π
const CLOCK_ANGLES = [-Math.PI / 2, 0, Math.PI / 2, Math.PI];

const FEATURES = [
  { verb: "Speak", outcome: "quotes" },
  { verb: "Save", outcome: "customers" },
  { verb: "Drive", outcome: "less" },
  { verb: "Win more", outcome: "jobs" },
];

export const Scene2VoiceCustomer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Constellation collapse zoom — 1.0 → 1.05 across vortex
  const collapseScale = interpolate(
    frame,
    [VORTEX_START, PHONE_MATERIALIZE],
    [1.0, 1.05],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE.inOutQuad,
    }
  );

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${COLOR.navy} 0%, #050810 100%)`,
        overflow: "hidden",
      }}
    >
      {/* Swipe-up wipe veil */}
      {frame >= SWIPE_START - 2 && frame < SWIPE_END + 4 && (
        <SwipeUpVeil frame={frame} />
      )}

      {/* Centered brand lockup — visible F30 → F130 (logo fades w/ iPhone) */}
      {frame >= LOCKUP_LOGO_IN - 2 && frame < LOGO_FADE_END + 2 && (
        <CenteredLockup frame={frame} fps={fps} />
      )}

      {/* Tagline pill — F48 → F78 */}
      {frame >= PILL_IN - 2 && frame < PILL_OUT_END + 4 && (
        <TaglinePill frame={frame} fps={fps} />
      )}

      {/* Orbit trail (faint purple ring while sparkle is orbiting) */}
      {frame >= SPARKLE_IN - 2 && frame < VORTEX_END + 2 && (
        <OrbitTrail frame={frame} />
      )}

      {/* AI Sparkle — F78 → F122 */}
      {frame >= SPARKLE_IN - 2 && frame < VORTEX_END + 2 && (
        <SparkleOrbiter frame={frame} />
      )}

      {/* 4 feature texts (PERSIST after each appears, all dissolve at vortex) */}
      {frame >= FEATURE1 - 2 && frame < VORTEX_END + 2 && (
        <FeatureTexts frame={frame} collapseScale={collapseScale} />
      )}

      {/* Vortex particles */}
      {frame >= VORTEX_START - 2 && frame < PHONE_MATERIALIZE + 4 && (
        <VortexParticles frame={frame} />
      )}

      {/* iPhone materializes at center (cross-fades with logo fade) */}
      {frame >= PHONE_MATERIALIZE - 2 && (
        <PhoneMaterialize frame={frame} fps={fps} />
      )}

      {/* === AUDIO ===
          Phase 3 (sound finalization) will reconcile per-frame cues.
          For now: 4 sparkle chimes at burst frames (F86, F94, F102, F110)
          ascending +1 semitone each. */}
      {[FEATURE1 + 2, FEATURE2 + 2, FEATURE3 + 2, FEATURE4 + 2].map((f, i) => (
        <SfxAt
          key={`feat-${i}`}
          src={SFX.notification1}
          from={f}
          volume={0.32}
          playbackRate={Math.pow(2, (5 + i) / 12)}
        />
      ))}
    </AbsoluteFill>
  );
};

// =====================================================================
// SWIPE-UP VEIL — dark band sweeps up past the top of the frame
// =====================================================================
const SwipeUpVeil: React.FC<{ frame: number }> = ({ frame }) => {
  const p = interpolate(frame, [SWIPE_START, SWIPE_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOutQuad,
  });
  const yOffset = interpolate(p, [0, 1], [0, -1080]);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 1080,
        height: 1500,
        transform: `translateY(${yOffset}px)`,
        background: `linear-gradient(180deg, ${COLOR.navy} 0%, #050810 60%, rgba(0,0,0,0.0) 100%)`,
        boxShadow: "0 -40px 120px rgba(0,0,0,0.85)",
        pointerEvents: "none",
      }}
    />
  );
};

// =====================================================================
// CENTERED LOCKUP — chevron logo + "Kiva." wordmark, stays put forever
// (until F122-F130 cross-fade with iPhone)
// =====================================================================
const CenteredLockup: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  // Logo enter F30-F40
  const logoSp = spring({
    frame: frame - LOCKUP_LOGO_IN,
    fps,
    config: SPRING.soft,
  });
  const logoEnter = interpolate(logoSp, [0, 1], [0, 1]);
  const logoEnterScale = interpolate(logoEnter, [0, 1], [0.9, 1]);

  // Wordmark enter F38-F48
  const wordP = interpolate(frame, [LOCKUP_WORD_IN, LOCKUP_WORD_IN + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  const wordY = interpolate(wordP, [0, 1], [6, 0]);

  // Logo fades F122-F130 as iPhone materializes
  const fadeOut = interpolate(frame, [PHONE_MATERIALIZE, LOGO_FADE_END], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Pulse glow during pill hold (F57-F72) — gentle breathing
  const glowPulse =
    frame >= PILL_HOLD_START && frame < PILL_OUT_START
      ? 0.5 + 0.15 * Math.sin(((frame - PILL_HOLD_START) / 12) * Math.PI * 2)
      : 0.55;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: fadeOut }}>
      {/* Soft radial glow behind lockup */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(59,130,246,0.32) 0%, rgba(59,130,246,0) 45%)",
          filter: "blur(40px)",
          opacity: logoEnter * glowPulse,
        }}
      />

      {/* Centered chevron */}
      <div
        style={{
          position: "absolute",
          left: CENTER.x,
          top: CENTER.y - 40,
          transform: `translate(-50%, -50%) scale(${logoEnterScale})`,
          opacity: logoEnter,
        }}
      >
        <KivaLogo size={170} glow={0.55 * glowPulse} />
      </div>

      {/* "Kiva." wordmark — sits below chevron */}
      <div
        style={{
          position: "absolute",
          left: CENTER.x,
          top: CENTER.y + 100,
          transform: `translate(-50%, -50%) translateY(${wordY}px)`,
          opacity: wordP,
          fontFamily: "Inter, system-ui",
          fontSize: 60,
          fontWeight: 600,
          color: "#fff",
          letterSpacing: -1.6,
          whiteSpace: "nowrap",
        }}
      >
        Kiva
        <span style={{ color: COLOR.blue }}>.</span>
      </div>
    </AbsoluteFill>
  );
};

// =====================================================================
// TAGLINE PILL — glassmorphism pop-in pill below the wordmark
// Pops in F48-F57 (overshoot 1.12 → 1.0), holds F57-F72, pops out F72-F78
// =====================================================================
const TaglinePill: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  // Pop-in (spring overshoot 1.12 → 1.0)
  const popInSp = spring({
    frame: frame - PILL_IN,
    fps,
    config: { damping: 12, mass: 1, stiffness: 130 },
  });
  // Map spring 0..>1 → scale 0 → 1.12 (peak) → 1.0 (rest). The spring config
  // produces a natural overshoot at ~1.1; clamp the final to 1.0 once settled.
  const popInScale = interpolate(popInSp, [0, 0.7, 1], [0, 1.12, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const popInOpacity = interpolate(popInSp, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Pop-out F72-F78: scale 1.0 → 0.85 → 0, opacity fade
  const popOutP = interpolate(frame, [PILL_OUT_START, PILL_OUT_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inCubic,
  });
  const popOutScale = interpolate(popOutP, [0, 0.5, 1], [1, 0.85, 0]);
  const popOutOpacity = interpolate(popOutP, [0, 1], [1, 0]);

  const isOut = frame >= PILL_OUT_START;
  const scale = isOut ? popOutScale : popInScale;
  const opacity = isOut ? popOutOpacity : popInOpacity;

  // Inner shimmer sweep across glass during hold
  const shimmerActive = frame >= PILL_HOLD_START && frame < PILL_OUT_START;
  const shimmerT = (frame - PILL_HOLD_START) / 15;
  const shimmerX = -100 + shimmerT * 200;

  return (
    <div
      style={{
        position: "absolute",
        left: CENTER.x,
        top: CENTER.y + 200, // ~22 px below wordmark in iPhone-pt; scaled up ≈ 100 px on 1920 frame
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "relative",
          background: "rgba(255,255,255,0.10)",
          backdropFilter: "blur(24px) saturate(160%)",
          WebkitBackdropFilter: "blur(24px) saturate(160%)",
          border: "1px solid rgba(255,255,255,0.18)",
          borderRadius: 999,
          padding: "16px 38px",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.22)",
          fontFamily: "Inter, system-ui",
          fontSize: 28,
          fontWeight: 500,
          color: "rgba(255,255,255,0.96)",
          letterSpacing: -0.3,
          whiteSpace: "nowrap",
          overflow: "hidden",
        }}
      >
        Blue collar solutions to blue collar problems
        {/* Inner shimmer sweep */}
        {shimmerActive && (
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${shimmerX}%`,
              width: "40%",
              background:
                "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.24) 50%, rgba(255,255,255,0) 100%)",
              pointerEvents: "none",
            }}
          />
        )}
      </div>
      {/* Sparkle puff at pop-out (F75 — peak of the puff) */}
      {frame >= PILL_OUT_START + 2 && frame < PILL_OUT_END + 2 && (
        <PillPuff frame={frame} />
      )}
    </div>
  );
};

const PillPuff: React.FC<{ frame: number }> = ({ frame }) => {
  const t = frame - (PILL_OUT_START + 2);
  const dur = 6;
  const p = Math.max(0, Math.min(1, t / dur));
  const fade = 1 - p;
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => {
        const ang = (i / 6) * Math.PI * 2 + 0.4;
        const r = 30 + p * 60;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 4,
              height: 4,
              marginLeft: -2,
              marginTop: -2,
              borderRadius: "50%",
              background: COLOR.aiPurple,
              boxShadow: `0 0 8px ${COLOR.aiPurple}`,
              opacity: fade,
              transform: `translate(${Math.cos(ang) * r}px, ${
                Math.sin(ang) * r
              }px)`,
            }}
          />
        );
      })}
    </>
  );
};

// =====================================================================
// ORBIT TRAIL — faint purple ring traced as the sparkle orbits
// Visible while sparkle is alive (F78-F122), brightest when actively orbiting
// =====================================================================
const OrbitTrail: React.FC<{ frame: number }> = ({ frame }) => {
  // Trail starts faint at F78, grows visible during the 4-feature orbit,
  // dissolves with the vortex
  const trailOpacity =
    frame < FEATURE1
      ? 0
      : frame < FEATURES_END
      ? interpolate(frame, [FEATURE1, FEATURE1 + 8], [0, 0.35], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : interpolate(frame, [FEATURES_END, VORTEX_END], [0.35, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

  if (trailOpacity <= 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: CENTER.x,
        top: CENTER.y,
        transform: "translate(-50%, -50%)",
        width: ORBIT_RADIUS * 2,
        height: ORBIT_RADIUS * 2,
        borderRadius: "50%",
        border: `1px solid rgba(109,40,217,${trailOpacity})`,
        boxShadow: `0 0 ${20 * trailOpacity}px rgba(109,40,217,${
          trailOpacity * 0.6
        })`,
        pointerEvents: "none",
      }}
    />
  );
};

// =====================================================================
// SPARKLE ORBITER — emerges from logo, orbits clockwise at 280 px radius
// =====================================================================
const SparkleOrbiter: React.FC<{ frame: number }> = ({ frame }) => {
  // Entry F78-F84 — sparkle materializes inside the logo, then begins orbit.
  const enter = interpolate(frame, [SPARKLE_IN, SPARKLE_IN + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });

  // Position logic:
  //   F78–F84 — at logo center, growing
  //   F84–F116 — orbiting between clock positions (FEATURE1..FEATURE4)
  //   F116–F118 — holds at last (9 o'clock) for constellation moment
  //   F118–F122 — collapses into center as part of vortex
  let cx = CENTER.x;
  let cy = CENTER.y;
  let pulseScale = 1;

  if (frame < FEATURE1) {
    // Pre-orbit — at center of logo
    cx = CENTER.x;
    cy = CENTER.y;
  } else if (frame < FEATURES_END) {
    // Determine which 8-frame segment we're in
    const segs = [FEATURE1, FEATURE2, FEATURE3, FEATURE4];
    let i = 0;
    for (let k = 0; k < 4; k++) if (frame >= segs[k]) i = k;
    const segStart = segs[i];
    const t = frame - segStart; // 0..8
    const startAngle =
      i === 0 ? -Math.PI / 2 - 0.3 : CLOCK_ANGLES[i - 1];
    const endAngle = CLOCK_ANGLES[i];
    // F0-F2: trace orbit arc from prev → target clock position
    const dartP = interpolate(t, [0, 2], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE.inOutQuad,
    });
    const ang = interpolate(dartP, [0, 1], [startAngle, endAngle]);
    cx = CENTER.x + Math.cos(ang) * ORBIT_RADIUS;
    cy = CENTER.y + Math.sin(ang) * ORBIT_RADIUS;
    // F2-F5: pulse bright on landing
    pulseScale = interpolate(t, [2, 3.5, 5], [1, 1.4, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else if (frame < VORTEX_START) {
    // Constellation hold — sparkle parked at 9 o'clock
    cx = CLOCK[3].x;
    cy = CLOCK[3].y;
  } else {
    // Vortex — spiral inward to center
    const vp = interpolate(frame, [VORTEX_START, VORTEX_END], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE.inCubic,
    });
    cx = interpolate(vp, [0, 1], [CLOCK[3].x, CENTER.x]);
    cy = interpolate(vp, [0, 1], [CLOCK[3].y, CENTER.y]);
  }

  // Vortex shrink + opacity
  const vortexP = interpolate(frame, [VORTEX_START, VORTEX_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  const vortexScale = interpolate(vortexP, [0, 1], [1, 0]);
  const vortexOpacity = interpolate(vortexP, [0, 1], [1, 0]);

  // Continuous spin
  const rotation = (frame - SPARKLE_IN) * 4;

  const finalScale = enter * pulseScale * vortexScale;

  return (
    <div
      style={{
        position: "absolute",
        left: cx,
        top: cy,
        transform: `translate(-50%, -50%) scale(${finalScale}) rotate(${rotation}deg)`,
        opacity: enter * vortexOpacity,
        pointerEvents: "none",
        zIndex: 50,
      }}
    >
      {/* Purple glow halo */}
      <div
        style={{
          position: "absolute",
          width: 160,
          height: 160,
          left: -80,
          top: -80,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(109,40,217,0.55) 0%, rgba(109,40,217,0) 70%)",
          filter: "blur(20px)",
        }}
      />
      <Sparkle size={90} color={COLOR.aiPurple} />
      {pulseScale > 1.05 && <BurstParticles count={12} />}
    </div>
  );
};

const Sparkle: React.FC<{ size: number; color: string }> = ({ size, color }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ filter: `drop-shadow(0 0 8px ${color})` }}
    >
      <path
        d="M50 8 L56 44 L92 50 L56 56 L50 92 L44 56 L8 50 L44 44 Z"
        fill={color}
      />
      <path
        d="M50 22 L52 48 L78 50 L52 52 L50 78 L48 52 L22 50 L48 48 Z"
        fill="#fff"
        opacity={0.55}
      />
    </svg>
  );
};

const BurstParticles: React.FC<{ count: number }> = ({ count }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const ang = (i / count) * Math.PI * 2;
        const r = 60;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 50 + Math.cos(ang) * r,
              top: 50 + Math.sin(ang) * r,
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: COLOR.aiPurple,
              boxShadow: `0 0 6px ${COLOR.aiPurple}`,
              opacity: 0.9,
            }}
          />
        );
      })}
    </>
  );
};

// =====================================================================
// FEATURE TEXTS — appear at clock positions, PERSIST until vortex.
// All 4 dissolve simultaneously at VORTEX_START (F118).
// =====================================================================
const FeatureTexts: React.FC<{ frame: number; collapseScale: number }> = ({
  frame,
  collapseScale,
}) => {
  const segs = [FEATURE1, FEATURE2, FEATURE3, FEATURE4];
  return (
    <>
      {FEATURES.map((feat, i) => {
        const start = segs[i];
        if (frame < start + 2) return null;

        const t = frame - start;
        // Reveal F2-F5 (kinetic punch)
        const revealP = interpolate(t, [2, 5], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE.outCubic,
        });
        // Scale punch on outcome word, only during reveal window
        const punch = interpolate(t, [2, 3.5, 5], [1, 1.08, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        // Sync'd dissolve at VORTEX_START — all 4 features fade simultaneously
        const dissolve = interpolate(
          frame,
          [VORTEX_START, VORTEX_START + 4],
          [1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        const opacity = revealP * dissolve;

        // Underline width grows during reveal, shrinks during dissolve
        const underlineW = interpolate(t, [2.5, 5], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE.outCubic,
        });

        // Slight pull toward center during constellation collapse
        const pos = CLOCK[i];
        const collapsePull = interpolate(
          frame,
          [VORTEX_START, VORTEX_END],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        const px = interpolate(collapsePull, [0, 1], [pos.x, CENTER.x]);
        const py = interpolate(collapsePull, [0, 1], [pos.y, CENTER.y]);

        // Anchor each feature OUTSIDE the orbit ring so the text doesn't
        // crowd the centered Kiva logo:
        //   12 (i=0): bottom-center anchor — text grows upward from orbit top
        //    3 (i=1): left-center anchor   — text grows rightward from orbit right
        //    6 (i=2): top-center anchor    — text grows downward from orbit bottom
        //    9 (i=3): right-center anchor  — text grows leftward from orbit left
        const anchorMap = [
          "translate(-50%, -100%)",
          "translate(0%, -50%)",
          "translate(-50%, 0%)",
          "translate(-100%, -50%)",
        ];
        const flexAlignMap = [
          "center", // 12: stack vertically centered
          "flex-start", // 3: align to left edge
          "center", // 6
          "flex-end", // 9: align to right edge
        ];
        // Underline horizontal nudge so it sits beneath the OUTCOME word, not
        // centered under verb+outcome combined (which puts it under the verb)
        const underlineNudge = [70, 90, 70, 50];

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: px,
              top: py,
              transform: `${anchorMap[i]} scale(${collapseScale})`,
              opacity,
              fontFamily: "Inter, system-ui",
              color: "#fff",
              display: "flex",
              flexDirection: "column",
              alignItems: flexAlignMap[i],
              gap: 4,
              pointerEvents: "none",
              zIndex: 40,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 14,
                whiteSpace: "nowrap",
              }}
            >
              <span
                style={{
                  fontSize: 30,
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.80)",
                  letterSpacing: -0.4,
                }}
              >
                {feat.verb}
              </span>
              <span
                style={{
                  fontSize: 76,
                  fontWeight: 700,
                  color: "#fff",
                  letterSpacing: -1.8,
                  transform: `scale(${punch})`,
                  display: "inline-block",
                  textShadow:
                    "0 4px 24px rgba(15,23,42,0.6), 0 0 32px rgba(109,40,217,0.45)",
                }}
              >
                {feat.outcome}
                <span style={{ color: COLOR.aiPurple }}>.</span>
              </span>
            </div>
            <div
              style={{
                width: 220 * underlineW,
                height: 3,
                marginTop: 2,
                marginLeft: underlineNudge[i],
                background: `linear-gradient(90deg, rgba(109,40,217,0) 0%, ${COLOR.aiPurple} 50%, rgba(109,40,217,0) 100%)`,
                boxShadow: `0 0 8px ${COLOR.aiPurple}`,
                opacity: dissolve,
              }}
            />
          </div>
        );
      })}
    </>
  );
};

// =====================================================================
// VORTEX PARTICLES — ~50 particles spiral from clock positions to center
// =====================================================================
const VortexParticles: React.FC<{ frame: number }> = ({ frame }) => {
  const t = frame - VORTEX_START;
  const dur = VORTEX_END - VORTEX_START;
  const p = interpolate(t, [0, dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOutQuad,
  });
  const fade = interpolate(t, [dur, dur + 4], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: 50 }).map((_, i) => {
        // Distribute particles around the 4 clock positions + sparkle path
        const clockIdx = i % 4;
        const start = CLOCK[clockIdx];
        const jitter = ((i * 37) % 60) - 30;
        const sx = start.x + jitter;
        const sy = start.y + ((i * 19) % 60) - 30;
        // Spiral inward
        const startAng = Math.atan2(sy - CENTER.y, sx - CENTER.x);
        const startR = Math.hypot(sx - CENTER.x, sy - CENTER.y);
        const r = interpolate(p, [0, 1], [startR, 0]);
        const ang = startAng + p * Math.PI * 1.6;
        const x = CENTER.x + Math.cos(ang) * r;
        const y = CENTER.y + Math.sin(ang) * r;
        const size = 4 + (i % 3) * 2;
        const isPurple = i % 2 === 0;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              background: isPurple ? COLOR.aiPurple : COLOR.blue,
              boxShadow: `0 0 ${size * 2}px ${
                isPurple ? COLOR.aiPurple : COLOR.blue
              }`,
              opacity: fade,
            }}
          />
        );
      })}
      {/* Center flare grows as p approaches 1 */}
      <div
        style={{
          position: "absolute",
          left: CENTER.x,
          top: CENTER.y,
          width: 220,
          height: 220,
          marginLeft: -110,
          marginTop: -110,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.85) 0%, rgba(109,40,217,0.5) 30%, rgba(0,0,0,0) 70%)",
          filter: "blur(12px)",
          opacity: p * fade,
          transform: `scale(${0.4 + p * 1.6})`,
        }}
      />
    </AbsoluteFill>
  );
};

// =====================================================================
// PHONE MATERIALIZE — iPhone fades up at center as logo cross-fades out
// =====================================================================
const PhoneMaterialize: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  // iPhone fade-in F122-F134 (overlaps logo fade F122-F130)
  const phoneP = interpolate(frame, [PHONE_MATERIALIZE, DASHBOARD_IN], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  const phoneScale = interpolate(phoneP, [0, 1], [0.9, 1]);

  // Caption fade F138-F144
  const captionP = interpolate(frame, [DASHBOARD_IN + 4, SCENE_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: phoneP,
      }}
    >
      <PhoneFrame scale={phoneScale}>
        <DashboardEntry captionOpacity={captionP} />
      </PhoneFrame>
    </AbsoluteFill>
  );
};

// =====================================================================
// DASHBOARD ENTRY — minimal Kiva dashboard preview + caption
// =====================================================================
const DashboardEntry: React.FC<{ captionOpacity: number }> = ({
  captionOpacity,
}) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: COLOR.bg,
        paddingTop: 56,
        position: "relative",
        fontFamily: "Inter, system-ui",
      }}
    >
      <div
        style={{
          padding: "0 16px 12px",
          fontSize: 18,
          fontWeight: 700,
          color: COLOR.navy,
        }}
      >
        Kiva<span style={{ color: COLOR.blue }}>.</span>
      </div>
      <div
        style={{
          background: COLOR.navy,
          margin: "0 14px",
          padding: 14,
          borderRadius: 14,
        }}
      >
        <div
          style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", marginBottom: 4 }}
        >
          Today
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>£0</div>
      </div>
      <div
        style={{
          padding: "12px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <div
          style={{
            background: COLOR.surface,
            border: `1px solid ${COLOR.border}`,
            borderRadius: 10,
            height: 50,
          }}
        />
        <div
          style={{
            background: COLOR.surface,
            border: `1px solid ${COLOR.border}`,
            borderRadius: 10,
            height: 50,
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 80,
          right: 16,
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: COLOR.blue,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 6px 16px rgba(59,130,246,0.4)",
        }}
      >
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <path
            d="M12 14a3 3 0 0 0 3-3V7a3 3 0 1 0-6 0v4a3 3 0 0 0 3 3Z"
            fill="white"
          />
          <path
            d="M19 11a1 1 0 1 0-2 0 5 5 0 0 1-10 0 1 1 0 1 0-2 0 7 7 0 0 0 6 6.92V21a1 1 0 1 0 2 0v-3.08A7 7 0 0 0 19 11Z"
            fill="white"
          />
        </svg>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 30,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 10,
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
