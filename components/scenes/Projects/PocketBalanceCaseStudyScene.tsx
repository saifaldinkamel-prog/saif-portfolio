"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { duration, ease } from "@/components/shared/motion";
import { SceneGlow } from "@/components/stage/SceneGlow";
import { useSceneGlowRange } from "@/components/stage/useSceneGlowRange";
import { PocketBalancePhone } from "@/components/projects/pocketbalance/PocketBalancePhone";
import { simulatedSms, type SimulatedSms } from "@/components/projects/pocketbalance/data/dashboard";
import { PocketBalanceStill } from "./previews";
import { SplitReveal } from "@/components/fx/SplitReveal";
import { ScrollLitText } from "@/components/fx/ScrollLitText";
import { Counter } from "@/components/fx/Counter";
import { SpotlightCard } from "@/components/fx/SpotlightCard";
import { VelocityMarquee } from "@/components/fx/VelocityMarquee";
import { Magnetic } from "@/components/fx/Magnetic";
import { TransitionLink } from "@/components/transition/TransitionProvider";
import { narrative } from "./narrative";

const EASE = [0.16, 1, 0.3, 1] as const;
const ACCENT = "#7C3AED";

const META = [
  { label: "Role", value: "Design & engineering" },
  { label: "Platform", value: "Android · React Native" },
  { label: "Stack", value: "Expo, TypeScript, SQLite" },
  { label: "Status", value: "In active development" },
];

const STATS = [
  { to: 189, label: "Automated test files guarding the parser, ledger, and recovery flows" },
  { to: 2, pad: 2, label: "Languages supported — English and Arabic" },
  { to: 0, pad: 2, label: "Bank APIs needed — it works from the SMS you already get" },
];

const FEATURES = [
  {
    title: "SMS parsing engine",
    body: "A strict parser reads bank messages, then resolves which bank and which account each one belongs to.",
    tag: "Core",
  },
  {
    title: "Categories that learn",
    body: "Merchant learning remembers how you categorized a place before and applies it the next time.",
    tag: "Smart",
  },
  {
    title: "Honest about uncertainty",
    body: "Unclear transactions are never guessed — the app asks once, then remembers your answer.",
    tag: "Trust",
  },
  {
    title: "Spending insights",
    body: "Weekly trends, top categories, and biggest contributors, computed from the real ledger.",
    tag: "Insight",
  },
  {
    title: "Private by design",
    body: "Data lives on the device in SQLite, behind an app lock with biometric unlock.",
    tag: "Security",
  },
  {
    title: "Backup & recovery",
    body: "Cloud backup and device recovery, so a new phone doesn't mean a lost history.",
    tag: "Resilience",
  },
];

const STACK = ["React Native", "Expo", "TypeScript", "SQLite", "Supabase", "Reanimated", "Expo Router"];

export function PocketBalanceCaseStudyScene() {
  return (
    <>
      <CaseHero />
      <Brief />
      <Features />
      <Walkthrough />
      <CaseFooter />
    </>
  );
}

