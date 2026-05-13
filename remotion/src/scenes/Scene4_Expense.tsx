import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLOR, EASE, SPRING, TYPE } from "../tokens";
import { GEN, SFX } from "../audio";
import { PhoneFrame } from "../components/PhoneFrame";
import { SfxAt } from "../components/SfxAt";

// =====================================================================
// SCENE 4 — Voice-to-Quote walkthrough · Part 2 (v1.9 PREMIUM, 761–866)
// 105 frames @ 30fps · 3.5s · HERO MOMENT
//
// v1.9 premium pass — phone stays small in a generous void, magnetize
// is restrained, and the £280 BREAKS OUT of the card to become a
// full-frame hero stat that fills the screen and holds. Launch-teaser
// vibe — not a tutorial.
//
// Beats (local frames):
//   F0–F14   Scan sweep across transcript
//   F14–F36  Keyword chips magnetize into quote-card fields
//   F20–F46  Quote card materializes
//   F46–F66  TOTAL counts £0 → £280 inside card
//   F58–F86  HERO BREAKOUT: £280 lifts out of phone, fills frame
//   F86–F105 HERO HOLD with "in 6 seconds." subtitle
// =====================================================================

const SCAN_END = 14;
const MAGNETIZE_START = 14;
const MAGNETIZE_END = 36;
const CARD_REVEAL_START = 20;
const FIELDS_DONE = 46;
const TOTAL_START = 46;
const TOTAL_END = 66;
const HERO_START = 58;
const HERO_PEAK = 78;
const HERO_HOLD_END = 100;
const SCENE_END = 105;

const LINE_ITEMS = [
  { item: "Labour — bathroom leak", qty: 4, unit: 45, total: 180 },
  { item: "Replacement valve + sealant", qty: 1, unit: 100, total: 100 },
];
const QUOTE_TOTAL = 280;

export const Scene4Expense: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phone holds small, then recedes during hero breakout
  const phoneScale = interpolate(
    frame,
    [0, 20, HERO_START, HERO_PEAK, HERO_HOLD_END, SCENE_END],
    [0.66, 0.68, 0.7, 0.5, 0.5, 0.46],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOutQuad }
  );
  const phoneRotY = interpolate(
    frame,
    [0, HERO_START, HERO_PEAK, SCENE_END],
    [-3, -2, -6, -8],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOutQuad }
  );
  const phoneRotX = interpolate(frame, [0, SCENE_END], [2, 3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOutQuad,
  });
  // Phone fades behind hero number
  const phoneOpacity = interpolate(
    frame,
    [HERO_PEAK - 6, HERO_PEAK + 4],
    [1, 0.18],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.outCubic }
  );
  // Phone subtly drops back during hero
  const phoneY = interpolate(
    frame,
    [HERO_START, HERO_PEAK],
    [0, 30],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.outCubic }
  );

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <Vignette />

      <div style={{ opacity: phoneOpacity }}>
        <PhoneFrame
          rotateY={phoneRotY}
          rotateX={phoneRotX}
          translateY={phoneY}
          scale={phoneScale}
        >
          <ProcessingScreen frame={frame} fps={fps} />
        </PhoneFrame>
      </div>

      {/* HERO £280 — breaks out and fills frame */}
      {frame >= HERO_START && <Hero280 frame={frame} fps={fps} />}

      {/* SFX */}
      <SfxAt src={GEN.scanSweep} from={0} volume={0.42} />
      <SfxAt src={GEN.sparkleMatch} from={MAGNETIZE_END - 4} volume={0.5} />
      <SfxAt src={GEN.counterRoll} from={TOTAL_START} volume={0.45} />
      <SfxAt
        src={GEN.achievement}
        from={HERO_PEAK - 4}
        volume={0.55}
      />
    </AbsoluteFill>
  );
};

// =====================================================================
// VIGNETTE
// =====================================================================
const Vignette: React.FC = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background:
        "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 100%)",
      pointerEvents: "none",
      zIndex: 1,
    }}
  />
);

