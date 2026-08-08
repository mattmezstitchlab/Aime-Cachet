import React from "react";
import { Check } from "lucide-react";
import { formatDateFR } from "@/lib/aimeData";
import StampGraphic from "@/components/aime/fiche/StampGraphic";
import DraftWatermark from "@/components/aime/fiche/DraftWatermark";

const STEPS = [
  ["GUSO", "Si employeur occasionnel du spectacle vivant : déclaration GUSO à vérifier."],
  ["AEM / DUS", "Si employeur professionnel : déclaration AEM ou DUS selon situation."],
  ["CONTRAT", "Contrat, bulletin et justificatif à conserver."],
  ["FRANCE TRAVAIL", "Actualisation et justificatifs selon votre situation."],
  ["AUDIENS", "Congés Spectacles / Audiens — selon cas."],
];

const DOCS = [
  "Contrat ou engagement",
  "DPAE si applicable",
  "Déclaration GUSO / AEM / DUS selon cas",
  "Bulletin ou justificatif",
  "Preuve de paiement",
  "Coordonnées employeur",
  "Justificatif de prestation",
  "Message employeur préparé",
];

function Row({ label, value, muted, border, ce }) {
  return (
    <div className={`flex gap-4 py-1.5 border-b ${border} last:border-0`}>
      <div className={`text-[10px] uppercase tracking-wider ${muted} w-40 shrink-0 pt-0.5`}>{label}</div>
      <div className="text-sm font-medium" {...ce}>{value || "—"}</div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-6">
      <div className="text-[10px] font-bold text-aime-red tracking-[0.2em] uppercase mb-2 pb-1.5 border-b-2 border-current opacity-90">{title}</div>
      <div className="opacity-100">{children}</div>
    </div>
  );
}

