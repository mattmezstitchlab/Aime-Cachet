import React from "react";

export default function AimeFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-12 grid md:grid-cols-3 gap-8 items-start">
        <div className="flex items-baseline gap-2 leading-none">
          <span className="font-display text-xl tracking-tight text-foreground">AIME</span>
          <span className="text-aime-red text-xl">®</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed md:col-span-1">
          AIME prépare. L'utilisateur vérifie. L'organisme officiel valide.
        </p>
        <div className="flex flex-wrap gap-4 md:justify-end text-xs text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">Mentions légales</a>
          <a href="#" className="hover:text-foreground transition-colors">Confidentialité</a>
          <a href="#" className="hover:text-foreground transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}