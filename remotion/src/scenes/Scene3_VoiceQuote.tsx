import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLOR, EASE, TYPE } from "../tokens";
import { SFX } from "../audio";
import { PhoneFrame } from "../components/PhoneFrame";
import { MicButton } from "../components/MicButton";
import { SfxAt } from "../components/SfxAt";

// =====================================================================
// SCENE 3 — Voice-to-Quote walkthrough · Part 1 (v1.9 PREMIUM, 656–761)
// 105 frames @ 30fps · 3.5s
//
// v1.9 premium pass — phone shrinks to ~60% so the frame breathes,
// cursor/ripple chrome removed (interactions happen via state, not
// pointer), full-frame mask-clip hero typography lands as sting frames,
// camera moves slower with holds. Reads as a launch teaser, not a demo.
//
// Beats (local frames):
//   F0–F18   HERO STING: "Speak it." mask-reveals over dim phone
//   F18–F26  Phone lifts; dashboard visible; AI FAB pulses + activates
//   F26–F42  Screen morph (dashboard scales/blurs out, VoiceQuote in)
//   F42–F60  VoiceQuote settled, mic idle, ambient pulse
//   F60–F68  Mic activates (state flip, no cursor)
//   F68–F96  Live transcription with keyword highlights
//   F70–F96  HERO STING #2: "Kiva listens." beneath phone
//   F96–F105 Hold + outro into Scene 4
// =====================================================================

const HERO1_IN = 4;
const HERO1_OUT = 28;
const FAB_TRIGGER = 24;
const MORPH_START = 26;
const MORPH_END = 42;
const MIC_TRIGGER = 62;
const TRANSCRIBE_START = 68;
const TRANSCRIBE_END = 96;
const HERO2_IN = 70;
const HERO2_OUT = 100;
const SCENE_END = 105;

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

  // Phone is SMALL — premium negative space. Holds at apex during transcribe.
  const phoneScale = interpolate(
    frame,
    [0, 18, 60, 96, SCENE_END],
    [0.56, 0.58, 0.62, 0.64, 0.66],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOutQuad }
  );
  // Slight tilt that softens through the scene
  const phoneRotY = interpolate(frame, [0, 60, SCENE_END], [-8, -5, -3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOutQuad,
  });
  const phoneRotX = interpolate(frame, [0, SCENE_END], [4, 2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOutQuad,
  });
  // Phone subtly lifts up
  const phoneY = interpolate(frame, [0, 60], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOutQuad,
  });
  // Dim phone during hero1 so the typography owns the frame
  const phoneDim = interpolate(
    frame,
    [HERO1_IN, HERO1_IN + 8, HERO1_OUT - 4, HERO1_OUT + 2],
    [1, 0.32, 0.32, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOutQuad }
  );

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <Vignette />

      <div style={{ opacity: phoneDim, transition: "opacity 80ms" }}>
        <PhoneFrame
          rotateY={phoneRotY}
          rotateX={phoneRotX}
          translateY={phoneY}
          scale={phoneScale}
        >
          <ScreenStack frame={frame} fps={fps} />
        </PhoneFrame>
      </div>

      <HeroSting
        in={HERO1_IN}
        out={HERO1_OUT}
        frame={frame}
        position="above"
        text="Speak it."
        emphasisIndex={0}
      />
      <HeroSting
        in={HERO2_IN}
        out={HERO2_OUT}
        frame={frame}
        position="below"
        text="Kiva listens."
        emphasisIndex={0}
      />

      <SfxAt src={SFX.swoosh} from={MORPH_START} volume={0.32} />
      <SfxAt src={SFX.click} from={MIC_TRIGGER} volume={0.42} />
      <SfxAt
        src={SFX.notification1}
        from={MIC_TRIGGER}
        volume={0.32}
        playbackRate={Math.pow(2, 7 / 12)}
      />
    </AbsoluteFill>
  );
};

// =====================================================================
// VIGNETTE — radial darkening pulls focus to phone
// =====================================================================
const Vignette: React.FC = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background:
        "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.55) 100%)",
      pointerEvents: "none",
      zIndex: 1,
    }}
  />
);

// =====================================================================
// SCREEN STACK — dashboard above, voice quote below, slides between them
// =====================================================================
const ScreenStack: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  // Morph: dashboard scales down + fades out, VoiceQuote rises from below.
  const morphP = interpolate(frame, [MORPH_START, MORPH_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOutQuad,
  });
  const dashScale = interpolate(morphP, [0, 1], [1, 0.92]);
  const dashOpacity = interpolate(morphP, [0, 0.7], [1, 0]);
  const dashBlur = interpolate(morphP, [0, 1], [0, 6]);
  const voiceY = (1 - morphP) * 320;
  const voiceOpacity = interpolate(morphP, [0.3, 1], [0, 1]);

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
      {morphP < 1 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: dashOpacity,
            transform: `scale(${dashScale})`,
            transformOrigin: "center center",
            filter: `blur(${dashBlur}px)`,
          }}
        >
          <DashboardMock frame={frame} />
        </div>
      )}
      {morphP > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `translateY(${voiceY}px)`,
            opacity: voiceOpacity,
          }}
        >
          <VoiceQuoteMock frame={frame} fps={fps} />
        </div>
      )}
    </div>
  );
};

