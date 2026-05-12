import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLOR, EASE, SPRING } from "../tokens";
import { GEN, SFX } from "../audio";
import { PhoneFrame } from "../components/PhoneFrame";
import { SfxAt } from "../components/SfxAt";

// =====================================================================
// SCENE 4 — Voice-to-Quote walkthrough · Part 2 (v1.8, frames 761–866)
// 105 frames @ 30fps · 3.5s · HERO
//
// User direction 2026-05-12: continue the walkthrough — the AI turns
// the spoken words into a structured quote, then sends it.
//
// Beats (local frames):
//   F0–F12   AI scan-sweep across transcription (purple line travels)
//   F12–F34  Keywords lift off and magnetize toward quote-card fields
//   F18–F60  Quote card materializes; fields populate in stagger
//   F60–F82  TOTAL row: count-up £0 → £280 + glow pulse
//   F82–F105 "Send via" CTA row reveals; camera pulls back to wider 3/4
//
// Quote card maps to real Kiva QuoteReview screen (line items table).
// =====================================================================

const SCAN_END = 12;
const MAGNETIZE_START = 12;
const MAGNETIZE_END = 34;
const CARD_REVEAL_START = 18;
const FIELDS_DONE = 60;
const TOTAL_START = 60;
const TOTAL_END = 82;
const SEND_START = 82;
const SCENE_END = 105;

// Quote line items
const LINE_ITEMS = [
  { item: "Labour — bathroom leak repair", qty: 4, unit: "hr", price: 45, total: 180 },
  { item: "Replacement valve + sealant", qty: 1, unit: "ea", price: 100, total: 100 },
];
const QUOTE_TOTAL = 280;

export const Scene4Expense: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Camera: continues from Scene 3's dolly-in (1.08, near 0°),
  // tightens during materialize, pulls back wider for CTA reveal.
  const cameraScale = interpolate(
    frame,
    [0, 18, 60, 82, SCENE_END],
    [1.08, 1.14, 1.14, 1.0, 0.92],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOutQuad }
  );
  const cameraRotY = interpolate(
    frame,
    [0, 60, SCENE_END],
    [-2, -1, -6],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOutQuad }
  );
  const cameraRotX = interpolate(frame, [0, 60, SCENE_END], [1.5, 0.5, 3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOutQuad,
  });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <PhoneFrame rotateY={cameraRotY} rotateX={cameraRotX} scale={cameraScale}>
        <ProcessingScreen frame={frame} fps={fps} />
      </PhoneFrame>

      {/* SFX */}
      <SfxAt src={GEN.scanSweep} from={0} volume={0.45} />
      <SfxAt src={GEN.sparkleMatch} from={MAGNETIZE_END - 4} volume={0.55} />
      <SfxAt src={GEN.counterRoll} from={TOTAL_START} volume={0.5} />
      <SfxAt
        src={SFX.notification1}
        from={TOTAL_END - 2}
        volume={0.45}
        playbackRate={Math.pow(2, 4 / 12)}
      />
    </AbsoluteFill>
  );
};

// =====================================================================
// PROCESSING SCREEN — transcription → magnetize → quote card
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
      {/* Status-bar gutter */}
      <div style={{ paddingTop: 56 }} />

      {/* Top nav */}
      <div
        style={{
          padding: "8px 16px 0",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div style={{ fontSize: 18, color: COLOR.navy, fontWeight: 700 }}>←</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: COLOR.navy }}>
          New Quote
        </div>
      </div>

      {/* Step pill — flips Step 1 → Step 2 */}
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
          ✦ {frame < MAGNETIZE_START ? "Step 1 — Analysing" : "Step 2 — Quote ready"}
        </div>
      </div>

      {/* Transcription card (top half) — fades out as quote card grows */}
      {frame < FIELDS_DONE + 4 && (
        <TranscriptionFading frame={frame} />
      )}

      {/* Quote card (lower half / takes over) */}
      {frame >= CARD_REVEAL_START && (
        <QuoteCard frame={frame - CARD_REVEAL_START} fps={fps} />
      )}

      {/* Magnetize particles */}
      {frame >= MAGNETIZE_START && frame < MAGNETIZE_END + 4 && (
        <MagnetizeParticles frame={frame - MAGNETIZE_START} />
      )}

      {/* Send-via row at bottom */}
      {frame >= SEND_START && <SendVia frame={frame - SEND_START} />}
    </div>
  );
};

