import React, { useMemo, useState } from "react";
import { Check } from "lucide-react";
import { FICHE_BACKGROUNDS } from "@/lib/docTemplates";
import { PAPER_FORMATS, FONT_PRESETS, ACCENT_COLORS } from "@/lib/docCatalog";

export default function SectionApparence({
  theme, onThemeChange,
  background, onBackgroundChange,
  paperFormat, onPaperFormatChange,
  font, onFontChange,
  accent, onAccentChange,
}) {
  const [filter, setFilter] = useState("tous");

  const categories = useMemo(() => {
    const ids = [...new Set(FICHE_BACKGROUNDS.map((item) => item.category || "autres"))];
    return ["tous", ...ids];
  }, []);

  const visibles = useMemo(
    () => filter === "tous"
      ? FICHE_BACKGROUNDS
      : FICHE_BACKGROUNDS.filter((item) => (item.category || "autres") === filter),
    [filter],
  );

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center justify-between gap-3 mb-2">
          <div>
            <div className="text-[9px] tracking-[0.18em] text-zinc-500 font-semibold uppercase">Bibliothèque visuelle</div>
            <div className="text-[10px] text-zinc-500 mt-1">{FICHE_BACKGROUNDS.length} ambiances prêtes à l'emploi</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {categories.map((category) => {
            const active = filter === category;
            return (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-2.5 py-1 rounded-full text-[10px] tracking-wide capitalize border transition-colors ${
                  active ? "border-aime-red bg-aime-red/10 text-white" : "border-white/10 text-zinc-400 hover:border-white/20 hover:text-white"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
        <div className="grid grid-cols-3 gap-2 max-h-[280px] overflow-y-auto pr-1">
          {visibles.map((bg) => {
            const active = background === bg.id;
            return (
              <button
                key={bg.id}
                onClick={() => onBackgroundChange(bg.id)}
                title={bg.label}
                className={`relative overflow-hidden rounded-xl border transition-all text-left ${
                  active ? "border-aime-red shadow-[0_0_0_1px_rgba(230,0,18,0.45)]" : "border-white/10 hover:border-white/30"
                }`}
              >
                <div
                  className="aspect-[4/5]"
                  style={bg.url
                    ? { backgroundImage: `url(${bg.url})`, backgroundSize: "cover", backgroundPosition: "center" }
                    : { background: bg.gradient }}
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-2 py-2.5">
                  <div className="text-[10px] font-semibold text-white leading-tight">{bg.label}</div>
                  <div className="text-[9px] text-white/55 capitalize">{bg.category || "studio"}</div>
                </div>
                {active && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 backdrop-blur flex items-center justify-center border border-white/20">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="text-[9px] tracking-[0.18em] text-zinc-500 font-semibold uppercase mb-2">Papier</div>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { id: "light", label: "Clair", bg: "bg-white", text: "text-zinc-900" },
            { id: "dark", label: "Sombre", bg: "bg-zinc-900", text: "text-white" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => onThemeChange(t.id)}
              className={`flex items-center gap-2 p-2 rounded-lg border transition-all ${
                theme === t.id ? "border-white/20 bg-white/5" : "border-white/10 hover:border-white/20"
              }`}
            >
              <div className={`w-6 h-7 rounded ${t.bg} ${t.text} flex items-center justify-center text-[8px] font-bold`}>A</div>
              <span className="text-[11px] text-white font-medium">{t.label}</span>
              {theme === t.id && <Check className="w-3 h-3 text-aime-red ml-auto" />}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="text-[9px] tracking-[0.18em] text-zinc-500 font-semibold uppercase mb-2">Couleur d'accent</div>
        <div className="flex flex-wrap gap-1.5">
          {ACCENT_COLORS.map((c) => (
            <button
              key={c.id}
              onClick={() => onAccentChange(c.id)}
              title={c.label}
              className={`w-7 h-7 rounded-full ring-2 transition-all ${
                accent === c.id ? "ring-white scale-110" : "ring-transparent hover:ring-white/30"
              }`}
              style={{ backgroundColor: c.value }}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="text-[9px] tracking-[0.18em] text-zinc-500 font-semibold uppercase mb-2">Police</div>
        <div className="space-y-1">
          {FONT_PRESETS.map((f) => {
            const active = font === f.id;
            return (
              <button
                key={f.id}
                onClick={() => onFontChange(f.id)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg border transition-all ${
                  active ? "border-white/20 bg-white/5" : "border-white/5 hover:border-white/20"
                }`}
              >
                <span style={{ fontFamily: f.css }} className="text-[14px] text-white font-medium">{f.label}</span>
                <span className="flex items-center gap-1.5">
                  <span className="text-[9px] text-zinc-500 tracking-wider uppercase">{f.subtitle}</span>
                  {active && <Check className="w-3 h-3 text-aime-red" />}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="text-[9px] tracking-[0.18em] text-zinc-500 font-semibold uppercase mb-2">Format</div>
        <div className="grid grid-cols-2 gap-1.5">
          {PAPER_FORMATS.map((p) => {
            const active = paperFormat === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onPaperFormatChange(p.id)}
                className={`relative p-2 rounded-lg border text-left transition-all ${
                  active ? "border-white/20 bg-white/5" : "border-white/10 hover:border-white/20"
                }`}
              >
                <div className="text-[11px] text-white font-semibold">{p.label}</div>
                <div className="text-[9px] text-zinc-500 mt-0.5">{p.subtitle}</div>
                {active && <Check className="absolute top-2 right-2 w-3 h-3 text-aime-red" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}