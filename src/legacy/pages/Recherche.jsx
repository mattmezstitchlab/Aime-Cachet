import React, { useEffect, useMemo, useState } from "react";
import { Search, Sparkles, AlertCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import PageShell from "@/components/aime/PageShell";
import ResultCard from "@/components/aime/ResultCard";
import { interpretQuery } from "@/lib/magicSearch";

const EXAMPLES = [
  "mes fiches à resceller",
  "les fiches sans employeur",
  "les prestations de mai",
  "les cachets spectacle vivant",
  "les fiches non scellées",
  "les documents manquants",
  "les fiches transmises",
  "les fiches avec QR",
];

export default function Recherche() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const all = await base44.entities.Prestation.list("-date", 500);
      setItems(all);
      setLoading(false);
    })();
  }, []);

  const { filter, label, understood } = useMemo(() => interpretQuery(query), [query]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return items.filter(filter);
  }, [items, filter, query]);

  return (
    <PageShell
      eyebrow="Recherche magique"
      title="Demandez à AIME"
      subtitle="Cherchez naturellement dans vos fiches préparatoires : employeur, lieu, code cachet, mois, statut, secteur, scellement…"
    >
      {/* Champ unique */}
      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-100">
          <Sparkles className="w-4 h-4 text-aime-red shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Demandez à AIME… ex : montre-moi les fiches à resceller de mai"
            className="flex-1 bg-transparent outline-none text-sm md:text-base text-zinc-900 placeholder:text-zinc-400"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors"
            >
              Effacer
            </button>
          )}
        </div>

        {!query.trim() && (
          <div className="px-5 py-6">
            <div className="text-[10px] tracking-[0.2em] uppercase text-zinc-500 font-semibold mb-3">
              Exemples
            </div>
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  onClick={() => setQuery(ex)}
                  className="text-xs px-3 py-1.5 bg-zinc-50 hover:bg-aime-red/10 hover:text-aime-red border border-zinc-200 rounded-full text-zinc-700 transition-colors"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Résultats */}
      <div className="mt-6">
        {query.trim() && (
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs text-zinc-500">
              {results.length} résultat{results.length > 1 ? "s" : ""}
              {label ? ` · ${label}` : ""}
            </div>
            {!understood && (
              <div className="inline-flex items-center gap-1.5 text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                <AlertCircle className="w-3 h-3" />
                Recherche libre
              </div>
            )}
          </div>
        )}

        {loading && (
          <div className="text-center py-12 text-sm text-zinc-400">Chargement…</div>
        )}

        {!loading && query.trim() && results.length === 0 && (
          <div className="bg-white border border-zinc-200 rounded-2xl px-6 py-10 text-center">
            <Search className="w-6 h-6 text-zinc-300 mx-auto mb-3" />
            <p className="text-sm text-zinc-700 font-medium">Aucun résultat</p>
            <p className="text-xs text-zinc-500 mt-2 max-w-md mx-auto leading-relaxed">
              Je n'ai pas encore compris cette recherche. Essayez avec un employeur, une date, un statut ou un code cachet.
            </p>
          </div>
        )}

        <div className="space-y-2">
          {results.map((p) => (
            <ResultCard key={p.id} prestation={p} />
          ))}
        </div>
      </div>
    </PageShell>
  );
}