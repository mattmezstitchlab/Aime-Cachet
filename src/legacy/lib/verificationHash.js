// AIME Cachet v1.3 — Hash d'intégrité technique
//
// Calcule un SHA-256 stable à partir d'un canonical JSON STRICT
// des 8 champs publics autorisés d'une fiche.
//
// ⚠️ Cette empreinte vérifie UNIQUEMENT la cohérence technique de la fiche
//    avec ses données enregistrées. Elle ne constitue PAS :
//      - une certification administrative
//      - une signature légale
//      - une preuve opposable
//      - une validation officielle
//
// Vocabulaire autorisé : "empreinte technique", "cohérence technique vérifiée".
// Vocabulaire INTERDIT : "certifié", "officiel", "validé administrativement".

// Liste stricte des champs inclus dans le hash, dans cet ordre exact.
// Toute modification de cette liste casse les hashes existants.
export const HASHED_FIELDS = [
  "cachetCode",
  "status",
  "prestationDate",
  "employerName",
  "location",
  "prestationType",
  "sector",
  "annex",
];

// Normalisation d'une valeur scalaire en chaîne stable.
// - null / undefined → ""
// - trim systématique
// - cast en string
function normalizeValue(v) {
  if (v === null || v === undefined) return "";
  return String(v).trim();
}

// Construit un canonical JSON STRICT : ordre fixe, clés triées par HASHED_FIELDS,
// valeurs normalisées. Aucun champ supplémentaire n'est inclus.
export function buildCanonicalJSON(publicPayload) {
  const obj = {};
  for (const k of HASHED_FIELDS) {
    obj[k] = normalizeValue(publicPayload?.[k]);
  }
  // JSON.stringify avec liste d'ordre explicite → résultat déterministe.
  return JSON.stringify(obj, HASHED_FIELDS);
}

// Calcul SHA-256 via Web Crypto API (disponible dans Deno ET dans le navigateur).
export async function computeVerificationHash(publicPayload) {
  const canonical = buildCanonicalJSON(publicPayload);
  const data = new TextEncoder().encode(canonical);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return bufferToHex(digest);
}

function bufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Compare deux hash en stripping et lower-case pour tolérer les variantes de transport.
export function hashesMatch(a, b) {
  if (!a || !b) return false;
  return String(a).trim().toLowerCase() === String(b).trim().toLowerCase();
}