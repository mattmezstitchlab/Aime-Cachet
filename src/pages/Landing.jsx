import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import {
  getVendorMarketplace,
  readWeddingState,
  VENDOR_TAXONOMY,
} from "@/lib/aimeWeddingCore";

const HERO_BG = "/landing/hero-aime-wedding.jpg";

const ENTRY_POINTS = [
  {
    id: "couple",
    title: "Couple",
    cta: "Créer mon mariage",
    href: "/setup",
    image: "/landing/hestia.jpg",
  },
  {
    id: "prestataire",
    title: "Prestataire",
    cta: "Rejoindre le registre",
    href: "/prestataires",
    image: "/landing/apollon.jpg",
  },
  {
    id: "invite",
    title: "Invité",
    cta: "Accéder à un mariage",
    href: "/espace-invites",
    image: "/landing/artemis.jpg",
  },
  {
    id: "planner",
    title: "Planner",
    cta: "Rejoindre le programme planner",
    href: "/point-zero?role=planner",
    image: "/landing/athena.jpg",
  },
];

const VENDOR_VISUALS = {
  planner_maison: "/landing/athena.jpg",
  venue_lys: "/landing/artemis.jpg",
  photo_sillage: "/landing/apollon.jpg",
  catering_aurore: "/landing/demeter.jpg",
  music_sonore: "/landing/dionysos.jpg",
  flowers_ligne: "/landing/aphrodite.jpg",
  transport_nuit: "/landing/hermes.jpg",
  beauty_aube: "/landing/hestia.jpg",
};

const PILLAR_BADGE_STYLES = {
  zeus: "linear-gradient(135deg, #7C6CFF 0%, #4A56C6 100%)",
  poseidon: "linear-gradient(135deg, #4FCBFF 0%, #3F7FD2 100%)",
  athena: "linear-gradient(135deg, #D6DBFF 0%, #8D94CC 100%)",
  aphrodite: "linear-gradient(135deg, #F4B6C8 0%, #B989B7 100%)",
  apollon: "linear-gradient(135deg, #F7C39A 0%, #C98663 100%)",
  hermes: "linear-gradient(135deg, #55E6D5 0%, #4A9FB0 100%)",
  ares: "linear-gradient(135deg, #9FA9C9 0%, #586487 100%)",
  demeter: "linear-gradient(135deg, #7AE3C2 0%, #63AB95 100%)",
  artemis: "linear-gradient(135deg, #6C5AE8 0%, #41339E 100%)",
  hephaistos: "linear-gradient(135deg, #F29B5C 0%, #C4664A 100%)",
  dionysos: "linear-gradient(135deg, #D85AE5 0%, #8B439C 100%)",
  hestia: "linear-gradient(135deg, #E9C0BA 0%, #C9939E 100%)",
};

