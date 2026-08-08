import React, { useState, useRef, useEffect } from "react";
import { QrCode, X, Copy, Check, Share2 } from "lucide-react";
import QRBadge from "@/components/aime/fiche/QRBadge";

// Petit picto QR à côté de la date d'une row timeline.
// Clic → popover avec QR + code Cachet + bouton copier. Léger, pas de flip.
export default function TimelineQRButton({ prestation }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const code = prestation.cachet_code || "—";
  const verifyUrl = `${window.location.origin}/fiche/${prestation.id}`;

  const copy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const share = async (e) => {
    e.stopPropagation();
    const shareData = {
      title: `Fiche AIME · ${code}`,
      text: `Vérifier la fiche ${code}`,
      url: verifyUrl,
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (_) { /* annulé */ }
    } else {
      navigator.clipboard.writeText(verifyUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        className={`mt-1.5 w-6 h-6 rounded-md flex items-center justify-center transition-colors ${
          open ? "bg-zinc-900 text-white" : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"
        }`}
        aria-label="Voir le QR code de la fiche"
        title="QR code · Code Cachet"
      >
        <QrCode className="w-3.5 h-3.5" />
      </button>

      {open && (
        <div className="absolute top-8 left-0 z-30 w-[260px] bg-aime-black text-white rounded-2xl shadow-2xl ring-1 ring-white/10 overflow-hidden">
          <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-white/10">
            <div className="text-[10px] tracking-[0.2em] font-semibold uppercase text-aime-red">Verso · vérifier</div>
            <button onClick={() => setOpen(false)} className="text-white/50 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-4 flex flex-col items-center gap-3">
            <div className="bg-white rounded-lg p-2">
              <QRBadge value={verifyUrl} size={120} />
            </div>
            <button
              onClick={copy}
              className="w-full inline-flex items-center justify-between gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-3 py-2 transition-colors"
            >
              <span className="font-mono text-[11px] text-white truncate">{code}</span>
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-white/60 shrink-0" />
              )}
            </button>
            <button
              onClick={share}
              className="w-full inline-flex items-center justify-center gap-2 bg-aime-red hover:bg-aime-red/90 text-white rounded-lg px-3 py-2 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="text-[11px] font-semibold tracking-wide">Partager</span>
            </button>
            <div className="text-[10px] text-white/40 leading-relaxed text-center">
              Scanner pour vérifier l'authenticité de la fiche.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}