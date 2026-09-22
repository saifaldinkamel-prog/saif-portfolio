"use client";

import { animate, useMotionValue, type PanInfo } from "motion/react";
import { springGesture } from "./motion";

interface UseSwipeGestureOptions {
  axis?: "x" | "y";
  /** Pixel distance that commits a swipe. */
  threshold?: number;
  /** Alternative to distance: a fast flick commits even under threshold. */
  velocityThreshold?: number;
  /** direction follows the drag's own sign: 1 = toward positive x/y, -1 = toward negative. */
  onCommit: (direction: 1 | -1) => void;
}

/**
 * Pointer tracking + rubber-band resistance + commit threshold + spring
 * settle, as a single hook. Built once for PocketBalance's transaction-
 * review card; Playground's "swipe to categorize" demo (Phase 3) reuses
 * this exact hook rather than reimplementing the gesture.
 */
export function useSwipeGesture({
  axis = "x",
  threshold = 96,
  velocityThreshold = 500,
  onCommit,
}: UseSwipeGestureOptions) {
  const offset = useMotionValue(0);

  function onDragEnd(_: unknown, info: PanInfo) {
    const distance = axis === "x" ? info.offset.x : info.offset.y;
    const velocity = axis === "x" ? info.velocity.x : info.velocity.y;

    if (distance >= threshold || velocity >= velocityThreshold) {
      onCommit(1);
    } else if (distance <= -threshold || velocity <= -velocityThreshold) {
      onCommit(-1);
    }
    animate(offset, 0, springGesture);
  }

  return {
    drag: axis,
    dragElastic: 0.35,
    dragConstraints: { top: 0, bottom: 0, left: 0, right: 0 },
    dragTransition: {
      bounceStiffness: springGesture.stiffness,
      bounceDamping: springGesture.damping,
    },
    onDragEnd,
    style: axis === "x" ? { x: offset } : { y: offset },
    offset,
  } as const;
}
