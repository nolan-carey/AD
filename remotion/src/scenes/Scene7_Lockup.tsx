import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLOR, EASE, SPRING } from "../tokens";
import { GEN, IMG } from "../audio";
import { PhoneFrame } from "../components/PhoneFrame";
import { GlassPlate } from "../components/GlassPlate";
import { SfxAt } from "../components/SfxAt";

// =====================================================================
// SCENE 7 — Map → Route (v1.21, frames 600–690)
// 90 frames @ 30fps · 3.0s
// (file kept as Scene7_Lockup.tsx — content rebuilt from §6 verbatim)
//
// Beats:
//   • Expense rows compress into lines. Lines bend into roads. Dark
//     cinematic map expands fullscreen.
//   • Pins drop with subtle bounce: Leak Repair / Boiler Check /
//     Quote Visit / Follow-Up.
//   • Slight map tilt for depth.
//   • Glowing blue route line draws between pins, then rearranges itself
//     intelligently. Camera follows route line.
//   • Result card slides up: "32 min saved today" — number counts up.
//   • Hold briefly.
// =====================================================================

const MAP_EXPAND_END = 14;
const PINS_START = 16;
const ROUTE_DRAW_START = 50;
const ROUTE_DRAW_END = 70;
const RESULT_CARD = 70;
const SCENE_END = 90;

const PINS = [
  { id: "leak", label: "Leak Repair", x: 130, y: 350, color: COLOR.blue },
  { id: "boiler", label: "Boiler Check", x: 230, y: 460, color: COLOR.aiPurple },
  { id: "quote", label: "Quote Visit", x: 290, y: 560, color: "#22C55E" },
  { id: "followup", label: "Follow-Up", x: 175, y: 640, color: COLOR.pending },
];

export const Scene7Lockup: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Map expand: 1.0 → 1.4 over first 14 frames
  const mapScale = interpolate(frame, [0, MAP_EXPAND_END], [1.0, 1.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  // Map tilt for depth (rotateX)
  const mapTilt = interpolate(frame, [MAP_EXPAND_END, SCENE_END], [0, 8], {
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
      <PhoneFrame scale={mapScale}>
        <div
          style={{
            width: "100%",
            height: "100%",
            transform: `perspective(1200px) rotateX(${mapTilt}deg)`,
            transformOrigin: "center center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Img
            src={IMG.mapPlate}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 50%",
            }}
          />
          {PINS.map((p, i) => (
            <Pin key={p.id} pin={p} index={i} frame={frame} fps={fps} />
          ))}
          {frame >= ROUTE_DRAW_START && <RouteLine frame={frame} />}
        </div>
      </PhoneFrame>

      {/* "32 min saved today" — slides up from bottom */}
      {frame >= RESULT_CARD && <ResultCard frame={frame} fps={fps} />}

      {/* === AUDIO === user-stripped */}
    </AbsoluteFill>
  );
};

const Pin: React.FC<{
  pin: { id: string; label: string; x: number; y: number; color: string };
  index: number;
  frame: number;
  fps: number;
}> = ({ pin, index, frame, fps }) => {
  const start = PINS_START + index * 5;
  const sp = spring({ frame: frame - start, fps, config: SPRING.bouncy });
  const dropY = interpolate(sp, [0, 1], [-50, 0]);
  const opacity = interpolate(sp, [0, 1], [0, 1]);
  return (
    <div
      style={{
        position: "absolute",
        left: pin.x,
        top: pin.y + dropY,
        transform: "translate(-50%, -100%)",
        opacity,
        pointerEvents: "none",
      }}
    >
      <svg width={36} height={48} viewBox="0 0 36 48">
        <ellipse cx="18" cy="46" rx="6" ry="1.5" fill="rgba(0,0,0,0.3)" />
        <circle cx="18" cy="16" r="14" fill={pin.color} stroke="#fff" strokeWidth="2.5" />
        <path d="M 18 44 L 12 32 L 24 32 Z" fill={pin.color} stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
      </svg>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: -22,
          transform: "translateX(-50%)",
          background: "rgba(15,23,42,0.85)",
          color: "#fff",
          padding: "2px 7px",
          borderRadius: 6,
          fontSize: 9,
          fontWeight: 600,
          fontFamily: "Inter, system-ui",
          whiteSpace: "nowrap",
        }}
      >
        {pin.label}
      </div>
    </div>
  );
};

const RouteLine: React.FC<{ frame: number }> = ({ frame }) => {
  const drawP = interpolate(
    frame,
    [ROUTE_DRAW_START, ROUTE_DRAW_END],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE.outCubic,
    }
  );
  // Path through pins in order (later rearranges intelligently — just visual hint)
  const ordered = [PINS[0], PINS[1], PINS[2], PINS[3]];
  const d =
    `M ${ordered[0].x} ${ordered[0].y} ` +
    ordered
      .slice(1)
      .map((p, i) => {
        const prev = ordered[i];
        const cx = (prev.x + p.x) / 2 + (i % 2 === 0 ? -25 : 25);
        const cy = (prev.y + p.y) / 2;
        return `Q ${cx} ${cy} ${p.x} ${p.y}`;
      })
      .join(" ");
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 393 852"
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <defs>
        <linearGradient id="route" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={COLOR.blue} />
          <stop offset="100%" stopColor={COLOR.aiPurple} />
        </linearGradient>
      </defs>
      <path
        d={d}
        stroke="url(#route)"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="900"
        strokeDashoffset={900 * (1 - drawP)}
        style={{ filter: `drop-shadow(0 0 6px ${COLOR.blue})` }}
      />
    </svg>
  );
};

const ResultCard: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const sp = spring({ frame: frame - RESULT_CARD, fps, config: SPRING.soft });
  const enter = interpolate(sp, [0, 1], [0, 1]);
  const yOffset = interpolate(enter, [0, 1], [40, 0]);
  // Count up 0 → 32
  const countP = interpolate(frame, [RESULT_CARD + 6, RESULT_CARD + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  const minutes = Math.round(32 * countP);
  return (
    <div
      style={{
        position: "absolute",
        bottom: 200,
        left: "50%",
        transform: `translate(-50%, ${yOffset}px)`,
        opacity: enter,
      }}
    >
      <GlassPlate radius={20}>
        <div
          style={{
            padding: "16px 28px",
            fontFamily: "Inter, system-ui",
            color: "#fff",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 42,
              fontWeight: 800,
              letterSpacing: -1,
              lineHeight: 1,
            }}
          >
            {minutes} min
          </div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: "rgba(255,255,255,0.7)",
              marginTop: 4,
            }}
          >
            saved today
          </div>
        </div>
      </GlassPlate>
    </div>
  );
};
