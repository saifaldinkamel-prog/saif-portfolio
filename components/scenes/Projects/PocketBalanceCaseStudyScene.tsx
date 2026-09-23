"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { duration, ease } from "@/components/shared/motion";
import { SceneGlow } from "@/components/stage/SceneGlow";
import { useSceneGlowRange } from "@/components/stage/useSceneGlowRange";
import { PocketBalancePhone } from "@/components/projects/pocketbalance/PocketBalancePhone";
import {
  knownMerchants,
  transferAmounts,
  unknownMerchants,
  type SimulatedSms,
  type SmsType,
} from "@/components/projects/pocketbalance/data/dashboard";
import { reviewCategories } from "@/components/projects/pocketbalance/data/review";
import type { CategoryKind } from "@/components/projects/pocketbalance/pbTheme";
import type { ReviewResult } from "@/components/projects/pocketbalance/components/TransactionReviewCard";
import { PocketBalanceStill } from "./previews";
import { hasProjectIndex } from "./projects";
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
const BACK = hasProjectIndex
  ? { href: "/projects", label: "Projects", text: "All projects" }
  : { href: "/", label: "Home", text: "Back home" };

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
      <RealApp />
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
            className="flex flex-wrap items-center gap-x-4 gap-y-2"
          >
            <TransitionLink
              href={BACK.href}
              label={BACK.label}
              className="whitespace-nowrap font-mono text-mono-label uppercase text-text-tertiary transition-colors hover:text-text-primary"
            >
              &larr; {BACK.text}
            </TransitionLink>
            <span className="h-px w-8" style={{ backgroundColor: "var(--border-hairline)" }} />
            <span className="whitespace-nowrap font-mono text-mono-label uppercase text-signal-text">Currently building</span>
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

          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.6 }}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-signal-border bg-signal-wash px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-signal-text"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
            </span>
            Real Android app &middot; in active development
          </motion.span>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.7 }}
            className="mt-5 max-w-lg font-sans text-body-lead text-text-secondary"
          >
            A real personal finance app I&rsquo;m building. It reads your bank&rsquo;s SMS messages and
            turns them into a live balance, clean transactions, and real spending insights.
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
          <p className="mt-6 text-center font-mono text-[11px] uppercase tracking-[0.12em] text-text-tertiary">
            Web replica of the real app&rsquo;s home screen
          </p>
        </motion.div>
      </div>
    </section>
  );
}

const REAL_SCREENS = [
  { src: "/projects/pocketbalance/real-home.png", width: 363, height: 817, title: "Home" },
  { src: "/projects/pocketbalance/real-insights.png", width: 368, height: 813, title: "Money insights" },
  { src: "/projects/pocketbalance/real-categories.png", width: 368, height: 814, title: "Categories" },
];

