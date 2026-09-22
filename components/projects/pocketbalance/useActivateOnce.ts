"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Latches to true the first time `isActive` is true, and stays true
 * forever after — even once `isActive` later goes false and true
 * again. Screens are never unmounted (the phone keeps all four
 * mounted, sliding between them), so this is what makes "animate once,
 * on first activation, never on re-entry" possible.
 */
export function useActivateOnce(isActive: boolean): boolean {
  const [hasActivated, setHasActivated] = useState(false);
  const played = useRef(false);

  useEffect(() => {
    if (isActive && !played.current) {
      played.current = true;
      setHasActivated(true);
    }
  }, [isActive]);

  return hasActivated;
}
