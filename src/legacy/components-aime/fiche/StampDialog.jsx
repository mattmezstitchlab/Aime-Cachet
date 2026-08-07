import React, { useState } from "react";
import { X } from "lucide-react";

const COLORS = [
  { name: "Rouge", value: "#c0392b" },
  { name: "Bleu", value: "#1e40af" },
  { name: "Noir", value: "#1a1a1a" },
  { name: "Violet", value: "#6b21a8" },
];

const PRESETS = ["PRÉPARÉ", "BROUILLON", "À VÉRIFIER", "RELU"];

export default function StampDialog({ open, onClose, onApply, defaultMain = "PRÉPARÉ" }) {
  const [main, setMain] = useState(defaultMain);
  const [top, setTop] = useState("AIME · CACHET");
  const [color, setColor] = useState(COLORS[0].value);

  if (!open) return null;

  const apply = () => {
    onApply({ mainText: main.toUpperCase(), topText: top.toUpperCase(), color });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-aime-black-soft border border-white/10 rounded-xl p-6 w-[420px] max-w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-medium">Personnaliser le tampon</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-zinc-400 mb-1.5 block">Texte principal</label>
            <input
              value={main}
              onChange={(e) => setMain(e.target.value)}
              maxLength={12}
              className="w-full bg-aime-black border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:border-aime-red outline-none"
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {PRESETS.map((p) => (
                <button
                  key={p}
                  onClick={() => setMain(p)}
                  className={`text-[10px] px-2 py-1 rounded-full border transition-colors ${
                    main === p ? "bg-aime-red border-aime-red text-white" : "border-white/10 text-zinc-400 hover:text-white"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-zinc-400 mb-1.5 block">Texte du haut</label>
            <input
              value={top}
              onChange={(e) => setTop(e.target.value)}
              maxLength={24}
              className="w-full bg-aime-black border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:border-aime-red outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-zinc-400 mb-2 block">Couleur d'encre</label>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setColor(c.value)}
                  className={`w-9 h-9 rounded-full border-2 transition-all ${color === c.value ? "border-white scale-110" : "border-white/20"}`}
                  style={{ backgroundColor: c.value }}
                  aria-label={c.name}
                />
              ))}
            </div>
          </div>

          <div className="text-[11px] text-zinc-500 leading-relaxed pt-1">
            Le tampon sera apposé horodaté et accompagné du Code Cachet unique. Tampon privé sans valeur officielle.
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 text-sm text-zinc-300 hover:text-white border border-white/10 rounded-full transition-colors">
            Annuler
          </button>
          <button onClick={apply} className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-aime-red hover:bg-red-700 rounded-full transition-colors">
            Tamponner
          </button>
        </div>
      </div>
    </div>
  );
}