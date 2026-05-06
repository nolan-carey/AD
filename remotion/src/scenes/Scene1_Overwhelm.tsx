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
import { NotificationCard, NotifVariant } from "../components/NotificationCard";
import { KivaLogo } from "../components/KivaLogo";
import { SfxAt } from "../components/SfxAt";
import { PhoneFrame } from "../components/PhoneFrame";

// =====================================================================
// SCENE 1 — v1.3 spec (supersedes v1.2 timing)
// • 18-frame hero hold: Mrs. Patel card alone, frames 24–42
//   (drifts down 0.2 px/frame, single opacity pulse 1.0→0.97→1.0)
// • Stack: 4 cards, 10-frame intervals (42→82), 10-frame travel
// • Density build: 7 cards, 6-frame intervals (82→124), 8-frame travel
// • Hook text onset: frame 124 (when last card lands)
// • Cluster zone, sizes, rotations, ding-sync rule unchanged from v1.2
// =====================================================================

interface CardSpec {
  id: string;
  variant: NotifVariant;
  sender: string;
  body: string;
  // travel start frame (when card begins moving in)
  start: number;
  // landing frame (when card visually settles)
  land: number;
  // landing position — ABSOLUTE coordinates of the card CENTER in the 1920x1080 frame
  x: number;
  y: number;
  // landing rotation (deg)
  rotation: number;
  // per-card-type size
  width: number;
  height: number;
  // offscreen origin direction (vector from landing point pointing offscreen)
  fromDx: number;
  fromDy: number;
  // per-card drift speed multiplier during sediment phase
  driftFactor: number;
}

