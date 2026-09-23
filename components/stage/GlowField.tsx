"use client";

import { useEffect } from "react";
import { motion, useTransform } from "motion/react";
import { useScrollProgress } from "./ScrollProgress";
import {
  useSceneGlows,
  useSceneGlowVersion,
  type SceneGlowConfig,
} from "./SceneGlow";

/** Shown when no scene has registered a glow yet — a calm resting light
 * rather than a flat void. Scenes override this once they mount. */
const DEFAULT_GLOW: SceneGlowConfig = {
  id: "__default",
  range: [0, 1],
  x: 50,
  y: 38,
  color: "var(--signal)",
  intensity: 0.45,
};

const TRANSITION_ZONE = 0.2; // fraction of a glow's range spent crossfading into the next

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function pickBracket(
  glows: SceneGlowConfig[],
  progress: number
): { active: SceneGlowConfig; next?: SceneGlowConfig } {
  const sorted = [...glows].sort((a, b) => a.range[0] - b.range[0]);
  let active = sorted[0];
  for (const glow of sorted) {
    if (progress >= glow.range[0]) active = glow;
  }
  const next = sorted[sorted.indexOf(active) + 1];
  return { active, next };
}

function blendWeight(
  active: SceneGlowConfig,
  next: SceneGlowConfig | undefined,
  progress: number
): number {
  if (!next) return 0;
  const [start, end] = active.range;
  const zoneStart = end - (end - start) * TRANSITION_ZONE;
  const span = end - zoneStart || 1;
  return clamp01((progress - zoneStart) / span);
}

function glowLayer(glow: SceneGlowConfig, weight: number): string | null {
  const intensity = (glow.intensity ?? 1) * weight;
  if (intensity <= 0.001) return null;
  const color = glow.color ?? "var(--signal)";
  const alphaPercent = Math.round(intensity * 55);
  return `radial-gradient(circle at ${glow.x}% ${glow.y}%, color-mix(in srgb, ${color} ${alphaPercent}%, transparent) 0%, transparent 70%)`;
}

function buildGlowBackground(
  progress: number,
  glows: SceneGlowConfig[]
): string {
  if (glows.length === 0) return "none";
  const { active, next } = pickBracket(glows, progress);
  const t = blendWeight(active, next, progress);
  const layers = [next ? glowLayer(next, t) : null, glowLayer(active, 1 - t)].filter(
    (layer): layer is string => Boolean(layer)
  );
  return layers.length > 0 ? layers.join(", ") : "none";
}

/**
 * Renders the one light the visitor actually sees, interpolated from
 * whichever <SceneGlow> instances are currently registered. Falls back
 * to a default resting glow when no scene has mounted one yet.
 */
export function GlowField() {
  const progress = useScrollProgress();
  const glows = useSceneGlows();
  const version = useSceneGlowVersion();

  const background = useTransform(progress, (value) => {
    const registered = Array.from(glows.values());
    return buildGlowBackground(value, registered.length > 0 ? registered : [DEFAULT_GLOW]);
  });

  // A scene registering/unregistering doesn't itself move scroll, so
  // nudge the motion value to force the derived background to
  // re-evaluate against the updated registry right away.
  useEffect(() => {
    progress.set(progress.get());
  }, [version, progress]);

  // The glow repaints on every scroll frame, so keep each repaint cheap:
  // no blur filter (the gradients already fade out), and paint it at a
  // quarter of the size then scale it up — a soft gradient looks the
  // same enlarged, at ~1/16 of the pixels to redraw.
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 h-1/4 w-1/4"
      style={{ background, scale: 4, originX: 0, originY: 0, willChange: "transform" }}
    />
  );
}
