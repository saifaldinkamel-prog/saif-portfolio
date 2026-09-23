"use client";

import { motion } from "motion/react";
import { BarChart3, ShoppingBag } from "lucide-react";
import { duration, ease } from "@/components/shared/motion";
import { pb, categoryColors } from "../pbTheme";
import { insightsAccount, spendSummary, contributor, quickSignals } from "../data/insights";
import { AccountSelector } from "../components/AccountSelector";
import { ToggleGroup } from "../components/ToggleGroup";
import { ProgressBar } from "../components/ProgressBar";
import { CountUpNumber } from "../components/CountUpNumber";
import { SignalRow } from "../components/SignalRow";

export function InsightsScreen({ playIntro }: { playIntro: boolean }) {
  const hasActivated = playIntro;
  const contributorColor = categoryColors[contributor.categoryKind];

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden px-4 py-3.5" style={{ backgroundColor: pb.bg }}>
      <div>
        <p className="font-sans text-xl font-extrabold" style={{ color: pb.textPrimary }}>
          Money Insights
        </p>
        <p className="font-sans text-[11px]" style={{ color: pb.textTertiary }}>
          Bank and cash spending signals
        </p>
      </div>

      <AccountSelector label={insightsAccount} layoutId="pb-account-pill" />

      <motion.div
        layoutId="pb-hero-card"
        transition={{ duration: duration.scene, ease: ease.in }}
        className="relative overflow-hidden rounded-2xl border px-3.5 py-3"
        style={{ borderColor: "rgba(59,130,246,0.4)", backgroundColor: pb.surfaceRaised }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full"
          style={{ background: "radial-gradient(closest-side, rgba(236,72,153,0.24), transparent)" }}
        />

        <div className="relative flex items-center gap-2">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full"
            style={{ backgroundColor: "rgba(251,113,133,0.18)", color: pb.negative }}
          >
            <BarChart3 size={13} />
          </span>
          <div>
            <p className="font-sans text-[10px] font-bold uppercase tracking-wide" style={{ color: pb.textSecondary }}>
              Money Insights
            </p>
            <p className="font-sans text-[10px]" style={{ color: pb.textTertiary }}>
              Your spending analysis
            </p>
          </div>
        </div>

        <div className="relative mt-2 flex flex-col gap-1.5">
          <ToggleGroup options={["Spending", "Income"]} active="Spending" />
          <ToggleGroup options={["Weekly", "Monthly"]} active="Weekly" />
        </div>

        <p className="relative mt-2 font-sans text-[11px]" style={{ color: pb.textSecondary }}>
          You spent
        </p>
        <motion.p
          layoutId="pb-hero-figure"
          transition={{ duration: duration.scene, ease: ease.in }}
          className="relative font-sans text-3xl font-extrabold tabular-nums"
          style={{ color: pb.negative }}
        >
          <CountUpNumber value={spendSummary.currentWeek} hasActivated={hasActivated} /> EGP
        </motion.p>
        <p className="relative font-sans text-[11px]" style={{ color: pb.textSecondary }}>
          more than last week
        </p>

        <div className="relative mt-2 flex gap-2">
          <div className="flex-1 rounded-lg border px-2.5 py-2" style={{ borderColor: pb.border, backgroundColor: pb.surface }}>
            <p className="font-sans text-[9px] font-semibold uppercase tracking-wide" style={{ color: pb.textTertiary }}>
              Current week
            </p>
            <p className="font-sans text-sm font-bold tabular-nums" style={{ color: pb.negative }}>
              {spendSummary.currentWeek.toLocaleString("en-US")} EGP
            </p>
            <p className="font-sans text-[9px]" style={{ color: pb.textTertiary }}>
              {spendSummary.currentRange}
            </p>
          </div>
          <div className="flex-1 rounded-lg border px-2.5 py-2" style={{ borderColor: pb.border, backgroundColor: pb.surface }}>
            <p className="font-sans text-[9px] font-semibold uppercase tracking-wide" style={{ color: pb.textTertiary }}>
              Last week
            </p>
            <p className="font-sans text-sm font-bold tabular-nums" style={{ color: pb.textPrimary }}>
              {spendSummary.lastWeek.toLocaleString("en-US")} EGP
            </p>
            <p className="font-sans text-[9px]" style={{ color: pb.textTertiary }}>
              {spendSummary.lastRange}
            </p>
          </div>
        </div>

        <p className="relative mt-2 font-sans text-[12px] font-bold" style={{ color: pb.textPrimary }}>
          Why did this change?
        </p>
        <p className="relative font-sans text-[10px]" style={{ color: pb.textTertiary }}>
          Biggest contributor to the increase
        </p>

        <div className="relative mt-1 rounded-lg border px-2.5 py-2" style={{ borderColor: pb.border, backgroundColor: pb.surface }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full"
                style={{ backgroundColor: contributorColor.soft, color: contributorColor.fg }}
              >
                <ShoppingBag size={12} />
              </span>
              <div>
                <p className="font-sans text-[11px] font-semibold" style={{ color: pb.textPrimary }}>
                  {contributor.categoryLabel}
                </p>
                <p className="font-sans text-[10px]" style={{ color: pb.textTertiary }}>
                  Increased by {contributor.amount.toLocaleString("en-US")} EGP
                </p>
              </div>
            </div>
            <p className="font-sans text-[12px] font-bold tabular-nums" style={{ color: pb.textPrimary }}>
              {contributor.amount.toLocaleString("en-US")} EGP
            </p>
          </div>
          <div className="mt-1.5">
            <ProgressBar percent={contributor.percentOfSpending} color={contributorColor.fg} hasActivated={hasActivated} />
          </div>
          <p className="mt-1 font-sans text-[9px]" style={{ color: pb.textTertiary }}>
            {contributor.percentOfSpending}% of spending
          </p>
        </div>
      </motion.div>

      <div className="flex-1 overflow-hidden">
        <p className="font-sans text-[13px] font-bold" style={{ color: pb.textPrimary }}>
          Quick signals
        </p>
        <div className="mt-1.5 flex flex-col gap-1.5">
          {quickSignals.slice(0, 2).map((signal, index) => (
            <SignalRow
              key={signal.id}
              kind={signal.kind}
              title={signal.title}
              subtitle={signal.subtitle}
              playIntro={hasActivated}
              delay={0.3 + index * 0.08}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
