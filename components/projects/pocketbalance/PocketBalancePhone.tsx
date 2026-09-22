"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion, useMotionValueEvent, type MotionValue, type PanInfo } from "motion/react";
import { duration, ease } from "@/components/shared/motion";
import { DeviceFrame } from "@/components/shared/DeviceFrame";
import { DashboardScreen } from "./screens/DashboardScreen";
import { InsightsScreen } from "./screens/InsightsScreen";
import { CategoriesScreen } from "./screens/CategoriesScreen";
import { TransactionReviewScreen } from "./screens/TransactionReviewScreen";

const SCREEN_COUNT = 4;
const NAV_THRESHOLD = 60;
const NAV_VELOCITY_THRESHOLD = 400;

type ControlMode = "scroll" | "user";

/**
 * The phone's state machine: screenIndex (0-3) + controlMode
 * ("scroll" | "user"). Scroll drives it by default via `scrollDrive`
 * (owned by the scene, not this component — the phone itself has no
 * knowledge of page scroll). Any swipe/tap/arrow-key input switches to
 * "user" and holds the screen until the visitor scrolls the page again,
 * at which point control returns to scroll.
 */
export function PocketBalancePhone({ scrollDrive }: { scrollDrive: MotionValue<number> }) {
  const [screenIndex, setScreenIndex] = useState(0);
  const [controlMode, setControlMode] = useState<ControlMode>("scroll");

  function goTo(next: number, source: ControlMode) {
    const clamped = Math.max(0, Math.min(SCREEN_COUNT - 1, next));
    setScreenIndex(clamped);
    setControlMode(source);
  }

  useMotionValueEvent(scrollDrive, "change", (value) => {
    if (controlMode !== "scroll") return;
    goTo(Math.round(value), "scroll");
  });

  // Any real page scroll while the visitor is in "user" control hands
  // control back to scroll — position: sticky keeps window scrollY
  // advancing throughout the pinned section, so this fires exactly
  // while the visitor is scrolling past it.
  useEffect(() => {
    if (controlMode !== "user") return;
    const handOff = () => setControlMode("scroll");
    window.addEventListener("scroll", handOff, { passive: true });
    return () => window.removeEventListener("scroll", handOff);
  }, [controlMode]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        goTo(screenIndex + 1, "user");
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        goTo(screenIndex - 1, "user");
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [screenIndex]);

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x <= -NAV_THRESHOLD || info.velocity.x <= -NAV_VELOCITY_THRESHOLD) {
      goTo(screenIndex + 1, "user");
    } else if (info.offset.x >= NAV_THRESHOLD || info.velocity.x >= NAV_VELOCITY_THRESHOLD) {
      goTo(screenIndex - 1, "user");
    }
  }

  const screens: { id: string; node: ReactNode }[] = [
    { id: "dashboard", node: <DashboardScreen isActive={screenIndex === 0} /> },
    { id: "insights", node: <InsightsScreen isActive={screenIndex === 1} /> },
    { id: "categories", node: <CategoriesScreen isActive={screenIndex === 2} /> },
    { id: "review", node: <TransactionReviewScreen isActive={screenIndex === 3} /> },
  ];

  return (
    <div className="flex flex-col items-center gap-5">
      <DeviceFrame>
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          onDragEnd={handleDragEnd}
          className="relative h-full w-full touch-pan-y"
        >
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            onClick={() => goTo(screenIndex - 1, "user")}
            className="absolute inset-y-0 left-0 z-10 w-1/4"
          />
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            onClick={() => goTo(screenIndex + 1, "user")}
            className="absolute inset-y-0 right-0 z-10 w-1/4"
          />
          <motion.div
            className="flex h-full"
            style={{ width: `${SCREEN_COUNT * 100}%` }}
            animate={{ x: `-${(screenIndex / SCREEN_COUNT) * 100}%` }}
            transition={{ duration: duration.base, ease: ease.in }}
          >
            {screens.map((screen) => (
              <div key={screen.id} className="h-full shrink-0" style={{ width: `${100 / SCREEN_COUNT}%` }}>
                {screen.node}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </DeviceFrame>

      <div className="flex items-center gap-2" role="tablist" aria-label="PocketBalance screens">
        {screens.map((screen, index) => (
          <button
            key={screen.id}
            type="button"
            role="tab"
            aria-selected={index === screenIndex}
            aria-label={`Screen ${index + 1}`}
            onClick={() => goTo(index, "user")}
            className="h-1.5 rounded-full transition-[width] duration-300"
            style={{
              width: index === screenIndex ? "20px" : "6px",
              backgroundColor: index === screenIndex ? "var(--signal)" : "var(--border-hairline)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
