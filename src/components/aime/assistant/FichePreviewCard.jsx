import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, ExternalLink, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

/**
 * Aperçu d'une fiche embarqué dans la conversation.
 * - Mode "texte" : champs structurés lisibles (par défaut)
 * - Mode "image" : rendu visuel compact type carte document
 * - Bouton "Ouvrir en grand" → navigue vers /fiche/:id (et ferme le panneau si fourni)
 */
export default function FichePreviewCard({ record, onAfterOpen }) {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const id = record?.prestation_id || extractIdFromHref(record?.href);
    if (!id) {
      setLoading(false);
      return;
    }
    base44.entities.Prestation.get(id)
      .then((p) => { if (!cancelled) { setData(p); setLoading(false); } })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [record]);

  const handleOpen = () => {
    const id = data?.id || record?.prestation_id || extractIdFromHref(record?.href);
    if (!id) return;
    // 1) Tentative d'ouverture EN OVERLAY dans la machine si elle écoute
    try {
      const ev = new CustomEvent("aime:open-fiche-overlay", { detail: { ficheId: id }, cancelable: true });
      const accepted = window.dispatchEvent(ev);
      // Si un listener a appelé preventDefault → l'overlay a pris le relais, on n'navigue pas.
      if (ev.defaultPrevented) return;
    } catch (_) {}
    // 2) Sinon, comportement par défaut : navigation vers /fiche/:id
    if (onAfterOpen) onAfterOpen();
    navigate(`/fiche/${id}`);
  };

  if (loading) {
    return (
      <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 flex items-center gap-2">
        <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-500" />
        <span className="text-xs text-zinc-500">Chargement de la fiche…</span>
      </div>
    );
  }

  const fiche = data || {
    cachet_code: record?.code,
    status: record?.status,
    date: null,
    employer: null,
    location: null,
    type: null,
    annexe: null,
    amount: null,
    duration_hours: null,
    missing_documents: 0,
  };

  return (
    <div className="rounded-2xl border border-white/5 bg-[#252b2e] overflow-hidden shadow-[10px_10px_22px_rgba(10,13,15,0.55),-8px_-8px_18px_rgba(72,80,84,0.14)]">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-black/20 bg-[#242a2d] shadow-[inset_0_-1px_0_rgba(255,255,255,0.04)]">
        <FileText className="w-3.5 h-3.5 text-aime-red shrink-0" />
        <div className="text-[11px] font-mono text-zinc-300 truncate flex-1">
          {fiche.cachet_code || "Fiche sans code"}
        </div>
        {fiche.status && (
          <span className="text-[9px] tracking-wider uppercase px-1.5 py-0.5 rounded-full bg-[#252b2e] text-zinc-400 shadow-[inset_3px_3px_6px_rgba(10,13,15,0.5),inset_-2px_-2px_5px_rgba(72,80,84,0.12)]">
            {fiche.status}
          </span>
        )}
      </div>

      {/* Contenu */}
      <div className="px-3 py-3">
        <TexteView fiche={fiche} />
      </div>

      {/* Action */}
      <button
        onClick={handleOpen}
        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 border-t border-black/20 bg-[#252b2e] text-aime-red hover:text-white text-xs font-medium transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
      >
        <ExternalLink className="w-3 h-3" />
        Ouvrir la fiche complète
      </button>
    </div>
  );
}

function Row({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex items-baseline gap-2 py-0.5">
      <span className="text-[10px] uppercase tracking-wider text-zinc-500 w-20 shrink-0">{label}</span>
      <span className="text-xs text-zinc-200 truncate">{value}</span>
    </div>
  );
}

function TexteView({ fiche }) {
  return (
    <div className="space-y-0.5">
      <Row label="Date" value={fiche.date ? new Date(fiche.date).toLocaleDateString("fr-FR") : null} />
      <Row label="Employeur" value={fiche.employer} />
      <Row label="Lieu" value={fiche.location} />
      <Row label="Type" value={fiche.type} />
      <Row label="Annexe" value={fiche.annexe ? `Annexe ${fiche.annexe}` : null} />
      <Row label="Durée" value={fiche.duration_hours ? `${fiche.duration_hours} h` : null} />
      <Row label="Montant" value={fiche.amount ? `${fiche.amount} €` : null} />
      {fiche.missing_documents > 0 && (
        <Row label="Manquant" value={`${fiche.missing_documents} document(s)`} />
      )}
    </div>
  );
}

function extractIdFromHref(href) {
  if (!href) return null;
  const m = href.match(/\/fiche\/([^/?#]+)/);
  return m ? m[1] : null;
}