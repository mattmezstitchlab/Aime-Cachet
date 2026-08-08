import React, { useState, useEffect, useRef } from "react";

/**
 * Vitrine "Runey-style" : titre + sous-titre + CTA en haut,
 * onglets cliquables (catégories), puis grand aperçu d'écran flottant.
 * Autoplay + clic onglet = changement d'écran.
 */
export default function RuneyShowcase({
  eyebrow,
  title,
  subtitle,
  cta,
  tabs = [], // [{ key, label, shots: [{url,label}] }]
  autoplayMs = 4000,
  sideExtra = null,
  transparent = false,
}) {
  const [tabIdx, setTabIdx] = useState(0);
  const [shotIdx, setShotIdx] = useState(0);
  const timer = useRef(null);
  const paused = useRef(false);

  const activeTab = tabs[tabIdx];
  const shots = activeTab?.shots || [];

  // Reset shot index quand on change d'onglet
  useEffect(() => {
    setShotIdx(0);
  }, [tabIdx]);

  // Autoplay : cycle les shots du tab actif
  useEffect(() => {
    if (!autoplayMs || shots.length === 0) return;
    timer.current = setInterval(() => {
      if (paused.current) return;
      setShotIdx((i) => {
        const next = i + 1;
        if (next >= shots.length) {
          // passage au tab suivant
          setTabIdx((t) => (t + 1) % tabs.length);
          return 0;
        }
        return next;
      });
    }, autoplayMs);
    return () => clearInterval(timer.current);
  }, [autoplayMs, shots.length, tabs.length]);

  if (!tabs.length) return null;

  return (
    <section className={`relative overflow-x-hidden ${transparent ? "" : "bg-white"}`}>
      {/* Halo décoratif "vagues" subtil */}
      {!transparent && (
        <div
          aria-hidden
          className="absolute inset-0 opacity-50 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(255,0,0,0.06), transparent 70%), radial-gradient(ellipse 60% 40% at 80% 30%, rgba(255,0,0,0.04), transparent 60%)",
          }}
        />
      )}

      <div className="relative max-w-6xl mx-auto px-5 md:px-8 pt-16 md:pt-24 pb-10">
        {/* Texte en haut + side extra (mini machine) */}
        <div className="grid md:grid-cols-[1fr_auto] gap-8 items-end mb-10">
          <div className="max-w-2xl">
            {eyebrow && (
              <div className={`text-[10px] tracking-[0.22em] ${transparent ? "text-aime-red" : "text-aime-red"} font-semibold mb-4`}>
                {eyebrow}
              </div>
            )}
            <h2 className={`font-display font-black text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mb-5 ${transparent ? "text-white drop-shadow-lg" : "text-zinc-900"}`}>
              {title}
            </h2>
            {subtitle && (
              <p className={`text-base md:text-lg leading-relaxed mb-6 ${transparent ? "text-white/90 drop-shadow" : "text-zinc-600"}`}>
                {subtitle}
              </p>
            )}
            {cta && <div className="flex flex-wrap gap-3">{cta}</div>}
          </div>
          {sideExtra && (
            <div className="hidden md:block shrink-0">{sideExtra}</div>
          )}
        </div>

        {/* Onglets catégories style Runey */}
        <div className={`border-b overflow-x-auto no-scrollbar ${transparent ? "border-white/30" : "border-zinc-200"}`}>
          <div className="flex items-end gap-6 md:gap-10 min-w-max pb-px">
            {tabs.map((t, i) => (
              <button
                key={t.key}
                onClick={() => setTabIdx(i)}
                className={`relative pb-3 text-sm md:text-[15px] transition-colors whitespace-nowrap ${
                  i === tabIdx
                    ? transparent ? "text-white font-semibold" : "text-zinc-900 font-semibold"
                    : transparent ? "text-white/70 hover:text-white" : "text-zinc-500 hover:text-zinc-700"
                }`}
              >
                {t.label}
                {i === tabIdx && (
                  <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-aime-red rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Aperçu écran flottant */}
        <div
          className="relative mt-8 md:mt-10"
          onMouseEnter={() => (paused.current = true)}
          onMouseLeave={() => (paused.current = false)}
        >
          <div className="relative mx-auto max-w-5xl rounded-2xl overflow-hidden ring-1 ring-zinc-200 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.25)] bg-white">
            {/* Bar */}
            <div className="flex items-center gap-1.5 px-3 py-2 border-b border-zinc-200 bg-white">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
              <span className="ml-3 text-[10px] tracking-wider text-zinc-400">aime.app</span>
            </div>

            {/* Image stage */}
            <div className="relative aspect-[16/10] md:aspect-[16/9] max-h-[75dvh] bg-zinc-50">
              {shots.map((s, i) => (
                <img
                  key={s.url}
                  src={s.url}
                  alt={s.label || activeTab.label}
                  className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-700 ${
                    i === shotIdx ? "opacity-100" : "opacity-0"
                  }`}
                  loading={i === 0 ? "eager" : "lazy"}
                />
              ))}

              {/* Caption */}
              {shots[shotIdx]?.label && (
                <div className="absolute bottom-3 left-3 right-3 flex justify-center pointer-events-none">
                  <div className="inline-flex items-center gap-2 bg-black/70 backdrop-blur text-white text-xs px-3 py-1.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-aime-red animate-pulse" />
                    {shots[shotIdx].label}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Dots */}
          {shots.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-5">
              {shots.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setShotIdx(i)}
                  aria-label={`Aperçu ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === shotIdx ? "w-8 bg-aime-red" : "w-1.5 bg-zinc-300 hover:bg-zinc-400"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}