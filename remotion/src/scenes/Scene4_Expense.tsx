import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLOR, EASE, SPRING } from "../tokens";
import { SFX, GEN } from "../audio";
import { PhoneFrame } from "../components/PhoneFrame";
import { SheetContainer } from "../components/SheetContainer";
import { SfxAt } from "../components/SfxAt";
import { popInProgress } from "../motion";

// =====================================================================
// SCENE 4 — AI Expense Classification (frames 462–558 = local 0–96)
// Real Expenses/index.js modalStyles applied: aiPoweredBg toggle row, receipt
// card pattern, category chips. Adds zoom-in on the scan moment + scale pulse
// on the matched category chip.
// =====================================================================

// v1.14 retimed (Scene 4 local 0–150, abs 660–810):
//   0–30    open MID-SCAN (receipt photo already attached; "Scanning…" state)
//   30–54   blue scan line sweeps + OCR fragments
//   54–78   form fields auto-fill (Description / Amount / Date)
//   78–102  category lock — "Construction Materials" springs to navy
//   102–132 save tap → sheet dismiss → list row drop → counter roll
//   132–150 hold + transition prep
const SHEET_RISE = 0;
const RECEIPT_DROP = 0;
const SCAN_SWEEP = 30;
const FORM_FILL = 54;
const CATEGORY_LOCK = 78;
const SAVE_TAP = 110;

