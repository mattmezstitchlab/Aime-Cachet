// ============================================================================
// MachineEmployerTicker — petites notes simulées (employeur / contact / organisme)
// défilant en boucle sous la mosaïque. Repère rassurant : "on a pensé à eux".
// Non-fonctionnel : aucun appel externe, c'est un repère visuel.
// ============================================================================

import React, { useEffect, useState } from "react";

const NOTES = [
  { who: "Théâtre du Soleil", text: "Merci, contrat reçu, on prépare la paie pour le 15." },
  { who: "GUSO", text: "Déclaration bien réceptionnée pour la prestation du 12 avril." },
  { who: "France Travail", text: "Vos justificatifs nous parviennent, dossier en cours d'examen." },
  { who: "Production Lumière", text: "Bien noté pour le cachet, on revient vers toi cette semaine." },
  { who: "Audiens", text: "Votre attestation employeur a été ajoutée à votre dossier." },
  { who: "Festival d'Avignon", text: "Tout est OK de notre côté, à très vite sur scène." },
  { who: "URSSAF Caisse Générale", text: "Cotisations bien créditées pour le mois écoulé." },
  { who: "Scène Nationale", text: "Devis validé, on signe l'engagement à la prochaine résidence." },
];

const ROTATE_MS = 4500;

export default function MachineEmployerTicker() {
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % NOTES.length);
        setFade(true);
      }, 350);
    }, ROTATE_MS);
    return () => clearInterval(t);
  }, []);

  const note = NOTES[idx];

  return (
    <div className="mt-2 px-2 flex flex-col items-center justify-center text-center" aria-live="polite">
      <div
        className={`text-[13px] italic text-zinc-500 leading-tight transition-opacity duration-300 max-w-[92%] line-clamp-2 ${
          fade ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="text-zinc-600">«&nbsp;</span>
        {note.text}
        <span className="text-zinc-600">&nbsp;»</span>
        <span className="not-italic text-zinc-600"> — {note.who}</span>
      </div>
    </div>
  );
}