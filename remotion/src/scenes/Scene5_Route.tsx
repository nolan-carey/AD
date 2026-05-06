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
import { SFX, GEN, IMG } from "../audio";
import { PhoneFrame } from "../components/PhoneFrame";
import { SfxAt } from "../components/SfxAt";
import { popInProgress } from "../motion";

// =====================================================================
// SCENE 5 — AI Customer Route Optimization (frames 558–654 = local 0–96)
// v1.7 fix: cropped map plate (no chrome) + chrome rendered as components.
// v1.3: inverted camera — open WIDE, then punch-zoom in.
// Real Map/index.js anatomy applied: banner, filter chips, drop-pin SVG.
// =====================================================================

const OPEN_WIDE_END = 18;
const PUNCH_ZOOM_END = 36;
const PIN_PULSE_START = 36;
const ROUTE_DRAW = 54;
const STAT_OVERLAY = 69;

// Pin landing positions in 393×852 phone-screen logical px.
// Three customers across London: Annie Y (Notting Hill / upper-left),
// Nolan C (Shepherd's Bush / mid), Stan C (Hammersmith / lower-right).
// Avatar palette per /Users/nolancarey/kiva/Frontend/src/theme/avatarPalette.js
const PINS = [
  { id: "annie", initials: "AY", color: "#7CA0CB", name: "Annie Y", area: "Notting Hill", x: 130, y: 380 },
  { id: "nolan", initials: "NC", color: "#A89BC9", name: "Nolan C", area: "Shepherd's Bush", x: 230, y: 480 },
  { id: "stan", initials: "SC", color: "#8FB99D", name: "Stan C", area: "Hammersmith", x: 290, y: 600 },
];

const FILTERS = [
  { key: "all", label: "All", dot: null },
  { key: "quoted", label: "Quoted", dot: COLOR.blue },
  { key: "accepted", label: "Accepted", dot: COLOR.accepted },
  { key: "paid", label: "Paid", dot: COLOR.paid },
];

