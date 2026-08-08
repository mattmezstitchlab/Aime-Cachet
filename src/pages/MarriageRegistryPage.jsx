import React, { useMemo, useState } from "react";
import { Gift, Heart, Upload } from "lucide-react";
import WeddingWorkspaceTopBar from "@/components/aime/WeddingWorkspaceTopBar";
import { readWeddingState } from "@/lib/aimeWeddingCore";

const ATELIER_ITEMS = [
  { id: "gifts", label: "Liste de Mariage", to: "/univers/hephaistos/liste-mariage" },
  { id: "site", label: "Site Web Invités", to: "/univers/hephaistos/site-web" },
  { id: "rsvp", label: "Invitations & RSVP", to: "/univers/hestia/rsvp?code=AIME-2027" },
  { id: "budget", label: "Budgets & Planning", to: "/univers/zeus/budget" },
];

function formatMoney(value) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value || 0);
}

function StatCard({ label, value, detail }) {
  return (
    <div className="rounded-[20px] border border-black/8 bg-white p-6 shadow-[0_10px_28px_rgba(12,12,12,0.03)]">
      <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">{label}</div>
      <div className="mt-6 font-display text-[2.5rem] text-zinc-950">{value}</div>
      <div className="mt-3 text-sm text-zinc-500">{detail}</div>
    </div>
  );
}

function ToggleRow({ label, checked, onToggle, detail = null }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-black/8 last:border-b-0">
      <div>
        <div className="text-[15px] text-zinc-900">{label}</div>
        {detail && <div className="mt-1 text-sm text-zinc-500">{detail}</div>}
      </div>
      <button onClick={onToggle} className={`relative h-8 w-14 rounded-full transition-colors ${checked ? "bg-black" : "bg-[#ddd8cf]"}`}>
        <span className={`absolute top-1 h-6 w-6 rounded-full bg-white transition-transform ${checked ? "translate-x-7" : "translate-x-1"}`} />
      </button>
    </div>
  );
}

