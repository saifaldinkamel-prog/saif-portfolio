/**
 * Static film-grain texture over the stage. Pure CSS/SVG — no images,
 * no animation (the handoff's "nothing else animates on its own" rule
 * applies here too: grain does not flicker or shift).
 */
export function GrainLayer() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        opacity: "var(--grain-opacity)",
        mixBlendMode: "overlay",
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        backgroundRepeat: "repeat",
      }}
    />
  );
}
