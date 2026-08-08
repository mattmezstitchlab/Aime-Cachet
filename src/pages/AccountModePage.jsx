import React, { useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import {
  Building2,
  Check,
  Heart,
  KeyRound,
  Mail,
  MapPin,
  MoveRight,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import WeddingModuleHeader from "@/components/aime/WeddingModuleHeader";
import {
  filterDocumentsByRole,
  getGuestSummary,
  getNotificationsForRole,
  getVendorCommitmentSummary,
  getVendorMarketplace,
  readWeddingState,
  VENDOR_TAXONOMY,
} from "@/lib/aimeWeddingCore";

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

function Input({ label, icon: Icon, placeholder, value, onChange }) {
  return (
    <label className="block">
      <span className="aime-label text-zinc-500">{label}</span>
      <div className="mt-2 flex items-center gap-3 rounded-[18px] border border-black/8 bg-white px-4 py-3">
        {Icon && <Icon className="h-4 w-4 text-zinc-400" />}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
        />
      </div>
    </label>
  );
}

function InfoCard({ title, text }) {
  return (
    <div className="rounded-[24px] border border-black/8 bg-[var(--color-warm-white)] p-4">
      <div className="text-sm font-semibold text-zinc-950">{title}</div>
      <div className="mt-2 text-sm leading-relaxed text-zinc-600">{text}</div>
    </div>
  );
}

function StepCard({ step, index }) {
  return (
    <div className="rounded-[24px] border border-black/8 bg-white p-4">
      <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Étape {index + 1}</div>
      <div className="mt-2 text-sm font-semibold text-zinc-950">{step.title}</div>
      <div className="mt-2 text-sm leading-relaxed text-zinc-600">{step.text}</div>
    </div>
  );
}

function ActionTile({ to, title, text }) {
  return (
    <Link to={to} className="group rounded-[24px] border border-black/8 bg-[var(--color-warm-white)] p-4 transition-colors hover:bg-black/[0.03]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-zinc-950">{title}</div>
          <div className="mt-2 text-sm leading-relaxed text-zinc-600">{text}</div>
        </div>
        <MoveRight className="mt-1 h-4 w-4 shrink-0 text-zinc-400 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

export default function AccountModePage() {
  const { modeId } = useParams();
  const navigate = useNavigate();
  const state = useMemo(() => readWeddingState(), []);
  const [fields, setFields] = useState({
    name: "",
    email: "",
    code: "",
    company: "",
    city: "",
  });

  const guestSummary = useMemo(() => getGuestSummary(state), [state]);
  const plannerSignals = useMemo(() => getNotificationsForRole(state, "planner"), [state]);
  const plannerDocs = useMemo(() => filterDocumentsByRole(state.documents, "planner"), [state]);
  const vendors = useMemo(() => getVendorMarketplace(state, "all"), [state]);
  const vendorCommitments = useMemo(() => getVendorCommitmentSummary(state), [state]);

  const pageByMode = {
    maries: {
      universeId: "zeus",
      eyebrow: "Compte Mariés",
      title: "Créer ou reprendre votre mariage.",
      description: "Votre point d’entrée couple : création, reprise, configuration et accès à la homepage Mariés sans confusion de navigation.",
      stats: [
        { label: "Couple", value: state.meta?.couple || "—", detail: state.meta?.date || "Date" },
        { label: "Lieu", value: state.meta?.venue || "—", detail: state.meta?.city || "Ville" },
        { label: "Invités", value: guestSummary.total, detail: `${guestSummary.confirmed} confirmés` },
      ],
      actions: [
        { to: "/setup", label: "Créer mon mariage" },
        { to: "/couple", label: "Entrer côté mariés" },
        { to: "/point-zero", label: "Voir le cockpit" },
      ],
      onboardingTitle: "Ouvrir votre espace mariés",
      fields: [
        { key: "name", label: "Vos prénoms", icon: Heart, placeholder: "Iris & Noam" },
        { key: "email", label: "Email principal", icon: Mail, placeholder: "bonjour@aime-wedding.com" },
      ],
      steps: [
        { title: "Créer le cadre", text: "Date, lieu, budget, configuration initiale et documents de départ." },
        { title: "Ouvrir les maisons", text: "Invités, budget, alertes, communication et terrain se connectent ensuite proprement." },
        { title: "Entrer dans la homepage", text: "Une lecture calme côté mariés, sans bruit opérationnel inutile." },
      ],
      cards: [
        { title: "Homepage Mariés", text: "Votre lecture couple, synthétique et premium, pour voir seulement l’essentiel.", to: "/couple" },
        { title: "Setup", text: "Le point d’entrée création pour cadrer proprement le mariage.", to: "/setup" },
      ],
      submitLabel: "Créer mon compte mariés",
      spaceRoute: "/espace-maries",
    },
    invites: {
      universeId: "hestia",
      eyebrow: "Compte Invités",
      title: "Rejoindre un mariage en quelques secondes.",
      description: "Un point d’entrée clair pour entrer avec un code, retrouver son foyer, répondre et accéder aux infos utiles sans fouiller partout.",
      stats: [
        { label: "Programme", value: (state.guestPortal?.schedule || []).length, detail: "temps forts" },
        { label: "Hébergements", value: (state.guestPortal?.accommodations || []).length, detail: "options" },
        { label: "Navettes", value: (state.guestPortal?.shuttles || []).length, detail: "trajets" },
      ],
      actions: [
        { to: "/espace-invites", label: "Rejoindre un mariage" },
        { to: "/univers/hestia", label: "Voir Hestia" },
      ],
      onboardingTitle: "Accéder à votre mariage",
      fields: [
        { key: "name", label: "Nom / foyer", icon: Users, placeholder: "Foyer Martin" },
        { key: "email", label: "Email d’invitation", icon: Mail, placeholder: "invitation@email.com" },
        { key: "code", label: "Code d’accès", icon: KeyRound, placeholder: "AIME-2027" },
      ],
      steps: [
        { title: "Identifier le foyer", text: "Entrer votre nom ou votre email d’invitation pour retrouver la bonne maison." },
        { title: "Ouvrir l’invitation", text: "Répondre, consulter le programme, les accès, les hébergements et la FAQ." },
        { title: "Revenir facilement", text: "Le portail invités reste votre point d’entrée simple jusqu’au Jour J." },
      ],
      cards: [
        { title: "Portail invités", text: "Le mini-site clair pour répondre, venir, se loger et comprendre le déroulé.", to: "/espace-invites" },
        { title: "Maison Hestia", text: "La logique source des foyers, RSVP, accueil et transmission du mariage.", to: "/univers/hestia" },
      ],
      submitLabel: "Accéder à mon mariage",
      spaceRoute: "/espace-invites/compte",
    },
    prestataires: {
      universeId: "artemis",
      eyebrow: "Compte Prestataires",
      title: "Rejoindre le registre prestataires.",
      description: "Le bon point d’entrée pour candidater, être visible dans le registre, puis accéder à votre portail mission sans mélange avec la homepage prestataires.",
      stats: [
        { label: "Prestataires", value: vendors.length, detail: "déjà visibles" },
        { label: "Catégories", value: VENDOR_TAXONOMY.length - 1, detail: "actives" },
        { label: "Engagements", value: vendorCommitments.quotesPending + vendorCommitments.contractsPending, detail: "ouverts" },
      ],
      actions: [
        { to: "/compte/prestataires", label: "Rejoindre le registre" },
        { to: "/prestataires/registre", label: "Voir le registre" },
        { to: "/prestataires", label: "Portail prestataires" },
      ],
      onboardingTitle: "Candidater au registre",
      fields: [
        { key: "company", label: "Nom / maison", icon: Building2, placeholder: "Maison Atelier" },
        { key: "email", label: "Email pro", icon: Mail, placeholder: "contact@maisonatelier.fr" },
        { key: "city", label: "Ville", icon: MapPin, placeholder: "Lille" },
      ],
      steps: [
        { title: "Créer votre fiche", text: "Métier, ville, niveau de service, image et informations utiles à la sélection." },
        { title: "Entrer dans le registre", text: "Être visible dans le catalogue premium filtrable par catégorie." },
        { title: "Recevoir votre mission", text: "Une fois rattaché à un mariage, votre portail prestataire prend le relais." },
      ],
      cards: [
        { title: "Registre complet", text: "Le catalogue visuel, filtrable et premium des prestataires du mariage.", to: "/prestataires/registre" },
        { title: "Homepage Prestataires", text: "Le portail mission une fois la collaboration active sur un mariage.", to: "/prestataires" },
      ],
      submitLabel: "Envoyer ma candidature",
      spaceRoute: "/espace-prestataires",
    },
    planner: {
      universeId: "athena",
      eyebrow: "Compte Planner",
      title: "Accéder au cockpit planner sans retomber côté mariés.",
      description: "Un vrai point d’entrée planner manquait. Cette page corrige ça : accès dédié, logique de mission et orientation claire vers le cockpit et les modules planner.",
      stats: [
        { label: "Signaux", value: plannerSignals.length, detail: "vue planner" },
        { label: "Docs", value: plannerDocs.filter((doc) => !["prêt", "partagé", "complet"].includes(doc.status)).length, detail: "encore mouvants" },
        { label: "Mariage", value: state.meta?.couple || "—", detail: state.meta?.venue || "Lieu" },
      ],
      actions: [
        { to: "/point-zero?role=planner", label: "Accès planner" },
        { to: "/notifications?role=planner", label: "Voir les alertes" },
        { to: "/documents?role=planner", label: "Voir les docs" },
      ],
      onboardingTitle: "Entrer côté planner",
      fields: [
        { key: "company", label: "Agence / studio", icon: Building2, placeholder: "AIME Wedding" },
        { key: "email", label: "Email planner", icon: Mail, placeholder: "planner@aime-wedding.com" },
        { key: "code", label: "Code mariage / dossier", icon: KeyRound, placeholder: "PZ-IRIS-NOAM" },
      ],
      steps: [
        { title: "Entrer dans le cockpit", text: "Ouvrir la vue planner, les priorités, les maisons et les arbitrages du mariage." },
        { title: "Basculer vers les modules", text: "Notifications, documents, communication, terrain et budget restent ensuite accessibles côté planner." },
        { title: "Garder la lecture claire", text: "Le planner voit plus que les autres rôles, mais toujours dans une hiérarchie simple." },
      ],
      cards: [
        { title: "Cockpit planner", text: "La homepage planner, pensée comme la tour de contrôle du mariage.", to: "/point-zero?role=planner" },
        { title: "Maison Athéna", text: "L’univers de l’anticipation, des alertes et de la vigilance utile.", to: "/univers/athena" },
      ],
      submitLabel: "Accéder au cockpit planner",
      spaceRoute: "/espace-planner",
    },
  };

  const page = pageByMode[modeId];

  if (!page) {
    return <Navigate to="/" replace />;
  }

  const updateField = (key, value) => {
    setFields((current) => ({ ...current, [key]: value }));
  };

  const submit = () => {
    toast.success(page.submitLabel, {
      description: "Prototype local : ouverture directe de l’espace compte correspondant.",
    });
    navigate(page.spaceRoute);
  };

  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] text-[var(--color-text-primary)] overflow-x-hidden">
      <div className="mx-auto max-w-[1320px] px-5 pb-12 pt-4 md:px-8 md:pb-16 lg:px-10">
        <div className="mb-8 md:mb-10">
          <WeddingModuleHeader
            universeId={page.universeId}
            eyebrow={page.eyebrow}
            title={page.title}
            description={page.description}
            stats={page.stats}
            actions={page.actions}
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-[0.98fr_1.02fr]">
          <Surface className="p-5 md:p-6">
            <SectionHeading eyebrow="Onboarding" title={page.onboardingTitle} />
            <div className="mt-5 space-y-4">
              {page.fields.map((field) => (
                <Input
                  key={field.key}
                  label={field.label}
                  icon={field.icon}
                  placeholder={field.placeholder}
                  value={fields[field.key]}
                  onChange={(value) => updateField(field.key, value)}
                />
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <button onClick={submit} className="rounded-full bg-black px-5 py-3 text-sm text-white hover:bg-zinc-800 inline-flex items-center gap-2">
                <Check className="h-4 w-4" />
                {page.submitLabel}
              </button>
              <span className="rounded-full border border-black/8 bg-white px-4 py-3 text-sm text-zinc-600">
                Prototype local · auth à brancher ensuite
              </span>
            </div>
          </Surface>

          <Surface className="p-5 md:p-6">
            <SectionHeading eyebrow="Parcours" title="Comment ça fonctionne" />
            <div className="mt-5 grid gap-3">
              {page.steps.map((step, index) => (
                <StepCard key={step.title} step={step} index={index} />
              ))}
            </div>
          </Surface>
        </div>

        <div className="mt-10 grid gap-4 xl:grid-cols-[1.02fr_0.98fr]">
          <Surface className="p-5 md:p-6">
            <SectionHeading eyebrow="Entrées utiles" title="Où aller ensuite" />
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {page.cards.map((card) => (
                <ActionTile key={card.to} {...card} />
              ))}
            </div>
          </Surface>

          <Surface className="p-5 md:p-6">
            <SectionHeading eyebrow="Rappel" title="Pourquoi cette page existe" />
            <div className="mt-5 space-y-3">
              <InfoCard title="Un vrai point d’entrée" text="Chaque mode a maintenant sa page compte / accès dédiée, au lieu de tomber directement dans un module interne ou dans un mauvais flux." />
              <InfoCard title="Pas de confusion" text="Créer un mariage, rejoindre un mariage, rejoindre le registre ou accéder au cockpit planner sont désormais quatre gestes séparés et lisibles." />
              <InfoCard title="Architecture visible" text="Ces pages complètent la landing, les homepages de mode et les univers. Elles manquaient réellement dans le produit." />
            </div>
          </Surface>
        </div>
      </div>
    </div>
  );
}
