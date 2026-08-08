import React from "react";
import { formatDateFR } from "@/lib/aimeData";
import StampGraphic from "@/components/aime/fiche/StampGraphic";

export default function NoteHonorairesPaper({ prestation, cachetCode, stamp, stampPosition, theme = "light", textEditable, paperRef, onStampClickArea }) {
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
      <div className={`flex items-start justify-between border-b-2 border-aime-red pb-5 mb-8`}>
        <div>
          <div className="font-display text-4xl leading-none" {...ce}>NOTE D'HONORAIRES</div>
          <div className={`text-xs mt-2 ${muted}`}>Artiste-auteur · Régime MdA / Urssaf Limousin</div>
          <div className="text-sm font-mono mt-2 opacity-70">{cachetCode}</div>
        </div>
        <div className="text-right">
          <div className={`text-[9px] uppercase tracking-wider ${muted}`}>Émise le</div>
          <div className="text-sm font-medium mt-1" {...ce}>{d ? `${d.day} ${d.month} ${d.year}` : "—"}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-12 mb-10">
        <div>
          <div className={`text-[9px] uppercase tracking-wider mb-2 ${muted}`}>Artiste-auteur</div>
          <div className="text-sm" {...ce}>Votre nom</div>
          <div className={`text-xs ${muted} mt-1`} {...ce}>N° Sécurité sociale artistes-auteurs</div>
          <div className={`text-xs ${muted}`} {...ce}>SIRET (si applicable)</div>
        </div>
        <div>
          <div className={`text-[9px] uppercase tracking-wider mb-2 ${muted}`}>Diffuseur / Client</div>
          <div className="text-sm font-medium" {...ce}>{prestation?.employer || "Diffuseur"}</div>
          <div className={`text-xs ${muted} mt-1`} {...ce}>{prestation?.employer_contact || ""}</div>
          <div className={`text-xs ${muted}`} {...ce}>SIRET : {prestation?.employer_siret || "—"}</div>
        </div>
      </div>

      <div className={`p-5 border ${border} rounded mb-8`}>
        <div className="text-sm font-bold mb-3" {...ce}>Objet : {prestation?.nature || "Cession de droits / Prestation"}</div>
        <div className={`text-xs ${muted} mb-4`} {...ce}>Lieu : {prestation?.location || "—"} · Date : {d ? `${d.day} ${d.month} ${d.year}` : "—"}</div>
        <div className="flex justify-between items-center pt-3 border-t border-dashed border-zinc-300">
          <span className="text-sm">Montant des honoraires (HT)</span>
          <span className="text-lg font-bold" {...ce}>{amount} €</span>
        </div>
      </div>

      <div className="mb-8 space-y-3">
        <div className={`text-[9px] uppercase tracking-wider ${muted}`}>Précompte social (à titre indicatif)</div>
        <div className={`text-xs leading-relaxed ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
          Cotisations précomptées par le diffuseur conformément aux articles L.382-1 et suivants du Code de la sécurité sociale. Le diffuseur s'engage à reverser les cotisations à l'Urssaf Limousin.
        </div>
      </div>

      <div className={`p-3 border ${border} ${isDark ? "bg-zinc-800/50" : "bg-zinc-50"} text-[9px] ${muted} leading-relaxed`}>
        <div className={`font-bold mb-1 ${isDark ? "text-white" : "text-zinc-900"}`}>Mentions légales</div>
        Document préparatoire privé édité via AIME. TVA non applicable, art. 293 B du CGI (sauf option). AIME n'est ni mandaté ni affilié à la MdA, l'Urssaf Limousin ou tout autre organisme. L'émetteur est seul responsable du respect de ses obligations sociales et fiscales.
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