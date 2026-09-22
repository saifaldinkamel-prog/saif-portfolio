"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export interface SceneGlowConfig {
  /** Unique id, typically the scene's name. */
  id: string;
  /** The slice of overall scroll progress (0-1) this scene owns. */
  range: [number, number];
  /** Light position as a percentage of the viewport (0-100). */
  x: number;
  y: number;
  /** Defaults to the signal color if omitted. */
  color?: string;
  /** Relative brightness, 0-1. Defaults to 1. */
  intensity?: number;
}

interface SceneGlowRegistry {
  glows: Map<string, SceneGlowConfig>;
  /** Bumped on every register/unregister so consumers can react without polling. */
  version: number;
  register: (config: SceneGlowConfig) => void;
  unregister: (id: string) => void;
}

const SceneGlowContext = createContext<SceneGlowRegistry | null>(null);

/**
 * Holds the registry every mounted <SceneGlow> writes into. <GlowField>
 * reads from the same registry to render the single interpolated light
 * the visitor actually sees.
 */
export function SceneGlowProvider({ children }: { children: ReactNode }) {
  // A Map with stable identity, mutated in place. Not a ref: state
  // values may be read during render, so the "outside of render" rule
  // that rules out useRef here doesn't apply.
  const [glows] = useState<Map<string, SceneGlowConfig>>(() => new Map());
  const [version, setVersion] = useState(0);

  // Stable identity across re-renders: SceneGlow's effect depends on
  // these, and an unstable identity here would re-fire that effect on
  // every registration, which bumps `version`, which re-renders this
  // provider, which recreates the functions — an infinite loop.
  const register = useCallback((config: SceneGlowConfig) => {
    glows.set(config.id, config);
    setVersion((n) => n + 1);
  }, [glows]);

  const unregister = useCallback((id: string) => {
    glows.delete(id);
    setVersion((n) => n + 1);
  }, [glows]);

  return (
    <SceneGlowContext.Provider value={{ glows, version, register, unregister }}>
      {children}
    </SceneGlowContext.Provider>
  );
}

function useSceneGlowRegistry(): SceneGlowRegistry {
  const ctx = useContext(SceneGlowContext);
  if (!ctx) {
    throw new Error(
      "SceneGlow must be used within a SceneGlowProvider (mount <StageShell> at the app root)."
    );
  }
  return ctx;
}

export function useSceneGlows(): Map<string, SceneGlowConfig> {
  return useSceneGlowRegistry().glows;
}

/** Exposes the registry's version counter so <GlowField> can force a
 * recompute the instant a scene registers/unregisters, independent of
 * scroll — otherwise a newly-mounted glow wouldn't appear until the
 * visitor's next scroll tick. */
export function useSceneGlowVersion(): number {
  return useSceneGlowRegistry().version;
}

/**
 * Mounted by a scene to declare where its light lives. Renders nothing
 * itself — <GlowField> owns the actual visuals so the light can be
 * interpolated smoothly across scene boundaries instead of one glow
 * being swapped abruptly for the next.
 */
export function SceneGlow(config: SceneGlowConfig) {
  const { register, unregister } = useSceneGlowRegistry();
  const { id, range, x, y, color, intensity } = config;
  const [rangeStart, rangeEnd] = range;

  useEffect(() => {
    register({ id, range: [rangeStart, rangeEnd], x, y, color, intensity });
    return () => unregister(id);
  }, [id, rangeStart, rangeEnd, x, y, color, intensity, register, unregister]);

  return null;
}
