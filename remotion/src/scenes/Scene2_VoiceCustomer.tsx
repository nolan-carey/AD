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
import { MicButton } from "../components/MicButton";
import { Thumb } from "../components/Thumb";
import { GlassPlate } from "../components/GlassPlate";
import { AISparkleLoader } from "../components/AISparkleLoader";
import { SfxAt } from "../components/SfxAt";
import { popInProgress } from "../motion";

// =====================================================================
// SCENE 2 — AI Voice-to-Customer (v1.14 simplified, frames 240–420)
// 180 frames @ 30 fps · INTIMATE identity
//
// Opens with the iPhone ALREADY showing the New Customer sheet pre-loaded
// (handed off from Scene 1's morph). NO FAB tap, NO AI Assistant sheet,
// NO navigation. Beat-by-beat:
//   • 0–30  : establish — gentle push-in
//   • 30–60 : thumb taps mic, mic activates, halo flips to purple
//   • 60–120: words type beside mic in <GlassPlate> ("Annie Yang" → number → city)
//   • 120–150: brief loader — sparkle, "Transcribing your voice…"
//   • 150–165: form fields auto-fill (Name → Phone → Address → Contact)
//   • 165–180: focus caption "AI extracted in 0.4 seconds." + transition prep
// =====================================================================

const ESTABLISH_END = 30;
const TAP_FRAME = 42; // thumb taps mic
const TYPE_START = 60; // words begin streaming in glass plate
const ANNIE_START = 64;
const ANNIE_END = 82;
const PHONE_START = 86;
const PHONE_END = 104;
const CITY_START = 108;
const CITY_END = 120;
const LOADER_START = 120;
const LOADER_END = 150;
const FORM_FILL_START = 150;
const FORM_FILL_END = 165;
const CAPTION_START = 165;

// Voice-extraction phrases and their typing windows (start, end frames local)
const TYPED_WORDS: { text: string; start: number; end: number }[] = [
  { text: "Annie Yang", start: ANNIE_START, end: ANNIE_END },
  { text: "07700 900123", start: PHONE_START, end: PHONE_END },
  { text: "Notting Hill", start: CITY_START, end: CITY_END },
];

// Number of visible characters of `phrase` at frame `f` (local).
function visibleCharCount(
  f: number,
  start: number,
  end: number,
  phrase: string
): number {
  if (f < start) return 0;
  if (f >= end) return phrase.length;
  const progress = (f - start) / (end - start);
  return Math.floor(progress * phrase.length);
}

