import React, { useState } from "react";
import { X } from "lucide-react";
import { WALLET_COLORS, WALLET_ICONS } from "@/lib/wallets";
import WalletIcon from "@/components/aime/wallets/WalletIcon";

export default function WalletDialog({ open, onClose, onCreate }) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("Folder");
  const [color, setColor] = useState(WALLET_COLORS[3]);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!name.trim()) return;
    await onCreate({ name: name.trim(), icon, color });
    setName("");
    setIcon("Folder");
    setColor(WALLET_COLORS[3]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
          <h3 className="font-display text-lg text-zinc-900">Nouveau wallet</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-zinc-100 flex items-center justify-center text-zinc-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-5 space-y-5">
          {/* Nom */}
          <div>
            <label className="block text-[10px] tracking-[0.18em] font-semibold uppercase text-zinc-500 mb-2">
              Nom
            </label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Ex. Tournée Lyon 2026"
              className="w-full border border-zinc-200 focus:border-zinc-900 outline-none rounded-lg px-3 py-2.5 text-sm"
            />
          </div>

          {/* Icône */}
          <div>
            <label className="block text-[10px] tracking-[0.18em] font-semibold uppercase text-zinc-500 mb-2">
              Icône
            </label>
            <div className="grid grid-cols-8 gap-1.5">
              {WALLET_ICONS.map((i) => {
                const active = icon === i;
                return (
                  <button
                    key={i}
                    onClick={() => setIcon(i)}
                    className={`aspect-square rounded-lg flex items-center justify-center transition-all ${
                      active ? "bg-zinc-900 text-white scale-110" : "bg-zinc-50 hover:bg-zinc-100 text-zinc-700"
                    }`}
                  >
                    <WalletIcon name={i} className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Couleur */}
          <div>
            <label className="block text-[10px] tracking-[0.18em] font-semibold uppercase text-zinc-500 mb-2">
              Couleur
            </label>
            <div className="flex gap-2">
              {WALLET_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full transition-all ${color === c ? "ring-2 ring-zinc-900 ring-offset-2 scale-110" : ""}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Aperçu */}
          <div className="bg-zinc-50 rounded-lg p-3 flex items-center gap-3">
            <span
              className="w-9 h-9 rounded-md flex items-center justify-center"
              style={{ backgroundColor: `${color}20`, color }}
            >
              <WalletIcon name={icon} className="w-4 h-4" />
            </span>
            <span className="text-sm font-medium text-zinc-900">{name || "Nom du wallet"}</span>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-zinc-100 flex items-center justify-end gap-2 bg-zinc-50/50">
          <button onClick={onClose} className="text-sm text-zinc-500 hover:text-zinc-900 px-4 py-2 transition-colors">
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="bg-aime-red hover:bg-red-700 disabled:bg-zinc-300 text-white text-sm font-medium px-5 py-2 rounded-full transition-colors"
          >
            Créer
          </button>
        </div>
      </div>
    </div>
  );
}