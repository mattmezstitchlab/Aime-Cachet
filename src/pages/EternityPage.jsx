import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Play, Star, Upload } from "lucide-react";
import { readWeddingState } from "@/lib/aimeWeddingCore";

const PERSPECTIVES = [
  { label: "Témoin", title: "Vue de Marie", image: "/landing/apollon.jpg" },
  { label: "Père", title: "Vue de Papa", image: "/landing/hero-aime-wedding.jpg" },
  { label: "Amie", title: "Vue de Léa", image: "/landing/hestia.jpg" },
  { label: "Cuisine", title: "Vue de Chef Antoine", image: "/landing/demeter.jpg" },
  { label: "Dancefloor", title: "Vue de DJ Max", image: "/landing/dionysos.jpg" },
  { label: "Jeux", title: "Vue des enfants", image: "/landing/artemis.jpg" },
];

const MOSAIC = [
  { badge: "Émotion", time: "11:32", title: "Le OUI de Sophie", subtitle: "12 angles capturés · Voir tous les angles →", image: "/landing/hero-aime-wedding.jpg" },
  { badge: "Fou rire", time: "13:05", title: "Le vol de Thomas", subtitle: "8 perspectives · Voir tous les angles →", image: "/landing/dionysos.jpg" },
  { badge: "Toast", time: "18:40", title: "Cascade d'Or", subtitle: "6 angles capturés · Voir tous les angles →", image: "/landing/poseidon.jpg" },
  { badge: "Tendresse", time: "21:15", title: "La première danse", subtitle: "15 angles capturés · Voir tous les angles →", image: "/landing/apollon.jpg" },
  { badge: "Surprise", time: "22:30", title: "Pièce Montée", subtitle: "4 angles capturés · Voir tous les angles →", image: "/landing/hephaistos.jpg" },
];

const CAPSULES = [
  { title: "Jour J", status: "OUVERT", detail: "42 messages scellés et désormais consultables", hint: "Papa : Ma fille, aujourd'hui tu commences le plus beau des voyages..." },
  { title: "1 An", status: "SCELLÉ", detail: "18 prédictions scellées par les invités", hint: "Ouverture le 14 juin 2026. L'IA compilera un rapport de justesse des prédictions !" },
  { title: "5 Ans · Noces de Bois", status: "SCELLÉ", detail: "8 vœux précieux d'avenir scellés", hint: "Ouverture le 14 juin 2030" },
  { title: "10 Ans · Noces d'Étain", status: "SCELLÉ", detail: "12 lettres d'amour profondes de vos proches", hint: "Ouverture le 14 juin 2035" },
  { title: "25 Ans · Noces d'Argent", status: "GRAND SCEAU", detail: "La Grande Lettre · Scellée par les mariés eux-mêmes", hint: "Ouverture programmée le 14 juin 2050" },
];

const STORIES = [
  {
    title: "14 sept 2025 · 3 mois de mariage",
    text: "Premier dîner dans notre nouvel appartement. On utilise enfin la vaisselle offerte par Mamie ! Que du bonheur.",
    reactions: "24 réactions d'invités",
    image: "/landing/demeter.jpg",
  },
  {
    title: "14 déc 2025 · 6 mois de mariage",
    text: "Notre premier Noël en tant que couple marié. On s'est envolés pour un week-end magique à Prague sous la neige.",
    reactions: "Visible par les invités",
    image: "/landing/zeus.jpg",
  },
  {
    title: "14 juin 2026 · 1 an de mariage 🎂",
    text: "Premier anniversaire — La capsule 1 an s'ouvre officiellement ! Les 18 prédictions faites par vos invités le soir du mariage sont désormais révélées au grand jour. Préparez-vous à rire et à vous souvenir.",
    reactions: "Événement Capsule",
    image: "/landing/athena.jpg",
  },
];

function StatCard({ value, label }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.05] p-8 text-center min-w-[220px]">
      <div className="font-display text-[4rem] text-[#d8b27a]">{value}</div>
      <div className="mt-4 text-white/68 text-lg">{label}</div>
    </div>
  );
}

