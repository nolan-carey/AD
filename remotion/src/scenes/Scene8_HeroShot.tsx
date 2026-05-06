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
// SCENE 8 — Pin → Follow-up (v1.21, frames 690–780)
// 90 frames @ 30fps · 3.0s
// (file kept as Scene8_HeroShot.tsx — content rebuilt verbatim)
//
// Beats:
//   • Camera zooms into one map pin. Pin expands into quote status card.
//   • TEXT: "Quote sent — no response"
//   • Card morphs into messaging interface. AI typing indicator appears.
//   • MESSAGE TYPES: "Hi John, just following up on the bathroom repair
//     quote. Happy to answer any questions."
//   • Send button glows. Message sends upward.
//   • SUCCESS STATE: "Follow-up sent" with blue checkmark.
//   • Hold briefly.
// =====================================================================

const PIN_ZOOM_END = 12;
const STATUS_CARD = 12;
const TYPING_START = 30;
const MESSAGE_TEXT_START = 38;
const MESSAGE_TEXT_END = 64;
const SEND_FRAME = 68;
const SUCCESS_BADGE = 76;
const SCENE_END = 90;

const FOLLOW_UP_MESSAGE =
  "Hi John, just following up on the bathroom repair quote. Happy to answer any questions.";

export const Scene8HeroShot: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Camera zoom from map pin context → into card
  const cameraScale = interpolate(
    frame,
    [0, PIN_ZOOM_END, SCENE_END],
    [1.0, 1.05, 1.02],
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
      <PhoneFrame scale={cameraScale}>
        <FollowUpFlow frame={frame} fps={fps} />
      </PhoneFrame>

      {/* === AUDIO === */}
      <SfxAt
        src={GEN.bedConversational}
        from={0}
        loop
        volume={(f) =>
          interpolate(f, [0, 8, 80, 90], [0, 0.08, 0.08, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
        durationInFrames={SCENE_END}
      />
      {[32, 35, 38].map((f) => (
        <SfxAt
          key={`type-${f}`}
          src={SFX.click}
          from={f}
          volume={0.18}
          playbackRate={1.4}
        />
      ))}
      <SfxAt src={SFX.swoosh} from={SEND_FRAME} volume={0.55} />
      <SfxAt src={GEN.achievement} from={SUCCESS_BADGE} volume={0.32} />
    </AbsoluteFill>
  );
};

const FollowUpFlow: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  // Status card enters at PIN_ZOOM_END
  const cardSp = spring({ frame: frame - STATUS_CARD, fps, config: SPRING.soft });
  const cardEnter = interpolate(cardSp, [0, 1], [0, 1]);

  // Typing indicator visible TYPING_START..MESSAGE_TEXT_START
  const showTyping = frame >= TYPING_START && frame < MESSAGE_TEXT_START;

  // Message text streams
  const messageT = frame - MESSAGE_TEXT_START;
  const messageDur = MESSAGE_TEXT_END - MESSAGE_TEXT_START;
  const messageVisible =
    messageT >= 0
      ? Math.min(
          FOLLOW_UP_MESSAGE.length,
          Math.floor((messageT / messageDur) * FOLLOW_UP_MESSAGE.length)
        )
      : 0;

  // Send button glow + airplane fly-out
  const sendT = frame - SEND_FRAME;
  const planeOpacity = interpolate(sendT, [0, 4, 16], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const planeY = interpolate(sendT, [0, 16], [0, -160]);

  // Success badge
  const badgeSp = spring({
    frame: frame - SUCCESS_BADGE,
    fps,
    config: SPRING.bouncy,
  });
  const badgeEnter = interpolate(badgeSp, [0, 1], [0, 1]);

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
      {/* Status card / quote info */}
      <div
        style={{
          background: COLOR.surface,
          border: `1px solid ${COLOR.border}`,
          borderRadius: 12,
          padding: 12,
          opacity: cardEnter,
          transform: `translateY(${interpolate(cardEnter, [0, 1], [16, 0])}px)`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 6,
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, color: COLOR.navy }}>
            John Smith — Bathroom Leak Repair
          </div>
          <div
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: COLOR.pending,
              background: "#FEF3C7",
              padding: "2px 7px",
              borderRadius: 999,
            }}
          >
            Sent
          </div>
        </div>
        <div style={{ fontSize: 10, color: COLOR.textSec }}>
          Quote sent — no response
        </div>
      </div>

      {/* AI bot message thread */}
      {(showTyping || messageT >= 0) && (
        <div
          style={{
            marginTop: 14,
            display: "flex",
            gap: 8,
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${COLOR.aiPurple} 0%, ${COLOR.blue} 100%)`,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 800,
              boxShadow: "0 0 12px rgba(109,40,217,0.5)",
              flexShrink: 0,
            }}
          >
            ✦
          </div>
          <div
            style={{
              background: COLOR.aiPurpleBg,
              borderRadius: 14,
              padding: "10px 12px",
              fontSize: 11,
              fontWeight: 500,
              color: COLOR.aiPurple,
              lineHeight: 1.4,
              maxWidth: 250,
            }}
          >
            {showTyping ? <TypingDots /> : FOLLOW_UP_MESSAGE.slice(0, messageVisible)}
            {messageT >= 0 && messageVisible < FOLLOW_UP_MESSAGE.length && (
              <span
                style={{
                  display: "inline-block",
                  width: 2,
                  height: 11,
                  background: COLOR.aiPurple,
                  marginLeft: 2,
                  verticalAlign: "middle",
                  opacity: Math.floor(frame / 6) % 2 === 0 ? 1 : 0,
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* Send button area + paper airplane */}
      {frame >= SEND_FRAME - 4 && frame < SUCCESS_BADGE && (
        <div
          style={{
            position: "absolute",
            bottom: 110,
            right: 30,
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: COLOR.blue,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 18,
            boxShadow: `0 0 16px ${COLOR.blue}, 0 4px 12px rgba(59,130,246,0.5)`,
          }}
        >
          ✈
          {/* Paper airplane fly-off */}
          {sendT >= 0 && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                fontSize: 18,
                color: COLOR.blue,
                transform: `translateY(${planeY}px)`,
                opacity: planeOpacity,
              }}
            >
              ✈
            </div>
          )}
        </div>
      )}

      {/* Success badge */}
      {frame >= SUCCESS_BADGE && (
        <div
          style={{
            position: "absolute",
            top: 200,
            left: "50%",
            transform: `translate(-50%, 0) scale(${interpolate(badgeEnter, [0, 1], [0.6, 1])})`,
            opacity: badgeEnter,
          }}
        >
          <div
            style={{
              background: COLOR.acceptedBg,
              border: `1px solid ${COLOR.accepted}`,
              borderRadius: 999,
              padding: "8px 16px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12,
              fontWeight: 700,
              color: COLOR.accepted,
              boxShadow: `0 0 16px rgba(21,128,61,0.4)`,
            }}
          >
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: COLOR.accepted,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 800,
              }}
            >
              ✓
            </span>
            Follow-up sent
          </div>
        </div>
      )}
    </div>
  );
};

const TypingDots: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <span style={{ display: "inline-flex", gap: 3 }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: COLOR.aiPurple,
            opacity:
              0.3 + 0.7 * Math.max(0, Math.sin(((frame - i * 2) / 5) * Math.PI * 2)),
            display: "inline-block",
          }}
        />
      ))}
    </span>
  );
};
