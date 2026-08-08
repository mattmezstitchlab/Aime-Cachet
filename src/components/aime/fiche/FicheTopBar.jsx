import React from "react";
import { RotateCw } from "lucide-react";
import DocPicker from "@/components/aime/fiche/DocPicker";
import SealButton from "@/components/aime/fiche/SealButton";
import GlobalToolbar from "@/components/aime/GlobalToolbar";

// Barre haute de la page Fiche : DocPicker + Verso + Sceller (gauche) · toolbar globale (droite).
export default function FicheTopBar({ docType, onDocChange, flipped, onToggleFlip, prestation, onSealed }) {
  return (
    <>
      {/* Toolbar globale (droite) + retour caché — la gauche est gérée ci-dessous */}
      <GlobalToolbar showBack={false} />

      {/* DocPicker + Verso + Sceller : alignés à gauche, espacement régulier.
          Pas d'overflow-x-auto : il créerait un contexte de clipping qui couperait
          le menu déroulant du DocPicker (popover absolu). flex-wrap gère le débordement. */}
      <div className="fixed top-3 left-3 right-3 sm:right-auto lg:left-20 z-40 flex flex-wrap items-center gap-2">
        <DocPicker embedded currentDoc={docType} onSelect={onDocChange} />
        <button
          onClick={onToggleFlip}
          className={`inline-flex items-center gap-2 text-[12px] font-medium px-3 py-2 rounded-full shadow-sm transition-colors ${
            flipped
              ? "bg-zinc-900 text-white"
              : "bg-white/95 backdrop-blur-xl text-zinc-700 border border-zinc-200 hover:border-zinc-400"
          }`}
          aria-label={flipped ? "Voir le recto" : "Voir le verso"}
        >
          <RotateCw className={`w-3.5 h-3.5 transition-transform ${flipped ? "rotate-180" : ""}`} />
          <span className="hidden sm:inline">{flipped ? "Recto" : "Verso"}</span>
        </button>
        {prestation && (
          <SealButton prestation={prestation} onSealed={onSealed} inline />
        )}
      </div>
    </>
  );
}