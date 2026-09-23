"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SceneGlow } from "@/components/stage/SceneGlow";
import { useSceneGlowRange } from "@/components/stage/useSceneGlowRange";
import { VelocityMarquee } from "@/components/fx/VelocityMarquee";
import { Magnetic } from "@/components/fx/Magnetic";
import { SplitReveal } from "@/components/fx/SplitReveal";
import { LocalTime } from "@/components/fx/LocalTime";

const EMAIL = "saifaldinkamel@gmail.com";

const LINKS = [
  { label: "GitHub", href: "https://github.com/saifaldinkamel-prog" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/saifaldin-kamel-149087322/" },
  { label: "Email", href: `mailto:${EMAIL}` },
  { label: "Résumé", href: "/resume.pdf" },
];

/**
 * The final scene. The light returns to Hero's tone, a giant ticker
 * reacts to the scroll that brought the visitor here, and the one
 * action that matters — getting in touch — is the biggest, most
 * physical thing on the screen.
 */
export function ClosingScene() {
  const [sectionRef, range] = useSceneGlowRange<HTMLElement>();
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  }

  return (
    <section id="closing" ref={sectionRef} className="relative overflow-hidden pt-32">
      <SceneGlow id="closing" range={range} x={50} y={60} color="var(--cool-glow)" intensity={0.5} />

      <VelocityMarquee baseVelocity={-2.5} className="relative z-10">
        <span className="flex items-center">
          {["Let’s build something real", "Let’s build something real"].map((line, index) => (
            <span key={index} className="flex items-center">
              <span
                className={`px-8 font-display text-[clamp(3.5rem,11vw,10rem)] font-semibold leading-[1.05] tracking-[-0.045em] ${
                  index % 2 ? "text-outline" : "text-text-primary"
                }`}
              >
                {line}
              </span>
              <span aria-hidden className="text-[clamp(2rem,5vw,4.5rem)] text-signal">
                &#10022;
              </span>
            </span>
          ))}
        </span>
      </VelocityMarquee>

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-6 pb-10 pt-24 text-center md:px-16">
        <p className="font-mono text-mono-label uppercase text-signal-text">(04) &mdash; Contact</p>
        <SplitReveal
          as="h2"
          text="Have an idea, a role, or a question?"
          className="mt-6 max-w-3xl font-display text-[clamp(2rem,4.5vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-text-primary"
        />

        <div className="mt-14">
          <Magnetic strength={0.25}>
            <button
              type="button"
              onClick={copyEmail}
              data-cursor={copied ? "Copied" : "Copy"}
              className="group relative flex items-center gap-4 overflow-hidden rounded-full border px-7 py-5 md:px-10 md:py-6"
              style={{ borderColor: "var(--signal-border)", backgroundColor: "var(--signal-wash)" }}
            >
              <span
                aria-hidden
                className="absolute inset-0 origin-bottom scale-y-0 rounded-full transition-transform duration-500 ease-out group-hover:scale-y-100"
                style={{ backgroundColor: "var(--signal)" }}
              />
              <span className="relative font-sans text-[clamp(1rem,2.4vw,1.5rem)] font-medium text-text-primary transition-colors duration-300 group-hover:text-[var(--on-signal)]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={copied ? "copied" : "email"}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.2 }}
                    className="block"
                  >
                    {copied ? "Copied to clipboard ✓" : EMAIL}
                  </motion.span>
                </AnimatePresence>
              </span>
            </button>
          </Magnetic>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          {LINKS.map(({ label, href }) => {
            const external = href.startsWith("http") || href.endsWith(".pdf");
            return (
              <Magnetic key={label} strength={0.35}>
                <a
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noreferrer" : undefined}
                  className="group flex items-center gap-2 rounded-full border px-5 py-2.5 font-sans text-small text-text-secondary transition-colors hover:border-white/30 hover:text-text-primary"
                  style={{ borderColor: "var(--border-hairline)" }}
                >
                  {label}
                  <span className="inline-block transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                    &#8599;
                  </span>
                </a>
              </Magnetic>
            );
          })}
        </div>

        <div
          className="mt-32 flex w-full flex-col items-center gap-4 border-t pt-8 font-mono text-mono-label uppercase text-text-tertiary sm:flex-row sm:justify-between"
          style={{ borderColor: "var(--border-hairline)" }}
        >
          <span>&copy; 2026 Saifaldin Kamel</span>
          <span>
            Giza &middot; <LocalTime />
          </span>
          <a href="#hero" className="transition-colors hover:text-text-primary">
            Back to top &uarr;
          </a>
        </div>
      </div>
    </section>
  );
}
