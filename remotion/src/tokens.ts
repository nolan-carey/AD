// Source of truth: kiva_design_spec_v2-1.pdf and ad_plan.md §3
// These values must NOT drift. Norm has copied them verbatim from Steve's spec.

import { Easing } from "remotion";

export const COLOR = {
  navy: "#0F172A",
  blue: "#3B82F6",
  surfaceDark: "#1E293B",
  aiPurple: "#6D28D9",
  aiPurpleBg: "#EDE9FE",
  bg: "#F8FAFC",
  surface: "#FFFFFF",
  border: "#E2E8F0",
  divider: "#F1F5F9",
  textPrimary: "#0F172A",
  textSec: "#64748B",
  textTer: "#94A3B8",
  paid: "#22C55E",
  pending: "#F59E0B",
  overdue: "#EF4444",
  sent: "#3B82F6",
  sentBg: "#DBEAFE",
  sentText: "#1D4ED8",
  accepted: "#15803D",
  acceptedBg: "#DCFCE7",
  white: "#FFFFFF",
  whatsapp: "#25D366",
  imessage: "#34C7F4",
  navActive: "#3B82F6",
  navInactive: "#94A3B8",
} as const;

export const RADIUS = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  pill: 999,
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

// Mobile UI is rendered at logical iPhone-15 size (393x852) and scaled to fit the 1920x1080 frame.
// Phone height target: ~83% of 1080 = ~896 px on screen.
// Scale factor = 896 / 852 ≈ 1.052 — but per plan we want headroom; use 1.0 for crispness.
export const PHONE = {
  width: 393,
  height: 852,
  bezelRadius: 56,
  notchWidth: 120,
  notchHeight: 36,
  // On-screen render scale (1920x1080 frame). Phone occupies center.
  scale: 1.18,
} as const;

// Standard easing curves, as called out in §3 of the plan.
export const EASE = {
  // easeOutCubic — most landings
  outCubic: Easing.bezier(0.33, 1, 0.68, 1),
  // easeInOutQuad — camera moves
  inOutQuad: Easing.bezier(0.45, 0, 0.55, 1),
  // crisp ui entrance, no overshoot
  outExpo: Easing.bezier(0.16, 1, 0.3, 1),
  // playful overshoot
  pop: Easing.bezier(0.34, 1.56, 0.64, 1),
  // ease in for exits
  inCubic: Easing.bezier(0.32, 0, 0.67, 0),
  linear: Easing.linear,
} as const;

// Spring presets per plan: damping 12–15, mass 1.
export const SPRING = {
  bouncy: { damping: 12, mass: 1, stiffness: 100 },
  soft: { damping: 14, mass: 1, stiffness: 100 },
  controlled: { damping: 15, mass: 1, stiffness: 120 },
} as const;

// Type scale (mobile UI inside phone — these are the iPhone logical px values).
export const TYPE = {
  hero: { size: 28, weight: 700 },
  title: { size: 22, weight: 700 },
  body: { size: 14, weight: 500 },
  bodySm: { size: 13, weight: 500 },
  meta: { size: 12, weight: 500 },
  micro: { size: 11, weight: 600 },
  tiny: { size: 9, weight: 600 },
  // Frame-level (full 1920x1080 canvas) — for big overlay text outside the phone
  hookHero: { size: 96, weight: 800 },
  tagline: { size: 30, weight: 600 },
  ctaLabel: { size: 22, weight: 600 },
} as const;

// Master timeline anchor (43.7s/1311 frames, 10 scenes).
// v1.41 2026-05-07: Scene 2 +2s extension per user direction. Typing
// slowed further (verb 10→16f, breath 2→3f, outcome 13→19f). Per-feature
// window 43→60f. Stagger 28→35f. Pill hold 24→36f. Dashboard 24→34f.
// Scene 2: 291f → 351f (+60f / +2s). Scenes 3-10 shift +60.
export const FPS = 30;
export const TOTAL_FRAMES = 1311; // 43.7s @ 30fps

export const SCENES = {
  scene1: { from: 0, duration: 240 }, //    0:00.0 – 0:08.0  (8.0s · Overwhelm — 18 cards including v1.40 density-build)
  scene2: { from: 240, duration: 351 }, //  0:08.0 – 0:19.7 (11.7s · v1.41 slowed typing + kinetic float + 35f stagger)
  scene3: { from: 591, duration: 105 }, //  0:19.7 – 0:23.2  (3.5s · Dashboard reveal + mic zoom)
  scene4: { from: 696, duration: 105 }, //  0:23.2 – 0:26.7  (3.5s · Voice→Quote)
  scene5: { from: 801, duration: 60 }, //   0:26.7 – 0:28.7  (2.0s · Quote→Customer profile)
  scene6: { from: 861, duration: 90 }, //   0:28.7 – 0:31.7  (3.0s · Receipt→Expense)
  scene7: { from: 951, duration: 90 }, //   0:31.7 – 0:34.7  (3.0s · Map→Route)
  scene8: { from: 1041, duration: 90 }, //  0:34.7 – 0:37.7  (3.0s · Pin→Follow-up)
  scene9: { from: 1131, duration: 120 }, // 0:37.7 – 0:41.7  (4.0s · AI Business Assistant)
  scene10: { from: 1251, duration: 60 }, // 0:41.7 – 0:43.7  (2.0s · Final hero shot)
} as const;

// v1.26: persistent top-right chevron REMOVED. Logo stays centered the
// entire sequence and dissolves into the iPhone at center. See
// Scene2_VoiceCustomer.tsx top comment for the full v1.26 local-frame map.
