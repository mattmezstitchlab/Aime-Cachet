export const AIME_WEDDING_STORAGE_KEY = "aime_wedding_point_zero_v6";

export const WEDDING_TABS = [
  { id: "overview", label: "Vue" },
  { id: "reminders", label: "Rappels" },
  { id: "automations", label: "Automations" },
  { id: "dayj", label: "Jour J" },
  { id: "docs", label: "Docs" },
  { id: "after", label: "Après" },
];

export const ROLE_VIEWS = {
  couple: {
    id: "couple",
    label: "Couple",
    members: ["couple", "planning"],
  },
  planner: {
    id: "planner",
    label: "Planner",
    members: ["planning", "couple", "lieu", "photo", "traiteur", "famille"],
  },
  vendors: {
    id: "vendors",
    label: "Prestataires",
    members: ["planning", "lieu", "photo", "traiteur", "famille"],
  },
};

export const TIMELINE_STATUS = {
  upcoming: { label: "À venir" },
  live: { label: "En cours" },
  done: { label: "Terminé" },
  watch: { label: "Sous surveillance" },
  blocked: { label: "Bloqué" },
};

export const CONTACTS = {
  planning: { label: "Planning", name: "Léna", phone: "06 52 10 24 88", note: "Tour de contrôle et arbitrage global" },
  couple: { label: "Couple", name: "Iris & Noam", phone: "06 14 20 18 27", note: "Décisions sensibles et validations" },
  lieu: { label: "Lieu", name: "Château de la Lys", phone: "03 20 45 67 80", note: "Accès, circulation, espaces de repli" },
  photo: { label: "Photo / vidéo", name: "Studio Sillage", phone: "06 84 11 26 51", note: "Captation, lumière, timings image" },
  traiteur: { label: "Traiteur", name: "Maison Aurore", phone: "06 70 41 92 11", note: "Service, cuisine, rythme cocktail & dîner" },
  famille: { label: "Famille / témoins", name: "Témoins", phone: "06 33 92 44 17", note: "Discours, loges, déplacements famille" },
  prestataire: { label: "Prestataire concerné", name: "Équipe externe", phone: "06 90 20 11 54", note: "Canal direct pour incident de production" },
  dj: { label: "DJ / Son", name: "Atelier Sonore", phone: "06 73 10 54 40", note: "Ouverture de bal, micros, diffusion" },
};

export const STARTER_DOCUMENT_OPTIONS = [
  {
    id: "feuille_service",
    label: "Feuille de service",
    description: "Le document central du jour J : horaires, accès, séquences et responsabilités.",
  },
  {
    id: "plan_b_meteo",
    label: "Plan B météo",
    description: "Le scénario de repli en cas de météo instable, avec circulation et messages associés.",
  },
  {
    id: "plan_table",
    label: "Plan de table",
    description: "Le plan invités et ses impacts immédiats sur le dîner, les régimes et la signalétique.",
  },
  {
    id: "plan_salle",
    label: "Plan de salle & accessibilité",
    description: "L'implantation du lieu, les flux terrain, l'accueil et les points PMR.",
  },
  {
    id: "programme_jourj",
    label: "Programme Jour J",
    description: "Le déroulé heure par heure partagé entre le couple, le planning et les équipes terrain.",
  },
];

export const ADVANCED_SETUP_DOCUMENT_OPTIONS = [
  {
    id: "accueil_accessibilite",
    label: "Accueil invités & accessibilité",
    description: "Le document d'accueil, circulation, PMR, signalétique et points d'attention terrain.",
  },
  {
    id: "ceremonie_cortege",
    label: "Cérémonie & cortège",
    description: "Le déroulé précis des entrées, placements, prises de parole et transitions cérémonie.",
  },
  {
    id: "hebergements_navettes",
    label: "Hébergements & navettes",
    description: "Le suivi des chambres, check-ins, horaires navettes et retours invités.",
  },
  {
    id: "repas_speciaux_allergies",
    label: "Repas spéciaux & allergies",
    description: "La feuille claire pour régimes, allergies, enfants et coordination traiteur / accueil.",
  },
];

export const SETUP_DOCUMENT_OPTIONS = [
  ...STARTER_DOCUMENT_OPTIONS,
  ...ADVANCED_SETUP_DOCUMENT_OPTIONS,
];

export const COORDINATION_MODE_OPTIONS = [
  {
    id: "full-planner",
    label: "Planner complet",
    description: "Le planner tient la préparation et le jour J de façon centrale.",
  },
  {
    id: "dayj-only",
    label: "Coordination Jour J",
    description: "La préparation est surtout portée par le couple, avec orchestration forte le jour J.",
  },
  {
    id: "couple-led",
    label: "Couple autonome",
    description: "Le couple pilote l'essentiel avec quelques renforts ciblés seulement.",
  },
];

export const CEREMONY_FORMAT_OPTIONS = [
  {
    id: "civil",
    label: "Civile",
    description: "Le mariage se concentre sur la mairie et la réception.",
  },
  {
    id: "laique",
    label: "Laïque",
    description: "Le mariage repose sur une cérémonie scénarisée sur place.",
  },
  {
    id: "religious",
    label: "Religieuse",
    description: "Une séquence religieuse structure fortement les déplacements et les horaires.",
  },
  {
    id: "mixed",
    label: "Mixte",
    description: "Plusieurs temps de cérémonie doivent être articulés dans la journée.",
  },
];

export const VENDOR_TAXONOMY = [
  { id: "all", label: "Tous" },
  { id: "planner", label: "Planner" },
  { id: "venue", label: "Lieux" },
  { id: "photo-video", label: "Photo / vidéo" },
  { id: "catering", label: "Traiteur" },
  { id: "music", label: "DJ / Son" },
  { id: "flowers-decor", label: "Fleurs & déco" },
  { id: "transport", label: "Transport" },
  { id: "beauty", label: "Beauté" },
];

export const VENDOR_PAYMENT_STATUS = {
  paid: { label: "Payé" },
  due: { label: "À payer" },
  scheduled: { label: "Planifié" },
};

export const WEDDING_SIGNALS = [
  {
    id: "guests_plus_12",
    label: "+12 invités",
    title: "Variation du nombre d'invités",
    summary: "Une hausse tardive du nombre d'invités impacte budget, plan de table, traiteur et signalétique.",
    patch: { guests: 12, budget: 1440, scheduleMinutes: 8, risk: 5 },
    impacts: [
      { scope: "Budget", text: "+1 440 € estimés sur restauration, mobilier et papeterie." },
      { scope: "Plan de table", text: "Recalcul des placements et vérification de la capacité du dîner." },
      { scope: "Traiteur", text: "Confirmer le nouveau volume avant 18h pour sécuriser la production." },
      { scope: "Documents", text: "Mettre à jour devis, seating et feuille de service." },
    ],
    reminders: [
      { title: "Valider le nouveau plan de table", owner: "planning", dueInHours: 3, priority: "haute" },
      { title: "Faire confirmer le volume au traiteur", owner: "traiteur", dueInHours: 2, priority: "haute" },
    ],
    docUpdates: ["plan_table", "feuille_service"],
    automationTriggers: ["guest-delta"],
  },
  {
    id: "rain_j3",
    label: "Pluie J-3",
    title: "Alerte météo",
    summary: "Une pluie probable active le plan B cérémonie et reconfigure les flux terrain.",
    patch: { weather: "pluie probable", risk: 16, scheduleMinutes: 20 },
    impacts: [
      { scope: "Plan B", text: "Basculer la cérémonie de la pelouse vers la verrière principale." },
      { scope: "Prestataires", text: "Prévenir fleuriste, loueur, DJ, lumière et vidéaste du changement d'implantation." },
      { scope: "Invités", text: "Mettre à jour le message d'accueil et la signalétique parking." },
      { scope: "Temps", text: "+20 minutes à absorber sur la mise en place décor." },
    ],
    reminders: [
      { title: "Envoyer le plan B météo à toute l'équipe", owner: "planning", dueInHours: 1, priority: "critique" },
      { title: "Confirmer la nouvelle implantation avec le lieu", owner: "lieu", dueInHours: 2, priority: "haute" },
    ],
    docUpdates: ["plan_b_meteo", "feuille_service"],
    automationTriggers: ["weather-plan-b"],
  },
  {
    id: "speech_plus_one",
    label: "Discours +1",
    title: "Nouveau discours ajouté",
    summary: "Un discours supplémentaire décale le dîner, la captation et la bascule vers le dancefloor.",
    patch: { scheduleMinutes: 10, risk: 4 },
    impacts: [
      { scope: "Programme", text: "+10 minutes sur le dîner, à absorber avant l'ouverture du dancefloor." },
      { scope: "Photo/Vidéo", text: "Prévenir les cadreurs pour éviter une coupure pendant le service." },
      { scope: "Son", text: "Ajouter un micro main et prévoir une balance rapide." },
    ],
    reminders: [
      { title: "Actualiser le running order du dîner", owner: "planning", dueInHours: 4, priority: "moyenne" },
    ],
    docUpdates: ["programme_jourj"],
    automationTriggers: ["speech-shift"],
  },
  {
    id: "pmr_detected",
    label: "PMR détecté",
    title: "Besoin d'accessibilité identifié",
    summary: "Une contrainte d'accessibilité doit immédiatement reconfigurer circulation, accueil et table principale.",
    patch: { accessibility: true, risk: -6 },
    impacts: [
      { scope: "Circulation", text: "Vérifier rampe, sanitaires et trajet voiture → cérémonie → dîner." },
      { scope: "Accueil", text: "Briefer les hôtes d'accueil et réserver un accompagnement dédié." },
      { scope: "Plan de salle", text: "Positionner la table et l'assise sur un flux prioritaire." },
    ],
    reminders: [
      { title: "Vérifier le parcours PMR avec le lieu", owner: "lieu", dueInHours: 6, priority: "haute" },
    ],
    docUpdates: ["plan_salle"],
    automationTriggers: ["pmr-flow"],
  },
  {
    id: "vendor_delay",
    label: "Prestataire en retard",
    title: "Retard prestataire critique",
    summary: "Un retard de prestataire oblige à réordonner les installations et les validations terrain.",
    patch: { risk: 11, scheduleMinutes: 15 },
    impacts: [
      { scope: "Montage", text: "Décaler l'habillage floral et avancer les tests lumière/audio." },
      { scope: "Coordination", text: "Déplacer les priorités d'installation pour garder le cocktail à l'heure." },
      { scope: "Couple", text: "Éviter de faire remonter l'alerte brute si le plan B tient encore." },
    ],
    reminders: [
      { title: "Réordonner les tâches de montage", owner: "planning", dueInHours: 1, priority: "critique" },
      { title: "Confirmer l'heure réelle d'arrivée du prestataire", owner: "prestataire", dueInHours: 1, priority: "haute" },
    ],
    docUpdates: ["feuille_service"],
    automationTriggers: ["vendor-delay"],
  },
];

