import React, { useEffect, useMemo, useState } from "react";
import {
  Check,
  CreditCard,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import WeddingPageHero from "@/components/aime/WeddingPageHero";
import {
  applyBudgetDecisionInState,
  getBudgetSummary,
  getVendorPaymentSummary,
  readWeddingState,
  updateBudgetItemInState,
  updateVendorPaymentInState,
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
  const items = state.budget?.items || [];
  const decisions = state.budget?.decisions || [];
  const payments = state.vendors?.payments || [];
  const vendors = state.vendors?.marketplace || [];

  const updateItem = (itemId, patch) => {
    setState((current) => updateBudgetItemInState(current, itemId, patch));
  };

  const applyDecision = (decisionId, action) => {
    setState((current) => applyBudgetDecisionInState(current, decisionId, action));
    toast.success(action === "approve" ? "Arbitrage approuvé" : "Arbitrage reporté");
  };

  const markPayment = (paymentId, status = "paid") => {
    setState((current) => updateVendorPaymentInState(current, paymentId, { status }));
    toast.success(status === "paid" ? "Paiement marqué comme payé" : "Paiement replanifié");
  };

  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] text-[var(--color-text-primary)] overflow-x-hidden">
      <div className="max-w-[1480px] mx-auto px-5 md:px-8 lg:px-10 py-6 md:py-8">

        <div className="mb-8 md:mb-10">
          <WeddingPageHero
            eyebrow="Budget · arbitrages · conséquences"
            title="Le budget du mariage, en un coup d'œil."
            description="Enveloppe, engagé, marge, arbitrages : tout est visible tout de suite."
            image="/landing/demeter.jpg"
            stats={[
              { label: "Enveloppe", value: fmtMoney(summary.envelope), hint: "globale" },
              { label: "Engagé", value: fmtMoney(summary.current), hint: "réel" },
              { label: "Paiements", value: fmtMoney(paymentSummary.due), hint: "à payer" },
              { label: "Arbitrages", value: decisions.filter((item) => item.status === "pending").length, hint: "ouverts" },
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
                        <div className={`h-full ${over > 0 ? "bg-rose-500" : "bg-black"}`} style={{ width: `${fill}%` }} />
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
                        <div className="mt-4 rounded-[18px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 inline-flex items-center gap-2">
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
            <Card title="Paiements prestataires" eyebrow="Acomptes & soldes">
              <div className="space-y-3">
                {payments.map((payment) => {
                  const vendor = vendors.find((item) => item.id === payment.vendorId);
                  return (
                    <div key={payment.id} className="rounded-[24px] border border-black/8 bg-black/[0.02] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-zinc-950">{vendor?.name || "Prestataire"}</div>
                          <div className="text-xs text-zinc-500 mt-2 uppercase tracking-[0.16em]">{payment.label}</div>
                        </div>
                        <div className="text-sm font-semibold text-zinc-950">{fmtMoney(payment.amount)}</div>
                      </div>
                      <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-black/8 bg-white px-3 py-1.5 text-xs text-zinc-700">
                        <CreditCard className="w-3.5 h-3.5" />
                        {VENDOR_PAYMENT_STATUS[payment.status]?.label || payment.status} · {new Date(payment.dueAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-4">
                        <button onClick={() => markPayment(payment.id, "paid")} className="rounded-full bg-black text-white px-4 py-2 text-sm hover:bg-zinc-800">
                          Marquer payé
                        </button>
                        <button onClick={() => markPayment(payment.id, "scheduled")} className="rounded-full border border-black/8 bg-white px-4 py-2 text-sm text-zinc-700 hover:bg-black/[0.03]">
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
                  <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-800">
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
