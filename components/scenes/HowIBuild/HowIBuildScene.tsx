"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { SceneGlow } from "@/components/stage/SceneGlow";
import { useSceneGlowRange } from "@/components/stage/useSceneGlowRange";
import { SplitReveal } from "@/components/fx/SplitReveal";
import { statements } from "./statements";

/**
 * Three principles as panels that pin and stack on top of each other
 * while scrolling — each earlier panel shrinks and dims back into the
 * dark as the next one slides over it.
 */
export function HowIBuildScene() {
  const [sectionRef, range] = useSceneGlowRange<HTMLElement>();
  const stackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: stackRef, offset: ["start start", "end end"] });

  return (
    <section id="how-i-build" ref={sectionRef} className="relative px-6 py-32 md:px-16">
      <SceneGlow id="how-i-build" range={range} x={30} y={40} color="var(--cool-glow)" intensity={0.3} />

      <div className="relative z-10 mx-auto max-w-5xl">
        <p className="font-mono text-mono-label uppercase text-signal-text">(03) &mdash; How I build</p>
        <SplitReveal
          as="h2"
          text="Three rules I don't break."
          className="mt-6 font-display text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-[1] tracking-[-0.04em] text-text-primary"
        />

        <div ref={stackRef} className="relative mt-20">
          {statements.map((statement, index) => (
            <StackPanel
              key={statement.number}
              statement={statement}
              index={index}
              total={statements.length}
              progress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function StackPanel({
  statement,
  index,
  total,
  progress,
}: {
  statement: (typeof statements)[number];
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const reduceMotion = useReducedMotion();
  const start = index / total;
  const targetScale = reduceMotion ? 1 : 1 - (total - 1 - index) * 0.05;
  const scale = useTransform(progress, [start, 1], [1, targetScale]);
  const dim = useTransform(progress, [start, 1], [1, index === total - 1 ? 1 : 0.45]);

  return (
    <div className="sticky flex h-[70vh] min-h-[420px] items-start" style={{ top: `calc(14vh + ${index * 28}px)` }}>
      <motion.div
        style={{ scale, opacity: dim, transformOrigin: "top center", borderColor: "var(--border-hairline)", willChange: "transform" }}
        className="relative h-[56vh] min-h-[360px] w-full overflow-hidden rounded-3xl border p-8 md:p-14"
      >
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, var(--stage-raised) 0%, var(--stage-panel) 55%, var(--stage-deep) 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute -right-48 -top-48 h-[34rem] w-[34rem] rounded-full"
          style={{ background: "radial-gradient(closest-side, var(--cool-glow), transparent)", opacity: 0.4 }}
        />
        <div className="relative flex h-full flex-col justify-between">
          <div className="flex items-start justify-between gap-6">
            <span className="font-mono text-mono-label uppercase text-signal-text">{statement.keyword}</span>
            <span className="font-display text-[clamp(4rem,10vw,8rem)] font-semibold leading-none tracking-[-0.05em] text-outline">
              {statement.number}
            </span>
          </div>
          <div className="max-w-2xl">
            <p className="font-display text-[clamp(2rem,4.5vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-text-primary">
              {statement.title}
            </p>
            <p className="mt-5 max-w-xl font-sans text-body text-text-secondary md:text-body-lead">{statement.body}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
