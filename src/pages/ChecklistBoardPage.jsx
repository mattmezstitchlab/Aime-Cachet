import React, { useMemo, useState } from "react";
import { CalendarDays } from "lucide-react";
import WeddingWorkspaceTopBar from "@/components/aime/WeddingWorkspaceTopBar";
import { readWeddingState } from "@/lib/aimeWeddingCore";

const NAV_ITEMS = [
  { id: "checklist", label: "Checklist (Athéna)", to: "/univers/athena/checklist" },
  { id: "messaging", label: "Messagerie (Hermès)", to: "/univers/hermes/messagerie" },
  { id: "gallery", label: "Galerie (Apollon)", to: "/univers/apollon/galerie" },
];

const FILTERS = ["Tout", "12 mois avant", "6 mois", "3 mois", "1 mois", "Semaine J", "Jour J"];

const BOARD = {
  todo: [
    { title: "Choisir le DJ de la soirée", level: "urgent", universe: "hermes", due: "15 Oct J-180", avatar: "/landing/hero-aime-wedding.jpg" },
    { title: "Commander les dragées", level: "moyen", universe: "hestia", due: "22 Oct J-170", avatar: "/landing/hestia.jpg" },
    { title: "Plan B météo (tente de réception)", level: "urgent", universe: "athena", due: "30 Oct J-160", avatar: "/landing/artemis.jpg" },
    { title: "Achat des alliances", level: "moyen", universe: "aphrodite", due: "12 Nov J-140", avatar: "/landing/apollon.jpg" },
    { title: "Valider la liste des vins", level: "normal", universe: "dionysos", due: "20 Nov J-130", avatar: "/landing/demeter.jpg" },
    { title: "Finaliser les cadeaux invités", level: "normal", universe: "hermes", due: "05 Déc J-120", avatar: "/landing/hermes.jpg" },
    { title: "Location de la voiture d'époque", level: "normal", universe: "hephaistos", due: "18 Déc J-110", avatar: "/landing/zeus.jpg" },
    { title: "Répétition de la cérémonie", level: "moyen", universe: "apollon", due: "10 Jan J-90", avatar: "/landing/aphrodite.jpg" },
  ],
  progress: [
    { title: "Dégustations traiteur", level: "urgent", universe: "dionysos", due: "10 Oct J-185", avatar: "/landing/demeter.jpg" },
    { title: "Essayage de robe #2", level: "urgent", universe: "aphrodite", due: "12 Oct J-183", avatar: "/landing/aphrodite.jpg" },
    { title: "Sélection des faire-part", level: "moyen", universe: "hermes", due: "18 Oct J-175", avatar: "/landing/hermes.jpg" },
    { title: "Devis fleuriste arche", level: "moyen", universe: "demeter", due: "28 Oct J-165", avatar: "/landing/aphrodite.jpg" },
    { title: "Validation playlist live", level: "normal", universe: "apollon", due: "02 Nov J-150", avatar: "/landing/dionysos.jpg" },
  ],
  validation: [
    { title: "Menu final de réception", level: "urgent", universe: "dionysos", due: "08 Oct J-187", avatar: "/landing/demeter.jpg" },
    { title: "Plan de table de la salle", level: "urgent", universe: "hera", due: "15 Oct J-180", avatar: "/landing/hestia.jpg" },
    { title: "Playlist cérémonie d'entrée", level: "moyen", universe: "apollon", due: "24 Oct J-171", avatar: "/landing/poseidon.jpg" },
  ],
  done: [
    { title: "Réserver le lieu du domaine ✓", level: "normal", universe: "hestia", due: "Fait - 12 Mai", avatar: "/landing/artemis.jpg" },
    { title: "Photographe signé ✓", level: "normal", universe: "apollon", due: "Fait - 18 Juin", avatar: "/landing/apollon.jpg" },
    { title: "Save the date envoyé ✓", level: "normal", universe: "hermes", due: "Fait - 02 Juil", avatar: "/landing/hermes.jpg" },
    { title: "Déclaration mairie déposée ✓", level: "normal", universe: "athena", due: "Fait - 10 Juil", avatar: "/landing/zeus.jpg" },
  ],
};

