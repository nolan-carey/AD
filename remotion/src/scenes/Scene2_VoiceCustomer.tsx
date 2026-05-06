import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLOR, EASE, SPRING } from "../tokens";
import { SFX } from "../audio";
import { PhoneFrame } from "../components/PhoneFrame";
import { MicButton } from "../components/MicButton";
import { Thumb } from "../components/Thumb";
import { SheetContainer } from "../components/SheetContainer";
import { SfxAt } from "../components/SfxAt";
import { popInProgress, fadeRise } from "../motion";

// =====================================================================
// SCENE 2 — AI Voice-to-Customer (frames 216–312 = local 0–96)
// Real Kiva anatomy (Dashboard/index.js + Customers/index.js styles).
// Adds camera push-in zooms on the FAB tap (1.0→1.04) and "What do you
// need?" reveal (1.0→1.06) so the AI moments feel alive.
// =====================================================================

const SETTLE_END = 12;
const BANNER_IN = 12;
const TAP_FAB = 24;
const SHEET_ROW_HIGHLIGHT = 36;
const NEW_CUSTOMER_OPEN = 40;
const MIC_PULSE = 48;
const FORM_FILL = 66;
const LIST_TRANSITION = 84;

export const Scene2VoiceCustomer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phone settle continuing from Scene 1 — scale 0.55→1.0, tilt 8°→0°
  const settleP = interpolate(frame, [0, SETTLE_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  const phoneScale = interpolate(settleP, [0, 1], [0.55, 1]);
  const phoneTilt = interpolate(settleP, [0, 1], [8, 0]);

  // === Camera push-ins for liveness ===
  // Push 1.0 → 1.04 around the FAB tap (24–40), settles back to 1.0
  const fabPushIn = interpolate(
    frame,
    [TAP_FAB - 4, TAP_FAB + 6, NEW_CUSTOMER_OPEN + 8],
    [1.0, 1.04, 1.0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE.inOutQuad,
    }
  );
  // Slow breathing push during the mic-pulse → form-fill reveal (44–84): 1.0 → 1.05
  const aiBreathing = interpolate(frame, [44, 76], [1.0, 1.05], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOutQuad,
  });
  const cameraScale = fabPushIn * aiBreathing * phoneScale;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${COLOR.navy} 0%, ${COLOR.surfaceDark} 100%)`,
      }}
    >
      <PhoneFrame
        scale={cameraScale}
        transform={`rotateZ(${phoneTilt}deg)`}
      >
        <DashboardScreen frame={frame} />

        {/* WhatsApp inbound banner */}
        {frame >= BANNER_IN && frame < TAP_FAB + 4 && (
          <WhatsAppBanner frame={frame} />
        )}

        {/* AI Assistant sheet (rises at TAP_FAB, dismisses at NEW_CUSTOMER_OPEN) */}
        {frame >= TAP_FAB - 1 && frame < NEW_CUSTOMER_OPEN + 12 && (
          <SheetContainer
            frame={frame}
            riseAtFrame={TAP_FAB}
            dismissAtFrame={NEW_CUSTOMER_OPEN}
          >
            <AssistantSheetContent frame={frame} fps={fps} />
          </SheetContainer>
        )}

        {/* New Customer sheet */}
        {frame >= NEW_CUSTOMER_OPEN - 1 && frame < LIST_TRANSITION + 12 && (
          <SheetContainer
            frame={frame}
            riseAtFrame={NEW_CUSTOMER_OPEN}
            dismissAtFrame={LIST_TRANSITION}
            backdropOpacity={0.4}
          >
            <NewCustomerSheetContent frame={frame} fps={fps} />
          </SheetContainer>
        )}

        {/* Customers list after dismiss */}
        {frame >= LIST_TRANSITION + 6 && (
          <CustomersList frame={frame} fps={fps} />
        )}

        {/* Thumb tap on FAB */}
        <Thumb x={324} y={760} tapAtFrame={TAP_FAB} rippleColor={COLOR.blue} />
      </PhoneFrame>

      {/* === AUDIO === */}
      <SfxAt src={SFX.notification1} from={BANNER_IN} volume={0.45} />
      <SfxAt src={SFX.click} from={TAP_FAB} volume={0.85} />
      <SfxAt src={SFX.swoosh} from={TAP_FAB + 2} volume={0.6} />
      <SfxAt src={SFX.swoosh} from={NEW_CUSTOMER_OPEN} volume={0.45} />
      <SfxAt
        src={SFX.notification2}
        from={MIC_PULSE}
        volume={0.5}
        playbackRate={1.4}
      />
      {[0, 4, 8, 12].map((offset) => (
        <SfxAt
          key={`field-tick-${offset}`}
          src={SFX.click}
          from={FORM_FILL + offset}
          volume={0.3}
          playbackRate={1.2}
        />
      ))}
      <SfxAt src={SFX.swoosh} from={LIST_TRANSITION} volume={0.55} />
    </AbsoluteFill>
  );
};

// =====================================================================
// DASHBOARD — translated from real Dashboard/index.js styles
// =====================================================================
const DashboardScreen: React.FC<{ frame: number }> = ({ frame }) => {
  // Subtle ambient breathing on the navy header (1.0 → 1.005 over scene)
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: COLOR.bg,
        fontFamily: "Inter, system-ui",
      }}
    >
      {/* Navy header (real: bg primary, paddingHorizontal 14, paddingBottom 22) */}
      <div
        style={{
          background: COLOR.navy,
          paddingTop: 56,
          paddingLeft: 14,
          paddingRight: 14,
          paddingBottom: 22,
        }}
      >
        {/* topbar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <KivaMark />
            <span style={{ fontFamily: "Inter, system-ui", fontSize: 20, fontWeight: 700, color: "#fff" }}>
              Kiva<span style={{ color: COLOR.blue }}>.</span>
            </span>
          </div>
          <div style={{ width: 38, height: 38, borderRadius: 19, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.6)" }}>
            ⚙
          </div>
        </div>

        {/* statGrid 2x2 (real: gap 8, statCard surfaceDark, padding 14, radius 12) */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <StatCard label="This Month" value="£0" />
          <StatCard label="Outstanding" value="£0" amber />
          <StatCard label="Quotes Sent" value="0" />
          <StatCard label="Active Jobs" value="0" />
        </div>
      </div>

      {/* body — section header + activity card */}
      <div style={{ paddingLeft: 12, paddingRight: 12, paddingTop: 14 }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: COLOR.textTer,
            textTransform: "uppercase",
            letterSpacing: 0.6,
            marginBottom: 8,
          }}
        >
          Recent Activity
        </div>
        <div
          style={{
            background: COLOR.surface,
            borderRadius: 12,
            border: `1px solid ${COLOR.border}`,
            overflow: "hidden",
          }}
        >
          {[
            { name: "—", sub: "—" },
            { name: "—", sub: "—" },
          ].map((r, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                paddingLeft: 12,
                paddingRight: 12,
                paddingTop: 11,
                paddingBottom: 11,
                minHeight: 48,
                borderBottom: i < 1 ? `1px solid ${COLOR.divider}` : "none",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  background: COLOR.border,
                  marginRight: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 600,
                  color: COLOR.textSec,
                }}
              >
                ·
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: COLOR.navy }}>{r.name}</div>
                <div style={{ fontSize: 10, color: COLOR.textTer }}>{r.sub}</div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: COLOR.navy }}>—</div>
            </div>
          ))}
        </div>
      </div>

      {/* FAB — real: 52 size, accent blue, blue shadow, "AI" label top-right */}
      <FABAi frame={frame} />

      {/* bottom nav placeholder — minimal */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 64,
          background: COLOR.surface,
          borderTop: `1px solid ${COLOR.divider}`,
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        {["Home", "Jobs", "", "Quotes", "More"].map((label, i) => (
          <div
            key={i}
            style={{
              fontFamily: "Inter, system-ui",
              fontSize: 9,
              fontWeight: 500,
              color: i === 0 ? COLOR.blue : COLOR.navInactive,
            }}
          >
            {label || "·"}
          </div>
        ))}
      </div>
    </div>
  );
};

const KivaMark: React.FC = () => (
  <svg width="22" height="22" viewBox="0 0 200 200">
    <rect width="200" height="200" rx="50" fill={COLOR.navy} stroke="rgba(255,255,255,0.15)" />
    <path d="M62 100 L85 68 L95 78 L76 100 L95 122 L85 132 Z" fill="#F8FAFC" />
    <path d="M95 78 L118 68 L143 100 L118 132 L95 122 L114 100 Z" fill={COLOR.blue} />
  </svg>
);

const StatCard: React.FC<{ label: string; value: string; amber?: boolean }> = ({ label, value, amber }) => (
  <div
    style={{
      flex: "1 1 45%",
      minWidth: "45%",
      background: COLOR.surfaceDark,
      borderRadius: 12,
      padding: 14,
    }}
  >
    <div style={{ fontSize: 10, fontWeight: 400, color: COLOR.textSec, marginBottom: 4 }}>
      {label}
    </div>
    <div style={{ fontSize: 24, fontWeight: 700, color: amber ? "#F59E0B" : "#fff" }}>
      {value}
    </div>
  </div>
);

// FAB — real Kiva: 52px, accent blue, with subtle blue ring pulse + tiny "AI" tag
const FABAi: React.FC<{ frame: number }> = ({ frame }) => {
  const ringPulse = interpolate(frame % 60, [0, 30, 60], [1.0, 1.18, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ringOpacity = interpolate(frame % 60, [0, 30, 60], [0.35, 0, 0.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Press compression at TAP_FAB
  const press = interpolate(frame, [TAP_FAB, TAP_FAB + 4, TAP_FAB + 8], [1, 0.92, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ position: "absolute", right: 16, bottom: 80, width: 52, height: 52 }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: "rgba(59,130,246,0.3)",
          transform: `scale(${ringPulse})`,
          opacity: ringOpacity,
        }}
      />
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: COLOR.blue,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 6px 16px rgba(59,130,246,0.45)",
          transform: `scale(${press})`,
        }}
      >
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none">
          <path d="M12 14a3 3 0 0 0 3-3V7a3 3 0 1 0-6 0v4a3 3 0 0 0 3 3Z" fill="#fff" />
          <path d="M19 11a1 1 0 1 0-2 0 5 5 0 0 1-10 0 1 1 0 1 0-2 0 7 7 0 0 0 6 6.92V21a1 1 0 1 0 2 0v-3.08A7 7 0 0 0 19 11Z" fill="#fff" />
        </svg>
      </div>
      {/* AI label badge top-right */}
      <div
        style={{
          position: "absolute",
          top: -2,
          right: -2,
          background: COLOR.aiPurple,
          borderRadius: 5,
          padding: "1px 4px",
          border: `1.5px solid ${COLOR.surface}`,
          fontFamily: "Inter, system-ui",
          fontSize: 7,
          fontWeight: 700,
          color: "#fff",
          letterSpacing: 0.3,
        }}
      >
        AI
      </div>
    </div>
  );
};

// =====================================================================
// WhatsApp inbound banner — drops down from top of phone screen
// =====================================================================
const WhatsAppBanner: React.FC<{ frame: number }> = ({ frame }) => {
  const t = frame - BANNER_IN;
  const enterP = interpolate(t, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  const yOffset = interpolate(enterP, [0, 1], [-80, 0]);
  const fade = interpolate(frame, [TAP_FAB - 2, TAP_FAB + 4], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        top: 50,
        left: 8,
        right: 8,
        transform: `translateY(${yOffset}px)`,
        opacity: fade,
        background: "rgba(245,247,250,0.96)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRadius: 14,
        padding: "10px 12px",
        display: "flex",
        gap: 10,
        boxShadow: "0 8px 16px rgba(0,0,0,0.18)",
      }}
    >
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: 8,
          background: COLOR.whatsapp,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        WA
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 8,
            color: COLOR.textTer,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: 0.6,
          }}
        >
          WhatsApp · now
        </div>
        <div style={{ fontSize: 12, fontWeight: 700, color: COLOR.navy }}>
          Annie Yang
        </div>
        <div
          style={{
            fontSize: 11,
            color: COLOR.navy,
            opacity: 0.85,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          Hi, can you give me a quote?
        </div>
      </div>
    </div>
  );
};

// =====================================================================
// AI ASSISTANT SHEET CONTENT — translated from real Dashboard sheetStyles
// =====================================================================
const AssistantSheetContent: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const ROWS = [
    { title: "New voice quote", subtitle: "Speak the job, AI builds the quote", iconBg: COLOR.blue, icon: "🎙" },
    { title: "New voice customer", subtitle: "Add a customer in one sentence", iconBg: COLOR.blue, icon: "✦", highlighted: true },
    { title: "See jobs on the map", subtitle: "Drive less, work more", iconBg: "#22C55E", icon: "📍" },
    { title: "Follow up on a quote", subtitle: "AI nudges stale quotes for you", iconBg: COLOR.aiPurple, icon: "↗" },
    { title: "Job summary", subtitle: "End-of-day recap", iconBg: COLOR.navy, icon: "≡" },
  ];
  return (
    <div style={{ fontFamily: "Inter, system-ui" }}>
      {/* AI ASSISTANT badge */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          background: COLOR.aiPurple,
          color: "#fff",
          borderRadius: 6,
          padding: "3px 8px",
          fontSize: 8,
          fontWeight: 600,
          letterSpacing: 0.8,
          marginBottom: 8,
        }}
      >
        ✦ AI ASSISTANT
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, color: COLOR.navy, marginBottom: 2 }}>
        What do you need?
      </div>
      <div style={{ fontSize: 12, color: COLOR.textSec, fontWeight: 400, marginBottom: 14 }}>
        Kiva AI can help you get it done faster
      </div>
      {/* Action rows — staggered POP_IN entrances */}
      {ROWS.map((row, i) => {
        const start = TAP_FAB + 6 + i * 2;
        const sp = popInProgress(frame, fps, start);
        const opacity = interpolate(sp, [0, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const y = interpolate(sp, [0, 1], [10, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        // Highlight pulse on "New voice customer" at SHEET_ROW_HIGHLIGHT
        const highlightT = frame - SHEET_ROW_HIGHLIGHT;
        const highlightP =
          row.highlighted && highlightT >= 0 && highlightT < 8
            ? interpolate(highlightT, [0, 4, 8], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
            : 0;
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              paddingTop: 12,
              paddingBottom: 12,
              borderBottom: i < ROWS.length - 1 ? `1px solid ${COLOR.divider}` : "none",
              opacity,
              transform: `translateY(${y}px)`,
              background: highlightP > 0 ? `rgba(59,130,246,${0.08 * highlightP})` : "transparent",
              borderRadius: highlightP > 0 ? 8 : 0,
              paddingLeft: highlightP > 0 ? 8 : 0,
              paddingRight: highlightP > 0 ? 8 : 0,
              transition: "background 100ms",
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: row.iconBg,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              {row.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: COLOR.navy, marginBottom: 2 }}>
                {row.title}
              </div>
              <div style={{ fontSize: 11, color: COLOR.textSec }}>{row.subtitle}</div>
            </div>
            <div style={{ fontSize: 14, color: COLOR.textTer }}>›</div>
          </div>
        );
      })}
    </div>
  );
};

// =====================================================================
// NEW CUSTOMER SHEET CONTENT — real Customers/index.js anatomy
// =====================================================================
const NewCustomerSheetContent: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  return (
    <div style={{ fontFamily: "Inter, system-ui" }}>
      {/* Title + close */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 4,
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 700, color: COLOR.navy }}>New Customer</div>
        <div style={{ fontSize: 14, color: COLOR.textTer }}>×</div>
      </div>
      <div style={{ fontSize: 11, color: COLOR.textTer, marginBottom: 14 }}>
        Speak or type — we'll fill in their details.
      </div>

      {/* AI toggle row — real: aiPoweredBg, border, padding 12/10 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: COLOR.aiPurpleBg,
          border: `1px solid ${COLOR.border}`,
          borderRadius: 10,
          padding: "10px 12px",
          marginBottom: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
          <div
            style={{
              fontSize: 14,
              color: COLOR.aiPurple,
            }}
          >
            ✦
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: COLOR.navy }}>Use AI</div>
            <div style={{ fontSize: 9, color: COLOR.textTer, marginTop: 2 }}>
              Speak or type — we'll fill in their details
            </div>
          </div>
        </div>
        {/* Real switch: 36×20, ai bg when on, white knob */}
        <div
          style={{
            width: 36,
            height: 20,
            borderRadius: 10,
            background: COLOR.aiPurple,
            padding: 2,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <div style={{ width: 16, height: 16, borderRadius: 8, background: "#fff" }} />
        </div>
      </div>

      {/* INCLUDE chip row */}
      <div
        style={{
          fontSize: 9,
          fontWeight: 600,
          color: COLOR.aiPurple,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          marginBottom: 6,
        }}
      >
        INCLUDE:
      </div>
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 14 }}>
        {["Name", "Phone", "Address", "Contact"].map((label) => (
          <div
            key={label}
            style={{
              background: "#fff",
              border: `1px solid #DDD6FE`,
              borderRadius: 999,
              padding: "3px 8px",
              fontSize: 10,
              fontWeight: 500,
              color: COLOR.aiPurple,
            }}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Mic + caption */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 8, marginBottom: 18 }}>
        <MicButton startFrame={MIC_PULSE} />
        <div style={{ fontSize: 11, color: COLOR.textTer, marginTop: 10, textAlign: "center" }}>
          {frame >= MIC_PULSE && frame < FORM_FILL ? "Listening…" : "Tap to start recording"}
        </div>
      </div>

      {/* Sparkle words floating around the mic */}
      {frame >= MIC_PULSE && frame < FORM_FILL && <SparkleWords frame={frame} />}

      {/* Auto-filled fields */}
      <FormFields frame={frame} fps={fps} />
    </div>
  );
};

