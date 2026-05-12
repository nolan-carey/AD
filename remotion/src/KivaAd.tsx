import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Audio } from "@remotion/media";
import { SCENES, TOTAL_FRAMES } from "./tokens";
import { INTER } from "./fonts";
import { CinematicWrapper } from "./components/CinematicWrapper";
import { AIGlow } from "./components/AIGlow";
import { TweaksContext, KivaAdTweaks, DEFAULT_TWEAKS } from "./tweaks";
import { Scene1Overwhelm } from "./scenes/Scene1_Overwhelm";
// v1.21: filenames preserved for git diff continuity, but content fully replaced.
// File-name → new-role mapping:
//   Scene2_VoiceCustomer  → Reset transition + Logo→iPhone reveal
//   Scene3_VoiceQuote     → Dashboard reveal + mic zoom
//   Scene4_Expense        → Voice→Quote transformation (HERO with John Smith / £280)
//   Scene5_Route          → Quote→Customer profile
//   Scene6_FollowUpAssistant → Receipt→Expense (Plumbing Supplies / £46.20)
//   Scene7_Lockup         → Map→Route (4 pins / 32 min saved)
//   Scene8_HeroShot       → Pin→Follow-up
// New files:
//   Scene9_BusinessAssistant — AI Business Assistant
//   Scene10_FinalHero       — Final hero shot
import { Scene2VoiceCustomer } from "./scenes/Scene2_VoiceCustomer";
import { Scene3VoiceQuote } from "./scenes/Scene3_VoiceQuote";
import { Scene4Expense } from "./scenes/Scene4_Expense";
import { Scene5Route } from "./scenes/Scene5_Route";
import { Scene6FollowUpAssistant } from "./scenes/Scene6_FollowUpAssistant";
import { Scene7Lockup } from "./scenes/Scene7_Lockup";
import { Scene8HeroShot } from "./scenes/Scene8_HeroShot";
import { Scene9BusinessAssistant } from "./scenes/Scene9_BusinessAssistant";
import { Scene10FinalHero } from "./scenes/Scene10_FinalHero";

// =====================================================================
// KivaAd — top-level composition (v1.21: 32s, 10 scenes)
// CinematicWrapper provides gradient bg, noise, vignette, perspective, drift.
// AIGlow halo cycles between idle/active per scene.
// =====================================================================

// Music-bed default — now overridable via tweaks.enableMusicBed (Studio toggle)
const HAS_MUSIC_BED_DEFAULT = false;

// 12-frame crossfade overlap between scenes (morph transition per §3.7.4)
const CROSSFADE = 12;

// Per-scene AIGlow state (v1.21: 10 scenes).
// Scenes 1, 2, 10 = idle blue (overwhelm + brand moments).
// Scenes 3-9 = active purple (product world / AI features).
const SCENE_GLOW = [
  "idle",   // Scene 1  — Overwhelm
  "idle",   // Scene 2  — Reset + Logo→iPhone reveal (brand)
  "active", // Scene 3  — Dashboard reveal + mic zoom
  "active", // Scene 4  — Voice→Quote
  "active", // Scene 5  — Quote→Customer profile
  "active", // Scene 6  — Receipt→Expense
  "active", // Scene 7  — Map→Route
  "active", // Scene 8  — Pin→Follow-up
  "active", // Scene 9  — AI Business Assistant
  "idle",   // Scene 10 — Final hero shot (brand calm)
] as const;

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
    SCENES.scene9.from,
    SCENES.scene10.from,
  ];
  let idx = 0;
  for (let i = sceneStarts.length - 1; i >= 0; i--) {
    if (frame >= sceneStarts[i]) {
      idx = i;
      break;
    }
  }
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

// Music final-fade — last 0.5s of composition
const FINAL_FADE_START = TOTAL_FRAMES - 15;
const FINAL_FADE_END = TOTAL_FRAMES;

const SceneStack: React.FC = () => {
  const glow = useAiGlowState();
  const tweaks = React.useContext(TweaksContext);
  const hasMusicBed = tweaks.enableMusicBed ?? HAS_MUSIC_BED_DEFAULT;
  return (
    <>
      <AIGlow state={glow.state} changedAtFrame={glow.changedAtFrame} />

      <Sequence
        from={SCENES.scene1.from}
        durationInFrames={SCENES.scene1.duration + CROSSFADE}
        layout="none"
      >
        <Scene1Overwhelm />
      </Sequence>
      {/* Scene 1→2 crossfade extended to 20f (F220→F240) per user direction;
          fade-out into Scene 3 stays at the global 12f. */}
      <Sequence
        from={SCENES.scene2.from - 20}
        durationInFrames={SCENES.scene2.duration + 20 + CROSSFADE}
        layout="none"
      >
        <SceneCrossfade
          duration={SCENES.scene2.duration + 20 + CROSSFADE}
          fadeInFrames={20}
        >
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
        durationInFrames={SCENES.scene8.duration + CROSSFADE * 2}
        layout="none"
      >
        <SceneCrossfade duration={SCENES.scene8.duration + CROSSFADE * 2}>
          <Scene8HeroShot />
        </SceneCrossfade>
      </Sequence>
      <Sequence
        from={SCENES.scene9.from - CROSSFADE}
        durationInFrames={SCENES.scene9.duration + CROSSFADE * 2}
        layout="none"
      >
        <SceneCrossfade duration={SCENES.scene9.duration + CROSSFADE * 2}>
          <Scene9BusinessAssistant />
        </SceneCrossfade>
      </Sequence>
      <Sequence
        from={SCENES.scene10.from - CROSSFADE}
        durationInFrames={SCENES.scene10.duration + CROSSFADE}
        layout="none"
      >
        <SceneCrossfade duration={SCENES.scene10.duration + CROSSFADE}>
          <Scene10FinalHero />
        </SceneCrossfade>
      </Sequence>

      {/* Music bed (v1.18, 45s) — under 32s composition. Re-timed prompt
          gated on user approval (only open 🚦 PENDING APPROVAL). */}
      {hasMusicBed && (
        <Audio
          src={staticFile("sound/music/bed.mp3")}
          volume={(f) => {
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

const SceneCrossfade: React.FC<{
  duration: number;
  fadeInFrames?: number;
  fadeOutFrames?: number;
  children: React.ReactNode;
}> = ({ duration, fadeInFrames = CROSSFADE, fadeOutFrames = CROSSFADE, children }) => {
  const frame = useCurrentFrame();
  const fadeIn = Math.min(1, frame / fadeInFrames);
  const fadeOut = Math.min(1, (duration - frame) / fadeOutFrames);
  const opacity = Math.max(0, Math.min(fadeIn, fadeOut));
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

// v1.26: persistent top-right chevron REMOVED — Scene 2 logo now stays
// centered for the entire sequence (no glide, no park). Logo dissolves
// into the iPhone at center.

export const KivaAd: React.FC<Partial<KivaAdTweaks>> = (props) => {
  void INTER;
  // Merge provided props with defaults so the composition still renders
  // identically when no tweaks are passed (e.g. in CLI render before the
  // user touches the Studio sidebar).
  const tweaks: KivaAdTweaks = { ...DEFAULT_TWEAKS, ...props };
  return (
    <TweaksContext.Provider value={tweaks}>
      <AbsoluteFill style={{ background: "#000", fontFamily: INTER }}>
        <CinematicWrapper>
          <SceneStack />
        </CinematicWrapper>
      </AbsoluteFill>
    </TweaksContext.Provider>
  );
};
