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

// User override 2026-05-07: 18 cards total (was 12), uniform 8-frame cadence
// after the hero hold (was 10f stack + 6f density). Last card lands at F178.
// Each card travels 10 frames; lands 8 frames after the previous one.
const CARDS: CardSpec[] = [
  // 1) Mrs. Patel — iMessage bubble — bottom-left → (900,540) | land 14
  // v1.6 polish: shortened hero travel 24f → 14f for more direct entry
  // (user direction: "first couple of messages float in, make them more
  // direct"). HERO_HOLD still begins at F24 — solo time preserved.
  {
    id: "patel",
    variant: "imessage",
    sender: "Mrs. Patel",
    body: "u still coming tomorrow?",
    start: 0,
    land: 14,
    x: 900,
    y: 540,
    rotation: -3,
    width: 460,
    height: 110,
    fromDx: -1200,
    fromDy: 700,
    driftFactor: 1.0,
  },
  // === HERO HOLD F24–F42, then uniform 8-frame cadence (cards 2–18) ===
  // 2) Missed call banner | start 32, land 42 (hero-hold gap shortened 16f → 8f)
  {
    id: "john-call",
    variant: "call",
    sender: "John",
    body: "Missed call (3) — John (boiler)",
    start: 32,
    land: 42,
    x: 1180,
    y: 400,
    rotation: -2,
    width: 600,
    height: 100,
    fromDx: 1400,
    fromDy: -700,
    driftFactor: 1.05,
  },
  // 3) WhatsApp boiler | start 48, land 58
  {
    id: "wa-leaking",
    variant: "whatsapp",
    sender: "Dave (boiler job)",
    body: "boiler still leaking mate",
    start: 48,
    land: 58,
    x: 740,
    y: 600,
    rotation: 3,
    width: 460,
    height: 110,
    fromDx: -1500,
    fromDy: 0,
    driftFactor: 0.95,
  },
  // 4) HMRC email | start 56, land 66
  {
    id: "hmrc",
    variant: "email",
    sender: "HMRC",
    body: "VAT return due in 3 days. File now to avoid penalty.",
    start: 56,
    land: 66,
    x: 1100,
    y: 720,
    rotation: -1,
    width: 540,
    height: 160,
    fromDx: 1500,
    fromDy: 700,
    driftFactor: 1.08,
  },
  // 5) Calendar pop | start 64, land 74
  {
    id: "calendar",
    variant: "calendar",
    sender: "Calendar",
    body: "Job at 8AM — Hammersmith",
    start: 64,
    land: 74,
    x: 920,
    y: 380,
    rotation: 2,
    width: 460,
    height: 120,
    fromDx: 0,
    fromDy: -1100,
    driftFactor: 1.1,
  },
  // 6) Stripe overdue | start 72, land 82
  {
    id: "stripe",
    variant: "stripe",
    sender: "Stripe",
    body: "Invoice #0421 overdue — 47 days",
    start: 72,
    land: 82,
    x: 1020,
    y: 480,
    rotation: 1,
    width: 480,
    height: 120,
    fromDx: 100,
    fromDy: -1000,
    driftFactor: 0.9,
  },
  // 7) Google review | start 80, land 90
  {
    id: "google",
    variant: "google",
    sender: "Google Business",
    body: "New 1-star review — respond?",
    start: 80,
    land: 90,
    x: 1180,
    y: 540,
    rotation: -2,
    width: 480,
    height: 130,
    fromDx: 1300,
    fromDy: 100,
    driftFactor: 1.02,
  },
  // 8) iMessage cheaper | start 88, land 98
  {
    id: "imessage-cheaper",
    variant: "imessage",
    sender: "Tom",
    body: "can u do it cheaper?",
    start: 88,
    land: 98,
    x: 820,
    y: 700,
    rotation: 3,
    width: 460,
    height: 110,
    fromDx: -200,
    fromDy: 1000,
    driftFactor: 0.97,
  },
  // 9) Screwfix email | start 96, land 106
  {
    id: "screwfix",
    variant: "screwfix",
    sender: "Screwfix",
    body: "Your parts order has shipped",
    start: 96,
    land: 106,
    x: 980,
    y: 360,
    rotation: -1,
    width: 480,
    height: 130,
    fromDx: 1200,
    fromDy: -900,
    driftFactor: 1.06,
  },
  // 10) Voicemail | start 104, land 114
  {
    id: "voicemail",
    variant: "voicemail",
    sender: "Voicemail",
    body: "You have 4 new messages",
    start: 104,
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
  // 11) Banking alert | start 112, land 122
  {
    id: "banking",
    variant: "banking",
    sender: "Lloyds Bank",
    body: "Direct debit failed",
    start: 112,
    land: 122,
    x: 1140,
    y: 660,
    rotation: -3,
    width: 480,
    height: 120,
    fromDx: 1300,
    fromDy: 200,
    driftFactor: 1.04,
  },
  // 12) Quote follow-up | start 120, land 130
  {
    id: "followup",
    variant: "generic",
    sender: "Reminder",
    body: "Quote follow-up?",
    start: 120,
    land: 130,
    x: 940,
    y: 580,
    rotation: 1,
    width: 460,
    height: 110,
    fromDx: 0,
    fromDy: 1000,
    driftFactor: 0.99,
  },
  // === v1.40 density-build (replaces 2026-05-07 user-override cards) ===
  // 6 NEW cards landing F128–F153 at 5f intervals (denser than original 6f).
  // Land BEHIND typing animation (HookText already at zIndex 100).
  // 13) Card payment | start 118, land 128
  {
    id: "card-payment",
    variant: "banking",
    sender: "Lloyds Bank",
    body: "Card payment £147.32 — Wickes",
    start: 118,
    land: 128,
    x: 700,
    y: 380,
    rotation: -2,
    width: 480,
    height: 120,
    fromDx: -1400,
    fromDy: -700,
    driftFactor: 1.07,
  },
  // 14) "did u get my message?" iMessage | start 123, land 133
  {
    id: "did-u-get-msg",
    variant: "imessage",
    sender: "Becca",
    body: "did u get my message?",
    start: 123,
    land: 133,
    x: 1240,
    y: 640,
    rotation: 2,
    width: 460,
    height: 110,
    fromDx: 1500,
    fromDy: 600,
    driftFactor: 0.94,
  },
  // 15) Mr. Harrison voicemail | start 128, land 138
  {
    id: "harrison-vm",
    variant: "voicemail",
    sender: "Voicemail",
    body: "Mr. Harrison urgent — call back",
    start: 128,
    land: 138,
    x: 820,
    y: 420,
    rotation: 3,
    width: 500,
    height: 120,
    fromDx: -1300,
    fromDy: -800,
    driftFactor: 1.03,
  },
  // 16) Public liability renewal email | start 133, land 143
  {
    id: "liability-email",
    variant: "email",
    sender: "Hiscox Business",
    body: "Public liability renewal — £487 due",
    start: 133,
    land: 143,
    x: 1080,
    y: 760,
    rotation: -3,
    width: 540,
    height: 150,
    fromDx: 1300,
    fromDy: 900,
    driftFactor: 1.05,
  },
  // 17) Mrs. Patel chasing — visual rhyme with hero card | start 138, land 148
  {
    id: "patel-chasing",
    variant: "imessage",
    sender: "Mrs. Patel",
    body: "any update on the quote?",
    start: 138,
    land: 148,
    x: 700,
    y: 700,
    rotation: 1,
    width: 460,
    height: 110,
    fromDx: -1300,
    fromDy: 800,
    driftFactor: 0.98,
  },
  // 18) Gas safety cert calendar | start 143, land 153
  {
    id: "gas-safety",
    variant: "calendar",
    sender: "Calendar",
    body: "Gas safety cert — tomorrow 8am",
    start: 143,
    land: 153,
    x: 1080,
    y: 460,
    rotation: -1,
    width: 480,
    height: 120,
    fromDx: 1400,
    fromDy: -300,
    driftFactor: 1.0,
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
  // === v1.40 density-build cards 13–18 (5f intervals)
  // v1.42 pitch curve: ASCENDING semitones (-1 → +5) so the climax has
  // rising tension to match the volume ramp. Each successive ding is
  // slightly higher, building anxiety into the typed hook. ===
  { cardIdx: 13, file: SFX.notification1, pitch: -1 },
  { cardIdx: 14, file: SFX.notification2, pitch: 0 },
  { cardIdx: 15, file: SFX.notification1, pitch: 2 },
  { cardIdx: 16, file: SFX.notification2, pitch: 3 },
  { cardIdx: 17, file: SFX.notification1, pitch: 4 },
  { cardIdx: 18, file: SFX.notification2, pitch: 5 },
];

// === scene phase frames (v1.42 — user direction: typing onset moved to F162) ===
// v1.40 density-build cards 13–18 land F128–F153, last card lands F153.
// Sediment drift REMOVED (cards stay frozen). Typing starts F162.
//   • Cursor onset: F154 (8f onset, right after last card lands)
//   • "Feeling" — 7 chars at 2 fpc: F162–F174
//   • Pause: 6 frames F174–F180
//   • " overwhelmed?" — 13 chars at ~1.67 fpc: F180–F200
//   • "?" scale-pulse: F200–F204
//   • Held silence: F204–F240 (cursor blinks; cards frozen)
const HERO_HOLD_START = 24;
const HERO_HOLD_END = 42;
const CURSOR_APPEAR = 154;
const TYPE_START = 162;
const HOOK_START = 154; // hook beat begins with cursor (drift removed)
const HOOK_END = 200; // typing complete (full text visible)
const FREEZE_START = 204; // held-silence begins (drift removed; this just bounds the "?" pulse)
const QUESTION_MARK_FRAME = 200; // "?" lands; pulse F200–F204
const TYPING_TEXT = "Feeling overwhelmed?";
const SCENE_END = 240;

// Per-character land frame for the v1.42 schedule.
// chars 0–6  ("Feeling")        → F162 + i*2  →  162, 164, 166, 168, 170, 172, 174
// pause F174–F180 (6f hold)
// chars 7–19 (" overwhelmed?")  → F180 + (i-7)*(20/12) rounded → ends F200
function charLandFrame(i: number): number {
  if (i < 0) return -1;
  if (i <= 6) return TYPE_START + i * 2;
  if (i >= TYPING_TEXT.length) return -1;
  return Math.round(180 + (i - 7) * (20 / 12));
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

      {/* === AUDIO === user-stripped: only message dings + typewriter clicks remain */}

      {/* Per-card dings — all fire at landFrame - 2.
          v1.42 volume curve (climactic ramp, replaces fade-out):
          • Hero ping (1) loudest at 0.85
          • Stack cards 2-4 sit at 0.78
          • Density middle 5-12 dip to ~0.5 (pulls back to give room)
          • Density-build climax 13-18 RAMP UP 0.55 → 0.92 so the chaos
            audibly peaks right before "Feeling overwhelmed?" types in. */}
      {DINGS.map((d) => {
        const card = CARDS[d.cardIdx - 1];
        const dingFrame = card.land - 2;
        let volume: number;
        if (d.cardIdx === 1) {
          volume = 0.85;
        } else if (d.cardIdx <= 4) {
          volume = 0.78;
        } else if (d.cardIdx <= 12) {
          volume = 0.62 - (d.cardIdx - 5) * 0.025; // 0.62 → 0.45 across 5–12
        } else {
          // Climactic ramp across cards 13–18: 0.55 → 0.92
          volume = 0.55 + (d.cardIdx - 13) * 0.074;
        }
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
  // v1.6 polish: switched from EASE.outCubic (slow-at-end → floaty) to
  // EASE.outExpo per user direction — crisp front-loaded entry, no
  // lingering deceleration. Cards now "punch in" with the spring bump
  // providing the satisfying landing snap.
  const travelP = interpolate(t, [0, travel], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outExpo,
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

  // v1.42 sediment drift REMOVED again — combined with backdrop-filter:none
  // on the notification cards (NotificationCard.tsx), this eliminates ALL
  // motion + BG-recompute at F153. Cards land, lock, and stay locked. The
  // "weight of overwhelm" emotional beat now comes from card density +
  // audio crescendo (climactic ding ramp on cards 13–18) rather than
  // post-landing drift.
  const drift = 0;
  const driftOpacity = 1;

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
// HOOK TEXT — slowed typed reveal (user override 2026-05-07)
// Cursor appears at F184 (8f onset), typing starts F192, 6-frame pause after
// "Feeling" at F204–F210, "?" lands F230, scale-pulse F230–F234, cursor blinks
// through held silence F234–F240.
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

  // Hook text rides the Scene 2 swipe-up wipe out of frame.
  // Scene 2 wrapper starts at absolute F220; its local swipe window F12→F20
  // = absolute F232→F240. Match the veil's translateY (0 → -1080) and easing.
  const swipeOutY = interpolate(frame, [232, 240], [0, -1080], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOutQuad,
  });

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
          transform: `translateY(${swipeOutY}px)`,
          willChange: "transform",
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
