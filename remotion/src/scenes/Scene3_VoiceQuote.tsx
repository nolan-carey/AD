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
import { SfxAt } from "../components/SfxAt";

// =====================================================================
// SCENE 3 — Voice-to-Quote walkthrough · Part 1 (v1.8, frames 656–761)
// 105 frames @ 30fps · 3.5s
//
// User direction 2026-05-12: stop just sliding a phone with static text.
// Build a real walkthrough — tap the AI FAB, morph to Voice Quote
// screen, tap mic, capture live transcription. Multiple mini-beats.
//
// Beats (local frames):
//   F0–F22   Dashboard chrome, FAB pulses, cursor arcs in
//   F22–F26  Tap FAB — ripple + click
//   F24–F40  Screen morph (dashboard slides down, VoiceQuote slides up)
//   F40–F60  VoiceQuote settled, "Tap to record" hint, camera tilts
//   F60–F68  Tap mic — flips to red recording, "Listening…" appears
//   F68–F100 Live transcription with keyword highlights
//   F100–F105 Camera dolly in, fade-prep for Scene 4
//
// Real Kiva chrome (sourced verbatim from /Users/nolancarey/kiva/Frontend):
//   • Dashboard: navy top header, 4 stat tiles, activity feed, AI FAB
//   • VoiceQuote: status header, mic stack, "Tap to record"
//   • AI FAB = 52px blue circle, AI badge top-right, pulse ring 1.45x
// =====================================================================

const TAP_FAB_FRAME = 22;
const MORPH_START = 24;
const MORPH_END = 40;
const SETTLE_END = 60;
const TAP_MIC_FRAME = 60;
const REC_PHASE_END = 68;
const TRANSCRIBE_START = 68;
const TRANSCRIBE_END = 100;
const SCENE_END = 105;

// Keyword highlights pulse blue. Whitespace tokens preserve spacing.
const TRANSCRIPT_TOKENS: { text: string; hl?: boolean }[] = [
  { text: "Quote for " },
  { text: "John Smith", hl: true },
  { text: " — " },
  { text: "bathroom leak", hl: true },
  { text: " — " },
  { text: "£180", hl: true },
  { text: " labour + " },
  { text: "£100", hl: true },
  { text: " materials." },
];

export const Scene3VoiceQuote: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Camera moves: opening 3/4 angle → straighten as we focus on the mic →
  // gentle dolly-in during transcription.
  const cameraRotY = interpolate(
    frame,
    [0, 24, 60, SCENE_END],
    [-10, -8, -4, -2],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOutQuad }
  );
  const cameraRotX = interpolate(frame, [0, 60], [4, 1.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOutQuad,
  });
  const cameraScale = interpolate(
    frame,
    [0, 40, 70, SCENE_END],
    [0.94, 1.0, 1.04, 1.08],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOutQuad }
  );
  const cameraX = interpolate(frame, [0, 40], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOutQuad,
  });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <PhoneFrame
        rotateY={cameraRotY}
        rotateX={cameraRotX}
        translateX={cameraX}
        scale={cameraScale}
      >
        <ScreenStack frame={frame} fps={fps} />
      </PhoneFrame>

      {/* SFX */}
      <SfxAt src={SFX.click} from={TAP_FAB_FRAME} volume={0.45} />
      <SfxAt src={SFX.swoosh} from={MORPH_START} volume={0.35} />
      <SfxAt src={SFX.click} from={TAP_MIC_FRAME} volume={0.5} />
      <SfxAt
        src={SFX.notification1}
        from={TAP_MIC_FRAME}
        volume={0.35}
        playbackRate={Math.pow(2, 7 / 12)}
      />
    </AbsoluteFill>
  );
};

