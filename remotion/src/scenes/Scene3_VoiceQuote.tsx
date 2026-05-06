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
import { PhoneFrame } from "../components/PhoneFrame";
import { MicButton } from "../components/MicButton";
import { AISparkleLoader } from "../components/AISparkleLoader";
import { Thumb } from "../components/Thumb";
import { SfxAt } from "../components/SfxAt";
import { popInProgress } from "../motion";

// =====================================================================
// SCENE 3 — AI Voice-to-Quote HERO (frames 312–462 = local 0–150)
// Real VoiceQuote/index.js + QuoteReview/index.js anatomy.
// v1.3 LOCKED: white-flash pattern interrupt at frames 110–114 + audio cut.
// Adds 1.0→1.10 push-in zoom on the £2,454.60 total stamp — the money shot.
// =====================================================================

const NEW_QUOTE_START = 0;
const MIC_BIG = 12;
const TRANSCRIBE = 30;
const GENERATING = 48;
const REVIEW_START = 66;
const SUBTOTAL_START = 96;
const WHITE_FLASH = 110;
const TOTAL_STAMP = 114;
const SEND_TAP = 120;
const TOAST_IN = 132;

const LINE_ITEMS = [
  { name: "32mm & 40mm Waste Pipe & Fittings", qty: 1, price: 45.0 },
  { name: "Bath Waste & Overflow", qty: 1, price: 25.0 },
  { name: "Basin Waste & Trap", qty: 1, price: 20.0 },
  { name: "WC Pan Connector", qty: 1, price: 15.0 },
  { name: "General Consumables (PTFE, clips, flux, solder)", qty: 1, price: 40.0 },
  { name: "Plumbing Waste Removal", qty: 1, price: 120.0 },
];

const SUBTOTAL = 2045.5;
const VAT = 409.1;
const TOTAL = 2454.6;

