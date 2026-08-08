import React from "react";
import { ShieldCheck, ShieldAlert } from "lucide-react";

/**
 * Badge "scellée" pour les listes de prestations (v1.5).
 * Affiche un statut neutre de cohérence technique, JAMAIS de certification officielle.
 *
 * États :
 *   - synced  : verification_hash présent  → "Scellée" (émeraude)
 *   - stale   : verification_hash présent mais données modifiées depuis → "À resceller" (ambre)
 *   - none    : aucun hash                 → rien (n'affiche pas le badge)
 *
 * Vocabulaire strictement préparatoire — pas de mention "validé", "certifié", "officiel".
 */
export default function PrestationSealedBadge({ state, compact = false }) {
  if (!state || state === "none") return null;

  const config = {
    synced: {
      label: compact ? "Scellée" : "Cohérence scellée",
      Icon: ShieldCheck,
      classes: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    stale: {
      label: compact ? "À resceller" : "À resceller",
      Icon: ShieldAlert,
      classes: "bg-amber-50 text-amber-700 border-amber-200",
    },
  }[state];

  if (!config) return null;
  const { Icon, label, classes } = config;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-medium ${classes}`}
      title="Cohérence technique uniquement — pas une certification officielle"
    >
      <Icon className="w-2.5 h-2.5" strokeWidth={2.5} />
      {label}
    </span>
  );
}