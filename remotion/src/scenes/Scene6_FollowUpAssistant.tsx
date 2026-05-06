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
import { PhoneFrame } from "../components/PhoneFrame";
import { StatusBadge } from "../components/StatusBadge";
import { GlassPlate } from "../components/GlassPlate";
import { SfxAt } from "../components/SfxAt";
import { popInProgress } from "../motion";

// =====================================================================
// SCENE 6 — AI Follow-up (v1.14 simplified, frames 975–1170)
// 195 frames @ 30fps · CONVERSATIONAL identity · 6.5s
//
// v1.14 dropped Half B (AI Assistant sheet + constellation) — Scene 6 is now
// 100% the AI follow-up flow. Stale quote → AI bot writes → sends → reply
// lands → status flips Sent→Accepted → triple-beat caption "Wrote it. Sent
// it. Won the job."
// =====================================================================

const OPEN = 0; // 0–24    open on stale quote, push-in 1.0→1.18
const ROW_HIGHLIGHT = 24; // 24–54   AI bot emerges, writes message
const BUBBLE_SEND = 54; // 54–78   send (paper airplane), settle
const REPLY_IN = 78; // 78–105  reply bubble lands
const STATUS_FLIP = 105; // 105–123 status pill flips Sent→Accepted, punch-in
const CAPTION_START = 123; // 123–183 triple-beat focus caption
const HOLD = 183; // 183–195 hold + transition prep

// Caption windows (per v1.14 spec local frames 125–180)
const CAPTION_BEATS = [
  { text: "Wrote it.", start: 125, end: 141 },
  { text: "Sent it.", start: 141, end: 161 },
  { text: "Won the job.", start: 161, end: 180 },
];

