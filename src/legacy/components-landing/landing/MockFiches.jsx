import React from "react";

const ITEMS = [
  { code: "AIME-CCH-2026000", title: "Festival Avignon", date: "12 mai", status: "VALIDÉ", color: "text-green-400", dot: "bg-green-400" },
  { code: "AIME-CCH-2026137", title: "Studio Paris 11", date: "08 mai", status: "À RESCELLER", color: "text-aime-red", dot: "bg-aime-red" },
  { code: "AIME-CCH-2026274", title: "Tournée Lyon", date: "03 mai", status: "EN COURS", color: "text-yellow-400", dot: "bg-yellow-400" },
  { code: "AIME-CCH-2026411", title: "Captation TV", date: "28 avril", status: "VALIDÉ", color: "text-green-400", dot: "bg-green-400" },
];

export default function MockFiches() {
  return (
    <div className="bg-black rounded-2xl p-5 md:p-6 grid grid-cols-2 gap-3 md:gap-4">
      {ITEMS.map((f) => (
        <div
          key={f.code}
          className="bg-white/[0.03] border border-white/10 rounded-xl p-3 md:p-4 flex flex-col gap-1.5 min-h-[120px]"
        >
          <div className="text-[10px] md:text-[11px] tracking-wider text-zinc-500">{f.code}</div>
          <div className="text-sm md:text-base text-white font-semibold leading-tight">{f.title}</div>
          <div className="text-[11px] md:text-xs text-zinc-400">{f.date}</div>
          <div className={`mt-auto flex items-center gap-1.5 text-[10px] md:text-[11px] font-semibold tracking-wider ${f.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${f.dot}`} />
            {f.status}
          </div>
        </div>
      ))}
    </div>
  );
}