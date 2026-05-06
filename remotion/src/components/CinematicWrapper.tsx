import React from "react";
import { useCurrentFrame } from "remotion";

interface CinematicWrapperProps {
  children: React.ReactNode;
}

// =====================================================================
// CinematicWrapper — top-level environment for KivaAd.tsx (ad_plan §3.7.2)
// • Cinematic gradient: linear-gradient(135deg, #0F172A 0%, #000000 100%)
// • Subtle moving noise overlay (texture, prevents banding)
// • Vignette (radial corners darken to ~rgba(0,0,0,0.25))
// • 3D perspective context (perspective: 1500px, preserve-3d)
// • Constant camera drift (sine waves on translateX / translateY / rotateZ)
// All scenes render as `children` inside this wrapper.
// =====================================================================

export const CinematicWrapper: React.FC<CinematicWrapperProps> = ({
  children,
}) => {
  const frame = useCurrentFrame();

  // Camera drift baseline — companion doc §5.0
  const camTranslateX = Math.sin(frame / 36) * 4;
  const camTranslateY = Math.cos(frame / 30) * 2;
  const camRotateZ = Math.sin(frame / 48) * 0.3;

  // Noise drift — slow horizontal pan to add life to the texture
  const noiseOffset = (frame * 0.3) % 40;

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        position: "relative",
        perspective: "1500px",
        transformStyle: "preserve-3d",
        overflow: "hidden",
      }}
    >
      {/* Gradient background — Z = -100 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, #0F172A 0%, #000000 100%)",
          transform: "translateZ(-100px)",
          zIndex: 0,
        }}
      />

      {/* Animated noise overlay — Z = -90 */}
      <div
        style={{
          position: "absolute",
          inset: -40,
          backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(
            `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='1'/></svg>`
          )}")`,
          opacity: 0.025,
          mixBlendMode: "screen",
          transform: `translate(${noiseOffset}px, 0)`,
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Vignette — Z = -10 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.35) 100%)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* Camera drift wrapper — moves the entire scene as a unit */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${camTranslateX}px, ${camTranslateY}px) rotateZ(${camRotateZ}deg)`,
          transformOrigin: "center center",
          transformStyle: "preserve-3d",
          zIndex: 10,
        }}
      >
        {children}
      </div>

      {/* Soft edge falloff blur on outer 5% of frame */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 92%, rgba(0,0,0,0.15) 100%)",
          pointerEvents: "none",
          zIndex: 99,
        }}
      />
    </div>
  );
};
