import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLOR, EASE, SPRING } from "../tokens";
import { GEN } from "../audio";
import { PhoneFrame } from "../components/PhoneFrame";
import { SfxAt } from "../components/SfxAt";

// =====================================================================
// SCENE 6 — Receipt → Expense (v1.21, frames 510–600)
// 90 frames @ 30fps · 3.0s
// (file kept as Scene6_FollowUpAssistant.tsx — content rebuilt verbatim)
//
// Beats:
//   • Receipt card sweeps in from right side. Customer profile gets pushed
//     away. Receipt centered.
//   • Blue glowing scan line moves downward.
//   • Text detected: "Plumbing Supplies" / "£46.20"
//   • Camera zooms into £46.20 briefly. Receipt shrinks into expense panel.
//   • Tags attach (magnetic snap): Materials / Bathroom Leak Repair /
//     John Smith / Tax-ready
//   • Hold briefly on "Tax-ready". Blue glow pulse.
// =====================================================================

const SWEEP_IN = 0;
const SCAN_START = 16;
const SCAN_END = 36;
const ZOOM_TOTAL = 36;
const SHRINK = 50;
const TAGS_START = 60;
const SCENE_END = 90;

const TAGS = ["Materials", "Bathroom Leak Repair", "John Smith", "Tax-ready"];

export const Scene6FollowUpAssistant: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Camera zoom curve — push into £46.20 around F36, pull back during shrink
  const camScale = interpolate(
    frame,
    [0, SCAN_END, ZOOM_TOTAL + 6, SHRINK + 6, SCENE_END],
    [1.0, 1.05, 1.18, 1.0, 1.0],
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
          transform: `scale(${camScale})`,
          transformStyle: "preserve-3d",
        }}
      >
        <PhoneFrame scale={1.0}>
          <ReceiptToExpense frame={frame} fps={fps} />
        </PhoneFrame>
      </div>

      {/* === AUDIO === */}
      <SfxAt
        src={GEN.bedTactile}
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
      <SfxAt src={GEN.scanSweep} from={SCAN_START} volume={0.25} />
      <SfxAt src={GEN.sparkleMatch} from={TAGS_START + 18} volume={0.32} />
    </AbsoluteFill>
  );
};

const ReceiptToExpense: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  // Receipt sweep-in
  const sweepP = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  const sweepX = interpolate(sweepP, [0, 1], [400, 0]);

  // Receipt shrinks at SHRINK frame
  const shrinkP = interpolate(frame, [SHRINK, SHRINK + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  const receiptScale = interpolate(shrinkP, [0, 1], [1, 0.55]);
  const receiptY = interpolate(shrinkP, [0, 1], [0, -120]);

  // Scan line position
  const scanP = interpolate(frame, [SCAN_START, SCAN_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scanY = interpolate(scanP, [0, 1], [0, 200]);

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
      {/* Receipt card */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 280,
          margin: "0 auto",
          transform: `translateX(${sweepX}px) translateY(${receiptY}px) scale(${receiptScale})`,
          transformOrigin: "center top",
          background: "#FAFAFA",
          borderRadius: 10,
          padding: 14,
          boxShadow: "0 12px 24px rgba(0,0,0,0.18)",
          color: "#1a1a1a",
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 6 }}>
          PLUMBING SUPPLIES
        </div>
        <div style={{ fontSize: 9, color: "#666", marginBottom: 8 }}>
          04/03/2026 · 10:42
        </div>
        <div style={{ fontSize: 10, lineHeight: 1.6 }}>
          32mm waste pipe ........ £15.40
          <br />
          Bath waste &amp; trap ..... £18.20
          <br />
          PTFE / consumables ..... £12.60
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 14,
            fontWeight: 800,
            borderTop: "1px dashed #999",
            paddingTop: 6,
            textAlign: "right",
          }}
        >
          TOTAL £46.20
        </div>

        {/* Scan line */}
        {scanP > 0 && scanP < 1 && (
          <div
            style={{
              position: "absolute",
              top: scanY,
              left: 0,
              right: 0,
              height: 3,
              background: COLOR.blue,
              boxShadow: `0 0 12px ${COLOR.blue}, 0 0 24px ${COLOR.blue}`,
            }}
          />
        )}

        {/* Detected text fragments float off */}
        {frame >= SCAN_START + 6 && frame < SHRINK && (
          <>
            <DetectedTag text="Plumbing Supplies" frame={frame} startFrame={SCAN_START + 6} x="20%" y={20} />
            <DetectedTag text="£46.20" frame={frame} startFrame={SCAN_START + 14} x="60%" y={150} />
          </>
        )}
      </div>

      {/* Expense panel + tags (after shrink) */}
      {frame >= SHRINK + 6 && (
        <ExpensePanel frame={frame} fps={fps} />
      )}
    </div>
  );
};

const DetectedTag: React.FC<{
  text: string;
  frame: number;
  startFrame: number;
  x: string;
  y: number;
}> = ({ text, frame, startFrame, x, y }) => {
  const t = frame - startFrame;
  if (t < 0) return null;
  const opacity = interpolate(t, [0, 4, 18], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const drift = interpolate(t, [0, 18], [0, -20]);
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: x,
        transform: `translateY(${drift}px)`,
        background: COLOR.aiPurpleBg,
        color: COLOR.aiPurple,
        padding: "3px 8px",
        borderRadius: 999,
        fontSize: 10,
        fontWeight: 700,
        opacity,
        boxShadow: `0 0 12px rgba(109,40,217,0.4)`,
        whiteSpace: "nowrap",
      }}
    >
      ✦ {text}
    </div>
  );
};

const ExpensePanel: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  return (
    <div
      style={{
        marginTop: 12,
        background: COLOR.surface,
        border: `1px solid ${COLOR.border}`,
        borderRadius: 12,
        padding: 14,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 700, color: COLOR.navy }}>
          Plumbing Supplies
        </div>
        <div style={{ fontSize: 16, fontWeight: 800, color: COLOR.navy }}>
          £46.20
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        {TAGS.map((t, i) => {
          const start = TAGS_START + i * 4;
          const sp = spring({ frame: frame - start, fps, config: SPRING.bouncy });
          const enterP = interpolate(sp, [0, 1], [0, 1]);
          const isLast = i === TAGS.length - 1;
          // Last tag (Tax-ready) holds with blue glow pulse
          const taxPulse =
            isLast && frame > start + 6
              ? 0.7 + 0.3 * Math.sin(((frame - start - 6) / 8) * Math.PI * 2)
              : 0;
          return (
            <div
              key={t}
              style={{
                background: isLast ? COLOR.blue : COLOR.navy,
                color: "#fff",
                fontSize: 10,
                fontWeight: 700,
                padding: "5px 10px",
                borderRadius: 999,
                opacity: enterP,
                transform: `scale(${interpolate(enterP, [0, 1], [0.6, 1])})`,
                boxShadow: isLast
                  ? `0 0 ${12 + 12 * taxPulse}px rgba(59,130,246,${0.5 + 0.4 * taxPulse})`
                  : "0 2px 6px rgba(0,0,0,0.15)",
              }}
            >
              {t}
            </div>
          );
        })}
      </div>
    </div>
  );
};