function makeId(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function addHours(date, hours) {
  return new Date(date.getTime() + hours * 3600000).toISOString();
}

function buildChecklist(items) {
  return items.map((label) => ({ id: makeId("chk"), label, done: false }));
}

function createContactsSnapshot() {
  return Object.fromEntries(
    Object.entries(CONTACTS).map(([id, contact]) => [id, { ...contact }]),
  );
}

function createSetupState(now) {
  return {
    completed: false,
    completedAt: null,
    updatedAt: now.toISOString(),
    starterDocs: STARTER_DOCUMENT_OPTIONS.map((item) => item.id),
  };
}

function createGuestsProfileState() {
  return {
    children: 0,
    pmr: 0,
    specialMeals: 0,
    speeches: 0,
  };
}

function createOrchestrationState() {
  return {
    coordinationMode: "full-planner",
    ceremonyFormat: "laique",
    planBWeatherReady: true,
    shuttleNeeded: false,
    accommodationNeeded: false,
  };
}

function createGuestRegistry(now) {
  const firstNames = [
    "Jeanne", "Gabriel", "Camille", "Arthur", "Lou", "Jules", "Manon", "Léo", "Chloé", "Raphaël",
    "Emma", "Louis", "Nina", "Tom", "Lina", "Noé", "Zoé", "Adam", "Iris", "Malo",
  ];
  const lastNames = [
    "Martin", "Bernard", "Petit", "Robert", "Richard", "Durand", "Dubois", "Moreau", "Laurent", "Simon",
    "Michel", "Lefebvre", "Garcia", "David", "Bertrand",
  ];

  const list = Array.from({ length: 124 }, (_, index) => {
    const firstName = firstNames[index % firstNames.length];
    const lastName = lastNames[Math.floor(index / firstNames.length) % lastNames.length];
    const rsvpStatus = index < 94 ? "confirmed" : index < 114 ? "pending" : "declined";
    const mealPreference = index % 17 === 0 ? "allergy" : index % 7 === 0 ? "vegetarian" : index % 19 === 0 ? "child" : "standard";
    const side = index < 38 ? "famille" : index < 88 ? "amis" : "prestations";
    const tableCode = rsvpStatus === "confirmed" ? `T${(index % 12) + 1}` : null;
    const accessibilityNeed = index % 31 === 0;
    const tags = [
      side === "famille" ? "Famille" : side === "amis" ? "Amis" : "Proche mariage",
      mealPreference === "allergy" ? "Allergie" : mealPreference === "vegetarian" ? "Végétarien" : mealPreference === "child" ? "Enfant" : "Standard",
      accessibilityNeed ? "PMR" : null,
    ].filter(Boolean);

    const householdIndex = Math.floor(index / 2) + 1;
    const invitationStatus = index < 52 ? "opened" : index < 96 ? "sent" : "draft";
    const invitedAt = invitationStatus === "draft" ? null : addHours(now, -((index % 6) + 24));
    const invitationOpenedAt = invitationStatus === "opened" ? addHours(now, -((index % 4) + 6)) : null;
    const eventAccess = index % 8 === 0 ? "evening" : "day-evening";
    const plusOneAllowed = index % 5 === 0;

    return {
      id: `guest_${index + 1}`,
      firstName,
      lastName,
      householdId: `household_${householdIndex}`,
      household: `Foyer ${householdIndex}`,
      rsvpStatus,
      invitationStatus,
      invitedAt,
      invitationOpenedAt,
      eventAccess,
      plusOneAllowed,
      plusOneName: plusOneAllowed && rsvpStatus === "confirmed" && index % 10 === 0 ? "Accompagnant confirmé" : "",
      mealPreference,
      tableCode,
      side,
      seatOrder: index,
      partySize: index % 11 === 0 ? 2 : 1,
      accommodation: index % 9 === 0,
      shuttle: index % 10 === 0,
      accessibilityNeed,
      note: mealPreference === "allergy"
        ? "Prévenir le traiteur et vérifier le plan de table."
        : accessibilityNeed
        ? "Parcours PMR à revérifier avec le lieu."
        : index % 13 === 0
        ? "Invité à fort enjeu relationnel sur le seating."
        : "",
      updatedAt: now.toISOString(),
      tags,
    };
  });

  return {
    list,
    updatedAt: now.toISOString(),
  };
}

function createGuestPortal(now) {
  return {
    updatedAt: now.toISOString(),
    welcomeTitle: "Bienvenue au mariage d’Iris & Noam",
    welcomeText: "Toutes les infos utiles pour venir, répondre, se loger et profiter du mariage sans fouiller dans plusieurs messages.",
    travel: {
      ceremonyAddress: "Château de la Lys · 14 allée des Saules · Lille",
      receptionAddress: "Château de la Lys · Verrière & salons · Lille",
      parking: "Parking fléché dès l’entrée du domaine. Une zone proche est réservée aux invités PMR.",
      dressCode: "Tenue élégante · tons doux · prévoir un châle léger pour l’extérieur.",
    },
    schedule: [
      { id: "guest_arrival", time: "16:30", title: "Accueil invités", detail: "Parking, signalétique, boissons fraîches et orientation vers la cérémonie." },
      { id: "guest_ceremony", time: "17:00", title: "Cérémonie", detail: "Placement simple, suivi par les témoins et équipe d’accueil." },
      { id: "guest_cocktail", time: "18:00", title: "Cocktail", detail: "Photos couple, circulation libre et ouverture du service." },
      { id: "guest_dinner", time: "19:30", title: "Dîner & discours", detail: "Placement par table, repas spéciaux gérés à table." },
      { id: "guest_party", time: "21:45", title: "Ouverture de bal", detail: "Transition douce vers la soirée et la piste." },
    ],
    accommodations: [
      { id: "hotel_lys", name: "Maison de la Lys", distance: "8 min", note: "Check-in fluide et parking sur place.", checkIn: "15:00" },
      { id: "hotel_centre", name: "Grand Hôtel du Centre", distance: "18 min", note: "Pratique pour les invités qui repartent tôt le lendemain.", checkIn: "16:00" },
      { id: "hotel_famille", name: "Les Suites du Parc", distance: "12 min", note: "Calme, adapté aux familles avec enfants.", checkIn: "15:00" },
    ],
    shuttles: [
      { id: "shuttle_1", time: "16:00", route: "Centre-ville → Château", note: "Dernière navette d’arrivée avant la cérémonie." },
      { id: "shuttle_2", time: "23:45", route: "Château → Hôtels", note: "Première rotation retour." },
      { id: "shuttle_3", time: "00:30", route: "Château → Hôtels", note: "Dernière rotation retour." },
    ],
    faq: [
      { id: "faq_rsvp", question: "Comment répondre ?", answer: "Depuis l’espace invités, en confirmant ou en refusant pour chaque membre du foyer." },
      { id: "faq_children", question: "Les enfants sont-ils prévus ?", answer: "Oui, avec repas dédiés et placement adapté si nécessaire." },
      { id: "faq_parking", question: "Y a-t-il un parking ?", answer: "Oui, fléché à l’entrée du domaine, avec accès proche pour PMR." },
      { id: "faq_food", question: "Que faire en cas d’allergie ?", answer: "Signalez-le dans la réponse RSVP ou à l’équipe planning avant le mariage." },
    ],
  };
}

function createRoleTemplates({ couple, venue, contacts }) {
  const sourceContacts = contacts || createContactsSnapshot();
  return [
    { id: "couple", label: "Couple", owner: couple || sourceContacts.couple?.name || "Couple", status: "aligné", note: "Vision claire, arbitrages ouverts sur les discours et la cérémonie." },
    { id: "planning", label: "Planning", owner: sourceContacts.planning?.name || "Planning", status: "live", note: "Rétroplanning synchronisé, 4 dépendances sensibles suivent la météo." },
    { id: "lieu", label: "Lieu", owner: sourceContacts.lieu?.name || venue || "Lieu", status: "prêt", note: "Accès techniques confirmés, salons de repli disponibles." },
    { id: "photo", label: "Photo / vidéo", owner: sourceContacts.photo?.name || "Photo / vidéo", status: "veille", note: "Fenêtre lumière optimale entre 18:50 et 19:25." },
    { id: "traiteur", label: "Traiteur", owner: sourceContacts.traiteur?.name || "Traiteur", status: "prêt", note: "Volume et régimes OK, dernière validation H-48." },
    { id: "famille", label: "Famille / témoins", owner: sourceContacts.famille?.name || "Famille / témoins", status: "coordonné", note: "Discours, loges et arrivées restent à figer." },
  ];
}

function getCountdownDays(dateValue) {
  if (!dateValue) return 0;
  const target = new Date(`${dateValue}T12:00:00`);
  if (Number.isNaN(target.getTime())) return 0;
  const diff = target.getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86400000));
}

function normalizeCount(value, fallback = 0) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return fallback;
  return Math.round(parsed);
}

function normalizeMoney(value, fallback = 0) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return fallback;
  return Math.round(parsed);
}

function syncBudgetItemsToEnvelope(items = [], envelope = 0) {
  const nextItems = items.map((item) => ({ ...item }));
  const allocatedWithoutReserve = nextItems
    .filter((item) => item.id !== "contingency")
    .reduce((sum, item) => sum + (item.allocated || 0), 0);
  const reserveAllocated = Math.max(0, envelope - allocatedWithoutReserve);

  return nextItems.map((item) => (
    item.id === "contingency"
      ? {
          ...item,
          allocated: reserveAllocated,
          note: reserveAllocated > 0
            ? item.note
            : "La marge imprévus est entièrement absorbée par le cadrage initial.",
        }
      : item
  ));
}

function getOptionLabel(options, value, fallback = "—") {
  return options.find((item) => item.id === value)?.label || fallback;
}

export function getRecommendedSetupDocumentIds(guestsProfile = {}, orchestration = {}) {
  const out = [];

  if ((guestsProfile.pmr || 0) > 0) {
    out.push("accueil_accessibilite");
  }

  if ((guestsProfile.children || 0) > 0 || (guestsProfile.specialMeals || 0) > 0) {
    out.push("repas_speciaux_allergies");
  }

  if ((guestsProfile.speeches || 0) > 0 || orchestration.ceremonyFormat === "laique" || orchestration.ceremonyFormat === "religious" || orchestration.ceremonyFormat === "mixed") {
    out.push("ceremonie_cortege");
  }

  if (orchestration.shuttleNeeded || orchestration.accommodationNeeded) {
    out.push("hebergements_navettes");
  }

  return [...new Set(out)];
}

function createSetupReminders({ guestsProfile, orchestration }) {
  const now = new Date();
  const reminders = [];

  if ((guestsProfile.children || 0) > 0) {
    reminders.push({
      id: makeId("rem"),
      title: `Confirmer la gestion de ${guestsProfile.children} enfant(s) au dîner`,
      owner: "famille",
      dueAt: addHours(now, 72),
      priority: "moyenne",
      status: "open",
      context: "setup:children",
    });
  }

  if ((guestsProfile.pmr || 0) > 0) {
    reminders.push({
      id: makeId("rem"),
      title: `Vérifier le parcours PMR pour ${guestsProfile.pmr} invité(s)`,
      owner: "lieu",
      dueAt: addHours(now, 48),
      priority: "haute",
      status: "open",
      context: "setup:pmr",
    });
  }

  if ((guestsProfile.specialMeals || 0) > 0) {
    reminders.push({
      id: makeId("rem"),
      title: `Confirmer ${guestsProfile.specialMeals} repas spéciaux avec le traiteur`,
      owner: "traiteur",
      dueAt: addHours(now, 60),
      priority: "haute",
      status: "open",
      context: "setup:meals",
    });
  }

  if ((guestsProfile.speeches || 0) > 0) {
    reminders.push({
      id: makeId("rem"),
      title: `Verrouiller l'ordre des ${guestsProfile.speeches} discours`,
      owner: "planning",
      dueAt: addHours(now, 54),
      priority: "moyenne",
      status: "open",
      context: "setup:speeches",
    });
  }

  if (!orchestration.planBWeatherReady) {
    reminders.push({
      id: makeId("rem"),
      title: "Construire le plan B météo initial",
      owner: "planning",
      dueAt: addHours(now, 36),
      priority: "haute",
      status: "open",
      context: "setup:planb",
    });
  }

  if (orchestration.shuttleNeeded) {
    reminders.push({
      id: makeId("rem"),
      title: "Valider les navettes aller / retour",
      owner: "planning",
      dueAt: addHours(now, 72),
      priority: "moyenne",
      status: "open",
      context: "setup:shuttle",
    });
  }

  if (orchestration.accommodationNeeded) {
    reminders.push({
      id: makeId("rem"),
      title: "Partager la feuille hébergements & check-in",
      owner: "planning",
      dueAt: addHours(now, 84),
      priority: "moyenne",
      status: "open",
      context: "setup:accommodation",
    });
  }

  return reminders;
}

