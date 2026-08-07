// Wallets intelligents prédéfinis (calculés à la volée, non persistés)
// Ils filtrent la liste des prestations selon des règles automatiques.

export const SMART_WALLETS = [
  {
    id: "smart:all",
    name: "Toutes les fiches",
    icon: "Files",
    color: "#18181b",
    smart: true,
    match: () => true,
  },
  {
    id: "smart:year",
    name: "Cette année",
    icon: "CalendarDays",
    color: "#0ea5e9",
    smart: true,
    match: (p) => {
      if (!p.date) return false;
      const y = new Date(p.date).getFullYear();
      return y === new Date().getFullYear();
    },
  },
  {
    id: "smart:todo",
    name: "À transmettre",
    icon: "Hourglass",
    color: "#f59e0b",
    smart: true,
    match: (p) => p.status === "pret_a_verifier" || p.status === "a_completer",
  },
  {
    id: "smart:transmis",
    name: "Transmis",
    icon: "Send",
    color: "#8b5cf6",
    smart: true,
    match: (p) => p.status === "transmis",
  },
  {
    id: "smart:valide",
    name: "Validé",
    icon: "CheckCircle2",
    color: "#10b981",
    smart: true,
    match: (p) => p.status === "valide",
  },
  {
    id: "smart:spectacle",
    name: "Spectacle vivant",
    icon: "Drama",
    color: "#ef4444",
    smart: true,
    match: (p) => p.sector === "spectacle_vivant",
  },
  {
    id: "smart:audiovisuel",
    name: "Audiovisuel",
    icon: "Clapperboard",
    color: "#6366f1",
    smart: true,
    match: (p) => p.sector === "audiovisuel",
  },
  {
    id: "smart:unsorted",
    name: "Non rangées",
    icon: "Inbox",
    color: "#71717a",
    smart: true,
    match: (p) => !p.wallet_id,
  },
];

// Palette de couleurs disponibles pour wallets perso
export const WALLET_COLORS = [
  "#ef4444", "#f59e0b", "#10b981", "#0ea5e9",
  "#6366f1", "#8b5cf6", "#ec4899", "#71717a",
];

// Pictos Lucide disponibles pour wallets perso (noms = clés Lucide)
export const WALLET_ICONS = [
  "Folder", "Music2", "Drama", "Clapperboard",
  "Mic2", "Palette", "Tent", "Ticket",
  "CalendarDays", "Briefcase", "Landmark", "MapPin",
  "Star", "Flame", "Gem", "Sparkles",
];

// Filtre prestations par wallet (smart ou perso)
export function filterByWallet(prestations, walletId, smartWalletId) {
  if (smartWalletId) {
    const sw = SMART_WALLETS.find((w) => w.id === smartWalletId);
    if (!sw) return prestations;
    return prestations.filter(sw.match);
  }
  if (walletId === "__unsorted__") {
    return prestations.filter((p) => !p.wallet_id);
  }
  if (walletId) {
    return prestations.filter((p) => p.wallet_id === walletId);
  }
  return prestations;
}