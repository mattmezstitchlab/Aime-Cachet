import React from "react";
import { X } from "lucide-react";
import { DOC_TEMPLATES } from "@/lib/docTemplates";

export default function DocMenu({ open, onClose, currentDoc, onSelect }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-aime-black-soft border border-white/10 rounded-t-2xl md:rounded-2xl p-6 w-full md:w-[520px] max-w-[92vw] max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-medium">Choisir un document</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          {DOC_TEMPLATES.map((tpl) => {
            const isActive = currentDoc === tpl.id;
            return (
              <button
                key={tpl.id}
                onClick={() => { onSelect(tpl.id); onClose(); }}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                  isActive
                    ? "bg-aime-red/10 border-aime-red"
                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                }`}
              >
                <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${isActive ? "bg-aime-red" : "bg-white/10"}`}>
                  <tpl.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium text-sm">{tpl.label}</div>
                  <div className="text-xs text-zinc-400 mt-0.5">{tpl.description}</div>
                </div>
                {isActive && <div className="text-[10px] text-aime-red font-bold tracking-wider">EN COURS</div>}
              </button>
            );
          })}
        </div>

        <p className="mt-5 text-[10px] text-zinc-500 leading-relaxed">
          Tous les documents sont préparatoires et privés. Ils ne remplacent aucune obligation officielle.
        </p>
      </div>
    </div>
  );
}