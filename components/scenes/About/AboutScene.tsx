"use client";

import { motion } from "motion/react";
import { SceneGlow } from "@/components/stage/SceneGlow";
import { useSceneGlowRange } from "@/components/stage/useSceneGlowRange";
import { ScrollLitText } from "@/components/fx/ScrollLitText";
import { Counter } from "@/components/fx/Counter";
import { VelocityMarquee } from "@/components/fx/VelocityMarquee";

const EASE = [0.16, 1, 0.3, 1] as const;

const FACTS = [
  { label: "Based in", value: "6th of October, Giza, Egypt" },
  { label: "Studying", value: "B.Sc. Software Engineering — Modern Sciences and Arts University, final year" },
  { label: "Focus", value: "Software engineering — strongest in frontend and mobile apps" },
  { label: "Open to", value: "Internships and junior software engineering roles" },
];

const STATS = [
  { to: 12, suffix: "+", label: "Technologies across web, mobile, and systems" },
  { to: 1, pad: 2, label: "App designed and built end to end" },
  { to: 2, pad: 2, label: "Platforms I build for — the web and mobile" },
];

const PRIMARY = ["React", "React Native", "TypeScript", "JavaScript", "SQLite", "Android"];
const ALSO = ["C++", "C#", "Python", "Java", "HTML", "CSS"];

export function AboutScene() {
  const [sectionRef, range] = useSceneGlowRange<HTMLElement>();

  return (
    <section id="about" ref={sectionRef} className="relative overflow-hidden py-32 md:py-44">
      <SceneGlow id="about" range={range} x={25} y={40} color="var(--cool-glow)" intensity={0.3} />

      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-16">
        <p className="font-mono text-mono-label uppercase text-signal-text">(01) &mdash; About</p>

        <ScrollLitText
          text="I'm a final-year Software Engineering student who likes taking ideas all the way to real, working products — clean interfaces, smooth motion, and logic you can trust underneath."
          highlight={["real", "working", "products", "trust"]}
          className="mt-8 font-display text-[clamp(1.9rem,4.4vw,4rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-text-primary"
        />

        <div className="mt-20 grid gap-16 lg:grid-cols-[1.3fr_1fr]">
          <div>
            {FACTS.map((fact, index) => (
              <motion.div
                key={fact.label}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.8, ease: EASE, delay: index * 0.08 }}
                className="group relative flex flex-col gap-1 border-t py-5 sm:flex-row sm:items-baseline sm:gap-8"
                style={{ borderColor: "var(--border-hairline)" }}
              >
                <span
                  aria-hidden
                  className="absolute left-0 top-[-1px] h-px w-0 transition-[width] duration-500 ease-out group-hover:w-full"
                  style={{ backgroundColor: "var(--signal)" }}
                />
                <span className="w-28 shrink-0 font-mono text-mono-label uppercase text-text-tertiary">
                  {fact.label}
                </span>
                <span className="font-sans text-body text-text-secondary transition-colors group-hover:text-text-primary">
                  {fact.value}
                </span>
              </motion.div>
            ))}
            <motion.a
              href="/resume.pdf"
              target="_blank"
              rel="noreferrer"
              data-cursor="Open"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.35 }}
              className="group mt-6 inline-flex items-center gap-3 rounded-full border border-signal-border bg-signal-wash px-5 py-3 font-sans text-small font-medium text-signal-text transition-colors hover:bg-signal hover:text-on-signal"
            >
              Download my résumé
              <span className="inline-block transition-transform duration-300 group-hover:translate-y-0.5">&darr;</span>
            </motion.a>
          </div>

          <div className="flex flex-col gap-10">
            {STATS.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.8, ease: EASE, delay: index * 0.1 }}
                className="flex items-end gap-5"
              >
                <Counter
                  to={stat.to}
                  pad={stat.pad}
                  suffix={stat.suffix}
                  className="font-display text-[clamp(3.5rem,7vw,5.5rem)] font-semibold leading-none tracking-[-0.04em] text-text-primary tabular-nums"
                />
                <span className="max-w-[14rem] pb-2 font-sans text-small text-text-tertiary">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-28 flex flex-col gap-2" aria-label="Skills">
        <VelocityMarquee baseVelocity={-2.2}>
          <SkillRow items={PRIMARY} />
        </VelocityMarquee>
        <VelocityMarquee baseVelocity={2.2}>
          <SkillRow items={ALSO} outline />
        </VelocityMarquee>
      </div>
    </section>
  );
}

function SkillRow({ items, outline = false }: { items: string[]; outline?: boolean }) {
  return (
    <span className="flex items-center">
      {items.map((item) => (
        <span key={item} className="flex items-center">
          <span
            className={`px-6 font-display text-[clamp(2.75rem,7vw,6.5rem)] font-semibold leading-[1.1] tracking-[-0.04em] ${
              outline ? "text-outline" : "text-text-primary"
            }`}
          >
            {item}
          </span>
          <span aria-hidden className="text-[clamp(1.5rem,3vw,2.5rem)] text-signal">
            &#10022;
          </span>
        </span>
      ))}
    </span>
  );
}
