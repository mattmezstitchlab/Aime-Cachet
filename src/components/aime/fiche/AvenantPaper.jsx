import React from "react";
import { formatDateFR } from "@/lib/aimeData";
import StampGraphic from "@/components/aime/fiche/StampGraphic";

/**
 * Avenant — modification d'un contrat existant.
 * Document préparatoire permettant de formaliser un changement
 * de date, durée, montant ou conditions d'exécution.
 */
export default function AvenantPaper({ prestation, cachetCode, stamp, stampPosition, theme = "light", textEditable, paperRef, onStampClickArea }) {
  const isDark = theme === "dark";
  const bg = isDark ? "bg-zinc-900 text-white" : "bg-white text-zinc-900";
  const border = isDark ? "border-zinc-700" : "border-zinc-200";
  const muted = isDark ? "text-zinc-400" : "text-zinc-500";
  const rowBg = isDark ? "bg-zinc-800/30" : "bg-zinc-50";
  const ce = textEditable ? { contentEditable: true, suppressContentEditableWarning: true } : {};

  const d = prestation?.date ? formatDateFR(prestation.date) : null;
  const dateLabel = d ? `${d.day} ${d.month} ${d.year}` : "—";

  return (
    <div
      ref={paperRef}
      onClick={onStampClickArea}
      className={`relative ${bg} shadow-2xl mx-auto`}
      style={{ width: "210mm", minHeight: "297mm", padding: "20mm" }}
    >
      <div className={`flex items-start justify-between border-b-2 border-aime-red pb-5 mb-8`}>
        <div>
          <div className="font-display text-4xl leading-none" {...ce}>AVENANT</div>
          <div className={`text-[10px] uppercase tracking-wider mt-1 ${muted}`}>modification de contrat</div>
          <div className="text-sm font-mono mt-2 opacity-70">{cachetCode}</div>
        </div>
        <div className="text-right">
          <div className={`text-[9px] uppercase tracking-wider ${muted}`}>Établi le</div>
          <div className="text-sm font-medium mt-1" {...ce}>{dateLabel}</div>
        </div>
      </div>

      <div className={`p-4 mb-6 rounded ${rowBg} border ${border}`}>
        <div className={`text-[10px] uppercase tracking-[0.18em] font-bold mb-2 text-aime-red`}>Contrat initial</div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          <Field label="Référence" value={cachetCode || "—"} ce={ce} />
          <Field label="Date d'origine" value={dateLabel} ce={ce} />
          <Field label="Employeur" value={prestation?.employer || "—"} ce={ce} />
          <Field label="Salarié" value="Votre nom" ce={ce} />
          <Field label="Nature" value={prestation?.nature || "—"} ce={ce} />
          <Field label="Lieu" value={prestation?.location || "—"} ce={ce} />
        </div>
      </div>

      <div className="mb-6">
        <div className={`text-[10px] uppercase tracking-[0.18em] font-bold mb-2 text-aime-red`}>Article 1 — Objet de l'avenant</div>
        <p className="text-sm leading-relaxed" {...ce}>
          Les parties conviennent de modifier le contrat initial dans les conditions ci-après détaillées.
          Toutes les clauses du contrat initial non modifiées par le présent avenant demeurent applicables.
        </p>
      </div>

      <div className="mb-6">
        <div className={`text-[10px] uppercase tracking-[0.18em] font-bold mb-2 text-aime-red`}>Article 2 — Modifications</div>
        <div className={`border ${border} rounded overflow-hidden`}>
          <div className={`grid grid-cols-[180px_1fr_1fr] text-[10px] uppercase tracking-wider font-bold ${isDark ? "bg-zinc-800" : "bg-zinc-100"} ${muted} border-b ${border}`}>
            <div className="px-3 py-2 border-r border-inherit">Élément</div>
            <div className="px-3 py-2 border-r border-inherit">Valeur initiale</div>
            <div className="px-3 py-2">Nouvelle valeur</div>
          </div>
          {[
            { label: "Date de prestation", before: dateLabel },
            { label: "Lieu", before: prestation?.location || "—" },
            { label: "Durée (heures)", before: prestation?.duration_hours ? `${prestation.duration_hours} h` : "—" },
            { label: "Montant brut", before: prestation?.amount ? `${prestation.amount} €` : "— €" },
            { label: "Nature de la prestation", before: prestation?.nature || "—" },
          ].map((row, i) => (
            <div key={i} className={`grid grid-cols-[180px_1fr_1fr] text-[11px] border-b last:border-b-0 ${border} ${i % 2 === 0 ? rowBg : ""}`}>
              <div className={`px-3 py-2.5 border-r ${border} font-medium`}>{row.label}</div>
              <div className={`px-3 py-2.5 border-r ${border} ${muted} line-through`}>{row.before}</div>
              <div className={`px-3 py-2.5 font-semibold`} {...ce}>—</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <div className={`text-[10px] uppercase tracking-[0.18em] font-bold mb-2 text-aime-red`}>Article 3 — Motif</div>
        <p className="text-sm leading-relaxed" {...ce}>
          Motif de la modification : ____________________________________________________________
        </p>
      </div>

      <div className="mb-6">
        <div className={`text-[10px] uppercase tracking-[0.18em] font-bold mb-2 text-aime-red`}>Article 4 — Prise d'effet</div>
        <p className="text-sm leading-relaxed" {...ce}>
          Le présent avenant prend effet à compter de sa signature par les deux parties.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-12 mt-10 mb-8">
        <div>
          <div className={`text-[9px] uppercase tracking-wider mb-2 ${muted}`}>L'employeur</div>
          <div className={`border-b ${border} h-16`} />
          <div className={`text-[10px] mt-1 ${muted}`}>Cachet · Signature · « Lu et approuvé »</div>
        </div>
        <div>
          <div className={`text-[9px] uppercase tracking-wider mb-2 ${muted}`}>Le salarié</div>
          <div className={`border-b ${border} h-16`} />
          <div className={`text-[10px] mt-1 ${muted}`}>Signature · « Lu et approuvé »</div>
        </div>
      </div>

      <div className={`p-3 border ${border} ${isDark ? "bg-zinc-800/50" : "bg-zinc-50"} text-[9px] ${muted} leading-relaxed`}>
        <div className={`font-bold mb-1 ${isDark ? "text-white" : "text-zinc-900"}`}>Mentions légales</div>
        Avenant préparatoire privé édité via AIME. Document de relecture — toute modification substantielle d'un contrat de travail nécessite l'accord exprès du salarié. Pour validité juridique, faire relire par un conseil spécialisé.
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

function Field({ label, value, ce }) {
  return (
    <div>
      <div className="text-[9px] uppercase tracking-wider opacity-60">{label}</div>
      <div className="text-[12px] font-medium mt-0.5" {...ce}>{value}</div>
    </div>
  );
}