import { Building2, ChevronDown } from "lucide-react";
import { pb } from "../pbTheme";

export function AccountSelector({ label }: { label: string }) {
  return (
    <div
      className="flex items-center gap-2 rounded-full border px-3 py-2"
      style={{ borderColor: pb.border, backgroundColor: pb.surface }}
    >
      <Building2 size={14} color={pb.blue} />
      <span className="flex-1 truncate font-sans text-[12px]" style={{ color: pb.textSecondary }}>
        Account: <span className="font-semibold" style={{ color: pb.textPrimary }}>{label}</span>
      </span>
      <ChevronDown size={14} color={pb.textTertiary} />
    </div>
  );
}
