"use client";

import { useId, type ReactNode } from "react";
import { LayoutGroup } from "motion/react";
import { DeviceFrame } from "@/components/shared/DeviceFrame";
import { DashboardScreen } from "@/components/projects/pocketbalance/screens/DashboardScreen";

/**
 * A still PocketBalance dashboard in the device frame. Namespaced in
 * its own LayoutGroup: the dashboard's shared-element layoutIds would
 * otherwise collide with the live walkthrough phone on the same page,
 * and Motion would hide one of the two.
 */
export function PocketBalanceStill({ playIntro = false }: { playIntro?: boolean }) {
  const id = useId();
  return (
    <LayoutGroup id={id}>
      <DeviceFrame>
        <DashboardScreen playIntro={playIntro} />
      </DeviceFrame>
    </LayoutGroup>
  );
}

/** A live, real-UI thumbnail per project slug (rendered components, not screenshots). */
export const projectPreviews: Record<string, ReactNode> = {
  pocketbalance: <PocketBalanceStill />,
};
