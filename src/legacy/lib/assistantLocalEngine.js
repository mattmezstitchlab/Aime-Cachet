// ============================================================================
// Moteur de calcul LOCAL pour l'Assistant AIME Intermittence (v1.7.2).
// But : répondre instantanément aux questions calculables à partir des
// prestations, SANS dépendre de l'IA. L'IA reste utilisée pour formuler /
// enrichir, mais ne bloque jamais l'utilisateur.
//
// Aucune donnée sensible n'est traitée ici. Lecture seule.
// ============================================================================

import { MACHINE_ROUTES, isToReseal } from "@/lib/machineContext";

const SAFETY =
  "AIME fournit une aide préparatoire et indicative. Les organismes officiels restent seuls compétents pour confirmer les droits, déclarations ou validations.";

// --- Helpers période -------------------------------------------------------
function isSameMonth(iso, ref = new Date()) {
  if (!iso) return false;
  const d = new Date(iso);
  return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
}
function isSameYear(iso, ref = new Date()) {
  if (!iso) return false;
  return new Date(iso).getFullYear() === ref.getFullYear();
}
function frMonthLabel(d = new Date()) {
  return d.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
}

// --- Détection d'intention (mots-clés simples) -----------------------------
function detectIntent(q) {
  const s = (q || "").toLowerCase();
  const has = (...words) => words.some((w) => s.includes(w));

  if (has("salut", "hello", "bonjour", "coucou", "bonsoir"))
    return "greeting";
  if (has("prioritaire", "prioritaires", "priorité", "priorites", "aujourd'hui", "aujourd’hui"))
    return "priorities";
  if (has("document", "documents", "manquant", "manquants", "manque"))
    return "missing_docs";
  if ((has("reste", "restant", "manque") && has("507")) || has("avant 507"))
    return "remaining_507";
  if (has("rappel", "rappeler", "reminder"))
    return "prepare_reminder";
  if (has("ce mois", "du mois", "mois-ci", "mois ci") && has("heure", "h ", "heures"))
    return "hours_this_month";
  if (has("cette année", "année", "annee") && has("heure", "heures"))
    return "hours_this_year";
  if (has("507") || has("période 507", "periode 507"))
    return "hours_507";

  if (has("à resceller", "a resceller", "resceller", "reseller"))
    return "to_reseal";
  if (has("sans employeur", "pas d'employeur", "manque employeur"))
    return "without_employer";
  if (has("brouillon"))
    return "drafts";
  if (has("incomplet", "à compléter", "a completer", "incomplète"))
    return "to_complete";
  if (has("vérifier", "verifier", "prêt à vérifier", "pret a verifier"))
    return "to_verify";
  if (has("scellée", "scellees", "scellé", "scelle"))
    return "sealed";
  if (has("qr"))
    return "with_qr";
  if (has("validée", "validees", "validé", "valide"))
    return "validated";
  if (has("en cours"))
    return "in_progress";
  if (has("combien de fiche", "nombre de fiche", "total de fiche"))
    return "total_count";

  return null;
}

// --- Composeur de réponse locale -------------------------------------------
function recordsFrom(list, limit = 5) {
  return list.slice(0, limit).map((p) => ({
    title: p.cachet_code || p.employer || `Fiche ${p.id?.slice(0, 6) || ""}`,
    href: `/fiche/${p.id}`,
    status: p.status || "",
    code: p.cachet_code || "",
    prestation_id: p.id,
  }));
}

function plural(n, sing, plur) {
  return `${n} ${n > 1 ? plur : sing}`;
}

