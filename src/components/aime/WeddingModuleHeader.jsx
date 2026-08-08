import React from "react";
import { Link } from "react-router-dom";
import { UNIVERSE_GRADIENTS } from "@/lib/aimeUniverses";

function HeaderStat({ label, value, detail }) {
  return (
    <div className="rounded-[22px] border border-black/8 bg-[var(--color-warm-white)] p-4">
      <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">{label}</div>
      <div className="mt-3 text-[1.5rem] md:text-[1.7rem] leading-none font-display text-zinc-950">{value}</div>
      {detail && <div className="mt-2 text-sm text-zinc-600 leading-relaxed">{detail}</div>}
    </div>
  );
}

export default function WeddingModuleHeader({
  universeId,
  eyebrow,
  title,
  description,
  stats = [],
  actions = [],
}) {
  const gradient = UNIVERSE_GRADIENTS[universeId] || "linear-gradient(135deg,#121212 0%,#2f2f2f 100%)";

  return (
    <section className="rounded-[34px] border border-black/8 bg-white shadow-[0_18px_48px_rgba(12,12,12,0.06)] overflow-hidden">
      <div className="p-5 md:p-6 lg:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-end">
          <div className="max-w-3xl">
            <div
              className="inline-flex rounded-full px-4 py-2 text-[12px] font-semibold italic text-white shadow-[0_12px_24px_rgba(0,0,0,0.12)]"
              style={{ background: gradient }}
            >
              {eyebrow}
            </div>
            <h1 className="mt-5 font-display text-[2.1rem] md:text-[2.7rem] lg:text-[3.15rem] leading-[0.96] text-zinc-950">
              {title}
            </h1>
            {description && (
              <p className="mt-4 max-w-2xl text-sm md:text-[15px] leading-relaxed text-zinc-600">
                {description}
              </p>
            )}
            {actions.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2.5">
                {actions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={`${action.to}-${action.label}`}
                      to={action.to}
                      className={index === 0
                        ? "rounded-full bg-black px-5 py-3 text-sm text-white hover:bg-zinc-800 inline-flex items-center gap-2"
                        : "rounded-full border border-black/8 bg-white px-5 py-3 text-sm text-zinc-700 hover:bg-black/[0.03] inline-flex items-center gap-2"
                      }
                    >
                      {Icon && <Icon className="h-4 w-4" />}
                      {action.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {stats.length > 0 && (
            <div className={`grid gap-3 self-end ${stats.length >= 4 ? "sm:grid-cols-2" : stats.length === 3 ? "sm:grid-cols-3" : stats.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-1"}`}>
              {stats.map((item) => (
                <HeaderStat key={item.label} {...item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
