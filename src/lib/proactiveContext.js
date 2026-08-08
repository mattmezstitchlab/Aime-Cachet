// ============================================================================
// proactiveContext.js — Détection de signaux pour l'assistante proactive (v1)
// Doctrine "Machine = Cockpit Vivant" — Strate 1
// ============================================================================

/**
 * Renvoie une phrase d'accueil proactive, contextuelle et précise,
 * basée sur l'état réel de l'utilisateur (compteurs, prestations, profil).
 *
 * Règles : 1 à 3 phrases max, bienveillante, actionnable.
 * Renvoie null si aucun signal pertinent → fallback message standard.
 */
export function getProactiveWelcome({ user, simulator, counters, prestations }) {
  const first = user?.full_name?.split(" ")?.[0] || "";
  const hi = first ? `Salut ${first}.` : "Salut.";
  const metier = user?.aime_metier;
  const annexe = user?.aime_annexe;

  // Signal 1 — Aucune prestation : onboarding
  if (!prestations?.length) {
    return `${hi} Aucune prestation. On en crée une ensemble ?`;
  }

  // Signal 2 — Seuil 507h franchi
  const hours = Math.round(simulator?.totalHours || 0);
  const pct = Math.min(100, Math.round((hours / 507) * 100));
  if (pct >= 100) {
    return `${hi} ${hours}h atteints ! Prêt à préparer ton dossier ?`;
  }
  if (pct >= 90) {
    return `${hi} ${pct}% des 507h (${hours}h). Plus que ${507 - hours}h. On vérifie ?`;
  }
  if (pct >= 66) {
    return `${hi} ${hours}h / 507h. Tu as franchi les deux tiers. On simule la suite ?`;
  }

  // Signal 3 — Documents manquants
  const missing = prestations.filter(p => (p.missing_documents || 0) > 0).length;
  if (missing >= 3) {
    return `${hi} ${missing} fiches avec docs manquants. On les passe en revue ?`;
  }
  if (missing === 1 || missing === 2) {
    return `${hi} Il manque des pièces sur ${missing} fiche${missing > 1 ? "s" : ""}. Je te dis lesquelles ?`;
  }

  // Signal 4 — Période creuse
  const sorted = [...prestations].sort((a, b) => new Date(b.date) - new Date(a.date));
  const lastDate = sorted[0]?.date ? new Date(sorted[0].date) : null;
  if (lastDate) {
    const daysSince = Math.floor((Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysSince > 30) {
      return `${hi} ${daysSince} jours sans prestation. On simule la suite ?`;
    }
  }

  // Signal 5 — Fiches en attente de vérification
  const aVerifier = prestations.filter(p => p.status === "pret_a_verifier").length;
  if (aVerifier > 0) {
    return `${hi} ${aVerifier} fiche${aVerifier > 1 ? "s" : ""} prête${aVerifier > 1 ? "s" : ""} à vérifier. On y va ?`;
  }

  // Signal 6 — État stable
  if (metier && annexe) {
    return `${hi} ${metier} · annexe ${annexe} · ${hours}h / 507h. Que vérifie-t-on ?`;
  }

  // Fallback minimal
  return `${hi} ${prestations.length} fiche${prestations.length > 1 ? "s" : ""} · ${hours}h / 507h. Que regarde-t-on ?`;
}