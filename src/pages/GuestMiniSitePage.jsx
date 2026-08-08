import React, { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { getHouseholdOverview, readWeddingState } from "@/lib/aimeWeddingCore";

function hashCode(value = "") {
  return value.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

function initialsFromCouple(value = "Sophie & Thomas") {
  const parts = value.split("&").map((item) => item.trim()).filter(Boolean);
  return `${parts[0]?.[0] || "S"} & ${parts[1]?.[0] || "T"}`;
}

export default function GuestMiniSitePage() {
  const { inviteCode } = useParams();
  const state = useMemo(() => readWeddingState(), []);
  const households = useMemo(() => getHouseholdOverview(state), [state]);
  const index = households.length ? hashCode(inviteCode || "AIME") % households.length : 0;
  const household = households[index] || null;
  const [attendance, setAttendance] = useState("present");
  const [partySize, setPartySize] = useState(`${household?.count || 2} personnes`);
  const [diet, setDiet] = useState("");

  const submit = () => {
    toast.success("Réponse préparée", { description: attendance === "present" ? `Présence enregistrée pour ${partySize}.` : "Absence enregistrée." });
  };

  return (
    <div className="min-h-screen bg-[#efefeb] text-[var(--color-text-primary)] overflow-x-hidden">
      <div className="min-h-screen p-2 md:p-6">
        <div className="mx-auto max-w-[1600px] rounded-[24px] bg-[#fbfaf7] shadow-[0_24px_70px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="px-6 md:px-12 py-8 flex items-center justify-between gap-6 text-sm uppercase tracking-[0.18em] text-zinc-500">
            <div className="font-display text-[1.9rem] leading-none text-zinc-950 normal-case">{initialsFromCouple(state.meta?.couple)}</div>
            <div>Notre Mariage — {new Date(state.meta?.date || "2027-06-14").toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" }).toUpperCase()}</div>
          </div>

          <section className="relative min-h-[760px] overflow-hidden">
            <img src="/landing/artemis.jpg" alt="Invitation" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.38))]" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 text-white">
              <div className="text-[12px] uppercase tracking-[0.2em] text-white/78">Invitation personnelle</div>
              <h1 className="mt-6 font-display text-[3.6rem] md:text-[6rem] leading-[0.92] text-white">{state.meta?.couple || "Sophie & Thomas"}</h1>
              <div className="mt-8 flex items-center gap-5 text-[1.8rem] md:text-[2.2rem] text-white/92">
                <span className="h-px w-16 bg-white/60" />
                <span>{new Date(state.meta?.date || "2027-06-14").toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}</span>
                <span className="h-px w-16 bg-white/60" />
              </div>
              <div className="mt-8 text-[1.4rem] uppercase tracking-[0.12em] text-white/92">{(state.meta?.venue || "Château de la Lys").toUpperCase()}</div>
            </div>
          </section>

          <section className="px-6 md:px-12 py-20 text-center">
            <h2 className="font-display text-[3rem] md:text-[4rem] leading-[0.96] text-zinc-950">Votre Présence</h2>
            <p className="mt-6 max-w-3xl mx-auto text-[17px] text-zinc-600 leading-relaxed">Chers proches, nous avons hâte de célébrer cette journée unique avec vous. Merci de bien vouloir nous confirmer votre présence avant le 1er mars 2027.</p>

            <div className="mt-12 mx-auto max-w-[720px] rounded-[28px] border border-black/8 bg-white p-6 md:p-8 shadow-[0_12px_30px_rgba(12,12,12,0.03)] text-left">
              <div className="text-[1.5rem] font-display text-[#b59c73]">Serez-vous des nôtres ?</div>
              <div className="mt-6 grid gap-3 md:grid-cols-2">
                <button onClick={() => setAttendance("present")} className={`rounded-[14px] border px-5 py-4 text-left text-[15px] ${attendance === "present" ? "border-black bg-white text-zinc-950" : "border-black/8 bg-white text-zinc-400"}`}>● Présent(e)</button>
                <button onClick={() => setAttendance("absent")} className={`rounded-[14px] border px-5 py-4 text-left text-[15px] ${attendance === "absent" ? "border-black bg-white text-zinc-950" : "border-black/8 bg-white text-zinc-400"}`}>○ Absent(e)</button>
              </div>
              <div className="mt-6 text-[15px] text-zinc-900 font-medium">Nombre de personnes</div>
              <input value={partySize} onChange={(e) => setPartySize(e.target.value)} className="mt-3 w-full rounded-[14px] border border-black/8 bg-[#fbf5ed] px-5 py-4 text-[15px] text-zinc-900 outline-none" />
              <div className="mt-6 text-[15px] text-zinc-900 font-medium">Régime alimentaire & Allergies</div>
              <input value={diet} onChange={(e) => setDiet(e.target.value)} placeholder="Ex. Sans gluten, végétarien..." className="mt-3 w-full rounded-[14px] border border-black/8 bg-[#fbf5ed] px-5 py-4 text-[15px] text-zinc-900 outline-none placeholder:text-zinc-400" />
              <button onClick={submit} className="mt-8 w-full rounded-full bg-black px-6 py-4 text-[15px] uppercase tracking-[0.08em] text-white hover:bg-zinc-800">Confirmer ma réponse</button>
            </div>
          </section>

          <section className="px-6 md:px-12 py-20 border-t border-black/6 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] items-start">
            <div>
              <div className="text-[12px] uppercase tracking-[0.18em] text-zinc-500">Le domaine</div>
              <h3 className="mt-5 font-display text-[3rem] leading-[0.96] text-zinc-950">{state.meta?.venue || "Château de Vaux-le-Vicomte"}</h3>
              <p className="mt-8 text-[17px] text-zinc-600 leading-relaxed max-w-[720px]">Un chef-d'œuvre du XVIIe siècle qui servit de modèle pour Versailles. Situé à Maincy, en Seine-et-Marne, à environ 50 kilomètres au sud-est de Paris.</p>
              <div className="mt-8 space-y-4 text-[17px] text-zinc-700">
                <div><strong>Accès :</strong><br />Navettes privées au départ de la gare Paris de l'Est.</div>
                <div><strong>Hébergements :</strong><br />Hôtels partenaires et chambres d'hôtes de charme à proximité immédiate.</div>
              </div>
            </div>
            <div className="rounded-[24px] border border-[#e5dcc8] bg-[radial-gradient(circle_at_center,#fffdf7_0%,#f4eddc_100%)] aspect-square p-6 flex items-center justify-center shadow-[inset_0_0_0_1px_rgba(185,164,123,0.18)]">
              <div className="h-full w-full rounded-[18px] border border-[#e3d7c0] relative overflow-hidden">
                <div className="absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_20%_30%,#d3c49a_1px,transparent_1px),radial-gradient(circle_at_70%_60%,#d3c49a_1px,transparent_1px),radial-gradient(circle_at_40%_80%,#d3c49a_1px,transparent_1px)] [background-size:120px_120px]" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[#c7af7d] font-display text-[2rem]">{state.meta?.venue || "Vaux-le-Vicomte"}</div>
                <div className="absolute left-8 bottom-8 text-[#c7af7d] text-[2rem]">✦</div>
                <div className="absolute inset-x-0 top-4 text-center text-[11px] uppercase tracking-[0.18em] text-[#b59c73]">Carte de Maincy & environs</div>
              </div>
            </div>
          </section>

          <section className="px-6 md:px-12 py-20 border-t border-black/6">
            <h3 className="font-display text-[3rem] md:text-[4rem] text-zinc-950 text-center">Le Déroulement de la Journée</h3>
            <div className="mt-12 max-w-[980px] mx-auto space-y-8">
              {(state.guestPortal?.schedule || []).map((item) => (
                <div key={item.id} className="grid gap-4 md:grid-cols-[120px_1fr] border-b border-black/8 pb-6">
                  <div className="text-[#b59c73] font-semibold text-[1.6rem]">{item.time.replace(":", "h")}</div>
                  <div>
                    <div className="font-display text-[2rem] text-zinc-950">{item.title}</div>
                    <div className="mt-2 text-[17px] text-zinc-600">{item.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="px-6 md:px-12 py-16 bg-[#f6f2ea] border-t border-black/6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-[22px] border border-black/8 bg-white p-8 shadow-[0_10px_28px_rgba(12,12,12,0.03)]">
                <div className="font-display text-[2.5rem] text-zinc-950">Dress Code</div>
                <p className="mt-6 text-[17px] text-zinc-600 leading-relaxed">Tenue de soirée exigée. Nous vous invitons chaleureusement à vous parer de teintes pastel douces et printanières pour s'accorder à la beauté des jardins.</p>
                <div className="mt-8 flex flex-wrap gap-6">
                  {[
                    ["Pêche poudré", "#ead5c2"],
                    ["Vert sauge", "#ced7c3"],
                    ["Lavande douce", "#d6cae1"],
                    ["Crème d'ivoire", "#e7eee5"],
                    ["Bleu brume", "#c9d8e2"],
                  ].map(([name, color]) => (
                    <div key={name} className="text-center text-sm text-zinc-500">
                      <span className="mx-auto block h-14 w-14 rounded-full border border-black/6" style={{ background: color }} />
                      <span className="mt-3 block">{name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[22px] border border-black/8 bg-white p-8 shadow-[0_10px_28px_rgba(12,12,12,0.03)]">
                <div className="font-display text-[2.5rem] text-zinc-950">Une Question ?</div>
                <p className="mt-6 text-[17px] text-zinc-600 leading-relaxed">Pour toute question d'organisation, d'hébergement ou pour nous faire part d'une surprise, n'hésitez pas à nous contacter directement.</p>
                <Link to="/univers/hermes/messagerie" className="mt-8 inline-flex w-full items-center justify-center rounded-full border border-black/12 bg-white px-6 py-4 text-[15px] uppercase tracking-[0.06em] text-zinc-950 hover:bg-black/[0.03]">Nous envoyer un message</Link>
              </div>
            </div>
          </section>

          <footer className="px-6 md:px-12 py-12 text-center border-t border-black/6">
            <div className="font-display text-[2.2rem] text-zinc-950">Avec amour, {state.meta?.couple || "Sophie & Thomas"}</div>
            <div className="mt-4 text-[11px] uppercase tracking-[0.18em] text-zinc-500">AIME Wedding — Tous droits réservés © 2027</div>
          </footer>
        </div>
      </div>
    </div>
  );
}
