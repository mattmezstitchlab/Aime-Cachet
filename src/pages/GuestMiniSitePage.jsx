import React, { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { MapPin } from "lucide-react";
import { getHouseholdOverview, readWeddingState } from "@/lib/aimeWeddingCore";

function hashCode(value = "") {
  return value.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

export default function GuestMiniSitePage() {
  const { inviteCode } = useParams();
  const state = useMemo(() => readWeddingState(), []);
  const households = useMemo(() => getHouseholdOverview(state), [state]);
  const index = households.length ? hashCode(inviteCode || "AIME") % households.length : 0;
  const household = households[index] || null;

  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] text-[var(--color-text-primary)] overflow-x-hidden">
      <div className="mx-auto max-w-[1120px] px-5 pb-12 pt-24 md:px-8 md:pb-16 lg:px-10">
        <section className="relative overflow-hidden rounded-[38px] bg-[var(--color-black)] text-white shadow-[0_24px_70px_rgba(0,0,0,0.12)]">
          <img src="/landing/hestia.jpg" alt="Mini-site invité" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.16),rgba(0,0,0,0.84))]" />
          <div className="relative z-10 p-6 md:p-8 lg:p-10 min-h-[420px] flex flex-col justify-end">
            <div className="aime-kicker">Invitation privée · {inviteCode}</div>
            <h1 className="mt-5 font-display text-[2.8rem] sm:text-[4rem] lg:text-[5rem] leading-[0.92] text-white">Bienvenue au mariage de {state.meta?.couple}</h1>
            <p className="mt-4 max-w-2xl text-sm md:text-base text-white/72 leading-relaxed">{state.guestPortal?.welcomeText}</p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <Link to={`/univers/hestia/rsvp?code=${inviteCode}`} className="rounded-full bg-white px-5 py-3 text-sm text-black hover:bg-zinc-100">Répondre maintenant</Link>
              <Link to="/espace-invites" className="rounded-full border border-white/14 bg-white/[0.06] px-5 py-3 text-sm text-white hover:bg-white/[0.1]">Portail invités</Link>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-[30px] border border-black/8 bg-white p-5 md:p-6 shadow-[0_18px_48px_rgba(12,12,12,0.06)]">
          <h2 className="font-display text-[2rem] text-zinc-950">Votre foyer</h2>
          <div className="mt-4 text-sm text-zinc-600">{household?.label || "Foyer invité"} · {household?.count || 0} membre(s) · {household?.confirmed || 0} confirmés</div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-[24px] border border-black/8 bg-white p-5 shadow-[0_10px_28px_rgba(12,12,12,0.03)]">
            <div className="font-semibold text-zinc-950">Le lieu</div>
            <div className="mt-3 inline-flex items-start gap-2 text-sm text-zinc-600"><MapPin className="h-4 w-4 mt-0.5" />{state.guestPortal?.travel?.receptionAddress}</div>
          </div>
          <div className="rounded-[24px] border border-black/8 bg-white p-5 shadow-[0_10px_28px_rgba(12,12,12,0.03)]">
            <div className="font-semibold text-zinc-950">Le programme</div>
            <div className="mt-3 text-sm text-zinc-600">{(state.guestPortal?.schedule || []).map((item) => `${item.time} ${item.title}`).join(" · ")}</div>
          </div>
          <div className="rounded-[24px] border border-black/8 bg-white p-5 shadow-[0_10px_28px_rgba(12,12,12,0.03)]">
            <div className="font-semibold text-zinc-950">Aide</div>
            <div className="mt-3 text-sm text-zinc-600">{state.guestPortal?.faq?.[0]?.answer}</div>
          </div>
        </section>
      </div>
    </div>
  );
}
