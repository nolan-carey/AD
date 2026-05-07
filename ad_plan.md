# Kiva — 30s SaaS Kinetic UI Showcase
**Ad plan · authored by Steve (Master SaaS Ad Designer) · for Norm (Master Programmer)**

> **Conversion goal:** This ad's job is to make a UK tradesperson stop scrolling, feel "this is my life," and click through to try Kiva. Every frame must serve that goal. If a creative choice doesn't measurably help conversion, cut it.

---

## 🚦 PENDING APPROVALS

> Anything that needs the **user's explicit go-ahead** lives here. Always shown at the very top of the doc. When this section reads "(none — all clear)", Norm can proceed with everything in ACTIVE DIRECTIVES without further user input. When this section has items, **Norm pauses on those specific items** until the user marks them ✅.

**(none — all clear)** · *User waived the runtime ripple decision on 2026-05-06: "yes just add things as I say, the complete flow is going to change, don't worry about it." Total runtime + music re-timing will be reconciled in a later pass once all scenes are individually locked. For now, scenes are designed independently and the master timeline §5 may show inconsistent totals.*

---

## 📋 CHANGELOG

> Every revision logged here. Most recent on top. Norm — read this first to see what changed since your last build.

- **v1.38 · 2026-05-07** · **🌊 Sequence 2 — 90% OVERLAP cadence supersedes v1.37 delays.** User direction (continuation): *"as a continuation of this version, I want the kinetic text to finish the anim to get 90% of the way through and then the next kinetic text starts."* Replaces v1.37's 6-frame inter-feature delay with **continuous overlap** — when feature N's text typing reaches 90% (relative F15 in its 28f window), feature N+1's full animation begins. Feature N's icon-transform + drift onset run IN PARALLEL with feature N+1's sparkle-dart + icon line-draw + typing. Creates a continuously-moving stream rather than discrete-then-pause beats. **New per-feature start frames:** Feature 1 F282, Feature 2 F297 (15f after F1 starts), Feature 3 F312, Feature 4 F327. Each still 28f animation. **Feature 4 ends F355**; constellation collapse begins immediately (F355–F365). Total feature flash 73f (was 130f in v1.37 with delays). Sequence 2 length: 273f → 216f (-57f). End frame F453 → F396 (15.1s → 13.2s absolute). Per Phase 1 / no-flow-worry rule: total flow gets reconciled in Phase 2. v1.37 Feature 2 position fix (pulled LEFT 70px to (1175, 525)) preserved. All v1.32–v1.36 specs preserved (28f animation per feature, slowed pre-feature beats, brand-transition choreography, all v1.35 active-state icon transforms).
- **v1.37 · 2026-05-07** · **🎯 Sequence 2 — inter-feature delay added + Feature 2 position fix.** User direction (with rendered preview screenshot): *"pacing should look like — the symbol animation finishes then the next one comes in after 0.2s delay or something like that. The text for the profile is cut off, the anim is too close to see."* **Two changes:**<br>**(1) Inter-feature delay** — each feature animation now fully completes (28f), then a **6-frame (~0.2s) breath** before the next feature begins. Previously features ran back-to-back at 28f each = continuous; now there's a deliberate pause between each. Feature 1 anim F282–F310 + delay F310–F316; Feature 2 anim F316–F344 + delay F344–F350; Feature 3 anim F350–F378 + delay F378–F384; Feature 4 anim F384–F412 (no trailing delay — collapse begins immediately). Total feature-flash: 130f (was 112f, +18f).<br>**(2) Feature 2 position pulled LEFT 70 px** — moved from (1245, 525) to (1175, 525) so the big "profile." outcome word doesn't clip the right frame edge as observed in user's preview screenshot. Anchor convention clarified: position = LEFT edge of icon; whole composition extends rightward; at (1175, 525) the right edge of "profile." now clears the 1920 px frame with comfortable margin.<br>Total Sequence 2 length: 255f → 273f (+18f). End frame F435 → F453 (15.1s absolute). All v1.36 specs (28f per-feature animation, slower pre-feature beats, brand-transition choreography, all v1.35 active-state icon transforms) preserved.
- **v1.36 · 2026-05-07** · **🐢 Sequence 2 — pacing extended further to ~8.5s (was 5.9s); end frame F435 (= 14.5s absolute).** User direction: *"the voice one is good, things are just happening too fast, my goal is to finish sequence 2 around 14.5s currently finish around 13s."* Per-feature window 19f → 28f. Pill hold 15f → 24f. Pill pop-out 3f → 6f. Logo-enlarge beat 3f → 12f (much more dramatic — logo claims the moment alone for ~0.4s before sparkle). Sparkle entrance 6f → 12f. Vortex collapse 6f → 10f. Logo→iPhone cross-fade 12f → 16f. Dashboard appear 11f → 15f. Total Sequence 2 length: 177f → 255f (+78f = +2.6s). Per-feature sub-beats also slowed for breath: icon line-draw 3f → 4f, text typing 7f → 10f, icon transform 5f → 6f, drift onset+cycle 2f → 6f. **All v1.35 spec preserved** — Feature 1 (mic→red recording UI) / Feature 2 (mic→profile→scrolling details, user confirmed "good") / Feature 3 (sequenced pin1→pin2+line) / Feature 4 (AI avatar + bubble + typing dots — v1.35 update was missed in earlier edit but locked in this turn). Phase 1 only — total flow / music re-timing reconciled in Phase 2/3.
- **v1.35 · 2026-05-07** · **🎬 Sequence 2 — 4 focused per-feature icon/animation refinements.** User direction:<br>**🎙 Feature 1 (Speak quote) — drifting text refined:** "Quote for a standard toilet refit" now smaller (14 → 11 px), single-line (no wrap), 70% opacity (was 60%), 16 px padding, slower drift (0.8 px/frame, was 1). Easier to read.<br>**👤 Feature 2 (Voice fills profile) — icon transformation rebuilt:** START with microphone (deliberate visual rhyme with Feature 1 — voice is the input) → mic morphs into a profile/person silhouette → small scrolling customer-detail tape rolls upward beside the silhouette: "Annie Yang" → "07700 900123" → "Notting Hill, London" (continuous loop). Replaces v1.34's standalone person silhouette + field-rows.<br>**🗺 Feature 3 (Optimises route) — sequenced pins + line:** First pin pops up alone with overshoot, brief beat, then second pin pops up + glowing gradient line (`#3B82F6 → #6D28D9`) draws between them in sync. Both pins continue with gentle pulse; light particles flow along the line continuously. Replaces v1.34's simultaneous pin drop.<br>**🤝 Feature 4 (AI writes follow-up) — AI avatar added:** Two-element icon composition: small purple AI avatar circle (with sparkle "face") + chat bubble next to it. Typing dots ("...") animate in the bubble first, then dots fade out and message types in: "Hi John, just following up..." Sent paper-airplane + green check. The avatar gives the AI a *face* — visually says "Kiva's AI is the one typing this, like a real person."<br>All other v1.34 specs (positions, sizes, layout icon-LEFT, text-typing, brand-transition wordmark-collapse + logo-enlarge) unchanged.
- **v1.34 · 2026-05-07** · **🎯 Sequence 2 — constellation pulled IN closer to center, slightly LARGER, + wordmark-collapse + logo-enlarge transition.** User direction: *"include the text and symbols being inline and closer to the center icon and slightly larger. When the bubbles text pops, can the Kiva text collapse into itself and disappear, then the central Kiva logo enlarges?"* Three changes:<br>**(1) Constellation pulled IN** (reverses v1.33's outward push). New positions much closer to the centered logo:<br>  • F1 ~(975, 290), distance **252 px** (was 340 px)<br>  • F2 ~(1245, 525), distance **286 px** (was 389 px)<br>  • F3 ~(945, 805), distance **265 px** (was 381 px)<br>  • F4 ~(665, 570), distance **296 px** (was 373 px)<br>**(2) Elements ~12% larger** — verb 32 → 36 px, outcome 64 → 72 px, icon 48 → 56 px. Gap between icon and text 32 → 28 px (more compact composition, more visual punch).<br>**(3) Wordmark collapse + logo enlarge transition added** to the pill pop-out beat. NEW choreography at F240–F246:<br>  • F240–F243 (3f): pill pops out (compresses + fades) AND simultaneously the *"Kiva."* wordmark COLLAPSES INTO ITSELF — scaleX 1.0 → 0.6, scaleY 1.0 → 0.4, opacity 1 → 0. Wordmark looks like it's being absorbed into its own period. Fully gone by F243.<br>  • F243–F246 (3f): with the wordmark gone, the Kiva chevron logo ENLARGES to take the freed space — scale 1.0 → 1.4 over 3 frames (easeOutCubic). Logo blue glow halo intensifies. Logo is now alone center-stage at larger size for a brief beat before the sparkle emerges.<br>  • F246+ (existing): sparkle emerges from the now-enlarged logo and begins its orbit.<br>This makes the brand transition feel earned — the wordmark "merges" into the logo, then the logo grows to claim the moment, then the AI sparkle is born from it. Phase 1 only.
- **v1.33 · 2026-05-07** · **📐 Sequence 2 — pacing refined + icon flipped to LEFT + linear horizontal composition + more padding/breathing room.** User direction: *"work on the pacing of the animation and the overall padding, make the text and symbol linear, and symbols should be on the left."* Three precise changes:<br>**(1) Layout: icon-LEFT (was icon-RIGHT in v1.32).** Linear horizontal composition: `[icon] gap 32 px [verb / OUTCOME]`. Icon-left convention matches Western reading order (visual primer → text label). Each feature block now has 12 px internal padding all around for breathing room.<br>**(2) Pacing refined within each 19f window** for smoother sub-beat flow: sparkle dart 2f → icon line-draw 3f (was 2f, more deliberate) → text typing 7f (verb 3f + 1f breath + outcome 3f) → icon transform 5f (was 4f, more breath for the morph) → drift onset 2f + continuous loop. Total still 19f per feature.<br>**(3) Constellation pushed outward** for more breathing room from the centered logo. New positions (deterministic):<br>  • F1 ~(985, 200), distance ~340 px, rotation +2°<br>  • F2 ~(1340, 500), distance ~389 px, rotation -2.5°<br>  • F3 ~(940, 920), distance ~381 px, rotation -1.5°<br>  • F4 ~(590, 580), distance ~373 px, rotation +3°<br>v1.32 typing-text + active-state-icon transforms + drifting simulated content all unchanged. Total Sequence 2 length unchanged at 177 frames (5.9s).
- **v1.32 · 2026-05-07** · **🎙 Sequence 2 — feature-flash extended +1.5s + typed text + icon RIGHT of text + LIVE active-state icon transforms with drifting simulated content.** User direction: *"spend a bit more time on Sequence 2 pacing, work on the symbol location and animations of the symbols, add 1.5s to the pacing. The text should appear being typed. Symbols should be to the right of the text. For Speak Get a Quote: originally microphone, then turns into the same red recording UI from the app, with small text drifting away from it like spoken words 'Quote for a standard toilet refit' as if user is talking."* Five changes:<br>**(1) Pacing extended +1.5s** — per-feature window 8f → 19f; total feature-flash section 32f → 76f; Sequence 2 total: 132f → 177f (4.4s → 5.9s). End frame now F357 (was F312). Subsequent sequences NOT shifted per Phase 1 / waiver rule — Phase 2 reconciliation later.<br>**(2) Layout flipped** — icon now to the RIGHT of the text (was: icon stacked above text). Horizontal composition: text-block left, icon right, gap 24 px, vertically centered.<br>**(3) Text TYPES IN char-by-char** — replaces v1.27 scale-punch stamp. Verb types first (small), then 1-frame breath, then outcome word (huge) types in. Final char of outcome word still gets a scale punch. Sparse `click.mp3` typing texture per the §3.6.4 rule.<br>**(4) Icons transform into LIVE active-state UIs** (Norm: reference real Kiva codebase for accurate active-state visuals, especially `screens/VoiceQuote/index.js` for the red recording UI):<br>  • 🎙 **Feature 1:** mic → **red recording UI** (record dot + waveform from real Kiva app)<br>  • 👤 **Feature 2:** person → live customer-card auto-filling field-rows<br>  • 🗺 **Feature 3:** pins → activated pulse + route building<br>  • 🤝 **Feature 4:** bubble → typing message bubble with sent state<br>**(5) Drifting simulated content** flows away from each active-state icon, simulating real user actions in real-time:<br>  • Feature 1: spoken words drift up — *"Quote for a standard toilet refit"* (per user spec)<br>  • Feature 2: customer details drift — *"Annie Yang"* / *"07700 900123"* / *"Notting Hill, London"* **[Steve interpretation — confirm]**<br>  • Feature 3: addresses drift — *"Hammersmith"* / *"Notting Hill"* / *"Fulham"* **[Steve interpretation — confirm]**<br>  • Feature 4: message text streams into bubble — *"Hi John, just following up..."* **[Steve interpretation — confirm]**<br>Phase 1 only — frame-precise audio for the typing/drifting beats deferred to Phase 3.
- **v1.31 · 2026-05-07** · **✨ Sequence 2 — tagline pill texture upgraded to feel like a real bubble + text expansion synced to highlight sweep.** User direction: *"make the texture of it feel more like a bubble, add a bit of sparkly, and when the highlight gradient is going across the bubble expand the text div."* Three additions to the pill HOLD beat (F225–F240):<br>**(1) Iridescent edge gradient** — subtle rainbow tint shifting blue → purple → soft pink → blue around the pill's border at ~5% opacity (real soap-bubble feel).<br>**(2) Sparkle particles on the bubble surface** — 2–3 tiny 2 px white dots scattered on the pill, twinkling on/off independently with randomized phase (scale 0 → 1 → 0 over 30 frames each). Plus a second soft highlight reflection on the bottom-left of the pill (~12% white) — the natural underside reflection a real bubble has.<br>**(3) Text div expands synced to the highlight sweep** — as the diagonal highlight gradient travels left → right across the pill (over the full 15 frames of hold), the text div scales 1.0 → 1.04 → 1.0, peaking exactly when the highlight is at horizontal center. Reads as the bubble "breathing." All effects are continuous within the hold; expansion + sweep loop together.<br>Builds on v1.30 inflate animation — only the HOLD beat changed. Phase 1 only.
- **v1.30 · 2026-05-07** · **🫧 Sequence 2 — tagline pill now EXPANDS like a bubble inflating + bubble-pop SFX.** User direction: *"the text holding the 'blue collar solutions to blue collar problems' needs to expand when it pops with a bubble popping SFX."* Replaced the simple v1.26 POP_IN scale animation with an **outward bubble-inflate motion**: pill starts as a tiny seed (scaleX 0, scaleY 0) → rapidly widens horizontally (scaleX 0 → 1.20 in 3f, scaleY catching up) → vertical catch-up (scaleY → 1.20 in 2f) → elastic settle to 1.0 with bouncy spring (damping 11, mass 0.7 — bouncier than standard). 6 micro-particles puff outward at peak inflation (F4) for the "air-release" flourish. Text inside fades up during the inflate so it's only legible after fully expanded. **New SFX requested:** bubble-pop sound synced to expansion peak F3–F4. Phase 3 to source — candidate is a new ElevenLabs prompt `bubble_pop_inflate` (~0.5s, "soft satisfying bubble pop with quick air-burst tail") OR pitched-up `impact2.mp3` + layered whoosh. Phase 1 only — frame-precise SFX wiring deferred to Phase 3.
- **v1.29 · 2026-05-07** · **🎲 Sequence 2 — feature positions made organic, not perfect clock face.** User direction: *"make the location of the text a bit more variation, like a bit of randomness."* The 4 feature texts no longer sit at exact 12/3/6/9 compass positions on a 280 px circle. Locked organic positions:<br>**🎙 Feature 1** at ~(985, 235), distance 310 px, rotation +2° (was 960, 220)<br>**👤 Feature 2** at ~(1305, 510), distance 346 px, rotation -2.5° (was 1280, 540)<br>**🗺 Feature 3** at ~(940, 880), distance 341 px, rotation -1.5° (was 960, 860)<br>**🤝 Feature 4** at ~(620, 570), distance 341 px, rotation +3° (was 640, 540)<br>Distances now vary 310–346 px (not uniform 280). Angles offset 5–15° from exact compass points. Each text-block carries a small per-feature rotation (-2.5° to +3°). Sparkle's orbit path also wobbles — faint purple trail is no longer a perfect circle. **Reads as:** organic constellation, not symmetrical diagram. Deterministic values (Norm: don't randomise per render — these are fixed values; the "randomness" is baked into the spec). All other v1.27 + v1.28 work (icons, animations, text copy) unchanged.
- **v1.28 · 2026-05-07** · **✏️ Sequence 2 — kinetic-typography copy refined to match each feature's actual mechanic.** User flagged that the v1.27 copy ("Save customers." in particular) didn't represent what Kiva actually does. User picked **Set 3** (action → feature reveal pattern, 3-4 words each, kinetic-typography big-word-at-end). Locked copy:<br>**🎙 12 o'clock:** *Speak. Get a* **quote.** *(was "Speak quotes.")*<br>**👤 3 o'clock:** *Voice fills the* **profile.** *(was "Save customers." — replaced because user said it didn't represent the AI auto-fill mechanic)*<br>**🗺 6 o'clock:** *AI optimises the* **route.** *(was "Drive less." — too vague, didn't show AI agency)*<br>**🤝 9 o'clock:** *AI writes the* **follow-up.** *(was "Win more jobs." — vague, didn't represent the follow-up feature)*<br>Pattern: each verb is the *AI action*, each big word is the *feature noun the user gets*. UK spelling preserved ("optimises"). Plain-English Jobber voice. Icons + animations from v1.27 unchanged. Phase 1 only.
- **v1.27 · 2026-05-07** · **🎙 Sequence 2 — meaningful icons + behavior-matched animations added per feature.** User direction: *"add meaningful symbols with logical animations on the symbols to go along with the text. For example speak quotes would have a microphone that turns into a recording reading with cool line animation like something's being spoken."* Each of the 4 features now carries an icon ABOVE the text whose animation REPRESENTS the feature's action:<br>**🎙 Speak quotes** → microphone with concentric waveform pulse (continuous gentle ripple while persisting)<br>**👤 Save customers** → person silhouette that fills with purple from bottom + green check stamp<br>**🗺 Drive less** → 2 pins → wavy route → MORPHS to optimized path with flowing light particles<br>**🤝 Win more jobs** → speech bubble → paper airplane flies out → check stamps in<br>All icons: line-style, white stroke ~3 px, subtle purple glow underneath. Once placed, all 4 icons keep continuous micro-motion in parallel — the constellation moment now has *life everywhere*, no dead pixels. Phase 1 only — pacing/sound to be reconciled in their phases.
- **v1.26 · 2026-05-07** · **🎯 Sequence 2 revised — centered logo + tagline pill + features circle + persist.** User direction: *"keep Kiva logo centralised. Have 'blue collar solutions for blue collar problems' in a bubble/pill that pops and disappears. The kinetic text we talked about CIRCLES the central Kiva logo. I like the current kinetic circling text."* + follow-up: *"keep the text after the AI sparkle added them to screen."* **Three changes from v1.24:** (1) Logo NO LONGER glides to top-right — Kiva chevron + "Kiva." wordmark stay CENTERED for the entire sequence. (2) Tagline now lives in a glassmorphism POP-IN PILL (rounded full-pill shape, glassy chrome) — pops in (overshoot 1.12 → 1.0), holds 15f for the read, pops out (compress + fade). (3) The 4 features no longer scatter to corner quadrants — sparkle ORBITS the centered logo at ~280 px radius, dropping each feature at a clock position (12/3/6/9), and **all features PERSIST on screen** until the constellation collapses into the iPhone vortex. Final visual moment before the phone: centered logo + 4 satellite features = "every AI feature radiates from the Kiva brain." Kept from v1.24: kinetic typography (verb small / outcome HUGE with scale punch + purple underline), declarative Jobber-voice copy. **Phase 1 only** — no audio frame precision worry; Phase 3 will reconcile.
- **v1.25 · 2026-05-07** · **📐 3-phase process locked: Creatives → Pacing → Sound.** User direction: *"we are focusing on overall scene then we will edit pacing then we will finish sound direction we are only working on the creatives right now."* Steve's behavior locked accordingly: Phase 1 (current) = pure creative content per scene, no runtime/audio precision worries. Phase 2 = pacing/timing reconciliation. Phase 3 = sound direction finalization. **Also noted:** user added 6 more notification messages to Scene 1's chaos cluster — they'll be listed/specced in a future creative-direction turn. Scene 1 spec doc currently still shows the original 12 (Mrs. Patel hero + 11 stack/density). When user delivers the 6 new messages, Steve adds them to the cluster as creative content; their landing positions, frame timings, and audio cues will be set in Phase 2 (pacing) + Phase 3 (sound) — not Phase 1. Memory updated to enforce the 3-phase rule across all future Steve sessions.
- **v1.24 · 2026-05-07** · **🎯 Scene 2 rewritten — AI Sparkle Director + 4-feature flash.** User direction: after "Feeling overwhelmed?" types in Scene 1, swipe-up wipe → centered brand lockup (Kiva chevron + "Kiva." wordmark + "Blue collar solutions for blue collar problems") → logo glides to top-right (persists rest of ad) → AI sparkle enters center → quickly lists 4 features → enter app. User picked "**AI Sparkle as the Director**" direction (sparkle darts to 4 quadrants, bursts text from each landing) + Option B copy (declarative Jobber voice): *"Speak quotes."* / *"Save customers."* / *"Drive less."* / *"Win more jobs."* Each feature uses **kinetic typography** — verb small, outcome word HUGE with scale-punch + soft purple underline. ~8 frames per feature. Scene 2 frame range: 180–312 (132 frames, 4.4s). Replaces v1.22 "iPhone with Kiva app opening" spec. Scenes 3–10 frame ranges unchanged this turn per the v1.23 user-waiver — total-flow reconciliation deferred.
- **v1.23 · 2026-05-06** · **User waived total-flow reconciliation — pure per-scene mode.** User direction: *"yes just add things as I say, the complete flow is going to change, don't worry about it."* PENDING APPROVALS runtime ripple decision and music re-timing both cleared — to be reconciled in a final pass once individual scenes are locked. Steve's behavior: when a scene change creates downstream ripples (timing, master timeline totals, music peaks), I do NOT flag them as decisions to make right now. I lock the scene as the user wants it, note the inconsistency in the master timeline, and let it stand. Total flow gets one reconciliation pass at the end.
- **v1.22 · 2026-05-06** · **🎯 Scene-by-scene rule activated. Scene 1 + Scene 2 finished per user direction.** New scene-by-scene working rule locked in memory: ONE scene at a time, no wholesale restructures unless explicitly asked. **Scene 1 changes:** typing slowed (1fpc → 2fpc for "Feeling", 0.85fpc → 1.5fpc for "overwhelmed?"); cursor onset extended (4f → 8f); pause between phrases extended (2f → 6f); held-silence at end extended; trimmed to its 0–180 budget (logo/morph beats removed — now Scene 2's territory). **Scene 2 fully rewritten per user direction "iphone with the kiva app opening":** replaces the v1.21 logo→iPhone morph storyboard. Phone fades in already-existing, viewer sees iOS home screen with Kiva app icon highlighted, cursor taps icon, iOS app-launch expand animation, brand-lockup splash (Kiva chevron + **"Kiva." wordmark added per user** + tagline), splash dissolves into dashboard with "All your admin. One place." Extended Scene 2 to 90 frames (was 60) for anticipation. **Runtime impact:** +30 frames pushes total runtime to 33s (Scenes 3–10 unshifted in this turn — see 🚦 PENDING APPROVALS for the ripple decision).
- **v1.21 · 2026-05-06** · **🎬 Full v1.21 beat-by-beat from user — locked verbatim.** User delivered a complete shot-by-shot spec including locked specifics: quote example *John Smith / bathroom leak repair / £180 labour + £100 materials = £280 total*; receipt example *Plumbing Supplies £46.20* with tags *Materials / Bathroom Leak Repair / John Smith / Tax-ready*; map pins *Leak Repair / Boiler Check / Quote Visit / Follow-Up*; *32 min saved today*; AI assistant query *"What job made me the most money this week?"* answered with *Bathroom repairs — £1,840 revenue* + supporting cards *Highest Margin / Fastest Payment / Most Repeat Customers*; dashboard text *"All your admin. One place."*; final tagline pair *"Run smarter. Earn more." / "Download Kiva"*. Logo reveal tagline *"Blue collar solutions to blue collar problems"* RESTORED (was wrongly cut in v1.20). Mrs. Patel loop-closure callback CUT. Cursor (not thumb) clicks the logo. Receipt → expense classification feature is back in (was wrongly cut in v1.20). **Runtime extended 27s → 32s (960 frames)** because the user's content tally landed at ~30–32s. Master timeline §5 rewritten as 8 scenes per user's beats. **§6 per-scene specs fully rewritten verbatim from user's spec.** Music prompt §4.6.2 re-timed for the new 32s arc with peaks at 0:04.5 (overwhelm climax), 0:14.5 (£280 stamp), 0:28 (£1,840 reveal — biggest), with hard silence 0:05.2–0:05.6 preserved. **Music gate now ⏸ AWAITING REVIEW again** for the re-timed prompt. Steve's behavior rule reaffirmed: subtraction by default, but when user gives a SPECIFIC complete spec, lock it verbatim — don't paraphrase or "improve."
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
| Total duration | **32.0 s = 960 frames** (locked v1.21) |
| Stack | Remotion 4 · React 19 · TypeScript |
| Project root | `/Users/nolancarey/Desktop/KivaADS/remotion/` |
| Studio command | `npm start` (from `/remotion`) |
| Build command | `npm run build` |

**Norm — suggested file structure** (you own the final architecture, this is just a starting point):

```
remotion/src/
  Root.tsx                 ← register one composition: KivaAd, 960 frames
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

## 5. Master timeline (v1.21 — 32s, 10 beats, transformation chain)

| # | Scene | Time | Frames | Duration | Beat |
|---|---|---|---|---|---|
| 1 | **Overwhelm** | 0:00 – 0:06 | 0 – 180 | 6.0s | Notification cluster + "Feeling overwhelmed?" typing (slowed v1.22) + held silence at end |
| 2 | **Swipe-up + centered brand + bubble-pill + wordmark-collapse + logo-enlarge + sparkle orbits + 4-feature TYPED+ACTIVE-STATE constellation w/ 90% OVERLAP cadence + iPhone** | 0:06 – 0:13.2 | 180 – 396 | 7.2s | Vertical swipe-up clears → silence → CENTERED brand lockup → bubble-textured tagline pill expands/inflates with bubble-pop SFX, holds with iridescent edge + sparkle particles + text breathing synced to highlight sweep, then pops out as "Kiva." wordmark COLLAPSES into itself → logo (chevron) ENLARGES to take center stage → AI sparkle emerges from enlarged logo → orbits w/ wobble dropping 4 features at organic INLINE positions (icon-LEFT, slightly larger, closer to logo) at **28f each (v1.36 extended)**: 🎙 mic→red recording UI w/ "Quote for a standard toilet refit" drifting / 👤 mic→profile→scrolling customer details / 🗺 sequenced pin1→pin2+line→drifting addresses / 🤝 AI avatar+bubble+typing dots→"Hi John..." message→sent state. All persist. → constellation collapses → vortex → logo cross-fades into iPhone → dashboard with "All your admin. One place." (v1.36) |
| 3 | **Dashboard reveal** | 0:08 – 0:11.5 | 240 – 345 | 3.5s | Blue light sweep down screen → dashboard fades in → "All your admin. One place." → mic pulse |
| 4 | **Voice → Quote** | 0:11.5 – 0:15 | 345 – 450 | 3.5s | Mic expands → waveform → voice input live (John Smith / bathroom leak / £280) → text morphs to Quote card → £280 total counts up |
| 5 | **Quote → Customer profile** | 0:15 – 0:17 | 450 – 510 | 2.0s | Quote card expands fullscreen → morphs to Customer profile → fields auto-fill → "Customer Created" badge |
| 6 | **Receipt → Expense** | 0:17 – 0:20 | 510 – 600 | 3.0s | Receipt sweeps in → scan line → "Plumbing Supplies / £46.20" detected → tags snap on → "Tax-ready" hold |
| 7 | **Map → Route** | 0:20 – 0:23 | 600 – 690 | 3.0s | Expense lines bend into roads → map expands fullscreen → 4 pins drop → route draws + reorganises → "32 min saved today" |
| 8 | **Pin → Follow-up** | 0:23 – 0:26 | 690 – 780 | 3.0s | Camera into one pin → quote status card "Quote sent — no response" → AI types follow-up → sends → "Follow-up sent" |
| 9 | **AI Business Assistant** | 0:26 – 0:30 | 780 – 900 | 4.0s | Sent bubble morphs to AI search bar → query "What job made me the most money this week?" → cards shimmer → main card "Bathroom repairs — £1,840 revenue" expands |
| 10 | **Final hero shot** | 0:30 – 0:32 | 900 – 960 | 2.0s | UI collapses back → full floating iPhone → logo → "Run smarter. Earn more." / "Download Kiva" → 2-second hold |

**Total:** 32.0 s = 960 frames @ 30 fps. Cinematic system §3.7 inherits everywhere.

---

## 6. Scene-by-scene breakdown

### Scene 1 — Cold open: Notification overwhelm
**Time:** 0:00.0 – 0:06.0 (frames 0–180) · **v1.22: trimmed to overwhelm-only per v1.21 boundary; logo/morph moved to Scene 2 (now "iPhone + Kiva app opening")**
**Goal:** In 6 seconds, make the viewer feel the daily admin chaos of being a UK tradesperson, with "Feeling overwhelmed?" hanging in the air at the end.
**Setting:** Cinematic environment per §3.7 — navy→black gradient backdrop active from frame 0. No phone in this scene; phone enters in Scene 2. Camera drift baseline is on. Vignette + AI glow halo are off until Scene 2.

**Beat-by-beat:**

| Range (s) | Frames | Action |
|---|---|---|
| 0:00.0–0:00.8 | 0–24 | **First ping.** Hero iMessage card (460×110 px) slides in from bottom-left toward the central cluster zone. Scale 0.6 → 1.18 (overshoot) → 1.15 (settle). **Lands at (900, 540), -3° rotation, settle frame 24.** Card content: blue iMessage chrome, sender *"Mrs. Patel"*, text *"u still coming tomorrow?"*. **Audio:** `notication1.mp3` at **frame 22** (= settle - 2 frames). Sub-bass phone-vibration loop starts at frame 0 (low rumble, -18 dBFS, continues through 156). |
| 0:00.8–0:01.4 | 24–42 | **Hero hold (18 frames).** Mrs. Patel card holds alone, centered, fully readable. No new motion. Subtle ambient breathing: the card itself drifts down 0.2 px/frame and pulses opacity 1.0 → 0.97 → 1.0 once (sells "this matters, read me"). Vibration rumble continues. **This is the curiosity hook** — the viewer reads "u still coming tomorrow?" and asks "what about it?" before chaos answers. |
| 0:01.4–0:02.7 | 42–82 | **Stack begins (4 cards, 10-frame intervals).** Cards cascade into the central 900×500 cluster zone, each with ~10-frame travel time:<br>**(a) F42→F52** — red missed-call banner (600×100) *"Missed call (3) — John (boiler)"* enters top-right edge, lands at **(1180, 400)**, -2° rotation. Ding `notifcation2.mp3` **frame 50**.<br>**(b) F52→F62** — WhatsApp green bubble (460×110) *"boiler still leaking mate"* enters from left, lands at **(740, 600)**, +3°. Ding `notication1.mp3` **frame 60**.<br>**(c) F62→F72** — email card (540×160) *"HMRC: VAT return due in 3 days"* enters bottom-right, lands at **(1100, 720)**, -1°. Ding `notifcation2.mp3` **frame 70**.<br>**(d) F72→F82** — calendar pop (460×120) *"Job at 8AM — Hammersmith"* enters top, lands at **(920, 380)**, +2°. Ding `notication1.mp3` (pitch +2 semitones) **frame 80**. |
| 0:02.7–0:04.0 | 82–120 | **Density build (7 cards, 6-frame intervals).** Rapid-fire into the same tight central cluster, each overlapping previous cards by 20–40%. Travel time per card shortens to ~8 frames:<br>• F82→F90: Stripe banner (480×120) *"Invoice #0421 overdue — 47 days"* lands **(1020, 480)**, +1°. Ding F88.<br>• F88→F96: Google review card (480×130) *"New 1-star review — respond?"* lands **(1180, 540)**, -2°. Ding F94.<br>• F94→F102: iMessage (460×110) *"can u do it cheaper?"* lands **(820, 700)**, +3°. Ding F100.<br>• F100→F108: Screwfix email (480×130) *"Your parts order has shipped"* lands **(980, 360)**, -1°. Ding F106.<br>• F106→F114: voicemail card (480×120) *"You have 4 new messages"* lands **(760, 480)**, +2°. Ding F112.<br>• F112→F120: banking alert (480×120) *"Direct debit failed"* lands **(1140, 660)**, -3°. Ding F118.<br>• F118→F124: generic prompt (460×110) *"Quote follow-up?"* lands **(940, 580)**, +1°. Ding F122.<br>**Audio:** alternate `notication1.mp3` and `notifcation2.mp3` per card with ±2 semitone pitch shifts for chaos texture. `riser.mp3` starts at **frame 75**, building under everything through frame 156. By frame 124 the cluster is dense and centrally-stacked but the frame edges stay visually quieter — focus stays locked on the center pile. |
| 0:04.0–0:04.3 | 120–128 | **Cursor onset (v1.22 — extended for anticipation).** A white text cursor (4 × 80 px block, white at 60% opacity) appears at frame center (960, 540 in 1920×1080) and begins blinking — 15 frames on, 15 frames off cycle. Cursor renders above all cards (z-top). 8 frames of cursor pulsing alone before any text — the viewer's eye locks on, anticipation builds. |
| 0:04.3–0:05.7 | 128–172 | **Typing animation (v1.22 — slowed for deliberate pacing).** Text types in character-by-character. Font: system bold, ~96 px, white at 95% opacity, anchored center. Significantly slower than v1.6 — the deliberate pacing is the whole point.<br>• **F128–142 (14f):** "Feeling" types in (7 chars at ~2 frames per char). Cursor moves with the leading edge.<br>• **F142–148 (6f):** suspended pause — cursor blinks twice, no new text. The space between "Feeling" and "overwhelmed?" is where the question hangs.<br>• **F148–168 (20f):** " overwhelmed?" types in (13 chars at ~1.5 frames per char).<br>• **F168–172 (4f):** question mark scale-pulse (1.0 → 1.05 → 1.0) — the "?" is the emotional payoff and gets the kinetic punch.<br>• Behind the text, all notification cards continue their slow "sediment drift" downward (1.5 px/frame, 8% opacity loss/frame).<br>• Camera does a slow 1.0 → 1.04× scale push-in over the full F128–F180 range.<br><br>**Typing audio (sparse, every-other character):** soft `click.mp3` at **25% volume** every other char during typing — roughly F130, F134, F138, F142 ("Feeling"), then F150, F154, F158, F162, F166 ("overwhelmed"). Final question-mark click at **F170** at **40% volume, +1 semitone pitch shift** for emphasis. Cursor blink is silent. Typing audio sits *under* the `riser.mp3` build — riser is dominant. |
| 0:05.7–0:06.0 | 172–180 | **Held silence — the question hangs (v1.22 — extended).** Full text "Feeling overwhelmed?" sits center, fully visible. Cursor continues blinking after the "?" — the tail. All notification motion freezes mid-drift. **Audio: dings audibly compress and lowpass (muffled, underwater); `riser.mp3` peaks at F172 and sustains at peak; vibration deepens.** The cursor blink is the only living motion in this beat. The viewer is suspended in the question for ~0.27s before Scene 2 takes over. **Scene 1 ends here at F180** — Scene 2 picks up the swoosh and brand reveal. |

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

### Scene 2 — Swipe-up + centered brand lockup + tagline pill + AI sparkle orbits logo + 4-feature flash + enter app
**Time:** 0:06.0 – 0:13.2 (frames 180–396 · 7.2s · 216 frames) · **v1.38: 90% OVERLAP cadence supersedes v1.37 delays — feature N+1 starts when feature N's text-typing hits 90% (~15f into N's window). Continuous overlapping flow.**

> 📌 **v1.26 user direction (2026-05-07):** *"keep Kiva logo centralised. Originally have 'blue collar solutions for blue collar problems' text visible — make it pop, in a bubble/pill that pops and disappears. Then the kinetic text we talked about CIRCLES the central Kiva logo."*
>
> Kept from v1.24: AI Sparkle as the Director + declarative Jobber-voice copy ("Speak quotes." / "Save customers." / "Drive less." / "Win more jobs.") + kinetic typography style (verb small / outcome HUGE with scale punch + purple underline).
> Changed from v1.24: logo NO LONGER glides to top-right — it stays centered. Tagline now lives in a glassmorphism pop-in pill (not a fade-up sub-line). The 4 features ORBIT the centered logo at clock positions (12/3/6/9) instead of scattering to corner quadrants. iPhone materializes by replacing the logo at center.

**Beat-by-beat (v1.26):**

| Range (s) | Frames | Action |
|---|---|---|
| 0:06.0–0:06.4 | 180–192 | **SWIPE-UP WIPE.** Vertical sweep from bottom of frame upward (1800 px/s). Notification cluster + "Feeling overwhelmed?" text + cursor all drag UP off the top with motion-blur trails. Background: clean navy → black cinematic gradient. **Audio (Phase 3 to refine):** upward-lift swoosh — `swoosh.mp3` pitched +1st with reverse-tail flavor. |
| 0:06.4–0:06.6 | 192–198 | **Silence beat.** Pure dark navy gradient, empty frame. **Audio: COMPLETE SILENCE.** |
| 0:06.6–0:07.2 | 198–216 | **Centered brand lockup fades up.** Two elements appear in staggered sequence at the visual center of the frame (~960, 540):<br>• **F198–F208:** **Kiva chevron logo** fades in (scale 0.9 → 1.0, spring damping 14). Anchored as the CENTRAL focal point for the entire sequence.<br>• **F206–F216:** *"Kiva."* wordmark below the logo (gap 14 px) — Inter_600SemiBold ~36 px, white, **trailing period in `#3B82F6`** per §7 logo spec.<br>Subtle radial blue glow `rgba(59,130,246,0.3)` blur 60 px behind the lockup. **Logo + wordmark stay centered for the entire sequence — they do not glide, do not move.** Audio: soft `impact2.mp3` at 30% vol on F198 (logo land). |
| 0:07.2–0:07.6 | 216–228 | **🫧 Tagline pill EXPANDS in below the wordmark — bubble-inflating motion (locked v1.30, v1.36 extended 9f → 12f for more dramatic inflate).** A glassmorphism pill (rounded rectangle, full pill radius — `border-radius: 999px`) materializes ~22 px below the "Kiva." wordmark with a confident bubble-style expansion:<br>• **Pill chrome:** `<GlassPlate>` variant — `bg: rgba(255,255,255,0.10)`, `backdrop-filter: blur(24px) saturate(160%)`, `border: 1px solid rgba(255,255,255,0.18)`, soft shadow. Padding 10 px vertical / 22 px horizontal.<br>• **Pill content:** *"Blue collar solutions to blue collar problems"* — Inter_500Medium ~16 px, white at 95% opacity.<br>• **EXPAND animation (v1.30 — replaces simple POP):** the pill starts as a tiny seed (scaleX 0, scaleY 0) and **expands OUTWARD like a real bubble inflating**:<br>  · F0–F3 (3f): rapid horizontal expansion first — scaleX 0 → 1.20 (slightly wider than rest), scaleY 0 → 0.6 (catching up). The pill widens as if filled with breath.<br>  · F3–F5 (2f): vertical catch-up — scaleY 0.6 → 1.20. Brief moment where pill is BIGGER than rest in both dimensions (the "fully inflated overshoot").<br>  · F5–F9 (4f): elastic settle to scale 1.0 with subtle horizontal-then-vertical bounce (spring damping 11, mass 0.7 — bouncier than standard POP_IN).<br>  · The text inside fades up from 0 → 1 opacity during F4–F8 (so the pill is fully inflated before the text becomes legible).<br>• **Tiny visual flourish at peak inflation (F4):** ~6 micro-particles puff outward from the pill edges (like the burst of air a bubble releases when it pops in).<br>**Audio (v1.30 user direction):** **bubble-pop SFX synced to the expansion peak (F3–F4)** — a satisfying "boop" / soap-bubble pop. Phase 3 to source: candidate is a new ElevenLabs prompt `bubble_pop_inflate` (~0.5s, "soft satisfying bubble pop with quick air-burst tail") OR pitched-up `impact2.mp3` at 25% with a layered short whoosh. Steve adds the new ElevenLabs SFX entry in Phase 3 SFX_QUEUE if user wants the bespoke version. |
| 0:07.6–0:08.4 | 228–252 | **Pill holds with bubble texture + synced expansion (locked v1.31, v1.36 extended 15f → 24f — gives the viewer time to actually read the tagline at a comfortable pace).** The pill is now treated visually as a real soap bubble, not just a glass pill. Layered effects:<br>• **Bubble texture (continuous):** iridescent edge gradient — subtle rainbow tint shifting blue → purple → soft pink → blue around the pill's border at ~5% opacity (`background-clip: padding-box` + a thin gradient ring). Plus **2–3 tiny sparkle particles** scattered on the bubble surface, twinkling on/off independently (each sparkle: 2 px white dot, scale 0 → 1 → 0 over 30 frames, randomized phase per sparkle). Plus a second soft highlight reflection on the bottom-left of the pill (~12% white, `border-radius` matching, 30% pill width) — the natural bubble's underside reflection.<br>• **Highlight sweep + text-div expansion (synced):** a diagonal highlight gradient (`linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.20) 50%, transparent 70%)`) sweeps left → right across the pill over the full 15 frames. **As the sweep travels, the text div inside the pill EXPANDS slightly** — scale 1.0 → 1.04 → 1.0, peaking exactly when the highlight is at horizontal center of the pill. The expansion follows the highlight position via `interpolate(frame, [225, 232, 240], [1.0, 1.04, 1.0])`. Reads as the bubble "breathing" — the highlight's surface tension pushes the text outward briefly. Subtle, premium, alive.<br>• Logo + "Kiva." behind/above remain centered, untouched. **15-frame hold lets the tagline land emotionally.**<br>Audio: ambient drone underbed only — no hits. |
| 0:08.4–0:08.6 | 252–258 | **🫧 Pill POPS out + "Kiva." wordmark COLLAPSES into itself (locked v1.34, v1.36 extended 3f → 6f for more deliberate exit).** Two simultaneous exits:<br>• **Pill:** scales 1.0 → 0.85 → 0 over 6 frames (reverse pop — slower compression so the wordmark collapse can match) with opacity fade 1 → 0. Brief sparkle particle burst (~6 particles) dissolves outward.<br>• **"Kiva." wordmark:** collapses into itself — scale animates from 1.0 → 0.6 horizontally + 1.0 → 0.4 vertically (sucking inward toward its own center, like being absorbed into the trailing period). Opacity fades 1 → 0. Wordmark fully gone by F258. Audio: layered soft "puff" + faint reverse-pop. |
| 0:08.6–0:09.0 | 258–270 | **Logo (chevron) ENLARGES to take center stage (locked v1.34, v1.36 extended 3f → 12f — much more dramatic, the logo claims the moment alone for a real beat).** With the wordmark gone, the Kiva chevron logo scales up to take the freed space — scale 1.0 → 1.4 over 12 frames using easeOutCubic with subtle anticipation (overshoot 1.45 then settle 1.4). The chevron is now the dominant central element. Subtle radial blue glow `rgba(59,130,246,0.4)` blur 80 px intensifies behind it. **The logo is now alone center-stage** — centered, larger, glowing — for a full ~0.4s beat before anything else happens. Audio: soft "swell" tone (Phase 3). |
| 0:09.0–0:09.4 | 270–282 | **AI sparkle emerges from the enlarged logo (locked v1.32, v1.36 extended 6f → 12f for slower more deliberate birth).** Purple `<SparkleLoader>` (8-petal, ~60 px) materializes inside/over the now-larger Kiva chevron — fades in opacity 0 → 1 over 12 frames with a gentle scale-up 0.6 → 1.0. The sparkle then begins ORBITING clockwise outward from the logo, beginning its circular path. Subtle purple glow `rgba(109,40,217,0.5)` blur 40 px around it. **The sparkle is born from the enlarged logo** — visually says "this is Kiva's brain at work, awakening." Audio: soft sparkle chime sustained over the 12-frame entrance. |
| 0:09.4–0:11.8 | 282–355 | **🌀 4-feature flash — 90% OVERLAP cadence (locked v1.38 — supersedes v1.37 delays).** User direction: *"as a continuation of this version, I want the kinetic text to finish the anim to get 90% of the way through and then the next kinetic text starts."* When feature N's text-typing reaches 90% completion, feature N+1's full 28f animation begins. This creates a continuous overlapping cadence — Feature N's icon-transform + drift onset run IN PARALLEL with Feature N+1's sparkle-dart + icon line-draw + typing. Total feature-flash section: 73f (was 130f in v1.37) — much tighter, but each feature's animation still gets its full 28f to play out. ALL FEATURES PERSIST.<br><br>**v1.34 layout — icon LEFT, text RIGHT, INLINE, slightly LARGER, CLOSER to centered logo.** Each feature is a HORIZONTAL linear composition:<br>`[ icon, ~56 px, vertically centered with text block ] ←gap 28px→ [ verb (small, ~36 px) / OUTCOME (huge, ~72 px) ]`<br>Icon anchored at the LEFT of the feature block; text aligns left starting after the gap. Internal padding 12 px around each feature composition. Whole block rotated by the per-feature degree (v1.29 rotations preserved). **Sizes ~12% larger than v1.33** — verb 32→36 px, outcome 64→72 px, icon 48→56 px, gap reduced 32→28 px (more compact, more visual punch). **Positions pulled CLOSER to the centered logo** — distance now ~250–296 px (was 340–389 px in v1.33).<br><br>**v1.32 text reveal change — text TYPES IN char-by-char (was: scale-punch stamp).** Verb types first (small, Inter_400Regular ~32 px white at 80%, ~1.3 frames per char), then a 1-frame breath, then the outcome word (HUGE, Inter_700Bold ~64 px white) types in. Final character of the outcome word lands with a scale punch (1.0 → 1.08 → 1.0). Period animates as a separate beat with 1-frame delay. Purple underline draws in left-to-right beneath the outcome word over 3 frames after typing completes. Sparse soft `click.mp3` at 18% vol on every other character (consistent with §3.6.4 typing audio rule).<br><br>**Per-feature pacing (28f animation each — overlap cadence: feature N+1 starts when feature N's text-typing hits 90%, ~15 frames into feature N's window):**<br>F0–F2 (2f): sparkle darts along orbit toward the landing position (motion blur trail)<br>F2–F6 (4f): sparkle pulses bright; **icon LINE-DRAWS in** on the LEFT side of the feature block<br>F6–F16 (10f): **text TYPES IN char-by-char to the right of the icon** — verb (~4f at 1f/char) → 1f breath → outcome word (~5f at 1f/char) with final-char scale punch<br>**🆕 v1.38: at relative F15 (90% of text typing = 9 of 10 chars in), feature N+1's animation begins** — sparkle visually splits/respawns and starts orbit dart toward the next feature's position while feature N's icon transform is still playing. Continuous flow.<br>F16–F22 (6f): **icon TRANSFORMS** into ACTIVE app-state form (this happens AS feature N+1 is doing its sparkle dart + icon line-draw — overlapping motion)<br>F22–F28 (6f): **drift content begins** + first cycle (this happens as feature N+1 is text-typing — more overlapping motion). Drift loop continues running alongside the icon's persistent micro-motion while the feature persists on screen.<br>**No inter-feature delay** — supersedes v1.37's 6f gap. The overlap IS the breath; the previous feature's late-stage micro-motion + the next feature's early-stage entrance happen in parallel, creating a constant flow of activity.<br><br>**Per-feature ACTIVE-STATE icon transforms + drifting content:**<br><br>**🎙 Feature 1 — F282–F310 animation: position ~(975, 290), distance ~252 px, rotation +2°, icon-LEFT composition** — *"Speak. Get a"* + ***"quote."*** *(verb-typing F288–F292, outcome-typing F293–F298 — 90% complete at **F297** → Feature 2 starts at F297)*<br>**Icon: microphone → red active-recording UI** (matches real Kiva app's recording state — reference `screens/VoiceQuote/index.js`). Mic line-draws F284–F288 on the LEFT. F298–F304: mic morphs into the **red recording state** — small red record-dot pulses, waveform bars oscillate as if catching voice. F304–F310: drifting spoken text rises and fades — ***"Quote for a standard toilet refit"*** (Inter_400Regular ~11 px, white at 70% opacity, single line, 16 px padding, drift up at 0.8 px/frame). After F310 the icon's mic pulse + drift loop continue indefinitely while Features 2–4 are happening.<br><br>**👤 Feature 2 — F297–F325 animation: position ~(1175, 525) (v1.37 — pulled LEFT 70 px so "profile." text doesn't clip the right frame edge), distance ~217 px, rotation -2.5°, icon-LEFT composition** — *"Voice fills the"* + ***"profile."*** *(verb-typing F303–F307, outcome-typing F308–F313 — 90% complete at **F312** → Feature 3 starts at F312)*<br>**Icon: microphone → profile silhouette → small scrolling customer-detail tape (locked v1.35).** Mic line-draws F299–F303 on the LEFT (deliberate visual rhyme with Feature 1). F313–F319: mic morphs INTO a profile/person silhouette; silhouette fills with soft purple from bottom up F316–F319. F319–F325: a **small scrolling tape of customer details** emerges — tiny vertical scroll rolling upward: ***"Annie Yang"*** → ***"07700 900123"*** → ***"Notting Hill, London"*** (Inter_400Regular ~11 px, white at 70% opacity, single-line each, vertical scroll at 0.8 px/frame). After F325 the detail scroll loop continues indefinitely while Features 3–4 are happening. **Anchor convention:** position = LEFT edge of icon; composition extends rightward.<br><br>**🗺 Feature 3 — F312–F340 animation: position ~(945, 805), distance ~265 px, rotation -1.5°, icon-LEFT composition** — *"AI optimises the"* + ***"route."*** *(verb-typing F318–F322, outcome-typing F323–F328 — 90% complete at **F327** → Feature 4 starts at F327)*<br>**Icon: pin pops up → second pin + line draws between them (locked v1.35).** Sequenced pin entry:<br>• F314–F316 (2f): **first pin** pops up at the LEFT edge — line-draws with overshoot bounce.<br>• F316–F318 (2f): first pin pulses once.<br>• F318–F322 (4f): **second pin** pops up + glowing gradient line `#3B82F6 → #6D28D9` DRAWS between them in sync.<br>• F328–F334: both pins pulse; line glows. F334–F340: 2–3 light particles flow along the line. Drifting address text rises + fades: ***"Hammersmith"*** → ***"Notting Hill"*** → ***"Fulham"*** (Inter_400Regular ~11 px, white at 60% opacity, single-line each). After F340 continuous particle flow + address drift loop indefinitely while Feature 4 is happening.<br><br>**🤝 Feature 4 — F327–F355 animation: position ~(665, 570), distance ~296 px, rotation +3°, icon-LEFT composition** — *"AI writes the"* + ***"follow-up."*** *(verb-typing F333–F337, outcome-typing F338–F343)*<br>**Icon: AI avatar + message bubble + typing dots → message streams in → sent (locked v1.35).** Two-element icon composition (avatar far-left, bubble next to it):<br>• **AI avatar** — small purple-gradient circle (~28 px) with subtle sparkle "face" inside. Appears F329–F331 with soft fade-up + spring scale 0 → 1.05 → 1.0.<br>• **Message bubble** — small chat bubble (rounded rect with tail toward avatar). Appears F331–F333.<br>• **Typing dots "..."** — three dots in the bubble, wave animation. Active F333–F343 — "AI is typing" indicator.<br>• **Message types in** — F343–F349: typing dots fade, actual message streams: ***"Hi John, just following up..."*** (Inter_400Regular ~11 px, white at 70% opacity, single-line).<br>• **Sent state** — F349–F351: paper-airplane emits up-right + tiny green check `#15803D` stamps in.<br>• **Continuous loop after F355:** avatar pulses gently, bubble inner shimmer, green check faint glow. By F355 all 4 features are visible simultaneously around the enlarged centered logo. Constellation collapse begins at F355.<br><br>**Style rules (apply to all 4):**<br>- Icon line-art style: stroke ~3 px, white at 95%, with subtle purple glow `rgba(109,40,217,0.4)` blur 12 px underneath<br>- Active-state morph stays line-art-friendly — only the relevant accent (red for recording, green for accepted, purple for AI processing) gets a fill<br>- Drifting content text: Inter_400Regular, small (~12-14 px), low opacity (55-70%), drift direction = upward with subtle outward, fade to 0 over 12-18 frames<br>- All 4 icons + drifting content keep continuous micro-motion in parallel while the feature persists — by F328 the constellation is alive on every clock position<br><br>**Constellation layout — features orbit the centered (now enlarged) logo, organic variation, INLINE composition (icon-left + text-right), pulled CLOSER to the center logo with SLIGHTLY LARGER elements (locked v1.34 — user direction "text and symbols being inline and closer to the center icon and slightly larger").** NOT a perfect 12/3/6/9 clock face. Each feature is a HORIZONTAL LINEAR COMPOSITION: icon on left, text on right, vertically centered together.<br><br>**Per-feature visual stack (vertical, anchored at the clock position):**<br>1. **Icon** (~48 px, line-style, white stroke ~3 px with subtle purple glow underneath, animated per the feature's meaning — see below)<br>2. *Verb* (small, Inter_400Regular ~32 px white at 80%)<br>3. ***Outcome word.*** (HUGE, Inter_700Bold ~64 px white, scale punch on entry, soft purple underline ~3 px below)<br><br>**🎙 Feature 1 — F252–F260: ~12 o'clock-ish (above logo, slightly right of dead-center) — position ~(985, 235), distance from center ~310 px, text-block rotation +2°** — *"Speak. Get a"* + ***"quote."***<br>**Icon: microphone → recording animation.** A line-style microphone icon appears (~48 px). Then concentric sound-wave arcs emanate outward from the mic in a rhythmic pulse, like real voice recording. F0–F2: mic line-draws in (stroke draws on). F2–F4: 3 expanding waveform arcs (each fades in then out as the next launches). F4–F8: continuous gentle pulse — subtle 1.0 → 1.05 scale on the mic body + waveform arcs loop softly. **Once placed, the mic continues this gentle pulsing while the feature persists** — the whole orbital constellation feels "alive."<br><br>**👤 Feature 2 — F260–F268: ~3 o'clock-ish (right of logo, slightly higher than horizontal) — position ~(1305, 510), distance from center ~346 px, text-block rotation -2.5°** — *"Voice fills the"* + ***"profile."***<br>**Icon: person silhouette → fills + check-stamp.** A line-style person icon appears (~48 px, head + shoulders outline). F0–F2: silhouette outline draws on. F2–F4: silhouette FILLS with soft purple from bottom up (like a meter filling) — the "AI is capturing the contact." F4–F6: small green check `#15803D` stamps in at the upper-right corner of the figure. F6–F8: continuous gentle glow on the check. **Visually says:** *"the customer is recognized and saved."*<br><br>**🗺 Feature 3 — F268–F276: ~6 o'clock-ish (below logo, slightly left of dead-center) — position ~(940, 880), distance from center ~341 px, text-block rotation -1.5°** — *"AI optimises the"* + ***"route."***<br>**Icon: 2 pins + route → optimization morph.** Two location pins appear (~16 px each, ~80 px apart). F0–F2: pins drop in. F2–F4: a wavy/zigzag dotted route draws between them (the "old way" — long, inefficient). F4–F6: route MORPHS — the wavy line snaps into a shorter, near-straight optimized path with subtle gradient `#3B82F6 → #6D28D9`. F6–F8: 2–3 small light particles flow along the optimized route. **Continuous:** light particles keep flowing along the route while the feature persists. **Visually says:** *"AI rerouted you to drive less."*<br><br>**🤝 Feature 4 — F276–F284: ~9 o'clock-ish (left of logo, slightly lower than horizontal) — position ~(620, 570), distance from center ~341 px, text-block rotation +3°** — *"AI writes the"* + ***"follow-up."***<br>**Icon: speech bubble → paper airplane → checkmark stamp.** A line-style chat bubble appears (~36 px). F0–F2: bubble line-draws on. F2–F4: a paper-airplane icon flies up-and-right out of the bubble (motion blur trail). F4–F6: brief beat where airplane exits frame, then a large check `#15803D` stamps into the bubble's center (scale 0 → 1.15 → 1.0 spring). F6–F8: brief celebratory pulse on the check. **Continuous:** subtle glow halo on the check while feature persists. **Visually says:** *"AI sent the follow-up, the customer accepted, you won the job."*<br><br>**Icon style rules (apply to all 4):**<br>- Line-style (stroke-only, no solid fills except the per-feature transform moments described above — silhouette filling for #2, route gradient for #3, check stamp for #2 and #4)<br>- Stroke ~3 px, color white at 95% opacity<br>- Subtle purple glow `rgba(109,40,217,0.4)` blur 12 px UNDER the icon (matches the kinetic-typography purple underline aesthetic — ties the icon to the AI signal)<br>- Each icon's transformation animation lands within ~6 frames; the remaining ~2 frames of the per-feature 8f window are continuous "alive" motion<br>- Once placed, **all 4 icons keep their continuous motion in parallel** while the feature stays on screen — viewer sees a constellation of 4 micro-animations + the centered logo + sparkle. Lots of life, no dead pixels.<br><br>**By F284 the viewer sees:** centered Kiva logo + "Kiva." wordmark + 4 features (each = icon + text) arrayed at clock positions like satellites + the sparkle still orbiting + every icon continuously animating its own meaning. This is the *constellation moment* — every AI feature radiating its action from the brand at center. **Hold this constellation visible for a beat (F284 → vortex begins F286).**<br><br>**Audio (Phase 3 to refine):** 4 sparkle chimes at burst frames (F254, F262, F270, F278), each pitched +1 semitone higher. |
| 0:11.8–0:12.2 | 355–365 | **Constellation collapses — sparkles vortex to center.** All 4 feature texts + icons + drifting content dissolve simultaneously into purple particles (synchronized at F357), particles + sparkle spiral inward toward the enlarged centered logo (~60 particles total). Orbit-trail dissolves. Camera zooms slightly 1.0× → 1.05×. Audio: filtered shimmer rising over 10 frames. |
| 0:12.2–0:12.7 | 365–381 | **Logo dissolves into iPhone.** Enlarged Kiva chevron fades opacity 1 → 0 over 12 frames (F365–F377) AS the 3D iPhone fades up in the same center position over 16 frames (F365–F381). Cross-fade — brand mark becomes device. iPhone resting tilt rotateY -6°, rotateX +3°. Soft blue rim lighting + glass reflections. AI glow halo at idle. Audio: `iphone_morph_whirr.mp3` over 16 frames. |
| 0:12.7–0:13.2 | 381–396 | **Dashboard appears.** Phone display shows the Kiva dashboard (mic FAB visible, bottom nav, top header). At F385 small bottom-center text fades in: *"All your admin. One place."* (Inter_400Regular ~10 px, white at 70% opacity). Camera drift continues. **Hands off to Sequence 3 at F396.** Audio: soft "app loaded" chime. |

**Phase 3 audio note:** detailed per-frame audio cues will be reconciled in Phase 3 (sound finalization). For now, this scene's audio direction is: swoosh-up → silence → logo-land impact → ambient drone underbed → pill pop in/out → sparkle entrance chime → 4 ascending chimes (one per feature, +1 semitone each) → vortex shimmer → iPhone whirr → dashboard chime.

---

### Scene 3 — Dashboard reveal + mic zoom
**Time:** 0:08.0 – 0:11.5 (frames 240–345 · 3.5s · 105 frames)

> 📌 **Verbatim from user's storyboard.**

**PHONE:** Front-facing. Centered slightly right of frame.

**VISIBLE UI ONLY:**
- Create Quote
- Customers
- Jobs
- AI Mic Button

**DO NOT clutter dashboard.**

**CAMERA:** Slow zoom toward microphone button.

**MIC BUTTON:** Subtle blue pulse every 1 second.

**LIGHTING:** Soft ambient glow from screen.

---

### Scene 4 — Voice → Quote transformation
**Time:** 0:11.5 – 0:15.0 (frames 345–450 · 3.5s · 105 frames)

> 📌 **Verbatim from user's storyboard, with the user's three sub-timings preserved.**

**0:11.5 – 0:12.2 (F345–F366) — Mic expands.**
Camera zooms directly into microphone button. The microphone expands outward into circular AI interface. Background UI softly blurs. Waveform appears.
**TEXT:** *"Tell Kiva what you need…"*
**POSITION:** Centered above waveform.

**0:12.2 – 0:13.8 (F366–F414) — Voice input appears live.**
**TEXT APPEARING:** *"Create a quote for John Smith — bathroom leak repair — £280 labour and materials."*

**Important highlights** — as these words appear, they briefly enlarge, glow blue, pulse softly:
- John Smith
- bathroom leak repair
- £280

**CAMERA:** Slow zoom toward £280.

**0:13.8 – 0:15.0 (F414–F450) — Text transforms into quote card.**
The spoken words detach and magnetically move into structured fields.

**QUOTE CARD:**
- John Smith
- Bathroom Leak Repair
- Labour: £180
- Materials: £100
- **TOTAL: £280**

The total counts upward: £0 → £280. Blue glow pulse on completion.

**HOLD for 0.7 seconds.**

---

### Scene 5 — Quote → Customer profile
**Time:** 0:15.0 – 0:17.0 (frames 450–510 · 2.0s · 60 frames)

> 📌 **Verbatim from user's storyboard.**

**Quote card expands:**
Quote card lifts slightly toward viewer. Expands fullscreen. Customer name field stretches horizontally. Morphs into customer profile header.

**CUSTOMER PROFILE SCREEN — visible fields:**
- John Smith
- Phone Number
- Address
- Plumbing
- Linked Quote

**FIELDS AUTO-FILL:** One at a time. Smooth magnetic movement.

**CAMERA:** Slow pan from top-left down toward linked quote.

**SUCCESS STATE:** Blue checkmark appears.

**TEXT:** *"Customer Created"*
**POSITION:** Top-right floating success badge.

**Hold briefly.**

---

### Scene 6 — Receipt → Expense
**Time:** 0:17.0 – 0:20.0 (frames 510–600 · 3.0s · 90 frames)

> 📌 **Verbatim from user's storyboard.**

A receipt card sweeps in from right side. The customer profile gets pushed away naturally.

**RECEIPT:** Centered.

**SCAN LINE:** Blue glowing scan line moves downward.

**TEXT DETECTED:**
- *"Plumbing Supplies"*
- *"£46.20"*

**CAMERA:** Zoom into £46.20 briefly. Then: receipt shrinks into organized expense panel.

**TAGS ATTACH:**
- Materials
- Bathroom Leak Repair
- John Smith
- Tax-ready

Each tag magnetically snaps onto receipt.

**IMPORTANT:** Hold briefly on *"Tax-ready"*. Blue glow pulse.

---

### Scene 7 — Map → Route
**Time:** 0:20.0 – 0:23.0 (frames 600–690 · 3.0s · 90 frames)

> 📌 **Verbatim from user's storyboard.**

**TRANSITION:** Expense rows compress into lines. Lines bend into roads. Dark cinematic map expands fullscreen.

**MAP PINS DROP:**
- Leak Repair
- Boiler Check
- Quote Visit
- Follow-Up

Each pin drops with subtle bounce.

**CAMERA:** Slight map tilt for depth.

**ROUTE LINE:** Glowing blue line draws dynamically between pins. Then: route rearranges itself intelligently.

**IMPORTANT:** Camera follows route line movement.

**RESULT CARD:** Slides upward.
**TEXT:** *"32 min saved today"*
The number counts upward smoothly.

**HOLD briefly.**

---

### Scene 8 — Pin → Follow-up
**Time:** 0:23.0 – 0:26.0 (frames 690–780 · 3.0s · 90 frames)

> 📌 **Verbatim from user's storyboard.**

Camera zooms into one map pin. Pin expands into quote status card.

**TEXT:** *"Quote sent — no response"*

The card morphs into messaging interface. **AI TYPING INDICATOR** appears.

**MESSAGE TYPES:** *"Hi John, just following up on the bathroom repair quote. Happy to answer any questions."*

The send button glows softly. Message sends upward smoothly.

**SUCCESS STATE:** *"Follow-up sent"*. Blue confirmation checkmark.

**Hold briefly.**

---

### Scene 9 — AI Business Assistant
**Time:** 0:26.0 – 0:30.0 (frames 780–900 · 4.0s · 120 frames)

> 📌 **Verbatim from user's storyboard.**

The sent message bubble stretches horizontally. Morphs into AI assistant search bar.

**QUERY:** *"What job made me the most money this week?"*

Dashboard cards shimmer softly.

**MAIN CARD EXPANDS:** *"Bathroom repairs — £1,840 revenue"*

**SUPPORTING CARDS:**
- Highest Margin
- Fastest Payment
- Most Repeat Customers

**CAMERA:** Slow push toward main revenue card.

**HOLD.**

---

### Scene 10 — Final hero shot
**Time:** 0:30.0 – 0:32.0 (frames 900–960 · 2.0s · 60 frames)

> 📌 **Verbatim from user's storyboard.**

All UI smoothly collapses back into Kiva dashboard. Camera zooms back outward. Full floating iPhone visible again.

**BACKGROUND:** Dark cinematic gradient. Soft floating particles.

**PHONE:** Slow rotation. Soft blue rim lighting. Realistic reflections.

**KIVA LOGO appears below.**

**FINAL TEXT:**
*"Run smarter. Earn more."*
*"Download Kiva"*

**TEXT POSITION:** Centered beneath device.

**FINAL HOLD:** 2 full seconds minimum. Allow the frame to breathe.
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


## 7. Acceptance criteria for Norm

This ad is "done" when:

1. ✅ All 10 scenes render at 1920×1080 / 30 fps / **960 frames total = exactly 32.0 s** (v1.21).
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
