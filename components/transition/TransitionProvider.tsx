"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ComponentProps,
  type MouseEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, useReducedMotion, type Variants } from "motion/react";

type Phase = "idle" | "cover" | "hold";

const CURTAIN_EASE = [0.76, 0, 0.24, 1] as const;

const curtain: Variants = {
  idle: { clipPath: "inset(100% 0% 0% 0%)", transition: { duration: 0 } },
  cover: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 0.65, ease: CURTAIN_EASE } },
  hold: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 0 } },
  reveal: { clipPath: "inset(0% 0% 100% 0%)", transition: { duration: 0.75, ease: CURTAIN_EASE, delay: 0.2 } },
};

const TransitionContext = createContext<((href: string, label?: string) => void) | null>(null);

/**
 * Cinematic route changes: a curtain rises over the page carrying the
 * destination's name, the route swaps underneath it, then the curtain
 * lifts off the new page. Lives in the root layout so it survives the
 * navigation it's animating. Same-page hash links just smooth-scroll.
 */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");
  const [label, setLabel] = useState("");
  const [fromPath, setFromPath] = useState<string | null>(null);
  const pendingHref = useRef<string | null>(null);

  const navigate = useCallback(
    (href: string, nextLabel = "") => {
      const url = new URL(href, window.location.href);
      if (url.pathname === window.location.pathname) {
        const target = url.hash ? document.querySelector(url.hash) : null;
        if (target) target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
        else window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
        return;
      }
      if (reduceMotion || phase !== "idle") {
        router.push(href);
        return;
      }
      pendingHref.current = href;
      setLabel(nextLabel);
      setPhase("cover");
    },
    [router, reduceMotion, phase]
  );

  const revealing = phase === "hold" && fromPath !== null && pathname !== fromPath;
  const state = phase === "idle" ? "idle" : revealing ? "reveal" : phase;

  function handleComplete(definition: unknown) {
    if (definition === "cover" && pendingHref.current) {
      setFromPath(pathname);
      setPhase("hold");
      router.push(pendingHref.current);
      pendingHref.current = null;
    } else if (definition === "reveal") {
      setPhase("idle");
      setFromPath(null);
    }
  }

  return (
    <TransitionContext.Provider value={navigate}>
      {children}
      <motion.div
        aria-hidden
        initial="idle"
        animate={state}
        variants={curtain}
        onAnimationComplete={handleComplete}
        className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-stage-void"
        style={{ pointerEvents: phase === "idle" ? "none" : "auto" }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(60% 50% at 50% 55%, rgba(87,72,220,0.35), transparent 70%)" }}
        />
        <motion.p
          className="relative font-mono text-mono-label uppercase text-signal-text"
          animate={{ opacity: phase === "idle" ? 0 : 1 }}
        >
          Entering
        </motion.p>
        <motion.p
          className="relative mt-4 px-6 text-center font-display text-display font-semibold text-text-primary"
          animate={{ opacity: phase === "idle" ? 0 : 1, y: phase === "idle" ? 30 : 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        >
          {label || "Saif"}
        </motion.p>
        <motion.span
          className="relative mt-8 h-px w-40 origin-left"
          style={{ backgroundColor: "var(--signal)" }}
          animate={{ scaleX: phase === "idle" ? 0 : 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        />
      </motion.div>
    </TransitionContext.Provider>
  );
}

export function useSceneTransition() {
  const navigate = useContext(TransitionContext);
  if (!navigate) throw new Error("useSceneTransition must be used inside <TransitionProvider>.");
  return navigate;
}

/** A next/link that plays the scene transition instead of a hard cut. */
export function TransitionLink({
  href,
  label,
  onClick,
  ...props
}: Omit<ComponentProps<typeof Link>, "href"> & { href: string; label?: string }) {
  const navigate = useSceneTransition();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    navigate(href, label);
  }

  return <Link href={href} onClick={handleClick} {...props} />;
}
