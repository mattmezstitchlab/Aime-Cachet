import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

/**
 * Carte d'action proactive — sans encadré ni picto, présentation épurée.
 * L'assistante propose une action concrète, l'utilisateur clique → on l'amène
 * directement à l'endroit où l'action sera réalisée à sa place.
 */
export default function ProactiveActionCard({ action, onAfterClick }) {
  const navigate = useNavigate();
  if (!action) return null;

  const handleClick = () => {
    if (onAfterClick) onAfterClick();
    if (action.target) navigate(action.target);
  };

  return (
    <div className="px-1 py-2">
      <div className="text-[10px] tracking-[0.2em] text-zinc-500 font-semibold uppercase mb-1.5">
        Je peux le faire pour toi
      </div>
      <div className="text-sm text-zinc-100 font-medium leading-snug">{action.title}</div>
      {action.subtitle && (
        <div className="text-xs text-zinc-400 mt-1 leading-relaxed">{action.subtitle}</div>
      )}
      <button
        onClick={handleClick}
        className="mt-2.5 inline-flex items-center gap-2 bg-aime-red hover:bg-aime-red/90 text-white text-xs font-medium px-3.5 py-2 rounded-full transition-colors"
      >
        {action.cta || "Je m'en occupe"}
        <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
}