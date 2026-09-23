"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";

function wrap(min: number, max: number, value: number): number {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
}

/**
 * An endless ticker whose speed and direction follow the visitor's
 * scroll velocity — scroll faster and it races, scroll up and it
 * reverses. Four copies of the content loop seamlessly.
 */
export function VelocityMarquee({
  children,
  baseVelocity = -3,
  className = "",
}: {
  children: ReactNode;
  baseVelocity?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], { clamp: false });
  const x = useTransform(baseX, (value) => `${wrap(-25, -50, value)}%`);
  const direction = useRef(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { margin: "100px 0px" });

  useAnimationFrame((_, delta) => {
    if (reduceMotion || !inView) return;
    let moveBy = direction.current * baseVelocity * (delta / 1000);
    const factor = velocityFactor.get();
    if (factor < 0) direction.current = -1;
    else if (factor > 0) direction.current = 1;
    moveBy += direction.current * moveBy * factor;
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div ref={containerRef} className={`flex flex-nowrap overflow-hidden whitespace-nowrap ${className}`}>
      <motion.div className="flex flex-nowrap whitespace-nowrap" style={{ x, willChange: "transform" }}>
        {[0, 1, 2, 3].map((copy) => (
          <span key={copy} aria-hidden={copy > 0} className="block shrink-0">
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