export const Scene3VoiceQuote: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Camera moves for liveness:
  // 1) Mic-pulse phase: gentle 1.0 → 1.04 push (12 → 30)
  const micZoom = interpolate(frame, [MIC_BIG, MIC_BIG + 8, TRANSCRIBE], [1.0, 1.04, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOutQuad,
  });
  // 2) MONEY SHOT push-in: 1.0 → 1.10 (peak at stamp) → 1.05 settle → 1.0 by send tap
  // Frames: WHITE_FLASH-4=106, TOTAL_STAMP=114, +8=122, SEND_TAP+8=128 — monotonic.
  const moneyZoom = interpolate(
    frame,
    [WHITE_FLASH - 4, TOTAL_STAMP, TOTAL_STAMP + 8, SEND_TAP + 8],
    [1.0, 1.10, 1.05, 1.0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE.outCubic,
    }
  );
  const cameraScale = micZoom * moneyZoom;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${COLOR.navy} 0%, ${COLOR.surfaceDark} 100%)`,
      }}
    >
      <PhoneFrame scale={cameraScale}>
        {frame < TRANSCRIBE && <NewQuoteScreen frame={frame} />}
        {frame >= TRANSCRIBE && frame < GENERATING && (
          <ProcessingScreen frame={frame} stage={1} />
        )}
        {frame >= GENERATING && frame < REVIEW_START && (
          <ProcessingScreen frame={frame} stage={2} />
        )}
        {frame >= REVIEW_START && (
          <QuoteReviewScreen frame={frame} fps={fps} />
        )}

        {/* Thumb tap on Send button at SEND_TAP */}
        <Thumb x={196} y={770} tapAtFrame={SEND_TAP + 6} rippleColor="#fff" />
      </PhoneFrame>

      {/* WHITE-FLASH PATTERN INTERRUPT */}
      {frame >= WHITE_FLASH && frame < TOTAL_STAMP && (
        <AbsoluteFill
          style={{
            background: frame < WHITE_FLASH + 2 ? "#FFFFFF" : COLOR.navy,
            zIndex: 999,
          }}
        />
      )}

      {/* === AUDIO === */}
      <SfxAt
        src={SFX.notification2}
        from={MIC_BIG}
        volume={muteDuringFlash(frame, 0.55)}
        playbackRate={1.4}
      />
      <SfxAt
        src={SFX.riser}
        from={TRANSCRIBE}
        volume={(f) =>
          interpolate(f, [0, 6, 12, 30], [0, 0.12, 0.16, 0.18], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
        playbackRate={0.55}
        durationInFrames={REVIEW_START - TRANSCRIBE}
      />
      {LINE_ITEMS.map((_, i) => (
        <SfxAt
          key={`line-tick-${i}`}
          src={SFX.click}
          from={REVIEW_START + i * 3}
          volume={muteDuringFlash(frame, 0.3)}
          playbackRate={1.1 + i * 0.04}
        />
      ))}
      <SfxAt
        src={SFX.riser}
        from={SUBTOTAL_START}
        volume={(f) =>
          interpolate(f, [0, 8, 14], [0.0, 0.45, 0.0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
        playbackRate={1.3}
        durationInFrames={WHITE_FLASH - SUBTOTAL_START}
      />
      <SfxAt src={SFX.click} from={SEND_TAP + 6} volume={0.85} />
      <SfxAt src={SFX.swoosh} from={SEND_TAP + 12} volume={0.7} />
      <SfxAt
        src={SFX.notification1}
        from={TOAST_IN}
        volume={0.6}
        playbackRate={1.3}
      />
    </AbsoluteFill>
  );
};

function muteDuringFlash(frame: number, baseVolume: number): number {
  if (frame >= WHITE_FLASH && frame < TOTAL_STAMP) return 0;
  return baseVolume;
}

// =====================================================================
// NEW QUOTE SCREEN — translated from real VoiceQuote/index.js styles
// =====================================================================
const NewQuoteScreen: React.FC<{ frame: number }> = ({ frame }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: COLOR.bg,
        fontFamily: "Inter, system-ui",
        position: "relative",
      }}
    >
      {/* Topbar */}
      <div
        style={{
          paddingTop: 56,
          paddingLeft: 16,
          paddingRight: 16,
          paddingBottom: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 600, color: COLOR.navy }}>← Back</div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: 15,
            fontWeight: 600,
            color: COLOR.navy,
            pointerEvents: "none",
          }}
        >
          New Quote
        </div>
        <div
          style={{
            background: COLOR.aiPurpleBg,
            color: COLOR.aiPurple,
            fontSize: 10,
            fontWeight: 500,
            padding: "4px 10px",
            borderRadius: 12,
          }}
        >
          AI powered
        </div>
      </div>

      <div style={{ paddingLeft: 16, paddingRight: 16 }}>
        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: COLOR.navy,
            textAlign: "center",
            marginTop: 8,
            marginBottom: 4,
          }}
        >
          What's the job?
        </div>
        <div
          style={{
            fontSize: 12,
            color: COLOR.textTer,
            textAlign: "center",
            marginBottom: 18,
          }}
        >
          Speak it. We'll build the quote.
        </div>

        {/* AI toggle row — real: aiPoweredBg, padding 12/10 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: COLOR.aiPurpleBg,
            border: `1px solid ${COLOR.border}`,
            borderRadius: 10,
            padding: "10px 12px",
            marginBottom: 14,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
            <div style={{ fontSize: 14, color: COLOR.aiPurple }}>✦</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: COLOR.navy }}>
                Use AI
              </div>
              <div style={{ fontSize: 9, color: COLOR.textTer, marginTop: 2 }}>
                Speak the job — AI fills line items + price
              </div>
            </div>
          </div>
          <div
            style={{
              width: 36,
              height: 20,
              borderRadius: 10,
              background: COLOR.aiPurple,
              padding: 2,
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <div style={{ width: 16, height: 16, borderRadius: 8, background: "#fff" }} />
          </div>
        </div>

        {/* Quick Start chips */}
        <div
          style={{
            fontSize: 9,
            fontWeight: 600,
            color: COLOR.aiPurple,
            textTransform: "uppercase",
            letterSpacing: 0.5,
            marginBottom: 6,
          }}
        >
          QUICK START:
        </div>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 24 }}>
          {["Power flush", "Shower install", "Toilet replacer"].map((label) => (
            <div
              key={label}
              style={{
                background: "#fff",
                border: `1px solid #DDD6FE`,
                borderRadius: 999,
                padding: "3px 8px",
                fontSize: 10,
                fontWeight: 500,
                color: COLOR.aiPurple,
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Mic + caption */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 14 }}>
          {frame >= MIC_BIG ? (
            <MicButton startFrame={MIC_BIG} size="hero" />
          ) : (
            <div style={{ width: 130, height: 130 }} />
          )}
          <div style={{ fontSize: 11, color: COLOR.textTer, marginTop: 10, textAlign: "center" }}>
            {frame >= MIC_BIG && frame < TRANSCRIBE ? "Listening…" : "Tap to start recording"}
          </div>
        </div>

        {/* Voice transcript card (only during MIC_BIG phase) */}
        {frame >= MIC_BIG + 4 && frame < TRANSCRIBE && <VoiceNoteCard frame={frame} />}
      </div>
    </div>
  );
};

