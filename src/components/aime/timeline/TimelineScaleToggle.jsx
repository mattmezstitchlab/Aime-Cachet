import React from "react";
import { TIMELINE_SCALES } from "@/lib/timelineScale";

// Toggle d'échelle de timeline : année / mois / jour / programme.
export default function TimelineScaleToggle({ scale = "year", onChange }) {
  return (
    <div className="inline-flex items-center bg-zinc-100 rounded-full p-1">
      {TIMELINE_SCALES.map((s) => {
        const active = s.id === scale;
        return (
          <button
            key={s.id}
            onClick={() => onChange?.(s.id)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors ${
              active ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-800"
            }`}
            title={s.help}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
}