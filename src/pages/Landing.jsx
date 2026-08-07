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

const PILLARS = [
  {
    id: "zeus",
    number: "01",
    myth: "Zeus",
    title: "Orchestration globale",
    visualHook: "Le flux souverain qui relie tous les rôles du mariage sans jamais casser la lecture d'ensemble.",
    bullets: [
      "Vue unique pour le planner, mais sans bruit inutile pour le couple.",
      "Rappels, alertes et arbitrages rassemblés dans une même logique d'orchestration.",
      "Chaque décision prise ici doit immédiatement se refléter dans le reste du système.",
    ],
    href: "/point-zero",
    cta: "Ouvrir Point Zéro",
    image: "/landing/zeus.jpg",
  },
  {
    id: "poseidon",
    number: "02",
    myth: "Poséidon",
    title: "Son, lumière & ambiance",
    visualHook: "L'immersion émotionnelle d'un mariage ne se pilote pas à l'instinct : elle se prépare comme une vague parfaitement tenue.",
    bullets: [
      "Le tempo de la soirée dépend du dîner, des discours et des transitions visibles dans le planning.",
      "Le portail prestataires et la timeline live servent de point d'appui à la technique terrain.",
      "Le langage de marque peut être plus fort ici, tant que l'usage reste crédible.",
    ],
    href: "/prestataires",
    cta: "Voir le portail prestataires",
    image: "/landing/poseidon.jpg",
  },
  {
    id: "athena",
    number: "03",
    myth: "Athéna",
    title: "Stratégie & automatisation",
    visualHook: "La vraie intelligence d'un mariage se joue dans l'anticipation, pas dans l'accumulation de formulaires.",
    bullets: [
      "Les automatismes restent sobres : seulement ceux qui enlèvent de la charge mentale réelle.",
      "Le setup initialise des rappels utiles au lieu d'ouvrir une app vide ou confuse.",
      "Chaque signal doit produire une conséquence lisible dans les documents, le budget ou le Jour J.",
    ],
    href: "/notifications",
    cta: "Voir les notifications",
    image: "/landing/athena.jpg",
  },
  {
    id: "aphrodite",
    number: "04",
    myth: "Aphrodite",
    title: "Scénographie & esthétique",
    visualHook: "La beauté du mariage devient plus forte quand elle est cadrée, transmise et relue comme un langage partagé.",
    bullets: [
      "La scénographie gagne en crédibilité quand elle vit dans des documents réellement partagés.",
      "L'esthétique influence aussi la circulation, les timings image et l'expérience invités.",
      "Le module Documents devient la colonne vertébrale de cette mise en forme.",
    ],
    href: "/documents",
    cta: "Voir les documents",
    image: "/landing/aphrodite.jpg",
  },
  {
    id: "apollon",
    number: "05",
    myth: "Apollon",
    title: "Photo, vidéo & souvenirs",
    visualHook: "La mémoire du mariage dépend d'une lumière tenue, d'un rythme juste et de séquences réellement respectées.",
    bullets: [
      "La timeline live aide à préserver les moments les plus sensibles à la lumière et au tempo.",
      "Les exports et la feuille de service donnent une base exploitable aux équipes image.",
      "La landing peut glorifier l'art visuel, l'app reste concentrée sur l'exécution utile.",
    ],
    href: "/prestataires",
    cta: "Voir les métiers image",
    image: "/landing/apollon.jpg",
  },
  {
    id: "hermes",
    number: "06",
    myth: "Hermès",
    title: "Communication & diffusion",
    visualHook: "Un mariage se fragilise quand l'information circule mal. Hermès raconte la vitesse, mais surtout la justesse du message.",
    bullets: [
      "Un message ne part jamais vers tout le monde sans raison.",
      "Les changements critiques doivent être diffusés avec audience, source et conséquence claire.",
      "Le produit reste sobre : pas d'usine à mails, mais un vrai centre de diffusion utile.",
    ],
    href: "/communication",
    cta: "Voir la diffusion ciblée",
    image: "/landing/hermes.jpg",
  },
  {
    id: "ares",
    number: "07",
    myth: "Arès",
    title: "Régie terrain & exécution",
    visualHook: "Le terrain n'a rien de poétique quand il déraille. Il doit être précis, rapide et maintenu sans panique.",
    bullets: [
      "Le Jour J doit rester lisible même sous pression.",
      "Chaque incident doit se convertir en rappel, note ou document utile.",
      "Le planner garde la vue globale, mais les équipes terrain voient seulement l'essentiel à exécuter.",
    ],
    href: "/jour-j",
    cta: "Voir la timeline live",
    image: "/landing/ares.jpg",
  },
  {
    id: "demeter",
    number: "08",
    myth: "Déméter",
    title: "Table, service & ressources",
    visualHook: "Le dîner, les régimes, le service et les arbitrages budgétaires forment un même système, pas des sujets séparés.",
    bullets: [
      "Le budget et le plan de table dialoguent directement avec le réel du service.",
      "Les documents repas spéciaux évitent les oublis silencieux mais critiques.",
      "La table devient un sujet d'orchestration, pas juste de décoration.",
    ],
    href: "/budget",
    cta: "Voir budget & arbitrages",
    image: "/landing/demeter.jpg",
  },
  {
    id: "artemis",
    number: "09",
    myth: "Artémis",
    title: "Lieux & espaces",
    visualHook: "Le lieu n'est pas un décor fixe. C'est une matière vivante : accès, météo, flux, accueil, extérieur, repli.",
    bullets: [
      "Le setup pose les contraintes du lieu dès l'initialisation du mariage.",
      "Les documents d'accueil et d'accessibilité transforment le lieu en expérience maîtrisée.",
      "La landing peut être plus audacieuse ici sans perdre l'ancrage opérationnel.",
    ],
    href: "/prestataires",
    cta: "Voir les lieux",
    image: "/landing/artemis.jpg",
  },
  {
    id: "hephaistos",
    number: "10",
    myth: "Héphaïstos",
    title: "Outils & supports sur-mesure",
    visualHook: "Quand le mariage demande une fiche, un export, une feuille ou un support spécifique, il faut pouvoir le forger proprement.",
    bullets: [
      "Le système peut générer des supports lisibles par rôle et par moment.",
      "Les documents spécialisés apparaissent selon les besoins réels du mariage.",
      "La fabrication reste discrète, premium et très utilitaire.",
    ],
    href: "/exports",
    cta: "Voir les exports",
    image: "/landing/hephaistos.jpg",
  },
  {
    id: "dionysos",
    number: "11",
    myth: "Dionysos",
    title: "Fête & soirée",
    visualHook: "La nuit réussie d'un mariage est le résultat d'un enchaînement tenu, pas d'un simple bouton fête.",
    bullets: [
      "La soirée dépend directement de la tenue du tempo précédent.",
      "Les décisions de dernière minute doivent protéger la fête, pas la fragiliser.",
      "La landing célèbre l'euphorie, l'app protège la fluidité réelle.",
    ],
    href: "/jour-j",
    cta: "Suivre la soirée",
    image: "/landing/dionysos.jpg",
  },
  {
    id: "hestia",
    number: "12",
    myth: "Hestia",
    title: "Accueil, famille & transmission",
    visualHook: "Un mariage reste un foyer temporaire : il faut accueillir, rassurer, relier et transmettre l'expérience à toutes les générations.",
    bullets: [
      "Le couple ne doit pas absorber le bruit inutile.",
      "Les témoins et la famille jouent un vrai rôle de transmission terrain.",
      "Le système protège le cœur humain du mariage, pas seulement sa logistique.",
    ],
    href: "/couple",
    cta: "Voir l'espace couple",
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

        <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-4 py-2.5 text-sm text-white/88 backdrop-blur-xl transition-colors group-hover:bg-white/[0.12]">
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

function PillarSection({ pillar }) {
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
              <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-4 py-2 text-sm text-white/82 backdrop-blur-xl">
                <span className="aime-label text-white/55">{pillar.number}</span>
                <span>{pillar.myth}</span>
              </div>
              <Link to={pillar.href} className="rounded-full border border-white/12 px-4 py-2 text-sm text-white/88 hover:bg-white/5 inline-flex items-center gap-2">
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

        <div className="bg-white px-6 py-6 md:px-8 md:py-8 lg:px-10 lg:py-10 text-zinc-950">
          <div className="grid md:grid-cols-3 gap-3">
            {pillar.bullets.map((item) => (
              <div key={item} className="rounded-[22px] border border-black/8 bg-[var(--color-warm-white)] p-4 text-sm text-zinc-700 leading-relaxed">
                {item}
              </div>
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
              <div className="aime-kicker mb-5">Couple · invités · prestataires · planner</div>
              <h1 className="font-display text-[3rem] sm:text-[4.8rem] lg:text-[7rem] leading-[0.9] tracking-[var(--tracking-display)] text-white">
                Tout le mariage,
                <span className="block text-white/88">au bon endroit.</span>
              </h1>
              <p className="mt-5 max-w-2xl mx-auto text-[15px] md:text-[18px] text-white/66 leading-[var(--leading-body)]">
                Un accès simple pour le couple, les invités, les prestataires et le planner.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link to="/setup" className="aime-button-primary rounded-full px-6 py-3.5 text-sm font-medium inline-flex items-center gap-2">
                  Créer mon mariage
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a href="#registre" className="rounded-full border border-white/12 bg-white/[0.05] px-6 py-3.5 text-sm text-white/88 hover:bg-white/[0.1] inline-flex items-center gap-2 transition-colors">
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
                <Link to="/setup" className="aime-button-primary rounded-full px-5 py-3 text-sm font-medium inline-flex items-center gap-2">
                  Créer mon mariage
                </Link>
                <Link to="/prestataires" className="rounded-full border border-white/12 px-5 py-3 text-sm text-white/88 hover:bg-white/5 inline-flex items-center gap-2">
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
