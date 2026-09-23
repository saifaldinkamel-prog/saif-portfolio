"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Clock } from "lucide-react";
import { pb } from "../pbTheme";
import { pendingTransaction, reviewCategories } from "../data/review";
import { TransactionReviewCard } from "../components/TransactionReviewCard";

const EASE = [0.16, 1, 0.3, 1] as const;

type Outcome = { kind: "saved"; category: string } | { kind: "later" } | null;

/**
 * The real app's categorize popup on its own. Save or Later sends it
 * away and leaves a small result in its place, with a way to bring the
 * popup back.
 */
export function TransactionReviewScreen({ playIntro }: { playIntro: boolean }) {
  const [outcome, setOutcome] = useState<Outcome>(null);

  return (
    <div
      className="relative flex h-full flex-col justify-center overflow-hidden px-3"
      style={{ backgroundColor: pb.bg }}
      onPointerDownCapture={(event) => {
        if (!outcome) event.stopPropagation();
      }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {!outcome ? (
          <motion.div
            key="sheet"
            initial={{ y: playIntro ? 60 : 0, opacity: playIntro ? 0 : 1 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE, delay: playIntro ? 0.15 : 0 }}
          >
            <TransactionReviewCard
              transaction={pendingTransaction}
              categories={reviewCategories}
              onSave={(category) => setOutcome({ kind: "saved", category })}
              onLater={() => setOutcome({ kind: "later" })}
            />
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="flex flex-col items-center rounded-[1.6rem] border px-5 py-7 text-center"
            style={{ backgroundColor: "#162033", borderColor: pb.border }}
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 420, damping: 16, delay: 0.1 }}
              className="flex h-11 w-11 items-center justify-center rounded-full"
              style={
                outcome.kind === "saved"
                  ? { backgroundColor: pb.positiveSoft, color: pb.positive }
                  : { backgroundColor: pb.amberSoft, color: pb.amber }
              }
            >
              {outcome.kind === "saved" ? <Check size={20} /> : <Clock size={20} />}
            </motion.span>
            <p className="mt-3 font-sans text-[15px] font-bold" style={{ color: pb.textPrimary }}>
              {outcome.kind === "saved" ? `Saved as ${outcome.category}` : "Left for later"}
            </p>
            <p className="mt-1 font-sans text-[11px] leading-relaxed" style={{ color: pb.textTertiary }}>
              {outcome.kind === "saved"
                ? `${pendingTransaction.merchant} · ${pendingTransaction.amount.toLocaleString("en-US")} EGP. The next ${pendingTransaction.merchant} purchase gets this category automatically.`
                : `${pendingTransaction.merchant} stays in your review list until you choose a category.`}
            </p>
            <button
              type="button"
              onClick={() => setOutcome(null)}
              className="mt-4 rounded-lg border px-4 py-2 font-sans text-[11px] font-bold"
              style={{ borderColor: "rgba(255,255,255,0.3)", color: pb.textPrimary }}
            >
              {outcome.kind === "saved" ? "Review again" : "Categorize now"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
