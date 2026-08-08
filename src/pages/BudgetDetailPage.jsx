import React, { useMemo } from "react";
import { Plus } from "lucide-react";
import WeddingToolTopBar from "@/components/aime/WeddingToolTopBar";
import { getBudgetSummary, readWeddingState, VENDOR_PAYMENT_STATUS, VENDOR_TAXONOMY } from "@/lib/aimeWeddingCore";

function formatMoney(value) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value || 0);
}

function percentage(current, total) {
  if (!total) return 0;
  return Math.min(100, Math.round((current / total) * 100));
}

function StatCard({ label, value, detail }) {
  return (
    <div className="rounded-[20px] border border-black/8 bg-white p-6 shadow-[0_10px_28px_rgba(12,12,12,0.03)]">
      <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">{label}</div>
      <div className="mt-6 font-display text-[2.4rem] md:text-[3rem] leading-none text-zinc-950">{value}</div>
      <div className="mt-5 border-t border-black/8 pt-4 text-sm text-zinc-500">{detail}</div>
    </div>
  );
}

function Donut({ percent }) {
  const circumference = 2 * Math.PI * 82;
  const offset = circumference - (percent / 100) * circumference;
  return (
    <div className="relative h-[220px] w-[220px] shrink-0">
      <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
        <circle cx="100" cy="100" r="82" stroke="#efebe4" strokeWidth="18" fill="none" />
        <circle cx="100" cy="100" r="82" stroke="#b9a47b" strokeWidth="18" fill="none" strokeDasharray={circumference} strokeDashoffset={circumference * 0.18} />
        <circle cx="100" cy="100" r="82" stroke="#111111" strokeWidth="18" fill="none" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="text-[11px] uppercase tracking-[0.14em] text-zinc-500">Dépensé</div>
        <div className="mt-3 font-display text-[3rem] text-zinc-950">{percent}%</div>
      </div>
    </div>
  );
}

function statusTone(value) {
  if (value === "paid") return "bg-[#edf4ef] text-[#567b61]";
  if (value === "scheduled") return "bg-[#f9f4ea] text-[#a18557]";
  return "bg-[#f6f3ed] text-zinc-600";
}

