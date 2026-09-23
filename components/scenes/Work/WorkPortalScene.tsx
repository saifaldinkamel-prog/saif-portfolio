"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { SceneGlow } from "@/components/stage/SceneGlow";
import { useSceneGlowRange } from "@/components/stage/useSceneGlowRange";
import { Magnetic } from "@/components/fx/Magnetic";
import { TransitionLink } from "@/components/transition/TransitionProvider";
import { projects } from "@/components/scenes/Projects/projects";

const RING_TEXT = "Explore the work • Explore the work • ";

/**
 * The home page's doorway into /projects. A giant word that opens up
 * as it scrolls into place, and a magnetic rotating-ring button that
 * plays the curtain transition into the project index. Deliberately
 * says nothing about any single project — that's what the project
 * pages are for.
 */
export function WorkPortalScene() {
  const [sectionRef, range] = useSceneGlowRange<HTMLElement>();
  const reduceMotion = useReducedMotion();
  const titleRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: titleRef, offset: ["start end", "center center"] });
  const scale = useTransform(scrollYProgress, [0, 1], [reduceMotion ? 1 : 0.72, 1]);
  const spacing = useTransform(scrollYProgress, [0, 1], [reduceMotion ? "-0.05em" : "0.04em", "-0.05em"]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.6], [0.15, 1]);

  return (
    <section id="work" ref={sectionRef} className="relative overflow-hidden px-6 py-32 md:px-16 md:py-44">
      <SceneGlow id="work" range={range} x={50} y={50} color="var(--cool-glow)" intensity={0.6} />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center text-center">
        <p className="font-mono text-mono-label uppercase text-signal-text">(02) &mdash; Selected work</p>

        <motion.div ref={titleRef} style={{ scale, opacity: titleOpacity }} className="mt-10 w-full">
          <motion.h2
            style={{ letterSpacing: spacing }}
            className="whitespace-nowrap font-display font-semibold leading-[0.85] text-text-primary text-[clamp(3.6rem,16vw,15rem)]"
          >
            Projects
          </motion.h2>
        </motion.div>

        <p className="mt-10 max-w-md font-sans text-body-lead text-text-secondary">
          Real products, running live — each one with its own walkthrough.
        </p>

        <div className="mt-14">
          <Magnetic strength={0.3}>
            <TransitionLink
              href="/projects"
              label="Projects"
              data-cursor="Enter"
              className="relative flex h-44 w-44 items-center justify-center rounded-full md:h-52 md:w-52"
            >
              <motion.svg
                aria-hidden
                viewBox="0 0 200 200"
                className="absolute inset-0 h-full w-full"
                animate={reduceMotion ? undefined : { rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              >
                <defs>
                  <path id="ring-path" d="M100,100 m-82,0 a82,82 0 1,1 164,0 a82,82 0 1,1 -164,0" />
                </defs>
                <text
                  className="font-mono uppercase"
                  textLength={512}
                  lengthAdjust="spacing"
                  style={{ fontSize: 12.5, fill: "var(--text-secondary)" }}
                >
                  <textPath href="#ring-path">{RING_TEXT}</textPath>
                </text>
              </motion.svg>
              <span
                className="relative flex h-24 w-24 items-center justify-center rounded-full text-2xl transition-transform duration-500 hover:scale-110 md:h-28 md:w-28"
                style={{ backgroundColor: "var(--signal)", color: "var(--on-signal)" }}
              >
                &rarr;
              </span>
            </TransitionLink>
          </Magnetic>
        </div>

        <p className="mt-10 font-mono text-mono-label uppercase text-text-tertiary">
          {String(projects.length).padStart(2, "0")} live &middot; more in progress
        </p>
      </div>
    </section>
  );
}
