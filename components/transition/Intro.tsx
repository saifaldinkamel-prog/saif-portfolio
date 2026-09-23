"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";

const STORAGE_KEY = "saif-intro-seen";
const IntroContext = createContext(true);

function noopSubscribe() {
  return () => {};
}

function readSeen(): boolean {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

/** Whether the opening sequence has handed the stage to the page yet. */
export function useIntroDone() {
  return useContext(IntroContext);
}

/**
 * The first-visit opening: the screen starts dark, a counter runs to
 * 100 while the name assembles, then the dark lifts off the Hero like a
 * curtain. Plays once per browser session; skipped under reduced
 * motion. Wraps the home page so Hero can hold its own entrance until
 * the curtain starts lifting.
 */
export function IntroGate({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  const alreadySeen = useSyncExternalStore(noopSubscribe, readSeen, () => false);
  const [phase, setPhase] = useState<"count" | "lift" | "done">("count");
  const skip = alreadySeen || Boolean(reduceMotion);
  const stageReady = skip || phase !== "count";

  const progress = useMotionValue(0);
  const counter = useTransform(progress, (v) => String(Math.round(v)).padStart(3, "0"));
  const barScale = useTransform(progress, [0, 100], [0, 1]);

  useEffect(() => {
    if (skip) return;
    document.documentElement.style.overflow = "hidden";
    const controls = animate(progress, 100, {
      duration: 1.9,
      ease: [0.65, 0, 0.35, 1],
      onComplete: () => setPhase("lift"),
    });
    return () => {
      controls.stop();
      document.documentElement.style.overflow = "";
    };
  }, [skip, progress]);

  function handleLifted() {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {}
    document.documentElement.style.overflow = "";
    setPhase("done");
  }

  const showCurtain = !skip && phase !== "done";

  return (
    <IntroContext.Provider value={stageReady}>
      {children}
      {showCurtain && (
        <motion.div
          id="intro"
          aria-hidden
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          animate={{ clipPath: phase === "lift" ? "inset(0% 0% 100% 0%)" : "inset(0% 0% 0% 0%)" }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
          onAnimationComplete={() => {
            if (phase === "lift") handleLifted();
          }}
          className="fixed inset-0 z-[95] flex flex-col justify-between bg-stage-void px-6 py-8 md:px-16 md:py-12"
        >
          <div className="flex items-center justify-between font-mono text-mono-label uppercase text-text-tertiary">
            <span>Saif.dev</span>
            <span>Built in the dark</span>
          </div>

          <div className="overflow-hidden">
            <motion.p
              initial={{ y: "110%" }}
              animate={{ y: phase === "lift" ? "-110%" : "0%" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: phase === "lift" ? 0 : 0.2 }}
              className="font-display text-display font-semibold text-text-primary"
            >
              Saifaldin Kamel
            </motion.p>
          </div>

          <div>
            <div className="h-px w-full overflow-hidden" style={{ backgroundColor: "var(--border-hairline)" }}>
              <motion.div className="h-full origin-left" style={{ scaleX: barScale, backgroundColor: "var(--signal)" }} />
            </div>
            <div className="mt-4 flex items-end justify-between">
              <span className="font-mono text-mono-label uppercase text-text-tertiary">Turning the lights on</span>
              <motion.span className="font-display text-[clamp(3rem,10vw,8rem)] font-semibold leading-none text-text-primary tabular-nums">
                {counter}
              </motion.span>
            </div>
          </div>
        </motion.div>
      )}
      <noscript>
        <style>{"#intro{display:none!important}"}</style>
      </noscript>
    </IntroContext.Provider>
  );
}
