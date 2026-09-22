export type PocketBalanceTransactionType = "income" | "expense";

export interface PocketBalanceTransaction {
  id: string;
  merchant: string;
  category: string;
  amount: number; // EGP, always positive — sign comes from `type`
  type: PocketBalanceTransactionType;
  date: string; // ISO string
  accountId: string;
  needsCategoryReview?: boolean;
}

export interface PocketBalanceAccount {
  id: string;
  bank: string;
  label: string; // e.g. "Banque Misr •••• 6067", matches the real app's masked display
  balance: number;
  kind: "debit" | "credit";
}

export interface PocketBalanceCategory {
  name: string;
  color: string; // a var(--...) reference into styles/tokens.css
  kind: "expense" | "income";
}
