import React from "react";
import { formatDateFR } from "@/lib/aimeData";
import StampGraphic from "@/components/aime/fiche/StampGraphic";

/**
 * Note de frais — remboursement déplacements professionnels.
 * Document préparatoire récapitulant les frais engagés
 * lors d'une prestation (transport, hébergement, repas).
 */
export default function FraisPaper({ prestation, cachetCode, stamp, stampPosition, theme = "light", textEditable, paperRef, onStampClickArea }) {
  const isDark = theme === "dark";
  const bg = isDark ? "bg-zinc-900 text-white" : "bg-white text-zinc-900";
  const border = isDark ? "border-zinc-700" : "border-zinc-200";
  const muted = isDark ? "text-zinc-400" : "text-zinc-500";
  const rowBg = isDark ? "bg-zinc-800/30" : "bg-zinc-50";
  const ce = textEditable ? { contentEditable: true, suppressContentEditableWarning: true } : {};

  const d = prestation?.date ? formatDateFR(prestation.date) : null;
  const dateLabel = d ? `${d.day} ${d.month} ${d.year}` : "—";

  // Catégories de frais standards
  const categories = [
    { label: "Transport (train, avion, taxi)" },
    { label: "Carburant" },
    { label: "Péages / Parking" },
    { label: "Hébergement" },
    { label: "Repas" },
    { label: "Frais divers" },
  ];

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
          <div className="font-display text-4xl leading-none" {...ce}>NOTE DE FRAIS</div>
          <div className="text-sm font-mono mt-2 opacity-70">{cachetCode}</div>
        </div>
        <div className="text-right">
          <div className={`text-[9px] uppercase tracking-wider ${muted}`}>Établie le</div>
          <div className="text-sm font-medium mt-1" {...ce}>{dateLabel}</div>
        </div>
      </div>

      {/* Bloc bénéficiaire / mission */}
      <div className={`grid grid-cols-2 gap-6 mb-8 p-4 rounded ${rowBg} border ${border}`}>
        <div>
          <div className={`text-[9px] uppercase tracking-wider ${muted}`}>Bénéficiaire</div>
          <div className="text-sm font-semibold mt-1" {...ce}>Votre nom</div>
          <div className={`text-[11px] mt-1 ${muted}`} {...ce}>Fonction · Adresse</div>
        </div>
        <div>
          <div className={`text-[9px] uppercase tracking-wider ${muted}`}>Mission / Employeur</div>
          <div className="text-sm font-semibold mt-1" {...ce}>{prestation?.employer || "—"}</div>
          <div className={`text-[11px] mt-1 ${muted}`} {...ce}>{prestation?.location || "—"} · {prestation?.nature || "—"}</div>
        </div>
      </div>

      {/* Tableau des frais */}
      <div className={`border ${border} rounded overflow-hidden mb-6`}>
        <div className={`grid grid-cols-[80px_1fr_2fr_100px] text-[10px] uppercase tracking-wider font-bold ${isDark ? "bg-zinc-800" : "bg-zinc-100"} ${muted} border-b ${border}`}>
          <div className="px-2 py-2 border-r border-inherit">Date</div>
          <div className="px-3 py-2 border-r border-inherit">Catégorie</div>
          <div className="px-3 py-2 border-r border-inherit">Description / Justificatif</div>
          <div className="px-2 py-2 text-right">Montant TTC</div>
        </div>
        {categories.map((cat, i) => (
          <div
            key={i}
            className={`grid grid-cols-[80px_1fr_2fr_100px] text-[11px] border-b last:border-b-0 ${border} ${i % 2 === 0 ? "" : rowBg}`}
          >
            <div className={`px-2 py-3 border-r ${border} ${muted}`} {...ce}>{dateLabel}</div>
            <div className={`px-3 py-3 border-r ${border}`}>{cat.label}</div>
            <div className={`px-3 py-3 border-r ${border}`} />
            <div className="px-2 py-3 text-right font-mono">—</div>
          </div>
        ))}
        {/* Lignes vides supplémentaires */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className={`grid grid-cols-[80px_1fr_2fr_100px] text-[11px] border-b last:border-b-0 ${border} ${(categories.length + i) % 2 === 0 ? "" : rowBg}`}
          >
            <div className={`px-2 py-3 border-r ${border}`} />
            <div className={`px-3 py-3 border-r ${border}`} />
            <div className={`px-3 py-3 border-r ${border}`} />
            <div className="px-2 py-3" />
          </div>
        ))}
      </div>

      {/* Total */}
      <div className={`flex justify-end mb-10`}>
        <div className={`min-w-[280px] border ${border} rounded overflow-hidden`}>
          <div className={`flex justify-between items-center px-4 py-2 ${rowBg} text-xs ${muted}`}>
            <span className="uppercase tracking-wider">Sous-total</span>
            <span className="font-mono">— €</span>
          </div>
          <div className={`flex justify-between items-center px-4 py-3 bg-aime-red text-white`}>
            <span className="text-xs uppercase tracking-wider font-bold">Total à rembourser</span>
            <span className="font-display text-xl">— €</span>
          </div>
        </div>
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-2 gap-12 mt-8 mb-8">
        <div>
          <div className={`text-[9px] uppercase tracking-wider mb-2 ${muted}`}>Bénéficiaire</div>
          <div className={`border-b ${border} h-12`} />
          <div className={`text-[10px] mt-1 ${muted}`}>Date · Signature « Certifié exact »</div>
        </div>
        <div>
          <div className={`text-[9px] uppercase tracking-wider mb-2 ${muted}`}>Validation employeur</div>
          <div className={`border-b ${border} h-12`} />
          <div className={`text-[10px] mt-1 ${muted}`}>Date · Signature · Cachet</div>
        </div>
      </div>

      {/* Mentions */}
      <div className={`p-3 border ${border} ${isDark ? "bg-zinc-800/50" : "bg-zinc-50"} text-[9px] ${muted} leading-relaxed`}>
        <div className={`font-bold mb-1 ${isDark ? "text-white" : "text-zinc-900"}`}>Mentions légales</div>
        Note de frais préparatoire privée éditée via AIME. Les justificatifs originaux (tickets, factures) doivent être joints. Document à conserver 10 ans. Ne remplace pas une fiche de paie ni les déclarations URSSAF / impôts.
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