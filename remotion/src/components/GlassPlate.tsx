import React from "react";

interface GlassPlateProps {
  children: React.ReactNode;
  width?: number | string;
  height?: number | string;
  radius?: number;
  // Optional inner color wash (e.g., red gradient bar for missed call notifications,
  // green WhatsApp accent, etc.). Renders as a 4px left strip on the inside of the plate.
  innerAccentColor?: string;
  // Override style for advanced usage.
  style?: React.CSSProperties;
}

// =====================================================================
// GlassPlate — glassmorphism container for floating overlays.
// (ad_plan §3.7.2 + companion §5.0)
//   • background: rgba(255,255,255,0.06)
//   • backdrop-filter: blur(20px) saturate(140%)
//   • border: 1px solid rgba(255,255,255,0.12)
//   • box-shadow: 0 8px 32px rgba(0,0,0,0.4)
//
// Use for: notification cards (Scene 1), focus captions, Mrs. Patel callback
// (Scene 7), any element FLOATING OUTSIDE the phone.
// DO NOT use for: UI inside the phone screen — those use opaque tokens.
// =====================================================================

export const GlassPlate: React.FC<GlassPlateProps> = ({
  children,
  width,
  height,
  radius = 16,
  innerAccentColor,
  style,
}) => {
  return (
    <div
      style={{
        width,
        height,
        position: "relative",
        background: "rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px) saturate(140%)",
        WebkitBackdropFilter: "blur(20px) saturate(140%)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: radius,
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        overflow: "hidden",
        ...style,
      }}
    >
      {innerAccentColor && (
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            width: 4,
            background: innerAccentColor,
          }}
        />
      )}
      {children}
    </div>
  );
};
