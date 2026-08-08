import React from "react";
import { GraduationCap, Heart, Baby, Activity, BookOpen } from "lucide-react";
import ExplainTip from "./ExplainTip";

// Détails des heures assimilées (formation, enseignement, maladie, maternité, AT)
export default function AssimilatedHours({ assimilated }) {
  const items = [
    { icon: BookOpen,     label: "Formation AFDAS",   value: assimilated.formationRetained,  raw: assimilated.formation,  hint: "Formation rémunérée AFDAS (livres III/IV du Code du travail)." },
    { icon: GraduationCap, label: "Enseignement",      value: assimilated.teachingRetained,   raw: assimilated.teaching,   hint: `Plafonné à ${assimilated.teachingCap}h. Compté pour les 507h, exclu de l'AJ.` },
    { icon: Heart,        label: "Maladie",           value: assimilated.sickness,           raw: assimilated.sickness,   hint: "5h/jour assimilées pour les arrêts pris en charge par la CPAM." },
    { icon: Baby,         label: "Maternité/adoption", value: assimilated.maternity,          raw: assimilated.maternity,  hint: "5h/jour assimilées, avec équivalent-salaire pour l'AJ." },
    { icon: Activity,     label: "Accident du travail", value: assimilated.workAccident,     raw: assimilated.workAccident, hint: "5h/jour pour la totalité de l'arrêt." },
  ];

  const total = assimilated.totalAssimilated;

  return (
    <div className="bg-white rounded-3xl ring-1 ring-zinc-100 p-6">
      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-[11px] tracking-[0.25em] text-zinc-500 font-semibold uppercase">Heures assimilées</h3>
        <ExplainTip title="Heures assimilées">
          Au-delà des heures travaillées, certaines périodes (formation, enseignement, maladie, maternité, accident) sont assimilées et comptent dans les 507h selon des règles précises et des plafonds.
        </ExplainTip>
      </div>
      <div className="text-[11px] text-zinc-500 mb-4">
        Total retenu : <strong className="text-zinc-900">{Math.round(total)}h</strong>
        {assimilated.formationTeachingCap > 0 && (
          <> · Plafond formation+enseignement : {assimilated.formationTeachingCap}h</>
        )}
      </div>

      <div className="space-y-2">
        {items.map((it) => {
          const Icon = it.icon;
          const empty = !it.value;
          return (
            <div key={it.label} className={`flex items-center gap-3 px-3 py-2 rounded-xl ${empty ? "bg-zinc-50/60" : "bg-zinc-50"}`}>
              <span className={`w-7 h-7 rounded-lg flex items-center justify-center ${empty ? "text-zinc-300" : "text-aime-red bg-aime-red/10"}`}>
                <Icon className="w-3.5 h-3.5" />
              </span>
              <span className="flex-1 text-[12px] text-zinc-700">{it.label}</span>
              <ExplainTip title={it.label}>{it.hint}</ExplainTip>
              <span className={`text-[12px] font-semibold tabular-nums ${empty ? "text-zinc-300" : "text-zinc-900"}`}>{Math.round(it.value)}h</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}