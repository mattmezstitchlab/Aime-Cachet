import React, { useState } from "react";
import { Send, Loader2, Mic } from "lucide-react";
import { Link } from "react-router-dom";
import VoiceCapsule from "@/components/aime/VoiceCapsule";

/**
 * Champ de saisie console + raccourcis.
 */
export default function MachineComposer({
  value,
  onChange,
  onSubmit,
  loading,
  inputRef,
  showShortcuts = true,
  compact = false,
}) {
  const [voiceOpen, setVoiceOpen] = useState(false);

  return (
    <div className={`shrink-0 sticky bottom-0 z-20 bg-[#101114] border-t border-white/6 ${compact ? "px-2.5 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))]" : "px-3 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]"}`}>
      {showShortcuts && !compact && (
        <div className="flex gap-1.5 mb-2 px-1">
          <Shortcut to="/507">507h</Shortcut>
          <Shortcut to="/prestations">Fiches</Shortcut>
          <Shortcut to="/notifications">Rappels</Shortcut>
        </div>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="flex items-center gap-2 rounded-[24px] border border-white/8 bg-black/30 p-1.5"
      >
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Écrivez à AIME 507…"
          disabled={loading}
          className={`flex-1 min-w-0 bg-transparent border-0 outline-none text-white placeholder:text-zinc-500 ${
            compact ? "px-3 py-1.5 text-sm" : "px-4 py-2 text-sm"
          }`}
        />
        <button
          type="button"
          onClick={() => setVoiceOpen(true)}
          disabled={loading}
          title="Capsule vocale : créer une fiche en parlant"
          aria-label="Capsule vocale"
          className={`${compact ? "w-8 h-8" : "w-9 h-9"} rounded-full border border-white/8 bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08] hover:text-white flex items-center justify-center disabled:opacity-40 transition-colors shrink-0`}
        >
          <Mic className="w-3.5 h-3.5" />
        </button>
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className={`${compact ? "w-8 h-8" : "w-9 h-9"} rounded-full bg-aime-red text-white hover:bg-aime-red/90 flex items-center justify-center disabled:opacity-40 transition-colors shrink-0`}
          aria-label="Envoyer"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
        </button>
      </form>

      <VoiceCapsule open={voiceOpen} onClose={() => setVoiceOpen(false)} />
    </div>
  );
}

function Shortcut({ to, children }) {
  return (
    <Link
      to={to}
      className="text-[10px] tracking-wider font-semibold text-zinc-400 hover:text-aime-red bg-[#252b2e] border border-white/5 px-2 py-1 rounded-lg shadow-[4px_4px_8px_rgba(10,13,15,0.5),-3px_-3px_7px_rgba(70,78,82,0.12)] hover:shadow-[inset_3px_3px_7px_rgba(10,13,15,0.5),inset_-3px_-3px_6px_rgba(70,78,82,0.1)] transition-all"
    >
      {children}
    </Link>
  );
}