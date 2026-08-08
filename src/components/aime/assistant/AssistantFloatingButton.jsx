import React from "react";
import { useNavigate } from "react-router-dom";
import AssistantSidePanel from "@/components/aime/assistant/AssistantSidePanel";
import { useAssistant } from "@/components/aime/assistant/AssistantProvider";

export default function AssistantFloatingButton() {
  const navigate = useNavigate();
  const { open, openAssistant, closeAssistant } = useAssistant();

  return (
    <>
      {!open && (
        <div className="fixed right-3 md:right-5 bottom-[calc(0.9rem+env(safe-area-inset-bottom))] z-[60]">
          <button
            type="button"
            onClick={openAssistant}
            aria-label="Ouvrir l'agent IA 507"
            title="Agent IA 507"
            className="group inline-flex items-center gap-3 rounded-full bg-zinc-950/96 px-3 py-3 text-white shadow-[0_18px_40px_-18px_rgba(0,0,0,0.8)] ring-1 ring-white/10 backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:ring-white/20"
          >
            <span className="relative flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <span className="absolute inset-0 rounded-full bg-aime-red/10 blur-md transition-opacity group-hover:opacity-100" />
              <span className="relative flex items-center gap-0.5 font-display text-[16px] font-black tracking-tight">
                <span>5</span>
                <span className="text-aime-red animate-[aimeAssistantBeat_1.2s_ease-in-out_infinite]">♥</span>
                <span>7</span>
              </span>
            </span>

            <span className="hidden sm:flex flex-col items-start pr-1 text-left">
              <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-aime-red">
                Agent IA
              </span>
              <span className="text-sm font-medium text-white/95">Parler à AIME 507</span>
            </span>
          </button>
        </div>
      )}

      <AssistantSidePanel
        open={open}
        onClose={closeAssistant}
        onCreate={() => navigate("/prestations?new=1")}
      />

      <style>{`@keyframes aimeAssistantBeat { 0%, 100% { transform: scale(1); } 20% { transform: scale(1.18); } 36% { transform: scale(0.96); } 54% { transform: scale(1.1); } 72% { transform: scale(1); } }`}</style>
    </>
  );
}
