// 🎙️ Mémo guidé pour la capsule vocale.
// Pour chaque doc_type, on liste — DANS L'ORDRE DE LECTURE NATURELLE
// du document — les infos que l'intermittent doit dicter.
// L'utilisateur lit le mémo de haut en bas et parle dans cet ordre :
// AIME extrait ensuite les champs correspondants.

export const VOICE_MEMO_STEPS = {
  cachet: [
    "Date de la prestation",
    "Employeur (nom + SIRET si connu)",
    "Lieu (salle, ville)",
    "Nature (concert, tournage, festival…)",
    "Horaires (début → fin)",
    "Montant brut",
    "Type : artiste ou technicien",
  ],
  devis: [
    "Date du devis",
    "Client / employeur",
    "Lieu prévu",
    "Nature de la prestation",
    "Durée prévue",
    "Montant proposé",
  ],
  honoraires: [
    "Date",
    "Donneur d'ordre",
    "Objet de la mission",
    "Montant honoraires",
    "Mode de règlement",
  ],
  recu: [
    "Date de versement",
    "Employeur / payeur",
    "Objet (cachet, acompte…)",
    "Montant reçu",
  ],
  presence: [
    "Date(s) de présence",
    "Lieu (salle, scène)",
    "Production / spectacle",
    "Horaires de service",
    "Nom des intervenants si pertinent",
  ],
  cession: [
    "Date de la cession",
    "Cédant (artiste/société)",
    "Cessionnaire (organisateur)",
    "Lieu de représentation",
    "Date(s) de représentation",
    "Montant de la cession",
  ],
  frais: [
    "Date du déplacement",
    "Trajet (départ → arrivée)",
    "Motif (concert, répétition…)",
    "Montant total des frais",
  ],
  dpae: [
    "Date d'embauche prévue",
    "Employeur (nom + SIRET)",
    "Lieu de travail",
    "Type de contrat (CDDU…)",
    "Horaires prévus",
  ],
  aem: [
    "Mois concerné",
    "Employeur",
    "Période d'emploi (du → au)",
    "Nombre d'heures / cachets",
    "Salaire brut",
  ],
  att_pe: [
    "Employeur",
    "Date de fin de contrat",
    "Motif de fin",
    "Dernier salaire brut",
    "Heures totales effectuées",
  ],
  guso: [
    "Date de la prestation",
    "Employeur occasionnel",
    "Lieu",
    "Durée de la prestation",
    "Rémunération brute",
  ],
  cdd_u: [
    "Date de signature",
    "Employeur",
    "Salarié (vous-même)",
    "Lieu de travail",
    "Période d'emploi (du → au)",
    "Salaire / cachet",
  ],
  cession_droits: [
    "Date",
    "Œuvre concernée",
    "Cédant (auteur/artiste)",
    "Cessionnaire",
    "Étendue de la cession",
    "Montant",
  ],
  avenant: [
    "Contrat d'origine (date)",
    "Élément modifié",
    "Nouvelle valeur",
    "Date d'effet",
  ],
};

export function getMemoSteps(docType) {
  return VOICE_MEMO_STEPS[docType] || VOICE_MEMO_STEPS.cachet;
}

// Libellé court pour le sélecteur (synchro avec docCatalog mais autonome).
export const VOICE_DOC_OPTIONS = [
  { id: "cachet", label: "Cachet" },
  { id: "devis", label: "Devis" },
  { id: "honoraires", label: "Honoraires" },
  { id: "recu", label: "Reçu" },
  { id: "presence", label: "Présence" },
  { id: "cession", label: "Cession" },
  { id: "frais", label: "Frais" },
  { id: "dpae", label: "DPAE" },
  { id: "aem", label: "AEM" },
  { id: "att_pe", label: "Att. PE" },
  { id: "guso", label: "GUSO" },
  { id: "cdd_u", label: "CDD-U" },
];