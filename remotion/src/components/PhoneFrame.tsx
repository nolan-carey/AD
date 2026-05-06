import React from "react";
import { AbsoluteFill } from "remotion";
import { COLOR, PHONE } from "../tokens";

interface PhoneFrameProps {
  children: React.ReactNode;
  // In-frame transform (rotation/translation/scale tweaks) — applied on top of the base centering.
  transform?: string;
  // 1.0 = phone at canonical PHONE.scale (~83% of 1080 frame height)
  scale?: number;
  // Shadow intensity 0–1
  shadow?: number;
}

// The iPhone chrome: rounded bezel, dynamic island, home indicator, status bar.
// Children render inside the screen area (393 x 852 logical px after status/home).
export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  transform = "",
  scale = 1,
  shadow = 1,
}) => {
  const totalScale = PHONE.scale * scale;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: PHONE.width,
          height: PHONE.height,
          position: "relative",
          transform: `scale(${totalScale}) ${transform}`,
          transformOrigin: "center center",
          borderRadius: PHONE.bezelRadius,
          background: "#000",
          boxShadow: `0 ${40 * shadow}px ${80 * shadow}px rgba(0,0,0,${
            0.55 * shadow
          }), 0 ${10 * shadow}px ${30 * shadow}px rgba(0,0,0,${0.4 * shadow})`,
          padding: 6,
          boxSizing: "border-box",
        }}
      >
        {/* Inner bezel */}
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
