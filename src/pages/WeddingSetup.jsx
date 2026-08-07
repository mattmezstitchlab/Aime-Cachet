import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import {
  CEREMONY_FORMAT_OPTIONS,
  configureWeddingInState,
  COORDINATION_MODE_OPTIONS,
  getRecommendedSetupDocumentIds,
  isWeddingSetupComplete,
  readWeddingState,
  SETUP_DOCUMENT_OPTIONS,
  STARTER_DOCUMENT_OPTIONS,
  writeWeddingState,
} from "@/lib/aimeWeddingCore";

const CONTACT_FIELDS = [
  { id: "couple", label: "Couple", hint: "Les mariés, pour les validations sensibles." },
  { id: "planning", label: "Planning", hint: "La personne qui arbitre et tient le tempo." },
  { id: "famille", label: "Famille / témoins", hint: "Le relais terrain pour discours, loges et déplacements." },
  { id: "lieu", label: "Lieu", hint: "Le responsable accès, flux, parking et espaces." },
  { id: "photo", label: "Photo / vidéo", hint: "La personne qui tient la captation et les timings image." },
  { id: "traiteur", label: "Traiteur", hint: "Le point de contact service, cuisine et rythme du dîner." },
  { id: "dj", label: "DJ / Son", hint: "Le contact son, micros et ouverture de bal." },
];

const SETUP_STEPS = [
  { id: "cadre", number: "01", title: "Le cadre" },
  { id: "invites", number: "02", title: "Les invités" },
  { id: "coordination", number: "03", title: "La coordination" },
  { id: "contacts", number: "04", title: "Les contacts" },
  { id: "documents", number: "05", title: "Les documents" },
];

function createFormState(state) {
  return {
    couple: state.meta?.couple || "",
    date: state.meta?.date || "",
    venue: state.meta?.venue || "",
    city: state.meta?.city || "",
    guests: String(state.meta?.guests ?? ""),
    budgetEnvelope: String(state.budget?.envelope ?? state.meta?.budget ?? ""),
    contacts: Object.fromEntries(
      CONTACT_FIELDS.map((field) => [
        field.id,
        {
          name: state.contacts?.[field.id]?.name || "",
          phone: state.contacts?.[field.id]?.phone || "",
        },
      ]),
    ),
    guestsProfile: {
      children: String(state.guestsProfile?.children ?? 0),
      pmr: String(state.guestsProfile?.pmr ?? 0),
      specialMeals: String(state.guestsProfile?.specialMeals ?? 0),
      speeches: String(state.guestsProfile?.speeches ?? 0),
    },
    orchestration: {
      coordinationMode: state.orchestration?.coordinationMode || "full-planner",
      ceremonyFormat: state.orchestration?.ceremonyFormat || "laique",
      planBWeatherReady: state.orchestration?.planBWeatherReady ?? true,
      shuttleNeeded: state.orchestration?.shuttleNeeded ?? false,
      accommodationNeeded: state.orchestration?.accommodationNeeded ?? false,
    },
    starterDocs: state.setup?.starterDocs?.length
      ? state.setup.starterDocs
      : state.documents?.map((doc) => doc.id) || STARTER_DOCUMENT_OPTIONS.map((item) => item.id),
  };
}

function getCountdownDays(dateValue) {
  if (!dateValue) return 0;
  const target = new Date(`${dateValue}T12:00:00`);
  if (Number.isNaN(target.getTime())) return 0;
  return Math.max(0, Math.ceil((target.getTime() - Date.now()) / 86400000));
}

function labelForPath(pathname = "/couple") {
  if (pathname.startsWith("/couple")) return "l’espace couple";
  if (pathname.startsWith("/prestataires")) return "le portail prestataires";
  if (pathname.startsWith("/documents")) return "les documents";
  if (pathname.startsWith("/jour-j")) return "la timeline Jour J";
  if (pathname.startsWith("/notifications")) return "les notifications";
  if (pathname.startsWith("/budget")) return "le budget";
  if (pathname.startsWith("/communication")) return "la communication";
  if (pathname.startsWith("/exports")) return "les exports";
  if (pathname.startsWith("/invites")) return "l’espace invités";
  return "l’espace couple";
}

