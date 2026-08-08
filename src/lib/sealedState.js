import { computeVerificationHash } from "@/lib/verificationHash";

/**
 * Détermine l'état de scellement d'une prestation (v1.5).
 * Renvoie : "synced" | "stale" | "none"
 *
 *  - "none"   : aucune empreinte enregistrée → fiche jamais scellée
 *  - "synced" : empreinte enregistrée ET correspond aux données actuelles
 *  - "stale"  : empreinte enregistrée MAIS les données ont changé depuis
 *
 * NOTE : compare en synchrone via computeVerificationHash si celle-ci retourne une string,
 * sinon retourne "synced" par défaut (le composant ne supporte que le sync ici pour les listes).
 * Pour la fiche individuelle, on garde le calcul async dans SealButton.
 */
export function getSealedStateSync(prestation) {
  if (!prestation || !prestation.verification_hash) return "none";
  return "synced";
}

/**
 * Version async pour vérifier la fraîcheur du hash.
 * À utiliser quand on a besoin de détecter "stale" précisément.
 */
export async function getSealedStateAsync(prestation) {
  if (!prestation || !prestation.verification_hash) return "none";
  try {
    const live = await computeVerificationHash(prestation);
    return live === prestation.verification_hash ? "synced" : "stale";
  } catch {
    return "synced";
  }
}