import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import WeddingModuleHeader from "@/components/aime/WeddingModuleHeader";
import { getHouseholdOverview, readWeddingState, updateHouseholdInState, writeWeddingState } from "@/lib/aimeWeddingCore";

function hashCode(value = "") {
  return value.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

function Surface({ children, className = "" }) {
  return <section className={`rounded-[30px] border border-black/8 bg-white shadow-[0_18px_48px_rgba(12,12,12,0.06)] ${className}`}>{children}</section>;
}

export default function GuestRsvpFormPage() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code") || "AIME-2027";
  const state = useMemo(() => readWeddingState(), []);
  const households = useMemo(() => getHouseholdOverview(state), [state]);
  const [currentState, setCurrentState] = useState(state);
  const index = households.length ? hashCode(code) % households.length : 0;
  const household = getHouseholdOverview(currentState)[index] || null;

  const respond = (status) => {
    if (!household) return;
    const next = updateHouseholdInState(currentState, household.id, { rsvpStatus: status, invitationStatus: "opened" });
    setCurrentState(next);
    writeWeddingState(next);
    toast.success(status === "confirmed" ? "Présence confirmée" : "Réponse enregistrée");
  };

  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] text-[var(--color-text-primary)] overflow-x-hidden">
      <div className="mx-auto max-w-[1120px] px-5 pb-12 pt-24 md:px-8 md:pb-16 lg:px-10">
        <div className="mb-8 md:mb-10">
          <WeddingModuleHeader
            universeId="hestia"
            eyebrow="Hestia · formulaire RSVP"
            title="Répondre au mariage, simplement."
            description="La page que l’invité reçoit par lien ou QR : confirmation, refus, lecture du foyer et réponse claire sans friction."
            stats={[
              { label: "Code", value: code, detail: "invitation" },
              { label: "Foyer", value: household?.label || "—", detail: `${household?.count || 0} membre(s)` },
            ]}
            actions={[
              { to: `/invitation/${code}`, label: "Mini-site invité" },
              { to: "/espace-invites", label: "Portail invités" },
            ]}
          />
        </div>

        <Surface className="p-5 md:p-6">
          <div className="font-display text-[2rem] text-zinc-950">{household?.label || "Votre foyer"}</div>
          <div className="mt-3 text-sm text-zinc-600">{household?.count || 0} membre(s) · {household?.confirmed || 0} déjà confirmés · {household?.pending || 0} en attente</div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => respond("confirmed")} className="rounded-full bg-black px-5 py-3 text-sm text-white hover:bg-zinc-800 inline-flex items-center gap-2"><Check className="h-4 w-4" />Je confirme</button>
            <button onClick={() => respond("declined")} className="rounded-full border border-black/8 bg-white px-5 py-3 text-sm text-zinc-700 hover:bg-black/[0.03] inline-flex items-center gap-2"><X className="h-4 w-4" />Je ne viens pas</button>
          </div>
        </Surface>
      </div>
    </div>
  );
}
