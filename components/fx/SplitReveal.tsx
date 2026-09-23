"use client";

import { Fragment, type ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";

const TAGS = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  span: motion.span,
  div: motion.div,
};

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Masked text reveal: each word (or character) rises out of its own
 * clipping box. `trigger="mount"` plays immediately (or once `play`
 * turns true); `trigger="inView"` plays on first scroll into view.
 * `interactive` makes characters hop and light up under the pointer.
 */
export function SplitReveal({
  text,
  as = "span",
  by = "word",
  className = "",
  delay = 0,
  stagger,
  trigger = "inView",
  play = true,
  interactive = false,
}: {
  text: string;
  as?: keyof typeof TAGS;
  by?: "word" | "char";
  className?: string;
  delay?: number;
  stagger?: number;
  trigger?: "mount" | "inView";
  play?: boolean;
  interactive?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const Tag = TAGS[as];
  const step = stagger ?? (by === "char" ? 0.035 : 0.06);

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: step, delayChildren: delay } },
  };
  const piece: Variants = {
    hidden: reduceMotion ? { opacity: 0 } : { y: "110%", rotate: 4 },
    visible: reduceMotion
      ? { opacity: 1, transition: { duration: 0.4 } }
      : { y: "0%", rotate: 0, transition: { duration: 0.9, ease: EASE } },
  };

  const animateProps =
    trigger === "mount"
      ? { initial: "hidden", animate: play ? "visible" : "hidden" }
      : { initial: "hidden", whileInView: "visible", viewport: { once: true, amount: 0.5 } };

  const words = text.split(" ");

  return (
    <Tag aria-label={text} className={className} variants={container} {...animateProps}>
      {words.map((word, wordIndex) => (
        <Fragment key={wordIndex}>
        <span aria-hidden className="inline-block whitespace-nowrap">
          {by === "word" ? (
            <Mask>
              <motion.span variants={piece} className="inline-block origin-bottom-left">
                {word}
              </motion.span>
            </Mask>
          ) : (
            word.split("").map((char, charIndex) => (
              <Mask key={charIndex}>
                <motion.span
                  variants={piece}
                  className="inline-block origin-bottom-left"
                  whileHover={
                    interactive && !reduceMotion
                      ? { y: "-14%", color: "var(--signal-text)", transition: { type: "spring", stiffness: 500, damping: 12 } }
                      : undefined
                  }
                >
                  {char}
                </motion.span>
              </Mask>
            ))
          )}
        </span>
        {wordIndex < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}

function Mask({ children }: { children: ReactNode }) {
  return <span className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-top">{children}</span>;
}
