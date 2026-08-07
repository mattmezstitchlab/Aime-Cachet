import React from "react";
import { formatDateFR } from "@/lib/aimeData";
import StampGraphic from "@/components/aime/fiche/StampGraphic";

/**
 * DPAE — Déclaration Préalable À l'Embauche.
 * Document préparatoire (URSSAF). Reproduit la structure du formulaire
 * de déclaration à transmettre avant toute embauche.
 */
export default function DpaePaper({ prestation, cachetCode, stamp, stampPosition, theme = "light", textEditable, paperRef, onStampClickArea }) {
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
          <div className="font-display text-4xl leading-none" {...ce}>DPAE</div>
          <div className={`text-[10px] uppercase tracking-wider mt-1 ${muted}`}>Déclaration préalable à l'embauche</div>
          <div className="text-sm font-mono mt-2 opacity-70">{cachetCode}</div>
        </div>
        <div className="text-right">
          <div className={`text-[9px] uppercase tracking-wider ${muted}`}>URSSAF</div>
          <div className="text-sm font-medium mt-1" {...ce}>{dateLabel}</div>
        </div>
      </div>

      <Section title="Employeur" muted={muted}>
        <Field label="Raison sociale" value={prestation?.employer || "—"} ce={ce} />
        <Field label="SIRET" value={prestation?.employer_siret || "—"} ce={ce} />
        <Field label="Adresse" value="—" ce={ce} />
        <Field label="Code NAF" value="9001Z (Arts du spectacle vivant)" ce={ce} />
      </Section>

      <Section title="Salarié" muted={muted}>
        <Field label="Nom" value="Votre nom" ce={ce} />
        <Field label="Prénom" value="Votre prénom" ce={ce} />
        <Field label="N° de Sécurité sociale" value="—" ce={ce} />
        <Field label="Date de naissance" value="—" ce={ce} />
        <Field label="Lieu de naissance" value="—" ce={ce} />
        <Field label="Nationalité" value="—" ce={ce} />
      </Section>

      <Section title="Contrat" muted={muted}>
        <div className={`grid grid-cols-2 gap-x-6 gap-y-2 p-3 rounded ${rowBg} border ${border}`}>
          <Field label="Nature" value={prestation?.type === "Artiste" ? "CDD d'usage — Artiste" : "CDD d'usage — Technicien"} ce={ce} compact />
          <Field label="Annexe" value={prestation?.annexe ? `Annexe ${prestation.annexe}` : "—"} ce={ce} compact />
          <Field label="Date d'embauche" value={dateLabel} ce={ce} compact />
          <Field label="Heure de début" value="—" ce={ce} compact />
          <Field label="Durée prévue" value={prestation?.duration_hours ? `${prestation.duration_hours} h` : "—"} ce={ce} compact />
          <Field label="Lieu d'exécution" value={prestation?.location || "—"} ce={ce} compact />
        </div>
      </Section>

      <Section title="Médecine du travail" muted={muted}>
        <Field label="Service de santé au travail" value="CMB — Centre Médical de la Bourse" ce={ce} />
        <Field label="N° d'adhésion" value="—" ce={ce} />
      </Section>

      <div className="grid grid-cols-2 gap-12 mt-10 mb-8">
        <div>
          <div className={`text-[9px] uppercase tracking-wider mb-2 ${muted}`}>Date de la déclaration</div>
          <div className={`border-b ${border} h-10`} />
        </div>
        <div>
          <div className={`text-[9px] uppercase tracking-wider mb-2 ${muted}`}>Signature de l'employeur</div>
          <div className={`border-b ${border} h-12`} />
        </div>
      </div>

      <div className={`p-3 border ${border} ${isDark ? "bg-zinc-800/50" : "bg-zinc-50"} text-[9px] ${muted} leading-relaxed`}>
        <div className={`font-bold mb-1 ${isDark ? "text-white" : "text-zinc-900"}`}>Mentions légales</div>
        Brouillon préparatoire privé édité via AIME. La DPAE officielle doit être transmise à l'URSSAF (net-entreprises.fr) au plus tôt 8 jours avant l'embauche et au plus tard dans les instants précédant la prise de poste. Ce document ne tient pas lieu de déclaration officielle.
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

function Section({ title, muted, children }) {
  return (
    <div className="mb-6">
      <div className={`text-[10px] uppercase tracking-[0.18em] font-bold mb-2 text-aime-red`}>{title}</div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function Field({ label, value, ce, compact }) {
  if (compact) {
    return (
      <div>
        <div className="text-[9px] uppercase tracking-wider opacity-60">{label}</div>
        <div className="text-[12px] font-medium mt-0.5" {...ce}>{value}</div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-[180px_1fr] gap-3 items-baseline">
      <div className="text-[10px] uppercase tracking-wider opacity-60">{label}</div>
      <div className="text-[12px] font-medium border-b border-dotted border-current/20 pb-0.5" {...ce}>{value}</div>
    </div>
  );
}