import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Heart, MapPin, Mail, Users } from "lucide-react";
import { toast } from "sonner";
import WeddingModuleHeader from "@/components/aime/WeddingModuleHeader";
import { configureWeddingInState, readWeddingState, writeWeddingState } from "@/lib/aimeWeddingCore";

const MODE_OPTIONS = [
  { id: "maries", label: "Mariés", text: "Créer le mariage et ouvrir l’espace couple." },
  { id: "planner", label: "Planner", text: "Créer le cadre puis entrer côté cockpit." },
  { id: "prestataires", label: "Prestataires", text: "Rejoindre l’écosystème et préparer une mission." },
  { id: "invites", label: "Invités", text: "Entrer avec un code et rejoindre un mariage." },
];

function Surface({ children, className = "" }) {
  return <section className={`rounded-[30px] border border-black/8 bg-white shadow-[0_18px_48px_rgba(12,12,12,0.06)] ${className}`}>{children}</section>;
}

function SectionHeading({ eyebrow, title }) {
  return (
    <div>
      {eyebrow && <div className="aime-label text-zinc-500 mb-2">{eyebrow}</div>}
      <h2 className="text-[1.55rem] md:text-[1.8rem] font-display leading-[1.02] text-zinc-950">{title}</h2>
    </div>
  );
}

function Input({ icon: Icon = null, label, value, onChange, placeholder, type = "text" }) {
  return (
    <label className="block">
      <span className="aime-label text-zinc-500">{label}</span>
      <div className="mt-2 flex items-center gap-3 rounded-[18px] border border-black/8 bg-white px-4 py-3">
        {Icon && <Icon className="h-4 w-4 text-zinc-400" />}
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400" />
      </div>
    </label>
  );
}

