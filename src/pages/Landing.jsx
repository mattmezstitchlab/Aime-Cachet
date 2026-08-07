import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Calendar,
  Crown,
  Euro,
  MapPin,
  Settings2,
} from "lucide-react";
import { readWeddingState } from "@/lib/aimeWeddingCore";

const HERO_BG = "/landing/hero-aime-wedding.jpg";

const PILLARS = [
  {
    id: "zeus",
    number: "01",
    myth: "Zeus",
    title: "Orchestration globale",
    visualHook: "Le flux souverain qui relie tous les rôles du mariage sans jamais casser la lecture d'ensemble.",
    editorial: "Point Zéro devient ici la couche de gouvernance : couple, planner, prestataires, documents, timeline, budget et diffusion restent synchronisés dans un seul centre lisible. Le nom est mythologique, mais la promesse reste extrêmement concrète.",
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
    editorial: "Cette section raconte la couche sensorielle du mariage : soirée, intensité, lumière, ambiance et respiration émotionnelle. Même si le produit reste sobre, la landing peut montrer que cette orchestration sensible fait partie du système global.",
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
    editorial: "Athéna devient la signature éditoriale de toute la couche de logique : setup, rappels, alertes, dépendances, documents recommandés, contraintes invités, météo, accessibilité ou décalages de programme. C'est le cœur rationnel d'AIME Wedding.",
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
    editorial: "Aphrodite ne parle pas seulement de décoration. Elle parle de direction esthétique traduite en notes, validations, documents, implantation et diffusion aux bons métiers. Cette couche editorialise la beauté, sans la rendre vague.",
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
    editorial: "Apollon représente la captation, mais aussi tout ce qui la rend possible : fenêtres image, transitions, coordination avec la cérémonie, absorption des retards et clarté des documents de référence. Le souvenir naît d'une organisation précise.",
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
    editorial: "Cette couche couvre la diffusion ciblée, le partage de versions, les relances propres et la circulation documentaire. C'est une section naturellement forte pour la marque, car elle relie le prestige du système à une utilité quotidienne immédiate.",
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
    editorial: "Arès devient ici la métaphore de la discipline terrain : montage, priorités, incidents, retards, checks techniques et bascules de dernière minute. C'est la partie du système qui transforme la tension en action claire.",
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
    editorial: "Déméter raconte la générosité, mais aussi la précision du service : traiteur, repas spéciaux, logistique de table, arbitrages et cohérence avec le nombre réel d'invités. Cette section ancre la landing dans quelque chose de très tangible.",
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
    editorial: "Artémis porte la promesse des espaces choisis et transformés. Dans le produit, cela devient la qualité d'usage du lieu : accessibilité, circulation, plan B, logistique parking, accueil et intelligibilité des mouvements le jour J.",
    bullets: [
      "Le setup pose les contraintes du lieu dès l'initialisation du mariage.",
      "Les documents d'accueil et d'accessibilité transforment le lieu en expérience maîtrisée.",
      "La landing peut être plus audacieuse ici sans perdre l'ancrage opérationnel.",
    ],
    href: "/setup",
    cta: null,
    image: "/landing/artemis.jpg",
  },
  {
    id: "hephaistos",
    number: "10",
    myth: "Héphaïstos",
    title: "Outils & supports sur-mesure",
    visualHook: "Quand le mariage demande une fiche, un export, une feuille ou un support spécifique, il faut pouvoir le forger proprement.",
    editorial: "Héphaïstos incarne la fabrication : supports imprimables, exports, feuilles de route par rôle, documents spécialisés recommandés par le setup. C'est une très bonne section pour raconter qu'AIME Wedding sait produire des outils concrets, pas seulement afficher des cartes.",
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
    editorial: "Dionysos donne la signature la plus libre et la plus vibrante de la landing. Dans le produit, cela redevient très concret : ouverture de bal, son, lumière, glissement du dîner vers la piste, after et protection de l'énergie du couple jusqu'au bout.",
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
    editorial: "Hestia est une très belle façon de clore la landing. Elle relie la famille, les témoins, l'accueil, les enfants, les aînés et la mémoire partagée. Dans le produit, cette section donne du sens à la vue couple et à toutes les décisions qui protègent l'expérience humaine du mariage.",
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

function fmtDate(value) {
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function getInitials(value = "AIME") {
  return value
    .split(/\s|&/)
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase())
    .join("");
}

function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
      <div className="aime-label text-white/45">{label}</div>
      <div className="text-3xl md:text-4xl font-display mt-3 text-white">{value}</div>
      <p className="text-sm text-white/55 mt-3 leading-relaxed">{hint}</p>
    </div>
  );
}

