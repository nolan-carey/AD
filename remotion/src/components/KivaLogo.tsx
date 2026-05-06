import React from "react";
import { Img } from "remotion";
import { IMG } from "../audio";

interface KivaLogoProps {
  size?: number;
  glow?: number; // 0–1 intensity
  glowColor?: string;
}

// Wraps the source SVG. Soft glow halo controlled by `glow`.
export const KivaLogo: React.FC<KivaLogoProps> = ({
  size = 200,
  glow = 0,
  glowColor = "rgba(59,130,246,0.45)",
}) => {
  const glowSize = size * 0.6;
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
      }}
    >
      {glow > 0 && (
        <div
          style={{
            position: "absolute",
            inset: -glowSize / 2,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${glowColor} 0%, rgba(59,130,246,0) 70%)`,
            opacity: glow,
            filter: "blur(20px)",
          }}
        />
      )}
      <Img
        src={IMG.logo}
        style={{
          width: size,
          height: size,
          position: "relative",
          zIndex: 1,
        }}
      />
    </div>
  );
};
