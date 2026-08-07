// Bibliothèque visuelle du Studio Cachet.
import { FileText, Receipt, FileSignature, ScrollText } from "lucide-react";

export const DOC_TEMPLATES = [
  {
    id: "cachet",
    label: "Fiche Cachet",
    description: "Fiche récapitulative d'une prestation",
    icon: FileText,
  },
  {
    id: "devis",
    label: "Devis artiste",
    description: "Devis pour prestation artistique",
    icon: ScrollText,
  },
  {
    id: "honoraires",
    label: "Note d'honoraires",
    description: "Pour artiste-auteur (MdA / Urssaf Limousin)",
    icon: FileSignature,
  },
  {
    id: "recu",
    label: "Reçu de cachet",
    description: "Reçu de versement signé",
    icon: Receipt,
  },
];

export const FICHE_BACKGROUNDS = [
  // Univers scène
  { id: "stage-concert", label: "Scène concert", category: "scène", url: "https://media.base44.com/images/public/6a0dd8978ba6b186fc2a32c5/3d65bac22_generated_image.png" },
  { id: "theatre", label: "Théâtre", category: "scène", url: "https://media.base44.com/images/public/6a0dd8978ba6b186fc2a32c5/6f157365d_generated_image.png" },
  { id: "film-set", label: "Plateau cinéma", category: "scène", url: "https://media.base44.com/images/public/6a0dd8978ba6b186fc2a32c5/e6bed0e1c_generated_image.png" },
  { id: "recording-studio", label: "Studio son", category: "scène", url: "https://media.base44.com/images/public/6a0dd8978ba6b186fc2a32c5/33ac936aa_generated_image.png" },
  { id: "red-curtain", label: "Rideau rouge", category: "scène", url: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=1600&q=80&auto=format&fit=crop" },
  { id: "spotlights", label: "Projecteurs", category: "scène", url: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1600&q=80&auto=format&fit=crop" },
  { id: "backstage", label: "Backstage", category: "scène", url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1600&q=80&auto=format&fit=crop" },

  // Univers éditorial
  { id: "floral-bright", label: "Floral coloré", category: "éditorial", url: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1600&q=80&auto=format&fit=crop" },
  { id: "mountain", label: "Montagne fleurie", category: "éditorial", url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1600&q=80&auto=format&fit=crop" },
  { id: "linen-paper", label: "Papier lin", category: "éditorial", gradient: "linear-gradient(135deg, #f7f1e5 0%, #e9dfc9 100%)" },
  { id: "parchment", label: "Parchemin", category: "éditorial", gradient: "linear-gradient(135deg, #f5ecd9 0%, #d8c3a5 100%)" },
  { id: "ice-paper", label: "Papier glacier", category: "éditorial", gradient: "linear-gradient(135deg, #f7fbff 0%, #d8e9ff 100%)" },

  // Abstrait / néon
  { id: "abstract-dark", label: "Vagues sombres", category: "abstrait", url: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=1600&q=80&auto=format&fit=crop" },
  { id: "gradient-warm", label: "Dégradé chaud", category: "abstrait", gradient: "linear-gradient(135deg, #ff6b6b, #feca57, #ee5a6f)" },
  { id: "gradient-cool", label: "Dégradé froid", category: "abstrait", gradient: "linear-gradient(135deg, #667eea, #764ba2)" },
  { id: "aurora", label: "Aurore", category: "abstrait", gradient: "linear-gradient(135deg, #00c6ff 0%, #0072ff 45%, #8e2de2 100%)" },
  { id: "sunset-grid", label: "Sunset grid", category: "abstrait", gradient: "linear-gradient(135deg, #ff7a18 0%, #ffb199 45%, #7c3aed 100%)" },
  { id: "emerald-mist", label: "Brume émeraude", category: "abstrait", gradient: "linear-gradient(135deg, #052e2b 0%, #0f766e 45%, #99f6e4 100%)" },
  { id: "night-violet", label: "Nuit violette", category: "abstrait", gradient: "linear-gradient(135deg, #09090b 0%, #312e81 45%, #c084fc 100%)" },

  // Minimal
  { id: "solid-black", label: "Noir uni", category: "minimal", gradient: "#0a0a0a" },
  { id: "soft-ivory", label: "Ivoire", category: "minimal", gradient: "#f8f5ef" },
  { id: "soft-slate", label: "Ardoise douce", category: "minimal", gradient: "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)" },
  { id: "studio-grey", label: "Gris studio", category: "minimal", gradient: "linear-gradient(135deg, #f4f4f5 0%, #d4d4d8 100%)" },
];