export default function OnboardingPage() {
  const navigate = useNavigate();
  const baseState = useMemo(() => readWeddingState(), []);
  const [selectedMode, setSelectedMode] = useState("maries");
  const [firstName, setFirstName] = useState("Iris");
  const [secondName, setSecondName] = useState("Noam");
  const [date, setDate] = useState(baseState.meta?.date || "2027-06-18");
  const [venue, setVenue] = useState(baseState.meta?.venue || "Château de la Lys");
  const [city, setCity] = useState(baseState.meta?.city || "Lille");
  const [budget, setBudget] = useState(String(baseState.budget?.envelope || 28400));
  const [guests, setGuests] = useState(String(baseState.meta?.guests || 124));
  const [partnerEmail, setPartnerEmail] = useState("");

  const submit = () => {
    const next = configureWeddingInState(baseState, {
      couple: `${firstName} & ${secondName}`,
      date,
      venue,
      city,
      guests: Number(guests) || 0,
      budgetEnvelope: Number(budget) || 0,
      contacts: {
        couple: { name: `${firstName} & ${secondName}` },
      },
    });
    writeWeddingState(next);
    toast.success("Onboarding initialisé", {
      description: partnerEmail ? `Invitation partenaire préparée pour ${partnerEmail}.` : "Le cadre du mariage est maintenant enregistré.",
    });

    if (selectedMode === "planner") navigate("/espace-planner");
    else if (selectedMode === "prestataires") navigate("/espace-prestataires");
    else if (selectedMode === "invites") navigate("/espace-invites/compte");
    else navigate("/espace-maries");
  };

  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] text-[var(--color-text-primary)] overflow-x-hidden">
      <div className="mx-auto max-w-[1320px] px-5 pb-12 pt-24 md:px-8 md:pb-16 lg:px-10">
        <div className="mb-8 md:mb-10">
          <WeddingModuleHeader
            universeId="zeus"
            eyebrow="Onboarding · création du mariage"
            title="Créer le cadre, choisir le mode, inviter le partenaire."
            description="La première couche système : on choisit le point d’entrée, on cadre le mariage, puis on ouvre les espaces adaptés sans mélange entre les rôles."
            stats={[
              { label: "Étapes", value: 3, detail: "mode · cadre · invitation" },
              { label: "Budget", value: `${Number(budget || 0).toLocaleString("fr-FR")} €`, detail: "enveloppe actuelle" },
              { label: "Invités", value: Number(guests) || 0, detail: "volume de départ" },
            ]}
            actions={[
              { to: "/login", label: "J’ai déjà un compte" },
              { to: "/compte/maries", label: "Accès mode" },
            ]}
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
          <Surface className="p-5 md:p-6">
            <SectionHeading eyebrow="Étape 1" title="Choisir le mode d’entrée" />
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {MODE_OPTIONS.map((mode) => (
                <button key={mode.id} type="button" onClick={() => setSelectedMode(mode.id)} className={`rounded-[24px] border p-4 text-left transition-colors ${selectedMode === mode.id ? "border-black bg-black text-white" : "border-black/8 bg-[var(--color-warm-white)] hover:bg-black/[0.03]"}`}>
                  <div className="text-sm font-semibold">{mode.label}</div>
                  <div className={`mt-2 text-sm leading-relaxed ${selectedMode === mode.id ? "text-white/74" : "text-zinc-600"}`}>{mode.text}</div>
                </button>
              ))}
            </div>
          </Surface>

          <Surface className="p-5 md:p-6">
            <SectionHeading eyebrow="Étape 2" title="Créer le cadre du mariage" />
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Input icon={Heart} label="Prénom 1" value={firstName} onChange={setFirstName} placeholder="Iris" />
              <Input icon={Heart} label="Prénom 2" value={secondName} onChange={setSecondName} placeholder="Noam" />
              <Input label="Date du mariage" value={date} onChange={setDate} placeholder="2027-06-18" type="date" />
              <Input icon={MapPin} label="Lieu principal" value={venue} onChange={setVenue} placeholder="Château de la Lys" />
              <Input icon={MapPin} label="Ville" value={city} onChange={setCity} placeholder="Lille" />
              <Input icon={Users} label="Invités prévus" value={guests} onChange={setGuests} placeholder="124" type="number" />
              <Input label="Budget initial" value={budget} onChange={setBudget} placeholder="28400" type="number" />
            </div>
          </Surface>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-[1.02fr_0.98fr]">
          <Surface className="p-5 md:p-6">
            <SectionHeading eyebrow="Étape 3" title="Inviter le partenaire" />
            <div className="mt-5 max-w-[560px]">
              <Input icon={Mail} label="Email du partenaire" value={partnerEmail} onChange={setPartnerEmail} placeholder="partenaire@email.com" />
            </div>
            <div className="mt-5 rounded-[22px] border border-black/8 bg-[var(--color-warm-white)] p-4 text-sm text-zinc-600 leading-relaxed">
              Cette invitation est préparée dans le prototype pour compléter le parcours. Le back d’auth / envoi viendra ensuite.
            </div>
          </Surface>

          <Surface className="p-5 md:p-6">
            <SectionHeading eyebrow="Validation" title="Lancer l’onboarding" />
            <div className="mt-5 space-y-3 text-sm text-zinc-600">
              <div>• Mode sélectionné : <strong className="text-zinc-900">{MODE_OPTIONS.find((mode) => mode.id === selectedMode)?.label}</strong></div>
              <div>• Couple : <strong className="text-zinc-900">{firstName} & {secondName}</strong></div>
              <div>• Lieu : <strong className="text-zinc-900">{venue}, {city}</strong></div>
              <div>• Date : <strong className="text-zinc-900">{date}</strong></div>
            </div>
            <button onClick={submit} className="mt-6 rounded-full bg-black px-6 py-3 text-sm text-white hover:bg-zinc-800 inline-flex items-center gap-2">
              <Check className="h-4 w-4" />
              Créer et ouvrir l’espace
            </button>
          </Surface>
        </div>
      </div>
    </div>
  );
}
