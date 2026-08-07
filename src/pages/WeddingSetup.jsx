import React, { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Calendar,
  CheckCircle2,
  Euro,
  MapPin,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import WeddingPageHero from "@/components/aime/WeddingPageHero";
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

function Stat({ icon: Icon, label, value, hint }) {
  return (
    <div className="aime-card-soft rounded-[26px] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="aime-label text-zinc-500">{label}</div>
          <div className="text-4xl font-display text-zinc-950 mt-3">{value}</div>
        </div>
        <span className="w-11 h-11 rounded-[18px] border border-black/8 bg-white flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-zinc-700" />
        </span>
      </div>
      <p className="text-sm text-zinc-600 mt-3 leading-relaxed">{hint}</p>
    </div>
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
      className="w-full rounded-[18px] border border-black/8 bg-[#fbfaf8] px-4 py-3 text-sm text-zinc-900 outline-none transition-colors focus:border-black focus:bg-white"
    />
  );
}

function ContactRow({ label, hint, value, onChange }) {
  return (
    <div className="rounded-[24px] border border-black/8 bg-black/[0.02] p-4 md:p-5">
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

function ChoiceChip({ active, label, description, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[24px] border p-4 text-left transition-colors ${active ? "border-black bg-black text-white" : "border-black/8 bg-black/[0.02] hover:bg-black/[0.04]"}`}
    >
      <div className="text-sm font-semibold">{label}</div>
      <p className={`text-sm mt-3 leading-relaxed ${active ? "text-white/72" : "text-zinc-600"}`}>{description}</p>
    </button>
  );
}

function BooleanTile({ active, label, description, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[24px] border p-4 text-left transition-colors ${active ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-black/8 bg-black/[0.02] text-zinc-900 hover:bg-black/[0.04]"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">{label}</div>
          <p className={`text-sm mt-3 leading-relaxed ${active ? "text-emerald-800" : "text-zinc-600"}`}>{description}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.18em] ${active ? "bg-emerald-100 text-emerald-700" : "bg-white border border-black/8 text-zinc-500"}`}>
          {active ? "Oui" : "Non"}
        </span>
      </div>
    </button>
  );
}

function DocToggle({ active, label, description, badge, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-[24px] border p-4 text-left transition-colors ${active ? "border-black bg-black text-white" : "border-black/8 bg-black/[0.02] hover:bg-black/[0.04]"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-sm font-semibold">{label}</div>
            {badge && (
              <span className={`rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] ${active ? "border border-white/15 bg-white/10 text-white/82" : "bg-zinc-100 text-zinc-600"}`}>
                {badge}
              </span>
            )}
          </div>
          <p className={`text-sm mt-3 leading-relaxed ${active ? "text-white/72" : "text-zinc-600"}`}>{description}</p>
        </div>
        <span className={`mt-0.5 w-6 h-6 rounded-full border inline-flex items-center justify-center shrink-0 ${active ? "border-white/25 bg-white/10" : "border-black/10 bg-white"}`}>
          {active && <CheckCircle2 className="w-4 h-4" />}
        </span>
      </div>
    </button>
  );
}

function labelForPath(pathname = "/point-zero") {
  if (pathname.startsWith("/couple")) return "l’espace couple";
  if (pathname.startsWith("/prestataires")) return "le portail prestataires";
  if (pathname.startsWith("/documents")) return "les documents";
  if (pathname.startsWith("/jour-j")) return "la timeline Jour J";
  if (pathname.startsWith("/notifications")) return "les notifications";
  if (pathname.startsWith("/budget")) return "le budget";
  if (pathname.startsWith("/communication")) return "la communication";
  if (pathname.startsWith("/exports")) return "les exports";
  return "Point Zéro";
}

export default function WeddingSetup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [state, setState] = useState(() => readWeddingState());
  const [form, setForm] = useState(() => createFormState(readWeddingState()));

  const requestedPath = searchParams.get("from") || "/point-zero";
  const continueLabel = labelForPath(requestedPath);
  const configured = useMemo(() => isWeddingSetupComplete(state), [state]);
  const countdownDays = useMemo(() => getCountdownDays(form.date), [form.date]);
  const selectedDocs = form.starterDocs.length;
  const activeContacts = CONTACT_FIELDS.filter((field) => form.contacts[field.id]?.name?.trim()).length;

  const summary = useMemo(() => ({
    couple: form.couple.trim() || "Couple à renseigner",
    venue: form.venue.trim() || "Lieu à renseigner",
    city: form.city.trim() || "Ville à renseigner",
    guests: Number(form.guests || 0),
    budget: Number(form.budgetEnvelope || 0),
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
    const next = configureWeddingInState(state, {
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
    });

    setState(next);
    setForm(createFormState(next));
    writeWeddingState(next);
    toast.success(configured ? "Setup mis à jour" : "Mariage initialisé");
    navigate(requestedPath, { replace: true });
  };

  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] text-[var(--color-text-primary)] overflow-x-hidden">
      <div className="max-w-[1480px] mx-auto px-5 md:px-8 lg:px-10 py-6 md:py-8">

        <div className="mb-8 md:mb-10">
          <WeddingPageHero
            eyebrow="Setup mariage · cadre initial"
            title="Configurer le mariage avant d'ouvrir le cockpit."
            description="Couple, date, lieu, budget, rôles et documents de départ."
            image="/landing/athena.jpg"
            stats={[
              { label: "Compte à rebours", value: `${countdownDays}j`, hint: "restants" },
              { label: "Contacts", value: activeContacts, hint: "saisis" },
              { label: "Docs", value: selectedDocs, hint: "de départ" },
            ]}
            actions={configured ? (
              <Link to={requestedPath} className="aime-button-primary rounded-full px-5 py-3 text-sm font-medium inline-flex items-center gap-2">
                Continuer vers {continueLabel}
              </Link>
            ) : (
              <div className="rounded-full border border-black/8 bg-white px-5 py-3 text-sm text-zinc-700">
                Enregistre d'abord le setup pour ouvrir les autres vues
              </div>
            )}
          />
          <div className="mt-4 rounded-[28px] border border-black/8 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] max-w-3xl">
            <div className="aime-label text-zinc-500 mb-3">État actuel</div>
            <div className="text-2xl font-display text-zinc-950">
              {configured ? "Mariage déjà configuré" : "Aucun setup finalisé pour le moment"}
            </div>
            <p className="text-sm text-zinc-600 mt-3 leading-relaxed">
              {configured
                ? "Vous pouvez ajuster le cadre sans toucher au reste du produit."
                : `Vous avez demandé ${continueLabel}. La navigation reste verrouillée tant que ce setup n'est pas enregistré.`}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr] items-start">
          <div className="space-y-4">
            <Card title="Le cadre du mariage" eyebrow="Les informations qui structurent tout le reste">
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Couple" hint="Le nom affiché partout dans le produit.">
                  <Input type="text" value={form.couple} onChange={(event) => updateField("couple", event.target.value)} placeholder="Ex : Iris & Noam" />
                </Field>
                <Field label="Date" hint="La date de référence pour le compte à rebours et le Jour J.">
                  <Input type="date" value={form.date} onChange={(event) => updateField("date", event.target.value)} />
                </Field>
                <Field label="Lieu" hint="Nom du lieu principal du mariage.">
                  <Input type="text" value={form.venue} onChange={(event) => updateField("venue", event.target.value)} placeholder="Ex : Château de la Lys" />
                </Field>
                <Field label="Ville" hint="Ville utilisée dans les fiches et les exports.">
                  <Input type="text" value={form.city} onChange={(event) => updateField("city", event.target.value)} placeholder="Ex : Lille" />
                </Field>
                <Field label="Nombre d’invités" hint="Le volume actuellement pris en compte pour l’organisation.">
                  <Input type="number" min="0" value={form.guests} onChange={(event) => updateField("guests", event.target.value)} placeholder="124" />
                </Field>
                <Field label="Enveloppe budget" hint="Montant global qui nourrit la vue Budget et les arbitrages.">
                  <Input type="number" min="0" step="100" value={form.budgetEnvelope} onChange={(event) => updateField("budgetEnvelope", event.target.value)} placeholder="28400" />
                </Field>
              </div>
            </Card>

            <Card title="Profil invités & sensibilités" eyebrow="Ce qui influence vraiment les flux et les arbitrages">
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Enfants" hint="Pour anticiper assises, rythme du dîner et logistique famille.">
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
            </Card>

            <Card title="Orchestration de base" eyebrow="Les choix qui structurent la coordination dès maintenant">
              <div className="space-y-5">
                <div>
                  <div className="text-sm font-semibold text-zinc-950 mb-3">Mode de coordination</div>
                  <div className="grid md:grid-cols-3 gap-3">
                    {COORDINATION_MODE_OPTIONS.map((option) => (
                      <ChoiceChip
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
                      <ChoiceChip
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
                  <BooleanTile
                    active={form.orchestration.planBWeatherReady}
                    label="Plan B météo déjà prêt"
                    description="Un scénario de repli existe déjà et peut être diffusé sans repartir de zéro."
                    onClick={() => updateOrchestration("planBWeatherReady", !form.orchestration.planBWeatherReady)}
                  />
                  <BooleanTile
                    active={form.orchestration.shuttleNeeded}
                    label="Navettes à coordonner"
                    description="Les trajets invités doivent être cadrés dans le planning et les contacts utiles."
                    onClick={() => updateOrchestration("shuttleNeeded", !form.orchestration.shuttleNeeded)}
                  />
                  <BooleanTile
                    active={form.orchestration.accommodationNeeded}
                    label="Hébergements à suivre"
                    description="Des chambres ou check-ins invités doivent être pilotés avec le reste du mariage."
                    onClick={() => updateOrchestration("accommodationNeeded", !form.orchestration.accommodationNeeded)}
                  />
                </div>
              </div>
            </Card>

            <Card title="Qui pilote et qui exécute" eyebrow="Les contacts de référence par rôle">
              <div className="space-y-3">
                {CONTACT_FIELDS.slice(0, 3).map((field) => (
                  <ContactRow
                    key={field.id}
                    label={field.label}
                    hint={field.hint}
                    value={form.contacts[field.id]}
                    onChange={(key, value) => updateContact(field.id, key, value)}
                  />
                ))}
              </div>
            </Card>

            <Card title="Prestataires clés" eyebrow="Les personnes à appeler vite le jour venu">
              <div className="space-y-3">
                {CONTACT_FIELDS.slice(3).map((field) => (
                  <ContactRow
                    key={field.id}
                    label={field.label}
                    hint={field.hint}
                    value={form.contacts[field.id]}
                    onChange={(key, value) => updateContact(field.id, key, value)}
                  />
                ))}
              </div>
            </Card>

            <Card
              title="Documents de départ"
              eyebrow="La base documentaire partagée dès le début"
              action={
                <div className="flex flex-wrap items-center gap-2 justify-end">
                  {recommendedDocIds.length > 0 && (
                    <button type="button" onClick={selectRecommendedDocs} className="rounded-full border border-black/8 bg-white px-4 py-2 text-sm text-zinc-700 hover:bg-black/[0.03]">
                      Ajouter les docs recommandés
                    </button>
                  )}
                  <span className="text-sm text-zinc-500">{selectedDocs} sélectionné(s)</span>
                </div>
              }
            >
              <div className="space-y-3">
                {SETUP_DOCUMENT_OPTIONS.map((doc) => (
                  <DocToggle
                    key={doc.id}
                    active={form.starterDocs.includes(doc.id)}
                    label={doc.label}
                    description={doc.description}
                    badge={recommendedDocIds.includes(doc.id) ? "Suggéré" : STARTER_DOCUMENT_OPTIONS.some((item) => item.id === doc.id) ? "Essentiel" : null}
                    onClick={() => toggleDoc(doc.id)}
                  />
                ))}
              </div>
              <div className={`mt-4 rounded-[22px] border p-4 text-sm leading-relaxed ${selectedDocs === 0 ? "border-black/8 bg-white text-zinc-800" : "border-black/8 bg-black/[0.02] text-zinc-600"}`}>
                {selectedDocs === 0
                  ? "Sélectionnez au moins un document de départ avant d'enregistrer le setup."
                  : recommendedDocIds.length > 0
                    ? "Le setup détecte aussi des documents recommandés à partir du profil invités et de l'orchestration. Vous restez libre de les activer ou non."
                    : "Gardez seulement les documents crédibles dès le départ. Le reste pourra apparaître plus tard, quand il devient réellement utile."}
              </div>
            </Card>
          </div>

          <div className="space-y-4 xl:sticky xl:top-24">
            <Card title="Résumé du setup" eyebrow="Ce que le produit retiendra">
              <div className="rounded-[28px] bg-[var(--color-black)] text-white p-5 md:p-6">
                <div className="aime-label text-white/45 mb-3">Mariage</div>
                <div className="text-3xl font-display leading-[1.02]">{summary.couple}</div>
                <div className="flex flex-wrap gap-3 mt-5">
                  <span className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/80 inline-flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {form.date || "Date à renseigner"}
                  </span>
                  <span className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/80 inline-flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {summary.venue}
                  </span>
                  <span className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/80 inline-flex items-center gap-2">
                    <Euro className="w-4 h-4" />
                    {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(summary.budget || 0)}
                  </span>
                </div>
                <p className="mt-5 text-sm text-white/65 leading-relaxed">
                  {summary.city} · {summary.guests} invités · {countdownDays} jours restants · {selectedDocs} documents de départ.
                </p>
                <div className="grid sm:grid-cols-2 gap-3 mt-5 text-sm">
                  <div className="rounded-[20px] border border-white/10 bg-white/[0.04] p-4">
                    <div className="aime-label text-white/45 mb-2">Coordination</div>
                    <div className="text-white/88">{coordinationLabel}</div>
                    <div className="text-white/60 mt-2">Cérémonie {ceremonyLabel.toLowerCase()}</div>
                  </div>
                  <div className="rounded-[20px] border border-white/10 bg-white/[0.04] p-4">
                    <div className="aime-label text-white/45 mb-2">Contraintes prises en compte</div>
                    <div className="text-white/88">{guestBadges.length ? guestBadges.join(" · ") : "Aucune contrainte particulière"}</div>
                    <div className="text-white/60 mt-2">Plan B {summary.planBWeatherReady ? "prêt" : "à construire"}</div>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 mt-4">
                <div className="rounded-[22px] border border-black/8 bg-black/[0.02] p-4">
                  <div className="aime-label text-zinc-500">Planner</div>
                  <div className="text-sm font-semibold text-zinc-950 mt-2">{form.contacts.planning.name || "À renseigner"}</div>
                </div>
                <div className="rounded-[22px] border border-black/8 bg-black/[0.02] p-4">
                  <div className="aime-label text-zinc-500">Lieu</div>
                  <div className="text-sm font-semibold text-zinc-950 mt-2">{form.contacts.lieu.name || summary.venue}</div>
                </div>
                <div className="rounded-[22px] border border-black/8 bg-black/[0.02] p-4">
                  <div className="aime-label text-zinc-500">Photo / vidéo</div>
                  <div className="text-sm font-semibold text-zinc-950 mt-2">{form.contacts.photo.name || "À renseigner"}</div>
                </div>
                <div className="rounded-[22px] border border-black/8 bg-black/[0.02] p-4">
                  <div className="aime-label text-zinc-500">Traiteur</div>
                  <div className="text-sm font-semibold text-zinc-950 mt-2">{form.contacts.traiteur.name || "À renseigner"}</div>
                </div>
              </div>
            </Card>

            <Card title="Action suivante" eyebrow="Simple et directe">
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={selectedDocs === 0}
                  className={`w-full rounded-full px-5 py-3 text-sm font-medium inline-flex items-center justify-center gap-2 ${selectedDocs === 0 ? "border border-black/8 bg-black/[0.06] text-zinc-400 cursor-not-allowed" : "bg-black text-white hover:bg-zinc-800"}`}
                >
                  <Save className="w-4 h-4" />
                  Enregistrer le setup
                </button>
                {configured ? (
                  <>
                    <Link to={requestedPath} className="w-full rounded-full border border-black/8 bg-white px-5 py-3 text-sm text-zinc-700 hover:bg-black/[0.03] inline-flex items-center justify-center">
                      Continuer vers {continueLabel}
                    </Link>
                    <Link to="/point-zero" className="w-full rounded-full border border-black/8 bg-white px-5 py-3 text-sm text-zinc-700 hover:bg-black/[0.03] inline-flex items-center justify-center">
                      Ouvrir le cockpit planner
                    </Link>
                  </>
                ) : (
                  <div className="w-full rounded-[22px] border border-black/8 bg-white px-5 py-4 text-sm text-zinc-600 text-center">
                    Enregistre le setup une première fois, puis la navigation complète s'ouvre.
                  </div>
                )}
              </div>
              <div className="mt-4 rounded-[22px] border border-black/8 bg-white p-4 text-sm text-zinc-700 leading-relaxed">
                Conseil : gardez au moins une feuille de service, un programme Jour J et les contacts planner / lieu / traiteur avant de diffuser le produit aux autres rôles.
              </div>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
}
