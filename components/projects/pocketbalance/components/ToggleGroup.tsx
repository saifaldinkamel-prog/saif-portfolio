import { pb } from "../pbTheme";

export function ToggleGroup({
  options,
  active,
}: {
  options: string[];
  active: string;
}) {
  return (
    <div className="flex gap-1.5">
      {options.map((option) => {
        const isActive = option === active;
        return (
          <span
            key={option}
            className="rounded-full border px-2.5 py-1 font-sans text-[11px] font-semibold"
            style={{
              borderColor: isActive ? pb.blue : pb.border,
              backgroundColor: isActive ? pb.blueSoft : "transparent",
              color: isActive ? "#BFDBFE" : pb.textTertiary,
            }}
          >
            {option}
          </span>
        );
      })}
    </div>
  );
}