function levelColor(level = "normal") {
  if (level === "urgent") return "#b7646c";
  if (level === "moyen") return "#d1a06d";
  return "#6c8a73";
}

function TaskCard({ item }) {
  return (
    <div className="rounded-[18px] border border-black/8 bg-white p-5 shadow-[0_10px_28px_rgba(12,12,12,0.03)]">
      <div className="flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-zinc-500">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: levelColor(item.level) }} />
          {item.level}
        </div>
        <span className="rounded-[8px] bg-[var(--color-warm-white)] px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-zinc-500">{item.universe}</span>
      </div>
      <div className="mt-6 text-[1.15rem] leading-[1.2] font-medium text-zinc-950">{item.title}</div>
      <div className="mt-6 border-t border-black/8 pt-4 flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 text-sm text-zinc-500">
          <CalendarDays className="h-4 w-4" />
          {item.due}
        </div>
        <img src={item.avatar} alt="owner" className="h-8 w-8 rounded-full object-cover" />
      </div>
    </div>
  );
}

function Column({ title, count, items }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3 border border-black bg-white px-4 py-3 text-zinc-950">
        <div className="font-display text-[2rem] leading-none">{title}</div>
        <div className="h-9 w-9 rounded-full bg-black text-white text-sm font-semibold flex items-center justify-center">{count}</div>
      </div>
      <div className="mt-4 space-y-4">
        {items.map((item) => <TaskCard key={`${title}-${item.title}`} item={item} />)}
      </div>
    </div>
  );
}

export default function ChecklistBoardPage() {
  const state = useMemo(() => readWeddingState(), []);
  const [filter, setFilter] = useState("Tout");
  const total = Object.values(BOARD).flat().length;
  const done = BOARD.done.length;
  const progressValue = Math.round((done / total) * 100);

  return (
    <div className="min-h-screen bg-[#efefeb] overflow-x-hidden text-[var(--color-text-primary)]">
      <div className="min-h-screen p-2 md:p-6">
        <div className="mx-auto max-w-[1600px] rounded-[24px] bg-[#fbfaf7] shadow-[0_24px_70px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="p-3 md:p-4">
            <WeddingWorkspaceTopBar
              items={NAV_ITEMS}
              active="checklist"
              names={state.meta?.couple || "Sophie & Thomas"}
              avatarImage="/landing/hero-aime-wedding.jpg"
            />
          </div>

          <div className="px-6 md:px-10 lg:px-16 pb-14 pt-6 md:pt-8">
            <div className="flex items-start justify-between gap-8 flex-wrap">
              <div>
                <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Tableau de bord / Athéna / <span className="text-zinc-900">Checklist</span></div>
                <h1 className="mt-5 font-display text-[3.3rem] md:text-[4.8rem] leading-[0.94] text-zinc-950">Ma checklist</h1>
                <p className="mt-4 text-[17px] text-zinc-600">Rétroplanning intelligent</p>
              </div>
              <div className="min-w-[300px] mt-4">
                <div className="flex items-center justify-between gap-4 text-[15px] text-zinc-800">
                  <span>Progression générale</span>
                  <span className="font-medium">{done} / {total} terminées</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-black/8 overflow-hidden"><div className="h-full bg-black" style={{ width: `${progressValue}%` }} /></div>
              </div>
            </div>

            <div className="mt-10 border border-black/8 bg-white px-4 py-4 flex flex-wrap gap-3">
              {FILTERS.map((item) => (
                <button key={item} onClick={() => setFilter(item)} className={`rounded-full px-5 py-3 text-sm uppercase tracking-[0.08em] ${filter === item ? "bg-black text-white" : "bg-[var(--color-warm-white)] text-zinc-700"}`}>{item}</button>
              ))}
            </div>

            <div className="mt-8 grid gap-4 xl:grid-cols-4">
              <Column title="À faire" count={BOARD.todo.length} items={BOARD.todo} />
              <Column title="En cours" count={BOARD.progress.length} items={BOARD.progress} />
              <Column title="En validation" count={BOARD.validation.length} items={BOARD.validation} />
              <Column title="Terminé" count={BOARD.done.length} items={BOARD.done} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
