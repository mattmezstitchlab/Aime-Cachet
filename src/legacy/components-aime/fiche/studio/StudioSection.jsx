import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function StudioSection({ icon, title, subtitle, defaultOpen = false, children, accent = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-white/5 last:border-b-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors text-left"
      >
        <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
          accent ? "bg-aime-red/15 text-aime-red" : "bg-white/5 text-zinc-300"
        }`}>
          {icon}
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-[12px] font-semibold text-white leading-tight">{title}</span>
          {subtitle && <span className="block text-[10px] text-zinc-500 mt-0.5">{subtitle}</span>}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 transition-transform shrink-0 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-4 pb-4 pt-1">{children}</div>}
    </div>
  );
}