/**
 * Values match the real app's "Money Insights" screen screenshot
 * exactly — its own captured moment, independent of the Dashboard
 * screenshot's numbers (the two were captured at different times in
 * the real app, same as here).
 */
export const insightsAccount = "Banque Misr Credit ...";

export const spendSummary = {
  currentWeek: 11400,
  lastWeek: 0,
  currentRange: "9/12/2026 - 9/18/2026",
  lastRange: "9/5/2026 - 9/11/2026",
};

export const contributor = {
  categoryLabel: "Shopping",
  categoryKind: "shopping" as const,
  amount: 8550,
  percentOfSpending: 75,
};

export const quickSignals = [
  {
    id: "shopping-driver",
    kind: "shopping" as const,
    title: "Shopping drove most of the increase",
    subtitle: "+8,550 EGP more than last week",
  },
  {
    id: "no-unusual",
    kind: "positive" as const,
    title: "No unusual spending detected this week",
    subtitle: "Your spending looks normal.",
  },
  {
    id: "no-income",
    kind: "info" as const,
    title: "No income comparison available yet",
    subtitle: "Add income transactions to get insights.",
  },
];
