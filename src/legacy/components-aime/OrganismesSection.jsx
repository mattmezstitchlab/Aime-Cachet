import React from "react";
import { Logos, ORGANISMES } from "@/components/aime/organismes/OrganismeLogos";

export default function OrganismesSection() {
  return (
    <section id="organismes" className="border-b border-zinc-200 bg-white">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-20 md:py-28">
        <div className="text-center mb-12">
          <div className="text-[11px] tracking-[0.25em] text-aime-red font-semibold uppercase">Sources officielles</div>
          <h2 className="font-display text-4xl md:text-5xl text-zinc-900 mt-3 tracking-tight">Accès rapide aux portails</h2>
          <p className="text-zinc-500 text-sm mt-4 max-w-xl mx-auto leading-relaxed">
            Ces liens permettent de vérifier les informations auprès des organismes compétents. AIME ne remplace aucun de ces services.
          </p>
        </div>

        <div className="flex justify-center">
          <div className="inline-flex items-center gap-1 bg-zinc-900 rounded-full p-2 shadow-xl flex-wrap justify-center max-w-full">
            {ORGANISMES.map((org) => (
              <a
                key={org.key}
                href={org.url}
                target="_blank"
                rel="noopener noreferrer"
                title={org.full}
                aria-label={`Ouvrir ${org.full}`}
                className="group relative w-12 h-12 rounded-full flex items-center justify-center text-white hover:bg-aime-red transition-colors"
              >
                <span className="w-5 h-5">{Logos[org.key]}</span>
                <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900 text-white text-[10px] font-medium px-2 py-1 rounded whitespace-nowrap pointer-events-none">
                  {org.label}
                </span>
              </a>
            ))}
          </div>
        </div>

        <p className="text-center text-[11px] text-zinc-400 mt-10 max-w-md mx-auto leading-relaxed">
          Pictogrammes d'identification. AIME n'est ni mandaté ni affilié à ces organismes.
        </p>
      </div>
    </section>
  );
}