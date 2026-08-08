import React from "react";

// QR code généré via API publique (quickchart) — gratuit, sans dépendance, sans backend.
export default function QRBadge({ value, size = 96, label = "" }) {
  if (!value) return null;
  const src = `https://quickchart.io/qr?text=${encodeURIComponent(value)}&size=${size * 3}&margin=1&ecLevel=M`;
  return (
    <div className="inline-flex flex-col items-center gap-1.5 bg-white p-2 rounded-lg shadow-sm ring-1 ring-zinc-200">
      <img src={src} alt="QR vérification" width={size} height={size} className="block" />
      {label && (
        <span className="text-[8px] tracking-[0.15em] text-zinc-500 font-semibold uppercase">{label}</span>
      )}
    </div>
  );
}