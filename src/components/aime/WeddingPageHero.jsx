import React from "react";

function HeroStat({ label, value, hint }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/[0.05] p-4 backdrop-blur-xl">
      <div className="aime-label text-white/42">{label}</div>
      <div className="text-[30px] md:text-[36px] font-display mt-2.5 text-white">{value}</div>
      {hint && <p className="text-xs text-white/56 mt-2 leading-relaxed">{hint}</p>}
    </div>
  );
}

export default function WeddingPageHero({
  eyebrow,
  title,
  description,
  image,
  stats = [],
  tags = [],
  actions = null,
}) {
  return (
    <section className="relative overflow-hidden rounded-[38px] bg-[var(--color-black)] text-white shadow-[0_22px_70px_rgba(0,0,0,0.16)]">
      {image && (
        <img
          src={image}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.16),rgba(0,0,0,0.78))]" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_24%)]" aria-hidden="true" />

      <div className="relative z-10 grid lg:grid-cols-[1.02fr_0.98fr] gap-6 lg:gap-8 items-end min-h-[360px] md:min-h-[390px] lg:min-h-[400px] px-5 py-5 md:px-8 md:py-8 lg:px-10 lg:py-10">
        <div className="max-w-4xl">
          {eyebrow && <div className="aime-kicker mb-5">{eyebrow}</div>}
          <h1 className="font-display text-[2.6rem] sm:text-[4rem] lg:text-[5.6rem] leading-[0.92] tracking-[var(--tracking-display)] text-white">
            {title}
          </h1>
          {description && (
            <p className="mt-5 max-w-2xl text-[15px] md:text-[17px] text-white/68 leading-[var(--leading-body)]">
              {description}
            </p>
          )}

          {tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2.5">
              {tags.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-1.5 text-[13px] text-white/84"
                >
                  {item}
                </span>
              ))}
            </div>
          )}

          {actions && <div className="mt-7 flex flex-wrap gap-2.5">{actions}</div>}
        </div>

        {stats.length > 0 && (
          <div className={`grid gap-4 self-end ${stats.length >= 4 ? "sm:grid-cols-2" : stats.length === 3 ? "sm:grid-cols-3" : stats.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-1"}`}>
            {stats.map((item) => (
              <HeroStat key={item.label} {...item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
