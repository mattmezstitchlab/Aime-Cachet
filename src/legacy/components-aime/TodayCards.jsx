import React from "react";
import { FileText, FolderOpen, FileDown, ArrowRight } from "lucide-react";

export default function TodayCards({ counters, prestations = [], onScrollTo, onGenerateFiche }) {
  const { totalDocsManquants = 0, pretsAVerifier = 0 } = counters || {};

  const ficheTarget =
    prestations.find((p) => p.status === "pret_a_verifier") ||
    [...prestations].sort((a, b) => (b.date || "").localeCompare(a.date || ""))[0];

  const cards = [
    {
      icon: FileText,
      title: "Vérifier les documents",
      body: totalDocsManquants > 0
        ? `${totalDocsManquants} document${totalDocsManquants > 1 ? "s" : ""} manquant${totalDocsManquants > 1 ? "s" : ""} au total.`
        : "Aucun document manquant.",
      cta: "Vérifier les documents",
      onClick: () => onScrollTo("prestations"),
    },
    {
      icon: FolderOpen,
      title: "Préparer un dossier",
      body: pretsAVerifier > 0
        ? `${pretsAVerifier} prestation${pretsAVerifier > 1 ? "s" : ""} prête${pretsAVerifier > 1 ? "s" : ""} à être préparée${pretsAVerifier > 1 ? "s" : ""}.`
        : "Aucun dossier prêt pour le moment.",
      cta: "Voir la prestation",
      onClick: () => onScrollTo("prestations"),
    },
    {
      icon: FileDown,
      title: "Fiche Cachet AIME",
      body: ficheTarget
        ? `Résumé PDF prêt pour ${ficheTarget.employer || "votre prestation"}.`
        : "Aucune prestation disponible.",
      cta: "Générer la fiche PDF",
      onClick: () => onGenerateFiche?.(ficheTarget),
      disabled: !ficheTarget,
    },
  ];

  return (
    <section id="documents" className="border-b border-white/10">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-12 md:py-16">
        <h2 className="text-[11px] tracking-[0.25em] font-medium text-zinc-500 uppercase mb-8">À traiter aujourd'hui</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {cards.map((c) => (
            <div key={c.title} className="group">
              <div className="w-11 h-11 rounded-full bg-aime-red text-white flex items-center justify-center mb-5">
                <c.icon className="w-5 h-5" />
              </div>
              <h3 className="text-white font-medium text-base mb-2">{c.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-4">{c.body}</p>
              <button
                onClick={c.onClick}
                disabled={c.disabled}
                className="group/btn inline-flex items-center gap-1.5 text-white text-sm font-medium hover:text-aime-red transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-white"
              >
                {c.cta}
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}