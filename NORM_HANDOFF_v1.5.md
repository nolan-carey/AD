# Norm → Steve handoff · KivaADS v1.5 baseline

**Authored by Norm (Master Programmer) · 2026-05-07 · channeled via user**

---

## Why this doc exists

Per user direction, **everything currently in the code is now collectively v1.5** — a clean baseline reset.
v1.0 → v1.43 is sealed; future revisions start at v1.6.

This is a holistic snapshot of the *as-built* state for Steve to absorb before authoring v1.6+. It is not a creative directive — it's a code-state report so Steve can plan the next direction with full context.

---

## 1. Master timeline (as-built)

`remotion/src/tokens.ts` — current values:

| Scene | `from` (abs F) | `duration` | Notes |
|---|---|---|---|
| 1 — Overwhelm | 0 | 240 | Locked. 18 cards. |
| 2 — Brand + AI feature flash | 240 | 351 ⚠️ | **STALE.** See §3 — actual Scene 2 content extends to ~F764 abs. |
| 3 — Dashboard reveal | 591 | 105 | v1.21 spec, untouched |
| 4 — Voice→Quote | 696 | 105 | v1.21 spec, untouched |
| 5 — Quote→Customer | 801 | 60 | v1.21 spec, untouched |
| 6 — Receipt→Expense | 861 | 90 | v1.21 spec, untouched |
| 7 — Map→Route | 951 | 90 | v1.21 spec, untouched |
| 8 — Pin→Follow-up | 1041 | 90 | v1.21 spec, untouched |
| 9 — AI Business Assistant | 1131 | 120 | v1.21 spec, untouched |
| 10 — Final hero | 1251 | 60 | v1.21 spec, untouched |

`TOTAL_FRAMES = 1338` (= 44.6s @ 30fps).

⚠️ **Known timeline bug** — Scene 2's internal `SCENE_END` (local 524) far exceeds its sequence allotment (383 frames including crossfades). Scene 2 is over-running into Scene 3's territory. Needs reconciliation in v1.6 — either bump `scene2.duration` to ~512 and shift Scenes 3–10 +161, or compress Scene 2 features back to fit.

---

## 2. Scene 1 — locked v1.5 (per user direction)

**Frame budget:** F0–F240 (8.0 s).

### Cluster — 18 cards
- **Card 1 (hero)** Mrs. Patel iMessage, lands F24, 18 f hero hold to F42
- **Cards 2–12** (stack + density, 8 f cadence): John missed call F42, Dave WhatsApp F58, HMRC email F66, Calendar F74, Stripe overdue F82, Google review F90, Tom iMessage F98, Screwfix F106, Voicemail F114, Lloyds Bank direct debit F122, Reminder follow-up F130
- **Cards 13–18 (v1.40 density-build, 5 f cadence)** lands F128–F153:
  - 13 Lloyds card payment £147.32 — Wickes (F128)
  - 14 Becca "did u get my message?" iMessage (F133)
  - 15 Mr. Harrison voicemail (F138)
  - 16 Hiscox public liability email £487 (F143)
  - 17 **Mrs. Patel "any update on the quote?"** ← visual rhyme with hero (F148)
  - 18 Calendar gas safety cert (F153)

### Card chrome — flat dark fill, NOT glassmorphism
- `<NotificationCard>` overrides `GlassPlate`'s backdrop-filter: **`backdropFilter: "none"`** explicitly disabled
- Background: linear gradient `rgba(40,55,80,0.78)` → `rgba(20,30,50,0.82)` (faux-glass static fill)
- Inner top highlight (1 px white at 22 %) + inner bottom shadow + outer drop-shadow
- **Reason:** live `backdrop-filter` recomputed every frame across all 18 cards as the cinematic-wrapper drift moved them — reads as an abrupt "BG flip" the viewer perceives at any motion onset. Dropped per user direction.
- **All 12 variants** have a colored left accent strip (iMessage, WhatsApp, Phone, Email, Calendar, HMRC, Google, Stripe, Screwfix, Voicemail, Banking, Generic). Icon labels shortened to 1–2 chars and centered (`alignItems: "center"`).

### Drift — REMOVED
- `drift = 0; driftOpacity = 1;` — cards stay frozen at landing positions
- Earlier compressed-drift attempts (F153 → F162) were pulled because user observed the synchronized backdrop-filter recompute at F153 as too abrupt (this was before the backdrop-filter was removed; see above)
- "Weight of overwhelm" emotional metaphor now lives entirely in **density** + **audio crescendo**

