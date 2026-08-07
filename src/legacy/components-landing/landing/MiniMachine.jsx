import React from "react";
import AssistantIcon from "@/components/aime/assistant/AssistantIcon";
import RotatingTicker from "@/components/landing/RotatingTicker";

const DEFAULT_MESSAGES = [
  { text: "Rappel : 2 fiches à sceller avant 18h", color: "#ef4444" },
  { text: "Cap 80% des 507h franchie 🎉", color: "#22c55e" },
  { text: "Festival Avignon : justificatif manquant", color: "#facc15" },
  { text: "Théâtre du Rond-Point — prêt à transmettre", color: "#3b82f6" },
];

/**
 * Petite machine "en commentaire" — affichée à côté d'une vraie capture d'écran.
 * Représente la machine d'analyse qui interprète l'écran de droite.
 */
export default function MiniMachine({
  headline = "412 / 507h",
  caption = "Annexe 8 · Artiste",
  note,
  messages = DEFAULT_MESSAGES,
}) {
  return (
    <div className="bg-gradient-to-br from-zinc-900 via-black to-zinc-900 border border-zinc-800 rounded-2xl p-4 md:p-5 shadow-[0_15px_40px_-15px_rgba(255,0,0,0.35)] w-[240px]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-zinc-800 to-black border border-zinc-700 flex items-center justify-center">
          <AssistantIcon className="w-7 h-3.5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-display font-bold text-white leading-none">ASSISTANT</div>
          <div className="text-[8px] tracking-[0.2em] text-zinc-500 mt-1">ANALYSE</div>
        </div>
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
      </div>

      {/* Écran mini */}
      <div className="rounded-lg bg-black border border-zinc-800 p-3 mb-2">
        <div className="text-[8px] tracking-[0.2em] text-zinc-500 mb-1">LECTURE EN COURS</div>
        <div className="font-display font-black text-aime-red text-2xl leading-none tabular-nums">
          {headline}
        </div>
        <div className="text-[10px] text-zinc-400 mt-1">{caption}</div>
      </div>

      {/* Ticker rappels animés — sans picto, largeur fixe */}
      <div className="rounded-md bg-white/[0.03] border border-white/[0.06] px-2 py-1.5 text-[10px] text-zinc-300 h-7 flex items-center overflow-hidden">
        <RotatingTicker messages={messages} showDot={false} className="w-full" />
      </div>

      {/* Note */}
      {note && (
        <div className="text-[10px] text-zinc-400 leading-relaxed italic mt-2">
          « {note} »
        </div>
      )}
    </div>
  );
}