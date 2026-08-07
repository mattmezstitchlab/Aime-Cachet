import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  Check,
  CreditCard,
  HeartHandshake,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Store,
} from "lucide-react";
import { toast } from "sonner";
import ContactAvatarMenu from "@/components/aime/ContactAvatarMenu";
import WeddingPageHero from "@/components/aime/WeddingPageHero";
import {
  AIME_WEDDING_STORAGE_KEY,
  applyWeddingSignal,
  CEREMONY_FORMAT_OPTIONS,
  COORDINATION_MODE_OPTIONS,
  createDefaultWeddingState,
  getNotificationsForRole,
  getVendorMarketplace,
  getVendorPaymentSummary,
  isWeddingSetupComplete,
  readWeddingState,
  VENDOR_PAYMENT_STATUS,
  VENDOR_TAXONOMY,
  WEDDING_SIGNALS,
  WEDDING_TABS,
  writeWeddingState,
} from "@/lib/aimeWeddingCore";

const ROLE_VIEWS = {
  couple: {
    id: "couple",
    label: "Couple",
    eyebrow: "Vision & arbitrages",
    intro: "Le couple voit l'essentiel et les validations utiles.",
    hideNote: "Le bruit terrain reste masqué.",
  },
  planner: {
    id: "planner",
    label: "Planner",
    eyebrow: "Coordination totale",
    intro: "Le planner voit rappels, docs et tensions à arbitrer.",
    hideNote: "Vue complète pour décider vite.",
  },
  vendors: {
    id: "vendors",
    label: "Prestataires",
    eyebrow: "Exécution terrain",
    intro: "Les prestataires voient horaires, docs et changements utiles.",
    hideNote: "Seulement l'opérationnel.",
  },
};

function fmtMoney(value) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value || 0);
}

function fmtDate(value) {
  return new Date(value).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}

function fmtShortDateTime(value) {
  return new Date(value).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function compactText(value, max = 96) {
  if (!value) return "";
  const clean = value.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cutoff = clean.lastIndexOf(" ", max);
  return `${clean.slice(0, cutoff > 48 ? cutoff : max).trim()}…`;
}

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

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm transition-colors ${active ? "bg-black text-white" : "bg-black/[0.03] text-zinc-700 border border-black/8 hover:bg-black/[0.05]"}`}
    >
      {children}
    </button>
  );
}

function Rule({ icon: Icon, text }) {
  return (
    <div className="rounded-[20px] border border-black/8 bg-black/[0.02] p-3.5 flex items-start gap-3">
      <span className="w-8 h-8 rounded-full border border-black/8 bg-white flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-zinc-700" />
      </span>
      <span className="leading-relaxed">{text}</span>
    </div>
  );
}

function MobileSectionButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm whitespace-nowrap transition-colors ${active ? "bg-black text-white" : "bg-white border border-black/8 text-zinc-700"}`}
    >
      {children}
    </button>
  );
}

