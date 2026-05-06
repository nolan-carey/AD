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
import { StatusBadge } from "../components/StatusBadge";
import { SfxAt } from "../components/SfxAt";
import { popInProgress } from "../motion";

// =====================================================================
// SCENE 6 — AI Follow-up + AI Assistant brain (frames 654–804 = local 0–150)
// Half A (0–66): Mrs. Patel quote row → AI bot bubble → reply → Sent→Accepted
// Half B (66–150): AI Assistant sheet rises (real Dashboard sheetStyles) → 5
// rows cascade → camera dollies back, 6 STYLIZED feature thumbnails orbit
// the phone (no reference PNGs — every glyph rendered as components).
// =====================================================================

const QUOTES_LIST_IN = 0;
const ROW_HIGHLIGHT = 12;
const BUBBLE_SEND = 30;
const STATUS_FLIP = 48;
const ASSISTANT_RISE = 66;
const ROW_CASCADE = 84;
const PULL_BACK = 126;

const ASSISTANT_ROWS = [
  { title: "New voice quote", subtitle: "Speak the job, AI builds the quote", iconBg: COLOR.blue, glyph: "🎙" },
  { title: "New voice customer", subtitle: "Add a customer in one sentence", iconBg: COLOR.blue, glyph: "✦" },
  { title: "See jobs on the map", subtitle: "Drive less, work more", iconBg: "#22C55E", glyph: "📍" },
  { title: "Follow up on a quote", subtitle: "AI nudges stale quotes", iconBg: COLOR.aiPurple, glyph: "↗" },
  { title: "Job summary", subtitle: "End-of-day recap", iconBg: COLOR.navy, glyph: "≡" },
];

