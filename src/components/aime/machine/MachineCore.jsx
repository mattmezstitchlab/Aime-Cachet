import React from "react";

/**
 * Bandeau bas "AIME CORE" + ECG live.
 * Signature visuelle de la machine.
 */
export default function MachineCore({ compact = false }) {
  return (
    <div className={`shrink-0 grid gap-2 items-center bg-[#202528] border-t border-black/25 shadow-[0_-8px_18px_rgba(10,12,14,0.35)] ${compact ? "grid-cols-[auto_1fr] px-3 py-2" : "grid-cols-[auto_1fr] px-4 py-2.5"}`}>
      <div className="flex flex-col">
        <div className="flex items-baseline gap-1">
          <span className={`text-aime-red font-bold tracking-[0.2em] ${compact ? "text-[9px]" : "text-[11px]"}`}>
            AIME
          </span>
          <span className={`text-white font-bold tracking-[0.2em] ${compact ? "text-[9px]" : "text-[11px]"}`}>
            CORE
          </span>
        </div>
        {!compact && (
          <span className="text-[7px] tracking-[0.25em] text-zinc-600 font-semibold mt-0.5">
            SYSTÈME INTERMITTENCE
          </span>
        )}
      </div>
      <svg viewBox="0 0 400 24" className={`w-full ${compact ? "h-4" : "h-6"}`} preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke="hsl(var(--aime-red))"
          strokeWidth="1"
          strokeLinejoin="round"
          strokeLinecap="round"
          points="0,12 40,12 50,12 60,6 65,18 70,3 75,21 80,12 130,12 140,9 150,15 160,12 200,12 210,5 215,19 220,12 260,12 270,8 280,16 290,12 330,12 340,6 345,18 350,3 355,21 360,12 400,12"
        >
          <animate
            attributeName="stroke-opacity"
            values="0.5;1;0.5"
            dur="2s"
            repeatCount="indefinite"
          />
        </polyline>
      </svg>
    </div>
  );
}