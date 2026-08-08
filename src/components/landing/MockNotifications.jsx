import React from "react";

const ITEMS = [
  { c: "bg-aime-red", t: "Fiche AIME-CCH-2025-A3F à resceller", s: "Il y a 2 jours" },
  { c: "bg-yellow-400", t: "2 documents manquants — Festival Avignon", s: "Aujourd'hui" },
  { c: "bg-green-400", t: "Cap 80% des 507h franchie", s: "Hier" },
  { c: "bg-zinc-500", t: "PDF généré — Studio Paris 11", s: "Il y a 3 jours" },
];

export default function MockNotifications() {
  return (
    <div className="bg-black rounded-2xl p-5 md:p-6 flex flex-col gap-2.5 md:gap-3">
      <div className="text-[10px] md:text-[11px] tracking-[0.22em] text-zinc-500 font-semibold mb-1">
        NOTIFICATIONS
      </div>
      {ITEMS.map((n, i) => (
        <div
          key={i}
          className="flex items-start gap-3 bg-white/[0.03] border border-white/10 rounded-xl p-3 md:p-4"
        >
          <span className={`w-2 h-2 rounded-full ${n.c} mt-1.5 shrink-0`} />
          <div className="flex-1 min-w-0">
            <div className="text-sm text-white leading-tight">{n.t}</div>
            <div className="text-[11px] text-zinc-500 mt-1">{n.s}</div>
          </div>
        </div>
      ))}
    </div>
  );
}