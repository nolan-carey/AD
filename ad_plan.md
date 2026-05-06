# Kiva — 30s SaaS Kinetic UI Showcase
**Ad plan · authored by Steve (Master SaaS Ad Designer) · for Norm (Master Programmer)**

> **Conversion goal:** This ad's job is to make a UK tradesperson stop scrolling, feel "this is my life," and click through to try Kiva. Every frame must serve that goal. If a creative choice doesn't measurably help conversion, cut it.

---

## 🚦 PENDING APPROVALS

> Anything that needs the **user's explicit go-ahead** lives here. Always shown at the very top of the doc. When this section reads "(none — all clear)", Norm can proceed with everything in ACTIVE DIRECTIVES without further user input. When this section has items, **Norm pauses on those specific items** until the user marks them ✅.

**(none — all clear)**

---

## 📋 CHANGELOG

> Every revision logged here. Most recent on top. Norm — read this first to see what changed since your last build.

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
| A1 | P0 | Scaffold project skeleton: `Root.tsx` registers a single composition `KivaAd` at 1920×1080 / 30 fps / 900 frames. Top-level `KivaAd.tsx` sequences 7 placeholder scene files via `<Series>` with durations from §5. |
| A2 | P0 | Build `src/tokens.ts` from §3 (verified to match real Kiva `theme/colors.js`). |
| A3 | P0 | Load Inter font via `@remotion/google-fonts/Inter` — see `kiva_components_for_norm.md` §1. |
| A4 | P0 | Build `<PhoneFrame>` — iPhone 15 chrome, logical canvas 393×852 pt, scalable via prop. |

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

### Phase C — Audio pipeline (✅ §4.5 APPROVED — unblocked)

| ID | Priority | Task |
|---|---|---|
| C1 | P0 | Extend `test.py` with the `sound_effects()` helper from §4.5.1 (code template provided). Test with one P0 sound (`phone_vibration_loop`) before any batch. |
| C2 | P0 | Run `generate_all(priority_filter="P0")` — 5 sounds, ~2,150 credits. **STOP after this batch.** Send the 5 mp3s back through the user for approval before running P1. |
| C3 | P1 | After user approves P0: run `generate_all(priority_filter="P1")` — 5 more, ~480 credits. |
| C4 | — | **If any single SFX comes back unusable, flag the `id` to the user — do NOT modify the prompt yourself.** Steve revises → re-run only that ID. |

---

### Phase D — Scene composition

> Per scene, compose atoms + molecules per the per-scene timeline in §6. Reference `kiva_components_for_norm.md` for component anatomy; reference `ad_plan.md` §6 for what-appears-when.

| Scene | Status | Special locked rules |
|---|---|---|
| 1 — Notification overwhelm | WIP-acceptable | Locked at v1.6 (typing animation for "Feeling overwhelmed?"). Continue iterating. |
| 2 — Voice-to-Customer | Ready to build | Spec sufficient as-is. No further deepening needed. |
| 3 — Voice-to-Quote (HERO) | Ready to build | **MUST include v1.3 white-flash pattern interrupt at frames 422–426 with mandatory audio cut.** This is locked. |
| 4 — Expense Classification | Ready to build | Spec sufficient as-is. |
| 5 — Route Optimization | Ready to build | **TWO locked rules:** (a) v1.3 camera direction inverted — open WIDE on London with pins placed, then punch-zoom in. (b) v1.7 PNG fix — use a CROPPED `IMG_2417` slice (map tiles only, no chrome) as a static background plate; render everything else (status bar, chips, search, toggle, pins, nav) as components. |
| 6 — Follow-up + AI Assistant | Ready to build | Spec sufficient as-is. |
| 7 — Logo + CTA | Ready to build | **MUST include Mrs. Patel callback at frame 870** ("Quote accepted ✓ • see you Saturday") AND social proof line under URL ("Used by 1,247+ UK tradespeople"). |

---

### Open questions for Norm to flag back through the user

- Remotion cascade performance for Scene 1 (12 notification cards landing across frames 24–124, with intervals as tight as 6 frames apart). Confirm no dropped frames at render time. If issues, ping back.

