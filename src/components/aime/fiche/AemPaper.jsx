import React from "react";
import { formatDateFR } from "@/lib/aimeData";
import StampGraphic from "@/components/aime/fiche/StampGraphic";

/**
 * AEM — Attestation Employeur Mensuelle.
 * Document préparatoire à transmettre à Pôle Emploi Spectacle
 * pour chaque période d'emploi (Annexes 8 et 10).
 */
export default function AemPaper({ prestation, cachetCode, stamp, stampPosition, theme = "light", textEditable, paperRef, onStampClickArea }) {
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
          <div className="font-display text-4xl leading-none" {...ce}>AEM</div>
          <div className={`text-[10px] uppercase tracking-wider mt-1 ${muted}`}>Attestation employeur mensuelle</div>
          <div className="text-sm font-mono mt-2 opacity-70">{cachetCode}</div>
        </div>
        <div className="text-right">
          <div className={`text-[9px] uppercase tracking-wider ${muted}`}>Annexe</div>
          <div className="text-sm font-bold mt-1 text-aime-red" {...ce}>{prestation?.annexe ? `Annexe ${prestation.annexe}` : "—"}</div>
        </div>
      </div>

      <div className={`grid grid-cols-2 gap-6 mb-8 p-4 rounded ${rowBg} border ${border}`}>
        <div>
          <div className={`text-[9px] uppercase tracking-wider ${muted}`}>Employeur</div>
          <div className="text-sm font-semibold mt-1" {...ce}>{prestation?.employer || "—"}</div>
          <div className={`text-[11px] mt-1 ${muted}`}>{prestation?.employer_siret || "SIRET —"}</div>
        </div>
        <div>
          <div className={`text-[9px] uppercase tracking-wider ${muted}`}>Salarié</div>
          <div className="text-sm font-semibold mt-1" {...ce}>Votre nom</div>
          <div className={`text-[11px] mt-1 ${muted}`} {...ce}>N° SS · Né(e) le —</div>
        </div>
      </div>

      <div className={`border ${border} rounded overflow-hidden mb-8`}>
        <div className={`grid grid-cols-[100px_1fr_120px_120px_120px] text-[10px] uppercase tracking-wider font-bold ${isDark ? "bg-zinc-800" : "bg-zinc-100"} ${muted} border-b ${border}`}>
          <div className="px-2 py-2 border-r border-inherit">Date</div>
          <div className="px-3 py-2 border-r border-inherit">Nature de l'emploi</div>
          <div className="px-2 py-2 border-r border-inherit text-right">Heures</div>
          <div className="px-2 py-2 border-r border-inherit text-right">Cachets</div>
          <div className="px-2 py-2 text-right">Brut</div>
        </div>
        <div className={`grid grid-cols-[100px_1fr_120px_120px_120px] text-[11px] border-b ${border}`}>
          <div className={`px-2 py-3 border-r ${border}`} {...ce}>{dateLabel}</div>
          <div className={`px-3 py-3 border-r ${border}`} {...ce}>{prestation?.nature || "—"}</div>
          <div className={`px-2 py-3 border-r ${border} text-right font-mono`} {...ce}>{prestation?.duration_hours || "—"}</div>
          <div className={`px-2 py-3 border-r ${border} text-right font-mono`}>1</div>
          <div className={`px-2 py-3 text-right font-mono font-semibold`} {...ce}>{prestation?.amount ? `${prestation.amount} €` : "— €"}</div>
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={`grid grid-cols-[100px_1fr_120px_120px_120px] text-[11px] border-b last:border-b-0 ${border} ${i % 2 === 0 ? rowBg : ""}`}>
            <div className={`px-2 py-3 border-r ${border}`} />
            <div className={`px-3 py-3 border-r ${border}`} />
            <div className={`px-2 py-3 border-r ${border}`} />
            <div className={`px-2 py-3 border-r ${border}`} />
            <div className="px-2 py-3" />
          </div>
        ))}
      </div>

      <div className="flex justify-end mb-8">
        <div className={`min-w-[320px] border ${border} rounded overflow-hidden`}>
          <div className={`flex justify-between items-center px-4 py-2 ${rowBg} text-xs`}>
            <span className={`uppercase tracking-wider ${muted}`}>Total heures travaillées</span>
            <span className="font-mono font-semibold">{prestation?.duration_hours || "—"} h</span>
          </div>
          <div className={`flex justify-between items-center px-4 py-2 text-xs border-t ${border}`}>
            <span className={`uppercase tracking-wider ${muted}`}>Total cachets</span>
            <span className="font-mono font-semibold">1</span>
          </div>
          <div className={`flex justify-between items-center px-4 py-3 bg-aime-red text-white`}>
            <span className="text-xs uppercase tracking-wider font-bold">Total brut</span>
            <span className="font-display text-xl">{prestation?.amount ? `${prestation.amount} €` : "— €"}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-12 mt-8 mb-8">
        <div>
          <div className={`text-[9px] uppercase tracking-wider mb-2 ${muted}`}>Fait à</div>
          <div className={`border-b ${border} h-10`} />
        </div>
        <div>
          <div className={`text-[9px] uppercase tracking-wider mb-2 ${muted}`}>Signature & cachet employeur</div>
          <div className={`border-b ${border} h-12`} />
        </div>
      </div>

      <div className={`p-3 border ${border} ${isDark ? "bg-zinc-800/50" : "bg-zinc-50"} text-[9px] ${muted} leading-relaxed`}>
        <div className={`font-bold mb-1 ${isDark ? "text-white" : "text-zinc-900"}`}>Mentions légales</div>
        Brouillon préparatoire privé édité via AIME. L'AEM officielle doit être transmise par l'employeur à Pôle Emploi Spectacle via DSN ou le portail dédié. Ce document ne se substitue pas à l'AEM officielle nécessaire au calcul des droits ARE (annexes 8 & 10).
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