// =====================================================================
// PROCESSING SCREEN — transcription fading → quote card materializes
// =====================================================================
const ProcessingScreen: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: COLOR.bg,
        position: "relative",
        fontFamily: "Inter, system-ui",
        overflow: "hidden",
      }}
    >
      <div style={{ paddingTop: 56 }} />

      <div
        style={{
          padding: "8px 16px 0",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div style={{ fontSize: 18, color: COLOR.textTer, fontWeight: 600 }}>
          ←
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: COLOR.navy }}>
          New Quote
        </div>
      </div>

      <div style={{ padding: "12px 16px 0" }}>
        <div
          style={{
            display: "inline-block",
            background: COLOR.aiPurpleBg,
            color: COLOR.aiPurple,
            fontSize: 10,
            fontWeight: 700,
            padding: "4px 10px",
            borderRadius: 999,
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          ✦ {frame < MAGNETIZE_START ? "Analysing" : "Quote ready"}
        </div>
      </div>

      {frame < FIELDS_DONE + 4 && <TranscriptionFading frame={frame} />}

      {frame >= CARD_REVEAL_START && (
        <QuoteCard frame={frame - CARD_REVEAL_START} fps={fps} />
      )}

      {frame >= MAGNETIZE_START && frame < MAGNETIZE_END + 4 && (
        <MagnetizeParticles frame={frame - MAGNETIZE_START} />
      )}
    </div>
  );
};

