// Moteur officiel intermittents du spectacle — annexes 8 & 10
// Basé sur la convention 2016 / règles Unédic & France Travail 2025-2026.
// Indicatif. Les chiffres définitifs sont communiqués par France Travail.

// =========================================================================
// CONSTANTES OFFICIELLES
// =========================================================================
export const RULES = {
  NH_REQUIRED: 507,             // heures requises sur PRA
  PRA_DAYS: 365,                // période de référence d'affiliation (jours)
  CACHET_HOURS: 12,             // 1 cachet = 12h (universel depuis 2016)
  CACHETS_MAX_MONTH: 28,        // plafond cachets/mois retenus
  PRA_EXTEND_HOURS: 42,         // allongement +42h pour +30j
  PRA_EXTEND_DAYS: 30,
  TEACH_FORMATION_CAP_RATIO: 2 / 3, // enseignement + formation plafonnés à 2/3 × NH = 338h
  TEACHING_CAP_UNDER_50: 70,    // enseignement <50 ans
  TEACHING_CAP_OVER_50: 120,    // enseignement ≥50 ans
  ASSIMILATED_HOURS_PER_DAY: 5, // maladie/maternité/AT : 5h/jour
  SMIC_HOURLY_2026: 12.02,      // SMIC brut horaire 01/01/2026
  AJ_MIN: 38.46,                // AJ minimale 2025 (indicative, à actualiser)
  MIXED_ANNEXE_8_THRESHOLD: 260, // 260h tech sur 365j → annexe 8 possible
  MIXED_ANNEXE_10_THRESHOLD: 250, // 250h artiste sur 365j → annexe 10 possible
  CP_FRANCHISE_PER_24D: 2.5,    // 2,5j de franchise CP pour 24j travaillés
  CP_FRANCHISE_MAX: 30,         // plafond franchise CP : 30j
};

// Coefficients allocation journalière A+B+C
// Source : Unédic, ARTCENA, taux indicatifs annexes 8 & 10
export const AJ_COEFS = {
  annexe8: {  // techniciens
    A: { low: 0.42, high: 0.05, threshold: 14400, divisor: 5000 },
    B: { low: 0.26, high: 0.08, threshold: 720, divisor: 507 },
    C: 0.70,
  },
  annexe10: { // artistes
    A: { low: 0.36, high: 0.05, threshold: 14400, divisor: 5000 },
    B: { low: 0.26, high: 0.08, threshold: 720, divisor: 507 },
    C: 0.70,
  },
};

// =========================================================================
// UTILITAIRES DATES
// =========================================================================
export const daysBetween = (a, b) => Math.round((new Date(a) - new Date(b)) / 86400000);
export const addDays = (date, n) => {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
};
export const fmtDateFR = (d) => {
  const dt = new Date(d);
  return `${String(dt.getDate()).padStart(2, "0")}/${String(dt.getMonth() + 1).padStart(2, "0")}/${dt.getFullYear()}`;
};

// =========================================================================
// 1. AGRÉGATION DES HEURES PAR ANNEXE
// =========================================================================

/**
 * Convertit une prestation en heures comptées.
 * - Si cachets présents : nb_cachets × 12h
 * - Sinon : duration_hours
 * Retourne 0 si invalide.
 */
export function prestationHours(p) {
  if (!p) return 0;
  const cachets = Number(p.cachets || 0);
  if (cachets > 0) return cachets * RULES.CACHET_HOURS;
  return Number(p.duration_hours || 0);
}

/**
 * Statuts comptés : valide (certain) + transmis/pret_a_verifier (en cours).
 * Brouillon et a_completer = non comptés.
 */
export function isCounted(p) {
  return ["valide", "transmis", "pret_a_verifier"].includes(p?.status);
}
export function isValidated(p) {
  return p?.status === "valide";
}

/**
 * Filtre les prestations dans la fenêtre [start, end].
 */
export function filterInWindow(prestations, start, end) {
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  return prestations.filter((p) => {
    if (!p?.date) return false;
    const t = new Date(p.date).getTime();
    return t >= s && t <= e;
  });
}

// =========================================================================
// 2. DÉTECTION ANNEXE MAJORITAIRE
// =========================================================================

