import React, { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowUpRight, Clock3, MapPin, Star } from "lucide-react";
import WeddingModuleHeader from "@/components/aime/WeddingModuleHeader";
import { getVendorMarketplace, getVendorPaymentSummary, readWeddingState, VENDOR_BOOKING_STAGES, VENDOR_TAXONOMY } from "@/lib/aimeWeddingCore";
import { getVendorVisual } from "@/lib/aimeVendorVisuals";

const moneyFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

function formatMoney(value) {
  return moneyFormatter.format(value || 0);
}

function FilterChip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm transition-colors ${active ? "bg-black text-white" : "border border-black/8 bg-white text-zinc-700 hover:bg-black/[0.03]"}`}
    >
      {children}
    </button>
  );
}

function RegistryCard({ vendor }) {
  const image = getVendorVisual(vendor);
  const categoryLabel = VENDOR_TAXONOMY.find((item) => item.id === vendor.category)?.label || vendor.category;

  return (
    <Link
      to={`/prestataires/${vendor.id}`}
      className="group overflow-hidden rounded-[28px] border border-black/8 bg-white shadow-[0_16px_40px_rgba(12,12,12,0.06)] transition-transform hover:-translate-y-0.5"
    >
      <div className="relative h-56 overflow-hidden bg-[var(--color-warm-gray-100)]">
        <img src={image} alt={vendor.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.28))]" aria-hidden="true" />
        <div className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-zinc-600 backdrop-blur-xl">
          {categoryLabel}
        </div>
        <div className="absolute right-4 top-4 rounded-full bg-black/72 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white backdrop-blur-xl">
          {vendor.status}
        </div>
      </div>

      <div className="p-5 text-zinc-950">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-[1.35rem] font-semibold leading-[1.08]">{vendor.name}</h2>
            <div className="mt-2 inline-flex items-center gap-2 text-sm text-zinc-500">
              <MapPin className="h-4 w-4" />
              {vendor.city}
            </div>
          </div>
          <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-zinc-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </div>

        <p className="mt-4 text-sm text-zinc-600 leading-relaxed">{vendor.summary}</p>

        <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
          <div>
            <div className="aime-label text-zinc-500 mb-1">Prix</div>
            <div className="text-zinc-900">{formatMoney(vendor.priceFrom)}</div>
          </div>
          <div>
            <div className="aime-label text-zinc-500 mb-1">Réponse</div>
            <div className="inline-flex items-center gap-1 text-zinc-900">
              <Clock3 className="h-3.5 w-3.5" />
              {vendor.responseTime}
            </div>
          </div>
          <div>
            <div className="aime-label text-zinc-500 mb-1">Avis</div>
            <div className="inline-flex items-center gap-1 text-zinc-900">
              <Star className="h-3.5 w-3.5" />
              {vendor.rating}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full border border-black/8 bg-[var(--color-warm-white)] px-3 py-1.5 text-[12px] text-zinc-700">
            {VENDOR_BOOKING_STAGES[vendor.bookingStage]?.label || vendor.bookingStage}
          </span>
          <span className="rounded-full border border-black/8 bg-[var(--color-warm-white)] px-3 py-1.5 text-[12px] text-zinc-700">
            {vendor.paymentStatus}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function VendorsRegistry() {
  const state = useMemo(() => readWeddingState(), []);
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedCategory = searchParams.get("category") || "all";
  const category = VENDOR_TAXONOMY.some((item) => item.id === requestedCategory) ? requestedCategory : "all";
  const vendors = useMemo(() => getVendorMarketplace(state, category), [state, category]);
  const paymentSummary = useMemo(() => getVendorPaymentSummary(state), [state]);
  const categoryLabel = VENDOR_TAXONOMY.find((item) => item.id === category)?.label || "Tous";

  const updateCategory = (next) => {
    if (next === "all") {
      setSearchParams({});
      return;
    }
    setSearchParams({ category: next });
  };

  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] text-[var(--color-text-primary)] overflow-x-hidden">
      <div className="mx-auto max-w-[1320px] px-5 pb-12 pt-4 md:px-8 md:pb-16 lg:px-10">
        <div className="mb-8 md:mb-10">
          <WeddingModuleHeader
            universeId="artemis"
            eyebrow={`Registre prestataires · ${categoryLabel}`}
            title="Le registre prestataires, au complet."
            description="Une vue catalogue claire, filtrable, avec visuels, statuts et entrées directes vers chaque fiche prestataire."
            stats={[
              { label: "Prestataires", value: vendors.length, detail: categoryLabel },
              { label: "Catégories", value: VENDOR_TAXONOMY.length - 1, detail: "actives" },
              { label: "Paiements dus", value: formatMoney(paymentSummary.due), detail: "vivants" },
            ]}
            actions={[
              { to: "/prestataires", label: "Homepage prestataires" },
              { to: "/budget", label: "Budget & paiements" },
              { to: "/documents?role=vendors", label: "Documents utiles" },
            ]}
          />
        </div>

        <section className="rounded-[30px] border border-black/8 bg-white shadow-[0_18px_48px_rgba(12,12,12,0.06)] p-5 md:p-6">
          <div className="aime-label text-zinc-500 mb-4">Filtres</div>
          <div className="flex flex-wrap gap-2">
            {VENDOR_TAXONOMY.map((item) => (
              <FilterChip key={item.id} active={category === item.id} onClick={() => updateCategory(item.id)}>
                {item.label}
              </FilterChip>
            ))}
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {vendors.map((vendor) => (
            <RegistryCard key={vendor.id} vendor={vendor} />
          ))}
        </section>
      </div>
    </div>
  );
}