export const Scene5Route: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Camera scale 1.0 → 1.4 (punch-zoom). Origin shifts toward cluster center.
  const camScale = interpolate(frame, [OPEN_WIDE_END, PUNCH_ZOOM_END], [1.0, 1.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOutQuad,
  });
  const camOriginX = 53.5; // pin cluster slightly right of center
  const camOriginY = 56;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${COLOR.navy} 0%, ${COLOR.surfaceDark} 100%)`,
      }}
    >
      <PhoneFrame>
        {/* Map zoom layer — only the map plate + pins + route line scale */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `scale(${camScale})`,
            transformOrigin: `${camOriginX}% ${camOriginY}%`,
          }}
        >
          {/* Cropped map plate — NO chrome, NO original pins, NO bottom nav */}
          <Img
            src={IMG.mapPlate}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 60%",
            }}
          />
          {PINS.map((pin, i) => (
            <Pin key={pin.id} pin={pin} index={i} frame={frame} fps={fps} />
          ))}
          {frame >= ROUTE_DRAW && <RouteLine frame={frame} />}
        </div>

        {/* === CHROME (does NOT scale with camera — locked above the map) === */}
        {/* Top banner — "Today's route" stat */}
        <Banner frame={frame} />

        {/* Filter chips row */}
        <FilterChips frame={frame} />

        {/* Recenter button bottom-right */}
        <RecenterButton frame={frame} />

        {/* Stat overlay — "47 min time saved today" */}
        {frame >= STAT_OVERLAY && <StatOverlay frame={frame} />}
      </PhoneFrame>

      {/* === AUDIO === */}
      {/* Map zoom whoosh (generated) — punch-zoom phase 18→36, -10 dBFS */}
      <SfxAt
        src={GEN.mapZoom}
        from={OPEN_WIDE_END - 4}
        volume={(f) =>
          interpolate(f, [0, 8, 22], [0, 0.32, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
        durationInFrames={24}
      />
      {/* AI hum ambient underbed during pin pulses + route draw — -22 dBFS */}
      <SfxAt
        src={GEN.aiHum}
        from={PIN_PULSE_START - 6}
        volume={(f) =>
          interpolate(f, [0, 12, 36, 50], [0, 0.08, 0.08, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
        loop
        durationInFrames={56}
      />
      {/* Route line flow (generated) — energy flowing along the path — -14 dBFS */}
      <SfxAt src={GEN.routeFlow} from={ROUTE_DRAW} volume={0.2} />
      {/* Achievement chime on "47 min" stat landing — -10 dBFS */}
      <SfxAt src={GEN.achievement} from={STAT_OVERLAY + 12} volume={0.32} />
    </AbsoluteFill>
  );
};

// =====================================================================
// BANNER — top of screen, "Today's route" stat (real Map/index.js banner)
// =====================================================================
const Banner: React.FC<{ frame: number }> = ({ frame }) => {
  const fadeIn = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  return (
    <div
      style={{
        position: "absolute",
        top: 56,
        left: 12,
        right: 12,
        display: "flex",
        background: COLOR.surface,
        borderRadius: 12,
        border: `1px solid ${COLOR.border}`,
        padding: "10px 14px",
        boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
        fontFamily: "Inter, system-ui",
        opacity: fadeIn,
      }}
    >
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: 8,
            fontWeight: 600,
            color: COLOR.textTer,
            textTransform: "uppercase",
            letterSpacing: 0.6,
            marginBottom: 2,
          }}
        >
          Today's route
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, color: COLOR.navy }}>
          3 customers · 12.4 mi
        </div>
      </div>
      <div style={{ width: 1, alignSelf: "stretch", background: COLOR.divider, marginLeft: 10, marginRight: 10 }} />
      <div>
        <div
          style={{
            fontSize: 8,
            fontWeight: 600,
            color: COLOR.textTer,
            textTransform: "uppercase",
            letterSpacing: 0.6,
            marginBottom: 2,
          }}
        >
          Saved
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, color: COLOR.aiPurple }}>
          47 min
        </div>
      </div>
    </div>
  );
};

// =====================================================================
// FILTER CHIPS — real Map filter row anatomy (radius 999, padding 12/6)
// =====================================================================
const FilterChips: React.FC<{ frame: number }> = ({ frame }) => {
  const fadeIn = interpolate(frame, [4, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  return (
    <div
      style={{
        position: "absolute",
        top: 122,
        left: 0,
        right: 0,
        display: "flex",
        gap: 6,
        paddingLeft: 12,
        paddingRight: 12,
        opacity: fadeIn,
        fontFamily: "Inter, system-ui",
      }}
    >
      {FILTERS.map((f, i) => {
        const active = i === 0;
        return (
          <div
            key={f.key}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: active ? COLOR.navy : COLOR.surface,
              border: `1px solid ${active ? COLOR.navy : COLOR.border}`,
              borderRadius: 999,
              padding: "6px 12px",
              boxShadow: active ? "none" : "0 2px 6px rgba(0,0,0,0.06)",
            }}
          >
            {f.dot && (
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  background: f.dot,
                }}
              />
            )}
            <span
              style={{
                fontSize: 11,
                fontWeight: active ? 600 : 500,
                color: active ? "#fff" : COLOR.navy,
              }}
            >
              {f.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// =====================================================================
// PIN — drop-pin SVG with avatar circle inside the bulb, triangle tip
// =====================================================================
const Pin: React.FC<{
  pin: (typeof PINS)[number];
  index: number;
  frame: number;
  fps: number;
}> = ({ pin, index, frame, fps }) => {
  // Pulse re-entry at PIN_PULSE_START + index*6 (200ms intervals)
  const pulseStart = PIN_PULSE_START + index * 6;
  const t = frame - pulseStart;
  const pulseScale = interpolate(t, [0, 4, 10], [1.0, 1.15, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Ripple expanding from base
  const rippleScale = interpolate(t, [0, 14], [0, 1.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outExpo,
  });
  const rippleOpacity = interpolate(t, [0, 14], [0.5, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Initial drop-in via spring (during the wide-open phase 0–18)
  const dropSp = popInProgress(frame, fps, index * 4);
  const dropScale = interpolate(dropSp, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const finalScale = dropScale * pulseScale;

  return (
    <div
      style={{
        position: "absolute",
        left: pin.x,
        top: pin.y,
        transform: "translate(-50%, -100%)",
        pointerEvents: "none",
      }}
    >
      {/* Ripple from base */}
      {t >= 0 && t < 14 && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: -2,
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: pin.color,
            transform: `translate(-50%, 50%) scale(${rippleScale})`,
            opacity: rippleOpacity,
          }}
        />
      )}
      {/* Pin SVG (drop shape with avatar inside) */}
      <div style={{ transform: `scale(${finalScale})`, transformOrigin: "center bottom" }}>
        <svg width={44} height={56} viewBox="0 0 44 56">
          {/* Soft shadow under tip */}
          <ellipse cx="22" cy="54" rx="8" ry="2" fill="rgba(0,0,0,0.25)" />
          {/* Bulb */}
          <circle cx="22" cy="20" r="18" fill={pin.color} stroke="#fff" strokeWidth="3" />
          {/* Tip triangle */}
          <path d="M 22 52 L 14 36 L 30 36 Z" fill={pin.color} stroke="#fff" strokeWidth="2.5" strokeLinejoin="round" />
          {/* Initials */}
          <text
            x="22"
            y="25"
            textAnchor="middle"
            fontFamily="Inter, system-ui"
            fontSize="11"
            fontWeight="700"
            fill="#fff"
          >
            {pin.initials}
          </text>
        </svg>
      </div>
    </div>
  );
};

// =====================================================================
// ROUTE LINE — gradient #3B82F6 → #6D28D9, traveling particles
// =====================================================================
const RouteLine: React.FC<{ frame: number }> = ({ frame }) => {
  const t = frame - ROUTE_DRAW;
  const drawP = interpolate(t, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  // Curved path between pins (Q-bezier control points)
  const pathD = `M ${PINS[0].x} ${PINS[0].y - 18} Q ${
    (PINS[0].x + PINS[1].x) / 2 - 25
  } ${(PINS[0].y + PINS[1].y) / 2 - 18} ${PINS[1].x} ${
    PINS[1].y - 18
  } Q ${(PINS[1].x + PINS[2].x) / 2 + 28} ${
    (PINS[1].y + PINS[2].y) / 2 - 18
  } ${PINS[2].x} ${PINS[2].y - 18}`;

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 393 852"
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <defs>
        <linearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={COLOR.blue} />
          <stop offset="100%" stopColor={COLOR.aiPurple} />
        </linearGradient>
        <filter id="routeGlow">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d={pathD}
        stroke="url(#routeGrad)"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="800"
        strokeDashoffset={800 * (1 - drawP)}
        filter="url(#routeGlow)"
      />
      {/* Traveling particles */}
      {drawP > 0.4 &&
        [0, 0.33, 0.66].map((offset, i) => {
          const phase = (t / 6 + offset) % 1;
          const seg = phase < 0.5 ? 0 : 1;
          const segP = phase < 0.5 ? phase * 2 : (phase - 0.5) * 2;
          const a = PINS[seg];
          const b = PINS[seg + 1];
          const x = a.x + (b.x - a.x) * segP;
          const y = a.y + (b.y - a.y) * segP - 18;
          return (
            <circle key={i} cx={x} cy={y} r="3" fill={COLOR.aiPurple} opacity={0.95} />
          );
        })}
    </svg>
  );
};

// =====================================================================
// RECENTER BUTTON — bottom-right, real Map/index.js style
// =====================================================================
const RecenterButton: React.FC<{ frame: number }> = ({ frame }) => {
  const fadeIn = interpolate(frame, [12, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        bottom: 84,
        right: 14,
        width: 42,
        height: 42,
        borderRadius: 21,
        background: COLOR.surface,
        border: `1px solid ${COLOR.border}`,
        boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: fadeIn,
        fontSize: 16,
        color: COLOR.navy,
      }}
    >
      ⊕
    </div>
  );
};

// =====================================================================
// STAT OVERLAY — "47 min time saved today" — counts up
// =====================================================================
const StatOverlay: React.FC<{ frame: number }> = ({ frame }) => {
  const t = frame - STAT_OVERLAY;
  const fadeIn = interpolate(t, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  const countP = interpolate(t, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  const minutes = Math.round(47 * countP);
  const miles = (12.4 * countP).toFixed(1);
  const rise = interpolate(fadeIn, [0, 1], [10, 0]);
  // gentle scale-up for liveness
  const scale = interpolate(t, [0, 12, 18], [0.9, 1.05, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 196,
        left: "50%",
        transform: `translate(-50%, ${rise}px) scale(${scale})`,
        opacity: fadeIn,
        background: "rgba(15,23,42,0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        color: "#fff",
        borderRadius: 16,
        padding: "14px 20px",
        textAlign: "center",
        boxShadow: "0 12px 28px rgba(0,0,0,0.45)",
        border: `1px solid rgba(109,40,217,0.4)`,
        fontFamily: "Inter, system-ui",
      }}
    >
      <div
        style={{
          fontSize: 36,
          fontWeight: 800,
          letterSpacing: -1.2,
          color: "#fff",
          lineHeight: 1,
        }}
      >
        {minutes} min
      </div>
      <div
        style={{
          fontSize: 9,
          fontWeight: 600,
          color: "rgba(255,255,255,0.7)",
          textTransform: "uppercase",
          letterSpacing: 0.8,
          marginTop: 4,
        }}
      >
        time saved today
      </div>
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: COLOR.aiPurple,
          marginTop: 6,
        }}
      >
        ✦ {miles} mi optimized
      </div>
    </div>
  );
};
