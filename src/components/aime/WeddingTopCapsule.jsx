import React from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import {
  Download,
  Megaphone,
  PlayCircle,
  Printer,
  Settings2,
} from "lucide-react";
import { readWeddingState } from "@/lib/aimeWeddingCore";

function getInitials(value = "AIME") {
  return value
    .split(/\s|&/)
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase())
    .join("");
}

function CapsuleIconLink({ to, icon: Icon, label }) {
  return (
    <Link
      to={to}
      aria-label={label}
      title={label}
      className="rounded-full border border-black/8 bg-white p-2.5 text-black hover:bg-black/[0.03] transition-colors"
    >
      <Icon className="w-4 h-4" />
    </Link>
  );
}

function CapsuleIconButton({ onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="rounded-full border border-black/8 bg-white p-2.5 text-black hover:bg-black/[0.03] transition-colors"
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}

const ROLE_OPTIONS = [
  { id: "couple", label: "Couple" },
  { id: "planner", label: "Planner" },
  { id: "vendors", label: "Prestataires" },
];

const ROLE_ROUTES = new Set([
  "/point-zero",
  "/documents",
  "/jour-j",
  "/notifications",
  "/communication",
  "/invites",
]);

function getContextActions(pathname = "/") {
  if (pathname.startsWith("/point-zero")) {
    return [
      { type: "link", to: "/communication", icon: Megaphone, label: "Diffusion" },
      { type: "link", to: "/exports?view=planner", icon: Download, label: "Exports planner" },
    ];
  }

  if (pathname.startsWith("/couple")) {
    return [
      { type: "link", to: "/exports?view=couple", icon: Download, label: "Export couple" },
    ];
  }

  if (pathname.startsWith("/prestataires")) {
    return [
      { type: "link", to: "/exports?view=vendors", icon: Download, label: "Export prestataires" },
    ];
  }

  if (pathname.startsWith("/invites")) {
    return [
      { type: "link", to: "/exports?view=planner", icon: Download, label: "Export invités" },
    ];
  }

  if (pathname.startsWith("/documents")) {
    return [
      { type: "link", to: "/exports?view=planner", icon: Download, label: "Export docs" },
    ];
  }

  if (pathname.startsWith("/jour-j")) {
    return [
      { type: "link", to: "/exports?view=dayj", icon: Download, label: "Export Jour J" },
    ];
  }

  if (pathname.startsWith("/notifications")) {
    return [
      { type: "link", to: "/communication", icon: Megaphone, label: "Diffusion" },
    ];
  }

  if (pathname.startsWith("/exports")) {
    return [
      { type: "button", onClick: () => window.print(), icon: Printer, label: "Imprimer / PDF" },
    ];
  }

  return [];
}

export default function WeddingTopCapsule() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const wedding = readWeddingState();
  const profileName = wedding.meta?.couple || "Profil mariage";
  const initials = getInitials(profileName);
  const onLanding = location.pathname === "/";
  const onSetup = location.pathname === "/setup";
  const supportsRoleSwitch = ROLE_ROUTES.has(location.pathname);
  const activeRole = ROLE_OPTIONS.some((item) => item.id === searchParams.get("role"))
    ? searchParams.get("role")
    : "planner";
  const contextActions = getContextActions(location.pathname);

  const setRole = (nextRole) => {
    const next = new URLSearchParams(searchParams);
    next.set("role", nextRole);
    setSearchParams(next, { replace: true });
  };

  return (
    <div className="fixed top-3 left-1/2 z-[60] -translate-x-1/2 w-[min(1120px,calc(100%-20px))] print:hidden">
      <div className="rounded-full border border-black/8 bg-[rgba(248,248,246,0.88)] backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.10)] px-2.5 md:px-3 py-1.5">
        <div className="flex items-center justify-between gap-2 md:gap-3 min-w-0">
          <Link to="/" className="min-w-0 rounded-full px-3 py-2 hover:bg-black/[0.03] transition-colors">
            <div className="font-display text-[18px] md:text-[22px] leading-[1] text-zinc-950 truncate">AIME Wedding</div>
          </Link>

          {onLanding ? (
            <>
              <nav className="hidden lg:flex items-center gap-1.5">
                <a href="#registre" className="rounded-full border border-black/8 bg-white px-3.5 py-2 text-sm text-zinc-700 hover:bg-black/[0.03] transition-colors">
                  Registre
                </a>
                <a href="#pillars" className="rounded-full border border-black/8 bg-white px-3.5 py-2 text-sm text-zinc-700 hover:bg-black/[0.03] transition-colors">
                  12 univers
                </a>
                <Link to="/espace-invites" className="rounded-full border border-black/8 bg-white px-3.5 py-2 text-sm text-zinc-700 hover:bg-black/[0.03] transition-colors">
                  Invités
                </Link>
                <Link to="/setup" className="rounded-full border border-black/8 bg-white px-3.5 py-2 text-sm text-zinc-700 hover:bg-black/[0.03] transition-colors">
                  Couple
                </Link>
                <Link to="/point-zero?role=planner" className="rounded-full border border-black/8 bg-white px-3.5 py-2 text-sm text-zinc-700 hover:bg-black/[0.03] transition-colors">
                  Planner
                </Link>
              </nav>

              <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
                <Link to="/setup" className="inline-flex rounded-full bg-black px-4 py-2.5 text-sm text-white hover:bg-zinc-800 transition-colors">
                  Créer mon mariage
                </Link>
              </div>
            </>
          ) : onSetup ? (
            <div className="shrink-0" />
          ) : (
            <>
              {supportsRoleSwitch && (
                <div className="hidden md:flex items-center gap-1 rounded-full border border-black/8 bg-white p-1">
                  {ROLE_OPTIONS.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => setRole(role.id)}
                      className={`rounded-full px-3 py-1.5 text-xs transition-colors ${activeRole === role.id ? "bg-black text-white" : "text-zinc-700 hover:bg-black/[0.03]"}`}
                    >
                      {role.label}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
                {contextActions.map((item) =>
                  item.type === "button" ? (
                    <CapsuleIconButton key={item.label} onClick={item.onClick} icon={item.icon} label={item.label} />
                  ) : (
                    <CapsuleIconLink key={item.label} to={item.to} icon={item.icon} label={item.label} />
                  ),
                )}
                <Link
                  to="/couple"
                  aria-label="Profil"
                  title={profileName}
                  className="rounded-full p-2.5 text-black/82 hover:text-black hover:bg-black/[0.04] transition-colors inline-flex items-center justify-center"
                >
                  <span className="w-4 h-4 inline-flex items-center justify-center text-[10px] font-semibold leading-none">
                    {initials}
                  </span>
                </Link>
                <CapsuleIconLink to="/setup" icon={Settings2} label="Setup mariage" />
                <CapsuleIconLink to="/point-zero" icon={PlayCircle} label="Point Zéro" />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
