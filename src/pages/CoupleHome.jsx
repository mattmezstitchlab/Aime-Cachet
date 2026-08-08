import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  CalendarDays,
  Clock3,
  Euro,
  FileText,
  HeartHandshake,
  MapPin,
  MoveRight,
  Phone,
  ShieldAlert,
  Sparkles,
  Users,
} from "lucide-react";
import { UNIVERSE_GRADIENTS } from "@/lib/aimeUniverses";
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
  getVendorPaymentSummary,
  readWeddingState,
} from "@/lib/aimeWeddingCore";

const moneyFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

function formatMoney(value) {
  return moneyFormatter.format(value || 0);
}

function formatDate(value) {
  if (!value) return "Date à confirmer";
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatShortDate(value) {
  if (!value) return "À planifier";
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
  });
}

function compactText(value, max = 92) {
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
    <section className={`rounded-[30px] border border-black/8 bg-white shadow-[0_18px_48px_rgba(12,12,12,0.06)] ${className}`}>
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
      <div className="mt-2 text-[1.9rem] md:text-[2.3rem] leading-none font-display text-white">{value}</div>
      {detail && <div className="mt-2 text-sm text-white/62 leading-relaxed">{detail}</div>}
    </div>
  );
}

function PriorityItem({ item }) {
  return (
    <Link
      to={item.to}
      className="group flex items-start justify-between gap-4 rounded-[24px] border border-black/8 bg-[var(--color-warm-white)] px-4 py-4 transition-colors hover:bg-black/[0.03]"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3">
          <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${dotClass(item.level)}`} />
          <div className="text-sm font-semibold text-zinc-950">{item.title}</div>
        </div>
        <p className="mt-2 pl-[22px] text-sm text-zinc-600 leading-relaxed">{item.detail}</p>
      </div>
      <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </Link>
  );
}

function FlowItem({ item }) {
  return (
    <div className="rounded-[24px] border border-black/8 bg-white px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <span className={`h-2.5 w-2.5 rounded-full ${dotClass(item.level)}`} />
            <div className="text-sm font-semibold text-zinc-950">{item.title}</div>
          </div>
          <div className="mt-2 pl-[22px] text-sm text-zinc-600">{item.detail}</div>
        </div>
        <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500 whitespace-nowrap">
          {formatShortDate(item.at)}
        </div>
      </div>
    </div>
  );
}

function UniverseChip({ universeId, label }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-3 py-1.5 text-[12px] font-semibold italic text-white shadow-[0_10px_22px_rgba(0,0,0,0.12)]"
      style={{ background: UNIVERSE_GRADIENTS[universeId] }}
    >
      {label}
    </span>
  );
}

function HouseLink({ universeId, label, title, detail, to }) {
  return (
    <Link
      to={to}
      className="group rounded-[24px] border border-black/8 bg-[var(--color-warm-white)] p-4 transition-colors hover:bg-black/[0.03]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <UniverseChip universeId={universeId} label={label} />
          <div className="mt-3 text-sm font-semibold text-zinc-950">{title}</div>
          <div className="mt-2 text-sm text-zinc-600 leading-relaxed">{detail}</div>
        </div>
        <MoveRight className="mt-1 h-4 w-4 shrink-0 text-zinc-400 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

function ClusterCard({ eyebrow, title, description, tone, metrics, children }) {
  return (
    <Surface className="p-5 md:p-6">
      <div className="flex items-center gap-3">
        <span className={`h-2.5 w-2.5 rounded-full ${dotClass(tone)}`} />
        <div className="aime-label text-zinc-500">{eyebrow}</div>
      </div>
      <h3 className="mt-3 text-[1.25rem] font-semibold text-zinc-950">{title}</h3>
      <p className="mt-3 text-sm text-zinc-600 leading-relaxed">{description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {metrics.map((metric) => (
          <span
            key={metric}
            className="rounded-full border border-black/8 bg-white px-3 py-1.5 text-[12px] text-zinc-700"
          >
            {metric}
          </span>
        ))}
      </div>
      <div className="mt-5 space-y-3">{children}</div>
    </Surface>
  );
}

function SummaryMetric({ icon: Icon, label, value, to = null }) {
  const content = (
    <div className="rounded-[24px] border border-black/8 bg-white p-4 transition-colors hover:bg-black/[0.02]">
      <div className="flex items-center gap-3 text-zinc-500">
        <Icon className="h-4 w-4" />
        <span className="text-[11px] uppercase tracking-[0.16em]">{label}</span>
      </div>
      <div className="mt-3 text-[1.5rem] font-display text-zinc-950 leading-none">{value}</div>
    </div>
  );

  if (!to) return content;
  return <Link to={to}>{content}</Link>;
}

export default function CoupleHome() {
  const state = useMemo(() => readWeddingState(), []);

  const meta = state.meta || {};
  const documents = useMemo(() => filterDocumentsByRole(state.documents, "couple"), [state]);
  const timeline = useMemo(() => filterTimelineByRole(state.timeline?.steps || [], "couple"), [state]);
  const notifications = useMemo(() => getNotificationsForRole(state, "couple"), [state]);
  const notes = useMemo(() => getNotesForRole(state, "couple").slice(0, 2), [state]);
  const smartCalendar = useMemo(() => getSmartCalendarItems(state, "couple").slice(0, 4), [state]);
  const guestSummary = useMemo(() => getGuestSummary(state), [state]);
  const invitationSummary = useMemo(() => getInvitationSummary(state), [state]);
  const households = useMemo(() => getHouseholdOverview(state), [state]);
  const tables = useMemo(() => getTableOverview(state), [state]);
  const budgetSummary = useMemo(() => getBudgetSummary(state), [state]);
  const vendorPaymentSummary = useMemo(() => getVendorPaymentSummary(state), [state]);
  const vendorCommitmentSummary = useMemo(() => getVendorCommitmentSummary(state), [state]);

  const relevantReminders = (state.reminders || []).filter(
    (item) => ["couple", "planning"].includes(item.owner) && item.status !== "done",
  );
  const docsReady = documents.filter((doc) => ["prêt", "partagé", "complet"].includes(doc.status)).length;
  const docsPending = documents.length - docsReady;
  const pendingTimeline = timeline.filter((item) => item.status !== "done");
  const criticalSignals = notifications.filter((item) => item.level === "critical").length;
  const warningSignals = notifications.filter((item) => item.level === "warning").length;
  const countdownLabel = meta.countdownDays > 0 ? `J-${meta.countdownDays}` : "Aujourd’hui";

  const priorityItems = [
    relevantReminders.length > 0
      ? {
          key: "validations",
          level: relevantReminders.some((item) => item.priority === "haute" || item.priority === "critique") ? "warning" : "neutral",
          title: `${relevantReminders.length} validation${relevantReminders.length > 1 ? "s" : ""} en attente`,
          detail: compactText(relevantReminders[0]?.title || "Vos validations de la semaine restent ouvertes."),
          to: "/point-zero?section=reminders",
        }
      : null,
    docsPending > 0
      ? {
          key: "documents",
          level: "warning",
          title: `${docsPending} document${docsPending > 1 ? "s" : ""} à relire ou compléter`,
          detail: compactText(documents.find((doc) => !["prêt", "partagé", "complet"].includes(doc.status))?.title || "Les pièces encore instables restent concentrées au même endroit."),
          to: "/documents",
        }
      : null,
    budgetSummary.pending > 0
      ? {
          key: "budget",
          level: budgetSummary.over > 0 ? "critical" : "warning",
          title: `${formatMoney(budgetSummary.pending)} à arbitrer`,
          detail: budgetSummary.over > 0
            ? `Le budget dépasse actuellement l’enveloppe de ${formatMoney(budgetSummary.over)}.`
            : "Des décisions budgétaires restent ouvertes avant validation finale.",
          to: "/budget",
        }
      : null,
    vendorCommitmentSummary.missingDocs > 0 || vendorPaymentSummary.openCount > 0
      ? {
          key: "vendors",
          level: vendorCommitmentSummary.missingDocs > 0 ? "critical" : "warning",
          title: `${vendorPaymentSummary.openCount} engagement${vendorPaymentSummary.openCount > 1 ? "s" : ""} prestataire à sécuriser`,
          detail: vendorCommitmentSummary.missingDocs > 0
            ? `${vendorCommitmentSummary.missingDocs} pièce${vendorCommitmentSummary.missingDocs > 1 ? "s" : ""} manque${vendorCommitmentSummary.missingDocs > 1 ? "nt" : ""} encore côté prestataires.`
            : `${formatMoney(vendorPaymentSummary.due)} restent dus ou à programmer.`,
          to: "/prestataires",
        }
      : null,
  ].filter(Boolean);

  const clusterTone = {
    pilot: criticalSignals > 0 ? "critical" : warningSignals > 0 || relevantReminders.length > 0 ? "warning" : "calm",
    create: docsPending > 0 ? "warning" : "calm",
    organize: guestSummary.pending > 0 || pendingTimeline.length > 0 ? "warning" : "calm",
    communicate: invitationSummary.draft > 0 ? "warning" : "calm",
  };

  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] text-[var(--color-text-primary)] overflow-x-hidden">
      <div className="mx-auto max-w-[1320px] px-5 pb-10 pt-4 md:px-8 md:pb-12 lg:px-10">
        <section className="relative overflow-hidden rounded-[38px] bg-[var(--color-black)] text-white shadow-[0_24px_70px_rgba(0,0,0,0.12)]">
          <img src="/landing/zeus.jpg" alt="Homepage mariés" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.18),rgba(0,0,0,0.82))]" aria-hidden="true" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_24%)]" aria-hidden="true" />

          <div className="relative z-10 grid gap-8 px-5 py-6 md:px-8 md:py-8 lg:grid-cols-[1.04fr_0.96fr] lg:px-10 lg:py-10">
            <div className="max-w-3xl">
              <div className="aime-kicker">Homepage Mariés</div>
              <h1 className="mt-5 font-display text-[2.8rem] leading-[0.94] tracking-[var(--tracking-display)] text-white sm:text-[4rem] lg:text-[5.35rem]">
                Votre mariage,
                <br />
                sans bruit.
              </h1>
              <p className="mt-5 max-w-2xl text-[15px] leading-[1.65] text-white/72 md:text-[17px]">
                {meta.couple || "Votre couple"} · {formatDate(meta.date)} · {meta.venue || "Lieu à confirmer"}
                {meta.city ? `, ${meta.city}` : ""}. Une seule lecture : ce qui est stable, ce qui demande une décision, et vers quelle maison aller.
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5">
                <UniverseChip universeId="zeus" label="Zeus" />
                <UniverseChip universeId="hestia" label="Hestia" />
                <UniverseChip universeId="athena" label="Athéna" />
                <UniverseChip universeId="hermes" label="Hermès" />
              </div>

              <div className="mt-7 flex flex-wrap gap-2.5">
                <Link to="/point-zero" className="aime-button-primary rounded-full px-5 py-3 text-sm font-medium inline-flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4" />
                  Ouvrir Zeus
                </Link>
                <Link to="/invites" className="rounded-full border border-white/14 bg-white/[0.04] px-5 py-3 text-sm text-white/88 hover:bg-white/[0.08] inline-flex items-center gap-2 transition-colors">
                  <Users className="h-4 w-4" />
                  Ouvrir Hestia
                </Link>
                <Link to="/documents" className="rounded-full border border-white/14 bg-white/[0.04] px-5 py-3 text-sm text-white/88 hover:bg-white/[0.08] inline-flex items-center gap-2 transition-colors">
                  <FileText className="h-4 w-4" />
                  Vos documents
                </Link>
              </div>
            </div>

            <div className="grid gap-4 self-end sm:grid-cols-2">
              <HeroStat label="Compte à rebours" value={countdownLabel} detail={meta.coordinationStatus || "stable"} />
              <HeroStat label="Invités confirmés" value={`${guestSummary.confirmed}/${guestSummary.total}`} detail={`${guestSummary.pending} en attente de réponse`} />
              <HeroStat label="À trancher" value={priorityItems.length} detail={`${criticalSignals} critique${criticalSignals > 1 ? "s" : ""} · ${warningSignals} signal${warningSignals > 1 ? "s" : ""}`} />
              <HeroStat label="Budget restant" value={formatMoney(budgetSummary.remaining)} detail={budgetSummary.over > 0 ? `Dépassement de ${formatMoney(budgetSummary.over)}` : `${formatMoney(budgetSummary.pending)} encore à arbitrer`} />
            </div>
          </div>
        </section>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryMetric icon={CalendarDays} label="Date" value={formatDate(meta.date)} />
          <SummaryMetric icon={MapPin} label="Lieu" value={meta.venue || "Lieu à confirmer"} />
          <SummaryMetric icon={Users} label="Foyers" value={households.length} to="/invites" />
          <SummaryMetric icon={Euro} label="Paiements ouverts" value={vendorPaymentSummary.openCount} to="/budget" />
        </div>

        <div className="mt-8 grid gap-4 xl:grid-cols-[0.96fr_1.04fr]">
          <Surface className="p-5 md:p-6">
            <SectionHeading
              eyebrow="Le scan essentiel"
              title="Ce qui mérite une décision"
              action={
                <Link to="/point-zero" className="text-sm text-zinc-600 hover:text-zinc-950 inline-flex items-center gap-2">
                  Ouvrir le cockpit
                  <MoveRight className="h-4 w-4" />
                </Link>
              }
            />
            <div className="mt-5 space-y-3">
              {priorityItems.length === 0 ? (
                <div className="rounded-[24px] border border-black/8 bg-[var(--color-warm-white)] px-4 py-5 text-sm text-zinc-600">
                  Rien de critique à arbitrer pour l’instant. La homepage reste volontairement calme.
                </div>
              ) : (
                priorityItems.map((item) => <PriorityItem key={item.key} item={item} />)
              )}
            </div>
          </Surface>

          <Surface className="p-5 md:p-6">
            <SectionHeading
              eyebrow="Le prochain flux"
              title="Ce qui arrive maintenant"
              action={
                <Link to="/jour-j?role=couple" className="text-sm text-zinc-600 hover:text-zinc-950 inline-flex items-center gap-2">
                  Voir Arès
                  <MoveRight className="h-4 w-4" />
                </Link>
              }
            />
            <div className="mt-5 space-y-3">
              {smartCalendar.length === 0 ? (
                <div className="rounded-[24px] border border-black/8 bg-[var(--color-warm-white)] px-4 py-5 text-sm text-zinc-600">
                  Aucun point de passage imminent pour le moment.
                </div>
              ) : (
                smartCalendar.map((item) => <FlowItem key={item.id} item={item} />)
              )}
            </div>
          </Surface>
        </div>

        <div className="mt-10">
          <SectionHeading eyebrow="Maisons prioritaires" title="Les univers à ouvrir selon votre moment" />
          <div className="mt-5 grid gap-4 xl:grid-cols-2">
            <ClusterCard
              eyebrow="Piloter"
              title="Tenir la vision d’ensemble"
              description="Seulement les arbitrages qui changent vraiment l’expérience du mariage : rythme, alertes, validations, budget vivant."
              tone={clusterTone.pilot}
              metrics={[
                `${relevantReminders.length} validation${relevantReminders.length > 1 ? "s" : ""}`,
                `${notifications.length} signal${notifications.length > 1 ? "aux" : ""}`,
                countdownLabel,
              ]}
            >
              <HouseLink
                universeId="zeus"
                label="Zeus"
                title="Point Zéro"
                detail={`${smartCalendar.length} repère${smartCalendar.length > 1 ? "s" : ""} actifs pour garder la lecture globale.`}
                to="/point-zero"
              />
              <HouseLink
                universeId="athena"
                label="Athéna"
                title="Alertes & anticipation"
                detail={`${criticalSignals} critique${criticalSignals > 1 ? "s" : ""} et ${warningSignals} signal${warningSignals > 1 ? "aux" : ""} utiles à traiter.`}
                to="/notifications?role=couple"
              />
            </ClusterCard>

            <ClusterCard
              eyebrow="Créer & inspirer"
              title="Garder la ligne esthétique"
              description="L’univers créatif ne doit pas se perdre entre captures, validations et partenaires. On garde une direction, pas une accumulation."
              tone={clusterTone.create}
              metrics={[
                `${notes.length} note${notes.length > 1 ? "s" : ""}`,
                `${docsReady} document${docsReady > 1 ? "s" : ""} prêts`,
                `${vendorCommitmentSummary.quotesPending} devis ouverts`,
              ]}
            >
              <HouseLink
                universeId="aphrodite"
                label="Aphrodite"
                title="Direction esthétique"
                detail="Moodboard, scénographie et validations sensibles restent tenus dans la même ligne visuelle."
                to="/univers/aphrodite"
              />
              <HouseLink
                universeId="apollon"
                label="Apollon"
                title="Souvenirs & image"
                detail="Photo, vidéo et fenêtres fortes du mariage restent lisibles sans alourdir la préparation."
                to="/univers/apollon"
              />
              <HouseLink
                universeId="poseidon"
                label="Poséidon"
                title="Ambiance sonore"
                detail="Musique, micros, ouverture et énergie de soirée restent accordés avec le vrai tempo."
                to="/univers/poseidon"
              />
            </ClusterCard>

            <ClusterCard
              eyebrow="Organiser"
              title="Accueillir, placer, tenir le terrain"
              description="Les invités, la table, les accès et le déroulé ne doivent jamais se contredire. Ici, chaque maison garde sa donnée source."
              tone={clusterTone.organize}
              metrics={[
                `${guestSummary.pending} RSVP en attente`,
                `${tables.length} table${tables.length > 1 ? "s" : ""}`,
                `${pendingTimeline.length} étape${pendingTimeline.length > 1 ? "s" : ""} actives`,
              ]}
            >
              <HouseLink
                universeId="artemis"
                label="Artémis"
                title="Lieux & accès"
                detail="Lieu, circulation, hébergements et lecture terrain restent synchronisés avec la réalité du site."
                to="/prestataires/registre?category=venue"
              />
              <HouseLink
                universeId="ares"
                label="Arès"
                title="Jour J & exécution"
                detail="Le fil opérationnel du mariage se lit sans surcharge, avec les prochains points de passage déjà visibles."
                to="/jour-j?role=couple"
              />
              <HouseLink
                universeId="demeter"
                label="Déméter"
                title="Table, dîner & ressources"
                detail={`${guestSummary.vegetarian + guestSummary.allergies} repas spéciaux à absorber entre tables, budget et service.`}
                to="/budget"
              />
            </ClusterCard>

            <ClusterCard
              eyebrow="Communiquer"
              title="Transmettre sans dupliquer"
              description="Invités, messages et supports vivent dans leurs maisons respectives. La homepage n’en montre que la synthèse, jamais une copie éditable."
              tone={clusterTone.communicate}
              metrics={[
                `${invitationSummary.sent} invitation${invitationSummary.sent > 1 ? "s" : ""} envoyées`,
                `${invitationSummary.opened} ouvertes`,
                `${docsPending} pièce${docsPending > 1 ? "s" : ""} encore mouvantes`,
              ]}
            >
              <HouseLink
                universeId="hestia"
                label="Hestia"
                title="Invités & accueil"
                detail={`${guestSummary.confirmed} confirmés, ${guestSummary.pending} en attente, ${households.length} foyers à tenir sans friction.`}
                to="/invites"
              />
              <HouseLink
                universeId="hermes"
                label="Hermès"
                title="Diffusion & messages"
                detail="Les bons messages partent au bon public, avec les bonnes pièces jointes et sans bruit inutile."
                to="/communication?role=couple"
              />
              <HouseLink
                universeId="hephaistos"
                label="Héphaïstos"
                title="Supports & exports"
                detail="Plans, PDFs et feuilles utiles se forgent proprement quand le moment le demande."
                to="/exports?view=couple"
              />
            </ClusterCard>
          </div>
        </div>

        <div className="mt-10 grid gap-4 xl:grid-cols-[0.98fr_1.02fr]">
          <Surface className="p-5 md:p-6">
            <SectionHeading
              eyebrow="Foyer invité"
              title="Hestia en un coup d’œil"
              action={
                <Link to="/invites" className="text-sm text-zinc-600 hover:text-zinc-950 inline-flex items-center gap-2">
                  Ouvrir Hestia
                  <MoveRight className="h-4 w-4" />
                </Link>
              }
            />
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <SummaryMetric icon={Users} label="Confirmés" value={guestSummary.confirmed} />
              <SummaryMetric icon={Clock3} label="En attente" value={guestSummary.pending} />
              <SummaryMetric icon={HeartHandshake} label="Tables actives" value={tables.length} />
              <SummaryMetric icon={Sparkles} label="Allergies / végétarien" value={guestSummary.allergies + guestSummary.vegetarian} />
            </div>
            <div className="mt-4 rounded-[24px] border border-black/8 bg-[var(--color-warm-white)] p-4">
              <div className="text-sm font-semibold text-zinc-950">Invitation & accueil</div>
              <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
                {invitationSummary.draft} invitation{invitationSummary.draft > 1 ? "s" : ""} encore en brouillon, {invitationSummary.plusOneAllowed} +1 autorisés, {guestSummary.pmr} besoin{guestSummary.pmr > 1 ? "s" : ""} d’accessibilité déjà identifiés.
              </p>
            </div>
          </Surface>

          <Surface className="p-5 md:p-6">
            <SectionHeading
              eyebrow="Lien humain"
              title="La personne qui tient le fil"
              action={
                state.contacts?.planning?.phone ? (
                  <a
                    href={`tel:${state.contacts.planning.phone.replace(/\s+/g, "")}`}
                    className="text-sm text-zinc-600 hover:text-zinc-950 inline-flex items-center gap-2"
                  >
                    <Phone className="h-4 w-4" />
                    Appeler
                  </a>
                ) : null
              }
            />
            <div className="mt-5 rounded-[28px] border border-black/8 bg-[var(--color-warm-white)] p-5">
              <div className="text-xl font-semibold text-zinc-950">{state.contacts?.planning?.name || "Léna"}</div>
              <div className="mt-2 text-sm text-zinc-600 leading-relaxed">
                {compactText(state.contacts?.planning?.note || "Tour de contrôle et arbitrage global.", 130)}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link to="/communication?role=couple" className="rounded-full border border-black/8 bg-white px-4 py-2 text-sm text-zinc-700 hover:bg-black/[0.03]">
                  Écrire via Hermès
                </Link>
                <Link to="/point-zero" className="rounded-full border border-black/8 bg-white px-4 py-2 text-sm text-zinc-700 hover:bg-black/[0.03]">
                  Voir le cockpit
                </Link>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {notes.length === 0 ? (
                <div className="rounded-[24px] border border-black/8 bg-white px-4 py-4 text-sm text-zinc-600">
                  Aucune note partagée pour l’instant.
                </div>
              ) : (
                notes.map((note) => (
                  <div key={note.id} className="rounded-[24px] border border-black/8 bg-white px-4 py-4">
                    <div className="text-sm font-semibold text-zinc-950">{note.title}</div>
                    <div className="mt-1 text-[11px] uppercase tracking-[0.16em] text-zinc-500">{note.author}</div>
                    <p className="mt-3 text-sm text-zinc-600 leading-relaxed">{compactText(note.text, 135)}</p>
                  </div>
                ))
              )}
            </div>
          </Surface>
        </div>
      </div>
    </div>
  );
}
