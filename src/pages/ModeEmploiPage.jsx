import React from "react";
import { Link } from "react-router-dom";
import MarketingShell from "@/components/aime/MarketingShell";
import { UNIVERSE_GRADIENTS, UNIVERSES } from "@/lib/aimeUniverses";

const STEPS = [
  {
    number: "01",
    title: "Choisissez votre rôle",
    text: "Mariés, invité, prestataire ou planner — chaque profil a sa propre vision du mariage. Vous ne voyez que ce qui vous concerne.",
  },
  {
    number: "02",
    title: "Naviguez par intention",
    text: "Le Smart Menu regroupe les 12 dieux en clusters fonctionnels : Piloter, Créer, Organiser, Communiquer. Pas de liste interminable — juste vos besoins.",
  },
  {
    number: "03",
    title: "Tout est connecté",
    text: "Chaque information a une maison. Les données circulent entre les univers sans duplication. Un RSVP mis à jour se propage au plan de table et au budget automatiquement.",
  },
];

const MODE_CARDS = [
  { title: "Mariés", text: "Accès total, vision d'ensemble, pilotage financier et scénographie." },
  { title: "Invités", text: "Infos essentielles, déclaration des présences, RSVP & hébergement." },
  { title: "Prestataires", text: "Portail mission dédié, contrats, livrables et rétroplanning technique." },
  { title: "Planner", text: "Cockpit multi-mariages, orchestration de plusieurs projets en simultané." },
];

export default function ModeEmploiPage() {
  return (
    <MarketingShell>
      <section className="px-6 md:px-10 lg:px-16 py-16 md:py-24 text-center">
        <div className="text-[12px] uppercase tracking-[0.18em] text-[#b59c73]">Le guide divin</div>
        <h1 className="mt-8 font-display text-[3.6rem] md:text-[5.4rem] leading-[0.94] text-zinc-950">Mode d'emploi</h1>
        <p className="mt-6 max-w-4xl mx-auto text-[19px] md:text-[22px] text-zinc-600 leading-relaxed">
          Découvrez comment AIME Wedding organise votre mariage en 12 univers connectés
        </p>
      </section>

      <section className="px-6 md:px-10 lg:px-16 pb-16 md:pb-20">
        <div className="mx-auto max-w-[980px] rounded-[28px] border border-[#c9b48e] bg-[#f6f0e4] p-8 md:p-10 text-center">
          <h2 className="font-display text-[2.6rem] text-zinc-950">Le concept en 30 secondes</h2>
          <p className="mt-6 text-[18px] text-zinc-600 leading-relaxed">
            AIME Wedding rassemble tout votre mariage au même endroit. Chaque domaine est confié à un dieu de l'Olympe — un univers dédié avec ses outils, ses données et sa logique propre. Vous naviguez par intention, pas par menu.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-10 lg:px-16 pb-14">
        <h2 className="font-display text-[3rem] md:text-[4rem] text-zinc-950">Comment ça marche</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.number} className="rounded-[24px] border border-black/8 bg-white p-8 shadow-[0_10px_28px_rgba(12,12,12,0.03)]">
              <div className="text-[3rem] font-display text-[#c8ae82]">{step.number}</div>
              <div className="mt-6 font-display text-[2rem] text-zinc-950">{step.title}</div>
              <div className="mt-4 text-[17px] text-zinc-600 leading-relaxed">{step.text}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="univers" className="px-6 md:px-10 lg:px-16 py-14 border-t border-black/6">
        <h2 className="font-display text-[3rem] md:text-[4rem] text-zinc-950">Les 12 univers de l'Olympe</h2>
        <p className="mt-4 text-[18px] text-zinc-600">Chaque divinité gouverne un aspect crucial de votre union avec rigueur et clarté.</p>
        <div className="mt-10 space-y-5">
          {UNIVERSES.map((universe) => (
            <div key={universe.id} className="rounded-[24px] border border-black/8 bg-white px-6 py-6 shadow-[0_10px_28px_rgba(12,12,12,0.03)] flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="lg:min-w-0 lg:flex-1">
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="inline-flex rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-white" style={{ background: UNIVERSE_GRADIENTS[universe.id] }}>{universe.label}</span>
                  <h3 className="font-display text-[2rem] text-zinc-950">{universe.title}</h3>
                </div>
                <p className="mt-4 text-[17px] text-zinc-600 leading-relaxed">{universe.visualHook}</p>
                <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm text-zinc-500">
                  {universe.columns.map((column) => <span key={column.title}>• {column.text}</span>)}
                </div>
              </div>
              <Link to={universe.route} className="text-[17px] text-[#b59c73] hover:text-zinc-950 whitespace-nowrap">Explorer l'univers →</Link>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-10 lg:px-16 py-16 bg-[#f6f0e4] border-t border-black/6 text-center">
        <h2 className="font-display text-[3rem] md:text-[4rem] text-zinc-950">Quatre visions, une seule plateforme</h2>
        <p className="mt-5 max-w-4xl mx-auto text-[18px] text-zinc-600 leading-relaxed">AIME Wedding adapte son interface selon qui vous êtes, garantissant la confidentialité et la pertinence des informations.</p>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4 text-left">
          {MODE_CARDS.map((card) => (
            <div key={card.title} className="rounded-[24px] border border-black/8 bg-white p-8 shadow-[0_10px_28px_rgba(12,12,12,0.03)]">
              <div className="font-display text-[2rem] text-[#c8ae82]">{card.title}</div>
              <div className="mt-6 text-[17px] text-zinc-600 leading-relaxed">{card.text}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-10 lg:px-16 py-16 bg-[#111111] text-white text-center">
        <h2 className="font-display text-[3rem] md:text-[4rem]">Besoin d'aide ?</h2>
        <p className="mt-5 max-w-3xl mx-auto text-[18px] text-white/70 leading-relaxed">Nos équipes et ressources sont à votre entière disposition pour répondre à toutes vos interrogations.</p>
        <Link to="/aide" className="mt-10 inline-flex rounded-full bg-white px-6 py-4 text-sm uppercase tracking-[0.08em] text-black hover:bg-zinc-100">Consulter l'aide →</Link>
      </section>
    </MarketingShell>
  );
}
