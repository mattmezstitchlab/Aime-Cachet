import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, FileText, MapPin, User, Hash } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function SearchDialog({ open, onClose }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!open) return;
    (async () => {
      const all = await base44.entities.Prestation.list("-date", 200);
      setItems(all);
    })();
  }, [open]);

  useEffect(() => {
    if (open) setQuery("");
  }, [open]);

  const grouped = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase();
    const matches = items.filter((p) =>
      [p.employer, p.location, p.nature, p.cachet_code, p.type]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(q))
    );
    return {
      employer: matches.filter((p) => (p.employer || "").toLowerCase().includes(q)).slice(0, 5),
      location: matches.filter((p) => (p.location || "").toLowerCase().includes(q)).slice(0, 5),
      code: matches.filter((p) => (p.cachet_code || "").toLowerCase().includes(q)).slice(0, 5),
      other: matches.filter((p) => (p.nature || "").toLowerCase().includes(q) || (p.type || "").toLowerCase().includes(q)).slice(0, 5),
    };
  }, [query, items]);

  if (!open) return null;

  const handlePick = (id) => {
    onClose();
    navigate(`/fiche/${id}`);
  };

  const Section = ({ icon: Icon, label, list }) => {
    if (!list || list.length === 0) return null;
    return (
      <div className="px-2 py-2">
        <div className="flex items-center gap-2 px-3 py-1 text-[10px] tracking-[0.2em] text-zinc-500 uppercase font-medium">
          <Icon className="w-3 h-3" />
          {label}
        </div>
        {list.map((p) => (
          <button
            key={p.id}
            onClick={() => handlePick(p.id)}
            className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-zinc-100 transition-colors flex items-center justify-between group"
          >
            <div>
              <div className="text-sm text-zinc-900 font-medium">{p.employer || "Fiche sans employeur"}</div>
              <div className="text-[11px] text-zinc-500 mt-0.5">
                {p.location || "—"} · {p.date || "—"} {p.cachet_code ? `· ${p.cachet_code.slice(-6)}` : ""}
              </div>
            </div>
            <FileText className="w-4 h-4 text-zinc-300 group-hover:text-aime-red transition-colors" />
          </button>
        ))}
      </div>
    );
  };

  const totalResults = grouped ? Object.values(grouped).reduce((a, l) => a + l.length, 0) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20 px-3 sm:px-4 bg-zinc-900/40 backdrop-blur-sm" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[calc(100dvh-5rem)] bg-white border border-zinc-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-100">
          <Search className="w-4 h-4 text-zinc-400" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un employeur, lieu, code, nature…"
            className="flex-1 min-w-0 bg-transparent outline-none text-base sm:text-sm text-zinc-900 placeholder:text-zinc-400"
          />
          <button onClick={onClose} className="w-11 h-11 -mr-2 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-900">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto">
          {!query.trim() && (
            <div className="px-5 py-10 text-center text-sm text-zinc-400">
              Tapez un mot, un lieu, un employeur ou un code cachet pour lancer la recherche.
            </div>
          )}
          {query.trim() && totalResults === 0 && (
            <div className="px-5 py-10 text-center text-sm text-zinc-400">Aucun résultat pour « {query} »</div>
          )}
          {grouped && (
            <>
              <Section icon={User} label="Employeurs" list={grouped.employer} />
              <Section icon={MapPin} label="Lieux" list={grouped.location} />
              <Section icon={Hash} label="Codes cachet" list={grouped.code} />
              <Section icon={FileText} label="Type & nature" list={grouped.other} />
            </>
          )}
        </div>

        <div className="px-5 py-3 border-t border-zinc-100 text-[10px] text-zinc-400">
          Recherche locale dans vos fiches préparatoires.
        </div>
      </div>
    </div>
  );
}