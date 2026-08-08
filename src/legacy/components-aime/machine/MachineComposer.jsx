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
    <div className={`shrink-0 sticky bottom-0 z-20 bg-zinc-900 border-t border-black/25 shadow-[0_-10px_24px_rgba(10,12,14,0.35)] ${compact ? "px-2.5 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))]" : "px-3 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]"}`}>
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
        className="flex items-center gap-2 bg-zinc-900 border border-white/5 rounded-full p-1 shadow-[inset_7px_7px_14px_rgba(10,13,15,0.6),inset_-5px_-5px_12px_rgba(72,80,84,0.14)]"
      >
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Posez une question à la machine AIME…"
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
          className={`${compact ? "w-7 h-7" : "w-8 h-8"} rounded-full bg-[#252b2e] text-zinc-300 hover:text-white flex items-center justify-center disabled:opacity-40 transition-all shrink-0 shadow-[5px_5px_10px_rgba(10,13,15,0.55),-4px_-4px_8px_rgba(70,78,82,0.14)] hover:shadow-[inset_4px_4px_8px_rgba(10,13,15,0.55),inset_-3px_-3px_7px_rgba(70,78,82,0.12)]`}
        >
          <Mic className="w-3.5 h-3.5" />
        </button>
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className={`${compact ? "w-7 h-7" : "w-8 h-8"} rounded-full bg-[#252b2e] text-aime-red hover:text-white flex items-center justify-center disabled:opacity-40 transition-all shrink-0 shadow-[5px_5px_10px_rgba(10,13,15,0.55),-4px_-4px_8px_rgba(72,80,84,0.14)] hover:shadow-[inset_4px_4px_8px_rgba(10,13,15,0.55),inset_-3px_-3px_7px_rgba(72,80,84,0.12)]`}
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