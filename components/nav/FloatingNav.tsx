"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform } from "motion/react";
import { TransitionLink } from "@/components/transition/TransitionProvider";
import { workHref } from "@/components/scenes/Projects/projects";

const LINKS = [
  { id: "about", label: "About" },
  { id: "work", label: "Work", href: workHref, mobile: true },
  { id: "how-i-build", label: "Process" },
];

/**
 * The site's only persistent chrome. On the home page it fades in once
 * the visitor has scrolled past most of the Hero; on every other route
 * it's there from the start. Anchor links resolve per route (`#id` at
 * home, `/#id` elsewhere) and every link plays the scene transition.
 */
export function FloatingNav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { scrollY } = useScroll();
  const [threshold, setThreshold] = useState(600);

  useEffect(() => {
    function measure() {
      setThreshold(window.innerHeight * 0.65);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const opacity = useTransform(scrollY, [threshold * 0.7, threshold], [0, 1]);
  const y = useTransform(scrollY, [threshold * 0.7, threshold], [-16, 0]);
  const anchor = (id: string) => (isHome ? `#${id}` : `/#${id}`);

  return (
    <motion.header
      style={isHome ? { opacity, y } : undefined}
      className="fixed left-1/2 top-5 z-40 -translate-x-1/2"
    >
      <nav
        className="flex items-center gap-1 rounded-full border px-2 py-2 backdrop-blur-md"
        style={{ borderColor: "var(--border-hairline)", backgroundColor: "rgba(18,21,26,0.72)" }}
        aria-label="Primary"
      >
        <TransitionLink
          href={isHome ? "#hero" : "/"}
          label="Home"
          className="whitespace-nowrap rounded-full px-2.5 py-1.5 font-sans text-small font-medium text-text-primary"
        >
          Saif
        </TransitionLink>
        {LINKS.map((link) => {
          const href = link.href ?? anchor(link.id);
          const active = link.href ? pathname.startsWith("/projects") : false;
          return (
            <TransitionLink
              key={link.id}
              href={href}
              label={link.label}
              className={`${link.mobile ? "inline-block" : "hidden md:inline-block"} whitespace-nowrap rounded-full px-2.5 py-1.5 font-sans text-small transition-colors hover:text-text-primary`}
              style={{ color: active ? "var(--text-primary)" : "var(--text-secondary)" }}
            >
              {link.label}
            </TransitionLink>
          );
        })}
        <TransitionLink
          href={anchor("closing")}
          label="Contact"
          className="ml-1 whitespace-nowrap rounded-full border border-signal-border bg-signal-wash px-3.5 py-1.5 font-mono text-mono-label uppercase text-signal-text transition-colors hover:bg-signal hover:text-on-signal"
        >
          Let&rsquo;s talk
        </TransitionLink>
      </nav>
    </motion.header>
  );
}