export const Scene6FollowUpAssistant: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Camera push-in: 1.0 → 1.18 over open, hold during write/send, punch to 1.25
  // at status flip, settle to 1.10 during caption, ease to 1.0 by transition.
  const cameraScale = interpolate(
    frame,
    [OPEN, ROW_HIGHLIGHT, STATUS_FLIP, STATUS_FLIP + 12, CAPTION_START + 30, HOLD + 12],
    [1.0, 1.18, 1.18, 1.25, 1.10, 1.0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE.inOutQuad,
    }
  );

  return (
    <AbsoluteFill>
      <PhoneFrame scale={cameraScale}>
        <QuotesListView frame={frame} fps={fps} />
      </PhoneFrame>

      {/* Triple-beat focus caption — glass plate to the right of phone */}
      {frame >= CAPTION_START && <TripleBeatCaption frame={frame} />}

      {/* === AUDIO === */}
      {/* CONVERSATIONAL bed (v1.11 P2) — full-scene underbed, -22 dBFS */}
      <SfxAt
        src={GEN.bedConversational}
        from={0}
        loop
        volume={(f) =>
          interpolate(f, [0, 8, 180, 195], [0, 0.08, 0.08, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
        durationInFrames={195}
      />
      {/* Stale quote alert ding */}
      <SfxAt src={SFX.notification1} from={10} volume={0.3} />
      {/* Typing dots while bot composes */}
      {[36, 39, 42, 45].map((f) => (
        <SfxAt
          key={`type-dot-${f}`}
          src={SFX.click}
          from={f}
          volume={0.2}
          playbackRate={1.4}
        />
      ))}
      {/* Send swoosh */}
      <SfxAt src={SFX.swoosh} from={BUBBLE_SEND + 4} volume={0.55} />
      {/* Reply ding */}
      <SfxAt src={SFX.notification2} from={REPLY_IN} volume={0.55} />
      {/* Achievement chime on status flip */}
      <SfxAt src={GEN.achievement} from={STATUS_FLIP + 6} volume={0.32} />
      {/* Outro drone begins ramping in late Scene 6 (per spec — bridges into Scene 7) */}
      <SfxAt
        src={GEN.outroDrone}
        from={HOLD - 12}
        volume={(f) =>
          interpolate(f, [0, 12, 24], [0, 0.16, 0.22], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
        durationInFrames={28}
      />
    </AbsoluteFill>
  );
};

// =====================================================================
// QUOTES LIST VIEW — Mrs. Patel stale quote + AI bot conversation
// =====================================================================
const QuotesListView: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const dotPulse = 0.7 + 0.3 * Math.sin((frame / 6) * Math.PI * 2);
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
      <div
        style={{
          paddingTop: 56,
          paddingLeft: 14,
          paddingRight: 14,
          paddingBottom: 12,
          background: COLOR.surface,
          borderBottom: `1px solid ${COLOR.divider}`,
        }}
      >
        <div style={{ fontSize: 22, fontWeight: 700, color: COLOR.navy }}>Quotes</div>
      </div>

      <div style={{ padding: "12px 14px" }}>
        {/* Stale quote row — pulses + AI sparkle */}
        <div
          style={{
            position: "relative",
            background: COLOR.surface,
            border: `1px solid ${COLOR.border}`,
            borderRadius: 12,
            padding: 12,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 12,
            boxShadow:
              frame >= ROW_HIGHLIGHT && frame < BUBBLE_SEND
                ? `0 0 0 2px ${COLOR.aiPurple}66, 0 8px 18px rgba(109,40,217,0.15)`
                : "none",
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: COLOR.navy }}>
              Bathroom install — Mrs. Patel
            </div>
            <div
              style={{
                fontSize: 10,
                color: COLOR.textTer,
                marginTop: 2,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span>£2,454.60</span>
              <span>·</span>
              <span>5 days ago</span>
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: COLOR.pending,
                  boxShadow: `0 0 8px rgba(245,158,11,${dotPulse})`,
                  opacity: dotPulse,
                }}
              />
            </div>
          </div>
          <StatusPillFlip frame={frame} />
        </div>

        {frame >= ROW_HIGHLIGHT && frame < HOLD && (
          <BotConversation frame={frame} fps={fps} />
        )}
        {frame >= STATUS_FLIP && frame < STATUS_FLIP + 18 && (
          <ConfettiBurst frame={frame} />
        )}
      </div>
    </div>
  );
};

const StatusPillFlip: React.FC<{ frame: number }> = ({ frame }) => {
  const t = frame - STATUS_FLIP;
  if (t < 0) return <StatusBadge status="sent" />;
  const flipP = interpolate(t, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  const yRot = flipP * 180;
  const showAccepted = flipP > 0.5;
  return (
    <div style={{ transform: `perspective(400px) rotateY(${yRot}deg)` }}>
      {showAccepted ? <StatusBadge status="accepted" /> : <StatusBadge status="sent" />}
    </div>
  );
};

const BotConversation: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  // Bot avatar emerges at ROW_HIGHLIGHT + 4 (frame 28)
  const botSp = popInProgress(frame, fps, ROW_HIGHLIGHT + 4);
  const botY = interpolate(botSp, [0, 1], [-20, 0]);
  const botScale = interpolate(botSp, [0, 1], [0.6, 1]);

  // Outgoing bubble forms at ROW_HIGHLIGHT + 10
  const bubbleT = frame - (ROW_HIGHLIGHT + 10);
  const bubbleVisible = bubbleT >= 0;
  const showText = bubbleT >= 14; // typing-dots hold for 14 frames, then text

  // Send animation at BUBBLE_SEND
  const sendT = frame - BUBBLE_SEND;
  const planeOpacity = interpolate(sendT, [0, 4, 14], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const planeX = interpolate(sendT, [0, 14], [0, 220]);

  // Reply bubble at REPLY_IN
  const replyT = frame - REPLY_IN;
  const replySp = popInProgress(frame, fps, REPLY_IN);
  const replyOpacity = replyT < 0 ? 0 : interpolate(replySp, [0, 1], [0, 1]);
  const replyScale = replyT < 0 ? 0.6 : interpolate(replySp, [0, 1], [0.6, 1]);

  return (
    <div style={{ marginTop: 10, position: "relative" }}>
      <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
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
            fontSize: 13,
            fontWeight: 800,
            transform: `translateY(${botY}px) scale(${botScale})`,
            flexShrink: 0,
            boxShadow: `0 0 12px rgba(109,40,217,0.5)`,
          }}
        >
          ✦
        </div>
        {bubbleVisible && (
          <div
            style={{
              background: COLOR.aiPurpleBg,
              borderRadius: 14,
              padding: "8px 12px",
              maxWidth: 240,
              fontSize: 11,
              fontWeight: 500,
              color: COLOR.aiPurple,
              lineHeight: 1.4,
            }}
          >
            {showText ? (
              <>Hi Mrs. Patel — just checking in on the bathroom quote, want me to schedule it in?</>
            ) : (
              <TypingDots />
            )}
          </div>
        )}
      </div>

      {sendT >= 0 && sendT < 14 && (
        <div
          style={{
            position: "absolute",
            top: 4,
            left: "60%",
            fontSize: 18,
            color: COLOR.blue,
            opacity: planeOpacity,
            transform: `translateX(${planeX}px)`,
          }}
        >
          ✈
        </div>
      )}

      {replyT >= 0 && (
        <div
          style={{
            background: COLOR.acceptedBg,
            borderRadius: 14,
            padding: "8px 12px",
            maxWidth: 200,
            fontSize: 11,
            fontWeight: 600,
            color: COLOR.accepted,
            opacity: replyOpacity,
            transform: `scale(${replyScale})`,
            transformOrigin: "left top",
            display: "inline-block",
            boxShadow: "0 0 12px rgba(21,128,61,0.3)",
          }}
        >
          ✦ Yes please — this Saturday?
        </div>
      )}
    </div>
  );
};

const TypingDots: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <span style={{ display: "inline-flex", gap: 3 }}>
      {[0, 1, 2].map((i) => {
        const opacity =
          0.3 + 0.7 * Math.max(0, Math.sin(((frame - i * 2) / 5) * Math.PI * 2));
        return (
          <span
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: COLOR.aiPurple,
              opacity,
              display: "inline-block",
            }}
          />
        );
      })}
    </span>
  );
};

