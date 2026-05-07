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

// Master timeline anchor (36.4s/1092 frames, 10 scenes).
// v1.24 2026-05-07: Scene 2 fully rewritten as swipe-up wipe → centered brand
// lockup → logo glides top-right (persists rest of ad) → AI Sparkle Director
// flashing 4 features → vortex → iPhone materializes → dashboard. Duration
// 90→132 frames (3.0s→4.4s). Scenes 3-10 shift +42 frames.
// Per v1.23 user-waiver, master-timeline reconciliation is deferred — these
// frame ranges may not match §5/§6 in ad_plan.md.
export const FPS = 30;
export const TOTAL_FRAMES = 1092; // 36.4s @ 30fps

export const SCENES = {
  scene1: { from: 0, duration: 240 }, //    0:00.0 – 0:08.0  (8.0s · Overwhelm — 18 cards, slower)
  scene2: { from: 240, duration: 132 }, //  0:08.0 – 0:12.4  (4.4s · v1.24 swipe-up + brand lockup + 4-feature flash)
  scene3: { from: 372, duration: 105 }, //  0:12.4 – 0:15.9  (3.5s · Dashboard reveal + mic zoom)
  scene4: { from: 477, duration: 105 }, //  0:15.9 – 0:19.4  (3.5s · Voice→Quote)
  scene5: { from: 582, duration: 60 }, //   0:19.4 – 0:21.4  (2.0s · Quote→Customer profile)
  scene6: { from: 642, duration: 90 }, //   0:21.4 – 0:24.4  (3.0s · Receipt→Expense)
  scene7: { from: 732, duration: 90 }, //   0:24.4 – 0:27.4  (3.0s · Map→Route)
  scene8: { from: 822, duration: 90 }, //   0:27.4 – 0:30.4  (3.0s · Pin→Follow-up)
  scene9: { from: 912, duration: 120 }, //  0:30.4 – 0:34.4  (4.0s · AI Business Assistant)
  scene10: { from: 1032, duration: 60 }, // 0:34.4 – 0:36.4  (2.0s · Final hero shot)
} as const;

// v1.24: persistent chevron top-right that begins gliding from center at
// local F48 of Scene 2 (= absolute F288) and parks at local F66 (= F306),
// remaining for the rest of the ad as a quiet brand presence.
// Scene 2 local-frame map (Scene 2 starts at absolute F240; v1.24 spec quoted
// absolute F180–F312, so we subtract 180 to get local frames):
//   F0–F12   swipe-up wipe
//   F12–F18  silence
//   F18–F36  brand lockup fades up centered
//   F36–F48  brand lockup holds
//   F48–F66  logo glides to top-right; wordmark + tagline fade
//   F66–F72  AI sparkle enters center
//   F72–F104 4-feature flash (Speak quotes / Save customers / Drive less / Win more jobs)
//   F104–F110 sparkle vortex
//   F110–F122 iPhone materializes
//   F122–F132 dashboard appears
export const PERSISTENT_LOGO_GLIDE_FROM = 288; // absolute frame glide begins
export const PERSISTENT_LOGO_PARKED_FROM = 306; // absolute frame chevron is parked top-right
