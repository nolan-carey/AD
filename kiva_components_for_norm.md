# Kiva Components for Norm
**Mock-component spec for the Remotion ad · authored by Steve · sourced from real Kiva codebase**

> **Why this doc exists:** Reference PNGs in `/ReferenceImages/*.PNG` are visual targets, not scene assets (see `ad_plan.md` §3.5). For animations to feel real, Norm must build faithful React-component recreations of the actual Kiva UI inside `/remotion/src/components/`. This file gives Norm the anatomy, tokens, and Remotion translations for every component the ad needs.
>
> **Source of truth:** `/Users/nolancarey/kiva/Frontend/` (real React Native code).
> **Design spec:** `/Users/nolancarey/kiva/DESIGN.md` (identical to `ad_plan.md` §3 tokens).

---

## 1. Translation philosophy: React Native → Remotion (web React)

Norm's render environment is **Remotion (web React)**, not React Native. The real Kiva app uses RN primitives. Translate as follows:

| React Native primitive | Remotion equivalent |
|---|---|
| `<View style={...}>` | `<div style={...}>` |
| `<Text style={...}>` | `<span style={...}>` (or `<div>` for block text) |
| `<Image source={...}>` | `<img src={staticFile(...)}>` |
| `StyleSheet.create({})` | Plain JS object literal `const styles = { ... }` |
| `Animated.View` + `Animated.spring/timing` | Remotion `spring()` / `interpolate()` driving CSS `transform` / `opacity` |
| `useNativeDriver: true` | n/a — Remotion is frame-driven, no native bridge |
| `paddingVertical`, `paddingHorizontal` | `padding: '11px 0'` etc. — split or use shorthand |
| `flex: 1` | `flex: 1` — works the same in modern CSS flexbox |
| `flexDirection: 'row'` | `display: 'flex', flexDirection: 'row'` |
| Inter font via `@expo-google-fonts` | Load `Inter` from Google Fonts via Remotion's `loadFont` |
| `expo-haptics` (haptic feedback) | n/a — visual ripple only |

**Pixel values are identical.** RN density-independent pixels at logical iPhone 15 dimensions (393×852 pt) translate 1:1 to web pixels — Norm renders the phone canvas at 393×852 and CSS-scales the wrapper to fit the 1920×1080 ad frame.

**Inter font setup (do this once):**
```tsx
import { loadFont } from '@remotion/google-fonts/Inter';
const { fontFamily } = loadFont('normal', { weights: ['400', '500', '600', '700'] });
// then in any text style:
fontFamily,  // becomes 'Inter, sans-serif'
```

---

## 2. Token reference (locked — matches `ad_plan.md` §3)

> The real Kiva app's `theme/colors.js` matches our `tokens.ts` exactly. Use the same `tokens.ts` Norm already built for the ad. Do not invent new colors.

Verified from `/Users/nolancarey/kiva/Frontend/src/theme/colors.js`:

```js
primary:        '#0F172A',  // navy
accent:         '#3B82F6',  // blue
surfaceDark:    '#1E293B',  // dashboard cards
ai:             '#6D28D9',  // AI purple
background:     '#F8FAFC',
surface:        '#FFFFFF',
border:         '#E2E8F0',
divider:        '#F1F5F9',
textSecondary:  '#64748B',
textTertiary:   '#94A3B8',
paid: '#22C55E', paidBg: '#DCFCE7', paidText: '#15803D',
pending: '#F59E0B',
overdue: '#EF4444', overdueBg: '#FEE2E2', overdueText: '#B91C1C',
sent: '#3B82F6', sentBg: '#DBEAFE', sentText: '#1D4ED8',
aiPoweredBg: '#EDE9FE',
accepted: '#15803D', acceptedBg: '#F0FDF4',
draft: '#64748B', draftBg: '#F1F5F9',
navActive: '#3B82F6', navInactive: '#94A3B8',
```

**Typography (from `theme/Typography.js`):**

| Role | Font | Size | Weight | Color |
|---|---|---|---|---|
| screenTitle | Inter_600SemiBold | 13 | 600 | navy |
| statNumber | Inter_700Bold | 18 | 700 | white |
| jobName | Inter_600SemiBold | 11 | 600 | navy |
| lineItemLabel | Inter_400Regular | 9 | 400 | textSecondary |
| fieldLabel | Inter_600SemiBold | 9 | 600 | navy |
| caption | Inter_400Regular | 8 | 400 | textTertiary |
| sectionHeader | Inter_600SemiBold | 8 | 600 | textTertiary, uppercase, letter-spacing 0.6 |
| buttonPrimary | Inter_600SemiBold | 11 | 600 | white |
| aiBadge | Inter_500Medium | 9 | 500 | ai |
| navLabel | Inter_400Regular | 9 | 400 | varies |

---

## 3. Animation primitives — the motion vocabulary

Real Kiva uses RN's built-in `Animated` API (see `/Users/nolancarey/kiva/Frontend/src/components/UndoToast.js`). Translate to Remotion's `spring()` and `interpolate()`. **These are the canonical motion presets — every animation in the ad should use one.**

### 3.1 The 6 motion presets

