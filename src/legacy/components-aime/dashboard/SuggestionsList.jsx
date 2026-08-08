import React from "react";
import { CheckCircle2, Ticket, BookOpen, Briefcase, RefreshCw, Wand2 } from "lucide-react";

const ICONS = {
  ok: CheckCircle2,
  cachets: Ticket,
  formation: BookOpen,
  heures: Briefcase,
  rattrapage: RefreshCw,
};

export default function SuggestionsList({ suggestions = [] }) {
  if (!suggestions.length) return null;

  return (
    <div className="bg-white rounded-3xl ring-1 ring-zinc-100 p-6 md:p-8">
      <h3 className="text-[11px] tracking-[0.25em] text-zinc-500 font-semibold uppercase mb-1">Et si…</h3>
      <p className="text-[13px] text-zinc-900 font-medium tracking-tight mb-5">
        Scénarios pour atteindre vos 507h
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {suggestions.map((s, i) => {
          const Icon = ICONS[s.kind] || Wand2;
          const isOk = s.kind === "ok";
          return (
            <div
              key={i}
              className={`rounded-2xl p-4 border ${
                isOk ? "bg-emerald-50 border-emerald-200" : "bg-zinc-50 border-zinc-100"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isOk ? "bg-emerald-500 text-white" : "bg-aime-red text-white"
                }`}>
                  <Icon className="w-4 h-4" />
                </span>
                { }
                <div className="flex-1 min-w-0">
                  <div className={`text-[13px] font-semibold tracking-tight ${isOk ? "text-emerald-900" : "text-zinc-900"}`}>
                    {s.title}
                  </div>
                  <div className="text-[11.5px] text-zinc-600 mt-1 leading-relaxed">{s.detail}</div>
                  {s.impact ? (
                    <div className="mt-2 inline-flex items-center gap-1 text-[10px] text-zinc-500 tracking-wider uppercase">
                      Impact : <strong className="text-zinc-900">+{Math.round(s.impact)}h</strong>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}