import React from "react";
import { TIMELINE_SCALES } from "@/lib/timelineScale";

export default function TimelineScaleToggle({ scale = "year", onChange, orientation = "horizontal" }) {
  const vertical = orientation === "vertical";

  return (
    <div className={`inline-flex ${vertical ? "flex-col rounded-[24px]" : "items-center rounded-full"} bg-zinc-100 p-1`}>
      {TIMELINE_SCALES.map((item) => {
        const active = item.id === scale;
        return (
          <button
            key={item.id}
            onClick={() => onChange?.(item.id)}
            className={`${vertical ? "min-w-[104px] px-4 py-2 text-left" : "px-3 py-1.5"} rounded-full text-[11px] font-semibold transition-colors ${active ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-800"}`}
            title={item.help}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
