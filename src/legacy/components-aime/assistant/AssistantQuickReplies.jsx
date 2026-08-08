import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle } from "lucide-react";

/**
 * Relances conversationnelles affichées juste sous la matrix.
 * Style proche des "hints" de l'écran d'accueil pour rester cohérent et
 * cliquable au pouce — l'utilisateur peut répondre sans rien taper.
 */
export default function AssistantQuickReplies({ actions, onAsk }) {
  if (!actions || actions.length === 0) return null;

  return (
    <div className="space-y-1.5 mb-2">
      <div className="text-[10px] tracking-[0.22em] text-zinc-500 font-semibold uppercase px-1">
        Réponses rapides
      </div>
      {actions.slice(0, 4).map((a, idx) => {
        const isLink = a.type === "link";
        const baseClass =
          "w-full text-left text-sm px-3 py-2.5 rounded-xl bg-zinc-900 border border-white/5 text-zinc-200 hover:text-white shadow-[7px_7px_14px_rgba(10,13,15,0.55),-5px_-5px_12px_rgba(70,78,82,0.14)] hover:shadow-[inset_5px_5px_10px_rgba(10,13,15,0.55),inset_-4px_-4px_9px_rgba(70,78,82,0.12)] transition-all flex items-center justify-between gap-2 group";

        if (isLink && a.href) {
          return (
            <Link key={idx} to={a.href} className={baseClass}>
              <span className="flex-1 flex items-center gap-2">
                <ArrowRight className="w-3 h-3 text-zinc-500 shrink-0" />
                {a.label}
              </span>
              <ArrowRight className="w-3 h-3 text-zinc-600 group-hover:text-aime-red shrink-0 transition-colors" />
            </Link>
          );
        }

        return (
          <button
            key={idx}
            type="button"
            onClick={() => onAsk && onAsk(a.label)}
            className={baseClass}
          >
            <span className="flex-1 flex items-center gap-2">
              <MessageCircle className="w-3 h-3 text-aime-red shrink-0" />
              {a.label}
            </span>
            <ArrowRight className="w-3 h-3 text-zinc-600 group-hover:text-aime-red shrink-0 transition-colors" />
          </button>
        );
      })}
    </div>
  );
}