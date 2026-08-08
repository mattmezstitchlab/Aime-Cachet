import React, { useState } from "react";
import { Shield, Download, Mail, Check, Loader2, AlertCircle, FileText } from "lucide-react";
import { base44 } from "@/api/base44Client";

/**
 * Carte "Action proposée" — sceller / exporter / envoyer mail.
 * L'IA propose, l'utilisateur confirme par un clic.
 */
export default function ProposedActionCard({ proposed }) {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  if (!proposed || !proposed.kind) return null;

  const meta = {
    seal: { icon: Shield, color: "text-emerald-400", border: "border-emerald-500/40", bg: "bg-emerald-500/5", label: "Sceller la fiche", btn: "bg-emerald-500 hover:bg-emerald-500/90 text-black" },
    export_csv: { icon: Download, color: "text-sky-400", border: "border-sky-500/40", bg: "bg-sky-500/5", label: "Exporter en CSV", btn: "bg-sky-500 hover:bg-sky-500/90 text-white" },
    export_pdf: { icon: FileText, color: "text-sky-400", border: "border-sky-500/40", bg: "bg-sky-500/5", label: "Exporter en PDF", btn: "bg-sky-500 hover:bg-sky-500/90 text-white" },
    send_email: { icon: Mail, color: "text-violet-400", border: "border-violet-500/40", bg: "bg-violet-500/5", label: "Envoyer par email", btn: "bg-violet-500 hover:bg-violet-500/90 text-white" },
  }[proposed.kind] || { icon: Check, color: "text-zinc-400", border: "border-zinc-700", bg: "bg-zinc-900/40", label: "Exécuter", btn: "bg-zinc-700 hover:bg-zinc-600 text-white" };

  const Icon = meta.icon;

  const handleRun = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await executeAction(proposed);
      setResult(res);
      setDone(true);
    } catch (e) {
      setError(e?.message || "Action impossible.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`mt-3 rounded-lg border ${meta.border} bg-gradient-to-b from-zinc-950 to-black overflow-hidden`}>
      <div className={`flex items-center gap-2 px-3 py-2 border-b border-zinc-800 ${meta.bg}`}>
        <Icon className={`w-3.5 h-3.5 ${meta.color} shrink-0`} />
        <span className={`text-[10px] tracking-[0.18em] uppercase font-semibold ${meta.color}`}>
          Action — {meta.label}
        </span>
      </div>

      <div className="px-3 py-3 text-xs text-zinc-300 leading-relaxed">
        {proposed.summary || meta.label}
        {proposed.email && <div className="text-zinc-500 mt-1">Destinataire : {proposed.email}</div>}
        {proposed.period && <div className="text-zinc-500 mt-1">Période : {proposed.period}</div>}
      </div>

      {error && (
        <div className="mx-3 mb-3 text-[11px] text-red-400 bg-red-500/10 border border-red-500/30 rounded px-2 py-1.5 flex items-start gap-1.5">
          <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {done && result && (
        <div className="mx-3 mb-3 text-[11px] text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded px-2 py-1.5">
          {result.message || "Action réalisée."}
        </div>
      )}

      <div className="flex border-t border-zinc-800">
        <button
          onClick={handleRun}
          disabled={loading || done}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-medium transition-colors disabled:opacity-50 ${meta.btn}`}
        >
          {loading ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" /> En cours…
            </>
          ) : done ? (
            <>
              <Check className="w-3 h-3" /> Terminé
            </>
          ) : (
            <>
              <Icon className="w-3 h-3" /> Confirmer
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// --- Exécution ---------------------------------------------------------------
async function executeAction(p) {
  switch (p.kind) {
    case "seal":
      return runSeal(p);
    case "export_csv":
      return runExportCsv(p);
    case "export_pdf":
      return runExportPdf(p);
    case "send_email":
      return runSendEmail(p);
    default:
      throw new Error("Action inconnue.");
  }
}

async function runSeal(p) {
  if (!p.prestation_id) throw new Error("ID de fiche manquant pour le scellement.");
  const res = await base44.functions.invoke("sealCachet", { prestationId: p.prestation_id });
  if (res?.data?.error) throw new Error(res.data.error);
  return { message: "Empreinte technique scellée." };
}

async function runExportCsv(p) {
  const all = await base44.entities.Prestation.list("-date", 500);
  const rows = filterByPeriod(all, p.period);
  const csv = toCsv(rows);
  download(csv, `aime-export-${p.period || "toutes"}.csv`, "text/csv;charset=utf-8");
  return { message: `${rows.length} fiche(s) exportée(s).` };
}

async function runExportPdf(p) {
  const all = await base44.entities.Prestation.list("-date", 500);
  const rows = filterByPeriod(all, p.period);
  // PDF léger via text/html téléchargé en .html (le PDF natif serait un chantier en soi)
  const html = toHtmlReport(rows, p.period);
  download(html, `aime-recap-${p.period || "toutes"}.html`, "text/html;charset=utf-8");
  return { message: `Récap de ${rows.length} fiche(s) téléchargé.` };
}

async function runSendEmail(p) {
  if (!p.email) throw new Error("Adresse email manquante.");
  const all = await base44.entities.Prestation.list("-date", 500);
  const rows = filterByPeriod(all, p.period);
  const body = rows.length
    ? rows.map((r) => `- ${r.date || "?"} · ${r.employer || "Sans employeur"} · ${r.amount ? r.amount + "€" : ""} · ${r.duration_hours || 0}h`).join("\n")
    : "Aucune fiche sur cette période.";
  await base44.integrations.Core.SendEmail({
    to: p.email,
    subject: `Récap AIME ${p.period ? "— " + p.period : ""}`,
    body: `Bonjour,\n\nVoici votre récapitulatif AIME :\n\n${body}\n\n— Envoyé via AIME® 507`,
  });
  return { message: `Email envoyé à ${p.email}.` };
}

// --- Helpers -----------------------------------------------------------------
function filterByPeriod(rows, period) {
  if (!period) return rows;
  return rows.filter((r) => (r.date || "").startsWith(period));
}

function toCsv(rows) {
  const header = ["date", "employer", "production", "location", "type", "annexe", "duration_hours", "amount", "status", "cachet_code"];
  const escape = (v) => {
    if (v === null || v === undefined) return "";
    const s = String(v).replace(/"/g, '""');
    return /[",\n;]/.test(s) ? `"${s}"` : s;
  };
  const lines = [header.join(";")];
  rows.forEach((r) => lines.push(header.map((k) => escape(r[k])).join(";")));
  return lines.join("\n");
}

function toHtmlReport(rows, period) {
  const head = `<style>body{font-family:Inter,sans-serif;padding:24px;color:#111}h1{color:#e60012}table{border-collapse:collapse;width:100%;margin-top:16px}th,td{border:1px solid #ddd;padding:6px 8px;font-size:12px;text-align:left}th{background:#f5f5f5}</style>`;
  const body = `<h1>Récap AIME${period ? " — " + period : ""}</h1><p>${rows.length} fiche(s)</p><table><thead><tr><th>Date</th><th>Employeur</th><th>Production</th><th>Lieu</th><th>Heures</th><th>Montant</th><th>Statut</th></tr></thead><tbody>${rows.map((r) => `<tr><td>${r.date || ""}</td><td>${r.employer || ""}</td><td>${r.production || ""}</td><td>${r.location || ""}</td><td>${r.duration_hours || ""}</td><td>${r.amount ? r.amount + " €" : ""}</td><td>${r.status || ""}</td></tr>`).join("")}</tbody></table>`;
  return `<!doctype html><html><head><meta charset="utf-8"><title>Récap AIME</title>${head}</head><body>${body}</body></html>`;
}

function download(content, filename, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}