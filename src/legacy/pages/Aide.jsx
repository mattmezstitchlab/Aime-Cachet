import React, { useState } from "react";
import { ChevronDown, FileText, ShieldCheck, QrCode, Gauge, BookOpen, HelpCircle, AlertTriangle, XCircle } from "lucide-react";
import PageShell from "@/components/aime/PageShell";

const SECTIONS = [
  {
    Icon: BookOpen,
    title: "Comprendre AIME Cachet",
    body: "AIME Cachet est votre cockpit documentaire préparatoire et privé. Il vous aide à structurer vos prestations en tant qu'intermittent du spectacle, sans remplacer les démarches officielles."
  },
  {
    Icon: FileText,
    title: "Créer une fiche",
    body: "Depuis l'accueil ou /prestations, cliquez sur 'Nouvelle fiche'. Remplissez progressivement : date, employeur, lieu, durée, nature. Vous pouvez sauvegarder en brouillon et compléter plus tard."
  },
  {
    Icon: ShieldCheck,
    title: "Sceller une fiche",
    body: "Le scellement génère une empreinte technique SHA-256 unique à partir des données de la fiche. Si vous modifiez la fiche après scellement, le badge passe à 'À resceller'. C'est une cohérence technique, pas une certification."
  },
  {
    Icon: ShieldCheck,
    title: "Comprendre la cohérence technique",
    body: "Une empreinte SHA-256 prouve que les données affichées correspondent à celles enregistrées au moment du scellement. Elle ne valide pas le contenu juridiquement, n'engage aucun organisme et n'est pas opposable."
  },
  {
    Icon: QrCode,
    title: "Comprendre le QR",
    body: "Chaque fiche scellée peut afficher un QR code pointant vers /verify/:cachetCode. Cette page publique affiche uniquement les champs autorisés (employeur, date, statut, durée). Aucune donnée sensible n'est exposée."
  },
  {
    Icon: FileText,
    title: "Générer un PDF",
    body: "Depuis la fiche, cliquez sur 'Télécharger PDF'. Le document inclut un filigrane 'BROUILLON PRÉPARATOIRE', un disclaimer légal et, si activé, le QR de vérification technique."
  },
  {
    Icon: HelpCircle,
    title: "Comprendre les statuts",
    body: "Brouillon (saisie en cours) · À compléter (informations manquantes) · Prêt à vérifier (à relire) · Transmis (envoyé à l'employeur) · Validé (confirmé par vous-même). Aucun statut ne reflète une validation officielle."
  },
  {
    Icon: Gauge,
    title: "Comprendre le cockpit 507",
    body: "Le cockpit /507 affiche votre cumul d'heures sur 12 mois glissants, à titre purement indicatif. Il ne remplace en aucun cas le suivi officiel par France Travail Spectacle."
  },
];

const FAQ = [
  { q: "Est-ce officiel ?", a: "Non. AIME Cachet est un outil préparatoire privé. Aucune fiche n'a de valeur officielle, n'engage aucun organisme et n'est opposable." },
  { q: "Le scellement est-il une certification ?", a: "Non. C'est une vérification technique de cohérence des données (empreinte SHA-256). Cela ne remplace ni un contrat, ni une déclaration officielle." },
  { q: "Puis-je envoyer le PDF à un employeur ?", a: "Oui, comme brouillon préparatoire à vérifier. Le PDF est clairement marqué 'BROUILLON PRÉPARATOIRE' et indique son absence de valeur officielle." },
  { q: "AIME déclare-t-il mes cachets ?", a: "Non. AIME Cachet ne déclare rien à France Travail, au GUSO, à l'URSSAF ou à Audiens. Toutes les démarches officielles restent à votre charge." },
  { q: "AIME calcule-t-il officiellement mes droits ?", a: "Non. Les calculs (cumul 507h, estimation AJ, projections) sont strictement indicatifs. Seul France Travail Spectacle calcule officiellement vos droits." },
];

export default function Aide() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <PageShell
      eyebrow="Aide & FAQ"
      title="Comment ça marche ?"
      subtitle="Tout ce qu'il faut savoir pour utiliser AIME Cachet sereinement — et ce qu'AIME ne fait pas."
    >
      {/* Sections explicatives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
        {SECTIONS.map(({ Icon, title, body }) => (
          <div key={title} className="bg-white border border-zinc-200 rounded-xl p-5">
            <Icon className="w-5 h-5 text-aime-red mb-3" strokeWidth={2} />
            <h3 className="text-sm font-semibold text-zinc-900">{title}</h3>
            <p className="text-xs text-zinc-600 mt-1.5 leading-relaxed">{body}</p>
          </div>
        ))}
      </div>

      {/* Message clé */}
      <div className="bg-aime-red/5 border border-aime-red/20 rounded-2xl p-6 mb-10">
        <AlertTriangle className="w-5 h-5 text-aime-red mb-3" />
        <p className="text-sm text-zinc-800 leading-relaxed">
          <strong>AIME Cachet prépare, organise et vérifie la cohérence technique de vos documents.</strong>{" "}
          AIME ne remplace pas France Travail, le GUSO, l'URSSAF, Audiens, un expert-comptable ou un conseiller juridique.
        </p>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="font-display text-2xl text-zinc-900 mb-4">FAQ</h2>
        <div className="space-y-2">
          {FAQ.map((item, i) => {
            const isOpen = openFaq === i;
            return (
              <div key={i} className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-zinc-50 transition-colors"
                >
                  <span className="text-sm font-medium text-zinc-900">{item.q}</span>
                  <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 -mt-1">
                    <p className="text-xs text-zinc-600 leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Ce qu'AIME ne fait pas */}
      <div className="mt-10 bg-zinc-900 text-white rounded-2xl p-6">
        <h3 className="font-display text-xl mb-4 flex items-center gap-2">
          <XCircle className="w-5 h-5 text-aime-red" />
          Ce qu'AIME ne fait pas
        </h3>
        <ul className="space-y-2 text-sm text-zinc-300">
          <li>• Ne remplace aucune déclaration officielle (AEM, DUS, GUSO)</li>
          <li>• Ne se connecte pas à France Travail, GUSO, URSSAF ou Audiens</li>
          <li>• Ne certifie ni n'authentifie aucun document</li>
          <li>• Ne calcule pas officiellement vos droits 507h</li>
          <li>• Ne se substitue pas à un expert-comptable ou un conseiller juridique</li>
        </ul>
      </div>
    </PageShell>
  );
}