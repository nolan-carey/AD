import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Audio } from "@remotion/media";
import { SCENES } from "./tokens";
import { INTER } from "./fonts";
import { CinematicWrapper } from "./components/CinematicWrapper";
import { AIGlow } from "./components/AIGlow";
import { Scene1Overwhelm } from "./scenes/Scene1_Overwhelm";
import { Scene2VoiceCustomer } from "./scenes/Scene2_VoiceCustomer"; // v1.20: now Logo→iPhone hero reveal
import { Scene3VoiceQuote } from "./scenes/Scene3_VoiceQuote"; // v1.20: HERO 1 (compressed to 120f, internals to be retimed in v1.21)
import { Scene4Expense } from "./scenes/Scene4_Expense"; // v1.20: slot now Quote→Customer transformation (content stale until v1.21)
import { Scene5Route } from "./scenes/Scene5_Route"; // v1.20: HERO 2 (compressed to 90f, internals to be retimed in v1.21)
import { Scene6FollowUpAssistant } from "./scenes/Scene6_FollowUpAssistant"; // v1.20: HERO 3 (compressed to 90f)
import { Scene7Lockup } from "./scenes/Scene7_Lockup"; // v1.20: slot now AI Business Assistant (content stale until v1.21)
import { Scene8HeroShot } from "./scenes/Scene8_HeroShot"; // v1.20: NEW Final Device Hero Shot + new tagline

// =====================================================================
// KivaAd — top-level composition
// v1.13: scenes are sequenced via overlapping <Sequence> blocks (8-frame
// crossfade) so the cinematic shell + persistent phone create morph
// transitions, not cuts. AIGlow halo state cycles per scene (idle/active).
// CinematicWrapper provides gradient bg, noise, vignette, perspective, drift.
// Music-bed hook (C7) — wired but flagged off until user drops a file.
// =====================================================================

// Music bed gating (ad_plan §4.6).
// v1.18: bed generated via ElevenLabs Music API + manually approved (45s).
// v1.20: structure compressed to 27s (810f). The 45s bed's act peaks no longer
// align with the new scene boundaries, so we keep it ON as ambient texture but
// the user has approved a re-timed prompt for re-generation. When the new bed
// lands, swap and adjust the volume callback.
const HAS_MUSIC_BED = true;
// White-flash hard-silence window — was Scene 3 white-flash at abs F582 in v1.14.
// v1.20: Scene 3 retiming TBD in v1.21; window no longer maps to a flash. Kept
// at 0,0 (no-op) until v1.21 deepens Scene 3.
const WHITE_FLASH_MUTE_START = 0;
const WHITE_FLASH_MUTE_END = 0;
// Final-fade window — bed continues past the 27s composition end, but the
// composition stops rendering at TOTAL_FRAMES so this is mostly belt-and-braces.
const FINAL_FADE_START = 765; // 0.5s before end
const FINAL_FADE_END = 810;

// 12-frame crossfade overlap between scenes (ad_plan §5 v1.14 morph transition)
const CROSSFADE = 12;

// Per-scene AIGlow state (v1.20: 8 scenes — purple "active" during AI moments).
const SCENE_GLOW = [
  "idle", // Scene 1 — overwhelm, no AI yet
  "idle", // Scene 2 — logo→iPhone hero reveal (brand moment, not AI)
  "active", // Scene 3 — voice→quote HERO 1
  "active", // Scene 4 — quote→customer transformation HERO 2
  "active", // Scene 5 — route optimization HERO 3
  "active", // Scene 6 — AI follow-up HERO 4
  "active", // Scene 7 — AI Business Assistant
  "idle", // Scene 8 — final hero shot, brand calm
] as const;

// Driver: returns AIGlow state + last-change frame based on absolute frame.
function useAiGlowState(): { state: "idle" | "active"; changedAtFrame: number } {
  const frame = useCurrentFrame();
  const sceneStarts = [
    SCENES.scene1.from,
    SCENES.scene2.from,
    SCENES.scene3.from,
    SCENES.scene4.from,
    SCENES.scene5.from,
    SCENES.scene6.from,
    SCENES.scene7.from,
    SCENES.scene8.from,
  ];
  // Walk forward until we find the active scene
  let idx = 0;
  for (let i = sceneStarts.length - 1; i >= 0; i--) {
    if (frame >= sceneStarts[i]) {
      idx = i;
      break;
    }
  }
  // Find most recent state change by walking back to first scene with same state
  let changedAtFrame = sceneStarts[idx];
  for (let i = idx - 1; i >= 0; i--) {
    if (SCENE_GLOW[i] === SCENE_GLOW[idx]) {
      changedAtFrame = sceneStarts[i];
    } else {
      break;
    }
  }
  return { state: SCENE_GLOW[idx], changedAtFrame };
}

