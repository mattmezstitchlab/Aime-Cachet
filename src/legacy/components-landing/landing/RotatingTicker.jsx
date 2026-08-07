import React, { useEffect, useState } from "react";

/**
 * Petit ticker qui fait défiler des messages courts (rappels, alertes)
 * avec fade in/out. Utilisé dans MiniMachine et MosaicCockpit sur la landing.
 */
export default function RotatingTicker({ messages = [], intervalMs = 2800, className = "", showDot = true }) {
  const [idx, setIdx] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (messages.length <= 1) return;
    const id = setInterval(() => {
      setShow(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % messages.length);
        setShow(true);
      }, 220);
    }, intervalMs);
    return () => clearInterval(id);
  }, [messages.length, intervalMs]);

  if (!messages.length) return null;
  const m = messages[idx];

  return (
    <div className={`flex items-center gap-2 transition-opacity duration-200 ${show ? "opacity-100" : "opacity-0"} ${className}`}>
      {showDot && (
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ background: m.color || "#ff0000" }}
        />
      )}
      <span className="truncate min-w-0">{m.text}</span>
    </div>
  );
}