import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Check,
  CreditCard,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import WeddingModuleHeader from "@/components/aime/WeddingModuleHeader";
import {
  applyBudgetDecisionInState,
  getBudgetSummary,
  getVendorCommitments,
  getVendorCommitmentSummary,
  getVendorPaymentSummary,
  readWeddingState,
  updateBudgetItemInState,
  updateVendorCommitmentInState,
  updateVendorPaymentInState,
  VENDOR_COMMITMENT_STATUS,
  VENDOR_PAYMENT_STATUS,
  writeWeddingState,
} from "@/lib/aimeWeddingCore";

function fmtMoney(value) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value || 0);
}

function compactText(value, max = 88) {
  if (!value) return "";
  const clean = value.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cutoff = clean.lastIndexOf(" ", max);
  return `${clean.slice(0, cutoff > 44 ? cutoff : max).trim()}…`;
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

export default function WeddingBudget() {
  const [state, setState] = useState(() => readWeddingState());

  useEffect(() => {
    writeWeddingState(state);
  }, [state]);

  const summary = useMemo(() => getBudgetSummary(state), [state]);
  const paymentSummary = useMemo(() => getVendorPaymentSummary(state), [state]);
  const commitmentSummary = useMemo(() => getVendorCommitmentSummary(state), [state]);
  const items = state.budget?.items || [];
  const decisions = state.budget?.decisions || [];
  const payments = state.vendors?.payments || [];
  const vendors = state.vendors?.marketplace || [];
  const openCommitments = useMemo(() => getVendorCommitments(state)
    .filter((item) => ["received", "sent", "missing", "due", "scheduled"].includes(item.status))
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime()), [state]);

  const updateItem = (itemId, patch) => {
    setState((current) => updateBudgetItemInState(current, itemId, patch));
  };

  const applyDecision = (decisionId, action) => {
    setState((current) => applyBudgetDecisionInState(current, decisionId, action));
    toast.success(action === "approve" ? "Arbitrage approuvé" : "Arbitrage reporté");
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
    toast.success("Étape prestataire mise à jour");
  };

  const markPayment = (paymentId, status = "paid") => {
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

  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] text-[var(--color-text-primary)] overflow-x-hidden">
      <div className="max-w-[1480px] mx-auto px-5 md:px-8 lg:px-10 py-6 md:py-8">
        <div className="mb-8 md:mb-10">
          <WeddingModuleHeader
            universeId="demeter"
            eyebrow="Déméter · budget · réception"
            title="Le budget du mariage, vraiment pilotable."
            description="Postes, validations prestataires, contrats, factures et arbitrages : tout reste lisible sur un seul écran, relié aux vraies contraintes de réception."
            stats={[
              { label: "Enveloppe", value: fmtMoney(summary.envelope), detail: "globale" },
              { label: "Engagé", value: fmtMoney(summary.current), detail: "réel" },
              { label: "Validations", value: commitmentSummary.quotesPending + commitmentSummary.contractsPending, detail: "ouvertes" },
              { label: "Factures dues", value: fmtMoney(commitmentSummary.dueAmount), detail: "immédiates" },
            ]}
            actions={[
              { to: "/prestataires/registre?category=catering", label: "Voir le traiteur" },
              { to: "/invites?role=planner", label: "Tables & invités" },
              { to: "/documents?role=planner", label: "Documents liés" },
            ]}
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-[1fr_1fr] items-start">
          <div className="space-y-4">
            <Card title="Postes budgétaires" eyebrow="Lecture claire par poste">
              <div className="space-y-4">
                {items.map((item) => {
                  const fill = Math.min(100, Math.round(((item.current || 0) / Math.max(item.allocated || 1, 1)) * 100));
                  const over = Math.max(0, (item.current || 0) - (item.allocated || 0));
                  return (
                    <div key={item.id} className="rounded-[24px] border border-black/8 bg-black/[0.02] p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-zinc-950">{item.label}</div>
                          <div className="text-xs text-zinc-500 mt-2 uppercase tracking-[0.16em]">{item.owner} · {item.status}</div>
                        </div>
                        <div className="text-sm text-zinc-700">{fmtMoney(item.current)} / {fmtMoney(item.allocated)}</div>
                      </div>
                      <div className="h-2 rounded-full bg-black/[0.06] mt-4 overflow-hidden">
                        <div className="h-full bg-black" style={{ width: `${fill}%` }} />
                      </div>
                      <div className="grid md:grid-cols-2 gap-3 mt-4">
                        <label className="block">
                          <span className="aime-label text-zinc-500">Engagé</span>
                          <input
                            type="number"
                            value={item.current}
                            onChange={(e) => updateItem(item.id, { current: Number(e.target.value) || 0 })}
                            className="mt-2 w-full rounded-[16px] border border-black/8 bg-white px-4 py-3 text-sm text-zinc-800"
                          />
                        </label>
                        <label className="block">
                          <span className="aime-label text-zinc-500">Statut</span>
                          <select
                            value={item.status}
                            onChange={(e) => updateItem(item.id, { status: e.target.value })}
                            className="mt-2 w-full rounded-[16px] border border-black/8 bg-white px-4 py-3 text-sm text-zinc-800"
                          >
                            <option value="verrouillé">verrouillé</option>
                            <option value="en arbitrage">en arbitrage</option>
                            <option value="à confirmer">à confirmer</option>
                            <option value="réserve">réserve</option>
                            <option value="en cours">en cours</option>
                          </select>
                        </label>
                      </div>
                      <p className="text-sm text-zinc-600 mt-4 leading-relaxed">{compactText(item.note, 86)}</p>
                      {over > 0 && (
                        <div className="mt-4 rounded-[18px] border border-black bg-black px-4 py-3 text-sm text-white inline-flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4" />
                          Dépassement de {fmtMoney(over)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card title="Devis, contrats, factures" eyebrow="Le vrai cycle prestataire">
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
                  const vendor = vendors.find((entry) => entry.id === item.vendorId);
                  const dark = ["missing", "due"].includes(item.status);
                  return (
                    <div key={item.id} className={`rounded-[24px] border p-4 ${dark ? "border-black bg-black text-white" : "border-black/8 bg-black/[0.02] text-zinc-900"}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold">{vendor?.name || "Prestataire"}</div>
                          <div className="text-xs uppercase tracking-[0.16em] mt-2 opacity-70">
                            {commitmentKindLabel(item.kind)} · {VENDOR_COMMITMENT_STATUS[item.status]?.label || item.status}
                          </div>
                        </div>
                        <div className="text-sm font-semibold">{fmtMoney(item.amount)}</div>
                      </div>

                      <div className="text-sm mt-3 opacity-85">{item.label} · échéance {formatShortDate(item.dueAt)}</div>
                      <p className="text-sm mt-3 opacity-80 leading-relaxed">{compactText(item.note, 96)}</p>

                      <div className="grid md:grid-cols-[1fr_auto] gap-3 mt-4 items-center">
                        <select
                          value={item.status}
                          onChange={(event) => updateCommitmentStatus(item.id, event.target.value)}
                          className={`rounded-[16px] px-4 py-3 text-sm ${dark ? "border border-white/15 bg-white/10 text-white" : "border border-black/8 bg-white text-zinc-800"}`}
                        >
                          {commitmentStatusOptions(item.kind).map((status) => (
                            <option key={status} value={status} className="text-zinc-900">
                              {VENDOR_COMMITMENT_STATUS[status]?.label || status}
                            </option>
                          ))}
                        </select>
                        {vendor && (
                          <Link to={`/prestataires/${vendor.id}`} className={`rounded-full px-4 py-2 text-sm ${dark ? "border border-white/15 bg-white/10 text-white" : "border border-black/8 bg-white text-zinc-700 hover:bg-black/[0.03]"}`}>
                            Ouvrir la fiche
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}

                {openCommitments.length === 0 && (
                  <div className="rounded-[24px] border border-black/8 bg-black/[0.02] p-5 text-sm text-zinc-600">
                    Aucun devis, contrat ou facture à suivre pour le moment.
                  </div>
                )}
              </div>
            </Card>

            <Card title="Paiements prestataires" eyebrow="Acomptes & soldes">
              <div className="space-y-3">
                {payments.map((payment) => {
                  const vendor = vendors.find((item) => item.id === payment.vendorId);
                  const dark = payment.status === "due";
                  return (
                    <div key={payment.id} className={`rounded-[24px] border p-4 ${dark ? "border-black bg-black text-white" : "border-black/8 bg-black/[0.02] text-zinc-900"}`}>
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold">{vendor?.name || "Prestataire"}</div>
                          <div className="text-xs uppercase tracking-[0.16em] mt-2 opacity-70">{payment.label}</div>
                        </div>
                        <div className="text-sm font-semibold">{fmtMoney(payment.amount)}</div>
                      </div>
                      <div className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs ${dark ? "border border-white/15 bg-white/10 text-white" : "border border-black/8 bg-white text-zinc-700"}`}>
                        <CreditCard className="w-3.5 h-3.5" />
                        {VENDOR_PAYMENT_STATUS[payment.status]?.label || payment.status} · {formatShortDate(payment.dueAt)}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-4">
                        <button onClick={() => markPayment(payment.id, "paid")} className={`rounded-full px-4 py-2 text-sm ${dark ? "border border-white/15 bg-white/10 text-white" : "bg-black text-white hover:bg-zinc-800"}`}>
                          Marquer payé
                        </button>
                        <button onClick={() => markPayment(payment.id, "scheduled")} className={`rounded-full px-4 py-2 text-sm ${dark ? "border border-white/15 bg-white/10 text-white" : "border border-black/8 bg-white text-zinc-700 hover:bg-black/[0.03]"}`}>
                          Replanifier
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card title="Arbitrages en attente" eyebrow="Décider avant que le budget dérive">
              <div className="space-y-3">
                {decisions.filter((item) => item.status === "pending").map((decision) => (
                  <div key={decision.id} className="rounded-[24px] border border-black/8 bg-black/[0.02] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-zinc-950">{decision.title}</div>
                        <div className="text-xs text-zinc-500 mt-2 uppercase tracking-[0.16em]">Échéance {new Date(decision.dueAt).toLocaleString("fr-FR")}</div>
                      </div>
                      <div className="text-sm font-semibold text-zinc-950">{fmtMoney(decision.amount)}</div>
                    </div>
                    <p className="text-sm text-zinc-600 mt-3 leading-relaxed">{compactText(decision.detail, 92)}</p>
                    <p className="text-sm text-zinc-700 mt-3 leading-relaxed">{compactText(decision.impact, 88)}</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <button onClick={() => applyDecision(decision.id, "approve")} className="rounded-full bg-black text-white px-4 py-2 text-sm inline-flex items-center gap-2 hover:bg-zinc-800">
                        <Check className="w-4 h-4" />
                        Approuver
                      </button>
                      <button onClick={() => applyDecision(decision.id, "defer")} className="rounded-full border border-black/8 bg-white px-4 py-2 text-sm text-zinc-700 hover:bg-black/[0.03]">
                        Reporter
                      </button>
                    </div>
                  </div>
                ))}
                {decisions.filter((item) => item.status === "pending").length === 0 && (
                  <div className="rounded-[24px] border border-black/8 bg-black/[0.02] p-5 text-sm text-zinc-600">
                    Aucun arbitrage ouvert pour le moment.
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