export default function FichePaper({ prestation, cachetCode, stamp, stampPosition, theme = "light", textEditable, paperRef, onStampClickArea }) {
  if (!prestation) return null;

  const isDark = theme === "dark";
  const bg = isDark ? "bg-zinc-900 text-white" : "bg-white text-zinc-900";
  const border = isDark ? "border-zinc-700" : "border-zinc-100";
  const muted = isDark ? "text-zinc-400" : "text-zinc-500";
  const ce = textEditable ? { contentEditable: true, suppressContentEditableWarning: true } : {};

  const d = formatDateFR(prestation.date);
  const sectorLabel = prestation.sector === "spectacle_vivant" ? "Spectacle vivant"
    : prestation.sector === "audiovisuel" ? "Audiovisuel" : "Autre";
  const employerKindLabel = prestation.employer_kind === "occasionnel" ? "Occasionnel" : "Professionnel";
  const checked = Math.max(0, DOCS.length - (prestation.missing_documents || 0));

  return (
    <div
      ref={paperRef}
      onClick={onStampClickArea}
      className={`relative ${bg} shadow-2xl mx-auto overflow-hidden`}
      style={{ width: "210mm", minHeight: "297mm", padding: "18mm" }}
    >
      {/* Watermark brouillon tant que la fiche n'est pas validée */}
      <DraftWatermark status={prestation.status} theme={theme} />
      {/* Badge "préparatoire" discret coin haut-droit */}
      <div
        aria-hidden
        className={`absolute top-[8mm] right-[8mm] text-[7px] tracking-[0.2em] font-medium uppercase px-2 py-0.5 rounded-sm border ${isDark ? "text-zinc-400 border-zinc-700" : "text-zinc-400 border-zinc-300"}`}
      >
        Préparatoire
      </div>
      {/* Header */}
      <div className="flex items-start justify-between border-b-2 border-aime-red pb-4 mb-6">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl leading-none">AIME</span>
            <span className="text-[9px] tracking-[0.3em] text-aime-red font-bold">CACHET</span>
          </div>
          <div className="mt-2 text-base font-bold" {...ce}>Fiche Cachet — Document préparatoire</div>
          <div className={`text-[10px] mt-0.5 italic ${muted}`}>Document préparatoire non opposable, sans valeur officielle.</div>
        </div>
        <div className="text-right">
          <div className={`text-[9px] uppercase tracking-wider ${muted}`}>Code Cachet</div>
          <div className="font-mono text-xs font-bold mt-0.5">{cachetCode}</div>
        </div>
      </div>

      <Section title="A. Informations prestation">
        <Row label="Date" value={`${d.day} ${d.month} ${d.year}`} muted={muted} border={border} ce={ce} />
        <Row label="Durée" value={prestation.duration_hours ? `${prestation.duration_hours} h` : null} muted={muted} border={border} ce={ce} />
        <Row label="Lieu" value={prestation.location} muted={muted} border={border} ce={ce} />
        <Row label="Nature" value={prestation.nature} muted={muted} border={border} ce={ce} />
        <Row label="Artiste / Technicien" value={prestation.type} muted={muted} border={border} ce={ce} />
        <Row label="Secteur" value={sectorLabel} muted={muted} border={border} ce={ce} />
        <Row label="Annexe" value={prestation.annexe ? `Annexe ${prestation.annexe}` : null} muted={muted} border={border} ce={ce} />
        <Row label="Montant brut" value={prestation.amount ? `${prestation.amount} €` : null} muted={muted} border={border} ce={ce} />
      </Section>

      <Section title="B. Employeur / Structure">
        <Row label="Nom" value={prestation.employer} muted={muted} border={border} ce={ce} />
        <Row label="Contact" value={prestation.employer_contact} muted={muted} border={border} ce={ce} />
        <Row label="Email" value={prestation.employer_email} muted={muted} border={border} ce={ce} />
        <Row label="Téléphone" value={prestation.employer_phone} muted={muted} border={border} ce={ce} />
        <Row label="SIRET" value={prestation.employer_siret} muted={muted} border={border} ce={ce} />
        <Row label="Type d'employeur" value={employerKindLabel} muted={muted} border={border} ce={ce} />
      </Section>

      <Section title="C. Chemin administratif conseillé">
        {STEPS.map(([tag, text]) => (
          <div key={tag} className="flex gap-4 py-1.5">
            <div className="text-[10px] font-bold text-aime-red w-32 shrink-0 pt-0.5 tracking-wider">{tag}</div>
            <div className={`text-xs leading-relaxed ${isDark ? "text-zinc-300" : "text-zinc-700"}`} {...ce}>{text}</div>
          </div>
        ))}
      </Section>

      <Section title="D. Documents à préparer">
        <div className="grid grid-cols-2 gap-y-2 gap-x-6">
          {DOCS.map((label, i) => {
            const isOk = i < checked;
            return (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-3.5 h-3.5 border ${isOk ? "bg-aime-red border-aime-red" : isDark ? "border-zinc-600" : "border-zinc-300"} flex items-center justify-center shrink-0`}>
                  {isOk && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                </div>
                <span className={`text-xs ${isOk ? "" : muted}`}>{label}</span>
              </div>
            );
          })}
        </div>
      </Section>

      <div className={`mt-8 mr-[34mm] p-3 border ${isDark ? "border-zinc-700 bg-zinc-800/50" : "border-zinc-200 bg-zinc-50"} text-[9px] ${muted} leading-relaxed`}>
        <div className={`font-bold mb-1 ${isDark ? "text-white" : "text-zinc-900"}`}>Mentions légales</div>
        AIME n'est ni mandaté ni affilié à GUSO, France Travail, Urssaf, Audiens ou Pôle Emploi Spectacle. Ce document préparatoire privé ne remplace ni une déclaration AEM, ni un contrat de travail, ni une attestation employeur. Les démarches officielles restent à effectuer auprès des organismes compétents. Données déclaratives non vérifiées, éditées par l'utilisateur.
      </div>

      <div className={`absolute bottom-[10mm] left-[18mm] right-[34mm] flex items-end justify-between pt-3 border-t ${border} text-[9px] ${muted} italic`}>
        <span>AIME prépare. L'utilisateur vérifie. L'organisme officiel valide.</span>
        <span>Code : {cachetCode}</span>
      </div>

      {stamp && stampPosition && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: `${stampPosition.x}px`,
            top: `${stampPosition.y}px`,
            transform: `translate(-50%, -50%) rotate(${stamp.rotation || -8}deg)`,
          }}
        >
          <StampGraphic stamp={stamp} theme={theme} />
        </div>
      )}
    </div>
  );
}