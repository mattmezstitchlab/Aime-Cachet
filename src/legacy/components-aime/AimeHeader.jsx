import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Search, Bell } from "lucide-react";
import { base44 } from "@/api/base44Client";
import SearchDialog from "@/components/aime/SearchDialog";

export default function AimeHeader({ onPrepare, minimal = false, simulator = null }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const initial = (user?.full_name || user?.email || "?").trim().charAt(0).toUpperCase();

  if (minimal) return null;

  return (
    <header className="sticky top-0 z-40">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-5 md:px-10 h-16 flex items-center gap-4 md:gap-6">
        {/* Logo → retour landing */}
        <Link to="/" className="flex items-baseline gap-1 leading-none rounded-sm shrink-0 hover:opacity-80 transition-opacity" aria-label="Retour à l'accueil">
          <span className="font-display text-xl tracking-tight text-zinc-900">AIME</span>
          <span className="text-[10px] text-aime-red font-semibold align-super">®</span>
        </Link>

        <div className="flex-1" />

        {/* Actions droite */}
        <div className="hidden md:flex items-center gap-1 shrink-0">
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Recherche rapide"
            title="Recherche rapide (overlay)"
            className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate("/notifications")}
            aria-label="Notifications"
            title="Centre de notifications"
            className="relative w-9 h-9 rounded-full flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-aime-red" />
          </button>
          <button
            onClick={() => navigate("/profil")}
            aria-label="Mon profil"
            title="Mon profil"
            className="ml-1 w-9 h-9 rounded-full bg-zinc-900 text-white text-[12px] font-semibold flex items-center justify-center hover:ring-2 hover:ring-zinc-200 transition-all"
          >
            {initial}
          </button>
        </div>

        <button
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
          className="md:hidden w-11 h-11 text-zinc-900 rounded-full ml-auto flex items-center justify-center bg-white/80 border border-zinc-100"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>



      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />

      {mobileOpen && (
        <div className="md:hidden border-t border-zinc-200 bg-white/95 backdrop-blur-xl">
          <nav className="px-5 py-4 flex flex-col gap-2">
            <button
              onClick={() => { setMobileOpen(false); setSearchOpen(true); }}
              className="inline-flex items-center justify-center gap-2 bg-zinc-100 text-zinc-900 text-sm font-medium px-5 py-3 rounded-full transition-colors"
            >
              <Search className="w-4 h-4" /> Recherche
            </button>
            <Link to="/notifications" onClick={() => setMobileOpen(false)} className="inline-flex items-center justify-center gap-2 bg-zinc-50 text-zinc-900 text-sm font-medium px-5 py-3 rounded-full">
              <Bell className="w-4 h-4" /> Notifications
            </Link>
            <Link to="/profil" onClick={() => setMobileOpen(false)} className="inline-flex items-center justify-center gap-2 bg-zinc-50 text-zinc-900 text-sm font-medium px-5 py-3 rounded-full">
              Mon profil
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

function Stat({ label, value, accent, compact }) {
  return (
    <div className="flex items-baseline gap-1">
      <span className={`font-display ${compact ? "text-base" : "text-xl lg:text-2xl"} leading-none tabular-nums ${accent ? "text-aime-red" : "text-zinc-900"}`}>
        {value}
      </span>
      <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-medium">{label}</span>
    </div>
  );
}