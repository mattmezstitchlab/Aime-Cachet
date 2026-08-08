import React from "react";
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
  return (
    <div className="space-y-5">
      {/* Fond visuel */}
      <div>
        <div className="text-[9px] tracking-[0.18em] text-zinc-500 font-semibold uppercase mb-2">Fond visuel</div>
        <div className="grid grid-cols-4 gap-1.5">
          {FICHE_BACKGROUNDS.map((bg) => {
            const active = background === bg.id;
            return (
              <button
                key={bg.id}
                onClick={() => onBackgroundChange(bg.id)}
                title={bg.label}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  active ? "border-aime-red scale-95" : "border-white/10 hover:border-white/30"
                }`}
                style={
                  bg.url
                    ? { backgroundImage: `url(${bg.url})`, backgroundSize: "cover", backgroundPosition: "center" }
                    : { background: bg.gradient }
                }
              >
                {active && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mode papier */}
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
                theme === t.id ? "border-white/20" : "border-white/10 hover:border-white/20"
              }`}
            >
              <div className={`w-6 h-7 rounded ${t.bg} ${t.text} flex items-center justify-center text-[8px] font-bold`}>A</div>
              <span className="text-[11px] text-white font-medium">{t.label}</span>
              {theme === t.id && <Check className="w-3 h-3 text-aime-red ml-auto" />}
            </button>
          ))}
        </div>
      </div>

      {/* Couleur d'accent */}
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

      {/* Police */}
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
                  active ? "border-white/20" : "border-white/5 hover:border-white/20"
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

      {/* Format papier */}
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
                  active ? "border-white/20" : "border-white/10 hover:border-white/20"
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