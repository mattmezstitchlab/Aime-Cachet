import React from "react";

// Pictogrammes symboliques affinés — repères d'identification, pas les marques officielles.
// AIME n'est ni mandaté ni affilié à ces organismes.

export const Logos = {
  // GUSO : guichet — building + door
  GUSO: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21V9l9-5 9 5v12" />
      <path d="M3 21h18" />
      <path d="M10 21v-6a2 2 0 014 0v6" />
      <circle cx="13.5" cy="17" r="0.4" fill="currentColor" />
    </svg>
  ),
  // France Travail : badge + flèche d'orientation
  FT: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M8 13l3 3 5-6" />
    </svg>
  ),
  // URSSAF : tampon administratif
  URSSAF: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 8h8" />
      <path d="M8 12h8" />
      <path d="M8 16h5" />
      <circle cx="17" cy="16" r="2" />
    </svg>
  ),
  // Audiens : protection sociale — bouclier + personne
  AUDIENS: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z" />
      <circle cx="12" cy="11" r="2.5" />
      <path d="M8 17c0-2.2 1.8-4 4-4s4 1.8 4 4" />
    </svg>
  ),
  // Congés Spectacles : calendrier + étoile (spectacle)
  CONGES: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
      <path d="M12 13l1 2 2 .3-1.5 1.4.4 2.1L12 17.8l-1.9 1 .4-2.1L9 15.3l2-.3 1-2z" fill="currentColor" stroke="none" />
    </svg>
  ),
  // Impôts : Marianne stylisée — colonne classique
  IMPOTS: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-6 9 6" />
      <path d="M4 9v10" />
      <path d="M20 9v10" />
      <path d="M2 21h20" />
      <path d="M8 19V11" />
      <path d="M12 19V11" />
      <path d="M16 19V11" />
    </svg>
  ),
};

export const ORGANISMES = [
  { key: "GUSO",    label: "GUSO",          full: "Guichet Unique Spectacle Occasionnel", url: "https://www.guso.fr" },
  { key: "FT",      label: "France Travail", full: "France Travail",                       url: "https://www.francetravail.fr" },
  { key: "URSSAF",  label: "URSSAF",         full: "URSSAF Caisse Nationale",              url: "https://www.urssaf.fr" },
  { key: "AUDIENS", label: "Audiens",        full: "Groupe Audiens",                       url: "https://www.audiens.org" },
  { key: "CONGES",  label: "Congés Spectacles", full: "Caisse Congés Spectacles",         url: "https://www.conges-spectacles.com" },
  { key: "IMPOTS",  label: "Impôts",         full: "Impôts.gouv.fr",                       url: "https://www.impots.gouv.fr" },
];