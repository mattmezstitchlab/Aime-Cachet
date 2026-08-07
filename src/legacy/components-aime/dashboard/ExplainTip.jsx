import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Info, X } from "lucide-react";

// Petit "?" pédagogique. Cliquable → ouvre un popover en portail (jamais coupé).
export default function ExplainTip({ title, children, className = "" }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);

  useEffect(() => {
    if (!open || !btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    const popWidth = 288;
    const margin = 12;
    let left = r.right + 8;
    // si pas la place à droite, on bascule à gauche
    if (left + popWidth > window.innerWidth - margin) {
      left = Math.max(margin, r.left - popWidth - 8);
    }
    const top = Math.min(window.innerHeight - 180, r.top);
    setPos({ top, left });
  }, [open]);

  return (
    <>
      <span ref={btnRef} className={`inline-flex ${className}`}>
        <button
          onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
          aria-label={`Expliquer ${title}`}
          className="w-4 h-4 rounded-full bg-zinc-100 hover:bg-aime-red hover:text-white text-zinc-500 flex items-center justify-center transition-colors"
        >
          <Info className="w-2.5 h-2.5" />
        </button>
      </span>

      {open && createPortal(
        <>
          <div className="fixed inset-0 z-[100]" onClick={() => setOpen(false)} />
          <div
            className="fixed z-[101] w-72 bg-white border border-zinc-200 rounded-xl shadow-2xl p-3"
            style={{ top: pos.top, left: pos.left }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold tracking-tight text-zinc-900">{title}</span>
              <button onClick={() => setOpen(false)} className="text-zinc-400 hover:text-zinc-900">
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="text-[12px] text-zinc-600 leading-relaxed">{children}</div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}