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
import { GlassPlate } from "../components/GlassPlate";
import { SfxAt } from "../components/SfxAt";

// =====================================================================
// SCENE 9 — AI Business Assistant (v1.21, frames 780–900)
// 120 frames @ 30fps · 4.0s
//
// Beats (verbatim from §6):
//   • Sent message bubble stretches horizontally → AI assistant search bar
//   • Query: "What job made me the most money this week?"
//   • Dashboard cards shimmer softly
//   • MAIN CARD EXPANDS: "Bathroom repairs — £1,840 revenue"
//   • Supporting cards: Highest Margin / Fastest Payment / Most Repeat Customers
//   • Camera slow push toward main revenue card. HOLD.
// =====================================================================

const BAR_MORPH_END = 18;
const QUERY_TYPE_START = 18;
const QUERY_TYPE_END = 60;
const SHIMMER_START = 56;
const MAIN_CARD_EXPAND = 70;
const SUPPORT_CARDS = 86;
const SCENE_END = 120;

const QUERY = "What job made me the most money this week?";

export const Scene9BusinessAssistant: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Camera slow push toward the main revenue card
  const cameraScale = interpolate(
    frame,
    [0, MAIN_CARD_EXPAND, SCENE_END],
    [1.0, 1.06, 1.10],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE.inOutQuad,
    }
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: 240,
      }}
    >
      <div
        style={{
          transform: `scale(${cameraScale})`,
          transformStyle: "preserve-3d",
        }}
      >
        <PhoneFrame scale={1.0}>
          <AssistantFlow frame={frame} fps={fps} />
        </PhoneFrame>
      </div>

      {/* === AUDIO === */}
      <SfxAt
        src={GEN.bedConversational}
        from={0}
        loop
        volume={(f) =>
          interpolate(f, [0, 8, 110, 120], [0, 0.08, 0.08, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
        durationInFrames={SCENE_END}
      />
      {/* Sparse typing ticks during query */}
      {[24, 30, 36, 42, 48, 54].map((f) => (
        <SfxAt
          key={`q-tick-${f}`}
          src={SFX.click}
          from={f}
          volume={0.18}
          playbackRate={1.1}
        />
      ))}
      <SfxAt src={GEN.counterRoll} from={MAIN_CARD_EXPAND} volume={0.28} />
      <SfxAt src={GEN.achievement} from={MAIN_CARD_EXPAND + 10} volume={0.32} />
    </AbsoluteFill>
  );
};

const AssistantFlow: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  // Search bar emerges
  const barP = interpolate(frame, [0, BAR_MORPH_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  const barWidth = interpolate(barP, [0, 1], [180, 320]);
  const barEnter = barP;

  // Query types in
  const queryT = frame - QUERY_TYPE_START;
  const queryDur = QUERY_TYPE_END - QUERY_TYPE_START;
  const queryVisible =
    queryT >= 0
      ? Math.min(QUERY.length, Math.floor((queryT / queryDur) * QUERY.length))
      : 0;

  // Main revenue card
  const mainSp = spring({
    frame: frame - MAIN_CARD_EXPAND,
    fps,
    config: SPRING.soft,
  });
  const mainEnter = interpolate(mainSp, [0, 1], [0, 1]);
  const mainScale = interpolate(mainEnter, [0, 1], [0.85, 1]);
  // Revenue counts up 0 → 1840
  const revP = interpolate(
    frame,
    [MAIN_CARD_EXPAND + 4, MAIN_CARD_EXPAND + 18],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.outCubic }
  );
  const revenue = Math.round(1840 * revP);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: COLOR.bg,
        paddingTop: 60,
        padding: "60px 14px 14px",
        fontFamily: "Inter, system-ui",
        position: "relative",
      }}
    >
      {/* Search bar */}
      <div
        style={{
          background: COLOR.surface,
          border: `1px solid ${COLOR.border}`,
          borderRadius: 999,
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          width: barWidth,
          margin: "0 auto",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          opacity: barEnter,
        }}
      >
        <span style={{ color: COLOR.aiPurple, fontSize: 14 }}>✦</span>
        <span
          style={{
            fontSize: 11,
            color: COLOR.navy,
            fontWeight: 500,
            flex: 1,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {queryVisible > 0 ? QUERY.slice(0, queryVisible) : "Ask Kiva…"}
          {queryT >= 0 && queryVisible < QUERY.length && (
            <span
              style={{
                display: "inline-block",
                width: 2,
                height: 12,
                background: COLOR.aiPurple,
                marginLeft: 2,
                verticalAlign: "middle",
                opacity: Math.floor(frame / 6) % 2 === 0 ? 1 : 0,
              }}
            />
          )}
        </span>
      </div>

      {/* Shimmering dashboard cards underneath */}
      <ShimmeringDashboard frame={frame} />

      {/* Main revenue card (expands at MAIN_CARD_EXPAND) */}
      {frame >= MAIN_CARD_EXPAND - 2 && (
        <div
          style={{
            position: "absolute",
            top: 220,
            left: 14,
            right: 14,
            opacity: mainEnter,
            transform: `scale(${mainScale})`,
            transformOrigin: "center top",
          }}
        >
          <div
            style={{
              background: `linear-gradient(135deg, ${COLOR.aiPurple} 0%, ${COLOR.blue} 100%)`,
              borderRadius: 16,
              padding: 20,
              color: "#fff",
              boxShadow: `0 12px 32px rgba(109,40,217,0.45), 0 0 24px rgba(59,130,246,0.3)`,
            }}
          >
            <div
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: "rgba(255,255,255,0.7)",
                textTransform: "uppercase",
                letterSpacing: 0.6,
                marginBottom: 4,
              }}
            >
              ✦ TOP JOB · THIS WEEK
            </div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#fff",
                marginBottom: 6,
              }}
            >
              Bathroom repairs
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: "#fff",
                letterSpacing: -1,
              }}
            >
              £{revenue.toLocaleString()} revenue
            </div>
          </div>
        </div>
      )}

      {/* Supporting cards row */}
      {frame >= SUPPORT_CARDS - 4 && (
        <SupportingCards frame={frame} fps={fps} />
      )}
    </div>
  );
};

