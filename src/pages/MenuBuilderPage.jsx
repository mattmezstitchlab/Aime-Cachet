import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Info } from "lucide-react";
import { getGuestSummary, readWeddingState } from "@/lib/aimeWeddingCore";

function DemeterTopBar() {
  return (
    <header className="rounded-[22px] border border-black/6 bg-white shadow-[0_12px_32px_rgba(12,12,12,0.04)] overflow-hidden">
      <div className="px-6 md:px-10 py-6 border-b border-black/8 flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-display text-[2rem] leading-none text-zinc-950">AIME WEDDING</Link>
          <span className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Déméter</span>
        </div>
        <nav className="hidden md:flex items-center gap-10 text-[15px] text-zinc-800">
          <Link to="/point-zero" className="text-zinc-700">Le Projet</Link>
          <Link to="/invites?role=planner" className="text-zinc-700">Invités</Link>
          <Link to="/univers/hestia/plan-de-table" className="text-zinc-700">Plan de Table</Link>
          <Link to="/univers/demeter/menu" className="relative font-medium text-zinc-950">Menu<span className="absolute left-1/2 -translate-x-1/2 -bottom-4 h-[2px] w-8 rounded-full bg-black" /></Link>
        </nav>
        <div className="text-sm text-zinc-500">Déméter <span className="mx-2">›</span> <span className="text-zinc-900">Menu</span></div>
      </div>
    </header>
  );
}

function MetricCard({ label, value, detail }) {
  return (
    <div className="rounded-[20px] border border-black/8 bg-white p-6 shadow-[0_10px_28px_rgba(12,12,12,0.03)]">
      <div className="text-[12px] uppercase tracking-[0.16em] text-zinc-500">{label}</div>
      <div className="mt-4 font-display text-[2.6rem] text-zinc-950">{value}</div>
      {detail && <div className="mt-2 text-sm text-zinc-500">{detail}</div>}
    </div>
  );
}

function WineCard({ title, bottles, note, image }) {
  return (
    <div className="rounded-[22px] border border-black/8 bg-white overflow-hidden shadow-[0_10px_28px_rgba(12,12,12,0.03)]">
      <img src={image} alt={title} className="h-[260px] w-full object-cover" />
      <div className="p-5">
        <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">{title.split(" ")[0]}</div>
        <div className="mt-3 font-display text-[2rem] text-zinc-950">{title}</div>
        <div className="mt-2 text-sm text-zinc-600">{bottles} bouteilles</div>
        <div className="mt-4 text-sm text-zinc-500 leading-relaxed">{note}</div>
      </div>
    </div>
  );
}