function CaseHero() {
  const [sectionRef, range] = useSceneGlowRange<HTMLElement>();
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const phoneY = useTransform(scrollYProgress, [0, 1], ["0%", reduceMotion ? "0%" : "-18%"]);
  const phoneRotate = useTransform(scrollYProgress, [0, 1], [reduceMotion ? 0 : -6, reduceMotion ? 0 : 4]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden px-6 pb-24 pt-28 md:px-16 md:pt-32">
      <SceneGlow id="pb-hero" range={range} x={72} y={45} color={ACCENT} intensity={0.55} />

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-16 xl:grid-cols-[1.25fr_1fr]">
        <div className="min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
            className="flex items-center gap-4"
          >
            <TransitionLink
              href="/projects"
              label="Projects"
              className="font-mono text-mono-label uppercase text-text-tertiary transition-colors hover:text-text-primary"
            >
              &larr; All projects
            </TransitionLink>
            <span className="h-px w-8" style={{ backgroundColor: "var(--border-hairline)" }} />
            <span className="font-mono text-mono-label uppercase text-signal-text">Case study 01</span>
          </motion.div>

          <SplitReveal
            as="h1"
            text="PocketBalance"
            by="char"
            trigger="mount"
            delay={0.3}
            stagger={0.03}
            interactive
            className="mt-6 whitespace-nowrap font-display text-[clamp(2.4rem,10.5vw,5.25rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-text-primary"
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.7 }}
            className="mt-6 max-w-lg font-sans text-body-lead text-text-secondary"
          >
            A personal finance app for Android that reads your bank&rsquo;s SMS messages and turns
            them into a live balance, clean transactions, and real spending insights.
          </motion.p>

          <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6 border-t pt-8" style={{ borderColor: "var(--border-hairline)" }}>
            {META.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.85 + index * 0.07 }}
              >
                <p className="font-mono text-mono-label uppercase text-text-tertiary">{item.label}</p>
                <p className="mt-1.5 font-sans text-body text-text-primary">{item.value}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 60, rotate: -10 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.45 }}
          className="relative mx-auto w-full max-w-[280px]"
        >
          <motion.div style={{ y: phoneY, rotate: phoneRotate }}>
            <div
              aria-hidden
              className="absolute left-1/2 top-1/2 -z-10 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ backgroundColor: ACCENT, filter: "blur(110px)", opacity: 0.4 }}
            />
            <PocketBalanceStill playIntro />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function Brief() {
  const [sectionRef, range] = useSceneGlowRange<HTMLElement>();

  return (
    <section ref={sectionRef} className="relative px-6 py-28 md:px-16 md:py-40">
      <SceneGlow id="pb-brief" range={range} x={30} y={40} color="var(--cool-glow)" intensity={0.3} />

      <div className="relative z-10 mx-auto max-w-6xl">
        <p className="font-mono text-mono-label uppercase text-signal-text">The brief</p>
        <ScrollLitText
          text="Banks already text you every time money moves. PocketBalance reads those messages, turns them into clean transactions, and keeps a running balance — no bank API, no manual entry, and no guessing when a message is unclear."
          highlight={["reads", "balance", "guessing"]}
          className="mt-8 font-display text-[clamp(1.8rem,4vw,3.6rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-text-primary"
        />

        <div className="mt-24 grid gap-12 md:grid-cols-2">
          {[
            {
              label: "The problem",
              body: "Manual expense tracking rarely survives past a few weeks, and bank apps show a list of transactions without explaining where the money actually went.",
            },
            {
              label: "The approach",
              body: "Use data people already receive — bank SMS. Parse it strictly, categorize it, and surface anything uncertain for a quick confirm instead of inventing an answer.",
            },
          ].map((block, index) => (
            <motion.div
              key={block.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, ease: EASE, delay: index * 0.12 }}
              className="border-t pt-6"
              style={{ borderColor: "var(--border-hairline)" }}
            >
              <p className="font-mono text-mono-label uppercase text-text-tertiary">{block.label}</p>
              <p className="mt-4 font-sans text-body-lead text-text-secondary">{block.body}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-24 grid gap-12 sm:grid-cols-3">
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.8, ease: EASE, delay: index * 0.1 }}
            >
              <Counter
                to={stat.to}
                pad={stat.pad}
                className="font-display text-[clamp(3.5rem,8vw,6.5rem)] font-semibold leading-none tracking-[-0.05em] text-text-primary tabular-nums"
              />
              <p className="mt-3 max-w-[16rem] font-sans text-small text-text-tertiary">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const [sectionRef, range] = useSceneGlowRange<HTMLElement>();

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-28 md:py-36">
      <SceneGlow id="pb-features" range={range} x={60} y={40} color={ACCENT} intensity={0.35} />

      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-16">
        <p className="font-mono text-mono-label uppercase text-signal-text">What it does</p>
        <SplitReveal
          as="h2"
          text="Six things running under the hood."
          className="mt-6 max-w-3xl font-display text-[clamp(2.25rem,5vw,4.25rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-text-primary"
        />

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: EASE, delay: (index % 3) * 0.08 }}
            >
              <SpotlightCard className="h-full" color="rgba(124,58,237,0.22)">
                <div className="flex h-full min-h-[240px] flex-col justify-between p-7">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-mono-label text-text-tertiary">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="rounded-full border px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-[0.12em] text-signal-text"
                      style={{ borderColor: "var(--signal-border)" }}
                    >
                      {feature.tag}
                    </span>
                  </div>
                  <div className="mt-10">
                    <p className="font-display text-[1.6rem] font-semibold leading-tight tracking-[-0.02em] text-text-primary">
                      {feature.title}
                    </p>
                    <p className="mt-3 font-sans text-body text-text-secondary">{feature.body}</p>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="relative z-10 mt-24" aria-label="Tech stack">
        <VelocityMarquee baseVelocity={-1.8}>
          <span className="flex items-center">
            {STACK.map((item) => (
              <span key={item} className="flex items-center">
                <span className="px-6 font-display text-[clamp(2rem,5vw,4rem)] font-semibold tracking-[-0.03em] text-outline">
                  {item}
                </span>
                <span aria-hidden className="text-signal">
                  &#10022;
                </span>
              </span>
            ))}
          </span>
        </VelocityMarquee>
      </div>
    </section>
  );
}

