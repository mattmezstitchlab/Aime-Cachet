import React from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  Bell,
  Calendar,
  CreditCard,
  FileText,
  Heart,
  MapPin,
  MessageSquare,
  Music,
  Sparkles,
  Users,
} from "lucide-react";
import {
  filterDocumentsByRole,
  filterTimelineByRole,
  getBudgetSummary,
  getGuestSummary,
  getHouseholdOverview,
  getInvitationSummary,
  getNotesForRole,
  getNotificationsForRole,
  getSmartCalendarItems,
  getTableOverview,
  getVendorCommitmentSummary,
  getVendorCommitments,
  getVendorMarketplace,
  getVendorPaymentSummary,
  readWeddingState,
} from "@/lib/aimeWeddingCore";
import { getUniverseById, UNIVERSE_GRADIENTS } from "@/lib/aimeUniverses";

function compactText(value, max = 86) {
  if (!value) return "";
  const clean = value.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cutoff = clean.lastIndexOf(" ", max);
  return `${clean.slice(0, cutoff > 44 ? cutoff : max).trim()}…`;
}

function fmtMoney(value) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value || 0);
}

function UniverseHero({ universe }) {
  const gradient = UNIVERSE_GRADIENTS[universe.id];
  return (
    <section className="relative -mt-20 md:-mt-24 min-h-[82svh] overflow-hidden bg-[var(--color-black)] text-white">
      <img src={universe.image} alt={universe.title} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.12),rgba(0,0,0,0.72))]" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_26%)]" aria-hidden="true" />

      <div className="relative z-10 min-h-[82svh] flex items-end px-5 md:px-8 lg:px-10 pb-10 md:pb-12 pt-24 md:pt-28">
        <div className="w-full max-w-[1480px] mx-auto">
          <div className="grid lg:grid-cols-[1.04fr_0.96fr] gap-8 items-end">
            <div className="max-w-4xl">
              <div className="inline-flex rounded-full px-4 py-2 text-[15px] font-semibold italic text-white shadow-[0_14px_30px_rgba(0,0,0,0.18)]" style={{ background: gradient }}>
                {universe.label}
              </div>
              <h1 className="mt-5 font-display text-[2.8rem] sm:text-[4.6rem] lg:text-[6rem] leading-[0.9] tracking-[var(--tracking-display)] text-white">
                {universe.title}
              </h1>
              <p className="mt-5 max-w-2xl text-[15px] md:text-[18px] text-white/68 leading-[var(--leading-body)]">
                {universe.visualHook}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 self-end">
              {universe.previewStats.map((item) => (
                <div key={item.label} className="rounded-[22px] border border-white/10 bg-white/[0.05] p-4 backdrop-blur-xl">
                  <div className="aime-label text-white/42">{item.label}</div>
                  <div className="text-[30px] md:text-[36px] font-display mt-2.5 text-white">{item.value}</div>
                  {item.hint && <p className="text-xs text-white/56 mt-2 leading-relaxed">{item.hint}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ActionChip({ to, icon: Icon, label }) {
  return (
    <Link to={to} className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2.5 text-sm text-white hover:bg-zinc-800">
      {Icon && <Icon className="w-4 h-4" />}
      {label}
    </Link>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 py-3 border-b border-black/8 last:border-b-0">
      <div className="text-sm text-zinc-500">{label}</div>
      <div className="text-sm font-medium text-zinc-950 text-right">{value}</div>
    </div>
  );
}

function ColumnPanel({ title, text, actions = [], rows = [] }) {
  return (
    <section className="py-8 md:py-9 first:pt-0 md:px-6 first:md:pl-0 last:md:pr-0">
      <div className="text-[11px] md:text-[12px] uppercase tracking-[0.16em] text-zinc-500 mb-4">{title}</div>
      <p className="max-w-[30ch] text-[15px] md:text-[18px] leading-[1.8] text-zinc-700">{text}</p>
      {actions.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {actions.map((item) => (
            <ActionChip key={`${item.to}-${item.label}`} {...item} />
          ))}
        </div>
      )}
      {rows.length > 0 && (
        <div className="mt-6">
          {rows.map((row) => (
            <InfoRow key={row.label} {...row} />
          ))}
        </div>
      )}
    </section>
  );
}

function Surface({ title, children, action = null }) {
  return (
    <section className="rounded-[32px] border border-black/8 bg-white overflow-hidden shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
      <div className="px-5 md:px-6 py-4 border-b border-black/8 flex items-center justify-between gap-3">
        <h2 className="text-zinc-950 text-lg md:text-xl font-semibold">{title}</h2>
        {action}
      </div>
      <div className="p-5 md:p-6">{children}</div>
    </section>
  );
}

function BulletList({ items }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.title} className="rounded-[24px] border border-black/8 bg-black/[0.02] p-4">
          <div className="text-sm font-semibold text-zinc-950">{item.title}</div>
          <div className="text-sm text-zinc-600 mt-2">{item.text}</div>
        </div>
      ))}
    </div>
  );
}