// =====================================================================
// DASHBOARD MOCK — restrained Kiva home, AI FAB the only color punch
// =====================================================================
const DashboardMock: React.FC<{ frame: number }> = ({ frame }) => {
  const fabPressed = frame >= FAB_TRIGGER && frame < FAB_TRIGGER + 4;
  const fabScale = fabPressed ? 0.86 : 1;

  return (
    <div style={{ width: "100%", height: "100%", background: COLOR.bg }}>
      <div style={{ paddingTop: 56 }} />

      <div
        style={{
          padding: "8px 16px 14px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ fontSize: 12, color: COLOR.textTer, fontWeight: 500 }}>
            Good morning
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
            background: COLOR.divider,
            color: COLOR.textSec,
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

      {/* Restrained mono stat grid */}
      <div
        style={{
          padding: "0 12px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
        }}
      >
        <StatTile label="This Month" value="£4,280" delay={2} frame={frame} />
        <StatTile label="Outstanding" value="£1,160" delay={4} frame={frame} />
        <StatTile label="Quotes Sent" value="12" delay={6} frame={frame} />
        <StatTile label="Jobs Active" value="5" delay={8} frame={frame} />
      </div>

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
          title="Mrs Patel — boiler service"
          meta="Yesterday · £340"
        />
        <ActivityRow
          title="James Reilly — kitchen tap"
          meta="2 days ago · £125"
        />
        <ActivityRow
          title="Sarah Kahn — shower install"
          meta="3 days ago · £980"
        />
      </div>

      {/* AI FAB — the only color punch on the dashboard */}
      <div
        style={{
          position: "absolute",
          right: 22,
          bottom: 110,
          width: 56,
          height: 56,
        }}
      >
        {/* Slow ambient pulse */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: COLOR.aiPurple,
            transform: `scale(${interpolate(
              (frame % 60) / 60,
              [0, 1],
              [1.0, 1.55]
            )})`,
            opacity: interpolate((frame % 60) / 60, [0, 1], [0.32, 0]),
          }}
        />
        {/* Activation ring */}
        {frame >= FAB_TRIGGER && frame < FAB_TRIGGER + 18 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: `2px solid ${COLOR.aiPurple}`,
              transform: `scale(${interpolate(
                frame - FAB_TRIGGER,
                [0, 18],
                [1, 2.8]
              )})`,
              opacity: interpolate(frame - FAB_TRIGGER, [0, 18], [0.85, 0]),
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: `radial-gradient(circle at 30% 30%, #8B5CF6 0%, ${COLOR.aiPurple} 60%, #5B21B6 100%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${fabScale})`,
            boxShadow:
              "0 6px 20px rgba(109,40,217,0.5), inset 0 1px 0 rgba(255,255,255,0.25)",
          }}
        >
          <SparklesGlyph />
        </div>
      </div>
    </div>
  );
};

const StatTile: React.FC<{
  label: string;
  value: string;
  delay: number;
  frame: number;
}> = ({ label, value, delay, frame }) => {
  const enter = interpolate(frame, [delay, delay + 10], [0, 1], {
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
      }}
    >
      <div
        style={{
          fontSize: 9,
          color: COLOR.textTer,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: 0.4,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 18, color: COLOR.navy, fontWeight: 800, marginTop: 4 }}>
        {value}
      </div>
    </div>
  );
};