const ShimmeringDashboard: React.FC<{ frame: number }> = ({ frame }) => {
  // Three placeholder dashboard cards with shimmer
  const shimmerActive = frame >= SHIMMER_START && frame < MAIN_CARD_EXPAND;
  return (
    <div
      style={{
        marginTop: 14,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        opacity: interpolate(frame, [BAR_MORPH_END, BAR_MORPH_END + 8], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            background: COLOR.surface,
            border: `1px solid ${COLOR.border}`,
            borderRadius: 10,
            padding: 14,
            height: 50,
            position: "relative",
            overflow: "hidden",
            opacity: frame >= MAIN_CARD_EXPAND ? 0.3 : 1,
          }}
        >
          {shimmerActive && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(90deg, transparent 0%, rgba(109,40,217,${0.12 +
                  0.12 * Math.sin((frame / 6 + i * 0.4) * Math.PI * 2)}) 50%, transparent 100%)`,
                pointerEvents: "none",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

const SupportingCards: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const cards = ["Highest Margin", "Fastest Payment", "Most Repeat"];
  return (
    <div
      style={{
        position: "absolute",
        bottom: 80,
        left: 14,
        right: 14,
        display: "flex",
        gap: 6,
      }}
    >
      {cards.map((c, i) => {
        const start = SUPPORT_CARDS + i * 4;
        const sp = spring({ frame: frame - start, fps, config: SPRING.bouncy });
        const enter = interpolate(sp, [0, 1], [0, 1]);
        return (
          <div
            key={c}
            style={{
              flex: 1,
              background: COLOR.surface,
              border: `1px solid ${COLOR.border}`,
              borderRadius: 8,
              padding: "8px 6px",
              fontSize: 8,
              fontWeight: 600,
              color: COLOR.aiPurple,
              textAlign: "center",
              opacity: enter,
              transform: `translateY(${interpolate(enter, [0, 1], [10, 0])}px)`,
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            }}
          >
            ✦ {c}
          </div>
        );
      })}
    </div>
  );
};
