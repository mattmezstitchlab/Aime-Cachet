import React from "react";
import { formatDateFR } from "@/lib/aimeData";
import StampGraphic from "@/components/aime/fiche/StampGraphic";

/**
 * Convention de cession — cession de droits artistiques.
 * Document préparatoire entre le producteur (cédant) et l'organisateur (cessionnaire)
 * pour la cession d'un spectacle ou d'une représentation.
 */
export default function CessionPaper({ prestation, cachetCode, stamp, stampPosition, theme = "light", textEditable, paperRef, onStampClickArea }) {
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
          <div className="font-display text-3xl leading-none" {...ce}>CONVENTION DE CESSION</div>
          <div className={`text-[10px] uppercase tracking-wider mt-1 ${muted}`}>de droits de représentation d'un spectacle</div>
          <div className="text-sm font-mono mt-2 opacity-70">{cachetCode}</div>
        </div>
        <div className="text-right">
          <div className={`text-[9px] uppercase tracking-wider ${muted}`}>Établie le</div>
          <div className="text-sm font-medium mt-1" {...ce}>{dateLabel}</div>
        </div>
      </div>

      {/* Parties */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className={`p-4 border ${border} rounded`}>
          <div className={`text-[9px] uppercase tracking-wider mb-2 ${muted}`}>Entre le cédant</div>
          <div className="text-sm font-bold" {...ce}>Votre raison sociale</div>
          <div className={`text-[11px] mt-1 ${muted}`} {...ce}>Adresse · SIRET · Licence</div>
          <div className={`text-[10px] mt-3 ${muted}`}>Représenté par —</div>
        </div>
        <div className={`p-4 border ${border} rounded`}>
          <div className={`text-[9px] uppercase tracking-wider mb-2 ${muted}`}>Et le cessionnaire</div>
          <div className="text-sm font-bold" {...ce}>{prestation?.employer || "—"}</div>
          <div className={`text-[11px] mt-1 ${muted}`}>{prestation?.employer_siret || "SIRET —"}</div>
          <div className={`text-[10px] mt-3 ${muted}`} {...ce}>Représenté par {prestation?.employer_contact || "—"}</div>
        </div>
      </div>

      {/* Article 1 — Objet */}
      <Article num="1" title="OBJET" muted={muted}>
        <p className="text-sm leading-relaxed" {...ce}>
          Le cédant cède au cessionnaire, qui accepte, le droit de représentation du spectacle intitulé
          <span className="font-bold"> « {prestation?.nature || "—"} »</span>,
          dans les conditions définies ci-après.
        </p>
      </Article>

      {/* Article 2 — Représentation */}
      <Article num="2" title="DATE & LIEU" muted={muted}>
        <p className="text-sm leading-relaxed" {...ce}>
          La représentation aura lieu le <span className="font-medium">{dateLabel}</span> à
          <span className="font-medium"> {prestation?.location || "—"}</span>.
        </p>
      </Article>

      {/* Article 3 — Prix */}
      <Article num="3" title="PRIX DE CESSION" muted={muted}>
        <p className="text-sm leading-relaxed" {...ce}>
          Le cessionnaire versera au cédant la somme forfaitaire de
          <span className="font-bold text-aime-red text-base"> {amount} € HT</span>,
          en règlement de la cession de droits.
        </p>
      </Article>

      {/* Article 4 — Obligations */}
      <Article num="4" title="OBLIGATIONS" muted={muted}>
        <p className="text-sm leading-relaxed" {...ce}>
          Le cessionnaire prend à sa charge l'organisation matérielle, la billetterie, les déclarations sociales
          de son personnel et les droits d'auteur (SACEM, SACD). Le cédant assume la rémunération de ses artistes
          et techniciens.
        </p>
      </Article>

      {/* Signatures */}
      <div className="grid grid-cols-2 gap-12 mt-10 mb-8">
        <div>
          <div className={`text-[9px] uppercase tracking-wider mb-2 ${muted}`}>Le cédant</div>
          <div className={`border-b ${border} h-16`} />
          <div className={`text-[10px] mt-1 ${muted}`}>Cachet · Signature · « Lu et approuvé »</div>
        </div>
        <div>
          <div className={`text-[9px] uppercase tracking-wider mb-2 ${muted}`}>Le cessionnaire</div>
          <div className={`border-b ${border} h-16`} />
          <div className={`text-[10px] mt-1 ${muted}`}>Cachet · Signature · « Lu et approuvé »</div>
        </div>
      </div>

      <div className={`p-3 border ${border} ${isDark ? "bg-zinc-800/50" : "bg-zinc-50"} text-[9px] ${muted} leading-relaxed`}>
        <div className={`font-bold mb-1 ${isDark ? "text-white" : "text-zinc-900"}`}>Mentions légales</div>
        Convention préparatoire privée éditée via AIME. Ne remplace pas un contrat juridique validé par un avocat. Document à compléter, faire relire et signer avant exécution. La cession suppose la détention par le cédant d'une licence d'entrepreneur de spectacles en cours de validité.
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
    <div className="mb-5">
      <div className={`text-[10px] uppercase tracking-[0.18em] font-bold mb-1.5 text-aime-red`}>
        Article {num} — {title}
      </div>
      {children}
    </div>
  );
}