// =====================================================================
// SCREEN STACK — dashboard above, voice quote below, slides between them
// =====================================================================
const ScreenStack: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  // Morph: dashboard slides UP and out, voice quote slides up into view.
  const morphP = interpolate(frame, [MORPH_START, MORPH_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOutQuad,
  });
  const dashOffset = -morphP * 852; // off-screen up
  const voiceOffset = (1 - morphP) * 852; // starts below

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
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateY(${dashOffset}px)`,
        }}
      >
        <DashboardMock frame={frame} />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateY(${voiceOffset}px)`,
        }}
      >
        <VoiceQuoteMock frame={frame} fps={fps} />
      </div>
    </div>
  );
};

// =====================================================================
// DASHBOARD MOCK — Kiva home (navy header, stat grid, activity, AI FAB)
// =====================================================================
const DashboardMock: React.FC<{ frame: number }> = ({ frame }) => {
  const tapP = spring({
    frame: frame - TAP_FAB_FRAME,
    fps: 30,
    config: SPRING.bouncy,
    durationInFrames: 8,
  });
  // FAB depresses on tap (scale 1 → 0.86 → 1)
  const fabPressed = frame >= TAP_FAB_FRAME && frame < TAP_FAB_FRAME + 4;
  const fabScale = fabPressed ? 0.86 : 1;
  // FAB ripple from tap
  const rippleP = interpolate(frame, [TAP_FAB_FRAME, TAP_FAB_FRAME + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });

  return (
    <div style={{ width: "100%", height: "100%", background: COLOR.bg }}>
      {/* Status-bar gutter handled by PhoneFrame; start at y=50 */}
      <div style={{ paddingTop: 56 }} />

      {/* Header — "Today" + avatar */}
      <div
        style={{
          padding: "8px 16px 14px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ fontSize: 12, color: COLOR.textSec, fontWeight: 500 }}>
            Good morning, Aaron
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: COLOR.navy }}>
            Today
          </div>
        </div>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 17,
            background: COLOR.aiPurpleBg,
            color: COLOR.aiPurple,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          AP
        </div>
      </div>

      {/* 2x2 stat grid */}
      <div
        style={{
          padding: "0 12px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
        }}
      >
        <StatTile label="This Month" value="£4,280" tone={COLOR.paid} delay={2} frame={frame} />
        <StatTile label="Outstanding" value="£1,160" tone={COLOR.pending} delay={4} frame={frame} />
        <StatTile label="Quotes Sent" value="12" tone={COLOR.sentText} delay={6} frame={frame} />
        <StatTile label="Jobs Active" value="5" tone={COLOR.aiPurple} delay={8} frame={frame} />
      </div>

      {/* Activity feed */}
      <div style={{ padding: "16px 16px 0" }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: COLOR.textTer,
            textTransform: "uppercase",
            letterSpacing: 0.6,
            marginBottom: 8,
          }}
        >
          Recent activity
        </div>
        <ActivityRow
          badge="Voice Quote"
          badgeColor={COLOR.aiPurple}
          badgeBg={COLOR.aiPurpleBg}
          title="Mrs Patel — boiler service"
          meta="Yesterday · £340"
        />
        <ActivityRow
          badge="Paid"
          badgeColor={COLOR.paid}
          badgeBg={"#DCFCE7"}
          title="James Reilly — kitchen tap"
          meta="2 days ago · £125"
        />
        <ActivityRow
          badge="Sent"
          badgeColor={COLOR.sentText}
          badgeBg={COLOR.sentBg}
          title="Sarah Kahn — shower install"
          meta="3 days ago · £980"
        />
      </div>

      {/* AI FAB — bottom-right (Kiva spec: 52px blue, AI badge, pulse ring) */}
      <div
        style={{
          position: "absolute",
          right: 22,
          bottom: 110,
          width: 52,
          height: 52,
        }}
      >
        {/* Pulse ring — 1.45× scale @ 60f period (idle) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: COLOR.blue,
            transform: `scale(${interpolate(
              (frame % 60) / 60,
              [0, 1],
              [1.0, 1.45]
            )})`,
            opacity: interpolate((frame % 60) / 60, [0, 1], [0.4, 0]),
          }}
        />
        {/* Tap ripple — fired on TAP_FAB_FRAME */}
        {frame >= TAP_FAB_FRAME && frame < TAP_FAB_FRAME + 14 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: `2px solid ${COLOR.blue}`,
              transform: `scale(${interpolate(rippleP, [0, 1], [1, 2.4])})`,
              opacity: interpolate(rippleP, [0, 1], [0.7, 0]),
            }}
          />
        )}
        {/* FAB core */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: COLOR.blue,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${fabScale})`,
            boxShadow: "0 6px 16px rgba(59,130,246,0.45)",
            transition: "transform 60ms ease-out",
          }}
        >
          <SparklesGlyph />
        </div>
        {/* AI badge top-right */}
        <div
          style={{
            position: "absolute",
            top: -4,
            right: -4,
            background: COLOR.aiPurple,
            color: "#fff",
            fontSize: 8,
            fontWeight: 800,
            padding: "2px 5px",
            borderRadius: 6,
            letterSpacing: 0.4,
          }}
        >
          AI
        </div>
      </div>

      {/* Cursor arc — points to FAB, taps on TAP_FAB_FRAME */}
      <Cursor frame={frame} mode="fab" />

      {/* Suppress unused spring lint */}
      <span style={{ display: "none" }}>{tapP}</span>
    </div>
  );
};

const StatTile: React.FC<{
  label: string;
  value: string;
  tone: string;
  delay: number;
  frame: number;
}> = ({ label, value, tone, delay, frame }) => {
  const enter = interpolate(frame, [delay, delay + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  return (
    <div
      style={{
        background: COLOR.surface,
        border: `1px solid ${COLOR.border}`,
        borderRadius: 12,
        padding: "12px 12px",
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [10, 0])}px)`,
        boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
      }}
    >
      <div style={{ fontSize: 9, color: COLOR.textTer, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4 }}>
        {label}
      </div>
      <div style={{ fontSize: 18, color: tone, fontWeight: 800, marginTop: 4 }}>
        {value}
      </div>
    </div>
  );
};

