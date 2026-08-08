import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// Bandeau compact horizontal du simulateur 507h.
// Tient en 1 seule ligne, prend ~80px de hauteur. Remplace le hero 2 colonnes.
export default function SimulatorCompact({ simulator }) {
  const s = simulator || {};
  const validated = s.validated ?? s.validated_hours ?? 0;
  const inProgress = s.inProgress ?? s.in_progress_hours ?? 0;
  const total = s.total ?? s.total_hours ?? (validated + inProgress);
  const objective = s.objective ?? s.objective_hours ?? 507;
  const pct = Math.min(100, Math.round((total / objective) * 100));

  return (
    <section className="border-b border-zinc-200 bg-white">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-5">
        <div className="flex items-center gap-6 md:gap-10 flex-wrap">
          {/* Titre */}
          <Link to="/507" className="shrink-0 group">
            <div className="flex items-center gap-1.5">
              <div className="text-[9px] tracking-[0.25em] text-zinc-500 font-semibold uppercase group-hover:text-aime-red transition-colors">Cockpit 507 h</div>
              <ArrowRight className="w-3 h-3 text-zinc-400 group-hover:text-aime-red group-hover:translate-x-0.5 transition-all" />
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">{s.periodLabel || "12 derniers mois"}</div>
          </Link>

          {/* Stats inline */}
          <div className="flex items-baseline gap-5 md:gap-7">
            <Stat label="Validées" value={validated} />
            <Stat label="En cours" value={inProgress} />
            <Stat label="Total" value={total} accent />
          </div>

          {/* Barre progression */}
          <div className="flex-1 min-w-[180px]">
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="text-[10px] text-zinc-500">Objectif {objective} h</span>
              <span className="text-[11px] text-zinc-900 font-semibold tabular-nums">{pct}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-zinc-100 overflow-hidden">
              <div className="h-full bg-aime-red transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className={`font-display text-2xl leading-none tracking-tight tabular-nums ${accent ? "text-aime-red" : "text-zinc-900"}`}>
        {value}
      </span>
      <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">{label}</span>
    </div>
  );
}