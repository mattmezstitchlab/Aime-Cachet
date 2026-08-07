import React from "react";
import ExplainTip from "./ExplainTip";

// Anneau SVG : visualise la PRA et son allongement éventuel
export default function PraRing({ data }) {
  const { praDays, nhRequired, totalHours, percent, extensions } = {
    praDays: data.period.days,
    nhRequired: data.nhRequired,
    totalHours: data.totalHours,
    percent: data.percent,
    extensions: data.extensions,
  };

  // Anneau extérieur : extension visuelle (grossit si étendu)
  const size = 200;
  const stroke = 14;
  const r = size / 2 - stroke;
  const c = 2 * Math.PI * r;
  const dash = (Math.min(100, percent) / 100) * c;

  return (
    <div className="bg-white rounded-3xl ring-1 ring-zinc-100 p-6 flex flex-col items-center">
      <div className="flex items-center gap-2 mb-1 self-start">
        <h3 className="text-[11px] tracking-[0.25em] text-zinc-500 font-semibold uppercase">PRA dynamique</h3>
        <ExplainTip title="Anneau PRA">
          L'anneau représente votre période de référence et votre progression. S'il s'élargit, c'est que la PRA a été allongée automatiquement par France Travail pour vous laisser plus de temps.
        </ExplainTip>
      </div>

      <div className="relative my-4" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Bague d'extension */}
          {extensions > 0 && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r + 8}
              stroke="hsl(var(--aime-red))"
              strokeOpacity="0.15"
              strokeWidth="4"
              fill="none"
              strokeDasharray="4 6"
            />
          )}
          {/* Fond */}
          <circle cx={size / 2} cy={size / 2} r={r} stroke="#f4f4f5" strokeWidth={stroke} fill="none" />
          {/* Progression */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={percent >= 100 ? "#10b981" : "hsl(var(--aime-red))"}
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={`${dash} ${c}`}
            strokeLinecap="round"
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-4xl text-zinc-900 tabular-nums leading-none">{percent}%</span>
          <span className="text-[10px] text-zinc-500 mt-1 tracking-wider uppercase">{Math.round(totalHours)} / {nhRequired}h</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 w-full text-center mt-2">
        <Mini label="Jours" value={praDays} />
        <Mini label="Paliers" value={extensions} />
      </div>
    </div>
  );
}

function Mini({ label, value }) {
  return (
    <div className="bg-zinc-50 rounded-xl py-2">
      <div className="font-display text-lg text-zinc-900 tabular-nums leading-none">{value}</div>
      <div className="text-[9px] text-zinc-500 tracking-wider uppercase mt-1">{label}</div>
    </div>
  );
}