import React from "react";
import { formatDateFR } from "@/lib/aimeData";
import StampGraphic from "@/components/aime/fiche/StampGraphic";

/**
 * Feuille de présence — émargement sur scène / plateau.
 * Document préparatoire : permet de consigner les artistes/techniciens
 * présents lors d'une représentation ou d'un service.
 */
export default function PresencePaper({ prestation, cachetCode, stamp, stampPosition, theme = "light", textEditable, paperRef, onStampClickArea }) {
  const isDark = theme === "dark";
  const bg = isDark ? "bg-zinc-900 text-white" : "bg-white text-zinc-900";
  const border = isDark ? "border-zinc-700" : "border-zinc-200";
  const muted = isDark ? "text-zinc-400" : "text-zinc-500";
  const rowBg = isDark ? "bg-zinc-800/30" : "bg-zinc-50";
  const ce = textEditable ? { contentEditable: true, suppressContentEditableWarning: true } : {};

  const d = prestation?.date ? formatDateFR(prestation.date) : null;
  const dateLabel = d ? `${d.day} ${d.month} ${d.year}` : "—";

  // Lignes vides pour émargement (8 lignes par défaut)
  const rows = Array.from({ length: 8 });

  return (
    <div
      ref={paperRef}
      onClick={onStampClickArea}
      className={`relative ${bg} shadow-2xl mx-auto`}
      style={{ width: "210mm", minHeight: "297mm", padding: "20mm" }}
    >
      {/* En-tête */}
      <div className={`flex items-start justify-between border-b-2 border-aime-red pb-5 mb-8`}>
        <div>
          <div className="font-display text-4xl leading-none" {...ce}>FEUILLE DE PRÉSENCE</div>
          <div className="text-sm font-mono mt-2 opacity-70">{cachetCode}</div>
        </div>
        <div className="text-right">
          <div className={`text-[9px] uppercase tracking-wider ${muted}`}>Date du service</div>
          <div className="text-sm font-medium mt-1" {...ce}>{dateLabel}</div>
        </div>
      </div>

      {/* Bloc production */}
      <div className={`grid grid-cols-2 gap-6 mb-8 p-4 rounded ${rowBg} border ${border}`}>
        <div>
          <div className={`text-[9px] uppercase tracking-wider ${muted}`}>Production / Employeur</div>
          <div className="text-sm font-semibold mt-1" {...ce}>{prestation?.employer || "—"}</div>
        </div>
        <div>
          <div className={`text-[9px] uppercase tracking-wider ${muted}`}>Lieu</div>
          <div className="text-sm font-semibold mt-1" {...ce}>{prestation?.location || "—"}</div>
        </div>
        <div>
          <div className={`text-[9px] uppercase tracking-wider ${muted}`}>Spectacle / Service</div>
          <div className="text-sm font-medium mt-1" {...ce}>{prestation?.nature || "—"}</div>
        </div>
        <div>
          <div className={`text-[9px] uppercase tracking-wider ${muted}`}>Horaires</div>
          <div className="text-sm font-medium mt-1" {...ce}>—</div>
        </div>
      </div>

      {/* Tableau d'émargement */}
      <div className={`border ${border} rounded overflow-hidden mb-8`}>
        <div className={`grid grid-cols-[40px_1fr_120px_100px_1fr] text-[10px] uppercase tracking-wider font-bold ${isDark ? "bg-zinc-800" : "bg-zinc-100"} ${muted} border-b ${border}`}>
          <div className="px-2 py-2 border-r border-inherit">N°</div>
          <div className="px-3 py-2 border-r border-inherit">Nom et prénom</div>
          <div className="px-2 py-2 border-r border-inherit">Fonction</div>
          <div className="px-2 py-2 border-r border-inherit">Heure</div>
          <div className="px-3 py-2">Signature</div>
        </div>
        {rows.map((_, i) => (
          <div
            key={i}
            className={`grid grid-cols-[40px_1fr_120px_100px_1fr] text-[11px] border-b last:border-b-0 ${border} ${i % 2 === 0 ? "" : rowBg}`}
          >
            <div className={`px-2 py-3 border-r ${border} ${muted}`}>{i + 1}</div>
            <div className={`px-3 py-3 border-r ${border}`} />
            <div className={`px-2 py-3 border-r ${border}`} />
            <div className={`px-2 py-3 border-r ${border}`} />
            <div className="px-3 py-3" />
          </div>
        ))}
      </div>

      {/* Responsable */}
      <div className="grid grid-cols-2 gap-12 mt-12 mb-10">
        <div>
          <div className={`text-[9px] uppercase tracking-wider mb-2 ${muted}`}>Responsable de production</div>
          <div className={`border-b ${border} h-12`} />
          <div className={`text-[10px] mt-1 ${muted}`}>Nom · Signature</div>
        </div>
        <div>
          <div className={`text-[9px] uppercase tracking-wider mb-2 ${muted}`}>Régisseur / Directeur technique</div>
          <div className={`border-b ${border} h-12`} />
          <div className={`text-[10px] mt-1 ${muted}`}>Nom · Signature</div>
        </div>
      </div>

      {/* Mentions */}
      <div className={`p-3 border ${border} ${isDark ? "bg-zinc-800/50" : "bg-zinc-50"} text-[9px] ${muted} leading-relaxed`}>
        <div className={`font-bold mb-1 ${isDark ? "text-white" : "text-zinc-900"}`}>Mentions légales</div>
        Feuille de présence préparatoire privée éditée via AIME. Ne remplace pas le registre unique du personnel ni les déclarations obligatoires (DPAE, GUSO, AEM). Document à usage interne, à conserver par l'employeur.
      </div>

      {stamp && stampPosition && (
        <div
          className="absolute pointer-events-none"
          style={{ left: `${stampPosition.x}px`, top: `${stampPosition.y}px`, transform: `translate(-50%, -50%) rotate(${stamp.rotation || -8}deg)` }}
        >
          <StampGraphic stamp={stamp} theme={theme} />
        </div>
      )}
    </div>
  );
}