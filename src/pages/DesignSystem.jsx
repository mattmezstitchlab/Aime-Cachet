import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  Calendar,
  Crown,
  Euro,
  FileText,
  Heart,
  LayoutGrid,
  MapPin,
  MessagesSquare,
  Moon,
  Palette,
  PlayCircle,
  Search,
  Shield,
  SunMedium,
  Users,
} from "lucide-react";

const FOUNDATION_COLORS = [
  { label: "Black", token: "--color-black", value: "#0C0C0C" },
  { label: "Dark", token: "--color-dark", value: "#121212" },
  { label: "White", token: "--color-white", value: "#FFFFFF" },
  { label: "Warm White", token: "--color-warm-white", value: "#F8F8F6" },
  { label: "Warm Gray 100", token: "--color-warm-gray-100", value: "#F5F3F0" },
  { label: "Warm Gray 200", token: "--color-warm-gray-200", value: "#E5E3DC" },
  { label: "Warm Gray 500", token: "--color-warm-gray-500", value: "#727169" },
];

const DOT_STATES = [
  { id: "ok", label: "Stable / validé", dot: "#34C759", text: "Le signal doit rassurer sans teinter toute la carte." },
  { id: "watch", label: "Sous surveillance", dot: "#F5A524", text: "Simple point d’attention, pas de gros bloc orange." },
  { id: "critical", label: "Critique", dot: "#FF5A5F", text: "Visible immédiatement, mais en ponctuation uniquement." },
  { id: "info", label: "Info / diffusion", dot: "#4D8DFF", text: "Pour les remontées non bloquantes ou contextuelles." },
];

const ROLE_CARDS = [
  { title: "Couple", copy: "Vue centrale — toutes les décisions et leurs impacts en temps réel.", icon: Heart },
  { title: "Invités", copy: "Réponses RSVP, accès, tables, hébergements et circulation claire.", icon: Users },
  { title: "Prestataires", copy: "Registre, contrats, factures, échanges et créneaux de présence.", icon: Crown },
];

const HUD_FEED = [
  { text: "+12 invités → Budget +1 440€", state: "ok" },
  { text: "Pluie → Plan B activé", state: "watch" },
  { text: "PMR → Accessibilité vérifiée", state: "critical" },
  { text: "Discours +1 → +10 min", state: "info" },
];

const MODULES = [
  {
    god: "Zeus",
    title: "Point Zéro · cockpit",
    route: "/point-zero",
    role: "Vue maître, arbitrages, synthèse de l’écosystème.",
    image: "/landing/zeus.jpg",
  },
  {
    god: "Poséidon",
    title: "Son & ambiance",
    route: "/prestataires",
    role: "Playlist, rythme, intensité et scénarios de soirée.",
    image: "/landing/poseidon.jpg",
  },
  {
    god: "Athéna",
    title: "Planning & alertes",
    route: "/notifications",
    role: "Rétroplanning, dépendances, signaux et arbitrages.",
    image: "/landing/athena.jpg",
  },
  {
    god: "Aphrodite",
    title: "Direction esthétique",
    route: "/documents",
    role: "Moodboard, harmonie visuelle, ambiance et validation créative.",
    image: "/landing/aphrodite.jpg",
  },
  {
    god: "Apollon",
    title: "Galerie & souvenirs",
    route: "/espace-invites",
    role: "Photo, vidéo, galerie et médias invités.",
    image: "/landing/apollon.jpg",
  },
  {
    god: "Hermès",
    title: "Messagerie & diffusion",
    route: "/communication",
    role: "Messages ciblés, relances et documents partagés.",
    image: "/landing/hermes.jpg",
  },
  {
    god: "Arès",
    title: "Logistique & terrain",
    route: "/jour-j",
    role: "Implantation, montage, circulation et exécution jour J.",
    image: "/landing/ares.jpg",
  },
  {
    god: "Déméter",
    title: "Menu & ressources",
    route: "/budget",
    role: "Traiteur, régimes, cohérence repas et budget réel.",
    image: "/landing/demeter.jpg",
  },
  {
    god: "Artémis",
    title: "Lieux & registre",
    route: "/prestataires",
    role: "Découverte lieux, filtres, disponibilité et booking direct.",
    image: "/landing/artemis.jpg",
  },
  {
    god: "Héphaïstos",
    title: "Papeterie & exports",
    route: "/exports",
    role: "Faire-part, supports, fabrication et rendus finaux.",
    image: "/landing/hephaistos.jpg",
  },
  {
    god: "Dionysos",
    title: "Soirée & animations",
    route: "/prestataires",
    role: "Programmation nocturne, bar, intensité et animations premium.",
    image: "/landing/dionysos.jpg",
  },
  {
    god: "Hestia",
    title: "Invités & RSVP",
    route: "/invites",
    role: "Réponses, foyers, tables, accueil et transmissions famille.",
    image: "/landing/hestia.jpg",
  },
];

