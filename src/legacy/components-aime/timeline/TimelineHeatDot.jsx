import React from "react";
import { densityHeat } from "@/lib/timelineScale";

// Halo de chaleur autour du label de jour selon densité de prestations.
const STYLES = {
  none: "",
  low: "shadow-[0_0_0_4px_rgba(82,82,91,0.06)]",
  mid: "shadow-[0_0_0_5px_rgba(245,158,11,0.18)]",
  high: "shadow-[0_0_0_6px_rgba(239,68,68,0.22)]",
  blaze: "shadow-[0_0_0_8px_rgba(239,68,68,0.35)] animate-pulse",
};

export default function TimelineHeatDot({ count = 0, children }) {
  const heat = densityHeat(count);
  return (
    <span className={`inline-flex items-center justify-center rounded-full transition-all ${STYLES[heat] || ""}`}>
      {children}
    </span>
  );
}