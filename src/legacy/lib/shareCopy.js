// Textes de partage harmonisés AIME Cachet.
// Tout partage sortant est explicitement marqué comme brouillon préparatoire non opposable.

export const SHARE_PREFIX = "[BROUILLON AIME — non opposable]";

const SHARE_INTRO =
  "Voici une fiche préparatoire générée avec AIME Cachet. Elle doit être vérifiée avant toute utilisation administrative ou transmission officielle.";

const LEGAL_LINE =
  "Document préparatoire — sans valeur officielle, non opposable.";

/**
 * Construit le corps de message pour email / WhatsApp / SMS / lien.
 *
 * @param {object} prestation - prestation source (pour titre éventuel).
 * @param {string} cachetCode - code unique.
 * @param {string} url        - lien public vers la fiche.
 */
export function buildShareBody({ prestation, cachetCode, url }) {
  const employer = prestation?.employer ? ` — ${prestation.employer}` : "";
  return [
    SHARE_PREFIX,
    "",
    SHARE_INTRO,
    "",
    `Référence : ${cachetCode || "AIME"}${employer}`,
    url ? `Lien : ${url}` : "",
    "",
    LEGAL_LINE,
    "— Envoyé via AIME Cachet",
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * Sujet email préfixé.
 */
export function buildShareSubject({ prestation }) {
  const base = `Fiche préparatoire${prestation?.employer ? ` — ${prestation.employer}` : ""}`;
  return `${SHARE_PREFIX} ${base}`;
}