"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useFinePointer } from "./useFinePointer";

const SIZE = 1040;

/**
 * A soft light that follows the pointer across the whole stage. The
 * gradient is painted once on a fixed-size disc that's moved with a
 * transform, so following the mouse costs nothing to repaint.
 */
export function CursorLight() {
  const fine = useFinePointer();
  const x = useMotionValue(-SIZE);
  const y = useMotionValue(-SIZE);
  const springX = useSpring(x, { stiffness: 120, damping: 24 });
  const springY = useSpring(y, { stiffness: 120, damping: 24 });

  useEffect(() => {
    if (!fine) return;
    function handleMove(event: PointerEvent) {
      x.set(event.clientX - SIZE / 2);
      y.set(event.clientY - SIZE / 2);
    }
    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, [fine, x, y]);

  if (!fine) return null;
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 rounded-full"
      style={{
        x: springX,
        y: springY,
        width: SIZE,
        height: SIZE,
        background: "radial-gradient(closest-side, rgba(120,110,255,0.10), transparent)",
        willChange: "transform",
      }}
    />
  );
}
