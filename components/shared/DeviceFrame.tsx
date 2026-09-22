import type { ReactNode } from "react";

/**
 * Shared phone bezel. Used by the PocketBalance scene now, and by the
 * Hero's phone teaser later (Phase 2) — kept free of any PocketBalance
 * or scene-specific knowledge so both can reuse it as-is.
 */
export function DeviceFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative aspect-[9/19.5] w-full max-w-[320px] rounded-[2.5rem] border border-border-hairline bg-stage-deep p-3 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.85)]">
      <div
        aria-hidden
        className="absolute left-1/2 top-3 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-stage-void"
      />
      <div className="relative h-full w-full overflow-hidden rounded-[1.75rem] bg-stage-screen">
        {children}
      </div>
    </div>
  );
}
