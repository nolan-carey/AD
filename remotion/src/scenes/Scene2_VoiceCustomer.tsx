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
import { KivaLogo } from "../components/KivaLogo";
import { PhoneFrame } from "../components/PhoneFrame";
import { SfxAt } from "../components/SfxAt";

// =====================================================================
// SCENE 2 — iPhone + Kiva app opening (v1.22, frames 180–270)
// 90 frames @ 30fps · 3.0s
// (file kept as Scene2_VoiceCustomer.tsx for git diff continuity)
//
// Replaces v1.21's logo→iPhone morph storyboard. Per user direction
// "iphone with the kiva app opening" — the phone exists already; the
// viewer watches the Kiva app launch like a real iOS app open.
//
// Beat-by-beat (local frames):
//   0–12  : SWOOSH WIPE drags the Scene 1 cluster off + EXTENDED SILENCE
//           (swoosh F0→F6, silence sustains F6→F12)
//   12–30 : iPhone fades in from black, AI glow halo idle blue
//   30–45 : iOS home screen reveals (Kiva app icon prominent, others dimmed,
//           Kiva pulses softly; camera pushes 1.0×→1.08× toward icon)
//   45–54 : Cursor enters from right, taps Kiva icon at local 50 (=F230);
//           icon compresses 1→0.92→1, blue ripple expands; halo flips purple
//   54–72 : iOS app-launch expand — Kiva icon scales fullscreen with
//           easeOutCubic, surrounding icons fade out, navy splash fills screen
//   72–84 : Splash brand lockup — chevron + "Kiva." wordmark + tagline
//   84–90 : Splash dissolves into dashboard with "All your admin. One place."
// =====================================================================

const SWOOSH_END = 12;
const PHONE_FADE_END = 30;
const HOME_REVEAL_END = 45;
const CURSOR_ENTER = 45;
const CURSOR_TAP = 50;
const APP_EXPAND_START = 54;
const APP_EXPAND_END = 72;
const SPLASH_END = 84;
const SCENE_END = 90;

const TAGLINE = "Blue collar solutions to blue collar problems";

export const Scene2VoiceCustomer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slow camera push toward the Kiva icon during home-screen reveal
  const cameraScale = interpolate(
    frame,
    [PHONE_FADE_END, HOME_REVEAL_END, CURSOR_TAP, APP_EXPAND_END],
    [1.0, 1.08, 1.10, 1.0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE.inOutQuad,
    }
  );

  // Phone fade-in opacity 0→1 over PHONE_FADE phase
  const phoneOpacity = interpolate(
    frame,
    [SWOOSH_END, PHONE_FADE_END],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.outCubic }
  );

  return (
    <AbsoluteFill style={{ background: "rgba(0,0,0,0.4)" }}>
      {/* Swoosh wipe — visual streak across the screen F0–F6 */}
      {frame < SWOOSH_END + 4 && <SwooshWipe frame={frame} />}

      {/* iPhone — fades in pre-formed at PHONE_FADE_END */}
      {frame >= SWOOSH_END - 2 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            opacity: phoneOpacity,
          }}
        >
          <PhoneFrame scale={cameraScale}>
            <PhoneScreen frame={frame} fps={fps} />
          </PhoneFrame>
        </AbsoluteFill>
      )}

      {/* === AUDIO === */}
      {/* user-stripped: only the cursor-click on the Kiva icon remains */}
      <SfxAt src={SFX.click} from={CURSOR_TAP} volume={0.85} />
    </AbsoluteFill>
  );
};

// =====================================================================
// SWOOSH WIPE — visual streak L→R across the frame
// =====================================================================
const SwooshWipe: React.FC<{ frame: number }> = ({ frame }) => {
  const p = interpolate(frame, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOutQuad,
  });
  const x = interpolate(p, [0, 1], [-600, 2400]);
  const opacity = interpolate(p, [0, 0.4, 1], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: x,
        width: 700,
        background:
          "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(180,200,255,0.25) 50%, rgba(255,255,255,0) 100%)",
        transform: "skewX(-22deg)",
        filter: "blur(8px)",
        mixBlendMode: "screen",
        opacity,
        pointerEvents: "none",
      }}
    />
  );
};

