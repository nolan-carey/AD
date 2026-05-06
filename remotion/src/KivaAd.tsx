import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { SCENES } from "./tokens";
import { INTER } from "./fonts";
import { CinematicWrapper } from "./components/CinematicWrapper";
import { AIGlow } from "./components/AIGlow";
import { Scene1Overwhelm } from "./scenes/Scene1_Overwhelm";
import { Scene2VoiceCustomer } from "./scenes/Scene2_VoiceCustomer";
import { Scene3VoiceQuote } from "./scenes/Scene3_VoiceQuote";
import { Scene4Expense } from "./scenes/Scene4_Expense";
import { Scene5Route } from "./scenes/Scene5_Route";
import { Scene6FollowUpAssistant } from "./scenes/Scene6_FollowUpAssistant";
import { Scene7Lockup } from "./scenes/Scene7_Lockup";

// =====================================================================
// KivaAd — top-level composition
// v1.13: scenes are sequenced via overlapping <Sequence> blocks (8-frame
// crossfade) so the cinematic shell + persistent phone create morph
// transitions, not cuts. AIGlow halo state cycles per scene (idle/active).
// CinematicWrapper provides gradient bg, noise, vignette, perspective, drift.
// Music-bed hook (C7) — wired but flagged off until user drops a file.
// =====================================================================

// Flip to true once Sound/music/bed.mp3 is dropped in (C7 directive).
const HAS_MUSIC_BED = false;

// 8-frame crossfade overlap between scenes (companion §5.0 morph transition)
const CROSSFADE = 8;

// Per-scene AIGlow state — purple "active" during AI-heavy moments, blue "idle" elsewhere.
const SCENE_GLOW = [
  "idle", // Scene 1 — overwhelm, no AI yet
  "active", // Scene 2 — voice customer (mic + AI fill)
  "active", // Scene 3 — voice quote HERO
  "active", // Scene 4 — expense classification
  "active", // Scene 5 — route optimization
  "active", // Scene 6 — follow-up + assistant
  "idle", // Scene 7 — lockup, returns to brand calm
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
        durationInFrames={SCENES.scene7.duration + CROSSFADE}
        layout="none"
      >
        <SceneCrossfade duration={SCENES.scene7.duration + CROSSFADE}>
          <Scene7Lockup />
        </SceneCrossfade>
      </Sequence>

      {/* Music bed — gated until user drops a file at Sound/music/bed.mp3 */}
      {HAS_MUSIC_BED && (
        <Audio
          src={staticFile("sound/music/bed.mp3")}
          volume={0.4}
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
