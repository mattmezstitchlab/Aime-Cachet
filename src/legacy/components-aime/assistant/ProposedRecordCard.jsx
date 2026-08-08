import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Check, Loader2, AlertCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { generateCachetCode } from "@/lib/cachetCode";
import FichePreviewCard from "@/components/aime/assistant/FichePreviewCard";

/**
 * Carte "Fiche pré-remplie par l'IA" — affichée quand le LLM a analysé un document
 * et propose un brouillon de Prestation.
 * L'utilisateur clique "Créer cette fiche" → on crée la Prestation en base et on
 * bascule en aperçu fiche (FichePreviewCard).
 */
export default function ProposedRecordCard({ proposed }) {
  const navigate = useNavigate();
  const [created, setCreated] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!proposed || typeof proposed !== "object") return null;

  // Une fois créée, on affiche l'aperçu standard de la fiche.
  if (created) {
    return <FichePreviewCard record={{ prestation_id: created.id, href: `/fiche/${created.id}` }} />;
  }

  const handleCreate = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = sanitizeProposed(proposed);
      const fiche = await base44.entities.Prestation.create({
        ...payload,
        status: "brouillon",
        cachet_code: payload.cachet_code || generateCachetCode(),
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
    { label: "Type", value: proposed.type },
    { label: "Annexe", value: proposed.annexe ? `Annexe ${proposed.annexe}` : null },
    { label: "Durée", value: proposed.duration_hours ? `${proposed.duration_hours} h` : null },
    { label: "Montant", value: proposed.amount ? `${proposed.amount} €` : null },
  ].filter((f) => f.value);

  const missing = Array.isArray(proposed.missing_fields) ? proposed.missing_fields : [];

  return (
    <div className="mt-3 rounded-lg border border-aime-red/40 bg-gradient-to-b from-zinc-950 to-black overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-800 bg-aime-red/5">
        <Sparkles className="w-3.5 h-3.5 text-aime-red shrink-0" />
        <span className="text-[10px] tracking-[0.18em] uppercase font-semibold text-aime-red">
          Fiche pré-remplie par AIME
        </span>
      </div>

      <div className="px-3 py-3 space-y-0.5">
        {fields.length === 0 ? (
          <div className="text-xs text-zinc-500 italic">Aucun champ détecté avec certitude.</div>
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
            À compléter après création : <span className="text-zinc-200">{missing.join(", ")}</span>
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
          disabled={loading || fields.length === 0}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-aime-red hover:bg-aime-red/90 text-white text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" /> Création…
            </>
          ) : (
            <>
              <Check className="w-3 h-3" /> Créer cette fiche
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// Garde uniquement les champs reconnus du schéma Prestation
function sanitizeProposed(p) {
  const out = {};
  const fields = [
    "date", "employer", "production", "location", "type", "annexe",
    "amount", "duration_hours", "nature", "sector",
    "employer_contact", "employer_email", "employer_phone", "employer_siret",
    "employer_kind", "custom_notes",
  ];
  fields.forEach((k) => {
    if (p[k] !== undefined && p[k] !== null && p[k] !== "") out[k] = p[k];
  });
  // Normalisations légères
  if (out.type && !["Artiste", "Technicien"].includes(out.type)) {
    const t = String(out.type).toLowerCase();
    out.type = t.startsWith("art") ? "Artiste" : t.startsWith("tech") ? "Technicien" : undefined;
  }
  if (out.annexe) out.annexe = String(out.annexe).includes("10") ? "10" : "8";
  return out;
}