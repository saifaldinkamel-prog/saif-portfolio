"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type AnimationPlaybackControls,
} from "motion/react";

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

  const counting = useRef<AnimationPlaybackControls | null>(null);

  useEffect(() => {
    if (skip) return;
    document.documentElement.style.overflow = "hidden";
    counting.current = animate(progress, 100, {
      duration: 1.9,
      ease: [0.65, 0, 0.35, 1],
      onComplete: () => setPhase((current) => (current === "count" ? "lift" : current)),
    });
    return () => {
      counting.current?.stop();
      document.documentElement.style.overflow = "";
    };
  }, [skip, progress]);

  // Anyone in a hurry can skip: any key, click, or tap lifts the curtain now.
  const skipIntro = useCallback(() => {
    counting.current?.stop();
    animate(progress, 100, { duration: 0.25 });
    setPhase((current) => (current === "count" ? "lift" : current));
  }, [progress]);

  useEffect(() => {
    if (skip || phase !== "count") return;
    window.addEventListener("keydown", skipIntro);
    return () => window.removeEventListener("keydown", skipIntro);
  }, [skip, phase, skipIntro]);

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
          onPointerDown={skipIntro}
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
              <span className="flex flex-col gap-2 font-mono text-mono-label uppercase text-text-tertiary">
                <span>Turning the lights on</span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  className="text-text-secondary"
                >
                  Tap anywhere to skip
                </motion.span>
              </span>
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