const PREVIEW_THEMES = {
  dark: {
    page: "bg-[#0f0f10] text-white border-white/10",
    shell: "bg-[#121212] border-white/10 text-white",
    panel: "bg-[#171717] border-white/10 text-white",
    softPanel: "bg-white/[0.04] border-white/10 text-white/82",
    muted: "text-white/55",
    pill: "bg-white/[0.05] border-white/10 text-white/72",
    rail: "bg-black/55 border-white/10 text-white",
    previewTitle: "Mode nuit",
  },
  light: {
    page: "bg-[#f8f8f6] text-zinc-950 border-black/8",
    shell: "bg-white border-black/8 text-zinc-950",
    panel: "bg-[#fbfaf8] border-black/8 text-zinc-950",
    softPanel: "bg-white border-black/8 text-zinc-700",
    muted: "text-zinc-500",
    pill: "bg-white border-black/8 text-zinc-600",
    rail: "bg-black text-white border-black",
    previewTitle: "Mode jour",
  },
};

function Section({ eyebrow, title, description, action = null, children }) {
  return (
    <section className="aime-card-light rounded-[34px] overflow-hidden">
      <div className="px-5 md:px-6 py-4 md:py-5 border-b border-black/8 flex items-start justify-between gap-4">
        <div className="max-w-3xl">
          {eyebrow && <div className="aime-label text-zinc-500 mb-2">{eyebrow}</div>}
          <h2 className="text-[1.7rem] md:text-[2.3rem] font-display leading-[0.98] text-zinc-950">{title}</h2>
          {description && <p className="mt-3 text-sm md:text-base text-zinc-600 leading-relaxed">{description}</p>}
        </div>
        {action}
      </div>
      <div className="p-5 md:p-6">{children}</div>
    </section>
  );
}

function ThemeToggle({ value, onChange }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-black/8 bg-white p-1">
      <button
        onClick={() => onChange("light")}
        className={`rounded-full px-3 py-2 text-sm inline-flex items-center gap-2 ${value === "light" ? "bg-black text-white" : "text-zinc-700"}`}
      >
        <SunMedium className="w-4 h-4" />
        Jour
      </button>
      <button
        onClick={() => onChange("dark")}
        className={`rounded-full px-3 py-2 text-sm inline-flex items-center gap-2 ${value === "dark" ? "bg-black text-white" : "text-zinc-700"}`}
      >
        <Moon className="w-4 h-4" />
        Nuit
      </button>
    </div>
  );
}

function FoundationSwatch({ item }) {
  return (
    <div className="rounded-[24px] border border-black/8 bg-white overflow-hidden">
      <div className="h-24" style={{ backgroundColor: `var(${item.token})` }} />
      <div className="p-4">
        <div className="text-sm font-semibold text-zinc-950">{item.label}</div>
        <div className="text-xs text-zinc-500 mt-2">{item.value}</div>
        <div className="text-[11px] text-zinc-400 mt-1">{item.token}</div>
      </div>
    </div>
  );
}

function DotStateRow({ item }) {
  return (
    <div className="rounded-[22px] border border-black/8 bg-white p-4 flex items-start gap-3">
      <span className="mt-1 h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.dot }} />
      <div>
        <div className="text-sm font-semibold text-zinc-950">{item.label}</div>
        <p className="text-sm text-zinc-600 mt-2 leading-relaxed">{item.text}</p>
      </div>
    </div>
  );
}

