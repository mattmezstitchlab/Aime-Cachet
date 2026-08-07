import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Bell,
  Calendar,
  Crown,
  Euro,
  FileText,
  Heart,
  Users,
} from "lucide-react";

const ITEMS = [
  { to: "/couple", label: "Profil", icon: Heart },
  { to: "/invites", label: "Invités", icon: Users },
  { to: "/documents", label: "Docs", icon: FileText },
  { to: "/point-zero", label: "Cockpit", icon: Crown },
  { to: "/jour-j", label: "Jour J", icon: Calendar },
  { to: "/notifications", label: "Alertes", icon: Bell },
  { to: "/budget", label: "Budget", icon: Euro },
];

function isActive(pathname, target) {
  if (target === "/") return pathname === "/";
  return pathname === target || pathname.startsWith(`${target}/`);
}

export default function WeddingBottomDock() {
  const location = useLocation();

  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 px-4 print:hidden">
      <div className="rounded-full border border-black/8 bg-white shadow-[0_18px_42px_rgba(0,0,0,0.12)] px-2 py-1">
        <div className="flex items-end gap-0.5 sm:gap-1">
          {ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(location.pathname, item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`px-3 py-2.5 inline-flex flex-col items-center justify-center gap-1 transition-opacity ${active ? "text-black opacity-100" : "text-black/72 hover:opacity-100"}`}
                aria-label={item.label}
                title={item.label}
              >
                <Icon className="w-[18px] h-[18px] shrink-0" />
                <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-black" : "bg-transparent"}`} />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