export const Scene4Expense: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Camera scan-zoom: gentle 1.0 → 1.05 push during scan, settle by 40
  const scanZoom = interpolate(frame, [SCAN_SWEEP - 2, SCAN_SWEEP + 16, FORM_FILL + 6], [1.0, 1.05, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOutQuad,
  });
  // Category lock zoom: gentle pop on the chip lock
  const lockPunch = interpolate(frame, [CATEGORY_LOCK, CATEGORY_LOCK + 6, CATEGORY_LOCK + 14], [1.0, 1.04, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  const cameraScale = scanZoom * lockPunch;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${COLOR.navy} 0%, ${COLOR.surfaceDark} 100%)`,
      }}
    >
      <PhoneFrame scale={cameraScale}>
        {/* Faded dashboard backdrop behind the sheet */}
        <FadedDashboard frame={frame} />

        {frame < SAVE_TAP + 16 && (
          <SheetContainer
            frame={frame}
            riseAtFrame={SHEET_RISE}
            dismissAtFrame={SAVE_TAP + 4}
            backdropOpacity={0.45}
          >
            <NewExpenseSheetContent frame={frame} fps={fps} />
          </SheetContainer>
        )}

        {frame >= SAVE_TAP + 12 && <ExpensesList frame={frame} fps={fps} />}
      </PhoneFrame>

      {/* === AUDIO === */}
      {/* Scan sweep (generated) during the OCR scan — -12 dBFS */}
      <SfxAt src={GEN.scanSweep} from={SCAN_SWEEP} volume={0.25} />
      {/* TACTILE bed (v1.11 P2) — full-scene underbed, -22 dBFS */}
      <SfxAt
        src={GEN.bedTactile}
        from={0}
        loop
        volume={(f) =>
          interpolate(f, [0, 8, 132, 150], [0, 0.08, 0.08, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
        durationInFrames={150}
      />
      {[0, 8, 16].map((offset, i) => (
        <SfxAt
          key={`tick-${i}`}
          src={SFX.click}
          from={FORM_FILL + offset}
          volume={0.3}
          playbackRate={1.2 + i * 0.05}
        />
      ))}
      {/* sparkle_match (v1.15 — re-generated after duration bump) on category lock */}
      <SfxAt
        src={GEN.sparkleMatch}
        from={CATEGORY_LOCK + 4}
        volume={0.32}
      />
      <SfxAt src={SFX.click} from={SAVE_TAP + 4} volume={0.85} />
      <SfxAt src={SFX.swoosh} from={SAVE_TAP + 8} volume={0.55} />
      {/* transition_glitch_cut (v1.15) — Scene 4→5 boundary, abs F804 = local F144 */}
      <SfxAt src={GEN.transGlitch} from={144} volume={0.32} />
    </AbsoluteFill>
  );
};

// Minimal faded dashboard backdrop (the sheet covers most of it)
const FadedDashboard: React.FC<{ frame: number }> = ({ frame }) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      background: COLOR.surfaceDark,
      opacity: 0.7,
    }}
  />
);

// =====================================================================
// NEW EXPENSE SHEET CONTENT — translated from real Expenses/index.js modalStyles
// =====================================================================
const NewExpenseSheetContent: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  return (
    <div style={{ fontFamily: "Inter, system-ui" }}>
      {/* Title row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 4,
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 700, color: COLOR.navy }}>New Expense</div>
        <div style={{ fontSize: 14, color: COLOR.textTer }}>×</div>
      </div>
      <div style={{ fontSize: 11, color: COLOR.textTer, marginBottom: 14 }}>
        Snap a receipt — AI classifies it.
      </div>

      {/* AI toggle row — real: aiPoweredBg, padding 12/10, radius 10 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: COLOR.aiPurpleBg,
          border: `1px solid ${COLOR.border}`,
          borderRadius: 10,
          padding: "10px 12px",
          marginBottom: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
          <div style={{ fontSize: 14, color: COLOR.aiPurple }}>✦</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: COLOR.navy }}>Use AI</div>
            <div style={{ fontSize: 9, color: COLOR.textTer, marginTop: 2 }}>
              Scanning receipt…
            </div>
          </div>
        </div>
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

      {/* Receipt photo card — real: padding 8, radius 12, border, gap 12 */}
      <ReceiptCard frame={frame} fps={fps} />

      {/* Form fields */}
      <FormFields frame={frame} />

      {/* Category chips */}
      <CategoryChips frame={frame} fps={fps} />

      {/* Save button */}
      <SaveButton frame={frame} />
    </div>
  );
};

// =====================================================================
// RECEIPT CARD with scan line
// =====================================================================
const ReceiptCard: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  // Receipt drop animation
  const dropSp = popInProgress(frame, fps, RECEIPT_DROP);
  const dropY = interpolate(dropSp, [0, 1], [-20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dropOpacity = interpolate(dropSp, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginTop: 4,
        marginBottom: 14,
        padding: 8,
        background: COLOR.bg,
        border: `1px solid ${COLOR.border}`,
        borderRadius: 12,
        position: "relative",
        transform: `translateY(${dropY}px)`,
        opacity: dropOpacity,
      }}
    >
      {/* Receipt thumbnail (mock) */}
      <div
        style={{
          position: "relative",
          width: 56,
          height: 56,
          borderRadius: 8,
          background: "#FAFAFA",
          padding: 4,
          flexShrink: 0,
          overflow: "hidden",
        }}
      >
        <div style={{ fontSize: 6, fontWeight: 800, color: "#1a1a1a" }}>WICKES</div>
        <div style={{ fontSize: 5, color: "#666", marginTop: 1 }}>04/03/26</div>
        <div style={{ fontSize: 5, lineHeight: 1.3, color: "#1a1a1a", marginTop: 2 }}>
          Bath waste...
          <br />
          Basin trap...
          <br />
          Pipe fitting...
        </div>
        <div
          style={{
            fontSize: 6,
            fontWeight: 800,
            borderTop: "1px dashed #999",
            paddingTop: 1,
            marginTop: 2,
            textAlign: "right",
            color: "#1a1a1a",
          }}
        >
          £147.32
        </div>
        {/* Scan line overlay (only during SCAN_SWEEP) */}
        {frame >= SCAN_SWEEP && frame < FORM_FILL && (
          <ScanLine frame={frame} />
        )}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: COLOR.navy, marginBottom: 4 }}>
          Receipt photo attached
        </div>
        <div style={{ fontSize: 9, color: COLOR.textSec, display: "flex", alignItems: "center", gap: 4 }}>
          {frame >= SCAN_SWEEP && frame < FORM_FILL ? (
            <>
              <span style={{ color: COLOR.aiPurple, fontWeight: 700 }}>✦</span> Scanning…
            </>
          ) : frame >= FORM_FILL ? (
            <>
              <span style={{ color: COLOR.accepted, fontWeight: 700 }}>✓</span> Extracted
            </>
          ) : (
            <>Tap to preview</>
          )}
        </div>
      </div>

      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          background: COLOR.surface,
          border: `1px solid ${COLOR.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          color: COLOR.textSec,
        }}
      >
        ×
      </div>

      {/* OCR fragments floating off the receipt (positioned over the card) */}
      {frame >= SCAN_SWEEP && frame < FORM_FILL + 4 && <OCRFragments frame={frame} />}
    </div>
  );
};

