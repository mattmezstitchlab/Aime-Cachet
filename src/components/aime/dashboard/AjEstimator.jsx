import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import ExplainTip from "./ExplainTip";
import LegalDisclaimer from "@/components/aime/LegalDisclaimer";

// Estimateur Allocation Journalière A+B+C
export default function AjEstimator({ data }) {
  const [showDetail, setShowDetail] = useState(false);
  const { aj, ajNet, ajMonthly, ajMonthlyNet, SR, NHT, annexeKey, cpFranchise } = data;

  return (
    <div className="bg-white rounded-3xl ring-1 ring-zinc-100 p-6 md:p-8">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <h3 className="text-[11px] tracking-[0.25em] text-zinc-500 font-semibold uppercase">Allocation journalière estimée</h3>
          <ExplainTip title="Formule A + B + C">
            L'allocation journalière brute est calculée selon la formule officielle Unédic : <strong>AJ = A + B + C</strong>. A dépend de votre Salaire de Référence (SR), B du nombre d'heures travaillées (NHT), C est une part fixe.
          </ExplainTip>
        </div>
        <button
          onClick={() => setShowDetail((v) => !v)}
          className="text-[11px] text-zinc-500 hover:text-zinc-900 inline-flex items-center gap-1"
        >
          {showDetail ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          {showDetail ? "Masquer le détail" : "Voir le détail"}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
        <Big label="AJ brute / jour" value={`${aj.ajBrute.toFixed(2)} €`} accent />
        <Big label="AJ nette / jour" value={`${ajNet.toFixed(2)} €`} sub="≈ -10%" />
        <Big label="Brut / mois" value={`${ajMonthly.toFixed(0)} €`} sub="sur 30j" />
        <Big label="Net / mois" value={`${ajMonthlyNet.toFixed(0)} €`} sub="indicatif" />
      </div>

      <div className="mt-4">
        <LegalDisclaimer variant="inline" />
      </div>

      {showDetail && (
        <div className="mt-6 pt-6 border-t border-zinc-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[12px]">
            <Detail label="Part A (SR)" value={`${aj.A.toFixed(2)} €`}>
              Liée au Salaire de Référence ({SR.toFixed(0)} € brut). Formule : AJmin × (0,42 × SR ≤14400 + 0,05 × SR &gt;14400) / 5000.
            </Detail>
            <Detail label="Part B (NHT)" value={`${aj.B.toFixed(2)} €`}>
              Liée aux heures travaillées ({Math.round(NHT)}h). Formule : AJmin × (0,26 × NHT ≤720 + 0,08 × NHT &gt;720) / 507.
            </Detail>
            <Detail label="Part C (fixe)" value={`${aj.C.toFixed(2)} €`}>
              Part forfaitaire : AJmin × 0,70.
            </Detail>
          </div>

          <div className="mt-5 grid grid-cols-2 md:grid-cols-3 gap-4 text-[12px]">
            <Detail label="Annexe retenue" value={annexeKey === "annexe8" ? "Annexe 8" : "Annexe 10"}>
              Déterminée par l'annexe majoritaire en heures sur la période.
            </Detail>
            <Detail label="Salaire de référence" value={`${SR.toFixed(0)} €`}>
              Somme des rémunérations brutes prises en compte sur la PRA.
            </Detail>
            <Detail label="Franchise CP estimée" value={`${cpFranchise} j`}>
              2,5 jours de franchise par 24 jours travaillés, plafond 30 jours.
            </Detail>
          </div>

          <p className="text-[11px] text-zinc-400 mt-5 leading-relaxed">
            Indicatif uniquement. AJ minimale référence : 38,46 € (susceptible de revalorisation). Les chiffres définitifs sont communiqués par France Travail après examen complet du dossier.
          </p>
        </div>
      )}
    </div>
  );
}

function Big({ label, value, accent, sub }) {
  return (
    <div>
      <div className="text-[10px] tracking-[0.2em] text-zinc-500 uppercase font-medium">{label}</div>
      <div className={`font-display text-3xl mt-1 tracking-tight tabular-nums ${accent ? "text-aime-red" : "text-zinc-900"}`}>{value}</div>
      {sub && <div className="text-[10px] text-zinc-400 mt-0.5">{sub}</div>}
    </div>
  );
}
function Detail({ label, value, children }) {
  return (
    <div className="bg-zinc-50 rounded-xl p-3">
      <div className="text-[10px] tracking-wider text-zinc-500 uppercase font-medium">{label}</div>
      <div className="font-display text-lg text-zinc-900 tabular-nums mt-0.5">{value}</div>
      <div className="text-[11px] text-zinc-500 leading-relaxed mt-1.5">{children}</div>
    </div>
  );
}