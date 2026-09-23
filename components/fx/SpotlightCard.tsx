"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";

/** A panel with a light that tracks the pointer inside it, plus a lit border. */
export function SpotlightCard({
  children,
  className = "",
  color = "rgba(61,214,140,0.16)",
}: {
  children: ReactNode;
  className?: string;
  color?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const glow = useMotionTemplate`radial-gradient(360px circle at ${x}px ${y}px, ${color}, transparent 65%)`;
  const edge = useMotionTemplate`radial-gradient(240px circle at ${x}px ${y}px, rgba(255,255,255,0.28), transparent 70%)`;

  function handleMove(event: PointerEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  }

  function handleLeave() {
    x.set(-400);
    y.set(-400);
  }

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={`group relative overflow-hidden rounded-2xl p-px ${className}`}
      style={{ backgroundColor: "var(--border-hairline)" }}
    >
      <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: edge }} />
      <div className="relative h-full overflow-hidden rounded-[calc(1rem-1px)] bg-stage-panel">
        <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: glow }} />
        <div className="relative h-full">{children}</div>
      </div>
    </div>
  );
}