const ActivityRow: React.FC<{ title: string; meta: string }> = ({
  title,
  meta,
}) => (
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
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: COLOR.textTer,
        marginRight: 10,
      }}
    />
    <div style={{ flex: 1, minWidth: 0 }}>
      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: COLOR.navy,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
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
// VOICE QUOTE MOCK — calm centered mic, transcription card
// =====================================================================
const VoiceQuoteMock: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const recording = frame >= MIC_TRIGGER + 2;
  const micPressed = frame >= MIC_TRIGGER && frame < MIC_TRIGGER + 4;
  const micPress = micPressed ? 0.92 : 1;
  const micLift = interpolate(
    frame,
    [TRANSCRIBE_START - 2, TRANSCRIBE_START + 14],
    [0, -56],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.outCubic }
  );
  const micShrink = interpolate(
    frame,
    [TRANSCRIBE_START, TRANSCRIBE_START + 14],
    [1, 0.78],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.outCubic }
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: COLOR.bg,
        position: "relative",
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

      {/* Single step pill — only AI accent on screen */}
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
          ✦ {recording ? "Recording" : "Speak the job"}
        </div>
      </div>

      {/* Mic — large, centered */}
      <div
        style={{
          position: "absolute",
          top: "44%",
          left: "50%",
          transform: `translate(-50%, calc(-50% + ${micLift}px)) scale(${micPress * micShrink})`,
        }}
      >
        <MicButton startFrame={0} recording={recording} size="hero" />
      </div>

      {/* Subtle "Listening…" label under mic during recording */}
      {recording && frame < TRANSCRIBE_START + 10 && (
        <div
          style={{
            position: "absolute",
            top: "62%",
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: 13,
            fontWeight: 600,
            color: COLOR.textSec,
            letterSpacing: 0.4,
            opacity: interpolate(
              frame,
              [MIC_TRIGGER + 4, MIC_TRIGGER + 10, TRANSCRIBE_START + 6, TRANSCRIBE_START + 10],
              [0, 1, 1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            ),
          }}
        >
          Listening…
        </div>
      )}

      {frame >= TRANSCRIBE_START && (
        <TranscriptionCard frame={frame - TRANSCRIBE_START} />
      )}

      <span style={{ display: "none" }}>{fps}</span>
    </div>
  );
};

const TranscriptionCard: React.FC<{ frame: number }> = ({ frame }) => {
  const enter = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
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
        left: 16,
        right: 16,
        bottom: 70,
        background: COLOR.surface,
        border: `1px solid ${COLOR.border}`,
        borderRadius: 16,
        padding: "14px 16px",
        boxShadow: "0 12px 28px rgba(15,23,42,0.10)",
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
        }}
      >
        ✦ Transcribing
      </div>
      <div
        style={{
          fontSize: 14,
          color: COLOR.navy,
          lineHeight: 1.5,
          fontWeight: 500,
        }}
      >
        {TRANSCRIPT_TOKENS.slice(0, tokenReveal).map((t, i) => {
          if (!t.hl) return <span key={i}>{t.text}</span>;
          return (
            <span
              key={i}
              style={{
                color: COLOR.navy,
                fontWeight: 800,
                background: COLOR.sentBg,
                padding: "1px 6px",
                borderRadius: 5,
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
// HERO STING — mask-clip reveal, full-frame, Linear-grade typography
// =====================================================================
const HeroSting: React.FC<{
  in: number;
  out: number;
  frame: number;
  text: string;
  emphasisIndex: number;
  position: "above" | "below";
}> = (props) => {
  if (props.frame < props.in - 2 || props.frame > props.out + 4) return null;

  // 0 → 1 → 1 → 0 envelope. Reveal early, sit, then fade.
  const reveal = interpolate(
    props.frame,
    [props.in, props.in + 12, props.out - 8, props.out],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.outCubic }
  );
  // Slight Y drift across the hold (subtle parallax)
  const drift = interpolate(props.frame, [props.in, props.out], [0, -10], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Horizontal mask-clip wipe (same pattern as Scene 2 v1.7)
  const wipe = interpolate(
    props.frame,
    [props.in, props.in + 14],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.outCubic }
  );
  const maskStop1 = Math.max(0, wipe * 112 - 12);
  const maskStop2 = Math.min(112, wipe * 112);
  const mask = `linear-gradient(90deg, black 0%, black ${maskStop1}%, transparent ${maskStop2}%, transparent 100%)`;

  // Position above or below the phone. Phone is centered, scale ~0.6,
  // visible height ~590-660. Phone bottom reaches ~y=870 at largest.
  const top = props.position === "above" ? 90 : 920;

  // Split into words; emphasize first word (purple), rest white.
  const words = props.text.split(" ");

  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
        opacity: reveal,
        transform: `translateY(${drift}px)`,
        zIndex: 30,
      }}
    >
      <div
        style={{
          fontFamily: "Inter, system-ui",
          fontSize: TYPE.hookHero.size * 0.85,
          fontWeight: TYPE.hookHero.weight,
          letterSpacing: -2.5,
          lineHeight: 1,
          color: "#fff",
          WebkitMaskImage: mask,
          maskImage: mask,
          padding: "0 60px",
          textShadow: "0 6px 30px rgba(0,0,0,0.55)",
        }}
      >
        {words.map((w, i) => (
          <span
            key={i}
            style={{
              color: i === props.emphasisIndex ? COLOR.aiPurple : "#fff",
              marginRight: i < words.length - 1 ? 18 : 0,
            }}
          >
            {w}
          </span>
        ))}
      </div>
    </div>
  );
};
