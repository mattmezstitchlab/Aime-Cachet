import React, { useMemo, useState } from "react";
import WeddingWorkspaceTopBar from "@/components/aime/WeddingWorkspaceTopBar";
import { readWeddingState } from "@/lib/aimeWeddingCore";

const ATELIER_ITEMS = [
  { id: "gifts", label: "Liste de Mariage", to: "/univers/hephaistos/liste-mariage" },
  { id: "site", label: "Site Web Invités", to: "/univers/hephaistos/site-web" },
  { id: "rsvp", label: "Invitations & RSVP", to: "/univers/hestia/rsvp?code=AIME-2027" },
  { id: "budget", label: "Budgets & Planning", to: "/univers/zeus/budget" },
];

const THEMES = [
  ["Classique d'Atelier", "Serif traditionnel, crème et noir"],
  ["Moderne Épuré", "Sans-serif géométrique, blanc pur"],
  ["Bohème Romantique", "Knitwear, terracotta, écriture manuscrite"],
  ["Minimaliste Chic", "Fines bordures, contrastes élevés"],
];

const ACCENTS = ["#111111", "#d1af3c", "#c86d6d", "#6d8f3b", "#4f3558"];

function SwitchRow({ label, checked, onToggle }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-black/8 last:border-b-0">
      <div className="text-[16px] text-zinc-900">{label}</div>
      <button onClick={onToggle} className={`h-7 w-7 rounded-full border ${checked ? "border-black bg-black text-white" : "border-black/12 bg-white"}`}>{checked ? "✓" : ""}</button>
    </div>
  );
}

