import React from "react";
import MarketingShell from "@/components/aime/MarketingShell";

const VALUES = [
  {
    title: "Une info, une maison",
    text: "Pas de duplication inutile de données. Chaque élément (adresse, régime alimentaire, prix d'un prestataire) vit à un seul endroit et se propage intelligemment.",
  },
  {
    title: "Le luxe est dans la clarté",
    text: "Pas de surcharge cognitive ni de boutons superflus. Sobriété, lisibilité parfaite, respiration visuelle de chaque interface de pilotage.",
  },
  {
    title: "Chaque profil compte",
    text: "Mariés, invités, prestataires, planners : 4 visions différentes d'un seul et même système pour s'assurer que chacun navigue avec plaisir.",
  },
];

export default function AboutAimePage() {
  return (
    <MarketingShell ctaLabel="Planifier" ctaTo="/onboarding">
      <section className="bg-[#111111] text-white px-6 md:px-10 lg:px-16 py-20 md:py-28 text-center">
        <div className="text-[12px] uppercase tracking-[0.18em] text-[#b59c73]">L'origine du projet</div>
        <h1 className="mt-8 font-display text-[3.8rem] md:text-[5.7rem] leading-[0.94]">À propos d'AIME Wedding</h1>
        <p className="mt-6 text-[22px] text-white/84">Le mariage mérite mieux qu'un tableur.</p>
      </section>

      <section className="px-6 md:px-10 lg:px-16 py-16 md:py-20 grid gap-10 lg:grid-cols-[0.92fr_1.08fr] items-start">
        <div>
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#b59c73]">Notre vision</div>
          <h2 className="mt-6 font-display text-[3rem] md:text-[4.2rem] leading-[0.98] text-zinc-950">Harmoniser la complexité d'un événement d'une vie</h2>
          <p className="mt-8 text-[18px] text-zinc-600 leading-relaxed">AIME Wedding est né d'un constat simple : organiser un mariage mobilise des dizaines de sujets qui vivent dans des outils éparpillés. Nous avons créé une plateforme où chaque information a une maison, chaque acteur a sa vision, et chaque décision est traçable.</p>
        </div>
        <img src="/landing/hero-aime-wedding.jpg" alt="Vision AIME Wedding" className="w-full rounded-[28px] object-cover shadow-[0_16px_40px_rgba(12,12,12,0.08)]" />
      </section>

      <section className="px-6 md:px-10 lg:px-16 py-18 bg-[#f6f0e4] border-t border-black/6 text-center">
        <h2 className="font-display text-[3rem] md:text-[4rem] text-zinc-950">Pourquoi des dieux grecs ?</h2>
        <p className="mt-6 max-w-5xl mx-auto text-[18px] text-zinc-600 leading-relaxed">Les 12 dieux de l'Olympe ne sont pas un gadget thématique. C'est un système mnémotechnique qui rend une architecture complexe (12 modules × 4 profils) intuitive et mémorable. Chaque dieu incarne un domaine fonctionnel — de Zeus (orchestration) à Hestia (invités).</p>
        <div className="mt-12 grid grid-cols-3 md:grid-cols-6 xl:grid-cols-12 gap-5">
          {["Zeus","Athéna","Aphrodite","Apollon","Hermès","Arès","Déméter","Artémis","Héphaïstos","Dionysos","Poséidon","Hestia"].map((name) => (
            <div key={name} className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full border border-[#d5bf98] flex items-center justify-center text-[#b59c73] font-display text-[1.6rem]">{name[0]}</div>
              <div className="mt-4 text-sm text-zinc-700">{name}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-10 lg:px-16 py-16 md:py-20">
        <h2 className="font-display text-[3rem] md:text-[4rem] text-zinc-950">Nos Valeurs Fondatrices</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {VALUES.map((item) => (
            <div key={item.title} className="rounded-[24px] border border-black/8 bg-white p-8 shadow-[0_10px_28px_rgba(12,12,12,0.03)] min-h-[260px]">
              <div className="font-display text-[2rem] text-[#c8ae82]">{item.title}</div>
              <div className="mt-6 text-[17px] text-zinc-600 leading-relaxed">{item.text}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-10 lg:px-16 py-18 bg-[#f6f0e4] border-t border-black/6">
        <h2 className="font-display text-[3rem] md:text-[4rem] text-zinc-950 text-center">L'esprit derrière la plateforme</h2>
        <div className="mt-12 max-w-[1180px] mx-auto rounded-[28px] border border-black/8 bg-white p-8 md:p-10 shadow-[0_12px_30px_rgba(12,12,12,0.03)] grid gap-8 lg:grid-cols-[320px_1fr] items-center">
          <img src="/landing/athena.jpg" alt="Matthieu Lecointre" className="w-[240px] h-[240px] md:w-[280px] md:h-[280px] rounded-full object-cover mx-auto" />
          <div>
            <div className="font-display text-[3rem] leading-[0.98] text-zinc-950">Matthieu Lecointre (Matt Mez)</div>
            <div className="mt-3 text-[12px] uppercase tracking-[0.16em] text-[#b59c73]">Créateur & architecte produit</div>
            <p className="mt-6 text-[18px] text-zinc-600 leading-relaxed">Passionné par l'art du design et de l'architecture d'information, j'ai conçu AIME Wedding pour apporter la rigueur et la poésie des systèmes anciens à la complexité logistique des mariages modernes. La méthodologie Olympe garantit l'alignement parfait de tous les acteurs.</p>
            <a href="https://ripplepatent-i4fzyzub.manus.space" target="_blank" rel="noreferrer" className="mt-6 inline-flex rounded-full border border-black/12 bg-white px-6 py-4 text-sm text-zinc-700 hover:bg-black/[0.03]">Découvrir le projet Ripple Patent →</a>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 lg:px-16 py-18 text-center">
        <h2 className="font-display text-[3rem] md:text-[4rem] text-zinc-950 max-w-5xl mx-auto">Envie de collaborer, de nous rejoindre, ou simplement de discuter ?</h2>
        <div className="mt-8 text-[2.2rem] font-display text-[#b59c73]">hello@aimewedding.com</div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a href="mailto:hello@aimewedding.com" className="rounded-full bg-black px-6 py-4 text-sm uppercase tracking-[0.08em] text-white hover:bg-zinc-800">Nous écrire →</a>
          <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" className="rounded-full border border-black/14 bg-white px-6 py-4 text-sm uppercase tracking-[0.08em] text-zinc-800 hover:bg-black/[0.03]">LinkedIn →</a>
        </div>
      </section>
    </MarketingShell>
  );
}
