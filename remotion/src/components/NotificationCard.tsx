import React from "react";
import { COLOR } from "../tokens";

export type NotifVariant =
  | "imessage"
  | "whatsapp"
  | "email"
  | "call"
  | "calendar"
  | "hmrc"
  | "google"
  | "stripe"
  | "screwfix"
  | "voicemail"
  | "banking"
  | "generic";

interface NotificationCardProps {
  variant: NotifVariant;
  sender: string;
  body: string;
  width?: number;
}

const VARIANT_META: Record<
  NotifVariant,
  { icon: string; iconBg: string; appName: string; appLabel?: string }
> = {
  imessage: { icon: "iMessage", iconBg: COLOR.imessage, appName: "Messages" },
  whatsapp: { icon: "WA", iconBg: COLOR.whatsapp, appName: "WhatsApp" },
  email: { icon: "Mail", iconBg: "#1976D2", appName: "Mail" },
  call: { icon: "Phone", iconBg: COLOR.overdue, appName: "Phone", appLabel: "MISSED CALL" },
  calendar: { icon: "Cal", iconBg: "#FF3B30", appName: "Calendar" },
  hmrc: { icon: "GOV", iconBg: "#0B0C0C", appName: "HMRC" },
  google: { icon: "G", iconBg: "#4285F4", appName: "Google" },
  stripe: { icon: "S", iconBg: "#635BFF", appName: "Stripe" },
  screwfix: { icon: "SF", iconBg: "#003478", appName: "Screwfix" },
  voicemail: { icon: "VM", iconBg: "#8E8E93", appName: "Voicemail" },
  banking: { icon: "Bk", iconBg: "#005EB8", appName: "Lloyds Bank" },
  generic: { icon: "•", iconBg: "#64748B", appName: "Notification" },
};

export const NotificationCard: React.FC<NotificationCardProps> = ({
  variant,
  sender,
  body,
  width = 460,
}) => {
  const meta = VARIANT_META[variant];
  return (
    <div
      style={{
        width,
        background: "rgba(245,247,250,0.94)",
        borderRadius: 22,
        padding: "12px 14px",
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow:
          "0 12px 30px rgba(0,0,0,0.35), 0 2px 6px rgba(0,0,0,0.25)",
        fontFamily: "Inter, system-ui",
        color: COLOR.navy,
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 9,
          background: meta.iconBg,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 13,
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {meta.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 2,
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: COLOR.textSec,
              letterSpacing: 0.2,
              textTransform: "uppercase",
            }}
          >
            {meta.appLabel ?? meta.appName}
          </span>
          <span
            style={{
              fontSize: 11,
              color: COLOR.textTer,
              fontWeight: 500,
            }}
          >
            now
          </span>
        </div>
        <div
          style={{
            fontSize: 15,
            fontWeight: 700,
            marginBottom: 2,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {sender}
        </div>
        <div
          style={{
            fontSize: 14,
            fontWeight: 400,
            lineHeight: 1.25,
            color: COLOR.navy,
            opacity: 0.9,
          }}
        >
          {body}
        </div>
      </div>
    </div>
  );
};
