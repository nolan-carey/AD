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
  imessage: { icon: "iM", iconBg: COLOR.imessage, appName: "Messages", accent: COLOR.imessage },
  whatsapp: { icon: "WA", iconBg: COLOR.whatsapp, appName: "WhatsApp", accent: COLOR.whatsapp },
  email: { icon: "M", iconBg: "#1976D2", appName: "Mail", accent: "#1976D2" },
  call: { icon: "Ph", iconBg: COLOR.overdue, appName: "Phone", appLabel: "MISSED CALL", accent: COLOR.overdue },
  calendar: { icon: "Cal", iconBg: "#FF3B30", appName: "Calendar", accent: "#FF3B30" },
  hmrc: { icon: "GOV", iconBg: "#0B0C0C", appName: "HMRC", accent: "#FFCC00" },
  google: { icon: "G", iconBg: "#4285F4", appName: "Google", accent: "#4285F4" },
  stripe: { icon: "S", iconBg: "#635BFF", appName: "Stripe", accent: "#635BFF" },
  screwfix: { icon: "SF", iconBg: "#003478", appName: "Screwfix", accent: "#FF6600" },
  voicemail: { icon: "VM", iconBg: "#8E8E93", appName: "Voicemail", accent: "#8E8E93" },
  banking: { icon: "Bk", iconBg: "#005EB8", appName: "Lloyds Bank", accent: "#005EB8" },
  generic: { icon: "•", iconBg: "#64748B", appName: "Notification", accent: "#64748B" },
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
        // v1.42: faux-glass fill — keeps the glassy LOOK of the original
        // backdrop-filter version, but is static (no live sampling).
        // Layered look:
        //   • soft vertical gradient (light-through-glass shimmer)
        //   • inner top highlight (1 px white at 25%) for depth
        //   • inner bottom shadow (1 px black at 20%) for dimension
        //   • outer drop-shadow (preserved by GlassPlate)
        // backdrop-filter EXPLICITLY OFF so the texture never recomputes
        // when cards (or the camera drift) move.
        background:
          "linear-gradient(180deg, rgba(40,55,80,0.78) 0%, rgba(20,30,50,0.82) 100%)",
        backdropFilter: "none",
        WebkitBackdropFilter: "none",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(0,0,0,0.18), 0 8px 32px rgba(0,0,0,0.45)",
      }}
    >
      <div
        style={{
          padding: "12px 14px",
          paddingLeft: meta.accent ? 18 : 14, // shift past the accent strip
          display: "flex",
          gap: 12,
          alignItems: "center", // vertically center icon vs. text block
          fontFamily: "Inter, system-ui",
          color: "#fff",
        }}
      >
        <div
          style={{
            position: "relative",
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
