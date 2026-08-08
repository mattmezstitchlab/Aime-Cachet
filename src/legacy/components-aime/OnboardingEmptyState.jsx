import React from "react";
import { Plus, FileText, ShieldCheck, Eye } from "lucide-react";

/**
 * Écran d'accueil pour les utilisateurs sans aucune prestation (v1.5).
 * 3 étapes pédagogiques : Créer → Sceller → Vérifier.
 * Vocabulaire strictement préparatoire — aucune mention "officiel", "certifié", "validé".
 */
export default function OnboardingEmptyState({ onCreate }) {
  const steps = [
    {
      n: "1",
      Icon: FileText,
      title: "Crée ta première fiche",
      desc: "Renseigne ta prestation : date, employeur, lieu, durée. Tu peux compléter au fur et à mesure.",
    },
    {
      n: "2",
      Icon: ShieldCheck,
      title: "Scelle-la (optionnel)",
      desc: "Génère une empreinte technique SHA-256 de tes données. Une cohérence technique, pas une certification officielle.",
    },
    {
      n: "3",
      Icon: Eye,
      title: "Vérifie depuis n'importe où",
      desc: "Une URL publique /verify/:code permet à toi seul·e de relire la fiche. Aucune donnée sensible exposée.",
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-6 md:p-10">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-aime-red/10 text-aime-red text-[10px] tracking-[0.2em] font-semibold uppercase mb-4">
          Bienvenue sur AIME Cachet
        </div>
        <h2 className="font-display text-3xl md:text-4xl text-zinc-900 leading-tight">
          Prépare. Range. Vérifie.
        </h2>
        <p className="mt-3 text-sm text-zinc-500 leading-relaxed">
          AIME Cachet est ton cockpit documentaire <strong>préparatoire et privé</strong>. Il t'aide à structurer
          tes prestations, sans remplacer les démarches officielles auprès de France Travail, GUSO ou Audiens.
        </p>
      </div>

      {/* 3 étapes */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {steps.map(({ n, Icon, title, desc }) => (
          <div key={n} className="relative bg-zinc-50 rounded-xl p-5 border border-zinc-100">
            <div className="absolute -top-3 left-5 w-7 h-7 rounded-full bg-aime-red text-white text-xs font-bold flex items-center justify-center shadow-sm">
              {n}
            </div>
            <Icon className="w-5 h-5 text-zinc-900 mb-3 mt-2" strokeWidth={2} />
            <h3 className="text-sm font-semibold text-zinc-900 leading-tight">{title}</h3>
            <p className="mt-1.5 text-xs text-zinc-500 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-10 flex flex-col items-center gap-3">
        <button
          onClick={onCreate}
          className="bg-zinc-900 hover:bg-aime-red text-white text-sm font-medium px-6 py-3 rounded-full inline-flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Créer ma première fiche
        </button>
        <p className="text-[10px] text-zinc-400 max-w-md text-center leading-relaxed">
          Toutes les fiches sont des documents préparatoires privés sans valeur officielle.
          AIME prépare. L'utilisateur vérifie. L'organisme officiel valide.
        </p>
      </div>
    </div>
  );
}