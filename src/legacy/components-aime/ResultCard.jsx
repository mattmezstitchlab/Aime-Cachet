import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { STATUS_META, formatDateFR } from "@/lib/aimeData";
import PrestationSealedBadge from "@/components/aime/PrestationSealedBadge";
import { getSealedStateSync } from "@/lib/sealedState";

/**
 * Carte résultat compacte pour /recherche et /notifications.
 * Réutilise la charte de PrestationCard mais en version dense (1 ligne).
 */
export default function ResultCard({ prestation }) {
  const d = formatDateFR(prestation.date);
  const s = STATUS_META[prestation.status];
  const sealed = getSealedStateSync(prestation);

  return (
    <Link
      to={`/fiche/${prestation.id}`}
      className="group flex items-center gap-4 bg-white border border-zinc-200 hover:border-zinc-900 hover:shadow-sm rounded-xl px-4 py-3 transition-all"
    >
      <div className="text-center shrink-0 w-12">
        <div className="font-display text-xl leading-none text-zinc-900">{d.day}</div>
        <div className="text-[9px] tracking-wider text-zinc-500 uppercase mt-0.5">{d.month}</div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-sm font-medium text-zinc-900 truncate">
            {prestation.employer || "Fiche sans employeur"}
          </h3>
          <PrestationSealedBadge state={sealed} compact />
        </div>
        <div className="flex items-center gap-2 text-[11px] text-zinc-500 mt-0.5">
          {prestation.location && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {prestation.location}
            </span>
          )}
          {prestation.cachet_code && <span className="font-mono">· {prestation.cachet_code.slice(-6)}</span>}
        </div>
      </div>

      <span className="inline-flex items-center gap-1.5 text-[11px] shrink-0">
        <span className={`w-1.5 h-1.5 rounded-full ${s?.dot || "bg-zinc-400"}`} />
        <span className="text-zinc-600">{s?.label || prestation.status}</span>
      </span>

      <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-aime-red group-hover:translate-x-0.5 transition-all shrink-0" />
    </Link>
  );
}