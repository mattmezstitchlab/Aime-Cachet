import React, { useEffect, useMemo, useState } from "react";

/**
 * Console "matrix" 10×16 — affiche le dernier message assistant texte-pur
 * une lettre par case. Les cases sans lettre conservent l'animation rouge
 * de la mosaïque ; pendant le loading, scintillement rouge global.
 */
const ROWS = 10;
const COLS = 16;
const TOTAL = ROWS * COLS;
const TYPE_SPEED_MS = 30;

function layoutText(text, rows, cols) {
  // Découpe le texte en mots puis en lignes <= cols, en tronquant ce qui dépasse rows.
  const cells = new Array(rows * cols).fill(null);
  const words = String(text || "").split(/\s+/).filter(Boolean);
  const lines = [];
  let cur = "";
  for (const w of words) {
    if (w.length >= cols) {
      if (cur) lines.push(cur);
      // Coupe les mots trop longs
      for (let i = 0; i < w.length; i += cols) {
        lines.push(w.slice(i, i + cols));
      }
      cur = "";
      continue;
    }
    if ((cur + (cur ? " " : "") + w).length <= cols) {
      cur = cur ? cur + " " + w : w;
    } else {
      lines.push(cur);
      cur = w;
    }
    if (lines.length >= rows) break;
  }
  if (cur && lines.length < rows) lines.push(cur);

  for (let r = 0; r < Math.min(rows, lines.length); r++) {
    const line = lines[r];
    for (let c = 0; c < line.length && c < cols; c++) {
      cells[r * cols + c] = line[c];
    }
  }
  return cells;
}

export default function MachineMatrixScreen({ text = "", loading = false }) {
  const targetCells = useMemo(() => layoutText(text, ROWS, COLS), [text]);
  const totalLetters = useMemo(() => targetCells.filter((x) => x && x !== " ").length, [targetCells]);
  const [revealed, setRevealed] = useState(0);
  const [tick, setTick] = useState(0);

  // Reset + typewriter à chaque nouveau texte
  useEffect(() => {
    setRevealed(0);
    if (!text) return;
    const id = setInterval(() => {
      setRevealed((n) => {
        if (n >= targetCells.length) {
          clearInterval(id);
          return n;
        }
        return n + 1;
      });
    }, TYPE_SPEED_MS);
    return () => clearInterval(id);
  }, [text, targetCells.length]);

  // Vague d'animation de fond (mêmes paramètres que la mosaïque accueil)
  useEffect(() => {
    const id = setInterval(() => setTick((t) => (t + 1) % (ROWS + COLS + 6)), 200);
    return () => clearInterval(id);
  }, []);

  const intensityFor = (r, c) => {
    const d = Math.abs(r + c - tick);
    if (d > 3) return 0.08;
    if (d === 0) return 1;
    if (d === 1) return 0.72;
    if (d === 2) return 0.42;
    return 0.2;
  };

  // Index linéaire jusqu'auquel on révèle (compte uniquement les cases non-nulles)
  // → on parcourt et on alloue le "budget" revealed aux cases qui ont une lettre
  const visibleIndices = useMemo(() => {
    const set = new Set();
    let budget = revealed;
    for (let i = 0; i < targetCells.length && budget > 0; i++) {
      if (targetCells[i] != null) {
        set.add(i);
        budget--;
      }
    }
    return set;
  }, [revealed, targetCells]);

  const done = revealed >= totalLetters && totalLetters > 0;

  return (
    <div
      className="rounded-2xl border border-white/5 bg-zinc-900 p-3 shadow-[10px_10px_22px_rgba(10,13,15,0.5),-8px_-8px_18px_rgba(72,80,84,0.12)]"
      role="region"
      aria-label="Console matrix de l'assistant"
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="text-[9px] tracking-[0.22em] text-zinc-500 font-semibold">CONSOLE</span>
        <span className={`text-[9px] tracking-[0.22em] font-bold ${loading ? "text-aime-red animate-pulse" : "text-aime-red"}`}>
          {loading ? "ANALYSE…" : done ? "MESSAGE" : "TRANSMISSION"}
        </span>
      </div>

      <div
        className="grid gap-[3px]"
        style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: TOTAL }).map((_, i) => {
          const r = Math.floor(i / COLS);
          const c = i % COLS;
          const wave = intensityFor(r, c);
          const letter = targetCells[i];
          const isVisible = visibleIndices.has(i);
          const showLetter = isVisible && letter && letter !== " ";

          // Loading : scintillement rouge global, ignore les lettres
          if (loading) {
            const sparkle = (i * 7 + tick * 11) % 13;
            const alpha = sparkle < 3 ? 0.55 : sparkle < 6 ? 0.25 : 0.08;
            return (
              <div
                key={i}
                className="aspect-square rounded-[3px] transition-all duration-200"
                style={{
                  background: `linear-gradient(145deg, rgba(255,0,0,${alpha}), rgba(58,12,14,0.55))`,
                  boxShadow: alpha > 0.4 ? `0 0 8px rgba(255, 0, 0, ${alpha * 0.35})` : "none",
                }}
              />
            );
          }

          if (showLetter) {
            // Case éteinte qui porte une lettre
            return (
              <div
                key={i}
                className="aspect-square rounded-[3px] flex items-center justify-center bg-black/70 border border-aime-red/25"
                style={{
                  boxShadow: "inset 0 0 6px rgba(255,0,0,0.18)",
                }}
              >
                <span
                  className="font-display font-black text-aime-red leading-none uppercase"
                  style={{ fontSize: "clamp(8px, 1.2vw, 13px)", textShadow: "0 0 4px rgba(255,0,0,0.55)" }}
                >
                  {letter}
                </span>
              </div>
            );
          }

          // Case de fond — animation rouge mosaïque
          const alpha = Math.min(1, 0.06 + wave * 0.35);
          return (
            <div
              key={i}
              className="aspect-square rounded-[3px] transition-all duration-300"
              style={{
                background: `linear-gradient(145deg, rgba(255,0,0,${Math.max(0.04, alpha * 0.7)}), rgba(58,12,14,0.45))`,
                boxShadow: alpha > 0.55 ? `0 0 8px rgba(255, 0, 0, ${alpha * 0.3})` : "none",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}