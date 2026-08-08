import React from "react";
import { Link } from "react-router-dom";
import MarketingShell from "@/components/aime/MarketingShell";

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

/** @type {Array<[string, string, string, string[]]>} */
const UNIVERSE_ROWS = [
  ["Zeus", "Orchestration & Budget", "Le roi des dieux pilote le cockpit financier et stratégique.", ["Calculateur de budget intelligent", "Suivi des échéances et relances", "Tableau de bord décisionnel"]],
  ["Athéna", "Planification & Logistique", "La déesse de la sagesse et de la stratégie organise le temps.", ["Rétroplanning interactif", "Gestion des tâches intelligentes", "Diagramme de Gantt collaboratif"]],
  ["Aphrodite", "Style & Esthétique", "La déesse de la beauté sublime chaque détail visuel.", ["Moodboards interactifs", "Directives de style pour invités", "Palette de couleurs harmonisée"]],
  ["Apollon", "Musique & Scénographie", "Le dieu des arts orchestre la lumière et l'ambiance sonore.", ["Playlists partagées", "Coordination des prestataires artistiques", "Plan d'éclairage de salle"]],
  ["Hermès", "Communications & Invitations", "Le messager s'occupe de faire circuler les informations.", ["Envoi automatisé des faire-part", "Suivi des ouvertures d'emails", "Chat direct mariés-invités"]],
  ["Arès", "Négociations & Contrats", "Le dieu de l'action sécurise vos engagements prestataires.", ["Signature électronique", "Validation juridique des devis", "Coffre-fort à factures"]],
  ["Déméter", "Fleurs & Décoration végétale", "La déesse des moissons orchestre la beauté naturelle.", ["Inventaire floral", "Partage d'inspirations herboristes", "Plan d'implantation des espaces verts"]],
  ["Artémis", "Photographie & Vidéo", "La déesse de la chasse capture chaque instant fugace.", ["Brief de shooting personnalisé", "Partage de galerie privée", "Collecte photo via QR code invités"]],
  ["Héphaïstos", "Artisanat & Alliances", "Le dieu forgeron matérialise les symboles de votre union.", ["Suivi de création sur-mesure", "Gestion de la liste de mariage", "Recommandations d'artisans"]],
  ["Dionysos", "Gastronomie, Vins & Festivités", "Le dieu de la fête veille sur le banquet et l'allégresse.", ["Choix des menus & accords mets-vins", "Gestion du bar et spiritueux", "Coordination des animations nocturnes"]],
  ["Poséidon", "Cérémonie & Expérience", "Le souverain des eaux gère l'accueil et le flux.", ["Plan de table dynamique en 3D", "Gestion des flux de transport", "Plan d'accès interactifs"]],
  ["Hestia", "Hébergement & Bien-être", "La gardienne du foyer veille sur le confort des invités.", ["Attribution des chambres", "Suivi des arrivées & check-in", "Attention bien-être & cadeaux d'accueil"]],
];

const MODE_CARDS = [
  ["Mariés", "Accès total, vision d'ensemble, pilotage financier et scénographie."],
  ["Invités", "Infos essentielles, déclaration des présences, RSVP & hébergement."],
  ["Prestataires", "Portail mission dédié, contrats, livrables et rétroplanning technique."],
  ["Planner", "Cockpit multi-mariages, orchestration de plusieurs projets en simultané."],
];

function UniversePill({ label }) {
  return <span className="inline-flex rounded-full bg-[var(--color-warm-white)] px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-[#c1ab83]">{label}</span>;
}

