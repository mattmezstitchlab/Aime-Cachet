import React, { useState } from "react";
import { Mic, Camera } from "lucide-react";
import VoiceCapsule from "@/components/aime/VoiceCapsule";
import SnapCapture from "@/components/aime/SnapCapture";
import AssistantSidePanel from "@/components/aime/assistant/AssistantSidePanel";

// Toolbar compacte flottante en bas : capsule vocale + bouton 5♥7 assistant + snap photo.
export default function BottomActionBar() {
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [snapOpen, setSnapOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);

  return (
    <>
      {/* Toolbar compacte */}
      <div className="fixed left-1/2 -translate-x-1/2 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-40 lg:left-[calc(50%+32px)]">
        <div className="bg-zinc-900 rounded-full p-1.5 shadow-2xl flex items-center gap-0.5 ring-1 ring-white/5">
          <SideBtn onClick={() => setVoiceOpen(true)} icon={Mic} label="Capsule" />
          <AssistantBtn onClick={() => setAssistantOpen(true)} />
          <SideBtn onClick={() => setSnapOpen(true)} icon={Camera} label="Snap" />
        </div>
      </div>

      <VoiceCapsule open={voiceOpen} onClose={() => setVoiceOpen(false)} />
      <SnapCapture open={snapOpen} onClose={() => setSnapOpen(false)} />
      <AssistantSidePanel open={assistantOpen} onClose={() => setAssistantOpen(false)} />
    </>
  );
}

function SideBtn({ onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
    >
      <Icon className="w-[18px] h-[18px]" strokeWidth={1.8} />
    </button>
  );
}

function AssistantBtn({ onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label="Ouvrir l'assistant AIME® 507"
      title="Assistant AIME® 507"
      className="w-11 h-11 rounded-full flex items-center justify-center ring-1 ring-white/10 hover:ring-white/30 bg-white/[0.04] hover:bg-white/[0.08] transition-all mx-0.5"
    >
      <span className="flex items-center justify-center gap-0.5 font-display font-black leading-none text-white text-[15px] tracking-tight">
        <span>5</span>
        <span className="text-aime-red text-[15px] animate-[aimeBeat_1.1s_ease-in-out_infinite]">♥</span>
        <span>7</span>
      </span>
      <style>{`@keyframes aimeBeat { 0%, 100% { transform: scale(1); } 18% { transform: scale(1.25); } 34% { transform: scale(0.96); } 52% { transform: scale(1.14); } 70% { transform: scale(1); } }`}</style>
    </button>
  );
}