import React, { useMemo, useState } from "react";
import { CalendarDays, Paperclip, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import WeddingWorkspaceTopBar from "@/components/aime/WeddingWorkspaceTopBar";
import { readWeddingState } from "@/lib/aimeWeddingCore";

const NAV_ITEMS = [
  { id: "checklist", label: "Checklist (Athéna)", to: "/univers/athena/checklist" },
  { id: "messaging", label: "Messagerie (Hermès)", to: "/univers/hermes/messagerie" },
  { id: "gallery", label: "Galerie (Apollon)", to: "/univers/apollon/galerie" },
];

const DIRECT_MESSAGES = [
  { name: "Sophie & Thomas", text: "Je pense qu'il faut partir sur la...", at: "11:42", avatar: "/landing/hero-aime-wedding.jpg", unread: true },
  { name: "Camille (planner)", text: "Le rdv mairie est confirmé pour 14h.", at: "Hier", avatar: "/landing/athena.jpg" },
  { name: "Éloïse (fleuriste)", text: "Je prévois une variante à 25cm. Je...", at: "11:20", avatar: "/landing/aphrodite.jpg", active: true },
  { name: "DJ Marco", text: "Des retours sur la playlist d'entrée ?", at: "2 jours", avatar: "/landing/dionysos.jpg" },
];

const CHANNELS = [
  { name: "# général", text: "Camille: Bienvenue dans votre espace...", at: "3 jours" },
  { name: "# prestataires", text: "Atelier Floral: Devis mis à jour dispo.", at: "11:22", unread: true },
  { name: "# famille-mariée", text: "Maman: Les dragées sont magnifiques !", at: "Hier" },
  { name: "# témoins", text: "Mathilde: On prépare le flashmob !", at: "12m", unread: true },
];

const PHOTO_STRIP = [
  "/landing/aphrodite.jpg",
  "/landing/apollon.jpg",
  "/landing/hestia.jpg",
];

const CONVERSATION = [
  { author: "Éloïse", at: "10:32", text: "Voici les 3 propositions de centres de table pour la réception. J'ai privilégié les tons pastel comme souhaité.", own: false },
  { author: "Éloïse", at: "10:35", images: PHOTO_STRIP, own: false },
  { author: "Sophie (Vous)", at: "11:15", text: "La proposition 2 est magnifique ! On peut ajuster la hauteur ?", own: true },
  { author: "Éloïse", at: "11:20", text: "Bien sûr, je prévois une variante à 25cm. Je vous envoie le devis mis à jour.", own: false },
];

export default function MessagingHubPage() {
  const state = useMemo(() => readWeddingState(), []);
  const [text, setText] = useState("");

  const send = () => {
    if (!text.trim()) return;
    toast.success("Message envoyé");
    setText("");
  };

  return (
    <div className="min-h-screen bg-[#efefeb] overflow-x-hidden text-[var(--color-text-primary)]">
      <div className="min-h-screen p-2 md:p-6">
        <div className="mx-auto max-w-[1600px] rounded-[24px] bg-[#fbfaf7] shadow-[0_24px_70px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="p-3 md:p-4">
            <WeddingWorkspaceTopBar items={NAV_ITEMS} active="messaging" names={state.meta?.couple || "Sophie & Thomas"} avatarImage="/landing/hero-aime-wedding.jpg" />
          </div>

          <div className="px-6 md:px-10 lg:px-16 pb-14 pt-6 md:pt-8">
            <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Tableau de bord / Hermès / <span className="text-zinc-900">Messages</span></div>
            <h1 className="mt-5 font-display text-[3.3rem] md:text-[4.8rem] leading-[0.94] text-zinc-950">Messages</h1>

            <div className="mt-10 grid gap-6 xl:grid-cols-[0.9fr_1.1fr] items-start">
              <aside className="rounded-[26px] border border-black/8 bg-white p-5 shadow-[0_12px_30px_rgba(12,12,12,0.03)]">
                <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Messages directs</div>
                <div className="mt-5 space-y-3">
                  {DIRECT_MESSAGES.map((item) => (
                    <div key={item.name} className={`rounded-[16px] px-4 py-3 ${item.active ? "bg-[var(--color-warm-white)]" : ""}`}>
                      <div className="flex items-start gap-3">
                        <img src={item.avatar} alt={item.name} className="h-12 w-12 rounded-full object-cover" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <div className="font-medium text-zinc-950">{item.name}</div>
                            <div className="text-sm text-zinc-400 whitespace-nowrap">{item.at}</div>
                          </div>
                          <div className="mt-1 text-sm text-zinc-500 truncate">{item.text}</div>
                        </div>
                        {item.unread && <span className="mt-2 h-2.5 w-2.5 rounded-full bg-black" />}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 text-[11px] uppercase tracking-[0.16em] text-zinc-500">Canaux</div>
                <div className="mt-5 space-y-3">
                  {CHANNELS.map((item) => (
                    <div key={item.name} className="rounded-[16px] px-4 py-3">
                      <div className="flex items-start gap-3">
                        <div className="h-11 w-11 rounded-full bg-[var(--color-warm-white)] flex items-center justify-center text-lg text-zinc-700">#</div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <div className="font-medium text-zinc-950">{item.name}</div>
                            <div className="text-sm text-zinc-400 whitespace-nowrap">{item.at}</div>
                          </div>
                          <div className="mt-1 text-sm text-zinc-500 truncate">{item.text}</div>
                        </div>
                        {item.unread && <span className="mt-2 h-2.5 w-2.5 rounded-full bg-black" />}
                      </div>
                    </div>
                  ))}
                </div>
              </aside>

              <section className="rounded-[26px] border border-black/8 bg-white shadow-[0_12px_30px_rgba(12,12,12,0.03)] overflow-hidden">
                <div className="px-5 py-5 border-b border-black/8 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src="/landing/aphrodite.jpg" alt="Éloïse" className="h-12 w-12 rounded-full object-cover" />
                    <div>
                      <div className="font-semibold text-zinc-950 text-[1.25rem]">Éloïse Martin — Atelier Floral</div>
                      <div className="mt-1 text-sm text-zinc-500 inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#6c8a73]" />En ligne</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-zinc-500">
                    <Phone className="h-5 w-5" />
                    <CalendarDays className="h-5 w-5" />
                  </div>
                </div>

                <div className="p-5 md:p-6 space-y-5 min-h-[680px]">
                  {CONVERSATION.map((item, index) => (
                    <div key={index} className={`${item.own ? "flex justify-end" : ""}`}>
                      <div className={`max-w-[78%] ${item.own ? "items-end" : "items-start"} flex flex-col gap-2`}>
                        <div className="flex items-center gap-2 text-sm text-zinc-500">
                          {!item.own && <img src="/landing/aphrodite.jpg" alt="avatar" className="h-10 w-10 rounded-full object-cover" />}
                          <span className="font-medium text-zinc-950">{item.author}</span>
                          <span>{item.at}</span>
                          {item.own && <img src="/landing/hero-aime-wedding.jpg" alt="avatar" className="h-10 w-10 rounded-full object-cover ml-3" />}
                        </div>
                        {item.text && (
                          <div className={`rounded-[20px] px-5 py-4 text-[15px] leading-relaxed ${item.own ? "bg-black text-white" : "bg-[var(--color-warm-white)] text-zinc-800"}`}>
                            {item.text}
                          </div>
                        )}
                        {item.images && (
                          <div className="grid grid-cols-3 gap-3">
                            {item.images.map((src) => <img key={src} src={src} alt="proposition" className="h-[150px] w-full rounded-[14px] object-cover" />)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-black/8 px-5 py-4 flex items-center gap-3">
                  <button className="h-12 w-12 rounded-full border border-black/10 bg-[var(--color-warm-white)] flex items-center justify-center text-zinc-600"><Paperclip className="h-5 w-5" /></button>
                  <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Écrire un message à Éloïse..." className="flex-1 rounded-full border border-black/10 bg-white px-5 py-4 text-[15px] text-zinc-900 outline-none" />
                  <button onClick={send} className="rounded-full bg-black px-6 py-4 text-sm text-white hover:bg-zinc-800 inline-flex items-center gap-2">Envoyer <Send className="h-4 w-4" /></button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
