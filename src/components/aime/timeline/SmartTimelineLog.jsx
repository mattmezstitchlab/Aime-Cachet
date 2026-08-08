import React from "react";
import { formatRelative } from "@/lib/aimeData";
import { iconForEvent, TONES } from "@/lib/timelineIcons";

export default function SmartTimelineLog({ event, selected = false, onSelect }) {
  if (!event) return null;
  const { Icon, tone } = iconForEvent(event.kind);
  const t = TONES[tone] || TONES.neutral;

  return (
    <li className="relative pl-20 sm:pl-24 py-1.5">
      <div className={`absolute left-[64px] sm:left-[72px] top-2 w-6 h-6 rounded-full ${t.bg} ${t.text} ring-4 ring-white flex items-center justify-center`}>
        <Icon className="w-3 h-3" />
      </div>
      <button
        type="button"
        onClick={() => onSelect?.(event)}
        className={`w-full rounded-xl px-2 py-1.5 text-left transition-colors ${selected ? "bg-zinc-100" : "hover:bg-zinc-50"}`}
      >
        <div className="flex items-baseline gap-2 pl-2">
          <span className="text-[13px] text-zinc-600">{event.text}</span>
          <span className="text-[10px] text-zinc-400">{formatRelative(event.created_date)}</span>
        </div>
      </button>
    </li>
  );
}