function DarkHeader() {
  return (
    <header className="px-8 md:px-12 py-8 border-b border-white/10 flex items-center justify-between gap-6">
      <div className="font-display text-[2.1rem] text-white">AIME WEDDING</div>
      <nav className="hidden md:flex items-center gap-10 text-[15px] text-white/72">
        <Link to="/a-propos">Le Concept</Link>
        <Link to="/univers/hephaistos/site-web">L'Atelier</Link>
        <Link to="/compte/maries">Nos Temples</Link>
        <Link to="/mode-emploi">Histoires</Link>
        <span className="rounded-full border border-[#c6a866] px-4 py-2 text-[#f0d29d] inline-flex items-center gap-2"><Star className="h-4 w-4" />L'Éternité</span>
      </nav>
    </header>
  );
}

export default function EternityPage() {
  const state = useMemo(() => readWeddingState(), []);
  const [format, setFormat] = useState("Texte");
  const [recipient, setRecipient] = useState("Les mariés");
  const [horizon, setHorizon] = useState("5 ans");

  return (
    <div className="min-h-screen bg-[#070707] overflow-x-hidden text-white">
      <div className="mx-auto max-w-[1600px] px-2 md:px-6 py-2 md:py-6">
        <div className="rounded-[24px] overflow-hidden bg-[#111111] shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
          <DarkHeader />

          <section className="px-6 md:px-12 lg:px-16 py-20 md:py-24 text-center bg-[radial-gradient(circle_at_center,rgba(210,174,112,0.14),transparent_35%)]">
            <div className="font-display text-[4rem] md:text-[6.5rem] leading-[0.92] text-[#d8b27a]">L'Éternité</div>
            <p className="mt-6 text-[22px] text-white/70">Chaque instant capturé. Chaque émotion préservée. Pour toujours.</p>
            <div className="mt-8 text-[20px] text-[#d8b27a]">{state.meta?.couple || "Sophie & Thomas"} · {new Date(state.meta?.date || "2025-06-14").toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })} · {state.meta?.venue || "Domaine des Oliviers"}</div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <button className="rounded-full bg-[linear-gradient(90deg,#d8b27a_0%,#f5dfb3_50%,#c99a5c_100%)] px-8 py-4 text-sm uppercase tracking-[0.08em] text-black">Ouvrir ma capsule →</button>
              <button className="rounded-full border border-[#7d6848] px-8 py-4 text-sm uppercase tracking-[0.08em] text-white">Contribuer un souvenir</button>
            </div>

            <div className="mt-14 rounded-[28px] overflow-hidden border border-white/10 bg-black/20 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
              <img src="/landing/hero-aime-wedding.jpg" alt="Le chef-d'œuvre du mariage" className="h-[520px] w-full object-cover opacity-70" />
              <div className="absolute left-12 bottom-12 text-left">
                <div className="text-[11px] uppercase tracking-[0.16em] text-white/62">AIME AI Film Engine</div>
                <div className="mt-3 font-display text-[2.5rem] text-white">Le Chef-d'œuvre de {state.meta?.couple || "Sophie & Thomas"}</div>
              </div>
            </div>
          </section>

          <section className="px-6 md:px-12 lg:px-16 py-20 bg-[#111111] border-t border-white/8">
            <h2 className="font-display text-[3rem] md:text-[4rem] text-[#f0e3cc]">01 · Le Film du Mariage</h2>
            <p className="mt-4 text-[19px] text-white/60">147 moments capturés par 89 invités · Assemblé par l'IA</p>

            <div className="mt-10 rounded-[28px] overflow-hidden bg-black shadow-[0_20px_50px_rgba(0,0,0,0.25)] border border-white/8 p-6 md:p-8">
              <div className="relative overflow-hidden rounded-[22px]">
                <img src="/landing/dionysos.jpg" alt="film" className="h-[620px] w-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute left-8 top-8 text-sm tracking-[0.16em] text-white/82 uppercase">SOPHIE_THOMAS_PREMIUM_4K.mp4</div>
                <div className="absolute right-8 top-8 text-sm text-white/82">12:47</div>
                <button className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-28 w-28 rounded-full bg-[linear-gradient(180deg,#f5dfb3,#d6af76)] flex items-center justify-center text-black shadow-[0_18px_40px_rgba(0,0,0,0.3)]"><Play className="h-10 w-10 ml-1" /></button>
                <div className="absolute left-8 right-8 bottom-20 h-1 bg-white/40 rounded-full">
                  <div className="h-full w-[68%] bg-[#f0d29d] rounded-full" />
                </div>
                <div className="absolute left-8 right-8 bottom-8 grid grid-cols-5 gap-4 text-white">
                  {[
                    ["Préparatifs", "09:00"],
                    ["Cérémonie", "11:30"],
                    ["Cocktail", "13:00"],
                    ["Soirée", "18:00"],
                    ["Moments volés", "22:00"],
                  ].map(([label, time]) => (
                    <div key={label} className="text-left">
                      <div className="font-medium">{label}</div>
                      <div className="mt-1 text-white/55">{time}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-10">
                <div className="text-[22px] text-[#e7cfa7]">Explorez les points de vue des invités</div>
                <div className="mt-6 grid gap-4 md:grid-cols-3 xl:grid-cols-6">
                  {PERSPECTIVES.map((item) => (
                    <div key={item.title} className="relative overflow-hidden rounded-[18px] border border-white/10 bg-white/[0.03]">
                      <img src={item.image} alt={item.title} className="h-[190px] w-full object-cover opacity-90" />
                      <div className="absolute left-3 top-3 rounded-[8px] bg-black/50 px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] text-white">{item.label}</div>
                      <div className="absolute left-4 bottom-4 text-[1.15rem] text-white">{item.title}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 rounded-[22px] border border-white/10 bg-white/[0.03] px-6 py-6 flex flex-wrap items-center justify-between gap-6">
                <div className="flex flex-wrap items-center gap-8 text-[18px] text-white/82">
                  <div><span className="font-display text-[#d8b27a] text-[2rem]">147</span> photos</div>
                  <div><span className="font-display text-[#d8b27a] text-[2rem]">63</span> vidéos</div>
                  <div><span className="font-display text-[#d8b27a] text-[2rem]">89</span> contributeurs</div>
                  <div><span className="font-display text-[#d8b27a] text-[2rem]">12h47</span> de couverture</div>
                </div>
                <button className="rounded-full bg-[linear-gradient(90deg,#d8b27a_0%,#f5dfb3_50%,#c99a5c_100%)] px-8 py-4 text-sm uppercase tracking-[0.08em] text-black">Télécharger le film HD →</button>
              </div>
            </div>
          </section>

          <section className="px-6 md:px-12 lg:px-16 py-20 bg-[#fbfaf7] text-black">
            <div className="flex items-end justify-between gap-8 flex-wrap">
              <div>
                <h2 className="font-display text-[3rem] md:text-[4rem]">02 · La Mosaïque Émotionnelle</h2>
                <p className="mt-4 text-[19px] text-zinc-600">Chaque moment, vu par tous les regards sous toutes les perspectives</p>
              </div>
              <div className="flex flex-wrap gap-3">
                {['Tous','Cérémonie','Cocktail','Soirée','Moments volés','Par émotion'].map((item,index) => <button key={item} className={`rounded-full px-5 py-3 text-sm ${index===0?'bg-black text-white':'border border-black/12 bg-white text-zinc-800'}`}>{item}</button>)}
              </div>
            </div>

            <div className="mt-10 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="relative overflow-hidden rounded-[24px] bg-white shadow-[0_10px_28px_rgba(12,12,12,0.06)]"><img src={MOSAIC[0].image} alt={MOSAIC[0].title} className="h-[460px] w-full object-cover" /><div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.38))]" /><div className="absolute left-5 top-5 rounded-full bg-white/95 px-3 py-1 text-[11px] text-[#c26497]">🙂 {MOSAIC[0].badge}</div><div className="absolute right-5 top-5 text-white/82">{MOSAIC[0].time}</div><div className="absolute left-6 bottom-6 text-white"><div className="font-display text-[2rem]">{MOSAIC[0].title}</div><div className="mt-2 text-white/82">{MOSAIC[0].subtitle}</div></div></div>
              <div className="grid gap-4">
                <div className="relative overflow-hidden rounded-[24px] bg-white shadow-[0_10px_28px_rgba(12,12,12,0.06)]"><img src={MOSAIC[1].image} alt={MOSAIC[1].title} className="h-[220px] w-full object-cover" /><div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.32))]" /><div className="absolute left-5 top-5 rounded-full bg-white/95 px-3 py-1 text-[11px] text-[#c8a03b]">😂 {MOSAIC[1].badge}</div><div className="absolute right-5 top-5 text-white/82">{MOSAIC[1].time}</div><div className="absolute left-6 bottom-6 text-white"><div className="font-display text-[2rem]">{MOSAIC[1].title}</div><div className="mt-2 text-white/82">{MOSAIC[1].subtitle}</div></div></div>
                <div className="grid gap-4 md:grid-cols-3">
                  {MOSAIC.slice(2).map((item) => (
                    <div key={item.title} className="relative overflow-hidden rounded-[24px] bg-white shadow-[0_10px_28px_rgba(12,12,12,0.06)]"><img src={item.image} alt={item.title} className="h-[250px] w-full object-cover" /><div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.36))]" /><div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[11px] text-[#c26497]">{item.badge}</div><div className="absolute right-4 top-4 text-white/82 text-sm">{item.time}</div><div className="absolute left-5 bottom-5 text-white"><div className="font-display text-[1.5rem]">{item.title}</div><div className="mt-2 text-white/82 text-sm">{item.subtitle}</div></div></div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="px-6 md:px-12 lg:px-16 py-20 bg-[#fbfaf7] text-black border-t border-black/6">
            <div className="grid gap-8 xl:grid-cols-[0.96fr_1.04fr] items-start">
              <div>
                <h2 className="font-display text-[3rem] md:text-[4rem]">03 · La Capsule Temporelle</h2>
                <p className="mt-4 text-[19px] text-zinc-600">Des messages scellés qui traversent le temps, offerts par vous et vos proches</p>
                <div className="mt-10 space-y-6 border-l-2 border-[#d8b27a] pl-8">
                  {CAPSULES.map((item, index) => (
                    <div key={item.title} className="relative rounded-[20px] border border-black/10 bg-white px-6 py-6 shadow-[0_8px_18px_rgba(12,12,12,0.03)]">
                      <span className={`absolute -left-[42px] top-8 h-5 w-5 rounded-full ${index===0?'bg-[#d8b27a]':'bg-[#f0ede6]'} border border-[#d8b27a]`} />
                      <div className="flex items-center gap-4 flex-wrap"><div className="font-display text-[2rem] text-zinc-950">{item.title}</div><span className={`rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.14em] ${item.status==='OUVERT'?'bg-[#e9f1ec] text-[#64896f]':item.status==='GRAND SCEAU'?'bg-[#f6e7ad] text-[#8a6b15]':'bg-[#f6f3ed] text-zinc-600'}`}>{item.status}</span></div>
                      <div className="mt-4 text-[1.15rem] text-zinc-950">{item.detail}</div>
                      <div className="mt-3 text-zinc-500 leading-relaxed">{item.hint}</div>
                      {index===0 && <button className="mt-5 text-[#b59c73] hover:text-zinc-950">Voir tous les messages →</button>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[26px] bg-[#111111] text-white p-8 shadow-[0_18px_48px_rgba(0,0,0,0.18)]">
                <div className="font-display text-[2.6rem]">Sceller un nouveau message</div>
                <p className="mt-4 text-[18px] text-white/65">Ajoutez une bouteille à la mer temporelle du couple.</p>
                <div className="mt-8 text-[11px] uppercase tracking-[0.16em] text-white/45">Format du souvenir</div>
                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  {['Vidéo','Audio','Texte'].map((item) => <button key={item} onClick={() => setFormat(item)} className={`rounded-[14px] border px-4 py-4 text-[15px] ${format===item?'border-[#c9a96e] bg-[#1b1a17] text-[#f0d29d]':'border-white/12 bg-transparent text-white/78'}`}>{item}</button>)}
                </div>
                <div className="mt-8 text-[11px] uppercase tracking-[0.16em] text-white/45">Destinataire</div>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {['Les mariés','Un invité spécifique'].map((item) => <button key={item} onClick={() => setRecipient(item)} className={`rounded-[14px] border px-4 py-4 text-[15px] ${recipient===item?'border-[#c9a96e] bg-[#1b1a17] text-[#f0d29d]':'border-white/12 bg-transparent text-white/78'}`}>{item}</button>)}
                </div>
                <div className="mt-8 text-[11px] uppercase tracking-[0.16em] text-white/45">Horizon d'ouverture</div>
                <div className="mt-3 flex flex-wrap gap-3">
                  {['1 an','5 ans','10 ans','25 ans','Perso.'].map((item) => <button key={item} onClick={() => setHorizon(item)} className={`rounded-[14px] border px-4 py-3 text-sm ${horizon===item?'border-[#c9a96e] bg-[#1b1a17] text-[#f0d29d]':'border-white/12 bg-transparent text-white/78'}`}>{item}</button>)}
                </div>
                <div className="mt-8 text-[11px] uppercase tracking-[0.16em] text-white/45">Votre message</div>
                <textarea rows={5} placeholder={`Écrivez quelque chose qui fera sourire ou pleurer de joie ${state.meta?.couple || 'Sophie & Thomas'} dans quelques années...`} className="mt-3 w-full rounded-[18px] border border-white/12 bg-[#1a1a1a] px-4 py-4 text-[15px] text-white outline-none resize-none placeholder:text-white/28" />
                <button className="mt-8 w-full rounded-full bg-[linear-gradient(90deg,#d8b27a_0%,#f5dfb3_50%,#c99a5c_100%)] px-6 py-4 text-[15px] uppercase tracking-[0.08em] text-black">Sceller dans la capsule →</button>
              </div>
            </div>
          </section>

          <section className="px-6 md:px-12 lg:px-16 py-20 bg-[#fbfaf7] text-black border-t border-black/6">
            <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr] items-start">
              <div>
                <h2 className="font-display text-[3rem] md:text-[4rem]">04 · Le Journal de l'Après</h2>
                <p className="mt-4 text-[19px] text-zinc-600">Votre histoire continue de s'écrire. Les moments marquants après le grand jour.</p>
                <div className="mt-10 space-y-6">
                  {STORIES.map((item, index) => (
                    <div key={item.title} className="rounded-[22px] border border-black/8 bg-white p-6 shadow-[0_10px_28px_rgba(12,12,12,0.03)]">
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="font-display text-[2rem] text-zinc-950">{item.title}</div>
                        <span className="rounded-full bg-[#e8eefc] px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-[#4567aa]">{item.reactions}</span>
                      </div>
                      <p className="mt-4 text-[17px] text-zinc-600 leading-relaxed">{item.text}</p>
                      <img src={item.image} alt={item.title} className="mt-6 h-[280px] w-full rounded-[18px] object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[22px] border border-black/8 bg-white p-6 shadow-[0_10px_28px_rgba(12,12,12,0.03)] xl:sticky xl:top-8">
                <div className="font-display text-[2.4rem] text-zinc-950">Ajouter une page d'histoire</div>
                <p className="mt-4 text-[17px] text-zinc-600">Un nouveau voyage ? Un projet ? Fixez-le pour toujours.</p>
                <div className="mt-6 space-y-4">
                  <input defaultValue="Aujourd'hui" className="w-full rounded-[14px] border border-black/8 bg-[#fbf5ed] px-4 py-4 text-[15px] text-zinc-900 outline-none" />
                  <input placeholder="Ex: Notre premier potager..." className="w-full rounded-[14px] border border-black/8 bg-[#fbf5ed] px-4 py-4 text-[15px] text-zinc-900 outline-none placeholder:text-zinc-400" />
                  <textarea rows={4} placeholder="Racontez l'histoire..." className="w-full rounded-[14px] border border-black/8 bg-[#fbf5ed] px-4 py-4 text-[15px] text-zinc-900 outline-none resize-none placeholder:text-zinc-400" />
                  <div className="rounded-[18px] border border-dashed border-[#d6c18f] bg-[#fffaf0] px-4 py-10 flex flex-col items-center justify-center text-center text-zinc-500">
                    <Upload className="h-6 w-6 mb-3" />
                    Glisser une image (optionnel)
                  </div>
                </div>
                <button className="mt-8 w-full rounded-full bg-black px-6 py-4 text-[15px] text-white hover:bg-zinc-800">Ajouter un souvenir →</button>
              </div>
            </div>
          </section>

          <section className="px-6 md:px-12 lg:px-16 py-20 bg-[#111111] text-white text-center border-t border-white/8">
            <h2 className="font-display text-[3rem] md:text-[4rem] text-[#f0d29d]">05 · L'Éternité en Chiffres</h2>
            <p className="mt-4 text-[19px] text-white/62">L'empreinte indélébile de votre union, analysée par nos algorithmes d'émotion</p>
            <div className="mt-12 flex justify-center"><StatCard value="100%" label="des émotions authentiques préservées" /></div>
            <div className="mt-16 max-w-4xl mx-auto font-display text-[3rem] md:text-[4.4rem] leading-[1.08] text-white">"On ne se souvient pas des jours, on se souvient des instants."</div>
            <div className="mt-6 text-[18px] text-white/52 uppercase tracking-[0.16em]">— Cesare Pavese</div>
          </section>

          <section className="px-6 md:px-12 lg:px-16 py-20 bg-[#fbfaf7] text-black">
            <h2 className="font-display text-[3rem] md:text-[4rem]">06 · Votre Contribution</h2>
            <p className="mt-4 text-[19px] text-zinc-600">Le mariage est terminé, mais l'histoire vit à travers vos archives. Ajoutez votre pierre à l'édifice.</p>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <div className="rounded-[22px] border border-black/8 bg-white p-6 shadow-[0_10px_28px_rgba(12,12,12,0.03)]">
                <div className="font-display text-[2rem] text-zinc-950">Envoyer une photo ou vidéo oubliée</div>
                <p className="mt-4 text-zinc-600">Il n'est jamais trop tard pour partager un moment, une grimace inattendue ou un éclat de lumière oublié.</p>
                <div className="mt-8 rounded-[18px] border border-dashed border-[#d6c18f] bg-[#fffaf0] px-4 py-12 flex flex-col items-center justify-center text-center text-zinc-500"><Upload className="h-6 w-6 mb-3" />Télécharger vos fichiers</div>
              </div>
              <div className="rounded-[22px] border border-black/8 bg-white p-6 shadow-[0_10px_28px_rgba(12,12,12,0.03)]">
                <div className="font-display text-[2rem] text-zinc-950">Écrire un mot d'amour</div>
                <p className="mt-4 text-zinc-600">Une anecdote de la journée, des remerciements ou un vœu précieux pour les années à venir.</p>
                <textarea rows={5} placeholder="Votre message..." className="mt-8 w-full rounded-[14px] border border-black/8 bg-[#fbf5ed] px-4 py-4 text-[15px] text-zinc-900 outline-none resize-none placeholder:text-zinc-400" />
                <button className="mt-6 w-full rounded-full bg-black px-6 py-4 text-[15px] text-white hover:bg-zinc-800">Envoyer le message</button>
              </div>
              <div className="rounded-[22px] border border-black/8 bg-white p-6 shadow-[0_10px_28px_rgba(12,12,12,0.03)]">
                <div className="font-display text-[2rem] text-zinc-950">Sceller une prédiction d'avenir</div>
                <p className="mt-4 text-zinc-600">Où seront-ils dans 10 ans ? Combien d'enfants ? Quel pays ? Amusez-vous à prédire l'avenir.</p>
                <textarea rows={5} placeholder="Je prédis que dans 10 ans, Thomas et Sophie..." className="mt-8 w-full rounded-[14px] border border-black/8 bg-[#fbf5ed] px-4 py-4 text-[15px] text-zinc-900 outline-none resize-none placeholder:text-zinc-400" />
                <button className="mt-6 w-full rounded-full bg-black px-6 py-4 text-[15px] text-white hover:bg-zinc-800">Sceller ma prédiction</button>
              </div>
            </div>
          </section>

          <footer className="bg-[#111111] text-white px-6 md:px-12 lg:px-16 py-14 border-t border-white/8">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr_0.9fr] items-start">
              <div>
                <div className="font-display text-[2.2rem]">AIME WEDDING</div>
                <p className="mt-6 max-w-md text-white/66 leading-relaxed">L'Éternité est une fonctionnalité exclusive de la suite AIME Wedding, conçue pour préserver la mémoire sacrée des grandes unions.</p>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.16em] text-white/45 mb-4">Le plateforme</div>
                <div className="space-y-3 text-white/72"><span className="block">Le Concept</span><span className="block">L'Atelier</span><span className="block">Tarifs</span><span className="block">FAQ</span></div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.16em] text-white/45 mb-4">Légal</div>
                <div className="space-y-3 text-white/72"><span className="block">Mentions Légales</span><span className="block">Confidentialité</span><span className="block">CGU</span></div>
              </div>
            </div>
            <div className="mt-12 border-t border-white/10 pt-6 flex flex-wrap items-center justify-between gap-4 text-sm text-white/48">
              <div>© 2025 AIME Wedding · L'Éternité est une marque déposée.</div>
              <div>✦ Fait avec amour pour l'Éternité</div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