export default function MenuBuilderPage() {
  const state = useMemo(() => readWeddingState(), []);
  const guests = useMemo(() => getGuestSummary(state), [state]);

  return (
    <div className="min-h-screen bg-[#efefeb] overflow-x-hidden text-[var(--color-text-primary)]">
      <div className="min-h-screen p-2 md:p-6">
        <div className="mx-auto max-w-[1600px] rounded-[24px] bg-[#fbfaf7] shadow-[0_24px_70px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="p-3 md:p-4">
            <DemeterTopBar />
          </div>

          <section className="px-6 md:px-10 lg:px-16 pt-12 pb-16 text-center">
            <h1 className="font-display text-[3.4rem] md:text-[5rem] leading-[0.94] text-zinc-950">Composition du menu</h1>
            <p className="mt-5 text-[17px] text-zinc-600">Créez le repas parfait pour vos invités</p>
          </section>

          <section className="bg-[#f5f0e4] border-t border-b border-[#dccda8] px-6 md:px-10 lg:px-16 py-16 text-center">
            <div className="inline-flex rounded-full bg-[#efe6d5] px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-[#a88f5f]">Dégustation principale</div>
            <h2 className="mt-6 font-display text-[3rem] md:text-[4.2rem] leading-[0.96] text-zinc-950">Le Menu du Jour</h2>
            <p className="mt-4 text-[17px] text-zinc-600">Une partition gastronomique de saison, raffinée et mémorable</p>

            <div className="mt-12 mx-auto max-w-[780px] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.08)] border-t-[6px] border-[#8f6a20] p-10 md:p-14">
              <div className="text-[11px] uppercase tracking-[0.18em] text-[#9c8f72]">Maison gastronomique</div>
              <div className="mt-5 text-[11px] uppercase tracking-[0.18em] text-zinc-500">Cocktail</div>
              <div className="mt-4 font-display text-[1.6rem] text-zinc-950 leading-relaxed">Verrines de saumon fumé & crème d'aneth<br />Tartare de tomates anciennes au basilic<br />Mini brochettes de gambas</div>
              <div className="my-8 text-[#b9a47b] text-[1.5rem]">✧</div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">Entrée</div>
              <div className="mt-4 font-display text-[2rem] text-zinc-950">Ravioles de homard, bisque légère</div>
              <div className="my-8 text-[#b9a47b] text-[1.5rem]">✧</div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">Plat</div>
              <div className="mt-4 font-display text-[2rem] text-zinc-950">Filet de bœuf Rossini, jus truffé</div>
              <div className="mt-2 text-[17px] text-zinc-500">Écrasé de pommes de terre à la truffe & légumes de saison rôtis</div>
              <div className="my-8 text-[#b9a47b] text-[1.5rem]">✧</div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">Fromages</div>
              <div className="mt-4 font-display text-[2rem] text-zinc-950">Sélection affinée du maître fromager</div>
              <div className="my-8 text-[#b9a47b] text-[1.5rem]">✧</div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">Dessert</div>
              <div className="mt-4 font-display text-[2rem] text-zinc-950">Pièce montée traditionnelle</div>
              <div className="mt-2 text-[17px] text-zinc-500">Mignardises & café gourmand</div>
            </div>

            <button className="mt-10 rounded-full bg-[#b39262] px-8 py-4 text-[15px] uppercase tracking-[0.08em] text-white hover:bg-[#a78656] inline-flex items-center gap-2">
              Modifier le menu
              <ArrowRight className="h-4 w-4" />
            </button>
          </section>

          <section className="px-6 md:px-10 lg:px-16 py-18 text-center bg-white">
            <div className="inline-flex rounded-full bg-[#f2ede2] px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-[#a88f5f]">Besoins spécifiques</div>
            <h2 className="mt-6 font-display text-[3rem] md:text-[4rem] text-zinc-950">Régimes & Allergies</h2>
            <p className="mt-4 text-[17px] text-zinc-600">Une attention particulière portée à chaque exigence de vos convives</p>
            <div className="mt-10 h-px w-14 bg-[#c9b48e] mx-auto" />

            <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4 text-left">
              <MetricCard label="Sans gluten" value="8" detail="invités" />
              <MetricCard label="Végétarien" value="12" detail="invités" />
              <MetricCard label="Vegan" value="3" detail="invités" />
              <MetricCard label="Allergies fruits à coque" value="5" detail="invités" />
            </div>

            <div className="mt-10 rounded-[22px] border border-black/8 bg-white shadow-[0_10px_28px_rgba(12,12,12,0.03)] overflow-hidden text-left">
              <div className="px-6 py-5 border-b border-black/8 flex items-center justify-between gap-4">
                <div className="font-display text-[1.9rem] text-zinc-950">Détails des signalements (Hestia)</div>
                <button className="rounded-full border border-black/14 bg-white px-5 py-3 text-sm text-zinc-800 hover:bg-black/[0.03]">Exporter la liste</button>
              </div>
              <div className="hidden md:grid grid-cols-[1.1fr_0.9fr_0.9fr_1.4fr] gap-4 px-6 py-4 text-[11px] uppercase tracking-[0.16em] text-zinc-500 border-b border-black/8 bg-[#fbfaf7]">
                <div>Invité</div>
                <div>Placement</div>
                <div>Régime / Allergie</div>
                <div>Notes de préparation</div>
              </div>
              {[
                ["Hélène de Montaigne", "Table d'Honneur", "Sans Gluten", "Allergie sévère, coeliaque"],
                ["Sébastien Varin", "Table Rivoli", "Végétarien", "Pas de poisson"],
                ["Clara Bellanger", "Table Concorde", "Vegan", "Menu entièrement végétalien"],
                ["Jean-Roch Allard", "Table Louvre", "Allergie Fruits à coque", "Traces de noisettes/amandes"],
                ["Isabelle Moreau", "Table Opéra", "Végétarien", "Menu standard végétarien"],
              ].map((row) => (
                <div key={row[0]} className="grid md:grid-cols-[1.1fr_0.9fr_0.9fr_1.4fr] gap-4 px-6 py-5 border-b border-black/8 last:border-b-0 text-sm items-center">
                  <div className="font-medium text-zinc-950">{row[0]}</div>
                  <div className="text-zinc-600">{row[1]}</div>
                  <div><span className="rounded-full bg-[#f2ede2] px-3 py-1.5 text-[12px] text-[#9a8458]">{row[2]}</span></div>
                  <div className="text-zinc-600">{row[3]}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="px-6 md:px-10 lg:px-16 py-16 bg-[#fbfaf7] border-t border-black/6">
            <div className="inline-flex rounded-full bg-[#f2ede2] px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-[#a88f5f]">Le vignoble</div>
            <h2 className="mt-6 font-display text-[3rem] md:text-[4rem] text-zinc-950">Carte des Vins & Boissons</h2>
            <p className="mt-4 text-[17px] text-zinc-600">La sélection de nectars prestigieux pour accompagner chaque plat</p>
            <div className="mt-10 h-px w-14 bg-[#c9b48e]" />

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              <WineCard title="Dom Pérignon 2015" bottles={24} note="Bulles d'une finesse incomparable pour le cocktail d'honneur et la découpe du gâteau." image="/landing/poseidon.jpg" />
              <WineCard title="Chablis Premier Cru 2020" bottles={18} note="Des notes minérales et d'agrumes pour accompagner à merveille les ravioles de homard." image="/landing/demeter.jpg" />
              <WineCard title="Saint-Émilion Grand Cru 2018" bottles={20} note="Un millésime charpenté et soyeux, idéal sur le filet de bœuf Rossini." image="/landing/dionysos.jpg" />
            </div>

            <div className="mt-10 rounded-[22px] border border-black/8 bg-white p-6 shadow-[0_10px_28px_rgba(12,12,12,0.03)]">
              <div className="flex items-start justify-between gap-6 flex-wrap">
                <div className="inline-flex items-center gap-2 text-zinc-800"><Info className="h-4 w-4" />Quantités recommandées pour 220 invités</div>
                <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Données estimées par notre sommelier</div>
              </div>
              <div className="mt-6 space-y-5 text-sm text-zinc-700">
                <div>
                  <div className="flex items-center justify-between gap-4"><span>Champagne (Cocktail & Dessert)</span><span>95 bouteilles recommandées / 62 réservées</span></div>
                  <div className="mt-2 h-2 rounded-full bg-black/8 overflow-hidden"><div className="h-full bg-[#a88f5f]" style={{ width: "65%" }} /></div>
                </div>
                <div>
                  <div className="flex items-center justify-between gap-4"><span>Vins blancs (Entrées & Fromages)</span><span>55 bouteilles recommandées / 33 réservées</span></div>
                  <div className="mt-2 h-2 rounded-full bg-black/8 overflow-hidden"><div className="h-full bg-[#a88f5f]" style={{ width: "60%" }} /></div>
                </div>
                <div>
                  <div className="flex items-center justify-between gap-4"><span>Vins rouges (Plat principal)</span><span>75 bouteilles recommandées / 50 réservées</span></div>
                  <div className="mt-2 h-2 rounded-full bg-black/8 overflow-hidden"><div className="h-full bg-[#a88f5f]" style={{ width: "70%" }} /></div>
                </div>
              </div>
            </div>
          </section>

          <section className="px-6 md:px-10 lg:px-16 py-16 bg-white border-t border-black/6 text-center">
            <div className="inline-flex rounded-full bg-[#f2ede2] px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-[#a88f5f]">Gestion financière</div>
            <h2 className="mt-6 font-display text-[3rem] md:text-[4rem] text-zinc-950">Budget Traiteur & Prestations</h2>
            <p className="mt-4 text-[17px] text-zinc-600">Suivi financier et validation de la proposition culinaire</p>
            <div className="mt-10 h-px w-14 bg-[#c9b48e] mx-auto" />

            <div className="mt-12 rounded-[22px] border border-black/8 bg-white shadow-[0_10px_28px_rgba(12,12,12,0.03)] overflow-hidden text-left">
              <div className="grid md:grid-cols-[1fr_1fr_1fr_auto] gap-4 items-center px-6 py-6">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Total prestation traiteur</div>
                  <div className="mt-4 font-display text-[2.6rem] text-zinc-950">8 500 €</div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Budget par invité</div>
                  <div className="mt-4 font-display text-[2.6rem] text-zinc-950">38,60 €</div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Statut du devis</div>
                  <div className="mt-4 inline-flex rounded-full bg-[#edf4ef] px-4 py-2 text-sm text-[#5f7f68]">● Devis signé</div>
                </div>
                <div className="justify-self-end">
                  <button className="rounded-full border border-black/14 bg-white px-6 py-4 text-sm text-zinc-800 hover:bg-black/[0.03]">Consulter le devis</button>
                </div>
              </div>
            </div>
          </section>

          <footer className="bg-[#111111] text-white px-6 md:px-10 lg:px-16 py-12">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="font-display text-[2rem]">AIME WEDDING</div>
              <div className="flex flex-wrap items-center gap-8 text-white/72">
                <span>Instagram</span>
                <span>Pinterest</span>
                <span>Journal</span>
                <span>Atelier</span>
              </div>
            </div>
            <div className="mt-10 border-t border-white/10 pt-6 flex flex-wrap items-center justify-between gap-4 text-sm text-white/48">
              <div>© 2025 AIME Wedding. Tous droits réservés.</div>
              <div>Mentions Légales | Politique de confidentialité</div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
