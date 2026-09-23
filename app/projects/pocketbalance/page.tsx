import type { Metadata } from "next";
import { StageShell } from "@/components/stage/StageShell";
import { FloatingNav } from "@/components/nav/FloatingNav";
import { PocketBalanceCaseStudyScene } from "@/components/scenes/Projects/PocketBalanceCaseStudyScene";

const DESCRIPTION =
  "A real Android app I'm building: it reads your bank's SMS messages and turns them into a live balance and spending insights. Try the interactive replica.";

export const metadata: Metadata = {
  title: "PocketBalance — Saif.dev",
  description: DESCRIPTION,
  openGraph: {
    type: "article",
    siteName: "Saif.dev",
    title: "PocketBalance — a real Android finance app",
    description: DESCRIPTION,
  },
};

export default function PocketBalanceCaseStudyPage() {
  return (
    <StageShell>
      <FloatingNav />
      <PocketBalanceCaseStudyScene />
    </StageShell>
  );
}