function syncSetupReminders(currentState, { guestsProfile, orchestration }) {
  const preserved = (currentState.reminders || []).filter((item) => !(item.context || "").startsWith("setup:"));
  return [...createSetupReminders({ guestsProfile, orchestration }), ...preserved].slice(0, 24);
}

function createDocumentTemplates(now) {
  return [
    {
      id: "feuille_service",
      title: "Feuille de service",
      type: "coordination",
      status: "à relire",
      owner: "planning",
      sharedWith: ["planning", "photo", "traiteur", "lieu"],
      updatedAt: now.toISOString(),
      version: "v3.2",
      summary: "Le document central du jour J : horaires, contacts, séquences, accès techniques et responsabilité par bloc.",
      note: "Relire avec lieu + photo la veille pour verrouiller les temps de bascule.",
      checklist: buildChecklist([
        "Vérifier les horaires d'arrivée de tous les prestataires",
        "Confirmer les contacts d'urgence",
        "Valider les temps de discours et transitions",
        "Partager la dernière version à l'équipe terrain",
      ]),
    },
    {
      id: "plan_b_meteo",
      title: "Plan B météo",
      type: "sécurité",
      status: "prêt",
      owner: "planning",
      sharedWith: ["planning", "lieu", "photo", "traiteur", "famille"],
      updatedAt: now.toISOString(),
      version: "v2.1",
      summary: "Scénario alternatif activable si météo instable : bascule cérémonie, reconfiguration des flux et message invités.",
      note: "Toujours revalider la capacité intérieure et les flux PMR en même temps.",
      checklist: buildChecklist([
        "Confirmer la salle de repli",
        "Préparer le message invités / parking",
        "Ajuster le montage floral et l'éclairage",
        "Mettre à jour la feuille de service",
      ]),
    },
    {
      id: "plan_table",
      title: "Plan de table",
      type: "invités",
      status: "à verrouiller",
      owner: "couple",
      sharedWith: ["couple", "planning", "traiteur", "famille"],
      updatedAt: now.toISOString(),
      version: "v5.0",
      summary: "Répartition des invités, contraintes relationnelles, régimes alimentaires et séquence d'appel des tables.",
      note: "La moindre variation d'invités impacte seating, budget et signalétique.",
      checklist: buildChecklist([
        "Valider les régimes spéciaux",
        "Confirmer les enfants et high chairs",
        "Vérifier les placements famille / témoins",
        "Transmettre au traiteur et à l'accueil",
      ]),
    },
    {
      id: "plan_salle",
      title: "Plan de salle & accessibilité",
      type: "terrain",
      status: "brouillon",
      owner: "lieu",
      sharedWith: ["planning", "lieu", "famille", "traiteur"],
      updatedAt: now.toISOString(),
      version: "v1.4",
      summary: "Implantation physique du mariage : circulation, PMR, accès parking, zones techniques, cocktail et dîner.",
      note: "Priorité à la fluidité réelle : accès, sécurité et lisibilité des circulations.",
      checklist: buildChecklist([
        "Valider les parcours PMR",
        "Vérifier les zones cocktail et dinner",
        "Confirmer les accès techniques",
        "Positionner la signalétique d'accueil",
      ]),
    },
    {
      id: "programme_jourj",
      title: "Programme Jour J",
      type: "timing",
      status: "en cours",
      owner: "planning",
      sharedWith: ["couple", "planning", "photo", "traiteur", "lieu", "famille"],
      updatedAt: now.toISOString(),
      version: "v2.7",
      summary: "Le déroulé heure par heure : cérémonie, cocktail, dîner, discours, ouverture de bal et after.",
      note: "Document sensible au moindre décalage : discours, météo, retard prestataire.",
      checklist: buildChecklist([
        "Valider le temps cocktail",
        "Confirmer les fenêtres photo",
        "Intégrer les discours finaux",
        "Partager au DJ, photo et traiteur",
      ]),
    },
    {
      id: "accueil_accessibilite",
      title: "Accueil invités & accessibilité",
      type: "accueil",
      status: "brouillon",
      owner: "planning",
      sharedWith: ["planning", "lieu", "famille", "traiteur"],
      updatedAt: now.toISOString(),
      version: "v1.0",
      summary: "Le document d'accueil : arrivée invités, circulation, PMR, signalétique, parking et points de friction à éviter.",
      note: "À activer dès qu'un besoin PMR, une circulation complexe ou plusieurs flux invités coexistent.",
      checklist: buildChecklist([
        "Valider les parcours parking → cérémonie → dîner",
        "Confirmer l'accueil PMR et les sanitaires accessibles",
        "Positionner la signalétique et les référents accueil",
        "Partager aux témoins, au lieu et au traiteur",
      ]),
    },
    {
      id: "ceremonie_cortege",
      title: "Cérémonie & cortège",
      type: "cérémonie",
      status: "brouillon",
      owner: "planning",
      sharedWith: ["couple", "planning", "famille", "photo", "lieu"],
      updatedAt: now.toISOString(),
      version: "v1.0",
      summary: "Le fil précis de la cérémonie : ordre d'entrée, placements, prises de parole, musiques, micros et transitions.",
      note: "Très utile dès qu'il y a plusieurs discours, un cortège ou une cérémonie laïque / religieuse structurée.",
      checklist: buildChecklist([
        "Valider l'ordre d'entrée et les placements",
        "Confirmer les musiques, micros et prises de parole",
        "Partager au couple, à la famille et à la captation",
        "Vérifier les temps de transition avec le lieu",
      ]),
    },
    {
      id: "hebergements_navettes",
      title: "Hébergements & navettes",
      type: "logistique invités",
      status: "brouillon",
      owner: "planning",
      sharedWith: ["couple", "planning", "famille", "lieu"],
      updatedAt: now.toISOString(),
      version: "v1.0",
      summary: "Le suivi des chambres, check-ins, contacts hébergement, horaires navettes et retours de nuit.",
      note: "À sortir dès qu'il y a plusieurs points de couchage ou une mobilité invités à sécuriser.",
      checklist: buildChecklist([
        "Lister les hébergements et responsables de clé / accueil",
        "Confirmer les horaires aller-retour des navettes",
        "Partager les contacts utiles aux témoins et au couple",
        "Prévoir le scénario retour tardif / imprévu",
      ]),
    },
    {
      id: "repas_speciaux_allergies",
      title: "Repas spéciaux & allergies",
      type: "traiteur",
      status: "brouillon",
      owner: "traiteur",
      sharedWith: ["couple", "planning", "traiteur", "famille"],
      updatedAt: now.toISOString(),
      version: "v1.0",
      summary: "La feuille claire des allergies, régimes, repas enfants et consignes de service liées au dîner.",
      note: "Document utile pour éviter les oublis silencieux qui créent une mauvaise expérience immédiate pour les invités concernés.",
      checklist: buildChecklist([
        "Lister allergies, régimes et repas enfants",
        "Valider le repérage table / invité avec le plan de table",
        "Partager au traiteur et au responsable accueil",
        "Prévoir un point de contrôle juste avant le service",
      ]),
    },
  ];
}

function createCommunicationTemplates() {
  return [
    {
      id: "tpl_plan_b",
      title: "Activer le plan B météo",
      audience: ["lieu", "photo", "traiteur", "famille"],
      tone: "direct",
      text: "Plan B météo activé. Merci de basculer sur l'implantation verrière, de relire la feuille de service mise à jour et de confirmer votre disponibilité terrain dans les 15 minutes.",
    },
    {
      id: "tpl_delay",
      title: "Retard prestataire — réordonnancement",
      audience: ["lieu", "photo", "traiteur", "planning"],
      tone: "coordination",
      text: "Un retard prestataire est signalé. Priorité : maintenir cocktail et cérémonie à l'heure. Merci de suivre la feuille de service ajustée et de remonter tout blocage immédiatement.",
    },
    {
      id: "tpl_couple_update",
      title: "Message couple — état rassurant",
      audience: ["couple"],
      tone: "apaisé",
      text: "Tout est sous contrôle. Quelques ajustements se jouent en coulisse, sans impact majeur sur votre expérience pour le moment. Nous vous prévenons seulement si une validation ou un arbitrage devient nécessaire.",
    },
    {
      id: "tpl_service_ready",
      title: "Feuille de service à relire",
      audience: ["photo", "traiteur", "lieu", "famille"],
      tone: "coordination",
      text: "Une nouvelle version de la feuille de service est disponible. Merci de relire vos horaires, points de contact et responsabilités, puis de signaler toute incohérence rapidement.",
    },
  ];
}

