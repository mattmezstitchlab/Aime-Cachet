// Catalogue étendu des documents administratifs français.
// Organisé en catégories pour le menu déroulant DocPicker.
import {
  FileText, ScrollText, FileSignature, Receipt, ClipboardList,
  Building2, FileCheck2, FilePen, FileBadge, FileClock, FileSpreadsheet,
  FileBox, FileStack, FileInput, FileOutput, FileHeart,
  Music2, Wallet, Landmark, FileSignature as Contract,
} from "lucide-react";

// Catégories de documents
export const DOC_CATEGORIES = [
  {
    id: "spectacle",
    label: "Spectacle vivant",
    icon: Music2,
    docs: [
      { id: "cachet", label: "Fiche Cachet", description: "Fiche récapitulative", icon: FileText, ready: true },
      { id: "presence", label: "Feuille de présence", description: "Émargement sur scène", icon: ClipboardList, ready: true },
      { id: "cession", label: "Convention de cession", description: "Cession de droits artistiques", icon: FileSignature, ready: true },
    ],
  },
  {
    id: "facturation",
    label: "Facturation",
    icon: Wallet,
    docs: [
      { id: "devis", label: "Devis artiste", description: "Devis pour prestation", icon: ScrollText, ready: true },
      { id: "honoraires", label: "Note d'honoraires", description: "Pour artiste-auteur (MdA / Urssaf)", icon: FileSignature, ready: true },
      { id: "recu", label: "Reçu de cachet", description: "Reçu de versement", icon: Receipt, ready: true },
      { id: "frais", label: "Note de frais", description: "Remboursement déplacements", icon: FileInput, ready: true },
    ],
  },
  {
    id: "declarations",
    label: "Déclarations",
    icon: Landmark,
    docs: [
      { id: "dpae", label: "DPAE", description: "Déclaration préalable embauche", icon: FileBadge, ready: true },
      { id: "aem", label: "AEM", description: "Attestation employeur mensuelle", icon: FileCheck2, ready: true },
      { id: "att_pe", label: "Attestation Pôle Emploi", description: "Attestation employeur fin contrat", icon: FileOutput, ready: true },
      { id: "guso", label: "Déclaration GUSO", description: "Guichet unique du spectacle", icon: FileSpreadsheet, ready: true },
    ],
  },
  {
    id: "contrats",
    label: "Contrats",
    icon: Contract,
    docs: [
      { id: "cdd_u", label: "CDD d'usage", description: "Contrat à durée déterminée d'usage", icon: FilePen, ready: true },
      { id: "cession_droits", label: "Contrat de cession", description: "Cession de droits voisins", icon: FileStack, ready: true },
      { id: "avenant", label: "Avenant", description: "Modification de contrat", icon: FileBox, ready: true },
    ],
  },
];

// Helper : trouver un doc par id
export function findDoc(docId) {
  for (const cat of DOC_CATEGORIES) {
    const doc = cat.docs.find((d) => d.id === docId);
    if (doc) return { ...doc, category: cat };
  }
  return null;
}

// Formats papier disponibles
export const PAPER_FORMATS = [
  { id: "a4", label: "A4", subtitle: "210 × 297 mm", width: 794, height: 1123 },
  { id: "a5", label: "A5", subtitle: "148 × 210 mm", width: 559, height: 794 },
  { id: "ticket", label: "Ticket", subtitle: "80 mm", width: 302, height: 600 },
  { id: "card", label: "Carte", subtitle: "85 × 55 mm", width: 322, height: 208 },
];

// Polices disponibles
export const FONT_PRESETS = [
  { id: "inter", label: "Inter", subtitle: "Moderne", css: "Inter, system-ui, sans-serif" },
  { id: "bebas", label: "Bebas", subtitle: "Affiche", css: "'Bebas Neue', sans-serif" },
  { id: "playfair", label: "Playfair", subtitle: "Élégant", css: "'Playfair Display', serif" },
  { id: "mono", label: "Mono", subtitle: "Technique", css: "'JetBrains Mono', 'Courier New', monospace" },
  { id: "caveat", label: "Caveat", subtitle: "Manuscrit", css: "'Caveat', cursive" },
];

// Palette de couleurs d'accent
export const ACCENT_COLORS = [
  { id: "red", label: "AIME", value: "#E60012" },
  { id: "black", label: "Encre", value: "#0F0F0F" },
  { id: "blue", label: "Marine", value: "#1E40AF" },
  { id: "emerald", label: "Émeraude", value: "#059669" },
  { id: "amber", label: "Ambre", value: "#D97706" },
  { id: "violet", label: "Violet", value: "#7C3AED" },
  { id: "rose", label: "Rose", value: "#E11D48" },
  { id: "slate", label: "Ardoise", value: "#475569" },
];

// Filigranes prédéfinis
export const WATERMARK_PRESETS = [
  { id: "none", label: "Aucun" },
  { id: "prep", label: "PRÉPARATOIRE" },
  { id: "brouillon", label: "BROUILLON" },
  { id: "copie", label: "COPIE" },
  { id: "specimen", label: "SPÉCIMEN" },
];