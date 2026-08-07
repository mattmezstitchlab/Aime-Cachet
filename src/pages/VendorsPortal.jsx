import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CreditCard,
  Phone,
  Star,
} from "lucide-react";
import WeddingPageHero from "@/components/aime/WeddingPageHero";
import {
  filterDocumentsByRole,
  filterTimelineByRole,
  getNotificationsForRole,
  getVendorCommitments,
  getVendorCommitmentSummary,
  getVendorMarketplace,
  getVendorPaymentSummary,
  readWeddingState,
  VENDOR_BOOKING_STAGES,
  VENDOR_COMMITMENT_STATUS,
  VENDOR_TAXONOMY,
} from "@/lib/aimeWeddingCore";

const VENDOR_OPTIONS = [
  { id: "all", label: "Tous les prestataires" },
  { id: "lieu", label: "Lieu" },
  { id: "photo", label: "Photo / Vidéo" },
  { id: "traiteur", label: "Traiteur" },
  { id: "famille", label: "Famille / Témoins" },
];

function Card({ title, eyebrow, children, action = null }) {
  return (
    <section className="aime-card-light rounded-[32px] overflow-hidden">
      <div className="px-5 md:px-6 py-4 border-b border-black/8 flex items-center justify-between gap-3">
        <div>
          {eyebrow && <div className="aime-label text-zinc-500 mb-1">{eyebrow}</div>}
          <h2 className="text-zinc-950 text-lg md:text-xl font-semibold">{title}</h2>
        </div>
        {action}
      </div>
      <div className="p-5 md:p-6">{children}</div>
    </section>
  );
}