export function aggregateByAnnexe(prestations) {
  let hoursA8 = 0;        // technicien
  let hoursA10 = 0;       // artiste
  let validatedA8 = 0;
  let validatedA10 = 0;
  let salaryA8 = 0;
  let salaryA10 = 0;

  for (const p of prestations) {
    if (!isCounted(p)) continue;
    const h = prestationHours(p);
    if (!h) continue;
    const amount = Number(p.amount || 0);
    const isTech = p.type === "Technicien" || p.annexe === "8";

    if (isTech) {
      hoursA8 += h;
      salaryA8 += amount;
      if (isValidated(p)) validatedA8 += h;
    } else {
      hoursA10 += h;
      salaryA10 += amount;
      if (isValidated(p)) validatedA10 += h;
    }
  }

  const total = hoursA8 + hoursA10;
  const major = hoursA10 >= hoursA8 ? "annexe10" : "annexe8";
  const mixed = hoursA8 >= RULES.MIXED_ANNEXE_8_THRESHOLD && hoursA10 >= RULES.MIXED_ANNEXE_10_THRESHOLD;

  return {
    hoursA8, hoursA10, total,
    validatedA8, validatedA10,
    salaryA8, salaryA10,
    major,                       // "annexe8" | "annexe10"
    majorLabel: major === "annexe8" ? "Annexe 8 — Technicien" : "Annexe 10 — Artiste",
    mixed,                       // cumul possible
    ratioA8: total > 0 ? hoursA8 / total : 0,
    ratioA10: total > 0 ? hoursA10 / total : 0,
  };
}

// =========================================================================
// 3. HEURES ASSIMILÉES (formation, maladie, maternité…)
// =========================================================================

/**
 * Calcule les heures assimilées à partir d'événements optionnels.
 * Le moteur reste fonctionnel même sans données (renvoie 0).
 * Structure attendue d'un event : { kind, hours?, days? }
 * - kind: "formation" | "enseignement" | "maladie" | "maternite" | "accident_travail" | "cpf_transition"
 */
export function computeAssimilated(events = [], { age = 35 } = {}) {
  let formation = 0;
  let teaching = 0;
  let sickness = 0; // maladie
  let maternity = 0;
  let workAccident = 0;
  let cpfTransition = 0;

  for (const ev of events) {
    if (!ev) continue;
    const h = Number(ev.hours || 0);
    const d = Number(ev.days || 0);
    switch (ev.kind) {
      case "formation": formation += h; break;
      case "enseignement": teaching += h; break;
      case "maladie": sickness += d * RULES.ASSIMILATED_HOURS_PER_DAY; break;
      case "maternite": maternity += d * RULES.ASSIMILATED_HOURS_PER_DAY; break;
      case "accident_travail": workAccident += d * RULES.ASSIMILATED_HOURS_PER_DAY; break;
      case "cpf_transition": cpfTransition += h; break;
      default: break;
    }
  }

  // Plafonds
  const teachingCap = age >= 50 ? RULES.TEACHING_CAP_OVER_50 : RULES.TEACHING_CAP_UNDER_50;
  const teachingRetained = Math.min(teaching, teachingCap);
  const formationTeachingCap = Math.round(RULES.NH_REQUIRED * RULES.TEACH_FORMATION_CAP_RATIO); // 338h
  const totalTF = teachingRetained + formation;
  const tfRetained = Math.min(totalTF, formationTeachingCap);
  // Si dépassement, on rogne d'abord la formation
  const formationRetained = Math.max(0, tfRetained - teachingRetained);

  const totalAssimilated = tfRetained + sickness + maternity + workAccident + cpfTransition;

  return {
    formation, formationRetained,
    teaching, teachingRetained, teachingCap,
    sickness, maternity, workAccident, cpfTransition,
    formationTeachingCap,
    totalAssimilated,
  };
}

// =========================================================================
// 4. PRA DYNAMIQUE — recherche allongée si <507h
// =========================================================================

/**
 * Détermine la PRA effective : par défaut 365j.
 * Si nh < NH sur 365j → on étend par paliers de +30j (+42h required).
 * On arrête quand on atteint NH_extended ou quand on dépasse une limite raisonnable (3 ans).
 */
