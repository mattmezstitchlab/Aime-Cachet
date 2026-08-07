import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import {
  LayoutGrid,
  Mail,
  Move,
  Table2,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import WeddingPageHero from "@/components/aime/WeddingPageHero";
import {
  applyGuestSeatingInState,
  getGuestSummary,
  getHouseholdOverview,
  getInvitationSummary,
  getSeatingGroups,
  getTableOverview,
  readWeddingState,
  sendGuestInvitesInState,
  sendHouseholdInvitesInState,
  updateGuestInState,
  updateHouseholdInState,
  writeWeddingState,
} from "@/lib/aimeWeddingCore";

const RSVP_FILTERS = [
  { id: "all", label: "Tous" },
  { id: "confirmed", label: "Confirmés" },
  { id: "pending", label: "À répondre" },
  { id: "declined", label: "Refusés" },
];

const INVITATION_FILTERS = [
  { id: "all", label: "Tous" },
  { id: "draft", label: "À envoyer" },
  { id: "sent", label: "Envoyés" },
  { id: "opened", label: "Ouverts" },
];

const MEAL_OPTIONS = [
  { id: "standard", label: "Standard" },
  { id: "vegetarian", label: "Végétarien" },
  { id: "allergy", label: "Allergie" },
  { id: "child", label: "Enfant" },
];

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

function compactText(value, max = 88) {
  if (!value) return "";
  const clean = value.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cutoff = clean.lastIndexOf(" ", max);
  return `${clean.slice(0, cutoff > 44 ? cutoff : max).trim()}…`;
}

function statusTone(status) {
  if (status === "confirmed") return "bg-emerald-100 text-emerald-700 border-emerald-200";
  if (status === "declined") return "bg-zinc-100 text-zinc-600 border-black/8";
  return "bg-white text-zinc-700 border-black/8";
}

function statusLabel(status) {
  if (status === "confirmed") return "Confirmé";
  if (status === "declined") return "Refusé";
  return "En attente";
}

function invitationLabel(status) {
  if (status === "opened") return "Ouverte";
  if (status === "sent") return "Envoyée";
  return "À envoyer";
}

function reorder(list, startIndex, endIndex) {
  const next = Array.from(list);
  const [removed] = next.splice(startIndex, 1);
  next.splice(endIndex, 0, removed);
  return next;
}

export default function WeddingGuests() {
  const [searchParams] = useSearchParams();
  const [state, setState] = useState(() => readWeddingState());
  const roleView = ["couple", "planner", "vendors"].includes(searchParams.get("role")) ? searchParams.get("role") : "planner";
  const [rsvpFilter, setRsvpFilter] = useState("all");
  const [invitationFilter, setInvitationFilter] = useState("all");
  const [mobileTab, setMobileTab] = useState("guests");
  const [selectedId, setSelectedId] = useState(() => readWeddingState().guests?.list?.[0]?.id || null);

  useEffect(() => {
    writeWeddingState(state);
  }, [state]);

  const summary = useMemo(() => getGuestSummary(state), [state]);
  const invitationSummary = useMemo(() => getInvitationSummary(state), [state]);
  const householdOverview = useMemo(() => getHouseholdOverview(state), [state]);
  const tableOverview = useMemo(() => getTableOverview(state), [state]);
  const seatingGroups = useMemo(() => getSeatingGroups(state), [state]);
  const allGuests = state.guests?.list || [];

  const visibleGuests = useMemo(() => {
    let out = allGuests;
    if (rsvpFilter !== "all") out = out.filter((guest) => guest.rsvpStatus === rsvpFilter);
    if (invitationFilter !== "all") out = out.filter((guest) => guest.invitationStatus === invitationFilter);
    if (roleView === "vendors") out = out.filter((guest) => guest.rsvpStatus === "confirmed");
    return out;
  }, [allGuests, roleView, rsvpFilter, invitationFilter]);

  useEffect(() => {
    if (!visibleGuests.some((guest) => guest.id === selectedId)) {
      setSelectedId(visibleGuests[0]?.id || null);
    }
  }, [visibleGuests, selectedId]);

  const selectedGuest = visibleGuests.find((guest) => guest.id === selectedId) || visibleGuests[0] || null;
  const selectedHousehold = selectedGuest
    ? householdOverview.find((household) => household.id === (selectedGuest.householdId || selectedGuest.household)) || null
    : null;

  const updateGuest = (guestId, patch) => {
    setState((current) => updateGuestInState(current, guestId, patch));
    toast.success("Invité mis à jour");
  };

  const sendGuestInvite = (guestId) => {
    setState((current) => sendGuestInvitesInState(current, [guestId]));
    toast.success("Invitation envoyée");
  };

  const sendHouseholdInvite = (householdId) => {
    setState((current) => sendHouseholdInvitesInState(current, householdId));
    toast.success("Invitation foyer envoyée");
  };

  const updateHousehold = (householdId, patch) => {
    setState((current) => updateHouseholdInState(current, householdId, patch));
    toast.success("Foyer mis à jour");
  };

  const handleSeatingDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (roleView === "vendors") return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const draft = seatingGroups.map((group) => ({ ...group, guests: [...group.guests] }));
    const sourceGroup = draft.find((group) => group.id === source.droppableId);
    const destinationGroup = draft.find((group) => group.id === destination.droppableId);
    if (!sourceGroup || !destinationGroup) return;

    if (source.droppableId === destination.droppableId) {
      sourceGroup.guests = reorder(sourceGroup.guests, source.index, destination.index);
    } else {
      const [moved] = sourceGroup.guests.splice(source.index, 1);
      destinationGroup.guests.splice(destination.index, 0, moved);
    }

    const assignments = draft.flatMap((group) =>
      group.guests.map((guest, index) => ({
        id: guest.id,
        tableCode: group.id === "Sans table" ? null : group.id,
        seatOrder: index,
      })),
    );

    setState((current) => applyGuestSeatingInState(current, assignments));
    toast.success("Plan de table mis à jour");
  };

  const mobileGuests = visibleGuests.slice(0, 8);
  const mobileHouseholds = householdOverview.slice(0, 6);
  const mobileTables = tableOverview.slice(0, 6);
  const seatEditable = roleView !== "vendors";

  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] text-[var(--color-text-primary)] overflow-x-hidden">
      <div className="max-w-[1480px] mx-auto px-5 md:px-8 lg:px-10 py-6 md:py-8">
        <div className="mb-8 md:mb-10">
          <WeddingPageHero
            eyebrow="Invités · RSVP · tables"
            title="Les invités du mariage, enfin pilotables."
            description="Liste, réponses, repas, tables et contraintes réunis au même endroit."
            image="/landing/hestia.jpg"
            stats={[
              { label: "Invités", value: summary.total, hint: "totaux" },
              { label: "Confirmés", value: summary.confirmed, hint: "présents" },
              { label: "Invitations", value: invitationSummary.sent + invitationSummary.opened, hint: "envoyées" },
              { label: "Tables", value: summary.tables, hint: "actives" },
            ]}
            actions={(
              <>
                <Link to="/espace-invites" className="aime-button-primary rounded-full px-5 py-3 text-sm font-medium inline-flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Espace invités
                </Link>
              </>
            )}
          />
        </div>

        <section className="md:hidden mb-6 space-y-4">
          <div className="overflow-x-auto no-scrollbar -mx-1 px-1">
            <div className="flex gap-2 min-w-max">
              <Chip active={mobileTab === "guests"} onClick={() => setMobileTab("guests")}>Invités</Chip>
              <Chip active={mobileTab === "rsvp"} onClick={() => setMobileTab("rsvp")}>RSVP</Chip>
              <Chip active={mobileTab === "households"} onClick={() => setMobileTab("households")}>Foyers</Chip>
              <Chip active={mobileTab === "tables"} onClick={() => setMobileTab("tables")}>Tables</Chip>
            </div>
          </div>

          {(mobileTab === "guests" || mobileTab === "rsvp") && (
            <Card title="Invités" eyebrow={mobileTab === "rsvp" ? "RSVP & invitations" : "Liste mobile"} action={<span className="text-xs text-zinc-500">{visibleGuests.length}</span>}>
              <div className="flex flex-wrap gap-2 mb-3">
                {RSVP_FILTERS.map((filter) => (
                  <Chip key={filter.id} active={rsvpFilter === filter.id} onClick={() => setRsvpFilter(filter.id)}>
                    {filter.label}
                  </Chip>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {INVITATION_FILTERS.map((filter) => (
                  <Chip key={filter.id} active={invitationFilter === filter.id} onClick={() => setInvitationFilter(filter.id)}>
                    {filter.label}
                  </Chip>
                ))}
              </div>
              <div className="space-y-3">
                {mobileGuests.map((guest) => (
                  <div key={guest.id} className="rounded-[20px] border border-black/8 bg-white p-4">
                    <button onClick={() => setSelectedId(guest.id)} className="w-full text-left">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-zinc-950">{roleView === "vendors" ? `${guest.tableCode || "Sans table"} · ${guest.tags[0]}` : `${guest.firstName} ${guest.lastName}`}</div>
                          <div className="text-xs text-zinc-500 mt-2 uppercase tracking-[0.16em]">{guest.household}</div>
                        </div>
                        <span className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.18em] ${statusTone(guest.rsvpStatus)}`}>{statusLabel(guest.rsvpStatus)}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {guest.tags.slice(0, 3).map((tag) => <span key={tag} className="rounded-full border border-black/8 bg-black/[0.02] px-2.5 py-1 text-[11px] text-zinc-700">{tag}</span>)}
                        <span className="rounded-full border border-black/8 bg-white px-2.5 py-1 text-[11px] text-zinc-700">{invitationLabel(guest.invitationStatus)}</span>
                      </div>
                    </button>
                    {mobileTab === "rsvp" && (
                      <button onClick={() => sendGuestInvite(guest.id)} className="mt-3 rounded-full border border-black/8 bg-black text-white px-3 py-2 text-xs">
                        Envoyer
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {mobileTab === "households" && (
            <Card title="Foyers" eyebrow="Groupes & invitations" action={<Mail className="w-4 h-4 text-zinc-500" />}>
              <div className="space-y-3">
                {mobileHouseholds.map((household) => (
                  <div key={household.id} className="rounded-[20px] border border-black/8 bg-white p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-zinc-950">{household.label}</div>
                        <div className="text-xs text-zinc-500 mt-2 uppercase tracking-[0.16em]">{household.count} membre(s)</div>
                      </div>
                      <span className="rounded-full border border-black/8 bg-black/[0.02] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-zinc-700">{invitationLabel(household.invitationStatus)}</span>
                    </div>
                    <div className="text-sm text-zinc-600 mt-3">{household.confirmed} confirmé(s) · {household.pending} en attente</div>
                    <button onClick={() => sendHouseholdInvite(household.id)} className="mt-3 rounded-full border border-black/8 bg-black text-white px-3 py-2 text-xs">
                      Envoyer foyer
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {mobileTab === "tables" && (
            <Card title="Tables" eyebrow="Vue service" action={<Table2 className="w-4 h-4 text-zinc-500" />}>
              <div className="space-y-3">
                {mobileTables.map((table) => (
                  <div key={table.id} className="rounded-[20px] border border-black/8 bg-white p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-semibold text-zinc-950">{table.id}</div>
                      <div className="text-sm text-zinc-700">{table.guestCount} invités</div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {table.allergies > 0 && <span className="rounded-full border border-black/8 bg-black/[0.02] px-2.5 py-1 text-[11px] text-zinc-700">{table.allergies} allergie(s)</span>}
                      {table.vegetarian > 0 && <span className="rounded-full border border-black/8 bg-black/[0.02] px-2.5 py-1 text-[11px] text-zinc-700">{table.vegetarian} végé</span>}
                      {table.children > 0 && <span className="rounded-full border border-black/8 bg-black/[0.02] px-2.5 py-1 text-[11px] text-zinc-700">{table.children} enfant(s)</span>}
                      {table.pmr > 0 && <span className="rounded-full border border-black/8 bg-black/[0.02] px-2.5 py-1 text-[11px] text-zinc-700">{table.pmr} PMR</span>}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </section>

        <div className="hidden md:grid gap-4 xl:grid-cols-[0.88fr_1.12fr] items-start">
          <div className="space-y-4">
            <Card title="Liste invités" eyebrow="Invités, RSVP, foyers" action={<span className="text-sm text-zinc-500">{visibleGuests.length} visibles</span>}>
              <div className="flex flex-wrap gap-2 mb-3">
                {RSVP_FILTERS.map((filter) => (
                  <Chip key={filter.id} active={rsvpFilter === filter.id} onClick={() => setRsvpFilter(filter.id)}>
                    {filter.label}
                  </Chip>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {INVITATION_FILTERS.map((filter) => (
                  <Chip key={filter.id} active={invitationFilter === filter.id} onClick={() => setInvitationFilter(filter.id)}>
                    {filter.label}
                  </Chip>
                ))}
              </div>
              <div className="space-y-3 max-h-[720px] overflow-y-auto pr-1">
                {visibleGuests.map((guest) => (
                  <button key={guest.id} onClick={() => setSelectedId(guest.id)} className={`w-full rounded-[22px] border px-4 py-4 text-left ${selectedId === guest.id ? "border-black bg-black text-white" : "border-black/8 bg-black/[0.02] hover:bg-black/[0.04]"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold">{roleView === "vendors" ? `${guest.tableCode || "Sans table"} · ${guest.tags[0]}` : `${guest.firstName} ${guest.lastName}`}</div>
                        <div className={`text-xs mt-2 uppercase tracking-[0.16em] ${selectedId === guest.id ? "text-white/60" : "text-zinc-500"}`}>{guest.household}</div>
                      </div>
                      <span className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.18em] ${selectedId === guest.id ? "border-white/15 bg-white/10 text-white" : statusTone(guest.rsvpStatus)}`}>
                        {statusLabel(guest.rsvpStatus)}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {guest.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className={`rounded-full px-2.5 py-1 text-[11px] ${selectedId === guest.id ? "border border-white/15 bg-white/10 text-white/80" : "border border-black/8 bg-white text-zinc-700"}`}>
                          {tag}
                        </span>
                      ))}
                      <span className={`rounded-full px-2.5 py-1 text-[11px] ${selectedId === guest.id ? "border border-white/15 bg-white/10 text-white/80" : "border border-black/8 bg-white text-zinc-700"}`}>
                        {invitationLabel(guest.invitationStatus)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card title={selectedGuest ? `${selectedGuest.firstName} ${selectedGuest.lastName}` : "Invité"} eyebrow={selectedGuest ? `${selectedGuest.household} · ${selectedGuest.tableCode || "Sans table"}` : "Aucun invité"} action={<Users className="w-4 h-4 text-zinc-500" />}>
              {!selectedGuest ? (
                <div className="rounded-[24px] border border-black/8 bg-black/[0.02] p-5 text-sm text-zinc-600">Aucun invité visible pour ce filtre.</div>
              ) : (
                <div className="space-y-5">
                  <div className="grid lg:grid-cols-[0.92fr_1.08fr] gap-4">
                    <div className="rounded-[24px] border border-black/8 bg-black/[0.02] p-5">
                      <div className="aime-label text-zinc-500">Statut RSVP</div>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {[
                          ["confirmed", "Confirmé"],
                          ["pending", "En attente"],
                          ["declined", "Refusé"],
                        ].map(([id, label]) => (
                          <button
                            key={id}
                            onClick={() => updateGuest(selectedGuest.id, { rsvpStatus: id })}
                            className={`rounded-full px-4 py-2 text-sm ${selectedGuest.rsvpStatus === id ? "bg-black text-white" : "bg-white border border-black/8 text-zinc-700"}`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                      <div className="grid md:grid-cols-2 gap-3 mt-5">
                        <label className="block">
                          <span className="aime-label text-zinc-500">Repas</span>
                          <select
                            value={selectedGuest.mealPreference}
                            onChange={(e) => updateGuest(selectedGuest.id, { mealPreference: e.target.value })}
                            className="mt-2 w-full rounded-[16px] border border-black/8 bg-white px-4 py-3 text-sm text-zinc-800"
                          >
                            {MEAL_OPTIONS.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
                          </select>
                        </label>
                        <label className="block">
                          <span className="aime-label text-zinc-500">Table</span>
                          <input
                            value={selectedGuest.tableCode || ""}
                            onChange={(e) => updateGuest(selectedGuest.id, { tableCode: e.target.value || null })}
                            className="mt-2 w-full rounded-[16px] border border-black/8 bg-white px-4 py-3 text-sm text-zinc-800"
                            placeholder="Ex : T4"
                          />
                        </label>
                        <label className="block">
                          <span className="aime-label text-zinc-500">Accès</span>
                          <select
                            value={selectedGuest.eventAccess}
                            onChange={(e) => updateGuest(selectedGuest.id, { eventAccess: e.target.value })}
                            className="mt-2 w-full rounded-[16px] border border-black/8 bg-white px-4 py-3 text-sm text-zinc-800"
                          >
                            <option value="day-evening">Journée + soirée</option>
                            <option value="evening">Soirée</option>
                          </select>
                        </label>
                        <label className="block">
                          <span className="aime-label text-zinc-500">+1</span>
                          <input
                            value={selectedGuest.plusOneName || ""}
                            onChange={(e) => updateGuest(selectedGuest.id, { plusOneName: e.target.value, plusOneAllowed: Boolean(e.target.value) || selectedGuest.plusOneAllowed })}
                            className="mt-2 w-full rounded-[16px] border border-black/8 bg-white px-4 py-3 text-sm text-zinc-800"
                            placeholder={selectedGuest.plusOneAllowed ? "Nom du +1" : "Aucun +1"}
                          />
                        </label>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {INVITATION_FILTERS.filter((filter) => filter.id !== "all").map((filter) => (
                          <button
                            key={filter.id}
                            onClick={() => updateGuest(selectedGuest.id, { invitationStatus: filter.id, invitedAt: filter.id === "draft" ? null : new Date().toISOString() })}
                            className={`rounded-full px-4 py-2 text-sm ${selectedGuest.invitationStatus === filter.id ? "bg-black text-white" : "bg-white border border-black/8 text-zinc-700"}`}
                          >
                            {filter.label}
                          </button>
                        ))}
                        <button onClick={() => sendGuestInvite(selectedGuest.id)} className="rounded-full border border-black/8 bg-white px-4 py-2 text-sm text-zinc-700 hover:bg-black/[0.03] inline-flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Envoyer
                        </button>
                      </div>
                    </div>
                    <div className="rounded-[24px] border border-black/8 bg-black/[0.02] p-5">
                      <div className="aime-label text-zinc-500">Lecture rapide</div>
                      <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                        <div className="rounded-[18px] border border-black/8 bg-white p-3">
                          <div className="aime-label text-zinc-500 mb-1">Foyer</div>
                          <div className="text-zinc-900">{selectedGuest.household}</div>
                        </div>
                        <div className="rounded-[18px] border border-black/8 bg-white p-3">
                          <div className="aime-label text-zinc-500 mb-1">Place</div>
                          <div className="text-zinc-900">{selectedGuest.tableCode || "Sans table"}</div>
                        </div>
                        <div className="rounded-[18px] border border-black/8 bg-white p-3">
                          <div className="aime-label text-zinc-500 mb-1">Transport</div>
                          <div className="text-zinc-900">{selectedGuest.shuttle ? "Navette" : "Libre"}</div>
                        </div>
                        <div className="rounded-[18px] border border-black/8 bg-white p-3">
                          <div className="aime-label text-zinc-500 mb-1">Hébergement</div>
                          <div className="text-zinc-900">{selectedGuest.accommodation ? "Oui" : "Non"}</div>
                        </div>
                        <div className="rounded-[18px] border border-black/8 bg-white p-3">
                          <div className="aime-label text-zinc-500 mb-1">Invitation</div>
                          <div className="text-zinc-900">{invitationLabel(selectedGuest.invitationStatus)}</div>
                        </div>
                        <div className="rounded-[18px] border border-black/8 bg-white p-3">
                          <div className="aime-label text-zinc-500 mb-1">Accès</div>
                          <div className="text-zinc-900">{selectedGuest.eventAccess === "evening" ? "Soirée" : "Journée + soirée"}</div>
                        </div>
                      </div>
                      <p className="text-sm text-zinc-600 mt-4 leading-relaxed">{selectedGuest.note ? compactText(selectedGuest.note, 120) : "Aucune note particulière."}</p>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            <Card title="Foyers & invitations" eyebrow="Envoi par foyer" action={<Mail className="w-4 h-4 text-zinc-500" />}>
              <div className="space-y-3">
                {householdOverview.slice(0, 8).map((household) => (
                  <div key={household.id} className="rounded-[22px] border border-black/8 bg-black/[0.02] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-zinc-950">{household.label}</div>
                        <div className="text-xs text-zinc-500 mt-2 uppercase tracking-[0.16em]">{household.count} membre(s) · {household.eveningOnly ? "soirée" : "journée + soirée"}</div>
                      </div>
                      <span className="rounded-full border border-black/8 bg-white px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-zinc-700">{invitationLabel(household.invitationStatus)}</span>
                    </div>
                    <div className="text-sm text-zinc-600 mt-3">{household.confirmed} confirmé(s) · {household.pending} en attente · {household.plusOnes} +1</div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <button onClick={() => sendHouseholdInvite(household.id)} className="rounded-full bg-black text-white px-4 py-2 text-sm">Envoyer foyer</button>
                      <button onClick={() => updateHousehold(household.id, { eventAccess: household.eveningOnly ? "day-evening" : "evening" })} className="rounded-full border border-black/8 bg-white px-4 py-2 text-sm text-zinc-700">{household.eveningOnly ? "Passer journée" : "Passer soirée"}</button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card
              title="Plan de table visuel"
              eyebrow={seatEditable ? "Drag & drop simple" : "Vue service"}
              action={
                <div className="inline-flex items-center gap-2 text-sm text-zinc-500">
                  <LayoutGrid className="w-4 h-4" />
                  {seatEditable ? "Déplacer" : "Lecture seule"}
                </div>
              }
            >
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mb-5">
                {tableOverview.map((table) => (
                  <div key={table.id} className="rounded-[22px] border border-black/8 bg-black/[0.02] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-semibold text-zinc-950">{table.id}</div>
                      <div className="text-sm text-zinc-700">{table.guestCount} invités</div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {table.allergies > 0 && <span className="rounded-full border border-black/8 bg-white px-2.5 py-1 text-[11px] text-zinc-700">{table.allergies} allergie(s)</span>}
                      {table.vegetarian > 0 && <span className="rounded-full border border-black/8 bg-white px-2.5 py-1 text-[11px] text-zinc-700">{table.vegetarian} végé</span>}
                      {table.children > 0 && <span className="rounded-full border border-black/8 bg-white px-2.5 py-1 text-[11px] text-zinc-700">{table.children} enfant(s)</span>}
                      {table.pmr > 0 && <span className="rounded-full border border-black/8 bg-white px-2.5 py-1 text-[11px] text-zinc-700">{table.pmr} PMR</span>}
                    </div>
                  </div>
                ))}
              </div>

              <DragDropContext onDragEnd={handleSeatingDragEnd}>
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {seatingGroups.map((group) => (
                    <Droppable key={group.id} droppableId={group.id} isDropDisabled={!seatEditable}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`rounded-[24px] border p-4 min-h-[180px] ${snapshot.isDraggingOver ? "border-black bg-black/[0.03]" : "border-black/8 bg-white"}`}
                        >
                          <div className="flex items-center justify-between gap-3 mb-4">
                            <div>
                              <div className="text-sm font-semibold text-zinc-950">{group.label}</div>
                              <div className="text-xs text-zinc-500 mt-2 uppercase tracking-[0.16em]">{group.guests.length} place(s)</div>
                            </div>
                            {seatEditable && <Move className="w-4 h-4 text-zinc-400" />}
                          </div>

                          <div className="space-y-3">
                            {group.guests.map((guest, index) => (
                              <Draggable key={guest.id} draggableId={guest.id} index={index} isDragDisabled={!seatEditable}>
                                {(dragProvided, dragSnapshot) => (
                                  <div
                                    ref={dragProvided.innerRef}
                                    {...dragProvided.draggableProps}
                                    {...dragProvided.dragHandleProps}
                                    className={`rounded-[18px] border p-3 ${dragSnapshot.isDragging ? "border-black bg-black text-white" : "border-black/8 bg-black/[0.02]"}`}
                                  >
                                    <div className="flex items-center justify-between gap-3">
                                      <div>
                                        <div className="text-sm font-semibold">{guest.firstName} {guest.lastName}</div>
                                        <div className={`text-xs mt-2 uppercase tracking-[0.16em] ${dragSnapshot.isDragging ? "text-white/60" : "text-zinc-500"}`}>{guest.household}</div>
                                      </div>
                                      <span className={`rounded-full px-2.5 py-1 text-[10px] ${dragSnapshot.isDragging ? "border border-white/15 bg-white/10 text-white" : "border border-black/8 bg-white text-zinc-700"}`}>
                                        {guest.mealPreference}
                                      </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                      {guest.tags.slice(0, 2).map((tag) => (
                                        <span key={tag} className={`rounded-full px-2 py-1 text-[11px] ${dragSnapshot.isDragging ? "border border-white/15 bg-white/10 text-white/82" : "border border-black/8 bg-white text-zinc-700"}`}>{tag}</span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        </div>
                      )}
                    </Droppable>
                  ))}
                </div>
              </DragDropContext>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
