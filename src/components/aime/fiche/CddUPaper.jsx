import React from "react";
import { formatDateFR } from "@/lib/aimeData";
import StampGraphic from "@/components/aime/fiche/StampGraphic";

/**
 * CDD d'usage — Contrat à Durée Déterminée d'Usage.
 * Document préparatoire utilisé dans le spectacle vivant et l'audiovisuel
 * pour l'engagement ponctuel d'artistes et techniciens (articles L.1242-2 3° et D.1242-1 du Code du travail).
 */
export default function CddUPaper({ prestation, cachetCode, stamp, stampPosition, theme = "light", textEditable, paperRef, onStampClickArea }) {
  const isDark = theme === "dark";
  const bg = isDark ? "bg-zinc-900 text-white" : "bg-white text-zinc-900";
  const border = isDark ? "border-zinc-700" : "border-zinc-200";
  const muted = isDark ? "text-zinc-400" : "text-zinc-500";
  const ce = textEditable ? { contentEditable: true, suppressContentEditableWarning: true } : {};

  const d = prestation?.date ? formatDateFR(prestation.date) : null;
  const dateLabel = d ? `${d.day} ${d.month} ${d.year}` : "—";
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
          <div className="font-display text-3xl leading-none" {...ce}>CONTRAT À DURÉE DÉTERMINÉE</div>
          <div className={`text-[10px] uppercase tracking-wider mt-1 ${muted}`}>d'usage — Spectacle vivant / Audiovisuel</div>
          <div className="text-sm font-mono mt-2 opacity-70">{cachetCode}</div>
        </div>
        <div className="text-right">
          <div className={`text-[9px] uppercase tracking-wider ${muted}`}>Établi le</div>
          <div className="text-sm font-medium mt-1" {...ce}>{dateLabel}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className={`p-4 border ${border} rounded`}>
          <div className={`text-[9px] uppercase tracking-wider mb-2 ${muted}`}>Entre l'employeur</div>
          <div className="text-sm font-bold" {...ce}>{prestation?.employer || "—"}</div>
          <div className={`text-[11px] mt-1 ${muted}`}>{prestation?.employer_siret || "SIRET —"}</div>
          <div className={`text-[10px] mt-2 ${muted}`} {...ce}>Représenté par {prestation?.employer_contact || "—"}</div>
          <div className={`text-[10px] mt-1 ${muted}`}>Licence d'entrepreneur de spectacles —</div>
        </div>
        <div className={`p-4 border ${border} rounded`}>
          <div className={`text-[9px] uppercase tracking-wider mb-2 ${muted}`}>Et le salarié</div>
          <div className="text-sm font-bold" {...ce}>Votre nom</div>
          <div className={`text-[11px] mt-1 ${muted}`} {...ce}>Né(e) le — à —</div>
          <div className={`text-[11px] mt-1 ${muted}`} {...ce}>N° SS —</div>
          <div className={`text-[10px] mt-2 ${muted}`} {...ce}>Adresse —</div>
        </div>
      </div>

      <Article num="1" title="OBJET DU CONTRAT" muted={muted}>
        <p className="text-sm leading-relaxed" {...ce}>
          Le présent contrat est conclu en application des articles L.1242-2 3° et D.1242-1 du Code du travail
          (CDD d'usage) en raison du caractère par nature temporaire de l'emploi dans le secteur du spectacle.
          Le salarié est engagé en qualité de <span className="font-bold">{prestation?.type || "—"}</span>
          {prestation?.annexe ? <> — relevant de l'<span className="font-bold">annexe {prestation.annexe}</span></> : null}.
        </p>
      </Article>

      <Article num="2" title="DURÉE & LIEU" muted={muted}>
        <p className="text-sm leading-relaxed" {...ce}>
          Le contrat débute le <span className="font-medium">{dateLabel}</span> et prend fin
          à l'issue de la prestation, soit après <span className="font-medium">{prestation?.duration_hours || "—"} heures</span>
          de travail effectif. Lieu d'exécution : <span className="font-medium">{prestation?.location || "—"}</span>.
        </p>
      </Article>

      <Article num="3" title="RÉMUNÉRATION" muted={muted}>
        <p className="text-sm leading-relaxed" {...ce}>
          En contrepartie de son travail, le salarié percevra un cachet brut de
          <span className="font-bold text-aime-red text-base"> {amount} €</span>,
          conforme aux minima de la convention collective applicable. Toutes cotisations sociales seront retenues par l'employeur.
        </p>
      </Article>

      <Article num="4" title="CONVENTION COLLECTIVE" muted={muted}>
        <p className="text-sm leading-relaxed" {...ce}>
          Le présent contrat est régi par la convention collective applicable au secteur d'activité de l'employeur
          (CCNEAC, CCNSV, Production audiovisuelle, etc.). Le salarié bénéficie des dispositions des annexes 8 ou 10
          du règlement de l'assurance chômage.
        </p>
      </Article>

      <Article num="5" title="ENGAGEMENTS" muted={muted}>
        <p className="text-sm leading-relaxed" {...ce}>
          L'employeur s'engage à effectuer la DPAE, à transmettre l'AEM, et à verser les cotisations
          aux organismes compétents (Urssaf, France Travail, Audiens, AFDAS, Congés Spectacles, CMB).
          Le salarié s'engage à exécuter ses obligations contractuelles avec diligence.
        </p>
      </Article>

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
        Contrat préparatoire privé édité via AIME. Document de relecture — ne remplace pas un contrat validé par un avocat ou un conseil spécialisé. Le CDD d'usage doit être remis au salarié au plus tard dans les 2 jours suivant l'embauche.
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

function Article({ num, title, muted, children }) {
  return (
    <div className="mb-4">
      <div className={`text-[10px] uppercase tracking-[0.18em] font-bold mb-1.5 text-aime-red`}>
        Article {num} — {title}
      </div>
      {children}
    </div>
  );
}