---

## 1. Engineering constraints

| Spec | Value |
|---|---|
| Render target | 1920 × 1080 (16:9) |
| Frame rate | 30 fps |
| Total duration | 30.0 s = **900 frames** |
| Stack | Remotion 4 · React 19 · TypeScript |
| Project root | `/Users/nolancarey/Desktop/KivaADS/remotion/` |
| Studio command | `npm start` (from `/remotion`) |
| Build command | `npm run build` |

**Norm — suggested file structure** (you own the final architecture, this is just a starting point):

```
remotion/src/
  Root.tsx                 ← register one composition: KivaAd, 900 frames
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

## 4. Sound design library

| File | Use |
|---|---|
| `Sound/click.mp3` | Button taps, thumb taps, UI clicks |
| `Sound/notication1.mp3` *(sic)* | Single notification ding (Scene 1 first ping, Scene 6 reply) |
| `Sound/notifcation2.mp3` *(sic)* | Stacking dings (Scene 1 build) |
| `Sound/swoosh.mp3` | Sheet rise, scene wipes, send confirmations |
| `Sound/riser.mp3` | Tension build (Scene 1 0:03 → 0:05.2) |
| `Sound/impact2.mp3` | Big punctuation moments (logo land, total stamp) |

**Master mix:** Bus all SFX through a soft compressor — peaks at -6 dBFS, average around -14 dBFS. We will likely add a music bed in post; structure the SFX so they sit cleanly under any track.

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
    {"id": "sparkle_match", "prompt": "Quick bright sparkle chime, two cascading notes, like a magical UI element snapping into the correct slot. Light, satisfying, AI-coded, glassy texture, no reverb tail.", "duration": 0.4, "priority": "P1"},
    {"id": "map_zoom_whoosh", "prompt": "Cinematic camera zoom whoosh from wide to close, low filtered noise sweep with a subtle Doppler shift. Used in modern map applications. No music, no clicks, smooth tail.", "duration": 0.8, "priority": "P1"},
    {"id": "route_line_flow", "prompt": "Subtle flowing electronic energy travelling along a path, like data moving through a network line. Soft synthetic stream, faint UI texture, no harsh elements, no melody.", "duration": 1.0, "priority": "P1"},
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
| 8 | `sparkle_match` | Scene 4 | 522 (category lock) | -10 dBFS | One-shot, 0.4s | Bespoke — needs to feel "AI just got it right" not "level up" |
| 9 | `map_zoom_whoosh` | Scene 5 | 576 (punch-zoom) | -10 dBFS | One-shot, 0.8s | Library whooshes are too aggressive; we want filtered, controlled |
| 10 | `route_line_flow` | Scene 5 | 612 (line draws) | -14 dBFS | One-shot, 1.0s | Bespoke energy-along-path texture — no library equivalent |

### 4.5.4 Cost analysis

ElevenLabs Sound Generation pricing (as of 2026): roughly **100 character credits per second of audio** generated.

| Pass | Sounds | Total seconds | Credits | % of Creator monthly (100k) |
|---|---|---|---|---|
| First-pass P0 | 5 | 21.5 s | ~2,150 | 2.15% |
| First-pass P1 | 5 | 4.8 s | ~480 | 0.48% |
| Total clean run | 10 | 26.3 s | ~2,630 | **2.6%** |
| Worst case (1 retry per sound) | 20 | 52.6 s | ~5,260 | 5.3% |

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

| Status | Approved by | Date |
|---|---|---|
| **✅ APPROVED** | User (relayed by Steve) | 2026-05-06 |

Norm is unblocked to run `generate_all(priority_filter="P0")`. After P0 batch completes, send the 5 mp3 files to the user via the project for review. Wait for explicit "P1 approved" before running the second batch. If any prompt produces unusable output, flag the `id` back through the user — Steve revises, re-run only that single ID per the cost-discipline rule in §4.5.4.

---

## 5. Master timeline

| # | Scene | Time | Frames | Duration | Hero feature |
|---|---|---|---|---|---|
| 1 | Cold open — Notification overwhelm | 0:00.0 – 0:07.2 | 0 – 216 | 7.2s | (hook) |
| 2 | AI Voice-to-Customer | 0:07.2 – 0:10.4 | 216 – 312 | 3.2s | Feature 1 |
| 3 | **AI Voice-to-Quote** ★ HERO | 0:10.4 – 0:15.4 | 312 – 462 | 5.0s | Feature 2 |
| 4 | AI Expense Classification | 0:15.4 – 0:18.6 | 462 – 558 | 3.2s | Feature 3 |
| 5 | AI Customer Route Optimization | 0:18.6 – 0:21.8 | 558 – 654 | 3.2s | Feature 4 |
| 6 | AI Follow-up + AI Assistant brain | 0:21.8 – 0:26.8 | 654 – 804 | 5.0s | Features 5 + 6 |
| 7 | Logo lockup + CTA | 0:26.8 – 0:30.0 | 804 – 900 | 3.2s | (close) |

**Why Scene 3 gets the most time:** voice-to-quote is the killer feature — it's the entire user flow in 5 seconds and proves the magic. Everything else is supporting.
**Why scenes 5+6 are paired:** the AI Assistant sheet (IMG_2410) literally lists "Follow up on a quote" as one of its options. They share the same diegetic UI surface, so they share a scene.

---

## 6. Scene-by-scene breakdown

### Scene 1 — Cold open: Notification overwhelm
**Time:** 0:00.0 – 0:07.2 (frames 0–216)
**Goal:** In 7 seconds, make the viewer feel the daily admin chaos of being a UK tradesperson, then promise relief.
**Setting:** Dark navy gradient background `linear-gradient(135deg, #0F172A 0%, #1E293B 100%)`. No phone visible yet — we're inside the protagonist's head.

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
| 0:06.6–0:07.2 | 198–216 | **Thumb tap → iPhone morph.** A stylised thumb (or iOS tap-ripple if simpler) presses the logo at frame 198. Click ripple expands. Logo Y-axis rotates 180° while morphing into a 3D iPhone (logical 393×852, scaled to ~38% of frame height) angled 8° to the right. By frame 216, iPhone is fully formed and centered. Camera begins a slow push-in that continues into Scene 2. Audio: `click.mp3` at frame 198, soft mechanical whirr (looped low-pitched motor at -20 dBFS) frame 200–216. |

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

### Scene 2 — AI Voice-to-Customer
**Time:** 0:07.2 – 0:10.4 (frames 216–312)
**Feature shown:** AI voice-to-customer creation.
**Reference:** `IMG_2409.PNG` — New Customer voice modal. `IMG_2410.PNG` — AI Assistant sheet.
**Goal:** "Adding a customer takes a sentence, not a form."

**Beat-by-beat:**

| Range (s) | Frames | Action |
|---|---|---|
| 0:07.2–0:07.6 | 216–228 | iPhone settles. Camera push-in stops. Phone screen shows the dashboard (matching IMG_2410's background — navy header with stat cards reading £0 / £0 / 0 / 0). Bottom nav visible. Blue mic FAB at bottom-right. |
| 0:07.6–0:08.0 | 228–240 | A WhatsApp banner slides down from the top of the phone screen: *"Hi, can you give me a quote? — Annie Yang"*. Subtle vibration cue. |
| 0:08.0–0:08.4 | 240–252 | Thumb taps the blue mic FAB. Click ripple from FAB. AI Assistant sheet (IMG_2410) rises from the bottom over the dashboard with a 380 ms `easeOutCubic`. Header reads *"What do you need?"* Audio: `swoosh.mp3` (volume 60%). |
| 0:08.4–0:08.8 | 252–264 | The *"New voice customer"* row in the sheet highlights (blue 4% bg flash, scale 1.02). Sheet dismisses. New Customer sheet (IMG_2409) rises in its place. *"AI powered"* badge + *"Use AI"* row visible. |
| 0:08.8–0:09.4 | 264–282 | Mic button pulses (concentric blue rings per design spec — 64 px core, 88 px ring 1, 110 px ring 2). Audio waveform animates above the mic suggesting voice. Floating purple sparkle text appears around the mic, words flying in: *"Annie Yang"*, *"07700 900123"*, *"Notting Hill"*. |
| 0:09.4–0:10.0 | 282–300 | Form auto-fills field by field (Name → Phone → Address → Contact method = WhatsApp). Each field landing: white-to-faint-purple flash, then settle, with a tick mark in `#15803D` to the right. Field cadence: ~120 ms each. |
| 0:10.0–0:10.4 | 300–312 | Sheet dismisses with a downward slide. Camera transitions to Customers list (IMG_2416 styling). New row "Annie Yang" lands at top with a soft drop. Counter chip "Customers 2" → "Customers 3" rolls. Hold 6 frames, then cut. |

**Sound timeline:**
- 228 — incoming WhatsApp ding (`notification1.mp3`, -10 dBFS)
- 240 — `click.mp3` (FAB tap)
- 244 — `swoosh.mp3` (sheet rise, 60% vol)
- 264 — soft mic-activate chime (use `notification2.mp3` pitched up, 50% vol)
- 282–300 — sparkle ticks at each field fill (`click.mp3` at 30% vol, every 4 frames during fill)
- 300 — `swoosh.mp3` (sheet dismiss)
- 306 — soft thump (`impact2.mp3` at 25% vol) on counter roll

---

### Scene 3 — AI Voice-to-Quote ★ HERO
**Time:** 0:10.4 – 0:15.4 (frames 312–462)
**Feature shown:** Voice-to-quote — the killer flow.
**Reference:** `IMG_2418.PNG` (New Quote) → `IMG_2419.PNG` (Transcribing) → `IMG_2420.PNG` (Generating) → `IMG_2421.PNG` (Quote review).
**Goal:** "Spend 5 seconds saying the job. Get a £2,454.60 itemised quote ready to send."

**Beat-by-beat:**

| Range (s) | Frames | Action |
|---|---|---|
| 0:10.4–0:10.8 | 312–324 | Camera reframes/cuts to New Quote screen. *"AI powered"* purple badge in topbar. Quick Start chips (*Power flush*, *Shower install*, *Toilet replacer*) visible. Heading *"New Quote"*. |
| 0:10.8–0:11.4 | 324–342 | Mic button pulses big (concentric rings expand to 130/160 px during heavy state). Voice waveform animates above. A floating speech bubble shows the spoken description: *"Bathroom waste install — 32mm pipe, bath waste, basin trap, plumbing waste removal"*. |
| 0:11.4–0:12.0 | 342–360 | Cut to Transcribing screen (IMG_2419). Purple sparkle loader (8-petal) rotates clockwise. Heading: *"Transcribing your voice…"* Subtitle: *"Turning audio into text — this takes a few seconds."* Stage 1 progress bar fills 0→100%. *"1s elapsed · usually 10–25s"* timer. |
| 0:12.0–0:12.6 | 360–378 | Cut to Generating screen (IMG_2420). Heading: *"Generating your quote…"* Subtitle: *"AI is building line items, quantities and pricing."* Two-stage progress: stage 1 complete, stage 2 fills. Sparkle loader still spinning. |
| 0:12.6–0:13.6 | 378–408 | **The reveal.** Cut to Quote Review (IMG_2421). Line items cascade in top-to-bottom at 100 ms intervals, each row sliding from right with a sparkle stamp on landing: *32mm & 40mm Waste Pipe & Fittings — 1 — £45.00*; *Bath Waste & Overflow — £25.00*; *Basin Waste & Trap — £20.00*; *WC Pan Connector — £15.00*; *General Consumables (PTFE, clips, flux, solder) — £40.00*; *Plumbing Waste Removal — £120.00*. |
| 0:13.6–0:14.1 | 408–422 | Subtotal *£2,045.50* counts up. *Include tax* toggle clicks ON. *VAT (20%) £409.10* appears. |
| 0:14.1–0:14.2 | 422–426 | **⚡ WHITE-FLASH PATTERN INTERRUPT (v1.3).** 2 frames pure white (422–424) → 2 frames pure navy `#0F172A` (424–426). Wakes the eye before the money shot. Audio: brief silence (cut all SFX for these 4 frames — silence + flash = maximum attention). |
| 0:14.2–0:14.4 | 426–432 | **Total £2,454.60** stamps in: scale 0.6→1.15→1.0 spring, with a quick navy flash on the row. **Audio: `impact2.mp3` at frame 426** — this is the money shot. |
| 0:14.4–0:14.8 | 432–444 | *Send quote →* button (navy filled, 11 px 600 white text per spec) — thumb taps it. Camera nudges 4 px down on press. Button briefly inverts (bg → white, text → navy), then a paper-airplane icon rockets out of the button up-and-right. |
| 0:14.8–0:15.4 | 444–462 | Green "Sent via WhatsApp" toast banner slides down from the top with a checkmark. Hold ~6 frames. Cut. |

**Sound timeline:**
- 324 — mic activate chime + waveform whoosh
- 342 — soft transcribe processing hum (low filtered noise loop, -22 dBFS)
- 360 — soft chime layer adds (generation phase)
- 378–408 — rapid `click.mp3` ticks at each line-item landing (10× ticks at 30% vol)
- 408–426 — building counter-roll synth tone (rising pitch matches counting up)
- **426 — `impact2.mp3` at 100%** — total stamp
- 438 — `click.mp3` (send button)
- 444 — `swoosh.mp3` (paper airplane)
- 450 — soft achievement chime (`notification1.mp3` pitched up)

---

### Scene 4 — AI Expense Classification
**Time:** 0:15.4 – 0:18.6 (frames 462–558)
**Feature shown:** Snap a receipt → AI classifies.
**Reference:** `IMG_2422.PNG` — New Expense modal.
**Goal:** "Bookkeeping done in 2 seconds, on the way out of Screwfix."

| Range (s) | Frames | Action |
|---|---|---|
| 0:15.4–0:15.8 | 462–474 | Cut to New Expense sheet (IMG_2422 — purple "Use AI" toggle ON, "Scanning receipt…" button). A receipt photo physically drops into the receipt-photo card with a slight bounce. |
| 0:15.8–0:16.4 | 474–492 | A blue scan line (`#3B82F6`, 2 px, 30% glow) sweeps top-to-bottom across the receipt over 18 frames. OCR text fragments float off the receipt as the line passes (e.g. *"Wickes"*, *"£147.32"*, *"04/03/26"*). |
| 0:16.4–0:17.2 | 492–516 | Form auto-fills below: *Description: "Wickes — bathroom fittings"*, *Amount: £147.32*, *Date: 04/03/2026*. Each field flashes faint purple on fill. |
| 0:17.2–0:17.8 | 516–534 | Category chips appear at bottom row. The *"Construction Materials"* chip auto-highlights with a bouncy spring (scale 1.0→1.12→1.0), turning navy bg with white text per spec. AI badge confirms in top-right. |
| 0:17.8–0:18.6 | 534–558 | Save button (full width, navy) gets a thumb tap. Sheet dismisses; the new expense row flies into the Expenses list view. Counter "Expenses 0" → "Expenses 1" rolls. Cut. |

**Sound timeline:**
- 462 — soft paper drop (`impact2.mp3` at 30% vol pitched up)
- 474–492 — scan whoosh (filtered swoosh sustained)
- 492–516 — sparkle ticks per field fill
- 522 — bouncy "match" chime on category lock
- 540 — `click.mp3` (save)
- 546 — `swoosh.mp3` (sheet dismiss)

---

### Scene 5 — AI Customer Route Optimization
**Time:** 0:18.6 – 0:21.8 (frames 558–654)
**Feature shown:** Map view with optimized route across customer pins.
**Reference:** `IMG_2417.PNG` — Customers map view with London pins.
**Goal:** "AI routes your day — drive less, work more."

| Range (s) | Frames | Action |
|---|---|---|
| 0:18.6–0:19.2 | 558–576 | **OPEN WIDE (v1.3 inverted camera).** Cut to a fully zoomed-OUT London map — viewer sees all 3 customer pins (Annie Y in Notting Hill, Nolan C in Shepherd's Bush, Stan C in Hammersmith) already placed across the wider map. Customer chips visible top of frame. Map at minimum zoom for spatial context first. |
| 0:19.2–0:19.8 | 576–594 | **PUNCH-ZOOM IN.** Camera punch-zooms into the cluster (zoom level increases ~40%) over 18 frames using `easeInOutCubic`. Pins grow visibly larger. **Spatial pattern interrupt** — most viewers expect to start close and zoom out; we invert that. Audio: low filtered swoosh ramping up across the 18 frames. |
| 0:19.8–0:20.4 | 594–612 | Three pins do a re-entry pulse (each gets a circular ripple expanding from base, 1.0 → 1.15 → 1.0 scale, ~200ms intervals). "AI powered" purple badge pops in top-right over the map. |
| 0:20.4–0:20.9 | 612–627 | A glowing route line (gradient `#3B82F6` → `#6D28D9`) draws between the three pins in optimal sequence over 15 frames, with traveling light particles (3 small dots flowing along the path). |
| 0:20.9–0:21.4 | 627–642 | Stat overlay materializes top-center: large "**47 min**" with subtitle "*time saved today*", and below it "*12.4 mi optimized*". Numbers count up from 0 over 12 frames. |
| 0:21.4–0:21.8 | 642–654 | Brief hold on the optimized state. Camera prepares the transition. Cut. |

**Sound timeline:**
- 558 — map zoom whoosh (low filtered swoosh)
- 570, 576, 582 — three pin "thuds" (`impact2.mp3` at 35% vol, descending pitch)
- 588 — magical AI hum begins (mid-pitched filtered tone, sustained)
- 600 — line draw whoosh
- 612 — counter-roll synth tone
- 624 — achievement chime ("47 min" landing)

---

### Scene 6 — AI Follow-up + AI Assistant brain
**Time:** 0:21.8 – 0:26.8 (frames 654–804)
**Features shown:** AI follow-up on quotes (5) + AI chatbot for admin decisions (6).
**Reference:** `IMG_2410.PNG` — AI Assistant sheet ("What do you need?").
**Goal:** "The AI doesn't just help — it acts. And when you don't know what to do next, it tells you."

This scene has two halves.

**Half A — AI follow-up (0:21.8–0:24.0, frames 654–720):**

| Range (s) | Frames | Action |
|---|---|---|
| 0:21.8–0:22.2 | 654–666 | Cut to a Quotes list. One row reads *"Bathroom install — Mrs. Patel — £2,454.60 — Sent — 5 days ago"*. A pulsing yellow dot sits on the row indicating it's stale. |
| 0:22.2–0:22.8 | 666–684 | Purple AI sparkle highlights the row. A small AI-bot avatar (purple gradient circle with sparkle icon) emerges from the row. A WhatsApp bubble forms next to the bot, typing-dots animate, then text appears: *"Hi Mrs. Patel — just checking in on the bathroom quote, want me to schedule it in?"* |
| 0:22.8–0:23.4 | 684–702 | Bubble sends — paper airplane icon flies right off-screen. Tiny pause (4 frames). Reply bubble pops in from left: *"Yes please — this Saturday?"* with a sparkle entrance. |
| 0:23.4–0:24.0 | 702–720 | Status pill on the original row animates: *Sent* (`#DBEAFE` bg, `#1D4ED8` text) flips/morphs to *Accepted* (`#DCFCE7` bg, `#15803D` text). Tiny green confetti micro-burst (~6 particles) at the badge. |

**Half B — AI Assistant brain (0:24.0–0:26.8, frames 720–804):**

| Range (s) | Frames | Action |
|---|---|---|
| 0:24.0–0:24.6 | 720–738 | Cut/transition back to dashboard. The AI Assistant sheet (matching IMG_2410) rises with a `swoosh`. Header *"What do you need?"* with subtitle *"Kiva AI can help you get it done faster"* and the small purple *"AI ASSISTANT"* tag. |
| 0:24.6–0:26.0 | 738–780 | The five rows cascade in (top to bottom, ~120 ms interval): **New voice quote**, **New voice customer**, **See jobs on the map**, **Follow up on a quote**, **Job summary** — each with its colored leading icon per the reference. After landing, a highlight pulse cycles through them top-to-bottom (each row glows blue 8% bg for ~280 ms). |
| 0:26.0–0:26.8 | 780–804 | Camera dollies back. The phone shrinks slightly (1.0 → 0.85 scale). Six small UI screen thumbnails (Customer modal, Quote review, Map, Expense, Follow-up bubble, Assistant sheet) float into orbit positions around the phone like a constellation. Hold for the lockup. |

**Sound timeline:**
- 666 — soft alert ding (stale quote)
- 672 — AI sparkle "thinking" hum
- 678 — typing-dots tick-tick-tick (`click.mp3` at 20% vol, every 3 frames)
- 690 — `swoosh.mp3` (send)
- 696 — incoming reply ding (`notification2.mp3`)
- 708 — celebration micro-chime + confetti pop
- 720 — `swoosh.mp3` (assistant sheet rise, full vol)
- 738–780 — rapid landing ticks for each row (5×)
- 780–804 — magical low drone building anticipation for outro

---

### Scene 7 — Logo lockup + CTA
**Time:** 0:26.8 – 0:30.0 (frames 804–900)
**Goal:** Brand recall + clear conversion ask.

| Range (s) | Frames | Action |
|---|---|---|
| 0:26.8–0:27.4 | 804–822 | The constellation of feature thumbnails dissolves into purple AI sparkle particles (~30 particles), all swirling inward toward the iPhone. Background dims to navy gradient (matching Scene 1 close). |
| 0:27.4–0:28.0 | 822–840 | Particles converge into the Kiva logo (which lifts off the iPhone surface, scaling 1.0→1.4 over 18 frames) at frame center. Logo glow ramps up. iPhone fades out behind it. |
| 0:28.0–0:28.6 | 840–858 | Tagline *"Blue collar solutions to blue collar problems"* fades in below the logo (gap 24 px), 4 px upward rise, white at 90% opacity, ~32 px semibold. |
| 0:28.6–0:29.0 | 858–870 | CTA button appears below the tagline: navy `#0F172A` filled, scaled up for video (~18 px vertical / 28 px horizontal padding), 10 px radius, white 16 px 600 text reading **"Try Kiva free →"**. URL beneath in `#94A3B8` 14 px: *kiva.app*. Both fade up with 4 px rise. **Social proof line (v1.3)** appears immediately under the URL, smaller (12 px, `#64748B`, 500 weight): **"Used by 1,247+ UK tradespeople."** |
| 0:29.0–0:29.4 | 870–882 | **🔁 LOOP CLOSURE (v1.3 attention boost).** The original Mrs. Patel iMessage card from Scene 1 slides in from the top-right corner of the frame at 70% scale (smaller than Scene 1's hero size). Same blue iMessage chrome, same sender. **But the body text now reads** *"see you Saturday 🤝 Quote accepted ✓"* — the green check sparkles in 4 frames after the card lands. Card lands at ~(1620, 200), -3° rotation, opacity 0.92. This is the curiosity loop closing — the viewer subconsciously realizes "the chaos at the start was solved." Audio: soft `notication1.mp3` at **frame 880**, much quieter than Scene 1 (-12 dBFS) so it whispers rather than punches. |
| 0:29.4–0:30.0 | 882–900 | Hold. Mrs. Patel card sits in corner — quiet, satisfying. Subtle logo glow pulses one last time (opacity 0.6 → 0.9 → 0.6 over 18 frames). Final beat. The viewer is left with: logo, CTA, social proof, and the closed loop in the corner. |

**Sound timeline:**
- 804 — magical sparkle convergence (filtered shimmer rising in pitch)
- 822 — soft `impact2.mp3` (logo land)
- 840 — gentle ascending chime (tagline)
- 858 — soft `click.mp3` (CTA pop)
- 880 — soft `notication1.mp3` at -12 dBFS (Mrs. Patel callback whisper)
- 882–900 — sustained final tone, fades out at 900

---

## 7. Acceptance criteria for Norm

This ad is "done" when:

1. ✅ All 7 scenes render at 1920×1080 / 30 fps / 900 frames total = exactly 30.0 s.
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
