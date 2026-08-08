import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, CalendarDays, Heart, Mail, MapPin, Sparkles, Users } from "lucide-react";
import { toast } from "sonner";
import { configureWeddingInState, readWeddingState, writeWeddingState } from "@/lib/aimeWeddingCore";

const MODE_OPTIONS = [
  { id: "maries", label: "Mariés", text: "Nous organisons notre mariage", icon: Heart },
  { id: "invites", label: "Invité", text: "Je suis invité à un mariage", icon: Mail },
  { id: "prestataires", label: "Prestataire", text: "Je suis un professionnel du mariage", icon: Sparkles },
  { id: "planner", label: "Wedding Planner", text: "J'accompagne des couples", icon: Users },
];

const GUEST_OPTIONS = ["0 - 50 invités", "50 - 100 invités", "100 - 200 invités", "200+ invités"];
const BUDGET_OPTIONS = ["10k€ - 20k€", "20k€ - 30k€", "30k€ - 50k€", "50k€ +"];

function DotPager({ active = 0, count = 3 }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: count }).map((_, index) => (
        <span key={index} className={`h-2.5 w-2.5 rounded-full ${index === active ? "bg-black" : "bg-black/14"}`} />
      ))}
    </div>
  );
}

function ModeCard({ mode, active, onClick }) {
  const Icon = mode.icon;
  return (
    <button onClick={onClick} className={`rounded-[24px] border p-6 text-left transition-colors ${active ? "border-black bg-white shadow-[0_12px_32px_rgba(0,0,0,0.06)]" : "border-black/8 bg-white hover:bg-black/[0.02]"}`}>
      <span className={`inline-flex h-11 w-11 items-center justify-center rounded-full ${active ? "bg-black text-white" : "bg-[var(--color-warm-white)] text-zinc-700"}`}>
        <Icon className="h-5 w-5" />
      </span>
      <div className="mt-6 font-display text-[1.55rem] leading-[1.04] text-zinc-950">{mode.label}</div>
      <div className="mt-3 text-sm text-zinc-500 leading-relaxed">{mode.text}</div>
    </button>
  );
}

