import React from "react";
import { COLOR, RADIUS } from "../tokens";

interface ButtonProps {
  label: string;
  variant?: "primary" | "secondary" | "accent";
  size?: "sm" | "md" | "lg";
  width?: number | string;
  pressed?: boolean; // shows the "pressed" inverted state
  trailingIcon?: React.ReactNode;
  leadingIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  variant = "primary",
  size = "md",
  width,
  pressed = false,
  trailingIcon,
  leadingIcon,
}) => {
  let bg: string = COLOR.navy;
  let fg: string = "#fff";
  let border: string = "transparent";
  if (variant === "secondary") {
    bg = "#fff";
    fg = COLOR.navy;
    border = COLOR.border;
  } else if (variant === "accent") {
    bg = COLOR.blue;
    fg = "#fff";
  }
  if (pressed) {
    if (variant === "primary") {
      bg = "#fff";
      fg = COLOR.navy;
      border = COLOR.navy;
    } else if (variant === "accent") {
      bg = COLOR.navy;
      fg = "#fff";
    }
  }

  const padY = size === "sm" ? 8 : size === "md" ? 11 : 14;
  const padX = size === "sm" ? 12 : size === "md" ? 16 : 22;
  const fontSize = size === "sm" ? 12 : size === "md" ? 14 : 16;

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        background: bg,
        color: fg,
        border: `1px solid ${border}`,
        padding: `${padY}px ${padX}px`,
        borderRadius: RADIUS.md,
        fontFamily: "Inter, system-ui",
        fontSize,
        fontWeight: 600,
        width,
        boxSizing: "border-box",
        whiteSpace: "nowrap",
      }}
    >
      {leadingIcon}
      <span>{label}</span>
      {trailingIcon}
    </div>
  );
};
