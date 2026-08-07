import React from "react";
import { Pencil, ArrowUp, ArrowDown, Eye, EyeOff, LayoutPanelTop } from "lucide-react";

const FIELD_GROUPS = [
  [
    { key: "date", label: "Date", type: "date" },
    { key: "duration_hours", label: "Durée (h)", type: "number", min: 0, step: 0.5 },
  ],
  [
    { key: "employer", label: "Employeur" },
    { key: "location", label: "Lieu" },
  ],
  [
    { key: "nature", label: "Nature" },
    { key: "amount", label: "Montant brut (€)", type: "number", min: 0, step: 1 },
  ],
  [
    { key: "type", label: "Rôle", as: "select", options: ["Artiste", "Technicien"] },
    { key: "annexe", label: "Annexe", as: "select", options: ["10", "8"] },
  ],
  [
    { key: "employer_contact", label: "Contact" },
    { key: "employer_siret", label: "SIRET" },
  ],
];

export default function SectionContenu({
  textEditable,
  onTextEditableChange,
  customNotes,
  onCustomNotesChange,
  prestation,
  onPrestationChange,
  sectionLayout = [],
  onMoveSection,
  onToggleSection,
  showVerso = true,
  onToggleVerso,
}) {
  const updateField = (key, value) => {
    const normalized = ["duration_hours", "amount"].includes(key)
      ? (value === "" ? "" : Number(value))
      : value;
    onPrestationChange?.(key, normalized);
  };

  return (
    <div className="space-y-5">
      <button
        onClick={() => onTextEditableChange(!textEditable)}
        className={`w-full flex items-center justify-between p-2.5 rounded-lg border transition-all ${
          textEditable ? "border-aime-red bg-aime-red/10" : "border-white/10 hover:border-white/20"
        }`}
      >
        <span className="flex items-center gap-2">
          <Pencil className="w-3.5 h-3.5 text-zinc-300" />
          <span className="text-[12px] text-white font-medium">
            {textEditable ? "Édition inline active" : "Activer l'édition inline"}
          </span>
        </span>
        <div className={`w-8 h-4 rounded-full p-0.5 transition-all ${textEditable ? "bg-aime-red" : "bg-white/20"}`}>
          <div className={`w-3 h-3 rounded-full bg-white transition-transform ${textEditable ? "translate-x-4" : ""}`} />
        </div>
      </button>

      <div>
        <div className="text-[9px] tracking-[0.18em] text-zinc-500 font-semibold uppercase mb-2">Champs du document</div>
        <div className="space-y-2.5">
          {FIELD_GROUPS.map((group, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-2 gap-2">
              {group.map((field) => (
                <label key={field.key} className="block">
                  <span className="text-[10px] text-zinc-500 mb-1 block">{field.label}</span>
                  {field.as === "select" ? (
                    <select
                      value={prestation?.[field.key] ?? ""}
                      onChange={(e) => updateField(field.key, e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-[12px] text-white focus:border-aime-red focus:outline-none"
                    >
                      {field.options.map((option) => (
                        <option key={option} value={option} className="bg-zinc-900">
                          {field.key === "annexe" ? `Annexe ${option}` : option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type || "text"}
                      min={field.min}
                      step={field.step}
                      value={prestation?.[field.key] ?? ""}
                      onChange={(e) => updateField(field.key, e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-[12px] text-white placeholder:text-zinc-600 focus:border-aime-red focus:outline-none"
                    />
                  )}
                </label>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="text-[9px] tracking-[0.18em] text-zinc-500 font-semibold uppercase mb-2">Notes libres</div>
        <textarea
          value={customNotes || ""}
          onChange={(e) => onCustomNotesChange(e.target.value)}
          rows={4}
          placeholder="Ajoutez une note visible dans le document"
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-[11px] text-white placeholder:text-zinc-600 focus:border-aime-red focus:outline-none resize-none"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[9px] tracking-[0.18em] text-zinc-500 font-semibold uppercase">Structure du recto</div>
            <div className="text-[10px] text-zinc-500 mt-1">Réorganisez les blocs visibles du document</div>
          </div>
          <span className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <LayoutPanelTop className="w-3.5 h-3.5 text-zinc-300" />
          </span>
        </div>
        <div className="space-y-1.5">
          {sectionLayout.map((section, index) => (
            <div key={section.id} className="flex items-center gap-2 px-2.5 py-2 rounded-lg border border-white/10 bg-white/[0.03]">
              <button
                onClick={() => onToggleSection?.(section.id)}
                className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors ${
                  section.visible ? "border-aime-red bg-aime-red/10 text-white" : "border-white/10 text-zinc-500"
                }`}
                title={section.visible ? "Masquer" : "Afficher"}
              >
                {section.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
              <span className="flex-1 text-[11px] text-white font-medium">{section.label}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onMoveSection?.(index, -1)}
                  disabled={index === 0}
                  className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-zinc-300 disabled:opacity-35 hover:border-white/20"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onMoveSection?.(index, 1)}
                  disabled={index === sectionLayout.length - 1}
                  className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-zinc-300 disabled:opacity-35 hover:border-white/20"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => onToggleVerso?.(!showVerso)}
        className={`w-full flex items-center justify-between p-2.5 rounded-lg border transition-all ${
          showVerso ? "border-white/20 bg-white/5" : "border-white/10 hover:border-white/20"
        }`}
      >
        <span className="text-[12px] text-white font-medium">Page verso de vérification</span>
        <div className={`w-8 h-4 rounded-full p-0.5 transition-all ${showVerso ? "bg-aime-red" : "bg-white/20"}`}>
          <div className={`w-3 h-3 rounded-full bg-white transition-transform ${showVerso ? "translate-x-4" : ""}`} />
        </div>
      </button>
    </div>
  );
}