export const Scene2VoiceCustomer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Camera push-in: 1.0 → 1.08 over establish, 1.08 → 1.18 during tap, hold,
  // pull back to 1.10 during loader, settle to 1.05 by end.
  const cameraScale = interpolate(
    frame,
    [0, ESTABLISH_END, TAP_FRAME + 18, LOADER_START + 12, FORM_FILL_END + 8, 180],
    [1.0, 1.08, 1.18, 1.10, 1.06, 1.0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE.inOutQuad,
    }
  );

  return (
    <AbsoluteFill>
      {/* The cinematic shell (gradient + drift + AI halo) renders globally in
          KivaAd.tsx; Scene 2 only contributes the phone screen + overlays. */}
      <PhoneFrame scale={cameraScale}>
        <NewCustomerScreen frame={frame} fps={fps} />
      </PhoneFrame>

      {/* Right-side glass plate — captured voice text streams in */}
      {frame >= TYPE_START && frame < LOADER_START && (
        <VoiceWordsPlate frame={frame} fps={fps} />
      )}

      {/* Right-side focus caption at scene close */}
      {frame >= CAPTION_START && <FocusCaption frame={frame} />}

      {/* Thumb tap on the mic — local frame TAP_FRAME = 42 */}
      <Thumb x={1080} y={780} tapAtFrame={TAP_FRAME} rippleColor={COLOR.aiPurple} />

      {/* === AUDIO === */}
      {/* Underbed — bed_intimate_warm.mp3 not generated yet, fall back to ai_hum_ambient */}
      <SfxAt
        src={GEN.aiHum}
        from={0}
        loop
        volume={(f) =>
          interpolate(f, [0, 8, 170, 180], [0, 0.08, 0.08, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
        durationInFrames={180}
      />
      {/* Mic tap click */}
      <SfxAt src={SFX.click} from={TAP_FRAME} volume={0.85} />
      {/* Mic activate blip */}
      <SfxAt
        src={SFX.notification1}
        from={TAP_FRAME + 2}
        volume={0.5}
        playbackRate={Math.pow(2, 4 / 12)}
      />
      {/* Typing texture — sparse clicks every 4 frames during type window */}
      {[68, 72, 76, 80, 90, 94, 98, 102, 110, 114, 118].map((f) => (
        <SfxAt
          key={`type-${f}`}
          src={SFX.click}
          from={f}
          volume={0.2}
          playbackRate={1.05}
        />
      ))}
      {/* Stage-1-complete chime as transcription finishes */}
      <SfxAt
        src={SFX.notification1}
        from={138}
        volume={0.35}
        playbackRate={Math.pow(2, 5 / 12)}
      />
      {/* Per-field clicks during auto-fill */}
      <SfxAt src={SFX.click} from={152} volume={0.25} />
      <SfxAt src={SFX.click} from={156} volume={0.25} playbackRate={1.05} />
      <SfxAt src={SFX.click} from={160} volume={0.25} playbackRate={1.1} />
      {/* Match chime on contact-method pill lock — sparkle_match fallback */}
      <SfxAt
        src={SFX.notification2}
        from={162}
        volume={0.35}
        playbackRate={Math.pow(2, 3 / 12)}
      />
    </AbsoluteFill>
  );
};

// =====================================================================
// NEW CUSTOMER SCREEN (in-phone) — AI badge top, Use AI toggle, INCLUDE chips,
// centered MicButton + caption, FormFields auto-fill below mic at end of scene.
// =====================================================================
const NewCustomerScreen: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const isRecording = frame >= TAP_FRAME && frame < LOADER_START;
  const showLoader = frame >= LOADER_START && frame < FORM_FILL_START;
  const showFields = frame >= FORM_FILL_START;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: COLOR.bg,
        fontFamily: "Inter, system-ui",
        position: "relative",
      }}
    >
      {/* Topbar */}
      <div
        style={{
          paddingTop: 56,
          padding: "56px 16px 12px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 600, color: COLOR.navy }}>← Back</span>
        <span
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: 15,
            fontWeight: 600,
            color: COLOR.navy,
            pointerEvents: "none",
          }}
        >
          New Customer
        </span>
        <span
          style={{
            background: COLOR.aiPurpleBg,
            color: COLOR.aiPurple,
            fontSize: 10,
            fontWeight: 500,
            padding: "4px 10px",
            borderRadius: 12,
          }}
        >
          AI powered
        </span>
      </div>

      <div style={{ padding: "0 16px" }}>
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: COLOR.navy,
            textAlign: "center",
            marginTop: 6,
            marginBottom: 4,
          }}
        >
          {showFields ? "Annie Yang" : "Who's the customer?"}
        </div>
        <div
          style={{
            fontSize: 11,
            color: COLOR.textTer,
            textAlign: "center",
            marginBottom: 18,
          }}
        >
          {showFields ? "Saved automatically." : "Speak or type — we'll fill in their details."}
        </div>

        {/* Use AI toggle row */}
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
            <span style={{ fontSize: 14, color: COLOR.aiPurple }}>✦</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: COLOR.navy }}>Use AI</div>
              <div style={{ fontSize: 9, color: COLOR.textTer, marginTop: 2 }}>
                {isRecording ? "Listening…" : "Speak or type — we'll fill in their details"}
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

        {/* INCLUDE chips */}
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
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 18 }}>
          {["Name", "Phone", "Email", "Address", "Contact"].map((label) => (
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

        {/* Mic / loader / fields stage */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 8, marginBottom: 10 }}>
          {showLoader ? (
            <LoaderStage frame={frame} />
          ) : (
            <>
              <MicButton startFrame={TAP_FRAME} recording={isRecording} />
              <div
                style={{
                  fontSize: 11,
                  color: COLOR.textTer,
                  marginTop: 10,
                  textAlign: "center",
                }}
              >
                {isRecording ? "Listening…" : "Tap to start recording"}
              </div>
            </>
          )}
        </div>

        {showFields && <FormFields frame={frame} fps={fps} />}
      </div>
    </div>
  );
};

