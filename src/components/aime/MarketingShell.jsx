import React from "react";
import { Link } from "react-router-dom";

const NAV = [
  { label: "Concept", to: "/a-propos" },
  { label: "12 Univers", to: "/mode-emploi#univers" },
  { label: "FAQ", to: "/aide" },
  { label: "À Propos", to: "/a-propos" },
];

export default function MarketingShell({ children, ctaLabel = "Planifier", ctaTo = "/onboarding" }) {
  return (
    <div className="min-h-screen bg-[#efefeb] overflow-x-hidden text-[var(--color-text-primary)]">
      <div className="min-h-screen p-2 md:p-6">
        <div className="mx-auto max-w-[1600px] rounded-[24px] bg-[#fbfaf7] shadow-[0_24px_70px_rgba(0,0,0,0.05)] overflow-hidden">
          <header className="px-6 md:px-10 py-6 border-b border-black/8 flex items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Link to="/" className="font-display text-[2rem] leading-none text-zinc-950">AIME WEDDING</Link>
              <span className="text-zinc-950">•</span>
            </div>
            <nav className="hidden md:flex items-center gap-10 text-[15px] text-zinc-900">
              {NAV.map((item) => (
                <Link key={item.to + item.label} to={item.to} className="hover:text-zinc-600">{item.label}</Link>
              ))}
            </nav>
            <Link to={ctaTo} className="rounded-full bg-black px-6 py-4 text-sm text-white hover:bg-zinc-800 uppercase tracking-[0.06em]">
              {ctaLabel}
            </Link>
          </header>
          {children}
          <footer className="px-6 md:px-10 py-14 border-t border-black/8 bg-white">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr_0.9fr] items-start">
              <div>
                <div className="font-display text-[2.2rem] text-zinc-950">AIME WEDDING</div>
                <p className="mt-6 max-w-md text-zinc-600 leading-relaxed">
                  L'orchestration divine du plus beau jour de votre vie. 12 univers connectés pour un mariage sans compromis.
                </p>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500 mb-4">Découvrir</div>
                <div className="space-y-3 text-zinc-700">
                  <Link to="/mode-emploi" className="block hover:text-zinc-950">Mode d'emploi</Link>
                  <Link to="/mode-emploi#univers" className="block hover:text-zinc-950">Les 12 Dieux</Link>
                  <Link to="/compte/maries" className="block hover:text-zinc-950">Les Profils</Link>
                  <Link to="/onboarding" className="block hover:text-zinc-950">Tarifs</Link>
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500 mb-4">Support</div>
                <div className="space-y-3 text-zinc-700">
                  <Link to="/aide" className="block hover:text-zinc-950">Centre d'aide</Link>
                  <span className="block">Sécurité</span>
                  <span className="block">Confidentialité</span>
                  <Link to="/a-propos" className="block hover:text-zinc-950">Contact</Link>
                </div>
              </div>
            </div>
            <div className="mt-12 border-t border-black/8 pt-6 flex flex-wrap items-center justify-between gap-4 text-sm text-zinc-500">
              <div>© 2026 AIME WEDDING®. Tout le mariage, au bon endroit.</div>
              <div className="flex items-center gap-6">
                <span>Instagram</span>
                <span>LinkedIn</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