function createTimelineSteps(now) {
  return [
    {
      id: "brief-matin",
      time: "09:00",
      title: "Brief coordination",
      detail: "Lecture de la feuille de service avec planner, lieu, photo et traiteur.",
      owners: ["planning", "lieu", "photo", "traiteur"],
      docs: ["feuille_service"],
      status: "done",
      note: "Le brief pose les arbitrages et clarifie les bascules possibles.",
      updatedAt: now.toISOString(),
    },
    {
      id: "arrivee-technique",
      time: "10:00",
      title: "Arrivée technique",
      detail: "Montage, accès techniques, branchements et implantation initiale.",
      owners: ["planning", "lieu", "photo", "traiteur"],
      docs: ["feuille_service", "plan_salle"],
      status: "done",
      note: "Le lieu confirme les accès et la circulation des prestataires.",
      updatedAt: now.toISOString(),
    },
    {
      id: "habillage-ceremonie",
      time: "13:00",
      title: "Habillage cérémonie",
      detail: "Assises, signalétique, fleurs, son et dernière lecture du plan B météo.",
      owners: ["planning", "lieu", "photo", "famille"],
      docs: ["plan_b_meteo", "plan_salle"],
      status: "live",
      note: "La météo reste sous surveillance : garder la verrière prête en repli.",
      updatedAt: now.toISOString(),
    },
    {
      id: "accueil-invites",
      time: "16:30",
      title: "Accueil invités",
      detail: "Parking, hôtesses, signalétique, flux famille et accessibilité.",
      owners: ["planning", "lieu", "famille"],
      docs: ["plan_salle", "plan_table"],
      status: "upcoming",
      note: "Le point PMR doit être revérifié si besoin détecté.",
      updatedAt: now.toISOString(),
    },
    {
      id: "ceremonie",
      time: "17:00",
      title: "Cérémonie",
      detail: "Rythme, placement, visibilité, météo et bascule si nécessaire.",
      owners: ["couple", "planning", "lieu", "photo"],
      docs: ["plan_b_meteo", "programme_jourj"],
      status: "upcoming",
      note: "La décision de bascule doit rester unique et lisible pour toute l'équipe.",
      updatedAt: now.toISOString(),
    },
    {
      id: "cocktail-photos",
      time: "18:00",
      title: "Cocktail & photos",
      detail: "Photos couple, flux invités, lancement service et respiration planning.",
      owners: ["couple", "planning", "photo", "traiteur"],
      docs: ["programme_jourj", "feuille_service"],
      status: "upcoming",
      note: "Le cocktail absorbe une partie des retards si besoin.",
      updatedAt: now.toISOString(),
    },
    {
      id: "diner-discours",
      time: "19:30",
      title: "Dîner & discours",
      detail: "Ordre des tables, running order, prises de parole, audio et captation.",
      owners: ["couple", "planning", "photo", "traiteur", "famille"],
      docs: ["programme_jourj", "plan_table"],
      status: "upcoming",
      note: "Toute variation ici propage directement un retard sur l'ouverture de bal.",
      updatedAt: now.toISOString(),
    },
    {
      id: "ouverture-bal",
      time: "21:45",
      title: "Ouverture de bal",
      detail: "Bascule son, lumière et fluidité entre dîner et piste.",
      owners: ["couple", "planning", "photo"],
      docs: ["programme_jourj", "feuille_service"],
      status: "upcoming",
      note: "Prévenir le DJ et la captation si le dîner dépasse la fenêtre prévue.",
      updatedAt: now.toISOString(),
    },
    {
      id: "dancefloor",
      time: "23:15",
      title: "Dancefloor",
      detail: "Activation piste, dessert, after et maintien de l'expérience globale.",
      owners: ["couple", "planning", "photo", "traiteur", "famille"],
      docs: ["programme_jourj"],
      status: "upcoming",
      note: "Le couple ne doit plus recevoir que les arbitrages critiques à ce stade.",
      updatedAt: now.toISOString(),
    },
  ];
}

function createLiveFeed(now) {
  return [
    {
      id: makeId("feed"),
      at: now.toISOString(),
      kind: "sync",
      actor: "planning",
      text: "La feuille de service v3.2 a été synchronisée avec le lieu, la photo et le traiteur.",
    },
    {
      id: makeId("feed"),
      at: addHours(now, -1),
      kind: "validation",
      actor: "couple",
      text: "Le couple a validé l'ordre actuel de la cérémonie et du cocktail.",
    },
    {
      id: makeId("feed"),
      at: addHours(now, -2),
      kind: "watch",
      actor: "planning",
      text: "La météo est stable, mais le plan B reste préparé en coulisse.",
    },
  ];
}

function createBudgetItems() {
  return [
    { id: "venue", label: "Lieu", allocated: 6200, current: 6200, owner: "lieu", status: "verrouillé", note: "Location + logistique accès." },
    { id: "catering", label: "Traiteur", allocated: 9800, current: 9800, owner: "traiteur", status: "verrouillé", note: "Cocktail, dîner, boissons et dessert." },
    { id: "photo", label: "Photo / Vidéo", allocated: 3600, current: 3200, owner: "photo", status: "en arbitrage", note: "Option drone encore à confirmer." },
    { id: "music", label: "DJ / Son", allocated: 1800, current: 1800, owner: "dj", status: "verrouillé", note: "DJ + micros + ouverture de bal." },
    { id: "flowers", label: "Fleurs & scénographie", allocated: 2400, current: 2100, owner: "planning", status: "à confirmer", note: "Le plan B météo peut ajouter un coût de verrière." },
    { id: "stationery", label: "Papeterie & signalétique", allocated: 1100, current: 980, owner: "planning", status: "en cours", note: "Ajustements si invités supplémentaires." },
    { id: "transport", label: "Transport & navettes", allocated: 900, current: 900, owner: "planning", status: "verrouillé", note: "Navette nuit incluse." },
    { id: "contingency", label: "Marge & imprévus", allocated: 2600, current: 600, owner: "planning", status: "réserve", note: "Tampon à préserver pour météo, timing, invités." },
  ];
}

function createBudgetDecisions(now) {
  return [
    {
      id: makeId("dec"),
      title: "Ajouter 12 invités au dîner",
      detail: "Le couple envisage d'augmenter le volume d'invités si les confirmations tardives se stabilisent.",
      amount: 1440,
      categoryId: "catering",
      status: "pending",
      impact: "Affecte traiteur, plan de table et signalétique.",
      dueAt: addHours(now, 6),
    },
    {
      id: makeId("dec"),
      title: "Activer la verrière en plan B météo",
      detail: "Le basculement météo créerait un surcoût de montage, lumière et floral.",
      amount: 620,
      categoryId: "flowers",
      status: "pending",
      impact: "Touche directement la marge imprévus.",
      dueAt: addHours(now, 18),
    },
    {
      id: makeId("dec"),
      title: "Valider l'option drone vidéo",
      detail: "Belle plus-value visuelle, mais non essentielle si la météo reste instable.",
      amount: 400,
      categoryId: "photo",
      status: "pending",
      impact: "Décision confort / image, à arbitrer selon météo et marge restante.",
      dueAt: addHours(now, 20),
    },
  ];
}

function createVendorMarketplace(now) {
  return [
    {
      id: "planner_maison",
      roleId: "planning",
      category: "planner",
      name: "AIME Wedding / Point Zéro",
      city: "Lille",
      rating: 4.9,
      priceFrom: 3200,
      responseTime: "2h",
      status: "confirmé",
      contactStage: "booked",
      shortlisted: true,
      paymentStatus: "acompte reçu",
      bookedAt: addHours(now, -168),
      nextTouchpointAt: addHours(now, 48),
      summary: "Coordination complète, arbitrages, docs partagés et pilotage du Jour J.",
      tags: ["Coordination", "Jour J", "Docs"],
    },
    {
      id: "venue_lys",
      roleId: "lieu",
      category: "venue",
      name: "Château de la Lys",
      city: "Lille",
      rating: 4.8,
      priceFrom: 6200,
      responseTime: "4h",
      status: "confirmé",
      paymentStatus: "solde à venir",
      summary: "Lieu de réception avec verrière, parking, accès PMR et plan B intégré.",
      tags: ["Plan B", "PMR", "Parking"],
    },
    {
      id: "photo_sillage",
      roleId: "photo",
      category: "photo-video",
      name: "Studio Sillage",
      city: "Lille",
      rating: 4.9,
      priceFrom: 3200,
      responseTime: "3h",
      status: "confirmé",
      paymentStatus: "option drone en attente",
      summary: "Photo et vidéo avec fenêtre lumière optimisée et suivi serré du timing.",
      tags: ["Photo", "Vidéo", "Drone"],
    },
    {
      id: "catering_aurore",
      roleId: "traiteur",
      category: "catering",
      name: "Maison Aurore",
      city: "Lille",
      rating: 4.8,
      priceFrom: 9800,
      responseTime: "2h",
      status: "confirmé",
      paymentStatus: "solde à sécuriser",
      summary: "Cocktail, dîner, régimes spéciaux et cadence service très maîtrisés.",
      tags: ["Cocktail", "Dîner", "Allergies"],
    },
    {
      id: "music_sonore",
      roleId: "dj",
      category: "music",
      name: "Atelier Sonore",
      city: "Lille",
      rating: 4.7,
      priceFrom: 1800,
      responseTime: "5h",
      status: "confirmé",
      paymentStatus: "solde à venir",
      bookedAt: addHours(now, -84),
      nextTouchpointAt: addHours(now, 96),
      summary: "DJ, micros, ouverture de bal et transitions soirée jusqu’à l’after.",
      tags: ["DJ", "Micros", "Ouverture"],
    },
    {
      id: "flowers_ligne",
      roleId: "planning",
      category: "flowers-decor",
      name: "Ligne Florale",
      city: "Lille",
      rating: 4.8,
      priceFrom: 2100,
      responseTime: "6h",
      status: "à confirmer",
      contactStage: "contacted",
      shortlisted: true,
      paymentStatus: "acompte à payer",
      bookedAt: null,
      nextTouchpointAt: addHours(now, 18),
      summary: "Fleurs, verrière, signalétique décor et bascule esthétique en plan B.",
      tags: ["Fleurs", "Scéno", "Plan B"],
    },
    {
      id: "transport_nuit",
      roleId: "planning",
      category: "transport",
      name: "Navette de Nuit",
      city: "Lille",
      rating: 4.6,
      priceFrom: 900,
      responseTime: "12h",
      status: "réservé",
      contactStage: "booked",
      shortlisted: false,
      paymentStatus: "payé",
      bookedAt: addHours(now, -60),
      nextTouchpointAt: addHours(now, 132),
      summary: "Navettes invités, retours tardifs et logistique de mobilité le soir.",
      tags: ["Navettes", "Invités", "Retour"],
    },
    {
      id: "beauty_aube",
      roleId: "famille",
      category: "beauty",
      name: "Aube Beauté",
      city: "Lille",
      rating: 4.7,
      priceFrom: 760,
      responseTime: "8h",
      status: "option",
      paymentStatus: "option à confirmer",
      bookedAt: null,
      nextTouchpointAt: addHours(now, 60),
      summary: "Coiffure et maquillage mariée + retouches discrètes pendant la journée.",
      tags: ["Beauté", "Mariée", "Retouches"],
    },
  ];
}

function createSharedNotes(now) {
  return [
    {
      id: makeId("note"),
      author: "planning",
      audience: ["couple", "planner"],
      title: "Vue globale stable",
      text: "Lieu, photo et traiteur sont verrouillés. Les vrais arbitrages restants concernent la verrière météo, l’option drone et deux paiements à venir.",
      createdAt: addHours(now, -12),
      pinned: true,
    },
    {
      id: makeId("note"),
      author: "planning",
      audience: ["couple", "planner", "vendors"],
      title: "Jour J à protéger",
      text: "Le point sensible reste le dîner : discours, captation et ouverture de bal doivent rester alignés pour garder une soirée fluide.",
      createdAt: addHours(now, -8),
      pinned: false,
    },
    {
      id: makeId("note"),
      author: "planning",
      audience: ["planner", "vendors"],
      title: "Prestataires à confirmer",
      text: "Fleurs & déco et beauté restent en zone de validation. Le reste est réservé ou confirmé.",
      createdAt: addHours(now, -5),
      pinned: false,
    },
  ];
}

