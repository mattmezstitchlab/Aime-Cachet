import React from "react";
import { Link } from "react-router-dom";

const ITEMS = [
  { id: "budget", label: "Budget", to: "/univers/zeus/budget" },
  { id: "plan-table", label: "Plan de table", to: "/univers/hestia/plan-de-table" },
  { id: "invites", label: "Invités", to: "/invites?role=couple" },
  { id: "prestataires", label: "Prestataires", to: "/prestataires/registre" },
  { id: "rsvp", label: "RSVP", to: "/univers/hestia/rsvp?code=AIME-2027" },
];

function initials(value = "A") {
  return value
    .split(/\s|&/)
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase())
    .join("") || "A";
}

export default function WeddingToolTopBar({ active = "budget", names = "Charlotte & Alexandre" }) {
  return (
    <header className="rounded-[22px] border border-black/6 bg-white shadow-[0_12px_32px_rgba(12,12,12,0.04)] overflow-hidden">
      <div className="px-6 md:px-10 py-6 border-b border-black/8 flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-display text-[2rem] leading-none text-zinc-950">AIME</Link>
          <span className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Mariage</span>
        </div>

        <nav className="hidden md:flex items-center gap-10 text-[15px] text-zinc-800">
          {ITEMS.map((item) => (
            <Link key={item.id} to={item.to} className={`relative ${active === item.id ? "font-medium text-zinc-950" : "text-zinc-700"}`}>
              {item.label}
              {active === item.id && <span className="absolute left-1/2 -translate-x-1/2 -bottom-4 h-1.5 w-1.5 rounded-full bg-black" />}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <span className="hidden md:inline text-[15px] text-zinc-600">{names}</span>
          <div className="h-12 w-12 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold">
            {initials(names)}
          </div>
        </div>
      </div>
    </header>
  );
}