function FilterChip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm transition-colors ${active ? "bg-black text-white" : "bg-white border border-black/8 text-zinc-700 hover:bg-black/[0.03]"}`}
    >
      {children}
    </button>
  );
}

function compactText(value, max = 88) {
  if (!value) return "";
  const clean = value.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cutoff = clean.lastIndexOf(" ", max);
  return `${clean.slice(0, cutoff > 44 ? cutoff : max).trim()}…`;
}

function fmtMoney(value) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value || 0);
}

function commitmentKindLabel(kind = "quote") {
  if (kind === "contract") return "Contrat";
  if (kind === "invoice") return "Facture";
  return "Devis";
}

function commitmentTone(status = "received") {
  if (["missing", "due"].includes(status)) return "border-black bg-black text-white";
  if (["received", "sent"].includes(status)) return "border-black/8 bg-white text-zinc-900";
  return "border-black/8 bg-black/[0.02] text-zinc-700";
}

export default function VendorsPortal() {
  const state = readWeddingState();
  const [focus, setFocus] = useState("all");
  const [taxonomy, setTaxonomy] = useState("all");

  const marketplace = useMemo(() => getVendorMarketplace(state, taxonomy), [state, taxonomy]);
  const paymentSummary = useMemo(() => getVendorPaymentSummary(state), [state]);
  const commitmentSummary = useMemo(() => getVendorCommitmentSummary(state), [state]);
  const visibleVendorIds = useMemo(() => marketplace.map((vendor) => vendor.id), [marketplace]);

  const allDocs = filterDocumentsByRole(state.documents, "vendors");
  const allSteps = filterTimelineByRole(state.timeline?.steps || [], "vendors");
  const allNotifications = getNotificationsForRole(state, "vendors");

  const docs = useMemo(() => {
    if (focus === "all") return allDocs;
    return allDocs.filter((doc) => doc.owner === focus || doc.sharedWith.includes(focus));
  }, [allDocs, focus]);

  const steps = useMemo(() => {
    if (focus === "all") return allSteps;
    return allSteps.filter((step) => step.owners.includes(focus));
  }, [allSteps, focus]);

  const notifications = useMemo(() => {
    if (focus === "all") return allNotifications;
    return allNotifications.filter((item) => {
      const text = `${item.title} ${item.text}`.toLowerCase();
      return text.includes(focus)
        || (focus === "lieu" && text.includes("accès"))
        || (focus === "photo" && text.includes("photo"))
        || (focus === "traiteur" && text.includes("traiteur"))
        || (focus === "famille" && text.includes("famille"));
    });
  }, [allNotifications, focus]);

  const contacts = useMemo(() => {
    if (focus === "all") {
      return [state.contacts?.planning, state.contacts?.lieu, state.contacts?.photo, state.contacts?.traiteur].filter(Boolean);
    }
    return [state.contacts?.planning, state.contacts?.[focus]].filter(Boolean);
  }, [focus, state.contacts]);

  const openCommitments = useMemo(() => {
    const visibleIds = new Set(visibleVendorIds);
    return getVendorCommitments(state)
      .filter((item) => taxonomy === "all" || visibleIds.has(item.vendorId))
      .filter((item) => ["received", "sent", "missing", "due", "scheduled"].includes(item.status))
      .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime())
      .slice(0, 6);
  }, [state, taxonomy, visibleVendorIds]);

  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] text-[var(--color-text-primary)] overflow-x-hidden">
      <div className="max-w-[1380px] mx-auto px-5 md:px-8 lg:px-10 py-6 md:py-8">
        <div className="mb-8 md:mb-10">
          <WeddingPageHero
            eyebrow="Prestataires · marketplace · exécution"
            title="Le portail prestataire, simple et pilotable."
            description="Qui est retenu, ce qui doit être validé, signé ou payé, et ce qui concerne vraiment chaque équipe."
            image="/landing/ares.jpg"
            stats={[
              { label: "Prestataires", value: marketplace.length, hint: "visibles" },
              { label: "Validations", value: commitmentSummary.quotesPending + commitmentSummary.contractsPending, hint: "ouvertes" },
              { label: "Factures", value: commitmentSummary.invoicesOpen, hint: "à suivre" },
              { label: "Paiements", value: paymentSummary.openCount, hint: "ouverts" },
            ]}
            actions={(
              <>
                {VENDOR_OPTIONS.map((item) => (
                  <FilterChip key={item.id} active={focus === item.id} onClick={() => setFocus(item.id)}>
                    {item.label}
                  </FilterChip>
                ))}
              </>
            )}
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.12fr_0.88fr] items-start mb-4">
          <Card
            title="Marketplace prestataires"
            eyebrow="Taxonomie mariage"
            action={
              <div className="flex flex-wrap gap-2 justify-end">
                {VENDOR_TAXONOMY.map((item) => (
                  <FilterChip key={item.id} active={taxonomy === item.id} onClick={() => setTaxonomy(item.id)}>
                    {item.label}
                  </FilterChip>
                ))}
              </div>
            }
          >
            <div className="grid md:grid-cols-2 gap-4">
              {marketplace.map((vendor) => (
                <div key={vendor.id} className="rounded-[24px] border border-black/8 bg-black/[0.02] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-zinc-950">{vendor.name}</div>
                      <div className="text-xs text-zinc-500 mt-2 uppercase tracking-[0.16em]">
                        {VENDOR_TAXONOMY.find((item) => item.id === vendor.category)?.label || vendor.category} · {vendor.city}
                      </div>
                    </div>
                    <span className="rounded-full border border-black/8 bg-white px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-zinc-700">
                      {vendor.status}
                    </span>
                  </div>

                  <p className="text-sm text-zinc-600 mt-3 leading-relaxed">{compactText(vendor.summary, 92)}</p>

                  <div className="grid grid-cols-3 gap-3 mt-4 text-sm">
                    <div>
                      <div className="aime-label text-zinc-500 mb-1">À partir de</div>
                      <div className="text-zinc-900">{fmtMoney(vendor.priceFrom)}</div>
                    </div>
                    <div>
                      <div className="aime-label text-zinc-500 mb-1">Réponse</div>
                      <div className="text-zinc-900">{vendor.responseTime}</div>
                    </div>
                    <div>
                      <div className="aime-label text-zinc-500 mb-1">Avis</div>
                      <div className="inline-flex items-center gap-1 text-zinc-900"><Star className="w-3.5 h-3.5" /> {vendor.rating}</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="rounded-full border border-black/8 bg-white px-3 py-1.5 text-xs text-zinc-700">
                      {VENDOR_BOOKING_STAGES[vendor.bookingStage]?.label || "À structurer"}
                    </span>
                    <span className="rounded-full border border-black/8 bg-white px-3 py-1.5 text-xs text-zinc-700 inline-flex items-center gap-2">
                      <CreditCard className="w-3.5 h-3.5" />
                      {vendor.paymentStatus}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {vendor.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-black/8 bg-white px-3 py-1.5 text-xs text-zinc-700">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Link to={`/prestataires/${vendor.id}`} className="rounded-full border border-black/8 bg-white px-4 py-2 text-sm text-zinc-700 hover:bg-black/[0.03]">
                      Voir fiche
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Devis, contrats, factures" eyebrow="Ce qui n'est pas encore verrouillé">
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="rounded-[20px] border border-black/8 bg-black/[0.02] p-4">
                <div className="aime-label text-zinc-500 mb-2">Devis</div>
                <div className="text-xl font-display text-zinc-950">{commitmentSummary.quotesPending}</div>
              </div>
              <div className="rounded-[20px] border border-black/8 bg-black/[0.02] p-4">
                <div className="aime-label text-zinc-500 mb-2">Contrats</div>
                <div className="text-xl font-display text-zinc-950">{commitmentSummary.contractsPending}</div>
              </div>
              <div className="rounded-[20px] border border-black/8 bg-black/[0.02] p-4">
                <div className="aime-label text-zinc-500 mb-2">Factures</div>
                <div className="text-xl font-display text-zinc-950">{commitmentSummary.invoicesOpen}</div>
              </div>
            </div>

            <div className="space-y-3">
              {openCommitments.map((item) => {
                const vendor = (state.vendors?.marketplace || []).find((entry) => entry.id === item.vendorId);
                return (
                  <div key={item.id} className={`rounded-[22px] border p-4 ${commitmentTone(item.status)}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold">{vendor?.name || "Prestataire"}</div>
                        <div className="text-xs uppercase tracking-[0.16em] mt-2 opacity-70">
                          {commitmentKindLabel(item.kind)} · {VENDOR_COMMITMENT_STATUS[item.status]?.label || item.status}
                        </div>
                      </div>
                      <div className="text-sm font-semibold">{fmtMoney(item.amount)}</div>
                    </div>
                    <div className="text-sm mt-3 opacity-90">{item.label} · échéance {new Date(item.dueAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}</div>
                    <p className="text-sm mt-3 opacity-80 leading-relaxed">{compactText(item.note, 92)}</p>
                    {vendor && (
                      <Link
                        to={`/prestataires/${vendor.id}`}
                        className={`mt-4 inline-flex items-center rounded-full px-4 py-2 text-sm ${["missing", "due"].includes(item.status) ? "border border-white/20 bg-white/10 text-white" : "border border-black/8 bg-white text-zinc-700 hover:bg-black/[0.03]"}`}
                      >
                        Ouvrir la fiche
                      </Link>
                    )}
                  </div>
                );
              })}

              {openCommitments.length === 0 && (
                <div className="rounded-[22px] border border-black/8 bg-black/[0.02] p-4 text-sm text-zinc-600">
                  Aucun devis, contrat ou facture en attente pour ce filtre.
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <Link to="/budget" className="inline-flex items-center rounded-full border border-black/8 bg-white px-4 py-2 text-sm text-zinc-700 hover:bg-black/[0.03]">
                  Ouvrir budget & règlements
                </Link>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1fr_1fr] items-start">
          <div className="space-y-4">
            <Card title="Vos horaires utiles" eyebrow="Ce qui vous concerne vraiment">
              <div className="space-y-3">
                {steps.map((step) => (
                  <div key={step.id} className="rounded-[24px] border border-black/8 bg-black/[0.02] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-zinc-950">{step.time} · {step.title}</div>
                        <div className="text-sm text-zinc-600 mt-2">{compactText(step.detail, 84)}</div>
                      </div>
                      <span className="rounded-full border border-black/8 bg-white px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-zinc-700">
                        {step.status}
                      </span>
                    </div>
                  </div>
                ))}
                {steps.length === 0 && (
                  <div className="rounded-[24px] border border-black/8 bg-black/[0.02] p-5 text-sm text-zinc-600">
                    Aucun créneau utile à afficher pour ce filtre.
                  </div>
                )}
              </div>
            </Card>

            <Card title="Documents utiles" eyebrow="Pas de version fantôme">
              <div className="space-y-3">
                {docs.map((doc) => (
                  <div key={doc.id} className="rounded-[24px] border border-black/8 bg-black/[0.02] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-zinc-950">{doc.title}</div>
                        <div className="text-sm text-zinc-600 mt-2">{compactText(doc.summary, 84)}</div>
                      </div>
                      <span className="rounded-full border border-black/8 bg-white px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-zinc-700">
                        {doc.status}
                      </span>
                    </div>
                  </div>
                ))}
                <Link to="/documents" className="inline-flex items-center rounded-full border border-black/8 bg-white px-4 py-2 text-sm text-zinc-700 hover:bg-black/[0.03]">
                  Ouvrir le module Docs
                </Link>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card title="Changements utiles" eyebrow="Alertes filtrées">
              <div className="space-y-3">
                {notifications.length === 0 && (
                  <div className="rounded-[24px] border border-black/8 bg-black/[0.02] p-5 text-sm text-zinc-600">
                    Rien d'utile à remonter pour ce filtre pour le moment.
                  </div>
                )}
                {notifications.map((item) => (
                  <div key={item.id} className={`rounded-[24px] p-4 border ${item.level === "critical" ? "border-black bg-black text-white" : "border-black/8 bg-white text-zinc-800"}`}>
                    <div className="text-sm font-semibold">{item.title}</div>
                    <p className="text-sm mt-3 leading-relaxed opacity-90">{compactText(item.text, 96)}</p>
                    {item.href && (
                      <Link to={item.href} className={`mt-4 inline-flex items-center rounded-full px-4 py-2 text-sm font-medium ${item.level === "critical" ? "border border-white/15 bg-white/10 text-white" : "border border-black/8 bg-white text-zinc-700 hover:bg-black/[0.03]"}`}>
                        {item.cta || "Ouvrir"}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Vos contacts utiles" eyebrow="Parler à la bonne personne vite">
              <div className="space-y-3">
                {contacts.map((contact) => (
                  <div key={`${contact.label}-${contact.phone}`} className="rounded-[24px] border border-black/8 bg-black/[0.02] p-4">
                    <div className="text-sm font-semibold text-zinc-950">{contact.name}</div>
                    <div className="text-xs text-zinc-500 mt-1 uppercase tracking-[0.16em]">{contact.label}</div>
                    <p className="text-sm text-zinc-600 mt-2 leading-relaxed">{compactText(contact.note, 82)}</p>
                    <a
                      href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                      className="mt-4 inline-flex items-center gap-2 rounded-full bg-black text-white px-4 py-2 text-sm hover:bg-zinc-800"
                    >
                      <Phone className="w-4 h-4" />
                      Appeler {contact.name}
                    </a>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
