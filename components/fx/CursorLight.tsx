"use client";

import { useEffect } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import { useFinePointer } from "./useFinePointer";

/** A soft light that follows the pointer across the whole stage. */
export function CursorLight() {
  const fine = useFinePointer();
  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);
  const springX = useSpring(x, { stiffness: 120, damping: 24 });
  const springY = useSpring(y, { stiffness: 120, damping: 24 });
  const background = useMotionTemplate`radial-gradient(520px circle at ${springX}px ${springY}px, rgba(120,110,255,0.10), transparent 70%)`;

  useEffect(() => {
    if (!fine) return;
    function handleMove(event: PointerEvent) {
      x.set(event.clientX);
      y.set(event.clientY);
    }
    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, [fine, x, y]);

  if (!fine) return null;
  return <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background }} />;
}
