import React from "react";

/**
 * Écran digital compact — chiffres machine.
 * Affiche stats clés : 507h, fiches, validées, en cours, à resceller, mois actif.
 */
export default function MachineStats({ simulator, counters, prestations = [], compact = false }) {
  const hoursTotal = simulator?.total ?? 0;
  const objective = simulator?.objective ?? 507;
  const inProgress =
    (counters?.brouillons || 0) + (counters?.aCompleter || 0) + (counters?.pretsAVerifier || 0);
  const toReseal = prestations.filter((p) => !p.verification_hash && p.status === "valide").length;
  const month = new Date().toLocaleDateString("fr-FR", { month: "short" }).toUpperCase().replace(".", "");

  const cellsToShow = [
    { label: "HEURES", value: Math.round(hoursTotal), accent: true },
    { label: "À TRAITER", value: inProgress + toReseal },
    { label: "MOIS", value: month },
  ];

  return (
    <div className="rounded-2xl bg-zinc-900 border border-white/5 shadow-[10px_10px_22px_rgba(10,13,15,0.5),-8px_-8px_18px_rgba(72,80,84,0.12)] p-2">
      <div className="grid grid-cols-3 gap-1">
        {cellsToShow.map((c) => (
          <div
            key={c.label}
            className="bg-zinc-900 border border-white/5 rounded-xl min-h-[50px] px-2 py-2 text-center flex flex-col items-center justify-center shadow-[inset_4px_4px_9px_rgba(10,13,15,0.56),inset_-3px_-3px_7px_rgba(72,80,84,0.12)]"
          >
            <div className="text-[8px] tracking-[0.18em] text-zinc-500 font-semibold leading-tight mb-1 text-center">
              {c.label}
            </div>
            <div
              className={`font-mono font-bold leading-none tabular-nums ${
                c.accent ? "text-aime-red" : "text-zinc-100"
              } ${compact ? "text-sm" : "text-base"}`}
              style={{ textShadow: c.accent ? "0 0 8px rgba(255,0,0,0.5)" : "none" }}
            >
              {c.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}