const SparkleWords: React.FC<{ frame: number }> = ({ frame }) => {
  const words = [
    { text: "Annie Yang", x: "20%", y: "62%", appear: 0 },
    { text: "07700 900123", x: "78%", y: "56%", appear: 4 },
    { text: "Notting Hill", x: "30%", y: "46%", appear: 8 },
  ];
  return (
    <>
      {words.map((w, i) => {
        const t = frame - MIC_PULSE - w.appear;
        if (t < 0) return null;
        const opacity = interpolate(t, [0, 6, 12, 18], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const drift = interpolate(t, [0, 18], [10, -14]);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: w.x,
              top: w.y,
              transform: `translate(-50%, calc(-50% + ${drift}px))`,
              fontFamily: "Inter, system-ui",
              fontSize: 11,
              fontWeight: 700,
              color: COLOR.aiPurple,
              background: COLOR.aiPurpleBg,
              padding: "4px 8px",
              borderRadius: 999,
              opacity,
              boxShadow: `0 0 18px rgba(109,40,217,0.4)`,
              whiteSpace: "nowrap",
              pointerEvents: "none",
            }}
          >
            ✦ {w.text}
          </div>
        );
      })}
    </>
  );
};

const FormFields: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const fields = [
    { label: "Name", value: "Annie Yang", appear: 0 },
    { label: "Phone", value: "07700 900123", appear: 4 },
    { label: "Address", value: "Notting Hill", appear: 8 },
    { label: "Contact", value: "WhatsApp", appear: 12 },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {fields.map((f, i) => {
        const t = frame - FORM_FILL - f.appear;
        if (t < -2) return null;
        const flashP = interpolate(t, [0, 3, 8], [1, 0.5, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const valOpacity = interpolate(t, [2, 7], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const checkOpacity = interpolate(t, [6, 10], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div key={i}>
            <div style={{ fontSize: 9, fontWeight: 600, color: COLOR.navy, marginBottom: 4 }}>
              {f.label.toUpperCase()}
            </div>
            <div
              style={{
                position: "relative",
                background: "#fff",
                border: `1.5px solid ${COLOR.border}`,
                borderRadius: 8,
                padding: "9px 10px",
                fontSize: 12,
                color: COLOR.navy,
                minHeight: 22,
              }}
            >
              {/* purple flash overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: COLOR.aiPurpleBg,
                  opacity: flashP,
                  borderRadius: 8,
                  pointerEvents: "none",
                }}
              />
              <span style={{ position: "relative", opacity: valOpacity, fontWeight: 500 }}>
                {f.value}
              </span>
              <span
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: COLOR.accepted,
                  fontSize: 14,
                  fontWeight: 700,
                  opacity: checkOpacity,
                }}
              >
                ✓
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// =====================================================================
// CUSTOMERS LIST — Annie Yang row drops in, counter rolls
// =====================================================================
const CustomersList: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const t = frame - (LIST_TRANSITION + 6);
  const fadeIn = interpolate(t, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const annieSp = popInProgress(frame, fps, LIST_TRANSITION + 12);
  const annieY = interpolate(annieSp, [0, 1], [-22, 0]);
  const annieScale = interpolate(annieSp, [0, 1], [0.92, 1]);
  const counterP = interpolate(t, [10, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: COLOR.bg,
        opacity: fadeIn,
        fontFamily: "Inter, system-ui",
      }}
    >
      <div
        style={{
          paddingTop: 56,
          paddingLeft: 14,
          paddingRight: 14,
          paddingBottom: 12,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: 22, fontWeight: 700, color: COLOR.navy }}>
          Customers
        </div>
        <div
          style={{
            background: COLOR.divider,
            borderRadius: 999,
            padding: "4px 10px",
            fontSize: 11,
            fontWeight: 700,
            color: COLOR.navy,
          }}
        >
          {counterP < 0.5 ? "2" : "3"}
        </div>
      </div>
      <div
        style={{
          margin: "0 14px 12px",
          background: COLOR.surface,
          border: `1px solid ${COLOR.border}`,
          borderRadius: 10,
          padding: "8px 12px",
          fontSize: 12,
          color: COLOR.textTer,
        }}
      >
        🔎 Search customers
      </div>
      <div style={{ padding: "0 14px" }}>
        <div
          style={{
            background: COLOR.surface,
            border: `1px solid ${COLOR.border}`,
            borderRadius: 10,
            padding: 12,
            marginBottom: 6,
            transform: `translateY(${annieY}px) scale(${annieScale})`,
            display: "flex",
            alignItems: "center",
            gap: 10,
            boxShadow: annieSp < 0.6 ? "0 8px 16px rgba(109,40,217,0.18)" : undefined,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 17,
              background: "#F5F3FF",
              color: COLOR.aiPurple,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            AY
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: COLOR.navy }}>
              Annie Yang
            </div>
            <div style={{ fontSize: 10, color: COLOR.textTer }}>
              Notting Hill · WhatsApp
            </div>
          </div>
          <div
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: COLOR.aiPurple,
              background: COLOR.aiPurpleBg,
              padding: "3px 7px",
              borderRadius: 999,
            }}
          >
            NEW
          </div>
        </div>
        {[
          { initials: "NC", name: "Nolan C", area: "Shepherd's Bush" },
          { initials: "SC", name: "Stan C", area: "Hammersmith" },
        ].map((c, i) => (
          <div
            key={i}
            style={{
              background: COLOR.surface,
              border: `1px solid ${COLOR.border}`,
              borderRadius: 10,
              padding: 12,
              marginBottom: 6,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 17,
                background: COLOR.divider,
                color: COLOR.textSec,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {c.initials}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: COLOR.navy }}>
                {c.name}
              </div>
              <div style={{ fontSize: 10, color: COLOR.textTer }}>{c.area}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
