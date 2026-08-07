import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Clock3,
  CreditCard,
  Heart,
  Phone,
} from "lucide-react";
import { toast } from "sonner";
import ContactAvatarMenu from "@/components/aime/ContactAvatarMenu";
import WeddingPageHero from "@/components/aime/WeddingPageHero";
import {
  filterDocumentsByRole,
  filterTimelineByRole,
  getVendorById,
  readWeddingState,
  toggleVendorShortlistInState,
  updateVendorInState,
  updateVendorPaymentInState,
  VENDOR_PAYMENT_STATUS,
  VENDOR_TAXONOMY,
  writeWeddingState,
} from "@/lib/aimeWeddingCore";

const CONTACT_STAGES = [
  { id: "new", label: "Nouveau" },
  { id: "contacted", label: "Contacté" },
  { id: "quote", label: "Devis reçu" },
  { id: "booked", label: "Réservé" },
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

function compactText(value, max = 96) {
  if (!value) return "";
  const clean = value.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cutoff = clean.lastIndexOf(" ", max);
  return `${clean.slice(0, cutoff > 48 ? cutoff : max).trim()}…`;
}

function fmtMoney(value) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value || 0);
}

export default function VendorProfile() {
  const { vendorId } = useParams();
  const [state, setState] = useState(() => readWeddingState());

  useEffect(() => {
    writeWeddingState(state);
  }, [state]);

  const vendor = useMemo(() => getVendorById(state, vendorId), [state, vendorId]);
  const contact = vendor ? state.contacts?.[vendor.roleId] || state.contacts?.planning : null;
  const relevantDocs = useMemo(() => {
    if (!vendor) return [];
    const roleView = vendor.roleId === "planning" ? "planner" : "vendors";
    return filterDocumentsByRole(state.documents || [], roleView)
      .filter((doc) => doc.owner === vendor.roleId || doc.sharedWith.includes(vendor.roleId))
      .slice(0, 5);
  }, [state.documents, vendor]);
  const relevantSteps = useMemo(() => {
    if (!vendor) return [];
    const roleView = vendor.roleId === "planning" ? "planner" : "vendors";
    return filterTimelineByRole(state.timeline?.steps || [], roleView)
      .filter((step) => step.owners.includes(vendor.roleId))
      .slice(0, 5);
  }, [state.timeline?.steps, vendor]);
  const payments = useMemo(() => (state.vendors?.payments || []).filter((payment) => payment.vendorId === vendorId), [state.vendors?.payments, vendorId]);

  const toggleShortlist = () => {
    if (!vendor) return;
    setState((current) => toggleVendorShortlistInState(current, vendor.id));
    toast.success(vendor.shortlisted ? "Retiré de la shortlist" : "Ajouté à la shortlist");
  };

  const updateStage = (stage) => {
    if (!vendor) return;
    setState((current) => updateVendorInState(current, vendor.id, { contactStage: stage }));
    toast.success("Statut prestataire mis à jour");
  };

  const markPayment = (paymentId, status) => {
    setState((current) => updateVendorPaymentInState(current, paymentId, { status }));
    toast.success(status === "paid" ? "Paiement marqué comme payé" : "Paiement replanifié");
  };

  if (!vendor) {
    return (
      <div className="min-h-screen bg-[var(--color-warm-white)] px-5 py-12 text-zinc-900">
        <div className="max-w-[960px] mx-auto rounded-[32px] border border-black/8 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
          <div className="font-display text-4xl">Prestataire introuvable.</div>
          <Link to="/prestataires" className="inline-flex mt-6 rounded-full border border-black/8 bg-white px-4 py-2 text-sm text-zinc-700 hover:bg-black/[0.03]">
            Retour marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] text-[var(--color-text-primary)] overflow-x-hidden">
      <div className="max-w-[1380px] mx-auto px-5 md:px-8 lg:px-10 py-6 md:py-8">
        <div className="mb-8 md:mb-10">
          <WeddingPageHero
            eyebrow="Prestataire · fiche détaillée"
            title={vendor.name}
            description={compactText(vendor.summary, 120)}
            image="/landing/ares.jpg"
            stats={[
              { label: "Catégorie", value: VENDOR_TAXONOMY.find((item) => item.id === vendor.category)?.label || vendor.category, hint: vendor.city },
              { label: "Prix", value: fmtMoney(vendor.priceFrom), hint: "à partir de" },
              { label: "Réponse", value: vendor.responseTime, hint: "moyenne" },
              { label: "Avis", value: vendor.rating, hint: "clients" },
            ]}
            actions={(
              <>
                <button onClick={toggleShortlist} className={`rounded-full px-5 py-3 text-sm inline-flex items-center gap-2 ${vendor.shortlisted ? "bg-black text-white" : "aime-button-primary"}`}>
                  <Heart className="w-4 h-4" />
                  {vendor.shortlisted ? "Shortlisté" : "Ajouter shortlist"}
                </button>
                {contact?.phone && (
                  <a href={`tel:${contact.phone.replace(/\s+/g, "")}`} className="rounded-full border border-white/12 px-5 py-3 text-sm text-white/88 hover:bg-white/5 inline-flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Appeler
                  </a>
                )}
              </>
            )}
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-[0.88fr_1.12fr] items-start">
          <div className="space-y-4">
            <Card title="Contact & réservation" eyebrow="Statut métier" action={<ContactAvatarMenu contact={contact} vendorId={vendor.id} />}>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-[22px] border border-black/8 bg-black/[0.02] p-4">
                  <div className="aime-label text-zinc-500 mb-2">Réservation</div>
                  <div className="text-sm font-semibold text-zinc-950">{vendor.status}</div>
                  <div className="text-sm text-zinc-600 mt-3">{vendor.paymentStatus}</div>
                </div>
                <div className="rounded-[22px] border border-black/8 bg-black/[0.02] p-4">
                  <div className="aime-label text-zinc-500 mb-2">Suivi</div>
                  <div className="text-sm font-semibold text-zinc-950">{CONTACT_STAGES.find((item) => item.id === vendor.contactStage)?.label || vendor.contactStage}</div>
                  <div className="text-sm text-zinc-600 mt-3">{vendor.nextTouchpointAt ? new Date(vendor.nextTouchpointAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }) : "Aucun point fixé"}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {CONTACT_STAGES.map((stage) => (
                  <button
                    key={stage.id}
                    onClick={() => updateStage(stage.id)}
                    className={`rounded-full px-4 py-2 text-sm ${vendor.contactStage === stage.id ? "bg-black text-white" : "bg-white border border-black/8 text-zinc-700"}`}
                  >
                    {stage.label}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {vendor.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-black/8 bg-white px-3 py-1.5 text-xs text-zinc-700">
                    {tag}
                  </span>
                ))}
              </div>
            </Card>

            <Card title="Paiements" eyebrow="Acompte, solde, options" action={<CreditCard className="w-4 h-4 text-zinc-500" />}>
              <div className="space-y-3">
                {payments.map((payment) => (
                  <div key={payment.id} className="rounded-[22px] border border-black/8 bg-black/[0.02] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-zinc-950">{payment.label}</div>
                        <div className="text-xs text-zinc-500 mt-2 uppercase tracking-[0.16em]">{VENDOR_PAYMENT_STATUS[payment.status]?.label || payment.status}</div>
                      </div>
                      <div className="text-sm font-semibold text-zinc-950">{fmtMoney(payment.amount)}</div>
                    </div>
                    <div className="text-sm text-zinc-600 mt-3">Échéance {new Date(payment.dueAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}</div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <button onClick={() => markPayment(payment.id, "paid")} className="rounded-full bg-black text-white px-4 py-2 text-sm">Marquer payé</button>
                      <button onClick={() => markPayment(payment.id, "scheduled")} className="rounded-full border border-black/8 bg-white px-4 py-2 text-sm text-zinc-700">Replanifier</button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card title="Documents liés" eyebrow="Ce que ce prestataire doit voir">
              <div className="space-y-3">
                {relevantDocs.map((doc) => (
                  <div key={doc.id} className="rounded-[22px] border border-black/8 bg-white p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-semibold text-zinc-950">{doc.title}</div>
                      <div className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">{doc.status}</div>
                    </div>
                    <div className="text-sm text-zinc-600 mt-3">{compactText(doc.summary, 96)}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Présence Jour J" eyebrow="Créneaux et séquences">
              <div className="space-y-3">
                {relevantSteps.map((step) => (
                  <div key={step.id} className="rounded-[22px] border border-black/8 bg-white p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-semibold text-zinc-950">{step.time} · {step.title}</div>
                      <div className="inline-flex items-center gap-1 text-zinc-700 text-sm"><Clock3 className="w-3.5 h-3.5" /> {step.status}</div>
                    </div>
                    <div className="text-sm text-zinc-600 mt-3">{compactText(step.detail, 96)}</div>
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
