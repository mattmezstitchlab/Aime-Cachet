import React, { useEffect, useState } from "react";
import RotatingTicker from "@/components/landing/RotatingTicker";

const COCKPIT_MESSAGES = [
  { text: "Théâtre du Rond-Point — fiche prête à vérifier", color: "#ef4444" },
  { text: "Festival Marsatac — transmis le 19 mai", color: "#3b82f6" },
  { text: "Cap 80% des 507h franchie", color: "#22c55e" },
  { text: "3 documents manquants à récupérer", color: "#facc15" },
  { text: "Cirque Plume — validé ✓", color: "#22c55e" },
];

/**
 * Mosaïque Cockpit 507h — visuel iconique :
 * - Compteur 412 / 507h en rouge
 * - Barre de progression animée
 * - Grille de carrés (5x7) qui s'allument en vague (effet "diagonal sweep")
 *
 * Utilisé sur la landing et dans le hero machine.
 */
export default function MosaicCockpit({
  hours = 412,
  total = 507,
  annexe = "8",
  role = "ARTISTE",
  rows = 5,
  cols = 7,
  compact = false,
  showTicker = true,
}) {
  const remaining = Math.max(0, total - hours);
  const pct = Math.min(100, Math.round((hours / total) * 100));
  const [tick, setTick] = useState(0);

  // Animation continue : la "vague" diagonale qui parcourt la grille
  useEffect(() => {
    const id = setInterval(() => setTick((t) => (t + 1) % (rows + cols + 6)), 180);
    return () => clearInterval(id);
  }, [rows, cols]);

  // Calcule intensité pour chaque case selon distance à la vague (diagonale)
  const intensityFor = (r, c) => {
    const wave = tick;
    const diag = r + c;
    const d = Math.abs(diag - wave);
    if (d > 3) return 0.08; // case "off"
    if (d === 0) return 1;
    if (d === 1) return 0.75;
    if (d === 2) return 0.45;
    return 0.22;
  };

  return (
    <div
      className={`bg-black text-white rounded-2xl ${
        compact ? "p-3" : "p-5 md:p-6"
      } flex flex-col gap-3 md:gap-4`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span
          className={`tracking-[0.22em] text-zinc-400 font-semibold ${
            compact ? "text-[9px]" : "text-[10px] md:text-[11px]"
          }`}
        >
          COCKPIT 507H
        </span>
        <span
          className={`tracking-[0.22em] text-aime-red font-bold ${
            compact ? "text-[9px]" : "text-[10px] md:text-[11px]"
          }`}
        >
          ANNEXE {annexe} · {role}
        </span>
      </div>

      {/* Compteur */}
      <div className="flex items-end justify-between gap-3">
        <div className="flex items-baseline gap-2">
          <span
            className={`font-display font-black text-aime-red leading-none tabular-nums ${
              compact ? "text-4xl" : "text-5xl md:text-6xl lg:text-7xl"
            }`}
          >
            {hours}
          </span>
          <span
            className={`text-zinc-500 ${
              compact ? "text-sm" : "text-base md:text-lg"
            }`}
          >
            / {total}h
          </span>
        </div>
        <div className="text-right">
          <div
            className={`tracking-[0.18em] text-zinc-500 ${
              compact ? "text-[9px]" : "text-[10px] md:text-xs"
            }`}
          >
            RESTANT
          </div>
          <div
            className={`font-bold text-white tabular-nums ${
              compact ? "text-sm" : "text-base md:text-lg"
            }`}
          >
            {remaining}h
          </div>
        </div>
      </div>

      {/* Barre progression */}
      <div className={`w-full rounded-full bg-white/[0.06] overflow-hidden ${compact ? "h-1.5" : "h-2"}`}>
        <div
          className="h-full bg-gradient-to-r from-red-600 via-aime-red to-red-400 transition-[width] duration-1000"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Ticker rappels (sous la barre) */}
      {showTicker && (
        <div className={`rounded-md bg-white/[0.04] border border-white/[0.06] px-2.5 py-1.5 ${compact ? "text-[10px]" : "text-[11px] md:text-xs"} text-zinc-200`}>
          <RotatingTicker messages={COCKPIT_MESSAGES} />
        </div>
      )}

      {/* Mosaïque animée */}
      <div
        className="grid gap-1.5 md:gap-2"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: rows * cols }).map((_, i) => {
          const r = Math.floor(i / cols);
          const c = i % cols;
          const alpha = intensityFor(r, c);
          return (
            <div
              key={i}
              className="aspect-square rounded-md transition-colors duration-300"
              style={{
                background: `rgba(255, 0, 0, ${alpha})`,
                boxShadow:
                  alpha > 0.6
                    ? `0 0 12px rgba(255, 0, 0, ${alpha * 0.6})`
                    : "none",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}