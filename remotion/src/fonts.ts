import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

// Inter — closest free analogue to iOS system font, used across the design spec.
export const { fontFamily: INTER } = loadInter("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});
