import type { CategoryKind } from "../pbTheme";

/**
 * Values match the real app's Home screen screenshot exactly (the
 * "screenshot 5" / updated Home variant): balance, weekly stats,
 * weekly-progress fraction. This is a literal recreation of a captured
 * app state, not a synthesized dataset.
 */
export const account = {
  bank: "Banque Misr",
  initials: "BM",
  label: "Banque Misr Credit Card •••• 1234",
};

export const balanceCard = {
  balance: 32550,
  currency: "EGP",
  accountCount: 4,
  activeAccountIndex: 0,
};

export const weeklyStats = {
  last24hSpent: 0,
  currentWeekSpent: 2850,
  currentWeekReceived: 0,
  weekDaysElapsed: 6,
  weekDaysTotal: 7,
};

export interface SimulatedSms {
  id: string;
  kind: "purchase" | "transfer";
  merchant: string;
  categoryLabel: string;
  categoryKind: CategoryKind;
  amount: number;
  /** "auto" = sorted on its own; "review" = the app had to ask; "done" = the user sorted it. */
  status: "auto" | "review" | "done";
  /** True when "auto" came from a category the user taught it (merchant learning). */
  learned?: boolean;
}

export type SmsType = "known" | "unknown" | "transfer";

/**
 * Pools the case study draws simulated bank messages from, following
 * the real app's rules:
 * - a merchant it already knows is sorted on its own;
 * - a merchant it has never seen asks once, then can be remembered;
 * - an InstaPay transfer names no merchant, so it always asks and is
 *   never learned.
 */
export const knownMerchants: { merchant: string; categoryLabel: string; categoryKind: CategoryKind; amount: number }[] = [
  { merchant: "Amazon", categoryLabel: "Shopping", categoryKind: "shopping", amount: 1250 },
  { merchant: "Talabat", categoryLabel: "Food & Dining", categoryKind: "food", amount: 186 },
  { merchant: "Uber", categoryLabel: "Transportation", categoryKind: "transport", amount: 95 },
  { merchant: "Vodafone", categoryLabel: "Bills & Utilities", categoryKind: "bills", amount: 300 },
];

export const unknownMerchants: { merchant: string; amount: number }[] = [
  { merchant: "Nike", amount: 2450 },
  { merchant: "Adidas", amount: 1899 },
  { merchant: "Zara", amount: 1350 },
  { merchant: "Starbucks", amount: 145 },
];

export const transferAmounts = [500, 1200, 250];

export const recentTransactions = [
  {
    id: "carrefour-maadi",
    merchant: "CARREFOUR MAADI",
    categoryLabel: "Shopping",
    categoryKind: "shopping" as const,
    bank: "Banque Misr",
    time: "Today, 3:24 PM",
    amount: 2850,
    type: "expense" as const,
  },
  {
    id: "talabat",
    merchant: "Talabat",
    categoryLabel: "Food & Dining",
    categoryKind: "food" as const,
    bank: "Banque Misr",
    time: "Yesterday, 8:10 PM",
    amount: 186,
    type: "expense" as const,
  },
  {
    id: "vodafone",
    merchant: "Vodafone",
    categoryLabel: "Bills & Utilities",
    categoryKind: "bills" as const,
    bank: "Banque Misr",
    time: "2 days ago",
    amount: 300,
    type: "expense" as const,
  },
];
