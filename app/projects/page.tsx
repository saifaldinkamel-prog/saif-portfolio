import type { Metadata } from "next";
import { StageShell } from "@/components/stage/StageShell";
import { FloatingNav } from "@/components/nav/FloatingNav";
import { ProjectsIndexScene } from "@/components/scenes/Projects/ProjectsIndexScene";

export const metadata: Metadata = {
  title: "Projects — Saif.dev",
  description: "Every project, real and running.",
};

export default function ProjectsPage() {
  return (
    <StageShell>
      <FloatingNav />
      <ProjectsIndexScene />
    </StageShell>
  );
}
