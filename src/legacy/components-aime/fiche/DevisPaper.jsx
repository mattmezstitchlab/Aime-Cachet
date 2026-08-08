import React from "react";
import { formatDateFR } from "@/lib/aimeData";
import StampGraphic from "@/components/aime/fiche/StampGraphic";

export default function DevisPaper({ prestation, cachetCode, stamp, stampPosition, theme = "light", textEditable, paperRef, onStampClickArea }) {
  const isDark = theme === "dark";
  const bg = isDark ? "bg-zinc-900 text-white" : "bg-white text-zinc-900";
  const border = isDark ? "border-zinc-700" : "border-zinc-200";
  const muted = isDark ? "text-zinc-400" : "text-zinc-500";
  const ce = textEditable ? { contentEditable: true, suppressContentEditableWarning: true } : {};

  const d = prestation?.date ? formatDateFR(prestation.date) : null;
  const amount = prestation?.amount || 0;
  const tvaApplied = false;

  return (
    <div
      ref={paperRef}
      onClick={onStampClickArea}
      className={`relative ${bg} shadow-2xl mx-auto`}
      style={{ width: "210mm", minHeight: "297mm", padding: "20mm" }}
    >
      <div className={`flex items-start justify-between border-b-2 pb-5 mb-8 ${isDark ? "border-aime-red" : "border-aime-red"}`}>
        <div>
          <div className="font-display text-5xl leading-none" {...ce}>DEVIS</div>
          <div className="text-sm font-mono mt-2 opacity-70" {...ce}>{cachetCode}</div>
        </div>
        <div className="text-right">
          <div className={`text-[9px] uppercase tracking-wider ${muted}`}>Date d'émission</div>
          <div className="text-sm font-medium mt-1" {...ce}>{d ? `${d.day} ${d.month} ${d.year}` : "—"}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-12 mb-10">
        <div>
          <div className={`text-[9px] uppercase tracking-wider mb-2 ${muted}`}>Émetteur (artiste)</div>
          <div className="text-sm" {...ce}>Votre nom</div>
          <div className={`text-xs ${muted} mt-1`} {...ce}>Adresse / SIRET / N° licence</div>
        </div>
        <div>
          <div className={`text-[9px] uppercase tracking-wider mb-2 ${muted}`}>Destinataire</div>
          <div className="text-sm font-medium" {...ce}>{prestation?.employer || "Structure"}</div>
          <div className={`text-xs ${muted} mt-1`} {...ce}>{prestation?.employer_contact || ""}</div>
          <div className={`text-xs ${muted}`} {...ce}>{prestation?.employer_email || ""}</div>
          <div className={`text-xs ${muted}`} {...ce}>SIRET : {prestation?.employer_siret || "—"}</div>
        </div>
      </div>

      <table className="w-full mb-10">
        <thead>
          <tr className={`text-[10px] uppercase tracking-wider ${muted} border-b ${border}`}>
            <th className="text-left py-2 font-medium">Prestation</th>
            <th className="text-center py-2 font-medium">Qté</th>
            <th className="text-right py-2 font-medium">PU</th>
            <th className="text-right py-2 font-medium">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr className={`border-b ${border}`}>
            <td className="py-4 text-sm" {...ce}>
              <div className="font-medium">{prestation?.nature || "Prestation artistique"}</div>
              <div className={`text-xs ${muted} mt-1`}>{prestation?.location || ""} — {prestation?.duration_hours || "—"} h</div>
            </td>
            <td className="py-4 text-center text-sm">1</td>
            <td className="py-4 text-right text-sm" {...ce}>{amount} €</td>
            <td className="py-4 text-right text-sm font-medium" {...ce}>{amount} €</td>
          </tr>
        </tbody>
      </table>

      <div className="flex justify-end mb-10">
        <div className="w-64 space-y-2">
          <div className="flex justify-between text-sm">
            <span className={muted}>Sous-total</span>
            <span {...ce}>{amount} €</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className={muted}>TVA</span>
            <span>Non applicable, art. 293 B du CGI</span>
          </div>
          <div className={`flex justify-between text-base font-bold pt-2 border-t ${border}`}>
            <span>Total</span>
            <span {...ce}>{amount} €</span>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className={`text-[9px] uppercase tracking-wider mb-2 ${muted}`}>Conditions</div>
        <div className={`text-xs leading-relaxed ${isDark ? "text-zinc-300" : "text-zinc-700"}`} {...ce}>
          Devis valable 30 jours. Acompte de 30 % à la confirmation. Solde dû à réception. Aucun escompte pour paiement anticipé.
        </div>
      </div>

      <div className={`p-3 border ${border} ${isDark ? "bg-zinc-800/50" : "bg-zinc-50"} text-[9px] ${muted} leading-relaxed`}>
        <div className={`font-bold mb-1 ${isDark ? "text-white" : "text-zinc-900"}`}>Mentions légales</div>
        Document préparatoire privé édité via AIME. Ne remplace ni contrat ni facture officielle. TVA non applicable, article 293 B du CGI (franchise en base). Émetteur seul responsable des informations.
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