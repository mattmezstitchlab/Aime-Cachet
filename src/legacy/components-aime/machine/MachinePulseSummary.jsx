import React from "react";

/** Résumé ultra-compact : l'essentiel visible, le reste reste en mémoire machine. */
export default function MachinePulseSummary({ simulator, counters, prestations = [] }) {
  const hours = Math.round(simulator?.total || 0);
  const inProgress =
    (counters?.brouillons || 0) + (counters?.aCompleter || 0) + (counters?.pretsAVerifier || 0);
  const toReseal = prestations.filter((p) => !p.verification_hash && p.status === "valide").length;
  const urgent = inProgress + toReseal;

  return (
    <div className="mx-3 mt-2 mb-2 rounded-full bg-zinc-900 border border-white/5 px-3 py-2 shadow-[7px_7px_14px_rgba(10,13,15,0.48),-5px_-5px_12px_rgba(72,80,84,0.1)] flex items-center justify-between gap-3">
      <div className="flex items-baseline gap-1.5 min-w-0">
        <span className="font-mono text-aime-red text-base font-black tabular-nums leading-none">{hours}h</span>
        <span className="text-[9px] tracking-[0.18em] text-zinc-500 font-semibold uppercase truncate">mémoire 507</span>
      </div>
      <div className="flex items-center gap-2 text-[10px] tracking-[0.14em] font-semibold uppercase shrink-0">
        <span className={urgent > 0 ? "text-aime-red" : "text-zinc-500"}>{urgent} à traiter</span>
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_7px_rgba(74,222,128,0.8)]" />
      </div>
    </div>
  );
}