const SceneStack: React.FC = () => {
  const glow = useAiGlowState();
  return (
    <>
      {/* AI glow halo behind the phone — switches state on scene boundaries */}
      <AIGlow state={glow.state} changedAtFrame={glow.changedAtFrame} />

      {/* Scenes — overlapping Sequence with crossfade overlap so the phone
          feels persistent across boundaries. Each scene already wraps its own
          PhoneFrame; their shared resting position + drift makes the visual
          handoff continuous within ~8 frames. */}
      <Sequence
        from={SCENES.scene1.from}
        durationInFrames={SCENES.scene1.duration + CROSSFADE}
        layout="none"
      >
        <Scene1Overwhelm />
      </Sequence>
      <Sequence
        from={SCENES.scene2.from - CROSSFADE}
        durationInFrames={SCENES.scene2.duration + CROSSFADE * 2}
        layout="none"
      >
        <SceneCrossfade duration={SCENES.scene2.duration + CROSSFADE * 2}>
          <Scene2VoiceCustomer />
        </SceneCrossfade>
      </Sequence>
      <Sequence
        from={SCENES.scene3.from - CROSSFADE}
        durationInFrames={SCENES.scene3.duration + CROSSFADE * 2}
        layout="none"
      >
        <SceneCrossfade duration={SCENES.scene3.duration + CROSSFADE * 2}>
          <Scene3VoiceQuote />
        </SceneCrossfade>
      </Sequence>
      <Sequence
        from={SCENES.scene4.from - CROSSFADE}
        durationInFrames={SCENES.scene4.duration + CROSSFADE * 2}
        layout="none"
      >
        <SceneCrossfade duration={SCENES.scene4.duration + CROSSFADE * 2}>
          <Scene4Expense />
        </SceneCrossfade>
      </Sequence>
      <Sequence
        from={SCENES.scene5.from - CROSSFADE}
        durationInFrames={SCENES.scene5.duration + CROSSFADE * 2}
        layout="none"
      >
        <SceneCrossfade duration={SCENES.scene5.duration + CROSSFADE * 2}>
          <Scene5Route />
        </SceneCrossfade>
      </Sequence>
      <Sequence
        from={SCENES.scene6.from - CROSSFADE}
        durationInFrames={SCENES.scene6.duration + CROSSFADE * 2}
        layout="none"
      >
        <SceneCrossfade duration={SCENES.scene6.duration + CROSSFADE * 2}>
          <Scene6FollowUpAssistant />
        </SceneCrossfade>
      </Sequence>
      <Sequence
        from={SCENES.scene7.from - CROSSFADE}
        durationInFrames={SCENES.scene7.duration + CROSSFADE * 2}
        layout="none"
      >
        <SceneCrossfade duration={SCENES.scene7.duration + CROSSFADE * 2}>
          <Scene7Lockup />
        </SceneCrossfade>
      </Sequence>
      <Sequence
        from={SCENES.scene8.from - CROSSFADE}
        durationInFrames={SCENES.scene8.duration + CROSSFADE}
        layout="none"
      >
        <SceneCrossfade duration={SCENES.scene8.duration + CROSSFADE}>
          <Scene8HeroShot />
        </SceneCrossfade>
      </Sequence>

      {/* Music bed (v1.18 / v1.20) — 45s ambient instrumental, played under the
          27s composition (excess clipped at end). Sits at -18 dBFS so SFX punch
          through. Final 1.5s of the 27s composition fades the bed to silence.
          v1.21 will swap in a re-timed 27s bed once Steve approves. */}
      {HAS_MUSIC_BED && (
        <Audio
          src={staticFile("sound/music/bed.mp3")}
          volume={(f) => {
            if (
              WHITE_FLASH_MUTE_END > WHITE_FLASH_MUTE_START &&
              f >= WHITE_FLASH_MUTE_START &&
              f < WHITE_FLASH_MUTE_END
            )
              return 0;
            if (f >= FINAL_FADE_START) {
              return interpolate(f, [FINAL_FADE_START, FINAL_FADE_END], [0.15, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
            }
            return 0.15;
          }}
        />
      )}
    </>
  );
};

// Cross-fades the scene wrapper at boundaries — old scene fades out, new fades in.
const SceneCrossfade: React.FC<{
  duration: number;
  children: React.ReactNode;
}> = ({ duration, children }) => {
  const frame = useCurrentFrame();
  // First CROSSFADE frames: fade in 0→1
  const fadeIn = Math.min(1, frame / CROSSFADE);
  // Last CROSSFADE frames: fade out 1→0
  const fadeOut = Math.min(1, (duration - frame) / CROSSFADE);
  const opacity = Math.max(0, Math.min(fadeIn, fadeOut));
  return (
    <AbsoluteFill style={{ opacity }}>
      {children}
    </AbsoluteFill>
  );
};

export const KivaAd: React.FC = () => {
  void INTER;
  return (
    <AbsoluteFill style={{ background: "#000", fontFamily: INTER }}>
      <CinematicWrapper>
        <SceneStack />
      </CinematicWrapper>
    </AbsoluteFill>
  );
};
