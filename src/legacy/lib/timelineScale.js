// Multi-échelle timeline : year / month / day / programme
// year   = groupes par mois (vue actuelle)
// month  = groupes par semaine du mois courant
// day    = un seul jour avec items horaires
// programme = vue détaillée d'un jour (déroulé minuté)

export const TIMELINE_SCALES = [
  { id: "year", label: "Année", help: "Vue par mois" },
  { id: "month", label: "Mois", help: "Vue par semaine" },
  { id: "day", label: "Jour", help: "Vue par heure" },
  { id: "programme", label: "Programme", help: "Déroulé minuté" },
];

const MONTHS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

function startOfWeek(d) {
  const date = new Date(d);
  const day = date.getDay(); // 0 = dim
  const diff = day === 0 ? -6 : 1 - day; // semaine commence lundi
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function fmtDay(d) {
  return `${String(d.getDate()).padStart(2, "0")} ${MONTHS[d.getMonth()].slice(0, 4)}.`;
}

// Construit les groupes selon l'échelle.
export function buildTimelineScaled(prestations = [], events = [], scale = "year", anchorDate = null) {
  if (scale === "year") return buildYear(prestations, events);
  if (scale === "month") return buildMonth(prestations, events, anchorDate);
  if (scale === "day" || scale === "programme") return buildDay(prestations, events, anchorDate);
  return buildYear(prestations, events);
}

function buildYear(prestations, events) {
  const now = new Date();
  const curKey = `${now.getFullYear()}-${now.getMonth()}`;
  const map = new Map();
  const ensure = (date) => {
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    if (!map.has(key)) {
      map.set(key, {
        key, year: date.getFullYear(), monthIdx: date.getMonth(),
        label: `${MONTHS[date.getMonth()]} ${date.getFullYear()}`,
        isCurrent: key === curKey,
        prestations: [], logs: [],
      });
    }
    return map.get(key);
  };
  for (const p of prestations) { if (!p.date) continue; ensure(new Date(p.date)).prestations.push(p); }
  for (const e of events) {
    const ref = e.created_date || e.updated_date; if (!ref) continue;
    ensure(new Date(ref)).logs.push(e);
  }
  return assemble(Array.from(map.values()).sort((a, b) => (b.year - a.year) || (b.monthIdx - a.monthIdx)));
}

function buildMonth(prestations, events, anchorDate) {
  const anchor = anchorDate ? new Date(anchorDate) : new Date();
  const start = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const end = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0);
  const map = new Map();
  const ensure = (date) => {
    const ws = startOfWeek(date);
    const key = ws.toISOString().slice(0, 10);
    if (!map.has(key)) {
      const we = new Date(ws); we.setDate(we.getDate() + 6);
      const today = new Date(); today.setHours(0,0,0,0);
      map.set(key, {
        key, sortDate: ws,
        label: `Semaine du ${fmtDay(ws)} → ${fmtDay(we)}`,
        isCurrent: today >= ws && today <= we,
        prestations: [], logs: [],
      });
    }
    return map.get(key);
  };
  for (const p of prestations) {
    if (!p.date) continue;
    const d = new Date(p.date);
    if (d < start || d > end) continue;
    ensure(d).prestations.push(p);
  }
  for (const e of events) {
    const ref = e.created_date || e.updated_date; if (!ref) continue;
    const d = new Date(ref);
    if (d < start || d > end) continue;
    ensure(d).logs.push(e);
  }
  return assemble(Array.from(map.values()).sort((a, b) => b.sortDate - a.sortDate));
}

function buildDay(prestations, events, anchorDate) {
  const anchor = anchorDate ? new Date(anchorDate) : new Date();
  anchor.setHours(0,0,0,0);
  const end = new Date(anchor); end.setDate(end.getDate() + 1);
  const dayLabel = `${anchor.getDate()} ${MONTHS[anchor.getMonth()]} ${anchor.getFullYear()}`;
  const group = {
    key: anchor.toISOString().slice(0,10),
    label: dayLabel,
    isCurrent: anchor.toDateString() === new Date().toDateString(),
    prestations: [], logs: [],
  };
  for (const p of prestations) {
    if (!p.date) continue;
    const d = new Date(p.date);
    if (d >= anchor && d < end) group.prestations.push(p);
  }
  for (const e of events) {
    const ref = e.created_date || e.updated_date; if (!ref) continue;
    const d = new Date(ref);
    if (d >= anchor && d < end) group.logs.push(e);
  }
  return assemble([group]);
}

function assemble(groups) {
  return groups.map((g) => {
    g.prestations.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    const ids = new Set(g.prestations.map((p) => p.id));
    const linked = new Map();
    const orphans = [];
    for (const ev of g.logs) {
      if (ev.prestation_id && ids.has(ev.prestation_id)) {
        if (!linked.has(ev.prestation_id)) linked.set(ev.prestation_id, []);
        linked.get(ev.prestation_id).push(ev);
      } else orphans.push(ev);
    }
    orphans.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    const items = [];
    for (const p of g.prestations) items.push({ type: "prestation", prestation: p, logs: linked.get(p.id) || [] });
    for (const ev of orphans) items.push({ type: "log", event: ev });
    return { key: g.key, label: g.label, isCurrent: g.isCurrent, items };
  });
}

// Calcule la densité d'un jour (pour le halo de chaleur).
export function densityHeat(count) {
  if (count <= 0) return "none";
  if (count === 1) return "low";
  if (count === 2) return "mid";
  if (count <= 4) return "high";
  return "blaze";
}

// Détecte les jalons 507h franchis (sur ordre chronologique cumulatif).
export function detectMilestones(prestations = []) {
  const sorted = [...prestations]
    .filter((p) => p.date && p.duration_hours && (p.status === "valide" || p.status === "transmis"))
    .sort((a, b) => (a.date || "").localeCompare(b.date || ""));
  const milestones = [];
  let cum = 0;
  const thresholds = [{ at: 169, label: "169 h" }, { at: 338, label: "338 h" }, { at: 507, label: "507 h — Annexe sécurisée" }];
  for (const p of sorted) {
    const before = cum;
    cum += p.duration_hours;
    for (const t of thresholds) {
      if (before < t.at && cum >= t.at) {
        milestones.push({ atDate: p.date, label: t.label, threshold: t.at, prestationId: p.id });
      }
    }
  }
  return milestones;
}

// Groupe les employeurs récurrents (≥2 prestations).
export function detectRecurringEmployers(prestations = []) {
  const map = new Map();
  for (const p of prestations) {
    const key = (p.employer || "").trim().toLowerCase();
    if (!key) continue;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(p);
  }
  const recurring = [];
  for (const [key, list] of map) {
    if (list.length >= 2) recurring.push({ employerKey: key, employer: list[0].employer, prestations: list });
  }
  return recurring;
}