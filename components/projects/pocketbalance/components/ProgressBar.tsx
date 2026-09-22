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
        initial={{ width: "0%" }}
        animate={{ width: hasActivated ? `${Math.min(100, percent)}%` : "0%" }}
        transition={{ duration: duration.scene, ease: ease.in, delay }}
      />
    </div>
  );
}
