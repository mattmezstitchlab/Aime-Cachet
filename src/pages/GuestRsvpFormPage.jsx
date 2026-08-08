import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";
import { getHouseholdOverview, readWeddingState, updateHouseholdInState, writeWeddingState } from "@/lib/aimeWeddingCore";

function hashCode(value = "") {
  return value.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

function splitCouple(value = "Charlotte & Alexandre") {
  const parts = value.split("&").map((item) => item.trim()).filter(Boolean);
  return parts.length === 2 ? `${parts[0]} & ${parts[1]}` : value;
}

export default function GuestRsvpFormPage() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code") || "AIME-2027";
  const state = useMemo(() => readWeddingState(), []);
  const households = useMemo(() => getHouseholdOverview(state), [state]);
  const index = households.length ? hashCode(code) % households.length : 0;
  const seededHousehold = households[index] || null;
  const [currentState, setCurrentState] = useState(state);
  const [presence, setPresence] = useState("yes");
  const [name, setName] = useState("M. & Mme Jean Dupont");
  const [partySize, setPartySize] = useState(`${seededHousehold?.count || 2} personnes`);
  const [diet, setDiet] = useState("");
  const [message, setMessage] = useState("");
  const [stay, setStay] = useState("no");
  const [shuttle, setShuttle] = useState("no");

  const household = getHouseholdOverview(currentState)[index] || null;

  const submit = () => {
    if (household) {
      const next = updateHouseholdInState(currentState, household.id, { rsvpStatus: presence === "yes" ? "confirmed" : "declined", invitationStatus: "opened" });
      setCurrentState(next);
      writeWeddingState(next);
    }
    toast.success("Réponse enregistrée", { description: presence === "yes" ? `Présence confirmée pour ${partySize}.` : "Absence enregistrée." });
  };

  return (
    <div className="min-h-screen bg-[#efefeb] overflow-x-hidden text-[var(--color-text-primary)]">
      <div className="min-h-screen p-2 md:p-6">
        <div className="mx-auto min-h-[calc(100vh-16px)] md:min-h-[calc(100vh-48px)] max-w-[1600px] rounded-[24px] bg-[#fbfaf7] shadow-[0_24px_70px_rgba(0,0,0,0.05)] px-6 md:px-10 lg:px-16 py-12">
          <div className="text-center max-w-[720px] mx-auto">
            <div className="font-display text-[2rem] leading-none text-zinc-950">AIME</div>
            <div className="mt-4 h-px w-14 bg-[#c9b48e] mx-auto" />
            <h1 className="mt-8 font-display text-[3rem] md:text-[4.4rem] leading-[0.96] text-zinc-950">{splitCouple(state.meta?.couple || "Charlotte & Alexandre")}</h1>
            <div className="mt-4 text-[12px] uppercase tracking-[0.16em] text-zinc-500">{new Date(state.meta?.date || "2026-03-20").toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" }).toUpperCase()} · {state.meta?.city?.toUpperCase() || "PROVENCE"}</div>
          </div>

          <div className="mt-12 mx-auto max-w-[700px] rounded-[28px] border border-black/8 bg-white p-6 md:p-8 shadow-[0_12px_30px_rgba(12,12,12,0.03)]">
            <h2 className="font-display text-[2.6rem] leading-[1] text-zinc-950 text-center">Confirmez votre présence</h2>
            <p className="mt-4 text-center text-[15px] text-zinc-600">Veuillez répondre avant le 20 Janvier 2026 afin de finaliser les préparatifs.</p>

            <div className="mt-8 space-y-5">
              <label className="block">
                <span className="text-[11px] uppercase tracking-[0.16em] text-zinc-600">Votre nom complet *</span>
                <input value={name} onChange={(e) => setName(e.target.value)} className="mt-3 w-full rounded-[14px] border border-black/8 bg-[#fbf5ed] px-4 py-4 text-[15px] text-zinc-900 outline-none" />
              </label>

              <div>
                <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-600">Serez-vous parmi nous ? *</div>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <button onClick={() => setPresence("yes")} className={`rounded-full border px-5 py-4 text-left text-[15px] ${presence === "yes" ? "bg-black text-white border-black" : "bg-white text-zinc-500 border-black/10"}`}>● Oui, avec joie</button>
                  <button onClick={() => setPresence("no")} className={`rounded-full border px-5 py-4 text-left text-[15px] ${presence === "no" ? "bg-black text-white border-black" : "bg-white text-zinc-500 border-black/10"}`}>○ Non, à regret</button>
                </div>
              </div>

              <label className="block">
                <span className="text-[11px] uppercase tracking-[0.16em] text-zinc-600">Nombre d'accompagnants (y compris vous) *</span>
                <select value={partySize} onChange={(e) => setPartySize(e.target.value)} className="mt-3 w-full rounded-[14px] border border-black/8 bg-[#fbf5ed] px-4 py-4 text-[15px] text-zinc-900 outline-none">
                  <option>1 personne</option>
                  <option>2 personnes</option>
                  <option>3 personnes</option>
                  <option>4 personnes</option>
                </select>
              </label>

              <label className="block">
                <span className="text-[11px] uppercase tracking-[0.16em] text-zinc-600">Allergies ou régimes spécifiques</span>
                <textarea value={diet} onChange={(e) => setDiet(e.target.value)} rows={3} placeholder="Ex: Végétarien, sans gluten..." className="mt-3 w-full rounded-[14px] border border-black/8 bg-[#fbf5ed] px-4 py-4 text-[15px] text-zinc-900 outline-none resize-none placeholder:text-zinc-400" />
              </label>

              <label className="block">
                <span className="text-[11px] uppercase tracking-[0.16em] text-zinc-600">Un message pour les mariés ?</span>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} placeholder="Votre doux mot ici..." className="mt-3 w-full rounded-[14px] border border-black/8 bg-[#fbf5ed] px-4 py-4 text-[15px] text-zinc-900 outline-none resize-none placeholder:text-zinc-400" />
              </label>

              <div>
                <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-600">Avez-vous besoin d'hébergement sur place ?</div>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <button onClick={() => setStay("yes")} className={`rounded-full border px-5 py-4 text-left text-[15px] ${stay === "yes" ? "bg-black text-white border-black" : "bg-white text-zinc-500 border-black/10"}`}>○ Oui, j'aimerais réserver</button>
                  <button onClick={() => setStay("no")} className={`rounded-full border px-5 py-4 text-left text-[15px] ${stay === "no" ? "bg-black text-white border-black" : "bg-white text-zinc-500 border-black/10"}`}>● Non, je m'organise</button>
                </div>
              </div>

              <div>
                <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-600">Prendrez-vous la navette retour ?</div>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <button onClick={() => setShuttle("yes")} className={`rounded-full border px-5 py-4 text-left text-[15px] ${shuttle === "yes" ? "bg-black text-white border-black" : "bg-white text-zinc-500 border-black/10"}`}>○ Oui, à partir de 01h</button>
                  <button onClick={() => setShuttle("no")} className={`rounded-full border px-5 py-4 text-left text-[15px] ${shuttle === "no" ? "bg-black text-white border-black" : "bg-white text-zinc-500 border-black/10"}`}>● Non, j'ai mon véhicule</button>
                </div>
              </div>
            </div>

            <button onClick={submit} className="mt-8 w-full rounded-full bg-black px-6 py-4 text-[15px] uppercase tracking-[0.12em] text-white hover:bg-zinc-800">Confirmer ma présence</button>
            <p className="mt-6 text-center text-sm text-zinc-400">Une question ? Écrivez-nous à rsvp@claritydental.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
