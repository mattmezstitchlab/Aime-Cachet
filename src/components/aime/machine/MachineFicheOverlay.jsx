import React, { useEffect, useState } from "react";
import { ArrowLeft, Loader2, FileText } from "lucide-react";
import { base44 } from "@/api/base44Client";

/**
 * Overlay fiche AU-DESSUS de la conversation, à la taille de la machine.
 * Ne touche pas au site derrière, ne navigue pas, ne ferme pas la machine.
 * Affiche un rendu lecture seule simple de la fiche.
 */
export default function MachineFicheOverlay({ ficheId, onBack }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (!ficheId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    base44.entities.Prestation.get(ficheId)
      .then((p) => { if (!cancelled) { setData(p); setLoading(false); } })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [ficheId]);

  return (
    <div className="absolute inset-0 z-30 flex flex-col bg-[#23282b] shadow-[inset_18px_18px_36px_rgba(13,16,18,0.65),inset_-14px_-14px_28px_rgba(60,68,72,0.18)]">
      {/* Header overlay */}
      <div className="shrink-0 flex items-center gap-2 px-4 py-3 border-b border-black/20 bg-[#242a2d] shadow-[8px_8px_18px_rgba(10,13,15,0.45),-6px_-6px_14px_rgba(72,80,84,0.12)]">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white px-2.5 py-1.5 rounded-full bg-[#252b2e] shadow-[5px_5px_10px_rgba(10,13,15,0.48),-4px_-4px_8px_rgba(72,80,84,0.12)] hover:shadow-[inset_4px_4px_8px_rgba(10,13,15,0.52),inset_-3px_-3px_7px_rgba(72,80,84,0.1)] transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Retour à la conversation
        </button>
        <div className="flex-1" />
        <span className="text-[10px] tracking-[0.2em] text-aime-red font-semibold uppercase">Fiche</span>
      </div>

      {/* Contenu */}
      <div className="flex-1 overflow-y-auto p-5">
        {loading ? (
          <div className="flex items-center gap-2 text-zinc-500 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Chargement…
          </div>
        ) : !data ? (
          <div className="text-sm text-zinc-500">Fiche introuvable.</div>
        ) : (
          <FicheReadOnly fiche={data} />
        )}
      </div>
    </div>
  );
}

function FicheReadOnly({ fiche }) {
  return (
    <div className="rounded-2xl bg-[#252b2e] text-zinc-100 p-5 mx-auto max-w-md border border-white/5 shadow-[12px_12px_26px_rgba(10,13,15,0.58),-9px_-9px_20px_rgba(72,80,84,0.14)]">
      <div className="flex items-center gap-2 mb-3">
        <FileText className="w-4 h-4 text-aime-red" />
        <div className="text-[10px] tracking-[0.25em] text-zinc-400 font-semibold uppercase">
          AIME · Cachet préparatoire
        </div>
      </div>
      <div className="text-[10px] font-mono text-zinc-500 mb-3">{fiche.cachet_code || "—"}</div>

      <Field label="Date" value={fiche.date ? new Date(fiche.date).toLocaleDateString("fr-FR") : "—"} />
      <Field label="Employeur" value={fiche.employer || "—"} />
      <Field label="Production" value={fiche.production || "—"} />
      <Field label="Lieu" value={fiche.location || "—"} />
      <Field label="Type" value={fiche.type || "—"} />
      <Field label="Annexe" value={fiche.annexe ? `Annexe ${fiche.annexe}` : "—"} />
      <Field label="Durée" value={fiche.duration_hours ? `${fiche.duration_hours} h` : "—"} />
      <Field label="Montant" value={fiche.amount ? `${fiche.amount} €` : "—"} />
      <Field label="Statut" value={fiche.status || "—"} />

      {fiche.missing_documents > 0 && (
        <div className="mt-3 text-[11px] text-aime-red font-medium">
          ⚠ {fiche.missing_documents} document(s) manquant(s)
        </div>
      )}
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="flex items-baseline gap-3 py-2 border-b border-black/20 last:border-0 shadow-[0_1px_0_rgba(255,255,255,0.035)]">
      <span className="text-[10px] uppercase tracking-wider text-zinc-500 w-24 shrink-0">{label}</span>
      <span className="text-sm text-zinc-100 truncate">{value}</span>
    </div>
  );
}