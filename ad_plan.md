# Kiva — 30s SaaS Kinetic UI Showcase
**Ad plan · authored by Steve (Master SaaS Ad Designer) · for Norm (Master Programmer)**

> **Conversion goal:** This ad's job is to make a UK tradesperson stop scrolling, feel "this is my life," and click through to try Kiva. Every frame must serve that goal. If a creative choice doesn't measurably help conversion, cut it.

---

## 🚦 PENDING APPROVALS

> Anything that needs the **user's explicit go-ahead** lives here. Always shown at the very top of the doc. When this section reads "(none — all clear)", Norm can proceed with everything in ACTIVE DIRECTIVES without further user input. When this section has items, **Norm pauses on those specific items** until the user marks them ✅.

1. **🎼 Music prompt needs re-timing for new 27s runtime.** The §4.6.2 prompt was calibrated for a 45s ad with peaks at 0:04.6 / 0:19.6 / 0:36 / 0:40.6. With v1.20's 27-second runtime, those marker times no longer match. **Steve's proposed new peak times:** PEAK 1 at 0:04.5 (overwhelm climax — unchanged), HARD SILENCE 0:05.2–0:05.6 (unchanged), PEAK 2 at 0:11.0 (Voice→Quote money shot), PEAK 3 at 0:18.5 (Follow-up success), PEAK 4 at 0:25.0 (final hero reveal). Reply *"approve music re-timing"* and Steve rewrites the §4.6.2 prompt accordingly. Norm holds music generation until then. This is the only item gating the rest of the project.

---

## 📋 CHANGELOG

> Every revision logged here. Most recent on top. Norm — read this first to see what changed since your last build.

