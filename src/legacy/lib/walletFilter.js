// Helper de filtrage des prestations selon un wallet sélectionné dans la timeline.
import { SMART_WALLETS } from "@/lib/wallets";

export function filterPrestationsByWallet(prestations, walletKey) {
  if (!walletKey || walletKey === "smart:all") return prestations;
  // Smart wallet
  if (walletKey.startsWith("smart:")) {
    const sw = SMART_WALLETS.find((w) => w.id === walletKey);
    if (!sw) return prestations;
    return prestations.filter(sw.match);
  }
  // Wallet perso (id direct)
  return prestations.filter((p) => p.wallet_id === walletKey);
}