import React from "react";
import { Link } from "react-router-dom";

function initials(value = "A") {
  return value
    .split(/\s|&/)
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase())
    .join("") || "A";
}

export default function WeddingWorkspaceTopBar({
  items = [],
  active = "",
  names = "Sophie & Thomas",
  brand = "AIME",
  suffix = "WEDDING",
  avatarImage = "/landing/hero-aime-wedding.jpg",
  rightContent = null,
}) {
  return (
    <header className="rounded-[22px] border border-black/6 bg-white shadow-[0_12px_32px_rgba(12,12,12,0.04)] overflow-hidden">
      <div className="px-6 md:px-10 py-6 border-b border-black/8 flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-display text-[2rem] leading-none text-zinc-950">{brand}</Link>
          <span className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">{suffix}</span>
        </div>

        <nav className="hidden md:flex items-center gap-10 text-[15px] text-zinc-800">
          {items.map((item) => (
            <Link key={item.id} to={item.to} className={`relative ${active === item.id ? "font-medium text-zinc-950" : "text-zinc-700"}`}>
              {item.label}
              {active === item.id && <span className="absolute left-1/2 -translate-x-1/2 -bottom-4 h-[2px] w-8 rounded-full bg-black" />}
            </Link>
          ))}
        </nav>

        {rightContent ? (
          rightContent
        ) : (
          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-[15px] text-zinc-600">{names}</span>
            {avatarImage ? (
              <img src={avatarImage} alt={names} className="h-12 w-12 rounded-full object-cover" />
            ) : (
              <div className="h-12 w-12 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold">
                {initials(names)}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
