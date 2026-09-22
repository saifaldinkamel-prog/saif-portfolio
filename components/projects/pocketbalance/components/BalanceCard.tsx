import { ChevronDown } from "lucide-react";
import { pb } from "../pbTheme";
import { CountUpNumber } from "./CountUpNumber";

export function BalanceCard({
  bankInitials,
  label,
  balance,
  currency,
  dotCount,
  activeDot,
  toggleOptions,
  hasActivated,
}: {
  bankInitials: string;
  label: string;
  balance: number;
  currency: string;
  dotCount: number;
  activeDot: number;
  toggleOptions: string[];
  hasActivated: boolean;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border px-4 py-4"
      style={{
        borderColor: "rgba(167,139,250,0.35)",
        background: `linear-gradient(155deg, ${pb.violetFrom} 0%, ${pb.violetTo} 100%)`,
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full"
        style={{ background: "rgba(196,181,253,0.25)", filter: "blur(20px)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-10 -left-6 h-28 w-28 rounded-full"
        style={{ background: "rgba(139,92,246,0.25)", filter: "blur(20px)" }}
      />

      <div className="relative flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md font-sans text-[10px] font-bold"
            style={{ backgroundColor: "rgba(255,255,255,0.15)", color: pb.textPrimary }}
          >
            {bankInitials}
          </span>
          <span className="truncate font-sans text-[13px] font-semibold" style={{ color: pb.textPrimary }}>
            {label}
          </span>
        </div>
        <span
          className="flex shrink-0 items-center gap-0.5 rounded-full border px-2 py-1 font-sans text-[10px] font-semibold"
          style={{ borderColor: "rgba(255,255,255,0.3)", color: pb.textPrimary }}
        >
          SWITCH <ChevronDown size={11} />
        </span>
      </div>

      <div className="relative mt-3">
        <ToggleRow options={toggleOptions} />
      </div>

      <p className="relative mt-4 font-sans text-4xl font-extrabold tabular-nums" style={{ color: pb.textPrimary }}>
        <CountUpNumber value={balance} hasActivated={hasActivated} />{" "}
        <span className="text-2xl font-bold" style={{ color: "rgba(255,255,255,0.55)" }}>
          {currency}
        </span>
      </p>

      <div className="relative mt-4 flex justify-center gap-1.5">
        {Array.from({ length: dotCount }).map((_, index) => (
          <span
            key={index}
            className="h-1.5 rounded-full"
            style={{
              width: index === activeDot ? "16px" : "6px",
              backgroundColor: index === activeDot ? pb.textPrimary : "rgba(255,255,255,0.3)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function ToggleRow({ options }: { options: string[] }) {
  return (
    <div className="flex gap-1.5">
      {options.map((option, index) => (
        <span
          key={option}
          className="rounded-full border px-2.5 py-1 font-sans text-[11px] font-semibold"
          style={{
            borderColor: index === 0 ? "rgba(255,255,255,0.5)" : "transparent",
            backgroundColor: index === 0 ? "rgba(255,255,255,0.08)" : "transparent",
            color: index === 0 ? pb.textPrimary : "rgba(255,255,255,0.45)",
          }}
        >
          {option}
        </span>
      ))}
    </div>
  );
}
