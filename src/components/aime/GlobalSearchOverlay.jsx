import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { UNIVERSE_GRADIENTS } from "@/lib/aimeUniverses";

const ITEMS = [
  { group: "Système", label: "Onboarding", subtitle: "Créer le cadre du mariage", to: "/onboarding" },
  { group: "Système", label: "Login", subtitle: "Connexion et magic link", to: "/login" },
  { group: "Espaces", label: "Espace mariés", subtitle: "Profil couple et accès rapides", to: "/espace-maries" },
  { group: "Espaces", label: "Espace invités", subtitle: "Profil invité et RSVP", to: "/espace-invites/compte" },
  { group: "Espaces", label: "Espace prestataires", subtitle: "Mission, documents et messagerie", to: "/espace-prestataires" },
  { group: "Espaces", label: "Espace planner", subtitle: "Cockpit, portefeuille mariages et outils agence", to: "/espace-planner" },
  { group: "Univers", label: "Zeus", subtitle: "Orchestration globale", to: "/univers/zeus", universeId: "zeus" },
  { group: "Univers", label: "Hestia", subtitle: "Invitées & RSVP", to: "/univers/hestia", universeId: "hestia" },
  { group: "Univers", label: "Athéna", subtitle: "Tâches & organisation", to: "/univers/athena", universeId: "athena" },
  { group: "Univers", label: "Hermès", subtitle: "Conversations", to: "/univers/hermes", universeId: "hermes" },
  { group: "Univers", label: "Apollon", subtitle: "Albums & scénographie", to: "/univers/apollon", universeId: "apollon" },
  { group: "Sous-pages", label: "Budget détaillé", subtitle: "Zeus · détail du budget", to: "/univers/zeus/budget", universeId: "zeus" },
  { group: "Sous-pages", label: "Plan de table", subtitle: "Hestia · drag & drop", to: "/univers/hestia/plan-de-table", universeId: "hestia" },
  { group: "Sous-pages", label: "RSVP invité", subtitle: "Hestia · formulaire public", to: "/univers/hestia/rsvp", universeId: "hestia" },
  { group: "Sous-pages", label: "Checklist Kanban", subtitle: "Athéna · vue détaillée", to: "/univers/athena/checklist", universeId: "athena" },
  { group: "Sous-pages", label: "Messagerie", subtitle: "Hermès · fil temps réel", to: "/univers/hermes/messagerie", universeId: "hermes" },
  { group: "Sous-pages", label: "Galerie", subtitle: "Apollon · plein écran", to: "/univers/apollon/galerie", universeId: "apollon" },
  { group: "Sous-pages", label: "Composition menu", subtitle: "Déméter · builder", to: "/univers/demeter/menu", universeId: "demeter" },
  { group: "Invité externe", label: "Mini-site invité", subtitle: "Lien public personnalisé", to: "/invitation/AIME-2027", universeId: "hestia" },
];

export default function GlobalSearchOverlay() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const keyHandler = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
      if (event.key === "Escape") setOpen(false);
    };
    const openHandler = () => setOpen(true);
    window.addEventListener("keydown", keyHandler);
    window.addEventListener("aime-open-search", openHandler);
    return () => {
      window.removeEventListener("keydown", keyHandler);
      window.removeEventListener("aime-open-search", openHandler);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
    setQuery("");
  }, [location.pathname]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ITEMS;
    return ITEMS.filter((item) => `${item.group} ${item.label} ${item.subtitle}`.toLowerCase().includes(q));
  }, [query]);

  const grouped = useMemo(() => {
    return results.reduce((acc, item) => {
      acc[item.group] = acc[item.group] || [];
      acc[item.group].push(item);
      return acc;
    }, {});
  }, [results]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/55 p-4 md:p-8 flex items-start justify-center" onClick={() => setOpen(false)}>
      <div className="mt-8 md:mt-16 w-full max-w-[900px] rounded-[28px] border border-black/8 bg-white shadow-[0_30px_80px_rgba(0,0,0,0.18)] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-4 border-b border-black/8 px-6 py-5">
          <Search className="h-6 w-6 text-zinc-950" />
          <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher dans AIME..." className="w-full bg-transparent text-[1.05rem] text-zinc-900 outline-none placeholder:text-zinc-400" />
          <span className="rounded-[8px] bg-[var(--color-warm-white)] px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-zinc-500">ESC</span>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-4 py-4 space-y-5">
          {Object.entries(grouped).map(([group, items]) => (
            <div key={group}>
              <div className="px-2 pb-2 text-[11px] uppercase tracking-[0.16em] text-zinc-500">{group}</div>
              <div className="space-y-2">
                {items.map((item) => (
                  <button key={item.to} onClick={() => navigate(item.to)} className="w-full rounded-[16px] px-4 py-4 text-left hover:bg-[var(--color-warm-white)] transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2.5 mb-2">
                          {item.universeId ? (
                            <span className="inline-flex rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-white" style={{ background: UNIVERSE_GRADIENTS[item.universeId] }}>
                              {item.label}
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full border border-black/10 bg-white px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-zinc-600">
                              {group}
                            </span>
                          )}
                          <span className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">{item.universeId ? item.subtitle : item.label}</span>
                        </div>
                        <div className="text-[1.02rem] text-zinc-950 font-medium">{item.universeId ? item.label : item.subtitle}</div>
                        <div className="mt-1 text-sm text-zinc-500">{item.universeId ? item.subtitle : item.label}</div>
                      </div>
                      <div className="text-sm text-zinc-400 whitespace-nowrap">Ouvrir</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-black/8 bg-[var(--color-warm-white)] px-6 py-4 flex flex-wrap items-center gap-4 text-sm text-zinc-500">
          <span>↑↓ Naviguer</span>
          <span>Enter Ouvrir</span>
          <span>Esc Fermer</span>
        </div>
      </div>
    </div>
  );
}
