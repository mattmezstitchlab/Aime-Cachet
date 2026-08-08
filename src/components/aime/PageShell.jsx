import React from "react";
import SideRail from "@/components/aime/SideRail";
import AimeFooter from "@/components/aime/AimeFooter";
import GlobalToolbar from "@/components/aime/GlobalToolbar";

/**
 * Coquille standard pour les pages secondaires AIME Cachet
 * (recherche, notifications, profil, aide, paramètres).
 * Inclut SideRail à gauche, header sobre, container, footer.
 */
export default function PageShell({ title, subtitle, children, eyebrow }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SideRail />
      <GlobalToolbar back="/prestations" />
      <div className="lg:pl-16">
        <main className="max-w-[1100px] mx-auto px-4 sm:px-5 md:px-10 pt-20 md:pt-24 pb-24 md:pb-12 overflow-x-hidden">
          {eyebrow && (
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-aime-red/10 text-aime-red text-[10px] tracking-[0.2em] font-semibold uppercase mb-3">
              {eyebrow}
            </div>
          )}
          {title && <h1 className="font-display text-3xl md:text-4xl text-foreground leading-tight break-words">{title}</h1>}
          {subtitle && <p className="mt-2 text-sm text-muted-foreground max-w-2xl leading-relaxed">{subtitle}</p>}

          <div className="mt-8">{children}</div>
        </main>

        <AimeFooter />
      </div>
    </div>
  );
}