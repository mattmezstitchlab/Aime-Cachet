import React from "react";
import { Pencil, FilePlus, MoveVertical } from "lucide-react";

export default function SectionContenu({ textEditable, onTextEditableChange, customNotes, onCustomNotesChange }) {
  return (
    <div className="space-y-4">
      <button
        onClick={() => onTextEditableChange(!textEditable)}
        className={`w-full flex items-center justify-between p-2.5 rounded-lg border transition-all ${
          textEditable ? "border-aime-red bg-aime-red/10" : "border-white/10 hover:border-white/20"
        }`}
      >
        <span className="flex items-center gap-2">
          <Pencil className="w-3.5 h-3.5 text-zinc-300" />
          <span className="text-[12px] text-white font-medium">
            {textEditable ? "Édition activée" : "Activer l'édition inline"}
          </span>
        </span>
        <div className={`w-8 h-4 rounded-full p-0.5 transition-all ${textEditable ? "bg-aime-red" : "bg-white/20"}`}>
          <div className={`w-3 h-3 rounded-full bg-white transition-transform ${textEditable ? "translate-x-4" : ""}`} />
        </div>
      </button>

      <div>
        <div className="text-[9px] tracking-[0.18em] text-zinc-500 font-semibold uppercase mb-2">Notes libres</div>
        <textarea
          value={customNotes || ""}
          onChange={(e) => onCustomNotesChange(e.target.value)}
          rows={3}
          placeholder="Ajoutez une note visible en pied de page"
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-[11px] text-white placeholder:text-zinc-600 focus:border-aime-red focus:outline-none resize-none"
        />
      </div>

      <div className="space-y-1.5 opacity-60">
        <button disabled className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg border border-white/10 cursor-not-allowed">
          <FilePlus className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-[11px] text-zinc-400">Ajouter une page</span>
          <span className="ml-auto text-[8px] tracking-wider text-zinc-500 uppercase">Bientôt</span>
        </button>
        <button disabled className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg border border-white/10 cursor-not-allowed">
          <MoveVertical className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-[11px] text-zinc-400">Réorganiser sections</span>
          <span className="ml-auto text-[8px] tracking-wider text-zinc-500 uppercase">Bientôt</span>
        </button>
      </div>
    </div>
  );
}