function MiniTopBar({ mode = "dark" }) {
  const theme = PREVIEW_THEMES[mode];
  return (
    <div className={`rounded-[24px] border ${theme.shell} overflow-hidden`}>
      <div className="px-4 py-3 border-b border-current/10 flex items-center justify-between gap-4 text-sm">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <span className="w-3 h-3 rounded-full bg-[#FEBB2E]" />
            <span className="w-3 h-3 rounded-full bg-[#28C840]" />
          </div>
          <div className="font-semibold tracking-[0.12em] uppercase text-xs">AIME Wedding</div>
          <div className={`truncate ${theme.muted}`}>/ shell unique / navigation des 12</div>
        </div>
        <div className={`hidden sm:flex items-center gap-2 rounded-full border px-3 py-2 ${theme.pill}`}>
          <Search className="w-4 h-4" />
          <span>Recherche…</span>
        </div>
      </div>
      <div className="px-4 py-4 md:px-5 md:py-5">
        <div className="flex flex-wrap gap-2">
          {MODULES.slice(0, 12).map((item, index) => (
            <span key={item.god} className={`rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] ${index === 0 ? theme.rail : theme.pill}`}>
              {item.god}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function HeroPreview({ mode = "dark" }) {
  const theme = PREVIEW_THEMES[mode];
  return (
    <div className={`rounded-[28px] overflow-hidden border ${theme.page}`}>
      <div className="relative h-[320px] md:h-[360px] bg-[var(--color-black)]">
        <img src="/landing/hero-aime-wedding.jpg" alt="Hero" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.16),rgba(0,0,0,0.72))]" />
        <div className="absolute top-0 left-0 right-0 p-4 md:p-5">
          <MiniTopBar mode={mode} />
        </div>

        <div className="absolute left-0 right-0 bottom-0 p-5 md:p-6">
          <div className="text-[11px] uppercase tracking-[0.18em] text-white/58 mb-3">Hero page standard</div>
          <h3 className="font-display text-[2.2rem] md:text-[3rem] leading-[0.94] text-white">Point Zéro · cockpit planner</h3>
          <div className={`mt-5 rounded-[24px] border px-4 py-3 md:px-5 md:py-4 ${theme.rail}`}>
            <div className="grid gap-3 md:grid-cols-5">
              <div>
                <div className="text-[11px] uppercase tracking-[0.16em] text-white/42">Date</div>
                <div className="mt-2 text-sm inline-flex items-center gap-2"><Calendar className="w-4 h-4" /> 18 juin 2027</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.16em] text-white/42">Lieu</div>
                <div className="mt-2 text-sm inline-flex items-center gap-2"><MapPin className="w-4 h-4" /> Château de la Lys</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.16em] text-white/42">Budget</div>
                <div className="mt-2 text-sm inline-flex items-center gap-2"><Euro className="w-4 h-4" /> 28 400€</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.16em] text-white/42">État</div>
                <div className="mt-2 text-sm inline-flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#34C759]" /> stable</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.16em] text-white/42">Signal</div>
                <div className="mt-2 text-sm inline-flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#F5A524]" /> 2 alertes</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RoleCard({ item }) {
  const Icon = item.icon;
  return (
    <div className="rounded-[28px] border border-white/10 bg-[#141414] text-white p-5 md:p-6 min-h-[240px] flex flex-col">
      <span className="w-12 h-12 rounded-full border border-white/10 bg-white/[0.05] inline-flex items-center justify-center">
        <Icon className="w-5 h-5" />
      </span>
      <div className="mt-8 text-[2rem] font-display leading-[1]">{item.title}</div>
      <p className="mt-4 text-base leading-relaxed text-white/58 max-w-sm">{item.copy}</p>
    </div>
  );
}

function ProjectCard() {
  return (
    <div className="rounded-[28px] border border-black/8 bg-white overflow-hidden min-h-[240px]">
      <div className="h-36 bg-[linear-gradient(180deg,#f5f3f0,#eeece8)] flex items-center justify-center">
        <LayoutGrid className="w-10 h-10 text-zinc-500" />
      </div>
      <div className="p-5 md:p-6">
        <div className="inline-flex rounded-full bg-[var(--color-warm-gray-100)] px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-zinc-600">Projet</div>
        <div className="mt-4 text-[1.7rem] font-display text-zinc-950 leading-[1]">AIME Wedding</div>
        <p className="mt-3 text-base text-zinc-600 leading-relaxed">Interface causale pour la gestion d’événements de mariage.</p>
      </div>
    </div>
  );
}