const TranscriptionFading: React.FC<{ frame: number }> = ({ frame }) => {
  const sweepP = interpolate(frame, [0, SCAN_END], [-0.2, 1.1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOutQuad,
  });
  const fadeOut = interpolate(
    frame,
    [MAGNETIZE_START + 6, FIELDS_DONE],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const shrink = interpolate(
    frame,
    [MAGNETIZE_START, FIELDS_DONE],
    [1, 0.86],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.outCubic }
  );

  return (
    <div
      style={{
        position: "absolute",
        left: 14,
        right: 14,
        top: 110,
        background: COLOR.surface,
        border: `1px solid ${COLOR.border}`,
        borderRadius: 14,
        padding: "12px 14px",
        boxShadow: "0 6px 18px rgba(15,23,42,0.08)",
        opacity: fadeOut,
        transform: `scale(${shrink})`,
        transformOrigin: "top center",
        overflow: "hidden",
      }}
    >
      {frame < MAGNETIZE_START && (
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${sweepP * 100}%`,
            width: 70,
            background:
              "linear-gradient(90deg, transparent 0%, rgba(109,40,217,0.45) 50%, transparent 100%)",
            pointerEvents: "none",
            mixBlendMode: "screen",
          }}
        />
      )}
      <div
        style={{
          fontSize: 9,
          fontWeight: 700,
          color: COLOR.aiPurple,
          textTransform: "uppercase",
          letterSpacing: 0.6,
          marginBottom: 6,
        }}
      >
        ✦ Voice note · 6s
      </div>
      <div
        style={{
          fontSize: 13,
          color: COLOR.navy,
          lineHeight: 1.5,
          fontWeight: 500,
        }}
      >
        Quote for{" "}
        <KeywordChip on={frame < MAGNETIZE_END}>John Smith</KeywordChip> —{" "}
        <KeywordChip on={frame < MAGNETIZE_END}>bathroom leak</KeywordChip> —{" "}
        <KeywordChip on={frame < MAGNETIZE_END}>£180</KeywordChip> labour +{" "}
        <KeywordChip on={frame < MAGNETIZE_END}>£100</KeywordChip> materials.
      </div>
    </div>
  );
};

const KeywordChip: React.FC<{ on: boolean; children: React.ReactNode }> = ({
  on,
  children,
}) => (
  <span
    style={{
      color: on ? COLOR.navy : COLOR.textTer,
      fontWeight: 800,
      background: on ? COLOR.sentBg : "transparent",
      padding: "1px 6px",
      borderRadius: 5,
    }}
  >
    {children}
  </span>
);

const MagnetizeParticles: React.FC<{ frame: number }> = ({ frame }) => {
  const span = MAGNETIZE_END - MAGNETIZE_START;
  const particles = [
    { label: "John Smith", sx: 80, sy: 175, ex: 200, ey: 380, delay: 0 },
    { label: "bathroom leak", sx: 230, sy: 175, ex: 200, ey: 420, delay: 3 },
    { label: "£180", sx: 95, sy: 195, ex: 320, ey: 480, delay: 6 },
    { label: "£100", sx: 230, sy: 195, ex: 320, ey: 520, delay: 9 },
  ];
  return (
    <>
      {particles.map((p, i) => {
        const local = frame - p.delay;
        if (local < 0 || local > span) return null;
        const t = interpolate(local, [0, span - p.delay], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE.inOutQuad,
        });
        const x = p.sx + (p.ex - p.sx) * t;
        const yLinear = p.sy + (p.ey - p.sy) * t;
        const arc = -40 * Math.sin(t * Math.PI);
        const y = yLinear + arc;
        const scale = interpolate(t, [0, 0.6, 1], [1, 1.1, 0.6]);
        const opacity = interpolate(t, [0, 0.85, 1], [0.95, 0.95, 0]);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              transform: `translate(-50%, -50%) scale(${scale})`,
              fontSize: 12,
              fontWeight: 800,
              color: "#fff",
              background: COLOR.aiPurple,
              padding: "3px 8px",
              borderRadius: 6,
              boxShadow: "0 4px 12px rgba(109,40,217,0.5)",
              opacity,
              pointerEvents: "none",
              zIndex: 30,
              whiteSpace: "nowrap",
            }}
          >
            {p.label}
          </div>
        );
      })}
    </>
  );
};

// =====================================================================
// QUOTE CARD — same content as before, but the £280 will lift out as hero
// =====================================================================
const QuoteCard: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const cardEnter = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  const custEnter = interpolate(frame, [10, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  const itemEnters = LINE_ITEMS.map((_, i) =>
    interpolate(frame, [16 + i * 8, 28 + i * 8], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE.outCubic,
    })
  );
  const totalLocal = frame - (TOTAL_START - CARD_REVEAL_START);
  const totalP = interpolate(totalLocal, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  const totalDisplay = Math.round(QUOTE_TOTAL * totalP);
  // Hide in-card £280 once hero breakout begins
  const inCardOpacity = interpolate(
    frame,
    [HERO_START - CARD_REVEAL_START, HERO_START - CARD_REVEAL_START + 6],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  void fps;

  return (
    <div
      style={{
        position: "absolute",
        left: 14,
        right: 14,
        top: 180,
        opacity: cardEnter,
        transform: `translateY(${interpolate(cardEnter, [0, 1], [22, 0])}px)`,
      }}
    >
      <div
        style={{
          background: COLOR.surface,
          border: `1px solid ${COLOR.border}`,
          borderRadius: 14,
          padding: 14,
          boxShadow: "0 8px 24px rgba(15,23,42,0.10)",
        }}
      >
        <div
          style={{
            fontSize: 9,
            fontWeight: 700,
            color: COLOR.aiPurple,
            textTransform: "uppercase",
            letterSpacing: 0.6,
            marginBottom: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span>✦ AI-generated quote</span>
          <span
            style={{
              background: COLOR.divider,
              color: COLOR.textSec,
              padding: "2px 6px",
              borderRadius: 4,
              fontSize: 9,
              fontWeight: 800,
            }}
          >
            DRAFT
          </span>
        </div>

        <div
          style={{
            background: COLOR.divider,
            borderRadius: 10,
            padding: "10px 12px",
            opacity: custEnter,
            transform: `translateX(${interpolate(custEnter, [0, 1], [-10, 0])}px)`,
            marginBottom: 10,
          }}
        >
          <div
            style={{
              fontSize: 9,
              fontWeight: 600,
              color: COLOR.textTer,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Customer
          </div>
          <div
            style={{
              fontSize: 15,
              fontWeight: 800,
              color: COLOR.navy,
              marginTop: 2,
            }}
          >
            John Smith
          </div>
          <div style={{ fontSize: 11, color: COLOR.textSec, fontWeight: 500 }}>
            Bathroom leak repair · 17 Pinewood Rd
          </div>
        </div>

        <div style={{ marginBottom: 6 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 28px 38px 50px",
              fontSize: 8,
              fontWeight: 700,
              color: COLOR.textTer,
              textTransform: "uppercase",
              letterSpacing: 0.5,
              paddingBottom: 4,
              borderBottom: `1px solid ${COLOR.divider}`,
            }}
          >
            <div>Item</div>
            <div style={{ textAlign: "right" }}>Qty</div>
            <div style={{ textAlign: "right" }}>Unit</div>
            <div style={{ textAlign: "right" }}>Total</div>
          </div>
          {LINE_ITEMS.map((item, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 28px 38px 50px",
                fontSize: 11,
                fontWeight: 600,
                color: COLOR.navy,
                padding: "8px 0",
                borderBottom: `1px solid ${COLOR.divider}`,
                opacity: itemEnters[i],
                transform: `translateX(${interpolate(itemEnters[i], [0, 1], [-10, 0])}px)`,
                alignItems: "center",
              }}
            >
              <div style={{ paddingRight: 4 }}>{item.item}</div>
              <div style={{ textAlign: "right" }}>{item.qty}</div>
              <div style={{ textAlign: "right", color: COLOR.textSec }}>
                £{item.unit}
              </div>
              <div style={{ textAlign: "right", fontWeight: 800 }}>£{item.total}</div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 10,
            paddingTop: 10,
            borderTop: `2px solid ${COLOR.navy}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 800,
              color: COLOR.navy,
              letterSpacing: 0.5,
            }}
          >
            TOTAL
          </span>
          <span
            style={{
              fontSize: 30,
              fontWeight: 900,
              color: COLOR.navy,
              letterSpacing: -0.5,
              opacity: inCardOpacity,
            }}
          >
            £{totalDisplay}
          </span>
        </div>
      </div>
    </div>
  );
};

