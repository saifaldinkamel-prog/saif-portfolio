"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { SceneGlow } from "@/components/stage/SceneGlow";
import { useSceneGlowRange } from "@/components/stage/useSceneGlowRange";
import { SplitReveal } from "@/components/fx/SplitReveal";
import { Magnetic } from "@/components/fx/Magnetic";
import { TransitionLink } from "@/components/transition/TransitionProvider";
import { PocketBalanceStill } from "@/components/scenes/Projects/previews";
import { projects } from "@/components/scenes/Projects/projects";

const EASE = [0.16, 1, 0.3, 1] as const;
const RING_TEXT = "Step inside • Step inside • Step inside • ";

/**
 * The home page's doorway to the work: what I'm building right now,
 * framed as the main thing rather than "project 1 of 1". A short
 * teaser only — the full story lives on the project's own page.
 */
export function CurrentWorkScene() {
  const [sectionRef, range] = useSceneGlowRange<HTMLElement>();
  const reduceMotion = useReducedMotion();
  const project = projects[0];
  const phoneRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: phoneRef, offset: ["start end", "end start"] });
  const phoneY = useTransform(scrollYProgress, [0, 1], reduceMotion ? ["0%", "0%"] : ["12%", "-12%"]);
  const phoneRotate = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [-8, 6]);
  const href = `/projects/${project.slug}`;

  return (
    <section id="work" ref={sectionRef} className="relative overflow-hidden px-6 py-32 md:px-16 md:py-44">
      <SceneGlow id="work" range={range} x={62} y={50} color={project.accent} intensity={0.5} />

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-[1.2fr_1fr]">
        <div className="min-w-0">
          <p className="font-mono text-mono-label uppercase text-signal-text">(02) &mdash; Currently building</p>

          <SplitReveal
            as="h2"
            text={project.name}
            by="char"
            interactive
            className="mt-6 whitespace-nowrap font-display text-[clamp(2.4rem,5.6vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-text-primary"
          />

          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-signal-border bg-signal-wash px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-signal-text"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
            </span>
            Real {project.type} &middot; {project.status}
          </motion.span>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
            className="mt-6 max-w-md font-sans text-body-lead text-text-secondary"
          >
            Your bank already texts you every payment. PocketBalance turns those texts into a live
            balance and clear spending insights &mdash; no typing.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.4 }}
            className="mt-6 flex flex-wrap gap-2"
          >
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-text-secondary"
                style={{ borderColor: "var(--border-hairline)" }}
              >
                {tag}
              </span>
            ))}
          </motion.div>

          <div className="mt-12">
            <Magnetic strength={0.3}>
              <TransitionLink
                href={href}
                label={project.name}
                data-cursor="Enter"
                className="relative flex h-40 w-40 items-center justify-center rounded-full"
              >
                <motion.svg
                  aria-hidden
                  viewBox="0 0 200 200"
                  className="absolute inset-0 h-full w-full"
                  animate={reduceMotion ? undefined : { rotate: 360 }}
                  transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                >
                  <defs>
                    <path id="work-ring" d="M100,100 m-82,0 a82,82 0 1,1 164,0 a82,82 0 1,1 -164,0" />
                  </defs>
                  <text
                    className="font-mono uppercase"
                    textLength={512}
                    lengthAdjust="spacing"
                    style={{ fontSize: 12.5, fill: "var(--text-secondary)" }}
                  >
                    <textPath href="#work-ring">{RING_TEXT}</textPath>
                  </text>
                </motion.svg>
                <span
                  className="relative flex h-20 w-20 items-center justify-center rounded-full text-2xl transition-transform duration-500 hover:scale-110"
                  style={{ backgroundColor: "var(--signal)", color: "var(--on-signal)" }}
                >
                  &rarr;
                </span>
                <span className="sr-only">See {project.name}</span>
              </TransitionLink>
            </Magnetic>
          </div>
        </div>

        <div ref={phoneRef} className="relative mx-auto w-full max-w-[280px]">
          <motion.div style={{ y: phoneY, rotate: phoneRotate, willChange: "transform" }}>
            <div
              aria-hidden
              className="absolute left-1/2 top-1/2 -z-10 h-[680px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ background: `radial-gradient(closest-side, ${project.accent}, transparent)`, opacity: 0.45 }}
            />
            <TransitionLink href={href} label={project.name} data-cursor="Open" aria-label={`Open ${project.name}`} className="block">
              <PocketBalanceStill />
            </TransitionLink>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
