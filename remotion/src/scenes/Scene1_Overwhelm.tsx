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

// === scene phase frames (v1.22) ===
// Typing slowed for deliberate pacing per user request:
//   • Cursor onset extended: 4f → 8f (CURSOR_APPEAR=120, TYPE_START=128)
//   • "Feeling" — 7 chars at 2 fpc: F128–F140
//   • Pause: 6 frames F142–F148 (was 2f)
//   • " overwhelmed?" — 13 chars at ~1.67 fpc: F148–F168
//   • "?" scale-pulse: F168–F172
//   • Held silence: F172–F180 (cursor blinking; cards frozen mid-drift)
//   • Swoosh REMOVED from Scene 1 — it's now Scene 2's frame F0 territory
const HERO_HOLD_START = 24;
const HERO_HOLD_END = 42;
const CURSOR_APPEAR = 120;
const TYPE_START = 128;
const HOOK_START = 124; // last density card lands (cluster freeze-in begins)
const HOOK_END = 168; // typing complete (full text visible)
const FREEZE_START = 168; // sediment freeze + held-silence begins
const QUESTION_MARK_FRAME = 168; // "?" lands; pulse F168–F172
const TYPING_TEXT = "Feeling overwhelmed?";
const SCENE_END = 180;

// Per-character land frame for the v1.22 schedule.
// chars 0–6  ("Feeling")     → F128 + i*2  →  F128, 130, 132, 134, 136, 138, 140
// pause F140–F148 (6f hold)
// chars 7–19 (" overwhelmed?") → F148 + (i-7)*(20/12) rounded
function charLandFrame(i: number): number {
  if (i < 0) return -1;
  if (i <= 6) return TYPE_START + i * 2;
  if (i >= TYPING_TEXT.length) return -1;
  return Math.round(148 + (i - 7) * (20 / 12));
}

export const Scene1Overwhelm: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Slow 1.0 → 1.04 push-in across F128–F180 (typing → held silence).
  const camScale = interpolate(
    frame,
    [TYPE_START, SCENE_END],
    [1, 1.04],
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
          />
        ))}
      </AbsoluteFill>

      <HookText frame={frame} />

      {/* === AUDIO === */}
      {/* Phone vibration loop frames 0–180 — sustains through held-silence
          (was cut at swoosh F156 in v1.21; v1.22 keeps it alive until end of
          Scene 1 since the swoosh has moved to Scene 2 frame 0). */}
      <SfxAt
        src={GEN.phoneVibration}
        from={0}
        volume={(f) =>
          interpolate(
            f,
            [0, 30, 100, FREEZE_START, SCENE_END],
            [0.08, 0.13, 0.18, 0.22, 0.22],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          )
        }
        loop
        durationInFrames={SCENE_END}
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

      {/* Riser tension build — peaks at FREEZE_START (F168) and sustains through
          held-silence per v1.22 spec ("riser.mp3 peaks at F172 and sustains at peak"). */}
      <SfxAt
        src={SFX.riser}
        from={75}
        volume={(f) =>
          interpolate(
            f,
            [0, 30, 90, 100, SCENE_END - 75],
            [0, 0.55, 0.85, 0.95, 0.95],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          )
        }
        durationInFrames={SCENE_END - 75}
      />

      {/* v1.22 typing clicks — every-other char at 25% (sparse, reads as typing) */}
      {[1, 3, 5].map((i) => (
        <SfxAt
          key={`type-${i}`}
          src={SFX.click}
          from={charLandFrame(i)}
          volume={0.25}
          playbackRate={1.05}
        />
      ))}
      {/* "overwhelmed" period clicks at chars 9, 11, 13, 15, 17 */}
      {[9, 11, 13, 15, 17].map((i) => (
        <SfxAt
          key={`type-${i}`}
          src={SFX.click}
          from={charLandFrame(i)}
          volume={0.25}
          playbackRate={1.05}
        />
      ))}
      {/* Final "?" click — pitched +1 semitone at 40% vol on landing F168 */}
      <SfxAt
        src={SFX.click}
        from={QUESTION_MARK_FRAME}
        volume={0.4}
        playbackRate={Math.pow(2, 1 / 12)}
      />
      {/* (Swoosh + thumb-tap + morph-whirr moved to Scene 2 in v1.22) */}
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
}> = ({ spec, zIndex, frame, fps }) => {
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

  // v1.22: Swoosh wipe moved to Scene 2. Cards stay in their drift-frozen state
  // through end of Scene 1 (F180); the held silence is the breath before Scene 2.
  const finalX = px;
  const finalY = py + drift + heroHoldY;
  const finalOpacity = driftOpacity * heroHoldOpacity;

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
// HOOK TEXT — v1.22 slowed typed reveal
// Cursor appears at F120 (8f onset), typing starts F128, 6-frame pause after
// "Feeling" at F142–F148, "?" lands F168, scale-pulse F168–F172, cursor blinks
// through held silence F172–F180.
// =====================================================================

// Visible char count at a given absolute frame (uses charLandFrame defined at top).
function visibleCharCount(frame: number): number {
  // Walk backwards from the highest char index until we find one whose land
  // frame is <= the current frame. Could binary-search but length is 20.
  for (let i = TYPING_TEXT.length - 1; i >= 0; i--) {
    if (frame >= charLandFrame(i)) return i + 1;
  }
  return 0;
}

const HookText: React.FC<{ frame: number }> = ({ frame }) => {
  if (frame < CURSOR_APPEAR - 2 || frame > SCENE_END + 6) return null;

  const charCount = visibleCharCount(frame);
  const visibleText = TYPING_TEXT.slice(0, charCount);

  // Cursor blink: 15f on, 15f off (per v1.22 spec)
  const blinkPhase = (frame - CURSOR_APPEAR) % 30;
  const cursorVisible = blinkPhase < 15;
  const showCursor = cursorVisible;

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

// v1.22: LogoReveal / Tagline / ThumbAndMorph / DashboardStill removed.
// All of those moved to Scene 2 (iPhone + Kiva app opening).