// =====================================================================
// HERO 280 — full-frame stat that breaks out of the phone
// =====================================================================
const Hero280: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  // Three phases: rise out of phone (HERO_START → HERO_PEAK),
  // hold at apex (HERO_PEAK → HERO_HOLD_END), gentle outro
  const rise = interpolate(frame, [HERO_START, HERO_PEAK], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outExpo,
  });

  // Start position: roughly inside the phone where the TOTAL row sits
  // (phone center is canvas-centered, scale ~0.7 ⇒ visible 593 tall;
  // total row is around y=425 in phone coords from top, so ~283 from center).
  // 283 * 0.7 (PHONE.scale 1.18 * scale 0.7) — actually let's just hand-tune.
  const startX = 0;
  const startY = 200; // below center, inside phone
  const startScale = 0.13; // matches in-card £280 size

  // End: dead center, massive
  const endX = 0;
  const endY = 0;
  const endScale = 1.0;

  const x = startX + (endX - startX) * rise;
  const y = startY + (endY - startY) * rise;
  const scale = startScale + (endScale - startScale) * rise;
  const opacity = interpolate(frame, [HERO_START, HERO_START + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Outro
  const outroOpacity = interpolate(
    frame,
    [HERO_HOLD_END, SCENE_END],
    [1, 0.85],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Count-up: by the time hero begins, the in-card count was completing
  // around F66. We continue counting through to F78 to land on £280 with
  // the hero punch landing on the same beat.
  const countLocal = frame - HERO_START;
  const countP = interpolate(countLocal, [0, HERO_PEAK - HERO_START - 4], [0.7, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  const display = Math.round(QUOTE_TOTAL * countP);

  // Punch on landing
  const punch = spring({
    frame: frame - HERO_PEAK,
    fps,
    config: SPRING.bouncy,
    durationInFrames: 18,
  });
  const punchScale = 1 + 0.04 * Math.max(0, Math.min(1, punch));

  // Subtitle reveals after the punch
  const sub = interpolate(
    frame,
    [HERO_PEAK + 4, HERO_PEAK + 16],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.outCubic }
  );
  const subOut = interpolate(
    frame,
    [HERO_HOLD_END - 4, SCENE_END],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none",
        zIndex: 25,
      }}
    >
      <div
        style={{
          opacity: opacity * outroOpacity,
          transform: `translate(${x}px, ${y}px) scale(${scale * punchScale})`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "Inter, system-ui",
            fontSize: 280,
            fontWeight: 900,
            color: "#fff",
            letterSpacing: -10,
            lineHeight: 0.9,
            textShadow:
              "0 0 60px rgba(59,130,246,0.55), 0 0 24px rgba(255,255,255,0.25), 0 8px 40px rgba(0,0,0,0.55)",
          }}
        >
          £{display}
        </div>
        <div
          style={{
            marginTop: 16,
            fontFamily: "Inter, system-ui",
            fontSize: TYPE.tagline.size,
            fontWeight: 500,
            color: "rgba(255,255,255,0.78)",
            letterSpacing: 0.4,
            opacity: sub * subOut,
            transform: `translateY(${interpolate(sub, [0, 1], [8, 0])}px)`,
          }}
        >
          Quote ready in{" "}
          <span style={{ color: "#fff", fontWeight: 700 }}>6 seconds.</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
