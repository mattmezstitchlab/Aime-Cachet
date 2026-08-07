import React, { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  AlertTriangle,
  Bell,
  Clock3,
  FileWarning,
  Zap,
} from "lucide-react";
import WeddingPageHero from "@/components/aime/WeddingPageHero";
import { getNotificationsForRole, readWeddingState, ROLE_VIEWS } from "@/lib/aimeWeddingCore";

function Card({ title, eyebrow, children, action = null }) {
  return (
    <section className="aime-card-light rounded-[32px] overflow-hidden">
      <div className="px-5 md:px-6 py-4 border-b border-black/8 flex items-center justify-between gap-3">
        <div>
          {eyebrow && <div className="aime-label text-zinc-500 mb-1">{eyebrow}</div>}
          <h2 className="text-zinc-950 text-lg md:text-xl font-semibold">{title}</h2>
        </div>
        {action}
      </div>
      <div className="p-5 md:p-6">{children}</div>
    </section>
  );
}

function RoleChip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm transition-colors ${active ? "bg-black text-white" : "bg-white border border-black/8 text-zinc-700 hover:bg-black/[0.03]"}`}
    >
      {children}
    </button>
  );
}

function iconFor(type) {
  switch (type) {
    case "reminder": return Clock3;
    case "document": return FileWarning;
    case "automation": return Zap;
    case "timeline": return AlertTriangle;
    default: return Bell;
  }
}

function toneFor(level) {
  switch (level) {
    case "critical": return "border-black bg-black text-white";
    case "warning": return "border-black/8 bg-[#fbfaf8] text-zinc-800";
    default: return "border-black/8 bg-white text-zinc-800";
  }
}

function compactText(value, max = 92) {
  if (!value) return "";
  const clean = value.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cutoff = clean.lastIndexOf(" ", max);
  return `${clean.slice(0, cutoff > 44 ? cutoff : max).trim()}…`;
}

export default function WeddingNotifications() {
  const [searchParams] = useSearchParams();
  const roleView = ["couple", "planner", "vendors"].includes(searchParams.get("role")) ? searchParams.get("role") : "planner";
  const state = readWeddingState();
  const notifications = useMemo(() => getNotificationsForRole(state, roleView), [state, roleView]);
  const critical = notifications.filter((item) => item.level === "critical");
  const warning = notifications.filter((item) => item.level === "warning");

  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] text-[var(--color-text-primary)] overflow-x-hidden">
      <div className="max-w-[1480px] mx-auto px-5 md:px-8 lg:px-10 py-6 md:py-8">

        <div className="mb-8 md:mb-10">
          <WeddingPageHero
            eyebrow="Notifications · alertes · priorités"
            title="Les alertes utiles, sans bruit."
            description="Seulement ce qu'il faut voir maintenant."
            image="/landing/athena.jpg"
            stats={[
              { label: "Total", value: notifications.length, hint: "alertes" },
              { label: "Critiques", value: critical.length, hint: "immédiates" },
              { label: "Surveillance", value: warning.length, hint: "à suivre" },
            ]}
          />
        </div>

        <Card title="Flux intelligent" eyebrow={`Vue ${ROLE_VIEWS[roleView].label}`} action={<span className="inline-flex items-center gap-2 text-sm text-zinc-500"><Bell className="w-4 h-4" /> {notifications.length} alertes</span>}>
          <div className="space-y-3">
            {notifications.length === 0 && (
              <div className="rounded-[24px] border border-black/8 bg-black/[0.02] p-5 text-sm text-zinc-600">
                Aucune alerte prioritaire pour cette vue rôle.
              </div>
            )}
            {notifications.map((item) => {
              const Icon = iconFor(item.type);
              return (
                <div key={item.id} className={`rounded-[24px] border p-4 ${toneFor(item.level)}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="w-10 h-10 rounded-[16px] border border-current/15 bg-white/60 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </span>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold">{item.title}</div>
                        <div className="text-[10px] uppercase tracking-[0.18em] mt-2 opacity-70">{item.source}</div>
                        <p className="text-sm mt-3 leading-relaxed opacity-90">{compactText(item.text, 96)}</p>
                      </div>
                    </div>
                    {item.href && (
                      <Link to={item.href} className="rounded-full border border-current/15 bg-white/60 px-4 py-2 text-sm font-medium whitespace-nowrap hover:bg-white">
                        {item.cta || "Ouvrir"}
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
