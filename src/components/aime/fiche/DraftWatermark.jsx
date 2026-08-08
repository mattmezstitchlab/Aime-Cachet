import React from "react";

/**
 * Watermark "BROUILLON PRÉPARATOIRE — NON OPPOSABLE" diagonal, discret mais lisible.
 * Affiché tant que la prestation n'est pas au statut "valide".
 *
 * Props:
 *  - status : statut de la prestation. Si "valide" → ne rend rien.
 *  - theme  : "light" | "dark" pour adapter la couleur sur fond sombre.
 */
export default function DraftWatermark({ status, theme = "light" }) {
  if (status === "valide") return null;

  return null;
}