const VoiceNoteCard: React.FC<{ frame: number }> = ({ frame }) => {
  const t = frame - (MIC_BIG + 4);
  const opacity = interpolate(t, [0, 6, 14], [0, 1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rise = interpolate(t, [0, 6], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  return (
    <div
      style={{
        background: COLOR.surface,
        border: `1px solid ${COLOR.border}`,
        borderRadius: 10,
        padding: "11px 12px",
        marginTop: 4,
        opacity,
        transform: `translateY(${rise}px)`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
        <span style={{ color: COLOR.aiPurple, fontWeight: 700 }}>✦</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: COLOR.navy }}>HEARING</span>
      </div>
      <div style={{ fontSize: 11, lineHeight: 1.4, color: COLOR.textSec, fontWeight: 400 }}>
        Bathroom waste install — 32mm pipe, bath waste, basin trap, plumbing waste removal
      </div>
    </div>
  );
};

// =====================================================================
// PROCESSING SCREEN — Transcribing / Generating (real stepBarStyles)
// =====================================================================
const ProcessingScreen: React.FC<{ frame: number; stage: 1 | 2 }> = ({
  frame,
  stage,
}) => {
  const t = frame - (stage === 1 ? TRANSCRIBE : GENERATING);
  const stageProgress = interpolate(t, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const heading = stage === 1 ? "Transcribing your voice…" : "Generating your quote…";
  const subtitle =
    stage === 1
      ? "Turning audio into text — this takes a few seconds."
      : "AI is building line items, quantities and pricing.";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: COLOR.bg,
        fontFamily: "Inter, system-ui",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 24px",
      }}
    >
      <AISparkleLoader size={72} startFrame={stage === 1 ? TRANSCRIBE : GENERATING} />
      <div
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: COLOR.navy,
          marginTop: 24,
          textAlign: "center",
        }}
      >
        {heading}
      </div>
      <div
        style={{
          fontSize: 12,
          color: COLOR.textTer,
          textAlign: "center",
          marginTop: 6,
          maxWidth: 280,
          lineHeight: 1.4,
        }}
      >
        {subtitle}
      </div>
      {/* Two-stage progress bar — real stepBarStyles */}
      <div style={{ display: "flex", gap: 6, marginTop: 24 }}>
        <ProgressTrack progress={stage >= 1 ? (stage === 1 ? stageProgress : 1) : 0} />
        <ProgressTrack progress={stage === 2 ? stageProgress : 0} />
      </div>
      <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
        <span
          style={{
            width: 100,
            textAlign: "center",
            fontSize: 9,
            fontWeight: stage === 1 ? 600 : 500,
            color: stage === 1 ? COLOR.aiPurple : COLOR.aiPurple,
            letterSpacing: 0.3,
          }}
        >
          Transcribe
        </span>
        <span
          style={{
            width: 100,
            textAlign: "center",
            fontSize: 9,
            fontWeight: stage === 2 ? 600 : 500,
            color: stage === 2 ? COLOR.aiPurple : COLOR.textTer,
            letterSpacing: 0.3,
          }}
        >
          Generate quote
        </span>
      </div>
      <div style={{ fontSize: 10, color: COLOR.textTer, marginTop: 18 }}>
        {stage === 1 ? "1s elapsed · usually 10–25s" : "8s elapsed · usually 10–25s"}
      </div>
    </div>
  );
};

