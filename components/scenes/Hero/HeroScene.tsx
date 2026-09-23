"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { SceneGlow } from "@/components/stage/SceneGlow";
import { useSceneGlowRange } from "@/components/stage/useSceneGlowRange";
import { DotField } from "@/components/fx/DotField";
import { SplitReveal } from "@/components/fx/SplitReveal";
import { ScrambleText } from "@/components/fx/ScrambleText";
import { Magnetic } from "@/components/fx/Magnetic";
import { LocalTime } from "@/components/fx/LocalTime";
import { useIntroDone } from "@/components/transition/Intro";

const ROLES = ["Frontend Developer", "Mobile App Developer", "React Native Developer", "UI Engineer"] as const;
const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The opening scene: a dark dot field that the visitor's cursor lights
 * up, a giant name whose letters react to hover, and a role line that
 * decodes itself. Everything waits for the intro curtain to lift, then
 * the whole scene drifts up and dims as the visitor scrolls away.
 */
export function HeroScene() {
  const [sectionRef, range] = useSceneGlowRange<HTMLElement>();
  const introDone = useIntroDone();
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const nameY = useTransform(scrollYProgress, [0, 1], ["0%", reduceMotion ? "0%" : "35%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const enter = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: introDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    transition: { duration: 0.9, ease: EASE, delay },
  });

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative flex min-h-[100svh] flex-col overflow-hidden px-6 pb-8 pt-8 md:px-16 md:pb-12 md:pt-10"
    >
      <SceneGlow id="hero" range={range} x={70} y={55} color="var(--cool-glow)" intensity={0.45} />

      <div className="absolute inset-0">
        <DotField />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 50% 40%, transparent 30%, var(--stage-void) 85%)" }}
        />
      </div>

      <motion.div
        {...enter(0.1)}
        className="relative z-10 flex items-center justify-between font-mono text-mono-label uppercase text-text-tertiary"
      >
        <span>Portfolio &copy; 2026</span>
        <span className="hidden sm:inline">
          Giza, Egypt &middot; <LocalTime /> local
        </span>
      </motion.div>

      <motion.div
        style={{ y: nameY, opacity: fade }}
        className="relative z-10 flex flex-1 flex-col justify-center py-16"
      >
        <motion.p {...enter(0.15)} className="font-mono text-mono-label uppercase text-signal-text">
          Hello, I&rsquo;m
        </motion.p>

        <h1 className="mt-4 font-display font-semibold leading-[0.88] tracking-[-0.05em] text-text-primary text-[clamp(3.6rem,15vw,13.5rem)]">
          <SplitReveal text="Saifaldin" by="char" trigger="mount" play={introDone} delay={0.1} interactive className="block" as="span" />
          <SplitReveal
            text="Kamel"
            by="char"
            trigger="mount"
            play={introDone}
            delay={0.35}
            interactive
            className="block text-outline"
            as="span"
          />
        </h1>

        <motion.div {...enter(0.7)} className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="h-px w-10" style={{ backgroundColor: "var(--signal)" }} />
          <ScrambleText
            words={ROLES}
            start={introDone}
            className="font-mono text-[clamp(0.95rem,1.6vw,1.25rem)] uppercase tracking-[0.12em] text-text-primary"
          />
        </motion.div>
      </motion.div>

      <motion.div
        {...enter(0.9)}
        className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
      >
        <p className="max-w-sm font-sans text-body text-text-secondary">
          I design and build interfaces that feel as good as they work — for the web and for
          mobile.
        </p>

        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2.5 font-mono text-mono-label uppercase text-text-secondary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
            </span>
            Open to internships
          </span>

          <Magnetic strength={0.4}>
            <a
              href="#about"
              data-cursor="Scroll"
              aria-label="Scroll to About"
              className="flex h-16 w-16 items-center justify-center rounded-full border text-text-primary transition-colors hover:bg-white/5"
              style={{ borderColor: "var(--border-hairline)" }}
            >
              <motion.span
                animate={reduceMotion ? undefined : { y: [0, 6, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                className="text-xl leading-none"
              >
                &darr;
              </motion.span>
            </a>
          </Magnetic>
        </div>
      </motion.div>
    </section>
  );
}
