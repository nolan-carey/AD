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
