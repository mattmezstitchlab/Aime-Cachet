import React from "react";
import { formatRelative } from "@/lib/aimeData";

export default function TimelineLogItem({ event }) {
  if (!event) return null;
  const accent = event.accent === "red" ? "text-aime-red" : "text-zinc-400";

  return (
    <li className="relative pl-5 py-1.5">
      <span className={`absolute left-0 top-3 w-1 h-1 rounded-full ${event.accent === "red" ? "bg-aime-red" : "bg-zinc-600"}`} aria-hidden />
      <div className="flex items-baseline gap-2">
        <span className={`text-xs ${accent}`}>{event.text}</span>
        <span className="text-[10px] text-zinc-600">{formatRelative(event.created_date)}</span>
      </div>
    </li>
  );
}