const ProgressTrack: React.FC<{ progress: number }> = ({ progress }) => (
  <div
    style={{
      width: 100,
      height: 4,
      borderRadius: 2,
      background: "#E2E8F0",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        width: `${progress * 100}%`,
        height: "100%",
        background: COLOR.aiPurple,
        borderRadius: 2,
      }}
    />
  </div>
);

// =====================================================================
// QUOTE REVIEW SCREEN — translated from real QuoteReview/index.js styles
// =====================================================================
const QuoteReviewScreen: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: COLOR.bg,
        fontFamily: "Inter, system-ui",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Topbar */}
      <div
        style={{
          paddingTop: 56,
          paddingLeft: 12,
          paddingRight: 12,
          paddingBottom: 12,
          borderBottom: `1px solid ${COLOR.border}`,
          background: COLOR.surface,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 600, color: COLOR.navy }}>← Back</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: COLOR.navy }}>Quote Review</div>
        <div
          style={{
            background: COLOR.aiPurpleBg,
            color: COLOR.aiPurple,
            fontSize: 9,
            fontWeight: 500,
            padding: "2px 7px",
            borderRadius: 10,
          }}
        >
          AI
        </div>
      </div>

      {/* AI banner card */}
      <div
        style={{
          margin: "12px 14px 8px",
          background: COLOR.aiPurpleBg,
          borderRadius: 8,
          padding: "7px 10px",
          fontSize: 10,
          fontWeight: 500,
          color: COLOR.aiPurple,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span>✦</span>
        <span>AI generated from your voice description</span>
      </div>

      {/* Customer + job header card */}
      <div
        style={{
          margin: "0 14px 8px",
          background: COLOR.surface,
          border: `1px solid ${COLOR.border}`,
          borderRadius: 12,
          padding: 12,
        }}
      >
        <div
          style={{
            fontSize: 8,
            fontWeight: 600,
            color: COLOR.textTer,
            textTransform: "uppercase",
            letterSpacing: 0.6,
            marginBottom: 4,
          }}
        >
          For
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: COLOR.navy }}>
          Mrs. Patel · Bathroom waste install
        </div>
      </div>

      {/* Line items table */}
      <div
        style={{
          margin: "0 14px",
          background: COLOR.surface,
          border: `1px solid ${COLOR.border}`,
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {/* Table header */}
        <div
          style={{
            display: "flex",
            gap: 6,
            padding: "8px 8px",
            borderBottom: `1px solid ${COLOR.divider}`,
          }}
        >
          <div
            style={{
              flex: 2,
              fontSize: 9,
              fontWeight: 600,
              color: COLOR.textTer,
              textTransform: "uppercase",
            }}
          >
            Description
          </div>
          <div
            style={{
              width: 36,
              fontSize: 9,
              fontWeight: 600,
              color: COLOR.textTer,
              textTransform: "uppercase",
              textAlign: "right",
            }}
          >
            Qty
          </div>
          <div
            style={{
              width: 56,
              fontSize: 9,
              fontWeight: 600,
              color: COLOR.textTer,
              textTransform: "uppercase",
              textAlign: "right",
            }}
          >
            Price
          </div>
        </div>
        {LINE_ITEMS.map((item, i) => (
          <LineItemRow key={i} item={item} index={i} frame={frame} fps={fps} isLast={i === LINE_ITEMS.length - 1} />
        ))}
      </div>

      {frame >= SUBTOTAL_START && <SubtotalBlock frame={frame} />}
      {frame >= TOTAL_STAMP && <TotalStamp frame={frame} fps={fps} />}
      {frame >= SEND_TAP && <SendButton frame={frame} />}
      {frame >= TOAST_IN && <ConfirmationToast frame={frame} />}
    </div>
  );
};

