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
// SCENE 2 — v1.24 (Sequence from absolute F228, total local F0–F156, 5.2s)
// Nominal scene window F240–F372 absolute; +12f crossfade pad on each end.
// (file kept as Scene2_VoiceCustomer.tsx for git diff continuity)
//
// Replaces v1.22's "iPhone + Kiva app opening" spec. User direction:
// after "Feeling overwhelmed?" types in Scene 1, swipe-up wipe → centered
// brand lockup → logo glides to top-right (persists rest of ad) → AI
// sparkle as the Director, darting to 4 quadrants and bursting feature
// text → vortex → iPhone materializes → dashboard.
//
// Local-frame map (Sequence start = absolute F228; add 228 to get abs):
//   F0–F12    crossfade-IN from Scene 1 (SceneCrossfade dims content; we
//             render only dark-navy background here)
//   F12–F24   SWIPE-UP WIPE — vertical sweep upward, dark veil rising
//   F24–F30   HARD SILENCE — pure dark navy, nothing on screen
//   F30–F48   BRAND LOCKUP fades up centered:
//              F30–F38  chevron logo
//              F36–F44  "Kiva." wordmark
//              F42–F48  tagline "Blue collar solutions for blue collar problems"
//   F48–F60   HOLD with gentle glow pulse (viewer reads tagline)
//   F60–F78   LOGO GLIDES top-right (scale 1→0.5); wordmark + tagline fade
//   F78–F84   AI SPARKLE enters center stage
//   F84–F116  4-FEATURE FLASH — sparkle as Director (8f each):
//              F84–F92   upper-left  "Speak quotes."
//              F92–F100  upper-right "Save customers."
//              F100–F108 lower-left  "Drive less."
//              F108–F116 lower-right "Win more jobs."
//   F116–F122 VORTEX — particles spiral inward
//   F122–F134 iPhone materializes from vortex flare
//   F134–F144 Dashboard appears, "All your admin. One place." caption
//   F144–F156 crossfade-OUT into Scene 3
//
// Kinetic typography: verb small (Inter_400Regular ~32px), outcome word
// HUGE (Inter_700Bold ~84px) with scale-punch 1.0→1.08→1.0 + soft purple
// underline.
//
// PERSISTENT chevron top-right is wired in KivaAd.tsx — appears at
// absolute F306 (= local F78 of Scene 2) and remains the rest of the ad.
// =====================================================================

const SWIPE_START = 12;
const SWIPE_END = 24;
const SILENCE_END = 30;
const LOCKUP_LOGO_IN = 30;
const LOCKUP_WORD_IN = 36;
const LOCKUP_TAG_IN = 42;
const LOCKUP_HOLD_END = 60;
const GLIDE_START = 60;
const GLIDE_END = 78;
const SPARKLE_IN = 78;
const FEATURE1 = 84;
const FEATURE2 = 92;
const FEATURE3 = 100;
const FEATURE4 = 108;
const FEATURES_END = 116;
const VORTEX_START = 116;
const VORTEX_END = 122;
const PHONE_MATERIALIZE = 122;
const DASHBOARD_IN = 134;
const SCENE_END = 144;

// Quadrant landing positions (1920×1080 frame)
const QUADRANTS = [
  { x: 480, y: 380 },
  { x: 1440, y: 380 },
  { x: 480, y: 700 },
  { x: 1440, y: 700 },
];

const FEATURES = [
  { verb: "Speak", outcome: "quotes" },
  { verb: "Save", outcome: "customers" },
  { verb: "Drive", outcome: "less" },
  { verb: "Win more", outcome: "jobs" },
];

const SPARKLE_CENTER = { x: 960, y: 540 };

