import type { ReactNode } from "react";
import { pb } from "../pbTheme";

export function StatBox({
  icon,
  iconColor,
  iconBg,
  label,
  value,
  valueColor = pb.textPrimary,
}: {
  icon: ReactNode;
  iconColor: string;
  iconBg: string;
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div
      className="flex-1 rounded-lg border px-3 py-2.5"
      style={{ borderColor: pb.border, backgroundColor: pb.surface }}
    >
      <div className="flex items-center gap-1.5">
        <span
          className="flex h-5 w-5 items-center justify-center rounded-full"
          style={{ backgroundColor: iconBg, color: iconColor }}
        >
          {icon}
        </span>
        <span className="font-sans text-[10px] font-medium uppercase tracking-wide" style={{ color: pb.textTertiary }}>
          {label}
        </span>
      </div>
      <p className="mt-1.5 font-sans text-base font-bold tabular-nums" style={{ color: valueColor }}>
        {value}
      </p>
    </div>
  );
}
