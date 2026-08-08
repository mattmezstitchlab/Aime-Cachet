import React, { useRef, useState, useEffect } from "react";
import { X, Eraser, Check } from "lucide-react";

export default function SignaturePad({ open, onClose, onApply }) {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    if (!open) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#0F0F0F";
  }, [open]);

  if (!open) return null;

  const pos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches?.[0];
    const cx = touch ? touch.clientX : e.clientX;
    const cy = touch ? touch.clientY : e.clientY;
    return { x: (cx - rect.left) * (canvas.width / rect.width), y: (cy - rect.top) * (canvas.height / rect.height) };
  };

  const start = (e) => {
    e.preventDefault();
    const { x, y } = pos(e);
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(x, y);
    setDrawing(true);
  };

  const draw = (e) => {
    if (!drawing) return;
    e.preventDefault();
    const { x, y } = pos(e);
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawn(true);
  };

  const stop = () => setDrawing(false);

  const clear = () => {
    const canvas = canvasRef.current;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const apply = () => {
    if (!hasDrawn) return;
    const dataUrl = canvasRef.current.toDataURL("image/png");
    onApply(dataUrl);
    clear();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-[520px] mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-zinc-900 font-semibold text-base">Signature électronique</h3>
            <p className="text-[11px] text-zinc-500 mt-0.5">Signez avec le doigt ou la souris</p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-900">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="relative rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 overflow-hidden">
          <canvas
            ref={canvasRef}
            width={800}
            height={300}
            className="w-full h-[220px] touch-none cursor-crosshair"
            onMouseDown={start}
            onMouseMove={draw}
            onMouseUp={stop}
            onMouseLeave={stop}
            onTouchStart={start}
            onTouchMove={draw}
            onTouchEnd={stop}
          />
          {!hasDrawn && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-[11px] tracking-wider text-zinc-400 uppercase font-medium">Signez ici</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-5 gap-3">
          <button
            onClick={clear}
            disabled={!hasDrawn}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-[12px] font-medium text-zinc-600 hover:text-zinc-900 disabled:opacity-40"
          >
            <Eraser className="w-3.5 h-3.5" />
            Effacer
          </button>
          <button
            onClick={apply}
            disabled={!hasDrawn}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-zinc-900 hover:bg-aime-red text-white text-[13px] font-semibold rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Check className="w-4 h-4" />
            Apposer la signature
          </button>
        </div>
      </div>
    </div>
  );
}