"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * Measures a section's own slice of the whole document's scroll
 * progress (0-1), for feeding into <SceneGlow range={...}>. Each scene
 * owns its range so the stage's light travels continuously across
 * scene boundaries instead of being hardcoded per scene.
 */
export function useSceneGlowRange<T extends HTMLElement = HTMLElement>(): [
  RefObject<T | null>,
  [number, number],
] {
  const ref = useRef<T | null>(null);
  const [range, setRange] = useState<[number, number]>([0, 1]);

  useEffect(() => {
    function measure() {
      const el = ref.current;
      if (!el) return;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const start = el.offsetTop / docHeight;
      const end = (el.offsetTop + el.offsetHeight - window.innerHeight) / docHeight;
      setRange([Math.max(0, start), Math.min(1, end)]);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return [ref, range];
}