function createVendorPayments(now) {
  return [
    { id: "pay_planner_1", vendorId: "planner_maison", label: "Acompte coordination", amount: 1600, dueAt: addHours(now, -120), status: "paid", method: "virement" },
    { id: "pay_planner_2", vendorId: "planner_maison", label: "Solde coordination", amount: 1600, dueAt: addHours(now, 240), status: "scheduled", method: "virement" },
    { id: "pay_venue_1", vendorId: "venue_lys", label: "Acompte lieu", amount: 3100, dueAt: addHours(now, -96), status: "paid", method: "virement" },
    { id: "pay_venue_2", vendorId: "venue_lys", label: "Solde lieu", amount: 3100, dueAt: addHours(now, 168), status: "scheduled", method: "virement" },
    { id: "pay_photo_1", vendorId: "photo_sillage", label: "Acompte photo / vidéo", amount: 1600, dueAt: addHours(now, -72), status: "paid", method: "virement" },
    { id: "pay_photo_2", vendorId: "photo_sillage", label: "Option drone", amount: 400, dueAt: addHours(now, 24), status: "due", method: "virement" },
    { id: "pay_catering_1", vendorId: "catering_aurore", label: "Acompte traiteur", amount: 4900, dueAt: addHours(now, -48), status: "paid", method: "virement" },
    { id: "pay_catering_2", vendorId: "catering_aurore", label: "Solde traiteur", amount: 4900, dueAt: addHours(now, 72), status: "due", method: "virement" },
    { id: "pay_music_1", vendorId: "music_sonore", label: "Solde DJ / son", amount: 1800, dueAt: addHours(now, 120), status: "scheduled", method: "virement" },
    { id: "pay_flowers_1", vendorId: "flowers_ligne", label: "Acompte fleurs & déco", amount: 1050, dueAt: addHours(now, 48), status: "due", method: "virement" },
    { id: "pay_transport_1", vendorId: "transport_nuit", label: "Navettes de nuit", amount: 900, dueAt: addHours(now, -36), status: "paid", method: "virement" },
    { id: "pay_beauty_1", vendorId: "beauty_aube", label: "Option beauté", amount: 760, dueAt: addHours(now, 96), status: "scheduled", method: "virement" },
  ];
}

export function createDefaultWeddingState() {
  const now = new Date();
  const contacts = createContactsSnapshot();
  const meta = {
    couple: "Iris & Noam",
    date: "2027-06-18",
    venue: "Château de la Lys",
    city: "Lille",
    guests: 124,
    budget: 28400,
    countdownDays: getCountdownDays("2027-06-18"),
    weather: "stable",
    globalRisk: 22,
    scheduleShiftMinutes: 0,
    accessibility: false,
    coordinationStatus: "stable",
  };

  contacts.couple = { ...contacts.couple, name: meta.couple };
  contacts.lieu = { ...contacts.lieu, name: meta.venue };

  const guestsProfile = createGuestsProfileState();
  const orchestration = createOrchestrationState();
  const guests = createGuestRegistry(now);

  return {
    meta: {
      ...meta,
      guests: guests.list.length,
    },
    roles: createRoleTemplates({ couple: meta.couple, venue: meta.venue, contacts }),
    contacts,
    setup: createSetupState(now),
    guests,
    guestsProfile,
    orchestration,
    documents: createDocumentTemplates(now),
    reminders: [
      { id: makeId("rem"), title: "Relire la feuille de service finale", owner: "planning", dueAt: addHours(now, 12), priority: "haute", status: "open", context: "documents" },
      { id: makeId("rem"), title: "Envoyer le running order aux prestataires", owner: "planning", dueAt: addHours(now, 24), priority: "moyenne", status: "open", context: "jour-j" },
      { id: makeId("rem"), title: "Valider le plan de table avec le couple", owner: "couple", dueAt: addHours(now, 36), priority: "haute", status: "open", context: "invités" },
      { id: makeId("rem"), title: "Confirmer les horaires d'arrivée témoins & famille", owner: "famille", dueAt: addHours(now, 18), priority: "moyenne", status: "open", context: "orchestration" },
    ],
    automations: [
      {
        id: "guest-delta",
        title: "Variation d'invités → recalcul budget & seating",
        trigger: "Quand le nombre d'invités change",
        effect: "Met à jour budget, seating, traiteur et docs critiques.",
        enabled: true,
        lastRunAt: null,
        status: "armé",
      },
      {
        id: "weather-plan-b",
        title: "Météo → activation du plan B cérémonie",
        trigger: "Si pluie probable J-3 ou J-1",
        effect: "Prépare le plan B, notifie l'équipe et bascule les docs de terrain.",
        enabled: true,
        lastRunAt: null,
        status: "armé",
      },
      {
        id: "pmr-flow",
        title: "PMR → audit circulation & accueil",
        trigger: "Si besoin PMR détecté",
        effect: "Crée un rappel accessibilité et reconfigure les flux terrain.",
        enabled: true,
        lastRunAt: null,
        status: "armé",
      },
      {
        id: "speech-shift",
        title: "Discours supplémentaire → ajustement programme",
        trigger: "Si un discours est ajouté ou rallongé",
        effect: "Décale le dîner et prévient photo / vidéo / son.",
        enabled: false,
        lastRunAt: null,
        status: "veille",
      },
      {
        id: "vendor-delay",
        title: "Retard prestataire → replanification montage",
        trigger: "Si un prestataire signale un retard",
        effect: "Réordonne les tâches prioritaires pour tenir le cocktail et la cérémonie.",
        enabled: true,
        lastRunAt: null,
        status: "armé",
      },
    ],
    programme: [
      { time: "10:00", title: "Arrivée technique", detail: "Lieu, fleuriste, audio, lumière" },
      { time: "13:00", title: "Habillage cérémonie", detail: "Signalétique, assises, bouquet final" },
      { time: "16:30", title: "Accueil invités", detail: "Hôtesses, parking, boissons fraîches" },
      { time: "17:00", title: "Cérémonie", detail: "Transition vers cocktail si météo stable" },
      { time: "19:30", title: "Dîner & discours", detail: "Fenêtre critique sur timing et captation" },
      { time: "23:15", title: "Dancefloor", detail: "Ouverture si service et discours sont absorbés" },
    ],
    timeline: {
      steps: createTimelineSteps(now),
      liveFeed: createLiveFeed(now),
    },
    communications: {
      templates: createCommunicationTemplates(),
      history: [
        {
          id: makeId("msg"),
          title: "Feuille de service synchronisée",
          audience: ["photo", "traiteur", "lieu"],
          text: "La feuille de service v3.2 est désormais la version de référence. Merci de relire vos horaires et accès techniques.",
          sender: "planning",
          status: "sent",
          sentAt: now.toISOString(),
          source: "document",
        },
      ],
    },
    vendors: {
      marketplace: createVendorMarketplace(now),
      payments: createVendorPayments(now),
    },
    guestPortal: createGuestPortal(now),
    notes: createSharedNotes(now),
    budget: {
      envelope: 28400,
      items: syncBudgetItemsToEnvelope(createBudgetItems(), 28400),
      decisions: createBudgetDecisions(now),
    },
    aftercare: [
      { id: makeId("aft"), title: "Collecte photos & vidéos", status: "à lancer" },
      { id: makeId("aft"), title: "Paiements finaux", status: "en attente" },
      { id: makeId("aft"), title: "Messages de remerciement", status: "brouillon" },
      { id: makeId("aft"), title: "Archive du mariage", status: "à composer" },
    ],
    rippleLog: [
      {
        id: makeId("log"),
        at: now.toISOString(),
        signal: "Point Zéro prêt",
        title: "État initial chargé",
        summary: "La vision, les rôles, les rappels, les automatisations et les documents sont synchronisés.",
        impacts: [],
      },
    ],
  };
}

export function readWeddingState() {
  if (typeof window === "undefined") return createDefaultWeddingState();
  try {
    const raw = window.localStorage.getItem(AIME_WEDDING_STORAGE_KEY);
    if (!raw) return createDefaultWeddingState();
    const parsed = JSON.parse(raw);
    const base = createDefaultWeddingState();
    return {
      ...base,
      ...parsed,
      meta: { ...base.meta, ...(parsed.meta || {}) },
      roles: Array.isArray(parsed.roles) ? parsed.roles : base.roles,
      contacts: Object.fromEntries(
        Object.entries(base.contacts).map(([id, contact]) => [id, { ...contact, ...(parsed.contacts?.[id] || {}) }]),
      ),
      setup: {
        ...base.setup,
        ...(parsed.setup || {}),
        starterDocs: Array.isArray(parsed.setup?.starterDocs) && parsed.setup.starterDocs.length
          ? parsed.setup.starterDocs
          : base.setup.starterDocs,
      },
      guests: {
        ...base.guests,
        ...(parsed.guests || {}),
        list: Array.isArray(parsed.guests?.list) ? parsed.guests.list : base.guests.list,
      },
      guestsProfile: {
        ...base.guestsProfile,
        ...(parsed.guestsProfile || {}),
      },
      orchestration: {
        ...base.orchestration,
        ...(parsed.orchestration || {}),
      },
      documents: Array.isArray(parsed.documents) ? parsed.documents : base.documents,
      reminders: Array.isArray(parsed.reminders) ? parsed.reminders : base.reminders,
      automations: Array.isArray(parsed.automations) ? parsed.automations : base.automations,
      programme: Array.isArray(parsed.programme) ? parsed.programme : base.programme,
      aftercare: Array.isArray(parsed.aftercare) ? parsed.aftercare : base.aftercare,
      rippleLog: Array.isArray(parsed.rippleLog) ? parsed.rippleLog : base.rippleLog,
      timeline: {
        steps: Array.isArray(parsed.timeline?.steps) ? parsed.timeline.steps : base.timeline.steps,
        liveFeed: Array.isArray(parsed.timeline?.liveFeed) ? parsed.timeline.liveFeed : base.timeline.liveFeed,
      },
      communications: {
        templates: Array.isArray(parsed.communications?.templates) ? parsed.communications.templates : base.communications.templates,
        history: Array.isArray(parsed.communications?.history) ? parsed.communications.history : base.communications.history,
      },
      vendors: {
        marketplace: Array.isArray(parsed.vendors?.marketplace) ? parsed.vendors.marketplace : base.vendors.marketplace,
        payments: Array.isArray(parsed.vendors?.payments) ? parsed.vendors.payments : base.vendors.payments,
      },
      guestPortal: {
        ...base.guestPortal,
        ...(parsed.guestPortal || {}),
        schedule: Array.isArray(parsed.guestPortal?.schedule) ? parsed.guestPortal.schedule : base.guestPortal.schedule,
        accommodations: Array.isArray(parsed.guestPortal?.accommodations) ? parsed.guestPortal.accommodations : base.guestPortal.accommodations,
        shuttles: Array.isArray(parsed.guestPortal?.shuttles) ? parsed.guestPortal.shuttles : base.guestPortal.shuttles,
        faq: Array.isArray(parsed.guestPortal?.faq) ? parsed.guestPortal.faq : base.guestPortal.faq,
        travel: {
          ...base.guestPortal.travel,
          ...(parsed.guestPortal?.travel || {}),
        },
      },
      notes: Array.isArray(parsed.notes) ? parsed.notes : base.notes,
      budget: {
        envelope: parsed.budget?.envelope ?? base.budget.envelope,
        items: Array.isArray(parsed.budget?.items) ? parsed.budget.items : base.budget.items,
        decisions: Array.isArray(parsed.budget?.decisions) ? parsed.budget.decisions : base.budget.decisions,
      },
    };
  } catch {
    return createDefaultWeddingState();
  }
}

export function writeWeddingState(state) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AIME_WEDDING_STORAGE_KEY, JSON.stringify(state));
}

export function isWeddingSetupComplete(state) {
  if (state?.setup?.completed) return true;
  const defaults = createDefaultWeddingState().meta;
  const meta = state?.meta || {};
  return ["couple", "date", "venue", "city", "guests", "budget"].some((key) => meta[key] !== defaults[key]);
}

