"use client";

import { Bell, Wallet, ArrowUpRight, ArrowDownRight, Calendar, Search, Sparkles, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { pb } from "../pbTheme";
import {
  account,
  balanceCard,
  weeklyStats,
  recentTransactions,
  type SimulatedSms,
} from "../data/dashboard";
import { BalanceCard } from "../components/BalanceCard";
import { StatBox } from "../components/StatBox";
import { ProgressBar } from "../components/ProgressBar";
import { TransactionRow } from "../components/TransactionRow";
import { CountUpNumber } from "../components/CountUpNumber";

export function DashboardScreen({
  playIntro,
  incoming = [],
}: {
  playIntro: boolean;
  /** Bank messages delivered so far, oldest first. */
  incoming?: SimulatedSms[];
}) {
  const hasActivated = playIntro;
  const weekPercent = Math.round((weeklyStats.weekDaysElapsed / weeklyStats.weekDaysTotal) * 100);
  const newSpend = incoming.reduce((sum, sms) => sum + sms.amount, 0);
  const newRows = [...incoming].reverse().map((sms) => ({
    id: sms.id,
    merchant: sms.merchant,
    categoryLabel: sms.categoryLabel,
    categoryKind: sms.categoryKind,
    bank: account.bank,
    time: "Just now",
    amount: sms.amount,
    type: "expense" as const,
    isNew: true,
  }));
  const rows = [...newRows, ...recentTransactions.map((t) => ({ ...t, isNew: false }))].slice(0, 2);

  return (
    <div className="flex h-full flex-col gap-2.5 overflow-hidden px-4 py-3.5" style={{ backgroundColor: pb.bg }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-sans text-xl font-extrabold" style={{ color: pb.textPrimary }}>
            PocketBalance
          </p>
          <p className="font-sans text-[11px]" style={{ color: pb.textTertiary }}>
            Track smarter. Live better.
          </p>
        </div>
        <span
          className="relative flex h-8 w-8 items-center justify-center rounded-full"
          style={{ backgroundColor: pb.amberSoft, color: pb.amber }}
        >
          <Bell size={15} />
          <span
            className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full font-sans text-[8px] font-bold text-white"
            style={{ backgroundColor: pb.negative }}
          >
            1
          </span>
        </span>
      </div>

      <BalanceCard
        bankInitials={account.initials}
        label={account.label}
        balance={balanceCard.balance - newSpend}
        currency={balanceCard.currency}
        dotCount={balanceCard.accountCount}
        activeDot={balanceCard.activeAccountIndex}
        toggleOptions={["Bank Balance", "Budget"]}
        hasActivated={hasActivated}
        cardLayoutId="pb-hero-card"
        accountLayoutId="pb-account-pill"
        figureLayoutId="pb-hero-figure"
      />

      <div className="flex items-center justify-between">
        <p className="font-sans text-[13px] font-bold" style={{ color: pb.textPrimary }}>
          Financial Overview
        </p>
        <span className="font-sans text-[11px] font-semibold" style={{ color: pb.blue }}>
          View insights &rarr;
        </span>
      </div>

      <div
        className="flex items-center justify-between rounded-lg border px-3 py-2.5"
        style={{ borderColor: pb.border, backgroundColor: pb.surface }}
      >
        <div className="flex items-center gap-2">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full"
            style={{ backgroundColor: pb.negativeSoft, color: pb.negative }}
          >
            <Wallet size={13} />
          </span>
          <div>
            <p className="font-sans text-[11px]" style={{ color: pb.textTertiary }}>
              last 24h Spent
            </p>
            <p className="font-sans text-sm font-bold tabular-nums" style={{ color: pb.negative }}>
              <CountUpNumber value={weeklyStats.last24hSpent + newSpend} hasActivated={false} /> EGP
            </p>
          </div>
        </div>
        <ChevronRight size={14} color={pb.textTertiary} />
      </div>

      <div className="flex gap-2.5">
        <StatBox
          icon={<ArrowUpRight size={11} />}
          iconColor={pb.negative}
          iconBg={pb.negativeSoft}
          label="Current week spent"
          value={`${(weeklyStats.currentWeekSpent + newSpend).toLocaleString("en-US")} EGP`}
          valueColor={pb.negative}
        />
        <StatBox
          icon={<ArrowDownRight size={11} />}
          iconColor={pb.positive}
          iconBg={pb.positiveSoft}
          label="Current week received"
          value={`${weeklyStats.currentWeekReceived.toLocaleString("en-US")} EGP`}
          valueColor={pb.positive}
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <p className="font-sans text-[12px] font-bold" style={{ color: pb.textPrimary }}>
            Weekly progress
          </p>
          <p className="font-sans text-[11px] tabular-nums" style={{ color: pb.textTertiary }}>
            {weeklyStats.weekDaysElapsed} / {weeklyStats.weekDaysTotal} days
          </p>
        </div>
        <div className="mt-1.5">
          <ProgressBar percent={weekPercent} color={pb.blue} hasActivated={hasActivated} />
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between">
          <p className="font-sans text-[13px] font-bold" style={{ color: pb.textPrimary }}>
            Recent transactions
          </p>
          <span className="flex items-center gap-1 font-sans text-[11px] font-semibold" style={{ color: pb.blue }}>
            <Calendar size={11} /> Show all &rarr;
          </span>
        </div>

        <div
          className="mt-2 flex items-center gap-2 rounded-full border px-3 py-2"
          style={{ borderColor: pb.border, backgroundColor: pb.surface }}
        >
          <Search size={13} color={pb.textTertiary} />
          <span className="flex-1 font-sans text-[11px]" style={{ color: pb.textTertiary }}>
            Search transactions
          </span>
          <span className="flex h-6 w-6 items-center justify-center rounded-full" style={{ backgroundColor: pb.blueSoft, color: pb.blue }}>
            <Sparkles size={12} />
          </span>
        </div>

        <div className="mt-1">
          <AnimatePresence initial={false} mode="popLayout">
            {rows.map(({ isNew, ...transaction }, index) => (
              <motion.div
                key={transaction.id}
                layout
                initial={{ opacity: 0, x: -24, backgroundColor: "rgba(59,130,246,0.18)" }}
                animate={{ opacity: 1, x: 0, backgroundColor: "rgba(59,130,246,0)" }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], backgroundColor: { duration: 1.6 } }}
                className="rounded-lg"
              >
                <TransactionRow
                  {...transaction}
                  playIntro={hasActivated && !isNew}
                  delay={0.15 + index * 0.08}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
