"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";

const MAX_TILT_DEG = 2.5;

/**
 * Shared phone bezel, free of any PocketBalance or scene knowledge.
 *
 * Tracks the pointer to apply a subtle 3D tilt (max ~2.5deg) and a glass
 * reflection sheen that shifts with it — a direct, spring-smoothed
 * function of real pointer position via Motion.
 */
export function DeviceFrame({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);

  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const springX = useSpring(pointerX, { stiffness: 150, damping: 20, mass: 0.5 });
  const springY = useSpring(pointerY, { stiffness: 150, damping: 20, mass: 0.5 });

  const rotateY = useTransform(springX, [0, 1], [-MAX_TILT_DEG, MAX_TILT_DEG]);
  const rotateX = useTransform(springY, [0, 1], [MAX_TILT_DEG, -MAX_TILT_DEG]);
  const sheenX = useTransform(springX, [0, 1], [10, 90]);
  const sheenY = useTransform(springY, [0, 1], [0, 60]);
  const sheenPosition = useMotionTemplate`${sheenX}% ${sheenY}%`;

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (reduceMotion) return;
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    pointerX.set((event.clientX - rect.left) / rect.width);
    pointerY.set((event.clientY - rect.top) / rect.height);
  }

  function handlePointerLeave() {
    pointerX.set(0.5);
    pointerY.set(0.5);
  }

  return (
    <div style={{ perspective: 1200 }} className="w-full max-w-[320px]">
      <motion.div
        ref={frameRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{
          rotateX: reduceMotion ? 0 : rotateX,
          rotateY: reduceMotion ? 0 : rotateY,
          // A static shadow: a drop-shadow filter that follows the tilt
          // would re-render the whole phone on every pointer move.
          boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
          transformStyle: "preserve-3d",
        }}
        className="relative aspect-[9/19.5] w-full rounded-[2.5rem] border border-border-hairline bg-stage-deep p-3"
      >
        <div
          aria-hidden
          className="absolute left-1/2 top-3 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-stage-void"
        />
        <div className="relative h-full w-full overflow-hidden rounded-[1.75rem] bg-stage-screen">
          {children}

          {/* Glass reflection sheen — shifts gently with the pointer. */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10"
            style={{
              background: useMotionTemplate`radial-gradient(120% 80% at ${sheenPosition}, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 55%)`,
            }}
          />
          {/* Static top-edge glass highlight. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 100%)",
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