function getUniverseContent(state, universe) {
  const notificationsPlanner = getNotificationsForRole(state, "planner");
  const guestSummary = getGuestSummary(state);
  const invitationSummary = getInvitationSummary(state);
  const households = getHouseholdOverview(state);
  const tables = getTableOverview(state);
  const budgetSummary = getBudgetSummary(state);
  const paymentSummary = getVendorPaymentSummary(state);
  const commitmentSummary = getVendorCommitmentSummary(state);
  const docsPlanner = filterDocumentsByRole(state.documents || [], "planner");
  const docsVendors = filterDocumentsByRole(state.documents || [], "vendors");
  const timelinePlanner = filterTimelineByRole(state.timeline?.steps || [], "planner");
  const notesPlanner = getNotesForRole(state, "planner");
  const calendarCouple = getSmartCalendarItems(state, "couple");
  const venueVendors = getVendorMarketplace(state, "venue");
  const musicVendors = getVendorMarketplace(state, "music");
  const imageVendors = getVendorMarketplace(state, "photo-video");
  const allVendors = getVendorMarketplace(state, "all");
  const communicationHistory = state.communications?.history || [];
  const openCommitments = getVendorCommitments(state).filter((item) => ["received", "sent", "missing", "due", "scheduled"].includes(item.status));

  switch (universe.id) {
    case "zeus":
      return {
        previewStats: [
          { label: "Rappels", value: notificationsPlanner.filter((item) => item.type === "reminder").length, hint: "ouverts" },
          { label: "Docs", value: docsPlanner.filter((doc) => !["prêt", "partagé", "complet"].includes(doc.status)).length, hint: "à revoir" },
          { label: "Paiements", value: fmtMoney(paymentSummary.due), hint: "à lancer" },
          { label: "Risque", value: state.meta?.globalRisk || 0, hint: "global" },
        ],
        columns: [
          {
            ...universe.columns[0],
            actions: [
              { to: "/couple", label: "Espace couple", icon: Heart },
              { to: "/budget", label: "Budget", icon: CreditCard },
            ],
            rows: [
              { label: "Décisions ouvertes", value: notificationsPlanner.filter((item) => item.type === "budget").length },
              { label: "Documents prêts", value: docsPlanner.filter((doc) => ["prêt", "partagé", "complet"].includes(doc.status)).length },
            ],
          },
          {
            ...universe.columns[1],
            actions: [
              { to: "/point-zero", label: "Ouvrir Point Zéro", icon: Sparkles },
              { to: "/notifications", label: "Alertes", icon: Bell },
            ],
            rows: [
              { label: "Rappels ouverts", value: notificationsPlanner.filter((item) => item.type === "reminder").length },
              { label: "Onde active", value: state.rippleLog?.[0]?.signal || "—" },
            ],
          },
          {
            ...universe.columns[2],
            actions: [
              { to: "/documents", label: "Documents", icon: FileText },
              { to: "/jour-j", label: "Jour J", icon: Calendar },
            ],
            rows: [
              { label: "Paiements dus", value: fmtMoney(paymentSummary.due) },
              { label: "Prochaine étape", value: timelinePlanner.find((item) => item.status !== "done")?.title || "—" },
            ],
          },
        ],
        surfaces: [
          {
            title: "Ce que Zeus remonte maintenant",
            items: notificationsPlanner.slice(0, 6).map((item) => ({ title: item.title, text: compactText(item.text, 92) })),
          },
          {
            title: "Temps forts de la journée",
            items: timelinePlanner.slice(0, 6).map((item) => ({ title: `${item.time} · ${item.title}`, text: compactText(item.detail, 92) })),
          },
        ],
      };
    case "poseidon":
      return {
        previewStats: [
          { label: "Ambiances", value: musicVendors.length, hint: "sources" },
          { label: "Moments", value: timelinePlanner.filter((item) => ["cocktail-photos", "ouverture-bal", "dancefloor"].includes(item.id)).length, hint: "concernés" },
          { label: "Ouverture", value: "21:45", hint: "de bal" },
          { label: "After", value: "23:15", hint: "prévu" },
        ],
        columns: [
          {
            ...universe.columns[0],
            actions: [{ to: "/jour-j", label: "Fil de la soirée", icon: Calendar }],
            rows: [
              { label: "Ouverture de bal", value: "21:45" },
              { label: "Dancefloor", value: "23:15" },
            ],
          },
          {
            ...universe.columns[1],
            actions: [{ to: "/prestataires?category=music", label: "Prestataires son", icon: Music }],
            rows: [
              { label: "DJ / son", value: musicVendors[0]?.name || "Atelier Sonore" },
              { label: "Prochaine échéance", value: openCommitments.find((item) => item.vendorId === "music_sonore")?.label || "Aucune" },
            ],
          },
          {
            ...universe.columns[2],
            actions: [{ to: "/prestataires/music_sonore", label: "Fiche son", icon: CreditCard }],
            rows: [
              { label: "Paiements ouverts", value: paymentSummary.openCount },
              { label: "Soirée protégée", value: "Oui" },
            ],
          },
        ],
        surfaces: [
          {
            title: "Séquences concernées",
            items: timelinePlanner.filter((item) => ["cocktail-photos", "ouverture-bal", "dancefloor"].includes(item.id)).map((item) => ({ title: `${item.time} · ${item.title}`, text: compactText(item.detail, 92) })),
          },
        ],
      };
    case "athena":
      return {
        previewStats: [
          { label: "Alertes", value: notificationsPlanner.length, hint: "utiles" },
          { label: "Automations", value: state.automations?.filter((item) => item.enabled).length || 0, hint: "actives" },
          { label: "Rappels", value: state.reminders?.filter((item) => item.status === "open").length || 0, hint: "ouverts" },
          { label: "Décalage", value: `${state.meta?.scheduleShiftMinutes || 0} min`, hint: "programme" },
        ],
        columns: [
          {
            ...universe.columns[0],
            actions: [{ to: "/couple", label: "Vue couple", icon: Heart }],
            rows: [
              { label: "À valider", value: notificationsPlanner.filter((item) => item.level !== "info").length },
              { label: "Prochaine décision", value: state.reminders?.find((item) => item.status === "open")?.title || "—" },
            ],
          },
          {
            ...universe.columns[1],
            actions: [{ to: "/notifications", label: "Centre d’alertes", icon: Bell }, { to: "/point-zero?section=reminders", label: "Rappels", icon: Calendar }],
            rows: [
              { label: "Automations actives", value: state.automations?.filter((item) => item.enabled).length || 0 },
              { label: "Confiance setup", value: state.setup?.completed ? "Élevée" : "À cadrer" },
            ],
          },
          {
            ...universe.columns[2],
            actions: [{ to: "/documents", label: "Docs impactés", icon: FileText }],
            rows: [
              { label: "Docs à mettre à jour", value: docsPlanner.filter((doc) => !["prêt", "partagé", "complet"].includes(doc.status)).length },
              { label: "Retards suivis", value: notificationsPlanner.filter((item) => item.title.toLowerCase().includes("retard")).length },
            ],
          },
        ],
        surfaces: [
          {
            title: "Alertes d’Athéna",
            items: notificationsPlanner.slice(0, 6).map((item) => ({ title: item.title, text: compactText(item.text, 92) })),
          },
        ],
      };
    case "aphrodite":
      return {
        previewStats: [
          { label: "Notes", value: notesPlanner.length, hint: "créatives" },
          { label: "Docs", value: docsPlanner.length, hint: "liés" },
          { label: "Fleurs", value: getVendorMarketplace(state, "flowers-decor").length, hint: "prestataires" },
          { label: "Palette", value: "4", hint: "axes" },
        ],
        columns: [
          {
            ...universe.columns[0],
            actions: [{ to: "/documents", label: "Moodboard & docs", icon: FileText }],
            rows: [
              { label: "Direction active", value: notesPlanner[0]?.title || "Vue globale stable" },
              { label: "Scéno à confirmer", value: getVendorMarketplace(state, "flowers-decor").length },
            ],
          },
          {
            ...universe.columns[1],
            actions: [{ to: "/prestataires?category=flowers-decor", label: "Fleurs & déco", icon: Sparkles }],
            rows: [
              { label: "Prestataire clé", value: getVendorMarketplace(state, "flowers-decor")[0]?.name || "Ligne Florale" },
              { label: "Document principal", value: docsPlanner.find((doc) => doc.id === "plan_salle")?.title || "Plan de salle" },
            ],
          },
          {
            ...universe.columns[2],
            actions: [{ to: "/documents", label: "Plan de salle", icon: MapPin }],
            rows: [
              { label: "Ambiance tenue", value: "Oui" },
              { label: "Plan B visuel", value: state.orchestration?.planBWeatherReady ? "Prêt" : "À construire" },
            ],
          },
        ],
        surfaces: [
          {
            title: "Repères esthétiques",
            items: notesPlanner.slice(0, 4).map((item) => ({ title: item.title, text: compactText(item.text, 92) })),
          },
        ],
      };
    case "apollon":
      return {
        previewStats: [
          { label: "Photo / vidéo", value: imageVendors.length, hint: "équipes" },
          { label: "Moments", value: timelinePlanner.filter((item) => ["ceremonie", "cocktail-photos"].includes(item.id)).length, hint: "captés" },
          { label: "Invités", value: guestSummary.total, hint: "concernés" },
          { label: "Galerie", value: "live", hint: "à venir" },
        ],
        columns: [
          {
            ...universe.columns[0],
            actions: [{ to: "/couple", label: "Vue couple", icon: Heart }],
            rows: [
              { label: "Moments clés", value: timelinePlanner.filter((item) => ["ceremonie", "cocktail-photos"].includes(item.id)).length },
              { label: "Compte invités", value: guestSummary.total },
            ],
          },
          {
            ...universe.columns[1],
            actions: [{ to: "/prestataires?category=photo-video", label: "Équipes image", icon: Sparkles }],
            rows: [
              { label: "Prestataire clé", value: imageVendors[0]?.name || "Studio Sillage" },
              { label: "Créneau sensible", value: "18:00" },
            ],
          },
          {
            ...universe.columns[2],
            actions: [{ to: "/espace-invites", label: "Espace invités", icon: Users }],
            rows: [
              { label: "Timeline utile", value: timelinePlanner.find((item) => item.id === "cocktail-photos")?.title || "Cocktail & photos" },
              { label: "Souvenirs protégés", value: "Oui" },
            ],
          },
        ],
        surfaces: [
          {
            title: "Temps image",
            items: timelinePlanner.filter((item) => ["ceremonie", "cocktail-photos", "ouverture-bal"].includes(item.id)).map((item) => ({ title: `${item.time} · ${item.title}`, text: compactText(item.detail, 92) })),
          },
        ],
      };
    case "hermes":
      return {
        previewStats: [
          { label: "Messages", value: communicationHistory.length, hint: "historique" },
          { label: "Docs partagés", value: docsVendors.length, hint: "visibles" },
          { label: "Audiences", value: new Set(communicationHistory.flatMap((item) => item.audience || [])).size, hint: "actives" },
          { label: "Relances", value: openCommitments.filter((item) => item.status === "sent").length, hint: "attendues" },
        ],
        columns: [
          {
            ...universe.columns[0],
            actions: [{ to: "/communication", label: "Centre de diffusion", icon: MessageSquare }],
            rows: [
              { label: "Dernier message", value: communicationHistory[0]?.title || "—" },
              { label: "Vue mariés", value: communicationHistory.filter((item) => item.audience?.includes("couple")).length },
            ],
          },
          {
            ...universe.columns[1],
            actions: [{ to: "/prestataires", label: "Partenaires concernés", icon: Users }],
            rows: [
              { label: "Conversations utiles", value: communicationHistory.length },
              { label: "Pièces en attente", value: openCommitments.length },
            ],
          },
          {
            ...universe.columns[2],
            actions: [{ to: "/documents", label: "Docs partagés", icon: FileText }],
            rows: [
              { label: "Documents visibles", value: docsVendors.length },
              { label: "Diffusions critiques", value: notificationsPlanner.filter((item) => item.type === "communication").length },
            ],
          },
        ],
        surfaces: [
          {
            title: "Dernières diffusions",
            items: communicationHistory.slice(0, 6).map((item) => ({ title: item.title, text: compactText(item.text, 92) })),
          },
        ],
      };
    case "ares":
      return {
        previewStats: [
          { label: "Étapes", value: timelinePlanner.length, hint: "pilotées" },
          { label: "Incidents", value: notificationsPlanner.filter((item) => item.title.toLowerCase().includes("retard") || item.title.toLowerCase().includes("signal")).length, hint: "suivis" },
          { label: "Montage", value: "ok", hint: "terrain" },
          { label: "Plan B", value: state.orchestration?.planBWeatherReady ? "prêt" : "à faire", hint: "météo" },
        ],
        columns: [
          {
            ...universe.columns[0],
            actions: [{ to: "/jour-j", label: "Timeline live", icon: Calendar }],
            rows: [
              { label: "Prochaine étape", value: timelinePlanner.find((item) => item.status !== "done")?.title || "—" },
              { label: "Compte à rebours", value: `${state.meta?.countdownDays || 0} jours` },
            ],
          },
          {
            ...universe.columns[1],
            actions: [{ to: "/prestataires", label: "Équipes terrain", icon: Users }],
            rows: [
              { label: "Prestataires visibles", value: allVendors.length },
              { label: "Signal à surveiller", value: state.rippleLog?.[0]?.signal || "—" },
            ],
          },
          {
            ...universe.columns[2],
            actions: [{ to: "/documents", label: "Plan salle & service", icon: MapPin }],
            rows: [
              { label: "Plan B", value: state.orchestration?.planBWeatherReady ? "Prêt" : "À faire" },
              { label: "Step critique", value: timelinePlanner.find((item) => item.status === "live")?.title || "—" },
            ],
          },
        ],
        surfaces: [
          {
            title: "Terrain en temps réel",
            items: timelinePlanner.slice(0, 6).map((item) => ({ title: `${item.time} · ${item.title}`, text: compactText(item.note || item.detail, 92) })),
          },
        ],
      };
    case "demeter":
      return {
        previewStats: [
          { label: "Budget", value: fmtMoney(budgetSummary.current), hint: "engagé" },
          { label: "Repas spéciaux", value: guestSummary.allergies + guestSummary.vegetarian + guestSummary.children, hint: "à gérer" },
          { label: "À payer", value: fmtMoney(paymentSummary.due), hint: "traiteur inclus" },
          { label: "Tables", value: tables.length, hint: "dressées" },
        ],
        columns: [
          {
            ...universe.columns[0],
            actions: [{ to: "/budget", label: "Budget", icon: CreditCard }],
            rows: [
              { label: "Budget engagé", value: fmtMoney(budgetSummary.current) },
              { label: "Budget restant", value: fmtMoney(budgetSummary.remaining) },
            ],
          },
          {
            ...universe.columns[1],
            actions: [{ to: "/invites", label: "Tables & invités", icon: Users }],
            rows: [
              { label: "Repas spéciaux", value: guestSummary.allergies + guestSummary.vegetarian + guestSummary.children },
              { label: "Traiteur", value: getVendorMarketplace(state, "catering")[0]?.name || "Maison Aurore" },
            ],
          },
          {
            ...universe.columns[2],
            actions: [{ to: "/documents", label: "Documents repas", icon: FileText }],
            rows: [
              { label: "Paiements dus", value: fmtMoney(paymentSummary.due) },
              { label: "Tables actives", value: tables.length },
            ],
          },
        ],
        surfaces: [
          {
            title: "Table & service",
            items: tables.slice(0, 6).map((item) => ({ title: item.id, text: `${item.guestCount} invités · ${item.allergies} allergies · ${item.vegetarian} végétariens` })),
          },
        ],
      };
    case "artemis":
      return {
        previewStats: [
          { label: "Lieux", value: venueVendors.length, hint: "visibles" },
          { label: "Ville", value: state.meta?.city || "—", hint: "cible" },
          { label: "Capacité", value: `${state.meta?.guests || 0}`, hint: "invités" },
          { label: "Plan B", value: state.orchestration?.planBWeatherReady ? "prêt" : "à faire", hint: "météo" },
        ],
        columns: [
          {
            ...universe.columns[0],
            actions: [{ to: "/prestataires?category=venue", label: "Voir les lieux", icon: MapPin }],
            rows: [
              { label: "Lieu actif", value: state.meta?.venue || "—" },
              { label: "Ville", value: state.meta?.city || "—" },
            ],
          },
          {
            ...universe.columns[1],
            actions: [{ to: "/setup", label: "Revenir au cadre", icon: Calendar }],
            rows: [
              { label: "Capacité visée", value: `${state.meta?.guests || 0} invités` },
              { label: "Prestataires lieux", value: venueVendors.length },
            ],
          },
          {
            ...universe.columns[2],
            actions: [{ to: "/documents", label: "Plan salle", icon: FileText }],
            rows: [
              { label: "Plan B météo", value: state.orchestration?.planBWeatherReady ? "Prêt" : "À construire" },
              { label: "Accessibilité", value: state.meta?.accessibility ? "À suivre" : "Stable" },
            ],
          },
        ],
        surfaces: [
          {
            title: "Lieux visibles",
            items: venueVendors.slice(0, 6).map((item) => ({ title: item.name, text: `${item.city} · ${fmtMoney(item.priceFrom)} · ${item.status}` })),
          },
        ],
      };
    case "hephaistos":
      return {
        previewStats: [
          { label: "Documents", value: docsPlanner.length, hint: "actifs" },
          { label: "Exports", value: 4, hint: "formats" },
          { label: "Checklists", value: docsPlanner.reduce((sum, doc) => sum + (doc.checklist?.length || 0), 0), hint: "items" },
          { label: "Versions", value: docsPlanner.length, hint: "vivantes" },
        ],
        columns: [
          {
            ...universe.columns[0],
            actions: [{ to: "/exports", label: "Exports", icon: FileText }],
            rows: [
              { label: "Supports actifs", value: docsPlanner.length },
              { label: "Version centrale", value: docsPlanner[0]?.version || "—" },
            ],
          },
          {
            ...universe.columns[1],
            actions: [{ to: "/documents", label: "Bibliothèque docs", icon: Sparkles }],
            rows: [
              { label: "Checklist totale", value: docsPlanner.reduce((sum, doc) => sum + (doc.checklist?.length || 0), 0) },
              { label: "Format clé", value: "PDF / impression" },
            ],
          },
          {
            ...universe.columns[2],
            actions: [{ to: "/exports", label: "Feuilles de rôle", icon: Users }],
            rows: [
              { label: "Docs à relire", value: docsPlanner.filter((doc) => !["prêt", "partagé", "complet"].includes(doc.status)).length },
              { label: "Exports utiles", value: 4 },
            ],
          },
        ],
        surfaces: [
          {
            title: "Documents vivants",
            items: docsPlanner.slice(0, 6).map((item) => ({ title: item.title, text: `${item.status} · ${item.version} · ${compactText(item.summary, 72)}` })),
          },
        ],
      };
    case "dionysos":
      return {
        previewStats: [
          { label: "Soirée", value: "8h", hint: "programmées" },
          { label: "Animations", value: musicVendors.length, hint: "liées" },
          { label: "Ouverture", value: "21:45", hint: "de bal" },
          { label: "After", value: "23:15", hint: "prévu" },
        ],
        columns: [
          {
            ...universe.columns[0],
            actions: [{ to: "/jour-j", label: "Suivre la soirée", icon: Calendar }],
            rows: [
              { label: "Ouverture", value: "21:45" },
              { label: "Dancefloor", value: "23:15" },
            ],
          },
          {
            ...universe.columns[1],
            actions: [{ to: "/prestataires?category=music", label: "DJ & son", icon: Music }],
            rows: [
              { label: "Équipe active", value: musicVendors[0]?.name || "Atelier Sonore" },
              { label: "Timing soirée", value: timelinePlanner.find((item) => item.id === "ouverture-bal")?.title || "Ouverture de bal" },
            ],
          },
          {
            ...universe.columns[2],
            actions: [{ to: "/budget", label: "Budget soirée", icon: CreditCard }],
            rows: [
              { label: "Paiement musique", value: fmtMoney((state.vendors?.payments || []).filter((item) => item.vendorId === "music_sonore").reduce((sum, item) => sum + item.amount, 0)) },
              { label: "Rythme gardé", value: "Oui" },
            ],
          },
        ],
        surfaces: [
          {
            title: "Nuit du mariage",
            items: timelinePlanner.filter((item) => ["diner-discours", "ouverture-bal", "dancefloor"].includes(item.id)).map((item) => ({ title: `${item.time} · ${item.title}`, text: compactText(item.detail, 92) })),
          },
        ],
      };
    case "hestia":
      return {
        previewStats: [
          { label: "Invités", value: guestSummary.total, hint: "au total" },
          { label: "Confirmés", value: guestSummary.confirmed, hint: "RSVP" },
          { label: "Invitations", value: invitationSummary.sent + invitationSummary.opened, hint: "envoyées" },
          { label: "Foyers", value: households.length, hint: "groupes" },
        ],
        columns: [
          {
            ...universe.columns[0],
            actions: [{ to: "/couple", label: "Vue couple", icon: Heart }, { to: "/espace-invites", label: "Mini site invités", icon: Users }],
            rows: [
              { label: "Confirmés", value: guestSummary.confirmed },
              { label: "En attente", value: guestSummary.pending },
            ],
          },
          {
            ...universe.columns[1],
            actions: [{ to: "/invites", label: "Invités & tables", icon: Users }],
            rows: [
              { label: "Foyers", value: households.length },
              { label: "Tables", value: tables.length },
            ],
          },
          {
            ...universe.columns[2],
            actions: [{ to: "/documents", label: "Infos utiles", icon: FileText }],
            rows: [
              { label: "Invitations ouvertes", value: invitationSummary.opened },
              { label: "Accès soirée", value: invitationSummary.eveningOnly },
            ],
          },
        ],
        surfaces: [
          {
            title: "RSVP & foyers",
            items: households.slice(0, 6).map((item) => ({ title: item.label, text: `${item.count} invité(s) · ${item.confirmed} confirmé(s)` })),
          },
        ],
      };
    default:
      return {
        previewStats: [],
        columns: universe.columns,
        surfaces: [],
      };
  }
}

