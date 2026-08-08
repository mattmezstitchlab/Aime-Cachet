import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { DOC_CATEGORIES, findDoc } from "@/lib/docCatalog";

export default function DocPicker({ currentDoc, onSelect, embedded = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const current = findDoc(currentDoc) || findDoc("cachet");
  const Icon = current?.icon;

  const wrapperClass = embedded
    ? "relative"
    : "fixed top-4 left-1/2 -translate-x-1/2 z-30";

  return (
    <div className={wrapperClass} ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-xl border border-zinc-200 rounded-full pl-2.5 pr-3 py-2 shadow-sm hover:shadow-md transition-all h-9"
      >
        <span className="w-5 h-5 rounded-full bg-aime-red/10 text-aime-red flex items-center justify-center">
          {Icon && <Icon className="w-3 h-3" />}
        </span>
        <span className="text-[12px] font-medium text-zinc-900">{current?.label || "Document"}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-[min(360px,calc(100vw-2rem))] max-h-[70vh] overflow-y-auto bg-white border border-zinc-200 rounded-2xl shadow-2xl z-50">
          <div className="px-4 py-3 border-b border-zinc-100">
            <div className="text-[10px] tracking-[0.2em] text-zinc-500 font-semibold uppercase">Bibliothèque AIME</div>
            <div className="text-[11px] text-zinc-600 mt-0.5">Tous les documents administratifs français du spectacle</div>
          </div>

          <div className="p-2">
            {DOC_CATEGORIES.map((cat) => (
              <div key={cat.id} className="mb-3 last:mb-0">
                <div className="px-2.5 py-1.5 flex items-center gap-2">
                  {cat.icon && <cat.icon className="w-3.5 h-3.5 text-zinc-900" strokeWidth={2.4} />}
                  <span className="text-[12px] tracking-tight text-zinc-900 font-bold">{cat.label}</span>
                </div>
                <div className="space-y-0.5">
                  {cat.docs.map((doc) => {
                    const DocIcon = doc.icon;
                    const isActive = currentDoc === doc.id;
                    const disabled = !doc.ready;
                    return (
                      <button
                        key={doc.id}
                        onClick={() => {
                          if (disabled) return;
                          onSelect(doc.id);
                          setOpen(false);
                        }}
                        disabled={disabled}
                        className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-left transition-colors ${
                          isActive ? "bg-aime-red text-white" : disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-zinc-50"
                        }`}
                      >
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isActive ? "bg-white/20" : "bg-zinc-100"
                        }`}>
                          <DocIcon className={`w-4 h-4 ${isActive ? "text-white" : "text-zinc-700"}`} />
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className={`block text-[13px] font-medium leading-tight ${isActive ? "text-white" : "text-zinc-900"}`}>
                            {doc.label}
                          </span>
                          <span className={`block text-[11px] leading-tight mt-0.5 truncate ${isActive ? "text-white/80" : "text-zinc-500"}`}>
                            {doc.description}
                          </span>
                        </span>
                        {!doc.ready && !isActive && (
                          <span className="text-[9px] tracking-wider text-zinc-400 uppercase font-semibold">Bientôt</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="px-3 py-3 border-t border-zinc-100 bg-zinc-50/50">
            <button className="w-full flex items-center gap-2 text-[12px] text-zinc-600 hover:text-zinc-900 transition-colors">
              <Plus className="w-3.5 h-3.5" />
              Demander un nouveau document
            </button>
          </div>
        </div>
      )}
    </div>
  );
}