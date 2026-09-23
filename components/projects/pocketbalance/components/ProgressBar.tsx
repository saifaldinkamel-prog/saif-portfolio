"use client";

import { motion } from "motion/react";
import { duration, ease } from "@/components/shared/motion";
import { pb } from "../pbTheme";

export function ProgressBar({
  percent,
  color = pb.blue,
  hasActivated,
  track = "rgba(255,255,255,0.08)",
  delay = 0,
}: {
  percent: number;
  color?: string;
  hasActivated: boolean;
  track?: string;
  delay?: number;
}) {
  return (
    <div className="h-1.5 overflow-hidden rounded-full" style={{ backgroundColor: track }}>
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={hasActivated ? { width: "0%" } : false}
        animate={{ width: `${Math.min(100, percent)}%` }}
        transition={{ duration: duration.scene, ease: ease.in, delay: hasActivated ? delay : 0 }}
      />
    </div>
  );
}
