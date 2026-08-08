import React, { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, Search } from "lucide-react";
import { getNotificationsForRole, readWeddingState } from "@/lib/aimeWeddingCore";
import { UNIVERSE_GRADIENTS } from "@/lib/aimeUniverses";

const TABS = ["Tableau de bord", "Planning", "Invités", "Budget", "Albums"];

function badgeMeta(item) {
  const text = `${item.title} ${item.text} ${item.source}`.toLowerCase();
  if (text.includes("rsvp") || text.includes("invité") || text.includes("plan de table")) return { label: "Hestia", context: "Invitées", universeId: "hestia" };
  if (text.includes("album") || text.includes("photo")) return { label: "Apollon", context: "Albums", universeId: "apollon" };
  if (text.includes("rappel") || text.includes("tâche") || text.includes("signature") || text.includes("alerte")) return { label: "Athéna", context: "Tâches", universeId: "athena" };
  if (text.includes("message") || text.includes("communication") || text.includes("conversation")) return { label: "Hermès", context: "Conversations", universeId: "hermes" };
  if (text.includes("budget") || text.includes("paiement") || text.includes("facture")) return { label: "Zeus", context: "Budget", universeId: "zeus" };
  if (text.includes("logistique") || text.includes("montage") || text.includes("terrain")) return { label: "Arès", context: "Logistique", universeId: "ares" };
  if (text.includes("traiteur") || text.includes("allergie") || text.includes("menu")) return { label: "Déméter", context: "Traiteur", universeId: "demeter" };
  if (text.includes("soirée") || text.includes("photobooth") || text.includes("dj")) return { label: "Dionysos", context: "Soirée", universeId: "dionysos" };
  return { label: "Zeus", context: "Mariage", universeId: "zeus" };
}

function agoFromHref(item, index) {
  if (item.level === "critical") return "hier";
  if (index === 0) return "il y a 2 h";
  if (index === 1) return "il y a 5 h";
  return `il y a ${index + 2} j`;
}

function Surface({ children, className = "" }) {
  return <section className={`rounded-[30px] border border-black/8 bg-white shadow-[0_18px_48px_rgba(12,12,12,0.06)] ${className}`}>{children}</section>;
}

export default function WeddingNotifications() {
  const [searchParams] = useSearchParams();
  const roleView = ["couple", "planner", "vendors"].includes(searchParams.get("role")) ? searchParams.get("role") : "planner";
  const state = readWeddingState();
  const baseNotifications = useMemo(() => getNotificationsForRole(state, roleView), [state, roleView]);
  const [readIds, setReadIds] = useState([]);
  const unread = baseNotifications.filter((item) => !readIds.includes(item.id));
  const urgent = baseNotifications.filter((item) => item.level === "critical");
  const [filter, setFilter] = useState("all");
  const notifications = filter === "unread" ? unread : filter === "urgent" ? urgent : baseNotifications;

  const markAllRead = () => setReadIds(baseNotifications.map((item) => item.id));

  return (
    <div className="min-h-screen bg-[#efefeb] overflow-hidden text-[var(--color-text-primary)]">
      <div className="min-h-screen p-2 md:p-6">
        <div className="mx-auto max-w-[1600px] rounded-[24px] bg-white shadow-[0_24px_70px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="px-6 md:px-10 py-6 border-b border-black/8 flex items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Link to="/" className="font-display text-[2rem] leading-none text-zinc-950">AIME</Link>
              <span className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Wedding Planner</span>
            </div>
            <nav className="hidden md:flex items-center gap-10 text-[15px] text-zinc-900">
              {TABS.map((tab, index) => (
                <span key={tab} className={`relative ${index === 0 ? "font-medium" : "text-zinc-700"}`}>
                  {tab}
                  {index === 0 && <span className="absolute left-0 right-0 -bottom-3 h-[2px] rounded-full bg-[#b9a47b]" />}
                </span>
              ))}
            </nav>
            <button onClick={() => window.dispatchEvent(new Event("aime-open-search"))} className="rounded-[14px] border border-black/8 bg-[var(--color-warm-white)] px-4 py-3 text-sm text-zinc-600 inline-flex items-center gap-3">
              <Search className="h-4 w-4" />
              <span className="hidden md:inline">CMD+K</span>
            </button>
          </div>

          <div className="px-6 md:px-10 py-10 md:py-12">
            <div className="flex items-start justify-between gap-6 flex-wrap">
              <div>
                <h1 className="font-display text-[3.3rem] md:text-[4.6rem] leading-[0.94] text-zinc-950">Notifications</h1>
                <p className="mt-4 text-[17px] text-zinc-600">Suivez l'activité divine de votre mariage</p>
              </div>
              <button onClick={markAllRead} className="rounded-full border border-black/12 bg-white px-6 py-3 text-sm text-zinc-800 hover:bg-black/[0.03]">
                Tout marquer comme lu
              </button>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => setFilter("all")} className={`rounded-full px-5 py-3 text-sm ${filter === "all" ? "bg-black text-white" : "border border-black/10 bg-white text-zinc-700"}`}>Tout ({baseNotifications.length})</button>
              <button onClick={() => setFilter("unread")} className={`rounded-full px-5 py-3 text-sm ${filter === "unread" ? "bg-black text-white" : "border border-black/10 bg-white text-zinc-700"}`}>Non lues ({unread.length})</button>
              <button onClick={() => setFilter("urgent")} className={`rounded-full px-5 py-3 text-sm inline-flex items-center gap-2 ${filter === "urgent" ? "bg-black text-white" : "border border-black/10 bg-white text-zinc-700"}`}><span className="h-2 w-2 rounded-full bg-[#b7646c]" />Urgentes ({urgent.length})</button>
            </div>

            <div className="mt-10 space-y-4">
              {notifications.map((item, index) => {
                const meta = badgeMeta(item);
                const isCritical = item.level === "critical";
                return (
                  <Surface key={item.id} className={`px-6 py-6 ${isCritical ? "border-[#b78f98]" : ""}`}>
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="inline-flex rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-white" style={{ background: UNIVERSE_GRADIENTS[meta.universeId] }}>
                            {meta.label}
                          </span>
                          <span className="text-sm text-zinc-500">{meta.context}</span>
                          {isCritical && <span className="rounded-[8px] border border-[#c99ea4] px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-[#a26b73]">Urgent</span>}
                        </div>
                        <div className="mt-4 text-[1.15rem] md:text-[1.35rem] font-medium text-zinc-950">{item.title}</div>
                        <div className="mt-2 text-sm text-zinc-400">{agoFromHref(item, index)}</div>
                      </div>
                      <Link to={item.href || "/notifications"} className="inline-flex items-center gap-2 text-sm text-[#b9a47b] hover:text-zinc-900 whitespace-nowrap">
                        Voir
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </Surface>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
