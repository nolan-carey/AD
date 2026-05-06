import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLOR, EASE } from "../tokens";
import { GEN } from "../audio";
import { PhoneFrame } from "../components/PhoneFrame";
import { MicButton } from "../components/MicButton";
import { SfxAt } from "../components/SfxAt";

// =====================================================================
// SCENE 3 — Dashboard reveal + mic zoom (v1.21, frames 240–345)
// 105 frames @ 30fps · 3.5s
// (file kept as Scene3_VoiceQuote.tsx — content rebuilt from §6 verbatim)
//
// Beats:
//   • Phone front-facing, centered slightly right of frame
//   • Visible UI ONLY: Create Quote, Customers, Jobs, AI Mic Button
//   • Camera slow zoom toward microphone button
//   • Mic button: subtle blue pulse every 1 second
//   • Soft ambient glow from screen
// =====================================================================

const SCENE_END = 105;

export const Scene3VoiceQuote: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slow camera zoom toward the mic — 1.0 → 1.30 over the whole scene
  const cameraScale = interpolate(frame, [0, SCENE_END], [1.0, 1.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOutQuad,
  });
  // Camera origin shifts toward the mic (bottom-center of phone screen)
  const originY = interpolate(frame, [0, SCENE_END], [50, 75]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        // Phone "centered slightly right of frame"
        paddingLeft: 240,
      }}
    >
      <div
        style={{
          transform: `scale(${cameraScale})`,
          transformOrigin: `50% ${originY}%`,
          transformStyle: "preserve-3d",
        }}
      >
        <PhoneFrame scale={1.0}>
          <DashboardSimple frame={frame} fps={fps} />
        </PhoneFrame>
      </div>

      {/* === AUDIO === */}
      <SfxAt
        src={GEN.aiHum}
        from={0}
        loop
        volume={(f) =>
          interpolate(f, [0, 8, 95, 105], [0, 0.08, 0.08, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
        durationInFrames={105}
      />
    </AbsoluteFill>
  );
};

// Minimal dashboard — only "Create Quote / Customers / Jobs / AI Mic Button" per spec
const DashboardSimple: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const tiles = [
    { label: "Create Quote", color: COLOR.aiPurple },
    { label: "Customers", color: COLOR.blue },
    { label: "Jobs", color: COLOR.surfaceDark },
  ];
  // Tile fade-in stagger
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
      {/* Status bar gap */}
      <div style={{ paddingTop: 60 }} />

      {/* Topbar */}
      <div
        style={{
          padding: "0 16px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: 22, fontWeight: 700, color: COLOR.navy }}>
          Today
        </div>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            background: COLOR.divider,
          }}
        />
      </div>

      {/* 3 tiles */}
      <div
        style={{
          padding: "0 16px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {tiles.map((t, i) => {
          const enter = interpolate(frame, [4 + i * 3, 12 + i * 3], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: EASE.outCubic,
          });
          return (
            <div
              key={t.label}
              style={{
                background: t.color,
                color: "#fff",
                borderRadius: 14,
                padding: "20px 16px",
                fontSize: 16,
                fontWeight: 700,
                opacity: enter,
                transform: `translateY(${interpolate(enter, [0, 1], [12, 0])}px)`,
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            >
              {t.label}
            </div>
          );
        })}
      </div>

      {/* AI Mic Button — bottom, with subtle blue pulse every ~30 frames */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 80,
          transform: "translateX(-50%)",
        }}
      >
        <MicButton startFrame={0} />
      </div>

      {/* Caption echo from Scene 2 (fades during Scene 3 entry) */}
      <div
        style={{
          position: "absolute",
          bottom: 30,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 10,
          fontWeight: 500,
          color: COLOR.textTer,
          opacity: interpolate(frame, [0, 12], [0.85, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        All your admin. One place.
      </div>
    </div>
  );
};