// =====================================================================
// PHONE SCREEN — switches between iOS home, app-expand, splash, dashboard
// =====================================================================
const PhoneScreen: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  // Base: black screen until home reveal begins
  // Home: visible PHONE_FADE_END..APP_EXPAND_END (icon expands during last portion)
  // Splash: APP_EXPAND_END..SPLASH_END
  // Dashboard: SPLASH_END+

  // Splash opacity: fades in as splash expand completes, fades out at SPLASH_END
  const splashIn = interpolate(frame, [APP_EXPAND_END - 4, APP_EXPAND_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const splashOut = interpolate(frame, [SPLASH_END, SCENE_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const splashOpacity = Math.max(0, splashIn - splashOut);

  // Dashboard opacity: starts at SPLASH_END
  const dashOpacity = interpolate(frame, [SPLASH_END, SCENE_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#000",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Home screen layer — visible during reveal phase, hidden during expand */}
      {frame < APP_EXPAND_END && (
        <IOSHomeScreen frame={frame} fps={fps} />
      )}

      {/* App-launch expand — Kiva icon scales fullscreen */}
      {frame >= APP_EXPAND_START && frame < APP_EXPAND_END + 2 && (
        <AppLaunchExpand frame={frame} />
      )}

      {/* Splash layer */}
      {splashOpacity > 0 && (
        <div style={{ position: "absolute", inset: 0, opacity: splashOpacity }}>
          <KivaSplash />
        </div>
      )}

      {/* Dashboard layer */}
      {dashOpacity > 0 && (
        <div style={{ position: "absolute", inset: 0, opacity: dashOpacity }}>
          <DashboardEntry frame={frame} />
        </div>
      )}
    </div>
  );
};

// =====================================================================
// iOS HOME SCREEN — generic dark wallpaper, app grid, Kiva highlighted
// =====================================================================
const IOSHomeScreen: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  // Home reveal fade — phone display goes black → iOS home over PHONE_FADE_END..HOME_REVEAL_END
  const reveal = interpolate(frame, [PHONE_FADE_END, HOME_REVEAL_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  if (reveal <= 0) return null;

  // Kiva icon pulse — scale 1→1.04→1 every 30f
  const kivaPulse = 1 + 0.04 * Math.sin((frame / 30) * Math.PI * 2);

  // Cursor enter → tap on Kiva icon
  const cursorP = interpolate(frame, [CURSOR_ENTER, CURSOR_TAP], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  const cursorX = interpolate(cursorP, [0, 1], [240, 0]);
  const showCursor = frame >= CURSOR_ENTER && frame < APP_EXPAND_START + 4;

  // Click compress on Kiva icon
  const tapT = frame - CURSOR_TAP;
  const tapCompress =
    tapT >= 0 && tapT < 6
      ? interpolate(tapT, [0, 2, 4, 6], [1, 0.92, 1, 1])
      : 1;

  // Click ripple
  const rippleP = interpolate(frame, [CURSOR_TAP, CURSOR_TAP + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outExpo,
  });
  const rippleOpacity = interpolate(
    frame,
    [CURSOR_TAP, CURSOR_TAP + 10],
    [0.6, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Generic app icons — colored rounded squares, dimmed to 50% during reveal
  const otherIcons: { color: string; label: string }[] = [
    { color: "#34C759", label: "Phn" },
    { color: "#0A84FF", label: "Msg" },
    { color: "#FF3B30", label: "Cam" },
    { color: "#FF9500", label: "Cal" },
    { color: "#AF52DE", label: "Ph" },
    { color: "#5856D6", label: "Mp" },
    { color: "#FF2D55", label: "Mu" },
    { color: "#FFCC00", label: "Nt" },
    { color: "#5AC8FA", label: "Sf" },
    { color: "#FF6482", label: "Bk" },
    { color: "#A2845E", label: "Wt" },
  ];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: reveal,
        background:
          "linear-gradient(180deg, #1a1a2e 0%, #0f0f1e 100%)",
        paddingTop: 56,
        paddingLeft: 18,
        paddingRight: 18,
        fontFamily: "Inter, system-ui",
      }}
    >
      {/* App grid — 4 cols × 4 rows, Kiva at row 1 col 0 (prominent position) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 22,
          marginTop: 30,
        }}
      >
        {/* Kiva app icon — full bright, pulsing */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            transform: `scale(${kivaPulse * tapCompress})`,
            position: "relative",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: COLOR.navy,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 0 ${10 + 6 * Math.sin((frame / 30) * Math.PI * 2)}px rgba(59,130,246,0.6)`,
            }}
          >
            <svg width="36" height="36" viewBox="0 0 200 200">
              <path
                d="M62 100 L85 68 L95 78 L76 100 L95 122 L85 132 Z"
                fill="#F8FAFC"
              />
              <path
                d="M95 78 L118 68 L143 100 L118 132 L95 122 L114 100 Z"
                fill={COLOR.blue}
              />
            </svg>
          </div>
          <div
            style={{
              fontSize: 9,
              fontWeight: 600,
              color: "#fff",
              textShadow: "0 1px 2px rgba(0,0,0,0.6)",
            }}
          >
            Kiva
          </div>
          {/* Click ripple over Kiva icon */}
          {frame >= CURSOR_TAP && (
            <div
              style={{
                position: "absolute",
                top: 28,
                left: "50%",
                transform: `translate(-50%, -50%) scale(${1 + rippleP * 1.8})`,
                width: 56,
                height: 56,
                borderRadius: "50%",
                border: `3px solid ${COLOR.blue}`,
                opacity: rippleOpacity,
                pointerEvents: "none",
              }}
            />
          )}
        </div>

        {/* Other icons — dimmed 50% */}
        {otherIcons.map((icon, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              opacity: 0.5,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                background: icon.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              {icon.label}
            </div>
            <div
              style={{
                fontSize: 9,
                fontWeight: 500,
                color: "rgba(255,255,255,0.7)",
              }}
            >
              App
            </div>
          </div>
        ))}
      </div>

      {/* Cursor (rendered above app grid) */}
      {showCursor && (
        <div
          style={{
            position: "absolute",
            top: 110,
            left: 28,
            transform: `translateX(${cursorX}px)`,
            width: 32,
            height: 32,
            fontSize: 32,
            color: "#fff",
            pointerEvents: "none",
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
          }}
        >
          ▲
        </div>
      )}
    </div>
  );
};

// =====================================================================
// APP-LAUNCH EXPAND — Kiva icon scales fullscreen with easeOutCubic
// =====================================================================
const AppLaunchExpand: React.FC<{ frame: number }> = ({ frame }) => {
  const p = interpolate(
    frame,
    [APP_EXPAND_START, APP_EXPAND_END],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE.outCubic,
    }
  );
  // Icon starts at home position (~row 1, col 0 of 4-col grid)
  // From scale 1 to ~9 (filling 393-wide phone screen from a 56-wide icon)
  const iconScale = interpolate(p, [0, 1], [1, 9]);
  const iconOpacity = interpolate(p, [0, 0.7, 1], [1, 1, 0.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Approx home grid position for Kiva icon (top-left of grid)
  const startX = 46;
  const startY = 116;
  // Move to phone center as it expands
  const targetX = 196.5; // PHONE.width / 2
  const targetY = 426; // PHONE.height / 2
  const x = interpolate(p, [0, 1], [startX, targetX]);
  const y = interpolate(p, [0, 1], [startY, targetY]);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${iconScale})`,
        transformOrigin: "center center",
        width: 56,
        height: 56,
        borderRadius: 14 * (1 - p * 0.5), // radius shrinks proportionally
        background: COLOR.navy,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: iconOpacity,
        boxShadow: `0 0 ${20 + 60 * p}px rgba(59,130,246,${0.5 + 0.4 * p})`,
        pointerEvents: "none",
      }}
    >
      <svg width="36" height="36" viewBox="0 0 200 200">
        <path d="M62 100 L85 68 L95 78 L76 100 L95 122 L85 132 Z" fill="#F8FAFC" />
        <path d="M95 78 L118 68 L143 100 L118 132 L95 122 L114 100 Z" fill={COLOR.blue} />
      </svg>
    </div>
  );
};

// =====================================================================
// KIVA SPLASH — chevron logo + "Kiva." wordmark + tagline
// =====================================================================
const KivaSplash: React.FC = () => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: COLOR.navy,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
        fontFamily: "Inter, system-ui",
      }}
    >
      {/* Soft radial glow behind lockup */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at center, rgba(59,130,246,0.3) 0%, rgba(0,0,0,0) 60%)",
          pointerEvents: "none",
        }}
      />
      {/* Chevron */}
      <KivaLogo size={80} glow={0.5} />
      {/* Wordmark — "Kiva." with blue period */}
      <div
        style={{
          fontSize: 22,
          fontWeight: 600,
          color: "#fff",
          letterSpacing: -0.4,
          position: "relative",
        }}
      >
        Kiva<span style={{ color: COLOR.blue }}>.</span>
      </div>
      {/* Tagline */}
      <div
        style={{
          fontSize: 12,
          fontWeight: 400,
          color: "rgba(255,255,255,0.8)",
          textAlign: "center",
          maxWidth: 280,
          lineHeight: 1.3,
          position: "relative",
        }}
      >
        {TAGLINE}
      </div>
    </div>
  );
};

