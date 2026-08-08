// ============================================================================
// Fenêtre flottante Assistant AIME — compacte, centrée, déplaçable.
// Drag par le header. Overlay opaque pour masquer le SideRail derrière.
// ============================================================================

import React, { useEffect, useRef, useState, useCallback } from "react";
import AimeMachine from "@/components/aime/machine/AimeMachine";

const WIN_W = 380;
const WIN_H = 600;

// La fenêtre s'ouvre TOUJOURS centrée. Le drag reste actif pendant la session,
// mais on ne restaure plus la dernière position au prochain clic sur 507 :
// c'est plus prévisible et conforme à la demande "au clic sur 507, au centre".
function getCenteredPos(w = WIN_W, h = WIN_H) {
  if (typeof window === "undefined") return { x: 100, y: 80 };
  const x = Math.max(16, (window.innerWidth - w) / 2);
  const y = Math.max(16, (window.innerHeight - h) / 2);
  return { x, y };
}

export default function AssistantSidePanel({ open, onClose, action = null, onCreate }) {
  const [pos, setPos] = useState(() => getCenteredPos());
  const [expanded, setExpanded] = useState(false);

  // Re-centrer à chaque ouverture (clic sur le cœur 507).
  useEffect(() => {
    if (open) {
      const w = expanded ? Math.min(920, window.innerWidth - 32) : Math.min(WIN_W, window.innerWidth - 32);
      const h = expanded ? Math.min(760, window.innerHeight - 32) : Math.min(WIN_H, window.innerHeight - 32);
      setPos(getCenteredPos(w, h));
    }
  }, [open, expanded]);
  const dragRef = useRef(null);
  const panelW = expanded ? Math.min(920, window.innerWidth - 32) : Math.min(WIN_W, window.innerWidth - 32);
  const panelH = expanded ? Math.min(760, window.innerHeight - 32) : Math.min(WIN_H, window.innerHeight - 32);
  const draggingRef = useRef(false);
  const offsetRef = useRef({ x: 0, y: 0 });

  // Escape ferme
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // (plus de sauvegarde de position : on veut un re-centrage systématique à l'ouverture)

  // Clamp window resize / agrandissement
  useEffect(() => {
    const onResize = () => {
      setPos((p) => ({
        x: Math.min(Math.max(16, p.x), Math.max(16, window.innerWidth - panelW - 16)),
        y: Math.min(Math.max(16, p.y), Math.max(16, window.innerHeight - panelH - 16)),
      }));
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [panelW, panelH]);

  const onMouseDown = useCallback((e) => {
    // Ne pas démarrer le drag si clic sur bouton header (close / expand)
    if (e.target.closest("button, a")) return;
    draggingRef.current = true;
    const rect = dragRef.current.getBoundingClientRect();
    offsetRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    document.body.style.userSelect = "none";
  }, []);

  useEffect(() => {
    const onMove = (e) => {
      if (!draggingRef.current) return;
      const nx = Math.min(Math.max(16, e.clientX - offsetRef.current.x), Math.max(16, window.innerWidth - panelW - 16));
      const ny = Math.min(Math.max(16, e.clientY - offsetRef.current.y), Math.max(16, window.innerHeight - panelH - 16));
      setPos({ x: nx, y: ny });
    };
    const onUp = () => {
      draggingRef.current = false;
      document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [panelW, panelH]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop sombre opaque — masque le SideRail rouge derrière */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Fenêtre flottante draggable */}
      <div
        role="dialog"
        aria-label="Assistant AIME Intermittence"
        className="fixed z-50 rounded-2xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.08)] animate-in fade-in zoom-in-95 duration-200"
        style={{
          left: pos.x,
          top: pos.y,
          width: panelW,
          height: panelH,
          maxHeight: "calc(100dvh - 32px)",
        }}
      >
        {/* Zone de drag — centrée sur le header pour ne bloquer ni le bouton + (gauche) ni close (droite) */}
        <div
          ref={dragRef}
          onMouseDown={onMouseDown}
          className="absolute top-0 h-14 z-0 cursor-grab active:cursor-grabbing"
          style={{ left: 76, right: 92 }}
          aria-hidden
        />
        <div className="h-full bg-black">
          <AimeMachine size="compact" onClose={onClose} action={action} onCreate={onCreate} />
        </div>
      </div>
    </>
  );
}