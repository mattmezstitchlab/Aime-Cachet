import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronRight,
  Download,
  ShieldCheck,
} from "lucide-react";
import { UNIVERSE_GRADIENTS } from "@/lib/aimeUniverses";
import {
  getBudgetSummary,
  getCommunicationsForRole,
  getGuestSummary,
  getHouseholdOverview,
  getInvitationSummary,
  getNotificationsForRole,
  getVendorCommitmentSummary,
  getVendorMarketplace,
  readWeddingState,
} from "@/lib/aimeWeddingCore";
import { getVendorVisual } from "@/lib/aimeVendorVisuals";

function formatMoney(value) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value || 0);
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
    year: "numeric",
  });
}

function splitCoupleName(value = "Iris & Noam") {
  const parts = value.split("&").map((item) => item.trim()).filter(Boolean);
  return [parts[0] || "Iris", parts[1] || "Noam"];
}

function initials(value = "AIME") {
  return value
    .split(/\s|&|\//)
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase())
    .join("") || "AI";
}

function UniverseBadge({ universeId, label }) {
  return (
    <span
      className="inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white"
      style={{ background: UNIVERSE_GRADIENTS[universeId] }}
    >
      {label}
    </span>
  );
}

function Avatar({ image, label, size = "md" }) {
  const sizes = {
    sm: "w-11 h-11 text-sm",
    md: "w-20 h-20 md:w-24 md:h-24 text-lg",
    lg: "w-40 h-40 md:w-52 md:h-52 text-3xl",
  };

  if (image) {
    return <img src={image} alt={label} className={`rounded-full object-cover ${sizes[size]}`} />;
  }

  return (
    <div className={`rounded-full bg-[var(--color-warm-gray-100)] border border-black/8 flex items-center justify-center font-semibold text-zinc-900 ${sizes[size]}`}>
      {initials(label)}
    </div>
  );
}