- **v1.20 · 2026-05-06** · **🪓 STOP ADDING — START CUTTING. User reframe: 27s, 5 hero moments, transformation storytelling.** User flagged that the plan was overstuffing and we were "going in circles." Direction: an Apple-style SaaS commercial is memorable because of 2–3 moments, not because it shows 10 features. **Major cuts and structural reset:** (1) Runtime **45s → 27s** = 810 frames. (2) Feature count reduced — **expense classification CUT**. Voice-to-customer reframed as a *transformation* (quote card morphs into customer profile, not a separate scene). AI Business Assistant added back as final feature. (3) **NEW motion vocabulary** locked in §3.7 — *sweeps / zooms / expands / holds* as the four primitives. Transformation-based storytelling: UI elements MORPH between features. (4) **CUT § feature-title flashes** (deprecated — text noise). (5) **CUT per-scene focus captions** (deprecated — replaced by ONE final tagline). (6) **NEW final tagline: *"Run smarter. Earn more."*** — replaces "Blue collar solutions to blue collar problems" in Scene 7 lockup (the old tagline is parked, can be revived if user wants). (7) **NEW 8-scene structure** in §5 master timeline. Scene specs in §6 will be rewritten per-scene in v1.21 follow-up — for now, §5 + the new structure preview is enough for Norm to plan Phase D refactors. **What's preserved:** §3.7 cinematic system (every scene still inherits 3D phone, gradient world, glow halo, glassmorphism, drift, magnetic motion, morph-not-cut philosophy). Atoms/molecules are unaffected. Audio infrastructure unchanged but cue density will drop.
- **v1.19 · 2026-05-06** · **🎯 Music prompt strengthened for timing accuracy.** User flagged: "did you make it compose to peak at the correct times?" Steve answered: yes (5 explicit markers in the prompt) but honestly noted that AI music generators don't guarantee exact-second timing (typically ±1–2s drift). Strengthened the music prompt in §4.6.2: lifted timing language from "Three-act structure with these timing markers" → "**CRITICAL TIMING REQUIREMENTS — TREAT AS HARD CONSTRAINTS, NOT SUGGESTIONS**". Restructured to put the 5 markers at the TOP of the prompt as primary instructions, with the narrative wrapping them as secondary context. Each marker now numbered (MARKER 1–5) with explicit duration and character. Approval still ✅ (the strengthened prompt is a refinement, not a new direction). **Fallback plan if music drifts:** Steve will shift ad timing to match the music's actual peaks (Option B — "the music drives the ad's timing, not vice versa," like film scoring). This gets queued as v1.20 if needed after Norm sends the music for review.
- **v1.18 · 2026-05-06** · **✅ Music bed prompt APPROVED.** §4.6.4 gate flipped to ✅. Norm is unblocked to extend `test.py` with `music_generation()` helper and run `generate_music_bed()` (single 45s generation, ~11,250 credits). After generation completes, Norm sends `bed.mp3` to user for listen against the §4.6.3 success checklist. If passes, drops at `Sound/music/bed.mp3` and flips `HAS_MUSIC_BED` in `KivaAd.tsx:21`. If fails (e.g. silence at 0:05.2 ignored, peaks not present, vocals leaked), user pings Steve — Steve revises prompt — Norm re-runs (max 2 retries before falling back to licensing). 🚦 PENDING APPROVALS cleared. **Every approval gate in the project is now ✅.**
- **v1.17 · 2026-05-06** · **🎼 Music bed pivot — generating via ElevenLabs Music API.** Replaces the Uppbeat/Epidemic licensing recommendation from v1.16. New **§4.6** added with locked music prompt structured as a 3-act narrative with explicit peak-second references (the user's instruction: *"tell it what second to peak etc"*). Cost: ~11,250 credits one-time. Music gate ⏸ AWAITING REVIEW — user listens to the prompt set in §4.6, then approves a single generation run. Norm extends `test.py` with `music_generation()` helper (template in §4.6.1). Once approved + generated, drops at `Sound/music/bed.mp3` and flag flips in `KivaAd.tsx:21`.
- **v1.16 · 2026-05-06** · **🎬 Pacing pass: more cuts, more text, simpler sound, music-bed locked.** User feedback: needed more transitions/cuts/refocusing, more on-screen text, simpler sound effects, and direct opinion on music bed. (1) **Cut/morph rule rewritten in §3.7.4** — morph for continuity within features, **hard-cut for emphasis** between distinct ideas. Norm gets editorial discretion to add cuts where they earn impact (white-flash, scene-title flashes, wake-the-eye moments). Pure morph was too purist. (2) **NEW feature-title flashes** on each Scene 2–6 opener — 2-word, hard-cut overlay (e.g. *"Voice → Customer"*, *"Voice → Quote"*, *"Snap → Categorised"*, *"Routes → Optimised"*, *"Follow-up → Sent"*). Helps muted viewers (most paid social views) read the feature. ~12 frames per flash; overlays scene-establish beat, no runtime added. Each scene spec updated with the flash. (3) **NEW sound mix density rule in §4** — max 2 simultaneous audio layers at any frame; per-character typing clicks DROPPED (replaced with single sustained "AI writing" texture per text block); per-line-item ticks DROPPED (replaced with one cascade whoosh); per-pin thuds DROPPED (one pulse synth per section). Hero hits preserved. Scene 1 audio table revised. Scenes 2/3/4/5/6 sound timelines simplified. (4) **Music bed opinion locked**: yes, get one. Uppbeat free tier acceptable for first cut, Epidemic Sound ($15/mo) recommended for paid distribution. PENDING APPROVALS music-bed entry now includes a specific Uppbeat search URL.
- **v1.15 · 2026-05-06** · **🔁 Three SFX durations bumped (0.3–0.4s → 0.5s) — Norm unblocked.** Norm reported P3 + P1 audio mix mostly complete. Three specific IDs blocked because their durations were below ElevenLabs' practical floor (~0.5s minimum for the model to produce a coherent waveform). Steve's fault for under-specifying. Bumped: `sparkle_match` 0.4 → 0.5s, `transition_sharp_impact` 0.4 → 0.5s, `transition_glitch_cut` 0.3 → 0.5s. Per the §4.5.4 cost-discipline rule, these are single-ID re-runs Norm executes immediately (~75 credits total — still within budget). Updated SFX_QUEUE in §4.5.1 and prompt-set table in §4.5.3 accordingly. Total project ElevenLabs spend after retries: ~6,035 credits (~6% of Creator monthly).
- **v1.14 · 2026-05-06** · **🎬 45s runtime + simplification rule + Scene 2 rewrite.** User decision: extend ad to 45s (1350 frames @ 30fps) and apply the **scene simplification rule** — open every scene already at the feature moment, skip the navigation. New master timeline (§5) reflects 45s with rebalanced per-scene durations. Scene 1 extended by 24 frames (8s total) for cinematic breathing room around morph. Scene 2 fully rewritten — opens on New Customer screen pre-opened, thumb taps record, words type beside mic in a `<GlassPlate>` ("Annie Yang" → "07700 900123" → "Notting Hill"), brief loading, form auto-fills. No FAB tap, no AI Assistant sheet, no nav. **Scenes 3–7 surgically rewritten** with the same rule: every scene opens at the feature moment, no app navigation. Audio reference tables retimed for new frame ranges. v1.11 visual identity + focus captions preserved with updated frame anchors. v1.13 cinematic system inheritance applies throughout.
- **v1.13 · 2026-05-06** · **🎥 CINEMATIC SYSTEM — major addition.** User flagged that the plan captured mechanics but missed the soul: **emotional arc, premium visual style, cinematic camera, motion philosophy.** New mega-section **§3.7 Cinematic system** locks four interlocking systems: (a) **3-act emotional arc** (Suffering → Resolution → Triumph) explicitly named, (b) **Visual style** — dark navy-to-black cinematic gradient backdrop, 3D floating iPhone (not flat), high-contrast lighting, soft AI blue/purple glow halo, glassmorphism on overlays, layered Z-depth, premium startup launch aesthetic, (c) **Camera language** — constant subtle drift, slow cinematic push-ins, perspective shifts, occasional orbit around device, shallow DoF, macro lens feel with subtle chromatic aberration, vignette/soft focus falloff at frame edges, (d) **Motion philosophy** — magnetic motion via custom cubic-bezier, **morph transitions instead of hard cuts** between scenes, liquid UI transformations, continuity-driven animation, breathing room rule (≤3 simultaneous moving things). Each scene now inherits this system. **Significant Norm impact:** existing `<Series>` scene structure shifts to overlapping `<Sequence>` so the iPhone stays continuous across scene boundaries; new `<GlassPlate>` and `<AIGlow>` components needed; KivaAd.tsx top-level wrapper now hosts the gradient, drift, and lighting. Existing atoms/molecules are unaffected — this layer wraps them.
- **v1.12 · 2026-05-06** · **✅ All v1.11 approvals flipped.** User confirmed "approve everything." (1) §4.5 P2 (5 per-scene atmospheric beds) — ✅ APPROVED. (2) §4.5 P3 (4 transition stings) — ✅ APPROVED. (3) Music bed creative direction — ✅ APPROVED; Steve recommends Uppbeat free tier with attribution OR Epidemic Sound ($15/mo) — user picks and drops file at `Sound/music/bed.mp3`. New Phase C directives C4 and C5 unblocked. Norm can now run `generate_all(priority_filter="P2")` and `generate_all(priority_filter="P3")` after completing P0+P1 batch. Each batch still requires sending mp3s to user for listen before moving on.
- **v1.11 · 2026-05-06** · **🎬 Three-pronged creative depth pass.** User flagged that visuals were repetitive, focus moments needed reinforcing words, and sound design needed more depth. (1) **NEW §3.6** — *Per-scene visual identity & focus captions*. Each scene gets a unique character (INTIMATE / PRECISE / TACTILE / SPATIAL / CONVERSATIONAL / TRIUMPHANT) so the ad doesn't feel like the same beat repeating. Plus a typed Focus Caption per scene reinforces what just happened (e.g. *"Voice → quote. 12 seconds."* under the £2,454.60 stamp). (2) **§4.5 expanded** with 9 new SFX prompts: 5 per-scene atmospheric beds (P2) replacing the shared `ai_hum_ambient` underbed for Scenes 2–6, and 4 transition stings (P3) for variety at scene boundaries. **Approval gate split** — original 10 prompts remain ✅ APPROVED; new 9 are ⏸ AWAITING REVIEW. (3) **Per-scene specs updated** — each Scene 2–7 now opens with a v1.11 identity/bed/caption header. (4) **Music bed decision parked** in 🚦 PENDING APPROVALS for user license choice.
- **v1.10 · 2026-05-06** · **Companion doc gets a Code Reference Index.** New §9 added to `kiva_components_for_norm.md` — gives Norm a structured "where to look in the real Kiva codebase" map: per-ad-scene → file, per-component-type → file, per-Kiva-feature → file. Plus 6 rules for how to use the index without falling into traps (read for grounding not importing, scan with grep, trust `theme/` over screens, etc.). Lets Norm peek at the actual implementation when an animation moment needs more grounding without spending time understanding the whole RN codebase. **Use:** when designing a feature zoom-in or interaction moment, glance at the relevant Kiva file to ground the JSX shape — then build the Remotion equivalent.
- **v1.9 · 2026-05-06** · **🧹 ACTIVE DIRECTIVES rewritten for clarity.** Directives had grown chronologically across 8 versions with ordering issues, contradictions, and stale items. Replaced with a phased structure: 🎯 NEXT ACTION beacon → Phase A (Foundation) → Phase B (Atoms/Molecules) → Phase C (Audio) → Phase D (Scenes). Within each phase, P0 → P1. Resolved 3 specific issues: (1) Pause-on-Scenes-2–7 directive removed (contradicted Scene 1 WIP-acceptable). (2) "Wait for v1.5 deepening" references removed — companion doc now provides equivalent detail at the component level, so per-frame deepening is no longer blocking. (3) Stale "iPhone frame style" open question removed (resolved in companion doc).
- **v1.8 · 2026-05-06** · **🆕 Companion doc — `kiva_components_for_norm.md` written.** Steve audited the real Kiva React Native codebase at `/Users/nolancarey/kiva/Frontend/` and produced a full mock-component spec for Norm: anatomy, tokens (verified-matching), translation rules (RN → Remotion web React), 6 canonical motion presets (POP_IN / SOFT_LAND / QUICK_TAP / FADE_RISE / PULSE_IN / STATUS_FLIP), phone-interaction language (`<Thumb>` component, sheet rise/dismiss physics, scroll behavior), and per-component specs for ~25 components grouped Atoms/Molecules/Organisms. Build order prioritized in §6 of that doc. **This is now the source of truth for "what each Kiva UI element looks like and how it animates."** `ad_plan.md` continues to own "which elements appear when in the timeline." Norm should read `kiva_components_for_norm.md` before any more scene implementation work — it directly resolves the v1.7 reference-PNG issue at the architectural level.
- **v1.7 · 2026-05-06** · **🚨 Implementation rule clarified: reference PNGs are NOT scene assets.** User flagged a Scene 5 render showing doubled UI (status bar, chips, pins) — Norm had been placing reference PNGs full-screen as backgrounds AND rendering UI components on top. New explicit rule added in **§3.5 — Reference image usage rule**. Affected scenes need refactor: any scene currently using a `/ReferenceImages/*.PNG` as a full-screen background must rebuild the UI from React components + design tokens. Scene 5 has a special-case allowance: a *cropped* map-only slice of IMG_2417 may be used as a background plate, but the iOS chrome, header, chips, pins, and bottom nav must all be rendered as components.
- **v1.6 · 2026-05-06** · **Scene 1 — "Feeling overwhelmed?" replaced with typing animation.** Per user request, the static fade-up is now a Linear/Notion-style typed reveal. White text-cursor appears at frame 120 (before last notification cards land), typing starts at frame 124, brief 2-frame pause between "Feeling" and "overwhelmed?", question mark gets a subtle scale-pulse on landing as emotional payoff. Cursor continues blinking through the freeze. Audio: soft `click.mp3` at 25% on every-other character (sparse rhythm so it reads as typing, not buzzing); final `?` click pitched +1 semitone at 40% vol. No frame-budget impact downstream — Scene 1 still ends at frame 216.
- **v1.5 · 2026-05-06** · **§4.5 SFX prompt set APPROVED by user.** Approval gate at §4.5.6 flipped to ✅. Norm is now unblocked to extend `test.py` and run `generate_all(priority_filter="P0")`. Also: new permanent **🚦 PENDING APPROVALS** section added at the very top of the doc — any future approval-required item gets pinned there so it's impossible to miss. When empty, reads "(none — all clear)."
- **v1.4 · 2026-05-06** · **ElevenLabs sound generation pipeline locked.** New **§4.5** added: full sound-design plan for the 10 atmospheric/SFX layers we need beyond the 6-file library. Each sound has a locked prompt, locked duration, locked volume target, locked usage frame, and priority tier. Python helper extension for `test.py` provided as code template. **Cost discipline:** prompts are locked one-shot — no exploratory iteration. Total expected cost under 5% of an ElevenLabs Creator monthly allowance even with one retry budget per sound. Norm does NOT generate until Steve marks each prompt approved (gate at the bottom of §4.5).
- **v1.3 · 2026-05-06** · **Attention retention pass + creative north star locked.** (1) New **§2.5 Creative North Star** section — Linear motion polish + Jobber tradesperson voice + Notion AI feature clarity. (2) **Scene 1**: 18-frame hero-card hold (frames 24–42) before stack starts, lets viewer read "u still coming tomorrow?" and builds curiosity. Cascade intervals tightened to recoup the time. New per-card timings + ding frames in revised audio table. (3) **Scene 3**: 4-frame pure-white flash at frames 422–426 right before the £2,454.60 stamp — pattern interrupt to wake the eye on the money shot. (4) **Scene 5**: camera direction inverted — open wide on all of London with pins already placed, then punch-zoom in. Spatial pattern interrupt. (5) **Scene 7**: Mrs. Patel callback added — original notification card returns with status "Quote accepted ✓ • see you Saturday" at frame 870. Closes the loop opened in Scene 1. (6) **Scene 7**: social proof added under URL — "Used by 1,247+ UK tradespeople."
- **v1.2 · 2026-05-06** · **Scene 1 motion + audio sync revision.** (1) Notification cards bumped ~40% larger (sizes specced per card type). (2) Cluster geometry tightened to a central 900×500 elliptical zone at (960, 540) — cards now stack toward center instead of fanning to edges. (3) Per-card landing positions specified explicitly. (4) Sound-to-visual sync rule introduced: every ding fires 2 frames BEFORE its card's settle frame (sound = impact, not launch). All Scene 1 ding timings retimed accordingly.
- **v1.1 · 2026-05-06** · Added CHANGELOG + ACTIVE DIRECTIVES sections at top of file to formalize the Steve→Norm communication channel. No creative changes.
- **v1.0 · 2026-05-06** · Initial plan. 7 scenes, 30 s, Option A timing (7.2 s hook). Trade-specific notification copy locked. Tagline locked: *"Blue collar solutions to blue collar problems."*

---

## 🚧 ACTIVE DIRECTIVES FOR NORM

> **Read top-to-bottom in this exact order.** Phase A finishes → Phase B → Phase C → Phase D. Within each phase, P0 first, then P1.
>
> If you've already completed any item below, just acknowledge and skip — confirm progress with the user when you check in.

### 🎯 NEXT ACTION (do this BEFORE anything else)

**Read `kiva_components_for_norm.md` end-to-end.** It is now the architectural source-of-truth — defines the 6 motion presets, the `<Thumb>` interaction primitive, sheet rise/dismiss physics, and faithful anatomy for ~25 components sourced from the real Kiva codebase. Once you've read it, you'll have a build manual for everything in Phase B and the atoms-first build order in §6 of that doc.

---

### Phase A — Foundation

| ID | Priority | Task |
|---|---|---|
| A1 | P0 | Scaffold project skeleton: `Root.tsx` registers a single composition `KivaAd` at 1920×1080 / 30 fps / 900 frames. ⚠️ **v1.13 update:** top-level `KivaAd.tsx` no longer uses `<Series>` for scene sequencing — use overlapping `<Sequence>` blocks so the iPhone persists across scene boundaries (morph transitions, not cuts). Screen-content layer cross-fades; phone itself stays continuous. |
| A2 | P0 | Build `src/tokens.ts` from §3 (verified to match real Kiva `theme/colors.js`). |
| A3 | P0 | Load Inter font via `@remotion/google-fonts/Inter` — see `kiva_components_for_norm.md` §1. |
| A4 | P0 | Build `<PhoneFrame>` — iPhone 15 chrome, logical canvas 393×852 pt, scalable via prop. ⚠️ **v1.13 update:** PhoneFrame now renders inside a 3D-perspective parent (`transform: perspective(1500px)`); supports props for `rotateY`, `rotateX`, `translateY`, `translateX` to drive the constant drift + scene-specific perspective shifts. Inner display has soft `box-shadow` glow bleed. |
| **A5** | **P0 (v1.13)** | **Build the cinematic environment wrapper in `KivaAd.tsx`.** Per §3.7.2: navy→black gradient bg, animated noise overlay, vignette, AI glow halo (blue/purple, intensifies during AI moments via prop). Camera drift baseline (sine-wave translates + rotation). Layered Z-depth via `transform-style: preserve-3d`. **All scenes render INSIDE this wrapper.** |
| **A6** | **P0 (v1.13)** | **Build `<GlassPlate>` component** for glassmorphism overlays (notification cards, focus captions, Mrs. Patel callback, any element floating outside the phone). CSS: `backdrop-filter: blur(20px) saturate(140%)`, `bg: rgba(255,255,255,0.06)`, `border: 1px solid rgba(255,255,255,0.12)`, `box-shadow: 0 8px 32px rgba(0,0,0,0.4)`. |
| **A7** | **P0 (v1.13)** | **Build `<AIGlow>` component** — soft blue/purple halo behind the phone. Two states (props): `idle` (blue 35% opacity, ~80px blur) and `active` (purple 40% opacity, ~120px blur). Crossfades between states over 12 frames via `interpolate`. |

---

### Phase B — Atoms & molecules

> Build in the order listed in `kiva_components_for_norm.md` §6 (steps 4–14). Don't skip ahead to scenes — every scene composes these. Use the 6 motion presets from §3 of that doc as your animation vocabulary.

| ID | Priority | Task |
|---|---|---|
| B1 | P0 | **Atoms:** `<StatusBar>`, `<BottomNav>`, `<KivaLogo>` (use SVG asset directly), `<AIBadge>`, `<StatusBadge>` (7 variants), `<SendMethodPill>`, `<Button>` (4 variants), `<FAB>`, `<MicButton>` (with `PULSE_IN` rings), `<SparkleLoader>` (8-petal rotating), `<ProgressBar>` (two-stage), `<NotificationCard>` (8 chrome variants for Scene 1) |
| B2 | P0 | **Interaction primitive:** `<Thumb>` with travel-in / tap-compress / ripple / exit per `kiva_components_for_norm.md` §4.1 |
| B3 | P0 | **Molecules:** `<FormField>`, `<LineItemRow>`, `<TotalsRow>`, `<AssistantOptionRow>` (5 row variants with colored icon backgrounds), `<RecentActivityRow>`, `<StatCard>`, `<CustomerChip>`, `<MapPin>` (3 variants), `<ToastBanner>` |
| B4 | P0 | **Sheet primitive:** `<SheetContainer>` with rise/dismiss physics per `kiva_components_for_norm.md` §4.4 (translateY + backdrop fade, `SOFT_LAND` preset) |

---

### Phase C — Audio pipeline (P0+P1 ✅ APPROVED · P2+P3 ⏸ AWAITING REVIEW)

| ID | Priority | Task | Gate |
|---|---|---|---|
| C1 | P0 | Extend `test.py` with the `sound_effects()` helper from §4.5.1 (code template provided). Test with one P0 sound (`phone_vibration_loop`) before any batch. | ✅ |
| C2 | P0 | Run `generate_all(priority_filter="P0")` — 5 sounds, ~2,150 credits. **STOP after this batch.** Send the 5 mp3s back through the user for listen before running P1. | ✅ |
| C-music | P1 | **HOLD on `generate_music_bed()`** — the §4.6 prompt is calibrated for 45s; with v1.20's 27s runtime the timing markers are wrong. Steve rewrites the prompt in v1.21 once user approves the new peak times in 🚦 PENDING APPROVALS. **Do NOT run music generation yet.** | ⏸ (gated on prompt re-timing) |
| C3 | P1 | After user listens to P0 and replies "P1 approved": run `generate_all(priority_filter="P1")` — 5 more, ~480 credits. | ✅ |
| **C4** | **P2 (v1.11)** | **5 per-scene atmospheric beds.** Run `generate_all(priority_filter="P2")` — 5 sounds, ~3,200 credits. **STOP after batch — send the 5 mp3s to user for listen before running P3.** | ✅ |
| **C5** | **P3 (v1.11)** | **4 transition stings between scenes.** After user listens to P2 and replies "P3 approved": run `generate_all(priority_filter="P3")` — 4 sounds, ~180 credits. | ✅ (gated on user listen of C4) |
| C6 | — | **If any single SFX comes back unusable, flag the `id` to the user — do NOT modify the prompt yourself.** Steve revises → re-run only that ID. | — |
| **C7** | **P1 (v1.12)** | **Wire a music-bed hook in `KivaAd.tsx`.** Add a single `<Audio src={staticFile('Sound/music/bed.mp3')} volume={0.4} />` element gated on `staticFile` existence — if the file doesn't exist yet, render nothing (no error). Once the user drops the licensed track at that path, the music bed will activate automatically. Volume note: bed sits at -20 to -16 dBFS so SFX punch through cleanly. | — |

---

### Phase D — Scene composition (v1.20 — ad is now 27s with 5 hero moments)

> 🚨 **v1.20 STRUCTURAL RESET — read carefully.**
>
> The ad is now **27 seconds = 810 frames**. The scene structure is in §5. Existing v1.14 per-scene specs in §6 are OUT OF DATE — they will be rewritten in v1.21. For now, work from §5's high-level structure and the four motion primitives in §3.7.3.5 (sweep / zoom / expand / hold).
>
> **What you DON'T need to build anymore:**
> - Expense classification scene (CUT)
> - Per-scene focus captions (DEPRECATED §3.6.2)
> - Per-scene feature-title flashes (DEPRECATED §3.6.4)
>
> **What you DO need to build:**
> - 5 hero moments per §5 (Voice→Quote · Quote→Customer transformation · Route map · Follow-up · Final hero shot)
> - Each hero ends with a HOLD of ≥18 frames (§3.7.3.5 locked rule)
> - Transformation storytelling: instead of cuts between scenes, UI ELEMENTS EXPAND from one feature into the next (e.g. quote card grows into customer profile)
> - Final tagline at Scene 8: ***"Run smarter. Earn more."*** (replaces "Blue collar solutions to blue collar problems" — old tagline parked)
>
> **What still applies (don't rebuild):**
> - §3.7 cinematic system (3D phone, gradient world, AI glow, glassmorphism, drift, magnetic motion)
> - All atoms + molecules from `kiva_components_for_norm.md` §5.1–5.3
> - `<CinematicWrapper>`, `<AIGlow>`, `<GlassPlate>`, `<PhoneFrame>` from §5.0
> - Music bed prompt + helper at §4.6 (still ✅ approved — generate when ready)
> - Sound design library §4 (cue density will drop in v1.21 scene rewrites)
>
> **Action for you right now:** (1) Update `Root.tsx` to `durationInFrames=810`. (2) Update `KivaAd.tsx` `<Sequence>` ranges to the 8-scene timeline in §5. (3) Audit your existing scene work: most of Scene 1 (overwhelm) carries forward unchanged; Scene 2 (logo→iPhone) needs slowdown + dramatic lighting sweep + slow camera push; Scenes 3–7 will be rewritten in v1.21 (HOLD off on detailed scene composition until v1.21 lands). Scene 8 (final hero shot) is new and needs the new tagline. (4) Continue music generation (`generate_music_bed()`) — still ✅ approved, **but the music prompt timing markers will need to be re-prompted for the new 27s runtime in v1.21.** Don't run music yet — see ACTIVE DIRECTIVES update below.

| Scene | Frames | Status | v1.14 special rules |
|---|---|---|---|
| 1 — Notification overwhelm | 0–240 (8s) | WIP-acceptable | Extended by 24f for cinematic morph. Existing typing + cluster timing UNCHANGED. New: morph beat F198–F240 has cinematic 3D iPhone settle into resting tilt with AI glow halo onset. |
| 2 — Voice-to-Customer | 240–420 (6s) | **REWRITTEN v1.14** | **Open ON the New Customer screen** — no FAB tap, no AI Assistant sheet. Words type beside mic in `<GlassPlate>`: Annie Yang → 07700 900123 → Notting Hill. Brief loading. Form auto-fills. |
| 3 — Voice-to-Quote (HERO) | 420–660 (8s) | **REWRITTEN v1.14** | Open at active mic (no Quick Start chips, no customer picker). Voice text → transcribe → generate → quote. **MUST include v1.3 white-flash at F582–F588 with mandatory audio cut.** £2,454.60 stamp at F588 = `impact2.mp3` 100% — money shot. |
| 4 — Expense Classification | 660–810 (5s) | **REWRITTEN v1.14** | Open mid-scan (no FAB, no photo capture). Scan sweep, fields fill, category locks bouncily. |
| 5 — Route Optimization | 810–975 (5.5s) | **REWRITTEN v1.14** | v1.3 inverted camera (wide → punch-zoom). v1.7 PNG fix: cropped map plate only, all chrome as components. |
| 6 — Follow-up | 975–1170 (6.5s) | **REWRITTEN v1.14** | **DROPPED the AI Assistant sheet half** — Scene 6 is now 100% the follow-up flow. Three-beat focus caption: *"Wrote it. Sent it. Won the job."* — emotional climax. |
| 7 — Logo + CTA | 1170–1350 (6s) | **REWRITTEN v1.14** | Mrs. Patel callback at F1290 in a `<GlassPlate>` ("Quote accepted ✓ • see you Saturday"). Social proof under URL. Tagline now types in (consistent with typing language). |

---

### Open questions for Norm to flag back through the user

- Remotion cascade performance for Scene 1 (12 notification cards landing across frames 24–124, with intervals as tight as 6 frames apart). Confirm no dropped frames at render time. If issues, ping back.

---

## 1. Engineering constraints

| Spec | Value |
|---|---|
| Render target | 1920 × 1080 (16:9) |
| Frame rate | 30 fps |
| Total duration | **27.0 s = 810 frames** (locked v1.20) |
| Stack | Remotion 4 · React 19 · TypeScript |
| Project root | `/Users/nolancarey/Desktop/KivaADS/remotion/` |
| Studio command | `npm start` (from `/remotion`) |
| Build command | `npm run build` |

**Norm — suggested file structure** (you own the final architecture, this is just a starting point):

```
remotion/src/
  Root.tsx                 ← register one composition: KivaAd, 810 frames
  KivaAd.tsx               ← top-level <Series> sequencing all 7 scenes
  scenes/
    Scene1_Overwhelm.tsx
    Scene2_VoiceCustomer.tsx
    Scene3_VoiceQuote.tsx
    Scene4_Expense.tsx
    Scene5_Route.tsx
    Scene6_FollowUpAssistant.tsx
    Scene7_Lockup.tsx
  components/
    PhoneFrame.tsx         ← reusable iPhone chrome (status bar, notch, home indicator)
    KivaLogo.tsx            ← derived from /ReferenceImages/logo.svg
    NotificationCard.tsx    ← variant prop: imessage | whatsapp | email | call | calendar | hmrc | google | stripe
    PulsingMic.tsx          ← matches design spec mic w/ concentric rings
    AIBadge.tsx, AIBanner.tsx, AISparkleLoader.tsx
    Button.tsx (primary | secondary | accent), StatusBadge.tsx
  tokens.ts                 ← export color tokens, type scale, spacing scale
  audio.ts                  ← sound cue helpers + paths
```

**Mobile UI rendering rule:** When a scene is "inside the phone," render the phone at logical 393×852 (iPhone 15) and CSS-transform-scale it to fit the 1920×1080 frame. This keeps the design-system pixel sizes (9px–13px text) exactly as specced — they'll appear larger on the rendered video by virtue of the frame-up scaling.

---

## 2. Audience & tone

- **Audience:** UK self-employed tradespeople — plumbers, electricians, HVAC, builders, locksmiths. Age 28–55. On their phone in the truck or on the couch at 9 PM.
- **Currency / locale:** £ GBP. UK addresses (Hammersmith, Notting Hill — see IMG_2417). VAT terminology. HMRC references.
- **Tone:** Authentic, time-saving, "the AI brain that runs your back office while you do the work." Premium-modern visuals over a working-class voice. **Never patronizing.**
- **Tagline (locked):** *"Blue collar solutions to blue collar problems."*

---

## 2.5 Creative north star

> Three brands. Each teaches us something different. **We synthesize, we don't copy.**

| Reference | What we steal | Where it shows up |
|---|---|---|
| **[Linear](https://linear.app/method)** | Cinematic motion polish — every easing curve intentional, every transition purposeful. Restraint over flash. | All scene transitions, the iPhone morph (Scene 1), the AI Assistant cascade (Scene 6). When in doubt: *what would Linear do here?* — usually the answer is *less.* |
| **[Jobber](https://getjobber.com)** | Warm, respectful tradesperson voice. Never patronizing. Never aspirational-tech-bro. Speaks to working people like equals. | All on-screen copy, the tagline, notification text, the social-proof line. **No jargon, no buzzwords, no "supercharge."** |
| **[Notion AI](https://www.notion.so/product/ai)** launches | Showing AI features so the magic feels obvious — not technical. The viewer should feel "oh I get it" within 1 second of an AI moment. | Scenes 2, 3, 4, 6 (every AI feature reveal). The purple sparkle, the staged progress bar, the auto-fill — all readable as magic in <1 sec. |

**What we DO NOT do:**
- Generic SaaS-bro motion graphics (gradient blobs, abstract data viz, faceless silhouettes)
- Aspirational tech-bro voice ("revolutionize your workflow", "10x your business")
- Patronizing trades clichés (no hard hats, no exaggerated cockney, no "mate")
- Dense technical UI shots that need explaining
- Logo splashes longer than 0.6s — viewers don't care about your logo, they care about themselves

**The vibe in one sentence:** *Premium-modern visuals carrying a working-class voice — like a Linear ad rewritten by someone who actually fixes boilers.*

---

## 3. Brand visual language (token reference)

> Source of truth: `/Users/nolancarey/Desktop/KivaADS/kiva_design_spec_v2-1.pdf`. These tokens MUST land in `tokens.ts` exactly.

```ts
// tokens.ts — color
export const COLOR = {
  navy:        '#0F172A',  // primary, brand auth, standard CTA
  blue:        '#3B82F6',  // FAB / AI action / map pin / link
  surfaceDark: '#1E293B',  // dashboard stat cards, logo container
  aiPurple:    '#6D28D9',  // THE AI SIGNAL — badges, sparkles, banners
  aiPurpleBg:  '#EDE9FE',  // AI banner / badge bg
  bg:          '#F8FAFC',  // app canvas
  surface:     '#FFFFFF',  // cards, inputs
  border:      '#E2E8F0',
  divider:     '#F1F5F9',
  textSec:     '#64748B',
  textTer:     '#94A3B8',
  paid:        '#22C55E',
  pending:     '#F59E0B',
  overdue:     '#EF4444',
  sent:        '#3B82F6',
  accepted:    '#15803D',
};
```

**Semantic motion rule:** Purple = AI is happening (sparkles, processing, generating). Navy = primary CTA / brand anchor. Blue = AI-triggered action / FAB / live state. **Don't mix these up in animation** — color is meaning here.

**Standard easing:**
- `easeOutCubic` for most landings
- Spring (Remotion `spring()` damping 12–15, mass 1) for bouncy entries (logo, status badges, totals)
- `easeInOutQuad` for camera moves
- Linear for scan lines and progress bars

**Standard durations:**
- Micro-tap / ripple: 150–200 ms
- Card slide-in: 280–350 ms
- Sheet rise: 380 ms
- Camera push-in: 600–900 ms
- Logo reveal: 450–600 ms

---

## 3.5 Reference image usage rule (locked v1.7)

> **The rule:** Files in `/ReferenceImages/*.PNG` are **design references for components to build**. They are **NOT** placed directly into a scene composition as full-screen assets. Every UI element — status bar, headers, chips, pins, buttons, bottom nav, customer rows, sheet chrome — must be **rebuilt from React components** using `tokens.ts`, the design spec PDF (§3 above), and the `<PhoneFrame>` primitive.

**Why:** A reference PNG already contains a fully-rendered UI. If Norm overlays his own components on top of it, every element appears doubled (status bar, chips, pins, etc. — see Scene 5 v1.6 render bug). The PNG is what we want the screen to *look like*, not what we *use* as the screen.

**Allowed exception — background plates only.** When a UI element is genuinely impractical to render (currently: the London Apple Maps tiles in Scene 5), Norm may use a **cropped slice of the reference PNG containing ONLY that element**, with the iOS chrome, headers, chips, nav, and any UI components stripped via crop or mask. Then render the UI on top. This is the only acceptable use of a reference image as render input.

**Per-scene reference policy:**

| Scene | Reference PNG(s) | Allowed in render? | Notes |
|---|---|---|---|
| 1 | (none) | n/a | All notification cards built from components |
| 2 | `IMG_2410`, `IMG_2409` | ❌ NO | Build dashboard, AI Assistant sheet, New Customer sheet, mic, fields all as components |
| 3 | `IMG_2418`, `IMG_2419`, `IMG_2420`, `IMG_2421` | ❌ NO | Build New Quote screen, transcribing/generating loaders, Quote Review with line items table, Send button all as components |
| 4 | `IMG_2422` | ❌ NO | Build New Expense sheet, "Use AI" toggle, receipt photo card, scanning button, category chips all as components. **The receipt photo *inside* the receipt-photo card slot is a legitimate image asset** — that's a photo of a receipt within the UI, not the UI chrome itself. Use a stock receipt photo (or a cropped slice of `IMG_2422`'s receipt sub-image). |
| 5 | `IMG_2417` | ⚠️ PARTIAL | **Allowed:** cropped map-only slice of IMG_2417 used as a static background plate (Apple Maps tiles of the Hammersmith / Notting Hill / Shepherd's Bush area). **Not allowed:** the full PNG including status bar, "Customers 3" header, search bar, customer chips row, list/map toggle, custom AY/NC/SC pins, Apple Maps credit, bottom nav. Build all of those from components. |
| 6 | `IMG_2410` | ❌ NO | Build AI Assistant sheet + dashboard + WhatsApp bubble exchange + status badge animations all as components |
| 7 | `logo.svg` | ✅ YES | The actual logo SVG is a real asset — use it directly. This is the only image asset of its kind. |

**Recovery procedure for any broken scene:**
1. Tear out any `<Img>` / `<Video>` / `<staticFile>` reference to a `/ReferenceImages/*.PNG` (except as listed above).
2. Replace with a composition of React components consuming `tokens.ts`.
3. Use the design spec PDF (§3 + §5 of the spec) for exact pixel values, padding, font sizes, and component anatomy.
4. Use the reference PNG **on a second monitor** as a visual target — but never inside the render.
5. Render preview, eyeball against the reference PNG side-by-side until they match.

**Heuristic for Norm:** If your render looks "perfect" within minutes of starting a scene, you're probably using the PNG as the asset and you've fallen into this trap. Building every element correctly takes real time — that's the work. The reference is the *target*, not the *shortcut*.

---

## 3.6 Per-scene visual identity & focus captions (locked v1.11)

> **Why this exists:** without per-scene identity, the ad reads as "same demo on repeat" — phone → sheet → form → done, six times. The fix is two systems working together: (a) every scene has its own visual character, (b) every scene has ONE typed caption that reinforces what the AI feature just did.

### 3.6.1 Visual identity per scene

Each scene's identity drives camera framing, color emphasis, transition style, and audio bed. **Norm: when composing each scene, sanity-check every motion against the scene's identity. If it doesn't fit, reconsider.**

| Scene | Identity | Camera vibe | Color emphasis | Rhythm |
|---|---|---|---|---|
| 1 — Overwhelm | **CHAOTIC** | locked, multi-card cluster | mixed/chaotic | escalating |
| 2 — Voice-to-Customer | **INTIMATE** | tight close-ups, soft transitions | warm purple-on-white | soft, breathing |
| 3 — Voice-to-Quote (HERO) | **PRECISE** | clean punch-zooms, surgical cuts | navy/blue, white-flash money shot | controlled, rising |
| 4 — Expense | **TACTILE** | hands-on, receipt physically dropped | green confirms, neutral white | crisp, methodical |
| 5 — Route Map | **SPATIAL** | the only "breathing wide" scene — wide-then-zoomed | gradient blue→purple route | cinematic, sweeping |
| 6 — Follow-up | **CONVERSATIONAL** | messages exchanging, dialog-paced | warm WhatsApp green, status flip blue→green | satisfying back-and-forth |
| 7 — Lockup | **TRIUMPHANT** | pull-back, sparkles converging | navy + AI purple sparkles | resolved, exhale |

### 3.6.2 Focus caption system *(DEPRECATED v1.20 — text noise; replaced by ONE final tagline)*

When the camera punch-zooms onto a hero element in Scenes 2–6, a **Focus Caption** types in beside it. Caption acts as quiet narration — clarifies what the AI just did. One caption per scene; never multiple. Avoid jargon. Speaks to the user as a respected adult tradesperson.

**Caption styling (locked):**
- Font: Inter_400Regular, 18 px
- Color: white at 90% opacity (or navy if the underlying bg is light)
- Position: 24 px gap from the focal element — typically below or to the right depending on composition
- Typing animation: 1 char per frame (consistent with Scene 1 "Feeling overwhelmed?" typing language)
- Hold: 0.6 s after typing completes
- Exit: 8-frame fade as camera pulls back to next beat
- Audio: soft `click.mp3` at **20% volume** on every-other character

**Locked captions per scene:**

| Scene | Anchor moment | Caption text | Typing window (frames) | Hold to |
|---|---|---|---|---|
| 2 | After form auto-fills | *"AI extracted in 0.4 seconds."* | F285–F310 (~25 frames typed) | F325 |
| 3 | Right after £2,454.60 stamp | *"Voice → quote. 12 seconds."* | F432–F454 (~22 frames) | F458 |
| 4 | After category chip locks in | *"Categorised automatically."* | F525–F549 (~24 frames) | F555 |
| 5 | After "47 min" stat lands | *"Saves 47 minutes today."* | F632–F654 (~22 frames) | F660 |
| 6 | After Sent → Accepted flips | *"Wrote it. Sent it. Won the job."* | F710–F740 (~30 frames) | F745 |
| 7 | n/a — the tagline IS the caption | *"Blue collar solutions to blue collar problems."* (existing) | per existing spec | per existing spec |

**Why these specific words:** every caption is short, plain English, and *says what the AI did* — not what it could do, not why it's amazing, not "supercharge your workflow." The Jobber-voice rule from §2.5. If a caption sounds like a SaaS-bro tagline, rewrite.

### 3.6.3 Anti-patterns

Don't:
- Add multiple captions per scene (one is the rule — clutter kills focus)
- Use captions to explain what the UI is showing (the UI shows itself; captions tell the *meaning*)
- Use sales language ("Save time!", "Boost productivity!") — that's not Jobber voice
- Animate captions into existence with anything other than the typing pattern (visual consistency with §6 Scene 1)

### 3.6.4 Feature-title flashes *(DEPRECATED v1.20 — text noise; the v1.20 hero structure makes labels unnecessary)*

> **Why this exists:** ~80% of paid social views are MUTED. Without text labeling each feature, muted viewers can't quickly read what's happening. Title flashes solve this without adding runtime — they overlay the existing scene-establish beat.

Each Scene 2–6 opens with a 12-frame **hard-cut overlay** displaying a short feature-name title flash. Hard-cut entry, fast type-in, brief hold, dissolve as scene content takes over.

**Locked title text (one per scene, 2–3 words each — no jargon, no SaaS-bro):**

| Scene | Title flash | Frame range (within scene) |
|---|---|---|
| 2 — Voice-to-Customer | **Voice → Customer** | F240–F252 (12f at scene open) |
| 3 — Voice-to-Quote | **Voice → Quote** | F420–F432 |
| 4 — Expense | **Snap → Categorised** | F660–F672 |
| 5 — Route | **Routes → Optimised** | F810–F822 |
| 6 — Follow-up | **Follow-up → Sent** | F975–F987 |

**Flash specifications:**
- **Entry:** hard cut from previous scene end (overrides the morph crossfade for these 12 frames specifically)
- **Position:** centered horizontally, ~30% from top of frame
- **Style:** Inter_700Bold ~52px, white at 95% opacity. Subtle navy `rgba(15,23,42,0.4)` rectangular plate behind the text (not full glassmorphism — solid plate for max readability), padding 16px, radius 6px
- **Animation:**
  - F0–F3 (3f): plate slides in from right, scale 1.05 → 1.0
  - F3–F8 (5f): text types in fast (1 char per frame, no per-char audio)
  - F8–F10 (2f): brief hold
  - F10–F12 (2f): dissolve out (opacity 1.0 → 0; plate scales 1.0 → 0.95)
- **Audio:** soft `swoosh.mp3` at 30% vol on entry (F0). No per-character ticks (per the v1.16 sound mix density rule). One discrete hit, that's it.
- **No persistent presence** — once the flash dissolves at F12, the scene continues normally with the cinematic environment fully restored.

**Why this works:** muted viewer reads the feature in 0.4 seconds before any animation begins. Sound viewer hears a quick swoosh and barely registers the overlay because the scene immediately takes over. Both audiences served.

**Anti-pattern:** do NOT add subtitle text under the title (e.g. *"Speak it. Save it."*) — that's clutter. Two-word title only. The viewer has the focus caption coming later for reinforcement.

---

## 3.7 Cinematic system (locked v1.13)

> **What this section is:** the SOUL of the ad. §3 covers tokens. §3.5 covers reference image use. §3.6 covers per-scene identity + focus captions. **§3.7 is the visual/emotional/camera/motion world the entire ad lives inside.** Every scene inherits from this — the per-scene specs in §6 add specifics on top of what §3.7 establishes.

### 3.7.1 Emotional arc — the 3-act spine

The 30-second ad is a story with three movements. **Every creative decision must serve the arc.**

| Act | Time | Frames | Emotional state | Audio character |
|---|---|---|---|---|
| **I — Suffering** | 0:00–0:07.2 | 0–216 | Stress · overwhelm · clutter · mental overload of running a blue-collar business alone | Sub-bass rumble, layered notification chaos, riser building, then HARD silence at the swoosh |
| **II — Resolution** | 0:07.2–0:26.8 | 216–804 | Calm intelligent automation · operational clarity · "the AI is doing the work for me" | Per-scene atmospheric beds (P2), warm sparse texture, gentle build of hope |
| **III — Triumph** | 0:26.8–0:30.0 | 804–900 | Magical · smooth · intelligent · relieving · resolved | `outro_drone.mp3` resolving in C major — the exhale |

**The narrative through-line:** *"You're drowning in admin → an AI brain takes over → you finally feel free."*

### 3.7.2 Visual style — the cinematic environment

The ad lives in a single visual world. **Norm: the KivaAd.tsx top-level wrapper IS this environment. Every scene is composed inside it.**

**Background — always present:**
- Cinematic gradient: `linear-gradient(135deg, #0F172A 0%, #000000 100%)` filling the full 1920×1080 frame.
- Subtle moving noise overlay (`rgba(255,255,255,0.015)` animated) — gives the gradient texture, prevents banding.
- Vignette: radial-gradient corners darken to `#000` at -8% lightness — focuses the eye toward the phone.

**The iPhone — the hero object:**
- **Always rendered in 3D.** Never flat. Floats at the center of the frame with subtle constant motion (drift + breath).
- **Resting tilt:** Y-rotate `-6°`, X-rotate `+3°`. The phone is angled toward the viewer like it's being shown to them.
- **Constant drift (always running):** sine-wave motion — `translateY ±3px` over 4s + `translateX ±2px` over 5s + `rotateY ±0.8°` over 6s. Different frequencies prevent obvious looping.
- **Lighting (simulated via shadows + highlights):** key light upper-left, warm temperature; rim light lower-right, cool temperature. Specular highlight on the rounded edge.
- **Inner glow:** the phone *display* is itself a light source — soft `box-shadow: 0 0 80px rgba(59,130,246,0.25)` outside the screen bounds (bleeds into the navy environment).

**AI signal glow:**
- Soft blue halo `rgba(59,130,246,0.35)` ambient around the phone at all times.
- During AI moments (mic active, sparkle loader spinning, generating quote), halo intensifies and shifts toward purple `rgba(109,40,217,0.40)`.
- Glow uses CSS `filter: blur(40px)` on a separate layer behind the phone.

**Glassmorphism (overlays in front of phone):**
- Notification cards (Scene 1), Focus Captions (§3.6), Mrs. Patel callback (Scene 7), and any UI overlay that "floats in front of" the phone use:
  - `background: rgba(255,255,255,0.06)`
  - `backdrop-filter: blur(20px) saturate(140%)`
  - `border: 1px solid rgba(255,255,255,0.12)` (subtle inner edge)
  - `box-shadow: 0 8px 32px rgba(0,0,0,0.4)` (depth shadow)
- **NOT for in-phone UI** — UI inside the phone screen renders with normal opaque tokens. Glass is for elements that exist OUTSIDE the phone.

**Layered depth (Z-axis):**
- Background gradient: `Z = -100` (visually farthest)
- Far ambient particles (Scene 7): `Z = -50`
- Phone: `Z = 0` (the anchor)
- Foreground UI overlays (focus captions, callbacks): `Z = +30` to `+50`
- Foreground particles + thumb: `Z = +80`
- Use CSS `transform-style: preserve-3d` on the parent + per-child `translateZ()` to make this real, not faked with scale.

**Aesthetic anchor:** This should feel like the launch film for a premium startup product — Linear, Arc Browser, or a 30-second iPhone keynote moment. **NOT** a generic SaaS feature demo.

### 3.7.3 Camera language — the camera is alive

The "camera" in Remotion is the viewport — we move it via transforming the parent container. **The camera is never static.**

| Camera move | When | How |
|---|---|---|
| **Constant subtle drift** | Always (baseline motion under everything else) | Sine-wave: `translateX ±4px / 6s`, `translateY ±2px / 5s`, `rotateZ ±0.3° / 8s`. Layered with phone drift to feel organic. |
| **Slow cinematic push-in** | When zooming on a feature (Scenes 2–6 anchor moments, the £2,454.60 reveal in 3, etc.) | `scale 1.0 → 1.4` over **45–60 frames** (1.5–2 sec). NEVER snap zoom. |
| **Dynamic perspective shift** | Scene transitions, between feature reveals | `rotateY` shifts ±5°, `rotateX` shifts ±3° over 30 frames as scene morphs. Camera "looks at" the phone from a new angle. |
| **Slight orbit around device** | Once or twice in the ad — Scene 5 (route reveal) is a candidate, Scene 7 (lockup) is another | `rotateY` 8–12° over 60+ frames. Reveals the phone's edge briefly. Use sparingly — too much makes the ad feel woozy. |
| **Shallow depth of field** | When camera focuses on a UI element | Apply `filter: blur(8px) brightness(0.7)` to background gradient + ambient particles. Foreground (phone + focused element) sharp. Easing: 12-frame ramp in/out. |
| **Macro lens chromatic aberration** | At peak zoom moments only (Scene 3 £2,454.60 stamp, Scene 6 status flip) | Subtle `text-shadow: 1px 0 rgba(239,68,68,0.3), -1px 0 rgba(59,130,246,0.3)` on the focused element for ~10 frames. Authentic real-lens texture. |
| **Vignette + soft focus falloff** | Always | Frame edges 8% darker (already in the environment); slight blur (1px) on outer 5% of frame. Eye is drawn to center. |

### 3.7.3.5 Motion vocabulary — the four primitives (locked v1.20)

> **The user reframe (v1.20):** stop showing screens, start directing attention. These four motion primitives are the verbs the ad speaks.

| Primitive | When to use | Variants |
|---|---|---|
| **SWEEP** | Reveal moments. The light/UI sweeps across a screen, exposing what was hidden underneath. | "cinematic light sweep" · "directional UI wipe" · "blue glow sweep reveal" |
| **ZOOM** | Direct attention. Camera pulls the viewer toward a specific element. Slow > fast. | "camera slowly zooms into active card" · "UI expands toward viewer" · "focus pull onto selected metric" |
| **EXPAND** | Transformation. One UI element becomes another via growth, not via swap. **This is the storytelling move that separates SaaS demos from premium ads.** | "selected card expands fullscreen" · "map grows outward from panel" · "waveform transforms into quote interface" · "quote card expands into customer profile" |
| **HOLD** | Let the moment land. After every hero beat, pause. The breathing room is what makes a moment "premium." | "hold final frame for 0.8 seconds" · "allow scene to breathe" · "pause after successful automation" |

**The HOLD rule (v1.20 lock):** every HERO moment in §5 (the 5 starred beats) ends with a HOLD of at least 18 frames (0.6s). No exceptions. This is the difference between *startup demo* and *Apple-style commercial*.

### 3.7.4 Motion philosophy — extends companion doc §3

In addition to the 6 motion presets in `kiva_components_for_norm.md` §3, these globally:

1. **Magnetic motion.** Replace standard `easeOutCubic` with cubic-bezier `(0.2, 0.0, 0.0, 1.0)` — elements approaching their target *accelerate slightly* near the end (like magnetism pulling them in). Use for any element moving to a target position.

2. **Morph for continuity, cut for emphasis (v1.16 revised — replaces "no hard cuts").** Between scenes inside a flow, the iPhone stays continuous and the screen *content* morphs (crossfade over 8–12 frames). **BUT** hard cuts are explicitly allowed and encouraged for emphasis moments — the white-flash in Scene 3, scene-title flashes (§3.6.4), wake-the-eye pattern interrupts. Norm gets editorial discretion: **morph if the moment is a continuous narrative beat; cut if it's a distinct idea pivot.** Pure morph was too purist — Apple/Linear ads mix morphs with cuts deliberately.

3. **Liquid UI transformations.** When one UI element becomes another (button → toast, sheet rises into form revealing fields), don't swap. Source element scales `1.0 → 0.95 → 1.0` while target element scales `1.05 → 1.0`, overlapping by 6 frames. Feels elastic, alive.

4. **Continuity-driven animation.** Every animated element has motion BEFORE entering frame and motion AFTER leaving frame. Nothing snaps in/out. Notification cards in Scene 1 already do this. Apply the rule to focus captions, the iPhone morph, the sparkle convergence.

5. **Breathing room rule.** No frame should have more than **3 simultaneously animated elements**. If a beat needs more than 3, stagger.

6. **Fast but readable pacing.** Kinetic ≠ frantic. After every burst of motion, allow 4–8 frames of relative calm so the eye can catch up.

### 3.7.5 Per-scene inheritance checklist

> Norm: when composing each scene, verify ALL of these apply. The cinematic system is global — scenes don't opt out.

- [ ] iPhone is rendered in 3D with resting tilt + constant drift
- [ ] Background is the navy→black gradient with vignette
- [ ] AI blue/purple glow halo present around phone, intensifying during AI moments
- [ ] Glassmorphism on any UI overlay outside the phone (notification cards, focus captions, callbacks)
- [ ] Layered Z-depth respected (background → particles → phone → overlays → particles)
- [ ] Camera has constant drift baseline running
- [ ] Scene-to-scene transition is a morph (cross-fade screen content), not a cut
- [ ] Motion uses magnetic easing, not standard ease-out
- [ ] Liquid transformations applied wherever one UI element becomes another
- [ ] No frame violates the breathing-room rule (max 3 simultaneous animated elements)

---

## 4. Sound design library

| File | Use |
|---|---|
| `Sound/click.mp3` | Button taps, thumb taps, UI clicks |
| `Sound/notication1.mp3` *(sic)* | Single notification ding (Scene 1 first ping, Scene 6 reply) |
| `Sound/notifcation2.mp3` *(sic)* | Stacking dings (Scene 1 build) |
| `Sound/swoosh.mp3` | Sheet rise, scene wipes, send confirmations |
| `Sound/riser.mp3` | Tension build (Scene 1 0:03 → 0:05.2) |
| `Sound/impact2.mp3` | Big punctuation moments (logo land, total stamp) |

**Master mix:** Bus all SFX through a soft compressor — peaks at -6 dBFS, average around -14 dBFS. Music bed is being generated via ElevenLabs (see §4.6). Structure the SFX so they sit cleanly under the music bed once it lands.

**Sound mix density rule (locked v1.16):**

> **The problem v1.16 fixes:** the original Scene 1–6 specs had per-character typing clicks, per-line-item ticks, per-pin thuds, per-field-fill ticks. Stacked together they read as noise, not texture. **Cleaner mix = bigger impact on the hero hits.**

| Rule | What it means |
|---|---|
| **Max 2 simultaneous audio layers at any frame** | One bed (music or atmospheric) + one hit/texture. Three or more = mud. |
| **DROP per-character typing clicks** | Replace with **one** soft sustained "AI writing" texture per text block (a single low-volume filtered noise loop, ~6 frames, fades in/out with the typing). Applies to: Scene 1 "Feeling overwhelmed?" typing, all Focus Captions in Scenes 2–6, the Scene 7 tagline typing. |
| **DROP per-line-item ticks** | Replace with **one** cascading whoosh per cascade. Scene 3's 6 line-item rows = one filtered swoosh during F518–F555, not 6 individual clicks. |
| **DROP per-pin thuds** | Replace with **one** pulse synth per pin section. Scene 5's 3 pins = one synth swell across F855–F870, not 3 individual thuds. |
| **DROP per-field-fill ticks** | Replace with **one** soft chime cluster covering the field-fill phase. Scene 2's 4 field fills = one chime at the END (after all fields land), not 4 individual ticks. |
| **KEEP hero hits unchanged** | F588 `impact2.mp3` money shot, F1218 logo land, F1093 status flip celebration, the F0 vibration loop, the F75 riser, the F156 swoosh + silence. These are the punctuation. |

**Norm:** when wiring scene audio, default to fewer layers. If you find yourself queueing 4+ `<Audio>` elements at the same frame, you're violating this rule — restructure. The music bed (§4.6) will replace ~70% of atmospheric layering once it lands.

---

## 4.5 Sound generation pipeline (ElevenLabs)

> **Status:** Prompts drafted, **awaiting Steve approval** (see gate at bottom). User has confirmed working ElevenLabs API key. Norm has `test.py` (currently TTS-only). This section gives Norm the helper extension + the locked prompt set.

### Why we generate (vs. licensing or library substitutes)

The 6 SFX in §4 cover **discrete UI hits** (clicks, dings, swooshes, riser, impact). They do NOT cover:
- **Atmospheric beds** — phone vibration, AI processing hums, outro drones (these run *under* the hits)
- **Cinematic rises and rolls** — counter-roll synth on the £2,454.60 stamp, sparkle convergences
- **Specific UI actions** — receipt scan sweep, route line flow

We could license these from Mixkit/Pixabay (free) — but the bespoke moments (counter-roll, route flow) need to be **timed exactly** to our motion. Generating with ElevenLabs lets us get duration and character right on the first request. Cost is negligible (see §4.5.4).

### 4.5.1 Python helper extension for `test.py`

> **Norm:** add this to `test.py` (or split into `sound_effects.py` if you prefer a separate utility). The `SFX_QUEUE` list is the source of truth — never edit it without Steve approval.

```python
import os
import requests
from dotenv import load_dotenv

load_dotenv()

ELEVENLABS_API_KEY = os.environ.get("ELEVENLABS_API_KEY", "")
BASE_URL = "https://api.elevenlabs.io/v1"
HEADERS = {"xi-api-key": ELEVENLABS_API_KEY, "Content-Type": "application/json"}


def sound_effects(prompt: str, duration_seconds: float, output_path: str,
                  prompt_influence: float = 0.45) -> requests.Response:
    """Generate a single sound effect via ElevenLabs Sound Generation API.

    Args:
        prompt: descriptive text of the sound (locked from SFX_QUEUE — do not paraphrase)
        duration_seconds: 0.5–22.0 seconds
        output_path: destination .mp3 path
        prompt_influence: 0.0–1.0 — higher = stricter prompt adherence.
            We default to 0.45 (slightly above ElevenLabs default of 0.3) because
            our prompts are precise and we want generation to follow them tightly.
    """
    url = f"{BASE_URL}/sound-generation"
    payload = {
        "text": prompt,
        "duration_seconds": duration_seconds,
        "prompt_influence": prompt_influence,
    }
    response = requests.post(url, headers=HEADERS, json=payload)
    print(f"[{output_path}] status: {response.status_code}")
    if response.ok:
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        with open(output_path, "wb") as f:
            f.write(response.content)
        print(f"  ✓ saved {len(response.content)} bytes")
    else:
        print(f"  ✗ {response.text}")
    return response


# SFX_QUEUE — locked source of truth. See §4.5.3 for the rationale of every entry.
# DO NOT edit prompt/duration/priority without Steve approval.
SFX_QUEUE = [
    # ── P0: Atmospheric foundation (5) ──
    {"id": "phone_vibration_loop", "prompt": "Subtle low-frequency phone vibration buzz with soft mechanical motor rumble, as if a phone is face-down on a wooden truck dashboard. Constant rhythmic tremor, no melody, no music, designed to loop seamlessly with no audible start or end.", "duration": 6.0, "priority": "P0"},
    {"id": "counter_roll_money", "prompt": "Cinematic synth tone rising in pitch over 1.2 seconds like a slot-machine total settling, ending with a confident metallic chink and warm bloom. Modern analog synth, clean, premium SaaS, peaks decisively at the end. No music, no melody, single sustained tonal sweep.", "duration": 1.5, "priority": "P0"},
    {"id": "achievement_chime", "prompt": "Bright cheerful UI achievement chime, three quick ascending notes resolving on a major chord, like a successful task completion in a premium SaaS app. Modern, polished, glassy, not retro game-like, no reverb tail.", "duration": 1.0, "priority": "P0"},
    {"id": "ai_hum_ambient", "prompt": "Soft warm ambient hum with subtle high-frequency shimmer and barely perceptible synth pads, evoking futuristic AI processing in the background. Steady, no melody, no rhythm, calming but with quiet intelligence. Designed to loop seamlessly under voiceover.", "duration": 8.0, "priority": "P0"},
    {"id": "outro_drone", "prompt": "Ambient cinematic drone in C major, building from low warm sub-bass to bright open high frequencies over 4 seconds. Hopeful, premium, end-of-journey feel. No melody, single sustained chord opening up.", "duration": 5.0, "priority": "P0"},

    # ── P1: Bespoke UI moments (5) ──
    {"id": "iphone_morph_whirr", "prompt": "Soft mechanical whirr followed by a subtle thunk, like the home button mechanism of an iPhone or a precision camera shutter closing. Premium, brief, organic-mechanical, no music.", "duration": 0.6, "priority": "P1"},
    {"id": "scan_sweep", "prompt": "Smooth electronic scan sweep, low to high frequency over 0.8 seconds, like a receipt being scanned by a modern AI app. Subtle reverb tail, no harsh frequencies, no clicks.", "duration": 1.0, "priority": "P1"},
    {"id": "sparkle_match", "prompt": "Quick bright sparkle chime, two cascading notes, like a magical UI element snapping into the correct slot. Light, satisfying, AI-coded, glassy texture, no reverb tail.", "duration": 0.5, "priority": "P1"},  # v1.15: bumped 0.4 → 0.5 (ElevenLabs minimum floor)
    {"id": "map_zoom_whoosh", "prompt": "Cinematic camera zoom whoosh from wide to close, low filtered noise sweep with a subtle Doppler shift. Used in modern map applications. No music, no clicks, smooth tail.", "duration": 0.8, "priority": "P1"},
    {"id": "route_line_flow", "prompt": "Subtle flowing electronic energy travelling along a path, like data moving through a network line. Soft synthetic stream, faint UI texture, no harsh elements, no melody.", "duration": 1.0, "priority": "P1"},

    # ── P2: Per-scene atmospheric beds (v1.11 addition — replaces shared ai_hum_ambient as Scenes 2–6 underbed) ──
    {"id": "bed_intimate_warm", "prompt": "Warm intimate ambient bed with soft purple-tinted texture and barely audible synth pad. Personal, close, no melody, no rhythm. Designed to loop seamlessly under voiceover or close-up UI moments. Suggests a quiet moment of focus.", "duration": 6.0, "priority": "P2"},
    {"id": "bed_precise_tense", "prompt": "Tense ambient bed with subtle rising pulse and clean digital texture. Building anticipation. Suggests precision work or AI calculation. Loops seamlessly. No melody, no music, mid-range warmth.", "duration": 8.0, "priority": "P2"},
    {"id": "bed_tactile_clinical", "prompt": "Clean clinical ambient bed with subtle electronic scanning texture and gentle warmth, like a modern receipt scanner or a methodical app process. Loops seamlessly. No melody.", "duration": 6.0, "priority": "P2"},
    {"id": "bed_spatial_cinematic", "prompt": "Spacious cinematic ambient bed with airy reverb and subtle distant pulse. Suggests open geography and movement, like driving through a city. Loops seamlessly. No melody, just texture.", "duration": 6.0, "priority": "P2"},
    {"id": "bed_conversational_warm", "prompt": "Friendly warm ambient bed with subtle communicative texture, like soft connectivity between people. Suggests messages flowing back and forth. Loops seamlessly. No melody, no rhythm.", "duration": 6.0, "priority": "P2"},

    # ── P3: Transition stings between scenes (v1.11 addition — variety at scene boundaries) ──
    {"id": "transition_warm_whoosh", "prompt": "Warm filtered whoosh with subtle low-end thump, transitioning from intimate close-up to precise focus. No high frequencies, no harsh elements. Half a second total.", "duration": 0.5, "priority": "P3"},
    {"id": "transition_sharp_impact", "prompt": "Sharp clean impact with brief reverb tail, used as a scene transition between a precise quote moment and a tactile receipt-scanning scene. Premium, deliberate.", "duration": 0.5, "priority": "P3"},  # v1.15: bumped 0.4 → 0.5
    {"id": "transition_glitch_cut", "prompt": "Brief electronic glitch-cut transition with subtle digital texture, suggesting a switch in modality from list to map view. Modern, restrained, not chaotic. About half a second.", "duration": 0.5, "priority": "P3"},  # v1.15: bumped 0.3 → 0.5 (also adjusted prompt phrasing)
    {"id": "transition_soft_fade", "prompt": "Soft warm fade transition with gentle high-frequency shimmer, suggesting connection and conversation, used between a map scene and a follow-up message scene. Warm.", "duration": 0.6, "priority": "P3"},
]


def generate_all(priority_filter: str | None = None,
                 output_dir: str = "Sound/generated",
                 force: bool = False) -> None:
    """Idempotent batch generator — skips files that already exist unless force=True.

    Cost-safe usage:
        generate_all(priority_filter="P0")   # 5 sounds, ~1,200 credits
        # — preview results, listen, decide —
        generate_all(priority_filter="P1")   # 5 more, ~800 credits

    Total expected first-pass spend: ~2,000 credits (under 5% of Creator monthly).
    """
    for sfx in SFX_QUEUE:
        if priority_filter and sfx["priority"] != priority_filter:
            continue
        path = os.path.join(output_dir, f"{sfx['id']}.mp3")
        if os.path.exists(path) and not force:
            print(f"[{sfx['id']}] skip (exists)")
            continue
        sound_effects(sfx["prompt"], sfx["duration"], path)


if __name__ == "__main__":
    if not ELEVENLABS_API_KEY:
        raise SystemExit("Set ELEVENLABS_API_KEY first.")
    # generate_all(priority_filter="P0")  # uncomment ONLY after Steve approval
```

### 4.5.2 Output convention

| Convention | Value |
|---|---|
| Directory | `/Sound/generated/` (gitignored or committed — your call, Norm) |
| Filename | `<id>.mp3` exactly as in `SFX_QUEUE` |
| Format | MP3 (ElevenLabs default — works fine for Remotion `<Audio>`) |
| Sample rate / channels | Whatever ElevenLabs returns — Remotion handles it |
| Idempotency | `generate_all` skips existing files; safe to re-run |

### 4.5.3 Locked SFX prompt table

> **This is the source of truth.** Every sound in this table has been written to land in **one generation pass**. If a result doesn't match the intent, ping Steve through the user — do NOT iterate prompts yourself. We avoid prompt-fiddling because each iteration burns credits.

| # | ID | Used in scene(s) | Frame trigger(s) | Volume target | Loop or one-shot | Why generated (vs library substitute) |
|---|---|---|---|---|---|---|
| **P0** | | | | | | |
| 1 | `phone_vibration_loop` | Scene 1 | 0–156 (continuous) | -18 dBFS, ducks under text | Seamless loop, 6s | **Library doesn't have this** — most "vibration" SFX are buzzers, not the dashboard-rumble we need |
| 2 | `counter_roll_money` | Scene 3 | 408–426 (rolls into total stamp) | -10 dBFS peak | One-shot | **Critical timing** — must peak exactly at frame 426. Library samples won't sync without expensive editing |
| 3 | `achievement_chime` | Scenes 3, 5 | 444 (Scene 3 send), 624 (Scene 5 stat) | -10 dBFS | One-shot, 1.0s | Library has these but most read as "game-y" — we want premium SaaS character |
| 4 | `ai_hum_ambient` | Scenes 2, 3, 5, 6 | underlay during AI processing moments | -22 dBFS, ducks heavily | Seamless loop, 8s | Library generic ambient tracks are too musical — we need pure UI atmosphere |
| 5 | `outro_drone` | Scenes 6 (last 1s) → 7 | 780–900 | -16 to -12 dBFS, ramping | One-shot, 5s | Custom build — needs to resolve in C major to feel emotionally hopeful |
| **P1** | | | | | | |
| 6 | `iphone_morph_whirr` | Scene 1 | 200–212 (logo→phone morph) | -14 dBFS | One-shot, 0.6s | Bespoke — needs to feel mechanical-organic, not cartoonish |
| 7 | `scan_sweep` | Scene 4 | 474 (receipt scan starts) | -12 dBFS | One-shot, 1.0s | Library scan SFX usually have audible artifacts at the boundaries |
| 8 | `sparkle_match` | Scene 4 | 744 (category lock) | -10 dBFS | One-shot, 0.5s | Bespoke — needs to feel "AI just got it right" not "level up" · *v1.15: bumped from 0.4 to 0.5 — below ElevenLabs minimum floor* |
| 9 | `map_zoom_whoosh` | Scene 5 | 576 (punch-zoom) | -10 dBFS | One-shot, 0.8s | Library whooshes are too aggressive; we want filtered, controlled |
| 10 | `route_line_flow` | Scene 5 | 612 (line draws) | -14 dBFS | One-shot, 1.0s | Bespoke energy-along-path texture — no library equivalent |
| **P2 — Per-scene atmospheric beds (v1.11 addition · ⏸ AWAITING REVIEW)** | | | | | | |
| 11 | `bed_intimate_warm` | Scene 2 | 216–312 underbed | -22 dBFS | Seamless loop, 6s | Gives Scene 2 its INTIMATE identity — replaces shared hum |
| 12 | `bed_precise_tense` | Scene 3 | 312–462 underbed | -22 dBFS, ramps slightly with riser | Seamless loop, 8s | Builds tension into the £2,454.60 reveal |
| 13 | `bed_tactile_clinical` | Scene 4 | 462–558 underbed | -22 dBFS | Seamless loop, 6s | Clinical receipt-scan character |
| 14 | `bed_spatial_cinematic` | Scene 5 | 558–654 underbed | -20 dBFS (more present, since Scene 5 is the cinematic exhale) | Seamless loop, 6s | Spacious geographic feel |
| 15 | `bed_conversational_warm` | Scene 6 | 654–804 underbed | -22 dBFS | Seamless loop, 6s | Warm dialog atmosphere |
| **P3 — Transition stings (v1.11 addition · ⏸ AWAITING REVIEW)** | | | | | | |
| 16 | `transition_warm_whoosh` | between 2→3 | F310–F315 | -10 dBFS | One-shot, 0.5s | Variety at boundary instead of generic swoosh |
| 17 | `transition_sharp_impact` | between 3→4 | F655–F660 | -8 dBFS | One-shot, 0.5s | Pattern interrupt for tactile shift · *v1.15: bumped from 0.4 to 0.5 — below ElevenLabs floor* |
| 18 | `transition_glitch_cut` | between 4→5 | F804–F810 | -10 dBFS | One-shot, 0.5s | Modal shift list→map signaled audibly · *v1.15: bumped from 0.3 to 0.5 — below ElevenLabs floor; prompt phrasing also adjusted* |
| 19 | `transition_soft_fade` | between 5→6 | F650–F656 | -12 dBFS | One-shot, 0.6s | Warm easing into conversation scene |

### 4.5.4 Cost analysis

ElevenLabs Sound Generation pricing (as of 2026): roughly **100 character credits per second of audio** generated.

| Pass | Sounds | Total seconds | Credits | % of Creator monthly (100k) |
|---|---|---|---|---|
| First-pass P0 | 5 | 21.5 s | ~2,150 | 2.15% |
| First-pass P1 | 5 | 4.8 s | ~480 | 0.48% |
| **First-pass P2 (v1.11 — beds)** | **5** | **32.0 s** | **~3,200** | **3.2%** |
| **First-pass P3 (v1.11 — stings)** | **4** | **1.8 s** | **~180** | **0.18%** |
| Total clean run (all 19) | 19 | 60.1 s | ~6,010 | **6.0%** |
| Worst case (1 retry per sound) | 38 | 120.2 s | ~12,020 | 12% |

**Key cost-discipline rules:**
1. **No exploratory prompts.** Every prompt in §4.5.3 has been written for one-shot generation. If a result is unusable, the user pings Steve — Steve revises the prompt — Norm re-runs ONLY that single ID (not the whole batch).
2. **Idempotent script.** `generate_all` skips files that already exist on disk. You cannot accidentally double-spend.
3. **Priority gating.** Always run P0 first, listen, then run P1 only if P0 quality is acceptable.
4. **No previews / no parameter sweeps.** Don't generate the same prompt with different `prompt_influence` values to "find a good one." Locked at 0.45.

### 4.5.5 Substitutions from existing library (NOT generated)

To keep the SFX count tight, the following originally-considered atmospheric layers will use the existing 6-file library with creative manipulation instead of being generated:

| Originally planned | Library substitute | Manipulation |
|---|---|---|
| Typing-dots tick (Scene 6) | `click.mp3` | Played at 30% vol, every 3 frames |
| Quote-accepted celebration pop (Scene 6) | `notification1.mp3` + `impact2.mp3` layered | Layer + 25% vol |
| Sparkle convergence (Scene 7) | `swoosh.mp3` reversed + pitched up | Norm: use Remotion `playbackRate` and `startFrom` reversal trick |
| Tagline gentle chime (Scene 7) | `notification1.mp3` | Pitched up +5 semitones, low-pass filtered |

### 4.5.6 ✅ APPROVAL GATE

| Batch | Status | Approved by | Date |
|---|---|---|---|
| P0 (5 sounds) | **✅ APPROVED** | User | 2026-05-06 |
| P1 (5 sounds) | **✅ APPROVED** | User | 2026-05-06 |
| **P2 (v1.11 — 5 per-scene beds)** | **✅ APPROVED** | User (relayed by Steve) | 2026-05-06 |
| **P3 (v1.11 — 4 transition stings)** | **✅ APPROVED** | User (relayed by Steve) | 2026-05-06 |

**Norm's behavior under split approvals:**
- Run `generate_all(priority_filter="P0")` — already approved.
- Run `generate_all(priority_filter="P1")` after sending P0 mp3s to user for listen and getting explicit "P1 approved" reply.
- **Do NOT run P2 or P3 generation yet.** User reviews the prompt set in §4.5.3 v1.11 additions; when they reply "approve P2" or "approve P3" or "approve both", Steve flips the corresponding gate to ✅ and Norm runs.
- Per the cost-discipline rule in §4.5.4: if any single prompt produces unusable output, flag the specific `id` to the user — Steve revises that one prompt — re-run that single ID. Do not re-run the whole batch.

---

## 4.6 Music bed generation (ElevenLabs Music API · v1.17)

> **Status:** Prompt drafted, **awaiting Steve approval gate flip after user review** (§4.6.4 below). Norm runs ONE generation when approved. **Cost: ~11,250 credits (~11% of Creator monthly) for a single 45s track.**

### 4.6.1 Python helper extension for `test.py`

> **Norm:** add this alongside the `sound_effects()` helper. Endpoint is ElevenLabs' Music Generation API (`/v1/music`). The single generation run produces the full 45-second track in one call.

```python
def music_generation(prompt: str, duration_seconds: float, output_path: str,
                     prompt_influence: float = 0.6) -> requests.Response:
    """Generate a music track via ElevenLabs Music API.

    Args:
        prompt: full structured prompt (see SFX_QUEUE for the locked music entry)
        duration_seconds: total length (45.0 for our ad)
        output_path: destination .mp3 path
        prompt_influence: 0.0–1.0. We default higher (0.6) than SFX (0.45) because
            the music prompt has structural timing markers we want the model to honor.
    """
    url = f"{BASE_URL}/music"  # endpoint name confirmed at runtime; check ElevenLabs docs
    payload = {
        "text": prompt,
        "duration_seconds": duration_seconds,
        "prompt_influence": prompt_influence,
    }
    response = requests.post(url, headers=HEADERS, json=payload)
    print(f"[{output_path}] music status: {response.status_code}")
    if response.ok:
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        with open(output_path, "wb") as f:
            f.write(response.content)
        print(f"  ✓ saved {len(response.content)} bytes")
    else:
        print(f"  ✗ {response.text}")
    return response


def generate_music_bed():
    """One-shot music bed generation. Idempotent — skips if file exists."""
    output_path = "Sound/music/bed.mp3"
    if os.path.exists(output_path):
        print("Music bed already exists — skipping.")
        return
    music_generation(MUSIC_PROMPT, duration_seconds=45.0, output_path=output_path)
```

> **Norm:** confirm the exact ElevenLabs Music API endpoint path (`/v1/music`, `/v1/music-generation`, etc.) against current docs at https://elevenlabs.io/docs before running. Adjust the helper accordingly. If the API doesn't accept structured time-stamp references in the prompt verbatim, the model still composes around the prose narrative — check the result against §4.6.3 expectations.

### 4.6.2 Locked music prompt (`MUSIC_PROMPT` constant)

> **The prompt below is a 3-act narrative with explicit per-second peak markers. Do not paraphrase — these timings are calibrated to specific frames in the ad.**

```python
MUSIC_PROMPT = """
A 45-second cinematic ambient instrumental for a premium SaaS product launch ad targeting UK tradespeople.

CRITICAL TIMING REQUIREMENTS — TREAT AS HARD CONSTRAINTS, NOT SUGGESTIONS:
The track has FIVE specific structural markers that must land at the times specified below. The musical composition must be reverse-engineered from these markers — the track exists to deliver these moments at these exact seconds.

MARKER 1 — TENSION PEAK at 0:04.6 (must be the most compressed, pressurised moment in the first 8 seconds)
MARKER 2 — HARD SILENCE from 0:05.2 to 0:05.6 (0.4 seconds of complete silence — non-negotiable structural break)
MARKER 3 — BASS SWELL + SYNTH PEAK at 0:19.6 (single brief moment punching through ambient flow, lasts ~0.5 seconds)
MARKER 4 — EMOTIONAL CHORD SWELL at 0:36 (warm string-pad swell, the "everything just worked" feeling)
MARKER 5 — BIGGEST MOMENT at 0:40.6 (bright major-chord lift, brand-reveal climax — the loudest, brightest, most resolved point in the entire track)

CONSTRAINTS:
NO VOCALS. NO LYRICS. NO AGGRESSIVE DRUMS. NO MELODY-DRIVEN HOOKS. NO TRACK-ENDING DRUM HITS.
Style: cinematic ambient, modern electronic, sub-bass + soft synth pads + subtle high-frequency shimmer. Restrained, intelligent, emotional. Inspired by Apple keynote launch film scores and Linear product launch soundtracks.

NARRATIVE WRAPPING THE FIVE MARKERS:

ACT 1 — SUFFERING (0:00 to 0:08): low sub-bass rumble enters at 0:00, barely-audible filtered noise evokes phone vibration on a truck dashboard. Tension slowly builds 0:00→0:04.6 with a riser climbing underneath. The riser hits MARKER 1 at 0:04.6 (peak compression). Then MARKER 2 — hard silence 0:05.2 to 0:05.6. Out of silence at 0:05.6, a single warm pad in C major emerges, glowing gently, sustaining through 0:08.

ACT 2 — RESOLUTION (0:08 to 0:32.5): sparse, intelligent ambient. Soft electronic textures, subtle high-frequency shimmer. Implied tempo ~80 BPM but no drums. Calm, warm, AI-coded. From 0:14 to 0:19.6 the mix gradually adds a second pad and soft sub-bass pulse, building toward MARKER 3 at 0:19.6 (the brief bass-swell + synth peak). After MARKER 3, returns to spacious ambient flow, gradually opening up. From 0:27 to 0:32.5 the texture opens further with more reverb, airy quality, and a subtle distant pulse suggesting geographic movement.

ACT 3 — TRIUMPH (0:32.5 to 0:45): warmer chord progression begins. Hopeful tone. MARKER 4 at 0:36 is the emotional swell. Sustained warmth with subtle build 0:36→0:40.6. MARKER 5 at 0:40.6 is THE BIGGEST MOMENT — bright major-chord lift, hopeful, resolved, the loudest and brightest point in the whole track. Sustains 0:40.6 to 0:42. Holds a hopeful C-major or F-major chord 0:42 to 0:44.5. Gentle fade-out 0:44.5 to 0:45. Track ends in complete silence at exactly 0:45.0.

DURATION: exactly 45 seconds. The track plays once and is not designed to loop.
"""
```

### 4.6.3 What success looks like

When listening to the generated track, verify:

- [ ] **Total duration is 44.5–45.0 seconds.** Anything shorter clips the ad; longer requires Norm to fade out manually.
- [ ] **Hard silence at 0:05.2–0:05.6.** This is the most distinctive structural marker — if the track ignores this, the prompt didn't take and we re-run with a stronger time emphasis.
- [ ] **Identifiable peaks at 0:04.6, 0:19.6, 0:36, 0:40.6.** Don't have to be perfect, but should be audibly distinct moments — a swell, a chord shift, a brightening.
- [ ] **No vocals, no melody hooks, no aggressive drums.** The model should compose entirely from pads, sub-bass, and ambient texture.
- [ ] **Emotional reading matches the act labels:** suffering at start, resolution in middle, triumphant at end.
- [ ] **Final 1.5 seconds fade to silence.** No abrupt cutoff.

### 4.6.4 Music approval gate

| Status | Approved by | Date |
|---|---|---|
| **✅ APPROVED** | User (relayed by Steve) | 2026-05-06 |

User reviews the prompt in §4.6.2 + the success criteria in §4.6.3. When ready, replies "approve music" — Steve flips this gate to ✅, Norm runs `generate_music_bed()` (single generation, ~11,250 credits). Norm sends the resulting `bed.mp3` back through the user for listen. If it passes the §4.6.3 checklist, drop it at `Sound/music/bed.mp3` and flip `HAS_MUSIC_BED` in `KivaAd.tsx:21`. If it fails, user pings Steve — Steve revises the prompt — Norm re-runs (single ID, no batch concept here — this is one track).

**Cost discipline note:** music generation is the most expensive single op in this project (~11,250 credits per try). **Maximum 2 retries** before pausing and re-thinking the prompt. If after 2 retries the track is still wrong, switch back to Uppbeat/Epidemic licensing as a fallback.

---

## 5. Master timeline (v1.20 — 27s, 5 hero moments)

| # | Scene | Time | Frames | Duration | What it is |
|---|---|---|---|---|---|
| 1 | **Overwhelm intro** | 0:00 – 0:06 | 0 – 180 | 6.0s | Hook (largely preserved from v1.6 — typing animation, cluster, swoosh) |
| 2 | **Logo → iPhone hero reveal** | 0:06 – 0:08 | 180 – 240 | 2.0s | Slow it down. Dramatic lighting sweep + slow camera push. THE hero reveal. |
| 3 | **Voice → Quote (HERO #1)** | 0:08 – 0:12 | 240 – 360 | 4.0s | Mic press → waveform reacts → speech appears → camera zooms into text → text restructures into quote → quote card EXPANDS beautifully → HOLD. |
| 4 | **Quote → Customer profile (transformation)** | 0:12 – 0:15 | 360 – 450 | 3.0s | Quote card EXPANDS into customer profile. Customer info auto-fills. Camera pans across profile. |
| 5 | **Route Optimization (HERO #2)** | 0:15 – 0:18 | 450 – 540 | 3.0s | Map expands fullscreen. Sweeping route lines. Dynamic zooms. Subtle map tilt/parallax. |
| 6 | **AI Follow-up (HERO #3)** | 0:18 – 0:21 | 540 – 630 | 3.0s | Message types itself. AI glow pulse. Auto-send. SENT → clean success state → HOLD. |
| 7 | **AI Business Assistant** | 0:21 – 0:24 | 630 – 720 | 3.0s | Dashboard expands. Camera zooms into stat cards. ONE hero metric only — no chart soup. |
| 8 | **Final Device Hero Shot** | 0:24 – 0:27 | 720 – 810 | 3.0s | Phone floating in cinematic space. Slow rotation. Soft reflections. Breathing room. **Tagline: *"Run smarter. Earn more."*** |

**Total:** 27.0 s = 810 frames @ 30 fps.

**Three structural changes you should know about:**
1. **Expense classification CUT.** Feature count reduced for breathing room.
2. **Voice-to-customer reframed as a TRANSFORMATION.** Instead of a separate scene with FAB taps and form filling, the quote card from Scene 3 EXPANDS into a customer profile in Scene 4. Same feature, told as a morph, not a switch.
3. **AI Business Assistant added** in Scene 7. ONE hero metric (no chart soup) — e.g. *"£12,847 generated this month"* or *"7 hours saved this week"*.

**The 5 hero moments to deliver:**
- **🎯 Hero 1** — Voice → Quote (Scene 3). The "oh wow" moment. Don't rush.
- **🎯 Hero 2** — Quote → Customer transformation (Scene 4). The morph IS the moment.
- **🎯 Hero 3** — Route map expand (Scene 5). Spatial feel.
- **🎯 Hero 4** — AI follow-up auto-write+send (Scene 6). Magical.
- **🎯 Hero 5** — Final device shot (Scene 8). The exhale + tagline.

**Cinematic system (§3.7) still applies to all scenes** — 3D floating iPhone, navy gradient world, AI glow halo, glassmorphism overlays, drift, magnetic motion. **Morph for continuity, hard-cut for emphasis** (§3.7.4 unchanged).

---

## 6. Scene-by-scene breakdown

### Scene 1 — Cold open: Notification overwhelm
**Time:** 0:00.0 – 0:08.0 (frames 0–240) · **v1.14: extended by 24 frames to give the cinematic morph room to breathe**
**Goal:** In 8 seconds, make the viewer feel the daily admin chaos of being a UK tradesperson, then promise relief.
**Setting:** Cinematic environment per §3.7 — navy→black gradient backdrop active from frame 0 (the existing `linear-gradient(135deg, #0F172A 0%, #1E293B 100%)` is overridden by the v1.13 environment which extends the dark gradient deeper toward black). No phone visible until morph at frame 198. Camera drift baseline is on. Vignette + AI glow halo are off until the iPhone appears.

**Beat-by-beat:**

| Range (s) | Frames | Action |
|---|---|---|
| 0:00.0–0:00.8 | 0–24 | **First ping.** Hero iMessage card (460×110 px) slides in from bottom-left toward the central cluster zone. Scale 0.6 → 1.18 (overshoot) → 1.15 (settle). **Lands at (900, 540), -3° rotation, settle frame 24.** Card content: blue iMessage chrome, sender *"Mrs. Patel"*, text *"u still coming tomorrow?"*. **Audio:** `notication1.mp3` at **frame 22** (= settle - 2 frames). Sub-bass phone-vibration loop starts at frame 0 (low rumble, -18 dBFS, continues through 156). |
| 0:00.8–0:01.4 | 24–42 | **Hero hold (18 frames).** Mrs. Patel card holds alone, centered, fully readable. No new motion. Subtle ambient breathing: the card itself drifts down 0.2 px/frame and pulses opacity 1.0 → 0.97 → 1.0 once (sells "this matters, read me"). Vibration rumble continues. **This is the curiosity hook** — the viewer reads "u still coming tomorrow?" and asks "what about it?" before chaos answers. |
| 0:01.4–0:02.7 | 42–82 | **Stack begins (4 cards, 10-frame intervals).** Cards cascade into the central 900×500 cluster zone, each with ~10-frame travel time:<br>**(a) F42→F52** — red missed-call banner (600×100) *"Missed call (3) — John (boiler)"* enters top-right edge, lands at **(1180, 400)**, -2° rotation. Ding `notifcation2.mp3` **frame 50**.<br>**(b) F52→F62** — WhatsApp green bubble (460×110) *"boiler still leaking mate"* enters from left, lands at **(740, 600)**, +3°. Ding `notication1.mp3` **frame 60**.<br>**(c) F62→F72** — email card (540×160) *"HMRC: VAT return due in 3 days"* enters bottom-right, lands at **(1100, 720)**, -1°. Ding `notifcation2.mp3` **frame 70**.<br>**(d) F72→F82** — calendar pop (460×120) *"Job at 8AM — Hammersmith"* enters top, lands at **(920, 380)**, +2°. Ding `notication1.mp3` (pitch +2 semitones) **frame 80**. |
| 0:02.7–0:04.0 | 82–120 | **Density build (7 cards, 6-frame intervals).** Rapid-fire into the same tight central cluster, each overlapping previous cards by 20–40%. Travel time per card shortens to ~8 frames:<br>• F82→F90: Stripe banner (480×120) *"Invoice #0421 overdue — 47 days"* lands **(1020, 480)**, +1°. Ding F88.<br>• F88→F96: Google review card (480×130) *"New 1-star review — respond?"* lands **(1180, 540)**, -2°. Ding F94.<br>• F94→F102: iMessage (460×110) *"can u do it cheaper?"* lands **(820, 700)**, +3°. Ding F100.<br>• F100→F108: Screwfix email (480×130) *"Your parts order has shipped"* lands **(980, 360)**, -1°. Ding F106.<br>• F106→F114: voicemail card (480×120) *"You have 4 new messages"* lands **(760, 480)**, +2°. Ding F112.<br>• F112→F120: banking alert (480×120) *"Direct debit failed"* lands **(1140, 660)**, -3°. Ding F118.<br>• F118→F124: generic prompt (460×110) *"Quote follow-up?"* lands **(940, 580)**, +1°. Ding F122.<br>**Audio:** alternate `notication1.mp3` and `notifcation2.mp3` per card with ±2 semitone pitch shifts for chaos texture. `riser.mp3` starts at **frame 75**, building under everything through frame 156. By frame 124 the cluster is dense and centrally-stacked but the frame edges stay visually quieter — focus stays locked on the center pile. |
| 0:04.0–0:04.1 | 120–124 | **Cursor onset (v1.6).** A white text cursor (4 × 80 px block, white at 60% opacity) appears at frame center (960, 540 in 1920×1080) and begins blinking — 15 frames on, 15 frames off cycle. Last 2 notification cards (Banking F120, Quote follow-up F124) are still landing in the cluster behind the cursor. Cursor renders above all cards (z-top). Anticipation builds: viewer sees the cursor, knows something is about to be typed. |
| 0:04.1–0:04.8 | 124–144 | **Typing animation (v1.6 — replaces fade).** Text types in character-by-character at ~1 frame per char. Font: system bold, ~96 px, white at 95% opacity, anchored center.<br>• **F124–131**: "Feeling" types in (7 chars over 7 frames). Cursor moves with the leading edge of the text.<br>• **F131–133**: 2-frame pause — cursor blinks once, no new text. Builds suspense before the payoff word.<br>• **F133–144**: " overwhelmed?" types in (13 chars including the leading space, ~0.85 frames per char).<br>• **F144–148**: question mark scale-pulse (1.0 → 1.05 → 1.0 over 4 frames) — the "?" is the emotional payoff and gets the kinetic punch.<br>• Behind the text, all notification cards continue their slow "sediment drift" downward (1.5 px/frame, 8% opacity loss/frame). Cluster sinks; text rises through it. <br>• Camera begins a slow 1.0 → 1.04× scale push-in over the full 124–156 range.<br><br>**Typing audio (sparse, every-other character):** soft `click.mp3` at **25% volume** at frames **F125, F127, F129, F131** (during "Feeling") and **F134, F136, F138, F140, F142** (during "overwhelmed"). Final question-mark click at **F143** at **40% volume, +1 semitone pitch shift** for emphasis. Rhythm reads as typing, not buzzing. Cursor blink is silent. All typing audio sits *under* the existing `riser.mp3` build — riser is the dominant layer; typing is texture. |
| 0:04.8–0:05.2 | 148–156 | **Freeze with cursor blink.** Full text "Feeling overwhelmed?" sits center, fully visible. Cursor continues blinking after the "?" — the tail. All notification motion freezes mid-drift. Audio: dings audibly compress and lowpass (muffled, underwater); `riser.mp3` peaks; vibration deepens. The cursor blink is the only living motion in this beat. |
| 0:05.2–0:05.6 | 156–168 | **Swoosh wipe.** Hard horizontal swipe from left to right (1500 px/s) drags every element off-screen with a 4 px motion-blur trail. Background returns to clean navy gradient. Audio: `swoosh.mp3` at frame 156 then **CUT TO SILENCE** at frame 162. |
| 0:05.6–0:06.2 | 168–186 | **Logo reveal.** Kiva logo (from `/ReferenceImages/logo.svg`) appears center, scale 0.8 → 1.1 → 1.0 (spring damping 14). Subtle radial glow `rgba(59,130,246,0.45)` pulse 0.6→0.9→0.6 opacity over the duration. Audio: soft `impact2.mp3` at frame 168. |
| 0:06.2–0:06.6 | 186–198 | **Tagline pops in.** Below the logo (gap 28 px): *"Blue collar solutions to blue collar problems"* — system semibold, ~28 px, white at 80% opacity. Fade up + 4 px rise. |
| 0:06.6–0:08.0 | 198–240 | **Thumb tap → 3D iPhone morph (v1.14 extended).** A stylised thumb presses the logo at frame 198. Click ripple expands (`click.mp3` at F198). Logo Y-axis rotates 180° over frames 200–214 while morphing into a 3D iPhone — but now with **proper cinematic breathing room**:<br>• **F200–214 (14f):** Logo flips, screen revealing the iPhone 15 chrome materializing<br>• **F214–224 (10f):** iPhone settles into 3D perspective context — `rotateY` from 90° (edge-on from morph) eases to resting `-6°`, `rotateX` from 0° to `+3°`<br>• **F224–234 (10f):** AI glow halo (per §3.7.2) fades in around the phone — blue at 35% opacity, blur 80px<br>• **F234–240 (6f):** camera drift baseline fully establishes; constant motion now running. Phone screen content visible — **already showing the New Customer screen pre-loaded** (sets up Scene 2 simplification). Glassmorphism overlays will appear in subsequent scenes.<br>**Audio:** `click.mp3` at F198. `iphone_morph_whirr.mp3` (P1, generates after approval) at F200–212 — replaces the placeholder whirr. Soft AI hum begins ramping in at F224 as the glow appears.<br>**This is the morph from "headspace" to "product world."** From here onward, the cinematic environment is established and persists through Scene 7. |

**Scene 1 cluster geometry (v1.2):**

- **Cluster zone:** elliptical, **900 × 500 px**, centered at **(960, 540)** in the 1920×1080 frame. All notification cards land WITHIN this zone — peripheral edges of the frame stay visually quiet.
- **Card sizes (40% larger than v1.0):**
  - iMessage / WhatsApp bubble: **460 × 110 px**
  - Standard notification card: **480 × 120 px**
  - Email card (more body text): **540 × 160 px**
  - Missed-call banner (wider, shorter): **600 × 100 px**
  - Google review card: **480 × 130 px**
- **Rotation:** ±3° per card per the table above. Use deterministic per-card values (don't randomize at render — it'll change between previews).
- **Z-ordering:** later cards always render on top of earlier cards (z-index = entry order). The hero "Mrs. Patel" card stays partially visible underneath the pile until the freeze.
- **Cards-overlap target:** 20–40% overlap with at least one earlier card by the time the cluster is dense. This is the *visual point* of the scene.
- **Drift effect (during 0:04.0–0:05.2):** every card slow-drifts downward at **1.5 px/frame** with a per-frame opacity reduction of 0.5%. The pile sinks like sediment while "Feeling overwhelmed?" stays anchored.

**Master sound-sync rule for ALL ding moments in Scene 1:**

> Every notification ding fires at **`landFrame - 2`** — exactly 2 frames before the card visually settles. The sound IS the impact, not the launch. **Never schedule a ding when a card starts moving** — that's the most common motion-graphics audio mistake and it makes the whole sequence feel unsynced.

**Per-card audio reference table:**

| # | Card | Land frame | Ding frame | File | Pitch |
|---|---|---|---|---|---|
| 1 | Mrs. Patel iMessage (HERO) | 24 | 22 | `notication1.mp3` | 0 |
|  | *— 18-frame hero hold (frames 24–42), no new cards* |  |  |  |  |
| 2 | Missed call banner | 52 | 50 | `notifcation2.mp3` | 0 |
| 3 | WhatsApp boiler | 62 | 60 | `notication1.mp3` | 0 |
| 4 | HMRC email | 72 | 70 | `notifcation2.mp3` | 0 |
| 5 | Calendar pop | 82 | 80 | `notication1.mp3` | +2 |
| 6 | Stripe overdue | 90 | 88 | `notifcation2.mp3` | -1 |
| 7 | Google review | 96 | 94 | `notication1.mp3` | +1 |
| 8 | iMessage cheaper | 102 | 100 | `notifcation2.mp3` | +2 |
| 9 | Screwfix email | 108 | 106 | `notication1.mp3` | -2 |
| 10 | Voicemail | 114 | 112 | `notifcation2.mp3` | +1 |
| 11 | Banking alert | 120 | 118 | `notication1.mp3` | -1 |
| 12 | Quote follow-up | 124 | 122 | `notifcation2.mp3` | +2 |

The pitch shifts give the rapid-fire density a chaotic, varied texture instead of mechanical repetition.

**Norm's critical decisions:**
- Notification cards: build `<NotificationCard variant="..." sender="..." body="..." />` with 8 chrome variants. Pre-render each as a memoized SVG/JSX block so the cascade animation stays performant.
- iPhone morph: at this scale a flat 2D card flip with perspective will read as 3D enough — don't over-engineer with three.js unless it's free.
- Trade-specific copy is locked. Don't substitute generic placeholders.

---

### Scene 2 — AI Voice-to-Customer (v1.14 simplified)
**Time:** 0:08.0 – 0:14.0 (frames 240–420 · 6.0s · 180 frames)
**Feature shown:** AI voice-to-customer creation.
**Visual target (do not embed):** `IMG_2409.PNG` — New Customer voice modal. Build entirely as components per `kiva_components_for_norm.md` §5.
**Goal:** "Adding a customer takes a sentence, not a form."

> **🎬 v1.11 layer (identity + bed + caption):**
> **Identity:** **INTIMATE** — tight close-ups, soft transitions, warm purple-on-white. Personal moment of focus.
> **Audio bed:** `bed_intimate_warm.mp3` (loops, -22 dBFS underbed)
> **Focus caption:** *"AI extracted in 0.4 seconds."* — types in F390–F410, holds to F420. Position: glass plate floating to the right of the phone, gap 24 px. White at 90% opacity, Inter_400Regular 18 px.

> **🚨 v1.14 simplification rule:** Scene 2 opens with the iPhone **already showing the New Customer screen pre-loaded** (handed off from the morph at end of Scene 1). NO FAB tap, NO AI Assistant sheet, NO "New voice customer" row navigation. The viewer doesn't see how to GET to the feature — they see the feature itself.

**Beat-by-beat:**

| Range (s) | Frames | Action |
|---|---|---|
| 0:08.0–0:09.0 | 240–270 | **Establish.** iPhone in 3D resting tilt, drift baseline running, AI glow halo at idle (blue, 35%). Phone screen shows the **New Customer sheet pre-opened** — `<AIBadge>` "AI powered" topbar, "Use AI" purple toggle row ON, INCLUDE chips visible (Name, Phone, Email, Address, Contact method), centered `<MicButton>` at rest, "Tap to start recording" caption beneath. Camera does a slow cinematic push-in 1.0× → 1.08× over these 30 frames (per §3.7.3). |
| 0:09.0–0:10.0 | 270–300 | **Tap record.** Camera continues push-in toward the mic, now 1.08× → 1.18×. `<Thumb>` enters from bottom-right at F274, taps mic at **F282**. Ripple expands. Mic transitions from rest to active state — concentric blue rings begin pulsing (`PULSE_IN` preset). AI glow halo crossfades blue → purple (active state). Audio: `click.mp3` at F282, mic-activate blip (`notification1.mp3` pitched +4 semitones at 50% vol) at F284. |
| 0:10.0–0:12.0 | 300–360 | **Words type beside mic in glass plate (the hero moment).** A `<GlassPlate>` materializes to the right of the mic at F300 (fade up + slight scale 0.95→1.0). Purple sparkle "AI listening…" mini-loader sits at the top of the plate. Then the words type in character-by-character on the plate, with subtle purple glow per word as it lands:<br>• **F304–322 (18f):** *"Annie Yang"* types in (10 chars, ~1.8 frames per char)<br>• **F322–326 (4f pause):** brief breath beat, sparkle pulses<br>• **F326–344 (18f):** *"07700 900123"* types in (12 chars, ~1.5 frames per char)<br>• **F344–348 (4f pause):** breath beat<br>• **F348–360 (12f):** *"Notting Hill"* types in (12 chars, 1 frame per char)<br>**Audio:** soft `click.mp3` at 20% vol on every-other typing character (consistent typing language). The mic continues its pulsing rings throughout. |
| 0:12.0–0:13.0 | 360–390 | **Brief loading state.** Camera pulls back slightly (1.18× → 1.10×) as the glass plate fades. `<SparkleLoader>` 8-petal purple sparkle rotates clockwise center-screen on the phone. Heading types in: *"Transcribing your voice…"* + subtitle *"Turning audio into text."* Two-stage progress bar shows stage 1 fast-fill (frames 365–378) then stage 2 begin. **This is the v1.13 cinematic system at work — the loading is brief but cinematic, not a dead pause.** Audio: `ai_hum_ambient.mp3` (or per-scene bed `bed_intimate_warm.mp3` if generated) sustained underbed; soft progressive chime as stage 1 completes at F378. |
| 0:13.0–0:13.5 | 390–405 | **Form auto-fills.** Loader cross-fades into the New Customer form fields appearing below the mic. Each `<FormField>` fills:<br>• F390: NAME field flashes purple, "Annie Yang" appears, green tick at F392<br>• F394: PHONE field flashes purple, "07700 900123" appears, green tick at F396<br>• F398: ADDRESS field flashes purple, "Notting Hill, London" appears, green tick at F400<br>• F402: CONTACT METHOD pill auto-locks to "WhatsApp" (pill flips to navy bg with white text)<br>Cadence: 4 frames apart. Subtle `click.mp3` at 25% on each field-fill. |
| 0:13.5–0:14.0 | 405–420 | **Focus caption + transition.** As fields settle, the Focus Caption types in to the right of the phone in a `<GlassPlate>`: *"AI extracted in 0.4 seconds."* — F390 onset of caption typing (overlaps the field-fills slightly), full text by F410, holds to F420. Camera begins a perspective shift (rotateY drift toward the next scene's angle) preparing for the morph into Scene 3. |

**Scene 2 sound timeline:**
- F240 onward: `bed_intimate_warm.mp3` (or fallback `ai_hum_ambient.mp3`) underbed at -22 dBFS, loops
- F282: `click.mp3` (thumb tap on mic)
- F284: mic-activate blip (`notication1.mp3` pitched +4st, 50% vol)
- F304, F306, F308…F360: sparse `click.mp3` typing texture at 20% on every-other character of "Annie Yang" / "07700 900123" / "Notting Hill"
- F378: progressive chime (`notication1.mp3` pitched +5st, 35% vol — "stage 1 complete")
- F392, F396, F400: soft `click.mp3` at 25% on each field-fill
- F402: bouncy "match" chime (`sparkle_match.mp3` if P1 available, else `notication2.mp3` pitched +3st, 35% vol) on contact-method pill lock
- F408–F410: typing ticks for the focus caption (consistent with §3.6.2 caption audio rule)
- F415: `transition_warm_whoosh.mp3` (P3, after approval) preparing the morph into Scene 3 at F420

---

### Scene 3 — AI Voice-to-Quote ★ HERO (v1.14 simplified, 8s)
**Time:** 0:14.0 – 0:22.0 (frames 420–660 · 8.0s · 240 frames)
**Feature shown:** Voice-to-quote — the killer flow.
**Visual target (do not embed):** `IMG_2418` → `IMG_2419` → `IMG_2420` → `IMG_2421`. All built as components per `kiva_components_for_norm.md`.
**Goal:** "Speak the job. Get a £2,454.60 itemised quote ready to send."

> **🎬 v1.11 layer (identity + bed + caption):**
> **Identity:** **PRECISE** — clean punch-zooms, surgical cuts, zero wasted motion. Navy/blue dominant. The white-flash before £2,454.60 is the visual climax of the entire ad.
> **Audio bed:** `bed_precise_tense.mp3` (loops, -22 dBFS, ramps slightly into the money shot)
> **Transition in:** `transition_warm_whoosh.mp3` at F415–F420 from Scene 2 → into Scene 3
> **Focus caption:** *"Voice → quote. 12 seconds."* — types in F590–F614, holds to F625. Position: glass plate to the right of the phone, gap 24 px.

> **🚨 v1.14 simplification rule:** Phone morphs from Scene 2 directly into the **New Quote screen with mic ALREADY ACTIVE** (mid-flow). NO Quick Start chip selection, NO customer picker, NO INCLUDE chips navigation. Open at the moment of voice capture; the viewer trusts the flow.

**Beat-by-beat:**

| Range (s) | Frames | Action |
|---|---|---|
**Beat-by-beat (v1.14):**

| Range (s) | Frames | Action |
|---|---|---|
| 0:14.0–0:15.0 | 420–450 | **Open at voice capture.** Phone morph from Scene 2 lands on the New Quote screen with `<MicButton>` already active and pulsing big (rings 130/160 px heavy state). Camera does a slow cinematic push-in 1.0× → 1.15× over 30 frames, settling on the mic. AI glow halo intensifies (purple, active state). A floating glass-plate `<GlassPlate>` to the right of the phone shows the captured voice text streaming in: *"Bathroom waste install — 32mm pipe, bath waste, basin trap, plumbing waste removal."* Text types in over 24 frames (F424–F448), one frame per char, with sparse `click.mp3` typing texture. |
| 0:15.0–0:16.0 | 450–480 | **Transcribe state.** Phone screen morphs (liquid transformation per §3.7.4) from active mic into the Transcribing state. `<SparkleLoader>` 8-petal purple sparkle rotates center-screen. Heading types in: *"Transcribing your voice…"* Subtitle below: *"Turning audio into text."* Two-stage progress: stage 1 fills smoothly F455–F478. `bed_precise_tense.mp3` underbed sustains; subtle hum layer adds. |
| 0:16.0–0:17.0 | 480–510 | **Generate state.** Sparkle loader continues rotating. Heading morphs to *"Generating your quote…"* Subtitle: *"AI is building line items, quantities and pricing."* Stage 1 marked complete (purple checkmark), stage 2 fills F485–F508. Camera holds at 1.15×, slight drift continues. |
| 0:17.0–0:18.6 | 510–558 | **Quote materializes — line items cascade.** Liquid morph from generating into Quote Review screen. `<AIBanner>` "AI generated from your voice description…" fades in at top. `<CustomerRow>` Mrs. Patel below it. `<JobTitleCard>` "Bathroom waste install." Then the `<LineItemRow>`s cascade in top-to-bottom, each sliding from the right with a sparkle stamp:<br>• F518: *32mm & 40mm Waste Pipe & Fittings — 1 — £45.00*<br>• F524: *Bath Waste & Overflow — 1 — £25.00*<br>• F530: *Basin Waste & Trap — 1 — £20.00*<br>• F536: *WC Pan Connector — 1 — £15.00*<br>• F542: *General Consumables (PTFE, clips, flux, solder) — 1 — £40.00*<br>• F550: *Plumbing Waste Removal — 1 — £120.00*<br>Per-item `click.mp3` at 25% vol on each landing (F518, F524, F530, F536, F542, F550). |
| 0:18.6–0:19.4 | 558–582 | **Subtotal + VAT count up.** Subtotal *£2,045.50* rolls up over 12 frames (F560–F572). *Include tax* toggle visibly clicks ON at F574. *VAT (20%) £409.10* appears at F576. `counter_roll_money.mp3` (P0) ramps in starting F558, building toward the climax. |
| 0:19.4–0:19.6 | 582–588 | **⚡ WHITE-FLASH PATTERN INTERRUPT (v1.3 locked).** 2 frames pure white (F582–F584) → 2 frames pure navy `#0F172A` (F584–F586) → 2 frames hold dark (F586–F588). Wakes the eye. **Audio: ALL SFX CUT to silence for frames F582–F587.** Silence + flash = maximum attention pivot. |
| 0:19.6–0:19.8 | 588–594 | **Total £2,454.60 stamps in.** Camera does a final 1.15× → 1.22× punch-zoom synced to the stamp. Total scales 0.6 → 1.18 → 1.0 (spring damping 14, magnetic easing). Quick navy bg flash on the row. **Audio: `impact2.mp3` at 100% at F588** + `counter_roll_money.mp3` peak hits at F588. **THIS IS THE AD'S MONEY SHOT.** Slight chromatic aberration on the £2,454.60 text for 8 frames per §3.7.3 macro-lens rule. |
| 0:19.8–0:20.5 | 594–615 | **Focus caption + send.** Glass-plate Focus Caption types in to the right of the phone: *"Voice → quote. 12 seconds."* (F590–F614, holds to F625). In parallel, the phone screen shows the *Send quote →* button. `<Thumb>` enters at F608 and taps the button at **F614**. Camera nudges 4 px down on press. Button briefly inverts (bg→white, text→navy). Audio: `click.mp3` at F614. |
| 0:20.5–0:21.4 | 615–642 | **Quote sends.** A paper-airplane icon rockets out of the button up-and-right at F616. `swoosh.mp3` at F616. Phone screen morphs (liquid) into a sent confirmation. Green `<ToastBanner>` "Sent via WhatsApp ✓" slides down from the top with a checkmark at F624. `achievement_chime.mp3` (P0) at F628. |
| 0:21.4–0:22.0 | 642–660 | **Hold + transition prep.** Camera pulls back from punch-zoom to 1.05× (resting). Drift baseline continues. Slight rotateY perspective shift begins preparing morph into Scene 4. `transition_sharp_impact.mp3` at F655–F660. |

**Scene 3 sound timeline:**
- F420 onward: `bed_precise_tense.mp3` underbed at -22 dBFS
- F424–F448: typing ticks for voice-text glass plate (`click.mp3` at 20%, every 2 frames)
- F455–F478: transcribe processing hum (filtered noise loop, -22 dBFS)
- F485–F508: subtle generation chime layer adds
- F518, F524, F530, F536, F542, F550: per-line-item ticks (`click.mp3` at 25%)
- F558–F582: `counter_roll_money.mp3` building (rising pitch)
- **F582–F587: HARD SILENCE for the white flash**
- **F588: `impact2.mp3` at 100% — the money shot**
- F614: `click.mp3` (send button tap)
- F616: `swoosh.mp3` (paper airplane fly-off)
- F628: `achievement_chime.mp3`
- F655–F660: `transition_sharp_impact.mp3` morphing into Scene 4

---

### Scene 4 — AI Expense Classification (v1.14 simplified, 5s)
**Time:** 0:22.0 – 0:27.0 (frames 660–810 · 5.0s · 150 frames)
**Feature shown:** Snap a receipt → AI classifies.
**Visual target:** `IMG_2422.PNG`. Build as components.
**Goal:** "Bookkeeping done in 2 seconds, on the way out of Screwfix."

> **🎬 v1.11 layer (identity + bed + caption):**
> **Identity:** **TACTILE** — hands-on, receipt physically drops in, scan line is the tactile event, green confirms. Crisp, methodical.
> **Audio bed:** `bed_tactile_clinical.mp3` (loops, -22 dBFS)
> **Transition in:** `transition_sharp_impact.mp3` at F655–F660 from Scene 3
> **Focus caption:** *"Categorised automatically."* — types in F740–F764, holds to F775. Glass plate to the right of the phone.

> **🚨 v1.14 simplification rule:** Phone morphs from Scene 3 directly into the **New Expense screen with the receipt photo already attached and the scan in progress**. NO FAB tap, NO "+New Expense" navigation, NO photo-capture step. Open mid-scan; viewer sees AI doing its job.

**Beat-by-beat (v1.14):**

| Range (s) | Frames | Action |
|---|---|---|
| 0:22.0–0:23.0 | 660–690 | **Open mid-scan.** Phone morph from Scene 3 lands on the New Expense sheet with the receipt photo card already populated (Wickes receipt visible) and the **"Scanning receipt…"** state active — purple sparkle spinner spinning. Camera does a slow push-in 1.0× → 1.12×. AI glow halo intensifies (purple, active). |
| 0:23.0–0:23.8 | 690–714 | **Scan line sweep.** A blue scan line (`#3B82F6`, 2 px, 30% glow) sweeps top-to-bottom across the receipt over 18 frames (F690–F708). OCR text fragments float off the receipt as the line passes — "Wickes", "£147.32", "04/03/26" — small text that lifts up and fades. `scan_sweep.mp3` (P1) F690–F708. |
| 0:23.8–0:24.6 | 714–738 | **Form auto-fills.** Below the receipt card, fields populate one-by-one with purple flash + tick:<br>• F714: Description = *"Wickes — bathroom fittings"*<br>• F722: Amount = *£147.32*<br>• F730: Date = *04/03/2026*<br>Each field 8 frames apart, `click.mp3` at 25% on each fill. |
| 0:24.6–0:25.4 | 738–762 | **Category lock — the magic moment.** Category chip row appears below. The *"Construction Materials"* chip auto-highlights with a bouncy spring (scale 1.0 → 1.15 → 1.0 over 12 frames F744–F756), turning navy bg with white text. `<AIBadge>` confirms. `sparkle_match.mp3` (P1) at F744. **Focus caption *"Categorised automatically."*** types in on glass plate to the right F740–F764. |
| 0:25.4–0:26.4 | 762–792 | **Save + flight.** `<Thumb>` enters from bottom-right, taps the Save button at F770. Sheet dismisses (liquid morph) and the new expense row flies into the Expenses list at F778. Counter "Expenses 0" → "Expenses 1" rolls at F784. Audio: `click.mp3` (save F770), `swoosh.mp3` (dismiss F774), soft `impact2.mp3` at 25% (counter roll F784). |
| 0:26.4–0:27.0 | 792–810 | **Hold + transition prep.** Camera pulls back to 1.05×, slight perspective shift toward Scene 5's angle. `transition_glitch_cut.mp3` (P3) at F804–F810 signaling list-to-map modal shift. |

**Scene 4 sound timeline:**
- F660 onward: `bed_tactile_clinical.mp3` underbed -22 dBFS
- F660: `transition_sharp_impact.mp3` overlap from Scene 3
- F665: soft paper-drop (`impact2.mp3` at 30%, pitched up — receipt settling in card)
- F690–F708: `scan_sweep.mp3`
- F714, F722, F730: per-field `click.mp3` ticks
- F744: `sparkle_match.mp3` (category lock)
- F740–F764: caption typing ticks
- F770: `click.mp3` (save)
- F774: `swoosh.mp3` (dismiss)
- F784: soft `impact2.mp3` (counter roll)
- F804–F810: `transition_glitch_cut.mp3` morphing into Scene 5

---

### Scene 5 — AI Customer Route Optimization (v1.14, 5.5s)
**Time:** 0:27.0 – 0:32.5 (frames 810–975 · 5.5s · 165 frames)
**Feature shown:** Map view with optimized route across customer pins.
**Visual target:** `IMG_2417.PNG`. Build chrome (status bar, chips, search, toggle, pins, nav) as components per `kiva_components_for_norm.md`. Use a cropped map-only slice of `IMG_2417` as a static background plate (per §3.5).
**Goal:** "AI routes your day — drive less, work more."

> **🎬 v1.11 layer (identity + bed + caption):**
> **Identity:** **SPATIAL / CINEMATIC** — the only "breathing wide" scene in the ad. Wide-then-zoomed-in. Geographic, sweeping. Gradient blue→purple route is the visual hero. The ad's exhale before the conversational close.
> **Audio bed:** `bed_spatial_cinematic.mp3` (loops, -20 dBFS — more present than other beds since this scene needs space)
> **Transition in:** `transition_glitch_cut.mp3` at F804–F810 from Scene 4
> **Focus caption:** *"Saves 47 minutes today."* — types in F920–F942, holds to F955. Glass plate to the right of the phone.

> **🚨 v1.14 simplification rule:** Already pre-navigated to the map view (existing v1.3 design — keep). The simplification here is just NOT introducing list/map toggle interaction; viewer arrives in map mode and stays there.

**Beat-by-beat (v1.14):**

| Range (s) | Frames | Action |
|---|---|---|
| 0:27.0–0:27.8 | 810–834 | **Open WIDE (v1.3 inverted camera + v1.14 polish).** Phone morph from Scene 4 lands on the Customers map view at MINIMUM zoom — all three customer pins (Annie Y in Notting Hill, Nolan C in Shepherd's Bush, Stan C in Hammersmith) visible across a wide London frame. Customer chips visible at top. Camera holds wide for 24 frames so the viewer reads the geography. `map_zoom_whoosh.mp3` (P1) at F812. |
| 0:27.8–0:28.4 | 834–852 | **PUNCH-ZOOM IN.** Camera punch-zooms into the pin cluster (~40% zoom increase) over 18 frames using `easeInOutCubic`. The phone screen content scales internally to simulate the map zooming. Spatial pattern interrupt — most ads zoom OUT after wide; we punch IN. |
| 0:28.4–0:29.0 | 852–870 | **Pins re-entry pulse.** Three pins do a synchronized pulse (each: scale 1.0 → 1.15 → 1.0, 200 ms intervals across pins). Circular ripples expand from each pin's base. `<AIBadge>` "AI powered" purple chip pops in top-right of map. Per-pin `impact2.mp3` at 30% vol, descending pitch (F855, F861, F867). |
| 0:29.0–0:29.8 | 870–894 | **Route line draws.** A glowing gradient line (`#3B82F6` → `#6D28D9`) draws between the three pins in optimal sequence over 18 frames, with 3 traveling light particles flowing along the path. `route_line_flow.mp3` (P1) sustained F870–F894. |
| 0:29.8–0:30.6 | 894–918 | **Stat overlay materializes.** Top-center on the map: huge **"47 min"** (Inter_700Bold ~36px white) with subtitle *"time saved today"* (10px `#94A3B8`), and below *"12.4 mi optimized"* (8px `#94A3B8`). Numbers count up from 0 over 12 frames F900–F912. `counter_roll_money.mp3` adapted (or layered with subtle pitch shift to differentiate from Scene 3). `achievement_chime.mp3` at F912. |
| 0:30.6–0:32.0 | 918–960 | **Focus caption + breathe.** Glass plate Focus Caption types in to the right of the phone: *"Saves 47 minutes today."* F920–F942, holds to F955. **This is the ad's spatial exhale beat** — camera holds steady, map breathes, nothing else competing. The viewer feels the spaciousness. |
| 0:32.0–0:32.5 | 960–975 | **Transition prep.** Slight camera tilt + rotateY shift preparing morph into Scene 6 (intimate dialog). `transition_soft_fade.mp3` (P3) at F970–F975. |

**Scene 5 sound timeline:**
- F810 onward: `bed_spatial_cinematic.mp3` underbed at -20 dBFS (more present than other scenes)
- F804–F810: `transition_glitch_cut.mp3` overlap from Scene 4
- F812: `map_zoom_whoosh.mp3`
- F855, F861, F867: per-pin `impact2.mp3` at 30%, descending pitch
- F870–F894: `route_line_flow.mp3` sustained
- F900–F912: counter-roll layer (lower-pitched than Scene 3 to differentiate)
- F912: `achievement_chime.mp3`
- F920–F942: caption typing ticks
- F970–F975: `transition_soft_fade.mp3` morphing into Scene 6

---

### Scene 6 — AI Follow-up (v1.14 simplified, 6.5s)
**Time:** 0:32.5 – 0:39.0 (frames 975–1170 · 6.5s · 195 frames)
**Feature shown:** AI follow-up on stale quotes — the AI writes and sends a follow-up message that converts the quote.
**Goal:** "The AI doesn't just help — it acts. While you're working, it's closing the deal for you."

> **🎬 v1.11 layer (identity + bed + caption):**
> **Identity:** **CONVERSATIONAL** — messages exchange, status badge flips. Dialog-paced, satisfying back-and-forth. Warm WhatsApp green and the navy→green status flip are the dominant moments.
> **Audio bed:** `bed_conversational_warm.mp3` (loops, -22 dBFS)
> **Transition in:** `transition_soft_fade.mp3` at F970–F975 from Scene 5
> **Focus caption:** *"Wrote it. Sent it. Won the job."* — types in F1100–F1140, holds to F1155. Glass plate to the right of the phone. The three-beat cadence echoes the three actions the AI just completed.

> **🚨 v1.14 simplification rule:** **DROPPED the AI Assistant sheet half** (was redundant with the chatbot moment elsewhere — the AI's whole job IS being the chatbot, shown implicitly through every action). Scene 6 is now 100% the AI follow-up flow: stale quote → bot writes → sends → reply → Accepted. No navigation to the assistant sheet.

**Beat-by-beat (v1.14):**

| Range (s) | Frames | Action |
|---|---|---|
| 0:32.5–0:33.3 | 975–999 | **Open on stale quote.** Phone morph from Scene 5 lands on the Quotes list — focused on ONE row: *"Bathroom install — Mrs. Patel — £2,454.60 — Sent — 5 days ago"*. A pulsing yellow dot indicates staleness. Camera does a slow push-in 1.0× → 1.18× toward this row. AI glow halo intensifies (purple, active). |
| 0:33.3–0:34.3 | 999–1029 | **AI bot emerges + writes.** A small AI-bot avatar (purple gradient circle with sparkle icon) emerges from the stale row at F1002 with a `POP_IN` spring. A WhatsApp green bubble forms next to it; typing-dots animate F1008–F1020 (tick-tick-tick `click.mp3` at 20%); then the message types in character-by-character F1020–F1029: *"Hi Mrs. Patel — just checking in on the bathroom quote, want me to schedule it in?"* (Note: long message, types fast — ~9 frames for ~80 chars, blur-fast typing reads as "AI fluency"). |
| 0:34.3–0:35.1 | 1029–1053 | **Send.** Paper-airplane icon flies right out of the bubble at F1032. `swoosh.mp3` at F1032. Brief pause (8 frames) where the bubble settles into a "sent" state — translucent. Camera holds steady. |
| 0:35.1–0:36.0 | 1053–1080 | **Reply lands.** Reply bubble pops in from left at F1056 with a sparkle entrance: *"Yes please — this Saturday?"* `notifcation2.mp3` at F1056 — incoming-message ding. Reply types in fast F1056–F1075. |
| 0:36.0–0:36.6 | 1080–1098 | **Status flip — the satisfying moment.** Camera punches in slightly (1.18× → 1.25×) onto the original quote row. The status pill animates: *Sent* (`#DBEAFE` bg, `#1D4ED8` text) flips/morphs to *Accepted* (`#DCFCE7` bg, `#15803D` text) using `STATUS_FLIP` preset over 8 frames F1085–F1093 — cross-fade bg + scale 1.0→1.06→1.0 spring. Green confetti micro-burst (~6 particles) at the badge F1093. `achievement_chime.mp3` at F1093 + small celebration micro-chime layer. Slight chromatic aberration on the badge for 8 frames per §3.7.3 macro-lens rule. |
| 0:36.6–0:38.6 | 1098–1158 | **Focus caption — the emotional payoff.** Glass plate Focus Caption types in to the right of the phone in three deliberate beats matching the narrative cadence:<br>• **F1100–F1116:** *"Wrote it."* (8 chars, 16 frames including 4-frame pause after)<br>• **F1116–F1136:** *"Sent it."* (7 chars, 14 frames including 4-frame pause)<br>• **F1136–F1155:** *"Won the job."* (12 chars, 19 frames)<br>Each phrase types in its own 4-frame breath beat between phrases (cursor blinks). The full sentence holds visible F1155 onward. **This is the ad's emotional climax** — the viewer feels the AI just did what they would normally do. |
| 0:38.6–0:39.0 | 1158–1170 | **Hold + transition prep.** Camera holds, drift continues, AI glow halo brightens slightly. Begin pull-back preparing Scene 7 lockup. No transition sting — Scene 6→7 is a continuous emotional flow into the lockup. |

**Scene 6 sound timeline:**
- F975 onward: `bed_conversational_warm.mp3` underbed at -22 dBFS
- F970–F975: `transition_soft_fade.mp3` overlap from Scene 5
- F985: soft alert ding (stale quote highlight, `notification1.mp3` at 30%)
- F1002: AI sparkle "thinking" hum begins (warm AI texture, sustained)
- F1008–F1020: typing-dots `click.mp3` at 20% every 3 frames (12 ticks)
- F1020–F1029: rapid character-tick layer at 15% during AI message typing
- F1032: `swoosh.mp3` (paper-airplane send)
- F1056: `notifcation2.mp3` (reply ding)
- F1056–F1075: light typing texture for reply bubble
- F1093: `achievement_chime.mp3` + micro-celebration layer (status flip Accepted)
- F1100–F1155: caption typing ticks (sparse, 20% vol, every-other char per §3.6 rule)
- F1158 onward: `outro_drone.mp3` ramps in at -16 dBFS (begins building toward Scene 7)

---

### Scene 7 — Logo lockup + CTA (v1.14, 6s)
**Time:** 0:39.0 – 0:45.0 (frames 1170–1350 · 6.0s · 180 frames)
**Goal:** Brand recall + clear conversion ask, with proper triumphant breath room.

> **🎬 v1.11 layer (identity + bed + caption):**
> **Identity:** **TRIUMPHANT** — pull-back, sparkles converge into the logo, rest. The exhale of the entire ad.
> **Audio bed:** `outro_drone.mp3` already-locked (P0, builds from -16 to -12 dBFS over the scene).
> **Transition in:** continuous emotional flow from Scene 6 — no transition sting needed; the AI glow halo simply expands into the sparkle convergence.
> **Caption:** the **tagline IS the caption** — *"Blue collar solutions to blue collar problems."*

> **🚨 v1.14 simplification rule:** Scene 6 ends with the camera already pulled back; Scene 7 inherits that wide framing. No new navigation. The lockup is the natural resolution.

**Beat-by-beat (v1.14):**

| Range (s) | Frames | Action |
|---|---|---|
| 0:39.0–0:40.0 | 1170–1200 | **Pull-back + sparkle convergence.** Camera continues pulling back from Scene 6's framing. The phone shrinks slightly (1.0× → 0.85×). The AI glow halo around the phone expands and fragments into ~40 purple sparkle particles, all swirling toward the phone center in a slow vortex. Background dims to deeper navy→black. `outro_drone.mp3` building. |
| 0:40.0–0:41.0 | 1200–1230 | **Particles converge → logo emerges.** Sparkles compress into the phone, then a brilliant flare bursts — and the Kiva logo emerges, lifting OFF the iPhone surface, scaling 1.0× → 1.4× over 24 frames as the iPhone itself fades down behind it. Logo glow `rgba(59,130,246,0.45)` ramps up. **Audio: `impact2.mp3` at 100% at F1218** — the logo lands. By F1230 the iPhone is gone, only the logo remains center-frame. |
| 0:41.0–0:42.0 | 1230–1260 | **Tagline types in.** Below the logo (gap 28 px), the tagline types in character-by-character — same Linear/Notion typing language as the rest of the ad: *"Blue collar solutions to blue collar problems."* (~46 chars, ~28 frames typing F1232–F1260, ~0.6 frames/char). Inter_600SemiBold ~32 px, white at 90%. Sparse `click.mp3` typing texture at 20%. Cursor blinks after the period. |
| 0:42.0–0:43.0 | 1260–1290 | **Tagline holds + CTA appears.** Tagline static. CTA button materializes 32 px below: `<Button variant="primary">` scaled up — bg `#0F172A`, padding 18px / 28px, radius 10, white Inter_600SemiBold 16 px text **"Try Kiva free →"**. Fade-up with 4 px rise. URL beneath `#94A3B8` Inter_400Regular 14 px: *kiva.app*. **Social proof** under URL, 12 px `#64748B` Inter_500Medium: *"Used by 1,247+ UK tradespeople."* Soft `click.mp3` at F1262 on CTA pop. |
| 0:43.0–0:44.0 | 1290–1320 | **🔁 LOOP CLOSURE.** The original Mrs. Patel iMessage card from Scene 1 slides in from the top-right corner at 70% scale, in a `<GlassPlate>` to match the cinematic environment. Same blue iMessage chrome, same sender. **Body text now reads:** *"see you Saturday 🤝 Quote accepted ✓"* — green check ✓ sparkles in 4 frames after card lands. Card lands at approximately frame coords (1620, 200), -3° rotation, opacity 0.92. **This is the curiosity loop closing.** Audio: soft `notication1.mp3` at F1300 at **-12 dBFS** (whispers, doesn't punch). |
| 0:44.0–0:45.0 | 1320–1350 | **Final breath.** Camera holds. Logo glow pulses one final time (opacity 0.6 → 0.95 → 0.6 over 30 frames). `outro_drone.mp3` resolves to its C-major hopeful chord and starts a slow fade-out at F1335. Mrs. Patel card sits quietly in corner. Tagline + CTA static. **The viewer is left with:** logo, CTA, social proof, the closed loop in the corner, and the feeling that the chaos from F0 is now resolved. Final frame F1350 = clean state. |

**Scene 7 sound timeline:**
- F1170 onward: `outro_drone.mp3` building (-16 → -12 dBFS over the scene)
- F1170–F1200: sparkle convergence shimmer (filtered noise rising in pitch)
- F1218: `impact2.mp3` at 100% (logo land)
- F1232–F1260: caption typing ticks on tagline (`click.mp3` 20%, every-other char)
- F1262: soft `click.mp3` (CTA pop)
- F1300: soft `notication1.mp3` at -12 dBFS (Mrs. Patel callback whisper) — the loop closure ding
- F1320–F1350: drone holds, final glow pulses; F1335 begin fade-out, F1350 silence

---

## 7. Acceptance criteria for Norm

This ad is "done" when:

1. ✅ All 7 scenes render at 1920×1080 / 30 fps / **1350 frames total = exactly 45.0 s** (v1.14).
2. ✅ Color tokens in `tokens.ts` exactly match the design spec values listed in §3.
3. ✅ Every reference-image-derived screen visually matches its source PNG within reasonable tolerance (typography, spacing, color, layout). Use the design spec PDF for exact pixel values.
4. ✅ The AI-purple/navy/blue semantic rule is respected in every animation.
5. ✅ All text/copy is verbatim from this plan (no placeholder lorem ipsum, no paraphrasing).
6. ✅ Sound is wired and timed as specified, peaks under -6 dBFS.
7. ✅ Scene transitions are clean cuts or specified moves — no default "fade to black."
8. ✅ Logo SVG is used directly (don't recreate it as code) and follows lockup rules from §7 of the design spec.
9. ✅ The video can be previewed via `npm start` from `/remotion`.

---

## 8. Open questions / decisions deferred to user

- **Voiceover or text-only?** This plan is built for **no VO** (kinetic UI + sound design + on-screen text). If we add VO later, scenes 2–6 would need their on-screen text condensed.
- **Music bed?** Not included. Recommend a tense-to-uplifting trades-themed instrumental laid in post (sub-30s license track).
- **Final CTA URL?** `kiva.app` is a placeholder — confirm with user before render.
- **iPhone model frame?** This plan assumes iPhone 15-style (rounded corners, dynamic island). User to confirm if they want a specific device.

---

## 9. Hand-off

**Steve has done his job.** This plan is the source of truth. If implementation hits a wall (e.g., a specific motion isn't possible in Remotion in the time budgeted), Norm should flag it back and Steve will revise the relevant scene rather than improvising on the creative side.

— Steve, Master SaaS Ad Designer · v1.0 · 2026-05-06
