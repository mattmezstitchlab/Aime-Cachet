import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";
import WeddingToolTopBar from "@/components/aime/WeddingToolTopBar";
import { readWeddingState } from "@/lib/aimeWeddingCore";

const UNPLACED = [
  { id: "u1", name: "Sébastien Moreau", meta: "Famille Charlotte" },
  { id: "u2", name: "Clotilde Masson", meta: "Famille Charlotte" },
  { id: "u3", name: "Jean-Pierre Lefebvre", meta: "Ami Alexandre" },
  { id: "u4", name: "Bérénice Dubois", meta: "Amie Charlotte" },
  { id: "u5", name: "Charles-Antoine Petit", meta: "Collègue" },
  { id: "u6", name: "Marie-Thérèse Girard", meta: "Famille Alexandre" },
  { id: "u7", name: "Guillaume Lemaire", meta: "Ami Alexandre" },
  { id: "u8", name: "Sophie Roussel", meta: "Amie Alexandre" },
];

function TableCard({ index, filled = 12, total = 12, highlight = false }) {
  const percent = Math.min(100, Math.round((filled / total) * 100));
  return (
    <div className={`rounded-[18px] border p-4 h-[220px] flex flex-col items-center justify-between ${highlight ? "border-[#bba57c] bg-[#fffdf8]" : "border-black/8 bg-white"}`}>
      <div className="h-20 w-20 rounded-full border border-black/8 flex items-center justify-center text-[1.55rem] font-semibold text-zinc-950">{index}</div>
      <div className="text-center">
        <div className="font-medium text-zinc-950">{index === 1 ? "Table d'Honneur" : `Table ${index}`}</div>
        <div className="mt-1 text-sm text-zinc-500">{filled} / {total} p.</div>
      </div>
      <div className="w-full h-1.5 rounded-full bg-black/8 overflow-hidden"><div className={`h-full ${filled >= total ? "bg-[#bba57c]" : "bg-black"}`} style={{ width: `${percent}%` }} /></div>
    </div>
  );
}

export default function SeatingPlanPage() {
  const state = useMemo(() => readWeddingState(), []);
  const [query, setQuery] = useState("");
  const filtered = UNPLACED.filter((item) => `${item.name} ${item.meta}`.toLowerCase().includes(query.toLowerCase()));
  const tableCounts = [12,12,12,12,12,12,12,12,12,12,10,10,10,10,10,10,10,6];

  return (
    <div className="min-h-screen bg-[#efefeb] overflow-x-hidden text-[var(--color-text-primary)]">
      <div className="min-h-screen p-2 md:p-6">
        <div className="mx-auto max-w-[1600px] rounded-[24px] bg-[#fbfaf7] shadow-[0_24px_70px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="p-3 md:p-4">
            <WeddingToolTopBar active="plan-table" names={state.meta?.couple || "Charlotte & Alexandre"} />
          </div>

          <div className="px-6 md:px-10 lg:px-16 pt-6 md:pt-8 pb-0">
            <div className="flex items-start justify-between gap-6 flex-wrap">
              <div>
                <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Accueil › Outils › <span className="text-zinc-900">Plan de table</span></div>
                <div className="mt-5 text-[11px] uppercase tracking-[0.16em] text-zinc-500">Placement des convives</div>
                <h1 className="mt-4 font-display text-[3.1rem] md:text-[4.8rem] leading-[0.94] text-zinc-950">Plan de Table de Réception</h1>
              </div>
              <div className="text-[2rem] font-display text-[#b59c73] mt-6">220 Invités · 18 Tables</div>
            </div>

            <div className="mt-10 grid gap-6 xl:grid-cols-[1.04fr_0.96fr] items-start">
              <section className="rounded-[26px] border border-black/8 bg-white p-6 md:p-8 shadow-[0_12px_30px_rgba(12,12,12,0.03)]">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h2 className="font-display text-[2rem] text-zinc-950">Vue d'ensemble de la salle</h2>
                    <p className="mt-2 text-sm text-zinc-500">Répartition spatiale des tables rondes (Max 12 pers./table)</p>
                  </div>
                  <button className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm text-zinc-700 hover:bg-black/[0.03]">Ajuster la scène</button>
                </div>

                <div className="mt-8 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-5">
                  {tableCounts.map((count, index) => (
                    <TableCard key={index + 1} index={index + 1} filled={count} total={12} highlight={index === 0} />
                  ))}
                </div>
              </section>

              <aside className="rounded-[26px] border border-black/8 bg-white p-6 md:p-8 shadow-[0_12px_30px_rgba(12,12,12,0.03)] xl:sticky xl:top-8">
                <h2 className="font-display text-[2rem] text-zinc-950">Invités non placés</h2>
                <p className="mt-2 text-sm text-zinc-500">Sélectionnez et glissez les convives restants.</p>
                <div className="mt-6 rounded-[14px] border border-black/8 bg-[#fbf5ed] px-4 py-3.5 flex items-center gap-3">
                  <Search className="h-4 w-4 text-zinc-400" />
                  <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher un invité..." className="w-full bg-transparent text-[15px] text-zinc-900 outline-none placeholder:text-zinc-400" />
                </div>
                <div className="mt-6 space-y-3 max-h-[760px] overflow-y-auto pr-1">
                  {filtered.map((item) => (
                    <div key={item.id} className="rounded-[16px] border border-black/8 bg-[#fbfaf7] px-4 py-4 flex items-center justify-between gap-4">
                      <div>
                        <div className="text-[15px] font-medium text-zinc-950">{item.name}</div>
                        <div className="mt-1 text-sm text-zinc-500">{item.meta}</div>
                      </div>
                      <span className="text-zinc-400">⠿</span>
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          </div>

          <footer className="mt-10 border-t border-black/8 bg-white px-6 md:px-10 lg:px-16 py-6 flex flex-wrap items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-8 text-zinc-950">
              <div className="text-[2rem] font-display">212 / 220 <span className="text-[16px] text-zinc-500 font-sans">Invités placés</span></div>
              <div className="text-[2rem] font-display">15 / 18 <span className="text-[16px] text-zinc-500 font-sans">Tables complètes</span></div>
              <div className="text-[2rem] font-display">8 restants <span className="text-[16px] text-zinc-500 font-sans">Convives à placer</span></div>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-sm text-zinc-500">Modifications enregistrées automatiquement.</span>
              <button className="rounded-full bg-black px-6 py-4 text-sm text-white hover:bg-zinc-800">Publier le plan</button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