const CARDS: CardSpec[] = [
  // 1) Mrs. Patel — iMessage bubble — bottom-left → (900,540)
  {
    id: "patel",
    variant: "imessage",
    sender: "Mrs. Patel",
    body: "u still coming tomorrow?",
    start: 0,
    land: 24,
    x: 900,
    y: 540,
    rotation: -3,
    width: 460,
    height: 110,
    fromDx: -1200,
    fromDy: 700,
    driftFactor: 1.0,
  },
  // === Stack — 4 cards, 10-frame intervals starting at frame 42, 10-frame travel ===
  // 2) Missed call banner — top-right → (1180,400) | start 42, land 52
  {
    id: "john-call",
    variant: "call",
    sender: "John",
    body: "Missed call (3) — John (boiler)",
    start: 42,
    land: 52,
    x: 1180,
    y: 400,
    rotation: -2,
    width: 600,
    height: 100,
    fromDx: 1400,
    fromDy: -700,
    driftFactor: 1.05,
  },
  // 3) WhatsApp boiler — left → (740,600) | start 52, land 62
  {
    id: "wa-leaking",
    variant: "whatsapp",
    sender: "Dave (boiler job)",
    body: "boiler still leaking mate",
    start: 52,
    land: 62,
    x: 740,
    y: 600,
    rotation: 3,
    width: 460,
    height: 110,
    fromDx: -1500,
    fromDy: 0,
    driftFactor: 0.95,
  },
  // 4) HMRC email — bottom-right → (1100,720) | start 62, land 72
  {
    id: "hmrc",
    variant: "email",
    sender: "HMRC",
    body: "VAT return due in 3 days. File now to avoid penalty.",
    start: 62,
    land: 72,
    x: 1100,
    y: 720,
    rotation: -1,
    width: 540,
    height: 160,
    fromDx: 1500,
    fromDy: 700,
    driftFactor: 1.08,
  },
  // 5) Calendar pop — top → (920,380) | start 72, land 82
  {
    id: "calendar",
    variant: "calendar",
    sender: "Calendar",
    body: "Job at 8AM — Hammersmith",
    start: 72,
    land: 82,
    x: 920,
    y: 380,
    rotation: 2,
    width: 460,
    height: 120,
    fromDx: 0,
    fromDy: -1100,
    driftFactor: 1.1,
  },
  // === Density build — 7 cards, 6-frame intervals (82–124), 8-frame travel ===
  // 6) Stripe overdue — from top → (1020,480) | start 82, land 90
  {
    id: "stripe",
    variant: "stripe",
    sender: "Stripe",
    body: "Invoice #0421 overdue — 47 days",
    start: 82,
    land: 90,
    x: 1020,
    y: 480,
    rotation: 1,
    width: 480,
    height: 120,
    fromDx: 100,
    fromDy: -1000,
    driftFactor: 0.9,
  },
  // 7) Google review — from right → (1180,540) | start 88, land 96
  {
    id: "google",
    variant: "google",
    sender: "Google Business",
    body: "New 1-star review — respond?",
    start: 88,
    land: 96,
    x: 1180,
    y: 540,
    rotation: -2,
    width: 480,
    height: 130,
    fromDx: 1300,
    fromDy: 100,
    driftFactor: 1.02,
  },
  // 8) iMessage cheaper — from bottom → (820,700) | start 94, land 102
  {
    id: "imessage-cheaper",
    variant: "imessage",
    sender: "Tom",
    body: "can u do it cheaper?",
    start: 94,
    land: 102,
    x: 820,
    y: 700,
    rotation: 3,
    width: 460,
    height: 110,
    fromDx: -200,
    fromDy: 1000,
    driftFactor: 0.97,
  },
  // 9) Screwfix email — from top-right → (980,360) | start 100, land 108
  {
    id: "screwfix",
    variant: "screwfix",
    sender: "Screwfix",
    body: "Your parts order has shipped",
    start: 100,
    land: 108,
    x: 980,
    y: 360,
    rotation: -1,
    width: 480,
    height: 130,
    fromDx: 1200,
    fromDy: -900,
    driftFactor: 1.06,
  },
  // 10) Voicemail — from left → (760,480) | start 106, land 114
  {
    id: "voicemail",
    variant: "voicemail",
    sender: "Voicemail",
    body: "You have 4 new messages",
    start: 106,
    land: 114,
    x: 760,
    y: 480,
    rotation: 2,
    width: 480,
    height: 120,
    fromDx: -1300,
    fromDy: -100,
    driftFactor: 0.93,
  },
  // 11) Banking alert — from right → (1140,660) | start 112, land 120
  {
    id: "banking",
    variant: "banking",
    sender: "Lloyds Bank",
    body: "Direct debit failed",
    start: 112,
    land: 120,
    x: 1140,
    y: 660,
    rotation: -3,
    width: 480,
    height: 120,
    fromDx: 1300,
    fromDy: 200,
    driftFactor: 1.04,
  },
  // 12) Quote follow-up — from bottom → (940,580) | start 118, land 124
  {
    id: "followup",
    variant: "generic",
    sender: "Reminder",
    body: "Quote follow-up?",
    start: 118,
    land: 124,
    x: 940,
    y: 580,
    rotation: 1,
    width: 460,
    height: 110,
    fromDx: 0,
    fromDy: 1000,
    driftFactor: 0.99,
  },
];

// === per-card audio table (v1.2) ===
// pitch in semitones → playbackRate via 2^(s/12)
const semitone = (s: number) => Math.pow(2, s / 12);

interface DingSpec {
  cardIdx: number; // 1-based for clarity matching plan table
  file: string;
  pitch: number; // semitones
}
const DINGS: DingSpec[] = [
  { cardIdx: 1, file: SFX.notification1, pitch: 0 },
  { cardIdx: 2, file: SFX.notification2, pitch: 0 },
  { cardIdx: 3, file: SFX.notification1, pitch: 0 },
  { cardIdx: 4, file: SFX.notification2, pitch: 0 },
  { cardIdx: 5, file: SFX.notification1, pitch: 2 },
  { cardIdx: 6, file: SFX.notification2, pitch: -1 },
  { cardIdx: 7, file: SFX.notification1, pitch: 1 },
  { cardIdx: 8, file: SFX.notification2, pitch: 2 },
  { cardIdx: 9, file: SFX.notification1, pitch: -2 },
  { cardIdx: 10, file: SFX.notification2, pitch: 1 },
  { cardIdx: 11, file: SFX.notification1, pitch: -1 },
  { cardIdx: 12, file: SFX.notification2, pitch: 2 },
];