| Preset | Use for | Remotion config | Visual feel |
|---|---|---|---|
| **`POP_IN`** | Cards, badges, items appearing | `spring({ frame, fps, config: { damping: 14, mass: 0.8, stiffness: 220 } })` | Bouncy entrance, slight overshoot |
| **`SOFT_LAND`** | Sheets, modals rising | `spring({ frame, fps, config: { damping: 18, mass: 1.1, stiffness: 160 } })` | Smooth, no overshoot — premium |
| **`QUICK_TAP`** | Button press, ripple expand | `interpolate(frame, [0, 6], [1, 0.96, 1], { extrapolate: 'clamp' })` over 8 frames | Brief scale-down + rebound |
| **`FADE_RISE`** | Toasts, banners, hint text | `opacity 0→1` over 6f + `translateY 8→0` (spring damping 16) | Subtle, professional |
| **`PULSE_IN`** | Mic ring, AI processing rings | Loop `scale 0.85→1.0` + `opacity 0.15→0` over 60 frames (2s) | Calm, breathing |
| **`STATUS_FLIP`** | Status badge transitions (Sent → Accepted) | Cross-fade old→new bg over 8f + scale 1.0→1.06→1.0 spring | Pattern interrupt for state change |

### 3.2 Easing reference

For `interpolate()` calls, default to:
- `easing: Easing.out(Easing.cubic)` for landings
- `easing: Easing.inOut(Easing.cubic)` for camera moves
- Linear (default) for progress bars and scan lines

### 3.3 Always-on rules

1. **Color = meaning.** Purple animations = AI is happening (sparkles, processing, generating). Navy = primary CTA / brand. Blue = AI-triggered action / FAB / live state. Don't break this.
2. **Sound on impact, not launch.** Every animation that needs audio fires the SFX **2 frames before settle** (the §6 Scene 1 v1.2 rule).
3. **Stagger lists.** When multiple items enter at once, stagger by 80–120 ms (3–4 frames). Slamming all-at-once feels cheap.
4. **Spring damping 14–18.** Below 12 = too bouncy / cartoonish. Above 22 = dead / no life. The Kiva product uses 14–18 across the board.

---

## 4. Phone interaction language

> The "user" is implicit in the ad — we never show a face, but we show their thumb interacting with the phone. **Every interaction must read as: "a real human did that."**

### 4.1 Thumb component spec

A reusable `<Thumb />` Remotion component. Used for every tap moment in scenes 1, 2, 3, 4, 6.

| Property | Value |
|---|---|
| Visual | Stylized thumb-tip silhouette in `rgba(255,255,255,0.9)` on dark scenes / `rgba(15,23,42,0.85)` on light scenes |
| Size | ~80 px diameter on the phone canvas |
| Position default | Enters from bottom-right of the phone screen, off-canvas |
| Travel duration | 8 frames from off-screen to target (266 ms) |
| Tap moment | A 4-frame compression: thumb-tip scales 1.0 → 0.92 → 1.0 over frames `tap`, `tap+1`, `tap+2`, `tap+3` |
| Ripple | Expanding circle from tap point, 0 → 80 px radius, opacity 0.4 → 0 over 12 frames; color matches the tapped element's accent |
| Exit | After ripple completes, thumb fades + translates back off-screen over 6 frames |
| Audio | `click.mp3` at the tap moment (frame `tap`), -3 dBFS |

**Norm: build `<Thumb x={...} y={...} tapAtFrame={...} />`** — the component manages its own travel-in, tap, ripple, and exit relative to `tapAtFrame`.

### 4.2 Tap targets per scene (the action map)

| Scene | Frame | Target | Effect |
|---|---|---|---|
| 1 | 198 | Logo center | Click ripple → logo Y-rotates → morphs to iPhone |
| 2 | 244 | Mic FAB (bottom-right of phone) | Ripple → AI Assistant sheet rises |
| 2 | 252 | "New voice customer" row in sheet | Highlight pulse → swap to New Customer sheet |
| 2 | 302 | "Save customer" button | Sheet dismisses, customer card lands in list |
| 3 | 432 | "Send quote →" button | Camera nudges down, paper-airplane fly-off |
| 4 | 540 | "Save expense" button | Sheet dismisses, expense card flies into list |
| 6 | (varies) | Quotes list row + AI Assistant rows | Highlight pulses |

### 4.3 Scroll behavior (use sparingly)

If a scene needs to show a scroll (e.g. a long quote review revealing all line items), implement as a smooth `translateY` over time, NOT a discrete jump. Easing: `easeInOutCubic` over 18–24 frames. No scrollbar visible — this is iOS, not desktop.

### 4.4 Sheet rise + dismiss (the canonical pattern)

Every modal/sheet in the ad uses the same physics so the product feels coherent.

**Rise:** `translateY` from `+sheetHeight` (off-screen below) to `0` (resting position) using **`SOFT_LAND`** preset. Duration: ~12 frames (400 ms). Audio: `swoosh.mp3` at frame 0 of rise, 60% vol.

**Dismiss:** `translateY` from `0` to `+sheetHeight` using `easeInCubic` over 8 frames (266 ms). Audio: `swoosh.mp3` at frame 0 of dismiss, 50% vol, pitch -1 semitone (descending feel).

**Backdrop:** semi-transparent `rgba(15,23,42,0.5)` overlay behind the sheet. Fades in 0→0.5 opacity in sync with the rise; fades out reverse.

**Sheet container:**
- bg `#FFFFFF`
- top corners `borderTopLeftRadius: 18, borderTopRightRadius: 18`
- shadow `0 -8px 24px rgba(0,0,0,0.12)`
- a 4×40 px gray pill handle (centered, 8 px from top) signals "draggable" — present even though we don't show drag in the ad

