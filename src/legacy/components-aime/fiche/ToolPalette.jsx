import React from "react";
import { Pencil, Stamp, RotateCcw, PenLine } from "lucide-react";
import SaveMenu from "@/components/aime/fiche/SaveMenu";

function Tool({ icon: Icon, label, onClick, active, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`group relative w-11 h-11 md:w-9 md:h-9 rounded-full flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
        active ? "bg-aime-red text-white" : "text-white hover:bg-aime-red"
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900 text-white text-[10px] font-medium px-2 py-1 rounded whitespace-nowrap pointer-events-none">
        {label}
      </span>
    </button>
  );
}

export default function ToolPalette({
  onDownload,
  onCloud,
  onEdit,
  onStamp,
  onSign,
  onResetStamp,
  hasStamp,
  stampMode,
  editMode,
  prestation,
  cachetCode,
}) {
  return (
    <div className="fixed left-1/2 -translate-x-1/2 bottom-[calc(1.5rem+env(safe-area-inset-bottom))] z-30 max-w-[calc(100vw-24px)] flex flex-col items-center">
      <div className="max-w-full overflow-visible inline-flex items-center gap-0.5 bg-zinc-900 rounded-full p-1.5 shadow-xl">
        <Tool icon={Pencil} label="Modifier" onClick={onEdit} active={editMode} />
        <Tool icon={PenLine} label="Signer" onClick={onSign} />
        <Tool icon={Stamp} label="Tampon" onClick={onStamp} active={stampMode || hasStamp} />
        {hasStamp && <Tool icon={RotateCcw} label="Effacer" onClick={onResetStamp} />}
        <div className="w-px h-5 bg-white/10 mx-0.5" />
        <SaveMenu onDownload={onDownload} onCloud={onCloud} prestation={prestation} cachetCode={cachetCode} />
      </div>
      {stampMode && (
        <div className="mt-3 text-center">
          <span className="inline-block px-3 py-1 bg-aime-red text-white text-[11px] rounded-full font-medium">
            Cliquez sur la fiche pour poser le tampon
          </span>
        </div>
      )}
    </div>
  );
}