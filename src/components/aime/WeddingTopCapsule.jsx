import React, { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { UNIVERSES, UNIVERSE_GRADIENTS } from "@/lib/aimeUniverses";

const UNIVERSE_ITEMS = UNIVERSES.map((item) => ({
  id: item.id,
  label: item.label,
  subtitle: item.subtitle,
  to: item.route,
  gradient: UNIVERSE_GRADIENTS[item.id],
  menuItems: item.menuItems || [],
}));

const ACCESS_ITEMS = [
  { id: "couple", label: "Créer mon mariage", to: "/setup" },
  { id: "vendor", label: "Rejoindre le registre", to: "/prestataires" },
  { id: "guest", label: "Accéder à un mariage", to: "/espace-invites" },
  { id: "planner", label: "Accès planner", to: "/point-zero?role=planner" },
];

const AIME_MENU_ITEMS = [
  { id: "home", label: "Accueil", to: "/" },
  { id: "about", label: "En savoir plus", to: "/#pillars" },
  { id: "guide", label: "Mode d’emploi", to: "/design-system" },
  { id: "help", label: "Aide", to: "/design-system" },
];

function getCurrentUniverse(pathname = "/") {
  if (pathname === "/" || pathname === "/design-system") return null;
  const universeMatch = /^\/univers\/([^/]+)/.exec(pathname);
  if (universeMatch) return universeMatch[1];
  if (pathname.startsWith("/point-zero")) return "zeus";
  if (pathname.startsWith("/notifications")) return "athena";
  if (pathname.startsWith("/communication")) return "hermes";
  if (pathname.startsWith("/jour-j")) return "ares";
  if (pathname.startsWith("/budget")) return "demeter";
  if (pathname.startsWith("/documents") || pathname.startsWith("/exports")) return "hephaistos";
  if (pathname.startsWith("/prestataires")) return "artemis";
  if (pathname.startsWith("/invites") || pathname.startsWith("/espace-invites") || pathname.startsWith("/couple") || pathname.startsWith("/setup")) return "hestia";
  return null;
}

function UniverseRow({ item, onSelect }) {
  return (
    <div className="rounded-[18px] bg-[var(--color-warm-white)] px-3 py-3">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <Link
          to={item.to}
          onClick={onSelect}
          className="inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold italic text-white shadow-[0_12px_24px_rgba(0,0,0,0.14)] md:min-w-[126px]"
          style={{ background: item.gradient }}
        >
          {item.label}
        </Link>
        <div className="flex flex-wrap gap-2">
          {item.menuItems.map((entry) => (
            <Link
              key={`${item.id}-${entry.label}`}
              to={entry.to}
              onClick={onSelect}
              className="rounded-full border border-black/8 bg-white px-3 py-2 text-xs text-zinc-700 hover:bg-black/[0.03]"
            >
              {entry.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function WeddingTopCapsule() {
  const location = useLocation();
  const [openUniverse, setOpenUniverse] = useState(false);
  const [openAccess, setOpenAccess] = useState(false);
  const [openAime, setOpenAime] = useState(false);
  const currentUniverseId = getCurrentUniverse(location.pathname);
  const currentUniverse = useMemo(
    () => UNIVERSE_ITEMS.find((item) => item.id === currentUniverseId) || null,
    [currentUniverseId],
  );
  const accessLabel = location.pathname === "/" ? "Créer mon mariage" : "Accès";

  const centerGradient = currentUniverse
    ? currentUniverse.gradient
    : "linear-gradient(135deg, #7C6CFF 0%, #4FCBFF 35%, #F4B6C8 70%, #F29B5C 100%)";

  return (
    <div className="fixed top-3 left-1/2 z-[60] -translate-x-1/2 w-[min(1440px,calc(100%-20px))] print:hidden">
      <div className="rounded-full border border-black/8 bg-[rgba(248,248,246,0.94)] shadow-[0_16px_40px_rgba(0,0,0,0.10)] px-2.5 md:px-3 py-1.5">
        <div className="flex items-center justify-between gap-3 min-w-0">
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => {
                  setOpenAime((value) => !value);
                  setOpenUniverse(false);
                  setOpenAccess(false);
                }}
                className="rounded-full px-4 md:px-5 py-2.5 text-sm md:text-[15px] inline-flex items-center gap-2 hover:bg-black/[0.03] transition-colors"
              >
                <span className="font-display text-[18px] md:text-[22px] leading-[1] text-zinc-950">AIME</span>
                <ChevronDown className={`w-4 h-4 text-zinc-600 transition-transform ${openAime ? "rotate-180" : ""}`} />
              </button>

              {openAime && (
                <div className="absolute left-0 top-full mt-3 w-[min(280px,calc(100vw-28px))] rounded-[24px] border border-black/8 bg-white p-2 shadow-[0_20px_50px_rgba(0,0,0,0.14)]">
                  {AIME_MENU_ITEMS.map((item) => (
                    <Link
                      key={item.id}
                      to={item.to}
                      onClick={() => setOpenAime(false)}
                      className="block rounded-[18px] px-4 py-3 text-sm text-zinc-800 hover:bg-black/[0.03]"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <button
                    type="button"
                    onClick={() => setOpenAime(false)}
                    className="w-full text-left rounded-[18px] px-4 py-3 text-sm text-zinc-800 hover:bg-black/[0.03]"
                  >
                    Déconnexion
                  </button>
                </div>
              )}
            </div>

            <span className="text-zinc-300 hidden md:inline">/</span>

            <div className="relative shrink-0 min-w-0">
              <button
                type="button"
                onClick={() => {
                  setOpenUniverse((value) => !value);
                  setOpenAccess(false);
                  setOpenAime(false);
                }}
                className="max-w-[210px] md:max-w-none rounded-full px-4 md:px-5 py-2.5 text-sm md:text-[15px] font-semibold italic text-white inline-flex items-center gap-2 shadow-[0_14px_30px_rgba(0,0,0,0.18)]"
                style={{ background: centerGradient }}
              >
                <span className="truncate">{currentUniverse ? currentUniverse.label : "Accueil"}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${openUniverse ? "rotate-180" : ""}`} />
              </button>

              {openUniverse && (
                <div className="absolute left-0 top-full mt-3 w-[min(640px,calc(100vw-28px))] rounded-[24px] border border-black/8 bg-white p-2 shadow-[0_20px_50px_rgba(0,0,0,0.14)]">
                  <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
                    <div className="rounded-[18px] bg-[var(--color-warm-white)] px-3 py-3">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center">
                        <Link
                          to="/"
                          onClick={() => setOpenUniverse(false)}
                          className="inline-flex items-center justify-center rounded-full bg-black px-4 py-2.5 text-sm font-semibold italic text-white md:min-w-[126px]"
                        >
                          Accueil
                        </Link>
                        <div className="flex flex-wrap gap-2">
                          <Link to="/#registre" onClick={() => setOpenUniverse(false)} className="rounded-full border border-black/8 bg-white px-3 py-2 text-xs text-zinc-700 hover:bg-black/[0.03]">Registre</Link>
                          <Link to="/#pillars" onClick={() => setOpenUniverse(false)} className="rounded-full border border-black/8 bg-white px-3 py-2 text-xs text-zinc-700 hover:bg-black/[0.03]">12 univers</Link>
                        </div>
                      </div>
                    </div>
                    {UNIVERSE_ITEMS.map((item) => (
                      <UniverseRow key={item.id} item={item} onSelect={() => setOpenUniverse(false)} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1" />

          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => {
                setOpenAccess((value) => !value);
                setOpenUniverse(false);
                setOpenAime(false);
              }}
              className="rounded-full bg-black px-4 md:px-5 py-2.5 text-sm text-white hover:bg-zinc-800 transition-colors inline-flex items-center gap-2"
            >
              {accessLabel}
              <ChevronDown className={`w-4 h-4 transition-transform ${openAccess ? "rotate-180" : ""}`} />
            </button>

            {openAccess && (
              <div className="absolute right-0 top-full mt-3 w-[min(320px,calc(100vw-28px))] rounded-[24px] border border-black/8 bg-white p-2 shadow-[0_20px_50px_rgba(0,0,0,0.14)]">
                {ACCESS_ITEMS.map((item) => (
                  <Link
                    key={item.id}
                    to={item.to}
                    onClick={() => setOpenAccess(false)}
                    className="block rounded-[18px] px-4 py-3 text-sm text-zinc-800 hover:bg-black/[0.03]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