function Input({ label, value, onChange, placeholder, icon: Icon = null, type = "text" }) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-[0.16em] text-zinc-600">{label}</span>
      <div className="mt-3 rounded-[14px] border border-black/8 bg-[#fbf5ed] px-4 py-3.5 flex items-center gap-3">
        {Icon && <Icon className="h-4 w-4 text-zinc-500" />}
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-transparent text-[15px] text-zinc-900 outline-none placeholder:text-zinc-400" />
      </div>
    </label>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-[0.16em] text-zinc-600">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="mt-3 w-full rounded-[14px] border border-black/8 bg-[#fbf5ed] px-4 py-3.5 text-[15px] text-zinc-900 outline-none">
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

export default function OnboardingPage() {
  const navigate = useNavigate();
  const baseState = useMemo(() => readWeddingState(), []);
  const [selectedMode, setSelectedMode] = useState("maries");
  const [firstName, setFirstName] = useState("Céleste");
  const [secondName, setSecondName] = useState("Alexandre");
  const [date, setDate] = useState(baseState.meta?.date || "2027-06-18");
  const [venue, setVenue] = useState("Provence, France...");
  const [guests, setGuests] = useState(GUEST_OPTIONS[2]);
  const [budget, setBudget] = useState(BUDGET_OPTIONS[2]);
  const [partnerEmail, setPartnerEmail] = useState("");

  const submit = () => {
    const next = configureWeddingInState(baseState, {
      couple: `${firstName} & ${secondName}`,
      date,
      venue,
      city: "Provence",
      guests: guests === GUEST_OPTIONS[0] ? 40 : guests === GUEST_OPTIONS[1] ? 80 : guests === GUEST_OPTIONS[2] ? 140 : 220,
      budgetEnvelope: budget === BUDGET_OPTIONS[0] ? 18000 : budget === BUDGET_OPTIONS[1] ? 28000 : budget === BUDGET_OPTIONS[2] ? 40000 : 65000,
    });
    writeWeddingState(next);
    toast.success("Cadre du mariage créé", { description: "Le prototype ouvre maintenant l’espace correspondant." });
    if (selectedMode === "planner") navigate("/espace-planner");
    else if (selectedMode === "prestataires") navigate("/espace-prestataires");
    else if (selectedMode === "invites") navigate("/espace-invites/compte");
    else navigate("/espace-maries");
  };

  return (
    <div className="min-h-screen bg-[#efefeb] text-[var(--color-text-primary)] overflow-x-hidden">
      <div className="min-h-screen p-2 md:p-6">
        <div className="mx-auto max-w-[1600px] rounded-[24px] bg-white shadow-[0_24px_70px_rgba(0,0,0,0.06)] px-6 md:px-10 lg:px-16 py-8 md:py-10">
          <header className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Link to="/" className="font-display text-[2rem] leading-none text-zinc-950">AIME</Link>
              <span className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Wedding</span>
            </div>
            <nav className="hidden md:flex items-center gap-10 text-[15px] text-zinc-900">
              <span>CONCEPT</span>
              <span>TARIFS</span>
              <span>CONTACT</span>
            </nav>
            <button className="rounded-full bg-black px-5 py-3 text-sm text-white hover:bg-zinc-800">Découvrir</button>
          </header>

          <section className="mt-14 md:mt-20 text-center">
            <DotPager active={0} />
            <h1 className="mt-5 font-display text-[3rem] md:text-[4.4rem] leading-[0.96] text-zinc-950">Bienvenue sur AIME</h1>
            <p className="mt-4 text-[16px] text-zinc-600">Commençons par faire connaissance.</p>

            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4 max-w-[1080px] mx-auto">
              {MODE_OPTIONS.map((mode) => (
                <ModeCard key={mode.id} mode={mode} active={selectedMode === mode.id} onClick={() => setSelectedMode(mode.id)} />
              ))}
            </div>
          </section>

          <div className="mt-16 border-t border-black/8" />

          <section className="mt-16 md:mt-20 text-center">
            <DotPager active={0} />
            <h2 className="mt-5 font-display text-[2.6rem] md:text-[4rem] leading-[0.98] text-zinc-950">Parlez-nous de votre jour</h2>
            <div className="mt-10 mx-auto max-w-[700px] rounded-[30px] border border-black/8 bg-white p-6 md:p-8 shadow-[0_14px_36px_rgba(0,0,0,0.04)] text-left">
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Prénom 1" value={firstName} onChange={setFirstName} placeholder="Céleste" />
                <Input label="Prénom 2" value={secondName} onChange={setSecondName} placeholder="Alexandre" />
                <Input label="Date du mariage" value={date} onChange={setDate} placeholder="2027-06-18" type="date" icon={CalendarDays} />
                <Input label="Lieu envisagé" value={venue} onChange={setVenue} placeholder="Provence, France..." icon={MapPin} />
                <Select label="Nombre d'invités estimé" value={guests} onChange={setGuests} options={GUEST_OPTIONS} />
                <Select label="Budget estimé" value={budget} onChange={setBudget} options={BUDGET_OPTIONS} />
              </div>
              <button onClick={submit} className="mt-6 w-full rounded-full bg-black px-6 py-4 text-[15px] text-white hover:bg-zinc-800 inline-flex items-center justify-center gap-2">
                Continuer
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </section>

          <div className="mt-16 border-t border-black/8" />

          <section className="mt-16 md:mt-20 text-center">
            <DotPager active={0} />
            <h2 className="mt-5 font-display text-[2.6rem] md:text-[4rem] leading-[0.98] text-zinc-950">Invitez votre moitié</h2>
            <p className="mt-4 text-[16px] text-zinc-600">Partagez l'accès à votre espace commun</p>
            <div className="mt-10 mx-auto max-w-[900px] rounded-[30px] border border-black/8 bg-white p-6 md:p-8 shadow-[0_14px_36px_rgba(0,0,0,0.04)] grid gap-6 md:grid-cols-[1.05fr_0.95fr] text-left">
              <div>
                <Input label="Email de votre partenaire" value={partnerEmail} onChange={setPartnerEmail} placeholder="partenaire@email.com" icon={Mail} />
                <button className="mt-6 w-full rounded-full bg-black px-6 py-4 text-[15px] text-white hover:bg-zinc-800 inline-flex items-center justify-center gap-2">
                  Envoyer l'invitation
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button className="mt-5 text-sm text-zinc-400 underline underline-offset-4 hover:text-zinc-700">Passer cette étape</button>
              </div>
              <div className="rounded-[24px] bg-[#fbf5ed] border border-black/6 min-h-[240px] flex flex-col items-center justify-center text-center px-8">
                <div className="relative h-20 w-20">
                  <span className="absolute inset-y-0 left-0 w-10 rounded-full border-4 border-[#bba57c]" />
                  <span className="absolute inset-y-0 right-0 w-10 rounded-full border-4 border-black" />
                </div>
                <div className="mt-6 font-display text-[1.8rem] text-zinc-950">Deux univers unis.</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