const LineItemRow: React.FC<{
  item: { name: string; qty: number; price: number };
  index: number;
  frame: number;
  fps: number;
  isLast: boolean;
}> = ({ item, index, frame, fps, isLast }) => {
  const start = REVIEW_START + index * 3;
  const sp = popInProgress(frame, fps, start);
  const opacity = interpolate(sp, [0, 1], [0, 1]);
  const xOffset = interpolate(sp, [0, 1], [60, 0]);
  const sparkleP = interpolate(frame, [start + 4, start + 8, start + 14], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "8px 8px",
        minHeight: 38,
        borderBottom: isLast ? "none" : `1px solid ${COLOR.divider}`,
        opacity,
        transform: `translateX(${xOffset}px)`,
        position: "relative",
      }}
    >
      <div style={{ flex: 2, fontSize: 11, color: COLOR.textSec, lineHeight: 1.3, fontWeight: 400 }}>
        {item.name}
      </div>
      <div style={{ width: 36, fontSize: 11, fontWeight: 600, color: COLOR.navy, textAlign: "right" }}>
        {item.qty}
      </div>
      <div style={{ width: 56, fontSize: 11, fontWeight: 600, color: COLOR.navy, textAlign: "right" }}>
        £{item.price.toFixed(2)}
      </div>
      {sparkleP > 0 && (
        <div
          style={{
            position: "absolute",
            right: 4,
            top: "50%",
            transform: `translateY(-50%) scale(${sparkleP})`,
            color: COLOR.aiPurple,
            fontSize: 14,
            opacity: sparkleP,
            pointerEvents: "none",
          }}
        >
          ✦
        </div>
      )}
    </div>
  );
};

