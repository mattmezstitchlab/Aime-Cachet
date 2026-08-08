import React, { useMemo, useState } from "react";
import { Sparkles, ScanLine, Building2, Languages, CheckCircle2, AlertCircle } from "lucide-react";
import { LANGUAGE_OPTIONS, validateSiret } from "@/lib/studioCachet";

function ToolCard({ icon: Icon, title, subtitle, children }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <div className="flex items-start gap-2.5 mb-2.5">
        <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-zinc-200" />
        </span>
        <div>
          <div className="text-[11px] text-white font-semibold leading-tight">{title}</div>
          <div className="text-[9px] text-zinc-500 mt-0.5">{subtitle}</div>
        </div>
      </div>
      {children}
    </div>
  );
}

function ResultBox({ ok, title, items = [] }) {
  return (
    <div className="p-3 rounded-lg border border-white/10 bg-black/40">
      <div className="flex items-start gap-2.5">
        {ok ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        ) : (
          <AlertCircle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
        )}
        <div className="min-w-0 flex-1">
          <p className="text-[12px] text-white font-semibold leading-snug">{title}</p>
          {items.length > 0 && (
            <ul className="mt-2.5 space-y-1.5">
              {items.map((item) => (
                <li key={item} className="text-[11px] text-white/80 leading-snug">• {item}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SectionIA({ prestation, language = "fr", onLanguageChange }) {
  const [auditOpen, setAuditOpen] = useState(false);
  const [siretOpen, setSiretOpen] = useState(false);

  const audit = useMemo(() => {
    const missing = [];
    if (!prestation?.employer) missing.push("Nom d'employeur manquant");
    if (!prestation?.date) missing.push("Date de prestation absente");
    if (!prestation?.location) missing.push("Lieu non renseigné");
    if (!prestation?.amount) missing.push("Montant brut non défini");
    if (!prestation?.duration_hours) missing.push("Durée non renseignée");
    if (!prestation?.employer_siret) missing.push("SIRET employeur non saisi");
    if ((prestation?.missing_documents || 0) > 0) {
      missing.push(`${prestation.missing_documents} document(s) restant(s) à préparer`);
    }
    return {
      ok: missing.length === 0,
      title: missing.length === 0
        ? "La fiche est complète pour un brouillon studio."
        : "La fiche peut être améliorée avant export.",
      items: missing,
    };
  }, [prestation]);

  const siretResult = useMemo(() => validateSiret(prestation?.employer_siret), [prestation?.employer_siret]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-aime-red/10 to-purple-500/10 border border-aime-red/20">
        <Sparkles className="w-3.5 h-3.5 text-aime-red shrink-0" />
        <span className="text-[10px] text-zinc-200 leading-tight">Assistant studio local : audit, contrôle SIRET et langue du document.</span>
      </div>

      <ToolCard
        icon={ScanLine}
        title="Audit du brouillon"
        subtitle="Contrôle rapide des champs clés"
      >
        <button
          onClick={() => setAuditOpen((value) => !value)}
          className="w-full px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-white transition-colors"
        >
          {auditOpen ? "Masquer l'audit" : "Lancer l'audit"}
        </button>
        {auditOpen && <div className="mt-3"><ResultBox ok={audit.ok} title={audit.title} items={audit.items} /></div>}
      </ToolCard>

      <ToolCard
        icon={Building2}
        title="Vérifier le SIRET"
        subtitle="Contrôle de longueur et algorithme de Luhn"
      >
        <button
          onClick={() => setSiretOpen((value) => !value)}
          className="w-full px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-white transition-colors"
        >
          {siretOpen ? "Masquer le contrôle" : "Vérifier le SIRET"}
        </button>
        {siretOpen && (
          <div className="mt-3">
            <ResultBox
              ok={siretResult.ok}
              title={siretResult.message}
              items={prestation?.employer_siret ? [`Numéro analysé : ${prestation.employer_siret}`] : ["Ajoutez un SIRET dans la section Contenu pour lancer le contrôle."]}
            />
          </div>
        )}
      </ToolCard>

      <ToolCard
        icon={Languages}
        title="Langue du document"
        subtitle="Aperçu instantané FR / EN / ES"
      >
        <div className="grid grid-cols-3 gap-2">
          {LANGUAGE_OPTIONS.map((option) => {
            const active = language === option.id;
            return (
              <button
                key={option.id}
                onClick={() => onLanguageChange?.(option.id)}
                className={`px-2.5 py-2 rounded-lg border text-[11px] transition-colors ${
                  active ? "border-aime-red bg-aime-red/10 text-white" : "border-white/10 text-zinc-300 hover:border-white/20"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </ToolCard>
    </div>
  );
}