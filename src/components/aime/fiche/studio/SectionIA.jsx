import React, { useState } from "react";
import { Sparkles, ScanLine, Building2, Languages, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

function ToolButton({ icon: Icon, label, subtitle, onClick, loading, comingSoon }) {
  return (
    <button
      onClick={onClick}
      disabled={loading || comingSoon}
      className={`w-full flex items-center gap-2.5 p-2.5 rounded-lg border transition-all text-left ${
        comingSoon ? "border-white/5 opacity-50 cursor-not-allowed" : "border-white/10 hover:border-aime-red hover:bg-aime-red/5"
      }`}
    >
      <span className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
        {loading ? <Loader2 className="w-3.5 h-3.5 text-aime-red animate-spin" /> : <Icon className="w-3.5 h-3.5 text-zinc-300" />}
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-[11px] text-white font-semibold leading-tight">{label}</span>
        <span className="block text-[9px] text-zinc-500 mt-0.5">{subtitle}</span>
      </span>
      {comingSoon && <span className="text-[8px] tracking-wider text-zinc-500 uppercase">Bientôt</span>}
    </button>
  );
}

export default function SectionIA({ prestation }) {
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditResult, setAuditResult] = useState(null);

  const runAudit = async () => {
    setAuditLoading(true);
    setAuditResult(null);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Tu es un expert administratif du spectacle vivant français. Analyse cette fiche de prestation et identifie les éventuels problèmes de conformité. Sois concis (max 3 points). 

Données : ${JSON.stringify(prestation)}

Réponds en JSON.`,
        response_json_schema: {
          type: "object",
          properties: {
            status: { type: "string", enum: ["ok", "warning", "error"] },
            summary: { type: "string" },
            issues: { type: "array", items: { type: "string" } },
          },
          required: ["status", "summary"],
        },
      });
      setAuditResult(result);
      toast.success("Audit terminé");
    } catch (err) {
      toast.error("Erreur lors de l'audit");
    } finally {
      setAuditLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-aime-red/10 to-purple-500/10 border border-aime-red/20">
        <Sparkles className="w-3.5 h-3.5 text-aime-red shrink-0" />
        <span className="text-[10px] text-zinc-200 leading-tight">Outils intelligents propulsés par IA.</span>
      </div>

      <div className="space-y-1.5">
        <ToolButton
          icon={ScanLine}
          label="Audit conformité"
          subtitle="Vérifie la fiche"
          onClick={runAudit}
          loading={auditLoading}
        />
        <ToolButton icon={Building2} label="Vérifier SIRET" subtitle="Via INSEE Sirene" comingSoon />
        <ToolButton icon={Languages} label="Traduire" subtitle="EN / ES / IT" comingSoon />
      </div>

      {auditResult && (
        <div className="p-3.5 rounded-lg border border-white/10 bg-black">
          <div className="flex items-start gap-2.5">
            {auditResult.status === "ok" ?
              <CheckCircle2 className="w-4 h-4 text-white shrink-0 mt-0.5" /> :
              <AlertCircle className="w-4 h-4 text-white shrink-0 mt-0.5" />
            }
            <div className="flex-1 min-w-0">
              <p className="text-[12px] text-white font-semibold leading-snug">{auditResult.summary}</p>
              {auditResult.issues?.length > 0 && (
                <ul className="mt-2.5 space-y-1.5">
                  {auditResult.issues.map((iss, i) => (
                    <li key={i} className="text-[11px] text-white/85 leading-snug">• {iss}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}