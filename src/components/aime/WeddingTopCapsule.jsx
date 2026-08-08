import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { UNIVERSES, UNIVERSE_GRADIENTS } from "@/lib/aimeUniverses";

const UNIVERSE_ITEMS = UNIVERSES.map((item) => ({
  id: item.id,
  label: item.label,
  subtitle: item.subtitle,
  to: item.route,
  gradient: UNIVERSE_GRADIENTS[item.id],
  menuByMode: item.menuByMode || {},
}));

const MODE_OPTIONS = [
  { id: "couple", label: "Mariés" },
  { id: "guests", label: "Invités" },
  { id: "vendors", label: "Prestataires" },
  { id: "planner", label: "Planner" },
];

const MODE_CLUSTERS = {
  couple: [
    { id: "pilot", label: "Piloter", universes: ["zeus", "athena"] },
    { id: "create", label: "Créer & inspirer", universes: ["aphrodite", "apollon", "poseidon"] },
    { id: "organize", label: "Organiser", universes: ["artemis", "ares", "demeter", "dionysos"] },
    { id: "communicate", label: "Communiquer", universes: ["hermes", "hestia", "hephaistos"] },
  ],
  guests: [
    { id: "essential", label: "Essentiel", universes: ["zeus", "hestia", "aphrodite"] },
    { id: "travel", label: "Venir & séjourner", universes: ["artemis", "ares", "demeter"] },
    { id: "dayj", label: "Le Jour J", universes: ["poseidon", "dionysos", "apollon"] },
    { id: "help", label: "Aide", universes: ["athena", "hermes", "hephaistos"] },
  ],
  vendors: [
    { id: "portal", label: "Mon portail", universes: ["zeus", "hermes", "athena"] },
    { id: "mission", label: "Ma mission", universes: ["aphrodite", "apollon", "poseidon", "dionysos"] },
    { id: "ops", label: "Logistique", universes: ["ares", "artemis", "demeter"] },
    { id: "admin", label: "Admin", universes: ["hephaistos", "hestia"] },
  ],
  planner: [
    { id: "cockpit", label: "Cockpit", universes: ["zeus", "athena"] },
    { id: "art", label: "Direction artistique", universes: ["aphrodite", "apollon", "poseidon"] },
    { id: "ops", label: "Opérations", universes: ["ares", "artemis", "demeter", "dionysos"] },
    { id: "manage", label: "Gestion", universes: ["hermes", "hephaistos", "hestia"] },
  ],
};

