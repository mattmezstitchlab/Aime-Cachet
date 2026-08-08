// Génère un code unique pour identifier une Fiche Cachet.
// Format : AIME-CCH-YYYYMMDD-XXXXXX (6 caractères alphanumériques aléatoires)
// Identifiant interne uniquement — sans valeur officielle.
export function generateCachetCode(date = new Date()) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 6; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `AIME-CCH-${yyyy}${mm}${dd}-${suffix}`;
}

export function formatTimestampFR(date = new Date()) {
  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}