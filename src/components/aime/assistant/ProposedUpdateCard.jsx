import React, { useState } from "react";
import { Pencil, Check, Loader2, AlertCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import FichePreviewCard from "@/components/aime/assistant/FichePreviewCard";

/**
 * Carte "Modification de fiche existante" — l'IA a identifié une fiche et propose
 * des changements ciblés (champ → nouvelle valeur). L'utilisateur confirme,
 * on applique l'update et on ouvre l'aperçu mis à jour.
 */
const ALLOWED_FIELDS = [
  "date", "employer", "production", "location", "type", "annexe",
  "amount", "duration_hours", "nature", "sector", "status",
  "employer_contact", "employer_email", "employer_phone", "employer_siret",
  "employer_kind", "custom_notes",
];

export default function ProposedUpdateCard({ proposed }) {
  const [done, setDone] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!proposed || !proposed.prestation_id || !proposed.changes) return null;

  if (done) {
    return <FichePreviewCard record={{ prestation_id: done, href: `/fiche/${done}` }} />;
  }

  const changes = Object.entries(proposed.changes).filter(
    ([k, v]) => ALLOWED_FIELDS.includes(k) && v !== null && v !== undefined && v !== ""
  );

  const handleApply = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = Object.fromEntries(changes);
      await base44.entities.Prestation.update(proposed.prestation_id, payload);
      setDone(proposed.prestation_id);
    } catch (e) {
      setError(e?.message || "Modification impossible.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3 rounded-lg border border-amber-500/40 bg-gradient-to-b from-zinc-950 to-black overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-800 bg-amber-500/5">
        <Pencil className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span className="text-[10px] tracking-[0.18em] uppercase font-semibold text-amber-400">
          Modification proposée
        </span>
      </div>

      {proposed.summary && (
        <div className="px-3 pt-3 text-xs text-zinc-300 leading-relaxed">{proposed.summary}</div>
      )}

      <div className="px-3 py-3 space-y-0.5">
        {changes.length === 0 ? (
          <div className="text-xs text-zinc-500 italic">Aucun champ à modifier détecté.</div>
        ) : (
          changes.map(([key, val], i) => (
            <div key={i} className="flex items-baseline gap-2 py-0.5">
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 w-24 shrink-0">{key}</span>
              <span className="text-xs text-zinc-200 truncate">→ {String(val)}</span>
            </div>
          ))
        )}
      </div>

      {error && (
        <div className="mx-3 mb-3 text-[11px] text-red-400 bg-red-500/10 border border-red-500/30 rounded px-2 py-1.5 flex items-start gap-1.5">
          <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      <div className="flex border-t border-zinc-800">
        <button
          onClick={handleApply}
          disabled={loading || changes.length === 0}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-amber-500 hover:bg-amber-500/90 text-black text-xs font-medium transition-colors disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" /> Application…
            </>
          ) : (
            <>
              <Check className="w-3 h-3" /> Appliquer la modification
            </>
          )}
        </button>
      </div>
    </div>
  );
}