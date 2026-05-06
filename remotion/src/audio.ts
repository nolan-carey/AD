import { staticFile } from "remotion";

// Note: original filenames are misspelled in source (notication1, notifcation2). Kept as-is.
export const SFX = {
  click: staticFile("sound/click.mp3"),
  notification1: staticFile("sound/notication1.mp3"),
  notification2: staticFile("sound/notifcation2.mp3"),
  swoosh: staticFile("sound/swoosh.mp3"),
  riser: staticFile("sound/riser.mp3"),
  impact2: staticFile("sound/impact2.mp3"),
} as const;

// ElevenLabs-generated cinematic SFX layers (ad_plan §4.5.3).
// Locked prompts in test.py SFX_QUEUE — regenerate via generate_all().
// Files live in /remotion/public/sound/generated/ (gitignored).
// Note: `sparkle_match` was not generated (locked duration 0.4s < API min 0.5s).
// Per §4.5.5 fallback rule, Scene 4's category-lock cue uses notification1 pitched +5
// instead — until Steve revises the SFX_QUEUE entry.
export const GEN = {
  // P0 — atmospheric foundation
  phoneVibration: staticFile("sound/generated/phone_vibration_loop.mp3"),
  counterRoll: staticFile("sound/generated/counter_roll_money.mp3"),
  achievement: staticFile("sound/generated/achievement_chime.mp3"),
  aiHum: staticFile("sound/generated/ai_hum_ambient.mp3"),
  outroDrone: staticFile("sound/generated/outro_drone.mp3"),
  // P1 — bespoke UI moments
  morphWhirr: staticFile("sound/generated/iphone_morph_whirr.mp3"),
  scanSweep: staticFile("sound/generated/scan_sweep.mp3"),
  mapZoom: staticFile("sound/generated/map_zoom_whoosh.mp3"),
  routeFlow: staticFile("sound/generated/route_line_flow.mp3"),
  // P2 (v1.11) — per-scene atmospheric beds (replace shared aiHum underbed)
  bedIntimate: staticFile("sound/generated/bed_intimate_warm.mp3"),
  bedPrecise: staticFile("sound/generated/bed_precise_tense.mp3"),
  bedTactile: staticFile("sound/generated/bed_tactile_clinical.mp3"),
  bedSpatial: staticFile("sound/generated/bed_spatial_cinematic.mp3"),
  bedConversational: staticFile("sound/generated/bed_conversational_warm.mp3"),
  // P3 (v1.11) — transition stings (only 2 of 4 generated; 2 failed at 0.5s API floor)
  transWhoosh: staticFile("sound/generated/transition_warm_whoosh.mp3"), // 2→3
  transSoftFade: staticFile("sound/generated/transition_soft_fade.mp3"), // 5→6
  // ⏸ MISSING (Steve to revise durations, locked at 0.4s and 0.3s respectively):
  //  transition_sharp_impact (3→4)  — falls back to existing swoosh
  //  transition_glitch_cut (4→5)    — falls back to existing swoosh
} as const;

// Per ad_plan.md §3.5, reference PNGs from /ReferenceImages/ MUST NOT be placed
// directly into a scene composition as full-screen assets. The only allowed
// asset uses are:
//   - logo (real brand asset, Scenes 1 / 7)
//   - mapPlate (cropped map-only slice of IMG_2417, Scene 5 background plate)
// The other entries below are kept exported for the in-flight v1.7 refactor —
// they will be torn out scene-by-scene as each scene is rebuilt from components.
export const IMG = {
  logo: staticFile("images/logo.svg"),
  mapPlate: staticFile("plates/map_plate_london.png"),
  // ⚠️ Legacy — to be removed during v1.7 refactor:
  newCustomer: staticFile("images/IMG_2409.PNG"),
  aiAssistant: staticFile("images/IMG_2410.PNG"),
  customersList: staticFile("images/IMG_2416.PNG"),
  customersMap: staticFile("images/IMG_2417.PNG"),
  newQuote: staticFile("images/IMG_2418.PNG"),
  transcribing: staticFile("images/IMG_2419.PNG"),
  generating: staticFile("images/IMG_2420.PNG"),
  quoteReview: staticFile("images/IMG_2421.PNG"),
  newExpense: staticFile("images/IMG_2422.PNG"),
} as const;
