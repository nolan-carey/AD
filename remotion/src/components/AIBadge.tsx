import React from "react";
import { COLOR, RADIUS } from "../tokens";

interface AIBadgeProps {
  label?: string;
  size?: "sm" | "md";
  inverse?: boolean;
}

export const AIBadge: React.FC<AIBadgeProps> = ({
  label = "AI POWERED",
  size = "sm",
  inverse = false,
}) => {
  const fontSize = size === "sm" ? 10 : 12;
  const padY = size === "sm" ? 3 : 5;
  const padX = size === "sm" ? 7 : 10;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        background: inverse ? COLOR.aiPurple : COLOR.aiPurpleBg,
        color: inverse ? "#fff" : COLOR.aiPurple,
        padding: `${padY}px ${padX}px`,
        borderRadius: RADIUS.pill,
        fontFamily: "Inter, system-ui",
        fontSize,
        fontWeight: 700,
        letterSpacing: 0.5,
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      <SparkleSm />
      {label}
    </span>
  );
};

const SparkleSm: React.FC = () => (
  <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 0 L9.4 5.6 L15 7 L9.4 8.4 L8 14 L6.6 8.4 L1 7 L6.6 5.6 Z" />
  </svg>
);

interface AIBannerProps {
  text: string;
  width?: number;
}

export const AIBanner: React.FC<AIBannerProps> = ({ text, width = 320 }) => (
  <div
    style={{
      width,
      background: COLOR.aiPurpleBg,
      color: COLOR.aiPurple,
      borderRadius: 12,
      padding: "10px 12px",
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontFamily: "Inter, system-ui",
      fontSize: 12,
      fontWeight: 600,
    }}
  >
    <SparkleSm />
    <span>{text}</span>
  </div>
);
