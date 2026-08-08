import React from "react";
import { ArrowRight, Landmark, AlertCircle, Calendar, CheckCircle2 } from "lucide-react";

const ICONS = {
  actualisation_ft: Calendar,
  relance: AlertCircle,
  guso: Landmark,
  calm: CheckCircle2,
};

const TONE_CLASSES = {
  blue:    { ring: "ring-blue-100", icon: "bg-blue-500 text-white" },
  red:     { ring: "ring-red-100", icon: "bg-red-500 text-white" },
  amber:   { ring: "ring-amber-100", icon: "bg-amber-500 text-white" },
  neutral: { ring: "ring-zinc-200", icon: "bg-zinc-500 text-white" },
};

export default function ActionOfDay({ action }) {
  if (!action) return null;
  const Icon = ICONS[action.kind] || Landmark;
  const tone = TONE_CLASSES[action.tone] || TONE_CLASSES.neutral;

  return (
    <div className={`bg-white rounded-3xl p-6 md:p-8 ring-1 ${tone.ring} shadow-[0_1px_3px_rgba(0,0,0,0.04)]`}>
      <div className="flex items-start gap-5">
        <div className={`w-12 h-12 rounded-2xl ${tone.icon} flex items-center justify-center shrink-0`}>
          <Icon className="w-6 h-6" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-[11px] tracking-[0.18em] text-zinc-500 font-medium uppercase">
            Action du jour
          </div>
          <h3 className="text-zinc-900 font-semibold text-xl md:text-2xl mt-1 tracking-tight">
            {action.title}
          </h3>
          <p className="text-zinc-600 text-sm mt-1.5 leading-relaxed">
            {action.subtitle}
          </p>

          {action.cta && (
            <button
              onClick={action.onClick}
              className="mt-5 inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors"
            >
              {action.cta}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}