function PillarSection({ pillar }) {
  return (
    <section id={pillar.id} className="scroll-mt-28">
      <div className="rounded-[38px] overflow-hidden border border-black/8 bg-[var(--color-black)] shadow-[0_24px_80px_rgba(0,0,0,0.12)]">
        <div className="relative min-h-[66vh] md:min-h-[72vh]">
          <img
            src={pillar.image}
            alt={`${pillar.myth} · ${pillar.title}`}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.72))]" aria-hidden="true" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_26%)]" aria-hidden="true" />

          <div className="relative z-10 flex min-h-[66vh] md:min-h-[72vh] flex-col justify-between p-6 md:p-8 lg:p-10 text-white">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-4 py-2 text-sm text-white/82 backdrop-blur-xl">
                <span className="aime-label text-white/55">{pillar.number}</span>
                <span>{pillar.myth}</span>
              </div>
              {pillar.cta && (
                <Link to={pillar.href} className="rounded-full border border-white/12 px-4 py-2 text-sm text-white/88 hover:bg-white/5 inline-flex items-center gap-2">
                  {pillar.cta}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>

            <div className="max-w-4xl">
              <div className="aime-kicker mb-6">{pillar.myth} · mariage · système</div>
              <h2 className="font-display text-[2.8rem] sm:text-[4rem] lg:text-[5.4rem] leading-[0.94] tracking-[var(--tracking-display)] text-white">
                {pillar.title}
              </h2>
              <p className="mt-5 max-w-2xl text-base md:text-lg text-white/70 leading-[var(--leading-body)]">
                {pillar.visualHook}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white px-6 py-6 md:px-8 md:py-8 lg:px-10 lg:py-10 text-zinc-950">
          <div className="grid items-start gap-4 lg:grid-cols-[1fr]">
            <div className="grid md:grid-cols-3 gap-3">
              {pillar.bullets.map((item) => (
                <div key={item} className="rounded-[22px] border border-black/8 bg-[var(--color-warm-white)] p-4 text-sm text-zinc-700 leading-relaxed">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Landing() {
  const [wedding] = useState(() => readWeddingState());
  const meta = wedding.meta;
  const openReminders = wedding.reminders?.filter((item) => item.status === "open").length || 0;
  const activeAutomations = wedding.automations?.filter((item) => item.enabled).length || 0;
  const docCount = wedding.documents?.length || 0;
  const profileName = meta.couple || "Profil mariage";
  const profileInitials = getInitials(profileName);
  const plannerName = wedding.contacts?.planning?.name || "Planner";

  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] text-[var(--color-text-primary)]">
      <main>
        <section id="hero" className="max-w-[1480px] mx-auto px-5 md:px-8 lg:px-10 pt-5 md:pt-6 scroll-mt-28">
          <div className="relative min-h-[calc(100vh-116px)] overflow-hidden rounded-[40px] bg-[var(--color-black)] text-white shadow-[0_24px_90px_rgba(0,0,0,0.18)]">
            <img src={HERO_BG} alt="AIME Wedding hero" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.18),rgba(0,0,0,0.78))]" aria-hidden="true" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_24%)]" aria-hidden="true" />

            <div className="relative z-10 grid min-h-[calc(100vh-116px)] lg:grid-cols-[1.08fr_0.92fr] gap-8 items-end px-6 py-6 md:px-8 md:py-8 lg:px-10 lg:py-10">
              <div className="max-w-4xl">
                <div className="aime-kicker mb-6">Grand hero · 12 puissances · un seul système mariage</div>
                <h1 className="font-display text-[3.2rem] sm:text-[4.9rem] lg:text-[7rem] leading-[0.9] tracking-[var(--tracking-display)] text-white">
                  Douze puissances
                  <span className="block text-white/88">de marque.</span>
                  <span className="block">Un seul mariage tenu.</span>
                </h1>
                <p className="mt-6 max-w-2xl text-[16px] md:text-[19px] text-white/68 leading-[var(--leading-body)]">
                  Un accueil plus propre, un hero plus fort, douze sections visuelles un peu décalées mais modernes — et derrière, un produit toujours simple : setup, couple, planner, prestataires, documents, budget, communication et Jour J.
                </p>

                <div className="flex flex-wrap gap-3 mt-8">
                  <a href="#pillars" className="aime-button-primary rounded-full px-6 py-3.5 text-sm font-medium inline-flex items-center gap-2">
                    Voir les 12 sections
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div id="profile" className="grid gap-4 self-end">
                <div className="rounded-[32px] border border-white/10 bg-white/[0.05] p-5 md:p-6 backdrop-blur-2xl shadow-[var(--shadow-hud)]">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <span className="w-14 h-14 rounded-full border border-white/12 bg-white/[0.08] flex items-center justify-center text-lg font-semibold shrink-0">
                        {profileInitials}
                      </span>
                      <div className="min-w-0">
                        <div className="aime-label text-white/45 mb-2">Espace profil utilisateur</div>
                        <div className="text-2xl font-display leading-[1.02] text-white truncate">{profileName}</div>
                        <div className="text-sm text-white/58 mt-2">Compte mariage principal · planner {plannerName}</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3 mt-6">
                    <div className="rounded-[22px] border border-white/10 bg-black/20 p-4">
                      <div className="aime-label text-white/45">Date</div>
                      <div className="text-sm text-white mt-3 inline-flex items-center gap-2"><Calendar className="w-4 h-4" /> {fmtDate(meta.date)}</div>
                    </div>
                    <div className="rounded-[22px] border border-white/10 bg-black/20 p-4">
                      <div className="aime-label text-white/45">Lieu</div>
                      <div className="text-sm text-white mt-3 inline-flex items-center gap-2"><MapPin className="w-4 h-4" /> {meta.venue}</div>
                    </div>
                    <div className="rounded-[22px] border border-white/10 bg-black/20 p-4">
                      <div className="aime-label text-white/45">Budget</div>
                      <div className="text-sm text-white mt-3 inline-flex items-center gap-2"><Euro className="w-4 h-4" /> {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(meta.budget || 0)}</div>
                    </div>
                  </div>

                  <div className="mt-6 rounded-[22px] border border-white/10 bg-black/20 p-4 text-sm text-white/62 leading-relaxed">
                    Profil et réglages accessibles dans le header.
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <StatCard label="Rappels" value={openReminders} hint="Les actions encore ouvertes dans le système." />
                  <StatCard label="Automations" value={activeAutomations} hint="Les automatismes utiles actuellement armés." />
                  <StatCard label="Documents" value={docCount} hint="Les supports réellement visibles entre les rôles." />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="systeme" className="max-w-[1480px] mx-auto px-5 md:px-8 lg:px-10 py-12 md:py-16 scroll-mt-28">
          <div className="grid lg:grid-cols-[0.92fr_1.08fr] gap-8 items-start">
            <div>
              <div className="aime-label text-zinc-500 mb-4">Le système</div>
              <h2 className="font-display text-4xl md:text-6xl tracking-[var(--tracking-h2)] leading-[var(--leading-h2)] text-zinc-950">
                Une landing forte, un produit clair.
              </h2>
            </div>
            <div className="space-y-4">
              <p className="text-zinc-700 text-base md:text-lg leading-[var(--leading-body)] max-w-3xl">
                La landing porte la marque en douze puissances visuelles. L'application reste simple : setup, couple, planner, prestataires, documents, budget, communication et Jour J.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="aime-card-soft rounded-[24px] p-5">
                  <div className="aime-label text-zinc-500 mb-3">Hero</div>
                  <div className="text-lg font-semibold text-zinc-950">Grand visuel</div>
                  <p className="text-sm text-zinc-600 mt-2 leading-relaxed">Une entrée plus premium et plus nette.</p>
                </div>
                <div className="aime-card-soft rounded-[24px] p-5">
                  <div className="aime-label text-zinc-500 mb-3">12 piliers</div>
                  <div className="text-lg font-semibold text-zinc-950">Marque</div>
                  <p className="text-sm text-zinc-600 mt-2 leading-relaxed">Chaque dieu renvoie à une fonction réelle.</p>
                </div>
                <div className="aime-card-soft rounded-[24px] p-5">
                  <div className="aime-label text-zinc-500 mb-3">Produit</div>
                  <div className="text-lg font-semibold text-zinc-950">Simple</div>
                  <p className="text-sm text-zinc-600 mt-2 leading-relaxed">Lecture rapide, sans surcharge narrative.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="pillars" className="max-w-[1480px] mx-auto px-5 md:px-8 lg:px-10 pb-16 md:pb-20 scroll-mt-28">
          <div className="space-y-8">
            {PILLARS.map((pillar) => (
              <PillarSection key={pillar.id} pillar={pillar} />
            ))}
          </div>
        </section>

        <section className="max-w-[1480px] mx-auto px-5 md:px-8 lg:px-10 pb-16 md:pb-24">
          <div className="rounded-[36px] bg-[var(--color-black)] text-white p-6 md:p-8 lg:p-10">
            <div className="grid lg:grid-cols-[1fr_auto] gap-6 items-center">
              <div>
                <div className="aime-label text-white/45 mb-3">Sortie</div>
                <h2 className="font-display text-3xl md:text-5xl tracking-[var(--tracking-h2)] leading-[0.98]">
                  Une marque forte. Un usage évident.
                </h2>
                <p className="mt-4 max-w-2xl text-white/62 text-base md:text-lg leading-[var(--leading-body)]">
                  La landing signe l'univers. Point Zéro tient le mariage.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/point-zero" className="aime-button-primary rounded-full px-5 py-3 text-sm font-medium inline-flex items-center gap-2">
                  <Crown className="w-4 h-4" />
                  Ouvrir Point Zéro
                </Link>
                <Link to="/setup" className="rounded-full border border-white/12 px-5 py-3 text-sm text-white/88 hover:bg-white/5 inline-flex items-center gap-2">
                  <Settings2 className="w-4 h-4" />
                  Ouvrir le setup
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
