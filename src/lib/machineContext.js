// ============================================================================
// machineContext.js — contexte local autorisé pour la Machine AIME® 507
// Lecture seule depuis les données déjà accessibles. Aucun calcul officiel ajouté.
// ============================================================================

export const MACHINE_ROUTES = {
  allPrestations: "/prestations",
  drafts: "/prestations?status=brouillon",
  toComplete: "/prestations?status=a_completer",
  toVerify: "/prestations?status=pret_a_verifier",
  transmitted: "/prestations?status=transmis",
  validated: "/prestations?status=valide",
  missingDocuments: "/prestations?filter=documents-manquants",
  toReseal: "/prestations?filter=a-resceller",
  thisMonth: "/prestations?filter=ce-mois",
  priorities: "/prestations?filter=prioritaires",
  cockpit507: "/507",
  reminders: "/notifications",
};

export const PRESTATION_DEEP_FILTERS = {
  status: {
    brouillon: { label: "Brouillons", title: "Fiches en brouillon" },
    a_completer: { label: "À compléter", title: "Fiches à compléter" },
    pret_a_verifier: { label: "Prêtes à vérifier", title: "Fiches prêtes à vérifier" },
    transmis: { label: "Transmises", title: "Fiches transmises" },
    valide: { label: "Validées", title: "Fiches validées" },
  },
  filter: {
    "documents-manquants": { label: "Documents manquants", title: "Fiches avec documents manquants" },
    "a-resceller": { label: "À resceller", title: "Fiches à resceller" },
    "ce-mois": { label: "Ce mois-ci", title: "Fiches du mois" },
    prioritaires: { label: "Prioritaires", title: "Fiches prioritaires" },
  },
};

export function isToReseal(prestation) {
  return !!(
    prestation?.verification_hash &&
    prestation?.updated_date &&
    prestation?.verification_hash_at &&
    new Date(prestation.updated_date) > new Date(prestation.verification_hash_at)
  );
}

export function isThisMonth(iso, ref = new Date()) {
  if (!iso) return false;
  const d = new Date(iso);
  return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
}

export function isPriorityPrestation(prestation) {
  return (
    prestation?.status === "a_completer" ||
    prestation?.status === "pret_a_verifier" ||
    (prestation?.missing_documents || 0) > 0 ||
    isToReseal(prestation)
  );
}

export function getPrestationDeepFilter(search = "") {
  const params = new URLSearchParams(search);
  const status = params.get("status");
  const filter = params.get("filter");

  if (status && PRESTATION_DEEP_FILTERS.status[status]) {
    return { type: "status", value: status, ...PRESTATION_DEEP_FILTERS.status[status] };
  }

  if (filter && PRESTATION_DEEP_FILTERS.filter[filter]) {
    return { type: "filter", value: filter, ...PRESTATION_DEEP_FILTERS.filter[filter] };
  }

  return null;
}

export function applyPrestationDeepFilter(prestations = [], deepFilter) {
  if (!deepFilter) return prestations;

  if (deepFilter.type === "status") {
    return prestations.filter((p) => p.status === deepFilter.value);
  }

  switch (deepFilter.value) {
    case "documents-manquants":
      return prestations.filter((p) => (p.missing_documents || 0) > 0);
    case "a-resceller":
      return prestations.filter(isToReseal);
    case "ce-mois":
      return prestations.filter((p) => isThisMonth(p.date));
    case "prioritaires":
      return prestations.filter(isPriorityPrestation);
    default:
      return prestations;
  }
}

export function buildMachineContext({ prestations = [], simulator = null, counters = null } = {}) {
  const list = Array.isArray(prestations) ? prestations : [];
  const docsMissingItems = list.filter((p) => (p.missing_documents || 0) > 0);
  const toResealItems = list.filter(isToReseal);
  const priorityItems = list.filter(isPriorityPrestation);
  const drafts = list.filter((p) => p.status === "brouillon");
  const toComplete = list.filter((p) => p.status === "a_completer");
  const thisMonth = list.filter((p) => isThisMonth(p.date));

  return {
    fiches: list,
    stats507: simulator,
    documentsManquants: {
      total: counters?.totalDocsManquants || docsMissingItems.reduce((sum, p) => sum + (p.missing_documents || 0), 0),
      fiches: docsMissingItems,
    },
    statuts: {
      brouillon: drafts,
      a_completer: toComplete,
      pret_a_verifier: list.filter((p) => p.status === "pret_a_verifier"),
      transmis: list.filter((p) => p.status === "transmis"),
      valide: list.filter((p) => p.status === "valide"),
    },
    scellements: {
      aResceller: toResealItems,
      scellees: list.filter((p) => p.verification_hash),
    },
    periode: {
      label: simulator?.periodLabel || "12 mois glissants",
      ceMois: thisMonth,
    },
    actionsPossibles: {
      brouillons: MACHINE_ROUTES.drafts,
      aCompleter: MACHINE_ROUTES.toComplete,
      documentsManquants: MACHINE_ROUTES.missingDocuments,
      aResceller: MACHINE_ROUTES.toReseal,
      prioritaires: MACHINE_ROUTES.priorities,
      cockpit507: MACHINE_ROUTES.cockpit507,
      rappels: MACHINE_ROUTES.reminders,
    },
    routes: MACHINE_ROUTES,
    priorites: priorityItems,
  };
}

export function getPrimaryMachineAction(machineContext) {
  const mc = machineContext || buildMachineContext();
  const docs = mc.documentsManquants?.total || 0;
  const drafts = mc.statuts?.brouillon?.length || 0;
  const complete = mc.statuts?.a_completer?.length || 0;
  const reseal = mc.scellements?.aResceller?.length || 0;
  const progress = mc.stats507?.percent || 0;

  if (complete > 0) {
    return {
      kind: "navigate",
      title: `Compléter ${complete} fiche${complete > 1 ? "s" : ""}`,
      subtitle: "Action préparatoire : vérifier les champs manquants avant toute démarche externe.",
      cta: "Voir les fiches à compléter",
      target: MACHINE_ROUTES.toComplete,
    };
  }

  if (docs > 0) {
    return {
      kind: "navigate",
      title: "Vérifier les documents manquants",
      subtitle: `${docs} document${docs > 1 ? "s" : ""} signalé${docs > 1 ? "s" : ""} dans les fiches locales.`,
      cta: "Voir les documents",
      target: MACHINE_ROUTES.missingDocuments,
    };
  }

  if (reseal > 0) {
    return {
      kind: "navigate",
      title: `Sceller ${reseal} fiche${reseal > 1 ? "s" : ""} modifiée${reseal > 1 ? "s" : ""}`,
      subtitle: "Scellement technique interne, sans certification administrative.",
      cta: "Voir les fiches à resceller",
      target: MACHINE_ROUTES.toReseal,
    };
  }

  if (drafts > 0) {
    return {
      kind: "navigate",
      title: `Compléter ${drafts} brouillon${drafts > 1 ? "s" : ""}`,
      subtitle: "Reprendre les fiches commencées avant de générer des documents préparatoires.",
      cta: "Voir les brouillons",
      target: MACHINE_ROUTES.drafts,
    };
  }

  return {
    kind: "navigate",
    title: progress < 50 ? "Consulter la progression 507h" : "Suivre la progression 507h",
    subtitle: "Simulation indicative sur les fiches locales, à valider humainement.",
    cta: "Ouvrir le cockpit",
    target: MACHINE_ROUTES.cockpit507,
  };
}