import { useEffect, useState } from "react";

/**
 * Effet machine à écrire — lettre par lettre.
 * @param {string} text - texte cible
 * @param {number} speed - ms par caractère (défaut 22)
 * @param {boolean} active - démarre uniquement quand true
 */
export default function useTypewriter(text, speed = 22, active = true) {
  const [out, setOut] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!active) {
      setOut("");
      setDone(false);
      return;
    }
    setOut("");
    setDone(false);
    if (!text) {
      setDone(true);
      return;
    }
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(t);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(t);
  }, [text, speed, active]);

  return { text: out, done };
}