const ConfettiBurst: React.FC<{ frame: number }> = ({ frame }) => {
  const t = frame - STATUS_FLIP;
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i * 60 - 30) * (Math.PI / 180);
        const dist = interpolate(t, [0, 12], [0, 60], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE.outCubic,
        });
        const opacity = interpolate(t, [0, 8, 16], [1, 0.8, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 28,
              right: 30,
              width: 6,
              height: 6,
              background: COLOR.accepted,
              borderRadius: 1,
              transform: `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px) rotate(${i * 60}deg)`,
              opacity,
            }}
          />
        );
      })}
    </>
  );
};

// =====================================================================
// TRIPLE-BEAT CAPTION — "Wrote it. Sent it. Won the job."
// Each phrase types into its own line with a 4-frame breath beat between.
// =====================================================================
const TripleBeatCaption: React.FC<{ frame: number }> = ({ frame }) => {
  const enter = interpolate(frame, [CAPTION_START, CAPTION_START + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 1240,
        top: 460,
        width: 460,
        opacity: enter,
      }}
    >
      <GlassPlate radius={16}>
        <div
          style={{
            padding: "16px 20px",
            fontFamily: "Inter, system-ui",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {CAPTION_BEATS.map((beat, i) => {
            if (frame < beat.start) return null;
            const visible = Math.min(
              beat.text.length,
              Math.floor(((frame - beat.start) / (beat.end - beat.start)) * beat.text.length)
            );
            const showCursor = visible < beat.text.length;
            // Final beat ("Won the job.") gets a subtle scale-pulse on landing
            const isLast = i === CAPTION_BEATS.length - 1;
            const pulseT = frame - beat.end;
            const pulseScale =
              isLast && pulseT >= 0 && pulseT <= 8
                ? interpolate(pulseT, [0, 4, 8], [1, 1.06, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  })
                : 1;
            return (
              <div
                key={i}
                style={{
                  fontSize: i < 2 ? 22 : 26,
                  fontWeight: i < 2 ? 600 : 700,
                  color: i < 2 ? "rgba(255,255,255,0.85)" : "#fff",
                  letterSpacing: -0.3,
                  display: "flex",
                  alignItems: "baseline",
                  gap: 4,
                  transform: `scale(${pulseScale})`,
                  transformOrigin: "left center",
                  textShadow:
                    isLast && visible >= beat.text.length
                      ? "0 0 14px rgba(109,40,217,0.45)"
                      : "none",
                }}
              >
                <span>{beat.text.slice(0, visible)}</span>
                {showCursor && (
                  <span
                    style={{
                      display: "inline-block",
                      width: 2,
                      height: i < 2 ? 22 : 26,
                      background: "rgba(255,255,255,0.7)",
                      opacity: Math.floor(frame / 7) % 2 === 0 ? 1 : 0,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </GlassPlate>
    </div>
  );
};
