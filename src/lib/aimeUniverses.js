export const UNIVERSE_GRADIENTS = {
  zeus: "linear-gradient(135deg, #7C6CFF 0%, #4A56C6 100%)",
  poseidon: "linear-gradient(135deg, #4FCBFF 0%, #3F7FD2 100%)",
  athena: "linear-gradient(135deg, #D6DBFF 0%, #8D94CC 100%)",
  aphrodite: "linear-gradient(135deg, #F4B6C8 0%, #B989B7 100%)",
  apollon: "linear-gradient(135deg, #F7C39A 0%, #C98663 100%)",
  hermes: "linear-gradient(135deg, #55E6D5 0%, #4A9FB0 100%)",
  ares: "linear-gradient(135deg, #9FA9C9 0%, #586487 100%)",
  demeter: "linear-gradient(135deg, #7AE3C2 0%, #63AB95 100%)",
  artemis: "linear-gradient(135deg, #6C5AE8 0%, #41339E 100%)",
  hephaistos: "linear-gradient(135deg, #F29B5C 0%, #C4664A 100%)",
  dionysos: "linear-gradient(135deg, #D85AE5 0%, #8B439C 100%)",
  hestia: "linear-gradient(135deg, #E9C0BA 0%, #C9939E 100%)",
};

export const UNIVERSES = [
  {
    id: "zeus",
    label: "Zeus",
    subtitle: "Point Zéro",
    title: "Orchestration globale",
    visualHook: "Le flux souverain qui relie tous les rôles du mariage sans jamais casser la lecture d'ensemble.",
    columns: [
      { title: "Pour les mariés", text: "Gardez la vision d’ensemble sans porter le bruit opérationnel du mariage." },
      { title: "Pour le planner", text: "Centralisez validations, rôles, timings et décisions sensibles dans la même vue." },
      { title: "Ce que cela tient", text: "Budget, documents, diffusion et jour J restent alignés sans perte d’information." },
    ],
    image: "/landing/zeus.jpg",
    route: "/univers/zeus",
    moduleRoute: "/point-zero",
    menuByMode: {
      couple: [
        { label: "Vue couple", to: "/couple" },
        { label: "Décisions", to: "/budget" },
        { label: "Jour J", to: "/jour-j?role=couple" },
      ],
      guests: [
        { label: "Accueil", to: "/espace-invites" },
        { label: "Programme", to: "/espace-invites" },
        { label: "Infos utiles", to: "/espace-invites" },
      ],
      vendors: [
        { label: "Portail", to: "/prestataires" },
        { label: "Horaires", to: "/jour-j?role=vendors" },
        { label: "Docs", to: "/documents?role=vendors" },
      ],
      planner: [
        { label: "Cockpit", to: "/point-zero" },
        { label: "Alertes", to: "/notifications?role=planner" },
        { label: "Jour J", to: "/jour-j?role=planner" },
      ],
    },
  },
  {
    id: "poseidon",
    label: "Poséidon",
    subtitle: "Ambiance sonore",
    title: "Son, lumière & ambiance",
    visualHook: "L'immersion émotionnelle d'un mariage ne se pilote pas à l'instinct : elle se prépare comme une vague parfaitement tenue.",
    columns: [
      { title: "Pour les mariés", text: "L’ambiance se prépare par séquences, pas par intuition de dernière minute." },
      { title: "Pour les partenaires", text: "DJ, son, lumière et timing lisent tous le même déroulé partagé." },
      { title: "Ce que cela règle", text: "Cocktail, dîner, entrée, ouverture de bal et soirée gardent le bon rythme." },
    ],
    image: "/landing/poseidon.jpg",
    route: "/univers/poseidon",
    moduleRoute: "/prestataires?category=music",
    menuByMode: {
      couple: [
        { label: "Ambiance", to: "/univers/poseidon" },
        { label: "Soirée", to: "/univers/dionysos" },
        { label: "Budget", to: "/budget" },
      ],
      guests: [
        { label: "Programme", to: "/espace-invites" },
        { label: "Soirée", to: "/espace-invites" },
      ],
      vendors: [
        { label: "DJ / son", to: "/prestataires?category=music" },
        { label: "Jour J", to: "/jour-j?role=vendors" },
        { label: "Paiements", to: "/budget" },
      ],
      planner: [
        { label: "Son", to: "/prestataires?category=music" },
        { label: "Cocktail", to: "/jour-j?role=planner" },
        { label: "After", to: "/univers/dionysos" },
      ],
    },
  },
  {
    id: "athena",
    label: "Athéna",
    subtitle: "Planning",
    title: "Stratégie & automatisation",
    visualHook: "La vraie intelligence d'un mariage se joue dans l'anticipation, pas dans l'accumulation de formulaires.",
    columns: [
      { title: "Pour les mariés", text: "Vous voyez ce qui mérite une décision, pas tout le bruit de préparation." },
      { title: "Pour le planner", text: "Rappels, alertes et dépendances se lisent avant de devenir des urgences." },
      { title: "Ce que cela anticipe", text: "Météo, accès, retards, invités et arbitrages sensibles sont remontés plus tôt." },
    ],
    image: "/landing/athena.jpg",
    route: "/univers/athena",
    moduleRoute: "/point-zero?section=reminders",
    menuByMode: {
      couple: [
        { label: "À valider", to: "/couple" },
        { label: "Alertes", to: "/notifications?role=couple" },
      ],
      guests: [
        { label: "Infos utiles", to: "/espace-invites" },
      ],
      vendors: [
        { label: "Tâches", to: "/point-zero?role=vendors" },
        { label: "Docs", to: "/documents?role=vendors" },
      ],
      planner: [
        { label: "Rappels", to: "/point-zero?section=reminders&role=planner" },
        { label: "Alertes", to: "/notifications?role=planner" },
        { label: "Automations", to: "/point-zero?section=automations&role=planner" },
      ],
    },
  },
  {
    id: "aphrodite",
    label: "Aphrodite",
    subtitle: "Esthétique",
    title: "Scénographie & esthétique",
    visualHook: "La beauté du mariage devient plus forte quand elle est cadrée, transmise et relue comme un langage partagé.",
    columns: [
      { title: "Pour les mariés", text: "L’esthétique reste tenue sans se perdre entre captures, messages et validations." },
      { title: "Pour les partenaires", text: "Fleurs, déco, scénographie et implantation partagent la même direction visuelle." },
      { title: "Ce que cela cadre", text: "Ambiance, matières, palette et circulation visuelle du lieu restent cohérentes." },
    ],
    image: "/landing/aphrodite.jpg",
    route: "/univers/aphrodite",
    moduleRoute: "/documents",
    menuByMode: {
      couple: [
        { label: "Inspiration", to: "/univers/aphrodite" },
        { label: "Documents", to: "/documents?role=couple" },
      ],
      guests: [
        { label: "Dress code", to: "/espace-invites" },
      ],
      vendors: [
        { label: "Fleurs & déco", to: "/prestataires?category=flowers-decor" },
        { label: "Documents", to: "/documents?role=vendors" },
        { label: "Plan salle", to: "/documents" },
      ],
      planner: [
        { label: "Moodboard", to: "/univers/aphrodite" },
        { label: "Documents", to: "/documents?role=planner" },
        { label: "Plan salle", to: "/documents" },
      ],
    },
  },
  {
    id: "apollon",
    label: "Apollon",
    subtitle: "Souvenirs",
    title: "Photo, vidéo & souvenirs",
    visualHook: "La mémoire du mariage dépend d'une lumière tenue, d'un rythme juste et de séquences réellement respectées.",
    columns: [
      { title: "Pour les mariés", text: "Les souvenirs gagnent en justesse quand les bons moments sont protégés." },
      { title: "Pour les partenaires", text: "Photo et vidéo savent quand intervenir, où se placer et quoi couvrir." },
      { title: "Ce que cela préserve", text: "Fenêtres de lumière, transitions, captation et galerie finale restent bien tenues." },
    ],
    image: "/landing/apollon.jpg",
    route: "/univers/apollon",
    moduleRoute: "/espace-invites",
    menuByMode: {
      couple: [
        { label: "Souvenirs", to: "/univers/apollon" },
        { label: "Photo / vidéo", to: "/prestataires?category=photo-video" },
      ],
      guests: [
        { label: "Galerie", to: "/espace-invites" },
        { label: "Accès invité", to: "/espace-invites" },
      ],
      vendors: [
        { label: "Équipes image", to: "/prestataires?category=photo-video" },
        { label: "Planning", to: "/jour-j?role=vendors" },
        { label: "Documents", to: "/documents?role=vendors" },
      ],
      planner: [
        { label: "Photo / vidéo", to: "/prestataires?category=photo-video" },
        { label: "Timeline", to: "/jour-j?role=planner" },
        { label: "Galerie", to: "/univers/apollon" },
      ],
    },
  },
  {
    id: "hermes",
    label: "Hermès",
    subtitle: "Communication",
    title: "Communication & diffusion",
    visualHook: "Un mariage se fragilise quand l'information circule mal. Hermès raconte la vitesse, mais surtout la justesse du message.",
    columns: [
      { title: "Pour les mariés", text: "Vous recevez les bonnes informations au bon moment, sans surcharge inutile." },
      { title: "Pour les partenaires", text: "Les échanges restent clairs, tracés et reliés aux pièces réellement utiles." },
      { title: "Ce que cela diffuse", text: "Messages, relances, plans B et documents partagés partent au bon public." },
    ],
    image: "/landing/hermes.jpg",
    route: "/univers/hermes",
    moduleRoute: "/communication",
    menuByMode: {
      couple: [
        { label: "Messages", to: "/communication?role=couple" },
        { label: "Notifications", to: "/notifications?role=couple" },
      ],
      guests: [
        { label: "Infos utiles", to: "/espace-invites" },
        { label: "FAQ", to: "/espace-invites" },
      ],
      vendors: [
        { label: "Messages", to: "/communication?role=vendors" },
        { label: "Docs", to: "/documents?role=vendors" },
        { label: "Portail", to: "/prestataires" },
      ],
      planner: [
        { label: "Centre de diffusion", to: "/communication?role=planner" },
        { label: "Prestataires", to: "/prestataires" },
        { label: "Documents", to: "/documents?role=planner" },
      ],
    },
  },
  {
    id: "ares",
    label: "Arès",
    subtitle: "Jour J",
    title: "Régie terrain & exécution",
    visualHook: "Le terrain n'a rien de poétique quand il déraille. Il doit être précis, rapide et maintenu sans panique.",
    columns: [
      { title: "Pour les mariés", text: "Le terrain reste invisible quand il fonctionne vraiment bien." },
      { title: "Pour les partenaires", text: "Montage, circulation, mobilier et incidents se pilotent sans flottement." },
      { title: "Ce que cela exécute", text: "Implantation, accès, chronologie et check final restent lisibles sous pression." },
    ],
    image: "/landing/ares.jpg",
    route: "/univers/ares",
    moduleRoute: "/jour-j",
    menuByMode: {
      couple: [
        { label: "Jour J", to: "/jour-j?role=couple" },
        { label: "Rassurance", to: "/couple" },
      ],
      guests: [
        { label: "Programme", to: "/espace-invites" },
        { label: "Venir", to: "/espace-invites" },
      ],
      vendors: [
        { label: "Timeline", to: "/jour-j?role=vendors" },
        { label: "Portail", to: "/prestataires" },
        { label: "Documents", to: "/documents?role=vendors" },
      ],
      planner: [
        { label: "Timeline live", to: "/jour-j?role=planner" },
        { label: "Prestataires", to: "/prestataires" },
        { label: "Plan B", to: "/documents" },
      ],
    },
  },
  {
    id: "demeter",
    label: "Déméter",
    subtitle: "Budget",
    title: "Table, service & ressources",
    visualHook: "Le dîner, les régimes, le service et les arbitrages budgétaires forment un même système, pas des sujets séparés.",
    columns: [
      { title: "Pour les mariés", text: "Le dîner se décide avec goût, mais aussi avec cohérence réelle." },
      { title: "Pour les partenaires", text: "Traiteur, régimes, tables et volumes parlent le même langage." },
      { title: "Ce que cela tient", text: "Menus, allergies, service, budget repas et rythme du dîner restent alignés." },
    ],
    image: "/landing/demeter.jpg",
    route: "/univers/demeter",
    moduleRoute: "/budget",
    menuByMode: {
      couple: [
        { label: "Budget", to: "/budget" },
        { label: "Arbitrages", to: "/budget" },
        { label: "Tables", to: "/invites?role=couple" },
      ],
      guests: [
        { label: "Programme", to: "/espace-invites" },
        { label: "Hébergements", to: "/espace-invites" },
      ],
      vendors: [
        { label: "Traiteur", to: "/prestataires?category=catering" },
        { label: "Paiements", to: "/budget" },
        { label: "Invités", to: "/invites?role=vendors" },
      ],
      planner: [
        { label: "Budget", to: "/budget" },
        { label: "Paiements", to: "/budget" },
        { label: "Tables", to: "/invites?role=planner" },
      ],
    },
  },
  {
    id: "artemis",
    label: "Artémis",
    subtitle: "Registre",
    title: "Lieux & espaces",
    visualHook: "Le lieu n'est pas un décor fixe. C'est une matière vivante : accès, météo, flux, accueil, extérieur, repli.",
    columns: [
      { title: "Pour les mariés", text: "Le lieu se choisit pour son usage réel, pas seulement pour sa photo." },
      { title: "Pour les partenaires", text: "Capacité, accès, repli météo et logistique se lisent dès la recherche." },
      { title: "Ce que cela éclaire", text: "Distance, disponibilité, style, circulation et plan B sont visibles plus tôt." },
    ],
    image: "/landing/artemis.jpg",
    route: "/univers/artemis",
    moduleRoute: "/prestataires?category=venue",
    menuByMode: {
      couple: [
        { label: "Lieux", to: "/prestataires?category=venue" },
        { label: "Setup", to: "/setup" },
        { label: "Plan B", to: "/documents" },
      ],
      guests: [
        { label: "Venir", to: "/espace-invites" },
        { label: "Hébergements", to: "/espace-invites" },
        { label: "Navettes", to: "/espace-invites" },
      ],
      vendors: [
        { label: "Lieux", to: "/prestataires?category=venue" },
        { label: "Registre", to: "/prestataires" },
        { label: "Accès", to: "/documents?role=vendors" },
      ],
      planner: [
        { label: "Registre", to: "/prestataires" },
        { label: "Lieux", to: "/prestataires?category=venue" },
        { label: "Setup", to: "/setup" },
      ],
    },
  },
  {
    id: "hephaistos",
    label: "Héphaïstos",
    subtitle: "Supports",
    title: "Outils & supports sur-mesure",
    visualHook: "Quand le mariage demande une fiche, un export, une feuille ou un support spécifique, il faut pouvoir le forger proprement.",
    columns: [
      { title: "Pour les mariés", text: "Les supports restent beaux, lisibles et prêts au bon moment." },
      { title: "Pour les partenaires", text: "Papeterie, exports et feuilles de rôle se fabriquent sans friction." },
      { title: "Ce que cela produit", text: "Faire-part, menus, plans, PDF et rendus finaux sortent au bon format." },
    ],
    image: "/landing/hephaistos.jpg",
    route: "/univers/hephaistos",
    moduleRoute: "/exports",
    menuByMode: {
      couple: [
        { label: "Exports", to: "/exports?view=couple" },
        { label: "Documents", to: "/documents?role=couple" },
      ],
      guests: [
        { label: "Infos utiles", to: "/espace-invites" },
        { label: "FAQ", to: "/espace-invites" },
      ],
      vendors: [
        { label: "Exports", to: "/exports?view=vendors" },
        { label: "Docs", to: "/documents?role=vendors" },
        { label: "Jour J", to: "/jour-j?role=vendors" },
      ],
      planner: [
        { label: "Exports", to: "/exports?view=planner" },
        { label: "Documents", to: "/documents?role=planner" },
        { label: "Feuilles", to: "/exports?view=dayj" },
      ],
    },
  },
  {
    id: "dionysos",
    label: "Dionysos",
    subtitle: "Soirée",
    title: "Fête & soirée",
    visualHook: "La nuit réussie d'un mariage est le résultat d'un enchaînement tenu, pas d'un simple bouton fête.",
    columns: [
      { title: "Pour les mariés", text: "La soirée garde son intensité sans casser le déroulé de la journée." },
      { title: "Pour les partenaires", text: "Animations, bar, ouverture et after se calent sur le vrai tempo." },
      { title: "Ce que cela amplifie", text: "Énergie, programmation, temps forts et fin de soirée restent cohérents." },
    ],
    image: "/landing/dionysos.jpg",
    route: "/univers/dionysos",
    moduleRoute: "/prestataires?category=music",
    menuByMode: {
      couple: [
        { label: "Soirée", to: "/univers/dionysos" },
        { label: "Jour J", to: "/jour-j?role=couple" },
      ],
      guests: [
        { label: "Programme", to: "/espace-invites" },
        { label: "Retour", to: "/espace-invites" },
      ],
      vendors: [
        { label: "DJ / son", to: "/prestataires?category=music" },
        { label: "Jour J", to: "/jour-j?role=vendors" },
        { label: "Paiements", to: "/budget" },
      ],
      planner: [
        { label: "Soirée", to: "/univers/dionysos" },
        { label: "Jour J", to: "/jour-j?role=planner" },
        { label: "Animations", to: "/prestataires?category=music" },
      ],
    },
  },
  {
    id: "hestia",
    label: "Hestia",
    subtitle: "Invités",
    title: "Accueil, famille & transmission",
    visualHook: "Un mariage reste un foyer temporaire : il faut accueillir, rassurer, relier et transmettre l'expérience à toutes les générations.",
    columns: [
      { title: "Pour les mariés", text: "L’accueil reste doux, lisible et humain pour toutes les générations." },
      { title: "Pour les proches", text: "Famille, témoins, enfants et aînés trouvent leur place sans flottement." },
      { title: "Ce que cela protège", text: "RSVP, tables, foyers, hébergements et lien humain du mariage restent tenus." },
    ],
    image: "/landing/hestia.jpg",
    route: "/univers/hestia",
    moduleRoute: "/invites",
    menuByMode: {
      couple: [
        { label: "Invités", to: "/invites?role=couple" },
        { label: "Mini site", to: "/espace-invites" },
        { label: "Tables", to: "/invites?role=couple" },
      ],
      guests: [
        { label: "Accueil", to: "/espace-invites" },
        { label: "RSVP", to: "/espace-invites" },
        { label: "FAQ", to: "/espace-invites" },
      ],
      vendors: [
        { label: "Invités", to: "/invites?role=vendors" },
        { label: "Tables", to: "/invites?role=vendors" },
        { label: "Allergies", to: "/documents?role=vendors" },
      ],
      planner: [
        { label: "Invités", to: "/invites?role=planner" },
        { label: "Foyers", to: "/invites?role=planner" },
        { label: "Tables", to: "/invites?role=planner" },
      ],
    },
  },
];

export function getUniverseById(id) {
  return UNIVERSES.find((item) => item.id === id) || null;
}
