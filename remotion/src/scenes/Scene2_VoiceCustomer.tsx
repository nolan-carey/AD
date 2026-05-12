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
import { useTweaks } from "../tweaks";

// =====================================================================
// SCENE 2 — v1.41 (Sequence from absolute F228, local F0–F375, 12.5s)
// Nominal scene window F240–F618 absolute (+27f for v1.43 sequential reveals).
//
// v1.41 (2026-05-07): per user addendum, typing slowed further +
// Scene 2 extended +2s. Per-feature window 43→60f. Verb 10→16f, breath
// 2→3f, outcome 13→19f. Stagger 28→35f. Pill hold 24→36f. Dashboard
// 24→34f. Scene 2: 291f → 351f. Plus v1.41 spec: F2 position
// (1175,525)→(1255,510) for symmetric breathing; new kinetic text float
// from each feature's poof until vortex.
//
// Local-frame map (Sequence starts at abs F228):
//   F0–F12     crossfade-IN from Scene 1
//   F12–F20    SWIPE-UP WIPE
//   F24–F30    HARD SILENCE
//   F30–F48    CENTERED BRAND LOCKUP fades up
//   F48–F60    🫧 PILL inflates
//   F60–F96    PILL holds (36f, was 24f — more reading time)
//   F96–F102   PILL pops out + WORDMARK collapses
//   F102–F114  LOGO ENLARGES alone center-stage
//   F114–F126  AI SPARKLE emerges from enlarged logo
//   F126–F291  🌀 4-FEATURE FLASH (each 60f, 35f stagger):
//                F126  F1 starts → poof at outcome final (F169)
//                F161  F2 starts → poof (F204)
//                F196  F3 starts → poof (F239)
//                F231  F4 starts → poof (F274)
//                F291  F4 ends; constellation collapse begins
//   F291–F307  VORTEX (16f)
//   F307–F329  LOGO fades + iPhone materializes (22f cross-fade)
//   F329–F363  Dashboard + caption (34f, was 24f)
//   F363–F375  crossfade-OUT into Scene 3
//
// Per-feature 60-frame window timing (v1.41):
//   t 0–2   sparkle dart
//   t 2–6   icon line-draws (4f)
//   t 6–22  verb types (16f, was 10f — slowed)
//   t 22–25 3f breath (was 2f)
//   t 25–44 outcome types (19f, was 13f — slowed); poof at final char
//   t 43    period appears (1f before outcome end)
//   t 44–47 underline draws (3f)
//   t 44–50 icon transforms to ACTIVE state (6f)
//   t 50–60 drift content cycle (10f onset, then continuous loop)
//
// Kinetic text float (v1.41): from poof frame until VORTEX_START, the
// text-block (verb+outcome+underline only, NOT the icon) drifts in a
// subtle xy sine — translateX ±2 px over 90f, translateY ±1.5 px over
// 75f, per-feature phase offsets 0°/90°/180°/270°.
// =====================================================================

const SWIPE_START = 12;
const SWIPE_END = 16; // v1.6 polish: 8f → 4f, snappier wipe per user direction
const SILENCE_END = 30;
const LOCKUP_LOGO_IN = 23; // v1.42 -7f: visible logo expansion now starts ~abs F243 (was F250)
const LOCKUP_WORD_IN = 38;
const LOCKUP_END = 48;
const PILL_IN = 48;
const PILL_HOLD_START = 60;
const PILL_OUT_START = 92; // 4f earlier — fade begins ~abs F312 (a couple before 315)
const PILL_OUT_END = 98; // 6f popout window preserved
const SPARKLE_IN = 114; // was 102; logo enlarge 12f preserved
// v1.45: feature window 75f→95f, stagger 58f→77f. Scene 2 grows by another +77f.
const FEATURE1 = 126; // sparkle entrance 12f preserved
const FEATURE2 = 203; // +77 stagger
const FEATURE3 = 280;
const FEATURE4 = 357;
const FEATURES_END = 452; // F4 + 95
const VORTEX_START = 452;
const VORTEX_END = 468; // 16f vortex
const PHONE_MATERIALIZE = 468;
const LOGO_FADE_END = 484; // 16f logo fade
const DASHBOARD_IN = 490; // 22f phone fade-in
const SCENE_END = 524; // 34f dashboard
const FEATURE_DURATION = 95;

// Centered logo focal point (1920×1080 frame)
const CENTER = { x: 960, y: 540 };

// v1.34/v1.41 organic positions — v1.41 pushes F2 outward to match F4
// distance for symmetric constellation breathing.
//   F1 (975, 290) distance ~252 px
//   F2 (1255, 510) distance ~296 px (was 1175,525 in v1.37; v1.41 pushed right)
//   F3 (945, 805) distance ~265 px
//   F4 (665, 570) distance ~296 px
const ORBIT_BASE_RADIUS = 280;
const ORGANIC_POSITIONS = [
  { x: 975, y: 290 }, // 🎙 F1
  { x: 1255, y: 510 }, // 👤 F2 — v1.41: matches F4 distance for symmetry
  { x: 945, y: 805 }, // 🗺 F3
  { x: 665, y: 570 }, // 🤝 F4
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
  const tweaks = useTweaks();
  // Studio knob: swipe duration overrides the SWIPE_END constant
  const swipeEnd = SWIPE_START + tweaks.scene2SwipeDurationFrames;

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
      {/* Swipe-up wipe veil — duration is now adjustable via tweaks */}
      {frame >= SWIPE_START - 2 && frame < swipeEnd + 4 && (
        <SwipeUpVeil frame={frame} swipeEnd={swipeEnd} />
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
          v1.32: 4 sparkle chimes at burst frames (ascending +1 semitone).
          v1.40: per-char typing clicks REMOVED — replaced with one
          "poof" SFX per outcome word landing (4 poofs total). Phase 3
          will source bespoke `kinetic_text_poof` ElevenLabs SFX; for now
          using `swoosh.mp3` low-pitched + low-volume as placeholder. */}
      {/* v1.45: chime fires at sweep start (t=10), as the sparkle reaches the
          left edge and the L→R reveal sweep begins. */}
      {[FEATURE1 + 10, FEATURE2 + 10, FEATURE3 + 10, FEATURE4 + 10].map((f, i) => (
        <SfxAt
          key={`feat-${i}`}
          src={SFX.notification1}
          from={f}
          volume={0.32}
          playbackRate={Math.pow(2, (5 + i) / 12)}
        />
      ))}
      {/* 4 outcome-word poof SFX — gated by tweaks.enablePoofSfx */}
      {tweaks.enablePoofSfx &&
        [FEATURE1, FEATURE2, FEATURE3, FEATURE4].map((segStart, i) => (
          <SfxAt
            key={`poof-${i}`}
            src={SFX.swoosh}
            from={segStart + OUTCOME_TYPE_END - 1}
            volume={0.35}
            playbackRate={0.7}
          />
        ))}
    </AbsoluteFill>
  );
};