function buildSetupPayload(form) {
  return {
    ...form,
    guests: Number(form.guests || 0),
    budgetEnvelope: Number(form.budgetEnvelope || 0),
    contacts: form.contacts,
    guestsProfile: {
      children: Number(form.guestsProfile.children || 0),
      pmr: Number(form.guestsProfile.pmr || 0),
      specialMeals: Number(form.guestsProfile.specialMeals || 0),
      speeches: Number(form.guestsProfile.speeches || 0),
    },
    orchestration: form.orchestration,
  };
}

function SetupHero() {
  return (
    <section id="hero" className="relative min-h-[100svh] scroll-mt-28 overflow-hidden bg-[var(--color-black)] text-white">
      <img src="/landing/hestia.jpg" alt="Créer votre mariage" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.66))]" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_24%)]" aria-hidden="true" />

      <div className="relative z-10 min-h-[100svh] flex items-end px-5 md:px-8 lg:px-10 pb-28 md:pb-32 pt-24 md:pt-28">
        <div className="w-full max-w-[1480px] mx-auto">
          <div className="max-w-4xl">
            <div className="aime-kicker mb-5">Pour les mariés</div>
            <h1 className="font-display text-[2.8rem] sm:text-[4.6rem] lg:text-[6.5rem] leading-[0.9] tracking-[var(--tracking-display)] text-white">
              Créez votre mariage,
              <span className="block text-white/88">simplement.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] md:text-[18px] text-white/66 leading-[var(--leading-body)]">
              Commencez par le couple, la date, le lieu, les invités et le budget. AIME ouvre ensuite votre espace couple, les invités, les partenaires et le cockpit planner.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#setup-form" className="rounded-full bg-white px-6 py-3.5 text-sm font-medium text-black shadow-[0_12px_28px_rgba(0,0,0,0.18)] inline-flex items-center gap-2">
                Commencer
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SetupStepDock({ activeStep, onStepSelect, saveState, countdownDays, activeContacts, configured, selectedDocs }) {
  const saveTone = saveState === "saving"
    ? "bg-[#F5A524]"
    : saveState === "saved"
    ? "bg-[#34C759]"
    : configured
    ? "bg-[#34C759]"
    : "bg-white/35";

  return (
    <div className="fixed bottom-4 left-1/2 z-[70] w-[min(1480px,calc(100%-20px))] -translate-x-1/2 print:hidden">
      <div className="rounded-[28px] border border-white/10 bg-black/86 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.28)] px-3 md:px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 overflow-x-auto no-scrollbar">
            <div className="flex min-w-max gap-2 md:gap-3">
              {SETUP_STEPS.map((step) => (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => {
                    onStepSelect(step.id);
                    document.getElementById("setup-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className={`min-w-[118px] rounded-[18px] px-3 py-3 text-left transition-colors ${activeStep === step.id ? "bg-white text-black" : "bg-white/[0.05] text-white hover:bg-white/[0.08]"}`}
                >
                  <div className="text-[11px] uppercase tracking-[0.16em] opacity-65">{step.number}</div>
                  <div className="mt-2 text-sm font-medium">{step.title}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="hidden xl:grid grid-cols-3 gap-5 text-sm text-white/82 shrink-0">
            <div>
              <div className="text-[11px] uppercase tracking-[0.16em] text-white/42">Compte à rebours</div>
              <div className="mt-2 inline-flex items-center gap-2"><Calendar className="w-4 h-4" /> {countdownDays} jours</div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.16em] text-white/42">Contacts</div>
              <div className="mt-2">{activeContacts}</div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.16em] text-white/42">État</div>
              <div className="mt-2 inline-flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${configured ? "bg-[#34C759]" : "bg-[#F5A524]"}`} />
                {configured ? `${selectedDocs} docs actifs` : "en cours"}
              </div>
            </div>
          </div>

          <button
            type="button"
            aria-label="Sauvegarde automatique"
            title={saveState === "saving" ? "Sauvegarde en cours" : "Sauvegarde automatique active"}
            className="relative w-12 h-12 rounded-full bg-white text-black inline-flex items-center justify-center shadow-[0_12px_28px_rgba(0,0,0,0.18)] shrink-0"
          >
            <Save className="w-4 h-4" />
            <span className={`absolute right-2 top-2 w-2 h-2 rounded-full ${saveTone}`} />
          </button>
        </div>
      </div>
    </div>
  );
}

function SectionCard({ title, eyebrow, intro, children, action = null }) {
  return (
    <section className="aime-card-light rounded-[32px] overflow-hidden">
      <div className="px-5 md:px-6 py-5 border-b border-black/8 flex items-start justify-between gap-4">
        <div className="max-w-2xl">
          {eyebrow && <div className="aime-label text-zinc-500 mb-3">{eyebrow}</div>}
          <h2 className="text-zinc-950 text-xl md:text-2xl font-semibold">{title}</h2>
          {intro && <p className="text-sm md:text-base text-zinc-600 mt-3 leading-relaxed">{intro}</p>}
        </div>
        {action}
      </div>
      <div className="p-5 md:p-6">{children}</div>
    </section>
  );
}

function Field({ label, hint, children }) {
  return (
    <label className="block space-y-2.5">
      <div>
        <div className="text-sm font-semibold text-zinc-950">{label}</div>
        {hint && <div className="text-sm text-zinc-500 mt-1">{hint}</div>}
      </div>
      {children}
    </label>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className="w-full rounded-[18px] bg-[#fbfaf8] px-4 py-3.5 text-sm text-zinc-900 outline-none transition-colors border-0 ring-1 ring-black/8 focus:ring-2 focus:ring-black"
    />
  );
}

function ChoiceCard({ active, label, description, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[24px] p-4 text-left transition-colors ring-1 ${active ? "bg-black text-white ring-black" : "bg-[#fbfaf8] text-zinc-900 ring-black/8 hover:bg-black/[0.03]"}`}
    >
      <div className="text-sm font-semibold">{label}</div>
      <p className={`text-sm mt-3 leading-relaxed ${active ? "text-white/72" : "text-zinc-600"}`}>{description}</p>
    </button>
  );
}

function ToggleCard({ active, label, description, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[24px] p-4 text-left transition-colors ring-1 ${active ? "bg-black text-white ring-black" : "bg-[#fbfaf8] text-zinc-900 ring-black/8 hover:bg-black/[0.03]"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">{label}</div>
          <p className={`text-sm mt-3 leading-relaxed ${active ? "text-white/72" : "text-zinc-600"}`}>{description}</p>
        </div>
        <span className="mt-1 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em]">
          <span className={`w-2 h-2 rounded-full ${active ? "bg-white" : "bg-zinc-400"}`} />
          {active ? "actif" : "off"}
        </span>
      </div>
    </button>
  );
}

function ContactRow({ label, hint, value, onChange }) {
  return (
    <div className="rounded-[24px] bg-[#fbfaf8] p-4 md:p-5 ring-1 ring-black/8">
      <div className="mb-4">
        <div className="text-sm font-semibold text-zinc-950">{label}</div>
        <div className="text-sm text-zinc-500 mt-1">{hint}</div>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <Input
          type="text"
          value={value.name}
          onChange={(event) => onChange("name", event.target.value)}
          placeholder={`Nom ${label.toLowerCase()}`}
        />
        <Input
          type="tel"
          value={value.phone}
          onChange={(event) => onChange("phone", event.target.value)}
          placeholder="Téléphone"
        />
      </div>
    </div>
  );
}

function DocCard({ active, label, description, badge, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-[24px] p-4 text-left transition-colors ring-1 ${active ? "bg-black text-white ring-black" : "bg-[#fbfaf8] text-zinc-900 ring-black/8 hover:bg-black/[0.03]"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-sm font-semibold">{label}</div>
            {badge && (
              <span className={`rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] ${active ? "bg-white/10 text-white/82" : "bg-white text-zinc-600"}`}>
                {badge}
              </span>
            )}
          </div>
          <p className={`text-sm mt-3 leading-relaxed ${active ? "text-white/72" : "text-zinc-600"}`}>{description}</p>
        </div>
        <span className={`mt-0.5 w-6 h-6 rounded-full inline-flex items-center justify-center shrink-0 ring-1 ${active ? "bg-white/10 ring-white/20" : "bg-white ring-black/10"}`}>
          {active && <CheckCircle2 className="w-4 h-4" />}
        </span>
      </div>
    </button>
  );
}

function SummaryPanel({ summary, countdownDays, selectedDocs, activeContacts, coordinationLabel, ceremonyLabel, guestBadges, configured, requestedPath, continueLabel, saveState }) {
  return (
    <div className="space-y-4 xl:sticky xl:top-24">
      <section className="rounded-[32px] overflow-hidden bg-[var(--color-black)] text-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
        <div className="px-5 md:px-6 py-5 border-b border-white/10">
          <div className="aime-label text-white/45 mb-3">Votre mariage</div>
          <div className="text-3xl font-display leading-[1.02]">{summary.couple}</div>
          <p className="mt-3 text-sm text-white/62 leading-relaxed">
            {summary.city} · {summary.guests} invités · {countdownDays} jours restants.
          </p>
        </div>
        <div className="px-5 md:px-6 py-5 space-y-3 text-sm">
          <div className="flex items-center justify-between gap-3"><span className="text-white/55">Date</span><span>{summary.dateLabel}</span></div>
          <div className="flex items-center justify-between gap-3"><span className="text-white/55">Lieu</span><span className="text-right">{summary.venue}</span></div>
          <div className="flex items-center justify-between gap-3"><span className="text-white/55">Budget</span><span>{summary.budgetLabel}</span></div>
          <div className="flex items-center justify-between gap-3"><span className="text-white/55">Contacts</span><span>{activeContacts}</span></div>
          <div className="flex items-center justify-between gap-3"><span className="text-white/55">Docs de départ</span><span>{selectedDocs}</span></div>
        </div>
      </section>

      <section className="aime-card-light rounded-[32px] overflow-hidden">
        <div className="px-5 md:px-6 py-5 border-b border-black/8">
          <div className="aime-label text-zinc-500 mb-3">Sauvegarde</div>
          <div className="text-lg font-semibold text-zinc-950">Vos informations se conservent au fil des étapes.</div>
        </div>
        <div className="p-5 md:p-6 space-y-3">
          <div className="rounded-[22px] bg-[#fbfaf8] p-4 ring-1 ring-black/8 text-sm text-zinc-700 leading-relaxed">
            <div className="inline-flex items-center gap-2 font-medium text-zinc-950">
              <span className={`w-2 h-2 rounded-full ${saveState === "saving" ? "bg-[#F5A524]" : "bg-[#34C759]"}`} />
              {saveState === "saving" ? "Sauvegarde en cours" : "Sauvegarde automatique active"}
            </div>
            <p className="mt-2">Vous pouvez avancer d’une étape à l’autre sans chercher un bouton de validation intermédiaire.</p>
          </div>
          <div className="rounded-[22px] bg-[#fbfaf8] p-4 ring-1 ring-black/8 text-sm text-zinc-700 leading-relaxed">
            {coordinationLabel} · cérémonie {ceremonyLabel.toLowerCase()} · {guestBadges.length ? guestBadges.join(" · ") : "aucune contrainte particulière"}.
          </div>
        </div>
      </section>

      <section className="aime-card-light rounded-[32px] overflow-hidden">
        <div className="px-5 md:px-6 py-5 border-b border-black/8">
          <div className="aime-label text-zinc-500 mb-3">Après validation</div>
          <div className="text-lg font-semibold text-zinc-950">Les espaces qui s’ouvrent.</div>
        </div>
        <div className="p-5 md:p-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm text-zinc-700">
            <div className="rounded-[18px] bg-[#fbfaf8] px-3 py-2 ring-1 ring-black/8">Espace couple</div>
            <div className="rounded-[18px] bg-[#fbfaf8] px-3 py-2 ring-1 ring-black/8">Invités</div>
            <div className="rounded-[18px] bg-[#fbfaf8] px-3 py-2 ring-1 ring-black/8">Prestataires</div>
            <div className="rounded-[18px] bg-[#fbfaf8] px-3 py-2 ring-1 ring-black/8">Point Zéro</div>
          </div>
          {configured && (
            <Link to={requestedPath} className="w-full rounded-full bg-black px-5 py-3.5 text-sm text-white inline-flex items-center justify-center gap-2 hover:bg-zinc-800">
              Continuer vers {continueLabel}
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}

export default function WeddingSetup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [state, setState] = useState(() => readWeddingState());
  const [form, setForm] = useState(() => createFormState(readWeddingState()));
  const [activeStep, setActiveStep] = useState("cadre");
  const [saveState, setSaveState] = useState("saved");
  const autoSaveReadyRef = useRef(false);

  const requestedPath = searchParams.get("from") || "/couple";
  const continueLabel = labelForPath(requestedPath);
  const configured = useMemo(() => isWeddingSetupComplete(state), [state]);
  const countdownDays = useMemo(() => getCountdownDays(form.date), [form.date]);
  const selectedDocs = form.starterDocs.length;
  const activeContacts = CONTACT_FIELDS.filter((field) => form.contacts[field.id]?.name?.trim()).length;

  const summary = useMemo(() => ({
    couple: form.couple.trim() || "Votre mariage",
    dateLabel: form.date || "Date à renseigner",
    venue: form.venue.trim() || "Lieu à renseigner",
    city: form.city.trim() || "Ville à renseigner",
    guests: Number(form.guests || 0),
    budgetLabel: new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(Number(form.budgetEnvelope || 0)),
    children: Number(form.guestsProfile.children || 0),
    pmr: Number(form.guestsProfile.pmr || 0),
    specialMeals: Number(form.guestsProfile.specialMeals || 0),
    speeches: Number(form.guestsProfile.speeches || 0),
    coordinationMode: form.orchestration.coordinationMode,
    ceremonyFormat: form.orchestration.ceremonyFormat,
    planBWeatherReady: form.orchestration.planBWeatherReady,
    shuttleNeeded: form.orchestration.shuttleNeeded,
    accommodationNeeded: form.orchestration.accommodationNeeded,
  }), [form]);

  const coordinationLabel = COORDINATION_MODE_OPTIONS.find((item) => item.id === summary.coordinationMode)?.label || "À renseigner";
  const ceremonyLabel = CEREMONY_FORMAT_OPTIONS.find((item) => item.id === summary.ceremonyFormat)?.label || "À renseigner";
  const guestBadges = [
    summary.children > 0 ? `${summary.children} enfant(s)` : null,
    summary.pmr > 0 ? `${summary.pmr} PMR` : null,
    summary.specialMeals > 0 ? `${summary.specialMeals} repas spéciaux` : null,
    summary.speeches > 0 ? `${summary.speeches} discours` : null,
    summary.shuttleNeeded ? "navettes" : null,
    summary.accommodationNeeded ? "hébergements" : null,
  ].filter(Boolean);

  const recommendedDocIds = useMemo(() => getRecommendedSetupDocumentIds({
    children: summary.children,
    pmr: summary.pmr,
    specialMeals: summary.specialMeals,
    speeches: summary.speeches,
  }, form.orchestration), [form.orchestration, summary.children, summary.pmr, summary.specialMeals, summary.speeches]);

  const persistSetup = ({ notify = false } = {}) => {
    const next = configureWeddingInState(state, buildSetupPayload(form));
    setState(next);
    writeWeddingState(next);
    setSaveState("saved");
    if (notify) toast.success("Setup enregistré");
    return next;
  };

  useEffect(() => {
    if (!autoSaveReadyRef.current) {
      autoSaveReadyRef.current = true;
      return undefined;
    }

    setSaveState("saving");
    const timeout = window.setTimeout(() => {
      persistSetup();
    }, 500);

    return () => window.clearTimeout(timeout);
  }, [form]);

  const updateField = (key, value) => {
    setForm((current) => {
      if (key === "couple") {
        const shouldSyncCouple = !current.contacts.couple.name || current.contacts.couple.name === current.couple;
        return {
          ...current,
          couple: value,
          contacts: shouldSyncCouple
            ? {
                ...current.contacts,
                couple: {
                  ...current.contacts.couple,
                  name: value,
                },
              }
            : current.contacts,
        };
      }

      if (key === "venue") {
        const shouldSyncVenue = !current.contacts.lieu.name || current.contacts.lieu.name === current.venue;
        return {
          ...current,
          venue: value,
          contacts: shouldSyncVenue
            ? {
                ...current.contacts,
                lieu: {
                  ...current.contacts.lieu,
                  name: value,
                },
              }
            : current.contacts,
        };
      }

      return { ...current, [key]: value };
    });
  };

  const updateContact = (contactId, key, value) => {
    setForm((current) => ({
      ...current,
      contacts: {
        ...current.contacts,
        [contactId]: {
          ...current.contacts[contactId],
          [key]: value,
        },
      },
    }));
  };

  const updateGuestsProfile = (key, value) => {
    setForm((current) => ({
      ...current,
      guestsProfile: {
        ...current.guestsProfile,
        [key]: value,
      },
    }));
  };

  const updateOrchestration = (key, value) => {
    setForm((current) => ({
      ...current,
      orchestration: {
        ...current.orchestration,
        [key]: value,
      },
    }));
  };

  const toggleDoc = (docId) => {
    setForm((current) => ({
      ...current,
      starterDocs: current.starterDocs.includes(docId)
        ? current.starterDocs.filter((item) => item !== docId)
        : [...current.starterDocs, docId],
    }));
  };

  const selectRecommendedDocs = () => {
    setForm((current) => ({
      ...current,
      starterDocs: [...new Set([...current.starterDocs, ...recommendedDocIds])],
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const next = persistSetup({ notify: true });
    navigate(requestedPath, { replace: true });
    return next;
  };

  const renderActiveStep = () => {
    if (activeStep === "cadre") {
      return (
        <SectionCard
          title="Le cadre du mariage"
          eyebrow="Étape 01"
          intro="Commencez par le couple, la date, le lieu, la ville, le volume invités et le budget. C’est la base qui structure tout le reste."
        >
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Couple" hint="Le nom affiché dans l’espace couple et les exports.">
              <Input type="text" value={form.couple} onChange={(event) => updateField("couple", event.target.value)} placeholder="Ex : Iris & Noam" />
            </Field>
            <Field label="Date" hint="La date de référence pour le compte à rebours et le Jour J.">
              <Input type="date" value={form.date} onChange={(event) => updateField("date", event.target.value)} />
            </Field>
            <Field label="Lieu" hint="Le lieu principal du mariage.">
              <Input type="text" value={form.venue} onChange={(event) => updateField("venue", event.target.value)} placeholder="Ex : Château de la Lys" />
            </Field>
            <Field label="Ville" hint="La ville utilisée dans les fiches, les transports et les exports.">
              <Input type="text" value={form.city} onChange={(event) => updateField("city", event.target.value)} placeholder="Ex : Lille" />
            </Field>
            <Field label="Nombre d’invités" hint="Le volume réellement pris en compte pour l’organisation.">
              <Input type="number" min="0" value={form.guests} onChange={(event) => updateField("guests", event.target.value)} placeholder="124" />
            </Field>
            <Field label="Budget global" hint="Le montant qui nourrit la vue budget et les arbitrages.">
              <Input type="number" min="0" step="100" value={form.budgetEnvelope} onChange={(event) => updateField("budgetEnvelope", event.target.value)} placeholder="28400" />
            </Field>
          </div>
        </SectionCard>
      );
    }

    if (activeStep === "invites") {
      return (
        <SectionCard
          title="Le profil des invités"
          eyebrow="Étape 02"
          intro="On ne vous demande pas tout. Seulement les informations qui changent vraiment la logistique, le service et le rythme de la journée."
        >
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Enfants" hint="Pour anticiper les assises, le rythme du dîner et la logistique famille.">
              <Input type="number" min="0" value={form.guestsProfile.children} onChange={(event) => updateGuestsProfile("children", event.target.value)} placeholder="0" />
            </Field>
            <Field label="Invités PMR" hint="Pour intégrer accessibilité, circulation et accueil dès le départ.">
              <Input type="number" min="0" value={form.guestsProfile.pmr} onChange={(event) => updateGuestsProfile("pmr", event.target.value)} placeholder="0" />
            </Field>
            <Field label="Repas spéciaux" hint="Pour sécuriser les échanges avec le traiteur et les plans de table.">
              <Input type="number" min="0" value={form.guestsProfile.specialMeals} onChange={(event) => updateGuestsProfile("specialMeals", event.target.value)} placeholder="0" />
            </Field>
            <Field label="Discours prévus" hint="Pour absorber correctement le tempo du dîner et de la soirée.">
              <Input type="number" min="0" value={form.guestsProfile.speeches} onChange={(event) => updateGuestsProfile("speeches", event.target.value)} placeholder="0" />
            </Field>
          </div>
        </SectionCard>
      );
    }

    if (activeStep === "coordination") {
      return (
        <SectionCard
          title="La coordination de base"
          eyebrow="Étape 03"
          intro="Posez ici le niveau d’accompagnement souhaité, le type de cérémonie et les besoins qui pèsent vraiment sur l’organisation."
        >
          <div className="space-y-6">
            <div>
              <div className="text-sm font-semibold text-zinc-950 mb-3">Mode de coordination</div>
              <div className="grid md:grid-cols-3 gap-3">
                {COORDINATION_MODE_OPTIONS.map((option) => (
                  <ChoiceCard
                    key={option.id}
                    active={form.orchestration.coordinationMode === option.id}
                    label={option.label}
                    description={option.description}
                    onClick={() => updateOrchestration("coordinationMode", option.id)}
                  />
                ))}
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold text-zinc-950 mb-3">Format de cérémonie</div>
              <div className="grid md:grid-cols-2 gap-3">
                {CEREMONY_FORMAT_OPTIONS.map((option) => (
                  <ChoiceCard
                    key={option.id}
                    active={form.orchestration.ceremonyFormat === option.id}
                    label={option.label}
                    description={option.description}
                    onClick={() => updateOrchestration("ceremonyFormat", option.id)}
                  />
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-3">
              <ToggleCard
                active={form.orchestration.planBWeatherReady}
                label="Plan B météo prêt"
                description="Un scénario de repli existe déjà et peut être diffusé sans repartir de zéro."
                onClick={() => updateOrchestration("planBWeatherReady", !form.orchestration.planBWeatherReady)}
              />
              <ToggleCard
                active={form.orchestration.shuttleNeeded}
                label="Navettes à coordonner"
                description="Les trajets invités doivent être cadrés dans le planning et les contacts utiles."
                onClick={() => updateOrchestration("shuttleNeeded", !form.orchestration.shuttleNeeded)}
              />
              <ToggleCard
                active={form.orchestration.accommodationNeeded}
                label="Hébergements à suivre"
                description="Des chambres ou check-ins invités doivent être pilotés avec le reste du mariage."
                onClick={() => updateOrchestration("accommodationNeeded", !form.orchestration.accommodationNeeded)}
              />
            </div>
          </div>
        </SectionCard>
      );
    }

    if (activeStep === "contacts") {
      return (
        <SectionCard
          title="Les contacts qui comptent"
          eyebrow="Étape 04"
          intro="Renseignez d’abord les personnes qui devront être appelées vite ou valider quelque chose. Le reste pourra venir ensuite."
        >
          <div className="space-y-4">
            {CONTACT_FIELDS.map((field) => (
              <ContactRow
                key={field.id}
                label={field.label}
                hint={field.hint}
                value={form.contacts[field.id]}
                onChange={(key, value) => updateContact(field.id, key, value)}
              />
            ))}
          </div>
        </SectionCard>
      );
    }

    return (
      <SectionCard
        title="Les documents de départ"
        eyebrow="Étape 05"
        intro="Choisissez seulement la base crédible dès aujourd’hui. Le reste pourra apparaître plus tard, quand il deviendra réellement utile."
        action={
          <div className="flex flex-wrap items-center gap-2 justify-end">
            {recommendedDocIds.length > 0 && (
              <button type="button" onClick={selectRecommendedDocs} className="rounded-full bg-[#f5f3f0] px-4 py-2 text-sm text-zinc-800">
                Ajouter les documents suggérés
              </button>
            )}
            <span className="text-sm text-zinc-500">{selectedDocs} sélectionné(s)</span>
          </div>
        }
      >
        <div className="space-y-3">
          {SETUP_DOCUMENT_OPTIONS.map((doc) => (
            <DocCard
              key={doc.id}
              active={form.starterDocs.includes(doc.id)}
              label={doc.label}
              description={doc.description}
              badge={recommendedDocIds.includes(doc.id) ? "Suggéré" : STARTER_DOCUMENT_OPTIONS.some((item) => item.id === doc.id) ? "Essentiel" : null}
              onClick={() => toggleDoc(doc.id)}
            />
          ))}
        </div>
      </SectionCard>
    );
  };

  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] text-[var(--color-text-primary)] overflow-x-hidden">
      <SetupHero />
      <SetupStepDock
        activeStep={activeStep}
        onStepSelect={setActiveStep}
        saveState={saveState}
        countdownDays={countdownDays}
        activeContacts={activeContacts}
        configured={configured}
        selectedDocs={selectedDocs}
      />

      <main id="setup-form" className="max-w-[1480px] mx-auto px-5 md:px-8 lg:px-10 py-8 md:py-10 pb-32 md:pb-36">
        <form id="wedding-setup-form" onSubmit={handleSubmit} className="grid gap-4 xl:grid-cols-[1.04fr_0.96fr] items-start">
          <div className="space-y-4">
            {renderActiveStep()}
          </div>

          <SummaryPanel
            summary={summary}
            countdownDays={countdownDays}
            selectedDocs={selectedDocs}
            activeContacts={activeContacts}
            coordinationLabel={coordinationLabel}
            ceremonyLabel={ceremonyLabel}
            guestBadges={guestBadges}
            configured={configured}
            requestedPath={requestedPath}
            continueLabel={continueLabel}
            saveState={saveState}
          />
        </form>
      </main>
    </div>
  );
}
