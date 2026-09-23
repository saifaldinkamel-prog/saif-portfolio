"use client";

import { BarChart3, ArrowUpRight, ArrowUp, Calendar, ChevronDown } from "lucide-react";
import { pb } from "../pbTheme";
import { categoriesAccount, categorySummary, categoryRows } from "../data/categories";
import { AccountSelector } from "../components/AccountSelector";
import { CategoryCard } from "../components/CategoryCard";

export function CategoriesScreen({ playIntro }: { playIntro: boolean }) {
  const hasActivated = playIntro;

  return (
    <div className="flex h-full flex-col gap-2.5 overflow-hidden px-4 py-4" style={{ backgroundColor: pb.bg }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-sans text-xl font-extrabold" style={{ color: pb.textPrimary }}>
            Categories
          </p>
          <p className="font-sans text-[11px]" style={{ color: pb.textTertiary }}>
            See where your money goes
          </p>
        </div>
        <span className="flex h-8 w-8 items-center justify-center rounded-full" style={{ backgroundColor: pb.surface, color: pb.textSecondary }}>
          <BarChart3 size={14} />
        </span>
      </div>

      <AccountSelector label={categoriesAccount} />

      <div className="flex gap-2">
        <div className="flex-1">
          <p className="font-sans text-[9px] font-medium uppercase tracking-wide" style={{ color: pb.textTertiary }}>
            Transaction type
          </p>
          <div className="mt-1 flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5" style={{ borderColor: pb.border, backgroundColor: pb.surface }}>
            <ArrowUpRight size={12} color={pb.negative} />
            <span className="flex-1 font-sans text-[11px] font-semibold" style={{ color: pb.textPrimary }}>
              Spent
            </span>
            <ChevronDown size={12} color={pb.textTertiary} />
          </div>
        </div>
        <div className="flex-1">
          <p className="font-sans text-[9px] font-medium uppercase tracking-wide" style={{ color: pb.textTertiary }}>
            Time period
          </p>
          <div className="mt-1 flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5" style={{ borderColor: pb.border, backgroundColor: pb.surface }}>
            <Calendar size={12} color="#A78BFA" />
            <span className="flex-1 truncate font-sans text-[11px] font-semibold" style={{ color: pb.textPrimary }}>
              This week
            </span>
            <ChevronDown size={12} color={pb.textTertiary} />
          </div>
        </div>
      </div>

      <div
        className="flex items-center justify-between rounded-xl border px-3.5 py-3"
        style={{ borderColor: "rgba(251,113,133,0.35)", backgroundColor: "rgba(251,113,133,0.08)" }}
      >
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full"
            style={{ backgroundColor: pb.negativeSoft, color: pb.negative }}
          >
            <ArrowUpRight size={14} />
          </span>
          <div>
            <p className="font-sans text-[10px]" style={{ color: pb.textTertiary }}>
              Total spent
            </p>
            <p className="font-sans text-xl font-extrabold tabular-nums" style={{ color: pb.textPrimary }}>
              {categorySummary.totalSpent.toLocaleString("en-US")} EGP
            </p>
            <p className="font-sans text-[10px]" style={{ color: pb.textTertiary }}>
              {categorySummary.range}
            </p>
          </div>
        </div>
        <span
          className="flex items-center gap-0.5 rounded-full px-2 py-1 font-sans text-[10px] font-bold"
          style={{ backgroundColor: pb.negativeSoft, color: pb.negative }}
        >
          <ArrowUp size={10} />
          {categorySummary.trendPercent}%
        </span>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between">
          <p className="font-sans text-[13px] font-bold" style={{ color: pb.textPrimary }}>
            Categories
          </p>
          <span className="font-sans text-[10px] font-semibold" style={{ color: pb.blue }}>
            Amount (high to low)
          </span>
        </div>
        <div className="mt-2 flex flex-col gap-2">
          {categoryRows.map((category, index) => (
            <CategoryCard
              key={category.name}
              name={category.name}
              kind={category.kind}
              transactions={category.transactions}
              amount={category.amount}
              percent={category.percent}
              hasActivated={hasActivated}
              delay={index * 0.05}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
