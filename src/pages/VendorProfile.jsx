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
import { getVendorVisual } from "@/lib/aimeVendorVisuals";
import {
  filterDocumentsByRole,
  filterTimelineByRole,
  getVendorById,
  getVendorCommitments,
  readWeddingState,
  toggleVendorShortlistInState,
  updateVendorCommitmentInState,
  updateVendorInState,
  updateVendorPaymentInState,
  VENDOR_BOOKING_STAGES,
  VENDOR_COMMITMENT_STATUS,
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

const BOOKING_STAGES = Object.entries(VENDOR_BOOKING_STAGES).map(([id, value]) => ({
  id,
  label: value.label,
}));

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

function formatShortDate(value) {
  if (!value) return "Aucune date";
  return new Date(value).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

function commitmentKindLabel(kind = "quote") {
  if (kind === "contract") return "Contrat";
  if (kind === "invoice") return "Facture";
  return "Devis";
}

function commitmentStatusOptions(kind = "quote") {
  if (kind === "contract") return ["missing", "sent", "signed"];
  if (kind === "invoice") return ["due", "scheduled", "paid"];
  return ["received", "approved"];
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
  const commitments = useMemo(() => getVendorCommitments(state, vendorId), [state, vendorId]);
  const vendorVisual = vendor ? getVendorVisual(vendor) : "/landing/hero-aime-wedding.jpg";

  const toggleShortlist = () => {
    if (!vendor) return;
    setState((current) => toggleVendorShortlistInState(current, vendor.id));
    toast.success(vendor.shortlisted ? "Retiré de la shortlist" : "Ajouté à la shortlist");
  };

  const updateStage = (stage) => {
    if (!vendor) return;
    setState((current) => updateVendorInState(current, vendor.id, { contactStage: stage }));
    toast.success("Suivi de contact mis à jour");
  };

  const updateBookingStage = (stage) => {
    if (!vendor) return;
    setState((current) => updateVendorInState(current, vendor.id, { bookingStage: stage }));
    toast.success("Étape d'engagement mise à jour");
  };

  const updateCommitmentStatus = (commitmentId, status) => {
    setState((current) => {
      const commitment = (current.vendors?.commitments || []).find((item) => item.id === commitmentId);
      let next = updateVendorCommitmentInState(current, commitmentId, { status });

      if (commitment?.kind === "invoice") {
        const payment = (current.vendors?.payments || []).find((item) => item.vendorId === commitment.vendorId && Math.abs((item.amount || 0) - (commitment.amount || 0)) < 1);
        if (payment) {
          next = updateVendorPaymentInState(next, payment.id, {
            status: status === "paid" ? "paid" : status === "scheduled" ? "scheduled" : "due",
          });
        }
      }

      return next;
    });
    toast.success("Pièce prestataire mise à jour");
  };

  const markPayment = (paymentId, status) => {
    setState((current) => {
      const payment = (current.vendors?.payments || []).find((item) => item.id === paymentId);
      let next = updateVendorPaymentInState(current, paymentId, { status });

      if (payment) {
        const commitment = (current.vendors?.commitments || []).find((item) => item.vendorId === payment.vendorId && item.kind === "invoice" && Math.abs((item.amount || 0) - (payment.amount || 0)) < 1);
        if (commitment) {
          next = updateVendorCommitmentInState(next, commitment.id, { status });
        }
      }

      return next;
    });
    toast.success(status === "paid" ? "Paiement marqué comme payé" : "Paiement replanifié");
  };

  if (!vendor) {
    return (
      <div className="min-h-screen bg-[var(--color-warm-white)] px-5 py-12 text-zinc-900">
        <div className="max-w-[960px] mx-auto rounded-[32px] border border-black/8 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
          <div className="font-display text-4xl">Prestataire introuvable.</div>
          <Link to="/prestataires/registre" className="inline-flex mt-6 rounded-full border border-black/8 bg-white px-4 py-2 text-sm text-zinc-700 hover:bg-black/[0.03]">
            Retour registre
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
            image={vendorVisual}
            stats={[
              { label: "Catégorie", value: VENDOR_TAXONOMY.find((item) => item.id === vendor.category)?.label || vendor.category, hint: vendor.city },
              { label: "Prix", value: fmtMoney(vendor.priceFrom), hint: "à partir de" },
              { label: "Engagement", value: VENDOR_BOOKING_STAGES[vendor.bookingStage]?.label || "À structurer", hint: "actuel" },
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

        <div className="grid gap-4 xl:grid-cols-[0.92fr_1.08fr] items-start">
          <div className="space-y-4">
            <Card title="Suivi d'engagement" eyebrow="Contact, validation, verrouillage" action={<ContactAvatarMenu contact={contact} vendorId={vendor.id} />}>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-[22px] border border-black/8 bg-black/[0.02] p-4">
                  <div className="aime-label text-zinc-500 mb-2">Réservation</div>
                  <div className="text-sm font-semibold text-zinc-950">{vendor.status}</div>
                  <div className="text-sm text-zinc-600 mt-3">{vendor.paymentStatus}</div>
                </div>
                <div className="rounded-[22px] border border-black/8 bg-black/[0.02] p-4">
                  <div className="aime-label text-zinc-500 mb-2">Prochain point</div>
                  <div className="text-sm font-semibold text-zinc-950">{formatShortDate(vendor.nextTouchpointAt)}</div>
                  <div className="text-sm text-zinc-600 mt-3">{vendor.bookedAt ? `Réservé le ${formatShortDate(vendor.bookedAt)}` : "Pas encore verrouillé"}</div>
                </div>
              </div>

              <div className="mt-4">
                <div className="text-sm font-semibold text-zinc-950 mb-3">Suivi contact</div>
                <div className="flex flex-wrap gap-2">
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
              </div>

              <div className="mt-4">
                <div className="text-sm font-semibold text-zinc-950 mb-3">Étape engagement</div>
                <div className="flex flex-wrap gap-2">
                  {BOOKING_STAGES.map((stage) => (
                    <button
                      key={stage.id}
                      onClick={() => updateBookingStage(stage.id)}
                      className={`rounded-full px-4 py-2 text-sm ${vendor.bookingStage === stage.id ? "bg-black text-white" : "bg-white border border-black/8 text-zinc-700"}`}
                    >
                      {stage.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {vendor.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-black/8 bg-white px-3 py-1.5 text-xs text-zinc-700">
                    {tag}
                  </span>
                ))}
              </div>
            </Card>

            <Card title="Devis, contrat, facture" eyebrow="Le cycle de validation complet">
              <div className="space-y-3">
                {commitments.map((item) => (
                  <div key={item.id} className={`rounded-[22px] border p-4 ${["missing", "due"].includes(item.status) ? "border-black bg-black text-white" : "border-black/8 bg-black/[0.02] text-zinc-900"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold">{item.label}</div>
                        <div className="text-xs uppercase tracking-[0.16em] mt-2 opacity-70">
                          {commitmentKindLabel(item.kind)} · {VENDOR_COMMITMENT_STATUS[item.status]?.label || item.status}
                        </div>
                      </div>
                      <div className="text-sm font-semibold">{fmtMoney(item.amount)}</div>
                    </div>

                    <p className="text-sm mt-3 opacity-85 leading-relaxed">{compactText(item.note, 104)}</p>
                    <div className="text-sm mt-3 opacity-80">Échéance {formatShortDate(item.dueAt)}</div>

                    <div className="mt-4 grid md:grid-cols-[1fr_auto] gap-3 items-center">
                      <select
                        value={item.status}
                        onChange={(event) => updateCommitmentStatus(item.id, event.target.value)}
                        className={`rounded-[16px] px-4 py-3 text-sm ${["missing", "due"].includes(item.status) ? "border border-white/15 bg-white/10 text-white" : "border border-black/8 bg-white text-zinc-800"}`}
                      >
                        {commitmentStatusOptions(item.kind).map((status) => (
                          <option key={status} value={status} className="text-zinc-900">
                            {VENDOR_COMMITMENT_STATUS[status]?.label || status}
                          </option>
                        ))}
                      </select>

                      {item.kind === "invoice" && (
                        <Link to="/budget" className={`rounded-full px-4 py-2 text-sm ${["missing", "due"].includes(item.status) ? "border border-white/15 bg-white/10 text-white" : "border border-black/8 bg-white text-zinc-700 hover:bg-black/[0.03]"}`}>
                          Voir budget
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Paiements" eyebrow="Acompte, solde, options" action={<CreditCard className="w-4 h-4 text-zinc-500" />}>
              <div className="space-y-3">
                {payments.map((payment) => (
                  <div key={payment.id} className={`rounded-[22px] border p-4 ${payment.status === "due" ? "border-black bg-black text-white" : "border-black/8 bg-black/[0.02] text-zinc-900"}`}>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold">{payment.label}</div>
                        <div className="text-xs uppercase tracking-[0.16em] mt-2 opacity-70">{VENDOR_PAYMENT_STATUS[payment.status]?.label || payment.status}</div>
                      </div>
                      <div className="text-sm font-semibold">{fmtMoney(payment.amount)}</div>
                    </div>
                    <div className="text-sm mt-3 opacity-85">Échéance {formatShortDate(payment.dueAt)}</div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <button onClick={() => markPayment(payment.id, "paid")} className={`rounded-full px-4 py-2 text-sm ${payment.status === "due" ? "border border-white/15 bg-white/10 text-white" : "bg-black text-white"}`}>
                        Marquer payé
                      </button>
                      <button onClick={() => markPayment(payment.id, "scheduled")} className={`rounded-full px-4 py-2 text-sm ${payment.status === "due" ? "border border-white/15 bg-white/10 text-white" : "border border-black/8 bg-white text-zinc-700"}`}>
                        Replanifier
                      </button>
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
                {relevantDocs.length === 0 && (
                  <div className="rounded-[22px] border border-black/8 bg-black/[0.02] p-4 text-sm text-zinc-600">
                    Aucun document spécifique pour ce prestataire pour le moment.
                  </div>
                )}
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
                {relevantSteps.length === 0 && (
                  <div className="rounded-[22px] border border-black/8 bg-black/[0.02] p-4 text-sm text-zinc-600">
                    Aucun créneau dédié à afficher pour ce prestataire.
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
