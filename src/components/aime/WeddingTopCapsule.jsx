import React, { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const UNIVERSE_ITEMS = [
  { id: "zeus", label: "Zeus", subtitle: "Point Zéro", to: "/point-zero", gradient: "linear-gradient(135deg, #7C6CFF 0%, #4A56C6 100%)" },
  { id: "poseidon", label: "Poséidon", subtitle: "Ambiance sonore", to: "/prestataires", gradient: "linear-gradient(135deg, #4FCBFF 0%, #3F7FD2 100%)" },
  { id: "athena", label: "Athéna", subtitle: "Planning", to: "/notifications", gradient: "linear-gradient(135deg, #D6DBFF 0%, #8D94CC 100%)" },
  { id: "aphrodite", label: "Aphrodite", subtitle: "Esthétique", to: "/documents", gradient: "linear-gradient(135deg, #F4B6C8 0%, #B989B7 100%)" },
  { id: "apollon", label: "Apollon", subtitle: "Souvenirs", to: "/espace-invites", gradient: "linear-gradient(135deg, #F7C39A 0%, #C98663 100%)" },
  { id: "hermes", label: "Hermès", subtitle: "Communication", to: "/communication", gradient: "linear-gradient(135deg, #55E6D5 0%, #4A9FB0 100%)" },
  { id: "ares", label: "Arès", subtitle: "Jour J", to: "/jour-j", gradient: "linear-gradient(135deg, #9FA9C9 0%, #586487 100%)" },
  { id: "demeter", label: "Déméter", subtitle: "Budget", to: "/budget", gradient: "linear-gradient(135deg, #7AE3C2 0%, #63AB95 100%)" },
  { id: "artemis", label: "Artémis", subtitle: "Registre", to: "/prestataires", gradient: "linear-gradient(135deg, #6C5AE8 0%, #41339E 100%)" },
  { id: "hephaistos", label: "Héphaïstos", subtitle: "Supports", to: "/exports", gradient: "linear-gradient(135deg, #F29B5C 0%, #C4664A 100%)" },
  { id: "dionysos", label: "Dionysos", subtitle: "Soirée", to: "/jour-j", gradient: "linear-gradient(135deg, #D85AE5 0%, #8B439C 100%)" },
  { id: "hestia", label: "Hestia", subtitle: "Invités", to: "/invites", gradient: "linear-gradient(135deg, #E9C0BA 0%, #C9939E 100%)" },
];

const ACCESS_ITEMS = [
  { id: "couple", label: "Créer mon mariage", to: "/setup" },
  { id: "vendor", label: "Rejoindre le registre", to: "/prestataires" },
  { id: "guest", label: "Accéder à un mariage", to: "/espace-invites" },
  { id: "planner", label: "Accès planner", to: "/point-zero?role=planner" },
];

function getCurrentUniverse(pathname = "/") {
  if (pathname === "/" || pathname === "/design-system") return null;
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
          <Link to="/" className="shrink-0 rounded-full px-4 py-2.5 hover:bg-black/[0.03] transition-colors">
            <div className="font-display text-[18px] md:text-[22px] leading-[1] text-zinc-950 truncate">AIME Wedding</div>
          </Link>

          <div className="flex-1 flex justify-center min-w-0">
            <div className="relative max-w-full">
              <button
                type="button"
                onClick={() => {
                  setOpenUniverse((value) => !value);
                  setOpenAccess(false);
                }}
                className="max-w-[220px] md:max-w-none rounded-full px-4 md:px-5 py-2.5 text-sm md:text-[15px] font-semibold text-white inline-flex items-center gap-2 shadow-[0_14px_30px_rgba(0,0,0,0.18)]"
                style={{ background: centerGradient }}
              >
                <span className="truncate">{currentUniverse ? currentUniverse.label : "12 univers"}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${openUniverse ? "rotate-180" : ""}`} />
              </button>

              {openUniverse && (
                <div className="absolute left-1/2 top-full mt-3 -translate-x-1/2 w-[min(960px,calc(100vw-28px))] rounded-[28px] border border-black/8 bg-white p-3 shadow-[0_20px_50px_rgba(0,0,0,0.14)]">
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
          </div>

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
