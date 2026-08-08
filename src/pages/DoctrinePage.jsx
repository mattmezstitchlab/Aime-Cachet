import React from "react";
import { Link } from "react-router-dom";
import MarketingShell from "@/components/aime/MarketingShell";
import { UNIVERSES } from "@/lib/aimeUniverses";

const RULES = [
  ["01", "Une information, une maison", "Aucune donnée n'est dupliquée. Un prestataire appartient à l'univers Hermès, le plan de table s'y réfère sans recréer de fiche."],
  ["02", "Contexte, pas copie", "Si un outil a besoin d'une information extérieure, il l'affiche dynamiquement en lecture seule sans possibilité d'édition directe."],
  ["03", "Timeline transversale", "Chaque action datée dans n'importe quel univers se synchronise automatiquement dans la timeline centrale d'Athéna."],
  ["04", "3 clics maximum", "Aucun écran utile ne doit nécessiter plus de 3 clics depuis l'Olympe (tableau de bord central)."],
  ["05", "Pas de pages orphelines", "Chaque écran appartient obligatoirement à l'un des 12 univers fonctionnels."],
];

const TOKENS = [
  ["Typography", "Utilisation exclusive de polices sans-serif géométriques. Hiérarchie stricte du H1 au Body pour les données techniques."],
  ["Palette", "Domination absolue du blanc et des gris chauds. Les couleurs sont réservées aux indicateurs de statut et univers des Dieux."],
  ["Principes", "L'esthétique sert la lisibilité. Pas d'ornement inutile, le raffinement naît de la précision des alignements et des vides."],
];

