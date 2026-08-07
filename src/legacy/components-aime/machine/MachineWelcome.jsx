import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { ArrowRight, Check } from "lucide-react";
import useTypewriter from "@/components/aime/machine/useTypewriter";

/**
 * Onboarding chaleureux — la machine pose les questions essentielles, lettre par lettre.
 * Sauvegarde dans User entity via base44.auth.updateMe() → source de vérité.
 * Non bloquant : "Plus tard" possible à chaque étape.
 */
const STEPS = [
  {
    key: "aime_metier",
    question: "Bienvenue. Pour personnaliser votre machine d'analyse, dites-moi : quel est votre métier principal ?",
    placeholder: "Comédien, musicien, régisseur lumière…",
    type: "text",
  },
  {
    key: "aime_annexe",
    question: "Sous quelle annexe êtes-vous principalement déclaré ?",
    type: "choice",
    options: [
      { value: "10", label: "Annexe 10 — Artiste" },
      { value: "8", label: "Annexe 8 — Technicien" },
    ],
  },
  {
    key: "aime_secteur",
    question: "Dans quel secteur travaillez-vous le plus ?",
    type: "choice",
    options: [
      { value: "spectacle_vivant", label: "Spectacle vivant" },
      { value: "audiovisuel", label: "Audiovisuel" },
      { value: "autre", label: "Autre" },
    ],
  },
];

export default function MachineWelcome({ user, onComplete, onSkip }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [input, setInput] = useState("");
  const [saving, setSaving] = useState(false);

  const step = STEPS[stepIdx];
  const { text, done } = useTypewriter(step?.question || "", 22, true);

  useEffect(() => {
    setInput("");
  }, [stepIdx]);

  const answer = async (val) => {
    if (!val) return;
    const next = { ...answers, [step.key]: val };
    setAnswers(next);

    if (stepIdx < STEPS.length - 1) {
      setStepIdx(stepIdx + 1);
    } else {
      setSaving(true);
      try {
        await base44.auth.updateMe({ ...next, aime_profile_completed: true });
      } catch (_) {}
      setSaving(false);
      onComplete?.(next);
    }
  };

  const handleSkip = async () => {
    try {
      await base44.auth.updateMe({ aime_profile_completed: true });
    } catch (_) {}
    onSkip?.();
  };

  const progress = ((stepIdx + (done ? 1 : 0.5)) / STEPS.length) * 100;

  return (
    <div className="relative h-full flex flex-col">
      {/* Barre de progression */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-zinc-900">
        <div
          className="h-full bg-aime-red transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 text-center">
        {/* Step counter */}
        <div className="text-[10px] tracking-[0.3em] text-zinc-500 font-semibold uppercase mb-6">
          Étape {stepIdx + 1} / {STEPS.length}
        </div>

        {/* Question typewriter */}
        <div className="max-w-xl text-lg md:text-xl text-zinc-100 leading-relaxed font-light min-h-[80px]">
          {text}
          {!done && <span className="inline-block w-[2px] h-5 bg-aime-red ml-1 animate-pulse" />}
        </div>

        {/* Réponse */}
        {done && (
          <div className="w-full max-w-md mt-8 animate-in fade-in duration-500">
            {step.type === "text" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  answer(input.trim());
                }}
                className="flex items-center gap-2 bg-black border border-zinc-700 rounded-full p-1.5"
              >
                <input
                  autoFocus
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={step.placeholder}
                  className="flex-1 bg-transparent border-0 outline-none px-3 py-2 text-sm text-white placeholder:text-zinc-500"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || saving}
                  className="w-8 h-8 rounded-full bg-aime-red hover:bg-red-600 text-white flex items-center justify-center disabled:opacity-40 transition-colors"
                  aria-label="Valider"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            {step.type === "choice" && (
              <div className="flex flex-col gap-2">
                {step.options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => answer(opt.value)}
                    disabled={saving}
                    className="group bg-black/40 hover:bg-black/70 border border-zinc-800 hover:border-aime-red/50 text-zinc-200 hover:text-white text-sm px-4 py-3 rounded-lg transition-all flex items-center justify-between"
                  >
                    <span>{opt.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-aime-red transition-colors" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Skip — toujours visible, non bloquant */}
        <button
          onClick={handleSkip}
          className="mt-10 text-[11px] tracking-wider text-zinc-500 hover:text-zinc-300 underline underline-offset-4 transition-colors"
        >
          Passer cette étape · je reste rapide
        </button>

        {saving && (
          <div className="mt-4 inline-flex items-center gap-2 text-[11px] text-aime-red">
            <Check className="w-3 h-3" /> Enregistrement…
          </div>
        )}
      </div>
    </div>
  );
}