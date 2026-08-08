import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  CalendarDays,
  Clock3,
  CreditCard,
  FileText,
  MessageSquare,
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
  getCommunicationsForRole,
  getContactsForRole,
  getGuestSummary,
  getNotesForRole,
  getNotificationsForRole,
  getSmartCalendarItems,
  getVendorCommitmentSummary,
  getVendorMarketplace,
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

function compactText(value, max = 108) {
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
      <div className="mt-2 text-[1.9rem] md:text-[2.25rem] leading-none font-display text-white">{value}</div>
      {detail && <div className="mt-2 text-sm text-white/62 leading-relaxed">{detail}</div>}
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

function QuickMetric({ icon: Icon, label, value, to = null }) {
  const content = (
    <div className="rounded-[24px] border border-black/8 bg-white p-4 transition-colors hover:bg-black/[0.02]">
      <div className="flex items-center gap-3 text-zinc-500">
        <Icon className="h-4 w-4" />
        <span className="text-[11px] uppercase tracking-[0.16em]">{label}</span>
      </div>
      <div className="mt-3 text-[1.45rem] leading-none font-display text-zinc-950">{value}</div>
    </div>
  );

  if (!to) return content;
  return <Link to={to}>{content}</Link>;
}

function SignalItem({ item }) {
  return (
    <Link
      to={item.href || "/notifications?role=planner"}
      className="group flex items-start justify-between gap-4 rounded-[24px] border border-black/8 bg-[var(--color-warm-white)] px-4 py-4 transition-colors hover:bg-black/[0.03]"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3">
          <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${dotClass(item.level)}`} />
          <div className="text-sm font-semibold text-zinc-950">{item.title}</div>
        </div>
        <p className="mt-2 pl-[22px] text-sm text-zinc-600 leading-relaxed">{compactText(item.text, 122)}</p>
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
            <span className={`h-2.5 w-2.5 rounded-full ${dotClass(item.level === "high" ? "warning" : "neutral")}`} />
            <div className="text-sm font-semibold text-zinc-950">{item.title}</div>
          </div>
          <div className="mt-2 pl-[22px] text-sm text-zinc-600 leading-relaxed">{compactText(item.detail, 116)}</div>
        </div>
        <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500 whitespace-nowrap">
          {formatShortDate(item.at)}
        </div>
      </div>
    </div>
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
          <span key={metric} className="rounded-full border border-black/8 bg-white px-3 py-1.5 text-[12px] text-zinc-700">
            {metric}
          </span>
        ))}
      </div>
      <div className="mt-5 space-y-3">{children}</div>
    </Surface>
  );
}

function DocumentItem({ doc }) {
  return (
    <Link to="/documents?role=planner" className="group rounded-[24px] border border-black/8 bg-white p-4 transition-colors hover:bg-black/[0.02] block">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-zinc-950">{doc.title}</div>
          <div className="mt-2 text-sm text-zinc-600 leading-relaxed">{compactText(doc.summary, 120)}</div>
        </div>
        <span className="rounded-full border border-black/8 bg-[var(--color-warm-white)] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-zinc-700">
          {doc.status}
        </span>
      </div>
    </Link>
  );
}

function NoteItem({ note }) {
  return (
    <div className="rounded-[24px] border border-black/8 bg-white p-4">
      <div className="text-sm font-semibold text-zinc-950">{note.title}</div>
      <div className="mt-1 text-[11px] uppercase tracking-[0.16em] text-zinc-500">{note.author}</div>
      <p className="mt-3 text-sm text-zinc-600 leading-relaxed">{compactText(note.text, 142)}</p>
    </div>
  );
}

function ContactCard({ contact }) {
  return (
    <a
      href={`tel:${contact.phone.replace(/\s+/g, "")}`}
      className="group rounded-[24px] border border-black/8 bg-white p-4 transition-colors hover:bg-black/[0.02]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-zinc-950">{contact.name}</div>
          <div className="mt-1 text-[11px] uppercase tracking-[0.16em] text-zinc-500">{contact.label}</div>
          <div className="mt-3 text-sm text-zinc-600 leading-relaxed">{compactText(contact.note, 96)}</div>
        </div>
        <Phone className="mt-1 h-4 w-4 shrink-0 text-zinc-400" />
      </div>
    </a>
  );
}

export default function PointZero() {
  const state = useMemo(() => readWeddingState(), []);

  const meta = state.meta || {};
  const notifications = useMemo(() => getNotificationsForRole(state, "planner"), [state]);
  const smartCalendar = useMemo(() => getSmartCalendarItems(state, "planner").slice(0, 5), [state]);
  const notes = useMemo(() => getNotesForRole(state, "planner").slice(0, 3), [state]);
  const messages = useMemo(() => getCommunicationsForRole(state, "planner").slice(0, 2), [state]);
  const plannerDocs = useMemo(() => filterDocumentsByRole(state.documents, "planner"), [state]);
  const plannerTimeline = useMemo(() => filterTimelineByRole(state.timeline?.steps || [], "planner"), [state]);
  const contacts = useMemo(() => getContactsForRole(state, "planner").slice(0, 4), [state]);
  const budgetSummary = useMemo(() => getBudgetSummary(state), [state]);
  const guestSummary = useMemo(() => getGuestSummary(state), [state]);
  const vendorPaymentSummary = useMemo(() => getVendorPaymentSummary(state), [state]);
  const vendorCommitmentSummary = useMemo(() => getVendorCommitmentSummary(state), [state]);
  const vendorMarketplace = useMemo(() => getVendorMarketplace(state, "all"), [state]);

  const docsPending = plannerDocs.filter((doc) => !["prêt", "partagé", "complet"].includes(doc.status));
  const pendingTimeline = plannerTimeline.filter((step) => step.status !== "done").slice(0, 4);
  const criticalSignals = notifications.filter((item) => item.level === "critical").length;
  const warningSignals = notifications.filter((item) => item.level === "warning").length;
  const countdownLabel = meta.countdownDays > 0 ? `J-${meta.countdownDays}` : "Aujourd’hui";
  const creativeVendors = vendorMarketplace.filter((vendor) => ["flowers-decor", "photo-video", "music", "beauty"].includes(vendor.category)).length;
  const opsVendors = vendorMarketplace.filter((vendor) => ["venue", "catering", "transport"].includes(vendor.category)).length;
  const openDocuments = docsPending.slice(0, 4);

  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] text-[var(--color-text-primary)] overflow-x-hidden">
      <div className="mx-auto max-w-[1320px] px-5 pb-10 pt-4 md:px-8 md:pb-12 lg:px-10">
        <section className="relative overflow-hidden rounded-[38px] bg-[var(--color-black)] text-white shadow-[0_24px_70px_rgba(0,0,0,0.12)]">
          <img src="/landing/zeus.jpg" alt="Homepage planner" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.16),rgba(0,0,0,0.84))]" aria-hidden="true" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_24%)]" aria-hidden="true" />

          <div className="relative z-10 grid gap-8 px-5 py-6 md:px-8 md:py-8 lg:grid-cols-[1.04fr_0.96fr] lg:px-10 lg:py-10">
            <div className="max-w-3xl">
              <div className="aime-kicker">Homepage Planner</div>
              <h1 className="mt-5 font-display text-[2.7rem] leading-[0.94] tracking-[var(--tracking-display)] text-white sm:text-[4rem] lg:text-[5.2rem]">
                Le mariage,
                <br />
                tenu d’une seule main.
              </h1>
              <p className="mt-5 max-w-2xl text-[15px] leading-[1.65] text-white/72 md:text-[17px]">
                {meta.couple || "Le couple"} · {formatDate(meta.date)} · {meta.venue || "Lieu à confirmer"}
                {meta.city ? `, ${meta.city}` : ""}. Une seule lecture planner : arbitrer, diffuser, sécuriser, exécuter.
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5">
                <UniverseChip universeId="zeus" label="Zeus" />
                <UniverseChip universeId="athena" label="Athéna" />
                <UniverseChip universeId="hermes" label="Hermès" />
                <UniverseChip universeId="hestia" label="Hestia" />
              </div>

              <div className="mt-7 flex flex-wrap gap-2.5">
                <Link to="/jour-j?role=planner" className="aime-button-primary rounded-full px-5 py-3 text-sm font-medium inline-flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  Ouvrir Arès
                </Link>
                <Link to="/documents?role=planner" className="rounded-full border border-white/14 bg-white/[0.04] px-5 py-3 text-sm text-white/88 hover:bg-white/[0.08] inline-flex items-center gap-2 transition-colors">
                  <FileText className="h-4 w-4" />
                  Documents
                </Link>
                <Link to="/communication?role=planner" className="rounded-full border border-white/14 bg-white/[0.04] px-5 py-3 text-sm text-white/88 hover:bg-white/[0.08] inline-flex items-center gap-2 transition-colors">
                  <MessageSquare className="h-4 w-4" />
                  Diffusion
                </Link>
              </div>
            </div>

            <div className="grid gap-4 self-end sm:grid-cols-2">
              <HeroStat label="Compte à rebours" value={countdownLabel} detail={`${criticalSignals} critique${criticalSignals > 1 ? "s" : ""} · ${warningSignals} signal${warningSignals > 1 ? "aux" : ""}`} />
              <HeroStat label="Docs mouvants" value={docsPending.length} detail="Encore à relire ou verrouiller" />
              <HeroStat label="Paiements ouverts" value={vendorPaymentSummary.openCount} detail={`${formatMoney(vendorPaymentSummary.due)} dus`} />
              <HeroStat label="Budget restant" value={formatMoney(budgetSummary.remaining)} detail={budgetSummary.over > 0 ? `Dépassement de ${formatMoney(budgetSummary.over)}` : `${formatMoney(budgetSummary.pending)} à arbitrer`} />
            </div>
          </div>
        </section>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <QuickMetric icon={ShieldAlert} label="Signaux" value={notifications.length} to="/notifications?role=planner" />
          <QuickMetric icon={Users} label="RSVP attente" value={guestSummary.pending} to="/invites?role=planner" />
          <QuickMetric icon={CreditCard} label="À payer" value={formatMoney(vendorPaymentSummary.due)} to="/budget" />
          <QuickMetric icon={Sparkles} label="Prestataires verrouillés" value={vendorCommitmentSummary.lockedVendors} to="/prestataires" />
        </div>

        <div className="mt-8 grid gap-4 xl:grid-cols-[0.96fr_1.04fr]">
          <Surface className="p-5 md:p-6">
            <SectionHeading
              eyebrow="Le scan planner"
              title="Ce qui doit bouger maintenant"
              action={<Link to="/notifications?role=planner" className="text-sm text-zinc-600 hover:text-zinc-950 inline-flex items-center gap-2">Voir Athéna <MoveRight className="h-4 w-4" /></Link>}
            />
            <div className="mt-5 space-y-3">
              {notifications.length === 0 ? (
                <div className="rounded-[24px] border border-black/8 bg-[var(--color-warm-white)] px-4 py-5 text-sm text-zinc-600">
                  Rien de critique à remonter pour l’instant.
                </div>
              ) : (
                notifications.slice(0, 5).map((item) => <SignalItem key={item.id} item={item} />)
              )}
            </div>
          </Surface>

          <Surface className="p-5 md:p-6">
            <SectionHeading
              eyebrow="Le prochain flux"
              title="Ce qui arrive ensuite"
              action={<Link to="/jour-j?role=planner" className="text-sm text-zinc-600 hover:text-zinc-950 inline-flex items-center gap-2">Voir la timeline <MoveRight className="h-4 w-4" /></Link>}
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
          <SectionHeading eyebrow="Maisons planner" title="Les univers à ouvrir pour diriger" />
          <div className="mt-5 grid gap-4 xl:grid-cols-2">
            <ClusterCard
              eyebrow="Cockpit"
              title="Voir l’ensemble sans perdre le fil"
              description="Le planner tient la lecture globale, les alertes qui comptent et le niveau de décision utile sans noyer le couple ni les équipes."
              tone={criticalSignals > 0 ? "critical" : warningSignals > 0 ? "warning" : "calm"}
              metrics={[
                `${notifications.length} signal${notifications.length > 1 ? "aux" : ""}`,
                `${docsPending.length} doc${docsPending.length > 1 ? "s" : ""}`,
                countdownLabel,
              ]}
            >
              <HouseLink universeId="zeus" label="Zeus" title="Vision d’ensemble" detail="Le centre de gravité du mariage : arbitrages, repères, synchronisation globale." to="/univers/zeus" />
              <HouseLink universeId="athena" label="Athéna" title="Alertes & anticipation" detail="Voir plus tôt ce qui peut casser le rythme, la logistique ou l’expérience couple." to="/notifications?role=planner" />
            </ClusterCard>

            <ClusterCard
              eyebrow="Direction artistique"
              title="Tenir la beauté sans perdre l’opérationnel"
              description="Direction visuelle, image et ambiance avancent avec la même lecture que la préparation réelle : validations, météo, fenêtres critiques."
              tone={creativeVendors > 0 ? "warning" : "calm"}
              metrics={[
                `${creativeVendors} prestataire${creativeVendors > 1 ? "s" : ""}`,
                `${vendorCommitmentSummary.quotesPending} devis créatifs`,
                `${messages.length} diffusion${messages.length > 1 ? "s" : ""}`,
              ]}
            >
              <HouseLink universeId="aphrodite" label="Aphrodite" title="Scénographie & esthétique" detail="Palette, fleurs, matières et plan B restent cohérents sans se disperser." to="/univers/aphrodite" />
              <HouseLink universeId="apollon" label="Apollon" title="Photo, vidéo & mémoire" detail="Fenêtres image, captation et moments forts restent sécurisés dans le déroulé." to="/prestataires/registre?category=photo-video" />
              <HouseLink universeId="poseidon" label="Poséidon" title="Son & ambiance" detail="Micros, musique, transitions et montée émotionnelle restent sous contrôle." to="/prestataires/registre?category=music" />
            </ClusterCard>

            <ClusterCard
              eyebrow="Opérations"
              title="Exécuter sans flottement"
              description="Terrain, flux invités, dîner, service et soirée doivent partager la même lecture et les mêmes priorités, au bon niveau de pression."
              tone={pendingTimeline.length > 0 ? "warning" : "calm"}
              metrics={[
                `${pendingTimeline.length} séquence${pendingTimeline.length > 1 ? "s" : ""}`,
                `${opsVendors} prestataire${opsVendors > 1 ? "s" : ""} ops`,
                `${guestSummary.allergies + guestSummary.vegetarian} repas spéciaux`,
              ]}
            >
              <HouseLink universeId="ares" label="Arès" title="Jour J & exécution" detail="Le cœur terrain : implantation, séquences, incidents et tenue du rythme." to="/jour-j?role=planner" />
              <HouseLink universeId="artemis" label="Artémis" title="Lieux & accès" detail="Lieu, circulation, hébergements, parking et repli météo restent lisibles." to="/prestataires/registre?category=venue" />
              <HouseLink universeId="demeter" label="Déméter" title="Dîner & ressources" detail="Traiteur, tables, régimes, service et coûts vivent dans le même raisonnement." to="/budget" />
              <HouseLink universeId="dionysos" label="Dionysos" title="Soirée & énergie" detail="Ouverture de bal, soirée, tempo et fatigue terrain restent absorbés proprement." to="/univers/dionysos" />
            </ClusterCard>

            <ClusterCard
              eyebrow="Gestion"
              title="Diffuser, documenter, tenir l’administratif"
              description="Messages, documents, exports et accueil invités ne doivent jamais devenir des tâches flottantes ou des copies parallèles."
              tone={vendorPaymentSummary.openCount > 0 || docsPending.length > 0 ? "warning" : "calm"}
              metrics={[
                `${vendorPaymentSummary.openCount} paiement${vendorPaymentSummary.openCount > 1 ? "s" : ""}`,
                `${docsPending.length} document${docsPending.length > 1 ? "s" : ""}`,
                `${guestSummary.pending} RSVP attente`,
              ]}
            >
              <HouseLink universeId="hermes" label="Hermès" title="Communication & diffusion" detail="Envoyer au bon public la bonne version, sans bruit ni doublon." to="/communication?role=planner" />
              <HouseLink universeId="hephaistos" label="Héphaïstos" title="Supports & exports" detail="Feuilles de route, exports, PDFs et supports utiles au bon format." to="/exports?view=planner" />
              <HouseLink universeId="hestia" label="Hestia" title="Invités & accueil" detail="Foyers, RSVP, tables, besoins spéciaux et accueil restent centralisés dans leur maison source." to="/invites?role=planner" />
            </ClusterCard>
          </div>
        </div>

        <div className="mt-10 grid gap-4 xl:grid-cols-[0.98fr_1.02fr]">
          <Surface className="p-5 md:p-6">
            <SectionHeading
              eyebrow="Documents actifs"
              title="Ce qui reste mouvant"
              action={<Link to="/documents?role=planner" className="text-sm text-zinc-600 hover:text-zinc-950 inline-flex items-center gap-2">Ouvrir les docs <MoveRight className="h-4 w-4" /></Link>}
            />
            <div className="mt-5 space-y-3">
              {openDocuments.length === 0 ? (
                <div className="rounded-[24px] border border-black/8 bg-[var(--color-warm-white)] px-4 py-5 text-sm text-zinc-600">
                  Tous les documents visibles sont stables pour l’instant.
                </div>
              ) : (
                openDocuments.map((doc) => <DocumentItem key={doc.id} doc={doc} />)
              )}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <QuickMetric icon={FileText} label="Docs à revoir" value={docsPending.length} />
              <QuickMetric icon={CreditCard} label="Engagements ouverts" value={vendorCommitmentSummary.quotesPending + vendorCommitmentSummary.contractsPending + vendorCommitmentSummary.invoicesOpen} />
              <QuickMetric icon={Clock3} label="Étapes actives" value={pendingTimeline.length} />
            </div>
          </Surface>

          <div className="space-y-4">
            <Surface className="p-5 md:p-6">
              <SectionHeading
                eyebrow="Vision planning"
                title="Notes & diffusion"
                action={messages[0] ? <div className="text-sm text-zinc-500">Dernier envoi {formatShortDate(messages[0].sentAt)}</div> : null}
              />
              <div className="mt-5 space-y-3">
                {notes.length === 0 ? (
                  <div className="rounded-[24px] border border-black/8 bg-[var(--color-warm-white)] px-4 py-5 text-sm text-zinc-600">
                    Aucune note planning visible pour l’instant.
                  </div>
                ) : (
                  notes.map((note) => <NoteItem key={note.id} note={note} />)
                )}
              </div>

              <div className="mt-4 rounded-[24px] border border-black/8 bg-[var(--color-warm-white)] p-4">
                <div className="flex items-center gap-3">
                  <span className={`h-2.5 w-2.5 rounded-full ${dotClass(messages.length > 0 ? "calm" : "neutral")}`} />
                  <div className="text-sm font-semibold text-zinc-950">Dernier message diffusé</div>
                </div>
                <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
                  {messages[0]
                    ? `${messages[0].title} · ${compactText(messages[0].text, 150)}`
                    : "Aucune diffusion récente visible dans cette vue."}
                </p>
              </div>
            </Surface>

            <Surface className="p-5 md:p-6">
              <SectionHeading eyebrow="Contacts utiles" title="La bonne personne, vite" />
              <div className="mt-5 space-y-3">
                {contacts.map((contact) => (
                  <ContactCard key={`${contact.id}-${contact.phone}`} contact={contact} />
                ))}
              </div>
            </Surface>
          </div>
        </div>
      </div>
    </div>
  );
}
