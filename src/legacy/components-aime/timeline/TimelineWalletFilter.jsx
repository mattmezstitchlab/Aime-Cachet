import React from "react";
import { SMART_WALLETS } from "@/lib/wallets";
import WalletIcon from "@/components/aime/wallets/WalletIcon";

// Chip horizontal scrollable des wallets (smart + perso) pour filtrer la timeline.
export default function TimelineWalletFilter({ wallets = [], prestations = [], activeKey = "smart:all", onChange }) {
  const counts = React.useMemo(() => {
    const c = {};
    for (const sw of SMART_WALLETS) c[sw.id] = prestations.filter(sw.match).length;
    for (const w of wallets) c[w.id] = prestations.filter((p) => p.wallet_id === w.id).length;
    return c;
  }, [wallets, prestations]);

  const chips = [
    ...SMART_WALLETS.map((w) => ({ key: w.id, name: w.name, icon: w.icon, color: w.color, smart: true })),
    ...wallets.map((w) => ({ key: w.id, name: w.name, icon: w.icon || "Folder", color: w.color || "#71717a", smart: false })),
  ];

  return (
    <div className="-mx-5 md:-mx-8 mb-6 px-5 md:px-8 overflow-x-auto scrollbar-none">
      <div className="flex items-center gap-1.5 min-w-max">
        {chips.map((chip) => {
          const active = activeKey === chip.key;
          const n = counts[chip.key] || 0;
          return (
            <button
              key={chip.key}
              onClick={() => onChange?.(chip.key)}
              className={`group inline-flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full text-[12px] font-medium border transition-all ${
                active
                  ? "bg-zinc-900 text-white border-zinc-900"
                  : "bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400"
              }`}
            >
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: active ? "rgba(255,255,255,.15)" : `${chip.color}15`, color: active ? "#fff" : chip.color }}
              >
                <WalletIcon name={chip.icon} size={11} />
              </span>
              <span>{chip.name}</span>
              {n > 0 && (
                <span className={`text-[10px] font-semibold tabular-nums ${active ? "text-white/70" : "text-zinc-400"}`}>
                  {n}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}