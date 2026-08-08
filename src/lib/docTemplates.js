// Catalogue des modèles de documents disponibles dans la palette "+".
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
  // Univers intermittence — générés spécifiquement
  { id: "stage-concert", label: "Scène concert", url: "https://media.base44.com/images/public/6a0dd8978ba6b186fc2a32c5/3d65bac22_generated_image.png" },
  { id: "theatre", label: "Théâtre", url: "https://media.base44.com/images/public/6a0dd8978ba6b186fc2a32c5/6f157365d_generated_image.png" },
  { id: "film-set", label: "Plateau cinéma", url: "https://media.base44.com/images/public/6a0dd8978ba6b186fc2a32c5/e6bed0e1c_generated_image.png" },
  { id: "recording-studio", label: "Studio son", url: "https://media.base44.com/images/public/6a0dd8978ba6b186fc2a32c5/33ac936aa_generated_image.png" },
  // Univers libres
  { id: "floral-bright", label: "Floral coloré", url: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=2000&q=80" },
  { id: "mountain", label: "Montagne fleurie", url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=2000&q=80" },
  { id: "abstract-dark", label: "Vagues sombres", url: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=2000&q=80" },
  // Gradients
  { id: "gradient-warm", label: "Dégradé chaud", url: null, gradient: "linear-gradient(135deg, #ff6b6b, #feca57, #ee5a6f)" },
  { id: "gradient-cool", label: "Dégradé froid", url: null, gradient: "linear-gradient(135deg, #667eea, #764ba2)" },
  { id: "solid-black", label: "Noir uni", url: null, gradient: "#0a0a0a" },
];