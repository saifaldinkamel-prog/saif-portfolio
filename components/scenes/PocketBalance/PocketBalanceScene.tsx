"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform } from "motion/react";
import { SceneGlow } from "@/components/stage/SceneGlow";
import { PocketBalancePhone } from "@/components/projects/pocketbalance/PocketBalancePhone";

/**
 * The only file coupling the PocketBalance project module to the site:
 * owns the pinned scroll section, maps local scroll progress to the
 * phone's screenIndex, and registers this scene's light with the
 * shared glow field. components/projects/pocketbalance/ itself knows
 * nothing about scroll or scenes.
 */
export function PocketBalanceScene() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [globalRange, setGlobalRange] = useState<[number, number]>([0, 1]);

  useEffect(() => {
    function measure() {
      const section = sectionRef.current;
      if (!section) return;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const start = section.offsetTop / docHeight;
      const end = (section.offsetTop + section.offsetHeight - window.innerHeight) / docHeight;
      setGlobalRange([Math.max(0, start), Math.min(1, end)]);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const drive = useTransform(scrollYProgress, [0, 1], [0, 3]);

  return (
    <section ref={sectionRef} className="relative h-[380vh]">
      <SceneGlow id="pocketbalance" range={globalRange} x={50} y={42} color="var(--cool-glow)" intensity={0.7} />
      <div className="sticky top-0 flex h-screen items-center justify-center">
        <PocketBalancePhone scrollDrive={drive} />
      </div>
    </section>
  );
}
