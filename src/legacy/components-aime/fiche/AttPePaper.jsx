import React from "react";
import { formatDateFR } from "@/lib/aimeData";
import StampGraphic from "@/components/aime/fiche/StampGraphic";

/**
 * Attestation Pôle Emploi — Attestation employeur de fin de contrat.
 * Document préparatoire remis au salarié à la fin du contrat,
 * permettant l'ouverture/le renouvellement des droits ARE.
 */
export default function AttPePaper({ prestation, cachetCode, stamp, stampPosition, theme = "light", textEditable, paperRef, onStampClickArea }) {
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
          <div className="font-display text-3xl leading-none" {...ce}>ATTESTATION EMPLOYEUR</div>
          <div className={`text-[10px] uppercase tracking-wider mt-1 ${muted}`}>destinée à Pôle Emploi — fin de contrat</div>
          <div className="text-sm font-mono mt-2 opacity-70">{cachetCode}</div>
        </div>
        <div className="text-right">
          <div className={`text-[9px] uppercase tracking-wider ${muted}`}>Émise le</div>
          <div className="text-sm font-medium mt-1" {...ce}>{dateLabel}</div>
        </div>
      </div>

      <Block title="Employeur" muted={muted} bg={rowBg} border={border}>
        <Row label="Raison sociale" value={prestation?.employer || "—"} ce={ce} />
        <Row label="SIRET" value={prestation?.employer_siret || "—"} ce={ce} />
        <Row label="Adresse" value="—" ce={ce} />
        <Row label="Code NAF" value="9001Z" ce={ce} />
        <Row label="Contact" value={prestation?.employer_contact || "—"} ce={ce} />
      </Block>

      <Block title="Salarié" muted={muted} bg={rowBg} border={border}>
        <Row label="Nom & prénom" value="Votre nom" ce={ce} />
        <Row label="N° de Sécurité sociale" value="—" ce={ce} />
        <Row label="Adresse" value="—" ce={ce} />
        <Row label="Qualification" value={prestation?.type === "Artiste" ? "Artiste du spectacle" : "Technicien du spectacle"} ce={ce} />
      </Block>

      <Block title="Contrat" muted={muted} bg={rowBg} border={border}>
        <Row label="Nature" value="CDD d'usage" ce={ce} />
        <Row label="Annexe d'affiliation" value={prestation?.annexe ? `Annexe ${prestation.annexe}` : "—"} ce={ce} />
        <Row label="Date d'embauche" value={dateLabel} ce={ce} />
        <Row label="Date de fin" value={dateLabel} ce={ce} />
        <Row label="Motif de fin" value="Fin de contrat à terme prévu" ce={ce} />
      </Block>

      <Block title="Rémunération" muted={muted} bg={rowBg} border={border}>
        <Row label="Heures travaillées" value={prestation?.duration_hours ? `${prestation.duration_hours} h` : "—"} ce={ce} />
        <Row label="Nombre de cachets" value="1" ce={ce} />
        <Row label="Salaire brut total" value={prestation?.amount ? `${prestation.amount} €` : "— €"} ce={ce} highlight />
        <Row label="Indemnité congés payés" value="—" ce={ce} />
        <Row label="Précarité (CDD)" value="—" ce={ce} />
      </Block>

      <div className="grid grid-cols-2 gap-12 mt-8 mb-8">
        <div>
          <div className={`text-[9px] uppercase tracking-wider mb-2 ${muted}`}>Fait à</div>
          <div className={`border-b ${border} h-10`} />
        </div>
        <div>
          <div className={`text-[9px] uppercase tracking-wider mb-2 ${muted}`}>Cachet & signature employeur</div>
          <div className={`border-b ${border} h-12`} />
        </div>
      </div>

      <div className={`p-3 border ${border} ${isDark ? "bg-zinc-800/50" : "bg-zinc-50"} text-[9px] ${muted} leading-relaxed`}>
        <div className={`font-bold mb-1 ${isDark ? "text-white" : "text-zinc-900"}`}>Mentions légales</div>
        Brouillon préparatoire privé édité via AIME. L'attestation officielle (formulaire France Travail / Pôle Emploi) doit être remise au salarié et transmise via DSN. Document à des fins de relecture interne — il ne remplace ni l'attestation ni l'AEM officielles.
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

function Block({ title, muted, bg, border, children }) {
  return (
    <div className="mb-5">
      <div className={`text-[10px] uppercase tracking-[0.18em] font-bold mb-2 text-aime-red`}>{title}</div>
      <div className={`p-3 rounded ${bg} border ${border} space-y-1`}>{children}</div>
    </div>
  );
}

function Row({ label, value, ce, highlight }) {
  return (
    <div className="grid grid-cols-[180px_1fr] gap-3 items-baseline py-0.5">
      <div className="text-[10px] uppercase tracking-wider opacity-60">{label}</div>
      <div className={`text-[12px] ${highlight ? "font-bold text-aime-red" : "font-medium"}`} {...ce}>{value}</div>
    </div>
  );
}