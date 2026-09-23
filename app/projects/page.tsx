import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { StageShell } from "@/components/stage/StageShell";
import { FloatingNav } from "@/components/nav/FloatingNav";
import { ProjectsIndexScene } from "@/components/scenes/Projects/ProjectsIndexScene";
import { hasProjectIndex, workHref } from "@/components/scenes/Projects/projects";

export const metadata: Metadata = {
  title: "Projects — Saif.dev",
  description: "Every project, real and running.",
};

export default function ProjectsPage() {
  if (!hasProjectIndex) redirect(workHref);

  return (
    <StageShell>
      <FloatingNav />
      <ProjectsIndexScene />
    </StageShell>
  );
}
