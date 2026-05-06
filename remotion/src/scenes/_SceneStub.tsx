import React from "react";
import { AbsoluteFill } from "remotion";
import { COLOR } from "../tokens";

// Placeholder while Norm is mid-build. Each WIP scene renders this with its label.
export const SceneStub: React.FC<{ label: string; subtitle?: string }> = ({
  label,
  subtitle,
}) => {
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${COLOR.navy} 0%, ${COLOR.surfaceDark} 100%)`,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 14,
        fontFamily: "Inter, system-ui",
        color: "#fff",
      }}
    >
      <div
        style={{
          fontSize: 22,
          fontWeight: 600,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: COLOR.aiPurple,
        }}
      >
        WIP — Norm building
      </div>
      <div style={{ fontSize: 72, fontWeight: 800, letterSpacing: -1.5 }}>
        {label}
      </div>
      {subtitle && (
        <div style={{ fontSize: 24, fontWeight: 500, opacity: 0.7 }}>
          {subtitle}
        </div>
      )}
    </AbsoluteFill>
  );
};
