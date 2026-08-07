import React from "react";
import { formatDateFR } from "@/lib/aimeData";
import StampGraphic from "@/components/aime/fiche/StampGraphic";

/**
 * Contrat de cession de droits voisins — cession des droits d'artiste-interprète.
 * Document préparatoire entre l'artiste-interprète (cédant) et le producteur (cessionnaire)
 * pour la fixation, la reproduction et la communication au public d'une interprétation.
 */
export default function CessionDroitsPaper({ prestation, cachetCode, stamp, stampPosition, theme = "light", textEditable, paperRef, onStampClickArea }) {
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
          <div className="font-display text-3xl leading-none" {...ce}>CONTRAT DE CESSION</div>
          <div className={`text-[10px] uppercase tracking-wider mt-1 ${muted}`}>de droits voisins de l'artiste-interprète</div>
          <div className="text-sm font-mono mt-2 opacity-70">{cachetCode}</div>
        </div>
        <div className="text-right">
          <div className={`text-[9px] uppercase tracking-wider ${muted}`}>Établi le</div>
          <div className="text-sm font-medium mt-1" {...ce}>{dateLabel}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className={`p-4 border ${border} rounded`}>
          <div className={`text-[9px] uppercase tracking-wider mb-2 ${muted}`}>Le cédant (artiste-interprète)</div>
          <div className="text-sm font-bold" {...ce}>Votre nom</div>
          <div className={`text-[11px] mt-1 ${muted}`} {...ce}>Né(e) le — · N° SS —</div>
          <div className={`text-[10px] mt-2 ${muted}`} {...ce}>Adresse —</div>
        </div>
        <div className={`p-4 border ${border} rounded`}>
          <div className={`text-[9px] uppercase tracking-wider mb-2 ${muted}`}>Le cessionnaire (producteur)</div>
          <div className="text-sm font-bold" {...ce}>{prestation?.employer || "—"}</div>
          <div className={`text-[11px] mt-1 ${muted}`}>{prestation?.employer_siret || "SIRET —"}</div>
          <div className={`text-[10px] mt-2 ${muted}`} {...ce}>Représenté par {prestation?.employer_contact || "—"}</div>
        </div>
      </div>

      <Article num="1" title="OBJET" muted={muted}>
        <p className="text-sm leading-relaxed" {...ce}>
          Conformément aux articles L.212-1 et suivants du Code de la propriété intellectuelle,
          le cédant cède au cessionnaire les droits voisins attachés à son interprétation dans le cadre
          de la prestation <span className="font-bold">« {prestation?.nature || "—"} »</span>,
          réalisée le <span className="font-medium">{dateLabel}</span> à
          <span className="font-medium"> {prestation?.location || "—"}</span>.
        </p>
      </Article>

      <Article num="2" title="DROITS CÉDÉS" muted={muted}>
        <p className="text-sm leading-relaxed mb-2" {...ce}>
          La cession porte sur les droits suivants, à titre exclusif :
        </p>
        <ul className={`list-disc pl-5 text-sm leading-relaxed space-y-1 ${muted}`} {...ce}>
          <li>Droit de fixation de l'interprétation sur tout support</li>
          <li>Droit de reproduction par tous procédés connus ou à venir</li>
          <li>Droit de communication au public (radiodiffusion, télédiffusion, mise à disposition en ligne)</li>
          <li>Droit de distribution et de location des supports</li>
        </ul>
      </Article>

      <Article num="3" title="ÉTENDUE — TERRITOIRE & DURÉE" muted={muted}>
        <p className="text-sm leading-relaxed" {...ce}>
          La présente cession est consentie pour le monde entier, pour la durée légale des droits voisins
          (50 ans à compter de la première communication au public, art. L.211-4 CPI).
        </p>
      </Article>

      <Article num="4" title="RÉMUNÉRATION" muted={muted}>
        <p className="text-sm leading-relaxed" {...ce}>
          En contrepartie de la cession, le cessionnaire verse au cédant une rémunération forfaitaire de
          <span className="font-bold text-aime-red text-base"> {amount} €</span>,
          distincte du salaire perçu pour la prestation. Une rémunération complémentaire pourra être
          due en cas d'exploitation secondaire (art. L.212-3 CPI).
        </p>
      </Article>

      <Article num="5" title="DROIT MORAL" muted={muted}>
        <p className="text-sm leading-relaxed" {...ce}>
          Le cédant conserve son droit moral, notamment le droit au respect de son nom, de sa qualité
          et de son interprétation (art. L.212-2 CPI). Toute mention au générique devra inclure le nom du cédant.
        </p>
      </Article>

      <div className="grid grid-cols-2 gap-12 mt-8 mb-8">
        <div>
          <div className={`text-[9px] uppercase tracking-wider mb-2 ${muted}`}>Le cédant</div>
          <div className={`border-b ${border} h-16`} />
          <div className={`text-[10px] mt-1 ${muted}`}>Signature · « Lu et approuvé »</div>
        </div>
        <div>
          <div className={`text-[9px] uppercase tracking-wider mb-2 ${muted}`}>Le cessionnaire</div>
          <div className={`border-b ${border} h-16`} />
          <div className={`text-[10px] mt-1 ${muted}`}>Cachet · Signature · « Lu et approuvé »</div>
        </div>
      </div>

      <div className={`p-3 border ${border} ${isDark ? "bg-zinc-800/50" : "bg-zinc-50"} text-[9px] ${muted} leading-relaxed`}>
        <div className={`font-bold mb-1 ${isDark ? "text-white" : "text-zinc-900"}`}>Mentions légales</div>
        Contrat préparatoire privé édité via AIME. Document de relecture — ne remplace pas un contrat validé par un avocat spécialisé en propriété intellectuelle. La cession de droits voisins est régie par les articles L.211-1 et suivants du Code de la propriété intellectuelle.
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