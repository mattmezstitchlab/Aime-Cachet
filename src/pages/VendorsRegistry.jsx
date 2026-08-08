import React, { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Camera, Flower2, MapPin, Music4, Palette, Search, Shirt, Sparkles, Star, UtensilsCrossed } from "lucide-react";
import WeddingWorkspaceTopBar from "@/components/aime/WeddingWorkspaceTopBar";
import { getVendorMarketplace, readWeddingState, VENDOR_TAXONOMY } from "@/lib/aimeWeddingCore";
import { getVendorVisual } from "@/lib/aimeVendorVisuals";

const DIRECTORY_ITEMS = [
  { id: "directory", label: "Annuaire", to: "/prestataires/registre" },
  { id: "inspiration", label: "Inspirations", to: "/univers/aphrodite" },
  { id: "planning", label: "Planification", to: "/univers/athena" },
  { id: "dayj", label: "Jour J", to: "/jour-j-live" },
];

const STYLE_FILTERS = ["Bohème", "Classique", "Moderne", "Champêtre", "Luxe"];
const POPULAR = [
  [Camera, "Photographes", "234 prestataires"],
  [MapPin, "Lieux", "156 prestataires"],
  [UtensilsCrossed, "Traiteurs", "98 prestataires"],
  [Flower2, "Fleuristes", "112 prestataires"],
  [Music4, "DJ & Musiciens", "145 prestataires"],
  [Sparkles, "Wedding planners", "64 prestataires"],
  [Shirt, "Robes & Costumes", "89 prestataires"],
  [Palette, "Décorateurs", "73 prestataires"],
];

function SearchField({ value, onChange }) {
  return (
    <div className="rounded-full border border-black/10 bg-white px-5 py-4 flex items-center gap-4 shadow-[0_10px_28px_rgba(12,12,12,0.03)]">
      <Search className="h-5 w-5 text-zinc-500" />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Rechercher un prestataire, un lieu, un style..." className="w-full bg-transparent text-[17px] text-zinc-900 outline-none placeholder:text-zinc-400" />
      <button className="rounded-full bg-black px-6 py-3 text-sm text-white hover:bg-zinc-800">Rechercher →</button>
    </div>
  );
}

function FilterPill({ children, active = false, onClick = null }) {
  return (
    <button onClick={onClick} className={`rounded-full px-4 py-3 text-sm ${active ? "bg-black text-white" : "border border-black/10 bg-white text-zinc-700"}`}>{children}</button>
  );
}

function PopularCard({ icon: Icon, title, count }) {
  return (
    <div className="rounded-[22px] border border-black/8 bg-white p-8 text-center shadow-[0_10px_28px_rgba(12,12,12,0.03)]">
      <div className="mx-auto h-14 w-14 rounded-full bg-[var(--color-warm-white)] flex items-center justify-center text-zinc-700"><Icon className="h-6 w-6" /></div>
      <div className="mt-6 font-display text-[2rem] text-zinc-950">{title}</div>
      <div className="mt-2 text-zinc-500">{count}</div>
    </div>
  );
}

function FavoriteCard({ vendor, quote, author }) {
  return (
    <Link to={`/prestataires/${vendor.id}`} className="grid md:grid-cols-[260px_1fr] overflow-hidden rounded-[22px] border border-black/8 bg-white shadow-[0_10px_28px_rgba(12,12,12,0.03)]">
      <img src={getVendorVisual(vendor)} alt={vendor.name} className="h-full min-h-[260px] w-full object-cover" />
      <div className="p-6">
        <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">{VENDOR_TAXONOMY.find((item) => item.id === vendor.category)?.label || vendor.category}</div>
        <div className="mt-4 font-display text-[2.3rem] leading-[0.98] text-zinc-950">{vendor.name}</div>
        <div className="mt-2 text-zinc-500">{vendor.city}</div>
        <p className="mt-6 text-[17px] text-zinc-600 leading-relaxed">"{quote}"</p>
        <div className="mt-8 flex items-center justify-between gap-4">
          <span className="text-zinc-700">— {author}</span>
          <span className="rounded-full bg-[#e9f1ec] px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-[#6a8b73]">✦ AIME</span>
        </div>
      </div>
    </Link>
  );
}

