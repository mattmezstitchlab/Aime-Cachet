import React from "react";
import { Eraser } from "lucide-react";
import AssistantMessageDark from "@/components/aime/assistant/AssistantMessageDark";
import MachineMosaicWelcome from "@/components/aime/machine/MachineMosaicWelcome";
import MachineMatrixScreen from "@/components/aime/machine/MachineMatrixScreen";
import MachineStatBar from "@/components/aime/machine/MachineStatBar";
import AssistantExtrasDark from "@/components/aime/assistant/AssistantExtrasDark";
import MachineEmployerTicker from "@/components/aime/machine/MachineEmployerTicker";

/**
 * Écran principal de la machine.
 *
 * - En mode compact : vraie conversation, plus lisible, sans mosaïque rouge.
 * - En mode full : on conserve pour l'instant la mise en scène "machine".
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
}) {
  const empty = messages.length === 0 && !loading;

  return (
    <div className={`relative flex-1 min-h-0 overflow-hidden ${compact ? "bg-[#121316]" : "bg-zinc-900 -mt-px"}`}>
      {!compact && (
        <>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-x-8 -top-10 h-28 rounded-full bg-[#30373a]/18 blur-3xl" />
          </div>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(120deg, rgba(255,255,255,0.04) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.02) 100%)",
            }}
          />
        </>
      )}

      <div className={`relative h-full min-h-0 overflow-y-auto overscroll-contain aime-hide-scrollbar ${compact ? "px-3 py-3" : "px-4 md:px-5 py-4"}`}>
        <style>{`
          .aime-hide-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
          .aime-hide-scrollbar::-webkit-scrollbar { width: 0; height: 0; display: none; }
        `}</style>

        {empty && compact && (
          <div className="space-y-3">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-aime-red">Agent IA 507</div>
              <h3 className="mt-2 font-display text-xl tracking-tight text-white">Une vraie discussion, centrée sur vos cachets.</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                {welcomeText || "Je peux vous aider à retrouver une fiche, comprendre votre progression 507, repérer les éléments à compléter ou préparer une nouvelle prestation."}
              </p>
            </div>

            <MachineStatBar simulator={simulator} counters={counters} user={user} prestations={prestations} />

            {action && (
              <button
                type="button"
                onClick={() => action.question && onAskSuggestion?.(action.question)}
                className="w-full rounded-2xl border border-aime-red/20 bg-aime-red/10 px-4 py-3 text-left transition-colors hover:bg-aime-red/15"
              >
                <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-aime-red">Priorité du moment</div>
                <div className="mt-1 text-sm font-medium text-white">{action.title || action.label}</div>
                {action.subtitle && <div className="mt-1 text-xs leading-relaxed text-zinc-300">{action.subtitle}</div>}
              </button>
            )}

            {!!hints?.length && (
              <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">Questions utiles</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {hints.slice(0, 4).map((hint) => (
                    <button
                      key={hint}
                      type="button"
                      onClick={() => onAskSuggestion?.(hint)}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-zinc-200 transition-colors hover:border-aime-red/25 hover:text-white"
                    >
                      {hint}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {empty && !compact && (
          <div className="space-y-3">
            <MachineStatBar simulator={simulator} counters={counters} user={user} prestations={prestations} />

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
          {compact
            ? messages.map((message, index) => (
                <AssistantMessageDark
                  key={index}
                  role={message.role}
                  content={message.content}
                  payload={message.payload}
                  time={message.time}
                  onAsk={onAskSuggestion}
                />
              ))
            : (() => {
                let matrixIdx = -1;
                for (let i = messages.length - 1; i >= 0; i--) {
                  if (messages[i].role !== "user") {
                    matrixIdx = i;
                    break;
                  }
                }
                return messages.map((message, index) => {
                  if (index === matrixIdx && !loading) {
                    const matrixText = message.payload?.answer || message.content || "";
                    return (
                      <div key={index} className="space-y-2">
                        <MachineMatrixScreen text={matrixText} loading={false} />
                        <AssistantExtrasDark payload={message.payload} onAsk={onAskSuggestion} />
                      </div>
                    );
                  }

                  return (
                    <AssistantMessageDark
                      key={index}
                      role={message.role}
                      content={message.content}
                      payload={message.payload}
                      time={message.time}
                      onAsk={onAskSuggestion}
                    />
                  );
                });
              })()}

          {loading && (
            compact ? (
              <AssistantMessageDark role="assistant" content="AIME 507 prépare sa réponse…" />
            ) : (
              <MachineMatrixScreen text="" loading={true} />
            )
          )}

          <div ref={endRef} />
        </div>
      </div>
    </div>
  );
}
