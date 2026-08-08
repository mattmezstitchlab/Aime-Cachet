import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, AlertCircle, MapPin, Mail, Calendar, Landmark, Download, CheckCircle2, ExternalLink } from "lucide-react";
import { formatDayLabel, STATUS_META } from "@/lib/aimeData";
import { iconForDocType, TONES } from "@/lib/timelineIcons";
import TimelineQRButton from "@/components/aime/timeline/TimelineQRButton";
import { mailtoRelance, openGuso, openGoogleCalendar } from "@/lib/smartActions";
import { generateFichePDF } from "@/lib/ficheGenerator";
import { logEvent } from "@/lib/historyLog";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function SmartTimelineRow({ prestation, onChanged, hideDate = false, selected = false, onSelect }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const day = formatDayLabel(prestation.date);
  const meta = STATUS_META?.[prestation.status] || { label: prestation.status, dot: "bg-zinc-400" };

  const { Icon: DocIcon, tone } = iconForDocType(prestation.doc_type);
  const t = TONES[tone] || TONES.neutral;
  const missing = prestation.missing_documents || 0;

  // Smart actions contextuelles
  const actions = [];
  actions.push({
    key: "open",
    Icon: ExternalLink,
    label: "Ouvrir la fiche",
    onClick: () => navigate(`/fiche/${prestation.id}`),
    accent: true,
  });
  actions.push({
    key: "export",
    Icon: Download,
    label: "Exporter PDF",
    onClick: async () => {
      generateFichePDF(prestation, { cachetCode: prestation.cachet_code, docType: prestation.doc_type || "cachet" });
      await logEvent({ kind: "dossier_exported", text: `Fiche exportée — ${prestation.employer || "Sans employeur"}`, prestation_id: prestation.id, accent: "white" });
      toast.success("Fiche exportée");
      onChanged?.();
    },
  });
  if (missing > 0 && prestation.employer_email) {
    actions.push({
      key: "relance",
      Icon: Mail,
      label: "Relancer l'employeur",
      onClick: () => mailtoRelance(prestation),
    });
  }
  if (prestation.sector === "spectacle_vivant" && prestation.employer_kind === "occasionnel") {
    actions.push({
      key: "guso",
      Icon: Landmark,
      label: "GUSO",
      onClick: async () => {
        const r = await openGuso(prestation);
        if (r.copied) toast.success("SIRET copié", { description: r.value });
      },
    });
  }
  actions.push({
    key: "agenda",
    Icon: Calendar,
    label: "Ajouter à l'agenda",
    onClick: () => openGoogleCalendar(prestation),
  });
  if (prestation.status !== "valide" && prestation.status !== "transmis" && prestation.status !== "pret_a_verifier") {
    actions.push({
      key: "ready",
      Icon: CheckCircle2,
      label: "Marquer prête à vérifier",
      onClick: async () => {
        await base44.entities.Prestation.update(prestation.id, { status: "pret_a_verifier" });
        await logEvent({ kind: "status_changed", text: `Prestation marquée prête à vérifier — ${prestation.employer || "Sans employeur"}`, prestation_id: prestation.id, accent: "red" });
        toast.success("Statut mis à jour");
        onChanged?.();
      },
    });
  }

  // Mode groupé : pas de pl, pas de date, picto aligné à gauche de la carte
  const wrapperClass = hideDate
    ? "relative pl-12"
    : "relative pl-20 sm:pl-24 py-3";
  const iconClass = hideDate
    ? `absolute left-0 top-1.5 w-9 h-9 rounded-2xl ${t.bg} ${t.text} ring-4 ring-white flex items-center justify-center`
    : `absolute left-[60px] sm:left-[68px] top-4 w-9 h-9 rounded-2xl ${t.bg} ${t.text} ring-4 ring-white flex items-center justify-center`;

  return (
    <li className={wrapperClass}>
      {/* Date + QR à gauche — masqués en mode groupé */}
      {!hideDate && (
        <div className="absolute left-0 top-5 w-16 flex flex-col items-end pr-3">
          <div className="text-zinc-900 font-semibold text-base leading-none">{day.day}</div>
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider mt-1">{day.month}</div>
          <TimelineQRButton prestation={prestation} />
        </div>
      )}

      {/* Picto sur la ligne */}
      <div className={iconClass}>
        <DocIcon className="w-4 h-4" />
      </div>

      {/* Carte */}
      <div className={`bg-white rounded-2xl ring-1 transition-all ${selected ? "ring-zinc-400 shadow-sm" : open ? "ring-zinc-300 shadow-sm" : "ring-zinc-100 hover:ring-zinc-200"}`}>
        <button
          onClick={() => { onSelect?.(prestation); setOpen((o) => !o); }}
          className={`w-full text-left px-4 py-3.5 rounded-2xl transition-colors ${selected ? "bg-zinc-50" : ""}`}
          aria-expanded={open}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="text-zinc-900 font-medium text-[15px] truncate">
                {prestation.employer || "Sans employeur"}
              </div>
              <div className="text-xs text-zinc-500 truncate mt-0.5 flex items-center gap-2">
                {prestation.location && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {prestation.location}
                  </span>
                )}
                {prestation.amount > 0 && <span className="text-zinc-900 font-medium">{prestation.amount} €</span>}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {/* Colonne badge "!" — largeur fixe pour que les badges s'alignent verticalement
                  d'une ligne à l'autre, même quand il n'y a pas de documents manquants. */}
              <div className="w-10 flex justify-end">
                {missing > 0 && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                    <AlertCircle className="w-3 h-3" />
                    {missing}
                  </span>
                )}
              </div>
              {/* Colonne statut — largeur fixe pour aligner les pastilles et libellés. */}
              <span className="inline-flex items-center gap-1.5 text-[11px] text-zinc-500 w-[92px]">
                <span className={`w-1.5 h-1.5 rounded-full ${meta.dot} shrink-0`} />
                <span className="truncate">{meta.label}</span>
              </span>
              <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${open ? "rotate-180" : ""}`} />
            </div>
          </div>
        </button>

        {/* Menu déplié */}
        {open && (
          <div className="border-t border-zinc-100 px-3 py-3">
            {/* Métadonnées résumées */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3 px-1">
              <Meta label="Type" value={prestation.type} />
              <Meta label="Secteur" value={prestation.sector === "spectacle_vivant" ? "Spectacle vivant" : prestation.sector === "audiovisuel" ? "Audiovisuel" : prestation.sector} />
              <Meta label="Nature" value={prestation.nature} />
              <Meta label="Code" value={prestation.cachet_code} mono />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {actions.map((a) => (
                <button
                  key={a.key}
                  onClick={(e) => { e.stopPropagation(); a.onClick(); }}
                  className={`inline-flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-full transition-colors ${
                    a.accent
                      ? "bg-zinc-900 text-white hover:bg-zinc-800"
                      : "bg-zinc-50 text-zinc-700 hover:bg-zinc-100 border border-zinc-200"
                  }`}
                >
                  <a.Icon className="w-3.5 h-3.5" />
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </li>
  );
}

function Meta({ label, value, mono }) {
  return (
    <div className="min-w-0">
      <div className="text-[9px] uppercase tracking-wider text-zinc-400 font-medium">{label}</div>
      <div className={`text-[12px] text-zinc-800 truncate ${mono ? "font-mono" : ""}`}>{value || "—"}</div>
    </div>
  );
}