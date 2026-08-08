import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Flower2 } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#efefeb] overflow-hidden text-[var(--color-text-primary)]">
      <div className="min-h-screen p-2 md:p-6">
        <div className="mx-auto min-h-[calc(100vh-16px)] md:min-h-[calc(100vh-48px)] max-w-[1600px] rounded-[24px] bg-white shadow-[0_24px_70px_rgba(0,0,0,0.05)] px-6 md:px-10 lg:px-16 py-10 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-3">
            <Link to="/" className="font-display text-[2rem] leading-none text-zinc-950">AIME</Link>
            <span className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Wedding</span>
          </div>

          <div className="mt-16 font-display text-[6rem] md:text-[9rem] leading-none text-zinc-950">404</div>
          <h1 className="mt-6 font-display text-[2.3rem] md:text-[3.4rem] leading-[1] text-zinc-950">Cette page s'est perdue en chemin vers l'autel.</h1>
          <p className="mt-5 max-w-2xl text-[16px] text-zinc-600 leading-relaxed">La page que vous cherchez n'existe pas ou a été déplacée.</p>

          <Link to="/" className="mt-8 rounded-full bg-black px-6 py-4 text-[15px] text-white hover:bg-zinc-800 inline-flex items-center gap-2">
            Retour à l'accueil
            <ArrowRight className="h-4 w-4" />
          </Link>

          <div className="mt-12 flex flex-col items-center gap-3 text-[#c3ab82]">
            <Flower2 className="h-7 w-7" />
            <span className="h-px w-14 bg-[#e7d9c1]" />
          </div>
        </div>
      </div>
    </div>
  );
}