export default function BudgetDetailPage() {
  const state = useMemo(() => readWeddingState(), []);
  const budget = useMemo(() => getBudgetSummary(state), [state]);
  const items = state.budget?.items || [];
  const percentSpent = percentage(budget.current, budget.envelope);
  const estimatedSavings = Math.max(0, budget.envelope - budget.current - budget.pending);
  const restToPay = Math.max(0, budget.envelope - budget.current + budget.pending);
  const transactions = useMemo(() => {
    const vendorsById = new Map((state.vendors?.marketplace || []).map((vendor) => [vendor.id, vendor]));
    return (state.vendors?.payments || []).map((payment, index) => {
      const vendor = vendorsById.get(payment.vendorId);
      const categoryLabel = VENDOR_TAXONOMY.find((item) => item.id === vendor?.category)?.label || vendor?.category || "Prestataire";
      return {
        id: payment.id,
        reference: `EXP-${String(index + 1).padStart(3, "0")}`,
        label: payment.label,
        category: categoryLabel,
        date: new Date(payment.dueAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }),
        status: payment.status,
        statusLabel: VENDOR_PAYMENT_STATUS[payment.status]?.label || payment.status,
        amount: payment.amount || 0,
      };
    });
  }, [state]);

  const categoryRows = items.map((item) => ({
    label: item.label,
    current: item.current || 0,
    allocated: item.allocated || 0,
    color: item.id === "venue" ? "#111111" : item.id === "catering" ? "#555555" : item.id === "photo" ? "#9b968e" : item.id === "flowers" ? "#c9b48e" : "#dad7d1",
  }));

  return (
    <div className="min-h-screen bg-[#efefeb] overflow-x-hidden text-[var(--color-text-primary)]">
      <div className="min-h-screen p-2 md:p-6">
        <div className="mx-auto max-w-[1600px] rounded-[24px] bg-[#fbfaf7] shadow-[0_24px_70px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="p-3 md:p-4">
            <WeddingToolTopBar active="budget" names={state.meta?.couple || "Charlotte & Alexandre"} />
          </div>

          <div className="px-6 md:px-10 lg:px-16 pb-12 pt-6 md:pt-8">
            <div className="flex items-start justify-between gap-6 flex-wrap">
              <div>
                <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Accueil › Outils › <span className="text-zinc-900">Budget détaillé</span></div>
                <div className="mt-5 text-[11px] uppercase tracking-[0.16em] text-zinc-500">Gestion financière</div>
                <h1 className="mt-4 font-display text-[3.2rem] md:text-[4.8rem] leading-[0.94] text-zinc-950">Le Budget Détaillé</h1>
              </div>
              <button className="mt-4 rounded-full bg-black px-6 py-4 text-[15px] text-white hover:bg-zinc-800 inline-flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Ajouter une dépense
              </button>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Budget estimé" value={formatMoney(budget.envelope)} detail="Cible initiale" />
              <StatCard label="Total dépensé" value={formatMoney(budget.current)} detail={`${percentSpent}% du budget total`} />
              <StatCard label="Reste à payer" value={formatMoney(restToPay)} detail="Contrats en cours" />
              <StatCard label="Économies estimées" value={formatMoney(estimatedSavings)} detail="Négociations réussies" />
            </div>

            <section className="mt-10 rounded-[28px] border border-black/8 bg-white p-6 md:p-8 shadow-[0_12px_30px_rgba(12,12,12,0.03)]">
              <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:items-center">
                <Donut percent={percentSpent} />
                <div>
                  <h2 className="font-display text-[2.4rem] leading-[1] text-zinc-950">Répartition par Catégorie</h2>
                  <p className="mt-3 text-[15px] text-zinc-500">Visualisation de la ventilation des coûts par grands domaines de dépenses.</p>
                  <div className="mt-8 space-y-4">
                    {categoryRows.map((row) => (
                      <div key={row.label} className="flex items-center justify-between gap-4 text-sm">
                        <div className="inline-flex items-center gap-3 text-zinc-900">
                          <span className="h-4 w-4 rounded-[4px]" style={{ background: row.color }} />
                          {row.label}
                        </div>
                        <div className="text-zinc-900 font-medium">{formatMoney(row.current)} <span className="text-zinc-400">/ {formatMoney(row.allocated)}</span></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-12">
              <h2 className="font-display text-[2.4rem] leading-[1] text-zinc-950">Historique des Transactions</h2>
              <p className="mt-3 text-[15px] text-zinc-500">Registre complet de toutes les factures, acomptes et règlements effectués.</p>

              <div className="mt-8 overflow-hidden rounded-[22px] border border-black/8 bg-white shadow-[0_12px_30px_rgba(12,12,12,0.03)]">
                <div className="hidden md:grid grid-cols-[130px_1.8fr_1.2fr_1fr_1fr_140px] gap-4 px-6 py-4 text-[11px] uppercase tracking-[0.16em] text-zinc-500 border-b border-black/8">
                  <div>Référence</div>
                  <div>Libellé</div>
                  <div>Catégorie</div>
                  <div>Date de paiement</div>
                  <div>Statut</div>
                  <div className="text-right">Montant</div>
                </div>
                <div>
                  {transactions.map((item) => (
                    <div key={item.id} className="grid md:grid-cols-[130px_1.8fr_1.2fr_1fr_1fr_140px] gap-4 px-6 py-5 border-b border-black/8 last:border-b-0 text-sm items-center">
                      <div className="text-zinc-500">{item.reference}</div>
                      <div className="font-medium text-zinc-950">{item.label}</div>
                      <div><span className="rounded-full border border-black/8 bg-[var(--color-warm-white)] px-3 py-1.5 text-[12px] text-zinc-700">{item.category}</span></div>
                      <div className="text-zinc-600">{item.date}</div>
                      <div><span className={`rounded-full px-3 py-1.5 text-[12px] ${statusTone(item.status)}`}>{item.statusLabel}</span></div>
                      <div className="font-semibold text-zinc-950 md:text-right">{formatMoney(item.amount)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
