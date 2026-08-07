import React from "react";
import { X, Check } from "lucide-react";
import { FICHE_BACKGROUNDS } from "@/lib/docTemplates";

export default function EditMenu({ open, onClose, theme, onThemeChange, background, onBackgroundChange, textEditable, onTextEditableChange }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-aime-black-soft border border-white/10 rounded-t-2xl md:rounded-2xl p-6 w-full md:w-[560px] max-w-[92vw] max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-medium">Modifier la fiche</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Édition de texte */}
        <div className="mb-6">
          <label className="text-[10px] uppercase tracking-wider text-zinc-400 mb-2 block">Édition du texte</label>
          <button
            onClick={() => onTextEditableChange(!textEditable)}
            className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
              textEditable ? "bg-aime-red/10 border-aime-red" : "bg-white/5 border-white/10"
            }`}
          >
            <span className="text-sm text-white">
              {textEditable ? "Édition activée — cliquez sur le texte" : "Activer l'édition du texte"}
            </span>
            <div className={`w-9 h-5 rounded-full p-0.5 transition-all ${textEditable ? "bg-aime-red" : "bg-white/20"}`}>
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${textEditable ? "translate-x-4" : ""}`} />
            </div>
          </button>
        </div>

        {/* Thème de la fiche */}
        <div className="mb-6">
          <label className="text-[10px] uppercase tracking-wider text-zinc-400 mb-2 block">Thème de la fiche</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "light", label: "Clair", preview: "bg-white text-zinc-900" },
              { id: "dark", label: "Sombre", preview: "bg-zinc-900 text-white" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => onThemeChange(t.id)}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  theme === t.id ? "border-aime-red" : "border-white/10 hover:border-white/20"
                }`}
              >
                <div className={`w-10 h-12 rounded ${t.preview} border border-white/10`} />
                <span className="text-sm text-white font-medium">{t.label}</span>
                {theme === t.id && <Check className="w-4 h-4 text-aime-red ml-auto" />}
              </button>
            ))}
          </div>
        </div>

        {/* Fond d'écran */}
        <div>
          <label className="text-[10px] uppercase tracking-wider text-zinc-400 mb-2 block">Fond d'écran</label>
          <div className="grid grid-cols-3 gap-2">
            {FICHE_BACKGROUNDS.map((bg) => (
              <button
                key={bg.id}
                onClick={() => onBackgroundChange(bg.id)}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  background === bg.id ? "border-aime-red scale-95" : "border-white/10 hover:border-white/30"
                }`}
                style={
                  bg.url
                    ? { backgroundImage: `url(${bg.url})`, backgroundSize: "cover", backgroundPosition: "center" }
                    : { background: bg.gradient }
                }
              >
                {background === bg.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-1.5">
                  <div className="text-[9px] text-white font-medium leading-tight">{bg.label}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}