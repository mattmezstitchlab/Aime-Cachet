import React from "react";
import { ChevronDown } from "lucide-react";
import { densityHeat } from "@/lib/timelineScale";

const HEAT_DOT = {
  none: "bg-zinc-300",
  low: "bg-zinc-400",
  mid: "bg-amber-400",
  high: "bg-orange-500",
  blaze: "bg-aime-red animate-pulse",
};

// Header propre d'un groupe timeline.
// Chip date plate à gauche + pastille de chaleur + compteur fiches + chevron.
export default function TimelineGroupHeader({ label, count, isCurrent, isExpanded, onClick, disabled }) {
  const heat = densityHeat(count);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2.5 mb-3 pl-20 sm:pl-24 group ${disabled ? "cursor-default" : "cursor-pointer"}`}
    >
      {/* Pastille de chaleur */}
      <span className={`w-1.5 h-1.5 rounded-full ${HEAT_DOT[heat]}`} aria-hidden />

      {/* Label date */}
      <span className="text-[11px] tracking-[0.2em] font-semibold text-zinc-700 uppercase group-hover:text-zinc-900 transition-colors">
        {label}
      </span>

      {/* Aujourd'hui */}
      {isCurrent && (
        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-aime-red uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-aime-red animate-pulse" />
          Aujourd'hui
        </span>
      )}

      {/* Compteur */}
      {count > 0 && (
        <span className="inline-flex items-center gap-1 text-[10px] text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full font-medium tabular-nums">
          {count}
          <span className="text-zinc-400">fiche{count > 1 ? "s" : ""}</span>
        </span>
      )}

      {/* Chevron */}
      {!disabled && (
        <ChevronDown className={`w-3 h-3 text-zinc-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
      )}
    </button>
  );
}