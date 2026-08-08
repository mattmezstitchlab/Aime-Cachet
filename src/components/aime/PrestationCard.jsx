import React from "react";
import { Link } from "react-router-dom";
import { MapPin, FileText, AlertTriangle } from "lucide-react";
import { STATUS_META, formatDateFR } from "@/lib/aimeData";
import PrestationSealedBadge from "@/components/aime/PrestationSealedBadge";
import { getSealedStateSync } from "@/lib/sealedState";

/** Taille des perforations du timbre */
const HOLE = 5;
const GAP = 11;

/** Style CSS "timbre dentelé" — trous radiaux sur les 4 bords */
function stampBorderStyle(bg = "#0f0f0f") {
  return {
    background: `
      radial-gradient(circle at 0 50%, transparent ${HOLE}px, ${bg} ${HOLE}px) left / ${GAP}px ${GAP}px repeat-y,
      radial-gradient(circle at 100% 50%, transparent ${HOLE}px, ${bg} ${HOLE}px) right / ${GAP}px ${GAP}px repeat-y,
      radial-gradient(circle at 50% 0, transparent ${HOLE}px, ${bg} ${HOLE}px) top / ${GAP}px ${GAP}px repeat-x,
      radial-gradient(circle at 50% 100%, transparent ${HOLE}px, ${bg} ${HOLE}px) bottom / ${GAP}px ${GAP}px repeat-x,
      ${bg}
    `,
  };
}

export default function PrestationCard({ prestation }) {
  const d = formatDateFR(prestation.date);
  const s = STATUS_META[prestation.status];
  const missing = prestation.missing_documents || 0;
  const sealed = getSealedStateSync(prestation);

  return (
    <Link
      to={`/fiche/${prestation.id}`}
      className="group block transition-transform hover:-translate-y-0.5"
      style={{ padding: "2px" }} // laisse respirer les perforations
    >
      {/* Timbre — fond sombre perforé */}
      <div
        className="rounded-sm shadow-md group-hover:shadow-xl transition-shadow"
        style={stampBorderStyle("#0f0f0f")}
      >
        {/* Zone intérieure blanche — le contenu du timbre */}
        <div className="bg-white m-[10px] rounded-sm px-4 py-3 min-w-0">
          {/* En-tête timbre : code + date */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex flex-col gap-0.5 min-w-0">
              <div className="text-[8px] tracking-[0.28em] text-zinc-400 uppercase font-semibold">
                {d.day} {d.month} {d.year}
              </div>
              <h3 className="text-zinc-900 font-display font-bold text-base leading-tight break-words">
                {prestation.employer || "Sans employeur"}
              </h3>
            </div>
            {/* Vignette rouge "affranchissement" */}
            <div className="shrink-0 ml-2 w-9 h-9 rounded-sm bg-aime-red flex items-center justify-center shadow-sm">
              <span className="text-white font-display font-black text-[10px] leading-none tracking-tight text-center">
                {d.year?.slice(-2) || "—"}
              </span>
            </div>
          </div>

          {/* Badge scellement */}
          <div className="mb-2">
            <PrestationSealedBadge state={sealed} compact />
          </div>

          {/* Métadonnées */}
          <div className="flex flex-wrap items-center gap-2 text-[10px] text-zinc-500 mb-3">
            {prestation.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5" />
                {prestation.location}
              </span>
            )}
            {prestation.type && <span>{prestation.type}</span>}
            {prestation.amount > 0 && (
              <span className="text-zinc-900 font-semibold">{prestation.amount} €</span>
            )}
          </div>

          {/* Pied de timbre : statut + code */}
          <div className="flex items-center justify-between border-t border-zinc-100 pt-2">
            <span className="inline-flex items-center gap-1.5 text-[10px]">
              <span className={`w-1.5 h-1.5 rounded-full ${s?.dot || "bg-zinc-400"}`} />
              <span className={s?.text || "text-zinc-600"}>{s?.label || prestation.status}</span>
            </span>

            {missing > 0 ? (
              <span className="inline-flex items-center gap-1 text-[10px] text-aime-red">
                <AlertTriangle className="w-2.5 h-2.5" />
                {missing} doc{missing > 1 ? "s" : ""}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] text-zinc-400 font-mono">
                <FileText className="w-2.5 h-2.5" />
                {prestation.cachet_code ? prestation.cachet_code.slice(-6) : "—"}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}