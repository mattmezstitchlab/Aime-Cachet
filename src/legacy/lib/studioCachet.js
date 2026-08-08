import { computeVerificationHash } from "@/lib/verificationHash";

export const STUDIO_CACHE_KEY = "aime_studio_cachet_v2";

export const DEFAULT_PRESTATION = {
  id: "studio-demo",
  date: new Date().toISOString().slice(0, 10),
  employer: "Compagnie Astrale",
  production: "Constellation Tour 2026",
  location: "Paris · La Cartoucherie",
  type: "Artiste",
  annexe: "10",
  status: "brouillon",
  missing_documents: 2,
  amount: 320,
  duration_hours: 7,
  nature: "Répétition générale & représentation",
  sector: "spectacle_vivant",
  employer_contact: "Camille Martin",
  employer_email: "production@astrale.studio",
  employer_phone: "06 12 34 56 78",
  employer_siret: "73282932000074",
  employer_kind: "professionnel",
  custom_notes: "Prévoir l'envoi de l'AEM et du récapitulatif de paiement après validation interne.",
};

export const DEFAULT_LAYOUT = [
  { id: "prestation", label: "Informations prestation", visible: true },
  { id: "employer", label: "Employeur / structure", visible: true },
  { id: "workflow", label: "Chemin administratif", visible: true },
  { id: "documents", label: "Documents à préparer", visible: true },
  { id: "notes", label: "Notes libres", visible: true },
  { id: "legal", label: "Mentions légales", visible: true },
];

export const LANGUAGE_OPTIONS = [
  { id: "fr", label: "Français" },
  { id: "en", label: "English" },
  { id: "es", label: "Español" },
];

export function cloneLayout(layout = DEFAULT_LAYOUT) {
  return layout.map((item) => ({ ...item }));
}

export function moveLayoutItem(layout, index, direction) {
  const target = index + direction;
  if (target < 0 || target >= layout.length) return layout;
  const next = [...layout];
  const [item] = next.splice(index, 1);
  next.splice(target, 0, item);
  return next;
}

export function toggleLayoutItem(layout, id) {
  return layout.map((item) => item.id === id ? { ...item, visible: !item.visible } : item);
}

export function buildStudioSnapshot(state) {
  return JSON.stringify(state);
}

export function readStudioSnapshot() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STUDIO_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveStudioSnapshot(state) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STUDIO_CACHE_KEY, buildStudioSnapshot(state));
}

export function buildPublicPayload(prestation, cachetCode) {
  return {
    cachetCode,
    status: prestation?.status || "brouillon",
    prestationDate: prestation?.date || null,
    employerName: prestation?.employer || null,
    location: prestation?.location || null,
    prestationType: prestation?.type || null,
    sector: prestation?.sector || null,
    annex: prestation?.annexe || null,
  };
}

export async function computeStudioHash(prestation, cachetCode) {
  return computeVerificationHash(buildPublicPayload(prestation, cachetCode));
}

export function validateSiret(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (digits.length !== 14) {
    return { ok: false, message: "Un SIRET doit contenir 14 chiffres." };
  }

  let sum = 0;
  for (let i = 0; i < digits.length; i += 1) {
    let digit = Number(digits[i]);
    if (i % 2 === 0) digit *= 2;
    if (digit > 9) digit -= 9;
    sum += digit;
  }

  const ok = sum % 10 === 0;
  return {
    ok,
    message: ok
      ? "Format SIRET cohérent (contrôle de Luhn OK)."
      : "Le numéro saisi ne passe pas le contrôle de cohérence SIRET.",
  };
}