### Typing onset — F162 (was F192)
- `CURSOR_APPEAR = 154` (8 f after last card lands)
- `TYPE_START = 162`, "Feeling" types F162–F174 at 2 f/char
- 6 f pause F174–F180
- " overwhelmed?" types F180–F200 at ~1.67 f/char
- "?" lands F200, scale-pulse F200–F204
- Held silence F204–F240 (36 f / 1.2 s breath into Scene 2)
- **`SCENE_END = 240`** (unchanged)

### Audio — climactic ramp on cards 13–18
Volume curve was reversed:
| Card | Old (fading out) | New (climactic ramp) |
|---|---|---|
| 13 | 0.42 | **0.55** |
| 14 | 0.395 | 0.62 |
| 15 | 0.37 | 0.70 |
| 16 | 0.345 | 0.77 |
| 17 | 0.32 | 0.85 |
| 18 | 0.295 | **0.92** |

Pitch curve also reversed — ascending semitones for rising tension:
| Card | Old pitches | New pitches |
|---|---|---|
| 13–18 | -3, +3, -2, +1, -1, 0 (scattered) | **-1, 0, +2, +3, +4, +5** (ascending) |

So the chaos audibly *peaks* right before "Feeling overwhelmed?" types in. No more plateau.

---

## 3. Scene 2 — current as-built state (calling this v1.5)

**Frame budget per `tokens.ts`:** F240 + 351 = F591 (allotted).
**Actual content per Scene 2 file:** local F0 → F524 = ~F744 abs. Over-runs by ~150 f. ⚠️

**Sequence boundary:** Scene 2's `<Sequence from>` is `scene2.from - 20 = 220` (extended Scene 1→2 crossfade from 12 f → 20 f). Local F0 = abs F220.

### Beat-by-beat (local frames)

| Phase | Local F | Abs F | Status |
|---|---|---|---|
| Crossfade-in from Scene 1 | 0–20 | 220–240 | 20 f fade-in |
| Swipe-up wipe | 12–20 | 232–240 | Compressed (was 24, now 20) |
| Hard silence | 20–30 | 240–250 | |
| **Logo entry** (entry-spring 0.9→1.0) | **23–35** | **243–255** | v1.42 -7 f shift |
| Wordmark "Kiva." enter | 38–48 | 258–268 | unchanged |
| **Logo slow continuous grow** (1.0 → 1.45, ease-in-out-quad) | **33–100** | **253–320** | v1.5 NEW: 67 f slow grow |
| Pill inflate | 48–60 | 268–280 | v1.30 bubble-inflate |
| Pill hold (faux-glass + iridescent + shimmer) | 60–92 | 280–312 | 32 f hold |
| Pill pop-out + wordmark collapse | 92–98 | 312–318 | -4 f earlier (was F96 in v1.41) |
| **Logo down-scale 1.45 → 1.30** | **100–118** | **320–338** | v1.5 NEW: 18 f visible "breath" |
| **Logo settle 1.30 → 1.40** | **118–128** | **338–348** | rebound |
| Sparkle entrance (emerges from logo) | 114–126 | 334–346 | 12 f fade-in + scale-up |
| **F1 starts** 🎙 mic→red recording | 126–221 | 346–441 | **95 f window** |
| **F2 starts** 👤 mic→person→tape | 203–298 | 423–518 | 95 f, +77 f stagger |
| **F3 starts** 🗺 sequenced pins+route | 280–375 | 500–595 | 95 f |
| **F4 starts** 🤝 AI avatar+bubble→sent | 357–452 | 577–672 | 95 f |
| Constellation hold | 452–453 | 672–673 | 1 f hold (essentially none) |
| Vortex | 452–468 | 672–688 | 16 f |
| Phone materialize + logo cross-fade | 468–490 | 688–710 | 22 f |
| Dashboard ("All your admin. One place.") | 490–524 | 710–744 | 34 f |

⚠️ **Scene 2 effectively runs 524 local frames** = ~17.5 s. tokens.ts says 11.7 s. **Mismatch needs Steve's call.**

### Per-feature 95 f window (v1.5 sequential reveals)
Stagger increased from 35 f → 44 f → **77 f**, so each feature now FULLY COMPLETES before the next starts (no overlap):
- t 0–2: sparkle dart
- t 2–6: icon line-draws (4 f)
- t 6–22: verb types (16 f at 2.5 fpc)
- t 22–25: 3 f breath
- t 25–44: outcome types (19 f); poof SFX at outcome final char
- t 43: period appears
- t 44–47: underline draws
- t 44–50: icon transforms to ACTIVE state
- t 50–60: drift content cycle onset
- **t 60–95: drift continues + kinetic-text float idle (35 f tail before next feature begins)**

