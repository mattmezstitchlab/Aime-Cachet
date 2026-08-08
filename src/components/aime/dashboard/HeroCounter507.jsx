import React from "react";
import { TrendingUp, AlertCircle } from "lucide-react";
import ExplainTip from "./ExplainTip";

// Compteur 507h principal — avec PRA dynamique et indication d'allongement
export default function HeroCounter507({ data }) {
  const { totalHours, nhRequired, percent, missingHours, extended, extensions, period, achieved } = data;
  const extensionDays = extensions * 30;

  return (
    <div className="bg-aime-black text-white rounded-3xl p-5 sm:p-8 md:p-10 relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] tracking-[0.3em] text-zinc-400 font-semibold uppercase">Période de référence</span>
          <ExplainTip title="PRA — Période de Référence">
            La période de référence est de 365 jours en standard. Si vous n'atteignez pas 507h, elle s'allonge automatiquement par paliers de +30 jours (et +42h requises) jusqu'à trouver vos heures.
          </ExplainTip>
        </div>
        <div className="text-sm text-zinc-300 mb-6">{period.label} <span className="text-zinc-500">· {period.days} jours</span></div>

        <div className="flex items-end gap-6 flex-wrap mb-6">
          <div>
            <div className="font-display text-6xl sm:text-7xl md:text-8xl leading-none tabular-nums break-words">
              {Math.round(totalHours)}
              <span className="text-3xl text-zinc-500 ml-2">h</span>
            </div>
            <div className="text-[11px] text-zinc-400 mt-2 tracking-wider uppercase">
              sur {nhRequired}h requises
            </div>
          </div>

          <div className="flex-1 min-w-0 sm:min-w-[240px] w-full">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-xs text-zinc-400">Progression</span>
              <span className="text-2xl font-display text-white tabular-nums">{percent}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className={`h-full transition-all duration-700 ${achieved ? "bg-emerald-400" : "bg-aime-red"}`}
                style={{ width: `${Math.min(100, percent)}%` }}
              />
            </div>
            {missingHours > 0 ? (
              <div className="mt-3 inline-flex items-center gap-2 text-[12px] text-zinc-300">
                <AlertCircle className="w-3.5 h-3.5 text-aime-red" />
                Il vous manque <strong className="text-white">{Math.round(missingHours)}h</strong>
              </div>
            ) : (
              <div className="mt-3 inline-flex items-center gap-2 text-[12px] text-emerald-300">
                <TrendingUp className="w-3.5 h-3.5" />
                Seuil atteint
              </div>
            )}
          </div>
        </div>

        {extended && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-2.5 inline-flex items-center gap-2 text-[12px]">
            <span className="text-amber-300">⚠</span>
            <span className="text-amber-100">
              Période allongée de <strong>{extensionDays}j</strong> (objectif rehaussé à {nhRequired}h)
            </span>
            <ExplainTip title="Allongement PRA">
              Quand vous n'atteignez pas 507h sur 365j, France Travail étend automatiquement la période par paliers de +30 jours, en rehaussant à chaque fois l'objectif de +42h.
            </ExplainTip>
          </div>
        )}
      </div>
    </div>
  );
}