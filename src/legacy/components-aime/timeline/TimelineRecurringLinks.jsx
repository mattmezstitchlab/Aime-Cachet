import React from "react";
import { Link2 } from "lucide-react";

// Affiche un mini-bandeau "employeur récurrent" pour signaler les fils conducteurs.
// Affiché en tête de timeline si au moins 1 employeur a 2+ fiches.
export default function TimelineRecurringLinks({ recurring = [] }) {
  if (!recurring.length) return null;
  const top = recurring
    .sort((a, b) => b.prestations.length - a.prestations.length)
    .slice(0, 4);

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2 pl-20 sm:pl-24">
        <Link2 className="w-3 h-3 text-zinc-400" />
        <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-semibold">Employeurs récurrents</span>
      </div>
      <div className="flex flex-wrap gap-1.5 pl-20 sm:pl-24">
        {top.map((r) => (
          <span
            key={r.employerKey}
            className="inline-flex items-center gap-1.5 text-[11px] text-zinc-600 bg-white ring-1 ring-zinc-200 px-2.5 py-1 rounded-full"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-aime-red" />
            <span className="font-medium">{r.employer}</span>
            <span className="text-zinc-400 tabular-nums">× {r.prestations.length}</span>
          </span>
        ))}
      </div>
    </div>
  );
}