import React, { useMemo, useState } from "react";
import { Camera, Cloud, Mic, Pencil, Stamp } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import VoiceCapsule from "@/components/aime/VoiceCapsule";
import SnapCapture from "@/components/aime/SnapCapture";
import AssistantSidePanel from "@/components/aime/assistant/AssistantSidePanel";
import { useAssistant } from "@/components/aime/assistant/AssistantProvider";

export default function BottomActionBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { open, openAssistant, closeAssistant } = useAssistant();
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [snapOpen, setSnapOpen] = useState(false);

  const isFichePage = pathname.startsWith("/fiche/");
  const isVerifyPage = pathname.startsWith("/verify/");

  const sideActions = useMemo(
    () => [
      {
        key: "voice",
        label: "Audio",
        icon: Mic,
        onClick: () => setVoiceOpen(true),
      },
      {
        key: "cloud",
        label: "Cloud",
        icon: Cloud,
        onClick: () => runFicheAction({
          isFichePage,
          eventName: "aime:dock-cloud",
          fallback: () => toast("Cloud AIME", { description: "Ouvrez une fiche pour enregistrer ce brouillon dans le Cloud AIME." }),
        }),
      },
      {
        key: "edit",
        label: "Modifier",
        icon: Pencil,
        onClick: () => runFicheAction({
          isFichePage,
          eventName: "aime:dock-edit",
          fallback: () => toast("Modifier", { description: "Ouvrez une fiche pour retrouver le studio et l'édition du document." }),
        }),
      },
      {
        key: "stamp",
        label: "Tampon",
        icon: Stamp,
        onClick: () => runFicheAction({
          isFichePage,
          eventName: "aime:dock-stamp",
          fallback: () => toast("Tampon", { description: "Le tampon s'utilise depuis une fiche ouverte." }),
        }),
      },
      {
        key: "snap",
        label: "Photo",
        icon: Camera,
        onClick: () => setSnapOpen(true),
      },
    ],
    [isFichePage]
  );

  if (isVerifyPage) return null;

  return (
    <>
      <div className="fixed left-1/2 -translate-x-1/2 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-[55] lg:left-[calc(50%+32px)]">
        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-zinc-950/95 px-2 py-1.5 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.85)] backdrop-blur-xl">
          <DockButton {...sideActions[0]} />
          <DockButton {...sideActions[1]} />
          <DockButton {...sideActions[2]} />

          <AssistantButton open={open} onClick={open ? closeAssistant : openAssistant} />

          <DockButton {...sideActions[3]} />
          <DockButton {...sideActions[4]} />
        </div>
      </div>

      <VoiceCapsule open={voiceOpen} onClose={() => setVoiceOpen(false)} />
      <SnapCapture open={snapOpen} onClose={() => setSnapOpen(false)} />
      <AssistantSidePanel open={open} onClose={closeAssistant} onCreate={() => navigate("/prestations?new=1")} />
    </>
  );
}

function runFicheAction({ isFichePage, eventName, fallback }) {
  if (isFichePage) {
    window.dispatchEvent(new CustomEvent(eventName));
    return;
  }
  fallback?.();
}

function DockButton({ onClick, icon: Icon, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="group relative flex h-10 w-10 items-center justify-center rounded-full text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
    >
      <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
      <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-full bg-black px-2 py-1 text-[10px] font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 whitespace-nowrap">
        {label}
      </span>
    </button>
  );
}

function AssistantButton({ onClick, open }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Agent IA 507"
      title="Agent IA 507"
      className={`mx-1 flex h-12 w-12 items-center justify-center rounded-full border transition-all ${
        open
          ? "border-aime-red bg-aime-red text-white shadow-[0_0_20px_-6px_rgba(230,0,18,0.8)]"
          : "border-white/10 bg-white/[0.05] text-white hover:border-white/25 hover:bg-white/[0.1]"
      }`}
    >
      <span className="flex items-center justify-center gap-0.5 font-display text-[15px] font-black tracking-tight leading-none">
        <span>5</span>
        <span className="text-aime-red animate-[aimeBeat_1.1s_ease-in-out_infinite]">♥</span>
        <span>7</span>
      </span>
      <style>{`@keyframes aimeBeat { 0%, 100% { transform: scale(1); } 18% { transform: scale(1.25); } 34% { transform: scale(0.96); } 52% { transform: scale(1.14); } 70% { transform: scale(1); } }`}</style>
    </button>
  );
}
