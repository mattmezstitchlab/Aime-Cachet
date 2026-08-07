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
}));

const ACCESS_ITEMS = [
  { id: "couple", label: "Créer mon mariage", to: "/setup" },
  { id: "vendor", label: "Rejoindre le registre", to: "/prestataires" },
  { id: "guest", label: "Accéder à un mariage", to: "/espace-invites" },
  { id: "planner", label: "Accès planner", to: "/point-zero?role=planner" },
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

export default function WeddingTopCapsule() {
  const location = useLocation();
  const [openUniverse, setOpenUniverse] = useState(false);
  const [openAccess, setOpenAccess] = useState(false);
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
          <div className="relative shrink-0 min-w-0">
            <button
              type="button"
              onClick={() => {
                setOpenUniverse((value) => !value);
                setOpenAccess(false);
              }}
              className="max-w-[260px] md:max-w-none rounded-full px-4 md:px-5 py-2.5 text-sm md:text-[15px] inline-flex items-center gap-3 hover:bg-black/[0.03] transition-colors"
            >
              <span className="font-display text-[18px] md:text-[22px] leading-[1] text-zinc-950 truncate">AIME</span>
              <span className="text-zinc-400">/</span>
              <span
                className="rounded-full px-3 py-1.5 text-sm md:text-[15px] font-semibold italic text-white shadow-[0_12px_24px_rgba(0,0,0,0.14)] truncate"
                style={{ background: centerGradient }}
              >
                {currentUniverse ? currentUniverse.label : "12 univers"}
              </span>
              <ChevronDown className={`w-4 h-4 text-zinc-600 transition-transform ${openUniverse ? "rotate-180" : ""}`} />
            </button>

            {openUniverse && (
              <div className="absolute left-0 top-full mt-3 w-[min(960px,calc(100vw-28px))] rounded-[28px] border border-black/8 bg-white p-3 shadow-[0_20px_50px_rgba(0,0,0,0.14)]">
                <div className="grid gap-2 md:grid-cols-3 xl:grid-cols-4">
                  {UNIVERSE_ITEMS.map((item) => (
                    <Link
                      key={item.id}
                      to={item.to}
                      onClick={() => setOpenUniverse(false)}
                      className="rounded-[22px] p-4 text-white min-h-[112px] flex flex-col justify-between"
                      style={{ background: item.gradient }}
                    >
                      <div className="text-lg font-semibold italic">{item.label}</div>
                      <div className="text-xs uppercase tracking-[0.16em] text-white/78">{item.subtitle}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex-1" />

          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => {
                setOpenAccess((value) => !value);
                setOpenUniverse(false);
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
