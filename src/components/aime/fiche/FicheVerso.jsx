import React from "react";
import { ShieldCheck, Lock, Calendar, FileText } from "lucide-react";
import QRBadge from "@/components/aime/fiche/QRBadge";
import { formatDateFR } from "@/lib/aimeData";
import DraftWatermark from "@/components/aime/fiche/DraftWatermark";

function Row({ icon: Icon, label, value, mono }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-zinc-100 last:border-0">
      <div className="w-7 h-7 rounded-md bg-zinc-50 flex items-center justify-center shrink-0">
        <Icon className="w-3.5 h-3.5 text-zinc-500" strokeWidth={1.8} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[9px] tracking-[0.2em] uppercase text-zinc-400 mb-0.5">{label}</div>
        <div className={`text-sm text-zinc-900 ${mono ? "font-mono text-xs" : "font-medium"} break-all`}>{value || "—"}</div>
      </div>
    </div>
  );
}

export default function FicheVerso({ prestation, cachetCode, verifyUrl }) {
  const d = prestation?.date ? formatDateFR(prestation.date) : null;
  const createdAt = prestation?.created_date
    ? new Date(prestation.created_date).toLocaleString("fr-FR", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      })
    : "—";

  return (
    <div
      className="relative bg-white shadow-2xl mx-auto overflow-hidden"
      style={{ width: "210mm", minHeight: "297mm", padding: "18mm" }}
    >
      {/* Watermark brouillon tant que la fiche n'est pas validée */}
      <DraftWatermark status={prestation?.status} theme="light" />
      {/* Bandeau d'en-tête */}
      <div className="border-b-2 border-aime-red pb-4 mb-8 flex items-baseline justify-between">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-3xl leading-none">AIME</span>
          <span className="text-[9px] tracking-[0.3em] text-aime-red font-bold">VERSO</span>
        </div>
        <div className="text-[9px] tracking-[0.2em] uppercase text-zinc-400">Page de vérification</div>
      </div>

      {/* Hero : QR + code */}
      <div className="flex flex-col items-center text-center mb-10">
        <div className="text-[10px] tracking-[0.25em] uppercase text-aime-red font-bold mb-3">Vérification</div>
        <h2 className="font-display text-3xl text-zinc-900 leading-tight mb-2">
          Scannez pour vérifier
        </h2>
        <p className="text-sm text-zinc-500 max-w-md mb-6">
          Ce code mène à la page de vérification de cette fiche dans AIME. Il atteste de son existence en tant que document préparatoire privé — sans valeur officielle.
        </p>
        <div className="p-4 bg-white border border-zinc-200 rounded-2xl shadow-sm">
          <QRBadge value={verifyUrl} size={200} />
        </div>
        <div className="font-mono text-xs text-zinc-700 mt-4 tracking-wider">{cachetCode}</div>
      </div>

      {/* Métadonnées */}
      <div className="bg-zinc-50/60 border border-zinc-100 rounded-2xl p-5 mb-8">
        <div className="text-[10px] tracking-[0.2em] uppercase text-zinc-500 font-semibold mb-3">
          Métadonnées du document
        </div>
        <Row icon={FileText} label="Code Cachet" value={cachetCode} mono />
        <Row icon={Calendar} label="Date de prestation" value={d ? `${d.day} ${d.month} ${d.year}` : "—"} />
        <Row icon={ShieldCheck} label="Créé le" value={createdAt} />
        <Row icon={Lock} label="URL de vérification" value={verifyUrl} mono />
      </div>

      {/* Mentions */}
      <div className="text-[10px] text-zinc-500 leading-relaxed border-t border-zinc-100 pt-5">
        <div className="font-bold text-zinc-900 mb-2 text-[11px]">Mentions légales</div>
        <p>
          AIME n'est ni mandaté ni affilié à GUSO, France Travail, Urssaf, Audiens ou Pôle Emploi Spectacle.
          Ce document préparatoire privé ne remplace ni une déclaration AEM, ni un contrat de travail, ni une attestation employeur.
          Les démarches officielles restent à effectuer auprès des organismes compétents.
          Données déclaratives non vérifiées, éditées par l'utilisateur.
        </p>
      </div>

      <div className="absolute bottom-[10mm] left-[18mm] right-[18mm] flex items-center justify-between text-[9px] text-zinc-400 italic border-t border-zinc-100 pt-3">
        <span>AIME prépare. L'utilisateur vérifie. L'organisme officiel valide.</span>
        <span className="font-mono">{cachetCode}</span>
      </div>
    </div>
  );
}