const PILLARS = [
  {
    id: "zeus",
    number: "01",
    myth: "Zeus",
    title: "Orchestration globale",
    visualHook: "Le flux souverain qui relie tous les rôles du mariage sans jamais casser la lecture d'ensemble.",
    columns: [
      {
        title: "Pour les mariés",
        text: "Gardez la vision d’ensemble sans porter le bruit opérationnel du mariage.",
      },
      {
        title: "Pour le planner",
        text: "Centralisez validations, rôles, timings et décisions sensibles dans la même vue.",
      },
      {
        title: "Ce que cela tient",
        text: "Budget, documents, diffusion et jour J restent alignés sans perte d’information.",
      },
    ],
    href: "/univers/zeus",
    cta: "Ouvrir Zeus",
    image: "/landing/zeus.jpg",
  },
  {
    id: "poseidon",
    number: "02",
    myth: "Poséidon",
    title: "Son, lumière & ambiance",
    visualHook: "L'immersion émotionnelle d'un mariage ne se pilote pas à l'instinct : elle se prépare comme une vague parfaitement tenue.",
    columns: [
      {
        title: "Pour les mariés",
        text: "L’ambiance se prépare par séquences, pas par intuition de dernière minute.",
      },
      {
        title: "Pour les partenaires",
        text: "DJ, son, lumière et timing lisent tous le même déroulé partagé.",
      },
      {
        title: "Ce que cela règle",
        text: "Cocktail, dîner, entrée, ouverture de bal et soirée gardent le bon rythme.",
      },
    ],
    href: "/univers/poseidon",
    cta: "Ouvrir Poséidon",
    image: "/landing/poseidon.jpg",
  },
  {
    id: "athena",
    number: "03",
    myth: "Athéna",
    title: "Stratégie & automatisation",
    visualHook: "La vraie intelligence d'un mariage se joue dans l'anticipation, pas dans l'accumulation de formulaires.",
    columns: [
      {
        title: "Pour les mariés",
        text: "Vous voyez ce qui mérite une décision, pas tout le bruit de préparation.",
      },
      {
        title: "Pour le planner",
        text: "Rappels, alertes et dépendances se lisent avant de devenir des urgences.",
      },
      {
        title: "Ce que cela anticipe",
        text: "Météo, accès, retards, invités et arbitrages sensibles sont remontés plus tôt.",
      },
    ],
    href: "/univers/athena",
    cta: "Ouvrir Athéna",
    image: "/landing/athena.jpg",
  },
  {
    id: "aphrodite",
    number: "04",
    myth: "Aphrodite",
    title: "Scénographie & esthétique",
    visualHook: "La beauté du mariage devient plus forte quand elle est cadrée, transmise et relue comme un langage partagé.",
    columns: [
      {
        title: "Pour les mariés",
        text: "L’esthétique reste tenue sans se perdre entre captures, messages et validations.",
      },
      {
        title: "Pour les partenaires",
        text: "Fleurs, déco, scénographie et implantation partagent la même direction visuelle.",
      },
      {
        title: "Ce que cela cadre",
        text: "Ambiance, matières, palette et circulation visuelle du lieu restent cohérentes.",
      },
    ],
    href: "/univers/aphrodite",
    cta: "Ouvrir Aphrodite",
    image: "/landing/aphrodite.jpg",
  },
  {
    id: "apollon",
    number: "05",
    myth: "Apollon",
    title: "Photo, vidéo & souvenirs",
    visualHook: "La mémoire du mariage dépend d'une lumière tenue, d'un rythme juste et de séquences réellement respectées.",
    columns: [
      {
        title: "Pour les mariés",
        text: "Les souvenirs gagnent en justesse quand les bons moments sont protégés.",
      },
      {
        title: "Pour les partenaires",
        text: "Photo et vidéo savent quand intervenir, où se placer et quoi couvrir.",
      },
      {
        title: "Ce que cela préserve",
        text: "Fenêtres de lumière, transitions, captation et galerie finale restent bien tenues.",
      },
    ],
    href: "/univers/apollon",
    cta: "Ouvrir Apollon",
    image: "/landing/apollon.jpg",
  },
  {
    id: "hermes",
    number: "06",
    myth: "Hermès",
    title: "Communication & diffusion",
    visualHook: "Un mariage se fragilise quand l'information circule mal. Hermès raconte la vitesse, mais surtout la justesse du message.",
    columns: [
      {
        title: "Pour les mariés",
        text: "Vous recevez les bonnes informations au bon moment, sans surcharge inutile.",
      },
      {
        title: "Pour les partenaires",
        text: "Les échanges restent clairs, tracés et reliés aux pièces réellement utiles.",
      },
      {
        title: "Ce que cela diffuse",
        text: "Messages, relances, plans B et documents partagés partent au bon public.",
      },
    ],
    href: "/univers/hermes",
    cta: "Ouvrir Hermès",
    image: "/landing/hermes.jpg",
  },
  {
    id: "ares",
    number: "07",
    myth: "Arès",
    title: "Régie terrain & exécution",
    visualHook: "Le terrain n'a rien de poétique quand il déraille. Il doit être précis, rapide et maintenu sans panique.",
    columns: [
      {
        title: "Pour les mariés",
        text: "Le terrain reste invisible quand il fonctionne vraiment bien.",
      },
      {
        title: "Pour les partenaires",
        text: "Montage, circulation, mobilier et incidents se pilotent sans flottement.",
      },
      {
        title: "Ce que cela exécute",
        text: "Implantation, accès, chronologie et check final restent lisibles sous pression.",
      },
    ],
    href: "/univers/ares",
    cta: "Ouvrir Arès",
    image: "/landing/ares.jpg",
  },
  {
    id: "demeter",
    number: "08",
    myth: "Déméter",
    title: "Table, service & ressources",
    visualHook: "Le dîner, les régimes, le service et les arbitrages budgétaires forment un même système, pas des sujets séparés.",
    columns: [
      {
        title: "Pour les mariés",
        text: "Le dîner se décide avec goût, mais aussi avec cohérence réelle.",
      },
      {
        title: "Pour les partenaires",
        text: "Traiteur, régimes, tables et volumes parlent le même langage.",
      },
      {
        title: "Ce que cela tient",
        text: "Menus, allergies, service, budget repas et rythme du dîner restent alignés.",
      },
    ],
    href: "/univers/demeter",
    cta: "Ouvrir Déméter",
    image: "/landing/demeter.jpg",
  },
  {
    id: "artemis",
    number: "09",
    myth: "Artémis",
    title: "Lieux & espaces",
    visualHook: "Le lieu n'est pas un décor fixe. C'est une matière vivante : accès, météo, flux, accueil, extérieur, repli.",
    columns: [
      {
        title: "Pour les mariés",
        text: "Le lieu se choisit pour son usage réel, pas seulement pour sa photo.",
      },
      {
        title: "Pour les partenaires",
        text: "Capacité, accès, repli météo et logistique se lisent dès la recherche.",
      },
      {
        title: "Ce que cela éclaire",
        text: "Distance, disponibilité, style, circulation et plan B sont visibles plus tôt.",
      },
    ],
    href: "/univers/artemis",
    cta: "Ouvrir Artémis",
    image: "/landing/artemis.jpg",
  },
  {
    id: "hephaistos",
    number: "10",
    myth: "Héphaïstos",
    title: "Outils & supports sur-mesure",
    visualHook: "Quand le mariage demande une fiche, un export, une feuille ou un support spécifique, il faut pouvoir le forger proprement.",
    columns: [
      {
        title: "Pour les mariés",
        text: "Les supports restent beaux, lisibles et prêts au bon moment.",
      },
      {
        title: "Pour les partenaires",
        text: "Papeterie, exports et feuilles de rôle se fabriquent sans friction.",
      },
      {
        title: "Ce que cela produit",
        text: "Faire-part, menus, plans, PDF et rendus finaux sortent au bon format.",
      },
    ],
    href: "/univers/hephaistos",
    cta: "Ouvrir Héphaïstos",
    image: "/landing/hephaistos.jpg",
  },
  {
    id: "dionysos",
    number: "11",
    myth: "Dionysos",
    title: "Fête & soirée",
    visualHook: "La nuit réussie d'un mariage est le résultat d'un enchaînement tenu, pas d'un simple bouton fête.",
    columns: [
      {
        title: "Pour les mariés",
        text: "La soirée garde son intensité sans casser le déroulé de la journée.",
      },
      {
        title: "Pour les partenaires",
        text: "Animations, bar, ouverture et after se calent sur le vrai tempo.",
      },
      {
        title: "Ce que cela amplifie",
        text: "Énergie, programmation, temps forts et fin de soirée restent cohérents.",
      },
    ],
    href: "/univers/dionysos",
    cta: "Ouvrir Dionysos",
    image: "/landing/dionysos.jpg",
  },
  {
    id: "hestia",
    number: "12",
    myth: "Hestia",
    title: "Accueil, famille & transmission",
    visualHook: "Un mariage reste un foyer temporaire : il faut accueillir, rassurer, relier et transmettre l'expérience à toutes les générations.",
    columns: [
      {
        title: "Pour les mariés",
        text: "L’accueil reste doux, lisible et humain pour toutes les générations.",
      },
      {
        title: "Pour les proches",
        text: "Famille, témoins, enfants et aînés trouvent leur place sans flottement.",
      },
      {
        title: "Ce que cela protège",
        text: "RSVP, tables, foyers, hébergements et lien humain du mariage restent tenus.",
      },
    ],
    href: "/univers/hestia",
    cta: "Ouvrir Hestia",
    image: "/landing/hestia.jpg",
  },
];