/** Proof the project exists outside this website: real screenshots of the running app. */
function RealApp() {
  const [sectionRef, range] = useSceneGlowRange<HTMLElement>();

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-24 md:py-32">
      <SceneGlow id="pb-real" range={range} x={50} y={50} color={ACCENT} intensity={0.4} />

      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-16">
        <p className="font-mono text-mono-label uppercase text-signal-text">The real app</p>
        <SplitReveal
          as="h2"
          text="The real app, running."
          className="mt-6 max-w-3xl font-display text-[clamp(2.25rem,5vw,4.25rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-text-primary"
        />
        <p className="mt-6 max-w-xl font-sans text-body-lead text-text-secondary">
          These are real screenshots of PocketBalance running on Android. The interactive phone
          further down is a web replica of these screens, so you can try it without installing
          anything.
        </p>
      </div>

      <div className="relative z-10 mx-auto mt-16 max-w-4xl md:px-16">
        <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-6 [scrollbar-width:none] md:grid md:grid-cols-3 md:gap-10 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
          {REAL_SCREENS.map((screen, index) => (
            <motion.figure
              key={screen.src}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: index === 1 ? -24 : 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, ease: EASE, delay: index * 0.12 }}
              className="w-[64vw] max-w-[260px] shrink-0 snap-center md:w-auto md:max-w-none"
            >
              <motion.div
                whileHover={{ y: -10, rotate: index === 0 ? -1.5 : index === 2 ? 1.5 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="overflow-hidden rounded-[2rem] border bg-stage-deep p-1.5"
                style={{ borderColor: "var(--border-hairline)", boxShadow: "0 30px 60px rgba(0,0,0,0.45)" }}
              >
                <div className="relative aspect-[9/19] overflow-hidden rounded-[1.6rem]">
                  <Image
                    src={screen.src}
                    alt={`PocketBalance ${screen.title} screen — real screenshot`}
                    width={screen.width}
                    height={screen.height}
                    sizes="(min-width: 768px) 240px, 64vw"
                    unoptimized
                    className="h-full w-full object-cover object-top"
                  />
                </div>
              </motion.div>
              <figcaption className="mt-4 flex items-center justify-between gap-3">
                <span className="font-sans text-body text-text-primary">{screen.title}</span>
                <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-signal-text">
                  <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                  Real screenshot
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
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
  const phoneScale = usePhoneFitScale();

  const { scrollYProgress } = useScroll({ target: pinnedRef, offset: ["start start", "end end"] });
  const drive = useTransform(scrollYProgress, [0, 1], [0, 3]);
  const barScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const current = narrative[screenIndex];

  return (
    <section ref={sectionRef} className="relative">
      <SceneGlow id="pb-walkthrough" range={range} x={50} y={42} color="var(--cool-glow)" intensity={0.7} />

      <div className="relative z-10 px-6 pt-16 md:px-16">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-mono-label uppercase text-signal-text">Web replica &mdash; try it</p>
          <SplitReveal
            as="h2"
            text="The app's screens, rebuilt so you can try them here."
            className="mt-6 max-w-4xl font-display text-[clamp(2.25rem,5vw,4.25rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-text-primary"
          />
          <p className="mt-5 max-w-xl font-sans text-body text-text-secondary">
            PocketBalance itself runs on Android. This replica uses the same design with sample data,
            and it really works: scroll, swipe the phone, or send it a bank message.
          </p>
        </div>
      </div>

      <div ref={pinnedRef} className="relative h-[380vh]">
        <div className="sticky top-0 flex h-screen items-center overflow-hidden px-6 pt-16 md:px-16 lg:pt-0">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-5 lg:grid-cols-2 lg:gap-16">
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

              <div className="relative mt-3 min-h-[64px] lg:mt-6 lg:min-h-[180px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={screenIndex}
                    initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
                    transition={{ duration: duration.scene, ease: ease.in }}
                  >
                    <h3 className="font-display text-[1.45rem] font-semibold leading-[1.1] tracking-[-0.03em] text-text-primary lg:text-[clamp(1.9rem,3.6vw,3rem)] lg:leading-[1.05]">
                      {current.headline}
                    </h3>
                    <p className="mt-4 hidden max-w-sm font-sans text-body text-text-secondary lg:block">{current.body}</p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-3 min-h-[96px] lg:mt-6 lg:min-h-[150px]">
                <AnimatePresence>
                  {screenIndex === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.3, ease: EASE }}
                    >
                      <p className="flex items-center gap-2.5 font-mono text-mono-label uppercase text-signal-text">
                        <span className="relative flex h-2 w-2">
                          {!sms.busy && (
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-60" />
                          )}
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
                        </span>
                        Try it &mdash; send the phone a bank SMS
                      </p>
                      <div className="mt-3 grid grid-cols-3 gap-2 lg:mt-4 lg:flex lg:flex-wrap lg:gap-3">
                        <SmsButton
                          onClick={() => sms.send("known")}
                          disabled={sms.busy}
                          title="Known merchant"
                          short="Known store"
                          hint={sms.nextLearned ? `Next: ${sms.nextLearned} — learned!` : "Sorted automatically"}
                        />
                        <SmsButton
                          onClick={() => sms.send("unknown")}
                          disabled={sms.busy}
                          title="Unknown merchant"
                          short="New store"
                          hint="Asks once, then learns"
                        />
                        <SmsButton
                          onClick={() => sms.send("transfer")}
                          disabled={sms.busy}
                          title="Bank transfer"
                          short="Transfer"
                          hint="InstaPay — always asks"
                        />
                      </div>
                      <div className="mt-2 flex h-6 items-center gap-4 font-mono text-mono-label uppercase text-text-tertiary lg:mt-3">
                        <span>Simulated messages</span>
                        {sms.delivered.length > 0 && !sms.busy && (
                          <button type="button" onClick={sms.reset} className="uppercase text-text-secondary underline-offset-4 hover:text-text-primary hover:underline">
                            Reset
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="order-1 flex justify-center lg:order-2">
              <div
                className="relative flex justify-center"
                style={phoneScale < 1 ? { width: PHONE_W * phoneScale, height: PHONE_H * phoneScale } : { width: "100%" }}
              >
                <div
                  className="flex justify-center"
                  style={
                    phoneScale < 1
                      ? { position: "absolute", left: 0, top: 0, width: PHONE_W, transform: `scale(${phoneScale})`, transformOrigin: "top left" }
                      : { width: "100%" }
                  }
                >
                  <PocketBalancePhone
                    scrollDrive={drive}
                    onScreenChange={setScreenIndex}
                    incoming={sms.delivered}
                    banner={sms.banner}
                    review={sms.review}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** The phone's natural size when rendered 300px wide (frame + gap + screen dots). */
const PHONE_W = 300;
const PHONE_H = 676;

/**
 * Below the desktop layout, the pinned walkthrough has to fit phone,
 * headline, and buttons into one screen. Rather than rearranging the
 * phone's insides (the SMS popup is sized for the full phone), scale
 * the whole phone down to whatever height is left. Only re-measures
 * when the width changes, so mobile URL-bar show/hide doesn't jiggle it.
 */
function usePhoneFitScale() {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    let lastWidth = 0;
    function measure() {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      if (window.innerWidth >= 1024) setScale(1);
      else setScale(Math.max(0.5, Math.min(1, (window.innerHeight - 360) / PHONE_H)));
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  return scale;
}

function SmsButton({
  onClick,
  disabled,
  title,
  short,
  hint,
}: {
  onClick: () => void;
  disabled: boolean;
  title: string;
  /** Label for the compact phone layout, where hints are hidden. */
  short: string;
  hint: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.96 }}
      data-cursor="Send"
      className="group flex flex-col items-center rounded-2xl border border-signal-border bg-signal-wash px-2 py-2.5 text-center transition-colors hover:bg-signal disabled:pointer-events-none disabled:opacity-40 lg:items-start lg:px-4 lg:py-3 lg:text-left"
    >
      <span className="font-sans text-small font-semibold text-text-primary transition-colors group-hover:text-on-signal">
        <span className="lg:hidden">{short}</span>
        <span className="hidden lg:inline">{title}</span>
      </span>
      <span className="mt-0.5 hidden font-sans text-[13px] text-text-tertiary transition-colors group-hover:text-on-signal lg:block">
        {hint}
      </span>
    </motion.button>
  );
}

function categoryKindFor(name: string): CategoryKind {
  return reviewCategories.find((category) => category.name === name)?.kind ?? "other";
}

/**
 * Drives the phone's "a bank SMS just arrived" moment, following the
 * real app's rules. Each button draws the next merchant/amount from a
 * pool. A known merchant is sorted on its own. An unknown merchant
 * lands as "Needs review" and opens the categorize popup over the home
 * screen; if the visitor says to remember it, that merchant joins the
 * known ones and comes back next, sorted automatically. A bank
 * transfer names no merchant, so it always asks and is never learned.
 */
function useSmsSimulation() {
  const reduceMotion = useReducedMotion();
  const [delivered, setDelivered] = useState<SimulatedSms[]>([]);
  const [banner, setBanner] = useState<{ sms: SimulatedSms; parsed: boolean } | null>(null);
  const [reviewId, setReviewId] = useState<string | null>(null);
  const [learned, setLearned] = useState<Record<string, string>>({});
  const [learnedQueue, setLearnedQueue] = useState<string[]>([]);
  const timers = useRef<number[]>([]);
  const counters = useRef({ id: 0, known: 0, unknown: 0, transfer: 0 });

  useEffect(() => () => timers.current.forEach((id) => window.clearTimeout(id)), []);

  const busy = banner !== null || reviewId !== null;

  function later(ms: number, fn: () => void) {
    timers.current.push(window.setTimeout(fn, reduceMotion ? ms / 4 : ms));
  }

  function learnedSms(id: string, merchant: string): SimulatedSms {
    const category = learned[merchant];
    const amount = unknownMerchants.find((m) => m.merchant === merchant)?.amount ?? 0;
    return {
      id,
      kind: "purchase",
      merchant,
      amount,
      categoryLabel: category,
      categoryKind: categoryKindFor(category),
      status: "auto",
      learned: true,
    };
  }

  function nextSms(type: SmsType): SimulatedSms {
    const c = counters.current;
    const id = `sms-${++c.id}`;

    if (type === "transfer") {
      const amount = transferAmounts[c.transfer++ % transferAmounts.length];
      return { id, kind: "transfer", merchant: "InstaPay transfer", amount, categoryLabel: "Needs review", categoryKind: "other", status: "review" };
    }

    if (type === "known") {
      if (learnedQueue.length > 0) {
        setLearnedQueue((queue) => queue.slice(1));
        return learnedSms(id, learnedQueue[0]);
      }
      const pick = knownMerchants[c.known++ % knownMerchants.length];
      return { id, kind: "purchase", ...pick, status: "auto" };
    }

    const fresh = unknownMerchants.filter((m) => !learned[m.merchant]);
    const pool = fresh.length > 0 ? fresh : unknownMerchants;
    const pick = pool[c.unknown++ % pool.length];
    if (learned[pick.merchant]) return learnedSms(id, pick.merchant);
    return { id, kind: "purchase", ...pick, categoryLabel: "Needs review", categoryKind: "other", status: "review" };
  }

  function send(type: SmsType) {
    if (busy) return;
    const sms = nextSms(type);

    setBanner({ sms, parsed: false });
    later(700, () => setBanner({ sms, parsed: true }));
    later(1600, () => setDelivered((list) => [...list, sms]));
    later(2800, () => {
      setBanner(null);
      if (sms.status === "review") setReviewId(sms.id);
    });
  }

  function resolveReview(result: ReviewResult | null) {
    const id = reviewId;
    setReviewId(null);
    if (!result || !id) return;
    setDelivered((list) =>
      list.map((sms) =>
        sms.id === id
          ? { ...sms, categoryLabel: result.category, categoryKind: categoryKindFor(result.category), status: "done" }
          : sms
      )
    );
    const resolved = delivered.find((sms) => sms.id === id);
    if (result.remember && resolved?.kind === "purchase") {
      setLearned((prev) => ({ ...prev, [resolved.merchant]: result.category }));
      setLearnedQueue((queue) => [...queue, resolved.merchant]);
    }
  }

  function reset() {
    setDelivered([]);
    setLearned({});
    setLearnedQueue([]);
  }

  const reviewSms = delivered.find((sms) => sms.id === reviewId);

  return {
    send,
    reset,
    busy,
    banner,
    delivered,
    nextLearned: learnedQueue[0] ?? null,
    review: reviewSms
      ? { sms: reviewSms, onDone: (result: ReviewResult) => resolveReview(result), onLater: () => resolveReview(null) }
      : null,
  };
}

function CaseFooter() {
  return (
    <section className="relative px-6 pb-16 pt-24 md:px-16">
      <div className="mx-auto max-w-6xl border-t pt-16" style={{ borderColor: "var(--border-hairline)" }}>
        <p className="font-mono text-mono-label uppercase text-text-tertiary">Liked what you saw?</p>
        <SplitReveal
          as="p"
          text="Let's talk about it."
          className="mt-4 font-display text-[clamp(2.5rem,7vw,6rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-text-primary"
        />
        <p className="mt-6 max-w-lg font-sans text-body-lead text-text-secondary">
          Happy to walk you through how PocketBalance works &mdash; or talk about what I could build
          for you.
        </p>

        <div className="mt-12 flex flex-wrap items-center gap-4">
          <Magnetic strength={0.3}>
            <TransitionLink
              href="/#closing"
              label="Contact"
              className="flex items-center gap-2 rounded-full border border-signal-border bg-signal-wash px-6 py-3 font-sans text-small text-signal-text transition-colors hover:bg-signal hover:text-on-signal"
            >
              Get in touch &rarr;
            </TransitionLink>
          </Magnetic>
          <Magnetic strength={0.3}>
            <TransitionLink
              href={BACK.href}
              label={BACK.label}
              className="flex items-center gap-2 rounded-full border px-6 py-3 font-sans text-small text-text-primary transition-colors hover:bg-white/5"
              style={{ borderColor: "var(--border-hairline)" }}
            >
              &larr; {BACK.text}
            </TransitionLink>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
