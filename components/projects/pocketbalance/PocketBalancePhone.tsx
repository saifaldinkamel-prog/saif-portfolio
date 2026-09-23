"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  type MotionValue,
  type PanInfo,
} from "motion/react";
import { duration, ease } from "@/components/shared/motion";
import { DeviceFrame } from "@/components/shared/DeviceFrame";
import { DashboardScreen } from "./screens/DashboardScreen";
import { InsightsScreen } from "./screens/InsightsScreen";
import { CategoriesScreen } from "./screens/CategoriesScreen";
import { TransactionReviewScreen } from "./screens/TransactionReviewScreen";
import { categoryRows } from "./data/categories";
import { account, type SimulatedSms } from "./data/dashboard";
import { reviewCategories } from "./data/review";
import { TransactionReviewCard, type ReviewResult } from "./components/TransactionReviewCard";
import { categoryColors, pb } from "./pbTheme";

const SCREEN_COUNT = 4;
const NAV_THRESHOLD = 60;
const NAV_VELOCITY_THRESHOLD = 400;
/** The review popup is fully interactive, so edge tap-zones would swallow its buttons. */
const INTERACTIVE_SCREEN = 3;

type ControlMode = "scroll" | "user";

/** The phone's own ambient glow per screen — distinct from the site's
 * stage-wide SceneGlow, which stays a fixed backdrop tone. This one is
 * local to the phone and reacts to which screen is showing. */
const SCREEN_GLOW: Record<number, string> = {
  0: "#7C3AED", // Dashboard — violet, matches the balance card
  1: "#4F46E5", // Insights — blue/purple
  2: categoryColors[categoryRows[0].kind].fg, // Categories — the top category's own color
  3: "#EF4444", // Transaction Review — warm/red attention state
};

const slideVariants = {
  enter: (direction: number) => ({ x: `${direction * 30}%`, opacity: 0 }),
  center: { x: "0%", opacity: 1 },
  exit: (direction: number) => ({ x: `${direction * -30}%`, opacity: 0 }),
};

/**
 * The phone's state machine: screenIndex (0-3) + controlMode
 * ("scroll" | "user"). Scroll drives it by default via `scrollDrive`
 * (owned by the scene, not this component — the phone itself has no
 * knowledge of page scroll). Any swipe/tap/arrow-key input switches to
 * "user" and holds the screen until the visitor scrolls the page again,
 * at which point control returns to scroll.
 */