export function computeDynamicPra(prestations, events = [], today = new Date(), maxDays = 365 * 3) {
  let pra = RULES.PRA_DAYS;
  let nhRequired = RULES.NH_REQUIRED;
  let extension = 0;

  while (pra <= maxDays) {
    const start = addDays(today, -pra);
    const window = filterInWindow(prestations, start, today);
    const ann = aggregateByAnnexe(window);
    const assim = computeAssimilated(events);
    const totalHours = ann.total + assim.totalAssimilated;

    if (totalHours >= nhRequired) {
      return {
        praDays: pra,
        nhRequired,
        extension,
        start,
        end: today,
        achieved: true,
        totalHours,
        annexe: ann,
        assimilated: assim,
      };
    }

    // pas assez d'heures → on étend
    pra += RULES.PRA_EXTEND_DAYS;
    nhRequired += RULES.PRA_EXTEND_HOURS;
    extension += 1;
  }

  // Limite atteinte
  const start = addDays(today, -RULES.PRA_DAYS);
  const window = filterInWindow(prestations, start, today);
  const ann = aggregateByAnnexe(window);
  const assim = computeAssimilated(events);
  return {
    praDays: RULES.PRA_DAYS,
    nhRequired: RULES.NH_REQUIRED,
    extension: 0,
    start,
    end: today,
    achieved: false,
    totalHours: ann.total + assim.totalAssimilated,
    annexe: ann,
    assimilated: assim,
  };
}

// =========================================================================
// 5. DATE ANNIVERSAIRE
// =========================================================================

/**
 * Date anniversaire = 12 mois après la dernière fin de contrat retenue.
 * À défaut (pas d'ouverture connue) : 12 mois après la dernière prestation.
 * Si openingDate fourni : openingDate + 365j.
 */
export function computeAnniversary(prestations, { openingDate = null, today = new Date() } = {}) {
  let anniv = null;
  if (openingDate) {
    anniv = addDays(openingDate, RULES.PRA_DAYS);
  } else {
    const sorted = prestations
      .filter((p) => p?.date && isCounted(p))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    if (sorted[0]) anniv = addDays(sorted[0].date, RULES.PRA_DAYS);
  }
  if (!anniv) return null;

  const daysRemaining = Math.max(0, daysBetween(anniv, today));
  return {
    date: anniv,
    label: fmtDateFR(anniv),
    daysRemaining,
    isPast: anniv < today,
    isCritical: daysRemaining <= 60 && daysRemaining > 0,
  };
}

// =========================================================================
// 6. ALLOCATION JOURNALIÈRE — formule A+B+C
// =========================================================================

/**
 * Calcule l'allocation journalière brute selon la formule officielle.
 * @param {number} SR  Salaire de Référence (brut sur PRA)
 * @param {number} NHT Nombre d'Heures Travaillées (cachets convertis inclus)
 * @param {string} annexe "annexe8" | "annexe10"
 */
export function computeAJ(SR, NHT, annexe = "annexe8") {
  const c = AJ_COEFS[annexe] || AJ_COEFS.annexe8;
  const AJmin = RULES.AJ_MIN;

  const aSR = Math.min(SR, c.A.threshold) * c.A.low + Math.max(0, SR - c.A.threshold) * c.A.high;
  const A = (AJmin * aSR) / c.A.divisor;

  const bH = Math.min(NHT, c.B.threshold) * c.B.low + Math.max(0, NHT - c.B.threshold) * c.B.high;
  const B = (AJmin * bH) / c.B.divisor;

  const C = AJmin * c.C;

  const ajBrute = A + B + C;

  return {
    A: round2(A),
    B: round2(B),
    C: round2(C),
    ajBrute: round2(ajBrute),
    ajMin: AJmin,
    SR, NHT, annexe,
  };
}

// Estimation simplifiée AJ nette (≈ 90% du brut après prélèvements sociaux indicatifs)
export function ajNetEstimate(ajBrute) {
  return round2(ajBrute * 0.90);
}

// Mensuel estimé (sur 30 jours, hors franchises)
export function ajMonthlyEstimate(ajBrute, daysIndemnisable = 30) {
  return round2(ajBrute * daysIndemnisable);
}

// =========================================================================
// 7. FRANCHISES (estimation)
// =========================================================================

/**
 * Franchise congés payés : 2,5j par 24j travaillés, plafond 30j.
 * On approxime jours travaillés ≈ total heures / 7 (≈ 7h/jour moyen).
 */
export function computeCpFranchise(totalHours) {
  const daysWorked = totalHours / 7;
  const days = Math.min(RULES.CP_FRANCHISE_MAX, (daysWorked / 24) * RULES.CP_FRANCHISE_PER_24D);
  return Math.round(days);
}

