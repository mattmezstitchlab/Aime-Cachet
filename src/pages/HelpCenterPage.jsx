import React, { useMemo, useState } from "react";
import MarketingShell from "@/components/aime/MarketingShell";

const FAQS = {
  "Général": [
    ["Comment créer mon espace mariage ?", "Pour commencer, cliquez sur 'Planifier' ou 'Créer un espace' depuis la page d'accueil. Renseignez la date provisoire et vos prénoms. Vous recevrez instantanément vos accès confidentiels."],
    ["Puis-je inviter mon/ma partenaire ?", "Absolument. Une fois votre espace créé, rendez-vous dans l'univers de Zeus pour envoyer une invitation de co-administration à votre partenaire."],
    ["Comment changer de mode (mariés/invité/planner) ?", "Chaque profil possède sa propre clé d'accès. Le système vous oriente ensuite vers la bonne vision sans dupliquer les données."],
    ["AIME Wedding est-il gratuit ?", "Le prototype actuel expose l'architecture produit. Les modalités commerciales et d'accompagnement sont détaillées lors de la prise de contact."],
  ],
  "Invités & RSVP": [
    ["Comment confirmer ma présence ?", "Depuis votre lien d'invitation ou le portail invité, ouvrez le formulaire RSVP puis confirmez votre présence, votre nombre d'accompagnants et vos besoins spécifiques."],
    ["Comment déclarer une allergie ?", "Dans le formulaire RSVP, renseignez vos allergies ou régimes spécifiques. L'information se propage ensuite automatiquement vers Déméter et le service."],
    ["Je n'ai pas reçu mon invitation, que faire ?", "Contactez les mariés ou le planner. Une nouvelle invitation peut être renvoyée depuis Hestia ou Hermès en quelques secondes."],
  ],
  "Budget & Paiements": [
    ["Comment suivre mon budget ?", "L'univers Zeus synthétise les arbitrages. Le détail des catégories et des règlements se consulte ensuite dans le budget détaillé."],
    ["Puis-je exporter mes données en PDF ?", "Oui. Les exports, feuilles de route et supports documentaires sont préparés dans Héphaïstos."],
  ],
  Prestataires: [
    ["Comment accéder à mon brief client ?", "Depuis le portail prestataire ou la messagerie Hermès, vous recevez le bon brief relié à la bonne mission, sans doublon documentaire."],
    ["Comment envoyer mes livrables ?", "Les livrables passent par le portail prestataire, la messagerie ou les documents certifiés selon le type de mission."],
  ],
};

function AccordionItem({ question, answer, open, onToggle }) {
  return (
    <div className="rounded-[20px] border border-black/8 bg-white shadow-[0_10px_28px_rgba(12,12,12,0.03)] overflow-hidden">
      <button onClick={onToggle} className="w-full px-6 py-6 flex items-center justify-between gap-4 text-left">
        <span className="font-display text-[1.7rem] text-zinc-950 leading-[1.05]">{question}</span>
        <span className="text-[#b59c73] text-2xl">{open ? "−" : "⌄"}</span>
      </button>
      {open && <div className="px-6 pb-6 text-[17px] text-zinc-600 leading-relaxed">{answer}</div>}
    </div>
  );
}

export default function HelpCenterPage() {
  const [query, setQuery] = useState("");
  const [openKey, setOpenKey] = useState("Général-0");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FAQS;
    const out = {};
    for (const [group, items] of Object.entries(FAQS)) {
      const matches = items.filter(([question, answer]) => `${question} ${answer}`.toLowerCase().includes(q));
      if (matches.length) out[group] = matches;
    }
    return out;
  }, [query]);

  return (
    <MarketingShell>
      <section className="px-6 md:px-10 lg:px-16 py-18 md:py-24 text-center">
        <h1 className="font-display text-[3.8rem] md:text-[5.6rem] leading-[0.94] text-zinc-950">Centre d'aide</h1>
        <p className="mt-6 text-[20px] md:text-[22px] text-zinc-600">Trouvez rapidement la réponse à votre question</p>
        <div className="mt-10 max-w-[760px] mx-auto rounded-full border border-black/8 bg-white px-6 py-4 shadow-[0_10px_28px_rgba(12,12,12,0.03)]">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher dans l'aide..." className="w-full bg-transparent text-[17px] text-zinc-900 outline-none placeholder:text-zinc-400" />
        </div>
      </section>

      <section className="px-6 md:px-10 lg:px-16 pb-16 space-y-14">
        {Object.entries(filtered).map(([group, items]) => (
          <div key={group}>
            <div className="text-[12px] uppercase tracking-[0.18em] text-[#b59c73] mb-6">{group}</div>
            <div className="space-y-4">
              {items.map(([question, answer], index) => {
                const key = `${group}-${index}`;
                return <AccordionItem key={key} question={question} answer={answer} open={openKey === key} onToggle={() => setOpenKey((current) => current === key ? "" : key)} />;
              })}
            </div>
          </div>
        ))}
      </section>

      <section className="px-6 md:px-10 lg:px-16 py-18 bg-[#f6f0e4] text-center border-t border-black/6">
        <h2 className="font-display text-[3rem] md:text-[4rem] text-zinc-950">Une question non résolue ?</h2>
        <p className="mt-5 text-[18px] text-zinc-600">Notre support haut de gamme vous répond sous 2 heures.</p>
        <div className="mt-8 text-[2.4rem] font-display text-[#b59c73]">support@aimewedding.com</div>
        <button className="mt-8 rounded-full bg-black px-6 py-4 text-sm uppercase tracking-[0.08em] text-white hover:bg-zinc-800">Envoyer un message →</button>
      </section>
    </MarketingShell>
  );
}