---

## 5. Component catalog

> Components grouped by complexity: **Atoms** (smallest reusable units) → **Molecules** (compositions of atoms) → **Organisms** (full screens / large surfaces). Each entry: source-file reference, anatomy, tokens, Remotion build hint.

### 5.0 Cinematic environment (v1.1 addition — required by `ad_plan.md` §3.7)

> These are NOT Kiva-product components — they're the **cinematic shell** the entire ad lives inside. Build these BEFORE the per-scene atoms in §5.1, since every scene composes inside them.

#### `<CinematicWrapper>` — top-level environment in `KivaAd.tsx`
- **Renders:** the navy→black gradient backdrop, animated noise texture, vignette, layered Z-depth context, and constant camera drift.
- **CSS:**
  - Outer: `width: 1920, height: 1080, perspective: 1500px, transformStyle: 'preserve-3d', position: 'relative'`
  - Background layer: `linear-gradient(135deg, #0F172A 0%, #000000 100%)`, full-frame, `Z=-100`
  - Noise overlay: a tiled noise SVG at `opacity: 0.015`, slowly translating `+0.3px/frame` (gentle texture drift)
  - Vignette: radial-gradient, transparent center → `rgba(0,0,0,0.25)` corners
- **Camera drift (always running, computed from frame):**
  - `translateX = sin(frame / 36) * 4`
  - `translateY = cos(frame / 30) * 2`
  - `rotateZ = sin(frame / 48) * 0.3`
- **Children render inside the perspective context** so 3D transforms on phone + overlays compose correctly.

#### `<AIGlow state="idle|active" />` — soft halo behind the phone
- **Anatomy:** a single absolutely-positioned div behind the phone. `width/height: 80% of phone size`, centered. `border-radius: 50%`. `filter: blur(80px)` (idle) or `blur(120px)` (active).
- **Color:**
  - `idle`: `background: rgba(59,130,246,0.35)` — blue
  - `active`: `background: rgba(109,40,217,0.40)` — purple
- **Transition:** crossfade over 12 frames via `interpolate`. Use Remotion `useCurrentFrame` + a `state` prop driven by scene logic (any AI moment activates).

#### `<GlassPlate>` — glassmorphism container for floating overlays
- **Use for:** notification cards in Scene 1, Focus Captions (§3.6), Mrs. Patel callback in Scene 7, any UI overlay that floats OUTSIDE the phone screen.
- **Do NOT use for:** UI inside the phone screen — those use opaque tokens normally.
- **CSS:**
  - `background: rgba(255,255,255,0.06)`
  - `backdrop-filter: blur(20px) saturate(140%)`
  - `WebkitBackdropFilter` for Safari/Chromium parity
  - `border: 1px solid rgba(255,255,255,0.12)`
  - `border-radius: 16` (overridable via prop for variant)
  - `box-shadow: 0 8px 32px rgba(0,0,0,0.4)`
- **Norm: existing `<NotificationCard>` (8 chrome variants) should compose `<GlassPlate>` as its container** — replace the existing solid card chrome with glass treatment. Keep the per-variant chrome accents (red bar for missed call, green for WhatsApp, etc.) as inner color washes.

#### `<PhoneFrame>` — UPDATED for 3D rendering
- Replaces the v1.0 spec.
- **Anatomy:** iPhone 15 chrome (rounded corners, dynamic island, status bar). Logical canvas 393×852 pt. The frame itself sits inside a 3D perspective context (provided by `<CinematicWrapper>`).
- **Props:**
  - `rotateY`, `rotateX`, `rotateZ` (degrees) — driven externally by the parent scene component to apply constant drift + scene-specific perspective shifts
  - `translateZ` (px) — for parallax control between scenes
  - `screenContent` — children rendered inside the screen bezel
- **Resting position** (default when no scene override applies): `rotateY: -6°, rotateX: +3°`. The phone is angled toward the viewer.
- **Constant drift** (computed from frame, layered ON TOP of any externally-set rotation):
  - `rotateY drift = sin(frame / 36) * 0.8`
  - `rotateX drift = cos(frame / 42) * 0.5`
  - `translateY drift = sin(frame / 30) * 3`
- **Inner glow:** the screen bezel has `box-shadow: 0 0 80px rgba(59,130,246,0.25)` — display itself acts as a light source bleeding into the surrounding navy environment.
- **Lighting illusion** (achieved via overlay gradients, no real 3D lights):
  - Top-left highlight: thin diagonal `linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 30%)`
  - Bottom-right rim: `linear-gradient(315deg, rgba(59,130,246,0.06) 0%, transparent 25%)`

#### Scene transition pattern — morph not cut

> **Replaces the old `<Series>` cut pattern.** Per `ad_plan.md` §3.7.4, scenes morph through the iPhone, not cut.

- Top-level `KivaAd.tsx` uses overlapping `<Sequence>` blocks (8–12 frame overlap) instead of `<Series>`.
- The **phone itself** is a single component that persists across the entire 900 frames; only its `screenContent` prop changes per scene.
- Scene transitions cross-fade the screen content (old scene 100→0 opacity, new scene 0→100, over 8–12 frames).
- During the overlap, an optional **transition sting** plays (see §4.5 P3 sounds: `transition_warm_whoosh`, `transition_sharp_impact`, `transition_glitch_cut`, `transition_soft_fade` — different sting per scene boundary for variety).
- The phone's `rotateY`/`rotateX` may shift slightly during the transition (a "perspective shift" — see §3.7.3 of `ad_plan.md`) — adds physicality.