const ACCESS_ITEMS = [
  { id: "couple", label: "Créer mon mariage", to: "/compte/maries" },
  { id: "vendor", label: "Rejoindre le registre", to: "/compte/prestataires" },
  { id: "guest", label: "Accéder à un mariage", to: "/compte/invites" },
  { id: "planner", label: "Accès planner", to: "/compte/planner" },
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
  if (pathname.startsWith("/prestataires/registre")) return null;
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

function inferMode(pathname = "/") {
  if (pathname.startsWith("/setup") || pathname.startsWith("/couple")) return "couple";
  if (pathname.startsWith("/espace-invites")) return "guests";
  if (pathname.startsWith("/prestataires")) return "vendors";
  if (pathname.startsWith("/point-zero")) return "planner";
  return "couple";
}

function UniverseRow({ item, mode, onSelect }) {
  const subItems = item.menuByMode?.[mode] || [];

  return (
    <div className="rounded-[18px] bg-[var(--color-warm-white)] px-3 py-3">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="flex items-center gap-2.5 md:min-w-[170px]">
          <Link
            to={item.to}
            onClick={onSelect}
            className="inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold italic text-white shadow-[0_12px_24px_rgba(0,0,0,0.14)] md:min-w-[126px]"
            style={{ background: item.gradient }}
          >
            {item.label}
          </Link>
          <span className="hidden md:inline text-[11px] uppercase tracking-[0.16em] text-zinc-500">
            {item.subtitle}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {subItems.map((entry) => (
            <Link
              key={`${item.id}-${mode}-${entry.label}`}
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

function UniverseCluster({ cluster, mode, onSelect }) {
  const rows = cluster.universes
    .map((id) => UNIVERSE_ITEMS.find((item) => item.id === id))
    .filter(Boolean);

  return (
    <div className="space-y-2">
      <div className="px-2 pt-1 text-[11px] uppercase tracking-[0.16em] text-zinc-500">
        {cluster.label}
      </div>
      {rows.map((item) => (
        <UniverseRow key={item.id} item={item} mode={mode} onSelect={onSelect} />
      ))}
    </div>
  );
}

export default function WeddingTopCapsule() {
  const location = useLocation();
  const shellRef = useRef(null);
  const [openUniverse, setOpenUniverse] = useState(false);
  const [openAccess, setOpenAccess] = useState(false);
  const [openAime, setOpenAime] = useState(false);
  const [menuMode, setMenuMode] = useState(() => {
    if (typeof window === "undefined") return "couple";
    return window.localStorage.getItem("aime_universe_menu_mode") || inferMode(window.location.pathname);
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("aime_universe_menu_mode", menuMode);
  }, [menuMode]);

  useEffect(() => {
    const inferred = inferMode(location.pathname);
    setMenuMode(inferred);
    setOpenUniverse(false);
    setOpenAccess(false);
    setOpenAime(false);
  }, [location.pathname]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!shellRef.current?.contains(event.target)) {
        setOpenUniverse(false);
        setOpenAccess(false);
        setOpenAime(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpenUniverse(false);
        setOpenAccess(false);
        setOpenAime(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const currentUniverseId = getCurrentUniverse(location.pathname);
  const currentUniverse = useMemo(
    () => UNIVERSE_ITEMS.find((item) => item.id === currentUniverseId) || null,
    [currentUniverseId],
  );

  const centerGradient = currentUniverse
    ? currentUniverse.gradient
    : "linear-gradient(135deg, #8459ff 0%, #4fd0ff 24%, #47e3b8 42%, #f4b6c8 68%, #ff9b52 100%)";
  const universeLabel = currentUniverse ? currentUniverse.label : "Découvrir";
  const activeClusters = MODE_CLUSTERS[menuMode] || [];

  return (
    <div className="fixed top-3 left-1/2 z-[60] -translate-x-1/2 w-[min(1440px,calc(100%-20px))] print:hidden">
      <div ref={shellRef} className="rounded-full border border-black/8 bg-[rgba(248,248,246,0.94)] shadow-[0_16px_40px_rgba(0,0,0,0.10)] backdrop-blur-xl px-2.5 md:px-3 py-1.5">
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
                className="rounded-full px-4 md:px-5 py-2.5 text-sm md:text-[15px] inline-flex items-center gap-3 hover:bg-black/[0.03] transition-colors"
              >
                <span className="text-left leading-[1]">
                  <span className="font-display text-[18px] md:text-[22px] text-zinc-950 block">AIME</span>
                  <span className="text-[11px] uppercase tracking-[0.16em] text-zinc-400 block mt-1">Wedding</span>
                </span>
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
                className={`max-w-[210px] md:max-w-none rounded-full px-4 md:px-5 py-2.5 text-sm md:text-[15px] font-semibold italic inline-flex items-center gap-2 shadow-[0_14px_30px_rgba(0,0,0,0.18)] ${currentUniverse ? "text-white" : "text-black"}`}
                style={{ background: centerGradient }}
              >
                <span className="truncate">{universeLabel}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${currentUniverse ? "text-white" : "text-black"} ${openUniverse ? "rotate-180" : ""}`} />
              </button>

              {openUniverse && (
                <div className="absolute left-0 top-full mt-3 w-[min(720px,calc(100vw-28px))] rounded-[24px] border border-black/8 bg-white p-2 shadow-[0_20px_50px_rgba(0,0,0,0.14)]">
                  <div className="p-2 border-b border-black/8 mb-2">
                    <div className="flex flex-wrap gap-2">
                      {MODE_OPTIONS.map((mode) => (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => setMenuMode(mode.id)}
                          className={`rounded-full px-3.5 py-2 text-xs transition-colors ${menuMode === mode.id ? "bg-black text-white" : "bg-[var(--color-warm-white)] text-zinc-700 hover:bg-black/[0.03]"}`}
                        >
                          {mode.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                    {activeClusters.map((cluster) => (
                      <UniverseCluster key={`${menuMode}-${cluster.id}`} cluster={cluster} mode={menuMode} onSelect={() => setOpenUniverse(false)} />
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
              Accès
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
