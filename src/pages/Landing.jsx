import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Zap, FileCheck, LayoutGrid, Files, Gauge, Sparkles } from "lucide-react";
import LandingAssistantDemo from "@/components/landing/LandingAssistantDemo";
import MiniMachine from "@/components/landing/MiniMachine";
import RuneyShowcase from "@/components/landing/RuneyShowcase";
import SideRail from "@/components/aime/SideRail";

const HERO_BG = "https://media.base44.com/images/public/6a0dd8978ba6b186fc2a32c5/14b7e1600_image.png";
const FEATURES_BG = "https://media.base44.com/images/public/6a0dd8978ba6b186fc2a32c5/cb0ccb64a_pexels-cottonbro-7170696.jpg";
import {
  SHOTS_ASSISTANT,
  SHOTS_TIMELINE,
  SHOTS_FICHES,
  SHOTS_COCKPIT,
} from "@/components/landing/landingShots";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans antialiased overflow-x-hidden">
      <SideRail mode="landing" />

      <div className="lg:pl-24">
      {/* NAV — plus claire, logo agrandi */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-5 md:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-baseline gap-2 group">
            <span className="font-display font-black text-3xl md:text-[34px] tracking-tight text-zinc-900">
              AIME<span className="text-aime-red">®</span>
            </span>
            <span className="text-[11px] tracking-[0.28em] text-zinc-400 font-semibold group-hover:text-zinc-600 transition-colors">
              507
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/screens"
              className="inline-flex items-center gap-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-sm font-medium px-4 py-2 rounded-full transition-colors"
            >
              Tous les écrans
            </Link>
            <Link
              to="/prestations"
              className="inline-flex items-center gap-1.5 bg-zinc-900 hover:bg-black text-white text-sm font-medium px-4 py-2 rounded-full transition-colors"
            >
              Entrer dans l'app
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* BLOC PARALLAX : Hero + Showcase sur fond image fixe */}
      <div className="relative">
        {/* Fond fixe parallax */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${HERO_BG}')`,
            backgroundAttachment: "fixed",
          }}
          aria-hidden="true"
        />
        {/* Voile sombre léger pour lisibilité du texte blanc */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/65"
          aria-hidden="true"
        />

        <div className="relative">
      {/* HERO — texte centré, astronaute visible en fond */}
      <section id="hero" className="scroll-mt-24 max-w-3xl mx-auto px-5 md:px-8 pt-16 md:pt-28 pb-20 md:pb-28 text-center">
        <div>
          <div className="inline-block text-[10px] tracking-[0.22em] text-aime-red font-semibold mb-4">
            POUR INTERMITTENTS DU SPECTACLE
          </div>
          <h1 className="font-display font-black text-4xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight mb-5 text-white drop-shadow-lg">
            Vos 507 heures,<br />
            <span className="text-aime-red">en clair.</span>
          </h1>
          <p className="text-base md:text-lg text-white/90 leading-relaxed mb-8 max-w-xl mx-auto drop-shadow">
            AIME prépare vos fiches cachet, suit votre progression vers les
            507h, et garde une trace technique scellée de chaque prestation.
            Outil préparatoire — les organismes restent seuls compétents.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/prestations"
              className="inline-flex items-center gap-2 bg-aime-red hover:bg-aime-red/90 text-white font-medium px-5 py-3 rounded-full transition-colors"
            >
              Commencer gratuitement
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/espace#pilotage507"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/30 text-white font-medium px-5 py-3 rounded-full transition-colors"
            >
              Voir le pilotage 507
            </Link>
          </div>
        </div>
      </section>

      {/* VITRINE PRINCIPALE — style Runey, en haut */}
      <div id="timeline" className="scroll-mt-24" />
      <RuneyShowcase
        eyebrow="FICHES · DEVIS · TAMPONS"
        title={<>Tout votre intermittence,<br />au même endroit.</>}
        subtitle="Créez des fiches cachet et devis impeccables, personnalisez tampons et apparence, suivez vos 507 heures et gardez une trace technique sceellée de chaque prestation."
        cta={
          <>
            <Link
              to="/prestations"
              className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-black text-white font-medium px-5 py-3 rounded-full transition-colors"
            >
              Commencer gratuitement
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/espace#pilotage507"
              className="inline-flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-medium px-5 py-3 rounded-full transition-colors"
            >
              Voir le pilotage 507
            </Link>
          </>
        }
        tabs={[
          { key: "fiches", label: "Fiches & Devis", shots: SHOTS_FICHES },
          { key: "timeline", label: "Timeline", shots: SHOTS_TIMELINE },
          { key: "cockpit", label: "Cockpit 507", shots: SHOTS_COCKPIT },
          { key: "assistant", label: "Assistant", shots: SHOTS_ASSISTANT },
        ]}
        sideExtra={
          <MiniMachine
            headline="412 / 507h"
            caption="Annexe 8 · Artiste"
            note="80% atteints, 95h restantes."
          />
        }
        transparent
      />
        </div>
      </div>
      {/* /BLOC PARALLAX */}

      <section className="border-t border-zinc-100 bg-[#F6F4F1]">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-10 md:py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <div className="text-[10px] tracking-[0.22em] text-aime-red font-semibold mb-2">
              BOARD PRODUIT
            </div>
            <h2 className="font-display font-black text-2xl md:text-3xl tracking-tight">
              Une vue type Figma pour revoir tous les écrans.
            </h2>
            <p className="mt-2 text-sm md:text-base text-zinc-600 max-w-2xl leading-relaxed">
              Pratique pour faire le tri, repérer les doublons et valider ce qui doit rester sur la landing.
            </p>
          </div>
          <Link
            to="/screens"
            className="inline-flex items-center gap-2 self-start md:self-auto bg-zinc-900 hover:bg-black text-white font-medium px-5 py-3 rounded-full transition-colors"
          >
            Ouvrir le board
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* DÉMO ASSISTANT — clone interactif */}
      <section id="assistant" className="scroll-mt-24">
        <LandingAssistantDemo />
      </section>

      {/* FEATURES — sur fond visuel astronautes */}
      <section id="studio" className="relative overflow-hidden scroll-mt-24">
        {/* Fond visuel astronautes parallax */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${FEATURES_BG}')`,
            backgroundAttachment: "fixed",
          }}
          aria-hidden="true"
        />
        {/* Voile sombre pour lisibilité */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"
          aria-hidden="true"
        />
        <div className="relative max-w-6xl mx-auto px-5 md:px-8 py-16 md:py-20">
          <div className="text-center mb-12">
            <div className="text-[10px] tracking-[0.22em] text-aime-red font-semibold mb-3 drop-shadow">
              CE QUE FAIT AIME
            </div>
            <h2 className="font-display font-black text-3xl md:text-4xl tracking-tight text-white drop-shadow-lg">
              Préparer. Suivre. Archiver.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <Feature
              icon={FileCheck}
              title="Fiches cachet"
              text="Génération PDF prête à transmettre, code unique AIME-CCH, signature et tampon."
            />
            <Feature
              icon={Zap}
              title="Suivi 507h en direct"
              text="Heures validées, en cours, restantes. Projection sur 12 mois glissants."
            />
            <Feature
              icon={Shield}
              title="Scellement technique"
              text="Empreinte SHA-256 + horodatage. Vérifiable via QR code par tiers."
            />
          </div>
        </div>
      </section>

      <section className="bg-white border-t border-zinc-100">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-14 md:py-16">
          <div className="max-w-2xl mb-8">
            <div className="text-[10px] tracking-[0.22em] text-aime-red font-semibold mb-3">
              RACCOURCIS
            </div>
            <h2 className="font-display font-black text-3xl md:text-4xl tracking-tight text-zinc-900">
              Une landing qui peut se suffire à elle-même.
            </h2>
            <p className="mt-3 text-zinc-600 leading-relaxed">
              Si quelqu'un ne veut pas tout explorer tout de suite, il peut déjà comprendre les grands blocs du produit et entrer directement là où il a besoin.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <ShortcutCard
              to="/prestations"
              icon={Sparkles}
              title="Timeline"
              text="Entrée principale pour voir, reprendre et suivre vos prestations au quotidien."
              cta="Ouvrir"
            />
            <ShortcutCard
              to="/fiches"
              icon={Files}
              title="Mes fiches"
              text="Accès direct au rangement, aux statuts et aux documents en cours."
              cta="Voir les fiches"
            />
            <ShortcutCard
              to="/espace#pilotage507"
              icon={Gauge}
              title="Pilotage 507"
              text="Vue synthétique des heures, du reste à faire et des projections dans Mon espace."
              cta="Voir le pilotage"
            />
            <ShortcutCard
              to="/screens"
              icon={LayoutGrid}
              title="Board écrans"
              text="Planche visuelle pour auditer l'existant et repérer les doublons."
              cta="Ouvrir le board"
            />
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-black text-white">
        <div className="max-w-4xl mx-auto px-5 md:px-8 py-16 md:py-20 text-center">
          <h2 className="font-display font-black text-3xl md:text-5xl tracking-tight mb-4">
            Prêt à reprendre la main<br />sur vos 507 heures ?
          </h2>
          <p className="text-zinc-400 mb-7 max-w-xl mx-auto">
            Gratuit pour démarrer. Aucune donnée transmise aux organismes.
          </p>
          <Link
            to="/prestations"
            className="inline-flex items-center gap-2 bg-aime-red hover:bg-aime-red/90 text-white font-medium px-6 py-3 rounded-full transition-colors"
          >
            Ouvrir AIME
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-100 py-10">
        <div className="max-w-6xl mx-auto px-5 md:px-8 text-center text-xs text-zinc-500 leading-relaxed">
          AIME® est un outil préparatoire privé. Les organismes officiels (GUSO,
          France Travail, Audiens, Urssaf, Unédic) restent seuls compétents pour
          confirmer droits, déclarations et validations.
          <div className="mt-2 text-zinc-400">
            © {new Date().getFullYear()} AIME — Tous droits réservés.
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}

function Feature({ icon: Icon, title, text }) {
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
      <div className="text-white mb-4">
        <Icon className="w-7 h-7" strokeWidth={1.5} />
      </div>
      <h3 className="font-display font-bold text-lg mb-2 text-white">{title}</h3>
      <p className="text-sm text-white/80 leading-relaxed">{text}</p>
    </div>
  );
}

function ShortcutCard({ to, icon: Icon, title, text, cta }) {
  return (
    <Link
      to={to}
      className="group rounded-3xl border border-zinc-200 bg-zinc-50 p-5 hover:bg-white hover:border-zinc-300 transition-colors"
    >
      <div className="w-11 h-11 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center text-aime-red mb-4 group-hover:border-zinc-300 transition-colors">
        <Icon className="w-5 h-5" strokeWidth={1.8} />
      </div>
      <h3 className="font-display font-bold text-xl tracking-tight text-zinc-900">
        {title}
      </h3>
      <p className="mt-2 text-sm text-zinc-600 leading-relaxed min-h-[66px]">
        {text}
      </p>
      <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-zinc-900">
        {cta}
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}