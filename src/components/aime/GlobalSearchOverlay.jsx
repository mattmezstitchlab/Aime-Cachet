import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

const ITEMS = [
  { group: "Système", label: "Onboarding", subtitle: "Créer le cadre du mariage", to: "/onboarding" },
  { group: "Système", label: "Login", subtitle: "Connexion et magic link", to: "/login" },
  { group: "Espaces", label: "Espace mariés", subtitle: "Profil couple et accès rapides", to: "/espace-maries" },
  { group: "Espaces", label: "Espace invités", subtitle: "Profil invité et RSVP", to: "/espace-invites/compte" },
  { group: "Espaces", label: "Espace prestataires", subtitle: "Mission, documents et messagerie", to: "/espace-prestataires" },
  { group: "Espaces", label: "Espace planner", subtitle: "Cockpit, portefeuille mariages et outils agence", to: "/espace-planner" },
  { group: "Univers", label: "Zeus", subtitle: "Orchestration globale", to: "/univers/zeus" },
  { group: "Univers", label: "Hestia", subtitle: "Invités et accueil", to: "/univers/hestia" },
  { group: "Univers", label: "Athéna", subtitle: "Alertes et anticipation", to: "/univers/athena" },
  { group: "Univers", label: "Hermès", subtitle: "Communication et diffusion", to: "/univers/hermes" },
  { group: "Sous-pages", label: "Budget détaillé", subtitle: "Zeus · détail du budget", to: "/univers/zeus/budget" },
  { group: "Sous-pages", label: "Plan de table", subtitle: "Hestia · drag & drop", to: "/univers/hestia/plan-de-table" },
  { group: "Sous-pages", label: "RSVP invité", subtitle: "Hestia · formulaire public", to: "/univers/hestia/rsvp" },
  { group: "Sous-pages", label: "Checklist Kanban", subtitle: "Athéna · vue détaillée", to: "/univers/athena/checklist" },
  { group: "Sous-pages", label: "Messagerie", subtitle: "Hermès · fil temps réel", to: "/univers/hermes/messagerie" },
  { group: "Sous-pages", label: "Galerie", subtitle: "Apollon · plein écran", to: "/univers/apollon/galerie" },
  { group: "Sous-pages", label: "Composition menu", subtitle: "Déméter · builder", to: "/univers/demeter/menu" },
  { group: "Invité externe", label: "Mini-site invité", subtitle: "Lien public personnalisé", to: "/invitation/AIME-2027" },
];

export default function GlobalSearchOverlay() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handler = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    setOpen(false);
    setQuery("");
  }, [location.pathname]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ITEMS;
    return ITEMS.filter((item) => `${item.label} ${item.subtitle} ${item.group}`.toLowerCase().includes(q));
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
    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm p-4 flex items-start justify-center" onClick={() => setOpen(false)}>
      <div className="mt-16 w-full max-w-[760px] rounded-[28px] border border-black/8 bg-white shadow-[0_24px_70px_rgba(0,0,0,0.14)] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-black/8 px-5 py-4">
          <Search className="h-4 w-4 text-zinc-400" />
          <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher une page, un dieu ou un espace…" className="w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400" />
        </div>
        <div className="max-h-[70vh] overflow-y-auto p-3 space-y-4">
          {Object.entries(grouped).map(([group, items]) => (
            <div key={group}>
              <div className="px-2 pb-2 text-[11px] uppercase tracking-[0.16em] text-zinc-500">{group}</div>
              <div className="space-y-2">
                {items.map((item) => (
                  <button key={item.to} onClick={() => navigate(item.to)} className="w-full rounded-[18px] border border-black/8 bg-[var(--color-warm-white)] px-4 py-3 text-left hover:bg-black/[0.03] transition-colors">
                    <div className="text-sm font-semibold text-zinc-950">{item.label}</div>
                    <div className="mt-1 text-sm text-zinc-600">{item.subtitle}</div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
