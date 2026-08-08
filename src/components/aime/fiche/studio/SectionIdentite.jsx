import React, { useRef } from "react";
import { Upload, Trash2, Check } from "lucide-react";
import { WATERMARK_PRESETS } from "@/lib/docCatalog";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function SectionIdentite({ logoUrl, onLogoChange, watermark, onWatermarkChange, headerText, onHeaderTextChange }) {
  const inputRef = useRef(null);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      onLogoChange(file_url);
      toast.success("Logo importé");
    } catch (err) {
      toast.error("Erreur lors de l'import");
    }
  };

  return (
    <div className="space-y-5">
      {/* Logo */}
      <div>
        <div className="text-[9px] tracking-[0.18em] text-zinc-500 font-semibold uppercase mb-2">Logo personnel</div>
        {logoUrl ? (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10">
            <div className="w-12 h-12 rounded bg-white flex items-center justify-center overflow-hidden">
              <img src={logoUrl} alt="logo" className="max-w-full max-h-full" />
            </div>
            <div className="flex-1 text-[11px] text-zinc-300">Logo actif</div>
            <button
              onClick={() => onLogoChange(null)}
              className="text-zinc-400 hover:text-aime-red p-1.5"
              title="Supprimer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => inputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border border-dashed border-white/20 hover:border-aime-red hover:bg-aime-red/5 transition-all"
          >
            <Upload className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-[11px] text-zinc-300">Importer un logo</span>
          </button>
        )}
        <input ref={inputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      </div>

      {/* En-tête personnalisé */}
      <div>
        <div className="text-[9px] tracking-[0.18em] text-zinc-500 font-semibold uppercase mb-2">En-tête personnalisé</div>
        <input
          type="text"
          value={headerText || ""}
          onChange={(e) => onHeaderTextChange(e.target.value)}
          placeholder="Ex : Compagnie XYZ — Production"
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-[12px] text-white placeholder:text-zinc-600 focus:border-aime-red focus:outline-none"
        />
      </div>

      {/* Filigrane */}
      <div>
        <div className="text-[9px] tracking-[0.18em] text-zinc-500 font-semibold uppercase mb-2">Filigrane</div>
        <div className="grid grid-cols-2 gap-1.5">
          {WATERMARK_PRESETS.map((w) => (
            <button
              key={w.id}
              onClick={() => onWatermarkChange(w.id)}
              className={`px-2.5 py-2 rounded-lg border text-left transition-all ${
                watermark === w.id ? "border-aime-red bg-aime-red/10" : "border-white/10 hover:border-white/20"
              }`}
            >
              <span className="text-[11px] text-white font-medium">{w.label}</span>
              {watermark === w.id && <Check className="w-3 h-3 text-aime-red float-right" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}