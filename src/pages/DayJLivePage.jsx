import React, { useMemo } from "react";
import { Bus, Phone, SunMedium } from "lucide-react";
import { readWeddingState } from "@/lib/aimeWeddingCore";
import WeddingWorkspaceTopBar from "@/components/aime/WeddingWorkspaceTopBar";

const DIRECTORY_ITEMS = [
  { id: "directory", label: "Annuaire", to: "/prestataires/registre" },
  { id: "inspiration", label: "Inspirations", to: "/univers/aphrodite" },
  { id: "planning", label: "Planification", to: "/point-zero" },
  { id: "live", label: "Jour J", to: "/jour-j-live" },
];

const ACTION_SECTIONS = [
  {
    title: "Les Mariés",
    items: ["Valider l'étape en cours", "Envoyer un message aux invités", "Voir la météo"],
  },
  {
    title: "Les Invités",
    items: ["Mon itinéraire", "Programme du jour", "Envoyer mes vœux"],
  },
  {
    title: "Les Prestataires",
    items: ["Ma feuille de route", "Contacter le planner", "Valider ma prestation"],
  },
  {
    title: "Le Planner",
    items: ["Cockpit temps réel", "Alertes (2)", "Contacter un prestataire"],
  },
];

function statusLabel(status) {
  if (status === "done") return { label: "Done", tone: "bg-[#edf4ef] text-[#567b61]" };
  if (status === "live") return { label: "En cours", tone: "bg-[#e8eefc] text-[#4567aa]" };
  return { label: "À venir", tone: "bg-[#f6f3ed] text-zinc-600" };
}