export const Scene2VoiceCustomer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${COLOR.navy} 0%, #050810 100%)`,
        overflow: "hidden",
      }}
    >
      {/* Swipe-up wipe veil — F12-F24, dark band sweeps upward */}
      {frame >= SWIPE_START - 2 && frame < SWIPE_END + 4 && (
        <SwipeUpVeil frame={frame} />
      )}

      {/* Brand lockup (centered) — visible F18 → F66 (fades during glide) */}
      {frame >= LOCKUP_LOGO_IN - 2 && frame < SPARKLE_IN && (
        <BrandLockupCentered frame={frame} fps={fps} />
      )}

      {/* AI Sparkle Director — F66 → F110 */}
      {frame >= SPARKLE_IN - 2 && frame < VORTEX_END + 2 && (
        <SparkleDirector frame={frame} />
      )}

      {/* 4 feature texts */}
      {frame >= FEATURE1 - 2 && frame < FEATURES_END + 2 && (
        <FeatureTexts frame={frame} />
      )}

      {/* Vortex particles */}
      {frame >= VORTEX_START - 2 && frame < PHONE_MATERIALIZE + 4 && (
        <VortexParticles frame={frame} />
      )}

      {/* iPhone materializes from vortex flare */}
      {frame >= PHONE_MATERIALIZE - 2 && (
        <PhoneMaterialize frame={frame} fps={fps} />
      )}

      {/* === AUDIO === user-stripped: only the cursor-click on the Kiva icon.
          v1.24 sound timeline notes per ad_plan §6 retained in comment for the
          eventual audio pass; right now only the 4 sparkle-feature chimes are
          wired (using notification1 pitched up — sparkle_match SFX wasn't
          generated). */}
      {[FEATURE1, FEATURE2, FEATURE3, FEATURE4].map((f, i) => (
        <SfxAt
          key={`feat-${i}`}
          src={SFX.notification1}
          from={f + 2}
          volume={0.32}
          playbackRate={Math.pow(2, (5 + i) / 12)} // +5, +6, +7, +8 semitones
        />
      ))}
    </AbsoluteFill>
  );
};

// =====================================================================
// SWIPE-UP VEIL — full-frame dark band sweeps upward, drags content off
// =====================================================================
const SwipeUpVeil: React.FC<{ frame: number }> = ({ frame }) => {
  const p = interpolate(frame, [SWIPE_START, SWIPE_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOutQuad,
  });
  // Veil rises from below the frame, sweeps up past the top
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
        background:
          `linear-gradient(180deg, ${COLOR.navy} 0%, #050810 60%, rgba(0,0,0,0.0) 100%)`,
        boxShadow: "0 -40px 120px rgba(0,0,0,0.85)",
        pointerEvents: "none",
      }}
    />
  );
};

