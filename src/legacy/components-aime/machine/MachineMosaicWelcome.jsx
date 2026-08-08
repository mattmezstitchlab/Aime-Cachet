import React, { useEffect, useState } from "react";

/**
 * Mosaïque d'accueil compacte de la machine.
 * Affiche seulement l'essentiel, tout le contexte reste disponible en mémoire.
 */
function computeMajorityAnnexe(prestations = []) {
  const counts = prestations.reduce((acc, p) => {
    if (p.annexe) acc[p.annexe] = (acc[p.annexe] || 0) + 1;
    return acc;
  }, {});
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return top ? top[0] : null;
}

export default function MachineMosaicWelcome({
  simulator,
  counters,
  user,
  prestations = [],
  rows = 4,
  cols = 8,
}) {
  const hours = Math.round(simulator?.total || 0);
  const total = simulator?.objective || 507;
  const pct = Math.min(100, simulator?.percent || (total ? (hours / total) * 100 : 0));
  const activeCells = Math.round((pct / 100) * rows * cols);
  const annexe = user?.aime_annexe || computeMajorityAnnexe(prestations) || "—";
  const sortedRecent = [...prestations].sort(
    (a, b) => new Date(b.date || b.created_date || 0) - new Date(a.date || a.created_date || 0)
  );
  const recentIds = new Set(sortedRecent.slice(0, 6).map((p) => p.id));
  const incompleteCount = prestations.filter((p) => p.status === "a_completer" || (p.missing_documents || 0) > 0).length;
  const missingDocs = counters?.totalDocsManquants || 0;

  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => (t + 1) % (rows + cols + 6)), 200);
    return () => clearInterval(id);
  }, [rows, cols]);

  const intensityFor = (r, c) => {
    const d = Math.abs(r + c - tick);
    if (d > 3) return 0.08;
    if (d === 0) return 1;
    if (d === 1) return 0.72;
    if (d === 2) return 0.42;
    return 0.2;
  };

  return (
    <div className="rounded-2xl border border-white/5 bg-zinc-900 p-3 shadow-[10px_10px_22px_rgba(10,13,15,0.5),-8px_-8px_18px_rgba(72,80,84,0.12)]">
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="text-[9px] tracking-[0.22em] text-zinc-500 font-semibold">507</span>
        <span className="text-[9px] tracking-[0.22em] text-aime-red font-bold truncate">ANNEXE {annexe}</span>
      </div>

      <div className="flex items-end justify-between gap-3 mb-1.5">
        <div className="flex items-baseline gap-1.5">
          <span className="font-display font-black text-aime-red text-2xl leading-none tabular-nums">
            {hours}
          </span>
          <span className="text-zinc-500 text-xs">h</span>
        </div>
        <div className="text-right">
          <div className="text-[9px] tracking-[0.18em] text-zinc-500">RESTANT</div>
          <div className="text-white text-sm font-bold tabular-nums">{Math.max(0, total - hours)}h</div>
        </div>
      </div>

      <div className="h-1.5 w-full rounded-full bg-zinc-900 overflow-hidden mb-2.5 shadow-[inset_4px_4px_8px_rgba(10,13,15,0.6),inset_-3px_-3px_7px_rgba(72,80,84,0.12)]">
        <div
          className="h-full bg-gradient-to-r from-red-600 via-aime-red to-red-400 transition-[width] duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="grid gap-1 mb-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {Array.from({ length: rows * cols }).map((_, i) => {
          const r = Math.floor(i / cols);
          const c = i % cols;
          const wave = intensityFor(r, c);
          const isActive = i < activeCells;
          const isRecent = recentIds.size > 0 && i % Math.max(1, Math.floor((rows * cols) / recentIds.size)) === 0;
          const isIncompletePulse = incompleteCount > 0 && i % 9 === tick % 9;
          const alpha = Math.min(1, (isActive ? 0.24 : 0.06) + wave * 0.35 + (isRecent ? 0.18 : 0) + (isIncompletePulse ? 0.3 : 0));

          return (
            <div
              key={i}
              title={isRecent ? "Fiche récente" : isActive ? "Progression 507h" : "Activité faible"}
              className="aspect-square rounded-md transition-all duration-300"
              style={{
                background: `linear-gradient(145deg, rgba(255,0,0,${Math.max(0.04, alpha * 0.7)}), rgba(58,12,14,0.55))`,
                boxShadow: alpha > 0.55
                  ? `0 0 10px rgba(255, 0, 0, ${alpha * 0.32})`
                  : "none",
              }}
            />
          );
        })}
      </div>

      {missingDocs > 0 && (
        <div className="mt-1 text-right text-[9px] tracking-wide text-aime-red font-semibold">
          {missingDocs} doc{missingDocs > 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}