// =====================================================================
// SWIPE-UP VEIL — dark band sweeps up past the top of the frame
// =====================================================================
const SwipeUpVeil: React.FC<{ frame: number; swipeEnd: number }> = ({
  frame,
  swipeEnd,
}) => {
  const p = interpolate(frame, [SWIPE_START, swipeEnd], [0, 1], {
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
// CENTERED LOCKUP (v1.34) — chevron + "Kiva." wordmark, with wordmark
// collapse + logo enlarge transition at the pill pop-out beat:
//   F72–F75 (3f): wordmark collapses INTO ITSELF (scaleX 1→0.6,
//                  scaleY 1→0.4, opacity 1→0). Pill pops out in parallel.
//   F75–F78 (3f): chevron LOGO ENLARGES to take freed space (scale
//                  1.0→1.4 easeOutCubic) + blue glow halo intensifies.
//   F78+:        sparkle emerges from the now-enlarged logo.
//   F122–F130:   logo fades as iPhone materializes (cross-fade).
// =====================================================================
// v1.36 timing: wordmark collapses over 6f synced with pill pop-out.
// v1.42 update: logo now expands CONTINUOUSLY from when it first lands
// (local F40, right after entry-spring settles) all the way through to
// SPARKLE_IN, with a peak overshoot + spring-back near the end. This
// gives the brand a building "swell" through the whole brand phase
// rather than a single hard pop at the wordmark-collapse moment.
const WORDMARK_COLLAPSE_START = PILL_OUT_START;
const WORDMARK_COLLAPSE_END = PILL_OUT_END;
// v1.6c logo curve — PUNCH and RECOIL (per user direction: "logo needs
// to shrink down again"). Replaces the punch-and-hold-at-1.5 curve with
// a single decisive pulse: punch up to 1.5× then shrink back to rest
// scale over ~20 f. Reads as "ta-da!" then the logo sits quietly at
// rest for the brand phase. No more breath-dip — redundant with recoil.
const LOGO_ENLARGE_START = LOCKUP_LOGO_IN + 12; // F35 — right after entry spring settles
const LOGO_ENLARGE_PEAK = 50; // F50 — punch peak (tweaks.scene2LogoPunchPeakScale)
const LOGO_ENLARGE_SETTLE = 70; // F70 — fully recoiled to rest scale
const LOGO_ENLARGED_PEAK_SCALE = 1.5;

const CenteredLockup: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const tweaks = useTweaks();
  // Studio knobs override the module-level scale constants
  const punchPeakScale = tweaks.scene2LogoPunchPeakScale;
  const finalScale = tweaks.scene2LogoFinalScale;
  const flickerAmp = tweaks.scene2BgFlickerAmplitude;
  const glowColor = tweaks.bgGlowColor;

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

  // v1.34: wordmark collapses into itself at PILL_OUT_START (F72-F75)
  const collapseP = interpolate(
    frame,
    [WORDMARK_COLLAPSE_START, WORDMARK_COLLAPSE_END],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE.inCubic,
    }
  );
  const wordScaleX = interpolate(collapseP, [0, 1], [1, 0.6]);
  const wordScaleY = interpolate(collapseP, [0, 1], [1, 0.4]);
  const wordOpacity = (1 - collapseP) * wordP;

  // v1.6 logo curve — PUNCH expansion right after entry (user direction:
  // v1.6c — PUNCH then RECOIL (3 phases):
  //   • Punch F35 → F50 (15f): 1.0 → peak (1.5×) with outExpo (crisp)
  //   • Recoil F50 → F70 (20f): peak → finalScale with outCubic (soft landing)
  //   • Locked at finalScale (rest) from F70 onwards
  let liveLogoScale: number;
  if (frame < LOGO_ENLARGE_START) {
    liveLogoScale = 1;
  } else if (frame < LOGO_ENLARGE_PEAK) {
    // Punch up
    liveLogoScale = interpolate(
      frame,
      [LOGO_ENLARGE_START, LOGO_ENLARGE_PEAK],
      [1, punchPeakScale],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: EASE.outExpo,
      }
    );
  } else if (frame < LOGO_ENLARGE_SETTLE) {
    // Recoil down to rest
    liveLogoScale = interpolate(
      frame,
      [LOGO_ENLARGE_PEAK, LOGO_ENLARGE_SETTLE],
      [punchPeakScale, finalScale],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: EASE.outCubic,
      }
    );
  } else {
    // Locked at final scale (tweak) for sparkle + features
    liveLogoScale = finalScale;
  }
  // 0→1 progress for downstream glow brightness — peaks at LOGO_ENLARGE_PEAK
  const enlargeP = interpolate(
    frame,
    [LOGO_ENLARGE_START, LOGO_ENLARGE_PEAK],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const finalLogoScale = logoEnterScale * liveLogoScale;

  // Logo fades F122-F130 as iPhone materializes
  const fadeOut = interpolate(frame, [PHONE_MATERIALIZE, LOGO_FADE_END], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Pulse glow during pill hold (F57-F72) — gentle breathing
  const holdGlow =
    frame >= PILL_HOLD_START && frame < PILL_OUT_START
      ? 0.5 + 0.15 * Math.sin(((frame - PILL_HOLD_START) / 12) * Math.PI * 2)
      : 0.55;
  // Logo glow intensifies during enlarge (v1.34)
  const enlargedGlow = 0.55 + enlargeP * 0.4;
  const finalGlow = frame >= LOGO_ENLARGE_START ? enlargedGlow : holdGlow;
  // v1.6 polish: subtle multi-sin flicker on the background blue glow —
  // amplitude controlled by tweaks.scene2BgFlickerAmplitude (0 = static).
  const bgFlicker =
    1 -
    flickerAmp +
    flickerAmp *
      (Math.sin(frame * 0.17) * 0.55 +
        Math.sin(frame * 0.31 + 1.3) * 0.3 +
        Math.sin(frame * 0.073 + 2.7) * 0.45);
  // Background radial glow brightens with enlarge + flickers continuously
  const bgGlowOpacity =
    logoEnter *
    (frame >= LOGO_ENLARGE_START ? Math.min(1, 1 + enlargeP * 0.6) : holdGlow) *
    bgFlicker;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: fadeOut }}>
      {/* Soft radial glow behind lockup — color from tweaks.bgGlowColor */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, ${glowColor}57 0%, ${glowColor}00 45%)`,
          filter: "blur(40px)",
          opacity: bgGlowOpacity,
        }}
      />

      {/* Sparkle accent — sibling rendered BEFORE the chevron in DOM order,
          so it naturally sits behind without needing a z-index battle with
          KivaLogo's internal layers. Shares the same transform so it scales
          with the punch. Only renders during F23-F50 on logo arrival. */}
      {tweaks.scene2SparkleEnabled && (
        <div
          style={{
            position: "absolute",
            left: CENTER.x,
            top: CENTER.y - 40,
            transform: `translate(-50%, -50%) scale(${finalLogoScale})`,
            opacity: logoEnter,
            pointerEvents: "none",
          }}
        >
          <LogoSparkle frame={frame} logoEnter={logoEnter} />
        </div>
      )}

      {/* Centered chevron — punch expansion then recoil back to rest */}
      <div
        style={{
          position: "absolute",
          left: CENTER.x,
          top: CENTER.y - 40,
          transform: `translate(-50%, -50%) scale(${finalLogoScale})`,
          opacity: logoEnter,
        }}
      >
        <KivaLogo size={170} glow={finalGlow} />
      </div>

      {/* "Kiva." wordmark — collapses into its period at PILL_OUT_START */}
      <div
        style={{
          position: "absolute",
          left: CENTER.x,
          top: CENTER.y + 100,
          transform: `translate(-50%, -50%) translateY(${wordY}px) scaleX(${wordScaleX}) scaleY(${wordScaleY})`,
          transformOrigin: "right center",
          opacity: wordOpacity,
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
// LOGO SPARKLE (v1.6) — subtle twinkle in the top-right corner of the
// chevron. White 4-point star, continuous scale-pulse, gentle drift
// rotation. Fades up with the logo entry so it doesn't pop in suddenly.
// =====================================================================
const LogoSparkle: React.FC<{ frame: number; logoEnter: number }> = ({
  frame,
  logoEnter,
}) => {
  // v1.6c lifecycle — sparkle is BEHIND the chevron and only plays on
  // logo arrival. Fade in F23 → F28, twinkle F28 → F40, fade out F40 → F50,
  // gone after F50. Centered + oversized so the 4 star points poke out from
  // behind the chevron's rounded-rect edges.
  const SPARKLE_START = 23;
  const SPARKLE_FADE_IN_END = 28;
  const SPARKLE_FADE_OUT_START = 40;
  const SPARKLE_END = 50;
  if (frame < SPARKLE_START || frame >= SPARKLE_END) return null;

  let lifeAlpha: number;
  if (frame < SPARKLE_FADE_IN_END) {
    lifeAlpha = (frame - SPARKLE_START) / (SPARKLE_FADE_IN_END - SPARKLE_START);
  } else if (frame < SPARKLE_FADE_OUT_START) {
    lifeAlpha = 1;
  } else {
    lifeAlpha = 1 - (frame - SPARKLE_FADE_OUT_START) / (SPARKLE_END - SPARKLE_FADE_OUT_START);
  }

  // Continuous twinkle pulse + rotation while alive
  const tw = (frame * 0.18) % (Math.PI * 2);
  const pulse = 0.7 + 0.3 * Math.abs(Math.sin(tw) * 0.7 + Math.sin(tw * 2.3 + 0.7) * 0.3);
  const rot = (frame * 4) % 360;

  return (
    <div
      style={{
        // Centered at parent's origin (which is the chevron's center via
        // translate(-50%, -50%) on the outer wrapper). Star points extend
        // 110 px from center — past the chevron's ~75 px half-width so the
        // tips visibly poke out from behind the rounded app-rect.
        width: 220,
        height: 220,
        marginLeft: -110,
        marginTop: -110,
        position: "relative",
        opacity: lifeAlpha,
        transform: `rotate(${rot}deg) scale(${pulse})`,
        pointerEvents: "none",
        filter:
          "drop-shadow(0 0 16px rgba(220,235,255,0.95)) drop-shadow(0 0 28px rgba(120,180,255,0.7))",
      }}
    >
      <svg width={220} height={220} viewBox="0 0 100 100">
        <path
          d="M 50 0 L 53 47 L 100 50 L 53 53 L 50 100 L 47 53 L 0 50 L 47 47 Z"
          fill="#FFFFFF"
        />
        <path
          d="M 50 18 L 51 49 L 82 50 L 51 51 L 50 82 L 49 51 L 18 50 L 49 49 Z"
          fill="rgba(190,220,255,0.85)"
        />
      </svg>
    </div>
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
              background: `conic-gradient(from ${irisRot}deg, rgba(59,130,246,0.05), rgba(180,210,255,0.06), rgba(255,150,200,0.05), rgba(59,130,246,0.05))`,
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

  // v1.45: per-feature LEFT→RIGHT SWEEP REVEAL (replaces dart-to-point).
  //   t 0–10  : approach phase — curve in from previous feature's right edge
  //             to the LEFT edge of current feature's text region
  //   t 10–77 : horizontal sweep — sparkle glides L→R across the text width
  //             at the same pace as the typing reveal (verb + breath + outcome)
  //   t 77+   : sparkle holds at the right edge while underline + icon resolve;
  //             pulse-bright moment fires on landing
  const SWEEP_HALF_WIDTH = 240;
  const APPROACH_END = 10;
  const SWEEP_END = OUTCOME_TYPE_END; // 77

  if (frame < FEATURE1) {
    // Pre-orbit — at center of logo
    cx = CENTER.x;
    cy = CENTER.y;
  } else if (frame < FEATURES_END) {
    const segs = [FEATURE1, FEATURE2, FEATURE3, FEATURE4];
    let i = 0;
    for (let k = 0; k < 4; k++) if (frame >= segs[k]) i = k;
    const segStart = segs[i];
    const t = frame - segStart;
    const target = ORGANIC_POSITIONS[i];
    const leftEdgeX = target.x - SWEEP_HALF_WIDTH;
    const rightEdgeX = target.x + SWEEP_HALF_WIDTH;
    // "prev" position = logo center (i=0) or previous feature's right-edge
    // landing (i>0), so the approach starts where the last sweep ended.
    const prev =
      i === 0
        ? CENTER
        : { x: ORGANIC_POSITIONS[i - 1].x + SWEEP_HALF_WIDTH, y: ORGANIC_POSITIONS[i - 1].y };

    if (t < APPROACH_END) {
      // Approach: prev → left edge of target via gentle bezier curve
      const approachP = interpolate(t, [0, APPROACH_END], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: EASE.inOutQuad,
      });
      const mx = (prev.x + leftEdgeX) / 2;
      const my = (prev.y + target.y) / 2;
      const dx = mx - CENTER.x;
      const dy = my - CENTER.y;
      const d = Math.hypot(dx, dy) || 1;
      const bulge = 30;
      const ctrlX = mx + (dx / d) * bulge;
      const ctrlY = my + (dy / d) * bulge;
      const u = 1 - approachP;
      cx = u * u * prev.x + 2 * u * approachP * ctrlX + approachP * approachP * leftEdgeX;
      cy = u * u * prev.y + 2 * u * approachP * ctrlY + approachP * approachP * target.y;
    } else if (t < SWEEP_END) {
      // L→R sweep across text width, paced to match typing reveal
      const sweepP = interpolate(t, [APPROACH_END, SWEEP_END], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: EASE.inOutQuad,
      });
      cx = interpolate(sweepP, [0, 1], [leftEdgeX, rightEdgeX]);
      cy = target.y;
    } else {
      // Hold at right edge while underline + icon resolve
      cx = rightEdgeX;
      cy = target.y;
    }

    // Bright pulse the moment the sweep lands at the right edge
    pulseScale = interpolate(t, [SWEEP_END, SWEEP_END + 2, SWEEP_END + 5], [1, 1.4, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else if (frame < VORTEX_START) {
    // Constellation hold — sparkle parked at F4's right-edge landing
    cx = ORGANIC_POSITIONS[3].x + SWEEP_HALF_WIDTH;
    cy = ORGANIC_POSITIONS[3].y;
  } else {
    // Vortex — spiral inward to center from F4's right-edge landing
    const vp = interpolate(frame, [VORTEX_START, VORTEX_END], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE.inCubic,
    });
    cx = interpolate(vp, [0, 1], [ORGANIC_POSITIONS[3].x + SWEEP_HALF_WIDTH, CENTER.x]);
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
      {pulseScale > 1.05 && <BurstParticles count={6} />}
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

// v1.39: sparkle particle bursts — mix of white + purple (was all-purple)
const BurstParticles: React.FC<{ count: number }> = ({ count }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const ang = (i / count) * Math.PI * 2;
        const r = 60;
        const isWhite = i % 2 === 0;
        const color = isWhite ? "#FFFFFF" : COLOR.aiPurple;
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
              background: color,
              boxShadow: `0 0 6px ${color}`,
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

// v1.41 per-feature pacing (within the 60-frame window) — slowed typing:
//   t 0–2   sparkle dart (2f)
//   t 2–6   icon line-draws (4f)
//   t 6–22  VERB types (16f, was 10f — slowed further per user direction)
//   t 22–25 3f breath (was 2f)
//   t 25–44 OUTCOME types (19f, was 13f — slowed); poof SFX at final char
//   t 43    period appears (1f before outcome end)
//   t 44–47 underline draws (3f, overlaps morph)
//   t 44–50 icon transforms to ACTIVE state (6f)
//   t 50–60 drift onset (10f) + continuous loop while feature persists
// v1.45: further slowdown + sparkle becomes a left→right horizontal sweep
// that reveals text as it passes. Verb 22→30f, breath 4→5f, outcome 26→36f.
// Per-feature window 75f→95f; stagger 58f→77f; sparkle approach 10f, sweep 67f.
const VERB_TYPE_START = 6;
const VERB_TYPE_END = 36; // verb 30f
const OUTCOME_TYPE_START = 41; // 5f breath
const OUTCOME_TYPE_END = 77; // outcome 36f
const PERIOD_FRAME = 76;
const UNDERLINE_DRAW_START = 77;
const UNDERLINE_DRAW_END = 80;

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

        // Block-level opacity — block is present from t≥2 so text can type;
        // icon stays invisible inside (drawP=0) until ICON_DRAW_START at t=44.
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
              gap: 28,
              padding: 12,
              pointerEvents: "none",
              zIndex: 40,
            }}
          >
            {/* v1.33 layout: ICON on LEFT, text on RIGHT */}
            <FeatureIcon index={i} localTime={t} />
            {/* TEXT BLOCK (right) — verb stacked above outcome, underline below
                v1.41: kinetic xy-sine float once typing completes (poof) */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 0,
                transform: (() => {
                  // Float runs from poof frame until VORTEX_START
                  const floatStartT = OUTCOME_TYPE_END - 1;
                  if (t < floatStartT || frame >= VORTEX_START) {
                    return undefined;
                  }
                  const phaseDeg = i * 90; // 0/90/180/270 per feature
                  const phaseRad = (phaseDeg * Math.PI) / 180;
                  const ft = t - floatStartT;
                  const fx = 2 * Math.sin((ft / 90) * 2 * Math.PI + phaseRad);
                  const fy = 1.5 * Math.sin((ft / 75) * 2 * Math.PI + phaseRad);
                  return `translate(${fx}px, ${fy}px)`;
                })(),
              }}
            >
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.80)",
                  letterSpacing: -0.4,
                  whiteSpace: "nowrap",
                  lineHeight: 1.0,
                  marginBottom: 4,
                  minHeight: 32,
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
                        height: 26,
                        background: "rgba(255,255,255,0.7)",
                        marginLeft: 2,
                        verticalAlign: "middle",
                      }}
                    />
                  )}
              </div>
              <div
                style={{
                  fontSize: 72,
                  fontWeight: 700,
                  color: "#fff",
                  letterSpacing: -1.8,
                  transform: `scale(${punch})`,
                  transformOrigin: "left center",
                  whiteSpace: "nowrap",
                  lineHeight: 1.0,
                  textShadow:
                    "0 4px 24px rgba(15,23,42,0.6), 0 0 32px rgba(59,130,246,0.45)",
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
                        height: 58,
                        background: "rgba(255,255,255,0.85)",
                        marginLeft: 4,
                        verticalAlign: "middle",
                      }}
                    />
                  )}
              </div>
              {/* Underline beneath outcome word — v1.39: purple → blue */}
              <div
                style={{
                  width: 180 * underlineW,
                  height: 3,
                  marginTop: 6,
                  alignSelf: "flex-start",
                  background: `linear-gradient(90deg, rgba(59,130,246,0) 0%, ${COLOR.blue} 50%, rgba(59,130,246,0) 100%)`,
                  boxShadow: `0 0 8px ${COLOR.blue}`,
                  opacity: dissolve,
                }}
              />
            </div>
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
        // v1.39: ~50/50 white + purple mix (was alternating purple/blue)
        const isPurple = i % 2 === 0;
        const color = isPurple ? COLOR.aiPurple : "#FFFFFF";
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
              background: color,
              boxShadow: `0 0 ${size * 2}px ${color}`,
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

const ICON_SIZE = 104; // v1.34: ~12% larger; balances the 72-px outcome word
// v1.39: icon glow purple → blue (purple reserved for explicit AI signals)
const ICON_GLOW_FILTER =
  "drop-shadow(0 0 8px rgba(59,130,246,0.55)) drop-shadow(0 0 4px rgba(59,130,246,0.4))";

// Phase transition frames (relative to feature start) — v1.41 pacing
// v1.45: icon waits until text reveal is finished (t=77 = outcome typed)
// before line-drawing. Line-draw runs t77-81, then immediately morphs active.
const ICON_DRAW_START = 77;
const ICON_DRAW_END = 81; // 4f line-draw
const ICON_MORPH_START = 81; // morph kicks in right after draw
const ICON_MORPH_END = 87; // 6f morph
const DRIFT_START = 50; // 10f drift onset (longer because window grew)

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
// v1.35 drift content: full single-line phrase rises slowly above the icon,
// 11 px / 70% opacity / 0.8 px/frame drift / 16 px padding
const F1_DRIFT_PHRASE = "Quote for a standard toilet refit";
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
      {/* v1.35: drift phrase rises slowly above the icon as a single line.
          Phrase loops continuously while feature persists. */}
      <DriftPhraseLoop
        phrase={F1_DRIFT_PHRASE}
        localTime={localTime}
        startFrame={DRIFT_START}
        size={11}
        opacity={0.7}
        driftSpeed={0.8}
        cycleFrames={28}
        padding={16}
      />
    </div>
  );
};

// v1.35 drift loop — single-line phrase rises slowly above the icon and
// fades. New cycle starts every `cycleFrames` so the content keeps flowing
// while the feature persists.
const DriftPhraseLoop: React.FC<{
  phrase: string;
  localTime: number;
  startFrame: number;
  size: number;
  opacity: number;
  driftSpeed: number;
  cycleFrames: number;
  padding: number;
}> = ({ phrase, localTime, startFrame, size, opacity, driftSpeed, cycleFrames, padding }) => {
  if (localTime < startFrame) return null;
  // Two staggered instances so as one fades out, the next is rising
  const instances = [0, 1];
  return (
    <>
      {instances.map((i) => {
        const offset = i * (cycleFrames / 2);
        const t = (localTime - startFrame - offset + cycleFrames * 8) % cycleFrames;
        const driftY = -t * driftSpeed - padding;
        const fade = interpolate(t, [0, cycleFrames * 0.2, cycleFrames * 0.7, cycleFrames], [0, opacity, opacity, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        if (fade <= 0) return null;
        return (
          <div
            key={`drift-${i}`}
            style={{
              position: "absolute",
              left: ICON_SIZE / 2,
              top: -padding,
              transform: `translate(-50%, ${driftY}px)`,
              fontSize: size,
              fontWeight: 400,
              color: `rgba(255,255,255,${fade})`,
              fontFamily: "Inter, system-ui",
              whiteSpace: "nowrap",
              pointerEvents: "none",
            }}
          >
            {phrase}
          </div>
        );
      })}
    </>
  );
};

// 👤 Feature 2 (v1.35) — START with MICROPHONE (visual rhyme with F1 —
// voice is the input) → mic morphs into PERSON SILHOUETTE → silhouette
// fills purple → small SCROLLING customer-detail tape rolls upward beside
// the silhouette: "Annie Yang" → "07700 900123" → "Notting Hill, London"
// (continuous loop).
const F2_TAPE_DETAILS = ["Annie Yang", "07700 900123", "Notting Hill, London"];

const PersonFillIcon: React.FC<{ localTime: number }> = ({ localTime }) => {
  // v1.35: starts as mic (line-draws F2-F6), then morphs to person at t=16
  const micDrawP = interpolate(localTime, [ICON_DRAW_START, ICON_DRAW_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Mic body breathing during idle
  const micBreathe = 1 + 0.03 * Math.sin((localTime / 30) * Math.PI * 2);

  // Active morph t=16-22: mic FADES to person silhouette
  const morphP = interpolate(localTime, [ICON_MORPH_START, ICON_MORPH_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  // Mic fades out, person fades in within morph
  const micOpacity = 1 - morphP;
  // Person fill rises bottom-up over t=18-22
  const personFillP = interpolate(localTime, [18, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Person draw — outline appears with the morph
  const personDrawP = interpolate(localTime, [16, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Drift tape — emerges after morph completes
  const tapeActive = localTime >= DRIFT_START;

  return (
    <div style={{ position: "relative", width: ICON_SIZE, height: ICON_SIZE }}>
      <svg
        width={ICON_SIZE}
        height={ICON_SIZE}
        viewBox="0 0 64 64"
        style={{ filter: ICON_GLOW_FILTER }}
      >
        {/* MIC body (visual rhyme with F1 — voice is the input) */}
        <g
          opacity={micOpacity}
          transform={`scale(${micBreathe}) translate(${(1 - micBreathe) * 32}, ${(1 - micBreathe) * 32})`}
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
            strokeDasharray={`${micDrawP * 100} 100`}
          />
          <path
            d="M 20 36 Q 20 46 32 46 Q 44 46 44 36"
            fill="none"
            stroke="rgba(255,255,255,0.95)"
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray={`${micDrawP * 100} 100`}
          />
          <line
            x1={32}
            y1={46}
            x2={32}
            y2={54}
            stroke="rgba(255,255,255,0.95)"
            strokeWidth={3}
            strokeLinecap="round"
            opacity={micDrawP}
          />
        </g>

        {/* PERSON silhouette (fades in during morph) */}
        {morphP > 0 && (
          <g opacity={morphP}>
            <defs>
              <clipPath id="person-clip-f2">
                <circle cx={32} cy={22} r={9} />
                <path d="M 14 56 Q 14 38 32 38 Q 50 38 50 56 Z" />
              </clipPath>
            </defs>
            <rect
              x={10}
              y={56 - 46 * personFillP}
              width={44}
              height={46}
              fill={COLOR.blue}
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
              strokeDasharray={`${personDrawP * 100} 100`}
            />
            <path
              d="M 14 56 Q 14 38 32 38 Q 50 38 50 56"
              fill="none"
              stroke="rgba(255,255,255,0.95)"
              strokeWidth={3}
              strokeLinecap="round"
              strokeDasharray={`${personDrawP * 100} 100`}
            />
          </g>
        )}
      </svg>

      {/* v1.35 scrolling customer-detail tape beside the silhouette.
          A vertical scroll where details move upward continuously and loop. */}
      {tapeActive && <CustomerDetailTape localTime={localTime} />}
    </div>
  );
};

const CustomerDetailTape: React.FC<{ localTime: number }> = ({ localTime }) => {
  // Tape positioned ABOVE the icon (where drift content lives in F1/F3)
  // — a small vertical viewport showing 1 detail at a time, scrolling up.
  const tapeWidth = 140;
  const tapeHeight = 38;
  const lineHeight = 18;
  const totalCycle = F2_TAPE_DETAILS.length * lineHeight;
  const t = localTime - DRIFT_START;
  // Continuous upward scroll at 0.8 px/frame, looped
  const scrollY = ((t * 0.8) % totalCycle + totalCycle) % totalCycle;
  const stack = [0, 1];

  return (
    <div
      style={{
        position: "absolute",
        left: ICON_SIZE / 2,
        top: -tapeHeight - 10,
        width: tapeWidth,
        height: tapeHeight,
        marginLeft: -tapeWidth / 2,
        overflow: "hidden",
        pointerEvents: "none",
        maskImage:
          "linear-gradient(180deg, transparent 0%, black 25%, black 75%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(180deg, transparent 0%, black 25%, black 75%, transparent 100%)",
      }}
    >
      {stack.map((s) => (
        <div
          key={s}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: tapeHeight / 2 - scrollY + s * totalCycle,
            textAlign: "center",
          }}
        >
          {F2_TAPE_DETAILS.map((d, i) => (
            <div
              key={i}
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: "rgba(255,255,255,0.7)",
                fontFamily: "Inter, system-ui",
                whiteSpace: "nowrap",
                lineHeight: `${lineHeight}px`,
                height: lineHeight,
              }}
            >
              {d}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

// 🗺 Feature 3 (v1.35) — SEQUENCED pins:
//   t 2-4 : first pin pops up alone with overshoot bounce
//   t 4-6 : brief beat — first pin pulses once
//   t 6-10: second pin pops up + glowing gradient line draws between them
//   t 10-16: idle (line glows + pins pulse softly)
//   t 16-22: ACTIVE morph — line brightens, particle flow speeds up
//   t 22+ : continuous flow + drifting addresses
const F3_DRIFT_ADDRESSES = ["Hammersmith", "Notting Hill", "Fulham"];

const RouteMorphIcon: React.FC<{ localTime: number }> = ({ localTime }) => {
  // First pin pops in t=2-4 (overshoot 1.0→1.2→1.0 spring)
  const pin1P = interpolate(localTime, [2, 4, 6], [0, 1.2, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // First pin idle pulse during the beat (t=4-6)
  const pin1BeatPulse =
    localTime >= 4 && localTime < 6
      ? 1 + 0.2 * Math.abs(Math.sin(((localTime - 4) / 2) * Math.PI))
      : 1;
  // Second pin pops in t=6-10
  const pin2P = interpolate(localTime, [6, 8, 10], [0, 1.2, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Line draws between them t=6-10 (sync with pin2 entry)
  const lineP = interpolate(localTime, [6, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });

  // Active morph t=16-22: line brightens, glow intensifies
  const activeP = interpolate(localTime, [ICON_MORPH_START, ICON_MORPH_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });

  // Continuous pin pulse after both pins land
  const continuousPulse =
    localTime >= 10
      ? 1 + 0.08 * Math.sin((localTime / 8) * Math.PI * 2)
      : 1;
  const pin1FinalScale = pin1P * pin1BeatPulse * continuousPulse;
  const pin2FinalScale = pin2P * continuousPulse;

  // Particle flow speed increases in active state
  const flowSpeedDiv = activeP > 0.5 ? 22 : 36;
  const path = `M 12 48 Q 28 32, 52 16`;

  return (
    <div style={{ position: "relative", width: ICON_SIZE, height: ICON_SIZE }}>
      <svg
        width={ICON_SIZE}
        height={ICON_SIZE}
        viewBox="0 0 64 64"
        style={{ filter: ICON_GLOW_FILTER }}
      >
        <defs>
          {/* v1.39: route gradient now all-blue (was blue→purple) */}
          <linearGradient id="route-grad-f3" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor={COLOR.blue} />
          </linearGradient>
        </defs>
        {/* Connecting line — draws sync'd with pin 2 */}
        <path
          d={path}
          fill="none"
          stroke="url(#route-grad-f3)"
          strokeWidth={3 + activeP * 1.5}
          strokeLinecap="round"
          strokeDasharray={`${lineP * 60} 100`}
          opacity={lineP}
          style={{
            filter: `drop-shadow(0 0 ${4 + activeP * 8}px rgba(59,130,246,${0.4 + activeP * 0.4}))`,
          }}
        />
        {/* Flowing particles along line — start once line is fully drawn */}
        {lineP >= 0.95 &&
          [0, 1, 2, 3].map((i) => {
            const tt = ((localTime + i * 9) % flowSpeedDiv) / flowSpeedDiv;
            const u = 1 - tt;
            const px = u * u * 12 + 2 * u * tt * 28 + tt * tt * 52;
            const py = u * u * 48 + 2 * u * tt * 32 + tt * tt * 16;
            return (
              <circle
                key={i}
                cx={px}
                cy={py}
                r={2.5 + activeP * 1}
                fill={i % 2 === 0 ? COLOR.blue : COLOR.aiPurple}
                opacity={0.85 * (tt < 0.1 ? tt * 10 : tt > 0.9 ? (1 - tt) * 10 : 1)}
              />
            );
          })}
        {/* PIN 1 — pops first, alone */}
        {pin1P > 0 && (
          <g transform={`translate(12, 48) scale(${pin1FinalScale})`}>
            <circle cx={0} cy={0} r={4.5} fill="rgba(255,255,255,0.95)" />
            <path d="M 0 -4 L -3 -8 L 3 -8 Z" fill="rgba(255,255,255,0.95)" />
          </g>
        )}
        {/* PIN 2 — pops after beat, sync'd with line draw */}
        {pin2P > 0 && (
          <g transform={`translate(52, 16) scale(${pin2FinalScale})`}>
            <circle cx={0} cy={0} r={4.5} fill={COLOR.aiPurple} />
            <path d="M 0 -4 L -3 -8 L 3 -8 Z" fill={COLOR.aiPurple} />
          </g>
        )}
      </svg>
      {/* v1.35 drift loop — addresses cycle continuously above the route */}
      <DriftAddressesCycle localTime={localTime} />
    </div>
  );
};

const DriftAddressesCycle: React.FC<{ localTime: number }> = ({ localTime }) => {
  if (localTime < DRIFT_START) return null;
  const cycleFrames = 30;
  return (
    <>
      {F3_DRIFT_ADDRESSES.map((addr, i) => {
        const stagger = i * (cycleFrames / F3_DRIFT_ADDRESSES.length);
        const t =
          ((localTime - DRIFT_START - stagger + cycleFrames * 8) % cycleFrames + cycleFrames) %
          cycleFrames;
        const driftY = -t * 0.8 - 16;
        const fade = interpolate(
          t,
          [0, cycleFrames * 0.2, cycleFrames * 0.7, cycleFrames],
          [0, 0.6, 0.6, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        if (fade <= 0) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: ICON_SIZE / 2,
              top: -16,
              transform: `translate(-50%, ${driftY}px)`,
              fontSize: 11,
              fontWeight: 400,
              color: `rgba(255,255,255,${fade})`,
              fontFamily: "Inter, system-ui",
              whiteSpace: "nowrap",
              pointerEvents: "none",
            }}
          >
            {addr}
          </div>
        );
      })}
    </>
  );
};

// 🤝 Feature 4 (v1.35) — TWO-ELEMENT icon: AI avatar (left) + chat bubble
// (right). Sequence:
//   t 2-4 : AI avatar appears (purple gradient circle with sparkle face)
//   t 4-6 : chat bubble appears next to avatar
//   t 6-16: typing dots "..." animate in the bubble (AI is typing)
//   t 16-22: dots fade, message types char-by-char into the bubble:
//            "Hi John, just following up..."
//   t 22-24: sent state — paper airplane emits + green check stamps in
//   t 24+ : continuous loop (avatar pulse, bubble shimmer, check glow)
const F4_MESSAGE = "Hi John, just following up...";

const SpeechAirplaneIcon: React.FC<{ localTime: number }> = ({ localTime }) => {
  // Avatar enters t=2-4 (spring scale 0 → 1.05 → 1.0)
  const avatarP = interpolate(localTime, [2, 3, 4], [0, 1.05, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Bubble appears t=4-6
  const bubbleP = interpolate(localTime, [4, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  // Typing dots active t=6-16 (during text typing)
  const dotsActive = localTime >= 6 && localTime < 16;
  // Active morph t=16-22: dots fade, message types in
  const morphP = interpolate(localTime, [ICON_MORPH_START, ICON_MORPH_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  // Message types in t=16-22 (during morph window)
  const msgT = localTime - ICON_MORPH_START;
  const msgVisible =
    msgT >= 0
      ? Math.min(F4_MESSAGE.length, Math.floor((msgT / 6) * F4_MESSAGE.length))
      : 0;
  const msgFullyTyped = msgVisible >= F4_MESSAGE.length;

  // Sent state at t=22+ (paper airplane + check stamp)
  const sentT = localTime - DRIFT_START;
  const sentAirOpacity =
    sentT >= 0
      ? interpolate(sentT, [0, 2, 8], [0, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;
  const sentAirX = interpolate(sentT, [0, 8], [50, 100]);
  const sentAirY = interpolate(sentT, [0, 8], [22, -28]);
  const sentCheckP =
    sentT >= 2
      ? interpolate(sentT, [2, 3.5, 5], [0, 1.15, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

  // Continuous avatar pulse
  const avatarPulse = 1 + 0.04 * Math.sin((localTime / 12) * Math.PI * 2);

  return (
    <div style={{ position: "relative", width: ICON_SIZE, height: ICON_SIZE }}>
      <svg
        width={ICON_SIZE}
        height={ICON_SIZE}
        viewBox="0 0 80 64"
        style={{ filter: ICON_GLOW_FILTER, overflow: "visible" }}
      >
        <defs>
          <radialGradient id="ai-avatar-grad" cx="0.4" cy="0.35">
            <stop offset="0%" stopColor="#A78BFA" />
            <stop offset="55%" stopColor={COLOR.aiPurple} />
            <stop offset="100%" stopColor="#3B0F8C" />
          </radialGradient>
        </defs>

        {/* AI AVATAR — purple gradient circle with sparkle "face" */}
        {avatarP > 0 && (
          <g
            transform={`translate(14, 32) scale(${avatarP * avatarPulse})`}
            style={{
              filter: `drop-shadow(0 0 ${4 + 4 * avatarPulse}px rgba(109,40,217,0.6))`,
            }}
          >
            <circle cx={0} cy={0} r={11} fill="url(#ai-avatar-grad)" />
            {/* Sparkle face */}
            <path
              d="M 0 -5 L 1.4 -1.4 L 5 0 L 1.4 1.4 L 0 5 L -1.4 1.4 L -5 0 L -1.4 -1.4 Z"
              fill="rgba(255,255,255,0.9)"
              transform={`rotate(${(localTime * 6) % 360})`}
            />
            <circle cx={-3} cy={-2} r={0.8} fill="rgba(255,255,255,0.6)" />
            <circle cx={3} cy={-2} r={0.8} fill="rgba(255,255,255,0.6)" />
          </g>
        )}

        {/* CHAT BUBBLE — to the right of avatar, with tail pointing at avatar */}
        {bubbleP > 0 && (
          <g opacity={bubbleP}>
            <path
              d="M 30 18 Q 30 14 34 14 L 70 14 Q 74 14 74 18 L 74 42 Q 74 46 70 46 L 38 46 L 32 50 L 32 46 L 30 46 Q 30 46 30 42 Z"
              fill={`rgba(15,23,42,${0.5 + morphP * 0.3})`}
              stroke="rgba(255,255,255,0.95)"
              strokeWidth={2.5}
              strokeLinejoin="round"
            />
            {/* Continuous inner shimmer when message is fully typed */}
            {msgFullyTyped && (
              <rect
                x={32}
                y={16}
                width={40}
                height={28}
                fill={`rgba(255,255,255,${0.04 + 0.04 * Math.sin((localTime / 18) * Math.PI * 2)})`}
                rx={3}
              />
            )}
          </g>
        )}

        {/* Typing dots "..." inside bubble — wave animation */}
        {dotsActive &&
          [0, 1, 2].map((i) => {
            const dotPhase = ((localTime + i * 3) % 12) / 12;
            const dotY = 30 - 2 * Math.abs(Math.sin(dotPhase * Math.PI));
            return (
              <circle
                key={`dot-${i}`}
                cx={42 + i * 7}
                cy={dotY}
                r={1.8}
                fill={`rgba(255,255,255,${0.5 + 0.5 * Math.abs(Math.sin(dotPhase * Math.PI))})`}
              />
            );
          })}

        {/* Sent airplane firing out of bubble */}
        {sentAirOpacity > 0 && (
          <g
            transform={`translate(${sentAirX}, ${sentAirY}) rotate(-28)`}
            opacity={sentAirOpacity}
          >
            <path
              d="M -7 0 L 7 -3 L 7 3 L -7 0 L -3 -3 M -7 0 L -3 3"
              fill={`rgba(59,130,246,0.35)`}
              stroke={COLOR.blue}
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 6px ${COLOR.blue})` }}
            />
          </g>
        )}

        {/* Green check stamp at bubble corner (sent confirmation) */}
        {sentCheckP > 0 && (
          <g
            transform={`translate(72, 14) scale(${sentCheckP})`}
            style={{ filter: `drop-shadow(0 0 4px ${COLOR.accepted})` }}
          >
            <circle cx={0} cy={0} r={6} fill={COLOR.accepted} />
            <path
              d="M -2.5 0 L -0.5 1.5 L 2.5 -1.8"
              fill="none"
              stroke="#fff"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        )}
      </svg>

      {/* Streamed message text inside the bubble (overlay) */}
      {msgT >= 0 && (
        <div
          style={{
            position: "absolute",
            top: 26,
            left: 40,
            width: 60,
            fontSize: 8,
            fontWeight: 500,
            color: "rgba(255,255,255,0.92)",
            fontFamily: "Inter, system-ui",
            lineHeight: 1.25,
            opacity: morphP,
            pointerEvents: "none",
          }}
        >
          {F4_MESSAGE.slice(0, msgVisible)}
          {!msgFullyTyped && Math.floor(localTime / 3) % 2 === 0 && (
            <span style={{ color: COLOR.aiPurple }}>|</span>
          )}
        </div>
      )}
    </div>
  );
};
