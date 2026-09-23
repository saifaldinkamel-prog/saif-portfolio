/**
 * Static film-grain texture over the stage. Pure CSS/SVG, no animation.
 * Deliberately a plain (non-blended) layer on its own compositor layer:
 * a full-screen blend mode would be re-mixed every time the glow
 * beneath it changes, i.e. on every scroll frame.
 */
export function GrainLayer() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        opacity: "calc(var(--grain-opacity) * 0.55)",
        willChange: "transform",
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        backgroundRepeat: "repeat",
      }}
    />
  );
}
