import React from "react";

export default function SimulatorBlock({ data }) {
  const { validated = 0, inProgress = 0, total = 0, objective = 507, percent = 0, periodLabel = "" } = data || {};

  return (
    <div className="flex flex-col">
      <h3 className="text-[11px] tracking-[0.25em] font-medium text-zinc-500 uppercase mb-8">Simulateur indicatif</h3>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div>
          <div className="text-[10px] tracking-[0.18em] text-zinc-500 font-medium uppercase mb-2">Validées</div>
          <div className="font-display text-4xl text-white leading-none">{validated}<span className="text-lg text-zinc-500 ml-1">h</span></div>
        </div>
        <div>
          <div className="text-[10px] tracking-[0.18em] text-zinc-500 font-medium uppercase mb-2">En cours</div>
          <div className="font-display text-4xl text-white leading-none">{inProgress}<span className="text-lg text-zinc-500 ml-1">h</span></div>
        </div>
        <div>
          <div className="text-[10px] tracking-[0.18em] text-aime-red font-medium uppercase mb-2">Total</div>
          <div className="font-display text-4xl text-aime-red leading-none">{total}<span className="text-lg text-zinc-500 ml-1">h</span></div>
        </div>
      </div>

      <div className="mb-3">
        <div className="text-[10px] tracking-[0.18em] text-zinc-500 font-medium uppercase mb-2">Période de référence (12 mois glissants)</div>
        <div className="text-sm text-zinc-300">{periodLabel}</div>
      </div>

      <div className="mt-4">
        <div className="flex items-baseline justify-between text-xs mb-2">
          <span className="text-zinc-400">Objectif {objective} h</span>
          <span className="text-zinc-300 font-medium">{percent} %</span>
        </div>
        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-aime-red rounded-full transition-all duration-500" style={{ width: `${Math.min(percent, 100)}%` }} />
        </div>
      </div>

      <p className="text-xs text-zinc-500 leading-relaxed mt-6">
        Calcul indicatif basé uniquement sur vos prestations enregistrées (statut <span className="text-white">Validé</span> ou <span className="text-white">Transmis</span> / <span className="text-white">Prêt à vérifier</span>) sur les 12 derniers mois. Les règles d'ouverture de droits dépendent de votre situation et doivent être confirmées par France Travail ou l'organisme compétent.
      </p>
    </div>
  );
}