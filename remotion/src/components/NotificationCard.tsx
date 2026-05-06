import React from "react";
import { COLOR } from "../tokens";
import { GlassPlate } from "./GlassPlate";

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
  {
    icon: string;
    iconBg: string;
    appName: string;
    appLabel?: string;
    accent?: string; // optional inner accent color (left strip on the GlassPlate)
  }
> = {
  imessage: { icon: "iMessage", iconBg: COLOR.imessage, appName: "Messages" },
  whatsapp: { icon: "WA", iconBg: COLOR.whatsapp, appName: "WhatsApp", accent: COLOR.whatsapp },
  email: { icon: "Mail", iconBg: "#1976D2", appName: "Mail" },
  call: { icon: "Phone", iconBg: COLOR.overdue, appName: "Phone", appLabel: "MISSED CALL", accent: COLOR.overdue },
  calendar: { icon: "Cal", iconBg: "#FF3B30", appName: "Calendar" },
  hmrc: { icon: "GOV", iconBg: "#0B0C0C", appName: "HMRC", accent: "#FFCC00" },
  google: { icon: "G", iconBg: "#4285F4", appName: "Google" },
  stripe: { icon: "S", iconBg: "#635BFF", appName: "Stripe", accent: "#635BFF" },
  screwfix: { icon: "SF", iconBg: "#003478", appName: "Screwfix", accent: "#FF6600" },
  voicemail: { icon: "VM", iconBg: "#8E8E93", appName: "Voicemail" },
  banking: { icon: "Bk", iconBg: "#005EB8", appName: "Lloyds Bank" },
  generic: { icon: "•", iconBg: "#64748B", appName: "Notification" },
};

// =====================================================================
// NotificationCard — v1.13 composes <GlassPlate> per ad_plan §3.7.2.
// Cards float OUTSIDE the phone (Scene 1 cluster, Scene 7 Patel callback),
// so they use glassmorphism instead of opaque white.
// =====================================================================

export const NotificationCard: React.FC<NotificationCardProps> = ({
  variant,
  sender,
  body,
  width = 460,
}) => {
  const meta = VARIANT_META[variant];
  return (
    <GlassPlate
      width={width}
      radius={22}
      innerAccentColor={meta.accent}
      style={{
        // Slight luminance lift over the default GlassPlate so cards read
        // clearly over the dark cinematic gradient.
        background: "rgba(255,255,255,0.10)",
      }}
    >
      <div
        style={{
          padding: "12px 14px",
          paddingLeft: meta.accent ? 18 : 14, // shift past the accent strip
          display: "flex",
          gap: 12,
          alignItems: "flex-start",
          fontFamily: "Inter, system-ui",
          color: "#fff",
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
            boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
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
                fontSize: 11,
                fontWeight: 600,
                color: "rgba(255,255,255,0.65)",
                letterSpacing: 0.4,
                textTransform: "uppercase",
              }}
            >
              {meta.appLabel ?? meta.appName}
            </span>
            <span
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.45)",
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
              color: "#fff",
            }}
          >
            {sender}
          </div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 400,
              lineHeight: 1.25,
              color: "rgba(255,255,255,0.92)",
            }}
          >
            {body}
          </div>
        </div>
      </div>
    </GlassPlate>
  );
};