### Logo expansion curve (v1.5 lock — user direction)
1. **Entry spring** F23–F35: scale 0.9 → 1.0 (`SPRING.soft`)
2. **Slow continuous grow** F33–F100: 1.0 → **1.45** (eased w/ `EASE.inOutQuad`, 67 f)
3. **Down-scale** F100–F118: 1.45 → **1.30** (`EASE.outCubic`, 18 f) ← visible "breath"
4. **Settle** F118–F128: 1.30 → 1.40 (`EASE.outCubic`, 10 f rebound)
5. **Locked** at 1.40 from F128 through phone materialize
6. **Fades** F468–F484 as iPhone fades up

### Wordmark "Kiva." — collapses synced with pill pop-out
- Enters F38–F48
- Stays centered the whole brand phase
- Collapses F92–F98 (scaleX 1→0.6, scaleY 1→0.4, opacity 1→0, transform-origin right-center so it "absorbs into the period")

### Tagline pill (v1.30 + v1.31 + v1.42 textures)
- Bubble-inflate: scaleX widens first, scaleY catches up, elastic settle
- Hold-beat texture: rotating iridescent border (rainbow @ 5 %), 3 phased surface sparkles, bottom-left underside highlight, diagonal sweep + breathing scale 1.0→1.04→1.0 synced
- Pop-out: scale 1.0→0.85→0 + 6 air-release particles
- **GlassPlate's `backdrop-filter` IS still active here** (only Scene 1 cards dropped it)

### Constellation positions (v1.34 + v1.41 F2 fix)
| Feature | Position | Distance from logo | Rotation |
|---|---|---|---|
| F1 🎙 | (975, 290) | 252 px | +2° |
| F2 👤 | **(1255, 510)** | 296 px | -2.5° |
| F3 🗺 | (945, 805) | 265 px | -1.5° |
| F4 🤝 | (665, 570) | 296 px | +3° |

Wobbly orbit trail (SVG quadratic-bezier loop through the 4 organic positions, blue glow per v1.39).

### Per-feature active-state icons (v1.35 — preserved)
- 🎙 **F1**: line-art mic → red recording UI (matches Kiva VoiceQuote screen: red core, stop square, pulse rings, waveform bars). Drift: single-line phrase *"Quote for a standard toilet refit"* @ 11 px / 70 % / 0.8 px-frame, looping continuously.
- 👤 **F2**: mic (visual rhyme with F1) → person silhouette → fills purple → small scrolling tape *"Annie Yang"* / *"07700 900123"* / *"Notting Hill, London"* (continuous loop above icon).
- 🗺 **F3**: sequenced pins (pin1 with overshoot → 2 f beat → pin2 + glowing gradient line) → activated state with flowing particles. Drift: address cycle *Hammersmith / Notting Hill / Fulham*.
- 🤝 **F4**: purple AI avatar (radial-gradient circle with rotating sparkle "face") + chat bubble → typing dots → message types in *"Hi John, just following up..."* → blue paper-airplane fires + green check-stamp.

### Kinetic typography (v1.32 onward — preserved)
- Verb (small, 32 px Inter 400 @ 80 %)
- Outcome (HUGE, 72 px Inter 700 @ 100 %), period in **`COLOR.aiPurple`**
- Blue underline draws beneath outcome word after typing completes
- v1.41 kinetic float: post-poof xy sine drift on text-block (±2 px X / ±1.5 px Y, per-feature phase offsets 0°/90°/180°/270°)

### Palette (v1.39 — preserved)
**Purple is reserved EXCLUSIVELY for AI signals:**
- AI sparkle (the orbiting mark)
- F4 AI avatar
- AIGlow component for active-state phone halo
- Period accents in outcome words

**Everything else is blue:** icon glows, underlines, F2 profile fill, F3 route gradient, sparkle bursts mix white+purple (was all-purple), vortex particles ~50/50 white+purple.

### Audio (v1.40 — preserved)
- Per-character typing clicks REMOVED
- **One "poof" SFX per outcome word landing** (4 total). Currently `swoosh.mp3` pitched 0.7 / 35 % vol as placeholder until ElevenLabs `kinetic_text_poof` is generated (Phase 3).
- Sparkle chimes at each feature's burst frame (ascending +1 semitone each).