const ActivityRow: React.FC<{
  badge: string;
  badgeColor: string;
  badgeBg: string;
  title: string;
  meta: string;
}> = ({ badge, badgeColor, badgeBg, title, meta }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      padding: "8px 0",
      borderBottom: `1px solid ${COLOR.divider}`,
    }}
  >
    <div
      style={{
        background: badgeBg,
        color: badgeColor,
        fontSize: 9,
        fontWeight: 700,
        padding: "3px 6px",
        borderRadius: 6,
        marginRight: 10,
        whiteSpace: "nowrap",
      }}
    >
      {badge}
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: COLOR.navy, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {title}
      </div>
      <div style={{ fontSize: 10, color: COLOR.textSec, fontWeight: 500 }}>
        {meta}
      </div>
    </div>
  </div>
);

const SparklesGlyph: React.FC = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z"
      fill="white"
    />
    <path
      d="M18.5 14l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1z"
      fill="white"
      opacity="0.85"
    />
  </svg>
);

// =====================================================================
// VOICE QUOTE MOCK — mic-centred screen with live transcription
// =====================================================================
const VoiceQuoteMock: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const recording = frame >= TAP_MIC_FRAME + 2;
  // Mic depresses on tap
  const micPressed = frame >= TAP_MIC_FRAME && frame < TAP_MIC_FRAME + 4;
  const micPress = micPressed ? 0.9 : 1;
  // Mic "hero" mode lift after recording starts
  const micLift = interpolate(frame, [REC_PHASE_END, REC_PHASE_END + 14], [0, -40], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });

  return (
    <div style={{ width: "100%", height: "100%", background: COLOR.bg, position: "relative" }}>
      {/* Status-bar gutter */}
      <div style={{ paddingTop: 56 }} />

      {/* Top nav: back chevron + screen title */}
      <div
        style={{
          padding: "8px 16px 0",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div style={{ fontSize: 18, color: COLOR.navy, fontWeight: 700 }}>
          ←
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, color: COLOR.navy }}>
          New Quote
        </div>
      </div>

      {/* Step pill */}
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
          ✦ Step 1 — Speak the job
        </div>
      </div>

      {/* Headline / hint */}
      <div style={{ padding: "10px 16px 0" }}>
        {!recording ? (
          <div style={{ fontSize: 18, fontWeight: 800, color: COLOR.navy, lineHeight: 1.25 }}>
            Tap to record.<br />Kiva writes the quote.
          </div>
        ) : (
          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: COLOR.navy,
              lineHeight: 1.25,
              opacity: interpolate(frame, [TAP_MIC_FRAME + 2, TAP_MIC_FRAME + 10], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            Listening…{" "}
            <span style={{ color: COLOR.overdue, fontWeight: 800 }}>●</span>
          </div>
        )}
      </div>

      {/* Mic stack — centered */}
      <div
        style={{
          position: "absolute",
          top: "44%",
          left: "50%",
          transform: `translate(-50%, calc(-50% + ${micLift}px)) scale(${micPress})`,
          transition: "transform 60ms ease-out",
        }}
      >
        <MicButton startFrame={0} recording={recording} size="hero" />
      </div>

      {/* Tap ripple on mic */}
      {frame >= TAP_MIC_FRAME && frame < TAP_MIC_FRAME + 16 && (
        <div
          style={{
            position: "absolute",
            top: "44%",
            left: "50%",
            width: 130,
            height: 130,
            borderRadius: "50%",
            border: `2px solid ${COLOR.overdue}`,
            transform: `translate(-50%, -50%) scale(${interpolate(
              frame - TAP_MIC_FRAME,
              [0, 16],
              [1, 2.4]
            )})`,
            opacity: interpolate(frame - TAP_MIC_FRAME, [0, 16], [0.8, 0]),
            pointerEvents: "none",
          }}
        />
      )}

      {/* Live waveform — under mic during recording */}
      {recording && frame < TRANSCRIBE_START + 6 && (
        <Waveform frame={frame - TAP_MIC_FRAME} />
      )}

      {/* Transcription card — slides up during transcription */}
      {frame >= TRANSCRIBE_START && (
        <TranscriptionCard frame={frame - TRANSCRIBE_START} />
      )}

      {/* Cursor arc — points to mic, taps on TAP_MIC_FRAME */}
      <Cursor frame={frame} mode="mic" />

      {/* Suppress unused */}
      <span style={{ display: "none" }}>{fps}</span>
    </div>
  );
};

