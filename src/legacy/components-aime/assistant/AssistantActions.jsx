import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle } from "lucide-react";

/**
 * Boutons d'actions proposés par l'assistant.
 * Mode hybride :
 *  - type === "ask" (défaut) → relance la conversation (appelle onAsk(label))
 *  - type === "link" → navigation interne (<Link to={href}>)
 */
export default function AssistantActions({ actions, onAsk }) {
  if (!actions || actions.length === 0) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {actions.map((a, idx) => {
        const isLink = a.type === "link";
        const baseClass =
          "inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-[#252b2e] border border-white/5 text-zinc-200 hover:text-white shadow-[5px_5px_10px_rgba(10,13,15,0.5),-4px_-4px_8px_rgba(72,80,84,0.12)] hover:shadow-[inset_4px_4px_8px_rgba(10,13,15,0.52),inset_-3px_-3px_7px_rgba(72,80,84,0.1)] transition-all";

        if (isLink) {
          return (
            <Link key={idx} to={a.href} className={baseClass}>
              <span>{a.label}</span>
              <ArrowRight className="w-3 h-3 text-zinc-500" />
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
            <MessageCircle className="w-3 h-3 text-aime-red" />
            <span>{a.label}</span>
          </button>
        );
      })}
    </div>
  );
}