const LoaderStage: React.FC<{ frame: number }> = ({ frame }) => {
  const t = frame - LOADER_START;
  const stageDur = LOADER_END - LOADER_START;
  const stage1 = interpolate(t, [0, stageDur * 0.45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const stage2 = interpolate(t, [stageDur * 0.45, stageDur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <>
      <AISparkleLoader size={72} startFrame={LOADER_START} />
      <div
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: COLOR.navy,
          marginTop: 18,
          textAlign: "center",
        }}
      >
        Transcribing your voice…
      </div>
      <div
        style={{
          fontSize: 11,
          color: COLOR.textTer,
          textAlign: "center",
          marginTop: 4,
        }}
      >
        Turning audio into text.
      </div>
      <div style={{ display: "flex", gap: 6, marginTop: 16 }}>
        <ProgressTrack progress={stage1} />
        <ProgressTrack progress={stage2} />
      </div>
    </>
  );
};

const ProgressTrack: React.FC<{ progress: number }> = ({ progress }) => (
  <div
    style={{
      width: 100,
      height: 4,
      borderRadius: 2,
      background: "#E2E8F0",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        width: `${progress * 100}%`,
        height: "100%",
        background: COLOR.aiPurple,
      }}
    />
  </div>
);

const FormFields: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const fields = [
    { label: "NAME", value: "Annie Yang", appear: 0 },
    { label: "PHONE", value: "07700 900123", appear: 4 },
    { label: "ADDRESS", value: "Notting Hill, London", appear: 8 },
    { label: "CONTACT", value: "WhatsApp", appear: 12, isPill: true },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
      {fields.map((f, i) => {
        const t = frame - FORM_FILL_START - f.appear;
        if (t < -2) return null;
        const flashP = interpolate(t, [0, 3, 8], [1, 0.4, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const valOpacity = interpolate(t, [2, 6], [0, 1], {
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
              {f.label}
            </div>
            <div
              style={{
                position: "relative",
                background: f.isPill && t >= 4 ? COLOR.navy : "#fff",
                border: f.isPill && t >= 4 ? "none" : `1.5px solid ${COLOR.border}`,
                borderRadius: f.isPill ? 999 : 8,
                padding: "9px 12px",
                fontSize: 12,
                color: f.isPill && t >= 4 ? "#fff" : COLOR.navy,
                minHeight: 22,
                display: "flex",
                alignItems: "center",
                justifyContent: f.isPill ? "center" : "flex-start",
                fontWeight: f.isPill ? 700 : 500,
                width: f.isPill ? 110 : "auto",
                alignSelf: f.isPill ? "flex-start" : "stretch",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: COLOR.aiPurpleBg,
                  opacity: flashP,
                  borderRadius: f.isPill ? 999 : 8,
                  pointerEvents: "none",
                }}
              />
              <span style={{ position: "relative", opacity: valOpacity }}>{f.value}</span>
              {!f.isPill && (
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
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// =====================================================================
// VOICE WORDS PLATE — glass plate to the right of phone, types in 3 phrases
// =====================================================================
const VoiceWordsPlate: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  // Plate enters with fade + scale 0.95→1 at TYPE_START
  const enterP = interpolate(frame, [TYPE_START, TYPE_START + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  const exitP = interpolate(frame, [LOADER_START - 6, LOADER_START], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = enterP - exitP;
  const scale = interpolate(enterP - exitP, [0, 1], [0.95, 1.0]);

  return (
    <div
      style={{
        position: "absolute",
        left: 1240,
        top: 360,
        width: 460,
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: "left center",
      }}
    >
      <GlassPlate radius={18}>
        <div
          style={{
            padding: "14px 18px",
            fontFamily: "Inter, system-ui",
          }}
        >
          {/* Mini sparkle loader header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <span
              style={{
                color: COLOR.aiPurple,
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              ✦
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: "rgba(255,255,255,0.7)",
                letterSpacing: 0.6,
                textTransform: "uppercase",
              }}
            >
              AI listening…
            </span>
          </div>
          {TYPED_WORDS.map((w, i) => {
            const visible = visibleCharCount(frame, w.start, w.end, w.text);
            if (frame < w.start) return null;
            const pulseT = frame - w.end;
            const landedScale =
              pulseT >= 0 && pulseT <= 6
                ? interpolate(pulseT, [0, 3, 6], [1, 1.06, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  })
                : 1;
            return (
              <div
                key={i}
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#fff",
                  marginBottom: i < TYPED_WORDS.length - 1 ? 8 : 0,
                  letterSpacing: -0.2,
                  display: "flex",
                  alignItems: "baseline",
                  gap: 4,
                  transform: `scale(${landedScale})`,
                  transformOrigin: "left center",
                  textShadow: visible >= w.text.length ? "0 0 14px rgba(109,40,217,0.5)" : "none",
                }}
              >
                <span>{w.text.slice(0, visible)}</span>
                {/* Cursor */}
                {frame >= w.start && visible < w.text.length && (
                  <span
                    style={{
                      display: "inline-block",
                      width: 2,
                      height: 22,
                      background: COLOR.aiPurple,
                      opacity: Math.floor(frame / 6) % 2 === 0 ? 1 : 0,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </GlassPlate>
    </div>
  );
};

// =====================================================================
// FOCUS CAPTION — glass plate to the right at scene close (F165–180)
// "AI extracted in 0.4 seconds." (Inter_400Regular 18 px, white 90%)
// =====================================================================
const FocusCaption: React.FC<{ frame: number }> = ({ frame }) => {
  const TEXT = "AI extracted in 0.4 seconds.";
  const t = frame - CAPTION_START;
  // type in over 0..20 frames
  const typingP = interpolate(t, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const visible = Math.floor(typingP * TEXT.length);
  const enter = interpolate(t, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.outCubic,
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 1240,
        top: 540,
        width: 420,
        opacity: enter,
      }}
    >
      <GlassPlate radius={14}>
        <div
          style={{
            padding: "12px 16px",
            fontFamily: "Inter, system-ui",
            fontSize: 18,
            fontWeight: 400,
            color: "rgba(255,255,255,0.9)",
            letterSpacing: -0.1,
          }}
        >
          {TEXT.slice(0, visible)}
          {visible < TEXT.length && (
            <span
              style={{
                display: "inline-block",
                width: 2,
                height: 18,
                background: "rgba(255,255,255,0.7)",
                marginLeft: 2,
                verticalAlign: "middle",
                opacity: Math.floor(frame / 8) % 2 === 0 ? 1 : 0,
              }}
            />
          )}
        </div>
      </GlassPlate>
    </div>
  );
};
