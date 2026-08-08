import React, { useState } from "react";
import { Sparkles, FileText, Clock, AlertCircle, ChevronRight } from "lucide-react";
import MachineMatrixScreen from "@/components/aime/machine/MachineMatrixScreen";

/**
 * Clone interactif de l'assistant AIME pour la landing.
 * - 3 chips de questions pré-définies, cliquables
 * - Affiche la réponse correspondante dans une console matrix réelle
 * - Données mockées (pas d'appel LLM)
 * - Responsive : empile sur mobile, 2 colonnes sur desktop
 */

const SCENARIOS = [
  {
    key: "hours",
    Icon: Clock,
    question: "Combien d'heures il me reste ?",
    answer: "IL VOUS RESTE 95H AVANT LES 507H. RYTHME ACTUEL 32H PAR MOIS.",
    extra: {
      type: "stat",
      title: "Cockpit 507h",
      lines: [
        { label: "Validées", value: "412 h" },
        { label: "Restantes", value: "95 h" },
        { label: "Annexe", value: "8 · Artiste" },
      ],
    },
  },
  {
    key: "missing",
    Icon: AlertCircle,
    question: "Quelles fiches sont incomplètes ?",
    answer: "3 FICHES A COMPLETER. FESTIVAL AVIGNON MANQUE 5 DOCS.",
    extra: {
      type: "fiche",
      title: "Festival d'Avignon",
      meta: "21 mai · Artiste · 5 documents manquants",
      status: "À compléter",
    },
  },
  {
    key: "next",
    Icon: FileText,
    question: "Que dois-je faire ensuite ?",
    answer: "PRIORITE TRANSMETTRE FICHE FESTIVAL MARSATAC AU GUSO.",
    extra: {
      type: "action",
      title: "Festival Marsatac",
      meta: "Marseille · 19 mai · 420 €",
      action: "Déclaration GUSO à finaliser",
    },
  },
];

export default function LandingAssistantDemo() {
  const [activeKey, setActiveKey] = useState("hours");
  const active = SCENARIOS.find((s) => s.key === activeKey) || SCENARIOS[0];

  return (
    <section className="relative bg-zinc-950 overflow-hidden">
      {/* Reflets diagonaux subtils */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(120deg, rgba(255,0,0,0.04) 0%, transparent 35%, transparent 65%, rgba(255,255,255,0.02) 100%)",
        }}
      />
      <div className="relative max-w-6xl mx-auto px-5 md:px-8 py-16 md:py-24">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.22em] text-aime-red font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            ASSISTANT AIME — DÉMO
          </div>
          <h2 className="font-display font-black text-3xl md:text-5xl tracking-tight text-white leading-[1.05]">
            Une intelligence<br />
            <span className="text-aime-red">qui vous comprend.</span>
          </h2>
          <p className="text-zinc-400 mt-4 max-w-xl mx-auto text-sm md:text-base">
            Posez n'importe quelle question sur votre intermittence. L'assistant
            comprend votre contexte, vos fiches, votre progression.
          </p>
        </div>

        {/* Démo : chips + console */}
        <div className="grid lg:grid-cols-[1fr,1.2fr] gap-6 lg:gap-10 items-start">
          {/* Colonne gauche — questions cliquables */}
          <div className="space-y-3">
            <div className="text-[10px] tracking-[0.22em] text-zinc-500 font-semibold mb-3">
              ESSAYEZ UNE QUESTION
            </div>
            {SCENARIOS.map((s) => {
              const isActive = s.key === activeKey;
              return (
                <button
                  key={s.key}
                  onClick={() => setActiveKey(s.key)}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                    isActive
                      ? "bg-aime-red/10 border-aime-red/50 text-white"
                      : "bg-white/[0.03] border-white/10 text-zinc-300 hover:bg-white/[0.06] hover:border-white/20"
                  }`}
                >
                  <span
                    className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                      isActive ? "bg-aime-red text-white" : "bg-white/5 text-zinc-400"
                    }`}
                  >
                    <s.Icon className="w-4 h-4" />
                  </span>
                  <span className="flex-1 text-sm font-medium">{s.question}</span>
                  <ChevronRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isActive ? "text-aime-red translate-x-0.5" : "text-zinc-600"
                    }`}
                  />
                </button>
              );
            })}
            <p className="text-[11px] text-zinc-500 leading-relaxed pt-2">
              Données d'exemple. Dans l'app, l'assistant analyse vos vraies
              fiches et votre vrai cockpit.
            </p>
          </div>

          {/* Colonne droite — console matrix + carte */}
          <div className="space-y-3">
            <MachineMatrixScreen text={active.answer} loading={false} />
            <ExtraCard extra={active.extra} />
          </div>
        </div>
      </div>
    </section>
  );
}

function ExtraCard({ extra }) {
  if (!extra) return null;

  if (extra.type === "stat") {
    return (
      <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
        <div className="text-[10px] tracking-[0.22em] text-aime-red font-semibold mb-3">
          {extra.title}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {extra.lines.map((l) => (
            <div key={l.label}>
              <div className="text-[10px] tracking-wider text-zinc-500 uppercase">
                {l.label}
              </div>
              <div className="text-white font-display font-bold text-base mt-1">
                {l.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (extra.type === "fiche") {
    return (
      <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-aime-red/15 text-aime-red flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-white font-medium text-sm truncate">
            {extra.title}
          </div>
          <div className="text-zinc-500 text-xs truncate mt-0.5">
            {extra.meta}
          </div>
        </div>
        <span className="text-[10px] font-semibold tracking-wider text-aime-red bg-aime-red/10 px-2 py-1 rounded-full shrink-0">
          {extra.status}
        </span>
      </div>
    );
  }

  if (extra.type === "action") {
    return (
      <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/5 text-white flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-aime-red" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-white font-medium text-sm truncate">
              {extra.title}
            </div>
            <div className="text-zinc-500 text-xs truncate mt-0.5">
              {extra.meta}
            </div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-white/5 text-xs text-zinc-300">
          → {extra.action}
        </div>
      </div>
    );
  }

  return null;
}