/**
 * PocketBalance's OWN visual identity, extracted from real app
 * screenshots — deliberately separate from Saif.dev's site-wide design
 * tokens (styles/tokens.css). The phone is a window into the real
 * product's own design system, not a reskin into the site's minimal
 * mint/3-weight language. Site tokens still govern everything outside
 * the phone.
 */
export const pb = {
  bg: "#0B1220",
  surface: "#111A2C",
  surfaceRaised: "#17233A",
  border: "rgba(255,255,255,0.08)",

  textPrimary: "#F8FAFC",
  textSecondary: "#94A3B8",
  textTertiary: "#64748B",

  blue: "#3B82F6",
  blueSoft: "rgba(59,130,246,0.16)",

  negative: "#FB7185", // money spent — amounts, "spent" stats
  negativeSoft: "rgba(251,113,133,0.16)",
  positive: "#34D399", // money received
  positiveSoft: "rgba(52,211,153,0.16)",

  violetFrom: "#4C1D95",
  violetTo: "#1E1B4B",

  amber: "#F59E0B",
  amberSoft: "rgba(245,158,11,0.16)",
} as const;

export type CategoryKind = "food" | "shopping" | "transport" | "bills" | "other";

export const categoryColors: Record<CategoryKind, { fg: string; soft: string }> = {
  food: { fg: "#FB7185", soft: "rgba(251,113,133,0.16)" },
  shopping: { fg: "#A78BFA", soft: "rgba(167,139,250,0.16)" },
  transport: { fg: "#60A5FA", soft: "rgba(96,165,250,0.16)" },
  bills: { fg: "#34D399", soft: "rgba(52,211,153,0.16)" },
  other: { fg: "#94A3B8", soft: "rgba(148,163,184,0.16)" },
};