// =====================================================================
// BRAND LOCKUP CENTERED — chevron + "Kiva." + tagline
// =====================================================================
const BrandLockupCentered: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  // Logo enter (F18-F26 spring) + persistent until glide starts
  const logoSp = spring({
    frame: frame - LOCKUP_LOGO_IN,
    fps,
    config: SPRING.soft,
  });
  const logoEnter = interpolate(logoSp, [0, 1], [0, 1]);

  // Wordmark (F24-F32)
  const wordP = interpolate(frame, [LOCKUP_WORD_IN, LOCKUP_WORD_IN + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  const wordY = interpolate(wordP, [0, 1], [4, 0]);

  // Tagline (F30-F36)
  const tagP = interpolate(frame, [LOCKUP_TAG_IN, LOCKUP_TAG_IN + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  const tagY = interpolate(tagP, [0, 1], [4, 0]);

  // During HOLD (F48-F60), gentle glow pulse 0.8→1.0→0.8 over 12f
  const pulseT = Math.max(0, frame - 48);
  const glowPulse = 0.8 + 0.2 * Math.sin((pulseT / 12) * Math.PI * 2);

  // Glide F48-F66: logo translates center → top-right (1700, 100), scale 1→0.5
  const glideP = interpolate(frame, [GLIDE_START, GLIDE_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOutQuad,
  });
  // Center of frame is (960, 540); target top-right (1700, 100).
  const logoTargetX = 1700;
  const logoTargetY = 100;
  const logoX = interpolate(glideP, [0, 1], [960, logoTargetX]);
  const logoY = interpolate(glideP, [0, 1], [540, logoTargetY]);
  const logoScale = interpolate(glideP, [0, 1], [1, 0.5]);

  // Wordmark + tagline fade out F48-F60
  const fadeOut = interpolate(frame, [GLIDE_START, GLIDE_START + 12], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // While not gliding, lockup uses the centered flex layout.
  // While gliding, the chevron is positioned absolutely.
  const isGliding = frame >= GLIDE_START;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* Soft radial glow behind the lockup — fades as glide ends */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(59,130,246,0.30) 0%, rgba(59,130,246,0) 45%)",
          filter: "blur(40px)",
          opacity: (logoEnter * (isGliding ? Math.max(0, 1 - glideP * 1.2) : 1)) * glowPulse,
        }}
      />

      {/* Chevron — center then glides */}
      <div
        style={{
          position: "absolute",
          left: logoX,
          top: logoY,
          transform: `translate(-50%, -50%) scale(${logoScale * interpolate(logoEnter, [0, 1], [0.9, 1])})`,
          opacity: logoEnter,
        }}
      >
        <KivaLogo size={160} glow={isGliding ? 0.3 : 0.6 * glowPulse} />
      </div>

      {/* Wordmark — stays centered, fades out during glide */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 80, // sit just below logo
        }}
      >
        <div
          style={{
            opacity: wordP * fadeOut,
            transform: `translateY(${wordY}px)`,
            fontFamily: "Inter, system-ui",
            fontSize: 64,
            fontWeight: 600,
            color: "#fff",
            letterSpacing: -1.6,
            marginTop: 200,
          }}
        >
          Kiva
          <span style={{ color: COLOR.blue }}>.</span>
        </div>

        <div
          style={{
            opacity: tagP * fadeOut,
            transform: `translateY(${tagY}px)`,
            fontFamily: "Inter, system-ui",
            fontSize: 28,
            fontWeight: 400,
            color: "rgba(255,255,255,0.80)",
            letterSpacing: -0.3,
            marginTop: 24,
          }}
        >
          Blue collar solutions for blue collar problems
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// =====================================================================
// SPARKLE DIRECTOR — purple 8-petal sparkle that darts between quadrants
// =====================================================================
const SparkleDirector: React.FC<{ frame: number }> = ({ frame }) => {
  // Entry fade F66-F72
  const enter = interpolate(frame, [SPARKLE_IN, SPARKLE_IN + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });

  // Determine sparkle position based on phase
  let cx = SPARKLE_CENTER.x;
  let cy = SPARKLE_CENTER.y;
  let pulseScale = 1;

  if (frame < FEATURE1) {
    // Center hold
    cx = SPARKLE_CENTER.x;
    cy = SPARKLE_CENTER.y;
  } else if (frame < FEATURES_END) {
    // Determine which feature segment
    const segs = [FEATURE1, FEATURE2, FEATURE3, FEATURE4];
    let i = 0;
    for (let k = 0; k < 4; k++) if (frame >= segs[k]) i = k;
    const segStart = segs[i];
    const t = frame - segStart; // 0..8
    const prev =
      i === 0 ? SPARKLE_CENTER : QUADRANTS[i - 1];
    const target = QUADRANTS[i];
    // F0-F2: dart from prev → target (motion blur in render-side via shadow)
    const dartP = interpolate(t, [0, 2], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE.inOutQuad,
    });
    cx = interpolate(dartP, [0, 1], [prev.x, target.x]);
    cy = interpolate(dartP, [0, 1], [prev.y, target.y]);
    // F2: pulse bright (scale 1→1.4→1 over t=2..5)
    pulseScale = interpolate(t, [2, 3.5, 5], [1, 1.4, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else {
    // After features, retreat to center for vortex
    const retreatT = frame - FEATURES_END;
    const last = QUADRANTS[3];
    const p = interpolate(retreatT, [0, 4], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE.inOutQuad,
    });
    cx = interpolate(p, [0, 1], [last.x, SPARKLE_CENTER.x]);
    cy = interpolate(p, [0, 1], [last.y, SPARKLE_CENTER.y]);
  }

  // Vortex shrink F104-F110
  const vortexP = interpolate(frame, [VORTEX_START, VORTEX_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  const vortexScale = interpolate(vortexP, [0, 1], [1, 0]);
  const vortexOpacity = interpolate(vortexP, [0, 1], [1, 0]);

  // Continuous rotation
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
      }}
    >
      {/* Purple glow halo */}
      <div
        style={{
          position: "absolute",
          inset: -40,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(109,40,217,0.55) 0%, rgba(109,40,217,0) 70%)",
          filter: "blur(20px)",
          width: 160,
          height: 160,
          left: -40,
          top: -40,
        }}
      />
      <Sparkle size={90} color={COLOR.aiPurple} />
      {/* Burst particles when pulsing (pulseScale > 1.1) */}
      {pulseScale > 1.05 && <BurstParticles count={12} />}
    </div>
  );
};

