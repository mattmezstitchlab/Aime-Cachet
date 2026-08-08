import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, FileText, Files, Sparkles, User } from "lucide-react";
import { useAssistant } from "@/components/aime/assistant/AssistantProvider";

function FichePlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-[18px] h-[18px]">
      <path d="M6 3h9l4 4v14a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M15 3v4h4" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 11v6M9 14h6" stroke="hsl(var(--aime-red))" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function TimelineIcon({ className = "w-[18px] h-[18px]" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={className}>
      <line x1="4" y1="19" x2="4" y2="15" />
      <line x1="9" y1="19" x2="9" y2="11" />
      <line x1="15" y1="19" x2="15" y2="7" />
      <line x1="20" y1="19" x2="20" y2="13" />
      <circle cx="15" cy="7" r="1.6" fill="hsl(var(--aime-red))" stroke="none" />
    </svg>
  );
}

function AppRailButton({ icon: Icon, customIcon, label, onClick, active, href }) {
  const className = `group relative w-11 h-11 rounded-2xl flex items-center justify-center transition-colors ${
    active ? "bg-white text-aime-black" : "text-zinc-400 hover:bg-white/10 hover:text-white"
  }`;
  const content = (
    <>
      {customIcon ? customIcon : <Icon className="w-[18px] h-[18px]" />}
      <span className="absolute left-full ml-3 px-2 py-1 bg-white text-aime-black text-[11px] font-medium rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
        {label}
      </span>
    </>
  );

  if (href) return <Link to={href} className={className} aria-label={label}>{content}</Link>;
  return <button onClick={onClick} className={className} aria-label={label}>{content}</button>;
}

function LandingRailButton({ icon, label, href, onClick, active = false, cta = false }) {
  const content = (
    <>
      <span className={`flex h-10 w-10 items-center justify-center rounded-2xl border ${cta ? "border-aime-red/30 bg-aime-red text-white" : active ? "border-white/20 bg-white text-zinc-950" : "border-white/10 bg-white/[0.04] text-white/85"}`}>
        {icon}
      </span>
      <span className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${cta ? "text-white" : active ? "text-white" : "text-white/70"}`}>
        {label}
      </span>
    </>
  );

  if (href) {
    const className = "group flex flex-col items-center gap-2 rounded-2xl px-2 py-2 text-center transition-colors hover:bg-white/6";
    if (href.startsWith("/")) {
      return <Link to={href} className={className}>{content}</Link>;
    }
    return <a href={href} className={className}>{content}</a>;
  }

  return (
    <button type="button" onClick={onClick} className="group flex w-full flex-col items-center gap-2 rounded-2xl px-2 py-2 text-center transition-colors hover:bg-white/6">
      {content}
    </button>
  );
}

export default function SideRail({ onCreate, onScrollTo, mode = "app" }) {
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();
  const { openAssistant } = useAssistant();
  const params = new URLSearchParams(search);

  const isGridPrestations = params.get("view") === "grid" || params.has("status") || params.has("filter") || params.has("wallet") || params.has("smart");
  const isTimelineHome = pathname === "/prestations" && !isGridPrestations;
  const isSpaceArea = pathname === "/profil" || pathname === "/parametres" || pathname === "/507";

  const handleCreate = onCreate || (() => navigate("/prestations?new=1"));

  const goTimeline = () => {
    if (isTimelineHome) {
      const el = document.getElementById("prestations");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigate("/prestations");
    }
    onScrollTo?.("prestations");
  };

  if (mode === "landing") {
    const items = [
      { label: "Vision", href: "#hero", icon: <Sparkles className="w-4 h-4" /> },
      { label: "Timeline", href: "#timeline", icon: <TimelineIcon className="w-4 h-4" /> },
      { label: "Studio", href: "#studio", icon: <FileText className="w-4 h-4" /> },
      {
        label: "Agent 507",
        onClick: openAssistant,
        active: hash === "#assistant",
        icon: <span className="font-display text-[12px] font-black tracking-tight">5<span className="text-aime-red">♥</span>7</span>,
      },
      { label: "Entrer", href: "/prestations", cta: true, icon: <ArrowRight className="w-4 h-4" /> },
    ];

    return (
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 z-40 w-24 bg-aime-black/96 backdrop-blur-xl border-r border-white/5 flex-col items-center px-3 py-5">
        <a href="#hero" className="flex flex-col items-center gap-1 mb-6 text-center">
          <span className="font-display font-black text-lg tracking-tight text-white leading-none">
            AIME<span className="text-aime-red">®</span>
          </span>
          <span className="text-[8px] uppercase tracking-[0.26em] text-aime-red font-semibold">Intermittence</span>
        </a>

        <div className="flex flex-col gap-1.5 w-full">
          {items.map((item) => (
            <LandingRailButton key={item.label} {...item} />
          ))}
        </div>

        <div className="mt-auto rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-center">
          <div className="text-[9px] uppercase tracking-[0.22em] text-aime-red font-semibold">France</div>
          <p className="mt-2 text-[11px] leading-relaxed text-white/75">
            Un cockpit documentaire pensé pour les intermittents du spectacle.
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 z-30 w-16 bg-aime-black border-r border-white/5 flex-col items-center py-4 gap-1">
      <Link to="/" className="flex flex-col items-center mb-4 group transition-all text-center">
        <span className="text-white font-display font-black text-[11px] tracking-wider leading-none mb-1">
          AIME<span className="text-aime-red">®</span>
        </span>
        <span className="w-[52px] h-[48px] flex items-center justify-center rounded-2xl ring-1 ring-white/10 group-hover:ring-white/30 transition-all bg-white/[0.03]">
          <span className="flex items-center justify-center gap-0.5 font-display font-black leading-none text-white text-[18px] tracking-tight">
            <span>5</span>
            <span className="text-aime-red text-[18px]">♥</span>
            <span>7</span>
          </span>
        </span>
        <span className="mt-1 text-[8px] tracking-[0.18em] text-zinc-500 font-semibold leading-none">
          TIMELINE
        </span>
      </Link>

      <div className="w-8 h-px bg-white/10 my-2" />

      <AppRailButton customIcon={<TimelineIcon />} label="Timeline" onClick={goTimeline} active={isTimelineHome} />
      <AppRailButton customIcon={<FichePlusIcon />} label="Nouvelle fiche" onClick={handleCreate} />
      <AppRailButton icon={User} label="Mon espace" href="/profil" active={isSpaceArea} />
      <AppRailButton icon={Files} label="Mes fiches" href="/fiches" active={pathname === "/fiches" || isGridPrestations} />

      <div className="flex-1" />

      <button
        type="button"
        onClick={openAssistant}
        className="group mb-2 w-11 h-11 rounded-2xl flex items-center justify-center text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
        aria-label="Ouvrir l'agent IA 507"
      >
        <span className="flex items-center justify-center gap-0.5 font-display font-black leading-none text-[15px] tracking-tight">
          <span>5</span>
          <span className="text-aime-red">♥</span>
          <span>7</span>
        </span>
        <span className="absolute left-full ml-3 px-2 py-1 bg-white text-aime-black text-[11px] font-medium rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
          Agent 507
        </span>
      </button>
    </aside>
  );
}
