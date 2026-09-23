import { ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { duration, ease } from "@/components/shared/motion";
import { pb, categoryColors } from "../pbTheme";
import type { CategoryKind } from "../pbTheme";

export function TransactionRow({
  merchant,
  categoryLabel,
  categoryKind,
  bank,
  time,
  amount,
  type,
  playIntro = true,
  delay = 0,
}: {
  merchant: string;
  categoryLabel: string;
  categoryKind: CategoryKind;
  bank: string;
  time: string;
  amount: number;
  type: "income" | "expense";
  playIntro?: boolean;
  delay?: number;
}) {
  const color = categoryColors[categoryKind];
  return (
    <motion.div
      initial={playIntro ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.scene, ease: ease.in, delay: playIntro ? delay : 0 }}
      className="flex items-center gap-2.5 py-1.5"
    >
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-sans text-[11px] font-bold"
        style={{ backgroundColor: color.soft, color: color.fg }}
      >
        {merchant.slice(0, 1)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-sans text-[12px] font-bold" style={{ color: pb.textPrimary }}>
          {merchant}
        </p>
        <div className="mt-0.5 flex items-center gap-1.5">
          <span
            className="rounded-full px-1.5 py-0.5 font-sans text-[9px] font-semibold"
            style={{ backgroundColor: color.soft, color: color.fg }}
          >
            {categoryLabel}
          </span>
          <span className="font-sans text-[10px]" style={{ color: pb.textTertiary }}>
            {bank}
          </span>
        </div>
        <p className="mt-0.5 font-sans text-[10px]" style={{ color: pb.textTertiary }}>
          {time}
        </p>
      </div>
      <span
        className="shrink-0 font-sans text-[12px] font-bold tabular-nums"
        style={{ color: type === "income" ? pb.positive : pb.negative }}
      >
        {type === "income" ? "+" : "-"} {amount.toLocaleString("en-US")} EGP
      </span>
      <ChevronRight size={14} color={pb.textTertiary} className="shrink-0" />
    </motion.div>
  );
}
