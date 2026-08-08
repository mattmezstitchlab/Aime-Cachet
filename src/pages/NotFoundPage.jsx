import React from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] text-[var(--color-text-primary)] overflow-x-hidden">
      <div className="mx-auto max-w-[1120px] px-5 py-24 md:px-8 lg:px-10">
        <div className="rounded-[38px] overflow-hidden bg-black text-white p-8 md:p-10 shadow-[0_24px_70px_rgba(0,0,0,0.12)]">
          <div className="aime-kicker">404 · page introuvable</div>
          <h1 className="mt-6 font-display text-[3rem] md:text-[4.6rem] leading-[0.92] text-white">Cette page n’existe pas dans l’univers AIME.</h1>
          <p className="mt-5 max-w-2xl text-sm md:text-base text-white/70 leading-relaxed">La route demandée ne correspond à aucune maison visible. Revenez au point d’entrée principal ou explorez les univers.</p>
          <div className="mt-8 flex flex-wrap gap-2.5">
            <Link to="/" className="rounded-full bg-white px-5 py-3 text-sm text-black hover:bg-zinc-100">Retour landing</Link>
            <Link to="/point-zero" className="rounded-full border border-white/14 bg-white/[0.06] px-5 py-3 text-sm text-white hover:bg-white/[0.1]">Aller au cockpit</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
