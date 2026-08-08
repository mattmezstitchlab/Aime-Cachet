// Préférences utilisateur AIME Cachet — stockage localStorage uniquement.
// Aucune donnée sensible, aucune connexion officielle.

const KEY = "aime_user_prefs_v1";

const DEFAULTS = {
  // Apparence
  theme: "light",        // 'light' | 'dark'
  density: "comfortable", // 'comfortable' | 'compact'
  accent: "red",         // accent visuel (informatif)
  soberDoc: true,        // PDF sobre par défaut
  // PDF
  pdfWatermark: true,
  pdfQR: true,
  pdfDisclaimer: true,
  // Fiche par défaut
  defaultSector: "spectacle_vivant",
  defaultType: "Artiste",
  defaultAnnexe: "10",
  defaultStatus: "brouillon",
  // Notifications (locales, applicatives)
  notifReseal: true,
  notifMissingDocs: true,
  notif507: true,
  notifIncomplete: true,
  // Profil
  displayName: "",
  primaryRole: "artiste", // 'artiste' | 'technicien' | 'administrateur' | 'autre'
};

export function getUserPrefs() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULTS };
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULTS };
  }
}

export function saveUserPrefs(patch) {
  const next = { ...getUserPrefs(), ...patch };
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export const PREFS_DEFAULTS = DEFAULTS;