const Waveform: React.FC<{ frame: number }> = ({ frame }) => {
  const bars = 18;
  return (
    <div
      style={{
        position: "absolute",
        top: "60%",
        left: "50%",
        transform: "translate(-50%, 0)",
        width: 260,
        height: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        opacity: interpolate(frame, [0, 6], [0, 1], { extrapolateRight: "clamp" }),
      }}
    >
      {Array.from({ length: bars }).map((_, i) => {
        const h = 6 + 20 * Math.abs(Math.sin(frame / 4 + i * 0.6));
        return (
          <div
            key={i}
            style={{
              width: 4,
              height: h,
              borderRadius: 2,
              background: COLOR.overdue,
              opacity: 0.85,
            }}
          />
        );
      })}
    </div>
  );
};

const TranscriptionCard: React.FC<{ frame: number }> = ({ frame }) => {
  // Enter spring
  const enter = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  // Reveal tokens word-by-word
  const totalTokens = TRANSCRIPT_TOKENS.length;
  const tokenReveal = Math.min(
    totalTokens,
    Math.max(0, Math.floor((frame - 6) / 3))
  );
  const cursorOn = Math.floor((frame % 12) / 6) === 0;

  return (
    <div
      style={{
        position: "absolute",
        left: 14,
        right: 14,
        bottom: 84,
        background: COLOR.surface,
        border: `1px solid ${COLOR.border}`,
        borderRadius: 14,
        padding: "12px 14px",
        boxShadow: "0 6px 18px rgba(15,23,42,0.10)",
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [22, 0])}px)`,
      }}
    >
      <div
        style={{
          fontSize: 9,
          fontWeight: 700,
          color: COLOR.aiPurple,
          textTransform: "uppercase",
          letterSpacing: 0.6,
          marginBottom: 6,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: COLOR.overdue,
            display: "inline-block",
            opacity: Math.floor((frame % 18) / 9) === 0 ? 1 : 0.3,
          }}
        />
        Transcribing…
      </div>
      <div style={{ fontSize: 14, color: COLOR.navy, lineHeight: 1.5, fontWeight: 500 }}>
        {TRANSCRIPT_TOKENS.slice(0, tokenReveal).map((t, i) => {
          if (!t.hl) return <span key={i}>{t.text}</span>;
          return (
            <span
              key={i}
              style={{
                color: COLOR.sentText,
                fontWeight: 800,
                background: COLOR.sentBg,
                padding: "1px 6px",
                borderRadius: 5,
                marginRight: 1,
                marginLeft: 1,
              }}
            >
              {t.text}
            </span>
          );
        })}
        {tokenReveal < totalTokens && (
          <span
            style={{
              display: "inline-block",
              width: 2,
              height: 14,
              background: COLOR.navy,
              marginLeft: 2,
              verticalAlign: "text-bottom",
              opacity: cursorOn ? 1 : 0,
            }}
          />
        )}
      </div>
    </div>
  );
};

// =====================================================================
// CURSOR — thumb pointer that arcs in then taps
// =====================================================================
const Cursor: React.FC<{ frame: number; mode: "fab" | "mic" }> = ({
  frame,
  mode,
}) => {
  if (mode === "fab") {
    // Arrive frames 6→20, tap @ 22
    if (frame < 4 || frame > TAP_FAB_FRAME + 6) return null;
    const p = interpolate(frame, [4, 20], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE.outCubic,
    });
    const tapPulse =
      frame >= TAP_FAB_FRAME && frame < TAP_FAB_FRAME + 6
        ? 1 - (frame - TAP_FAB_FRAME) / 6
        : 0;
    // FAB inside dashboard at right 22 + 26 (center) = right inset 48 from
    // phone right (393). So x ~ 393 - 48 = 345. y ~ 852 - 110 - 26 = 716.
    const x = interpolate(p, [0, 1], [240, 345]);
    const y = interpolate(p, [0, 1], [820, 716]);
    return (
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          transform: `translate(-50%, -50%) scale(${1 - tapPulse * 0.25})`,
          pointerEvents: "none",
          zIndex: 50,
        }}
      >
        <CursorDot />
      </div>
    );
  }
  // mic mode: cursor must enter during VoiceQuote screen, after morph done
  if (frame < MORPH_END + 2 || frame > TAP_MIC_FRAME + 8) return null;
  const startF = MORPH_END + 2;
  const arriveF = TAP_MIC_FRAME - 2;
  const p = interpolate(frame, [startF, arriveF], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  const tapPulse =
    frame >= TAP_MIC_FRAME && frame < TAP_MIC_FRAME + 8
      ? 1 - (frame - TAP_MIC_FRAME) / 8
      : 0;
  // Mic at 50% / 44% of 393×852 = (196, 375)
  const x = interpolate(p, [0, 1], [80, 196]);
  const y = interpolate(p, [0, 1], [720, 375]);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${1 - tapPulse * 0.25})`,
        pointerEvents: "none",
        zIndex: 50,
      }}
    >
      <CursorDot />
    </div>
  );
};

const CursorDot: React.FC = () => (
  <div
    style={{
      width: 30,
      height: 30,
      borderRadius: "50%",
      background: "rgba(15,23,42,0.85)",
      border: "2px solid rgba(255,255,255,0.9)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.35)",
    }}
  />
);