export const DOCUMENT_COPY = {
  fr: {
    badge: "CACHET",
    documentTitle: "Fiche Cachet — Studio préparatoire",
    documentSubtitle: "Document personnalisable, non opposable, sans valeur officielle.",
    brandTag: "Préparatoire",
    verifyTitle: "Scannez pour vérifier",
    verifyText: "Ce QR mène à une URL de vérification technique privée. Il ne vaut ni déclaration, ni certification officielle.",
    noQrText: "QR masqué dans cette version du document.",
    legalTitle: "Mentions légales",
    footerLeft: "AIME prépare. L'utilisateur vérifie. L'organisme officiel valide.",
    sections: {
      prestation: "A. Informations prestation",
      employer: "B. Employeur / Structure",
      workflow: "C. Chemin administratif conseillé",
      documents: "D. Documents à préparer",
      notes: "E. Notes studio",
    },
    rows: {
      date: "Date",
      duration: "Durée",
      location: "Lieu",
      nature: "Nature",
      role: "Artiste / Technicien",
      sector: "Secteur",
      annexe: "Annexe",
      amount: "Montant brut",
      name: "Nom",
      contact: "Contact",
      email: "Email",
      phone: "Téléphone",
      siret: "SIRET",
      employerKind: "Type d'employeur",
      cachetCode: "Code Cachet",
      createdAt: "Créé le",
      verifyUrl: "URL de vérification",
      hash: "Empreinte SHA-256",
      page: "Page de vérification",
      metadata: "Métadonnées du document",
      verification: "Vérification",
      stamp: "Signature électronique",
      hashHidden: "Hash masqué",
    },
    workflow: [
      ["GUSO", "Si employeur occasionnel du spectacle vivant : déclaration GUSO à vérifier."],
      ["AEM / DUS", "Si employeur professionnel : AEM ou DUS selon la situation."],
      ["CONTRAT", "Conserver contrat, bulletin et justificatifs associés."],
      ["FRANCE TRAVAIL", "Actualiser la situation et archiver les pièces utiles."],
    ],
    docs: [
      "Contrat ou engagement",
      "DPAE si applicable",
      "Déclaration GUSO / AEM / DUS",
      "Bulletin ou justificatif",
      "Preuve de paiement",
      "Coordonnées employeur",
      "Justificatif de prestation",
      "Message employeur préparé",
    ],
    sectorLabels: {
      spectacle_vivant: "Spectacle vivant",
      audiovisuel: "Audiovisuel",
      autre: "Autre",
    },
    employerKindLabels: {
      occasionnel: "Occasionnel",
      professionnel: "Professionnel",
    },
    legalText: "AIME n'est ni mandaté ni affilié à GUSO, France Travail, Urssaf, Audiens ou Pôle emploi Spectacle. Ce document préparatoire privé ne remplace ni une déclaration AEM, ni un contrat de travail, ni une attestation employeur. Les démarches officielles restent à effectuer auprès des organismes compétents. Données éditées par l'utilisateur.",
  },
  en: {
    badge: "STAMP",
    documentTitle: "Performance sheet — studio draft",
    documentSubtitle: "Customizable private draft. Not binding, not official.",
    brandTag: "Draft",
    verifyTitle: "Scan to review",
    verifyText: "This QR points to a private technical verification URL. It is not an official filing or certification.",
    noQrText: "QR hidden in this document version.",
    legalTitle: "Legal notice",
    footerLeft: "AIME prepares. The user reviews. Official bodies decide.",
    sections: {
      prestation: "A. Performance details",
      employer: "B. Employer / company",
      workflow: "C. Suggested admin path",
      documents: "D. Documents to prepare",
      notes: "E. Studio notes",
    },
    rows: {
      date: "Date",
      duration: "Duration",
      location: "Location",
      nature: "Nature",
      role: "Artist / Technician",
      sector: "Sector",
      annexe: "Annex",
      amount: "Gross amount",
      name: "Name",
      contact: "Contact",
      email: "Email",
      phone: "Phone",
      siret: "SIRET",
      employerKind: "Employer type",
      cachetCode: "Cachet code",
      createdAt: "Created at",
      verifyUrl: "Verification URL",
      hash: "SHA-256 fingerprint",
      page: "Verification page",
      metadata: "Document metadata",
      verification: "Verification",
      stamp: "Electronic signature",
      hashHidden: "Hash hidden",
    },
    workflow: [
      ["GUSO", "For occasional live-show employers: review the GUSO filing path."],
      ["AEM / DUS", "For professional employers: review AEM or DUS depending on the case."],
      ["CONTRACT", "Keep contract, payslip and supporting files together."],
      ["AGENCY", "Update your situation and archive useful supporting files."],
    ],
    docs: [
      "Contract or booking note",
      "Pre-hire filing if needed",
      "GUSO / AEM / DUS declaration",
      "Payslip or proof",
      "Payment receipt",
      "Employer contact details",
      "Performance proof",
      "Prepared message to employer",
    ],
    sectorLabels: {
      spectacle_vivant: "Live performance",
      audiovisuel: "Audiovisual",
      autre: "Other",
    },
    employerKindLabels: {
      occasionnel: "Occasional",
      professionnel: "Professional",
    },
    legalText: "AIME is not mandated by or affiliated with GUSO, France Travail, Urssaf, Audiens or any official authority. This private preparatory document does not replace any official filing, employment contract or employer certificate. Users remain responsible for formal steps.",
  },
  es: {
    badge: "SELLO",
    documentTitle: "Ficha de actuación — borrador de estudio",
    documentSubtitle: "Documento privado personalizable. Sin valor oficial.",
    brandTag: "Borrador",
    verifyTitle: "Escanea para revisar",
    verifyText: "Este QR dirige a una URL privada de verificación técnica. No sustituye ningún trámite oficial.",
    noQrText: "QR oculto en esta versión del documento.",
    legalTitle: "Aviso legal",
    footerLeft: "AIME prepara. El usuario revisa. El organismo oficial valida.",
    sections: {
      prestation: "A. Datos de la actuación",
      employer: "B. Empresa / estructura",
      workflow: "C. Ruta administrativa sugerida",
      documents: "D. Documentos a preparar",
      notes: "E. Notas del estudio",
    },
    rows: {
      date: "Fecha",
      duration: "Duración",
      location: "Lugar",
      nature: "Naturaleza",
      role: "Artista / Técnico",
      sector: "Sector",
      annexe: "Anexo",
      amount: "Importe bruto",
      name: "Nombre",
      contact: "Contacto",
      email: "Correo",
      phone: "Teléfono",
      siret: "SIRET",
      employerKind: "Tipo de empleador",
      cachetCode: "Código cachet",
      createdAt: "Creado el",
      verifyUrl: "URL de verificación",
      hash: "Huella SHA-256",
      page: "Página de verificación",
      metadata: "Metadatos del documento",
      verification: "Verificación",
      stamp: "Firma electrónica",
      hashHidden: "Hash oculto",
    },
    workflow: [
      ["GUSO", "Si el empleador es ocasional en artes escénicas: revisar el circuito GUSO."],
      ["AEM / DUS", "Si el empleador es profesional: revisar AEM o DUS según el caso."],
      ["CONTRATO", "Conservar contrato, nómina y justificantes relacionados."],
      ["TRÁMITES", "Actualizar la situación y archivar los documentos útiles."],
    ],
    docs: [
      "Contrato o compromiso",
      "Alta previa si aplica",
      "Declaración GUSO / AEM / DUS",
      "Nómina o justificante",
      "Prueba de pago",
      "Datos del empleador",
      "Justificante de actuación",
      "Mensaje preparado para el empleador",
    ],
    sectorLabels: {
      spectacle_vivant: "Espectáculo en vivo",
      audiovisuel: "Audiovisual",
      autre: "Otro",
    },
    employerKindLabels: {
      occasionnel: "Ocasional",
      professionnel: "Profesional",
    },
    legalText: "AIME no está mandatado ni afiliado a GUSO, France Travail, Urssaf, Audiens ni a ninguna autoridad oficial. Este documento preparatorio privado no sustituye una declaración oficial, un contrato de trabajo ni un certificado del empleador. El usuario sigue siendo responsable de los trámites formales.",
  },
};

export function getDocumentCopy(language = "fr") {
  return DOCUMENT_COPY[language] || DOCUMENT_COPY.fr;
}
