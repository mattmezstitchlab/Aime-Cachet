import React from "react";
import { X, Maximize2, Minimize2 } from "lucide-react";
import AttachMenuButton from "@/components/aime/machine/AttachMenuButton";

// Marque "AIME® 507" rendue en pur texte — pas de dépendance image, lisible partout.
function BrandMark({ size = "md" }) {
  const big = size === "lg" ? "text-3xl" : size === "sm" ? "text-lg" : "text-2xl";
  const small = size === "sm" ? "text-[10px]" : "text-xs";
  return (
    <div className="flex items-baseline gap-1.5 select-none" style={{ filter: "drop-shadow(0 0 8px rgba(255,0,0,0.18))" }}>
      <span className={`${big} font-display font-black tracking-tight text-white leading-none`}>
        AIME<span className="text-aime-red">®</span>
      </span>
      <span className={`${small} font-display font-black tracking-[0.18em] text-aime-red leading-none`}>507</span>
    </div>
  );
}

/**
 * Header de la machine AIME — picto photo à gauche, logo 507 centré, actions à droite.
 * Variants : "full" (page) | "compact" (panneau latéral).
 */
export default function MachineHeader({ variant = "full", model, onClose, onExpand, onCapture, onCreate, onAskQuestion, onPrepareReminder, onShowPriorities }) {
  const isCompact = variant === "compact";

  return (
    <div
      className={`relative shrink-0 border-b border-black/20 bg-zinc-900 shadow-[8px_8px_18px_rgba(10,13,15,0.45),-6px_-6px_14px_rgba(72,80,84,0.12)] ${
        isCompact ? "px-4 py-3" : "px-5 md:px-7 py-4"
      }`}
    >
      {/* Bouton + à gauche : joindre photo ou document */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
        {onCapture && (
          <AttachMenuButton
            onCapture={onCapture}
            onCreate={onCreate}
            onAskQuestion={onAskQuestion}
            onPrepareReminder={onPrepareReminder}
            onShowPriorities={onShowPriorities}
            size={isCompact ? "sm" : "md"}
          />
        )}
      </div>

      {/* Bloc central : marque AIME® 507 + sous-titre */}
      <div className="flex flex-col items-center justify-center text-center">
        <div className="relative">
          <BrandMark size={isCompact ? "sm" : "md"} />
          <span className="absolute -top-0.5 -right-1.5 w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_6px_rgba(74,222,128,0.8)]" />
        </div>
        <div
          className={`tracking-[0.22em] text-zinc-500 font-semibold uppercase mt-1.5 truncate ${
            isCompact ? "text-[9px]" : "text-[10px]"
          }`}
        >
          Analyse intermittence
        </div>
      </div>

      {/* Actions à droite */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
        {!isCompact && (
          <div className="hidden sm:flex items-center gap-1.5 mr-1 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[9px] tracking-[0.22em] text-green-400 font-semibold">EN LIGNE</span>
          </div>
        )}

        {onClose && (
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="w-8 h-8 rounded-full bg-[#252b2e] flex items-center justify-center text-zinc-400 hover:text-white shadow-[5px_5px_10px_rgba(10,13,15,0.55),-4px_-4px_8px_rgba(70,78,82,0.14)] hover:shadow-[inset_4px_4px_8px_rgba(10,13,15,0.55),inset_-3px_-3px_7px_rgba(70,78,82,0.12)] transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}