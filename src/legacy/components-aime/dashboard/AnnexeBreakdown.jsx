import React from "react";
import ExplainTip from "./ExplainTip";

// Répartition des heures par annexe 8 (technicien) / annexe 10 (artiste)
export default function AnnexeBreakdown({ annexe }) {
  const { hoursA8, hoursA10, ratioA8, ratioA10, majorLabel, mixed } = annexe;

  return (
    <div className="bg-white rounded-3xl ring-1 ring-zinc-100 p-6">
      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-[11px] tracking-[0.25em] text-zinc-500 font-semibold uppercase">Annexe majoritaire</h3>
        <ExplainTip title="Annexe 8 vs 10">
          <strong>Annexe 8</strong> : techniciens (régie, son, lumière…). <strong>Annexe 10</strong> : artistes (musicien, comédien…). Vos droits s'ouvrent sous l'annexe où vous avez le plus d'heures.
        </ExplainTip>
      </div>
      <div className="text-xl font-display text-zinc-900 tracking-tight mb-5">{majorLabel}</div>

      <div className="space-y-3">
        <BarRow
          label="Annexe 10 · Artiste"
          hours={hoursA10}
          ratio={ratioA10}
          color="bg-aime-red"
        />
        <BarRow
          label="Annexe 8 · Technicien"
          hours={hoursA8}
          ratio={ratioA8}
          color="bg-zinc-900"
        />
      </div>

      {mixed && (
        <div className="mt-4 bg-zinc-50 rounded-xl px-3 py-2.5 text-[11px] text-zinc-600 flex items-center gap-2">
          <span className="text-zinc-900 font-semibold">Profil mixte détecté</span>
          <ExplainTip title="Cumul annexes">
            Avec ≥250h en annexe 10 ET ≥260h en annexe 8 sur 365j, vous pouvez prétendre à une ouverture de droits sur l'annexe majoritaire en cumulant les deux.
          </ExplainTip>
        </div>
      )}
    </div>
  );
}

function BarRow({ label, hours, ratio, color }) {
  const pct = Math.round(ratio * 100);
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-[12px] text-zinc-700 font-medium">{label}</span>
        <span className="text-[11px] text-zinc-500 tabular-nums">
          <strong className="text-zinc-900">{Math.round(hours)}h</strong> · {pct}%
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-zinc-100 overflow-hidden">
        <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}