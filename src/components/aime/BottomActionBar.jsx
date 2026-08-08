import React from "react";
import { MessageCircleMore } from "lucide-react";
import { useLocation } from "react-router-dom";
import AssistantSidePanel from "@/components/aime/assistant/AssistantSidePanel";
import { useAssistant } from "@/components/aime/assistant/AssistantProvider";

export default function BottomActionBar() {
  const { pathname } = useLocation();
  const { open, openAssistant, closeAssistant } = useAssistant();

  if (pathname !== "/prestations") return null;

  return (
    <>
      {!open && (
        <div className="fixed left-1/2 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-[60] -translate-x-1/2">
          <button
            type="button"
            onClick={openAssistant}
            aria-label="Ouvrir l'assistant AIME 507"
            title="Assistant AIME 507"
            className="group inline-flex items-center gap-3 rounded-full border border-white/10 bg-zinc-950/95 px-4 py-3 text-white shadow-[0_20px_50px_-24px_rgba(0,0,0,0.85)] backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-white/20"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black text-white">
              <span className="flex items-center gap-0.5 font-display text-[15px] font-black tracking-tight leading-none">
                <span>5</span>
                <span className="text-aime-red">♥</span>
                <span>7</span>
              </span>
            </span>
            <span className="hidden sm:flex flex-col items-start text-left">
              <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-aime-red">Assistant</span>
              <span className="text-sm font-medium text-white/95">Parler à AIME 507</span>
            </span>
            <MessageCircleMore className="h-4 w-4 text-white/65 sm:hidden" />
          </button>
        </div>
      )}

      <AssistantSidePanel open={open} onClose={closeAssistant} />
    </>
  );
}
