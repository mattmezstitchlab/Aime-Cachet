// ============================================================================
// Génère des suggestions contextuelles à afficher dans le panneau Assistant
// selon la route courante + les vraies données utilisateur. Déterministe.
// ============================================================================

import { buildMachineContext } from "@/lib/machineContext";

// Suggestions dynamiques : composées à partir des compteurs réels
function buildDynamicSuggestions({ counters, simulator, prestations }) {
  const out = [];
  const mc = buildMachineContext({ prestations, simulator, counters });
  const drafts = mc.statuts.brouillon.length;
  const toReseal = mc.scellements.aResceller.length;
  const docsManquants = mc.documentsManquants.total;
  const pct = simulator?.percent || 0;
  const monthHours = mc.periode.ceMois.reduce((sum, p) => sum + (Number(p.duration_hours) || 0), 0);

  if (drafts > 0) out.push(`J'ai ${drafts} fiche${drafts > 1 ? "s" : ""} en brouillon, par où commencer ?`);
  if (docsManquants > 0) out.push("Quels documents me manquent ?");
  if (toReseal > 0) out.push("Quelles fiches dois-je resceller ?");
  if (pct < 50) out.push("Combien me reste-t-il avant 507h ?");
  if (monthHours > 0) out.push("Combien d'heures ce mois-ci ?");
  return out.slice(0, 4);
}

export function getContextHints(pathname, data = {}) {
  const dynamic = buildDynamicSuggestions(data);
  if (!pathname) {
    return dynamic.length
      ? { title: "Au regard de vos données", suggestions: dynamic }
      : DEFAULT_HINTS;
  }

  if (pathname.startsWith("/fiche/")) {
    return {
      title: "Sur cette fiche",
      suggestions: [
        "Que dois-je vérifier ou compléter sur cette fiche ?",
        "Faut-il resceller cette fiche ?",
        "Est-ce que mon employeur est correctement renseigné ?",
      ],
    };
  }

  if (pathname.startsWith("/verify/")) {
    return {
      title: "Vérification publique",
      suggestions: [
        "Que signifie l'état de scellement affiché ?",
        "Que vois-je publiquement sur cette fiche ?",
      ],
    };
  }

  // Si on a des suggestions dynamiques fortes, on les prend en priorité
  if (dynamic.length >= 2) {
    return { title: "Au regard de vos données", suggestions: dynamic };
  }

  switch (pathname) {
    case "/":
    case "/app":
      return {
        title: "Sur votre accueil",
        suggestions: [
          "Montre-moi ma timeline",
          "Quelles fiches sont prioritaires aujourd'hui ?",
          "Combien d'heures m'ont été comptabilisées indicativement ce mois-ci ?",
          "Y a-t-il des fiches à resceller ?",
        ],
      };
    case "/507":
      return {
        title: "Sur votre cockpit 507h",
        suggestions: [
          "Où en suis-je sur mes 507h indicatives ?",
          "À quel rythme dois-je continuer pour atteindre l'objectif ?",
          "Quelles fiches comptent le plus dans mon cumul ?",
        ],
      };
    case "/prestations":
      return {
        title: "Sur vos prestations",
        suggestions: [
          "Quelles fiches sont incomplètes ?",
          "Combien de fiches en brouillon ?",
          "Y a-t-il des fiches techniciens à compléter ?",
        ],
      };
    case "/recherche":
      return {
        title: "Sur la recherche",
        suggestions: [
          "Aide-moi à formuler ma recherche",
          "Trouve mes fiches à resceller ce mois-ci",
          "Quelles fiches n'ont pas d'employeur ?",
        ],
      };
    case "/notifications":
      return {
        title: "Sur vos notifications",
        suggestions: [
          "Quelles notifications sont prioritaires ?",
          "Que dois-je traiter en premier ?",
        ],
      };
    case "/aide":
      return {
        title: "Aide & FAQ",
        suggestions: [
          "Comment fonctionne le scellement technique ?",
          "Comment générer un PDF préparatoire ?",
          "Que veut dire chaque statut de fiche ?",
        ],
      };
    case "/parametres":
      return {
        title: "Sur vos paramètres",
        suggestions: [
          "Que puis-je personnaliser dans AIME ?",
          "Comment exporter mes données ?",
        ],
      };
    case "/profil":
      return {
        title: "Sur votre profil",
        suggestions: [
          "Quelles informations sont prises en compte pour l'analyse ?",
        ],
      };
    default:
      return DEFAULT_HINTS;
  }
}

const DEFAULT_HINTS = {
  title: "Comment puis-je vous aider ?",
  suggestions: [
    "Quelles fiches dois-je traiter en priorité ?",
    "Où en suis-je sur mes 507h indicatives ?",
    "Quels documents me manquent ?",
  ],
};