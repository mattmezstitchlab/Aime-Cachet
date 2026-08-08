import React from "react";
import { formatDateFR } from "@/lib/aimeData";
import StampGraphic from "@/components/aime/fiche/StampGraphic";

/**
 * Déclaration GUSO — Guichet Unique du Spectacle Occasionnel.
 * Pour employeurs occasionnels (entreprises hors secteur spectacle)
 * qui embauchent ponctuellement un artiste ou technicien.
 */
export default function GusoPaper({ prestation, cachetCode, stamp, stampPosition, theme = "light", textEditable, paperRef, onStampClickArea }) {
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
          <div className="font-display text-4xl leading-none" {...ce}>GUSO</div>
          <div className={`text-[10px] uppercase tracking-wider mt-1 ${muted}`}>Guichet Unique du Spectacle Occasionnel</div>
          <div className="text-sm font-mono mt-2 opacity-70">{cachetCode}</div>
        </div>
        <div className="text-right">
          <div className={`text-[9px] uppercase tracking-wider ${muted}`}>Représentation du</div>
          <div className="text-sm font-medium mt-1" {...ce}>{dateLabel}</div>
        </div>
      </div>

      <div className={`p-3 mb-6 border ${border} ${rowBg} text-[11px] ${muted} leading-relaxed`}>
        <span className={`font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>Employeur occasionnel : </span>
        Réservé aux structures dont l'activité principale n'est pas le spectacle vivant (associations, collectivités, entreprises). Le GUSO centralise les cotisations sociales (Urssaf, France Travail, AFDAS, CMB, Audiens, Congés Spectacles).
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className={`p-4 border ${border} rounded`}>
          <div className={`text-[10px] uppercase tracking-wider mb-2 ${muted} font-bold`}>Employeur</div>
          <div className="text-sm font-bold" {...ce}>{prestation?.employer || "—"}</div>
          <div className={`text-[11px] mt-1 ${muted}`}>{prestation?.employer_siret || "SIRET —"}</div>
          <div className={`text-[11px] mt-1 ${muted}`} {...ce}>{prestation?.employer_contact || "Contact —"}</div>
        </div>
        <div className={`p-4 border ${border} rounded`}>
          <div className={`text-[10px] uppercase tracking-wider mb-2 ${muted} font-bold`}>Salarié</div>
          <div className="text-sm font-bold" {...ce}>Votre nom</div>
          <div className={`text-[11px] mt-1 ${muted}`} {...ce}>N° SS · Né(e) le —</div>
          <div className={`text-[11px] mt-1 ${muted}`} {...ce}>Adresse —</div>
        </div>
      </div>

      <div className="mb-6">
        <div className={`text-[10px] uppercase tracking-[0.18em] font-bold mb-2 text-aime-red`}>Représentation</div>
        <div className={`grid grid-cols-2 gap-x-6 gap-y-2 p-3 rounded ${rowBg} border ${border}`}>
          <Field label="Date" value={dateLabel} ce={ce} />
          <Field label="Lieu" value={prestation?.location || "—"} ce={ce} />
          <Field label="Nature du spectacle" value={prestation?.nature || "—"} ce={ce} />
          <Field label="Qualification" value={prestation?.type || "—"} ce={ce} />
          <Field label="Heure de début" value="—" ce={ce} />
          <Field label="Durée" value={prestation?.duration_hours ? `${prestation.duration_hours} h` : "—"} ce={ce} />
        </div>
      </div>

      <div className="mb-6">
        <div className={`text-[10px] uppercase tracking-[0.18em] font-bold mb-2 text-aime-red`}>Rémunération</div>
        <div className={`border ${border} rounded overflow-hidden`}>
          <div className={`grid grid-cols-2 px-4 py-2 ${rowBg} text-xs`}>
            <span className={`uppercase tracking-wider ${muted}`}>Cachet brut</span>
            <span className="font-mono font-semibold text-right" {...ce}>{prestation?.amount ? `${prestation.amount} €` : "— €"}</span>
          </div>
          <div className={`grid grid-cols-2 px-4 py-2 text-xs border-t ${border}`}>
            <span className={`uppercase tracking-wider ${muted}`}>Cotisations salariales (estim.)</span>
            <span className="font-mono text-right">— €</span>
          </div>
          <div className={`grid grid-cols-2 px-4 py-2 text-xs border-t ${border}`}>
            <span className={`uppercase tracking-wider ${muted}`}>Cotisations patronales (estim.)</span>
            <span className="font-mono text-right">— €</span>
          </div>
          <div className={`grid grid-cols-2 px-4 py-3 bg-aime-red text-white`}>
            <span className="text-xs uppercase tracking-wider font-bold">Net à verser au salarié</span>
            <span className="font-display text-xl text-right">— €</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-12 mt-8 mb-8">
        <div>
          <div className={`text-[9px] uppercase tracking-wider mb-2 ${muted}`}>Date de la déclaration</div>
          <div className={`border-b ${border} h-10`} />
        </div>
        <div>
          <div className={`text-[9px] uppercase tracking-wider mb-2 ${muted}`}>Signature employeur</div>
          <div className={`border-b ${border} h-12`} />
        </div>
      </div>

      <div className={`p-3 border ${border} ${isDark ? "bg-zinc-800/50" : "bg-zinc-50"} text-[9px] ${muted} leading-relaxed`}>
        <div className={`font-bold mb-1 ${isDark ? "text-white" : "text-zinc-900"}`}>Mentions légales</div>
        Brouillon préparatoire privé édité via AIME. La déclaration GUSO officielle doit être effectuée sur guso.fr au plus tard dans les 15 jours suivant la fin du contrat. Ce document est un récapitulatif de relecture et ne tient pas lieu de déclaration officielle.
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