// === scene phase frames (v1.3 + v1.6 typing) ===
const HERO_HOLD_START = 24; // Mrs. Patel settles — hold begins
const HERO_HOLD_END = 42; // stack begins
const CURSOR_APPEAR = 120; // v1.6: white text-cursor blinks at center
const TYPE_START = 124; // v1.6: typing begins (last density card lands)
const HOOK_START = 124; // (legacy alias — same frame as TYPE_START)
const HOOK_END = 138;
// v1.6 typing schedule: 1 frame per char, 2-frame pause after "Feeling"
const TYPING_TEXT = "Feeling overwhelmed?";
const PAUSE_AFTER_CHAR_INDEX = 7; // after "Feeling" (chars 0..6)
const PAUSE_FRAMES = 2;
const QUESTION_MARK_FRAME =
  TYPE_START + (TYPING_TEXT.length - 1) + PAUSE_FRAMES; // last char lands
const FREEZE_START = 138;
const SWOOSH_START = 156;
const SWOOSH_END = 168;
const LOGO_START = 168;
const TAGLINE_START = 186;
const THUMB_START = 198;
const SCENE_END = 240; // v1.14: extended by 24f for cinematic morph breathing room

export const Scene1Overwhelm: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const bgVignette = interpolate(
    frame,
    [LOGO_START - 6, LOGO_START + 12],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const camScale = interpolate(
    frame,
    [FREEZE_START, SWOOSH_START],
    [1, 1.04],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE.inOutQuad,
    }
  );

  const swooshProgress = interpolate(
    frame,
    [SWOOSH_START, SWOOSH_END],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE.inOutQuad,
    }
  );

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${COLOR.navy} 0%, ${COLOR.surfaceDark} 100%)`,
      }}
    >
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at center, rgba(59,130,246,0.18) 0%, rgba(15,23,42,0) 60%)",
          opacity: bgVignette,
        }}
      />

      {/* CARD CLUSTER */}
      <AbsoluteFill
        style={{
          transform: `scale(${camScale})`,
          transformOrigin: "center center",
        }}
      >
        {CARDS.map((spec, idx) => (
          <Card
            key={spec.id}
            spec={spec}
            zIndex={idx + 1}
            frame={frame}
            fps={fps}
            canvasWidth={width}
            swooshProgress={swooshProgress}
          />
        ))}
      </AbsoluteFill>

      <HookText frame={frame} swooshProgress={swooshProgress} />

      {frame >= LOGO_START && frame < THUMB_START + 2 && (
        <LogoReveal frame={frame} fps={fps} />
      )}

      {frame >= TAGLINE_START && <Tagline frame={frame} />}

      {frame >= THUMB_START && <ThumbAndMorph frame={frame} fps={fps} />}

      {/* === AUDIO === */}
      {/* Phone vibration loop (generated SFX) frames 0–156 — -18 dBFS, deepens, cuts at swoosh */}
      <SfxAt
        src={GEN.phoneVibration}
        from={0}
        volume={(f) =>
          interpolate(
            f,
            [0, 30, 100, 138, 156],
            [0.08, 0.13, 0.18, 0.22, 0.0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          )
        }
        loop
        durationInFrames={156}
      />

      {/* Per-card dings — all fire at landFrame - 2 */}
      {DINGS.map((d) => {
        const card = CARDS[d.cardIdx - 1];
        const dingFrame = card.land - 2;
        // Volume tapers: hero ping is loudest, density build slightly quieter
        const volume =
          d.cardIdx === 1
            ? 0.85
            : d.cardIdx <= 4
            ? 0.78
            : 0.62 - (d.cardIdx - 5) * 0.025;
        return (
          <SfxAt
            key={`ding-${d.cardIdx}`}
            src={d.file}
            from={dingFrame}
            volume={volume}
            playbackRate={semitone(d.pitch)}
          />
        );
      })}

      {/* Riser tension build frames 75 → 156 */}
      <SfxAt
        src={SFX.riser}
        from={75}
        volume={(f) =>
          interpolate(f, [0, 30, 75, 81], [0, 0.55, 0.85, 0.0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
        durationInFrames={SWOOSH_START + 6 - 75}
      />

      {/* v1.6 typing clicks — every-other character at 25% vol */}
      {[1, 3, 5, 7, 9, 11, 13, 15, 17].map((i) => (
        <SfxAt
          key={`type-${i}`}
          src={SFX.click}
          from={charLandFrame(i)}
          volume={0.25}
          playbackRate={1.05}
        />
      ))}
      {/* v1.6 final "?" click pitched +1 semitone at 40% vol */}
      <SfxAt
        src={SFX.click}
        from={QUESTION_MARK_FRAME}
        volume={0.4}
        playbackRate={Math.pow(2, 1 / 12)}
      />

      {/* Swoosh wipe at 156 */}
      <SfxAt src={SFX.swoosh} from={SWOOSH_START} volume={0.95} />

      {/* (impact2 logo-land cue removed at user request) */}

      {/* Thumb tap click at 198 */}
      <SfxAt src={SFX.click} from={THUMB_START} volume={0.85} />
      {/* iPhone morph whirr (generated SFX) frames 200–212 — -14 dBFS */}
      <SfxAt src={GEN.morphWhirr} from={THUMB_START + 2} volume={0.2} />
    </AbsoluteFill>
  );
};

// =====================================================================
// CARD COMPONENT — absolute (x, y) landing positions per v1.2
// =====================================================================
const Card: React.FC<{
  spec: CardSpec;
  zIndex: number;
  frame: number;
  fps: number;
  canvasWidth: number;
  swooshProgress: number;
}> = ({ spec, zIndex, frame, swooshProgress, fps, canvasWidth }) => {
  const t = frame - spec.start;
  if (t < -2) return null;

  const travel = spec.land - spec.start;
  // Travel-in: 0 → 1 over the travel window, easeOutCubic for a crisp landing.
  const travelP = interpolate(t, [0, travel], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });

  // Spring overshoot scale at landing — peaks at 1.18, settles to 1.15 then 1.0.
  // We only "begin" the spring at land - 6 frames so the bounce reads as impact.
  const springT = spring({
    frame: t - (travel - 6),
    fps,
    config: SPRING.bouncy,
  });
  // Map: 0 → 0 (still moving), at impact → 1 (peak), settle → ~0.85
  // We translate this into a small bump on top of base scale 1.0
  const bump = springT * 0.18 - Math.max(0, springT - 1) * 0.18 * 0.18;
  // Pre-impact, scale grows from 0.6 → 1.0 over the travel
  const baseScale = interpolate(travelP, [0, 1], [0.6, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = baseScale + (travelP >= 1 ? 0 : 0) + (t >= travel - 6 ? bump : 0);
  // After full settle (springT plateaus near 1) we want scale ≈ 1.0 (designer wants 1.15→1.0 settle)
  // Achieved by spring naturally returning to its rest value of 1 -> bump ≈ 0.

  // Position interpolated from offscreen origin to landing
  const ox = spec.x + spec.fromDx;
  const oy = spec.y + spec.fromDy;
  const px = interpolate(travelP, [0, 1], [ox, spec.x]);
  const py = interpolate(travelP, [0, 1], [oy, spec.y]);

  // Sediment drift HOOK_START → FREEZE_START
  const driftFrames = Math.max(0, Math.min(frame, FREEZE_START) - HOOK_START);
  const drift = driftFrames * 1.5 * spec.driftFactor;
  const driftOpacity =
    driftFrames > 0
      ? interpolate(driftFrames, [0, 14], [1, 0.91], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

  // === Hero hold (Card 1 only, frames 24–42) ===
  // 0.2 px/frame downward drift, accumulates and persists after hold ends.
  // Single opacity pulse 1.0 → 0.97 → 1.0 across the 18-frame window.
  let heroHoldY = 0;
  let heroHoldOpacity = 1;
  if (spec.id === "patel") {
    if (frame >= HERO_HOLD_START && frame <= HERO_HOLD_END) {
      heroHoldY = (frame - HERO_HOLD_START) * 0.2;
      heroHoldOpacity =
        frame <= 33
          ? interpolate(frame, [HERO_HOLD_START, 33], [1.0, 0.97])
          : interpolate(frame, [33, HERO_HOLD_END], [0.97, 1.0]);
    } else if (frame > HERO_HOLD_END) {
      heroHoldY = (HERO_HOLD_END - HERO_HOLD_START) * 0.2; // baked-in 3.6 px
    }
  }

  // Swoosh wipe — drag everything off-screen left→right with motion blur
  const wipeOffset = swooshProgress * (canvasWidth + 600);
  const wipeBlur = swooshProgress * 6;
  const wipeOpacity = interpolate(swooshProgress, [0, 0.6, 1], [1, 0.9, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const finalX = px + wipeOffset;
  const finalY = py + drift + heroHoldY;
  const finalOpacity = driftOpacity * wipeOpacity * heroHoldOpacity;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: spec.width,
        height: spec.height,
        // Position so card CENTER is at (finalX, finalY) before rotation/scale.
        transform: `translate(${finalX - spec.width / 2}px, ${
          finalY - spec.height / 2
        }px) rotate(${spec.rotation}deg) scale(${scale})`,
        transformOrigin: "center center",
        opacity: finalOpacity,
        zIndex,
        filter: wipeBlur > 0.1 ? `blur(${wipeBlur}px)` : undefined,
        willChange: "transform",
      }}
    >
      <NotificationCard
        variant={spec.variant}
        sender={spec.sender}
        body={spec.body}
        width={spec.width}
      />
    </div>
  );
};

// =====================================================================
// HOOK TEXT — v1.6 typed reveal (Linear/Notion style)
// Cursor appears at frame 120, typing starts at 124, 2-frame pause after
// "Feeling", scale-pulse on the "?" landing. Cursor blinks through freeze.
// =====================================================================

// Frame at which character index `i` (0..TYPING_TEXT.length-1) becomes visible.
function charLandFrame(i: number): number {
  if (i <= PAUSE_AFTER_CHAR_INDEX - 1) return TYPE_START + i;
  return TYPE_START + i + PAUSE_FRAMES;
}

// Number of visible characters at a given absolute frame.
function visibleCharCount(frame: number): number {
  if (frame < TYPE_START) return 0;
  let f = frame - TYPE_START; // 0-based local typing frame
  // Phase 1: linear typing of "Feeling" (chars 0..6) — char i visible at f >= i
  const linear1End = PAUSE_AFTER_CHAR_INDEX; // = 7 chars
  if (f < linear1End) return f + 1;
  // Phase 2: 2-frame pause holds "Feeling" (7 chars) visible
  f -= linear1End;
  if (f < PAUSE_FRAMES) return linear1End;
  // Phase 3: linear typing of " overwhelmed?"
  f -= PAUSE_FRAMES;
  return Math.min(linear1End + 1 + f, TYPING_TEXT.length);
}

const HookText: React.FC<{ frame: number; swooshProgress: number }> = ({
  frame,
  swooshProgress,
}) => {
  if (frame < CURSOR_APPEAR - 2 || frame > SWOOSH_END) return null;

  const wipeOpacity = interpolate(swooshProgress, [0, 0.4], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const wipeX = swooshProgress * 1900;

  const charCount = visibleCharCount(frame);
  const visibleText = TYPING_TEXT.slice(0, charCount);

  // Cursor blink: ~30% duty visible, 12-frame period
  const blinkPhase = (frame - CURSOR_APPEAR) % 16;
  const cursorVisible = blinkPhase < 10;
  // Hide cursor during the swoosh wipe
  const showCursor = cursorVisible && frame <= SWOOSH_START + 2;

  // Question-mark scale-pulse — fires when last char lands
  const qMarkLanded = frame >= QUESTION_MARK_FRAME && charCount === TYPING_TEXT.length;
  const qPulseT = frame - QUESTION_MARK_FRAME;
  const qPulse = qMarkLanded
    ? interpolate(qPulseT, [0, 4, 10], [1, 1.18, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: EASE.outCubic,
      })
    : 1;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none",
        zIndex: 100,
      }}
    >
      <div
        style={{
          fontFamily: "Inter, system-ui",
          fontSize: 110,
          fontWeight: 800,
          color: "#fff",
          letterSpacing: -2,
          opacity: wipeOpacity,
          transform: `translate(${wipeX}px, 0)`,
          textShadow:
            "0 0 60px rgba(15,23,42,0.95), 0 0 120px rgba(15,23,42,0.85)",
          display: "flex",
          alignItems: "baseline",
          whiteSpace: "pre",
        }}
      >
        {/* Type the text up to but not including the trailing "?" so we can pulse it independently */}
        <span>
          {visibleText.endsWith("?") ? visibleText.slice(0, -1) : visibleText}
        </span>
        {/* Question-mark with scale pulse on landing */}
        {visibleText.endsWith("?") && (
          <span
            style={{
              display: "inline-block",
              transform: `scale(${qPulse})`,
              transformOrigin: "left center",
            }}
          >
            ?
          </span>
        )}
        {/* Blinking cursor */}
        <span
          style={{
            display: "inline-block",
            width: 6,
            height: 92,
            marginLeft: 6,
            background: "#fff",
            opacity: showCursor ? 1 : 0,
            transform: "translateY(8px)",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// =====================================================================
// LOGO REVEAL
// =====================================================================
const LogoReveal: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const t = frame - LOGO_START;
  const sp = spring({ frame: t, fps, config: SPRING.soft });
  const scale = 0.8 + 0.3 * sp;
  const pulsePhase = ((frame - LOGO_START) / 30) * Math.PI * 2;
  const glow = 0.75 + 0.15 * Math.sin(pulsePhase);
  const fadeOut = interpolate(frame, [THUMB_START, THUMB_START + 8], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          opacity: fadeOut,
        }}
      >
        <KivaLogo size={260} glow={glow} />
      </div>
    </AbsoluteFill>
  );
};

// =====================================================================
// TAGLINE
// Logo center sits at y=540, peak scale ≈1.16 → bottom edge ~691, with a
// soft glow halo extending another ~80 px. Anchor the tagline at y=740
// (top edge) for a clean gap that survives the logo's spring overshoot.
// =====================================================================
const Tagline: React.FC<{ frame: number }> = ({ frame }) => {
  const t = frame - TAGLINE_START;
  const opacity = interpolate(t, [0, 10], [0, 0.85], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outExpo,
  });
  const fadeOut = interpolate(frame, [THUMB_START, THUMB_START + 8], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rise = interpolate(t, [0, 10], [4, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outExpo,
  });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: 740,
          left: "50%",
          transform: `translate(-50%, ${rise}px)`,
          fontFamily: "Inter, system-ui",
          fontSize: 32,
          fontWeight: 600,
          color: "#fff",
          opacity: opacity * fadeOut,
          letterSpacing: -0.3,
          whiteSpace: "nowrap",
          textShadow: "0 2px 24px rgba(15,23,42,0.6)",
        }}
      >
        Blue collar solutions to blue collar problems
      </div>
    </AbsoluteFill>
  );
};

// =====================================================================
// THUMB TAP + iPhone MORPH
// =====================================================================
const ThumbAndMorph: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const t = frame - THUMB_START;
  const ripple = interpolate(t, [0, 9], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outExpo,
  });
  const rippleOpacity = interpolate(t, [0, 9], [0.7, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // v1.14: extended morph beat F198–F240
  // F2..16 (t=2..16): logo Y-flip 0→180° as it morphs into a phone
  // F16..26 (t=16..26): iPhone settles into 3D resting tilt (rotateY 90→-6, rotateX 0→3)
  // F26..36 (t=26..36): phone scales up to full size; AI glow halo onset (handled by global AIGlow)
  // F36..42 (t=36..42): hold final pose; drift baseline established
  const morphProgress = interpolate(t, [2, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  const yRot = morphProgress * 180;
  // After flip lands, settle to resting tilt over t=16..26
  const settleP = interpolate(t, [16, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  // Final phone tilt eases from "post-flip" 8° rotateZ → resting 0
  const finalTilt = interpolate(settleP, [0, 1], [8, 0]);
  // Phone grows from morph to full size over t=2..36 (slow grow continues past flip)
  const phoneScale = interpolate(t, [2, 36], [0.5, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 260,
          height: 260,
          borderRadius: "50%",
          border: `4px solid rgba(59,130,246,0.9)`,
          transform: `scale(${1 + ripple * 1.6})`,
          opacity: rippleOpacity,
        }}
      />
      <div
        style={{
          transformStyle: "preserve-3d",
          transform: `perspective(1500px) rotateY(${yRot}deg) rotateZ(${finalTilt}deg) scale(${phoneScale})`,
          opacity: morphProgress > 0.05 ? 1 : 0,
        }}
      >
        {morphProgress > 0.4 ? (
          <PhoneFrame scale={0.55}>
            <DashboardStill />
          </PhoneFrame>
        ) : (
          <KivaLogo size={260} glow={0.6} />
        )}
      </div>
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
    }}
  />
);