// =========================================================================
// 8. SYNTHÈSE COMPLÈTE — appelée par la page Dashboard
// =========================================================================

export function buildDashboard507(prestations = [], events = [], opts = {}) {
  const today = opts.today || new Date();
  const age = opts.age || 35;

  // PRA dynamique
  const pra = computeDynamicPra(prestations, events, today);
  const { annexe, assimilated, totalHours, nhRequired, praDays, extension, achieved, start, end } = pra;

  // Annexe choisie
  const annexeKey = annexe.major;

  // SR + NHT pour AJ
  const SR = annexeKey === "annexe8" ? annexe.salaryA8 : annexe.salaryA10;
  const NHT = annexeKey === "annexe8" ? annexe.hoursA8 : annexe.hoursA10;

  // Allocation journalière
  const aj = computeAJ(SR, NHT, annexeKey);
  const ajNet = ajNetEstimate(aj.ajBrute);
  const ajMonthly = ajMonthlyEstimate(aj.ajBrute, 30);
  const ajMonthlyNet = ajMonthlyEstimate(ajNet, 30);

  // Anniversaire
  const anniversary = computeAnniversary(prestations, { today });

  // Franchise
  const cpFranchise = computeCpFranchise(totalHours);

  // Manque ?
  const missingHours = Math.max(0, nhRequired - totalHours);
  const percent = Math.min(100, Math.round((totalHours / nhRequired) * 100));

  // Suggestions "et si"
  const suggestions = buildSuggestions({ missingHours, anniversary, annexe, assimilated, today });

  return {
    today,
    period: { start, end, days: praDays, label: `${fmtDateFR(start)} → ${fmtDateFR(end)}` },
    extended: extension > 0,
    extensions: extension,
    nhRequired,
    annexe,
    assimilated,
    totalHours: round2(totalHours),
    missingHours,
    percent,
    achieved,
    annexeKey,
    SR: round2(SR),
    NHT: round2(NHT),
    aj,
    ajNet,
    ajMonthly,
    ajMonthlyNet,
    anniversary,
    cpFranchise,
    suggestions,
  };
}

// =========================================================================
// 9. SCÉNARIOS "ET SI"
// =========================================================================

function buildSuggestions({ missingHours, anniversary, annexe, assimilated, today }) {
  const out = [];
  if (missingHours <= 0) {
    out.push({
      kind: "ok",
      title: "Vous atteignez les heures requises",
      detail: "Vos droits peuvent être ouverts ou renouvelés à la date anniversaire.",
    });
    return out;
  }

  // Cachets nécessaires
  const cachetsNeeded = Math.ceil(missingHours / RULES.CACHET_HOURS);
  out.push({
    kind: "cachets",
    title: `${cachetsNeeded} cachet${cachetsNeeded > 1 ? "s" : ""} suffi${cachetsNeeded > 1 ? "sent" : "t"}`,
    detail: `Un cachet = 12h. Il vous manque ${Math.round(missingHours)}h.`,
    impact: cachetsNeeded * RULES.CACHET_HOURS,
  });

  // Formation AFDAS
  const formationCap = Math.round(RULES.NH_REQUIRED * RULES.TEACH_FORMATION_CAP_RATIO);
  const formationUsed = assimilated.formationRetained + assimilated.teachingRetained;
  const formationAvailable = Math.max(0, formationCap - formationUsed);
  if (formationAvailable > 0) {
    out.push({
      kind: "formation",
      title: `Jusqu'à ${formationAvailable}h de formation AFDAS éligibles`,
      detail: `Plafond enseignement + formation : ${formationCap}h sur la période (utilisé : ${formationUsed}h).`,
      impact: Math.min(formationAvailable, missingHours),
    });
  }

  // Heures techniciennes en heures
  out.push({
    kind: "heures",
    title: `${Math.round(missingHours)}h de prestation technicien ou artiste en heures`,
    detail: "Équivalent à environ " + Math.ceil(missingHours / 8) + " journée(s) de 8h.",
    impact: missingHours,
  });

  // Clause de rattrapage
  if (anniversary?.isCritical) {
    out.push({
      kind: "rattrapage",
      title: "Clause de rattrapage activable",
      detail: "Si 507h non atteintes à la date anniversaire, une avance d'indemnisation est possible au même taux.",
    });
  }

  return out;
}

// =========================================================================
// HELPERS
// =========================================================================
function round2(n) { return Math.round((Number(n) || 0) * 100) / 100; }