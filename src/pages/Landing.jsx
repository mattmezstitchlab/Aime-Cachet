import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChartColumnBig, FileText, Gauge, MessageCircleMore, Sparkles } from "lucide-react";
import SideRail from "@/components/aime/SideRail";
import { FICHE_BACKGROUNDS } from "@/lib/docTemplates";
import { SCREEN_SECTIONS } from "@/components/landing/landingShots";

const STUDIO_BG =
  FICHE_BACKGROUNDS.find((item) => item.id === "recording-studio")?.url
  || FICHE_BACKGROUNDS.find((item) => item.id === "stage-concert")?.url
  || "https://media.base44.com/images/public/6a0dd8978ba6b186fc2a32c5/14b7e1600_image.png";

const PILLARS = [
  {
    title: "Timeline vivante",
    text: "Voir l'activité, reprendre une prestation, relire les statuts et garder un axe central clair.",
    icon: ChartColumnBig,
    href: "/prestations",
  },
  {
    title: "Fiche + Studio",
    text: "Préparer le document, personnaliser l'apparence, poser un tampon, signer, générer un PDF et garder une trace technique.",
    icon: FileText,
    href: "/fiches",
  },
  {
    title: "Mon espace + Wallets",
    text: "Fusionner identité, réglages, pilotage 507 et organisation des fiches dans un seul espace de travail.",
    icon: Gauge,
    href: "/espace",
  },
  {
    title: "Agent IA 507",
    text: "Un copilote conversationnel toujours disponible pour guider, retrouver, résumer et préparer la prochaine action.",
    icon: MessageCircleMore,
    href: "/prestations",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#F6F2EC] text-zinc-900 font-sans antialiased overflow-x-hidden">
      <SideRail mode="landing" />

      <div className="lg:pl-24">
        <header className="sticky top-0 z-40 border-b border-black/5 bg-[#F6F2EC]/90 backdrop-blur-md">
          <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 md:px-8">
            <Link to="/" className="flex items-baseline gap-2 group">
              <span className="font-display text-3xl font-black tracking-tight text-zinc-950">
                AIME<span className="text-aime-red">®</span>
              </span>
              <span className="text-[11px] font-semibold tracking-[0.28em] text-zinc-400 transition-colors group-hover:text-zinc-600">
                507
              </span>
            </Link>

            <div className="flex items-center gap-2">
              <Link
                to="/cartographie"
                className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50"
              >
                Toutes les pages
              </Link>
              <Link
                to="/screens"
                className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
              >
                Tous les écrans
              </Link>
              <Link
                to="/prestations"
                className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-black"
              >
                Entrer dans l'app
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </header>

        <main>
          <section
            id="hero"
            className="relative min-h-[100svh] overflow-hidden border-b border-black/5"
          >
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url('${STUDIO_BG}')` }}
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_38%),linear-gradient(135deg,rgba(10,10,10,0.76),rgba(10,10,10,0.55)_45%,rgba(10,10,10,0.78))]" aria-hidden="true" />
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.06),transparent_18%,transparent_82%,rgba(0,0,0,0.22))]" aria-hidden="true" />

            <div className="relative mx-auto grid min-h-[100svh] max-w-7xl items-center gap-10 px-5 py-12 md:px-8 lg:grid-cols-[440px_minmax(0,1fr)] lg:gap-14 lg:py-16">
              <div className="max-w-xl text-white">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-aime-red backdrop-blur-sm">
                  <Sparkles className="h-3.5 w-3.5" />
                  Innovation intermittents du spectacle
                </div>

                <h1 className="mt-6 font-display text-5xl font-black leading-[0.96] tracking-tight md:text-7xl">
                  L'atelier
                  <br />
                  conversationnel
                  <br />
                  des 507h.
                </h1>

                <p className="mt-6 max-w-lg text-base leading-relaxed text-white/82 md:text-lg">
                  AIME assemble la fiche, la timeline, les wallets, le pilotage 507 et l'agent IA dans un même cockpit documentaire. Une approche pensée pour les intermittents du spectacle.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    to="/prestations"
                    className="inline-flex items-center gap-2 rounded-full bg-aime-red px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-aime-red/90"
                  >
                    Ouvrir la timeline
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/cartographie"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/15"
                  >
                    Valider les pages
                  </Link>
                </div>

                <div className="mt-10 grid gap-3 sm:grid-cols-3">
                  <GlassMetric value="4" label="univers produit" />
                  <GlassMetric value="507h" label="pilotage préparatoire" />
                  <GlassMetric value="1" label="agent IA transversal" />
                </div>
              </div>

              <LandingShowcase />
            </div>
          </section>

          <section className="border-b border-black/5 bg-[#F6F2EC]">
            <div className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-16">
              <div className="max-w-2xl">
                <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-aime-red">
                  Les pages à vraiment garder
                </div>
                <h2 className="mt-3 font-display text-3xl font-black tracking-tight text-zinc-950 md:text-5xl">
                  Voir, produire, piloter, dialoguer.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-zinc-600 md:text-base">
                  La V2 s'éclaircit autour de quelques pages fortes. Le but n'est plus d'empiler des vues, mais de garder les bons piliers pour ensuite travailler en profondeur.
                </p>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {PILLARS.map((item) => (
                  <Link
                    key={item.title}
                    to={item.href}
                    className="group rounded-[28px] border border-black/5 bg-white/85 p-5 shadow-[0_18px_45px_-30px_rgba(0,0,0,0.25)] backdrop-blur-sm transition-transform hover:-translate-y-0.5"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 text-aime-red">
                      <item.icon className="h-5 w-5" strokeWidth={1.8} />
                    </div>
                    <h3 className="mt-5 font-display text-2xl font-black tracking-tight text-zinc-950">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                      {item.text}
                    </p>
                    <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-zinc-900">
                      Ouvrir
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-white">
            <div className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-16">
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-aime-red">
                    Pour voir clair maintenant
                  </div>
                  <h2 className="mt-3 font-display text-3xl font-black tracking-tight text-zinc-950 md:text-4xl">
                    On valide les pages, puis on travaille les bonnes.
                  </h2>
                  <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-600 md:text-base">
                    La cartographie sert à décider ce qu'on garde, ce qu'on fusionne et ce qu'on supprime. Le board écrans sert à revoir visuellement les vues existantes. Ensuite seulement, on affine la landing et les pages finales.
                  </p>
                </div>

                <div className="rounded-[28px] border border-black/5 bg-[#F6F2EC] p-5">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                    Outils de nettoyage
                  </div>
                  <div className="mt-4 space-y-3">
                    <QuickLink to="/cartographie" title="Cartographie de l'app" text="Toutes les pages, leurs rôles et les décisions à prendre." />
                    <QuickLink to="/screens" title="Board des écrans" text="Les copies d'écran existantes classées par univers." />
                    <QuickLink to="/espace" title="Mon espace" text="Le point de fusion actuel entre profil, réglages, 507 et bientôt wallets." />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function LandingShowcase() {
  const sections = SCREEN_SECTIONS.map((section) => ({
    ...section,
    tabLabel:
      section.key === "fiches" ? "Fiches"
        : section.key === "cockpit" ? "Cockpit"
          : section.label,
  }));

  const [tabIdx, setTabIdx] = useState(0);
  const [shotIdx, setShotIdx] = useState(0);

  const activeSection = sections[tabIdx] || sections[0];
  const shots = activeSection?.shots || [];

  useEffect(() => {
    setShotIdx(0);
  }, [tabIdx]);

  useEffect(() => {
    if (shots.length <= 1) return undefined;
    const timer = window.setInterval(() => {
      setShotIdx((current) => (current + 1) % shots.length);
    }, 3400);
    return () => window.clearInterval(timer);
  }, [shots.length, tabIdx]);

  const currentShot = shots[shotIdx] || shots[0];
  const prevShot = shots[(shotIdx - 1 + shots.length) % shots.length] || currentShot;
  const nextShot = shots[(shotIdx + 1) % shots.length] || currentShot;

  const thumbShots = useMemo(() => shots.slice(0, 5), [shots]);

  return (
    <div className="relative">
      <div className="absolute -left-5 top-10 hidden h-40 w-40 rounded-full bg-aime-red/20 blur-3xl xl:block" aria-hidden="true" />
      <div className="absolute -right-6 bottom-10 hidden h-48 w-48 rounded-full bg-white/10 blur-3xl xl:block" aria-hidden="true" />

      <div className="relative overflow-hidden rounded-[32px] border border-white/12 bg-black/25 p-4 shadow-[0_50px_120px_-45px_rgba(0,0,0,0.9)] backdrop-blur-xl md:p-5">
        <div className="mb-4 flex flex-wrap gap-2">
          {sections.map((section, index) => (
            <button
              key={section.key}
              type="button"
              onClick={() => setTabIdx(index)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                index === tabIdx
                  ? "bg-white text-zinc-950"
                  : "bg-white/8 text-white/75 hover:bg-white/12 hover:text-white"
              }`}
            >
              {section.tabLabel}
            </button>
          ))}
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white p-3 shadow-[0_25px_80px_-40px_rgba(0,0,0,0.55)]">
          <div className="flex items-center gap-1.5 border-b border-zinc-200 bg-white px-3 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
            <span className="ml-3 text-[10px] tracking-wider text-zinc-400">aime.app / {activeSection.tabLabel.toLowerCase()}</span>
          </div>

          <div className="relative aspect-[16/10] overflow-hidden rounded-[22px] bg-zinc-50">
            {shots.map((shot, index) => (
              <img
                key={shot.url}
                src={shot.url}
                alt={shot.label}
                className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-700 ${index === shotIdx ? "opacity-100" : "opacity-0"}`}
                loading={index === 0 ? "eager" : "lazy"}
              />
            ))}

            <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3">
              <div className="rounded-full bg-black/72 px-3 py-1.5 text-xs text-white backdrop-blur-sm">
                {currentShot?.label}
              </div>
              <div className="rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-700">
                {shotIdx + 1}/{Math.max(1, shots.length)}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <FloatingPreview label="précédent" shot={prevShot} />
          <div className="hidden rounded-[24px] border border-white/10 bg-white/6 p-3 text-white/80 sm:block">
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-aime-red">Catégorie active</div>
            <div className="mt-2 font-display text-2xl font-black tracking-tight text-white">{activeSection.tabLabel}</div>
            <p className="mt-2 text-sm leading-relaxed text-white/70">{activeSection.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {thumbShots.map((shot, index) => (
                <button
                  key={shot.url}
                  type="button"
                  onClick={() => setShotIdx(index)}
                  className={`h-2 rounded-full transition-all ${index === shotIdx ? "w-8 bg-aime-red" : "w-2 bg-white/25 hover:bg-white/45"}`}
                  aria-label={`Aller à la slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
          <FloatingPreview label="suivant" shot={nextShot} reverse />
        </div>
      </div>
    </div>
  );
}

function FloatingPreview({ label, shot, reverse = false }) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-white/10 bg-white/6 p-3 backdrop-blur-sm">
      <div className={`mb-2 flex items-center justify-between gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] ${reverse ? "text-white/70" : "text-aime-red"}`}>
        <span>{label}</span>
        <span className="text-white/45">aperçu</span>
      </div>
      <div className="overflow-hidden rounded-[18px] border border-white/10 bg-black/20">
        <img src={shot?.url} alt={shot?.label} className="aspect-[16/10] h-full w-full object-cover object-top opacity-90" loading="lazy" />
      </div>
      <div className="mt-2 text-xs leading-relaxed text-white/70">{shot?.label}</div>
    </div>
  );
}

function GlassMetric({ value, label }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-sm">
      <div className="font-display text-3xl font-black tracking-tight text-white">{value}</div>
      <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/65">{label}</div>
    </div>
  );
}

function QuickLink({ to, title, text }) {
  return (
    <Link to={to} className="block rounded-2xl border border-zinc-200 bg-white px-4 py-3 transition-colors hover:bg-zinc-50">
      <div className="text-sm font-medium text-zinc-900">{title}</div>
      <div className="mt-1 text-xs leading-relaxed text-zinc-600">{text}</div>
    </Link>
  );
}
