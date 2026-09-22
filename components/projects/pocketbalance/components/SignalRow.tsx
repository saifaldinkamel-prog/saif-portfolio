import { ShoppingBag, ShieldCheck, Info, ChevronRight, type LucideIcon } from "lucide-react";
import { pb } from "../pbTheme";

const SIGNAL_STYLE: Record<string, { icon: LucideIcon; fg: string; soft: string }> = {
  shopping: { icon: ShoppingBag, fg: "#A78BFA", soft: "rgba(167,139,250,0.16)" },
  positive: { icon: ShieldCheck, fg: pb.positive, soft: pb.positiveSoft },
  info: { icon: Info, fg: pb.blue, soft: pb.blueSoft },
};

export function SignalRow({
  kind,
  title,
  subtitle,
}: {
  kind: keyof typeof SIGNAL_STYLE;
  title: string;
  subtitle: string;
}) {
  const { icon: Icon, fg, soft } = SIGNAL_STYLE[kind];
  return (
    <div
      className="flex items-center gap-2.5 rounded-xl border px-3 py-2"
      style={{ borderColor: pb.border, backgroundColor: pb.surface }}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: soft, color: fg }}>
        <Icon size={15} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-sans text-[12px] font-semibold" style={{ color: pb.textPrimary }}>
          {title}
        </p>
        <p className="truncate font-sans text-[11px]" style={{ color: pb.textTertiary }}>
          {subtitle}
        </p>
      </div>
      <ChevronRight size={14} color={pb.textTertiary} className="shrink-0" />
    </div>
  );
}
