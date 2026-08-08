import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Bell } from "lucide-react";
import { base44 } from "@/api/base44Client";
import SearchDialog from "@/components/aime/SearchDialog";

/**
 * Toolbar flottante globale — affichée sur toutes les pages AIME.
 * - À gauche : flèche retour (vers `back` ou "/")
 * - À droite : loupe (overlay), cloche (→ /notifications), profil (→ /profil)
 *
 * Pensée comme un calque fixed top, sans bande blanche, identique à celle
 * utilisée sur la timeline et le cockpit.
 *
 * Props :
 * - back : route de retour (par défaut "/")
 * - showBack : afficher la flèche retour (true par défaut)
 * - title / eyebrow : optionnels, affichés à côté du retour sur desktop
 */
export default function GlobalToolbar({
  back = "/",
  showBack = true,
  title,
  eyebrow,
}) {
  const [user, setUser] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const initial = (user?.full_name || user?.email || "?")
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <>
      {/* Gauche : retour + titre optionnel */}
      {(showBack || title) && (
        <div className="fixed top-3 left-3 lg:left-20 z-40 flex items-center gap-2">
          {showBack && (
            <Link
              to={back}
              aria-label="Retour"
              className="w-11 h-11 md:w-9 md:h-9 rounded-full flex items-center justify-center bg-white/90 backdrop-blur-xl border border-zinc-200 text-zinc-600 hover:text-zinc-900 shadow-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
          )}
          {(title || eyebrow) && (
            <div className="hidden md:flex items-baseline gap-2 pl-2">
              {title && (
                <span className="font-display text-base tracking-tight text-zinc-900">
                  {title}
                </span>
              )}
              {eyebrow && (
                <span className="text-[9px] tracking-[0.25em] text-aime-red font-semibold uppercase">
                  {eyebrow}
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Droite : loupe / cloche / profil */}
      <div className="fixed top-3 right-3 md:right-5 z-40 flex items-center gap-1">
        <button
          onClick={() => setSearchOpen(true)}
          aria-label="Recherche"
          title="Recherche rapide"
          className="w-11 h-11 md:w-9 md:h-9 rounded-full flex items-center justify-center bg-white/90 backdrop-blur-xl border border-zinc-200 text-zinc-600 hover:text-zinc-900 shadow-sm transition-colors"
        >
          <Search className="w-4 h-4" />
        </button>
        <Link
          to="/notifications"
          aria-label="Notifications"
          title="Centre de notifications"
          className="relative w-11 h-11 md:w-9 md:h-9 rounded-full flex items-center justify-center bg-white/90 backdrop-blur-xl border border-zinc-200 text-zinc-600 hover:text-zinc-900 shadow-sm transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-aime-red" />
        </Link>
        <Link
          to="/profil"
          aria-label="Mon espace"
          title="Mon espace"
          className="ml-1 w-11 h-11 md:w-9 md:h-9 rounded-full bg-zinc-900 text-white text-[12px] font-semibold flex items-center justify-center shadow-sm hover:ring-2 hover:ring-white/40 transition-all"
        >
          {initial}
        </Link>
      </div>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}