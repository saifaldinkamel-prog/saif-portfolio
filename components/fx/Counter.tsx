"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "motion/react";

/** Counts from 0 up to `to` the first time it scrolls into view. */
export function Counter({
  to,
  pad = 0,
  suffix = "",
  className = "",
}: {
  to: number;
  pad?: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reduceMotion = useReducedMotion();
  const value = useMotionValue(0);
  const text = useTransform(value, (v) => `${String(Math.round(v)).padStart(pad, "0")}${suffix}`);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(value, to, { duration: reduceMotion ? 0 : 1.8, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [inView, to, value, reduceMotion]);

  return (
    <motion.span ref={ref} className={className}>
      {text}
    </motion.span>
  );
}