const ScanLine: React.FC<{ frame: number }> = ({ frame }) => {
  const t = frame - SCAN_SWEEP;
  const progress = interpolate(t, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        top: progress * 56,
        left: 0,
        right: 0,
        height: 2,
        background: COLOR.blue,
        boxShadow: `0 0 8px ${COLOR.blue}, 0 0 16px ${COLOR.blue}`,
        opacity: progress < 0.95 ? 1 : 1 - (progress - 0.95) * 20,
      }}
    />
  );
};

const OCRFragments: React.FC<{ frame: number }> = ({ frame }) => {
  const fragments = [
    { text: "Wickes", x: 80, y: 0, appear: 4 },
    { text: "£147.32", x: 200, y: -10, appear: 8 },
    { text: "04/03/26", x: 130, y: 18, appear: 12 },
  ];
  return (
    <>
      {fragments.map((f, i) => {
        const ft = frame - SCAN_SWEEP - f.appear;
        if (ft < 0) return null;
        const fragP = interpolate(ft, [0, 6, 14], [0, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const drift = interpolate(ft, [0, 14], [0, -16]);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: f.y,
              left: f.x,
              transform: `translateY(${drift}px)`,
              fontFamily: "Inter, system-ui",
              fontSize: 10,
              fontWeight: 700,
              color: COLOR.aiPurple,
              background: COLOR.aiPurpleBg,
              padding: "2px 6px",
              borderRadius: 999,
              opacity: fragP,
              boxShadow: `0 0 12px rgba(109,40,217,0.4)`,
              whiteSpace: "nowrap",
              pointerEvents: "none",
              zIndex: 10,
            }}
          >
            ✦ {f.text}
          </div>
        );
      })}
    </>
  );
};

