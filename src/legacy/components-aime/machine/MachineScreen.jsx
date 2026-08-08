import React, { useMemo } from "react";
import { Eraser } from "lucide-react";
import AssistantMessageDark from "@/components/aime/assistant/AssistantMessageDark";
import MachineMosaicWelcome from "@/components/aime/machine/MachineMosaicWelcome";
import MachineMatrixScreen from "@/components/aime/machine/MachineMatrixScreen";
import MachineStatBar from "@/components/aime/machine/MachineStatBar";
import AssistantExtrasDark from "@/components/aime/assistant/AssistantExtrasDark";
import MachineEmployerTicker from "@/components/aime/machine/MachineEmployerTicker";
import { detectProactiveActions } from "@/lib/proactiveActions";

/**
 * Écran principal de la machine — affiche conversation OU suggestions.
 */
export default function MachineScreen({
  messages,
  loading,
  hints,
  onAskSuggestion,
  onClear,
  endRef,
  compact = false,
  welcomeText,
  action = null,
  simulator,
  counters,
  user,
  prestations = [],
  onClose,
}) {
  const empty = messages.length === 0 && !loading;

  const proactiveActions = useMemo(
    () => detectProactiveActions({ prestations, simulator, counters }),
    [prestations, simulator, counters]
  );

  return (
    <div className="relative flex-1 min-h-0 overflow-hidden bg-zinc-900 -mt-px">
      {/* Reflet doux neumorphique */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-x-8 -top-10 h-28 rounded-full bg-[#30373a]/18 blur-3xl" />
      </div>
      {/* Reflet diagonal */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(120deg, rgba(255,255,255,0.04) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.02) 100%)",
        }}
      />

      <div
        className={`relative h-full min-h-0 overflow-y-auto overscroll-contain aime-hide-scrollbar ${compact ? "px-3 py-3" : "px-4 md:px-5 py-4"}`}
      >
        <style>{`
          .aime-hide-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
          .aime-hide-scrollbar::-webkit-scrollbar { width: 0; height: 0; display: none; }
        `}</style>
        {empty && (
          <div className="space-y-3">
            {/* Bloc heures AU-DESSUS de la console : c'est le repere principal
                entre l'assistante et l'intermittent. */}
            <MachineStatBar
              simulator={simulator}
              counters={counters}
              user={user}
              prestations={prestations}
            />

            {/* Console matrix : message d'accueil proactif, sinon mosaique cockpit. */}
            {welcomeText ? (
              <MachineMatrixScreen text={welcomeText} loading={false} />
            ) : (
              <MachineMosaicWelcome
                simulator={simulator}
                counters={counters}
                user={user}
                prestations={prestations}
                rows={10}
                cols={16}
              />
            )}

            <div className="text-[9px] tracking-wide text-zinc-600 leading-relaxed px-1 pt-2 border-t border-black/20 mt-3">
              Aide indicative · validation officielle externe.
            </div>

            {/* Ticker de notes employeurs / organismes — repère rassurant */}
            <MachineEmployerTicker />
          </div>
        )}

        {!empty && messages.length > 0 && onClear && (
          <div className="flex justify-end mb-2">
            <button
              onClick={onClear}
              className="inline-flex items-center gap-1.5 text-[10px] tracking-wider text-zinc-500 hover:text-aime-red transition-colors px-2 py-1 rounded"
              title="Effacer la conversation"
            >
              <Eraser className="w-3 h-3" />
              Effacer
            </button>
          </div>
        )}

        <div className="space-y-3">
          {(() => {
            // Index du dernier message assistant (peu importe payload ou pas)
            let matrixIdx = -1;
            for (let i = messages.length - 1; i >= 0; i--) {
              if (messages[i].role !== "user") {
                matrixIdx = i;
                break;
              }
            }
            return messages.map((m, idx) => {
              if (idx === matrixIdx && !loading) {
                const matrixText = m.payload?.answer || m.content || "";
                return (
                  <div key={idx} className="space-y-2">
                    <MachineMatrixScreen text={matrixText} loading={false} />
                    <AssistantExtrasDark payload={m.payload} onAsk={onAskSuggestion} />
                  </div>
                );
              }
              return (
                <AssistantMessageDark
                  key={idx}
                  role={m.role}
                  content={m.content}
                  payload={m.payload}
                  time={m.time}
                  onAsk={onAskSuggestion}
                />
              );
            });
          })()}

          {loading && (
            <MachineMatrixScreen text="" loading={true} />
          )}

          <div ref={endRef} />
        </div>
      </div>
    </div>
  );
}