function HudWidget() {
  return (
    <div className="rounded-[28px] border border-black/8 bg-[#2a2a28] text-white p-5 md:p-6 min-h-[240px]">
      <div className="flex items-center justify-between gap-3">
        <div className="text-[1.25rem] font-semibold">Impact en temps réel</div>
        <div className="rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-white/72">Live</div>
      </div>
      <div className="mt-6 space-y-3">
        {HUD_FEED.map((item) => {
          const state = DOT_STATES.find((entry) => entry.id === item.state);
          return (
            <div key={item.text} className="rounded-[16px] bg-white/[0.06] px-4 py-3 flex items-center justify-between gap-3 text-sm text-white/88">
              <span>{item.text}</span>
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: state?.dot }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RegistryRail() {
  const items = useMemo(() => MODULES.slice(8, 12), []);
  return (
    <div className="overflow-hidden rounded-[28px] border border-black/8 bg-[#131313] p-4 md:p-5">
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
        {items.concat(items).map((item, index) => (
          <div key={`${item.god}-${index}`} className="min-w-[250px] max-w-[250px] rounded-[24px] border border-white/10 bg-[#191919] text-white overflow-hidden shrink-0">
            <div className="relative h-44">
              <img src={item.image} alt={item.title} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.06),rgba(0,0,0,0.55))]" />
              <div className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-white/80">
                {item.god}
              </div>
            </div>
            <div className="p-4">
              <div className="text-lg font-semibold text-white">{item.title}</div>
              <p className="mt-2 text-sm leading-relaxed text-white/58">{item.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LandingFlowCard({ step, title, copy }) {
  return (
    <div className="rounded-[24px] border border-black/8 bg-white p-5">
      <div className="aime-label text-zinc-500 mb-3">{step}</div>
      <div className="text-xl font-display text-zinc-950 leading-[1]">{title}</div>
      <p className="mt-3 text-sm text-zinc-600 leading-relaxed">{copy}</p>
    </div>
  );
}

function ModuleMapCard({ item }) {
  return (
    <Link to={item.route} className="group rounded-[26px] overflow-hidden border border-black/8 bg-white transition-transform hover:-translate-y-0.5">
      <div className="relative h-36">
        <img src={item.image} alt={item.god} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.1),rgba(0,0,0,0.58))]" />
        <div className="absolute left-4 bottom-4 text-white">
          <div className="aime-label text-white/62 mb-2">{item.god}</div>
          <div className="text-[1.35rem] font-display leading-[1]">{item.title}</div>
        </div>
      </div>
      <div className="p-4 md:p-5">
        <p className="text-sm text-zinc-600 leading-relaxed">{item.role}</p>
      </div>
    </Link>
  );
}

export default function DesignSystem() {
  const [previewMode, setPreviewMode] = useState("dark");
  const preview = PREVIEW_THEMES[previewMode];

  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] text-[var(--color-text-primary)] overflow-x-hidden">
      <div className="max-w-[1480px] mx-auto px-5 md:px-8 lg:px-10 py-6 md:py-8 space-y-5 md:space-y-6">
        <section className="rounded-[38px] bg-[var(--color-black)] text-white overflow-hidden shadow-[0_24px_90px_rgba(0,0,0,0.16)]">
          <div className="px-6 py-7 md:px-8 md:py-8 lg:px-10 lg:py-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] items-end">
            <div className="max-w-4xl">
              <div className="aime-kicker mb-5">Design system · shell unique · validation produit</div>
              <h1 className="font-display text-[2.8rem] sm:text-[4.4rem] lg:text-[6rem] leading-[0.9] tracking-[var(--tracking-display)] text-white">
                Mettre à plat
                <span className="block text-white/88">tout le système.</span>
              </h1>
              <p className="mt-5 max-w-2xl text-[15px] md:text-[18px] text-white/66 leading-[var(--leading-body)]">
                Cette page sert de source de vérité visuelle : mode jour / nuit, shell unique, hero standard, états par points, cartes, HUD, landing et organisation des 12 marques.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/" className="aime-button-primary rounded-full px-5 py-3 text-sm font-medium inline-flex items-center gap-2">
                  Retour landing
                </Link>
                <Link to="/point-zero" className="rounded-full border border-white/12 px-5 py-3 text-sm text-white/88 hover:bg-white/5 inline-flex items-center gap-2">
                  Ouvrir Point Zéro
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 md:p-6">
                <div className="aime-label text-white/45 mb-3">Règles de lecture</div>
                <div className="space-y-3 text-sm md:text-base text-white/72 leading-relaxed">
                  <div>• une interface derrière unique, les 12 comme atlas d’organisation</div>
                  <div>• hero pleine largeur, moins haut, header par-dessus</div>
                  <div>• bande noire en bas du hero, pas de gros chiffres glassmorphism</div>
                  <div>• états en micro-points, pas en grands blocs colorés</div>
                </div>
              </div>
              <ThemeToggle value={previewMode} onChange={setPreviewMode} />
            </div>
          </div>
        </section>

        <Section
          eyebrow="Foundations"
          title="Jour / nuit, couleurs, typo et signaux sobres."
          description="On valide ici les fondations avant de retoucher les pages produit. La couleur devient ponctuation."
          action={<div className="text-sm text-zinc-500">{preview.previewTitle} actif pour les previews</div>}
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {FOUNDATION_COLORS.map((item) => (
              <FoundationSwatch key={item.label} item={item} />
            ))}
          </div>
          <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr] mt-6">
            <div className="rounded-[26px] border border-black/8 bg-white p-5 md:p-6">
              <div className="aime-label text-zinc-500 mb-4">Typographie</div>
              <div className="font-display text-[3rem] md:text-[4.3rem] leading-[0.9] text-zinc-950">AIME Wedding</div>
              <div className="mt-5 text-xl text-zinc-950">Hero standard de page</div>
              <p className="mt-3 text-base text-zinc-600 leading-relaxed">Le grand titre reste court, le contexte se lit vite, l’habillage ne doit jamais noyer le niveau 1.</p>
            </div>
            <div className="space-y-3">
              {DOT_STATES.map((item) => (
                <DotStateRow key={item.id} item={item} />
              ))}
            </div>
          </div>
        </Section>

        <Section
          eyebrow="Shell"
          title="Une seule interface arrière, avec lecture par les 12 marques."
          description="Le shell reste unique : header, recherche, navigation des 12, puis contenu. Les dieux organisent les fonctionnalités déjà implémentées, ils ne les remplacent pas."
        >
          <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-4">
              <MiniTopBar mode={previewMode} />
              <div className={`rounded-[28px] border p-5 md:p-6 ${preview.panel}`}>
                <div className="aime-label mb-4 opacity-60">Bottom dock</div>
                <div className="flex items-center justify-between gap-2 rounded-full border p-3 max-w-xl mx-auto border-current/10 bg-current/[0.03]">
                  {[Heart, Users, FileText, Crown, Calendar, Bell, Euro].map((Icon, index) => (
                    <div key={index} className="flex flex-col items-center gap-1 px-2">
                      <Icon className={`w-[18px] h-[18px] ${index === 3 ? "text-current" : "opacity-70"}`} />
                      <span className={`w-1.5 h-1.5 rounded-full ${index === 3 ? "bg-current" : "bg-transparent"}`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className={`rounded-[28px] border p-5 md:p-6 ${preview.panel}`}>
              <div className="aime-label mb-4 opacity-60">Principes structurels</div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className={`rounded-[22px] border p-4 ${preview.softPanel}`}>
                  <div className="text-sm font-semibold">Nav principale claire</div>
                  <p className={`mt-3 text-sm leading-relaxed ${preview.muted}`}>Couple, Invités, Prestataires, Planner. Les 12 restent une couche experte / éditoriale.</p>
                </div>
                <div className={`rounded-[22px] border p-4 ${preview.softPanel}`}>
                  <div className="text-sm font-semibold">Recherche & profil persistants</div>
                  <p className={`mt-3 text-sm leading-relaxed ${preview.muted}`}>Le shell doit toujours donner le contexte sans recharger visuellement chaque écran.</p>
                </div>
                <div className={`rounded-[22px] border p-4 ${preview.softPanel}`}>
                  <div className="text-sm font-semibold">États compacts</div>
                  <p className={`mt-3 text-sm leading-relaxed ${preview.muted}`}>Un point vert/orange/rouge/bleu suffit. L’info textuelle porte le sens, la couleur ponctue.</p>
                </div>
                <div className={`rounded-[22px] border p-4 ${preview.softPanel}`}>
                  <div className="text-sm font-semibold">Dark / light via tokens</div>
                  <p className={`mt-3 text-sm leading-relaxed ${preview.muted}`}>On prépare les deux modes sans dupliquer les composants ni multiplier les exceptions page par page.</p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section
          eyebrow="Hero standard"
          title="Un hero pleine largeur, plus bas, avec une bande noire structurante."
          description="Le header passe au-dessus, le visuel reste fort, et les chiffres se déplacent dans un rail compact en bas."
        >
          <HeroPreview mode={previewMode} />
        </Section>

        <Section
          eyebrow="Cartes & HUD"
          title="Des cartes plus calmes, plus lisibles, plus proches du design system."
          description="On garde la profondeur métier, mais on réduit l’effet dashboard lourd."
        >
          <div className="grid gap-4 xl:grid-cols-3">
            <ProjectCard />
            <RoleCard item={ROLE_CARDS[0]} />
            <HudWidget />
          </div>
        </Section>

        <Section
          eyebrow="Landing composition"
          title="La landing devient un enchaînement clair, sans perdre les 12 marques."
          description="Hero, 4 accès, bande prestataires horizontale, puis atlas des 12 dieux avec leurs descriptifs."
        >
          <div className="grid gap-4 xl:grid-cols-[0.88fr_1.12fr] items-start">
            <div className="grid gap-4">
              <LandingFlowCard step="01" title="Hero" copy="Un seul visuel, un titre fort, un CTA principal, un secondaire discret." />
              <LandingFlowCard step="02" title="4 accès" copy="Couple, Prestataire, Invité, Planner en mosaïque carrée bord à bord." />
              <LandingFlowCard step="03" title="Bande registre" copy="Cartes prestataires horizontales, mouvement lent, lecture immédiate du registre." />
              <LandingFlowCard step="04" title="12 marques" copy="Les dieux reviennent ensuite avec leurs descriptifs et, plus tard, leurs aperçus plugins." />
            </div>
            <RegistryRail />
          </div>
        </Section>

        <Section
          eyebrow="Atlas des 12"
          title="Chaque dieu range un module réel déjà présent dans l’application."
          description="On ne reconstruit rien : on clarifie où vivent les fonctionnalités existantes et comment elles se lisent dans un shell unique."
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {MODULES.map((item) => (
              <ModuleMapCard key={item.god} item={item} />
            ))}
          </div>
        </Section>

        <Section
          eyebrow="Templates produit"
          title="Le prochain chantier : appliquer ces règles sans casser la mécanique existante."
          description="À partir de cette page, on peut reprendre landing, heroes, pages planner, invités, prestataires et documents avec une grille stable."
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: "Couple",
                copy: "Hero plus bas, notes globales, budget, décisions et apaisement visuel.",
                icon: Heart,
              },
              {
                title: "Invités",
                copy: "RSVP, tables, foyers, accès et prévisualisation invitée plus nette.",
                icon: Users,
              },
              {
                title: "Prestataires",
                copy: "Registre, contrats, facture, fiche profil et disponibilité plus premium.",
                icon: Crown,
              },
              {
                title: "Planner",
                copy: "Point Zéro, planning, logistique, diffusion et documents dans le même shell.",
                icon: Shield,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-[24px] border border-black/8 bg-white p-5 md:p-6">
                  <span className="w-11 h-11 rounded-full border border-black/8 bg-[var(--color-warm-white)] inline-flex items-center justify-center">
                    <Icon className="w-5 h-5 text-zinc-700" />
                  </span>
                  <div className="mt-5 text-xl font-display leading-[1] text-zinc-950">{item.title}</div>
                  <p className="mt-3 text-sm text-zinc-600 leading-relaxed">{item.copy}</p>
                </div>
              );
            })}
          </div>
        </Section>

        <div className="rounded-[34px] bg-[var(--color-black)] text-white p-6 md:p-8 lg:p-10">
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] items-center">
            <div>
              <div className="aime-label text-white/45 mb-3">Suite</div>
              <h2 className="font-display text-3xl md:text-5xl leading-[0.96]">Base validée, déploiement écran par écran.</h2>
              <p className="mt-4 max-w-2xl text-base md:text-lg text-white/62 leading-[var(--leading-body)]">
                Cette page devient la référence visuelle avant de réorganiser les pages existantes, sans perdre la logique déjà implémentée.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/point-zero" className="aime-button-primary rounded-full px-5 py-3 text-sm font-medium inline-flex items-center gap-2">
                <PlayCircle className="w-4 h-4" />
                Tester le cockpit
              </Link>
              <Link to="/prestataires" className="rounded-full border border-white/12 px-5 py-3 text-sm text-white/88 hover:bg-white/5 inline-flex items-center gap-2">
                <MessagesSquare className="w-4 h-4" />
                Voir le registre
              </Link>
              <Link to="/" className="rounded-full border border-white/12 px-5 py-3 text-sm text-white/88 hover:bg-white/5 inline-flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Revenir à la landing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
