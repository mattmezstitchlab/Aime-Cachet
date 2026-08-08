// Smart Actions — démarches en 1 clic.
// Toutes les actions sont préparatoires : elles ouvrent le site officiel /
// préparent un brouillon. AIME ne déclare jamais à la place de l'utilisateur.

import { formatDateFR } from "@/lib/aimeData";

/* Copie une valeur dans le presse-papier (silencieux si refus). */
export async function copyToClipboard(value) {
  if (!value) return false;
  try {
    await navigator.clipboard.writeText(String(value));
    return true;
  } catch {
    return false;
  }
}

/* GUSO — ouvre le portail officiel + copie le SIRET dans le presse-papier. */
export async function openGuso(prestation) {
  const copied = await copyToClipboard(prestation?.employer_siret || "");
  window.open("https://www.guso.fr/", "_blank", "noopener,noreferrer");
  return { copied, value: prestation?.employer_siret };
}

/* France Travail — espace personnel actualisation. */
export function openFranceTravail() {
  window.open("https://www.francetravail.fr/espace-personnel/", "_blank", "noopener,noreferrer");
}

/* Audiens — espace personnel intermittents. */
export function openAudiens() {
  window.open("https://www.audiens.org/", "_blank", "noopener,noreferrer");
}

/* Mailto — relance employeur, brouillon pré-rempli. */
export function mailtoRelance(prestation) {
  const d = formatDateFR(prestation.date);
  const to = prestation.employer_email || "";
  const subject = `Documents prestation du ${d.day} ${d.month} ${d.year}`;
  const body = [
    `Bonjour,`,
    ``,
    `Je reviens vers vous concernant ma prestation du ${d.day} ${d.month} ${d.year}${prestation.location ? ` à ${prestation.location}` : ""}.`,
    ``,
    `Pour finaliser mes démarches administratives, il me manque les éléments suivants :`,
    `- Contrat ou attestation employeur`,
    `- Déclaration GUSO / AEM le cas échéant`,
    `- Bulletin de salaire ou justificatif de paiement`,
    ``,
    `Pourriez-vous me les transmettre dès que possible ?`,
    ``,
    `Merci par avance,`,
  ].join("\n");
  const href = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = href;
}

/* Calendrier — ouvre Google Calendar avec l'événement pré-rempli. */
export function openGoogleCalendar(prestation) {
  if (!prestation?.date) return;
  const dt = prestation.date.replace(/-/g, "");
  const title = `Cachet · ${prestation.employer || "Prestation"}`;
  const details = [
    prestation.nature || "",
    prestation.cachet_code ? `Code: ${prestation.cachet_code}` : "",
  ].filter(Boolean).join("\n");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${dt}/${dt}`,
    details,
    location: prestation.location || "",
  });
  window.open(`https://calendar.google.com/calendar/render?${params.toString()}`, "_blank", "noopener,noreferrer");
}

/* Détermine l'action prioritaire du jour parmi toutes les prestations. */
export function pickActionOfDay(prestations = []) {
  if (!prestations.length) return null;
  const today = new Date().toISOString().slice(0, 10);
  const dayOfMonth = new Date().getDate();

  // 1) Actualisation France Travail (du 28 au 15)
  if (dayOfMonth >= 28 || dayOfMonth <= 15) {
    return {
      kind: "actualisation_ft",
      title: "Actualisation France Travail",
      subtitle: "Préparez votre récap mensuel avant déclaration.",
      cta: "Ouvrir France Travail",
      onClick: openFranceTravail,
      tone: "blue",
    };
  }

  // 2) Prestation à transmettre (date passée + missing > 0)
  const toTransmit = prestations
    .filter((p) => p.date && p.date < today && (p.missing_documents || 0) > 0)
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))[0];
  if (toTransmit) {
    return {
      kind: "relance",
      title: `Relancer ${toTransmit.employer || "l'employeur"}`,
      subtitle: `${toTransmit.missing_documents} document${toTransmit.missing_documents > 1 ? "s" : ""} manquant${toTransmit.missing_documents > 1 ? "s" : ""}.`,
      cta: "Préparer le message",
      onClick: () => mailtoRelance(toTransmit),
      prestation: toTransmit,
      tone: "red",
    };
  }

  // 3) Prestation prête à déclarer GUSO
  const toGuso = prestations
    .filter((p) => p.sector === "spectacle_vivant" && p.employer_kind === "occasionnel" && p.status !== "valide" && p.status !== "transmis")
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))[0];
  if (toGuso) {
    return {
      kind: "guso",
      title: "Déclarer au GUSO",
      subtitle: `${toGuso.employer || "Employeur"} · ${toGuso.date || ""}`,
      cta: "Ouvrir GUSO",
      onClick: () => openGuso(toGuso),
      prestation: toGuso,
      tone: "amber",
    };
  }

  // 4) Sinon, rien d'urgent.
  return {
    kind: "calm",
    title: "Aucune action urgente",
    subtitle: "Profitez. Votre dossier est à jour.",
    cta: null,
    tone: "neutral",
  };
}