import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLOR, PHONE } from "../tokens";

interface PhoneFrameProps {
  children: React.ReactNode;
  // Legacy 2D transform string (kept for backward compatibility — used for
  // pre-v1.13 scenes that pass an explicit rotateZ string).
  transform?: string;
  // 1.0 = phone at canonical PHONE.scale (~83% of 1080 frame height)
  scale?: number;
  // Shadow intensity 0–1
  shadow?: number;
  // === v1.13 3D rendering props (companion §5.0) ===
  // Externally-driven rotation (degrees) — drift is added on top.
  rotateY?: number;
  rotateX?: number;
  rotateZ?: number;
  // Z-axis translation for parallax control between scenes.
  translateZ?: number;
  // X/Y translation for camera pans (drift added on top of Y).
  translateX?: number;
  translateY?: number;
  // Disable the constant drift for stills or rendering tests.
  disableDrift?: boolean;
}

// =====================================================================
// PhoneFrame — iPhone 15 chrome rendered in 3D (ad_plan §3.7.2 + companion §5.0)
//   • Resting tilt rotateY -6°, rotateX +3° (angled toward viewer)
//   • Constant drift sine waves on Y/X rotation + Y translate
//   • Inner glow box-shadow bleed (display = light source)
//   • Lighting overlay gradients (top-left highlight + bottom-right blue rim)
//   • Backward compatible with the 2D `transform` + `scale` API
// =====================================================================

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  transform = "",
  scale = 1,
  shadow = 1,
  rotateY = -6,
  rotateX = 3,
  rotateZ = 0,
  translateZ = 0,
  translateX = 0,
  translateY = 0,
  disableDrift = false,
}) => {
  const frame = useCurrentFrame();
  const totalScale = PHONE.scale * scale;

  // Constant drift (companion §5.0)
  const driftRotY = disableDrift ? 0 : Math.sin(frame / 36) * 0.8;
  const driftRotX = disableDrift ? 0 : Math.cos(frame / 42) * 0.5;
  const driftY = disableDrift ? 0 : Math.sin(frame / 30) * 3;

  const composedTransform = `
    translateX(${translateX}px)
    translateY(${translateY + driftY}px)
    translateZ(${translateZ}px)
    rotateY(${rotateY + driftRotY}deg)
    rotateX(${rotateX + driftRotX}deg)
    rotateZ(${rotateZ}deg)
    scale(${totalScale})
    ${transform}
  `;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        transformStyle: "preserve-3d",
      }}
    >
      <div
        style={{
          width: PHONE.width,
          height: PHONE.height,
          position: "relative",
          transform: composedTransform,
          transformOrigin: "center center",
          transformStyle: "preserve-3d",
          borderRadius: PHONE.bezelRadius,
          background: "#000",
          boxShadow: `
            0 ${40 * shadow}px ${80 * shadow}px rgba(0,0,0,${0.55 * shadow}),
            0 ${10 * shadow}px ${30 * shadow}px rgba(0,0,0,${0.4 * shadow}),
            0 0 80px rgba(59,130,246,0.25)
          `,
          padding: 6,
          boxSizing: "border-box",
        }}
      >
        {/* Inner bezel — the screen */}
        <div
          style={{
            position: "absolute",
            inset: 6,
            borderRadius: PHONE.bezelRadius - 6,
            background: COLOR.bg,
            overflow: "hidden",
          }}
        >
          {/* Status bar */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 50,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 28px",
              fontFamily: "Inter, system-ui",
              fontSize: 15,
              fontWeight: 600,
              color: COLOR.navy,
              zIndex: 5,
              pointerEvents: "none",
            }}
          >
            <span>9:41</span>
            <span style={{ display: "flex", gap: 5, alignItems: "center" }}>
              <DotsBars />
              <Wifi />
              <Battery />
            </span>
          </div>

          {/* Dynamic island */}
          <div
            style={{
              position: "absolute",
              top: 11,
              left: "50%",
              transform: "translateX(-50%)",
              width: PHONE.notchWidth,
              height: PHONE.notchHeight,
              background: "#000",
              borderRadius: 22,
              zIndex: 10,
            }}
          />

          {/* Home indicator */}
          <div
            style={{
              position: "absolute",
              bottom: 8,
              left: "50%",
              transform: "translateX(-50%)",
              width: 134,
              height: 5,
              background: "rgba(0,0,0,0.4)",
              borderRadius: 999,
              zIndex: 10,
              pointerEvents: "none",
            }}
          />

          {/* Screen content area */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              overflow: "hidden",
            }}
          >
            {children}
          </div>

          {/* === v1.13 lighting overlays (no real 3D lights) === */}
          {/* Top-left key highlight (warm) */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 30%)",
              pointerEvents: "none",
              zIndex: 20,
              mixBlendMode: "screen",
            }}
          />
          {/* Bottom-right rim (cool blue) */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(315deg, rgba(59,130,246,0.06) 0%, transparent 25%)",
              pointerEvents: "none",
              zIndex: 21,
              mixBlendMode: "screen",
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const DotsBars: React.FC = () => (
  <svg width="18" height="11" viewBox="0 0 18 11">
    <rect x="0" y="6" width="3" height="5" rx="1" fill="currentColor" />
    <rect x="5" y="3" width="3" height="8" rx="1" fill="currentColor" />
    <rect x="10" y="0" width="3" height="11" rx="1" fill="currentColor" />
    <rect x="15" y="0" width="3" height="11" rx="1" fill="currentColor" />
  </svg>
);

const Wifi: React.FC = () => (
  <svg width="16" height="11" viewBox="0 0 16 11">
    <path
      d="M8 0 C 12 0 14.5 1.8 16 3 L 14.5 4.6 C 13.4 3.7 11.2 2.2 8 2.2 C 4.8 2.2 2.6 3.7 1.5 4.6 L 0 3 C 1.5 1.8 4 0 8 0 Z M 8 4 C 10.4 4 12.1 5.0 13 5.7 L 11.5 7.3 C 10.7 6.6 9.6 6 8 6 C 6.4 6 5.3 6.6 4.5 7.3 L 3 5.7 C 3.9 5.0 5.6 4 8 4 Z M 8 8 C 9 8 9.7 8.4 10 8.7 L 8 11 L 6 8.7 C 6.3 8.4 7 8 8 8 Z"
      fill="currentColor"
    />
  </svg>
);

const Battery: React.FC = () => (
  <svg width="26" height="12" viewBox="0 0 26 12">
    <rect
      x="0"
      y="0"
      width="22"
      height="11"
      rx="3"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      opacity="0.45"
    />
    <rect x="23" y="3.5" width="2" height="4" rx="0.5" fill="currentColor" opacity="0.45" />
    <rect x="2" y="2" width="14" height="7" rx="1.5" fill="currentColor" />
  </svg>
);
