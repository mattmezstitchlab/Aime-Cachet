import React from "react";
import { formatDayLabel } from "@/lib/aimeData";
import SmartTimelineRow from "@/components/aime/timeline/SmartTimelineRow";
import TimelineQRButton from "@/components/aime/timeline/TimelineQRButton";

/**
 * Regroupe les fiches d'une même date sous un seul en-tête.
 * La date n'apparaît qu'une fois à gauche, les fiches s'empilent.
 */
export default function TimelineDateGroup({ date, prestations, onChanged, selectedPrestationId = null, onSelectPrestation }) {
  const day = formatDayLabel(date);
  const count = prestations.length;

  return (
    <li className="relative pl-20 sm:pl-24">
      {/* Bloc date à gauche — affiché une seule fois */}
      <div className="absolute left-0 top-3 w-16 flex flex-col items-end pr-3">
        <div className="text-zinc-900 font-semibold text-base leading-none">{day.day}</div>
        <div className="text-[10px] text-zinc-500 uppercase tracking-wider mt-1">{day.month}</div>
        {count > 1 && (
          <div className="text-[10px] text-aime-red font-semibold mt-1.5 bg-aime-red/10 px-1.5 py-0.5 rounded-full">
            {count}
          </div>
        )}
        {prestations[0] && <TimelineQRButton prestation={prestations[0]} />}
      </div>

      {/* Fiches du jour empilées */}
      <ul className="space-y-2 py-2">
        {prestations.map((p) => (
          <SmartTimelineRow
            key={p.id}
            prestation={p}
            onChanged={onChanged}
            hideDate
            selected={selectedPrestationId === p.id}
            onSelect={onSelectPrestation}
          />
        ))}
      </ul>
    </li>
  );
}