export default function MarriageRegistryPage() {
  const state = useMemo(() => readWeddingState(), []);
  const [giftName, setGiftName] = useState("");
  const [giftPrice, setGiftPrice] = useState("");
  const [giftLink, setGiftLink] = useState("");
  const [visible, setVisible] = useState(true);
  const [freeAmount, setFreeAmount] = useState(true);
  const [thankYou, setThankYou] = useState(false);

  const couple = state.meta?.couple || "Sophie & Thomas";
  const fundCurrent = 4200;
  const fundTarget = 8000;
  const progress = Math.round((fundCurrent / fundTarget) * 100);

  return (
    <div className="min-h-screen bg-[#efefeb] overflow-x-hidden text-[var(--color-text-primary)]">
      <div className="min-h-screen p-2 md:p-6">
        <div className="mx-auto max-w-[1600px] rounded-[24px] bg-[#fbfaf7] shadow-[0_24px_70px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="p-3 md:p-4">
            <WeddingWorkspaceTopBar
              items={ATELIER_ITEMS}
              active="gifts"
              brand="AIME WEDDING"
              suffix="ATELIER"
              names={`Espace ${couple}`}
              avatarImage="/landing/hero-aime-wedding.jpg"
            />
          </div>

          <div className="px-6 md:px-10 lg:px-16 pt-6 md:pt-8 pb-16">
            <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Héphaïstos › <span className="text-zinc-900">Liste de mariage</span></div>
            <h1 className="mt-5 font-display text-[3.2rem] md:text-[4.8rem] leading-[0.94] text-zinc-950">Liste de mariage</h1>
            <p className="mt-4 text-[18px] text-zinc-600">Vos envies, leur générosité</p>

            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Cadeaux souhaités" value="32" detail="8 cadeaux disponibles" />
              <StatCard label="Cadeaux offerts" value="18" detail="Par vos généreux invités" />
              <StatCard label="Cagnotte cumulée" value={formatMoney(fundCurrent)} detail="Sécurisé sur votre compte" />
              <StatCard label="Contributeurs" value="45" detail="Proches et membres de la famille" />
            </div>

            <section className="mt-10 rounded-[28px] border border-black/8 bg-white p-8 shadow-[0_12px_30px_rgba(12,12,12,0.03)]">
              <div className="flex items-start justify-between gap-6 flex-wrap">
                <div>
                  <div className="font-display text-[2.4rem] text-zinc-950">Cagnotte voyage de noces — Bali <span className="align-middle rounded-full bg-[#d8be6c] px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-black">Projet voyage</span></div>
                  <p className="mt-3 text-[17px] text-zinc-600">Aidez-nous à réaliser notre rêve d'exploration sous les tropiques balinais.</p>
                </div>
                <button className="rounded-full bg-black px-6 py-4 text-sm text-white hover:bg-zinc-800 inline-flex items-center gap-2">Partager la cagnotte</button>
              </div>

              <div className="mt-10 flex items-end justify-between gap-4 flex-wrap">
                <div className="font-display text-[2.6rem] text-zinc-950">{formatMoney(fundCurrent)} <span className="text-zinc-400">/ {formatMoney(fundTarget)}</span></div>
                <div className="text-[1.4rem] font-display text-zinc-950">{progress}% complété</div>
              </div>
              <div className="mt-4 h-2 rounded-full bg-black/8 overflow-hidden"><div className="h-full bg-[linear-gradient(90deg,#c29a2e_0%,#f7e9a4_45%,#b4821b_100%)]" style={{ width: `${progress}%` }} /></div>
              <div className="mt-6 rounded-[18px] bg-[var(--color-warm-white)] px-5 py-5 flex items-start gap-4">
                <span className="h-10 w-10 rounded-full border border-black/10 bg-white flex items-center justify-center text-zinc-700"><Heart className="h-5 w-5" /></span>
                <div>
                  <div className="font-medium text-zinc-950">Dernière contribution : Marie & Pierre — 150€</div>
                  <div className="mt-1 text-sm text-zinc-600">"Profitez bien de cette magnifique lune de miel ! On a hâte d'entendre vos récits de voyage."</div>
                </div>
              </div>
            </section>

            <section className="mt-14">
              <h2 className="font-display text-[2.4rem] text-zinc-950">Vos envies de mariage</h2>
              <div className="mt-6 rounded-[28px] overflow-hidden border border-black/8 bg-white shadow-[0_12px_30px_rgba(12,12,12,0.03)]">
                <div className="relative h-[260px] md:h-[340px] overflow-hidden">
                  <img src="/landing/hephaistos.jpg" alt="Liste de mariage" className="h-full w-full object-cover" />
                </div>
                <div className="grid gap-6 lg:grid-cols-[1fr_1fr] p-6 md:p-8 bg-white">
                  <div className="rounded-[24px] border border-black/8 bg-white p-6 shadow-[0_8px_18px_rgba(12,12,12,0.03)]">
                    <div className="font-display text-[2rem] text-zinc-950">Ajouter un souhait à la liste</div>
                    <p className="mt-3 text-sm text-zinc-600">Vos invités aiment avoir du choix. Ajoutez de nouvelles idées de cadeaux.</p>
                    <div className="mt-6 space-y-4">
                      <label className="block">
                        <span className="text-[11px] uppercase tracking-[0.16em] text-zinc-600">Nom du cadeau</span>
                        <input value={giftName} onChange={(e) => setGiftName(e.target.value)} placeholder="Ex: Machine à café filtre" className="mt-3 w-full rounded-[14px] border border-black/8 bg-[#fbf5ed] px-4 py-4 text-[15px] text-zinc-900 outline-none" />
                      </label>
                      <div className="grid gap-4 md:grid-cols-2">
                        <label className="block">
                          <span className="text-[11px] uppercase tracking-[0.16em] text-zinc-600">Prix estimé (€)</span>
                          <input value={giftPrice} onChange={(e) => setGiftPrice(e.target.value)} placeholder="Ex: 150" className="mt-3 w-full rounded-[14px] border border-black/8 bg-[#fbf5ed] px-4 py-4 text-[15px] text-zinc-900 outline-none" />
                        </label>
                        <label className="block">
                          <span className="text-[11px] uppercase tracking-[0.16em] text-zinc-600">Lien produit (optionnel)</span>
                          <input value={giftLink} onChange={(e) => setGiftLink(e.target.value)} placeholder="https://..." className="mt-3 w-full rounded-[14px] border border-black/8 bg-[#fbf5ed] px-4 py-4 text-[15px] text-zinc-900 outline-none" />
                        </label>
                      </div>
                      <div>
                        <span className="text-[11px] uppercase tracking-[0.16em] text-zinc-600">Photo du produit</span>
                        <div className="mt-3 rounded-[18px] border border-dashed border-[#d6c18f] bg-[#fffaf0] px-4 py-10 flex flex-col items-center justify-center text-center text-zinc-500">
                          <Upload className="h-6 w-6 mb-3" />
                          Glissez un fichier ou cliquez pour uploader
                        </div>
                      </div>
                    </div>
                    <button className="mt-8 w-full rounded-full bg-black px-6 py-4 text-[15px] text-white hover:bg-zinc-800 inline-flex items-center justify-center gap-2">
                      <Gift className="h-4 w-4" />
                      Ajouter à la liste →
                    </button>
                  </div>

                  <div className="rounded-[24px] border border-black/8 bg-white p-6 shadow-[0_8px_18px_rgba(12,12,12,0.03)]">
                    <div className="font-display text-[2rem] text-zinc-950">Paramètres de la liste</div>
                    <p className="mt-3 text-sm text-zinc-600">Ajustez l'accès et les automatisations de votre espace cadeaux.</p>
                    <div className="mt-6">
                      <ToggleRow label="Liste visible par les invités" checked={visible} onToggle={() => setVisible((v) => !v)} />
                      <ToggleRow label="Accepter les contributions libres (cagnotte)" checked={freeAmount} onToggle={() => setFreeAmount((v) => !v)} />
                      <ToggleRow label="Remerciements automatiques par email" checked={thankYou} onToggle={() => setThankYou((v) => !v)} />
                    </div>
                    <div className="mt-8 rounded-[18px] bg-[var(--color-warm-white)] px-5 py-5 text-sm text-zinc-600 leading-relaxed">
                      <div className="font-medium text-zinc-950 mb-2">Note sur la sécurité</div>
                      Toutes les contributions de cagnotte sont cryptées et soumises aux protocoles de virement instantané d'Héphaïstos Finances.
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
