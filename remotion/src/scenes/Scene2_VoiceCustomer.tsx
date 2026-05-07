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
// SCENE 2 — v1.32 (Sequence from absolute F228, local F0–F201, 6.7s)
// Nominal scene window F240–F417 absolute; +12f crossfade pad on each end.
//
// v1.32 changes (2026-05-07): per-feature window extended 8f → 19f, scene
// length 132 → 177 frames (+45f, +1.5s). Icons moved to RIGHT of text.
// Text TYPES char-by-char. Each icon morphs to a LIVE active app-state
// mid-flash and emits drifting simulated content.
//
// Local-frame map (Sequence starts at abs F228; spec frames F180–F357 map
// to local F12–F189 = spec_frame − 180 + 12):
//   F0–F12     crossfade-IN from Scene 1
//   F12–F24    SWIPE-UP WIPE
//   F24–F30    HARD SILENCE
//   F30–F48    CENTERED BRAND LOCKUP fades up
//   F48–F57    🫧 TAGLINE PILL inflates (v1.30)
//   F57–F72    PILL holds with bubble texture (v1.31)
//   F72–F78    PILL pops out
//   F78–F84    AI SPARKLE emerges from logo, begins orbit
//   F84–F160   🌀 4-FEATURE FLASH (19f each, all PERSIST):
//                F84–F103   F1 mic   → red recording UI + drift words
//                F103–F122  F2 person → customer card + drift snippets
//                F122–F141  F3 pins  → activated route + drift addresses
//                F141–F160  F4 bubble→ message-typing + sent state
//   F160–F162  CONSTELLATION HOLD
//   F162–F166  VORTEX — features dissolve sync'd, particles spiral inward
//   F166–F178  LOGO fades + iPhone materializes at center (cross-fade)
//   F178–F189  Dashboard + "All your admin. One place." caption
//   F189–F201  crossfade-OUT into Scene 3
//
// Per-feature 19-frame window timing (relative to feature start = t0):
//   t 0–2   sparkle darts toward landing (motion blur)
//   t 2–4   sparkle pulses; ICON line-draws in
//   t 6–10  VERB types char-by-char (sparse click audio)
//   t 10–18 OUTCOME types char-by-char; final char scale-punches; period +1f delay; underline draws after
//   t 12–16 ICON transforms into ACTIVE app-state (mic→red recording, person→card, pins→route, bubble→typing)
//   t 16–19 DRIFT content emits and continues while feature persists
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
const FEATURE1 = 84;
const FEATURE2 = 103; // +19
const FEATURE3 = 122; // +19
const FEATURE4 = 141; // +19
const FEATURES_END = 160; // F4 ends at 141+19
const CONSTELLATION_HOLD_END = 162;
const VORTEX_START = 162;
const VORTEX_END = 166;
const PHONE_MATERIALIZE = 166;
const LOGO_FADE_END = 174;
const DASHBOARD_IN = 178;
const SCENE_END = 189;
const FEATURE_DURATION = 19;

// Centered logo focal point (1920×1080 frame)
const CENTER = { x: 960, y: 540 };

// v1.29 organic positions — deliberately NOT a perfect 12/3/6/9 clock face.
// Distances vary 310–346 px (not uniform 280). Angles offset 5–15° from
// exact compass points. Deterministic — these are fixed values, not random
// per render.
const ORBIT_BASE_RADIUS = 310; // visual reference for the orbit ring
const ORGANIC_POSITIONS = [
  { x: 985, y: 235 }, // 🎙 F1 — ~12 o'clock-ish, slightly right (+25, -305)
  { x: 1305, y: 510 }, // 👤 F2 — ~3 o'clock-ish, slightly higher
  { x: 940, y: 880 }, // 🗺 F3 — ~6 o'clock-ish, slightly left
  { x: 620, y: 570 }, // 🤝 F4 — ~9 o'clock-ish, slightly lower
];
// Per-feature angle (radians) computed from the organic position above
const ORGANIC_ANGLES = ORGANIC_POSITIONS.map((p) =>
  Math.atan2(p.y - CENTER.y, p.x - CENTER.x)
);
// Per-feature text-block rotation (degrees) — small organic tilt
const FEATURE_ROTATIONS = [2, -2.5, -1.5, 3];

