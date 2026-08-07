import React, { useState } from "react";
import { Plus, Minus, GraduationCap, RotateCcw, Wand2, X, Drama } from "lucide-react";
import LegalDisclaimer from "@/components/aime/LegalDisclaimer";

// Toolbar magique en bas — Mode "Et si…"
// Permet de simuler en live l'impact de cachets ou heures de formation supplémentaires
// sur le compteur 507h, l'AJ et la date anniversaire.
export default function SimulationBar({
  deltaCachets,
  deltaFormation,
  onChangeCachets,
  onChangeFormation,
  onReset,
}) {
  const [open, setOpen] = useState(false);
  const active = deltaCachets > 0 || deltaFormation > 0;
  const extraHours = deltaCachets * 12 + deltaFormation;

  return (
    <>
      {/* Backdrop quand ouvert */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sheet déployé */}
      {open && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-[calc(6rem+env(safe-area-inset-bottom))] z-50 w-[calc(100vw-24px)] max-w-md max-h-[calc(100dvh-8rem)] bg-white rounded-3xl shadow-2xl ring-1 ring-zinc-200 overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="p-5">
            <div className="flex items-start gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-aime-red text-white flex items-center justify-center shrink-0">
                <Wand2 className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="text-[10px] tracking-[0.2em] text-aime-red font-semibold uppercase">Et si…</div>
                <h3 className="text-zinc-900 font-semibold text-base mt-0.5 tracking-tight">Projetez votre futur</h3>
                <p className="text-zinc-500 text-[11.5px] mt-0.5 leading-relaxed">
                  Ajoutez des cachets ou des heures de formation virtuels — tous vos indicateurs se recalculent en live.
                </p>
              </div>
              <button onClick={() => setOpen(false)} className="text-zinc-400 hover:text-zinc-900">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Résumé — unique bloc, sans cadre rose */}
            <div className="flex items-center justify-between gap-4 py-2">
              <div>
                <div className="text-[10px] tracking-wider text-zinc-500 font-semibold uppercase">Impact total</div>
                <div className="font-display text-3xl text-aime-red tabular-nums leading-none mt-1">
                  +{Math.round(extraHours)}h
                </div>
                <div className="text-[10.5px] text-zinc-500 mt-1">
                  {deltaCachets} cachet{deltaCachets !== 1 ? "s" : ""} · {deltaFormation}h formation
                </div>
              </div>
              <button
                onClick={() => { onReset(); setOpen(false); }}
                disabled={!active}
                className="inline-flex items-center gap-1.5 text-[12px] text-zinc-700 hover:text-zinc-900 px-4 py-2 rounded-full border border-zinc-200 hover:border-zinc-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Réinitialiser
              </button>
            </div>

            <p className="text-[10px] text-zinc-400 mt-3 leading-relaxed text-center">
              Aucune donnée n'est enregistrée. Cette projection est purement indicative.
            </p>
            <div className="mt-3">
              <LegalDisclaimer variant="inline" />
            </div>
          </div>
        </div>
      )}

      {/* Toolbar compacte */}
      <div className="fixed left-1/2 -translate-x-1/2 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-40 lg:left-[calc(50%+32px)]">
        <div className={`rounded-full p-1.5 shadow-2xl flex items-center gap-0.5 ring-1 transition-all ${
          active ? "bg-aime-red ring-white/20" : "bg-zinc-900 ring-white/5"
        }`}>
          <QuickBtn
            icon={Drama}
            label="+1 cachet (12h)"
            onClick={() => onChangeCachets(deltaCachets + 1)}
            badge={deltaCachets > 0 ? deltaCachets : null}
          />

          <button
            onClick={() => setOpen(true)}
            className={`relative w-11 h-11 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-colors ${
              active ? "bg-white text-aime-red shadow-[0_0_20px_rgba(255,255,255,0.4)]" : "bg-aime-red text-white"
            }`}
            aria-label="Ouvrir les options Et si…"
          >
            <Wand2 className="w-4 h-4" strokeWidth={2.4} />
            {!active && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-white animate-ping" />
            )}
          </button>

          <QuickBtn
            icon={GraduationCap}
            label="+10h formation"
            onClick={() => onChangeFormation(deltaFormation + 10)}
            badge={deltaFormation > 0 ? `${deltaFormation}h` : null}
          />

          {active && (
            <button
              onClick={onReset}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white hover:bg-white/15 transition-colors ml-0.5"
              aria-label="Reset simulation"
              title="Réinitialiser"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </>
  );
}

function QuickBtn({ icon: Icon, label, onClick, badge }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="relative w-11 h-11 md:w-9 md:h-9 rounded-full flex items-center justify-center text-white hover:bg-white/15 transition-colors"
    >
      <Icon className="w-3.5 h-3.5" strokeWidth={2.2} />
      {badge !== null && badge !== undefined && (
        <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-white text-aime-red text-[9px] font-bold flex items-center justify-center">
          {badge}
        </span>
      )}
    </button>
  );
}

function Stepper({ icon: Icon, label, sub, value, step = 1, suffix = "", onMinus, onPlus }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-t border-zinc-100 first-of-type:border-t-0">
      <span className="w-8 h-8 rounded-xl bg-zinc-900 text-white flex items-center justify-center shrink-0">
        <Icon className="w-3.5 h-3.5" />
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-[12.5px] font-medium text-zinc-900 leading-tight">{label}</div>
        <div className="text-[10.5px] text-zinc-500 mt-0.5">{sub}</div>
      </div>
      <div className="flex items-center gap-1 bg-zinc-100 rounded-full p-0.5">
        <button
          onClick={onMinus}
          className="w-7 h-7 rounded-full bg-white hover:bg-zinc-50 flex items-center justify-center text-zinc-700 transition-colors disabled:opacity-30"
          disabled={value === 0}
        >
          <Minus className="w-3 h-3" />
        </button>
        <span className="min-w-[40px] text-center text-[13px] font-bold text-zinc-900 tabular-nums">{value}{suffix}</span>
        <button
          onClick={onPlus}
          className="w-7 h-7 rounded-full bg-aime-red hover:bg-aime-red/90 flex items-center justify-center text-white transition-colors"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}