"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useScroll, type MotionValue } from "motion/react";

const ScrollProgressContext = createContext<MotionValue<number> | null>(null);

/**
 * Tracks whole-document scroll progress (0 at top, 1 at bottom) as a
 * single Motion value. Every scene-level effect (SceneGlow position,
 * PocketBalance's screenIndex, future light/color interpolation) reads
 * from this one source so the stage feels continuous rather than
 * stitched together per section.
 */
export function ScrollProgressProvider({ children }: { children: ReactNode }) {
  const { scrollYProgress } = useScroll();

  return (
    <ScrollProgressContext.Provider value={scrollYProgress}>
      {children}
    </ScrollProgressContext.Provider>
  );
}

export function useScrollProgress(): MotionValue<number> {
  const value = useContext(ScrollProgressContext);
  if (!value) {
    throw new Error(
      "useScrollProgress must be used within a ScrollProgressProvider (mount <StageShell> at the app root)."
    );
  }
  return value;
}
