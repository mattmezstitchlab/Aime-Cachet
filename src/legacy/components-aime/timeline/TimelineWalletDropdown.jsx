import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { SMART_WALLETS } from "@/lib/wallets";
import WalletIcon from "@/components/aime/wallets/WalletIcon";

// Menu déroulant compact des filtres wallets pour la timeline.
export default function TimelineWalletDropdown({
  wallets = [],
  prestations = [],
  activeKey = "smart:all",
  onChange,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const counts = React.useMemo(() => {
    const c = {};
    for (const sw of SMART_WALLETS) c[sw.id] = prestations.filter(sw.match).length;
    for (const w of wallets) c[w.id] = prestations.filter((p) => p.wallet_id === w.id).length;
    return c;
  }, [wallets, prestations]);

  const chips = [
    ...SMART_WALLETS.map((w) => ({ key: w.id, name: w.name, icon: w.icon })),
    ...wallets.map((w) => ({ key: w.id, name: w.name, icon: w.icon || "Folder" })),
  ];

  const current = chips.find((c) => c.key === activeKey) || chips[0];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 bg-white border border-zinc-200 hover:border-zinc-400 rounded-full pl-2.5 pr-3 py-1.5 text-[12px] font-medium text-zinc-700 transition-colors"
      >
        <span className="w-5 h-5 flex items-center justify-center text-zinc-500">
          <WalletIcon name={current?.icon} size={13} />
        </span>
        <span className="truncate max-w-[140px]">{current?.name || "Filtre"}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 max-h-[60vh] overflow-y-auto bg-white border border-zinc-200 rounded-2xl shadow-2xl z-40 p-1">
          {chips.map((chip) => {
            const active = activeKey === chip.key;
            const n = counts[chip.key] || 0;
            return (
              <button
                key={chip.key}
                onClick={() => { onChange?.(chip.key); setOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors ${
                  active ? "bg-zinc-900 text-white" : "hover:bg-zinc-50 text-zinc-700"
                }`}
              >
                <span className={`w-6 h-6 flex items-center justify-center ${active ? "text-white" : "text-zinc-500"}`}>
                  <WalletIcon name={chip.icon} size={14} />
                </span>
                <span className="flex-1 text-[13px] font-medium truncate">{chip.name}</span>
                {n > 0 && (
                  <span className={`text-[10px] font-semibold tabular-nums ${active ? "text-white/70" : "text-zinc-400"}`}>
                    {n}
                  </span>
                )}
                {active && <Check className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}