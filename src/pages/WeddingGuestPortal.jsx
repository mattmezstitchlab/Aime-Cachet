import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  BedDouble,
  Bus,
  CalendarDays,
  Check,
  Clock3,
  MapPin,
  MoveRight,
  Phone,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { UNIVERSE_GRADIENTS } from "@/lib/aimeUniverses";
import {
  getGuestSummary,
  getHouseholdOverview,
  getInvitationSummary,
  readWeddingState,
  sendHouseholdInvitesInState,
  updateHouseholdInState,
  writeWeddingState,
} from "@/lib/aimeWeddingCore";

function formatDate(value) {
  if (!value) return "Date à confirmer";
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function compactText(value, max = 120) {
  if (!value) return "";
  const clean = value.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cutoff = clean.lastIndexOf(" ", max);
  return `${clean.slice(0, cutoff > 48 ? cutoff : max).trim()}…`;
}

function invitationLabel(status) {
  if (status === "opened") return "Ouverte";
  if (status === "sent") return "Envoyée";
  return "À ouvrir";
}

function statusLabel(status) {
  if (status === "confirmed") return "Confirmé";
  if (status === "declined") return "Refusé";
  return "En attente";
}

function dotClass(level = "neutral") {
  if (level === "critical") return "bg-[#d96868]";
  if (level === "warning") return "bg-[#d8a14b]";
  if (level === "calm") return "bg-[#69b48f]";
  return "bg-black/20";
}

function statusTone(status) {
  if (status === "confirmed") return "bg-[#eef7f1] text-[#2d6a4f] border-[#cfe6d8]";
  if (status === "declined") return "bg-[#fbefef] text-[#8d3b3b] border-[#efd0d0]";
  return "bg-white text-zinc-700 border-black/8";
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

function QuickInfo({ icon: Icon, label, value }) {
  return (
    <div className="rounded-[24px] border border-black/8 bg-white p-4">
      <div className="flex items-center gap-3 text-zinc-500">
        <Icon className="h-4 w-4" />
        <span className="text-[11px] uppercase tracking-[0.16em]">{label}</span>
      </div>
      <div className="mt-3 text-sm text-zinc-950 leading-relaxed">{value}</div>
    </div>
  );
}

function HouseholdChip({ active, onClick, children }) {
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

function TimelineItem({ item }) {
  return (
    <div className="rounded-[24px] border border-black/8 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-zinc-950">{item.time} · {item.title}</div>
          <div className="mt-2 text-sm text-zinc-600 leading-relaxed">{compactText(item.detail, 120)}</div>
        </div>
        <span className="rounded-full border border-black/8 bg-[var(--color-warm-white)] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-zinc-700">
          Jour J
        </span>
      </div>
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
        <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-zinc-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </div>
    </a>
  );
}

export default function WeddingGuestPortal() {
  const [state, setState] = useState(() => readWeddingState());

  const guestPortal = state.guestPortal || {};
  const households = useMemo(() => getHouseholdOverview(state), [state]);
  const guestSummary = useMemo(() => getGuestSummary(state), [state]);
  const invitationSummary = useMemo(() => getInvitationSummary(state), [state]);
  const [selectedHouseholdId, setSelectedHouseholdId] = useState(() => households[0]?.id || null);

  useEffect(() => {
    if (!households.length) {
      setSelectedHouseholdId(null);
      return;
    }
    if (!households.some((item) => item.id === selectedHouseholdId)) {
      setSelectedHouseholdId(households[0].id);
    }
  }, [households, selectedHouseholdId]);

  const selectedHousehold = households.find((item) => item.id === selectedHouseholdId) || households[0] || null;
  const selectedGuests = useMemo(
    () => (state.guests?.list || []).filter((guest) => (guest.householdId || guest.household) === selectedHousehold?.id),
    [state.guests?.list, selectedHousehold?.id],
  );

  const contacts = [state.contacts?.planning, state.contacts?.famille, state.contacts?.lieu].filter(Boolean);
  const shuttles = guestPortal.shuttles || [];
  const accommodations = guestPortal.accommodations || [];
  const schedule = guestPortal.schedule || [];
  const faq = guestPortal.faq || [];
  const travel = guestPortal.travel || {};
  const countdownLabel = state.meta?.countdownDays > 0 ? `J-${state.meta.countdownDays}` : "Aujourd’hui";

  const patchHousehold = (patch, message) => {
    if (!selectedHousehold) return;
    const next = updateHouseholdInState(state, selectedHousehold.id, patch);
    setState(next);
    writeWeddingState(next);
    toast.success(message);
  };

  const openInvite = () => {
    if (!selectedHousehold) return;
    const next = updateHouseholdInState(state, selectedHousehold.id, {
      invitationStatus: "opened",
      invitationOpenedAt: new Date().toISOString(),
    });
    setState(next);
    writeWeddingState(next);
    toast.success("Invitation ouverte");
  };

  const sendInvite = () => {
    if (!selectedHousehold) return;
    const next = sendHouseholdInvitesInState(state, selectedHousehold.id);
    setState(next);
    writeWeddingState(next);
    toast.success("Invitation foyer envoyée");
  };

  const selectedNeeds = {
    shuttle: selectedGuests.some((guest) => guest.shuttle),
    accommodation: selectedGuests.some((guest) => guest.accommodation),
    accessibility: selectedGuests.some((guest) => guest.accessibilityNeed),
    meals: selectedGuests.filter((guest) => ["allergy", "vegetarian", "child"].includes(guest.mealPreference)).length,
  };

  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] text-[var(--color-text-primary)] overflow-x-hidden">
      <div className="mx-auto max-w-[1320px] px-5 pb-10 pt-4 md:px-8 md:pb-12 lg:px-10">
        <section className="relative overflow-hidden rounded-[38px] bg-[var(--color-black)] text-white shadow-[0_24px_70px_rgba(0,0,0,0.12)]">
          <img src="/landing/hestia.jpg" alt="Homepage invités" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.18),rgba(0,0,0,0.84))]" aria-hidden="true" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_24%)]" aria-hidden="true" />

          <div className="relative z-10 grid gap-8 px-5 py-6 md:px-8 md:py-8 lg:grid-cols-[1.02fr_0.98fr] lg:px-10 lg:py-10">
            <div className="max-w-3xl">
              <div className="aime-kicker">Homepage Invités</div>
              <h1 className="mt-5 font-display text-[2.65rem] leading-[0.94] tracking-[var(--tracking-display)] text-white sm:text-[4rem] lg:text-[5.1rem]">
                Tout ce qu’il faut,
                <br />
                rien de plus.
              </h1>
              <p className="mt-5 max-w-2xl text-[15px] leading-[1.65] text-white/72 md:text-[17px]">
                {guestPortal.welcomeTitle || "Bienvenue"}. {guestPortal.welcomeText || "Toutes les informations utiles sont regroupées ici."}
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5">
                <UniverseChip universeId="hestia" label="Hestia" />
                <UniverseChip universeId="artemis" label="Artémis" />
                <UniverseChip universeId="ares" label="Arès" />
                <UniverseChip universeId="hermes" label="Hermès" />
              </div>

              <div className="mt-7 flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => patchHousehold({ rsvpStatus: "confirmed", invitationStatus: "opened" }, "Foyer confirmé")}
                  className="aime-button-primary rounded-full px-5 py-3 text-sm font-medium inline-flex items-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  Confirmer mon foyer
                </button>
                <button
                  type="button"
                  onClick={openInvite}
                  className="rounded-full border border-white/14 bg-white/[0.04] px-5 py-3 text-sm text-white/88 hover:bg-white/[0.08] inline-flex items-center gap-2 transition-colors"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Ouvrir l’invitation
                </button>
                <Link to="/univers/hestia" className="rounded-full border border-white/14 bg-white/[0.04] px-5 py-3 text-sm text-white/88 hover:bg-white/[0.08] inline-flex items-center gap-2 transition-colors">
                  <Users className="h-4 w-4" />
                  Comprendre Hestia
                </Link>
              </div>
            </div>

            <div className="grid gap-4 self-end sm:grid-cols-2">
              <HeroStat label="Compte à rebours" value={countdownLabel} detail={formatDate(state.meta?.date)} />
              <HeroStat label="RSVP" value={`${guestSummary.confirmed}/${guestSummary.total}`} detail={`${guestSummary.pending} encore en attente`} />
              <HeroStat label="Navettes" value={shuttles.length} detail={`${accommodations.length} hébergements proposés`} />
              <HeroStat label="Foyer actif" value={selectedHousehold?.label || "—"} detail={selectedHousehold ? `${selectedHousehold.count} membre(s) · ${statusLabel(selectedGuests[0]?.rsvpStatus || "pending")}` : "Choisissez votre foyer"} />
            </div>
          </div>
        </section>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <QuickInfo icon={CalendarDays} label="Date" value={formatDate(state.meta?.date)} />
          <QuickInfo icon={MapPin} label="Réception" value={travel.receptionAddress || "Adresse à confirmer"} />
          <QuickInfo icon={Sparkles} label="Dress code" value={travel.dressCode || "Tenue à confirmer"} />
          <QuickInfo icon={Bus} label="Parking & accès" value={travel.parking || "Accès à confirmer"} />
        </div>

        <div className="mt-8 grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
          <Surface className="p-5 md:p-6">
            <SectionHeading
              eyebrow="Essentiel"
              title="Votre foyer"
              action={<div className="text-sm text-zinc-500">{households.length} foyers</div>}
            />

            <div className="mt-5 flex flex-wrap gap-2">
              {households.slice(0, 10).map((household) => (
                <HouseholdChip
                  key={household.id}
                  active={selectedHouseholdId === household.id}
                  onClick={() => setSelectedHouseholdId(household.id)}
                >
                  {household.label}
                </HouseholdChip>
              ))}
            </div>

            {selectedHousehold && (
              <>
                <div className="mt-5 rounded-[28px] border border-black/8 bg-[var(--color-warm-white)] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-lg font-semibold text-zinc-950">{selectedHousehold.label}</div>
                      <div className="mt-2 text-sm text-zinc-600">
                        {selectedHousehold.count} membre(s) · {selectedHousehold.confirmed} confirmé(s) · {selectedHousehold.pending} en attente
                      </div>
                    </div>
                    <div className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.18em] ${statusTone(selectedGuests[0]?.rsvpStatus || "pending")}`}>
                      {statusLabel(selectedGuests[0]?.rsvpStatus || "pending")}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-black/8 bg-white px-3 py-1.5 text-[12px] text-zinc-700">
                      Invitation {invitationLabel(selectedHousehold.invitationStatus)}
                    </span>
                    {selectedNeeds.shuttle && (
                      <span className="rounded-full border border-black/8 bg-white px-3 py-1.5 text-[12px] text-zinc-700">Navette utile</span>
                    )}
                    {selectedNeeds.accommodation && (
                      <span className="rounded-full border border-black/8 bg-white px-3 py-1.5 text-[12px] text-zinc-700">Hébergement utile</span>
                    )}
                    {selectedNeeds.accessibility && (
                      <span className="rounded-full border border-black/8 bg-white px-3 py-1.5 text-[12px] text-zinc-700">Accessibilité</span>
                    )}
                    {selectedNeeds.meals > 0 && (
                      <span className="rounded-full border border-black/8 bg-white px-3 py-1.5 text-[12px] text-zinc-700">{selectedNeeds.meals} repas spécifique{selectedNeeds.meals > 1 ? "s" : ""}</span>
                    )}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => patchHousehold({ rsvpStatus: "confirmed", invitationStatus: "opened" }, "Foyer confirmé")}
                      className="rounded-full bg-black px-4 py-2 text-sm text-white hover:bg-zinc-800"
                    >
                      Confirmer
                    </button>
                    <button
                      type="button"
                      onClick={() => patchHousehold({ rsvpStatus: "declined", invitationStatus: "opened" }, "Réponse enregistrée")}
                      className="rounded-full border border-black/8 bg-white px-4 py-2 text-sm text-zinc-700 hover:bg-black/[0.03]"
                    >
                      Je ne viens pas
                    </button>
                    <button
                      type="button"
                      onClick={sendInvite}
                      className="rounded-full border border-black/8 bg-white px-4 py-2 text-sm text-zinc-700 hover:bg-black/[0.03]"
                    >
                      Renvoyer l’invitation
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {selectedGuests.map((guest) => (
                    <div key={guest.id} className="rounded-[24px] border border-black/8 bg-white p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-zinc-950">{guest.firstName} {guest.lastName}</div>
                          <div className="mt-1 text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                            {guest.eventAccess === "evening" ? "Soirée" : "Journée + soirée"} · {invitationLabel(guest.invitationStatus)}
                          </div>
                        </div>
                        <div className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.18em] ${statusTone(guest.rsvpStatus)}`}>
                          {statusLabel(guest.rsvpStatus)}
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(guest.tags || []).slice(0, 3).map((tag) => (
                          <span key={tag} className="rounded-full border border-black/8 bg-[var(--color-warm-white)] px-2.5 py-1 text-[11px] text-zinc-700">
                            {tag}
                          </span>
                        ))}
                      </div>
                      {guest.note && <p className="mt-3 text-sm text-zinc-600 leading-relaxed">{compactText(guest.note, 110)}</p>}
                    </div>
                  ))}
                </div>
              </>
            )}
          </Surface>

          <Surface className="p-5 md:p-6">
            <SectionHeading
              eyebrow="Maisons utiles"
              title="Où trouver quoi"
              action={<Link to="/univers/hestia" className="text-sm text-zinc-600 hover:text-zinc-950 inline-flex items-center gap-2">Découvrir <MoveRight className="h-4 w-4" /></Link>}
            />
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <HouseLink
                universeId="zeus"
                label="Zeus"
                title="Les infos essentielles"
                detail="La vue simple du mariage : date, lieu, cadre général et repères stables."
                to="/univers/zeus"
              />
              <HouseLink
                universeId="hestia"
                label="Hestia"
                title="RSVP & accueil"
                detail="Votre foyer, vos réponses, les personnes prévues et les besoins spécifiques."
                to="/univers/hestia"
              />
              <HouseLink
                universeId="artemis"
                label="Artémis"
                title="Venir & séjourner"
                detail="Adresses, accès, hébergements et circulation jusqu’au lieu."
                to="/univers/artemis"
              />
              <HouseLink
                universeId="hermes"
                label="Hermès"
                title="Questions & messages"
                detail="Le bon contact, au bon moment, sans fouiller dans plusieurs conversations."
                to="/univers/hermes"
              />
            </div>
          </Surface>
        </div>

        <div className="mt-10 grid gap-4 xl:grid-cols-2">
          <Surface className="p-5 md:p-6">
            <SectionHeading
              eyebrow="Venir & séjourner"
              title="Se déplacer sans friction"
              action={<UniverseChip universeId="artemis" label="Artémis" />}
            />
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <QuickInfo icon={MapPin} label="Cérémonie" value={travel.ceremonyAddress || "Adresse à confirmer"} />
              <QuickInfo icon={MapPin} label="Réception" value={travel.receptionAddress || "Adresse à confirmer"} />
            </div>
            <div className="mt-4 rounded-[24px] border border-black/8 bg-[var(--color-warm-white)] p-4 text-sm text-zinc-600 leading-relaxed">
              {travel.parking || "Les informations d’accès seront précisées ici."}
            </div>

            <div className="mt-4 grid gap-3">
              {accommodations.map((item) => (
                <div key={item.id} className="rounded-[24px] border border-black/8 bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-zinc-950">{item.name}</div>
                      <div className="mt-2 text-sm text-zinc-600">{item.note}</div>
                    </div>
                    <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500 whitespace-nowrap">{item.distance}</div>
                  </div>
                  <div className="mt-3 text-[11px] uppercase tracking-[0.16em] text-zinc-500">Check-in {item.checkIn}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {shuttles.map((item) => (
                <div key={item.id} className="rounded-[24px] border border-black/8 bg-white p-4">
                  <div className="text-sm font-semibold text-zinc-950">{item.time}</div>
                  <div className="mt-2 text-sm text-zinc-600">{item.route}</div>
                  <div className="mt-2 text-xs text-zinc-500">{item.note}</div>
                </div>
              ))}
            </div>
          </Surface>

          <Surface className="p-5 md:p-6">
            <SectionHeading
              eyebrow="Le Jour J"
              title="Les moments à retenir"
              action={<UniverseChip universeId="ares" label="Arès" />}
            />
            <div className="mt-5 space-y-3">
              {schedule.map((item) => (
                <TimelineItem key={item.id} item={item} />
              ))}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <QuickInfo icon={Clock3} label="Ouverture" value={schedule[0] ? `${schedule[0].time} · ${schedule[0].title}` : "À confirmer"} />
              <QuickInfo icon={BedDouble} label="Hébergements" value={`${accommodations.length} option${accommodations.length > 1 ? "s" : ""}`} />
              <QuickInfo icon={Bus} label="Retours" value={shuttles.filter((item) => item.route?.includes("Château →")).length || 0} />
            </div>
          </Surface>
        </div>

        <div className="mt-10 grid gap-4 xl:grid-cols-[1.04fr_0.96fr]">
          <Surface className="p-5 md:p-6">
            <SectionHeading
              eyebrow="Aide"
              title="Questions fréquentes"
              action={<UniverseChip universeId="athena" label="Athéna" />}
            />
            <div className="mt-5 space-y-3">
              {faq.map((item) => (
                <div key={item.id} className="rounded-[24px] border border-black/8 bg-white p-4">
                  <div className="flex items-start gap-3">
                    <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${dotClass("neutral")}`} />
                    <div>
                      <div className="text-sm font-semibold text-zinc-950">{item.question}</div>
                      <div className="mt-2 text-sm text-zinc-600 leading-relaxed">{compactText(item.answer, 150)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Surface>

          <Surface className="p-5 md:p-6">
            <SectionHeading
              eyebrow="Le bon contact"
              title="Besoin d’aide rapide"
              action={state.contacts?.planning?.phone ? <a href={`tel:${state.contacts.planning.phone.replace(/\s+/g, "")}`} className="text-sm text-zinc-600 hover:text-zinc-950 inline-flex items-center gap-2"><Phone className="h-4 w-4" />Appeler</a> : null}
            />
            <div className="mt-5 space-y-3">
              {contacts.map((contact) => (
                <ContactCard key={contact.label} contact={contact} />
              ))}
            </div>

            <div className="mt-4 rounded-[24px] border border-black/8 bg-[var(--color-warm-white)] p-4">
              <div className="flex items-center gap-3">
                <span className={`h-2.5 w-2.5 rounded-full ${dotClass(invitationSummary.draft > 0 ? "warning" : "calm")}`} />
                <div className="text-sm font-semibold text-zinc-950">Statut invitations</div>
              </div>
              <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
                {invitationSummary.opened} foyer{invitationSummary.opened > 1 ? "s ont" : " a"} déjà ouvert l’invitation. {invitationSummary.draft} reste{invitationSummary.draft > 1 ? "nt" : ""} encore en brouillon.
              </p>
            </div>
          </Surface>
        </div>
      </div>
    </div>
  );
}
