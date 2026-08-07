import React from "react";
import { Check, FileText } from "lucide-react";
import { generateFichePDF } from "@/lib/ficheGenerator";
import { logEvent } from "@/lib/historyLog";
import { toast } from "sonner";

const CONTENT = [
  "Informations prestation",
  "Employeur / Structure",
  "Chemin administratif conseillé",
  "Documents à vérifier",
  "Statut & suivi",
];

export default function DocumentBlock({ prestations = [], onAfterGenerate }) {
  const target =
    prestations.find((p) => p.status === "pret_a_verifier") ||
    [...prestations].sort((a, b) => (b.date || "").localeCompare(a.date || ""))[0];

  const handleGenerate = async () => {
    if (!target) {
      toast.error("Aucune prestation disponible", { description: "Créez d'abord une prestation pour générer une fiche." });
      return;
    }
    generateFichePDF(target);
    await logEvent({
      kind: "document_generated",
      text: `Fiche Cachet générée — ${target.employer}`,
      prestation_id: target.id,
      accent: "white",
    });
    toast.success("Fiche Cachet générée", { description: "Document préparatoire — sans valeur officielle." });
    onAfterGenerate?.();
  };

  return (
    <div id="documents" className="flex flex-col">
      <h3 className="text-[11px] tracking-[0.25em] font-medium text-zinc-500 uppercase mb-8">Fiche Cachet AIME</h3>

      <p className="text-sm text-zinc-300 leading-relaxed mb-6">
        Un PDF unique qui résume toute votre prestation : informations, employeur, démarches à effectuer, documents à préparer. Pratique à conserver, à transmettre ou à imprimer.
      </p>

      <div className="flex gap-6 mb-8">
        <div className="relative w-24 aspect-[3/4] bg-white rounded-md shadow-2xl shrink-0 p-2">
          <div className="text-[7px] font-bold text-aime-red tracking-widest">FICHE AIME</div>
          <div className="mt-1.5 space-y-0.5">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-[2px] bg-zinc-300" style={{ width: `${55 + (i * 7) % 40}%` }} />
            ))}
          </div>
          <div className="absolute bottom-2 left-2 right-2 h-3 bg-aime-red rounded-sm" />
        </div>

        <ul className="space-y-3 flex-1">
          {CONTENT.map((c) => (
            <li key={c} className="flex items-center gap-2.5 text-sm text-zinc-200">
              <Check className="w-3.5 h-3.5 text-aime-red shrink-0" strokeWidth={2.5} />
              {c}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap items-center gap-5">
        <button
          onClick={handleGenerate}
          disabled={!target}
          className="bg-aime-red hover:bg-red-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white text-sm font-medium px-6 py-2.5 rounded-full transition-colors inline-flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Générer la fiche PDF
        </button>
        {target && (
          <span className="text-xs text-zinc-500">Sera générée pour : <span className="text-zinc-300">{target.employer}</span></span>
        )}
      </div>

      <p className="text-xs text-zinc-500 leading-relaxed mt-6">
        Document préparatoire non opposable, sans valeur officielle. Il sert à organiser et vérifier les informations avant déclaration ou transmission auprès des organismes compétents.
      </p>
    </div>
  );
}