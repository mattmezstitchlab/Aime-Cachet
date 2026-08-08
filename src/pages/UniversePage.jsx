import React, { useMemo } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  ArrowUpRight,
  MoveRight,
} from "lucide-react";
import {
  filterDocumentsByRole,
  filterTimelineByRole,
  getBudgetSummary,
  getCommunicationsForRole,
  getGuestSummary,
  getHouseholdOverview,
  getInvitationSummary,
  getNotesForRole,
  getNotificationsForRole,
  getSmartCalendarItems,
  getTableOverview,
  getVendorCommitmentSummary,
  getVendorMarketplace,
  getVendorPaymentSummary,
  readWeddingState,
} from "@/lib/aimeWeddingCore";
import { getUniverseById, UNIVERSE_GRADIENTS } from "@/lib/aimeUniverses";

const moneyFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

function formatMoney(value) {
  return moneyFormatter.format(value || 0);
}

function formatShortDate(value) {
  if (!value) return "À planifier";
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
  });
}

function compactText(value, max = 120) {
  if (!value) return "";
  const clean = value.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cutoff = clean.lastIndexOf(" ", max);
  return `${clean.slice(0, cutoff > 48 ? cutoff : max).trim()}…`;
}

function dotClass(level = "neutral") {
  if (level === "critical") return "bg-[#d96868]";
  if (level === "warning") return "bg-[#d8a14b]";
  if (level === "calm") return "bg-[#69b48f]";
  return "bg-black/20";
}

function Surface({ children, className = "" }) {
  return (
    <section className={`rounded-[32px] border border-black/8 bg-white shadow-[0_18px_48px_rgba(12,12,12,0.06)] ${className}`}>
      {children}
    </section>
  );
}

function SectionHeading({ eyebrow, title, action = null }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        {eyebrow && <div className="aime-label text-zinc-500 mb-2">{eyebrow}</div>}
        <h2 className="text-[1.55rem] md:text-[1.8rem] font-display leading-[1.02] text-zinc-950">{title}</h2>
      </div>
      {action}
    </div>
  );
}

function HeroStat({ label, value, detail }) {
  return (
    <div className="rounded-[24px] border border-white/12 bg-white/[0.06] p-4 md:p-5">
      <div className="text-[11px] uppercase tracking-[0.18em] text-white/52">{label}</div>
      <div className="mt-2 text-[1.9rem] md:text-[2.2rem] leading-none font-display text-white">{value}</div>
      {detail && <div className="mt-2 text-sm text-white/62 leading-relaxed">{detail}</div>}
    </div>
  );
}

