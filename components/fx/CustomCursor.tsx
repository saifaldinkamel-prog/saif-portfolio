"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useFinePointer } from "./useFinePointer";

const INTERACTIVE = "[data-cursor], a, button, [role='tab']";

/**
 * A two-part cursor: a precise dot plus a spring-lagged ring that grows
 * over anything interactive and turns into a labelled disc over
 * elements carrying `data-cursor="Label"`. Mouse/trackpad only — touch
 * devices keep their native behavior.
 */
export function CustomCursor() {
  const fine = useFinePointer();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 520, damping: 42, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 520, damping: 42, mass: 0.6 });

  const [label, setLabel] = useState<string | null>(null);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (!fine) return;
    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    function handleMove(event: PointerEvent) {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
      const target = (event.target as Element | null)?.closest?.(INTERACTIVE) ?? null;
      setHovering(Boolean(target));
      setLabel(target?.getAttribute("data-cursor") || null);
    }
    const handleLeave = () => setVisible(false);
    const handleDown = () => setPressed(true);
    const handleUp = () => setPressed(false);

    window.addEventListener("pointermove", handleMove, { passive: true });
    document.addEventListener("pointerleave", handleLeave);
    window.addEventListener("pointerdown", handleDown);
    window.addEventListener("pointerup", handleUp);
    return () => {
      root.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", handleMove);
      document.removeEventListener("pointerleave", handleLeave);
      window.removeEventListener("pointerdown", handleDown);
      window.removeEventListener("pointerup", handleUp);
    };
  }, [fine, x, y]);

  if (!fine) return null;

  const ringSize = label ? 88 : hovering ? 56 : 34;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      <motion.div className="absolute left-0 top-0" style={{ x: ringX, y: ringY }}>
        <motion.div
          className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
          animate={{
            width: ringSize,
            height: ringSize,
            opacity: visible ? 1 : 0,
            scale: pressed ? 0.85 : 1,
            backgroundColor: label ? "rgba(61,214,140,1)" : "rgba(61,214,140,0)",
            borderColor: label ? "rgba(61,214,140,0)" : "rgba(242,244,247,0.55)",
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          style={{ borderWidth: 1, borderStyle: "solid", mixBlendMode: label ? "normal" : "difference" }}
        >
          <AnimatePresence>
            {label && (
              <motion.span
                key={label}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.18 }}
                className="font-mono text-[11px] font-medium uppercase tracking-[0.14em]"
                style={{ color: "var(--on-signal)" }}
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      <motion.div className="absolute left-0 top-0" style={{ x, y }}>
        <motion.div
          className="h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
          animate={{ opacity: visible && !label ? 1 : 0 }}
          style={{ backgroundColor: "var(--signal)" }}
        />
      </motion.div>
    </div>
  );
}
