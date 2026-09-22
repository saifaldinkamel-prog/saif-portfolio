/**
 * Values match the real app's Categories screen screenshot exactly:
 * account, total spent + trend, and every category row (name, count,
 * amount, percent — the percentages sum to the real total, 1,160 EGP).
 */
export const categoriesAccount = "Banque Misr Debit Card •••• 6067";

export const categorySummary = {
  totalSpent: 1160,
  range: "12 Sep – 18 Sep",
  trendPercent: 12,
};

export const categoryRows = [
  { name: "Food & Dining", kind: "food" as const, transactions: 12, amount: 660, percent: 56.9 },
  { name: "Shopping", kind: "shopping" as const, transactions: 8, amount: 260, percent: 22.4 },
  { name: "Transportation", kind: "transport" as const, transactions: 5, amount: 140, percent: 12.1 },
  { name: "Bills & Utilities", kind: "bills" as const, transactions: 3, amount: 70, percent: 6.0 },
];
