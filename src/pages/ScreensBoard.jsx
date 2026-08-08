import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, LayoutGrid, Sparkles } from "lucide-react";
import { ALL_SCREEN_SHOTS, SCREEN_SECTIONS } from "@/components/landing/landingShots";

export default function ScreensBoard() {
  return (
    <div className="min-h-screen bg-[#F6F4F1] text-zinc-900">
      <header className="sticky top-0 z-40 border-b border-black/5 bg-[#F6F4F1]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-18 min-h-[72px] flex items-center justify-between gap-4">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity">
              <span className="font-display font-black text-2xl tracking-tight">
                AIME<span className="text-aime-red">®</span>
              </span>
              <span className="text-[10px] tracking-[0.28em] text-zinc-500 font-semibold uppercase">
                Board écrans
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Landing
            </Link>
            <Link
              to="/app"
              className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-black transition-colors"
            >
              Ouvrir l'app
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-5 md:px-8 py-10 md:py-14">
        <section className="mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-aime-red/15 bg-aime-red/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-aime-red">
            <Sparkles className="w-3.5 h-3.5" />
            Audit visuel
          </div>

          <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
            <div>
              <h1 className="font-display text-4xl md:text-6xl font-black tracking-tight leading-[1.02]">
                Tous les écrans,
                <br />
                comme un mini Figma.
              </h1>
              <p className="mt-4 max-w-2xl text-base md:text-lg leading-relaxed text-zinc-600">
                Cette page sert de board commun pour revoir rapidement les vues existantes,
                repérer les doublons et décider quoi garder avant le grand ménage.
              </p>
            </div>

            <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
              <div className="text-[11px] uppercase tracking-[0.24em] text-zinc-500 font-semibold">
                Snapshot actuel
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Metric label="Sections" value={String(SCREEN_SECTIONS.length)} />
                <Metric label="Écrans" value={String(ALL_SCREEN_SHOTS.length)} />
              </div>
              <p className="mt-4 text-sm leading-relaxed text-zinc-600">
                Base idéale pour arbitrer la landing, recentrer les univers et préparer un audit fonctionnel plus large.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8 flex flex-wrap gap-2">
          {SCREEN_SECTIONS.map((section) => (
            <a
              key={section.key}
              href={`#${section.key}`}
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:border-zinc-300 hover:text-zinc-900 transition-colors"
            >
              <LayoutGrid className="w-4 h-4 text-aime-red" />
              {section.label}
            </a>
          ))}
        </section>

        <section className="space-y-10">
          {SCREEN_SECTIONS.map((section) => (
            <article
              key={section.key}
              id={section.key}
              className="scroll-mt-28 rounded-[28px] border border-black/5 bg-white p-5 md:p-7 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.25)]"
            >
              <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.24em] text-aime-red font-semibold">
                    {section.key}
                  </div>
                  <h2 className="mt-2 font-display text-2xl md:text-3xl font-black tracking-tight">
                    {section.label}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm md:text-base text-zinc-600 leading-relaxed">
                    {section.description}
                  </p>
                </div>
                <div className="text-sm text-zinc-500">
                  {section.shots.length} écran{section.shots.length > 1 ? "s" : ""}
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {section.shots.map((shot) => (
                  <ScreenCard
                    key={`${section.key}-${shot.url}`}
                    label={shot.label}
                    sectionLabel={section.label}
                    url={shot.url}
                  />
                ))}
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-2xl bg-zinc-50 p-4">
      <div className="font-display text-3xl font-black tracking-tight">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-500 font-semibold">
        {label}
      </div>
    </div>
  );
}

function ScreenCard({ label, sectionLabel, url }) {
  return (
    <figure className="group overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-50">
      <div className="flex items-center gap-1.5 border-b border-zinc-200 bg-white px-3 py-2">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
        <span className="ml-3 truncate text-[10px] tracking-wider text-zinc-400">aime.app / {sectionLabel}</span>
      </div>

      <div className="relative aspect-[16/10] overflow-hidden bg-white">
        <img
          src={url}
          alt={label}
          className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
          loading="lazy"
        />
      </div>

      <figcaption className="space-y-2 bg-white p-4">
        <div className="text-[11px] uppercase tracking-[0.22em] text-zinc-500 font-semibold">
          {sectionLabel}
        </div>
        <div className="text-sm font-medium leading-relaxed text-zinc-900">{label}</div>
      </figcaption>
    </figure>
  );
}