export function configureWeddingInState(currentState, payload = {}) {
  const base = currentState || createDefaultWeddingState();
  const now = new Date();
  const defaultStarterDocs = STARTER_DOCUMENT_OPTIONS.map((item) => item.id);
  const requestedStarterDocs = Array.isArray(payload.starterDocs)
    ? payload.starterDocs
    : base.setup?.starterDocs || defaultStarterDocs;
  const starterDocs = [...new Set(requestedStarterDocs)]
    .filter((id) => SETUP_DOCUMENT_OPTIONS.some((item) => item.id === id));
  const safeStarterDocs = starterDocs.length ? starterDocs : defaultStarterDocs;

  const couple = (payload.couple || base.meta?.couple || "Couple").trim();
  const date = payload.date || base.meta?.date;
  const venue = (payload.venue || base.meta?.venue || "Lieu").trim();
  const city = (payload.city || base.meta?.city || "").trim();
  const guests = normalizeCount(payload.guests, base.meta?.guests || 0);
  const budgetEnvelope = normalizeMoney(
    payload.budgetEnvelope ?? payload.budget,
    base.budget?.envelope ?? base.meta?.budget ?? 0,
  );
  const nextGuestsProfile = {
    ...createGuestsProfileState(),
    ...(base.guestsProfile || {}),
    ...(payload.guestsProfile || {}),
  };
  nextGuestsProfile.children = normalizeCount(nextGuestsProfile.children, 0);
  nextGuestsProfile.pmr = normalizeCount(nextGuestsProfile.pmr, 0);
  nextGuestsProfile.specialMeals = normalizeCount(nextGuestsProfile.specialMeals, 0);
  nextGuestsProfile.speeches = normalizeCount(nextGuestsProfile.speeches, 0);

  const nextOrchestration = {
    ...createOrchestrationState(),
    ...(base.orchestration || {}),
    ...(payload.orchestration || {}),
  };
  nextOrchestration.planBWeatherReady = Boolean(nextOrchestration.planBWeatherReady);
  nextOrchestration.shuttleNeeded = Boolean(nextOrchestration.shuttleNeeded);
  nextOrchestration.accommodationNeeded = Boolean(nextOrchestration.accommodationNeeded);

  const nextContacts = {
    ...createContactsSnapshot(),
    ...base.contacts,
  };

  Object.entries(payload.contacts || {}).forEach(([id, contact]) => {
    nextContacts[id] = {
      ...(nextContacts[id] || {}),
      ...contact,
    };
  });

  Object.keys(nextContacts).forEach((id) => {
    nextContacts[id] = {
      ...nextContacts[id],
      name: nextContacts[id]?.name?.trim() || nextContacts[id]?.name || "",
      phone: nextContacts[id]?.phone?.trim?.() || nextContacts[id]?.phone || "",
      note: nextContacts[id]?.note?.trim?.() || nextContacts[id]?.note || "",
    };
  });

  nextContacts.couple = {
    ...nextContacts.couple,
    name: payload.contacts?.couple?.name?.trim() || couple,
  };
  nextContacts.lieu = {
    ...nextContacts.lieu,
    name: payload.contacts?.lieu?.name?.trim()
      || (base.contacts?.lieu?.name === base.meta?.venue ? venue : nextContacts.lieu?.name)
      || venue,
  };

  const nextRoles = createRoleTemplates({ couple, venue, contacts: nextContacts }).map((role) => {
    const existing = (base.roles || []).find((item) => item.id === role.id);
    return existing
      ? {
          ...role,
          status: existing.status || role.status,
          note: existing.note || role.note,
        }
      : role;
  });

  const documentTemplates = Object.fromEntries(
    createDocumentTemplates(now).map((doc) => [doc.id, doc]),
  );
  const currentDocuments = Object.fromEntries(
    (base.documents || []).map((doc) => [doc.id, doc]),
  );
  const nextDocuments = safeStarterDocs
    .map((id) => {
      const template = documentTemplates[id];
      if (!template) return null;
      return {
        ...template,
        ...(currentDocuments[id] || {}),
      };
    })
    .filter(Boolean);

  const nextBudgetItems = syncBudgetItemsToEnvelope(
    base.budget?.items || createBudgetItems(),
    budgetEnvelope,
  );
  const nextReminders = syncSetupReminders(base, {
    guestsProfile: nextGuestsProfile,
    orchestration: nextOrchestration,
  });
  const setupWasComplete = isWeddingSetupComplete(base);

  return {
    ...base,
    meta: {
      ...base.meta,
      couple,
      date,
      venue,
      city,
      guests,
      budget: budgetEnvelope,
      countdownDays: getCountdownDays(date),
      accessibility: nextGuestsProfile.pmr > 0,
    },
    roles: nextRoles,
    contacts: nextContacts,
    setup: {
      ...(base.setup || createSetupState(now)),
      completed: true,
      completedAt: base.setup?.completedAt || now.toISOString(),
      updatedAt: now.toISOString(),
      starterDocs: safeStarterDocs,
    },
    guestsProfile: nextGuestsProfile,
    orchestration: nextOrchestration,
    documents: nextDocuments,
    reminders: nextReminders,
    budget: {
      ...base.budget,
      envelope: budgetEnvelope,
      items: nextBudgetItems,
    },
    rippleLog: [
      {
        id: makeId("log"),
        at: now.toISOString(),
        signal: "Setup mariage",
        title: setupWasComplete ? "Paramètres du mariage mis à jour" : "Mariage initialisé",
        summary: `Le mariage ${couple} est cadré pour ${venue}, ${city}, avec ${guests} invités et une enveloppe de ${formatMoney(budgetEnvelope)}.`,
        impacts: [
          { scope: "Cadre", text: `${date} · ${venue} · ${city}.` },
          { scope: "Rôles", text: `${nextContacts.planning?.name || "Planning"}, ${nextContacts.photo?.name || "Photo / vidéo"} et ${nextContacts.traiteur?.name || "Traiteur"} sont renseignés.` },
          { scope: "Invités", text: `${nextGuestsProfile.children} enfant(s) · ${nextGuestsProfile.pmr} PMR · ${nextGuestsProfile.specialMeals} repas spéciaux · ${nextGuestsProfile.speeches} discours.` },
          { scope: "Orchestration", text: `${getOptionLabel(COORDINATION_MODE_OPTIONS, nextOrchestration.coordinationMode)} · cérémonie ${getOptionLabel(CEREMONY_FORMAT_OPTIONS, nextOrchestration.ceremonyFormat).toLowerCase()} · plan B ${nextOrchestration.planBWeatherReady ? "prêt" : "à construire"}.` },
          { scope: "Documents", text: `${safeStarterDocs.length} document(s) de départ activé(s).` },
        ],
      },
      ...(base.rippleLog || []),
    ].slice(0, 24),
  };
}

export function filterDocumentsByRole(documents = [], roleView = "planner") {
  const role = ROLE_VIEWS[roleView] || ROLE_VIEWS.planner;
  return documents.filter((doc) => doc.sharedWith.some((item) => role.members.includes(item)) || role.members.includes(doc.owner));
}

export function filterTimelineByRole(steps = [], roleView = "planner") {
  const role = ROLE_VIEWS[roleView] || ROLE_VIEWS.planner;
  return steps.filter((step) => step.owners.some((owner) => role.members.includes(owner)));
}

export function getContactsForRole(stateOrRoleView = "planner", maybeRoleView = "planner") {
  const hasState = typeof stateOrRoleView === "object" && stateOrRoleView !== null && !Array.isArray(stateOrRoleView);
  const roleView = hasState ? maybeRoleView : stateOrRoleView;
  /** @type {any} */
  const stateObject = hasState ? stateOrRoleView : null;
  const sourceContacts = stateObject?.contacts || createContactsSnapshot();
  const role = ROLE_VIEWS[roleView] || ROLE_VIEWS.planner;

  return role.members
    .map((member) => ({
      id: member,
      ...(sourceContacts[member] || CONTACTS[member] || {}),
    }))
    .filter((item) => item.label);
}

export function getNotificationsForRole(state, roleView = "planner") {
  const role = ROLE_VIEWS[roleView] || ROLE_VIEWS.planner;
  const docs = filterDocumentsByRole(state.documents || [], roleView);
  const steps = filterTimelineByRole(state.timeline?.steps || [], roleView);
  const reminders = (state.reminders || []).filter((item) => role.members.includes(item.owner) || role.members.includes("planning"));
  const automations = state.automations || [];
  const feed = state.timeline?.liveFeed || [];
  const budgetItems = state.budget?.items || [];
  const budgetDecisions = state.budget?.decisions || [];
  const vendorPayments = state.vendors?.payments || [];
  const vendorDirectory = state.vendors?.marketplace || [];
  const communications = state.communications?.history || [];

  const out = [];

  for (const reminder of reminders) {
    if (reminder.status === "done") continue;
    const due = new Date(reminder.dueAt).getTime() - Date.now();
    const hours = Math.round(due / 3600000);
    const critical = reminder.priority === "critique" || hours <= 6;
    out.push({
      id: `rem_${reminder.id}`,
      type: "reminder",
      level: critical ? "critical" : "warning",
      title: reminder.title,
      text: `Échéance ${hours <= 0 ? "immédiate" : `dans ${hours}h`} · owner ${reminder.owner}.`,
      source: "Rappel",
      href: "/point-zero",
      cta: "Voir",
    });
  }

  for (const doc of docs) {
    if (["prêt", "partagé", "complet"].includes(doc.status)) continue;
    out.push({
      id: `doc_${doc.id}`,
      type: "document",
      level: doc.status === "à mettre à jour" ? "critical" : "warning",
      title: doc.title,
      text: `Statut actuel : ${doc.status}. Owner : ${doc.owner}.`,
      source: "Document",
      href: "/documents",
      cta: "Ouvrir",
    });
  }

  for (const automation of automations) {
    if (!automation.enabled || !automation.lastRunAt) continue;
    const ageHours = Math.round((Date.now() - new Date(automation.lastRunAt).getTime()) / 3600000);
    if (ageHours > 24) continue;
    out.push({
      id: `auto_${automation.id}`,
      type: "automation",
      level: "info",
      title: automation.title,
      text: `Automation déclenchée récemment (${ageHours}h). ${automation.effect}`,
      source: "Automation",
      href: "/point-zero",
      cta: "Voir",
    });
  }

  for (const step of steps) {
    if (!["watch", "blocked", "live"].includes(step.status)) continue;
    out.push({
      id: `step_${step.id}`,
      type: "timeline",
      level: step.status === "blocked" ? "critical" : step.status === "watch" ? "warning" : "info",
      title: `${step.time} · ${step.title}`,
      text: `Étape ${TIMELINE_STATUS[step.status]?.label?.toLowerCase() || step.status}.`,
      source: "Jour J",
      href: "/jour-j",
      cta: "Suivre",
    });
  }

  for (const entry of feed.slice(0, 3)) {
    if (entry.kind !== "incident") continue;
    out.push({
      id: `feed_${entry.id}`,
      type: "timeline",
      level: "warning",
      title: `Signal terrain · ${entry.actor}`,
      text: entry.text,
      source: "Live feed",
      href: "/jour-j",
      cta: "Lire",
    });
  }

  if (roleView !== "vendors") {
    for (const decision of budgetDecisions) {
      if (decision.status !== "pending") continue;
      out.push({
        id: `budget_dec_${decision.id}`,
        type: "budget",
        level: "warning",
        title: decision.title,
        text: `Arbitrage budgétaire : ${formatMoney(decision.amount)} · échéance ${formatRelativeDue(decision.dueAt)}.`,
        source: "Budget",
        href: "/budget",
        cta: "Arbitrer",
      });
    }

    for (const item of budgetItems) {
      if (item.current > item.allocated) {
        out.push({
          id: `budget_item_${item.id}`,
          type: "budget",
          level: "critical",
          title: `${item.label} dépasse l'enveloppe`,
          text: `${formatMoney(item.current - item.allocated)} au-dessus de l'allocation prévue.`,
          source: "Budget",
          href: "/budget",
          cta: "Voir budget",
        });
      }
    }

    for (const payment of vendorPayments) {
      if (payment.status === "paid") continue;
      const vendor = vendorDirectory.find((item) => item.id === payment.vendorId);
      const dueHours = Math.round((new Date(payment.dueAt).getTime() - Date.now()) / 3600000);
      if (payment.status === "scheduled" && dueHours > 96) continue;
      out.push({
        id: `payment_${payment.id}`,
        type: "budget",
        level: payment.status === "due" || dueHours <= 48 ? "warning" : "info",
        title: `${vendor?.name || "Prestataire"} · ${payment.label}`,
        text: `${formatMoney(payment.amount)} · ${payment.status === "due" ? "paiement à lancer" : `échéance ${formatRelativeDue(payment.dueAt)}`}.`,
        source: "Paiement prestataire",
        href: "/budget",
        cta: "Voir paiement",
      });
    }
  }

  for (const message of communications.slice(0, 8)) {
    const visible = message.audience?.some((aud) => role.members.includes(aud)) || message.audience?.includes("all");
    if (!visible) continue;
    out.push({
      id: `comm_${message.id}`,
      type: "communication",
      level: message.status === "draft" ? "warning" : "info",
      title: message.title,
      text: message.status === "draft"
        ? "Message préparé mais non diffusé."
        : `${message.audience.join(", ")} · envoyé ${formatRelativeSent(message.sentAt)}.`,
      source: "Communication",
      href: "/communication",
      cta: message.status === "draft" ? "Finaliser" : "Voir",
    });
  }

  const rank = { critical: 0, warning: 1, info: 2 };
  return out
    .sort((a, b) => rank[a.level] - rank[b.level])
    .slice(0, 24);
}

