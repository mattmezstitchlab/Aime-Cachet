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

function compactText(value, max = 116) {
  if (!value) return "";
  const clean = value.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cutoff = clean.lastIndexOf(" ", max);
  return `${clean.slice(0, cutoff > 48 ? cutoff : max).trim()}…`;
}

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
    <article className="overflow-hidden rounded-[28px] border border-black/8 bg-[#151515] text-white shadow-[0_22px_68px_rgba(0,0,0,0.12)]">
      <div className="relative aspect-[0.92] overflow-hidden">
        <img src={image} alt={vendor.name} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.42))]" aria-hidden="true" />
        <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/45 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-white/84 backdrop-blur-xl">
          {categoryLabel}
        </div>
      </div>

      <div className="p-5 md:p-6">
        <h3 className="text-[1.75rem] font-display leading-[1] text-white">{vendor.name}</h3>
        <div className="mt-3 text-sm text-white/58">
          {vendor.city} · {vendor.responseTime} de réponse
        </div>
        <p className="mt-4 text-sm leading-relaxed text-white/62">
          {compactText(vendor.summary, 120)}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {vendor.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-white/68">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-white/42">À partir de</div>
            <div className="mt-2 text-base font-semibold text-white">{fmtMoney(vendor.priceFrom)}</div>
          </div>
          <Link to={`/prestataires/${vendor.id}`} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm text-white/88 hover:bg-white/[0.1] transition-colors">
            Voir la fiche
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function Landing() {
  const [wedding] = useState(() => readWeddingState());
  const [taxonomy, setTaxonomy] = useState("all");

  const vendors = useMemo(() => getVendorMarketplace(wedding, taxonomy), [wedding, taxonomy]);

  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] text-[var(--color-text-primary)]">
      <main>
        <section className="max-w-[1480px] mx-auto px-5 md:px-8 lg:px-10 pt-5 md:pt-6 scroll-mt-28">
          <div className="relative min-h-[calc(100vh-116px)] overflow-hidden rounded-[40px] bg-[var(--color-black)] text-white shadow-[0_24px_90px_rgba(0,0,0,0.18)]">
            <img src={HERO_BG} alt="AIME Wedding" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.12),rgba(0,0,0,0.74))]" aria-hidden="true" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_24%)]" aria-hidden="true" />

            <div className="relative z-10 flex min-h-[calc(100vh-116px)] flex-col justify-end px-6 py-6 md:px-8 md:py-8 lg:px-10 lg:py-10">
              <div className="max-w-4xl">
                <div className="aime-kicker mb-5">Couple · invités · prestataires · planner</div>
                <h1 className="font-display text-[3rem] sm:text-[4.8rem] lg:text-[7rem] leading-[0.9] tracking-[var(--tracking-display)] text-white">
                  Tout le mariage,
                  <span className="block text-white/88">au bon endroit.</span>
                </h1>
                <p className="mt-5 max-w-2xl text-[15px] md:text-[18px] text-white/66 leading-[var(--leading-body)]">
                  Un accès simple pour le couple, les invités, les prestataires et le planner.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
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
          </div>
        </section>

        <section className="max-w-[1480px] mx-auto px-5 md:px-8 lg:px-10 py-4 md:py-5">
          <div className="grid grid-cols-2 gap-2 md:gap-3">
            {ENTRY_POINTS.map((item) => (
              <EntryTile key={item.id} item={item} />
            ))}
          </div>
        </section>

        <section id="registre" className="max-w-[1480px] mx-auto px-5 md:px-8 lg:px-10 py-10 md:py-14 scroll-mt-28">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <div className="aime-label text-zinc-500 mb-4">Registre prestataires</div>
              <h2 className="font-display text-4xl md:text-6xl tracking-[var(--tracking-h2)] leading-[0.94] text-zinc-950">
                Une sélection claire,
                <span className="block text-zinc-950/88">filtrable et premium.</span>
              </h2>
              <p className="mt-4 text-base md:text-lg text-zinc-600 leading-[var(--leading-body)] max-w-2xl">
                Lieux, photo, traiteur, fleurs, son, transport, beauté et coordination : chaque fiche reste lisible en un coup d'œil.
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

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {vendors.map((vendor) => (
              <RegistryCard key={vendor.id} vendor={vendor} />
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/prestataires" className="rounded-full bg-black px-5 py-3 text-sm font-medium text-white hover:bg-zinc-800 inline-flex items-center gap-2">
              Ouvrir le registre complet
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/espace-invites" className="rounded-full border border-black/8 bg-white px-5 py-3 text-sm text-zinc-700 hover:bg-black/[0.03] inline-flex items-center gap-2">
              Accès invités
            </Link>
          </div>
        </section>

        <section className="max-w-[1480px] mx-auto px-5 md:px-8 lg:px-10 pb-16 md:pb-24">
          <div className="rounded-[36px] bg-[var(--color-black)] text-white p-6 md:p-8 lg:p-10">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] items-center">
              <div>
                <div className="aime-label text-white/45 mb-3">Sortie</div>
                <h2 className="font-display text-3xl md:text-5xl leading-[0.96] tracking-[var(--tracking-h2)]">
                  Un accès clair pour chacun.
                </h2>
                <p className="mt-4 max-w-2xl text-base md:text-lg text-white/62 leading-[var(--leading-body)]">
                  Le couple crée, les invités accèdent, les prestataires se rendent visibles et le planner coordonne.
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