export default function DoctrinePage() {
  return (
    <MarketingShell ctaLabel="Contacter l'auteur" ctaTo="/a-propos">
      <section className="px-6 md:px-10 lg:px-16 py-16 md:py-20">
        <div className="max-w-[980px]">
          <div className="text-[12px] uppercase tracking-[0.18em] text-zinc-500">Source de vérité graphique · AIME® / AIME Wedding</div>
          <h1 className="mt-6 font-display text-[3.4rem] md:text-[5.2rem] leading-[0.94] text-zinc-950">La doctrine produit AIME®</h1>
          <p className="mt-6 text-[19px] text-zinc-600 leading-relaxed">Ce document présente l'architecture produit, le système de navigation et les principes de conception de la plateforme AIME Wedding — une approche systémique du mariage articulée autour de 12 univers fonctionnels et 4 visions utilisateur.</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <div className="rounded-[18px] border border-black/8 bg-white px-6 py-4 text-[1.4rem] font-display text-zinc-950">12 <span className="font-sans text-sm text-zinc-500">Univers fonctionnels</span></div>
            <div className="rounded-[18px] border border-black/8 bg-white px-6 py-4 text-[1.4rem] font-display text-zinc-950">4 <span className="font-sans text-sm text-zinc-500">Modes utilisateur</span></div>
            <div className="rounded-[18px] border border-black/8 bg-white px-6 py-4 text-[1.4rem] font-display text-zinc-950">5 <span className="font-sans text-sm text-zinc-500">Règles strictes</span></div>
            <div className="rounded-[18px] border border-black/8 bg-white px-6 py-4 text-[1.4rem] font-display text-zinc-950">1 <span className="font-sans text-sm text-zinc-500">Doctrine unique</span></div>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/mode-emploi" className="rounded-full bg-black px-6 py-4 text-sm uppercase tracking-[0.08em] text-white hover:bg-zinc-800">Lire la doctrine →</Link>
            <Link to="/design-system" className="rounded-full border border-black/14 bg-white px-6 py-4 text-sm uppercase tracking-[0.08em] text-zinc-800 hover:bg-black/[0.03]">Voir le design system →</Link>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 lg:px-16 py-16 border-t border-black/6 grid gap-12 lg:grid-cols-[0.95fr_1.05fr] items-start">
        <div>
          <div className="text-[12px] uppercase tracking-[0.18em] text-zinc-500">01 · Constat</div>
          <h2 className="mt-6 font-display text-[3rem] md:text-[4.2rem] leading-[0.98] text-zinc-950">Un mariage, c'est 12 métiers en même temps.</h2>
          <p className="mt-6 text-[18px] text-zinc-600 leading-relaxed">La planification d'un mariage haut de gamme souffre d'une fragmentation extrême. Les mariés et leurs planificateurs jonglent en permanence entre une dizaine d'outils non interconnectés. Les informations sont dupliquées, obsolètes ou perdues dans des flux de discussion informels.</p>
          <p className="mt-6 text-[18px] text-zinc-600 leading-relaxed">La charge mentale s'accroît à mesure que le jour J approche. AIME Wedding unifie ces dimensions au sein d'une structure logique rigoureuse, éliminant le chaos informationnel par le design.</p>
        </div>
        <div className="rounded-[28px] bg-[#111111] text-white p-8 shadow-[0_18px_48px_rgba(0,0,0,0.12)]">
          <div className="text-[12px] uppercase tracking-[0.18em] text-white/45">Fragments hors-plateforme</div>
          <div className="mt-6 space-y-4">
            {[
              ["WhatsApp", "Discussions & urgences prestataires", "Perte d'historique"],
              ["Excel / Sheets", "Budget, listes invités & adresses", "Saisie manuelle complexe"],
              ["Pinterest", "Inspiration visuelle & moodboards", "Déconnecté de la réalité"],
              ["E-mails", "Devis, contrats, relances infinies", "Asynchronisme lourd"],
              ["Drive / Dropbox", "Plans de table, briefs, pièces", "Accès difficile sur mobile"],
            ].map(([title, text, issue]) => (
              <div key={title} className="rounded-[18px] border border-white/8 bg-white/[0.05] px-5 py-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-semibold text-white">{title}</div>
                    <div className="mt-1 text-sm text-white/62">{text}</div>
                  </div>
                  <div className="text-[11px] uppercase tracking-[0.16em] text-[#d87b82]">{issue}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 lg:px-16 py-16 border-t border-black/6">
        <div className="text-[12px] uppercase tracking-[0.18em] text-zinc-500">03 · Système</div>
        <h2 className="mt-6 font-display text-[3rem] md:text-[4.2rem] text-zinc-950">L'Olympe du mariage</h2>
        <p className="mt-5 max-w-5xl text-[18px] text-zinc-600 leading-relaxed">Pour structurer l'intégralité du cycle de vie d'un mariage haut de gamme, le système est découpé en 12 univers fonctionnels interdépendants, chacun piloté par une entité logique.</p>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {UNIVERSES.map((universe) => (
            <div key={universe.id} className="rounded-[22px] border border-black/8 bg-white p-6 shadow-[0_10px_28px_rgba(12,12,12,0.03)]">
              <div className="font-display text-[2rem] text-zinc-950">{universe.label}</div>
              <div className="mt-2 text-[11px] uppercase tracking-[0.16em] text-zinc-500">{universe.subtitle}</div>
              <div className="mt-4 text-[16px] text-zinc-600 leading-relaxed">{universe.visualHook}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#111111] text-white px-6 md:px-10 lg:px-16 py-16 border-t border-black/6">
        <div className="text-[12px] uppercase tracking-[0.18em] text-white/45">04 · Modes</div>
        <h2 className="mt-6 font-display text-[3rem] md:text-[4.2rem]">4 profils. 4 visions. 1 système.</h2>
        <p className="mt-5 max-w-5xl text-[18px] text-white/72 leading-relaxed">Pour une même base de données, la plateforme adapte l'interface selon le rôle de l'utilisateur. Chacun dispose de sa propre clé d'accès et d'action.</p>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["Mariés", "Ils pilotent", "Vue globale, validation des budgets, validation esthétique."],
            ["Invités", "Ils participent", "Accès RSVP, hébergement, programme personnalisé, partage photo."],
            ["Prestataires", "Ils exécutent", "Cahier des charges technique, timing précis, accès livrables."],
            ["Planner", "Il orchestre", "Supervision complète, gestion des droits, flux financiers, pivots."],
          ].map(([label, title, text]) => (
            <div key={label} className="rounded-[22px] border border-white/10 bg-white/[0.04] p-6">
              <div className="text-[11px] uppercase tracking-[0.16em] text-white/45">{label}</div>
              <div className="mt-4 font-display text-[2rem] text-white">{title}</div>
              <div className="mt-4 text-[16px] text-white/70 leading-relaxed">{text}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-10 lg:px-16 py-16 border-t border-black/6">
        <div className="text-[12px] uppercase tracking-[0.18em] text-zinc-500">05 · Architecture</div>
        <h2 className="mt-6 font-display text-[3rem] md:text-[4.2rem] text-zinc-950">L'architecture à 4 niveaux</h2>
        <p className="mt-5 max-w-5xl text-[18px] text-zinc-600 leading-relaxed">La navigation est conçue pour éviter toute sensation de perdition. L'accès à n'importe quel outil s'effectue en maximum 3 clics à partir de la racine.</p>
        <div className="mt-10 grid gap-4 md:grid-cols-4 items-center">
          {[
            ["Niveau 01", "Portail", "Landing & Connexion"],
            ["Niveau 02", "Olympe", "Dashboard Général"],
            ["Niveau 03", "Page Dieu", "Univers Fonctionnel"],
            ["Niveau 04", "Outil", "Action & Contenu"],
          ].map(([label, title, text], index) => (
            <React.Fragment key={title}>
              <div className="rounded-[22px] border border-black/8 bg-white p-6 shadow-[0_10px_28px_rgba(12,12,12,0.03)]">
                <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">{label}</div>
                <div className="mt-3 font-display text-[2rem] text-zinc-950">{title}</div>
                <div className="mt-3 text-[16px] text-zinc-600">{text}</div>
              </div>
              {index < 3 && <div className="hidden md:flex justify-center text-zinc-400 text-2xl">›</div>}
            </React.Fragment>
          ))}
        </div>
        <div className="mt-8 rounded-[18px] bg-[#e8eefc] px-6 py-5 text-[#4567aa] text-[16px]">Profondeur maximum : 3 clics. Aucun sentiment d'impasse ou d'égarement.</div>
      </section>

      <section className="px-6 md:px-10 lg:px-16 py-16 border-t border-black/6 grid gap-12 lg:grid-cols-[0.95fr_1.05fr] items-start">
        <div>
          <div className="text-[12px] uppercase tracking-[0.18em] text-zinc-500">06 · Navigation</div>
          <h2 className="mt-6 font-display text-[3rem] md:text-[4.2rem] text-zinc-950">La navigation par intention</h2>
          <p className="mt-5 text-[18px] text-zinc-600 leading-relaxed">Au lieu de forcer l'utilisateur à parcourir un menu classique arborescent, AIME propose un Smart Menu articulé autour de l'intention de l'utilisateur à l'instant T : "Qu'êtes-vous en train de faire ?"</p>
          <p className="mt-5 text-[18px] text-zinc-600 leading-relaxed">Ce menu dynamique filtre instantanément les 12 univers pour ne présenter que les raccourcis pertinents à l'activité courante, réduisant drastiquement le bruit à l'écran.</p>
        </div>
        <div className="rounded-[24px] bg-[#111111] text-white p-8 shadow-[0_18px_48px_rgba(0,0,0,0.12)]">
          <div className="text-[12px] uppercase tracking-[0.18em] text-white/45">Smart menu interactif</div>
          <div className="mt-4 text-white/72">Je souhaite...</div>
          <div className="mt-6 space-y-3">
            {[
              ["Vérifier le timing du jour J", "Arès / Logistique"],
              ["Mettre à jour le plan de table", "Hestia / RSVP"],
              ["Consulter la charte de couleurs", "Aphrodite / Esthétique"],
            ].map(([label, tag]) => (
              <div key={label} className="rounded-[16px] border border-[#c6a866] bg-white/[0.04] px-5 py-4 flex items-center justify-between gap-4">
                <span>{label}</span>
                <span className="text-sm text-white/52">{tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 lg:px-16 py-16 bg-[#eef3ff] border-t border-black/6">
        <div className="text-[12px] uppercase tracking-[0.18em] text-zinc-500">07 · Règles</div>
        <h2 className="mt-6 font-display text-[3rem] md:text-[4.2rem] text-zinc-950">Les règles de la doctrine</h2>
        <p className="mt-5 max-w-5xl text-[18px] text-zinc-600 leading-relaxed">Pour assurer l'évolutivité et la cohérence de l'écosystème, 5 lois fondamentales s'imposent à tout ajout de fonctionnalité.</p>
        <div className="mt-10 space-y-4">
          {RULES.map(([number, title, text]) => (
            <div key={number} className="rounded-[20px] border border-black/6 bg-white px-6 py-6 grid gap-6 md:grid-cols-[70px_1fr] items-start shadow-[0_10px_28px_rgba(12,12,12,0.03)]">
              <div className="font-display text-[2.2rem] text-[#a9b3d1]">{number}</div>
              <div>
                <div className="font-semibold text-[1.6rem] text-zinc-950">{title}</div>
                <div className="mt-2 text-[16px] text-zinc-600 leading-relaxed">{text}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#111111] text-white px-6 md:px-10 lg:px-16 py-16 border-t border-black/6">
        <div className="text-[12px] uppercase tracking-[0.18em] text-white/45">08 · Identité</div>
        <h2 className="mt-6 font-display text-[3rem] md:text-[4.2rem]">Le langage visuel</h2>
        <p className="mt-5 max-w-5xl text-[18px] text-white/72 leading-relaxed">Un système d'excellence s'appuie sur une charte stricte pour garantir l'uniformité de l'expérience à travers les 12 univers.</p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {TOKENS.map(([title, text]) => (
            <div key={title} className="rounded-[22px] border border-white/10 bg-white/[0.05] p-8">
              <div className="font-display text-[2rem] text-white">{title}</div>
              <div className="mt-5 text-[16px] text-white/70 leading-relaxed">{text}</div>
            </div>
          ))}
        </div>
        <div className="mt-10 rounded-[22px] border border-white/10 bg-white/[0.04] p-8">
          <div className="text-[12px] uppercase tracking-[0.18em] text-white/45 mb-4">Système de tokens couleurs</div>
          <div className="grid gap-4 md:grid-cols-4 text-white/72">
            {[
              ["surface-base", "Fonds principaux", "#ffffff"],
              ["surface-elevated", "Fonds alternatifs", "#f8f8f6"],
              ["text-main", "Titres et textes importants", "#0c0c0c"],
              ["text-muted", "Légendes et kickers", "#9ca3af"],
            ].map(([label, text, color]) => (
              <div key={label} className="flex items-start gap-4">
                <span className="mt-1 h-8 w-8 rounded-[8px] border border-white/12" style={{ background: color }} />
                <div>
                  <div className="font-semibold text-white">{label}</div>
                  <div className="text-sm text-white/62">{text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 lg:px-16 py-16 border-t border-black/6 grid gap-12 lg:grid-cols-[0.9fr_1.1fr] items-start">
        <div>
          <div className="text-[12px] uppercase tracking-[0.18em] text-zinc-500">09 · Auteur</div>
          <img src="/landing/athena.jpg" alt="Matthieu Lecointre" className="mt-8 w-full max-w-[420px] rounded-[24px] object-cover shadow-[0_16px_40px_rgba(12,12,12,0.08)]" />
        </div>
        <div>
          <div className="font-display text-[3.2rem] text-zinc-950">Matthieu Lecointre</div>
          <div className="mt-3 text-[18px] text-zinc-500">Matt Mez — Créateur & architecte produit</div>
          <p className="mt-8 text-[18px] text-zinc-600 leading-relaxed">Fort de plusieurs années d'expérience dans l'architecture logicielle et l'organisation d'événements d'exception, Matthieu Lecointre a développé AIME Wedding comme la réponse rationnelle à un problème émotionnel.</p>
          <p className="mt-6 text-[18px] text-zinc-600 leading-relaxed">La doctrine produit présentée ici garantit la clarté et l'excellence fonctionnelle qui font la réputation de l'écosystème.</p>
          <a href="https://ripplepatent-i4fzyzub.manus.space" target="_blank" rel="noreferrer" className="mt-8 inline-flex rounded-full border border-black/14 bg-white px-6 py-4 text-sm text-zinc-700 hover:bg-black/[0.03]">ripplepatent-i4fzyzub.manus.space</a>
        </div>
      </section>
    </MarketingShell>
  );
}
