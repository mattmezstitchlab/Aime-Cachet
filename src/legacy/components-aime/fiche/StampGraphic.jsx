import React from "react";

// Tampon encre rond — composant partagé entre tous les types de documents.
// Adaptatif au thème : sur fond sombre, encre claire et halo invisible.
export default function StampGraphic({ stamp, theme = "light" }) {
  if (!stamp) return null;
  const isDark = theme === "dark";

  let color = stamp.color || "#c0392b";
  if (isDark) {
    const lightInk = {
      "#c0392b": "#ff6b6b",
      "#1e40af": "#60a5fa",
      "#1a1a1a": "#f5f5f5",
      "#6b21a8": "#c084fc",
    };
    color = lightInk[color] || color;
  }
  const innerHalo = isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.4)";
  const innerBg = isDark ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.05)";

  return (
    <div
      className="relative flex flex-col items-center justify-center font-bold"
      style={{
        width: 180,
        height: 180,
        border: `4px solid ${color}`,
        borderRadius: "50%",
        color,
        opacity: 0.88,
        boxShadow: `inset 0 0 0 6px ${innerHalo}`,
        background: innerBg,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 10,
          border: `2px solid ${color}`,
          borderRadius: "50%",
          opacity: 0.6,
        }}
      />
      <div className="text-[10px] tracking-[0.3em] uppercase mt-3">{stamp.topText || "AIME · CACHET"}</div>
      <div className="font-display text-2xl leading-none my-2 px-3 text-center">{stamp.mainText || "VÉRIFIÉ"}</div>
      <div className="text-[9px] tracking-wider">{stamp.dateText}</div>
      <div className="text-[7px] tracking-wider mt-1 opacity-80">{stamp.codeText}</div>
    </div>
  );
}