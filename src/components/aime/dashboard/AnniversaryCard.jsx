import React from "react";
import { CalendarClock, AlertTriangle } from "lucide-react";
import ExplainTip from "./ExplainTip";

export default function AnniversaryCard({ anniversary, achieved }) {
  if (!anniversary) {
    return (
      <div className="bg-white rounded-3xl ring-1 ring-zinc-100 p-6">
        <h3 className="text-[11px] tracking-[0.25em] text-zinc-500 font-semibold uppercase mb-1">Date anniversaire</h3>
        <p className="text-sm text-zinc-500 mt-3">Ajoutez une prestation pour estimer votre prochaine date anniversaire.</p>
      </div>
    );
  }

  const { label, daysRemaining, isCritical, isPast } = anniversary;
  const accent = isPast ? "text-zinc-400" : isCritical ? "text-aime-red" : "text-zinc-900";

  return (
    <div className="bg-white rounded-3xl ring-1 ring-zinc-100 p-6 relative overflow-hidden">
      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-[11px] tracking-[0.25em] text-zinc-500 font-semibold uppercase">Date anniversaire</h3>
        <ExplainTip title="Date anniversaire">
          C'est la date à laquelle France Travail réexamine vos droits. Vous devez avoir 507h sur les 12 mois précédents pour être renouvelé. Sinon, la clause de rattrapage peut prendre le relais.
        </ExplainTip>
      </div>

      <div className="flex items-end justify-between gap-4 mt-3">
        <div>
          <div className={`font-display text-3xl tracking-tight ${accent}`}>{label}</div>
          <div className="text-[11px] text-zinc-500 mt-1">
            {isPast ? "Date dépassée" : `Dans ${daysRemaining} jours`}
          </div>
        </div>
        <CalendarClock className={`w-8 h-8 ${isCritical ? "text-aime-red" : "text-zinc-300"}`} />
      </div>

      {isCritical && !achieved && (
        <div className="mt-4 bg-aime-red/5 border border-aime-red/20 rounded-xl px-3 py-2.5 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-aime-red shrink-0 mt-0.5" />
          <div>
            <div className="text-[12px] font-semibold text-aime-red">À surveiller de près</div>
            <div className="text-[11px] text-zinc-600 mt-0.5">
              Moins de 60 jours pour atteindre vos heures. Anticipez maintenant.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}