// Applique les préférences utilisateur au DOM (thème, densité).
// Appelée au boot + après chaque sauvegarde dans Paramètres.

import { getUserPrefs } from "@/lib/userPrefs";

export function applyUserPrefs(prefs = null) {
  const p = prefs || getUserPrefs();
  const root = document.documentElement;

  // Thème (light/dark) — bascule la classe 'dark' sur <html>
  if (p.theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }

  // Densité — attribut data-density utilisable en CSS global si besoin
  root.dataset.density = p.density || "comfortable";
}