// =====================================================================
// FORM FIELDS (Description, Amount, Date)
// =====================================================================
const FormFields: React.FC<{ frame: number }> = ({ frame }) => {
  const fields = [
    { label: "DESCRIPTION", value: "Wickes — bathroom fittings", appear: 0 },
    { label: "AMOUNT", value: "£147.32", appear: 8 },
    { label: "DATE", value: "04/03/2026", appear: 16 },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
      {fields.map((f, i) => {
        const t = frame - FORM_FILL - f.appear;
        if (t < -2) return null;
        const flashP = interpolate(t, [0, 3, 8], [1, 0.4, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const valOpacity = interpolate(t, [2, 6], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div key={i}>
            <div style={{ fontSize: 9, fontWeight: 600, color: COLOR.navy, marginBottom: 4 }}>
              {f.label}
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
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: COLOR.aiPurpleBg,
                  opacity: flashP,
                  borderRadius: 8,
                }}
              />
              <span style={{ position: "relative", opacity: valOpacity, fontWeight: 500 }}>
                {f.value}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// =====================================================================
// CATEGORY CHIPS — real Expenses chip styling, with bouncy "match" scale
// =====================================================================
const CategoryChips: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const cats = [
    { label: "Construction Materials", id: "matched", color: "#0EA5E9", bg: "#E0F2FE" },
    { label: "Parts", id: "parts", color: "#22C55E", bg: "#DCFCE7" },
    { label: "Tools", id: "tools", color: "#F59E0B", bg: "#FEF3C7" },
    { label: "Fuel", id: "fuel", color: "#EF4444", bg: "#FEE2E2" },
    { label: "Other", id: "other", color: COLOR.textSec, bg: COLOR.divider },
  ];
  return (
    <div style={{ marginBottom: 14 }}>
      <div
        style={{
          fontSize: 9,
          fontWeight: 600,
          color: COLOR.textTer,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          marginBottom: 6,
        }}
      >
        Category
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        {cats.map((c, i) => {
          const isMatched = c.id === "matched";
          const t = frame - CATEGORY_LOCK;
          const sp = isMatched ? popInProgress(frame, fps, CATEGORY_LOCK) : 0;
          // Match chip pops with bouncy scale; turns navy
          const scale = isMatched
            ? 1 + 0.12 * Math.max(0, sp - 0) - 0.12 * Math.max(0, sp - 1) * 0.5
            : 1;
          const showMatched = isMatched && t >= 0;
          return (
            <div
              key={c.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "6px 10px",
                borderRadius: 14,
                border: `1px solid ${showMatched ? COLOR.navy : COLOR.border}`,
                background: showMatched ? COLOR.navy : COLOR.surface,
                fontFamily: "Inter, system-ui",
                fontSize: 9,
                fontWeight: showMatched ? 700 : 500,
                color: showMatched ? "#fff" : COLOR.textSec,
                transform: `scale(${scale})`,
                boxShadow: showMatched ? "0 6px 14px rgba(15,23,42,0.4)" : "none",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  background: c.color,
                  border: showMatched ? "1px solid #fff" : "none",
                }}
              />
              {c.label}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// =====================================================================
// SAVE BUTTON
// =====================================================================
const SaveButton: React.FC<{ frame: number }> = ({ frame }) => {
  const t = frame - SAVE_TAP;
  const press = interpolate(t, [0, 4, 10], [1, 0.96, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pressed = t >= 4 && t < 10;
  return (
    <div
      style={{
        background: pressed ? "#fff" : COLOR.navy,
        border: pressed ? `1.5px solid ${COLOR.navy}` : "1.5px solid transparent",
        borderRadius: 10,
        padding: "11px 10px",
        textAlign: "center",
        fontFamily: "Inter, system-ui",
        fontSize: 11,
        fontWeight: 600,
        color: pressed ? COLOR.navy : "#fff",
        transform: `scale(${press})`,
        minHeight: 44,
        boxSizing: "border-box",
      }}
    >
      Save expense
    </div>
  );
};

// =====================================================================
// EXPENSES LIST (after sheet dismiss) — new row drops in
// =====================================================================
const ExpensesList: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const t = frame - (SAVE_TAP + 12);
  const fadeIn = interpolate(t, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const newRowSp = popInProgress(frame, fps, SAVE_TAP + 16);
  const newRowY = interpolate(newRowSp, [0, 1], [-22, 0]);
  const newRowScale = interpolate(newRowSp, [0, 1], [0.92, 1]);
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
        <div style={{ fontSize: 22, fontWeight: 700, color: COLOR.navy }}>Expenses</div>
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
          £147.32
        </div>
      </div>
      <div style={{ padding: "0 14px" }}>
        <div
          style={{
            background: COLOR.surface,
            border: `1px solid ${COLOR.border}`,
            borderRadius: 10,
            padding: 12,
            transform: `translateY(${newRowY}px) scale(${newRowScale})`,
            display: "flex",
            alignItems: "center",
            gap: 10,
            boxShadow: newRowSp < 0.6 ? "0 8px 16px rgba(109,40,217,0.18)" : "none",
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              background: COLOR.aiPurpleBg,
              color: COLOR.aiPurple,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 800,
            }}
          >
            ✦
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: COLOR.navy }}>
              Wickes — bathroom fittings
            </div>
            <div style={{ fontSize: 10, color: COLOR.textTer }}>
              Construction Materials · 04/03/2026
            </div>
          </div>
          <div style={{ fontSize: 13, fontWeight: 800, color: COLOR.navy }}>
            £147.32
          </div>
        </div>
      </div>
    </div>
  );
};