function UniverseHero({ universe, heroStats = [], heroCtas = [] }) {
  const gradient = UNIVERSE_GRADIENTS[universe.id];

  return (
    <section className="relative overflow-hidden rounded-[38px] bg-[var(--color-black)] text-white shadow-[0_24px_70px_rgba(0,0,0,0.12)]">
      <img src={universe.image} alt={universe.title} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.16),rgba(0,0,0,0.84))]" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_24%)]" aria-hidden="true" />

      <div className="relative z-10 grid min-h-[420px] gap-8 px-5 py-6 md:min-h-[500px] md:px-8 md:py-8 lg:grid-cols-[1.04fr_0.96fr] lg:px-10 lg:py-10">
        <div className="max-w-3xl self-end">
          <div
            className="inline-flex rounded-full px-4 py-2 text-[14px] font-semibold italic text-white shadow-[0_14px_30px_rgba(0,0,0,0.18)]"
            style={{ background: gradient }}
          >
            {universe.label}
          </div>
          <div className="mt-4 text-[11px] uppercase tracking-[0.2em] text-white/54">{universe.subtitle}</div>
          <h1 className="mt-4 font-display text-[2.8rem] leading-[0.94] tracking-[var(--tracking-display)] text-white sm:text-[4rem] lg:text-[5.35rem]">
            {universe.title}
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-[1.65] text-white/72 md:text-[17px]">
            {universe.visualHook}
          </p>

          {heroCtas.length > 0 && (
            <div className="mt-7 flex flex-wrap gap-2.5">
              {heroCtas.map((item, index) => (
                <Link
                  key={`${item.to}-${item.label}`}
                  to={item.to}
                  className={index === 0
                    ? "aime-button-primary rounded-full px-5 py-3 text-sm font-medium inline-flex items-center gap-2"
                    : "rounded-full border border-white/14 bg-white/[0.04] px-5 py-3 text-sm text-white/88 hover:bg-white/[0.08] inline-flex items-center gap-2 transition-colors"
                  }
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-4 self-end sm:grid-cols-2">
          {heroStats.map((item) => (
            <HeroStat key={item.label} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TriptychCard({ title, text, universeId }) {
  return (
    <Surface className="p-5 md:p-6">
      <div className="flex items-center gap-3">
        <span className={`h-2.5 w-2.5 rounded-full ${dotClass("neutral")}`} style={{ background: undefined }} />
        <div
          className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold italic text-white"
          style={{ background: UNIVERSE_GRADIENTS[universeId] }}
        >
          {title}
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-zinc-600 md:text-[15px]">{text}</p>
    </Surface>
  );
}

function RailStat({ label, value, detail }) {
  return (
    <div className="rounded-[24px] border border-black/8 bg-white p-4">
      <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">{label}</div>
      <div className="mt-3 text-[1.45rem] leading-none font-display text-zinc-950">{value}</div>
      {detail && <div className="mt-2 text-sm text-zinc-600 leading-relaxed">{detail}</div>}
    </div>
  );
}

function SummaryItem({ item }) {
  const content = (
    <div className="rounded-[24px] border border-black/8 bg-white p-4 transition-colors hover:bg-black/[0.02]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <span className={`h-2.5 w-2.5 rounded-full ${dotClass(item.tone || "neutral")}`} />
            <div className="text-sm font-semibold text-zinc-950">{item.title}</div>
          </div>
          <div className="mt-2 pl-[22px] text-sm leading-relaxed text-zinc-600">{item.detail}</div>
          {item.meta && <div className="mt-2 pl-[22px] text-[11px] uppercase tracking-[0.16em] text-zinc-500">{item.meta}</div>}
        </div>
        {item.to && <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-zinc-400" />}
      </div>
    </div>
  );

  if (!item.to) return content;
  return <Link to={item.to}>{content}</Link>;
}

function ToolCard({ item }) {
  return (
    <Link to={item.to} className="group rounded-[24px] border border-black/8 bg-[var(--color-warm-white)] p-4 transition-colors hover:bg-black/[0.03]">
      <div className="flex items-start justify-between gap-3">
        <div>
          {item.eyebrow && <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">{item.eyebrow}</div>}
          <div className="mt-2 text-sm font-semibold text-zinc-950">{item.title}</div>
          <div className="mt-2 text-sm leading-relaxed text-zinc-600">{item.detail}</div>
        </div>
        <MoveRight className="mt-1 h-4 w-4 shrink-0 text-zinc-400 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

function FooterBand({ universeId, title, text, primary, secondary }) {
  return (
    <section
      className="mt-10 overflow-hidden rounded-[34px] border border-black/8 p-6 md:p-8 text-white shadow-[0_18px_48px_rgba(12,12,12,0.08)]"
      style={{ background: UNIVERSE_GRADIENTS[universeId] }}
    >
      <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-white/66">Maison source</div>
          <h3 className="mt-3 text-[2rem] leading-[0.98] font-display">{title}</h3>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/82 md:text-[15px]">{text}</p>
        </div>
        <div className="flex flex-wrap gap-2.5 lg:justify-end">
          {primary && (
            <Link to={primary.to} className="rounded-full bg-black px-5 py-3 text-sm text-white hover:bg-zinc-900">
              {primary.label}
            </Link>
          )}
          {secondary && (
            <Link to={secondary.to} className="rounded-full border border-white/18 bg-white/10 px-5 py-3 text-sm text-white hover:bg-white/14">
              {secondary.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

function buildUniversePageData(state, universe) {
  const meta = state.meta || {};
  const guestPortal = state.guestPortal || {};
  const notificationsPlanner = getNotificationsForRole(state, "planner");
  const docsPlanner = filterDocumentsByRole(state.documents || [], "planner");
  const docsVendors = filterDocumentsByRole(state.documents || [], "vendors");
  const timelinePlanner = filterTimelineByRole(state.timeline?.steps || [], "planner");
  const guestSummary = getGuestSummary(state);
  const invitationSummary = getInvitationSummary(state);
  const households = getHouseholdOverview(state);
  const tables = getTableOverview(state);
  const budgetSummary = getBudgetSummary(state);
  const vendorPaymentSummary = getVendorPaymentSummary(state);
  const vendorCommitmentSummary = getVendorCommitmentSummary(state);
  const communications = getCommunicationsForRole(state, "planner");
  const notes = getNotesForRole(state, "planner");
  const smartCalendar = getSmartCalendarItems(state, "planner");
  const allVendors = getVendorMarketplace(state, "all");
  const creativeVendors = allVendors.filter((vendor) => ["flowers-decor", "photo-video", "music", "beauty"].includes(vendor.category));
  const opsVendors = allVendors.filter((vendor) => ["venue", "catering", "transport"].includes(vendor.category));
  const docsPending = docsPlanner.filter((doc) => !["prêt", "partagé", "complet"].includes(doc.status));
  const nextStep = timelinePlanner.find((item) => item.status !== "done");
  const criticalSignals = notificationsPlanner.filter((item) => item.level === "critical").length;
  const warningSignals = notificationsPlanner.filter((item) => item.level === "warning").length;
  const activeAutomations = (state.automations || []).filter((item) => item.enabled);
  const openReminders = (state.reminders || []).filter((item) => item.status !== "done");
  const sharedAudienceCount = new Set((communications || []).flatMap((item) => item.audience || [])).size;

  const commonFooter = {
    title: `${universe.label} reste une maison, pas une copie du produit.`,
    text: "La page univers montre la logique, les résumés utiles et les points d’entrée. Les données sources continuent de vivre dans leurs maisons respectives.",
  };

  if (universe.id === "zeus") {
    return {
      heroStats: [
        { label: "Signaux", value: notificationsPlanner.length, detail: `${criticalSignals} critique${criticalSignals > 1 ? "s" : ""}` },
        { label: "Docs mouvants", value: docsPending.length, detail: "Encore à verrouiller" },
        { label: "Paiements dus", value: formatMoney(vendorPaymentSummary.due), detail: `${vendorPaymentSummary.openCount} ouverts` },
        { label: "Budget restant", value: formatMoney(budgetSummary.remaining), detail: `${formatMoney(budgetSummary.pending)} à arbitrer` },
      ],
      heroCtas: [
        { to: "/point-zero", label: "Ouvrir Zeus" },
        { to: "/notifications?role=planner", label: "Voir Athéna" },
        { to: "/jour-j?role=planner", label: "Aller sur Arès" },
      ],
      intro: {
        title: "Zeus tient la vue souveraine du mariage.",
        text: "Il ne recrée pas les invités, le budget, les documents ou les messages. Il relie les maisons, montre les arbitrages qui changent réellement l’expérience, et maintient une lecture globale calme malgré la complexité du mariage.",
      },
      statRail: [
        { label: "RSVP attente", value: guestSummary.pending, detail: "Synthèse pointant vers Hestia" },
        { label: "Étapes actives", value: timelinePlanner.filter((item) => item.status !== "done").length, detail: "Synthèse pointant vers Arès" },
        { label: "Engagements ouverts", value: vendorCommitmentSummary.quotesPending + vendorCommitmentSummary.contractsPending + vendorCommitmentSummary.invoicesOpen, detail: "Synthèse pointant vers Hermès / Budget" },
        { label: "Risque global", value: meta.globalRisk || 0, detail: `${warningSignals} signal${warningSignals > 1 ? "aux" : ""} utiles` },
      ],
      focus: {
        eyebrow: "Métier principal",
        title: "Ce que Zeus arbitre vraiment",
        description: "Zeus centralise la tension utile entre budget, invités, diffusion, documents et terrain. Il sert à décider vite, à protéger le couple, et à éviter que chaque micro-sujet devienne une nouvelle charge mentale.",
        bullets: [
          "Montrer uniquement les écarts qui changent vraiment le mariage.",
          "Ne jamais dupliquer une surface d’édition d’une autre maison.",
          "Faire pointer les synthèses vers Hestia, Athéna, Hermès, Déméter ou Arès.",
        ],
        cta: { to: "/point-zero", label: "Ouvrir la homepage Planner" },
      },
      focusItemsTitle: "Les bascules en cours",
      focusItems: notificationsPlanner.slice(0, 4).map((item) => ({
        title: item.title,
        detail: compactText(item.text, 132),
        tone: item.level,
        to: item.href,
        meta: item.source,
      })),
      tools: {
        eyebrow: "Outils liés",
        title: "Les maisons que Zeus active",
        items: [
          { eyebrow: "Athéna", title: "Alertes & anticipation", detail: "Ouvrir les signaux, rappels et zones de fragilité du mariage.", to: "/notifications?role=planner" },
          { eyebrow: "Déméter", title: "Budget & arbitrages", detail: "Lire ce qui reste dû, ce qui dépasse, et ce qui doit être tranché.", to: "/budget" },
          { eyebrow: "Hestia", title: "Invités & foyers", detail: "Voir les RSVP en attente, les tables et les besoins spéciaux sans les dupliquer ici.", to: "/invites?role=planner" },
          { eyebrow: "Arès", title: "Jour J & terrain", detail: "Ouvrir les séquences live, le rythme du jour et la prochaine fenêtre critique.", to: "/jour-j?role=planner" },
        ],
      },
      integrations: {
        eyebrow: "Intégrations",
        title: "Résumés connectés",
        items: [
          { title: "Hestia", detail: `${guestSummary.pending} RSVP en attente · ${households.length} foyers · ${tables.length} tables`, tone: "warning", to: "/invites?role=planner" },
          { title: "Déméter", detail: `${formatMoney(vendorPaymentSummary.due)} dus · ${formatMoney(budgetSummary.pending)} à arbitrer`, tone: "warning", to: "/budget" },
          { title: "Hermès", detail: communications[0] ? `${communications[0].title} · ${compactText(communications[0].text, 96)}` : "Aucune diffusion récente visible.", tone: communications[0] ? "calm" : "neutral", to: "/communication?role=planner" },
          { title: "Arès", detail: nextStep ? `${nextStep.time} · ${nextStep.title}` : "Aucune étape active.", tone: nextStep ? "warning" : "neutral", to: "/jour-j?role=planner" },
        ],
      },
      footer: {
        ...commonFooter,
        primary: { to: "/point-zero", label: "Homepage Planner" },
        secondary: { to: "/couple", label: "Voir la homepage Mariés" },
      },
    };
  }

  if (universe.id === "hestia") {
    return {
      heroStats: [
        { label: "Invités", value: guestSummary.total, detail: `${guestSummary.confirmed} confirmés` },
        { label: "Foyers", value: households.length, detail: `${tables.length} tables actives` },
        { label: "Invitations", value: invitationSummary.sent + invitationSummary.opened, detail: `${invitationSummary.opened} ouvertes` },
        { label: "Besoins sensibles", value: guestSummary.allergies + guestSummary.vegetarian + guestSummary.pmr, detail: "Allergies, végé, PMR" },
      ],
      heroCtas: [
        { to: "/invites?role=planner", label: "Ouvrir Hestia" },
        { to: "/espace-invites", label: "Voir le portail invités" },
        { to: "/couple", label: "Homepage Mariés" },
      ],
      intro: {
        title: "Hestia est la maison source des invités.",
        text: "RSVP, foyers, tables, accueil, besoins alimentaires, enfants, PMR, hébergements et douceur relationnelle vivent ici. Les autres pages peuvent en montrer une synthèse, jamais une copie concurrente ni une autre version éditable.",
      },
      statRail: [
        { label: "RSVP attente", value: guestSummary.pending, detail: "Réponses encore à obtenir" },
        { label: "Invitations brouillon", value: invitationSummary.draft, detail: "Encore non envoyées" },
        { label: "Accès soirée", value: invitationSummary.eveningOnly, detail: "Invités soirée uniquement" },
        { label: "PMR", value: guestSummary.pmr, detail: "Besoin d’accessibilité identifié" },
      ],
      focus: {
        eyebrow: "Métier principal",
        title: "Ce que Hestia protège",
        description: "Hestia ne gère pas seulement une liste. Elle tient la manière dont les personnes vivent le mariage : l’accueil, la clarté, la transmission aux proches, et la capacité à absorber des profils différents sans friction ni oubli silencieux.",
        bullets: [
          "Un foyer = une lecture claire, pas une juxtaposition d’individus isolés.",
          "Les tables, repas spéciaux et besoins terrain pointent ensuite vers Déméter et Arès.",
          "Le portail invités reste la traduction douce de cette maison, pas une autre source.",
        ],
        cta: { to: "/invites?role=planner", label: "Ouvrir le registre invités" },
      },
      focusItemsTitle: "Ce que Hestia remonte maintenant",
      focusItems: [
        { title: "Foyers en attente", detail: `${households.filter((item) => item.pending > 0).length} foyers ont encore au moins une réponse en attente.`, tone: guestSummary.pending > 0 ? "warning" : "calm", to: "/invites?role=planner" },
        { title: "Plan de table", detail: `${tables.length} tables pour ${guestSummary.confirmed} confirmés. ${guestSummary.allergies + guestSummary.vegetarian} repas spéciaux à absorber.`, tone: "warning", to: "/invites?role=planner" },
        { title: "Portail invités", detail: `${(guestPortal.accommodations || []).length} hébergements · ${(guestPortal.shuttles || []).length} navettes · ${(guestPortal.faq || []).length} réponses utiles.`, tone: "calm", to: "/espace-invites" },
        { title: "Accessibilité & accueil", detail: `${guestSummary.pmr} besoin${guestSummary.pmr > 1 ? "s" : ""} PMR identifiés côté invités.`, tone: guestSummary.pmr > 0 ? "warning" : "neutral", to: "/documents" },
      ],
      tools: {
        eyebrow: "Outils liés",
        title: "Les prolongements naturels d’Hestia",
        items: [
          { eyebrow: "Mariés", title: "Homepage Mariés", detail: "Une lecture calme qui reprend seulement les priorités invitées utiles au couple.", to: "/couple" },
          { eyebrow: "Invités", title: "Portail invités", detail: "La traduction claire de la maison Hestia pour répondre, venir et se rassurer.", to: "/espace-invites" },
          { eyebrow: "Déméter", title: "Repas & régimes", detail: "Les repas spéciaux restent connectés au service et au budget sans recréer la liste invités.", to: "/budget" },
          { eyebrow: "Artémis", title: "Venir & séjourner", detail: "Accès, hébergements et circulation prolongent l’accueil sans dupliquer le foyer invité.", to: "/univers/artemis" },
        ],
      },
      integrations: {
        eyebrow: "Intégrations",
        title: "Résumés connectés",
        items: [
          { title: "Déméter", detail: `${guestSummary.allergies} allergies · ${guestSummary.vegetarian} végétariens · ${guestSummary.children} repas enfants`, tone: "warning", to: "/budget" },
          { title: "Hermès", detail: `${invitationSummary.sent + invitationSummary.opened} invitations diffusées · ${invitationSummary.opened} déjà ouvertes`, tone: "calm", to: "/communication?role=planner" },
          { title: "Artémis", detail: `${(guestPortal.accommodations || []).length} hébergements et ${(guestPortal.shuttles || []).length} navettes proposées`, tone: "neutral", to: "/espace-invites" },
          { title: "Zeus", detail: `${guestSummary.pending} réponses en attente restent visibles au cockpit, sans copie des données invitées.`, tone: guestSummary.pending > 0 ? "warning" : "calm", to: "/point-zero" },
        ],
      },
      footer: {
        ...commonFooter,
        primary: { to: "/invites?role=planner", label: "Ouvrir Hestia" },
        secondary: { to: "/espace-invites", label: "Voir le portail invités" },
      },
    };
  }

  if (universe.id === "athena") {
    return {
      heroStats: [
        { label: "Alertes", value: notificationsPlanner.length, detail: `${criticalSignals} critique${criticalSignals > 1 ? "s" : ""}` },
        { label: "Rappels", value: openReminders.length, detail: "Encore ouverts" },
        { label: "Automations", value: activeAutomations.length, detail: "Actives" },
        { label: "Décalage", value: `${meta.scheduleShiftMinutes || 0} min`, detail: "Impact programme" },
      ],
      heroCtas: [
        { to: "/notifications?role=planner", label: "Ouvrir Athéna" },
        { to: "/jour-j?role=planner", label: "Voir Arès" },
        { to: "/documents?role=planner", label: "Docs impactés" },
      ],
      intro: {
        title: "Athéna ne montre pas plus. Elle montre plus tôt.",
        text: "La valeur d’Athéna n’est pas l’accumulation d’alertes. C’est la capacité à faire remonter assez tôt ce qui pourrait casser le rythme, le confort ou la lisibilité du mariage, avant que le problème ne devienne bruyant.",
      },
      statRail: [
        { label: "Signaux critiques", value: criticalSignals, detail: "À arbitrer d’abord" },
        { label: "Signaux warning", value: warningSignals, detail: "À absorber vite" },
        { label: "Docs impactés", value: docsPending.length, detail: "Liés aux alertes actives" },
        { label: "Fenêtres proches", value: smartCalendar.length, detail: "Prochains points de passage" },
      ],
      focus: {
        eyebrow: "Métier principal",
        title: "Ce qu’Athéna anticipe",
        description: "Météo, retards, documents incomplets, contrat manquant, surcharge dîner, circulation invités ou bascule terrain : Athéna assemble les dépendances faibles avant qu’elles ne se transforment en urgence opérationnelle ou émotionnelle.",
        bullets: [
          "Une alerte n’existe que si elle mène à une décision ou à un geste clair.",
          "Le rôle d’Athéna est de protéger le tempo du mariage, pas de produire du stress.",
          "Les alertes doivent toujours pointer vers la maison qui contient la donnée source et l’action réelle.",
        ],
        cta: { to: "/notifications?role=planner", label: "Ouvrir le centre d’alertes" },
      },
      focusItemsTitle: "Ce qu’Athéna voit avant les autres",
      focusItems: notificationsPlanner.slice(0, 4).map((item) => ({
        title: item.title,
        detail: compactText(item.text, 132),
        tone: item.level,
        to: item.href,
        meta: item.source,
      })),
      tools: {
        eyebrow: "Outils liés",
        title: "Les maisons qu’Athéna mobilise",
        items: [
          { eyebrow: "Zeus", title: "Cockpit global", detail: "Quand l’anticipation doit remonter à une vue souveraine et plus synthétique.", to: "/point-zero" },
          { eyebrow: "Arès", title: "Jour J & exécution", detail: "Quand un signal doit devenir une consigne ou une bascule terrain concrète.", to: "/jour-j?role=planner" },
          { eyebrow: "Héphaïstos", title: "Documents impactés", detail: "Quand une alerte exige de corriger, relire ou redistribuer un support précis.", to: "/documents?role=planner" },
          { eyebrow: "Hermès", title: "Diffusion rapide", detail: "Quand la bonne information doit partir vite au bon public, sans bruit latéral.", to: "/communication?role=planner" },
        ],
      },
      integrations: {
        eyebrow: "Intégrations",
        title: "Résumés connectés",
        items: [
          { title: "Automations actives", detail: activeAutomations.length > 0 ? activeAutomations.slice(0, 2).map((item) => item.title).join(" · ") : "Aucune automation active visible.", tone: activeAutomations.length > 0 ? "calm" : "neutral" },
          { title: "Rappels ouverts", detail: openReminders.length > 0 ? openReminders.slice(0, 2).map((item) => item.title).join(" · ") : "Aucun rappel encore ouvert.", tone: openReminders.length > 0 ? "warning" : "calm" },
          { title: "Fenêtre suivante", detail: smartCalendar[0] ? `${smartCalendar[0].title} · ${smartCalendar[0].detail}` : "Aucun point de passage imminent.", tone: smartCalendar[0]?.level === "high" ? "warning" : "neutral" },
          { title: "Notes planner", detail: notes[0] ? `${notes[0].title} · ${compactText(notes[0].text, 92)}` : "Aucune note visible.", tone: notes[0] ? "calm" : "neutral" },
        ],
      },
      footer: {
        ...commonFooter,
        primary: { to: "/notifications?role=planner", label: "Ouvrir Athéna" },
        secondary: { to: "/jour-j?role=planner", label: "Aller sur Arès" },
      },
    };
  }

  if (universe.id === "hermes") {
    return {
      heroStats: [
        { label: "Messages", value: communications.length, detail: "Historique visible" },
        { label: "Audiences", value: sharedAudienceCount, detail: "Actives" },
        { label: "Docs partagés", value: docsVendors.length, detail: "Visibles côté équipes" },
        { label: "Pièces ouvertes", value: vendorCommitmentSummary.quotesPending + vendorCommitmentSummary.contractsPending, detail: "Demandant une réponse" },
      ],
      heroCtas: [
        { to: "/communication?role=planner", label: "Ouvrir Hermès" },
        { to: "/documents?role=planner", label: "Voir les pièces" },
        { to: "/espace-invites", label: "Voir le portail invités" },
      ],
      intro: {
        title: "Hermès ne parle pas plus fort. Il parle plus juste.",
        text: "Le sujet n’est pas d’avoir plus de messages. Le sujet est d’envoyer la bonne information, au bon public, au bon moment, avec la bonne pièce jointe et sans créer une seconde réalité hors du système.",
      },
      statRail: [
        { label: "Dernier envoi", value: communications[0] ? formatShortDate(communications[0].sentAt) : "—", detail: communications[0]?.title || "Aucun message récent" },
        { label: "Portail invités", value: (guestPortal.faq || []).length, detail: "FAQ utiles publiées" },
        { label: "Documents visibles", value: docsVendors.length, detail: "Partagés aux équipes" },
        { label: "Relances attendues", value: vendorCommitmentSummary.contractsPending + vendorCommitmentSummary.quotesPending, detail: "Côté prestataires" },
      ],
      focus: {
        eyebrow: "Métier principal",
        title: "Ce que Hermès sécurise",
        description: "Un mariage se fragilise quand l’information part trop tard, au mauvais canal ou sans la bonne pièce. Hermès coordonne la diffusion utile entre couple, invités, planner et prestataires, sans recréer des données ni des versions parallèles.",
        bullets: [
          "Un message doit toujours s’appuyer sur une source claire dans le système.",
          "Une diffusion ne vaut que si son public est juste et si elle évite le bruit.",
          "Les documents partagés doivent rester reliés à leur maison source, pas copiés dans une conversation.",
        ],
        cta: { to: "/communication?role=planner", label: "Ouvrir le centre de diffusion" },
      },
      focusItemsTitle: "Ce qu’Hermès fait circuler",
      focusItems: communications.length > 0
        ? communications.slice(0, 4).map((item) => ({
            title: item.title,
            detail: compactText(item.text, 132),
            tone: "calm",
            to: "/communication?role=planner",
            meta: `${(item.audience || []).join(" · ") || "all"}`,
          }))
        : [
            { title: "Aucune diffusion récente", detail: "Hermès reste prêt à diffuser au bon moment, sans surcharger la lecture du mariage.", tone: "neutral", to: "/communication?role=planner" },
          ],
      tools: {
        eyebrow: "Outils liés",
        title: "Les prolongements utiles d’Hermès",
        items: [
          { eyebrow: "Invités", title: "Portail invités", detail: "FAQ, infos venir & séjourner, RSVP et rassurance publique du mariage.", to: "/espace-invites" },
          { eyebrow: "Prestataires", title: "Portail prestataires", detail: "Messages opérationnels, pièces partagées et mission terrain simplifiée.", to: "/prestataires" },
          { eyebrow: "Héphaïstos", title: "Documents & supports", detail: "Lorsque le message dépend d’une version documentaire précise à relire ou à joindre.", to: "/documents?role=planner" },
          { eyebrow: "Zeus", title: "Cockpit global", detail: "Quand la communication devient un vrai arbitrage inter-maisons et doit remonter au cockpit.", to: "/point-zero" },
        ],
      },
      integrations: {
        eyebrow: "Intégrations",
        title: "Résumés connectés",
        items: [
          { title: "Dernière diffusion", detail: communications[0] ? `${communications[0].title} · ${compactText(communications[0].text, 96)}` : "Aucune diffusion récente.", tone: communications[0] ? "calm" : "neutral" },
          { title: "Pièces partagées", detail: `${docsVendors.length} documents visibles côté prestataires, liés à leurs sources.`, tone: docsVendors.length > 0 ? "calm" : "neutral", to: "/documents?role=vendors" },
          { title: "Invités", detail: `${invitationSummary.sent + invitationSummary.opened} invitations diffusées · ${(guestPortal.faq || []).length} FAQ · ${(guestPortal.shuttles || []).length} navettes`, tone: "neutral", to: "/espace-invites" },
          { title: "Engagements prestataires", detail: `${vendorCommitmentSummary.quotesPending} devis et ${vendorCommitmentSummary.contractsPending} contrats attendent encore une boucle de réponse.`, tone: vendorCommitmentSummary.contractsPending > 0 ? "warning" : "neutral", to: "/prestataires" },
        ],
      },
      footer: {
        ...commonFooter,
        primary: { to: "/communication?role=planner", label: "Ouvrir Hermès" },
        secondary: { to: "/documents?role=planner", label: "Voir les documents" },
      },
    };
  }

  return {
    heroStats: [
      { label: "Prestataires", value: allVendors.length, detail: "visibles" },
      { label: "Docs", value: docsPending.length, detail: "à revoir" },
      { label: "Étapes", value: timelinePlanner.filter((item) => item.status !== "done").length, detail: "actives" },
      { label: "Signaux", value: notificationsPlanner.length, detail: "liés" },
    ],
    heroCtas: [
      { to: universe.moduleRoute, label: "Ouvrir le module" },
      { to: "/documents?role=planner", label: "Documents" },
    ],
    intro: {
      title: `${universe.label} a sa propre maison dans le mariage.`,
      text: "Chaque univers est une couche claire du système. Il possède son métier, son langage, ses outils et ses résumés connectés aux autres maisons sans jamais devenir un doublon d’information.",
    },
    statRail: [
      { label: "Compte à rebours", value: meta.countdownDays > 0 ? `J-${meta.countdownDays}` : "Aujourd’hui", detail: meta.venue || "Lieu" },
      { label: "Invités", value: guestSummary.total, detail: `${guestSummary.confirmed} confirmés` },
      { label: "Budget", value: formatMoney(budgetSummary.remaining), detail: "restant" },
      { label: "Messages", value: communications.length, detail: "historiques" },
    ],
    focus: {
      eyebrow: "Métier principal",
      title: `Ce que ${universe.label} tient dans le système`,
      description: universe.visualHook,
      bullets: [
        "Une maison claire, lisible et reliée au reste du mariage.",
        "Des résumés utiles pointant vers les bonnes données sources.",
        "Des outils concrets sans duplication des surfaces d’édition.",
      ],
      cta: { to: universe.moduleRoute, label: "Ouvrir le module lié" },
    },
    focusItemsTitle: "Repères utiles maintenant",
    focusItems: [
      { title: notes[0]?.title || "Vue globale stable", detail: notes[0] ? compactText(notes[0].text, 132) : "Le système reste stable pour le moment.", tone: notes[0] ? "calm" : "neutral" },
      { title: nextStep ? `${nextStep.time} · ${nextStep.title}` : "Aucune étape active", detail: nextStep ? compactText(nextStep.detail, 120) : "Le prochain jalon apparaîtra ici.", tone: nextStep ? "warning" : "neutral", to: "/jour-j?role=planner" },
      { title: communications[0]?.title || "Aucune diffusion récente", detail: communications[0] ? compactText(communications[0].text, 120) : "Les messages utiles apparaîtront ici.", tone: communications[0] ? "calm" : "neutral", to: "/communication?role=planner" },
      { title: docsPending[0]?.title || "Aucun document mouvant", detail: docsPending[0] ? compactText(docsPending[0].summary, 120) : "Tous les documents visibles sont stables.", tone: docsPending[0] ? "warning" : "calm", to: "/documents?role=planner" },
    ],
    tools: {
      eyebrow: "Outils liés",
      title: "Entrées utiles",
      items: [
        { eyebrow: "Module", title: "Module principal", detail: "L’entrée la plus directe pour travailler cette maison dans le produit actuel.", to: universe.moduleRoute },
        { eyebrow: "Zeus", title: "Cockpit planner", detail: "Voir comment cette maison remonte dans la lecture globale du mariage.", to: "/point-zero" },
        { eyebrow: "Arès", title: "Jour J", detail: "Comprendre l’impact terrain et les séquences liées à cette maison.", to: "/jour-j?role=planner" },
        { eyebrow: "Héphaïstos", title: "Documents", detail: "Relire, partager ou stabiliser les supports nécessaires.", to: "/documents?role=planner" },
      ],
    },
    integrations: {
      eyebrow: "Intégrations",
      title: "Résumés connectés",
      items: [
        { title: "Budget vivant", detail: `${formatMoney(vendorPaymentSummary.due)} dus · ${formatMoney(budgetSummary.pending)} à arbitrer`, tone: "warning", to: "/budget" },
        { title: "Invités", detail: `${guestSummary.pending} RSVP attente · ${tables.length} tables · ${households.length} foyers`, tone: guestSummary.pending > 0 ? "warning" : "neutral", to: "/invites?role=planner" },
        { title: "Prestataires créatifs", detail: `${creativeVendors.length} créatifs · ${opsVendors.length} opérationnels`, tone: "neutral", to: "/prestataires" },
        { title: "Fenêtre prochaine", detail: smartCalendar[0] ? `${smartCalendar[0].title} · ${smartCalendar[0].detail}` : "Aucune échéance proche visible.", tone: smartCalendar[0]?.level === "high" ? "warning" : "neutral" },
      ],
    },
    footer: {
      ...commonFooter,
      primary: { to: universe.moduleRoute, label: "Ouvrir le module" },
      secondary: { to: "/point-zero", label: "Retour au cockpit" },
    },
  };
}

export default function UniversePage() {
  const { universeId } = useParams();
  const universe = getUniverseById(universeId);
  const state = useMemo(() => readWeddingState(), []);

  if (!universe) {
    return <Navigate to="/" replace />;
  }

  const page = buildUniversePageData(state, universe);

  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] text-[var(--color-text-primary)] overflow-x-hidden">
      <div className="mx-auto max-w-[1320px] px-5 pb-12 pt-4 md:px-8 md:pb-16 lg:px-10">
        <UniverseHero universe={universe} heroStats={page.heroStats} heroCtas={page.heroCtas} />

        <section className="mt-10 max-w-[980px]">
          <div className="aime-label text-zinc-500 mb-3">Introduction</div>
          <h2 className="text-[2rem] md:text-[2.4rem] font-display leading-[0.98] text-zinc-950">{page.intro.title}</h2>
          <p className="mt-4 text-sm leading-relaxed text-zinc-600 md:max-w-[78ch] md:text-[15px]">
            {page.intro.text}
          </p>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          {universe.columns.map((column) => (
            <TriptychCard key={column.title} title={column.title} text={column.text} universeId={universe.id} />
          ))}
        </section>

        <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {page.statRail.map((item) => (
            <RailStat key={item.label} {...item} />
          ))}
        </section>

        <section className="mt-10 grid gap-4 xl:grid-cols-[1.02fr_0.98fr]">
          <Surface className="p-5 md:p-6">
            <SectionHeading eyebrow={page.focus.eyebrow} title={page.focus.title} />
            <p className="mt-5 text-sm leading-relaxed text-zinc-600 md:text-[15px]">{page.focus.description}</p>
            <div className="mt-5 space-y-3">
              {page.focus.bullets.map((bullet) => (
                <div key={bullet} className="rounded-[22px] border border-black/8 bg-[var(--color-warm-white)] px-4 py-4 text-sm leading-relaxed text-zinc-700">
                  {bullet}
                </div>
              ))}
            </div>
            <div className="mt-5">
              <Link to={page.focus.cta.to} className="rounded-full bg-black px-5 py-3 text-sm text-white hover:bg-zinc-800 inline-flex items-center gap-2">
                {page.focus.cta.label}
              </Link>
            </div>
          </Surface>

          <Surface className="p-5 md:p-6">
            <SectionHeading eyebrow="Résumé vivant" title={page.focusItemsTitle} />
            <div className="mt-5 space-y-3">
              {page.focusItems.map((item) => (
                <SummaryItem key={`${item.title}-${item.detail}`} item={item} />
              ))}
            </div>
          </Surface>
        </section>

        <section className="mt-10 grid gap-4 xl:grid-cols-[1.02fr_0.98fr]">
          <Surface className="p-5 md:p-6">
            <SectionHeading eyebrow={page.tools.eyebrow} title={page.tools.title} />
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {page.tools.items.map((item) => (
                <ToolCard key={`${item.to}-${item.title}`} item={item} />
              ))}
            </div>
          </Surface>

          <Surface className="p-5 md:p-6">
            <SectionHeading eyebrow={page.integrations.eyebrow} title={page.integrations.title} />
            <div className="mt-5 space-y-3">
              {page.integrations.items.map((item) => (
                <SummaryItem key={`${item.title}-${item.detail}`} item={item} />
              ))}
            </div>
          </Surface>
        </section>

        <FooterBand universeId={universe.id} {...page.footer} />
      </div>
    </div>
  );
}
