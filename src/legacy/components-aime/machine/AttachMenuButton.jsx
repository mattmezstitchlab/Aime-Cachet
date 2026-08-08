import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Plus, Camera, FileText, Loader2, ClipboardPlus, MessageCircle, Bell, ListChecks } from "lucide-react";
import { base44 } from "@/api/base44Client";

/**
 * Bouton "+" qui ouvre un petit menu : Photo OU Document.
 * L'assistant détecte ensuite le contenu et propose la fiche à créer.
 */
export default function AttachMenuButton({ onCapture, onCreate, onAskQuestion, onPrepareReminder, onShowPriorities, size = "sm" }) {
  const cameraRef = useRef(null);
  const fileRef = useRef(null);
  const wrapperRef = useRef(null);
  const menuRef = useRef(null);
  const btnRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  // Clignotement du "+" limité à 6 secondes après le montage pour attirer l'œil
  // sans devenir distrayant ensuite.
  const [blinking, setBlinking] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setBlinking(false), 6000);
    return () => clearTimeout(t);
  }, []);
  const iconCls = size === "md" ? "w-5 h-5" : "w-[18px] h-[18px]";

  // Calcule la position du menu en coordonnées viewport (portal hors overflow).
  // Grille 2x3 : largeur fixe ~290px, hauteur compacte ~310px (sans scroll).
  useEffect(() => {
    if (!open || !btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    const menuW = 290;
    const menuH = 310;
    const left = Math.min(Math.max(8, r.left), Math.max(8, window.innerWidth - menuW - 8));
    const top = Math.min(Math.max(8, r.bottom + 6), Math.max(8, window.innerHeight - menuH - 8));
    setPos({ top, left });
  }, [open]);

  // Ferme au clic extérieur (en tenant compte du portail)
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      const inWrapper = wrapperRef.current && wrapperRef.current.contains(e.target);
      const inMenu = menuRef.current && menuRef.current.contains(e.target);
      if (!inWrapper && !inMenu) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setOpen(false);
    setLoading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      onCapture?.({ file_url, kind: e.target === cameraRef.current ? "photo" : "document" });
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={loading}
        title="Joindre une photo ou un document"
        aria-label="Joindre"
        className={`relative w-9 h-9 rounded-full bg-zinc-900 text-aime-red hover:text-white disabled:opacity-60 disabled:cursor-wait flex items-center justify-center shadow-[7px_7px_14px_rgba(10,13,15,0.55),-5px_-5px_12px_rgba(72,80,84,0.14)] hover:shadow-[inset_5px_5px_10px_rgba(10,13,15,0.55),inset_-4px_-4px_9px_rgba(72,80,84,0.12)] transition-all duration-200 ${
          open ? "rotate-45" : (blinking ? "animate-[aimePlusBlink_1.6s_ease-in-out_infinite]" : "")
        }`}
      >
        {/* Halo rouge pulsant pour signaler la découverte (6 secondes max) */}
        {!open && !loading && blinking && (
          <span
            className="absolute inset-0 rounded-full bg-aime-red/40 blur-md animate-[aimePlusHalo_1.6s_ease-in-out_infinite] pointer-events-none"
            aria-hidden
          />
        )}
        <span className="relative">
          {loading ? <Loader2 className={`${iconCls} animate-spin`} /> : <Plus className={iconCls} />}
        </span>
        <style>{`
          @keyframes aimePlusBlink {
            0%, 100% { box-shadow: 7px 7px 14px rgba(10,13,15,0.55), -5px -5px 12px rgba(72,80,84,0.14), 0 0 0 0 rgba(255,0,0,0.5); }
            50% { box-shadow: 7px 7px 14px rgba(10,13,15,0.55), -5px -5px 12px rgba(72,80,84,0.14), 0 0 16px 4px rgba(255,0,0,0.55); }
          }
          @keyframes aimePlusHalo {
            0%, 100% { opacity: 0.25; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.25); }
          }
        `}</style>
      </button>

      {open && createPortal(
        <div
          ref={menuRef}
          className="fixed rounded-2xl border border-white/5 bg-zinc-900 shadow-[14px_14px_30px_rgba(10,13,15,0.62),-10px_-10px_22px_rgba(72,80,84,0.14)] overflow-hidden z-[9999] p-2"
          style={{ top: pos.top, left: pos.left, width: 290 }}
        >
          <div className="grid grid-cols-2 gap-2">
            <TileAction icon={ClipboardPlus} label="Nouvelle fiche" hint="Cachet préparatoire" onClick={() => { setOpen(false); onCreate?.(); }} />
            <TileAction icon={Camera} label="Importer doc" hint="Photo, PDF…" onClick={() => cameraRef.current?.click()} />
            <TileAction icon={FileText} label="Joindre doc" hint="PDF, image…" onClick={() => fileRef.current?.click()} />
            <TileAction icon={MessageCircle} label="Question" hint="Focus champ IA" onClick={() => { setOpen(false); onAskQuestion?.(); }} />
            <TileAction icon={Bell} label="Rappel" hint="Brouillon assistant" onClick={() => { setOpen(false); onPrepareReminder?.(); }} />
            <TileAction icon={ListChecks} label="Priorités" hint="Urgentes du jour" onClick={() => { setOpen(false); onShowPriorities?.(); }} />
          </div>
        </div>,
        document.body
      )}

      <input ref={cameraRef} type="file" accept="image/*" capture="environment" onChange={handleFile} className="hidden" />
      <input ref={fileRef} type="file" accept="image/*,application/pdf" onChange={handleFile} className="hidden" />
    </div>
  );
}

function MenuAction({ icon: Icon, label, hint, onClick }) {
  if (!onClick) return null;
  return (
    <button
      type="button"
      onClick={() => onClick()}
      className="w-full flex items-center gap-3 px-4 py-3.5 text-left text-sm text-zinc-200 hover:text-white transition-all hover:shadow-[inset_6px_6px_12px_rgba(10,13,15,0.5),inset_-4px_-4px_10px_rgba(72,80,84,0.1)]"
    >
      <Icon className="w-4 h-4 text-aime-red shrink-0" />
      <div>
        <div className="font-medium">{label}</div>
        <div className="text-[10px] text-zinc-500">{hint}</div>
      </div>
    </button>
  );
}

// Tuile carrée : picto centré au-dessus, label puis hint dessous. Utilisée
// dans la grille 2x3 du menu "+" pour éviter la barre de scroll.
function TileAction({ icon: Icon, label, hint, onClick }) {
  if (!onClick) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center justify-center text-center gap-1 rounded-xl px-2 py-3 bg-black/20 hover:bg-black/40 border border-white/5 text-zinc-200 hover:text-white transition-all hover:shadow-[inset_4px_4px_8px_rgba(10,13,15,0.5),inset_-3px_-3px_7px_rgba(72,80,84,0.1)]"
    >
      <Icon className="w-5 h-5 text-aime-red mb-0.5" />
      <div className="text-[12px] font-medium leading-tight">{label}</div>
      <div className="text-[9px] text-zinc-500 leading-tight">{hint}</div>
    </button>
  );
}