export default function WeddingSiteBuilderPage() {
  const state = useMemo(() => readWeddingState(), []);
  const [theme, setTheme] = useState(THEMES[0][0]);
  const [activeSections, setActiveSections] = useState({ histoire: true, lieu: true, programme: true, rsvp: true, dress: true, galerie: false, liste: false });

  const toggleSection = (key) => setActiveSections((current) => ({ ...current, [key]: !current[key] }));

  return (
    <div className="min-h-screen bg-[#efefeb] overflow-x-hidden text-[var(--color-text-primary)]">
      <div className="min-h-screen p-2 md:p-6">
        <div className="mx-auto max-w-[1600px] rounded-[24px] bg-[#fbfaf7] shadow-[0_24px_70px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="p-3 md:p-4">
            <WeddingWorkspaceTopBar items={ATELIER_ITEMS} active="site" brand="AIME WEDDING" suffix="ATELIER" names={`Espace ${state.meta?.couple || "Sophie & Thomas"}`} avatarImage="/landing/hero-aime-wedding.jpg" />
          </div>

          <div className="px-6 md:px-10 lg:px-16 pt-6 md:pt-8 pb-16">
            <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Héphaïstos › <span className="text-zinc-900">Votre site de mariage</span></div>
            <h1 className="mt-5 font-display text-[3.2rem] md:text-[4.8rem] leading-[0.94] text-zinc-950">Votre site de mariage</h1>
            <p className="mt-3 text-[18px] text-zinc-600">sophie-et-thomas.aimewedding.com</p>

            <section className="mt-10">
              <div className="rounded-[28px] overflow-hidden border border-black/8 bg-white shadow-[0_12px_30px_rgba(12,12,12,0.03)]">
                <div className="bg-white border-b border-black/8 px-4 py-3 flex items-center justify-center relative">
                  <div className="absolute left-4 flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-[#ff6b6b]" />
                    <span className="h-3 w-3 rounded-full bg-[#ffd166]" />
                    <span className="h-3 w-3 rounded-full bg-[#7ad27d]" />
                  </div>
                  <div className="rounded-full bg-[#fbfaf7] px-6 py-2 text-sm text-zinc-500">sophie-et-thomas.aimewedding.com</div>
                </div>
                <div className="relative min-h-[540px] overflow-hidden">
                  <img src="/landing/hero-aime-wedding.jpg" alt="Site preview" className="absolute inset-0 h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.12),rgba(0,0,0,0.35))]" />
                  <div className="absolute left-10 top-10 text-white text-[2rem] font-display">S & T</div>
                  <div className="absolute right-10 top-10 flex items-center gap-8 text-sm text-white/92 uppercase tracking-[0.08em]">
                    <span>Notre histoire</span><span>Le lieu</span><span>Le programme</span><span>RSVP</span>
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 text-white">
                    <div className="font-display text-[4rem] md:text-[5.5rem] leading-[0.94]">{state.meta?.couple || "Sophie & Thomas"}</div>
                    <div className="mt-6 text-[1.5rem] uppercase tracking-[0.12em]">{new Date(state.meta?.date || "2026-09-26").toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" }).toUpperCase()} — CHÂTEAU DE COPPET</div>
                    <div className="absolute left-10 bottom-10 text-left">
                      <div className="text-[11px] uppercase tracking-[0.16em] text-white/72">Lieu de la réception</div>
                      <div className="mt-2 font-display text-[2rem]">Le Grand Salon, Coppet</div>
                    </div>
                    <div className="absolute right-10 bottom-10 text-right">
                      <div className="text-[1.8rem] font-display">124</div>
                      <div className="text-[11px] uppercase tracking-[0.16em]">jours</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-center">
                <button className="rounded-full bg-black px-6 py-4 text-sm text-white hover:bg-zinc-800">Voir le site en ligne ⤢</button>
              </div>
            </section>

            <section className="mt-10 grid gap-6 xl:grid-cols-[0.94fr_1.06fr]">
              <div className="space-y-6">
                <div className="rounded-[24px] border border-black/8 bg-white p-6 shadow-[0_10px_28px_rgba(12,12,12,0.03)]">
                  <div className="font-display text-[2rem] text-zinc-950">Choisir un Thème</div>
                  <div className="mt-6 space-y-3">
                    {THEMES.map(([label, text]) => (
                      <button key={label} onClick={() => setTheme(label)} className={`w-full rounded-[18px] border px-5 py-5 text-left ${theme === label ? "border-black bg-white" : "border-black/8 bg-white"}`}>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="font-medium text-zinc-950">{label}</div>
                            <div className="mt-1 text-sm text-zinc-500">{text}</div>
                          </div>
                          <span className={`h-7 w-7 rounded-full border ${theme === label ? "border-black bg-black text-white" : "border-black/10 bg-white"}`}>{theme === label ? "✓" : ""}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-[24px] border border-black/8 bg-white p-6 shadow-[0_10px_28px_rgba(12,12,12,0.03)]">
                  <div className="font-display text-[2rem] text-zinc-950">Couleur d'accentuation</div>
                  <div className="mt-6 flex items-center gap-4 flex-wrap">
                    {ACCENTS.map((color) => <span key={color} className="h-12 w-12 rounded-full border border-black/8" style={{ background: color }} />)}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-[24px] border border-black/8 bg-white p-6 shadow-[0_10px_28px_rgba(12,12,12,0.03)]">
                  <div className="font-display text-[2rem] text-zinc-950">Photo de couverture</div>
                  <div className="mt-6 flex items-start gap-5">
                    <img src="/landing/hero-aime-wedding.jpg" alt="cover" className="h-28 w-28 rounded-[18px] object-cover" />
                    <div>
                      <div className="text-zinc-700">Fichier actuel : sophie-thomas-hero.jpg</div>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <button className="rounded-full border border-black/12 bg-white px-4 py-2 text-sm text-zinc-700">Remplacer</button>
                        <button className="rounded-full bg-[#fde8e8] px-4 py-2 text-sm text-[#d57272]">Supprimer</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-black/8 bg-white p-6 shadow-[0_10px_28px_rgba(12,12,12,0.03)]">
                  <div className="font-display text-[2rem] text-zinc-950">Sections actives</div>
                  <div className="mt-6">
                    <SwitchRow label="Notre histoire" checked={activeSections.histoire} onToggle={() => toggleSection("histoire")} />
                    <SwitchRow label="Le lieu" checked={activeSections.lieu} onToggle={() => toggleSection("lieu")} />
                    <SwitchRow label="Le programme" checked={activeSections.programme} onToggle={() => toggleSection("programme")} />
                    <SwitchRow label="RSVP" checked={activeSections.rsvp} onToggle={() => toggleSection("rsvp")} />
                    <SwitchRow label="Dress code" checked={activeSections.dress} onToggle={() => toggleSection("dress")} />
                    <SwitchRow label="Galerie photos" checked={activeSections.galerie} onToggle={() => toggleSection("galerie")} />
                    <SwitchRow label="Liste de mariage" checked={activeSections.liste} onToggle={() => toggleSection("liste")} />
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-10 rounded-[24px] border border-black/8 bg-white p-6 shadow-[0_10px_28px_rgba(12,12,12,0.03)]">
              <div className="font-display text-[2rem] text-zinc-950">Éditer le contenu du site</div>
              <div className="mt-6 space-y-5">
                <label className="block">
                  <span className="text-[11px] uppercase tracking-[0.16em] text-zinc-600">Notre histoire (texte)</span>
                  <textarea rows={4} defaultValue="Nous nous sommes rencontrés un soir de décembre 2019 à Paris, sous les premiers flocons de neige de la saison..." className="mt-3 w-full rounded-[14px] border border-black/8 bg-[#fbf5ed] px-4 py-4 text-[15px] text-zinc-900 outline-none resize-none" />
                </label>
                <label className="block">
                  <span className="text-[11px] uppercase tracking-[0.16em] text-zinc-600">Message d'accueil (introduction)</span>
                  <textarea rows={3} defaultValue="Nous avons hâte de partager ce jour unique avec vous." className="mt-3 w-full rounded-[14px] border border-black/8 bg-[#fbf5ed] px-4 py-4 text-[15px] text-zinc-900 outline-none resize-none" />
                </label>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="text-[11px] uppercase tracking-[0.16em] text-zinc-600">Lieu principal</span>
                    <input defaultValue="Château de Coppet, Suisse" className="mt-3 w-full rounded-[14px] border border-black/8 bg-[#fbf5ed] px-4 py-4 text-[15px] text-zinc-900 outline-none" />
                  </label>
                  <label className="block">
                    <span className="text-[11px] uppercase tracking-[0.16em] text-zinc-600">Horaires d'arrivée</span>
                    <input defaultValue="Samedi 26 Septembre — Dès 15h30" className="mt-3 w-full rounded-[14px] border border-black/8 bg-[#fbf5ed] px-4 py-4 text-[15px] text-zinc-900 outline-none" />
                  </label>
                </div>
                <button className="w-full rounded-full bg-black px-6 py-4 text-[15px] text-white hover:bg-zinc-800">Modifier le contenu du site →</button>
              </div>
            </section>

            <section className="mt-10 rounded-[24px] border border-black/8 bg-white p-6 shadow-[0_10px_28px_rgba(12,12,12,0.03)]">
              <div className="font-display text-[2rem] text-zinc-950">Partager votre site</div>
              <div className="mt-6 grid gap-6 md:grid-cols-[220px_1fr] items-start">
                <div className="rounded-[18px] border border-black/8 bg-[#fbfaf7] h-[180px] flex flex-col items-center justify-center text-center">
                  <div className="h-20 w-20 rounded-[18px] border border-black/8 grid grid-cols-2 gap-2 p-2">
                    <span className="bg-black rounded-[4px]" />
                    <span className="bg-white border border-black/8 rounded-[4px]" />
                    <span className="bg-black rounded-[4px]" />
                    <span className="bg-[#d1af3c] rounded-[4px]" />
                  </div>
                  <div className="mt-4 text-sm text-zinc-500 uppercase tracking-[0.16em]">QR code du site</div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-600">URL personnalisée sécurisée</div>
                  <div className="mt-3 rounded-[14px] border border-black/8 bg-[#fbf5ed] px-4 py-4 flex items-center justify-between gap-4">
                    <span className="text-[15px] text-zinc-950">sophie-et-thomas.aimewedding.com</span>
                    <button className="rounded-full border border-black/12 bg-white px-4 py-2 text-sm text-zinc-700">Copier</button>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button className="rounded-full bg-black px-5 py-3 text-sm text-white hover:bg-zinc-800">Copier le lien ⧉</button>
                    <button className="rounded-full border border-black/12 bg-white px-5 py-3 text-sm text-zinc-700 hover:bg-black/[0.03]">Télécharger le QR Code ↓</button>
                    <button className="rounded-full border border-black/12 bg-white px-5 py-3 text-sm text-zinc-700 hover:bg-black/[0.03]">Partager par email ✉</button>
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
