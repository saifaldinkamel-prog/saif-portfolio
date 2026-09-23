"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ<>/_#*+=";

/** Cycles through `words`, decoding each new one out of random glyphs. */
export function ScrambleText({
  words,
  interval = 2600,
  className = "",
  start = true,
}: {
  words: readonly string[];
  interval?: number;
  className?: string;
  start?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(words[0]);

  useEffect(() => {
    if (!start) return;
    let index = 0;
    let frame = 0;

    function decodeTo(target: string) {
      let resolved = 0;
      cancelAnimationFrame(frame);
      const tick = () => {
        resolved += 0.45;
        setDisplay(
          target
            .split("")
            .map((char, i) =>
              i < resolved || char === " " ? char : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
            )
            .join("")
        );
        if (resolved < target.length) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }

    const timer = window.setInterval(() => {
      index = (index + 1) % words.length;
      if (reduceMotion) setDisplay(words[index]);
      else decodeTo(words[index]);
    }, interval);

    return () => {
      window.clearInterval(timer);
      cancelAnimationFrame(frame);
    };
  }, [words, interval, reduceMotion, start]);

  return (
    <span className={className} aria-label={words.join(", ")}>
      <span aria-hidden>{display}</span>
    </span>
  );
}