function MobileListCard({ title, eyebrow, children, action = null }) {
  return (
    <section className="rounded-[28px] border border-black/8 bg-white shadow-[0_14px_35px_rgba(15,23,42,0.06)] overflow-hidden">
      <div className="px-5 py-4 border-b border-black/8 flex items-center justify-between gap-3">
        <div>
          {eyebrow && <div className="aime-label text-zinc-500 mb-1">{eyebrow}</div>}
          <h2 className="text-zinc-950 text-base font-semibold">{title}</h2>
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function deriveRoleData(state, roleView) {
  const plannerMembers = ["planning"];
  const vendorMembers = ["lieu", "photo", "traiteur", "famille"];
  const coupleMembers = ["couple"];

  if (roleView === "planner") {
    return {
      roles: state.roles,
      reminders: state.reminders,
      automations: state.automations,
      documents: state.documents,
      docsNeedingAttention: state.documents.filter((item) => item.status !== "prêt" && item.status !== "complet"),
      primaryAction: state.reminders.find((item) => item.status === "open") || null,
    };
  }

  if (roleView === "couple") {
    const roles = state.roles.filter((item) => [...coupleMembers, ...plannerMembers].includes(item.id));
    const reminders = state.reminders.filter((item) => ["couple", "planning"].includes(item.owner));
    const automations = state.automations.filter((item) => ["guest-delta", "weather-plan-b", "pmr-flow", "speech-shift"].includes(item.id));
    const documents = state.documents.filter((item) => item.owner === "couple" || item.sharedWith.includes("couple"));
    return {
      roles,
      reminders,
      automations,
      documents,
      docsNeedingAttention: documents.filter((item) => item.status !== "prêt" && item.status !== "complet"),
      primaryAction: reminders.find((item) => item.status === "open") || null,
    };
  }

  const roles = state.roles.filter((item) => [...plannerMembers, ...vendorMembers].includes(item.id));
  const reminders = state.reminders.filter((item) => vendorMembers.includes(item.owner));
  const automations = state.automations.filter((item) => ["weather-plan-b", "pmr-flow", "vendor-delay", "guest-delta"].includes(item.id));
  const documents = state.documents.filter((item) => item.sharedWith.some((id) => vendorMembers.includes(id)) || vendorMembers.includes(item.owner));
  return {
    roles,
    reminders,
    automations,
    documents,
    docsNeedingAttention: documents.filter((item) => item.status !== "prêt" && item.status !== "complet"),
    primaryAction: reminders.find((item) => item.status === "open") || null,
  };
}

export default function PointZero() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = WEDDING_TABS.some((item) => item.id === searchParams.get("section")) ? searchParams.get("section") : "overview";
  const roleView = ["couple", "planner", "vendors"].includes(searchParams.get("role")) ? searchParams.get("role") : "planner";
  const [mobileSection, setMobileSection] = useState("today");
  const [state, setState] = useState(() => readWeddingState());

  const setTab = (nextTab) => {
    const next = new URLSearchParams(searchParams);
    next.set("section", nextTab);
    setSearchParams(next, { replace: true });
  };

  useEffect(() => {
    writeWeddingState(state);
  }, [state]);

  const meta = state.meta;
  const latestRipple = state.rippleLog[0];
  const roleConfig = ROLE_VIEWS[roleView];
  const setupReady = isWeddingSetupComplete(state);
  const roleData = deriveRoleData(state, roleView);
  const openReminders = roleData.reminders.filter((item) => item.status === "open");
  const activeAutomations = roleData.automations.filter((item) => item.enabled);
  const notifications = getNotificationsForRole(state, roleView);
  const vendorMarketplace = useMemo(() => getVendorMarketplace(state, "all"), [state]);
  const vendorPaymentSummary = useMemo(() => getVendorPaymentSummary(state), [state]);
  const coordinationLabel = COORDINATION_MODE_OPTIONS.find((item) => item.id === state.orchestration?.coordinationMode)?.label || "—";
  const ceremonyLabel = CEREMONY_FORMAT_OPTIONS.find((item) => item.id === state.orchestration?.ceremonyFormat)?.label || "—";
  const guestSignals = [
    state.guestsProfile?.children > 0 ? `${state.guestsProfile.children} enfant(s)` : null,
    state.guestsProfile?.pmr > 0 ? `${state.guestsProfile.pmr} PMR` : null,
    state.guestsProfile?.specialMeals > 0 ? `${state.guestsProfile.specialMeals} repas spéciaux` : null,
    state.guestsProfile?.speeches > 0 ? `${state.guestsProfile.speeches} discours` : null,
    state.orchestration?.shuttleNeeded ? "navettes" : null,
    state.orchestration?.accommodationNeeded ? "hébergements" : null,
  ].filter(Boolean);

  const phaseCards = useMemo(() => ([
    {
      title: "Avant",
      text: "Vision, invités, budget et docs regroupés au même endroit.",
    },
    {
      title: "Jour J",
      text: "Rappels, plans B et alertes pour tenir le tempo.",
    },
    {
      title: "Après",
      text: "Paiements, médias et remerciements gardent le même fil.",
    },
  ]), []);

  const mobileTimeline = useMemo(
    () => (state.timeline?.steps || []).filter((step) => step.status !== "done").slice(0, 4),
    [state.timeline?.steps],
  );
  const mobileDocs = useMemo(
    () => (state.documents || []).filter((doc) => !["prêt", "partagé", "complet"].includes(doc.status)).slice(0, 4),
    [state.documents],
  );
  const mobileBudgetDecisions = useMemo(
    () => (state.budget?.decisions || []).filter((item) => item.status === "pending").slice(0, 3),
    [state.budget?.decisions],
  );
  const mobilePayments = useMemo(
    () => (state.vendors?.payments || []).filter((item) => item.status !== "paid").slice(0, 4),
    [state.vendors?.payments],
  );
  const mobileNextAction = roleData.primaryAction || state.reminders.find((item) => item.status === "open") || null;

  const triggerSignal = (signalId) => {
    const signal = WEDDING_SIGNALS.find((item) => item.id === signalId);
    if (!signal) return;
    setState((current) => applyWeddingSignal(current, signalId));
    toast.success(`Onde propagée : ${signal.label}`);
  };

  const resetScenario = () => {
    if (typeof window !== "undefined") window.localStorage.removeItem(AIME_WEDDING_STORAGE_KEY);
    setState(createDefaultWeddingState());
    toast.success("Scénario Point Zéro réinitialisé");
  };

  const completeReminder = (id) => {
    setState((current) => ({
      ...current,
      reminders: current.reminders.map((item) => item.id === id ? { ...item, status: "done" } : item),
    }));
    toast.success("Rappel marqué comme fait");
  };

  const toggleAutomation = (id) => {
    setState((current) => ({
      ...current,
      automations: current.automations.map((item) => item.id === id ? {
        ...item,
        enabled: !item.enabled,
        status: !item.enabled ? "armé" : "veille",
      } : item),
    }));
  };

  const touchDocument = (id) => {
    setState((current) => ({
      ...current,
      documents: current.documents.map((doc) => doc.id === id ? {
        ...doc,
        status: doc.status === "prêt" ? "partagé" : "prêt",
        updatedAt: new Date().toISOString(),
      } : doc),
    }));
    toast.success("Document synchronisé");
  };

  const renderTab = () => {
    switch (activeTab) {
      case "reminders":
        return (
          <div className="space-y-3">
            {roleData.reminders.length === 0 && <EmptyState text="Aucun rappel visible pour cette vue rôle." />}
            {roleData.reminders.map((reminder) => (
              <div key={reminder.id} className="rounded-[24px] border border-black/8 bg-black/[0.02] p-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-zinc-950">{reminder.title}</div>
                  <div className="text-xs text-zinc-500 mt-1 uppercase tracking-[0.16em]">{reminder.owner} · {reminder.priority} · {reminder.context}</div>
                  <div className="text-sm text-zinc-600 mt-2">Échéance : {fmtShortDateTime(reminder.dueAt)}</div>
                </div>
                <button
                  disabled={reminder.status === "done"}
                  onClick={() => completeReminder(reminder.id)}
                  className={`rounded-full px-4 py-2 text-sm inline-flex items-center gap-2 ${reminder.status === "done" ? "bg-emerald-100 text-emerald-700 cursor-default" : "bg-black text-white hover:bg-zinc-800"}`}
                >
                  <Check className="w-4 h-4" />
                  {reminder.status === "done" ? "Fait" : "Marquer fait"}
                </button>
              </div>
            ))}
          </div>
        );
      case "automations":
        return (
          <div className="space-y-3">
            {roleData.automations.map((automation) => (
              <div key={automation.id} className="rounded-[24px] border border-black/8 bg-black/[0.02] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold text-zinc-950">{automation.title}</div>
                    <div className="text-xs uppercase tracking-[0.16em] text-zinc-500 mt-2">{automation.trigger}</div>
                    <p className="text-sm text-zinc-600 mt-3 leading-relaxed">{automation.effect}</p>
                    <div className="text-xs text-zinc-500 mt-3">Dernier run : {automation.lastRunAt ? fmtShortDateTime(automation.lastRunAt) : "jamais"}</div>
                  </div>
                  <button
                    onClick={() => toggleAutomation(automation.id)}
                    className={`rounded-full px-4 py-2 text-sm ${automation.enabled ? "bg-black text-white" : "border border-black/8 text-zinc-700 bg-white"}`}
                  >
                    {automation.enabled ? "Actif" : "Activer"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      case "dayj":
        return (
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-4">
            <div className="rounded-[24px] border border-black/8 bg-black/[0.02] p-5">
              <div className="aime-label text-zinc-500">Mode Jour J</div>
              <div className="text-2xl font-display mt-3 text-zinc-950">{roleConfig.label} voit seulement l'essentiel.</div>
              <p className="text-sm text-zinc-600 mt-3 leading-relaxed">{roleConfig.intro}</p>
              <ul className="mt-5 space-y-2 text-sm text-zinc-700">
                <li>• Toujours un plan B pour chaque alerte critique</li>
                <li>• Jamais plus de 5 impacts simultanés</li>
                <li>• Toujours relier une alerte à un rappel ou à un document</li>
                <li>• Toujours protéger l'expérience du couple</li>
              </ul>
              <Link to="/jour-j" className="mt-5 inline-flex items-center gap-2 rounded-full bg-black text-white px-4 py-2 text-sm hover:bg-zinc-800">
                Ouvrir la timeline live
              </Link>
            </div>
            <div className="rounded-[24px] border border-black/8 bg-black/[0.02] p-5">
              <div className="aime-label text-zinc-500">Dernière onde</div>
              <div className="text-xl font-semibold mt-3 text-zinc-950">{latestRipple.title}</div>
              <p className="text-sm text-zinc-600 mt-3 leading-relaxed">{compactText(latestRipple.summary, 98)}</p>
              <div className="mt-5 space-y-3">
                {(latestRipple.impacts || []).slice(0, 4).map((impact, index) => (
                  <div key={`${impact.scope}-${index}`} className="rounded-[18px] border border-black/8 bg-white p-3.5">
                    <div className="aime-label text-zinc-500">{impact.scope}</div>
                    <div className="text-sm text-zinc-800 mt-2 leading-relaxed">{compactText(impact.text, 84)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case "docs":
        return (
          <div className="space-y-4">
            {roleData.documents.length === 0 && <EmptyState text="Aucun document partagé dans cette vue rôle." />}
            {roleData.documents.map((doc) => (
              <div key={doc.id} className="rounded-[24px] border border-black/8 bg-black/[0.02] p-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-zinc-950">{doc.title}</div>
                  <div className="text-xs text-zinc-500 mt-1">Owner : {doc.owner} · partagé avec {doc.sharedWith.join(", ")}</div>
                  <div className="text-xs text-zinc-500 mt-2">Dernière mise à jour : {fmtShortDateTime(doc.updatedAt)}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-black/8 bg-white px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-zinc-700">
                    {doc.status}
                  </span>
                  <button onClick={() => touchDocument(doc.id)} className="rounded-full bg-black text-white px-4 py-2 text-sm hover:bg-zinc-800">
                    Marquer prêt
                  </button>
                </div>
              </div>
            ))}
            <div className="rounded-[24px] border border-black/8 bg-white p-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-zinc-950">Besoin d'éditer les checklists, notes et statuts ?</div>
                <div className="text-sm text-zinc-600 mt-2">Ouvrez le module Documents pour travailler document par document avec plus de précision.</div>
              </div>
              <Link to="/documents" className="aime-button-primary rounded-full px-4 py-2 text-sm">
                Ouvrir le module Docs
              </Link>
            </div>
          </div>
        );
      case "after":
        return (
          <div className="grid md:grid-cols-2 gap-4">
            {state.aftercare.map((item) => (
              <div key={item.id} className="rounded-[24px] border border-black/8 bg-black/[0.02] p-4">
                <div className="text-lg font-semibold text-zinc-950">{item.title}</div>
                <div className="text-xs text-zinc-500 uppercase tracking-[0.18em] mt-3">{item.status}</div>
              </div>
            ))}
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              {phaseCards.map((item) => (
                <div key={item.title} className="rounded-[26px] border border-black/8 bg-black/[0.02] p-5">
                  <div className="text-2xl font-display text-zinc-950">{item.title}</div>
                  <p className="text-sm text-zinc-600 mt-3 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
            <div className="grid lg:grid-cols-3 gap-4">
              <div className="rounded-[26px] border border-black/8 bg-black/[0.02] p-5">
                <div className="aime-label text-zinc-500">Rappels visibles</div>
                <div className="text-4xl font-display mt-3 text-zinc-950">{openReminders.length}</div>
                <p className="text-sm text-zinc-600 mt-3 leading-relaxed">Rappels datés et assignés.</p>
              </div>
              <div className="rounded-[26px] border border-black/8 bg-black/[0.02] p-5">
                <div className="aime-label text-zinc-500">Automations actives</div>
                <div className="text-4xl font-display mt-3 text-zinc-950">{activeAutomations.length}</div>
                <p className="text-sm text-zinc-600 mt-3 leading-relaxed">Seulement les automatismes utiles.</p>
              </div>
              <div className="rounded-[26px] border border-black/8 bg-black/[0.02] p-5">
                <div className="aime-label text-zinc-500">Docs concernés</div>
                <div className="text-4xl font-display mt-3 text-zinc-950">{roleData.docsNeedingAttention.length}</div>
                <p className="text-sm text-zinc-600 mt-3 leading-relaxed">Seulement les docs à actionner.</p>
              </div>
            </div>
            <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-4">
              <div className="rounded-[26px] border border-black/8 bg-black/[0.02] p-5">
                <div className="aime-label text-zinc-500">Cadre initial</div>
                <div className="text-2xl font-display mt-3 text-zinc-950">{coordinationLabel}</div>
                <p className="text-sm text-zinc-600 mt-3 leading-relaxed">Cérémonie {ceremonyLabel.toLowerCase()} · plan B {state.orchestration?.planBWeatherReady ? "prêt" : "à construire"}.</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {guestSignals.length > 0 ? guestSignals.map((item) => (
                    <span key={item} className="rounded-full border border-black/8 bg-white px-3 py-1.5 text-xs text-zinc-700">
                      {item}
                    </span>
                  )) : (
                    <span className="rounded-full border border-black/8 bg-white px-3 py-1.5 text-xs text-zinc-700">
                      Aucun signal invité particulier
                    </span>
                  )}
                </div>
              </div>
              <div className="rounded-[26px] border border-black/8 bg-black/[0.02] p-5">
                <div className="aime-label text-zinc-500">Conséquences immédiates</div>
                <div className="space-y-3 mt-4 text-sm text-zinc-700">
                  <div className="rounded-[18px] border border-black/8 bg-white p-4">Des rappels setup existent déjà si PMR, repas spéciaux, discours, navettes ou hébergements sont concernés.</div>
                  <div className="rounded-[18px] border border-black/8 bg-white p-4">Le cadre alimente directement Couple, Exports, Planner et Jour J.</div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] text-[var(--color-text-primary)] overflow-x-hidden">
      <div className="bg-[var(--color-black)] text-[var(--color-text-on-dark)]">
        <div className="max-w-[1480px] mx-auto px-5 md:px-8 lg:px-10 py-5 md:py-7">

          <div className="pb-10 md:pb-12">
            <WeddingPageHero
              eyebrow="Point Zéro · orchestration · arbitrages"
              title="Le cockpit planner du mariage."
              description="Rappels, docs, budget, alertes et Jour J dans une seule vue."
              image="/landing/zeus.jpg"
              stats={[
                { label: "Rappels", value: openReminders.length, hint: "ouverts" },
                { label: "Automations", value: activeAutomations.length, hint: "armées" },
                { label: "Docs", value: roleData.docsNeedingAttention.length, hint: "à revoir" },
                { label: "Risque", value: meta.globalRisk, hint: "global" },
              ]}
            />
            {!setupReady && (
              <div className="mt-4 rounded-[24px] border border-white/10 bg-white/[0.04] p-4 text-sm text-white/72 leading-relaxed max-w-2xl">
                Setup non finalisé : couple, date, lieu, budget et docs de départ sont encore à cadrer.
              </div>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-[1480px] mx-auto px-5 md:px-8 lg:px-10 -mt-10 relative z-10 pb-16 md:pb-20">
        <section className="md:hidden mb-6 space-y-4">
          <div className="overflow-x-auto no-scrollbar -mx-1 px-1">
            <div className="flex gap-2 min-w-max">
              <MobileSectionButton active={mobileSection === "today"} onClick={() => setMobileSection("today")}>Aujourd’hui</MobileSectionButton>
              <MobileSectionButton active={mobileSection === "validate"} onClick={() => setMobileSection("validate")}>À valider</MobileSectionButton>
              <MobileSectionButton active={mobileSection === "vendors"} onClick={() => setMobileSection("vendors")}>Prestataires</MobileSectionButton>
              <MobileSectionButton active={mobileSection === "payments"} onClick={() => setMobileSection("payments")}>Paiements</MobileSectionButton>
              <MobileSectionButton active={mobileSection === "dayj"} onClick={() => setMobileSection("dayj")}>Jour J</MobileSectionButton>
            </div>
          </div>

          {mobileSection === "today" && (
            <MobileListCard
              title="Aujourd’hui"
              eyebrow="Le plus utile maintenant"
              action={<span className="text-xs text-zinc-500">{notifications.length} alertes</span>}
            >
              <div className="space-y-3">
                {mobileNextAction && (
                  <div className="rounded-[22px] border border-black/8 bg-black text-white p-4">
                    <div className="aime-label text-white/45 mb-2">Prochaine action</div>
                    <div className="text-base font-semibold">{mobileNextAction.title}</div>
                    <div className="text-sm text-white/68 mt-2">{fmtShortDateTime(mobileNextAction.dueAt)}</div>
                  </div>
                )}
                {notifications.slice(0, 3).map((item) => (
                  <div key={item.id} className="rounded-[20px] border border-black/8 bg-black/[0.02] p-4">
                    <div className="text-sm font-semibold text-zinc-950">{item.title}</div>
                    <div className="text-sm text-zinc-600 mt-2">{compactText(item.text, 82)}</div>
                  </div>
                ))}
                {mobileTimeline[0] && (
                  <Link to="/jour-j" className="block rounded-[20px] border border-black/8 bg-white p-4">
                    <div className="aime-label text-zinc-500 mb-2">Jour J</div>
                    <div className="text-sm font-semibold text-zinc-950">{mobileTimeline[0].time} · {mobileTimeline[0].title}</div>
                    <div className="text-sm text-zinc-600 mt-2">{compactText(mobileTimeline[0].detail, 82)}</div>
                  </Link>
                )}
              </div>
            </MobileListCard>
          )}

          {mobileSection === "validate" && (
            <MobileListCard title="À valider" eyebrow="Docs, arbitrages, rappels">
              <div className="space-y-3">
                {openReminders.slice(0, 3).map((item) => (
                  <div key={item.id} className="rounded-[20px] border border-black/8 bg-white p-4 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-zinc-950">{item.title}</div>
                      <div className="text-xs text-zinc-500 mt-2">{fmtShortDateTime(item.dueAt)}</div>
                    </div>
                    <button onClick={() => completeReminder(item.id)} className="rounded-full bg-black text-white px-3 py-2 text-xs">Fait</button>
                  </div>
                ))}
                {mobileDocs.slice(0, 2).map((doc) => (
                  <Link key={doc.id} to="/documents" className="block rounded-[20px] border border-black/8 bg-black/[0.02] p-4">
                    <div className="text-sm font-semibold text-zinc-950">{doc.title}</div>
                    <div className="text-xs text-zinc-500 mt-2 uppercase tracking-[0.16em]">{doc.status}</div>
                  </Link>
                ))}
                {mobileBudgetDecisions.slice(0, 2).map((decision) => (
                  <Link key={decision.id} to="/budget" className="block rounded-[20px] border border-black/8 bg-black/[0.02] p-4">
                    <div className="text-sm font-semibold text-zinc-950">{decision.title}</div>
                    <div className="text-sm text-zinc-600 mt-2">{fmtMoney(decision.amount)}</div>
                  </Link>
                ))}
              </div>
            </MobileListCard>
          )}

          {mobileSection === "vendors" && (
            <MobileListCard title="Prestataires" eyebrow="Marketplace mariage" action={<Link to="/prestataires" className="text-xs text-zinc-500">Voir tout</Link>}>
              <div className="space-y-3">
                {vendorMarketplace.slice(0, 4).map((vendor) => (
                  <div key={vendor.id} className="rounded-[20px] border border-black/8 bg-white p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-zinc-950">{vendor.name}</div>
                        <div className="text-xs text-zinc-500 mt-2 uppercase tracking-[0.16em]">{vendor.city} · {VENDOR_TAXONOMY.find((item) => item.id === vendor.category)?.label || vendor.category}</div>
                      </div>
                      <Store className="w-4 h-4 text-zinc-500" />
                    </div>
                    <div className="text-sm text-zinc-600 mt-3">{fmtMoney(vendor.priceFrom)} · réponse {vendor.responseTime}</div>
                  </div>
                ))}
              </div>
            </MobileListCard>
          )}

          {mobileSection === "payments" && (
            <MobileListCard title="Paiements" eyebrow="Acomptes & soldes" action={<Link to="/budget" className="text-xs text-zinc-500">Ouvrir budget</Link>}>
              <div className="rounded-[20px] border border-black/8 bg-black text-white p-4 mb-3">
                <div className="aime-label text-white/45 mb-2">À payer</div>
                <div className="text-2xl font-display">{fmtMoney(vendorPaymentSummary.due)}</div>
                <div className="text-sm text-white/68 mt-2">{vendorPaymentSummary.openCount} paiement(s) ouverts</div>
              </div>
              <div className="space-y-3">
                {mobilePayments.map((payment) => {
                  const vendor = (state.vendors?.marketplace || []).find((item) => item.id === payment.vendorId);
                  return (
                    <Link key={payment.id} to="/budget" className="block rounded-[20px] border border-black/8 bg-white p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-zinc-950">{vendor?.name || "Prestataire"}</div>
                          <div className="text-xs text-zinc-500 mt-2">{payment.label}</div>
                        </div>
                        <CreditCard className="w-4 h-4 text-zinc-500" />
                      </div>
                      <div className="text-sm text-zinc-600 mt-3">{fmtMoney(payment.amount)} · {VENDOR_PAYMENT_STATUS[payment.status]?.label || payment.status}</div>
                    </Link>
                  );
                })}
              </div>
            </MobileListCard>
          )}

          {mobileSection === "dayj" && (
            <MobileListCard title="Jour J" eyebrow="Timeline simple" action={<Link to="/jour-j" className="text-xs text-zinc-500">Ouvrir</Link>}>
              <div className="space-y-3">
                {mobileTimeline.map((step) => (
                  <Link key={step.id} to="/jour-j" className="block rounded-[20px] border border-black/8 bg-white p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-semibold text-zinc-950">{step.time} · {step.title}</div>
                      <span className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">{step.status}</span>
                    </div>
                    <div className="text-sm text-zinc-600 mt-2">{compactText(step.detail, 84)}</div>
                  </Link>
                ))}
              </div>
            </MobileListCard>
          )}
        </section>

        <div className="hidden md:grid gap-4 xl:grid-cols-[0.95fr_1.1fr_0.85fr] items-start">
          <div className="space-y-4">
            <Card
              title="Déclencher une onde"
              eyebrow="Décisions · incidents · variations"
              action={
                <button onClick={resetScenario} className="rounded-full border border-black/8 bg-white px-4 py-2 text-sm text-zinc-700 hover:bg-black/[0.03] inline-flex items-center gap-2">
                  <RefreshCcw className="w-4 h-4" />
                  Reset
                </button>
              }
            >
              <div className="space-y-3">
                {WEDDING_SIGNALS.map((signal) => (
                  <button
                    key={signal.id}
                    onClick={() => triggerSignal(signal.id)}
                    className="w-full rounded-[24px] border border-black/8 bg-black/[0.02] px-4 py-4 text-left hover:bg-black/[0.04] transition-colors"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-zinc-950">{signal.title}</div>
                        <div className="aime-label text-zinc-500 mt-2">{signal.label}</div>
                      </div>
                      <Sparkles className="w-4 h-4 text-zinc-400" />
                    </div>
                    <p className="mt-3 text-sm text-zinc-600 leading-relaxed">{compactText(signal.summary, 90)}</p>
                  </button>
                ))}
              </div>
            </Card>

            <Card title="Rôles visibles" eyebrow={roleConfig.eyebrow}>
              <div className="rounded-[24px] border border-black/8 bg-black/[0.02] p-4 mb-4">
                <p className="text-sm text-zinc-700 leading-relaxed">{roleConfig.intro}</p>
                <p className="text-xs text-zinc-500 mt-3">{roleConfig.hideNote}</p>
              </div>
              <div className="space-y-3">
                {roleData.roles.map((role) => {
                  const linkedVendor = (state.vendors?.marketplace || []).find((item) => item.roleId === role.id);
                  const linkedContact = state.contacts?.[role.id] || state.contacts?.planning;
                  return (
                    <div key={role.id} className="rounded-[22px] border border-black/8 bg-black/[0.02] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-zinc-950">{role.label}</div>
                          <div className="text-xs text-zinc-500 mt-1">{role.owner}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          {linkedContact && <ContactAvatarMenu contact={linkedContact} vendorId={linkedVendor?.id || null} size="sm" />}
                          <span className="rounded-full border border-black/8 bg-white px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-zinc-700">{role.status}</span>
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-zinc-600 leading-relaxed">{compactText(role.note, 88)}</p>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card
              title="Le cockpit central"
              eyebrow="Vue unique · pas de bruit inutile"
              action={
                <div className="flex flex-wrap items-center gap-2">
                  {WEDDING_TABS.map((item) => (
                    <TabButton key={item.id} active={activeTab === item.id} onClick={() => setTab(item.id)}>{item.label}</TabButton>
                  ))}
                  <Link to="/documents" className="rounded-full border border-black/8 bg-white px-4 py-2 text-sm text-zinc-700 hover:bg-black/[0.03]">
                    Module Docs
                  </Link>
                </div>
              }
            >
              {renderTab()}
            </Card>

            <Card title="Programme du jour" eyebrow="Rythme opérationnel">
              <div className="grid md:grid-cols-2 gap-4">
                {state.programme.map((item) => (
                  <div key={item.time} className="rounded-[24px] border border-black/8 bg-black/[0.02] p-4">
                    <div className="aime-label text-zinc-500">{item.time}</div>
                    <div className="text-lg font-semibold text-zinc-950 mt-2">{item.title}</div>
                    <p className="mt-2 text-sm text-zinc-600 leading-relaxed">{compactText(item.detail, 76)}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card title="Prochaine action" eyebrow="Ce qui doit se passer ensuite">
              {roleData.primaryAction ? (
                <div className="rounded-[24px] border border-black/8 bg-black text-white p-5">
                  <div className="aime-label text-white/45">{roleData.primaryAction.owner}</div>
                  <div className="text-2xl font-display mt-3">{roleData.primaryAction.title}</div>
                  <div className="text-sm text-white/65 mt-3">Échéance : {fmtShortDateTime(roleData.primaryAction.dueAt)}</div>
                  <div className="text-sm text-white/65 mt-2 uppercase tracking-[0.16em]">{roleData.primaryAction.priority}</div>
                </div>
              ) : (
                <EmptyState text="Aucune prochaine action critique dans cette vue rôle." />
              )}
            </Card>

            <Card title="Onde active" eyebrow="Impact visible">
              <div className="rounded-[24px] border border-black/8 bg-black text-white p-5">
                <div className="aime-label text-white/45">{latestRipple.signal}</div>
                <div className="text-2xl font-display mt-3">{latestRipple.title}</div>
                <p className="mt-3 text-sm text-white/65 leading-relaxed">{compactText(latestRipple.summary, 96)}</p>
              </div>
              <div className="space-y-3 mt-4">
                {(latestRipple.impacts || []).slice(0, 4).map((impact, index) => (
                  <div key={`${impact.scope}-${index}`} className="rounded-[22px] border border-black/8 bg-white p-4">
                    <div className="aime-label text-zinc-500">{impact.scope}</div>
                    <div className="text-sm text-zinc-800 mt-2 leading-relaxed">{compactText(impact.text, 84)}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Discipline produit" eyebrow="Règles simples">
              <div className="space-y-3 text-sm text-zinc-700">
                <Rule icon={ShieldCheck} text="Toujours un plan B pour chaque alerte critique." />
                <Rule icon={Activity} text="Jamais plus de 5 impacts simultanés à l'écran." />
                <Rule icon={AlertTriangle} text="Toujours transformer une alerte en rappel ou en action claire." />
                <Rule icon={HeartHandshake} text="Toujours protéger l'expérience du couple avant le bruit." />
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="rounded-[24px] border border-black/8 bg-black/[0.02] p-5 text-sm text-zinc-600 leading-relaxed">
      {text}
    </div>
  );
}
