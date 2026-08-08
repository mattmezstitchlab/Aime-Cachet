import React from "react";
import { Loader2 } from "lucide-react";

/**
 * Cœur d'analyse — élément central de la machine AIME.
 * Bouton circulaire rouge, halo, battement, label ANALYSE / EN LIGNE.
 */
export default function MachineHeart({ onClick, loading, disabled, size = "md" }) {
  const dims = {
    sm: { box: "w-16 h-16", icon: "w-5 h-5", label: "text-[8px]" },
    md: { box: "w-20 h-20", icon: "w-7 h-7", label: "text-[9px]" },
    lg: { box: "w-24 h-24", icon: "w-8 h-8", label: "text-[10px]" },
  }[size];

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`group relative ${dims.box} rounded-full bg-gradient-to-br from-zinc-800 via-black to-zinc-900 border border-zinc-700 hover:border-aime-red/80 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-[inset_0_2px_8px_rgba(0,0,0,0.8),0_0_20px_-5px_rgba(255,0,0,0.6)] hover:shadow-[inset_0_2px_8px_rgba(0,0,0,0.8),0_0_30px_-3px_rgba(255,0,0,0.9)]`}
        aria-label="Analyser"
      >
        {/* Halo extérieur */}
        <span className="absolute inset-0 rounded-full bg-aime-red/10 blur-md group-hover:bg-aime-red/20 transition-colors" />
        {/* Anneau intérieur */}
        <span className="absolute inset-2 rounded-full border border-aime-red/30" />
        {/* Onde battement */}
        <span className={`absolute inset-0 rounded-full border-2 border-aime-red/40 ${loading ? "" : "animate-ping"} opacity-50`} />

        {loading ? (
          <Loader2 className={`${dims.icon} text-aime-red animate-spin relative z-10`} />
        ) : (
          <HeartShape className={`${dims.icon} relative z-10`} />
        )}
      </button>
      <div className="flex flex-col items-center gap-0.5">
        <span className={`${dims.label} tracking-[0.25em] text-zinc-300 font-bold`}>ANALYSER</span>
        <div className="flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
          <span className={`${dims.label} tracking-[0.2em] text-green-400 font-semibold`}>EN LIGNE</span>
        </div>
      </div>
    </div>
  );
}

function HeartShape({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" style={{ color: "hsl(var(--aime-red))" }}>
      <path d="M12 21s-7.5-4.5-9.5-9.5C1 7 4 4 7 4c2 0 3.5 1 5 3 1.5-2 3-3 5-3 3 0 6 3 4.5 7.5C19.5 16.5 12 21 12 21z" />
    </svg>
  );
}