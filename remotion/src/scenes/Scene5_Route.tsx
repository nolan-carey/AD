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
import { GlassPlate } from "../components/GlassPlate";
import { SfxAt } from "../components/SfxAt";

// =====================================================================
// SCENE 5 — Quote → Customer profile (v1.21, frames 450–510)
// 60 frames @ 30fps · 2.0s
// (file kept as Scene5_Route.tsx — content rebuilt from §6 verbatim)
//
// Beats:
//   • Quote card lifts toward viewer, expands fullscreen, customer name
//     stretches horizontally, morphs into customer profile header.
//   • Visible fields: John Smith / Phone Number / Address / Plumbing /
//     Linked Quote. Fields auto-fill one at a time, magnetic movement.
//   • Camera slow pan from top-left toward linked quote.
//   • Success badge top-right: "Customer Created" with blue checkmark.
//   • Hold briefly.
// =====================================================================

const EXPAND_END = 12; // quote card expands fullscreen
const FIELD_FILL_START = 12;
const FIELD_FILL_END = 48;
const SUCCESS_BADGE = 36;
const SCENE_END = 60;

const FIELDS: { label: string; value: string }[] = [
  { label: "Customer", value: "John Smith" },
  { label: "Phone Number", value: "07700 900123" },
  { label: "Address", value: "Hammersmith, London" },
  { label: "Trade", value: "Plumbing" },
  { label: "Linked Quote", value: "Bathroom Leak Repair · £280" },
];

export const Scene5Route: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Camera slow pan top-left → toward bottom (linked quote)
  const camPanY = interpolate(frame, [0, SCENE_END], [-12, 12]);
  const camScale = interpolate(frame, [0, EXPAND_END, SCENE_END], [1.0, 1.06, 1.04], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOutQuad,
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: 240,
      }}
    >
      <PhoneFrame scale={camScale} translateY={camPanY}>
        <CustomerProfile frame={frame} fps={fps} />
      </PhoneFrame>

      {/* Success badge — floats outside the phone, top-right */}
      {frame >= SUCCESS_BADGE && <SuccessBadge frame={frame} fps={fps} />}

      {/* === AUDIO === user-stripped */}
    </AbsoluteFill>
  );
};

const CustomerProfile: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
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
      {/* Profile header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 14,
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: "#F5F3FF",
            color: COLOR.aiPurple,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            fontWeight: 800,
          }}
        >
          JS
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: COLOR.navy }}>
            John Smith
          </div>
          <div style={{ fontSize: 11, color: COLOR.textSec }}>
            Customer · Created today
          </div>
        </div>
      </div>

      {/* Fields */}
      <div
        style={{
          background: COLOR.surface,
          border: `1px solid ${COLOR.border}`,
          borderRadius: 12,
          padding: "8px 12px",
        }}
      >
        {FIELDS.slice(1).map((f, i) => {
          const start = FIELD_FILL_START + i * 6;
          const sp = spring({
            frame: frame - start,
            fps,
            config: SPRING.controlled,
          });
          const enterP = interpolate(sp, [0, 1], [0, 1]);
          const enterX = interpolate(sp, [0, 1], [12, 0]);
          return (
            <div
              key={f.label}
              style={{
                paddingTop: 9,
                paddingBottom: 9,
                borderBottom:
                  i < FIELDS.length - 2 ? `1px solid ${COLOR.divider}` : "none",
                opacity: enterP,
                transform: `translateX(${enterX}px)`,
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 600,
                  color: COLOR.textTer,
                  textTransform: "uppercase",
                  letterSpacing: 0.4,
                  marginBottom: 2,
                }}
              >
                {f.label}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: COLOR.navy }}>
                {f.value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SuccessBadge: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const sp = spring({ frame: frame - SUCCESS_BADGE, fps, config: SPRING.bouncy });
  const enter = interpolate(sp, [0, 1], [0, 1]);
  return (
    <div
      style={{
        position: "absolute",
        top: 220,
        right: 200,
        opacity: enter,
        transform: `scale(${interpolate(enter, [0, 1], [0.6, 1])})`,
      }}
    >
      <GlassPlate radius={999}>
        <div
          style={{
            padding: "10px 18px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontFamily: "Inter, system-ui",
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          <span
            style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: COLOR.blue,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 800,
              boxShadow: `0 0 12px ${COLOR.blue}`,
            }}
          >
            ✓
          </span>
          <span>Customer Created</span>
        </div>
      </GlassPlate>
    </div>
  );
};
