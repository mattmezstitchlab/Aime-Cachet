import React from "react";
import { ShieldCheck, ShieldAlert, ShieldQuestion } from "lucide-react";

// AIME Cachet v1.3 — Badge "cohérence technique".
//
// 3 états strictement neutres :
//   - "match"      → "Cohérence technique vérifiée"
//   - "mismatch"   → "Incohérence technique détectée"
//   - "absent"     → "Hash non disponible"
//
// ⚠️ Aucune mention "certifié", "officiel", "validé administrativement".

const STATES = {
  match: {
    icon: ShieldCheck,
    title: "Cohérence technique vérifiée",
    text:
      "Les informations affichées correspondent à l'empreinte technique enregistrée pour cette fiche.",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-700",
    titleColor: "text-emerald-800",
  },
  mismatch: {
    icon: ShieldAlert,
    title: "Incohérence technique détectée",
    text:
      "L'empreinte technique enregistrée ne correspond plus aux informations actuelles. La fiche a été modifiée depuis son scellement, ou le code transmis ne correspond pas.",
    bg: "bg-red-50",
    border: "border-red-200",
    iconBg: "bg-red-100",
    iconColor: "text-red-700",
    titleColor: "text-red-800",
  },
  absent: {
    icon: ShieldQuestion,
    title: "Hash non disponible",
    text:
      "Aucune empreinte technique n'a été scellée pour cette fiche. La cohérence technique ne peut pas être vérifiée.",
    bg: "bg-zinc-50",
    border: "border-zinc-200",
    iconBg: "bg-zinc-100",
    iconColor: "text-zinc-600",
    titleColor: "text-zinc-800",
  },
};

export default function HashCheckBadge({ state = "absent", storedHash, sealedAt }) {
  const s = STATES[state] || STATES.absent;
  const Icon = s.icon;
  const shortHash =
    storedHash && typeof storedHash === "string" ? storedHash.slice(0, 12) : null;

  return (
    <div className={`${s.bg} ${s.border} border rounded-3xl p-5 mb-6 flex items-start gap-3`}>
      <span className={`w-10 h-10 rounded-2xl ${s.iconBg} flex items-center justify-center shrink-0`}>
        <Icon className={`w-5 h-5 ${s.iconColor}`} />
      </span>
      <div className="flex-1 min-w-0">
        <div className={`text-[10px] tracking-[0.2em] uppercase font-bold ${s.titleColor}`}>
          Empreinte technique
        </div>
        <div className={`font-display text-[15px] mt-0.5 ${s.titleColor}`}>{s.title}</div>
        <p className="text-[12px] text-zinc-700 leading-relaxed mt-1.5">{s.text}</p>

        {shortHash && (
          <div className="mt-3 text-[10px] text-zinc-500 font-mono break-all">
            SHA-256 · {shortHash}…
            {sealedAt && (
              <span className="block text-[9.5px] text-zinc-400 mt-0.5">
                Scellé le {new Date(sealedAt).toLocaleString("fr-FR")}
              </span>
            )}
          </div>
        )}

        <p className="text-[10px] text-zinc-400 italic mt-3 leading-relaxed">
          L'empreinte vérifie uniquement la cohérence technique de la fiche. Elle ne constitue ni
          une certification administrative, ni une signature légale, ni une preuve opposable.
        </p>
      </div>
    </div>
  );
}