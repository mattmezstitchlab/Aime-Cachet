import React from "react";
import { useNavigate } from "react-router-dom";
import { Clock, MapPin, Sparkles, ExternalLink } from "lucide-react";
import { formatDateFR } from "@/lib/aimeData";

// Vue "programme minuté" d'un jour donné.
// Le déroulé s'adapte au type (Artiste/Technicien) et au secteur.

const PROGRAMMES = {
  artiste_spectacle: [
    { offset: -180, label: "Trajet & arrivée", desc: "Route, parking, accueil régie." },
    { offset: -90, label: "Balances", desc: "Réglages plateau, retours, son salle." },
    { offset: -45, label: "Loge", desc: "Échauffement, costume, concentration." },
    { offset: 0, label: "Set", desc: "Prestation sur scène — c'est l'heure." },
    { offset: 90, label: "Retour loge", desc: "Décompression, photos, rencontre public." },
    { offset: 150, label: "Route retour", desc: "Roadcase, contrats signés, départ." },
  ],
  technicien_spectacle: [
    { offset: -300, label: "Pré-prod", desc: "Vérification fiche technique, matériel." },
    { offset: -240, label: "Montage", desc: "Déchargement, accroche, câblage." },
    { offset: -120, label: "Réglages", desc: "Patch lumière/son, focus, cues." },
    { offset: -60, label: "Balances artistes", desc: "Niveaux, retours, derniers ajustements." },
    { offset: 0, label: "Show", desc: "Régie en direct." },
    { offset: 90, label: "Démontage", desc: "Rangement, charge camion, fiche départ." },
  ],
  artiste_audiovisuel: [
    { offset: -120, label: "Arrivée plateau", desc: "Loge, ordre de service, brief réalisation." },
    { offset: -60, label: "Maquillage / costume", desc: "HMC, dernières indications." },
    { offset: -15, label: "Répétition", desc: "Walkthrough, marquage, caméras." },
    { offset: 0, label: "Tournage", desc: "Prises principales — action." },
    { offset: 240, label: "Wrap", desc: "Validation rushes, libration, retour." },
  ],
  technicien_audiovisuel: [
    { offset: -180, label: "Préparation", desc: "Check matériel, cartes, câbles." },
    { offset: -120, label: "Mise en place", desc: "Caméras, son, lumière, monitoring." },
    { offset: -30, label: "Balances", desc: "Réglages définitifs avant tournage." },
    { offset: 0, label: "Tournage", desc: "Captation — action." },
    { offset: 240, label: "Rangement", desc: "Débit, sauvegarde rushes, retour." },
  ],
  default: [
    { offset: -120, label: "Préparation", desc: "Mise en place, derniers checks." },
    { offset: -30, label: "Mise en route", desc: "Démarrage, derniers réglages." },
    { offset: 0, label: "Prestation", desc: "C'est l'heure." },
    { offset: 90, label: "Clôture", desc: "Rangement, fin de prestation." },
  ],
};

function pickProgramme(p) {
  const type = (p.type || "").toLowerCase();
  const sector = (p.sector || "").toLowerCase();
  if (type === "artiste" && sector === "spectacle_vivant") return PROGRAMMES.artiste_spectacle;
  if (type === "technicien" && sector === "spectacle_vivant") return PROGRAMMES.technicien_spectacle;
  if (type === "artiste" && sector === "audiovisuel") return PROGRAMMES.artiste_audiovisuel;
  if (type === "technicien" && sector === "audiovisuel") return PROGRAMMES.technicien_audiovisuel;
  return PROGRAMMES.default;
}

function defaultHour(p) {
  // Heure de référence : 21h si pas précisé. (les fiches AIME ne portent pas d'heure aujourd'hui)
  return 21 * 60;
}

function fmt(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h < 0 || h > 24) {
    // wrap visuel
    const hh = ((h % 24) + 24) % 24;
    return `${String(hh).padStart(2, "0")}h${String(m).padStart(2, "0")}`;
  }
  return `${String(h).padStart(2, "0")}h${String(m).padStart(2, "0")}`;
}

export default function TimelineProgrammeView({ prestations = [], anchorDate }) {
  const navigate = useNavigate();
  const dateLabel = anchorDate
    ? (() => { const d = formatDateFR(anchorDate); return `${d.day} ${d.month} ${d.year}`; })()
    : "Aujourd'hui";

  if (!prestations.length) {
    return (
      <div className="bg-white rounded-3xl ring-1 ring-zinc-100 p-10 text-center">
        <Sparkles className="w-5 h-5 mx-auto text-zinc-300 mb-3" />
        <p className="text-sm text-zinc-500">Aucune prestation ce jour.</p>
        <p className="text-[12px] text-zinc-400 mt-1">Le mode Programme affiche le déroulé minuté d'une soirée.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {prestations.map((p) => {
        const ref = defaultHour(p);
        const STEPS = pickProgramme(p);
        return (
          <div key={p.id} className="bg-white rounded-3xl ring-1 ring-zinc-100 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-zinc-900 to-zinc-800 text-white flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-white/60">Programme · {dateLabel}</div>
                <div className="text-lg font-semibold mt-0.5">{p.employer || "Sans employeur"}</div>
                {p.location && (
                  <div className="text-[12px] text-white/70 mt-1 inline-flex items-center gap-1.5">
                    <MapPin className="w-3 h-3" /> {p.location}
                  </div>
                )}
              </div>
              <button
                onClick={() => navigate(`/fiche/${p.id}`)}
                className="text-[11px] inline-flex items-center gap-1 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full"
              >
                Fiche <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            <div className="relative px-6 py-6">
              <div className="absolute left-[44px] top-6 bottom-6 w-px bg-zinc-200" aria-hidden />
              {STEPS.map((step, idx) => {
                const t = ref + step.offset;
                const isMain = step.offset === 0;
                return (
                  <div key={idx} className="relative pl-14 mb-4 last:mb-0">
                    <div className={`absolute left-[36px] top-1.5 w-4 h-4 rounded-full ring-4 ring-white ${isMain ? "bg-aime-red" : "bg-zinc-300"}`} />
                    <div className="flex items-baseline gap-3">
                      <span className={`text-[12px] font-mono font-semibold tabular-nums ${isMain ? "text-aime-red" : "text-zinc-500"}`}>
                        {fmt(t)}
                      </span>
                      <span className={`text-[13px] font-semibold ${isMain ? "text-zinc-900" : "text-zinc-700"}`}>{step.label}</span>
                    </div>
                    <div className="text-[12px] text-zinc-500 mt-0.5">{step.desc}</div>
                  </div>
                );
              })}
            </div>

            <div className="px-6 py-3 bg-zinc-50 border-t border-zinc-100 flex items-center gap-2 text-[11px] text-zinc-500">
              <Clock className="w-3 h-3" />
              Programme indicatif — ajustez les horaires côté fiche.
            </div>
          </div>
        );
      })}
    </div>
  );
}