function Walkthrough() {
  const [sectionRef, range] = useSceneGlowRange<HTMLElement>();
  const pinnedRef = useRef<HTMLDivElement>(null);
  const [screenIndex, setScreenIndex] = useState(0);
  const sms = useSmsSimulation();

  const { scrollYProgress } = useScroll({ target: pinnedRef, offset: ["start start", "end end"] });
  const drive = useTransform(scrollYProgress, [0, 1], [0, 3]);
  const barScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const current = narrative[screenIndex];

  return (
    <section ref={sectionRef} className="relative">
      <SceneGlow id="pb-walkthrough" range={range} x={50} y={42} color="var(--cool-glow)" intensity={0.7} />

      <div className="relative z-10 px-6 pt-16 md:px-16">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-mono-label uppercase text-signal-text">Take it for a spin</p>
          <SplitReveal
            as="h2"
            text="The real app, running live."
            className="mt-6 font-display text-[clamp(2.25rem,5vw,4.25rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-text-primary"
          />
          <p className="mt-4 font-sans text-body text-text-tertiary">Scroll, swipe the phone, or use your arrow keys.</p>
        </div>
      </div>

      <div ref={pinnedRef} className="relative h-[380vh]">
        <div className="sticky top-0 flex h-screen items-center overflow-hidden px-6 md:px-16">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="order-2 max-w-md lg:order-1">
              <div className="flex items-center gap-4">
                <span className="font-mono text-mono-label text-signal-text tabular-nums">
                  {String(screenIndex + 1).padStart(2, "0")} / {String(narrative.length).padStart(2, "0")}
                </span>
                <span className="relative h-px w-32 overflow-hidden" style={{ backgroundColor: "var(--border-hairline)" }}>
                  <motion.span
                    className="absolute inset-0 origin-left"
                    style={{ scaleX: barScale, backgroundColor: "var(--signal)" }}
                  />
                </span>
              </div>

              <div className="relative mt-6 min-h-[180px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={screenIndex}
                    initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
                    transition={{ duration: duration.scene, ease: ease.in }}
                  >
                    <h3 className="font-display text-[clamp(1.9rem,3.6vw,3rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-text-primary">
                      {current.headline}
                    </h3>
                    <p className="mt-4 max-w-sm font-sans text-body text-text-secondary">{current.body}</p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-6 min-h-[52px]">
                <AnimatePresence>
                  {screenIndex === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      className="flex flex-wrap items-center gap-4"
                    >
                      <button
                        type="button"
                        onClick={sms.send}
                        disabled={sms.busy}
                        data-cursor={sms.done ? "Reset" : "Send"}
                        className="flex items-center gap-2.5 rounded-full border border-signal-border bg-signal-wash px-5 py-3 font-sans text-small font-medium text-signal-text transition-colors hover:bg-signal hover:text-on-signal disabled:opacity-50"
                      >
                        <span className="relative flex h-2 w-2">
                          {!sms.busy && !sms.done && (
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-60" />
                          )}
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
                        </span>
                        {sms.done ? "Reset the balance" : sms.busy ? "Reading the message…" : "Try it — send a bank SMS"}
                      </button>
                      <span className="font-mono text-mono-label uppercase text-text-tertiary">
                        {sms.delivered.length} / {simulatedSms.length} &middot; simulated
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="order-1 flex justify-center lg:order-2">
              <PocketBalancePhone
                scrollDrive={drive}
                onScreenChange={setScreenIndex}
                incoming={sms.delivered}
                banner={sms.banner}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Drives the phone's "a bank SMS just arrived" moment: the notification
 * drops in, its amount and merchant light up as they're parsed, then
 * the transaction lands and the balance ticks down.
 */
function useSmsSimulation() {
  const reduceMotion = useReducedMotion();
  const [count, setCount] = useState(0);
  const [banner, setBanner] = useState<{ sms: SimulatedSms; parsed: boolean } | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((id) => window.clearTimeout(id)), []);

  const busy = banner !== null;
  const done = count >= simulatedSms.length;

  function later(ms: number, fn: () => void) {
    timers.current.push(window.setTimeout(fn, reduceMotion ? ms / 4 : ms));
  }

  function send() {
    if (busy) return;
    if (done) {
      setCount(0);
      return;
    }
    const next = simulatedSms[count];
    setBanner({ sms: next, parsed: false });
    later(700, () => setBanner({ sms: next, parsed: true }));
    later(1500, () => setCount((n) => n + 1));
    later(2700, () => setBanner(null));
  }

  return { send, busy, done, banner, delivered: simulatedSms.slice(0, count) };
}

function CaseFooter() {
  return (
    <section className="relative px-6 pb-16 pt-24 md:px-16">
      <div className="mx-auto max-w-6xl border-t pt-16" style={{ borderColor: "var(--border-hairline)" }}>
        <p className="font-mono text-mono-label uppercase text-text-tertiary">Next project</p>
        <p className="mt-4 font-display text-[clamp(2.5rem,7vw,6rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-outline">
          In the works
        </p>

        <div className="mt-14 flex flex-wrap items-center gap-4">
          <Magnetic strength={0.3}>
            <TransitionLink
              href="/projects"
              label="Projects"
              className="flex items-center gap-2 rounded-full border px-6 py-3 font-sans text-small text-text-primary transition-colors hover:bg-white/5"
              style={{ borderColor: "var(--border-hairline)" }}
            >
              &larr; All projects
            </TransitionLink>
          </Magnetic>
          <Magnetic strength={0.3}>
            <TransitionLink
              href="/#closing"
              label="Contact"
              className="flex items-center gap-2 rounded-full border border-signal-border bg-signal-wash px-6 py-3 font-sans text-small text-signal-text transition-colors hover:bg-signal hover:text-on-signal"
            >
              Let&rsquo;s talk &rarr;
            </TransitionLink>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
