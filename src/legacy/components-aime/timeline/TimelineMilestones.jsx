import React from "react";
import { Trophy } from "lucide-react";

// Affiche les jalons franchis (169h, 338h, 507h) en bandeau doré.
export default function TimelineMilestones({ milestones = [] }) {
  if (!milestones.length) return null;

  return (
    <div className="mb-6 space-y-2">
      {milestones.map((m, i) => (
        <div
          key={i}
          className="relative pl-20 sm:pl-24"
        >
          <div className="bg-gradient-to-r from-amber-50 via-amber-100 to-amber-50 ring-1 ring-amber-200 rounded-xl px-4 py-2.5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shrink-0">
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] uppercase tracking-[0.2em] text-amber-700 font-semibold">Jalon atteint</div>
              <div className="text-[13px] font-semibold text-amber-900">{m.label}</div>
            </div>
            <div className="text-[10px] text-amber-700 font-mono">{m.atDate}</div>
          </div>
        </div>
      ))}
    </div>
  );
}