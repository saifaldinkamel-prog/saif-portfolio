/**
 * JS-side mirror of the motion durations/easings declared in
 * styles/tokens.css. Motion's `transition` API takes seconds, easing
 * arrays, and spring configs — not CSS strings — so these values can't
 * be read from CSS variables at animation time. Keep the numbers here
 * in sync with tokens.css by hand; this file is the canonical source
 * for anything driven by the Motion library, tokens.css remains
 * canonical for pure-CSS transitions.
 */

export const duration = {
  instant: 0.08, // --dur-instant: 80ms
  fast: 0.15, // --dur-fast: 150ms
  base: 0.24, // --dur-base: 240ms
  scene: 0.42, // --dur-scene: 420ms
  cinematic: 0.7, // --dur-cinematic: 700ms
} as const;

export const ease = {
  in: [0.16, 1, 0.3, 1], // --ease-in-motion — everything entering
  out: [0.7, 0, 0.84, 0], // --ease-out-motion — everything exiting
} as const;

/** Drag/swipe settle spring, shared by the PocketBalance phone and the
 * Playground "swipe to categorize" card via useSwipeGesture. */
export const springGesture = {
  type: "spring",
  stiffness: 500,
  damping: 35,
} as const;

/** Exits run at ~70% of the matching entrance duration, per the handoff. */
export function exitDuration(entrance: number): number {
  return entrance * 0.7;
}