export default function UniversePage() {
  const { universeId } = useParams();
  const universe = getUniverseById(universeId);
  const state = readWeddingState();

  if (!universe) {
    return <Navigate to="/" replace />;
  }

  const content = getUniverseContent(state, universe);

  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] text-[var(--color-text-primary)] overflow-x-hidden">
      <UniverseHero universe={{ ...universe, previewStats: content.previewStats }} />

      <main className="max-w-[1480px] mx-auto px-5 md:px-8 lg:px-10 -mt-10 md:-mt-12 relative z-10 pb-16 md:pb-24">
        <section className="rounded-[34px] border border-black/8 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)] overflow-hidden">
          <div className="px-6 md:px-8 lg:px-10 bg-white">
            <div className="grid md:grid-cols-3 md:divide-x divide-black/8">
              {content.columns.map((column) => (
                <ColumnPanel key={column.title} {...column} />
              ))}
            </div>
          </div>
        </section>

        <div className="grid gap-4 lg:grid-cols-2 items-start mt-4">
          {content.surfaces.map((surface) => (
            <Surface key={surface.title} title={surface.title} action={<Link to={universe.moduleRoute} className="text-sm text-zinc-500">Ouvrir</Link>}>
              <BulletList items={surface.items} />
            </Surface>
          ))}

          <Surface title="Outils liés" action={<Link to={universe.moduleRoute} className="rounded-full bg-black px-4 py-2 text-sm text-white hover:bg-zinc-800">Ouvrir le module</Link>}>
            <div className="grid gap-3 sm:grid-cols-2">
              <ActionChip to={universe.moduleRoute} label="Module principal" icon={Sparkles} />
              <ActionChip to="/couple" label="Profil / espace" icon={Heart} />
              <ActionChip to="/documents" label="Documents" icon={FileText} />
              <ActionChip to="/budget" label="Budget" icon={CreditCard} />
              <ActionChip to="/jour-j" label="Jour J" icon={Calendar} />
              <ActionChip to="/notifications" label="Alertes" icon={Bell} />
              <ActionChip to="/communication" label="Messages" icon={MessageSquare} />
            </div>
          </Surface>
        </div>
      </main>
    </div>
  );
}
