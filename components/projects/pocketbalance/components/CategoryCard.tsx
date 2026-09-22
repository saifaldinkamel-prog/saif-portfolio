"use client";

import { Utensils, ShoppingBag, Car, Home, MoreHorizontal, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { duration, ease } from "@/components/shared/motion";
import { pb, categoryColors, type CategoryKind } from "../pbTheme";
import { ProgressBar } from "./ProgressBar";

const ICONS: Record<CategoryKind, typeof Utensils> = {
  food: Utensils,
  shopping: ShoppingBag,
  transport: Car,
  bills: Home,
  other: MoreHorizontal,
};

export function CategoryCard({
  name,
  kind,
  transactions,
  amount,
  percent,
  hasActivated,
  delay = 0,
}: {
  name: string;
  kind: CategoryKind;
  transactions: number;
  amount: number;
  percent: number;
  hasActivated: boolean;
  delay?: number;
}) {
  const Icon = ICONS[kind];
  const color = categoryColors[kind];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: hasActivated ? 1 : 0, y: hasActivated ? 0 : 8 }}
      transition={{ duration: duration.scene, ease: ease.in, delay }}
      className="rounded-xl border px-3 py-2.5"
      style={{ borderColor: pb.border, backgroundColor: pb.surface }}
    >
      <div className="flex items-center gap-2.5">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: color.soft, color: color.fg }}
        >
          <Icon size={15} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-sans text-[13px] font-semibold" style={{ color: pb.textPrimary }}>
            {name}
          </p>
          <p className="font-sans text-[11px]" style={{ color: pb.textTertiary }}>
            {transactions} transactions
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-sans text-[13px] font-bold tabular-nums" style={{ color: pb.textPrimary }}>
            {amount.toLocaleString("en-US")} EGP
          </p>
          <p className="font-sans text-[11px] tabular-nums" style={{ color: pb.textTertiary }}>
            {percent}%
          </p>
        </div>
        <ChevronRight size={14} color={pb.textTertiary} className="shrink-0" />
      </div>
      <div className="mt-2">
        <ProgressBar percent={percent} color={color.fg} hasActivated={hasActivated} delay={delay + 0.08} />
      </div>
    </motion.div>
  );
}
