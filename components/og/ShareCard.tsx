import type { ReactNode } from "react";

export const OG_SIZE = { width: 1200, height: 630 };

const VOID = "#06070a";
const TEXT = "#f2f4f7";
const MUTED = "#a7afba";
const SIGNAL = "#3dd68c";

/**
 * The link-preview card (LinkedIn, WhatsApp, X…) drawn in the site's
 * own language: the dark stage, one light, and the signal-green dot.
 * Rendered by next/og, so only inline styles and flexbox apply.
 */
export function ShareCard({
  eyebrow,
  title,
  subtitle,
  badge,
  footer,
  glow = "#5748dc",
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  badge: string;
  footer: ReactNode;
  glow?: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px",
        backgroundColor: VOID,
        backgroundImage: `radial-gradient(circle at 82% 78%, ${glow}88 0%, transparent 45%), radial-gradient(circle at 12% 0%, #1a1f2688 0%, transparent 40%)`,
        color: TEXT,
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 22, letterSpacing: 6, color: MUTED, textTransform: "uppercase" }}>{eyebrow}</span>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 20,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: SIGNAL,
            border: `1px solid ${SIGNAL}55`,
            backgroundColor: `${SIGNAL}1a`,
            borderRadius: 999,
            padding: "10px 22px",
          }}
        >
          <span style={{ width: 12, height: 12, borderRadius: 999, backgroundColor: SIGNAL }} />
          {badge}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontSize: 112, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>{title}</span>
        <span style={{ marginTop: 28, fontSize: 38, color: MUTED, lineHeight: 1.3, maxWidth: 900 }}>{subtitle}</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 24, color: MUTED }}>
        <span style={{ width: 48, height: 2, backgroundColor: SIGNAL }} />
        {footer}
      </div>
    </div>
  );
}
