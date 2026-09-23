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

/**
 * Bank messages the case study can deliver to the phone on demand.
 * Merchants and amounts are taken from the real app data in this
 * folder; the delivery itself is a clearly-labelled simulation.
 */
export const simulatedSms = [
  { id: "sms-vodafone", merchant: "Vodafone", categoryLabel: "Bills & Utilities", categoryKind: "bills" as const, amount: 300 },
  { id: "sms-talabat", merchant: "Talabat", categoryLabel: "Food & Dining", categoryKind: "food" as const, amount: 186 },
  { id: "sms-nike", merchant: "Nike", categoryLabel: "Shopping", categoryKind: "shopping" as const, amount: 2450 },
];

export type SimulatedSms = (typeof simulatedSms)[number];

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
