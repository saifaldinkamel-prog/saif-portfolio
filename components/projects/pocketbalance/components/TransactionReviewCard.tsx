"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion, useAnimationControls } from "motion/react";
import { ArrowUp, ArrowUpRight, ChevronDown, Sparkles, X } from "lucide-react";
import { pb } from "../pbTheme";
import type { ReviewTransaction, reviewCategories as ReviewCategories } from "../data/review";

const SHEET = "#162033";
const FIELD = "#1C2940";
const ADD_TEAL = "#0F766E";
const SAVE_BLUE = "#2563EB";
const EASE = [0.16, 1, 0.3, 1] as const;

export interface ReviewResult {
  category: string;
  remember: boolean;
}

type Step = "pick" | "ask" | "learned";

/**
 * The real app's "categorize this transaction" popup, working end to
 * end: pick (or create) a category and Save. For a store purchase the
 * app then offers to remember that choice for the merchant — and
 * explains what that means if you say yes. Later, ×, or dragging the
 * popup down all leave the transaction for later.
 */
export function TransactionReviewCard({
  transaction,
  categories,
  onDone,
  onLater,
  offerLearning = true,
}: {
  transaction: ReviewTransaction;
  categories: typeof ReviewCategories;
  onDone: (result: ReviewResult) => void;
  onLater: () => void;
  /** Off for bank transfers: their SMS names no store, so there's nothing to learn. */
  offerLearning?: boolean;
}) {
  const [step, setStep] = useState<Step>("pick");
  const [chips, setChips] = useState<string[]>(() => categories.map((c) => c.name));
  const [selected, setSelected] = useState<string | null>(null);
  const [custom, setCustom] = useState("");
  const [note, setNote] = useState("");
  const chipRow = useAnimationControls();

  function addCustom(event: FormEvent) {
    event.preventDefault();
    const name = custom.trim();
    if (!name) return;
    setChips((prev) => (prev.includes(name) ? prev : [name, ...prev]));
    setSelected(name);
    setCustom("");
  }

  function save() {
    if (!selected) {
      chipRow.start({ x: [0, -8, 8, -5, 5, 0], transition: { duration: 0.4 } });
      return;
    }
    if (offerLearning) setStep("ask");
    else onDone({ category: selected, remember: false });
  }

  const isTransfer = transaction.kind === "transfer";

  return (
    <motion.div
      layout
      drag={step === "pick" ? "y" : false}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0, bottom: 0.6 }}
      onDragEnd={(_, info) => {
        if (info.offset.y > 90 || info.velocity.y > 500) onLater();
      }}
      transition={{ layout: { duration: 0.35, ease: EASE } }}
      className="relative overflow-hidden rounded-[1.6rem] border px-4 pb-4 pt-2.5"
      style={{ backgroundColor: SHEET, borderColor: pb.border, boxShadow: "0 20px 40px rgba(0,0,0,0.45)" }}
    >
      <div className="mx-auto h-1 w-9 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.25)" }} />

      <AnimatePresence mode="popLayout" initial={false}>
        {step === "pick" && (
          <motion.div
            key="pick"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            <button
              type="button"
              onClick={onLater}
              aria-label="Close"
              className="absolute right-3.5 top-3.5 p-1"
              style={{ color: pb.textSecondary }}
            >
              <X size={14} />
            </button>

            <div className="mt-3 flex items-center gap-2.5">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ backgroundColor: "rgba(127,29,29,0.45)", color: pb.textPrimary }}
              >
                {isTransfer ? <ArrowUpRight size={15} /> : <ArrowUp size={15} />}
              </span>
              <span className="font-sans text-[15px] font-bold" style={{ color: pb.textPrimary }}>
                {isTransfer ? "InstaPay transfer" : "Purchase"}
              </span>
            </div>

            <p className="mt-2.5 font-sans text-[26px] font-extrabold leading-none tabular-nums" style={{ color: pb.textPrimary }}>
              {transaction.amount.toLocaleString("en-US")} EGP
            </p>

            <div className="mt-3 flex flex-col gap-1.5 rounded-xl border px-3 py-2.5" style={{ borderColor: pb.border, backgroundColor: FIELD }}>
              <InfoRow label="Account" value={transaction.account} />
              <InfoRow label="Date" value={transaction.date} />
              <InfoRow label="Merchant / recipient" value={transaction.merchant} />
            </div>

            <p className="mt-2 flex items-center gap-0.5 font-sans text-[10.5px] font-semibold" style={{ color: pb.blue }}>
              Message details <ChevronDown size={11} />
            </p>

            <p className="mt-2.5 font-sans text-[12px] font-bold" style={{ color: pb.textPrimary }}>
              Choose category
            </p>
            <motion.div
              animate={chipRow}
              className="mt-1.5 flex gap-1.5 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {chips.map((chip) => {
                const active = selected === chip;
                return (
                  <motion.button
                    key={chip}
                    type="button"
                    layout
                    onClick={() => setSelected(active ? null : chip)}
                    whileTap={{ scale: 0.92 }}
                    className="shrink-0 rounded-full border px-2.5 py-1.5 font-sans text-[10.5px] font-semibold"
                    style={{
                      backgroundColor: active ? "rgba(37,99,235,0.22)" : FIELD,
                      borderColor: active ? SAVE_BLUE : "transparent",
                      color: active ? "#BFDBFE" : pb.textPrimary,
                    }}
                  >
                    {chip}
                  </motion.button>
                );
              })}
            </motion.div>

            <form onSubmit={addCustom} className="mt-2 flex gap-1.5">
              <input
                value={custom}
                onChange={(event) => setCustom(event.target.value)}
                placeholder="Create custom category"
                maxLength={20}
                className="min-w-0 flex-1 rounded-lg border bg-transparent px-2.5 py-1.5 font-sans text-[10.5px] outline-none placeholder:text-[#64748B] focus:border-[#3B82F6]"
                style={{ borderColor: "rgba(255,255,255,0.14)", color: pb.textPrimary }}
              />
              <button
                type="submit"
                className="rounded-lg px-3 font-sans text-[10.5px] font-bold"
                style={{ backgroundColor: ADD_TEAL, color: pb.textPrimary }}
              >
                Add
              </button>
            </form>

            <input
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Optional note"
              maxLength={40}
              className="mt-1.5 w-full rounded-lg border bg-transparent px-2.5 py-1.5 font-sans text-[10.5px] outline-none placeholder:text-[#64748B] focus:border-[#3B82F6]"
              style={{ borderColor: "rgba(255,255,255,0.14)", color: pb.textPrimary }}
            />

            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={onLater}
                className="flex-1 rounded-lg border py-2 font-sans text-[11px] font-bold"
                style={{ borderColor: "rgba(255,255,255,0.7)", color: pb.textPrimary }}
              >
                Later
              </button>
              <motion.button
                type="button"
                onClick={save}
                whileTap={{ scale: 0.96 }}
                className="flex-1 rounded-lg py-2 font-sans text-[11px] font-bold"
                style={{ backgroundColor: SAVE_BLUE, color: "#FFFFFF" }}
              >
                Save
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === "ask" && selected && (
          <motion.div
            key="ask"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="pb-1 pt-4 text-center"
          >
            <span
              className="mx-auto flex h-11 w-11 items-center justify-center rounded-full"
              style={{ backgroundColor: pb.blueSoft, color: pb.blue }}
            >
              <Sparkles size={19} />
            </span>
            <p className="mt-3 font-sans text-[15px] font-bold" style={{ color: pb.textPrimary }}>
              Remember this for next time?
            </p>
            <p className="mt-1.5 font-sans text-[12px] leading-relaxed" style={{ color: pb.textSecondary }}>
              Auto-categorize <Strong>{transaction.merchant}</Strong> as <Strong>{selected}</Strong> from now on?
            </p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => onDone({ category: selected, remember: false })}
                className="flex-1 rounded-lg border py-2 font-sans text-[11px] font-bold"
                style={{ borderColor: "rgba(255,255,255,0.3)", color: pb.textPrimary }}
              >
                Not now
              </button>
              <motion.button
                type="button"
                onClick={() => setStep("learned")}
                whileTap={{ scale: 0.96 }}
                className="flex-1 rounded-lg py-2 font-sans text-[11px] font-bold"
                style={{ backgroundColor: SAVE_BLUE, color: "#FFFFFF" }}
              >
                Yes, remember
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === "learned" && selected && (
          <motion.div
            key="learned"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="pb-1 pt-4"
          >
            <div className="flex items-center gap-2">
              <motion.span
                initial={{ scale: 0, rotate: -40 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 420, damping: 14 }}
                className="flex h-8 w-8 items-center justify-center rounded-full"
                style={{ backgroundColor: pb.positiveSoft, color: pb.positive }}
              >
                <Sparkles size={15} />
              </motion.span>
              <p className="font-sans text-[14px] font-bold" style={{ color: pb.textPrimary }}>
                Merchant learning is on
              </p>
            </div>
            <div className="mt-3 rounded-xl border px-3 py-3" style={{ borderColor: pb.border, backgroundColor: FIELD }}>
              <p className="font-sans text-[11.5px] leading-relaxed" style={{ color: pb.textSecondary }}>
                Next time a bank SMS mentions <Strong>{transaction.merchant}</Strong>, PocketBalance files it
                under <Strong>{selected}</Strong> by itself &mdash; no popup, no typing. The more you use it,
                the less it has to ask.
              </p>
            </div>
            <motion.button
              type="button"
              onClick={() => onDone({ category: selected, remember: true })}
              whileTap={{ scale: 0.96 }}
              className="mt-3 w-full rounded-lg py-2 font-sans text-[11px] font-bold"
              style={{ backgroundColor: SAVE_BLUE, color: "#FFFFFF" }}
            >
              Got it
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Strong({ children }: { children: string }) {
  return (
    <span className="font-bold" style={{ color: pb.textPrimary }}>
      {children}
    </span>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="shrink-0 font-sans text-[10.5px]" style={{ color: pb.textTertiary }}>
        {label}
      </span>
      <span className="truncate font-sans text-[10.5px] font-bold" style={{ color: pb.textPrimary }}>
        {value}
      </span>
    </div>
  );
}
