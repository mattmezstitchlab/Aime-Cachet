import React from "react";

/**
 * Icône Assistant AIME — logo 5♥7 avec cœur qui bat.
 * Signature visuelle du système intermittence.
 */
export default function AssistantIcon({ className = "w-4 h-4", beating = true }) {
  return (
    <svg
      viewBox="0 0 32 16"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="AIME 507"
    >
      {/* 5 */}
      <text
        x="2"
        y="13"
        fontSize="14"
        fontWeight="900"
        fontFamily="Inter, system-ui, sans-serif"
        fill="currentColor"
        letterSpacing="-0.5"
      >
        5
      </text>
      {/* Cœur central (bat) */}
      <g
        transform="translate(16 8)"
        style={{
          transformBox: "fill-box",
          transformOrigin: "center",
          animation: beating ? "aimeBeat 1.2s ease-in-out infinite" : "none",
        }}
      >
        <path
          d="M0 3.2 C -2.8 0.4, -4.8 -2.4, -2.4 -4.4 C -1.2 -5.4, 0 -4.4, 0 -3 C 0 -4.4, 1.2 -5.4, 2.4 -4.4 C 4.8 -2.4, 2.8 0.4, 0 3.2 Z"
          fill="hsl(var(--aime-red))"
        />
      </g>
      {/* 7 */}
      <text
        x="22"
        y="13"
        fontSize="14"
        fontWeight="900"
        fontFamily="Inter, system-ui, sans-serif"
        fill="currentColor"
        letterSpacing="-0.5"
      >
        7
      </text>
      <style>
        {`@keyframes aimeBeat {
          0%, 100% { transform: scale(1); }
          15% { transform: scale(1.25); }
          30% { transform: scale(1); }
          45% { transform: scale(1.15); }
          60% { transform: scale(1); }
        }`}
      </style>
    </svg>
  );
}