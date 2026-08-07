import React from "react";
import { formatDateFR } from "@/lib/aimeData";
import StampGraphic from "@/components/aime/fiche/StampGraphic";

export default function RecuPaper({ prestation, cachetCode, stamp, stampPosition, theme = "light", textEditable, paperRef, onStampClickArea }) {
  const isDark = theme === "dark";
  const bg = isDark ? "bg-zinc-900 text-white" : "bg-white text-zinc-900";
  const border = isDark ? "border-zinc-700" : "border-zinc-200";
  const muted = isDark ? "text-zinc-400" : "text-zinc-500";
  const ce = textEditable ? { contentEditable: true, suppressContentEditableWarning: true } : {};

  const d = prestation?.date ? formatDateFR(prestation.date) : null;
  const amount = prestation?.amount || 0;

  return (
    <div
      ref={paperRef}
      onClick={onStampClickArea}
      className={`relative ${bg} shadow-2xl mx-auto`}
      style={{ width: "210mm", minHeight: "297mm", padding: "20mm" }}
    >
      <div className={`flex items-start justify-between border-b-2 border-aime-red pb-5 mb-10`}>
        <div>
          <div className="font-display text-4xl leading-none" {...ce}>REÇU DE CACHET</div>
          <div className="text-sm font-mono mt-2 opacity-70">{cachetCode}</div>
        </div>
        <div className="text-right">
          <div className={`text-[9px] uppercase tracking-wider ${muted}`}>Émis le</div>
          <div className="text-sm font-medium mt-1" {...ce}>{d ? `${d.day} ${d.month} ${d.year}` : "—"}</div>
        </div>
      </div>

      <p className="text-sm leading-relaxed mb-8" {...ce}>
        Je soussigné(e) <span className="font-bold underline decoration-dotted">Votre nom</span>, reconnais avoir reçu
        de la part de <span className="font-bold">{prestation?.employer || "—"}</span>,
        la somme de :
      </p>

      <div className={`my-10 py-8 border-y-2 ${border} text-center`}>
        <div className={`text-[10px] uppercase tracking-wider mb-2 ${muted}`}>Montant versé</div>
        <div className="font-display text-6xl text-aime-red" {...ce}>{amount} €</div>
        <div className={`text-xs mt-3 italic ${muted}`} {...ce}>({amount > 0 ? `${amount} euros` : "—"})</div>
      </div>

      <p className="text-sm leading-relaxed mb-10" {...ce}>
        En règlement de la prestation suivante : <span className="font-medium">{prestation?.nature || "—"}</span>,
        réalisée le <span className="font-medium">{d ? `${d.day} ${d.month} ${d.year}` : "—"}</span> à <span className="font-medium">{prestation?.location || "—"}</span>.
      </p>

      <div className="grid grid-cols-2 gap-12 mt-16 mb-10">
        <div>
          <div className={`text-[9px] uppercase tracking-wider mb-2 ${muted}`}>Bénéficiaire</div>
          <div className={`border-b ${border} h-12`} />
          <div className={`text-[10px] mt-1 ${muted}`}>Signature</div>
        </div>
        <div>
          <div className={`text-[9px] uppercase tracking-wider mb-2 ${muted}`}>Payeur</div>
          <div className={`border-b ${border} h-12`} />
          <div className={`text-[10px] mt-1 ${muted}`}>Signature</div>
        </div>
      </div>

      <div className={`p-3 border ${border} ${isDark ? "bg-zinc-800/50" : "bg-zinc-50"} text-[9px] ${muted} leading-relaxed`}>
        <div className={`font-bold mb-1 ${isDark ? "text-white" : "text-zinc-900"}`}>Mentions légales</div>
        Reçu préparatoire privé édité via AIME. Ne remplace ni bulletin de salaire, ni AEM, ni quittance fiscale. Les déclarations sociales et fiscales restent à effectuer auprès des organismes compétents (GUSO, Urssaf, France Travail).
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