export function PocketBalancePhone({
  scrollDrive,
  onScreenChange,
  incoming = [],
  banner = null,
  review = null,
}: {
  scrollDrive: MotionValue<number>;
  /** Optional: lets a hosting scene mirror screenIndex for its own
   * purposes (e.g. syncing narrative copy). The phone stays the one
   * source of truth — this is a read-only notification, not control. */
  onScreenChange?: (index: number) => void;
  /** Bank messages delivered so far; the Dashboard folds them into its balance and list. */
  incoming?: SimulatedSms[];
  /** A message currently showing as a notification; `parsed` highlights the extracted fields. */
  banner?: { sms: SimulatedSms; parsed: boolean } | null;
  /** A delivered message the app couldn't categorize — opens the categorize popup over the home screen. */
  review?: {
    sms: SimulatedSms;
    onDone: (result: ReviewResult) => void;
    onLater: () => void;
  } | null;
}) {
  const [screenIndex, setScreenIndex] = useState(0);
  const [controlMode, setControlMode] = useState<ControlMode>("scroll");
  const [direction, setDirection] = useState(1);
  // Screens a visitor has already left at least once — used to skip
  // replaying their entrance animation on return. Marked when LEAVING
  // a screen (inside goTo, below), never when arriving at one, so the
  // screen currently on display never has its own "seen" flag flipped
  // out from under it mid-animation.
  const [seen, setSeen] = useState<Set<number>>(() => new Set());

  const goTo = useCallback(
    (next: number, source: ControlMode) => {
      const clamped = Math.max(0, Math.min(SCREEN_COUNT - 1, next));
      // Side effects (including onScreenChange, which sets state on the
      // hosting scene) live at the top level of this callback, not
      // inside setScreenIndex's updater — calling a different
      // component's setter from inside an updater function is what
      // trips React's "update while rendering a different component"
      // warning, even though goTo itself only ever runs from event
      // handlers or a motion-value subscription, never during render.
      if (clamped !== screenIndex) {
        setDirection(clamped > screenIndex ? 1 : -1);
        setSeen((prev) => (prev.has(screenIndex) ? prev : new Set(prev).add(screenIndex)));
        onScreenChange?.(clamped);
      }
      setScreenIndex(clamped);
      setControlMode(source);
    },
    [screenIndex, onScreenChange]
  );

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
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea")) return;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        goTo(screenIndex + 1, "user");
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        goTo(screenIndex - 1, "user");
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [screenIndex, goTo]);

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x <= -NAV_THRESHOLD || info.velocity.x <= -NAV_VELOCITY_THRESHOLD) {
      goTo(screenIndex + 1, "user");
    } else if (info.offset.x >= NAV_THRESHOLD || info.velocity.x >= NAV_VELOCITY_THRESHOLD) {
      goTo(screenIndex - 1, "user");
    }
  }

  // Each screen only plays its entrance animation the first time it's
  // ever shown. Screens now mount fresh per visit (AnimatePresence),
  // so that "seen" memory has to live up here, not in the screen
  // itself.
  const playIntro = !seen.has(screenIndex);

  function renderScreen(index: number) {
    switch (index) {
      case 0:
        return <DashboardScreen playIntro={playIntro} incoming={incoming} />;
      case 1:
        return <InsightsScreen playIntro={playIntro} />;
      case 2:
        return <CategoriesScreen playIntro={playIntro} />;
      default:
        return <TransactionReviewScreen playIntro={playIntro} />;
    }
  }

  return (
    <div className="relative flex w-full max-w-[320px] flex-col items-center gap-5">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ filter: "blur(90px)" }}
        animate={{ backgroundColor: SCREEN_GLOW[screenIndex], opacity: 0.35 }}
        transition={{ duration: 0.7, ease: ease.in }}
      />

      <DeviceFrame>
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          onDragEnd={handleDragEnd}
          className="relative h-full w-full touch-pan-y overflow-hidden"
        >
          {screenIndex !== INTERACTIVE_SCREEN && (
            <>
              <button
                type="button"
                aria-hidden
                tabIndex={-1}
                onClick={() => goTo(screenIndex - 1, "user")}
                className="absolute inset-y-0 left-0 z-30 w-1/4"
              />
              <button
                type="button"
                aria-hidden
                tabIndex={-1}
                onClick={() => goTo(screenIndex + 1, "user")}
                className="absolute inset-y-0 right-0 z-30 w-1/4"
              />
            </>
          )}

          <AnimatePresence mode="popLayout" custom={direction} initial={false}>
            <motion.div
              key={screenIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: duration.base, ease: ease.in }}
              className="absolute inset-0"
            >
              {renderScreen(screenIndex)}
            </motion.div>
          </AnimatePresence>

          <AnimatePresence>
            {banner && (
              <motion.div
                key={banner.sms.id}
                initial={{ opacity: 0, y: -40, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -40, scale: 0.94 }}
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
                className="absolute inset-x-2 top-7 z-40 rounded-2xl border px-3 py-2.5 backdrop-blur-md"
                style={{ backgroundColor: "rgba(23,35,58,0.92)", borderColor: pb.border }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-sans text-[10px] font-bold uppercase tracking-wider" style={{ color: pb.textSecondary }}>
                    Messages &middot; {account.bank}
                  </span>
                  <span className="font-sans text-[10px]" style={{ color: pb.textTertiary }}>
                    now
                  </span>
                </div>
                <p className="mt-1 font-sans text-[11.5px] leading-snug" style={{ color: pb.textPrimary }}>
                  {banner.sms.kind === "transfer" ? (
                    <>
                      InstaPay transfer of{" "}
                      <ParsedToken on={banner.parsed} color={pb.negative}>
                        EGP {banner.sms.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </ParsedToken>{" "}
                      from account ending 1234.
                    </>
                  ) : (
                    <>
                      Purchase of{" "}
                      <ParsedToken on={banner.parsed} color={pb.negative}>
                        EGP {banner.sms.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </ParsedToken>{" "}
                      at{" "}
                      <ParsedToken
                        on={banner.parsed}
                        color={banner.sms.status === "auto" ? categoryColors[banner.sms.categoryKind].fg : pb.amber}
                      >
                        {banner.sms.merchant}
                      </ParsedToken>{" "}
                      on card ending 1234.
                    </>
                  )}
                </p>
                <AnimatePresence>
                  {banner.parsed && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-1.5 flex items-center gap-1 font-sans text-[10.5px] font-bold"
                      style={{ color: banner.sms.status === "auto" ? pb.positive : pb.amber }}
                    >
                      {bannerStatus(banner.sms)}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {review && screenIndex === 0 && (
              <motion.div
                key="review-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-40 flex flex-col justify-end px-2 pb-2"
                style={{ backgroundColor: "rgba(2,6,15,0.55)" }}
                onPointerDownCapture={(event) => event.stopPropagation()}
              >
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ duration: 0.5, ease: ease.in }}
                >
                  <TransactionReviewCard
                    key={review.sms.id}
                    transaction={{
                      kind: review.sms.kind,
                      merchant: review.sms.kind === "transfer" ? "Not in the SMS" : review.sms.merchant,
                      amount: review.sms.amount,
                      account: account.label,
                      date: "Just now",
                    }}
                    categories={reviewCategories}
                    offerLearning={review.sms.kind !== "transfer"}
                    onDone={review.onDone}
                    onLater={review.onLater}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </DeviceFrame>

      <div className="flex items-center gap-2" role="tablist" aria-label="PocketBalance screens">
        {Array.from({ length: SCREEN_COUNT }).map((_, index) => (
          <button
            key={index}
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

function bannerStatus(sms: SimulatedSms): string {
  if (sms.kind === "transfer") return "? Bank transfer — no store name, so it asks you";
  if (sms.status !== "auto") return "? New store — PocketBalance asks you once";
  if (sms.learned) return `✓ Learned from you → ${sms.categoryLabel}, automatically`;
  return `✓ Known store → ${sms.categoryLabel}, automatically`;
}

function ParsedToken({ on, color, children }: { on: boolean; color: string; children: ReactNode }) {
  return (
    <motion.span
      className="rounded px-0.5 font-semibold"
      animate={{ backgroundColor: on ? `${color}33` : `${color}00`, color: on ? color : pb.textPrimary }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.span>
  );
}
