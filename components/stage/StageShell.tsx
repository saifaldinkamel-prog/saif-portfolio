import type { ReactNode } from "react";
import { ScrollProgressProvider } from "./ScrollProgress";
import { SceneGlowProvider } from "./SceneGlow";
import { GlowField } from "./GlowField";
import { GrainLayer } from "./GrainLayer";
import { CursorLight } from "@/components/fx/CursorLight";

/**
 * The persistent dark stage every scene mounts onto: a fixed backdrop
 * (void color + interpolated glow + grain) behind normally-scrolling
 * page content. Mount once at the app root.
 */
export function StageShell({ children }: { children: ReactNode }) {
  return (
    <ScrollProgressProvider>
      <SceneGlowProvider>
        <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden bg-stage-void">
          <GlowField />
          <CursorLight />
          <GrainLayer />
        </div>
        <div className="relative">{children}</div>
      </SceneGlowProvider>
    </ScrollProgressProvider>
  );
}
