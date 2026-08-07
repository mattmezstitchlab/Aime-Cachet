import React, { useState } from "react";
import { FileText, Check, Loader2, AlertCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { generateCachetCode } from "@/lib/cachetCode";
import { findDoc } from "@/lib/docCatalog";
import FichePreviewCard from "@/components/aime/assistant/FichePreviewCard";

/**
 * Carte "Création d'un document spécifique" — devis, AEM, DPAE, reçu, etc.
 * L'IA propose un doc_type précis, on crée une Prestation avec ce doc_type
 * et on ouvre directement la fiche au bon format.
 */
export default function ProposedDocumentCard({ proposed }) {
  const [created, setCreated] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!proposed || !proposed.doc_type) return null;

  if (created) {
    return <FichePreviewCard record={{ prestation_id: created.id, href: `/fiche/${created.id}` }} />;
  }

  const docMeta = findDoc(proposed.doc_type);
  const Icon = docMeta?.icon || FileText;
  const docLabel = docMeta?.label || proposed.doc_type;

  const handleCreate = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = sanitize(proposed);
      const fiche = await base44.entities.Prestation.create({
        ...payload,
        doc_type: proposed.doc_type,
        status: "brouillon",
        cachet_code: generateCachetCode(),
      });
      setCreated(fiche);
    } catch (e) {
      setError(e?.message || "Création impossible.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: "Date", value: proposed.date ? new Date(proposed.date).toLocaleDateString("fr-FR") : null },
    { label: "Employeur", value: proposed.employer },
    { label: "Production", value: proposed.production },
    { label: "Lieu", value: proposed.location },
    { label: "Montant", value: proposed.amount ? `${proposed.amount} €` : null },
    { label: "Durée", value: proposed.duration_hours ? `${proposed.duration_hours} h` : null },
  ].filter((f) => f.value);

  const missing = Array.isArray(proposed.missing_fields) ? proposed.missing_fields : [];

  return (
    <div className="mt-3 rounded-lg border border-aime-red/40 bg-gradient-to-b from-zinc-950 to-black overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-800 bg-aime-red/5">
        <Icon className="w-3.5 h-3.5 text-aime-red shrink-0" />
        <span className="text-[10px] tracking-[0.18em] uppercase font-semibold text-aime-red">
          {docLabel} — proposé par AIME
        </span>
      </div>

      <div className="px-3 py-3 space-y-0.5">
        {fields.length === 0 ? (
          <div className="text-xs text-zinc-500 italic">Document vide à compléter après création.</div>
        ) : (
          fields.map((f, i) => (
            <div key={i} className="flex items-baseline gap-2 py-0.5">
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 w-20 shrink-0">{f.label}</span>
              <span className="text-xs text-zinc-200 truncate">{f.value}</span>
            </div>
          ))
        )}
      </div>

      {missing.length > 0 && (
        <div className="mx-3 mb-3 rounded-md border border-zinc-800 bg-zinc-900/40 px-2.5 py-2 flex items-start gap-2">
          <AlertCircle className="w-3 h-3 text-amber-400 mt-0.5 shrink-0" />
          <div className="text-[10px] text-zinc-400 leading-relaxed">
            À compléter : <span className="text-zinc-200">{missing.join(", ")}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="mx-3 mb-3 text-[11px] text-red-400 bg-red-500/10 border border-red-500/30 rounded px-2 py-1.5">
          {error}
        </div>
      )}

      <div className="flex border-t border-zinc-800">
        <button
          onClick={handleCreate}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-aime-red hover:bg-aime-red/90 text-white text-xs font-medium transition-colors disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" /> Création…
            </>
          ) : (
            <>
              <Check className="w-3 h-3" /> Créer ce {docLabel.toLowerCase()}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function sanitize(p) {
  const out = {};
  const keys = ["date", "employer", "production", "location", "type", "annexe", "amount", "duration_hours", "sector"];
  keys.forEach((k) => {
    if (p[k] !== undefined && p[k] !== null && p[k] !== "") out[k] = p[k];
  });
  if (out.type && !["Artiste", "Technicien"].includes(out.type)) {
    const t = String(out.type).toLowerCase();
    out.type = t.startsWith("art") ? "Artiste" : t.startsWith("tech") ? "Technicien" : undefined;
  }
  if (out.annexe) out.annexe = String(out.annexe).includes("10") ? "10" : "8";
  return out;
}