// ============================================================================
// proactiveActions.js — Moteur de détection des actions proactives (v1)
// Doctrine "Cockpit Vivant" — Strate 2
//
// L'assistante détecte les contextes réels et propose des actions concrètes
// que l'utilisateur peut déclencher d'un clic ("Je fais à ta place").
//
// Chaque action :
//   { id, priority, icon, title, subtitle, cta, kind, target, prestation_id? }
// kind = "navigate" | "create_prestation" | "open_fiche"
// ============================================================================

/**
 * Détecte jusqu'à 3 actions proactives prioritaires.
 * Retourne un tableau ordonné par priorité décroissante.
 */
import { buildMachineContext, getPrimaryMachineAction, MACHINE_ROUTES } from "@/lib/machineContext";

export function detectProactiveActions({ prestations = [], simulator, counters }) {
  const actions = [];
  const now = new Date();
  const machineContext = buildMachineContext({ prestations, simulator, counters });
  const primary = getPrimaryMachineAction(machineContext);
  if (primary) {
    actions.push({ id: "machine-primary", priority: 100, ...primary });
  }

  // --- Action 1 : Prestations brouillon / à compléter ----------------------
  const aCompleter = prestations.filter((p) => p.status === "a_completer");
  if (aCompleter.length > 0) {
    const p = aCompleter[0];
    actions.push({
      id: `complete-${p.id}`,
      priority: 90,
      kind: "open_fiche",
      title: `Compléter la fiche du ${formatShortDate(p.date)}`,
      subtitle: p.employer
        ? `Employeur : ${p.employer}. Je peux pré-remplir les documents manquants à ta place.`
        : "Je peux pré-remplir les documents manquants à ta place.",
      cta: "Je m'en occupe",
      target: `/fiche/${p.id}`,
      prestation_id: p.id,
    });
  }

  // --- Action 2 : Fiches prêtes à vérifier ---------------------------------
  const aVerifier = prestations.filter((p) => p.status === "pret_a_verifier");
  if (aVerifier.length > 0) {
    actions.push({
      id: "verify-batch",
      priority: 80,
      kind: "navigate",
      title: `${aVerifier.length} fiche${aVerifier.length > 1 ? "s" : ""} à vérifier`,
      subtitle: "Je peux te les présenter une par une pour validation rapide.",
      cta: "Vérifier maintenant",
      target: MACHINE_ROUTES.toVerify,
    });
  }

  // --- Action 3 : Prestation récente sans documents (DPAE / AEM) -----------
  const sorted = [...prestations].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  const recent = sorted.find((p) => {
    if (!p.date) return false;
    const d = new Date(p.date);
    const daysAgo = (now - d) / (1000 * 60 * 60 * 24);
    return daysAgo >= 0 && daysAgo <= 7 && (p.missing_documents || 0) > 0;
  });
  if (recent && !aCompleter.some((p) => p.id === recent.id)) {
    actions.push({
      id: `recent-docs-${recent.id}`,
      priority: 70,
      kind: "open_fiche",
      title: `Documents à générer pour ${formatShortDate(recent.date)}`,
      subtitle: recent.employer
        ? `${recent.employer}. Je peux préparer la DPAE, l'AEM ou le cachet à ta place.`
        : "Je peux préparer la DPAE, l'AEM ou le cachet à ta place.",
      cta: "Générer les documents",
      target: `/fiche/${recent.id}`,
      prestation_id: recent.id,
    });
  }

  // --- Action 4 : Seuil 507h proche ----------------------------------------
  const hours = Math.round(simulator?.total || 0);
  if (hours >= 480 && hours < 507) {
    actions.push({
      id: "threshold-507",
      priority: 60,
      kind: "navigate",
      title: `Plus que ${507 - hours}h avant 507`,
      subtitle: "Je peux préparer ton dossier de réouverture pour anticiper.",
      cta: "Voir le cockpit",
      target: MACHINE_ROUTES.cockpit507,
    });
  } else if (hours >= 507) {
    actions.push({
      id: "threshold-507-done",
      priority: 95,
      kind: "navigate",
      title: "507h atteintes — prépare ta réouverture",
      subtitle: "Je peux assembler les justificatifs et lister ce qui reste à transmettre.",
      cta: "Préparer le dossier",
      target: MACHINE_ROUTES.cockpit507,
    });
  }

  // --- Action 5 : Aucune prestation — onboarding ---------------------------
  if (prestations.length === 0) {
    actions.push({
      id: "first-prestation",
      priority: 50,
      kind: "create_prestation",
      title: "Crée ta première prestation",
      subtitle: "Je t'accompagne pas à pas. Tu n'as rien à remplir seul·e.",
      cta: "On commence",
      target: "/?new=1",
    });
  }

  // --- Action 6 : Période creuse > 30 jours --------------------------------
  if (prestations.length > 0 && actions.length === 0) {
    const last = sorted[0];
    if (last?.date) {
      const daysSince = Math.floor((now - new Date(last.date)) / (1000 * 60 * 60 * 24));
      if (daysSince > 30) {
        actions.push({
          id: "dry-period",
          priority: 30,
          kind: "navigate",
          title: `${daysSince} jours sans prestation`,
          subtitle: "On peut simuler ensemble la trajectoire des prochaines semaines.",
          cta: "Simuler",
          target: MACHINE_ROUTES.cockpit507,
        });
      }
    }
  }

  return actions.sort((a, b) => b.priority - a.priority).slice(0, 3);
}

function formatShortDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  const months = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
  return `${d.getDate()} ${months[d.getMonth()]}`;
}