"use client";

import { useState, type PointerEvent } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { SceneGlow } from "@/components/stage/SceneGlow";
import { useSceneGlowRange } from "@/components/stage/useSceneGlowRange";
import { SplitReveal } from "@/components/fx/SplitReveal";
import { useFinePointer } from "@/components/fx/useFinePointer";
import { TransitionLink } from "@/components/transition/TransitionProvider";
import { projects, type Project } from "./projects";
import { projectPreviews } from "./previews";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The project index at /projects. Each project is a huge row; hovering
 * one dims the rest and pulls a live preview of the real app along
 * with the cursor, tilting with its speed. Clicking plays the curtain
 * into the project's own case-study page.
 */
export function ProjectsIndexScene() {
  const [sectionRef, range] = useSceneGlowRange<HTMLElement>();
  const fine = useFinePointer();
  const [active, setActive] = useState<string | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 170, damping: 22, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 170, damping: 22, mass: 0.5 });
  const rotate = useTransform(useVelocity(springX), [-1800, 1800], [-12, 12], { clamp: true });

  function handleMove(event: PointerEvent<HTMLDivElement>) {
    x.set(event.clientX);
    y.set(event.clientY);
  }

  const activeProject = projects.find((project) => project.slug === active);

  return (
    <section id="projects-index" ref={sectionRef} className="relative min-h-screen px-6 pb-32 pt-32 md:px-16 md:pt-40">
      <SceneGlow id="projects-index" range={range} x={50} y={25} color="var(--cool-glow)" intensity={0.55} />

      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
          className="font-mono text-mono-label uppercase text-signal-text"
        >
          Index &mdash; ({String(projects.length).padStart(2, "0")})
        </motion.p>

        <SplitReveal
          as="h1"
          text="Projects"
          by="char"
          trigger="mount"
          delay={0.25}
          interactive
          className="mt-4 whitespace-nowrap font-display text-[clamp(3.8rem,16vw,14rem)] font-semibold leading-[0.9] tracking-[-0.05em] text-text-primary"
        />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.6 }}
          className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <p className="max-w-md font-sans text-body-lead text-text-secondary">
            Real products, built end to end. Pick one to step inside.
          </p>
          <p className="font-mono text-mono-label uppercase text-text-tertiary">
            Project &middot; Type &middot; Year
          </p>
        </motion.div>

        <div className="mt-16" onPointerMove={handleMove} onPointerLeave={() => setActive(null)}>
          {projects.map((project, index) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.75 + index * 0.1 }}
            >
              <div className={`transition-opacity duration-500 ${active && active !== project.slug ? "opacity-35" : ""}`}>
                <ProjectRow project={project} index={index} onEnter={() => setActive(project.slug)} />
              </div>
            </motion.div>
          ))}
          <div className="border-t" style={{ borderColor: "var(--border-hairline)" }} />
        </div>
      </div>

      {fine && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-30"
          style={{ x: springX, y: springY, rotate }}
        >
          <AnimatePresence>
            {activeProject && projectPreviews[activeProject.slug] && (
              <motion.div
                key={activeProject.slug}
                initial={{ opacity: 0, scale: 0.45 }}
                animate={{ opacity: 1, scale: 0.72 }}
                exit={{ opacity: 0, scale: 0.45 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="relative -ml-[150px] -mt-[325px] w-[300px]"
              >
                <div
                  className="absolute left-1/2 top-1/2 -z-10 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{ background: `radial-gradient(closest-side, ${activeProject.accent}, transparent)`, opacity: 0.5 }}
                />
                {projectPreviews[activeProject.slug]}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
}

function ProjectRow({ project, index, onEnter }: { project: Project; index: number; onEnter: () => void }) {
  return (
    <TransitionLink
      href={`/projects/${project.slug}`}
      label={project.name}
      data-cursor="Open"
      onPointerEnter={onEnter}
      className="group relative block overflow-hidden border-t py-10 md:py-14"
      style={{ borderColor: "var(--border-hairline)" }}
    >
      <span
        aria-hidden
        className="absolute inset-0 origin-left scale-x-0 transition-transform duration-700 ease-out group-hover:scale-x-100"
        style={{ background: `linear-gradient(90deg, ${project.accent}26, transparent 70%)` }}
      />
      <div className="relative flex items-center gap-6 md:gap-12">
        <span className="w-8 shrink-0 font-mono text-mono-label text-text-tertiary">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-[clamp(2.25rem,6.5vw,6rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-text-primary transition-transform duration-500 ease-out group-hover:translate-x-4 md:group-hover:translate-x-8">
            {project.name}
          </p>
          <p className="mt-3 font-sans text-body text-text-secondary">{project.tagline}</p>
          <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-signal-border bg-signal-wash px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-signal-text">
            <span className="h-1.5 w-1.5 rounded-full bg-signal" />
            {project.type} &middot; {project.status}
          </span>
          <div className="relative mt-8 h-[347px] w-40 lg:hidden">
            <div className="absolute left-0 top-0 w-[300px] origin-top-left" style={{ transform: "scale(0.5333)" }}>
              {projectPreviews[project.slug]}
            </div>
          </div>
        </div>
        <div className="hidden flex-col items-end gap-3 md:flex">
          <div className="flex gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-text-secondary"
                style={{ borderColor: "var(--border-hairline)" }}
              >
                {tag}
              </span>
            ))}
          </div>
          <span className="font-mono text-mono-label uppercase text-text-tertiary">
            {project.type} &middot; {project.year}
          </span>
        </div>
        <span
          aria-hidden
          className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-full border text-xl text-text-primary transition-all duration-500 group-hover:-rotate-45 group-hover:border-transparent group-hover:bg-signal group-hover:text-on-signal sm:flex"
          style={{ borderColor: "var(--border-hairline)" }}
        >
          &rarr;
        </span>
      </div>
    </TransitionLink>
  );
}
