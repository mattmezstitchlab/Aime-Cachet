import React, { useMemo, useState } from "react";
import { Heart, HeartOff, ArrowRight } from "lucide-react";
import WeddingWorkspaceTopBar from "@/components/aime/WeddingWorkspaceTopBar";
import { readWeddingState } from "@/lib/aimeWeddingCore";

const NAV_ITEMS = [
  { id: "checklist", label: "Checklist (Athéna)", to: "/univers/athena/checklist" },
  { id: "messaging", label: "Messagerie (Hermès)", to: "/univers/hermes/messagerie" },
  { id: "gallery", label: "Galerie (Apollon)", to: "/univers/apollon/galerie" },
];

const FILTERS = ["Tous", "Préparatifs", "Cérémonie", "Réception", "Soirée"];
const HERO_IMAGES = [
  { src: "/landing/apollon.jpg", tall: true, liked: true },
  { src: "/landing/aphrodite.jpg", tall: false, liked: false },
  { src: "/landing/hero-aime-wedding.jpg", tall: false, liked: true },
  { src: "/landing/hestia.jpg", tall: true, liked: false },
  { src: "/landing/dionysos.jpg", tall: false, liked: true },
  { src: "/landing/zeus.jpg", tall: false, liked: false },
];

const GUEST_PHOTOS = [
  { src: "/landing/dionysos.jpg", author: "Marc L." },
  { src: "/landing/hero-aime-wedding.jpg", author: "Julie A." },
  { src: "/landing/ares.jpg", author: "Thomas M." },
  { src: "/landing/hephaistos.jpg", author: "Camille D." },
];

export default function GalleryPage() {
  const state = useMemo(() => readWeddingState(), []);
  const [filter, setFilter] = useState("Tous");

  return (
    <div className="min-h-screen bg-[#efefeb] overflow-x-hidden text-[var(--color-text-primary)]">
      <div className="min-h-screen p-2 md:p-6">
        <div className="mx-auto max-w-[1600px] rounded-[24px] bg-[#fbfaf7] shadow-[0_24px_70px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="p-3 md:p-4">
            <WeddingWorkspaceTopBar items={NAV_ITEMS} active="gallery" names={state.meta?.couple || "Sophie & Thomas"} avatarImage="/landing/hero-aime-wedding.jpg" />
          </div>

          <div className="px-6 md:px-10 lg:px-16 pb-16 pt-6 md:pt-8">
            <div className="flex items-start justify-between gap-6 flex-wrap">
              <div>
                <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Tableau de bord / Apollon / <span className="text-zinc-900">Galerie</span></div>
                <h1 className="mt-5 font-display text-[3.3rem] md:text-[4.8rem] leading-[0.94] text-zinc-950">Galerie photos</h1>
                <p className="mt-4 text-[17px] text-zinc-600">324 photos · 4 albums</p>
              </div>
              <button className="mt-4 rounded-full bg-black px-6 py-4 text-[15px] uppercase tracking-[0.06em] text-white hover:bg-zinc-800 inline-flex items-center gap-2">
                Ajouter des photos
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-10 border border-black/8 bg-white px-4 py-4 flex flex-wrap gap-3">
              {FILTERS.map((item) => (
                <button key={item} onClick={() => setFilter(item)} className={`rounded-full px-5 py-3 text-sm uppercase tracking-[0.08em] ${filter === item ? "bg-black text-white" : "bg-[var(--color-warm-white)] text-zinc-700"}`}>{item}</button>
              ))}
            </div>

            <div className="mt-10 grid gap-6 xl:grid-cols-[1.03fr_0.97fr] items-start">
              <div className="space-y-6">
                <div className="relative overflow-hidden rounded-[20px] bg-white shadow-[0_10px_28px_rgba(12,12,12,0.03)]"><img src={HERO_IMAGES[0].src} alt="gallery" className="h-[380px] w-full object-cover" /><button className="absolute right-4 top-4 h-11 w-11 rounded-full bg-white/94 flex items-center justify-center text-[#bd7d89]"><Heart className="h-5 w-5" /></button></div>
                <div className="relative overflow-hidden rounded-[20px] bg-white shadow-[0_10px_28px_rgba(12,12,12,0.03)]"><img src={HERO_IMAGES[2].src} alt="gallery" className="h-[320px] w-full object-cover" /><button className="absolute right-4 top-4 h-11 w-11 rounded-full bg-white/94 flex items-center justify-center text-[#bd7d89]"><Heart className="h-5 w-5" /></button></div>
                <div className="relative overflow-hidden rounded-[20px] bg-white shadow-[0_10px_28px_rgba(12,12,12,0.03)]"><img src={HERO_IMAGES[5].src} alt="gallery" className="h-[320px] w-full object-cover" /><button className="absolute right-4 top-4 h-11 w-11 rounded-full bg-white/94 flex items-center justify-center text-[#bd7d89]"><Heart className="h-5 w-5" /></button></div>
              </div>
              <div className="space-y-6">
                <div className="relative overflow-hidden rounded-[20px] bg-white shadow-[0_10px_28px_rgba(12,12,12,0.03)]"><img src={HERO_IMAGES[1].src} alt="gallery" className="h-[180px] w-full object-cover" /><button className="absolute right-4 top-4 h-11 w-11 rounded-full bg-white/94 flex items-center justify-center text-zinc-500"><HeartOff className="h-5 w-5" /></button></div>
                <div className="relative overflow-hidden rounded-[20px] bg-white shadow-[0_10px_28px_rgba(12,12,12,0.03)]"><img src={HERO_IMAGES[3].src} alt="gallery" className="h-[260px] w-full object-cover" /><button className="absolute right-4 top-4 h-11 w-11 rounded-full bg-white/94 flex items-center justify-center text-zinc-500"><HeartOff className="h-5 w-5" /></button></div>
                <div className="relative overflow-hidden rounded-[20px] bg-white shadow-[0_10px_28px_rgba(12,12,12,0.03)]"><img src={HERO_IMAGES[4].src} alt="gallery" className="h-[240px] w-full object-cover" /><button className="absolute right-4 top-4 h-11 w-11 rounded-full bg-white/94 flex items-center justify-center text-zinc-500"><HeartOff className="h-5 w-5" /></button></div>
              </div>
            </div>

            <section className="mt-12 border-t border-black/8 pt-10">
              <h2 className="font-display text-[2.6rem] text-zinc-950">Photos des invités</h2>
              <p className="mt-3 text-[15px] text-zinc-500">Vos invités ont partagé 48 photos</p>
              <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {GUEST_PHOTOS.map((item) => (
                  <div key={item.src} className="rounded-[18px] overflow-hidden bg-white shadow-[0_10px_28px_rgba(12,12,12,0.03)]">
                    <img src={item.src} alt={item.author} className="h-[260px] w-full object-cover" />
                    <div className="p-4"><span className="rounded-full bg-[var(--color-warm-white)] px-3 py-1 text-sm text-zinc-700">{item.author}</span></div>
                  </div>
                ))}
              </div>

              <div className="mt-10 rounded-[20px] border border-black bg-white px-6 py-5 flex flex-wrap items-center justify-between gap-6">
                <div className="font-display text-[2rem] text-zinc-950">Tableau récapitulatif Apollon</div>
                <div className="flex flex-wrap items-center gap-8 text-[15px] text-zinc-700">
                  <div>Total Photos : <strong className="text-zinc-950">324</strong></div>
                  <div>Favoris : <strong className="text-zinc-950">42</strong></div>
                  <div>Invités contributeurs : <strong className="text-zinc-950">18</strong></div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
