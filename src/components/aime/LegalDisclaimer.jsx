import React from "react";
import { Info, ShieldAlert } from "lucide-react";

/**
 * Disclaimer légal réutilisable AIME Cachet.
 *
 * variants :
 *  - "full"   : version longue, encart complet (modales partage, footers PDF).
 *  - "short"  : version courte, une ligne (recto fiche, verso, partages secondaires).
 *  - "inline" : très discret, sous estimations (cockpit 507, AJ, simulation).
 *
 * tone :
 *  - "neutral" (défaut) : gris doux.
 *  - "warning" : fond ambre pour modales de partage premier usage.
 */
export default function LegalDisclaimer({ variant = "short", tone = "neutral", className = "" }) {
  const LONG_TEXT =
    "Document préparatoire généré par AIME Cachet. Ce document est une aide documentaire et ne constitue pas une déclaration officielle, une certification administrative, une validation France Travail, une validation GUSO, ni un document juridiquement opposable. Les informations doivent être vérifiées et validées par les personnes concernées et les organismes officiels compétents.";

  const SHORT_TEXT =
    "Document préparatoire non opposable, sans valeur officielle. À vérifier avant transmission ou usage administratif.";

  const INLINE_TEXT =
    "Estimation indicative. Validation humaine et organismes officiels nécessaires.";

  if (variant === "inline") {
    return (
      <p className={`text-[10.5px] text-zinc-400 leading-relaxed inline-flex items-start gap-1 ${className}`}>
        <Info className="w-3 h-3 mt-0.5 shrink-0" />
        <span>{INLINE_TEXT}</span>
      </p>
    );
  }

  if (variant === "full") {
    const isWarning = tone === "warning";
    return (
      <div
        className={`rounded-2xl border p-4 flex items-start gap-3 ${
          isWarning ? "bg-amber-50 border-amber-200" : "bg-zinc-50 border-zinc-200"
        } ${className}`}
      >
        <ShieldAlert
          className={`w-4 h-4 mt-0.5 shrink-0 ${isWarning ? "text-amber-600" : "text-zinc-500"}`}
        />
        <div className="flex-1">
          <div
            className={`text-[10px] tracking-[0.2em] font-semibold uppercase mb-1 ${
              isWarning ? "text-amber-700" : "text-zinc-600"
            }`}
          >
            Document préparatoire
          </div>
          <p className={`text-[11.5px] leading-relaxed ${isWarning ? "text-amber-900" : "text-zinc-600"}`}>
            {LONG_TEXT}
          </p>
        </div>
      </div>
    );
  }

  // short (défaut)
  return (
    <p className={`text-[10.5px] text-zinc-500 italic leading-relaxed ${className}`}>
      {SHORT_TEXT}
    </p>
  );
}