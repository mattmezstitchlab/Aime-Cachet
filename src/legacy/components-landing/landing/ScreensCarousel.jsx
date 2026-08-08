import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Carrousel d'aperçus d'écran de l'app — autoplay + flèches + dots.
 * Pensé pour montrer plusieurs captures classées par catégorie.
 */
export default function ScreensCarousel({
  title,
  subtitle,
  shots = [],
  autoplayMs = 4500,
  tone = "light", // "light" | "dark"
}) {
  const [idx, setIdx] = useState(0);
  const timer = useRef(null);
  const paused = useRef(false);

  const go = (n) => setIdx((i) => (n + shots.length) % shots.length);

  useEffect(() => {
    if (!autoplayMs || shots.length <= 1) return;
    timer.current = setInterval(() => {
      if (!paused.current) setIdx((i) => (i + 1) % shots.length);
    }, autoplayMs);
    return () => clearInterval(timer.current);
  }, [autoplayMs, shots.length]);

  if (!shots.length) return null;

  const isDark = tone === "dark";

  return (
    <section
      className={`${isDark ? "bg-black text-white" : "bg-white text-zinc-900"} border-y ${
        isDark ? "border-white/5" : "border-zinc-100"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-16 md:py-20">
        {/* Header */}
        <div className="text-center mb-10">
          {subtitle && (
            <div className="text-[10px] tracking-[0.22em] text-aime-red font-semibold mb-3">
              {subtitle}
            </div>
          )}
          <h2 className="font-display font-black text-3xl md:text-4xl tracking-tight">
            {title}
          </h2>
        </div>

        {/* Stage */}
        <div
          className="relative"
          onMouseEnter={() => (paused.current = true)}
          onMouseLeave={() => (paused.current = false)}
        >
          {/* Frame "macOS" */}
          <div
            className={`relative mx-auto max-w-5xl rounded-2xl overflow-hidden ring-1 ${
              isDark ? "ring-white/10 bg-zinc-950" : "ring-zinc-200 bg-zinc-100"
            } shadow-[0_30px_80px_-30px_rgba(0,0,0,0.35)]`}
          >
            {/* Bar */}
            <div
              className={`flex items-center gap-1.5 px-3 py-2 border-b ${
                isDark ? "border-white/10 bg-black/40" : "border-zinc-200 bg-white"
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
              <span
                className={`ml-3 text-[10px] tracking-wider ${
                  isDark ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                aime.app
              </span>
            </div>

            {/* Image */}
            <div className={`relative aspect-[16/9] max-h-[70dvh] ${isDark ? "bg-black" : "bg-white"}`}>
              {shots.map((s, i) => (
                <img
                  key={s.url}
                  src={s.url}
                  alt={s.label || title}
                  className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-700 ${
                    i === idx ? "opacity-100" : "opacity-0"
                  }`}
                  loading={i === 0 ? "eager" : "lazy"}
                />
              ))}

              {/* Caption */}
              {shots[idx]?.label && (
                <div className="absolute bottom-3 left-3 right-3 flex justify-center">
                  <div className="inline-flex items-center gap-2 bg-black/70 backdrop-blur text-white text-xs px-3 py-1.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-aime-red animate-pulse" />
                    {shots[idx].label}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Arrows */}
          {shots.length > 1 && (
            <>
              <button
                aria-label="Précédent"
                onClick={() => go(idx - 1)}
                className={`absolute left-2 md:-left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  isDark
                    ? "bg-white/10 hover:bg-white/20 text-white"
                    : "bg-white hover:bg-zinc-50 text-zinc-900 shadow-md"
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                aria-label="Suivant"
                onClick={() => go(idx + 1)}
                className={`absolute right-2 md:-right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  isDark
                    ? "bg-white/10 hover:bg-white/20 text-white"
                    : "bg-white hover:bg-zinc-50 text-zinc-900 shadow-md"
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Dots */}
          {shots.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              {shots.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i)}
                  aria-label={`Aller à l'écran ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === idx
                      ? "w-8 bg-aime-red"
                      : isDark
                      ? "w-1.5 bg-white/20 hover:bg-white/40"
                      : "w-1.5 bg-zinc-300 hover:bg-zinc-400"
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