export default function VendorsRegistry() {
  const state = useMemo(() => readWeddingState(), []);
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [style, setStyle] = useState("Luxe");
  const requestedCategory = searchParams.get("category") || "all";
  const category = VENDOR_TAXONOMY.some((item) => item.id === requestedCategory) ? requestedCategory : "all";
  const categoryLabel = VENDOR_TAXONOMY.find((item) => item.id === category)?.label || "Tous";
  const baseVendors = useMemo(() => getVendorMarketplace(state, category), [state, category]);
  const vendors = baseVendors.filter((vendor) => `${vendor.name} ${vendor.city} ${vendor.summary}`.toLowerCase().includes(query.toLowerCase()));
  const featured = vendors.slice(0, 3);

  const updateCategory = (next) => {
    if (next === "all") setSearchParams({});
    else setSearchParams({ category: next });
  };

  return (
    <div className="min-h-screen bg-[#efefeb] overflow-x-hidden text-[var(--color-text-primary)]">
      <div className="min-h-screen p-2 md:p-6">
        <div className="mx-auto max-w-[1600px] rounded-[24px] bg-[#fbfaf7] shadow-[0_24px_70px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="p-3 md:p-4">
            <WeddingWorkspaceTopBar
              items={DIRECTORY_ITEMS}
              active="directory"
              brand="AIME"
              suffix="WEDDINGS"
              rightContent={<Link to="/compte/prestataires" className="rounded-full border border-black/14 bg-white px-6 py-3 text-sm text-zinc-900 hover:bg-black/[0.03]">Mon Compte</Link>}
            />
          </div>

          <div className="px-6 md:px-10 lg:px-16 pt-6 md:pt-8 pb-16">
            <div className="text-sm text-zinc-500">Accueil / <span className="text-zinc-900">Annuaire</span></div>
            <div className="mt-5 text-[12px] uppercase tracking-[0.18em] text-[#b59c73]">Le sens du détail</div>
            <h1 className="mt-4 font-display text-[3.4rem] md:text-[5rem] leading-[0.94] text-zinc-950">Annuaire prestataires</h1>
            <p className="mt-4 text-[18px] text-zinc-600">Les meilleurs artisans du mariage, vérifiés et recommandés</p>

            <div className="mt-10"><SearchField value={query} onChange={setQuery} /></div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <FilterPill active>{`Catégorie : ${categoryLabel}`}</FilterPill>
              <FilterPill>Région : Île-de-France</FilterPill>
              <FilterPill>Budget : €€ - €€€</FilterPill>
              <span className="ml-2 text-sm text-zinc-500">Style :</span>
              {STYLE_FILTERS.map((item) => <FilterPill key={item} active={style === item} onClick={() => setStyle(item)}>{item}</FilterPill>)}
              <FilterPill>Note minimum : 4.5 ★</FilterPill>
            </div>

            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              {category !== "all" && <span className="rounded-full bg-black px-4 py-2 text-white">{categoryLabel} ✕</span>}
              <span className="rounded-full bg-black px-4 py-2 text-white">Île-de-France ✕</span>
            </div>

            <div className="mt-12 flex items-center justify-between gap-4 flex-wrap">
              <h2 className="font-display text-[2.6rem] text-zinc-950">{vendors.length} prestataires trouvés</h2>
              <div className="text-zinc-600">Trier par : <strong className="text-zinc-950">Recommandés</strong></div>
            </div>

            <section className="mt-8 rounded-[28px] overflow-hidden border border-black/8 bg-white shadow-[0_12px_30px_rgba(12,12,12,0.03)]">
              <div className="relative h-[220px] overflow-hidden">
                <img src="/landing/aphrodite.jpg" alt="hero directory" className="h-full w-full object-cover" />
                <div className="absolute left-4 top-4 rounded-full bg-black/80 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white">Fleuriste</div>
              </div>
              <div className="px-6 py-6 md:px-8 md:py-8 grid gap-8 xl:grid-cols-[320px_1fr] items-start">
                <div>
                  <div className="font-display text-[2rem] text-zinc-950">{featured[0]?.name || "Fleuriste Pétale & Co"}</div>
                  <div className="mt-2 inline-flex items-center gap-2 text-zinc-500"><MapPin className="h-4 w-4" />{featured[0]?.city || "Nantes"}</div>
                  <div className="mt-3 inline-flex items-center gap-2 text-zinc-700"><Star className="h-4 w-4" />4.8 (15)</div>
                  <div className="mt-3 rounded-full bg-[#e9f1ec] px-4 py-2 text-[12px] text-[#5f7f68] inline-flex">● Disponible Juin 2026</div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-[#b59c73]">Artisanat du mariage</div>
                  <h3 className="mt-4 font-display text-[3rem] md:text-[4rem] text-zinc-950">Catégories populaires</h3>
                  <p className="mt-4 text-[18px] text-zinc-600">Explorez les savoir-faire essentiels pour composer votre journée parfaite</p>
                  <div className="mt-8 flex justify-center"><Link to={featured[0] ? `/prestataires/${featured[0].id}` : "/prestataires"} className="rounded-full border border-black bg-white px-6 py-4 text-sm text-zinc-900 hover:bg-black/[0.03]">Voir le profil →</Link></div>
                  <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {POPULAR.map((entry, index) => {
                      const [Icon, title, count] = entry;
                      return <PopularCard key={`${title}-${index}`} icon={Icon} title={title} count={count} />;
                    })}
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-16 border-t border-black/6 pt-14">
              <div className="text-[12px] uppercase tracking-[0.18em] text-[#b59c73] text-center">Sélection exclusive</div>
              <h3 className="mt-4 font-display text-[3rem] md:text-[4rem] text-zinc-950 text-center">Prestataires coup de cœur</h3>
              <p className="mt-4 text-[18px] text-zinc-600 text-center">Recommandés par nos couples et certifiés pour leur excellence créative</p>
              <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {featured.map((vendor, index) => (
                  <FavoriteCard
                    key={vendor.id}
                    vendor={vendor}
                    quote={index === 0 ? "Le sens du détail, la discrétion et la poésie de leurs images ont immortalisé notre journée de la plus belle des manières." : index === 1 ? "Une orangerie magique et un service impeccable. Nos invités ont été époustouflés par le charme intemporel de ce domaine." : "Un rythme juste, une énergie folle et une écoute parfaite pour toute la soirée."}
                    author={index === 0 ? "Sarah & Pierre" : index === 1 ? "Chloé & Marc" : "Inès & Paul"}
                  />
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
