"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "motion/react";
import { duration, ease } from "@/components/shared/motion";

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
  const [display, setDisplay] = useState(0);
  const played = useRef(false);

  useEffect(() => {
    if (!hasActivated || played.current) return;
    played.current = true;
    const controls = animate(0, value, {
      duration: duration.scene,
      ease: ease.in,
      onUpdate: setDisplay,
    });
    return () => controls.stop();
  }, [hasActivated, value]);

  return <span className={className}>{format(display)}</span>;
}
