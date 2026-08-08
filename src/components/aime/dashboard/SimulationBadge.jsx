import React from "react";
import { Wand2, X } from "lucide-react";

// Badge flottant qui apparaît quand le mode simulation est actif.
export default function SimulationBadge({ active, deltaCachets, deltaFormation, onReset }) {
  if (!active) return null;
  const extraHours = deltaCachets * 12 + deltaFormation;

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-40 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="inline-flex items-center gap-2 bg-aime-red text-white rounded-full pl-3 pr-1.5 py-1.5 shadow-2xl">
        <Wand2 className="w-3.5 h-3.5 animate-pulse" />
        <span className="text-[11px] font-semibold tracking-wide uppercase">Simulation</span>
        <span className="text-[11px] text-white/80 tabular-nums">+{Math.round(extraHours)}h</span>
        <button
          onClick={onReset}
          className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          aria-label="Quitter la simulation"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}