---

### 5.1 Atoms

#### `<StatusBar />` — iOS chrome
- **Source:** synthesized (real app uses native iOS status bar)
- **Anatomy:** `flex` row, `space-between`, height 44 px. Left: time `9:41` Inter_600SemiBold 17 px navy. Right: signal-bars icon + wifi icon + battery icon, each 16 px navy or white depending on bg.
- **Build:** plain `<div>` with two children, transparent bg. Time is always `9:41` (Apple's standard mock time).

#### `<KivaLogo />`
- **Source:** `/Users/nolancarey/Desktop/KivaADS/ReferenceImages/logo.svg` (use directly — this is the legit asset)
- **Anatomy:** SVG. `viewBox 0 0 200 200`. Rounded square `radius 50` `fill: #1E293B` (or `#0F172A` for primary container). Two chevron halves: left `fill: #F8FAFC` (white), right `fill: #3B82F6` (blue).
- **Wordmark version:** "Kiva." next to or below the mark — Inter_600SemiBold, color matches bg context (white on dark, navy on light), trailing period in `#3B82F6`.
- **Forbidden:** stretching, recoloring the mark, removing the period, adding outline.

#### `<AIBadge />`
- **Source:** every AI screen topbar in real app
- **Anatomy:** `<span>` pill. bg `#EDE9FE`, padding `2px 7px`, radius 10. Text "AI powered" — Inter_500Medium 9 px, color `#6D28D9`. `align-self: flex-start`.

#### `<StatusBadge variant="sent|accepted|draft|paid|overdue|pending|ai" />`
- **Source:** `/Users/nolancarey/kiva/Frontend/src/theme/StatusBadges.js`
- **Anatomy:** `<span>` pill. padding `2px 7px`, radius 10, font 9px 500. bg + text color from the status table below.

| Variant | bg | text |
|---|---|---|
| paid | `#DCFCE7` | `#15803D` |
| sent | `#DBEAFE` | `#1D4ED8` |
| draft | `#F1F5F9` | `#64748B` |
| overdue | `#FEE2E2` | `#B91C1C` |
| pending | `#FEF9C3` | `#F59E0B` |
| ai | `#EDE9FE` | `#6D28D9` |
| accepted | `#F0FDF4` | `#15803D` |

**Animation hint:** for the Scene 6 Sent → Accepted transition, use the `STATUS_FLIP` preset (cross-fade bg + scale pulse over 8 frames).

#### `<SendMethodPill label="WhatsApp|Email|SMS" active={bool} />`
- **Source:** `/Users/nolancarey/kiva/Frontend/src/components/SendMethodPill.js`
- **Anatomy:** `<div>` pill. `min-width: 74`. Inactive: bg `#E2E8F0`, border `1px #CBD5E1`, text `#475569` 8px 500. Active: bg `#0F172A`, border same, text white. padding `4px 10px`, radius 20.

#### `<Button variant="primary|secondary|accent|danger" />`
- **Source:** `/Users/nolancarey/kiva/Frontend/src/theme/Buttons.js`
- **Anatomy (primary):** bg `#0F172A`, padding `11px 10px`, radius 10, min-height 44. Label Inter_600SemiBold 11 px white.
- **Anatomy (secondary):** bg `#FFFFFF`, border `1.5px #E2E8F0`, padding `9px 10px`. Label Inter_600SemiBold 10 px navy.
- **Animation:** on tap, `QUICK_TAP` preset (briefly compress 1→0.96→1).

#### `<FAB icon="mic" />`
- **Source:** `theme/Buttons.js` (`fab` style)
- **Anatomy:** circle `42 × 42 px`, radius 21. bg `#3B82F6` (accent blue, NOT navy — semantic: blue FAB = AI action). Shadow `0 4px 14px rgba(59,130,246,0.45)`. Centered icon: mic SVG 18 px white.

#### `<MicButton />` (the hero mic in voice flows)
- **Source:** Voice-to-quote screen, also New Customer sheet
- **Anatomy:** layered circles, all centered:
  - Outer ring 2: 110 px diameter, bg `rgba(59,130,246,0.08)`, **animated PULSE_IN** over 72 frames (2.4s loop)
  - Middle ring 1: 88 px diameter, bg `rgba(59,130,246,0.15)`, **PULSE_IN** over 60 frames (2s loop, offset 0.4s from ring 2)
  - Core: 64 px diameter, bg `#0F172A`, mic SVG 26 px white centered
- **Audio sync:** when active, `ai_hum_ambient.mp3` plays at -22 dBFS underbed.

#### `<SparkleLoader />` (used during AI processing)
- **Source:** real app's loader — 8-petal purple sparkle
- **Anatomy:** SVG with 8 radial petals around a center point. Each petal is a rounded rectangle 4×16 px in `#6D28D9` (top brightness) fading to `#C4B5FD` (bottom). The whole SVG rotates 360° clockwise over 60 frames (2s) on loop. Opacity wave: each petal cycles brighter as it passes 12 o'clock.

#### `<ProgressBar stages={['Transcribe', 'Generate quote']} active={number} />`
- **Source:** Transcribing / Generating screens (IMG_2419, IMG_2420)
- **Anatomy:** Two rounded bars side-by-side with 8 px gap. Each bar: 2 px tall, radius 1, bg `#F1F5F9` (track) + animated fill in `#6D28D9`. Below each bar: label Inter_500Medium 11 px `#6D28D9` if active, `#94A3B8` if inactive.

### 5.2 Molecules

#### `<NotificationCard variant="imessage|whatsapp|email|missed_call|hmrc|stripe|google|calendar|voicemail|banking|screwfix" />`
- **Source:** synthesized for Scene 1 (these are not Kiva UI — they're external notifications stacking on the home screen)
- **Common:** rounded card with shadow, slight border. Top row: leading icon + sender + tiny timestamp on right. Body: 1–2 lines of text.
- **Variant chrome (key visual differentiators):**
  - **imessage:** white card, blue iMessage icon (16px), sender name 11px 600 navy, body 11px 400 navy
  - **whatsapp:** white card, green WhatsApp icon (16px), sender name 11px 600 navy, body 11px 400 navy
  - **email:** white card, generic email icon (16px), "Mail" label tiny + sender, subject in 11px 600 + preview 10px gray
  - **missed_call:** RED gradient banner-style — bg `linear-gradient(90deg, #EF4444, #DC2626)`, white text "Missed call (3) — John (boiler)", phone icon
  - **hmrc:** white card with subtle yellow accent bar on left, "HMRC" 9px 600 yellow, body 11px navy
  - **stripe:** white card with Stripe-purple accent bar, "Stripe" 9px 600, "Invoice overdue" body
  - **google:** white card with Google-style 4-color G icon, "New 1-star review" body
  - **calendar:** white card with red calendar tear-off date, body
  - **voicemail:** white card, voicemail icon, "4 new messages"
  - **banking:** white card, bank icon, "Direct debit failed"
  - **screwfix:** orange-accented white card, "Your parts order has shipped"
- **Sizing:** see `ad_plan.md` §6 Scene 1 cluster geometry — varies by chrome (460×110 to 600×100 to 540×160).
- **Animation entry:** `POP_IN` preset with `landFrame` per the audio reference table.

#### `<RecentActivityRow avatar={initials} name={...} sub={...} amount={...} />`
- **Source:** Dashboard recent activity list
- **Anatomy:** `flex row`, padding `9px 11px`, divider `1px #F1F5F9` bottom. Left: `<Avatar />` 26 px circle. Middle: name (11 px 600 navy) + sub (8 px `#94A3B8`, may include "Voice quote" tag pill). Right: amount (11 px 600 navy).
- **Avatar palette:** see `/Users/nolancarey/kiva/Frontend/src/theme/avatarPalette.js`. Use deterministic per-name color.

#### `<StatCard label={...} value={...} valueColor={white|amber} />`
- **Source:** Dashboard navy header
- **Anatomy:** card `bg #1E293B`, radius 10, padding 10 px. Label: Inter_400Regular 8px `#64748B` (uppercase), mb 3px. Value: Inter_700Bold 18 px white (or `#F59E0B` for "Outstanding"). Used in 2×2 grid.

#### `<CustomerChip avatar={initials} name="Annie Y" color={dotColor} />`
- **Source:** Customers map view (top of screen, IMG_2417)
- **Anatomy:** rounded pill. White bg, border `1px #E2E8F0`. Inside: small colored dot (8 px circle in customer avatar color) + name (11 px 600 navy). padding `6px 12px`, radius 16.

#### `<MapPin avatar={initials} color={...} state="default|highlighted|black" />`
- **Source:** Customers map view (the actual pins)
- **Anatomy:** drop-pin shape (SVG path) with avatar circle inside the bulb.
  - Bulb: 36 px diameter circle in customer color (purple `#7C3AED` for AY, blue `#3B82F6` for NC, neutral / brown for SC, etc. — colors per `avatarPalette.js`)
  - Tip: triangle pointing down from bulb bottom, 10 × 12 px
  - Inside the bulb: 24 px white text initials Inter_700Bold
- **Variants:** `default` (full color), `highlighted` (slight scale 1.08, glow ring), `black` (Stan C is black bg in IMG_2417 — likely "selected" state)
- **Animation entry:** `POP_IN` preset, scale 0 → 1.15 → 1.0, with a circular ripple expanding from the tip.

#### `<FormField label={...} value={...} state="empty|filling|filled" />`
- **Source:** New Customer / New Quote / New Expense form fields
- **Anatomy:** label above (9 px 600 navy, mb 4 px). Input: bg `#FFFFFF`, border `1.5px #E2E8F0`, radius 8, padding 8 px, height 44 px. Placeholder text: 9 px `#94A3B8`. Filled text: 9 px navy.
- **States for animation:**
  - `empty`: default
  - `filling`: bg flashes to `#EDE9FE` (light purple) for 4 frames as text types in
  - `filled`: settled state with optional green check (14 px `#15803D` Lucide `Check` icon) on right edge
- **Animation:** when AI fills, `FADE_RISE` for the text + bg flash + check stamp (`POP_IN`).

#### `<LineItemRow label={...} qty={...} unitPrice={...} total={...} />`
- **Source:** Quote review line items table (IMG_2421)
- **Anatomy:** `flex row` with 4 columns: checkbox 14 px (left), label flex 2 (9 px `#64748B`), qty (9 px 500 navy, right-align), unitPrice (right), total (right). padding `3px 0`. Divider `0.5px #F1F5F9` bottom.
- **Animation entry:** stagger `POP_IN` from right, 100 ms apart, with a sparkle stamp on the leading edge as it lands.

#### `<TotalsRow type="subtotal|vat|total" label={...} value={...} />`
- **Source:** Quote review bottom (IMG_2421)
- **Anatomy:** flex row, label left + value right.
  - subtotal: 9 px `#94A3B8` / 9 px 500 navy
  - vat: 9 px `#64748B` / 9 px 500 navy
  - **total**: separated by `1.5px solid #0F172A` border-top, padding-top 7 px, label 11 px 700 navy, value 11 px 700 navy
- **Animation:** value counts up from 0 to target over 12 frames (use `interpolate` with rounding). Total row gets the `POP_IN` + the v1.3 white-flash pattern interrupt at frames 422–426.

#### `<AssistantOptionRow icon={...} iconBg={...} title={...} subtitle={...} />`
- **Source:** AI Assistant sheet (IMG_2410) — 5 rows
- **Anatomy:** flex row. Left: 36 px square with `radius 10` and `iconBg` color, containing white Lucide icon 18 px. Middle: title (12 px 600 navy) + subtitle (10 px `#94A3B8`). Right: chevron `ChevronRight` 14 px `#CBD5E1`.
- **Per-row colors (from real app):**
  - "New voice quote" — icon bg `#3B82F6` (blue), Mic icon
  - "New voice customer" — icon bg `#3B82F6` (blue), UserPlus icon
  - "See jobs on the map" — icon bg `#22C55E` (green), Map icon
  - "Follow up on a quote" — icon bg `#6D28D9` (purple), MessageCircle icon
  - "Job summary" — icon bg `#0F172A` (navy), FileText icon
- **Animation:** `FADE_RISE` per row, 4-frame stagger; highlight pulse on cycle = bg flashes `rgba(59,130,246,0.08)` for 280 ms.

#### `<ToastBanner variant="success|info|error" message={...} />`
- **Source:** Real app uses `<UndoToast>` (`/Users/nolancarey/kiva/Frontend/src/components/UndoToast.js`); for ad we use a non-interactive variant.
- **Anatomy:** flex row. bg `#0F172A` (or `#22C55E` for success). Padding `12px 14px`, radius 12, min-height 44. Left: status icon (16 px white, e.g. Check for success). Middle: message (13 px 500 white). Shadow `0 6px 12px rgba(0,0,0,0.25)`.
- **Animation:** `FADE_RISE` from above the phone screen + 16 px translateY, hold 30 frames, then fade out.

### 5.3 Organisms (full screens / large surfaces)

#### `<DashboardScreen state="empty|populated" />`
- **Source:** Dashboard real screen — see `/Users/nolancarey/kiva/Frontend/src/screens/Dashboard/index.js`
- **Anatomy (top to bottom):**
  - Navy header block (bg `#0F172A`, padding `14px 14px 18px`):
    - Row 1: `<KivaLogo />` left + settings cog right
    - 2×2 grid of `<StatCard>`s: "This Month £X" / "Outstanding £X" / "Quotes Sent N" / "Active Jobs N"
  - "Recent Activity" section header (8 px 600 `#94A3B8` uppercase, padding `10px 12px`)
  - List of `<RecentActivityRow>`s
  - `<FAB icon="mic" />` absolutely positioned bottom-right (12 px from edge, 62 px from bottom)
  - `<BottomNav active="home" />` fixed bottom

#### `<NewCustomerSheet state="opening|recording|filling|saving" />`
- **Source:** real app via the `+` button on Customers screen (visual target: IMG_2409)
- **Anatomy (sheet container with `<SheetContainer>`):**
  - Title row: "New Customer" (Inter_700Bold 18 px navy) + close X (top-right)
  - Subtitle: "Speak or type — we'll fill in their details." (Inter_400Regular 11 px `#94A3B8`)
  - `<UseAIToggle on />` — purple bg row with sparkle icon + "Use AI" label + purple toggle
  - "INCLUDE:" section header (8 px 600 `#94A3B8` uppercase)
  - Chip row: Name / Phone / Email / Address / Contact method (each chip purple-bordered)
  - Field card: "NAME" label + body text "Spell tricky names letter by letter…"
  - Pagination dots (4 dots, first active)
  - Settings cog circle (40 px) + `<MicButton />` centered + "Tap to start recording" caption

#### `<NewQuoteScreen state="empty|recording|generating|review" />`
- **Source:** Voice-to-quote real screen (`/Users/nolancarey/kiva/Frontend/src/screens/VoiceQuote/index.js`)
- **Anatomy:** Topbar with back arrow + "New Quote" title + `<AIBadge />`. Quick Start row (chips: Power flush, Shower install, Toilet replacer). INCLUDE chip row. Job description card. Centered `<MicButton />` + caption. Customer picker card.

#### `<QuoteReviewScreen />`
- **Source:** Quote review real screen
- **Anatomy:** `<AIBanner>` "AI generated from your voice description…" → `<CustomerRow>` → `<JobTitleCard>` → `<LineItemsTable>` (header row + N `<LineItemRow>` + `<TotalsRow type="subtotal">` + `<TotalsRow type="vat">` + `<TotalsRow type="total">`) → button row (Edit items secondary + Send quote primary).

#### `<CustomersScreen mode="list|map" />`
- **Source:** Real Customers screen (list + map toggle)
- **Anatomy:** Topbar "Customers (3)" + Insights button. Search bar. Filter pill row + `<ListMapToggle />` right-anchored. Below: either `<CustomersList>` of `<CustomerRow>`s OR `<CustomersMap>` showing `<MapPin>`s on Apple Maps tiles.

#### `<CustomersMap pins=[...] />` ← THE SCENE 5 FIX
- **Anatomy:** Background plate = cropped slice of `IMG_2417.PNG` showing ONLY the Apple Maps tiles (Hammersmith / Notting Hill / Shepherd's Bush area, NO chrome, NO header, NO pins, NO bottom nav, NO Apple Maps credit). Crop instructions: from the original 1170×2532 PNG, take the region from y≈600 to y≈2150 (the actual map tiles), x=full-width. Save as `/Sound/../Assets/map_plate_london.png` or wherever Norm prefers. Then on top of this plate, render: `<StatusBar />`, customer chips row (top), `<SearchBar />`, list/map toggle, the 3 `<MapPin>` components positioned at fake London coordinates, "Apple Maps" credit + "Legal" link bottom-left, `<BottomNav>` bottom.

#### `<AIAssistantSheet />`
- **Source:** IMG_2410 — pulled up via the FAB
- **Anatomy:** Sheet container. `<AIBadge>` ("AI ASSISTANT" text variant) at top. Heading "What do you need?" (Inter_700Bold 18 px navy). Subtitle "Kiva AI can help you get it done faster" (11 px `#94A3B8`). 5 `<AssistantOptionRow>`s.

#### `<NewExpenseSheet state="empty|scanning|filled|saving" />`
- **Source:** real Expenses screen via `+` button (visual target: IMG_2422)
- **Anatomy:** Title "New Expense" + close X. `<UseAIToggle on />`. **Scanning button**: bordered card with "Scanning receipt…" text + small purple spinner; `<AIBadge>` floats top-right of the button. **Receipt photo card**: small thumbnail of receipt on left, "Receipt photo attached" + "Tap to preview" right, X to remove. Form fields: Description, Amount, Date of expense. Category chip row: Construction Materials / Parts / Tools / Fuel / Other / + New. Link to job picker. "More options" link.

---

## 6. What Norm builds first (prioritized)

The "atom + molecule" base set unblocks all 7 scenes. Build in this order:

| Step | Component | Used in scenes |
|---|---|---|
| 1 | tokens.ts (already done — verify against §2) | all |
| 2 | Inter font load | all |
| 3 | `<PhoneFrame>` (already done) | 2-7 |
| 4 | `<StatusBar>`, `<BottomNav>` | 2-7 |
| 5 | `<KivaLogo>` (use SVG directly) | 1, 7 |
| 6 | `<AIBadge>`, `<StatusBadge>`, `<SendMethodPill>` | 2-7 |
| 7 | `<Button>`, `<FAB>` | 2-7 |
| 8 | `<MicButton>`, `<SparkleLoader>`, `<ProgressBar>` | 2, 3 |
| 9 | `<NotificationCard>` (8 variants) | 1 |
| 10 | `<Thumb>` interaction primitive | 1, 2, 3, 4, 6 |
| 11 | `<FormField>`, `<LineItemRow>`, `<TotalsRow>` | 2, 3 |
| 12 | `<AssistantOptionRow>`, `<RecentActivityRow>`, `<StatCard>` | 2, 6 |
| 13 | `<CustomerChip>`, `<MapPin>` | 5 |
| 14 | Sheet primitive `<SheetContainer>` (rise/dismiss physics from §4.4) | 2, 4, 6 |
| 15 | Screen organisms (Dashboard, NewCustomerSheet, NewQuoteScreen, QuoteReviewScreen, CustomersMap, AIAssistantSheet, NewExpenseSheet) | per scene |

---

## 7. What's NOT in this doc

- **Backend logic.** This is a visual/animation spec only. Norm doesn't simulate API calls; he simulates the *appearance* of API calls (sparkle loaders, progress bars, "Generating your quote…" copy).
- **Real customer data.** Use the names/copy already locked in `ad_plan.md` (Annie Yang, Mrs. Patel, John, Stan Carey, Nolan Carey).
- **Auth flows, settings deep-dives, edge states.** None of these appear in the 30-second ad.
- **Haptic feedback.** Real app uses `expo-haptics`. The ad has no haptics — visual ripples are the substitute.

---

## 8. Hand-off back to ad_plan.md

Once Norm has the atoms + molecules built, the per-scene specs in `ad_plan.md` §6 reference these components by name. The two docs work together:

- `kiva_components_for_norm.md` (this file) = **what each component looks like + how it animates**
- `ad_plan.md` = **which components appear when, and what specifically they do**

Norm's mental model: build the components once (faithful to the real Kiva), then compose them per scene timeline.

---

## 9. Code reference index — where to peek in the real Kiva codebase

> **Purpose:** Norm doesn't need to deeply *understand* the React Native code — but when an animation moment needs more grounding (e.g. zooming into a feature should feel real), peeking at the actual implementation gives him the JSX shape, prop names, and conditional states the real product uses. **READ-ONLY** reference. **Do not import these paths into the Remotion ad** — they're React Native code and won't run in web React anyway.
>
> Root: `/Users/nolancarey/kiva/Frontend/src/`

### 9.1 Per-ad-scene → which Kiva file to look at

| Ad scene | Real Kiva file(s) — peek for grounding |
|---|---|
| 1 — Notification overwhelm | n/a (notifications are external to Kiva — synthesize from chrome conventions) |
| 2 — Voice-to-Customer | `screens/Customers/index.js` (list state, customer rows, `+` flow). Plus `screens/Dashboard/index.js` for the FAB origin and assistant sheet trigger. |
| 3 — Voice-to-Quote (HERO) | `screens/VoiceQuote/index.js` (full voice flow incl. mic, transcribing, generating states) → `screens/QuoteReview/index.js` (line items table, totals, send button) |
| 4 — Expense classification | `screens/Expenses/index.js` (list + new expense flow) plus `screens/ExpenseDetail/index.js` for individual expense state |
| 5 — Route optimization | `screens/Map/index.js` (the actual map view, pin rendering) plus `screens/Customers/index.js` (the chips + list/map toggle) plus `components/ViewModeToggle.js` |
| 6 — Follow-up + AI Assistant | `screens/Dashboard/index.js` (assistant sheet trigger + recent activity list) plus `screens/Jobs/index.js` (status badges in a list context) |
| 7 — Logo + CTA | `screens/Auth/LoginScreen.js` (logo placement convention) — the Kiva logo lockup pattern |

### 9.2 Per-component-type → which file owns it

| Component / pattern | Authoritative file |
|---|---|
| Color tokens | `theme/colors.js` |
| Typography roles | `theme/Typography.js` |
| Button variants | `theme/Buttons.js` |
| Status badges | `theme/StatusBadges.js` |
| Send-method pills | `components/SendMethodPill.js` |
| Avatar palette (deterministic per-name colors) | `theme/avatarPalette.js` |
| Currency formatting (£) | `theme/currency.js` |
| Locale formatting | `theme/locale.js` |
| List/map toggle pill | `components/ViewModeToggle.js` |
| Toast (the closest existing animated component — study the spring/timing pattern) | `components/UndoToast.js` |
| Bulk-selection pattern | `components/BulkSelection.js` |
| Legal modal (sheet pattern) | `components/LegalModal.js` |
| Theme barrel export | `theme/index.js` |

### 9.3 Per-Kiva-feature → file index

| Feature | File |
|---|---|
| Dashboard (navy header + stat cards + recent activity + FAB) | `screens/Dashboard/index.js` |
| Customers list + map + filter chips | `screens/Customers/index.js` |
| Customers map (pin rendering) | `screens/Map/index.js` |
| Voice-to-quote (the AI flow hero) | `screens/VoiceQuote/index.js` |
| Quote review (line items + totals + send) | `screens/QuoteReview/index.js` |
| Invoices list | `screens/Invoices/index.js` |
| Invoice view (header card + smart-send label + payment terms) | `screens/InvoiceView/index.js` |
| Jobs list | `screens/Jobs/index.js` |
| Job detail | `screens/JobDetail/index.js` |
| Job summary (4-question completion form) | `screens/JobSummary/index.js` |
| Expenses list | `screens/Expenses/index.js` |
| Expense detail | `screens/ExpenseDetail/index.js` |
| Settings (sections, send-method default, branding, save bar) | `screens/Settings/index.js` |
| Onboarding flows | `screens/Onboarding/{BankSetup,BusinessSetup,TaxSetup,RateSetup}Screen.js` |
| Auth (login, register, verify email, Stripe checkout, language) | `screens/Auth/{LoginScreen,RegisterScreen,VerifyEmailScreen,StripeCheckoutScreen,LanguageScreen}.js` |
| Navigation root + tab/stack structure | `navigation/index.js` |
| API calls + request shapes | `services/api.js` |
| Auth flow (token storage, refresh) | `services/auth.js` |
| Geocoding (for map pins) | `services/geocode.js` |
| Quota / billing checks | `services/quota.js` |
| Region detection | `services/region.js` |
| i18n (locale-driven copy) | `i18n/index.js` + `i18n/locales/{en,fr,es,de,it,pt,zh}.js` |

### 9.4 How to actually use this index (the rules)

1. **Read for grounding, not for importing.** When designing a frame in a scene, if the moment is "user taps Send Quote → toast appears", glance at `screens/QuoteReview/index.js` to see what the real button + toast call actually look like in JSX. Then build a Remotion-compatible recreation. Don't try to import RN code into Remotion — it won't compile.
2. **Don't get lost.** A typical screen file is 200–800 lines. Scan with **`grep`** for the specific pattern you need (e.g. `grep -n "FAB\|mic\|Animated" screens/Dashboard/index.js`) rather than reading top-to-bottom.
3. **Trust `theme/` over screens.** Tokens in `theme/colors.js`, `theme/Buttons.js`, `theme/Typography.js`, `theme/StatusBadges.js` are authoritative. If a screen file uses an inline value that disagrees with `theme/`, **prefer the theme value** (the screen is likely lagging the design system by a sprint).
4. **`UndoToast.js` is your animation reference.** It's the cleanest existing animated component in the app. Study its `useEffect` spring+timing pattern when you need to translate "what would real Kiva do here" into Remotion.
5. **Don't copy code 1:1 even where it'd compile.** Remotion has its own animation primitives (`spring`, `interpolate`); use those — not RN's `Animated` API. The companion doc §3 has the 6 motion presets that translate the RN feel to Remotion.
6. **If something's not in this index** but you need it for an ad moment, ping back through the user — Steve will add it. The index is the source of truth for "what's referenceable."

— Steve, Master SaaS Ad Designer · v1.2 · 2026-05-06 (cinematic environment system added per ad_plan.md §3.7)
