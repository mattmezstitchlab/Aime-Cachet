import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Files, Gauge, HelpCircle, Settings, ChevronDown } from "lucide-react";
import { Logos, ORGANISMES } from "@/components/aime/organismes/OrganismeLogos";
import AssistantSidePanel from "@/components/aime/assistant/AssistantSidePanel";

// Picto Fiche + plus rouge
function FichePlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-[18px] h-[18px]">
      <path d="M6 3h9l4 4v14a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M15 3v4h4" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 11v6M9 14h6" stroke="hsl(var(--aime-red))" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// Picto Timeline (barres verticales croissantes avec point actif)
function TimelineIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-[18px] h-[18px]">
      <line x1="4" y1="19" x2="4" y2="15" />
      <line x1="9" y1="19" x2="9" y2="11" />
      <line x1="15" y1="19" x2="15" y2="7" />
      <line x1="20" y1="19" x2="20" y2="13" />
      <circle cx="15" cy="7" r="1.6" fill="hsl(var(--aime-red))" stroke="none" />
    </svg>
  );
}

function RailButton({ icon: Icon, customIcon, label, onClick, active, href, external }) {
  const className = `group relative w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
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
  if (external) {
    return <a href={href} target="_blank" rel="noopener noreferrer" className={className} aria-label={label}>{content}</a>;
  }
  if (href) return <Link to={href} className={className}>{content}</Link>;
  return <button onClick={onClick} className={className} aria-label={label}>{content}</button>;
}

export default function SideRail({ onCreate, onScrollTo, onOpenAssistant }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isHome = pathname === "/app";
  const [assistantOpen, setAssistantOpen] = useState(false);
  // Organismes administratifs repliés par défaut pour réduire la friction visuelle
  const [orgOpen, setOrgOpen] = useState(false);

  // Si onCreate n'est pas fourni (pages secondaires), on redirige vers l'accueil
  // avec un flag qui déclenchera la création immédiate d'une fiche.
  const handleCreate = onCreate || (() => navigate("/app?new=1"));

  const scrollOrNavigate = (id) => {
    if (isHome) {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigate(`/app#${id}`);
    }
    onScrollTo?.(id);
  };

  const openAssistant = () => {
    if (onOpenAssistant) onOpenAssistant();
    else setAssistantOpen(true);
  };

  return (
    <>
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 z-30 w-16 bg-aime-black border-r border-white/5 flex-col items-center py-4 gap-1">
      {/* Logo 5♥7 AIME 507 */}
      <button
        type="button"
        onClick={openAssistant}
        aria-label="Ouvrir l'assistant AIME® 507"
        className="flex flex-col items-center mb-3 group transition-all"
      >
        <span className="text-white font-display font-black text-[11px] tracking-wider leading-none mb-0">
          AIME<span className="text-aime-red">®</span>
        </span>
        <span className="w-[52px] h-[48px] flex items-center justify-center rounded-xl ring-1 ring-white/10 group-hover:ring-white/30 transition-all bg-white/[0.03]">
          <span className="flex items-center justify-center gap-0.5 font-display font-black leading-none text-white text-[18px] tracking-tight">
            <span>5</span>
            <span className="text-aime-red text-[18px] animate-[aimeRailBeat_1.1s_ease-in-out_infinite]">♥</span>
            <span>7</span>
          </span>
        </span>
        <span className="mt-1 text-[8px] tracking-[0.18em] text-aime-red font-semibold leading-none animate-[chatPulse_1.4s_ease-in-out_infinite]">
          CHAT
        </span>
        <style>{`@keyframes aimeRailBeat { 0%, 100% { transform: scale(1); } 18% { transform: scale(1.28); } 34% { transform: scale(0.96); } 52% { transform: scale(1.16); } 70% { transform: scale(1); } } @keyframes chatPulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.55; transform: scale(0.92); } }`}</style>
      </button>

      <div className="w-8 h-px bg-white/10 my-2" />

      <RailButton customIcon={<FichePlusIcon />} label="Nouvelle fiche" onClick={handleCreate} />
      <RailButton icon={Files} label="Mes fiches" href="/prestations" active={pathname === "/prestations"} />
      <RailButton icon={Gauge} label="Cockpit 507" href="/507" active={pathname === "/507"} />

      <div className="w-8 h-px bg-white/10 my-2" />

      <RailButton customIcon={<TimelineIcon />} label="Timeline" onClick={() => scrollOrNavigate("prestations")} />

      <div className="w-8 h-px bg-white/10 my-2" />

      {/* Organismes officiels — repliables pour réduire la friction */}
      <div className="flex flex-col items-center w-full">
        <div className="text-[7px] tracking-[0.18em] text-white font-semibold leading-none mb-1">
          ORGA
        </div>
        <button
          type="button"
          onClick={() => setOrgOpen((v) => !v)}
          aria-label={orgOpen ? "Masquer les organismes" : "Afficher les organismes"}
          aria-expanded={orgOpen}
          className="w-10 h-6 rounded-lg flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/10 transition-colors"
        >
          <ChevronDown
            strokeWidth={3}
            className={`w-3.5 h-3.5 transition-transform duration-200 ${orgOpen ? "rotate-180" : ""}`}
          />
        </button>

        {orgOpen && (
          <div className="flex flex-col items-center gap-1 mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
            {ORGANISMES.map((org) => (
              <RailButton
                key={org.key}
                customIcon={<span className="w-[18px] h-[18px] block">{Logos[org.key]}</span>}
                label={org.full}
                href={org.url}
                external
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex-1" />

      <RailButton icon={HelpCircle} label="Aide" href="/aide" active={pathname === "/aide"} />
      <RailButton icon={Settings} label="Paramètres" href="/parametres" active={pathname === "/parametres"} />
    </aside>
      <AssistantSidePanel open={assistantOpen} onClose={() => setAssistantOpen(false)} onCreate={handleCreate} />
    </>
  );
}