export const Scene6FollowUpAssistant: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Camera moves:
  // Half A: gentle breathing 1.0 → 1.04 around the conversation, settle by status flip
  const halfABreath = interpolate(frame, [ROW_HIGHLIGHT, BUBBLE_SEND, STATUS_FLIP + 8], [1.0, 1.04, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOutQuad,
  });
  // Pull-back at end: 1.0 → 0.85 (real "camera dolly" feel)
  const phoneScale = interpolate(frame, [PULL_BACK, PULL_BACK + 18], [1.0, 0.85], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOutQuad,
  });
  const cameraScale = halfABreath * phoneScale;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${COLOR.navy} 0%, ${COLOR.surfaceDark} 100%)`,
      }}
    >
      <PhoneFrame scale={cameraScale}>
        {frame < ASSISTANT_RISE && <QuotesListView frame={frame} fps={fps} />}
        {frame >= ASSISTANT_RISE && <AssistantSheetView frame={frame} fps={fps} />}
      </PhoneFrame>

      {/* Stylized constellation thumbnails — outside phone, only during PULL_BACK */}
      {frame >= PULL_BACK && <ConstellationThumbs frame={frame} />}

      {/* === AUDIO === */}
      <SfxAt
        src={SFX.notification2}
        from={ROW_HIGHLIGHT}
        volume={0.45}
        playbackRate={0.95}
      />
      <SfxAt
        src={SFX.riser}
        from={ROW_HIGHLIGHT + 6}
        volume={(f) =>
          interpolate(f, [0, 6, 12, 18], [0, 0.18, 0.18, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
        playbackRate={1.3}
        durationInFrames={20}
      />
      {[0, 3].map((o, i) => (
        <SfxAt
          key={`typing-${i}`}
          src={SFX.click}
          from={ROW_HIGHLIGHT + 12 + o}
          volume={0.2}
          playbackRate={1.4}
        />
      ))}
      <SfxAt src={SFX.swoosh} from={BUBBLE_SEND + 6} volume={0.55} />
      <SfxAt
        src={SFX.notification2}
        from={BUBBLE_SEND + 12}
        volume={0.55}
      />
      <SfxAt
        src={SFX.notification1}
        from={STATUS_FLIP + 6}
        volume={0.6}
        playbackRate={1.4}
      />
      <SfxAt src={SFX.swoosh} from={ASSISTANT_RISE} volume={0.85} />
      {ASSISTANT_ROWS.map((_, i) => (
        <SfxAt
          key={`row-tick-${i}`}
          src={SFX.click}
          from={ROW_CASCADE + i * 4}
          volume={0.35}
          playbackRate={1.1 + i * 0.04}
        />
      ))}
      <SfxAt
        src={SFX.riser}
        from={PULL_BACK - 10}
        volume={(f) =>
          interpolate(f, [0, 10, 30, 36], [0, 0.18, 0.28, 0.32], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
        playbackRate={1.0}
        durationInFrames={36}
      />
    </AbsoluteFill>
  );
};

// =====================================================================
// HALF A — Quotes list with the AI follow-up
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

        {frame >= ROW_HIGHLIGHT && frame < STATUS_FLIP && (
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
  if (t < 0) {
    return <StatusBadge status="sent" />;
  }
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
  const botT = frame - ROW_HIGHLIGHT;
  const botSp = popInProgress(frame, fps, ROW_HIGHLIGHT);
  const botY = interpolate(botSp, [0, 1], [-20, 0]);
  const botScale = interpolate(botSp, [0, 1], [0.6, 1]);

  const bubbleT = frame - (ROW_HIGHLIGHT + 6);
  const bubbleVisible = bubbleT >= 0;
  const showText = bubbleT >= 12;

  const sendT = frame - BUBBLE_SEND;
  const planeOpacity = interpolate(sendT, [0, 4, 12], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const planeX = interpolate(sendT, [0, 12], [0, 200]);

  const replyT = frame - (BUBBLE_SEND + 12);
  const replySp = popInProgress(frame, fps, BUBBLE_SEND + 12);
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

      {sendT >= 0 && sendT < 12 && (
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
// HALF B — AI Assistant sheet (real Dashboard sheetStyles)
// =====================================================================
const AssistantSheetView: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const t = frame - ASSISTANT_RISE;
  const riseP = interpolate(t, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  const yOffset = interpolate(riseP, [0, 1], [600, 0]);

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
      {/* Faded dashboard backdrop */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: COLOR.surfaceDark,
          opacity: 0.5,
        }}
      />
      {/* Real sheet shape — borderTopRadius 24, padding "10px 16px 28px" */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 80,
          bottom: 0,
          background: COLOR.surface,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          padding: "10px 16px",
          transform: `translateY(${yOffset}px)`,
          boxShadow: "0 -8px 24px rgba(0,0,0,0.18)",
        }}
      >
        <div
          style={{
            alignSelf: "center",
            width: 36,
            height: 4,
            borderRadius: 2,
            background: COLOR.border,
            margin: "0 auto 16px",
          }}
        />
        {/* AI ASSISTANT badge — real: bg ai purple solid, white text 8px 600 */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            background: COLOR.aiPurple,
            color: "#fff",
            borderRadius: 6,
            padding: "3px 8px",
            fontSize: 8,
            fontWeight: 600,
            letterSpacing: 0.8,
            marginBottom: 8,
          }}
        >
          ✦ AI ASSISTANT
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: COLOR.navy, marginBottom: 2 }}>
          What do you need?
        </div>
        <div style={{ fontSize: 12, color: COLOR.textSec, fontWeight: 400, marginBottom: 14 }}>
          Kiva AI can help you get it done faster
        </div>
        {ASSISTANT_ROWS.map((row, i) => {
          const start = ROW_CASCADE + i * 4;
          const sp = popInProgress(frame, fps, start);
          const opacity = interpolate(sp, [0, 1], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const y = interpolate(sp, [0, 1], [12, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          // highlight pulse cycles after all land
          const pulseStart = ROW_CASCADE + ASSISTANT_ROWS.length * 4 + i * 6;
          const pulseT = frame - pulseStart;
          const pulseP =
            pulseT >= 0 && pulseT < 8
              ? interpolate(pulseT, [0, 4, 8], [0, 1, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })
              : 0;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                paddingTop: 12,
                paddingBottom: 12,
                borderBottom: i < ASSISTANT_ROWS.length - 1 ? `1px solid ${COLOR.divider}` : "none",
                opacity,
                transform: `translateY(${y}px)`,
                background: pulseP > 0 ? `rgba(59,130,246,${0.08 * pulseP})` : "transparent",
                borderRadius: pulseP > 0 ? 8 : 0,
                paddingLeft: pulseP > 0 ? 8 : 0,
                paddingRight: pulseP > 0 ? 8 : 0,
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: row.iconBg,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {row.glyph}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLOR.navy, marginBottom: 2 }}>
                  {row.title}
                </div>
                <div style={{ fontSize: 11, color: COLOR.textSec }}>{row.subtitle}</div>
              </div>
              <div style={{ fontSize: 14, color: COLOR.textTer }}>›</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// =====================================================================
// CONSTELLATION — 6 STYLIZED feature thumbs (no PNGs, all components)
// =====================================================================
const ConstellationThumbs: React.FC<{ frame: number }> = ({ frame }) => {
  const t = frame - PULL_BACK;
  const enterP = interpolate(t, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });

  const thumbs: { kind: ThumbKind; angle: number; dist: number }[] = [
    { kind: "customer", angle: -150, dist: 540 },
    { kind: "quote", angle: -100, dist: 580 },
    { kind: "map", angle: -45, dist: 540 },
    { kind: "expense", angle: 30, dist: 560 },
    { kind: "followup", angle: 90, dist: 580 },
    { kind: "assistant", angle: 150, dist: 540 },
  ];

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {thumbs.map((t, i) => {
        const a = (t.angle * Math.PI) / 180;
        const x = Math.cos(a) * t.dist * enterP;
        const y = Math.sin(a) * t.dist * enterP;
        const scale = 0.8 + 0.2 * enterP;
        const rotate = t.angle * 0.05;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 130,
              height: 280,
              transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale}) rotate(${rotate}deg)`,
              opacity: enterP,
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 18px 40px rgba(0,0,0,0.45)",
              border: `2px solid rgba(255,255,255,0.08)`,
              background: COLOR.bg,
            }}
          >
            <ThumbContent kind={t.kind} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

