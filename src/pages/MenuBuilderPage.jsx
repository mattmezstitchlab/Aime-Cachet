import React, { useMemo, useState } from "react";
import WeddingModuleHeader from "@/components/aime/WeddingModuleHeader";
import { getBudgetSummary, getGuestSummary, getVendorMarketplace, readWeddingState } from "@/lib/aimeWeddingCore";

const COCKTAILS = ["Pièces salées classiques", "Cocktail végétal premium", "Brunch du soir"];
const MAINS = ["Volaille rôtie", "Poisson de fête", "Menu végétarien signature"];
const DESSERTS = ["Pièce montée légère", "Buffet de desserts", "Assiette contemporaine"];

function Surface({ children, className = "" }) {
  return <section className={`rounded-[30px] border border-black/8 bg-white shadow-[0_18px_48px_rgba(12,12,12,0.06)] ${className}`}>{children}</section>;
}

function SelectGroup({ label, options, value, onChange }) {
  return (
    <label className="block">
      <span className="aime-label text-zinc-500">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="mt-2 w-full rounded-[18px] border border-black/8 bg-white px-4 py-3 text-sm text-zinc-900">
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

export default function MenuBuilderPage() {
  const state = useMemo(() => readWeddingState(), []);
  const budget = useMemo(() => getBudgetSummary(state), [state]);
  const guests = useMemo(() => getGuestSummary(state), [state]);
  const caterer = useMemo(() => getVendorMarketplace(state, "catering")[0], [state]);
  const [cocktail, setCocktail] = useState(COCKTAILS[0]);
  const [main, setMain] = useState(MAINS[0]);
  const [dessert, setDessert] = useState(DESSERTS[0]);

  const estimatedPerGuest = 78 + (cocktail === COCKTAILS[1] ? 8 : 0) + (main === MAINS[1] ? 6 : main === MAINS[2] ? 4 : 0) + (dessert === DESSERTS[1] ? 3 : 0);
  const estimatedTotal = estimatedPerGuest * guests.confirmed;

  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] text-[var(--color-text-primary)] overflow-x-hidden">
      <div className="mx-auto max-w-[1320px] px-5 pb-12 pt-24 md:px-8 md:pb-16 lg:px-10">
        <div className="mb-8 md:mb-10">
          <WeddingModuleHeader
            universeId="demeter"
            eyebrow="Déméter · composition menu"
            title="Composer la réception, sans casser le budget."
            description="Le builder de menu lie choix culinaires, contraintes invités et enveloppe du dîner."
            stats={[
              { label: "Confirmés", value: guests.confirmed, detail: "présents au dîner" },
              { label: "Régimes", value: guests.allergies + guests.vegetarian + guests.children, detail: "spéciaux" },
              { label: "Coût estimé", value: `${estimatedTotal.toLocaleString("fr-FR")} €`, detail: `${estimatedPerGuest} €/invité` },
            ]}
            actions={[
              { to: "/budget", label: "Voir le budget" },
              { to: "/prestataires/registre?category=catering", label: "Voir le traiteur" },
            ]}
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <Surface className="p-5 md:p-6">
            <div className="aime-label text-zinc-500 mb-2">Builder</div>
            <h2 className="text-[1.55rem] md:text-[1.8rem] font-display text-zinc-950">Composer le menu</h2>
            <div className="mt-5 space-y-4">
              <SelectGroup label="Cocktail" options={COCKTAILS} value={cocktail} onChange={setCocktail} />
              <SelectGroup label="Plat principal" options={MAINS} value={main} onChange={setMain} />
              <SelectGroup label="Dessert" options={DESSERTS} value={dessert} onChange={setDessert} />
            </div>
          </Surface>

          <Surface className="p-5 md:p-6">
            <div className="aime-label text-zinc-500 mb-2">Impact</div>
            <h2 className="text-[1.55rem] md:text-[1.8rem] font-display text-zinc-950">Lecture service & budget</h2>
            <div className="mt-5 space-y-3 text-sm text-zinc-600">
              <div className="rounded-[20px] border border-black/8 bg-[var(--color-warm-white)] p-4">Traiteur principal : <strong className="text-zinc-900">{caterer?.name || "Maison Aurore"}</strong></div>
              <div className="rounded-[20px] border border-black/8 bg-[var(--color-warm-white)] p-4">Invités confirmés : <strong className="text-zinc-900">{guests.confirmed}</strong></div>
              <div className="rounded-[20px] border border-black/8 bg-[var(--color-warm-white)] p-4">Allergies / végétariens / enfants : <strong className="text-zinc-900">{guests.allergies} / {guests.vegetarian} / {guests.children}</strong></div>
              <div className="rounded-[20px] border border-black/8 bg-[var(--color-warm-white)] p-4">Budget restant global : <strong className="text-zinc-900">{budget.remaining.toLocaleString("fr-FR")} €</strong></div>
            </div>
          </Surface>
        </div>
      </div>
    </div>
  );
}
