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
import { MicButton } from "../components/MicButton";
import { GlassPlate } from "../components/GlassPlate";
import { SfxAt } from "../components/SfxAt";

// =====================================================================
// SCENE 4 — Voice → Quote transformation (v1.21, frames 345–450)
// 105 frames @ 30fps · 3.5s · HERO
// (file kept as Scene4_Expense.tsx — content rebuilt from §6 verbatim)
//
// Three sub-beats from user storyboard:
//   F0–F21 (345–366):   Mic expands. Camera zooms into mic. Mic expands
//                       outward into circular AI interface. Background UI
//                       softly blurs. Waveform appears.
//                       TEXT (above waveform): "Tell Kiva what you need…"
//   F21–F69 (366–414):  Voice input appears live. TEXT:
//                       "Create a quote for John Smith — bathroom leak
//                        repair — £280 labour and materials."
//                       Highlights pulse: John Smith, bathroom leak repair,
//                       £280. Camera slow zoom toward £280.
//   F69–F105 (414–450): Text transforms into quote card. Words magnetically
//                       move into structured fields:
//                         John Smith
//                         Bathroom Leak Repair
//                         Labour: £180
//                         Materials: £100
//                         TOTAL: £280  (counts £0 → £280)
//                       Blue glow pulse. HOLD 0.7s.
// =====================================================================

const MIC_EXPAND_END = 21;
const VOICE_TEXT_START = 21;
const VOICE_TEXT_END = 69;
const QUOTE_CARD_START = 69;
const SCENE_END = 105;

const VOICE_LINE = "Create a quote for John Smith — bathroom leak repair — £280 labour and materials.";