const Sparkle: React.FC<{ size: number; color: string }> = ({ size, color }) => {
  // 8-petal sparkle: 4-pointed star + smaller diagonal
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
// FEATURE TEXTS — 4 kinetic-typography cards, one per feature
// =====================================================================
const FeatureTexts: React.FC<{ frame: number }> = ({ frame }) => {
  const segs = [FEATURE1, FEATURE2, FEATURE3, FEATURE4];
  return (
    <>
      {FEATURES.map((feat, i) => {
        const start = segs[i];
        // Visible window: F(start+2) to F(start+8); particles dissolve F7-F8
        const t = frame - start;
        if (t < 2 || t > 9) return null;

        // Text appears F2-F5 (kinetic punch)
        const textP = interpolate(t, [2, 5], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE.outCubic,
        });
        // Hold F5-F7
        // Dissolve F7-F8
        const dissolve = interpolate(t, [7, 8.5], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const opacity = textP * dissolve;
        // Scale punch on the OUTCOME word: 1.0 → 1.08 → 1.0 over t=2..5
        const punch = interpolate(t, [2, 3.5, 5], [1, 1.08, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        // Underline width grows 0 → 100% during text-in, fades on dissolve
        const underlineW = interpolate(t, [2.5, 5], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE.outCubic,
        });

        const pos = QUADRANTS[i];
        // Anchor: align verb-then-outcome on a single baseline; center at pos.
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: pos.x,
              top: pos.y,
              transform: "translate(-50%, -50%)",
              opacity,
              fontFamily: "Inter, system-ui",
              color: "#fff",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 16,
                whiteSpace: "nowrap",
              }}
            >
              <span
                style={{
                  fontSize: 32,
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.80)",
                  letterSpacing: -0.5,
                }}
              >
                {feat.verb}
              </span>
              <span
                style={{
                  fontSize: 84,
                  fontWeight: 700,
                  color: "#fff",
                  letterSpacing: -2,
                  transform: `scale(${punch})`,
                  display: "inline-block",
                  textShadow:
                    "0 4px 24px rgba(15,23,42,0.6), 0 0 32px rgba(109,40,217,0.4)",
                }}
              >
                {feat.outcome}
                <span style={{ color: COLOR.aiPurple }}>.</span>
              </span>
            </div>
            {/* Soft purple underline beneath the bold word */}
            <div
              style={{
                width: 240 * underlineW,
                height: 3,
                marginTop: 4,
                marginLeft: 80, // shift right to underline outcome word, not verb
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
// VORTEX PARTICLES — ~30 particles spiraling toward center F104-F110
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
      {Array.from({ length: 30 }).map((_, i) => {
        const seed = i / 30;
        const startAng = seed * Math.PI * 2 + (i % 2 ? 0.3 : -0.3);
        const startR = 320 + (i % 5) * 30;
        // Particles spiral inward — radius shrinks, angle increases
        const r = interpolate(p, [0, 1], [startR, 0]);
        const ang = startAng + p * Math.PI * 1.6;
        const x = SPARKLE_CENTER.x + Math.cos(ang) * r;
        const y = SPARKLE_CENTER.y + Math.sin(ang) * r;
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
          left: SPARKLE_CENTER.x,
          top: SPARKLE_CENTER.y,
          width: 200,
          height: 200,
          marginLeft: -100,
          marginTop: -100,
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
// PHONE MATERIALIZE — iPhone fades up from vortex flare, dashboard inside
// =====================================================================
const PhoneMaterialize: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  // Phone fade-in F110-F122
  const phoneP = interpolate(
    frame,
    [PHONE_MATERIALIZE, DASHBOARD_IN],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE.outCubic,
    }
  );
  // Phone scale 0.9 → 1.0 over the materialize
  const phoneScale = interpolate(phoneP, [0, 1], [0.9, 1]);
  // Phone resting tilt rotateY -6, rotateX +3 (per §3.7.2 — handled by PhoneFrame defaults)

  // Dashboard caption fades in F126-F132
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
        <DashboardEntry frame={frame} captionOpacity={captionP} />
      </PhoneFrame>
    </AbsoluteFill>
  );
};

// =====================================================================
// DASHBOARD ENTRY — minimal Kiva dashboard preview + caption
// =====================================================================
const DashboardEntry: React.FC<{ frame: number; captionOpacity: number }> = ({
  frame,
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
      {/* Kiva. wordmark top-left */}
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
      {/* Navy header card */}
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
      {/* Recent activity rows */}
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
      {/* Mic FAB */}
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
      {/* Caption */}
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
