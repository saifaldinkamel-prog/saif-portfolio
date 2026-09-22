import { StageShell } from "@/components/stage/StageShell";
import { PocketBalanceScene } from "@/components/scenes/PocketBalance/PocketBalanceScene";

/**
 * Phase 1 placeholder. Verifies the PocketBalance scene end-to-end.
 * Replaced by the real page composition (Hero, Statement, ...) in
 * Phase 2 — this is scaffolding, not content.
 */
export default function Home() {
  return (
    <StageShell>
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="font-mono text-mono-label uppercase text-text-mono">Phase 1 — PocketBalance</p>
        <p className="max-w-md font-sans text-body text-text-secondary">
          Scroll to drive the phone, or swipe / tap the edges / use arrow keys to take over.
        </p>
      </main>
      <PocketBalanceScene />
    </StageShell>
  );
}
