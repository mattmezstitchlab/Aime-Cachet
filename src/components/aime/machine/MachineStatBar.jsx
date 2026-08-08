import React from "react";

/**
 * Bandeau compact de stats 507 — affiché en complément de la console matrix
 * à l'accueil. Évite le doublon avec la mosaïque pleine taille.
 */
function computeMajorityAnnexe(prestations = []) {
  const counts = prestations.reduce((acc, p) => {
    if (p.annexe) acc[p.annexe] = (acc[p.annexe] || 0) + 1;
    return acc;
  }, {});
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return top ? top[0] : null;
}

export default function MachineStatBar({ simulator, counters, user, prestations = [] }) {
  const hours = Math.round(simulator?.total || 0);
  const total = simulator?.objective || 507;
  const remaining = Math.max(0, total - hours);
  const pct = Math.min(100, simulator?.percent || (total ? (hours / total) * 100 : 0));
  const annexe = user?.aime_annexe || computeMajorityAnnexe(prestations) || "—";
  const missingDocs = counters?.totalDocsManquants || 0;

  return (
    <div className="rounded-2xl border border-white/5 bg-zinc-900 px-3 py-2.5 shadow-[8px_8px_18px_rgba(10,13,15,0.5),-6px_-6px_14px_rgba(72,80,84,0.12)]">
      <div className="flex items-center justify-between gap-3 mb-1.5">
        <div className="flex items-baseline gap-1.5">
          <span className="text-[9px] tracking-[0.22em] text-zinc-500 font-semibold">507</span>
          <span className="font-display font-black text-aime-red text-lg leading-none tabular-nums">
            {hours}
          </span>
          <span className="text-zinc-500 text-[10px]">h</span>
        </div>
        <span className="text-[9px] tracking-[0.22em] text-aime-red font-bold truncate">
          ANNEXE {annexe}
        </span>
        <div className="text-right">
          <div className="text-[8px] tracking-[0.18em] text-zinc-500 leading-none">RESTANT</div>
          <div className="text-white text-xs font-bold tabular-nums leading-tight">{remaining}h</div>
        </div>
      </div>

      <div className="h-1 w-full rounded-full bg-zinc-900 overflow-hidden shadow-[inset_3px_3px_6px_rgba(10,13,15,0.6),inset_-2px_-2px_5px_rgba(72,80,84,0.12)]">
        <div
          className="h-full bg-gradient-to-r from-red-600 via-aime-red to-red-400 transition-[width] duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>

      {missingDocs > 0 && (
        <div className="mt-1.5 text-right text-[9px] tracking-wide text-aime-red font-semibold">
          {missingDocs} doc{missingDocs > 1 ? "s" : ""} manquant{missingDocs > 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}