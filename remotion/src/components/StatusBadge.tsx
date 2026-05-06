import React from "react";
import { COLOR, RADIUS } from "../tokens";

export type StatusKind =
  | "sent"
  | "accepted"
  | "paid"
  | "pending"
  | "overdue"
  | "draft";

interface StatusBadgeProps {
  status: StatusKind;
  label?: string;
}

const STATUS_STYLE: Record<StatusKind, { bg: string; fg: string; label: string }> = {
  sent: { bg: COLOR.sentBg, fg: COLOR.sentText, label: "Sent" },
  accepted: { bg: COLOR.acceptedBg, fg: COLOR.accepted, label: "Accepted" },
  paid: { bg: "#DCFCE7", fg: COLOR.accepted, label: "Paid" },
  pending: { bg: "#FEF3C7", fg: "#92400E", label: "Pending" },
  overdue: { bg: "#FEE2E2", fg: "#991B1B", label: "Overdue" },
  draft: { bg: COLOR.divider, fg: COLOR.textSec, label: "Draft" },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
  const style = STATUS_STYLE[status];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        background: style.bg,
        color: style.fg,
        padding: "3px 9px",
        borderRadius: RADIUS.pill,
        fontFamily: "Inter, system-ui",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 0.2,
      }}
    >
      {label ?? style.label}
    </span>
  );
};