function AccountShell({ topLabel, navItems, activeIndex = 0, avatarImage = null, avatarLabel = "AIME", rightLabel = null, footerTone = "light", children }) {
  return (
    <div className="min-h-screen bg-[#f2f1ee] text-[var(--color-text-primary)] overflow-x-hidden px-2 md:px-4 py-4 md:py-6">
      <div className="mx-auto max-w-[1520px] rounded-[24px] md:rounded-[28px] border border-black/6 bg-white shadow-[0_18px_48px_rgba(12,12,12,0.05)] overflow-hidden">
        <div className="px-6 md:px-10 py-6 md:py-7 border-b border-black/6">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Link to="/" className="font-display text-[2rem] leading-none text-zinc-950">AIME</Link>
              <span className="text-[11px] uppercase tracking-[0.16em] text-zinc-400">Wedding</span>
            </div>

            <nav className="hidden md:flex items-center gap-10">
              {navItems.map((item, index) => (
                <span key={item} className={`relative text-[15px] ${index === activeIndex ? "text-zinc-950 font-medium" : "text-zinc-700"}`}>
                  {item}
                  {index === activeIndex && <span className="absolute left-0 right-0 -bottom-3 h-[2px] rounded-full bg-[#b9a47b]" />}
                </span>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              {rightLabel && <span className="hidden md:inline text-sm text-zinc-600">{rightLabel}</span>}
              <Avatar image={avatarImage} label={avatarLabel} size="sm" />
            </div>
          </div>
        </div>

        <div className="px-6 md:px-10 py-8 md:py-10">{children}</div>

        {footerTone === "light" ? (
          <div className="px-6 md:px-10 py-6 border-t border-black/6 flex items-center justify-between gap-4 text-sm text-zinc-500">
            <div>AIME WEDDING® · Votre mariage, votre espace.</div>
            <div>Paris, France</div>
          </div>
        ) : (
          <div className="bg-[#111111] text-white px-6 md:px-10 py-10 md:py-12">
            <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
              <div>
                <div className="font-display text-[2rem] text-white">AIME</div>
                <p className="mt-4 max-w-md text-white/66 leading-relaxed">
                  La plateforme d'excellence dédiée à l’art et à l'organisation de mariages prestigieux.
                </p>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-white/45 mb-4">Portail</div>
                <div className="space-y-3 text-white/72">
                  <div>Ressources</div>
                  <div>Mentions Légales</div>
                  <div>Confidentialité</div>
                  <div>Support d'excellence</div>
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-white/45 mb-4">Communauté</div>
                <div className="space-y-3 text-white/72">
                  <div>Prestataires agréés</div>
                  <div>Missions d'art</div>
                  <div>Almanac de la mariée</div>
                </div>
              </div>
            </div>
            <div className="mt-10 border-t border-white/10 pt-6 flex items-center justify-between gap-4 text-sm text-white/48">
              <div>© 2027 AIME Wedding. Tous droits réservés.</div>
              <div>In Art and Love, We Trust.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TitleBlock({ eyebrow, title }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.18em] text-[#b8a27d]">{eyebrow}</div>
      <h1 className="mt-3 font-display text-[3rem] md:text-[4.2rem] leading-[0.92] text-zinc-950">{title}</h1>
    </div>
  );
}

function SectionTitle({ title }) {
  return <h2 className="font-display text-[2rem] md:text-[2.4rem] leading-[0.98] text-zinc-950">{title}</h2>;
}

function InfoField({ label, value, trailing = null, emphasis = false }) {
  return (
    <div className="rounded-[14px] border border-black/8 bg-white px-4 py-3 min-h-[56px] flex items-center justify-between gap-3">
      <div>
        <div className="text-[11px] uppercase tracking-[0.14em] text-zinc-500 mb-1">{label}</div>
        <div className={`text-[15px] ${emphasis ? "font-semibold text-[#4f7d61]" : "text-zinc-900"}`}>{value}</div>
      </div>
      {trailing}
    </div>
  );
}

function MetricCard({ label, value, detail = null }) {
  return (
    <div className="rounded-[18px] border border-black/8 bg-white p-5 shadow-[0_10px_28px_rgba(12,12,12,0.03)]">
      <div className="text-[11px] uppercase tracking-[0.14em] text-zinc-500">{label}</div>
      <div className="mt-4 font-display text-[2.2rem] leading-none text-zinc-950">{value}</div>
      {detail && <div className="mt-2 text-sm text-zinc-500">{detail}</div>}
    </div>
  );
}

function QuickCard({ title, text, universeId, to }) {
  return (
    <Link to={to} className="group rounded-[22px] border border-black/8 bg-white p-5 shadow-[0_10px_28px_rgba(12,12,12,0.03)] hover:bg-black/[0.02] transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[1rem] md:text-[1.05rem] font-semibold text-zinc-950">{title}</div>
          <div className="mt-3 text-sm text-zinc-600 leading-relaxed">{text}</div>
        </div>
        <UniverseBadge universeId={universeId} label={universeId} />
      </div>
    </Link>
  );
}

function ToggleRow({ label, detail = null, checked = false, onToggle = null }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-black/8 last:border-b-0">
      <div>
        <div className="text-[15px] text-zinc-900">{label}</div>
        {detail && <div className="mt-1 text-sm text-zinc-500">{detail}</div>}
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`relative h-8 w-14 rounded-full transition-colors ${checked ? "bg-black" : "bg-[#ddd8cf]"}`}
      >
        <span className={`absolute top-1 h-6 w-6 rounded-full bg-white transition-transform ${checked ? "translate-x-7" : "translate-x-1"}`} />
      </button>
    </div>
  );
}

function LineAction({ label, value = null, tone = "default" }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-black/8 last:border-b-0">
      <div className={`text-[15px] ${tone === "danger" ? "text-[#b65353]" : "text-zinc-900"}`}>{label}</div>
      <div className="inline-flex items-center gap-2 text-sm text-zinc-500">
        {value && <span>{value}</span>}
        <ChevronRight className={`h-4 w-4 ${tone === "danger" ? "text-[#b65353]" : ""}`} />
      </div>
    </div>
  );
}

function ProgressBar({ value }) {
  return (
    <div className="h-2 rounded-full bg-black/8 overflow-hidden">
      <div className="h-full rounded-full bg-[#a99a80]" style={{ width: `${value}%` }} />
    </div>
  );
}

function DiscussionBubble({ author, at, text, own = false }) {
  return (
    <div className="rounded-[18px] border border-black/8 bg-white p-4 shadow-[0_8px_18px_rgba(12,12,12,0.03)]">
      <div className="flex items-start justify-between gap-3">
        <div className="font-semibold text-zinc-900">{author}</div>
        <div className="text-sm text-zinc-500">{at}</div>
      </div>
      <div className="mt-3 text-sm leading-relaxed text-zinc-600">{text}</div>
    </div>
  );
}

export default function AccountSpacePage({ modeId }) {
  const state = useMemo(() => readWeddingState(), []);
  const [firstName, secondName] = splitCoupleName(state.meta?.couple);
  const [guestNotifications, setGuestNotifications] = useState(true);
  const [guestDarkMode, setGuestDarkMode] = useState(false);
  const [vendorMailNotif, setVendorMailNotif] = useState(true);
  const [vendorCalendarSync, setVendorCalendarSync] = useState(true);

  const budget = useMemo(() => getBudgetSummary(state), [state]);
  const guests = useMemo(() => getGuestSummary(state), [state]);
  const households = useMemo(() => getHouseholdOverview(state), [state]);
  const invitations = useMemo(() => getInvitationSummary(state), [state]);
  const notifications = useMemo(() => getNotificationsForRole(state, "planner"), [state]);
  const communications = useMemo(() => getCommunicationsForRole(state, "planner"), [state]);
  const vendors = useMemo(() => getVendorMarketplace(state, "all"), [state]);
  const commitments = useMemo(() => getVendorCommitmentSummary(state), [state]);

  const primaryGuest = useMemo(() => {
    const list = state.guests?.list || [];
    return list.find((guest) => guest.rsvpStatus === "confirmed" && guest.accommodation) || list.find((guest) => guest.rsvpStatus === "confirmed") || list[0] || null;
  }, [state.guests?.list]);

  const flowerVendor = vendors.find((vendor) => vendor.category === "flowers-decor") || vendors[0] || null;
  const plannerImage = "/landing/athena.jpg";
  const coupleImage = "/landing/hero-aime-wedding.jpg";
  const guestImage = "/landing/hestia.jpg";
  const vendorImage = getVendorVisual(flowerVendor);
  const coupleTasksProgress = 64;

  const plannerPortfolio = [
    {
      id: "current",
      title: state.meta?.couple || "Iris & Noam",
      subtitle: `${formatDate(state.meta?.date)} · ${state.meta?.venue || "Lieu"}`,
      progress: 64,
      countdown: `J-${state.meta?.countdownDays || 312}`,
      image: "/landing/aphrodite.jpg",
    },
    {
      id: "clara",
      title: "Clara & Antoine",
      subtitle: "3 sept 2027 · Domaine de Sulaize",
      progress: 38,
      countdown: "J-393 jours restantes",
      image: "/landing/artemis.jpg",
    },
    {
      id: "julie",
      title: "Julie & Marc",
      subtitle: "22 avril 2027 · Mas de So",
      progress: 82,
      countdown: "J-259 jours restantes",
      image: "/landing/dionysos.jpg",
    },
    {
      id: "lea",
      title: "Léa & Hugo",
      subtitle: "18 oct 2027 · Abbaye de Fontenay",
      progress: 15,
      countdown: "J-438 jours restantes",
      image: "/landing/zeus.jpg",
    },
  ];

  if (modeId === "maries") {
    return (
      <AccountShell
        topLabel="espace-maries"
        navItems={["Piloter", "Créer", "Organiser", "Communiquer"]}
        activeIndex={0}
        avatarImage={coupleImage}
        avatarLabel={state.meta?.couple}
        footerTone="light"
      >
        <TitleBlock eyebrow="Mariés · paramètres & profil" title="Mon espace" />

        <section className="mt-12">
          <SectionTitle title="Profil du couple" />
          <div className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr] items-start">
            <div className="flex flex-col items-center gap-5">
              <Avatar image={coupleImage} label={state.meta?.couple} size="lg" />
              <button className="rounded-full border border-black/12 bg-white px-5 py-3 text-sm text-zinc-800 hover:bg-black/[0.03]">
                Modifier la photo
              </button>
            </div>
            <div>
              <div className="grid gap-4 md:grid-cols-2">
                <InfoField label="Prénom 1" value={firstName} />
                <InfoField label="Prénom 2" value={secondName} />
                <InfoField label="Date du mariage" value={formatDate(state.meta?.date)} />
                <InfoField label="Lieu principal" value={state.meta?.venue || "Lieu à confirmer"} />
                <InfoField label="Email" value="bonjour@aime-wedding.com" />
                <InfoField label="Téléphone" value={state.contacts?.couple?.phone || "+33 6 12 34 56 78"} />
              </div>
              <div className="mt-5 flex justify-end">
                <button className="rounded-full bg-black px-6 py-3 text-sm text-white hover:bg-zinc-800 inline-flex items-center gap-2">
                  Modifier le profil
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-14">
          <SectionTitle title="Résumé du mariage" />
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Budget total" value={formatMoney(budget.envelope)} />
            <MetricCard label="Invités confirmés" value={`${guests.confirmed} / ${guests.total}`} />
            <MetricCard label="Jours restants" value={state.meta?.countdownDays || 312} />
            <MetricCard label="Tâches complétées" value={`${coupleTasksProgress}%`} />
          </div>
        </section>

        <section className="mt-14">
          <SectionTitle title="Accès rapides" />
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <QuickCard title="Mon budget" text="Voir le détail des dépenses" universeId="zeus" to="/budget" />
            <QuickCard title="Ma guest list" text="Gérer les invités et RSVP" universeId="hestia" to="/invites?role=couple" />
            <QuickCard title="Mon planning" text="Checklist et rétroplanning" universeId="athena" to="/notifications?role=couple" />
            <QuickCard title="Mon moodboard" text="Inspirations et palette" universeId="aphrodite" to="/univers/aphrodite" />
            <QuickCard title="Ma galerie" text="Photos et albums" universeId="apollon" to="/univers/apollon" />
            <QuickCard title="Mes messages" text="Conversations et annonces" universeId="hermes" to="/communication?role=couple" />
          </div>
        </section>

        <section className="mt-14 max-w-[920px]">
          <SectionTitle title="Paramètres" />
          <div className="mt-6 rounded-[24px] border border-black/8 bg-white px-4 md:px-6 py-2 shadow-[0_10px_28px_rgba(12,12,12,0.03)]">
            <ToggleRow label="Notifications" checked={guestNotifications} onToggle={() => setGuestNotifications((v) => !v)} />
            <ToggleRow label="Mode sombre" checked={guestDarkMode} onToggle={() => setGuestDarkMode((v) => !v)} />
            <LineAction label="Langue" value="Français" />
            <LineAction label="Partage avec le planner" value="Activé" />
            <LineAction label="Exporter mes données" />
            <LineAction label="Supprimer mon compte" tone="danger" />
          </div>
        </section>
      </AccountShell>
    );
  }

  if (modeId === "invites") {
    const household = households.find((item) => item.id === (primaryGuest?.householdId || primaryGuest?.household)) || null;
    return (
      <AccountShell
        topLabel="espace-invites"
        navItems={["Essentiel", "Venir", "Jour J", "Aide"]}
        activeIndex={0}
        avatarImage={guestImage}
        avatarLabel={primaryGuest ? `${primaryGuest.firstName} ${primaryGuest.lastName}` : "Invité"}
        footerTone="light"
      >
        <TitleBlock eyebrow="Invité · mes informations" title="Mon espace" />

        <section className="mt-12">
          <SectionTitle title="Mon profil invité" />
          <div className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr] items-start">
            <div className="flex flex-col items-center gap-5">
              <Avatar image={guestImage} label={primaryGuest ? `${primaryGuest.firstName} ${primaryGuest.lastName}` : "Invité"} size="lg" />
              <button className="rounded-full border border-black/12 bg-white px-5 py-3 text-sm text-zinc-800 hover:bg-black/[0.03]">
                Modifier la photo
              </button>
            </div>
            <div>
              <div className="grid gap-4 md:grid-cols-2">
                <InfoField label="Nom complet" value={primaryGuest ? `${primaryGuest.firstName} ${primaryGuest.lastName}` : "Marie Dupont"} />
                <InfoField label="Adresse email" value="invitation@email.com" />
                <InfoField label="Foyer" value={household ? `${household.label} (${household.count} personnes)` : "Famille Martin"} />
                <InfoField label="Statut RSVP" value={primaryGuest?.rsvpStatus === "confirmed" ? "Confirmé" : "En attente"} emphasis />
                <InfoField label="Régime alimentaire" value={primaryGuest?.mealPreference === "vegetarian" ? "Végétarien" : primaryGuest?.mealPreference === "allergy" ? "Sans gluten" : "Standard"} />
                <InfoField label="Table assignée" value={primaryGuest?.tableCode ? `${primaryGuest.tableCode} — placement confirmé` : "À confirmer"} />
              </div>
              <div className="mt-5 flex justify-end">
                <button className="rounded-full bg-black px-6 py-3 text-sm text-white hover:bg-zinc-800 inline-flex items-center gap-2">
                  Modifier mes infos
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-14">
          <SectionTitle title="Mon RSVP" />
          <div className="mt-6 rounded-[26px] border border-black/8 bg-white shadow-[0_10px_28px_rgba(12,12,12,0.03)] p-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="font-display text-[2rem] text-zinc-950">Présence confirmée ✓</div>
              <div className="rounded-full bg-[#e9f3ed] px-4 py-2 text-sm text-[#4f7d61]">{household?.count || 1} invités</div>
            </div>
            <div className="mt-6 border-t border-black/8 pt-5 space-y-4 text-sm">
              <div className="flex items-center justify-between gap-4"><span className="text-zinc-500">Allergies déclarées</span><span className="text-zinc-900">{primaryGuest?.mealPreference === "allergy" ? "Sans gluten (1 personne)" : invitations.plusOneAllowed > 0 ? "Aucune allergie critique" : "Aucune"}</span></div>
              <div className="flex items-center justify-between gap-4"><span className="text-zinc-500">Hébergement</span><span className="text-zinc-900">{primaryGuest?.accommodation ? `${state.guestPortal?.accommodations?.[0]?.name || "Hôtel partenaire"} — réservé` : "Non nécessaire"}</span></div>
              <div className="flex items-center justify-between gap-4"><span className="text-zinc-500">Transport</span><span className="text-zinc-900">{primaryGuest?.shuttle ? `${state.guestPortal?.shuttles?.[0]?.route || "Navette"} — ${state.guestPortal?.shuttles?.[0]?.time || "14h00"}` : "Libre"}</span></div>
            </div>
            <button className="mt-6 rounded-full border border-black/12 bg-white px-5 py-3 text-sm text-zinc-800 hover:bg-black/[0.03] inline-flex items-center gap-2">
              Modifier mon RSVP
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>

        <section className="mt-14">
          <SectionTitle title="Informations utiles" />
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <QuickCard title="Le lieu" text={`${state.guestPortal?.travel?.receptionAddress || state.meta?.venue} · Accès et plan`} universeId="artemis" to="/univers/artemis" />
            <QuickCard title="Le programme" text={(state.guestPortal?.schedule || []).slice(0, 3).map((item) => `${item.title}`).join(" · ")} universeId="poseidon" to="/univers/poseidon" />
            <QuickCard title="Le dress code" text={state.guestPortal?.travel?.dressCode || "Tenue élégante"} universeId="aphrodite" to="/univers/aphrodite" />
          </div>
        </section>

        <section className="mt-14 max-w-[960px]">
          <SectionTitle title="Aide & FAQ" />
          <div className="mt-6 space-y-4">
            {(state.guestPortal?.faq || []).slice(0, 3).map((item) => (
              <div key={item.id} className="border-b border-black/8 pb-4 last:border-b-0">
                <div className="font-semibold text-zinc-950">{item.question}</div>
                <div className="mt-2 text-sm text-zinc-600 leading-relaxed">{item.answer}</div>
              </div>
            ))}
            <button className="pt-2 text-left inline-flex items-center gap-2 text-[15px] text-zinc-900">
              Envoyer un message à l'organisateur
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      </AccountShell>
    );
  }

  if (modeId === "prestataires") {
    const vendor = flowerVendor;
    const vendorMessages = [
      {
        author: "Camille (Planner)",
        at: "Hier, 17:42",
        text: "Éloïse, les pivoines blanches pour l'autel sont confirmées. Peux-tu m'envoyer la liste des accessoires requis ?",
      },
      {
        author: "Vous",
        at: "Hier, 18:05",
        text: "Entendu Camille, je t'envoie la liste des vases Médicis et socles de cérémonie demain matin au plus tard.",
      },
    ];

    const certifiedDocs = [
      { title: "Brief client", text: "Moodboard et palette couleurs de la cérémonie de mariage", universeId: "aphrodite", to: "/univers/aphrodite" },
      { title: "Contrat", text: "Devis signé, cahier des charges techniques · PDF officiel", universeId: "hephaistos", to: "/documents?role=vendors" },
      { title: "Planning", text: "Mes jalons créatifs, étapes clés et deadlines opérationnelles", universeId: "athena", to: "/notifications?role=vendors" },
      { title: "Logistique", text: "Accès au lieu de réception, montage des arches, horaires", universeId: "ares", to: "/jour-j?role=vendors" },
    ];

    return (
      <AccountShell
        topLabel="espace-prestataires"
        navItems={["Mon portail", "Ma mission", "Logistique", "Admin"]}
        activeIndex={0}
        avatarImage={vendorImage}
        avatarLabel={vendor?.name || "Prestataire"}
        rightLabel="Espace Fleuriste"
        footerTone="dark"
      >
        <TitleBlock eyebrow="Prestataire · mon portail professionnel" title="Mon espace" />

        <section className="mt-12 grid gap-4 xl:grid-cols-[1.05fr_0.95fr] items-start">
          <div className="rounded-[28px] border border-black/8 bg-white p-6 shadow-[0_10px_28px_rgba(12,12,12,0.03)]">
            <div className="grid gap-6 lg:grid-cols-[220px_1fr] items-start">
              <div className="flex flex-col items-center gap-4">
                <div className="rounded-[26px] overflow-hidden border border-black/8 bg-[var(--color-warm-gray-100)] p-2">
                  <img src={vendorImage} alt={vendor?.name} className="w-[160px] h-[160px] rounded-[18px] object-cover" />
                </div>
                <div className="rounded-full bg-[#e9f3ed] px-4 py-2 text-sm text-[#4f7d61]">Validé ✓</div>
              </div>
              <div>
                <div className="font-display text-[2rem] text-zinc-950">Détails de l'Atelier</div>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between gap-4 border-b border-black/8 pb-3"><span className="text-zinc-500 text-sm">Entreprise</span><span className="text-zinc-900">Atelier Floral Éloïse</span></div>
                  <div className="flex items-center justify-between gap-4 border-b border-black/8 pb-3"><span className="text-zinc-500 text-sm">Responsable</span><span className="text-zinc-900">Éloïse Martin</span></div>
                  <div className="flex items-center justify-between gap-4 border-b border-black/8 pb-3"><span className="text-zinc-500 text-sm">Métier</span><span className="text-zinc-900">Fleuriste — Décoration florale</span></div>
                  <div className="flex items-center justify-between gap-4 border-b border-black/8 pb-3"><span className="text-zinc-500 text-sm">Email</span><span className="text-zinc-900">contact@atelierfloral.fr</span></div>
                  <div className="flex items-center justify-between gap-4 border-b border-black/8 pb-3"><span className="text-zinc-500 text-sm">Téléphone</span><span className="text-zinc-900">+33 6 98 76 54 32</span></div>
                  <div className="flex items-center justify-between gap-4 border-b border-black/8 pb-3"><span className="text-zinc-500 text-sm">SIRET</span><span className="text-zinc-900">812 345 678 00012</span></div>
                </div>
                <button className="mt-6 rounded-full border border-black/12 bg-white px-5 py-3 text-sm text-zinc-800 hover:bg-black/[0.03] inline-flex items-center gap-2">
                  Modifier mon profil
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-black/8 bg-white p-6 shadow-[0_10px_28px_rgba(12,12,12,0.03)]">
            <div className="font-display text-[2rem] text-zinc-950">Paramètres & Outils</div>
            <div className="mt-6">
              <ToggleRow label="Notifications missions" detail="Recevoir les briefs par email" checked={vendorMailNotif} onToggle={() => setVendorMailNotif((v) => !v)} />
              <ToggleRow label="Disponibilité calendrier" detail="Synchronisation avec le hub planner" checked={vendorCalendarSync} onToggle={() => setVendorCalendarSync((v) => !v)} />
              <LineAction label="Facturation & RIB" value="Gérer" />
              <LineAction label="Historique missions" value="Consulter les archives" />
            </div>
          </div>
        </section>

        <section className="mt-14 grid gap-4 xl:grid-cols-[1.05fr_0.95fr] items-start">
          <div className="rounded-[28px] border border-black/8 bg-white p-6 shadow-[0_10px_28px_rgba(12,12,12,0.03)]">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Projet actuel</div>
                <div className="mt-2 font-display text-[2.25rem] text-zinc-950">Ma mission en cours</div>
              </div>
              <div className="rounded-full bg-[var(--color-warm-white)] px-4 py-2 text-sm text-zinc-700">Budget: {formatMoney(vendor?.priceFrom || 2100)}</div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 text-sm">
              <div>
                <div className="text-[11px] uppercase tracking-[0.14em] text-zinc-500">Mariage</div>
                <div className="mt-2 text-[1.2rem] font-semibold text-zinc-950">{state.meta?.couple} — {formatDate(state.meta?.date)}</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.14em] text-zinc-500">Nature de la prestation</div>
                <div className="mt-2 text-[1.2rem] font-semibold text-zinc-950">Décoration florale cérémonie + réception</div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-3 text-sm text-zinc-600">
              <span>Proposition validée · En attente livraison finale</span>
              <span className="font-semibold text-zinc-900">60%</span>
            </div>
            <div className="mt-3"><ProgressBar value={60} /></div>

            <div className="mt-5 rounded-[18px] border border-black/8 bg-[var(--color-warm-white)] px-4 py-4 inline-flex items-center gap-3 text-sm text-zinc-800 w-full">
              <ShieldCheck className="h-4 w-4 text-[#b9a47b]" />
              Prochaine deadline : <strong>{formatShortDate(vendor?.nextTouchpointAt)}</strong> — Maquette table finale
            </div>

            <Link to="/prestataires" className="mt-6 rounded-full bg-black px-5 py-3 text-sm text-white hover:bg-zinc-800 inline-flex items-center gap-2">
              Voir le brief complet
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-[28px] border border-black/8 bg-white p-6 shadow-[0_10px_28px_rgba(12,12,12,0.03)]">
            <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Discussions</div>
            <div className="mt-2 font-display text-[2.25rem] text-zinc-950">Fil de discussion</div>
            <div className="mt-6 space-y-4">
              {vendorMessages.map((message, index) => (
                <DiscussionBubble key={`${message.author}-${index}`} {...message} own={index === 1} />
              ))}
            </div>
            <Link to="/communication?role=vendors" className="mt-6 rounded-full border border-black/12 bg-white px-5 py-3 text-sm text-zinc-800 hover:bg-black/[0.03] inline-flex items-center gap-2">
              Ouvrir la messagerie
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="mt-14">
          <SectionTitle title="Mes documents certifiés" />
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {certifiedDocs.map((doc) => (
              <div key={doc.title} className="rounded-[22px] border border-black/8 bg-white p-5 shadow-[0_10px_28px_rgba(12,12,12,0.03)]">
                <div className="flex items-start justify-between gap-3">
                  <div className="text-[1rem] font-semibold text-zinc-950">{doc.title}</div>
                  <UniverseBadge universeId={doc.universeId} label={doc.universeId} />
                </div>
                <div className="mt-4 text-sm text-zinc-600 leading-relaxed">{doc.text}</div>
                <Link to={doc.to} className="mt-6 inline-flex items-center gap-2 text-sm text-[#9c8f72] hover:text-zinc-900">
                  <Download className="h-4 w-4" />
                  Télécharger le document
                </Link>
              </div>
            ))}
          </div>
        </section>
      </AccountShell>
    );
  }

  const weeklyMonitor = [
    { label: "Tâches urgentes cette semaine", value: `${notifications.filter((item) => item.level !== "info").length} tâches` },
    { label: "Messages non lus à traiter", value: `${communications.length + 11} reçus` },
    { label: "Prestataires à relancer pour validation", value: `${commitments.quotesPending + commitments.contractsPending} prestas` },
  ];

  const agencyTools = [
    { title: "Master Planning", text: "Vue consolidée de tous les plannings opérationnels d'artistes", universeId: "athena", to: "/point-zero?role=planner" },
    { title: "Guest Overview", text: "Suivi cumulé des RSVP et des régimes alimentaires invités", universeId: "hestia", to: "/invites?role=planner" },
    { title: "Budget Global", text: "Suivi financier multi-mariages, dépôts d'honoraires et marges", universeId: "zeus", to: "/budget" },
  ];

  return (
    <AccountShell
      topLabel="espace-planner"
      navItems={["Cockpit", "Dir. Artistique", "Opérations", "Gestion"]}
      activeIndex={0}
      avatarImage={plannerImage}
      avatarLabel="Camille Beaumont"
      rightLabel="Espace Organisateur"
      footerTone="dark"
    >
      <TitleBlock eyebrow="Wedding planner · cockpit de gestion" title="Mon espace" />

      <section className="mt-12 grid gap-4 xl:grid-cols-[1.05fr_0.95fr] items-start">
        <div className="rounded-[28px] border border-black/8 bg-white p-6 shadow-[0_10px_28px_rgba(12,12,12,0.03)]">
          <div className="grid gap-6 lg:grid-cols-[220px_1fr] items-start">
            <div className="flex flex-col items-center gap-4">
              <Avatar image={plannerImage} label="Camille Beaumont" size="lg" />
              <div className="rounded-full border border-[#b9a47b]/40 bg-[var(--color-warm-white)] px-4 py-2 text-sm text-[#9f8f6a]">Planner Premium</div>
            </div>
            <div>
              <div className="font-display text-[2rem] text-zinc-950">Directrice d'Événement</div>
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between gap-4 border-b border-black/8 pb-3"><span className="text-zinc-500 text-sm">Nom</span><span className="text-zinc-900">Camille Beaumont</span></div>
                <div className="flex items-center justify-between gap-4 border-b border-black/8 pb-3"><span className="text-zinc-500 text-sm">Agence</span><span className="text-zinc-900">Beaumont Wedding Agency</span></div>
                <div className="flex items-center justify-between gap-4 border-b border-black/8 pb-3"><span className="text-zinc-500 text-sm">Email</span><span className="text-zinc-900">camille@beaumontwedding.fr</span></div>
                <div className="flex items-center justify-between gap-4 border-b border-black/8 pb-3"><span className="text-zinc-500 text-sm">Téléphone</span><span className="text-zinc-900">+33 6 11 22 33 44</span></div>
                <div className="flex items-center justify-between gap-4 border-b border-black/8 pb-3"><span className="text-zinc-500 text-sm">Mariages en cours</span><span className="text-zinc-900">4 mariages</span></div>
                <div className="flex items-center justify-between gap-4 border-b border-black/8 pb-3"><span className="text-zinc-500 text-sm">Mariages réalisés</span><span className="text-zinc-900">47 mariages d'exception</span></div>
              </div>
              <button className="mt-6 rounded-full border border-black/12 bg-white px-5 py-3 text-sm text-zinc-800 hover:bg-black/[0.03] inline-flex items-center gap-2">
                Modifier mon profil
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] bg-black text-white p-6 shadow-[0_10px_28px_rgba(12,12,12,0.08)] min-h-[420px]">
          <div className="font-display text-[2rem] text-white">Moniteur hebdomadaire</div>
          <div className="mt-6 space-y-6">
            {weeklyMonitor.map((item) => (
              <div key={item.label} className="border-b border-white/12 pb-5 last:border-b-0 last:pb-0">
                <div className="text-white/66">{item.label}</div>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <div className="font-display text-[2rem] text-white">{item.value}</div>
                  <ChevronRight className="h-5 w-5 text-white/52" />
                </div>
              </div>
            ))}
          </div>
          <Link to="/budget" className="mt-10 inline-flex items-center gap-2 text-white/72 hover:text-white">
            Tableau de bord financier
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="mt-14">
        <SectionTitle title="Mes mariages en cours de conception" />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {plannerPortfolio.map((item) => (
            <div key={item.id} className="rounded-[24px] border border-black/8 bg-white p-5 shadow-[0_10px_28px_rgba(12,12,12,0.03)]">
              <div className="grid grid-cols-[140px_1fr] gap-5 items-start">
                <img src={item.image} alt={item.title} className="w-[140px] h-[140px] rounded-[18px] object-cover" />
                <div>
                  <div className="text-[1.1rem] font-semibold text-zinc-950">{item.title}</div>
                  <div className="mt-1 text-sm text-zinc-500">{item.subtitle}</div>
                  <div className="mt-5 flex items-center justify-between gap-3 text-sm text-zinc-600">
                    <span>Avancement global</span>
                    <span className="font-semibold text-zinc-900">{item.progress}%</span>
                  </div>
                  <div className="mt-3"><ProgressBar value={item.progress} /></div>
                  <div className="mt-4 text-[11px] uppercase tracking-[0.14em] text-zinc-500">{item.countdown}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14 grid gap-4 xl:grid-cols-[1.02fr_0.98fr]">
        <div className="rounded-[28px] border border-black/8 bg-white p-6 shadow-[0_10px_28px_rgba(12,12,12,0.03)]">
          <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Écosystème</div>
          <div className="mt-2 font-display text-[2.2rem] text-zinc-950">Outils de gestion d'agence</div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {agencyTools.map((tool) => (
              <QuickCard key={tool.title} title={tool.title} text={tool.text} universeId={tool.universeId} to={tool.to} />
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-black/8 bg-white p-6 shadow-[0_10px_28px_rgba(12,12,12,0.03)]">
          <div className="font-display text-[2.2rem] text-zinc-950">Paramètres & Modèles</div>
          <div className="mt-6">
            <LineAction label="Notifications d'agence" value="Actif" />
            <LineAction label="Accès collaborateurs" value="Administrer" />
            <LineAction label="Modèles de brief" value="Éditer" />
            <LineAction label="Facturation agence" value="Consulter les factures clients" />
          </div>
        </div>
      </section>
    </AccountShell>
  );
}
