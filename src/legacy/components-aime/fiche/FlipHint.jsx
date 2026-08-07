import React from "react";
import { RotateCw } from "lucide-react";

export default function FlipHint({ flipped, onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-6 z-30 group inline-flex items-center gap-2 bg-zinc-900 hover:bg-aime-red text-white text-xs font-medium px-4 py-2.5 rounded-full shadow-2xl transition-colors"
      aria-label={flipped ? "Voir le recto" : "Voir le verso"}
    >
      <RotateCw className={`w-3.5 h-3.5 transition-transform ${flipped ? "rotate-180" : ""}`} />
      <span>{flipped ? "Voir le recto" : "Voir le verso"}</span>
    </button>
  );
}