// Retourne une réponse structurée locale, ou null si l'intention n'est pas calculable.
export function answerLocally(question, { prestations = [], simulator = null } = {}) {
  const intent = detectIntent(question);
  if (!intent) return null;

  const now = new Date();
  const list = Array.isArray(prestations) ? prestations : [];

  switch (intent) {
    case "priorities": {
      const items = list
        .filter((p) => p.status === "a_completer" || (p.missing_documents || 0) > 0 || p.status === "pret_a_verifier")
        .sort((a, b) => (b.missing_documents || 0) - (a.missing_documents || 0));
      return {
        answer: items.length === 0
          ? "Aucune priorité forte aujourd'hui."
          : `${items.length} fiche(s) prioritaire(s) détectée(s).`,
        safetyNotice: SAFETY,
        suggestedActions: items.length === 0
          ? [
              { label: "Montre mes heures 507", type: "ask" },
              { label: "Prépare une nouvelle fiche", type: "ask" },
              { label: "Ouvrir le cockpit", href: MACHINE_ROUTES.cockpit507, type: "link" },
            ]
          : [
              { label: "Montre les manques", type: "ask" },
              { label: "Prépare un rappel", type: "ask" },
              { label: "Voir les fiches", href: MACHINE_ROUTES.toComplete, type: "link" },
            ],
        relatedRecords: recordsFrom(items),
        reminders: items.slice(0, 1).map((p) => ({ label: "Me rappeler cette priorité", target: `/fiche/${p.id}`, reason: "Fiche prioritaire détectée par AIME", prestation_id: p.id, cachet_code: p.cachet_code })),
        confidence: "high",
        source: "local",
      };
    }

    case "missing_docs": {
      const items = list.filter((p) => (p.missing_documents || 0) > 0 || p.status === "a_completer");
      const totalDocs = items.reduce((s, p) => s + (p.missing_documents || 0), 0);
      return {
        answer: items.length === 0
          ? "Aucun document manquant signalé."
          : `${totalDocs} doc(s) manquant(s) sur ${items.length} fiche(s).`,
        safetyNotice: SAFETY,
        suggestedActions: items.length === 0
          ? [
              { label: "Montre mes priorités", type: "ask" },
              { label: "Voir mes fiches", href: MACHINE_ROUTES.allPrestations, type: "link" },
            ]
          : [
              { label: "Liste les fiches concernées", type: "ask" },
              { label: "Prépare un rappel", type: "ask" },
              { label: "Voir les fiches", href: MACHINE_ROUTES.toComplete, type: "link" },
            ],
        relatedRecords: recordsFrom(items),
        reminders: [],
        confidence: "high",
        source: "local",
      };
    }

    case "remaining_507": {
      const t = simulator?.total ?? 0;
      const o = simulator?.objective ?? 507;
      const remaining = Math.max(0, o - t);
      return {
        answer: `Reste indicativement ${remaining} h sur ${o} h.`,
        safetyNotice: SAFETY,
        suggestedActions: [
          { label: "Combien validées, combien en cours ?", type: "ask" },
          { label: "Montre les heures du mois", type: "ask" },
          { label: "Ouvrir le cockpit", href: MACHINE_ROUTES.cockpit507, type: "link" },
        ],
        relatedRecords: [],
        reminders: [],
        confidence: "high",
        source: "local",
      };
    }

    case "prepare_reminder":
      return {
        answer: "Je peux préparer un rappel interne. Validation humaine requise.",
        safetyNotice: SAFETY,
        suggestedActions: [
          { label: "Rappel sur les fiches à compléter", type: "ask" },
          { label: "Rappel sur les docs manquants", type: "ask" },
          { label: "Voir mes rappels", href: MACHINE_ROUTES.reminders, type: "link" },
        ],
        relatedRecords: recordsFrom(list.filter((p) => p.status === "a_completer" || (p.missing_documents || 0) > 0)),
        reminders: [{ label: "Vérifier les priorités AIME", target: "/prestations", reason: "Rappel préparatoire demandé depuis la machine" }],
        confidence: "high",
        source: "local",
      };

    case "greeting":
      return {
        answer: "Salut. Que veux-tu vérifier ou préparer ?",
        safetyNotice: SAFETY,
        suggestedActions: [
          { label: "Mes heures 507", type: "ask" },
          { label: "Mes priorités", type: "ask" },
          { label: "Ce qui manque", type: "ask" },
        ],
        relatedRecords: [],
        reminders: [],
        confidence: "high",
        source: "local",
      };

    case "hours_this_month": {
      const monthList = list.filter((p) => isSameMonth(p.date, now) && p.duration_hours);
      const validated = monthList
        .filter((p) => p.status === "valide")
        .reduce((s, p) => s + (p.duration_hours || 0), 0);
      const inProgress = monthList
        .filter((p) => p.status === "transmis" || p.status === "pret_a_verifier")
        .reduce((s, p) => s + (p.duration_hours || 0), 0);
      const total = validated + inProgress;
      const label = frMonthLabel(now);
      const answer =
        total === 0
          ? `${label} : 0 h indicative. Complétez vos durées.`
          : `${label} : ${total} h indicatives (${validated} validées, ${inProgress} en cours).`;
      return {
        answer,
        safetyNotice: SAFETY,
        suggestedActions: [
          { label: "Combien sur 507 ?", type: "ask" },
          { label: "Quelles fiches vérifier ?", type: "ask" },
          { label: "Voir les fiches du mois", href: MACHINE_ROUTES.thisMonth, type: "link" },
        ],
        relatedRecords: recordsFrom(monthList),
        reminders: [],
        confidence: "high",
        source: "local",
      };
    }

    case "hours_this_year": {
      const yearList = list.filter((p) => isSameYear(p.date, now) && p.duration_hours);
      const total = yearList.reduce((s, p) => s + (p.duration_hours || 0), 0);
      return {
        answer:
          total === 0
            ? `${now.getFullYear()} : 0 h indicative.`
            : `${now.getFullYear()} : ${total} h cumulées indicativement.`,
        safetyNotice: SAFETY,
        suggestedActions: [
          { label: "Combien sur 507 ?", type: "ask" },
          { label: "Heures du mois ?", type: "ask" },
          { label: "Ouvrir le cockpit", href: MACHINE_ROUTES.cockpit507, type: "link" },
        ],
        relatedRecords: [],
        reminders: [],
        confidence: "high",
        source: "local",
      };
    }

    case "hours_507": {
      const v = simulator?.validated ?? 0;
      const p = simulator?.inProgress ?? 0;
      const t = simulator?.total ?? v + p;
      const o = simulator?.objective ?? 507;
      const pct = Math.min(100, Math.round((t / o) * 100));
      return {
        answer: `${t} h / ${o} h (${pct}%) — ${v} validées, ${p} en cours.`,
        safetyNotice: SAFETY,
        suggestedActions: [
          { label: "Combien il me reste ?", type: "ask" },
          { label: "Quoi compléter en priorité ?", type: "ask" },
          { label: "Ouvrir le cockpit", href: MACHINE_ROUTES.cockpit507, type: "link" },
        ],
        relatedRecords: [],
        reminders: [],
        confidence: "high",
        source: "local",
      };
    }

    case "to_reseal": {
      const items = list.filter(isToReseal);
      return {
        answer:
          items.length === 0
            ? "Aucune fiche à resceller pour le moment. Les fiches scellées sont cohérentes avec leurs dernières modifications."
            : `${plural(items.length, "fiche est à resceller", "fiches sont à resceller")} : elles ont été modifiées depuis leur dernier scellement technique.`,
        safetyNotice: SAFETY,
        suggestedActions: [
          { label: "Voir les fiches à resceller", href: MACHINE_ROUTES.toReseal, type: "link" },
          { label: "Voir les priorités", href: MACHINE_ROUTES.priorities, type: "link" },
          { label: "Ouvrir le cockpit 507", href: MACHINE_ROUTES.cockpit507, type: "link" },
        ],
        relatedRecords: recordsFrom(items),
        reminders: items.slice(0, 1).map((p) => ({
          label: "Me rappeler de resceller cette fiche",
          target: `/fiche/${p.id}`,
          reason: "Données modifiées depuis le dernier scellement technique",
          prestation_id: p.id,
          cachet_code: p.cachet_code,
        })),
        confidence: "high",
        source: "local",
      };
    }

    case "without_employer": {
      const items = list.filter((p) => !p.employer || !p.employer.trim());
      return {
        answer:
          items.length === 0
            ? "Toutes vos fiches ont un employeur renseigné."
            : `${plural(items.length, "fiche n'a pas d'employeur", "fiches n'ont pas d'employeur")} renseigné. Pensez à les compléter avant scellement.`,
        safetyNotice: SAFETY,
        suggestedActions: [{ label: "Voir mes fiches", href: MACHINE_ROUTES.allPrestations, type: "link" }],
        relatedRecords: recordsFrom(items),
        reminders: [],
        confidence: "high",
        source: "local",
      };
    }

    case "drafts": {
      const items = list.filter((p) => p.status === "brouillon");
      return {
        answer:
          items.length === 0
            ? "Aucune fiche en brouillon."
            : `${plural(items.length, "fiche est en brouillon", "fiches sont en brouillon")}. Pensez à les compléter ou à les sceller techniquement.`,
        safetyNotice: SAFETY,
        suggestedActions: [{ label: "Voir les brouillons", href: MACHINE_ROUTES.drafts, type: "link" }],
        relatedRecords: recordsFrom(items),
        reminders: items.length
          ? [
              {
                label: "Me rappeler de vérifier les brouillons",
                target: "/prestations",
                reason: `${items.length} fiche(s) en brouillon à vérifier`,
              },
            ]
          : [],
        confidence: "high",
        source: "local",
      };
    }

    case "to_complete": {
      const items = list.filter((p) => p.status === "a_completer" || (p.missing_documents || 0) > 0);
      return {
        answer:
          items.length === 0
            ? "Aucune fiche signalée comme incomplète."
            : `${plural(items.length, "fiche est incomplète", "fiches sont incomplètes")} (statut « à compléter » ou documents manquants).`,
        safetyNotice: SAFETY,
        suggestedActions: [{ label: "Voir les fiches à compléter", href: MACHINE_ROUTES.toComplete, type: "link" }],
        relatedRecords: recordsFrom(items),
        reminders: [],
        confidence: "high",
        source: "local",
      };
    }

    case "to_verify": {
      const items = list.filter((p) => p.status === "pret_a_verifier");
      return {
        answer:
          items.length === 0
            ? "Aucune fiche en attente de vérification humaine."
            : `${plural(items.length, "fiche attend une vérification humaine", "fiches attendent une vérification humaine")}.`,
        safetyNotice: SAFETY,
        suggestedActions: [{ label: "Voir mes fiches", href: MACHINE_ROUTES.allPrestations, type: "link" }],
        relatedRecords: recordsFrom(items),
        reminders: [],
        confidence: "high",
        source: "local",
      };
    }

    case "sealed":
    case "with_qr": {
      const items = list.filter((p) => p.verification_hash);
      return {
        answer:
          items.length === 0
            ? "Aucune fiche n'a encore été scellée techniquement (et donc pas de QR de vérification)."
            : `${plural(items.length, "fiche est scellée techniquement", "fiches sont scellées techniquement")} et dispose d'un QR de vérification.`,
        safetyNotice: SAFETY,
        suggestedActions: [{ label: "Voir mes fiches", href: MACHINE_ROUTES.allPrestations, type: "link" }],
        relatedRecords: recordsFrom(items),
        reminders: [],
        confidence: "high",
        source: "local",
      };
    }

    case "validated": {
      const items = list.filter((p) => p.status === "valide");
      return {
        answer: `${plural(items.length, "fiche est marquée comme validée", "fiches sont marquées comme validées")} dans AIME. Rappel : « validée » est un statut interne — les organismes officiels restent seuls compétents.`,
        safetyNotice: SAFETY,
        suggestedActions: [{ label: "Voir mes fiches", href: MACHINE_ROUTES.allPrestations, type: "link" }],
        relatedRecords: recordsFrom(items),
        reminders: [],
        confidence: "high",
        source: "local",
      };
    }

    case "in_progress": {
      const items = list.filter((p) => p.status === "transmis" || p.status === "pret_a_verifier");
      return {
        answer: `${plural(items.length, "fiche est en cours", "fiches sont en cours")} (transmises ou prêtes à vérifier).`,
        safetyNotice: SAFETY,
        suggestedActions: [{ label: "Voir mes fiches", href: MACHINE_ROUTES.allPrestations, type: "link" }],
        relatedRecords: recordsFrom(items),
        reminders: [],
        confidence: "high",
        source: "local",
      };
    }

    case "total_count":
      return {
        answer: `Vous avez ${plural(list.length, "fiche enregistrée", "fiches enregistrées")} dans AIME.`,
        safetyNotice: SAFETY,
        suggestedActions: [{ label: "Voir mes fiches", href: MACHINE_ROUTES.allPrestations, type: "link" }],
        relatedRecords: [],
        reminders: [],
        confidence: "high",
        source: "local",
      };

    default:
      return null;
  }
}

// Réponse de dernier recours quand IA ET local échouent à détecter l'intention.
export function buildGenericLocalAnswer({ prestations = [], simulator = null } = {}) {
  const total = prestations.length;
  const t = simulator?.total ?? 0;
  const o = simulator?.objective ?? 507;
  return {
    answer: `${total} fiche(s) · ${t} h / ${o} h indicatif. Que veux-tu vérifier ?`,
    safetyNotice: SAFETY,
    suggestedActions: [
      { label: "Mes priorités", type: "ask" },
      { label: "Ce qui manque", type: "ask" },
      { label: "Ouvrir le cockpit", href: "/507", type: "link" },
    ],
    relatedRecords: [],
    reminders: [],
    confidence: "low",
    source: "local-fallback",
  };
}