type ThumbKind = "customer" | "quote" | "map" | "expense" | "followup" | "assistant";

const ThumbContent: React.FC<{ kind: ThumbKind }> = ({ kind }) => {
  const headerBar = (
    <div
      style={{
        height: 28,
        background: COLOR.navy,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 8px",
      }}
    >
      <span style={{ fontSize: 7, color: "#fff", fontWeight: 600 }}>9:41</span>
      <span style={{ fontSize: 7, color: "rgba(255,255,255,0.7)" }}>•••</span>
    </div>
  );
  if (kind === "customer") {
    return (
      <>
        {headerBar}
        <div style={{ padding: 10, fontFamily: "Inter, system-ui" }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: COLOR.navy, marginBottom: 6 }}>
            New Customer
          </div>
          <div
            style={{
              background: COLOR.aiPurpleBg,
              borderRadius: 4,
              padding: "4px 6px",
              fontSize: 6,
              color: COLOR.aiPurple,
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            ✦ Use AI
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 18 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                background: COLOR.navy,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 14,
                boxShadow: `0 0 0 6px rgba(59,130,246,0.18), 0 0 0 12px rgba(59,130,246,0.08)`,
              }}
            >
              🎙
            </div>
          </div>
        </div>
      </>
    );
  }
  if (kind === "quote") {
    return (
      <>
        {headerBar}
        <div style={{ padding: 10, fontFamily: "Inter, system-ui" }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: COLOR.navy, marginBottom: 6 }}>
            Quote Review
          </div>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 6,
                color: COLOR.textSec,
                padding: "3px 0",
                borderBottom: `1px solid ${COLOR.divider}`,
              }}
            >
              <span>Line {i}</span>
              <span style={{ color: COLOR.navy, fontWeight: 600 }}>£XX</span>
            </div>
          ))}
          <div
            style={{
              marginTop: 8,
              background: COLOR.navy,
              color: "#fff",
              borderRadius: 4,
              padding: "5px 6px",
              display: "flex",
              justifyContent: "space-between",
              fontSize: 8,
              fontWeight: 700,
            }}
          >
            <span>Total</span>
            <span>£2,454.60</span>
          </div>
        </div>
      </>
    );
  }
  if (kind === "map") {
    return (
      <>
        {headerBar}
        <div
          style={{
            position: "relative",
            height: "calc(100% - 28px)",
            background: "linear-gradient(135deg, #DBEAFE 0%, #E0F2FE 100%)",
          }}
        >
          {[
            { x: 30, y: 60, color: "#7CA0CB" },
            { x: 70, y: 100, color: "#A89BC9" },
            { x: 90, y: 160, color: "#8FB99D" },
          ].map((p, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: p.x,
                top: p.y,
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: p.color,
                border: "2px solid #fff",
                boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            />
          ))}
        </div>
      </>
    );
  }
  if (kind === "expense") {
    return (
      <>
        {headerBar}
        <div style={{ padding: 10, fontFamily: "Inter, system-ui" }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: COLOR.navy, marginBottom: 6 }}>
            New Expense
          </div>
          <div
            style={{
              background: "#F8FAFC",
              border: `1px solid ${COLOR.border}`,
              borderRadius: 4,
              padding: 4,
              display: "flex",
              gap: 6,
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <div style={{ width: 16, height: 20, background: "#FAFAFA", borderRadius: 2 }} />
            <span style={{ fontSize: 6, color: COLOR.textSec, fontWeight: 600 }}>Receipt</span>
          </div>
          <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            {[
              { label: "Construction", bg: COLOR.navy, color: "#fff" },
              { label: "Parts", bg: COLOR.surface, color: COLOR.textSec },
            ].map((c, i) => (
              <div
                key={i}
                style={{
                  background: c.bg,
                  color: c.color,
                  fontSize: 6,
                  fontWeight: 600,
                  padding: "2px 5px",
                  borderRadius: 8,
                  border: `1px solid ${c.bg === COLOR.surface ? COLOR.border : c.bg}`,
                }}
              >
                {c.label}
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }
  if (kind === "followup") {
    return (
      <>
        {headerBar}
        <div style={{ padding: 10, fontFamily: "Inter, system-ui" }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: COLOR.navy, marginBottom: 6 }}>
            Follow-up
          </div>
          <div style={{ display: "flex", gap: 4, alignItems: "flex-start", marginBottom: 6 }}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                background: `linear-gradient(135deg, ${COLOR.aiPurple}, ${COLOR.blue})`,
                color: "#fff",
                fontSize: 6,
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              ✦
            </div>
            <div
              style={{
                background: COLOR.aiPurpleBg,
                color: COLOR.aiPurple,
                fontSize: 6,
                padding: "3px 5px",
                borderRadius: 6,
                fontWeight: 500,
                lineHeight: 1.3,
              }}
            >
              Hi Mrs. Patel — checking in…
            </div>
          </div>
          <div
            style={{
              background: COLOR.acceptedBg,
              color: COLOR.accepted,
              fontSize: 6,
              padding: "3px 5px",
              borderRadius: 6,
              fontWeight: 600,
              alignSelf: "flex-start",
              display: "inline-block",
            }}
          >
            ✦ Yes please
          </div>
        </div>
      </>
    );
  }
  // assistant
  return (
    <>
      {headerBar}
      <div style={{ padding: 10, fontFamily: "Inter, system-ui" }}>
        <div
          style={{
            background: COLOR.aiPurple,
            color: "#fff",
            fontSize: 6,
            fontWeight: 700,
            padding: "2px 4px",
            borderRadius: 3,
            alignSelf: "flex-start",
            display: "inline-block",
            marginBottom: 4,
            letterSpacing: 0.4,
          }}
        >
          ✦ AI
        </div>
        <div style={{ fontSize: 9, fontWeight: 700, color: COLOR.navy, marginBottom: 8 }}>
          What do you need?
        </div>
        {ASSISTANT_ROWS.slice(0, 4).map((row, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "3px 0",
              borderBottom: i < 3 ? `1px solid ${COLOR.divider}` : "none",
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 3,
                background: row.iconBg,
                color: "#fff",
                fontSize: 6,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {row.glyph}
            </div>
            <span style={{ fontSize: 6, color: COLOR.navy, fontWeight: 600 }}>{row.title}</span>
          </div>
        ))}
      </div>
    </>
  );
};