// v1.28 copy — action → feature reveal pattern (Set 3, declarative Jobber).
// Each prefix = the AI action; each outcome = the feature noun the user gets.
// UK spelling preserved ("optimises").
const FEATURES = [
  { prefix: "Speak. Get a", outcome: "quote" },
  { prefix: "Voice fills the", outcome: "profile" },
  { prefix: "AI optimises the", outcome: "route" },
  { prefix: "AI writes the", outcome: "follow-up" },
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
          v1.32: 4 sparkle chimes at burst frames (ascending +1 semitone)
          + sparse typing clicks during char-by-char reveal (every other
          char at 18% vol, per §3.6.4 typing audio rule). */}
      {[FEATURE1 + 2, FEATURE2 + 2, FEATURE3 + 2, FEATURE4 + 2].map((f, i) => (
        <SfxAt
          key={`feat-${i}`}
          src={SFX.notification1}
          from={f}
          volume={0.32}
          playbackRate={Math.pow(2, (5 + i) / 12)}
        />
      ))}
      {/* Typing clicks — every other char during the verb+outcome typing
          windows for each feature. Sparse (alt frames) keeps the mix airy. */}
      {[FEATURE1, FEATURE2, FEATURE3, FEATURE4].flatMap((segStart, i) => {
        const verbLen = FEATURES[i].prefix.length;
        const outcomeLen = FEATURES[i].outcome.length;
        const verbDur = VERB_TYPE_END - VERB_TYPE_START;
        const outcomeDur = OUTCOME_TYPE_END - OUTCOME_TYPE_START;
        // Approximate landing frames per char
        const verbCharFrames = Array.from({ length: verbLen }, (_, c) =>
          Math.round(segStart + VERB_TYPE_START + (c * verbDur) / verbLen)
        );
        const outcomeCharFrames = Array.from({ length: outcomeLen }, (_, c) =>
          Math.round(segStart + OUTCOME_TYPE_START + (c * outcomeDur) / outcomeLen)
        );
        // Take every other for sparseness
        const ticks = [...verbCharFrames, ...outcomeCharFrames].filter(
          (_, k) => k % 2 === 0
        );
        return ticks.map((f, k) => (
          <SfxAt
            key={`type-${i}-${k}`}
            src={SFX.click}
            from={f}
            volume={0.18}
            playbackRate={1.05}
          />
        ));
      })}
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
// TAGLINE PILL (v1.30 + v1.31)
//   v1.30 inflate (F48-F57, 9f): bubble inflates outward from a seed —
//     scaleX widens first, scaleY catches up, elastic settle, with 6
//     micro-particles puffing out at peak inflation (F52) for the
//     "air-release" flourish. Text fades up F52-F56 so it's only legible
//     after full inflation.
//   Hold (F57-F72, 15f): bubble TEXTURE upgrades —
//     (1) iridescent edge gradient (rainbow tint at ~5% opacity) shifting
//         blue → purple → soft pink → blue around the border
//     (2) 2-3 sparkle particles twinkle on/off independently with
//         randomized phase + bottom-left underside highlight (~12% white)
//     (3) text div scale 1.0 → 1.04 → 1.0 synced to diagonal highlight
//         sweep traveling left → right (peak scale = peak highlight at
//         horizontal center). Looped continuously across the 15f hold.
//   Pop-out (F72-F78): scale 1.0 → 0.85 → 0 with opacity fade + 6 particle
//     puff (existing behavior).
// =====================================================================
const TaglinePill: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  // ---------- v1.30 INFLATE (F48-F57) ----------
  // Local inflate timeline (t = frame - PILL_IN):
  //   t 0-3 : scaleX 0 → 1.20, scaleY 0 → 0.60  (rapid horizontal widening)
  //   t 3-5 : scaleX hold ~1.20, scaleY 0.60 → 1.20  (vertical catch-up)
  //   t 5-9 : elastic settle of both → 1.0 (bouncy spring damping 11)
  //   t 4   : peak inflation; 6 micro-particles puff outward
  //   t 4-8 : text content fades up (legible only after full inflate)
  const t = frame - PILL_IN;
  // Horizontal stage
  let inflateX = 0;
  let inflateY = 0;
  if (t < 0) {
    inflateX = 0;
    inflateY = 0;
  } else if (t <= 3) {
    inflateX = interpolate(t, [0, 3], [0, 1.2], { easing: EASE.outCubic });
    inflateY = interpolate(t, [0, 3], [0, 0.6], { easing: EASE.outCubic });
  } else if (t <= 5) {
    inflateX = 1.2;
    inflateY = interpolate(t, [3, 5], [0.6, 1.2], { easing: EASE.outCubic });
  } else {
    // Elastic settle to 1.0 driven by spring on settle phase
    const settleSp = spring({
      frame: t - 5,
      fps,
      config: { damping: 11, mass: 0.7, stiffness: 140 },
    });
    // settleSp goes 0 → 1; we want 1.20 → 1.0
    inflateX = 1.2 - settleSp * 0.2;
    inflateY = 1.2 - settleSp * 0.2;
  }
  // Text-content opacity during inflate (fades up F52-F56)
  const inflateTextOpacity = interpolate(t, [4, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ---------- POP-OUT (F72-F78) ----------
  const popOutP = interpolate(frame, [PILL_OUT_START, PILL_OUT_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inCubic,
  });
  const popOutScale = interpolate(popOutP, [0, 0.5, 1], [1, 0.85, 0]);
  const popOutOpacity = interpolate(popOutP, [0, 1], [1, 0]);

  // ---------- v1.31 HOLD-BEAT (F57-F72) ----------
  const inHold = frame >= PILL_HOLD_START && frame < PILL_OUT_START;
  // Sweep travels left → right over the 15-frame hold (loops within)
  const holdT = inHold ? (frame - PILL_HOLD_START) / 15 : 0;
  // Highlight sweep horizontal position 0..1 across the pill
  const sweepX = holdT;
  // Text breathing: peaks at 1.04 when sweep is at center (0.5)
  const breath = inHold
    ? 1 + 0.04 * Math.sin(holdT * Math.PI) // half-sine: 0 at edges, peak at center
    : 1;
  // Iridescent rainbow rotation (continuous within hold)
  const irisRot = inHold ? holdT * 360 : 0;

  // Compose final scale + opacity
  const isOut = frame >= PILL_OUT_START;
  const isHold = inHold;
  const scaleX = isOut ? popOutScale : inflateX;
  const scaleY = isOut ? popOutScale : isHold ? inflateY : inflateY;
  const opacity = isOut
    ? popOutOpacity
    : interpolate(t, [0, 2], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

  // Per-frame deterministic random phases for surface sparkles (3 sparkles)
  const sparkles = [
    { x: 28, y: 32, phaseOffset: 0 },
    { x: 65, y: 18, phaseOffset: 11 },
    { x: 80, y: 60, phaseOffset: 22 },
  ];

  return (
    <div
      style={{
        position: "absolute",
        left: CENTER.x,
        top: CENTER.y + 200,
        transform: `translate(-50%, -50%) scaleX(${scaleX}) scaleY(${scaleY})`,
        opacity,
        pointerEvents: "none",
      }}
    >
      {/* PILL BODY */}
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
        {/* v1.31: iridescent edge gradient — rotating rainbow tint at ~5% */}
        {isHold && (
          <div
            style={{
              position: "absolute",
              inset: -1,
              borderRadius: 999,
              padding: 1,
              background: `conic-gradient(from ${irisRot}deg, rgba(59,130,246,0.05), rgba(109,40,217,0.06), rgba(255,150,200,0.05), rgba(59,130,246,0.05))`,
              WebkitMask:
                "linear-gradient(#000, #000) content-box, linear-gradient(#000, #000)",
              WebkitMaskComposite: "xor" as const,
              maskComposite: "exclude" as const,
              pointerEvents: "none",
            }}
          />
        )}

        {/* Diagonal highlight sweep across the pill (continuous through hold) */}
        {isHold && (
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${-30 + sweepX * 130}%`,
              width: "35%",
              background:
                "linear-gradient(110deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.32) 50%, rgba(255,255,255,0) 100%)",
              pointerEvents: "none",
            }}
          />
        )}

        {/* v1.31: bottom-left underside highlight reflection */}
        {isHold && (
          <div
            style={{
              position: "absolute",
              left: "8%",
              bottom: "18%",
              width: "32%",
              height: "30%",
              borderRadius: "50%",
              background:
                "radial-gradient(ellipse at 30% 70%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 70%)",
              pointerEvents: "none",
            }}
          />
        )}

        {/* v1.31: 3 surface sparkle particles, independent twinkle phase */}
        {isHold &&
          sparkles.map((s, i) => {
            // 30-frame full twinkle cycle, phase offset per sparkle
            const phase = ((frame - PILL_HOLD_START + s.phaseOffset) % 30) / 30;
            // Triangle wave 0 → 1 → 0
            const sparkleScale =
              phase < 0.5 ? phase * 2 : (1 - phase) * 2;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  width: 2,
                  height: 2,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.95)",
                  boxShadow: "0 0 4px rgba(255,255,255,0.8)",
                  transform: `scale(${sparkleScale})`,
                  opacity: sparkleScale,
                  pointerEvents: "none",
                }}
              />
            );
          })}

        {/* TEXT — synced breathing scale to highlight sweep */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            transform: `scale(${breath})`,
            transformOrigin: "center center",
            opacity: isOut ? 1 : Math.min(1, inflateTextOpacity),
          }}
        >
          Blue collar solutions to blue collar problems
        </div>
      </div>

      {/* v1.30: 6 air-release micro-particles puff out at peak inflation (t=4) */}
      {t >= 3 && t <= 9 && <InflateAirParticles t={t} />}

      {/* Pop-out particle puff (existing behavior) */}
      {frame >= PILL_OUT_START + 2 && frame < PILL_OUT_END + 2 && (
        <PillPuff frame={frame} />
      )}
    </div>
  );
};

const InflateAirParticles: React.FC<{ t: number }> = ({ t }) => {
  // Particles emit at t=3..4 and travel outward, fading by t=9
  const p = interpolate(t, [3, 9], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fade = 1 - p;
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => {
        const ang = (i / 6) * Math.PI * 2 + 0.2;
        const r = 20 + p * 70;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 3,
              height: 3,
              marginLeft: -1.5,
              marginTop: -1.5,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.9)",
              boxShadow: "0 0 6px rgba(255,255,255,0.7)",
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
// ORBIT TRAIL — wobbly purple loop through the 4 organic positions
// (v1.29: NOT a perfect circle — passes through the actual landing points)
// =====================================================================
const TRAIL_PATH = (() => {
  const p = ORGANIC_POSITIONS;
  const ctrl = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    const dx = mx - CENTER.x;
    const dy = my - CENTER.y;
    const d = Math.hypot(dx, dy) || 1;
    const bulge = 28; // pull control point outward
    return { x: mx + (dx / d) * bulge, y: my + (dy / d) * bulge };
  };
  const c01 = ctrl(p[0], p[1]);
  const c12 = ctrl(p[1], p[2]);
  const c23 = ctrl(p[2], p[3]);
  const c30 = ctrl(p[3], p[0]);
  return `M ${p[0].x},${p[0].y} Q ${c01.x},${c01.y} ${p[1].x},${p[1].y} Q ${c12.x},${c12.y} ${p[2].x},${p[2].y} Q ${c23.x},${c23.y} ${p[3].x},${p[3].y} Q ${c30.x},${c30.y} ${p[0].x},${p[0].y} Z`;
})();

const OrbitTrail: React.FC<{ frame: number }> = ({ frame }) => {
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
    <svg
      width={1920}
      height={1080}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
      }}
    >
      <path
        d={TRAIL_PATH}
        fill="none"
        stroke={`rgba(109,40,217,${trailOpacity})`}
        strokeWidth={1.4}
        style={{
          filter: `drop-shadow(0 0 ${10 * trailOpacity}px rgba(109,40,217,${
            trailOpacity * 0.7
          }))`,
        }}
      />
    </svg>
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
    // Dart along an organic curve from prev landing → target landing.
    // For i=0, "prev" is the logo center (sparkle was just born there).
    const prev = i === 0 ? CENTER : ORGANIC_POSITIONS[i - 1];
    const target = ORGANIC_POSITIONS[i];
    const dartP = interpolate(t, [0, 2], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE.inOutQuad,
    });
    // Curved path — pull control point outward from center for an arc-like sweep
    const mx = (prev.x + target.x) / 2;
    const my = (prev.y + target.y) / 2;
    const dx = mx - CENTER.x;
    const dy = my - CENTER.y;
    const d = Math.hypot(dx, dy) || 1;
    const bulge = 40;
    const ctrlX = mx + (dx / d) * bulge;
    const ctrlY = my + (dy / d) * bulge;
    // Quadratic bezier: B(t) = (1-t)^2 P0 + 2(1-t)t C + t^2 P1
    const u = 1 - dartP;
    cx = u * u * prev.x + 2 * u * dartP * ctrlX + dartP * dartP * target.x;
    cy = u * u * prev.y + 2 * u * dartP * ctrlY + dartP * dartP * target.y;
    // F2-F5: pulse bright on landing
    pulseScale = interpolate(t, [2, 3.5, 5], [1, 1.4, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else if (frame < VORTEX_START) {
    // Constellation hold — sparkle parked at last landing (F4 ~9 o'clock)
    cx = ORGANIC_POSITIONS[3].x;
    cy = ORGANIC_POSITIONS[3].y;
  } else {
    // Vortex — spiral inward to center
    const vp = interpolate(frame, [VORTEX_START, VORTEX_END], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE.inCubic,
    });
    cx = interpolate(vp, [0, 1], [ORGANIC_POSITIONS[3].x, CENTER.x]);
    cy = interpolate(vp, [0, 1], [ORGANIC_POSITIONS[3].y, CENTER.y]);
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
// FEATURE TEXTS (v1.32) — horizontal composition: text LEFT, icon RIGHT.
// Text TYPES char-by-char. Per-feature 19f window. All 4 PERSIST until
// vortex (F162) when all dissolve sync'd.
//
// Per-feature timing (relative to feature start t0 = FEATURE_N):
//   t 0–2   sparkle darts (no text/icon yet)
//   t 2–4   icon LINE-DRAWS in
//   t 6–10  VERB types char-by-char (~3 cpf for short prefixes; ~3 frames per phrase)
//   t 10–18 OUTCOME types char-by-char; final char scale-punches
//   t 17    period appears (1f after final char)
//   t 18–19 underline draws in
//   t 12–16 icon morphs to ACTIVE state (handled inside FeatureIcon)
//   t 16+   drift content emits (handled inside FeatureIcon)
// =====================================================================

// Per-feature char-land frame helpers
const VERB_TYPE_START = 6;
const VERB_TYPE_END = 10;
const OUTCOME_TYPE_START = 10;
const OUTCOME_TYPE_END = 18;
const PERIOD_FRAME = 17;
const UNDERLINE_DRAW_START = 18;
const UNDERLINE_DRAW_END = 19;

function visibleChars(text: string, t: number, startFrame: number, endFrame: number): string {
  if (t < startFrame) return "";
  if (t >= endFrame) return text;
  const dur = endFrame - startFrame;
  const charsPerFrame = text.length / dur;
  const visible = Math.floor((t - startFrame) * charsPerFrame + 0.0001);
  return text.slice(0, Math.min(text.length, visible));
}

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

        // Char-by-char typed reveal
        const verbVisible = visibleChars(
          feat.prefix,
          t,
          VERB_TYPE_START,
          VERB_TYPE_END
        );
        const outcomeVisible = visibleChars(
          feat.outcome,
          t,
          OUTCOME_TYPE_START,
          OUTCOME_TYPE_END
        );
        const showPeriod = t >= PERIOD_FRAME;

        // Scale-punch on the final char of outcome (lands at t≈18, peaks 18→19)
        const punch =
          t >= OUTCOME_TYPE_END - 1 && t <= OUTCOME_TYPE_END + 2
            ? interpolate(t, [OUTCOME_TYPE_END - 1, OUTCOME_TYPE_END + 1, OUTCOME_TYPE_END + 2], [1, 1.08, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })
            : 1;

        // Underline draws in F18-F19 (and stays drawn while feature persists)
        const underlineW = interpolate(
          t,
          [UNDERLINE_DRAW_START, UNDERLINE_DRAW_END + 2],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: EASE.outCubic,
          }
        );

        // Sync'd dissolve at VORTEX_START
        const dissolve = interpolate(
          frame,
          [VORTEX_START, VORTEX_START + 4],
          [1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        // Slight pull toward center during constellation collapse
        const pos = ORGANIC_POSITIONS[i];
        const collapsePull = interpolate(
          frame,
          [VORTEX_START, VORTEX_END],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        const px = interpolate(collapsePull, [0, 1], [pos.x, CENTER.x]);
        const py = interpolate(collapsePull, [0, 1], [pos.y, CENTER.y]);

        // Anchor each feature OUTSIDE the orbit ring (preserved from v1.29)
        const anchorMap = [
          "translate(-50%, -100%)",
          "translate(0%, -50%)",
          "translate(-50%, 0%)",
          "translate(-100%, -50%)",
        ];
        const rot = FEATURE_ROTATIONS[i];

        // Block-level opacity — present from t≥2 (icon line-draw start)
        const blockOpacity =
          t < 2 ? 0 : Math.min(1, (t - 2) / 2) * dissolve;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: px,
              top: py,
              transform: `${anchorMap[i]} rotate(${rot}deg) scale(${collapseScale})`,
              opacity: blockOpacity,
              fontFamily: "Inter, system-ui",
              color: "#fff",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 24,
              pointerEvents: "none",
              zIndex: 40,
            }}
          >
            {/* TEXT BLOCK (left) — verb stacked above outcome, underline below */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 0,
              }}
            >
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.80)",
                  letterSpacing: -0.3,
                  whiteSpace: "nowrap",
                  lineHeight: 1.0,
                  marginBottom: 4,
                  minHeight: 22,
                }}
              >
                {verbVisible}
                {t >= VERB_TYPE_START &&
                  t < VERB_TYPE_END &&
                  Math.floor(t / 2) % 2 === 0 && (
                    <span
                      style={{
                        display: "inline-block",
                        width: 2,
                        height: 18,
                        background: "rgba(255,255,255,0.7)",
                        marginLeft: 2,
                        verticalAlign: "middle",
                      }}
                    />
                  )}
              </div>
              <div
                style={{
                  fontSize: 60,
                  fontWeight: 700,
                  color: "#fff",
                  letterSpacing: -1.5,
                  transform: `scale(${punch})`,
                  transformOrigin: "right center",
                  whiteSpace: "nowrap",
                  lineHeight: 1.0,
                  textShadow:
                    "0 4px 24px rgba(15,23,42,0.6), 0 0 32px rgba(109,40,217,0.45)",
                }}
              >
                {outcomeVisible}
                {showPeriod && (
                  <span style={{ color: COLOR.aiPurple }}>.</span>
                )}
                {t >= OUTCOME_TYPE_START &&
                  t < OUTCOME_TYPE_END &&
                  Math.floor(t / 2) % 2 === 0 && (
                    <span
                      style={{
                        display: "inline-block",
                        width: 4,
                        height: 48,
                        background: "rgba(255,255,255,0.85)",
                        marginLeft: 4,
                        verticalAlign: "middle",
                      }}
                    />
                  )}
              </div>
              {/* Underline beneath outcome word */}
              <div
                style={{
                  width: 180 * underlineW,
                  height: 3,
                  marginTop: 6,
                  alignSelf: "flex-end",
                  background: `linear-gradient(90deg, rgba(109,40,217,0) 0%, ${COLOR.aiPurple} 50%, rgba(109,40,217,0) 100%)`,
                  boxShadow: `0 0 8px ${COLOR.aiPurple}`,
                  opacity: dissolve,
                }}
              />
            </div>

            {/* ICON BLOCK (right) — line-draws, then morphs to active state */}
            <FeatureIcon index={i} localTime={t} />
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
        // Distribute particles around the 4 organic positions + sparkle path
        const clockIdx = i % 4;
        const start = ORGANIC_POSITIONS[clockIdx];
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

// =====================================================================
// FEATURE ICONS (v1.32) — each icon has FOUR PHASES:
//   t 2–4   line-draw entry
//   t 4–12  idle (line-art icon, gentle micro-motion)
//   t 12–16 ACTIVE-STATE MORPH (icon → live app UI fragment)
//   t 16+   continuous active state + drift simulated content
//
// Active states + drift content per feature:
//   F1 🎙 → red recording state (matches Kiva app's VoiceQuote screen:
//          red record core, stop icon, pulse rings) + drifting words
//          "Quote for a standard toilet refit"
//   F2 👤 → live customer card auto-filling + snippets
//          "Annie Yang" / "07700 900123" / "Notting Hill, London"
//   F3 🗺 → activated route (pulse pins + bright gradient path) +
//          drifting addresses "Hammersmith" / "Notting Hill" / "Fulham"
//   F4 🤝 → message-typing UI (typing dots → streamed text → sent state)
//          drifting "Hi John, just following up..."
// =====================================================================

const ICON_SIZE = 92; // Sized to roughly match the OUTCOME word height (~60px) + padding
const ICON_GLOW_FILTER =
  "drop-shadow(0 0 8px rgba(109,40,217,0.55)) drop-shadow(0 0 4px rgba(109,40,217,0.4))";

// Phase transition frames (relative to feature start)
const ICON_DRAW_START = 2;
const ICON_DRAW_END = 4;
const ICON_MORPH_START = 12;
const ICON_MORPH_END = 16;
const DRIFT_START = 16;

const FeatureIcon: React.FC<{ index: number; localTime: number }> = ({
  index,
  localTime,
}) => {
  switch (index) {
    case 0:
      return <MicWaveformIcon localTime={localTime} />;
    case 1:
      return <PersonFillIcon localTime={localTime} />;
    case 2:
      return <RouteMorphIcon localTime={localTime} />;
    case 3:
      return <SpeechAirplaneIcon localTime={localTime} />;
    default:
      return null;
  }
};

// 🎙 Feature 1 — Mic (line-art) → red recording state (matches Kiva
// app's VoiceQuote screen: red core, stop icon, pulse rings, waveform bars)
// Drift content: spoken words "Quote for a standard toilet refit"
const F1_DRIFT_WORDS = [
  "Quote",
  "for",
  "a",
  "standard",
  "toilet",
  "refit",
];
const RED_RECORD = "#EF4444";

const MicWaveformIcon: React.FC<{ localTime: number }> = ({ localTime }) => {
  // Line-draw F2-F4
  const drawP = interpolate(localTime, [ICON_DRAW_START, ICON_DRAW_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Active-state morph progress F12-F16 (0=idle line-art, 1=red recording)
  const morphP = interpolate(localTime, [ICON_MORPH_START, ICON_MORPH_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  const isActive = morphP > 0;
  // Continuous gentle breathing during idle phase
  const breathe = 1 + 0.04 * Math.sin((localTime / 30) * Math.PI * 2);
  // Recording-state pulse rings (continuous after morph starts)
  const recT = Math.max(0, localTime - ICON_MORPH_START);

  return (
    <div style={{ position: "relative", width: ICON_SIZE, height: ICON_SIZE }}>
      <svg
        width={ICON_SIZE}
        height={ICON_SIZE}
        viewBox="0 0 64 64"
        style={{ filter: ICON_GLOW_FILTER }}
      >
        {/* Idle: 3 concentric waveform arcs (fade out as morph engages) */}
        {[0, 1, 2].map((i) => {
          const phase = ((localTime + i * 10) % 30) / 30;
          const r = 14 + phase * 18;
          const arcOpacity =
            (phase < 0.1 ? phase * 10 : phase > 0.85 ? (1 - phase) * 6.6 : 1) *
            (1 - morphP);
          return (
            <circle
              key={i}
              cx={32}
              cy={32}
              r={r}
              fill="none"
              stroke={`rgba(255,255,255,${0.35 * arcOpacity})`}
              strokeWidth={2}
              strokeDasharray="3 4"
            />
          );
        })}
        {/* Recording-state pulse rings (red, only when active) */}
        {isActive &&
          [0, 1].map((i) => {
            const phase = ((recT + i * 14) % 28) / 28;
            return (
              <circle
                key={`pulse-${i}`}
                cx={32}
                cy={32}
                r={14 + phase * 16}
                fill="none"
                stroke={`rgba(239,68,68,${(1 - phase) * 0.55 * morphP})`}
                strokeWidth={2}
              />
            );
          })}
        {/* Idle mic body (line-art) — fades out as morph progresses */}
        <g
          transform={`scale(${breathe}) translate(${(1 - breathe) * 32}, ${(1 - breathe) * 32})`}
          opacity={1 - morphP}
        >
          <rect
            x={26}
            y={16}
            width={12}
            height={22}
            rx={6}
            fill="none"
            stroke="rgba(255,255,255,0.95)"
            strokeWidth={3}
            strokeDasharray={`${drawP * 100} 100`}
          />
          <path
            d="M 20 36 Q 20 46 32 46 Q 44 46 44 36"
            fill="none"
            stroke="rgba(255,255,255,0.95)"
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray={`${drawP * 100} 100`}
          />
          <line
            x1={32}
            y1={46}
            x2={32}
            y2={54}
            stroke="rgba(255,255,255,0.95)"
            strokeWidth={3}
            strokeLinecap="round"
            opacity={drawP}
          />
        </g>
        {/* Active recording state: red filled core circle with stop square */}
        {isActive && (
          <g opacity={morphP}>
            <circle
              cx={32}
              cy={32}
              r={12}
              fill={RED_RECORD}
              style={{
                filter: `drop-shadow(0 0 8px ${RED_RECORD})`,
              }}
            />
            <rect x={28} y={28} width={8} height={8} rx={1} fill="#fff" />
          </g>
        )}
        {/* Waveform bars below the core (active state only) */}
        {isActive &&
          [0, 1, 2, 3, 4].map((i) => {
            const barX = 18 + i * 7;
            const wave =
              0.4 + 0.6 * Math.abs(Math.sin((recT / 4 + i * 0.7) * Math.PI));
            const h = 4 + wave * 8;
            return (
              <rect
                key={`bar-${i}`}
                x={barX - 1.5}
                y={50 - h}
                width={3}
                height={h}
                rx={1}
                fill={`rgba(239,68,68,${0.85 * morphP})`}
              />
            );
          })}
      </svg>
      {/* Drift words rising upward from the icon */}
      <DriftWords
        words={F1_DRIFT_WORDS}
        localTime={localTime}
        startFrame={DRIFT_START}
        wordIntervalFrames={3}
        size={14}
        opacity={0.6}
      />
    </div>
  );
};

// Drift content helper — words rise upward from icon and fade
const DriftWords: React.FC<{
  words: string[];
  localTime: number;
  startFrame: number;
  wordIntervalFrames: number;
  size: number;
  opacity: number;
}> = ({ words, localTime, startFrame, wordIntervalFrames, size, opacity }) => {
  return (
    <>
      {words.map((word, i) => {
        const spawn = startFrame + i * wordIntervalFrames;
        const t = localTime - spawn;
        if (t < 0) return null;
        // Drift upward 1px/frame, fade over 18 frames
        const driftY = -t * 1.4;
        const driftX = ((i * 13) % 30) - 15; // slight horizontal jitter
        const fade = interpolate(t, [0, 4, 18], [0, opacity, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        if (fade <= 0) return null;
        return (
          <div
            key={`${word}-${i}`}
            style={{
              position: "absolute",
              left: ICON_SIZE / 2,
              top: -8,
              transform: `translate(calc(-50% + ${driftX}px), ${driftY}px)`,
              fontSize: size,
              fontWeight: 400,
              color: `rgba(255,255,255,${fade})`,
              fontFamily: "Inter, system-ui",
              whiteSpace: "nowrap",
              pointerEvents: "none",
            }}
          >
            {word}
          </div>
        );
      })}
    </>
  );
};

// 👤 Feature 2 — Person silhouette → live customer-card auto-filling
// Drift content: "Annie Yang" / "07700 900123" / "Notting Hill, London"
const F2_CARD_FIELDS = ["Annie Yang", "07700 900123", "Notting Hill, London"];

const PersonFillIcon: React.FC<{ localTime: number }> = ({ localTime }) => {
  // Outline draws F2-F4
  const drawP = interpolate(localTime, [ICON_DRAW_START, ICON_DRAW_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Fill from bottom up F4-F8 (idle phase shows filled silhouette)
  const fillP = interpolate(localTime, [4, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Idle check stamps F8-F10
  const idleCheckP = interpolate(localTime, [8, 9, 10], [0, 1.15, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Active morph F12-F16: silhouette shrinks to icon-tab; customer card slides in beside it
  const morphP = interpolate(localTime, [ICON_MORPH_START, ICON_MORPH_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });

  // Customer-card auto-fill timing: each field types into a row.
  // Fields appear sequentially after morph completes (F16+).
  const cardActive = localTime >= ICON_MORPH_END;

  return (
    <div style={{ position: "relative", width: ICON_SIZE, height: ICON_SIZE }}>
      <svg
        width={ICON_SIZE}
        height={ICON_SIZE}
        viewBox="0 0 64 64"
        style={{
          filter: ICON_GLOW_FILTER,
          transform: `scale(${1 - morphP * 0.45}) translate(${
            -morphP * 18
          }px, 0)`,
          transformOrigin: "left center",
        }}
      >
        <defs>
          <clipPath id="person-clip-f2">
            <circle cx={32} cy={22} r={9} />
            <path d="M 14 56 Q 14 38 32 38 Q 50 38 50 56 Z" />
          </clipPath>
        </defs>
        <rect
          x={10}
          y={56 - 46 * fillP}
          width={44}
          height={46}
          fill={COLOR.aiPurple}
          clipPath="url(#person-clip-f2)"
          opacity={0.85}
        />
        <circle
          cx={32}
          cy={22}
          r={9}
          fill="none"
          stroke="rgba(255,255,255,0.95)"
          strokeWidth={3}
          strokeDasharray={`${drawP * 100} 100`}
        />
        <path
          d="M 14 56 Q 14 38 32 38 Q 50 38 50 56"
          fill="none"
          stroke="rgba(255,255,255,0.95)"
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={`${drawP * 100} 100`}
        />
        {idleCheckP > 0 && (
          <g
            transform={`translate(46, 16) scale(${idleCheckP})`}
            style={{
              filter: `drop-shadow(0 0 4px ${COLOR.accepted})`,
            }}
          >
            <circle cx={0} cy={0} r={9} fill={COLOR.accepted} />
            <path
              d="M -4 0 L -1 3 L 4 -3"
              fill="none"
              stroke="#fff"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        )}
      </svg>

      {/* Customer card panel — slides in from right during morph */}
      {morphP > 0 && (
        <div
          style={{
            position: "absolute",
            top: 8,
            left: ICON_SIZE * 0.45,
            width: 130,
            height: 86,
            background: "rgba(15,23,42,0.85)",
            backdropFilter: "blur(8px)",
            border: `1px solid rgba(109,40,217,0.55)`,
            borderRadius: 8,
            padding: 8,
            opacity: morphP,
            transform: `translateX(${(1 - morphP) * -20}px)`,
            boxShadow: `0 0 12px rgba(109,40,217,${morphP * 0.5})`,
            display: "flex",
            flexDirection: "column",
            gap: 6,
            fontFamily: "Inter, system-ui",
          }}
        >
          {F2_CARD_FIELDS.map((field, i) => {
            // Each field reveals at DRIFT_START + i*5
            const spawn = DRIFT_START + i * 5;
            const t = localTime - spawn;
            // Type chars in over 4 frames
            const visible = cardActive && t >= 0 ? Math.min(field.length, Math.floor((t / 4) * field.length)) : 0;
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  opacity: t >= 0 ? 1 : 0.35,
                }}
              >
                <div
                  style={{
                    fontSize: 7,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.5)",
                    textTransform: "uppercase",
                    letterSpacing: 0.4,
                  }}
                >
                  {["Name", "Phone", "Address"][i]}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 500,
                    color: "#fff",
                    minHeight: 12,
                  }}
                >
                  {field.slice(0, visible)}
                  {t >= 0 && visible < field.length && (
                    <span style={{ color: COLOR.aiPurple }}>|</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// 🗺 Feature 3 — Pins → wavy route → optimized path → ACTIVATED route
// Drift content: addresses "Hammersmith" / "Notting Hill" / "Fulham"
const F3_DRIFT_ADDRESSES = ["Hammersmith", "Notting Hill", "Fulham"];

const RouteMorphIcon: React.FC<{ localTime: number }> = ({ localTime }) => {
  const pinP = interpolate(localTime, [ICON_DRAW_START, ICON_DRAW_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const wavyP = interpolate(localTime, [4, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Initial wavy → optimized morph (idle phase, F6-F10)
  const idleMorphP = interpolate(localTime, [6, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  // Active "route activation" morph F12-F16: optimized path brightens,
  // gradient saturates, pins pulse, particles speed up
  const activeP = interpolate(localTime, [ICON_MORPH_START, ICON_MORPH_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });

  const wavyPath = `M 12 48 Q 22 30, 32 38 T 52 16`;
  const optimPath = `M 12 48 Q 28 32, 52 16`;

  // Pins pulse during activation
  const pinPulse = activeP > 0
    ? 1 + 0.15 * activeP * Math.abs(Math.sin((localTime / 5) * Math.PI))
    : 1;

  // Particle flow speed increases in active state
  const flowSpeedDiv = activeP > 0.5 ? 24 : 36;

  return (
    <div style={{ position: "relative", width: ICON_SIZE, height: ICON_SIZE }}>
      <svg
        width={ICON_SIZE}
        height={ICON_SIZE}
        viewBox="0 0 64 64"
        style={{ filter: ICON_GLOW_FILTER }}
      >
        <defs>
          <linearGradient id="route-grad-f3" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor={COLOR.blue} />
            <stop offset="100%" stopColor={COLOR.aiPurple} />
          </linearGradient>
        </defs>
        {/* Wavy path — fades as initial morph completes */}
        <path
          d={wavyPath}
          fill="none"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth={2}
          strokeDasharray={`${wavyP * 80 * (1 - idleMorphP)} 100`}
          opacity={1 - idleMorphP}
        />
        {/* Optimized path — brightens in active state */}
        <path
          d={optimPath}
          fill="none"
          stroke="url(#route-grad-f3)"
          strokeWidth={3 + activeP * 1.5}
          strokeLinecap="round"
          opacity={idleMorphP}
          style={{
            filter: `drop-shadow(0 0 ${4 + activeP * 8}px rgba(109,40,217,${0.4 + activeP * 0.4}))`,
          }}
        />
        {/* Flowing particles */}
        {idleMorphP > 0.7 &&
          [0, 1, 2, 3].map((i) => {
            const t = ((localTime + i * 9) % flowSpeedDiv) / flowSpeedDiv;
            const u = 1 - t;
            const px = u * u * 12 + 2 * u * t * 28 + t * t * 52;
            const py = u * u * 48 + 2 * u * t * 32 + t * t * 16;
            return (
              <circle
                key={i}
                cx={px}
                cy={py}
                r={2.5 + activeP * 1}
                fill={i % 2 === 0 ? COLOR.blue : COLOR.aiPurple}
                opacity={0.85 * (t < 0.1 ? t * 10 : t > 0.9 ? (1 - t) * 10 : 1)}
              />
            );
          })}
        {/* Two pins (with pulse during active state) */}
        <g transform={`translate(12, 48) scale(${pinP * pinPulse})`}>
          <circle cx={0} cy={0} r={4.5} fill="rgba(255,255,255,0.95)" />
          <path d="M 0 -4 L -3 -8 L 3 -8 Z" fill="rgba(255,255,255,0.95)" />
        </g>
        <g transform={`translate(52, 16) scale(${pinP * pinPulse})`}>
          <circle cx={0} cy={0} r={4.5} fill={COLOR.aiPurple} />
          <path d="M 0 -4 L -3 -8 L 3 -8 Z" fill={COLOR.aiPurple} />
        </g>
      </svg>
      {/* Drift addresses — rise from the icon */}
      <DriftWords
        words={F3_DRIFT_ADDRESSES}
        localTime={localTime}
        startFrame={DRIFT_START}
        wordIntervalFrames={4}
        size={13}
        opacity={0.55}
      />
    </div>
  );
};

// 🤝 Feature 4 — Speech bubble → live message-typing UI → sent state
// Drift content: "Hi John, just following up..."
const F4_MESSAGE = "Hi John, just following up...";

const SpeechAirplaneIcon: React.FC<{ localTime: number }> = ({ localTime }) => {
  // Bubble line-draws F2-F4
  const bubbleP = interpolate(localTime, [ICON_DRAW_START, ICON_DRAW_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Idle airplane loop F4-F12 (looping fly-out, every 36f)
  const idleT = Math.max(0, localTime - 4);
  const loopT = (idleT % 36) / 36;
  const idleAirOpacity =
    localTime < 4 || localTime >= ICON_MORPH_START
      ? 0
      : loopT < 0.05
      ? loopT * 20
      : loopT > 0.7
      ? Math.max(0, (0.85 - loopT) * 6.6)
      : 1;
  const idleAirX = interpolate(loopT, [0, 0.7], [22, 56]);
  const idleAirY = interpolate(loopT, [0, 0.7], [22, -8]);

  // Active morph F12-F16: bubble grows, three typing dots animate
  const morphP = interpolate(localTime, [ICON_MORPH_START, ICON_MORPH_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });

  // Message types in F16+ (~15f to type the full string)
  const msgT = localTime - DRIFT_START;
  const msgVisible =
    msgT >= 0 ? Math.min(F4_MESSAGE.length, Math.floor((msgT / 18) * F4_MESSAGE.length)) : 0;
  const msgFullyTyped = msgVisible >= F4_MESSAGE.length;

  // Sent-state airplane fires after message fully typed
  const sentT = msgFullyTyped ? localTime - (DRIFT_START + 18) : -1;
  const sentAirOpacity =
    sentT >= 0
      ? interpolate(sentT, [0, 2, 8], [0, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;
  const sentAirX = interpolate(sentT, [0, 8], [40, 90]);
  const sentAirY = interpolate(sentT, [0, 8], [22, -32]);

  // Sent check stamp after airplane fires
  const sentCheckP =
    sentT >= 0
      ? interpolate(sentT, [4, 5, 6], [0, 1.15, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

  return (
    <div style={{ position: "relative", width: ICON_SIZE, height: ICON_SIZE }}>
      <svg
        width={ICON_SIZE}
        height={ICON_SIZE}
        viewBox="0 0 64 64"
        style={{ filter: ICON_GLOW_FILTER, overflow: "visible" }}
      >
        {/* Speech bubble outline — grows with morph progress */}
        <g
          transform={`scale(${1 + morphP * 0.15}) translate(${
            -morphP * 5
          }, ${-morphP * 2})`}
          style={{ transformOrigin: "28px 22px" }}
        >
          <path
            d="M 8 12 Q 8 8 12 8 L 44 8 Q 48 8 48 12 L 48 32 Q 48 36 44 36 L 24 36 L 18 44 L 18 36 L 12 36 Q 8 36 8 32 Z"
            fill={`rgba(15,23,42,${morphP * 0.4})`}
            stroke="rgba(255,255,255,0.95)"
            strokeWidth={3}
            strokeLinejoin="round"
            strokeDasharray={`${bubbleP * 200} 200`}
          />
        </g>
        {/* Idle airplane — visible only during F4-F12 idle phase */}
        {idleAirOpacity > 0 && (
          <g
            transform={`translate(${idleAirX}, ${idleAirY}) rotate(-25)`}
            opacity={idleAirOpacity}
          >
            <path
              d="M -6 0 L 6 -2 L 6 2 L -6 0 L -3 -3 M -6 0 L -3 3"
              fill="none"
              stroke="rgba(255,255,255,0.95)"
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <path
              d="M -6 0 L 6 -2"
              stroke="rgba(255,255,255,0.95)"
              strokeWidth={2}
            />
          </g>
        )}
        {/* Typing dots inside bubble — F12+ until message starts typing */}
        {morphP > 0.3 && msgT < 4 &&
          [0, 1, 2].map((i) => {
            const dotPhase = ((localTime + i * 4) % 12) / 12;
            const dotY = 22 - 2 * Math.abs(Math.sin(dotPhase * Math.PI));
            return (
              <circle
                key={`dot-${i}`}
                cx={20 + i * 8}
                cy={dotY}
                r={2.2}
                fill={`rgba(255,255,255,${0.6 + 0.4 * Math.abs(
                  Math.sin(dotPhase * Math.PI)
                )})`}
              />
            );
          })}
        {/* Sent airplane firing out of bubble */}
        {sentAirOpacity > 0 && (
          <g
            transform={`translate(${sentAirX}, ${sentAirY}) rotate(-30)`}
            opacity={sentAirOpacity}
          >
            <path
              d="M -8 0 L 8 -3 L 8 3 L -8 0 L -4 -4 M -8 0 L -4 4"
              fill="rgba(59,130,246,0.35)"
              stroke={COLOR.blue}
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
              style={{
                filter: `drop-shadow(0 0 6px ${COLOR.blue})`,
              }}
            />
          </g>
        )}
        {/* Sent check stamp */}
        {sentCheckP > 0 && (
          <g
            transform={`translate(50, 12) scale(${sentCheckP})`}
            style={{
              filter: `drop-shadow(0 0 4px ${COLOR.accepted})`,
            }}
          >
            <circle cx={0} cy={0} r={7} fill={COLOR.accepted} />
            <path
              d="M -3 0 L -1 2 L 3 -2"
              fill="none"
              stroke="#fff"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        )}
      </svg>
      {/* Message text streaming inside the bubble (overlay over SVG) */}
      {msgT >= 0 && (
        <div
          style={{
            position: "absolute",
            top: 22,
            left: 18,
            width: 76,
            fontSize: 8,
            fontWeight: 500,
            color: "rgba(255,255,255,0.92)",
            fontFamily: "Inter, system-ui",
            lineHeight: 1.25,
            opacity: morphP,
          }}
        >
          {F4_MESSAGE.slice(0, msgVisible)}
          {!msgFullyTyped && Math.floor(localTime / 4) % 2 === 0 && (
            <span style={{ color: COLOR.aiPurple }}>|</span>
          )}
        </div>
      )}
    </div>
  );
};