export default function ModeEmploiPage() {
  return (
    <MarketingShell>
      <section className="px-6 md:px-10 lg:px-16 py-18 md:py-24 text-center">
        <div className="text-[12px] uppercase tracking-[0.18em] text-[#b59c73]">Le guide divin</div>
        <h1 className="mt-8 font-display text-[3.8rem] md:text-[5.6rem] leading-[0.94] text-zinc-950">Mode d'emploi</h1>
        <p className="mt-6 max-w-4xl mx-auto text-[20px] md:text-[22px] text-zinc-600 leading-relaxed">Découvrez comment AIME Wedding organise votre mariage en 12 univers connectés</p>
      </section>

      <section className="px-6 md:px-10 lg:px-16 pb-18">
        <div className="mx-auto max-w-[980px] rounded-[28px] border border-[#c9b48e] bg-[#f6f0e4] p-8 md:p-10 text-center shadow-[0_10px_28px_rgba(12,12,12,0.03)]">
          <h2 className="font-display text-[2.7rem] text-zinc-950">Le concept en 30 secondes</h2>
          <p className="mt-6 text-[19px] text-zinc-600 leading-relaxed">AIME Wedding rassemble tout votre mariage au même endroit. Chaque domaine est confié à un dieu de l'Olympe — un univers dédié avec ses outils, ses données et sa logique propre. Vous naviguez par intention, pas par menu.</p>
        </div>
      </section>

      <section className="px-6 md:px-10 lg:px-16 pb-18">
        <h2 className="font-display text-[3.2rem] md:text-[4.2rem] text-zinc-950">Comment ça marche</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.number} className="rounded-[24px] border border-black/8 bg-white p-8 shadow-[0_10px_28px_rgba(12,12,12,0.03)] min-h-[280px]">
              <div className="text-[3rem] font-display text-[#c8ae82]">{step.number}</div>
              <div className="mt-6 font-display text-[2rem] text-zinc-950">{step.title}</div>
              <div className="mt-4 text-[17px] text-zinc-600 leading-relaxed">{step.text}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="univers" className="px-6 md:px-10 lg:px-16 py-16 border-t border-black/6">
        <h2 className="font-display text-[3.2rem] md:text-[4.2rem] text-zinc-950">Les 12 univers de l'Olympe</h2>
        <p className="mt-4 text-[18px] text-zinc-600">Chaque divinité gouverne un aspect crucial de votre union avec rigueur et clarté.</p>
        <div className="mt-10 space-y-5">
          {UNIVERSE_ROWS.map((entry) => {
            const [label, title, text, bullets] = entry;
            return (
              <div key={label} className="rounded-[24px] border border-black/8 bg-white px-6 py-6 shadow-[0_10px_28px_rgba(12,12,12,0.03)] flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="lg:min-w-0 lg:flex-1">
                  <div className="flex items-center gap-4 flex-wrap">
                    <UniversePill label={label} />
                    <h3 className="font-display text-[2rem] text-zinc-950">{title}</h3>
                  </div>
                  <p className="mt-4 text-[17px] text-zinc-600 leading-relaxed">{text}</p>
                  <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm text-zinc-500">
                    {bullets.map((bullet) => <span key={bullet}>• {bullet}</span>)}
                  </div>
                </div>
                <Link to="/mode-emploi" className="text-[17px] text-[#b59c73] hover:text-zinc-950 whitespace-nowrap">Explorer l'univers →</Link>
              </div>
            );
          })}
        </div>
      </section>

      <section className="px-6 md:px-10 lg:px-16 py-18 bg-[#f6f0e4] border-t border-black/6 text-center">
        <h2 className="font-display text-[3rem] md:text-[4rem] text-zinc-950">Quatre visions, une seule plateforme</h2>
        <p className="mt-5 max-w-4xl mx-auto text-[18px] text-zinc-600 leading-relaxed">AIME Wedding adapte son interface selon qui vous êtes, garantissant la confidentialité et la pertinence des informations.</p>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4 text-left">
          {MODE_CARDS.map(([title, text]) => (
            <div key={title} className="rounded-[24px] border border-black/8 bg-white p-8 shadow-[0_10px_28px_rgba(12,12,12,0.03)] min-h-[240px]">
              <div className="font-display text-[2rem] text-[#c8ae82]">{title}</div>
              <div className="mt-6 text-[17px] text-zinc-600 leading-relaxed">{text}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-10 lg:px-16 py-18 bg-[#111111] text-white text-center">
        <h2 className="font-display text-[3rem] md:text-[4rem]">Besoin d'aide ?</h2>
        <p className="mt-5 max-w-3xl mx-auto text-[18px] text-white/70 leading-relaxed">Nos équipes et ressources sont à votre entière disposition pour répondre à toutes vos interrogations.</p>
        <Link to="/aide" className="mt-10 inline-flex rounded-full bg-white px-6 py-4 text-sm uppercase tracking-[0.08em] text-black hover:bg-zinc-100">Consulter l'aide →</Link>
      </section>
    </MarketingShell>
  );
}