function formatMoney(value) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value || 0);
}

function formatRelativeDue(value) {
  const diff = Math.round((new Date(value).getTime() - Date.now()) / 3600000);
  if (diff <= 0) return "immédiate";
  return `dans ${diff}h`;
}

function formatRelativeSent(value) {
  if (!value) return "à l’instant";
  const diff = Math.round((Date.now() - new Date(value).getTime()) / 3600000);
  if (diff <= 0) return "à l’instant";
  return `il y a ${diff}h`;
}

export function getVendorMarketplace(state, category = "all") {
  const marketplace = state?.vendors?.marketplace || [];
  if (category === "all") return marketplace;
  return marketplace.filter((vendor) => vendor.category === category);
}

export function getVendorById(state, vendorId) {
  return (state?.vendors?.marketplace || []).find((vendor) => vendor.id === vendorId) || null;
}

export function toggleVendorShortlistInState(currentState, vendorId) {
  return {
    ...currentState,
    vendors: {
      ...currentState.vendors,
      marketplace: (currentState.vendors?.marketplace || []).map((vendor) =>
        vendor.id === vendorId ? { ...vendor, shortlisted: !vendor.shortlisted } : vendor,
      ),
    },
  };
}

export function updateVendorInState(currentState, vendorId, patch) {
  return {
    ...currentState,
    vendors: {
      ...currentState.vendors,
      marketplace: (currentState.vendors?.marketplace || []).map((vendor) =>
        vendor.id === vendorId
          ? {
              ...vendor,
              ...patch,
              updatedAt: new Date().toISOString(),
            }
          : vendor,
      ),
    },
  };
}

export function getGuestSummary(state) {
  const guests = state?.guests?.list || [];
  const confirmed = guests.filter((guest) => guest.rsvpStatus === "confirmed");
  return {
    total: guests.length,
    confirmed: confirmed.length,
    pending: guests.filter((guest) => guest.rsvpStatus === "pending").length,
    declined: guests.filter((guest) => guest.rsvpStatus === "declined").length,
    tables: new Set(confirmed.map((guest) => guest.tableCode).filter(Boolean)).size,
    vegetarian: guests.filter((guest) => guest.mealPreference === "vegetarian").length,
    allergies: guests.filter((guest) => guest.mealPreference === "allergy").length,
    children: guests.filter((guest) => guest.mealPreference === "child").length,
    pmr: guests.filter((guest) => guest.accessibilityNeed).length,
  };
}

export function getInvitationSummary(state) {
  const guests = state?.guests?.list || [];
  return {
    total: guests.length,
    draft: guests.filter((guest) => guest.invitationStatus === "draft").length,
    sent: guests.filter((guest) => guest.invitationStatus === "sent").length,
    opened: guests.filter((guest) => guest.invitationStatus === "opened").length,
    eveningOnly: guests.filter((guest) => guest.eventAccess === "evening").length,
    plusOneAllowed: guests.filter((guest) => guest.plusOneAllowed).length,
  };
}

export function getHouseholdOverview(state) {
  const guests = state?.guests?.list || [];
  const households = new Map();

  guests.forEach((guest) => {
    const householdId = guest.householdId || guest.household;
    if (!households.has(householdId)) {
      households.set(householdId, {
        id: householdId,
        label: guest.household,
        members: [],
      });
    }
    households.get(householdId).members.push(guest);
  });

  return Array.from(households.values()).map((household) => {
    const members = household.members;
    return {
      ...household,
      count: members.length,
      invitationStatus: members.every((guest) => guest.invitationStatus === "opened")
        ? "opened"
        : members.some((guest) => guest.invitationStatus === "sent" || guest.invitationStatus === "opened")
        ? "sent"
        : "draft",
      confirmed: members.filter((guest) => guest.rsvpStatus === "confirmed").length,
      pending: members.filter((guest) => guest.rsvpStatus === "pending").length,
      eveningOnly: members.every((guest) => guest.eventAccess === "evening"),
      plusOnes: members.filter((guest) => guest.plusOneAllowed).length,
    };
  }).sort((a, b) => a.label.localeCompare(b.label));
}

export function getTableOverview(state) {
  const guests = (state?.guests?.list || []).filter((guest) => guest.rsvpStatus === "confirmed");
  const tables = new Map();
  guests.forEach((guest) => {
    const tableCode = guest.tableCode || "Sans table";
    if (!tables.has(tableCode)) {
      tables.set(tableCode, {
        id: tableCode,
        guestCount: 0,
        allergies: 0,
        vegetarian: 0,
        children: 0,
        pmr: 0,
      });
    }
    const table = tables.get(tableCode);
    table.guestCount += 1;
    if (guest.mealPreference === "allergy") table.allergies += 1;
    if (guest.mealPreference === "vegetarian") table.vegetarian += 1;
    if (guest.mealPreference === "child") table.children += 1;
    if (guest.accessibilityNeed) table.pmr += 1;
  });
  return Array.from(tables.values()).sort((a, b) => a.id.localeCompare(b.id));
}

export function getSeatingGroups(state) {
  const confirmed = (state?.guests?.list || [])
    .filter((guest) => guest.rsvpStatus === "confirmed")
    .sort((a, b) => (a.seatOrder ?? 0) - (b.seatOrder ?? 0) || `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`));

  const groups = new Map();
  confirmed.forEach((guest) => {
    const tableCode = guest.tableCode || "Sans table";
    if (!groups.has(tableCode)) {
      groups.set(tableCode, {
        id: tableCode,
        label: tableCode,
        guests: [],
      });
    }
    groups.get(tableCode).guests.push(guest);
  });

  const out = Array.from(groups.values()).sort((a, b) => {
    if (a.id === "Sans table") return -1;
    if (b.id === "Sans table") return 1;
    return a.id.localeCompare(b.id);
  });

  return out;
}

export function updateGuestInState(currentState, guestId, patch) {
  const nextList = (currentState.guests?.list || []).map((guest) => {
    if (guest.id !== guestId) return guest;
    const nextStatus = patch.rsvpStatus || guest.rsvpStatus;
    const nextInvitation = patch.invitationStatus || guest.invitationStatus;
    return {
      ...guest,
      ...patch,
      tableCode: nextStatus === "declined" ? null : (patch.tableCode ?? guest.tableCode),
      invitedAt: nextInvitation === "draft" ? null : (patch.invitedAt ?? guest.invitedAt),
      invitationOpenedAt: nextInvitation === "opened"
        ? (patch.invitationOpenedAt ?? guest.invitationOpenedAt ?? new Date().toISOString())
        : nextInvitation === "draft"
        ? null
        : guest.invitationOpenedAt,
      updatedAt: new Date().toISOString(),
    };
  });

  return {
    ...currentState,
    guests: {
      ...(currentState.guests || {}),
      list: nextList,
      updatedAt: new Date().toISOString(),
    },
    meta: {
      ...currentState.meta,
      guests: nextList.length,
    },
  };
}

export function updateHouseholdInState(currentState, householdId, patch) {
  const nextList = (currentState.guests?.list || []).map((guest) => {
    if ((guest.householdId || guest.household) !== householdId) return guest;
    const nextInvitation = patch.invitationStatus || guest.invitationStatus;
    return {
      ...guest,
      ...patch,
      invitedAt: nextInvitation === "draft" ? null : (patch.invitedAt ?? guest.invitedAt),
      invitationOpenedAt: nextInvitation === "opened"
        ? (patch.invitationOpenedAt ?? guest.invitationOpenedAt ?? new Date().toISOString())
        : nextInvitation === "draft"
        ? null
        : guest.invitationOpenedAt,
      updatedAt: new Date().toISOString(),
    };
  });

  return {
    ...currentState,
    guests: {
      ...(currentState.guests || {}),
      list: nextList,
      updatedAt: new Date().toISOString(),
    },
  };
}

export function sendHouseholdInvitesInState(currentState, householdId) {
  return updateHouseholdInState(currentState, householdId, {
    invitationStatus: "sent",
    invitedAt: new Date().toISOString(),
  });
}

