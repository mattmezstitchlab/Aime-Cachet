export const STATUS_META = {
  brouillon: { label: "Brouillon", dot: "border border-zinc-500 bg-transparent", text: "text-zinc-500" },
  a_completer: { label: "À compléter", dot: "bg-aime-red", text: "text-aime-red" },
  pret_a_verifier: { label: "Prêt à vérifier", dot: "bg-white", text: "text-white" },
  transmis: { label: "Transmis", dot: "bg-zinc-400 ring-2 ring-zinc-700", text: "text-zinc-300" },
  valide: { label: "Validé", dot: "bg-aime-red ring-2 ring-aime-red/30", text: "text-white" },
};

export const ORGANISMES = [
  { id: "guso", code: "G", name: "GUSO", role: "Déclaration et paiement des cotisations des employeurs occasionnels du spectacle.", url: "https://www.guso.fr" },
  { id: "ft", code: "FT", name: "France Travail Spectacle", role: "Actualisation, droits, justificatifs, 507 heures, indemnisation.", url: "https://www.francetravail.fr" },
  { id: "unedic", code: "U", name: "Unédic", role: "Réglementation de l'assurance chômage des intermittents.", url: "https://www.unedic.org" },
  { id: "audiens", code: "A", name: "Audiens / Congés Spectacles", role: "Protection sociale, retraite, prévoyance, congés payés.", url: "https://www.audiens.org" },
  { id: "urssaf", code: "Ur", name: "Urssaf", role: "Déclarations sociales, cotisations, conformité employeur.", url: "https://www.urssaf.fr" },
  { id: "emp", code: "E", name: "Employeur / Production", role: "Informations, contrat, justificatifs et documents liés à la prestation.", url: "#" },
];

export function formatDateFR(iso) {
  if (!iso) return { day: "—", month: "", year: "" };
  const months = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
  const d = new Date(iso);
  return { day: String(d.getDate()).padStart(2, "0"), month: months[d.getMonth()], year: d.getFullYear() };
}

// Date relative pour l'historique : "à l'instant", "Il y a 2 h", "Hier 14:32", "12 mai 19:30"
export function formatRelativeFR(iso) {
  if (!iso) return "";
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMin / 60);

  const hhmm = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

  if (diffMin < 1) return "À l'instant";
  if (diffMin < 60) return `Il y a ${diffMin} min`;

  const sameDay = date.toDateString() === now.toDateString();
  if (sameDay) return `Aujourd'hui ${hhmm}`;

  const yest = new Date(now);
  yest.setDate(now.getDate() - 1);
  if (date.toDateString() === yest.toDateString()) return `Hier ${hhmm}`;

  if (diffH < 24 * 7) {
    const days = ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."];
    return `${days[date.getDay()]} ${hhmm}`;
  }

  const { day, month, year } = formatDateFR(iso);
  return year === now.getFullYear() ? `${day} ${month}` : `${day} ${month} ${year}`;
}

// Simulateur : calcule heures validées/en cours sur 12 mois glissants (référence intermittents)
// Aligne sur le moteur officiel : 1 cachet = 12h, statuts comptes = valide/transmis/pret_a_verifier.
export function computeSimulator(prestations) {
  const now = new Date();
  const startRef = new Date(now);
  startRef.setMonth(now.getMonth() - 12);

  const hoursOf = (p) => {
    const cachets = Number(p.cachets || 0);
    if (cachets > 0) return cachets * 12;
    return Number(p.duration_hours || 0);
  };

  let validated = 0;
  let inProgress = 0;

  for (const p of prestations) {
    if (!p?.date) continue;
    const d = new Date(p.date);
    if (d < startRef || d > now) continue;
    const h = hoursOf(p);
    if (!h) continue;

    if (p.status === "valide") validated += h;
    else if (p.status === "transmis" || p.status === "pret_a_verifier") inProgress += h;
  }

  validated = Math.round(validated);
  inProgress = Math.round(inProgress);

  const objective = 507;
  const total = validated + inProgress;
  const percent = Math.min(100, Math.round((total / objective) * 100));

  const fmt = (d) => `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;

  return {
    validated,
    inProgress,
    total,
    objective,
    percent,
    periodLabel: `${fmt(startRef)} → ${fmt(now)}`,
  };
}

// Compteurs "À traiter aujourd'hui"
export function computeTodayCounters(prestations) {
  const brouillons = prestations.filter((p) => p.status === "brouillon").length;
  const aCompleter = prestations.filter((p) => p.status === "a_completer").length;
  const totalDocsManquants = prestations.reduce((sum, p) => sum + (p.missing_documents || 0), 0);
  const pretsAVerifier = prestations.filter((p) => p.status === "pret_a_verifier").length;
  return { brouillons, aCompleter, totalDocsManquants, pretsAVerifier };
}

// Alias court pour TimelineLogItem
export const formatRelative = formatRelativeFR;

// Libellé jour court pour la timeline : { day: "12", month: "mai" }
export function formatDayLabel(iso) {
  const { day, month } = formatDateFR(iso);
  return { day, month };
}

// Construit les groupes mensuels pour la timeline
// Retourne [{ key, label, isCurrent, isPast, items: [{type:'prestation', prestation, logs:[]} | {type:'log', event}] }]
export function buildTimeline(prestations = [], events = []) {
  const months = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  const now = new Date();
  const curKey = `${now.getFullYear()}-${now.getMonth()}`;

  const map = new Map();
  const ensure = (date) => {
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    if (!map.has(key)) {
      map.set(key, {
        key,
        year: date.getFullYear(),
        monthIdx: date.getMonth(),
        label: `${months[date.getMonth()]} ${date.getFullYear()}`,
        isCurrent: key === curKey,
        isPast: date < new Date(now.getFullYear(), now.getMonth(), 1),
        prestations: [],
        logs: [],
      });
    }
    return map.get(key);
  };

  for (const p of prestations) {
    if (!p.date) continue;
    const d = new Date(p.date);
    ensure(d).prestations.push(p);
  }
  for (const e of events) {
    const ref = e.created_date || e.updated_date;
    if (!ref) continue;
    ensure(new Date(ref)).logs.push(e);
  }

  const groups = Array.from(map.values()).sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.monthIdx - a.monthIdx;
  });

  // Construit items : prestation (avec logs liés) + logs orphelins triés par date desc
  return groups.map((g) => {
    g.prestations.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    const prestationIds = new Set(g.prestations.map((p) => p.id));
    const linkedByPrestation = new Map();
    const orphanLogs = [];
    for (const ev of g.logs) {
      if (ev.prestation_id && prestationIds.has(ev.prestation_id)) {
        if (!linkedByPrestation.has(ev.prestation_id)) linkedByPrestation.set(ev.prestation_id, []);
        linkedByPrestation.get(ev.prestation_id).push(ev);
      } else {
        orphanLogs.push(ev);
      }
    }
    orphanLogs.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));

    const items = [];
    for (const p of g.prestations) {
      items.push({ type: "prestation", prestation: p, logs: linkedByPrestation.get(p.id) || [] });
    }
    for (const ev of orphanLogs) {
      items.push({ type: "log", event: ev });
    }
    return { key: g.key, label: g.label, isCurrent: g.isCurrent, isPast: g.isPast, items };
  });
}