import React, { useMemo, useState } from "react";
import {
  BedDouble,
  Bus,
  CalendarDays,
  Check,
  HelpCircle,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import WeddingPageHero from "@/components/aime/WeddingPageHero";
import {
  getHouseholdOverview,
  readWeddingState,
  sendHouseholdInvitesInState,
  updateHouseholdInState,
  writeWeddingState,
} from "@/lib/aimeWeddingCore";

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

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm transition-colors ${active ? "bg-black text-white" : "bg-white border border-black/8 text-zinc-700 hover:bg-black/[0.03]"}`}
    >
      {children}
    </button>
  );
}

function compactText(value, max = 110) {
  if (!value) return "";
  const clean = value.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cutoff = clean.lastIndexOf(" ", max);
  return `${clean.slice(0, cutoff > 44 ? cutoff : max).trim()}…`;
}

function invitationLabel(status) {
  if (status === "opened") return "Ouverte";
  if (status === "sent") return "Envoyée";
  return "À envoyer";
}

function statusLabel(status) {
  if (status === "confirmed") return "Confirmé";
  if (status === "declined") return "Refusé";
  return "En attente";
}

export default function WeddingGuestPortal() {
  const [state, setState] = useState(() => readWeddingState());
  const [tab, setTab] = useState("home");
  const households = useMemo(() => getHouseholdOverview(state), [state]);
  const [selectedHouseholdId, setSelectedHouseholdId] = useState(() => households[0]?.id || null);

  const guestPortal = state.guestPortal;
  const selectedHousehold = households.find((item) => item.id === selectedHouseholdId) || households[0] || null;
  const selectedGuests = useMemo(
    () => (state.guests?.list || []).filter((guest) => (guest.householdId || guest.household) === selectedHousehold?.id),
    [state.guests?.list, selectedHousehold?.id],
  );

  const updateHousehold = (patch) => {
    if (!selectedHousehold) return;
    const next = updateHouseholdInState(state, selectedHousehold.id, patch);
    setState(next);
    writeWeddingState(next);
    toast.success("Réponse foyer mise à jour");
  };

  const sendInvite = () => {
    if (!selectedHousehold) return;
    const next = sendHouseholdInvitesInState(state, selectedHousehold.id);
    setState(next);
    writeWeddingState(next);
    toast.success("Invitation foyer envoyée");
  };

  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] text-[var(--color-text-primary)] overflow-x-hidden">
      <div className="max-w-[1380px] mx-auto px-5 md:px-8 lg:px-10 py-6 md:py-8">
        <div className="mb-8 md:mb-10">
          <WeddingPageHero
            eyebrow="Espace invités · mini site mariage"
            title={guestPortal.welcomeTitle}
            description={guestPortal.welcomeText}
            image="/landing/hestia.jpg"
            stats={[
              { label: "Programme", value: guestPortal.schedule.length, hint: "temps forts" },
              { label: "Hébergements", value: guestPortal.accommodations.length, hint: "options" },
              { label: "Navettes", value: guestPortal.shuttles.length, hint: "trajets" },
              { label: "FAQ", value: guestPortal.faq.length, hint: "réponses" },
            ]}
            actions={(
              <>
                <Chip active={tab === "home"} onClick={() => setTab("home")}>Accueil</Chip>
                <Chip active={tab === "travel"} onClick={() => setTab("travel")}>Venir</Chip>
                <Chip active={tab === "rsvp"} onClick={() => setTab("rsvp")}>RSVP</Chip>
                <Chip active={tab === "faq"} onClick={() => setTab("faq")}>FAQ</Chip>
              </>
            )}
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-[0.88fr_1.12fr] items-start">
          <div className="space-y-4">
            <Card title="Votre foyer" eyebrow="Prévisualisation invité" action={<span className="text-sm text-zinc-500">{households.length} foyers</span>}>
              <div className="flex flex-wrap gap-2 mb-4">
                {households.slice(0, 8).map((household) => (
                  <Chip key={household.id} active={selectedHouseholdId === household.id} onClick={() => setSelectedHouseholdId(household.id)}>
                    {household.label}
                  </Chip>
                ))}
              </div>
              {selectedHousehold && (
                <div className="space-y-3">
                  <div className="rounded-[22px] border border-black/8 bg-black/[0.02] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-zinc-950">{selectedHousehold.label}</div>
                        <div className="text-xs text-zinc-500 mt-2 uppercase tracking-[0.16em]">{selectedHousehold.count} membre(s)</div>
                      </div>
                      <span className="rounded-full border border-black/8 bg-white px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-zinc-700">{invitationLabel(selectedHousehold.invitationStatus)}</span>
                    </div>
                    <div className="text-sm text-zinc-600 mt-3">{selectedHousehold.confirmed} confirmé(s) · {selectedHousehold.pending} en attente</div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <button onClick={sendInvite} className="rounded-full bg-black text-white px-4 py-2 text-sm">Envoyer l’invitation</button>
                      <button onClick={() => updateHousehold({ eventAccess: selectedHousehold.eveningOnly ? "day-evening" : "evening" })} className="rounded-full border border-black/8 bg-white px-4 py-2 text-sm text-zinc-700">{selectedHousehold.eveningOnly ? "Passer journée" : "Passer soirée"}</button>
                    </div>
                  </div>
                  {selectedGuests.map((guest) => (
                    <div key={guest.id} className="rounded-[20px] border border-black/8 bg-white p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-zinc-950">{guest.firstName} {guest.lastName}</div>
                          <div className="text-xs text-zinc-500 mt-2 uppercase tracking-[0.16em]">{statusLabel(guest.rsvpStatus)} · {invitationLabel(guest.invitationStatus)}</div>
                        </div>
                        <div className="text-sm text-zinc-700">{guest.eventAccess === "evening" ? "Soirée" : "Journée + soirée"}</div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {guest.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="rounded-full border border-black/8 bg-black/[0.02] px-2.5 py-1 text-[11px] text-zinc-700">{tag}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card title="Contacts utiles" eyebrow="Le bon contact vite">
              <div className="space-y-3">
                {[state.contacts?.planning, state.contacts?.famille, state.contacts?.lieu].filter(Boolean).map((contact) => (
                  <a key={contact.label} href={`tel:${contact.phone.replace(/\s+/g, "")}`} className="rounded-[20px] border border-black/8 bg-white p-4 block">
                    <div className="text-sm font-semibold text-zinc-950">{contact.name}</div>
                    <div className="text-xs text-zinc-500 mt-2 uppercase tracking-[0.16em]">{contact.label}</div>
                    <div className="text-sm text-zinc-600 mt-3">{compactText(contact.note, 92)}</div>
                  </a>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            {tab === "home" && (
              <>
                <Card title="Programme invité" eyebrow="Le fil de la journée" action={<CalendarDays className="w-4 h-4 text-zinc-500" />}>
                  <div className="space-y-3">
                    {guestPortal.schedule.map((item) => (
                      <div key={item.id} className="rounded-[20px] border border-black/8 bg-black/[0.02] p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-sm font-semibold text-zinc-950">{item.time} · {item.title}</div>
                          <div className="text-[11px] text-zinc-500">Jour J</div>
                        </div>
                        <div className="text-sm text-zinc-600 mt-3">{compactText(item.detail, 110)}</div>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card title="Vue rapide" eyebrow="Ce qu’un invité doit savoir">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="rounded-[22px] border border-black/8 bg-white p-4">
                      <div className="aime-label text-zinc-500 mb-2">Lieu</div>
                      <div className="text-sm text-zinc-900">{guestPortal.travel.receptionAddress}</div>
                    </div>
                    <div className="rounded-[22px] border border-black/8 bg-white p-4">
                      <div className="aime-label text-zinc-500 mb-2">Dress code</div>
                      <div className="text-sm text-zinc-900">{guestPortal.travel.dressCode}</div>
                    </div>
                  </div>
                </Card>
              </>
            )}

            {tab === "travel" && (
              <>
                <Card title="Venir au mariage" eyebrow="Adresses & circulation" action={<MapPin className="w-4 h-4 text-zinc-500" />}>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="rounded-[22px] border border-black/8 bg-white p-4">
                      <div className="aime-label text-zinc-500 mb-2">Cérémonie</div>
                      <div className="text-sm text-zinc-900">{guestPortal.travel.ceremonyAddress}</div>
                    </div>
                    <div className="rounded-[22px] border border-black/8 bg-white p-4">
                      <div className="aime-label text-zinc-500 mb-2">Réception</div>
                      <div className="text-sm text-zinc-900">{guestPortal.travel.receptionAddress}</div>
                    </div>
                  </div>
                  <div className="rounded-[22px] border border-black/8 bg-black/[0.02] p-4 mt-4 text-sm text-zinc-700">
                    {guestPortal.travel.parking}
                  </div>
                </Card>
                <Card title="Hébergements" eyebrow="Dormir sur place" action={<BedDouble className="w-4 h-4 text-zinc-500" />}>
                  <div className="space-y-3">
                    {guestPortal.accommodations.map((hotel) => (
                      <div key={hotel.id} className="rounded-[22px] border border-black/8 bg-white p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-sm font-semibold text-zinc-950">{hotel.name}</div>
                          <div className="text-sm text-zinc-700">{hotel.distance}</div>
                        </div>
                        <div className="text-sm text-zinc-600 mt-3">{hotel.note}</div>
                        <div className="text-xs text-zinc-500 mt-2 uppercase tracking-[0.16em]">Check-in {hotel.checkIn}</div>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card title="Navettes" eyebrow="Aller & retour" action={<Bus className="w-4 h-4 text-zinc-500" />}>
                  <div className="space-y-3">
                    {guestPortal.shuttles.map((shuttle) => (
                      <div key={shuttle.id} className="rounded-[22px] border border-black/8 bg-white p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-sm font-semibold text-zinc-950">{shuttle.time}</div>
                          <div className="text-xs text-zinc-500 uppercase tracking-[0.16em]">Navette</div>
                        </div>
                        <div className="text-sm text-zinc-700 mt-3">{shuttle.route}</div>
                        <div className="text-sm text-zinc-600 mt-2">{shuttle.note}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              </>
            )}

            {tab === "rsvp" && (
              <Card title="Réponse RSVP" eyebrow="Prévisualisation invité" action={<Check className="w-4 h-4 text-zinc-500" />}>
                <div className="space-y-3">
                  {selectedGuests.map((guest) => (
                    <div key={guest.id} className="rounded-[22px] border border-black/8 bg-white p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-zinc-950">{guest.firstName} {guest.lastName}</div>
                          <div className="text-xs text-zinc-500 mt-2 uppercase tracking-[0.16em]">{guest.eventAccess === "evening" ? "Soirée" : "Journée + soirée"}</div>
                        </div>
                        <span className="rounded-full border border-black/8 bg-black/[0.02] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-zinc-700">{statusLabel(guest.rsvpStatus)}</span>
                      </div>
                      <div className="text-sm text-zinc-600 mt-3">Repas : {guest.mealPreference}</div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {tab === "faq" && (
              <Card title="FAQ invités" eyebrow="Questions fréquentes" action={<HelpCircle className="w-4 h-4 text-zinc-500" />}>
                <div className="space-y-3">
                  {guestPortal.faq.map((item) => (
                    <div key={item.id} className="rounded-[22px] border border-black/8 bg-white p-4">
                      <div className="text-sm font-semibold text-zinc-950">{item.question}</div>
                      <div className="text-sm text-zinc-600 mt-3">{compactText(item.answer, 120)}</div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
