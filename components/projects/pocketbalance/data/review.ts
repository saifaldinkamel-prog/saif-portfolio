/**
 * The real app's transaction-review bottom sheet: account, date, and
 * the category-chip set are from the real screen. The merchant and
 * amount are swapped for a recognizable brand on the portfolio (the
 * captured screenshot's merchant was a local store).
 */
export const pendingTransaction = {
  merchant: "Nike",
  amount: 2450,
  account: "Banque Misr Debit Card •••• 6067",
  date: "9/16/2026 · 1:19 PM",
  shortDate: "16/09/2026 · 1:19 PM",
};

export const reviewCategories = [
  { name: "Food & Drinks", kind: "food" as const },
  { name: "Bills", kind: "bills" as const },
  { name: "Car", kind: "transport" as const },
  { name: "Shopping", kind: "shopping" as const },
  { name: "Transfers", kind: "other" as const },
];
