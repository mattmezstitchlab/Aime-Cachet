import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

/**
 * Petit chevron flottant qui aide les nouveaux utilisateurs à découvrir la
 * timeline placée sous l'écran d'accueil. Disparaît dès que l'utilisateur
 * a scrollé (il a compris le geste) ou que la section #prestations est visible.
 *
 * Volontairement très simple : pas d'overlay opaque, pas de tooltip, juste un
 * indicateur doux animé en bas de page.
 */
export default function TimelineDiscoverChevron({ targetId = "prestations" }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      // Masque dès que l'utilisateur a scrollé d'un tiers d'écran
      if (window.scrollY > window.innerHeight * 0.3) setVisible(false);
      else setVisible(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    const el = document.getElementById(targetId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Découvrir ma timeline"
      className="fixed left-1/2 -translate-x-1/2 bottom-20 md:bottom-6 z-30 group flex flex-col items-center gap-1 px-3 py-2 rounded-full bg-white/90 backdrop-blur border border-zinc-200 shadow-lg hover:shadow-xl hover:border-aime-red transition-all animate-[timelineChevronBounce_2.2s_ease-in-out_infinite]"
    >
      <span className="text-[10px] font-semibold tracking-wider text-zinc-600 group-hover:text-aime-red transition-colors">
        MA TIMELINE
      </span>
      <ChevronDown className="w-4 h-4 text-aime-red" strokeWidth={2.5} />
      <style>{`
        @keyframes timelineChevronBounce {
          0%, 100% { transform: translate(-50%, 0); }
          50% { transform: translate(-50%, 6px); }
        }
      `}</style>
    </button>
  );
}