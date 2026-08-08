import React from "react";
import { Plus, FolderOpen } from "lucide-react";
import { SMART_WALLETS } from "@/lib/wallets";
import WalletIcon from "@/components/aime/wallets/WalletIcon";

function WalletRow({ active, icon, color, name, count, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${
        active ? "bg-zinc-900 text-white" : "text-zinc-700 hover:bg-zinc-100"
      }`}
    >
      <span
        className={`w-7 h-7 flex items-center justify-center shrink-0 ${
          active ? "text-white" : "text-zinc-500"
        }`}
      >
        <WalletIcon name={icon} className="w-4 h-4" />
      </span>
      <span className="flex-1 min-w-0 text-[13px] font-medium truncate">{name}</span>
      <span className={`text-[10px] ${active ? "text-white/60" : "text-zinc-400"}`}>{count}</span>
    </button>
  );
}

export default function WalletSidebar({
  prestations,
  wallets,
  selectedSmart,
  selectedWallet,
  onSelectSmart,
  onSelectWallet,
  onCreateWallet,
}) {
  const countSmart = (smart) => prestations.filter(smart.match).length;
  const countWallet = (id) => prestations.filter((p) => p.wallet_id === id).length;

  return (
    <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-[5rem] self-start space-y-4 lg:space-y-6 overflow-x-auto lg:overflow-visible pb-1">
      {/* Smart wallets */}
      <div>
        <div className="flex items-center gap-2 px-3 mb-2">
          <span className="text-[10px] tracking-[0.18em] font-semibold uppercase text-zinc-500">
            Rangement intelligent
          </span>
        </div>
        <div className="space-y-0.5">
          {SMART_WALLETS.map((sw) => (
            <WalletRow
              key={sw.id}
              active={selectedSmart === sw.id}
              icon={sw.icon}
              color={sw.color}
              name={sw.name}
              count={countSmart(sw)}
              onClick={() => onSelectSmart(sw.id)}
            />
          ))}
        </div>
      </div>

      {/* Wallets perso */}
      <div>
        <div className="flex items-center justify-between px-3 mb-2">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-3 h-3 text-zinc-500" />
            <span className="text-[10px] tracking-[0.18em] font-semibold uppercase text-zinc-500">
              Mes wallets
            </span>
          </div>
          <button
            onClick={onCreateWallet}
            aria-label="Nouveau wallet"
            className="w-5 h-5 rounded-full bg-zinc-100 hover:bg-aime-red hover:text-white text-zinc-600 flex items-center justify-center transition-colors"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
        <div className="space-y-0.5">
          {wallets.length === 0 ? (
            <div className="px-3 py-3 text-[11px] text-zinc-400 italic">
              Aucun wallet personnel. Créez-en un pour ranger vos fiches.
            </div>
          ) : (
            wallets.map((w) => (
              <WalletRow
                key={w.id}
                active={selectedWallet === w.id}
                icon={w.icon || "Folder"}
                color={w.color || "#71717a"}
                name={w.name}
                count={countWallet(w.id)}
                onClick={() => onSelectWallet(w.id)}
              />
            ))
          )}
        </div>
      </div>
    </aside>
  );
}