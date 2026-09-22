"use client";

import { useRef, useState } from "react";
import { motion, useTransform } from "motion/react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { useSwipeGesture } from "@/components/shared/useSwipeGesture";
import { pb, categoryColors } from "../pbTheme";
import type { pendingTransaction as PendingTransaction, reviewCategories as ReviewCategories } from "../data/review";

const SWIPE_RIGHT = "Food & Drinks";
const SWIPE_LEFT = "Shopping";

/**
 * Reuses useSwipeGesture — same hook Playground's "swipe to categorize"
 * demo (Phase 3) mounts on its own card. Swipe-to-categorize is a
 * portfolio adaptation of the real app's tap-chip review sheet, not a
 * claim the real app uses a swipe gesture — approved as such.
 */
export function TransactionReviewCard({
  transaction,
  categories,
}: {
  transaction: typeof PendingTransaction;
  categories: typeof ReviewCategories;
}) {
  const [resolvedCategory, setResolvedCategory] = useState<string | null>(null);
  const resolvingRef = useRef(false);

  const { drag, dragElastic, dragConstraints, dragTransition, onDragEnd, style, offset } = useSwipeGesture({
    axis: "x",
    threshold: 110,
    onCommit: (direction) => {
      if (resolvingRef.current) return;
      resolve(direction === 1 ? SWIPE_RIGHT : SWIPE_LEFT);
    },
  });

  function resolve(category: string) {
    resolvingRef.current = true;
    setResolvedCategory(category);
  }

  function reset() {
    resolvingRef.current = false;
    setResolvedCategory(null);
  }

  const rotate = useTransform(offset, [-160, 0, 160], [-6, 0, 6]);
  const rightHint = useTransform(offset, [20, 140], [0, 1]);
  const leftHint = useTransform(offset, [-140, -20], [1, 0]);

  return (
    <div
      className="w-full rounded-2xl border px-4 py-4"
      style={{ borderColor: pb.border, backgroundColor: pb.surfaceRaised }}
    >
      <div className="mx-auto mb-3 h-1 w-10 rounded-full" style={{ backgroundColor: pb.border }} />

      <div className="flex w-full items-center justify-between px-1">
        <motion.span
          className="font-sans text-[10px] font-bold uppercase"
          style={{ opacity: leftHint, color: categoryColors.shopping.fg }}
        >
          &larr; {SWIPE_LEFT}
        </motion.span>
        <motion.span
          className="font-sans text-[10px] font-bold uppercase"
          style={{ opacity: rightHint, color: categoryColors.food.fg }}
        >
          {SWIPE_RIGHT} &rarr;
        </motion.span>
      </div>

      <motion.div
        drag={drag}
        dragElastic={dragElastic}
        dragConstraints={dragConstraints}
        dragTransition={dragTransition}
        onDragEnd={onDragEnd}
        style={{ ...style, rotate }}
        className="mt-1 w-full cursor-grab touch-none select-none active:cursor-grabbing"
      >
        <div className="flex items-center gap-2">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full"
            style={{ backgroundColor: "rgba(127,29,29,0.4)", color: pb.negative }}
          >
            <ArrowUpRight size={14} />
          </span>
          <span className="font-sans text-[12px] font-semibold" style={{ color: pb.textSecondary }}>
            Purchase
          </span>
        </div>
        <p className="mt-1.5 font-sans text-3xl font-extrabold tabular-nums" style={{ color: pb.textPrimary }}>
          {transaction.amount.toLocaleString("en-US")} EGP
        </p>

        <div className="mt-3 flex flex-col gap-1.5 border-t pt-3" style={{ borderColor: pb.border }}>
          <InfoRow label="Account" value={transaction.account} />
          <InfoRow label="Date" value={transaction.date} />
          <InfoRow label="Merchant / recipient" value={transaction.merchant} />
        </div>

        <p className="mt-2 flex items-center gap-1 font-sans text-[11px] font-semibold" style={{ color: pb.blue }}>
          Message details <ChevronDown size={12} />
        </p>
      </motion.div>

      <p className="mt-3 font-sans text-[12px] font-bold" style={{ color: pb.textPrimary }}>
        Choose category
      </p>
      <div className="mt-1.5 flex gap-1.5 overflow-x-hidden">
        {categories.map((category) => {
          const color = categoryColors[category.kind];
          const isChosen = resolvedCategory === category.name;
          return (
            <button
              key={category.name}
              type="button"
              onClick={() => resolve(category.name)}
              className="shrink-0 rounded-full border px-2.5 py-1.5 font-sans text-[11px] font-semibold"
              style={{
                borderColor: isChosen ? color.fg : pb.border,
                backgroundColor: isChosen ? color.soft : "transparent",
                color: isChosen ? color.fg : pb.textSecondary,
              }}
            >
              {category.name}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={reset}
          className="flex-1 rounded-lg border py-2 font-sans text-[12px] font-semibold"
          style={{ borderColor: pb.border, color: pb.textSecondary }}
        >
          Later
        </button>
        <button
          type="button"
          onClick={reset}
          disabled={!resolvedCategory}
          className="flex-1 rounded-lg py-2 font-sans text-[12px] font-semibold"
          style={{
            backgroundColor: resolvedCategory ? pb.blue : pb.surface,
            color: resolvedCategory ? "#FFFFFF" : pb.textTertiary,
          }}
        >
          {resolvedCategory ? `Save as ${resolvedCategory}` : "Save"}
        </button>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-sans text-[11px]" style={{ color: pb.textTertiary }}>
        {label}
      </span>
      <span className="font-sans text-[11px] font-semibold" style={{ color: pb.textPrimary }}>
        {value}
      </span>
    </div>
  );
}