export const Scene4Expense: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Camera push toward £280 during voice phase
  const cameraScale = interpolate(
    frame,
    [0, MIC_EXPAND_END, VOICE_TEXT_END, QUOTE_CARD_START + 16, SCENE_END],
    [1.05, 1.12, 1.18, 1.05, 1.0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE.inOutQuad,
    }
  );

  // Background UI blur during voice phases
  const bgBlur = interpolate(
    frame,
    [MIC_EXPAND_END, VOICE_TEXT_END, QUOTE_CARD_START + 6],
    [0, 8, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
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
      <PhoneFrame scale={cameraScale}>
        {frame < QUOTE_CARD_START ? (
          <MicAndVoice frame={frame} fps={fps} bgBlur={bgBlur} />
        ) : (
          <QuoteCard frame={frame} fps={fps} />
        )}
      </PhoneFrame>

      {/* === AUDIO === */}
      <SfxAt
        src={GEN.bedPrecise}
        from={0}
        loop
        volume={(f) =>
          interpolate(f, [0, 8, 95, 105], [0, 0.08, 0.08, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
        durationInFrames={SCENE_END}
      />
      <SfxAt
        src={SFX.notification1}
        from={0}
        volume={0.5}
        playbackRate={Math.pow(2, 4 / 12)}
      />
      <SfxAt src={GEN.counterRoll} from={QUOTE_CARD_START + 4} volume={0.32} />
      <SfxAt src={SFX.impact2} from={QUOTE_CARD_START + 22} volume={0.4} />
    </AbsoluteFill>
  );
};

// =====================================================================
// MIC + VOICE (frames 0–69 local)
// =====================================================================
const MicAndVoice: React.FC<{
  frame: number;
  fps: number;
  bgBlur: number;
}> = ({ frame, fps, bgBlur }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: COLOR.bg,
        position: "relative",
        fontFamily: "Inter, system-ui",
      }}
    >
      {/* Soft-blurred background dashboard */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          filter: `blur(${bgBlur}px)`,
          opacity: 0.5,
          paddingTop: 60,
          padding: "60px 16px 0",
        }}
      >
        <div
          style={{
            background: COLOR.aiPurple,
            borderRadius: 14,
            height: 80,
            marginBottom: 10,
          }}
        />
        <div
          style={{
            background: COLOR.blue,
            borderRadius: 14,
            height: 80,
            marginBottom: 10,
          }}
        />
        <div
          style={{
            background: COLOR.surfaceDark,
            borderRadius: 14,
            height: 80,
          }}
        />
      </div>

      {/* "Tell Kiva what you need…" caption above mic */}
      {frame < MIC_EXPAND_END && (
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: 14,
            fontWeight: 600,
            color: COLOR.navy,
            opacity: interpolate(frame, [4, 12], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          Tell Kiva what you need…
        </div>
      )}

      {/* Mic — center, expanded */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${interpolate(frame, [0, MIC_EXPAND_END], [1.0, 1.4], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: EASE.outCubic,
          })})`,
        }}
      >
        <MicButton startFrame={0} recording={frame >= MIC_EXPAND_END} size="hero" />
      </div>

      {/* Voice text streaming — appears below mic during VOICE_TEXT phase */}
      {frame >= VOICE_TEXT_START && (
        <VoiceTextStream frame={frame} />
      )}
    </div>
  );
};

const VoiceTextStream: React.FC<{ frame: number }> = ({ frame }) => {
  const t = frame - VOICE_TEXT_START;
  const total = VOICE_TEXT_END - VOICE_TEXT_START;
  const visible = Math.min(VOICE_LINE.length, Math.floor((t / total) * VOICE_LINE.length));
  const text = VOICE_LINE.slice(0, visible);
  // Highlight tokens — wrap in spans with pulse glow
  const highlighted = (() => {
    const targets = ["John Smith", "bathroom leak repair", "£280"];
    let result: React.ReactNode[] = [];
    let cursor = 0;
    while (cursor < text.length) {
      const found = targets
        .map((t) => ({ t, idx: text.indexOf(t, cursor) }))
        .filter((x) => x.idx >= 0)
        .sort((a, b) => a.idx - b.idx)[0];
      if (!found || found.idx >= text.length) {
        result.push(text.slice(cursor));
        break;
      }
      if (found.idx > cursor) result.push(text.slice(cursor, found.idx));
      // Highlight token
      const token = found.t.slice(0, Math.max(0, text.length - found.idx));
      result.push(
        <span
          key={`${found.t}-${found.idx}`}
          style={{
            color: COLOR.blue,
            fontWeight: 700,
            textShadow: `0 0 12px ${COLOR.blue}88`,
          }}
        >
          {token}
        </span>
      );
      cursor = found.idx + found.t.length;
    }
    return result;
  })();
  return (
    <div
      style={{
        position: "absolute",
        bottom: 100,
        left: 16,
        right: 16,
      }}
    >
      <GlassPlate radius={14}>
        <div
          style={{
            padding: "12px 14px",
            fontFamily: "Inter, system-ui",
            fontSize: 13,
            fontWeight: 500,
            color: "#fff",
            lineHeight: 1.4,
            minHeight: 60,
          }}
        >
          {highlighted}
          <span
            style={{
              display: "inline-block",
              width: 2,
              height: 14,
              background: COLOR.blue,
              marginLeft: 2,
              verticalAlign: "middle",
              opacity: Math.floor(frame / 6) % 2 === 0 ? 1 : 0,
            }}
          />
        </div>
      </GlassPlate>
    </div>
  );
};

// =====================================================================
// QUOTE CARD (frames 69–105 local)
// =====================================================================
const QuoteCard: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const t = frame - QUOTE_CARD_START;
  // Total counts up over 0–18 frames
  const totalP = interpolate(t, [4, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  const totalDisplay = Math.round(280 * totalP);
  // Total stamp scale-pulse
  const totalSp = spring({ frame: t - 18, fps, config: SPRING.bouncy });
  const totalScale = totalSp >= 0 ? 1 + 0.1 * Math.max(0, 1 - Math.abs(totalSp - 1)) : 1;
  // Field stagger
  const fields: { label: string; value: string }[] = [
    { label: "Customer", value: "John Smith" },
    { label: "Job", value: "Bathroom Leak Repair" },
    { label: "Labour", value: "£180" },
    { label: "Materials", value: "£100" },
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: COLOR.bg,
        paddingTop: 60,
        padding: "60px 14px 14px",
        fontFamily: "Inter, system-ui",
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: COLOR.aiPurple,
          textTransform: "uppercase",
          letterSpacing: 0.6,
          marginBottom: 6,
        }}
      >
        ✦ Quote — AI generated
      </div>
      <div
        style={{
          background: COLOR.surface,
          border: `1px solid ${COLOR.border}`,
          borderRadius: 14,
          padding: 14,
          boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
        }}
      >
        {fields.map((f, i) => {
          const enter = interpolate(t, [2 + i * 2, 8 + i * 2], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: EASE.outCubic,
          });
          return (
            <div
              key={f.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                paddingTop: 8,
                paddingBottom: 8,
                borderBottom:
                  i < fields.length - 1 ? `1px solid ${COLOR.divider}` : "none",
                opacity: enter,
                transform: `translateX(${interpolate(enter, [0, 1], [12, 0])}px)`,
              }}
            >
              <span style={{ fontSize: 10, color: COLOR.textSec, fontWeight: 500 }}>
                {f.label}
              </span>
              <span style={{ fontSize: 13, color: COLOR.navy, fontWeight: 600 }}>
                {f.value}
              </span>
            </div>
          );
        })}
        {/* Total row */}
        <div
          style={{
            marginTop: 14,
            paddingTop: 12,
            borderTop: `1.5px solid ${COLOR.navy}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            transform: `scale(${totalScale})`,
            transformOrigin: "right center",
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 700, color: COLOR.navy }}>
            TOTAL
          </span>
          <span
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: COLOR.navy,
              letterSpacing: -0.5,
              textShadow:
                t >= 22
                  ? `0 0 18px rgba(59,130,246,0.5)`
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
