"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

/**
 * A paragraph that starts almost invisible and lights up word by word
 * as it scrolls through the viewport — the "built in the dark" idea
 * applied to copy. Words listed in `highlight` light up in the signal
 * color instead of white.
 */
export function ScrollLitText({
  text,
  className = "",
  highlight = [],
}: {
  text: string;
  className?: string;
  highlight?: string[];
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");

  return (
    <p ref={ref} className={className} aria-label={text}>
      {words.map((word, index) => {
        const start = index / words.length;
        const end = start + 1 / words.length;
        const isHighlight = highlight.includes(word.replace(/[.,—]/g, ""));
        return (
          <Word key={index} progress={scrollYProgress} range={[start, end]} highlight={isHighlight}>
            {word}
          </Word>
        );
      })}
    </p>
  );
}

function Word({
  children,
  progress,
  range,
  highlight,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  highlight: boolean;
}) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <span aria-hidden>
      <motion.span style={{ opacity, color: highlight ? "var(--signal-text)" : undefined }}>{children}</motion.span>{" "}
    </span>
  );
}