// =====================================================================
// DASHBOARD ENTRY — minimal Kiva dashboard preview + "All your admin. One place."
// =====================================================================
const DashboardEntry: React.FC<{ frame: number }> = ({ frame }) => {
  // Caption fades in slightly after dashboard
  const captionOpacity = interpolate(frame, [SPLASH_END + 4, SCENE_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: COLOR.bg,
        paddingTop: 56,
        position: "relative",
        fontFamily: "Inter, system-ui",
      }}
    >
      {/* Kiva. wordmark top-left */}
      <div
        style={{
          padding: "0 16px 12px",
          fontSize: 18,
          fontWeight: 700,
          color: COLOR.navy,
        }}
      >
        Kiva<span style={{ color: COLOR.blue }}>.</span>
      </div>
      {/* Navy header card */}
      <div
        style={{
          background: COLOR.navy,
          margin: "0 14px",
          padding: 14,
          borderRadius: 14,
        }}
      >
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", marginBottom: 4 }}>
          Today
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>£0</div>
      </div>
      {/* Recent activity rows */}
      <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
        <div
          style={{
            background: COLOR.surface,
            border: `1px solid ${COLOR.border}`,
            borderRadius: 10,
            height: 50,
          }}
        />
        <div
          style={{
            background: COLOR.surface,
            border: `1px solid ${COLOR.border}`,
            borderRadius: 10,
            height: 50,
          }}
        />
      </div>
      {/* Mic FAB */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          right: 16,
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: COLOR.blue,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 6px 16px rgba(59,130,246,0.4)",
        }}
      >
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <path
            d="M12 14a3 3 0 0 0 3-3V7a3 3 0 1 0-6 0v4a3 3 0 0 0 3 3Z"
            fill="white"
          />
          <path
            d="M19 11a1 1 0 1 0-2 0 5 5 0 0 1-10 0 1 1 0 1 0-2 0 7 7 0 0 0 6 6.92V21a1 1 0 1 0 2 0v-3.08A7 7 0 0 0 19 11Z"
            fill="white"
          />
        </svg>
      </div>
      {/* Caption */}
      <div
        style={{
          position: "absolute",
          bottom: 30,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 10,
          fontWeight: 500,
          color: COLOR.textSec,
          opacity: captionOpacity,
        }}
      >
        All your admin. One place.
      </div>
    </div>
  );
};
