// ============================================================================
// MachineCountdown — compte à rebours plein écran "3..2..1" affiché sur la
// mosaïque AVANT le premier message de l'assistant. Effet "lever de rideau"
// volontairement théâtral (spectacle vivant).
// ============================================================================

import React, { useEffect, useState } from "react";

const STEPS = ["3", "2", "1"];
const STEP_MS = 700; // durée d'affichage de chaque chiffre

export default function MachineCountdown({ onDone }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (idx >= STEPS.length) {
      const t = setTimeout(() => onDone?.(), 250);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setIdx((i) => i + 1), STEP_MS);
    return () => clearTimeout(t);
  }, [idx, onDone]);

  const current = STEPS[idx];

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-zinc-900 overflow-hidden">
      {/* Mosaïque de bruit rouge en arrière-plan */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,0,0,0.06) 0 2px, transparent 2px 6px), repeating-linear-gradient(90deg, rgba(255,255,255,0.02) 0 2px, transparent 2px 6px)",
        }}
        aria-hidden
      />
      {/* Halo rouge pulsant */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-64 bg-aime-red/10 blur-3xl" aria-hidden />

      {current && (
        <div
          key={current}
          className="relative font-display font-black text-aime-red leading-none select-none"
          style={{
            fontSize: "clamp(140px, 38vw, 280px)",
            textShadow: "0 0 80px rgba(255,0,0,0.55), 0 0 20px rgba(255,0,0,0.8)",
            animation: "aimeCountdownPop 700ms ease-out both",
          }}
        >
          {current}
        </div>
      )}

      <div className="absolute bottom-6 left-0 right-0 text-center text-[10px] tracking-[0.32em] text-zinc-500 font-semibold">
        AIME · CHARGEMENT
      </div>

      <style>{`
        @keyframes aimeCountdownPop {
          0%   { opacity: 0; transform: scale(0.4); filter: blur(20px); }
          40%  { opacity: 1; transform: scale(1.15); filter: blur(0); }
          70%  { transform: scale(1); }
          100% { opacity: 0.85; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}