// =====================================================================
// TRANSCRIPTION FADING — same card from Scene 3, with scan-sweep then dim
// =====================================================================
const TranscriptionFading: React.FC<{ frame: number }> = ({ frame }) => {
  // Scan-sweep: a purple gradient bar travels left → right across the text
  const sweepP = interpolate(frame, [0, SCAN_END], [-0.2, 1.1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOutQuad,
  });
  // Fade after magnetize
  const fadeOut = interpolate(frame, [MAGNETIZE_START + 6, FIELDS_DONE], [1, 0.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Shrink slightly as it gets "consumed"
  const shrink = interpolate(frame, [MAGNETIZE_START, FIELDS_DONE], [1, 0.85], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });

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
        boxShadow: "0 6px 18px rgba(15,23,42,0.10)",
        opacity: fadeOut,
        transform: `scale(${shrink})`,
        transformOrigin: "top center",
        overflow: "hidden",
      }}
    >
      {/* Scan beam */}
      {frame < MAGNETIZE_START && (
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${sweepP * 100}%`,
            width: 60,
            background:
              "linear-gradient(90deg, transparent 0%, rgba(109,40,217,0.35) 50%, transparent 100%)",
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
      <div style={{ fontSize: 13, color: COLOR.navy, lineHeight: 1.5, fontWeight: 500 }}>
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
      color: on ? COLOR.sentText : COLOR.textTer,
      fontWeight: 800,
      background: on ? COLOR.sentBg : "transparent",
      padding: "1px 6px",
      borderRadius: 5,
      transition: "all 120ms ease-out",
    }}
  >
    {children}
  </span>
);

// =====================================================================
// MAGNETIZE PARTICLES — 4 keyword tokens fly from transcript → quote card
// =====================================================================
const MagnetizeParticles: React.FC<{ frame: number }> = ({ frame }) => {
  const span = MAGNETIZE_END - MAGNETIZE_START;
  const particles = [
    // Approx start (in transcript card area) → end (in quote card area)
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
        // Arc with slight y-bow
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
// QUOTE CARD — Kiva-style: customer, line items table, total, badges
// =====================================================================
const QuoteCard: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  // Card frame fades up
  const cardEnter = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  // Customer row populates first
  const custEnter = interpolate(frame, [10, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  // Line items populate in stagger
  const itemEnters = LINE_ITEMS.map((_, i) =>
    interpolate(frame, [16 + i * 8, 28 + i * 8], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE.outCubic,
    })
  );
  // Total counts up
  const totalLocal = frame - (TOTAL_START - CARD_REVEAL_START);
  const totalP = interpolate(totalLocal, [0, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  const totalDisplay = Math.round(QUOTE_TOTAL * totalP);
  // Glow on total when locked
  const glowSp = spring({
    frame: totalLocal - 22,
    fps,
    config: SPRING.bouncy,
    durationInFrames: 14,
  });
  const totalScale = 1 + 0.12 * Math.max(0, Math.min(1, glowSp));

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
        {/* AI generated badge */}
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
              background: COLOR.sentBg,
              color: COLOR.sentText,
              padding: "2px 6px",
              borderRadius: 4,
              fontSize: 9,
              fontWeight: 800,
            }}
          >
            DRAFT
          </span>
        </div>

        {/* Customer row */}
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
          <div style={{ fontSize: 9, fontWeight: 600, color: COLOR.textTer, textTransform: "uppercase", letterSpacing: 0.5 }}>
            Customer
          </div>
          <div style={{ fontSize: 15, fontWeight: 800, color: COLOR.navy, marginTop: 2 }}>
            John Smith
          </div>
          <div style={{ fontSize: 11, color: COLOR.textSec, fontWeight: 500 }}>
            Bathroom leak repair · 17 Pinewood Rd
          </div>
        </div>

        {/* Line items table */}
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
                £{item.price}
              </div>
              <div style={{ textAlign: "right", fontWeight: 800 }}>£{item.total}</div>
            </div>
          ))}
        </div>

        {/* Total row */}
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
          <span style={{ fontSize: 13, fontWeight: 800, color: COLOR.navy, letterSpacing: 0.5 }}>
            TOTAL
          </span>
          <span
            style={{
              fontSize: 30,
              fontWeight: 900,
              color: COLOR.navy,
              letterSpacing: -0.5,
              display: "inline-block",
              transform: `scale(${totalScale})`,
              transformOrigin: "right center",
              textShadow:
                totalLocal >= 18
                  ? `0 0 22px rgba(59,130,246,0.55), 0 0 8px rgba(59,130,246,0.35)`
                  : "none",
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
// SEND VIA — three send buttons (WhatsApp / SMS / Email)
// =====================================================================
const SendVia: React.FC<{ frame: number }> = ({ frame }) => {
  const enter = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  const options = [
    { label: "WhatsApp", color: COLOR.whatsapp, glyph: "💬" },
    { label: "SMS", color: COLOR.blue, glyph: "✉" },
    { label: "Email", color: COLOR.navy, glyph: "@" },
  ];
  return (
    <div
      style={{
        position: "absolute",
        left: 14,
        right: 14,
        bottom: 60,
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [14, 0])}px)`,
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: COLOR.textTer,
          textTransform: "uppercase",
          letterSpacing: 0.6,
          marginBottom: 6,
        }}
      >
        Send via
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {options.map((o, i) => {
          const delay = i * 3;
          const e = interpolate(frame, [delay, delay + 10], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: EASE.outCubic,
          });
          return (
            <div
              key={o.label}
              style={{
                flex: 1,
                background: o.color,
                color: "#fff",
                fontSize: 12,
                fontWeight: 700,
                padding: "10px 0",
                borderRadius: 10,
                textAlign: "center",
                boxShadow: `0 4px 12px ${o.color}66`,
                opacity: e,
                transform: `translateY(${interpolate(e, [0, 1], [10, 0])}px)`,
              }}
            >
              <span style={{ marginRight: 4 }}>{o.glyph}</span>
              {o.label}
            </div>
          );
        })}
      </div>
    </div>
  );
};

