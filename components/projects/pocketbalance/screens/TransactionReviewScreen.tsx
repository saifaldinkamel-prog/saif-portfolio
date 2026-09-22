"use client";

import { pb } from "../pbTheme";
import { pendingTransaction, reviewCategories } from "../data/review";
import { useActivateOnce } from "../useActivateOnce";
import { TransactionReviewCard } from "../components/TransactionReviewCard";

export function TransactionReviewScreen({ isActive }: { isActive: boolean }) {
  const hasActivated = useActivateOnce(isActive);

  return (
    <div
      className="flex h-full flex-col justify-center px-4 py-4 transition-opacity duration-500"
      style={{ backgroundColor: pb.bg, opacity: hasActivated ? 1 : 0 }}
    >
      <TransactionReviewCard transaction={pendingTransaction} categories={reviewCategories} />
    </div>
  );
}