function ActionPanel({ title, items }) {
  return (
    <div className="rounded-[24px] border border-black/8 bg-white p-6 shadow-[0_10px_28px_rgba(12,12,12,0.03)]">
      <div className="font-display text-[2rem] text-zinc-950">{title}</div>
      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <button key={item} className="w-full rounded-[14px] border border-black/8 bg-white px-5 py-4 text-left text-[15px] text-zinc-900 hover:bg-black/[0.03] flex items-center justify-between gap-4">
            <span>{item}</span>
            <span>→</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function DayJLivePage() {
  const state = useMemo(() => readWeddingState(), []);
  const steps = (state.timeline?.steps || []).slice(0, 9);

  return (
    <div className="min-h-screen bg-[#efefeb] overflow-x-hidden text-[var(--color-text-primary)]">
      <div className="min-h-screen p-2 md:p-6">
        <div className="mx-auto max-w-[1600px] rounded-[24px] bg-[#fbfaf7] shadow-[0_24px_70px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="p-3 md:p-4">
            <WeddingWorkspaceTopBar
              items={DIRECTORY_ITEMS}
              active="live"
              brand="AIME"
              suffix="WEDDINGS"
              rightContent={<button className="rounded-full border border-black/14 bg-white px-6 py-3 text-sm text-zinc-900 hover:bg-black/[0.03]">Mon Compte</button>}
            />
          </div>

          <section className="bg-[#111111] text-white px-6 md:px-10 lg:px-16 py-16">
            <div className="flex items-start justify-between gap-6 flex-wrap">
              <div>
                <div className="text-[12px] uppercase tracking-[0.18em] text-[#e17a7a] inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#ff4b55]" />Mode Jour J en temps réel</div>
                <h1 className="mt-8 font-display text-[3.2rem] md:text-[4.8rem] leading-[0.94]">Jour J — Live</h1>
                <p className="mt-4 text-[20px] text-white/80">{new Date(state.meta?.date || "2025-06-14").toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })} · {state.meta?.venue || "Domaine des Oliviers"} · D-Day</p>
              </div>
              <div className="rounded-full bg-white px-5 py-3 text-sm text-black inline-flex items-center gap-3"><SunMedium className="h-4 w-4" />Soleil · 24°C</div>
            </div>
          </section>

          <div className="px-6 md:px-10 lg:px-16 py-12 grid gap-6 xl:grid-cols-[1.04fr_0.96fr] items-start">
            <section>
              <div className="text-[12px] uppercase tracking-[0.18em] text-[#b59c73]">Déroulement du jour</div>
              <h2 className="mt-5 font-display text-[3rem] text-zinc-950">Le fil conducteur</h2>
              <p className="mt-4 text-[18px] text-zinc-600">Suivez en direct le minutage officiel de la journée</p>

              <div className="mt-8 rounded-[24px] border border-black/8 bg-white p-6 shadow-[0_10px_28px_rgba(12,12,12,0.03)]">
                <div className="space-y-5">
                  {steps.map((step) => {
                    const current = statusLabel(step.status);
                    return (
                      <div key={step.id} className="grid grid-cols-[92px_26px_1fr_auto] gap-4 items-center text-[15px]">
                        <div className={`font-display text-[2rem] ${step.status === "live" ? "text-zinc-950" : "text-zinc-700"}`}>{step.time}</div>
                        <div className={`h-5 w-5 rounded-full border ${step.status === "live" ? "border-[#3f69b1] bg-[#3f69b1]" : step.status === "done" ? "border-[#6e8d74] bg-white" : "border-black/10 bg-white"} flex items-center justify-center`}>
                          {step.status === "done" ? <span className="text-[#6e8d74]">✓</span> : step.status === "live" ? <span className="h-2.5 w-2.5 rounded-full bg-white" /> : null}
                        </div>
                        <div className={`text-[1.2rem] ${step.status === "live" ? "font-semibold text-zinc-950" : "text-zinc-700"}`}>{step.title} — {step.detail.split(".")[0]}</div>
                        <span className={`rounded-[10px] px-3 py-2 text-[12px] ${current.tone}`}>{current.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            <aside className="space-y-6">
              <div>
                <div className="text-[12px] uppercase tracking-[0.18em] text-[#b59c73]">Infos en direct</div>
                <div className="mt-6 space-y-4">
                  <div className="rounded-[22px] border border-black/8 bg-white p-5 shadow-[0_10px_28px_rgba(12,12,12,0.03)] flex items-start gap-4">
                    <div className="h-14 w-14 rounded-full bg-[var(--color-warm-white)] flex items-center justify-center"><SunMedium className="h-6 w-6 text-zinc-700" /></div>
                    <div><div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Météo</div><div className="mt-2 text-[1.2rem] text-zinc-950">24°C Ensoleillé — Prévoir une ombrelle</div></div>
                  </div>
                  <div className="rounded-[22px] border border-black/8 bg-white p-5 shadow-[0_10px_28px_rgba(12,12,12,0.03)] flex items-start gap-4">
                    <div className="h-14 w-14 rounded-full bg-[var(--color-warm-white)] flex items-center justify-center"><Bus className="h-6 w-6 text-zinc-700" /></div>
                    <div><div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Navettes</div><div className="mt-2 text-[1.2rem] text-zinc-950">Navette parking → lieu à 11h00, 11h15, 11h30</div></div>
                  </div>
                  <div className="rounded-[22px] border border-black/8 bg-white p-5 shadow-[0_10px_28px_rgba(12,12,12,0.03)] flex items-start gap-4">
                    <div className="h-14 w-14 rounded-full bg-[var(--color-warm-white)] flex items-center justify-center"><Phone className="h-6 w-6 text-zinc-700" /></div>
                    <div><div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Contact d'urgence</div><div className="mt-2 text-[1.2rem] text-zinc-950">Coordinatrice Marie-Claire — 06 XX XX XX XX</div></div>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-[12px] uppercase tracking-[0.18em] text-[#b59c73]">Panels d'action</div>
                <div className="mt-6 space-y-4">
                  {ACTION_SECTIONS.map((section) => <ActionPanel key={section.title} {...section} />)}
                </div>
              </div>

              <div>
                <div className="text-[12px] uppercase tracking-[0.18em] text-[#b59c73]">Flux des notifications</div>
                <div className="mt-4 rounded-[22px] border border-black/8 bg-white shadow-[0_10px_28px_rgba(12,12,12,0.03)] overflow-hidden">
                  {[
                    ["11:02", "Les mariés sont arrivés ! 🎉"],
                    ["10:45", "Le traiteur confirme le cocktail à 13h"],
                    ["10:30", "Dernière répétition DJ terminée ✓"],
                    ["09:15", "Photos getting-ready en cours 📸"],
                  ].map(([time, text], index) => (
                    <div key={time} className={`grid grid-cols-[80px_1fr] gap-4 px-5 py-4 border-t border-black/8 ${index === 0 ? "border-t-4 border-t-[#b59c73]" : ""}`}>
                      <div className="text-zinc-500">{time}</div>
                      <div className="text-zinc-900">{text}</div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>

          <footer className="bg-[#111111] text-white px-6 md:px-10 lg:px-16 py-12">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr_0.9fr] items-start">
              <div>
                <div className="font-display text-[2.2rem]">AIME</div>
                <p className="mt-6 max-w-md text-white/66 leading-relaxed">La plateforme d'excellence dédiée à la création et à la coordination de mariages d'exception.</p>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.16em] text-white/45 mb-4">Artisans</div>
                <div className="space-y-3 text-white/72">
                  <span className="block">Rechercher</span>
                  <span className="block">Sélection AIME</span>
                  <span className="block">Devenir Partenaire</span>
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.16em] text-white/45 mb-4">Services</div>
                <div className="space-y-3 text-white/72">
                  <span className="block">Timeline Live</span>
                  <span className="block">Espace Concierge</span>
                  <span className="block">Assistance Directe</span>
                </div>
              </div>
            </div>
            <div className="mt-12 border-t border-white/10 pt-6 flex flex-wrap items-center justify-between gap-4 text-sm text-white/48">
              <div>© 2025 AIME WEDDINGS. Tous droits réservés.</div>
              <div>Mentions Légales · RGPD</div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
