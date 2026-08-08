import React, { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowUpRight,
  CalendarDays,
  Clock3,
  CreditCard,
  FileText,
  MoveRight,
  Phone,
  ShieldAlert,
  Star,
  Users,
} from "lucide-react";
import { UNIVERSE_GRADIENTS } from "@/lib/aimeUniverses";
import {
  filterDocumentsByRole,
  filterTimelineByRole,
  getCommunicationsForRole,
  getContactsForRole,
  getGuestSummary,
  getNotificationsForRole,
  getVendorCommitments,
  getVendorCommitmentSummary,
  getVendorMarketplace,
  getVendorPaymentSummary,
  readWeddingState,
  VENDOR_BOOKING_STAGES,
  VENDOR_COMMITMENT_STATUS,
  VENDOR_TAXONOMY,
} from "@/lib/aimeWeddingCore";

const moneyFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

function formatMoney(value) {
  return moneyFormatter.format(value || 0);
}

function compactText(value, max = 96) {
  if (!value) return "";
  const clean = value.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cutoff = clean.lastIndexOf(" ", max);
  return `${clean.slice(0, cutoff > 44 ? cutoff : max).trim()}…`;
}

function formatShortDate(value) {
  if (!value) return "À planifier";
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
  });
}

function dotClass(level = "neutral") {
  if (level === "critical") return "bg-[#d96868]";
  if (level === "warning") return "bg-[#d8a14b]";
  if (level === "calm") return "bg-[#69b48f]";
  return "bg-black/20";
}

function commitmentKindLabel(kind = "quote") {
  if (kind === "contract") return "Contrat";
  if (kind === "invoice") return "Facture";
  return "Devis";
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
    <div className="rounded-[24px] border border-white/12 bg-white/[0.06] p-4 md:p-5 backdrop-blur-sm">
      <div className="text-[11px] uppercase tracking-[0.18em] text-white/52">{label}</div>
      <div className="mt-2 text-[1.9rem] md:text-[2.2rem] leading-none font-display text-white">{value}</div>
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

function FilterChip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm transition-colors ${active ? "bg-black text-white" : "border border-black/8 bg-white text-zinc-700 hover:bg-black/[0.03]"}`}
    >
      {children}
    </button>
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
      to={item.href || "/prestataires"}
      className="group flex items-start justify-between gap-4 rounded-[24px] border border-black/8 bg-[var(--color-warm-white)] px-4 py-4 transition-colors hover:bg-black/[0.03]"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3">
          <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${dotClass(item.level)}`} />
          <div className="text-sm font-semibold text-zinc-950">{item.title}</div>
        </div>
        <p className="mt-2 pl-[22px] text-sm text-zinc-600 leading-relaxed">{compactText(item.text, 118)}</p>
      </div>
      <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </Link>
  );
}

function TimelineItem({ step }) {
  return (
    <div className="rounded-[24px] border border-black/8 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-zinc-950">{step.time} · {step.title}</div>
          <div className="mt-2 text-sm text-zinc-600 leading-relaxed">{compactText(step.detail, 116)}</div>
        </div>
        <span className="rounded-full border border-black/8 bg-[var(--color-warm-white)] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-zinc-700">
          {step.status}
        </span>
      </div>
    </div>
  );
}

function CommitmentItem({ item, vendor }) {
  return (
    <Link
      to={vendor ? `/prestataires/${vendor.id}` : "/prestataires"}
      className="group rounded-[24px] border border-black/8 bg-white p-4 transition-colors hover:bg-black/[0.02]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <span className={`h-2.5 w-2.5 rounded-full ${dotClass(["missing", "due"].includes(item.status) ? "critical" : "warning")}`} />
            <div className="text-sm font-semibold text-zinc-950">{vendor?.name || "Prestataire"}</div>
          </div>
          <div className="mt-2 pl-[22px] text-[11px] uppercase tracking-[0.16em] text-zinc-500">
            {commitmentKindLabel(item.kind)} · {VENDOR_COMMITMENT_STATUS[item.status]?.label || item.status}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold text-zinc-950">{formatMoney(item.amount)}</div>
          <div className="mt-1 text-[11px] uppercase tracking-[0.16em] text-zinc-500">{formatShortDate(item.dueAt)}</div>
        </div>
      </div>
      <p className="mt-3 text-sm text-zinc-600 leading-relaxed">{item.label} · {compactText(item.note, 100)}</p>
    </Link>
  );
}