function fmtMoney(value) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function EntryTile({ item }) {
  return (
    <Link
      to={item.href}
      className="group relative aspect-square overflow-hidden rounded-[28px] bg-[var(--color-black)] text-white shadow-[0_20px_60px_rgba(0,0,0,0.12)]"
    >
      <img src={item.image} alt={item.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.18),rgba(0,0,0,0.62))]" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_28%)]" aria-hidden="true" />

      <div className="relative z-10 flex h-full flex-col items-center justify-between p-5 md:p-6 text-center">
        <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-white/74">
          Accès
        </span>

        <div className="px-3">
          <div className="font-display text-[2rem] sm:text-[2.4rem] lg:text-[2.8rem] leading-[0.95] tracking-[var(--tracking-display)]">
            {item.title}
          </div>
        </div>

        <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm text-black shadow-[0_10px_24px_rgba(0,0,0,0.18)] transition-transform group-hover:-translate-y-0.5">
          {item.cta}
          <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
}

function FilterChip({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm transition-colors ${active ? "bg-black text-white" : "border border-black/8 bg-white text-zinc-700 hover:bg-black/[0.03]"}`}
    >
      {children}
    </button>
  );
}

function RegistryCard({ vendor }) {
  const categoryLabel = VENDOR_TAXONOMY.find((item) => item.id === vendor.category)?.label || vendor.category;
  const image = VENDOR_VISUALS[vendor.id] || HERO_BG;

  return (
    <Link
      to={`/prestataires/${vendor.id}`}
      className="overflow-hidden rounded-[26px] border border-black/8 bg-white shadow-[0_12px_34px_rgba(0,0,0,0.06)] min-w-[248px] max-w-[248px] shrink-0 transition-transform hover:-translate-y-0.5"
    >
      <div className="relative h-40 overflow-hidden bg-[var(--color-warm-gray-100)]">
        <img src={image} alt={vendor.name} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.22))]" aria-hidden="true" />
        <div className="absolute left-3 top-3 rounded-full bg-white/92 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-zinc-600 backdrop-blur-xl">
          {categoryLabel}
        </div>
      </div>

      <div className="p-4 md:p-5 text-zinc-950">
        <h3 className="text-[1.25rem] font-semibold leading-[1.1]">{vendor.name}</h3>
        <div className="mt-2 text-sm text-zinc-500">{vendor.city}</div>
        <div className="mt-3 text-sm text-zinc-800">À partir de {fmtMoney(vendor.priceFrom)}</div>
      </div>
    </Link>
  );
}

function EditorialColumn({ item }) {
  return (
    <div className="py-6 md:py-8 md:px-6 first:md:pl-0 last:md:pr-0">
      <div className="text-[11px] md:text-[12px] uppercase tracking-[0.16em] text-zinc-500 mb-4">
        {item.title}
      </div>
      <p className="max-w-[28ch] text-[15px] md:text-[18px] leading-[1.8] text-zinc-700">
        {item.text}
      </p>
    </div>
  );
}

function PillarSection({ pillar }) {
  const badgeBackground = PILLAR_BADGE_STYLES[pillar.id] || "linear-gradient(135deg, #a1a1aa 0%, #71717a 100%)";

  return (
    <section id={pillar.id} className="scroll-mt-28">
      <div className="rounded-[38px] overflow-hidden border border-black/8 bg-[var(--color-black)] shadow-[0_24px_80px_rgba(0,0,0,0.12)]">
        <div className="relative min-h-[62vh] md:min-h-[68vh]">
          <img
            src={pillar.image}
            alt={`${pillar.myth} · ${pillar.title}`}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.72))]" aria-hidden="true" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_26%)]" aria-hidden="true" />

          <div className="relative z-10 flex min-h-[62vh] md:min-h-[68vh] flex-col justify-between p-6 md:p-8 lg:p-10 text-white">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div
                className="inline-flex items-center rounded-full px-4 py-2 text-[15px] font-semibold italic text-white shadow-[0_14px_30px_rgba(0,0,0,0.18)]"
                style={{ background: badgeBackground }}
              >
                {pillar.myth}
              </div>
              <Link to={pillar.href} className="rounded-full bg-white px-4 py-2 text-sm text-black inline-flex items-center gap-2 shadow-[0_12px_28px_rgba(0,0,0,0.18)]">
                {pillar.cta}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="max-w-4xl">
              <h2 className="font-display text-[2.8rem] sm:text-[4rem] lg:text-[5.2rem] leading-[0.94] tracking-[var(--tracking-display)] text-white">
                {pillar.title}
              </h2>
              <p className="mt-5 max-w-2xl text-base md:text-lg text-white/70 leading-[var(--leading-body)]">
                {pillar.visualHook}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white px-6 md:px-8 lg:px-10 text-zinc-950">
          <div className="grid md:grid-cols-3 md:divide-x divide-black/8">
            {pillar.columns.map((item) => (
              <EditorialColumn key={item.title} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Landing() {
  const [wedding] = useState(() => readWeddingState());
  const [taxonomy, setTaxonomy] = useState("all");

  const vendors = useMemo(() => getVendorMarketplace(wedding, taxonomy), [wedding, taxonomy]);
  const marqueeVendors = vendors.length ? [...vendors, ...vendors] : [];

  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] text-[var(--color-text-primary)]">
      <main>
        <section id="hero" className="relative -mt-20 md:-mt-24 min-h-[100svh] scroll-mt-28 overflow-hidden bg-[var(--color-black)] text-white">
          <img src={HERO_BG} alt="AIME Wedding" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.62))]" aria-hidden="true" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_24%)]" aria-hidden="true" />

          <div className="relative z-10 min-h-[100svh] flex items-center justify-center px-5 md:px-8 pt-24 md:pt-28 pb-16 text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="font-display text-[3rem] sm:text-[4.8rem] lg:text-[7rem] leading-[0.9] tracking-[var(--tracking-display)] text-white">
                Tout le mariage,
                <span className="block text-white/88">au bon endroit.</span>
              </h1>
              <p className="mt-5 max-w-2xl mx-auto text-[15px] md:text-[18px] text-white/66 leading-[var(--leading-body)]">
                Un accès simple pour le couple, les invités, les prestataires et le planner.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link to="/setup" className="rounded-full bg-white px-6 py-3.5 text-sm font-medium text-black shadow-[0_12px_28px_rgba(0,0,0,0.18)] inline-flex items-center gap-2">
                  Créer mon mariage
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a href="#registre" className="rounded-full bg-black px-6 py-3.5 text-sm text-white inline-flex items-center gap-2 transition-colors hover:bg-zinc-900">
                  Explorer le registre
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-[1480px] mx-auto px-5 md:px-8 lg:px-10 py-4 md:py-5">
          <div className="grid grid-cols-2 gap-2 md:gap-3">
            {ENTRY_POINTS.map((item) => (
              <EntryTile key={item.id} item={item} />
            ))}
          </div>
        </section>

        <section id="registre" className="max-w-[1480px] mx-auto px-5 md:px-8 lg:px-10 py-10 md:py-14 scroll-mt-28 overflow-hidden">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <div className="aime-label text-zinc-500 mb-4">Registre prestataires</div>
              <h2 className="font-display text-4xl md:text-6xl tracking-[var(--tracking-h2)] leading-[0.94] text-zinc-950">
                Une sélection claire,
                <span className="block text-zinc-950/88">filtrable et premium.</span>
              </h2>
              <p className="mt-4 text-base md:text-lg text-zinc-600 leading-[var(--leading-body)] max-w-2xl">
                Le registre se découvre vite, puis s’ouvre en profondeur dans le portail prestataires.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {VENDOR_TAXONOMY.map((item) => (
                <FilterChip key={item.id} active={taxonomy === item.id} onClick={() => setTaxonomy(item.id)}>
                  {item.label}
                </FilterChip>
              ))}
            </div>
          </div>

          <div className="mt-8 overflow-hidden">
            <div className="aime-marquee-track flex gap-4 w-max pb-2">
              {marqueeVendors.map((vendor, index) => (
                <RegistryCard key={`${vendor.id}-${index}`} vendor={vendor} />
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/prestataires" className="rounded-full bg-black px-5 py-3 text-sm font-medium text-white hover:bg-zinc-800 inline-flex items-center gap-2">
              Ouvrir le registre complet
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        <section id="pillars" className="max-w-[1480px] mx-auto px-5 md:px-8 lg:px-10 pb-16 md:pb-20 scroll-mt-28">
          <div className="mb-8 md:mb-10">
            <div className="aime-label text-zinc-500 mb-4">Les 12 univers</div>
            <h2 className="font-display text-4xl md:text-6xl tracking-[var(--tracking-h2)] leading-[0.94] text-zinc-950 max-w-4xl">
              Douze forces éditoriales,
              <span className="block text-zinc-950/88">un seul produit derrière.</span>
            </h2>
          </div>

          <div className="space-y-8">
            {PILLARS.map((pillar) => (
              <PillarSection key={pillar.id} pillar={pillar} />
            ))}
          </div>
        </section>

        <section className="max-w-[1480px] mx-auto px-5 md:px-8 lg:px-10 pb-16 md:pb-24">
          <div className="rounded-[36px] bg-[var(--color-black)] text-white p-6 md:p-8 lg:p-10">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] items-center">
              <div>
                <div className="aime-label text-white/45 mb-3">Sortie</div>
                <h2 className="font-display text-3xl md:text-5xl leading-[0.96] tracking-[var(--tracking-h2)]">
                  Une marque forte. Un usage évident.
                </h2>
                <p className="mt-4 max-w-2xl text-base md:text-lg text-white/62 leading-[var(--leading-body)]">
                  La landing pose le monde AIME. Le produit garde la mécanique, la clarté et les accès simples déjà en place.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/setup" className="rounded-full bg-white px-5 py-3 text-sm font-medium text-black inline-flex items-center gap-2 shadow-[0_12px_28px_rgba(0,0,0,0.18)]">
                  Créer mon mariage
                </Link>
                <Link to="/prestataires" className="rounded-full bg-black px-5 py-3 text-sm text-white hover:bg-zinc-900 inline-flex items-center gap-2">
                  Voir le registre
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
