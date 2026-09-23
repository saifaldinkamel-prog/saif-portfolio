import type { Metadata } from "next";
import { StageShell } from "@/components/stage/StageShell";
import { FloatingNav } from "@/components/nav/FloatingNav";
import { PocketBalanceCaseStudyScene } from "@/components/scenes/Projects/PocketBalanceCaseStudyScene";

export const metadata: Metadata = {
  title: "PocketBalance — Saif.dev",
  description: "A personal finance app I designed, built, and shipped.",
};

export default function PocketBalanceCaseStudyPage() {
  return (
    <StageShell>
      <FloatingNav />
      <PocketBalanceCaseStudyScene />
    </StageShell>
  );
}
