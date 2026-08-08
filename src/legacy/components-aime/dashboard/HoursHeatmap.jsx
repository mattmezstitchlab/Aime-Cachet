import React from "react";
import ExplainTip from "./ExplainTip";

// Heatmap mensuelle des heures sur les 12 derniers mois.
export default function HoursHeatmap({ prestations = [], today = new Date() }) {
  // Construit 12 mois
  const months = [];
  const monthNames = ["jan", "fév", "mar", "avr", "mai", "jun", "jul", "aoû", "sep", "oct", "nov", "déc"];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(today);
    d.setMonth(d.getMonth() - i);
    months.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: monthNames[d.getMonth()],
      year: d.getFullYear(),
      month: d.getMonth(),
      hours: 0,
    });
  }

  for (const p of prestations) {
    if (!p?.date) continue;
    const cachets = Number(p.cachets || 0);
    const h = cachets > 0 ? cachets * 12 : Number(p.duration_hours || 0);
    if (!h) continue;
    const d = new Date(p.date);
    const k = `${d.getFullYear()}-${d.getMonth()}`;
    const m = months.find((x) => x.key === k);
    if (m) m.hours += h;
  }

  const max = Math.max(60, ...months.map((m) => m.hours));

  return (
    <div className="bg-white rounded-3xl ring-1 ring-zinc-100 p-6">
      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-[11px] tracking-[0.25em] text-zinc-500 font-semibold uppercase">Cartographie 12 mois</h3>
        <ExplainTip title="Heatmap mensuelle">
          Visualisez où sont vos heures et vos creux. Plus la cellule est rouge, plus le mois est productif. Les trous révèlent les opportunités à combler.
        </ExplainTip>
      </div>
      <div className="text-[11px] text-zinc-500 mb-4">Identifiez vos trous et vos pics</div>

      <div className="grid grid-cols-12 gap-1.5">
        {months.map((m) => {
          const ratio = m.hours / max;
          const isEmpty = m.hours === 0;
          return (
            <div key={m.key} className="flex flex-col items-center">
              <div
                className={`w-full aspect-square rounded-md transition-all relative group ${
                  isEmpty ? "bg-zinc-100" : ""
                }`}
                style={{
                  background: isEmpty
                    ? undefined
                    : `hsl(var(--aime-red) / ${0.15 + ratio * 0.85})`,
                }}
                title={`${m.label} ${m.year} — ${Math.round(m.hours)}h`}
              >
                <span className="absolute inset-0 flex items-center justify-center text-[9px] font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  {Math.round(m.hours)}
                </span>
              </div>
              <span className="text-[9px] text-zinc-400 mt-1 uppercase tracking-wider">{m.label}</span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 mt-4 text-[10px] text-zinc-500">
        <span>Aucune heure</span>
        <div className="flex-1 h-1.5 rounded-full" style={{ background: "linear-gradient(to right, #f4f4f5, hsl(var(--aime-red)))" }} />
        <span>Pic d'activité</span>
      </div>
    </div>
  );
}