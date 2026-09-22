/**
 * Matches the real app's transaction-review bottom sheet exactly: a
 * genuine uncategorized purchase ("lulu2", a real Egyptian hypermarket
 * chain) with its real account/date/merchant fields and the real
 * category-chip set shown on that screen.
 */
export const pendingTransaction = {
  merchant: "lulu2",
  amount: 634,
  account: "Banque Misr Debit Card •••• 6067",
  date: "9/16/2026 · 1:19 PM",
};

export const reviewCategories = [
  { name: "Food & Drinks", kind: "food" as const },
  { name: "Bills", kind: "bills" as const },
  { name: "Car", kind: "transport" as const },
  { name: "Shopping", kind: "shopping" as const },
  { name: "Transfers", kind: "other" as const },
];