function VendorCard({ vendor }) {
  const categoryLabel = VENDOR_TAXONOMY.find((item) => item.id === vendor.category)?.label || vendor.category;

  return (
    <Link
      to={`/prestataires/${vendor.id}`}
      className="group block rounded-[26px] border border-black/8 bg-white p-4 transition-colors hover:bg-black/[0.02]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-zinc-950">{vendor.name}</div>
          <div className="mt-1 text-[11px] uppercase tracking-[0.16em] text-zinc-500">{categoryLabel} · {vendor.city}</div>
        </div>
        <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-zinc-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </div>

      <p className="mt-3 text-sm text-zinc-600 leading-relaxed">{compactText(vendor.summary, 108)}</p>

      <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
        <div>
          <div className="aime-label text-zinc-500 mb-1">Prix</div>
          <div className="text-zinc-900">{formatMoney(vendor.priceFrom)}</div>
        </div>
        <div>
          <div className="aime-label text-zinc-500 mb-1">Réponse</div>
          <div className="text-zinc-900">{vendor.responseTime}</div>
        </div>
        <div>
          <div className="aime-label text-zinc-500 mb-1">Avis</div>
          <div className="inline-flex items-center gap-1 text-zinc-900"><Star className="h-3.5 w-3.5" />{vendor.rating}</div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full border border-black/8 bg-[var(--color-warm-white)] px-3 py-1.5 text-[12px] text-zinc-700">
          {VENDOR_BOOKING_STAGES[vendor.bookingStage]?.label || vendor.bookingStage}
        </span>
        <span className="rounded-full border border-black/8 bg-[var(--color-warm-white)] px-3 py-1.5 text-[12px] text-zinc-700 inline-flex items-center gap-2">
          <CreditCard className="h-3.5 w-3.5" />
          {vendor.paymentStatus}
        </span>
      </div>
    </Link>
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

export default function VendorsPortal() {
  const state = useMemo(() => readWeddingState(), []);
  const [searchParams, setSearchParams] = useSearchParams();

  const requestedCategory = searchParams.get("category") || "all";
  const taxonomy = VENDOR_TAXONOMY.some((item) => item.id === requestedCategory) ? requestedCategory : "all";
  const taxonomyLabel = VENDOR_TAXONOMY.find((item) => item.id === taxonomy)?.label || "Tous";

  const marketplace = useMemo(() => getVendorMarketplace(state, taxonomy), [state, taxonomy]);
  const paymentSummary = useMemo(() => getVendorPaymentSummary(state), [state]);
  const commitmentSummary = useMemo(() => getVendorCommitmentSummary(state), [state]);
  const guestSummary = useMemo(() => getGuestSummary(state), [state]);
  const docs = useMemo(() => filterDocumentsByRole(state.documents, "vendors"), [state]);
  const steps = useMemo(() => filterTimelineByRole(state.timeline?.steps || [], "vendors"), [state]);
  const notifications = useMemo(() => getNotificationsForRole(state, "vendors"), [state]);
  const contacts = useMemo(() => getContactsForRole(state, "vendors"), [state]);
  const messages = useMemo(() => getCommunicationsForRole(state, "vendors").slice(0, 2), [state]);

  const docsPending = docs.filter((doc) => !["prêt", "partagé", "complet"].includes(doc.status));
  const upcomingSteps = steps.filter((step) => step.status !== "done").slice(0, 5);
  const visibleVendorIds = new Set(marketplace.map((vendor) => vendor.id));
  const openCommitments = getVendorCommitments(state)
    .filter((item) => taxonomy === "all" || visibleVendorIds.has(item.vendorId))
    .filter((item) => ["received", "sent", "missing", "due", "scheduled"].includes(item.status))
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime())
    .slice(0, 4);
  const topSignals = notifications.slice(0, 5);
  const featuredVendors = marketplace.slice(0, 6);
  const duePayments = paymentSummary.due;
  const scheduledTouchpoints = marketplace.filter((vendor) => vendor.nextTouchpointAt).length;
  const criticalSignals = notifications.filter((item) => item.level === "critical").length;
  const warningSignals = notifications.filter((item) => item.level === "warning").length;

  const missionCount = state.vendors?.marketplace?.filter((vendor) => ["flowers-decor", "photo-video", "music"].includes(vendor.category)).length || 0;
  const opsCount = state.vendors?.marketplace?.filter((vendor) => ["venue", "catering", "transport"].includes(vendor.category)).length || 0;

  const updateCategory = (next) => {
    if (next === "all") {
      setSearchParams({});
      return;
    }
    setSearchParams({ category: next });
  };

  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] text-[var(--color-text-primary)] overflow-x-hidden">
      <div className="mx-auto max-w-[1320px] px-5 pb-10 pt-4 md:px-8 md:pb-12 lg:px-10">
        <section className="relative overflow-hidden rounded-[38px] bg-[var(--color-black)] text-white shadow-[0_24px_70px_rgba(0,0,0,0.12)]">
          <img src="/landing/ares.jpg" alt="Homepage prestataires" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.16),rgba(0,0,0,0.84))]" aria-hidden="true" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_24%)]" aria-hidden="true" />

          <div className="relative z-10 grid gap-8 px-5 py-6 md:px-8 md:py-8 lg:grid-cols-[1.02fr_0.98fr] lg:px-10 lg:py-10">
            <div className="max-w-3xl">
              <div className="aime-kicker">Homepage Prestataires</div>
              <h1 className="mt-5 font-display text-[2.65rem] leading-[0.94] tracking-[var(--tracking-display)] text-white sm:text-[4rem] lg:text-[5.1rem]">
                Votre mission,
                <br />
                sans friction.
              </h1>
              <p className="mt-5 max-w-2xl text-[15px] leading-[1.65] text-white/72 md:text-[17px]">
                Une seule lecture utile pour les équipes : ce qu’il faut relire, signer, payer, préparer ou exécuter. Rien de plus.
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5">
                <UniverseChip universeId="zeus" label="Zeus" />
                <UniverseChip universeId="hermes" label="Hermès" />
                <UniverseChip universeId="athena" label="Athéna" />
                <UniverseChip universeId="ares" label="Arès" />
              </div>

              <div className="mt-7 flex flex-wrap gap-2.5">
                <Link to="/documents?role=vendors" className="aime-button-primary rounded-full px-5 py-3 text-sm font-medium inline-flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Ouvrir les docs
                </Link>
                <Link to="/jour-j?role=vendors" className="rounded-full border border-white/14 bg-white/[0.04] px-5 py-3 text-sm text-white/88 hover:bg-white/[0.08] inline-flex items-center gap-2 transition-colors">
                  <CalendarDays className="h-4 w-4" />
                  Voir le Jour J
                </Link>
                <Link to="/budget" className="rounded-full border border-white/14 bg-white/[0.04] px-5 py-3 text-sm text-white/88 hover:bg-white/[0.08] inline-flex items-center gap-2 transition-colors">
                  <CreditCard className="h-4 w-4" />
                  Paiements
                </Link>
              </div>
            </div>

            <div className="grid gap-4 self-end sm:grid-cols-2">
              <HeroStat label="Vue active" value={marketplace.length} detail={taxonomyLabel} />
              <HeroStat label="À sécuriser" value={openCommitments.length} detail={`${criticalSignals} critique${criticalSignals > 1 ? "s" : ""}`} />
              <HeroStat label="Documents utiles" value={docsPending.length} detail="Encore à relire ou verrouiller" />
              <HeroStat label="Paiements ouverts" value={paymentSummary.openCount} detail={`${formatMoney(duePayments)} dus`} />
            </div>
          </div>
        </section>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <QuickMetric icon={ShieldAlert} label="Signaux" value={notifications.length} to="/notifications?role=vendors" />
          <QuickMetric icon={Clock3} label="Touchpoints" value={scheduledTouchpoints} />
          <QuickMetric icon={Users} label="Repas spéciaux" value={guestSummary.allergies + guestSummary.vegetarian} to="/invites?role=vendors" />
          <QuickMetric icon={CreditCard} label="Montant dû" value={formatMoney(duePayments)} to="/budget" />
        </div>

        <Surface className="mt-5 p-5 md:p-6">
          <SectionHeading
            eyebrow="Filtre de lecture"
            title="Quel périmètre voulez-vous voir ?"
            action={<div className="text-sm text-zinc-500">{taxonomyLabel}</div>}
          />
          <div className="mt-5 flex flex-wrap gap-2">
            {VENDOR_TAXONOMY.map((item) => (
              <FilterChip key={item.id} active={taxonomy === item.id} onClick={() => updateCategory(item.id)}>
                {item.label}
              </FilterChip>
            ))}
          </div>
        </Surface>

        <div className="mt-8 grid gap-4 xl:grid-cols-[0.98fr_1.02fr]">
          <Surface className="p-5 md:p-6">
            <SectionHeading
              eyebrow="Coordination"
              title="Ce qui change vraiment"
              action={<Link to="/notifications?role=vendors" className="text-sm text-zinc-600 hover:text-zinc-950 inline-flex items-center gap-2">Ouvrir Athéna <MoveRight className="h-4 w-4" /></Link>}
            />
            <div className="mt-5 space-y-3">
              {topSignals.length === 0 ? (
                <div className="rounded-[24px] border border-black/8 bg-[var(--color-warm-white)] px-4 py-5 text-sm text-zinc-600">
                  Aucun signal utile à remonter pour le moment.
                </div>
              ) : (
                topSignals.map((item) => <SignalItem key={item.id} item={item} />)
              )}
            </div>

            <div className="mt-5 rounded-[24px] border border-black/8 bg-[var(--color-warm-white)] p-4">
              <div className="flex items-center gap-3">
                <span className={`h-2.5 w-2.5 rounded-full ${dotClass(messages.length > 0 ? "calm" : "neutral")}`} />
                <div className="text-sm font-semibold text-zinc-950">Dernier message partagé</div>
              </div>
              <div className="mt-2 text-sm text-zinc-600 leading-relaxed">
                {messages[0]
                  ? `${messages[0].title} · ${compactText(messages[0].text, 135)}`
                  : "Aucun message partagé pour l’instant."}
              </div>
            </div>
          </Surface>

          <Surface className="p-5 md:p-6">
            <SectionHeading
              eyebrow="Opérations"
              title="Les prochaines fenêtres terrain"
              action={<Link to="/jour-j?role=vendors" className="text-sm text-zinc-600 hover:text-zinc-950 inline-flex items-center gap-2">Voir Arès <MoveRight className="h-4 w-4" /></Link>}
            />
            <div className="mt-5 space-y-3">
              {upcomingSteps.length === 0 ? (
                <div className="rounded-[24px] border border-black/8 bg-[var(--color-warm-white)] px-4 py-5 text-sm text-zinc-600">
                  Aucun créneau actif pour l’instant.
                </div>
              ) : (
                upcomingSteps.map((step) => <TimelineItem key={step.id} step={step} />)
              )}
            </div>

            <div className="mt-5 space-y-3">
              {docsPending.slice(0, 3).map((doc) => (
                <div key={doc.id} className="rounded-[24px] border border-black/8 bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-zinc-950">{doc.title}</div>
                      <div className="mt-2 text-sm text-zinc-600 leading-relaxed">{compactText(doc.summary, 112)}</div>
                    </div>
                    <span className="rounded-full border border-black/8 bg-[var(--color-warm-white)] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-zinc-700">
                      {doc.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Surface>
        </div>

        <div className="mt-10">
          <SectionHeading eyebrow="Maisons prestataires" title="Les univers utiles pour travailler" />
          <div className="mt-5 grid gap-4 xl:grid-cols-2">
            <ClusterCard
              eyebrow="Mon portail"
              title="Voir, comprendre, recevoir"
              description="Le prestataire n’a pas besoin de tout le mariage. Seulement des bons repères, des bons messages et des bons signaux."
              tone={criticalSignals > 0 ? "critical" : warningSignals > 0 ? "warning" : "calm"}
              metrics={[
                `${notifications.length} signal${notifications.length > 1 ? "aux" : ""}`,
                `${messages.length} message${messages.length > 1 ? "s" : ""}`,
                `${upcomingSteps.length} séquence${upcomingSteps.length > 1 ? "s" : ""}`,
              ]}
            >
              <HouseLink universeId="zeus" label="Zeus" title="Vue globale" detail="Le bon niveau de contexte, sans bruit ni doublon, pour comprendre le mariage." to="/point-zero?role=vendors" />
              <HouseLink universeId="hermes" label="Hermès" title="Échanges & diffusion" detail="Recevoir la bonne version, le bon message et le bon contact au bon moment." to="/communication?role=vendors" />
              <HouseLink universeId="athena" label="Athéna" title="Alertes & vigilance" detail="Lire les points qui changent vraiment l’exécution de votre mission." to="/notifications?role=vendors" />
            </ClusterCard>

            <ClusterCard
              eyebrow="Ma mission"
              title="Créer, livrer, tenir la qualité"
              description="Direction artistique, image, ambiance et séquences de soirée doivent rester lisibles, même quand le terrain bouge."
              tone={openCommitments.length > 0 ? "warning" : "calm"}
              metrics={[
                `${missionCount} équipe${missionCount > 1 ? "s" : ""} mission`,
                `${commitmentSummary.quotesPending} devis ouverts`,
                `${paymentSummary.openCount} règlement${paymentSummary.openCount > 1 ? "s" : ""}`,
              ]}
            >
              <HouseLink universeId="aphrodite" label="Aphrodite" title="Scénographie & déco" detail="Tenir les intentions esthétiques, les matières et les adaptations de dernière minute." to="/prestataires?category=flowers-decor" />
              <HouseLink universeId="apollon" label="Apollon" title="Image & captation" detail="Photo, vidéo et fenêtres fortes du mariage restent coordonnées." to="/prestataires?category=photo-video" />
              <HouseLink universeId="poseidon" label="Poséidon" title="Son & ambiance" detail="Micros, musique, transitions et immersion restent lisibles pour l’équipe." to="/prestataires?category=music" />
            </ClusterCard>

            <ClusterCard
              eyebrow="Logistique"
              title="Accès, terrain, service"
              description="Le lieu, le service et les séquences critiques doivent partager la même lecture terrain : accès, flux, service, bascules."
              tone={upcomingSteps.length > 0 ? "warning" : "calm"}
              metrics={[
                `${opsCount} équipe${opsCount > 1 ? "s" : ""} logistique`,
                `${guestSummary.allergies + guestSummary.vegetarian} repas spéciaux`,
                `${upcomingSteps.length} créneau${upcomingSteps.length > 1 ? "x" : ""}`,
              ]}
            >
              <HouseLink universeId="ares" label="Arès" title="Jour J & exécution" detail="Le déroulé utile pour agir au bon moment, sans porter toute la charge mentale." to="/jour-j?role=vendors" />
              <HouseLink universeId="artemis" label="Artémis" title="Lieu & accès" detail="Accès techniques, circulation, stationnement et repli restent clairs." to="/prestataires?category=venue" />
              <HouseLink universeId="demeter" label="Déméter" title="Dîner & ressources" detail="Traiteur, service et besoins invités restent reliés aux bonnes données sources." to="/prestataires?category=catering" />
            </ClusterCard>

            <ClusterCard
              eyebrow="Admin"
              title="Signer, payer, transmettre"
              description="Les supports, les pièces et les informations invitées utiles ne doivent jamais rester flottants ou dispersés."
              tone={paymentSummary.openCount > 0 || docsPending.length > 0 ? "warning" : "calm"}
              metrics={[
                `${docsPending.length} doc${docsPending.length > 1 ? "s" : ""} à relire`,
                `${paymentSummary.openCount} paiement${paymentSummary.openCount > 1 ? "s" : ""}`,
                `${guestSummary.allergies} allergie${guestSummary.allergies > 1 ? "s" : ""}`,
              ]}
            >
              <HouseLink universeId="hephaistos" label="Héphaïstos" title="Documents & supports" detail="Exports, feuilles, pièces et documents réellement utiles aux équipes." to="/documents?role=vendors" />
              <HouseLink universeId="hestia" label="Hestia" title="Tables & besoins invités" detail="RSVP confirmés, tables, allergies et accueil vus sans dupliquer la donnée source." to="/invites?role=vendors" />
            </ClusterCard>
          </div>
        </div>

        <div className="mt-10 grid gap-4 xl:grid-cols-[1.04fr_0.96fr]">
          <Surface className="p-5 md:p-6">
            <SectionHeading
              eyebrow="Périmètre actif"
              title={`Prestataires visibles · ${taxonomyLabel}`}
              action={<div className="text-sm text-zinc-500">{featuredVendors.length} cartes</div>}
            />
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {featuredVendors.map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
            </div>
          </Surface>

          <div className="space-y-4">
            <Surface className="p-5 md:p-6">
              <SectionHeading
                eyebrow="À sécuriser"
                title="Devis, contrats, factures"
                action={<Link to="/budget" className="text-sm text-zinc-600 hover:text-zinc-950 inline-flex items-center gap-2">Budget <MoveRight className="h-4 w-4" /></Link>}
              />
              <div className="mt-5 space-y-3">
                {openCommitments.length === 0 ? (
                  <div className="rounded-[24px] border border-black/8 bg-[var(--color-warm-white)] px-4 py-5 text-sm text-zinc-600">
                    Aucun engagement ouvert sur ce filtre.
                  </div>
                ) : (
                  openCommitments.map((item) => {
                    const vendor = (state.vendors?.marketplace || []).find((entry) => entry.id === item.vendorId);
                    return <CommitmentItem key={item.id} item={item} vendor={vendor} />;
                  })
                )}
              </div>
            </Surface>

            <Surface className="p-5 md:p-6">
              <SectionHeading eyebrow="Contacts utiles" title="Les bonnes personnes" />
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