---

## 4. Components — what's locked

| Component | Status |
|---|---|
| `NotificationCard` | v1.5: faux-glass fill, no backdrop-filter, all 12 variants have colored accent strips, icon labels shortened ("iM", "Ph", "M"), `alignItems: center` |
| `GlassPlate` | unchanged — still uses backdrop-filter (used by Scene 2 pill which DOES recompute, but that's a single element + is intentional iridescent texture) |
| `KivaLogo` | unchanged |
| `PhoneFrame` | unchanged (v1.22 3D + drift) |
| `AIGlow` | unchanged (idle blue / active purple, 12 f crossfade between) |
| `CinematicWrapper` | unchanged (gradient bg, noise, vignette, perspective, drift) |
| `SfxAt` | unchanged |

---

## 5. Tech state

- `@remotion/effects@4.0.459` installed (`blur`, `halftone`, `tint`, `wave` available — none used yet in scenes)
- npm install permissions auto-allowed in `.claude/settings.local.json`
- `HAS_MUSIC_BED = false` (user-stripped — only dings + typing clicks + poof SFX in the mix)
- All ElevenLabs SFX present in `/public/sound/generated/` from v1.18 generation runs

---

## 6. ⚠️ Open issues for Steve to address in v1.6

1. **Scene 2 timeline bug.** `tokens.ts` says Scene 2 = 351 f but `SCENE_END` constant inside Scene 2 = 524 (local) = needs scene2.duration ≈ 512 OR feature window compression. Steve must call: extend the master timeline (+~160 f, pushes Scenes 3–10 to ~F753+ with TOTAL ~1495) OR compress per-feature window from 95 f back toward ~70 f.
2. **Scenes 3–10 still on v1.21 spec.** None have been touched since the original storyboard lock. They render but use the v1.21 verbatim beats. Steve will likely want to revisit each as the feature-flash creative is now more sophisticated than what the per-scene specs assume.
3. **`kinetic_text_poof` SFX** still unsourced. Currently `swoosh.mp3` placeholder. Phase 3 ElevenLabs generation pending.
4. **`NotificationCard` backdrop-filter dropped.** Steve should know this trade-off in case future scenes want true glassmorphism on cards — current Scene 1 cards use a static faux-glass gradient + inner highlight, NOT live blur.
5. **Music bed** still disabled. Any v1.6 music direction needs the prompt re-timed for the actual Scene 2 length once #1 is reconciled.

---

## 7. What HASN'T changed (still locked from earlier specs)

- Cinematic system §3.7 (3D phone, gradient world, glow halo, glassmorphism on phone-relative overlays, drift, magnetic motion, morph-not-cut)
- Atoms / molecules from `kiva_components_for_norm.md`
- 8-card phase D structure (though most scenes haven't been re-touched)
- v1.4 §4.5 SFX prompt set + Phase C generation pipeline
- v1.13 cinematic camera language

---

## 8. Norm's read on current state (subjective)

**Strengths:**
- Scene 1 pacing finally feels right: tight density build with audio crescendo into a cleanly-anticipated "Feeling overwhelmed?" hook
- Scene 2 brand phase is genuinely cinematic now — slow logo swell + visible breath at F320–F338 + wordmark→logo transition reads as deliberate craft
- Per-feature creative content (icons + active states + drift) is working
- Palette discipline (purple = AI only) is paying off — the constellation reads structured rather than monochromatic-purple-overload

**Risks / fragile bits:**
- Scene 2's **sequence-vs-content length mismatch** is a ticking bomb (item #1 above)
- Sequential 95 f per feature × 4 = 380 f of flash, plus 130 f of pre-feature brand setup, plus ~80 f of vortex/materialize/dashboard = **~590 f total** for what tokens says is 351 f. Math doesn't compute.
- The 20 f Scene 1→2 crossfade was set on the assumption of a shorter Scene 2; if Scene 2 grows further, the crossfade may need to move
- Scenes 3–10 are stale — when Steve revisits, the spec will likely conflict with the polished v1.5 brand-phase aesthetic

---

**Locked baseline.** Anything in this doc + the current code on `main` (HEAD = `2fadf4c` plus uncommitted v1.42b/v1.43 polish + v1.5 status) is **v1.5**. v1.6 begins from here.

Steve — when you're ready, pick the issue (#1 is the priority) and fire a directive. Norm awaits.
