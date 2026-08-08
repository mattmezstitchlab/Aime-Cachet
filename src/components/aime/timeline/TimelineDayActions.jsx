import React from "react";
import { Download, Mail, CheckCircle2, FileText } from "lucide-react";
import { toast } from "sonner";
import { generateFichePDF } from "@/lib/ficheGenerator";
import { logEvent } from "@/lib/historyLog";
import { base44 } from "@/api/base44Client";

function ActionPill({ icon: Icon, label, onClick, accent }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 text-[12px] font-medium px-3.5 py-2 rounded-full border transition-colors ${
        accent
          ? "bg-zinc-900 border-zinc-900 text-white hover:bg-zinc-800"
          : "bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50"
      }`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}

export default function TimelineDayActions({ items = [], onChanged }) {
  const prestations = items.filter((i) => i.type === "prestation").map((i) => i.prestation);
  const count = prestations.length;

  const handleExportAll = async () => {
    if (!count) return toast.error("Aucune prestation à exporter ce jour");
    for (const p of prestations) generateFichePDF(p, { cachetCode: p.cachet_code, docType: p.doc_type || "cachet" });
    await logEvent({ kind: "dossier_exported", text: `Export groupé du jour (${count} fiche${count > 1 ? "s" : ""})`, accent: "white" });
    toast.success(`${count} fiche${count > 1 ? "s" : ""} exportée${count > 1 ? "s" : ""}`);
    onChanged?.();
  };

  const handleMarkAllReady = async () => {
    if (!count) return;
    await Promise.all(prestations.filter((p) => p.status !== "valide" && p.status !== "transmis").map((p) => base44.entities.Prestation.update(p.id, { status: "pret_a_verifier" })));
    await logEvent({ kind: "status_changed", text: `${count} prestation${count > 1 ? "s" : ""} marquée${count > 1 ? "s" : ""} prête${count > 1 ? "s" : ""} à vérifier`, accent: "red" });
    toast.success("Statuts mis à jour");
    onChanged?.();
  };

  const handleRecapMail = () => {
    const subject = `Récapitulatif du jour — ${count} prestation${count > 1 ? "s" : ""}`;
    const body = prestations.map((p) => `• ${p.employer || "—"} · ${p.location || "—"} · ${p.cachet_code || ""}`).join("\n");
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="ml-20 sm:ml-24 mb-4 -mt-1">
      <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] text-zinc-500 font-medium">
            {count} prestation{count > 1 ? "s" : ""} ce jour
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <ActionPill icon={Download} label="Tout exporter" onClick={handleExportAll} accent />
          <ActionPill icon={Mail} label="Récap mail" onClick={handleRecapMail} />
          <ActionPill icon={CheckCircle2} label="Marquer prêt" onClick={handleMarkAllReady} />
          <ActionPill icon={FileText} label="Aperçu du jour" onClick={() => toast("Vue agrégée à venir")} />
        </div>
      </div>
    </div>
  );
}