export function sendGuestInvitesInState(currentState, guestIds = []) {
  const selected = new Set(guestIds);
  const nextList = (currentState.guests?.list || []).map((guest) =>
    selected.has(guest.id)
      ? {
          ...guest,
          invitationStatus: "sent",
          invitedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      : guest
  );

  return {
    ...currentState,
    guests: {
      ...(currentState.guests || {}),
      list: nextList,
      updatedAt: new Date().toISOString(),
    },
  };
}

export function applyGuestSeatingInState(currentState, seatingAssignments = []) {
  const assignmentMap = new Map(seatingAssignments.map((item) => [item.id, item]));
  const nextList = (currentState.guests?.list || []).map((guest) => {
    const nextSeat = assignmentMap.get(guest.id);
    if (!nextSeat) return guest;
    return {
      ...guest,
      tableCode: nextSeat.tableCode ?? guest.tableCode,
      seatOrder: nextSeat.seatOrder ?? guest.seatOrder,
      updatedAt: new Date().toISOString(),
    };
  });

  return {
    ...currentState,
    guests: {
      ...(currentState.guests || {}),
      list: nextList,
      updatedAt: new Date().toISOString(),
    },
  };
}

export function getVendorPaymentSummary(state) {
  const payments = state?.vendors?.payments || [];
  return {
    total: payments.reduce((sum, item) => sum + (item.amount || 0), 0),
    paid: payments.filter((item) => item.status === "paid").reduce((sum, item) => sum + (item.amount || 0), 0),
    due: payments.filter((item) => item.status === "due").reduce((sum, item) => sum + (item.amount || 0), 0),
    scheduled: payments.filter((item) => item.status === "scheduled").reduce((sum, item) => sum + (item.amount || 0), 0),
    openCount: payments.filter((item) => item.status !== "paid").length,
  };
}

export function getNotesForRole(state, roleView = "planner") {
  const role = ROLE_VIEWS[roleView] || ROLE_VIEWS.planner;
  return (state?.notes || []).filter((note) =>
    note.audience?.includes("all") || note.audience?.some((item) => role.members.includes(item) || item === roleView)
  );
}

export function getSmartCalendarItems(state, roleView = "couple") {
  const role = ROLE_VIEWS[roleView] || ROLE_VIEWS.planner;
  const reminders = (state?.reminders || []).filter((item) => role.members.includes(item.owner) || item.owner === "planning");
  const payments = (state?.vendors?.payments || []);
  const vendors = (state?.vendors?.marketplace || []);

  const reminderItems = reminders.map((item) => ({
    id: `rem_${item.id}`,
    at: item.dueAt,
    kind: "reminder",
    level: item.priority === "critique" || item.priority === "haute" ? "high" : "normal",
    title: item.title,
    detail: `Rappel ${item.owner}`,
  }));

  const vendorItems = vendors
    .filter((vendor) => roleView !== "vendors" ? true : role.members.includes(vendor.roleId) || vendor.roleId === "planning")
    .filter((vendor) => vendor.bookedAt || vendor.nextTouchpointAt)
    .map((vendor) => ({
      id: `vendor_${vendor.id}`,
      at: vendor.nextTouchpointAt || vendor.bookedAt,
      kind: "vendor",
      level: vendor.status === "option" || vendor.status === "à confirmer" ? "high" : "normal",
      title: vendor.status === "confirmé" || vendor.status === "réservé"
        ? `${vendor.name} déjà réservé`
        : `${vendor.name} à confirmer`,
      detail: vendor.paymentStatus,
    }));

  const paymentItems = payments
    .filter((payment) => payment.status !== "paid")
    .map((payment) => {
      const vendor = vendors.find((item) => item.id === payment.vendorId);
      return {
        id: `pay_${payment.id}`,
        at: payment.dueAt,
        kind: "payment",
        level: payment.status === "due" ? "high" : "normal",
        title: `${vendor?.name || "Prestataire"} · ${payment.label}`,
        detail: `${formatMoney(payment.amount)} · ${VENDOR_PAYMENT_STATUS[payment.status]?.label || payment.status}`,
      };
    });

  const weddingDay = state?.meta?.date
    ? [{
        id: "wedding_day",
        at: `${state.meta.date}T12:00:00`,
        kind: "day",
        level: "normal",
        title: `Jour J · ${state.meta.couple || "Mariage"}`,
        detail: state.meta.venue || "Lieu",
      }]
    : [];

  return [...vendorItems, ...paymentItems, ...reminderItems, ...weddingDay]
    .sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime())
    .slice(0, 10);
}

export function getBudgetSummary(state) {
  const budget = state.budget || { envelope: 0, items: [], decisions: [] };
  const allocated = budget.items.reduce((sum, item) => sum + (item.allocated || 0), 0);
  const current = budget.items.reduce((sum, item) => sum + (item.current || 0), 0);
  const pending = budget.decisions.filter((item) => item.status === "pending").reduce((sum, item) => sum + (item.amount || 0), 0);
  return {
    envelope: budget.envelope || 0,
    allocated,
    current,
    remaining: (budget.envelope || 0) - current,
    pending,
    over: Math.max(0, current - (budget.envelope || 0)),
  };
}

export function updateBudgetItemInState(currentState, itemId, patch) {
  return {
    ...currentState,
    budget: {
      ...currentState.budget,
      items: currentState.budget.items.map((item) => item.id === itemId ? { ...item, ...patch } : item),
    },
  };
}

export function updateVendorPaymentInState(currentState, paymentId, patch) {
  return {
    ...currentState,
    vendors: {
      ...currentState.vendors,
      payments: (currentState.vendors?.payments || []).map((payment) =>
        payment.id === paymentId
          ? {
              ...payment,
              ...patch,
              paidAt: patch.status === "paid" ? new Date().toISOString() : payment.paidAt || null,
            }
          : payment,
      ),
    },
  };
}

export function applyBudgetDecisionInState(currentState, decisionId, action = "approve") {
  const decision = currentState.budget.decisions.find((item) => item.id === decisionId);
  if (!decision) return currentState;

  const nextItems = currentState.budget.items.map((item) => {
    if (item.id !== decision.categoryId) return item;
    if (action !== "approve") return item;
    return {
      ...item,
      current: (item.current || 0) + (decision.amount || 0),
      status: "en arbitrage",
    };
  });

  const nextDecisions = currentState.budget.decisions.map((item) => item.id === decisionId ? { ...item, status: action === "approve" ? "approved" : "deferred", decidedAt: new Date().toISOString() } : item);

  return {
    ...currentState,
    budget: {
      ...currentState.budget,
      items: nextItems,
      decisions: nextDecisions,
    },
  };
}

export function updateDocumentInState(currentState, documentId, patch) {
  return {
    ...currentState,
    documents: currentState.documents.map((doc) => doc.id === documentId ? {
      ...doc,
      ...patch,
      updatedAt: new Date().toISOString(),
      version: patch.version || bumpVersion(doc.version),
    } : doc),
  };
}

export function toggleDocumentChecklistInState(currentState, documentId, checklistId) {
  return {
    ...currentState,
    documents: currentState.documents.map((doc) => doc.id === documentId ? {
      ...doc,
      updatedAt: new Date().toISOString(),
      checklist: doc.checklist.map((item) => item.id === checklistId ? { ...item, done: !item.done } : item),
    } : doc),
  };
}

export function updateTimelineStepInState(currentState, stepId, patch) {
  return {
    ...currentState,
    timeline: {
      ...currentState.timeline,
      steps: currentState.timeline.steps.map((step) => step.id === stepId ? {
        ...step,
        ...patch,
        updatedAt: new Date().toISOString(),
      } : step),
    },
  };
}

export function appendTimelineLogInState(currentState, entry) {
  return {
    ...currentState,
    timeline: {
      ...currentState.timeline,
      liveFeed: [
        {
          id: makeId("feed"),
          at: new Date().toISOString(),
          kind: entry.kind || "note",
          actor: entry.actor || "planning",
          text: entry.text || "Nouvelle mise à jour terrain.",
        },
        ...(currentState.timeline?.liveFeed || []),
      ].slice(0, 30),
    },
  };
}

export function getCommunicationTemplates() {
  return createCommunicationTemplates();
}

export function getCommunicationsForRole(state, roleView = "planner") {
  const role = ROLE_VIEWS[roleView] || ROLE_VIEWS.planner;
  return (state.communications?.history || []).filter((message) =>
    message.audience?.includes("all") || message.audience?.some((aud) => role.members.includes(aud))
  );
}

export function sendCommunicationInState(currentState, payload) {
  const next = {
    id: makeId("msg"),
    title: payload.title || "Message",
    audience: payload.audience || ["all"],
    text: payload.text || "",
    sender: payload.sender || "planning",
    status: payload.status || "sent",
    sentAt: new Date().toISOString(),
    source: payload.source || "manual",
  };

  return {
    ...currentState,
    communications: {
      ...currentState.communications,
      history: [next, ...(currentState.communications?.history || [])].slice(0, 40),
    },
  };
}

function bumpVersion(version = "v1.0") {
  const match = /v(\d+)\.(\d+)/i.exec(version);
  if (!match) return "v1.0";
  const major = Number(match[1]);
  const minor = Number(match[2]) + 1;
  return `v${major}.${minor}`;
}

function impactedTimelineSteps(signalId) {
  switch (signalId) {
    case "rain_j3":
      return ["habillage-ceremonie", "ceremonie", "accueil-invites"];
    case "vendor_delay":
      return ["arrivee-technique", "habillage-ceremonie", "cocktail-photos"];
    case "speech_plus_one":
      return ["diner-discours", "ouverture-bal"];
    case "pmr_detected":
      return ["accueil-invites", "ceremonie"];
    case "guests_plus_12":
      return ["accueil-invites", "diner-discours"];
    default:
      return [];
  }
}

export function applyWeddingSignal(currentState, signalId) {
  const signal = WEDDING_SIGNALS.find((item) => item.id === signalId);
  if (!signal) return currentState;

  const meta = currentState.meta || createDefaultWeddingState().meta;
  const nextAutomations = (currentState.automations || []).map((automation) => (
    signal.automationTriggers?.includes(automation.id) && automation.enabled
      ? { ...automation, lastRunAt: new Date().toISOString(), status: "déclenché" }
      : automation
  ));

  const nextDocuments = (currentState.documents || []).map((doc) => (
    signal.docUpdates?.includes(doc.id)
      ? { ...doc, status: "à mettre à jour", updatedAt: new Date().toISOString(), version: bumpVersion(doc.version) }
      : doc
  ));

  const impactedSteps = impactedTimelineSteps(signal.id);
  const nextSteps = (currentState.timeline?.steps || []).map((step) => (
    impactedSteps.includes(step.id) && step.status !== "done"
      ? { ...step, status: "watch", updatedAt: new Date().toISOString() }
      : step
  ));

  const nextReminders = [
    ...(signal.reminders || []).map((rem) => ({
      id: makeId("rem"),
      title: rem.title,
      owner: rem.owner,
      dueAt: addHours(new Date(), rem.dueInHours),
      priority: rem.priority,
      status: "open",
      context: signal.title,
    })),
    ...(currentState.reminders || []),
  ].slice(0, 24);

  return {
    ...currentState,
    meta: {
      ...meta,
      guests: meta.guests + (signal.patch.guests || 0),
      budget: meta.budget + (signal.patch.budget || 0),
      weather: signal.patch.weather || meta.weather,
      globalRisk: Math.max(0, meta.globalRisk + (signal.patch.risk || 0)),
      scheduleShiftMinutes: meta.scheduleShiftMinutes + (signal.patch.scheduleMinutes || 0),
      accessibility: signal.patch.accessibility || meta.accessibility,
      coordinationStatus: meta.globalRisk + (signal.patch.risk || 0) > 30 ? "sous tension" : meta.coordinationStatus,
    },
    reminders: nextReminders,
    automations: nextAutomations,
    documents: nextDocuments,
    timeline: {
      steps: nextSteps,
      liveFeed: [
        {
          id: makeId("feed"),
          at: new Date().toISOString(),
          kind: "incident",
          actor: "point-zero",
          text: `${signal.title} · ${signal.summary}`,
        },
        ...(currentState.timeline?.liveFeed || []),
      ].slice(0, 30),
    },
    rippleLog: [
      {
        id: makeId("log"),
        at: new Date().toISOString(),
        signal: signal.label,
        title: signal.title,
        summary: signal.summary,
        impacts: signal.impacts,
      },
      ...(currentState.rippleLog || []),
    ].slice(0, 24),
  };
}
