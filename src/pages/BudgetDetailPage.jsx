import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { CreditCard, MoveRight, ShieldAlert } from "lucide-react";
import WeddingModuleHeader from "@/components/aime/WeddingModuleHeader";
import { getBudgetSummary, getVendorCommitments, getVendorPaymentSummary, readWeddingState } from "@/lib/aimeWeddingCore";

function fmtMoney(value) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value || 0);
}

function Surface({ children, className = "" }) {
  return <section className={`rounded-[30px] border border-black/8 bg-white shadow-[0_18px_48px_rgba(12,12,12,0.06)] ${className}`}>{children}</section>;
}

function SectionHeading({ eyebrow, title, action = null }) {
  return <div className="flex items-end justify-between gap-4"><div>{eyebrow && <div className="aime-label text-zinc-500 mb-2">{eyebrow}</div>}<h2 className="text-[1.55rem] md:text-[1.8rem] font-display leading-[1.02] text-zinc-950">{title}</h2></div>{action}</div>;
}

export default function BudgetDetailPage() {
  const state = useMemo(() => readWeddingState(), []);
  const budget = useMemo(() => getBudgetSummary(state), [state]);
  const payments = useMemo(() => getVendorPaymentSummary(state), [state]);
  const items = state.budget?.items || [];
  const commitments = useMemo(() => getVendorCommitments(state).filter((item) => item.kind === "invoice"), [state]);

  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] text-[var(--color-text-primary)] overflow-x-hidden">
      <div className="mx-auto max-w-[1320px] px-5 pb-12 pt-24 md:px-8 md:pb-16 lg:px-10">
        <div className="mb-8 md:mb-10">
          <WeddingModuleHeader
            universeId="zeus"
            eyebrow="Zeus · budget détaillé"
            title="Répartition, tension et arbitrages du budget."
            description="La couche détaillée de Zeus : catégories, engagement réel, dérives, pièces prestataires et impact direct sur le reste du mariage."
            stats={[
              { label: "Enveloppe", value: fmtMoney(budget.envelope), detail: "globale" },
              { label: "Engagé", value: fmtMoney(budget.current), detail: fmtMoney(budget.remaining) + " restants" },
              { label: "À arbitrer", value: fmtMoney(budget.pending), detail: "décisions ouvertes" },
              { label: "Paiements dus", value: fmtMoney(payments.due), detail: `${payments.openCount} ouverts` },
            ]}
            actions={[
              { to: "/budget", label: "Module budget" },
              { to: "/univers/zeus", label: "Retour Zeus" },
            ]}
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-[0.98fr_1.02fr]">
          <Surface className="p-5 md:p-6">
            <SectionHeading eyebrow="Répartition" title="Budget par catégorie" />
            <div className="mt-5 space-y-4">
              {items.map((item) => {
                const ratio = Math.min(100, Math.round(((item.current || 0) / Math.max(item.allocated || 1, 1)) * 100));
                const over = Math.max(0, (item.current || 0) - (item.allocated || 0));
                return (
                  <div key={item.id} className="rounded-[22px] border border-black/8 bg-[var(--color-warm-white)] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-zinc-950">{item.label}</div>
                        <div className="mt-1 text-sm text-zinc-500">{item.owner} · {item.status}</div>
                      </div>
                      <div className="text-sm font-semibold text-zinc-950">{fmtMoney(item.current)} / {fmtMoney(item.allocated)}</div>
                    </div>
                    <div className="mt-4 h-2 rounded-full bg-black/8 overflow-hidden"><div className="h-full bg-black" style={{ width: `${ratio}%` }} /></div>
                    {over > 0 && <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm text-white"><ShieldAlert className="h-4 w-4" />Dépassement de {fmtMoney(over)}</div>}
                  </div>
                );
              })}
            </div>
          </Surface>

          <div className="space-y-4">
            <Surface className="p-5 md:p-6">
              <SectionHeading eyebrow="Tension réelle" title="Vue synthèse" />
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[22px] border border-black/8 bg-white p-4"><div className="aime-label text-zinc-500">Alloué</div><div className="mt-3 font-display text-[2rem] text-zinc-950">{fmtMoney(budget.allocated)}</div></div>
                <div className="rounded-[22px] border border-black/8 bg-white p-4"><div className="aime-label text-zinc-500">Reste</div><div className="mt-3 font-display text-[2rem] text-zinc-950">{fmtMoney(budget.remaining)}</div></div>
                <div className="rounded-[22px] border border-black/8 bg-white p-4"><div className="aime-label text-zinc-500">Planifié</div><div className="mt-3 font-display text-[2rem] text-zinc-950">{fmtMoney(payments.scheduled)}</div></div>
                <div className="rounded-[22px] border border-black/8 bg-white p-4"><div className="aime-label text-zinc-500">Payé</div><div className="mt-3 font-display text-[2rem] text-zinc-950">{fmtMoney(payments.paid)}</div></div>
              </div>
            </Surface>

            <Surface className="p-5 md:p-6">
              <SectionHeading eyebrow="Pièces prestataires" title="Factures & règlements" action={<Link to="/budget" className="text-sm text-zinc-600 hover:text-zinc-950 inline-flex items-center gap-2">Voir le module <MoveRight className="h-4 w-4" /></Link>} />
              <div className="mt-5 space-y-3">
                {commitments.slice(0, 6).map((item) => (
                  <div key={item.id} className="rounded-[22px] border border-black/8 bg-white p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-zinc-950">{item.label}</div>
                        <div className="mt-1 text-sm text-zinc-500">{item.status}</div>
                      </div>
                      <div className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-950"><CreditCard className="h-4 w-4" />{fmtMoney(item.amount)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Surface>
          </div>
        </div>
      </div>
    </div>
  );
}
