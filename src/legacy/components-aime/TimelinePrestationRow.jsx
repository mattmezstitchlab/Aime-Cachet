import React from "react";
import { formatDayLabel, STATUS_META } from "@/lib/aimeData";
import { ArrowRight, AlertCircle } from "lucide-react";

export default function TimelinePrestationRow({ prestation, logs = [], onPrepare, isPast }) {
  const meta = STATUS_META?.[prestation.status] || { label: prestation.status, dot: "bg-zinc-500" };
  const day = formatDayLabel(prestation.date);

  return (
    <li className="relative pl-[88px] sm:pl-[96px] py-4 group">
      <div className="absolute left-0 top-5 w-16 sm:w-[72px] text-right pr-3">
        <div className="text-xs text-zinc-300 font-medium leading-tight">{day.day}</div>
        <div className="text-[10px] text-zinc-500 uppercase tracking-wider">{day.month}</div>
      </div>

      <div className="absolute left-[68px] sm:left-[76px] top-6 w-2 h-2 rounded-full bg-aime-red ring-4 ring-aime-black" aria-hidden />

      <button
        onClick={() => onPrepare?.(prestation)}
        className="w-full text-left bg-aime-black-soft hover:bg-white/5 border border-white/5 rounded-md px-4 py-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aime-red"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-sm text-white font-medium truncate">{prestation.employer || "Sans employeur"}</div>
            <div className="text-xs text-zinc-500 truncate mt-0.5">
              {prestation.production || "—"}{prestation.location ? ` · ${prestation.location}` : ""}
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {prestation.missing_documents > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] text-aime-red">
                <AlertCircle className="w-3 h-3" />
                {prestation.missing_documents}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 text-[10px] text-zinc-400">
              <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
              {meta.label}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>
      </button>
    </li>
  );
}