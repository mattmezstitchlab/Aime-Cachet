import React from "react";
import { DOC_TEMPLATES } from "@/lib/docTemplates";

export default function DocSwitcher({ currentDoc, onSelect }) {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-30">
      <div className="inline-flex items-center gap-1 bg-white border border-zinc-200 rounded-full p-1.5 shadow-lg">
        {DOC_TEMPLATES.map((tpl) => {
          const isActive = currentDoc === tpl.id;
          return (
            <button
              key={tpl.id}
              onClick={() => onSelect(tpl.id)}
              aria-label={tpl.label}
              className={`group relative w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                isActive ? "bg-aime-red text-white" : "text-zinc-700 hover:bg-zinc-100"
              }`}
            >
              <tpl.icon className="w-4 h-4" />
              <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900 text-white text-[10px] font-medium px-2 py-1 rounded whitespace-nowrap pointer-events-none">
                {tpl.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}