"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "motion/react";
import { ease } from "@/components/shared/motion";

/**
 * A number that never snaps. On a screen's first visit it counts up
 * from 0; on a repeat visit it starts at its final value. Either way,
 * whenever `value` changes later (e.g. a new transaction lands), it
 * tweens from whatever is on screen to the new value.
 */
export function CountUpNumber({
  value,
  hasActivated,
  format = (n: number) => Math.round(n).toLocaleString("en-US"),
  className,
}: {
  value: number;
  hasActivated: boolean;
  format?: (n: number) => string;
  className?: string;
}) {
  const [display, setDisplay] = useState(hasActivated ? 0 : value);
  const shown = useRef(display);

  useEffect(() => {
    // Tween from the live on-screen value, so an interrupted run (or
    // Strict Mode's dev double-invoke) resumes instead of restarting.
    if (shown.current === value) return;
    const controls = animate(shown.current, value, {
      duration: 0.9,
      ease: ease.in,
      onUpdate: (latest) => {
        shown.current = latest;
        setDisplay(latest);
      },
    });
    return () => controls.stop();
  }, [value]);

  return <span className={className}>{format(display)}</span>;
}