const SubtotalBlock: React.FC<{ frame: number }> = ({ frame }) => {
  const t = frame - SUBTOTAL_START;
  const countP = interpolate(t, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  const subtotalDisplay = SUBTOTAL * countP;
  const showVAT = t >= 10;

  return (
    <div style={{ margin: "8px 14px" }}>
      <div
        style={{
          background: COLOR.surface,
          border: `1px solid ${COLOR.border}`,
          borderRadius: 12,
          padding: "8px 11px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
          <span style={{ fontSize: 9, fontWeight: 400, color: COLOR.textTer }}>Subtotal</span>
          <span style={{ fontSize: 9, fontWeight: 500, color: COLOR.navy }}>
            £{subtotalDisplay.toFixed(2)}
          </span>
        </div>
        {showVAT && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "6px 0",
                borderTop: `1px solid ${COLOR.divider}`,
              }}
            >
              <span style={{ fontSize: 11, color: COLOR.textSec, fontWeight: 500 }}>Include tax</span>
              <Toggle on />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
              <span style={{ fontSize: 9, fontWeight: 400, color: COLOR.textSec }}>VAT (20%)</span>
              <span style={{ fontSize: 9, fontWeight: 500, color: COLOR.navy }}>
                £{VAT.toFixed(2)}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const Toggle: React.FC<{ on: boolean }> = ({ on }) => (
  <div
    style={{
      width: 32,
      height: 18,
      borderRadius: 999,
      background: on ? COLOR.blue : COLOR.divider,
      padding: 2,
      boxSizing: "border-box",
      position: "relative",
    }}
  >
    <div
      style={{
        width: 14,
        height: 14,
        borderRadius: "50%",
        background: "#fff",
        position: "absolute",
        top: 2,
        left: on ? 16 : 2,
        boxShadow: "0 1px 2px rgba(0,0,0,0.25)",
      }}
    />
  </div>
);

const TotalStamp: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const t = frame - TOTAL_STAMP;
  const sp = spring({ frame: t, fps, config: SPRING.bouncy });
  const baseScale = interpolate(sp, [0, 1], [0.6, 1.0]);
  const overshoot = Math.max(0, sp - 1) * 0.15;
  const scale = baseScale + overshoot;
  const flash = interpolate(t, [0, 4, 14], [1, 0.4, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        margin: "6px 14px",
        background: COLOR.navy,
        borderRadius: 12,
        padding: "12px 14px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        transform: `scale(${scale})`,
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 12px 28px rgba(15,23,42,0.45)",
      }}
    >
      <span
        style={{
          fontSize: 12,
          color: "rgba(255,255,255,0.7)",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        Total
      </span>
      <span style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: -0.4 }}>
        £{TOTAL.toFixed(2)}
      </span>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(255,255,255,0.6)",
          opacity: flash,
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

const SendButton: React.FC<{ frame: number }> = ({ frame }) => {
  const t = frame - SEND_TAP;
  const press = interpolate(t, [0, 4, 10], [1, 0.96, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pressed = t >= 6 && t < 10;
  // Paper airplane fly-off
  const planeT = t - 10;
  const planeOpacity = interpolate(planeT, [0, 4, 14], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const planeX = interpolate(planeT, [0, 14], [0, 220]);
  const planeY = interpolate(planeT, [0, 14], [0, -200]);
  const planeRot = interpolate(planeT, [0, 14], [0, -38]);
  return (
    <div
      style={{
        position: "absolute",
        left: 14,
        right: 14,
        bottom: 12,
        background: COLOR.surface,
        borderTop: `1px solid ${COLOR.border}`,
        paddingTop: 12,
        display: "flex",
        gap: 8,
      }}
    >
      <div
        style={{
          flex: 1,
          background: COLOR.surface,
          border: `1.5px solid ${COLOR.border}`,
          borderRadius: 10,
          padding: "11px 10px",
          fontSize: 11,
          fontWeight: 600,
          color: COLOR.navy,
          textAlign: "center",
          minHeight: 22,
          boxSizing: "border-box",
        }}
      >
        Edit items
      </div>
      <div style={{ flex: 2, position: "relative" }}>
        <div
          style={{
            background: pressed ? "#fff" : COLOR.navy,
            border: pressed ? `1.5px solid ${COLOR.navy}` : "1.5px solid transparent",
            borderRadius: 10,
            padding: "11px 10px",
            fontSize: 11,
            fontWeight: 600,
            color: pressed ? COLOR.navy : "#fff",
            textAlign: "center",
            transform: `scale(${press})`,
            boxSizing: "border-box",
          }}
        >
          {pressed ? "Sending…" : "Send quote →"}
        </div>
        {planeT >= 0 && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%) translate(${planeX}px, ${planeY}px) rotate(${planeRot}deg)`,
              opacity: planeOpacity,
              fontSize: 22,
              color: COLOR.blue,
              pointerEvents: "none",
            }}
          >
            ✈
          </div>
        )}
      </div>
    </div>
  );
};

const ConfirmationToast: React.FC<{ frame: number }> = ({ frame }) => {
  const t = frame - TOAST_IN;
  const enterP = interpolate(t, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  const yOffset = interpolate(enterP, [0, 1], [-60, 0]);
  return (
    <div
      style={{
        position: "absolute",
        top: 60,
        left: 14,
        right: 14,
        background: COLOR.acceptedBg,
        border: `1px solid ${COLOR.accepted}`,
        borderRadius: 12,
        padding: "10px 14px",
        display: "flex",
        gap: 10,
        alignItems: "center",
        transform: `translateY(${yOffset}px)`,
        opacity: enterP,
        boxShadow: "0 8px 18px rgba(0,0,0,0.15)",
      }}
    >
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: COLOR.accepted,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          fontWeight: 800,
        }}
      >
        ✓
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color: COLOR.accepted }}>
        Sent via WhatsApp
      </span>
    </div>
  );
};
