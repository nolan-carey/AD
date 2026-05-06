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

// Master timeline anchor (ad_plan.md §5 v1.22 — 33s/990 frames, 10 scenes).
// v1.22: Scene 2 extended 60→90f for iPhone + Kiva app opening reveal;
// Scenes 3-10 shifted +30 frames as a temporary placement until the user
// picks a/b/c on the runtime ripple decision (PENDING APPROVALS).
export const FPS = 30;
export const TOTAL_FRAMES = 990; // 33s @ 30fps

export const SCENES = {
  scene1: { from: 0, duration: 180 }, //    0:00.0 – 0:06.0  (6.0s · Overwhelm)
  scene2: { from: 180, duration: 90 }, //   0:06.0 – 0:09.0  (3.0s · iPhone + Kiva app opening — v1.22)
  scene3: { from: 270, duration: 105 }, //  0:09.0 – 0:12.5  (3.5s · Dashboard reveal + mic zoom · +30 v1.22)
  scene4: { from: 375, duration: 105 }, //  0:12.5 – 0:16.0  (3.5s · Voice→Quote · +30 v1.22)
  scene5: { from: 480, duration: 60 }, //   0:16.0 – 0:18.0  (2.0s · Quote→Customer profile · +30 v1.22)
  scene6: { from: 540, duration: 90 }, //   0:18.0 – 0:21.0  (3.0s · Receipt→Expense · +30 v1.22)
  scene7: { from: 630, duration: 90 }, //   0:21.0 – 0:24.0  (3.0s · Map→Route · +30 v1.22)
  scene8: { from: 720, duration: 90 }, //   0:24.0 – 0:27.0  (3.0s · Pin→Follow-up · +30 v1.22)
  scene9: { from: 810, duration: 120 }, //  0:27.0 – 0:31.0  (4.0s · AI Business Assistant · +30 v1.22)
  scene10: { from: 930, duration: 60 }, //  0:31.0 – 0:33.0  (2.0s · Final hero shot · +30 v1.22)
} as const;
